import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useLang } from "../i18n.jsx";
import { waLink } from "../data/site.js";

// Enlaces principales (orden del sitio). Los ids son los anclas de cada sección.
const LINKS = [
  { id: "services", key: "nav.services" },
  { id: "portfolio", key: "nav.portfolio" },
  { id: "process", key: "nav.process" },
  { id: "plans", key: "nav.plans" },
  { id: "faq", key: "nav.faq" },
];

// Todas las secciones que observa el scroll-spy (incluye las que no están en el menú
// para que el indicador se apague al pasar por ellas).
const SPY_IDS = [
  "hero",
  "services",
  "portfolio",
  "process",
  "why",
  "testimonials",
  "plans",
  "quote",
  "faq",
  "contact",
];

/* ---------- Iconos inline ---------- */

function FlagMX({ className = "" }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true" focusable="false">
      <rect width="10" height="20" fill="#006847" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.6" fill="#8c6a2f" />
      <path d="M12.6 11.4q2.4 2 4.8 0" stroke="#006847" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function FlagUS({ className = "" }) {
  const h = 20 / 13;
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * h} width="30" height={h} fill="#b22234" />
      ))}
      <rect width="13" height={h * 7} fill="#3c3b6e" />
      {[2, 5, 8, 11].map((x) =>
        [2.2, 5.4, 8.6].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />),
      )}
    </svg>
  );
}

function WhatsAppIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.44-9.45 9.44m8.04-17.48A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.05c0 2 .52 3.96 1.52 5.68L.58 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04" />
    </svg>
  );
}

/* ---------- Selector de idioma ---------- */

function LangSwitch({ size = "sm", className = "inline-flex" }) {
  const { t, lang, setLang } = useLang();
  const opts = [
    { code: "es", label: "ES", name: t("nav.langEs"), Flag: FlagMX },
    { code: "en", label: "EN", name: t("nav.langEn"), Flag: FlagUS },
  ];
  const big = size === "lg";
  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={`items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
    >
      {opts.map((o) => {
        const { code, label, name, Flag } = o;
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={name}
            title={name}
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
              big ? "h-11 px-4 text-sm" : "h-9 px-2.5 text-[11px] tracking-wide"
            } ${
              active
                ? "bg-white/10 text-text-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
                : "text-text-500 hover:text-text-900"
            }`}
          >
            <Flag
              className={`${big ? "h-3.5 w-5" : "h-2.5 w-3.5"} shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/15 transition ${
                active ? "" : "opacity-60 grayscale-[40%]"
              }`}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Navbar ---------- */

export default function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  const linksRef = useRef(null);
  const linkRefs = useRef({});
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const wasOpen = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  // Compacta la barra al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: sección activa = la que cruza la franja central del viewport
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = SPY_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const footer = document.querySelector("footer");
    if (footer) els.push(footer);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id || "footer");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Posiciona la "píldora" deslizante bajo el enlace activo
  useEffect(() => {
    const update = () => {
      const el = linkRefs.current[active];
      const wrap = linksRef.current;
      if (!el || !wrap) {
        setIndicator((p) => ({ ...p, visible: false }));
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    };
    update();
    window.addEventListener("resize", update);
    // El ancho de la barra cambia al compactarse: recalcula al terminar la transición
    const id = window.setTimeout(update, 520);
    return () => {
      window.removeEventListener("resize", update);
      window.clearTimeout(id);
    };
  }, [active, scrolled, t]);

  // Cierra el menú si se pasa a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Menú móvil: bloquea scroll, Escape, trampa de foco y retorno de foco
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) burgerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const f = menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const wa = waLink(t("nav.waMessage"));
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[hsl(167,60%,6%)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-text-900"
      >
        {t("nav.skip")}
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 sm:px-4">
        <div
          className={`pointer-events-auto mx-auto flex items-center gap-2 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            scrolled
              ? "mt-2 h-14 max-w-5xl border-white/10 bg-bg-50/75 pl-2.5 pr-2 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150"
              : "mt-3 h-16 max-w-6xl border-white/[0.07] bg-bg-50/35 pl-3 pr-2.5 backdrop-blur-md sm:mt-4"
          }`}
        >
          {/* Marca */}
          <a
            href="#hero"
            aria-label={t("nav.home")}
            className={`flex shrink-0 items-center gap-2 rounded-full pr-2 ${focusRing}`}
          >
            <img
              src="/Logodark.png"
              alt={t("nav.logoAlt")}
              width="500"
              height="500"
              decoding="async"
              draggable="false"
              className={`object-contain transition-all duration-500 motion-reduce:transition-none ${
                scrolled ? "h-9 w-9" : "h-10 w-10"
              }`}
            />
            <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-text-900 sm:text-base">
              Jumalancers
            </span>
          </a>

          {/* Enlaces desktop */}
          <nav aria-label={t("nav.ariaMain")} className="hidden flex-1 justify-center lg:flex">
            <ul ref={linksRef} className="relative flex items-center gap-0.5">
              <li
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 rounded-full border border-white/[0.08] bg-white/[0.06] transition-all duration-300 ease-out motion-reduce:transition-none"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />
              {LINKS.map((l) => {
                const isActive = active === l.id;
                return (
                  <li key={l.id}>
                    <a
                      ref={(el) => (linkRefs.current[l.id] = el)}
                      href={`#${l.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors ${focusRing} ${
                        isActive ? "text-text-900" : "text-text-500 hover:text-text-900"
                      }`}
                    >
                      {t(l.key)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Acciones */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
            <LangSwitch className="hidden min-[360px]:inline-flex" />

            <a
              href={wa}
              target="_blank"
              rel="noopener"
              aria-label={t("nav.whatsapp")}
              title={t("nav.whatsapp")}
              className={`hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-text-700 transition hover:border-primary-400/40 hover:bg-primary-500/10 hover:text-primary-300 sm:inline-flex ${focusRing}`}
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </a>

            <a
              href="#quote"
              className={`group hidden h-10 items-center gap-1.5 rounded-full bg-primary-400 px-4 text-sm font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_24px_-8px] shadow-primary-400/60 transition hover:bg-primary-300 active:scale-[0.98] sm:inline-flex ${focusRing}`}
            >
              {t("nav.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={t("nav.open")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-text-900 transition hover:bg-white/10 lg:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menú móvil a pantalla completa */}
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.ariaMobile")}
          inert={!open}
          className={`pointer-events-auto fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg-50/95 backdrop-blur-2xl transition-[opacity,visibility] duration-300 motion-reduce:transition-none lg:hidden ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {/* Glow decorativo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full glow-orb text-primary-500/15"
          />

          <div className="relative flex h-16 shrink-0 items-center justify-between px-6 pt-3">
            <a href="#hero" onClick={close} className={`flex items-center gap-2 rounded-full ${focusRing}`}>
              <img
                src="/Logodark.png"
                alt={t("nav.logoAlt")}
                width="500"
                height="500"
                loading="lazy"
                decoding="async"
                draggable="false"
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-base font-semibold tracking-[-0.02em] text-text-900">
                Jumalancers
              </span>
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t("nav.close")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-text-900 transition hover:bg-white/10 ${focusRing}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label={t("nav.ariaMain")} className="relative flex-1 px-6 pt-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-300">
              {t("nav.menu")}
            </p>
            <ul className="mt-3 border-t border-white/[0.08]">
              {LINKS.map((l, i) => {
                const isActive = active === l.id;
                return (
                  <li
                    key={l.id}
                    className={`border-b border-white/[0.08] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={close}
                      aria-current={isActive ? "location" : undefined}
                      className={`group flex items-baseline gap-4 py-4 font-display text-3xl font-semibold tracking-[-0.03em] transition-colors focus:outline-none focus-visible:text-primary-300 ${
                        isActive ? "text-primary-300" : "text-text-900 hover:text-primary-300"
                      }`}
                    >
                      <span className="w-7 font-serif text-base font-normal italic tracking-normal text-text-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {t(l.key)}
                      <ArrowRight className="ml-auto h-5 w-5 self-center -translate-x-2 text-primary-300 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={`relative shrink-0 space-y-5 px-6 pb-8 pt-8 transition duration-500 motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: open ? "340ms" : "0ms" }}
          >
            <div className="grid grid-cols-2 gap-3">
              <a
                href="#quote"
                onClick={close}
                className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary-400 font-semibold text-[hsl(167,60%,6%)] transition hover:bg-primary-300 ${focusRing}`}
              >
                {t("nav.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] font-semibold text-text-900 transition hover:bg-white/10 ${focusRing}`}
              >
                <WhatsAppIcon className="h-[18px] w-[18px] text-primary-300" />
                WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LangSwitch size="lg" />
              <p className="max-w-[16rem] text-xs leading-relaxed text-text-500">{t("nav.mobileTagline")}</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
