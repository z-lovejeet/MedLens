import { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Activity,
  Stethoscope,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import type { Kind } from "../../lib/types";
import { fadeUp } from "./anim";

interface FileUploadProps {
  kind: Kind;
  onAnalyze: (file: File) => void;
  onSample: () => void;
}

const ACCEPTED = ["application/pdf", "image/png", "image/jpeg"];
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
    sampleTitle: string;
    sampleSub: string;
    sampleFile: string;
  }
> = {
  blood: {
    step: "Report Analyzer · Step 1",
    heading: "Let's make sense of your report, together.",
    sub: "Drop your blood work or lab test below. We'll gently translate every confusing term into warm, plain language.",
    dropTitle: "Drop your blood report here, or tap to browse",
    dropSub: "CBC, Lipid panels, metabolic panels — PDF, PNG or JPG (max 10MB)",
    icon: Stethoscope,
    sampleTitle: "Try a sample Blood Report",
    sampleSub: "CBC + Lipid panel",
    sampleFile: "sample-blood-report.pdf",
  },
  xray: {
    step: "X-Ray Analyzer · Step 1",
    heading: "Let's take a calm look at your scan, together.",
    sub: "Drop your chest X-ray below. Our vision model highlights each region and explains it in warm, plain language.",
    dropTitle: "Drop your chest X-ray here, or tap to browse",
    dropSub: "Chest X-rays, PA or AP views — PNG or JPG (max 10MB)",
    icon: ScanLine,
    sampleTitle: "Try a sample Chest X-Ray",
    sampleSub: "PA view scan",
    sampleFile: "sample-chest-xray.png",
  },
};

export function FileUpload({ kind, onAnalyze, onSample }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const c = COPY[kind];
  const DropIcon = c.icon;

  const validateAndGo = (file: File) => {
    const nameOk = /\.(pdf|png|jpe?g)$/i.test(file.name);
    if (!ACCEPTED.includes(file.type) && !nameOk) {
      toast.error("This file type isn't supported", {
        description: "Please upload a PDF, PNG, or JPG.",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("This file is a little too large", {
        description: "Max 10MB — try compressing it and upload again.",
      });
      return;
    }
    onAnalyze(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    validateAndGo(files[0]);
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
          className="w-full rounded-[26px] clay-cream clay-inset border-[3px] border-dashed border-clay-terracotta/60 px-6 py-14 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-5 grid size-24 place-items-center rounded-[26px] bg-clay-terracotta text-white clay-btn clay-pulse"
          >
            <DropIcon className="size-11" aria-hidden />
          </motion.div>
          <p className="font-display text-[21px] font-bold text-clay-slate">
            {dragging ? "Perfect — drop it right here" : c.dropTitle}
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

        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-semibold text-clay-sage">
          <ShieldCheck className="size-4" aria-hidden /> Processed privately in
          your session — never saved.
        </p>

        <div className="mt-4">
          <SampleButton
            icon={
              kind === "xray" ? (
                <Activity className="size-5" aria-hidden />
              ) : (
                <FileText className="size-5" aria-hidden />
              )
            }
            title={c.sampleTitle}
            subtitle={c.sampleSub}
            onClick={onSample}
          />
        </div>
      </motion.div>
    </section>
  );
}

function SampleButton({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 2 }}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[20px] clay bg-white px-4 py-4 text-left"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-clay-sage/20 text-clay-sage">
        {icon}
      </span>
      <span>
        <span className="block font-display font-semibold text-clay-slate">
          {title}
        </span>
        <span className="block text-[13px] text-clay-muted">{subtitle}</span>
      </span>
    </motion.button>
  );
}
