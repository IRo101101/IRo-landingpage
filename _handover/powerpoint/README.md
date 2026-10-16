# PowerPoint-Vorlage IdeeRoth AG (Stand 15.10.2026)

Die Vorlage uebertraegt das Design der Website (r1) auf PowerPoint. Alle Entscheide des Kunden vom 15.10.2026 sind
eingebaut: duenne durchgezogene Linie (0.5 pt, Textfarbe 40 %), Fusszeile F-2 senkrecht rechts mit waagrechter
Seitenzahl, drei Grundfarben Weiss / Mint / Dark, Punkte statt Rechtecke (Aufzaehlung, Eckmarker), Ampel-Labels
(Rot #B8463A, Orange #E2A33D, Fresh Mint) nur fuer Freigabe-Labels, Kennzeichnung V-2 (rotes Label oben rechts,
darunter die Kurzform "Schutzvermerk ISO 16016 beachten"), Terminplan nach der alten Vorlage (Folie 10),
Bausteine als eigene (ausgeblendete) Folie, Layouts in Deutsch und Englisch.

## Dateien

- `out/IdeeRoth_Vorlage.potx`: die Vorlage, 32 Layouts (`DE · 01 ...` bis `EN · 16 ...`), Designfarben
  (dk1 Carbon Black, lt1 Ice Mint, dk2 Steel Gray, lt2 Fresh Mint, Akzent 1 Signal Green, 2 Fresh Mint, 3 Steel Gray,
  4 Light Gray, 5 Rot, 6 Orange), Schrift Inter, drei ausgeblendete Referenzfolien.
- `out/IdeeRoth_Beispiel_DE.pptx`, `out/IdeeRoth_Beispiel_EN.pptx`: Beispieldecks (22 Folien + 3 Anhang) auf denselben
  Layouts; dazu die PDFs.
- `out/IdeeRoth_Vorlage_Anleitung.pdf` (aus `anleitung.html`): einseitige Anleitung.
- `out/paket/`: Lieferpaket (ZIP-Inhalt) mit LIESMICH.txt und `fonts/` (Inter, SIL OFL).
- `referenz/vorlage_iro_praesentation_20201010.pptx`: die alte Kundenvorlage von 2020 (Vorbild fuer den Terminplan,
  Folie 10). Nur zum Nachschlagen; nicht weitergeben.

## Bauen

Benoetigt Node (pptxgenjs, jszip), Python 3 (python-pptx, pymupdf, defusedxml), LibreOffice Impress fuer die PDFs,
Inter als Systemschrift (Rendering), Chromium/Playwright fuer die Anleitung.

```
cd _handover/powerpoint
npm install pptxgenjs jszip          # einmalig, legt node_modules an (nicht einchecken)
NODE_PATH="$PWD/node_modules" node build_template.js
NODE_PATH="$PWD/node_modules" node build_samples.js
python3 finish.py out/IdeeRoth_Vorlage_raw.pptx out/IdeeRoth_Vorlage.potx
python3 finish.py out/IdeeRoth_Beispiel_DE_raw.pptx out/IdeeRoth_Beispiel_DE.pptx --footer "IDEEROTH AG  ·  KUNDENPRÄSENTATION  ·  15. OKTOBER 2026"
python3 finish.py out/IdeeRoth_Beispiel_EN_raw.pptx out/IdeeRoth_Beispiel_EN.pptx --footer "IDEEROTH AG  ·  CUSTOMER PRESENTATION  ·  15 OCTOBER 2026"
```

- `lib.js`: Theme, Tokens, die 16 Layouts je Sprache (`defineLayouts`), Referenzfolien (`addReferenceSlides`) und
  Beispielfolien (`addSampleSlides`). `apply_theme.js` (aus dem pptx-Skill) schreibt die Designfarben ins Theme.
- `finish.py`: macht die senkrechte Fusszeile jedes Layouts zum Fusszeilen-Platzhalter (type ftr, idx 11), ergaenzt den
  Master (Platzhalter, `hf ftr=1 sldNum=1`), setzt auf den Beispielfolien den Fusszeilentext, entfernt das leere
  Standard-Layout von pptxgenjs und setzt fuer die .potx den Inhaltstyp `presentationml.template`.
- `assets/`: Logo-Masken (mark, tile, word in Mint und Schwarz), Badges, Fotos als JPEG (aus `r1/assets/img/v2`).
- Pruefen: `validate.py` aus dem pptx-Skill (fuer die .potx eine Kopie mit Endung .pptx pruefen), LibreOffice-PDF,
  `markitdown` fuer die Textregeln (keine Gedankenstriche, keine verbotenen Woerter, kein ß).

## Regeln (siehe auch CLAUDE.md)

Alle Wording-Regeln der Website gelten: keine Gedankenstriche, nie Siemens/NX/Ansys/Flow-3D/Simcenter/Teamcenter/
Nastran/"Bodensee", keine Unterstreichungen, Schweizer Schreibweise (ss). Signal Green nur als Akzent, Ampelfarben nur
fuer Labels. Kennzahlen (20+, 100+, 5) und Projektzahlen in den Beispielen sind Platzhalter.
