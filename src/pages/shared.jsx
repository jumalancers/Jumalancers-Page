import { ChevronRight, Check, Plus, MessageCircle } from "lucide-react";
import { Button, Eyebrow } from "../components/ui/index.jsx";
import { waLink } from "../data/site.js";
import { PAGE_UI } from "../data/pages/services.js";
import { useLang } from "../i18n.jsx";

/** Migas visibles (el JSON-LD BreadcrumbList va en el <head>). */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-text-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-500/60" aria-hidden="true" />}
            {it.href ? (
              <a href={it.href} className="rounded transition hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                {it.label}
              </a>
            ) : (
              <span aria-current="page" className="text-text-700">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Encabezado de página interna: migas, eyebrow, h1 con acento y texto. */
export function PageHero({ crumbs, eyebrow, h1, accent, intro, children }) {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/3 rounded-full glow-orb text-primary-500/10"
      />
      <div className="container-x">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 flex max-w-3xl flex-col items-start gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-text-900 text-balance sm:text-5xl lg:text-6xl">
            {h1} <span className="accent-serif text-[1.06em]">{accent}</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-text-500 text-pretty sm:text-lg">{intro}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Botones de contacto: cotizador del inicio + WhatsApp. */
export function ContactButtons({ waText }) {
  const { lang, homeHref } = useLang();
  const ui = PAGE_UI[lang];
  return (
    <div className="flex w-full flex-col gap-3 min-[460px]:w-auto min-[460px]:flex-row">
      <Button href={homeHref("#quote")} size="lg" arrow>
        {ui.quote}
      </Button>
      <Button href={waLink(waText)} target="_blank" rel="noopener" variant="secondary" size="lg">
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {ui.whatsapp}
      </Button>
    </div>
  );
}

export function CheckList({ items }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 text-[15px] leading-snug text-text-700">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-500/15 text-primary-300">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

const DETAILS_CLS = [
  "group card overflow-hidden transition-colors duration-300",
  "open:border-primary-400/25 open:bg-white/[0.04] hover:border-white/15",
  "[interpolate-size:allow-keywords]",
  "[&::details-content]:h-0 [&::details-content]:overflow-hidden",
  "[&::details-content]:[transition:height_.35s_ease,content-visibility_.35s_allow-discrete]",
  "open:[&::details-content]:h-auto",
  "motion-reduce:[&::details-content]:transition-none",
].join(" ");

/** Preguntas frecuentes de la página (el FAQPage va en el JSON-LD del <head>). */
export function PageFaq({ title, items }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{title}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {items.map(({ q, a }, i) => (
          <details key={q} name="page-faq" className={DETAILS_CLS} open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400 sm:p-6 [&::-webkit-details-marker]:hidden">
              <h3 className="font-display text-base font-medium leading-snug tracking-tight text-text-900 sm:text-lg">{q}</h3>
              <span
                aria-hidden="true"
                className="-my-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-text-500 transition duration-300 group-open:rotate-45 group-open:border-primary-400/40 group-open:bg-primary-500/15 group-open:text-primary-300 motion-reduce:transition-none"
              >
                <Plus className="h-4 w-4" />
              </span>
            </summary>
            <div className="px-5 pb-6 pr-12 sm:px-6 sm:pr-16">
              <p className="text-[15px] leading-relaxed text-text-500 text-pretty sm:text-base">{a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
