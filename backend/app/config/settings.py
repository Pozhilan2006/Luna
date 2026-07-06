from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Settings class to load, validate, and access application environment variables.
    Utilizes Pydantic settings management for type safety.
    """
    # Application Metadata
    APP_NAME: str = "Luna Backend"
    APP_VERSION: str = "0.1.0"
    
    # Server configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite:///./storage/luna.db"
    
    # AI Engine settings
    OLLAMA_HOST: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "phi4-mini"
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    
    # Environment & Logging
    LOG_LEVEL: str = "INFO"
    
    # Load configuration from .env file
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

@lru_cache
def get_settings() -> Settings:
    """
    Cached settings getter to prevent reloading the environment file repeatedly.
    """
    return Settings()
