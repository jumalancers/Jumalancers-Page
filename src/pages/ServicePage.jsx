import { Building2, MousePointerClick, LayoutDashboard, ShoppingBag, Gauge, Languages, ArrowRight, Tag } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { SERVICES, PAGE_UI } from "../data/pages/services.js";
import { PROJECTS, shot } from "../data/projects.js";
import { SERVICE_KEYS } from "../routes.js";
import { useLang } from "../i18n.jsx";
import { PageHero, ContactButtons, CheckList, PageFaq } from "./shared.jsx";

const ICONS = { Building2, MousePointerClick, LayoutDashboard, ShoppingBag, Gauge, Languages };
// Descripción corta de cada servicio = la misma tarjeta de la sección Servicios del inicio.
const HOME_CARD = { websites: "corporate", landing: "landing", systems: "systems", ecommerce: "ecommerce", seo: "seo", bilingual: "languages" };

export default function ServicePage({ id }) {
  const { lang, t, homeHref, pageHref } = useLang();
  const ui = PAGE_UI[lang];
  const svc = SERVICES[id];
  const c = svc[lang];
  const project = PROJECTS.find((p) => p.id === svc.project);
  const waText = ui.waMsg.replace("{s}", c.eyebrow.toLowerCase());

  return (
    <>
      <PageHero
        crumbs={[
          { label: ui.home, href: homeHref("") },
          { label: ui.services, href: homeHref("#services") },
          { label: c.eyebrow },
        ]}
        eyebrow={c.eyebrow}
        h1={c.h1}
        accent={c.accent}
        intro={c.intro}
      >
        <div className="mt-3 w-full">
          <ContactButtons waText={waText} />
        </div>
      </PageHero>

      <section className="pb-16 sm:pb-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {/* Contenido */}
          <div className="flex flex-col gap-12">
            {c.sections.map((s) => (
              <Reveal key={s.h2} as="article">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 text-balance sm:text-3xl">{s.h2}</h2>
                {s.p.map((t) => (
                  <p key={t} className="mt-4 text-base leading-relaxed text-text-500 text-pretty sm:text-[17px]">
                    {t}
                  </p>
                ))}
              </Reveal>
            ))}

            <Reveal as="article">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{c.forTitle}</h2>
              <div className="mt-6">
                <CheckList items={c.forList} />
              </div>
            </Reveal>

            {project && (
              <Reveal as="article">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{ui.realProject}</h2>
                <a
                  href={pageHref(`project-${project.id}`)}
                  className="group card mt-6 block overflow-hidden transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <div className="aspect-[16/9] overflow-hidden border-b border-white/[0.08] bg-white/[0.02]">
                    <img
                      src={shot(project.id, "desktop-720")}
                      alt={`${project.name} — ${ui.desktop}`}
                      width="720"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-5 sm:p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">
                      {project.industry[lang]} · {project.location}
                    </span>
                    <span className="font-display text-xl font-semibold tracking-tight text-text-900">{project.name}</span>
                    <span className="text-[15px] leading-relaxed text-text-500">{c.projectNote}</span>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-300">
                      {ui.viewCase}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </a>
              </Reveal>
            )}

            <Reveal>
              <PageFaq title={ui.faqTitle} items={c.faqs} />
            </Reveal>
          </div>

          {/* Lateral: qué incluye + precio */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="card p-6 sm:p-7">
              <h2 className="font-display text-xl font-semibold tracking-tight text-text-900">{c.includesTitle}</h2>
              <div className="mt-5">
                <CheckList items={c.includes} />
              </div>
            </Reveal>
            <Reveal delay={80} className="card p-6 sm:p-7">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-text-900">
                <Tag className="h-4 w-4 text-primary-300" aria-hidden="true" />
                {ui.price}
              </h2>
              <ul className="mt-4 flex flex-col divide-y divide-white/[0.08]">
                {c.price.split(" · ").map((line) => (
                  <li key={line} className="py-2.5 text-[15px] leading-relaxed text-text-500 first:pt-0">
                    {line}
                  </li>
                ))}
              </ul>
              <a
                href={homeHref("#plans")}
                className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-primary-300 transition hover:text-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                {ui.seePlans}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Otros servicios (enlazado interno) */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{ui.otherServices}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_KEYS.filter((k) => k !== id).map((k) => {
              const o = SERVICES[k];
              const Icon = ICONS[o.icon];
              return (
                <li key={k}>
                  <a
                    href={pageHref(k)}
                    className="group card flex h-full items-start gap-4 p-5 transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary-400/20 bg-primary-500/10 text-primary-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-semibold text-text-900">{o[lang].eyebrow}</span>
                      <span className="text-sm leading-snug text-text-500">{t(`services.items.${HOME_CARD[k]}.desc`)}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

    </>
  );
}
