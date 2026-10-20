import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const html = readFileSync(resolve(root, "docs/research/bca-homepage/source.html"), "utf8");
const required = new Set();

for (const match of html.matchAll(/\b(?:src|href|srcSet)="([^"]+)"/g)) {
  for (const value of match[1].split(",")) {
    const path = value.trim().split(/\s+/)[0]?.split("?")[0];
    if (path?.startsWith("/_next/static/") || path?.startsWith("/assets/")) {
      required.add(path);
    }
  }
}

const dynamicRuntime = [
  "bd904a5c.10be586aecc0f5bb.js",
  "4524.1b3c951cfa91911d.js",
  "e919c1aa.f3f35edf688e7415.js",
  "ca4dcb09.bf1b3c8cacc81245.js",
  "b536a0f1.8b595286ca688dfc.js",
];
for (const filename of dynamicRuntime) required.add(`/_next/static/chunks/${filename}`);
required.add("/_next/static/css/f42b54daaa2f47d9.css");
for (const filename of ["favicon.ico", "icon.svg", "apple-icon.png", "manifest.webmanifest", "opengraph-bcacoid.png", "web-app-192.png", "web-app-512.png", "maskable-192.png", "maskable-512.png"]) {
  required.add(`/${filename}`);
}

const missing = [];
for (const url of required) {
  const filename = resolve(root, url.startsWith("/_next/static/") ? `mirror${url}` : `public${decodeURIComponent(url)}`);
  if (!existsSync(filename) || !statSync(filename).isFile() || statSync(filename).size === 0) missing.push(url);
}

if (missing.length) {
  console.error(`Missing ${missing.length} source files:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`Verified homepage HTML and ${required.size} referenced static files.`);
