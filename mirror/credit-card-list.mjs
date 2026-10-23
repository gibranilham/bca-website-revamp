import { creditCards } from "./credit-card-data.mjs";

function cardMarkup(card, index) {
  const name = card.name;
  return `<article class="cc-card" data-card-id="${card.id}" data-category="${card.category}"${index >= 8 ? " hidden" : ""}>
    ${card.id === 1 ? '<a class="cc-card__surface-link" href="/kartu-kredit/krisflyer-visa-signature" tabindex="-1" aria-hidden="true"></a>' : ""}
    <div class="cc-card__top">
      <div class="cc-card__image-wrap"><img class="cc-card__image" src="/assets/kartu-kredit/${card.image}" alt="Desain ${name}" width="200" height="126" loading="${index < 3 ? "eager" : "lazy"}" />${card.badge ? `<span class="cc-card__badge">${card.badge}</span>` : ""}</div>
      <div class="cc-card__identity"><h3>${name}</h3><span class="cc-card__badge-mobile${card.badge ? "" : " is-empty"}">${card.badge || "&nbsp;"}</span></div>
    </div>
    <div class="cc-card__information">
      <ul><li>Bonus poin untuk transaksi pilihan</li><li>Promo spesial sesuai kebutuhan</li><li>Pengajuan praktis di myBCA</li></ul>
      <a class="cc-card__detail" href="${card.id === 1 ? "/kartu-kredit/krisflyer-visa-signature" : "https://www.bca.co.id/id/Individu/produk/Kartu-Kredit"}"${card.id === 1 ? "" : ' target="_blank" rel="noopener noreferrer"'} aria-label="Lihat detail ${name}">Lihat Detail</a>
    </div>
    <div class="cc-card__footer"><label class="cc-card__compare"><input class="cc-card__compare-input" type="checkbox" aria-label="Bandingkan ${name}" /><span class="cc-card__compare-box" aria-hidden="true"><svg viewBox="0 0 16 16" width="12" height="12" fill="none"><path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>Bandingkan</span></label><a class="cc-card__apply" href="https://mybca.bca.co.id/auth/login" target="_blank" rel="noopener noreferrer" aria-label="Apply ${name} di myBCA">Apply Kartu</a></div>
  </article>`;
}

export function renderCreditCardList() {
  return `<section id="card-list" class="cc-list" aria-labelledby="cc-list-title">
    <div class="cc-list__inner">
      <div class="cc-list__header"><div><p class="cc-list__eyebrow">Pilihan Kartu</p><h2 id="cc-list-title">Temukan Kartu Yang Sesuai<br class="cc-list__desktop-break"> Dengan Kebutuhanmu</h2></div>
        <div class="cc-list__filters" role="group" aria-label="Filter kartu kredit">
          <button type="button" class="is-selected" data-card-filter="all" aria-pressed="true">Semua</button>
          <button type="button" data-card-filter="lifestyle" aria-pressed="false">Lifestyle</button>
          <button type="button" data-card-filter="travel" aria-pressed="false">Travel</button>
          <button type="button" data-card-filter="reward" aria-pressed="false">Reward BCA</button>
        </div>
      </div>
      <div id="card-grid" class="cc-list__grid">${creditCards.map(cardMarkup).join("")}</div>
      <button class="cc-list__show-all" type="button" aria-controls="card-grid" aria-expanded="false"><span class="cc-list__show-all-desktop">Lihat Semua</span><span class="cc-list__show-all-mobile">Lihat 13 kartu lainnya</span><svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
  </section>
  <script>
  (() => {
    const section = document.getElementById('card-list');
    const cards = [...section.querySelectorAll('.cc-card')];
    const grid = section.querySelector('#card-grid');
    const filters = [...section.querySelectorAll('[data-card-filter]')];
    const showAll = section.querySelector('.cc-list__show-all');
    let category = 'all';
    let expanded = false;
    const mobile = matchMedia('(max-width: 767px)');
    const comparisonMobile = matchMedia('(max-width: 1279px)');
    const sheet = document.createElement('dialog');
    sheet.className = 'cc-card-sheet';
    sheet.setAttribute('aria-labelledby', 'cc-card-sheet-title');
    sheet.innerHTML = '<div class="cc-card-sheet__header"><h2 id="cc-card-sheet-title">Daftar Kartu</h2><button type="button" class="cc-card-sheet__close" aria-label="Tutup daftar kartu">&times;</button></div><div id="cc-card-sheet-list" class="cc-card-sheet__list"></div>';
    document.body.append(sheet);
    const sheetList = sheet.querySelector('.cc-card-sheet__list');
    let previousBodyOverflow = '';
    const selected = new Set();
    const comparison = document.createElement('aside');
    comparison.className = 'cc-comparison';
    comparison.setAttribute('aria-live', 'polite');
    comparison.setAttribute('aria-label', 'Bandingkan kartu kredit');
    comparison.hidden = true;
    document.body.append(comparison);
    let comparisonMode = 'expanded';
    let showTimer;
    let reopenTimer;
    let scrollOrigin = window.scrollY;

    const maxSelected = () => comparisonMobile.matches ? 2 : 3;
    const selectedCards = () => cards.filter((card) => selected.has(card.dataset.cardId));
    const chevron = (up = false) => '<svg class="cc-comparison__chevron' + (up ? ' is-up' : '') + '" viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function scheduleReopen() {
      clearTimeout(reopenTimer);
      if (selected.size && comparisonMode === 'minimized') {
        reopenTimer = setTimeout(() => setMode('expanded'), 5000);
      }
    }

    function setMode(mode) {
      if (!selected.size) return;
      comparisonMode = mode;
      scrollOrigin = window.scrollY;
      renderComparison();
      scheduleReopen();
    }

    function hideComparison() {
      clearTimeout(showTimer);
      clearTimeout(reopenTimer);
      comparison.hidden = true;
      comparisonMode = 'expanded';
    }

    function renderComparison() {
      if (!selected.size) return hideComparison();
      const chosen = selectedCards();
      const limit = maxSelected();
      const enough = chosen.length >= 2;
      const selectedMarkup = chosen.map((card) => {
        const name = card.querySelector('h3').textContent;
        const image = card.querySelector('.cc-card__image');
        return '<div class="cc-comparison__slot cc-comparison__slot--selected"><img src="' + image.getAttribute('src') + '" alt=""/><span class="cc-comparison__name">' + name + '</span><button type="button" class="cc-comparison__remove" data-remove-card="' + card.dataset.cardId + '" aria-label="Hapus ' + name + ' dari perbandingan">&times;</button></div>';
      }).join('');
      const emptyMarkup = Array.from({ length: Math.max(limit - chosen.length, 0) }, () => '<div class="cc-comparison__slot cc-comparison__slot--empty"><span class="cc-comparison__plus" aria-hidden="true">+</span><span class="cc-comparison__empty-label">Pilih kartu</span></div>').join('');
      const thumbnails = chosen.map((card) => '<img src="' + card.querySelector('.cc-card__image').getAttribute('src') + '" alt=""/>').join('');
      comparison.dataset.mode = comparisonMode;
      comparison.innerHTML = comparisonMobile.matches
        ? '<div class="cc-comparison__mobile-expanded"><div class="cc-comparison__mobile-header"><div class="cc-comparison__mobile-heading"><h3>Bandingkan Kartu</h3><span>(' + chosen.length + ' dari ' + limit + ')</span></div><button type="button" class="cc-comparison__mode" data-compare-mode="minimized" aria-label="Minimize widget bandingkan">' + chevron() + '</button></div><div class="cc-comparison__slots">' + selectedMarkup + emptyMarkup + '</div><div class="cc-comparison__mobile-footer"><button type="button" class="cc-comparison__clear" data-clear-comparison>Hapus semua</button><button type="button" class="cc-comparison__cta" data-comparison-cta ' + (enough ? '' : 'disabled') + '>Bandingkan ' + chosen.length + ' Kartu</button></div></div><div class="cc-comparison__mobile-collapsed"><div class="cc-comparison__mobile-heading"><h3>Bandingkan Kartu</h3><span>(' + chosen.length + ' dari ' + limit + ')</span></div><div class="cc-comparison__mobile-actions"><button type="button" class="cc-comparison__cta" data-comparison-cta>Bandingkan</button><button type="button" class="cc-comparison__mode cc-comparison__mode--expand" data-compare-mode="expanded" aria-label="Buka widget bandingkan">' + chevron(true) + '</button></div></div>'
        : comparisonMode === 'expanded'
        ? '<div class="cc-comparison__content"><div class="cc-comparison__header"><div><h3>Bandingkan Kartu</h3><p>' + chosen.length + ' dari maksimal ' + limit + ' kartu</p></div><button type="button" class="cc-comparison__mode" data-compare-mode="minimized" aria-label="Minimize widget bandingkan">Minimize ' + chevron() + '</button></div><div class="cc-comparison__slots">' + selectedMarkup + emptyMarkup + '</div><div class="cc-comparison__footer"><button type="button" class="cc-comparison__clear" data-clear-comparison>Hapus semua</button><button type="button" class="cc-comparison__cta" data-comparison-cta ' + (enough ? '' : 'disabled') + '>' + (enough ? 'Bandingkan ' + chosen.length + ' Kartu' : 'Pilih minimal 1 kartu lagi') + '</button></div></div>'
        : '<div class="cc-comparison__compact"><div class="cc-comparison__thumbnails">' + thumbnails + '</div><span class="cc-comparison__selected-count">' + chosen.length + ' kartu dipilih</span><button type="button" class="cc-comparison__cta" data-comparison-cta ' + (enough ? '' : 'disabled') + '>' + (enough ? 'Bandingkan' : 'Pilih 1 kartu lagi') + '</button><button type="button" class="cc-comparison__mode cc-comparison__mode--expand" data-compare-mode="expanded" aria-label="Buka widget bandingkan">' + chevron(true) + '</button></div>';
      comparison.hidden = false;
      comparison.querySelectorAll('[data-remove-card]').forEach((button) => button.addEventListener('click', () => changeSelection(button.dataset.removeCard, false)));
      comparison.querySelector('[data-clear-comparison]')?.addEventListener('click', () => {
        selected.clear();
        syncCheckboxes();
        hideComparison();
      });
      comparison.querySelectorAll('[data-compare-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.compareMode)));
      comparison.querySelectorAll('[data-comparison-cta]').forEach((button) => button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (enough) location.assign('/kartu-kredit/bandingkan?cards=' + chosen.map((card) => card.dataset.cardId).join(','));
        else if (comparisonMobile.matches && comparisonMode === 'minimized') setMode('expanded');
      }));
    }

    function syncCheckboxes() {
      cards.forEach((card) => {
        const input = card.querySelector('.cc-card__compare-input');
        input.checked = selected.has(card.dataset.cardId);
        input.disabled = !input.checked && selected.size >= maxSelected();
        card.classList.toggle('is-compared', input.checked);
      });
    }

    function changeSelection(id, checked) {
      if (checked && selected.size >= maxSelected() && !selected.has(id)) return;
      checked ? selected.add(id) : selected.delete(id);
      syncCheckboxes();
      if (!selected.size) return hideComparison();
      if (comparison.hidden) {
        comparisonMode = 'expanded';
        comparison.dataset.phase = 'entering';
        renderComparison();
        showTimer = setTimeout(() => { comparison.dataset.phase = 'open'; }, 20);
      } else {
        if (checked && comparisonMode === 'minimized') comparisonMode = 'expanded';
        renderComparison();
      }
      scrollOrigin = window.scrollY;
      scheduleReopen();
    }

    cards.forEach((card) => card.querySelector('.cc-card__compare-input').addEventListener('change', (event) => changeSelection(card.dataset.cardId, event.target.checked)));
    comparison.addEventListener('click', (event) => {
      if (comparisonMode === 'minimized' && !event.target.closest('button')) setMode('expanded');
    });
    comparison.addEventListener('pointerdown', scheduleReopen);
    comparison.addEventListener('focusin', scheduleReopen);
    window.addEventListener('scroll', () => {
      if (!selected.size || comparison.hidden) return;
      if (comparisonMode === 'expanded' && Math.abs(window.scrollY - scrollOrigin) >= 160) setMode('minimized');
      else if (comparisonMode === 'minimized') scheduleReopen();
    }, { passive: true });

    function update() {
      const matches = cards.filter((card) => category === 'all' || card.dataset.category === category);
      const limit = mobile.matches ? 3 : expanded ? matches.length : 8;
      cards.forEach((card) => {
        const index = matches.indexOf(card);
        card.hidden = index < 0 || index >= limit;
      });
      const remaining = Math.max(matches.length - limit, 0);
      showAll.hidden = remaining === 0;
      showAll.setAttribute('aria-controls', mobile.matches ? 'cc-card-sheet-list' : 'card-grid');
      showAll.setAttribute('aria-expanded', String(sheet.open || (!mobile.matches && expanded)));
      section.classList.toggle('is-expanded', !mobile.matches && expanded);
      section.querySelector('.cc-list__show-all-mobile').textContent = 'Lihat ' + remaining + ' kartu lainnya';
    }

    function restoreSheetCards() {
      cards.forEach((card) => grid.append(card));
      document.body.append(comparison);
      document.body.style.overflow = previousBodyOverflow;
      update();
      showAll.focus({ preventScroll: true });
    }

    function openSheet() {
      const matches = cards.filter((card) => category === 'all' || card.dataset.category === category);
      const remaining = matches.slice(3);
      if (!remaining.length) return;
      remaining.forEach((card) => {
        card.hidden = false;
        sheetList.append(card);
      });
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      sheet.append(comparison);
      sheet.showModal();
      showAll.setAttribute('aria-expanded', 'true');
      sheet.querySelector('.cc-card-sheet__close').focus();
    }

    sheet.querySelector('.cc-card-sheet__close').addEventListener('click', () => sheet.close());
    sheet.addEventListener('click', (event) => { if (event.target === sheet) sheet.close(); });
    sheet.addEventListener('close', restoreSheetCards);

    filters.forEach((filter) => filter.addEventListener('click', () => {
      category = filter.dataset.cardFilter;
      expanded = false;
      filters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle('is-selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      update();
    }));
    showAll.addEventListener('click', () => {
      if (mobile.matches) openSheet();
      else { expanded = true; update(); }
    });
    mobile.addEventListener('change', () => {
      if (sheet.open) sheet.close();
      expanded = false;
      while (selected.size > maxSelected()) selected.delete([...selected].at(-1));
      syncCheckboxes();
      if (selected.size) renderComparison();
      else hideComparison();
      update();
    });
    comparisonMobile.addEventListener('change', () => {
      while (selected.size > maxSelected()) selected.delete([...selected].at(-1));
      syncCheckboxes();
      if (selected.size) renderComparison();
      else hideComparison();
    });
    update();
  })();
  </script>`;
}
