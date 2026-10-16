# Erzeugt die Bilduebersicht (Kontaktblatt) aller Fotos des v2-Fundus mit Verwendung in r1, plus v1-Fotos und Logos.
import os, glob
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..')) + '/'
V1IMG = os.path.join(HERE, 'v1img', '')   # Fotos der Live-Site v1 (Kopie aus assets/img/services und gallery)
V2 = REPO + 'r1/assets/img/v2/'
PHOTOS = [
  ('01', 'Rotation Unternehmen', 'Espressobezug an der Kaffeemaschine', 'used'),
  ('02', 'Rotation Unternehmen', 'Blick durch die Glasfront auf eine Werkzeugmaschine', 'used'),
  ('03', 'Prozess 05 Prototyp', 'Werkstatt mit Fräs- und Bohrmaschinen', 'used'),
  ('04', 'Rotation Unternehmen', 'Mitarbeiterin am Bildschirm', 'used'),
  ('05', 'Rotation Unternehmen', 'Mitarbeiter mit Unterlagen in der Werkstatt', 'used'),
  ('06', 'Rotation Unternehmen', 'Offene Glastür zur Werkstatt', 'used'),
  ('07', 'Hero', 'Gegenlicht durch die offene Tür des Firmengebäudes', 'used'),
  ('08', 'NICHT VERWENDET', 'Glasfront und Terrasse des Firmengebäudes', 'unused'),
  ('09', 'Karte Ideation', 'Zwei Mitarbeiter besprechen ein Konzept am Tablet', 'used'),
  ('10', 'Prozess 03 + Rotation', 'Besprechung am Tisch mit Bildschirm', 'used'),
  ('11', 'Karte Entwicklung', 'Konstruktionsbesprechung mit 3D-CAD am Bildschirm', 'used'),
  ('12', 'Rotation Unternehmen', 'Mitarbeiter im Gespräch am Arbeitsplatz', 'used'),
  ('13', 'Karte Simulation', 'Büro mit Arbeitsplätzen und Bildschirmen', 'used'),
  ('14', 'Karte Prototyping', 'Mitarbeiter an der Fräsmaschine', 'used'),
  ('15', 'Prozess 02 + Rotation', 'Mitarbeiter beim Skizzieren am Arbeitsplatz', 'used'),
  ('16', 'Team', 'Das Team der IdeeRoth AG im Gespräch', 'used'),
  ('17', 'Kontakt (Abspann)', 'Aussenansicht des Firmengebäudes mit Weg', 'used'),
  ('18', 'Rotation Unternehmen', 'Mitarbeiter mit Kaffeetasse', 'used'),
  ('19', 'Prozess 01 Idee', 'Drei Mitarbeiter prüfen Bauteile', 'used'),
  ('20', 'Rotation Unternehmen', 'Mitarbeiter an der Drehmaschine', 'used'),
  ('21', 'Prozess 04 Entwicklung', 'Mitarbeiter am 3D-Drucker', 'used'),
  ('22', 'NEU 10.10., NOCH FREI', '3D-Drucker druckt Härtemuster 27 bis 95 Shore (Vero White) mit IdeeRoth-Beschriftung', 'new'),
  ('23', 'NEU 10.10., NOCH FREI', 'Offene Glastür zum Büro mit grünen Säulen und Kaffeebar', 'new'),
]
V1 = sorted(glob.glob(V1IMG + '*'))
LOGOS = [
  (REPO + 'r1/assets/img/logo/logo-color.png', 'IdeeRoth AG farbig', 'nicht verwendet', 'light'),
  (REPO + 'r1/assets/img/logo/logo-light.png', 'IdeeRoth AG hell', 'nicht verwendet', 'light'),
  (REPO + 'r1/assets/img/logo/tile-white.png', 'iro.swiss Original (Maske)', 'Abspann + Footer', 'dark'),
  (REPO + 'r1/assets/img/logo/mark-white.png', 'Marke', 'Header', 'dark'),
  (REPO + 'r1/assets/img/badge-nafems-member.png', 'NAFEMS (Maske)', 'Abspann + Footer', 'dark'),
  (REPO + 'r1/assets/img/badge-lehrbetrieb.png', 'Wir machen Profis (Maske)', 'Abspann + Footer', 'dark'),
]
def font(size, bold=False):
    for p in (['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'] if bold else ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']):
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
F_T, F_H, F_L, F_D = font(22, True), font(19, True), font(17, True), font(14)
COLS, TW, TH, GX, GY, M = 4, 300, 200, 18, 44, 18
W = M * 2 + COLS * TW + (COLS - 1) * GX
rows = -(-len(PHOTOS) // COLS)
H_PHOTOS = M + 40 + rows * (TH + 88 + GY)
H_V1 = 40 + 120 + 40
H_LOGO = 40 + 120 + 60
img = Image.new('RGB', (W, H_PHOTOS + H_V1 + H_LOGO), 'white'); d = ImageDraw.Draw(img)
COLORS = {'used': (37, 199, 122), 'unused': (220, 40, 40), 'new': (17, 20, 24)}
def wrap(text, f, width):
    words, lines, cur = text.split(), [], ''
    for w_ in words:
        t = (cur + ' ' + w_).strip()
        if d.textlength(t, font=f) <= width: cur = t
        else: lines.append(cur); cur = w_
    if cur: lines.append(cur)
    return lines
def fit(im, box):
    bw, bh = box; w, h = im.size; s = min(bw / w, bh / h)
    return im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
d.text((M, M), 'Fotos 01 bis 23 (Kontaktblatt) und ihre Verwendung in v2 r1, Stand 10.10.2026', fill=(17, 20, 24), font=F_T)
y0 = M + 40
for i, (num, use, desc, state) in enumerate(PHOTOS):
    r, c = divmod(i, COLS); x = M + c * (TW + GX); y = y0 + r * (TH + 88 + GY)
    im = Image.open(V2 + f'{num}.webp').convert('RGB'); th = fit(im, (TW - 6, TH - 6))
    col = COLORS[state]
    d.rectangle([x, y, x + TW - 1, y + TH - 1], outline=col, width=3)
    img.paste(th, (x + 3 + (TW - 6 - th.width) // 2, y + 3 + (TH - 6 - th.height) // 2))
    lab_col = col if state != 'used' else (17, 20, 24)
    d.text((x, y + TH + 8), f'{num}  {use}', fill=lab_col, font=F_L)
    yy = y + TH + 34
    for line in wrap(desc, F_D, TW)[:3]:
        d.text((x, yy), line, fill=(90, 90, 90), font=F_D); yy += 18
# v1
y = H_PHOTOS
d.text((M, y), 'Fotos der alten Site (v1), nicht in v2 uebernommen', fill=(17, 20, 24), font=F_H); y += 36
n = max(1, len(V1)); tw = min(160, (W - 2 * M - (n - 1) * 12) // n)
for i, p in enumerate(V1):
    x = M + i * (tw + 12)
    try:
        im = Image.open(p).convert('RGB'); th = fit(im, (tw, 100)); img.paste(th, (x, y))
    except Exception: pass
    d.text((x, y + 106), os.path.basename(p)[:22], fill=(90, 90, 90), font=F_D)
# logos
y = H_PHOTOS + H_V1
d.text((M, y), 'Logos und Badges', fill=(17, 20, 24), font=F_H); y += 36
for i, (p, name, use, bg) in enumerate(LOGOS):
    x = M + i * (205)
    box = Image.new('RGB', (110, 110), (17, 20, 24) if bg == 'dark' else (231, 255, 242))
    try:
        im = Image.open(p).convert('RGBA'); th = fit(im, (96, 96))
        box.paste(th, ((110 - th.width) // 2, (110 - th.height) // 2), th)
    except Exception: pass
    img.paste(box, (x, y))
    d.text((x, y + 116), name[:30], fill=(90, 90, 90), font=F_D); d.text((x, y + 134), use, fill=(90, 90, 90), font=F_D)
out = REPO + '_handover/bilduebersicht.png'; img.save(out); print(out, img.size)
