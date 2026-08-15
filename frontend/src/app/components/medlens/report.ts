import { BLOOD_REPORT, BLOOD_SUMMARY, XRAY_FINDINGS, XRAY_SUMMARY } from "./data";

export type Kind = "blood" | "xray";

export function buildReportText(kind: Kind): string {
  const stamp = new Date().toLocaleString();
  if (kind === "blood") {
    const lines = BLOOD_REPORT.map(
      (m) => `• ${m.name}: ${m.value} ${m.unit}  [${m.tag}] (healthy ${m.min}–${m.max})`,
    );
    return [
      "MedLens — Blood Report Summary",
      `Generated: ${stamp}`,
      "",
      `Overall: ${BLOOD_SUMMARY.headline}`,
      BLOOD_SUMMARY.body,
      "",
      "Markers:",
      ...lines,
      "",
      "This is an AI educational summary, not a diagnosis. Please consult a licensed healthcare professional.",
    ].join("\n");
  }
  const lines = XRAY_FINDINGS.map((f) => `• ${f.label}: ${f.probability}% — ${f.note}`);
  return [
    "MedLens — Chest X-Ray Summary",
    `Generated: ${stamp}`,
    "",
    `Overall: ${XRAY_SUMMARY.headline}`,
    XRAY_SUMMARY.body,
    "",
    "Findings (model confidence):",
    ...lines,
    "",
    "This is an AI educational summary, not a diagnosis. Please consult a licensed healthcare professional.",
  ].join("\n");
}

export function downloadReport(kind: Kind) {
  const text = buildReportText(kind);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `medlens-${kind}-summary.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Returns "shared" | "copied" so caller can toast appropriately. */
export async function shareReport(kind: Kind): Promise<"shared" | "copied" | void> {
  const text = buildReportText(kind);
  if (navigator.share) {
    try {
      await navigator.share({ title: "My MedLens summary", text });
      return "shared";
    } catch (err: any) {
      if (err?.name === 'AbortError') return; // User cancelled share dialog
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
