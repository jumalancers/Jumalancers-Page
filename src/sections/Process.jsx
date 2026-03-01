import { PhoneCall, PencilRuler, Eye, Rocket, ArrowRight } from "lucide-react";
import { useLang } from "../i18n.jsx";

export default function HowWeWork() {
  const { t } = useLang();
  return (
    <section id="process" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wide text-primary-500">
            {t("process.badge")}
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-text-900">
            {t("process.titleA")}{" "}
            <span className="text-primary-500">{t("process.titleB")}</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-text-700 leading-relaxed">
            {t("process.desc")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {t("process.steps").map((step, index) => {
            const icons = [PhoneCall, PencilRuler, Eye, Rocket];
            const Icon = icons[index];
            const number = String(index + 1).padStart(2, "0");

            return (
              <div
                key={step.title}
                className="rounded-3xl bg-bg-100 p-6 sm:p-7 h-full"
              >
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-2xl bg-bg-50 grid place-items-center">
                    <Icon className="h-5 w-5 text-primary-500" />
                  </div>

                  <span className="text-2xl font-semibold text-primary-500/30">
                    {number}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-text-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm text-text-700 leading-relaxed">
                  {step.desc}
                </p>

                <div className="mt-4 space-y-2">
                  {step.bullets.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2 text-sm text-text-700"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-text-500">
            {t("process.bottomNote")}
          </p>

          <a
            href="#quote"
            className="
              inline-flex items-center gap-2
              text-sm font-semibold
              text-primary-500
              hover:gap-3
              transition-all
            "
          >
            {t("process.bottomCta")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
