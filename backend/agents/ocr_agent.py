"""OCR Agent — Extract text from medical document images/PDFs using Gemini Vision."""

import base64
import json

from graph.state import MedLensState
from core.models import model_router
from core.prompts import OCR_PROMPT


async def ocr_agent(state: MedLensState) -> dict:
    """Extract text from a medical document using Gemini Vision.

    Input:  state["file_bytes"]
    Output: {"extracted_text": str}
    Model:  Gemini Vision (call_vision) — retry once on failure
    """
    try:
        image_b64 = base64.b64encode(state["file_bytes"]).decode("utf-8")

        response = await model_router.call_vision(
            image_data=image_b64,
            prompt=OCR_PROMPT,
        )

        # OCR prompt asks Gemini to return {"extracted_text": "..."}
        # Parse the JSON wrapper and extract the text field
        try:
            data = json.loads(response)
            extracted = data.get("extracted_text", response)
        except json.JSONDecodeError:
            # If Gemini returned plain text instead of JSON, use it directly
            extracted = response

        if not extracted or len(extracted.strip()) < 10:
            return {"error": "We had trouble reading your document. Could you try a clearer image? 📸"}

        return {"extracted_text": extracted}

    except json.JSONDecodeError:
        return {"error": "We had trouble understanding the AI's response. Please try again."}
    except Exception as e:
        return {"error": f"Something went wrong reading your document: {str(e)}"}
