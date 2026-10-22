// Prerender (SSG) de las rutas por idioma:
//   dist/index.html     -> español  (/)
//   dist/en/index.html  -> inglés   (/en/)
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

const { render, LANGS, LANG_PATH } = mod;

for (const lang of LANGS) {
  let out;
  try {
    out = await render(lang);
  } catch (err) {
    fail(`Falló el render SSR para "${lang}". Revisa el componente indicado en el stack.`, err);
  }
  if (!out.html || out.html.length < 500) fail(`El HTML renderizado para "${lang}" está vacío o es sospechosamente corto.`);

  const page = template
    .replace(/<html lang="[^"]*"/, `<html lang="${out.htmlLang}"`)
    .replace("<!--app-preload-->", () => preload)
    .replace("<!--app-head-->", () => out.head)
    .replace("<!--app-html-->", () => out.html);

  const rel = LANG_PATH[lang].replace(/^\//, "");
  const file = path.join(dist, rel, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);

  const h1 = (out.html.match(/<h1[\s>]/g) || []).length;
  const h2 = (out.html.match(/<h2[\s>]/g) || []).length;
  const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
  console.log(`[prerender] ${lang.padEnd(2)} -> ${path.relative(root, file)}  (${kb} KB, h1=${h1}, h2=${h2})`);
  if (h1 !== 1) console.warn(`[prerender] Aviso: ${lang} tiene ${h1} <h1> (debería ser exactamente 1).`);
}

// lastmod del sitemap = fecha del build
const sitemap = path.join(dist, "sitemap.xml");
if (fs.existsSync(sitemap)) {
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(sitemap, fs.readFileSync(sitemap, "utf8").replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`));
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
