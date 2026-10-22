// Proyectos reales de clientes (fuente única). Capturas en /public/work/<id>-{desktop,desktop-720,mobile,long}.webp
// market: "mx" | "us". Campos base (id, name, url, market, industry, location, featured) no se renombran.
// Campos extra: kind ("site" | "system"), stack[], year, summary{es,en}, features{es[],en[]}, testimonial{es,en,author}.
// Datos tomados de las fuentes de cada proyecto (meta, schema, estructura, git log). Sin métricas inventadas.
export const PROJECTS = [
  {
    id: "jmyan",
    name: "JM & AN Abogados",
    url: "https://jmyanabogados.com",
    market: "mx",
    industry: { es: "Despacho legal", en: "Law firm" },
    location: "Tijuana, BC",
    featured: true,
    kind: "site",
    stack: ["Astro", "React", "Tailwind CSS"],
    year: 2026,
    summary: {
      es: "Sitio bilingüe para un despacho legal de Tijuana enfocado en emprendedores: marcas, contratos, estructura corporativa y litigio, con una imagen sobria que transmite autoridad.",
      en: "Bilingual website for a Tijuana law firm focused on entrepreneurs: trademarks, contracts, corporate structure and litigation, with a sober look that conveys authority.",
    },
    features: {
      es: ["Sitio bilingüe español / inglés", "Modo claro y oscuro", "Servicios legales explicados por área", "Agenda de consulta y llamada directa", "SEO técnico con Astro"],
      en: ["Bilingual Spanish / English site", "Light and dark mode", "Legal services explained by practice area", "Consultation booking and click-to-call", "Technical SEO built with Astro"],
    },
    testimonial: {
      es: "El servicio de Jumalancer’s ha sido excepcional. Ha cumplido y sobrepasado el alcance que pretendíamos para nuestro sitio web. Así mismo, la atención personalizada, puntual y constante de cada uno de sus miembros genera una experiencia muy cálida de servicio.",
      en: "Jumalancer’s service has been exceptional. They met and exceeded what we expected for our website. Their personalized, punctual, and consistent attention creates a very warm service experience.",
      author: "JM & AN Abogados",
    },
  },
  {
    id: "jaka",
    name: "Jaka Express",
    url: "https://www.jakaexpress.com",
    market: "mx",
    industry: { es: "Logística y comercio exterior", en: "Cross-border logistics" },
    location: "Tijuana, BC",
    featured: true,
    kind: "site",
    stack: ["HTML", "Tailwind CSS", "JavaScript", "EmailJS"],
    year: 2022,
    summary: {
      es: "Sitio para una empresa de importación y exportación en Tijuana. Explica el cruce fronterizo Tijuana–California paso a paso y lleva al visitante a pedir su cotización.",
      en: "Website for an import/export company in Tijuana. It explains the Tijuana–California border crossing step by step and guides visitors to request a quote.",
    },
    features: {
      es: ["Servicios de importación, exportación y cruce", "Sección de cobertura y tipos de mercancía", "Formulario de cotización con envío por correo", "Preguntas frecuentes", "Diseño responsivo, móvil primero"],
      en: ["Import, export and border-crossing services", "Coverage and cargo-type sections", "Quote request form with email delivery", "FAQ section", "Responsive, mobile-first design"],
    },
    testimonial: {
      es: "Nuestra nueva página refleja mejor quiénes somos como empresa. La información es clara, el diseño es profesional y ahora el contacto con clientes es mucho más sencillo.",
      en: "Our new website reflects who we are as a company. The information is clear, the design feels professional, and contacting us is now much easier.",
      author: "Jaka Express",
    },
  },
  {
    id: "waldo",
    name: "Waldo Distribuciones",
    url: "https://waldodistribuciones.com",
    market: "mx",
    industry: { es: "Distribuidora + catálogo con cotizador", en: "Distributor + quoting catalog" },
    location: "Tijuana, BC",
    featured: true,
    kind: "system",
    stack: ["React", "Vite", "Supabase", "Tailwind CSS"],
    year: 2026,
    summary: {
      es: "Sitio, catálogo en línea y sistema administrativo a medida para una distribuidora de productos de limpieza, papelería, cafetería y desechables en Tijuana.",
      en: "Website, online catalog and custom admin system for a Tijuana distributor of cleaning, office, coffee-station and disposable supplies.",
    },
    features: {
      es: ["Catálogo de productos con categorías y búsqueda", "Panel administrativo con acceso protegido", "Cotizaciones, pedidos e inventario", "Clientes, proveedores y gastos", "Etiquetas con código de barras y rastreo de pedidos"],
      en: ["Product catalog with categories and search", "Protected admin dashboard", "Quotes, orders and inventory", "Clients, suppliers and expenses", "Barcode labels and order tracking"],
    },
  },
  {
    id: "todomex",
    name: "TodoMex Paquetería",
    url: "https://todomexpaqueteria.com",
    market: "mx",
    industry: { es: "Paquetería nacional", en: "Parcel delivery" },
    location: "Tijuana, BC",
    featured: true,
    kind: "site",
    stack: ["HTML", "Tailwind CSS", "JavaScript", "EmailJS"],
    year: 2025,
    summary: {
      es: "Sitio corporativo para una paquetería con envíos a todo México, con un cotizador por pasos para que el cliente solicite su envío en segundos.",
      en: "Corporate website for a parcel company shipping across Mexico, with a step-by-step quote form so customers can request a shipment in seconds.",
    },
    features: {
      es: ["Formulario de envío por pasos", "Contacto directo por WhatsApp", "Servicios de paquetería explicados", "Diseño responsivo"],
      en: ["Step-by-step shipping form", "Direct WhatsApp contact", "Clear breakdown of shipping services", "Responsive design"],
    },
  },
];

export const shot = (id, variant = "desktop") => `/work/${id}-${variant}.webp`;
