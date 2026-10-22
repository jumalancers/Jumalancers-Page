import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarCheck,
  CalendarRange,
  Check,
  Clock,
  Compass,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  FolderCheck,
  Hourglass,
  Languages,
  Layers3,
  LayoutDashboard,
  LoaderCircle,
  Mail,
  MessageCircle,
  Minus,
  Newspaper,
  PenLine,
  Plug,
  Plus,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader } from "../components/ui/index.jsx";
import { waLink } from "../data/site.js";
import {
  ADVANCED_SYSTEM_KEY,
  DEFAULT_ANSWERS,
  EMAIL_PRICE,
  FEATURE_KEYS,
  PAGES_OPTIONS,
  SECTIONS_OPTIONS,
  SUPPORT_OPTIONS,
  TIMELINE_OPTIONS,
  buildSummary,
  computeQuote,
  featureI18nKey,
  formatUSD,
  multiplierLabel,
  normalizeEmails,
  planName,
  priceText,
} from "./quote/engine.js";

/**
 * Cotizador instantáneo (wizard de 5 pasos + estimación en vivo + PDF).
 * - Toda la lógica de precios/tiempos vive en ./quote/engine.js (pura).
 * - El PDF (jspdf) se carga con import() dinámico solo al pedirlo.
 */

const STEP_KEYS = ["structure", "functionality", "support", "infra", "time"];

const FEATURE_ICONS = {
  blog: Newspaper,
  multilanguage: Languages,
  booking: CalendarCheck,
  payments: CreditCard,
  dashboard_simple: LayoutDashboard,
  [ADVANCED_SYSTEM_KEY]: Boxes,
  integrations: Plug,
};
const SUPPORT_ICONS = { ready: FolderCheck, guidance: Compass, full: PenLine };
const TIMELINE_ICONS = { flexible: Hourglass, standard: CalendarRange, accelerated: Zap };

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50";

// Cargador perezoso del módulo de PDF (comparte la promesa entre clics)
let pdfModulePromise = null;
function loadPdfModule() {
  if (!pdfModulePromise) {
    pdfModulePromise = import("./quote/pdf.js").catch((err) => {
      pdfModulePromise = null;
      throw err;
    });
  }
  return pdfModulePromise;
}
const preloadPdf = () => {
  loadPdfModule().catch(() => {});
};

/* ------------------------------------------------------------------ */
/* Controles                                                           */
/* ------------------------------------------------------------------ */

/** Grupo de opciones exclusivas (role=radiogroup) con flechas de teclado. */
function RadioCards({ labelId, options, value, onChange, className = "", renderOption }) {
  const refs = useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.id === value));

  const onKeyDown = (e) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const nextIdx = (idx + dir + options.length) % options.length;
    onChange(options[nextIdx].id);
    refs.current[nextIdx]?.focus();
  };

  return (
    <div role="radiogroup" aria-labelledby={labelId} onKeyDown={onKeyDown} className={className}>
      {options.map((o, i) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={`group relative w-full rounded-2xl border text-left transition duration-200 active:scale-[0.99] ${FOCUS_RING} ${
              active
                ? "border-primary-400/70 bg-primary-500/[0.09] shadow-[0_0_0_1px] shadow-primary-400/40"
                : "border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          >
            {renderOption(o, active)}
          </button>
        );
      })}
    </div>
  );
}

function RadioDot({ active }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
        active ? "border-primary-400 bg-primary-400" : "border-white/25 group-hover:border-white/40"
      }`}
    >
      <Check
        className={`h-3 w-3 text-[hsl(167,60%,6%)] transition ${active ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        strokeWidth={3.5}
      />
    </span>
  );
}

function IconBadge({ icon, active }) {
  const Icon = icon;
  return (
    <span
      aria-hidden="true"
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
        active
          ? "border-primary-400/40 bg-primary-400/15 text-primary-200"
          : "border-white/8 bg-white/[0.04] text-text-300 group-hover:text-text-500"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
}

/** Tarjeta de opción tipo checkbox (input real, accesible). */
function FeatureCard({ id, icon, checked, onChange, label, note }) {
  return (
    <label
      htmlFor={id}
      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-400 active:scale-[0.99] ${
        checked
          ? "border-primary-400/70 bg-primary-500/[0.09] shadow-[0_0_0_1px] shadow-primary-400/40"
          : "border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <IconBadge icon={icon} active={checked} />
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-semibold ${checked ? "text-text-900" : "text-text-700"}`}>
          {label}
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-text-300 sm:text-xs">{note}</span>
      </span>
      <span
        aria-hidden="true"
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
          checked ? "border-primary-400 bg-primary-400" : "border-white/25 group-hover:border-white/40"
        }`}
      >
        <Check
          className={`h-3 w-3 text-[hsl(167,60%,6%)] transition ${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          strokeWidth={3.5}
        />
      </span>
    </label>
  );
}

function QuestionLabel({ id, children, hint }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h4 id={id} className="text-[15px] font-semibold text-text-900">
        {children}
      </h4>
      {hint && <span className="text-xs text-text-300">{hint}</span>}
    </div>
  );
}

function Hint({ children }) {
  return <p className="mt-3 text-[13px] leading-relaxed text-text-300 sm:text-xs">{children}</p>;
}

/** Contenedor con transición suave al cambiar de paso. */
function StepPanel({ children }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      className={`transition duration-300 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal de vista previa del PDF                                       */
/* ------------------------------------------------------------------ */

function PdfModal({ open, onClose, pdfUrl, error, onDownload, downloading, t }) {
  const closeRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      if (prevFocus && typeof prevFocus.focus === "function") prevFocus.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-end p-0 sm:place-items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="pointer-events-auto flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-bg-100 shadow-2xl sm:max-h-[88dvh] sm:rounded-3xl"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h3 id={titleId} className="text-lg font-semibold text-text-900">
                {t("quote.pdfPreviewTitle")}
              </h3>
              <p id={descId} className="mt-0.5 text-sm text-text-500">
                {t("quote.pdfPreviewDesc")}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("quote.close")}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-text-900 transition hover:bg-white/10 ${FOCUS_RING}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-300">
                  {t("quote.preview")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener"
                      className={`inline-flex h-10 items-center gap-2 rounded-full border border-white/12 px-4 text-sm font-medium text-text-700 transition hover:bg-white/5 ${FOCUS_RING}`}
                    >
                      {t("quote.openNewTab")}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={onDownload}
                    disabled={downloading}
                    className={`inline-flex h-10 items-center gap-2 rounded-full bg-primary-400 px-4 text-sm font-semibold text-[hsl(167,60%,6%)] transition hover:bg-primary-300 disabled:opacity-60 ${FOCUS_RING}`}
                  >
                    {t("quote.downloadPdf")}
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="h-[62dvh] bg-white/[0.02]">
                {pdfUrl ? (
                  <iframe title={t("quote.pdfPreviewTitle")} src={pdfUrl} className="h-full w-full" />
                ) : (
                  <div className="grid h-full w-full place-items-center" role="status">
                    <p className="inline-flex items-center gap-2 text-sm text-text-500">
                      {error ? (
                        t("quote.pdfError")
                      ) : (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                          {t("quote.generating")}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-300">{t("quote.tip")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sección                                                              */
/* ------------------------------------------------------------------ */

export default function InstantQuoteSection() {
  const { t, lang } = useLang();
  const uid = useId();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);
  const set = useCallback((patch) => setAnswers((a) => ({ ...a, ...patch })), []);
  const setFeature = (k, v) =>
    setAnswers((a) => ({ ...a, features: { ...a.features, [k]: v } }));

  // Cálculo (lógica pura en ./quote/engine.js)
  const q = useMemo(() => computeQuote(answers), [answers]);
  const summary = useMemo(() => buildSummary(answers, q, t), [answers, q, t]);
  const isCustom = q.isCustom;
  const plan = planName(q, t);
  const price = priceText(q, t);

  /* ---------- PDF (carga dinámica) ---------- */
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(null); // "preview" | "download" | null

  const makeDoc = async () => {
    const { buildPdf } = await loadPdfModule();
    return buildPdf({
      summary,
      estimate: {
        plan: q.plan,
        priceMode: q.priceMode,
        isOverCap: q.isOverCap,
        priceLow: q.priceLow,
        priceHigh: q.priceHigh,
        days: q.days,
      },
      breakdown: {
        basePrice: q.basePrice,
        addonsPrice: q.addonsPrice,
        multipliers: q.multipliers,
        emailCost: summary.emailCost,
      },
      t,
      lang,
    });
  };

  const openPdfPreview = async () => {
    setPdfError(false);
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPdfOpen(true);
    setPdfBusy("preview");
    try {
      const doc = await makeDoc();
      setPdfUrl(URL.createObjectURL(doc.output("blob")));
    } catch {
      setPdfError(true);
    } finally {
      setPdfBusy(null);
    }
  };

  const downloadPdf = async () => {
    setPdfBusy("download");
    try {
      const doc = await makeDoc();
      doc.save("jumalancers-instant-quote.pdf");
    } catch {
      setPdfError(true);
    } finally {
      setPdfBusy(null);
    }
  };

  const closePdf = useCallback(() => setPdfOpen(false), []);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  /* ---------- WhatsApp con el resumen ---------- */
  const waHref = waLink(
    [
      t("quote.whatsappMsg"),
      `• ${t("quote.waInvestment")}: ${price} USD`,
      `• ${t("quote.waTime")}: ${q.days[0]}–${q.days[1]} ${t("quote.businessDays")}`,
      `• ${t("quote.waScope")}: ${plan} · ${t("quote.pages")} ${summary.pagesLabel} · ${t("quote.totalSections")} ${summary.totalSections}`,
      `• ${t("quote.waFeatures")}: ${summary.featuresLabel}`,
    ].join("\n"),
  );

  /* ---------- Navegación entre pasos ---------- */
  const headingRef = useRef(null);
  const userNav = useRef(false);
  const goStep = (i) => {
    userNav.current = true;
    setStep(Math.max(0, Math.min(STEP_KEYS.length - 1, i)));
  };
  useEffect(() => {
    if (!userNav.current) return;
    const h = headingRef.current;
    if (!h) return;
    h.focus({ preventScroll: true });
    // Si el título del paso quedó arriba del viewport (móvil), lo traemos a la vista
    const top = h.getBoundingClientRect().top;
    if (top < 90) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollBy({ top: top - 140, behavior: reduce ? "auto" : "smooth" });
    }
  }, [step]);

  /* ---------- Barra inferior móvil ---------- */
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const [inQuote, setInQuote] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === wrapRef.current) setInQuote(e.isIntersecting);
        if (e.target === panelRef.current) setPanelVisible(e.isIntersecting);
      }
    }, { threshold: [0, 0.15] });
    if (wrapRef.current) io.observe(wrapRef.current);
    if (panelRef.current) io.observe(panelRef.current);
    return () => io.disconnect();
  }, []);
  const showBar = inQuote && !panelVisible;

  const scrollToPanel = () =>
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const stepKey = STEP_KEYS[step];
  const isLast = step === STEP_KEYS.length - 1;
  const pagesOptions = PAGES_OPTIONS;

  /* ---------- Contenido de cada paso ---------- */
  const renderStep = () => {
    if (stepKey === "structure") {
      return (
        <div className="space-y-8">
          <div>
            <QuestionLabel id={`${uid}-q1`}>{t("quote.q1")}</QuestionLabel>
            <RadioCards
              labelId={`${uid}-q1`}
              options={pagesOptions}
              value={answers.pagesId}
              onChange={(id) => set({ pagesId: id })}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              renderOption={(o, active) => (
                <span className="flex flex-col gap-3 p-4">
                  <RadioDot active={active} />
                  <span>
                    <span className="block font-display text-2xl font-semibold tracking-tight text-text-900 tabular-nums">
                      {o.label}
                    </span>
                    <span className="text-xs text-text-300">
                      {o.label === "1" ? t("quote.q1_suffix_singular") : t("quote.q1_suffix_plural")}
                    </span>
                  </span>
                </span>
              )}
            />
            <Hint>
              {t("quote.q1_help_a")} <code className="text-text-500">/services</code> {t("quote.q1_help_b")}{" "}
              <code className="text-text-500">/contact</code>.{" "}
              <span className="text-text-500">{t("quote.q1_planHint")}</span>
            </Hint>
          </div>

          <div>
            <QuestionLabel id={`${uid}-q2`}>{t("quote.q2")}</QuestionLabel>
            <RadioCards
              labelId={`${uid}-q2`}
              options={SECTIONS_OPTIONS}
              value={answers.sectionsId}
              onChange={(id) => set({ sectionsId: id })}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              renderOption={(o, active) => (
                <span className="flex flex-col gap-3 p-4">
                  <RadioDot active={active} />
                  <span>
                    <span className="block font-display text-2xl font-semibold tracking-tight text-text-900 tabular-nums">
                      {o.label}
                    </span>
                    <span className="text-xs text-text-300">{t("quote.q2_suffix")}</span>
                  </span>
                </span>
              )}
            />
            <Hint>
              {t("quote.q2_help_a")} <span className="font-medium text-text-500">hero</span> {t("quote.q2_help_b")}{" "}
              <span className="font-medium text-text-500">footer</span>. {t("quote.q2_help_density")}
            </Hint>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-primary-400/20 bg-primary-500/[0.06] p-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-400/15 px-3 py-1 text-xs font-semibold text-primary-200">
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              {t("quote.estimatedTotalSections")}: {q.totalSections}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-text-700">
              {t("quote.scopeLevel")}: {plan}
            </span>
            {q.sectionsOpt.density !== 1 && (
              <span className="inline-flex items-center rounded-full border border-primary-400/20 bg-primary-400/10 px-3 py-1 text-xs font-medium text-primary-200">
                {multiplierLabel({ key: "density", value: q.sectionsOpt.density }, t)}
              </span>
            )}
            <p className="w-full pt-1 text-[13px] leading-relaxed text-text-300 sm:text-xs">{t("quote.structureHint")}</p>
          </div>
        </div>
      );
    }

    if (stepKey === "functionality") {
      return (
        <div>
          <QuestionLabel id={`${uid}-q3`} hint={t("quote.pickAny")}>
            {t("quote.q3")}
          </QuestionLabel>
          <div role="group" aria-labelledby={`${uid}-q3`} className="grid gap-3 sm:grid-cols-2">
            {FEATURE_KEYS.map((k) => (
              <FeatureCard
                key={k}
                id={`${uid}-f-${k}`}
                icon={FEATURE_ICONS[k]}
                checked={answers.features[k]}
                onChange={(v) => setFeature(k, v)}
                label={t(`quote.features.${featureI18nKey(k)}.label`)}
                note={t(`quote.features.${featureI18nKey(k)}.note`)}
              />
            ))}
          </div>

          {isCustom && (
            <div
              role="status"
              className="mt-5 flex gap-3 rounded-2xl border border-primary-400/25 bg-primary-500/[0.07] p-4"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-text-900">{t("quote.customDetectedTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-500">
                  {t("quote.customDetectedDesc_a")}{" "}
                  <span className="font-semibold text-text-900">{price}</span> USD.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (stepKey === "support") {
      return (
        <div>
          <QuestionLabel id={`${uid}-q4`}>{t("quote.q4")}</QuestionLabel>
          <RadioCards
            labelId={`${uid}-q4`}
            options={SUPPORT_OPTIONS.map((id) => ({ id }))}
            value={answers.support}
            onChange={(id) => set({ support: id })}
            className="grid gap-3"
            renderOption={(o, active) => (
              <span className="flex items-center gap-4 p-4">
                <IconBadge icon={SUPPORT_ICONS[o.id]} active={active} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold ${active ? "text-text-900" : "text-text-700"}`}>
                    {t(`quote.supportOptions.${o.id}`)}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-text-300 sm:text-xs">
                    {t(`quote.supportDesc.${o.id}`)}
                  </span>
                </span>
                <RadioDot active={active} />
              </span>
            )}
          />
          <Hint>{t("quote.supportHint")}</Hint>
        </div>
      );
    }

    if (stepKey === "infra") {
      const n = q.emailCount;
      const btn = `grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-text-900 transition hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/[0.04] ${FOCUS_RING}`;
      return (
        <div>
          <QuestionLabel id={`${uid}-q5`}>{t("quote.q5")}</QuestionLabel>
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
            <label htmlFor={`${uid}-emails`} className="flex items-center gap-2 text-sm font-medium text-text-700">
              <Mail className="h-4 w-4 text-primary-300" aria-hidden="true" />
              {t("quote.emailsLabel")}
            </label>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={btn}
                  onClick={() => setAnswers((a) => ({ ...a, emails: Math.max(0, normalizeEmails(a.emails) - 1) }))}
                  disabled={n <= 0}
                  aria-label={t("quote.decrease")}
                  aria-controls={`${uid}-emails`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id={`${uid}-emails`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={answers.emails}
                  onChange={(e) => set({ emails: e.target.value })}
                  aria-describedby={`${uid}-emails-inc`}
                  className="h-12 w-20 rounded-xl border border-white/12 bg-bg-50 text-center font-display text-xl font-semibold text-text-900 tabular-nums [appearance:textfield] focus:border-primary-400/60 focus:outline-none focus:ring-2 focus:ring-primary-400/40 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  className={btn}
                  onClick={() => setAnswers((a) => ({ ...a, emails: normalizeEmails(a.emails) + 1 }))}
                  aria-label={t("quote.increase")}
                  aria-controls={`${uid}-emails`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p id={`${uid}-emails-inc`} className="text-sm text-text-500">
                {t("quote.emailsIncluded_a")} <span className="font-semibold text-text-900">{plan}</span>{" "}
                {t("quote.emailsIncluded_b")}{" "}
                <span className="font-semibold text-text-900 tabular-nums">{q.includedEmails}</span>{" "}
                {q.includedEmails === 1 ? t("quote.emailsIncludedOne") : t("quote.emailsIncludedMany")}
              </p>
            </div>
            <dl className="mt-5 space-y-2 border-t border-white/8 pt-4 text-sm" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-500">{t("quote.emailsExtra")}</dt>
                <dd className="font-semibold text-text-900 tabular-nums">
                  {q.extraEmails}{" "}
                  <span className="font-normal text-text-300">
                    × ${EMAIL_PRICE} {t("quote.perAccount_a")}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-text-500">{t("quote.emailCostLabel")}</dt>
                <dd className="font-semibold text-text-900 tabular-nums">
                  ${formatUSD(q.emailCost)} <span className="font-normal text-text-300">{t("quote.perYear")}</span>
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[13px] text-text-300 sm:text-xs">
              ${EMAIL_PRICE} {t("quote.perAccount_a")} {t("quote.perAccount_b")}
            </p>
          </div>
          <Hint>{t("quote.emailHint")}</Hint>
        </div>
      );
    }

    // time
    return (
      <div>
        <QuestionLabel id={`${uid}-q6`}>{t("quote.q6")}</QuestionLabel>
        <RadioCards
          labelId={`${uid}-q6`}
          options={TIMELINE_OPTIONS.map((id) => ({ id }))}
          value={answers.timeline}
          onChange={(id) => set({ timeline: id })}
          className="grid gap-3"
          renderOption={(o, active) => (
            <span className="flex items-center gap-4 p-4">
              <IconBadge icon={TIMELINE_ICONS[o.id]} active={active} />
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-semibold ${active ? "text-text-900" : "text-text-700"}`}>
                  {t(`quote.timeline.${o.id}`)}
                </span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-text-300 sm:text-xs">
                  {t(`quote.timelineDesc.${o.id}`)}
                </span>
              </span>
              <RadioDot active={active} />
            </span>
          )}
        />
        <Hint>{t("quote.timelineHint")}</Hint>
      </div>
    );
  };

  const priceNode = q.priceMode !== "range" ? (
    <>{price}</>
  ) : (
    <>
      ${formatUSD(q.priceLow)}
      <span className="mx-1.5 text-text-300">–</span>${formatUSD(q.priceHigh)}
    </>
  );

  return (
    <>
    <Section id="quote" className="isolate overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[420px] rounded-full glow-orb text-primary-500/10" />
      </div>

      <SectionHeader
        eyebrow={t("quote.badge")}
        title={t("quote.title")}
        accent={t("quote.titleAccent")}
        desc={t("quote.desc")}
      />

      <div ref={wrapRef} className="mt-12 grid grid-cols-1 items-start gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
        {/* ---------------- Wizard ---------------- */}
        <Reveal className="min-w-0 lg:col-span-7">
          <div className="card overflow-hidden rounded-3xl!">
            {/* Stepper */}
            <nav aria-label={t("quote.stepsLabel")} className="border-b border-white/8 px-4 pb-4 pt-5 sm:px-6">
              <ol className="grid grid-cols-5">
                {STEP_KEYS.map((k, i) => {
                  const done = i < step;
                  const current = i === step;
                  return (
                    <li key={k} className="relative flex justify-center">
                      {i < STEP_KEYS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-3.5 h-px bg-white/10"
                        >
                          <span
                            className={`block h-px bg-primary-400/70 transition-all duration-500 motion-reduce:transition-none ${done ? "w-full" : "w-0"}`}
                          />
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => goStep(i)}
                        aria-current={current ? "step" : undefined}
                        aria-label={`${t("quote.goToStep")} ${i + 1}: ${t(`quote.steps.${k}.title`)}${done ? ` (${t("quote.completed")})` : ""}`}
                        className={`group flex min-h-11 min-w-11 max-w-full flex-col items-center gap-2 rounded-xl px-1 ${FOCUS_RING}`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums transition ${
                            current
                              ? "bg-primary-400 text-[hsl(167,60%,6%)] shadow-[0_0_0_4px] shadow-primary-400/15"
                              : done
                                ? "bg-primary-400/15 text-primary-200 group-hover:bg-primary-400/25"
                                : "border border-white/12 text-text-300 group-hover:border-white/25"
                          }`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
                        </span>
                        <span
                          className={`hidden max-w-full truncate text-[11px] font-medium sm:block ${
                            current ? "text-text-900" : done ? "text-text-500" : "text-text-300"
                          }`}
                        >
                          {t(`quote.steps.${k}.title`)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Contenido del paso */}
            <div className="px-4 py-6 sm:px-6 sm:py-7">
              <div className="mb-6">
                <p className="text-xs font-medium text-primary-300">
                  {t("quote.step")} {step + 1} {t("quote.of")} {STEP_KEYS.length}
                </p>
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-text-900 focus:outline-none"
                >
                  {t(`quote.steps.${stepKey}.title`)}
                </h3>
                <p className="mt-1 text-sm text-text-500">{t(`quote.steps.${stepKey}.subtitle`)}</p>
              </div>

              <StepPanel key={step}>{renderStep()}</StepPanel>

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/8 pt-6">
                <button
                  type="button"
                  onClick={() => goStep(step - 1)}
                  disabled={step === 0}
                  className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-text-700 transition hover:bg-white/5 hover:text-text-900 disabled:pointer-events-none disabled:opacity-35 ${FOCUS_RING}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {t("quote.back")}
                </button>

                {isLast ? (
                  <button
                    type="button"
                    onClick={openPdfPreview}
                    onPointerEnter={preloadPdf}
                    onFocus={preloadPdf}
                    className={`group inline-flex h-11 items-center gap-2 rounded-full bg-primary-400 px-6 text-sm font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 active:scale-[0.98] ${FOCUS_RING}`}
                  >
                    {t("quote.seeSummary")}
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goStep(step + 1)}
                    className={`group inline-flex h-11 items-center gap-2 rounded-full bg-primary-400 px-6 text-sm font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 active:scale-[0.98] ${FOCUS_RING}`}
                  >
                    {t("quote.next")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------------- Panel de estimación ---------------- */}
        <aside
          ref={panelRef}
          id="quote-estimate"
          aria-label={t("quote.realtime")}
          className="min-w-0 scroll-mt-24 lg:sticky lg:top-28 lg:col-span-5"
        >
          <Reveal delay={100}>
            <div className="relative isolate overflow-hidden rounded-3xl bg-[linear-gradient(160deg,hsl(165_50%_62%/0.5),rgb(255_255_255/0.06)_45%,rgb(255_255_255/0.04))] p-px shadow-[0_30px_80px_-30px] shadow-primary-500/30">
              <div className="relative rounded-[calc(1.5rem-1px)] bg-[linear-gradient(180deg,hsl(167_45%_10%),hsl(167_47%_7%))]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-t-[inherit] bg-[radial-gradient(70%_100%_at_80%_0%,hsl(165_55%_50%/0.16),transparent)]"
                />

                <div className="relative border-b border-white/8 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">
                      <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-primary-400/50 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
                      </span>
                      {t("quote.realtime")}
                    </p>
                    <span className="inline-flex shrink-0 items-center whitespace-nowrap gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-700">
                      <Layers3 className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
                      {plan}
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-text-500">{t("quote.investment")} (USD)</p>
                  <p
                    key={`${q.priceLow}-${q.priceMode}`}
                    className="mt-1 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.04em] text-text-900 tabular-nums motion-safe:animate-[quote-pop_.35s_ease-out] sm:text-5xl"
                  >
                    {priceNode}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-text-700">
                    <Clock className="h-4 w-4 text-primary-300" aria-hidden="true" />
                    <span className="tabular-nums">
                      {q.days[0]}–{q.days[1]}
                    </span>{" "}
                    {t("quote.businessDays")}
                  </p>

                  {(q.isOverCap || isCustom) && (
                    <div className="mt-5 rounded-2xl border border-primary-400/25 bg-primary-500/[0.08] p-4">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-900">
                        <Sparkles className="h-4 w-4 text-primary-300" aria-hidden="true" />
                        {t("quote.customRecommendedTitle")}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-500">
                        {t("quote.customRecommendedDesc_a")}{" "}
                        <span className="font-semibold text-text-900">{price}</span> USD.{" "}
                        {t("quote.customRecommendedDesc_b")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative space-y-5 p-5 sm:p-6">
                  <dl className="grid grid-cols-3 gap-2 text-center">
                    {[
                      [t("quote.pages"), summary.pagesLabel],
                      [t("quote.sectionsAvg"), summary.sectionsLabel],
                      [t("quote.totalSections"), summary.totalSections],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl border border-white/8 bg-white/[0.03] px-2 py-2.5">
                        <dt className="text-[11px] leading-tight text-text-300">{k}</dt>
                        <dd className="mt-1 font-semibold text-text-900 tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-300">
                      {t("quote.includedFactors")}
                    </p>
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-text-500">
                          {t("quote.base")} ({plan})
                        </dt>
                        <dd className="font-semibold text-text-900 tabular-nums">${formatUSD(q.basePrice)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-text-500">{t("quote.addons")}</dt>
                        <dd className="font-semibold text-text-900 tabular-nums">${formatUSD(q.addonsPrice)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-text-500">
                          {t(isCustom ? "quote.domainSsl" : "quote.domainHosting")}
                        </dt>
                        <dd className="font-semibold text-primary-200">{t("quote.included")}</dd>
                      </div>
                    </dl>
                    {isCustom && <p className="mt-2 text-xs text-text-300">{t("quote.appHosting")}</p>}
                    {q.multipliers.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {q.multipliers.map((m) => (
                          <li
                            key={m.key}
                            className="rounded-full border border-primary-400/20 bg-primary-400/10 px-2.5 py-1 text-[11px] font-medium text-primary-200"
                          >
                            {multiplierLabel(m, t)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-300">
                      {t("quote.infraSeparate")}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 text-text-500">
                        <Mail className="h-4 w-4 text-primary-300" aria-hidden="true" />
                        {t("quote.corporateEmails")}
                      </span>
                      <span className="shrink-0 whitespace-nowrap font-semibold text-text-900 tabular-nums">
                        ${formatUSD(q.emailCost)} <span className="font-normal text-text-300">{t("quote.perYear")}</span>
                      </span>
                    </div>
                    <p className="mt-1 pl-6 text-xs text-text-300 tabular-nums">
                      {q.includedEmails} {t("quote.emailsIncludedShort")} · {q.extraEmails} {t("quote.emailsExtraShort")}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-text-300 sm:text-xs">{t("quote.emailsBilledSeparately")}</p>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={openPdfPreview}
                      onPointerEnter={preloadPdf}
                      onFocus={preloadPdf}
                      aria-busy={pdfBusy === "preview"}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-400 px-5 text-sm font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 active:scale-[0.98] ${FOCUS_RING}`}
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      {t("quote.previewPdf")}
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      onPointerEnter={preloadPdf}
                      onFocus={preloadPdf}
                      disabled={pdfBusy === "download"}
                      aria-busy={pdfBusy === "download"}
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-text-900 transition hover:bg-white/10 disabled:opacity-60 active:scale-[0.98] ${FOCUS_RING}`}
                    >
                      {pdfBusy === "download" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                      ) : (
                        <Download className="h-4 w-4" aria-hidden="true" />
                      )}
                      {pdfBusy === "download" ? t("quote.loadingPdf") : t("quote.downloadPdf")}
                    </button>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener"
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-primary-200 transition hover:bg-primary-400/10 sm:col-span-2 ${FOCUS_RING}`}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      {t("quote.whatsappCta")}
                    </a>
                  </div>
                  {pdfError && !pdfOpen && (
                    <p role="alert" className="text-xs text-error-500">
                      {t("quote.pdfError")}
                    </p>
                  )}

                  <div className="space-y-1.5 border-t border-white/8 pt-4 text-[13px] leading-relaxed text-text-300 sm:text-xs">
                    <p className="text-text-500">{t("quote.estimateNote")}</p>
                    <p>{t("quote.disclaimer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Anuncio para lectores de pantalla */}
      <p className="sr-only" aria-live="polite">
        {t("quote.estimateAria")}: {price} USD, {q.days[0]}–{q.days[1]} {t("quote.businessDays")}
      </p>

    </Section>

      {/* Barra inferior fija (móvil) con el total. Fuera de <Section> para
          no quedar atrapada en su contexto de apilamiento (isolate). */}
      <div
        aria-hidden={!showBar}
        inert={!showBar ? true : undefined}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-bg-50/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition duration-300 motion-reduce:transition-none lg:hidden ${
          showBar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-text-300">
              {t("quote.investment")} · {q.days[0]}–{q.days[1]} {t("quote.businessDays")}
            </p>
            <p className="truncate font-display text-xl font-semibold tracking-[-0.03em] text-text-900 tabular-nums">
              {priceNode}
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToPanel}
            className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary-400 px-4 text-sm font-semibold text-[hsl(167,60%,6%)] transition hover:bg-primary-300 ${FOCUS_RING}`}
          >
            {t("quote.seeDetails")}
            <ArrowRight className="h-4 w-4 rotate-90" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Keyframe local para el "pop" del precio */}
      <style>{`@keyframes quote-pop{from{opacity:.4;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>

      <PdfModal
        open={pdfOpen}
        onClose={closePdf}
        pdfUrl={pdfUrl}
        error={pdfError}
        onDownload={downloadPdf}
        downloading={pdfBusy === "download"}
        t={t}
      />
    </>
  );
}
