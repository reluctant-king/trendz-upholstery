import { motion } from 'framer-motion';

export default function PortfolioFilter({ categories, active, onChange, className = '' }) {
  const all = ['All', ...categories];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`no-scrollbar flex gap-2.5 overflow-x-auto pb-1 ${className}`}
      role="tablist"
      aria-label="Filter projects by category"
    >
      {all.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full border px-5 py-2.5 text-[12px] font-semibold tracking-wide transition-all duration-300 ${
            active === cat
              ? 'border-gold bg-gold text-navy shadow-gold'
              : 'border-ink/15 bg-white/60 text-ink/60 hover:border-mutedGold hover:text-navy'
          }`}
        >
          {cat}
        </button>
      ))}
    </motion.div>
  );
}
