import { useEffect, useRef, useState } from "react";
import { Clock3, Check } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader, Button } from "../components/ui/index.jsx";

/**
 * Proceso: columna izquierda sticky (título + tiempo total + CTA) y timeline
 * vertical a la derecha con una línea de progreso que se llena al hacer scroll.
 */
export default function Process() {
  const { t } = useLang();
  const steps = t("process.steps");
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      fill.style.transform = `scaleY(${reduce ? 1 : p})`;

      const items = list.querySelectorAll("[data-step]");
      let idx = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top < anchor) idx = i;
      });
      setActive(idx);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="process" className="isolate overflow-clip">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-24 left-[-12%] h-[420px] w-[420px] rounded-full glow-orb text-primary-500/10" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Columna izquierda (sticky en desktop) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              align="left"
              eyebrow={t("process.eyebrow")}
              title={t("process.title")}
              accent={t("process.accent")}
              desc={t("process.desc")}
            />

            <Reveal delay={120} className="card mt-8 flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary-400/20 bg-primary-500/10 text-primary-300">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-300">
                  {t("process.totalLabel")}
                </p>
                <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900">
                  {t("process.totalValue")}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-text-500 sm:text-xs">{t("process.totalNote")}</p>
              </div>
            </Reveal>

            <Reveal delay={180} className="mt-8 hidden flex-wrap items-center gap-4 lg:flex">
              <Button href="#quote" arrow>
                {t("process.cta")}
              </Button>
              <span className="text-xs text-text-300">{t("process.ctaNote")}</span>
            </Reveal>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-7">
          <ol ref={listRef} className="relative">
            {/* Pista + relleno de progreso */}
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-[19.5px] top-6 w-px bg-white/10 min-[400px]:left-[23.5px] sm:left-[27.5px]"
            >
              <span
                ref={fillRef}
                className="absolute inset-0 origin-top bg-gradient-to-b from-primary-300 via-primary-400 to-primary-500 shadow-[0_0_12px] shadow-primary-400/60 transition-transform duration-150 ease-out motion-reduce:transition-none"
                style={{ transform: "scaleY(0)" }}
              />
            </span>

            {steps.map((step, i) => {
              const done = i <= active;
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={step.title} data-step="" className="relative pb-8 pl-[3.25rem] last:pb-0 min-[400px]:pl-16 sm:pb-10 sm:pl-20">
                  {/* Nodo */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border bg-bg-50 transition-colors duration-500 min-[400px]:h-12 min-[400px]:w-12 sm:h-14 sm:w-14 ${
                      done ? "border-primary-400/60 text-primary-300 shadow-[0_0_24px] shadow-primary-400/25" : "border-white/10 text-text-300"
                    }`}
                  >
                    <span className="font-serif text-xl italic leading-none min-[400px]:text-2xl sm:text-[1.7rem]">{n}</span>
                  </span>

                  <Reveal delay={60}>
                    <article
                      className={`card group p-5 transition-colors duration-500 min-[400px]:p-6 sm:p-7 ${
                        i === active ? "border-primary-400/25" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-300">
                          {t("process.stepLabel")} {n}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-primary-300">
                          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                          {step.when}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-text-900 sm:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-text-500 sm:text-[0.95rem]">{step.desc}</p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {step.bullets.map((b) => (
                          <li
                            key={b}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5 text-[13px] leading-snug text-text-700 sm:text-xs"
                          >
                            <Check className="h-3.5 w-3.5 shrink-0 text-primary-400" strokeWidth={2.5} aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-col items-start gap-3 lg:hidden">
            <Button href="#quote" arrow>
              {t("process.cta")}
            </Button>
            <span className="text-[13px] text-text-300">{t("process.ctaNote")}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
