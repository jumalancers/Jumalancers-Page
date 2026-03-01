import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
  ChevronLeft,
  ChevronRight,
  FileDown,
  X,
  ShieldCheck,
  Clock,
  Layers3,
} from "lucide-react";
import { useLang } from "../i18n.jsx";

/**
 * Instant Quote Wizard
 * - real-time estimate panel
 * - back/next navigation
 * - PDF preview modal (scrollable) with generated PDF blob
 *
 * Notes:
 * - Ajusta PRICES, THRESHOLDS, ADDONS y MULTIPLIERS a tu realidad.
 * - Mantén el cálculo estable: evita multiplicar multiplicadores sobre multiplicadores.
 */

const CONTACT = {
  phone: "+52 664 425 7324",
  website: "https://jumalancers.com",
};

const DOMAIN_ANNUAL_FEE = 500; // MXN (solo dominio, anual)

const PRICES = {
  starter: 5499,
  business: 10899,
  premium: 16299,
};

const HARD_CAP = 30000; // visual cap: show "30,000+"

const EMAIL_PRICE = 350; // MXN por cuenta anual

// Convertimos rango a un valor "promedio" para estimar trabajo (sin romper UX)
const PAGES_OPTIONS = [
  { id: "p1", label: "1", value: 1 },
  { id: "p2_3", label: "2–3", value: 2.5 },
  { id: "p4_6", label: "4–6", value: 5 },
  { id: "p7p", label: "7+", value: 7.5 },
];

const SECTIONS_OPTIONS = [
  { id: "s1_3", label: "1–3", value: 2 },
  { id: "s4_6", label: "4–6", value: 5 },
  { id: "s7_9", label: "7–9", value: 8 },
  { id: "s10p", label: "10+", value: 11 },
];

// Thresholds por TotalSections = pages * avgSections
// Los pongo conservadores para que NO se dispare el precio tan rápido:
const THRESHOLDS = {
  starterMax: 6,
  businessMax: 12,
  premiumMax: 20,
  // > 20 => custom
};

const ADDONS = {
  blog: { label: "Blog", price: 3000, days: [2, 4] },
  booking: { label: "Agenda de citas", price: 3000, days: [2, 5] },
  payments: { label: "Pagos en línea", price: 5000, days: [3, 7] },
  dashboard_simple: {
    label: "Panel interno simple",
    price: 6000,
    days: [4, 8],
  },
  integrations: { label: "Integraciones externas", price: 4000, days: [3, 6] },
};

// Advanced system NO tiene precio fijo: empuja a custom
const ADVANCED_SYSTEM_KEY = "system_advanced";

// Multilenguaje: multiplicador según tamaño (más secciones = más trabajo traducir)
function i18nMultiplier(totalSections) {
  if (totalSections <= 8) return 1.12;
  if (totalSections <= 14) return 1.18;
  return 1.25;
}

function positioningMultiplier(level) {
  // 0: ready, 1: structural guidance, 2: full copy+positioning
  if (level === "ready") return 1.0;
  if (level === "guidance") return 1.1;
  return 1.2;
}

// Timeline: NO promete magia. "Accelerated" solo aplica si no es custom.
function timelineMultiplier(timeline, isCustom) {
  if (isCustom) return 1.0;
  if (timeline === "flexible") return 1.0;
  if (timeline === "standard") return 1.0;
  return 1.12; // accelerated (subject to scope)
}

function clampCurrency(n) {
  return Math.round(n / 10) * 10;
}

function formatMXN(n) {
  const x = Math.max(0, Math.round(n));
  return x.toLocaleString("es-MX");
}

function estimatePlan(totalSections, forceCustom) {
  if (forceCustom) return "custom";
  if (totalSections <= THRESHOLDS.starterMax) return "starter";
  if (totalSections <= THRESHOLDS.businessMax) return "business";
  if (totalSections <= THRESHOLDS.premiumMax) return "premium";
  return "custom";
}

function estimateDays(
  plan,
  totalSections,
  addonsKeys,
  hasI18n,
  positioning,
  timeline,
  forceCustom,
) {
  // base days
  let base;
  if (forceCustom) base = [18, 35];
  else if (plan === "starter") base = [5, 9];
  else if (plan === "business") base = [10, 16];
  else if (plan === "premium") base = [14, 22];
  else base = [18, 35];

  // size contribution (tiny)
  const sizeBoost = Math.max(0, totalSections - 6);
  const sizeDays = Math.min(10, Math.round(sizeBoost / 3)); // suave
  let min = base[0] + Math.floor(sizeDays * 0.6);
  let max = base[1] + sizeDays;

  // addons
  for (const k of addonsKeys) {
    if (k === "multilanguage") continue;
    if (k === ADVANCED_SYSTEM_KEY) continue;
    const a = ADDONS[k];
    if (a) {
      min += a.days[0];
      max += a.days[1];
    }
  }

  // i18n overhead
  if (hasI18n) {
    const extra =
      totalSections <= 8 ? [2, 4] : totalSections <= 14 ? [3, 6] : [5, 9];
    min += extra[0];
    max += extra[1];
  }

  // positioning support overhead (not huge)
  if (positioning === "guidance") {
    min += 1;
    max += 2;
  } else if (positioning === "full") {
    min += 3;
    max += 6;
  }

  // timeline: accelerated never shortens here; solo agrega riesgo
  if (timeline === "accelerated" && !forceCustom) {
    min += 0;
    max += 2;
  }

  return [min, max];
}

function buildPdf({ summary, estimate, breakdown, t, lang }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const M = 56;
  const W = pageW - M * 2;

  // New palette (Green + Cream)
  // Base: #102c26 (16,44,38)
  // Base: #f7e7ce (247,231,206)
  // Primary highlight (same hue, more vivid): tweak if you want
  const C = {
    // Core
    ink: [16, 44, 38], // main text (deep green)
    muted: [46, 84, 74], // body secondary
    faint: [92, 125, 115], // labels / meta
    line: [210, 196, 170], // subtle divider (cream-ish)

    // Surfaces
    soft: [253, 248, 240], // soft card background
    cream: [247, 231, 206], // cream base

    // Brand highlight
    primary: [23, 122, 90], // highlight green (vivid)
    primarySoft: [231, 246, 240], // soft green tint for small accents
  };

  const locale = lang === "en" ? "en-US" : "es-MX";
  const now = new Date().toLocaleString(locale);

  const setText = (rgb) => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setFill = (rgb) => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setDraw = (rgb) => doc.setDrawColor(rgb[0], rgb[1], rgb[2]);

  const hr = (y) => {
    setDraw(C.line);
    doc.setLineWidth(1);
    doc.line(M, y, pageW - M, y);
  };

  const card = (x, y, w, h, fill = C.soft) => {
    setFill(fill);
    doc.rect(x, y, w, h, "F");
  };

  const moneyRange = () => {
    if (estimate.isOverCap) return `MXN $${formatMXN(HARD_CAP)}+`;
    return `MXN $${formatMXN(estimate.priceLow)} – $${formatMXN(estimate.priceHigh)}`;
  };

  const sectionTitle = (label, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(C.ink);
    doc.text(label, M, y);
    hr(y + 10);
    return y + 28;
  };

  const kv = (x, y, k, v, w) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setText(C.faint);
    doc.text(k.toUpperCase(), x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    setText(C.ink);
    const lines = doc.splitTextToSize(v, w);
    doc.text(lines, x, y + 16);
    return y + 16 + lines.length * 14;
  };

  const bulletList = (x, y, items, w, leading = 14) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(C.ink);
    for (const it of items) {
      const lines = doc.splitTextToSize(it, w - 18);
      // bullet dot (now primary green)
      setFill(C.primary);
      doc.circle(x + 4, y - 3, 2.2, "F");
      setText(C.ink);
      doc.text(lines, x + 14, y);
      y += lines.length * leading + 6;
      if (y > pageH - 110) {
        doc.addPage();
        y = 72;
      }
    }
    return y;
  };

  const planIncludes = (planLabel) => {
    if (estimate.isOverCap) return t("quote.pdf.includes.custom");

    const pl = (planLabel || "").toLowerCase();

    if (pl.includes("starter")) return t("quote.pdf.includes.starter");
    if (pl.includes("business")) return t("quote.pdf.includes.business");

    return t("quote.pdf.includes.premium");
  };

  // ---------- Header ----------
  // Thin primary bar (replaces gold)
  setFill(C.primary);
  doc.rect(0, 0, pageW, 6, "F");

  let y = 62;

  // Brand row (replaces navy)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(C.ink);
  doc.text(t("quote.pdf.brand"), M, y);

  // Title
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setText(C.ink);
  doc.text(t("quote.pdf.title"), M, y);

  // Timestamp
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setText(C.muted);
  doc.text(`${t("quote.pdf.generated")}: ${now}`, M, y);

  y += 16;
  hr(y);
  y += 22;

  // ---------- Key stats ----------
  const colGap = 18;
  const colW = (W - colGap * 2) / 3;

  const stat = (x, title, value, sub) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setText(C.faint);
    doc.text(title.toUpperCase(), x, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    setText(C.ink);
    doc.text(value, x, y + 18);

    if (sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setText(C.muted);
      doc.text(sub, x, y + 34);
    }
  };

  stat(
    M,
    t("quote.pdf.estimatedInvestment"),
    moneyRange(),
    estimate.isOverCap
      ? t("quote.pdf.investmentHintOverCap")
      : t("quote.pdf.investmentHintRange"),
  );

  stat(
    M + colW + colGap,
    t("quote.pdf.time"),
    `${estimate.days[0]}–${estimate.days[1]} ${t("quote.pdf.businessDays")}`,
    null,
  );

  stat(
    M + (colW + colGap) * 2,
    t("quote.pdf.scope"),
    estimate.isOverCap
      ? t("quote.pdf.custom")
      : `${t("quote.pdf.similarTo")} ${estimate.planLabel}`,
    null,
  );

  y += 64;

  // ---------- What’s included ----------
  y = sectionTitle(t("quote.pdf.includesTitle"), y);
  const includes = planIncludes(estimate.planLabel);
  y = bulletList(M, y, includes, W);
  y += 8;

  // ---------- Project Summary ----------
  y = sectionTitle(t("quote.pdf.projectSummaryTitle"), y);

  const leftX = M;
  const rightX = M + W / 2 + 12;
  const colTextW = W / 2 - 12;

  let yl = y;
  let yr = y;

  yl = kv(leftX, yl, t("quote.pdf.pages"), summary.pagesLabel, colTextW);
  yl = kv(
    leftX,
    yl + 10,
    t("quote.pdf.sectionsPerPageAvg"),
    `${summary.sectionsLabel} (${t("quote.pdf.sectionsPerPageNote")})`,
    colTextW,
  );
  yl = kv(
    leftX,
    yl + 10,
    t("quote.pdf.totalSections"),
    String(summary.totalSections),
    colTextW,
  );

  const feat = summary.featuresLabel || t("quote.pdf.infoOnly");
  yr = kv(rightX, yr, t("quote.pdf.functionality"), feat, colTextW);
  yr = kv(
    rightX,
    yr + 10,
    t("quote.pdf.supportLevel"),
    summary.supportLabel,
    colTextW,
  );
  yr = kv(
    rightX,
    yr + 10,
    t("quote.pdf.timelinePreference"),
    summary.timelineLabel,
    colTextW,
  );

  y = Math.max(yl, yr) + 12;

  // ---------- Pricing breakdown ----------
  y = sectionTitle(t("quote.pdf.breakdownTitle"), y);

  // Breakdown card (cream surface)
  card(M, y - 6, W, 92, C.soft);

  const base = breakdown?.basePrice ?? null;
  const addons = breakdown?.addonsPrice ?? null;
  const emailCost = breakdown?.emailCost ?? summary.emailCost ?? 0;
  const mults = breakdown?.multipliers ?? [];

  let by = y + 18;

  const lineItem = (label, value, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    setText(bold ? C.ink : C.muted);
    doc.text(label, M + 16, by);

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    setText(bold ? C.ink : C.muted);
    doc.text(value, pageW - M - doc.getTextWidth(value), by);

    by += 16;
  };

  if (base != null)
    lineItem(t("quote.pdf.baseScopeRef"), `MXN $${formatMXN(base)}`);
  if (addons != null)
    lineItem(t("quote.pdf.addons"), `MXN $${formatMXN(addons)}`);

  lineItem(t("quote.pdf.domainAnnual"), `MXN $${formatMXN(DOMAIN_ANNUAL_FEE)}`);
  lineItem(
    t("quote.pdf.corporateEmailsAnnual"),
    `MXN $${formatMXN(emailCost)}`,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(C.faint);
  doc.text(t("quote.pdf.noteDomainAndExtras"), M + 16, by + 6);
  by += 18;

  if (mults.length) {
    const mLabel = mults.map((m) => m.label).join(", ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(C.faint);
    const lines = doc.splitTextToSize(
      `${t("quote.pdf.multipliersApplied")}: ${mLabel}`,
      W - 32,
    );
    doc.text(lines, M + 16, by);
    by += lines.length * 12 + 6;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setText(C.faint);
    doc.text(
      `${t("quote.pdf.multipliersApplied")}: ${t("quote.pdf.none")}`,
      M + 16,
      by,
    );
    by += 18;
  }

  y += 122;

  // ---------- Next step ----------
  y = sectionTitle(t("quote.pdf.nextStepTitle"), y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  setText(C.muted);
  doc.text(t("quote.pdf.confirmScopeQuestion"), M, y);

  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setText(C.ink);
  doc.text(t("quote.pdf.whatsappInstruction"), M, y);

  // ---------- Footer disclaimer ----------
  const footY = pageH - 70;
  hr(footY - 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(C.muted);

  const disclaimer = t("quote.pdf.disclaimer");
  const dLines = doc.splitTextToSize(disclaimer, W);
  doc.text(dLines, M, footY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(C.faint);
  doc.text(
    `${t("quote.pdf.footerContact")}: ${CONTACT.phone} • ${CONTACT.website}`,
    M,
    footY + 26,
  );

  return doc;
}

function Modal({ open, onClose, title, desc, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-bg-900/55"
        aria-label="Close modal"
      />
      <div className="absolute inset-0 p-3 sm:p-4 md:p-6 grid place-items-end md:place-items-center">
        <div
          className="
            w-full max-w-5xl
            rounded-3xl bg-bg-50 overflow-hidden
            max-h-[88dvh] md:max-h-[82dvh]
            flex flex-col
          "
          role="dialog"
          aria-modal="true"
        >
          <div className="shrink-0 flex items-start justify-between gap-4 px-4 sm:px-6 py-4 bg-bg-100">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-text-900">
                {title}
              </h3>
              <p className="mt-1 text-sm text-text-700">
                {desc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="
                h-10 w-10 shrink-0 rounded-full
                bg-bg-50 hover:bg-bg-200/60 transition grid place-items-center
              "
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-text-900" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full bg-bg-100 px-3 py-1 text-xs font-semibold text-text-700">
      {children}
    </span>
  );
}

function OptionButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left
        rounded-2xl px-4 py-3
        border transition
        ${active ? "border-primary-500 bg-primary-500/10" : "border-primary-900/10 bg-bg-50 hover:border-primary-900/15"}
      `}
      type="button"
    >
      <span className="text-sm font-semibold text-text-900">{children}</span>
    </button>
  );
}

function Checkbox({ checked, onChange, label, note }) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-primary-900/10 bg-bg-50 px-4 py-3 hover:border-primary-900/15 transition cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--color-primary-500)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-text-900">
          {label}
        </span>
        {note ? (
          <span className="block text-xs text-text-500 mt-0.5">{note}</span>
        ) : null}
      </span>
    </label>
  );
}

export default function InstantQuoteSection() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);

  const [pagesId, setPagesId] = useState("p1");
  const [sectionsId, setSectionsId] = useState("s4_6");

  const [features, setFeatures] = useState({
    blog: false,
    multilanguage: false,
    booking: false,
    payments: false,
    dashboard_simple: false,
    [ADVANCED_SYSTEM_KEY]: false,
    integrations: false,
    informationalOnly: true,
  });

  const [support, setSupport] = useState("ready"); // ready | guidance | full
  const [emails, setEmails] = useState(0);
  const [timeline, setTimeline] = useState("standard"); // flexible | standard | accelerated

  // PDF preview modal
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Derived values
  const pagesOpt = useMemo(
    () => PAGES_OPTIONS.find((x) => x.id === pagesId) ?? PAGES_OPTIONS[0],
    [pagesId],
  );
  const sectionsOpt = useMemo(
    () =>
      SECTIONS_OPTIONS.find((x) => x.id === sectionsId) ?? SECTIONS_OPTIONS[1],
    [sectionsId],
  );

  const totalSections = useMemo(() => {
    const raw = pagesOpt.value * sectionsOpt.value;
    return Math.max(1, Math.round(raw));
  }, [pagesOpt.value, sectionsOpt.value]);

  // Keep informationalOnly in sync
  useEffect(() => {
    const any = Object.entries(features).some(
      ([k, v]) => k !== "informationalOnly" && v === true,
    );
    if (any && features.informationalOnly) {
      setFeatures((s) => ({ ...s, informationalOnly: false }));
    }
    if (!any && !features.informationalOnly) {
      setFeatures((s) => ({ ...s, informationalOnly: true }));
    }
  }, [features]);

  const selectedAddons = useMemo(() => {
    const keys = [];
    if (features.blog) keys.push("blog");
    if (features.multilanguage) keys.push("multilanguage");
    if (features.booking) keys.push("booking");
    if (features.payments) keys.push("payments");
    if (features.dashboard_simple) keys.push("dashboard_simple");
    if (features[ADVANCED_SYSTEM_KEY]) keys.push(ADVANCED_SYSTEM_KEY);
    if (features.integrations) keys.push("integrations");
    return keys;
  }, [features]);

  // Force custom logic (safety)
  const forceCustom = useMemo(() => {
    // Advanced system => custom
    if (features[ADVANCED_SYSTEM_KEY]) return true;

    // Blog + multilanguage + high size => custom
    if (features.blog && features.multilanguage && totalSections > 14)
      return true;

    // Very large structure => custom
    if (totalSections > THRESHOLDS.premiumMax) return true;

    // Payments + big site + i18n => likely custom
    if (features.payments && features.multilanguage && totalSections > 12)
      return true;

    return false;
  }, [features, totalSections]);

  const plan = useMemo(
    () => estimatePlan(totalSections, forceCustom),
    [totalSections, forceCustom],
  );

  const planLabel = useMemo(() => {
    if (plan === "starter") return "Starter";
    if (plan === "business") return "Business";
    if (plan === "premium") return "Premium";
    return "Custom";
  }, [plan]);

  const basePrice = useMemo(() => {
    if (plan === "starter") return PRICES.starter;
    if (plan === "business") return PRICES.business;
    if (plan === "premium") return PRICES.premium;
    // custom base (starting point)
    return PRICES.premium + 7000;
  }, [plan]);

  const addonsPrice = useMemo(() => {
    let sum = 0;
    for (const k of selectedAddons) {
      if (k === "multilanguage") continue;
      if (k === ADVANCED_SYSTEM_KEY) continue;
      const a = ADDONS[k];
      if (a) sum += a.price;
    }
    return sum;
  }, [selectedAddons]);

  const emailCost = useMemo(() => {
    const n = Number.isFinite(Number(emails))
      ? Math.max(0, Math.floor(Number(emails)))
      : 0;
    return n * EMAIL_PRICE;
  }, [emails]);

  const multipliers = useMemo(() => {
    const m = [];
    const posM = positioningMultiplier(support);
    if (posM !== 1)
      m.push({ label: `Support ×${posM.toFixed(2)}`, value: posM });

    if (features.multilanguage) {
      const i18nM = i18nMultiplier(totalSections);
      m.push({ label: `Multilanguage ×${i18nM.toFixed(2)}`, value: i18nM });
    }

    const tM = timelineMultiplier(timeline, plan === "custom" || forceCustom);
    if (tM !== 1) m.push({ label: `Accelerated ×${tM.toFixed(2)}`, value: tM });

    return m;
  }, [
    support,
    features.multilanguage,
    totalSections,
    timeline,
    plan,
    forceCustom,
  ]);

  const priceEstimate = useMemo(() => {
    // Regla: NO multiplicadores sobre multiplicadores locos.
    // Base + addons = subtotal.
    // Multipliers se aplican al subtotal UNA VEZ.
    let subtotal = basePrice + addonsPrice + emailCost;

    const core = basePrice + addonsPrice; // esto sí se multiplica

    let mult = 1;
    for (const x of multipliers) mult *= x.value;

    const total = core * mult + emailCost + DOMAIN_ANNUAL_FEE;

    // Range: +- 8% para dar margen realista
    const low = clampCurrency(total * 0.92);
    const high = clampCurrency(total * 1.08);

    const isOverCap = high >= HARD_CAP || plan === "custom" || forceCustom;

    return {
      subtotal,
      mult,
      total,
      priceLow: low,
      priceHigh: high,
      isOverCap,
    };
  }, [basePrice, addonsPrice, multipliers, emailCost, plan, forceCustom]);

  const days = useMemo(() => {
    return estimateDays(
      plan,
      totalSections,
      selectedAddons,
      features.multilanguage,
      support,
      timeline,
      forceCustom,
    );
  }, [
    plan,
    totalSections,
    selectedAddons,
    features.multilanguage,
    support,
    timeline,
    forceCustom,
  ]);

  const summary = useMemo(() => {
    const featLabels = [];

    if (features.blog) featLabels.push(t("quote.summary.features.blog"));
    if (features.multilanguage)
      featLabels.push(t("quote.summary.features.multilanguage"));
    if (features.booking) featLabels.push(t("quote.summary.features.booking"));
    if (features.payments)
      featLabels.push(t("quote.summary.features.payments"));
    if (features.dashboard_simple)
      featLabels.push(t("quote.summary.features.dashboard_simple"));
    if (features[ADVANCED_SYSTEM_KEY])
      featLabels.push(t("quote.summary.features.advanced_system"));
    if (features.integrations)
      featLabels.push(t("quote.summary.features.integrations"));

    const supportLabel =
      support === "ready"
        ? t("quote.summary.support.ready")
        : support === "guidance"
          ? t("quote.summary.support.guidance")
          : t("quote.summary.support.full");

    const timelineLabel =
      timeline === "flexible"
        ? t("quote.summary.timeline.flexible")
        : timeline === "standard"
          ? t("quote.summary.timeline.standard")
          : t("quote.summary.timeline.accelerated");

    return {
      pagesLabel: pagesOpt.label,
      sectionsLabel: sectionsOpt.label,
      totalSections,
      featuresLabel: featLabels.length
        ? featLabels.join(", ")
        : t("quote.summary.none"),
      supportLabel,
      emails: Math.max(0, Math.floor(Number(emails) || 0)),
      emailCost,
      timelineLabel,
    };
  }, [
    t,
    lang,
    features,
    support,
    timeline,
    pagesOpt.label,
    sectionsOpt.label,
    totalSections,
    emails,
    emailCost,
  ]);

  const estimate = useMemo(() => {
    return {
      planLabel,
      isOverCap: priceEstimate.isOverCap,
      priceLow: priceEstimate.priceLow,
      priceHigh: priceEstimate.priceHigh,
      days,
    };
  }, [
    planLabel,
    priceEstimate.isOverCap,
    priceEstimate.priceLow,
    priceEstimate.priceHigh,
    days,
  ]);

  const steps = useMemo(() => {
    return [
      {
        title: t("quote.steps.structure.title"),
        subtitle: t("quote.steps.structure.subtitle"),
      },
      {
        title: t("quote.steps.functionality.title"),
        subtitle: t("quote.steps.functionality.subtitle"),
      },
      {
        title: t("quote.steps.support.title"),
        subtitle: t("quote.steps.support.subtitle"),
      },
      {
        title: t("quote.steps.infra.title"),
        subtitle: t("quote.steps.infra.subtitle"),
      },
      {
        title: t("quote.steps.time.title"),
        subtitle: t("quote.steps.time.subtitle"),
      },
    ];
  }, [lang, t]);

  const progress = useMemo(
    () => Math.round(((step + 1) / steps.length) * 100),
    [step, steps.length],
  );

  function next() {
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function openPdfPreview() {
    // build pdf, create blob url, open modal
    const doc = buildPdf({
      summary,
      estimate,
      breakdown: {
        basePrice,
        addonsPrice,
        multipliers, // [{label, value}]
        emailCost: summary.emailCost,
        planLabel: estimate.planLabel,
      },
      t,
      lang,
    });
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setOpenPdf(true);
  }

  function downloadPdf() {
    const doc = buildPdf({
      summary,
      estimate,
      breakdown: {
        basePrice,
        addonsPrice,
        multipliers, // [{label, value}]
        emailCost: summary.emailCost,
        planLabel: estimate.planLabel,
      },
      t,
      lang,
    });
    doc.save("jumalancers-instant-quote.pdf");
  }

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // UI blocks for each step
  function StepContent() {
    if (step === 0) {
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-500">
                {t("quote.q1")}
              </p>
              <div className="space-y-2">
                {PAGES_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.id}
                    active={pagesId === o.id}
                    onClick={() => setPagesId(o.id)}
                  >
                    {o.label}{" "}
                    {o.label === "1"
                      ? t("quote.q1_suffix_singular")
                      : t("quote.q1_suffix_plural")}
                  </OptionButton>
                ))}
              </div>
              <p className="text-xs text-text-500 mt-1">
                {t("quote.q1_help_a")}{" "}
                <span className="font-semibold">/services</span>{" "}
                {t("quote.q1_help_b")}{" "}
                <span className="font-semibold">/contact</span>.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-500">
                {t("quote.q2")}
              </p>
              <div className="space-y-2">
                {SECTIONS_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.id}
                    active={sectionsId === o.id}
                    onClick={() => setSectionsId(o.id)}
                  >
                    {o.label} {t("quote.q2_suffix")}
                  </OptionButton>
                ))}
              </div>
              <p className="text-xs text-text-500 mt-1">
                {t("quote.q2_help_a")}{" "}
                <span className="font-semibold">hero</span>{" "}
                {t("quote.q2_help_b")}{" "}
                <span className="font-semibold">footer</span>.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-700">
              <Pill>
                {t("quote.estimatedTotalSections")}: {totalSections}
              </Pill>
              <Pill>
                {t("quote.scopeLevel")}: {planLabel}
              </Pill>
            </div>
            <p className="mt-2 text-sm text-text-700 leading-relaxed">
              {t("quote.structureHint")}
            </p>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-text-500">{t("quote.q3")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Checkbox
              checked={features.blog}
              onChange={(v) => setFeatures((s) => ({ ...s, blog: v }))}
              label={t("quote.features.blog.label")}
              note={t("quote.features.blog.note")}
            />
            <Checkbox
              checked={features.multilanguage}
              onChange={(v) => setFeatures((s) => ({ ...s, multilanguage: v }))}
              label={t("quote.features.multilanguage.label")}
              note={t("quote.features.multilanguage.note")}
            />
            <Checkbox
              checked={features.booking}
              onChange={(v) => setFeatures((s) => ({ ...s, booking: v }))}
              label={t("quote.features.booking.label")}
              note={t("quote.features.booking.note")}
            />
            <Checkbox
              checked={features.payments}
              onChange={(v) => setFeatures((s) => ({ ...s, payments: v }))}
              label={t("quote.features.payments.label")}
              note={t("quote.features.payments.note")}
            />
            <Checkbox
              checked={features.dashboard_simple}
              onChange={(v) =>
                setFeatures((s) => ({ ...s, dashboard_simple: v }))
              }
              label={t("quote.features.dashboard_simple.label")}
              note={t("quote.features.dashboard_simple.note")}
            />
            <Checkbox
              checked={features[ADVANCED_SYSTEM_KEY]}
              onChange={(v) =>
                setFeatures((s) => ({ ...s, [ADVANCED_SYSTEM_KEY]: v }))
              }
              label={t("quote.features.advanced_system.label")}
              note={t("quote.features.advanced_system.note")}
            />
            <div className="md:col-span-2">
              <Checkbox
                checked={features.integrations}
                onChange={(v) =>
                  setFeatures((s) => ({ ...s, integrations: v }))
                }
                label={t("quote.features.integrations.label")}
                note={t("quote.features.integrations.note")}
              />
            </div>
          </div>

          {plan === "custom" || forceCustom ? (
            <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
              <p className="text-sm font-semibold text-text-900">
                {t("quote.customDetectedTitle")}
              </p>
              <p className="mt-1 text-sm text-text-700 leading-relaxed">
                {t("quote.customDetectedDesc_a")}{" "}
                <span className="font-semibold">
                  {t("quote.customDetectedDesc_b")}
                </span>
                .
              </p>
            </div>
          ) : null}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-text-500">{t("quote.q4")}</p>

          <div className="space-y-2">
            <OptionButton
              active={support === "ready"}
              onClick={() => setSupport("ready")}
            >
              {t("quote.supportOptions.ready")}
            </OptionButton>
            <OptionButton
              active={support === "guidance"}
              onClick={() => setSupport("guidance")}
            >
              {t("quote.supportOptions.guidance")}
            </OptionButton>
            <OptionButton
              active={support === "full"}
              onClick={() => setSupport("full")}
            >
              {t("quote.supportOptions.full")}
            </OptionButton>
          </div>

          <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
            <p className="text-sm text-text-700 leading-relaxed">
              {t("quote.supportHint")}
            </p>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-text-500">{t("quote.q5")}</p>

          <div className="rounded-3xl border border-primary-900/10 bg-bg-50 p-4">
            <label className="block text-sm font-semibold text-text-900">
              {t("quote.emailsLabel")}
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min={0}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="
                  h-11 w-32 rounded-2xl
                  border border-primary-900/15 bg-bg-50
                  px-3 text-sm text-text-900
                  focus:outline-none focus:ring-2 focus:ring-primary-500/30
                "
              />
              <span className="text-sm text-text-700">
                {t("quote.perAccount_a")}{" "}
                <span className="font-semibold">$350</span>{" "}
                {t("quote.perAccount_b")}
              </span>
            </div>

            <div className="mt-3 text-sm text-text-700">
              {t("quote.emailCostLabel")}{" "}
              <span className="font-semibold">MXN ${formatMXN(emailCost)}</span>{" "}
              {t("quote.perYear")}
            </div>
          </div>

          <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
            <p className="text-sm text-text-700 leading-relaxed">
              {t("quote.emailHint")}
            </p>
          </div>
        </div>
      );
    }

    // step 4
    return (
      <div className="space-y-4">
        <p className="text-xs font-semibold text-text-500">{t("quote.q6")}</p>

        <div className="space-y-2">
          <OptionButton
            active={timeline === "flexible"}
            onClick={() => setTimeline("flexible")}
          >
            {t("quote.timeline.flexible")}
          </OptionButton>
          <OptionButton
            active={timeline === "standard"}
            onClick={() => setTimeline("standard")}
          >
            {t("quote.timeline.standard")}
          </OptionButton>
          <OptionButton
            active={timeline === "accelerated"}
            onClick={() => setTimeline("accelerated")}
          >
            {t("quote.timeline.accelerated")}
          </OptionButton>
        </div>

        <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
          <p className="text-sm text-text-700 leading-relaxed">
            {t("quote.timelineHint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="quote" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-primary-500 tracking-widest">
            {t("quote.badge")}
          </p>

          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
            {t("quote.title")}
          </h2>

          <p className="mt-4 text-base text-text-700 leading-relaxed">
            {t("quote.desc")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wizard */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-bg-50 border border-primary-900/10 overflow-hidden">
              {/* Top bar */}
              <div className="px-5 sm:px-6 py-5 bg-bg-100 border-b border-primary-900/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-500">
                      {t("quote.step")} {step + 1} {t("quote.of")}{" "}
                      {steps.length}
                    </p>
                    <h3 className="mt-1 text-lg sm:text-xl font-semibold text-text-900">
                      {steps[step].title}
                    </h3>
                    <p className="mt-1 text-sm text-text-700">
                      {steps[step].subtitle}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-text-500">
                      {t("quote.progress")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-text-900">
                      {progress}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="px-5 sm:px-6 py-6">
                <StepContent />

                {/* Nav */}
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className="
                      h-11 px-4 rounded-full
                      bg-bg-100 text-text-900
                      font-semibold
                      inline-flex items-center justify-center gap-2
                      hover:bg-bg-200/60 transition
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("quote.back")}
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    disabled={step === steps.length - 1}
                    className="
                      h-11 px-4 rounded-full
                      bg-primary-500 text-bg-50
                      font-semibold
                      inline-flex items-center justify-center gap-2
                      hover:opacity-90 transition
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {t("quote.next")}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time estimate panel */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-bg-50 border border-primary-900/10 overflow-hidden">
              <div className="px-5 sm:px-6 py-5 bg-bg-100 border-b border-primary-900/10">
                <p className="text-xs font-semibold text-text-500">
                  {t("quote.realtime")}
                </p>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-text-700">
                      {t("quote.investment")}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-text-900 tracking-tight">
                      {priceEstimate.isOverCap ? (
                        <>MXN ${formatMXN(HARD_CAP)}+</>
                      ) : (
                        <>
                          MXN ${formatMXN(priceEstimate.priceLow)} – $
                          {formatMXN(priceEstimate.priceHigh)}
                        </>
                      )}
                    </p>
                    <p className="mt-2 text-sm text-text-700 inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-500" />
                      {days[0]}–{days[1]} {t("quote.businessDays")}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-text-500">
                      {t("quote.reference")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-text-900 inline-flex items-center gap-2 justify-end">
                      <Layers3 className="h-4 w-4 text-primary-500" />
                      {planLabel}
                    </p>
                  </div>
                </div>

                {priceEstimate.isOverCap ? (
                  <div className="mt-4 rounded-2xl bg-bg-50 border border-primary-900/10 px-4 py-3">
                    <p className="text-sm font-semibold text-text-900">
                      {t("quote.customRecommendedTitle")}
                    </p>
                    <p className="mt-1 text-sm text-text-700 leading-relaxed">
                      {t("quote.customRecommendedDesc_a")}{" "}
                      <span className="font-semibold">
                        MXN ${formatMXN(HARD_CAP)}+
                      </span>
                      . {t("quote.customRecommendedDesc_b")}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="px-5 sm:px-6 py-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Pill>
                    {t("quote.pages")}: {summary.pagesLabel}
                  </Pill>
                  <Pill>
                    {t("quote.sectionsAvg")}: {summary.sectionsLabel}
                  </Pill>
                  <Pill>
                    {t("quote.totalSections")}: {summary.totalSections}
                  </Pill>
                </div>

                <div className="rounded-3xl bg-bg-100 border border-primary-900/10 p-4">
                  <p className="text-xs font-semibold text-text-500">
                    {t("quote.includedFactors")}
                  </p>
                  <div className="mt-2 space-y-2 text-sm text-text-700">
                    <div className="flex items-center justify-between">
                      <span>
                        {t("quote.base")} ({planLabel})
                      </span>
                      <span className="font-semibold">
                        MXN ${formatMXN(basePrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("quote.addons")}</span>
                      <span className="font-semibold">
                        MXN ${formatMXN(addonsPrice)}
                      </span>
                    </div>
                    {multipliers.length ? (
                      <div className="pt-2 border-t border-primary-900/10 space-y-1">
                        {multipliers.map((m) => (
                          <div
                            key={m.label}
                            className="flex items-center justify-between text-xs text-text-600"
                          >
                            <span>{m.label}</span>
                            <span>×</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-3xl bg-bg-50 border border-primary-900/10 p-4">
                  <p className="text-xs font-semibold text-text-500">
                    {t("quote.infraSeparate")}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm text-text-700">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary-500" />
                      {t("quote.corporateEmails")}
                    </span>
                    <span className="font-semibold">
                      MXN ${formatMXN(emailCost)} {t("quote.perYear")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-text-500">
                    {t("quote.emailsBilledSeparately")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={openPdfPreview}
                    className="
                      h-11 px-5 rounded-full
                      bg-primary-500 text-bg-50
                      font-semibold
                      inline-flex items-center justify-center gap-2
                      hover:opacity-90 transition
                    "
                  >
                    {t("quote.previewPdf")} <FileDown className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="
                      h-11 px-5 rounded-full
                      bg-bg-100 text-text-900
                      font-semibold
                      inline-flex items-center justify-center gap-2
                      hover:bg-bg-200/60 transition
                    "
                  >
                    {t("quote.downloadPdf")}
                  </button>
                </div>

                <p className="text-xs text-text-500 leading-relaxed">
                  {t("quote.disclaimer")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview Modal */}
        <Modal
          open={openPdf}
          onClose={() => setOpenPdf(false)}
          title={t("quote.pdfPreviewTitle")}
          desc={t("quote.pdfPreviewDesc")}
        >
          <div className="p-4 sm:p-6 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-primary-900/10 bg-bg-50">
              <div className="px-4 py-3 bg-bg-100 border-b border-primary-900/10 flex items-center justify-between">
                <p className="text-xs font-semibold text-text-500">
                  {t("quote.preview")}
                </p>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="
                    h-10 px-4 rounded-full
                    bg-primary-500 text-bg-50
                    font-semibold
                    inline-flex items-center justify-center gap-2
                    hover:opacity-90 transition
                  "
                >
                  {t("quote.downloadPdf")} <FileDown className="h-4 w-4" />
                </button>
              </div>

              <div className="h-[70dvh] bg-bg-50">
                {pdfUrl ? (
                  <iframe
                    title="PDF Preview"
                    src={pdfUrl}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <p className="text-sm text-text-700">
                      {t("quote.generating")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-text-500 leading-relaxed">
              {t("quote.tip")}
            </div>
          </div>
        </Modal>
      </div>
    </section>
  );
}
