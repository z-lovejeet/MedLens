import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Activity,
  Stethoscope,
  ScanLine,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Kind } from "../../lib/types";
import { fadeUp } from "./anim";

interface FileUploadProps {
  kind: Kind;
  onAnalyze: (file: File) => void;
  onSample: () => void;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

const COPY: Record<
  Kind,
  {
    step: string;
    heading: string;
    sub: string;
    dropTitle: string;
    dropSub: string;
    icon: typeof Stethoscope;
    sampleLabel: string;
  }
> = {
  blood: {
    step: "Report Translator",
    heading: "What did your doctor hand you?",
    sub: "Drop your blood work or lab test below. We'll translate every confusing term into warm, plain language your doctor would use if they had 30 minutes instead of 3.",
    dropTitle: "Drop your report here and we'll start translating",
    dropSub: "CBC, Lipid panels, metabolic panels. PDF, PNG or JPG (max 10MB)",
    icon: Stethoscope,
    sampleLabel: "sample blood report (CBC + Lipid)",
  },
  xray: {
    step: "X-Ray Translator",
    heading: "Let's read your scan together.",
    sub: "Drop your chest X-ray below. Our vision model translates each region into warm, plain language and highlights what matters.",
    dropTitle: "Drop your chest X-ray here and we'll start translating",
    dropSub: "Chest X-rays, PA or AP views. PNG or JPG (max 10MB)",
    icon: ScanLine,
    sampleLabel: "sample chest X-Ray scan",
  },
};

export function FileUpload({ kind, onAnalyze, onSample }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const c = COPY[kind];
  const DropIcon = c.icon;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > MAX_BYTES) {
      toast.error("File is too large", {
        description: "Please upload a report under 10MB.",
      });
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts =
      kind === "xray" ? ["png", "jpg", "jpeg"] : ["pdf", "png", "jpg", "jpeg"];
    if (!ext || !validExts.includes(ext)) {
      toast.error("Unsupported file format", {
        description:
          kind === "xray"
            ? "Chest X-rays must be PNG or JPG images."
            : "Reports must be PDF, PNG, or JPG.",
      });
      return;
    }
    onAnalyze(file);
  };

  return (
    <section
      aria-labelledby="upload-heading"
      className="mx-auto max-w-3xl px-4"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-8 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta">
          <DropIcon className="size-3.5" aria-hidden /> {c.step}
        </span>
        <h1
          id="upload-heading"
          className="mt-4 font-display text-[34px] font-bold leading-tight text-clay-slate sm:text-[42px]"
        >
          {c.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-clay-muted">
          {c.sub}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="show"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-[30px] p-2 transition-colors ${dragging ? "bg-clay-terracotta/15" : "bg-transparent"}`}
      >
        <label htmlFor="report-file" className="sr-only">
          Upload a {kind === "xray" ? "chest X-ray" : "medical report"} (PDF,
          PNG, or JPG, max 10MB)
        </label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-[26px] clay-cream clay-inset border-[3px] border-dashed border-clay-terracotta/60 px-6 py-14 text-center cursor-pointer transition-transform active:scale-[0.99]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-5 grid size-24 place-items-center rounded-[26px] bg-clay-terracotta text-white clay-btn clay-pulse"
          >
            <DropIcon className="size-11" aria-hidden />
          </motion.div>
          <p className="font-display text-[21px] font-bold text-clay-slate">
            {dragging ? "Perfect, drop it right here" : c.dropTitle}
          </p>
          <p className="mt-2 text-[15px] text-clay-muted">{c.dropSub}</p>
        </button>

        <input
          ref={inputRef}
          id="report-file"
          type="file"
          accept={kind === "xray" ? ".png,.jpg,.jpeg" : ".pdf,.png,.jpg,.jpeg"}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Clean Sample Trigger & Privacy Notice */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[13.5px]">
            <span className="text-clay-muted">No file on hand?</span>
            <button
              type="button"
              onClick={onSample}
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-bold text-clay-terracotta border border-clay-terracotta/25 shadow-xs transition-all duration-150 ease-out hover:bg-clay-terracotta hover:text-white hover:shadow-sm hover:border-transparent active:scale-95 cursor-pointer"
            >
              {kind === "xray" ? (
                <Activity className="size-3.5" aria-hidden />
              ) : (
                <FileText className="size-3.5" aria-hidden />
              )}
              <span>Load sample {kind === "xray" ? "chest X-Ray" : "blood panel"}</span>
              <ArrowRight className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-clay-muted">
            <ShieldCheck className="size-3.5 text-clay-sage" aria-hidden /> Translated privately in your session · Zero data stored
          </p>
        </div>
      </motion.div>
    </section>
  );
}
