"""Fetch public, hashed Next.js runtime files referenced by the captured homepage."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "https://bca-homepage-revamp.vercel.app"
HTML = ROOT / "docs/research/bca-homepage/source.html"
OUTPUT = ROOT / "mirror"


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        path = values.get("src") if tag == "script" else values.get("href")
        if path and path.startswith("/_next/static/"):
            self.paths.add(path)


parser = References()
parser.feed(HTML.read_text())
parser.paths.update({
    "/_next/static/chunks/bd904a5c.10be586aecc0f5bb.js",
    "/_next/static/chunks/4524.1b3c951cfa91911d.js",
    "/_next/static/chunks/e919c1aa.f3f35edf688e7415.js",
    "/_next/static/chunks/ca4dcb09.bf1b3c8cacc81245.js",
    "/_next/static/chunks/b536a0f1.8b595286ca688dfc.js",
    "/_next/static/css/f42b54daaa2f47d9.css",
})
for path in sorted(parser.paths):
    target = OUTPUT / path.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.stat().st_size:
        continue
    request = Request(urljoin(SOURCE, path), headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request, timeout=20) as response:
        target.write_bytes(response.read())
    print(path, target.stat().st_size)

print(f"Fetched {len(parser.paths)} runtime files")
