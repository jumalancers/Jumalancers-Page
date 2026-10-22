// Textos de la sección "testimonials" (es/en).
// Solo testimonios REALES de clientes. `id` = id del proyecto en src/data/projects.js
// (de ahí salen nombre, industria, ubicación, URL y captura).
export default {
  es: {
    badge: "Testimonios",
    title: "Lo que dicen nuestros",
    accent: "clientes",
    desc: "Negocios reales que confiaron su sitio web a nuestro estudio en Tijuana. Sus palabras, sin editar.",
    visitAria: "Visitar el sitio de {name} (abre en una pestaña nueva)",
    shotAlt: "Captura del sitio web de {name}, diseñado por Jumalancers",
    items: [
      {
        id: "jmyan",
        quote:
          "El servicio de Jumalancer’s ha sido excepcional. Ha cumplido y sobrepasado el alcance que pretendíamos para nuestro sitio web. Así mismo, la atención personalizada, puntual y constante de cada uno de sus miembros genera una experiencia muy cálida de servicio.",
      },
      {
        id: "jaka",
        quote:
          "Nuestra nueva página refleja mejor quiénes somos como empresa. La información es clara, el diseño es profesional y ahora el contacto con clientes es mucho más sencillo.",
      },
    ],
    proofTitle: "Datos verificables",
    proof: {
      sites: { value: "100%", label: "sitios a medida", sub: "Todos en línea y visitables" },
      markets: { value: "Tijuana", label: "estudio local", sub: "Atendemos México y EE. UU." },
      bilingual: { value: "ES · EN · +", label: "sitios multi-idioma", sub: "Español, inglés u otros idiomas" },
    },
    portfolioCta: "Ver todos los proyectos",
  },
  en: {
    badge: "Testimonials",
    title: "What our",
    accent: "clients say",
    desc: "Real businesses that trusted us with their website. Their words, translated from Spanish.",
    visitAria: "Visit the {name} website (opens in a new tab)",
    shotAlt: "Screenshot of the {name} website, designed by Jumalancers",
    items: [
      {
        id: "jmyan",
        quote:
          "Jumalancer’s service has been exceptional. They met and exceeded what we expected for our website. Their personalized, punctual, and consistent attention creates a very warm service experience.",
      },
      {
        id: "jaka",
        quote:
          "Our new website reflects who we are as a company. The information is clear, the design feels professional, and contacting us is now much easier.",
      },
    ],
    proofTitle: "Verifiable facts",
    proof: {
      sites: { value: "100%", label: "custom-built websites", sub: "All live: visit them yourself" },
      markets: { value: "Pacific Time", label: "based in Tijuana", sub: "Same time zone as California" },
      bilingual: { value: "EN · ES · +", label: "multilingual websites", sub: "English, Spanish or other languages" },
    },
    portfolioCta: "See all projects",
  },
};
