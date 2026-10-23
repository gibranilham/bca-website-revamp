const desktopQuestions = [
  {
    question: "Bagaimana kalau kartu ATM BCA saya hilang?",
    answer: "Segera amankan kartu melalui kanal resmi BCA atau hubungi Halo BCA. Ikuti petunjuk yang diberikan untuk penggantian kartu.",
  },
  {
    question: "Bagaimana kalau saya lupa PIN ATM kartu kredit BCA?",
    answer: "Lihat panduan PIN Kartu Kredit BCA di kanal resmi BCA atau hubungi Halo BCA untuk mendapatkan bantuan.",
    mobile: true,
  },
  {
    question: "Bagaimana cara blokir kartu ATM BCA?",
    answer: "Gunakan kanal resmi BCA untuk mengamankan kartu. Halo BCA dapat membantu jika Anda memerlukan panduan lebih lanjut.",
  },
  {
    question: "Apa syarat daftar kartu kredit BCA?",
    answer: "Persyaratan dapat berbeda menurut jenis kartu. Periksa informasi pengajuan terbaru pada halaman resmi BCA.",
  },
  {
    question: "Berapa limit tarik tunai kartu kredit?",
    answer: "Limit tarik tunai mengikuti jenis kartu dan ketentuan yang berlaku. Periksa informasi kartu Anda melalui kanal resmi BCA.",
  },
  {
    question: "Apa yang harus dilakukan jika Kartu Kredit BCA hilang atau dicuri?",
    answer: "Segera amankan Kartu Kredit BCA melalui kanal resmi BCA atau hubungi Halo BCA untuk bantuan.",
    mobileOnly: true,
  },
  {
    question: "Bagaimana cara membayar tagihan Kartu Kredit BCA?",
    answer: "Pilihan pembayaran dan langkah terbaru tersedia di kanal resmi BCA. Periksa tagihan Anda sebelum melakukan pembayaran.",
    mobileOnly: true,
  },
];

function questionMarkup({ question, answer, mobile, mobileOnly }, index) {
  const variant = mobileOnly ? " cc-faq__item--mobile-only" : mobile ? " cc-faq__item--both" : " cc-faq__item--desktop-only";
  return `<div class="cc-faq__item${variant}"><button class="cc-faq__trigger" type="button" aria-expanded="false" aria-controls="cc-faq-answer-${index}"><span>${question}</span><svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="cc-faq__answer-shell" id="cc-faq-answer-${index}" aria-hidden="true" inert><div class="cc-faq__answer"><p>${answer}</p></div></div></div>`;
}

export function renderCreditCardFaq() {
  return `<section id="faq-section" class="cc-faq" aria-labelledby="cc-faq-title">
    <div class="cc-faq__inner">
      <header class="cc-faq__heading"><p class="cc-faq__eyebrow">Bantuan</p><h2 id="cc-faq-title">Pertanyaan umum seputar Kartu Kredit BCA</h2></header>
      <div class="cc-faq__panel">
        <div class="cc-faq__questions">${desktopQuestions.map(questionMarkup).join("")}</div>
        <div class="cc-faq__help"><p><span class="cc-faq__desktop-copy">Tidak menemukan jawaban<br />yang Anda cari?</span><span class="cc-faq__mobile-copy">Tidak menemukan yang Anda cari?</span></p><div class="cc-faq__actions"><a class="cc-faq__action cc-faq__action--primary" href="https://www.bca.co.id/id/informasi/edukatips/c/kartu-kredit" target="_blank" rel="noopener noreferrer">Cari di Edukatips</a><a class="cc-faq__action cc-faq__action--secondary" href="https://www.bca.co.id/id/bantuan/pusat-informasi" target="_blank" rel="noopener noreferrer"><span class="cc-faq__desktop-copy">Kunjungi Halo BCA</span><span class="cc-faq__mobile-copy">Halo BCA</span></a></div></div>
      </div>
    </div>
  </section>
  <script>
  (() => {
    const items = [...document.querySelectorAll('#faq-section .cc-faq__item')];
    const setOpen = (item, open) => {
      const trigger = item.querySelector('.cc-faq__trigger');
      const answer = item.querySelector('.cc-faq__answer-shell');
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      answer.setAttribute('aria-hidden', String(!open));
      answer.inert = !open;
    };
    items.forEach((item) => item.querySelector('.cc-faq__trigger').addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, other === item && open));
    }));
  })();
  </script>`;
}
