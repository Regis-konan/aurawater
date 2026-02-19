import { motion } from 'framer-motion';

const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const NAV_LINKS = ['Story', 'Science', 'Ritual', 'Stockists', 'Privacy', 'Terms'] as const;
const SOCIALS   = ['IG', 'TW', 'LI'] as const;

export const Footer = () => (
  <motion.footer
    variants={stagger}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="bg-[#060F24] border-t border-white/[0.06] py-10 sm:py-[52px] px-5 sm:px-8 md:px-[8vw]"
  >

    {/* ── Top row ──────────────────────────────────────── */}
    <motion.div
      variants={fadeUp}
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-8 mb-8 sm:mb-10"
    >

      {/* Logo */}
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="font-['Playfair_Display'] text-2xl italic tracking-wider text-white cursor-pointer shrink-0"
      >
        Aura<span className="text-[#1257F5]">.</span>
      </motion.span>

      {/* Nav links — wraps on mobile */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-8">
        {NAV_LINKS.map((l, i) => (
          <motion.a
            key={l}
            href="#"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="text-[11px] font-normal tracking-widest uppercase text-white/20 no-underline transition-colors duration-300 hover:text-white/60"
          >
            {l}
          </motion.a>
        ))}
      </div>

      {/* Social icons */}
      <div className="flex gap-3 shrink-0">
        {SOCIALS.map((s, i) => (
          <motion.a
            key={s}
            href="#"
            data-h
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.1, borderColor: '#1257F5', color: '#1257F5' }}
            className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-medium tracking-widest text-white/30 no-underline transition-all duration-300"
          >
            {s}
          </motion.a>
        ))}
      </div>
    </motion.div>

    {/* ── Divider ──────────────────────────────────────── */}
    <motion.div variants={fadeUp} className="h-px bg-white/[0.05] mb-6 sm:mb-7" />

    {/* ── Bottom row ───────────────────────────────────── */}
    <motion.div
      variants={fadeUp}
      className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-center sm:text-left"
    >
      <span className="text-[10px] font-normal tracking-widest uppercase text-white/[0.15]">
        © 2025 Aura Water Co. — All rights reserved
      </span>
      <span className="text-[10px] font-normal tracking-widest uppercase text-white/[0.15]">
        Crafted with intention
      </span>
    </motion.div>
  </motion.footer>
);