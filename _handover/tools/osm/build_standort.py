# Baut r1/vorschau-standort.html aus Bausteinen (Abspann der Startseite, Footer B-1, drei Standort-Varianten)
import os
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'r1', 'vorschau-standort.html'))
SYM = open(os.path.join(HERE, 'lageplan-symbol.svg')).read()   # aus make_maps.py
GM = 'https://www.google.com/maps/search/?api=1&amp;query=IdeeRoth+AG+Hafenstrasse+62+8590+Romanshorn'
AM = 'https://maps.apple.com/?address=Hafenstrasse%2062,%208590%20Romanshorn,%20Schweiz&amp;q=IdeeRoth%20AG'
ARROW = '<span class="swap" aria-hidden="true"><span class="swap__a"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"/></svg></span></span>'
AL_ARROW = '<span class="al__arrow swap" aria-hidden="true"><span class="swap__a"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"/></svg></span></span>'

def rail_links(sub):
    p = 'index.html' if sub else ''
    items = [(p + '#kompetenzen', 'Expertise', 'Kompetenzen'), (p + '#unternehmen', 'Company', 'Unternehmen'), (p + '#leistungen', 'Services', 'Leistungen'), (p + '#team', None, 'Team'), ('karriere.html', 'Careers', 'Karriere')]
    out = ['<nav class="rail__links" aria-label="Abschnitte">']
    for href, en, de in items:
        lab = '<span class="al__label"%s>%s</span>' % ((' data-en="%s"' % en) if en else '', de)
        out.append('  <a class="al" href="%s">%s%s</a>' % (href, lab, AL_ARROW))
    out.append('</nav>')
    return '\n'.join(out)

BADGES = '''<a href="https://www.nafems.org" target="_blank" rel="noopener" aria-label="NAFEMS - nafems.org (neues Fenster)"><img src="assets/img/badge-nafems-member.png" alt="NAFEMS Member" width="165" height="150" loading="lazy"></a>
<a href="https://www.berufsbildungplus.ch" target="_blank" rel="noopener" aria-label="Berufsbildung - Wir machen Profis, berufsbildungplus.ch (neues Fenster)"><img src="assets/img/badge-lehrbetrieb.png" alt="Lehrbetrieb - Wir machen Profis" width="130" height="130" loading="lazy"></a>'''

LINKS = ('<div class="site__links">'
         '<a class="site__open" href="' + GM + '" target="_blank" rel="noopener"><span data-en="Open in Maps">In Maps öffnen</span>' + ARROW + '</a>'
         '<a class="site__open site__open--alt" href="' + AM + '" target="_blank" rel="noopener"><span data-en="Apple Maps">Apple Karten</span>' + ARROW + '</a>{TOGGLE}</div>')
CREDIT = '<span class="site__credit">© OpenStreetMap</span>'

def tile(v, cls):
    if v == 's1':
        t = ('<a class="site__tile" href="%s" target="_blank" rel="noopener" aria-label="Standort in Google Maps öffnen (neues Fenster)" data-en-label="Open location in Google Maps (new window)">'
             '<img src="assets/img/map/standort.webp" alt="Karte: Hafenstrasse 62, 8590 Romanshorn" width="1600" height="1000" loading="lazy">%s</a>') % (GM, CREDIT)
        links = LINKS.replace('{TOGGLE}', '')
    elif v == 's2':
        t = ('<a class="site__tile" href="%s" target="_blank" rel="noopener" aria-label="Standort in Google Maps öffnen (neues Fenster)" data-en-label="Open location in Google Maps (new window)">'
             '<svg class="site__plan" viewBox="0 0 800 500" aria-hidden="true" focusable="false"><use href="#lageplan"/></svg>%s</a>') % (GM, CREDIT)
        links = LINKS.replace('{TOGGLE}', '')
    else:
        t = ('<div class="site__tile site__tile--load">'
             '<img src="assets/img/map/standort.webp" alt="" aria-hidden="true" width="1600" height="1000" loading="lazy">'
             '<div class="site__map" data-map hidden></div>'
             '<div class="site__consent"><button type="button" class="dbtn site__load" data-map-load><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Load map">Karte laden</span></button>'
             '<p class="site__hint" data-en="Loads map tiles from swisstopo (Swiss Confederation); until then no request leaves the page.">Lädt Kartenkacheln von swisstopo (Bund); bis dahin verlässt keine Anfrage die Seite.</p></div>'
             '</div>')
        links = LINKS.replace('{TOGGLE}', '<button type="button" class="site__toggle" data-map-toggle data-label-plain="Original grau" data-label-dark="Dunkel"><span>Original grau</span></button>')
    return '<div class="%s">\n%s\n%s\n</div>' % (cls, t, links)

def contact(v):
    return '''<section class="contact vst-a" aria-label="Startseite - Abspann mit Standort %s">
  <div class="contact__photo"><div class="contact__layer"><img src="assets/img/v2/17.webp" alt="Aussenansicht des Firmengebäudes mit Weg" loading="lazy"></div></div>
  <div class="rail">
    <a class="rail__logo" href="index.html" aria-label="IdeeRoth AG - Startseite" data-en-label="IdeeRoth AG - Home"><span class="logo-lock" role="img" aria-label="iro.swiss"></span></a>
%s
    <div class="rail__badges" aria-label="Mitgliedschaften und Auszeichnungen">
%s
    </div>
%s
    <address class="rail__details">
      <a href="tel:+41718558855">+41 71 855 88 55</a>
      <a href="mailto:info@iro.swiss">info@iro.swiss</a>
      <span>IdeeRoth AG<br>Hafenstrasse 62<br>CH-8590 Romanshorn</span>
    </address>
  </div>
  <div class="contact__close right">
    <h2 data-en="Let's talk about your project.">Sprechen wir über Ihr Projekt.</h2>
    <div class="contact__ctas">
      <a class="dbtn" href="mailto:info@iro.swiss?subject=Projektanfrage%%20IdeeRoth%%20AG"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Write e-mail">E-Mail schreiben</span></a>
      <a class="dbtn" href="tel:+41718558855"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Call">Anrufen</span></a>
    </div>
  </div>
  <div class="contact__legal">
    <a class="rl-link" href="impressum.html"><span class="rl" data-en="Legal notice">Impressum</span></a><span aria-hidden="true">/</span>
    <a class="rl-link" href="datenschutz.html"><span class="rl" data-en="Privacy">Datenschutz</span></a><span aria-hidden="true">/</span>
    <a class="rl-link" href="#" data-cookie-settings><span class="rl" data-en="Cookie settings">Cookie-Einstellungen</span></a>
  </div>
  <div class="contact__copy">© 2026 IdeeRoth AG</div>
</section>''' % (v.upper(), rail_links(False), BADGES, tile(v, 'rail__site'))

SAMPLE = '''<div class="vf-sample">
  <div class="sub">
    <div class="srows">
      <section class="srow">
        <div class="srow__main">
          <span class="srow__eyebrow">04 //  <span data-en="Legal notice">Impressum</span></span>
          <h2 class="srow__name" data-en="Links">Haftung für Links</h2>
        </div>
        <div class="srow__body">
          <p data-en="References and links to third-party websites lie outside our area of responsibility. Any responsibility for such websites is rejected. Access to and use of such websites is at the user's own risk.">Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr der Nutzerin oder des Nutzers.</p>
        </div>
      </section>
    </div>
    <p><a class="dbtn dbtn--light sub__back" href="index.html"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Back to home">Zurück zur Startseite</span></a></p>
  </div>
</div>'''

def footer(v):
    return '''<footer class="subfoot vfb vfb-1" aria-label="Unterseiten - Footer B-1 mit Standort %s">
  <div class="vfb__inner">
    <div class="vfb__col">
      <a class="rail__logo vfb__logo" href="index.html" aria-label="IdeeRoth AG - Startseite" data-en-label="IdeeRoth AG - Home"><span class="logo-lock" role="img" aria-label="iro.swiss"></span></a>
      <address class="vfb__address">
        <span class="vfb__name">IdeeRoth AG</span>
        <span>Hafenstrasse 62</span>
        <span>CH-8590 Romanshorn</span>
        <a href="tel:+41718558855">+41 71 855 88 55</a>
        <a href="mailto:info@iro.swiss">info@iro.swiss</a>
      </address>
%s
      <div class="vfb__copy">© 2026 IdeeRoth AG</div>
    </div>
    <nav class="vfb__col vfb__links" aria-label="Abschnitte">
      <a href="index.html#kompetenzen" data-en="Expertise">Kompetenzen</a>
      <a href="index.html#unternehmen" data-en="Company">Unternehmen</a>
      <a href="index.html#leistungen" data-en="Services">Leistungen</a>
      <a href="index.html#team">Team</a>
      <a href="karriere.html" data-en="Careers">Karriere</a>
      <a href="index.html#kontakt" data-en="Contact">Kontakt</a>
    </nav>
    <div class="vfb__col">
      <span class="vfb__badges">
%s
      </span>
      <nav class="vfb__legal" aria-label="Rechtliches">
        <a href="impressum.html" data-en="Legal notice">Impressum</a>
        <a href="datenschutz.html" data-en="Privacy">Datenschutz</a>
        <a href="#" data-cookie-settings data-en="Cookie settings">Cookie-Einstellungen</a>
      </nav>
    </div>
  </div>
</footer>''' % (v.upper(), tile(v, 'rail__site vfb__site'), BADGES)

VARIANTS = [
  ('s1', 'S-1 · Statisches Kartenbild, selbst gehostet (Empfehlung)', 'S-1 · Static map image, self-hosted (recommended)',
   'Einmal aus OpenStreetMap-Daten in den Farben der Site gerendert: Carbon Black, Gebäude und Strassen in Steel-Gray-Tönen, Wasser dunkler, Grünflächen leicht getönt, Pin in Signal Green, Beschriftung nur Hafenstrasse, Bahnhof und Hafen. Ausschnitt 800 x 500 m, 1600 x 1000 px als WebP mit 43 KB. Keine Drittanfrage, kein Schlüssel, kein Datenschutz-Zusatz. Klick auf die Kachel öffnet Google Maps in einem neuen Fenster, darunter die Links für Google und Apple Karten. Quellenangabe in der Kachelecke; im Impressum kommt der Link auf openstreetmap.org/copyright dazu.',
   'Rendered once from OpenStreetMap data in the colours of the site: Carbon Black, buildings and streets in Steel Gray tones, darker water, tinted green areas, pin in Signal Green, labels only Hafenstrasse, Bahnhof and Hafen. Extent 800 x 500 m, 1600 x 1000 px as WebP at 43 KB. No third-party request, no key, no privacy addendum. Clicking the tile opens Google Maps in a new window, below it the links for Google and Apple Maps. Credit in the corner of the tile; the legal notice adds the link to openstreetmap.org/copyright.'),
  ('s2', 'S-2 · Gezeichneter Lageplan (SVG)', 'S-2 · Drawn site plan (SVG)',
   'Dieselben Daten auf das Wesentliche reduziert: Uferlinie, Hafenbecken, Molen, Hauptstrassen, Bahn und Bahnhof als Linien in Steel Gray, Beschriftung in Fresh Mint, Pin in Signal Green. 20 KB als Inline-SVG, scharf in jeder Grösse, per CSS einfärbbar (auch für einen hellen Footer) und mit der Feder-Engine animierbar, etwa Linien, die sich beim Einblenden zeichnen. Links und Quellenangabe wie S-1.',
   'The same data reduced to the essentials: shoreline, harbour basins, piers, main streets, railway and station as lines in Steel Gray, labels in Fresh Mint, pin in Signal Green. 20 KB as inline SVG, crisp at any size, colourable via CSS (also for a light footer) and animatable with the spring engine, for example lines drawing themselves on reveal. Links and credit as in S-1.'),
  ('s3', 'S-3 · Zwei-Klick-Karte (Leaflet lokal, Kacheln von swisstopo)', 'S-3 · Two-click map (local Leaflet, tiles from swisstopo)',
   'Vor dem Klick dieselbe Kachel wie S-1 mit dem Button "Karte laden". Erst nach dem Klick startet Leaflet (lokal, 162 KB) und holt die Kacheln von swisstopo (Bund, ohne Schlüssel, Server in der Schweiz). Hier zur Demonstration dunkel gefiltert, mit Umschalter auf die graue Originalkarte; Zoom und Verschieben wie in v1, Mausrad erst nach Klick in die Karte. In der Umsetzung merkt sich die Seite die Zustimmung, und die Datenschutzerklärung nennt swisstopo. Mit CARTO-Schlüssel wäre auch der dunkle Stil von v1 möglich, dann mit einem US-Anbieter.',
   'Before the click the same tile as S-1 with the button "Load map". Only after the click Leaflet starts (local, 162 KB) and fetches the tiles from swisstopo (Swiss Confederation, no key, servers in Switzerland). Shown here darkened by a filter, with a switch to the grey original; zoom and pan as in v1, mouse wheel only after clicking into the map. In the implementation the page remembers the consent and the privacy policy names swisstopo. With a CARTO key the dark style of v1 would also be possible, then with a US provider.'),
]

parts = []
parts.append('''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title data-en="Location variants - Preview r1">Standort-Varianten - Vorschau r1</title>
<meta name="description" data-en="Internal preview: location and map variants for the iro.swiss v2 redesign (r1)." content="Interne Vorschau: Standort- und Kartenvarianten für das iro.swiss v2-Redesign (r1).">
<meta name="theme-color" content="#111418">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preload" href="assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/styles.css?v=20261009">
<link rel="stylesheet" href="assets/css/vorschau-layouts.css">
<link rel="stylesheet" href="assets/css/vorschau-footer.css">
<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">
<link rel="stylesheet" href="assets/css/vorschau-standort.css">
</head>
<body class="vl vf vst">
<a class="skip" href="#main" data-en="Skip to content">Zum Inhalt springen</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
%s
</defs></svg>

<header class="vl__hdr">
  <a class="vl__logo" href="index.html" aria-label="IdeeRoth AG - Startseite" data-en-label="IdeeRoth AG - Home"><span class="logo-mark" role="img" aria-label="iro.swiss"></span></a>
  <span class="vl__title">Vorschau r1 · Standort-Varianten</span>
  <nav aria-label="Vorschauseiten">
    <a href="vorschau-layouts.html" data-en="Layouts">Layouts</a>
    <a href="vorschau-uebergaenge.html" data-en="Transitions">Übergänge</a>
    <a href="vorschau-footer.html">Footer</a>
    <a href="vorschau-standort.html" aria-current="page" data-en="Location">Standort</a>
    <a href="vorschau-logo.html">Logo</a>
  </nav>
</header>

<main id="main">
  <div class="vl__intro">
    <span class="eyebrow" data-en="Preview r1 · decision page">Vorschau r1 · Entscheidungsseite</span>
    <h1 data-en="Location and map">Standort und Karte</h1>
    <p data-en="v2 has no location element yet; the live site (v1) has a Leaflet map in the contact block that has been broken since 25 Sep 2026 (CARTO delivers tiles without a key only as a watermark). The original prompt knows no location or map block. All three variants use the same place: on the start page a tile in the black rail between badges and address, on the subpages column 1 of the footer below the address (shown here with B-1). The tile links to Google Maps, below it the links for Google and Apple Maps.">v2 hat noch kein Standort-Element; die Live-Site (v1) hat eine Leaflet-Karte im Kontaktblock, die seit dem 25.09.2026 kaputt ist (CARTO liefert Kacheln ohne Schlüssel nur noch als Wasserzeichen). Der Original-Prompt kennt keinen Standort- oder Kartenblock. Alle drei Varianten nutzen denselben Platz: auf der Startseite eine Kachel in der schwarzen Schiene zwischen Badges und Adresse, auf den Unterseiten Spalte 1 des Footers unter der Adresse (hier mit B-1 gezeigt). Die Kachel verlinkt auf Google Maps, darunter die Links für Google und Apple Karten.</p>
    <p data-en="The map images were rendered from OpenStreetMap data (ODbL) for the section 800 x 500 m around Hafenstrasse 62: harbour, station and the shore. No lake name, no third-party request at runtime, no key. From 768 px the closing block of the start page needs 50rem of height instead of 46 to 47.75rem; below 768 px everything stacks as on the site.">Die Kartenbilder sind aus OpenStreetMap-Daten (ODbL) für den Ausschnitt 800 x 500 m um die Hafenstrasse 62 gerendert: Hafen, Bahnhof und das Ufer. Kein Seename, keine Drittanfrage zur Laufzeit, kein Schlüssel. Ab 768 px braucht der Abspann der Startseite 50rem Höhe statt 46 bis 47.75rem; unter 768 px stapelt alles wie auf der Site.</p>
    <p class="vl__note" data-en="Recommendation: S-1, the static image; S-2 if the drawn look is preferred; S-3 only if zooming on the page itself matters.">Empfehlung: S-1, das statische Bild; S-2, wenn der gezeichnete Look gefällt; S-3 nur, wenn das Zoomen auf der Seite selbst wichtig ist.</p>
    <nav class="vl__toc" aria-label="Varianten">
      <a href="#s-1">S-1</a><a href="#s-2">S-2</a><a href="#s-3">S-3</a>
    </nav>
  </div>

  <section class="vl__block" id="block-standort" aria-labelledby="vl-h-s">
    <div class="vl__blockhead">
      <span class="eyebrow" data-en="Location · three variants">Standort · drei Varianten</span>
      <h2 id="vl-h-s" data-en="Start page and subpages">Startseite und Unterseiten</h2>
      <p data-en="For each variant first the closing block of the start page (shortened as in F-A, 50rem), then the end of a subpage with footer B-1. Links, buttons and the two-click map work; the motion engine does not run here.">Zu jeder Variante zuerst der Abspann der Startseite (verkürzt wie bei F-A, 50rem), dann das Ende einer Unterseite mit Footer B-1. Links, Buttons und die Zwei-Klick-Karte funktionieren; die Bewegungs-Engine läuft hier nicht.</p>
    </div>
''' % SYM)
for v, de, en, dtxt, etxt in VARIANTS:
    parts.append('''  <article class="vl__variant" id="%s">
    <div class="vl__meta">
      <span class="eyebrow" data-en="%s">%s</span>
      <p data-en="%s">%s</p>
    </div>
    <p class="vst__ctx"><span class="eyebrow" data-en="Start page · closing block">Startseite · Abspann</span></p>
%s
    <p class="vst__ctx"><span class="eyebrow" data-en="Subpages · footer B-1">Unterseiten · Footer B-1</span></p>
%s
%s
  </article>
''' % (v.replace('s', 's-'), en, de, etxt.replace('"', '&quot;'), dtxt, contact(v), SAMPLE, footer(v)))
parts.append('''  </section>

  <p class="vl__foot"><span data-en="Internal preview, not indexed. Map data: OpenStreetMap contributors (ODbL), tiles of the two-click map: swisstopo.">Interne Vorschau, nicht indexiert. Kartendaten: OpenStreetMap-Mitwirkende (ODbL), Kacheln der Zwei-Klick-Karte: swisstopo.</span> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">openstreetmap.org/copyright</a> · <a href="vorschau-footer.html" data-en="Footer variants">Footer-Varianten</a> · <a href="index.html" data-en="Start page">Startseite</a></p>
</main>
<script src="assets/vendor/leaflet/leaflet.js" defer></script>
<script src="assets/js/vorschau-standort.js" defer></script>
</body>
</html>
''')
html = ''.join(parts)
open(OUT, 'w').write(html)
print('written', OUT, len(html) // 1024, 'KB')
