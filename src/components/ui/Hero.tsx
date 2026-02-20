import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';
import { useScrollTo } from '../../hooks/useScrollTo'; // Import du hook

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const STATS = [
  { value: 'pH 7.4', label: 'Alkaline' },
  { value: '32', label: 'Minerals' },
  { value: '0 ppm', label: 'Impurities' },
  { value: '2847m', label: 'Altitude' },
];

const useBottleSize = () => {
  const getSize = () => {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    if (w < 400) return 0.9;
    if (w < 640) return 1.0;
    if (w < 768) return 1.1;
    if (w < 1024) return 1.2;
    return 1.3;
  };
  const [size, setSize] = useState(getSize);
  useEffect(() => {
    const update = () => setSize(getSize());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
};

export const Hero = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const bottleSize = useBottleSize();
  const scrollTo = useScrollTo(); // Hook pour le défilement

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (window.innerWidth > 1024) {
      setMouse({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    }
  };

  return (
    <section
      onMouseMove={onMove}
      className="min-h-screen pt-16 sm:pt-20 md:pt-24 bg-gradient-to-br from-white via-[#EEF4FF] to-[#D6E8FF] relative overflow-hidden"
    >
      {/* BG blobs */}
      <div className="absolute -top-[5%] -right-[4%] w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.1)_0%,rgba(18,87,245,.04)_50%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[5%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-[4vw] px-4 sm:px-6 md:px-8 lg:px-[8vw] pb-8 lg:pb-0 lg:min-h-[calc(100vh-100px)]">

        {/* TEXTE - en premier sur mobile */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="w-full text-center lg:text-left pt-4 sm:pt-6 lg:pt-0 order-1 lg:order-1"
        >
          {/* Badge NEW */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 bg-[#E6EEFF] rounded-full py-1 pl-1.5 pr-3 mb-4 sm:mb-5 mx-auto lg:mx-0"
          >
            <span className="bg-[#1257F5] text-white rounded-full text-[8px] sm:text-[9px] font-semibold px-2 py-0.5 tracking-widest">NEW</span>
            <span className="text-[10px] sm:text-xs text-[#1257F5] font-medium">2025 Limited</span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            variants={fadeUp}
            className="font-['Playfair_Display'] text-[clamp(32px,8vw,88px)] font-bold leading-[1.0] tracking-tight mb-3 sm:mb-4"
          >
            Water born
            <br />
            <em className="italic text-[#1257F5]">from silence.</em>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-xs sm:text-sm md:text-base leading-relaxed font-light text-[#6276A0] max-w-xl mx-auto lg:mx-0 mb-5 sm:mb-6 px-2 sm:px-0"
          >
            Drawn at 2,847m from glacial springs. 32 trace minerals. pH 7.4. Zero compromise.
          </motion.p>

          {/* Boutons - maintenant fonctionnels ! */}
          <motion.div
            variants={fadeUp}
            className="flex gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start mb-6 sm:mb-8"
          >
            <button 
              data-h 
              onClick={() => scrollTo('shop')} // Redirige vers la section shop
              className="btn bp text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer"
            >
              Discover →
            </button>
            <button 
              data-h 
              onClick={() => scrollTo('science')} // Redirige vers la section science
              className="btn bg text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer"
            >
              Science
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-[rgba(6,15,36,.08)] pt-4 sm:pt-6"
          >
            {STATS.map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-['Playfair_Display'] text-sm sm:text-base md:text-lg lg:text-xl font-semibold">{item.value}</div>
                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#6276A0] tracking-widest uppercase mt-0.5">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* BOUTEILLE - en second sur mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          className="w-full flex justify-center items-center relative mt-6 sm:mt-8 lg:mt-0 min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[500px] order-2 lg:order-2"
        >
          {/* Glow */}
          <div className="absolute w-[70%] pb-[70%] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.15)_0%,transparent_70%)] blur-xl sm:blur-2xl pointer-events-none" />

          {/* Anneaux - seulement sur tablette/desktop */}
          <div className="hidden sm:block absolute w-[200px] md:w-[250px] lg:w-[300px] xl:w-[340px] h-[200px] md:h-[250px] lg:h-[300px] xl:h-[340px] rounded-full border border-[rgba(18,87,245,.1)] animate-[spin_28s_linear_infinite]">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#1257F5] shadow-[0_0_10px_#1257F5] opacity-70" />
          </div>
          <div className="hidden sm:block absolute w-[160px] md:w-[200px] lg:w-[220px] xl:w-[260px] h-[160px] md:h-[200px] lg:h-[220px] xl:h-[260px] rounded-full border border-[rgba(18,87,245,.06)] animate-[spinR_20s_linear_infinite]" />

          {/* Bouteille */}
          <div className="relative z-10 scale-[0.9] sm:scale-100">
            <BottleCanvas size={bottleSize} mouseX={mouse.x} mouseY={mouse.y} />
          </div>

          {/* Cards flottantes */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-1 sm:right-4 top-[5%] sm:top-[10%] bg-white/90 backdrop-blur-xl border border-[rgba(6,15,36,.07)] rounded-lg sm:rounded-xl p-1.5 sm:p-3 shadow-lg z-20"
          >
            <div className="text-[7px] sm:text-[9px] font-semibold tracking-widest uppercase text-[#6276A0] mb-0.5">ABSORPTION</div>
            <div className="font-['Playfair_Display'] text-xs sm:text-lg md:text-xl font-semibold text-[#1257F5] whitespace-nowrap">
              4.3× <span className="text-[8px] sm:text-xs text-[#6276A0]">faster</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute left-0 sm:left-4 bottom-[8%] sm:bottom-[15%] bg-[#060F24]/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-3 shadow-2xl z-20"
          >
            <div className="text-[7px] sm:text-[9px] font-medium tracking-widest uppercase text-white/40 mb-0.5">ALTITUDE</div>
            <div className="font-['Playfair_Display'] text-xs sm:text-lg md:text-xl italic text-white whitespace-nowrap">2,847m</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};