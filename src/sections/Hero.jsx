import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useLang } from "../i18n.jsx";

export default function Hero() {
  const { t } = useLang();
  const img =
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80";

  return (
    <section id="hero" className="pt-8 sm:pt-14 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-wide text-primary-500">
              {t("hero.badge")}
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-text-900">
              {t("hero.titleA")}{" "}
              <span className="text-primary-500">{t("hero.titleB")}</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-text-700 leading-relaxed max-w-xl">
              {t("hero.desc")}
            </p>

            {/* bullets */}
            <div className="mt-6 space-y-3">
              {t("hero.bullets").map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-text-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#quote"
                className="
                  inline-flex items-center justify-center gap-2
                  h-11 px-6 rounded-full
                  bg-primary-500 text-bg-50
                  font-semibold
                  hover:opacity-90 active:scale-[0.99]
                  transition
                "
              >
                {t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#portfolio"
                className="
                  inline-flex items-center justify-center
                  h-11 px-6 rounded-full
                  bg-bg-100 text-text-900
                  font-semibold
                  hover:bg-bg-200/70
                  transition
                "
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>

            <p className="mt-5 text-xs text-text-500">
              {t("hero.credibility")}
            </p>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-bg-100 p-4 sm:p-5">
              {/* Image */}
              <div className="relative overflow-hidden rounded-2xl h-[320px] sm:h-[380px]">
                <img
                  src={img}
                  alt={t("hero.imgAlt")}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />

                {/* soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-900/40 via-transparent to-transparent" />

                {/* Top-left badge */}
                <div className="absolute left-4 top-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-bg-50/80 backdrop-blur px-3 py-1.5">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    <span className="text-xs font-semibold text-text-900">
                      {t("hero.badgeRight")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tech / credibility chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {t("hero.tech").map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-bg-50 px-3 py-1 text-xs font-semibold text-text-700"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Mini “what’s included” */}
              <div className="mt-4 rounded-2xl bg-bg-50 p-4 sm:p-5">
                <p className="text-xs font-semibold text-text-900">
                  {t("hero.includedTitle")}
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {t("hero.included").map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-text-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-text-500">
              {t("hero.bottomNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
