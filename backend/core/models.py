import asyncio
import logging
import time
import google.generativeai as genai
from groq import AsyncGroq
from core.config import settings

logger = logging.getLogger(__name__)

# Multi-Tier Fallback Sequence for Gemini: fast & stable first
DEFAULT_GEMINI_CASCADE = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
]

# 3-Tier Groq Chat Cascade: gpt-oss-120b -> gpt-oss-20b -> qwen3.6-27b (Zero Gemini in chat)
DEFAULT_GROQ_CHAT_CASCADE = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
]


class ModelRouter:
    """Routes LLM calls to Gemini or Groq with smart circuit-breaker fallback."""

    def __init__(self):
        # Configure Gemini API
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # Build deduplicated Gemini cascade prioritizing configured GEMINI_MODEL
        self.gemini_models = []
        if settings.GEMINI_MODEL:
            self.gemini_models.append(settings.GEMINI_MODEL)
        for m in DEFAULT_GEMINI_CASCADE:
            if m not in self.gemini_models:
                self.gemini_models.append(m)

        # Configure Groq API
        self.groq = AsyncGroq(api_key=settings.GROQ_API_KEY)

        # Build deduplicated Groq cascade prioritizing configured GROQ_MODEL
        self.groq_chat_models = []
        if settings.GROQ_MODEL:
            self.groq_chat_models.append(settings.GROQ_MODEL)
        for m in DEFAULT_GROQ_CHAT_CASCADE:
            if m not in self.groq_chat_models:
                self.groq_chat_models.append(m)

        # Failure cooldown dictionaries (model_name -> cooldown_expiry_timestamp)
        self._gemini_cooldowns: dict[str, float] = {}
        self._groq_cooldowns: dict[str, float] = {}

    def _is_healthy(self, model_name: str, cooldown_dict: dict) -> bool:
        """Check if model is currently healthy (cooldown expired)."""
        expiry = cooldown_dict.get(model_name, 0)
        return time.time() > expiry

    def _mark_unhealthy(self, model_name: str, cooldown_dict: dict, duration: float = 300.0):
        """Temporarily mark model unhealthy so subsequent pipeline steps skip waiting on it."""
        logger.warning(f"Temporarily setting {model_name} on {duration}s cooldown due to failure/timeout.")
        cooldown_dict[model_name] = time.time() + duration

    def _mark_healthy(self, model_name: str, cooldown_dict: dict):
        """Clear cooldown on successful response."""
        cooldown_dict.pop(model_name, None)

    async def call_vision(self, image_data: str, prompt: str, mime_type: str = "image/jpeg") -> str:
        """Vision tasks → 5-tier Gemini cascade with fast fallback."""
        image_part = {
            "mime_type": mime_type,
            "data": image_data,
        }

        # Order models prioritizing healthy ones first, while preserving preference order
        candidate_models = sorted(
            self.gemini_models,
            key=lambda m: 0 if self._is_healthy(m, self._gemini_cooldowns) else 1,
        )

        last_error = None
        for model_name in candidate_models:
            try:
                logger.info(f"[Vision] Attempting {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = await asyncio.wait_for(
                    model.generate_content_async(
                        [prompt, image_part],
                        generation_config=genai.GenerationConfig(
                            response_mime_type="application/json",
                            temperature=0.3,
                        ),
                    ),
                    timeout=7.0,
                )
                if response and response.text:
                    self._mark_healthy(model_name, self._gemini_cooldowns)
                    logger.info(f"[Vision] Success with {model_name}")
                    return response.text
            except Exception as e:
                self._mark_unhealthy(model_name, self._gemini_cooldowns, duration=300.0)
                logger.warning(f"[Vision] Model {model_name} failed: {e}. Cascading to next fallback...")
                last_error = e
                continue

        raise RuntimeError(f"All Gemini vision fallback models failed: {str(last_error)}")

    async def call_text(self, prompt: str) -> str:
        """Text tasks → 5-tier Gemini cascade, then Groq 3-tier cascade fallback."""
        # 1. Try Gemini cascade first (healthy models prioritized)
        candidate_gemini = sorted(
            self.gemini_models,
            key=lambda m: 0 if self._is_healthy(m, self._gemini_cooldowns) else 1,
        )

        for model_name in candidate_gemini:
            try:
                logger.info(f"[Text] Attempting Gemini {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = await asyncio.wait_for(
                    model.generate_content_async(
                        prompt,
                        generation_config=genai.GenerationConfig(
                            response_mime_type="application/json",
                            temperature=0.4,
                        ),
                    ),
                    timeout=5.0,
                )
                if response and response.text:
                    self._mark_healthy(model_name, self._gemini_cooldowns)
                    logger.info(f"[Text] Success with Gemini {model_name}")
                    return response.text
            except Exception as e:
                self._mark_unhealthy(model_name, self._gemini_cooldowns, duration=300.0)
                logger.warning(f"[Text] Gemini {model_name} failed: {e}. Cascading to next fallback...")
                continue

        # 2. Fallback to Groq cascade if all Gemini models fail
        logger.warning("[Text] All Gemini models exhausted. Falling back to Groq models...")
        candidate_groq = sorted(
            self.groq_chat_models,
            key=lambda m: 0 if self._is_healthy(m, self._groq_cooldowns) else 1,
        )

        last_error = None
        for groq_model in candidate_groq:
            try:
                logger.info(f"[Text] Attempting Groq {groq_model}...")
                response = await asyncio.wait_for(
                    self.groq.chat.completions.create(
                        model=groq_model,
                        messages=[
                            {"role": "system", "content": "You are a medical analysis AI. Always respond with valid JSON only."},
                            {"role": "user", "content": prompt},
                        ],
                        temperature=0.4,
                        response_format={"type": "json_object"},
                    ),
                    timeout=5.0,
                )
                if response and response.choices and response.choices[0].message.content:
                    self._mark_healthy(groq_model, self._groq_cooldowns)
                    logger.info(f"[Text] Success with Groq {groq_model}")
                    return response.choices[0].message.content
            except Exception as e:
                self._mark_unhealthy(groq_model, self._groq_cooldowns, duration=300.0)
                logger.warning(f"[Text] Groq {groq_model} failed: {e}. Cascading to next Groq fallback...")
                last_error = e
                continue

        raise RuntimeError(f"All text model attempts (Gemini + Groq) failed: {str(last_error)}")

    async def call_chat(self, messages: list[dict]) -> str:
        """Chat tasks → Groq only (120b → 20b → qwen3.6-27b). Zero Gemini in chat."""
        candidate_groq = sorted(
            self.groq_chat_models,
            key=lambda m: 0 if self._is_healthy(m, self._groq_cooldowns) else 1,
        )

        last_error = None
        for model_name in candidate_groq:
            try:
                logger.info(f"[Chat] Attempting Groq model {model_name}...")
                response = await asyncio.wait_for(
                    self.groq.chat.completions.create(
                        model=model_name,
                        messages=messages,
                        temperature=0.6,
                        max_tokens=1024,
                        response_format={"type": "json_object"},
                    ),
                    timeout=4.5,
                )
                if response and response.choices and response.choices[0].message.content:
                    self._mark_healthy(model_name, self._groq_cooldowns)
                    logger.info(f"[Chat] Success with Groq model {model_name}")
                    return response.choices[0].message.content
            except Exception as e:
                self._mark_unhealthy(model_name, self._groq_cooldowns, duration=300.0)
                logger.warning(f"[Chat] Groq model {model_name} failed: {e}. Cascading to next Groq fallback...")
                last_error = e
                continue

        raise RuntimeError(f"All Groq chat models failed: {str(last_error)}")


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
