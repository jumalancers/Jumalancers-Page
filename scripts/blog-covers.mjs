// Portadas de los artículos del blog (1200x630, ES/EN), con el mismo estilo de og-image.mjs.
// Uso: node scripts/blog-covers.mjs <dir-temporal>
//   genera <dir>/<id>-<lang>.html; luego, por cada uno:
//   google-chrome-stable --headless=new --hide-scrollbars --allow-file-access-from-files \
//     --window-size=1200,630 --screenshot=<dir>/<id>-<lang>.png file://<dir>/<id>-<lang>.html
//   magick <png> -strip -quality 82 public/covers/<id>-<lang>.jpg   (y -quality 80 .webp)
import fs from "node:fs";
import { POSTS } from "../src/data/blog/posts.js";

const P = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const OUT = process.argv[2];
const work = (id, v = "desktop-720") => `file://${P}/public/work/${id}-${v}.webp`;

const LABEL = {
  es: { eyebrow: "Blog · Jumalancers" },
  en: { eyebrow: "Blog · Jumalancers" },
};

// Visual de la derecha de cada portada (solo datos reales).
const VISUAL = {
  "costo-pagina-web": (lang) => {
    const rows = [
      ["Starter", "$599", lang === "es" ? "1 página" : "1 page"],
      ["Business", "$1,199", lang === "es" ? "2–3 páginas" : "2–3 pages"],
      ["Premium", "$1,999", lang === "es" ? "4–6 páginas" : "4–6 pages"],
    ];
    return `<div class="prices">${rows
      .map(
        ([n, p, d], i) =>
          `<div class="price" style="transform:translateX(${i * 34}px) rotate(${-2 + i * 2}deg)"><span>${n}</span><b>${p}<small> USD</small></b><em>${d}</em></div>`
      )
      .join("")}</div>`;
  },
  "facebook-vs-pagina": () =>
    `<div class="phones">
      <div class="phone back"><img src="${work("jaka", "mobile")}"></div>
      <div class="phone front"><img src="${work("jmyan", "mobile")}"></div>
    </div>`,
  "medida-vs-plantilla": () =>
    `<div class="stack">
      <div class="win" style="left:150px;top:40px;transform:rotate(4deg)"><div class="bar"><span></span><span></span><span></span></div><img src="${work("jmyan")}"></div>
      <div class="win" style="left:40px;top:230px;transform:rotate(-3deg)"><div class="bar"><span></span><span></span><span></span></div><img src="${work("waldo")}"></div>
    </div>`,
  "google-maps": (lang) =>
    `<div class="map">
      <div class="grid2"></div>
      <div class="road r1"></div><div class="road r2"></div><div class="road r3"></div>
      <div class="pin"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></div>
      <div class="gbp"><b>${lang === "es" ? "Tu negocio" : "Your business"}</b><span class="stars">★★★★★</span><em>${lang === "es" ? "Sitio web · Cómo llegar · Reseñas" : "Website · Directions · Reviews"}</em></div>
    </div>`,
};

for (const post of POSTS) {
  for (const lang of ["es", "en"]) {
    const c = post[lang];
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url(file://${P}/node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:hsl(167 47% 6%);font-family:Geist;color:hsl(37 72% 94%);position:relative}
.glow{position:absolute;inset:0;background:radial-gradient(600px 420px at 82% 40%,hsl(165 65% 45%/.24),transparent 70%),radial-gradient(500px 360px at 0% 100%,hsl(165 65% 45%/.12),transparent 70%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1px);background-size:24px 24px;mask-image:linear-gradient(90deg,#000 30%,transparent 75%)}
.left{position:absolute;left:72px;top:64px;bottom:60px;width:600px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:12px;font-weight:600;font-size:22px;letter-spacing:-.02em}
.brand img{width:44px;height:44px}
.eyebrow{margin-top:48px;display:inline-flex;align-self:flex-start;align-items:center;gap:10px;border:1px solid hsl(165 50% 62%/.25);background:hsl(165 65% 45%/.1);color:hsl(165 50% 62%);border-radius:99px;padding:8px 16px;font-size:14px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.eyebrow i{width:7px;height:7px;border-radius:9px;background:hsl(165 55% 50%)}
h1{margin-top:22px;font-size:50px;line-height:1.06;letter-spacing:-.035em;font-weight:600;text-wrap:balance}
.foot{margin-top:auto;font-size:19px;color:hsl(37 22% 62%)}
.foot b{color:hsl(37 72% 94%);font-weight:600}
.right{position:absolute;left:700px;top:0;width:500px;height:630px}
.prices{position:absolute;left:40px;top:120px;display:flex;flex-direction:column;gap:22px}
.price{width:340px;padding:22px 26px;border-radius:18px;border:1px solid rgba(255,255,255,.12);background:hsl(167 40% 10%);box-shadow:0 24px 50px rgba(0,0,0,.5);display:grid;grid-template-columns:1fr auto;row-gap:4px}
.price span{font-size:16px;color:hsl(165 50% 62%);font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.price b{grid-row:span 2;align-self:center;font-size:38px;letter-spacing:-.03em}
.price small{font-size:15px;color:hsl(37 22% 62%);font-weight:500}
.price em{font-style:normal;color:hsl(37 35% 76%);font-size:17px}
.phones{position:absolute;inset:0}
.phone{position:absolute;width:210px;border-radius:30px;padding:8px;background:hsl(167 40% 10%);border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 60px rgba(0,0,0,.55);overflow:hidden}
.phone img{display:block;width:100%;border-radius:23px}
.phone.back{left:60px;top:90px;transform:rotate(-6deg);opacity:.85}
.phone.front{left:220px;top:60px;transform:rotate(4deg)}
.stack{position:absolute;inset:0}
.win{position:absolute;width:440px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:hsl(167 40% 10%);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.bar{height:24px;display:flex;align-items:center;gap:6px;padding:0 12px;background:hsl(167 35% 12%);border-bottom:1px solid rgba(255,255,255,.08)}
.bar span{width:9px;height:9px;border-radius:9px;background:rgba(255,255,255,.18)}
.win img{display:block;width:100%}
.map{position:absolute;left:30px;top:70px;width:420px;height:490px;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:hsl(167 35% 11%);box-shadow:0 30px 60px rgba(0,0,0,.55)}
.grid2{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:40px 40px}
.road{position:absolute;background:hsl(167 25% 18%);border-radius:20px}
.r1{left:-20px;right:-20px;top:150px;height:22px;transform:rotate(-8deg)}
.r2{top:-20px;bottom:-20px;left:250px;width:20px;transform:rotate(12deg)}
.r3{left:-20px;right:-20px;top:330px;height:16px;transform:rotate(6deg)}
.pin{position:absolute;left:180px;top:150px;width:70px;height:70px;filter:drop-shadow(0 10px 16px rgba(0,0,0,.5))}
.pin svg{width:100%;height:100%;fill:hsl(165 55% 50%)}
.gbp{position:absolute;left:24px;right:24px;bottom:24px;padding:18px 20px;border-radius:16px;background:hsl(167 47% 7%);border:1px solid rgba(255,255,255,.12);display:flex;flex-direction:column;gap:6px}
.gbp b{font-size:22px;letter-spacing:-.02em}
.stars{color:hsl(42 90% 60%);font-size:20px;letter-spacing:2px}
.gbp em{font-style:normal;color:hsl(165 50% 62%);font-size:16px}
</style></head><body><div class="glow"></div><div class="dots"></div>
<div class="left">
<div class="brand"><img src="file://${P}/public/Logodark.png">Jumalancers</div>
<div class="eyebrow"><i></i>${LABEL[lang].eyebrow}</div>
<h1>${c.title}</h1>
<div class="foot"><b>jumalancers.com</b>/${lang === "es" ? "blog" : "en/blog"}</div>
</div>
<div class="right">${VISUAL[post.id](lang)}</div>
</body></html>`;
    fs.writeFileSync(`${OUT}/${post.id}-${lang}.html`, html);
  }
}
console.log("ok", POSTS.length * 2);
