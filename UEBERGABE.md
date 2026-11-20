# Uebergabe an das Claude-Projekt (Stand 16.10.2026)

Dieses Dokument ist der Einstieg fuer jede neue Claude-Sitzung zu diesem Repository. Es fasst zusammen, was bis
heute entstanden ist, was offen ist und wie gearbeitet wird. Die verbindlichen Regeln stehen in `CLAUDE.md`, die
Entscheidliste in `V2-VIDEOVERGLEICH.md`. Die bisherige Chat-Sitzung wird geloescht; alles Wissen, das weiterlebt,
steht in diesem Repository.

## 1. Worum es geht

IdeeRoth AG, Romanshorn (Alain Roth, alain.roth@ideeroth.ch): Produktentwicklung, Konstruktion, Simulation,
Prototyping. Zwei Arbeitsgebiete in diesem Repository:

1. **Website iro.swiss** (statisch, HTML/CSS/Vanilla-JS, DE/EN). v1 ist live, v2 ist das Redesign in Arbeit.
2. **PowerPoint-Vorlage** im Design der Website v2 (Ordner `_handover/powerpoint/`).

## 2. Stand

### Website
- **v1 (live auf Hostpoint, www.iro.swiss):** Branch `claude/iro-skill-designsystem-access-0i426w`, unveraendert.
  Deployment per FTP ins `www`-Verzeichnis (siehe `README.md`).
- **v2 Redesign:** Branch `v2-redesign`, Vorschau ueber GitHub Pages.
  - Root des Branches = Stand 30.09.2026 (Vergleichsbasis, nicht anfassen): https://iro101101.github.io/IRo-landingpage/
  - **Ordner `r1/` = Arbeitskopie**, hier wird gearbeitet: https://iro101101.github.io/IRo-landingpage/r1/
    Fuenf Seiten: index, karriere, kontakt, impressum, datenschutz. Dazu fuenf Vorschauseiten `vorschau-*.html`
    (Entscheidungshilfen, bleiben als Nachschlagewerk, kommen nicht live).
  - Cache-Version in allen r1-HTML-Dateien: `?v=20261120i`. Bei jeder Aenderung an `r1/assets/css/styles.css` oder
    `r1/assets/js/main.js` hochzaehlen (`YYYYMMDD`, am selben Tag Buchstabe anhaengen).
  - Alle Kundenentscheide bis 15.10.2026 sind eingebaut (Liste: `V2-VIDEOVERGLEICH.md`, Punkte 1 bis 58).
    Letzte Entscheide 15.10.: duenne durchgezogene Linie statt gestrichelter Haarlinien (Vorbild `.hero__rule`),
    runde Eckmarker und runde Aufzaehlungspunkte.
  - **Fotos mit erfundenen Personen (19.11.2026):** Die Fotos 09, 10, 11, 12, 15, 16, 18, 19, 20, 21 im Fundus
    `r1/assets/img/v2` zeigen erfundene Personen (Koepfe ersetzt, Inhaber unveraendert, Foto 04 bleibt Original).
    Sie sind seit 19.11. aus neuen Mastern in Originalgroesse gerechnet: natuerliche Farben, Lehrling neu, Haende
    der dunkleren Figur farblich angeglichen. Verfahren, Pruefung und offene Punkte:
    `_handover/tools/fotomaster/README.md`. Die Fundusdateien nie mehr aus den alten Bearbeitungen rechnen.
    Seit 20.11. liegen zusaetzlich 24, 25, 26 im Fundus: 16, 21 und 11 mit neu erzeugtem Kopf (der bisherige glich
    der echten Person noch). Die Seiten zeigen weiter 16, 21 und 11; eingebunden ist 24 bis 26 nirgends.
- **Variante B** (Ordner `b/`, 08.10.) wurde dem Kunden gezeigt und verworfen; Aenderungen am Design nur Punkt fuer
  Punkt mit dem Kunden. Der Ordner `b/` wurde am 08.10.2026 wieder entfernt und liegt nur noch in der Git-Historie
  (angelegt mit Commit 93cb8cb, entfernt mit Commit 2e70474).

### PowerPoint-Vorlage (fertig geliefert 15.10.2026)
- `_handover/powerpoint/out/IdeeRoth_Vorlage.potx`: 32 Layouts (16 Deutsch `DE · 01` bis `DE · 16`, 16 Englisch),
  Designfarben im Farbwaehler, drei ausgeblendete Referenzfolien (Bausteine, Farbkonzept, Welche Farbe wann).
- Beispieldecks `IdeeRoth_Beispiel_DE.pptx` / `_EN.pptx` (22 Folien + Anhang) und als PDF, einseitige Anleitung
  `IdeeRoth_Vorlage_Anleitung.pdf`, Lieferpaket-Inhalt in `out/paket/` (LIESMICH, Schrift Inter).
- Quellen: `lib.js` (Theme, Layouts, Referenz- und Beispielfolien), `build_template.js`, `build_samples.js`,
  `finish.py` (Nachbearbeitung: Fusszeilen-Platzhalter, Master, Aufzaehlung, .potx-Inhaltstyp). Bauanleitung im
  `_handover/powerpoint/README.md`.
- Kundenentscheide 15.10.: Fusszeile F-2 senkrecht rechts mit waagrechter zentrierter Seitenzahl; Grundfarben
  Weiss / Mint / Dark; Farbschluessel Terminplan (Signal Green IdeeRoth, Fresh Mint gemeinsam, Steel Gray Kunde oder
  Lieferant); Ampel-Labels Rot #B8463A / Orange #E2A33D / Fresh Mint nur fuer Freigabe-Labels; Kennzeichnung V-2
  (rotes Label oben rechts, darunter Kurzform "Schutzvermerk ISO 16016 beachten"); Punkte statt Rechtecke;
  Bausteine als eigene Folie; Terminplan nach der alten Vorlage (Folie 10). Alte Vorlage als Referenz unter
  `_handover/powerpoint/referenz/`.
- Normbezug: ISO/IEC 27001 regelt das Managementsystem, nicht das Dokument; Schutzvermerk fuer technische Unterlagen
  ist ISO 16016 (DIN ISO 16016:2017). Wortlaut aus der Norm oder dem Zeichnungsschriftfeld des Kunden uebernehmen.

## 3. Offene Punkte

Beim Kunden:
- Vorlage in PowerPoint (Windows und Mac) oeffnen und pruefen: senkrechte Fusszeile, Seitenzahl, Aufzaehlungspunkte,
  Designfarben. Hier wurde nur mit LibreOffice gerendert.
- CMYK-Druckwerte der Farben einmal mit der Druckerei festlegen (Signal Green liegt ausserhalb des Druckfarbraums).
- Kartenlinks der Kontaktseite auf dem iPhone testen (Apple Karten in der Legacy-Form `maps.apple.com/?daddr=`).
- Bestaetigen, dass die Schranke an der Westzufahrt (Hafenstrasse 62) die eigene ist (Text "Eingang" auf kontakt.html).
- Originale der Fotos 22 und 23 als ZIP (6720 px) nachliefern; dann mit `_handover/tools/add_photos.py` neu rechnen.
- Kennzahlen im Hero: «20+ Jahre» am 20.11.2026 bestaetigt (dazu «1 Adresse», «130 dB»).
- Go-live: Paket am 20.11.2026 geliefert (Abschnitt 4), Upload durch den Kunden.
- Karriere: Die Zeile «Initiativbewerbung» duzt wie das Inserat (Hausstil verlangt «Sie»); Kunde entscheidet, ob das
  so bleibt oder auf «Sie» umgestellt wird.
- Rechtlich pruefen lassen (Hinweise aus der Endkontrolle 20.11., keine Rechtsberatung): Impressum ohne UID und
  Handelsregister-Eintrag; Datenschutz ohne Stand-Datum, ohne Aufbewahrungsfristen (Logs, GA, E-Mails), Rechte ohne
  Datenherausgabe (Art. 28 DSG) und Beschwerde beim EDOEB, Grundlage der USA-Uebermittlung bei Google (Swiss-US DPF
  oder Standardvertragsklauseln) nicht genannt; Satz «gekuerzte IP» in den Server-Logfiles mit Hostpoint klaeren;
  Alt-Texte nennen die erfundenen Personen «Mitarbeiter».
- Google-Unternehmensprofil pruefen (vorhanden, verifiziert, Adresse aktuell?) und bei Bedarf beanspruchen. Mit der
  Place-ID liesse sich der Google-Maps-Link auf kontakt.html genau auf den Eintrag richten (`destination_place_id`).

Fotos mit erfundenen Personen (Stand 20.11.2026, Einzelheiten in `_handover/tools/fotomaster/README.md`):
- Kundenentscheid 20.11. nach dem Vergleich (`r1/vorschau-fotos.html`): Alle Fotos bleiben, wie sie sind. Die
  Seite zeigt weiter 16, 21, 11; die Fassungen 24, 25, 26 mit neuem Kopf bleiben als Reserve im Fundus.
- Kundenentscheide 20.11.: Die Figuren bleiben so, wie sie sind (von Foto zu Foto nicht streng dieselbe Person);
  die Taetowierung am Knoechel auf dem Foto mit den drei Sitzenden darf sichtbar bleiben.
- Der eingefrorene Fundus im Root (`assets/img/v2`) zeigt weiter den alten Stand (Vergleichsbasis).
- Rechtlich pruefen lassen: Verarbeitung von Mitarbeiterfotos bei einem externen KI-Dienst, allfaellige
  Kennzeichnung KI-bearbeiteter Bilder (Recherche ist keine Rechtsberatung).

Vorgemerkt fuer das naechste Ueberarbeiten der Seite (Kundenauftrag 19.11.2026):
- Mobilvarianten der Fotos einbinden. Heute laden alle Geraete `NN.webp` (1800 px, Hero 2400 px). Die Dateien
  `NN-m.webp` (1100 px) liegen bereit, sind aber nur im Ladepanel eingebunden (09, 03, 13, 19, 14); es gibt kein
  `<picture>` und kein `srcset`. Beim Umbau `srcset` mit `sizes` oder `<picture>` setzen und auf Handybreite pruefen.
  Vorlage: Die verworfene Variante B hatte das einmal gebaut (Commit 93cb8cb, `b/index.html`).

Spaeter zu pruefen:
- Umbau untere Bahnhofstrasse Romanshorn bis April 2027 (Hinweis auf kontakt.html), danach Einbahnregelung pruefen.
- Tiefgarage Hafenpromenade (Abstimmung 14.06.2026) ersetzt die oberirdischen Parkplaetze am See; Text anpassen.
- Faehrfahrplan (Takt, Winterfahrplan) bei Fahrplanwechsel pruefen; Quelle bsb.de und bodensee-schiffe.ch.
- Idee aus der Recherche 09.10.: QR-Code zur Anfahrt (SBB- oder Kartenlink) auf Drucksachen.

## 4. Go-live (vorbereitet 20.11.2026, Kunde laedt hoch)

Der Kunde hat am 20.11.2026 den Stand von `r1/` freigegeben. Das Upload-Paket entsteht nur noch per Build, das
Repository bleibt wie es ist (Root = Stand 30.09. als Vergleich, `r1/` = Quelle):

1. `python3 _handover/tools/golive/build_release.py` (im Repo-Root). Ergebnis: `_release/www/` (nicht eingecheckt)
   und `_release/iro-swiss-www-YYYYMMDD.zip`. Upload-Anleitung fuer FileZilla: `_release/ANLEITUNG-UPLOAD.md`
   (Sicherung, alte v1-Dateien loeschen, Upload inkl. `.htaccess`, Kontrolle im Browser).
2. Der Build nimmt nur die Live-Seiten und referenzierten Dateien, entfernt noindex (404 bleibt noindex), schreibt
   robots.txt und sitemap.xml, minifiziert ohne Kommentare und bricht bei Entwicklungsspuren oder fehlenden Dateien ab.
3. Endkontrolle 20.11.2026 am Paket: W3C-Validator (vnu) ohne Fehler, 316 interne Verweise und Anker ok, externe Links
   per Firecrawl geprueft (berufsbildungplus.ch war tot: Lehrbetrieb-Badge zeigt jetzt auf karriere.html#lehrstelle),
   keine externe Anfrage und kein Cookie vor der Zustimmung, nach «Akzeptieren» nur googletagmanager.com,
   Tastatur (alle Stopps sichtbar mit Fokusring, Esc schliesst das Menue), axe und Lighthouse (SEO und Best Practices
   100; Kontrastmeldungen im Prozessblock sind Fehlmessungen, weil die Werkzeuge den festen Boden nicht erkennen),
   Sweep 6 Seiten x 6 Viewports x DE/EN ohne Befund.
4. Kundenentscheide zum Go-Live: nur Google als externer Dienst; swisstopo-Karte durch «Route in Google Maps» ersetzt;
   Routenlinks Apple/SBB/Faehre und Badge-Links (NAFEMS, Berufsberatung) bleiben; «20+ Jahre» bestaetigt; Lenis durch
   eigenen Code ersetzt.
5. Nach dem Livegang: Google Search Console, Sitemap einreichen. GitHub-Pages-Vorschau kann danach abgeschaltet werden.

## 5. Arbeitsweise

- Branch fuer alle Arbeiten: `v2-redesign`. Jede Aenderung committen und pushen (`git push -u origin v2-redesign`).
  Commit-Nachrichten auf Deutsch, Zeile 1 kurz, dann Stichpunkte; die Trailer-Zeilen so, wie die Umgebung sie vorgibt.
- Regeln in `CLAUDE.md` sind verbindlich (Wording, DE/EN mit `data-en`, keine Gedankenstriche, keine Unterstreichungen,
  Cache-Version, Sweep nach jeder Aenderung, nie Siemens/NX/Ansys/Flow-3D/Simcenter/Teamcenter/Nastran/"Bodensee").
- Designaenderungen nur auf Entscheid des Kunden, jeden Entscheid in `V2-VIDEOVERGLEICH.md` (Runde 1) mit Datum und
  Status festhalten und `CLAUDE.md` nachfuehren, wenn eine Regel entsteht.
- Vorschauen fuer den Kunden: PDF-Vorschauen oder Screenshots direkt im Chat liefern; Entscheidungsvarianten mit
  Kuerzeln (F-1, V-2, K-A ...) benennen, damit der Kunde kurz antworten kann.
- Der Kunde schreibt kurz und oft per Spracheingabe (Tippfehler sind normal); Antworten kurz halten, Entscheide
  zusammenfassen, offene Fragen nummeriert stellen.
- Hochgeladene Dateien Dritter (zum Beispiel fremde Praesentationen) nicht ins Repository uebernehmen.

## 6. Werkzeuge

Alle Skripte liegen in `_handover/tools/` (frueher in einem Sitzungs-Scratchpad, darum heissen die Pfade in alten
Notizen `scratchpad/...`). Alle Pfade sind relativ zum Skript; die Skripte laufen aus jedem Verzeichnis.

- **Sweep nach Aenderungen** (Pflicht): lokalen Server im Repo-Root starten (`python3 -m http.server 8771`), dann
  `python3 _handover/tools/test_v2b.py 8771 r1/` (5 Seiten x 6 Viewports 320 bis 1920 x DE/EN; prueft horizontalen
  Overflow, Konsolenfehler, Ladepanel). Fuer den Root-Stand `test_v2.py <port>`. Kriterium: jede Zeile `OK`.
  Screenshots landen in `_handover/tools/shots_b/` (per .gitignore ausgeschlossen).
  Playwright im Cloud-Container: `p.chromium.launch(executable_path='/opt/pw-browsers/chromium')`; nur Chromium,
  kein WebKit (iOS bleibt ungetestet).
- **Fotos:** `add_photos.py 22=/pfad/original-22.jpg 23=/pfad/original-23.jpg` rechnet Originale nach
  `r1/assets/img/v2/NN.webp` (1800 px) und `NN-m.webp` (1100 px); das Hero-Foto 07 ist die Ausnahme mit 2400 px.
  `bilduebersicht.py` erzeugt `_handover/bilduebersicht.png` (Kontaktblatt mit Verwendung je Foto; die v1-Fotos dafuer
  liegen als Kopie in `tools/v1img/`).
- **Karten:** `osm/make_maps.py` (schreibt `standort-s1.svg` und `lageplan-symbol.svg` neben das Skript),
  `osm/render.py` (rendert die dunkle Karte zu WebP), `osm/build_standort.py` (baut `r1/vorschau-standort.html`) mit
  den Overpass-Daten `osm/romanshorn.json` (OpenStreetMap, ODbL; Quellenangabe Pflicht). Nur fuer die Vorschauseite
  Standort noetig.
- **Generatoren** (`generatoren/`): `build_subpages.py`, `build_kontakt.py`, `build_logo.py` haben die Unterseiten,
  die Kontaktseite und die Logo-Vorschau einmalig erzeugt; die HTML-Dateien werden seither direkt gepflegt.
- **Fotos mit erfundenen Personen:** `_handover/tools/fotomaster/` (README mit Verfahren und Tabelle der 18 Master,
  `web_einsetzen.py` setzt die Web-Groessen in den Fundus ein). Die Bildarbeit selbst laeuft in der Bildwerkstatt
  von Higgsfield, die Skripte dazu liegen im Lieferpaket des Kunden.
- **PowerPoint:** siehe `_handover/powerpoint/README.md` (Node mit pptxgenjs und jszip, Python mit python-pptx,
  pymupdf, defusedxml, LibreOffice Impress fuer PDFs, Inter als Systemschrift, Chromium fuer die Anleitung).
- **Textregeln pruefen:** `grep -nE "–|—"` auf die HTML- oder Textdumps (keine Gedankenstriche), `grep -i` auf die
  verbotenen Woerter, kein `ß`.
- **Recherche-Notizen:** `_handover/recherche/` (Anreise-Fakten mit Quellen, Faktenbasis Karte und Anfahrt
  (swisstopo-Parameter, Nutzungsbedingungen, Routen-Links, Datenschutz, Quellen), Bauanleitung "Northwall" als Textfassung,
  Analysen der Referenzseite).

Einrichtung in einer neuen Cloud-Sitzung (nur was fehlt): `pip install playwright python-pptx pymupdf defusedxml
markitdown`, `npm install pptxgenjs jszip` im Ordner `_handover/powerpoint/`, `apt-get install libreoffice-impress`,
Inter-Schriften aus `_handover/powerpoint/out/paket/fonts/` nach `/usr/local/share/fonts/` kopieren und `fc-cache`.

## 7. Ordnerkarte

```
/                       Root dieses Branches = v2-Stand vom 30.09.2026 (Vergleichsbasis, nicht anfassen)
r1/                     v2 Runde 1, Arbeitskopie (5 Seiten, 5 Vorschauseiten, eigene assets/)
_parkiert/              geparkte Inhalte (Offene Stellen), Wiedereinsetzen laut README dort
_handover/
  DESIGN-HANDOVER.md    Designbeschreibung v2 (Farben, Schrift, Vokabular, Bloecke, Texte), Stand 30.09.
  palette.png, logo/, screens/, bilduebersicht.png
  powerpoint/           Vorlage, Beispieldecks, Anleitung, Quellen, Referenz (alte Vorlage)
  tools/                Sweep (test_v2b.py), Fotos (add_photos.py, bilduebersicht.py, v1img/, fotomaster/),
                        Karten (osm/), Generatoren (generatoren/)
  recherche/            Anreise-Fakten, Northwall-Bauanleitung, Analysen
  PROJEKT-ANWEISUNGEN.md Text fuer die Projektanweisungen des Claude-Projekts
CLAUDE.md               verbindliche Regeln und Technik-Notizen (Pflichtlektuere)
V2-VIDEOVERGLEICH.md    Abweichungsliste und Entscheide, Runde 1 ab Punkt 40
V2-BRIEFING.md          Briefing und Stand 30.09. (historisch)
README.md               Bedienung und Deployment der Website (Hostpoint)
UEBERGABE.md            dieses Dokument
```

## 8. Was nicht im Repository liegt

- Die Foto-Originale (6720 x 4480 JPG, Pakete 1 bis 5 des Fotografen) und die Chat-Uploads der Fotos 22 und 23
  (2000 px). Sie liegen beim Kunden. Im Repo sind nur die berechneten WebP-Dateien.
- Die 21 Fotomaster mit erfundenen Personen in Originalgroesse (rund 120 MB), die Protokolle und die Skripte der
  Bildwerkstatt: als ZIP `IRo_Fotomaster_2026-11-20.zip` im Higgsfield-Konto des Kunden (das Paket vom 19.11. mit 18
  Mastern ist darin enthalten). Dort liegen auch die Originale und die Bearbeitungen vom 24.09.2026.
- Fremde Praesentationen, die der Kunde als Beispiel hochgeladen hat (Folienmaster eines Drittunternehmens). Die
  daraus uebernommenen Ideen (Vergleich, Bildraster, Ansprechpersonen, senkrechte Fusszeile) sind in der Vorlage.
- Zugangsdaten (Hostpoint, Google Analytics) liegen beim Kunden.

## 9. Einrichtung des Claude-Projekts

Der Chat-Verlauf selbst laesst sich nicht umziehen. Umziehen laesst sich alles, was in Dateien steht: das Repository
(Code, Entscheide, Werkzeuge, Vorlage) und die Wissensdateien fuer das Projekt. Das reicht, weil jede Entscheidung
und jede Regel in `V2-VIDEOVERGLEICH.md`, `CLAUDE.md` und diesem Dokument festgehalten ist.

1. Neues Projekt anlegen, zum Beispiel "IdeeRoth Website und Vorlage".
2. Projektanweisungen: Text aus `_handover/PROJEKT-ANWEISUNGEN.md` einfuegen.
3. Projektwissen: im Projekt unter "Wissen" auf "+" und "GitHub" gehen, Repository `IRo101101/IRo-landingpage`
   waehlen und diese Dateien markieren: `UEBERGABE.md`, `CLAUDE.md`, `V2-VIDEOVERGLEICH.md`,
   `_handover/DESIGN-HANDOVER.md`, `_handover/powerpoint/README.md`. Vor neuen Arbeiten das Symbol "Sync" druecken,
   dann ist das Wissen auf dem Stand des Branches. Ohne GitHub-Anbindung dieselben Dateien aus dem Lieferpaket
   `IdeeRoth_Projektwissen_2026-10-16.zip` von Hand hochladen (dort zusaetzlich die Anleitung als PDF, die
   Bilduebersicht und die Palette).
4. Fuer Arbeiten am Code wie bisher eine Claude-Code-Sitzung mit dem Repository `IRo101101/IRo-landingpage` starten,
   Branch `v2-redesign`. `CLAUDE.md` wird dort automatisch gelesen und verweist auf `UEBERGABE.md`. Das Projekt ist
   der Ort fuer Besprechung und Entscheide, die Code-Sitzung der Ort fuer die Umsetzung.
5. Danach kann die alte Chat-Sitzung geloescht werden. Die Verweise `Claude-Session: ...` in alten Commit-Nachrichten
   zeigen dann ins Leere; das ist unschaedlich.

## 10. Kurzchronik

- 30.09.2026: v2 nach der Bauanleitung "Northwall" gebaut, Vorschau auf GitHub Pages, Design-Uebergabe geschrieben.
- 08.10.: Videovergleich mit der Referenz, Variante B gezeigt und verworfen, Runde 1 in `r1/` gestartet.
- 09.10.: Entscheide Fotowechsel, Layouts U-A/K-A/T-A, Footer B-4, Logo-Kachel L-4, Textlink-Regel, Kontaktseite.
- 10.10.: Anreise-Texte mit Quellen, Routen- und Fahrplan-Links, Fotos 22 und 23.
- 15.10.: PowerPoint-Vorlage in drei Vorschaurunden entwickelt und geliefert; Website: duenne Linie, runde Punkte.
- 16.10.: Uebergabe an das Claude-Projekt.
- 18.10.: Nebenprojekt "Karte und Anfahrt" uebernommen; Website-Arbeit nur noch im Claude-Projekt.
- 19.11.: Fotos mit erfundenen Personen geprueft und als Master in Originalgroesse neu aufgebaut, zehn Fotos im
  Fundus `r1` ersetzt.
- 20.11.: Drei Koepfe, die der echten Person noch glichen, neu erzeugt (zusaetzliche Fotos 24, 25, 26). PowerPoint-
  Beispieldecks: Fotos aus den Mastern, Ihre-Ansprechpersonen-Folie mit Foto 14 (Inhaber) statt einer erfundenen
  Person, alle Fotos zugeschnitten statt gestaucht (Fehler seit 15.10.), Logo-Dateien fuer den Bau ins Repository.
- 20.11.: Foto 01 (Espressomaschine, Geraet gibt es nicht mehr) aus r1 entfernt, in der Rotation durch 08 ersetzt.
- 20.11.: Foto 12 aus der Rotation (durch 27 Team am langen Tisch ersetzt), Prozess mit ruhigem Bildwechsel clear,
  Texte zu Ideation, Simulation, Schritten 01/02/04/05 und Team ueberarbeitet (V2-VIDEOVERGLEICH 78 bis 80).
- 20.11.: Foto 22 mit neuem IRo-Logo auf den Mustern (Lieferung Kunde) im Fundus, Prozessschritt 05 Prototyp zeigt 22.
- 20.11.: Englisch auf allen fuenf r1-Seiten geprueft und verbessert, Alt-Texte und Bereichs-Labels jetzt zweisprachig.
- 20.11.: Ladepanel nur mit dem IRo-Zeichen ist Standard (Kundenentscheid); das alte Panel mit Fotos: `r1/?lade=fotos`.
