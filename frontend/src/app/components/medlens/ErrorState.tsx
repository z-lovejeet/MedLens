import { motion } from "motion/react";
import { CloudOff, RotateCcw, FileUp, LifeBuoy } from "lucide-react";

export type AnalysisErrorType = "timeout" | "parsing" | "server";

const CONTENT: Record<
  AnalysisErrorType,
  { title: string; body: string; primary: string; secondary?: string }
> = {
  timeout: {
    title: "Our AI is taking longer than usual",
    body: "This sometimes happens with complex reports. Nothing's broken on your side — let's give it another gentle try.",
    primary: "Try again",
    secondary: "Try a different file",
  },
  parsing: {
    title: "We couldn't read this one clearly",
    body: "The details came through a little blurry for us. A clearer image or a digital PDF usually does the trick.",
    primary: "Upload a clearer file",
  },
  server: {
    title: "Something went wrong on our end",
    body: "We're really sorry about that — it's us, not you. Please give it another try in a moment.",
    primary: "Try again",
  },
};

interface ErrorStateProps {
  type: AnalysisErrorType;
  onRetry: () => void;
  onNewFile: () => void;
}

export function ErrorState({ type, onRetry, onNewFile }: ErrorStateProps) {
  const c = CONTENT[type];
  return (
    <section
      aria-labelledby="error-heading"
      role="alert"
      className="mx-auto max-w-xl px-4 pt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] clay-rust-soft p-8 text-center"
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-5 grid size-16 place-items-center rounded-[22px] bg-clay-rust text-white clay-btn"
          style={{ boxShadow: "0 8px 18px -4px rgba(178,90,56,0.45)" }}
        >
          <CloudOff className="size-8" aria-hidden />
        </motion.span>

        <h1 id="error-heading" className="font-display text-[24px] font-bold text-clay-slate">
          {c.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-clay-muted">
          {c.body}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97, y: 2 }}
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-display font-semibold text-white clay-btn"
            style={{ background: "var(--clay-rust)", boxShadow: "0 8px 18px -4px rgba(178,90,56,0.45)" }}
          >
            <RotateCcw className="size-4" aria-hidden /> {c.primary}
          </motion.button>
          {c.secondary && (
            <button
              onClick={onNewFile}
              className="inline-flex items-center gap-2 rounded-full clay bg-white px-6 py-3 font-display font-semibold text-clay-slate"
            >
              <FileUp className="size-4" aria-hidden /> {c.secondary}
            </button>
          )}
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-clay-muted">
          <LifeBuoy className="size-3.5" aria-hidden /> Still stuck? A clearer, digital PDF works best.
        </p>
      </motion.div>
    </section>
  );
}
