// Textos de la sección "contact" (es/en).
export default {
  es: {
    eyebrow: "Contacto",
    title: "Hablemos de tu",
    accent: "proyecto",
    desc: "Cuéntanos qué necesitas: una landing page, un sitio para tu negocio o un sistema web a medida. Te respondemos en menos de 24 horas.",
    waText:
      "Hola Jumalancers, me interesa cotizar un proyecto web. Mi negocio es: ___ . Necesito: ___ .",
    emailSubject: "Consulta de proyecto - Jumalancers",

    channels: {
      whatsapp: { label: "WhatsApp", hint: "La vía más rápida." },
      email: { label: "Email", hint: "Ideal para enviar referencias y detalles." },
      location: {
        label: "Ubicación",
        value: "Tijuana, Baja California",
        hint: "Atendemos clientes en México y EE. UU.",
      },
      hours: {
        label: "Tiempo de respuesta",
        value: "Menos de 24 horas",
        hint: "Por WhatsApp o email, directo con quien hace tu sitio.",
      },
    },

    next: {
      title: "Qué pasa después de escribirnos",
      steps: [
        { title: "Te respondemos", desc: "En menos de 24 h, con preguntas puntuales sobre tu negocio." },
        { title: "Llamada breve", desc: "15–20 minutos para entender objetivos, alcance y tiempos." },
        { title: "Propuesta clara", desc: "Precio cerrado, entregables y fecha de entrega por escrito." },
      ],
    },

    form: {
      title: "Cuéntanos sobre tu proyecto",
      desc: "Con un resumen corto basta. Los campos con * son obligatorios.",
      name: "Nombre",
      namePh: "Tu nombre",
      email: "Email",
      emailPh: "tu@empresa.com",
      company: "Empresa",
      companyPh: "Nombre de tu negocio",
      optional: "opcional",
      type: "Tipo de proyecto",
      types: {
        landing: "Landing page",
        corporate: "Sitio corporativo",
        system: "Sistema / App",
        ecommerce: "E-commerce",
        other: "Otro",
      },
      budget: "Presupuesto aproximado",
      budgets: {
        b1: "Menos de $1,000",
        b2: "$1,000 – $2,000",
        b3: "$2,000 – $3,000",
        b4: "$3,000+",
        unsure: "Aún no lo sé",
      },
      budgetNote: "Montos en USD. Nuestros planes van de $599 a $2,999+.",
      message: "Mensaje",
      messagePh: "¿Qué quieres lograr? (más clientes, citas, ventas…) Si tienes sitios de referencia, inclúyelos.",
      honeypot: "No llenes este campo",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      privacy: "Sin spam. Solo usamos tus datos para responder a tu solicitud.",
    },

    errors: {
      nameReq: "Escribe tu nombre.",
      emailReq: "Escribe tu email.",
      emailValid: "Escribe un email válido (ej. tu@empresa.com).",
      msgReq: "Cuéntanos un poco sobre tu proyecto.",
      summary: "Revisa los campos marcados.",
      envMissing: "El formulario no está disponible en este momento. Escríbenos por email o:",
      fail: "No se pudo enviar el mensaje. Intenta de nuevo en un momento.",
      waCta: "Escribir por WhatsApp",
    },

    success: {
      title: "¡Mensaje enviado!",
      desc: "Gracias, {name}. Recibimos tu solicitud y te responderemos en menos de 24 horas a {email}.",
      waHint: "¿Prefieres avanzar más rápido? Escríbenos por WhatsApp.",
      waCta: "Continuar por WhatsApp",
      again: "Enviar otro mensaje",
    },
  },

  en: {
    eyebrow: "Contact",
    title: "Let's talk about your",
    accent: "project",
    desc: "Tell us what you need: a landing page, a small business website or a custom web app. We reply within 24 hours, in English.",
    waText:
      "Hi Jumalancers, I'd like a quote for a web project. My business is: ___ . I need: ___ .",
    emailSubject: "Project inquiry - Jumalancers",

    channels: {
      whatsapp: { label: "WhatsApp", hint: "The fastest way to reach us." },
      email: { label: "Email", hint: "Best for sending references and details." },
      location: {
        label: "Location",
        value: "Tijuana, Baja California",
        hint: "Pacific Time · serving the US and Mexico",
      },
      hours: {
        label: "Response time",
        value: "Under 24 hours",
        hint: "By WhatsApp or email, straight from the people building your site.",
      },
    },

    next: {
      title: "What happens after you reach out",
      steps: [
        { title: "We reply", desc: "Within 24 hours, with a few quick questions about your business." },
        { title: "Quick call", desc: "15–20 minutes on your goals, scope and timeline." },
        { title: "Clear proposal", desc: "Fixed price, deliverables and delivery date in writing." },
      ],
    },

    form: {
      title: "Tell us about your project",
      desc: "A short summary is enough. Fields marked * are required.",
      name: "Name",
      namePh: "Your name",
      email: "Email",
      emailPh: "you@company.com",
      company: "Company",
      companyPh: "Your business name",
      optional: "optional",
      type: "Project type",
      types: {
        landing: "Landing page",
        corporate: "Business website",
        system: "Web app / system",
        ecommerce: "E-commerce",
        other: "Other",
      },
      budget: "Approximate budget",
      budgets: {
        b1: "Under $1,000",
        b2: "$1,000 – $2,000",
        b3: "$2,000 – $3,000",
        b4: "$3,000+",
        unsure: "Not sure yet",
      },
      budgetNote: "Amounts in USD. Our plans range from $599 to $2,999+.",
      message: "Message",
      messagePh: "What do you want to achieve? (more leads, bookings, sales…) Include any reference sites you like.",
      honeypot: "Leave this field empty",
      submit: "Send message",
      sending: "Sending…",
      privacy: "No spam. We only use your details to reply to your request.",
    },

    errors: {
      nameReq: "Please enter your name.",
      emailReq: "Please enter your email.",
      emailValid: "Please enter a valid email (e.g. you@company.com).",
      msgReq: "Tell us a little about your project.",
      summary: "Please check the highlighted fields.",
      envMissing: "The form is unavailable right now. Reach us by email or:",
      fail: "We couldn't send your message. Please try again in a moment.",
      waCta: "Message us on WhatsApp",
    },

    success: {
      title: "Message sent!",
      desc: "Thanks, {name}. We got your request and will reply within 24 hours at {email}.",
      waHint: "Want to move faster? Message us on WhatsApp.",
      waCta: "Continue on WhatsApp",
      again: "Send another message",
    },
  },
};
