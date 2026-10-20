/* Keep the first slide's CTA aligned with its Figma label across React carousel updates. */
(() => {
  const title = "Wujudkan Impian Masa Depan dengan Tabungan BCA";
  const heroSelector = "#main-content .page-stack > .relative.z-10 > .relative.overflow-x-visible";

  const reconcile = () => {
    const hero = document.querySelector(heroSelector);
    if (!hero) return;
    const button = hero.querySelector(".animate-hero-cta button");
    if (!button) return;
    const isFirstSlide = hero.querySelector("h1")?.textContent === title;
    if (isFirstSlide) button.setAttribute("data-bca-hero-cta", "");
    else button.removeAttribute("data-bca-hero-cta");
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
  if (document.readyState === "complete") reconcile();
  else window.addEventListener("load", reconcile, { once: true });
})();
