import { useState } from 'react';
import { motion } from 'framer-motion';
import PortfolioGrid from './PortfolioGrid';
import { useSite } from '../../context/SiteContext';

export const colorHex = {
  Cream: '#F5F0E8',
  Beige: '#E8DED0',
  Taupe: '#A4938A',
  Grey: '#9C9C9C',
  Olive: '#6B7B4F',
  Terracotta: '#C97B4A',
  Rust: '#B4603C',
  Navy: '#14213D',
  Black: '#1A1A1A',
  Mustard: '#D9A50B',
  White: '#FFFFFF',
  Charcoal: '#3A3A3A',
  Tan: '#D2B48C',
  Cognac: '#9A5B2F',
  Brown: '#6F4E37',
  Sand: '#D8C7A9',
  Blush: '#E8C4C4',
  Forest: '#2F4F3A',
};

const defaultColors = ['Cream', 'Beige', 'Taupe', 'Grey', 'Olive', 'Terracotta', 'Rust', 'Navy', 'Black', 'Mustard'];

const colorToProjectMap = {
  Cream: ['cream', 'beige', 'ivory', 'white'],
  Beige: ['beige', 'cream', 'sand'],
  Taupe: ['taupe', 'sand', 'mocha', 'beige', 'greige'],
  Grey: ['grey', 'gray', 'charcoal'],
  Olive: ['olive', 'green'],
  Terracotta: ['terracotta', 'rust', 'orange', 'brown'],
  Rust: ['rust', 'terracotta', 'brown'],
  Navy: ['navy', 'blue'],
  Black: ['black', 'charcoal', 'navy'],
  Mustard: ['mustard', 'yellow', 'gold'],
};

export default function ColorPalette({ className = '' }) {
  const { projects } = useSite();
  const [active, setActive] = useState(null);

  const filtered =
    active && colorToProjectMap[active]
      ? projects.filter((p) => {
          const color = (p.color || '').toLowerCase();
          return colorToProjectMap[active].some((kw) => color.includes(kw));
        })
      : [];

  return (
    <div className={className}>
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
        <span className="eyebrow mb-4">Color Collection</span>
        <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl md:text-[2.9rem] md:leading-[1.15]">
          Make It Yours.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
          Tap a shade to see real projects finished in that palette.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {defaultColors.map((c) => {
          const isLight = c === 'Cream' || c === 'White' || c === 'Beige' || c === 'Sand';
          return (
            <button
              key={c}
              onClick={() => setActive(active === c ? null : c)}
              aria-pressed={active === c}
              className="group flex flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                  active === c ? 'scale-110 border-gold ring-2 ring-gold/30' : 'border-ink/10 hover:scale-105'
                }`}
                style={{ backgroundColor: colorHex[c], color: isLight ? '#111' : '#fff' }}
                title={c}
              >
                {active === c && <span className="text-[9px] font-bold">✓</span>}
              </span>
              <span className={`text-[10px] font-medium ${active === c ? 'text-navy' : 'text-ink/50'}`}>{c}</span>
            </button>
          );
        })}
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          {filtered.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-ink/60">Projects finished in <strong className="text-navy">{active}</strong>:</p>
              <PortfolioGrid projects={filtered.slice(0, 3)} />
            </>
          ) : (
            <p className="rounded-2xl bg-white/70 px-5 py-4 text-sm text-ink/55">
              No projects in this shade yet — but we can make any shade you can imagine.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
