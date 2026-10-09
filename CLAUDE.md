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
- Eine Variante B (Ordner `b/`, 08.10.2026) wurde dem Kunden gezeigt und verworfen: Der Stand vom 30.09. ist
  die Basis, Aenderungen daran nur Punkt fuer Punkt mit dem Kunden (Liste: `V2-VIDEOVERGLEICH.md`).
- Runde 1 seit 08.10.2026: Root bleibt der Stand vom 30.09. (Vergleichsbasis, nicht anfassen), Ordner `r1/` ist die
  Arbeitskopie (eigene assets/, Cache-Version 20261008), Vorschau https://iro101101.github.io/IRo-landingpage/r1/ .
  Entscheidungsseiten dort: `r1/vorschau-uebergaenge.html` (sieben Fotouebergaenge aus dem Prompt, gemeinsame Uhr,
  Takt- und Tempo-Regler) und `r1/vorschau-layouts.html` (Varianten Unternehmen U-A/B/C, Karten K-A/B/C, Team T-A/B/C).
  Nach dem Entscheid des Kunden wird `r1/` zum Root; die Vorschauseiten kommen nicht mit auf die Live-Site.
- v2 NUR mit RELATIVEN Pfaden bauen (`assets/...`, `karriere.html`, nie `/assets/...`), damit sie auf dem
  Pages-Unterpfad UND spaeter im Hostpoint-www-Root identisch laeuft.
- Waehrend der Vorschau-Phase: `<meta name="robots" content="noindex, nofollow">` auf allen Seiten und
  robots.txt `Disallow: /`. Beim Go-live beides entfernen und sitemap.xml wieder anlegen.
- `.nojekyll` muss im Root bleiben (sonst ignoriert Pages `_`-Ordner).
- Alle uebrigen Regeln oben (Wording, DE/EN, Cache-Version, Effekte) gelten auch fuer v2.

### v2-Technik (Stand 30.09.2026)
- Aufbau nach der "Northwall"-Bauanleitung (Feder-Engine, ein Ticker, Wort-fuer-Wort-Text, Ladepanel,
  fester Boden Carbon Black <-> Ice Mint, Header-Thema per Viewport-Mitte). Alle Zahlen stehen als
  Konstanten oben in `assets/js/main.js`. Lenis lokal unter `assets/vendor/lenis/`.
- Farben: Carbon Black #111418, Ice Mint #E7FFF2, Signal Green #25C77A, Steel Gray #707981, Fresh Mint #B7F3D0.
- Logo als CSS-Maske (`assets/img/logo/mark-white.png`, `lockup-white.png`, `word-white.png`), nimmt `currentColor`.
- Wort-Engine: Leerzeichen haengt am Wort-Span (`.w__i`, white-space:pre), `column-gap:0` - crawler-sicher.
  `data-en` auf Elementen mit Wort-Engine/RollLabel/Zaehler funktioniert ueber `el.__setText` (main.js applyLang).
- Chrome rechnet `clip-path` des Ziels in IntersectionObserver ein: maskierte Elemente (`.card__mask`,
  `.team__mask`) nie direkt beobachten, sondern den unmaskierten Elternknoten (`Inview(..., {watch: el})`).
- Fotos: `assets/img/v2/NN.webp` (Desktop) und `NN-m.webp` (mobil); Nummern = Kontaktblatt 01-21.
  Hero 07, Team 16, Kontakt 17, Karten 09/11/13/14, Prozess 19/15/10/21/03, Rotation 01/05/10/04/12/18/06/15/20/02.
- Kennzahlen im Hero (20+ Jahre, 100+ Projekte, 5 Leistungen) sind PLATZHALTER, vom Kunden zu korrigieren.
- Playwright im Container: `p.chromium.launch(executable_path='/opt/pw-browsers/chromium')`, Test-Skript
  `scratchpad/test_v2.py <port>` (4 Seiten x 6 Viewports x DE/EN, prueft Overflow, Konsolenfehler, Ladepanel);
  fuer r1: `scratchpad/test_v2b.py <port> r1/` (Server auf dem Repo-Root). Nur Chromium verfuegbar: Android-Browser
  (Chrome, Edge, Samsung) sind damit abgedeckt, iOS (alle Browser = WebKit) nicht; WebKit/Firefox liessen sich nur
  installieren, wenn die Netzwerkrichtlinie der Umgebung `playwright.download.prss.microsoft.com` erlaubt.

### r1-Technik (Stand 08.10.2026, nur `r1/`)
- Konstanten: FILL 15/15 und FINISH 37.5/15 (Hochzaehlen doppelt so lang, 100 % nach ca. 1.9 s), GROUND 22.5/13
  (Bodenwechsel ab 768 px doppelt so lang, 90 % in 1.2 s), DIM_OPACITY .45 und DIM_BLUR 2.5 (Prozess); Schrittzeilen
  5.875rem ab 1024 (30 % groesser), Buehne 17.5 x 21.25rem (15 % kleiner), Caption top min(50 % + 18.5rem, 100 % - 8rem).
- Unter 768 px folgt der Boden dem Scrollweg (initGround: Mischfarbe anteilig zur sichtbaren Flaeche beider Sektionen,
  Zone Viewport-Unterkante bis 10 %, Feder GROUND_MOBILE 170/26 glaettet nur); ab 768 px zeitbasiert an der Mitte.
  main.js schreibt die Bodenfarbe pro Frame in `--ground-rgb`; der Header ist unter 1024 px damit deckend.
- Unter 768 px: Prozess gestapelt (Foto oben, Liste, Caption, Leiste 01-05 `.process__bar`, Parallaxe +-20 px),
  `html { font-size: max(14px, 4.102564vw) }`, Mindestgroessen 12 px fuer Versal-Labels, Tap-Ziele 40 px (auch bei
  `pointer: coarse` ab 1024), `.about__band` als Flex-Spalte mit 1.5rem Abstand, Hero-Foto 358/400 mit staerkerem Schleier.
- Kontakt-Parallaxe laeuft auf `.contact__layer` (innerer Layer 120 %), nicht mehr auf `.contact__photo`.
- Header ab 768 px: `.hdr::after` zieht die gestrichelte Unterkante ueber die ganze Breite (wie im Original), der
  Aktions-Button (z-index 1) deckt sie ab; unter 768 px traegt `.hdr` die Unterkante selbst. Am Desktop bleibt der
  Header ohne Hintergrund (Prompt, Kundenentscheid 09.10.); unter 1024 px Milchglas: `--ground-glass` (Bodenfarbe
  mit Alpha .72, schreibt main.js pro Frame) plus backdrop-filter blur(14px) mit -webkit-Praefix.
- Unterseiten (karriere, impressum, datenschutz): Kopf `.sub__head` (Eyebrow, H1, Lead), danach `.srows` mit je einer
  `.srow` pro Abschnitt im Stil der Team-Zeilen: `.srow__main` (Eyebrow "0N //  Seitenname" mit data-en am inneren
  Span, `h2.srow__name`) links, `.srow__body` rechts, unter 768 px gestapelt; Einblenden wie Team-Zeilen (ROW_REVEAL).
  Das Lehrstellen-Inserat (`.job`) liegt unveraendert im Body der Zeile "Lehrstelle 2027". Seitenbreite 64rem wie T-A.
- Anker-Sprung (scrollToHash) nimmt die Layout-Position (offsetTop-Kette), nicht getBoundingClientRect: Der Flow-Scrub
  verschiebt verlassene Bloecke um bis zu 50 px, Spruenge nach oben (Logo, Navigation, Schiene) landeten sonst zu tief.
- Scrub hat `ref` (Element, dessen Kanten den Scrollweg messen). Hero- und Kontakt-Parallaxe messen an der Buehne bzw.
  Aussenbox, nicht am ueberstehenden Layer; sonst steht das Hero-Foto bei Scrollposition 0 schon 5 % tiefer als die
  Finale-Karte und springt beim Ausblenden des Ladepanels. `html { scrollbar-gutter: stable }` gegen den Breitensprung
  bei klassischen Scrollbalken (Windows).
- Rechtszeile: Trenner-Spans sind ausgeblendet, der Schraegstrich haengt per `a ~ a::before` am Link (nie am Zeilenende).
- Unterseiten-Links ohne gestrichelte Linie (Projektregel "keine Unterstreichungen"), Gewicht 500 statt Linie.
- `win.IRO` (Ende von main.js) stellt Group, ticker, Words, Inview, Scrub, Hover und die Federn fuer die Vorschauseiten bereit.
- Foto-Uebergaenge: Bibliothek TRANSITIONS in main.js (dissolve, dissolve-settle, wipe, clear, deal, turn, push; alle
  aus dem Prompt), `PhotoSwap(frame, photos, name)` blendet gestapelte Fotos um. Am Rahmen waehlbar per
  `data-transition`, `data-interval` (ms) und `data-speed` (Tempo-Faktor, Federn tension*k^2, friction*k).
  Kundenentscheid 09.10.2026: Unternehmen = clear, 2 s, Faktor 1.4; andere Bloecke unveraendert (Prozess SWAP_IMG).
- Unternehmen ab 1024 px liegt im Fluss (kein absolut zentriertes Band mehr): `.about` min-height 100lvh als Flex-Spalte,
  `.about__head` oben, `.about__wrap` (Rahmen, Themenliste, Mission; die Mission steht im Markup IM Wrap) mit
  mit festem Abstand 2rem zum Titel (gleich wie seitlich zum Foto); die Gruppe ist im Band zentriert (justify-content center, Ueberschuss oben und
  unten). Bei kurzen Fenstern waechst die Sektion, Titel und Foto koennen nicht kollidieren. Kompetenzen ab 1024 px
  ebenso: Kartenreihe im Fluss, Sektion min-height 100lvh (bei 1920 x 700 ragten die Karten in den Prozessblock).
- Layouts ab 1024 px (Kundenentscheid 09.10.2026): Unternehmen U-A (Themenliste links, Mission rechts neben dem Foto,
  beide an der Rahmenunterkante, kein Einzug), Karten K-A (alle 30rem, xl 34rem), Team T-A (`.team__rows` max-width
  64rem zentriert, Spalten wie Vorlage). Die Vorschauseiten bleiben als Nachschlagewerk in r1.
