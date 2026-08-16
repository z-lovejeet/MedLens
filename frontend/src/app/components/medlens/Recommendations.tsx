import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
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
            <Sparkles className="size-5" aria-hidden />
          </span>
          <h3
            id="recs-heading"
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            Cozy next steps, just for you
          </h3>
        </div>
      )}

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
              className="clay-hover rounded-[22px] clay bg-white p-5"
            >
              <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-cream text-clay-terracotta">
                <Icon className="size-5" aria-hidden />
              </span>
              <h4 className="font-display font-bold text-clay-slate">
                {r.title}
              </h4>
              <p className="mt-1.5 text-[15px] leading-relaxed text-clay-muted">
                {r.body}
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
