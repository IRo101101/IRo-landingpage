# IdeeRoth AG Website (iro.swiss) - Projektregeln

Diese Regeln gelten fuer jede Aenderung an dieser Website. Sie stammen aus den
Vorgaben von Alain Roth (IdeeRoth AG) und sind verbindlich.

## Inhalt / Wording
- NIE erwaehnen: Siemens, NX, Ansys, Flow-3D, Simcenter, Teamcenter, Nastran, "Bodensee".
- Keine Gedankenstriche (– oder —). Nur Bindestriche (-). Mittelpunkte (·) sind erlaubt.
- Keine Unterstreichungen, nirgends (auch nicht bei Links oder im Consent-Banner).
- Das Lehrstellen-Inserat auf karriere.html bleibt verbatim und nur auf Deutsch.
- Alle Kontaktadressen auf iro.swiss (info@iro.swiss, datenschutz@iro.swiss).
- Sichtbare Texte: "aus der Schweiz" statt "aus Romanshorn" (Meta/SEO darf Romanshorn nennen).

## Zweisprachigkeit (DE/EN) - immer beide Sprachen gleich stark pflegen
- Deutsch ist der Default im HTML, Englisch steht in `data-en`-Attributen.
- `data-en` nur auf Blatt-Elementen (Text wird per textContent ersetzt, Kind-Tags gehen verloren).
- Buttons: Text im `<span class="btn__label" data-en="...">`, nie `data-en` auf dem Button selbst
  (sonst loescht der Sprachwechsel den Pixel-Canvas). `prepareButtons()` in main.js kapselt automatisch.
- Meta title/description jeder Seite tragen `data-en`.
- Jede Aenderung in DE UND EN pruefen (Sprachwechsel, Layout, Overflow).

## Technik
- Reine statische Seite (HTML/CSS/Vanilla-JS), keine externen Skripte/Fonts. Fonts selbst gehostet.
- Google Analytics (G-P2GWBZFYTZ) nur nach Opt-in (Consent-Banner). CSP in .htaccess.
- Cache-Busting: CSS und JS werden 1 Jahr gecacht. Bei JEDER Aenderung an styles.css oder main.js
  die Version `?v=YYYYMMDD` in ALLEN vier HTML-Dateien hochzaehlen, sonst sehen Besucher altes CSS.
- Hero-Titel (Text-Pressure): Beim Zerlegen in Buchstaben-Spans haengt das Leerzeichen am letzten
  Buchstaben jedes Wortes (`tp-char--sp`, white-space:pre). NIE reine Leerzeichen-Textknoten
  zwischen Wort-Spans setzen - Text-Extraktoren/Crawler verwerfen sie und lesen "Developmorefromless".
- Effekte muessen `prefers-reduced-motion` respektieren (Titel statisch, keine Pixel-Buttons).
- Safari: `backdrop-filter` immer mit `-webkit-`-Praefix.
- Sehr schmale Geraete (<= 350px): Kontaktzeilen stapeln (siehe Media-Query 420px).
- Nach Aenderungen: Playwright-Sweep ueber 4 Seiten x Viewports (320-1440) x DE/EN,
  Kriterien: kein horizontaler Overflow, keine Konsolenfehler.

## Deployment
- Hostpoint, Upload ins `www`-Verzeichnis per FTP (FileZilla). `.htaccess` (versteckt) mit hochladen.
- Das ZIP fuer den Upload enthaelt: .htaccess, 4 HTML, robots.txt, sitemap.xml, site.webmanifest,
  Favicons, assets/. NICHT: _parkiert/, README.md, CLAUDE.md, .git.
- www.iro.swiss ist kanonisch; ideeroth.ch leitet per 301 um.

## Geparkte Inhalte
- `_parkiert/offene-stellen.html`: Abschnitt "Offene Stellen" (2 Junior-Positionen), ausgebaut Juli 2026.
  Wiedereinsetzen laut `_parkiert/README.md`, wenn es wieder offene Stellen gibt.

## v2-Redesign (Branch `v2-redesign`) - Vorschau ueber GitHub Pages
- Vorschau-URL: https://iro101101.github.io/IRo-landingpage/ (Pages-Quelle: Branch `v2-redesign`, Ordner `/`).
- Der Live-Stand (v1) liegt unveraendert auf `claude/iro-skill-designsystem-access-0i426w`; Live-Site = Hostpoint-Upload.
- v2 NUR mit RELATIVEN Pfaden bauen (`assets/...`, `karriere.html`, nie `/assets/...`), damit sie auf dem
  Pages-Unterpfad UND spaeter im Hostpoint-www-Root identisch laeuft.
- Waehrend der Vorschau-Phase: `<meta name="robots" content="noindex, nofollow">` auf allen Seiten und
  robots.txt `Disallow: /`. Beim Go-live beides entfernen und sitemap.xml wieder anlegen.
- `.nojekyll` muss im Root bleiben (sonst ignoriert Pages `_`-Ordner).
- Alle uebrigen Regeln oben (Wording, DE/EN, Cache-Version, Effekte) gelten auch fuer v2.
