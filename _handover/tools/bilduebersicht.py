# Erzeugt die Bilduebersicht (Kontaktblatt) aller Fotos des v2-Fundus mit ihrer Verwendung in r1, plus v1-Fotos und Logos.
# Die Verwendung wird aus r1/index.html GELESEN (Hero, Ladepanel, Rotation Unternehmen, Kompetenzkarten, Prozess, Team,
# Kontakt) und kann darum nicht veralten. Fest hinterlegt sind nur die Beschreibungen der Fotos ohne Alt-Text im Code.
# Aufruf: python3 _handover/tools/bilduebersicht.py   (schreibt _handover/bilduebersicht.png, gibt die Zuordnung aus)
import os, re, glob, subprocess, datetime
from html.parser import HTMLParser
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..')) + '/'
V1IMG = os.path.join(HERE, 'v1img', '')   # Fotos der Live-Site v1 (Kopie aus assets/img/services und gallery)
V2 = REPO + 'r1/assets/img/v2/'
PAGE = REPO + 'r1/index.html'

# Fotos, die in keiner Seite eingebaut sind: Beschreibung, Zustand (unused = rot, new = schwarz), Beschriftung
FREE = {
  '08': ('Glasfront und Terrasse des Firmengebäudes', 'unused', 'NICHT VERWENDET'),
  '22': ('3D-Drucker druckt Härtemuster 27 bis 95 Shore (Vero White) mit IdeeRoth-Beschriftung', 'new', 'NEU 10.10., NOCH FREI'),
  '23': ('Offene Glastür zum Büro mit grünen Säulen und Kaffeebar', 'new', 'NEU 10.10., NOCH FREI'),
  '24': ('Fassung von 16 (Team am Tisch) mit neu erzeugtem Kopf rechts', 'new', 'NEU 20.11., NOCH FREI'),
  '25': ('Fassung von 21 (3D-Drucker) mit neu erzeugtem Kopf', 'new', 'NEU 20.11., NOCH FREI'),
  '26': ('Fassung von 11 (Besprechung mit Flasche) mit neu erzeugtem Kopf', 'new', 'NEU 20.11., NOCH FREI'),
}
# Alle uebrigen Bilddateien unter r1/assets/img: (Datei, Name, Verwendung, Kachelgrund, Zustand). Von Hand gepflegt und am
# 19.11.2026 gegen Markup und CSS geprueft (Klassen .logo-mark, .logo-tile, .badge--* auf den fuenf Seiten; .logo-lock und
# .logo-word auf keiner echten Seite). Zustand: used = auf den Seiten, part = nur Vorschau oder Metadaten, unused = nirgends.
IMG = REPO + 'r1/assets/img/'
LOGOS = [
  (IMG + 'logo/tile-white.png', 'Logo-Kachel iro.swiss', 'Abspann + Footer', 'dark', 'used'),
  (IMG + 'logo/mark-white.png', 'Marke weiss', 'Header + Ladepanel', 'dark', 'used'),
  (IMG + 'badge-nafems-member.png', 'NAFEMS Member', 'Abspann + Footer', 'dark', 'used'),
  (IMG + 'badge-lehrbetrieb.png', 'Wir machen Profis', 'Abspann + Footer', 'dark', 'used'),
  (IMG + 'logo/lockup-black.png', 'Logo schwarz', 'nur Metadaten', 'light', 'part'),
  (IMG + 'logo/lockup-white.png', 'Logo weiss', 'nur Vorschauseiten', 'dark', 'part'),
  (IMG + 'logo/word-white.png', 'Wortmarke weiss', 'nur Vorschauseiten', 'dark', 'part'),
  (IMG + 'map/standort.webp', 'Karte Standort', 'nur Vorschauseite', 'dark', 'part'),
  (IMG + 'logo/logo-color.png', 'IdeeRoth AG farbig', 'nicht verwendet', 'light', 'unused'),
  (IMG + 'logo/logo-light.png', 'IdeeRoth AG hell', 'nicht verwendet', 'dark', 'unused'),
  (IMG + 'logo/mark-black.png', 'Marke schwarz', 'nicht verwendet', 'light', 'unused'),
  (IMG + 'logo/word-black.png', 'Wortmarke schwarz', 'nicht verwendet', 'light', 'unused'),
]

# ---------------------------------------------------------------- Verwendung aus dem Markup lesen
# Klasse eines Vorfahren -> Rolle des Fotos (erste passende Zeile gilt)
ROLES = [('pre__card', 'deck'), ('pre__finale', 'finale'), ('hero__photo', 'hero'), ('about__photo', 'rot'),
         ('card__drift', 'card'), ('card__mask', 'card'), ('process__photo', 'proc'), ('team__photo', 'team'),
         ('contact__photo', 'contact')]
VOID = {'img', 'br', 'meta', 'link', 'input', 'hr', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr'}

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []            # (tag, klassen) der offenen Elemente
        self.uses = []             # jedes eingebaute Foto in Reihenfolge des Markups
        self.n_card = 0; self.card_titles = {}
        self.n_step = 0; self.step_titles = {}
        self.grab = None           # (art, index, stapeltiefe) solange ein Titel gesammelt wird
        self.buf = ''
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cl = (a.get('class') or '').split()
        if tag == 'img':
            m = re.search(r'img/v2/(\d\d)(-m)?\.webp', a.get('src') or '')
            if m:
                anc = [c for _, cs in self.stack for c in cs]
                role = next((r for c, r in ROLES if c in anc), 'other')
                self.uses.append({'num': m.group(1), 'mobile': bool(m.group(2)), 'role': role,
                                  'alt': (a.get('alt') or '').strip(), 'card': self.n_card - 1})
        if tag == 'div' and 'card' in cl: self.n_card += 1
        if tag == 'li' and 'pstep' in cl: self.n_step += 1
        if tag in VOID: return
        self.stack.append((tag, cl))
        if self.grab is None:
            if tag == 'h3' and 'card__label' in cl:
                self.grab = ('card', self.n_card - 1, len(self.stack)); self.buf = ''
            elif (tag == 'span' and not cl and len(self.stack) >= 2 and 'pstep' in self.stack[-2][1]
                  and (self.n_step - 1) not in self.step_titles):
                self.grab = ('step', self.n_step - 1, len(self.stack)); self.buf = ''
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and self.stack: self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]; break
        if self.grab and len(self.stack) < self.grab[2]:
            kind, idx, _ = self.grab
            (self.card_titles if kind == 'card' else self.step_titles)[idx] = ' '.join(self.buf.split())
            self.grab = None
    def handle_data(self, data):
        if self.grab: self.buf += data

def read_usage():
    p = Page(); p.feed(open(PAGE, encoding='utf-8').read())
    rot = [u for u in p.uses if u['role'] == 'rot']; proc = [u for u in p.uses if u['role'] == 'proc']
    deck = [u for u in p.uses if u['role'] == 'deck']
    use = {}
    def add(u, entry):
        d = use.setdefault(u['num'], {'entries': [], 'alt': ''})
        d['entries'].append(entry)
        if u['alt'] and not d['alt']: d['alt'] = u['alt']
    for i, u in enumerate(rot): add(u, ('rot', i + 1, len(rot)))
    for i, u in enumerate(proc): add(u, ('proc', i + 1, p.step_titles.get(i, '')))
    for i, u in enumerate(deck): add(u, ('deck', i + 1, len(deck)))
    for u in p.uses:
        if u['role'] == 'card': add(u, ('card', p.card_titles.get(u['card'], '')))
        elif u['role'] in ('hero', 'team', 'contact', 'finale', 'other'): add(u, (u['role'],))
    return use

def describe(num, use):
    """-> (Beschriftung, Hinweiszeile, Beschreibung, Zustand)"""
    if num not in use:
        desc, state, label = FREE.get(num, ('', 'unused', 'NICHT VERWENDET'))
        return label, '', desc, state
    e = use[num]['entries']; kinds = [x[0] for x in e]
    rot = next((x for x in e if x[0] == 'rot'), None); proc = next((x for x in e if x[0] == 'proc'), None)
    card = next((x for x in e if x[0] == 'card'), None)
    parts, notes = [], []
    if 'hero' in kinds: parts.append('Hero')
    if card: parts.append(('Karte ' + card[1]).strip())
    if proc and rot:
        parts.append('Prozess %02d + Rotation' % proc[1]); notes.append('Schritt %s, Rotation Position %d von %d' % (proc[2], rot[1], rot[2]))
    elif proc: parts.append(('Prozess %02d %s' % (proc[1], proc[2])).strip())
    elif rot:
        parts.append('Rotation Unternehmen'); notes.append('Position %d von %d' % (rot[1], rot[2]))
    if 'team' in kinds: parts.append('Team')
    if 'contact' in kinds: parts.append('Kontakt (Abspann)')
    if 'other' in kinds: parts.append('Verwendet (Stelle prüfen)')
    if 'finale' in kinds: notes.append('auch Schlussbild im Ladepanel')
    if 'deck' in kinds: notes.append('auch im Ladepanel' if parts else '')
    if not parts: parts.append('Ladepanel')
    desc = use[num]['alt'] or FREE.get(num, ('',))[0]
    return ' + '.join(parts), ' · '.join(n for n in notes if n), desc, 'used'

# ---------------------------------------------------------------- Zeichnen
def font(size, bold=False):
    inter = REPO + '_handover/powerpoint/out/paket/fonts/' + ('Inter-Bold.ttf' if bold else 'Inter-Regular.ttf')
    dejavu = '/usr/share/fonts/truetype/dejavu/' + ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')
    for p in (inter, dejavu):
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def code_date():
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cd', '--date=format:%d.%m.%Y', '--', 'r1/index.html'],
                             cwd=REPO, capture_output=True, text=True, timeout=20).stdout.strip()
        if out: return out
    except Exception: pass
    return datetime.date.fromtimestamp(os.path.getmtime(PAGE)).strftime('%d.%m.%Y')

def main():
    use = read_usage()
    nums = sorted(os.path.basename(p)[:2] for p in glob.glob(V2 + '[0-9][0-9].webp'))
    rows_data = [(n,) + describe(n, use) for n in nums]
    v1 = sorted(glob.glob(V1IMG + '*'))

    F_T, F_H, F_L, F_N, F_D = font(22, True), font(19, True), font(17, True), font(14), font(14)
    COLS, TW, TH, GX, M = 4, 300, 200, 18, 18
    TEXT_H, GY = 34 + 5 * 18, 26                      # Beschriftung + bis 2 Hinweiszeilen + bis 3 Beschreibungszeilen
    W = M * 2 + COLS * TW + (COLS - 1) * GX
    rows = -(-len(rows_data) // COLS)
    HEAD = M + 78
    H_PHOTOS = HEAD + rows * (TH + TEXT_H + GY)
    LCOLS, LSTEP, LROW = 6, 209, 176                  # Logo-Kacheln: je Zeile, Abstand, Zeilenhoehe
    H_V1, H_LOGO = 40 + 120 + 40, 62 + -(-len(LOGOS) // LCOLS) * LROW + 10
    img = Image.new('RGB', (W, H_PHOTOS + H_V1 + H_LOGO), 'white'); d = ImageDraw.Draw(img)
    INK, GRAY = (17, 20, 24), (95, 100, 106)
    COLORS = {'used': (37, 199, 122), 'unused': (220, 40, 40), 'new': INK, 'part': (150, 156, 162)}

    def wrap(text, f, width):
        words, lines, cur = text.split(), [], ''
        for w_ in words:
            t = (cur + ' ' + w_).strip()
            if d.textlength(t, font=f) <= width: cur = t
            else:
                if cur: lines.append(cur)
                cur = w_
        if cur: lines.append(cur)
        return lines
    def fit(im, box):
        bw, bh = box; w, h = im.size; s = min(bw / w, bh / h)
        return im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)

    n_used = sum(1 for r in rows_data if r[4] == 'used')
    d.text((M, M), 'Fotos %s bis %s und ihre Verwendung in v2 r1 · Code-Stand %s' % (nums[0], nums[-1], code_date()), fill=INK, font=F_T)
    x = M
    for state, text in (('used', '%d verwendet' % n_used), ('unused', '%d nicht verwendet' % sum(1 for r in rows_data if r[4] == 'unused')),
                        ('new', '%d neu, noch frei' % sum(1 for r in rows_data if r[4] == 'new'))):
        d.rectangle([x, M + 42, x + 15, M + 57], outline=COLORS[state], width=3)
        d.text((x + 24, M + 40), text, fill=INK, font=F_N); x += 24 + int(d.textlength(text, font=F_N)) + 28

    for i, (num, label, note, desc, state) in enumerate(rows_data):
        r, c = divmod(i, COLS); x = M + c * (TW + GX); y = HEAD + r * (TH + TEXT_H + GY)
        im = Image.open(V2 + f'{num}.webp').convert('RGB'); th = fit(im, (TW - 6, TH - 6))
        col = COLORS[state]
        d.rectangle([x, y, x + TW - 1, y + TH - 1], outline=col, width=3)
        img.paste(th, (x + 3 + (TW - 6 - th.width) // 2, y + 3 + (TH - 6 - th.height) // 2))
        d.text((x, y + TH + 8), f'{num}  {label}', fill=(col if state == 'unused' else INK), font=F_L)
        yy = y + TH + 34
        for line in wrap(note, F_N, TW)[:2]:
            d.text((x, yy), line, fill=INK, font=F_N); yy += 18
        for line in wrap(desc, F_D, TW)[:3]:
            d.text((x, yy), line, fill=GRAY, font=F_D); yy += 18

    y = H_PHOTOS
    d.text((M, y), 'Fotos der alten Site (v1), nicht in v2 übernommen', fill=INK, font=F_H); y += 36
    n = max(1, len(v1)); tw = min(160, (W - 2 * M - (n - 1) * 12) // n)
    for i, p in enumerate(v1):
        x = M + i * (tw + 12)
        try:
            im = Image.open(p).convert('RGB'); th = fit(im, (tw, 100)); img.paste(th, (x, y))
        except Exception: pass
        d.text((x, y + 106), os.path.basename(p)[:22], fill=GRAY, font=F_D)

    y = H_PHOTOS + H_V1
    d.text((M, y), 'Logos, Badges und Karte', fill=INK, font=F_H)
    x = M
    for state, text in (('used', 'auf den Seiten'), ('part', 'nur Vorschau oder Metadaten'), ('unused', 'nicht verwendet')):
        d.rectangle([x, y + 32, x + 15, y + 47], outline=COLORS[state], width=3)
        d.text((x + 24, y + 30), text, fill=INK, font=F_N); x += 24 + int(d.textlength(text, font=F_N)) + 28
    y += 62
    for i, (p, name, where, bg, state) in enumerate(LOGOS):
        r, c = divmod(i, LCOLS); x = M + c * LSTEP; yy = y + r * LROW
        box = Image.new('RGB', (116, 116), INK if bg == 'dark' else (231, 255, 242))
        try:
            im = Image.open(p).convert('RGBA'); th = fit(im, (96, 96))
            box.paste(th, ((116 - th.width) // 2, (116 - th.height) // 2), th)
        except Exception: pass
        img.paste(box, (x, yy))
        d.rectangle([x, yy, x + 115, yy + 115], outline=COLORS[state], width=3)
        d.text((x, yy + 122), name[:30], fill=INK, font=F_D)
        d.text((x, yy + 140), where, fill=(COLORS['unused'] if state == 'unused' else GRAY), font=F_D)

    out = REPO + '_handover/bilduebersicht.png'; img.save(out, optimize=True)
    for num, label, note, desc, state in rows_data:
        print('%s  %-28s %-48s %s' % (num, label, note, desc))
    for p, name, where, bg, state in LOGOS:
        print('%-28s %-24s %s' % (os.path.relpath(p, IMG), name, where))
    print(out, img.size)

if __name__ == '__main__':
    main()
