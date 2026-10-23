import { renderCreditCardHeroNavigation } from "./credit-card-hero-navigation.mjs";

export function renderCreditCardCompareHero() {
  return `<section class="cc-compare-hero" aria-labelledby="cc-compare-title">
    <div class="cc-compare-hero__inner">
      ${renderCreditCardHeroNavigation("Bandingkan")}
      <h1 id="cc-compare-title">Temukan Kartu yang Paling Tepat</h1>
      <p>Bandingkan hingga 3 kartu sekaligus dan pahami mana yang paling cocok untuk kebutuhanmu.</p>
    </div>
  </section>`;
}
