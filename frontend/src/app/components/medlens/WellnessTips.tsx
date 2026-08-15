import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Printer } from "lucide-react";
import { WELLNESS } from "./data";

const KEYS = Object.keys(WELLNESS);

export function WellnessTips() {
  const [active, setActive] = useState(KEYS[0]);
  const group = WELLNESS[active];

  return (
    <section className="mx-auto max-w-5xl px-4 pt-16">
      <div className="mb-6 text-center">
        <h2 className="font-display text-[28px] font-bold text-clay-slate">
          Your personalized wellness hub
        </h2>
        <p className="mt-1 text-clay-muted">Small, cozy steps tuned to your results.</p>
      </div>

      <div role="tablist" className="mb-6 flex flex-wrap justify-center gap-2.5">
        {KEYS.map((key) => {
          const g = WELLNESS[key];
          const on = key === active;
          const Icon = g.icon;
          return (
            <button
              key={key}
              id={`tab-${key}`}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${key}`}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 ${
                on ? "bg-clay-terracotta text-white clay-btn" : "clay bg-white text-clay-slate"
              }`}
            >
              <Icon className="size-4" />
              {g.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {group.tips.map((tip) => (
            <div key={tip.title} className="rounded-[22px] clay bg-white p-5">
              <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-cream text-clay-terracotta">
                <group.icon className="size-5" />
              </span>
              <h3 className="font-display font-bold text-clay-slate">{tip.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-clay-muted">{tip.body}</p>
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
