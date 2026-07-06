import os
import logging
from logging.handlers import RotatingFileHandler
from app.config.settings import get_settings

def setup_logging() -> None:
    """
    Initializes application-wide logging with handlers for both
    the console and a rotating log file inside the logs/ directory.
    """
    settings = get_settings()
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    # Ensure logs directory exists
    os.makedirs("./logs", exist_ok=True)
    
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    
    # Prevent handler duplication
    if root_logger.hasHandlers():
        root_logger.handlers.clear()
        
    # Standard format for logs
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
    )
    
    # Console logging handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # Rotating File logging handler (Max 10MB per file, keeping 5 backups)
    file_handler = RotatingFileHandler(
        filename="./logs/luna.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)
    
    # Log levels for internal framework libraries
    logging.getLogger("uvicorn.error").setLevel(log_level)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    logger = logging.getLogger(__name__)
    logger.info("Logging successfully initialized. Log Level: %s", settings.LOG_LEVEL)
