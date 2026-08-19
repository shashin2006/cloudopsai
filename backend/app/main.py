from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.test_auth import router as test_auth_router
from app.api.services import router as services_router
from app.api.logs import router as logs_router
from app.api.incidents import router as incidents_router
from app.api.incident_events import router as incident_events_router
from app.api.ai_analysis import router as ai_analysis_router

app = FastAPI(
    title="CloudOpsAI API"
)


app.include_router(auth_router)
app.include_router(test_auth_router)
app.include_router(services_router)
app.include_router(logs_router)
app.include_router(incidents_router)
app.include_router(incident_events_router)
app.include_router(ai_analysis_router)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "cloudopsai-backend"
    }