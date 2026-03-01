import { useLang } from "../i18n.jsx"; // ajusta la ruta real

export default function Plans() {
  const { t, lang } = useLang();

  const goToContact = () => {
    const section = document.getElementById("contact");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const renderItems = (items) => (
    <ul className="mt-6 space-y-3 text-sm text-text-700">
      {items.map((it, idx) => (
        <li key={idx}>• {it}</li>
      ))}
    </ul>
  );

  return (
    <section id="plans" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-primary-500">
            {t("plans.badge")}
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
            {t("plans.title")}
          </h2>

          <p className="mt-3 text-sm text-text-700 leading-relaxed">
            {t("plans.desc")}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="rounded-3xl border border-primary-900/10 bg-bg-50 p-7 flex flex-col">
            <div>
              <p className="text-xs font-semibold text-text-500">
                {t("plans.labels.plan")} 1
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-text-900">
                {t("plans.cards.starter.name")}
              </h3>

              <p className="mt-2 text-sm text-text-700">
                {t("plans.cards.starter.desc")}
              </p>

              <div className="mt-6">
                <p className="text-sm text-text-500">{t("plans.labels.investment")}</p>

                <p className="text-3xl font-bold text-text-900">
                  $5,499{" "}
                  <span className="text-base font-medium text-text-500">
                    {t("plans.labels.mxn")}
                  </span>
                </p>

                <p className="mt-2 text-xs text-text-500">
                  {t("plans.cards.starter.renewal")}
                </p>
              </div>

              {renderItems(t("plans.cards.starter.items"))}
            </div>

            <button
              className="mt-8 h-11 rounded-full bg-text-900 text-bg-50 font-semibold hover:opacity-90 transition"
              onClick={goToContact}
            >
              {t("plans.ctas.starter")}
            </button>
          </div>

          {/* Business (Recommended) */}
          <div className="relative rounded-3xl border border-primary-500 bg-bg-50 p-7 flex flex-col shadow-sm">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary-500 text-bg-50 text-xs font-semibold">
              {t("plans.labels.recommended")}
            </div>

            <div>
              <p className="text-xs font-semibold text-text-500">
                {t("plans.labels.plan")} 2
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-text-900">
                {t("plans.cards.business.name")}
              </h3>

              <p className="mt-2 text-sm text-text-700">
                {t("plans.cards.business.desc")}
              </p>

              <div className="mt-6">
                <p className="text-sm text-text-500">{t("plans.labels.investment")}</p>

                <p className="text-3xl font-bold text-text-900">
                  $10,899{" "}
                  <span className="text-base font-medium text-text-500">
                    {t("plans.labels.mxn")}
                  </span>
                </p>

                <p className="mt-2 text-xs text-text-500">
                  {t("plans.cards.business.renewal")}
                </p>
              </div>

              {renderItems(t("plans.cards.business.items"))}
            </div>

            <button
              className="mt-8 h-11 rounded-full bg-primary-500 text-bg-50 font-semibold hover:opacity-90 transition"
              onClick={goToContact}
            >
              {t("plans.ctas.business")}
            </button>
          </div>

          {/* Premium */}
          <div className="rounded-3xl border border-primary-900/10 bg-bg-50 p-7 flex flex-col">
            <div>
              <p className="text-xs font-semibold text-text-500">
                {t("plans.labels.plan")} 3
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-text-900">
                {t("plans.cards.premium.name")}
              </h3>

              <p className="mt-2 text-sm text-text-700">
                {t("plans.cards.premium.desc")}
              </p>

              <div className="mt-6">
                <p className="text-sm text-text-500">{t("plans.labels.investment")}</p>

                <p className="text-3xl font-bold text-text-900">
                  $16,299{" "}
                  <span className="text-base font-medium text-text-500">
                    {t("plans.labels.mxn")}
                  </span>
                </p>

                <p className="mt-2 text-xs text-text-500">
                  {t("plans.cards.premium.renewal")}
                </p>
              </div>

              {renderItems(t("plans.cards.premium.items"))}
            </div>

            <button
              className="mt-8 h-11 rounded-full bg-text-900 text-bg-50 font-semibold hover:opacity-90 transition"
              onClick={goToContact}
            >
              {t("plans.ctas.premium")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}