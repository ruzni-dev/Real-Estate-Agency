import hashlib
import mimetypes
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

root = Path(__file__).resolve().parent.parent
assets_dir = root / "assets" / "images"
assets_dir.mkdir(parents=True, exist_ok=True)

image_exts = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".bmp"}
url_pattern = re.compile(
    r"https?://[^\s\"\')]+?(?:\.(?:jpg|jpeg|png|webp|gif|svg|avif|bmp))(?:\?[^\s\"\')]+)?",
    re.IGNORECASE,
)
css_url_pattern = re.compile(r"url\(\s*[\"']?(https?://[^\"')]+)[\"']?\s*\)", re.IGNORECASE)
js_src_pattern = re.compile(r"this\.src\s*=\s*[\"'](https?://[^\"']+)[\"']", re.IGNORECASE)

class RemoteImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {"src", "data-src", "srcset"} and value:
                for part in value.split(','):
                    url = part.strip().split(' ')[0]
                    if url.lower().startswith('http'):
                        self.urls.add(url)

    def handle_comment(self, data):
        pass

html_files = [f for f in root.rglob("*.html") if ".history" not in str(f)]
css_files = [f for f in root.rglob("*.css") if ".history" not in str(f)]
files = html_files + css_files

remote_urls = set()
for path in html_files:
    text = path.read_text(encoding="utf-8", errors="ignore")
    parser = RemoteImageParser()
    parser.feed(text)
    remote_urls.update(parser.urls)
    remote_urls.update(url_pattern.findall(text))
    remote_urls.update(js_src_pattern.findall(text))

for path in css_files:
    text = path.read_text(encoding="utf-8", errors="ignore")
    remote_urls.update(css_url_pattern.findall(text))
    remote_urls.update(url_pattern.findall(text))

# Only keep URLs that clearly look like image URLs
remote_urls = {
    url for url in remote_urls
    if any(ext in url.lower() for ext in image_exts)
}

if not remote_urls:
    print("No remote image URLs found.")
    raise SystemExit(0)

print(f"Found {len(remote_urls)} unique remote image URLs.")

session = urllib.request.build_opener()
session.addheaders = [
    ("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
]

local_map = {}
for url in sorted(remote_urls):
    parsed = urlparse(url)
    basename = Path(parsed.path).name
    ext = Path(basename).suffix.lower()
    if ext not in image_exts:
        ext = ""
    if not basename:
        basename = "image"
    if not ext:
        basename = Path(basename).stem
    hash_suffix = hashlib.md5(url.encode("utf-8")).hexdigest()[:8]
    filename = f"{basename.split('.')[0]}-{hash_suffix}{ext or '.jpg'}"
    local_path = assets_dir / filename
    if local_path.exists():
        local_map[url] = f"assets/images/{filename}"
        print(f"Already exists: {filename}")
        continue
    try:
        print(f"Downloading: {url}")
        with session.open(url, timeout=30) as response:
            data = response.read()
            content_type = response.headers.get("Content-Type", "")
            if not ext:
                guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
                if guessed:
                    filename = f"{basename}-{hash_suffix}{guessed}"
                    local_path = assets_dir / filename
            with open(local_path, "wb") as out:
                out.write(data)
        local_map[url] = f"assets/images/{filename}"
        print(f"Saved: {filename}")
    except Exception as exc:
        print(f"Failed to download {url}: {exc}")

for path in files:
    original = path.read_text(encoding="utf-8", errors="ignore")
    updated = original
    for url, local in local_map.items():
        if url in updated:
            updated = updated.replace(url, local)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        print(f"Updated references in {path.relative_to(root)}")

print("Done. Local images are saved under assets/images and HTML/CSS references have been updated.")
