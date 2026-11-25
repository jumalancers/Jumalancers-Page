// SEO por idioma: rutas, <head> y datos estructurados (JSON-LD).
// Lo usan el prerender (scripts/prerender.mjs vía entry-server) y el cliente
// (i18n.jsx actualiza title/description al cambiar de idioma sin recargar).
import { SITE } from "./data/site.js";
import { getPage, pathOf } from "./routes.js";
import { SERVICES as SERVICE_PAGES, PAGE_UI, PROJECT_SERVICE } from "./data/pages/services.js";
import { PROJECTS } from "./data/projects.js";

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
    title: "Diseño de páginas web en Tijuana para México y EE. UU. | Jumalancers",
    description:
      "Estudio de diseño web en Tijuana: páginas web rápidas, landing pages y sistemas a medida para negocios en México y EE. UU., en español, inglés o bilingües. Precio fijo en USD.",
    ogTitle: "Jumalancers | Diseño de páginas web en Tijuana para México y EE. UU.",
    ogDescription:
      "Páginas web rápidas, landing pages y sistemas web a medida para negocios en México y EE. UU. En español, inglés o bilingües, con precio fijo en USD.",
    ogImage: "/og-image.jpg",
    ogImageAlt:
      "Jumalancers, estudio de diseño web en Tijuana, con capturas de sitios web de clientes",
  },
  en: {
    title: "Website Design in Tijuana for the US & Mexico | Jumalancers",
    description:
      "Web design studio in Tijuana: fast websites, landing pages and custom web apps for businesses in the US and Mexico, in English, Spanish or bilingual. Fixed USD pricing.",
    ogTitle: "Jumalancers | Website Design in Tijuana for the US & Mexico",
    ogDescription:
      "Fast websites, landing pages and custom web apps for businesses in the US and Mexico. In English, Spanish or bilingual, with fixed USD pricing.",
    ogImage: "/og-image-en.jpg",
    ogImageAlt:
      "Jumalancers web design studio in Tijuana, with screenshots of client websites",
  },
};

const PROJECT_TITLES = {
  jmyan: { es: "JM & AN Abogados: página web bilingüe para despacho legal", en: "JM & AN Abogados: bilingual website for a law firm" },
  jaka: { es: "Jaka Express: página web para empresa de logística en Tijuana", en: "Jaka Express: website for a cross-border logistics company" },
  waldo: { es: "Waldo Distribuciones: catálogo en línea y sistema web a medida", en: "Waldo Distribuciones: online catalog and custom web app" },
  todomex: { es: "TodoMex Paquetería: página web con formulario de envíos", en: "TodoMex Paquetería: website with a shipping request form" },
};

const clip = (t, n = 158) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n - 1)).replace(/[,;:]$/, "") + "…");

/** title/description/og de cualquier página en un idioma. */
export function metaFor(lang, key = "home") {
  const page = getPage(key);
  const base = META[lang];
  const url = BASE_URL + page[lang];
  if (page.type === "service") {
    const c = SERVICE_PAGES[key][lang];
    return { ...base, title: c.metaTitle, description: c.metaDesc, ogTitle: c.metaTitle, ogDescription: c.metaDesc, url };
  }
  if (page.type === "project") {
    const p = PROJECTS.find((x) => x.id === page.id);
    const title = `${PROJECT_TITLES[p.id]?.[lang] ?? p.name} | Jumalancers`;
    const description = clip(p.summary[lang]);
    return {
      ...base,
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogImage: `/work/${p.id}-desktop.webp`,
      ogImageAlt: `${p.name} — ${PAGE_UI[lang].desktop}`,
      ogImageType: "image/webp",
      url,
    };
  }
  return { ...base, url };
}

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

// Página de servicio de cada oferta del catálogo (mismo orden que SERVICES).
const OFFER_PAGES = ["websites", "landing", "systems", "ecommerce", "seo"];

export function jsonLd(lang, key = "home") {
  const m = metaFor(lang, key);
  const home = META[lang];
  const url = m.url;
  const page = getPage(key);
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
        description: home.description,
        url: `${BASE_URL}/`,
        image: `${BASE_URL}${home.ogImage}`,
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
            itemOffered: {
              "@type": "Service",
              name,
              description,
              provider: { "@id": businessId },
              ...(OFFER_PAGES[i] ? { url: BASE_URL + pathOf(OFFER_PAGES[i], lang) } : {}),
            },
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
        primaryImageOfPage: { "@type": "ImageObject", url: `${BASE_URL}${m.ogImage}` },
        ...(page.type !== "home" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      },
      ...pageNodes(lang, page, url, businessId),
    ],
  };
}

/** Nodos extra de las páginas internas: migas, servicio o caso, y FAQ. */
function pageNodes(lang, page, url, businessId) {
  if (page.type === "home") return [];
  const ui = PAGE_UI[lang];
  const homeUrl = BASE_URL + LANG_PATH[lang];
  const nodes = [];
  if (page.type === "service") {
    const c = SERVICE_PAGES[page.key][lang];
    const name = `${c.h1} ${c.accent}`.replace(/,\s*$/, "");
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: homeUrl },
        { "@type": "ListItem", position: 2, name: ui.services, item: `${homeUrl}#services` },
        { "@type": "ListItem", position: 3, name: c.eyebrow, item: url },
      ],
    });
    nodes.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name,
      serviceType: c.eyebrow,
      description: c.metaDesc,
      url,
      provider: { "@id": businessId },
      areaServed: [
        { "@type": "Country", name: "México", identifier: "MX" },
        { "@type": "Country", name: "United States", identifier: "US" },
      ],
      availableLanguage: ["Spanish", "English"],
    });
    nodes.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: c.faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }
  if (page.type === "project") {
    const p = PROJECTS.find((x) => x.id === page.id);
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: homeUrl },
        { "@type": "ListItem", position: 2, name: ui.projects, item: `${homeUrl}#portfolio` },
        { "@type": "ListItem", position: 3, name: p.name, item: url },
      ],
    });
    nodes.push({
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: p.name,
      description: p.summary[lang],
      url: p.url,
      dateCreated: String(p.year),
      creator: { "@id": businessId },
      image: `${BASE_URL}/work/${p.id}-desktop.webp`,
      about: SERVICE_PAGES[PROJECT_SERVICE[p.id]] ? { "@id": `${BASE_URL}${pathOf(PROJECT_SERVICE[p.id], lang)}#service` } : undefined,
    });
  }
  return nodes;
}

/** Etiquetas <head> específicas del idioma (se inyectan en el prerender). */
export function headTags(lang, key = "home") {
  const m = metaFor(lang, key);
  const page = getPage(key);
  const url = m.url;
  const other = lang === "es" ? "en" : "es";
  const img = BASE_URL + m.ogImage;
  const isPhoto = !m.ogImageType;
  const ld = JSON.stringify(jsonLd(lang, key)).replace(/</g, "\\u003c");
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es-MX" href="${BASE_URL}${page.es}" />`,
    `<link rel="alternate" hreflang="es" href="${BASE_URL}${page.es}" />`,
    `<link rel="alternate" hreflang="en" href="${BASE_URL}${page.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${page.es}" />`,
    `<meta property="og:type" content="${page.type === "home" ? "website" : "article"}" />`,
    `<meta property="og:site_name" content="Jumalancers" />`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(m.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:image" content="${img}" />`,
    ...(isPhoto
      ? [
          `<meta property="og:image:type" content="image/jpeg" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
        ]
      : [`<meta property="og:image:type" content="${m.ogImageType}" />`]),
    `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join("\n    ");
}
