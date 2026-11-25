import { ArrowRight, CalendarDays } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { POSTS, BLOG_UI } from "../data/blog/posts.js";
import { SERVICES, PAGE_UI } from "../data/pages/services.js";
import { useLang } from "../i18n.jsx";
import { PageHero, CheckList } from "./shared.jsx";

const fmtDate = (iso, lang) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === "es" ? "es-MX" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

function PostCard({ post }) {
  const { lang, pageHref } = useLang();
  const b = BLOG_UI[lang];
  const c = post[lang];
  return (
    <a
      href={pageHref(`post-${post.id}`)}
      className="group card flex h-full flex-col p-6 transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:p-7"
    >
      <time dateTime={post.date} className="inline-flex items-center gap-1.5 text-xs text-text-500">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        {fmtDate(post.date, lang)}
      </time>
      <h2 className="mt-3 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-text-900 text-balance sm:text-2xl">{c.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-text-500 text-pretty">{c.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary-300">
        {b.read}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </a>
  );
}

export function BlogIndex() {
  const { lang, homeHref } = useLang();
  const b = BLOG_UI[lang];
  const ui = PAGE_UI[lang];
  const posts = [...POSTS].sort((a, z) => z.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        crumbs={[{ label: ui.home, href: homeHref("") }, { label: b.eyebrow }]}
        eyebrow={b.eyebrow}
        h1={b.h1}
        accent={b.accent}
        intro={b.intro}
      />
      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {posts.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 60}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Block({ b }) {
  const { lang, pageHref } = useLang();
  if (b.h2)
    return <h2 className="mt-12 font-display text-2xl font-semibold tracking-[-0.03em] text-text-900 text-balance sm:text-3xl">{b.h2}</h2>;
  if (b.p) return <p className="mt-5 text-base leading-[1.75] text-text-500 text-pretty sm:text-[17px]">{b.p}</p>;
  if (b.ul)
    return (
      <div className="mt-6">
        <CheckList items={b.ul} />
      </div>
    );
  if (b.cta) {
    const s = SERVICES[b.cta][lang];
    return (
      <a
        href={pageHref(b.cta)}
        className="group card mt-12 flex flex-col gap-2 p-6 transition hover:border-primary-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 sm:p-7"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-300">{BLOG_UI[lang].serviceLink}</span>
        <span className="font-display text-xl font-semibold tracking-tight text-text-900">
          {s.h1} {s.accent}
        </span>
        <span className="text-[15px] leading-relaxed text-text-500">{s.metaDesc}</span>
        <ArrowRight className="mt-1 h-4 w-4 text-primary-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
    );
  }
  return null;
}

export function BlogPost({ id }) {
  const { lang, homeHref, pageHref } = useLang();
  const b = BLOG_UI[lang];
  const ui = PAGE_UI[lang];
  const post = POSTS.find((p) => p.id === id);
  const c = post[lang];
  const others = POSTS.filter((p) => p.id !== id).slice(0, 2);

  return (
    <>
      <article>
        <section className="relative isolate overflow-hidden pt-28 pb-6 sm:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/3 rounded-full glow-orb text-primary-500/10"
          />
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              <nav aria-label="Breadcrumb" className="text-sm text-text-500">
                <a href={homeHref("")} className="transition hover:text-primary-300">
                  {ui.home}
                </a>
                <span className="mx-1.5 text-text-500/60">/</span>
                <a href={pageHref("blog")} className="transition hover:text-primary-300">
                  {b.eyebrow}
                </a>
              </nav>
              <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-text-900 text-balance sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-500">
                <span>{b.by}</span>
                <span className="h-1 w-1 rounded-full bg-white/20" aria-hidden="true" />
                <time dateTime={post.date}>
                  {b.published} {fmtDate(post.date, lang)}
                </time>
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl">
              {c.body.map((blk, i) => (
                <Block key={i} b={blk} />
              ))}
            </div>
          </div>
        </section>
      </article>

      <section className="pb-16 sm:pb-20">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            {others.length > 0 && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-text-900">{b.more}</h2>
                  <a href={pageHref("blog")} className="text-sm font-semibold text-primary-300 transition hover:text-primary-200">
                    {b.back} →
                  </a>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {others.map((p) => (
                    <li key={p.id}>
                      <PostCard post={p} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
