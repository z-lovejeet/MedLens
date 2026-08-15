"""Explainer Agent — Generate warm, plain-English explanations for medical data.

This is the most important agent for user experience. The warm, 6th-grade-level
tone is what makes MedLens special. It enriches metrics[].plain or findings[].note
in-place and generates the overall summary, conditions, and doctor questions.
"""

import json

from graph.state import MedLensState
from core.models import model_router, parse_json_from_llm
from core.prompts import EXPLAINER_BLOOD_PROMPT, EXPLAINER_XRAY_PROMPT


async def explainer_agent(state: MedLensState) -> dict:
    """Generate warm explanations, summary, conditions, and questions.

    Input:  state["file_type"], state["patient"], state["metrics"] OR state["findings"]
    Output: {"summary", "conditions", "questions"} + enriched metrics or findings
    Model:  Gemini Text → Groq fallback (call_text)
    """
    try:
        is_blood = state["file_type"] == "blood"

        if is_blood:
            context = json.dumps({
                "patient": state["patient"],
                "metrics": state["metrics"],
            })
            prompt = EXPLAINER_BLOOD_PROMPT.format(context=context)
        else:
            context = json.dumps({
                "patient": state["patient"],
                "findings": state["findings"],
            })
            prompt = EXPLAINER_XRAY_PROMPT.format(context=context)

        response = await model_router.call_text(prompt)
        data = parse_json_from_llm(response)

        # Enrich metrics with plain-English explanations
        if is_blood:
            enriched_metrics = []
            explanations = data.get("metric_explanations", {})
            for metric in state["metrics"]:
                enriched = dict(metric)  # copy
                enriched["plain"] = explanations.get(
                    metric["id"],
                    explanations.get(metric["name"], "")
                )
                enriched_metrics.append(enriched)
            return {
                "summary": data["summary"],
                "metrics": enriched_metrics,
                "conditions": data["conditions"],
                "questions": data["questions"],
            }
        else:
            enriched_findings = []
            notes = data.get("finding_notes", {})
            for finding in state["findings"]:
                enriched = dict(finding)  # copy
                enriched["note"] = notes.get(finding["label"], "")
                enriched_findings.append(enriched)
            return {
                "summary": data["summary"],
                "findings": enriched_findings,
                "conditions": data["conditions"],
                "questions": data["questions"],
            }

    except json.JSONDecodeError:
        return {"error": "We had trouble understanding the AI's response. Please try again."}
    except Exception as e:
        return {"error": f"Something went wrong generating explanations: {str(e)}"}
