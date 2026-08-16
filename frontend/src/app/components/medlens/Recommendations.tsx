import { motion } from "motion/react";
import { Sparkles, HeartHandshake, Stethoscope } from "lucide-react";
import { fadeUp, stagger } from "./anim";
import type { Recommendation } from "../../lib/types";
import { resolveIcon } from "../../lib/icons";

export function Recommendations({
  items,
  bare = false,
}: {
  items: Recommendation[];
  bare?: boolean;
}) {
  return (
    <section
      aria-labelledby={bare ? undefined : "recs-heading"}
      className={bare ? "" : "mt-10"}
    >
      {!bare && (
        <div className="mb-4 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-[14px] bg-clay-terracotta/12 text-clay-terracotta">
            <HeartHandshake className="size-5" aria-hidden />
          </span>
          <div>
            <h3
              id="recs-heading"
              className="font-display text-[18px] font-bold text-clay-slate"
            >
              What to do to feel better
            </h3>
            <p className="text-[14px] text-clay-muted">
              Everyday steps to ease physical discomfort, reduce fatigue, and manage symptom effects.
            </p>
          </div>
        </div>
      )}

      {/* Proactive Doctor Prep Callout */}
      <div className="mb-4 flex items-start gap-3.5 rounded-[22px] bg-clay-cream/90 p-4 border border-black/5">
        <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-clay-sage/20 text-clay-sage">
          <Stethoscope className="size-5" aria-hidden />
        </span>
        <div className="text-[14px] leading-relaxed text-clay-slate">
          <span className="font-bold text-clay-slate">Things to mention to your doctor first:</span>{" "}
          If you've experienced unusual tiredness, muscle or joint soreness, changes in digestion, or breathlessness with activity, make a quick note to share it during your review.
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {items.map((r) => {
          const Icon = resolveIcon(r.icon);
          return (
            <motion.article
              key={r.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="clay-hover rounded-[22px] clay bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-cream text-clay-terracotta">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h4 className="font-display font-bold text-clay-slate text-[16px]">
                  {r.title}
                </h4>
                <p className="mt-1.5 text-[14px] leading-relaxed text-clay-muted">
                  {r.body}
                </p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
