import { useState, useEffect, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { BottleCanvas } from '../canvas/BottleCanvas';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const STATS = [
  { value: 'pH 7.4', label: 'Alkaline'   },
  { value: '32',     label: 'Minerals'   },
  { value: '0 ppm',  label: 'Impurities' },
  { value: '2847m',  label: 'Altitude'   },
];

const useBottleSize = () => {
  const getSize = () => {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    if (w < 400) return 0.60;
    if (w < 640) return 0.72;
    if (w < 768) return 0.82;
    if (w < 1024) return 0.90;
    return 1.0;
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
  const [mouse,     setMouse]     = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const bottleSize = useBottleSize();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    setMouse({
      x: e.clientX / window.innerWidth  - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  };

  return (
    <section
      onMouseMove={onMove}
      className="min-h-screen pt-20 sm:pt-24 md:pt-[100px] bg-gradient-to-br from-white via-[#EEF4FF] to-[#D6E8FF] relative overflow-x-hidden"
    >
      {/* BG blobs */}
      <div className="absolute -top-[10%] -right-[8%] w-[60vw] sm:w-[50vw] md:w-[40vw] h-[60vw] sm:h-[50vw] md:h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.1)_0%,rgba(18,87,245,.04)_50%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[5%] -left-[5%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.06)_0%,transparent_70%)] pointer-events-none" />

      {/*
        flex-col sur mobile → texte d'abord, bouteille ensuite
        lg:grid 2 colonnes → côte à côte sur desktop
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-[4vw] px-5 sm:px-8 md:px-[8vw] pb-10 lg:pb-0 lg:min-h-[calc(100vh-100px)]">

        {/* ── 1. TEXTE — en haut sur mobile, gauche sur desktop ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="w-full text-center lg:text-left pt-6 sm:pt-8 lg:pt-0"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-[#E6EEFF] rounded-full py-1 pl-1.5 pr-3 mb-5 sm:mb-7"
          >
            <span className="bg-[#1257F5] text-white rounded-full text-[9px] font-semibold px-2 py-0.5 tracking-widest">NEW</span>
            <span className="text-[10px] sm:text-xs text-[#1257F5] font-medium">2025 Limited</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-['Playfair_Display'] text-[clamp(36px,9vw,88px)] font-bold leading-[0.95] tracking-tight mb-4 sm:mb-6"
          >
            Water born<br />
            <em className="italic text-[#1257F5]">from silence.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base leading-relaxed font-light text-[#6276A0] max-w-[440px] mb-6 sm:mb-10 mx-auto lg:mx-0"
          >
            Drawn at 2,847m from glacial springs filtered through granite for centuries. 32 trace minerals. pH 7.4. Zero compromise.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex gap-3 flex-wrap justify-center lg:justify-start mb-7 sm:mb-10"
          >
            <button data-h className="btn bp text-sm px-6 py-3">Discover Aura →</button>
            <button data-h className="btn bg text-sm px-6 py-3">Our science</button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-4 gap-2 sm:gap-6 border-t border-[rgba(6,15,36,.08)] pt-5 sm:pt-8"
          >
            {STATS.map((item) => (
              <div key={item.label} className="text-center lg:text-left">
                <div className="font-['Playfair_Display'] text-base sm:text-xl md:text-2xl font-semibold">{item.value}</div>
                <div className="text-[9px] sm:text-[10px] font-medium text-[#6276A0] tracking-widest uppercase mt-0.5">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── 2. BOUTEILLE — en bas sur mobile, droite sur desktop ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="w-full flex justify-center items-center relative mt-8 lg:mt-0 lg:min-h-[500px]"
        >
          {/* Glow */}
          <div className="absolute w-[55%] pb-[55%] rounded-full bg-[radial-gradient(circle,rgba(18,87,245,.12)_0%,transparent_70%)] blur-2xl pointer-events-none" />

          {/* Orbit rings — desktop only */}
          <div className="hidden lg:block absolute w-[300px] xl:w-[340px] h-[300px] xl:h-[340px] rounded-full border border-[rgba(18,87,245,.1)] animate-[spin_28s_linear_infinite]">
            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 xl:w-2.5 h-2 xl:h-2.5 rounded-full bg-[#1257F5] shadow-[0_0_10px_#1257F5] opacity-70" />
          </div>
          <div className="hidden lg:block absolute w-[220px] xl:w-[260px] h-[220px] xl:h-[260px] rounded-full border border-[rgba(18,87,245,.06)] animate-[spinR_20s_linear_infinite]" />

          {/*
            FIX DÉBORDEMENT → size prop natif, pas de scale() CSS
            FIX FLOAT → @keyframes float dans index.css (voir ci-dessous)
          */}
          <div className="relative z-10">
            <BottleCanvas size={bottleSize} mouseX={mouse.x} mouseY={mouse.y} />
          </div>

          {/* Cards — cachées sur mobile (<640px) pour éviter tout débordement */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block absolute right-4 md:right-[4%] top-[10%] md:top-[18%] bg-white/85 backdrop-blur-xl border border-[rgba(6,15,36,.07)] rounded-xl md:rounded-2xl p-3 md:p-3.5 shadow-lg"
          >
            <div className="text-[9px] font-semibold tracking-widest uppercase text-[#6276A0] mb-0.5">CELLULAR</div>
            <div className="font-['Playfair_Display'] text-lg md:text-2xl font-semibold text-[#1257F5] whitespace-nowrap">
              4.3× <span className="text-xs md:text-sm text-[#6276A0]">faster</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="hidden sm:block absolute left-4 md:left-[2%] bottom-[14%] md:bottom-[22%] bg-[#060F24] rounded-xl p-3 shadow-2xl"
          >
            <div className="text-[9px] font-medium tracking-widest uppercase text-white/40 mb-0.5">ALTITUDE</div>
            <div className="font-['Playfair_Display'] text-lg md:text-xl italic text-white whitespace-nowrap">2,847m</div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};