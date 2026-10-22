import { ArrowUpRight, Globe2, Languages, MonitorCheck, ArrowRight, Star } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader } from "../components/ui/index.jsx";
import { PROJECTS, shot } from "../data/projects.js";
import { SITE } from "../data/site.js";

const fill = (str, vars) =>
  String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

function QuoteCard({ project, quote, lang, t, delay }) {
  const host = project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return (
    <Reveal delay={delay} className="h-full">
      <figure className="card group relative flex h-full flex-col overflow-hidden p-5 transition duration-300 hover:border-primary-400/25 min-[400px]:p-6 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full glow-orb text-primary-500/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />

        <span
          aria-hidden="true"
          className="block h-10 select-none font-serif text-[5.5rem] leading-[0.9] text-primary-400/70 sm:h-12 sm:text-[7rem]"
        >
          &ldquo;
        </span>

        <blockquote cite={project.url} className="relative mt-3 flex-1">
          <p className="text-[17px] leading-relaxed text-text-900 text-pretty min-[400px]:text-lg sm:text-xl sm:leading-relaxed">
            {quote}
          </p>
        </blockquote>

        <figcaption className="relative mt-8 flex items-center gap-3 border-t border-white/8 pt-6 min-[400px]:gap-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            aria-hidden="true"
            className="block w-20 shrink-0 overflow-hidden rounded-lg min-[400px]:w-28 border border-white/10 bg-bg-50 shadow-lg shadow-black/30 sm:w-40"
          >
            <img
              src={shot(project.id, "desktop-720")}
              alt={fill(t("testimonials.shotAlt"), { name: project.name })}
              width="720"
              height="450"
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] h-auto w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
            />
          </a>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold tracking-tight text-text-900 sm:text-lg">
              {project.name}
            </h3>
            <p className="mt-0.5 text-sm text-text-500">
              {project.industry[lang]} · {project.location}
            </p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener"
              aria-label={fill(t("testimonials.visitAria"), { name: project.name })}
              className="mt-1 inline-flex min-h-10 max-w-full items-center gap-1 rounded text-sm font-medium text-primary-300 sm:mt-2 sm:min-h-0 transition hover:text-primary-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <span className="truncate">{host}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function Testimonials() {
  const { t, lang } = useLang();
  const items = t("testimonials.items");
  const list = (Array.isArray(items) ? items : [])
    .map((it) => ({ ...it, project: PROJECTS.find((p) => p.id === it.id) }))
    .filter((it) => it.project);

  const proof = [
    {
      icon: MonitorCheck,
      value: t("testimonials.proof.sites.value"),
      label: t("testimonials.proof.sites.label"),
      sub: t("testimonials.proof.sites.sub"),
    },
    {
      icon: Globe2,
      value: t("testimonials.proof.markets.value"),
      label: t("testimonials.proof.markets.label"),
      sub: t("testimonials.proof.markets.sub"),
    },
    {
      icon: Languages,
      value: t("testimonials.proof.bilingual.value"),
      label: t("testimonials.proof.bilingual.label"),
      sub: t("testimonials.proof.bilingual.sub"),
    },
  ];

  return (
    <Section id="testimonials" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[420px] w-[720px] max-w-[100vw] -translate-x-1/2 rounded-full glow-orb text-primary-500/[0.07]"
      />

      <SectionHeader
        eyebrow={t("testimonials.badge")}
        title={t("testimonials.title")}
        accent={t("testimonials.accent")}
        desc={t("testimonials.desc")}
      />

      <div className="mt-12 grid grid-cols-1 gap-5 *:min-w-0 sm:mt-16 lg:grid-cols-2 lg:gap-6">
        {list.map((it, i) => (
          <QuoteCard key={it.id} project={it.project} quote={it.quote} lang={lang} t={t} delay={i * 120} />
        ))}
      </div>

      <Reveal delay={200} className="mt-5 lg:mt-6">
        <div className="card overflow-hidden">
          <h3 className="sr-only">{t("testimonials.proofTitle")}</h3>
          <ul className="grid divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {proof.map(({ icon, value, label, sub }) => {
              const Icon = icon;
              return (
                <li key={label} className="flex items-start gap-4 p-5 sm:p-7">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary-400/20 bg-primary-500/10">
                    <Icon className="h-5 w-5 text-primary-300" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-700">{label}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-text-500 sm:text-xs">{sub}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
          <a
            href={SITE.googleReview}
            target="_blank"
            rel="noopener"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-center text-sm font-medium text-text-700 transition hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <Star className="h-4 w-4 text-[#febc2e]" aria-hidden="true" />
            {t("testimonials.reviewCta")}
          </a>
          <a
            href="#portfolio"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-text-700 transition hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            {t("testimonials.portfolioCta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
