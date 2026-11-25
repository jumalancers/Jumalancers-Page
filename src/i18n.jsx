import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DICT } from "./data/Dict.js";
import { HTML_LANG, metaFor, langFromPath } from "./seo.js";
import { pathOf } from "./routes.js";

const LangContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Sincroniza <html lang>, title y metas principales con el idioma activo. */
function syncHead(lang, pageKey) {
  const m = metaFor(lang, pageKey);
  const url = m.url;
  document.documentElement.setAttribute("lang", HTML_LANG[lang]);
  document.title = m.title;
  setMeta('meta[name="description"]', "content", m.description);
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:title"]', "content", m.ogTitle);
  setMeta('meta[property="og:description"]', "content", m.ogDescription);
}

/**
 * El idioma lo determina la URL: "/..." = español, "/en/..." = inglés.
 * `page` es la clave de la página (routes.js); cambiar de idioma lleva a la misma página.
 * - En SSR/prerender se pasa `initialLang`.
 * - En el cliente, main.jsx lo calcula desde location.pathname (igual que el HTML
 *   prerenderizado), así la hidratación coincide.
 * No se usa window/localStorage/navigator durante el render.
 */
export function LangProvider({ initialLang = "es", page = "home", children }) {
  const [lang, setLangState] = useState(initialLang === "en" ? "en" : "es");

  // Botón atrás/adelante entre "/" y "/en/".
  useEffect(() => {
    const onPop = () => setLangState(langFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    syncHead(lang, page);
  }, [lang, page]);

  const setLang = useCallback((next) => {
    const target = typeof next === "function" ? next(langFromPath(window.location.pathname)) : next;
    if (target !== "es" && target !== "en") return;
    try {
      localStorage.setItem("lang", target);
    } catch {
      /* almacenamiento bloqueado: no pasa nada */
    }
    const path = pathOf(page, target);
    if (window.location.pathname !== path) {
      window.history.pushState({ lang: target }, "", path + window.location.hash);
    }
    setLangState(target);
  }, [page]);

  const value = useMemo(() => {
    const t = (key) => {
      const v = getByPath(DICT[lang], key);
      return v ?? key; // fallback visible para detectar claves faltantes
    };
    const toggleLang = () => setLang(lang === "es" ? "en" : "es");
    const isHome = page === "home";
    // Enlace a una sección del inicio (#services...) desde cualquier página.
    const homeHref = (hash = "") => (isHome ? hash || "#hero" : pathOf("home", lang) + hash);
    const pageHref = (key) => pathOf(key, lang);
    return { lang, setLang, toggleLang, t, page, isHome, homeHref, pageHref };
  }, [lang, setLang, page]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider />");
  return ctx;
}
