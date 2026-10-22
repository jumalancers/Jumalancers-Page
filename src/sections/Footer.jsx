import { Instagram, Facebook, Mail, MapPin, ArrowUpRight, ArrowRight, ArrowUp } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { SITE, waLink } from "../data/site.js";

// Mismos enlaces y textos que el Navbar (nav.*)
const NAV_LINKS = [
  { id: "services", key: "nav.services" },
  { id: "portfolio", key: "nav.portfolio" },
  { id: "process", key: "nav.process" },
  { id: "plans", key: "nav.plans" },
  { id: "faq", key: "nav.faq" },
  { id: "quote", key: "nav.cta" },
];

function WhatsAppIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.05c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}

const colTitle = "text-xs font-semibold uppercase tracking-[0.16em] text-text-900";
const linkCls =
  "group inline-flex min-h-10 items-center gap-1.5 rounded py-1.5 leading-snug text-text-500 transition sm:min-h-0 sm:py-0 hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";
const ringOffset =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();
  const wa = waLink(t("footer.waMessage"));
  const services = t("footer.services");

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.08] text-text-500">
      {/* Glow superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full glow-orb text-primary-500/10"
      />

      <div className="container-x pt-20 lg:pt-28">
        {/* ===== CTA final ===== */}
        <Reveal>
          <div className="card relative overflow-hidden px-5 py-12 text-center min-[400px]:px-6 sm:px-12 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[38rem] max-w-[120%] -translate-x-1/2 rounded-full glow-orb text-primary-400/15"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
            />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
                </span>
                {t("footer.ctaEyebrow")}
              </span>
              <h2 className="mt-5 font-display text-[2rem] font-semibold min-[400px]:text-4xl leading-[1.05] tracking-[-0.03em] text-text-900 text-balance sm:text-5xl lg:text-6xl">
                {t("footer.ctaTitle")} <span className="accent-serif text-[1.08em]">{t("footer.ctaAccent")}</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-text-500 text-pretty sm:text-lg">
                {t("footer.ctaDesc")}
              </p>
              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <a
                  href="#quote"
                  className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-400 px-5 py-3 text-center font-semibold leading-tight sm:px-7 text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 active:scale-[0.98] ${ringOffset}`}
                >
                  {t("footer.ctaQuote")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener"
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-center font-semibold leading-tight sm:px-7 text-text-900 backdrop-blur transition hover:border-white/25 hover:bg-white/10 active:scale-[0.98] ${ringOffset}`}
                >
                  <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 text-primary-300" />
                  {t("footer.ctaWhatsapp")}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ===== Columnas ===== */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          {/* Marca */}
          <div className="col-span-2 lg:col-span-4">
            <a href="#hero" className={`inline-flex items-center gap-2.5 rounded-full pr-2 ${ringOffset}`}>
              <img
                src="/Logodark.png"
                alt={t("nav.logoAlt")}
                width="500"
                height="500"
                loading="lazy"
                decoding="async"
                draggable="false"
                className="h-11 w-11 object-contain"
              />
              <span className="font-display text-xl font-semibold tracking-[-0.02em] text-text-900">Jumalancers</span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-500 text-pretty">{t("footer.brandDesc")}</p>
            <div className="mt-6 flex items-center gap-2">
              <span className="sr-only">{t("footer.social")}</span>
              {[
                { href: SITE.instagram, label: "Instagram", Icon: Instagram },
                { href: SITE.facebook, label: "Facebook", Icon: Facebook },
                { href: wa, label: "WhatsApp", Icon: WhatsAppIcon },
              ].map((s) => {
                const { href, label, Icon } = s;
                return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${label} — Jumalancers`}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-text-500 transition hover:-translate-y-0.5 hover:border-primary-400/40 hover:bg-primary-500/10 hover:text-primary-300 ${ringOffset}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
                );
              })}
            </div>
          </div>

          {/* Navegación */}
          <nav aria-label={t("footer.navTitle")} className="lg:col-span-2 lg:col-start-6">
            <h3 className={colTitle}>{t("footer.navTitle")}</h3>
            <ul className="mt-3 text-sm sm:mt-5 sm:space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className={linkCls}>
                    {t(l.key)}
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Servicios */}
          <div className="lg:col-span-2">
            <h3 className={colTitle}>{t("footer.servicesTitle")}</h3>
            <ul className="mt-3 text-sm sm:mt-5 sm:space-y-3">
              {Array.isArray(services) &&
                services.map((s) => (
                  <li key={s}>
                    <a href="#services" className={linkCls}>
                      {s}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h3 className={colTitle}>{t("footer.contactTitle")}</h3>
            <address className="mt-3 space-y-1 text-sm not-italic sm:mt-5 sm:space-y-3.5">
              <a href={`mailto:${SITE.email}`} className={`${linkCls.replace("inline-flex", "flex")} w-fit break-all`}>
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                {SITE.email}
              </a>
              <a href={wa} target="_blank" rel="noopener" className={`${linkCls.replace("inline-flex", "flex")} w-fit`}>
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-primary-400" />
                {SITE.whatsappDisplay}
              </a>
              <p className="flex items-start gap-1.5 text-text-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span>
                  {t("footer.location")}
                  <span className="block text-text-300">{t("footer.serving")}</span>
                </span>
              </p>
            </address>
          </div>
        </div>

        {/* ===== Fila inferior ===== */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] py-8 text-xs text-text-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Jumalancers. {t("footer.rights")}
          </p>
          <div className="flex items-center justify-between gap-5 sm:justify-start">
            <p className="text-text-300">{t("footer.madeIn")}</p>
            <a
              href="#hero"
              className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 px-3.5 py-1.5 text-text-700 sm:min-h-0 transition hover:border-white/20 hover:text-text-900 ${ringOffset}`}
            >
              <ArrowUp className="h-3.5 w-3.5" />
              {t("footer.backToTop")}
            </a>
          </div>
        </div>
      </div>

      {/* Wordmark gigante de fondo */}
      <div aria-hidden="true" className="pointer-events-none relative -mt-4 select-none sm:-mt-10 lg:-mt-16 overflow-hidden">
        <p className="translate-y-[22%] whitespace-nowrap text-center font-display text-[17vw] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.07)] bg-gradient-to-b from-white/[0.06] to-transparent bg-clip-text">
          Jumalancers
        </p>
      </div>
    </footer>
  );
}
