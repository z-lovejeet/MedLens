/**
 * API client for MedLens backend.
 * Handles file upload (multipart), chat (JSON), and health check.
 */

import type { Kind, AnalysisResponse, ChatMessage, ChatResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Custom Error ───────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    public status: number,
  ) {
    super(userMessage);
    this.name = "ApiError";
  }
}

// ─── Analyze Report ─────────────────────────────────────────

export async function analyzeReport(
  file: File,
  kind: Kind,
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const res = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      error: "network_error",
      message: "Couldn't reach our servers. Check your connection and try again.",
    }));
    throw new ApiError(err.error, err.message, res.status);
  }

  return res.json();
}

// ─── Chat ───────────────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  kind: Kind,
  context: AnalysisResponse,
  history: ChatMessage[],
): Promise<ChatResponse> {
  // Strip timestamps — backend schema only expects { role, content }
  const cleanHistory = history.map(({ role, content }) => ({ role, content }));

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, kind, context, history: cleanHistory }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({
      error: "chat_error",
      message: "I'm having a little trouble right now. Try again in a moment 💚",
    }));
    throw new ApiError(err.error, err.message, res.status);
  }

  return res.json();
}

// ─── Health Check ───────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
