document.documentElement.classList.add('js');
addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: white text over the hero video, solid white bar after it */
  const hd = $('#hd'), hero = $('.hero');
  const onS = () => {
    const past = !hero || scrollY > hero.offsetHeight - 90;
    hd.classList.toggle('solid', past && scrollY > 10 || (!hero && scrollY > 10));
    hd.classList.toggle('dark', !!hero && !past);
    hd.classList.toggle('scrolled', scrollY > 10);
  };
  addEventListener('scroll', onS, { passive: true }); onS();
  const burger = $('#burger');
  burger.onclick = () => { const o = document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o) };
  $$('.mnav a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false') }));

  /* inner pages not built yet */
  const names = { about: 'About us', services: 'Services', residential: 'Residential Cleaning', 'deep-cleaning': 'One-Time Deep Cleaning', commercial: 'Commercial Cleaning', reviews: 'Reviews', blog: 'Blog', jobs: 'Jobs', contact: 'Contact' };
  const route = () => { const h = location.hash; if (h.startsWith('#/') && h.length > 2) { document.body.classList.add('soon'); const nm = names[h.slice(2)] || 'This'; $('#soonT').textContent = nm; $('#soonN').textContent = nm; $('#soonN2').textContent = nm; scrollTo(0, 0) } else { const was = document.body.classList.contains('soon'); document.body.classList.remove('soon'); if (was) { const el = h.length > 1 && $(h); setTimeout(() => { if (window.lenis) lenis.resize(); if (window.ScrollTrigger) ScrollTrigger.refresh(); const y = el ? el.getBoundingClientRect().top + scrollY - 70 : 0; window.lenis ? lenis.scrollTo(Math.max(0, y), { immediate: true }) : scrollTo(0, Math.max(0, y)) }, 30) } } onS() };
  if ($('#soon')) { addEventListener('hashchange', route); route() }

  /* video modal: data-yt="ID", optional data-t="seconds", data-short for vertical */
  const vm = $('#vm'), box = $('.box', vm);
  const close = () => { vm.classList.remove('open', 'short'); box.innerHTML = ''; document.body.style.overflow = ''; window.lenis && lenis.start() };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-yt]'); if (!t) return; e.preventDefault();
    vm.classList.toggle('short', t.hasAttribute('data-short'));
    box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + t.dataset.yt + '?autoplay=1&rel=0&playsinline=1' + (t.dataset.t ? '&start=' + t.dataset.t : '') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="Video"></iframe>';
    vm.classList.add('open'); document.body.style.overflow = 'hidden'; window.lenis && lenis.stop();
  });
  vm.addEventListener('click', e => { if (e.target === vm || e.target.closest('.x')) close() });
  addEventListener('keydown', e => { if (e.key === 'Escape') close() });

  /* videos: the poster image stays underneath; a video fades in only once it is really playing */
  const vio = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting: i }) => {
    if (i) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}) } else v.pause();
  }), { rootMargin: '200px' });
  $$('video').forEach(v => { v.muted = true; v.addEventListener('playing', () => v.classList.add('on')); if (!v.paused && v.readyState > 2) v.classList.add('on'); vio.observe(v) });

  /* quote form (demo) */
  const f = $('#qform');
  if (f) f.addEventListener('submit', e => {
    e.preventDefault();
    const miss = ['name', 'phone', 'service'].filter(n => !f[n].value.trim());
    if (miss.length) { f[miss[0]].focus(); f[miss[0]].style.borderColor = '#ef6a6a'; return }
    $('#ok').style.display = 'block';
  });

  /* service-area map, loaded only when near */
  const mapEl = $('#map');
  if (mapEl) new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(css);
    const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    s.onload = () => {
      const m = L.map(mapEl, { scrollWheelZoom: false, zoomControl: false }).setView([47.52, -122.22], 10);
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors' }).addTo(m);
      L.circle([47.4829, -122.2171], { radius: 24000, color: '#0a9fd8', weight: 1.5, fillColor: '#38c6f4', fillOpacity: .14 }).addTo(m);
      L.circleMarker([47.4829, -122.2171], { radius: 7, color: '#fff', weight: 3, fillColor: '#0a9fd8', fillOpacity: 1 }).addTo(m).bindTooltip('Renton &amp; greater Seattle', { permanent: true, direction: 'right' });
    };
    document.body.appendChild(s);
  }, { rootMargin: '400px' }).observe(mapEl);

  /* motion */
  const start = () => {
    if (!window.gsap || !window.ScrollTrigger || RM) { $$('.rv').forEach(e => { e.style.opacity = 1; e.style.transform = 'none' }); return }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      window.lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const h = a.getAttribute('href'); if (document.body.classList.contains('soon')) return; if (h.length > 1 && !h.startsWith('#/') && $(h)) { e.preventDefault(); lenis.scrollTo(h, { offset: -70 }) } }));
    }
    gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
    if ($('.hero h1')) {
      gsap.from('.hero h1 .ln>span', { yPercent: 105, duration: 1.15, ease: 'expo.out', stagger: .09, delay: .1 });
      gsap.from('.hero .sub, .hero .ctas, .facts>div', { opacity: 0, y: 18, duration: 1, ease: 'power3.out', stagger: .07, delay: .55 });
      gsap.to('.hero .bg', { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    $$('.rv').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
    const man = $('#manifesto');
    if (man) {
      man.innerHTML = man.textContent.split(' ').map(w => '<span class="w">' + w + '</span>').join(' ');
      const ws = $$('.w', man);
      ScrollTrigger.create({ trigger: man, start: 'top 82%', end: 'bottom 50%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i < n)) } });
    }
    $$('img.par').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
    addEventListener('load', () => ScrollTrigger.refresh());
  };
  if (window.gsap && window.ScrollTrigger) start(); else { let n = 0; const w = setInterval(() => { if (window.gsap && window.ScrollTrigger || ++n > 60) { clearInterval(w); start() } }, 50) }
});
