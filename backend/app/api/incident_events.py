from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.incident import Incident
from app.models.incident_event import IncidentEvent
from app.models.user import User
from app.schemas.incident_event import (
    IncidentEventCreate,
    IncidentEventResponse,
)


router = APIRouter(
    prefix="/api/incidents",
    tags=["Incident Events"],
)


@router.post(
    "/{incident_id}/events",
    response_model=IncidentEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_incident_event(
    incident_id: int,
    event_data: IncidentEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    incident = db.get(Incident, incident_id)

    if incident is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident not found",
        )

    event = IncidentEvent(
        incident_id=incident_id,
        event_type=event_data.event_type,
        payload=event_data.payload,
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.get(
    "/{incident_id}/events",
    response_model=list[IncidentEventResponse],
)
def list_incident_events(
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

    return (
        db.query(IncidentEvent)
        .filter(
            IncidentEvent.incident_id == incident_id
        )
        .order_by(
            IncidentEvent.created_at.asc()
        )
        .all()
    )