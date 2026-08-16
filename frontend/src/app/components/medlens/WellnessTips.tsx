import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Printer, type LucideIcon } from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import { resolveIcon } from "../../lib/icons";
import { WELLNESS as FALLBACK_WELLNESS } from "./data";
import type { WellnessTip } from "../../lib/types";

interface WellnessCategoryItem {
  key: string;
  label: string;
  icon: LucideIcon;
  tips: WellnessTip[];
}

export function WellnessTips() {
  const result = useMedLensStore((s) => s.result);
  const wellnessData = result?.wellness;

  const categories: WellnessCategoryItem[] = useMemo(() => {
    if (wellnessData && Object.keys(wellnessData).length > 0) {
      return Object.entries(wellnessData).map(([key, cat]) => ({
        key,
        label: cat.label,
        icon: resolveIcon(cat.icon),
        tips: cat.tips,
      }));
    }
    return Object.entries(FALLBACK_WELLNESS).map(([key, cat]) => ({
      key,
      label: cat.label,
      icon: cat.icon,
      tips: cat.tips,
    }));
  }, [wellnessData]);

  const [active, setActive] = useState(categories[0]?.key ?? "nutrition");
  const currentKey = categories.some((c) => c.key === active)
    ? active
    : (categories[0]?.key ?? "");
  const group = categories.find((c) => c.key === currentKey) ?? categories[0];

  if (!group) return null;
  const GroupIcon = group.icon;

  return (
    <section className="mx-auto max-w-5xl px-4 pt-16">
      <div className="mb-6 text-center">
        <h2 className="font-display text-[28px] font-bold text-clay-slate">
          Your personalized wellness hub
        </h2>
        <p className="mt-1 text-clay-muted">
          Small, cozy steps tuned to your results.
        </p>
      </div>

      <div
        role="tablist"
        className="mb-6 flex flex-wrap justify-center gap-2.5"
      >
        {categories.map((cat) => {
          const on = cat.key === currentKey;
          const TabIcon = cat.icon;
          return (
            <button
              key={cat.key}
              id={`tab-${cat.key}`}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${cat.key}`}
              onClick={() => setActive(cat.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 ${
                on
                  ? "bg-clay-terracotta text-white clay-btn"
                  : "clay bg-white text-clay-slate"
              }`}
            >
              <TabIcon className="size-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          id={`panel-${currentKey}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentKey}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {group.tips.map((tip) => (
            <div key={tip.title} className="rounded-[22px] clay bg-white p-5">
              <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-cream text-clay-terracotta">
                <GroupIcon className="size-5" />
              </span>
              <h3 className="font-display font-bold text-clay-slate">
                {tip.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-clay-muted">
                {tip.body}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-clay-slate px-6 py-3 font-display font-semibold text-white clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40"
        >
          <Printer className="size-4" /> Export PDF summary for my doctor
        </motion.button>
      </div>
    </section>
  );
}
