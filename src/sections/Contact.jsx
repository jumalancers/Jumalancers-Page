import { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { useLang } from "../i18n.jsx";

const EMAIL_TO = "contacto@jumalancers.com";

// Pon tu número en formato internacional SIN + y sin espacios, ejemplo: 526641234567
const WHATSAPP_NUMBER = "526641111859";

export default function ContactSection() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "idle", msg: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const whatsappLink = useMemo(() => {
    const text = encodeURIComponent(t("contact.waText"));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [t, lang]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return t("contact.nameReq");
    if (!form.email.trim()) return t("contact.emailReq");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return t("contact.emailValid");
    if (!form.message.trim()) return t("contact.msgReq");
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    const err = validate();
    if (err) {
      setStatus({ type: "error", msg: err });
      return;
    }

    // EmailJS config (pon tus valores en .env)
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus({
        type: "error",
        msg: t("contact.envMissing"),
      });
      return;
    }

    try {
      setLoading(true);

      // Ajusta los nombres de campos a los que uses en tu template de EmailJS
      const payload = {
        from_name: form.name,
        reply_to: form.email,
        company: form.company || "—",
        message: form.message,
        to_email: EMAIL_TO,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY);

      setStatus({
        type: "success",
        msg: t("contact.sent"),
      });

      setForm({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        msg: t("contact.fail"),
      });
      console.error("EmailJS error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-900/5 border border-primary-900/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <p className="text-xs font-semibold text-primary-700">
                {" "}
                {t("contact.badge")}
              </p>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold text-text-900 tracking-tight">
              {t("contact.title")}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-text-700 leading-relaxed">
              {t("contact.descA")}{" "}
              <span className="font-semibold text-text-900">
                {t("contact.descWhatsApp")}
              </span>{" "}
              {t("contact.descAnd")}{" "}
              <span className="font-semibold text-text-900">
                {t("contact.descEmail")}
              </span>{" "}
              {t("contact.descB")}
            </p>

            {/* Quick actions */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="
                group h-11 px-5 rounded-full
                bg-primary-500 text-bg-50
                font-semibold
                inline-flex items-center justify-center gap-2
                shadow-sm shadow-primary-500/20
                hover:opacity-90 transition
              "
              >
                {t("contact.waCta")}
                <span
                  className="text-base leading-none opacity-90 group-hover:translate-x-0.5 transition"
                  aria-hidden
                >
                  ↗
                </span>
              </a>

              <a
                href={`mailto:${EMAIL_TO}?subject=${encodeURIComponent(t("contact.emailSubject"))}`}
                className="
                h-11 px-5 rounded-full
                bg-bg-50 text-text-900
                border border-primary-900/10
                font-semibold
                inline-flex items-center justify-center gap-2
                hover:bg-bg-100/70 transition
              "
              >
                {t("contact.emailCta")}
                <span aria-hidden className="text-base leading-none">
                  ✉
                </span>
              </a>
            </div>

            {/* Contact card */}
            <div className="mt-7 rounded-3xl bg-bg-50 border border-primary-900/10 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-900">
                    {t("contact.detailsTitle")}
                  </p>
                  <p className="mt-2 text-sm text-text-700">
                    {t("contact.emailLabel")}:{" "}
                    <a
                      className="font-semibold text-text-900 underline underline-offset-4 decoration-primary-900/20 hover:decoration-primary-500 transition"
                      href={`mailto:${EMAIL_TO}`}
                    >
                      {EMAIL_TO}
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-text-700">
                    {t("contact.whatsappLabel")}:{" "}
                    <span className="font-semibold text-text-900">
                      +{WHATSAPP_NUMBER}
                    </span>
                  </p>
                </div>

                <div className="shrink-0 h-11 w-11 rounded-2xl bg-primary-900/5 border border-primary-900/10 grid place-items-center">
                  <span className="text-primary-700 font-bold">JM</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary-900/5 border border-primary-900/10 px-3 py-1 text-xs font-semibold text-text-700">
                  {t("contact.tags.response")}
                </span>
                <span className="rounded-full bg-primary-900/5 border border-primary-900/10 px-3 py-1 text-xs font-semibold text-text-700">
                  {t("contact.tags.scope")}
                </span>
                <span className="rounded-full bg-primary-900/5 border border-primary-900/10 px-3 py-1 text-xs font-semibold text-text-700">
                  {t("contact.tags.delivery")}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl bg-bg-50 border border-primary-900/10">
              {/* subtle top accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-primary-500" />
              {/* soft glow */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />

              <div className="p-5 sm:p-7">
                <h3 className="text-lg sm:text-xl font-semibold text-text-900">
                  {t("contact.formTitle")}
                </h3>
                <p className="mt-1 text-sm text-text-700">
                  {t("contact.formDesc")}
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text-600">
                        {t("contact.fields.name")}
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        className="
                        mt-2 w-full h-11 px-4 rounded-xl
                        bg-bg-100/70 border border-primary-900/10
                        text-text-900 placeholder:text-text-500
                        focus:outline-none focus:ring-2 focus:ring-primary-500/25
                        focus:border-primary-500/30 transition
                      "
                        placeholder={t("contact.fields.namePh")}
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-600">
                        {t("contact.fields.email")}
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        className="
                        mt-2 w-full h-11 px-4 rounded-xl
                        bg-bg-100/70 border border-primary-900/10
                        text-text-900 placeholder:text-text-500
                        focus:outline-none focus:ring-2 focus:ring-primary-500/25
                        focus:border-primary-500/30 transition
                      "
                        placeholder={t("contact.fields.emailPh")}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-600">
                      {t("contact.fields.company")}
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={onChange}
                      className="
                      mt-2 w-full h-11 px-4 rounded-xl
                      bg-bg-100/70 border border-primary-900/10
                      text-text-900 placeholder:text-text-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500/25
                      focus:border-primary-500/30 transition
                    "
                      placeholder={t("contact.fields.companyPh")}
                      autoComplete="organization"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-600">
                      {t("contact.fields.message")}
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      rows={5}
                      className="
                      mt-2 w-full px-4 py-3 rounded-xl
                      bg-bg-100/70 border border-primary-900/10
                      text-text-900 placeholder:text-text-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500/25
                      focus:border-primary-500/30 transition
                      resize-none
                    "
                      placeholder={t("contact.fields.messagePh")}
                    />
                  </div>

                  {status.type !== "idle" ? (
                    <div
                      className={[
                        "rounded-2xl px-4 py-3 text-sm border",
                        status.type === "success"
                          ? "bg-primary-500/10 text-text-900 border-primary-900/10"
                          : "bg-red-50 text-red-800 border-red-200",
                      ].join(" ")}
                    >
                      {status.msg}
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="
                      h-11 px-5 rounded-full
                      bg-text-900 text-bg-50
                      font-semibold
                      inline-flex items-center justify-center
                      hover:opacity-90 transition
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                    >
                      {loading ? t("contact.sending") : t("contact.submit")}
                    </button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="
                      h-11 px-5 rounded-full
                      bg-bg-50 text-text-900
                      border border-primary-900/10
                      font-semibold
                      inline-flex items-center justify-center
                      hover:bg-bg-100/70 transition
                    "
                    >
                      {t("contact.quickChat")}
                    </a>
                  </div>

                  <p className="text-xs text-text-500">
                    {t("contact.consent")}
                  </p>
                </form>
              </div>
            </div>

            <p className="mt-3 text-xs text-text-500">
              {t("contact.protip")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
