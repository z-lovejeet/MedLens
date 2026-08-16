import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleHeart } from "lucide-react";
import type { Metric } from "../../lib/types";
import { STATUS_META } from "./data";

export function MetricCard({ metric }: { metric: Metric }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[metric.status];
  const StatusIcon = meta.icon;

  const pct = (v: number) => {
    if (metric.scaleMax === metric.scaleMin) return 50;
    return Math.max(
      0,
      Math.min(
        100,
        ((v - metric.scaleMin) / (metric.scaleMax - metric.scaleMin)) * 100,
      ),
    );
  };
  const valuePct = pct(metric.value);
  const rangeLeft = pct(metric.min);
  const rangeWidth = pct(metric.max) - rangeLeft;

  return (
    <motion.article
      layout
      className="clay-hover rounded-[22px] clay bg-white p-5"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-clay-slate">
            {metric.name}
          </h3>
          <p className="mt-0.5 text-clay-muted">
            <span className="font-display text-[24px] font-bold text-clay-slate">
              {metric.value}
            </span>{" "}
            <span className="text-[14px]">{metric.unit}</span>
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
          style={{ background: meta.soft, color: meta.color }}
        >
          <StatusIcon className="size-4" />
          {metric.tag}
        </span>
      </div>

      {/* Value bar vs reference range */}
      <div className="mt-5">
        <div className="relative h-3 rounded-full clay-inset bg-cream">
          <div
            className="absolute top-0 h-3 rounded-full opacity-60"
            style={{
              left: `${rangeLeft}%`,
              width: `${rangeWidth}%`,
              background: "#81b29a55",
            }}
          />
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${valuePct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="absolute -top-1 size-5 -translate-x-1/2 rounded-full border-[3px] border-white"
            style={{
              background: meta.color,
              boxShadow: "0 3px 8px rgba(61,64,91,0.25)",
            }}
            aria-hidden
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[12px] text-clay-muted">
          <span>Healthy: {metric.min}</span>
          <span>
            {metric.max} {metric.unit}
          </span>
        </div>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between rounded-[14px] bg-cream px-4 py-2.5 text-left text-[14px] font-semibold text-clay-slate focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40"
      >
        <span className="flex items-center gap-2">
          <MessageCircleHeart className="size-4 text-clay-terracotta" />
          What this means in plain English
        </span>
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-1 pt-3 text-[15px] leading-relaxed text-clay-muted">
              {metric.plain}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
