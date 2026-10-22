import { ArrowRight } from "lucide-react";
import Reveal from "../Reveal.jsx";

/**
 * Primitivas compartidas del rediseño. Todas las secciones las usan
 * para mantener el mismo ritmo, tipografía y estilo de botones.
 */

// <Section id="portfolio"> — envoltura con id (ancla), padding vertical y contenedor
export function Section({ id, className = "", containerClassName = "", children, ...rest }) {
  return (
    <section id={id} className={`relative section-y ${className}`} {...rest}>
      <div className={`container-x ${containerClassName}`}>{children}</div>
    </section>
  );
}

// Pastilla pequeña en mayúsculas sobre el título
export function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-300 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
      {children}
    </span>
  );
}

/**
 * Encabezado de sección.
 * title: texto principal; accent: fragmento final en serif itálica verde.
 * as: "h2" por defecto (solo el Hero usa h1).
 */
export function SectionHeader({
  eyebrow,
  title,
  accent,
  desc,
  align = "center",
  as = "h2",
  className = "",
}) {
  const H = as;
  const alignCls = align === "center" ? "mx-auto text-center items-center" : "items-start text-left";
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <H className="font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-text-900 text-balance sm:text-4xl lg:text-5xl">
        {title}
        {accent && (
          <>
            {" "}
            <span className="accent-serif text-[1.08em]">{accent}</span>
          </>
        )}
      </H>
      {desc && (
        <p className="max-w-2xl text-base leading-relaxed text-text-500 text-pretty sm:text-lg">{desc}</p>
      )}
    </Reveal>
  );
}

const BTN_BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const BTN_VARIANTS = {
  primary:
    "bg-primary-400 text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 hover:bg-primary-300",
  secondary: "border border-white/15 bg-white/[0.04] text-text-900 backdrop-blur hover:bg-white/10 hover:border-white/25",
  ghost: "text-text-700 hover:text-text-900 hover:bg-white/5",
};

const BTN_SIZES = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-13 px-7 py-3 text-base",
};

/**
 * Botón/enlace. Si recibe href se renderiza como <a>.
 * arrow: muestra flecha animada al final.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  children,
  ...rest
}) {
  const cls = `${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </>
  );
  return href ? (
    <a href={href} className={cls} {...rest}>
      {content}
    </a>
  ) : (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
