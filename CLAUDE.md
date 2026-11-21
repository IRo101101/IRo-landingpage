# IdeeRoth AG Website (iro.swiss) - Projektregeln

Diese Regeln gelten fuer jede Aenderung an dieser Website. Sie stammen aus den
Vorgaben von Alain Roth (IdeeRoth AG) und sind verbindlich.

Zuerst `UEBERGABE.md` lesen (Stand, offene Punkte, Werkzeuge, Ordnerkarte). Kundenentscheide stehen in
`V2-VIDEOVERGLEICH.md`. Alle Skripte und Recherchen liegen in `_handover/` (`tools/`, `recherche/`, `powerpoint/`).

## Inhalt / Wording
- NIE erwaehnen: Siemens, NX, Ansys, Flow-3D, Simcenter, Teamcenter, Nastran, "Bodensee".
- Keine Gedankenstriche (– oder —). Nur Bindestriche (-). Mittelpunkte (·) sind erlaubt.
- Keine Strichpunkte (Semikolon) im sichtbaren Text, DE und EN (Kundenregel 21.11.2026): Komma oder kurze, einfache
  Saetze. Keine aktuellen Verkehrsinformationen (Baustellen, Umleitungen, Schranken); Texte sollen zwei Jahre gelten.
- Keine Unterstreichungen, nirgends (auch nicht bei Links oder im Consent-Banner).
- Das Lehrstellen-Inserat auf karriere.html bleibt verbatim und nur auf Deutsch.
- Alle Kontaktadressen auf iro.swiss (info@iro.swiss, datenschutz@iro.swiss).
- Sichtbare Texte: "aus der Schweiz" statt "aus Romanshorn" (Meta/SEO darf Romanshorn nennen).
- Textlinks (Kundenregel 09.10.2026, gilt fuer v2/r1 und jede neue Seite): Normaler verlinkter Text faerbt sich beim
  Hover gruen, keine Linie. Auf dunklem Grund Fresh Mint `--link-hover-dark` (#B7F3D0), auf hellem Grund Signal Green
  `--link-hover-light` (#25C77A), Uebergang `--duration-fast`. Gilt fuer Telefon, Mail, Adresse, Impressum / Datenschutz /
  Cookie-Einstellungen (Startseite und Footer), Links im Fliesstext der Unterseiten (`.sub a`), Link im Consent-Banner.
  Ausnahmen bleiben wie entworfen: Pfeil-Links `.al` (Schiene, Burger-Menue, "Zur Lehrstelle"), Buttons (`.dbtn`,
  `.cbtn`, Aktions-Button), Header-Navigation, Sprachwahl. Neue Textlinks bekommen eine dieser Klassen oder liegen in `.sub`.

## Hausstil fuer Texte (aus den Projektanweisungen vom 18.10.2026, Skill iro-textstil, wenn verfuegbar)
- Anfuehrungszeichen «so». Tausender mit Apostroph (10'000), Dezimalkomma im Fliesstext (2,5 mm).
- Anrede "Sie". Die Firma spricht als "wir" und bezeichnet sich feminin (Spezialanbieterin, Partnerin). Immer
  "Ansprechperson".
- Headlines sind Aussagesaetze mit Punkt, darueber ein Kicker aus zwei bis vier Woertern.
- Absaetze hoechstens drei Saetze, Verben vor Substantiven, keine Floskeln (massgeschneidert, ganzheitlich, innovativ).
- Schreibweise "IRo" (I und R gross, o klein), in Dateinamen und Domain klein (iro.swiss).
- Keine Fakten erfinden (Zahlen, Referenzen, Zitate, Gehzeiten, Parkplaetze): Platzhalter `[[...]]`, unter offenen
  Punkten sammeln.
- Jeder neue externe Dienst bekommt einen Abschnitt in datenschutz.html; heikle Stellen zur rechtlichen Pruefung markieren.
- Vor jeder Veroeffentlichung zusaetzlich zum Sweep: Tastaturbedienung, Netzwerk-Tab ohne Cookie-Zustimmung (keine
  Anfrage an Google oder Apple), HTML-Validator.

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
- Upload-Paket (seit Go-Live 20.11.2026) nur per Build: `python3 _handover/tools/golive/build_release.py` baut aus `r1/`
  den Ordner `_release/www/` (nicht eingecheckt) und `_release/iro-swiss-www-YYYYMMDD.zip`; Anleitung fuer FileZilla:
  `_release/ANLEITUNG-UPLOAD.md`. Inhalt: .htaccess, 6 HTML (inkl. 404.html), robots.txt (Allow), sitemap.xml,
  site.webmanifest, Favicons, nur die referenzierten assets/. Der Build entfernt noindex (ausser 404), Kommentare und
  Vorschauseiten, minifiziert (minify.js: html-minifier-terser konservativ, clean-css Stufe 1, terser), macht 404.html
  absolut (/assets/...), Links auf index.html zu "./" und bricht ab bei Entwicklungsspuren (Liste FORBIDDEN) oder
  fehlenden Dateien. Vor dem Upload alte v1-Dateien in www loeschen (alte Fotos, Leaflet, alte Schriften).
- www.iro.swiss ist kanonisch; ideeroth.ch leitet per 301 um.
- LIVE seit 20.11.2026 (v2 aus r1). Go-Live-Stand eingefroren als Branch `golive-2026-11-20` (Commit 72a3797 =
  `_release/iro-swiss-www-20261120.zip`; Tags lassen sich aus der Cloud-Umgebung nicht pushen, Proxy 403). Jedes neue
  Paket bekommt das Datum im Namen, alte Pakete bleiben im Repository. Nachtrag 21.11.: `iro-swiss-www-20261121.zip`.
- FREIGEGEBEN 21.11.2026 (Kunde): `_release/iro-swiss-www-20261121c.zip`, eingefroren als Branch `freigabe-2026-11-21`
  (zeigt auf den Commit mit diesem Paket und dem Archiv `iro-website-archiv-20261121c.zip`). Das ist der gueltige
  Live-Stand, sobald der Kunde ihn hochgeladen hat. Eingefrorene Branches nie aendern, neue Staende bekommen einen
  neuen Branch `freigabe-YYYY-MM-DD`.
- Endkontrolle vor jedem Upload: Skripte und Aufrufe in `_handover/tools/golive/endkontrolle/README.md`.
- Archiv fuer Marketing (Finish-File): `python3 _handover/tools/archiv/build_archiv.py` nach dem Release-Build ergibt
  `_release/iro-website-archiv-YYYYMMDD.zip` (Texte je Seite DE/EN als Markdown, texte.json/csv als Paare, Stil,
  Glossar, Design, Firmendaten, Fotos als JPG mit Alt-Texten, Logos, PowerPoint-Vorlage, Upload-Paket). Stilblaetter
  liegen als Vorlagen in `_handover/tools/archiv/vorlagen/`; bei neuen Regeln dort nachfuehren und neu bauen.

## Geparkte Inhalte
- `_parkiert/offene-stellen.html`: Abschnitt "Offene Stellen" (2 Junior-Positionen), ausgebaut Juli 2026.
  Wiedereinsetzen laut `_parkiert/README.md`, wenn es wieder offene Stellen gibt.

## v2-Redesign (Branch `v2-redesign`) - Vorschau ueber GitHub Pages
- Vorschau-URL: https://iro101101.github.io/IRo-landingpage/ (Pages-Quelle: Branch `v2-redesign`, Ordner `/`).
- Live seit 20.11.2026 ist v2 (aus `r1/`, Branch `golive-2026-11-20`); der alte v1-Stand liegt unveraendert auf
  `claude/iro-skill-designsystem-access-0i426w` (nur noch Geschichte). Live-Site = Hostpoint-Upload.
- Eine Variante B (Ordner `b/`, 08.10.2026) wurde dem Kunden gezeigt und verworfen: Der Stand vom 30.09. ist
  die Basis, Aenderungen daran nur Punkt fuer Punkt mit dem Kunden (Liste: `V2-VIDEOVERGLEICH.md`).
  Der Ordner `b/` wurde am 08.10.2026 wieder entfernt und liegt nur noch in der Git-Historie (angelegt mit Commit
  93cb8cb, entfernt mit Commit 2e70474).
- Runde 1 seit 08.10.2026: Root bleibt der Stand vom 30.09. (Vergleichsbasis, nicht anfassen), Ordner `r1/` ist die
  Arbeitskopie (eigene assets/, Cache-Version 20261121a; bei mehreren Aenderungen am selben Tag Buchstabe anhaengen), Vorschau https://iro101101.github.io/IRo-landingpage/r1/ .
  Entscheidungsseiten dort: `r1/vorschau-uebergaenge.html` (sieben Fotouebergaenge aus dem Prompt, gemeinsame Uhr,
  Takt- und Tempo-Regler), `r1/vorschau-layouts.html` (Varianten Unternehmen U-A/B/C, Karten K-A/B/C, Team T-A/B/C)
  und `r1/vorschau-footer.html` (Footer der Unterseiten; Kundenentscheid 09.10.: Richtung F-B, Vorbild Footer
  mediawork.ch = drei gleich breite Textspalten auf Inhaltsbreite, keine Linien, keine Buttons, keine Schlusszeile;
  gezeigt: Heute, B-1 wie Vorbild in Gemischtschreibung, B-2 in Versalien mit Rechtszeile unten, B-3 hell auf Ice Mint;
  eigenes CSS `assets/css/vorschau-footer.css`, laedt nach vorschau-layouts.css) und `r1/vorschau-standort.html`
  (Standort und Karte, Kundenwunsch 09.10.: S-1 statisches Kartenbild `assets/img/map/standort.webp`, 1600 x 1000,
  43 KB, aus OpenStreetMap-Daten gerendert, S-2 gezeichneter Lageplan als Inline-SVG-Symbol `#lageplan`, S-3 Zwei-Klick-
  Karte mit Leaflet lokal unter `assets/vendor/leaflet/` und swisstopo-Kacheln; CSS `vorschau-standort.css`, JS
  `vorschau-standort.js`). Die Karten entstehen aus `_handover/tools/osm/make_maps.py` (Overpass-Daten der Schweizer
  Instanz overpass.osm.ch, ODbL; Quellenangabe "Kartendaten: OpenStreetMap" bleibt Pflicht, kein Seename im Bild).
  Leaflet und die Vorschau-Assets gehoeren nicht auf die Live-Site, solange S-3 nicht gewaehlt ist.
  Dazu `r1/vorschau-logo.html` (+ `assets/css/vorschau-logo.css`): Logo-Kachel nach dem Original (`_handover/logo/
  logo-original-iro-swiss.png`: Kachel 1912 x 1528, Marke als Ausschnitt bei 9.5 % / 44.5 %, 81.9 % breit; SWISS 15 %
  der Kachelbreite hoch, Abstand 5 %) als CSS-Bausteine `.ltile` mit --tile / --mark / --word, Varianten L-1 bis L-4;
  Badges als CSS-Masken `.badge--nafems` / `.badge--lehrbetrieb` in currentColor mit Hover Fresh Mint. Footer-Vorschau
  zusaetzlich mit B-4 (vier Spalten im gestrichelten Raster mit .mk-Punkten).
  Nach dem Entscheid des Kunden wird `r1/` zum Root; die Vorschauseiten kommen nicht mit auf die Live-Site.
- v2 NUR mit RELATIVEN Pfaden bauen (`assets/...`, `karriere.html`, nie `/assets/...`), damit sie auf dem
  Pages-Unterpfad UND spaeter im Hostpoint-www-Root identisch laeuft.
- Waehrend der Vorschau-Phase: `<meta name="robots" content="noindex, nofollow">` auf allen Seiten und
  robots.txt `Disallow: /`. Beim Go-live beides entfernen und sitemap.xml wieder anlegen.
- `.nojekyll` muss im Root bleiben (sonst ignoriert Pages `_`-Ordner).
- Alle uebrigen Regeln oben (Wording, DE/EN, Cache-Version, Effekte) gelten auch fuer v2.

## PowerPoint-Vorlage (Stand 15.10.2026, `_handover/powerpoint/`)
- Vorlage `out/IdeeRoth_Vorlage.potx` (32 Layouts DE/EN, Designfarben, 3 ausgeblendete Referenzfolien), Beispieldecks
  DE/EN, Anleitung; Quellen `lib.js`, `build_template.js`, `build_samples.js`, `finish.py`; Bauanleitung im README dort.
- Fotos der Beispieldecks seit 20.11. aus den Mastern, mit `coverImage()` in lib.js zugeschnitten (vorher gestaucht);
  Folie "Ihre Ansprechpersonen" zeigt unter "Alain Roth" den Inhaber (`p14_portrait.jpg`). Logo-PNG liegen in assets/.
- Kundenentscheide 15.10.: Linie 0.5 pt durchgezogen (Textfarbe 40 %), Fusszeile F-2 senkrecht rechts mit waagrechter
  zentrierter Seitenzahl, Grundfarben Weiss / Mint / Dark, Punkte statt Rechtecke, Ampel-Labels Rot #B8463A / Orange
  #E2A33D / Fresh Mint nur fuer Labels, Kennzeichnung V-2 rot mit Kurzform "Schutzvermerk ISO 16016 beachten",
  Terminplan nach der alten Folie 10, Bausteine als eigene Folie, Schrift Inter (mitgeliefert). Alle Wording-Regeln
  der Website gelten auch dort.

### v2-Technik (Stand 30.09.2026)
- Aufbau nach der "Northwall"-Bauanleitung (Feder-Engine, ein Ticker, Wort-fuer-Wort-Text, Ladepanel,
  fester Boden Carbon Black <-> Ice Mint, Header-Thema per Viewport-Mitte). Alle Zahlen stehen als
  Konstanten oben in `assets/js/main.js`. Weiches Scrollen mit dem Mausrad: eigene Umsetzung `SmoothScroll` in main.js
  (seit Go-Live 20.11.2026, ersetzt Lenis; nur Mausrad, nicht auf Touch und nicht bei reduzierter Bewegung).
- Farben: Carbon Black #111418, Ice Mint #E7FFF2, Signal Green #25C77A, Steel Gray #707981, Fresh Mint #B7F3D0.
- Logo als CSS-Maske (`assets/img/logo/mark-white.png`, `lockup-white.png`, `word-white.png`), nimmt `currentColor`.
- Wort-Engine: Leerzeichen haengt am Wort-Span (`.w__i`, white-space:pre), `column-gap:0` - crawler-sicher.
  `data-en` auf Elementen mit Wort-Engine/RollLabel/Zaehler funktioniert ueber `el.__setText` (main.js applyLang).
- Chrome rechnet `clip-path` des Ziels in IntersectionObserver ein: maskierte Elemente (`.card__mask`,
  `.team__mask`) nie direkt beobachten, sondern den unmaskierten Elternknoten (`Inview(..., {watch: el})`).
- Fotos: `assets/img/v2/NN.webp` (Desktop, 1800 px breit, Hero 2400) und `NN-m.webp` (mobil, 1100 px); Nummern = Kontaktblatt
  01-23 (24-26 = Fassungen von 16, 21, 11, siehe unten). Hero 07, Team 16, Kontakt 17, Karten 09/11/13/14, Prozess 19/15/10/21/22, Rotation 08/05/10/04/27/18/06/15/20/02;
  01 (Espressomaschine) veraltet, das Geraet gibt es nicht mehr: nirgends verwenden (Kundenentscheid 20.11.2026, in der
  Rotation durch 08 Glasfront mit Terrasse ersetzt; der eingefrorene Root zeigt 01 weiter). 12 ebenfalls nirgends verwenden
  (Kunde 20.11., in der Rotation durch 27 ersetzt). 27 = Team am langen Tisch mit der Mitarbeiterin (Master x6, seit 20.11.).
  22 (3D-Drucker druckt Shore-Haertemuster; seit 20.11. die Kundenlieferung mit neuem IRo-Logo auf den Mustern, Prozess 05)
  und 23 (offene Glastuer zum Buero, gruene Saeulen, Kaffeebar mit der alten Maschine klein im Hintergrund, frei) am 10.10.2026 nachgeliefert; sie kamen als Chat-Upload nur mit 2000 px Breite (Originale
  01-21 lagen als ZIP mit 6720 px vor), bei Lieferung der Originale als ZIP neu rechnen (`_handover/tools/add_photos.py`).
  Uebersicht aller Fotos mit Verwendung: `_handover/tools/bilduebersicht.py` erzeugt `_handover/bilduebersicht.png`.
  Ladepanel: Karten 09-m/03-m/13-m/19-m/14-m, Schlussbild 07. Die uebrigen `-m`-Dateien sind nirgends eingebunden
  (kein picture, kein srcset, geprueft 19.11.2026): alle Geraete laden `NN.webp`. Vorgemerkt (Kundenauftrag 19.11.):
  beim naechsten Ueberarbeiten der Seite die Mobilvarianten einbinden (siehe UEBERGABE.md, offene Punkte).
- Erfundene Personen (Stand 20.11.2026): Auf den Fotos 09, 10, 11, 12, 15, 16, 18, 19, 20, 21 sind die Koepfe der
  Mitarbeitenden durch erfundene Personen ersetzt (Inhaber unveraendert; 04 Mitarbeiterin bleibt Original; 05 und 14
  zeigen den Inhaber). 24, 25, 26 sind zusaetzliche Fassungen von 16, 21, 11 mit neu erzeugtem Kopf (20.11., der
  bisherige glich der echten Person noch); nirgends eingebunden; Kundenentscheid 20.11.: die Seite behaelt 16, 21, 11, 24 bis 26 bleiben als Reserve (Vergleich:
  `r1/vorschau-fotos.html`, eigenes CSS `assets/css/vorschau-fotos.css`, nicht fuer die Live-Site). Figuren bleiben
  uneinheitlich, Taetowierung auf dem Foto mit drei Sitzenden darf sichtbar bleiben (Kundenentscheide 20.11.).
  Basis sind Master in Originalgroesse aus den unveraenderten Originalfotos, im Higgsfield-Konto
  des Kunden (ZIP `IRo_Fotomaster_2026-11-20.zip`, 21 Master), nicht im Repository. Web-Groessen nur aus diesen Mastern rechnen
  (`_handover/tools/fotomaster/web_einsetzen.py`), nie aus den Bearbeitungen vom 24.09.2026 (Farbstich, weicher).
  Verfahren, Pruefung, Tabelle der 21 Master und offene Punkte: `_handover/tools/fotomaster/README.md`. Keine Namen
  echter Personen und keine Links auf Originale oder Master ins Repository schreiben (wird oeffentlich ausgeliefert).
- Kennzahlen im Hero (r1, 18.10.2026): "20+ Jahre" (vom Kunden am 20.11.2026 bestaetigt), "1 Adresse" (ohne data-count, sonst
  zaehlt 0 bis 1), "130 dB" (Diktat). Counter() braucht eine Zahl im Wert, sonst haengt er "0" an.
- Playwright im Container: `p.chromium.launch(executable_path='/opt/pw-browsers/chromium')`, Test-Skript
  `_handover/tools/test_v2.py <port>` (4 Seiten x 6 Viewports x DE/EN, prueft Overflow, Konsolenfehler, Ladepanel);
  fuer r1: `_handover/tools/test_v2b.py <port> r1/` (Server auf dem Repo-Root; Screenshots landen in
  `_handover/tools/shots_b/`, nicht einchecken). Nur Chromium verfuegbar: Android-Browser
  (Chrome, Edge, Samsung) sind damit abgedeckt, iOS (alle Browser = WebKit) nicht; WebKit/Firefox liessen sich nur
  installieren, wenn die Netzwerkrichtlinie der Umgebung `playwright.download.prss.microsoft.com` erlaubt.

### r1-Technik (Stand 08.10.2026, nur `r1/`)
- Konstanten: FILL 15/15 und FINISH 37.5/15 (Hochzaehlen doppelt so lang, 100 % nach ca. 1.9 s), GROUND 22.5/13
  (Bodenwechsel ab 768 px doppelt so lang, 90 % in 1.2 s), DIM_OPACITY .45 und DIM_BLUR 2.5 (Prozess); Schrittzeilen
  5.875rem ab 1024 (30 % groesser), Buehne 17.5 x 21.25rem (15 % kleiner), Caption top min(50 % + 18.5rem, 100 % - 8rem).
- Unter 768 px folgt der Boden dem Scrollweg (initGround: Mischfarbe anteilig zur sichtbaren Flaeche beider Sektionen,
  Zone Viewport-Unterkante bis 10 %, Feder GROUND_MOBILE 170/26 glaettet nur); ab 768 px zeitbasiert an der Mitte.
  main.js schreibt die Bodenfarbe pro Frame in `--ground-rgb`; der Header ist unter 1024 px damit deckend.
- Unter 768 px (Hochformat) wie der Desktop (Kundenauftrag 20.11.2026, zweite Runde: "Hochkant-Design mehr wie die
  Desktop-Version"; die erste Runde nach dem Mobil-Video der Vorlage wurde verworfen). Eigener Block am Ende von
  styles.css "r1 Hochformat wie Desktop": Hero vollflaechig (100svh, Raster mit Subgrid; die Buehne liegt ueber allen
  Zeilen, die Kennzahlen `.figs` landen in der Zeile von Linie und Intro), Titel 2.5rem links oben mit max-width 8.15em
  (bricht nach "Aus weniger" / "Develop more"), Intro links und Kennzahlen rechts (Unterzeile gedaempft wie Desktop),
  Schlusszeile 2.125rem rechts (laengste Zeile "to series production." passt bei 320 px einzeilig), Buttons unten; ohne
  Subgrid bleibt die Fotokarte. Unternehmen: Themenliste links neben dem Foto (rechtsbuendig, dunkel/gedaempft wie
  Desktop), Mission darunter linksbuendig. Prozess: Schrittzeilen 2.75rem zentriert hinter der Buehne 11.5 x 14rem
  (ragen seitlich hinaus, inaktive gedaempft und unscharf), Caption ab 27.25rem, Leiste 01-05 unten, Sektion 48rem.
  Kontakt als Grid: schwarze Spalte zuerst, dann Foto ueber 100svh mit Aufruf, Buttons, Rechtszeile und Copyright im
  Bild. Dazu `html { font-size: max(14px, 4.102564vw) }`, Mindestgroessen 12 px fuer Labels, Tap-Ziele 40 px (auch bei
  `pointer: coarse` ab 1024), `.about__band` als Flex-Spalte mit 1.5rem Abstand. Header: Die Menue-Striche sind
  `.hdr__burger span i`; ein Selektor `.hdr__burger i` traefe auch die Eckpunkte `.mk` (ebenfalls `<i>`).
- Touch-Geraete (`isTouchOnly` = hover: none, Kunde 20.11.2026 "beim Anscrollen unruhig"): Scrub-Effekte (Flow der
  verlassenen Sektionen, alle Parallaxen) laufen dort nicht, der Browser scrollt nativ und die Federn hingen hinterher
  (gemessen: Startsektion rutschte 24 px und blendete aus, Foto lief 0,3 s nach, Bildzeiten p95 64 ms bei 4-facher
  CPU-Drosselung, danach 31 ms). Stand dort per `o.still` ('from' Hero und Flow, 'to' Kontakt, sonst Mitte). Die
  Bodenfarbe fuer den Milchglas-Header (`--ground-glass`) schreibt initGround nur noch am `.hdr`, nur bei Aenderung und
  mit einem einzigen Nachfuehr-Ticker; `--ground-rgb` entfiel (nirgends verwendet).
- Handy quer (`(orientation: landscape) and (max-height: 500px)`, Konstante SHORT_LANDSCAPE): Header 3rem statt
  4.0625rem, weicht beim Runterscrollen nach oben aus (`.hdr.is-away`, initHeaderAway, Schwelle 6 px) und kommt beim
  Hochscrollen zurueck; bleibt ganz oben, bei offenem Menue und mit Tastaturfokus im Header. Unter 768 px Breite quer
  Grundschrift max(14px, 2.083333vw) statt 4.1vw (bei 740 x 360 waren es 30 px, der Header 123 px hoch).
- Ladepanel "nur Logo" ist Standard (Kundenentscheid 20.11.2026, `data-preloader="logo"` am Panel): ohne Fotokarten und
  Finale-Karte (`.pre--logo`), das Zeichen fuellt sich, fliegt in den Header, das Panel blendet ab drei Vierteln des Flugs
  aus (initPreloader `expandLogo`). Das alte Panel mit Fotos zum Vergleich: `r1/?lade=fotos`. Die Kartenbilder tragen
  loading="lazy" und laden darum im Logo-Modus nicht.
- Kontakt-Parallaxe laeuft auf `.contact__layer` (innerer Layer 120 %), nicht mehr auf `.contact__photo`.
- Kompetenzkarten (Kundenentscheid K-B/KL-A 16.10.2026): `div.card` mit `.card__foot` (Titel und Kurzzeile),
  `button.card__hit` ueber der ganzen Karte (aria-expanded) und `.card__more` (inert, Feder PANEL auf clip-path,
  Esc schliesst). Der Link `a[data-step]` in der Tafel scrollt zu #leistungen und setzt den Prozessschritt;
  STEP_LINK_HOLD (2 s) verhindert, dass der stehende Mauszeiger den Schritt danach ueberschreibt.
- Linien (Kundenentscheid 15.10.2026): alle Haarlinien und Rahmen sind 1 px durchgezogen in der Linienfarbe (`--rule`,
  `--border-on-inverse`, `--border-on-muted`), Vorbild `.hero__rule` (1 px, Weiss 40 % auf dunklem Grund). Keine
  gestrichelten Linien mehr (Header-Unterkante, Header-Zellen, Buttons `.dbtn`/`.cbtn`, Sprachpanel, Inserat `.job`,
  Footer-Haarlinie, Consent-Banner). Die .mk-Punkte bleiben, sind aber seit 15.10. rund (`border-radius: 50%`), ebenso
  die Aufzaehlungspunkte `.sub li::before` und `.trow__side li::before` (Kundenentscheid, wie in der PowerPoint-Vorlage).
  Gilt auch fuer die PowerPoint-Vorlage (Tabellen, Rahmen).
- Header ab 768 px: `.hdr::after` zieht die duenne Unterkante ueber die ganze Breite (wie im Original), der
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
- Footer der Unterseiten (Kundenentscheid 09.10., B-4 ohne Linien): `.subfoot__inner` vier Spalten auf 64rem (Logo-Kachel
  und Badges, Kompetenzen / Unternehmen / Leistungen, Team / Karriere / Kontakt, Adresse), 2 x 2 ab 768, eine Spalte
  darunter; `.subfoot__bottom` (Copyright links, Impressum | Datenschutz | Cookie-Einstellungen rechts, mobil gestapelt)
  mit waagrechter duenner Haarlinie oben (seit 15.10. durchgezogen) und je einem .mk-Punkt links und rechts (Marker
  tl/tr statisch im Markup; Kundenkorrektur 09.10.). Keine Rahmen, keine Spaltenlinien.
- Logo-Kachel `.logo-tile` (Original-Logo `assets/img/logo/tile-white.png` als Maske, 5.5 x 5.5rem, Kachel und SWISS in
  currentColor, Marke als Ausschnitt): im Abspann der Startseite (`.rail__logo`, Schienen-Links ab 768 auf top 9rem) und
  im Footer (`.subfoot__logo`), Farbe Ice Mint, Hover Fresh Mint, Klick zur Startseite. Header-Mark bleibt `.logo-mark`.
- Badges `.badge--nafems` / `.badge--lehrbetrieb`: PNG als Maske in currentColor (#c4c8cc), Hover Fresh Mint ueber den
  umschliessenden Link; nie mehr als <img>.
- Kontaktseite seit Go-Live (Kundenentscheid 20.11.2026, nur Google als externer Dienst): KEINE eingebettete Karte mehr;
  Zeile 02 hat den Button «Route in Google Maps» und darunter `p.routes` «Fahrplaene» mit SBB-Fahrplan und Faehrfahrplan
  (Apple Karten seit 21.11.2026 gestrichen, Kunde) und den Hinweis `.routes__hint`. initMapEmbed, `.kmap` und frame-src
  sind entfernt, Datenschutz Abschnitt 09 heisst «Routenplanung» (nennt Google Maps, SBB, Faehrbetreiberin).
  Zeile 03 Anreise seit 21.11.2026: h3 je Verkehrsmittel (Auto, Bahn und Bus, Schiff, Eingang und Anlieferung), beim
  Auto zwei h4 (Zum Hubkreisel, Vom Hubkreisel zu uns), alles als `ul`-Punkte, rund 250 Woerter; keine Schranke, keine
  Baustelle, keine Fahrplanminuten (nur «rund 45 Minuten», «im Sommerhalbjahr Kursschiffe»). Satz «im Treppenhaus
  hinauf ins Hochparterre, dann links den Flur entlang. Anlieferungen bitte ebenfalls ueber diesen Eingang.» bleibt.
  Der folgende Absatz beschreibt den frueheren Stand mit swisstopo-Karte (nur noch Geschichte):
- Kontaktseite `kontakt.html` (Kundenentscheid 09.10., statt Standort-Kachel S-1 bis S-3): Aufbau wie Karriere mit drei
  Zeilen (Kontaktadresse mit Ansprechperson und Buttons, Karte, Anreise). Karte = iFrame von map.geo.admin.ch (swisstopo,
  LV95 2746262,1270375, z=9, pixelkarte-grau, Layer ch.bav.haltestellen-oev, crosshair marker, noSimpleZoom), gebaut von
  main.js initMapEmbed erst, wenn `.kmap[data-map]` im Viewport sichtbar wird (Ladeverhalten A, rootMargin 0, vorher keine
  externe Anfrage; auf grossen Bildschirmen liegt der Kartenbereich bei Scrollposition 0 schon im Fenster, die Karte laedt
  dann direkt beim Aufruf - Hinweis in .kmap__note und Datenschutz Abschnitt 11 sagt das so, nie "beim Scrollen"
  versprechen); Sprachwechsel tauscht nur lang=de/en im src (data-src / data-src-en). Nur der Container wird gestaltet
  (280 px mobil, 360 px ab 768), nichts ueber dem iFrame. Zeile "Route und Fahrplan": Google Maps (dir/?api=1&destination=
  IdeeRoth AG, Hafenstrasse 62, ...), Apple Karten in der Legacy-Form `maps.apple.com/?daddr=...&dirflg=d` (laeuft auf allen
  iOS/macOS-Versionen, Ziel mit Firmenname; data-en-href mit "Switzerland"), SBB-Fahrplan (nach=..., data-en-href /en),
  Faehrfahrplan (offizielle Seite der Faehrbetreiberin bodensee-schiffe.ch/faehre/fahrplan/, DE und EN gleich); darunter
  Hinweis (.kmap__hint): Ziel ist eingetragen, Start nimmt die App vom Standort oder fragt danach. "Mit dem Schiff" nennt
  den Takt (Ankunft Romanshorn stuendlich zur Minute 06, Abfahrt Friedrichshafen Minute 20, rund 45 Minuten, im Winter
  teils Zweistundentakt; Quelle bsb.de und bodensee-schiffe.ch, Stand 10.10.2026, bei Fahrplanwechsel pruefen). Das Wort
  "Bodensee" bleibt im sichtbaren Text tabu (Faehrbetreiberin statt Firmenname). applyLang kennt zusaetzlich data-en-href,
  data-en-title und (seit 20.11.2026) data-en-alt fuer die Alt-Texte der Fotos. Anreise-Texte (10.10.2026) nach
  Kundenangaben: drei Anfahrten ueber den Hubkreisel (Amriswil/Weinfelden; Zuerich via Ausfahrt Kreuzlingen Sued und
  Hauptstrasse 13; Osten via Verzweigung Meggenhus und A23), Parkplaetze (oeffentlich oder Anruf fuer die Schranke),
  Fussweg vom Bahnhof, der Faehre und den Kursschiffen unten am Hafenbecken entlang, Eingang Westseite/Hochparterre,
  Gebaeude des Restaurants Panem. Strassennamen aus OSM/OSRM belegt; keine erfundenen Fakten, Platzhalter-Klasse `todo`
  bleibt fuer kuenftige Luecken. Datenschutz Abschnitt 11 "Karte und
  Routenplanung" (Bundes-Link admin.ch/de/rechtliches, EN per data-en-href admin.ch/en/terms-and-conditions).
  `r1/.htaccess` (seit Go-Live neu: 404-Seite, /index.html -> /, HSTS, CSP nur 'self' plus Google-Analytics-Hosts,
  frame-src 'none', Sperre fuer _parkiert/_handover/_release/r1) kommt ueber den Build ins Paket. Header-Navigation, Burger-Menue, Footer und Schiene verlinken "Kontakt" auf kontakt.html; "Projekt
  starten" fuehrt weiter zum Abspann (#kontakt). v2 hat damit 5 Seiten plus 404.html (seit Go-Live); Sweep-Skript test_v2b.py prueft alle sechs.
- Rechtszeile: Trenner-Spans sind ausgeblendet, der gerade Strich "|" (Kundenwunsch 09.10., vorher Schraegstrich) haengt
  per `a ~ a::before` am Link (nie am Zeilenende) und bleibt gedaempft; die Links der Startseite haben kein RollLabel mehr,
  nur den Farbwechsel der Textlink-Regel.
- Unterseiten-Links ohne gestrichelte Linie (Projektregel "keine Unterstreichungen"), Gewicht 500 statt Linie.
- Tastaturfokus (Review 09.10.): Fokusring auf hellem Grund Carbon Black (`[data-ground="light"] :focus-visible`,
  `.hdr[data-theme="light"] :focus-visible`), auf dunklem Grund Signal Green; Signal Green auf Ice Mint / Fresh Mint laege
  unter 3:1. Textlinks in `.sub` wechseln nur beim Hover auf Signal Green, bei Fokus bleibt der Text schwarz (Ring zeigt
  den Fokus); auf dunklem Grund bleibt Fresh Mint auch bei Fokus. `.dbtn` der Unterseiten (initSubpage) fuellen sich bei
  focusin wie Hero und Abspann, sonst stuende die weisse Beschriftung auf Mint.
- Textrunde 2 (18.10.2026, V2-VIDEOVERGLEICH 65-72): keine Versalien mehr (kein `text-transform: uppercase`, Labels
  .875rem, `--tracking-nav` -.01em). Prozessschritte tragen `.pstep__out` (Ergebniszeile, setCaption baut `.process__out`);
  Prozesshoehen und Caption-Grenze 100 % - 12rem wegen dieser Zeile. Team-Block hat sieben Zeilen (05 Diskretion,
  06 Branchen, 07 Zusammenarbeit); Branchen nur allgemein, nie Stahlseile/Schwerindustrie, Druckgussmaschinen, einzelne
  Lebensmittel, Medikamentenverpackungen, Diebstahlsicherungen (Rueckschluss auf Kunden). Schwesterfirma ohne Namen.
- `win.IRO` (Ende von main.js) stellt Group, ticker, Words, Inview, Scrub, Hover und die Federn fuer die Vorschauseiten bereit.
- Foto-Uebergaenge: Bibliothek TRANSITIONS in main.js (dissolve, dissolve-settle, wipe, clear, deal, turn, push; alle
  aus dem Prompt), `PhotoSwap(frame, photos, name)` blendet gestapelte Fotos um. Am Rahmen waehlbar per
  `data-transition`, `data-interval` (ms) und `data-speed` (Tempo-Faktor, Federn tension*k^2, friction*k).
  Kundenentscheid 09.10.2026: Unternehmen = clear, 2 s, Faktor 1.4. Prozess seit 20.11.2026 ebenfalls clear (Faktor 1,
  Auto-Takt 3 s nur ohne Maus unter 1440 px; `data-transition`/`data-speed`/`data-interval` an `.process__stage`), ohne
  Schwenken je Schritt und ohne Kippen mit der Maus (initProcess `calm`); mit data-transition="turn" kaeme das alte Verhalten.
  Ebenen im Rahmen sind fest: Fotos nur z-index 0 bis 2 (eintretend 2, aktuell 1, uebrige 0; NIE hochzaehlen),
  Schleier `.about__frame::after` 3, `.about__btnpos` und `.about__topics` 4; sonst verdecken die Fotos nach wenigen
  Wechseln den "Ueber uns"-Hover-Button (ab 1440 px mit Maus pro Hineinfahren sichtbar, darunter und auf Touch immer).
- Unternehmen ab 1024 px liegt im Fluss (kein absolut zentriertes Band mehr): `.about` min-height 100lvh als Flex-Spalte,
  `.about__head` oben, `.about__wrap` (Rahmen, Themenliste, Mission; die Mission steht im Markup IM Wrap) mit
  mit festem Abstand 2rem zum Titel (gleich wie seitlich zum Foto); die Gruppe ist im Band zentriert (justify-content center, Ueberschuss oben und
  unten). Bei kurzen Fenstern waechst die Sektion, Titel und Foto koennen nicht kollidieren. Kompetenzen ab 1024 px
  ebenso: Kartenreihe im Fluss, Sektion min-height 100lvh (bei 1920 x 700 ragten die Karten in den Prozessblock).
- Layouts ab 1024 px (Kundenentscheid 09.10.2026): Unternehmen U-A (Themenliste links, Mission rechts neben dem Foto,
  beide an der Rahmenunterkante, kein Einzug), Karten K-A (alle 30rem, xl 34rem), Team T-A (`.team__rows` max-width
  64rem zentriert, Spalten wie Vorlage). Die Vorschauseiten bleiben als Nachschlagewerk in r1.

### Nachtrag 21.11.2026 (nach dem Livegang, nur `r1/`)
- Sonne im Startbild (Hochformat unter 768 px und Block 768-1023 / Handy quer): Foto 07 ist 2400 x 1600, die Sonne liegt
  bei 32,1 % / 27,2 %. `.hero__photo` ist 130 % der Hero-Hoehe hoch, mit `object-position: X% 0` liegt die Sonne im Kasten
  bei y = 0,272 x max(Breite/1,5, 1,3 x Hoehe). Darum `top: calc(var(--header-height) + var(--sun-y) - max(18.13vw,
  35.36%))` und `bottom: auto`: die Sonne steht `--sun-y` unter der Kopfzeile (Hochformat 2.75rem, quer niedrig .75rem).
  Waagrecht per object-position (Hochformat 20 %, Tablet und quer 17 %). Schleier oben leichter, Titel mit weichem
  Textschatten. Pruefen mit einer Markierung an der berechneten Stelle, nicht nach Gefuehl.
- Tablet hochkant und Handy quer wie Desktop: Block am Ende von styles.css «r1 Tablet hochkant und Handy quer
  (768-1023 px) wie Desktop», Media `(min-width: 768px) and (max-width: 1023px), (max-width: 767px) and (orientation:
  landscape) and (max-height: 500px)`. Hero als Raster mit Subgrid (Buehne ueber alle Zeilen, Titel Zeile 2, Linie mit
  Intro und Kennzahlen Zeile 4, Schlusszeile Zeile 6 rechts, Knoepfe Zeile 7), Unternehmen U-A (Rahmen 15 x 18.5rem
  mittig, Themenliste links, Mission rechts). Bei geringer Hoehe (Tablet unter 600 px, Handy quer) kompakter: Schlusszeile
  Spalte 3 und Knoepfe Spalte 2 in derselben Zeile, Knoepfe duerfen umbrechen (`.roll__a/.roll__b` white-space normal).
  Ab 1024 px gilt unveraendert der Desktop (Master bleibt die Laptop-Version, Kunde 21.11.).
- Aktuell-Knopf (Kundenwunsch 21.11.): erstes Element in `.hero__ctas` auf index.html, `a.dbtn.dbtn--news` mit
  `.news__dot`; Text im `span.rl` (DE) und dessen `data-en`, Ziel im `href` (heute `karriere.html#lehrstelle`), Bewegung
  per `data-attn` am Knopf: `puls` (Ring um den Punkt, 2,4 s), `atem` (Flaeche atmet gruen, 3,6 s),
  `glanz` (Lichtstreif, 5 s, eingestellt seit Kundenentscheid 21.11.2026: Variante C).
  Wenn die Lehrstelle besetzt ist, sagt der Kunde Bescheid; erst dann Knopf aendern oder entfernen. Ohne aktuelles Thema die Zeile loeschen. Bei reduzierter Bewegung steht alles still.
  Unter 768 px hochkant steht der Knopf allein in der ersten Zeile. Vergleich: `r1/vorschau-aktuell.html` (nicht live).
- `#lehrstelle` liegt auf der Zeile «Lehrstelle 2027» in karriere.html (Ziel von Knopf, Team-Zeile 04 und Badge).
- Karriere: «Initiativbewerbung» duzt wie das Inserat, bleibt so (Kundenentscheid 21.11.2026).
- Rechtspruefung 21.11.2026 (Better Call Claude, Gesetzestext ueber Fedlex; das Analyse-Werkzeug `legal_analyze`
  antwortete leer): Befund, Umsetzung und offene Punkte in `_handover/recherche/rechtspruefung-impressum-datenschutz-2026-11-21.md`.
  Datenschutz hat seither Stand-Datum (Abschnitt 11), Rechte mit Herausgabe/Uebertragung, Widerruf und EDOEB,
  Auslandsbekanntgabe bei Google, Aufbewahrung nach Kriterium, «IP-Adresse» ohne Zusage zur Kuerzung. Impressum:
  Haftungsausschluss «soweit das Gesetz dies zulaesst». Bei jeder Aenderung an datenschutz.html das Stand-Datum nachfuehren.
  Kundenangaben 21.11.: UID CHE-407.745.534 im Impressum, Google Analytics 14 Monate Aufbewahrung, Hinweis zu KI-Fotos
  NUR im Impressum (Abschnitt Urheberrechte, «Ein Teil der Fotos auf dieser Website wurde mit KI bearbeitet.»),
  Datenschutz nennt Hostpoint AG als Ort der Server-Logfiles, Aufbewahrung regelt Hostpoint (keine eigenen Fristen nennen).
- Google Search Console: Anleitung fuer den Kunden `_release/ANLEITUNG-SEARCH-CONSOLE.md` (Domain-Property iro.swiss,
  TXT-Eintrag bei Hostpoint, Sitemap). Der TXT-Eintrag muss bleiben.
- Zweites Paket am selben Tag: `build_release.py b` ergibt `iro-swiss-www-YYYYMMDDb.zip`; das Archiv nimmt das juengste
  Paket des Tages und traegt dessen Kennung im Namen.
