import { useEffect, useRef } from "react";

export default function BackgroundDots({
  spacing = 46, // distancia entre puntos
  baseAlpha = 0.06, // qué tanto se ven "en reposo" (muy bajo)
  hoverAlpha = 0.22, // brillo cerca del mouse
  radius = 1.1, // tamaño base del punto
  hoverRadius = 2.4, // tamaño cuando se ilumina
  influence = 140, // radio de influencia del mouse
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let w = 0,
      h = 0;
    const mouse = { x: 0, y: 0, inside: false };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    };

    const onLeave = () => {
      mouse.inside = false;
      ctx.clearRect(0, 0, w, h); // limpia completamente
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // Color ultra sutil (blanco). Si quieres tu accent, te digo abajo cómo.
    const color = (a) => `rgba(255,255,255,${a})`;

    // “Offset” para que la cuadrícula no quede pegada a las orillas
    const offsetX = spacing / 2;
    const offsetY = spacing / 2;

    let raf = 0;
    const draw = () => {
      // Si el mouse no está dentro, no dibujes nada
      if (!mouse.inside) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (let y = offsetY; y < h; y += spacing) {
        for (let x = offsetX; x < w; x += spacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const t = Math.max(0, 1 - dist / influence);

          const a = baseAlpha + t * (hoverAlpha - baseAlpha);
          const r = radius + t * (hoverRadius - radius);

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color(a);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [spacing, baseAlpha, hoverAlpha, radius, hoverRadius, influence]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none", // importantísimo para no bloquear clicks
      }}
    />
  );
}
