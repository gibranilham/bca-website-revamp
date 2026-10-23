const cards = [
  { key: "pps", name: "BCA Singapore Airlines Visa PPS Club", rate: 5000, image: "krisflyer-visa-infinite.png" },
  { key: "signature", name: "BCA Singapore Airlines Visa KrisFlyer Signature", rate: 15000, image: "krisflyer-visa-signature.png" },
  { key: "infinite", name: "BCA Singapore Airlines Visa KrisFlyer Infinite", rate: 20000, image: "krisflyer-visa-infinite.png" },
];

export function renderCreditCardDetailMiles() {
  return `<section id="miles" class="cc-detail-miles" aria-labelledby="cc-detail-miles-title">
    <div class="cc-detail-miles__inner">
      <div class="cc-detail-miles__heading"><div><p class="cc-detail-miles__eyebrow">Mileage Calculator</p><h2 id="cc-detail-miles-title">Hitung KrisFlyer miles kamu</h2></div><img src="/assets/kartu-kredit/detail-krisflyer-logo.png" width="445" height="86" alt="Singapore Airlines KrisFlyer" loading="lazy" /></div>
      <p class="cc-detail-miles__intro">KrisFlyer Miles adalah reward yang kamu dapatkan dari setiap transaksi menggunakan Kartu Kredit BCA Singapore Airlines KrisFlyer (Visa Signature, Visa Infinite, atau PPS Club Visa Infinite). Miles otomatis masuk ke akun KrisFlyer kamu setiap tanggal cetak tagihan, dan bisa dicek langsung di akun KrisFlyer. Miles yang terkumpul bisa ditukar dengan tiket pesawat, upgrade seat ke kelas lebih tinggi, tambahan bagasi, hingga belanja di KrisShop.</p>
      <p class="cc-detail-miles__mobile-intro"><span id="cc-detail-miles-mobile-copy">KrisFlyer Miles adalah reward yang kamu dapatkan dari setiap transaksi menggunakan Kartu Kredit BCA Singapore...</span> <button type="button" aria-controls="cc-detail-miles-mobile-copy" aria-expanded="false">Baca lebih lengkap</button></p>
      <div class="cc-detail-miles__calculator">
        <div class="cc-detail-miles__form">
          <div class="cc-detail-miles__cards" role="group" aria-label="Pilih jenis kartu">${cards.map((card) => `<button class="cc-detail-miles__card${card.key === "signature" ? " is-selected" : ""}" type="button" data-rate="${card.rate}" aria-pressed="${card.key === "signature"}"><img src="/assets/kartu-kredit/${card.image}" width="64" height="40" alt="" loading="lazy" /><span class="cc-detail-miles__card-text"><span class="cc-detail-miles__card-name">${card.name}</span><span class="cc-detail-miles__card-rate">1 mile / Rp${card.rate.toLocaleString("id-ID")}</span></span></button>`).join("")}</div>
          <label class="cc-detail-miles__label" for="cc-detail-transaction">Nominal Transaksi</label>
          <div class="cc-detail-miles__input-wrap"><span><span class="cc-detail-miles__desktop-currency">Rp</span><span class="cc-detail-miles__mobile-currency">IDR</span></span><input id="cc-detail-transaction" type="text" inputmode="numeric" autocomplete="off" value="1.000.000" aria-describedby="cc-detail-miles-help" /></div>
          <p class="cc-detail-miles__help" id="cc-detail-miles-help">Masukkan nominal transaksi untuk melihat perkiraan miles.</p>
          <div class="cc-detail-miles__quick" role="group" aria-label="Nominal cepat">${[[500000,"Rp500rb"],[1000000,"Rp1jt"],[5000000,"Rp5jt"],[7000000,"Rp7jt"],[10000000,"Rp10jt"]].map(([value,label])=>`<button type="button" data-amount="${value}"${value===1000000?' class="is-selected"':''}>${label}</button>`).join("")}</div>
        </div>
        <aside class="cc-detail-miles__result" aria-live="polite"><p class="cc-detail-miles__result-label">MILES YANG DIPEROLEH</p><div class="cc-detail-miles__number"><strong data-miles-result>66</strong><span class="cc-detail-miles__number-meta"><span>KrisFlyer miles</span><span class="cc-detail-miles__mobile-from">dari transaksi <span data-miles-amount>Rp1.000.000</span></span></span></div><p class="cc-detail-miles__from">dari transaksi <span data-miles-amount>Rp1.000.000</span></p><div class="cc-detail-miles__divider"></div><p class="cc-detail-miles__result-label"><span class="cc-detail-miles__desktop-copy">Reward Terdekat</span><span class="cc-detail-miles__mobile-copy">SETARA DENGAN</span></p><p class="cc-detail-miles__reward" data-miles-progress>~1% menuju tiket Jakarta–Singapura</p><div class="cc-detail-miles__progress"><span data-miles-bar></span></div><p class="cc-detail-miles__hint">Butuh 5.000 miles untuk tiket ekonomi one-way<span class="cc-detail-miles__desktop-copy">*</span></p><a href="https://mybca.bca.co.id/auth/login" target="_blank" rel="noopener noreferrer">Apply di myBCA</a><p class="cc-detail-miles__footnote">*Jumlah miles yang dibutuhkan dapat berubah sewaktu-waktu.</p></aside>
      </div>
    </div>
  </section><script>
  (() => {
    const root = document.getElementById('miles');
    const input = root.querySelector('#cc-detail-transaction');
    const cards = [...root.querySelectorAll('.cc-detail-miles__card')];
    const rail = root.querySelector('.cc-detail-miles__cards');
    const quick = [...root.querySelectorAll('[data-amount]')];
    const mobile = matchMedia('(max-width: 767px)');
    const format = (value) => new Intl.NumberFormat('id-ID').format(value);
    const mobileIntro = root.querySelector('.cc-detail-miles__mobile-intro');
    const introCopy = mobileIntro.querySelector('span');
    const introButton = mobileIntro.querySelector('button');
    const previewCopy = introCopy.textContent;
    introButton.addEventListener('click', () => {
      const expanded = introButton.getAttribute('aria-expanded') !== 'true';
      introCopy.textContent = expanded ? root.querySelector('.cc-detail-miles__intro').textContent : previewCopy;
      introButton.textContent = expanded ? 'Tutup' : 'Baca lebih lengkap';
      introButton.setAttribute('aria-expanded', String(expanded));
    });
    let rate = 15000;
    const revealCard = (card, behavior = 'smooth') => {
      if (!mobile.matches) return;
      const left = card.offsetLeft;
      const right = left + card.clientWidth;
      const visibleLeft = rail.scrollLeft + 16;
      const visibleRight = rail.scrollLeft + rail.clientWidth - 16;
      if (left < visibleLeft) rail.scrollTo({ left: left - 16, behavior });
      else if (right > visibleRight) rail.scrollTo({ left: right - rail.clientWidth + 16, behavior });
    };
    const update = () => {
      const amount = Math.max(0, Number(input.value.replace(/[^0-9]/g, '')) || 0);
      input.value = format(amount);
      const miles = Math.floor(amount / rate);
      const percent = Math.min(100, Math.round(miles / 5000 * 100));
      root.querySelector('[data-miles-result]').textContent = format(miles);
      root.querySelectorAll('[data-miles-amount]').forEach((item) => { item.textContent = 'Rp' + format(amount); });
      root.querySelector('[data-miles-progress]').textContent = '~' + percent + '% menuju tiket Jakarta–Singapura';
      root.querySelector('[data-miles-bar]').style.width = percent + '%';
      quick.forEach((button) => button.classList.toggle('is-selected', Number(button.dataset.amount) === amount));
    };
    input.addEventListener('input', update);
    input.addEventListener('blur', update);
    cards.forEach((card) => card.addEventListener('click', () => {
      rate = Number(card.dataset.rate);
      cards.forEach((item) => { const selected = item === card; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)); });
      update();
      revealCard(card);
    }));
    quick.forEach((button) => button.addEventListener('click', () => { input.value = button.dataset.amount; update(); }));
    update();
  })();
  </script>`;
}
