"""MedLens API — Pydantic schemas.

All response/request models matching the frontend TypeScript interfaces exactly.
Source of truth: docs/11-api-contract.md § 6
"""

from pydantic import BaseModel, Field
from typing import Literal, Optional


# ─── Shared Types ────────────────────────────────────────────

Status = Literal["optimal", "borderline", "attention"]
Kind = Literal["blood", "xray"]


# ─── Patient ─────────────────────────────────────────────────

class PatientField(BaseModel):
    label: str
    value: str


class Patient(BaseModel):
    name: str
    initials: str
    age: int
    gender: str
    fields: list[PatientField]


# ─── Summary ─────────────────────────────────────────────────

class Summary(BaseModel):
    headline: str = Field(..., description="1-sentence warm overview")
    body: str = Field(..., description="2-3 sentence explanation")


# ─── Blood Metrics ───────────────────────────────────────────

class Metric(BaseModel):
    id: str = Field(..., description="Short key e.g. 'hgb', 'wbc'")
    name: str = Field(..., description="Full name e.g. 'Hemoglobin'")
    value: float
    unit: str
    min: float = Field(..., description="Reference range low")
    max: float = Field(..., description="Reference range high")
    scaleMin: float = Field(..., description="Visual slider min (below ref range)")
    scaleMax: float = Field(..., description="Visual slider max (above ref range)")
    status: Status
    tag: str = Field(..., description="e.g. 'Optimal', 'Slightly Elevated'")
    plain: str = Field(..., description="2-3 sentence warm explanation")


# ─── X-Ray Findings ──────────────────────────────────────────

class XRayFinding(BaseModel):
    label: str = Field(..., description="e.g. 'Clear Lungs', 'Infiltration'")
    probability: int = Field(..., ge=0, le=100)
    status: Status
    note: str = Field(..., description="Plain-English interpretation")


# ─── Conditions ──────────────────────────────────────────────

class Condition(BaseModel):
    name: str
    chance: int = Field(..., ge=0, le=100, description="Likelihood %")
    status: Status
    blurb: str = Field(..., description="Warm explanation of likelihood")


# ─── Recommendations ─────────────────────────────────────────

class Recommendation(BaseModel):
    icon: str = Field(..., description="Icon key: salad, footprints, leaf, wind, etc.")
    title: str
    body: str


# ─── Wellness ────────────────────────────────────────────────

class WellnessTip(BaseModel):
    title: str
    body: str


class WellnessCategory(BaseModel):
    label: str
    icon: str
    tips: list[WellnessTip]


# ─── Analysis Responses ──────────────────────────────────────

class BloodAnalysisResponse(BaseModel):
    kind: Literal["blood"] = "blood"
    patient: Patient
    summary: Summary
    metrics: list[Metric] = Field(..., min_length=1)
    conditions: list[Condition] = Field(..., min_length=1)
    recommendations: list[Recommendation] = Field(..., min_length=1)
    questions: list[str] = Field(..., min_length=1)
    wellness: dict[str, WellnessCategory]


class XRayAnalysisResponse(BaseModel):
    kind: Literal["xray"] = "xray"
    patient: Patient
    summary: Summary
    findings: list[XRayFinding] = Field(..., min_length=1)
    conditions: list[Condition] = Field(..., min_length=1)
    recommendations: list[Recommendation] = Field(..., min_length=1)
    questions: list[str] = Field(..., min_length=1)
    wellness: dict[str, WellnessCategory]


# ─── Chat ────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)
    kind: Kind
    context: dict  # Full analysis response (blood or xray)
    history: list[ChatMessage] = Field(default_factory=list, max_length=50)


class ChatResponse(BaseModel):
    reply: str
    suggestedFollowUps: list[str] = Field(..., min_length=2, max_length=3)


# ─── Errors ──────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Warm, user-friendly error message")
    detail: Optional[str] = Field(None, description="Technical detail for debugging")


# ─── Health ──────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    version: str = "1.0.0"
    models: dict[str, bool]


# ─── Classification Utilities ────────────────────────────────

def classify_metric(value: float, min_ref: float, max_ref: float) -> Status:
    """Classify a blood metric based on reference range."""
    if min_ref <= value <= max_ref:
        return "optimal"

    range_width = max_ref - min_ref
    if range_width == 0:
        return "borderline"

    if value < min_ref:
        deviation = (min_ref - value) / range_width
    else:
        deviation = (value - max_ref) / range_width

    if deviation <= 0.15:
        return "borderline"
    return "attention"


def classify_condition(chance: int) -> Status:
    """Classify condition likelihood into status."""
    if chance <= 20:
        return "optimal"
    elif chance <= 50:
        return "borderline"
    return "attention"


def classify_finding(probability: int) -> Status:
    """Classify X-ray finding probability into status."""
    if probability <= 20:
        return "optimal"
    elif probability <= 50:
        return "borderline"
    return "attention"
