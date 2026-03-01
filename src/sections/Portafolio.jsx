import { useMemo, useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  Monitor,
  Calendar,
  Layers3,
} from "lucide-react";
import { useLang } from "../i18n.jsx";

const PROJECTS = [
  {
    id: "jaka",
    type: { es: "Trabajo con cliente", en: "Client Work" },
    title: "Jaka Express",
    subtitle: {
      es: "Sitio de logística enfocado en claridad, confianza y contacto rápido",
      en: "Logistics website focused on clarity, trust, and fast contact",
    },
    cover: "/portfolio/jaka.png",
    year: "2022",
    stack: {
      es: ["React", "Tailwind", "Formularios de conversión"],
      en: ["React", "Tailwind", "Conversion Forms"],
    },
    highlights: {
      es: [
        "Cobertura organizada por zonas (MX ↔ US)",
        "Secciones que generan confianza (FAQ, evidencia, claridad)",
        "Flujo optimizado de contacto y cotización",
      ],
      en: [
        "Coverage structured by zones (MX ↔ US)",
        "Trust-building sections (FAQ, proof, clarity)",
        "Optimized contact and quote flow",
      ],
    },
    problem: {
      es: "Jaka Express necesitaba explicar con claridad sus servicios de logística transfronteriza y, al mismo tiempo, facilitar que los clientes potenciales solicitaran una cotización o se pusieran en contacto rápidamente.",
      en: "Jaka Express needed to clearly explain their cross-border logistics services while making it easy for potential clients to request quotes or get in touch quickly.",
    },
    solution: {
      es: "Estructuramos el sitio con un flujo simple: servicios → cobertura → credibilidad → contacto. El diseño prioriza claridad y reduce fricción al momento de cotizar.",
      en: "We structured the site around a simple flow: services → coverage → credibility → contact. The layout prioritizes clarity and reduces friction in the quote process.",
    },
    results: {
      es: [
        "Comunicación más clara del servicio",
        "Mayor percepción de confianza",
        "Mejor flujo de prospectos por contacto directo",
      ],
      en: [
        "Clearer service communication",
        "Stronger trust perception",
        "Improved lead flow via direct contact",
      ],
    },
    liveUrl: "https://jakaexpress.com",
    testimonial: {
      es: "Nuestra nueva página refleja mejor quiénes somos como empresa. La información es clara, el diseño es profesional y ahora el contacto con clientes es mucho más sencillo.",
      en: "Our new website reflects who we are as a company. The information is clear, the design feels professional, and contacting us is now much easier.",
    },
  },

  {
    id: "Jmam",
    type: { es: "Trabajo con cliente", en: "Client Work" },
    title: "JM & AN®",
    subtitle: {
      es: "Sitio profesional para un despacho legal enfocado en emprendedores",
      en: "Professional website for a law firm focused on entrepreneurs",
    },
    cover: "/portfolio/jm&an.png",
    year: "2026",
    stack: {
      es: ["React", "Tailwind", "UX estratégico"],
      en: ["React", "Tailwind", "Strategic UX"],
    },
    highlights: {
      es: [
        "Estructura visual orientada a autoridad",
        "Explicación clara de servicios legales",
        "Posicionamiento sólido hacia emprendedores",
      ],
      en: [
        "Authority-driven visual structure",
        "Clear explanation of legal services",
        "Strong positioning toward entrepreneurs",
      ],
    },
    problem: {
      es: "JM & AN® necesitaba una presencia digital más profesional que comunicara credibilidad, estrategia y claridad, además de ayudar a generar nuevos contactos de clientes.",
      en: "JM & AN® needed a more professional digital presence that communicated credibility, strategy, and clarity — while also helping generate new client inquiries.",
    },
    solution: {
      es: "Diseñamos un sitio limpio y estructurado, con jerarquía fuerte, tipografía profesional y contenido estratégico enfocado en confianza y claridad. El mensaje refuerza su enfoque en apoyar emprendedores y proteger el crecimiento del negocio.",
      en: "We designed a clean, structured website with strong hierarchy, professional typography, and a strategic content layout focused on trust and clarity. The messaging emphasizes their focus on supporting entrepreneurs and protecting business growth.",
    },
    results: {
      es: [
        "Imagen profesional más fuerte",
        "Mejor primera impresión para nuevos clientes",
        "Mayor claridad de servicios legales",
      ],
      en: [
        "Stronger professional image",
        "Better first impression for new clients",
        "Improved clarity of legal services",
      ],
    },
    liveUrl: "https://jmyanabogados.com",
    testimonial: {
      es: "El servicio de Jumalancer’s ha sido excepcional. Ha cumplido y sobrepasado el alcance que pretendíamos para nuestro sitio web. Así mismo, la atención personalizada, puntual y constante de cada uno de sus miembros genera una experiencia muy cálida de servicio.",
      en: "Jumalancer’s service has been exceptional. They met and exceeded what we expected for our website. Their personalized, punctual, and consistent attention creates a very warm service experience.",
    },
  },

  {
    id: "todomex",
    type: { es: "Trabajo con cliente", en: "Client Work" },
    title: "TodoMex Paquetería",
    subtitle: {
      es: "Sitio corporativo para fortalecer marca y generar prospectos",
      en: "Corporate website to strengthen brand presence and attract leads",
    },
    cover: "/portfolio/todomex.png",
    year: "2025",
    stack: {
      es: ["UI/UX", "Diseño responsivo"],
      en: ["UI/UX", "Responsive Design"],
    },
    highlights: {
      es: [
        "Hero alineado a la marca",
        "Servicios estructurados y fáciles de entender",
        "Diseño optimizado para móvil",
      ],
      en: [
        "Brand-focused hero section",
        "Structured service breakdown",
        "Mobile-optimized layout",
      ],
    },
    problem: {
      es: "TodoMex necesitaba un sitio moderno que se sintiera profesional y confiable, y que comunicara con claridad sus servicios de envíos nacionales.",
      en: "TodoMex required a modern website that felt professional and reliable while clearly communicating their national shipping services.",
    },
    solution: {
      es: "Creamos un diseño corporativo limpio, con jerarquía visual clara y secciones alineadas a la marca para reforzar profesionalismo y facilitar el contacto.",
      en: "We developed a clean corporate layout with strong visual hierarchy and brand-focused sections to reinforce professionalism and facilitate customer inquiries.",
    },
    results: {
      es: [
        "Percepción de marca más profesional",
        "Servicios más claros",
        "Mayor credibilidad digital",
      ],
      en: [
        "More professional brand perception",
        "Clearer service presentation",
        "Improved digital credibility",
      ],
    },
    liveUrl: "https://todomexpaqueteria.com",
  },

  // -----------------------------
  // VISUAL PROPOSALS
  // -----------------------------

  {
    id: "menuqr",
    type: { es: "Propuesta visual", en: "Visual Proposal" },
    title: { es: "Menú QR para restaurantes", en: "QR Menu for Restaurants" },
    subtitle: {
      es: "Concepto de menú digital para móvil con acceso por QR",
      en: "Mobile-first digital menu concept with QR access",
    },
    cover: "/portfolio/menu.png",
    year: "2026",
    stack: {
      es: ["Diseño móvil", "UI/UX", "Experiencia restaurante"],
      en: ["Mobile-first", "UI/UX", "Restaurant UX"],
    },
    highlights: {
      es: [
        "Acceso rápido desde la mesa",
        "Presentación visual de platillos",
        "Navegación simple e intuitiva",
      ],
      en: [
        "Optimized for fast table access",
        "Visual dish presentation",
        "Simple and intuitive navigation",
      ],
    },
    problem: {
      es: "Muchos restaurantes necesitan una forma simple de mostrar sus platillos y permitir que el cliente navegue desde su celular sin sistemas complicados.",
      en: "Restaurants often need a simple way to showcase dishes and allow customers to browse from their phones without complicated systems.",
    },
    solution: {
      es: "Diseñamos un menú digital limpio y optimizado para móvil, accesible por código QR. Enfocado en usabilidad, claridad visual y velocidad.",
      en: "Designed a clean, mobile-first digital menu that can be accessed via QR code. Focused on usability, visual clarity, and speed.",
    },
    results: {
      es: [
        "Interacción más rápida en mesa",
        "Mejor presentación de platillos",
        "Concepto escalable para pedidos a futuro",
      ],
      en: [
        "Faster table interaction",
        "Improved presentation of dishes",
        "Scalable concept for future ordering systems",
      ],
    },
    liveUrl: "https://jumalancers.github.io/Qr-menu/",
  },

  {
    id: "cafeteria",
    type: { es: "Propuesta visual", en: "Visual Proposal" },
    title: {
      es: "Concepto de landing para cafetería",
      en: "Coffee Landing Concept",
    },
    subtitle: {
      es: "Propuesta cálida enfocada en marca y conversión",
      en: "Warm brand-focused landing page proposal",
    },
    cover: "/portfolio/coffe.png",
    year: "2026",
    stack: {
      es: ["UI/UX", "Dirección de marca", "Landing"],
      en: ["UI/UX", "Brand Direction", "Landing Design"],
    },
    highlights: {
      es: [
        "Identidad visual cálida y atractiva",
        "Estructura ideal para mostrar menú",
        "Llamados a la acción bien ubicados",
      ],
      en: [
        "Warm and inviting visual identity",
        "Menu-friendly layout",
        "Strong CTA placement",
      ],
    },
    problem: {
      es: "Muchas cafeterías pequeñas batallan para equilibrar calidez con legibilidad y orden en su presencia digital.",
      en: "Small coffee brands often struggle to balance warmth and readability in their online presence.",
    },
    solution: {
      es: "Creamos una landing cálida pero estructurada, con tipografía limpia y espaciado estratégico para mantener claridad y profesionalismo.",
      en: "Created a visually warm yet structured landing page with clean typography and strategic spacing to maintain clarity and professionalism.",
    },
    results: {
      es: [
        "Mejor expresión de personalidad de marca",
        "Jerarquía visual más clara",
        "Sistema de layout reutilizable",
      ],
      en: [
        "Better brand personality expression",
        "Improved visual hierarchy",
        "Reusable layout system",
      ],
    },
    liveUrl: "https://jumalancers.github.io/Lading-caffe/",
  },

  {
    id: "comingsoon",
    type: { es: "Propuesta visual", en: "Visual Proposal" },
    title: {
      es: "Plantilla de lanzamiento",
      en: "Launch / Coming Soon Template",
    },
    subtitle: {
      es: "Landing previa para capturar interés antes del lanzamiento",
      en: "Pre-launch landing to capture interest before full release",
    },
    cover: "/portfolio/coming_soon.png",
    year: "2026",
    stack: {
      es: ["Landing", "Captación de prospectos", "UI minimalista"],
      en: ["Landing", "Lead Capture", "Minimal UI"],
    },
    highlights: {
      es: [
        "Estructura rápida de publicar",
        "Enfoque total en el llamado a la acción",
        "Lista para capturar correos",
      ],
      en: [
        "Fast-to-deploy structure",
        "Clear CTA focus",
        "Email capture ready",
      ],
    },
    problem: {
      es: "Muchos negocios necesitan validar demanda o captar interés antes de invertir en un sitio completo.",
      en: "Many businesses need to validate demand or collect interest before investing in a full website build.",
    },
    solution: {
      es: "Diseñamos una plantilla simple que puede salir rápido y empezar a captar prospectos desde el día uno.",
      en: "Designed a simple pre-launch page template that can go live quickly while collecting leads and building anticipation.",
    },
    results: {
      es: [
        "Captación de prospectos desde el inicio",
        "Menor tiempo para salir al mercado",
        "Validación con poca fricción",
      ],
      en: [
        "Lead capture from day one",
        "Faster time-to-market",
        "Low-friction validation tool",
      ],
    },
    liveUrl: "https://jumalancers.github.io/Coming-soon/",
  },
];

function Pill({ children }) {
  return (
    <span className="rounded-full bg-bg-50 px-3 py-1 text-xs font-semibold text-text-700 border w-fit">
      {children}
    </span>
  );
}

export default function Portfolio() {
  const { t, lang } = useLang();
  const tx = (v) => (v && typeof v === "object" ? v[lang] : v);
  const [active, setActive] = useState(null);

  const items = useMemo(() => PROJECTS, []);
  const featured = items.slice(0, 2);
  const rest = items.slice(2);

  const open = (p) => setActive(p);
  const close = () => setActive(null);

  return (
    <section id="portfolio" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wide text-primary-500">
            {t("portfolio.badge")}
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-text-900">
            {t("portfolio.titleA")}{" "}
            <span className="text-primary-500">{t("portfolio.titleB")}</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-text-700 leading-relaxed">
            {t("portfolio.desc")}
          </p>
        </div>

        {/* Featured */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((p) => (
            <button
              key={p.id}
              onClick={() => open(p)}
              className="text-left rounded-3xl bg-bg-100 p-5 sm:p-6 hover:bg-bg-200/60 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <Pill>{tx(p.type)}</Pill>
                <span className="text-xs font-semibold text-text-500">
                  {p.year}
                </span>
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-text-900">
                {tx(p.title)}
              </h3>
              <p className="mt-2 text-sm text-text-700">{tx(p.subtitle)}</p>

              <div className="mt-5 rounded-2xl overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img
                    src={p.cover}
                    alt={tx(p.title)}
                    loading="lazy"
                    className="
        relative z-10
        w-full h-full
        object-contain
        rounded-xl
      "
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {tx(p.stack).map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-500">
                {t("portfolio.featuredCta")}{" "}
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Rest grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((p) => (
            <button
              key={p.id}
              onClick={() => open(p)}
              className="text-left rounded-3xl bg-bg-100 p-4 hover:bg-bg-200/60 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-primary-500">
                  {tx(p.type)}
                </span>
                <span className="text-[11px] font-semibold text-text-500">
                  {p.year}
                </span>
              </div>

              <h3 className="mt-2 text-base font-semibold text-text-900">
                {tx(p.title)}
              </h3>
              <p className="mt-1 text-xs text-text-700 line-clamp-2">
                {tx(p.subtitle)}
              </p>

              <div className="mt-3 rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img
                    src={p.cover}
                    alt={tx(p.title)}
                    loading="lazy"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tx(p.stack)
                  .slice(0, 2)
                  .map((item) => (
                    <Pill key={item}>{item}</Pill>
                  ))}
              </div>

              <div className="mt-3 text-sm font-semibold text-primary-500 inline-flex items-center gap-2">
                {t("portfolio.gridCta")} <ArrowUpRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl bg-bg-100 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm sm:text-base text-text-700">
            {t("portfolio.bottomText")}
          </p>
          <a
            href="#quote"
            className="
              inline-flex items-center justify-center gap-2
              h-11 px-6 rounded-full
              bg-primary-500 text-bg-50 font-semibold
              hover:opacity-90 transition
            "
          >
            {t("portfolio.bottomCta")} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {active && <ProjectModal active={active} onClose={close} />}
    </section>
  );
}

function ProjectModal({ active, onClose }) {
  const { t, lang } = useLang();
  const tx = (v) => (v && typeof v === "object" ? v[lang] : v);
  // lock body scroll + escape to close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-bg-900/55"
        aria-label={t("portfolio.modal.close")}
      />

      {/* Safe area */}
      <div className="absolute inset-0 p-3 sm:p-4 md:p-6 grid place-items-end md:place-items-center">
        <div
          className="
            w-full max-w-7xl
            rounded-3xl bg-bg-50 overflow-hidden
            max-h-[88dvh] md:max-h-[82dvh]
            flex flex-col
          "
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="shrink-0 flex items-start justify-between gap-4 px-4 sm:px-6 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-primary-500 border px-4 py-1 rounded-full w-fit">
                {tx(active.type)}
              </p>

              <h3 className="mt-3 text-lg sm:text-xl font-semibold text-text-900 ml-2">
                {tx(active.title)}
              </h3>

              {active.subtitle ? (
                <p className="mt-1 text-sm text-text-700 ml-2">
                  {tx(active.subtitle)}
                </p>
              ) : null}
            </div>

            <button
              onClick={onClose}
              className="
                h-10 w-10 shrink-0
                rounded-full
                bg-bg-50 hover:bg-bg-200/60
                transition grid place-items-center
              "
              aria-label={t("portfolio.modal.close")}
            >
              <X className="h-5 w-5 text-text-900" />
            </button>
          </div>

          {/* Body (scrollable) */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* LEFT: Screenshot */}
              <div className="lg:col-span-7">
                <div className="p-4 sm:p-5">
                  <div className="rounded-2xl overflow-hidden border border-border/40">
                    {/* Screenshot frame */}
                    <div className="p-3 sm:p-4">
                      <div className="rounded-xl overflow-hidden">
                        <div className="relative aspect-[16/10]">
                          {/* This prevents weird stretching and keeps it contained */}
                          <img
                            src={active.cover}
                            alt={tx(active.title)}
                            loading="lazy"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="px-4 sm:px-5 py-3 bg-bg-50 border-t border-border/30">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-500">
                        {active.year ? (
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary-500" />
                            {active.year}
                          </span>
                        ) : null}

                        {tx(active.stack)?.length ? (
                          <span className="inline-flex items-center gap-2">
                            <Layers3 className="h-4 w-4 text-primary-500" />
                            {tx(active.stack).slice(0, 3).join(" • ")}
                            {tx(active.stack).length > 3 ? " • …" : ""}
                          </span>
                        ) : null}

                        <span className="inline-flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-primary-500" />
                          {t("portfolio.modal.preview")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Content */}
              <div className="lg:col-span-5 p-4 sm:p-6">
                {/* Pills */}
                {tx(active.stack)?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {tx(active.stack).map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 space-y-5">
                  {tx(active.problem) ? (
                    <div>
                      <p className="text-xs font-semibold text-text-500">
                        {t("portfolio.modal.problem")}
                      </p>
                      <p className="mt-1 text-sm text-text-700 leading-relaxed">
                        {tx(active.problem)}
                      </p>
                    </div>
                  ) : null}

                  {tx(active.solution) ? (
                    <div className="border-b pb-5 border-primary-200">
                      <p className="text-xs font-semibold text-text-500">
                        {t("portfolio.modal.solution")}
                      </p>
                      <p className="mt-1 text-sm text-text-700 leading-relaxed">
                        {tx(active.solution)}
                      </p>
                    </div>
                  ) : null}

                  {tx(active.testimonial) ? (
                    <div className="border-b pb-5 border-primary-200">
                      <p className="text-xs font-semiboldtext-text-500">
                        {t("portfolio.modal.testimonial")}
                      </p>

                      <div className="mt-2 rounded-2xl bg-bg-100 p-4">
                        <p className="text-base text-text-700 leading-relaxed italic font-serif font-light">
                          “{tx(active.testimonial)}”
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {tx(active.highlights)?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-text-500">
                        {t("portfolio.modal.highlights")}
                      </p>
                      <div className="mt-2 space-y-2">
                        {tx(active.highlights).map((x) => (
                          <div
                            key={x}
                            className="flex items-start gap-2 text-sm text-text-700"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-500" />
                            <span>{x}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {active.results?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-text-500">
                        {t("portfolio.modal.impact")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tx(active.results).map((r) => (
                          <span
                            key={r}
                            className="rounded-full bg-bg-100 px-3 py-1 text-xs font-semibold text-text-700"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="#quote"
                    onClick={onClose}
                    className="
                      h-11 px-5 rounded-full
                      bg-primary-500 text-bg-50
                      font-semibold
                      inline-flex items-center justify-center gap-2
                      hover:opacity-90 transition
                    "
                  >
                    {t("portfolio.modal.startSimilar")}{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  {active.liveUrl ? (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        h-11 px-5 rounded-full
                        bg-bg-100 text-text-900
                        font-semibold
                        inline-flex items-center justify-center gap-2
                        hover:bg-bg-200/60 transition
                      "
                    >
                      {t("portfolio.modal.visitSite")}{" "}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
