import { Button } from "../components/ui/index.jsx";
import { useLang } from "../i18n.jsx";

const TXT = {
  es: { h1: "No encontramos esta página", p: "Puede que la dirección esté mal escrita o que la página ya no exista.", home: "Ir al inicio", blog: "Ver el blog" },
  en: { h1: "We couldn't find this page", p: "The address may be misspelled, or the page may no longer exist.", home: "Go to the homepage", blog: "Read the blog" },
};

export default function NotFound() {
  const { lang, homeHref, pageHref } = useLang();
  const c = TXT[lang];
  return (
    <section className="flex min-h-[70svh] items-center pt-28 pb-16">
      <div className="container-x flex flex-col items-start gap-5">
        <span className="font-display text-6xl font-semibold text-primary-300/70">404</span>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] text-text-900 sm:text-5xl">{c.h1}</h1>
        <p className="max-w-xl text-base text-text-500 sm:text-lg">{c.p}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={homeHref("")} arrow>
            {c.home}
          </Button>
          <Button href={pageHref("blog")} variant="secondary">
            {c.blog}
          </Button>
        </div>
      </div>
    </section>
  );
}
