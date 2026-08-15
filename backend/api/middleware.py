"""MedLens API — Middleware for rate limiting and global error handling.

Rate limits (per IP, sliding window):
  /api/analyze: 10 requests/min
  /api/chat:    30 requests/min
"""

import time
from collections import defaultdict

from fastapi import Request
from fastapi.responses import JSONResponse

from api.schemas import ErrorResponse
from core.config import settings


# ─── Rate Limiter ────────────────────────────────────────────


class RateLimiter:
    """In-memory sliding-window rate limiter.

    Stores timestamps of recent requests per key (IP + endpoint).
    Evicts timestamps older than the window on each check.
    """

    def __init__(self):
        self.windows: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, key: str, limit: int, window_seconds: int = 60) -> bool:
        """Check if a request is within the rate limit.

        Args:
            key: Unique identifier (e.g. "10.0.0.1:/api/analyze")
            limit: Maximum requests allowed in the window
            window_seconds: Window duration in seconds

        Returns:
            True if the request is allowed, False if rate-limited
        """
        now = time.time()
        cutoff = now - window_seconds

        # Evict expired timestamps
        self.windows[key] = [t for t in self.windows[key] if t > cutoff]

        if len(self.windows[key]) >= limit:
            return False

        self.windows[key].append(now)
        return True


rate_limiter = RateLimiter()

# Route → (limit, window_seconds) configuration
RATE_LIMITS: dict[str, tuple[int, int]] = {
    "/api/analyze": (settings.RATE_LIMIT_ANALYZE, 60),
    "/api/chat": (settings.RATE_LIMIT_CHAT, 60),
}


# ─── Middleware Dispatch ─────────────────────────────────────


async def rate_limit_middleware(request: Request, call_next):
    """FastAPI middleware for rate limiting /api/analyze and /api/chat.

    Returns HTTP 429 with warm ErrorResponse if the client exceeds
    their per-IP rate limit for a protected endpoint.
    """
    path = request.url.path

    if path in RATE_LIMITS:
        limit, window = RATE_LIMITS[path]
        client_ip = request.client.host if request.client else "unknown"
        key = f"{client_ip}:{path}"

        if not rate_limiter.is_allowed(key, limit, window):
            return JSONResponse(
                status_code=429,
                content=ErrorResponse(
                    error="rate_limited",
                    message="You've been busy! Please wait a moment before trying again. ☕",
                    detail=f"Rate limit: {limit} requests per {window}s for {path}",
                ).model_dump(),
            )

    return await call_next(request)


# ─── Global Exception Handler ───────────────────────────────


async def global_exception_handler(request: Request, exc: Exception):
    """Catch any unhandled exception and return warm ErrorResponse JSON.

    Prevents raw stack traces from reaching the client.
    """
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="internal_error",
            message="Something unexpected happened. Try again — we're working on it 💚",
            detail=str(exc),
        ).model_dump(),
    )
