#!/usr/bin/env python3
"""Download a business's images from its old website and prepare them for the pitch site.

Usage:
  python3 -I fetch_assets.py https://example.cz / /fotogalerie /sluzby --out assets --raw /path/to/scratch/raw

What it does:
  1. Fetches each page (relative to the base URL), collects image URLs from <img src>,
     <a href> pointing at images, and CSS url(...) references.
  2. Downloads them into --raw (a quarantine folder outside the project; treat as untrusted).
  3. Converts photos >= 300 px wide to WebP (max 1600 px wide) plus a 640 px thumbnail
     into --out/photos/, named by the original file name.
  4. Writes contact_sheet.jpg into --raw so you can look at everything at once,
     and pages.txt with the visible text of each page (for facts: prices, hours, contacts).

Nothing is chosen for you: look at the contact sheet and decide which photos to use.
Needs Pillow (pip install pillow).
"""
import argparse, html, os, re, sys, urllib.parse, urllib.request
from html.parser import HTMLParser

try:
    from PIL import Image, ImageDraw, ImageFile, ImageOps
    ImageFile.LOAD_TRUNCATED_IMAGES = True
except ImportError:
    sys.exit("Pillow is required: pip install pillow")

IMG_RE = re.compile(r"\.(jpe?g|png|gif|webp)(\?.*)?$", re.I)
UA = {"User-Agent": "Mozilla/5.0 (compatible; site-preview-builder)"}


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls, self.text, self._skip = [], [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "head"):
            self._skip += 1
        if tag == "img" and a.get("src"):
            self.urls.append(a["src"])
        if tag == "a" and a.get("href") and IMG_RE.search(a["href"]):
            self.urls.append(a["href"])
        if a.get("style"):
            self.urls += re.findall(r"url\(['\"]?([^'\")]+)", a["style"])

    def handle_endtag(self, tag):
        if tag in ("script", "style", "head") and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip and data.strip():
            self.text.append(data.strip())


def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("paths", nargs="*", default=["/"])
    ap.add_argument("--out", default="assets")
    ap.add_argument("--raw", required=True, help="quarantine folder outside the project")
    ap.add_argument("--min-width", type=int, default=300)
    a = ap.parse_args()

    os.makedirs(a.raw, exist_ok=True)
    photos = os.path.join(a.out, "photos")
    os.makedirs(photos, exist_ok=True)

    found, texts = {}, []
    for p in a.paths:
        page = urllib.parse.urljoin(a.base.rstrip("/") + "/", p.lstrip("/"))
        try:
            body = get(page).decode("utf-8", "ignore")
        except Exception as e:  # keep going: one broken page shouldn't stop the run
            print(f"! page failed {page}: {e}")
            continue
        c = Collector()
        c.feed(body)
        body_css = re.findall(r"url\(['\"]?([^'\")]+\.(?:jpe?g|png|gif|webp))", body, re.I)
        for u in c.urls + body_css:
            full = urllib.parse.urljoin(page, html.unescape(u))
            if IMG_RE.search(urllib.parse.urlparse(full).path) and "thumb" not in full.lower():
                found.setdefault(full, page)
        texts.append(f"===== {page}\n" + "\n".join(c.text))
    with open(os.path.join(a.raw, "pages.txt"), "w", encoding="utf-8") as f:
        f.write("\n\n".join(texts))

    saved = []
    for url in found:
        name = re.sub(r"[^A-Za-z0-9._-]+", "_", urllib.parse.urlparse(url).path.strip("/")) or "image"
        dest = os.path.join(a.raw, name)
        try:
            with open(dest, "wb") as f:
                f.write(get(url))
            saved.append(dest)
        except Exception as e:
            print(f"! image failed {url}: {e}")

    converted, sheet_items = [], []
    for path in saved:
        try:
            im = ImageOps.exif_transpose(Image.open(path))
        except Exception:
            print(f"! not an image: {path}")
            continue
        sheet_items.append((path, im.copy()))
        if im.width < a.min_width:
            continue  # logos, icons, buttons: inspect manually
        stem = os.path.splitext(os.path.basename(path))[0]
        rgb = im.convert("RGB")
        full = rgb.copy(); full.thumbnail((1600, 1600))
        full.save(os.path.join(photos, f"{stem}.webp"), "WEBP", quality=80, method=6)
        th = rgb.copy(); th.thumbnail((640, 640))
        th.save(os.path.join(photos, f"{stem}-thumb.webp"), "WEBP", quality=74, method=6)
        converted.append((stem, im.size))

    if sheet_items:
        W, S = 6, 260
        rows = (len(sheet_items) + W - 1) // W
        sheet = Image.new("RGB", (W * S, rows * (S + 22)), "white")
        d = ImageDraw.Draw(sheet)
        for i, (p, im) in enumerate(sheet_items):
            t = im.convert("RGB"); t.thumbnail((S - 6, S - 6))
            x, y = (i % W) * S, (i // W) * (S + 22)
            sheet.paste(t, (x + 3, y + 3))
            d.text((x + 3, y + S), f"{os.path.basename(p)[:38]} {im.width}x{im.height}", fill="black")
        sheet.save(os.path.join(a.raw, "contact_sheet.jpg"), quality=80)

    print(f"pages: {len(texts)}  images found: {len(found)}  downloaded: {len(saved)}  converted: {len(converted)}")
    for stem, size in converted:
        print(f"  {stem}  {size[0]}x{size[1]}")
    print(f"contact sheet: {os.path.join(a.raw, 'contact_sheet.jpg')}")
    print(f"page text:     {os.path.join(a.raw, 'pages.txt')}")


if __name__ == "__main__":
    main()
