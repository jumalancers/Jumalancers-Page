import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, ArrowUpRight, CheckCircle2, Clock, Lock, Mail, MapPin, Send } from "lucide-react";
import { useLang } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import { Section, SectionHeader } from "../components/ui/index.jsx";
import { SITE, waLink } from "../data/site.js";

const TYPE_KEYS = ["landing", "corporate", "system", "ecommerce", "other"];
const BUDGET_KEYS = ["b1", "b2", "b3", "b4", "unsure"];
const EMPTY = { name: "", email: "", company: "", type: "", budget: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function WhatsAppIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 01-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

/* ---------- Canal directo (tarjeta grande) ---------- */
function Channel({ icon, label, value, hint, href, external, featured, compact }) {
  const Icon = icon;
  const inner = (
    <>
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${
          featured
            ? "bg-primary-400 text-[hsl(167,60%,6%)] ring-primary-300/40"
            : "bg-primary-500/10 text-primary-300 ring-primary-400/20"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-500">{label}</span>
        <span
          className={`mt-0.5 block font-semibold text-text-900 ${compact ? "text-[15px] leading-snug" : "text-[15px] min-[400px]:text-base sm:text-lg"}`}
        >
          {/* Emails: permitir el salto solo después de la "@" en pantallas angostas */}
          {typeof value === "string" && value.includes("@") ? (
            <>
              {value.split("@")[0]}@<wbr />
              {value.split("@")[1]}
            </>
          ) : (
            value
          )}
        </span>
        <span className="mt-0.5 block text-sm text-text-500">{hint}</span>
      </span>
      {href && (
        <ArrowUpRight className="h-5 w-5 shrink-0 self-center text-text-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-300" />
      )}
    </>
  );
  const cls = `card group flex gap-4 p-4 sm:p-5 transition ${compact ? "flex-row items-start sm:flex-col sm:gap-3" : "items-start"} ${
    featured ? "border-primary-400/30 bg-primary-500/[0.07]" : ""
  } ${href ? "hover:border-primary-400/40 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400" : ""}`;
  if (!href) return <div className={cls}>{inner}</div>;
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {inner}
    </a>
  );
}

/* ---------- Chips seleccionables (radiogroup accesible con botones) ---------- */
function ChipGroup({ id, legend, optional, options, value, onChange, note }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-text-700">
        {legend} <span className="font-normal text-text-500">({optional})</span>
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={legend} id={id}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(active ? "" : o.value)}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition sm:h-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                active
                  ? "border-primary-400/60 bg-primary-400/15 text-primary-200"
                  : "border-white/10 bg-white/[0.03] text-text-700 hover:border-white/20 hover:bg-white/[0.06] hover:text-text-900"
              }`}
            >
              {active && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
              {o.label}
            </button>
          );
        })}
      </div>
      {note && <p className="mt-2 text-[13px] leading-snug text-text-500 sm:text-xs">{note}</p>}
    </fieldset>
  );
}

/* ---------- Campo de texto con label, error y aria ---------- */
function Field({ id, label, required, optional, error, textarea, className = "", ...props }) {
  const errId = `${id}-error`;
  const base =
    "mt-2 w-full rounded-xl border bg-white/[0.03] px-4 text-[15px] text-text-900 placeholder:text-text-500/80 transition hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary-400/40";
  const state = error
    ? "border-red-400/60 focus:border-red-400"
    : "border-white/10 hover:border-white/20 focus:border-primary-400";
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium text-text-700">
        {label}
        {required && (
          <span className="text-primary-300" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {optional && <span className="font-normal text-text-500"> ({optional})</span>}
      </label>
      <Tag
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`${base} ${state} ${textarea ? "min-h-[132px] resize-y py-3" : "h-12"}`}
        {...props}
      />
      {error && (
        <p id={errId} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactSection() {
  const { t } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const successRef = useRef(null);
  const formRef = useRef(null);

  const wa = waLink(t("contact.waText"));
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(t("contact.emailSubject"))}`;

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };
  const onChange = (e) => set(e.target.name, e.target.value);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("contact.errors.nameReq");
    if (!form.email.trim()) e.email = t("contact.errors.emailReq");
    else if (!EMAIL_RE.test(form.email.trim())) e.email = t("contact.errors.emailValid");
    if (!form.message.trim()) e.message = t("contact.errors.msgReq");
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    setErrorMsg("");

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus("error");
      setErrorMsg(t("contact.errors.summary"));
      const first = ["name", "email", "message"].find((k) => e[k]);
      formRef.current?.querySelector(`#contact-${first}`)?.focus();
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();

    // Honeypot: un bot llenó el campo oculto → simulamos éxito sin enviar.
    if (form.website) {
      setSentTo({ name, email });
      setForm(EMPTY);
      setStatus("success");
      return;
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setErrorMsg(t("contact.errors.envMissing"));
      return;
    }

    setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      const payload = {
        // Variables existentes del template
        from_name: name,
        reply_to: email,
        company: form.company.trim() || "—",
        message: form.message.trim(),
        to_email: SITE.email,
        // Variables nuevas
        project_type: form.type ? t(`contact.form.types.${form.type}`) : "—",
        budget: form.budget ? `${t(`contact.form.budgets.${form.budget}`)} USD` : "—",
      };
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, PUBLIC_KEY);
      setSentTo({ name, email });
      setForm(EMPTY);
      setErrors({});
      setStatus("success");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(t("contact.errors.fail"));
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  const steps = t("contact.next.steps");
  const sending = status === "sending";

  return (
    <Section id="contact" className="isolate overflow-hidden">
      {/* Fondo: glows sutiles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-[-10%] h-[480px] w-[480px] rounded-full glow-orb text-primary-500/10" />
        <div className="absolute bottom-[-20%] right-[-5%] h-[420px] w-[420px] rounded-full glow-orb text-primary-400/10" />
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---------- Izquierda ---------- */}
        <div className="min-w-0 lg:col-span-5">
          <SectionHeader
            align="left"
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            accent={t("contact.accent")}
            desc={t("contact.desc")}
          />

          <Reveal delay={80} className="mt-8 grid grid-cols-1 gap-3">
            <Channel
              featured
              icon={WhatsAppIcon}
              label={t("contact.channels.whatsapp.label")}
              value={SITE.whatsappDisplay}
              hint={t("contact.channels.whatsapp.hint")}
              href={wa}
              external
            />
            <Channel
              icon={Mail}
              label={t("contact.channels.email.label")}
              value={SITE.email}
              hint={t("contact.channels.email.hint")}
              href={mailto}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Channel
                icon={MapPin}
                compact
                label={t("contact.channels.location.label")}
                value={t("contact.channels.location.value")}
                hint={t("contact.channels.location.hint")}
              />
              <Channel
                icon={Clock}
                compact
                label={t("contact.channels.hours.label")}
                value={t("contact.channels.hours.value")}
                hint={t("contact.channels.hours.hint")}
              />
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-500">
              {t("contact.next.title")}
            </h3>
            <ol className="relative mt-5 space-y-5">
              <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-primary-400/40 via-white/10 to-transparent" />
              {Array.isArray(steps) &&
                steps.map((s, i) => (
                  <li key={i} className="relative flex gap-4">
                    <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary-400/30 bg-bg-50 font-mono text-xs font-semibold text-primary-300">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <p className="font-semibold text-text-900">{s.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-text-500">{s.desc}</p>
                    </div>
                  </li>
                ))}
            </ol>
          </Reveal>
        </div>

        {/* ---------- Derecha: formulario ---------- */}
        <Reveal delay={120} className="min-w-0 lg:col-span-7 lg:sticky lg:top-24">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] glow-orb text-primary-400/15"
            />
            <div className="card relative overflow-hidden bg-bg-50/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
              <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/60 to-transparent" />

              {status === "success" ? (
                <div className="flex flex-col items-center py-8 text-center sm:py-12">
                  <span className="relative grid h-20 w-20 place-items-center">
                    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary-400/20 blur-xl motion-safe:animate-pulse" />
                    <span className="relative grid h-16 w-16 place-items-center rounded-full bg-primary-400 text-[hsl(167,60%,6%)] shadow-[0_8px_40px_-8px] shadow-primary-400/60">
                      <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                    </span>
                  </span>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-text-900 focus:outline-none sm:text-4xl"
                  >
                    {t("contact.success.title")}
                  </h3>
                  <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-text-500" role="status">
                    {String(t("contact.success.desc"))
                      .replace("{name}", sentTo.name.split(" ")[0])
                      .replace("{email}", sentTo.email)}
                  </p>
                  <div className="mt-8 w-full max-w-sm border-t border-white/8 pt-6">
                    <p className="text-sm text-text-500">{t("contact.success.waHint")}</p>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener"
                      className="group mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary-400 px-6 font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      {t("contact.success.waCta")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-3 inline-flex min-h-10 items-center px-2 text-sm font-medium text-text-500 underline-offset-4 transition hover:text-text-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                    >
                      {t("contact.success.again")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-text-900 sm:text-2xl">
                    {t("contact.form.title")}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-500">{t("contact.form.desc")}</p>

                  <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-7 space-y-6" aria-busy={sending}>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        id="contact-name"
                        name="name"
                        label={t("contact.form.name")}
                        required
                        value={form.name}
                        onChange={onChange}
                        placeholder={t("contact.form.namePh")}
                        autoComplete="name"
                        error={errors.name}
                      />
                      <Field
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        label={t("contact.form.email")}
                        required
                        value={form.email}
                        onChange={onChange}
                        placeholder={t("contact.form.emailPh")}
                        autoComplete="email"
                        spellCheck={false}
                        error={errors.email}
                      />
                      <Field
                        id="contact-company"
                        name="company"
                        className="sm:col-span-2"
                        label={t("contact.form.company")}
                        optional={t("contact.form.optional")}
                        value={form.company}
                        onChange={onChange}
                        placeholder={t("contact.form.companyPh")}
                        autoComplete="organization"
                      />
                    </div>

                    <ChipGroup
                      id="contact-type"
                      legend={t("contact.form.type")}
                      optional={t("contact.form.optional")}
                      value={form.type}
                      onChange={(v) => set("type", v)}
                      options={TYPE_KEYS.map((k) => ({ value: k, label: t(`contact.form.types.${k}`) }))}
                    />

                    <ChipGroup
                      id="contact-budget"
                      legend={t("contact.form.budget")}
                      optional={t("contact.form.optional")}
                      value={form.budget}
                      onChange={(v) => set("budget", v)}
                      note={t("contact.form.budgetNote")}
                      options={BUDGET_KEYS.map((k) => ({ value: k, label: t(`contact.form.budgets.${k}`) }))}
                    />

                    <Field
                      id="contact-message"
                      name="message"
                      textarea
                      rows={5}
                      label={t("contact.form.message")}
                      required
                      value={form.message}
                      onChange={onChange}
                      placeholder={t("contact.form.messagePh")}
                      error={errors.message}
                    />

                    {/* Honeypot anti-spam: invisible para personas */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label htmlFor="contact-website">{t("contact.form.honeypot")}</label>
                      <input
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={onChange}
                      />
                    </div>

                    <div aria-live="assertive" role="alert" className="empty:hidden">
                      {status === "error" && errorMsg && (
                        <p className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>
                            {errorMsg}
                            {errorMsg !== t("contact.errors.summary") && (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener"
                                className="mt-1.5 flex w-fit items-center gap-1.5 font-semibold text-red-100 underline-offset-4 hover:underline"
                              >
                                <WhatsAppIcon className="h-3.5 w-3.5" />
                                {t("contact.errors.waCta")}
                              </a>
                            )}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-text-500 sm:max-w-[16rem] sm:text-xs">
                        <Lock className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {t("contact.form.privacy")}
                      </p>
                      <button
                        type="submit"
                        disabled={sending}
                        className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary-400 px-7 font-semibold text-[hsl(167,60%,6%)] shadow-[0_8px_30px_-8px] shadow-primary-400/50 transition hover:bg-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-50 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                      >
                        {sending ? (
                          <>
                            <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin" />
                            {t("contact.form.sending")}
                          </>
                        ) : (
                          <>
                            {t("contact.form.submit")}
                            <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                    <p className="sr-only" aria-live="polite">
                      {sending ? t("contact.form.sending") : ""}
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
