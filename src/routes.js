// Páginas del sitio (fuente única de rutas). Cada página existe en español e inglés
// con el mismo contenido; el prerender genera un index.html por ruta.
import { PROJECTS } from "./data/projects.js";

export const SERVICE_KEYS = ["websites", "landing", "systems", "ecommerce", "seo", "bilingual"];

const SERVICE_PATHS = {
  websites: { es: "/servicios/paginas-web/", en: "/en/services/websites/" },
  landing: { es: "/servicios/landing-pages/", en: "/en/services/landing-pages/" },
  systems: { es: "/servicios/sistemas-web/", en: "/en/services/web-apps/" },
  ecommerce: { es: "/servicios/tiendas-en-linea/", en: "/en/services/ecommerce/" },
  seo: { es: "/servicios/seo/", en: "/en/services/seo/" },
  bilingual: { es: "/servicios/sitios-bilingues/", en: "/en/services/bilingual-websites/" },
};

export const PROJECT_SLUGS = {
  jmyan: "jm-an-abogados",
  jaka: "jaka-express",
  waldo: "waldo-distribuciones",
  todomex: "todomex-paqueteria",
};

export const PAGES = [
  { key: "home", type: "home", es: "/", en: "/en/" },
  ...SERVICE_KEYS.map((k) => ({ key: k, type: "service", ...SERVICE_PATHS[k] })),
  ...PROJECTS.filter((p) => PROJECT_SLUGS[p.id]).map((p) => ({
    key: `project-${p.id}`,
    type: "project",
    id: p.id,
    es: `/proyectos/${PROJECT_SLUGS[p.id]}/`,
    en: `/en/projects/${PROJECT_SLUGS[p.id]}/`,
  })),
];

const BY_KEY = Object.fromEntries(PAGES.map((p) => [p.key, p]));

export const getPage = (key) => BY_KEY[key] || BY_KEY.home;

/** Ruta de una página en un idioma. */
export const pathOf = (key, lang) => getPage(key)[lang];

const norm = (p = "/") => {
  const clean = p.split(/[?#]/)[0] || "/";
  return clean.endsWith("/") ? clean : clean + "/";
};

/** Página a partir de un pathname (cualquier idioma). Desconocida => inicio. */
export function pageFromPath(pathname = "/") {
  const p = norm(pathname);
  return PAGES.find((pg) => pg.es === p || pg.en === p) || BY_KEY.home;
}
