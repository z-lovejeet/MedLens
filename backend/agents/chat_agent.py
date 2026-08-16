"""Chat Agent — Handle follow-up questions about analysis results.

This agent is NOT part of the LangGraph pipeline.
It's a standalone async function called directly from /api/chat.
"""

import json

from core.models import model_router, parse_json_from_llm
from core.prompts import CHAT_SYSTEM_PROMPT


async def chat_agent(
    message: str,
    kind: str,
    context: dict,
    history: list[dict],
) -> dict:
    """Handle a follow-up chat message about analysis results.

    Args:
        message: User's question (1-500 chars)
        kind: "blood" or "xray"
        context: Full analysis response data
        history: Previous messages [{role, content}, ...]

    Returns:
        {"reply": str, "suggestedFollowUps": list[str]}
    """
    try:
        # Build messages array for the LLM
        messages = [
            {"role": "system", "content": CHAT_SYSTEM_PROMPT.format(
                kind=kind,
                context=json.dumps(context, indent=2),
            )},
        ]

        # Add conversation history
        for msg in history:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Add current user message
        messages.append({"role": "user", "content": message})

        # Call Groq (fast) with Gemini fallback
        response = await model_router.call_chat(messages)
        data = parse_json_from_llm(response)

        follow_ups = data.get("suggestedFollowUps", [])

        # Clamp to 2-3 items (ChatResponse schema requires min_length=2, max_length=3)
        defaults = [
            "What should I ask my doctor about this?",
            "Can you explain this in simpler terms?",
            "Are there any lifestyle changes I should consider?",
        ]
        if len(follow_ups) < 2:
            follow_ups.extend(defaults[len(follow_ups):2])
        follow_ups = follow_ups[:3]

        return {
            "reply": data["reply"],
            "suggestedFollowUps": follow_ups,
        }

    except json.JSONDecodeError:
        return {
            "reply": "I had a little trouble putting my thoughts together. Could you try asking again?",
            "suggestedFollowUps": [
                "What does this result mean in simple terms?",
                "Should I follow up with my doctor about this?",
            ],
        }
    except Exception as e:
        return {
            "reply": "Something went wrong on my end. Please try again in a moment.",
            "suggestedFollowUps": [
                "Can you summarize my main findings?",
                "What questions should I ask my doctor?",
            ],
        }
