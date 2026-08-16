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
            Take these words to your next appointment
          </h2>
          <p className="text-[14px] text-clay-muted">
            Questions your report translates into, ready for your doctor's ear.
          </p>
        </div>
      </div>

      <motion.ul
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {questions.map((q, i) => (
          <motion.li
            key={i}
            variants={fadeUp}
            whileHover={{ x: 3 }}
            className="flex items-center gap-3.5 rounded-[18px] clay bg-white p-4 transition-transform"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-[12px] bg-clay-sage/15 text-clay-sage font-display text-[13px] font-bold">
              {i + 1}
            </span>
            <p className="text-[15px] font-medium leading-relaxed text-clay-slate">{q}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
