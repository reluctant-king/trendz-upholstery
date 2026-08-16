import { useEffect, useRef, useState } from 'react';

const HOVERABLE = 'a, button, [role="button"], input, textarea, select, label, summary, .group, img, [data-cursor]';

export default function CursorGlow() {
  const [fine, setFine] = useState(false);
  const dotRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    setFine(
      window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    let raf;
    let targetX = -100;
    let targetY = -100;
    let x = -100;
    let y = -100;
    let hover = 0;
    let hoverTarget = 0;
    let seen = false;

    const show = () => {
      if (seen) return;
      seen = true;
      dot.style.opacity = '1';
      glow.style.opacity = '1';
    };

    const hide = () => {
      seen = false;
      dot.style.opacity = '0';
      glow.style.opacity = '0';
    };

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      show();
    };

    const onOver = (e) => {
      const interactive = e.target.closest?.(HOVERABLE);
      hoverTarget = interactive ? 1 : 0;
    };

    const onLeaveDoc = (e) => {
      if (!e.relatedTarget) hide();
    };

    const loop = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      hover += (hoverTarget - hover) * 0.18;

      dot.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%) scale(${1 - hover * 0.3})`;
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${0.6 + hover * 0.75})`;

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true, capture: true });
    document.addEventListener('mouseleave', onLeaveDoc);

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseleave', onLeaveDoc);
      cancelAnimationFrame(raf);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div className="cursor-fx" aria-hidden="true">
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[9990] h-44 w-44 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 195, 0, 0.35) 0%, rgba(255, 195, 0, 0.12) 45%, transparent 70%)',
          transform: 'translate(-100px, -100px) translate(-50%, -50%)',
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9995] h-2 w-2 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: '#ffc300',
          boxShadow: '0 0 10px rgba(255, 195, 0, 0.85), 0 0 22px rgba(255, 195, 0, 0.45)',
          transform: 'translate(-100px, -100px) translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
