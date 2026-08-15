import { motion } from "motion/react";
import { MessageCircleQuestion, HelpCircle } from "lucide-react";
import { fadeUp, stagger } from "./anim";

export function QuestionsSection({ questions }: { questions: string[] }) {
  return (
    <section aria-labelledby="questions-heading" className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-[16px] bg-clay-sage text-white clay-btn">
          <MessageCircleQuestion className="size-5" aria-hidden />
        </span>
        <div>
          <h2 id="questions-heading" className="font-display text-[18px] font-bold text-clay-slate">
            Questions to ask your doctor
          </h2>
          <p className="text-[14px] text-clay-muted">
            Bring these along to your next visit so you feel prepared and calm.
          </p>
        </div>
      </div>

      <motion.ul
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-3 sm:grid-cols-2"
      >
        {questions.map((q, i) => (
          <motion.li
            key={i}
            variants={fadeUp}
            className="flex items-start gap-3 rounded-[18px] clay bg-white p-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-[12px] bg-clay-sage/15 text-clay-sage">
              <HelpCircle className="size-4" aria-hidden />
            </span>
            <p className="text-[15px] leading-relaxed text-clay-slate">{q}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
