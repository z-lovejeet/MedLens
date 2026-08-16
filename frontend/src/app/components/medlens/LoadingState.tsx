import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Check, Loader2, BrainCircuit, Sparkles, Clock } from "lucide-react";
import { BLOOD_PIPELINE_STEPS, XRAY_PIPELINE_STEPS } from "./data";
import type { Kind } from "../../lib/types";

interface LoadingStateProps {
  fileName: string;
  kind?: Kind;
  onDone?: () => void;
}

export function LoadingState({ fileName, kind = "blood" }: LoadingStateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const steps = kind === "xray" ? XRAY_PIPELINE_STEPS : BLOOD_PIPELINE_STEPS;

  // Elapsed timer tick every 100ms
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = (now - startTimeRef.current) / 1000;
      setElapsed(seconds);

      if (kind === "xray") {
        // X-Ray Pipeline: 3 steps
        // Step 0 (X-Ray Vision): 0.0s - 4.5s
        // Step 1 (Explainer): 4.5s - 8.5s
        // Step 2 (Recommender/Wellness): 8.5s+
        if (seconds < 4.5) {
          setActiveStep(0);
        } else if (seconds < 8.5) {
          setActiveStep(1);
        } else {
          setActiveStep(2);
        }
      } else {
        // Blood Pipeline: 4 steps
        // Step 0 (OCR): 0.0s - 4.0s
        // Step 1 (Parser): 4.0s - 8.0s
        // Step 2 (Explainer): 8.0s - 12.0s
        // Step 3 (Recommender/Wellness): 12.0s+
        if (seconds < 4.0) {
          setActiveStep(0);
        } else if (seconds < 8.0) {
          setActiveStep(1);
        } else if (seconds < 12.0) {
          setActiveStep(2);
        } else {
          setActiveStep(3);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [kind]);

  // Smooth progress calculation
  const calculatedProgress = Math.min(
    95,
    Math.round(
      kind === "xray"
        ? activeStep === 0
          ? Math.min(33, (elapsed / 4.5) * 33)
          : activeStep === 1
          ? 33 + Math.min(33, ((elapsed - 4.5) / 4.0) * 33)
          : 66 + Math.min(29, ((elapsed - 8.5) / 4.5) * 29)
        : activeStep === 0
        ? Math.min(25, (elapsed / 4.0) * 25)
        : activeStep === 1
        ? 25 + Math.min(25, ((elapsed - 4.0) / 4.0) * 25)
        : activeStep === 2
        ? 50 + Math.min(25, ((elapsed - 8.0) / 4.0) * 25)
        : 75 + Math.min(20, ((elapsed - 12.0) / 5.0) * 20),
    ),
  );

  const current = steps[Math.min(activeStep, steps.length - 1)];

  return (
    <section aria-labelledby="processing-heading" className="mx-auto max-w-2xl px-4 pt-8 pb-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-[22px] bg-clay-terracotta text-white clay-btn clay-pulse">
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrainCircuit className="size-8" aria-hidden />
          </motion.span>
        </div>
        <h1 id="processing-heading" className="font-display text-[28px] font-bold text-clay-slate">
          {kind === "xray"
            ? "Our AI team is translating your scan"
            : "Our AI team is translating your report"}
        </h1>
        <p className="mt-1 text-clay-muted">
          {kind === "xray" ? "Translating" : "Translating"}{" "}
          <span className="font-semibold text-clay-slate">{fileName || "file"}</span>
        </p>

        {/* Live Elapsed Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[12.5px] font-semibold text-clay-slate shadow-2xs border border-black/5">
          <Clock className="size-3.5 text-clay-terracotta animate-pulse" aria-hidden />
          <span>Processing: {elapsed.toFixed(1)}s</span>
        </div>
      </div>

      {/* Fluid progress bar */}
      <div className="mx-auto mb-6 max-w-md">
        <div className="h-2.5 overflow-hidden rounded-full clay-inset bg-cream">
          <motion.div
            className="h-full rounded-full bg-clay-terracotta"
            style={{ width: `${calculatedProgress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-clay-muted px-1">
          <span>{current?.title || "Multi-Agent Pipeline"}</span>
          <span>{calculatedProgress}%</span>
        </div>
      </div>

      {/* Screen-reader live announcement */}
      <p role="status" aria-live="polite" className="sr-only">
        {current?.title}: {current?.detail} {calculatedProgress}% complete.
      </p>

      {/* Dynamic agent step checklist */}
      <ol className="space-y-3.5">
        {steps.map((step, i) => {
          const isDone = activeStep > i;
          const isRunning = activeStep === i;
          const StepIcon = step.icon;

          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 rounded-[22px] px-5 py-4 transition-all duration-300 ${
                isRunning
                  ? "clay bg-white border-2 border-clay-terracotta/30 shadow-md scale-[1.01]"
                  : isDone
                  ? "clay bg-white/90"
                  : "clay-cream opacity-50"
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-[14px] transition-colors ${
                  isDone
                    ? "bg-clay-sage/20 text-clay-sage"
                    : isRunning
                    ? "bg-clay-terracotta/15 text-clay-terracotta"
                    : "bg-cream text-clay-muted"
                }`}
              >
                <StepIcon className="size-5" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display font-semibold text-clay-slate text-[15px]">
                    {step.title}
                  </p>
                  {isRunning && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-clay-terracotta/10 px-2 py-0.5 text-[11px] font-bold text-clay-terracotta animate-pulse">
                      <Sparkles className="size-3" /> Active
                    </span>
                  )}
                </div>
                <p className="truncate text-[13.5px] text-clay-muted mt-0.5">{step.detail}</p>
              </div>

              <span className="shrink-0">
                {isDone ? (
                  <span
                    className="grid size-8 place-items-center rounded-full bg-clay-sage text-white shadow-2xs"
                    aria-label="completed"
                  >
                    <Check className="size-4 stroke-[3]" aria-hidden />
                  </span>
                ) : isRunning ? (
                  <span className="grid size-8 place-items-center rounded-full bg-clay-terracotta/10">
                    <Loader2 className="size-5 animate-spin text-clay-terracotta" aria-label="in progress" />
                  </span>
                ) : (
                  <span className="size-8" />
                )}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
