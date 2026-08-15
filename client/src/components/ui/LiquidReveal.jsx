import { useEffect, useRef } from 'react';

const BRUSH_RADIUS = 143;
const DECAY = 0.016;
const FADE_FRAMES = 120;

export default function LiquidReveal({
  base = '',
  reveal = '',
  alt = '',
  hint = 'Move your mouse to reveal',
  className = '',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const afterImg = new Image();
    afterImg.crossOrigin = 'anonymous';
    afterImg.src = reveal;

    let coverCanvas = null;
    let brushCanvas = null;
    let brushCtx = null;

    let radius = BRUSH_RADIUS * DPR;
    let diameter = Math.ceil(radius * 2);

    let cw = 0;
    let ch = 0;
    let points = [];
    let last = null;
    let idle = 999;
    let ready = false;
    let raf = 0;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function buildCover() {
      if (!afterImg.complete || !afterImg.naturalWidth) return;
      coverCanvas = document.createElement('canvas');
      coverCanvas.width = cw;
      coverCanvas.height = ch;
      const cc = coverCanvas.getContext('2d');

      const iw = afterImg.naturalWidth;
      const ih = afterImg.naturalHeight;
      const cAspect = cw / ch;
      const iAspect = iw / ih;

      let sx, sy, sw, sh;
      if (iAspect > cAspect) {
        sh = ih;
        sw = ih * cAspect;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / cAspect;
        sx = 0;
        sy = (ih - sh) / 2;
      }
      cc.drawImage(afterImg, sx, sy, sw, sh, 0, 0, cw, ch);
      ready = true;
    }

    function buildBrush() {
      radius = BRUSH_RADIUS * DPR;
      diameter = Math.ceil(radius * 2);
      brushCanvas = document.createElement('canvas');
      brushCanvas.width = diameter;
      brushCanvas.height = diameter;
      brushCtx = brushCanvas.getContext('2d');
    }

    function stamp(x, y) {
      if (!coverCanvas || !brushCtx) return;
      const c = radius;

      brushCtx.clearRect(0, 0, diameter, diameter);
      brushCtx.globalCompositeOperation = 'source-over';
      const grad = brushCtx.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.55, 'rgba(255,255,255,0.82)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      brushCtx.fillStyle = grad;
      brushCtx.fillRect(0, 0, diameter, diameter);

      brushCtx.globalCompositeOperation = 'source-in';
      brushCtx.drawImage(coverCanvas, x - c, y - c, diameter, diameter, 0, 0, diameter, diameter);

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(brushCanvas, x - c, y - c);
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      cw = Math.round(rect.width * DPR);
      ch = Math.round(rect.height * DPR);
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      buildCover();
    }

    function onPointerMove(e) {
      if (prefersReduced || !ready) return;

      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) * DPR;
      const py = (e.clientY - rect.top) * DPR;

      if (px < -radius || py < -radius || px > cw + radius || py > ch + radius) {
        last = null;
        return;
      }

      if (!last) {
        last = { x: px, y: py };
        points.push({ x: px, y: py });
        return;
      }

      const dx = px - last.x;
      const dy = py - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.max(radius * 0.3, 1);
      const n = Math.min(Math.ceil(dist / step), 60);

      for (let i = 1; i <= n; i++) {
        const t = i / n;
        points.push({ x: last.x + dx * t, y: last.y + dy * t });
      }
      last = { x: px, y: py };
    }

    function tick() {
      if (prefersReduced || !ready) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const drawing = points.length > 0;
      if (drawing) {
        idle = 0;
      } else {
        idle++;
        if (idle > FADE_FRAMES) {
          raf = requestAnimationFrame(tick);
          return;
        }
      }

      const fade = drawing ? DECAY : Math.min(DECAY + idle * 0.004, 0.5);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,' + fade + ')';
      ctx.fillRect(0, 0, cw, ch);

      if (drawing) {
        for (let i = 0; i < points.length; i++) {
          stamp(points[i].x, points[i].y);
        }
        points.length = 0;
      }

      if (idle === FADE_FRAMES) {
        ctx.clearRect(0, 0, cw, ch);
      }

      raf = requestAnimationFrame(tick);
    }

    function init() {
      buildBrush();
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }

    afterImg.onload = init;
    if (afterImg.complete && afterImg.naturalWidth) init();

    const ro = new ResizeObserver(() => {
      resize();
      buildBrush();
    });
    ro.observe(container);

    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
      afterImg.onload = null;
    };
  }, [reveal]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {base && (
        <img src={base} alt={alt} className="absolute inset-0 block h-full w-full object-cover" draggable={false} />
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      {hint && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
          {hint}
        </div>
      )}
    </div>
  );
}
