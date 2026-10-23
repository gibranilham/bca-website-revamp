const tabs = [
  { id: "fees", label: "Biaya", headings: ["Jenis Biaya", "Kartu Utama", "Kartu Tambahan"], rows: [
    ["Annual Fee", "Rp125.000", "Rp125.000"], ["Denda Keterlambatan", "1% dari total tagihan dan tidak melebihi Rp100.000.", "1% dari total tagihan dan tidak melebihi Rp100.000."],
    ["Permintaan ringkasan transaksi 1 tahun berjalan", "Rp100.000", "Rp100.000"], ["Permintaan Copy Faktur", "Rp30.000", "Rp30.000"],
    ["Biaya Pergantian Kartu", "Rp125.000", "Rp125.000"], ["Permintaan cetak dan pengiriman tagihan", "Rp10.000", "Rp10.000"],
    ["Biaya overlimit", "Rp40.000", "Rp40.000"], ["Biaya Cash Advance (domestik dan luar negeri)", "4% dari nominal tarikan atau minimum Rp40.000 (mana yang lebih besar).", "4% dari nominal tarikan atau minimum Rp40.000 (mana yang lebih besar)."],
    ["Administrasi Cash Advance di counter", "Rp20.000 (per transaksi)", "Rp20.000 (per transaksi)"], ["Pembatalan cicilan/angsuran", "Rp100.000", "Rp100.000"], ["Biaya meterai", "Rp100.000", "Rp100.000"],
  ] },
  { id: "limit", label: "Limit, Suku bunga & Resiko", headings: ["Jenis Informasi", "Kartu Utama", "Kartu Tambahan"], rows: [
    ["Limit kredit minimum", "Sesuai hasil analisis", "Sesuai hasil analisis"], ["Limit transaksi contact", "Sesuai limit tersedia", "Sesuai limit tersedia"],
    ["Limit contactless dengan PIN", "Sesuai limit tersedia", "Sesuai limit tersedia"], ["Suku bunga pembelanjaan", "Sesuai ketentuan", "Sesuai ketentuan"],
    ["Suku bunga penarikan tunai", "Sesuai ketentuan", "Sesuai ketentuan"], ["Risiko keterlambatan", "Dapat dikenakan biaya", "Dapat dikenakan biaya"],
  ] },
  { id: "simulation", label: "Simulasi", headings: ["Tanggal Posting", "Keterangan", "Jumlah"], rows: [
    ["1 Maret", "Tagihan sebelumnya", "Rp0"], ["3 Maret", "Transaksi 1", "Rp1.250.000"],
    ["7 Maret", "Transaksi 2", "Rp1.500.000"], ["17 Maret", "Pembayaran", "-Rp500.000"],
    ["1 April", "Total tagihan contoh", "Rp2.250.000"], ["17 April", "Tanggal jatuh tempo", "—"],
  ] },
  { id: "requirements", label: "Persyaratan & Tata Cara", headings: ["Dokumen", "Karyawan", "Pengusaha", "Profesional"], rows: [
    ["Kartu identitas", "Diperlukan", "Diperlukan", "Diperlukan"], ["Bukti penghasilan", "Diperlukan", "Diperlukan", "Diperlukan"],
    ["Rekening koran", "Opsional", "Diperlukan", "Opsional"], ["Dokumen usaha", "—", "Diperlukan", "—"],
    ["Izin praktik", "—", "—", "Jika berlaku"],
  ] },
  { id: "additional", label: "Informasi Tambahan", headings: ["Jenis Transaksi", "Keterangan", "Sarana"], rows: [
    ["Transaksi domestik", "Transaksi di Indonesia", "myBCA dan BCA mobile"], ["Transaksi internasional", "Transaksi di luar negeri", "myBCA dan BCA mobile"],
    ["Transaksi e-commerce", "Transaksi online", "myBCA dan BCA mobile"], ["Pengaturan transaksi", "Aktifkan atau nonaktifkan sesuai kebutuhan", "myBCA"],
  ] },
  { id: "summary", label: "Ringkasan Produk", headings: ["Informasi", "Uraian"], rows: [
    ["Jenis produk", "Kartu kredit BCA Singapore Airlines KrisFlyer Visa Signature"], ["Manfaat", "Kumpulkan KrisFlyer miles dari transaksi pilihan"],
    ["Pengajuan", "Tersedia melalui kanal pengajuan resmi BCA"], ["Informasi lengkap", "Lihat syarat dan ketentuan yang berlaku"],
  ] },
];

function tableMarkup(tab) {
  return `<div class="cc-detail-info__table-scroll"><table style="--cc-detail-value-columns:${tab.headings.length - 1}"><thead><tr>${tab.headings.map((heading) => `<th scope="col">${heading}</th>`).join("")}</tr></thead><tbody>${tab.rows.map((row) => `<tr>${row.map((value, index) => index === 0 ? `<th scope="row">${value}</th>` : `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

export function renderCreditCardDetailInformation() {
  return `<section id="information" class="cc-detail-info" aria-labelledby="cc-detail-info-title"><div class="cc-detail-info__inner"><h2 id="cc-detail-info-title">Informasi Lainnya</h2><div class="cc-detail-info__tabs" role="tablist" aria-label="Informasi kartu kredit">${tabs.map((tab, index) => `<button type="button" role="tab" class="cc-detail-info__tab${index === 0 ? " is-active" : ""}" id="cc-detail-tab-${tab.id}" aria-controls="cc-detail-panel-${tab.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}">${tab.label}</button>`).join("")}</div>${tabs.map((tab, index) => `<div class="cc-detail-info__panel" role="tabpanel" id="cc-detail-panel-${tab.id}" aria-labelledby="cc-detail-tab-${tab.id}"${index === 0 ? "" : " hidden"}>${tableMarkup(tab)}</div>`).join("")}</div></section><script>
  (() => {
    const root = document.getElementById('information');
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"]')];
    const activate = (index, focus = false) => {
      tabs.forEach((tab, i) => { const active = i === index; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; panels[i].hidden = !active; });
      if (focus) { tabs[index].focus(); tabs[index].scrollIntoView({block:'nearest',inline:'center'}); }
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
        event.preventDefault();
        activate(event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length, true);
      });
    });
  })();
  </script>`;
}
