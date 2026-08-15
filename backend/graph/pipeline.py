"""LangGraph StateGraph construction.

Builds the analysis pipeline with conditional routing based on file_type.

Graph topology:
  START →(conditional)→ ocr_agent (blood) | xray_agent (xray)
  ocr_agent → parser_agent → explainer_agent → wellness_agent → END
  xray_agent → explainer_agent → wellness_agent → END
"""

from langgraph.graph import StateGraph, START, END

from graph.state import MedLensState
from graph.router import route_input
from agents.ocr_agent import ocr_agent
from agents.parser_agent import parser_agent
from agents.xray_agent import xray_agent
from agents.explainer_agent import explainer_agent
from agents.wellness_agent import wellness_agent


def build_graph() -> StateGraph:
    """Construct and compile the MedLens analysis pipeline."""

    graph = StateGraph(MedLensState)

    # ── Add nodes ───────────────────────────────────────────
    graph.add_node("ocr_agent", ocr_agent)
    graph.add_node("parser_agent", parser_agent)
    graph.add_node("xray_agent", xray_agent)
    graph.add_node("explainer_agent", explainer_agent)
    graph.add_node("wellness_agent", wellness_agent)

    # ── Conditional entry point ─────────────────────────────
    graph.add_conditional_edges(
        START,
        route_input,
        {
            "blood": "ocr_agent",
            "xray": "xray_agent",
        },
    )

    # ── Blood path edges ────────────────────────────────────
    graph.add_edge("ocr_agent", "parser_agent")
    graph.add_edge("parser_agent", "explainer_agent")

    # ── X-Ray path edge ─────────────────────────────────────
    graph.add_edge("xray_agent", "explainer_agent")

    # ── Shared tail ─────────────────────────────────────────
    graph.add_edge("explainer_agent", "wellness_agent")
    graph.add_edge("wellness_agent", END)

    return graph.compile()


# Singleton compiled graph
pipeline = build_graph()
