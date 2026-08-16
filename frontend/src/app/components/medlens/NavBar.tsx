import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, Upload, Menu, X } from "lucide-react";
import type { PageKey } from "./anim";

const LINKS: { key: PageKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "report", label: "Report Analyzer" },
  { key: "xray", label: "X-Ray Analyzer" },
  { key: "history", label: "History" },
  { key: "about", label: "About" },
  { key: "privacy", label: "Privacy & Ethics" },
];

interface NavBarProps {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  onUpload: () => void;
}

export function NavBar({ page, onNavigate, onUpload }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      const firstItem = menuRef.current?.querySelector('button');
      firstItem?.focus();
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center gap-4 rounded-[24px] bg-clay-white/92 backdrop-blur-md px-5 py-3 shadow-[0_12px_32px_-8px_rgba(50,44,74,0.12),inset_0_2px_4px_0_rgba(255,255,255,0.95),inset_0_-2px_4px_0_rgba(50,44,74,0.04)] border border-white/80"
      >
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 rounded-full font-display text-[20px] font-bold text-clay-slate"
          aria-label="MedLens home"
        >
          <span className="grid size-9 place-items-center rounded-[14px] bg-clay-terracotta text-white clay-btn">
            <Stethoscope className="size-5" aria-hidden />
          </span>
          MedLens
        </button>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = page === l.key;
            return (
              <li key={l.key}>
                <button
                  onClick={() => onNavigate(l.key)}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[15px] transition-colors ${
                    active ? "text-clay-slate font-bold" : "text-clay-muted hover:text-clay-slate hover:bg-white/60 font-medium"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-xs border border-black/5"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97, y: 2 }}
            onClick={onUpload}
            className="flex items-center gap-2 rounded-full bg-clay-terracotta px-5 py-2.5 font-display font-semibold text-white clay-btn"
          >
            <Upload className="size-4" aria-hidden />
            <span className="hidden sm:inline">Upload Report</span>
          </motion.button>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-[14px] bg-white text-clay-slate shadow-xs border border-black/5 lg:hidden cursor-pointer"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={menuRef}
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-[22px] bg-clay-white/95 backdrop-blur-md p-2 shadow-lg border border-white/80 lg:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.key}>
                <button
                  onClick={() => {
                    onNavigate(l.key);
                    setOpen(false);
                  }}
                  aria-current={page === l.key ? "page" : undefined}
                  className={`w-full rounded-[16px] px-4 py-3 text-left font-display font-semibold transition-colors ${
                    page === l.key ? "bg-white/70 text-clay-slate clay" : "text-clay-muted hover:bg-white/50"
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
