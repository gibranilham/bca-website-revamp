import { createServer } from "node:http";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { renderCreditCardHomePage } from "./credit-card-home-page.mjs";
import { renderCreditCardComparePage } from "./credit-card-compare-page.mjs";
import { renderCreditCardDetailPage } from "./credit-card-detail-page.mjs";
import { getComparedCards } from "./credit-card-data.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceHtml = resolve(root, "docs/research/bca-homepage/source.html");
const port = Number(process.env.PORT || 3001);
const host = process.env.BCA_CLONE_HOST || "127.0.0.1";
const sourceOrigin = "https://bca-homepage-revamp.vercel.app";
const sectionNavigationChunk = "/_next/static/chunks/3608-304218102e3a085a.js";
const originalSectionScroll = "m?m.scrollTo(a,{offset:-56,duration:1})";
const easedSectionScroll = "m?m.scrollTo(a,{offset:-56,duration:.8,easing:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2})";
const sectionNavigationScript = readFileSync(resolve(root, "mirror", "." + sectionNavigationChunk), "utf8");
if (!sectionNavigationScript.includes(originalSectionScroll)) {
  throw new Error("Section navigation scroll handler was not found in the mirrored runtime");
}
const adjustedSectionNavigationScript = sectionNavigationScript.replace(originalSectionScroll, easedSectionScroll);
const navigationBridge = `<script>(function(){document.addEventListener("click",function(event){var target=event.target;if(!(target instanceof Element))return;var anchor=target.closest("a[href]");if(!anchor)return;var url=new URL(anchor.href,location.href);if(url.origin!==location.origin)return;if(url.pathname==="/kartu-kredit"&&location.pathname!=="/kartu-kredit"){event.preventDefault();event.stopImmediatePropagation();location.assign(url.href);return}if(url.pathname==="/"||url.pathname==="/id"||url.pathname==="/kartu-kredit"||url.pathname==="/kartu-kredit/bandingkan"||url.pathname==="/kartu-kredit/krisflyer-visa-signature")return;event.preventDefault();event.stopImmediatePropagation();location.assign(${JSON.stringify(sourceOrigin)}+url.pathname+url.search+url.hash)},true)})();</script>`;
const homepage = readFileSync(sourceHtml, "utf8")
  .replaceAll("http://localhost:3000", `http://localhost:${port}`)
  .replaceAll("/assets/cycle1/hero-image.webp", "/assets/cycle1/hero-figma.jpg")
  .replaceAll("Keluarga BCA", "Pasangan menggunakan layanan BCA")
  .replaceAll("Capai Kebebasan Finansial Lebih Dini bersama BCA", "Wujudkan Impian Masa Depan dengan Tabungan BCA")
  .replace('>Download myBCA</span>', '>Pelajari Tabungan BCA</span>')
  .replace(String.raw`\"cta\":{\"label\":\"Download myBCA\"`, String.raw`\"cta\":{\"label\":\"Pelajari Tabungan BCA\"`)
  .replace("</head>", '<link rel="stylesheet" href="/faq-improvements.css"/><link rel="stylesheet" href="/news-improvements.css"/><link rel="stylesheet" href="/product-improvements.css"/><link rel="stylesheet" href="/soliprio-improvements.css"/><link rel="stylesheet" href="/promo-improvements.css"/><link rel="stylesheet" href="/floating-sidebar-improvements.css"/><link rel="stylesheet" href="/hero-improvements.css"/><link rel="stylesheet" href="/homepage-details.css"/></head>')
  .replace("</body>", `<script src="/faq-improvements.js" defer></script><script src="/news-improvements.js" defer></script><script src="/product-improvements.js" defer></script><script src="/soliprio-improvements.js" defer></script><script src="/hero-improvements.js" defer></script><script src="/floating-sidebar-improvements.js" defer></script>${navigationBridge}</body>`);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function serve(res, filename, fallbackUrl) {
  try {
    const stat = statSync(filename);
    if (!stat.isFile()) throw new Error("Not a file");
    const extension = filename.slice(filename.lastIndexOf("."));
    res.writeHead(200, {
      "Content-Type": types[extension] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-cache",
    });
    createReadStream(filename).pipe(res);
  } catch {
    if (fallbackUrl) res.writeHead(302, { Location: fallbackUrl }).end();
    else res.writeHead(404).end("Not found");
  }
}

export function handleRequest(req, res) {
  let pathname;
  let requestUrl;
  try {
    requestUrl = new URL(req.url || "/", "http://localhost");
    pathname = requestUrl.pathname;
  } catch {
    return res.writeHead(400).end("Bad request");
  }
  if (pathname === "/" || pathname === "/id") {
    return res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": Buffer.byteLength(homepage),
      "Cache-Control": "no-cache",
    }).end(homepage);
  }
  if (pathname === "/kartu-kredit" || pathname === "/kartu-kredit/") {
    const creditCardPage = renderCreditCardHomePage(homepage);
    return res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": Buffer.byteLength(creditCardPage),
      "Cache-Control": "no-cache",
    }).end(creditCardPage);
  }
  if (pathname === "/kartu-kredit/bandingkan" || pathname === "/kartu-kredit/bandingkan/") {
    const selectedCards = getComparedCards(requestUrl.searchParams.get("cards"));
    if (selectedCards.length < 2) return res.writeHead(302, { Location: "/kartu-kredit#card-list" }).end();
    const comparePage = renderCreditCardComparePage(homepage, selectedCards);
    return res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": Buffer.byteLength(comparePage),
      "Cache-Control": "no-cache",
    }).end(comparePage);
  }
  if (pathname === "/kartu-kredit/krisflyer-visa-signature" || pathname === "/kartu-kredit/krisflyer-visa-signature/") {
    const detailPage = renderCreditCardDetailPage(homepage);
    return res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": Buffer.byteLength(detailPage),
      "Cache-Control": "no-cache",
    }).end(detailPage);
  }
  if (["/favicon.ico", "/icon.svg", "/apple-icon.png", "/manifest.webmanifest", "/opengraph-bcacoid.png", "/web-app-192.png", "/web-app-512.png", "/maskable-192.png", "/maskable-512.png"].includes(pathname)) {
    return serve(res, resolve(root, "public", "." + pathname));
  }
  if (["/faq-improvements.css", "/faq-improvements.js", "/news-improvements.css", "/news-improvements.js", "/product-improvements.css", "/product-improvements.js", "/soliprio-improvements.css", "/soliprio-improvements.js", "/promo-improvements.css", "/floating-sidebar-improvements.css", "/floating-sidebar-improvements.js", "/hero-improvements.css", "/hero-improvements.js", "/homepage-details.css", "/credit-card-home-page.css", "/credit-card-hero.css", "/credit-card-tabs.css", "/credit-card-list.css", "/credit-card-benefits.css", "/credit-card-features.css", "/credit-card-tutorial.css", "/credit-card-faq.css", "/credit-card-hero-navigation.css", "/credit-card-compare-hero.css", "/credit-card-compare-table.css", "/credit-card-detail-hero.css", "/credit-card-detail-benefits.css", "/credit-card-detail-miles.css", "/credit-card-detail-banner.css", "/credit-card-detail-information.css"].includes(pathname)) {
    return serve(res, resolve(root, "mirror", "." + pathname));
  }
  if (pathname.startsWith("/_next/static/")) {
    if (pathname === sectionNavigationChunk) {
      return res.writeHead(200, {
        "Content-Type": types[".js"],
        "Content-Length": Buffer.byteLength(adjustedSectionNavigationScript),
        "Cache-Control": "no-cache",
      }).end(adjustedSectionNavigationScript);
    }
    const path = resolve(root, "mirror", "." + pathname);
    if (path.startsWith(resolve(root, "mirror") + sep)) return serve(res, path, sourceOrigin + (req.url || pathname));
  }
  if (pathname.startsWith("/assets/") || pathname.startsWith("/fonts/")) {
    const path = resolve(root, "public", "." + decodeURIComponent(pathname));
    if (path.startsWith(resolve(root, "public") + sep)) return serve(res, path, sourceOrigin + (req.url || pathname));
  }
  res.writeHead(302, { Location: `${sourceOrigin}${req.url || pathname}` }).end();
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  createServer(handleRequest).listen(port, host, () => {
    console.log(`Source runtime mirror running on http://localhost:${port}`);
  });
}
