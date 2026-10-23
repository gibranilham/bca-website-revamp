import { renderCreditCardTutorial } from "./credit-card-tutorial.mjs";
import { renderCreditCardFaq } from "./credit-card-faq.mjs";

export function renderCreditCardPageShell(homepage, { beforePromo, markerId, pageClass, styles, showPromo = true, showEvent = true, title }) {
  const sectionScripts = [];
  const withoutScripts = (markup) => markup.replace(/<script>([\s\S]*?)<\/script>/g, (_, source) => {
    sectionScripts.push(source);
    return "";
  });
  const sections = {
    beforePromo: withoutScripts(beforePromo),
    betweenPromoAndNews: withoutScripts(renderCreditCardTutorial()),
    afterNews: withoutScripts(renderCreditCardFaq()),
  };
  const styleLinks = styles.map((filename) => `<link rel="stylesheet" href="/${filename}"/>`).join("");

  // Keep the source homepage's hydrated navigation, news, and footer nodes.
  const mountScript = `<script>
  (() => {
    function mount() {
      const stack = document.querySelector('#main-content .page-stack');
      const promo = document.getElementById('promo');
      const news = document.getElementById('news-section');
      if (!stack || !promo || !news || document.getElementById(${JSON.stringify(markerId)})) return;
      const removeHomeTabs = () => {
        for (const node of [...stack.children]) {
          if (node.matches('nav:not(.pre-nav):not(.cc-tabs)') && node.textContent.includes('Produk & Layanan')) node.remove();
        }
      };
      removeHomeTabs();
      ${showEvent ? "" : "[...(promo.firstElementChild?.children ?? [])].find((node) => node.querySelector('h2')?.textContent.trim() === 'Momen Seru Setiap Saat')?.remove();"}
      const homeFaq = document.getElementById('faq-section');
      if (homeFaq) homeFaq.id = 'home-faq-section';

      for (const section of [...stack.children]) {
        if (section === promo || section === news || section.matches('nav.pre-nav')) continue;
        if (section.contains(promo) || section.contains(news)) continue;
        section.classList.add('cc-home-inactive');
      }
      promo.insertAdjacentHTML('beforebegin', ${JSON.stringify(sections.beforePromo)});
      news.insertAdjacentHTML('beforebegin', ${JSON.stringify(sections.betweenPromoAndNews)});
      news.insertAdjacentHTML('afterend', ${JSON.stringify(sections.afterNews)});
      ${showPromo ? "" : "promo.classList.add('cc-home-inactive');"}
      document.body.classList.add('bca-credit-home-runtime', ${JSON.stringify(pageClass)});
      document.title = ${JSON.stringify(title)};
      new MutationObserver(removeHomeTabs).observe(stack, { childList: true });
      ${sectionScripts.join("\n")}
      if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
    }
    if (document.readyState === 'complete') mount();
    else window.addEventListener('load', mount, { once: true });
    setTimeout(mount, 300);
    setTimeout(mount, 1200);
  })();
  </script>`;

  return homepage
    .replace("<title>BCA - Senantiasa di Sisi Anda</title>", `<title>${title}</title>`)
    .replace("</head>", `${styleLinks}</head>`)
    .replace("</body>", `${mountScript}</body>`);
}
