#!/usr/bin/env python3
"""Baut das Upload-Paket fuer Hostpoint aus r1/.

Aufruf (im Repo-Root):  python3 _handover/tools/golive/build_release.py
Ergebnis:               _release/www/                     (Inhalt fuer das www-Verzeichnis)
                        _release/iro-swiss-www-YYYYMMDD.zip  (dasselbe als ZIP, Dateien direkt auf oberster Ebene)

Was der Build macht:
- nimmt nur die Live-Seiten (index, karriere, kontakt, impressum, datenschutz, 404) und die Dateien, auf die sie
  verweisen; Vorschauseiten, Vorschau-CSS/JS, Leaflet, unbenutzte Fotos bleiben draussen
- entfernt "noindex" (ausser auf 404.html), schreibt robots.txt und sitemap.xml fuer www.iro.swiss
- Links auf index.html werden zu "./" (die .htaccess leitet /index.html auf / um)
- 404.html bekommt absolute Pfade (/assets/..., /kontakt.html), weil Apache sie unter jeder Adresse ausliefert
- minifiziert HTML, CSS und JS ohne Kommentare (minify.js, Node-Pakete aus package.json)
- prueft danach: keine Entwicklungsspuren im Paket, alle internen Verweise vorhanden
"""
import datetime, hashlib, json, os, re, shutil, subprocess, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SRC = os.path.join(REPO, 'r1')
REL = os.path.join(REPO, '_release')
OUT = os.path.join(REL, 'www')
SITE = 'https://www.iro.swiss/'
PAGES = ['index.html', 'karriere.html', 'kontakt.html', 'impressum.html', 'datenschutz.html', '404.html']
SITEMAP = [('', '1.0', 'monthly'), ('kontakt.html', '0.7', 'yearly'), ('karriere.html', '0.6', 'monthly'),
           ('impressum.html', '0.3', 'yearly'), ('datenschutz.html', '0.3', 'yearly')]
ROOT_FILES = ['.htaccess', 'site.webmanifest', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png',
              'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png']
# Woerter, die im Paket nicht vorkommen duerfen (Entwicklungsspuren, fremde Dienste ausser Google)
FORBIDDEN = ['Northwall', 'getlayers', 'Prompt', 'Kundenentscheid', 'Kunde ', 'Lenis', 'lenis', 'swisstopo',
             'geo.admin', 'leaflet', 'Leaflet', 'vorschau', 'Vorschau', 'Higgsfield', 'Claude', 'Anthropic',
             'noindex, nofollow', 'TODO', '[[', 'r1:', 'r1 ', 'Bodensee', '.IRO=', '@vorschau']
REF = re.compile(r'''(?:href|src|content)="([^"#?]+)(?:[?#][^"]*)?"|url\(\s*['"]?([^'")?#]+)''')


def run(cmd, **kw):
    print('$', ' '.join(cmd)); subprocess.run(cmd, check=True, **kw)


def transform_html(name, s):
    if name == '404.html':
        s = s.replace('<meta name="robots" content="noindex, nofollow">', '<meta name="robots" content="noindex">')
        # absolute Pfade: Apache zeigt 404.html unter beliebigen Adressen (/a/b/c)
        s = re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|/|data:)(index\.html)?', lambda m: m.group(1) + '="/', s)
    else:
        s = s.replace('<meta name="robots" content="noindex, nofollow">\n', '').replace('<meta name="robots" content="noindex, nofollow">', '')
        s = re.sub(r'href="index\.html(#[^"]*)?"', lambda m: 'href="./' + (m.group(1) or '') + '"', s)
    return s


def main():
    today = datetime.date.today()
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)

    # 1) Seiten
    for p in PAGES:
        s = open(os.path.join(SRC, p), encoding='utf-8').read()
        open(os.path.join(OUT, p), 'w', encoding='utf-8').write(transform_html(p, s))

    # 2) feste Dateien
    for f in ROOT_FILES:
        shutil.copy2(os.path.join(SRC, f), os.path.join(OUT, f))
    for f in ['assets/css/styles.css', 'assets/js/main.js', 'assets/fonts/inter.woff2']:
        os.makedirs(os.path.dirname(os.path.join(OUT, f)), exist_ok=True)
        shutil.copy2(os.path.join(SRC, f), os.path.join(OUT, f))
    # Schnittstelle fuer die Vorschauseiten (window.IRO) gehoert nicht auf die Live-Site
    js = os.path.join(OUT, 'assets/js/main.js'); t = open(js, encoding='utf-8').read()
    t, n = re.subn(r'/\* @vorschau-begin \*/.*?/\* @vorschau-end \*/', '', t, flags=re.S)
    if n != 1: sys.exit('main.js: Vorschau-Block nicht gefunden')
    open(js, 'w', encoding='utf-8').write(t)

    # 3) alle Dateien, auf die Seiten, CSS, JS und Manifest verweisen (rekursiv)
    texts = [open(os.path.join(OUT, p), encoding='utf-8').read() for p in PAGES]
    texts += [open(os.path.join(OUT, f), encoding='utf-8').read() for f in ['assets/css/styles.css', 'assets/js/main.js', 'site.webmanifest']]
    refs = set()
    for t in texts:
        for m in REF.finditer(t):
            u = (m.group(1) or m.group(2) or '').strip()
            if u.startswith(SITE): u = u[len(SITE):]
            if re.match(r'^(https?:|mailto:|tel:|data:|#|//)', u) or not u: continue
            u = u.lstrip('/')
            if u.startswith('assets/') or u in ROOT_FILES: refs.add(u)
    # absolute Adressen in Strukturdaten (JSON-LD) und Meta-Angaben
    for t in texts:
        for m in re.finditer(re.escape(SITE) + r'(assets/[^"\s]+)', t): refs.add(m.group(1))
    # CSS-url() sind relativ zu assets/css/
    css = open(os.path.join(OUT, 'assets/css/styles.css'), encoding='utf-8').read()
    for m in re.finditer(r'url\(\s*[\'"]?(\.\./[^\'")?#]+)', css):
        refs.add(os.path.normpath(os.path.join('assets/css', m.group(1))))
    for f in json.load(open(os.path.join(SRC, 'site.webmanifest'))).get('icons', []):
        refs.add(f['src'].lstrip('/'))
    missing = []
    for u in sorted(refs):
        s = os.path.join(SRC, u)
        if os.path.isfile(s):
            if os.path.exists(os.path.join(OUT, u)): continue   # schon bearbeitet (main.js ohne Vorschau-Block)
            os.makedirs(os.path.dirname(os.path.join(OUT, u)) or OUT, exist_ok=True)
            shutil.copy2(s, os.path.join(OUT, u))
        elif not os.path.isdir(s):
            missing.append(u)
    if missing: sys.exit('FEHLT: ' + ', '.join(missing))

    # 3b) Bilder mit Inhalts-Kennung versionieren (?v=...): Bilder sind 6 Monate gecacht, ein ersetztes Foto mit
    #     gleichem Namen kaeme sonst bei wiederkehrenden Besuchern nicht an
    vers = {}
    for u in refs:
        if u.startswith('assets/img/') and os.path.isfile(os.path.join(OUT, u)):
            vers[u] = hashlib.md5(open(os.path.join(OUT, u), 'rb').read()).hexdigest()[:8]
    def stamp(path, rel_prefix=''):
        t = open(path, encoding='utf-8').read()
        for u, h in vers.items():
            for pre in ('', '/', SITE, rel_prefix):
                if pre == '' and rel_prefix: continue
                t = re.sub(re.escape(pre + (u[len('assets/'):] if pre == rel_prefix and rel_prefix else u)) + r'(?=["\')\s])', lambda m: m.group(0) + '?v=' + h, t)
        open(path, 'w', encoding='utf-8').write(t)
    for p in PAGES: stamp(os.path.join(OUT, p))
    stamp(os.path.join(OUT, 'assets/css/styles.css'), rel_prefix='../')

    # 4) robots.txt und sitemap.xml
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n' % SITE)
    urls = ''.join('  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n  </url>\n'
                   % (SITE, loc, today.isoformat(), freq, prio) for loc, prio, freq in SITEMAP)
    open(os.path.join(OUT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')

    # 5) minifizieren (installiert die Node-Pakete beim ersten Lauf)
    if not os.path.isdir(os.path.join(HERE, 'node_modules')):
        run(['npm', 'install', '--no-audit', '--no-fund'], cwd=HERE)
    run(['node', os.path.join(HERE, 'minify.js'), OUT])

    # 6) Kontrollen
    problems = []
    for root, _, files in os.walk(OUT):
        for f in files:
            p = os.path.join(root, f)
            if not f.endswith(('.html', '.css', '.js', '.txt', '.xml', '.webmanifest', '.htaccess')): continue
            t = open(p, encoding='utf-8').read()
            for w in FORBIDDEN:
                if f == '404.html' and w == 'noindex, nofollow': continue
                if w in t: problems.append('%s enthaelt "%s"' % (os.path.relpath(p, OUT), w))
            if f.endswith('.html') and ('<!--' in t): problems.append(os.path.relpath(p, OUT) + ' enthaelt HTML-Kommentar')
            if re.search('[–—]', t): problems.append(os.path.relpath(p, OUT) + ' enthaelt Gedankenstrich')
    if problems:
        print('\n'.join(problems)); sys.exit('Kontrolle fehlgeschlagen')

    # 7) ZIP (Dateien auf oberster Ebene, .htaccess eingeschlossen)
    zpath = os.path.join(REL, 'iro-swiss-www-%s.zip' % today.strftime('%Y%m%d'))
    if os.path.exists(zpath): os.remove(zpath)
    n = 0
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for root, dirs, files in os.walk(OUT):
            dirs.sort()
            for f in sorted(files):
                p = os.path.join(root, f); z.write(p, os.path.relpath(p, OUT)); n += 1
    size = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
    print('OK: %d Dateien, %.1f MB entpackt, ZIP %.1f MB -> %s' % (n, size / 1e6, os.path.getsize(zpath) / 1e6, os.path.relpath(zpath, REPO)))


if __name__ == '__main__':
    main()
