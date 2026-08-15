/**
 * Shared TypeScript interfaces for MedLens.
 * These match the backend Pydantic schemas exactly.
 * Source of truth: docs/11-api-contract.md + backend/api/schemas.py
 */

// ─── Core Enums ─────────────────────────────────────────────

export type Status = "optimal" | "borderline" | "attention";
export type Kind = "blood" | "xray";
export type Stage = "idle" | "loading" | "results" | "error";
export type AnalysisErrorType = "timeout" | "parsing" | "server";

// ─── Patient ────────────────────────────────────────────────

export interface PatientField {
  label: string;
  value: string;
}

export interface Patient {
  name: string;
  initials: string;
  age: number;
  gender: string;
  fields: PatientField[];
}

// ─── Blood Metrics ──────────────────────────────────────────

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  scaleMin: number;
  scaleMax: number;
  status: Status;
  tag: string;
  plain: string;
}

// ─── X-Ray Findings ─────────────────────────────────────────

export interface XRayFinding {
  label: string;
  probability: number;
  status: Status;
  note: string;
}

// ─── Shared ─────────────────────────────────────────────────

export interface Condition {
  name: string;
  chance: number;
  status: Status;
  blurb: string;
}

export interface Recommendation {
  icon: string; // icon key resolved client-side via resolveIcon()
  title: string;
  body: string;
}

export interface WellnessTip {
  title: string;
  body: string;
}

export interface WellnessCategory {
  label: string;
  icon: string; // icon key resolved client-side
  tips: WellnessTip[];
}

export interface Summary {
  headline: string;
  body: string;
}

// ─── API Responses ──────────────────────────────────────────

export interface BloodAnalysisResponse {
  kind: "blood";
  patient: Patient;
  summary: Summary;
  metrics: Metric[];
  conditions: Condition[];
  recommendations: Recommendation[];
  questions: string[];
  wellness: Record<string, WellnessCategory>;
}

export interface XRayAnalysisResponse {
  kind: "xray";
  patient: Patient;
  summary: Summary;
  findings: XRayFinding[];
  conditions: Condition[];
  recommendations: Recommendation[];
  questions: string[];
  wellness: Record<string, WellnessCategory>;
}

export type AnalysisResponse = BloodAnalysisResponse | XRayAnalysisResponse;

// ─── Chat ───────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  reply: string;
  suggestedFollowUps: string[];
}

// ─── History ────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  kind: Kind;
  date: string; // ISO timestamp
  patientName: string; // quick label for history list
  summaryHeadline: string; // quick preview text
  result: AnalysisResponse; // full result data for reload
}
