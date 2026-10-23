/* Keep the source accordion behavior; update its photography and GoodPlan presentation. */
(() => {
  const replacements = new Map([
    ["/assets/category/tabungan.webp", "/assets/product/tabungan-figma.jpg"],
    ["/assets/category/kartu-kredit.webp", "/assets/product/kartu-kredit-figma.jpg"],
    ["/assets/category/pinjaman.webp", "/assets/product/pinjaman-figma.jpg"],
    ["/assets/category/ebanking.webp", "/assets/product/ebanking-figma.jpg"],
    ["/assets/category/investasi.webp", "/assets/product/investasi-figma.jpg"],
    ["/assets/category/asuransi.webp", "/assets/product/asuransi-figma.jpg"],
    ["/assets/category/transaksi.webp", "/assets/product/transaksi-figma.jpg"],
  ]);
  const observedPaginationFills = new WeakSet();
  const observedTimerNodes = new WeakSet();
  const animatedCarousels = new WeakSet();

  // The source card uses Next's client router, which bypasses this mirror's local page route.
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest('#products button[data-blueprint-part="productCard"][data-blueprint-label="Kartu Kredit"]');
    if (!card) return;
    const active = card.classList.contains('cursor-none') || card.style.height === '360px';
    if (!active) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign('/kartu-kredit');
  }, true);

  const smoothMobileCarousel = (section) => {
    const carousel = section.querySelector('.hide-scrollbar:has(> button[data-blueprint-part="productCard"])');
    if (!carousel || animatedCarousels.has(carousel)) return;
    animatedCarousels.add(carousel);

    const originalScrollTo = carousel.scrollTo.bind(carousel);
    const duration = 700;
    let frame = 0;
    let animating = false;
    let originalSnap = '';

    const stop = () => {
      if (!animating) return;
      cancelAnimationFrame(frame);
      animating = false;
      carousel.style.scrollSnapType = originalSnap;
    };

    carousel.addEventListener('scroll', (event) => {
      if (animating) event.stopImmediatePropagation();
    }, { capture: true, passive: true });
    carousel.addEventListener('pointerdown', stop, { passive: true });
    carousel.addEventListener('wheel', stop, { passive: true });

    carousel.scrollTo = (options) => {
      if (options?.behavior !== 'smooth' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stop();
        originalScrollTo(options);
        return;
      }

      stop();
      const from = carousel.scrollLeft;
      const to = Math.max(0, Math.min(carousel.scrollWidth - carousel.clientWidth, options.left ?? from));
      if (Math.abs(to - from) < 1) return;

      originalSnap = carousel.style.scrollSnapType;
      carousel.style.scrollSnapType = 'none';
      animating = true;
      const started = performance.now();
      const tick = (now) => {
        const elapsed = Math.min(1, (now - started) / duration);
        const eased = elapsed < 0.5 ? 4 * elapsed ** 3 : 1 - (-2 * elapsed + 2) ** 3 / 2;
        carousel.scrollLeft = from + (to - from) * eased;
        if (elapsed < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }
        stop();
        carousel.dispatchEvent(new Event('scroll'));
      };
      frame = requestAnimationFrame(tick);
    };
  };

  const syncTimer = (section, pagination) => {
    const carousel = section.querySelector('.hide-scrollbar:has(> button[data-blueprint-part="productCard"])');
    if (!carousel) return;

    const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
    const activeRings = [...carousel.querySelectorAll('button[data-blueprint-part="productCard"] > div.opacity-100 circle[stroke-dasharray]')];
    const ring = activeRings.sort((a, b) => {
      const aCard = a.closest('button');
      const bCard = b.closest('button');
      const aDistance = Math.abs(aCard.getBoundingClientRect().left + aCard.clientWidth / 2 - carouselCenter);
      const bDistance = Math.abs(bCard.getBoundingClientRect().left + bCard.clientWidth / 2 - carouselCenter);
      return aDistance - bDistance;
    })[0];
    const circumference = Number.parseFloat(ring?.getAttribute('stroke-dasharray'));
    const offset = Number.parseFloat(ring?.style.strokeDashoffset);
    const progress = Number.isFinite(circumference) && circumference > 0 && Number.isFinite(offset)
      ? Math.max(0, Math.min(1, 1 - offset / circumference))
      : 0;
    pagination.querySelector('.is-active')?.style.setProperty('--bca-product-progress', `${progress * 100}%`);

    for (const node of carousel.querySelectorAll('button[data-blueprint-part="productCard"] > div:has(circle[stroke-dasharray]), button[data-blueprint-part="productCard"] circle[stroke-dasharray]')) {
      if (observedTimerNodes.has(node)) continue;
      observedTimerNodes.add(node);
      new MutationObserver(() => syncTimer(section, pagination)).observe(node, {
        attributes: true,
        attributeFilter: [node.tagName === 'circle' ? 'style' : 'class'],
      });
    }
  };

  const syncPagination = (section) => {
    const host = section.querySelector('.mt-6.flex.justify-center.xl\\:hidden');
    const original = host?.querySelector(':scope > .h-2.w-16');
    const fill = original?.firstElementChild;
    if (!host || !fill) return;

    let pagination = host.querySelector(':scope > .bca-product-pagination');
    if (!pagination) {
      pagination = document.createElement('div');
      pagination.className = 'bca-product-pagination';
      pagination.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 5; i += 1) pagination.append(document.createElement('span'));
      host.append(pagination);
    }

    const progress = Number.parseFloat(fill.style.width) || 100 / 7;
    const item = Math.max(0, Math.min(6, Math.round(progress * 7 / 100) - 1));
    const active = Math.round(item * 4 / 6);
    [...pagination.children].forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      if (index !== active) dot.style.removeProperty('--bca-product-progress');
    });
    syncTimer(section, pagination);

    if (!observedPaginationFills.has(fill)) {
      observedPaginationFills.add(fill);
      new MutationObserver(() => syncPagination(section)).observe(fill, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }
  };

  const start = () => {
    const reconcile = () => {
      const section = document.getElementById("products");
      const content = section?.querySelector(":scope > .relative.z-10");
      if (!section || !content) return;

      smoothMobileCarousel(section);
      syncPagination(section);

      const originalLink = content.querySelector(':scope > div > a[href*="/goodplan-bca"]');
      if (originalLink) {
        const banners = content.querySelectorAll(":scope > .bca-goodplan-banner");
        let banner = banners[0];
        if (!banner) {
          banner = document.createElement("div");
          banner.className = "bca-goodplan-banner";
          const title = document.createElement("p");
          title.textContent = "Wujudkan Rencanamu bersama Goodplan BCA";
          const link = document.createElement("a");
          banner.append(title, link);
          content.append(banner);
        }
        const link = banner.querySelector("a");
        if (link.textContent !== "Eksplore Goodplan") link.textContent = "Eksplore Goodplan";
        link.href = originalLink.href;
        link.target = originalLink.target;
        link.rel = originalLink.rel;
        for (const duplicate of [...banners].slice(1)) duplicate.remove();
      }

      for (const image of section.querySelectorAll("img[src]")) {
        const replacement = replacements.get(image.getAttribute("src")?.trim());
        if (replacement) image.setAttribute("src", replacement);
      }
    };

    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => {
        if (mutation.target instanceof Element && mutation.target.closest("#products")) return true;
        return [...mutation.addedNodes, ...mutation.removedNodes].some((node) =>
          node instanceof Element && (node.id === "products" || node.querySelector("#products")),
        );
      });
      if (!relevant || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        reconcile();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    reconcile();
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
