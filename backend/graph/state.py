"""MedLens LangGraph state definition.

Every agent reads from and writes to this shared state.
Fields are additive — each agent adds its outputs without overwriting others.
"""

from typing import TypedDict, Literal, Optional, Any


class PatientField(TypedDict):
    label: str
    value: str


class Patient(TypedDict):
    name: str
    initials: str
    age: int
    gender: str
    fields: list[PatientField]


class Metric(TypedDict):
    id: str
    name: str
    value: float
    unit: str
    min: float          # reference range low
    max: float          # reference range high
    scaleMin: float     # visual slider min
    scaleMax: float     # visual slider max
    status: str         # "optimal" | "borderline" | "attention"
    tag: str            # e.g. "Optimal", "Slightly Elevated"
    plain: str          # warm 2-3 sentence explanation


class XRayFinding(TypedDict):
    label: str
    probability: int    # 0-100
    status: str         # "optimal" | "borderline" | "attention"
    note: str           # plain-English interpretation


class Condition(TypedDict):
    name: str
    chance: int         # 0-100
    status: str         # "optimal" | "borderline" | "attention"
    blurb: str          # warm explanation


class Recommendation(TypedDict):
    icon: str           # icon key: "salad", "footprints", etc.
    title: str
    body: str


class WellnessTip(TypedDict):
    title: str
    body: str


class WellnessCategory(TypedDict):
    label: str
    icon: str
    tips: list[WellnessTip]


class Summary(TypedDict):
    headline: str
    body: str


class MedLensState(TypedDict):
    """Complete pipeline state. Each agent writes to its output fields."""

    # ── Input (set before pipeline starts) ──────────────────
    file_bytes: bytes                           # raw uploaded file
    file_type: Literal["blood", "xray"]         # analysis kind

    # ── OCR Agent output ────────────────────────────────────
    extracted_text: str                         # raw OCR text from document

    # ── Parser Agent output ─────────────────────────────────
    patient: Patient                            # patient demographics
    metrics: list[Metric]                       # blood markers (blood only)

    # ── X-Ray Agent output ──────────────────────────────────
    findings: list[XRayFinding]                 # x-ray findings (xray only)
    # patient is also set by xray_agent (shared field)

    # ── Explainer Agent output ──────────────────────────────
    summary: Summary                            # overall headline + body
    conditions: list[Condition]                 # condition screenings
    questions: list[str]                        # doctor questions
    # metrics[].plain and findings[].note are enriched in-place

    # ── Wellness Agent output ───────────────────────────────
    recommendations: list[Recommendation]       # lifestyle advice
    wellness: dict[str, WellnessCategory]       # categorized tips

    # ── Error tracking ──────────────────────────────────────
    error: Optional[str]                        # error message if pipeline fails
