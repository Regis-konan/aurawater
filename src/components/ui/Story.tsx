import { motion } from 'framer-motion';
import { useScrollTo } from '../../hooks/useScrollTo';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };

const TIMELINE = [
  { num: '2019', title: 'Discovery',      body: 'Our founders identify a glacial spring with mineral ratios matching human intracellular fluid.' },
  { num: '2022', title: 'Certification',  body: '3 years of independent testing across 284 parameters. Zero compromises found.' },
  { num: '2025', title: 'The Collection', body: 'Limited seasonal drops, each batch numbered, sourced exclusively during optimal mineral peak.' },
] as const;

export const Story = () => {
  const scrollTo = useScrollTo();

  return (
    <section id="story" className="bg-[#060F24] py-16 sm:py-24 md:py-[120px] px-5 sm:px-8 md:px-[8vw] relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: 100 }} animate={{ opacity: 0.07, x: 0 }} transition={{ duration: 1.5 }}
        className="absolute -right-[2vw] top-1/2 -translate-y-1/2 font-['Playfair_Display'] text-[clamp(120px,22vw,320px)] font-bold italic text-transparent select-none pointer-events-none leading-none"
        style={{ WebkitTextStroke: '1px rgba(18,87,245,.15)' }}
      >A</motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[8vw] items-center relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-[10px] font-semibold tracking-widest uppercase text-[#1257F5] mb-5 sm:mb-6">
            <div className="w-5 h-px bg-[#1257F5]" />Our story
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-[clamp(28px,4.5vw,62px)] font-normal italic text-white leading-[1.18] mb-6 sm:mb-8">
            "Most water just<br /><span className="text-[#C8DCFF]">passes through.</span><br />Aura was made to stay."
          </motion.h2>
          <motion.div variants={fadeUp} className="w-12 h-[1.5px] bg-[#1257F5] mb-6 sm:mb-8" />
          <motion.p variants={fadeUp} className="text-sm leading-relaxed font-light text-white/45 max-w-[400px]">
            Founded by alpine researchers who believed water could do more than hydrate — that each mineral interaction could support a specific cellular function, and that nature, given time, already knew this.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 sm:mt-10">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('science')}
              className="btn bi"
            >
              Read our research →
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {TIMELINE.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp}
              className={`flex gap-5 sm:gap-6 py-6 sm:py-7 ${i < TIMELINE.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
              <div className="font-['Playfair_Display'] text-xs font-normal italic text-[#1257F5] min-w-[36px] pt-1 shrink-0">{s.num}</div>
              <div>
                <div className="text-sm font-medium text-white mb-1.5">{s.title}</div>
                <div className="text-xs leading-relaxed font-light text-white/40">{s.body}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};