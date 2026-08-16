import { useId } from "react";
import { motion } from "motion/react";
import { ShieldPlus } from "lucide-react";
import type { Condition } from "../../lib/types";
import { STATUS_META } from "./data";
import { fadeUp, stagger } from "./anim";

export function ConditionsSection({
  conditions,
  title = "Condition screening",
  subtitle = "A gentle, plain-language look at what your results suggest — never a diagnosis.",
}: {
  conditions: Condition[];
  title?: string;
  subtitle?: string;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-[16px] bg-clay-terracotta text-white clay-btn">
          <ShieldPlus className="size-5" aria-hidden />
        </span>
        <div>
          <h2
            id={headingId}
            className="font-display text-[18px] font-bold text-clay-slate"
          >
            {title}
          </h2>
          <p className="text-[14px] text-clay-muted">{subtitle}</p>
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2"
      >
        {conditions.map((c) => {
          const meta = STATUS_META[c.status];
          const Icon = meta.icon;
          return (
            <motion.article
              key={c.name}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="clay-hover rounded-[22px] clay bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-display font-bold text-clay-slate">
                  <Icon
                    className="size-4"
                    style={{ color: meta.color }}
                    aria-hidden
                  />
                  {c.name}
                </h3>
                <span
                  className="rounded-full px-2.5 py-1 font-display text-[13px] font-bold"
                  style={{ background: meta.soft, color: meta.color }}
                >
                  {c.chance}%
                </span>
              </div>

              <div
                className="mt-3 h-3 overflow-hidden rounded-full clay-inset bg-cream"
                role="meter"
                aria-valuenow={c.chance}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${c.name} likelihood`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.chance}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="h-full rounded-full"
                  style={{ background: meta.color }}
                />
              </div>
              <p
                className="mt-1.5 text-[12px] font-semibold"
                style={{ color: meta.color }}
              >
                {meta.label} likelihood
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-clay-muted">
                {c.blurb}
              </p>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
