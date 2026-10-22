/* eslint-disable react-refresh/only-export-components */
// Entrada SSR usada SOLO por scripts/prerender.mjs (vite build --ssr).
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import App from "./App.jsx";
import { LangProvider } from "./i18n.jsx";
import { headTags, HTML_LANG } from "./seo.js";

/**
 * Renderiza la app completa a HTML para un idioma.
 * Usa renderToPipeableStream (onAllReady) para poder reportar el componentStack
 * exacto si alguna sección falla en SSR.
 */
export function render(lang) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
    });
    sink.on("finish", () => {
      if (errors.length) {
        const e = errors[0];
        e.error.message = `[SSR ${lang}] ${e.error.message}\nComponent stack:${e.componentStack || " (n/d)"}`;
        reject(e.error);
      } else {
        resolve({ html, head: headTags(lang), htmlLang: HTML_LANG[lang] });
      }
    });

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <LangProvider initialLang={lang}>
          <App />
        </LangProvider>
      </StrictMode>,
      {
        onAllReady() {
          pipe(sink);
        },
        onShellError(error) {
          reject(withStack(error, errors[0]?.componentStack, lang));
        },
        onError(error, info) {
          errors.push({ error, componentStack: info?.componentStack });
        },
      }
    );
  });
}

function withStack(error, componentStack, lang) {
  if (error && typeof error === "object") {
    error.message = `[SSR ${lang}] ${error.message}\nComponent stack:${componentStack || " (n/d)"}`;
  }
  return error;
}

export { LANGS, LANG_PATH } from "./seo.js";
