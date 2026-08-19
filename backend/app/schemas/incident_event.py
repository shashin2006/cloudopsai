from datetime import datetime

from pydantic import BaseModel, ConfigDict


class IncidentEventCreate(BaseModel):
    event_type: str
    payload: dict | None = None


class IncidentEventResponse(BaseModel):
    id: int
    incident_id: int
    event_type: str
    payload: dict | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)