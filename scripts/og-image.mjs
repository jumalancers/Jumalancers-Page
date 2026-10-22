// Genera los HTML de la imagen Open Graph (ES/EN). Uso:
//   node scripts/og-image.mjs /tmp/og && google-chrome-stable --headless=new --hide-scrollbars \
//     --allow-file-access-from-files --window-size=1200,630 --screenshot=/tmp/og/og-es.png file:///tmp/og/og-es.html
//   magick /tmp/og/og-es.png -strip -quality 84 -interlace JPEG public/og-image.jpg   (igual para -en)
import fs from "node:fs";
const P = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const S = process.argv[2];
const copy = {
  es: { eyebrow: "Estudio de desarrollo web · Tijuana", h1a: "Sitios web que convierten", h1b: "visitas", h1c: "en clientes", sub: "Diseño de páginas web y sistemas a medida para negocios en México y EE. UU.", foot: "México · Estados Unidos" },
  en: { eyebrow: "Web design & development studio", h1a: "Websites that turn", h1b: "visitors", h1c: "into customers", sub: "Websites and custom web apps for small businesses in Mexico and the US.", foot: "USA · Mexico" },
};
const shots = ["waldo", "jmyan", "todomex", "jaka"];
for (const [lang, c] of Object.entries(copy)) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url(file://${P}/node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:IS;font-style:italic;src:url(file://${P}/node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2) format("woff2")}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:hsl(167 47% 6%);font-family:Geist;color:hsl(37 72% 94%);position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(600px 400px at 85% 30%,hsl(165 65% 45%/.22),transparent 70%),radial-gradient(500px 360px at 0% 100%,hsl(165 65% 45%/.12),transparent 70%)}
.grid{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(90deg,#000 30%,transparent 75%)}
.left{position:absolute;left:72px;top:64px;bottom:60px;width:560px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-weight:600;font-size:26px;letter-spacing:-.02em}
.brand img{width:52px;height:52px}
.eyebrow{margin-top:56px;display:inline-flex;align-self:flex-start;align-items:center;gap:10px;border:1px solid hsl(165 50% 62%/.25);background:hsl(165 65% 45%/.1);color:hsl(165 50% 62%);border-radius:99px;padding:8px 16px;font-size:15px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.eyebrow i{width:7px;height:7px;border-radius:9px;background:hsl(165 55% 50%)}
h1{margin-top:24px;font-size:62px;line-height:1.02;letter-spacing:-.035em;font-weight:600}
h1 em{font-family:IS;font-weight:400;font-style:italic;color:hsl(165 50% 62%);letter-spacing:-.01em}
p{margin-top:22px;font-size:22px;line-height:1.4;color:hsl(37 35% 76%);max-width:500px}
.foot{margin-top:auto;display:flex;gap:18px;align-items:center;font-size:19px;color:hsl(37 22% 62%)}
.foot b{color:hsl(37 72% 94%);font-weight:600}
.dot{width:5px;height:5px;border-radius:9px;background:hsl(37 22% 62%)}
.stack{position:absolute;left:660px;top:0;width:700px;height:630px}
.win{position:absolute;width:520px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:hsl(167 40% 10%);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.bar{height:26px;display:flex;align-items:center;gap:6px;padding:0 12px;background:hsl(167 35% 12%);border-bottom:1px solid rgba(255,255,255,.08)}
.bar span{width:9px;height:9px;border-radius:9px;background:rgba(255,255,255,.18)}
.win img{display:block;width:100%;height:auto}
</style></head><body><div class="glow"></div><div class="grid"></div>
<div class="left">
<div class="brand"><img src="file://${P}/public/Logodark.png">Jumalancers</div>
<div class="eyebrow"><i></i>${c.eyebrow}</div>
<h1>${c.h1a} <em>${c.h1b}</em> ${c.h1c}</h1>
<p>${c.sub}</p>
<div class="foot"><b>jumalancers.com</b><span class="dot"></span>${c.foot}</div>
</div>
<div class="stack">
${[
  [shots[3], 150, -40, 4],
  [shots[2], 40, 360, -3],
  [shots[1], 210, 330, 3],
  [shots[0], 30, 120, -2],
].map(([id, x, y, r]) => `<div class="win" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><div class="bar"><span></span><span></span><span></span></div><img src="file://${P}/public/work/${id}-desktop-720.webp"></div>`).join("")}
</div></body></html>`;
  fs.writeFileSync(`${S}/og-${lang}.html`, html);
}
