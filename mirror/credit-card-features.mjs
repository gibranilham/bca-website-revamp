const features = [
  {
    key: "apply",
    desktopTitle: "Ajukan Kartu Kredit",
    mobileTitle: "Apply Kartu Kredit",
    description: "Pilih kartu sesuai kebutuhanmu dan daftar secara online.",
  },
  {
    key: "add",
    desktopTitle: "Tambah Kartu",
    mobileTitle: "Apply Tambah Kartu",
    description: "Tambah kartu untuk berbagai kebutuhan dengan limit gabungan.",
  },
  {
    key: "installment",
    desktopTitle: "Ubah transaksi jadi Cicilan",
    description: "Cicilan bunga mulai 0%, tenor hingga 36 bulan.",
  },
  {
    key: "miles",
    desktopTitle: "Tukar Reward BCA jadi miles",
    description: "Konversi rewardmu jadi miles maskapai pilihan.",
  },
  {
    key: "reward",
    desktopTitle: "Cek saldo Reward BCA",
    description: "Pantau poin yang terkumpul dan masa berlakunya.",
  },
  {
    key: "limit",
    desktopTitle: "Request naik limit",
    description: "Naikkan limit kartu kreditmu langsung dari aplikasi.",
  },
  {
    key: "control",
    desktopTitle: "Kontrol Kartu Kredit",
    description: "Blokir dan atur kartu kreditmu kapan saja, di mana saja.",
  },
  {
    key: "contactless",
    desktopTitle: "Atur Limit Contactless",
    description: "Tentukan sendiri batas transaksi contactless tanpa PIN.",
    badge: "Baru",
  },
];

function featureMarkup(feature) {
  const selected = feature.key === "reward";
  return `<li class="cc-feature${selected ? " is-selected" : ""}" role="radio" aria-checked="${selected}" tabindex="${selected ? "0" : "-1"}" data-feature="${feature.key}">
    <img class="cc-feature__icon" src="/assets/kartu-kredit/fitur-${feature.key}.png" width="48" height="48" alt="" loading="lazy" />
    ${feature.badge ? `<span class="cc-feature__badge">${feature.badge}</span>` : ""}
    <h3 class="cc-feature__title"><span class="cc-feature__desktop-title">${feature.desktopTitle}</span>${feature.mobileTitle ? `<span class="cc-feature__mobile-title">${feature.mobileTitle}</span>` : ""}</h3>
    <p class="cc-feature__description">${feature.description}</p>
  </li>`;
}

export function renderCreditCardFeatures() {
  return `<section id="features" class="cc-features" aria-labelledby="cc-features-title">
    <div class="cc-features__inner">
      <div class="cc-features__main">
        <header class="cc-features__heading"><p class="cc-features__eyebrow">Fitur</p><h2 id="cc-features-title">Fitur Lengkap Untuk Setiap Kebutuhan</h2></header>
        <ul class="cc-features__cards" role="radiogroup" aria-label="Fitur kartu kredit BCA">${features.map(featureMarkup).join("")}</ul>
      </div>
      <div class="cc-features__phone"><img src="/assets/kartu-kredit/fitur-phone.png" width="320" height="640" alt="Contoh tampilan Reward BCA di aplikasi myBCA" loading="lazy" /><a href="https://www.bca.co.id/id/Individu/produk/Kartu-Kredit" target="_blank" rel="noopener noreferrer">Baca lebih detail</a></div>
    </div>
  </section>
  <script>
  (() => {
    const cards = [...document.querySelectorAll('#features .cc-feature')];
    const select = (card, focus = false) => {
      cards.forEach((item) => {
        const selected = item === card;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-checked', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      if (focus) card.focus();
    };
    cards.forEach((card, index) => {
      card.addEventListener('click', () => select(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          select(card);
        } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
          event.preventDefault();
          const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
          select(cards[(index + step + cards.length) % cards.length], true);
        }
      });
    });
  })();
  </script>`;
}
