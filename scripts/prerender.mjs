// Prerender (SSG) de todas las páginas (src/routes.js) en cada idioma:
//   dist/index.html, dist/servicios/.../index.html, dist/proyectos/.../index.html  -> español
//   dist/en/index.html, dist/en/services/..., dist/en/projects/...                 -> inglés
// Requiere haber corrido antes:  vite build  &&  vite build --ssr src/entry-server.jsx --outDir dist-ssr
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

function fail(msg, err) {
  console.error(`\n\x1b[31m[prerender] ${msg}\x1b[0m`);
  if (err) console.error(err?.stack || err);
  process.exit(1);
}

if (!fs.existsSync(path.join(dist, "index.html"))) fail("No existe dist/index.html. Corre primero `vite build`.");
if (!fs.existsSync(ssrEntry)) fail("No existe dist-ssr/entry-server.js. Corre `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.");

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const mark of ["<!--app-head-->", "<!--app-html-->", "<!--app-preload-->"]) {
  if (!template.includes(mark)) fail(`El template dist/index.html no contiene ${mark}`);
}

// Preload de la fuente principal (Geist variable, subset latin) con su nombre hasheado.
const assets = fs.readdirSync(path.join(dist, "assets"));
const geist = assets.find((f) => /^geist-latin-wght-normal-.*\.woff2$/.test(f));
const preload = geist
  ? `<link rel="preload" href="/assets/${geist}" as="font" type="font/woff2" crossorigin />`
  : "";
if (!geist) console.warn("[prerender] Aviso: no se encontró el woff2 latin de Geist para preload.");

let mod;
try {
  mod = await import(pathToFileURL(ssrEntry).href);
} catch (err) {
  fail("No se pudo cargar el bundle SSR (error al importar algún módulo en Node).", err);
}

const { render, LANGS, PAGES } = mod;

for (const pg of PAGES) for (const lang of LANGS) {
  const tag = `${lang} ${pg[lang]}`;
  let out;
  try {
    out = await render(lang, pg.key);
  } catch (err) {
    fail(`Falló el render SSR para "${tag}". Revisa el componente indicado en el stack.`, err);
  }
  if (!out.html || out.html.length < 500) fail(`El HTML renderizado para "${tag}" está vacío o es sospechosamente corto.`);

  const page = template
    .replace(/<html lang="[^"]*"/, `<html lang="${out.htmlLang}"`)
    .replace("<!--app-preload-->", () => preload)
    .replace("<!--app-head-->", () => out.head)
    .replace("<!--app-html-->", () => out.html);

  const rel = pg[lang].replace(/^\//, "");
  const file = path.join(dist, rel, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);

  const h1 = (out.html.match(/<h1[\s>]/g) || []).length;
  const h2 = (out.html.match(/<h2[\s>]/g) || []).length;
  const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
  console.log(`[prerender] ${lang.padEnd(2)} -> ${path.relative(root, file)}  (${kb} KB, h1=${h1}, h2=${h2})`);
  if (h1 !== 1) console.warn(`[prerender] Aviso: ${tag} tiene ${h1} <h1> (debería ser exactamente 1).`);
}

// 404.html: Cloudflare Pages lo sirve con estado 404 en rutas que no existen
// (sin él, devuelve el inicio con 200 y Google lo trata como "soft 404").
{
  const out = await render("es", "notfound");
  const page = template
    .replace(/<html lang="[^"]*"/, `<html lang="${out.htmlLang}"`)
    .replace("<!--app-preload-->", () => preload)
    .replace("<!--app-head-->", () => out.head)
    .replace("<!--app-html-->", () => out.html);
  fs.writeFileSync(path.join(dist, "404.html"), page);
  console.log("[prerender] 404.html");
}

// sitemap.xml generado desde PAGES (cada página en ambos idiomas, con hreflang)
{
  const BASE = "https://jumalancers.com";
  const today = new Date().toISOString().slice(0, 10);
  const alt = (pg) =>
    [
      ["es-MX", pg.es],
      ["es", pg.es],
      ["en", pg.en],
      ["x-default", pg.es],
    ]
      .map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${BASE}${href}" />`)
      .join("\n");
  const urls = PAGES.flatMap((pg) =>
    LANGS.map(
      (lang) => `  <url>\n    <loc>${BASE}${pg[lang]}</loc>\n    <lastmod>${today}</lastmod>\n${alt(pg)}\n  </url>`
    )
  ).join("\n");
  fs.writeFileSync(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
  );
  console.log(`[prerender] sitemap.xml con ${PAGES.length * LANGS.length} URLs`);
}

// llms.txt: lista de clientes siempre sincronizada con src/data/projects.js
const llms = path.join(dist, "llms.txt");
if (fs.existsSync(llms)) {
  try {
    const { PROJECTS } = await import(pathToFileURL(path.join(root, "src/data/projects.js")).href);
    const list = PROJECTS.map(
      (p) => `- [${p.name}](${p.url}): ${p.industry?.en ?? ""} — ${p.location} (${p.market === "us" ? "USA" : "Mexico"})`
    ).join("\n");
    fs.writeFileSync(
      llms,
      fs.readFileSync(llms, "utf8").replace(
        /<!-- clients:start -->[\s\S]*<!-- clients:end -->/,
        () => `<!-- clients:start -->\n${list}\n<!-- clients:end -->`
      )
    );
  } catch (err) {
    console.warn("[prerender] Aviso: no se pudo actualizar llms.txt desde projects.js:", err.message);
  }
}

console.log("[prerender] OK");
