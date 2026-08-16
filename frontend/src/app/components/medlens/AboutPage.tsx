import { motion } from "motion/react";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  HandHeart,
  Users,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

const VALUES = [
  { icon: HandHeart, title: "Empathy first", body: "Every word is written to calm, never to scare. Health news is heavy enough already." },
  { icon: Sparkles, title: "Clarity always", body: "If a 6th grader couldn't follow it, we rewrite it. Jargon is not a personality." },
  { icon: ShieldCheck, title: "Privacy, always", body: "Your files never leave your session. We can't sell what we never keep." },
  { icon: Leaf, title: "Gentle guidance", body: "We nudge, we never nag. Small, cozy steps beat overwhelming overhauls." },
];

const TEAM = [
  { name: "Aarav Mehta", role: "Product & Design", init: "AM", tint: "#8a6fb0" },
  { name: "Lina Costa", role: "Clinical Advisor", init: "LC", tint: "#6bb89a" },
  { name: "Kenji Sato", role: "ML Engineering", init: "KS", tint: "#e48267" },
  { name: "Priya Nair", role: "Accessibility Lead", init: "PN", tint: "#c48a3c" },
];

interface AboutPageProps {
  onCta: () => void;
}

export function AboutPage({ onCta }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      {/* Story hero */}
      <motion.header variants={fadeUp} initial="hidden" animate="show" className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta">
          <Heart className="size-3.5 fill-clay-coral text-clay-coral" aria-hidden /> Our story
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-[36px] font-bold leading-[1.12] text-clay-slate sm:text-[48px]">
          It started with a folded lab report on a kitchen table.
        </h1>
      </motion.header>

      <motion.section
        variants={softScale}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-8 rounded-[28px] clay-lg p-8 sm:p-10"
      >
        <p className="text-[18px] leading-relaxed text-clay-slate/90">
          A few years ago, one of us sat with a parent who'd just been handed a page full of
          numbers and arrows. No explanation. No comfort. Just <span className="font-semibold text-clay-slate">“your levels are off, see a specialist.”</span>
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-clay-muted">
          That night was long. Not because the news was bad (it wasn't) but because
          <em> not understanding</em> is its own kind of fear. We built MedLens so that no one
          has to sit alone with a page they can't read. Health information should feel like a
          kind friend leaning over your shoulder, not a locked door.
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-clay-muted">
          Today, MedLens turns blood work, lab panels, and chest X-rays into warm, plain-language
          explanations with gentle, doable next steps. We'll never replace your doctor. We just
          make the walk to their office a little less scary.
        </p>
      </motion.section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="mt-14">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          id="values-heading"
          className="text-center font-display text-[28px] font-bold text-clay-slate"
        >
          What we hold close
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 grid gap-5 sm:grid-cols-2"
        >
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.article
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="clay-hover rounded-[24px] clay bg-white p-6"
              >
                <span className="mb-4 grid size-12 place-items-center rounded-[16px] bg-clay-terracotta text-white clay-btn">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display font-bold text-clay-slate">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-clay-muted">{v.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* Team */}
      <section aria-labelledby="team-heading" className="mt-14">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <Users className="size-5 text-clay-terracotta" aria-hidden />
          <h2 id="team-heading" className="font-display text-[28px] font-bold text-clay-slate">
            The humans behind it
          </h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TEAM.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="clay-hover rounded-[22px] clay bg-white p-5 text-center"
            >
              <span
                className="mx-auto grid size-16 place-items-center rounded-full font-display text-[20px] font-bold text-white clay-btn"
                style={{ background: t.tint }}
                aria-hidden
              >
                {t.init}
              </span>
              <h3 className="mt-3 font-display font-bold text-clay-slate">{t.name}</h3>
              <p className="text-[14px] text-clay-muted">{t.role}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        variants={softScale}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 rounded-[28px] clay-lg p-10 text-center"
      >
        <h2 className="font-display text-[28px] font-bold text-clay-slate">
          Ready to understand your report?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[16px] text-clay-muted">
          No sign-up. No stored data. Just calmer, clearer answers.
        </p>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97, y: 2 }}
          onClick={onCta}
          className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-clay-terracotta px-7 py-4 font-display font-semibold text-white clay-btn"
        >
          Try MedLens <ArrowRight className="size-4" aria-hidden />
        </motion.button>
      </motion.section>
    </div>
  );
}
