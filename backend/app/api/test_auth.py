from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/test",
    tags=["Authentication Test"]
)


@router.get("/protected")
def protected_route(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "You are authenticated",
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }