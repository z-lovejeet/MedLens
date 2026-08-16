/**
 * Icon resolver — maps API string keys to Lucide React icon components.
 *
 * The backend returns icon identifiers as plain strings (e.g. "salad", "moon").
 * Components that previously imported LucideIcon directly from data.ts now call
 * resolveIcon(key) to get the component.
 *
 * Also provides FIELD_ICON_MAP for patient fields, where the API provides
 * no icon — we derive the icon client-side from the field's label text.
 */

import {
  Salad,
  Footprints,
  Leaf,
  Wind,
  Moon,
  HeartPulse,
  FlaskConical,
  Droplets,
  Bone,
  Activity,
  Sparkles,
  ScanText,
  Info,
  type LucideIcon,
} from "lucide-react";

// ─── Category / Recommendation / Wellness Icon Map ──────────
export const ICON_MAP: Record<string, LucideIcon> = {
  salad: Salad,
  footprints: Footprints,
  leaf: Leaf,
  wind: Wind,
  moon: Moon,
  heart: HeartPulse,
  flask: FlaskConical,
  droplets: Droplets,
  bone: Bone,
  activity: Activity,
  sparkles: Sparkles,
  nutrition: Salad,
  sleep: Moon,
  stress: Wind,
};

export function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? Sparkles;
}

// ─── Patient Field Label → Icon Map ─────────────────────────
// The API returns PatientField as { label, value } with NO icon.
// We derive icons from well-known label strings.
export const FIELD_ICON_MAP: Record<string, LucideIcon> = {
  "patient id": Info,
  "blood group": Droplets,
  sample: FlaskConical,
  "report date": ScanText,
  "referred by": HeartPulse,
  lab: Activity,
  view: ScanText,
  "body part": Bone,
  "scan date": ScanText,
  modality: Activity,
};

export function resolveFieldIcon(label: string): LucideIcon {
  return FIELD_ICON_MAP[label.toLowerCase()] ?? Info;
}
