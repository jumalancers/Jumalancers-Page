import { useEffect, useRef } from "react";

/**
 * Retícula de puntos que se ilumina alrededor del cursor.
 * - No corre en dispositivos táctiles (sin hover/puntero fino) ni con prefers-reduced-motion.
 * - Solo dibuja cuando el mouse se mueve: el requestAnimationFrame se programa
 *   bajo demanda y se detiene en reposo (cero CPU sin interacción).
 */
export default function BackgroundDots({
  spacing = 46,
  baseAlpha = 0.06,
  hoverAlpha = 0.22,
  radius = 1.1,
  hoverRadius = 2.4,
  influence = 140,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));

    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: 0, y: 0, inside: false };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    };

    const offset = spacing / 2;

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      if (!mouse.inside) return;

      // Solo recorre la zona de influencia (más un margen) para pintar el brillo;
      // fuera de ella los puntos quedan con baseAlpha.
      ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
      ctx.beginPath();
      for (let y = offset; y < h; y += spacing) {
        for (let x = offset; x < w; x += spacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          if (dx * dx + dy * dy < influence * influence) continue;
          ctx.moveTo(x + radius, y);
          ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      const x0 = Math.max(offset, offset + Math.ceil((mouse.x - influence - offset) / spacing) * spacing);
      const y0 = Math.max(offset, offset + Math.ceil((mouse.y - influence - offset) / spacing) * spacing);
      for (let y = y0; y < Math.min(h, mouse.y + influence); y += spacing) {
        for (let x = x0; x < Math.min(w, mouse.x + influence); x += spacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= influence) continue;
          const t = 1 - dist / influence;
          ctx.beginPath();
          ctx.arc(x, y, radius + t * (hoverRadius - radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${baseAlpha + t * (hoverAlpha - baseAlpha)})`;
          ctx.fill();
        }
      }
    };

    function schedule() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
      schedule();
    };

    const onLeave = () => {
      mouse.inside = false;
      schedule();
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [spacing, baseAlpha, hoverAlpha, radius, hoverRadius, influence]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
