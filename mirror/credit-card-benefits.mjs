const benefits = [
  {
    key: "cicilan",
    title: "Cicilan BCA",
    description: "Ubah transaksi jadi Cicilan dengan bunga mulai 0% dan tenor hingga 36 bulan.",
  },
  {
    key: "reward",
    title: "Reward BCA",
    description: "Loyalty point BCA yang didapat dengan transaksi menggunakan Kartu Kredit.",
  },
  {
    key: "autopay",
    title: "AutoPay BCA",
    description: "Solusi pembayaran tagihan rutin. Dibayar otomatis dengan Autodebet dari Kartu Kredit BCA.",
  },
  {
    key: "asuransi-perjalanan",
    title: "Asuransi Perjalanan",
    description: "Selalu aman dari setiap risiko di setiap perjalanan.",
  },
  {
    key: "credit-life",
    title: "Asuransi Credit Life",
    description: "Lindungi diri dan orang terkasih dari risiko tak terduga.",
  },
];
const benefitDetailUrl = "https://www.bca.co.id/id/Individu/produk/Kartu-Kredit";

function benefitMarkup(benefit, index, activeIndex) {
  const active = index === activeIndex;
  return `<button class="cc-benefit${active ? " is-active" : ""}" type="button" data-benefit="${benefit.key}" data-detail-url="${benefitDetailUrl}" aria-expanded="${active}">
    <img src="/assets/kartu-kredit/${benefit.image || `manfaat-${benefit.key}.jpg`}" alt="" loading="lazy" width="460" height="440" />
    <span class="cc-benefit__shade" aria-hidden="true"></span>
    <span class="cc-benefit__panel">
      <span class="cc-benefit__title">${benefit.title}</span>
      ${benefit.description ? `<span class="cc-benefit__description">${benefit.description}</span>` : ""}
    </span>
    <span class="cc-benefit__learn" aria-hidden="true">Pelajari</span>
  </button>`;
}

function staticMobileMarkup(items) {
  return `<div id="cc-detail-benefits-mobile-list" class="cc-detail-benefits__mobile-list" aria-label="Keuntungan kartu kredit">${items.map((benefit, index) => `<article class="cc-detail-benefits__mobile-card" data-benefit="${benefit.key}" ${index >= 3 ? "hidden" : ""}>
    <img src="/assets/kartu-kredit/${benefit.mobileImage || benefit.image || `manfaat-${benefit.key}.jpg`}" alt="" loading="lazy" />
    <div class="cc-detail-benefits__mobile-panel"><span class="cc-detail-benefits__mobile-title">${benefit.title}</span><a class="cc-detail-benefits__mobile-more" href="${benefitDetailUrl}" aria-label="Selengkapnya tentang ${benefit.title}">Selengkapnya <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a></div>
  </article>`).join("")}</div>${items.length > 3 ? '<button class="cc-detail-benefits__expand" type="button" aria-controls="cc-detail-benefits-mobile-list">Lihat Semua Manfaat <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : ""}`;
}

export function renderCreditCardBenefits({ id = "benefits", headingId = "cc-benefits-title", items = benefits, eyebrow = '<span class="cc-benefits__desktop-copy">Manfaat</span><span class="cc-benefits__mobile-copy">Keuntungan</span>', heading = '<span class="cc-benefits__desktop-copy">Manfaat Maksimal untuk semua<br />Kebutuhan kamu</span><span class="cc-benefits__mobile-copy">Apresiasi Terbaik untuk Setiap Momen Berharga</span>', className = "", initialIndex = 1, staticMobile = false } = {}) {
  return `<section id="${id}" class="cc-benefits${className ? ` ${className}` : ""}" aria-labelledby="${headingId}">
    <div class="cc-benefits__inner">
      <div class="cc-benefits__heading">
        <p class="cc-benefits__eyebrow">${eyebrow}</p>
        <h2 id="${headingId}">${heading}</h2>
      </div>
      <div class="cc-benefits__cards" aria-label="Manfaat Kartu Kredit BCA">${items.map((benefit, index) => benefitMarkup(benefit, index, initialIndex)).join("")}</div>
      <div class="cc-benefits__pagination" aria-hidden="true">${items.map((_, index) => `<span class="${index === initialIndex ? "is-active" : ""}"></span>`).join("")}</div>
      ${staticMobile ? staticMobileMarkup(items) : ""}
    </div>
  </section>
  <script>
  (() => {
    const section = document.getElementById(${JSON.stringify(id)});
    const cards = [...section.querySelectorAll('.cc-benefit')];
    const rail = section.querySelector('.cc-benefits__cards');
    const dots = [...section.querySelectorAll('.cc-benefits__pagination span')];
    const mobile = matchMedia('(max-width: 1279px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const staticMobile = matchMedia('(max-width: 767px)');
    let activeIndex = ${initialIndex};
    let visible = false;
    let paused = false;
    let timer = 0;
    let start = performance.now();
    section.querySelector('.cc-detail-benefits__expand')?.addEventListener('click', (event) => {
      section.querySelectorAll('.cc-detail-benefits__mobile-card[hidden]').forEach((card) => { card.hidden = false; });
      event.currentTarget.remove();
    });
    const sync = (index, scroll = false) => {
      activeIndex = index;
      cards.forEach((item) => {
        const active = item === cards[index];
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-expanded', String(active));
      });
      dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
      if (scroll && mobile.matches) rail.scrollTo({ left: cards[index].offsetLeft - rail.offsetLeft - 16, behavior: reduced.matches ? 'instant' : 'smooth' });
      start = performance.now();
    };
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (index === activeIndex) {
          location.assign(card.dataset.detailUrl);
          return;
        }
        sync(index, true);
      });
      card.addEventListener('pointermove', (event) => {
        if (mobile.matches) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--cc-learn-x', (event.clientX - bounds.left) + 'px');
        card.style.setProperty('--cc-learn-y', (event.clientY - bounds.top) + 'px');
      });
    });
    rail.addEventListener('pointerenter', () => { paused = true; });
    rail.addEventListener('pointerleave', () => { paused = false; start = performance.now(); });
    rail.addEventListener('focusin', () => { paused = true; });
    rail.addEventListener('focusout', (event) => { if (!rail.contains(event.relatedTarget)) { paused = false; start = performance.now(); } });
    rail.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    rail.addEventListener('touchend', () => { paused = false; start = performance.now(); }, { passive: true });
    let scrollFrame = 0;
    rail.addEventListener('scroll', () => {
      if (!mobile.matches || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const center = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        const closest = cards.reduce((best, card, index) => {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - center);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        if (closest.index !== activeIndex) sync(closest.index);
      });
    }, { passive: true });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start = performance.now(); }, { threshold: 0.15 }).observe(section);
    document.addEventListener('visibilitychange', () => { start = performance.now(); });
    const tick = (now) => {
      if (visible && !paused && !reduced.matches && !(${staticMobile} && staticMobile.matches)) {
        const progress = Math.min(1, (now - start) / 6000);
        section.style.setProperty('--cc-benefit-progress', (progress * 100) + '%');
        if (progress >= 1) sync((activeIndex + 1) % cards.length, true);
      }
      timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
  })();
  </script>`;
}
