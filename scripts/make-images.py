#!/usr/bin/env python3
"""Generates social preview images and app icons into public/.
Run once (or after changing products): python3 scripts/make-images.py
Requires Pillow and the Inter font (falls back to DejaVu). Output PNGs are committed,
so the normal build does not need Python."""
import os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public')
os.makedirs(os.path.join(OUT, 'og'), exist_ok=True)

INK = (8, 11, 16)
TEXT = (243, 239, 232)
MUTED = (167, 174, 184)
LIME = (200, 245, 96)
CYAN = (92, 225, 230)

def font(size, weight='Bold'):
    for p in (f'/usr/share/fonts/opentype/inter/Inter-{weight}.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def glow(img, cx, cy, r, color, alpha=70):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 40
    for i in range(steps, 0, -1):
        rr = int(r * i / steps)
        a = int(alpha * (1 - i / steps) ** 2)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=color + (a,))
    img.alpha_composite(layer)

_EMB = {}
def emblem_png(size):
    """Render public/brand/rumitech-emblem.svg to a transparent RGBA PNG at `size` px (via Playwright/Chromium)."""
    if size in _EMB: return _EMB[size]
    import io
    from playwright.sync_api import sync_playwright
    svg = open(os.path.join(OUT, 'brand', 'rumitech-emblem.svg')).read()
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': size, 'height': size}, device_scale_factor=1)
        pg.set_content(f'<body style="margin:0;background:transparent"><div style="width:{size}px;height:{size}px">{svg.replace("width=\"512\" height=\"512\"", f"width=\"{size}\" height=\"{size}\"")}</div></body>')
        png = pg.screenshot(omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size}); b.close()
    _EMB[size] = Image.open(io.BytesIO(png)).convert('RGBA'); return _EMB[size]

def emblem(img, x, y, s):
    img.alpha_composite(emblem_png(s), (int(x), int(y)))

def og(name, title, sub, accent, accent2):
    W, H = 1200, 630
    img = Image.new('RGBA', (W, H), INK + (255,))
    glow(img, 980, 160, 420, accent, 90)
    glow(img, 1080, 520, 300, accent2, 50)
    ov = Image.new('RGBA', img.size, (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
    for r, c in ((150, 46), (250, 30), (350, 18)):
        od.ellipse([960 - r, 300 - r, 960 + r, 300 + r], outline=(255, 255, 255, c), width=2)
    for (px, py, c) in ((1110, 300, accent), (710, 300, accent2), (960, 50, TEXT)):
        od.ellipse([px - 7, py - 7, px + 7, py + 7], fill=c + (255,))
    img.alpha_composite(ov)
    d = ImageDraw.Draw(img)
    emblem(img, 72, 64, 64)
    d.text((152, 76), 'RumiTech', font=font(34, 'Bold'), fill=TEXT)
    d.text((152 + d.textlength('RumiTech', font=font(34, 'Bold')) + 10, 86), 'Solutions', font=font(24, 'Regular'), fill=MUTED)
    f = font(92 if len(title) < 18 else 70, 'ExtraBold')
    # simple wrap
    words, lines, line = title.split(), [], ''
    for w in words:
        t = (line + ' ' + w).strip()
        if d.textlength(t, font=f) < 700: line = t
        else: lines.append(line); line = w
    lines.append(line)
    y = 250 if len(lines) < 3 else 210
    for ln in lines:
        d.text((72, y), ln, font=f, fill=TEXT); y += int(f.size * 1.08)
    d.rectangle([72, y + 18, 72 + 84, y + 24], fill=accent)
    d.text((72, y + 46), sub, font=font(32, 'Regular'), fill=MUTED)
    img.convert('RGB').save(os.path.join(OUT, 'og', f'{name}.png'), optimize=True)

og('default', 'Thoughtfully built software for everyday life.', 'An independent product studio.', LIME, CYAN)
PRODUCTS = {
    'imaanly': ('Imaanly', 'A calm companion for daily faith.', '#3FC79A', '#D9B66F'),
    'stockly': ('Stockly', 'Know what you have, at a glance.', '#FFA94D', '#FFD8A8'),
    'finmate': ('FinMate', 'Your money, clearly organised.', '#6C9BFF', '#9BE7D2'),
    'circlo': ('Circlo', 'Stay close to the people who matter.', '#FF8272', '#FFC6B8'),
}
for slug, (n, t, a, b) in PRODUCTS.items():
    og(slug, n, t, hexrgb(a), hexrgb(b))

# icons
for size, name in ((180, 'apple-touch-icon.png'), (512, 'icon-512.png'), (192, 'icon-192.png')):
    img = Image.new('RGBA', (size, size), INK + (255,))
    pad = int(size * 0.12)
    emblem(img, pad, pad, size - 2 * pad)
    img.convert('RGB').save(os.path.join(OUT, name), optimize=True)
print('images ok')
