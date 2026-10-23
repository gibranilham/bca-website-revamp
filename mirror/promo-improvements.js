(() => {
  // The source snapshot has no end dates for these two offers. These short
  // durations are display copy for the prototype, as requested.
  const promotions = [
    { path: "/promo/xiang-fu-hai-vasa", label: "Khusus untukmu", deadline: "Sisa 5 jam lagi" },
    { path: "/promo/bakmi-gm-payday", label: "Paling Disukai", deadline: "Sisa 20 jam lagi" },
    { path: "/promo/grand-outlet-karawang", label: "Promo Spesial" },
    { path: "/promo/hummingbird-bandung" },
    { path: "/promo/firepot-malang" },
    { path: "/promo/fukumaru-japanese-restaurant" },
    { path: "/promo/emilia-caffe-italiano" },
  ];
  const details = new Map(promotions.map((promo, order) => [promo.path, { ...promo, order }]));
  const reconcile = () => {
    // Next may replace the server-rendered section while hydrating. Always
    // work from the section currently attached to the document.
    const section = document.getElementById("promo");
    if (!section) return;
    const tracks = new Map();
    for (const card of section.querySelectorAll('a[href^="/promo/"]')) {
      const promo = details.get(card.getAttribute("href"));
      if (!promo) continue;
      const item = card.parentElement?.classList.contains("snap-center") ? card.parentElement : card;
      const track = item.parentElement;
      if (track) {
        if (!tracks.has(track)) tracks.set(track, []);
        tracks.get(track).push({ item, order: promo.order });
      }

      if (promo.label && card.dataset.promoLabel !== promo.label) card.dataset.promoLabel = promo.label;
      const date = [...card.querySelectorAll("span")].find((span) =>
        /^(?:Promo Berakhir|Hingga |Sisa )/.test(span.textContent.trim()),
      );
      if (date && promo.deadline && date.textContent !== promo.deadline) date.textContent = promo.deadline;
    }

    for (const [track, items] of tracks) {
      const groupSize = promotions.length;
      items.forEach(({ item, order }, index) => {
        const visualOrder = Math.floor(index / groupSize) * groupSize + order;
        if (item.style.order !== String(visualOrder)) item.style.order = String(visualOrder);
      });
      const showMore = track.querySelector(':scope > a[href="/promo"]');
      if (showMore && showMore.style.order !== String(items.length)) {
        showMore.style.order = String(items.length);
      }
    }
  };

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      reconcile();
    });
  });
  // Observe the document instead of the original section node so the promo
  // updates are reapplied after Next replaces that node during hydration.
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  reconcile();
})();
