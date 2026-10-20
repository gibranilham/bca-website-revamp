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

  const start = () => {
    const reconcile = () => {
      const section = document.getElementById("products");
      const content = section?.querySelector(":scope > .relative.z-10");
      if (!section || !content) return;

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
          link.textContent = "GoodPlan BCA";
          banner.append(title, link);
          content.append(banner);
        }
        const link = banner.querySelector("a");
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
