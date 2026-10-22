/**
 * Motor de cálculo del cotizador (lógica pura, sin React ni DOM).
 *
 * IMPORTANTE: precios, multiplicadores, umbrales y tiempos son lógica de
 * negocio aprobada por el dueño; no cambiar sin revisarlo con él. El PDF
 * (pdf.js) y la UI (Quote.jsx) solo consumen computeQuote() y priceText().
 *
 * Modelo:
 * - El plan se elige SOLO por número de páginas:
 *   1 → Starter · 2–3 → Business · 4–6 → Premium · 7+ → A medida.
 *   "Sistema avanzado" también lleva a A medida (desde $2,999).
 * - Las secciones por página no cambian de plan; solo aplican un ajuste
 *   ("Páginas extensas") a partir de 7 secciones por página.
 * - Dominio + hosting + SSL del primer año van incluidos (sin cargo).
 * - Cada plan incluye cuentas de correo; las extra se cobran aparte
 *   ($19 USD/año) como infraestructura y NO entran al rango del proyecto.
 * - Rango: mínimo = total; máximo = total × 1.15 (redondeo a 10).
 */

export const CONTACT = {
  phone: "+52 664 425 7324",
  website: "https://jumalancers.com",
};

export const PRICES = {
  starter: 599,
  business: 1199,
  premium: 1999,
  custom: 2999, // "desde" (Systems / App)
};

export const HARD_CAP = 8000; // tope visual: se muestra "$8,000+"

export const EMAIL_PRICE = 19; // USD por cuenta extra, anual

// Cuentas de correo incluidas en cada plan
export const INCLUDED_EMAILS = {
  starter: 1,
  business: 3,
  premium: 5,
  custom: 5,
};

export const RANGE_SPREAD = 1.15; // máximo = total × 1.15

// value = promedio para estimar trabajo (multilenguaje / días)
export const PAGES_OPTIONS = [
  { id: "p1", label: "1", value: 1, plan: "starter" },
  { id: "p2_3", label: "2–3", value: 2.5, plan: "business" },
  { id: "p4_6", label: "4–6", value: 5, plan: "premium" },
  { id: "p7p", label: "7+", value: 7.5, plan: "custom" },
];

// density = multiplicador "Páginas extensas" (no cambia de plan)
export const SECTIONS_OPTIONS = [
  { id: "s1_3", label: "1–3", value: 2, density: 1 },
  { id: "s4_6", label: "4–6", value: 5, density: 1 },
  { id: "s7_9", label: "7–9", value: 8, density: 1.1 },
  { id: "s10p", label: "10+", value: 11, density: 1.2 },
];

export const ADDONS = {
  blog: { label: "Blog", price: 250, days: [2, 4] },
  booking: { label: "Agenda de citas", price: 350, days: [2, 5] },
  payments: { label: "Pagos en línea", price: 500, days: [3, 7] },
  dashboard_simple: {
    label: "Panel interno simple",
    price: 700,
    days: [4, 8],
  },
  integrations: { label: "Integraciones externas", price: 400, days: [3, 6] },
};

// Sistema avanzado: sin precio fijo, lleva el proyecto a "A medida"
export const ADVANCED_SYSTEM_KEY = "system_advanced";

// Orden de las funcionalidades (UI, resumen y addons). La clave i18n de
// "system_advanced" es "advanced_system".
export const FEATURE_KEYS = [
  "blog",
  "multilanguage",
  "booking",
  "payments",
  "dashboard_simple",
  ADVANCED_SYSTEM_KEY,
  "integrations",
];
export const featureI18nKey = (k) =>
  k === ADVANCED_SYSTEM_KEY ? "advanced_system" : k;

export const SUPPORT_OPTIONS = ["ready", "guidance", "full"];
export const TIMELINE_OPTIONS = ["flexible", "standard", "accelerated"];

export const DEFAULT_ANSWERS = {
  pagesId: "p1",
  sectionsId: "s4_6",
  features: Object.fromEntries(FEATURE_KEYS.map((k) => [k, false])),
  support: "ready",
  emails: 1,
  timeline: "standard",
};

// Sitio en varios idiomas: multiplicador según tamaño (más secciones = más traducción)
export function i18nMultiplier(totalSections) {
  if (totalSections <= 8) return 1.12;
  if (totalSections <= 14) return 1.18;
  return 1.25;
}

export function positioningMultiplier(level) {
  // ready: todo listo · guidance: guía estructural · full: copy + posicionamiento
  if (level === "ready") return 1.0;
  if (level === "guidance") return 1.1;
  return 1.2;
}

// Timeline: no promete magia. "Acelerado" solo aplica si no es a medida.
export function timelineMultiplier(timeline, isCustom) {
  if (isCustom) return 1.0;
  if (timeline === "flexible") return 1.0;
  if (timeline === "standard") return 1.0;
  return 1.12; // acelerado (sujeto a alcance)
}

// Redondea a decenas y termina en 9 (precio psicológico): 688.85 → 689
export function clampCurrency(n) {
  const r = Math.round(n / 10) * 10;
  return r >= 10 ? r - 1 : r;
}

export function formatUSD(n) {
  const x = Math.max(0, Math.round(n));
  return x.toLocaleString("es-MX");
}

/** Plan según número de páginas (y sistema avanzado → a medida). */
export function estimatePlan(pagesOpt, forceCustom) {
  if (forceCustom) return "custom";
  return pagesOpt?.plan ?? "starter";
}

export function estimateDays(
  plan,
  totalSections,
  addonsKeys,
  hasI18n,
  positioning,
  timeline,
  forceCustom,
  pages = 1,
) {
  // Días base = los mismos que prometen las tarjetas de planes
  let base;
  if (forceCustom) base = [18, 35];
  else if (plan === "starter") base = [7, 10];
  else if (plan === "business") base = [10, 14];
  else if (plan === "premium") base = [14, 21];
  else base = [18, 35];

  // Solo suman días las secciones por encima de 6 por página (páginas extensas)
  const sizeBoost = Math.max(0, totalSections - 6 * pages);
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

const PLAN_LABELS = {
  starter: "Starter",
  business: "Business",
  premium: "Premium",
  custom: "Systems / App",
};

/** Número de cuentas de correo normalizado (entero >= 0). */
export function normalizeEmails(emails) {
  return Number.isFinite(Number(emails))
    ? Math.max(0, Math.floor(Number(emails)))
    : 0;
}

/**
 * Calcula toda la estimación a partir de las respuestas del wizard.
 */
export function computeQuote({
  pagesId,
  sectionsId,
  features,
  support,
  emails,
  timeline,
}) {
  const pagesOpt =
    PAGES_OPTIONS.find((x) => x.id === pagesId) ?? PAGES_OPTIONS[0];
  const sectionsOpt =
    SECTIONS_OPTIONS.find((x) => x.id === sectionsId) ?? SECTIONS_OPTIONS[1];

  const totalSections = Math.max(
    1,
    Math.round(pagesOpt.value * sectionsOpt.value),
  );

  const selectedAddons = FEATURE_KEYS.filter((k) => features[k]);

  // Única regla extra: sistema avanzado → a medida
  const forceCustom = Boolean(features[ADVANCED_SYSTEM_KEY]);

  const plan = estimatePlan(pagesOpt, forceCustom);
  const isCustom = plan === "custom";
  const planLabel = PLAN_LABELS[plan];
  const basePrice = PRICES[plan];

  let addonsPrice = 0;
  for (const k of selectedAddons) {
    if (k === "multilanguage") continue;
    if (k === ADVANCED_SYSTEM_KEY) continue;
    const a = ADDONS[k];
    if (a) addonsPrice += a.price;
  }

  // Correos: incluidos por plan; solo se cobran las cuentas extra (anual)
  const emailCount = normalizeEmails(emails);
  const includedEmails = INCLUDED_EMAILS[plan];
  const extraEmails = Math.max(0, emailCount - includedEmails);
  const emailCost = extraEmails * EMAIL_PRICE;

  // Multiplicadores (key → etiqueta traducida en la UI/PDF)
  const multipliers = [];
  if (sectionsOpt.density !== 1)
    multipliers.push({ key: "density", value: sectionsOpt.density });
  const posM = positioningMultiplier(support);
  if (posM !== 1) multipliers.push({ key: "support", value: posM });
  if (features.multilanguage)
    multipliers.push({
      key: "multilingual",
      value: i18nMultiplier(totalSections),
    });
  const tM = timelineMultiplier(timeline, isCustom);
  if (tM !== 1) multipliers.push({ key: "accelerated", value: tM });

  // Base + addons = core. Los multiplicadores se aplican al core UNA VEZ.
  const core = basePrice + addonsPrice;
  let mult = 1;
  for (const x of multipliers) mult *= x.value;
  // Total del proyecto (pago único). Dominio/hosting/SSL 1er año: incluidos.
  // Correos extra: infraestructura anual aparte (no se suman aquí).
  const total = core * mult;

  const priceLow = Math.max(basePrice, clampCurrency(total));
  const priceHigh = Math.max(priceLow, clampCurrency(total * RANGE_SPREAD));
  const isOverCap = priceHigh >= HARD_CAP;
  // Cómo se muestra el precio: rango, "desde" (a medida) o "$8,000+"
  const priceMode = isOverCap ? "over" : isCustom ? "from" : "range";

  const days = estimateDays(
    plan,
    totalSections,
    selectedAddons,
    features.multilanguage,
    support,
    timeline,
    isCustom,
    pagesOpt.value,
  );

  return {
    pagesOpt,
    sectionsOpt,
    totalSections,
    selectedAddons,
    forceCustom,
    plan,
    isCustom,
    planLabel,
    basePrice,
    addonsPrice,
    emailCount,
    includedEmails,
    extraEmails,
    emailCost,
    multipliers,
    mult,
    total,
    priceLow,
    priceHigh,
    priceMode,
    isOverCap,
    days,
  };
}

/** Etiqueta traducida de un multiplicador: "Páginas extensas ×1.10". */
export function multiplierLabel(m, t) {
  return `${t(`quote.multipliers.${m.key}`)} ×${m.value.toFixed(2)}`;
}

/** Precio legible: "$599 – $689", "Desde $2,999" o "$8,000+". */
export function priceText(q, t) {
  if (q.priceMode === "over") return `$${formatUSD(HARD_CAP)}+`;
  if (q.priceMode === "from")
    return `${t("quote.from")} $${formatUSD(q.priceLow)}`;
  return `$${formatUSD(q.priceLow)} – $${formatUSD(q.priceHigh)}`;
}

/** Nombre del plan en el idioma activo. */
export function planName(q, t) {
  return t(`quote.planNames.${q.plan}`);
}

/** Resumen legible (para panel y PDF) en el idioma activo. */
export function buildSummary(answers, q, t) {
  const featLabels = q.selectedAddons.map((k) =>
    t(`quote.summary.features.${featureI18nKey(k)}`),
  );
  const support = SUPPORT_OPTIONS.includes(answers.support)
    ? answers.support
    : "full";
  const timeline = TIMELINE_OPTIONS.includes(answers.timeline)
    ? answers.timeline
    : "accelerated";
  return {
    pagesLabel: q.pagesOpt.label,
    sectionsLabel: q.sectionsOpt.label,
    totalSections: q.totalSections,
    featuresLabel: featLabels.length
      ? featLabels.join(", ")
      : t("quote.summary.none"),
    supportLabel: t(`quote.summary.support.${support}`),
    emails: q.emailCount,
    includedEmails: q.includedEmails,
    extraEmails: q.extraEmails,
    emailCost: q.emailCost,
    timelineLabel: t(`quote.summary.timeline.${timeline}`),
  };
}
