import {
  Building2,
  Check,
  Gauge,
  Languages,
  LayoutDashboard,
  MessageCircle,
  MousePointerClick,
  ServerCog,
  ShoppingBag,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { Button, Section, SectionHeader } from "../components/ui/index.jsx";
import { PROJECTS, shot } from "../data/projects.js";
import { useLang } from "../i18n.jsx";

const WALDO = PROJECTS.find((p) => p.id === "waldo");

/* ---------- piezas comunes ---------- */

function Card({ className = "", delay = 0, children }) {
  return (
    <Reveal delay={delay} className={className}>
      <article className="card group relative flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-0.5 hover:border-primary-400/30 hover:shadow-[0_20px_60px_-30px] hover:shadow-primary-400/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
        {/* glow menta en hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full glow-orb text-primary-400/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative flex h-full flex-col">{children}</div>
      </article>
    </Reveal>
  );
}

function CardHead({ icon, tag, title, desc }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-primary-500/10 text-primary-300 transition group-hover:border-primary-400/40 group-hover:bg-primary-500/15">
          {icon}
        </span>
        {tag && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-text-500">
            {tag}
          </span>
        )}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-text-900 text-balance sm:text-[1.35rem]">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-text-500 text-pretty">{desc}</p>
    </>
  );
}

function Bullets({ items, label }) {
  return (
    <ul aria-label={label} className="mt-5 space-y-2">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-sm leading-snug text-text-700">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

// Marco de navegador con captura real
function BrowserShot({ id, alt, caption, className = "" }) {
  return (
    <figure className={`flex flex-col overflow-hidden rounded-xl border border-white/10 bg-bg-50/60 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-[10px] text-text-300">{caption}</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={shot(id, "desktop-720")}
          alt={alt}
          width="720"
          height="450"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
    </figure>
  );
}

/* ---------- mini visuales ---------- */

function LandingMock({ s }) {
  return (
    <div aria-hidden="true" className="mt-6 rounded-xl border border-white/10 bg-bg-50/60 p-4">
      <div className="text-xs font-semibold text-text-900">{s.mockTitle}</div>
      <div className="mt-3 space-y-2">
        <div className="h-7 rounded-md border border-white/8 bg-white/[0.03]" />
        <div className="h-7 rounded-md border border-white/8 bg-white/[0.03]" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-md bg-primary-400/90 px-2 text-[11px] font-semibold text-[hsl(167,60%,6%)]">
          {s.mockSend}
        </div>
        <div className="flex h-8 min-w-0 flex-[1.6] items-center justify-center gap-1.5 rounded-md px-2 border border-[#25D366]/40 bg-[#25D366]/10 text-[11px] font-medium text-[#5ee08f]">
          <MessageCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{s.mockWa}</span>
        </div>
      </div>
    </div>
  );
}

const BARS = [38, 52, 44, 68, 60, 82, 74];

function DashboardMock({ s }) {
  return (
    <div aria-hidden="true" className="mt-6 flex overflow-hidden rounded-xl border border-white/10 bg-bg-50/60">
      <div className="hidden w-12 shrink-0 flex-col items-center gap-2.5 border-r border-white/8 py-3 sm:flex">
        <span className="h-5 w-5 rounded-md bg-primary-400/80" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-4 w-4 rounded ${i === 0 ? "bg-white/25" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="grid grid-cols-3 gap-2">
          {s.mockKpis.map((k, i) => (
            <div key={k} className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-2">
              <div className="truncate text-[10px] text-text-300">{k}</div>
              <div className="mt-0.5 text-sm font-semibold text-text-900">{["128", "46", "312"][i]}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
          <div className="text-[10px] text-text-300">{s.mockChart}</div>
          <div className="mt-2 flex h-16 items-end gap-1.5">
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-sm transition-all duration-500 ${
                  i === BARS.length - 2 ? "bg-primary-400" : "bg-primary-400/30 group-hover:bg-primary-400/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Ring({ value, label }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-11 w-11">
        <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-white/10" />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
            className="stroke-primary-400"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-text-900">{value}</span>
      </div>
      <span className="max-w-[4.5rem] truncate text-center text-[10px] text-text-300">{label}</span>
    </div>
  );
}

/* ---------- sección ---------- */

export default function Services() {
  const { t } = useLang();
  const it = t("services.items");
  const inc = t("services.includes");

  return (
    <Section id="services" className="isolate">
      {/* glow de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-[min(60rem,100%)] -translate-x-1/2 rounded-full glow-orb text-primary-500/10"
      />

      <SectionHeader
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        accent={t("services.accent")}
        desc={t("services.desc")}
      />

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-5">
        {/* 1. Sitios corporativos */}
        <Card className="md:col-span-2 lg:col-span-4">
          <div className="grid h-full gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <CardHead icon={<Building2 className="h-5 w-5" aria-hidden="true" />} tag={it.corporate.tag} title={it.corporate.title} desc={it.corporate.desc} />
              <Bullets items={it.corporate.bullets} label={inc} />
            </div>
            <div className="relative lg:self-center">
              <BrowserShot
                id="jmyan"
                alt={it.corporate.visualAlt}
                caption={it.corporate.visualCaption}
                className="shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
              />
              <span className="absolute -bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-bg-50/90 px-2.5 py-1 text-[11px] font-semibold text-text-700 backdrop-blur">
                <span className="text-primary-300">ES</span>
                <span className="text-text-300">·</span>
                <span>EN</span>
                <span className="text-text-300">·</span>
                <span>+</span>
              </span>
            </div>
          </div>
        </Card>

        {/* 2. Landing pages */}
        <Card className="lg:col-span-2" delay={80}>
          <CardHead icon={<MousePointerClick className="h-5 w-5" aria-hidden="true" />} title={it.landing.title} desc={it.landing.desc} />
          <Bullets items={it.landing.bullets} label={inc} />
          <div className="mt-auto">
            <LandingMock s={it.landing} />
          </div>
        </Card>

        {/* 3. Sistemas a medida */}
        <Card className="lg:col-span-3">
          <CardHead icon={<LayoutDashboard className="h-5 w-5" aria-hidden="true" />} tag={it.systems.tag} title={it.systems.title} desc={it.systems.desc} />
          <Bullets items={it.systems.bullets} label={inc} />
          <div className="mt-auto">
            <DashboardMock s={it.systems} />
            {WALDO && (
              <p className="mt-4 text-sm leading-relaxed text-text-500">
                <span className="font-medium text-text-700">{it.systems.example}</span>{" "}
                <a
                  href={WALDO.url}
                  target="_blank"
                  rel="noopener"
                  className="text-primary-300 underline decoration-primary-400/30 underline-offset-4 transition hover:decoration-primary-300"
                >
                  {it.systems.exampleText}
                </a>
              </p>
            )}
          </div>
        </Card>

        {/* 4. E-commerce */}
        <Card className="lg:col-span-3" delay={80}>
          <CardHead icon={<ShoppingBag className="h-5 w-5" aria-hidden="true" />} title={it.ecommerce.title} desc={it.ecommerce.desc} />
          <Bullets items={it.ecommerce.bullets} label={inc} />
          <div className="mt-auto pt-6">
            <BrowserShot id="waldo" alt={it.ecommerce.visualAlt} caption={it.ecommerce.visualCaption} />
          </div>
        </Card>

        {/* 5. SEO técnico */}
        <Card className="lg:col-span-2">
          <CardHead icon={<Gauge className="h-5 w-5" aria-hidden="true" />} title={it.seo.title} desc={it.seo.desc} />
          <Bullets items={it.seo.bullets} label={inc} />
          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-white/10 bg-bg-50/60 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/30 bg-primary-500/10 px-2.5 py-1 text-[11px] font-semibold text-primary-300">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                {it.seo.chip}
              </span>
              <div className="mt-4 grid grid-cols-4 gap-1">
                {it.seo.metrics.map((m, i) => (
                  <Ring key={m} label={m} value={[95, 100, 100, 100][i]} />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 6. Mantenimiento */}
        <Card className="lg:col-span-2" delay={80}>
          <CardHead icon={<ServerCog className="h-5 w-5" aria-hidden="true" />} title={it.care.title} desc={it.care.desc} />
          <Bullets items={it.care.bullets} label={inc} />
          <div className="mt-auto pt-6">
            <ul aria-hidden="true" className="flex flex-wrap gap-2">
              {it.care.status.map((st) => (
                <li
                  key={st}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-text-700"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
                  </span>
                  {st}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* 7. Sitios multilingües */}
        <Card className="lg:col-span-2" delay={160}>
          <div className="flex items-center justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-primary-500/10 text-primary-300 transition group-hover:border-primary-400/40 group-hover:bg-primary-500/15">
              <Languages className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-text-500">
              {it.languages.tag}
            </span>
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-text-900 text-balance sm:text-[1.35rem]">
            {it.languages.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-text-500 text-pretty">{it.languages.desc}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {it.languages.list.map((lng) => (
              <li
                key={lng}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-text-700 transition group-hover:border-primary-400/25"
              >
                {lng}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-6 text-sm leading-snug text-text-500">{it.languages.note}</p>
        </Card>
      </div>

      {/* CTA */}
      <Reveal className="mt-10 lg:mt-12">
        <div className="card relative flex flex-col items-start gap-5 overflow-hidden p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full glow-orb text-primary-400/15"
          />
          <div className="relative">
            <p className="font-display text-xl font-semibold tracking-[-0.02em] text-text-900 sm:text-2xl">
              {t("services.ctaTitle")}
            </p>
            <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-text-500">{t("services.ctaDesc")}</p>
          </div>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <Button href="#quote" arrow>
              {t("services.ctaPrimary")}
            </Button>
            <Button href="#plans" variant="secondary">
              {t("services.ctaSecondary")}
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
