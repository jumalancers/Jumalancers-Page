// Cada sección tiene su propio archivo de textos en ./i18n/<seccion>.js
// con la forma { es: {...}, en: {...} }. Aquí se combinan en DICT.es / DICT.en.
const modules = import.meta.glob("./i18n/*.js", { eager: true });

export const DICT = { es: {}, en: {} };

for (const [path, mod] of Object.entries(modules)) {
  const key = path.match(/\.\/i18n\/(.+)\.js$/)[1];
  DICT.es[key] = mod.default.es;
  DICT.en[key] = mod.default.en;
}
