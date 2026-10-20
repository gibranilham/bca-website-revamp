/* Present the supplied mobile Solitaire/Prioritas design without changing the desktop section. */
(() => {
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const makeImage = (source, alt, className) => {
    const image = make("img", className);
    image.src = source;
    image.alt = alt;
    image.loading = "lazy";
    return image;
  };

  const cards = [
    {
      tone: "prioritas",
      href: "/prioritas",
      photo: "/assets/soliprio/prioritas-mobile-figma.png",
      logo: "/assets/soliprio/prioritas-logo.svg",
      name: "BCA Prioritas",
      benefits: ["Akses beragam event ternama", "Cek kesehatan eksklusif di rumah sakit premium"],
      action: "Kunjungi BCA Prioritas",
    },
    {
      tone: "solitaire",
      href: "/solitaire",
      photo: "/assets/soliprio/solitaire-mobile-figma.png",
      logo: "/assets/soliprio/solitaire-logo.svg",
      name: "BCA Solitaire",
      benefits: ["Komunitas eksklusif BCA untuk relasi & kolaborasi", "Personal Banker khusus untuk layanan lebih personal"],
      action: "Lihat Lebih Banyak",
    },
  ];

  const makeCard = (details) => {
    const card = make("a", `bca-soliprio-card bca-soliprio-card-${details.tone}`);
    card.href = details.href;
    card.setAttribute("aria-label", `${details.name}: ${details.action}`);
    card.append(makeImage(details.photo, "", "bca-soliprio-card-photo"));

    const panel = make("span", "bca-soliprio-card-panel");
    const info = make("span", "bca-soliprio-card-info");
    info.append(makeImage(details.logo, details.name, "bca-soliprio-card-logo"));
    const benefits = make("ul", "bca-soliprio-benefits");
    for (const benefit of details.benefits) benefits.append(make("li", "", benefit));
    info.append(benefits);
    panel.append(info);
    const action = make("span", "bca-soliprio-card-action", details.action);
    action.append(make("span", "bca-soliprio-card-arrow", "→"));
    panel.append(action);
    card.append(panel);
    return card;
  };

  const start = () => {
    const section = document.getElementById("soliprio");
    const sourceMobile = section?.querySelector(":scope > div.xl\\:hidden");
    if (!section || !sourceMobile || section.querySelector(":scope > .bca-soliprio-mobile")) return;

    const mobile = make("div", "bca-soliprio-mobile");
    const header = make("div", "bca-soliprio-mobile-header");
    const logos = make("div", "bca-soliprio-mobile-logos");
    logos.append(
      makeImage("/assets/soliprio/prioritas-logo.svg", "BCA Prioritas", "bca-soliprio-header-prioritas"),
      makeImage("/assets/soliprio/solitaire-logo.svg", "BCA Solitaire", "bca-soliprio-header-solitaire"),
    );
    header.append(logos, make("h2", "bca-soliprio-mobile-title", "Layanan Prestisius dan Personal, Hanya untuk Anda."));

    const rail = make("div", "bca-soliprio-mobile-rail");
    rail.setAttribute("role", "region");
    rail.setAttribute("aria-label", "Layanan BCA Prioritas dan Solitaire");
    rail.tabIndex = 0;
    rail.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      rail.scrollBy({ left: event.key === "ArrowRight" ? 276 : -276, behavior: "smooth" });
    });
    rail.append(...cards.map(makeCard));
    mobile.append(header, rail);
    sourceMobile.after(mobile);
    section.classList.add("bca-soliprio-ready");
  };

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      start();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
  start();
})();
