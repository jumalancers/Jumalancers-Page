import { useLang } from "../i18n.jsx";
import { PROJECTS } from "../data/projects.js";

// Franja estática con los clientes reales (wordmarks tipográficos).
export default function ClientsStrip() {
  const { t, lang } = useLang();

  return (
    <section id="clients" aria-labelledby="clients-title" className="relative py-12 sm:py-16">
      <div className="container-x">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <h2
            id="clients-title"
            className="text-center text-xs font-medium uppercase tracking-[0.18em] text-text-500"
          >
            {t("clients.title")}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <ul
          aria-label={t("clients.listLabel")}
          className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4"
        >
          {PROJECTS.map((p) => (
            <li key={p.id} className="flex flex-col items-center text-center">
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-10 items-center rounded-lg px-1 font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-text-700 transition-colors duration-300 hover:text-text-900 focus:outline-none focus-visible:text-primary-300 sm:text-xl"
              >
                {p.name}
              </a>
              <span className="text-[11px] font-medium uppercase leading-snug tracking-[0.12em] text-text-300">
                {p.industry[lang]} · {p.location}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
