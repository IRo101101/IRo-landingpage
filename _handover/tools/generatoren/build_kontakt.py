import os, re, shutil
# Baut r1/kontakt.html aus karriere.html (Kopf, Header, Menue, Footer), setzt die Kontakt-Links auf allen Seiten auf
# kontakt.html, ergaenzt die Datenschutzerklaerung, legt r1/.htaccess mit frame-src an, zaehlt die Cache-Version hoch.
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
R = ROOT + '/r1/'
VER_OLD, VER_NEW = '20261009d', '20261009e'
GM = 'https://www.google.com/maps/dir/?api=1&amp;destination=IdeeRoth+AG+Hafenstrasse+62+8590+Romanshorn'
AM = 'https://maps.apple.com/directions?destination=Hafenstrasse%2062,%208590%20Romanshorn,%20Schweiz'
SBB_DE = 'https://www.sbb.ch/de?nach=8590+Romanshorn,+Hafenstrasse+62'
SBB_EN = 'https://www.sbb.ch/en?nach=8590+Romanshorn,+Hafenstrasse+62'
MAP = 'https://map.geo.admin.ch/#/embed?lang=%s&amp;center=2746262,1270375&amp;z=9&amp;bgLayer=ch.swisstopo.pixelkarte-grau&amp;layers=ch.bav.haltestellen-oev&amp;crosshair=marker,2746262,1270375&amp;noSimpleZoom=true'

kar = open(R + 'karriere.html').read()
head_end = kar.index('<main id="main" class="sub">')
foot_start = kar.index('</main>')
head = kar[:head_end]
tail = kar[foot_start:]
# Kopf anpassen
head = head.replace('<title data-en="Careers - IdeeRoth AG">Karriere - IdeeRoth AG</title>', '<title data-en="Contact and directions - IdeeRoth AG">Kontakt und Anreise - IdeeRoth AG</title>')
head = re.sub(r'<meta name="description"[^>]*>', '<meta name="description" data-en="Contact IdeeRoth AG in Romanshorn: address, phone, e-mail, map and directions by car, train and ferry from Friedrichshafen." content="Kontakt zur IdeeRoth AG in Romanshorn: Adresse, Telefon, E-Mail, Karte und Anreise mit Auto, Bahn und Fähre ab Friedrichshafen.">', head, count=1)
head = head.replace('href="https://www.iro.swiss/karriere.html"', 'href="https://www.iro.swiss/kontakt.html"')
# aria-current im Header-Menue: Karriere raus, Kontakt rein (nach dem Link-Umbau unten)
tail = tail.replace('<a href="karriere.html" aria-current="page" data-en="Careers">Karriere</a>', '<a href="karriere.html" data-en="Careers">Karriere</a>')
tail = tail.replace('<a href="kontakt.html" data-en="Contact">Kontakt</a>', '<a href="kontakt.html" aria-current="page" data-en="Contact">Kontakt</a>')

main = '''<main id="main" class="sub">
  <div class="sub__head">
  <span class="eyebrow sub__reveal" data-en="Contact">Kontakt</span>
  <h1 data-en="How to reach us.">So erreichen Sie uns.</h1>
  <p class="lead sub__reveal" data-en="Hafenstrasse 62 lies at the harbour of Romanshorn, a few minutes on foot from the railway station and the ferry. Write to us, call us or come by.">Die Hafenstrasse 62 liegt am Hafen von Romanshorn, wenige Gehminuten von Bahnhof und Fähre. Schreiben Sie uns, rufen Sie an oder kommen Sie vorbei.</p>
  </div>
  <div class="srows">
  <section class="srow">
    <div class="srow__main">
      <span class="srow__eyebrow">01 //  <span data-en="Contact">Kontakt</span></span>
      <h2 class="srow__name" data-en="Contact address">Kontaktadresse</h2>
    </div>
    <div class="srow__body">
  <address>
    IdeeRoth AG<br>
    Hafenstrasse 62<br>
    CH-8590 Romanshorn<br><br>
    <span data-en="Phone">Tel</span> <a href="tel:+41718558855">+41 71 855 88 55</a><br>
    Mail <a href="mailto:info@iro.swiss">info@iro.swiss</a><br>
    <span data-en="Contact person">Ansprechperson</span> Alain Roth
  </address>
  <p class="actions">
    <a class="dbtn dbtn--light" href="mailto:info@iro.swiss?subject=Anfrage%%20IdeeRoth%%20AG"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Write e-mail">E-Mail schreiben</span></a>
    <a class="dbtn dbtn--light" href="tel:+41718558855"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Call">Anrufen</span></a>
  </p>
    </div>
  </section>
  <section class="srow">
    <div class="srow__main">
      <span class="srow__eyebrow">02 //  <span data-en="Contact">Kontakt</span></span>
      <h2 class="srow__name" data-en="Hafenstrasse 62, right at the harbour.">Hafenstrasse 62, direkt am Hafen.</h2>
    </div>
    <div class="srow__body">
  <div class="kmap" data-map data-src="%s" data-src-en="%s" data-title="Karte: IdeeRoth AG, Hafenstrasse 62, 8590 Romanshorn" data-en-title="Map: IdeeRoth AG, Hafenstrasse 62, 8590 Romanshorn" role="region" aria-label="Karte des Standorts" data-en-label="Map of the location">
    <p class="kmap__note" data-en="The map loads when you scroll here (Geoportal of the Swiss Confederation, map.geo.admin.ch).">Die Karte lädt beim Scrollen hierher (Geoportal des Bundes, map.geo.admin.ch).</p>
  </div>
  <p class="kmap__hint" data-en="Map: Geoportal of the Swiss Confederation (map.geo.admin.ch, swisstopo). The mouse wheel zooms the map with Ctrl or Cmd held down.">Karte: Geoportal des Bundes (map.geo.admin.ch, swisstopo). Das Mausrad zoomt die Karte mit gedrückter Ctrl- oder Cmd-Taste.</p>
  <p class="routes">
    <span class="routes__label" data-en="Get directions">Route planen</span>
    <a href="%s" target="_blank" rel="noopener">Google Maps</a>
    <a href="%s" target="_blank" rel="noopener" data-en="Apple Maps">Apple Karten</a>
    <a href="%s" data-en-href="%s" target="_blank" rel="noopener" data-en="SBB timetable">SBB-Fahrplan</a>
  </p>
    </div>
  </section>
  <section class="srow">
    <div class="srow__main">
      <span class="srow__eyebrow">03 //  <span data-en="Directions">Anreise</span></span>
      <h2 class="srow__name" data-en="How to find us.">So finden Sie zu uns.</h2>
    </div>
    <div class="srow__body">
  <h3 data-en="By car">Mit dem Auto</h3>
  <p data-en="Hafenstrasse 62 lies at the harbour of Romanshorn. [[DIRECTIONS BY CAR: motorway exit and route to Hafenstrasse]] Parking: [[PARKING]]."><span class="todo">[[ANFAHRT AUTO: Autobahnausfahrt und Weg bis zur Hafenstrasse]]</span> Die Hafenstrasse 62 liegt am Hafen von Romanshorn. Parkplätze: <span class="todo">[[PARKPLÄTZE]]</span>.</p>
  <h3 data-en="By train and bus">Mit Bahn und Bus</h3>
  <p data-en="From Romanshorn railway station it is a few minutes on foot along the harbour to Hafenstrasse 62. [[BUS: line and stop, if desired]]">Ab Bahnhof Romanshorn sind es wenige Gehminuten dem Hafen entlang bis zur Hafenstrasse 62. <span class="todo">[[BUS: Linie und Haltestelle, falls gewünscht]]</span></p>
  <h3 data-en="By boat">Mit dem Schiff</h3>
  <p data-en="The ferry from Friedrichshafen docks at Romanshorn harbour. From the ferry it is a few minutes on foot to us.">Die Fähre ab Friedrichshafen legt im Hafen Romanshorn an. Von der Fähre sind es wenige Gehminuten zu uns.</p>
  <h3 data-en="Entrance and deliveries">Eingang und Anlieferung</h3>
  <p data-en="Entrance: [[ENTRANCE: bell, floor]]. Delivery of samples: [[DELIVERIES: times, address, contact person]].">Eingang: <span class="todo">[[EINGANG: Klingel, Stockwerk]]</span>. Anlieferung von Mustern: <span class="todo">[[ANLIEFERUNG: Zeiten, Adresse, Ansprechperson]]</span>.</p>
    </div>
  </section>
  </div>

  <p class="sub__reveal"><a class="dbtn dbtn--light sub__back" href="index.html"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Back to home">Zurück zur Startseite</span></a></p>
''' % (MAP % 'de', MAP % 'en', GM, AM, SBB_DE, SBB_EN)
open(R + 'kontakt.html', 'w').write(head + main + tail)
print('kontakt.html geschrieben')

# Kontakt-Links: Header-Navigation, Burger-Menue, Footer, Schiene -> kontakt.html; "Projekt starten" bleibt beim Abspann
for f in ['index.html', 'karriere.html', 'kontakt.html', 'impressum.html', 'datenschutz.html']:
    s = open(R + f).read(); n0 = s
    s = s.replace('<a href="#kontakt" data-en="Contact">Kontakt</a>', '<a href="kontakt.html" data-en="Contact">Kontakt</a>')
    s = s.replace('<a href="index.html#kontakt" data-en="Contact">Kontakt</a>', '<a href="kontakt.html" data-en="Contact">Kontakt</a>')
    s = s.replace('<a class="al" href="#kontakt"><span class="al__label" data-en="Contact">Kontakt</span>', '<a class="al" href="kontakt.html"><span class="al__label" data-en="Contact">Kontakt</span>')
    s = s.replace('<a class="al" href="index.html#kontakt"><span class="al__label" data-en="Contact">Kontakt</span>', '<a class="al" href="kontakt.html"><span class="al__label" data-en="Contact">Kontakt</span>')
    if f == 'kontakt.html':
        s = s.replace('<a href="kontakt.html" data-en="Contact">Kontakt</a>', '<a href="kontakt.html" aria-current="page" data-en="Contact">Kontakt</a>', 1)
        s = s.replace('<a href="karriere.html" aria-current="page" data-en="Careers">Karriere</a>', '<a href="karriere.html" data-en="Careers">Karriere</a>')
    s = s.replace('?v=' + VER_OLD + '"', '?v=' + VER_NEW + '"')
    open(R + f, 'w').write(s); print(f, 'Links/Version aktualisiert' if s != n0 else 'unveraendert')
# Schiene der Startseite: Kontakt-Link nach Karriere
idx = open(R + 'index.html').read()
anchor = '''        <a class="al" href="karriere.html"><span class="al__label" data-en="Careers">Karriere</span><span class="al__arrow" aria-hidden="true"></span></a>
      </nav>'''
assert anchor in idx
idx = idx.replace(anchor, '''        <a class="al" href="karriere.html"><span class="al__label" data-en="Careers">Karriere</span><span class="al__arrow" aria-hidden="true"></span></a>
        <a class="al" href="kontakt.html"><span class="al__label" data-en="Contact">Kontakt</span><span class="al__arrow" aria-hidden="true"></span></a>
      </nav>''')
open(R + 'index.html', 'w').write(idx); print('index.html Schiene: Kontakt-Link ergaenzt')
for f in ['vorschau-uebergaenge.html', 'vorschau-layouts.html', 'vorschau-footer.html', 'vorschau-standort.html', 'vorschau-logo.html']:
    s = open(R + f).read(); open(R + f, 'w').write(s.replace('?v=' + VER_OLD + '"', '?v=' + VER_NEW + '"'))

# Datenschutz: Abschnitt Karte und Routenplanung
ds = open(R + 'datenschutz.html').read()
row = '''  <section class="srow">
    <div class="srow__main">
      <span class="srow__eyebrow">11 //  <span data-en="Privacy policy">Datenschutz</span></span>
      <h2 class="srow__name" data-en="Map and route planning">Karte und Routenplanung</h2>
    </div>
    <div class="srow__body">
  <p data-en="The map on our contact page comes from the Geoportal of the Swiss Confederation (map.geo.admin.ch, Federal Office of Topography swisstopo). It loads as soon as you scroll to the map area. When it loads, technically necessary data is transmitted to the Confederation, in particular your IP address and browser information. The Confederation's privacy policy applies to this processing: https://www.admin.ch/gov/de/start/rechtliches.html">Die Karte auf unserer Kontaktseite stammt vom Geoportal des Bundes (map.geo.admin.ch, Bundesamt für Landestopografie swisstopo). Sie lädt, sobald Sie zum Kartenbereich scrollen. Beim Laden werden technisch nötige Daten an den Bund übertragen, insbesondere Ihre IP-Adresse und Browserangaben. Für diese Verarbeitung gilt die Datenschutzerklärung des Bundes: <a href="https://www.admin.ch/gov/de/start/rechtliches.html" target="_blank" rel="noopener">www.admin.ch/gov/de/start/rechtliches.html</a></p>
  <p data-en="The route links lead to Google Maps, Apple Maps and SBB. Data only flows once you click a link; from then on the provisions of the respective provider apply.">Die Routen-Links führen zu Google Maps, Apple Karten und zur SBB. Daten fliessen erst, wenn Sie einen Link anklicken; danach gelten die Bestimmungen des jeweiligen Anbieters.</p>
    </div>
  </section>
  </div>

  <p class="sub__reveal"><a class="dbtn dbtn--light sub__back"'''
assert ds.count('  </div>\n\n  <p class="sub__reveal"><a class="dbtn dbtn--light sub__back"') == 1
ds = ds.replace('  </div>\n\n  <p class="sub__reveal"><a class="dbtn dbtn--light sub__back"', row, 1)
open(R + 'datenschutz.html', 'w').write(ds); print('datenschutz.html: Abschnitt 11 ergaenzt')

# .htaccess fuer v2 (r1): CSP mit frame-src map.geo.admin.ch, ohne CARTO
ht = open(ROOT + '/.htaccess').read()
ht2 = ht.replace(' https://*.basemaps.cartocdn.com', '').replace("frame-ancestors 'self'\"", "frame-ancestors 'self'; frame-src https://map.geo.admin.ch\"")
assert 'frame-src https://map.geo.admin.ch' in ht2 and 'cartocdn' not in ht2
open(R + '.htaccess', 'w').write(ht2); print('r1/.htaccess geschrieben')
