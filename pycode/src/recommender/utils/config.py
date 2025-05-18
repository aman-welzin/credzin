import os
from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Neo4j settings
    NEO4J_URI: str = os.getenv("_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("_PASSWORD", "password")
    
    # LLM settings
    LLM_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL: str = "llama3.2"
    LLM_TEMPERATURE: float = 0.0
    
    # Cache settings
    CACHE_SIZE: int = 100
    CACHE_TTL: int = 3600  # 1 hour
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create a global settings instance
settings = Settings() 