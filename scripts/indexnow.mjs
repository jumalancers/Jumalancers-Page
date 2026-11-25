// Avisa a Bing y a los demás buscadores de IndexNow que hay páginas nuevas o cambiadas.
// Uso (DESPUÉS de que Cloudflare publique):  node scripts/indexnow.mjs [url1 url2 ...]
// Sin argumentos manda todas las URLs del sitemap publicado.
// La clave es el archivo public/<clave>.txt (debe estar publicado en la raíz del sitio).
import fs from "node:fs";

const HOST = "jumalancers.com";
const root = new URL("..", import.meta.url).pathname;
const keyFile = fs.readdirSync(`${root}public`).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No hay archivo de clave IndexNow en public/");
const key = keyFile.replace(".txt", "");

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const live = await fetch(`https://${HOST}/${key}.txt`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error("La clave todavía no está publicada; espera al deploy.");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} · ${urls.length} URLs`);
