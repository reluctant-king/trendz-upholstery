import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BadgeCheck } from 'lucide-react';

const SPOTLIGHT_R = 260;
const SMOOTHING = 0.1;
const FADE_SPEED = 0.08;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

export default function UpholsteryImageRevealHero({
  baseImage = '',
  revealImage = '',
  baseAlt = 'Upholstery project',
  revealAlt = 'Same project, fully restored',
  eyebrow = 'CUSTOM UPHOLSTERY • MADE FOR YOUR SPACE',
  title = 'Furniture That Feels Like Home.',
  description = 'Premium sofas, custom upholstery, curtains and furniture solutions crafted around your style.',
  primaryButton = { label: 'VIEW OUR WORK', to: '/our-work' },
  secondaryButton = { label: 'GET A QUOTE', to: '/quote' },
  hint = 'Move to explore',
}) {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const canvasRef = useRef(null);

  const mouseRef = useRef({ x: 0, y: 0, inside: false });
  const smoothRef = useRef({ x: 0, y: 0, opacity: 0 });
  const hasMovedRef = useRef(false);
  const rafRef = useRef(0);

  const [explored, setExplored] = useState(false);

  useEffect(() => {
    const section = containerRef.current;
    const reveal = revealRef.current;
    const canvas = canvasRef.current;
    if (!section || !reveal || !canvas) return;

    const ctx = canvas.getContext('2d');

    const mqFine = window.matchMedia('(pointer: fine)');
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let cw = 0;
    let ch = 0;

    const radius = () => {
      const w = section.clientWidth;
      if (w >= 1536) return 260;
      if (w >= 1280) return 245;
      if (w >= 1024) return 225;
      return 0;
    };

    const enabled = () =>
      mqFine.matches && mqDesktop.matches && !mqMotion.matches && radius() > 0 && revealImage;

    function resizeCanvas() {
      const rect = section.getBoundingClientRect();
      cw = Math.round(rect.width);
      ch = Math.round(rect.height);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
    }

    function applyMask(x, y, opacity) {
      const r = radius();
      ctx.clearRect(0, 0, cw, ch);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(0.4, 'rgba(0,0,0,1)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.75)');
      grad.addColorStop(0.75, 'rgba(0,0,0,0.4)');
      grad.addColorStop(0.88, 'rgba(0,0,0,0.12)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      const url = canvas.toDataURL();
      const mask = `url(${url})`;
      reveal.style.setProperty('-webkit-mask-image', mask);
      reveal.style.setProperty('mask-image', mask);
      reveal.style.setProperty('-webkit-mask-size', '100% 100%');
      reveal.style.setProperty('mask-size', '100% 100%');
      reveal.style.setProperty('-webkit-mask-repeat', 'no-repeat');
      reveal.style.setProperty('mask-repeat', 'no-repeat');
      reveal.style.setProperty('-webkit-mask-position', '0 0');
      reveal.style.setProperty('mask-position', '0 0');
      reveal.style.opacity = String(opacity);
    }

    function hideReveal() {
      cancelAnimationFrame(rafRef.current);
      reveal.style.opacity = '0';
    }

    function animate() {
      if (!enabled()) {
        hideReveal();
        return;
      }

      const mouse = mouseRef.current;
      const smooth = smoothRef.current;
      const targetOpacity = mouse.inside && hasMovedRef.current ? 1 : 0;

      if (mouse.inside) {
        smooth.x += (mouse.x - smooth.x) * SMOOTHING;
        smooth.y += (mouse.y - smooth.y) * SMOOTHING;
      }
      smooth.opacity += (targetOpacity - smooth.opacity) * FADE_SPEED;
      if (Math.abs(targetOpacity - smooth.opacity) < 0.005) smooth.opacity = targetOpacity;

      if (smooth.opacity > 0.005) {
        applyMask(smooth.x, smooth.y, smooth.opacity);
      } else {
        reveal.style.opacity = '0';
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function start() {
      resizeCanvas();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    }

    function onPointerMove(e) {
      if (!enabled()) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        smoothRef.current.x = x;
        smoothRef.current.y = y;
        setExplored(true);
      }
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.inside = true;
    }

    function onPointerEnter() {
      mouseRef.current.inside = true;
    }

    function onPointerLeave() {
      mouseRef.current.inside = false;
    }

    function onChange() {
      if (enabled()) {
        start();
      } else {
        hideReveal();
        hasMovedRef.current = false;
        mouseRef.current.inside = false;
      }
    }

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerenter', onPointerEnter);
    section.addEventListener('pointerleave', onPointerLeave);

    const ro = new ResizeObserver(() => {
      resizeCanvas();
    });
    ro.observe(section);

    mqFine.addEventListener('change', onChange);
    mqDesktop.addEventListener('change', onChange);
    mqMotion.addEventListener('change', onChange);

    onChange();

    return () => {
      cancelAnimationFrame(rafRef.current);
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerenter', onPointerEnter);
      section.removeEventListener('pointerleave', onPointerLeave);
      ro.disconnect();
      mqFine.removeEventListener('change', onChange);
      mqDesktop.removeEventListener('change', onChange);
      mqMotion.removeEventListener('change', onChange);
    };
  }, [revealImage]);

  return (
    <section
      ref={containerRef}
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-deep"
      aria-label="Featured upholstery project"
    >
      {/* Base image */}
      {baseImage && (
        <img
          src={baseImage}
          alt={baseAlt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
      )}

      {/* Revealed image (masked by the canvas gradient) */}
      {revealImage && (
        <img
          ref={revealRef}
          src={revealImage}
          alt={revealAlt}
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: 0, filter: 'contrast(1.06) saturate(1.05)' }}
        />
      )}

      {/* Readability scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/40 to-deep/10" />

      {/* Hidden mask canvas */}
      <canvas ref={canvasRef} className="absolute left-0 top-0 hidden" aria-hidden="true" />

      {/* Content */}
      <div className="container-px relative z-10 w-full pb-20 pt-40 md:pb-28">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-deep/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur"
          >
            <Sparkles size={13} /> {eyebrow}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[2.6rem] leading-[1.08] text-white drop-shadow-lg sm:text-6xl lg:text-[4.2rem]"
          >
            {title}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to={primaryButton.to} className="btn-primary px-8 py-4">
              {primaryButton.label} <ArrowRight size={16} />
            </Link>
            <Link to={secondaryButton.to} className="btn-white px-8 py-4">
              {secondaryButton.label}
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-4 border-t border-white/15 pt-7">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
              <BadgeCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Trusted craftsmanship</p>
              <p className="text-xs text-white/60">Custom-made for your space</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle explore hint */}
      {revealImage && !explored && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-deep/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur"
        >
          {hint}
        </motion.div>
      )}
    </section>
  );
}
