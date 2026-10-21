/* Keep the first slide's CTA aligned with its Figma label across React carousel updates. */
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
    if (isFirstSlide) {
      const desiredTitle = mobile ? mobileTitle : desktopTitle;
      const desiredCta = mobile ? mobileCta : desktopCta;
      if (heading.textContent !== desiredTitle) heading.textContent = desiredTitle;
      const label = button.querySelector("span");
      if (label && label.textContent !== desiredCta) label.textContent = desiredCta;
      button.setAttribute("data-bca-hero-cta", "");
    } else {
      button.removeAttribute("data-bca-hero-cta");
    }
  };

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-bca-hero-cta]");
    if (!button) return;
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => {
      const element = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement;
      return element?.closest(heroSelector);
    })) return;
    requestAnimationFrame(reconcile);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener("resize", reconcile);
  if (document.readyState === "complete") reconcile();
  else window.addEventListener("load", reconcile, { once: true });
})();
