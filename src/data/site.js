// Datos de contacto/negocio compartidos (una sola fuente de verdad).
export const SITE = {
  name: "Jumalancers",
  url: "https://jumalancers.com",
  email: "contacto@jumalancers.com",
  whatsapp: "526644257324",
  whatsappDisplay: "+52 664 425 7324",
  city: "Tijuana, Baja California, México",
  instagram: "https://instagram.com/jumalancers",
  facebook: "https://www.facebook.com/profile.php?id=61587112451778",
  googleReview: "https://g.page/r/CeQdqxbPXpwWEAI/review",
};

export const waLink = (text = "") =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
