import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { useLang } from "../i18n.jsx";

const LINKS = [
  { id: "process", key: "nav.process" },
  { id: "portfolio", key: "nav.portfolio" },
  { id: "why", key: "nav.why" },
  { id: "quote", key: "nav.quote" },
  { id: "contact", key: "nav.contact" },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close panel on resize up to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false); // lg
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when panel open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const isDark = theme === "dark";
  const logoSrc = isDark ? "/Logodark.png" : "/Logolight.png";

  return (
    <nav className="sticky top-0 w-full z-40" ref={wrapRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-3">
        <div
          className="
            rounded-b-2xl
            bg-bg-50/70 backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-2 px-2">
            {/* Brand */}
            <button
              onClick={() => scrollToId("hero")}
              className="flex items-center py-3 sm:py-4 cursor-pointer shrink-0"
              aria-label="Go to top"
            >
              <img
                src={logoSrc}
                alt="Jumalancers logo"
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain"
                draggable="false"
              />
              <p className="ml-2 text-base sm:text-lg lg:text-xl font-semibold text-primary-500 whitespace-nowrap">
                Jumalancer&apos;s
              </p>
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollToId(l.id)}
                  className="
                    relative text-sm font-medium
                    text-text-700 hover:text-text-900
                    transition-colors
                    after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
                    after:origin-left after:scale-x-0 after:bg-primary-500/70
                    after:transition-transform after:duration-200
                    hover:after:scale-x-100
                    whitespace-nowrap
                  "
                >
                  {t(l.key)}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2 py-3 sm:py-4 shrink-0">
              {/* ✅ Only translation outside (always visible) */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-bg-200/60 transition"
                aria-label="Toggle language"
              >
                <span
                  className={`fi ${lang === "es" ? "fi-us" : "fi-mx"} rounded-sm`}
                ></span>
                <p className="font-bold text-xs sm:text-sm text-text-700">
                  {lang === "es" ? "EN" : "ES"}
                </p>
              </button>
              {/* Theme toggle inside panel */}
              <button
                onClick={toggleTheme}
                className="
                hidden
                w-full sm:inline-flex items-center justify-center p-2
                rounded-xl
                text-text-900
                hover:bg-bg-200/60
                transition
              "
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Desktop CTA (optional, keep it here if you want on desktop) */}
              <button
                onClick={() => scrollToId("quote")}
                className="
                  hidden lg:inline-flex items-center gap-2
                  h-10 px-4 rounded-full
                  bg-primary-500 text-bg-50
                  font-semibold text-sm
                  hover:opacity-90 active:scale-[0.98]
                  transition
                  whitespace-nowrap
                "
              >
                {t("nav.cta")} <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setOpen(true)}
                className="
                  lg:hidden p-2 rounded-xl
                  text-text-900
                  inline-flex items-center justify-center
                  transition
                "
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile slide panel (right -> left) */}
      <div
        className={`lg:hidden fixed inset-0 z-50 backdrop-blur-xs transition ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <aside
          className={`
            absolute right-0 top-0 h-dvh
            w-full max-w-95 bg-bg-50
            transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Panel header */}
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="Jumalancers logo"
                className="w-9 h-9 object-contain"
                draggable="false"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-text-900">
                  {t("nav.navigation")}
                </p>
                <p className="text-xs text-text-500">{t("nav.menu")}</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="
                p-2 rounded-xl
                bg-bg-100/50
                text-text-900
                transition
              "
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="p-4">
            <div className="flex flex-col">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    scrollToId(l.id);
                    setOpen(false);
                  }}
                  className="
                    group w-full text-left
                    px-3 py-3 rounded-xl
                    text-text-700
                    hover:text-text-900 hover:bg-bg-100/70
                    active:bg-bg-200/60
                    transition
                  "
                >
                  <span className="relative inline-block">
                    {t(l.key)}
                    <span
                      className="
                        absolute left-0 -bottom-1 h-[2px] w-full
                        origin-left scale-x-0 bg-primary-500/70
                        transition-transform duration-200
                        group-hover:scale-x-100
                      "
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Quote inside panel */}
            <button
              onClick={() => {
                scrollToId("quote");
                setOpen(false);
              }}
              className="
                mt-4 w-full inline-flex items-center justify-center gap-2
                h-11 rounded-xl
                bg-primary-500 text-bg-50
                font-semibold
                hover:opacity-90 active:scale-[0.99]
                transition
              "
            >
              {t("nav.cta")} <ArrowRight className="w-4 h-4" />
            </button>

            {/* Theme toggle inside panel */}
            <button
              onClick={toggleTheme}
              className="
                mt-3 w-full inline-flex items-center justify-center gap-2
                h-11 rounded-xl
                border border-border/50
                bg-bg-100/60
                text-text-900
                hover:bg-bg-200/60
                transition
              "
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="text-sm font-semibold">
                {isDark ? t("nav.light") : t("nav.dark")}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </nav>
  );
}
