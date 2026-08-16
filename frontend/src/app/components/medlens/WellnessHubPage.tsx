import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Apple, Moon, Dumbbell, Brain, Droplets,
  Wind, ShieldCheck, Smile, BookOpen, ArrowRight,
  Sparkles, Salad, Coffee, Pill, Eye, Timer,
  Footprints, Flower2, Music, Sun, Flame,
  GlassWater, Beef, Wheat, Cherry, Fish, Egg,
  X, CheckCircle2
} from "lucide-react";
import { fadeUp, stagger, softScale } from "./anim";

interface WellnessHubPageProps {
  onAnalyze: () => void;
}

export function WellnessHubPage({ onAnalyze }: WellnessHubPageProps) {
  const [showFloatingCTA, setShowFloatingCTA] = useState(true);

  const colors = {
    purple: "#8a6fb0",
    green: "#6bb89a",
    coral: "#e48267",
    orange: "#eba85c",
    pink: "#e87da0",
  };

  const nutritionCards = [
    { title: "Eat the rainbow", text: "Aim for 5 colors of vegetables daily. Diverse phytonutrients protect your cells and reduce inflammation.", icon: Salad, color: colors.coral },
    { title: "Protein at every meal", text: "Include lean protein (eggs, fish, lentils, chicken) to maintain muscle, stabilize blood sugar, and keep you full.", icon: Egg, color: colors.purple },
    { title: "Healthy fats matter", text: "Avocado, nuts, olive oil, and fatty fish (omega-3s) support brain health, hormones, and heart function.", icon: Fish, color: colors.orange },
    { title: "Limit processed sugar", text: "Excess sugar drives inflammation, insulin resistance, and energy crashes. Read labels carefully.", icon: Cherry, color: colors.pink },
    { title: "Fiber is your friend", text: "25-30g daily from whole grains, beans, and vegetables. Essential for gut health and cholesterol control.", icon: Wheat, color: colors.green },
    { title: "Stay hydrated", text: "2-3 liters of water daily. Dehydration impacts cognition, mood, energy, and kidney function.", icon: GlassWater, color: colors.purple },
  ];

  const physicalCards = [
    { title: "Walk 10,000 steps", text: "The simplest habit with the biggest ROI. Reduces heart disease, diabetes risk, and improves mood.", icon: Footprints, color: colors.coral },
    { title: "Strength training 2x/week", text: "Build muscle to boost metabolism, protect joints, and maintain bone density as you age.", icon: Dumbbell, color: colors.purple },
    { title: "Stretch daily", text: "10 minutes of stretching or yoga improves flexibility, reduces injury risk, and eases chronic tension.", icon: Wind, color: colors.green },
    { title: "Rest days matter", text: "Recovery is when your body actually gets stronger. Overtraining increases cortisol and injury risk.", icon: Timer, color: colors.orange },
  ];

  const sleepCards = [
    { title: "7-9 hours nightly", text: "Adults need this range. Consistency matters more than weekend catch-up sleep.", icon: Moon, color: colors.purple },
    { title: "Screen curfew", text: "Blue light suppresses melatonin. Stop screens 60 minutes before bed for deeper, more restorative sleep.", icon: Eye, color: colors.coral },
    { title: "Cool, dark room", text: "18-20 degrees celsius (65-68 F) is optimal. Blackout curtains and white noise help.", icon: Flame, color: colors.green },
    { title: "Wind-down ritual", text: "Reading, gentle stretching, or deep breathing signals your nervous system it's time to power down.", icon: Flower2, color: colors.pink },
  ];

  const mentalCards = [
    { title: "Daily stillness", text: "Even 5 minutes of meditation or deep breathing reduces anxiety and improves focus. Apps like Headspace help.", icon: Brain, color: colors.orange },
    { title: "Talk to someone", text: "Therapy is not weakness. Regular conversations with a professional or trusted friend improve resilience.", icon: Smile, color: colors.purple },
    { title: "Limit doomscrolling", text: "Social media overuse is linked to increased anxiety and depression. Set daily screen time limits.", icon: Coffee, color: colors.pink },
    { title: "Gratitude practice", text: "Writing 3 things you're grateful for daily rewires your brain toward positivity. Takes 2 minutes.", icon: Music, color: colors.green },
  ];

  const preventiveCards = [
    { title: "Annual blood work", text: "CBC, lipid panel, metabolic panel, thyroid, and vitamin levels. Know your baseline numbers.", icon: Heart, color: colors.coral },
    { title: "Blood pressure check", text: "Hypertension is the \"silent killer.\" Check at least twice a year, more often if elevated.", icon: ShieldCheck, color: colors.purple },
    { title: "Dental checkups", text: "Oral health is linked to heart disease. Professional cleaning every 6 months.", icon: Pill, color: colors.pink },
    { title: "Eye exams", text: "Annual exams catch glaucoma, diabetes signs, and hypertension-related changes early.", icon: Eye, color: colors.green },
  ];

  const checklistItems = [
    "Drink 8 glasses of water",
    "Eat 5 servings of fruits and vegetables",
    "Move for at least 30 minutes",
    "Sleep 7-9 hours",
    "Take 5 minutes of quiet breathing",
    "Step outside for fresh air and sunlight",
    "Connect with someone you care about",
    "Put your phone down 1 hour before bed"
  ];

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-12">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-600 text-lg leading-relaxed">{subtitle}</p>
    </motion.div>
  );

  const SectionGrid = ({ cards, columns = 2 }: { cards: any[], columns?: number }) => (
    <motion.div 
      variants={stagger} 
      initial="initial" 
      whileInView="animate" 
      viewport={{ once: true }} 
      className={`grid grid-cols-1 md:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''} gap-6`}
    >
      {cards.map((card, idx) => (
        <motion.div 
          key={idx} 
          variants={fadeUp} 
          whileHover={{ y: -4 }} 
          className="clay p-6 rounded-[24px] clay-hover flex flex-col gap-4 bg-white"
        >
          <div 
            className="size-12 rounded-[16px] flex items-center justify-center clay-sm" 
            style={{ backgroundColor: `${card.color}18`, color: card.color }}
          >
            <card.icon className="size-6" />
          </div>
          <div>
            <h3 className="font-display text-[18px] font-bold text-clay-slate mb-1.5">{card.title}</h3>
            <p className="text-[15px] text-clay-muted leading-relaxed">{card.text}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-20 relative pb-40" aria-labelledby="wellness-hub-title">
      
      {/* 1. Hero Section */}
      <motion.section 
        variants={stagger} 
        initial="initial" 
        animate="animate" 
        className="text-center space-y-4 pt-6"
      >
        <motion.div variants={softScale} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-soft text-clay-terracotta font-semibold text-[13px] mb-2">
          <Sparkles className="size-3.5" />
          Your Wellness Library
        </motion.div>
        <motion.h1 id="wellness-hub-title" variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold text-clay-slate leading-tight tracking-tight">
          Everything your body needs, <br className="hidden md:block" /> in one place.
        </motion.h1>
        <motion.p variants={fadeUp} className="text-[17px] text-clay-muted max-w-2xl mx-auto leading-relaxed">
          A research-backed guide to physical, mental, and internal wellness. Bookmark this page and revisit anytime.
        </motion.p>
      </motion.section>

      {/* 3. Nutrition & Diet Section */}
      <section aria-labelledby="nutrition-title">
        <SectionHeader 
          title="Fuel your body right" 
          subtitle="What you eat shapes how you feel, think, and heal." 
        />
        <SectionGrid cards={nutritionCards} columns={3} />
      </section>

      {/* 4. Physical Activity Section */}
      <section aria-labelledby="physical-title">
        <SectionHeader 
          title="Move your body, clear your mind" 
          subtitle="150 minutes of moderate activity per week reduces all-cause mortality by 31%. (WHO, 2022)" 
        />
        <SectionGrid cards={physicalCards} columns={2} />
      </section>

      {/* 5. Sleep & Recovery Section */}
      <section aria-labelledby="sleep-title">
        <SectionHeader 
          title="Sleep is not optional" 
          subtitle="Poor sleep is linked to obesity, heart disease, depression, and weakened immunity. (National Sleep Foundation)" 
        />
        <SectionGrid cards={sleepCards} columns={2} />
      </section>

      {/* 6. Mental Health & Stress Section */}
      <section aria-labelledby="mental-title">
        <SectionHeader 
          title="Your mind needs care too" 
          subtitle="Mental health is physical health. Chronic stress raises cortisol, blood pressure, and inflammation." 
        />
        <SectionGrid cards={mentalCards} columns={2} />
      </section>

      {/* 7. Preventive Health Section */}
      <section aria-labelledby="preventive-title">
        <SectionHeader 
          title="Catch it early, fix it easy" 
          subtitle="Regular checkups catch problems when they're small. Prevention is always cheaper than treatment." 
        />
        <SectionGrid cards={preventiveCards} columns={2} />
      </section>

      {/* 8. Daily Wellness Checklist */}
      <section aria-labelledby="checklist-title">
        <SectionHeader 
          title="Your daily reset" 
          subtitle="Simple habits that compound over time. Check these off every day." 
        />
        <motion.div 
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="clay p-8 md:p-10 rounded-[28px] bg-white max-w-3xl mx-auto"
        >
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
            {checklistItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3.5">
                <CheckCircle2 className="size-5 text-clay-sage shrink-0 mt-0.5" />
                <span className="text-clay-slate font-medium text-[15.5px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* 9. Bottom CTA Section */}
      <section aria-labelledby="bottom-cta-title">
        <motion.div 
          variants={softScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="rounded-[28px] clay-lg p-10 text-center"
        >
          <h2 id="bottom-cta-title" className="font-display text-[28px] font-bold text-clay-slate">
            Want guidance tailored to you?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[16px] text-clay-muted">
            Upload your blood report or chest X-ray, and MedLens will translate your results into a personalized wellness plan.
          </p>
          <div className="mt-6">
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98, y: 1 }}
              onClick={onAnalyze}
              className="inline-flex items-center gap-2 rounded-full bg-clay-terracotta px-8 py-3.5 font-display text-[16px] font-semibold text-white clay-btn focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-terracotta/40 cursor-pointer"
            >
              Get my personalized plan <ArrowRight className="size-4" aria-hidden />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* 2. Floating Personalization CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 1 }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 px-5 py-3.5 glass rounded-full w-[92%] max-w-[500px]"
          >
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <span className="text-clay-slate font-medium text-sm sm:text-[14.5px] leading-tight">
                 Want wellness tips tailored to <em className="font-semibold not-italic text-clay-terracotta">your</em> report?
               </span>
               <button 
                 onClick={onAnalyze} 
                 className="bg-clay-terracotta text-white px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold clay-btn cursor-pointer whitespace-nowrap"
               >
                 Upload your report
               </button>
            </div>
            <button 
              onClick={() => setShowFloatingCTA(false)} 
              className="p-1.5 hover:bg-black/5 rounded-full text-clay-muted hover:text-clay-slate transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
