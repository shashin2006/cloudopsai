from datetime import datetime

from pydantic import BaseModel, ConfigDict


class IncidentCreate(BaseModel):
    service_id: int
    title: str
    description: str | None = None
    severity: str
    status: str = "open"
    started_at: datetime


class IncidentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    severity: str | None = None
    status: str | None = None
    started_at: datetime | None = None
    resolved_at: datetime | None = None


class IncidentResponse(BaseModel):
    id: int
    service_id: int
    title: str
    description: str | None
    severity: str
    status: str
    started_at: datetime
    resolved_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)