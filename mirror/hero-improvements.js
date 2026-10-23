/* Keep hero copy and CTA presentation consistent across React carousel updates. */
(() => {
  const desktopTitle = "Wujudkan Impian Masa Depan dengan Tabungan BCA";
  const mobileTitle = "Wujudkan Impian dengan Tabungan Masa Depan";
  const desktopCta = "Pelajari Tabungan BCA";
  const mobileCta = "Pelajari Lebih Lanjut";
  const desktopImage = "/assets/cycle1/hero-figma.jpg";
  const mobileImage = "/assets/cycle1/hero-mobile-figma.png";
  const heroSelector = "#main-content .page-stack > .relative.z-10 > .relative.overflow-x-visible";

  const reconcile = () => {
    const hero = document.querySelector(heroSelector);
    if (!hero) return;
    const mobile = window.matchMedia("(max-width: 440px)").matches;
    const firstImage = hero.querySelector(`img[src="${desktopImage}"], img[src="${mobileImage}"]`);
    const desiredImage = mobile ? mobileImage : desktopImage;
    if (firstImage && firstImage.getAttribute("src") !== desiredImage) firstImage.setAttribute("src", desiredImage);

    const heading = hero.querySelector("h1");
    const button = hero.querySelector(".animate-hero-cta button");
    if (!heading || !button) return;
    const isFirstSlide = heading.textContent === desktopTitle || heading.textContent === mobileTitle;
    hero.toggleAttribute("data-bca-hero-second-slide", heading.textContent.startsWith("BCA Presale"));
    button.setAttribute("data-bca-hero-cta", "");
    if (isFirstSlide) {
      const desiredTitle = mobile ? mobileTitle : desktopTitle;
      const desiredCta = mobile ? mobileCta : desktopCta;
      if (heading.textContent !== desiredTitle) heading.textContent = desiredTitle;
      const label = button.querySelector("span");
      if (label && label.textContent !== desiredCta) label.textContent = desiredCta;
      button.setAttribute("data-bca-hero-scroll-products", "");
    } else {
      button.removeAttribute("data-bca-hero-scroll-products");
    }
  };

  let scrollFrame = 0;
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-bca-hero-scroll-products]");
    if (!button) return;
    const target = document.getElementById("products");
    if (!target) return;
    cancelAnimationFrame(scrollFrame);
    const start = scrollY;
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const destination = Math.max(0, target.getBoundingClientRect().top + start - margin);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, destination);
      return;
    }
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 800);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + (destination - start) * eased);
      if (progress < 1) scrollFrame = requestAnimationFrame(tick);
    };
    scrollFrame = requestAnimationFrame(tick);
  });

  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => {
      const element = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
      return element?.closest(heroSelector);
    })) return;
    reconcile();
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener("resize", reconcile);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reconcile, { once: true });
  else reconcile();
})();
