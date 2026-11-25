// Proyectos reales de clientes (fuente única). Capturas en /public/work/<id>-{desktop,desktop-720,mobile,long}.webp
// market: "mx" | "us". Campos base (id, name, url, market, industry, location, featured) no se renombran.
// Campos extra: kind ("site" | "system"), stack[], year, summary{es,en}, features{es[],en[]}, testimonial{es,en,author},
// before{es,en} (qué tenían antes), built{es[],en[]} (secciones reales del sitio), result{es,en} (lo que contó Carlos, sin cifras).
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
    before: {
      es: "Antes de su sitio, el despacho solo tenía un Linktree para reunir sus enlaces.",
      en: "Before this website, the firm only had a Linktree to gather its links.",
    },
    built: {
      es: [
        "Inicio con la propuesta del despacho para emprendedores y empresas en crecimiento",
        "5 áreas de práctica, cada una con sus servicios: litigio civil, mercantil y administrativo; derecho corporativo; propiedad intelectual; derecho contractual y gestión notarial",
        "Programa de referidos “Aliados que suman”, con sus reglas y un proceso en 4 pasos",
        "Sección de empresas que han confiado en el despacho",
        "Historia, misión y fundadores del despacho",
        "Botones para agendar consulta y llamar en todo el sitio",
      ],
      en: [
        "Homepage with the firm's offer for entrepreneurs and growing companies",
        "5 practice areas, each with its services: civil, commercial and administrative litigation; corporate law; intellectual property; contract law and notarial services",
        "“Aliados que suman” referral program, with its rules and a 4-step process",
        "Section for companies that have trusted the firm",
        "The firm's story, mission and founders",
        "Buttons to book a consultation and call throughout the site",
      ],
    },
    result: {
      es: "Desde que tienen su página, más clientes los contactan directamente desde el sitio y por correo.",
      en: "Since the website launched, more customers contact them directly through the site and by email.",
    },
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
    before: {
      es: "No tenían página web.",
      en: "They didn't have a website.",
    },
    built: {
      es: [
        "Inicio que explica el cruce Tijuana ↔ California y lleva a pedir cotización",
        "6 servicios: gestión de importación y exportación, trámites aduanales, coordinación con agentes aduanales, transporte terrestre y asesoría documental",
        "Historia de la empresa, fundada en 2011",
        "Tipos de mercancía que manejan",
        "Cobertura: Tijuana, San Diego y California",
        "Preguntas frecuentes y formulario de cotización que llega por correo",
      ],
      en: [
        "Homepage that explains the Tijuana ↔ California crossing and leads to a quote request",
        "6 services: import and export management, customs paperwork, coordination with customs brokers, ground transportation and document guidance",
        "The company's story, founded in 2011",
        "Types of cargo they handle",
        "Coverage: Tijuana, San Diego and California",
        "FAQ and a quote form delivered by email",
      ],
    },
    result: {
      es: "Desde que tienen su página, más clientes los contactan directamente desde el sitio y por correo.",
      en: "Since the website launched, more customers contact them directly through the site and by email.",
    },
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
    before: {
      es: "No tenían página web.",
      en: "They didn't have a website.",
    },
    built: {
      es: [
        "Catálogo en línea con 9 categorías: limpieza, lavandería, higiene, cocina, desechables, papelería, mascotas, alimentos y bebidas",
        "Solicitud de cotización desde el catálogo",
        "Rastreo de pedidos para sus clientes",
        "Sección “Cómo trabajamos” con el proceso de pedido en 4 pasos",
        "Sistema administrativo privado: cotizaciones, pedidos, inventario, clientes, proveedores y gastos",
        "Etiquetas con código de barras",
      ],
      en: [
        "Online catalog with 9 categories: cleaning, laundry, hygiene, kitchen, disposables, office supplies, pet, food and beverages",
        "Quote requests from the catalog",
        "Order tracking for their customers",
        "“How we work” section with the 4-step ordering process",
        "Private admin system: quotes, orders, inventory, clients, suppliers and expenses",
        "Barcode labels",
      ],
    },
    result: {
      es: "Desde que tienen su página, más clientes los contactan directamente desde el sitio y por correo.",
      en: "Since the website launched, more customers contact them directly through the site and by email.",
    },
    summary: {
      es: "Sitio, catálogo en línea y sistema administrativo a medida para una distribuidora de productos de limpieza, papelería, cafetería y desechables en Tijuana.",
      en: "Website, online catalog and custom admin system for a Tijuana distributor of cleaning, office, coffee-station and disposable supplies.",
    },
    features: {
      es: ["Catálogo de productos con categorías y búsqueda", "Panel administrativo con acceso protegido", "Cotizaciones, pedidos e inventario", "Clientes, proveedores y gastos", "Etiquetas con código de barras y rastreo de pedidos"],
      en: ["Product catalog with categories and search", "Protected admin dashboard", "Quotes, orders and inventory", "Clients, suppliers and expenses", "Barcode labels and order tracking"],
    },
  },

];

export const shot = (id, variant = "desktop") => `/work/${id}-${variant}.webp`;
