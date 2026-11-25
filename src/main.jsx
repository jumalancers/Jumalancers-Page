import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./index.css";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import { langFromPath } from "./seo.js";
import { pageFromPath } from "./routes.js";

const container = document.getElementById("root");
const page = pageFromPath(window.location.pathname).key;
// La 404 se prerenderiza en español: se hidrata igual para no desajustar el HTML.
const lang = page === "notfound" ? "es" : langFromPath(window.location.pathname);

const tree = (
  <StrictMode>
    <LangProvider initialLang={lang} page={page}>
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
