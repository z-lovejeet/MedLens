import type {
  AnalysisResponse,
  BloodAnalysisResponse,
  XRayAnalysisResponse,
} from "../../lib/types";

export function buildReportText(result: AnalysisResponse): string {
  const stamp = new Date().toLocaleString();
  if (result.kind === "blood") {
    const bloodResult = result as BloodAnalysisResponse;
    const lines = bloodResult.metrics.map(
      (m) => `• ${m.name}: ${m.value} ${m.unit}  [${m.tag}] (healthy ${m.min}–${m.max})`,
    );
    return [
      "MedLens Blood Report Summary",
      `Generated: ${stamp}`,
      "",
      `Overall: ${bloodResult.summary.headline}`,
      bloodResult.summary.body,
      "",
      "Markers:",
      ...lines,
      "",
      "This is an AI educational summary, not a diagnosis. Please consult a licensed healthcare professional.",
    ].join("\n");
  }

  const xrayResult = result as XRayAnalysisResponse;
  const lines = xrayResult.findings.map(
    (f) => `• ${f.label}: ${f.probability}% - ${f.note}`,
  );
  return [
    "MedLens Chest X-Ray Summary",
    `Generated: ${stamp}`,
    "",
    `Overall: ${xrayResult.summary.headline}`,
    xrayResult.summary.body,
    "",
    "Findings (model confidence):",
    ...lines,
    "",
    "This is an AI educational summary, not a diagnosis. Please consult a licensed healthcare professional.",
  ].join("\n");
}

export function downloadReport(result: AnalysisResponse) {
  const text = buildReportText(result);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `medlens-${result.kind}-summary.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Returns "shared" | "copied" so caller can toast appropriately. */
export async function shareReport(
  result: AnalysisResponse,
): Promise<"shared" | "copied" | void> {
  const text = buildReportText(result);
  if (navigator.share) {
    try {
      await navigator.share({ title: "My MedLens summary", text });
      return "shared";
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return; // User cancelled share dialog
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
