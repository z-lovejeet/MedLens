"""X-Ray Agent — Analyze chest X-ray images using Gemini Vision."""

import base64
import json

from graph.state import MedLensState
from core.models import model_router
from core.prompts import XRAY_PROMPT


def classify_finding(probability: int) -> str:
    """Classify X-ray finding status from probability."""
    if probability <= 20:
        return "optimal"
    elif probability <= 50:
        return "borderline"
    return "attention"


async def xray_agent(state: MedLensState) -> dict:
    """Analyze chest X-ray using Gemini Vision.

    Input:  state["file_bytes"]
    Output: {"findings": list[XRayFinding], "patient": Patient}
    Model:  Gemini Vision (call_vision) — retry once on failure
    """
    try:
        image_b64 = base64.b64encode(state["file_bytes"]).decode("utf-8")

        response = await model_router.call_vision(
            image_data=image_b64,
            prompt=XRAY_PROMPT,
        )

        data = json.loads(response)

        # Build patient from X-ray metadata
        name = data.get("patient_name", "Patient")
        patient = {
            "name": name,
            "initials": "".join(
                w[0].upper() for w in name.split()[:2]
            ) if name else "P",
            "age": data.get("age", 0),
            "gender": data.get("gender", "Unknown"),
            "fields": data.get("fields", [
                {"label": "View", "value": "PA (upright)"},
                {"label": "Body part", "value": "Chest"},
                {"label": "Modality", "value": "Digital X-Ray"},
            ]),
        }

        # Build findings with auto-classified status
        raw_findings = data.get("findings", [])
        if not raw_findings:
            return {"error": "We couldn't identify any findings in this image. Is this a chest X-ray?"}

        findings = []
        for f in raw_findings:
            prob = int(f.get("probability", 0))
            findings.append({
                "label": f["label"],
                "probability": prob,
                "status": classify_finding(prob),
                "note": "",  # filled by explainer_agent
            })

        return {"findings": findings, "patient": patient}

    except json.JSONDecodeError:
        return {"error": "We had trouble understanding the AI's response. Please try again."}
    except Exception as e:
        return {"error": f"Something went wrong analyzing your X-ray: {str(e)}"}
