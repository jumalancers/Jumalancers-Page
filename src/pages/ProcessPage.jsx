import { Clock, CreditCard } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { PROCESS_PAGE } from "../data/pages/process.js";
import { PAGE_UI } from "../data/pages/services.js";
import { useLang } from "../i18n.jsx";
import { PageHero, ContactButtons, CheckList, PageFaq } from "./shared.jsx";

export default function ProcessPage() {
  const { lang, homeHref } = useLang();
  const ui = PAGE_UI[lang];
  const c = PROCESS_PAGE[lang];
  const waText = ui.waMsg.replace("{s}", c.eyebrow.toLowerCase());

  return (
    <>
      <PageHero
        crumbs={[{ label: ui.home, href: homeHref("") }, { label: c.eyebrow }]}
        eyebrow={c.eyebrow}
        h1={c.h1}
        accent={c.accent}
        intro={c.intro}
      >
        <div className="mt-3 flex w-full flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-primary-400/20 bg-primary-500/10 px-4 py-3">
            <Clock className="h-5 w-5 text-primary-300" aria-hidden="true" />
            <span className="text-sm text-text-700">
              {c.totalLabel}: <strong className="font-semibold text-text-900">{c.totalValue}</strong>
              <span className="block text-xs text-text-500">{c.totalNote}</span>
            </span>
          </div>
          <ContactButtons waText={waText} />
        </div>
      </PageHero>

      {/* Pasos */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <ol className="relative flex flex-col gap-6 border-l border-white/[0.08] pl-6 sm:gap-8 sm:pl-10">
            {c.steps.map((s, i) => (
              <li key={s.title} id={`paso-${i + 1}`} className="relative scroll-mt-28">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.35rem] top-6 grid h-8 w-8 place-items-center rounded-full border border-primary-400/40 bg-bg-50 font-display text-sm font-semibold text-primary-300 sm:-left-[3.6rem] sm:h-9 sm:w-9"
                >
                  {i + 1}
                </span>
                <Reveal as="article" className="card p-6 sm:p-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{s.when}</span>
                  <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">{s.title}</h2>
                  {s.p.map((t) => (
                    <p key={t} className="mt-4 max-w-3xl text-base leading-relaxed text-text-500 text-pretty sm:text-[17px]">
                      {t}
                    </p>
                  ))}
                  <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-700">{c.needLabel}</h3>
                      <div className="mt-4">
                        <CheckList items={s.need} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-700">{c.getLabel}</h3>
                      <div className="mt-4">
                        <CheckList items={s.get} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Tiempos y pago */}
      <section className="pb-16 sm:pb-24">
        <div className="container-x grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal className="card overflow-hidden p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900">{c.timesTitle}</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-[15px]">
                <thead>
                  <tr className="border-b border-white/[0.08] text-xs uppercase tracking-[0.12em] text-text-500">
                    {c.timesHead.map((h) => (
                      <th key={h} scope="col" className="py-3 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.times.map((row) => (
                    <tr key={row[0]} className="border-b border-white/[0.06] last:border-0">
                      {row.map((cell, j) =>
                        j === 0 ? (
                          <th key={j} scope="row" className="py-3 pr-4 font-semibold text-text-900">
                            {cell}
                          </th>
                        ) : (
                          <td key={j} className="py-3 pr-4 text-text-500">
                            {cell}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-500">{c.timesNote}</p>
          </Reveal>
          <Reveal delay={80} className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.03em] text-text-900">
              <CreditCard className="h-5 w-5 text-primary-300" aria-hidden="true" />
              {c.payTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-500">{c.pay}</p>
          </Reveal>
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
