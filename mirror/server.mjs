import { createServer } from "node:http";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceHtml = resolve(root, "docs/research/bca-homepage/source.html");
const port = Number(process.env.PORT || 3001);
const host = process.env.BCA_CLONE_HOST || "127.0.0.1";
const sourceOrigin = "https://bca-homepage-revamp.vercel.app";
const navigationBridge = `<script>(function(){document.addEventListener("click",function(event){var target=event.target;if(!(target instanceof Element))return;var anchor=target.closest("a[href]");if(!anchor)return;var url=new URL(anchor.href,location.href);if(url.origin!==location.origin||url.pathname==="/"||url.pathname==="/id")return;event.preventDefault();event.stopImmediatePropagation();location.assign(${JSON.stringify(sourceOrigin)}+url.pathname+url.search+url.hash)},true)})();</script>`;
const homepage = readFileSync(sourceHtml, "utf8")
  .replaceAll("http://localhost:3000", `http://localhost:${port}`)
  .replace("</head>", '<link rel="stylesheet" href="/faq-improvements.css"/><link rel="stylesheet" href="/news-improvements.css"/><link rel="stylesheet" href="/product-improvements.css"/></head>')
  .replace("</body>", `<script src="/faq-improvements.js" defer></script><script src="/news-improvements.js" defer></script><script src="/product-improvements.js" defer></script>${navigationBridge}</body>`);
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

createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url || "/", "http://localhost").pathname;
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
  if (["/favicon.ico", "/icon.svg", "/apple-icon.png", "/manifest.webmanifest", "/opengraph-bcacoid.png", "/web-app-192.png", "/web-app-512.png", "/maskable-192.png", "/maskable-512.png"].includes(pathname)) {
    return serve(res, resolve(root, "public", "." + pathname));
  }
  if (["/faq-improvements.css", "/faq-improvements.js", "/news-improvements.css", "/news-improvements.js", "/product-improvements.css", "/product-improvements.js"].includes(pathname)) {
    return serve(res, resolve(root, "mirror", "." + pathname));
  }
  if (pathname.startsWith("/_next/static/")) {
    const path = resolve(root, "mirror", "." + pathname);
    if (path.startsWith(resolve(root, "mirror") + sep)) return serve(res, path, sourceOrigin + (req.url || pathname));
  }
  if (pathname.startsWith("/assets/") || pathname.startsWith("/fonts/")) {
    const path = resolve(root, "public", "." + decodeURIComponent(pathname));
    if (path.startsWith(resolve(root, "public") + sep)) return serve(res, path, sourceOrigin + (req.url || pathname));
  }
  res.writeHead(302, { Location: `${sourceOrigin}${req.url || pathname}` }).end();
}).listen(port, host, () => {
  console.log(`Source runtime mirror running on http://localhost:${port}`);
});
