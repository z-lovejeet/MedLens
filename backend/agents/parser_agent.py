"""Parser Agent — Convert raw OCR text into structured patient info and blood metrics.

This is the most complex agent with 4 helper functions for post-LLM processing:
- compute_scale: visual slider bounds
- classify_status: optimal/borderline/attention
- make_tag: human-readable label
- make_metric_id: short ID generation
"""

import json

from graph.state import MedLensState
from core.models import model_router, parse_json_from_llm
from core.prompts import PARSER_PROMPT


# ─── Helper Functions ────────────────────────────────────────

def compute_scale(min_ref: float, max_ref: float) -> tuple[float, float]:
    """Calculate visual slider scale bounds.

    Extends the reference range by ~40% on each side so the
    indicator dot has room to show out-of-range values.
    """
    range_width = max_ref - min_ref
    padding = range_width * 0.4
    return round(min_ref - padding, 1), round(max_ref + padding, 1)


def classify_status(value: float, min_ref: float, max_ref: float) -> str:
    """Classify metric status based on reference range deviation."""
    if min_ref <= value <= max_ref:
        return "optimal"
    range_width = max_ref - min_ref
    if range_width == 0:
        return "borderline"
    deviation = abs(value - min_ref if value < min_ref else value - max_ref) / range_width
    return "borderline" if deviation <= 0.15 else "attention"


def make_tag(status: str, value: float, min_ref: float) -> str:
    """Generate human-readable tag from status."""
    if status == "optimal":
        return "Optimal"
    if value < min_ref:
        return "Slightly Low" if status == "borderline" else "Low"
    return "Slightly Elevated" if status == "borderline" else "Elevated"


def make_metric_id(name: str) -> str:
    """Generate short id from metric name."""
    abbreviations = {
        "hemoglobin": "hgb", "white blood cells": "wbc", "wbc": "wbc",
        "total cholesterol": "chol", "cholesterol": "chol",
        "fasting glucose": "glu", "glucose": "glu",
        "platelets": "plt", "vitamin d": "vitd", "vitamin b12": "vitb12",
        "iron": "iron", "calcium": "cal", "creatinine": "creat",
        "uric acid": "ua", "tsh": "tsh", "sgpt": "sgpt", "sgot": "sgot",
        "bilirubin": "bili", "triglycerides": "tg", "hdl": "hdl", "ldl": "ldl",
        "red blood cells": "rbc", "rbc": "rbc", "esr": "esr", "hba1c": "hba1c",
    }
    key = name.lower().strip()
    return abbreviations.get(key, key[:4].replace(" ", ""))


# ─── Agent Function ──────────────────────────────────────────

async def parser_agent(state: MedLensState) -> dict:
    """Parse OCR text into structured patient info and blood metrics.

    Input:  state["extracted_text"]
    Output: {"patient": Patient, "metrics": list[Metric]}
    Model:  Gemini Text → Groq fallback (call_text)
    """
    try:
        prompt = PARSER_PROMPT.format(extracted_text=state["extracted_text"])

        response = await model_router.call_text(prompt)
        data = parse_json_from_llm(response)

        # Build patient with computed initials
        patient_data = data["patient"]
        name = patient_data.get("name", "Patient")
        patient = {
            "name": name,
            "initials": "".join(w[0].upper() for w in name.split()[:2]) if name else "P",
            "age": patient_data.get("age", 0),
            "gender": patient_data.get("gender", "Unknown"),
            "fields": patient_data.get("fields", []),
        }

        # Build metrics with auto-calculated fields
        raw_metrics = data.get("metrics", data.get("tests", data.get("lab_results", [])))
        if not raw_metrics:
            return {"error": "We couldn't find enough medical data in this file. Is this the right report?"}

        import re
        metrics = []
        for m in raw_metrics:
            try:
                name = m.get("name", m.get("test_name", "Unknown Test"))
                val_str = str(m.get("value", ""))
                val_match = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", val_str)
                if not val_match:
                    continue
                value = float(val_match[0])

                min_str = str(m.get("min", "0"))
                min_match = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", min_str)
                min_ref = float(min_match[0]) if min_match else 0.0

                max_str = str(m.get("max", str(min_ref * 2 or 100)))
                max_match = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", max_str)
                max_ref = float(max_match[0]) if max_match else (min_ref + 10.0)
            except (ValueError, TypeError, IndexError, KeyError):
                continue  # Skip malformed metrics

            scale_min, scale_max = compute_scale(min_ref, max_ref)
            status = classify_status(value, min_ref, max_ref)

            metrics.append({
                "id": make_metric_id(name),
                "name": name,
                "value": value,
                "unit": m.get("unit", ""),
                "min": min_ref,
                "max": max_ref,
                "scaleMin": scale_min,
                "scaleMax": scale_max,
                "status": status,
                "tag": make_tag(status, value, min_ref),
                "plain": "",  # filled by explainer_agent
            })

        if not metrics:
            return {"error": "We couldn't find enough medical data in this file. Is this the right report?"}

        return {"patient": patient, "metrics": metrics}

    except json.JSONDecodeError:
        return {"error": "We had trouble understanding the AI's response. Please try again."}
    except Exception as e:
        return {"error": f"Something went wrong parsing your report: {str(e)}"}
