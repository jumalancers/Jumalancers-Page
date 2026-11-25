// Eventos de Google Analytics 4 (gtag se define en index.html; si no existe, no pasa nada).
// Eventos clave para marcar en GA4: whatsapp_click, email_click, generate_lead, quote_pdf.
export function track(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { page_path: window.location.pathname, ...params });
}

// Dónde estaba el enlace: id de la sección, o navbar / footer / menú móvil.
function placeOf(el) {
  if (el.closest("header")) return "navbar";
  if (el.closest("footer")) return "footer";
  if (el.closest('nav[aria-label]') && !el.closest("main")) return "menu";
  return el.closest("section[id]")?.id || "page";
}

/** Un solo listener: clics en WhatsApp y correo de todo el sitio. */
export function trackContactClicks() {
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("https://wa.me/")) track("whatsapp_click", { placement: placeOf(a) });
      else if (href.startsWith("mailto:")) track("email_click", { placement: placeOf(a) });
    },
    { capture: true }
  );
}
