"""MedLens — Phase 4 Comprehensive Integration & Unit Test Suite.

Tests are organized into 6 groups:
  Group 1: Health Check (1 test)
  Group 2: Input Validation (6 tests, no LLM calls)
  Group 3: CORS Verification (2 tests)
  Group 4: Response Schema Validation (2 tests — structure only, mocked)
  Group 5: Error Response Format (2 tests)
  Group 6: Unit Tests (7 tests, no LLM calls)

Run with:
  cd MedLens/backend
  source .venv/bin/activate
  python -m pytest tests/test_endpoints.py -v --tb=short
"""

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


# ═══════════════════════════════════════════════════════════════
# GROUP 1 — Health Check
# ═══════════════════════════════════════════════════════════════


class TestHealthCheck:
    """Test GET /api/health endpoint."""

    def test_health_returns_200_with_correct_shape(self):
        """Test 1: Health check returns 200 with status, version, models."""
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.0"
        assert "gemini" in data["models"]
        assert "groq" in data["models"]
        assert isinstance(data["models"]["gemini"], bool)
        assert isinstance(data["models"]["groq"], bool)


# ═══════════════════════════════════════════════════════════════
# GROUP 2 — Input Validation (No LLM calls)
# ═══════════════════════════════════════════════════════════════


class TestInputValidation:
    """Test validation rules return 422 with warm ErrorResponse."""

    def test_invalid_kind_returns_422(self):
        """Test 2: Invalid kind parameter rejected with invalid_kind."""
        r = client.post(
            "/api/analyze",
            data={"kind": "mri"},
            files={"file": ("test.pdf", b"fake", "application/pdf")},
        )
        assert r.status_code == 422
        data = r.json()
        assert data["error"] == "invalid_kind"
        assert "message" in data

    def test_invalid_blood_mime_returns_422(self):
        """Test 3: Invalid MIME type for blood rejected."""
        r = client.post(
            "/api/analyze",
            data={"kind": "blood"},
            files={"file": ("test.exe", b"fake", "application/octet-stream")},
        )
        assert r.status_code == 422
        assert r.json()["error"] == "invalid_file_type"

    def test_pdf_rejected_for_xray(self):
        """Test 4: PDFs rejected for X-ray (images only)."""
        r = client.post(
            "/api/analyze",
            data={"kind": "xray"},
            files={"file": ("scan.pdf", b"fake", "application/pdf")},
        )
        assert r.status_code == 422
        assert r.json()["error"] == "invalid_file_type"

    def test_file_too_large_returns_422(self):
        """Test 5: Files > 10MB rejected."""
        big_file = b"x" * (10 * 1024 * 1024 + 1)
        r = client.post(
            "/api/analyze",
            data={"kind": "blood"},
            files={"file": ("big.png", big_file, "image/png")},
        )
        assert r.status_code == 422
        assert r.json()["error"] == "file_too_large"

    def test_chat_empty_message_returns_422(self):
        """Test 6: Empty chat message rejected by Pydantic."""
        r = client.post(
            "/api/chat",
            json={"message": "", "kind": "blood", "context": {}, "history": []},
        )
        assert r.status_code == 422

    def test_chat_message_too_long_returns_422(self):
        """Test 7: Chat message > 500 chars rejected by Pydantic."""
        r = client.post(
            "/api/chat",
            json={"message": "a" * 501, "kind": "blood", "context": {}, "history": []},
        )
        assert r.status_code == 422


# ═══════════════════════════════════════════════════════════════
# GROUP 3 — CORS Verification
# ═══════════════════════════════════════════════════════════════


class TestCORS:
    """Test CORS middleware allows correct origins."""

    def test_cors_allows_localhost_5173(self):
        """Test 8: CORS allows requests from http://localhost:5173."""
        r = client.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert r.headers.get("access-control-allow-origin") == "http://localhost:5173"

    def test_cors_blocks_unknown_origin(self):
        """Test 9: CORS blocks requests from unknown origins."""
        r = client.options(
            "/api/health",
            headers={
                "Origin": "https://evil.example.com",
                "Access-Control-Request-Method": "GET",
            },
        )
        # FastAPI CORS middleware either omits the header or doesn't match
        acao = r.headers.get("access-control-allow-origin", "")
        assert acao != "https://evil.example.com"


# ═══════════════════════════════════════════════════════════════
# GROUP 4 — Response Schema Validation (structure checks)
# ═══════════════════════════════════════════════════════════════


class TestResponseSchema:
    """Validate response shapes match frontend contract."""

    def test_blood_response_has_required_fields(self):
        """Test 10: BloodAnalysisResponse has all required top-level keys."""
        from api.schemas import BloodAnalysisResponse

        # Verify model fields match the frontend contract
        required = {"kind", "patient", "summary", "metrics", "conditions",
                     "recommendations", "questions", "wellness"}
        actual = set(BloodAnalysisResponse.model_fields.keys())
        assert required.issubset(actual), f"Missing: {required - actual}"

    def test_xray_response_has_required_fields(self):
        """Test 11: XRayAnalysisResponse has all required top-level keys."""
        from api.schemas import XRayAnalysisResponse

        required = {"kind", "patient", "summary", "findings", "conditions",
                     "recommendations", "questions", "wellness"}
        actual = set(XRayAnalysisResponse.model_fields.keys())
        assert required.issubset(actual), f"Missing: {required - actual}"


# ═══════════════════════════════════════════════════════════════
# GROUP 5 — Error Response Format
# ═══════════════════════════════════════════════════════════════


class TestErrorFormat:
    """Ensure all error responses follow the warm ErrorResponse shape."""

    def test_422_errors_have_error_and_message(self):
        """Test 12: All 422 validation errors include error + message fields."""
        responses = [
            client.post("/api/analyze", data={"kind": "bad"},
                        files={"file": ("t.pdf", b"x", "application/pdf")}),
            client.post("/api/analyze", data={"kind": "blood"},
                        files={"file": ("t.exe", b"x", "application/octet-stream")}),
            client.post("/api/analyze", data={"kind": "blood"},
                        files={"file": ("t.png", b"x" * (10 * 1024 * 1024 + 1), "image/png")}),
        ]
        for r in responses:
            assert r.status_code == 422
            data = r.json()
            assert "error" in data, f"Missing 'error' field in {data}"
            assert "message" in data, f"Missing 'message' field in {data}"
            assert len(data["message"]) > 10, "Message too short to be user-friendly"

    def test_error_response_is_valid_shape(self):
        """Test 13: ErrorResponse shape has error(str), message(str), optional detail."""
        from api.schemas import ErrorResponse

        err = ErrorResponse(
            error="test_error",
            message="A warm test error message",
            detail="Technical detail",
        )
        dumped = err.model_dump()
        assert dumped["error"] == "test_error"
        assert dumped["message"] == "A warm test error message"
        assert dumped["detail"] == "Technical detail"

        # Without detail (optional)
        err_no_detail = ErrorResponse(error="x", message="y")
        assert err_no_detail.detail is None


# ═══════════════════════════════════════════════════════════════
# GROUP 6 — Unit Tests (no LLM calls)
# ═══════════════════════════════════════════════════════════════


class TestParserHelpers:
    """Test parser_agent helper functions."""

    def test_compute_scale_standard(self):
        """Test 14: compute_scale(4.0, 11.0) returns (1.2, 13.8)."""
        from agents.parser_agent import compute_scale
        assert compute_scale(4.0, 11.0) == (1.2, 13.8)

    def test_compute_scale_floors_at_zero(self):
        """Test 15: compute_scale(0.0, 1.0) floors at 0 (not negative)."""
        from agents.parser_agent import compute_scale
        result = compute_scale(0.0, 1.0)
        assert result[0] == 0.0, f"scaleMin should be 0.0, got {result[0]}"
        assert result[1] == 1.4

    def test_classify_status_all_branches(self):
        """Test 16: classify_status covers optimal, borderline, attention."""
        from agents.parser_agent import classify_status
        assert classify_status(13.8, 13.0, 17.0) == "optimal"
        assert classify_status(11.4, 4.0, 11.0) == "borderline"
        assert classify_status(15.0, 4.0, 11.0) == "attention"

    def test_make_tag_all_branches(self):
        """Test 17: make_tag covers all 5 label variants."""
        from agents.parser_agent import make_tag
        assert make_tag("optimal", 13.8, 13.0) == "Optimal"
        assert make_tag("borderline", 3.5, 4.0) == "Slightly Low"
        assert make_tag("borderline", 11.4, 4.0) == "Slightly Elevated"
        assert make_tag("attention", 2.0, 4.0) == "Low"
        assert make_tag("attention", 15.0, 4.0) == "Elevated"

    def test_make_metric_id_lookup_and_fallback(self):
        """Test 18: make_metric_id returns correct IDs and short fallback."""
        from agents.parser_agent import make_metric_id
        assert make_metric_id("Hemoglobin") == "hgb"
        assert make_metric_id("White Blood Cells") == "wbc"
        assert make_metric_id("Total Cholesterol") == "chol"
        assert make_metric_id("TSH") == "tsh"
        fallback = make_metric_id("Unknown Test XYZ")
        assert len(fallback) <= 4


class TestJSONParser:
    """Test parse_json_from_llm extraction strategies."""

    def test_parse_json_strategies(self):
        """Test 19: parse_json_from_llm handles 4 extraction strategies."""
        from core.models import parse_json_from_llm

        # 1. Direct JSON
        assert parse_json_from_llm('{"a": 1}') == {"a": 1}

        # 2. Markdown fenced with json label
        assert parse_json_from_llm('```json\n{"b": 2}\n```') == {"b": 2}

        # 3. Surrounded by commentary text
        assert parse_json_from_llm('Here is JSON:\n{"c": 3}\nDone!') == {"c": 3}

        # 4. Unlabeled fence
        assert parse_json_from_llm('```\n{"d": 4}\n```') == {"d": 4}


class TestRouter:
    """Test graph router function."""

    def test_route_input_blood_and_xray(self):
        """Test 20: route_input returns correct path for blood and xray."""
        from graph.router import route_input
        assert route_input({"file_type": "blood"}) == "blood"
        assert route_input({"file_type": "xray"}) == "xray"
