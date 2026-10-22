import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./index.css";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import { langFromPath } from "./seo.js";

const container = document.getElementById("root");
const lang = langFromPath(window.location.pathname);

const tree = (
  <StrictMode>
    <LangProvider initialLang={lang}>
      <App />
    </LangProvider>
  </StrictMode>
);

// HTML prerenderizado (build) => hidratar; en dev #root llega vacío => render normal.
if (container.firstElementChild) {
  hydrateRoot(container, tree, {
    onRecoverableError(error, info) {
      if (import.meta.env.DEV || window.location.search.includes("debug")) {
        console.warn("[hydrate] recoverable error:", error, info?.componentStack);
      }
    },
  });
} else {
  createRoot(container).render(tree);
}

// Marca para el script inline de index.html (fallback de [data-reveal] si el JS falla).
window.__jmHydrated = true;
