from fastapi import APIRouter
from app.api.routes import health, version

api_router = APIRouter()

# Registering system endpoints under standard prefixes
api_router.include_router(health.router, prefix="/health", tags=["System"])
api_router.include_router(version.router, prefix="/version", tags=["System"])
