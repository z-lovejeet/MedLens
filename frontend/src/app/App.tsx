import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, AnimatePresence, motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { NavBar } from "./components/medlens/NavBar";
import { Footer } from "./components/medlens/Footer";
import { Landing } from "./components/medlens/Landing";
import { AnalyzerFlow } from "./components/medlens/AnalyzerFlow";
import { AboutPage } from "./components/medlens/AboutPage";
import { PrivacyPage } from "./components/medlens/PrivacyPage";
import { HistoryPage } from "./components/medlens/HistoryPage";
import { DisclaimerModal } from "./components/medlens/Disclaimer";
import { pageVariants, type PageKey } from "./components/medlens/anim";

export default function App() {
  const [page, setPage] = useState<PageKey>("home");
  const [accepted, setAccepted] = useState(() => localStorage.getItem('medlens-disclaimer') === 'true');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navigate = useCallback((p: PageKey) => {
    setPage(p);
    scrollTop();
  }, []);

  const skipToMain = (e: React.MouseEvent) => {
    e.preventDefault();
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link" onClick={skipToMain}>
        Skip to main content
      </a>

      <div className="min-h-screen bg-cream relative overflow-x-hidden">
        {/* Single Centered Ambient Header Glow (Signature Dusty Grape #8a6fb0) */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[520px] overflow-hidden z-0" aria-hidden>
          <div
            className="aurora-blob animate-floaty"
            style={{
              background: "#8a6fb0",
              width: 720,
              height: 480,
              top: -180,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0.32,
            }}
          />
        </div>

        <DisclaimerModal open={!accepted} onAccept={() => { setAccepted(true); localStorage.setItem('medlens-disclaimer', 'true'); }} />

        <NavBar page={page} onNavigate={navigate} onUpload={() => navigate("report")} />

        <main id="main" ref={mainRef} tabIndex={-1} className="relative z-10 outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="relative z-10 pt-6"
            >
              {page === "home" && (
                <Landing onEnter={() => navigate("report")} onAbout={() => navigate("about")} onSample={() => navigate("report")} />
              )}

              {page === "report" && <AnalyzerFlow key="report" kind="blood" />}

              {page === "xray" && <AnalyzerFlow key="xray" kind="xray" />}

              {page === "history" && <HistoryPage onNavigate={navigate} />}

              {page === "about" && <AboutPage onCta={() => navigate("report")} />}

              {page === "privacy" && <PrivacyPage />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onNavigate={navigate} />
      </div>

      <Toaster position="top-center" richColors />
    </MotionConfig>
  );
}
