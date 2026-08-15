"""Conditional routing based on file_type."""

from graph.state import MedLensState


def route_input(state: MedLensState) -> str:
    """Route to the correct entry agent based on file type.

    Returns:
        "blood" → routes to ocr_agent
        "xray"  → routes to xray_agent
    """
    return state["file_type"]
