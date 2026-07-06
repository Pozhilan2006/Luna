import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.core.logging import setup_logging
from app.api.routes.router import api_router

# Setup logging configuration on initial import
setup_logging()
logger = logging.getLogger("app.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Asynchronous context manager to manage application startup and shutdown lifecycle events.
    Replaces deprecated startup/shutdown event handlers.
    """
    logger.info("Initializing Luna backend services...")
    # Add any startup integrations (e.g. cache setup, DB check, Ollama check) here
    yield
    logger.info("Cleaning up and closing Luna backend services...")
    # Add shutdown cleanups here

def create_app() -> FastAPI:
    """
    Application factory to instantiate, configure, and return the FastAPI application instance.
    Prevents global state issues and facilitates testing.
    """
    settings = get_settings()
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Production-grade local AI desktop assistant backend foundation for Luna.",
        lifespan=lifespan
    )
    
    # Configure CORS for local Electron (localhost) and browser development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Tailored for local dev environment; scope down in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Register consolidated API router directly at the root (registers /health and /version)
    app.include_router(api_router)
    
    # Global exception handler for uncaught runtime errors
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(
            "Unhandled exception occurred at path %s: %s", 
            request.url.path, 
            str(exc), 
            exc_info=True
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An internal server error occurred."}
        )
        
    return app

# Instantiate application for ASGI runner (Uvicorn)
app = create_app()
