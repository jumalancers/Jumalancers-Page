import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DICT } from "./data/Dict.js";

const LangContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const value = useMemo(() => {
    const t = (key) => {
      const v = getByPath(DICT[lang], key);
      return v ?? key; // fallback feo pero útil
    };
    const toggleLang = () => setLang((p) => (p === "es" ? "en" : "es"));
    return { lang, setLang, toggleLang, t };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider />");
  return ctx;
}
