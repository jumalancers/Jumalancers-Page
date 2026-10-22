import { Plus, MessageCircle, Mail } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader, Button } from "../components/ui/index.jsx";
import { SITE, waLink } from "../data/site.js";

/*
 * Acordeón con <details>/<summary>: funciona sin JS y es accesible de forma nativa.
 * name="faq" → acordeón exclusivo en navegadores modernos (uno abierto a la vez).
 * Animación de altura con ::details-content + interpolate-size (mejora progresiva).
 */
const DETAILS_CLS = [
  "group card overflow-hidden transition-colors duration-300",
  "open:border-primary-400/25 open:bg-white/[0.04] hover:border-white/15",
  "[interpolate-size:allow-keywords]",
  "[&::details-content]:h-0 [&::details-content]:overflow-hidden",
  "[&::details-content]:[transition:height_.35s_ease,content-visibility_.35s_allow-discrete]",
  "open:[&::details-content]:h-auto",
  "motion-reduce:[&::details-content]:transition-none",
].join(" ");

function FaqItem({ q, a, defaultOpen }) {
  return (
    <details name="faq" className={DETAILS_CLS} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400 sm:p-6 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-base font-medium leading-snug tracking-tight text-text-900 sm:text-lg">
          {q}
        </h3>
        <span
          aria-hidden="true"
          className="-my-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-text-500 transition duration-300 group-open:rotate-45 group-open:border-primary-400/40 group-open:bg-primary-500/15 group-open:text-primary-300 motion-reduce:transition-none"
        >
          <Plus className="h-4 w-4" />
        </span>
      </summary>
      <div className="px-5 pb-6 pr-12 sm:px-6 sm:pr-16">
        <p className="text-[15px] leading-relaxed text-text-500 text-pretty sm:text-base">{a}</p>
      </div>
    </details>
  );
}

export default function Faq() {
  const { t } = useLang();
  const raw = t("faq.items");
  const items = Array.isArray(raw) ? raw : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            align="left"
            eyebrow={t("faq.badge")}
            title={t("faq.title")}
            accent={t("faq.accent")}
            desc={t("faq.desc")}
          />

          <Reveal delay={120} className="mt-8">
            <div className="card relative overflow-hidden p-5 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full glow-orb text-primary-500/15"
              />
              <p className="font-display text-lg font-semibold tracking-tight text-text-900">
                {t("faq.ctaTitle")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-500">{t("faq.ctaDesc")}</p>
              <Button
                href={waLink(t("faq.ctaMsg"))}
                target="_blank"
                rel="noopener"
                arrow
                className="mt-5 w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                {t("faq.cta")}
              </Button>
              <p className="mt-4 flex flex-wrap items-center gap-1.5 text-sm text-text-500">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {t("faq.ctaAlt")}{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-10 items-center font-medium text-text-700 underline decoration-white/20 [overflow-wrap:anywhere] sm:min-h-0 underline-offset-4 transition hover:text-primary-300 hover:decoration-primary-400/50"
                >
                  {SITE.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="flex flex-col gap-3">
            {items.map((it, i) => (
              <FaqItem key={it.q} q={it.q} a={it.a} defaultOpen={i === 0} />
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
