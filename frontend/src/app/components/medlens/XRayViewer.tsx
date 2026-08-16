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
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { STATUS_META } from "./data";
import { useMedLensStore } from "../../lib/store";
import type { XRayAnalysisResponse } from "../../lib/types";
import { PatientCard } from "./PatientCard";
import { ConditionsSection } from "./ConditionsSection";
import { QuestionsSection } from "./QuestionsSection";
import { Recommendations } from "./Recommendations";
import { ResultActions } from "./ResultActions";
import { fadeUp, stagger, softScale } from "./anim";

const XRAY_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23e8e0d8'%3E%3Crect width='600' height='600'/%3E%3Ctext x='300' y='300' text-anchor='middle' fill='%23635b78' font-family='sans-serif' font-size='18'%3EChest X-Ray Preview%3C/text%3E%3C/svg%3E";



export function XRayViewer({ onReset }: { onReset: () => void }) {
  const [heatmap, setHeatmap] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

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
    <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[14px] font-semibold text-clay-slate shadow-sm transition-colors hover:bg-clay-cream"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-clay-terracotta px-5 py-2.5 text-[14px] font-bold text-white shadow-sm transition-colors hover:opacity-90"
        >
          <RotateCcw className="size-4" aria-hidden />
          Analyze Another Scan
        </button>
      </div>

      {/* Patient details */}
      <PatientCard patient={patient} />

      {/* Summary */}
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
              <CheckCircle2 className="size-3.5" aria-hidden /> X-Ray Vision
              Summary
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

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Preview + overlay */}
        <section
          aria-labelledby="preview-heading"
          className="rounded-[24px] clay bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="preview-heading"
              className="font-display font-bold text-clay-slate"
            >
              Uploaded X-Ray
            </h2>
            <button
              onClick={() => setHeatmap((h) => !h)}
              aria-pressed={heatmap}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                heatmap
                  ? "bg-clay-terracotta text-white clay-btn"
                  : "clay bg-white text-clay-slate"
              }`}
            >
              <Layers className="size-4" aria-hidden /> AI heatmap{" "}
              {heatmap ? "on" : "off"}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[18px] bg-clay-slate">
            <ImageWithFallback
              src={uploadedImageUrl || XRAY_IMG}
              alt="Chest X-ray radiograph, posteroanterior view showing clear lung fields and a normal heart silhouette"
              className="h-[360px] w-full object-cover opacity-95"
            />
            {heatmap && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 35% 40%, rgba(107,184,154,0.55), transparent 32%), radial-gradient(circle at 65% 40%, rgba(107,184,154,0.55), transparent 32%)",
                  mixBlendMode: "screen",
                }}
                aria-hidden
              />
            )}


          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-clay-muted">
            <Info className="size-3.5" aria-hidden /> Tap the numbered dots to
            explore each region.
          </p>
        </section>

        {/* Findings cards + confidence indicators */}
        <section
          aria-labelledby="findings-heading"
          className="rounded-[24px] clay bg-white p-5"
        >
          <h2
            id="findings-heading"
            className="mb-1 font-display font-bold text-clay-slate"
          >
            Findings
          </h2>
          <p className="mb-4 text-[13px] text-clay-muted">
            Model confidence · DenseNet / ViT
          </p>

          <motion.ul
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {findings.map((f) => {
              const meta = STATUS_META[f.status] ?? STATUS_META.optimal;
              const Icon = meta.icon;
              return (
                <motion.li
                  key={f.label}
                  variants={fadeUp}
                  className="rounded-[16px] clay-cream p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold text-clay-slate">
                      <Icon
                        className="size-4"
                        style={{ color: meta.color }}
                        aria-hidden
                      />
                      {f.label}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-1 font-display text-[13px] font-bold"
                      style={{ background: meta.soft, color: meta.color }}
                    >
                      {f.probability}%
                    </span>
                  </div>
                  <div
                    className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/70"
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
                  <p className="mt-1.5 text-[13px] text-clay-muted">{f.note}</p>
                </motion.li>
              );
            })}
          </motion.ul>
        </section>
      </div>

      {/* Condition screening / disease section */}
      <ConditionsSection
        conditions={conditions}
        title="What we screened for"
        subtitle="Likelihood of common chest findings. A friendly first look, never a diagnosis."
      />

      {/* What to do to get better */}
      <section aria-labelledby="xray-whattodo-heading" className="pt-4">
        <div className="mb-1 flex items-center gap-2">
          <HeartHandshake className="size-5 text-clay-terracotta" aria-hidden />
          <h2
            id="xray-whattodo-heading"
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            What to do to stay well
          </h2>
        </div>
        <p className="mb-4 text-[14px] text-clay-muted">
          Gentle habits to keep your lungs and heart feeling their best.
        </p>
        <Recommendations items={recommendations} bare />
      </section>

      {/* Questions to ask your doctor */}
      <QuestionsSection questions={questions} />

      <div className="mt-10 rounded-[24px] clay bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-[17px] font-bold text-clay-slate">
          <Sparkles className="size-4 text-clay-terracotta" aria-hidden /> Take
          it with you
        </h2>
        <p className="mt-1 mb-4 text-[15px] text-clay-muted">
          Download your scan summary or share it with your care team.
        </p>
        <ResultActions onReset={onReset} />
      </div>
    </div>
  );
}
