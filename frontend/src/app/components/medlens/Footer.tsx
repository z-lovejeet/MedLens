import { motion } from "motion/react";
import { Stethoscope, Heart, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { PageKey } from "./anim";

interface FooterProps {
  onNavigate: (p: PageKey) => void;
}

const COLS: { title: string; links: { label: string; page?: PageKey }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Report Analyzer", page: "report" },
      { label: "X-Ray Analyzer", page: "xray" },
      { label: "Wellness Hub", page: "about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", page: "about" },
      { label: "Privacy & Ethics", page: "privacy" },
      { label: "Privacy & Credits", page: "privacy" },
    ],
  },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative mt-24 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[32px] clay-lg p-8 sm:p-12"
      >
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 font-display text-[22px] font-bold text-clay-slate">
              <span className="grid size-10 place-items-center rounded-[16px] bg-clay-terracotta text-white clay-btn">
                <Stethoscope className="size-5" aria-hidden />
              </span>
              MedLens
            </div>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-clay-muted">
              We turn cold, confusing medical reports into warm, human explanations —
              so you can breathe easier and make calmer decisions about your health.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-semibold text-clay-sage">
              <ShieldCheck className="size-4" aria-hidden /> Private by design · No data saved
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-display text-[15px] font-bold text-clay-slate">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => l.page && onNavigate(l.page)}
                      className="group inline-flex items-center gap-1 text-[15px] text-clay-muted transition-colors hover:text-clay-terracotta"
                    >
                      {l.label}
                      <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-clay-slate/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-[13px] text-clay-muted">
              MedLens is an AI educational assistant, <span className="font-semibold text-clay-slate">not a doctor</span>.
              Always consult a licensed healthcare professional.
            </p>
            <p className="inline-flex items-center gap-1.5 text-[13px] text-clay-muted">
              Made with <Heart className="size-3.5 fill-clay-coral text-clay-coral" aria-label="love" /> for calmer health
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
