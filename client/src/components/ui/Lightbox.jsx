import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function Lightbox({ images, index, onClose, onNavigate }) {
  const [current, setCurrent] = useState(index);

  const go = useCallback(
    (dir) => {
      setCurrent((c) => (c + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    setCurrent(index);
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, go]);

  if (!images || images.length === 0) return null;

  const currentImage = images[current];

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep/95 p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-deep"
        >
          <X size={20} />
        </button>

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-deep"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <motion.figure
          key={current}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-h-full max-w-5xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.url || currentImage}
            alt={currentImage.alt || currentImage.title || 'Project image'}
            className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-lift"
          />
          {(currentImage.title || currentImage.alt) && (
            <figcaption className="mt-4 text-sm text-white/70">
              {currentImage.title || currentImage.alt}
            </figcaption>
          )}
        </motion.figure>

        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-deep"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {images.length > 1 && (
          <div className="mt-5 flex items-center gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-gold' : 'w-2.5 bg-white/30'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
