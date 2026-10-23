import { renderCreditCardPageShell } from "./credit-card-page-shell.mjs";
import { renderCreditCardCompareHero } from "./credit-card-compare-hero.mjs";
import { renderCreditCardCompareTable } from "./credit-card-compare-table.mjs";

export function renderCreditCardComparePage(homepage, selectedCards) {
  return renderCreditCardPageShell(homepage, {
    beforePromo: renderCreditCardCompareHero() + renderCreditCardCompareTable(selectedCards),
    markerId: "compare-table",
    pageClass: "bca-credit-compare-runtime",
    showPromo: false,
    title: "Bandingkan Kartu Kredit BCA",
    styles: [
      "credit-card-home-page.css",
      "credit-card-hero-navigation.css",
      "credit-card-compare-hero.css",
      "credit-card-compare-table.css",
      "credit-card-tutorial.css",
      "credit-card-faq.css",
    ],
  });
}
