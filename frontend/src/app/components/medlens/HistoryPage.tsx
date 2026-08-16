import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Trash2, Droplets, Bone, ArrowRight, FileText } from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import { fadeUp, stagger, type PageKey } from "./anim";

interface HistoryPageProps {
  onNavigate: (page: PageKey) => void;
}

export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const history = useMedLensStore((s) => s.history);
  const loadFromHistory = useMedLensStore((s) => s.loadFromHistory);
  const deleteFromHistory = useMedLensStore((s) => s.deleteFromHistory);
  const clearAllHistory = useMedLensStore((s) => s.clearAllHistory);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  if (history.length === 0) {
    return (
      <section aria-label="Analysis History" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <Clock className="size-16 text-clay-muted/35" aria-hidden />
        </motion.div>
        <h1 className="font-display text-xl font-bold text-clay-slate mt-6">No analyses saved yet</h1>
        <p className="text-clay-muted mt-2 text-[15px] max-w-xs">Upload a report to get started!</p>
        <button
          onClick={() => onNavigate("report")}
          className="clay-btn mt-6 px-6 py-3 bg-clay-terracotta text-white rounded-[14px] font-bold text-[15px] inline-flex items-center gap-2"
        >
          Analyze a Report <ArrowRight className="size-4" />
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Analysis History" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 min-h-[60vh]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-clay-slate">Your Analysis History</h1>
          <p className="text-clay-muted text-[15px] mt-1">
            {history.length} saved {history.length === 1 ? 'analysis' : 'analyses'}
          </p>
        </div>
        
        <div className="flex items-center">
          {confirmClearAll ? (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-full border border-clay-coral/25 bg-clay-coral/10 px-3.5 py-1.5 text-[13px] font-semibold text-clay-slate shadow-xs"
            >
              <span className="flex items-center gap-1.5 font-bold text-clay-slate">
                <Trash2 className="size-3.5 text-clay-coral" /> Clear entire history?
              </span>
              <button
                onClick={() => setConfirmClearAll(false)}
                className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-clay-muted shadow-xs transition-all hover:bg-clay-cream hover:text-clay-slate active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllHistory();
                  setConfirmClearAll(false);
                }}
                className="rounded-full bg-clay-coral px-3 py-1 text-[12px] font-bold text-white shadow-xs transition-all hover:brightness-105 active:scale-95 cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-semibold text-clay-muted shadow-xs transition-all hover:bg-white hover:text-clay-coral active:scale-95 cursor-pointer"
            >
              <Trash2 className="size-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8"
      >
        <AnimatePresence>
          {history.map((entry) => (
            <motion.article
              key={entry.id}
              layout
              variants={fadeUp}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="clay bg-clay-white p-5 flex flex-col gap-2"
              onClick={() => { if (confirmDelete && confirmDelete !== entry.id) setConfirmDelete(null); }}
            >
              <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                {entry.kind === "blood" ? (
                  <span className="flex items-center gap-1.5 text-clay-coral"><Droplets className="size-4" /> Blood Report</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-clay-muted"><Bone className="size-4" /> Chest X-Ray</span>
                )}
              </div>
              <h2 className="font-display text-lg font-bold text-clay-slate truncate">{entry.patientName}</h2>
              <time className="text-[13px] text-clay-muted">
                {new Date(entry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </time>
              <p className="text-[14px] text-clay-muted leading-relaxed line-clamp-2 mt-1">
                {entry.summaryHeadline}
              </p>

              <div className="flex gap-3 mt-auto pt-3">
                {confirmDelete === entry.id ? (
                  <div
                    role="alert"
                    className="flex w-full items-center justify-between gap-2 rounded-[14px] border border-clay-coral/25 bg-clay-coral/10 p-1.5 shadow-xs"
                  >
                    <span className="pl-2 text-[12px] font-bold text-clay-slate flex items-center gap-1.5">
                      <Trash2 className="size-3.5 text-clay-coral" /> Delete this?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(null);
                        }}
                        className="rounded-[10px] bg-white px-2.5 py-1 text-[12px] font-bold text-clay-muted shadow-xs transition-all hover:bg-clay-cream hover:text-clay-slate active:scale-95 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromHistory(entry.id);
                          setConfirmDelete(null);
                        }}
                        className="rounded-[10px] bg-clay-coral px-2.5 py-1 text-[12px] font-bold text-white shadow-xs transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        loadFromHistory(entry.id);
                        onNavigate(entry.kind === "blood" ? "report" : "xray");
                      }}
                      className="clay-btn flex-1 py-2.5 text-[13px] font-bold bg-clay-terracotta text-white rounded-[12px] text-center flex items-center justify-center gap-1.5"
                    >
                      <FileText className="size-4" /> Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(entry.id);
                      }}
                      className="clay-btn flex-1 py-2.5 text-[13px] font-bold bg-clay-cream text-clay-muted rounded-[12px] text-center hover:text-clay-coral flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
