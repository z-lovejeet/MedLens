import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ScanText,
  FlaskConical,
  Sparkles,
  Leaf,
  Salad,
  Moon,
  Footprints,
  Wind,
  HeartPulse,
  Droplets,
  Bone,
  Activity,
} from "lucide-react";

export type Status = "optimal" | "borderline" | "attention";

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number; // reference range low
  max: number; // reference range high
  scaleMin: number; // slider scale
  scaleMax: number;
  status: Status;
  tag: string;
  plain: string;
}

export const STATUS_META: Record<
  Status,
  { color: string; soft: string; label: string; icon: LucideIcon }
> = {
  optimal: { color: "#6bb89a", soft: "#e7f4ee", label: "Optimal", icon: CheckCircle2 },
  borderline: { color: "#eba85c", soft: "#fbf0e2", label: "Slightly off", icon: AlertTriangle },
  attention: { color: "#e48267", soft: "#fbebe6", label: "Worth asking", icon: Info },
};

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
      "Hemoglobin is the part of your blood that carries oxygen around your body. Yours is right in the healthy zone. Think of it like a delivery service running perfectly on time.",
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
      "White blood cells are your body's tiny bodyguards that fight germs. Yours are a little higher than usual, which can simply mean you're fighting off a mild cold. Keep an eye on it.",
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
      "Cholesterol is a waxy substance your body needs in small amounts. Yours is a bit above the comfy range. Small food and movement tweaks often help, and that's a good thing to chat about at your next visit.",
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
      "Glucose is the sugar your body uses for energy. Measured after fasting, yours sits comfortably in the healthy range, nice and steady.",
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
      "Platelets help your blood clot when you get a cut, like little repair helpers. Yours are within the healthy range.",
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
      "Vitamin D helps keep your bones and mood strong, and mostly comes from sunshine. Yours is a touch low. A bit more daylight or a supplement can gently nudge it up.",
  },
];

export interface XRayFinding {
  label: string;
  probability: number; // 0-100
  status: Status;
  note: string;
}

export const XRAY_FINDINGS: XRayFinding[] = [
  { label: "Clear Lungs", probability: 88, status: "optimal", note: "Lung fields look clear and well-aerated." },
  { label: "Infiltration", probability: 12, status: "optimal", note: "Very low chance of fluid or infection build-up." },
  { label: "Cardiomegaly", probability: 9, status: "optimal", note: "Heart size appears within a normal range." },
  { label: "Effusion", probability: 6, status: "optimal", note: "No meaningful sign of fluid around the lungs." },
];

export interface WellnessTip {
  title: string;
  body: string;
}

export const WELLNESS: Record<
  string,
  { icon: LucideIcon; label: string; tips: WellnessTip[] }
> = {
  nutrition: {
    icon: Salad,
    label: "Nutrition",
    tips: [
      { title: "Add a fiber friend", body: "Swap one refined snack for oats, beans, or fruit to gently support your cholesterol." },
      { title: "Colorful plates", body: "Aim for two colors of veg at each meal. Antioxidants love variety." },
      { title: "Hydrate first", body: "Start the day with a glass of water before coffee to keep energy steady." },
    ],
  },
  sleep: {
    icon: Moon,
    label: "Sleep Hygiene",
    tips: [
      { title: "Wind-down window", body: "Dim the lights 30 minutes before bed to help melatonin rise naturally." },
      { title: "Consistent wake time", body: "Waking at the same hour anchors your body clock better than the bedtime does." },
    ],
  },
  activity: {
    icon: Footprints,
    label: "Physical Activity",
    tips: [
      { title: "Movement snacks", body: "Three 10-minute walks can help nudge cholesterol and glucose in a friendly direction." },
      { title: "Sunshine steps", body: "Take one walk outdoors for a Vitamin D and mood two-for-one." },
    ],
  },
  stress: {
    icon: Wind,
    label: "Stress Reduction",
    tips: [
      { title: "Box breathing", body: "Inhale 4, hold 4, exhale 4, hold 4. Two minutes can calm a racing mind." },
      { title: "Name three things", body: "A quick gratitude note lowers the day's mental noise." },
    ],
  },
};

export const PIPELINE_STEPS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: ScanText, title: "OCR Agent", detail: "Reading document text..." },
  { icon: FlaskConical, title: "Parser Agent", detail: "Standardizing medical metrics..." },
  { icon: Sparkles, title: "Explainer Agent", detail: "Simplifying jargon into plain English..." },
  { icon: Leaf, title: "Recommender Agent", detail: "Crafting cozy lifestyle tips..." },
];

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
  { icon: Salad, title: "Nudge your cholesterol gently", body: "Swap one refined snack a day for oats, beans, or fruit. Small, steady fiber wins add up." },
  { icon: Footprints, title: "Three movement snacks", body: "Ten-minute walks after meals help both cholesterol and glucose feel more settled." },
  { icon: Leaf, title: "A little more sunshine", body: "Your Vitamin D is slightly low. A short daily walk outdoors is a cozy two-for-one." },
];

export const XRAY_SUMMARY = {
  headline: "Good news! Your lungs look clear and healthy.",
  body: "Our vision model found no strong signs of concern across the major regions we check. Remember, this is a friendly first look to help you understand the scan, not a diagnosis.",
};

export const XRAY_RECOMMENDATIONS: Recommendation[] = [
  { icon: Wind, title: "Keep your airways happy", body: "Gentle breathing exercises and staying smoke-free keep those clear lungs clear." },
  { icon: Footprints, title: "Move a little each day", body: "Light cardio supports healthy lung capacity over time." },
  { icon: FlaskConical, title: "Bring this to your visit", body: "Download your summary and share it with your doctor for a complete picture." },
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
    { icon: Bone, label: "Body part", value: "Chest" },
    { icon: ScanText, label: "Scan date", value: "13 Aug 2026" },
    { icon: HeartPulse, label: "Referred by", value: "Dr. S. Kapoor" },
    { icon: Activity, label: "Modality", value: "Digital X-Ray" },
  ],
};

/* ===== Conditions / disease screening ===== */
export interface Condition {
  name: string;
  chance: number; // 0-100 likelihood
  status: Status;
  blurb: string;
}

export const BLOOD_CONDITIONS: Condition[] = [
  {
    name: "Anemia",
    chance: 8,
    status: "optimal",
    blurb: "Your hemoglobin sits comfortably in range, so signs point away from anemia.",
  },
  {
    name: "High Cholesterol",
    chance: 62,
    status: "attention",
    blurb: "Your total cholesterol is a little above the comfy zone, so it's worth a friendly chat and some gentle diet tweaks.",
  },
  {
    name: "Pre-diabetes",
    chance: 14,
    status: "optimal",
    blurb: "Fasting glucose looks steady and healthy, so this is very unlikely right now.",
  },
  {
    name: "Vitamin D deficiency",
    chance: 45,
    status: "borderline",
    blurb: "Your Vitamin D is slightly low. A touch more sunshine or a supplement can help.",
  },
];

export const XRAY_CONDITIONS: Condition[] = [
  {
    name: "Pneumonia",
    chance: 7,
    status: "optimal",
    blurb: "No meaningful signs of infection or fluid build-up were detected in the lung fields.",
  },
  {
    name: "Pleural Effusion",
    chance: 6,
    status: "optimal",
    blurb: "The model saw no notable fluid collecting around the lungs.",
  },
  {
    name: "Cardiomegaly",
    chance: 9,
    status: "optimal",
    blurb: "Your heart's silhouette appears within a normal size range.",
  },
  {
    name: "Nodule / Mass",
    chance: 4,
    status: "optimal",
    blurb: "No suspicious spots or masses stood out in this scan.",
  },
];

/* ===== Questions to ask your doctor ===== */
export const BLOOD_QUESTIONS: string[] = [
  "My cholesterol is slightly high. Should I retest in a few months or start changes now?",
  "Would a diet or exercise plan help nudge my Vitamin D and cholesterol gently?",
  "Are my mildly elevated white blood cells anything to keep an eye on?",
  "How often should I repeat this blood panel to track my progress?",
];

export const XRAY_QUESTIONS: string[] = [
  "Does this scan fully explain the symptoms I've been feeling?",
  "Should I have any follow-up imaging, or is this a clean baseline?",
  "Are there lifestyle habits that would keep my lungs and heart healthy?",
  "How does this compare to any previous chest X-rays on file?",
];
