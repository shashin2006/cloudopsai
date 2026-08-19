from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LogCreate(BaseModel):
    service_id: int
    level: str
    message: str
    source: str
    log_metadata: dict | None = None


class LogResponse(BaseModel):
    id: int
    service_id: int
    timestamp: datetime
    level: str
    message: str
    source: str
    log_metadata: dict | None = None

    model_config = ConfigDict(from_attributes=True)