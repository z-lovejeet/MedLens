"""MedLens FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from core.config import settings
from api.routes import router
from api.middleware import rate_limit_middleware, global_exception_handler
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(
    title="MedLens API",
    description="AI-powered medical report analysis",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
app.add_middleware(BaseHTTPMiddleware, dispatch=rate_limit_middleware)

# Global exception handler (warm error responses instead of raw stack traces)
app.add_exception_handler(Exception, global_exception_handler)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
