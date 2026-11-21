#!/usr/bin/env python3
"""Baut das Website-Archiv (Finish-File) fuer Marketing und spaetere Arbeiten.

Aufruf (im Repo-Root):  python3 _handover/tools/archiv/build_archiv.py
Voraussetzung:          zuerst python3 _handover/tools/golive/build_release.py (das Upload-Paket kommt mit ins Archiv)
Ergebnis:               _release/iro-website-archiv-YYYYMMDD.zip  (Ordner _release/archiv/ entsteht dabei, nicht eingecheckt)

Inhalt des Archivs:
- LIESMICH.md, firma/Firmendaten.md
- texte/de/*.md und texte/en/*.md: jede Seite als lesbarer Text, gegliedert wie auf der Website
- texte/texte.json und texte/texte.csv: jede Texteinheit als Paar DE/EN mit Seite, Abschnitt und Art
- stil/: Textstil, Wording, Design, Glossar (Vorlagen aus _handover/tools/archiv/vorlagen/)
- bilder/: alle Fotos der Live-Seiten als JPG, Logos, Badges, Social-Media-Bild, dazu bilder.csv/.json mit Alt-Texten
- vorlage/: PowerPoint-Vorlage mit Anleitung, Beispieldecks (PDF) und Schrift Inter
- website/: das Upload-Paket (iro-swiss-www-YYYYMMDD.zip)
Quelle der Texte ist r1/ (DE im HTML, EN in data-en, wie main.js applyLang).
"""
import csv, datetime, html, io, json, os, re, shutil, sys, zipfile
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SRC = os.path.join(REPO, 'r1')
REL = os.path.join(REPO, '_release')
OUT = os.path.join(REL, 'archiv')
SITE = 'https://www.iro.swiss/'
PAGES = [  # Datei, Ausgabename, Titel DE, Titel EN
    ('index.html', '01-startseite', 'Startseite', 'Home'),
    ('kontakt.html', '02-kontakt', 'Kontakt', 'Contact'),
    ('karriere.html', '03-karriere', 'Karriere', 'Careers'),
    ('impressum.html', '04-impressum', 'Impressum', 'Legal notice'),
    ('datenschutz.html', '05-datenschutz', 'Datenschutz', 'Privacy policy'),
    ('404.html', '06-fehlerseite-404', 'Fehlerseite 404', 'Error page 404'),
]
# Fotos mit erfundenen Personen (Stand 20.11.2026, CLAUDE.md): Koepfe der Mitarbeitenden ersetzt, Inhaber echt
INVENTED = {'09', '10', '11', '12', '15', '16', '18', '19', '20', '21', '24', '25', '26'}
PARTLY = {'27'}  # langer Tisch: Mitarbeiterin echt, uebrige Koepfe erfunden
OWNER = {'05', '14'}

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
SKIP_TAGS = {'script', 'style', 'svg', 'template', 'noscript', 'head', 'title'}
CONTAINERS = {'html', 'body', 'div', 'section', 'main', 'header', 'footer', 'nav', 'ul', 'ol', 'dl', 'article',
              'aside', 'figure', 'form', 'table', 'thead', 'tbody', 'tr'}
TEXTBLOCKS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'dt', 'dd', 'blockquote', 'figcaption', 'address',
              'td', 'th', 'label', 'summary', 'caption'}
# Bedienelemente ohne Inhalt fuer Texte (Kopf, Menue, Ladepanel, Schliessen-Knoepfe, Karten-Klickflaeche)
SKIP_CLASSES = {'hdr', 'menu', 'pre', 'skip', 'consent', 'card__hit', 'card__close', 'process__caption', 'sw',
                'subfoot', 'logo-tile', 'dbtn__fill', 'news__dot', 'card__kicker', 'srow__eyebrow'}
SECTION_NAMES = {'top': ('Startbild', 'Hero'), 'unternehmen': ('Unternehmen', 'Company'),
                 'kompetenzen': ('Kompetenzen', 'Expertise'), 'leistungen': ('Leistungen', 'Services'),
                 'team': ('Team', 'Team'), 'kontakt': ('Kontakt (Abspann)', 'Contact (closing section)')}
BUTTON_CLASSES = {'dbtn', 'cbtn', 'al'}


class Node:
    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def cls(self):
        return set((self.attrs.get('class') or '').split())

    def iter(self):
        for c in self.children:
            if isinstance(c, Node):
                yield c
                yield from c.iter()


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root', {}, None); self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, [(k, v if v is not None else '') for k, v in attrs], self.cur)
        self.cur.children.append(n)
        if tag not in VOID: self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, [(k, v if v is not None else '') for k, v in attrs], self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag: n = n.parent
        if n is not None and n.parent is not None: self.cur = n.parent

    def handle_data(self, d):
        self.cur.children.append(d)


def parse(s):
    p = Parser(); p.feed(s); p.close(); return p.root


def absurl(href):
    if not href: return ''
    if re.match(r'^(https?:|mailto:|tel:)', href): return href
    if href.startswith('#'): return ''
    href = href.replace('index.html', '')
    return SITE + href.lstrip('./')


def skipped(n):
    return n.tag in SKIP_TAGS or n.attrs.get('aria-hidden') == 'true' or bool(n.cls() & SKIP_CLASSES)


def txt(n, L, links=True):
    """Text eines Knotens in Sprache L, wie applyLang ihn setzen wuerde. Links als Markdown, wenn links=True."""
    if isinstance(n, str): return n
    if skipped(n) or n.tag == 'img': return ''
    if n.tag == 'br': return BR
    if L == 'en' and 'data-en' in n.attrs:
        inner = n.attrs['data-en']
    else:
        parts, prev_el = [], False
        for c in n.children:
            t = txt(c, L, links)
            is_el = isinstance(c, Node)
            if is_el and prev_el and parts and t and not parts[-1][-1:].isspace() and not t[:1].isspace():
                parts.append(' ')
            if t: parts.append(t)
            if is_el and t: prev_el = True
            elif not is_el and c.strip(): prev_el = False
        inner = ''.join(parts)
    if n.tag == 'a' and links:
        href = n.attrs.get('data-en-href') if L == 'en' and n.attrs.get('data-en-href') else n.attrs.get('href', '')
        u = absurl(href)
        t = clean(inner)
        if u and t and not u.startswith(('tel:',)) and t not in (u, u.replace('mailto:', '')):
            return '[%s](%s)' % (t, u)
    return inner


BR = '\x00'  # Zeilenumbruch aus <br>; Zeilenumbrueche im Quelltext zaehlen als Leerzeichen


def clean(s):
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r' ?\x00 ?', '\n', s)
    s = re.sub(r'\n{2,}', '\n', s)
    return s.strip()


def has_block(n):
    return any(d.tag in CONTAINERS or d.tag in TEXTBLOCKS for d in n.iter() if not skipped(d))


def has_button(n):
    return any(d.cls() & BUTTON_CLASSES or d.attrs.get('role') == 'img' or d.tag == 'img' for d in n.iter() if not skipped(d))


def first(n, cls):
    return next((d for d in n.iter() if cls in d.cls()), None)


class Walker:
    """Zerlegt eine Seite in Bloecke: (art, text_de, text_en, extra)."""

    def __init__(self):
        self.blocks = []

    def add(self, kind, n, extra=None, de=None, en=None):
        de = clean(de if de is not None else txt(n, 'de'))
        en = clean(en if en is not None else txt(n, 'en'))
        if de or en: self.blocks.append((kind, de, en, extra or {}))

    def walk(self, n, depth=0):
        if isinstance(n, str):
            return
        if skipped(n): return
        c = n.cls()
        if n.tag == 'img':
            alt_de = n.attrs.get('alt', ''); alt_en = n.attrs.get('data-en-alt', alt_de)
            self.blocks.append(('bild', alt_de, alt_en, {'src': n.attrs.get('src', '')})); return
        if n.tag in ('section', 'article') or 'srow' in c or 'sub__head' in c:
            sid = n.attrs.get('id', '')
            eb = first(n, 'srow__eyebrow')
            if sid in SECTION_NAMES: label_de, label_en = SECTION_NAMES[sid]
            elif 'sub__head' in c: label_de, label_en = 'Einleitung', 'Introduction'
            elif eb is not None:
                save = set(SKIP_CLASSES); SKIP_CLASSES.discard('srow__eyebrow')
                label_de, label_en = clean(txt(eb, 'de')), clean(txt(eb, 'en'))
                SKIP_CLASSES.clear(); SKIP_CLASSES.update(save)
            else: label_de = n.attrs.get('aria-label', ''); label_en = n.attrs.get('data-en-label', label_de)
            self.blocks.append(('abschnitt', label_de, label_en, {'id': sid}))
        if 'pstep' in c:  # Prozessschritt: Nummer und Name als Titel, Text, Ergebnis
            kids = [k for k in n.children if isinstance(k, Node)]
            num = next(k for k in kids if 'pstep__n' in k.cls())
            name = kids[kids.index(num) + 1]
            src = next(k for k in kids if 'pstep__src' in k.cls())
            out = next(k for k in kids if 'pstep__out' in k.cls())
            self.blocks.append(('titel', clean(txt(num, 'de') + ' ' + txt(name, 'de')),
                                clean(txt(num, 'en') + ' ' + txt(name, 'en')), {'level': 3}))
            self.add('absatz', src)
            ol, ot = [k for k in out.children if isinstance(k, Node)]
            self.blocks.append(('absatz', clean(txt(ol, 'de')) + ': ' + clean(txt(ot, 'de')),
                                clean(txt(ol, 'en')) + ': ' + clean(txt(ot, 'en')), {}))
            return
        if 'fig' in c:  # Kennzahl
            v, l = [k for k in n.children if isinstance(k, Node)]
            self.blocks.append(('punkt', clean(txt(v, 'de')) + ' · ' + clean(txt(l, 'de')),
                                clean(txt(v, 'en')) + ' · ' + clean(txt(l, 'en')), {'depth': 0})); return
        if n.attrs.get('role') == 'img' and n.attrs.get('aria-label'):
            a = n.parent
            while a is not None and a.tag != 'a': a = a.parent
            href = absurl(a.attrs.get('href', '')) if a is not None else ''
            self.blocks.append(('grafik', n.attrs['aria-label'], n.attrs.get('data-en-label', n.attrs['aria-label']),
                                {'href_de': href, 'href_en': href})); return
        if n.tag == 'a' and c & BUTTON_CLASSES or n.tag == 'button' and c & BUTTON_CLASSES:
            href_de = absurl(n.attrs.get('href', '')); href_en = absurl(n.attrs.get('data-en-href') or n.attrs.get('href', ''))
            self.add('verweis' if 'al' in c else 'knopf', n, {'href_de': href_de, 'href_en': href_en},
                     de=txt(n, 'de', links=False), en=txt(n, 'en', links=False)); return
        if n.tag in TEXTBLOCKS and not has_button(n):
            if not has_block(n):
                kind = {'h1': 'titel', 'h2': 'titel', 'h3': 'titel', 'h4': 'titel', 'h5': 'titel', 'h6': 'titel',
                        'li': 'punkt', 'blockquote': 'zitat', 'address': 'adresse'}.get(n.tag, 'absatz')
                extra = {'level': int(n.tag[1])} if kind == 'titel' else {'depth': depth} if kind == 'punkt' else {}
                self.add(kind, n, extra); return
            if n.tag == 'li':  # Punkt mit Unterliste
                head = Node('span', {}, None); head.children = [k for k in n.children if not (isinstance(k, Node) and k.tag in ('ul', 'ol'))]
                self.add('punkt', head, {'depth': depth})
                for k in n.children:
                    if isinstance(k, Node) and k.tag in ('ul', 'ol'): self.walk(k, depth + 1)
                return
        if n.tag in CONTAINERS and not has_block(n) and not has_button(n) and n.tag not in ('ul', 'ol', 'dl'):
            # Zeile aus mehreren Inline-Teilen (Schlusszeile, Rechtszeile, Copyright): als eine Zeile, Links mit |
            kids = [k for k in n.children if isinstance(k, Node) and not skipped(k)]
            if len(kids) >= 2 and all(k.tag == 'a' for k in kids):
                self.blocks.append(('zeile', ' | '.join(clean(txt(k, 'de')) for k in kids),
                                    ' | '.join(clean(txt(k, 'en')) for k in kids), {}))
            else:
                self.add('zeile', n)
            return
        if n.tag in CONTAINERS or n.tag in TEXTBLOCKS or has_block(n) or has_button(n) or n.tag == '#root':
            for k in n.children:
                if isinstance(k, str):
                    if k.strip():
                        self.blocks.append(('zeile', clean(k), clean(k), {}))
                else:
                    self.walk(k, depth)
            return
        self.add('zeile', n)  # freistehendes Inline-Element (Eyebrow, Name, Kicker)


def meta_of(root):
    out = {}
    for n in root.iter():
        if n.tag == 'title':
            out['title'] = (clean(''.join(c for c in n.children if isinstance(c, str))), n.attrs.get('data-en', ''))
        if n.tag == 'meta' and n.attrs.get('name') == 'description':
            out['description'] = (n.attrs.get('content', ''), n.attrs.get('data-en', ''))
        if n.tag == 'meta' and n.attrs.get('property') in ('og:title', 'og:description', 'og:image:alt'):
            out[n.attrs['property']] = (n.attrs.get('content', ''), n.attrs.get('data-en', n.attrs.get('content', '')))
    return out


def body_of(root, keep_footer=False):
    body = next(n for n in root.iter() if n.tag == 'body')
    if keep_footer: return body
    return body


def render_md(blocks, L, title, meta, page_url, other_lang_file):
    i = 1 if L == 'de' else 2
    lines = ['# %s' % title, '',
             ('Seite: ' if L == 'de' else 'Page: ') + page_url,
             ('Sprache: Deutsch (die englische Fassung steht in ' if L == 'de' else 'Language: English (the German version is in ') + other_lang_file + ')', '']
    if meta:
        lines += ['## ' + ('Seitentitel und Beschreibung (Suchmaschinen, Social Media)' if L == 'de' else 'Page title and description (search engines, social media)'), '']
        names = {'title': ('Seitentitel', 'Page title'), 'description': ('Beschreibung', 'Description'),
                 'og:title': ('Titel Social Media', 'Social media title'), 'og:description': ('Beschreibung Social Media', 'Social media description'),
                 'og:image:alt': ('Bildbeschreibung Social Media', 'Social media image description')}
        for k, (de, en) in meta.items():
            lines.append('- %s: %s' % (names[k][0 if L == 'de' else 1], de if L == 'de' else (en or de)))
        lines.append('')
    last = None
    for kind, de, en, extra in blocks:
        t = de if L == 'de' else en
        if kind == 'abschnitt':
            sid = extra.get('id')
            lab = t or sid
            if lab:
                lines += ['', '## ' + lab, '']
            continue
        if not t: continue
        if kind == 'titel':
            lvl = min(6, max(3, extra.get('level', 2) + 1))
            lines += ['', '#' * lvl + ' ' + t, '']
        elif kind == 'punkt':
            lines.append('  ' * extra.get('depth', 0) + '- ' + t.replace('\n', ' '))
        elif kind in ('knopf', 'verweis', 'grafik'):
            href = extra.get('href_de' if L == 'de' else 'href_en')
            name = {'knopf': ('Schaltfläche', 'Button'), 'verweis': ('Verweis', 'Link'), 'grafik': ('Grafik', 'Graphic')}[kind]
            q = '«%s»' % t if L == 'de' else '“%s”' % t
            lines += ['', name[0 if L == 'de' else 1] + ': ' + q + (' → %s' % href if href else ''), '']
        elif kind == 'bild':
            src = os.path.basename(extra['src'])
            lines += ['', '![%s](../../bilder/%s)' % (t, img_target(extra['src'])), '']
        elif kind == 'zitat':
            lines += ['', '> ' + t.replace('\n', '\n> '), '']
        elif kind == 'adresse':
            lines += ['', t.replace('\n', '  \n'), '']
        else:
            if last == 'punkt': lines.append('')
            lines += [t.replace('\n', '  \n'), '']
        last = kind
    s = '\n'.join(lines)
    s = re.sub(r'\n{3,}', '\n\n', s).strip() + '\n'
    return s


def img_target(src):
    b = os.path.basename(src)
    stem = os.path.splitext(b)[0]
    if '/v2/' in src: return 'fotos/%s.jpg' % stem
    if '/logo/' in src: return 'logo/' + b
    return 'weitere/' + os.path.splitext(b)[0] + ('.jpg' if b.endswith('.webp') else os.path.splitext(b)[1])


def banner_html():
    js = open(os.path.join(SRC, 'assets/js/main.js'), encoding='utf-8').read()
    m = re.search(r"wrap\.innerHTML =(.*?);\n", js, re.S)
    if not m: sys.exit('Cookie-Hinweis in main.js nicht gefunden')
    parts = re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))
    return ''.join(parts).replace("' + dhref + '", 'datenschutz.html')


def main():
    today = datetime.date.today()
    pkg = os.path.join(REL, 'iro-swiss-www-%s.zip' % today.strftime('%Y%m%d'))
    if not os.path.isfile(pkg): sys.exit('Zuerst das Upload-Paket bauen: python3 _handover/tools/golive/build_release.py')
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    base = os.path.join(OUT, 'iro-website-archiv-%s' % today.strftime('%Y%m%d'))
    for d in ('texte/de', 'texte/en', 'stil', 'firma', 'bilder/fotos', 'bilder/logo', 'bilder/badges', 'bilder/weitere', 'website'):
        os.makedirs(os.path.join(base, d), exist_ok=True)

    units, images = [], {}
    # 1) Seiten
    for fname, outname, t_de, t_en in PAGES:
        root = parse(open(os.path.join(SRC, fname), encoding='utf-8').read())
        meta = meta_of(root)
        w = Walker(); w.walk(next(n for n in root.iter() if n.tag == 'body'))
        url = SITE + ('' if fname == 'index.html' else fname)
        for L, T, other in (('de', t_de, '../en/%s.md' % outname), ('en', t_en, '../de/%s.md' % outname)):
            open(os.path.join(base, 'texte', L, outname + '.md'), 'w', encoding='utf-8').write(
                render_md(w.blocks, L, 'IdeeRoth AG - ' + T, meta, url, other))
        section = ''
        for k, (de, en) in meta.items():
            units.append({'seite': fname, 'abschnitt': 'meta', 'art': k, 'de': de, 'en': en or de})
        for kind, de, en, extra in w.blocks:
            if kind == 'abschnitt':
                section = extra.get('id') or de; continue
            u = {'seite': fname, 'abschnitt': section, 'art': kind, 'de': de, 'en': en}
            if kind == 'knopf': u['ziel_de'], u['ziel_en'] = extra['href_de'], extra['href_en']
            if kind == 'titel': u['ebene'] = extra.get('level')
            if kind == 'bild':
                u['datei'] = 'bilder/' + img_target(extra['src'])
                im = images.setdefault(extra['src'], {'datei': u['datei'], 'quelle': extra['src'], 'alt_de': de, 'alt_en': en, 'verwendet': []})
                place = '%s#%s' % (fname, section) if section else fname
                if place not in im['verwendet']: im['verwendet'].append(place)
            units.append(u)

    # 2) Gemeinsame Teile: Navigation, Footer der Unterseiten, Cookie-Hinweis
    root = parse(open(os.path.join(SRC, 'karriere.html'), encoding='utf-8').read())
    blocks = []
    for sel, name_de, name_en in (('hdr__nav', 'Hauptnavigation (Kopfzeile)', 'Main navigation (header)'),
                                  ('menu', 'Menü (Handy und Tablet)', 'Menu (phone and tablet)'),
                                  ('subfoot', 'Footer der Unterseiten', 'Footer of the subpages')):
        node = next(n for n in root.iter() if sel in n.cls())
        save = set(SKIP_CLASSES); SKIP_CLASSES.difference_update({'menu', 'subfoot'})
        w = Walker(); w.walk(node); SKIP_CLASSES.clear(); SKIP_CLASSES.update(save)
        blocks.append(('titel', name_de, name_en, {'level': 2}))
        blocks += [b for b in w.blocks if b[0] != 'abschnitt']
    w = Walker(); w.walk(parse(banner_html()))
    blocks.append(('titel', 'Cookie-Hinweis (erscheint beim ersten Besuch)', 'Cookie notice (shown on the first visit)', {'level': 2}))
    blocks += w.blocks
    for L, T, other in (('de', 'Gemeinsame Teile aller Seiten', '../en/00-gemeinsam.md'), ('en', 'Parts shared by all pages', '../de/00-gemeinsam.md')):
        open(os.path.join(base, 'texte', L, '00-gemeinsam.md'), 'w', encoding='utf-8').write(
            render_md(blocks, L, 'IdeeRoth AG - ' + T, {}, SITE, other))
    for kind, de, en, extra in blocks:
        if kind not in ('abschnitt', 'titel') or extra.get('level') != 2:
            units.append({'seite': 'alle', 'abschnitt': 'gemeinsam', 'art': kind, 'de': de, 'en': en})

    # 3) Texteinheiten als JSON und CSV
    json.dump({'stand': today.isoformat(), 'quelle': 'r1/ (Website www.iro.swiss)', 'einheiten': units},
              open(os.path.join(base, 'texte', 'texte.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(base, 'texte', 'texte.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        wr = csv.writer(f, delimiter=';'); wr.writerow(['seite', 'abschnitt', 'art', 'de', 'en'])
        for u in units: wr.writerow([u['seite'], u['abschnitt'], u['art'], u['de'], u['en']])

    # 4) Bilder: Fotos als JPG (aus den Web-Dateien der Live-Seite), Logos, Badges, Social-Media-Bild
    from PIL import Image
    rows = []
    for src, im in sorted(images.items(), key=lambda kv: kv[1]['datei']):
        sp = os.path.join(SRC, src); dp = os.path.join(base, im['datei'])
        if not os.path.isfile(sp): sys.exit('Bild fehlt: ' + src)
        if dp.endswith('.jpg') and sp.endswith('.webp'):
            Image.open(sp).convert('RGB').save(dp, 'JPEG', quality=92, optimize=True, progressive=True)
        else:
            shutil.copy2(sp, dp)
        w_, h_ = Image.open(dp).size
        nr = os.path.splitext(os.path.basename(src))[0]
        note = ('Personen KI-bearbeitet: Gesichter der Mitarbeitenden durch erfundene Personen ersetzt' if nr in INVENTED
                else 'Personen KI-bearbeitet: Mitarbeiterin echt, übrige Gesichter durch erfundene Personen ersetzt' if nr in PARTLY
                else 'zeigt den Inhaber (unverändert)' if nr in OWNER
                else 'Mitarbeiterin im Original (unverändert)' if nr == '04' else '')
        rows.append(dict(im, groesse='%d x %d' % (w_, h_), hinweis=note))
    for f in sorted(os.listdir(os.path.join(SRC, 'assets/img/logo'))):
        if f.endswith('.png') and f not in ('logo-color.png', 'logo-light.png'):
            shutil.copy2(os.path.join(SRC, 'assets/img/logo', f), os.path.join(base, 'bilder/logo', f))
    shutil.copy2(os.path.join(REPO, '_handover/logo/logo-original-iro-swiss.png'), os.path.join(base, 'bilder/logo/logo-original-iro-swiss.png'))
    for f in ('badge-lehrbetrieb.png', 'badge-nafems-member.png'):
        shutil.copy2(os.path.join(SRC, 'assets/img', f), os.path.join(base, 'bilder/badges', f))
    shutil.copy2(os.path.join(SRC, 'assets/img/og.jpg'), os.path.join(base, 'bilder/weitere/og.jpg'))
    rows.append({'datei': 'bilder/weitere/og.jpg', 'quelle': 'assets/img/og.jpg', 'groesse': '1200 x 630',
                 'alt_de': 'Offene Glastüren des Firmengebäudes der IdeeRoth AG zur Terrasse',
                 'alt_en': 'Open glass doors of the IdeeRoth AG building onto the terrace',
                 'verwendet': ['Vorschaubild beim Teilen der Seite (Social Media, Messenger)'], 'hinweis': ''})
    json.dump(rows, open(os.path.join(base, 'bilder', 'bilder.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(base, 'bilder', 'bilder.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        wr = csv.writer(f, delimiter=';'); wr.writerow(['datei', 'groesse', 'alt_de', 'alt_en', 'verwendet', 'hinweis'])
        for r in rows: wr.writerow([r['datei'], r['groesse'], r['alt_de'], r['alt_en'], ' | '.join(r['verwendet']), r['hinweis']])

    # 5) Vorlagen (Stil, Firma, LIESMICH) und Upload-Paket
    for f in os.listdir(os.path.join(HERE, 'vorlagen')):
        target = {'LIESMICH.md': '', 'Firmendaten.md': 'firma'}.get(f, 'stil')
        s = open(os.path.join(HERE, 'vorlagen', f), encoding='utf-8').read().replace('{{STAND}}', today.strftime('%d.%m.%Y'))
        open(os.path.join(base, target, f), 'w', encoding='utf-8').write(s)
    shutil.copy2(pkg, os.path.join(base, 'website', os.path.basename(pkg)))
    # PowerPoint-Vorlage im Website-Design mit Anleitung, Beispieldecks als PDF und Schrift Inter
    pp = os.path.join(REPO, '_handover/powerpoint/out')
    os.makedirs(os.path.join(base, 'vorlage/schrift'), exist_ok=True)
    for f in ('IdeeRoth_Vorlage.potx', 'IdeeRoth_Vorlage_Anleitung.pdf', 'IdeeRoth_Beispiel_DE.pdf', 'IdeeRoth_Beispiel_EN.pdf'):
        shutil.copy2(os.path.join(pp, f), os.path.join(base, 'vorlage', f))
    for f in sorted(os.listdir(os.path.join(pp, 'paket/fonts'))):
        shutil.copy2(os.path.join(pp, 'paket/fonts', f), os.path.join(base, 'vorlage/schrift', f))

    # 6) Kontrolle: Wording-Regeln in allen Textdateien
    bad = []
    for r, _, fs in os.walk(base):
        for f in fs:
            if f.endswith(('.md', '.json', '.csv')):
                t = open(os.path.join(r, f), encoding='utf-8-sig').read()
                for w_ in ('–', '—', 'ß', ';' if f.endswith('.md') else None):
                    if w_ and w_ in t and not (w_ == ';' and f in ('Textstil-und-Wording.md',)):
                        bad.append('%s enthaelt %r' % (os.path.relpath(os.path.join(r, f), base), w_))
                for w_ in ('Siemens', 'Ansys', 'Flow-3D', 'Simcenter', 'Teamcenter', 'Nastran', 'Bodensee'):
                    if w_ in t and f not in ('Textstil-und-Wording.md',): bad.append('%s enthaelt %s' % (f, w_))
    if bad: print('\n'.join(bad)); sys.exit('Kontrolle fehlgeschlagen')

    # 7) ZIP
    zpath = os.path.join(REL, 'iro-website-archiv-%s.zip' % today.strftime('%Y%m%d'))
    if os.path.exists(zpath): os.remove(zpath)
    n = 0
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for r, ds, fs in os.walk(base):
            ds.sort()
            for f in sorted(fs):
                p = os.path.join(r, f); z.write(p, os.path.relpath(p, OUT)); n += 1
    print('OK: %d Dateien, %d Texteinheiten, %d Bilder -> %s (%.1f MB)' % (n, len(units), len(rows), os.path.relpath(zpath, REPO), os.path.getsize(zpath) / 1e6))


if __name__ == '__main__':
    main()
