# Geplante Anpassungen (noch NICHT umgesetzt)

Gesammelt am 2026-07-19 nach dem Einfrieren/Download des ersten Stands
(Commit `9f5969b`). Diese Punkte bewusst **noch nicht** integriert - erst auf
ausdrueckliche Freigabe umsetzen. Danach Website neu als ZIP fuers `www`
bereitstellen.

---

## 1. Footer - Logos verlinken
- [ ] **NAFEMS-Logo** verlinken auf `https://www.nafems.org` (neuer Tab, `rel="noopener"`).
      Ort: `index.html` + `karriere.html` + `impressum.html` + `datenschutz.html`
      (Badge steckt im Footer aller Seiten -> ueberall gleich anpassen).
- [ ] **Lehrbetriebs-Vignette "Wir machen Profis"** verlinken auf die offizielle
      Kampagnen-Seite `https://www.berufsbildungplus.ch` (neuer Tab, `rel="noopener"`).
      Quelle bestaetigt: Kampagne des SBFI/Bund (berufsbildungplus.ch). Ort: Footer aller Seiten.

## 2. Footer - Copyright + Cookie-Einstellungen
- [ ] `footer__bottom` sauber gliedern. Aktuell klebt "Cookie-Einstellungen"
      ohne Abstand am "© 2026 IdeeRoth AG".
- [ ] Best Practice: "© 2026 IdeeRoth AG" (das ©-Zeichen IST der Copyright-Vermerk)
      links; rechts die Links Impressum · Datenschutz · Karriere · **Cookie-Einstellungen**
      mit klarem Abstand (eigener Link, ggf. mit Trenner). Cookie-Link wird per JS
      injiziert (`assets/js/main.js`, ~Z.124: in `.footer__bottom span:last-child`).
      Dort Abstand/Trenner sicherstellen, damit er nicht am Jahr klebt.

## 3. index.html - Abschnitt "01 · Unternehmen", die 4 Kennzahl-Zellen (`.stats`)
   (Die identische 4er-Leiste im Hero `.hero__meta` konsistent mitziehen.)
- [ ] **Zelle 1** heute: Wert "Romanshorn" / Label "Standort Schweiz".
      NEU: Wert **"Swiss engineered"** / Label **"Standort Romanshorn"** (klein).
- [ ] **Zelle 2** "3D-CAD" bleibt.
- [ ] **Zelle 3** "FEM · CFD" muss auf **einer Zeile** stehen (aktuell bricht CFD
      unter FEM um). CSS-Fix: `.stat__value { white-space: nowrap; }` bzw. Umbruch
      unterbinden.
- [ ] **Zelle 4** "Im Haus / Prototypen-Werkstatt" umformulieren -> siehe **Vorschlag A** unten.

## 4. index.html - Karriere-Banner oben (`#karriere .kbanner`)
- [ ] Ueberschrift NEU: **"Wir bilden aus - werde Teil von uns."**
      (heute: "Wir bilden aus - werde Teil davon.")
- [ ] Fliesstext umformulieren, stoerendes doppeltes "an an" raus. Heute:
      "Vom ersten Tag an an echten Projekten mitarbeiten. Offene Lehrstelle:
      Konstrukteur/-in EFZ, Start August 2027."
      Vorschlag NEU: **"Ab dem ersten Tag arbeitest du an echten Projekten mit.
      Offene Lehrstelle: Konstrukteur/-in EFZ, Start August 2027."**
- [ ] **Lesbarkeit dunkler Hintergrund:** die Zeile "Offene Lehrstelle:
      Konstrukteur/-in EFZ, Start August 2027" ist zu dunkel (aktuell
      `color: var(--iro-dark-text-2)` = #C5C7C4). Aufhellen (heller Grauton
      naeher an #FFFFFF bzw. eigener, hellerer Token), damit gut lesbar.

## 5. Footer - "Logo" unten links (`.footer__wordmark`)
- [ ] Heute nur ein CSS-Text-Schriftzug "IdeeRothAG" - das ist NICHT das echte Logo.
      Ersetzen durch das **echte Logo** in heller/grauer Variante fuer dunklen
      Hintergrund -> siehe **Vorschlag B** unten.

## 6. Hero-/Footer-Text "aus Romanshorn" -> Swissness
- [ ] Footer-Brand-Text (`index.html` Z.353): "Spezialanbieterin fuer
      Produktentwicklung **aus Romanshorn** - aus weniger mehr entwickeln."
      -> "**aus der Schweiz**" (oder aehnliche Swissness-Formulierung).
      Der Rest des Satzes gefaellt und bleibt.
- [ ] Hinweis: In den `<meta>`-Descriptions darf "Romanshorn" fuer lokale SEO
      stehen bleiben (kein sichtbarer Seitentext). Nur sichtbare Texte anpassen.

## 7. Header-Navigation - kompakter / zweispaltig
- [ ] Header wirkt zu hoch. Navigation zweizeilig/zweispaltig anordnen:
      Spalte 1: Unternehmen · Leistungen · Ueber uns
      Spalte 2: Team · Karriere · Kontakt
- [ ] **Zu klaeren bei Umsetzung:** "Karriere" ist heute Untermenue von "Team"
      (Dropdown). Fuer die 2-Spalten-Optik entweder (a) Dropdown behalten und die
      Top-Level-Punkte in zwei Reihen umbrechen, oder (b) Karriere als eigenen
      Punkt in Spalte 2 fuehren. Zusaetzlich Logo-Hoehe (heute 200x86) pruefen -
      das ist mutmasslich der Hauptgrund fuer die Bauhoehe.

---

# Vorschlaege zu den offenen Punkten

## Vorschlag A - Zelle 4 "Prototypenwerkstatt"
Muster der anderen Zellen: Wert = kurzer, praegnanter Begriff; Label = Beschreibung.
- **A1 (Empfehlung):** Wert **"Prototyping"** / Label **"Eigene Werkstatt"**
  -> parallel zu "3D-CAD" und "FEM · CFD" als Kompetenz-Begriff, klar und knapp.
- A2: Wert "Eigene Werkstatt" / Label "Prototypenbau"
- A3: Wert "Prototypen" / Label "Aus eigener Werkstatt"

## Vorschlag B - Footer-Logo unten links
Heute nur CSS-Schriftzug. Vorschlag:
- **B1 (Empfehlung):** Echtes Logo als **helle/graue Monochrom-Variante**
  (`logo-light.png` bzw. `logo-white.png`) einsetzen, ~150-170px breit, damit es
  auf dem dunklen Footer gut sichtbar und markenkonform ist - analog zu den grauen
  Badges. Datei aus dem **IdeeRoth Design System** (offizielles Logo, helle Version)
  beziehen; falls keine helle Version vorliegt, aus dem Original monochrom hell
  aufbereiten.
- B2: Text-Schriftzug behalten, aber in Marken-Schrift/-Abstaenden sauber gesetzt
  (nur Notloesung, weniger stark als B1).

Bei Umsetzung: kurz Freigabe zu A (A1?) und B (B1?) einholen, dann alles zusammen
umsetzen, testen und neues `www`-ZIP bereitstellen.
