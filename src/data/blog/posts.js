// Artículos del blog. Cada uno existe en español e inglés con el mismo contenido.
// Bloques del cuerpo: { h2 }, { p }, { ul: [...] }, { cta: "service-key" } (enlace a un servicio).
// Solo datos reales de Jumalancers (precios = i18n/plans.js). Nada de cifras inventadas de terceros.
export const POSTS = [
  {
    id: "costo-pagina-web",
    date: "2026-11-25",
    service: "websites",
    es: {
      slug: "cuanto-cuesta-una-pagina-web",
      title: "¿Cuánto cuesta una página web para un negocio en 2026?",
      metaDesc:
        "Qué hace que una página web cueste más o menos, qué debe incluir el precio y cuánto se paga después del primer año. Con nuestros precios reales en USD.",
      excerpt:
        "Qué hace que una página web cueste más o menos, qué debe incluir el precio y cuánto se paga después del primer año, con nuestros precios reales.",
      body: [
        { p: "Es la primera pregunta que nos hacen casi todos los clientes, y la respuesta corta es: depende de cuántas páginas necesitas y de qué tiene que hacer tu sitio. Aquí te explicamos qué mueve el precio, qué debería venir incluido y cuánto pagas después, con nuestros precios reales para que tengas una referencia." },
        { h2: "Lo que más cambia el precio" },
        { ul: [
          "Cuántas páginas necesitas. Una sola página con tus servicios, fotos y contacto no cuesta lo mismo que un sitio con una página por servicio.",
          "Cuántos idiomas. Un sitio bilingüe es, en la práctica, dos sitios: cada texto existe dos veces y cada idioma se configura por separado para Google.",
          "Funciones extra. Blog, agenda de citas, pagos en línea o un catálogo que tú mismo actualizas suman trabajo de desarrollo.",
          "Si necesitas un sistema. Cuando hay base de datos, usuarios con contraseña, pedidos o reportes, ya no es una página: es una aplicación web.",
        ] },
        { h2: "Lo que debería venir incluido" },
        { p: "Antes de comparar precios, revisa qué incluye cada propuesta. Una página barata puede salir cara si después tienes que pagar aparte el dominio, el hosting, el certificado de seguridad o los correos." },
        { ul: [
          "Dominio (tunegocio.com), hosting y certificado SSL, al menos el primer año.",
          "Diseño adaptable a celular, que es donde la mayoría de tus clientes va a ver tu página.",
          "Configuración básica de SEO: títulos, descripciones y estructura para que Google entienda tu sitio.",
          "Correos con tu dominio, como contacto@tunegocio.com.",
          "Rondas de revisión antes de publicar.",
        ] },
        { h2: "Nuestros precios, como referencia" },
        { p: "Nuestros planes tienen precio fijo en dólares y todos incluyen dominio, hosting y SSL del primer año, diseño a medida y correos corporativos:" },
        { ul: [
          "Starter, $599 USD: 1 página con hasta 6 secciones. Entrega en 7 a 10 días hábiles.",
          "Business, $1,199 USD: 2 a 3 páginas. Entrega en 10 a 14 días hábiles.",
          "Premium, $1,999 USD: 4 a 6 páginas, con SEO avanzado y analítica. Entrega en 14 a 21 días hábiles.",
          "Systems / App, desde $2,999 USD: sitios de 7 páginas o más, o sistemas a medida con base de datos.",
        ] },
        { p: "Cada plan incluye un idioma; el segundo idioma y funciones como blog, citas o pagos se cotizan aparte." },
        { h2: "Lo que pagas después del primer año" },
        { p: "Una página web tiene un costo anual: el dominio y el hosting se renuevan. Pregunta siempre cuánto cuesta la renovación antes de contratar. En nuestro caso es de $99, $149 o $199 USD al año según el plan, e incluye 2 cambios de contenido al año. Si necesitas más cambios, cada uno cuesta $29 USD, o hay un plan de $39 USD al mes con 4 cambios." },
        { h2: "¿Cómo sé cuál necesito?" },
        { p: "Si estás empezando y quieres que te encuentren y te escriban, una sola página bien hecha suele ser suficiente. Si quieres que cada servicio aparezca en Google por separado, conviene una página por servicio. Y si hoy llevas tus pedidos o cotizaciones en hojas de cálculo y WhatsApp, probablemente lo que necesitas es un sistema." },
        { cta: "websites" },
      ],
    },
    en: {
      slug: "how-much-does-a-website-cost",
      title: "How Much Does a Small Business Website Cost in 2026?",
      metaDesc:
        "What makes a website cost more or less, what the price should include and what you pay after the first year. With our real prices in USD.",
      excerpt:
        "What makes a website cost more or less, what the price should include and what you pay after the first year, with our real prices.",
      body: [
        { p: "It's the first question almost every client asks, and the short answer is: it depends on how many pages you need and what your site has to do. Here's what drives the price, what should be included and what you pay afterward, with our real prices so you have a reference." },
        { h2: "What changes the price the most" },
        { ul: [
          "How many pages you need. A single page with your services, photos and contact info doesn't cost the same as a site with one page per service.",
          "How many languages. A bilingual site is, in practice, two sites: every piece of copy exists twice and each language is set up separately for Google.",
          "Extra features. A blog, appointment booking, online payments or a catalog you update yourself all add development work.",
          "Whether you need an app. Once there's a database, users with passwords, orders or reports, it's no longer a website: it's a web application.",
        ] },
        { h2: "What should be included" },
        { p: "Before comparing prices, check what each proposal includes. A cheap website can end up expensive if you then have to pay separately for the domain, hosting, security certificate or email." },
        { ul: [
          "Domain (yourbusiness.com), hosting and SSL certificate, at least for the first year.",
          "Mobile-friendly design, since that's where most of your customers will see your site.",
          "Basic SEO setup: titles, descriptions and structure so Google understands your site.",
          "Email on your domain, like contact@yourbusiness.com.",
          "Revision rounds before launch.",
        ] },
        { h2: "Our prices, as a reference" },
        { p: "Our plans have fixed USD prices and all include domain, hosting and SSL for the first year, custom design and business email:" },
        { ul: [
          "Starter, $599 USD: 1 page with up to 6 sections. Delivered in 7 to 10 business days.",
          "Business, $1,199 USD: 2 to 3 pages. Delivered in 10 to 14 business days.",
          "Premium, $1,999 USD: 4 to 6 pages, with advanced SEO and analytics. Delivered in 14 to 21 business days.",
          "Systems / App, from $2,999 USD: sites with 7 or more pages, or custom apps with a database.",
        ] },
        { p: "Each plan includes one language; a second language and features like a blog, booking or payments are quoted separately." },
        { h2: "What you pay after the first year" },
        { p: "A website has a yearly cost: the domain and hosting renew. Always ask how much renewal costs before you sign. For us it's $99, $149 or $199 USD a year depending on the plan, and it includes 2 content updates a year. If you need more changes, each one is $29 USD, or there's a $39 USD monthly plan with 4 updates." },
        { h2: "How do I know which one I need?" },
        { p: "If you're just starting out and want people to find you and reach out, one well-built page is usually enough. If you want each service to show up on Google on its own, it's better to have one page per service. And if today you track orders or quotes in spreadsheets and WhatsApp, what you probably need is a web app." },
        { cta: "websites" },
      ],
    },
  },
  {
    id: "facebook-vs-pagina",
    date: "2026-11-25",
    service: "landing",
    es: {
      slug: "necesito-pagina-web-si-tengo-facebook",
      title: "¿Necesito una página web si ya tengo Facebook o Instagram?",
      metaDesc:
        "Las redes sociales ayudan, pero no sustituyen una página web. Qué hace una página que tus redes no pueden, y cuándo vale la pena dar el paso.",
      excerpt:
        "Las redes sociales ayudan, pero no sustituyen una página web. Qué hace una página que tus redes no pueden, y cuándo vale la pena.",
      body: [
        { p: "Muchos negocios empiezan en Facebook, Instagram o WhatsApp, y está muy bien: ahí están sus clientes. La pregunta es si con eso basta. Nuestra respuesta honesta: las redes sirven para que te sigan; la página sirve para que te encuentren y te contraten." },
        { h2: "Lo que una página hace y tus redes no" },
        { ul: [
          "Aparecer en Google. Cuando alguien busca “tu servicio + tu ciudad”, Google muestra páginas web y perfiles de Google Business, no tus publicaciones.",
          "Ordenar tu información. En redes, tus servicios, precios y datos de contacto se pierden entre publicaciones. En tu página están siempre en el mismo lugar.",
          "Dar confianza. Un dominio propio y correos como contacto@tunegocio.com se ven más serios que un perfil, sobre todo para clientes nuevos o empresas.",
          "Ser tuya. Las redes cambian sus reglas y su alcance; tu página y tu dominio te pertenecen.",
        ] },
        { h2: "¿Y un Linktree?" },
        { p: "Un Linktree o una página de enlaces ayuda a reunir tus redes en un solo lugar, pero no explica qué haces ni te posiciona en Google. Uno de nuestros clientes, un despacho legal en Tijuana, tenía solo un Linktree antes de su sitio; con su página propia ahora explica cada área de práctica y sus clientes pueden agendar una consulta desde ahí." },
        { h2: "Cuándo vale la pena dar el paso" },
        { ul: [
          "Cuando tus clientes te preguntan una y otra vez lo mismo (servicios, zonas, precios).",
          "Cuando quieres clientes que todavía no te conocen, no solo los que ya te siguen.",
          "Cuando vas a pagar anuncios y necesitas una página a donde mandar a la gente.",
          "Cuando vendes a empresas que esperan ver un sitio y un correo profesional.",
        ] },
        { h2: "Lo mejor: que trabajen juntas" },
        { p: "No tienes que elegir. Lo ideal es que tus redes lleven a tu página y tu página muestre tus redes. Si estás empezando, una sola página con tus servicios, fotos de tu trabajo, reseñas y un botón de WhatsApp es suficiente para dar el paso." },
        { cta: "landing" },
      ],
    },
    en: {
      slug: "do-i-need-a-website-if-i-have-facebook",
      title: "Do I Need a Website If I Already Have Facebook or Instagram?",
      metaDesc:
        "Social media helps, but it doesn't replace a website. What a website does that your social profiles can't, and when it's worth taking the step.",
      excerpt:
        "Social media helps, but it doesn't replace a website. What a website does that your social profiles can't, and when it's worth it.",
      body: [
        { p: "Many businesses start on Facebook, Instagram or WhatsApp, and that's great: that's where their customers are. The question is whether that's enough. Our honest answer: social media gets people to follow you; a website gets people to find you and hire you." },
        { h2: "What a website does that social media doesn't" },
        { ul: [
          "Show up on Google. When someone searches “your service + your city”, Google shows websites and Google Business Profiles, not your posts.",
          "Keep your information organized. On social media, your services, prices and contact info get lost between posts. On your website they're always in the same place.",
          "Build trust. Your own domain and an email like contact@yourbusiness.com look more professional than a profile, especially to new customers or companies.",
          "Belong to you. Social platforms change their rules and reach; your website and domain are yours.",
        ] },
        { h2: "What about a Linktree?" },
        { p: "A Linktree or link page helps gather your social profiles in one place, but it doesn't explain what you do or help you rank on Google. One of our clients, a law firm in Tijuana, only had a Linktree before their website; with their own site they now explain each practice area and clients can book a consultation right there." },
        { h2: "When it's worth taking the step" },
        { ul: [
          "When customers keep asking you the same things (services, areas, prices).",
          "When you want customers who don't know you yet, not just the ones who already follow you.",
          "When you're going to pay for ads and need a page to send people to.",
          "When you sell to companies that expect to see a website and a professional email.",
        ] },
        { h2: "Best of all: make them work together" },
        { p: "You don't have to choose. Ideally your social profiles point to your website and your website shows your social profiles. If you're just starting out, a single page with your services, photos of your work, reviews and a WhatsApp button is enough to take the step." },
        { cta: "landing" },
      ],
    },
  },
  {
    id: "medida-vs-plantilla",
    date: "2026-11-25",
    service: "websites",
    es: {
      slug: "pagina-a-medida-o-wix",
      title: "Página web a medida o Wix y plantillas: ¿cuál te conviene?",
      metaDesc:
        "Comparación honesta entre hacer tu página tú mismo con Wix, Squarespace o una plantilla, y mandarla hacer a medida. Ventajas, límites y cuándo conviene cada una.",
      excerpt:
        "Comparación honesta entre hacer tu página tú mismo con un constructor o plantilla y mandarla hacer a medida. Cuándo conviene cada una.",
      body: [
        { p: "Wix, Squarespace y otros constructores te permiten armar una página tú mismo. Son una opción válida y no queremos convencerte de lo contrario. Lo importante es saber qué ganas y qué pierdes con cada camino para elegir bien." },
        { h2: "Cuándo un constructor o plantilla te funciona" },
        { ul: [
          "Tienes tiempo para armarla y mantenerla tú mismo.",
          "Necesitas algo sencillo y rápido, y el diseño de la plantilla se parece a lo que buscas.",
          "Tu presupuesto inicial es muy limitado.",
        ] },
        { h2: "Los límites que se notan con el tiempo" },
        { ul: [
          "Te pareces a otros. Muchas plantillas se usan en miles de sitios, y tu negocio termina viéndose como el de otros.",
          "Pagas una mensualidad. Los constructores cobran por mes o por año mientras tu sitio exista, y en muchos casos el sitio no se puede llevar a otro lado.",
          "Velocidad. Los constructores cargan herramientas que tu sitio tal vez no usa, y eso puede hacerlo más lento, sobre todo en celular.",
          "Tu tiempo. Escribir, diseñar, acomodar fotos y configurar el SEO toma horas que no estás dedicando a tu negocio.",
        ] },
        { h2: "Qué ganas con una página a medida" },
        { ul: [
          "Un diseño hecho para tu marca y para lo que tu cliente necesita saber antes de contactarte.",
          "Un sitio ligero y rápido, construido solo con lo que necesita.",
          "SEO técnico configurado desde el inicio: estructura, títulos, datos estructurados y sitemap.",
          "Alguien que se encarga de lo técnico: dominio, hosting, correos y cambios.",
        ] },
        { h2: "Nuestra recomendación" },
        { p: "Si tu página es una pieza importante para conseguir clientes (si quieres aparecer en Google, si vas a pagar anuncios o si vendes a empresas), conviene que esté hecha a medida. Si solo necesitas algo temporal mientras arrancas, un constructor puede servirte por un tiempo. En cualquier caso, pregunta siempre quién es dueño del dominio y si puedes llevarte tu sitio." },
        { cta: "websites" },
      ],
    },
    en: {
      slug: "custom-website-vs-wix",
      title: "Custom Website vs. Wix and Templates: Which Is Right for You?",
      metaDesc:
        "An honest comparison between building your website yourself with Wix, Squarespace or a template, and having it custom built. Pros, limits and when each makes sense.",
      excerpt:
        "An honest comparison between building your site yourself with a builder or template and having it custom built. When each makes sense.",
      body: [
        { p: "Wix, Squarespace and other builders let you put together a website yourself. They're a valid option and we're not going to tell you otherwise. What matters is knowing what you gain and what you give up with each path so you can choose well." },
        { h2: "When a builder or template works for you" },
        { ul: [
          "You have time to build and maintain it yourself.",
          "You need something simple and fast, and the template's design is close to what you want.",
          "Your starting budget is very limited.",
        ] },
        { h2: "The limits you notice over time" },
        { ul: [
          "You look like everyone else. Many templates are used on thousands of sites, and your business ends up looking like others.",
          "You pay a subscription. Builders charge monthly or yearly for as long as your site exists, and in many cases you can't move the site elsewhere.",
          "Speed. Builders load tools your site may not use, which can make it slower, especially on phones.",
          "Your time. Writing, designing, placing photos and setting up SEO takes hours you're not spending on your business.",
        ] },
        { h2: "What you get with a custom website" },
        { ul: [
          "A design made for your brand and for what your customers need to know before contacting you.",
          "A lightweight, fast site, built with only what it needs.",
          "Technical SEO set up from the start: structure, titles, structured data and sitemap.",
          "Someone who handles the technical side: domain, hosting, email and changes.",
        ] },
        { h2: "Our recommendation" },
        { p: "If your website is an important part of how you get customers (if you want to show up on Google, plan to run ads or sell to companies), it's worth having it custom built. If you only need something temporary while you get started, a builder can work for a while. Either way, always ask who owns the domain and whether you can take your site with you." },
        { cta: "websites" },
      ],
    },
  },
  {
    id: "google-maps",
    date: "2026-11-25",
    service: "seo",
    es: {
      slug: "como-aparecer-en-google-maps",
      title: "Cómo aparecer en Google Maps: guía de Google Business Profile",
      metaDesc:
        "Paso a paso para que tu negocio aparezca en Google Maps y en las búsquedas locales con Google Business Profile: perfil, categorías, fotos, reseñas y tu página web.",
      excerpt:
        "Paso a paso para que tu negocio aparezca en Google Maps y en búsquedas locales: perfil, categorías, fotos, reseñas y tu página web.",
      body: [
        { p: "Cuando alguien busca “plomero cerca de mí” o “diseño web en Tijuana”, Google muestra primero un mapa con negocios. Esos resultados salen de Google Business Profile, el perfil gratuito de Google para negocios. Si tu negocio no tiene uno, no aparece ahí." },
        { h2: "1. Crea o reclama tu perfil" },
        { p: "Entra a google.com/business con la cuenta de Google de tu negocio y busca su nombre. Si ya existe un perfil (a veces Google lo crea solo), reclámalo; si no, créalo. Escribe el nombre real de tu negocio, tal como aparece en tu letrero o en tu página, sin agregar palabras clave." },
        { h2: "2. Verifica tu negocio" },
        { p: "Google te pide comprobar que el negocio es tuyo. El método cambia según el caso (por ejemplo, un video, un código por teléfono o correo, o una carta). Mientras no lo verifiques, tu perfil no aparece completo en las búsquedas." },
        { h2: "3. Llena todo con cuidado" },
        { ul: [
          "Categoría principal: la que mejor describe lo que haces. Es de lo que más pesa.",
          "Zona de servicio o dirección, horario, teléfono y tu página web.",
          "Servicios con una descripción corta de cada uno.",
          "Fotos reales de tu trabajo, tu equipo o tu local. Evita fotos de internet.",
        ] },
        { p: "Usa exactamente el mismo nombre, dirección y teléfono en tu perfil, tu página web y tus redes. Que coincidan le da confianza a Google." },
        { h2: "4. Pide reseñas (con texto)" },
        { p: "Las reseñas son de lo que más ayuda. Desde tu perfil puedes copiar un enlace directo para dejar reseña y mandarlo por WhatsApp a tus clientes contentos. Pídeles que cuenten qué servicio les hiciste y en qué ciudad: Google lee el texto de las reseñas. Y contesta todas, las buenas y las malas." },
        { h2: "5. Conéctalo con una buena página web" },
        { p: "Tu perfil y tu página se refuerzan entre sí. Cuando Google ve una página rápida, con tus servicios bien explicados, tu ciudad y los mismos datos de contacto, entiende mejor qué haces y dónde. Por eso, en nuestros proyectos de SEO local configuramos el perfil de Google Business junto con el sitio." },
        { h2: "¿Cuánto tarda?" },
        { p: "Aparecer en Maps puede tomar desde días hasta unas semanas después de verificar. Subir de posición depende de tu categoría, la distancia, tus reseñas y tu página, y es un proceso de meses, no de días. Nadie puede garantizarte el primer lugar; lo que sí puedes hacer es tener tu perfil completo y activo." },
        { cta: "seo" },
      ],
    },
    en: {
      slug: "how-to-show-up-on-google-maps",
      title: "How to Show Up on Google Maps: A Google Business Profile Guide",
      metaDesc:
        "Step by step to get your business on Google Maps and local search with Google Business Profile: profile, categories, photos, reviews and your website.",
      excerpt:
        "Step by step to get your business on Google Maps and local search: profile, categories, photos, reviews and your website.",
      body: [
        { p: "When someone searches “plumber near me” or “web design in Tijuana”, Google shows a map of businesses first. Those results come from Google Business Profile, Google's free profile for businesses. If your business doesn't have one, it won't show up there." },
        { h2: "1. Create or claim your profile" },
        { p: "Go to google.com/business with your business's Google account and search for its name. If a profile already exists (sometimes Google creates one automatically), claim it; if not, create it. Use your business's real name, exactly as it appears on your sign or website, without adding keywords." },
        { h2: "2. Verify your business" },
        { p: "Google asks you to prove the business is yours. The method varies by case (for example, a video, a code by phone or email, or a postcard). Until you verify it, your profile won't fully show up in search." },
        { h2: "3. Fill everything out carefully" },
        { ul: [
          "Primary category: the one that best describes what you do. It's one of the most important factors.",
          "Service area or address, hours, phone number and your website.",
          "Services, with a short description of each one.",
          "Real photos of your work, your team or your location. Avoid stock photos.",
        ] },
        { p: "Use exactly the same name, address and phone number on your profile, your website and your social profiles. Consistency builds trust with Google." },
        { h2: "4. Ask for reviews (with text)" },
        { p: "Reviews help more than almost anything. From your profile you can copy a direct link to leave a review and send it by text or WhatsApp to happy customers. Ask them to mention the service you did and the city: Google reads the text of reviews. And reply to all of them, good and bad." },
        { h2: "5. Connect it to a good website" },
        { p: "Your profile and your website reinforce each other. When Google sees a fast site with your services clearly explained, your city and the same contact details, it better understands what you do and where. That's why, in our local SEO projects, we set up your Google Business Profile together with the website." },
        { h2: "How long does it take?" },
        { p: "Showing up on Maps can take anywhere from days to a few weeks after verification. Moving up depends on your category, distance, reviews and website, and it takes months, not days. Nobody can guarantee you the top spot; what you can do is keep your profile complete and active." },
        { cta: "seo" },
      ],
    },
  },
];

// Portada de cada artículo: public/covers/<id>-<lang>.{webp,jpg} (scripts/blog-covers.mjs).
export const blogCover = (id, lang, ext = "webp") => `/covers/${id}-${lang}.${ext}`;

export const BLOG_UI = {
  es: {
    eyebrow: "Blog",
    h1: "Ideas claras para tu",
    accent: "negocio en línea",
    intro: "Respuestas honestas a las preguntas que más nos hacen sobre páginas web, Google y cómo conseguir clientes en línea.",
    metaTitle: "Blog sobre páginas web y SEO para negocios | Jumalancers",
    metaDesc:
      "Guías claras sobre cuánto cuesta una página web, cómo aparecer en Google Maps y cómo elegir entre una página a medida o una plantilla.",
    read: "Leer artículo",
    published: "Publicado el",
    by: "Por Jumalancers",
    more: "Más artículos",
    back: "Todos los artículos",
    ctaTitle: "¿Quieres ayuda con tu página?",
    ctaDesc: "Cuéntanos de tu negocio por WhatsApp o correo y te decimos qué te conviene, con precio y tiempos claros.",
    serviceLink: "Ver el servicio",
  },
  en: {
    eyebrow: "Blog",
    h1: "Clear ideas for your",
    accent: "business online",
    intro: "Honest answers to the questions we hear most about websites, Google and getting customers online.",
    metaTitle: "Blog on Websites & SEO for Small Businesses | Jumalancers",
    metaDesc:
      "Clear guides on how much a website costs, how to show up on Google Maps and how to choose between a custom website and a template.",
    read: "Read article",
    published: "Published",
    by: "By Jumalancers",
    more: "More articles",
    back: "All articles",
    ctaTitle: "Want help with your website?",
    ctaDesc: "Tell us about your business over WhatsApp or email and we'll tell you what makes sense, with a clear price and timeline.",
    serviceLink: "See the service",
  },
};
