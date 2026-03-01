import {
  ArrowRight,
  Layers3,
  Gauge,
  MessageSquareText,
  CheckCircle2,
} from "lucide-react";
import { useLang } from "../i18n.jsx";

export default function Solution() {
  const { t } = useLang();
  return (
    <section id="solution" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wide text-primary-500">
            {t("solution.badge")}
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-text-900">
            {t("solution.titleA")}{" "}
            <span className="text-primary-500">{t("solution.titleB")}</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-text-700 leading-relaxed">
            {t("solution.desc")}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {t("solution.steps").map((s, idx) => {
            const icons = [Layers3, Gauge, MessageSquareText];
            const Icon = icons[idx];
            const n = String(idx + 1).padStart(2, "0");

            return (
              <div key={s.title} className="lg:col-span-4">
                <div className="rounded-3xl bg-bg-100 p-6 sm:p-7 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-bg-50 grid place-items-center">
                      <Icon className="h-5 w-5 text-primary-500" />
                    </div>

                    <div className="text-2xl font-semibold text-primary-500/35">
                      {n}
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-text-900">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-sm text-text-700 leading-relaxed">
                    {s.desc}
                  </p>

                  <div className="mt-5 space-y-2">
                    {s.points.map((p) => (
                      <div
                        key={p}
                        className="flex items-start gap-2 text-sm text-text-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-500" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deliverables band */}
        <div className="mt-6 rounded-3xl bg-bg-100 p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-primary-500">
                {t("solution.deliverBadge")}
              </p>
              <p className="mt-2 text-sm sm:text-base text-text-700 leading-relaxed max-w-2xl">
                {t("solution.deliverDesc")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
                {t("solution.ctaPrimary")} <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#portfolio"
                className="
                  inline-flex items-center justify-center
                  h-11 px-6 rounded-full
                  bg-bg-50 text-text-900
                  font-semibold
                  hover:bg-bg-200/60
                  transition
                "
              >
                {t("solution.ctaSecondary")}
              </a>
            </div>
          </div>

          {/* small chips row */}
          <div className="mt-5 flex flex-wrap gap-2">
            {t("solution.chips").map((item) => (
              <span
                key={item}
                className="rounded-full bg-bg-50 px-3 py-1 text-xs font-semibold text-text-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
