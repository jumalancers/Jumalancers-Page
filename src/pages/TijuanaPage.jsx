import { ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { TIJUANA_PAGE, PRICES } from "../data/pages/tijuana.js";
import { PAGE_UI } from "../data/pages/services.js";
import { PROJECTS, shot } from "../data/projects.js";
import { PROJECT_SLUGS } from "../routes.js";
import { useLang } from "../i18n.jsx";
import { PageHero, ContactButtons, CheckList, PageFaq } from "./shared.jsx";

export default function TijuanaPage() {
  const { lang, homeHref, pageHref } = useLang();
  const ui = PAGE_UI[lang];
  const c = TIJUANA_PAGE[lang];
  const waText = ui.waMsg.replace("{s}", c.eyebrow.toLowerCase());
  const projects = PROJECTS.filter((p) => PROJECT_SLUGS[p.id]);

  return (
    <>
      <PageHero
        crumbs={[{ label: ui.home, href: homeHref("") }, { label: c.eyebrow }]}
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
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="card p-6 sm:p-7">
              <h2 className="font-display text-xl font-semibold tracking-tight text-text-900">{c.includesTitle}</h2>
              <div className="mt-5">
                <CheckList items={c.includes} />
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Precios en pesos y dólares */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <Reveal className="card overflow-hidden p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{c.pricesTitle}</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[15px]">
                <thead>
                  <tr className="border-b border-white/[0.08] text-xs uppercase tracking-[0.12em] text-text-500">
                    {c.head.map((h) => (
                      <th key={h} scope="col" className="py-3 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRICES.map((r) => (
                    <tr key={r.plan} className="border-b border-white/[0.06] last:border-0">
                      <th scope="row" className="py-3.5 pr-4 font-semibold text-text-900">
                        {r.plan}
                      </th>
                      <td className="py-3.5 pr-4 text-text-500">{r.pages[lang]}</td>
                      <td className="py-3.5 pr-4 font-semibold text-primary-300">{lang === "en" && r.mxnEn ? r.mxnEn : r.mxn} MXN</td>
                      <td className="py-3.5 pr-4 text-text-700">{lang === "en" && r.usdEn ? r.usdEn : r.usd} USD</td>
                      <td className="py-3.5 pr-4 text-text-500">{r.days[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-text-500">{c.pricesNote}</p>
            <a
              href={homeHref("#plans")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-300 transition hover:text-primary-200"
            >
              {ui.seePlans}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Proyectos en Tijuana */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{c.projectsTitle}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {projects.map((o) => (
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
                    <span className="block text-sm text-text-500">
                      {o.industry[lang]} · {o.location}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <div className="max-w-4xl">
            <PageFaq title={ui.faqTitle} items={c.faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
