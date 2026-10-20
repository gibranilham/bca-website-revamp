/* Keep the source News tab behavior and links while presenting three rows at desktop width. */
(() => {
  const start = () => {
    const section = document.getElementById("news-section");
    if (!section) return;

    const grid = [...section.querySelectorAll("div")].find((element) =>
      element.classList.contains("xl:grid-cols-3"),
    );
    if (!grid) return;

    const wrap = grid.parentElement;
    wrap.classList.add("bca-news-grid-wrap");
    const left = document.createElement("div");
    left.className = "bca-news-left";
    grid.after(left);

    let lastCards = "";
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

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
