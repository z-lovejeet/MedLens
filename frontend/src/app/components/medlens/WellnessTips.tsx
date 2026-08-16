import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Printer,
  CheckCircle2,
  XCircle,
  Sparkles,
  Utensils,
  Moon,
  Footprints,
  Wind,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import { resolveIcon } from "../../lib/icons";
import { WELLNESS as FALLBACK_WELLNESS } from "./data";
import type { WellnessTip, WellnessModule } from "../../lib/types";

interface WellnessCategoryItem {
  key: string;
  label: string;
  icon: LucideIcon;
  tips: WellnessTip[];
  recommendedDiet?: string;
  foodsToEat?: { name: string; why: string }[];
  foodsToAvoid?: { name: string; why: string }[];
  modules?: WellnessModule[];
}

export function WellnessTips() {
  const result = useMedLensStore((s) => s.result);
  const wellnessData = result?.wellness;

  const categories: WellnessCategoryItem[] = useMemo(() => {
    if (wellnessData && Object.keys(wellnessData).length > 0) {
      return Object.entries(wellnessData).map(([key, cat]) => {
        const fallback = FALLBACK_WELLNESS[key] || FALLBACK_WELLNESS.nutrition;
        return {
          key,
          label: cat.label || (key === "nutrition" ? "Nutrition Hub" : key),
          icon: resolveIcon(cat.icon),
          tips: cat.tips && cat.tips.length > 0 ? cat.tips : fallback.tips,
          recommendedDiet: cat.recommendedDiet || fallback.recommendedDiet,
          foodsToEat: cat.foodsToEat && cat.foodsToEat.length > 0 ? cat.foodsToEat : fallback.foodsToEat,
          foodsToAvoid: cat.foodsToAvoid && cat.foodsToAvoid.length > 0 ? cat.foodsToAvoid : fallback.foodsToAvoid,
          modules: cat.modules && cat.modules.length > 0 ? cat.modules : fallback.modules,
        };
      });
    }
    return Object.entries(FALLBACK_WELLNESS).map(([key, cat]) => ({
      key,
      label: cat.label,
      icon: cat.icon,
      tips: cat.tips,
      recommendedDiet: cat.recommendedDiet,
      foodsToEat: cat.foodsToEat,
      foodsToAvoid: cat.foodsToAvoid,
      modules: cat.modules,
    }));
  }, [wellnessData]);

  const [active, setActive] = useState(categories[0]?.key ?? "nutrition");
  const currentKey = categories.some((c) => c.key === active)
    ? active
    : (categories[0]?.key ?? "");
  const group = categories.find((c) => c.key === currentKey) ?? categories[0];

  if (!group) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 pt-16">
      <div className="mb-6 text-center">
        <h2 className="font-display text-[28px] font-bold text-clay-slate">
          What your body is quietly asking for
        </h2>
        <p className="mt-1 text-clay-muted">
          Personalized wellness guidance translated from your results. What your doctor would suggest if they had more time.
        </p>
      </div>

      <div
        role="tablist"
        className="mb-8 flex flex-wrap justify-center gap-2.5"
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
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 cursor-pointer ${
                on
                  ? "bg-clay-terracotta text-white clay-btn scale-105"
                  : "clay bg-white text-clay-slate hover:bg-clay-cream/50"
              }`}
            >
              <TabIcon className="size-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentKey === "nutrition" ? (
          <motion.div
            key="nutrition-hub"
            id="panel-nutrition"
            role="tabpanel"
            aria-labelledby="tab-nutrition"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* MODULE 1: Recommended Diet (For Now) */}
            <div className="rounded-[28px] clay bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[14px] bg-clay-sage/15 text-clay-sage">
                  <Utensils className="size-5" aria-hidden />
                </span>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-clay-sage">
                    Module 1
                  </span>
                  <h3 className="font-display text-[20px] font-bold text-clay-slate">
                    Recommended Diet (For Now)
                  </h3>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-clay-cream/80 p-4 sm:p-5 border border-black/5">
                <p className="text-[15px] leading-relaxed font-medium text-clay-slate">
                  {group.recommendedDiet ||
                    "A nutrient-dense, balanced whole-food dietary approach focused on soluble fibers, clean hydration, and antioxidant variety to naturally support your numbers."}
                </p>
              </div>

              {/* Daily Actionable Nutrition Rules */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {group.tips.map((tip) => (
                  <div
                    key={tip.title}
                    className="rounded-[18px] bg-white p-4 border border-black/5 shadow-2xs"
                  >
                    <h4 className="font-display font-bold text-clay-slate text-[14.5px]">
                      {tip.title}
                    </h4>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-clay-muted">
                      {tip.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* MODULE 2: What to Eat & What Not to Eat */}
            <div className="rounded-[28px] clay bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[14px] bg-clay-terracotta/15 text-clay-terracotta">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-clay-terracotta">
                    Module 2
                  </span>
                  <h3 className="font-display text-[20px] font-bold text-clay-slate">
                    What to Eat & What Not to Eat
                  </h3>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* What to Eat */}
                <div className="rounded-[24px] bg-emerald-50/70 p-5 sm:p-6 border border-emerald-500/20">
                  <div className="mb-4 flex items-center gap-2 font-display text-[17px] font-bold text-emerald-800">
                    <CheckCircle2 className="size-5 text-emerald-600" aria-hidden />
                    Foods to Eat (Prioritize)
                  </div>
                  <ul className="space-y-3">
                    {(group.foodsToEat || []).map((item, idx) => (
                      <li
                        key={idx}
                        className="rounded-[16px] bg-white/90 p-3.5 shadow-2xs border border-emerald-500/10"
                      >
                        <p className="font-display text-[14.5px] font-bold text-emerald-950">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-emerald-800/80">
                          {item.why}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Not to Eat */}
                <div className="rounded-[24px] bg-rose-50/70 p-5 sm:p-6 border border-rose-500/20">
                  <div className="mb-4 flex items-center gap-2 font-display text-[17px] font-bold text-rose-800">
                    <XCircle className="size-5 text-rose-600" aria-hidden />
                    Foods to Avoid (Limit/Minimize)
                  </div>
                  <ul className="space-y-3">
                    {(group.foodsToAvoid || []).map((item, idx) => (
                      <li
                        key={idx}
                        className="rounded-[16px] bg-white/90 p-3.5 shadow-2xs border border-rose-500/10"
                      >
                        <p className="font-display text-[14.5px] font-bold text-rose-950">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-rose-800/80">
                          {item.why}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Rich Structured Modules for Sleep, Activity, Stress */
          <motion.div
            key={currentKey}
            id={`panel-${currentKey}`}
            role="tabpanel"
            aria-labelledby={`tab-${currentKey}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {group.modules && group.modules.length > 0 ? (
              group.modules.map((mod, idx) => (
                <div key={idx} className="rounded-[28px] clay bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-[14px] bg-clay-terracotta/12 text-clay-terracotta">
                      {currentKey === "sleep" ? (
                        <Moon className="size-5" aria-hidden />
                      ) : currentKey === "activity" ? (
                        <Footprints className="size-5" aria-hidden />
                      ) : (
                        <Wind className="size-5" aria-hidden />
                      )}
                    </span>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wider text-clay-terracotta">
                        {mod.badge}
                      </span>
                      <h3 className="font-display text-[20px] font-bold text-clay-slate">
                        {mod.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-2 text-[14px] text-clay-muted">
                    {mod.subtitle}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {mod.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="rounded-[20px] bg-clay-cream/70 p-4 border border-black/5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <ShieldCheck className="size-4 text-clay-sage" aria-hidden />
                            <h4 className="font-display font-bold text-clay-slate text-[14.5px]">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[13px] leading-relaxed text-clay-muted">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              /* Fallback Tip Cards */
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tips.map((tip) => (
                  <div key={tip.title} className="rounded-[22px] clay bg-white p-5">
                    <h3 className="font-display font-bold text-clay-slate text-[16px]">
                      {tip.title}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-clay-muted">
                      {tip.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-clay-slate px-6 py-3 font-display font-semibold text-white clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 cursor-pointer"
        >
          <Printer className="size-4" /> Print summary for doctor visit
        </motion.button>
      </div>
    </section>
  );
}
