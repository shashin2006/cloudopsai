from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AIAnalysisResponse(BaseModel):
    id: int
    incident_id: int
    summary: str
    root_cause: str
    evidence: list | None
    confidence: float
    recommended_actions: list | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIAnalysisRequest(BaseModel):
    incident_id: int