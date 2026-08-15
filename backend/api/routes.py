"""MedLens API — Route definitions.

Endpoints:
  GET  /api/health   → Live health check
  POST /api/analyze   → Stub (returns 501 until Phase 3)
  POST /api/chat      → Stub (returns 501 until Phase 3)
"""

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse

from api.schemas import (
    HealthResponse,
    ChatRequest,
    ChatResponse,
    ErrorResponse,
)
from core.config import settings

router = APIRouter(prefix="/api")

# ─── Allowed MIME types per kind ─────────────────────────────

BLOOD_MIMES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
}

XRAY_MIMES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
}


# ─── GET /api/health ─────────────────────────────────────────

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check for deployment verification and frontend connection test."""
    return HealthResponse(
        status="ok",
        version="1.0.0",
        models={
            "gemini": bool(settings.GEMINI_API_KEY),
            "groq": bool(settings.GROQ_API_KEY),
        },
    )


# ─── POST /api/analyze ──────────────────────────────────────

@router.post("/analyze")
async def analyze_report(
    file: UploadFile = File(...),
    kind: str = Form(...),
):
    """Upload a medical report or X-ray for AI analysis.

    Currently returns 501 — pipeline not yet implemented (Phase 3).
    Validation is live: bad file types → 422, oversized files → 422.
    """

    # Validate kind
    if kind not in ("blood", "xray"):
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="invalid_kind",
                message="We support 'blood' and 'xray' — could you try again?",
                detail=f"Received: '{kind}'. Expected: 'blood' or 'xray'",
            ).model_dump(),
        )

    # Validate MIME type
    allowed = BLOOD_MIMES if kind == "blood" else XRAY_MIMES
    content_type = file.content_type or ""
    if content_type not in allowed:
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="invalid_file_type",
                message="We can read PDFs and images (PNG, JPG, WebP). Could you try one of those?",
                detail=f"Received: {content_type}. Expected: {', '.join(sorted(allowed))}",
            ).model_dump(),
        )

    # Validate file size
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_FILE_SIZE:
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="file_too_large",
                message="That file is a bit large for us (max 10MB). Could you try a smaller one?",
                detail=f"Received: {len(file_bytes)} bytes. Max: {settings.MAX_FILE_SIZE} bytes",
            ).model_dump(),
        )

    # ── Stub response (replaced in Phase 3) ──
    return JSONResponse(
        status_code=501,
        content=ErrorResponse(
            error="not_implemented",
            message="Analysis pipeline is coming soon! Check back after Phase 3 🚧",
            detail="Pipeline not yet implemented",
        ).model_dump(),
    )


# ─── POST /api/chat ──────────────────────────────────────────

@router.post("/chat")
async def chat_with_results(request: ChatRequest):
    """Chat about analysis results.

    Currently returns 501 — chat agent not yet implemented (Phase 3).
    Pydantic auto-validates the request body.
    """
    return JSONResponse(
        status_code=501,
        content=ErrorResponse(
            error="not_implemented",
            message="Chat is coming soon! Check back after Phase 3 🚧",
            detail="Chat agent not yet implemented",
        ).model_dump(),
    )
