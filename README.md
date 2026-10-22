# Jumalancers — sitio web

Sitio de **Jumalancers (JM Web Studio)**, estudio de diseño y desarrollo web en Tijuana para negocios en México y EE. UU. Bilingüe: español en `/` e inglés en `/en/`.

Producción: https://jumalancers.com (Cloudflare Pages).

## Stack

- React 19 + Vite 7
- Tailwind CSS v4 (`@tailwindcss/vite`), tokens y utilidades en `src/index.css`
- Prerender (SSG) con Vite SSR: el HTML de cada idioma se genera en el build y el cliente hidrata con `hydrateRoot`
- Fuentes self-hosted: Geist (variable) e Instrument Serif vía `@fontsource`
- Iconos: `lucide-react`
- Formulario: EmailJS (`@emailjs/browser`); cotizador en PDF: `jspdf`
- Gestor de paquetes: **pnpm**

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (SPA, sin prerender; `/en/` también funciona) |
| `pnpm build` | Build de cliente + build SSR (`dist-ssr/`) + prerender de `dist/index.html` y `dist/en/index.html` |
| `pnpm build:client` | Solo el build de cliente (sin prerender) |
| `pnpm preview` | Sirve `dist/` para probar el build |
| `pnpm lint` | ESLint |

Variables de entorno (`.env`, no se versiona): `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.

## Estructura

```
index.html                 Plantilla. Marcadores <!--app-head-->, <!--app-preload--> y <!--app-html--> los llena el prerender
src/
  main.jsx                 Entrada del cliente (hydrateRoot si hay HTML prerenderizado)
  entry-server.jsx         Entrada SSR (solo para el prerender)
  App.jsx                  Orden de secciones
  i18n.jsx                 LangProvider / useLang(): { lang, setLang, toggleLang, t }
  seo.js                   Títulos, descripciones, Open Graph, hreflang y JSON-LD por idioma
  index.css                Tokens de color, tipografía y utilidades (container-x, section-y, card, accent-serif)
  components/              BackgroundDots, Reveal y primitivas UI (components/ui)
  sections/                Una sección por archivo (Hero, Services, Portafolio, Plans, Quote, Faq, Contact…)
  data/
    site.js                Datos de contacto (email, WhatsApp, redes)
    projects.js            Portafolio: clientes reales
    i18n/<seccion>.js      Textos { es, en } de cada sección (se cargan solos)
scripts/
  prerender.mjs            Genera el HTML por idioma, preload de fuente, lastmod del sitemap y llms.txt
  og-image.mjs             HTML de las imágenes Open Graph (se capturan con Chrome headless)
public/                    robots.txt, sitemap.xml, llms.txt, site.webmanifest, favicons, og-image*.jpg, _headers, capturas (work/)
```

## Idiomas y SEO

- El idioma lo define la URL: `/` = español (es-MX), `/en/` = inglés. No hay redirecciones automáticas por idioma (los bots ven ambas versiones).
- `setLang`/`toggleLang` cambian la URL con `history.pushState`, actualizan `<html lang>`, title y metas, y guardan la preferencia en `localStorage`.
- Cada HTML prerenderizado trae title, description, canonical, hreflang (es-MX, es, en, x-default), Open Graph, Twitter Card y JSON-LD (Organization, ProfessionalService/LocalBusiness con OfferCatalog, WebSite, WebPage). El FAQPage lo emite la sección FAQ.
- Para cambiar textos de SEO edita `src/seo.js`.
- **Regla SSR:** no uses `window`, `document`, `localStorage` ni `navigator` durante el render ni en inicializadores de `useState`; solo dentro de `useEffect` o handlers. Si una sección rompe el prerender, `pnpm build` falla mostrando el componente culpable.

## Agregar un proyecto al portafolio

1. Agrega un objeto a `PROJECTS` en `src/data/projects.js` (`id`, `name`, `url`, `market: "mx" | "us"`, `industry: { es, en }`, `location`, `featured` opcional).
2. Coloca sus capturas WebP en `public/work/`: `<id>-desktop.webp`, `<id>-desktop-720.webp` y `<id>-mobile.webp`.
3. `pnpm build`. La lista de clientes de `llms.txt` se actualiza sola en `dist/`.

## Deploy (Cloudflare Pages)

- Build command: `pnpm build`
- Output directory: `dist`
- Node 20 o superior
- `public/_headers` define caché: `/assets/*` inmutable 1 año, HTML sin caché, imágenes 7 días.
- Pages sirve `dist/en/index.html` en `/en/` y redirige `/en` a `/en/` automáticamente.
- Tras cambios grandes: enviar `https://jumalancers.com/sitemap.xml` en Google Search Console.
