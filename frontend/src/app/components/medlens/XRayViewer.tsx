import { useState } from "react";
import { motion } from "motion/react";
import {
  Layers,
  CheckCircle2,
  Info,
  Wind,
  Sparkles,
  HeartHandshake,
  ArrowLeft,
  RotateCcw,
  Activity,
  HeartPulse,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { STATUS_META } from "./data";
import { useMedLensStore } from "../../lib/store";
import type { XRayAnalysisResponse, Status } from "../../lib/types";
import { PatientCard } from "./PatientCard";
import { ConditionsSection } from "./ConditionsSection";
import { QuestionsSection } from "./QuestionsSection";
import { Recommendations } from "./Recommendations";
import { ResultActions } from "./ResultActions";
import { fadeUp, stagger, softScale } from "./anim";

const XRAY_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23e8e0d8'%3E%3Crect width='600' height='600'/%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%23635b78' font-family='sans-serif' font-size='18'%3EChest X-Ray Preview%3C/text%3E%3C/svg%3E";

function getFindingMeta(label: string, probability: number, status?: Status) {
  const labelLower = label.toLowerCase();
  const isHealthyFinding =
    labelLower.includes("clear") ||
    labelLower.includes("normal") ||
    labelLower.includes("healthy") ||
    labelLower.includes("aerat");

  if (isHealthyFinding) {
    if (probability >= 60) {
      return {
        color: "#6bb89a",
        soft: "#e7f4ee",
        label: "Optimal",
        icon: HeartPulse,
      };
    }
    if (probability >= 35) {
      return {
        color: "#eba85c",
        soft: "#fbf0e2",
        label: "Slightly off",
        icon: Activity,
      };
    }
    return {
      color: "#e48267",
      soft: "#fbebe6",
      label: "Worth asking",
      icon: Info,
    };
  }

  // Pathology findings (e.g. Infiltration, Cardiomegaly, Effusion, Nodule)
  if (status && STATUS_META[status]) {
    return STATUS_META[status];
  }

  if (probability <= 20) {
    return STATUS_META.optimal;
  }
  if (probability <= 50) {
    return STATUS_META.borderline;
  }
  return STATUS_META.attention;
}

export function XRayViewer({ onReset }: { onReset: () => void }) {
  const [heatmap, setHeatmap] = useState(false);

  const result = useMedLensStore((s) => s.result) as XRayAnalysisResponse | null;
  const uploadedImageUrl = useMedLensStore((s) => s.uploadedImageUrl);
  if (!result) return null;

  const {
    patient,
    summary,
    findings = [],
    conditions = [],
    recommendations = [],
    questions = [],
  } = result;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pt-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold clay-btn-light cursor-pointer"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-clay-terracotta px-5 py-2 text-[14px] font-bold text-white clay-btn cursor-pointer"
        >
          <RotateCcw className="size-4" aria-hidden />
          Analyze Another Scan
        </button>
      </div>

      {/* Patient details */}
      <PatientCard patient={patient} />

      {/* X-Ray Vision Summary */}
      <motion.section
        aria-labelledby="xray-summary-heading"
        variants={softScale}
        initial="hidden"
        animate="show"
        className="rounded-[28px] clay p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, #e7f4ee, #d5ede1)" }}
      >
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-clay-sage text-white clay-btn">
            <Wind className="size-7" aria-hidden />
          </span>
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[13px] font-semibold text-clay-sage">
              <CheckCircle2 className="size-3.5" aria-hidden /> X-Ray Translation
            </div>
            <h1
              id="xray-summary-heading"
              className="font-display text-[22px] font-bold text-clay-slate"
            >
              {summary.headline}
            </h1>
            <p className="mt-1.5 text-[15px] leading-relaxed text-clay-slate/80">
              {summary.body}
            </p>
          </div>
        </div>
      </motion.section>

      {/* 1. Centered X-Ray Preview Card */}
      <section
        aria-labelledby="preview-heading"
        className="mx-auto max-w-xl rounded-[28px] clay bg-white p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              id="preview-heading"
              className="font-display text-[18px] font-bold text-clay-slate"
            >
              Your Chest X-Ray
            </h2>
            <p className="text-[13px] text-clay-muted">Posteroanterior (PA) view</p>
          </div>
          <button
            onClick={() => setHeatmap((h) => !h)}
            aria-pressed={heatmap}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all cursor-pointer ${
              heatmap
                ? "bg-clay-terracotta text-white clay-btn"
                : "clay bg-white text-clay-slate hover:bg-clay-cream/50"
            }`}
          >
            <Layers className="size-4" aria-hidden /> AI heatmap{" "}
            {heatmap ? "on" : "off"}
          </button>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden rounded-[20px] bg-black/95 p-1 shadow-inner">
          <ImageWithFallback
            src={uploadedImageUrl || XRAY_IMG}
            alt="Chest X-ray radiograph, posteroanterior view showing clear lung fields and thoracic anatomy"
            className="max-h-[420px] w-auto object-contain rounded-[18px]"
          />
          {heatmap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0 rounded-[18px]"
              style={{
                background:
                  "radial-gradient(circle at 35% 40%, rgba(107,184,154,0.55), transparent 32%), radial-gradient(circle at 65% 40%, rgba(107,184,154,0.55), transparent 32%)",
                mixBlendMode: "screen",
              }}
              aria-hidden
            />
          )}
        </div>
        <p className="mt-3 text-center text-[13px] text-clay-muted">
          AI thoracic field segmentation with regional density map.
        </p>
      </section>

      {/* 2. Findings Section — Single-Column Full-Width List */}
      <section
        aria-labelledby="findings-heading"
        className="rounded-[28px] clay bg-white p-6 sm:p-8"
      >
        <div className="mb-5">
          <h2
            id="findings-heading"
            className="font-display text-[20px] font-bold text-clay-slate"
          >
            What we found, translated
          </h2>
          <p className="text-[14px] text-clay-muted">
            Each region of your scan, explained in your language.
          </p>
        </div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3.5"
        >
          {findings.map((f) => {
            const meta = getFindingMeta(f.label, f.probability, f.status);
            const Icon = meta.icon;
            return (
              <motion.li
                key={f.label}
                variants={fadeUp}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="rounded-[20px] clay-cream p-5 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 font-display text-[16px] font-bold text-clay-slate">
                    <Icon
                      className="size-5"
                      style={{ color: meta.color }}
                      aria-hidden
                    />
                    {f.label}
                  </span>
                  <span
                    className="rounded-full px-3 py-1 font-display text-[13px] font-bold"
                    style={{ background: meta.soft, color: meta.color }}
                  >
                    {f.probability}%
                  </span>
                </div>

                <div
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/80 clay-inset"
                  role="meter"
                  aria-valuenow={f.probability}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${f.label} confidence`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.probability}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 20,
                    }}
                    className="h-full rounded-full"
                    style={{ background: meta.color }}
                  />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-clay-slate/85">
                  {f.note ||
                    (f.label.toLowerCase().includes("clear")
                      ? "Your lung fields look open and well-aerated with healthy expansion."
                      : `Model observed a ${f.probability}% probability for this regional marker.`)}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </section>

      {/* Condition screening / disease section (Single-Column) */}
      <ConditionsSection
        conditions={conditions}
        title="What we checked for you"
        subtitle="Likelihood of common findings, translated honestly. Always consult your doctor."
      />

      {/* What to do to stay well */}
      <section aria-labelledby="xray-whattodo-heading" className="pt-2">
        <div className="mb-1 flex items-center gap-2">
          <HeartHandshake className="size-5 text-clay-terracotta" aria-hidden />
          <h2
            id="xray-whattodo-heading"
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            What your lungs are asking for
          </h2>
        </div>
        <p className="mb-4 text-[14px] text-clay-muted">
          Gentle habits and breathing practices your doctor would recommend.
        </p>
        <Recommendations items={recommendations} bare />
      </section>

      {/* Questions to ask your doctor */}
      <QuestionsSection questions={questions} />

      {/* Take it with you / Export PDF */}
      <div className="mt-10 rounded-[24px] clay bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-[17px] font-bold text-clay-slate">
          <Sparkles className="size-4 text-clay-terracotta" aria-hidden /> Take
          it with you
        </h2>
        <p className="mt-1 mb-4 text-[15px] text-clay-muted">
          Download your translated scan summary PDF or share it with your care team.
        </p>
        <ResultActions onReset={onReset} />
      </div>
    </div>
  );
}
