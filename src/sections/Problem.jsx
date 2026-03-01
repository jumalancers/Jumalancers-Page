import { TriangleAlert, Clock, PhoneMissed, ArrowRight } from "lucide-react";
import { useLang } from "../i18n.jsx";

export default function Problem() {
  const { t } = useLang();
  return (
    <section id="problem" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left intro */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wide text-primary-500">
              {t("problem.badge")}
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight text-text-900">
              {t("problem.titleA")}{" "}
              <span className="text-primary-500">{t("problem.titleB")}</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-text-700 leading-relaxed max-w-xl">
              {t("problem.desc")}
            </p>

            {/* Impact bar */}
            <div className="mt-6 rounded-2xl bg-bg-100 p-5">
              <p className="text-xs font-semibold text-text-900">
                {t("problem.impactTitle")}
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {t("problem.impact").map((item) => (
                  <div key={item.label} className="rounded-xl bg-bg-50 p-4">
                    <p className="text-xs text-text-500">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-text-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t("problem.cards").map((card, i) => {
                const icons = [TriangleAlert, Clock, PhoneMissed];
                const Icon = icons[i];

                return (
                  <div key={card.title} className="rounded-2xl bg-bg-100 p-6">
                    <div className="h-11 w-11 rounded-2xl bg-bg-50 grid place-items-center">
                      <Icon className="h-5 w-5 text-primary-500" />
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-text-900">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-sm text-text-700 leading-relaxed">
                      {card.desc}
                    </p>

                    <p className="mt-4 text-xs text-text-500">{card.fix}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom note */}
            <div className="mt-4 rounded-2xl bg-bg-50 p-6">
              <p className="text-sm text-text-700 leading-relaxed">
                {t("problem.bottom")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
