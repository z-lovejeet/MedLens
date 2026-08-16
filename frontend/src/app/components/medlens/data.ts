import type { LucideIcon } from "lucide-react";
import {
  Activity,
  HeartPulse,
  Droplets,
  ScanText,
  FlaskConical,
  Sparkles,
  Leaf,
  Wind,
  Footprints,
  Moon,
  Salad,
  Info,
} from "lucide-react";
import type { Status } from "../../lib/types";

export const STATUS_META: Record<
  Status,
  { color: string; soft: string; label: string; icon: LucideIcon }
> = {
  optimal: { color: "#6bb89a", soft: "#e7f4ee", label: "Optimal", icon: HeartPulse },
  borderline: { color: "#eba85c", soft: "#fbf0e2", label: "Slightly off", icon: Activity },
  attention: { color: "#e48267", soft: "#fbebe6", label: "Worth asking", icon: Info },
};

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  scaleMin: number;
  scaleMax: number;
  status: Status;
  tag: string;
  plain: string;
}

export const BLOOD_REPORT: Metric[] = [
  {
    id: "hgb",
    name: "Hemoglobin",
    value: 13.8,
    unit: "g/dL",
    min: 13.0,
    max: 17.0,
    scaleMin: 9,
    scaleMax: 20,
    status: "optimal",
    tag: "Optimal",
    plain:
      "Hemoglobin is the protein in red blood cells that carries oxygen to your muscles and brain. Yours is right in the healthy zone, ensuring smooth daily energy.",
  },
  {
    id: "wbc",
    name: "White Blood Cells",
    value: 11.4,
    unit: "10³/µL",
    min: 4.0,
    max: 11.0,
    scaleMin: 2,
    scaleMax: 15,
    status: "borderline",
    tag: "Slightly Elevated",
    plain:
      "White blood cells are your body's defensive guardians. Yours are slightly above standard range, which often reflects a recent mild cold or natural immune response.",
  },
  {
    id: "chol",
    name: "Total Cholesterol",
    value: 226,
    unit: "mg/dL",
    min: 125,
    max: 200,
    scaleMin: 100,
    scaleMax: 300,
    status: "attention",
    tag: "Worth Asking Doctor",
    plain:
      "Cholesterol is a lipid molecule essential for cell walls. Yours is mildly elevated. Simple whole-food fiber additions and walking routines help nudge it into the ideal range.",
  },
  {
    id: "glu",
    name: "Fasting Glucose",
    value: 92,
    unit: "mg/dL",
    min: 70,
    max: 99,
    scaleMin: 50,
    scaleMax: 160,
    status: "optimal",
    tag: "Optimal",
    plain:
      "Glucose is the primary sugar your cells use for clean energy. Measured after fasting, yours sits comfortably in the ideal range.",
  },
  {
    id: "plt",
    name: "Platelets",
    value: 168,
    unit: "10³/µL",
    min: 150,
    max: 400,
    scaleMin: 80,
    scaleMax: 450,
    status: "optimal",
    tag: "Optimal",
    plain:
      "Platelets help your blood form natural clots to heal minor cuts. Yours are in a healthy, balanced range.",
  },
  {
    id: "vitd",
    name: "Vitamin D",
    value: 24,
    unit: "ng/mL",
    min: 30,
    max: 100,
    scaleMin: 10,
    scaleMax: 100,
    status: "borderline",
    tag: "Slightly Low",
    plain:
      "Vitamin D supports bone strength, immune defense, and calm mood. Yours is a touch low. A little daily morning daylight or a gentle supplement helps restore optimal levels.",
  },
];

export interface XRayFinding {
  label: string;
  probability: number;
  status: Status;
  note: string;
}

export const XRAY_FINDINGS: XRayFinding[] = [
  { label: "Clear Lungs", probability: 88, status: "optimal", note: "Lung fields look clear and well-aerated with healthy expansion." },
  { label: "Infiltration", probability: 12, status: "optimal", note: "Very low chance of fluid or infection build-up in lung tissue." },
  { label: "Cardiomegaly", probability: 9, status: "optimal", note: "Heart silhouette diameter sits within normal thoracic proportions." },
  { label: "Effusion", probability: 6, status: "optimal", note: "Costophrenic angles are sharp with no sign of pleural fluid pooling." },
];

export interface WellnessTip {
  title: string;
  body: string;
}

export const WELLNESS: Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    tips: WellnessTip[];
    recommendedDiet?: string;
    foodsToEat?: { name: string; why: string }[];
    foodsToAvoid?: { name: string; why: string }[];
    modules?: {
      badge: string;
      title: string;
      subtitle: string;
      items: { title: string; detail: string }[];
    }[];
  }
> = {
  nutrition: {
    icon: Salad,
    label: "Nutrition Hub",
    recommendedDiet:
      "Heart-protective, Mediterranean-inspired dietary pattern rich in soluble plant fibers, healthy omega-3 fatty acids, and clean hydration to naturally ease lipid levels and cellular fatigue.",
    foodsToEat: [
      { name: "Steel-Cut Oats & Barley", why: "High in beta-glucan soluble fiber that binds to circulating LDL cholesterol and helps clear it." },
      { name: "Flaxseeds & Chia Seeds", why: "Rich in plant ALA omega-3s and gentle mucilage fiber that soothes the digestive lining." },
      { name: "Fatty Fish (Salmon, Sardines, Trout)", why: "Potent anti-inflammatory EPA/DHA fatty acids that support vascular and arterial flexibility." },
      { name: "Dark Leafy Greens (Spinach, Kale, Chard)", why: "Rich in magnesium, folate, and dietary nitrates that support healthy blood pressure." },
      { name: "Berries & Citrus Fruits", why: "Packed with polyphenols and Vitamin C that protect blood vessel walls from oxidative stress." },
      { name: "Lentils, Chickpeas & Edamame", why: "Clean plant protein with zero cholesterol and sustained slow-burning complex carbs." },
    ],
    foodsToAvoid: [
      { name: "Deep-Fried & Fast Foods", why: "Contain oxidized trans-fats and reheated seed oils that accelerate arterial plaque buildup." },
      { name: "Sugar-Sweetened Beverages & Soda", why: "Spikes triglycerides, promotes hepatic fat storage, and causes rapid energy crashes." },
      { name: "Commercial Bakery Pastries", why: "Dense combination of hydrogenated fats, refined flour, and inflammatory sugars." },
      { name: "Ultra-Processed Cured Meats", why: "High sodium and synthetic preservative nitrates that burden blood pressure and kidneys." },
    ],
    tips: [
      { title: "Add a soluble fiber friend", body: "Swap one refined snack for oats, beans, or fresh berries to gently lower circulating LDL lipids." },
      { title: "Hydrate before morning caffeine", body: "Start your morning with a tall glass of water before tea or coffee to support optimal kidney filtration." },
      { title: "Half-plate colorful rule", body: "Fill half your plate with colorful veggies at lunch and dinner for steady antioxidant protection." },
    ],
  },
  sleep: {
    icon: Moon,
    label: "Sleep Hygiene",
    modules: [
      {
        badge: "Module 1",
        title: "Circadian Rhythm & Hormonal Reset",
        subtitle: "Anchoring your master biological clock to maximize slow-wave deep sleep.",
        items: [
          {
            title: "Anchored Wake-Up Schedule",
            detail: "Wake up within the same 30-minute window every morning (even on weekends) to synchronize cortisol and nighttime melatonin release.",
          },
          {
            title: "Evening Blue-Light Protocol",
            detail: "Dim overhead lighting and switch devices to warm night-shift mode 45 minutes before sleep to prevent melatonin suppression.",
          },
          {
            title: "Thermal Drop for Deep Sleep",
            detail: "Keep your bedroom between 18-19°C (65-67°F). A slight drop in core body temperature is the physiological trigger for restorative delta sleep.",
          },
        ],
      },
      {
        badge: "Module 2",
        title: "Restorative Night Routine Blueprint",
        subtitle: "Step-by-step checklist to eliminate bedtime anxiety and racing thoughts.",
        items: [
          {
            title: "8-Hour Caffeine Buffer",
            detail: "Stop caffeine intake by 2:00 PM to allow complete adenosine clearance and prevent shallow, fragmented sleep stages.",
          },
          {
            title: "Warm Magnesium & Chamomile Ritual",
            detail: "A warm cup of herbal chamomile or magnesium glycinate 30 minutes before bed relaxes vascular smooth muscle and eases physical tension.",
          },
          {
            title: "Screen-Free Bedroom Sanctuary",
            detail: "Charge your phone outside the sleeping area to eliminate midnight blue-light checks and dopamine micro-arousals.",
          },
        ],
      },
    ],
    tips: [
      { title: "30-Min Wind-down window", body: "Dim warm lights and keep screens away 30 minutes before bed to allow natural melatonin production." },
      { title: "Anchored wake time", body: "Waking up at the same hour every morning stabilizes your circadian clock and deep sleep depth." },
      { title: "Cool bedroom temperature", body: "Keeping your bedroom around 18-20°C (65-68°F) promotes uninterrupted REM cycles." },
    ],
  },
  activity: {
    icon: Footprints,
    label: "Physical Activity",
    modules: [
      {
        badge: "Module 1",
        title: "Post-Meal Metabolic Movement Protocol",
        subtitle: "Using light muscular contraction to clear glucose and regulate blood lipids.",
        items: [
          {
            title: "10-Minute Post-Meal Walks",
            detail: "A relaxed 10-minute stroll within 20 minutes of finishing meals prompts skeletal muscles to absorb glucose directly, avoiding insulin spikes.",
          },
          {
            title: "Zone 2 Aerobic Base (3x Weekly)",
            detail: "20-30 minutes of conversational-pace walking, swimming, or easy cycling builds mitochondrial density and cardiovascular tone.",
          },
          {
            title: "Functional Strength & Mobility",
            detail: "2 weekly sessions of bodyweight squats, wall push-ups, or gentle resistance bands support joint stability and bone mineral density.",
          },
        ],
      },
      {
        badge: "Module 2",
        title: "Natural Sunshine & Energy Sync",
        subtitle: "Coordinating daylight exposure with movement for metabolic and immune vitality.",
        items: [
          {
            title: "Morning Sunlight Exposure",
            detail: "Get 15-20 minutes of morning sunlight on your face and arms without sunglasses to kickstart natural Vitamin D synthesis.",
          },
          {
            title: "Desk Break Movement Snacks",
            detail: "Stand up for 90 seconds every hour to stretch hip flexors and stimulate lymphatic drainage in the lower legs.",
          },
          {
            title: "Restorative Joint Mobility",
            detail: "Spend 5 minutes in the evening on ankle, hip, and shoulder rotations to reduce daily musculoskeletal stiffness.",
          },
        ],
      },
    ],
    tips: [
      { title: "Post-meal movement snacks", body: "A light 10-minute walk after meals helps muscle cells absorb glucose without insulin spikes." },
      { title: "Sunshine morning steps", body: "A short 15-minute outdoor morning walk delivers natural Vitamin D synthesis and elevates mood." },
      { title: "Gentle joint mobility", body: "Light stretching or restorative yoga reduces musculoskeletal tightness and supports circulation." },
    ],
  },
  stress: {
    icon: Wind,
    label: "Stress & Recovery",
    modules: [
      {
        badge: "Module 1",
        title: "Vagus Nerve & Parasympathetic Reset",
        subtitle: "Instant physiological tools to downshift from fight-or-flight overdrive.",
        items: [
          {
            title: "4-4-4-4 Box Breathing Protocol",
            detail: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Practicing for 2 minutes immediately lowers elevated heart rate and cortisol levels.",
          },
          {
            title: "Double-Inhale Physiological Sigh",
            detail: "Take two rapid inhales through your nose followed by a long, slow sigh out the mouth to pop open collapsed alveoli and reset calm.",
          },
          {
            title: "Cold Water Vagal Splash",
            detail: "Splashing cool water on your face stimulates the mammalian dive reflex, rapidly soothing cardiac excitement.",
          },
        ],
      },
      {
        badge: "Module 2",
        title: "Cognitive Decompression & Recovery",
        subtitle: "Shielding your nervous system from chronic digital and workplace fatigue.",
        items: [
          {
            title: "90-Minute Ultradian Pauses",
            detail: "Step away from work screens for 3 minutes every 90 minutes to allow the visual cortex and prefrontal attention to recharge.",
          },
          {
            title: "Evening Worry Offloading",
            detail: "Write down tomorrow's 3 priority tasks on physical paper before dinner to prevent rumination from intruding into your evening.",
          },
          {
            title: "Daily Gratitude Grounding",
            detail: "Take 60 seconds to acknowledge 2 positive moments from your day to stimulate natural serotonin and contentment.",
          },
        ],
      },
    ],
    tips: [
      { title: "4-4-4-4 Box breathing", body: "Inhale 4, hold 4, exhale 4, hold 4. Just two minutes shifts your nervous system into restorative parasympathetic mode." },
      { title: "Micro mental breaks", body: "Step away from screens for 3 minutes every 90 minutes to reduce cortisol and eye strain." },
      { title: "Evening gratitude note", body: "Jotting down 2 calm moments from your day lowers evening cognitive restlessness." },
    ],
  },
};

export const BLOOD_PIPELINE_STEPS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: ScanText, title: "Reading Agent", detail: "Scanning the doctor's handwriting and lab values..." },
  { icon: FlaskConical, title: "Decoder Agent", detail: "Identifying clinical terms and reference ranges..." },
  { icon: Sparkles, title: "Translator Agent", detail: "Rewriting medical jargon into your language..." },
  { icon: Leaf, title: "Wellness Agent", detail: "Writing personalized guidance your doctor would give..." },
];

export const XRAY_PIPELINE_STEPS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: ScanText, title: "Vision Agent", detail: "Reading lung fields, heart silhouette and thoracic regions..." },
  { icon: Sparkles, title: "Translator Agent", detail: "Converting radiological findings into your language..." },
  { icon: Leaf, title: "Wellness Agent", detail: "Writing respiratory guidance and next steps..." },
];

export const PIPELINE_STEPS = BLOOD_PIPELINE_STEPS;

export interface Recommendation {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const BLOOD_SUMMARY = {
  headline: "Mostly great news! Your report looks healthy and balanced.",
  body: "Most of your markers sit comfortably in the healthy range. A few gentle things are worth a friendly chat with your doctor, but there's nothing alarming here. Take a breath, you're doing well.",
};

export const BLOOD_RECOMMENDATIONS: Recommendation[] = [
  { icon: Salad, title: "Nudge your cholesterol gently", body: "Swap refined midday snacks for oats, chia seeds, or fresh berries to help clear circulating LDL lipids naturally." },
  { icon: Footprints, title: "Ease sluggishness with movement snacks", body: "Three 10-minute relaxed walks after meals reduce post-prandial fatigue and support cardiovascular tone." },
  { icon: Leaf, title: "Restore energy with sunshine steps", body: "Your Vitamin D is slightly low. A daily 15-minute morning walk outdoors gently rebuilds bone and immune vitality." },
];

export const XRAY_SUMMARY = {
  headline: "Good news! Your lungs look clear and healthy.",
  body: "Our vision model found no strong signs of concern across the major regions we check. Remember, this is a friendly first look to help you understand the scan, not a diagnosis.",
};

export const XRAY_RECOMMENDATIONS: Recommendation[] = [
  { icon: Wind, title: "Keep your airways clear and relaxed", body: "Gentle diaphragmatic breathing exercises and maintaining clean indoor air support long-term lung elasticity." },
  { icon: Footprints, title: "Low-impact aerobic conditioning", body: "20 minutes of brisk walking or light cycling maintains strong pulmonary volume without strain." },
  { icon: FlaskConical, title: "Share scan baseline with your doctor", body: "Bring this digital summary to your next appointment as a clean comparison baseline for future checkups." },
];

/* ===== Patient details ===== */
export interface PatientField {
  icon: LucideIcon;
  label: string;
  value: string;
}
export interface Patient {
  name: string;
  initials: string;
  age: number;
  gender: string;
  fields: PatientField[];
}

export const BLOOD_PATIENT: Patient = {
  name: "Ananya Sharma",
  initials: "AS",
  age: 32,
  gender: "Female",
  fields: [
    { icon: Info, label: "Patient ID", value: "MLN-2026-0142" },
    { icon: Droplets, label: "Blood group", value: "O+" },
    { icon: FlaskConical, label: "Sample", value: "Venous · Fasting" },
    { icon: ScanText, label: "Report date", value: "12 Aug 2026" },
    { icon: HeartPulse, label: "Referred by", value: "Dr. R. Menon" },
    { icon: Activity, label: "Lab", value: "MedLens Diagnostics" },
  ],
};

export const XRAY_PATIENT: Patient = {
  name: "Rohan Verma",
  initials: "RV",
  age: 41,
  gender: "Male",
  fields: [
    { icon: Info, label: "Patient ID", value: "MLN-2026-0177" },
    { icon: ScanText, label: "View", value: "PA (upright)" },
    { icon: Activity, label: "Body part", value: "Chest" },
    { icon: ScanText, label: "Scan date", value: "13 Aug 2026" },
    { icon: HeartPulse, label: "Referred by", value: "Dr. S. Kapoor" },
    { icon: Activity, label: "Modality", value: "Digital X-Ray" },
  ],
};

export const BLOOD_CONDITIONS = [
  { name: "General Wellness & Vitality", chance: 88, status: "optimal" as Status, blurb: "Your core metabolic markers indicate healthy physiological balance with no acute red flags." },
  { name: "Lipid Variance (Cholesterol)", chance: 62, status: "attention" as Status, blurb: "Total cholesterol sits above standard reference. A heart-healthy diet and active movement can gently rebalance your lipid profile." },
  { name: "Vitamin D Insufficiency", chance: 45, status: "borderline" as Status, blurb: "Vitamin D is slightly lower than ideal. Morning sun exposure or doctor-recommended supplementation will help support bone strength and mood." },
];

export const XRAY_CONDITIONS = [
  { name: "Healthy Lung Aeration", chance: 88, status: "optimal" as Status, blurb: "Both lung fields appear well-expanded and radiolucent, consistent with clear respiratory function." },
  { name: "Pneumonia / Consolidation", chance: 7, status: "optimal" as Status, blurb: "No meaningful opacity or dense infiltrates detected in the thoracic cavity." },
  { name: "Pleural Effusion", chance: 6, status: "optimal" as Status, blurb: "Sharp, clean costophrenic angles with no sign of fluid accumulation." },
  { name: "Cardiomegaly", chance: 9, status: "optimal" as Status, blurb: "Cardiac silhouette diameter is within standard cardiothoracic ratio bounds." },
];

export const BLOOD_QUESTIONS = [
  "My total cholesterol is slightly elevated. Would you recommend retesting in 3 months or initiating lifestyle changes first?",
  "Given my slightly low Vitamin D, what daily IU dosage or sunlight routine would you recommend for me?",
  "Are my mildly elevated white blood cells anything to follow up on, or just a typical response to a recent mild infection?",
  "How frequently should I repeat this comprehensive blood panel to monitor my progress?",
];

export const XRAY_QUESTIONS = [
  "Does this chest X-ray baseline correlate well with the symptoms I've been experiencing?",
  "Should we keep this imaging scan on file as a clean comparison for future checkups?",
  "Are there specific breathing exercises or lifestyle habits to maintain my lung capacity?",
  "Are any follow-up imaging scans or clinical checkups recommended at this stage?",
];
