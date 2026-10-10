# IdeeRoth AG - Design-Uebergabe Website v2 -> PowerPoint-Vorlage

Stand 30.09.2026. Dieses Paket beschreibt das Design der neuen Website (v2) vollstaendig,
damit eine andere Claude-Sitzung (mit dem Plugin **iro-office**) die PowerPoint-Vorlage
daran anpassen kann, ohne diese Sitzung zu kennen.

## 1. Quellen und Links
- Vorschau der Website: https://iro101101.github.io/IRo-landingpage/ (DE/EN-Umschalter oben rechts)
- Repository: https://github.com/IRo101101/IRo-landingpage, Branch `v2-redesign`
  (Live-Site www.iro.swiss = v1, Branch `claude/iro-skill-designsystem-access-0i426w`, unveraendert)
- Dieses Paket: Ordner `_handover/` im Branch `v2-redesign`
  - `DESIGN-HANDOVER.md` (dieses Dokument)
  - `palette.png` (Farbtafel)
  - `logo/` (Logo-Original und einfarbige Masken, weiss und schwarz)
  - `screens/` (Screenshots aller Bloecke, DE und EN, Desktop 1440 und Mobil 390)
- Quellcode des Designs: `assets/css/styles.css` (Tokens ganz oben unter `:root`), `assets/js/main.js`
  (Bewegungs-Konstanten ganz oben), `index.html` (Texte DE im Text, EN in `data-en`).
- Fotos: `assets/img/v2/01.webp` bis `23.webp` (1800 px breit, Hero 07 mit 2400 px) und `NN-m.webp` (1100 px); 22 und 23
  (10.10.2026: 3D-Drucker mit Shore-Haertemustern, offene Glastuer zum Buero) sind im Fundus, aber noch nicht eingesetzt.
  Originale (6720 x 4480 JPG) liegen beim Kunden (Fotograf rsf, Pakete 1-5).
- Verbindliche Projektregeln: `CLAUDE.md` im Repo (Wording, DE/EN, keine Gedankenstriche, keine Unterstreichungen,
  "aus der Schweiz" statt "aus Romanshorn", nie Siemens/NX/Ansys usw. erwaehnen).

## 2. Farben (siehe palette.png)
| Name | Hex | RGB | Verwendung |
|---|---|---|---|
| Carbon Black | #111418 | 17, 20, 24 | Dunkler Grund (Hero, Kompetenzen, Prozess, Kontakt), Text auf hellem Grund, Buttons auf hell |
| Ice Mint | #E7FFF2 | 231, 255, 242 | Heller Grund (Unternehmen, Team, Unterseiten) |
| Signal Green | #25C77A | 37, 199, 122 | Akzent, sparsam: Hover-Fuellung der Buttons, Prozentzahl, Fokus, Consent-Button "Akzeptieren" |
| Steel Gray | #707981 | 112, 121, 129 | Nebentext, Meta (in der Website meist als Transparenz gesetzt, siehe unten) |
| Fresh Mint | #B7F3D0 | 183, 243, 208 | Flaechen auf hellem Grund (Team-Zeilen), Hover-Flaechen |
| White | #FFFFFF | 255, 255, 255 | Text auf dunklem Grund, Header-Button auf dunkel |

Abgeleitete Toene (auf der Website als Transparenz, fuer PowerPoint als feste Farben rechnen):
- Text gedaempft auf dunkel: Weiss 55 % ueber Carbon Black = ca. #9A9D9F
- Text gedaempft auf hell: Carbon Black 58 % ueber Ice Mint = ca. #6E7A78
- Hairlines auf dunkel: Weiss 30 bis 40 % (gestrichelt), auf hell: Carbon Black 40 % (gestrichelt)
- Foto-Schleier oben im Hero: Carbon Black 42 % nach 0 % (Verlauf von oben)

Regel: Bloecke wechseln zwischen dunkel (Carbon Black) und hell (Ice Mint). Nie beide Gruende auf einer Flaeche mischen.
Gruen nur als Akzent (Punkt, Fuellung, Zahl), nie als Fläche fuer Text-Bloecke.

## 3. Schrift
- Einzige Schrift: **Inter** (variabel, 100 bis 900). Auf der Website selbst gehostet (`assets/fonts/inter.woff2`).
  Fuer PowerPoint: Inter als TTF installieren (frei, SIL Open Font License, https://rsms.me/inter/ oder Google Fonts).
  Fallback, falls Inter nicht installiert werden darf: Segoe UI / Arial (nicht ideal, Laufweite pruefen).
- Display (Titel): Inter Medium (500), Zeilenabstand 0.95, Laufweite -2 %. Groessen auf 1440 px Basis:
  Hero-Titel 72 px, Schlusszeile 72 px, Sektionstitel 55 px, Prozess-Schritte 72 px, Karten-Namen 20 px versal.
- Labels / Navigation: Inter Regular (400), **versal** (Grossbuchstaben), 14 px, Laufweite -3 %, Zeilenabstand 1.2.
  Kleine Labels (Eyebrow, Readout): 12 px versal, Laufweite -3 %.
- Fliesstext: Inter Regular 18 px (auf 1440), Zeilenabstand 1.2 bis 1.25; Nebentext 15 px.
- Zahlen / Kennzahlen: Inter Medium, gross; Label darunter gedaempft.
- Umrechnung fuer Folien 16:9 (33.867 x 19.05 cm): Website-Pixel auf 1440 px Breite mal 0.667 = Punkt.
  Beispiele: Titel 72 px -> 48 pt, Sektionstitel 55 px -> 36 pt, Label 14 px -> 9.5 pt (auf Folien 10 pt), Fliesstext 18 px -> 12 pt.

## 4. Design-Vokabular ("Zeichenbrett"-Sprache)
- **Gestrichelte Hairlines** (1 px, 40 % Deckung) trennen Zellen im Header, Zeilen in Listen, Rahmen von Buttons.
- **Eckmarker**: 4 x 4 px Quadrate an den Ecken jedes gestrichelten Kastens, 2 px nach aussen versetzt,
  gefuellt (weiss auf dunkel, schwarz auf hell) mit 1 px Rand 40 %. Bei Hover wandern sie 3 px diagonal nach aussen.
- **Buttons**: gestrichelter Rahmen, Text versal 14 bis 16 px, Innenabstand 16 x 24 px, kein Radius.
  Primaer-Button (Header): gefuellt weiss mit schwarzem Text auf dunkel, schwarz mit weissem Text auf hell,
  mit kleinem Pfeil (nach rechts oben, 10 px). Hover: gruene Fuellung von unten, Text wird schwarz.
- **Nummern-Praefix**: "01 //  Vision", "02 /  Konstruktion" - Nummer klein und gedaempft vor dem Begriff.
- **Eyebrow**: kurze versale Zeile ueber dem Titel, 12 px, mittig oder linksbuendig ("IDEEROTH AG · SCHWEIZ").
- **Mittelpunkt** als Trenner (·), nie Gedankenstrich; Bindestrich (-) im Fliesstext.
- **Fotos**: randlos, ohne Radius, ohne Schatten; leicht dunkler Schleier von oben, wenn Text darauf liegt.
  Karten mit 94 px weichem Verlauf unten und versalem Namen mittig im Verlauf.
  Freistehende Fotos duerfen leicht gedreht sein (-12 bis +14 Grad, Ladepanel / Prozess-Buehne).
- **Logo**: Bildmarke "IRo." einfarbig (weiss auf dunkel, schwarz auf hell), Hoehe 22 px im Header (Website),
  Lockup mit "SWISS" darunter im Kontakt-Block (88 x 57 px). Das originale Logo (dunkelblaues Quadrat mit Marke)
  wird auf der Website nicht farbig gezeigt; als Datei liegt es bei (`logo/logo-original-iro-swiss.png`).
- **Raster**: Seitenrand 32 px (Desktop 1440), 24 px (Tablet), 16 px (Mobil). Header 65 px hoch.
- **Bewegung** (fuer Folien-Uebergaenge sinngemaess): Alles federt weich ein (kritisch gedaempft), Woerter erscheinen
  nacheinander von unten (55 ms Abstand bei Titeln, 22 ms bei Text), Fotos oeffnen sich von oben nach unten (Maske),
  Zahlen zaehlen hoch. In PowerPoint: "Wischen von unten" oder "Erscheinen" mit kurzer Dauer (0.3 s), keine Effekte
  mit Sprung oder Drehung.

## 5. Die sechs Bloecke (Screenshots in screens/)
1. **Hero** (dunkel) - Vollflaechiges Foto 07 (Gegenlicht Tuer). Titel links oben "Aus weniger mehr entwickeln.",
   Hairline in der Mitte mit Intro links und drei Kennzahlen rechts, zwei gestrichelte Buttons links unten,
   Schlusszeile rechts unten in zwei Zeilen "Von der ersten Idee. / Bis zur Serie."
   -> Folien-Idee: Titelfolie mit Vollbild-Foto, Titel links oben, Schlusszeile rechts unten.
2. **Unternehmen** (hell) - Eyebrow und Titel mittig, ein hochformatiges Foto in der Mitte (rotiert durch 10 Motive),
   fuenf Themen links unten (aktives schwarz, andere 55 %), Mission-Text rechts unten mit Einzug.
   -> Folien-Idee: Kapitel-/Ueberblicksfolie hell mit einem Bild in der Mitte.
3. **Kompetenzen** (dunkel) - Vier Fotokarten nebeneinander, aussen niedriger, innen hoeher; Name versal im Verlauf unten:
   Ideation, Entwicklung, Simulation, Prototyping.
   -> Folien-Idee: Vier-Spalten-Folie mit Bildkarten.
4. **Leistungen / Prozess** (dunkel) - Fuenf grosse Schritte untereinander (01 / Idee ... 05 / Prototyp), das aktive
   Wort scharf ueber einem gedrehten Foto, die anderen weich und 30 %; Text unter dem Foto.
   -> Folien-Idee: Prozessfolie mit einem betonten Schritt.
5. **Team** (hell) - Titel links, Intro rechts, breites Teamfoto, darunter Zeilen in Fresh Mint:
   "01 //  Vision", "02 //  Mission", "03 //  Leitbild", "04 //  Berufsbildung" mit Name, Text und Punkteliste rechts.
   -> Folien-Idee: Inhaltsfolien hell mit Fresh-Mint-Zeilen als Kaesten.
6. **Kontakt** (dunkel) - Foto 17 vollflaechig, links schwarze Schiene mit Logo, Abschnittslinks (mit Pfeil),
   Badges (NAFEMS, Lehrbetrieb), Telefon / Mail / Adresse; rechts unten "Sprechen wir ueber Ihr Projekt." mit
   Buttons "E-Mail schreiben" und "Anrufen"; Fusszeile Impressum / Datenschutz / Cookie-Einstellungen, © 2026 IdeeRoth AG.
   -> Folien-Idee: Schlussfolie mit Kontakt, Schiene links.

Unterseiten (Karriere, Impressum, Datenschutz): heller Grund, schmale Textspalte (max. 736 px), Titel 55 px,
Zwischentitel 24 px, Text 17 px, gestrichelte Kaesten fuer Inserate, dunkler Fuss mit Logo, Links, Adresse, Badges.

## 6. Texte (Kurzfassung, DE / EN)
- Claim: "Aus weniger mehr entwickeln." / "Develop more from less."
- Schlusszeile: "Von der ersten Idee. Bis zur Serie." / "From the first idea. To series production."
- Intro: "Von der ersten Idee bis zur fertigen Serienentwicklung - Konstruktion, Simulation, Entwicklung und
  Prototyping unter einem Dach." / "From the first idea to finished series production - engineering, simulation,
  development and prototyping under one roof."
- Positionierung: "Spezialanbieterin fuer Produktentwicklung" / "Specialist in product development"
- Themen: Swiss engineered · 3D-CAD · FEM / CFD · Prototyping · Berufsbildung (EN: Vocational training)
- Kompetenzen: Ideation · Entwicklung (Development) · Simulation · Prototyping
- Prozess: 01 Idee (Idea) · 02 Konstruktion (Engineering) · 03 Simulation · 04 Entwicklung (Development) · 05 Prototyp (Prototype)
- Vision: "Better products for life." Mission: "Aus weniger mehr entwickeln." Leitbild: "Verantwortungsbewusst, ehrlich, loyal."
- Zitat: "Aus weniger mehr entwickeln - die einfachste Loesung ist meist die beste." Alain Roth, Gruender
- Kontakt: IdeeRoth AG · Hafenstrasse 62 · CH-8590 Romanshorn · +41 71 855 88 55 · info@iro.swiss
- Kennzahlen im Hero (20+ Jahre, 100+ Projekte, 5 Leistungen) sind PLATZHALTER.
- Vollstaendige Texte DE/EN: `index.html`, `karriere.html`, `impressum.html`, `datenschutz.html`; ausserdem die
  Word-Dateien "IdeeRoth_Website-Texte_Kurzversion_DE-EN.docx" und "..._ausfuehrlich_DE-EN.docx" (v1, beim Kunden).

## 7. Vorschlag Folien-Master (Ausgangspunkt fuer die andere Sitzung)
1. Titelfolie dunkel: Vollbild-Foto mit Schleier, Bildmarke weiss oben links (22 px hoch), Titel 48 pt links oben,
   Untertitel rechts unten 28 bis 48 pt, gestrichelte Hairline mit Datum / Kunde / Projektnummer in der Mitte.
2. Kapitelfolie hell: Eyebrow 10 pt versal, Titel 36 pt mittig, ein Foto hochformatig in der Mitte, Nummer "01 //".
3. Inhaltsfolie hell: Titel links 28 pt, Text 12 pt in zwei Spalten, Fresh-Mint-Kaesten fuer Hervorhebungen,
   Fusszeile versal 8 pt: IdeeRoth AG · Projekt · Seite.
4. Inhaltsfolie dunkel: gleiche Aufteilung auf Carbon Black mit weissem Text (fuer Renderings, CAD, Simulation).
5. Vier-Karten-Folie: vier Bildkarten mit versalem Namen im Verlauf.
6. Prozessfolie: fuenf Schritte mit Nummern, aktiver Schritt schwarz/weiss, andere 55 %.
7. Schlussfolie dunkel: Kontakt-Schiene links, Foto rechts, "Sprechen wir ueber Ihr Projekt.".
Header-Logik: Bildmarke einfarbig, Farbe je Grund. Immer 32 px Rand (auf Folie ca. 0.75 cm). Keine Schatten,
keine Radien, keine Unterstreichungen, keine Gedankenstriche.

## 8. Was die andere Sitzung braucht
- Zugriff auf das Repo (Branch `v2-redesign`) oder dieses Paket als ZIP (`IdeeRoth_Design-Handover_v2.zip`).
- Das Plugin iro-office (bestehende Praesentationsvorlage, Hausstil) - in dieser Cloud-Sitzung war es nicht geladen.
- Die bestehende PowerPoint-Vorlage (.potx/.pptx) als Datei, damit Platzhalter und Master uebernommen werden.
- Inter als installierte Schrift auf dem Rechner, auf dem die Vorlage gebaut wird.
