import { motion } from 'framer-motion';

const ITEMS = [
  "pH 7.4 Alkaline",
  "32 Trace Minerals",
  "0 ppm Contaminants",
  "2847m Altitude",
  "Glass Packaging",
  "Carbon Neutral",
  "Alpine Certified",
  "Glacial Origin",
];

const Sep = () => (
  <span className="mx-5 sm:mx-7 text-white/25 text-[10px]">◆</span>
);

export const Ticker = () => {
  // Triplicate pour éviter un vide visible sur grands écrans
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-[#1257F5] py-3 sm:py-4 overflow-hidden"
    >
      <div className="ticker-wrap">
        <div className="ticker-track">
          {repeated.map((item, i) => (
            <span
              key={i}
              className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-white/85 whitespace-nowrap"
            >
              {item}
              <Sep />
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};