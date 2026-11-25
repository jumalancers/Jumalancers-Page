import { ArrowUpRight, ArrowRight, Quote } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { Button } from "../components/ui/index.jsx";
import { SERVICES, PAGE_UI, PROJECT_SERVICE } from "../data/pages/services.js";
import { PROJECTS, shot } from "../data/projects.js";
import { PROJECT_SLUGS } from "../routes.js";
import { useLang } from "../i18n.jsx";
import { PageHero, CheckList } from "./shared.jsx";

export default function ProjectPage({ id }) {
  const { lang, homeHref, pageHref } = useLang();
  const ui = PAGE_UI[lang];
  const p = PROJECTS.find((x) => x.id === id);
  const svcKey = PROJECT_SERVICE[id];
  const svc = svcKey && SERVICES[svcKey][lang];
  const others = PROJECTS.filter((x) => x.id !== id && PROJECT_SLUGS[x.id]);

  const facts = [
    [ui.industry, p.industry[lang]],
    [ui.location, p.location],
    [ui.year, p.year],
    [ui.type, p.kind === "system" ? ui.kindSystem : ui.kindSite],
    [ui.stack, p.stack.join(", ")],
  ];

  return (
    <>
      <PageHero
        crumbs={[
          { label: ui.home, href: homeHref("") },
          { label: ui.projects, href: homeHref("#portfolio") },
          { label: p.name },
        ]}
        eyebrow={`${ui.caseEyebrow} · ${p.industry[lang]}`}
        h1={p.name}
        accent=""
        intro={p.summary[lang]}
      >
        <div className="mt-3 flex flex-col gap-3 min-[460px]:flex-row">
          <Button href={p.url} target="_blank" rel="noopener" size="lg">
            {ui.visitSite}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{ui.opensNewTab}</span>
          </Button>
          <Button href={homeHref("#quote")} variant="secondary" size="lg" arrow>
            {ui.quote}
          </Button>
        </div>
      </PageHero>

      {/* Capturas */}
      <section className="pb-14 sm:pb-20">
        <div className="container-x grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,9fr)_minmax(0,3fr)]">
          <Reveal className="card overflow-hidden">
            <img
              src={shot(p.id, "desktop")}
              alt={`${p.name} — ${ui.desktop}`}
              width="1440"
              height="900"
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
            />
          </Reveal>
          <Reveal delay={100} className="card mx-auto w-full max-w-[220px] overflow-hidden rounded-[2rem] p-2 lg:max-w-[260px]">
            <img
              src={shot(p.id, "mobile")}
              alt={`${p.name} — ${ui.mobile}`}
              width="390"
              height="844"
              decoding="async"
              className="block h-auto w-full rounded-[1.6rem]"
            />
          </Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="flex flex-col gap-12">
            <Reveal as="article">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{ui.features}</h2>
              <div className="mt-6">
                <CheckList items={p.features[lang]} />
              </div>
            </Reveal>

            {p.testimonial && (
              <Reveal as="figure" className="card relative p-6 sm:p-8">
                <Quote className="h-7 w-7 text-primary-300/70" aria-hidden="true" />
                <h2 className="sr-only">{ui.testimonial}</h2>
                <blockquote className="mt-4 font-display text-lg leading-relaxed text-text-900 text-pretty sm:text-xl">
                  “{p.testimonial[lang]}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-primary-300">— {p.testimonial.author}</figcaption>
              </Reveal>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="card p-6 sm:p-7">
              <h2 className="font-display text-xl font-semibold tracking-tight text-text-900">{ui.client}</h2>
              <dl className="mt-5 flex flex-col divide-y divide-white/[0.08]">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 py-3 text-[15px]">
                    <dt className="text-text-500">{k}</dt>
                    <dd className="text-right font-medium text-text-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            {svc && (
              <Reveal delay={80}>
                <a
                  href={pageHref(svcKey)}
                  className="group card flex flex-col gap-2 p-6 transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:p-7"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{ui.relatedService}</span>
                  <span className="font-display text-lg font-semibold tracking-tight text-text-900">{svc.eyebrow}</span>
                  <span className="text-[15px] leading-relaxed text-text-500">{svc.metaDesc}</span>
                  <ArrowRight className="mt-1 h-4 w-4 text-primary-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </Reveal>
            )}
          </aside>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{ui.moreProjects}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.id}>
                <a
                  href={pageHref(`project-${o.id}`)}
                  className="group card block overflow-hidden transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <div className="aspect-[16/10] overflow-hidden border-b border-white/[0.08]">
                    <img
                      src={shot(o.id, "desktop-720")}
                      alt={`${o.name} — ${ui.desktop}`}
                      width="720"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  </div>
                  <div className="p-4">
                    <span className="block font-semibold text-text-900">{o.name}</span>
                    <span className="block text-sm text-text-500">{o.industry[lang]}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
