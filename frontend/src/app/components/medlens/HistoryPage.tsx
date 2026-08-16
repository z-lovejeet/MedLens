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
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <Clock className="size-16 text-clay-muted/30 animate-floaty" />
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
            <div role="alert" className="flex items-center gap-3 bg-clay-rust/10 text-clay-slate px-3 py-1.5 rounded-full text-[13px] font-semibold">
              <span>Delete all analyses?</span>
              <button onClick={() => { clearAllHistory(); setConfirmClearAll(false); }} className="text-clay-coral hover:underline">Yes, clear all</button>
              <button onClick={() => setConfirmClearAll(false)} className="text-clay-muted hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmClearAll(true)} className="text-[13px] font-semibold text-clay-muted hover:text-clay-coral transition-colors flex items-center gap-1.5">
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
                  <div role="alert" className="flex items-center justify-between w-full text-[13px] font-bold">
                    <span className="text-clay-slate">Delete this?</span>
                    <div className="flex gap-3">
                      <button onClick={() => { deleteFromHistory(entry.id); setConfirmDelete(null); }} className="text-clay-coral hover:underline">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="text-clay-muted hover:underline">Cancel</button>
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
