from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServiceCreate(BaseModel):
    name: str
    environment: str = "development"
    owner_id: int
    health_status: str = "unknown"


class ServiceUpdate(BaseModel):
    name: str | None = None
    environment: str | None = None
    owner_id: int | None = None
    health_status: str | None = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    environment: str
    owner_id: int
    health_status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)