"""Fetch public homepage assets referenced by source HTML, CSS, and runtime."""

import html
import re
from pathlib import Path
from urllib.parse import unquote, urljoin
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "https://bca-homepage-revamp.vercel.app"
REFERENCES = [ROOT / "docs/research/bca-homepage/source.html"]
REFERENCES += list((ROOT / "mirror/_next/static/css").glob("*.css"))
REFERENCES += list((ROOT / "mirror/_next/static/chunks").rglob("*.js"))
HOMEPAGE_PREFIXES = (
    "/assets/category/",
    "/assets/cycle1/",
    "/assets/footer/",
    "/assets/kartu-kredit/",
    "/assets/navbar/",
    "/assets/prioritas/kurs/flags/",
    "/assets/product/",
    "/assets/promo-page/",
    "/assets/promo/",
    "/assets/quick-action/",
)
PATTERN = re.compile(r"/assets/[A-Za-z0-9_/%=+.\-]+?\.(?:svg|webp|png|jpg|jpeg)")

paths = set()
for reference in REFERENCES:
    text = html.unescape(reference.read_text(errors="ignore"))
    paths.update(path for path in PATTERN.findall(text) if path.startswith(HOMEPAGE_PREFIXES))

failed = []
absent_at_source = []
for path in sorted(paths):
    target = ROOT / "public" / unquote(path).lstrip("/")
    if target.exists() and target.stat().st_size:
        continue
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        url = urljoin(SOURCE, path)
        for _ in range(3):
            request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            try:
                with urlopen(request, timeout=20) as response:
                    target.write_bytes(response.read())
                break
            except HTTPError as exc:
                if exc.code in (301, 302, 307, 308) and exc.headers.get("Location"):
                    url = urljoin(url, exc.headers["Location"])
                    continue
                raise
        else:
            raise RuntimeError("Too many redirects")
        print(path, target.stat().st_size)
    except HTTPError as exc:
        if exc.code == 404:
            absent_at_source.append(path)
        else:
            failed.append((path, str(exc)))
    except Exception as exc:
        failed.append((path, str(exc)))

print(f"Homepage paths: {len(paths)}, absent at source: {len(absent_at_source)}, failed: {len(failed)}")
for path, reason in failed:
    print(f"FAILED {path}: {reason}")
if failed:
    raise SystemExit(1)
