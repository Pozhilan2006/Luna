import os
from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config.settings import get_settings

settings = get_settings()

# SQLite requires different connection arguments for multi-threading
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Ensure storage directory exists if Sqlite DB is used locally
if settings.DATABASE_URL.startswith("sqlite:///./storage"):
    os.makedirs("./storage", exist_ok=True)

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    echo=(settings.LOG_LEVEL.upper() == "DEBUG")
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to yield database sessions for requests.
    Cleans up and closes the connection when the request lifecycle ends.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
