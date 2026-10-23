const steps = [
  {
    title: "Buka myBCA",
    description: "Klik Ajukan Kartu Kredit, baca manfaat & syarat, pilih jenis Kartu Kredit, lalu verifikasi.",
    image: "/assets/kartu-kredit/tutorial-step-1.png",
  },
  {
    title: "Upload Dokumen",
    description: "Upload foto KTP dan foto NPWP (opsional), pastikan foto tidak terpotong dan data terlihat jelas.",
    image: "/assets/kartu-kredit/tutorial-step-2.png",
  },
  {
    title: "Lengkapi Data Diri",
    description: "Isi data diri, data keluarga yang tidak serumah, data pekerjaan, foto tanda tangan, dan data pelengkap lainnya.",
    image: "/assets/kartu-kredit/tutorial-step-3.png",
  },
  {
    title: "Konfirmasi & Selesai",
    description: "Periksa kembali seluruh data pengajuan, masukkan PIN transaksi, dan pengajuan berhasil dilakukan.",
    image: "/assets/kartu-kredit/tutorial-step-4.png",
  },
];

function stepsMarkup(imageId) {
  return `<ol class="cc-tutorial__steps">${steps.map(({ title, description }, index) => `<li class="${index === 0 ? "is-complete is-current" : ""}"><button class="cc-tutorial__step" type="button" data-step="${index}" aria-controls="${imageId}" ${index === 0 ? 'aria-current="step"' : ""}><span class="cc-tutorial__step-title">${title}</span><span class="cc-tutorial__step-description">${description}</span></button></li>`).join("")}</ol>`;
}

export function renderCreditCardTutorial() {
  return `<section id="tutorial" class="cc-tutorial" aria-labelledby="cc-tutorial-title">
    <div class="cc-tutorial__inner">
      <header class="cc-tutorial__heading"><p class="cc-tutorial__eyebrow">Tutorial</p><h2 id="cc-tutorial-title"><span class="cc-tutorial__desktop-copy">Apply Kartu Kredit di<br />myBCA</span><span class="cc-tutorial__mobile-copy">Apply kartu kredit lebih mudah di myBCA</span></h2><p class="cc-tutorial__intro">Klik Ajukan Kartu Kredit, baca manfaat &amp; syarat, pilih jenis Kartu Kredit, lalu verifikasi.</p></header>
      <div class="cc-tutorial__desktop-layout">
        <aside class="cc-tutorial__download" aria-label="Unduh aplikasi myBCA">
          <h3>Install Aplikasi myBCA</h3>
          <div class="cc-tutorial__download-options">
            <a class="cc-tutorial__qr" href="https://www.bca.co.id/id/Individu/layanan/e-banking/myBCA" target="_blank" rel="noopener noreferrer" aria-label="Halaman unduh aplikasi myBCA"><img src="/assets/kartu-kredit/tutorial-qr.png" width="134" height="134" alt="Kode QR untuk mengunduh myBCA" loading="lazy" /></a>
            <div class="cc-tutorial__stores"><p>Atau download aplikasinya di</p><a href="https://apps.apple.com/id/app/mybca-new-bca-banking-apps/id1440241902" target="_blank" rel="noopener noreferrer" aria-label="Unduh myBCA di App Store"><img src="/assets/kartu-kredit/tutorial-app-store.png" width="90" height="30" alt="Download on the App Store" loading="lazy" /></a><a href="https://play.google.com/store/apps/details?id=com.bca.mybca.omni.android" target="_blank" rel="noopener noreferrer" aria-label="Unduh myBCA di Google Play"><img src="/assets/kartu-kredit/tutorial-google-play.png" width="90" height="30" alt="Get it on Google Play" loading="lazy" /></a></div>
          </div>
          <p class="cc-tutorial__qr-copy">Scan QR Code dengan kamera ponsel untuk mengunduh aplikasi myBCA.</p>
          <div class="cc-tutorial__divider"><span>Atau</span></div>
          <a class="cc-tutorial__web-apply" href="https://www.bca.co.id/id/Individu/produk/Kartu-Kredit" target="_blank" rel="noopener noreferrer">Ajukan Lewat pengajuan</a>
        </aside>
        <div class="cc-tutorial__panel">
          <img id="cc-tutorial-desktop-image" class="cc-tutorial__phone" src="${steps[0].image}" width="280" height="560" alt="Tampilan langkah 1: ${steps[0].title}" loading="lazy" />
          <div class="cc-tutorial__panel-content"><p class="cc-tutorial__panel-eyebrow">Tutorial myBCA</p><h3>Cara Apply Kartu Kredit di myBCA</h3>${stepsMarkup("cc-tutorial-desktop-image")}<a class="cc-tutorial__more" href="https://www.bca.co.id/id/Individu/produk/Kartu-Kredit" target="_blank" rel="noopener noreferrer">Lihat Step Lengkap <span aria-hidden="true">→</span></a></div>
        </div>
      </div>
      <div class="cc-tutorial__mobile-layout">
        <div class="cc-tutorial__mobile-graphic"><img id="cc-tutorial-mobile-image" src="/assets/kartu-kredit/tutorial-mobile-graphic.png" width="343" height="277" alt="Ilustrasi pengajuan kartu kredit di myBCA" loading="lazy" /></div>
        <button class="cc-tutorial__show-steps" type="button" aria-controls="cc-tutorial-mobile-steps" aria-expanded="false">Lihat Tutorial <span aria-hidden="true">⌄</span></button>
        <div class="cc-tutorial__mobile-steps" id="cc-tutorial-mobile-steps" hidden>${stepsMarkup("cc-tutorial-mobile-image")}</div>
        <div class="cc-tutorial__mobile-cta"><h3>Apply Kartu Kredit BCA Sekarang</h3><a class="cc-tutorial__apply-mybca" href="https://mybca.bca.co.id/auth/login" target="_blank" rel="noopener noreferrer">Apply di myBCA</a><div class="cc-tutorial__mobile-or"><span>atau</span></div><a class="cc-tutorial__apply-web" href="https://www.bca.co.id/id/Individu/produk/Kartu-Kredit" target="_blank" rel="noopener noreferrer">Apply di web</a></div>
      </div>
    </div>
  </section>
  <script>
  (() => {
    const tutorial = document.querySelector('.cc-tutorial');
    const button = document.querySelector('.cc-tutorial__show-steps');
    const panel = document.getElementById('cc-tutorial-mobile-steps');
    const mobileImage = document.getElementById('cc-tutorial-mobile-image');
    const summaryImage = '/assets/kartu-kredit/tutorial-mobile-graphic.png';
    const images = ${JSON.stringify(steps.map(({ image, title }, index) => ({ image, alt: `Tampilan langkah ${index + 1}: ${title}` })))};
    let selectedStep = 0;
    tutorial?.querySelectorAll('.cc-tutorial__step').forEach((stepButton) => {
      stepButton.addEventListener('click', () => {
        const selected = Number(stepButton.dataset.step);
        selectedStep = selected;
        tutorial.querySelectorAll('.cc-tutorial__steps').forEach((list) => {
          list.querySelectorAll('li').forEach((item, index) => {
            item.classList.toggle('is-complete', index <= selected);
            item.classList.toggle('is-current', index === selected);
            const control = item.querySelector('.cc-tutorial__step');
            if (index === selected) control.setAttribute('aria-current', 'step');
            else control.removeAttribute('aria-current');
          });
        });
        const desktopImage = document.getElementById('cc-tutorial-desktop-image');
        desktopImage.src = images[selected].image;
        desktopImage.alt = images[selected].alt;
        if (button.getAttribute('aria-expanded') === 'true') {
          mobileImage.src = images[selected].image;
          mobileImage.alt = images[selected].alt;
        }
      });
    });
    button?.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      mobileImage.src = open ? images[selectedStep].image : summaryImage;
      mobileImage.alt = open ? images[selectedStep].alt : 'Ilustrasi pengajuan kartu kredit di myBCA';
    });
  })();
  </script>`;
}
