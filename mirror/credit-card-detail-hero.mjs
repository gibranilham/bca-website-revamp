import { renderCreditCardHeroNavigation } from "./credit-card-hero-navigation.mjs";

const mobileHighlights = [
  ["Rp600.000", "Welcome Bonus"],
  ["Cicilan 0%", "Hingga 12 Bulan"],
  ["Free Admin", "1 Tahun Pertama"],
  ["Rp20Jt", "Limit Maximal"],
];

export function renderCreditCardDetailHero() {
  return `<section class="cc-detail-hero" aria-labelledby="cc-detail-hero-title">
    <div class="cc-detail-hero__inner">
      ${renderCreditCardHeroNavigation("Detail Kartu")}
      <h1 id="cc-detail-hero-title">BCA Singapore Airlines<br class="cc-detail-hero__desktop-break" /> KrisFlyer Visa Signature</h1>
      <p class="cc-detail-hero__desktop-description">Nikmati kemudahan bertransaksi harian dengan fitur cicilan 0% dan cashback yang menguntungkan di setiap gesekan.</p>
      <p class="cc-detail-hero__mobile-description">Faster way to earn KrisFlyer miles</p>
      <div class="cc-detail-hero__highlights" tabindex="0" role="group" aria-label="Keunggulan kartu, geser untuk melihat lebih banyak"><div class="cc-detail-hero__highlight-track">${mobileHighlights.map(([value, label]) => `<div class="cc-detail-hero__highlight"><strong>${value}</strong><span>${label}</span></div>`).join("")}</div><a class="cc-detail-hero__detail" href="#information">Lihat<br />Detail</a></div>
      <div class="cc-detail-hero__actions"><a class="cc-detail-hero__apply" href="https://mybca.bca.co.id/auth/login" target="_blank" rel="noopener noreferrer">Apply di myBCA</a><button class="cc-detail-hero__share" type="button" aria-label="Bagikan detail kartu" title="Bagikan"><img src="/assets/kartu-kredit/detail-share-icon.svg" width="24" height="24" alt="" aria-hidden="true" /></button><span class="cc-detail-hero__share-status" role="status" aria-live="polite"></span></div>
    </div>
  </section>
  <script>
  (() => {
    const button = document.querySelector('.cc-detail-hero__share');
    const status = document.querySelector('.cc-detail-hero__share-status');
    const url = location.href.split('#')[0];
    button.addEventListener('click', async () => {
      try {
        if (navigator.share) await navigator.share({ title: document.title, url });
        else { await navigator.clipboard.writeText(url); status.textContent = 'Tautan tersalin'; }
      } catch (error) {
        if (error.name !== 'AbortError') status.textContent = 'Tautan tidak dapat dibagikan';
      }
      if (status.textContent) setTimeout(() => { status.textContent = ''; }, 3000);
    });
  })();
  </script>`;
}
