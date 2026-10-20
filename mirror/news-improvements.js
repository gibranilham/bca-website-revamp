/* Keep the source News tab behavior and links while presenting three rows at desktop width. */
(() => {
  const start = () => {
    const section = document.getElementById("news-section");
    if (!section) return;
    const content = section.querySelector(":scope > .relative.z-10");
    content?.classList.add("bca-news-content");
    content?.children[0]?.classList.add("bca-news-heading");
    content?.children[1]?.classList.add("bca-news-tabs");
    content?.children[2]?.classList.add("bca-news-stories");

    const grid = [...section.querySelectorAll("div")].find((element) =>
      element.classList.contains("xl:grid-cols-3"),
    );
    if (!grid) return;

    const wrap = grid.parentElement;
    wrap.classList.add("bca-news-grid-wrap");
    const sourceMobileRail = wrap.querySelector(".snap-x");
    const mobileRail = document.createElement("div");
    mobileRail.className = "bca-news-mobile-rail";
    mobileRail.setAttribute("aria-label", "Artikel kabar dan wawasan");
    sourceMobileRail?.after(mobileRail);
    const left = document.createElement("div");
    left.className = "bca-news-left";
    grid.after(left);

    let lastCards = "";
    const makeMobileCard = (anchor) => {
      const card = document.createElement("a");
      card.className = "bca-news-mobile-card";
      card.href = anchor.href;
      card.target = anchor.target;
      card.rel = anchor.rel;

      const image = document.createElement("img");
      image.src = anchor.querySelector("img")?.getAttribute("src") || "";
      image.alt = "";
      image.loading = "lazy";
      card.append(image);

      const content = document.createElement("span");
      content.className = "bca-news-mobile-content";
      const title = document.createElement("span");
      title.className = "bca-news-mobile-title";
      title.textContent = anchor.querySelector("p[title]")?.textContent || anchor.querySelector(".glass-panel p")?.textContent || "";
      content.append(title);

      const metadata = document.createElement("span");
      metadata.className = "bca-news-mobile-meta";
      const parts = anchor.querySelectorAll(".glass-panel .flex p, .flex.items-center.gap-3 p");
      if (parts.length >= 2) {
        for (const part of [parts[0], parts[1]]) {
          const item = document.createElement("span");
          item.textContent = part.textContent;
          metadata.append(item);
        }
      }
      content.append(metadata);
      card.append(content);
      return card;
    };
    const update = () => {
      const selected = section.querySelector('button[aria-pressed="true"]');
      const tabName = selected?.textContent?.trim();
      if (!tabName) return;

      const buttonLabel = `Semua ${tabName}`;
      for (const link of section.querySelectorAll("a")) {
        if (!/^Semua\s/.test(link.textContent?.trim() || "")) continue;
        const label = link.querySelector("span") || [...link.childNodes].find((node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        if (label && label.textContent !== buttonLabel) label.textContent = buttonLabel;
      }

      const featured = grid.firstElementChild;
      const columns = [...grid.children].slice(1);
      const cards = columns.flatMap((column) => [...column.querySelectorAll(":scope > a")]);
      if (!featured?.matches("a") || cards.length < 4) return;

      const signature = [tabName, featured.getAttribute("href"), cards[0].getAttribute("href"), cards[3].getAttribute("href")].join("|");
      if (signature === lastCards) return;

      const lead = cards[0].cloneNode(true);
      const leadText = featured.querySelectorAll(".glass-panel p");
      const leadTitle = lead.querySelector("p[title]");
      const leadImage = lead.querySelector("img");
      const leadTextParts = lead.querySelectorAll("p");
      const featuredImage = featured.querySelector("img");
      if (!leadTitle || !leadImage || !featuredImage || leadText.length < 3 || leadTextParts.length < 3) return;

      lead.setAttribute("href", featured.getAttribute("href"));
      leadTitle.textContent = leadText[0].textContent;
      leadTitle.title = leadTitle.textContent;
      leadImage.setAttribute("src", featuredImage.getAttribute("src"));
      leadTextParts[1].textContent = leadText[1].textContent;
      leadTextParts[2].textContent = leadText[2].textContent;

      const next = cards[0].cloneNode(true);
      const third = cards[3].cloneNode(true);
      for (const card of [lead, next, third]) {
        card.removeAttribute("data-reveal");
        card.removeAttribute("style");
      }
      left.replaceChildren(lead, next, third);
      const allMobileCards = [featured, ...cards].map(makeMobileCard);
      const mobileColumns = [];
      for (let index = 0; index < allMobileCards.length; index += 3) {
        const column = document.createElement("div");
        column.className = "bca-news-mobile-column";
        column.append(...allMobileCards.slice(index, index + 3));
        mobileColumns.push(column);
      }
      mobileRail.replaceChildren(...mobileColumns);
      lastCards = signature;
    };

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        update();
      });
    });
    observer.observe(section, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["aria-pressed", "href"] });
    update();
  };

  let activeGrid;
  let queued = false;
  const ensureStarted = () => {
    queued = false;
    const grid = document.querySelector('#news-section .xl\\:grid-cols-3');
    if (!grid || (grid === activeGrid && grid.parentElement?.querySelector('.bca-news-mobile-rail'))) return;
    activeGrid = grid;
    start();
  };
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(ensureStarted);
  }).observe(document.documentElement, { childList: true, subtree: true });
  ensureStarted();
})();
