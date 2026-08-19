from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.incident import Incident
from app.models.incident_event import IncidentEvent
from app.models.log import Log
from app.models.user import User
from app.schemas.ai_analysis import AIAnalysisResponse
from app.services.ai_analysis_service import (
    generate_incident_analysis,
)


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Analysis"],
)


@router.post(
    "/incidents/{incident_id}/analyze",
    response_model=AIAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
def analyze_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incident = db.get(Incident, incident_id)

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )
    log_query = db.query(Log).filter(Log.service_id == incident.service_id).filter(Log.timestamp >= incident.started_at)
    if incident.resolved_at:
        log_query = log_query.filter(
            Log.timestamp <= incident.resolved_at
        )

    logs = (
        log_query
        .order_by(Log.timestamp.asc()) 
        .all()
    )

    events = (
        db.query(IncidentEvent)
        .filter(
            IncidentEvent.incident_id == incident_id
        )
        .order_by(
            IncidentEvent.created_at.asc()
        )
        .all()
    )

    analysis = generate_incident_analysis(
        incident=incident,
        logs=logs,
        events=events,
        db=db,
    )

    return analysis