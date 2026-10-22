/**
 * Generación del PDF de la cotización.
 * Este módulo (y jspdf) se carga con import() dinámico solo cuando el
 * usuario pide ver/descargar el PDF, para no inflar el bundle principal.
 * Precio, alcance y desglose salen de computeQuote() (engine.js).
 */
import jsPDF from "jspdf";
import {
  CONTACT,
  formatUSD,
  multiplierLabel,
  planName,
  priceText,
} from "./engine.js";

export function buildPdf({ summary, estimate, breakdown, t, lang }) {
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

  const isCustomScope = estimate.plan === "custom" || estimate.isOverCap;

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

  const planIncludes = () =>
    t(`quote.pdf.includes.${isCustomScope ? "custom" : estimate.plan}`);

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
    priceText(estimate, t),
    estimate.isOverCap
      ? t("quote.pdf.investmentHintOverCap")
      : estimate.priceMode === "from"
        ? t("quote.pdf.investmentHintFrom")
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
    estimate.plan === "custom"
      ? t("quote.pdf.custom")
      : `${t("quote.pdf.similarTo")} ${planName(estimate, t)}`,
    null,
  );

  y += 64;

  // ---------- What’s included ----------
  y = sectionTitle(t("quote.pdf.includesTitle"), y);
  const includes = planIncludes();
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
  yr = kv(
    rightX,
    yr + 10,
    t("quote.pdf.emails"),
    t("quote.pdf.emailsValue")
      .replace("{n}", String(summary.emails))
      .replace("{inc}", String(summary.includedEmails))
      .replace("{extra}", String(summary.extraEmails)),
    colTextW,
  );

  y = Math.max(yl, yr) + 12;

  // ---------- Pricing breakdown ----------
  y = sectionTitle(t("quote.pdf.breakdownTitle"), y);

  const base = breakdown?.basePrice ?? null;
  const addons = breakdown?.addonsPrice ?? null;
  const emailCost = breakdown?.emailCost ?? summary.emailCost ?? 0;
  const mults = breakdown?.multipliers ?? [];

  const multText = `${t("quote.pdf.multipliersApplied")}: ${
    mults.length
      ? mults.map((m) => multiplierLabel(m, t)).join(", ")
      : t("quote.pdf.none")
  }`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const noteLines = doc.splitTextToSize(
    t(estimate.plan === "custom" ? "quote.pdf.noteCustom" : "quote.pdf.noteDomainAndExtras"),
    W - 32,
  );
  const multLines = doc.splitTextToSize(multText, W - 32);
  const itemCount = (base != null ? 1 : 0) + (addons != null ? 1 : 0) + 2;
  const cardH = 18 + itemCount * 16 + (noteLines.length + multLines.length) * 12 + 14;

  // Breakdown card (cream surface)
  card(M, y - 6, W, cardH, C.soft);

  let by = y + 18;

  const lineItem = (label, value, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    setText(bold ? C.ink : C.muted);
    doc.text(label, M + 16, by);
    doc.text(value, pageW - M - 16 - doc.getTextWidth(value), by);
    by += 16;
  };

  if (base != null)
    lineItem(
      `${t("quote.pdf.baseScopeRef")} · ${planName(estimate, t)}`,
      `$${formatUSD(base)}`,
    );
  if (addons != null)
    lineItem(t("quote.pdf.addons"), `$${formatUSD(addons)}`);

  lineItem(
    t(estimate.plan === "custom" ? "quote.pdf.domainSsl" : "quote.pdf.domainHosting"),
    t("quote.pdf.included"),
  );
  lineItem(
    t("quote.pdf.corporateEmailsAnnual"),
    `$${formatUSD(emailCost)}`,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setText(C.faint);
  by += 2;
  doc.text(multLines, M + 16, by);
  by += multLines.length * 12;
  doc.text(noteLines, M + 16, by);

  y += cardH + 30;

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
