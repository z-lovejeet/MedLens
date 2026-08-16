"""Application settings loaded from environment variables."""

import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class Settings:
    """Centralized configuration — single source of truth for all env vars."""

    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Model Names
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()
    ]

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Limits
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ANALYSIS_TIMEOUT: int = 90             # seconds
    CHAT_TIMEOUT: int = 25                 # seconds
    RATE_LIMIT_ANALYZE: int = 10           # per minute per IP
    RATE_LIMIT_CHAT: int = 30              # per minute per IP


settings = Settings()

if not settings.GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY is not set — Gemini model calls will fail")
if not settings.GROQ_API_KEY:
    logger.warning("GROQ_API_KEY is not set — Groq model calls will fail")
