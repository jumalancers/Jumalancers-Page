import { Instagram, Facebook } from "lucide-react";
import { useLang } from "../i18n.jsx"; // ajusta ruta si es otra

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="text-text-700 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold text-text-900">Jumalancers</h3>

            <p className="mt-4 text-sm leading-relaxed text-text-500">
              {t("footer.brandDesc")}
            </p>

            <div className="flex gap-2 mt-2">
              <a href="https://instagram.com/jumalancers" target="_blanck">
                <Instagram className="size-9 p-2 hover:bg-primary-900/10 rounded-full transition" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587112451778"
                target="_blanck"
              >
                <Facebook className="size-9 p-2 hover:bg-primary-900/10 rounded-full transition" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text-900 uppercase tracking-wide">
              {t("footer.navTitle")}
            </h4>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#process" className="hover:text-primary-400 transition">
                  {t("footer.nav.process")}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-primary-400 transition">
                  {t("footer.nav.portfolio")}
                </a>
              </li>
              <li>
                <a href="#plans" className="hover:text-primary-400 transition">
                  {t("footer.nav.plans")}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-400 transition">
                  {t("footer.nav.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-text-900 uppercase tracking-wide">
              {t("footer.servicesTitle")}
            </h4>

            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-text-500">{t("footer.services.landing")}</li>
              <li className="text-text-500">{t("footer.services.business")}</li>
              <li className="text-text-500">{t("footer.services.systems")}</li>
              <li className="text-text-500">{t("footer.services.uiux")}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-900 uppercase tracking-wide">
              {t("footer.contactTitle")}
            </h4>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:jumalancers@gmail.com"
                  className="hover:text-primary-400 transition"
                >
                  contacto@jumalancers.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/526644257324"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-400 transition"
                >
                  {t("footer.whatsapp")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 h-px bg-primary-800" />

        {/* Bottom */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-500">
          <p>
            © {new Date().getFullYear()} Jumalancers. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}