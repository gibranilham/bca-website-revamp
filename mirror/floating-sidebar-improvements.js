/* Add the mobile product sheet heading after the mirrored page has hydrated. */
(() => {
  const reconcile = () => {
    const sheet = document.querySelector('[role="dialog"][aria-label="Produk"] > section');
    if (!sheet || sheet.querySelector(':scope > .bca-product-sheet-header')) return;

    const header = document.createElement('header');
    header.className = 'bca-product-sheet-header';
    const title = document.createElement('h2');
    title.textContent = 'Informasi Produk';
    header.append(title);
    sheet.prepend(header);
  };

  const start = () => {
    reconcile();
    new MutationObserver((mutations) => {
      if (mutations.some(({ addedNodes }) => [...addedNodes].some((node) =>
        node instanceof Element && (node.matches('[role="dialog"][aria-label="Produk"]') || node.querySelector('[role="dialog"][aria-label="Produk"]')),
      ))) reconcile();
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
