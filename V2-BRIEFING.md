# v2-Redesign - Briefing und Stand (30.09.2026)

Vorlage: Bauanleitung "Northwall" (Struktur, Motion, Timing 1:1), Inhalte/Fotos/Farben = IdeeRoth.
Vorschau: https://iro101101.github.io/IRo-landingpage/ (GitHub Pages, Branch `v2-redesign`, Ordner `/`).

## A/B-Vergleich (seit 08.10.2026)
- Variante A = Stand vom 30.09., eingefroren: https://iro101101.github.io/IRo-landingpage/
- Variante B = Feinschliff nach dem Video-Vergleich (Ladepanel kuerzer, Kennzahlen in einer Zeile, Prozess
  lesbar auf Mobil, Karten springen auf den Prozessschritt, Kontakt mit gruener Primaeraktion u. a.):
  https://iro101101.github.io/IRo-landingpage/b/
- Punkteliste mit Status: `V2-VIDEOVERGLEICH.md`. Nach dem Entscheid wird eine Variante zum Root, die andere geloescht.

## Entscheidungen
- Farben: Carbon Black #111418 (dunkel), Ice Mint #E7FFF2 (hell), Signal Green #25C77A (Akzent),
  Steel Gray #707981 (Nebentext), Fresh Mint #B7F3D0 (Team-Zeilen). Logo einfarbig (weiss/schwarz) als Maske.
- Schrift: Inter (selbst gehostet). Smooth Scroll: Lenis lokal. Keine externen Skripte/Assets; Icons als Inline-SVG.
- Sprachen: DE Default + Auto-Erkennung + Umschalter DE/EN (Header-Dropdown, Mobilmenue); alles zweisprachig.
- Unterseiten: karriere.html (Inserat verbatim), impressum.html, datenschutz.html; Karriere-Zeile im Team-Block.
- GA4 (G-P2GWBZFYTZ) nur nach Opt-in + Consent-Banner. Kontakt: NUR mailto + Telefon (kein Formular).
- Relative Pfade, noindex + robots Disallow waehrend der Vorschau.

## Bloecke (umgesetzt)
1. Hero: Foto 07 (Gegenlicht Tuer). "Aus weniger mehr entwickeln." / "Von der ersten Idee. Bis zur Serie."
   Drei zaehlende Kennzahlen: PLATZHALTER (20+ Jahre, 100+ Projekte, 5 Leistungen) - bitte korrigieren.
2. Unternehmen: 10 rotierende Fotos, 5 Themen (Swiss engineered, 3D-CAD, FEM / CFD, Prototyping, Berufsbildung),
   Mission-Text, Button "Ueber uns" -> Team.
3. Kompetenzen: 4 Karten Ideation (09), Entwicklung (11), Simulation (13), Prototyping (14) -> Leistungen.
4. Leistungen / Prozess: 5 Schritte Idee (19), Konstruktion (15), Simulation (10), Entwicklung (21), Prototyp (03),
   Texte aus v1 gekuerzt, Auto-Weiterschalten unter 1440, Neigung zur Maus.
5. Team: Titel + Intro, Team-Foto 16, Zeilen Vision / Mission / Leitbild (Texte v1) + Karriere-Zeile (Lehrstelle 2027).
6. Kontakt: Foto 17, schwarze Schiene mit Logo, Abschnittslinks, Badges (NAFEMS, Lehrbetrieb), Telefon/Mail/Adresse;
   rechts "Sprechen wir ueber Ihr Projekt." mit E-Mail / Anrufen; Impressum / Datenschutz / Cookie-Einstellungen.

## Texte zur Freigabe (neu getextet, DE/EN in den HTML-Dateien)
- Hero-Schlusszeile, Hero-Intro, Kennzahlen-Labels, Unternehmen-Titel/Mission, Karten-Namen,
  Prozess-Captions (aus v1 gekuerzt), Team-Titel/Intro/Zeilen, Kontakt-Schlusszeile.

## Go-live (spaeter)
- noindex-Meta und robots.txt Disallow entfernen, sitemap.xml anlegen, Cache-Version hochzaehlen,
  ZIP fuer Hostpoint bauen (siehe CLAUDE.md Deployment).
