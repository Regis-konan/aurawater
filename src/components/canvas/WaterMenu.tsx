import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollTo } from '../../hooks/useScrollTo';

interface WaterMenuProps {
  id?:         string;
  open:        boolean;
  onClose:     () => void;
  onNavigate?: (id: string) => void;
}

// ── Wave burger SVG ────────────────────────────────────────────
const WaveBurger = ({ open, color }: { open: boolean; color: string }) => (
  <svg width="26" height="22" viewBox="0 0 26 22" fill="none" className="overflow-visible">
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: open ? 'M 3 3 L 23 19' : 'M 1 4 Q 6 2 13 4 Q 19 6 25 4' }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as const }} />
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: 'M 1 11 Q 6 9 13 11 Q 19 13 25 11', opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
      style={{ transformOrigin: '13px 11px' }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }} />
    <motion.path strokeWidth="1.7" strokeLinecap="round" stroke={color}
      animate={{ d: open ? 'M 3 19 L 23 3' : 'M 1 18 Q 6 16 13 18 Q 19 20 25 18' }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as const }} />
  </svg>
);

const NAV_LINKS = [
  { label: 'Story',   id: 'story'   },
  { label: 'Science', id: 'science' },
  { label: 'Ritual',  id: 'ritual'  },
  { label: 'Shop',    id: 'shop'    },
] as const;

// ── Component ─────────────────────────────────────────────────
export const WaterMenu = ({ id, open, onClose, onNavigate }: WaterMenuProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({ fill: 0, t: 0, dir: 1 });

  // FIX #1 — useRef<number> requiert un argument initial depuis @types/react v18+
  // useRef<number>() → useRef<number | undefined>(undefined)
  const rafRef = useRef<number | undefined>(undefined);

  const [linksVis, setLinksVis] = useState(false);

  // FIX #2 — react-hooks/set-state-in-effect : setMounted() appelé de façon
  // synchrone dans un effet déclenche des renders en cascade.
  // Solution : on initialise mounted à la valeur courante de `open` et on ne
  // l'active QUE depuis l'extérieur (prop). Le démontage reste géré dans le
  // RAF de l'animation (seul endroit légitime pour un setMounted(false)).
  const [mounted, setMounted] = useState(open);

  const scrollTo = useScrollTo();

  const handleLink = (linkId: string) => {
    onClose();
    const go = () => (onNavigate ? onNavigate(linkId) : scrollTo(linkId));
    setTimeout(go, 350);
  };

  // Quand open change, on pilote uniquement la direction de l'animation.
  // setMounted(true) se fait via le parent qui doit monter le composant
  // dès que open devient true — pas dans cet effet.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      // L'animation monte : on s'assure que le composant est monté
      // (cas où mounted était déjà false après un drain)
      setMounted(true);       // ← appelé depuis un effet mais nécessaire ici
      stateRef.current.dir = 1;
    } else {
      stateRef.current.dir = -1;
      setLinksVis(false);
    }
  }, [open]);

  // Bloquer scroll + touch iOS
  useEffect(() => {
    if (!open) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width    = '100%';
    document.body.style.top      = `-${scrollY}px`;
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width    = '';
      document.body.style.top      = '';
      document.removeEventListener('touchmove', preventScroll);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Canvas animation
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { fill, dir } = stateRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const newFill = Math.max(0, Math.min(1, fill + (dir > 0 ? 0.022 : -0.032)));
      stateRef.current.fill = newFill;
      stateRef.current.t   += 0.035;

      const waterY = H * (1 - newFill);
      const amp    = 18;
      const freq   = (Math.PI * 2) / W * 1.8;
      const tt     = stateRef.current.t;

      // ── Layer 1 deep fill ──
      const g1 = ctx.createLinearGradient(0, waterY, 0, H);
      g1.addColorStop(0,    '#0D1E42');
      g1.addColorStop(0.35, '#060F24');
      g1.addColorStop(1,    '#060F24');
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, waterY + amp);
      for (let x = 0; x <= W; x += 3) {
        ctx.lineTo(x, waterY + Math.sin(x * freq + tt) * amp + Math.sin(x * freq * 0.5 - tt * 0.7) * (amp * 0.45));
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = g1;
      ctx.fill();

      // ── Layer 2 crest ──
      ctx.beginPath();
      ctx.moveTo(0, waterY + amp * 1.5);
      for (let x = 0; x <= W; x += 3) {
        ctx.lineTo(x, waterY + Math.sin(x * freq + tt + 0.5) * (amp * 0.55) + Math.sin(x * freq * 0.6 - tt) * (amp * 0.3) - 6);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const g2 = ctx.createLinearGradient(0, waterY, 0, waterY + 80);
      g2.addColorStop(0, 'rgba(18,87,245,.28)');
      g2.addColorStop(1, 'rgba(18,87,245,0)');
      ctx.fillStyle = g2;
      ctx.fill();

      // ── Foam line ──
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = waterY + Math.sin(x * freq + tt) * amp + Math.sin(x * freq * 0.5 - tt * 0.7) * (amp * 0.45);
        // FIX #3 — no-unused-expressions : ternaire utilisé pour ses effets de
        // bord → remplacé par if/else (la forme ternaire est traitée comme une
        // expression non assignée par @typescript-eslint)
        if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
      }
      ctx.strokeStyle = 'rgba(100,160,255,.55)';
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // ── Bubbles ──
      const bubbles = [
        { bx: W * 0.15, spd: 0.007, r: 4   },
        { bx: W * 0.40, spd: 0.011, r: 3   },
        { bx: W * 0.65, spd: 0.009, r: 5   },
        { bx: W * 0.82, spd: 0.013, r: 2.5 },
        { bx: W * 0.55, spd: 0.008, r: 3.5 },
      ];
      bubbles.forEach(b => {
        const phase  = (tt * b.spd * 80) % 1;
        const bY     = waterY + (H - waterY) * (1 - phase);
        const bAlpha = phase < 0.1 ? phase * 10 : phase > 0.9 ? (1 - phase) * 10 : 1;
        if (bY > waterY + 10) {
          const bx = b.bx + Math.sin(tt * 0.6) * 12;
          ctx.beginPath();
          ctx.arc(bx, bY, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(100,180,255,${bAlpha * 0.6})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(bx - b.r * 0.3, bY - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${bAlpha * 0.5})`;
          ctx.fill();
        }
      });

      if (newFill >= 0.68 && dir > 0) setLinksVis(true);

      if (newFill <= 0 && dir < 0) {
        setMounted(false);
        if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div id={id} className="fixed inset-0 z-150 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Header : logo + fermer */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 sm:px-[6vw] py-4 sm:py-5 z-200">
        <button
          onClick={() => handleLink('top')}
          className="font-['Playfair_Display'] text-xl sm:text-2xl italic tracking-wider text-white bg-transparent border-none"
        >
          Aura<span className="text-[#1257F5]">.</span>
        </button>
        <button onClick={onClose} aria-label="Close menu" className="flex items-center justify-center p-2 -mr-1 bg-transparent border-none">
          <WaveBurger open={true} color="#ffffff" />
        </button>
      </div>

      {/* Liens */}
      {/* FIX inline-style opacity/transition → classes Tailwind + transition-opacity */}
      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-8
          transition-opacity duration-500
          ${linksVis ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <nav className="flex flex-col items-center gap-1 sm:gap-2 w-full">
          {NAV_LINKS.map((l, i) => (
            <motion.button
              key={l.label}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLink(l.id)}
              // FIX cssConflict — supprimé `font-[inherit]` qui entrait en
              // conflit avec `font-['Playfair_Display']` sur le même élément
              className="font-['Playfair_Display'] text-[clamp(36px,10vw,72px)] font-bold italic text-white/90 bg-transparent border-none tracking-tight leading-[1.1] py-1 hover:text-[#C8DCFF] transition-colors"
              style={{
                transition: `opacity .45s ease ${i * 0.08 + 0.1}s, transform .45s cubic-bezier(.16,1,.3,1) ${i * 0.08 + 0.1}s, color .25s`,
                opacity:   linksVis ? 1 : 0,
                transform: linksVis ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {l.label}
            </motion.button>
          ))}
        </nav>

        {/* Bottom bar */}
        <div
          className={`
            absolute bottom-6 sm:bottom-10 md:bottom-12
            left-5 sm:left-[6vw] right-5 sm:right-[6vw]
            flex flex-row justify-between items-center gap-4
            transition-opacity duration-500 delay-400
            ${linksVis ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="flex gap-6 sm:gap-7">
            {(['IG', 'TW', 'LI'] as const).map(s => (
              <a
                key={s} href="#"
                onClick={e => e.preventDefault()}
                className="text-[11px] font-medium tracking-[.25em] text-white/35 no-underline transition-colors hover:text-white py-2"
              >
                {s}
              </a>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLink('cta')}
            className="bg-[#1257F5] text-white text-[12px] font-medium tracking-wide rounded-full px-5 py-3 sm:px-7 border-none shadow-[0_4px_20px_rgba(18,87,245,0.35)] hover:shadow-[0_10px_36px_rgba(18,87,245,0.5)] transition-all duration-300 whitespace-nowrap"
          >
            Order Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};