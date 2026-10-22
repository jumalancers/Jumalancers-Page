import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, Sparkles, ShieldCheck, Calculator, Wrench } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader } from "../components/ui/index.jsx";
import { waLink } from "../data/site.js";

// Precios en USD (se muestran tal cual; no cambiar sin el dueño).
const PLANS = [
  { key: "starter", n: 1, price: "$599" },
  { key: "business", n: 2, price: "$1,199", featured: true },
  { key: "premium", n: 3, price: "$1,999" },
  { key: "systems", n: 4, price: "$2,999", from: true },
];

const FEATURED_INDEX = PLANS.findIndex((p) => p.featured);

function FeatureList({ items, featured }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((it) => {
        // Líneas que terminan en ":" ("Todo lo de Starter, más:") = etiqueta de grupo
        if (it.trim().endsWith(":")) {
          return (
            <li
              key={it}
              className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                featured ? "text-primary-200" : "text-text-300"
              }`}
            >
              {it}
            </li>
          );
        }
        return (
          <li key={it} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                featured
                  ? "bg-primary-400 text-[hsl(167,60%,6%)]"
                  : "bg-primary-500/12 text-primary-300 ring-1 ring-inset ring-primary-400/25"
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="leading-relaxed text-text-700">{it}</span>
          </li>
        );
      })}
    </ul>
  );
}

function PlanCard({ plan, t }) {
  const { key, n, price, featured, from } = plan;
  const name = t(`plans.cards.${key}.name`);
  const items = t(`plans.cards.${key}.items`);

  const inner = (
    <div
      className={`relative flex h-full flex-col rounded-[calc(1.5rem-1px)] p-5 min-[400px]:p-6 sm:p-7 ${
        featured
          ? "bg-[linear-gradient(180deg,hsl(167_45%_11%),hsl(167_47%_7%))]"
          : ""
      }`}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-[inherit] bg-[radial-gradient(60%_100%_at_50%_0%,hsl(165_55%_50%/0.18),transparent)]"
        />
      )}

      <div className="relative flex items-center justify-between gap-3">
        <p
          className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] ${
            featured ? "text-primary-300" : "text-text-300"
          }`}
        >
          {t("plans.labels.plan")} 0{n}
        </p>
        {featured && (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[hsl(167,60%,6%)] shadow-[0_6px_20px_-6px] shadow-primary-400/60">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {t("plans.labels.recommended")}
          </span>
        )}
      </div>

      <h3 className="relative mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-text-900">
        {name}
      </h3>
      <p className="relative mt-2 min-h-[3.75rem] text-sm xl:min-h-[5.75rem] leading-relaxed text-text-500">
        {t(`plans.cards.${key}.desc`)}
      </p>

      <div className="relative mt-6 border-t border-white/8 pt-6">
        <p className="text-xs font-medium text-text-300">
          {from ? t("plans.labels.from") : t("plans.labels.investment")}
        </p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-text-900 tabular-nums">
            {price}
          </span>
          <span className="text-sm font-medium text-text-300">
            {t("plans.labels.currency")}
          </span>
        </p>
        <p className="mt-3 text-[13px] text-text-300 sm:text-xs">{t(`plans.cards.${key}.renewal`)}</p>
      </div>

      <a
        href={waLink(t(`plans.wa.${key}`))}
        target="_blank"
        rel="noopener"
        aria-label={`${t(`plans.ctas.${key}`)} — ${t("plans.labels.viaWhatsApp")}`}
        className={`group/btn relative mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50 active:scale-[0.98] ${
          featured
            ? "bg-primary-400 text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/60 hover:bg-primary-300"
            : "border border-white/12 bg-white/[0.04] text-text-900 hover:border-primary-400/40 hover:bg-primary-500/10"
        }`}
      >
        {t(`plans.ctas.${key}`)}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
          aria-hidden="true"
        />
      </a>

      <div className="relative mt-7 flex-1">
        <FeatureList items={items} featured={featured} />
      </div>
    </div>
  );

  return featured ? (
    // Borde degradado menta: wrapper con padding de 1px
    <div className="relative h-full rounded-3xl bg-[linear-gradient(160deg,hsl(165_50%_62%),hsl(165_55%_50%/0.35)_40%,rgb(255_255_255/0.06))] p-px shadow-[0_30px_80px_-30px] shadow-primary-500/40 transition duration-300 motion-safe:hover:-translate-y-1">
      {inner}
    </div>
  ) : (
    <div className="card h-full rounded-3xl! transition duration-300 hover:border-white/15 motion-safe:hover:-translate-y-1">
      {inner}
    </div>
  );
}

export default function Plans() {
  const { t } = useLang();
  const trackRef = useRef(null);
  const [active, setActive] = useState(FEATURED_INDEX);

  // Móvil: el carrusel arranca centrado en el plan recomendado y
  // actualiza el indicador según la tarjeta visible.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const isCarousel = () => el.scrollWidth > el.clientWidth + 4;
    const centerOn = (i) => {
      const card = el.children[i];
      if (!card) return;
      el.scrollLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    };
    if (isCarousel()) centerOn(FEATURED_INDEX);

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTo = (i) => {
    const el = trackRef.current;
    const card = el?.children[i];
    if (!card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <Section id="plans" className="isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[480px] w-[720px] max-w-full -translate-x-1/2 rounded-full glow-orb text-primary-500/10" />
      </div>

      <SectionHeader
        eyebrow={t("plans.badge")}
        title={t("plans.title")}
        accent={t("plans.titleAccent")}
        desc={t("plans.desc")}
      />

      <Reveal delay={80} className="mt-6 flex justify-center">
        <p className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2 text-left text-[13px] leading-snug text-text-500 sm:rounded-full sm:text-sm">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
          {t("plans.included")}
        </p>
      </Reveal>

      <p className="sr-only md:hidden">{t("plans.swipeHint")}</p>

      {/* Móvil: carrusel con scroll-snap. md: 2x2. xl: 4 columnas. */}
      <Reveal>
      <div
        ref={trackRef}
        className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 pt-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className="w-[86%] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none"
          >
            <PlanCard plan={plan} t={t} />
          </div>
        ))}
      </div>
      </Reveal>

      {/* Indicadores del carrusel (solo móvil) */}
      <div className="mt-3 flex justify-center md:hidden">
        {PLANS.map((p, i) => (
          <button
            key={p.key}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${t("plans.labels.goToPlan")} ${t(`plans.cards.${p.key}.name`)}`}
            aria-current={active === i ? "true" : undefined}
            className="grid h-10 w-8 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                active === i ? "w-5 bg-primary-400" : "w-1.5 bg-white/20"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Mantenimiento después del lanzamiento */}
      <Reveal className="mt-10">
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 shrink-0 text-primary-300" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-text-900">
              {t("plans.care.title")}
            </h3>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {t("plans.care.items").map((it) => (
              <li key={it.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-sm text-text-500">{it.name}</p>
                <p className="mt-1 font-display text-xl font-semibold text-text-900 tabular-nums">{it.price}</p>
                <p className="mt-1 text-sm leading-snug text-text-300">{it.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="mt-10 flex justify-center">
        <a
          href="#quote"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-left text-sm font-medium text-text-500 transition hover:text-text-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          <Calculator className="h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
          {t("plans.compareCta")}
          <ArrowRight
            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </Reveal>
    </Section>
  );
}
