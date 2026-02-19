import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Animated counter ─────────────────────────────────────────
interface NumProps {
  end:     number;
  suffix?: string;
  prefix?: string;
  delay?:  number;
}

const Num = ({ end, suffix = '', prefix = '', delay = 0 }: NumProps) => {
  const [count, setCount] = useState(0);
  const ref     = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    const duration  = 2000;
    const increment = end / (duration / 20);
    let start = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(Math.floor(start));
        }
      }, 20);

      // cleanup inner interval
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// ── Stats data ───────────────────────────────────────────────
const STATS = [
  { end: 2847, suf: 'm',  pre: '',  label: 'Spring altitude',    foot: '',                        delay: 0   },
  { end: 32,   suf: '',   pre: '',  label: 'Trace minerals',     foot: '',                        delay: 0.1 },
  { end: 99,   suf: '%',  pre: '',  label: 'Purity rating',      foot: '',                        delay: 0.2 },
  { end: 4,    suf: '×',  pre: '',  label: 'Faster absorption',  foot: 'vs standard mineral water', delay: 0.3 },
] as const;

// ── Component ────────────────────────────────────────────────
export const Numbers = () => (
  <section className="bg-white py-14 sm:py-20 md:py-[100px] overflow-hidden">
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-[rgba(6,15,36,.08)]">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: s.delay, ease: [0.16, 1, 0.3, 1] }}
          className="border-r border-b border-[rgba(6,15,36,.08)] p-6 sm:p-8 md:p-12"
        >
          <div className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,72px)] font-bold italic text-[#060F24] leading-none mb-2 sm:mb-2.5">
            <Num end={s.end} suffix={s.suf} prefix={s.pre} delay={s.delay} />
          </div>

          <div className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-[#6276A0]">
            {s.label}
          </div>

          {s.foot && (
            <div className="text-[9px] sm:text-[10px] text-[#6276A0] mt-1 opacity-60 leading-snug">
              {s.foot}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);