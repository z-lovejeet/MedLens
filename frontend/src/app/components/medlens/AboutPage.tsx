import { motion } from "motion/react";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  HandHeart,
  Leaf,
  ArrowRight,
  Code2,
  Brain,
  Languages,
  Clock,
  Stethoscope,
  BookOpen,
  Zap,
  Users,
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

interface AboutPageProps {
  onCta: () => void;
}

export function AboutPage({ onCta }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      {/* Origin Story - Hero */}
      <motion.header variants={fadeUp} initial="hidden" animate="show" className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta">
          <Heart className="size-3.5 fill-clay-coral text-clay-coral" aria-hidden /> Why this exists
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-[36px] font-bold leading-[1.12] text-clay-slate sm:text-[48px]">
          It started with a page nobody could read.
        </h1>
      </motion.header>

      {/* The Story - emotional, personal, two paragraphs */}
      <motion.section
        variants={softScale}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 mt-8 rounded-[28px] clay-lg bg-clay-white p-8 sm:p-10"
      >
        <p className="text-[18px] leading-relaxed text-clay-slate/90">
          My parent came home from a routine checkup holding a page full of numbers, arrows, and abbreviations.
          No explanation. No context. Just <span className="font-semibold text-clay-slate">"your levels are off, see a specialist."</span>
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-clay-muted">
          That night was long. Not because the news was bad (it wasn't), but because
          <em> not understanding your own body</em> is its own kind of fear.
          I stayed up Googling terms that only made it worse. And I thought:
          <span className="font-semibold text-clay-slate"> why doesn't someone just translate this?</span>
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-clay-muted">
          So I built the translator myself. MedLens exists because no one should sit alone with a page they can't read.
        </p>
      </motion.section>

      {/* The Problem - stat cards */}
      <section className="mt-14">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
          <h2 className="font-display text-[28px] font-bold text-clay-slate">The problem is bigger than you think</h2>
          <p className="mt-2 text-clay-muted">Published research that shaped every design decision in MedLens.</p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          {[
            { stat: "90%", label: "of patients leave confused by their lab results", source: "JAMA, 2023", color: "#e48267" },
            { stat: "7 min", label: "average time a doctor spends explaining your report", source: "BMJ Open, 2022", color: "#8a6fb0" },
            { stat: "80%", label: "Google their symptoms and feel worse afterward", source: "Pew Research, 2023", color: "#eba85c" },
          ].map((s) => (
            <motion.article
              key={s.stat}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="clay-hover rounded-[24px] clay bg-white p-6 text-center"
            >
              <p className="font-display text-[42px] font-bold" style={{ color: s.color }}>{s.stat}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-clay-slate">{s.label}</p>
              <p className="mt-2 text-[12px] font-semibold text-clay-muted">{s.source}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* How MedLens Translates */}
      <section className="mt-14">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
          <h2 className="font-display text-[28px] font-bold text-clay-slate">How the translation works</h2>
          <p className="mt-2 text-clay-muted">Six AI agents work together to turn doctor-speak into your language.</p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            { icon: Stethoscope, title: "OCR Agent", body: "Reads handwritten and printed lab values from PDFs and photos.", tint: "#8a6fb0" },
            { icon: Code2, title: "Parser Agent", body: "Structures raw data into standardized medical metrics with reference ranges.", tint: "#6bb89a" },
            { icon: Languages, title: "Translator Agent", body: "Rewrites every clinical term at a 6th-grade reading level. Warm, never scary.", tint: "#e48267" },
            { icon: ShieldCheck, title: "Safety Agent", body: "Flags critical values and ensures no misleading claims reach you.", tint: "#eba85c" },
            { icon: Leaf, title: "Wellness Agent", body: "Generates personalized nutrition, sleep, and activity guidance from your results.", tint: "#6bb89a" },
            { icon: Brain, title: "Vision Agent", body: "Analyzes chest X-rays using DenseNet and Vision Transformer architectures.", tint: "#8a6fb0" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <motion.article key={a.title} variants={fadeUp} whileHover={{ y: -5 }} className="clay-hover rounded-[24px] clay bg-white p-6">
                <span className="mb-4 grid size-12 place-items-center rounded-[16px] text-white clay-btn" style={{ background: a.tint }}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display font-bold text-clay-slate">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-clay-muted">{a.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* Tech Stack - compact */}
      <section className="mt-14">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center">
          <h2 className="font-display text-[28px] font-bold text-clay-slate">Built with</h2>
        </motion.div>
        <motion.div
          variants={softScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 rounded-[26px] clay-lg p-7"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "LangGraph", "Gemini Vision API", "DenseNet-121", "Vision Transformer",
              "React", "Vite", "Motion", "jsPDF", "FastAPI", "Python",
            ].map((t) => (
              <span key={t} className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-clay-slate shadow-xs border border-black/5">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Solo Creator */}
      <section aria-labelledby="creator-heading" className="mt-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 id="creator-heading" className="font-display text-[28px] font-bold text-clay-slate">
            One person. One mission.
          </h2>
          <p className="mt-2 text-clay-muted">Every line of code, every pixel, every prompt. Built solo in 48 hours.</p>
        </motion.div>

        <motion.div
          variants={softScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto max-w-md"
        >
          <motion.article
            whileHover={{ y: -4 }}
            className="clay-hover rounded-[28px] clay bg-white p-8 text-center"
          >
            <div className="relative mx-auto mb-4 size-20">
              <span
                className="grid size-20 place-items-center rounded-full font-display text-[26px] font-bold text-white clay-btn shadow-md"
                style={{ background: "linear-gradient(135deg, #8a6fb0, #e48267)" }}
                aria-hidden
              >
                LS
              </span>
            </div>

            <h3 className="font-display text-[22px] font-bold text-clay-slate">
              Lovejeet Singh
            </h3>
            <p className="mt-1 font-display text-[15px] font-semibold text-clay-terracotta">
              Fullstack and AI Engineer
            </p>
            <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-clay-muted">
              I believe the scariest page you'll ever hold deserves a translator. That's why I built MedLens.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-clay-muted">
              <span className="inline-flex items-center gap-1 rounded-full bg-clay-cream px-3 py-1 font-medium text-clay-slate">
                <Brain className="size-3.5 text-clay-terracotta" /> Multi-Agent AI
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-clay-cream px-3 py-1 font-medium text-clay-slate">
                <Code2 className="size-3.5 text-clay-sage" /> Full Stack
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-clay-cream px-3 py-1 font-medium text-clay-slate">
                <Zap className="size-3.5 text-clay-amber" /> Solo Developer
              </span>
            </div>
          </motion.article>
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
          Your next report deserves a translator.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[16px] text-clay-muted">
          Drop in a blood report or chest X-ray. Warm, human translations in seconds.
        </p>
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98, y: 1 }}
            onClick={onCta}
            className="inline-flex items-center gap-2 rounded-full bg-clay-terracotta px-8 py-3.5 font-display text-[16px] font-semibold text-white clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 cursor-pointer"
          >
            Start translating <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
