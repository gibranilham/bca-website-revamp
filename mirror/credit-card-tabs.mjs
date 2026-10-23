const defaultSections = [
  ["card-list", "Pilihan Kartu", "Daftar Kartu"],
  ["benefits", "Manfaat", "Keuntungan"],
  ["features", "Fitur", "Fitur"],
  ["promo", "Promo", "Promo"],
  ["tutorial", "Tutorial", "Tutorial"],
  ["news-section", "Berita", "Edukasi"],
  ["faq-section", "Bantuan", "Bantuan"],
];

export function renderCreditCardTabs(sections = defaultSections) {
  return `<nav class="cc-tabs" aria-label="Navigasi bagian kartu kredit"><div class="cc-tabs__track">${sections.map(([id, desktop, mobile], index) => `<a class="cc-tabs__link${index === 0 ? " is-active" : ""}" href="#${id}" aria-label="${mobile}"${index === 0 ? ' aria-current="location"' : ""}><span class="cc-tabs__label-desktop">${desktop}</span><span class="cc-tabs__label-mobile">${mobile}</span></a>`).join("")}</div></nav>
<script>
(() => {
  const links = [...document.querySelectorAll('.cc-tabs__link')];
  const nav = document.querySelector('.cc-tabs');
  const homeTopNav = [...document.querySelectorAll('.page-stack > nav.pre-nav')].find((item) => item.hasAttribute('data-hidden'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollDuration = 800;
  const easeInOutCubic = (value) => value < .5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  let scrollFrame = 0;
  let scrollingTo = null;
  const stopScroll = () => {
    if (!scrollingTo) return;
    cancelAnimationFrame(scrollFrame);
    scrollingTo = null;
  };
  window.addEventListener('wheel', stopScroll, { passive: true });
  window.addEventListener('touchstart', stopScroll, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stopScroll();
  });
  const syncTopNav = () => nav.classList.toggle('is-nav-hidden', homeTopNav?.getAttribute('data-hidden') === 'true');
  if (homeTopNav) {
    new MutationObserver(syncTopNav).observe(homeTopNav, { attributes: true, attributeFilter: ['data-hidden'] });
    syncTopNav();
  }
  const activate = (link) => {
    links.forEach((item) => {
      item.classList.toggle('is-active', item === link);
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
  };
  const animateToSection = (anchor, pushHistory = false) => {
    const target = document.getElementById(anchor.hash.slice(1));
    if (!target) return false;
    const link = links.find((item) => item.hash === anchor.hash);
    stopScroll();
    const start = scrollY;
    const targetTop = target.getBoundingClientRect().top + start;
    const topNavHeight = homeTopNav?.getBoundingClientRect().height || (innerWidth >= 1280 ? 72 : 56);
    const offset = nav.getBoundingClientRect().height + (targetTop < start ? topNavHeight : 0);
    const destination = Math.max(0, targetTop - offset);
    const finish = () => {
      window.scrollTo(0, destination);
      history[pushHistory ? 'pushState' : 'replaceState'](null, '', anchor.hash);
      scrollingTo = null;
      if (link) activate(link);
    };
    scrollingTo = target;
    if (link) activate(link);
    if (reducedMotion.matches || Math.abs(destination - start) < 2) {
      finish();
      return true;
    }
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / scrollDuration);
      window.scrollTo(0, start + (destination - start) * easeInOutCubic(progress));
      if (progress < 1) scrollFrame = requestAnimationFrame(tick);
      else finish();
    };
    scrollFrame = requestAnimationFrame(tick);
    return true;
  };
  links.forEach((link) => link.addEventListener('click', (event) => {
    if (!animateToSection(link)) return;
    event.preventDefault();
    event.stopPropagation();
  }));
  document.querySelectorAll('.cc-detail-hero__detail, .cc-hero__action--secondary').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!animateToSection(link, true)) return;
      event.preventDefault();
    });
  });
  const targets = links.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    if (scrollingTo) return;
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) activate(links.find((link) => link.hash === '#' + visible.target.id));
  }, { rootMargin: '-30% 0px -60% 0px' });
  targets.forEach((target) => observer.observe(target));
})();
</script>`;
}
