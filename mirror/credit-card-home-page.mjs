import { renderCreditCardPageShell } from "./credit-card-page-shell.mjs";
import { renderCreditCardHero } from "./credit-card-hero.mjs";
import { renderCreditCardTabs } from "./credit-card-tabs.mjs";
import { renderCreditCardList } from "./credit-card-list.mjs";
import { renderCreditCardBenefits } from "./credit-card-benefits.mjs";
import { renderCreditCardFeatures } from "./credit-card-features.mjs";

export function renderCreditCardHomePage(homepage) {
  return renderCreditCardPageShell(homepage, {
    beforePromo: [
      renderCreditCardHero(),
      renderCreditCardTabs(),
      renderCreditCardList(),
      renderCreditCardBenefits(),
      renderCreditCardFeatures(),
    ].join(""),
    markerId: "card-list",
    pageClass: "bca-credit-landing-runtime",
    showEvent: false,
    title: "Kartu Kredit BCA",
    styles: [
      "credit-card-home-page.css",
      "credit-card-hero.css",
      "credit-card-tabs.css",
      "credit-card-list.css",
      "credit-card-benefits.css",
      "credit-card-features.css",
      "credit-card-tutorial.css",
      "credit-card-faq.css",
    ],
  });
}
