import { motion } from 'framer-motion';
import { useScrollTo } from '../../hooks/useScrollTo';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const CARDS = [
  { icon: '◉', label: '01 — Purity',  title: 'Zero detected',  body: 'Independently tested across 284 contaminant parameters. Every batch certified before release. This is what uncompromised purity looks like.' },
  { icon: '◈', label: '02 — Energy',  title: 'Cellular boost',  body: '32 trace minerals in calibrated ratios that mirror intracellular fluid. Absorption is 4.3× faster than standard mineral water — measurable in 20 minutes.' },
  { icon: '◇', label: '03 — Clarity', title: 'pH 7.4 perfect', body: 'Not acidic, not artificially alkaline. Exactly 7.4 — matched to blood pH. The body works with it instead of having to adjust, unlocking cognitive sharpness.' },
] as const;

export const Features = () => {
  const scrollTo = useScrollTo();

  return (
    <section id="science" className="bg-[#F3F7FF] py-16 sm:py-24 md:py-[120px] px-5 sm:px-8 md:px-[8vw]">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
        className="flex justify-between items-end flex-wrap gap-6 mb-10 sm:mb-16">
        <div>
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-[10px] font-semibold tracking-widest uppercase text-[#1257F5] mb-4">
            <div className="w-5 h-px bg-[#1257F5]" />Three principles
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-[clamp(32px,4vw,58px)] font-bold leading-[1.05]">
            Built to<br /><em className="italic text-[#1257F5]">perform.</em>
          </motion.h2>
        </div>
        <motion.p variants={fadeUp} className="text-sm leading-relaxed font-light text-[#6276A0] max-w-[300px]">
          Hover each card to explore the science behind each principle.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.01 }}
            onClick={() => scrollTo('ritual')}
            className="bg-white border border-[rgba(6,15,36,.08)] rounded-2xl sm:rounded-3xl p-7 sm:p-8 md:p-10 cursor-pointer transition-shadow duration-500 hover:shadow-2xl hover:shadow-[rgba(6,15,36,.1)] hover:border-[rgba(18,87,245,.18)]"
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="text-2xl mb-5 sm:mb-7 text-[#1257F5]">{c.icon}</motion.div>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-[#6276A0] mb-3 sm:mb-4">{c.label}</div>
            <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold italic mb-3 sm:mb-4 leading-[1.1]">{c.title}</h3>
            <div className="w-8 h-[1.5px] bg-[#1257F5] mb-4 sm:mb-5 opacity-40" />
            <p className="text-xs leading-relaxed font-light text-[#6276A0]">{c.body}</p>
            <motion.div whileHover={{ x: 5 }} className="mt-6 sm:mt-7 text-xs font-medium text-[#1257F5] tracking-wider">Learn more →</motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};