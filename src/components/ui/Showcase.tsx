import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';
import { useScrollTo } from '../../hooks/useScrollTo';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const HOTSPOTS = [
  { id: 'cap', x: '46%', y: '8%', label: 'Sealed cap', body: 'Tamper-evident vacuum seal preserves mineral integrity.' },
  { id: 'mid', x: '78%', y: '42%', label: 'Glass body', body: 'Borosilicate glass. No BPA, no leaching.' },
  { id: 'wat', x: '18%', y: '68%', label: 'Water level', body: 'Each bottle filled by hand and individually inspected.' },
] as const;

export const Showcase = () => {
  const [active, setActive] = useState<string | null>(null);
  const scrollTo = useScrollTo();

  return (
    <section id="ritual" className="bg-[#060F24] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-[8vw] overflow-hidden">

      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-8 sm:mb-12 md:mb-16"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-[#1257F5] mb-3"
        >
          <div className="w-4 h-px bg-[#1257F5]" />The bottle
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2"
        >
          Every detail,
          <br />
          <em className="italic text-[#C8DCFF]">intentional.</em>
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-4 sm:mt-5">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollTo('shop')}
            className="btn bi text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5"
          >
            Choose yours →
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottle stage */}
      <div className="flex justify-center items-center relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px]">

        {/* Glow disk - responsive */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none blur-xl sm:blur-2xl"
          style={{
            width: 'clamp(200px, 70vw, 480px)',
            height: 'clamp(200px, 70vw, 480px)',
            background: 'radial-gradient(circle, rgba(18,87,245,.12) 0%, transparent 65%)',
          }}
        />

        {/* Orbit rings - cachés sur mobile pour plus de clarté */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="hidden sm:block absolute rounded-full border border-[rgba(18,87,245,.08)]"
          style={{ width: 'clamp(220px, 55vw, 380px)', height: 'clamp(220px, 55vw, 380px)' }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="hidden sm:block absolute rounded-full border border-[rgba(18,87,245,.04)]"
          style={{ width: 'clamp(280px, 70vw, 500px)', height: 'clamp(280px, 70vw, 500px)' }}
        />

        {/* Bottle + hotspots */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BottleCanvas 
              size={window.innerWidth < 640 ? 1.3 : window.innerWidth < 1024 ? 1.5 : 1.6} 
              mouseX={0} 
              mouseY={0} 
            />
          </motion.div>

          {/* Hotspots - positions ajustées pour mobile */}
          {HOTSPOTS.map((h, index) => {
            // Ajuster les positions pour mobile
            const getPosition = () => {
              if (window.innerWidth < 640) {
                if (h.id === 'cap') return { x: '44%', y: '12%' };
                if (h.id === 'mid') return { x: '76%', y: '44%' };
                if (h.id === 'wat') return { x: '20%', y: '66%' };
              }
              return { x: h.x, y: h.y };
            };
            
            const pos = getPosition();
            
            return (
              <motion.div
                key={h.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.1 }}
                onClick={() => setActive(active === h.id ? null : h.id)}
                className="absolute flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full border-2 backdrop-blur-sm cursor-pointer transition-all duration-300 z-20"
                style={{
                  left: pos.x,
                  top: pos.y,
                  background: active === h.id ? '#1257F5' : 'rgba(18,87,245,.6)',
                  borderColor: active === h.id ? '#fff' : 'rgba(18,87,245,.8)',
                }}
              >
                <span className="text-white text-xs sm:text-sm leading-none select-none">+</span>

                <AnimatePresence>
                  {active === h.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-30 bg-white/95 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl pointer-events-none"
                      style={{
                        ...(parseFloat(pos.x) > 50
                          ? { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
                          : { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
                        ),
                        minWidth: window.innerWidth < 640 ? 140 : 180,
                        maxWidth: window.innerWidth < 640 ? 160 : 220,
                      }}
                    >
                      <div className="text-[10px] sm:text-[11px] font-semibold text-[#1257F5] tracking-widest uppercase mb-1">
                        {h.label}
                      </div>
                      <div className="text-[10px] sm:text-xs leading-relaxed text-[#6276A0] font-light">
                        {h.body}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile hint - plus visible */}
      <p className="text-center text-[10px] sm:text-[11px] text-white/30 tracking-widest mt-6">
        TAP THE + TO EXPLORE
      </p>
    </section>
  );
};