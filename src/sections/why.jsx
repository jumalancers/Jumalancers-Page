import { Gauge, Globe2, MessageCircle, SearchCheck, Receipt, KeyRound, Check, X } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader, Button } from "../components/ui/index.jsx";

const R = 34;
const C = 2 * Math.PI * R;

// Anillo tipo Lighthouse. Muestra el objetivo (90+), no una medición.
function Ring({ label, target = 0.9, delay = 0 }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div className="relative h-[4.5rem] w-[4.5rem] min-[400px]:h-20 min-[400px]:w-20 sm:h-24 sm:w-24">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={R} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/8" />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            className="text-primary-400 transition-[stroke-dashoffset] duration-[1400ms] ease-out motion-reduce:transition-none [stroke-dashoffset:var(--c)] [.is-visible_&]:[stroke-dashoffset:var(--off)]"
            style={{ "--c": C, "--off": C * (1 - target), transitionDelay: `${delay}ms` }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-xl font-semibold tracking-[-0.03em] text-text-900 sm:text-2xl">
          90+
        </span>
      </div>
      <span className="text-center text-xs font-medium leading-snug text-text-500 [overflow-wrap:anywhere]">{label}</span>
    </div>
  );
}



function IconChip({ icon }) {
  const Icon = icon;
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary-400/20 bg-primary-500/10 text-primary-300">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

const CARD = "card group relative h-full overflow-hidden p-5 transition duration-300 hover:border-white/15 min-[400px]:p-6 sm:p-7";

export default function WhyChooseUs() {
  const { t } = useLang();
  const speed = t("why.speed");
  const markets = t("why.markets");
  const compare = t("why.compare");
  const chat = t("why.chat");
  const items = t("why.items");
  const itemIcons = [SearchCheck, Receipt, KeyRound];

  return (
    <Section id="why" className="isolate overflow-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 right-[-12%] h-[440px] w-[440px] rounded-full glow-orb text-primary-500/10" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          align="left"
          eyebrow={t("why.eyebrow")}
          title={t("why.title")}
          accent={t("why.accent")}
          desc={t("why.desc")}
        />
        <Reveal delay={120} className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <Button href="#quote" arrow>
            {t("why.cta")}
          </Button>
          <span className="text-xs text-text-300">{t("why.ctaNote")}</span>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 *:min-w-0 md:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-5">
        {/* Velocidad / Lighthouse */}
        <Reveal className="md:col-span-2 lg:col-span-4">
          <article className={`${CARD} flex flex-col justify-center`}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full glow-orb text-primary-500/15" />
            <div className="relative grid gap-8 *:min-w-0 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <IconChip icon={Gauge} />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-text-900 sm:text-2xl">
                  {speed.title}
                </h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-text-500 sm:text-sm">{speed.desc}</p>
              </div>
              <div>
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-300 sm:text-left">
                  {speed.target}
                </p>
                <div className="grid grid-cols-3 justify-items-center gap-2 sm:flex sm:justify-center sm:gap-5">
                  {speed.metrics.map((m, i) => (
                    <Ring key={m} label={m} delay={i * 150} />
                  ))}
                </div>
                <p className="mx-auto mt-4 max-w-xs text-center text-xs leading-relaxed text-text-300 sm:mx-0 sm:text-left">
                  {speed.note}
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Multi-idioma */}
        <Reveal delay={80} className="md:col-span-2 lg:col-span-2">
          <article className={`${CARD} flex flex-col`}>
            <IconChip icon={Globe2} />
            <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-text-900">{markets.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-500 sm:text-sm">{markets.desc}</p>
            <ul className="mt-auto flex flex-wrap gap-2 pt-6">
              {markets.languages.map((lng) => (
                <li
                  key={lng}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-text-700"
                >
                  {lng}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        {/* Comparativa */}
        <Reveal className="md:col-span-2 lg:col-span-3">
          <article className={CARD}>
            <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-text-900">{compare.title}</h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/8">
              <table className="w-full table-fixed text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] max-sm:grid max-sm:grid-cols-2">
                    <td className="max-sm:hidden sm:w-[24%]" />
                    <th scope="col" className="px-3 py-2.5 font-medium text-text-300 sm:w-[38%]">
                      {compare.generic}
                    </th>
                    <th scope="col" className="bg-primary-500/10 px-3 py-2.5 font-semibold text-primary-300 sm:w-[38%]">
                      {compare.us}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map((r) => (
                    <tr key={r.label} className="border-b border-white/6 last:border-0 max-sm:grid max-sm:grid-cols-2">
                      <th scope="row" className="px-3 py-2.5 font-medium text-text-700 max-sm:col-span-2 max-sm:pb-0 max-sm:text-xs max-sm:uppercase max-sm:tracking-[0.12em] max-sm:text-text-500">
                        {r.label}
                      </th>
                      <td className="px-3 py-2.5 text-text-300 max-sm:pt-1.5">
                        <span className="flex items-start gap-1.5">
                          <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-300/70" aria-hidden="true" />
                          {r.generic}
                        </span>
                      </td>
                      <td className="bg-primary-500/[0.06] px-3 py-2.5 text-text-900 max-sm:pt-1.5">
                        <span className="flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-400" strokeWidth={2.5} aria-hidden="true" />
                          {r.us}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </Reveal>

        {/* WhatsApp */}
        <Reveal delay={80} className="md:col-span-2 lg:col-span-3">
          <article className={`${CARD} flex flex-col`}>
            <div className="flex items-start justify-between gap-3">
              <IconChip icon={MessageCircle} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/25 bg-primary-500/10 px-2.5 py-1 text-xs font-medium text-primary-300">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400 motion-safe:animate-pulse" />
                {chat.badge}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-text-900">{chat.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-500 sm:text-sm">{chat.desc}</p>
            <div aria-hidden="true" className="mt-auto space-y-2.5 pt-6">
              <p className="mr-10 w-fit rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.05] px-3.5 py-2 text-sm text-text-700">
                {chat.msgClient}
              </p>
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary-400 px-3.5 py-2 text-sm font-medium text-[hsl(167,60%,6%)] transition-transform duration-300 group-hover:-translate-y-0.5">
                {chat.msgUs}
              </p>
            </div>
          </article>
        </Reveal>

        {/* Pequeñas */}
        {items.map((it, i) => {
          const Icon = itemIcons[i];
          return (
            <Reveal key={it.title} delay={i * 80} className={`lg:col-span-2 ${i === 2 ? "md:col-span-2" : ""}`}>
              <article className={CARD}>
                <IconChip icon={Icon} />
                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.02em] text-text-900">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-500 sm:text-sm">{it.desc}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
