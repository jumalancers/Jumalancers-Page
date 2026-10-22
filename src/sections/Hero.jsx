import { CheckCircle2, Clock, Languages, Lock, Smartphone } from "lucide-react";
import { useLang } from "../i18n.jsx";
import { Button } from "../components/ui/index.jsx";
import { shot } from "../data/projects.js";

// Entrada del hero solo con CSS (sin JS): el contenido prerenderizado es visible
// y animado desde el primer pintado, sin esperar a la hidratación (mejor LCP).
const HERO_CSS = `
@keyframes hero-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes hero-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.hero-in { animation: hero-in .8s cubic-bezier(.22,1,.36,1) both; animation-delay: var(--d, 0ms); }
.hero-float { animation: hero-float 7s ease-in-out infinite; animation-delay: var(--fd, 0s); }
@media (prefers-reduced-motion: reduce) { .hero-in, .hero-float { animation: none !important; } }
`;

function FlagMX({ className = "" }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="10" height="20" fill="#006847" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce1126" />
      <circle cx="15" cy="10" r="2.4" fill="#8c5a2b" opacity=".85" />
    </svg>
  );
}

function FlagUS({ className = "" }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="13" height={(20 / 13) * 7} fill="#3c3b6e" />
    </svg>
  );
}

function ProofIcon({ icon }) {
  const Icon = icon;
  return <Icon className="h-4 w-4 text-primary-300" aria-hidden="true" />;
}

// Teléfono con captura móvil real (390x844)
function Phone({ src, alt, className = "", style }) {
  return (
    <div
      className={`absolute rounded-[1.6rem] bg-[hsl(167,30%,9%)] p-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.75)] ring-1 ring-white/15 sm:rounded-[2rem] sm:p-[6px] ${className}`}
      style={style}
    >
      <div className="relative overflow-hidden rounded-[1.3rem] bg-black sm:rounded-[1.65rem]">
        <img
          src={src}
          alt={alt}
          width="390"
          height="844"
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 h-1.5 w-1/3 -translate-x-1/2 rounded-full bg-black/80"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const [mainId, mainHost, frontId] = ["jmyan", "jmyanabogados.com", "waldo"];

  const proof = [
    { icon: Clock, value: t("hero.proof.response"), label: t("hero.proof.responseLabel") },
    { icon: Languages, value: t("hero.proof.bilingual"), label: t("hero.proof.bilingualLabel") },
  ];

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden pt-28 pb-6 sm:pt-32 sm:pb-12 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-28 lg:pb-12"
    >
      <style>{HERO_CSS}</style>

      {/* Fondo: glows menta + retícula con desvanecido */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full glow-orb text-primary-500/10" />
        <div className="absolute right-[-10%] top-[30%] h-[520px] w-[520px] rounded-full glow-orb text-primary-400/15" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-50" />
      </div>

      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Texto */}
          <div className="lg:col-span-6 xl:col-span-6">
            <h1 className="font-display text-text-900">
              <span
                className="hero-in inline-flex items-center gap-2 rounded-full border border-primary-400/20 bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-primary-300"
                style={{ "--d": "0ms" }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                {t("hero.kicker")}
              </span>
              <span className="sr-only">: </span>
              <span
                className="hero-in mt-6 block text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl lg:text-[4.1rem] xl:text-[4.5rem]"
                style={{ "--d": "80ms" }}
              >
                {t("hero.titleA")}{" "}
                <span className="accent-serif pr-1 text-[1.12em] leading-none">{t("hero.titleAccent")}</span>{" "}
                {t("hero.titleB")}
              </span>
            </h1>

            <p
              className="hero-in mt-6 max-w-xl text-base leading-relaxed text-text-500 text-pretty sm:text-lg"
              style={{ "--d": "160ms" }}
            >
              {t("hero.desc")}
            </p>

            <div
              className="hero-in mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ "--d": "240ms" }}
            >
              <Button href="#quote" size="lg" arrow className="h-13">
                {t("hero.ctaPrimary")}
              </Button>
              <Button href="#portfolio" variant="secondary" size="lg" className="h-13">
                {t("hero.ctaSecondary")}
              </Button>
            </div>

            {/* Prueba social inmediata (datos reales) */}
            <div
              className="hero-in mt-10 flex flex-col gap-5 border-t border-white/8 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8"
              style={{ "--d": "320ms" }}
            >
              <div className="flex items-center gap-3">
                <span className="flex -space-x-1.5" role="img" aria-label={t("hero.flagsAlt")}>
                  <FlagMX className="h-5 w-[30px] rounded-[4px] ring-2 ring-bg-50" />
                  <FlagUS className="h-5 w-[30px] rounded-[4px] ring-2 ring-bg-50" />
                </span>
                <p className="text-sm leading-tight text-text-500">
                  <strong className="font-semibold text-text-900">{t("hero.proof.sites")}</strong>{" "}
                  {t("hero.proof.sitesLabel")}
                </p>
              </div>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {proof.map(({ icon, value, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-text-500">
                    <ProofIcon icon={icon} />
                    <span>
                      <strong className="font-semibold text-text-900">{value}</strong> {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual: capturas reales de clientes */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div
              className="hero-in relative mx-auto w-full max-w-[560px] pb-[14%] pl-[9%] pr-[5%] lg:mr-[-14%] lg:w-auto lg:max-w-none lg:pl-[12%] xl:mr-[-18%]"
              style={{ "--d": "200ms" }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[10%] right-0 top-[8%] bottom-[10%] -z-10 rounded-full glow-orb text-primary-400/25"
              />

              {/* Navegador con el cliente principal (imagen LCP) */}
              <div className="relative lg:[transform:perspective(1800px)_rotateY(-9deg)_rotateX(3deg)] lg:origin-left">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[hsl(167,30%,9%)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/5 sm:rounded-2xl">
                  <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2 sm:px-4 sm:py-2.5">
                    <span className="flex gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
                      <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
                    </span>
                    <span className="mx-auto flex max-w-[65%] items-center gap-1.5 truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-[10px] text-text-500 sm:text-xs">
                      <Lock className="h-3 w-3 shrink-0 text-primary-300" aria-hidden="true" />
                      {mainHost}
                    </span>
                    <span className="w-[42px] sm:w-[52px]" aria-hidden="true" />
                  </div>
                  <img
                    src={shot(mainId, "desktop")}
                    srcSet={`${shot(mainId, "desktop-720")} 720w, ${shot(mainId, "desktop")} 1440w`}
                    sizes="(min-width: 1024px) 720px, 92vw"
                    alt={t("hero.browserAlt")}
                    width="1440"
                    height="900"
                    fetchPriority="high"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>

                {/* Chip flotante */}
                <div
                  className="hero-float absolute -right-2 -top-4 hidden lg:right-[16%] items-center gap-2 rounded-full border border-white/10 bg-[hsl(167,35%,10%)]/90 px-3 py-1.5 text-xs font-medium text-text-700 shadow-lg backdrop-blur sm:inline-flex"
                  style={{ "--fd": "0.6s" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
                  </span>
                  {t("hero.chipLive")}
                </div>
              </div>

              {/* Teléfono trasero (jaka) */}
              <Phone
                src={shot("jaka", "mobile")}
                alt={t("hero.phoneAltB")}
                className="bottom-[2%] right-[-1%] w-[21%] rotate-[7deg] opacity-95"
              />

              {/* Teléfono frontal */}
              <div className="hero-float absolute bottom-0 left-0 w-[27%]" style={{ "--fd": "0s" }}>
                <Phone
                  src={shot(frontId, "mobile")}
                  alt={t("hero.phoneAltA")}
                  className="relative! -rotate-[5deg]"
                />
              </div>

              {/* Chip inferior */}
              <div className="absolute bottom-[3%] left-[31%] hidden items-center gap-2 rounded-xl border border-white/10 bg-[hsl(167,35%,10%)]/90 px-3 py-2 text-xs text-text-700 shadow-lg backdrop-blur sm:inline-flex">
                <Smartphone className="h-4 w-4 text-primary-300" aria-hidden="true" />
                <span>{t("hero.chipMobile")}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
