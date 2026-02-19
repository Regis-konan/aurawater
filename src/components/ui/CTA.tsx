import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

export const CTA = () => {
  const [email,   setEmail]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return;
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <section id="cta" className="bg-[#060F24] py-16 sm:py-24 md:py-[120px] px-5 sm:px-8 md:px-[8vw] relative overflow-hidden">
      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(18,87,245,.12) 0%, transparent 60%)' }} />

      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-16">
        <div className="w-full md:max-w-[540px]">
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-[10px] font-semibold tracking-widest uppercase text-[#1257F5] mb-5">
            <div className="w-5 h-px bg-[#1257F5]" />The invitation
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-[clamp(40px,5.5vw,78px)] font-bold leading-[.95] text-white mb-5 sm:mb-6">
            Enter<br /><em className="italic text-[#C8DCFF]">the flow.</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm sm:text-base leading-relaxed font-light text-white/40 max-w-[400px]">
            Join the waitlist for our next limited alpine drop. Quarterly releases. Numbered bottles. Free worldwide delivery.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:gap-4 w-full md:min-w-[320px] md:max-w-[420px]">
          {success ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-6 px-4 rounded-2xl border border-[rgba(18,87,245,.3)] bg-[rgba(18,87,245,.08)]">
              <div className="text-2xl mb-2">✓</div>
              <div className="text-white font-medium text-sm">You're on the list.</div>
              <div className="text-white/40 text-xs mt-1 tracking-widest">We'll be in touch soon.</div>
            </motion.div>
          ) : (
            <>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="inp w-full"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit(); }}
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="btn bp w-full justify-center rounded-full py-3.5 sm:py-4 px-8 text-xs"
              >
                Reserve my bottle →
              </motion.button>
            </>
          )}
          <div className="text-[11px] text-white/25 tracking-widest uppercase text-center">
            No spam · Cancel anytime · Limited spots
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};