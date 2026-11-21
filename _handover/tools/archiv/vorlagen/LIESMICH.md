# IdeeRoth AG - Website-Archiv (Stand {{STAND}})

Dieses Archiv enthält alles, was auf der Website www.iro.swiss steht: alle Texte auf Deutsch und Englisch, alle Fotos,
Logos und Badges, die Regeln für Textstil, Wording und Design, die Firmendaten, die PowerPoint-Vorlage und das
Upload-Paket der Website. Es dient als Grundlage für weitere Marketingunterlagen (Prospekte, Präsentationen, Inserate,
Social Media) und ist für Menschen und für eine KI gleich gut lesbar.

## Aufbau

| Ordner, Datei | Inhalt |
|---|---|
| `LIESMICH.md` | diese Übersicht |
| `firma/Firmendaten.md` | Stammdaten, Angebot, Branchen, Kennzahlen |
| `stil/Textstil-und-Wording.md` | verbindliche Schreibregeln, verbotene Wörter, Kernaussagen DE/EN |
| `stil/Glossar-DE-EN.md` | Fachbegriffe und Navigation, wie die Website sie übersetzt |
| `stil/Design.md` | Farben, Schrift, Linien, Logo, Bildsprache |
| `texte/de/*.md` | jede Seite auf Deutsch, in der Reihenfolge der Website |
| `texte/en/*.md` | dieselben Seiten auf Englisch, gleich gegliedert |
| `texte/texte.json` | jede Texteinheit als Paar Deutsch/Englisch mit Seite, Abschnitt und Art (für Programme und KI) |
| `texte/texte.csv` | dasselbe als Tabelle (UTF-8, Trennzeichen Semikolon, öffnet in Excel) |
| `bilder/fotos/` | alle Fotos der Website als JPG (1800 px breit, Startbild 07 mit 2400 px) |
| `bilder/logo/`, `bilder/badges/` | Logo-Varianten als PNG, Badges NAFEMS und Lehrbetrieb |
| `bilder/weitere/og.jpg` | Vorschaubild beim Teilen der Seite (1200 x 630) |
| `bilder/bilder.csv`, `bilder.json` | je Bild: Datei, Grösse, Alt-Text DE/EN, wo verwendet, Hinweis zu Personen |
| `vorlage/` | PowerPoint-Vorlage im Website-Design, Anleitung, Beispieldecks als PDF, Schrift Inter |
| `website/` | Upload-Paket der Website (so, wie es auf Hostpoint liegt) |

Die Seiten: `00-gemeinsam` (Navigation, Menü, Footer, Cookie-Hinweis), `01-startseite`, `02-kontakt`, `03-karriere`,
`04-impressum`, `05-datenschutz`, `06-fehlerseite-404`.

## So lesen sich die Textdateien

- `##` ist ein Abschnitt der Seite (Startbild, Unternehmen, Kompetenzen ... oder «01 // Kontakt»), `###` und tiefer
  sind die Überschriften der Website.
- «Schaltfläche» ist ein Knopf, «Verweis» ein Pfeil-Link, «Grafik» ein Badge oder Logo, jeweils mit Ziel (→).
- Bilder stehen an ihrer Stelle als Markdown-Bild mit dem Alt-Text und dem Pfad zur JPG-Datei.
- Ganz oben steht der Seitentitel und die Beschreibung für Suchmaschinen und Social Media.
- In `texte.json` hat jede Einheit die Felder `seite`, `abschnitt`, `art` (titel, absatz, punkt, zeile, knopf,
  verweis, grafik, bild, zitat, adresse, title, description, og:...), `de`, `en`, bei Knöpfen `ziel_de` und `ziel_en`.
- Gleicher Text in `de` und `en` heisst: Eigenname oder Fachwort (Ideation, Simulation, Team), oder das
  Lehrstellen-Inserat, das nach Kundenregel nur auf Deutsch erscheint.

## So arbeiten Sie damit

- Mensch: Die `.md`-Dateien öffnen sich in jedem Texteditor, in Word (als Text) oder schön dargestellt in einem
  Markdown-Betrachter. Die CSV-Dateien öffnen sich in Excel.
- KI: zuerst `stil/Textstil-und-Wording.md`, `stil/Glossar-DE-EN.md` und `firma/Firmendaten.md` geben, dann die
  passenden Seiten aus `texte/de` und `texte/en` oder `texte/texte.json`. Auftrag zum Beispiel: «Schreibe einen
  Prospekttext über die fünf Schritte. Halte jede Regel aus Textstil-und-Wording.md ein, erfinde keine Fakten, setze
  für fehlende Angaben Platzhalter in doppelten eckigen Klammern.»

## Hinweise zu den Fotos

- Auf mehreren Fotos sind die Gesichter der Mitarbeitenden durch erfundene Personen ersetzt (KI-Bearbeitung,
  Stand 20.11.2026). Der Inhaber ist echt. Welches Foto betroffen ist, steht in `bilder/bilder.csv` (Spalte hinweis).
- Die Fotos stammen aus den Web-Dateien der Website. Für den Druck in grosser Auflösung gibt es Master in
  Originalgrösse beim Kunden (nicht in diesem Archiv).
- Fotos 01 und 12 werden nicht mehr verwendet und fehlen darum.

## Quelle

Erzeugt aus dem Repository der Website (Branch `v2-redesign`, Ordner `r1/`) mit
`_handover/tools/archiv/build_archiv.py`. Bei Änderungen an der Website das Archiv neu bauen, dann stimmt es wieder.
