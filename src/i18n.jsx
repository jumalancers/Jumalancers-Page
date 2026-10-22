import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DICT } from "./data/Dict.js";
import { HTML_LANG, LANG_PATH, META, BASE_URL, langFromPath } from "./seo.js";

const LangContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Sincroniza <html lang>, title y metas principales con el idioma activo. */
function syncHead(lang) {
  const m = META[lang];
  const url = BASE_URL + LANG_PATH[lang];
  document.documentElement.setAttribute("lang", HTML_LANG[lang]);
  document.title = m.title;
  setMeta('meta[name="description"]', "content", m.description);
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[property="og:title"]', "content", m.ogTitle);
  setMeta('meta[property="og:description"]', "content", m.ogDescription);
}

/**
 * El idioma lo determina la URL: "/" = español, "/en/" = inglés.
 * - En SSR/prerender se pasa `initialLang`.
 * - En el cliente, main.jsx lo calcula desde location.pathname (igual que el HTML
 *   prerenderizado), así la hidratación coincide.
 * No se usa window/localStorage/navigator durante el render.
 */
export function LangProvider({ initialLang = "es", children }) {
  const [lang, setLangState] = useState(initialLang === "en" ? "en" : "es");

  // Botón atrás/adelante entre "/" y "/en/".
  useEffect(() => {
    const onPop = () => setLangState(langFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    syncHead(lang);
  }, [lang]);

  const setLang = useCallback((next) => {
    const target = typeof next === "function" ? next(langFromPath(window.location.pathname)) : next;
    if (target !== "es" && target !== "en") return;
    try {
      localStorage.setItem("lang", target);
    } catch {
      /* almacenamiento bloqueado: no pasa nada */
    }
    const path = LANG_PATH[target];
    if (window.location.pathname !== path) {
      window.history.pushState({ lang: target }, "", path + window.location.hash);
    }
    setLangState(target);
  }, []);

  const value = useMemo(() => {
    const t = (key) => {
      const v = getByPath(DICT[lang], key);
      return v ?? key; // fallback visible para detectar claves faltantes
    };
    const toggleLang = () => setLang(lang === "es" ? "en" : "es");
    return { lang, setLang, toggleLang, t };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider />");
  return ctx;
}
