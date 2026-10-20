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
    const section = document.getElementById("products");
    if (!section) return;

    const content = [...section.children].find((child) =>
      child.classList.contains("relative") && child.classList.contains("z-10"),
    );
    if (!content) return;
    content.classList.add("bca-product-content");

    const desktopCard = section.querySelector('button[data-blueprint-part="productCard"]');
    desktopCard?.parentElement?.classList.add("bca-product-desktop");

    const originalLink = [...content.querySelectorAll("a")].find((link) =>
      link.getAttribute("href")?.includes("/goodplan-bca"),
    );
    if (originalLink) {
      const originalBlock = [...content.children].find((child) => child.contains(originalLink));
      originalBlock?.classList.add("bca-original-goodplan");
      const followingBlock = originalBlock?.nextElementSibling;
      if (followingBlock?.textContent?.includes("GoodPlan")) {
        followingBlock.classList.add("bca-original-goodplan");
      }

      const banner = document.createElement("div");
      banner.className = "bca-goodplan-banner";
      const title = document.createElement("p");
      title.textContent = "Wujudkan Rencanamu bersama Goodplan BCA";
      const link = document.createElement("a");
      link.href = originalLink.href;
      link.target = originalLink.target;
      link.rel = originalLink.rel;
      link.textContent = "GoodPlan BCA";
      banner.append(title, link);
      content.append(banner);
    }

    const updateImages = () => {
      for (const image of section.querySelectorAll("img[src]")) {
        const replacement = replacements.get(image.getAttribute("src")?.trim());
        if (replacement) image.setAttribute("src", replacement);
      }
    };

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        updateImages();
      });
    });
    observer.observe(section, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    updateImages();
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
