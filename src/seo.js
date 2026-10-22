// SEO por idioma: rutas, <head> y datos estructurados (JSON-LD).
// Lo usan el prerender (scripts/prerender.mjs vía entry-server) y el cliente
// (i18n.jsx actualiza title/description al cambiar de idioma sin recargar).
import { SITE } from "./data/site.js";

export const BASE_URL = "https://jumalancers.com";
export const LANGS = ["es", "en"];
export const LANG_PATH = { es: "/", en: "/en/" };
export const OG_LOCALE = { es: "es_MX", en: "en_US" };
export const HTML_LANG = { es: "es-MX", en: "en" };

/** Idioma a partir de un pathname ("/en", "/en/..." => en; resto => es). */
export function langFromPath(pathname = "/") {
  return /^\/en(\/|$)/.test(pathname) ? "en" : "es";
}

export const META = {
  es: {
    title: "Diseño de páginas web en Tijuana | Jumalancers",
    description:
      "Diseño de páginas web en Tijuana y desarrollo web para negocios en México y EE. UU.: sitios rápidos, bilingües y sistemas web a medida. Cotiza gratis.",
    ogTitle: "Jumalancers | Diseño y desarrollo web en Tijuana",
    ogDescription:
      "Páginas web rápidas, landing pages y sistemas web a medida para negocios en México y EE. UU. En español, inglés o bilingües, con precio fijo en USD.",
    ogImage: "/og-image.jpg",
    ogImageAlt:
      "Jumalancers, estudio de diseño web en Tijuana, con capturas de sitios web de clientes",
  },
  en: {
    title: "Web Design for Small Businesses | Jumalancers",
    description:
      "Website design for small businesses: fast, SEO-ready English or bilingual sites and custom web apps. Fixed USD pricing, Pacific Time. Free quote.",
    ogTitle: "Jumalancers | Web Design for Small Businesses",
    ogDescription:
      "Fast, SEO-ready websites and custom web apps for small businesses in the US and Mexico. English or bilingual, fixed USD pricing, on Pacific Time.",
    ogImage: "/og-image-en.jpg",
    ogImageAlt:
      "Jumalancers web design studio, with screenshots of client websites",
  },
};

const SERVICES = {
  es: [
    ["Diseño de páginas web", "Sitios web rápidos y optimizados para Google, en español, inglés o bilingües, con precio fijo en USD."],
    ["Landing pages", "Páginas de aterrizaje enfocadas en conversión para campañas de Google y Meta Ads."],
    ["Sistemas web a medida", "Dashboards, catálogos con cotizador, sistemas de pedidos, reservas y automatizaciones."],
    ["Tiendas en línea", "Comercio electrónico y catálogos digitales listos para vender."],
    ["SEO local y Google Business Profile", "Optimización para aparecer en búsquedas locales y en Google Maps."],
    ["Hosting, dominio y mantenimiento", "Publicación, correo profesional, soporte y actualizaciones continuas."],
  ],
  en: [
    ["Website design for small businesses", "Fast, SEO-ready websites in English, Spanish, bilingual or other languages, at fixed USD prices."],
    ["Landing pages", "Conversion-focused landing pages for Google Ads and Meta Ads campaigns."],
    ["Custom web apps", "Dashboards, quoting catalogs, ordering and booking systems, and internal tools."],
    ["E-commerce", "Online stores and digital catalogs ready to sell."],
    ["Local SEO & Google Business Profile", "Optimization to rank in local search and Google Maps."],
    ["Hosting, domain & maintenance", "Launch, professional email, support and ongoing updates."],
  ],
};

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function jsonLd(lang) {
  const m = META[lang];
  const url = BASE_URL + LANG_PATH[lang];
  const orgId = `${BASE_URL}/#organization`;
  const businessId = `${BASE_URL}/#business`;
  const websiteId = `${BASE_URL}/#website`;
  const phone = "+52-664-425-7324";
  const logo = {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    url: `${BASE_URL}/icon-512.png`,
    width: 512,
    height: 512,
    caption: "Jumalancers",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "Jumalancers",
        alternateName: "JM Web Studio",
        url: `${BASE_URL}/`,
        logo,
        image: { "@id": `${BASE_URL}/#logo` },
        email: SITE.email,
        telephone: phone,
        sameAs: [SITE.instagram, SITE.facebook],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phone,
          email: SITE.email,
          contactType: "sales",
          areaServed: ["MX", "US"],
          availableLanguage: ["Spanish", "English"],
        },
      },
      {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": businessId,
        name: "Jumalancers",
        alternateName: "JM Web Studio",
        description: m.description,
        url: `${BASE_URL}/`,
        image: `${BASE_URL}${m.ogImage}`,
        logo: { "@id": `${BASE_URL}/#logo` },
        parentOrganization: { "@id": orgId },
        email: SITE.email,
        telephone: phone,
        priceRange: "$$",
        currenciesAccepted: "MXN, USD",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tijuana",
          addressRegion: "Baja California",
          addressCountry: "MX",
        },
        geo: { "@type": "GeoCoordinates", latitude: 32.5149, longitude: -117.0382 },
        areaServed: [
          { "@type": "City", name: "Tijuana" },
          { "@type": "Country", name: "México", identifier: "MX" },
          { "@type": "Country", name: "United States", identifier: "US" },
        ],
        knowsLanguage: ["es", "en"],
        sameAs: [SITE.instagram, SITE.facebook],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: lang === "es" ? "Servicios de diseño y desarrollo web" : "Web design & development services",
          itemListElement: SERVICES[lang].map(([name, description], i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: { "@type": "Service", name, description, provider: { "@id": businessId } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${BASE_URL}/`,
        name: "Jumalancers",
        alternateName: "JM Web Studio",
        publisher: { "@id": orgId },
        inLanguage: ["es-MX", "en"],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: m.title,
        description: m.description,
        inLanguage: HTML_LANG[lang],
        isPartOf: { "@id": websiteId },
        about: { "@id": businessId },
        primaryImageOfPage: { "@type": "ImageObject", url: `${BASE_URL}${m.ogImage}`, width: 1200, height: 630 },
      },
    ],
  };
}

/** Etiquetas <head> específicas del idioma (se inyectan en el prerender). */
export function headTags(lang) {
  const m = META[lang];
  const url = BASE_URL + LANG_PATH[lang];
  const other = lang === "es" ? "en" : "es";
  const img = BASE_URL + m.ogImage;
  const ld = JSON.stringify(jsonLd(lang)).replace(/</g, "\\u003c");
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es-MX" href="${BASE_URL}/" />`,
    `<link rel="alternate" hreflang="es" href="${BASE_URL}/" />`,
    `<link rel="alternate" hreflang="en" href="${BASE_URL}/en/" />`,
    `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Jumalancers" />`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(m.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join("\n    ");
}
