# IdeeRoth AG — Website (iro.swiss)

Statische One-Pager-Website der IdeeRoth AG. **Kein Server, kein CMS, keine Datenbank** — nur HTML, CSS, JS, Schriften und Bilder. Alles läuft direkt im Browser.

## Auf Hostpoint hochladen

1. Bei Hostpoint einloggen → Dateimanager (oder FTP-Programm wie FileZilla).
2. Ins Verzeichnis **`www`** wechseln (das ist das öffentliche Web-Verzeichnis deiner Domain).
3. **Den gesamten Inhalt dieses Ordners** dort hineinladen — also `index.html`, die `.html`-Unterseiten, den Ordner `assets/`, die Favicon-Dateien, `.htaccess`, `robots.txt`, `sitemap.xml`, `site.webmanifest`.
   - Wichtig: Der **Inhalt** kommt ins `www`, nicht der Ordner selbst. Im `www` muss direkt `index.html` liegen.
4. Domain im Browser öffnen → die Seite läuft sofort.

> Bei Aktualisierungen einfach die geänderten Dateien erneut hochladen (überschreiben).

## Struktur

```
www/
├─ index.html              # One-Pager (Start)
├─ impressum.html
├─ datenschutz.html
├─ karriere.html
├─ .htaccess               # Kompression, Caching, Sicherheit (Apache)
├─ robots.txt · sitemap.xml · site.webmanifest
├─ favicon.ico · favicon-*.png · apple-touch-icon.png · android-chrome-*.png
└─ assets/
   ├─ css/styles.css       # Design System (Farben, Typo, Layout)
   ├─ js/main.js           # Sprache, Navigation, Effekte
   ├─ fonts/               # selbst gehostet (Gasoek One, Inter, Newsreader)
   └─ img/                 # Logos, Service-Bilder, Galerie
```

## Sprache (DE / EN)

- Die Seite erkennt die **Browser-Sprache**: beginnt sie mit „de", erscheint Deutsch, sonst Englisch.
- Oben rechts kann jederzeit **manuell** umgeschaltet werden; die Wahl merkt sich der Browser.
- Deutsche Texte stehen sichtbar im HTML (für Suchmaschinen), englische in `data-en`-Attributen.

## Inhalte ändern

- **Texte:** direkt in der jeweiligen `.html` — Deutsch im Text, Englisch im `data-en="…"` daneben.
- **Farben / Schrift / Abstände:** zentral in `assets/css/styles.css` (Abschnitt „Tokens").
- **Bilder:** in `assets/img/` austauschen (gleicher Dateiname = kein weiterer Aufwand). Markenregel: Schwarzweiss mit **einem** grünen Element.
- **Kontaktdaten** stehen in `index.html`, `impressum.html`, `datenschutz.html`, `karriere.html` und im JSON-LD (`index.html`, Kopfbereich).

## Domain / SEO

- **Hauptdomäne (kanonisch): `https://www.iro.swiss`** — verwendet in Canonical-Tags,
  `sitemap.xml`, `robots.txt`, Open Graph und JSON-LD.
- **Zweitdomäne `www.ideeroth.ch`** bleibt erreichbar, wird aber per `.htaccess`
  dauerhaft (301) auf `www.iro.swiss` weitergeleitet — so entsteht bei Google
  kein doppelter Inhalt und der Linkwert bündelt sich auf der Hauptdomäne.
- **In Hostpoint einrichten:** beide Domains (`iro.swiss` inkl. `www` und
  `ideeroth.ch` inkl. `www`) auf dasselbe `www`-Verzeichnis aufschalten und für
  beide das kostenlose **SSL-Zertifikat (Let's Encrypt)** aktivieren. Die
  Weiterleitungs- und HTTPS-Regeln stehen bereits in der `.htaccess`.
  - Falls `ideeroth.ch` stattdessen **eigenständig** (ohne Weiterleitung) laufen
    soll, in der `.htaccess` den Block „1) ideeroth.ch → …" auskommentieren.
- Nach dem Livegang: `www.iro.swiss` in der **Google Search Console** verifizieren
  und `sitemap.xml` einreichen.

## Design System

Farben, Typografie und Komponenten folgen dem **IdeeRoth Design System**
(Grün `#4DAF47` nur Fläche · grüner Text `#2E7D2A` · Schiefer `#243440` · Hairlines statt Schatten ·
Gasoek One / Inter / Newsreader). Schriften sind selbst gehostet — es werden keine externen
Dienste (z. B. Google Fonts) aufgerufen, was den Datenschutz vereinfacht.
