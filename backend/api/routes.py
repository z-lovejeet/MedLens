"""MedLens API — Route definitions.

Endpoints:
  GET  /api/health   → Live health check
  POST /api/analyze   → Full LangGraph pipeline (blood + xray)
  POST /api/chat      → Chat agent for follow-up questions
"""

import asyncio
from typing import Union

from fastapi import APIRouter, File, Form, UploadFile, Request
from fastapi.responses import JSONResponse

from api.schemas import (
    HealthResponse,
    BloodAnalysisResponse,
    XRayAnalysisResponse,
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

@router.post(
    "/analyze",
    response_model=Union[BloodAnalysisResponse, XRayAnalysisResponse],
    responses={
        422: {"model": ErrorResponse, "description": "Validation error"},
        504: {"model": ErrorResponse, "description": "Analysis timeout"},
        500: {"model": ErrorResponse, "description": "Pipeline error"},
    },
)
async def analyze_report(
    request: Request,
    file: UploadFile = File(...),
    kind: str = Form(...),
):
    """Upload a medical report or X-ray for AI analysis.

    Runs the full LangGraph pipeline:
      Blood: OCR → Parser → Explainer → Wellness
      X-Ray: XRay Vision → Explainer → Wellness
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

    # Early size check from Content-Length header (if available)
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.MAX_FILE_SIZE + 1024:  # small buffer for multipart overhead
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="file_too_large",
                message=f"File exceeds the {settings.MAX_FILE_SIZE // (1024*1024)}MB size limit.",
                detail=f"Received via header: {content_length} bytes. Max: {settings.MAX_FILE_SIZE} bytes"
            ).model_dump()
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

    # ── Run the LangGraph pipeline ──
    from graph.pipeline import pipeline

    initial_state = {
        "file_bytes": file_bytes,
        "file_type": kind,
        "extracted_text": "",
        "patient": {},
        "metrics": [],
        "findings": [],
        "summary": {},
        "conditions": [],
        "questions": [],
        "recommendations": [],
        "wellness": {},
        "error": None,
    }

    try:
        result = await asyncio.wait_for(
            pipeline.ainvoke(initial_state),
            timeout=settings.ANALYSIS_TIMEOUT,
        )
    except asyncio.TimeoutError:
        return JSONResponse(
            status_code=504,
            content=ErrorResponse(
                error="timeout",
                message="That's taking longer than usual. Want to give it another try? 🌀",
                detail=f"Analysis exceeded {settings.ANALYSIS_TIMEOUT} second timeout",
            ).model_dump(),
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="internal_error",
                message="Something unexpected happened. Try again — we're working on it 💚",
                detail=str(e),
            ).model_dump(),
        )

    # Check for pipeline errors
    if result.get("error"):
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="pipeline_error",
                message=result["error"],
            ).model_dump(),
        )

    # Build typed response matching frontend interface
    try:
        if kind == "blood":
            return BloodAnalysisResponse(
                kind="blood",
                patient=result["patient"],
                summary=result["summary"],
                metrics=result["metrics"],
                conditions=result["conditions"],
                recommendations=result["recommendations"],
                questions=result["questions"],
                wellness=result["wellness"],
            )
        else:
            return XRayAnalysisResponse(
                kind="xray",
                patient=result["patient"],
                summary=result["summary"],
                findings=result["findings"],
                conditions=result["conditions"],
                recommendations=result["recommendations"],
                questions=result["questions"],
                wellness=result["wellness"],
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="response_validation",
                message="We got results but had trouble formatting them. Please try again 💚",
                detail=str(e),
            ).model_dump(),
        )


# ─── POST /api/chat ──────────────────────────────────────────

@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={
        504: {"model": ErrorResponse, "description": "Chat timeout"},
        500: {"model": ErrorResponse, "description": "Chat error"},
    },
)
async def chat_with_results(request: ChatRequest):
    """Chat about analysis results.

    Uses the standalone chat agent (not part of LangGraph pipeline).
    Groq primary for speed, Gemini fallback.
    """
    from agents.chat_agent import chat_agent

    try:
        result = await asyncio.wait_for(
            chat_agent(
                message=request.message,
                kind=request.kind,
                context=request.context,
                history=[m.model_dump() for m in request.history],
            ),
            timeout=settings.CHAT_TIMEOUT,
        )
        return ChatResponse(**result)
    except asyncio.TimeoutError:
        return JSONResponse(
            status_code=504,
            content=ErrorResponse(
                error="timeout",
                message="Chat is taking a moment — try a shorter question? 🌀",
                detail=f"Chat exceeded {settings.CHAT_TIMEOUT} second timeout",
            ).model_dump(),
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="chat_error",
                message="Our chat helper had a hiccup. Please try again 💚",
                detail=str(e),
            ).model_dump(),
        )
