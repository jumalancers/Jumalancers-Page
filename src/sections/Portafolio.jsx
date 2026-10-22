import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, MapPin, Calendar, X, Layers3, Quote, Plus } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader, Button } from "../components/ui/index.jsx";
import { PROJECTS, shot } from "../data/projects.js";

/* Dimensiones reales de las capturas en /public/work */
const DIM = {
  desktop: [1440, 900],
  "desktop-720": [720, 450],
  mobile: [390, 844],
  long: [960, 1600],
};

const CONCEPTS = [
  { id: "qrmenu", url: "https://jumalancers.github.io/Qr-menu/", w: 960, h: 502 },
  { id: "coffee", url: "https://jumalancers.github.io/Lading-caffe/", w: 960, h: 568 },
  { id: "comingsoon", url: "https://jumalancers.github.io/Coming-soon/", w: 960, h: 568 },
];

const lower1 = (s = "") => s.charAt(0).toLowerCase() + s.slice(1);
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

/* ---------- Banderas SVG inline ---------- */
function FlagMX({ className = "" }) {
  return (
    <svg viewBox="0 0 18 12" className={className} aria-hidden="true">
      <rect width="6" height="12" fill="#006847" />
      <rect x="6" width="6" height="12" fill="#fff" />
      <rect x="12" width="6" height="12" fill="#ce1126" />
      <circle cx="9" cy="6" r="1.4" fill="#8c5a2b" />
    </svg>
  );
}
function FlagUS({ className = "" }) {
  return (
    <svg viewBox="0 0 19 12" className={className} aria-hidden="true">
      <rect width="19" height="12" fill="#b22234" />
      {[1, 3, 5, 7, 9, 11].map((y) => (
        <rect key={y} y={(y * 12) / 13} width="19" height={12 / 13} fill="#fff" />
      ))}
      <rect width="7.6" height={(12 * 7) / 13} fill="#3c3b6e" />
    </svg>
  );
}
const MarketFlag = ({ market, className = "h-3 w-[18px] rounded-[2px]" }) =>
  market === "mx" ? <FlagMX className={className} /> : <FlagUS className={className} />;

/* ---------- Piezas visuales ---------- */
function BrowserBar({ url }) {
  const host = url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return (
    <div className="flex h-8 shrink-0 items-center gap-3 border-b border-white/8 bg-[hsl(167,30%,9%)] px-3">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="mx-auto flex h-5 min-w-0 max-w-[60%] flex-1 items-center justify-center truncate rounded-md bg-white/[0.06] px-3 text-[11px] text-text-300">
        {host}
      </div>
      <span className="w-[42px]" aria-hidden="true" />
    </div>
  );
}

function PhoneFrame({ src, alt, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.4rem] border-[3px] border-[hsl(167,20%,16%)] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        width={DIM.mobile[0]}
        height={DIM.mobile[1]}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}

/* Navegador cuya captura larga se desplaza suave al hacer hover */
function ScrollingBrowser({ project, alt, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-bg-100 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] ${className}`}
    >
      <BrowserBar url={project.url} />
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={shot(project.id, "long")}
          alt={alt}
          width={DIM.long[0]}
          height={DIM.long[1]}
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-0 h-auto w-full translate-y-0 transition-transform duration-[4000ms] ease-in-out will-change-transform group-hover/shot:-translate-y-[62.5%] motion-reduce:transition-none motion-reduce:group-hover/shot:translate-y-0"
        />
      </div>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium leading-none text-text-500">
      {children}
    </span>
  );
}

function ExternalLink({ href, label, srHint, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`group/link inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-primary-300 transition hover:text-primary-200 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary-400 ${className}`}
    >
      {label}
      <span className="sr-only"> {srHint}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}

/* ---------- Destacado (grande) ---------- */
function FeaturedProject({ project, index, onOpen, tx, t, altFor }) {
  const reverse = index % 2 === 1;
  const features = tx(project.features) || [];
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={`relative lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
        <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] glow-orb text-primary-500/10" />
        <button
          type="button"
          onClick={(e) => onOpen(project, e.currentTarget)}
          className="group/shot relative block w-full pb-8 pr-6 text-left focus:outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-4 focus-visible:ring-offset-bg-50 sm:pr-10"
          aria-label={`${t("portfolio.viewCase")}: ${project.name}`}
        >
          <ScrollingBrowser project={project} alt={altFor(project)} className="transition duration-500 group-hover/shot:border-primary-400/30" />
          <PhoneFrame
            src={shot(project.id, "mobile")}
            alt={altFor(project, true)}
            className="absolute bottom-0 right-0 w-[24%] min-w-[78px] max-w-[150px] transition-transform duration-500 group-hover/shot:-translate-y-2 motion-reduce:transition-none"
          />
        </button>
      </div>

      <div className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{tx(project.industry)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-text-300">
          <span className="inline-flex items-center gap-1.5">
            <MarketFlag market={project.market} />
            {project.location}
          </span>
          {project.year ? (
            <>
              <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
              <span>{project.year}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-text-500 text-pretty">{tx(project.summary)}</p>

        {features.length ? (
          <ul className="mt-5 grid gap-2 text-sm text-text-700">
            {features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack?.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button size="sm" variant="secondary" onClick={(e) => onOpen(project, e.currentTarget)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("portfolio.viewCase")}
          </Button>
          <ExternalLink href={project.url} label={t("portfolio.viewSite")} srHint={`${project.name} ${t("portfolio.opensNewTab")}`} />
        </div>
      </div>
    </article>
  );
}

/* ---------- Tarjeta del grid ---------- */
function ProjectCard({ project, onOpen, tx, t, altFor, wide = false }) {
  return (
    <article className={`card group relative flex h-full flex-col overflow-hidden p-2 transition duration-300 hover:-translate-y-1 hover:border-primary-400/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${wide ? "lg:flex-row lg:items-stretch lg:gap-2" : ""}`}>
      <div className={`relative overflow-hidden rounded-[0.9rem] border border-white/8 bg-bg-100 ${wide ? "lg:w-[58%] lg:shrink-0" : ""}`}>
        <div className={`aspect-[16/10] overflow-hidden ${wide ? "lg:h-full" : ""}`}>
          <img
            src={shot(project.id, "desktop-720")}
            srcSet={`${shot(project.id, "desktop-720")} 720w, ${shot(project.id, "desktop")} 1440w`}
            sizes={wide ? "(min-width: 1024px) 640px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"}
            alt={altFor(project)}
            width={DIM["desktop-720"][0]}
            height={DIM["desktop-720"][1]}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[hsl(167,47%,6%)]/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-700 backdrop-blur">
          <MarketFlag market={project.market} className="h-2.5 w-[15px] rounded-[1px]" />
          {project.market === "mx" ? "MX" : "US"}
        </span>
      </div>

      <div className={`flex flex-1 flex-col px-3 pb-3 pt-4 ${wide ? "lg:justify-center lg:px-6" : ""}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-300">{tx(project.industry)}</p>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-text-900">
          <button
            type="button"
            onClick={(e) => onOpen(project, e.currentTarget)}
            className="text-left after:absolute after:inset-0 after:rounded-[1.25rem] after:content-[''] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary-400"
          >
            {project.name}
          </button>
        </h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-300">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {project.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack?.slice(0, 3).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {project.stack?.length > 3 ? <Chip>+{project.stack.length - 3}</Chip> : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xs text-text-300">{project.kind ? t(`portfolio.kind.${project.kind}`) : ""}</span>
          <ExternalLink
            href={project.url}
            label={t("portfolio.viewSite")}
            srHint={`${project.name} ${t("portfolio.opensNewTab")}`}
            className="relative z-10"
          />
        </div>
      </div>
    </article>
  );
}

/* ---------- Modal de detalle ---------- */
function ProjectModal({ project, onClose, onPrev, onNext, tx, t, altFor }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = `pf-modal-title-${project.id}`;
  const features = tx(project.features) || [];

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
    dialogRef.current?.querySelector("[data-scroll]")?.scrollTo(0, 0);
  }, [project.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-[hsl(167,52%,3%)]/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-bg-50 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:rounded-3xl"
      >
        {/* Cabecera */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-300">
              {tx(project.industry)}
            </p>
            <h3 id={titleId} className="truncate font-display text-lg font-semibold tracking-[-0.02em] text-text-900 sm:text-2xl">
              {project.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {onPrev ? (
              <button type="button" onClick={onPrev} aria-label={t("portfolio.modal.prev")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-text-700 transition hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
            {onNext ? (
              <button type="button" onClick={onNext} aria-label={t("portfolio.modal.next")} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-text-700 transition hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
            <button ref={closeRef} type="button" onClick={onClose} aria-label={t("portfolio.modal.close")} className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-white/8 text-text-900 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div data-scroll className="flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          <div className="border-b border-white/8 bg-[radial-gradient(ellipse_at_top,hsl(165_65%_45%/0.12),transparent_70%)] px-4 pb-6 pt-5 sm:px-8 sm:pt-8">
            <div className="flex items-end gap-4 sm:gap-6">
              <figure className="min-w-0 flex-1">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-bg-100">
                  <BrowserBar url={project.url} />
                  <div className="aspect-[16/10] overflow-y-auto" tabIndex={0} aria-label={`${project.name} — ${t("portfolio.modal.desktop")}`}>
                    <img
                      src={shot(project.id, "long")}
                      alt={altFor(project)}
                      width={DIM.long[0]}
                      height={DIM.long[1]}
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </div>
                </div>
                <figcaption className="mt-2 text-center text-[11px] uppercase tracking-[0.14em] text-text-300">
                  {t("portfolio.modal.desktop")}
                </figcaption>
              </figure>
              <figure className="w-[26%] max-w-[170px] shrink-0">
                <PhoneFrame src={shot(project.id, "mobile")} alt={altFor(project, true)} />
                <figcaption className="mt-2 text-center text-[11px] uppercase tracking-[0.14em] text-text-300">
                  {t("portfolio.modal.mobile")}
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="grid gap-8 px-4 py-6 sm:px-8 sm:py-8 md:grid-cols-5">
            <div className="md:col-span-3">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-300">{t("portfolio.modal.summary")}</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-text-700 text-pretty">{tx(project.summary)}</p>

              {features.length ? (
                <>
                  <h4 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-300">{t("portfolio.modal.features")}</h4>
                  <ul className="mt-3 grid gap-2.5 text-sm text-text-700 sm:grid-cols-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {project.testimonial ? (
                <figure className="card mt-8 p-5">
                  <Quote className="h-5 w-5 text-primary-400" aria-hidden="true" />
                  <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-text-900">
                    “{tx(project.testimonial)}”
                  </blockquote>
                  {project.testimonial.author ? (
                    <figcaption className="mt-3 text-sm text-text-300">— {project.testimonial.author}</figcaption>
                  ) : null}
                </figure>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <dl className="card divide-y divide-white/8 text-sm">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="inline-flex items-center gap-2 text-text-300"><MapPin className="h-4 w-4" aria-hidden="true" />{t("portfolio.modal.location")}</dt>
                  <dd className="inline-flex items-center gap-2 text-right text-text-900"><MarketFlag market={project.market} />{project.location}</dd>
                </div>
                {project.year ? (
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <dt className="inline-flex items-center gap-2 text-text-300"><Calendar className="h-4 w-4" aria-hidden="true" />{t("portfolio.modal.year")}</dt>
                    <dd className="text-text-900">{project.year}</dd>
                  </div>
                ) : null}
                <div className="px-4 py-3">
                  <dt className="inline-flex items-center gap-2 text-text-300"><Layers3 className="h-4 w-4" aria-hidden="true" />{t("portfolio.modal.stack")}</dt>
                  <dd className="mt-2.5 flex flex-wrap gap-1.5">
                    {project.stack?.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-col gap-2.5">
                <Button href={project.url} target="_blank" rel="noopener" size="md" className="w-full">
                  {t("portfolio.modal.visit")}
                  <span className="sr-only"> {project.name} {t("portfolio.opensNewTab")}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="#quote" variant="secondary" size="md" className="w-full" onClick={onClose} arrow>
                  {t("portfolio.modal.startSimilar")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ---------- Sección ---------- */
// Destacados en filas grandes; el resto (no "featured") en grid de tarjetas.
const FEATURED = PROJECTS.filter((p) => p.featured);
const REST = PROJECTS.filter((p) => !p.featured);
const ORDERED = [...FEATURED, ...REST];

export default function Portafolio() {
  const { t, lang } = useLang();
  const [activeId, setActiveId] = useState(null);
  const triggerRef = useRef(null);

  const tx = useCallback((v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v), [lang]);

  const altFor = useCallback(
    (p, mobile = false) =>
      fill(t(mobile ? "portfolio.altMobile" : "portfolio.altTemplate"), {
        name: p.name,
        industry: lower1(tx(p.industry)),
        location: p.location,
      }),
    [t, tx]
  );


  const activeIndex = ORDERED.findIndex((p) => p.id === activeId);
  const active = activeIndex >= 0 ? ORDERED[activeIndex] : null;

  const open = useCallback((p, el) => {
    triggerRef.current = el || null;
    setActiveId(p.id);
  }, []);
  const close = useCallback(() => {
    setActiveId(null);
    const el = triggerRef.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, []);
  const go = useCallback(
    (dir) => {
      if (activeIndex < 0) return;
      const next = ORDERED[(activeIndex + dir + ORDERED.length) % ORDERED.length];
      setActiveId(next.id);
    },
    [activeIndex]
  );
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  return (
    <Section id="portfolio" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full glow-orb text-primary-500/10" />
      </div>

      <SectionHeader
        eyebrow={t("portfolio.eyebrow")}
        title={t("portfolio.title")}
        accent={t("portfolio.accent")}
        desc={t("portfolio.desc")}
      />

      {/* Destacados */}
      {FEATURED.length ? (
        <div className="mt-14 space-y-20 sm:mt-16 lg:space-y-28">
          {FEATURED.map((p, i) => (
            <Reveal key={p.id}>
              <FeaturedProject project={p} index={i} onOpen={open} tx={tx} t={t} altFor={altFor} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {/* Resto */}
      {REST.length ? (
        <div className="mt-20 lg:mt-28">
          <Reveal className="flex items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-300">{t("portfolio.moreLabel")}</p>
            <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" aria-hidden="true" />
          </Reveal>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REST.map((p, i) => {
              // Completa la última fila en 3 columnas: tarjetas anchas (2 columnas) al inicio/final
              const rem = REST.length % 3;
              const wide = REST.length > 1 && ((rem === 2 && i === 0) || (rem === 1 && (i === 0 || i === REST.length - 1)));
              return (
              <Reveal as="li" key={p.id} delay={(i % 3) * 70} className={`h-full ${wide ? "lg:col-span-2" : ""}`}>
                <ProjectCard project={p} onOpen={open} tx={tx} t={t} altFor={altFor} wide={wide} />
              </Reveal>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Propuestas visuales */}
      <div className="mt-20 lg:mt-28">
        <Reveal className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text-900">{t("portfolio.concepts.title")}</h3>
            <p className="mt-1 text-sm text-text-300">{t("portfolio.concepts.desc")}</p>
          </div>
        </Reveal>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONCEPTS.map((c, i) => {
            const item = t(`portfolio.concepts.items.${c.id}`);
            return (
              <Reveal as="li" key={c.id} delay={i * 70} className="min-w-0">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener"
                  className="card group flex h-full items-center gap-3 p-2 pr-3 transition hover:border-primary-400/25 min-[400px]:gap-4 min-[400px]:pr-4 sm:flex-col sm:items-stretch sm:gap-3 sm:pr-2 lg:flex-row lg:items-center lg:gap-4 lg:pr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <span className="block w-24 shrink-0 overflow-hidden rounded-[0.8rem] border border-white/8 bg-bg-100 min-[400px]:w-28 sm:w-full lg:w-28">
                    <img
                      src={`/work/concept-${c.id}.webp`}
                      alt={`${item.name} — ${item.tag}, Jumalancers`}
                      width={c.w}
                      height={c.h}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </span>
                  <span className="min-w-0 flex-1 sm:px-2 sm:pb-1 lg:px-0 lg:pb-0">
                    <span className="line-clamp-2 block text-sm font-semibold leading-snug text-text-900">{item.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-text-300 sm:text-xs">{item.tag}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-text-300 sm:hidden lg:block transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-300" aria-hidden="true" />
                  <span className="sr-only">{t("portfolio.opensNewTab")}</span>
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {/* CTA */}
      <Reveal className="card relative mt-16 overflow-hidden p-6 sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full glow-orb text-primary-500/15" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-lg font-medium leading-relaxed text-text-900 text-balance sm:text-xl">
            {t("portfolio.bottomText")}
          </p>
          <Button href="#quote" size="lg" arrow className="shrink-0">
            {t("portfolio.bottomCta")}
          </Button>
        </div>
      </Reveal>

      {active ? (
        <ProjectModal
          project={active}
          onClose={close}
          onPrev={ORDERED.length > 1 ? prev : null}
          onNext={ORDERED.length > 1 ? next : null}
          tx={tx}
          t={t}
          altFor={altFor}
        />
      ) : null}
    </Section>
  );
}
