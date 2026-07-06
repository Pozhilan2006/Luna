from fastapi import APIRouter

router = APIRouter()

@router.get("", response_model=dict)
def check_health():
    """
    Perform a health check verification. Returns {"status": "ok"} on success.
    """
    return {"status": "ok"}
