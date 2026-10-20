/* Change FAQ labels after hydration without replacing React's buttons or click handlers. */
(() => {
  const updateLabels = () => {
    const faq = document.getElementById("faq-section");
    faq?.querySelectorAll(".text-eyebrow-lg, .text-eyebrow").forEach((label) => {
      if (label.textContent?.trim() === "FREQUENTLY ASKED QUESTION") {
        label.textContent = "Bantuan";
      }
    });

    document.querySelectorAll('button[data-blueprint-label="FAQ"]').forEach((button) => {
      for (const child of button.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.includes("FAQ")) {
          child.textContent = child.textContent.replace(/\bFAQ\b/g, "Bantuan");
        }
      }
    });
  };

  const start = () => {
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        updateLabels();
      });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    updateLabels();
  };

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
