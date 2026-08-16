import { motion } from "motion/react";
import { UserRound, CalendarDays, VenusAndMars } from "lucide-react";
import type { Patient } from "../../lib/types";
import { resolveFieldIcon } from "../../lib/icons";
import { fadeUp, stagger } from "./anim";

export function PatientCard({ patient }: { patient: Patient }) {
  return (
    <motion.section
      aria-labelledby="patient-heading"
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="rounded-[26px] clay bg-white p-6 sm:p-7"
    >
      <h2 id="patient-heading" className="sr-only">
        Patient details
      </h2>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className="grid size-16 shrink-0 place-items-center rounded-[22px] bg-clay-terracotta font-display text-[22px] font-bold text-white clay-btn"
          aria-hidden
        >
          {patient.initials}
        </span>
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-[12px] font-semibold text-clay-terracotta">
            <UserRound className="size-3.5" aria-hidden /> Patient
          </div>
          <p className="mt-1 font-display text-[24px] font-bold text-clay-slate">
            {patient.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-clay-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden /> {patient.age} yrs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <VenusAndMars className="size-4" aria-hidden /> {patient.gender}
            </span>
          </div>
        </div>
      </div>

      <motion.dl
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {patient.fields.map((f) => {
          const Icon = resolveFieldIcon(f.label);
          return (
            <motion.div
              key={f.label}
              variants={fadeUp}
              className="rounded-[16px] clay-cream p-3.5"
            >
              <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-clay-muted">
                <Icon className="size-3.5 text-clay-terracotta" aria-hidden />{" "}
                {f.label}
              </dt>
              <dd className="mt-1 font-display font-bold text-clay-slate">
                {f.value}
              </dd>
            </motion.div>
          );
        })}
      </motion.dl>
    </motion.section>
  );
}
