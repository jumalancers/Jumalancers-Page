import { useEffect, useRef, useState } from "react";

/**
 * Reveal: anima a sus hijos (fade + subir) cuando entran al viewport.
 * Uso: <Reveal delay={120}> ...contenido... </Reveal>
 * - as: etiqueta/elemento contenedor (div por defecto)
 * - delay: retraso en ms (para escalonar tarjetas)
 *
 * SSR/SEO: el HTML prerenderizado sale con data-reveal pero SIN ocultar; el CSS
 * solo lo oculta bajo `html.js` (clase que agrega un script inline en index.html),
 * y ese script la retira si la app no llega a hidratar. Así nunca queda invisible.
 * Sin IntersectionObserver o con prefers-reduced-motion se muestra de inmediato.
 */
export default function Reveal({ children, as = "div", delay = 0, className = "", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={(shown ? "is-visible " : "") + className}
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
