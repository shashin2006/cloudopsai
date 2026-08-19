import json

from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.ai_analysis import AIAnalysis
from app.models.incident import Incident
from app.models.incident_event import IncidentEvent
from app.models.log import Log


client = OpenAI(
    base_url=settings.NVIDIA_BASE_URL,
    api_key=settings.NVIDIA_API_KEY,
)


def generate_incident_analysis(
    incident: Incident,
    logs: list[Log],
    events: list[IncidentEvent],
    db: Session,
) -> AIAnalysis:

    log_context = [
        {
            "timestamp": log.timestamp.isoformat(),
            "level": log.level,
            "message": log.message,
            "source": log.source,
            "metadata": log.log_metadata,
        }
        for log in logs
    ]

    event_context = [
        {
            "event_type": event.event_type,
            "payload": event.payload,
            "created_at": event.created_at.isoformat(),
        }
        for event in events
    ]

    prompt = f"""
You are an expert Site Reliability Engineer (SRE)
performing incident analysis.

Analyze the following CloudOpsAI incident.

INCIDENT
Title: {incident.title}
Description: {incident.description}
Severity: {incident.severity}
Status: {incident.status}
Started At: {incident.started_at.isoformat()}
Resolved At: {
        incident.resolved_at.isoformat()
        if incident.resolved_at
        else "Not resolved"
    }

LOGS
{json.dumps(log_context, indent=2, default=str)}

INCIDENT TIMELINE
{json.dumps(event_context, indent=2, default=str)}

Return ONLY valid JSON with this exact structure:

{{
  "summary": "Clear concise incident summary",
  "root_cause": "Most likely root cause based only on the evidence",
  "evidence": [
    {{
      "type": "log or event",
      "source": "source identifier",
      "message": "Relevant evidence"
    }}
  ],
  "confidence": 0.0,
  "recommended_actions": [
    "Action 1",
    "Action 2",
    "Action 3"
  ]
}}

Rules:

1. Do not invent evidence.
2. Use only the supplied incident, logs and events.
3. If the root cause cannot be determined, explicitly say so.
4. Confidence must be between 0.0 and 1.0.
5. Keep recommendations practical for an SRE team.
6. Return JSON only.
"""

    completion = client.chat.completions.create(
        model=settings.NVIDIA_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a production incident "
                    "analysis assistant."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
        top_p=0.7,
        max_tokens=2048,
        stream=False,
    )

    content = completion.choices[0].message.content

    if not content:
        raise RuntimeError(
            "NVIDIA returned an empty response"
        )

    try:
        result = json.loads(content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"NVIDIA returned invalid JSON: {content}"
        ) from exc

    confidence = float(
        result.get("confidence", 0.0)
    )

    confidence = max(
        0.0,
        min(1.0, confidence)
    )

    analysis = AIAnalysis(
        incident_id=incident.id,
        summary=result["summary"],
        root_cause=result["root_cause"],
        evidence=result.get("evidence"),
        confidence=confidence,
        recommended_actions=result.get(
            "recommended_actions"
        ),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis