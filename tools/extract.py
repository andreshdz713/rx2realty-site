#!/usr/bin/env python3
"""Unpack a Claude Artifact bundled HTML into a deployable static site."""
import base64
import gzip
import json
import mimetypes
import os
import re
import sys
from pathlib import Path

SRC = Path(__file__).parent / "Rx2Realty.html"
OUT = Path(__file__).parent / "site"
ASSETS = OUT / "assets"

MIME_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
    "image/x-icon": ".ico",
    "image/vnd.microsoft.icon": ".ico",
    "font/woff": ".woff",
    "font/woff2": ".woff2",
    "font/ttf": ".ttf",
    "font/otf": ".otf",
    "application/font-woff": ".woff",
    "application/font-woff2": ".woff2",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "application/pdf": ".pdf",
    "application/json": ".json",
    "text/plain": ".txt",
    "text/css": ".css",
    "text/javascript": ".js",
    "application/javascript": ".js",
}


def ext_for(mime: str) -> str:
    if mime in MIME_EXT:
        return MIME_EXT[mime]
    guess = mimetypes.guess_extension(mime or "") or ".bin"
    return guess


def extract_script(html: str, type_attr: str) -> str:
    """Extract the text content of <script type="..."> ... </script>."""
    pattern = re.compile(
        r'<script\s+type="' + re.escape(type_attr) + r'">(.*?)</script>',
        re.DOTALL,
    )
    m = pattern.search(html)
    if not m:
        raise RuntimeError(f"missing <script type=\"{type_attr}\">")
    return m.group(1)


def main() -> int:
    html = SRC.read_text(encoding="utf-8")
    print(f"loaded {SRC} ({len(html):,} chars)")

    manifest_raw = extract_script(html, "__bundler/manifest")
    template_raw = extract_script(html, "__bundler/template")
    ext_raw_match = re.search(
        r'<script\s+type="__bundler/ext_resources">(.*?)</script>',
        html,
        re.DOTALL,
    )
    ext_raw = ext_raw_match.group(1) if ext_raw_match else "[]"

    manifest = json.loads(manifest_raw)
    template = json.loads(template_raw)
    ext_resources = json.loads(ext_raw)
    print(f"manifest: {len(manifest)} assets")
    print(f"ext_resources: {len(ext_resources)} entries")
    print(f"template: {len(template):,} chars")

    ASSETS.mkdir(parents=True, exist_ok=True)

    # Decode + write assets
    uuid_to_path: dict[str, str] = {}
    for uuid, entry in manifest.items():
        data_b64 = entry["data"]
        mime = entry.get("mime", "application/octet-stream")
        raw = base64.b64decode(data_b64)
        if entry.get("compressed"):
            raw = gzip.decompress(raw)
        ext = ext_for(mime)
        filename = f"{uuid}{ext}"
        (ASSETS / filename).write_bytes(raw)
        uuid_to_path[uuid] = f"assets/{filename}"

    print(f"wrote {len(uuid_to_path)} assets to {ASSETS}")

    # Sanity-check: confirm each UUID appears in the template
    missing = [u for u in uuid_to_path if u not in template]
    if missing:
        print(f"warning: {len(missing)} uuids not referenced in template")

    # Swap UUIDs for relative asset paths
    # Process longest first to avoid collisions if any uuid is substring of another
    for uuid in sorted(uuid_to_path, key=len, reverse=True):
        template = template.replace(uuid, uuid_to_path[uuid])

    # ext_resources: some templates reference resources via a window.__resources
    # map keyed by `id`. Emit a small script so blob-URL-style lookups resolve
    # to our relative asset paths.
    resource_map = {}
    for entry in ext_resources:
        uuid = entry.get("uuid")
        rid = entry.get("id")
        if uuid and rid and uuid in uuid_to_path:
            resource_map[rid] = uuid_to_path[uuid]

    if resource_map:
        inject = (
            "<script>window.__resources = "
            + json.dumps(resource_map).replace("</script>", "<\\/script>")
            + ";</script>"
        )
        m = re.search(r"<head[^>]*>", template, re.IGNORECASE)
        if m:
            i = m.end()
            template = template[:i] + inject + template[i:]

    # Strip SRI + crossorigin — matches the runtime unpacker. These attributes
    # target CDN delivery; with local asset files the integrity hash (computed
    # against the blob-URL bytes at author time) no longer matches, and
    # crossorigin forces a CORS preflight that a static server won't satisfy.
    template = re.sub(r'\s+integrity="[^"]*"', "", template, flags=re.IGNORECASE)
    template = re.sub(r'\s+crossorigin="[^"]*"', "", template, flags=re.IGNORECASE)

    (OUT / "index.html").write_text(template, encoding="utf-8")
    print(f"wrote {OUT / 'index.html'} ({len(template):,} chars)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
