"""Wellness Agent — Generate personalized lifestyle recommendations and tips."""

import json

from graph.state import MedLensState
from core.models import model_router, parse_json_from_llm
from core.prompts import WELLNESS_PROMPT


async def wellness_agent(state: MedLensState) -> dict:
    """Generate personalized recommendations and wellness tips.

    Input:  state["patient"], state["conditions"], state["metrics"] or state["findings"],
            state["file_type"]
    Output: {"recommendations": list, "wellness": dict}
    Model:  Gemini Text → Groq fallback (call_text)
    """
    try:
        context = json.dumps({
            "patient": state["patient"],
            "conditions": state["conditions"],
            "metrics": state.get("metrics", []),
            "findings": state.get("findings", []),
            "file_type": state["file_type"],
        })

        prompt = WELLNESS_PROMPT.format(context=context)

        response = await model_router.call_text(prompt)
        data = parse_json_from_llm(response)

        return {
            "recommendations": data["recommendations"],
            "wellness": data["wellness"],
        }

    except json.JSONDecodeError:
        return {"error": "We had trouble understanding the AI's response. Please try again."}
    except Exception as e:
        return {"error": f"Something went wrong generating wellness tips: {str(e)}"}
