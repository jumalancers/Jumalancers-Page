import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { headTags } from "./src/seo.js";

// En dev no hay prerender: inyecta el <head> en español para que el sitio tenga
// title/metas mientras desarrollas. En build los marcadores los llena
// scripts/prerender.mjs con el <head> de cada idioma.
function devHead() {
  return {
    name: "jm-dev-head",
    apply: "serve",
    transformIndexHtml(html, ctx) {
      const lang = ctx?.originalUrl?.startsWith("/en") ? "en" : "es";
      return html.replace("<!--app-head-->", headTags(lang)).replace("<!--app-preload-->", "");
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devHead()],
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // React en su propio chunk (cambia poco => mejor caché entre deploys).
          // jspdf/emailjs NO se agrupan: las secciones los cargan con import() dinámico
          // y Rollup los separa solos (agruparlos aquí los volvía a meter en la carga inicial).
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
        },
      },
    },
  },
  ssr: {
    // lucide-react y fontsource se procesan con Vite al construir el bundle SSR
    noExternal: ["lucide-react"],
  },
});
