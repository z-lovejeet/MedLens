import { motion } from "motion/react";
import {
  ArrowRight,
  ScanText,
  FlaskConical,
  Sparkles,
  Leaf,
  Lock,
  ShieldCheck,
  Accessibility,
  HeartPulse,
  Star,
  FileText,
  Activity,
  Quote,
  Languages,
  CheckCircle2,
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

interface LandingProps {
  onEnter: () => void;
  onAbout: () => void;
  onSample?: () => void;
}

const FEATURES = [
  { icon: ScanText, title: "Reads any document", body: "Blood work, lipid panels, CBCs, or chest X-rays. Hand us the page your doctor gave you and we'll handle the rest.", tint: "#8a6fb0" },
  { icon: Sparkles, title: "Translates medical to human", body: "Every clinical term is rewritten at a 6th-grade reading level. Warm, jargon-free, and never scary.", tint: "#6bb89a" },
  { icon: HeartPulse, title: "Adds what they didn't say", body: "Your doctor had 7 minutes. We fill in what they would have explained if they had 30.", tint: "#e48267" },
  { icon: Lock, title: "Private by design", body: "Your reports are translated in your session and never stored. Your health data stays yours.", tint: "#eba85c" },
];

const STEPS = [
  { icon: ScanText, title: "Hand it over", body: "Drop the report or X-ray your doctor gave you." },
  { icon: FlaskConical, title: "We read it", body: "Multi-agent AI decodes every clinical term." },
  { icon: Sparkles, title: "We translate", body: "Medical jargon becomes warm, human sentences." },
  { icon: Leaf, title: "You understand", body: "Walk into your next appointment informed and calm." },
];

const TRUST = [
  { icon: Lock, label: "Zero PII · Privacy-First" },
  { icon: ShieldCheck, label: "Evidence-Based Ranges" },
  { icon: Accessibility, label: "WCAG 2.2 AA Accessible" },
];

export function Landing({ onEnter, onAbout, onSample }: LandingProps) {
  return (
    <div className="relative">
      {/* Mid-page gentle ambient accents (Unified Signature Theme) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/4 h-[800px] overflow-hidden" aria-hidden>
        <div className="aurora-blob animate-floaty" style={{ background: "#8a6fb0", width: 360, height: 360, top: "20%", left: "5%", opacity: 0.16, animationDelay: "-2s" }} />
        <div className="aurora-blob animate-floaty" style={{ background: "#8a6fb0", width: 340, height: 340, top: "50%", right: "8%", opacity: 0.14, animationDelay: "-6s" }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
        <div>
          <motion.span
            variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta"
          >
            <Sparkles className="size-3.5" aria-hidden /> AI-Powered Medical Translator
          </motion.span>

          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="mt-5 font-display text-[44px] font-bold leading-[1.06] text-clay-slate sm:text-[62px]"
          >
            Your report, finally in{" "}
            <span className="relative whitespace-nowrap text-clay-terracotta">
              your language
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9C40 3 160 3 198 9" stroke="#e48267" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="mt-6 max-w-lg text-[18px] leading-relaxed text-clay-muted"
          >
            90% of patients leave the doctor confused by their own results. MedLens sits between doctor language and yours, turning lab work, blood panels, and chest X-rays into warm, clear explanations you can actually understand.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }}
              onClick={onEnter}
              className="flex items-center gap-2 rounded-full bg-clay-terracotta px-7 py-4 font-display font-semibold text-white clay-btn"
            >
              Translate my report <ArrowRight className="size-4" aria-hidden />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }}
              onClick={onSample ?? onEnter}
              className="flex items-center gap-2 rounded-full glass px-7 py-4 font-display font-semibold text-clay-slate"
            >
              <FileText className="size-4" aria-hidden /> Try a sample
            </motion.button>
          </motion.div>

          <motion.ul variants={fadeUp} custom={4} initial="hidden" animate="show" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-semibold text-clay-muted">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.label} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Icon className="size-4 text-clay-sage" aria-hidden /> {t.label}
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Floating Live Translation Preview Card */}
        <motion.div
          variants={softScale}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-[420px]"
        >
          {/* Floating Pill Top Right (No overlapping) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-2 z-20 flex items-center gap-1.5 rounded-full clay-pill bg-white/95 px-3.5 py-1.5 text-[12px] font-bold text-clay-slate border border-black/5"
          >
            <Languages className="size-3.5 text-clay-terracotta" aria-hidden />
            <span>6th-grade clarity</span>
          </motion.div>

          {/* Floating Pill Bottom Left (No overlapping) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -bottom-4 -left-2 z-20 flex items-center gap-1.5 rounded-full clay-pill bg-white/95 px-3.5 py-1.5 text-[12px] font-bold text-clay-slate border border-black/5"
          >
            <ShieldCheck className="size-3.5 text-clay-sage" aria-hidden />
            <span>Zero data stored · Private</span>
          </motion.div>

          {/* Main Clay Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[30px] clay-lg bg-white/95 p-5 sm:p-6 backdrop-blur-md border border-white/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-[14px] bg-clay-terracotta text-white clay-btn">
                  <Sparkles className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[16px] font-bold text-clay-slate leading-tight">
                    Live Translation
                  </p>
                  <p className="text-[12.5px] font-medium text-clay-muted">
                    Doctor Language <span className="text-clay-terracotta font-semibold">➔</span> Yours
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-sage/15 px-2.5 py-1 text-[11.5px] font-bold text-clay-sage">
                <span className="size-1.5 rounded-full bg-clay-sage animate-pulse" />
                Active
              </span>
            </div>

            {/* Translation Demo Items */}
            <div className="mt-4 space-y-3">
              {/* Item 1: Blood Marker */}
              <div className="rounded-[20px] bg-clay-cream/60 p-3.5 border border-black/[0.04] transition-all hover:bg-clay-cream/90">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-clay-muted bg-white/80 px-2 py-0.5 rounded-md">
                    HbA1c · 5.4%
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-clay-sage">
                    <CheckCircle2 className="size-3" /> Optimal
                  </span>
                </div>
                <p className="mt-2 text-[13.5px] font-medium text-clay-slate leading-snug">
                  "Your 3-month blood sugar is steady, healthy, and right where it should be."
                </p>
              </div>

              {/* Item 2: Jargon Decoded */}
              <div className="rounded-[20px] bg-clay-cream/60 p-3.5 border border-black/[0.04] transition-all hover:bg-clay-cream/90">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-clay-muted bg-white/80 px-2 py-0.5 rounded-md">
                    LDL · 138 mg/dL
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-clay-amber">
                    <HeartPulse className="size-3" /> Worth asking
                  </span>
                </div>
                <p className="mt-2 text-[13.5px] font-medium text-clay-slate leading-snug">
                  "Slightly above ideal. A small swap in cooking oils and brisk walks will help."
                </p>
              </div>

              {/* Item 3: Chest X-Ray Translation */}
              <div className="rounded-[20px] bg-clay-cream/60 p-3.5 border border-black/[0.04] transition-all hover:bg-clay-cream/90">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11.5px] font-semibold text-clay-muted bg-white/80 px-2 py-0.5 rounded-md">
                    Chest X-Ray · PA View
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-clay-sage">
                    <Activity className="size-3" /> Clear scan
                  </span>
                </div>
                <p className="mt-2 text-[13.5px] font-medium text-clay-slate leading-snug">
                  "Both lung fields are completely clear with healthy airflow throughout."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Emotional storytelling band */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <motion.blockquote
          variants={softScale} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="rounded-[30px] clay-lg p-8 text-center sm:p-12"
        >
          <Quote className="mx-auto mb-4 size-8 text-clay-terracotta/40" aria-hidden />
          <p className="mx-auto max-w-2xl font-display text-[24px] font-semibold leading-relaxed text-clay-slate sm:text-[28px]">
            "Not understanding your own body is its own kind of fear. I built MedLens because everyone deserves a translator for the scariest page they'll ever read."
          </p>
          <button onClick={onAbout} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-clay-terracotta hover:underline">
            Why I built this translator <ArrowRight className="size-4" aria-hidden />
          </button>
        </motion.blockquote>
      </section>

      {/* Features */}
      <section aria-labelledby="feat-heading" className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <SectionHeading id="feat-heading" kicker="Why MedLens" title="A translator for the language your body speaks" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.article key={f.title} variants={fadeUp} whileHover={{ y: -6 }} className="clay-hover rounded-[24px] glass p-6">
                <span className="mb-4 grid size-12 place-items-center rounded-[16px] text-white clay-btn" style={{ background: f.tint }}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display font-bold text-clay-slate">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-clay-muted">{f.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <SectionHeading id="how-heading" kicker="How it works" title="Four steps from confusion to clarity" />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article key={s.title} variants={fadeUp} className="relative rounded-[24px] glass-soft p-6">
                <span className="absolute right-5 top-5 font-display text-[34px] font-bold text-clay-slate/10" aria-hidden>{i + 1}</span>
                <span className="mb-4 grid size-12 place-items-center rounded-[16px] bg-clay-terracotta text-white clay-btn">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-display font-bold text-clay-slate">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-clay-muted">{s.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-8 text-center font-display text-2xl font-bold text-clay-slate"
        >
          What early users are saying
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Review 1 */}
          <motion.figure variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-[24px] clay bg-clay-white p-6">
            <div className="mb-3 flex gap-1 text-clay-amber" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-[15px] leading-relaxed text-clay-slate">
              "For the first time I understood my blood work without spiraling into panic. It felt like a kind friend translating everything for me."
            </blockquote>
            <figcaption className="mt-4 text-[13px] font-semibold text-clay-muted">Priya · early access user</figcaption>
          </motion.figure>

          {/* Review 2 - Mother */}
          <motion.figure variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-[24px] clay bg-clay-white p-6">
            <div className="mb-3 flex gap-1 text-clay-amber" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-[15px] leading-relaxed text-clay-slate">
              "My son showed me this after my routine checkup. The translation was so clear I finally understood why my vitamin D was low and what I could actually do about it."
            </blockquote>
            <figcaption className="mt-4 text-[13px] font-semibold text-clay-muted">Sunita S. · early access user</figcaption>
          </motion.figure>

          {/* Review 3 - Father */}
          <motion.figure variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }} className="rounded-[24px] clay bg-clay-white p-6">
            <div className="mb-3 flex gap-1 text-clay-amber" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-[15px] leading-relaxed text-clay-slate">
              "I used to just file my reports away because I couldn't read them. Now MedLens translates everything and the wellness tips are genuinely helpful. Shared it with my whole office."
            </blockquote>
            <figcaption className="mt-4 text-[13px] font-semibold text-clay-muted">Rajesh S. · early access user</figcaption>
          </motion.figure>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-8">
        <motion.div variants={softScale} initial="hidden" whileInView="show" viewport={{ once: true }} className="overflow-hidden rounded-[32px] glass p-10 text-center">
          <span className="mx-auto mb-5 grid size-16 place-items-center rounded-[22px] bg-clay-terracotta text-white clay-btn clay-pulse">
            <HeartPulse className="size-8" aria-hidden />
          </span>
          <h2 className="font-display text-[32px] font-bold text-clay-slate sm:text-[40px]">Your reports deserve a translator.</h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-clay-muted">No sign-up, no stored data. Just your doctor's words, finally in yours.</p>
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }} onClick={onEnter} className="mx-auto mt-7 flex items-center gap-2 rounded-full bg-clay-terracotta px-8 py-4 font-display font-semibold text-white clay-btn">
            Start translating <ArrowRight className="size-4" aria-hidden />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

function SectionHeading({ id, kicker, title }: { id: string; kicker: string; title: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta">{kicker}</span>
      <h2 id={id} className="mt-4 font-display text-[30px] font-bold leading-tight text-clay-slate sm:text-[38px]">{title}</h2>
    </motion.div>
  );
}
