import { motion } from "motion/react";
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  Scale,
  EyeOff,
  ServerOff,
  HeartHandshake,
  BookOpen,
  Accessibility,
  Github,
  Sparkles,
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

const PRIVACY_POINTS = [
  { icon: ServerOff, title: "Nothing is stored", body: "Your files are processed in-session and discarded the moment you leave. There is no database of your health." },
  { icon: EyeOff, title: "No tracking of your data", body: "We don't sell, share, or mine your report contents. Ever." },
  { icon: Lock, title: "Yours to take", body: "Download or share your summary on your terms. The data belongs to you." },
];

const ETHICS_POINTS = [
  { icon: Scale, title: "Honest about limits", body: "AI can be wrong. We surface confidence levels and never present a guess as a fact." },
  { icon: HeartHandshake, title: "Human in the loop", body: "MedLens is built to send you toward a clinician, not away from one." },
  { icon: Accessibility, title: "Accessible to everyone", body: "Designed to WCAG 2.2 AA with icon, text, and color cues, full keyboard support, and reduced-motion respect." },
];

const CREDITS = [
  { label: "Framework", value: "React + Tailwind CSS" },
  { label: "Motion", value: "Motion (framer)" },
  { label: "Icons", value: "Lucide" },
  { label: "ML references", value: "DenseNet / ViT (illustrative)" },
  { label: "Accessibility review", value: "Venkata Vemuri" },
  { label: "Sample data", value: "Synthetic, non-personal" },
];

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <motion.header variants={fadeUp} initial="hidden" animate="show" className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass-soft px-4 py-1.5 text-[13px] font-semibold text-clay-terracotta">
          <ShieldCheck className="size-3.5" aria-hidden /> Privacy & Ethics
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-[36px] font-bold leading-[1.14] text-clay-slate sm:text-[46px]">
          Your health is personal. We treat it that way.
        </h1>
      </motion.header>

      {/* Medical Disclaimer — the headline safeguard */}
      <motion.section
        aria-labelledby="disclaimer-heading"
        variants={softScale}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-10 rounded-[28px] p-8 sm:p-10"
        style={{ background: "linear-gradient(135deg, #efe7f5, #e6dcf0)" }}
      >
        <div className="flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-clay-terracotta text-white clay-btn">
            <Stethoscope className="size-7" aria-hidden />
          </span>
          <div>
            <h2 id="disclaimer-heading" className="font-display text-[22px] font-bold text-clay-slate">
              Medical Disclaimer
            </h2>
            <p className="mt-2 text-[16px] leading-relaxed text-clay-slate/85">
              MedLens is an <span className="font-semibold text-clay-slate">AI educational assistant, not a doctor</span>.
              It helps you understand your reports in plain language, but it does not diagnose,
              treat, or replace professional medical advice. Always consult a licensed healthcare
              professional about your health, and never delay care because of something you read here.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Privacy Note */}
      <section aria-labelledby="privacy-heading" className="mt-14">
        <SectionTitle id="privacy-heading" icon={Lock} title="Privacy Note" />
        <PointGrid points={PRIVACY_POINTS} />
      </section>

      {/* Ethics */}
      <section aria-labelledby="ethics-heading" className="mt-14">
        <SectionTitle id="ethics-heading" icon={Scale} title="Our Ethics" />
        <PointGrid points={ETHICS_POINTS} />
      </section>

      {/* Credits */}
      <section aria-labelledby="credits-heading" className="mt-14">
        <SectionTitle id="credits-heading" icon={BookOpen} title="Credits" />
        <motion.div
          variants={softScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 rounded-[26px] clay-lg p-7"
        >
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {CREDITS.map((c) => (
              <div key={c.label} className="flex items-center justify-between gap-4 border-b border-clay-slate/8 pb-3">
                <dt className="text-[14px] font-semibold text-clay-muted">{c.label}</dt>
                <dd className="text-right font-display font-semibold text-clay-slate">{c.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-clay-terracotta">
            <Github className="size-4" aria-hidden /> Built with care, open to feedback
          </p>
        </motion.div>
      </section>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-12 flex items-center justify-center gap-2 text-center text-[14px] text-clay-muted"
      >
        <Sparkles className="size-4 text-clay-sage" aria-hidden />
        Thank you for trusting us with something so personal.
      </motion.p>
    </div>
  );
}

function SectionTitle({ id, icon: Icon, title }: { id: string; icon: typeof Lock; title: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="flex items-center gap-2.5"
    >
      <span className="grid size-10 place-items-center rounded-[14px] bg-clay-terracotta/12 text-clay-terracotta">
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 id={id} className="font-display text-[24px] font-bold text-clay-slate">
        {title}
      </h2>
    </motion.div>
  );
}

function PointGrid({ points }: { points: { icon: typeof Lock; title: string; body: string }[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mt-6 grid gap-4 sm:grid-cols-3"
    >
      {points.map((p) => {
        const Icon = p.icon;
        return (
          <motion.article
            key={p.title}
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="clay-hover rounded-[22px] clay bg-white p-6"
          >
            <span className="mb-3 grid size-11 place-items-center rounded-[14px] bg-clay-sage/18 text-clay-sage">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="font-display font-bold text-clay-slate">{p.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-clay-muted">{p.body}</p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
