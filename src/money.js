// Precios en pesos a partir de los precios en dólares (fuente única).
// Tipo de cambio fijo para la lista de precios: revisar cada 3 meses o si el dólar se mueve >5%.
// Redondeo "terminado en 9": <1,000 a la 50 más cercana, <10,000 a la centena, y si no, al millar.
//   599 → $10,999 · 1,199 → $21,999 · 1,999 → $36,999 · 2,999 → $54,999 · 99 → $1,799 · 19 → $349
export const FX_MXN = 18.35;

export function toMXN(usd) {
  const x = usd * FX_MXN;
  const step = x < 1000 ? 50 : x < 10000 ? 100 : 1000;
  return Math.max(0, Math.round(x / step) * step - 1);
}

/** Moneda que se muestra primero en cada idioma. */
export const CURRENCY = { es: "MXN", en: "USD" };

/** "$10,999" en español (pesos) o "$599" en inglés (dólares). */
export function money(usd, lang) {
  const n = lang === "es" ? toMXN(usd) : Math.round(usd);
  return "$" + n.toLocaleString("en-US");
}

/** El precio en la otra moneda, como referencia: "$599 USD" / "$10,999 MXN". */
export function altMoney(usd, lang) {
  return lang === "es"
    ? `$${Math.round(usd).toLocaleString("en-US")} USD`
    : `$${toMXN(usd).toLocaleString("en-US")} MXN`;
}
