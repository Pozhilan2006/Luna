from fastapi import APIRouter, Depends
from app.config.settings import Settings, get_settings

router = APIRouter()

@router.get("", response_model=dict)
def get_version(settings: Settings = Depends(get_settings)):
    """
    Retrieves the current metadata, title, and version of the Luna backend.
    """
    return {
        "title": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
