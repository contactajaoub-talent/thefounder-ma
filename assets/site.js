// Navigation et compteurs. Aucun suivi, stockage ou appel réseau.
(() => {
  const button = document.getElementById('menu-button');
  const nav = document.getElementById('main-navigation');
  if (button && nav) {
    document.documentElement.classList.add('js-menu');
    const mobile = matchMedia('(max-width: 820px)');
    const close = (returnFocus = false) => {
      nav.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Ouvrir le menu'); if (returnFocus) button.focus();
    };
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open'); button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) close(true); });
    document.addEventListener('click', e => { if (!nav.contains(e.target) && !button.contains(e.target)) close(); });
    document.addEventListener('focusin', e => { if (!nav.contains(e.target) && !button.contains(e.target)) close(); });
    mobile.addEventListener('change', () => close());
  }
  const section = document.getElementById('impact');
  if (!section) return;
  const counters = [...section.querySelectorAll('.impact-number[data-target]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let started = false, frameId;
  const render = progress => counters.forEach(el => {
    const decimals = Number(el.dataset.decimals || 0);
    el.textContent = (el.dataset.prefix || '') + (Number(el.dataset.target) * progress).toLocaleString('fr-FR', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  });
  const finish = () => { cancelAnimationFrame(frameId); render(1); };
  motion.addEventListener('change', () => { if (motion.matches) finish(); });
  const play = () => {
    if (started) return; started = true;
    if (motion.matches) { render(1); return; }
    render(0); let start;
    const frame = now => {
      start ??= now; const t = Math.min((now - start) / 1300, 1);
      render(1 - Math.pow(1 - t, 3)); if (t < 1) frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
  };
  if (!('IntersectionObserver' in window)) { render(1); return; }
  const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { play(); observer.disconnect(); } }, {threshold: .15});
  // Preserve the counters' visible animation after the cosmetic preloader.
  let observing = false, fallback;
  const observe = () => {
    if (observing) return;
    observing = true;
    clearTimeout(fallback);
    document.removeEventListener('thefounder:preloader-ready', observe);
    observer.observe(section);
  };
  if (document.getElementById('thefounder-preloader')) {
    document.addEventListener('thefounder:preloader-ready', observe, {once:true});
    // CSS still hides the overlay if its dedicated JavaScript cannot load.
    fallback = setTimeout(observe, 2000);
  } else observe();
})();

/* Solutions : entrées progressives et suspension des animations hors écran. */
(() => {
  const cards = document.querySelectorAll('.sv-showcase');
  if (!cards.length || !('IntersectionObserver' in window)) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  document.documentElement.classList.add('sv-motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('sv-visible', entry.isIntersecting);
  }, {rootMargin:'90px 0px 90px 0px',threshold:0.05});
  cards.forEach(card => observer.observe(card));
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      observer.disconnect();
      cards.forEach(card => card.classList.add('sv-visible'));
      document.documentElement.classList.remove('sv-motion-ready');
    }
  });
})();
