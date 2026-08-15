import asyncio
import google.generativeai as genai
from groq import AsyncGroq
from core.config import settings


class ModelRouter:
    """Routes LLM calls to Gemini or Groq with automatic fallback."""

    def __init__(self):
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini = genai.GenerativeModel(settings.GEMINI_MODEL)

        # Configure Groq
        self.groq = AsyncGroq(api_key=settings.GROQ_API_KEY)

    async def call_vision(self, image_data: str, prompt: str, mime_type: str = "image/jpeg") -> str:
        """Vision tasks → Gemini primary with active fallback models.

        Args:
            image_data: Base64-encoded image string
            prompt: Text prompt to send with the image
            mime_type: MIME type of the image (detected from file magic bytes)

        Returns:
            LLM response text
        """
        image_part = {
            "mime_type": mime_type,
            "data": image_data,
        }

        # 1. Try primary configured Gemini model (15s timeout)
        try:
            response = await asyncio.wait_for(
                self.gemini.generate_content_async(
                    [prompt, image_part],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.3,
                    ),
                ),
                timeout=15.0,
            )
            return response.text
        except Exception:
            pass

        # 2. Fallback to gemini-3.5-flash-lite (15s timeout)
        try:
            fallback_35l = genai.GenerativeModel("gemini-3.5-flash-lite")
            response = await asyncio.wait_for(
                fallback_35l.generate_content_async(
                    [prompt, image_part],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.3,
                    ),
                ),
                timeout=15.0,
            )
            return response.text
        except Exception:
            pass

        # 3. Fallback to gemini-3.1-flash-lite (15s timeout)
        try:
            fallback_31l = genai.GenerativeModel("gemini-3.1-flash-lite")
            response = await asyncio.wait_for(
                fallback_31l.generate_content_async(
                    [prompt, image_part],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.3,
                    ),
                ),
                timeout=15.0,
            )
            return response.text
        except Exception:
            pass

        # 4. Fallback to gemini-3-flash-preview
        try:
            fallback_30 = genai.GenerativeModel("gemini-3-flash-preview")
            response = await asyncio.wait_for(
                fallback_30.generate_content_async(
                    [prompt, image_part],
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.3,
                    ),
                ),
                timeout=20.0,
            )
            return response.text
        except Exception as e:
            raise RuntimeError(f"All vision model attempts failed: {str(e)}")

    async def call_text(self, prompt: str) -> str:
        """Text tasks → Gemini primary (10s), Groq (fast fallback), Gemini secondary."""
        # 1. Try primary Gemini model (10s timeout)
        try:
            response = await asyncio.wait_for(
                self.gemini.generate_content_async(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.4,
                    ),
                ),
                timeout=10.0,
            )
            return response.text
        except Exception:
            pass

        # 2. Fallback to Groq (ultra-fast ~500ms)
        try:
            response = await asyncio.wait_for(
                self.groq.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": "You are a medical analysis AI. Always respond with valid JSON only."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.4,
                    response_format={"type": "json_object"},
                ),
                timeout=8.0,
            )
            return response.choices[0].message.content
        except Exception:
            pass

        # 3. Fallback to gemini-3.5-flash-lite
        try:
            fallback_35l = genai.GenerativeModel("gemini-3.5-flash-lite")
            response = await asyncio.wait_for(
                fallback_35l.generate_content_async(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.4,
                    ),
                ),
                timeout=10.0,
            )
            return response.text
        except Exception:
            pass

        # 4. Fallback to gemini-3.1-flash-lite
        fallback_31l = genai.GenerativeModel("gemini-3.1-flash-lite")
        response = await asyncio.wait_for(
            fallback_31l.generate_content_async(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.4,
                ),
            ),
            timeout=15.0,
        )
        return response.text

    async def call_chat(self, messages: list[dict]) -> str:
        """Chat tasks → Groq primary (speed), Gemini fallbacks with retry."""
        # 1. Try Groq first (fast)
        try:
            response = await asyncio.wait_for(
                self.groq.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=messages,
                    temperature=0.6,
                    max_tokens=1024,
                    response_format={"type": "json_object"},
                ),
                timeout=8.0,
            )
            return response.choices[0].message.content
        except Exception:
            pass

        # 2. Fallback to primary Gemini
        try:
            combined = "\n".join(
                f"{'System' if m['role']=='system' else m['role'].title()}: {m['content']}"
                for m in messages
            )
            combined += "\n\nRespond with JSON: {\"reply\": \"...\", \"suggestedFollowUps\": [\"...\"]}"

            response = await asyncio.wait_for(
                self.gemini.generate_content_async(
                    combined,
                    generation_config=genai.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.6,
                    ),
                ),
                timeout=10.0,
            )
            return response.text
        except Exception:
            pass

        # 3. Fallback to gemini-3.5-flash-lite
        combined = "\n".join(
            f"{'System' if m['role']=='system' else m['role'].title()}: {m['content']}"
            for m in messages
        )
        combined += "\n\nRespond with JSON: {\"reply\": \"...\", \"suggestedFollowUps\": [\"...\"]}"
        fallback_35l = genai.GenerativeModel("gemini-3.5-flash-lite")
        response = await asyncio.wait_for(
            fallback_35l.generate_content_async(
                combined,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.6,
                ),
            ),
            timeout=10.0,
        )
        return response.text


# Singleton
model_router = ModelRouter()


def parse_json_from_llm(text: str) -> dict:
    """Safely extract and parse JSON from LLM output, stripping markdown fences and surrounding commentary."""
    import json
    import re

    s = text.strip()

    # 1. Direct parse attempt
    try:
        return json.loads(s)
    except Exception:
        pass

    # 2. Extract content from ```json ... ``` or ``` ... ``` code blocks
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", s)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except Exception:
            pass

    # 3. Find outermost '{' to '}'
    first_brace = s.find("{")
    last_brace = s.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        json_candidate = s[first_brace:last_brace + 1].strip()
        try:
            return json.loads(json_candidate)
        except Exception:
            pass

    # 4. Final attempt
    return json.loads(s)
