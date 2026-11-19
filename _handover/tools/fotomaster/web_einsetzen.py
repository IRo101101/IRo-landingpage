# Setzt Web-Fotos, die aus den Mastern in Originalgroesse gerechnet wurden, in den Fundus r1/assets/img/v2 ein.
# Quelle je Foto: zwei JPEG-Haelften NN_L.jpg und NN_R.jpg (zusammen 1800 x 1200), erzeugt von web.py in der Bildwerkstatt.
# Ziel: NN.webp (1800 x 1200) und NN-m.webp (1100 x 733), gleiche Einstellungen wie add_photos.py (WebP 85, method 6).
# Aufruf: python3 web_einsetzen.py <ordner_mit_haelften> [NN ...]      (ohne Nummern: alle gefundenen)
# Schutz: Das neue Bild muss denselben Ausschnitt zeigen wie die bisherige Fundus-Datei, sonst wird nichts geschrieben.
import os, sys, glob, math
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'r1', 'assets', 'img', 'v2'))

def signatur(im, n=(48, 32)):
    b = list(im.convert('L').resize(n, Image.BOX).tobytes())
    m = sum(b) / len(b); v = [x - m for x in b]; s = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / s for x in v]

def aehnlich(a, b):
    return sum(x * y for x, y in zip(signatur(a), signatur(b)))

def main():
    if len(sys.argv) < 2:
        sys.exit('Aufruf: web_einsetzen.py <ordner_mit_haelften> [NN ...]')
    src = sys.argv[1]
    nums = sys.argv[2:] or sorted({os.path.basename(p)[:2] for p in glob.glob(os.path.join(src, '[0-9][0-9]_L.jpg'))})
    for num in nums:
        left = Image.open(os.path.join(src, num + '_L.jpg')).convert('RGB')
        right = Image.open(os.path.join(src, num + '_R.jpg')).convert('RGB')
        if left.height != 1200 or right.height != 1200 or left.width + right.width != 1800:
            sys.exit(f'{num}: unerwartete Masse {left.size} + {right.size}')
        im = Image.new('RGB', (1800, 1200)); im.paste(left, (0, 0)); im.paste(right, (left.width, 0))
        alt_pfad = os.path.join(OUT, num + '.webp')
        if os.path.exists(alt_pfad):
            alt = Image.open(alt_pfad).convert('RGB')
            if alt.size != (1800, 1200):
                sys.exit(f'{num}: bisherige Datei hat {alt.size}, erwartet 1800 x 1200')
            k = aehnlich(alt, im)
            if k < 0.90:
                sys.exit(f'{num}: Ausschnitt weicht von der bisherigen Datei ab (Kennwert {k:.3f}), nichts geschrieben')
        else:
            k = float('nan')
        for suffix, width in (('', 1800), ('-m', 1100)):
            out = im if width == 1800 else im.resize((width, round(1200 * width / 1800)), Image.LANCZOS)
            pfad = os.path.join(OUT, f'{num}{suffix}.webp')
            out.save(pfad, 'WEBP', quality=85, method=6)
            print(pfad, out.size, os.path.getsize(pfad) // 1024, 'KB', f'Kennwert {k:.3f}' if suffix == '' else '')

if __name__ == '__main__':
    main()
