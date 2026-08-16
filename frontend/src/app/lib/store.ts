/**
 * MedLens global state store (Zustand).
 *
 * Three slices:
 * 1. currentAnalysis — in-memory, the active analysis session
 * 2. chat           — in-memory, chat messages for current session
 * 3. history        — persisted to localStorage, past analyses (max 20)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { analyzeReport, sendChatMessage, ApiError } from "./api";
import type {
  Kind,
  Stage,
  AnalysisErrorType,
  AnalysisResponse,
  ChatMessage,
  HistoryEntry,
} from "./types";

// ─── Constants ──────────────────────────────────────────────

const MAX_HISTORY = 20;
const STORAGE_KEY = "medlens-history";

// ─── Store Interface ────────────────────────────────────────

interface MedLensStore {
  // ── Current Analysis (in-memory) ──────────────────────────
  kind: Kind | null;
  stage: Stage;
  fileName: string;
  uploadedImageUrl: string | null;
  result: AnalysisResponse | null;
  error: AnalysisErrorType | null;

  // ── Chat (in-memory) ─────────────────────────────────────
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  suggestedQuestions: string[];

  // ── History (persisted) ───────────────────────────────────
  history: HistoryEntry[];

  // ── Analysis Actions ──────────────────────────────────────
  analyze: (file: File, kind: Kind) => Promise<void>;
  loadSample: (kind: Kind) => void;
  setStage: (stage: Stage) => void;
  reset: () => void;

  // ── Chat Actions ──────────────────────────────────────────
  sendChat: (message: string) => Promise<void>;
  clearChat: () => void;

  // ── History Actions ───────────────────────────────────────
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearAllHistory: () => void;
}

// ─── Error Mapping ──────────────────────────────────────────

function mapErrorType(status: number, code: string): AnalysisErrorType {
  if (status === 504 || code === "timeout") return "timeout";
  if (
    code === "ocr_failed" ||
    code === "parsing_failed" ||
    code === "invalid_file_type"
  )
    return "parsing";
  return "server";
}

// ─── UUID Generator ─────────────────────────────────────────

function uuid(): string {
  return (
    crypto.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

// ─── Store Creation ─────────────────────────────────────────

export const useMedLensStore = create<MedLensStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ───────────────────────────────────────
      kind: null,
      stage: "idle",
      fileName: "",
      uploadedImageUrl: null,
      result: null,
      error: null,

      chatMessages: [],
      chatLoading: false,
      suggestedQuestions: [],

      history: [],

      // ── analyze() ──────────────────────────────────────────
      analyze: async (file, kind) => {
        const imageUrl = kind === "xray" ? URL.createObjectURL(file) : null;

        set({
          kind,
          stage: "loading",
          fileName: file.name,
          uploadedImageUrl: imageUrl,
          result: null,
          error: null,
          chatMessages: [],
          chatLoading: false,
          suggestedQuestions: [],
        });

        try {
          const result = await analyzeReport(file, kind);

          // Auto-save to history
          const entry: HistoryEntry = {
            id: uuid(),
            kind,
            date: new Date().toISOString(),
            patientName: result.patient.name,
            summaryHeadline: result.summary.headline,
            result,
          };

          set((state) => ({
            stage: "results",
            result,
            history: [entry, ...state.history].slice(0, MAX_HISTORY),
          }));
        } catch (err) {
          if (err instanceof ApiError) {
            set({
              stage: "error",
              error: mapErrorType(err.status, err.code),
            });
          } else {
            set({ stage: "error", error: "server" });
          }
        }
      },

      // ── loadSample() ──────────────────────────────────────
      loadSample: (kind) => {
        // Dynamic import to avoid bundling mock data when using real API
        import("../components/medlens/data").then((data) => {
          const result =
            kind === "blood"
              ? {
                  kind: "blood" as const,
                  patient: {
                    ...data.BLOOD_PATIENT,
                    fields: data.BLOOD_PATIENT.fields.map(
                      ({ label, value }) => ({ label, value }),
                    ),
                  },
                  summary: data.BLOOD_SUMMARY,
                  metrics: data.BLOOD_REPORT,
                  conditions: data.BLOOD_CONDITIONS,
                  recommendations: data.BLOOD_RECOMMENDATIONS.map((r) => ({
                    icon: r.title.toLowerCase().includes("cholesterol")
                      ? "salad"
                      : r.title.toLowerCase().includes("movement")
                        ? "footprints"
                        : "leaf",
                    title: r.title,
                    body: r.body,
                  })),
                  questions: data.BLOOD_QUESTIONS,
                  wellness: Object.fromEntries(
                    Object.entries(data.WELLNESS).map(([k, v]) => [
                      k,
                      { label: v.label, icon: k, tips: v.tips },
                    ]),
                  ),
                }
              : {
                  kind: "xray" as const,
                  patient: {
                    ...data.XRAY_PATIENT,
                    fields: data.XRAY_PATIENT.fields.map(
                      ({ label, value }) => ({ label, value }),
                    ),
                  },
                  summary: data.XRAY_SUMMARY,
                  findings: data.XRAY_FINDINGS,
                  conditions: data.XRAY_CONDITIONS,
                  recommendations: data.XRAY_RECOMMENDATIONS.map((r) => ({
                    icon: r.title.toLowerCase().includes("airway")
                      ? "wind"
                      : r.title.toLowerCase().includes("move")
                        ? "footprints"
                        : "flask",
                    title: r.title,
                    body: r.body,
                  })),
                  questions: data.XRAY_QUESTIONS,
                  wellness: Object.fromEntries(
                    Object.entries(data.WELLNESS).map(([k, v]) => [
                      k,
                      { label: v.label, icon: k, tips: v.tips },
                    ]),
                  ),
                };

          const entry: HistoryEntry = {
            id: uuid(),
            kind,
            date: new Date().toISOString(),
            patientName: result.patient.name,
            summaryHeadline: result.summary.headline,
            result,
          };

          set((state) => ({
            kind,
            stage: "results",
            fileName:
              kind === "blood"
                ? "sample_blood_report.pdf"
                : "sample_xray.jpg",
            uploadedImageUrl: null,
            result,
            error: null,
            chatMessages: [],
            suggestedQuestions: [],
            history: [entry, ...state.history].slice(0, MAX_HISTORY),
          }));
        });
      },

      // ── setStage() ────────────────────────────────────────
      setStage: (stage) => set({ stage }),

      // ── reset() ───────────────────────────────────────────
      reset: () => {
        const { uploadedImageUrl } = get();
        if (uploadedImageUrl) {
          URL.revokeObjectURL(uploadedImageUrl);
        }
        set({
          kind: null,
          stage: "idle",
          result: null,
          error: null,
          fileName: "",
          uploadedImageUrl: null,
          chatMessages: [],
          chatLoading: false,
          suggestedQuestions: [],
        });
      },

      // ── sendChat() ────────────────────────────────────────
      sendChat: async (message) => {
        if (get().chatLoading) return;
        const { result, kind, chatMessages } = get();
        if (!result || !kind) return;

        const userMsg: ChatMessage = {
          role: "user",
          content: message,
          timestamp: Date.now(),
        };

        set((state) => ({
          chatMessages: [...state.chatMessages, userMsg],
          chatLoading: true,
        }));

        try {
          const response = await sendChatMessage(
            message,
            kind,
            result,
            chatMessages,
          );

          const assistantMsg: ChatMessage = {
            role: "assistant",
            content: response.reply,
            timestamp: Date.now(),
          };

          set((state) => ({
            chatMessages: [...state.chatMessages, assistantMsg],
            chatLoading: false,
            suggestedQuestions: response.suggestedFollowUps,
          }));
        } catch {
          const errorMsg: ChatMessage = {
            role: "assistant",
            content:
              "I'm having a little trouble right now. Could you try asking again? 💚",
            timestamp: Date.now(),
          };

          set((state) => ({
            chatMessages: [...state.chatMessages, errorMsg],
            chatLoading: false,
          }));
        }
      },

      // ── clearChat() ──────────────────────────────────────
      clearChat: () => set({ chatMessages: [], suggestedQuestions: [] }),

      // ── loadFromHistory() ─────────────────────────────────
      loadFromHistory: (id) => {
        const entry = get().history.find((h) => h.id === id);
        if (!entry) return;

        set({
          kind: entry.kind,
          stage: "results",
          fileName: `${entry.patientName} — ${entry.date.split("T")[0]}`,
          result: entry.result,
          error: null,
          chatMessages: [],
          chatLoading: false,
          suggestedQuestions: [],
        });
      },

      // ── deleteFromHistory() ───────────────────────────────
      deleteFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),

      // ── clearAllHistory() ─────────────────────────────────
      clearAllHistory: () => set({ history: [] }),
    }),

    // ── Persist Config ──────────────────────────────────────
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        history: state.history,
      }),
    },
  ),
);
