import { jsPDF } from "jspdf";
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
      (m) => `• ${m.name}: ${m.value} ${m.unit} [${m.tag}] (healthy ${m.min}–${m.max}) - ${m.plain}`,
    );
    return [
      "=========================================",
      "MEDLENS TRANSLATED REPORT SUMMARY",
      `Generated: ${stamp}`,
      `Patient: ${bloodResult.patient.name} (${bloodResult.patient.age} y/o, ${bloodResult.patient.gender})`,
      "=========================================",
      "",
      `OVERALL SUMMARY: ${bloodResult.summary.headline}`,
      bloodResult.summary.body,
      "",
      "TRANSLATED MARKERS:",
      ...lines,
      "",
      "QUESTIONS FOR YOUR NEXT APPOINTMENT:",
      ...bloodResult.questions.map((q, i) => `${i + 1}. ${q}`),
      "",
      "DISCLAIMER:",
      "This is an AI translation of your medical report, not a clinical diagnosis. Always consult a licensed healthcare professional.",
    ].join("\n");
  }

  const xrayResult = result as XRayAnalysisResponse;
  const lines = xrayResult.findings.map(
    (f) => `• ${f.label}: ${f.probability}% confidence - ${f.note}`,
  );
  return [
    "=========================================",
    "MEDLENS X-RAY TRANSLATION SUMMARY",
    `Generated: ${stamp}`,
    `Patient: ${xrayResult.patient.name} (${xrayResult.patient.age} y/o, ${xrayResult.patient.gender})`,
    "=========================================",
    "",
    `OVERALL SUMMARY: ${xrayResult.summary.headline}`,
    xrayResult.summary.body,
    "",
    "FINDINGS & REGIONAL CONFIDENCE:",
    ...lines,
    "",
    "QUESTIONS FOR YOUR NEXT APPOINTMENT:",
    ...xrayResult.questions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "DISCLAIMER:",
    "This is an AI translation of your scan, not a clinical diagnosis. Always consult a licensed healthcare professional.",
  ].join("\n");
}

export function downloadReport(result: AnalysisResponse) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = 18;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
    };

    // ── 1. Top Header Banner ──
    doc.setFillColor(138, 111, 176); // Brand Lavender #8a6fb0
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MedLens Translated Report", margin + 6, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(
      `Type: ${result.kind === "blood" ? "Blood Work & Lab Panel" : "Chest X-Ray Scan"}  |  Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
      margin + 6,
      y + 16,
    );

    y += 28;

    // ── 2. Patient Demographics Card ──
    doc.setFillColor(248, 246, 242); // Warm Cream
    doc.setDrawColor(225, 220, 212);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, "FD");

    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text(`Patient: ${result.patient.name}`, margin + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Age: ${result.patient.age}  |  Gender: ${result.patient.gender}  |  Translated by: Multi-Agent AI`,
      margin + 5,
      y + 13,
    );

    y += 24;

    // ── 3. Executive Health Summary ──
    checkPageBreak(30);
    doc.setTextColor(138, 111, 176);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Your Report, Translated", margin, y);
    y += 6;

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const headlineLines = doc.splitTextToSize(result.summary.headline, contentWidth);
    doc.text(headlineLines, margin, y);
    y += headlineLines.length * 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const bodyLines = doc.splitTextToSize(result.summary.body, contentWidth);
    doc.text(bodyLines, margin, y);
    y += bodyLines.length * 4.8 + 6;

    // ── 4. Decoded Markers / Findings ──
    if (result.kind === "blood") {
      const blood = result as BloodAnalysisResponse;
      checkPageBreak(25);
      doc.setTextColor(138, 111, 176);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Your Markers, Translated", margin, y);
      y += 7;

      blood.metrics.forEach((m) => {
        const plainLines = doc.splitTextToSize(`• ${m.plain}`, contentWidth - 8);
        const cardHeight = 13 + plainLines.length * 4.2;
        checkPageBreak(cardHeight + 4);

        // Status pill styling
        doc.setFillColor(252, 252, 253);
        doc.setDrawColor(230, 233, 238);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(m.name, margin + 4, y + 6);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        const tagText = `[ ${m.tag} ]`;
        const tagWidth = doc.getTextWidth(tagText);
        doc.setTextColor(
          m.status === "optimal" ? 46 : m.status === "borderline" ? 180 : 210,
          m.status === "optimal" ? 139 : m.status === "borderline" ? 100 : 70,
          m.status === "optimal" ? 87 : m.status === "borderline" ? 20 : 50,
        );
        doc.text(tagText, margin + contentWidth - tagWidth - 4, y + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Measured Value: ${m.value} ${m.unit}  (Standard Reference: ${m.min} – ${m.max} ${m.unit})`,
          margin + 4,
          y + 10.5,
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.8);
        doc.setTextColor(51, 65, 85);
        doc.text(plainLines, margin + 4, y + 15);

        y += cardHeight + 3.5;
      });
    } else {
      const xray = result as XRayAnalysisResponse;
      checkPageBreak(25);
      doc.setTextColor(138, 111, 176);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Chest X-Ray Findings & Confidence", margin, y);
      y += 7;

      xray.findings.forEach((f) => {
        const noteLines = doc.splitTextToSize(`• ${f.note}`, contentWidth - 8);
        const cardHeight = 12 + noteLines.length * 4.2;
        checkPageBreak(cardHeight + 4);

        doc.setFillColor(252, 252, 253);
        doc.setDrawColor(230, 233, 238);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(f.label, margin + 4, y + 6);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        const confText = `Confidence: ${f.probability}%`;
        const confWidth = doc.getTextWidth(confText);
        doc.text(confText, margin + contentWidth - confWidth - 4, y + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.8);
        doc.setTextColor(51, 65, 85);
        doc.text(noteLines, margin + 4, y + 11.5);

        y += cardHeight + 3.5;
      });
    }

    // ── 5. What To Do To Feel Better / Recommendations ──
    if (result.recommendations && result.recommendations.length > 0) {
      checkPageBreak(30);
      y += 3;
      doc.setTextColor(138, 111, 176);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("What Your Body Is Quietly Asking For", margin, y);
      y += 7;

      result.recommendations.forEach((r) => {
        const bodyLines = doc.splitTextToSize(r.body, contentWidth - 8);
        const cardHeight = 10 + bodyLines.length * 4.2;
        checkPageBreak(cardHeight + 3);

        doc.setFillColor(254, 252, 248);
        doc.setDrawColor(240, 235, 225);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(45, 55, 72);
        doc.text(`✓  ${r.title}`, margin + 4, y + 5.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.8);
        doc.setTextColor(71, 85, 105);
        doc.text(bodyLines, margin + 7, y + 10);

        y += cardHeight + 3;
      });
    }

    // ── 6. Questions to Ask Your Doctor ──
    if (result.questions && result.questions.length > 0) {
      checkPageBreak(30);
      y += 3;
      doc.setTextColor(138, 111, 176);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Take These Words to Your Next Appointment", margin, y);
      y += 7;

      result.questions.forEach((q, idx) => {
        const qLines = doc.splitTextToSize(`${idx + 1}.  ${q}`, contentWidth - 6);
        const itemHeight = qLines.length * 4.5 + 4;
        checkPageBreak(itemHeight + 2);

        doc.setFillColor(245, 247, 250);
        doc.setDrawColor(230, 235, 242);
        doc.roundedRect(margin, y, contentWidth, itemHeight, 2, 2, "FD");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text(qLines, margin + 4, y + 5);

        y += itemHeight + 2.5;
      });
    }

    // ── 7. Footer Medical Disclaimer ──
    checkPageBreak(20);
    y += 5;
    doc.setDrawColor(210, 215, 220);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(130, 140, 150);
    const discLines = doc.splitTextToSize(
      "MedLens is an AI medical translator and does not provide clinical diagnoses or treatment plans. Always discuss your laboratory results and medical scans directly with your qualified healthcare provider.",
      contentWidth,
    );
    doc.text(discLines, margin, y);

    // Save formatted PDF directly
    const fileName = `MedLens-${result.kind === "blood" ? "Blood-Report" : "XRay"}-Summary.pdf`;
    doc.save(fileName);
  } catch (e) {
    console.error("PDF generation failed, falling back to text file:", e);
    // Fallback if browser environment prevents canvas/jsPDF
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
      if (err instanceof DOMException && err.name === "AbortError") return;
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}
