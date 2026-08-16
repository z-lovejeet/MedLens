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
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

interface LandingProps {
  onEnter: () => void;
  onAbout: () => void;
  onSample?: () => void;
}

const FEATURES = [
  { icon: ScanText, title: "Reads any report", body: "Blood work, lipid panels, CBCs or chest X-rays. Drop a PDF or photo and we handle the rest.", tint: "#8a6fb0" },
  { icon: Sparkles, title: "Plain-English answers", body: "Every term is rewritten at a 6th-grade reading level, warm and free of scary jargon.", tint: "#6bb89a" },
  { icon: HeartPulse, title: "Gentle guidance", body: "Cozy, personalized lifestyle nudges. Never alarmist, always kind and actionable.", tint: "#e48267" },
  { icon: Lock, title: "Private by design", body: "Files are processed in your session and never stored. Your health stays yours.", tint: "#eba85c" },
];

const STEPS = [
  { icon: ScanText, title: "Upload", body: "Drop a report or X-ray, or try a sample." },
  { icon: FlaskConical, title: "We decode", body: "Multi-agent AI standardizes every metric." },
  { icon: Sparkles, title: "Understand", body: "Read cozy, plain-language explanations." },
  { icon: Leaf, title: "Act gently", body: "Get tailored wellness steps for your doctor visit." },
];

const TRUST = [
  { icon: Lock, label: "No data saved" },
  { icon: ShieldCheck, label: "Clinician-verified framework" },
  { icon: Accessibility, label: "WCAG 2.2 AA" },
];

export function Landing({ onEnter, onAbout, onSample }: LandingProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Aurora backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="aurora-blob animate-floaty" style={{ background: "#8a6fb0", width: 440, height: 440, top: 40, left: -60 }} />
        <div className="aurora-blob animate-floaty" style={{ background: "#6bb89a", width: 400, height: 400, top: 100, right: -80, animationDelay: "-3s" }} />
        <div className="aurora-blob animate-floaty" style={{ background: "#e48267", width: 380, height: 380, bottom: -120, left: "35%", animationDelay: "-6s" }} />
        <div className="aurora-blob animate-floaty" style={{ background: "#eba85c", width: 300, height: 300, top: "45%", left: "8%", animationDelay: "-2s" }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
        <div>
          <motion.span
            variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta"
          >
            <Sparkles className="size-3.5" aria-hidden /> Multi-agent AI, made human
          </motion.span>

          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="mt-5 font-display text-[44px] font-bold leading-[1.06] text-clay-slate sm:text-[62px]"
          >
            Your medical reports, finally in{" "}
            <span className="relative whitespace-nowrap text-clay-terracotta">
              human language
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9C40 3 160 3 198 9" stroke="#e48267" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="mt-6 max-w-lg text-[18px] leading-relaxed text-clay-muted"
          >
            No one should sit alone with a page of numbers they can't read. Drop your blood work,
            lab test, or chest X-ray, MedLens turns it into warm, cozy explanations you can
            actually understand.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="mt-8 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }}
              onClick={onEnter}
              className="flex items-center gap-2 rounded-full bg-clay-terracotta px-7 py-4 font-display font-semibold text-white clay-btn"
            >
              Explain my report <ArrowRight className="size-4" aria-hidden />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }}
              onClick={onSample ?? onEnter}
              className="flex items-center gap-2 rounded-full glass px-7 py-4 font-display font-semibold text-clay-slate"
            >
              <FileText className="size-4" aria-hidden /> Try a sample
            </motion.button>
          </motion.div>

          <motion.ul variants={fadeUp} custom={4} initial="hidden" animate="show" className="mt-8 flex flex-wrap gap-4">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.label} className="inline-flex items-center gap-2 text-[14px] font-semibold text-clay-muted">
                  <Icon className="size-4 text-clay-sage" aria-hidden /> {t.label}
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Floating glass preview */}
        <motion.div variants={softScale} initial="hidden" animate="show" className="relative mx-auto w-full max-w-sm">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[28px] glass p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[16px] bg-clay-sage text-white clay-btn">
                <Leaf className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-display font-bold text-clay-slate">Overall summary</p>
                <p className="text-[13px] text-clay-muted">Mostly great news</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { name: "Hemoglobin", tag: "Optimal", c: "#6bb89a", w: "72%" },
                { name: "Cholesterol", tag: "Worth asking", c: "#e48267", w: "88%" },
                { name: "Vitamin D", tag: "Slightly low", c: "#eba85c", w: "40%" },
              ].map((m) => (
                <div key={m.name} className="rounded-[18px] bg-white/55 p-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-clay-slate">{m.name}</span>
                    <span className="font-semibold" style={{ color: m.c }}>{m.tag}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/70">
                    <motion.div initial={{ width: 0 }} animate={{ width: m.w }} transition={{ duration: 1, delay: 0.6 }} className="h-full rounded-full" style={{ background: m.c }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-6 top-6 flex items-center gap-2 rounded-full glass px-3 py-2 text-[12px] font-semibold text-clay-slate">
            <Activity className="size-4 text-clay-terracotta" aria-hidden /> X-ray ready
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -right-4 bottom-10 flex items-center gap-2 rounded-full glass px-3 py-2 text-[12px] font-semibold text-clay-slate">
            <ShieldCheck className="size-4 text-clay-sage" aria-hidden /> 100% private
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
            “Not understanding is its own kind of fear. We built MedLens so no one has to sit
            alone with a page they can't read.”
          </p>
          <button onClick={onAbout} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-clay-terracotta hover:underline">
            Read our story <ArrowRight className="size-4" aria-hidden />
          </button>
        </motion.blockquote>
      </section>

      {/* Features */}
      <section aria-labelledby="feat-heading" className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <SectionHeading id="feat-heading" kicker="Why MedLens" title="Health data that finally feels friendly" />
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
        <SectionHeading id="how-heading" kicker="How it works" title="Four cozy steps to clarity" />
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
          Loved by early access users
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
              "For the first time I understood my blood work without spiraling into panic. It felt
              like a kind friend sitting beside me."
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
              "My son showed me this after my routine checkup. I finally understood why the
              doctor said my vitamin D was low and what I could actually do about it. So
              simple even I could use it!"
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
              "I used to just file my reports away and forget about them. Now I actually
              read the explanations and the lifestyle tips are genuinely helpful. Shared it
              with my whole office."
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
          <h2 className="font-display text-[32px] font-bold text-clay-slate sm:text-[40px]">Ready to understand your health?</h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-clay-muted">No sign-up, no stored data. Just calmer, clearer answers in seconds.</p>
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97, y: 2 }} onClick={onEnter} className="mx-auto mt-7 flex items-center gap-2 rounded-full bg-clay-terracotta px-8 py-4 font-display font-semibold text-white clay-btn">
            Launch MedLens <ArrowRight className="size-4" aria-hidden />
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
