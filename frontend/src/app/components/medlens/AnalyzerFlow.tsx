import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileUpload } from "./FileUpload";
import { LoadingState } from "./LoadingState";
import { ErrorState, type AnalysisErrorType } from "./ErrorState";
import { ReportResults } from "./ReportResults";
import { XRayViewer } from "./XRayViewer";
import { WellnessTips } from "./WellnessTips";
import { pageVariants } from "./anim";

type Stage = "idle" | "loading" | "results" | "error";
type Kind = "blood" | "xray";

const ERROR_TYPES: AnalysisErrorType[] = ["timeout", "parsing", "server"];

export function AnalyzerFlow({ kind }: { kind: Kind }) {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [errorType, setErrorType] = useState<AnalysisErrorType>("timeout");

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const analyze = useCallback((name: string) => {
    setFileName(name);
    setStage("loading");
    scrollTop();
  }, []);

  const previewError = useCallback(() => {
    setErrorType(ERROR_TYPES[Math.floor(Math.random() * ERROR_TYPES.length)]);
    setStage("error");
    scrollTop();
  }, []);

  const reset = useCallback(() => {
    setStage("idle");
    scrollTop();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={stage} variants={pageVariants} initial="initial" animate="enter" exit="exit">
        {stage === "idle" && (
          <FileUpload kind={kind} onAnalyze={analyze} onPreviewError={previewError} />
        )}
        {stage === "loading" && (
          <LoadingState fileName={fileName} onDone={() => setStage("results")} />
        )}
        {stage === "error" && (
          <ErrorState type={errorType} onRetry={() => setStage("loading")} onNewFile={reset} />
        )}
        {stage === "results" && (
          <>
            {kind === "blood" ? <ReportResults onReset={reset} /> : <XRayViewer onReset={reset} />}
            <WellnessTips />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
