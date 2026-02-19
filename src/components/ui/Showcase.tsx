import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';
import { useScrollTo } from '../../hooks/useScrollTo';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const HOTSPOTS = [
  { id: 'cap', x: '46%', y: '8%',  label: 'Sealed cap',  body: 'Tamper-evident vacuum seal preserves mineral integrity from source to sip.' },
  { id: 'mid', x: '78%', y: '42%', label: 'Glass body',  body: 'Borosilicate glass. No BPA, no leaching. Pure interaction between water and container.' },
  { id: 'wat', x: '18%', y: '68%', label: 'Water level', body: 'Each bottle filled by hand and individually inspected before sealing.' },
] as const;

export const Showcase = () => {
  const [active, setActive] = useState<string | null>(null);
  const scrollTo = useScrollTo();

  return (
    <section id="ritual" className="bg-[#060F24] py-16 sm:py-24 md:py-[120px] px-5 sm:px-8 md:px-[8vw] overflow-hidden">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-12 sm:mb-16 md:mb-[72px]">
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-widest uppercase text-[#1257F5] mb-4">
          <div className="w-5 h-px bg-[#1257F5]" />The bottle
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-[clamp(32px,5vw,68px)] font-bold text-white leading-[1.05]">
          Every detail,<br /><em className="italic text-[#C8DCFF]">intentional.</em>
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('shop')}
            className="btn bi"
          >
            Choose yours →
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="flex justify-center items-center relative min-h-[340px] sm:min-h-[440px] md:min-h-[520px]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none blur-[40px]"
          style={{ width: 'clamp(240px,60vw,480px)', height: 'clamp(240px,60vw,480px)', background: 'radial-gradient(circle,rgba(18,87,245,.12) 0%,transparent 65%)' }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border border-[rgba(18,87,245,.08)]"
          style={{ width: 'clamp(200px,50vw,380px)', height: 'clamp(200px,50vw,380px)' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border border-[rgba(18,87,245,.04)]"
          style={{ width: 'clamp(260px,65vw,500px)', height: 'clamp(260px,65vw,500px)' }} />

        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="relative z-10"
          style={{ transform: 'scale(clamp(0.55, 0.55 + 0.45 * (100vw - 320px) / 700px, 1))' }}>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
            <BottleCanvas size={1.6} mouseX={0} mouseY={0} />
          </motion.div>

          {HOTSPOTS.map(h => (
            <motion.div key={h.id}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActive(active === h.id ? null : h.id)}
              className="absolute flex items-center justify-center w-7 h-7 rounded-full border-2 backdrop-blur-sm cursor-pointer transition-all duration-300"
              style={{ left: h.x, top: h.y, background: active === h.id ? '#1257F5' : 'rgba(18,87,245,.5)', borderColor: active === h.id ? '#fff' : 'rgba(18,87,245,.7)' }}>
              <span className="text-white text-sm leading-none select-none">+</span>
              <AnimatePresence>
                {active === h.id && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute z-20 bg-white/95 rounded-xl p-3.5 shadow-2xl pointer-events-none"
                    style={{
                      ...(h.x > '50%' ? { right: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' } : { left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' }),
                      minWidth: 180, maxWidth: 220,
                    }}>
                    <div className="text-[11px] font-semibold text-[#1257F5] tracking-widest uppercase mb-1.5">{h.label}</div>
                    <div className="text-xs leading-relaxed text-[#6276A0] font-light">{h.body}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <p className="text-center text-[11px] text-white/25 tracking-widest mt-6 sm:hidden">TAP + TO EXPLORE</p>
    </section>
  );
};