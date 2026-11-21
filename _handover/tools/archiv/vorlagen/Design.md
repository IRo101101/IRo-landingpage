# IdeeRoth AG - Design der Website (Stand {{STAND}})

Kurzfassung des Erscheinungsbilds von www.iro.swiss, damit neue Unterlagen gleich aussehen. Die PowerPoint-Vorlage im
selben Design liegt in `vorlage/`.

## Farben

| Name | Hex | RGB | Verwendung |
|---|---|---|---|
| Carbon Black | #111418 | 17, 20, 24 | dunkler Grund, Text auf hellem Grund |
| Ice Mint | #E7FFF2 | 231, 255, 242 | heller Grund |
| Signal Green | #25C77A | 37, 199, 122 | Akzent, sparsam: Punkt, Füllung beim Darüberfahren, Zahl, Linkfarbe auf hellem Grund |
| Fresh Mint | #B7F3D0 | 183, 243, 208 | Flächen auf hellem Grund, Linkfarbe auf dunklem Grund |
| Steel Gray | #707981 | 112, 121, 129 | Nebentext |
| Weiss | #FFFFFF | 255, 255, 255 | Text auf dunklem Grund |

Regeln: Flächen wechseln zwischen dunkel (Carbon Black) und hell (Ice Mint), nie gemischt. Grün nur als Akzent, nie als
Fläche für Textblöcke. Signal Green auf Ice Mint ist für Schrift zu schwach (Kontrast unter 3:1), dort Carbon Black.

## Schrift

- Einzige Schrift: Inter (frei, SIL Open Font License). Schnitte Regular 400 und Medium 500, Bold nur in Ausnahmen.
  Die Schriftdateien für Office liegen in `vorlage/schrift/`.
- Titel: Inter Medium, enger Zeilenabstand, leicht negative Laufweite.
- Fliesstext: Inter Regular, Zeilenabstand rund 1,25.
- Keine Versalien, keine Unterstreichungen.

## Gestaltungselemente

- Linien: 1 px, durchgezogen, in der Linienfarbe (Weiss 40 % auf dunkel, Carbon Black 40 % auf hell). Keine
  gestrichelten Linien.
- Punkte statt Rechtecke: runde Eckpunkte an Rahmen, runde Aufzählungspunkte.
- Nummern vor Begriffen: «01 //  Vision», «02 /  Konstruktion».
- Kicker: kurze Zeile über dem Titel.
- Schaltflächen: dünner Rahmen, kein Radius, beim Darüberfahren füllt sich die Fläche grün.
- Fotos: randlos, ohne Radius, ohne Schatten. Liegt Text auf dem Foto, dunkelt ein leichter Schleier von oben ab.

## Logo

- Bildmarke «IRo.» einfarbig: weiss auf dunklem Grund, schwarz auf hellem Grund (`bilder/logo/mark-*.png`).
- Lockup mit «SWISS» (`lockup-*.png`), Wortmarke (`word-*.png`), Logo-Kachel nach dem Original (`tile-white.png`).
- Das farbige Original (`logo-original-iro-swiss.png`) dient als Referenz. Auf der Website erscheint es nicht farbig.
- Badges NAFEMS und Lehrbetrieb (`bilder/badges/`) einfarbig in hellem Grau, beim Darüberfahren Fresh Mint.

## Bewegung (für Präsentationen sinngemäss)

Alles federt weich ein, Wörter erscheinen nacheinander, Fotos öffnen sich von oben. In PowerPoint: «Wischen von unten»
oder «Erscheinen», kurze Dauer, keine Sprünge oder Drehungen.
