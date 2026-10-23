import { creditCards } from "./credit-card-data.mjs";

const groups = [
  {
    id: "keuntungan",
    desktopTitle: "Keuntungan",
    mobileTitle: "Manfaat",
    rows: [
      ["Reward BCA", "1% transaksi di tiket.com; 0,5% transaksi merchant lainnya. Mulai 1 Mei 2026 terdapat skema 0,4% untuk transaksi merchant Blibli."],
      ["Bonus Awal", "1% transaksi di tiket.com; 0,5% transaksi merchant lainnya."],
      ["Travel Point / Miles", "Mulai 1 Mei 2026 terdapat skema 0,4% untuk transaksi merchant Blibli."],
    ],
  },
  {
    id: "fitur-utama",
    desktopTitle: "Fitur Utama",
    mobileTitle: "Fitur Utama",
    features: ["AutoPay BCA", "Reward BCA", "Kontrol Kartu Kredit", "Cicilan BCA", "Asuransi Perjalanan", "Asuransi Credit Life", "BCA Travel Services", "Contactless"],
  },
  {
    id: "biaya",
    desktopTitle: "Biaya",
    mobileTitle: "Biaya",
    rows: [
      ["Annual Fee", "Rp125.000/Tahun"],
      ["Denda Keterlambatan", "1% dari jumlah tagihan maksimum Rp100.000,-**"],
      ["Biaya Pergantian Kartu", "Rp50.000."],
    ],
  },
  {
    id: "syarat-pengajuan",
    desktopTitle: "Syarat Pengajuan",
    mobileTitle: "Syarat Pengajuan",
    rows: [
      ["Usia", "Minimal 21 tahun"],
      ["Pendapatan Minimum", "Minimum pendapatan per bulan Rp3 juta (BUMN/PNS) atau Rp5 juta (swasta)."],
    ],
  },
  {
    id: "limit",
    desktopTitle: "Limit",
    mobileTitle: "Limit",
    rows: [
      ["Minimum limit kartu utama", "Rp3.000.000"],
      ["Limit EDC", "Sesuai kartu yang tersedia"],
      ["Minimum limit kartu tambahan", "Rp1.000.000"],
    ],
  },
  {
    id: "suku-bunga",
    desktopTitle: "Suku Bunga & Pembayaran",
    mobileTitle: "Suku Bunga & Pembayaran",
    rows: [
      ["Suku bunga belanja", "1,75% per bulan"],
      ["Suku bunga tarik tunai", "1,75% per bulan"],
    ],
  },
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

function slotMarkup(card, index) {
  const options = creditCards.map((item) => '<option value="' + item.id + '"' + (card?.id === item.id ? ' selected' : '') + '>' + escapeHtml(item.name) + '</option>').join("");
  const title = card ? escapeHtml(card.name) : "Pilih kartu";
  return '<div class="cc-compare__card" data-slot="' + index + '">' +
    '<label class="cc-compare__select-label" for="cc-compare-select-' + index + '">' + (card ? "Ganti kartu" : "Pilih kartu") + '</label>' +
    '<div class="cc-compare__select-wrap">' +
    '<select id="cc-compare-select-' + index + '" class="cc-compare__select" aria-label="' + (card ? "Ganti " + title : "Pilih kartu ketiga") + '">' +
    (index === 2 ? '<option value=""' + (card ? '' : ' selected') + '>Pilih kartu</option>' : '') + options + '</select>' +
    '<span class="cc-compare__select-value" aria-hidden="true">' + title + '</span></div>' +
    '<div class="cc-compare__details">' +
    '<div class="cc-compare__card-visual' + (card ? '' : ' is-empty') + '">' +
    '<img src="' + (card ? "/assets/kartu-kredit/" + card.image : "") + '" alt="' + (card ? "Desain " + title : "") + '"' + (card ? '' : ' hidden') + '/>' +
    '<span class="cc-compare__card-placeholder"' + (card ? ' hidden' : '') + '>Pilih kartu untuk dibandingkan</span></div>' +
    '<a class="cc-compare__apply" href="https://mybca.bca.co.id/auth/login" target="_blank" rel="noopener noreferrer"' + (card ? '' : ' aria-disabled="true" tabindex="-1"') + '>Apply di myBCA</a>' +
    '</div></div>';
}

function rowMarkup(group, row, rowIndex, selectedCards) {
  const feature = Boolean(group.features);
  const title = feature ? row : row[0];
  const value = feature ? "" : row[1];
  const cells = Array.from({ length: 3 }, (_, index) => {
    const card = selectedCards[index];
    if (!card) return '<div class="cc-compare__cell is-empty" aria-hidden="true"></div>';
    if (feature) {
      const available = (card.id + rowIndex) % 3 !== 0;
      return '<div class="cc-compare__cell cc-compare__cell--feature"><span class="cc-compare__feature-icon" aria-hidden="true">' + (available ? "✓" : "×") + '</span><span>' + escapeHtml(title) + '</span></div>';
    }
    return '<div class="cc-compare__cell"><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(value) + '</p></div>';
  }).join("");
  return '<div class="cc-compare__row">' + cells + '</div>';
}

function groupMarkup(group, selectedCards) {
  const rows = group.features || group.rows;
  return '<section id="cc-compare-' + group.id + '" class="cc-compare__group" aria-labelledby="cc-compare-heading-' + group.id + '">' +
    '<h2 id="cc-compare-heading-' + group.id + '"><span class="cc-compare__desktop-label">' + escapeHtml(group.desktopTitle) + '</span><span class="cc-compare__mobile-label">' + escapeHtml(group.mobileTitle) + '</span></h2>' +
    rows.map((row, index) => rowMarkup(group, row, index, selectedCards)).join("") + '</section>';
}

function comparisonClient(catalog, comparisonGroups) {
  const section = document.getElementById("compare-table");
  if (!section) return;
  const slots = [...section.querySelectorAll(".cc-compare__card")];
  const selects = slots.map((slot) => slot.querySelector("select"));
  const tabs = [...section.querySelectorAll(".cc-compare__tab")];
  const tabStrip = section.querySelector(".cc-compare__tabs");
  const groups = [...section.querySelectorAll(".cc-compare__group")];
  const status = section.querySelector(".cc-compare__status");
  const mobile = matchMedia("(max-width: 767px)");
  const narrowMobile = matchMedia("(max-width: 374px)");
  const tablet = matchMedia("(min-width: 768px) and (max-width: 1279px)");
  const primaryNavs = [...document.querySelectorAll('#main-content nav[aria-label="Navigasi utama"].pre-nav')];
  const findCard = (id) => catalog.find((card) => String(card.id) === String(id));
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const easeInOutCubic = (value) => value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  let collapsed = false;
  let visibleTabId = null;
  let horizontalFrame = 0;
  let verticalFrame = 0;

  function animateTabStrip(left) {
    const destination = Math.max(0, Math.min(tabStrip.scrollWidth - tabStrip.clientWidth, left));
    cancelAnimationFrame(horizontalFrame);
    if (reducedMotion.matches) {
      tabStrip.scrollLeft = destination;
      return;
    }
    const start = tabStrip.scrollLeft;
    const distance = destination - start;
    if (Math.abs(distance) < 1) return;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 480);
      tabStrip.scrollLeft = start + distance * easeInOutCubic(progress);
      if (progress < 1) horizontalFrame = requestAnimationFrame(tick);
    };
    horizontalFrame = requestAnimationFrame(tick);
  }

  function animateToGroup(target) {
    cancelAnimationFrame(verticalFrame);
    const destination = () => target.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
    if (reducedMotion.matches) {
      window.scrollTo(0, destination());
      return;
    }
    const start = scrollY;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / 800);
      window.scrollTo(0, start + (destination() - start) * easeInOutCubic(progress));
      if (progress < 1) verticalFrame = requestAnimationFrame(tick);
    };
    verticalFrame = requestAnimationFrame(tick);
  }

  function updateColumn(index) {
    const card = findCard(selects[index].value);
    groups.forEach((group, groupIndex) => {
      const data = comparisonGroups[groupIndex];
      const rows = data.features || data.rows;
      group.querySelectorAll(".cc-compare__row").forEach((rowElement, rowIndex) => {
        const cell = rowElement.children[index];
        const row = rows[rowIndex];
        cell.replaceChildren();
        cell.className = "cc-compare__cell";
        if (!card) {
          cell.classList.add("is-empty");
          cell.setAttribute("aria-hidden", "true");
          return;
        }
        cell.removeAttribute("aria-hidden");
        if (data.features) {
          cell.classList.add("cc-compare__cell--feature");
          const icon = document.createElement("span");
          icon.className = "cc-compare__feature-icon";
          icon.setAttribute("aria-hidden", "true");
          icon.textContent = (card.id + rowIndex) % 3 !== 0 ? "✓" : "×";
          const label = document.createElement("span");
          label.textContent = row;
          cell.append(icon, label);
        } else {
          const heading = document.createElement("h3");
          const value = document.createElement("p");
          heading.textContent = row[0];
          value.textContent = row[1];
          cell.append(heading, value);
        }
      });
    });
  }

  function updateUrl() {
    const ids = selects.map((select) => select.value).filter(Boolean);
    history.replaceState(history.state, "", "/kartu-kredit/bandingkan?cards=" + ids.join(","));
  }

  function syncSlots(changedIndex = null) {
    if (mobile.matches && selects[2].value) {
      selects[2].value = "";
      changedIndex = 2;
      updateUrl();
    }
    const values = selects.map((select) => select.value).filter(Boolean);
    slots.forEach((slot, index) => {
      const card = findCard(selects[index].value);
      const visual = slot.querySelector(".cc-compare__card-visual");
      const image = visual.querySelector("img");
      const placeholder = visual.querySelector(".cc-compare__card-placeholder");
      const apply = slot.querySelector(".cc-compare__apply");
      slot.querySelector(".cc-compare__select-value").textContent = card ? card.name : "Pilih kartu";
      visual.classList.toggle("is-empty", !card);
      image.hidden = !card;
      image.src = card ? "/assets/kartu-kredit/" + card.image : "";
      image.alt = card ? "Desain " + card.name : "";
      placeholder.hidden = Boolean(card);
      apply.setAttribute("aria-disabled", String(!card));
      apply.tabIndex = card && !collapsed ? 0 : -1;
      apply.setAttribute("aria-hidden", String(!card || collapsed));
      selects[index].setAttribute("aria-label", card ? "Ganti " + card.name : "Pilih kartu ketiga");
      for (const option of selects[index].options) {
        if (option.value) option.disabled = values.includes(option.value) && option.value !== selects[index].value;
      }
      if (changedIndex === null || changedIndex === index) updateColumn(index);
    });
  }

  selects.forEach((select, index) => {
    let previous = select.value;
    select.addEventListener("change", () => {
      const value = select.value;
      if (value && selects.some((other, otherIndex) => otherIndex !== index && other.value === value)) {
        select.value = previous;
        return;
      }
      previous = value;
      syncSlots(index);
      updateUrl();
      status.textContent = value ? findCard(value).name + " ditampilkan pada perbandingan." : "Kolom ketiga dikosongkan.";
    });
  });

  const updateSticky = () => {
    const activeNav = primaryNavs.find((nav) => getComputedStyle(nav).display !== "none");
    const navHeight = activeNav?.getBoundingClientRect().height || (mobile.matches ? 56 : 72);
    const navVisible = activeNav && !activeNav.classList.contains("-translate-y-full") && activeNav.dataset.hidden !== "true";
    const offset = navVisible ? navHeight : (mobile.matches ? 0 : navHeight / 2);
    const bounds = section.getBoundingClientRect();
    const travel = mobile.matches ? 180 : 220;
    const startLead = mobile.matches ? 24 : 32;
    const progress = Math.max(0, Math.min(1, (offset + startLead - bounds.top) / travel));
    const selectHeight = narrowMobile.matches ? 54 : 44;
    const cardsHeight = mobile.matches ? 194 + selectHeight - progress * 170 : tablet.matches ? 320 - progress * 222 : 404 - progress * 306;
    const wasCollapsed = collapsed;
    collapsed = progress >= 0.999;
    section.style.setProperty("--cc-sticky-top", offset.toFixed(2) + "px");
    section.style.setProperty("--cc-group-scroll-margin", (offset + (mobile.matches ? 24 + selectHeight + 48 : 98 + 52) + 8).toFixed(2) + "px");
    section.style.setProperty("--cc-select-height", selectHeight + "px");
    section.style.setProperty("--cc-cards-height", cardsHeight.toFixed(2) + "px");
    section.style.setProperty("--cc-detail-shift", (progress * (mobile.matches ? -166 : tablet.matches ? -220 : -300)).toFixed(2) + "px");
    section.style.setProperty("--cc-detail-opacity", (1 - progress).toFixed(3));
    section.style.setProperty("--cc-card-pad-top", (mobile.matches ? 12 : 24).toFixed(2) + "px");
    section.style.setProperty("--cc-card-pad-bottom", (mobile.matches ? 16 : 24 - progress * 6).toFixed(2) + "px");
    section.style.setProperty("--cc-pin-shift", (navHeight - bounds.top - window.scrollY).toFixed(2) + "px");
    section.classList.toggle("is-sticking", bounds.top <= offset + 1 && bounds.bottom > offset + cardsHeight + (mobile.matches ? 48 : 52));
    section.classList.toggle("is-scrolled", collapsed);
    if (wasCollapsed !== collapsed) {
      slots.forEach((slot, index) => {
        const apply = slot.querySelector(".cc-compare__apply");
        const hidden = collapsed || !selects[index].value;
        apply.tabIndex = hidden ? -1 : 0;
        apply.setAttribute("aria-hidden", String(hidden));
      });
    }
    let active = groups[0];
    for (const group of groups) {
      if (group.getBoundingClientRect().top <= offset + (mobile.matches ? 152 : 190)) active = group;
    }
    tabs.forEach((tab) => {
      const selected = tab.dataset.target === active.id;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-current", selected ? "true" : "false");
    });
    if (active.id !== visibleTabId) {
      visibleTabId = active.id;
      const activeTab = tabs.find((tab) => tab.dataset.target === active.id);
      if (activeTab && tabStrip.scrollWidth > tabStrip.clientWidth) {
        const stripBounds = tabStrip.getBoundingClientRect();
        const tabBounds = activeTab.getBoundingClientRect();
        const left = tabStrip.scrollLeft + tabBounds.left - stripBounds.left - (tabStrip.clientWidth - tabBounds.width) / 2;
        animateTabStrip(left);
      }
    }
  };
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const target = document.getElementById(tab.dataset.target);
    if (target) animateToGroup(target);
  }));
  window.addEventListener("wheel", () => cancelAnimationFrame(verticalFrame), { passive: true });
  window.addEventListener("touchstart", () => cancelAnimationFrame(verticalFrame), { passive: true });
  mobile.addEventListener("change", () => syncSlots());
  mobile.addEventListener("change", updateSticky);
  tablet.addEventListener("change", updateSticky);
  const navObserver = new MutationObserver(updateSticky);
  primaryNavs.forEach((nav) => navObserver.observe(nav, { attributes: true, attributeFilter: ["class", "data-hidden"] }));
  let pending = false;
  window.addEventListener("scroll", () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; updateSticky(); });
  }, { passive: true });
  window.addEventListener("resize", () => {
    visibleTabId = null;
    updateSticky();
  });
  syncSlots();
  updateSticky();
}

export function renderCreditCardCompareTable(selectedCards) {
  const slots = Array.from({ length: 3 }, (_, index) => slotMarkup(selectedCards[index], index)).join("");
  const tabs = groups.map((group, index) => '<button type="button" class="cc-compare__tab' + (index === 0 ? ' is-active' : '') + '" data-target="cc-compare-' + group.id + '" aria-current="' + (index === 0 ? 'true' : 'false') + '"><span class="cc-compare__desktop-label">' + escapeHtml(group.desktopTitle) + '</span><span class="cc-compare__mobile-label">' + escapeHtml(group.mobileTitle) + '</span></button>').join("");
  const script = '(' + comparisonClient.toString() + ')(' + JSON.stringify(creditCards).replace(/</g, "\\u003c") + ',' + JSON.stringify(groups).replace(/</g, "\\u003c") + ');';
  return '<section id="compare-table" class="cc-compare" aria-label="Perbandingan kartu kredit"><div class="cc-compare__hero-pin" aria-hidden="true"></div><div class="cc-compare__inner">' +
    '<div class="cc-compare__sticky"><div class="cc-compare__cards">' + slots + '</div><nav class="cc-compare__tabs" aria-label="Bagian perbandingan">' + tabs + '</nav></div>' +
    '<div class="cc-compare__body">' + groups.map((group) => groupMarkup(group, selectedCards)).join("") + '</div><p class="cc-compare__status" aria-live="polite"></p></div></section><script>' + script + '</script>';
}
