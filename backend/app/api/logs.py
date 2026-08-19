from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.log import Log
from app.models.service import Service
from app.models.user import User
from app.schemas.log import LogCreate, LogResponse


router = APIRouter(
    prefix="/api/logs",
    tags=["Logs"],
)


@router.post(
    "",
    response_model=LogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_log(
    log_data: LogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = db.get(Service, log_data.service_id)

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    log = Log(
        service_id=log_data.service_id,
        level=log_data.level,
        message=log_data.message,
        source=log_data.source,
        log_metadata=log_data.log_metadata,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


@router.get(
    "",
    response_model=list[LogResponse],
)
def list_logs(
    service_id: int | None = Query(default=None),
    level: str | None = Query(default=None),
    source: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Log)

    if service_id is not None:
        query = query.filter(
            Log.service_id == service_id
        )

    if level is not None:
        query = query.filter(
            Log.level == level
        )

    if source is not None:
        query = query.filter(
            Log.source == source
        )

    return query.order_by(
        Log.timestamp.desc()
    ).all()


@router.get(
    "/{log_id}",
    response_model=LogResponse,
)
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = db.get(Log, log_id)

    if log is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found",
        )

    return log