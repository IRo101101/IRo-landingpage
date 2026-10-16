# Fuegt dem Fundus r1/assets/img/v2 die Fotos 22 und 23 hinzu (Desktop 1800 px breit, mobil 1100 px breit, WebP),
# gleiche Masse wie 01 bis 21. Quelle: Chat-Uploads vom 10.10.2026 (vom Upload auf 2000 px verkleinert, keine Originale).
# Aufruf: python3 add_photos.py 22=/pfad/zum/original-22.jpg 23=/pfad/zum/original-23.jpg
# (Hero-Foto 07 ist die Ausnahme mit 2400 px Breite; dafuer width unten anpassen.)
import os, sys
from PIL import Image, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', '..', 'r1', 'assets', 'img', 'v2')) + os.sep
SRC = dict(a.split('=', 1) for a in sys.argv[1:] if '=' in a)
if not SRC:
    sys.exit('Aufruf: add_photos.py NN=/pfad/zur/quelle.jpg [NN=...]')
for num, src in SRC.items():
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    for suffix, width in (('', 1800), ('-m', 1100)):
        w, h = im.size
        out = im.resize((width, round(h * width / w)), Image.LANCZOS)
        path = OUT + f'{num}{suffix}.webp'
        out.save(path, 'WEBP', quality=85, method=6)
        print(path, out.size, os.path.getsize(path) // 1024, 'KB')
