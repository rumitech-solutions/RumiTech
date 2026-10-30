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

def emblem(d, x, y, s, a=LIME, b=CYAN):
    k = s / 48
    d.rounded_rectangle([x, y, x + s, y + s], radius=int(13 * k), fill=(13, 18, 25), outline=(60, 66, 76), width=max(1, int(k)))
    w = max(2, int(3 * k))
    def P(px, py): return (x + px * k, y + py * k)
    # curved paths approximated with polylines
    import math
    def curve(p0, p1, p2, p3, n=24):
        pts = []
        for i in range(n + 1):
            t = i / n
            u = 1 - t
            pts.append(P(u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                         u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
        return pts
    d.line(curve((13, 34), (13, 22), (20, 16), (28, 16)) + [P(35, 16)], fill=a, width=w, joint='curve')
    d.line(curve((20, 34), (20, 28), (24, 25), (29, 25)) + [P(35, 25)], fill=b, width=w, joint='curve')
    for (px, py, r, c) in ((13, 34, 3.2, a), (35, 16, 3.2, TEXT), (35, 25, 2.4, TEXT)):
        cx, cy = P(px, py); rr = r * k
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=c)

def og(name, title, sub, accent, accent2):
    W, H = 1200, 630
    img = Image.new('RGBA', (W, H), INK + (255,))
    glow(img, 980, 160, 420, accent, 90)
    glow(img, 1080, 520, 300, accent2, 50)
    d = ImageDraw.Draw(img)
    # orbit rings
    for r, c in ((150, 60), (250, 40), (350, 26)):
        d.ellipse([930 - r, 300 - r, 930 + r, 300 + r], outline=(255, 255, 255, c), width=2)
    for (px, py, c) in ((1080, 300, accent), (680, 300, accent2), (930, 50, TEXT)):
        d.ellipse([px - 7, py - 7, px + 7, py + 7], fill=c)
    emblem(d, 72, 64, 64)
    d.text((152, 76), 'RumiTech', font=font(34, 'Bold'), fill=TEXT)
    d.text((152 + d.textlength('RumiTech', font=font(34, 'Bold')) + 10, 86), 'Solutions', font=font(24, 'Regular'), fill=MUTED)
    f = font(92 if len(title) < 18 else 70, 'ExtraBold')
    # simple wrap
    words, lines, line = title.split(), [], ''
    for w in words:
        t = (line + ' ' + w).strip()
        if d.textlength(t, font=f) < 760: line = t
        else: lines.append(line); line = w
    lines.append(line)
    y = 250 if len(lines) < 3 else 210
    for ln in lines:
        d.text((72, y), ln, font=f, fill=TEXT); y += int(f.size * 1.08)
    d.rectangle([72, y + 18, 72 + 84, y + 24], fill=accent)
    d.text((72, y + 46), sub, font=font(32, 'Regular'), fill=MUTED)
    img.convert('RGB').save(os.path.join(OUT, 'og', f'{name}.png'), optimize=True)

og('default', 'Good ideas deserve great software.', 'Thoughtfully built software for everyday life.', LIME, CYAN)
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
    d = ImageDraw.Draw(img)
    pad = int(size * 0.14)
    emblem(d, pad, pad, size - 2 * pad)
    img.convert('RGB').save(os.path.join(OUT, name), optimize=True)
print('images ok')
