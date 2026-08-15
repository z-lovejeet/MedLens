import { motion } from "motion/react";
import { Download, Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { downloadReport, shareReport, type Kind } from "./report";

export function ResultActions({ kind, onReset }: { kind: Kind; onReset: () => void }) {
  const handleDownload = () => {
    downloadReport(kind);
    toast.success("Summary downloaded", {
      description: "Saved as a text file you can bring to your doctor.",
    });
  };

  const handleShare = async () => {
    try {
      const result = await shareReport(kind);
      if (result === "copied") {
        toast.success("Copied to clipboard", {
          description: "Your summary is ready to paste and share.",
        });
      }
    } catch {
      toast.error("Couldn't share just now", {
        description: "Please try again, or download the summary instead.",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97, y: 2 }}
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-full bg-clay-terracotta px-5 py-3 font-display font-semibold text-white clay-btn"
      >
        <Download className="size-4" aria-hidden /> Download summary
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97, y: 2 }}
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full clay bg-white px-5 py-3 font-display font-semibold text-clay-slate"
      >
        <Share2 className="size-4" aria-hidden /> Share
      </motion.button>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full clay bg-white px-4 py-3 text-[14px] font-semibold text-clay-slate"
      >
        <RotateCcw className="size-4" aria-hidden /> New report
      </button>
    </div>
  );
}
