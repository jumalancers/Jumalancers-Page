import {
  Target,
  LayoutGrid,
  MessageSquareText,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import { useLang } from "../i18n.jsx";

function WhyCard({ icon: Icon, title, desc }) {
  return (
    <div
      className="
        group
        rounded-3xl
        bg-bg-50
        border border-primary-900/10
        hover:border-primary-900/15
        transition
        p-7
      "
    >
      <div className="flex items-start gap-5">
        <div
          className="
            h-12 w-12 shrink-0
            rounded-2xl
            bg-primary-500/10
            flex items-center justify-center
          "
        >
          <Icon className="h-5 w-5 text-primary-500" />
        </div>

        <div>
          <h4 className="text-lg font-semibold text-text-900 tracking-tight">
            {title}
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-text-700">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const { t } = useLang();
  const icons = [
    Target,
    LayoutGrid,
    MessageSquareText,
    ShieldCheck,
    Zap,
    Sparkles,
  ];
  const items = t("why.items");

  return (
    <section id="why" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-primary-500 tracking-widest">
            {t("why.badge")}
          </p>

          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
            {t("why.title")}
          </h2>

          <p className="mt-4 text-base text-text-700 leading-relaxed">
            {t("why.desc")}
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <WhyCard
              key={item.title}
              icon={icons[idx]}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
