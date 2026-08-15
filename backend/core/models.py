"""Model router with automatic fallback between Gemini and Groq."""

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

    async def call_vision(self, image_data: str, prompt: str) -> str:
        """Vision tasks → Gemini ONLY.

        Args:
            image_data: Base64-encoded image string
            prompt: Text prompt to send with the image

        Returns:
            LLM response text

        Raises:
            Exception: If Gemini fails after retry
        """
        image_part = {
            "mime_type": "image/jpeg",
            "data": image_data,
        }

        try:
            response = await asyncio.to_thread(
                self.gemini.generate_content,
                [prompt, image_part],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                ),
            )
            return response.text
        except Exception:
            # Retry once after 2 second delay
            await asyncio.sleep(2)
            response = await asyncio.to_thread(
                self.gemini.generate_content,
                [prompt, image_part],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                ),
            )
            return response.text

    async def call_text(self, prompt: str) -> str:
        """Text tasks → Gemini primary, Groq fallback.

        Args:
            prompt: Text prompt (may include JSON context)

        Returns:
            LLM response text (should be valid JSON)
        """
        # Try Gemini first
        try:
            response = await asyncio.to_thread(
                self.gemini.generate_content,
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.4,
                ),
            )
            return response.text
        except Exception:
            pass

        # Fallback to Groq
        response = await self.groq.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a medical analysis AI. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    async def call_chat(self, messages: list[dict]) -> str:
        """Chat tasks → Groq primary (speed), Gemini fallback.

        Args:
            messages: Full message array including system, history, and user

        Returns:
            LLM response text (should be valid JSON with reply + suggestedFollowUps)
        """
        # Try Groq first (fast)
        try:
            response = await self.groq.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=1024,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content
        except Exception:
            pass

        # Fallback to Gemini
        # Convert messages to single prompt for Gemini
        combined = "\n".join(
            f"{'System' if m['role']=='system' else m['role'].title()}: {m['content']}"
            for m in messages
        )
        combined += "\n\nRespond with JSON: {\"reply\": \"...\", \"suggestedFollowUps\": [\"...\"]}"

        response = await asyncio.to_thread(
            self.gemini.generate_content,
            combined,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.6,
            ),
        )
        return response.text


# Singleton
model_router = ModelRouter()
