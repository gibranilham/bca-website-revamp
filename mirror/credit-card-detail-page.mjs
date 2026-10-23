import { renderCreditCardPageShell } from "./credit-card-page-shell.mjs";
import { renderCreditCardTabs } from "./credit-card-tabs.mjs";
import { renderCreditCardFeatures } from "./credit-card-features.mjs";
import { renderCreditCardDetailHero } from "./credit-card-detail-hero.mjs";
import { renderCreditCardDetailBenefits } from "./credit-card-detail-benefits.mjs";
import { renderCreditCardDetailMiles } from "./credit-card-detail-miles.mjs";
import { renderCreditCardDetailBanner } from "./credit-card-detail-banner.mjs";
import { renderCreditCardDetailInformation } from "./credit-card-detail-information.mjs";

const detailSections = [
  ["detail-benefits", "Keuntungan", "Keuntungan"],
  ["features", "Fitur", "Fitur"],
  ["miles", "Hitung Miles", "Hitung Miles"],
  ["information", "Info lainnya", "Info lainnya"],
  ["promo", "Promo", "Promo"],
  ["tutorial", "Tutorial", "Tutorial"],
  ["news-section", "Berita", "Berita"],
  ["faq-section", "Bantuan", "Bantuan"],
];

export function renderCreditCardDetailPage(homepage) {
  return renderCreditCardPageShell(homepage, {
    beforePromo: [
      renderCreditCardDetailHero(),
      renderCreditCardTabs(detailSections),
      renderCreditCardDetailBenefits(),
      renderCreditCardFeatures(),
      renderCreditCardDetailMiles(),
      renderCreditCardDetailBanner(),
      renderCreditCardDetailInformation(),
    ].join(""),
    markerId: "detail-benefits",
    pageClass: "bca-credit-detail-runtime",
    showEvent: false,
    title: "BCA Singapore Airlines KrisFlyer Visa Signature",
    styles: [
      "credit-card-home-page.css",
      "credit-card-tabs.css",
      "credit-card-hero-navigation.css",
      "credit-card-detail-hero.css",
      "credit-card-benefits.css",
      "credit-card-detail-benefits.css",
      "credit-card-detail-miles.css",
      "credit-card-detail-banner.css",
      "credit-card-detail-information.css",
      "credit-card-features.css",
      "credit-card-tutorial.css",
      "credit-card-faq.css",
    ],
  });
}
