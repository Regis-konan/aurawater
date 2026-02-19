import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WaterMenu } from '../canvas/WaterMenu';
import { useScrollTo } from '../../hooks/useScrollTo';

const LINKS = [
  { label: 'Story',   id: 'story'   },
  { label: 'Science', id: 'science' },
  { label: 'Ritual',  id: 'ritual'  },
  { label: 'Shop',    id: 'shop'    },
] as const;

const navVariants = {
  hidden:  { y: -80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const linkVariants = {
  hidden:  { opacity: 0, y: -12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const WaveBurger = ({ open, color }: { open: boolean; color: string }) => (
  <svg width="26" height="22" viewBox="0 0 26 22" fill="none" style={{ overflow: 'visible' }}>
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: open ? 'M 3 3 L 23 19' : 'M 1 4 Q 6 2 13 4 Q 19 6 25 4' }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} />
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: 'M 1 11 Q 6 9 13 11 Q 19 13 25 11', opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
      style={{ transformOrigin: '13px 11px' }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} />
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: open ? 'M 3 19 L 23 3' : 'M 1 18 Q 6 16 13 18 Q 19 20 25 18' }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} />
  </svg>
);

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = useScrollTo();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(id), 350);
  };

  const navBg =
    menuOpen ? 'bg-transparent border-transparent' :
    scrolled  ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.07]' :
                'bg-transparent border-transparent';

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`
          fixed top-0 left-0 right-0 z-[100]
          flex items-center justify-between
          px-5 sm:px-8 md:px-[6vw]
          transition-[padding,background,backdrop-filter,border-color]
          duration-500 ease-[cubic-bezier(.16,1,.3,1)]
          ${scrolled ? 'py-3' : 'py-4 sm:py-5'}
          ${navBg}
        `}
      >
        {/* Logo → retour en haut */}
        <motion.span
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => scrollTo('top')}
          transition={{ duration: 0.25 }}
          className={`
            font-['Playfair_Display'] text-[18px] sm:text-[20px] md:text-[22px]
            italic tracking-widest relative z-[200] select-none cursor-pointer
            transition-colors duration-500
            ${menuOpen ? 'text-white' : 'text-[#060F24]'}
          `}
        >
          Aura<span className="text-[#1257F5]">.</span>
        </motion.span>

        {/* Desktop links */}
        <div className="hidden md:flex gap-9">
          {LINKS.map((l, i) => (
            <motion.button
              key={l.label}
              custom={i}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollTo(l.id)}
              className="
                relative text-[13px] font-normal text-[#6276A0]
                bg-transparent border-none font-[inherit] cursor-pointer
                tracking-wide transition-colors duration-300 hover:text-[#060F24]
                after:content-[''] after:absolute after:bottom-[-3px] after:left-0
                after:h-px after:w-0 after:bg-[#1257F5]
                after:transition-[width] after:duration-300 hover:after:w-full
              "
            >
              {l.label}
            </motion.button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => scrollTo('cta')}
            className="
              hidden md:inline-flex items-center gap-2
              bg-[#1257F5] text-white text-[12px] font-medium tracking-wide
              rounded-full px-6 py-2.5 border-none cursor-pointer font-[inherit]
              shadow-[0_4px_20px_rgba(18,87,245,0.3)]
              hover:shadow-[0_10px_36px_rgba(18,87,245,0.45)]
              transition-shadow duration-300
            "
          >
            Order Now
          </motion.button>

          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="water-menu"
            onClick={() => setMenuOpen(o => !o)}
            className="flex md:hidden items-center justify-center relative z-[200] bg-transparent border-none p-2 -mr-1 cursor-pointer"
          >
            <WaveBurger open={menuOpen} color={menuOpen ? '#ffffff' : '#060F24'} />
          </button>
        </div>
      </motion.nav>

      <WaterMenu
        id="water-menu"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNav}
      />
    </>
  );
};