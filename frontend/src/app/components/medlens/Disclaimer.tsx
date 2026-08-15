import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeartPulse, ShieldCheck } from "lucide-react";

export function DisclaimerModal({ open, onAccept }: { open: boolean; onAccept: () => void }) {
  const acceptRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the primary action on open + trap focus inside the dialog (mandatory, no dismiss).
  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    acceptRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault(); // mandatory acknowledgement
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      prevActive?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-clay-slate/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            aria-describedby="disclaimer-desc"
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md rounded-[28px] clay-lg p-7 text-center"
          >
            <span className="mx-auto mb-4 grid size-16 place-items-center rounded-[22px] bg-clay-terracotta text-white clay-btn">
              <HeartPulse className="size-8" aria-hidden />
            </span>
            <h2 id="disclaimer-title" className="font-display text-[22px] font-bold text-clay-slate">
              A gentle heads-up first
            </h2>
            <p id="disclaimer-desc" className="mt-2 text-[15px] leading-relaxed text-clay-muted">
              MedLens is an AI educational assistant, <span className="font-semibold text-clay-slate">not a doctor</span>.
              We help you understand your reports in plain language, but always consult a licensed
              healthcare professional for decisions about your health.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-[16px] bg-cream px-4 py-2.5 text-[13px] font-semibold text-clay-sage">
              <ShieldCheck className="size-4" aria-hidden /> Your files are processed privately and never saved.
            </div>

            <motion.button
              ref={acceptRef}
              whileTap={{ scale: 0.97, y: 2 }}
              onClick={onAccept}
              className="mt-6 w-full rounded-full bg-clay-terracotta py-3.5 font-display font-semibold text-white clay-btn"
            >
              I understand — let's go
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
