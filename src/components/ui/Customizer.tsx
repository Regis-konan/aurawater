import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';
import { useScrollTo } from '../../hooks/useScrollTo';

const EDITIONS = [
  { id: 'classic',  label: 'Classic Alpine', color: '#1257F5', bg: '#F3F7FF' },
  { id: 'glacier',  label: 'Glacier',        color: '#0BA3CC', bg: '#EDF9FF' },
  { id: 'midnight', label: 'Midnight',        color: '#1A1E6E', bg: '#EEEEFF' },
  { id: 'forest',   label: 'Forest Spring',  color: '#0D7D4E', bg: '#EDF7F2' },
  { id: 'blush',    label: 'Blush',          color: '#B5406E', bg: '#FFF0F5' },
] as const;

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } };

const DROPLETS = [
  { left: '38%', top: '38%', w: 4, h: 7 }, { left: '46%', top: '31%', w: 3, h: 5 },
  { left: '41%', top: '53%', w: 5, h: 8 }, { left: '47%', top: '47%', w: 3, h: 6 },
  { left: '37%', top: '64%', w: 4, h: 7 }, { left: '47%', top: '62%', w: 3, h: 5 },
] as const;

export const Customizer = () => {
  const [sel,   setSel]   = useState<typeof EDITIONS[number]['id']>('classic');
  const [cond,  setCond]  = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const scrollTo = useScrollTo();

  const ed = EDITIONS.find(e => e.id === sel) ?? EDITIONS[0];

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  return (
    <motion.section id="shop"
      animate={{ backgroundColor: ed.bg }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 sm:py-24 md:py-[120px] px-5 sm:px-8 md:px-[8vw]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[6vw] items-center">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-[10px] font-semibold tracking-widest uppercase mb-4" style={{ color: ed.color }}>
            <motion.div className="w-5 h-px" animate={{ backgroundColor: ed.color }} transition={{ duration: 0.5 }} />
            Choose your edition
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-[clamp(32px,4vw,58px)] font-bold leading-[1.05] mb-8 sm:mb-10">
            Your Aura,<br /><motion.em animate={{ color: ed.color }} transition={{ duration: 0.5 }} className="italic">your colour.</motion.em>
          </motion.h2>

          {/* Swatches */}
          <motion.div variants={fadeUp} className="flex gap-3 sm:gap-3.5 mb-8 sm:mb-10 flex-wrap">
            {EDITIONS.map(e => (
              <motion.button key={e.id}
                whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
                animate={{ scale: sel === e.id ? 1.12 : 1, borderColor: sel === e.id ? e.color : 'transparent', boxShadow: sel === e.id ? `0 4px 20px ${e.color}40` : 'none' }}
                className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-full border-2 transition-all duration-300"
                style={{ background: `radial-gradient(circle at 35% 32%, ${e.color}ee, ${e.color}77)` }}
                onClick={() => setSel(e.id)} title={e.label} aria-label={e.label} aria-pressed={sel === e.id} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
            <motion.div animate={{ color: ed.color }} transition={{ duration: 0.5 }}
              className="font-['Playfair_Display'] text-[clamp(28px,3.5vw,44px)] font-bold italic">{ed.label}</motion.div>
            <div className="text-[11px] font-medium tracking-widest uppercase text-[#6276A0] mt-1.5">Limited Edition · 750ml · Glass</div>
          </motion.div>

          {/* Condensation toggle */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-4 sm:gap-[18px] p-3.5 sm:p-4 bg-white/60 backdrop-blur-lg rounded-xl border border-[rgba(6,15,36,.07)] mb-8 sm:mb-10">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCond(c => !c)}
              aria-checked={cond} role="switch" aria-label="Toggle cold condensation"
              className="w-11 h-6 rounded-xl border-none relative shrink-0 cursor-pointer"
              animate={{ background: cond ? ed.color : 'rgba(6,15,36,.15)' }} transition={{ duration: 0.35 }}>
              <motion.div animate={{ left: cond ? 23 : 3 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-md" />
            </motion.button>
            <div>
              <div className="text-sm font-medium">Cold condensation</div>
              <div className="text-[10px] tracking-widest uppercase text-[#6276A0] mt-0.5">Live preview</div>
            </div>
          </motion.div>

          {/* CTA → scroll to CTA section */}
          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('cta')}
              className="btn bp"
            >
              Add to ritual →
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Bottle */}
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onMouseMove={onMove} onMouseLeave={() => setMouse({ x: 0, y: 0 })}
          className="flex justify-center items-center min-h-[320px] sm:min-h-[400px] md:min-h-[480px] relative">
          <motion.div animate={{ background: `radial-gradient(circle, ${ed.color}18 0%, transparent 70%)` }}
            transition={{ duration: 0.7 }} className="absolute w-[55%] pb-[55%] rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <BottleCanvas size={1.4} color={ed.color} mouseX={mouse.x} mouseY={mouse.y} />
            <AnimatePresence>
              {cond && DROPLETS.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="absolute rounded-[50%_50%_60%_60%] bg-white/65 pointer-events-none"
                  style={{ left: d.left, top: d.top, width: d.w, height: d.h, boxShadow: `0 0 4px ${ed.color}50` }} />
              ))}
            </AnimatePresence>
          </div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
            className="absolute bottom-[10%] sm:bottom-[16%] right-[4%] sm:right-[6%] bg-white/85 backdrop-blur-xl rounded-xl p-2.5 sm:p-3.5 border border-[rgba(6,15,36,.07)] shadow-lg">
            <div className="text-[9px] font-semibold tracking-widest uppercase text-[#6276A0] mb-1">{ed.label} Edition</div>
            <motion.div animate={{ color: ed.color }} transition={{ duration: 0.5 }}
              className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold">
              €38<span className="text-sm text-[#6276A0] font-normal">.00</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};