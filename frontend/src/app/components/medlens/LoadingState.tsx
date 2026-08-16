import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2, BrainCircuit } from "lucide-react";
import { PIPELINE_STEPS } from "./data";

interface LoadingStateProps {
  fileName: string;
  onDone: () => void;
}

export function LoadingState({ fileName, onDone }: LoadingStateProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    PIPELINE_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setActive(i + 1), (i + 1) * 1100));
    });
    timers.push(setTimeout(onDone, PIPELINE_STEPS.length * 1100 + 500));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const current = PIPELINE_STEPS[Math.min(active, PIPELINE_STEPS.length - 1)];
  const progress = Math.round((active / PIPELINE_STEPS.length) * 100);

  return (
    <section aria-labelledby="processing-heading" className="mx-auto max-w-2xl px-4 pt-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-[22px] bg-clay-terracotta text-white clay-btn clay-pulse">
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <BrainCircuit className="size-8" aria-hidden />
          </motion.span>
        </div>
        <h1 id="processing-heading" className="font-display text-[28px] font-bold text-clay-slate">
          Our AI team is on it
        </h1>
        <p className="mt-1 text-clay-muted">
          Reading <span className="font-semibold text-clay-slate">{fileName}</span> . This takes a few cozy seconds.
        </p>
      </div>

      {/* progress bar */}
      <div className="mx-auto mb-6 max-w-md">
        <div className="h-2.5 overflow-hidden rounded-full clay-inset bg-cream">
          <motion.div
            className="h-full rounded-full bg-clay-terracotta"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.6 }}
          />
        </div>
      </div>

      {/* Screen-reader live announcement */}
      <p role="status" aria-live="polite" className="sr-only">
        {current.title}: {current.detail} {progress}% complete.
      </p>

      <ol className="space-y-3">
        {PIPELINE_STEPS.map((step, i) => {
          const done = active > i + 1;
          const running = active === i + 1 || (active === 0 && i === 0);
          const StepIcon = step.icon;
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 rounded-[20px] px-5 py-4 transition-all ${
                done || running ? "clay bg-white" : "clay-cream opacity-60"
              }`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-cream text-clay-terracotta">
                <StepIcon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-clay-slate">{step.title}</p>
                <p className="truncate text-[14px] text-clay-muted">{step.detail}</p>
              </div>
              <span className="shrink-0">
                {done ? (
                  <span className="grid size-8 place-items-center rounded-full bg-clay-sage text-white" aria-label="done">
                    <Check className="size-4" aria-hidden />
                  </span>
                ) : running ? (
                  <Loader2 className="size-6 animate-spin text-clay-terracotta" aria-label="in progress" />
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
