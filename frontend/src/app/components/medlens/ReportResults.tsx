import { motion } from "motion/react";
import {
  Sparkles,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  Info,
  HeartHandshake,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import type { BloodAnalysisResponse } from "../../lib/types";
import { MetricCard } from "./MetricCard";
import { PatientCard } from "./PatientCard";
import { ConditionsSection } from "./ConditionsSection";
import { QuestionsSection } from "./QuestionsSection";
import { Recommendations } from "./Recommendations";
import { ResultActions } from "./ResultActions";
import { fadeUp, stagger, softScale } from "./anim";

export function ReportResults({ onReset }: { onReset: () => void }) {
  const result = useMedLensStore((s) => s.result) as BloodAnalysisResponse | null;
  if (!result) return null;

  const {
    patient,
    summary,
    metrics = [],
    conditions = [],
    recommendations = [],
    questions = [],
  } = result;

  const optimal = metrics.filter((m) => m.status === "optimal").length;
  const watch = metrics.filter((m) => m.status === "borderline").length;
  const attention = metrics.filter((m) => m.status === "attention").length;

  const stats = [
    { icon: CheckCircle2, label: "Optimal", value: optimal, color: "#6bb89a" },
    { icon: AlertTriangle, label: "Slightly off", value: watch, color: "#eba85c" },
    { icon: Info, label: "Worth asking", value: attention, color: "#e48267" },
  ];

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
          Analyze Another Report
        </button>
      </div>

      {/* Patient details */}
      <PatientCard patient={patient} />

      {/* Overall summary */}
      <motion.section
        aria-labelledby="summary-heading"
        variants={softScale}
        initial="hidden"
        animate="show"
        className="overflow-hidden rounded-[28px] clay p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, #e7f4ee, #d5ede1)" }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-clay-sage text-white clay-btn">
                <Leaf className="size-7" aria-hidden />
              </span>
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[13px] font-semibold text-clay-sage">
                  <Sparkles className="size-3.5" aria-hidden /> Overall Health Summary
                </div>
                <h1
                  id="summary-heading"
                  className="font-display text-[22px] font-bold leading-snug text-clay-slate"
                >
                  {summary.headline}
                </h1>
                <p className="mt-1.5 text-[15px] leading-relaxed text-clay-slate/80">
                  {summary.body}
                </p>
              </div>
            </div>
          </div>

          {/* stat tiles */}
          <ul className="grid shrink-0 grid-cols-3 gap-3 lg:w-64">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.label}
                  className="rounded-[18px] bg-white/70 p-3 text-center"
                >
                  <Icon
                    className="mx-auto size-5"
                    style={{ color: s.color }}
                    aria-hidden
                  />
                  <p className="mt-1 font-display text-[22px] font-bold text-clay-slate">
                    {s.value}
                  </p>
                  <p className="text-[11px] font-semibold text-clay-muted">
                    {s.label}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.section>

      {/* Detailed Breakdown — one card per attribute */}
      <section aria-labelledby="breakdown-heading" className="pt-4">
        <div className="mb-4">
          <h2
            id="breakdown-heading"
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            Your markers, decoded
          </h2>
          <p className="text-[14px] text-clay-muted">
            Every value from your report — with a plain-English translation and
            where it sits in the healthy range.
          </p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {metrics.map((m) => (
            <motion.div key={m.id} variants={fadeUp}>
              <MetricCard metric={m} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Condition screening / disease section */}
      <ConditionsSection conditions={conditions} />

      {/* What to do to get better */}
      <section aria-labelledby="whattodo-heading" className="pt-4">
        <div className="mb-1 flex items-center gap-2">
          <HeartHandshake className="size-5 text-clay-terracotta" aria-hidden />
          <h2
            id="whattodo-heading"
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            What to do to feel better
          </h2>
        </div>
        <p className="mb-4 text-[14px] text-clay-muted">
          Small, cozy steps that gently nudge your numbers in a happier direction.
        </p>
        <Recommendations items={recommendations} bare />
      </section>

      {/* Questions to ask your doctor */}
      <QuestionsSection questions={questions} />

      {/* Actions */}
      <div className="mt-10 rounded-[24px] clay bg-white p-6">
        <h2 className="font-display text-[17px] font-bold text-clay-slate">
          Take it with you
        </h2>
        <p className="mt-1 mb-4 text-[15px] text-clay-muted">
          Save a plain-language summary or share it with someone you trust.
        </p>
        <ResultActions onReset={onReset} />
      </div>
    </div>
  );
}
