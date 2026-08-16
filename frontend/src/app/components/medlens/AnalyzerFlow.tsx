import { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMedLensStore } from "../../lib/store";
import type { Kind } from "../../lib/types";
import { FileUpload } from "./FileUpload";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { ReportResults } from "./ReportResults";
import { XRayViewer } from "./XRayViewer";
import { WellnessTips } from "./WellnessTips";
import { pageVariants } from "./anim";

export function AnalyzerFlow({ kind }: { kind: Kind }) {
  const stage = useMedLensStore((s) => s.stage);
  const fileName = useMedLensStore((s) => s.fileName);
  const error = useMedLensStore((s) => s.error);
  const analyze = useMedLensStore((s) => s.analyze);
  const loadSample = useMedLensStore((s) => s.loadSample);
  const reset = useMedLensStore((s) => s.reset);
  const setStage = useMedLensStore((s) => s.setStage);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAnalyze = useCallback(
    (file: File) => {
      scrollTop();
      analyze(file, kind);
    },
    [analyze, kind],
  );

  const handleSample = useCallback(() => {
    scrollTop();
    loadSample(kind);
  }, [loadSample, kind]);

  const handleReset = useCallback(() => {
    reset();
    scrollTop();
  }, [reset]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {stage === "idle" && (
          <FileUpload
            kind={kind}
            onAnalyze={handleAnalyze}
            onSample={handleSample}
          />
        )}
        {stage === "loading" && (
          <LoadingState
            fileName={fileName}
            onDone={() => setStage("results")}
          />
        )}
        {stage === "error" && (
          <ErrorState
            type={error ?? "server"}
            onRetry={handleReset}
            onNewFile={handleReset}
          />
        )}
        {stage === "results" && (
          <>
            {kind === "blood" ? (
              <ReportResults onReset={handleReset} />
            ) : (
              <XRayViewer onReset={handleReset} />
            )}
            <WellnessTips />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
