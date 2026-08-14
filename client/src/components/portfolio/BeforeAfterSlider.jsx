import { useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BeforeAfterSlider({ before, after, labels = { before: 'Before', after: 'After' }, className = '' }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  };

  useEffect(() => {
    const onMove = (e) => dragging.current && updateFromClientX(e.clientX || (e.touches && e.touches[0].clientX));
    const onUp = () => (dragging.current = false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-4xl shadow-lift sm:aspect-[16/9] ${className}`}
    >
      {/* After (full) */}
      {after && (
        <img src={after} alt={labels.after} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      )}

      {/* Before (clipped) */}
      {before && (
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img
            src={before}
            alt={labels.before}
            className="h-full w-full max-w-none object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
            draggable={false}
          />
        </div>
      )}

      {/* Divider */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90" />
        <button
          onPointerDown={(e) => {
            dragging.current = true;
            updateFromClientX(e.clientX);
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-navy shadow-lift transition-transform hover:scale-105"
          aria-label="Drag to compare"
        >
          <MoveHorizontal size={20} />
        </button>
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-navy/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gold px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
        {labels.after}
      </span>
    </motion.div>
  );
}
