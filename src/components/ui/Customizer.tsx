import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';
import { useScrollTo } from '../../hooks/useScrollTo';

const EDITIONS = [
  { id: 'classic', label: 'Classic Alpine', color: '#1257F5', bg: '#F3F7FF' },
  { id: 'glacier', label: 'Glacier', color: '#0BA3CC', bg: '#EDF9FF' },
  { id: 'midnight', label: 'Midnight', color: '#1A1E6E', bg: '#EEEEFF' },
  { id: 'forest', label: 'Forest Spring', color: '#0D7D4E', bg: '#EDF7F2' },
  { id: 'blush', label: 'Blush', color: '#B5406E', bg: '#FFF0F5' },
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const DROPLETS = [
  { left: '38%', top: '38%', w: 4, h: 7 },
  { left: '46%', top: '31%', w: 3, h: 5 },
  { left: '41%', top: '53%', w: 5, h: 8 },
  { left: '47%', top: '47%', w: 3, h: 6 },
  { left: '37%', top: '64%', w: 4, h: 7 },
  { left: '47%', top: '62%', w: 3, h: 5 },
] as const;

export const Customizer = () => {
  const [sel, setSel] = useState<typeof EDITIONS[number]['id']>('classic');
  const [cond, setCond] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const scrollTo = useScrollTo();

  const ed = EDITIONS.find(e => e.id === sel) ?? EDITIONS[0];

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (window.innerWidth > 1024) {
      const r = e.currentTarget.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      });
    }
  };

  return (
    <motion.section
      id="shop"
      animate={{ backgroundColor: ed.bg }}
      transition={{ duration: 0.7, ease: EASE }}
      className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-[8vw]"
    >
      {/* Layout mobile : bouteille en haut, contrôles en bas */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-[6vw] items-center">

        {/* BOUTEILLE - en premier sur mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onMouseMove={onMove}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
          className="w-full flex justify-center items-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] relative order-1 md:order-2"
        >
          {/* Glow - adapté à la couleur */}
          <motion.div
            animate={{ background: `radial-gradient(circle, ${ed.color}18 0%, transparent 70%)` }}
            transition={{ duration: 0.7 }}
            className="absolute w-[70%] pb-[70%] rounded-full blur-xl sm:blur-2xl pointer-events-none"
          />

          {/* Bouteille avec taille adaptative */}
          <div className="relative z-10 scale-[0.8] sm:scale-[0.9] md:scale-100">
            <BottleCanvas 
              size={window.innerWidth < 640 ? 1.2 : window.innerWidth < 1024 ? 1.3 : 1.4} 
              color={ed.color} 
              mouseX={mouse.x} 
              mouseY={mouse.y} 
            />

            {/* Gouttes de condensation */}
            <AnimatePresence>
              {cond && DROPLETS.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="absolute rounded-[50%_50%_60%_60%] bg-white/70 pointer-events-none"
                  style={{
                    left: d.left,
                    top: d.top,
                    width: d.w,
                    height: d.h,
                    boxShadow: `0 0 4px ${ed.color}60`,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Prix - repositionné pour mobile (en bas à droite mais visible) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute bottom-[5%] sm:bottom-[10%] right-[2%] sm:right-[5%] bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl p-2 sm:p-3 border border-[rgba(6,15,36,.07)] shadow-lg z-20"
          >
            <div className="text-[8px] sm:text-[9px] font-semibold tracking-widest uppercase text-[#6276A0] mb-0.5 whitespace-nowrap">
              {ed.label}
            </div>
            <motion.div
              animate={{ color: ed.color }}
              transition={{ duration: 0.5 }}
              className="font-['Playfair_Display'] text-base sm:text-lg md:text-xl lg:text-2xl font-bold"
            >
              €38<span className="text-xs text-[#6276A0] font-normal">.00</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CONTRÔLES - en second sur mobile */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full text-center md:text-left order-2 md:order-1"
        >
          {/* Label section */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center md:justify-start gap-2 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: ed.color }}
          >
            <motion.div
              className="w-4 h-px"
              animate={{ backgroundColor: ed.color }}
              transition={{ duration: 0.5 }}
            />
            Choose your edition
          </motion.div>

          {/* Titre */}
          <motion.h2
            variants={fadeUp}
            className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 sm:mb-5"
          >
            Your Aura,
            <br />
            <motion.em
              animate={{ color: ed.color }}
              transition={{ duration: 0.5 }}
              className="italic"
            >
              your colour.
            </motion.em>
          </motion.h2>

          {/* Swatches - centrés sur mobile */}
          <motion.div
            variants={fadeUp}
            className="flex gap-2 sm:gap-3 mb-5 sm:mb-6 flex-wrap justify-center md:justify-start"
          >
            {EDITIONS.map(e => (
              <motion.button
                key={e.id}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: sel === e.id ? 1.12 : 1,
                  borderColor: sel === e.id ? e.color : 'transparent',
                  boxShadow: sel === e.id ? `0 4px 15px ${e.color}40` : 'none',
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all duration-300"
                style={{ background: `radial-gradient(circle at 35% 32%, ${e.color}ee, ${e.color}77)` }}
                onClick={() => setSel(e.id)}
                title={e.label}
                aria-label={e.label}
                aria-pressed={sel === e.id}
              />
            ))}
          </motion.div>

          {/* Nom de l'édition */}
          <motion.div variants={fadeUp} className="mb-4 sm:mb-5">
            <motion.div
              animate={{ color: ed.color }}
              transition={{ duration: 0.5 }}
              className="font-['Playfair_Display'] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold italic"
            >
              {ed.label}
            </motion.div>
            <div className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#6276A0] mt-1">
              750ml · Glass
            </div>
          </motion.div>

          {/* Toggle condensation - compact sur mobile */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 p-2.5 sm:p-3.5 bg-white/70 backdrop-blur-lg rounded-lg sm:rounded-xl border border-[rgba(6,15,36,.07)] mb-4 sm:mb-5"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCond(c => !c)}
              aria-checked={cond}
              role="switch"
              aria-label="Toggle cold condensation"
              className="w-10 h-5 rounded-xl border-none relative shrink-0"
              animate={{ background: cond ? ed.color : 'rgba(6,15,36,.15)' }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                animate={{ left: cond ? 20 : 2 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
              />
            </motion.button>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-medium">Cold condensation</div>
              <div className="text-[8px] sm:text-[9px] tracking-widest uppercase text-[#6276A0] mt-0.5">Live preview</div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollTo('cta')}
              className="btn bp text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3"
            >
              Add to ritual →
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};