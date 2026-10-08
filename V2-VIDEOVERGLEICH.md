# v2 - Vergleich mit dem Video der Musterseite (Stand 08.10.2026)

Grundlage: Video der Northwall-Musterseite (11.3 s, 15 Bilder/s, Browserfenster ca. 1420 px breit,
zweimal geladen), eigene Aufnahme der IRo-Seite (1460 x 980, EN, Mausrad-Scroll), Original-Prompt (Spec),
Code auf Branch `v2-redesign`. Hover-Zustaende zeigt das Video nicht (Mauszeiger ruht).
Wichtig: Das Video laeuft im lg-Layout (unter 1440 px), unsere Aufnahme im xl-Layout - Groessen sind
deshalb nicht 1:1 vergleichbar, Aufbau, Reihenfolge und Zeiten schon.

Legende: [Spec] = Spec nicht eingehalten, [Video] = Video zeigt es, Spec regelt es nicht,
[Bug] = Fehler unabhaengig vom Video, [Entscheid] = Abweichung ist bewusst oder braucht einen Entscheid.
Status: offen / erledigt in B / verworfen.

Stand 08.10.2026, Abend: Variante A (Root der Pages-Vorschau) bleibt eingefroren fuer den 1:1-Vergleich.
Variante B liegt im Ordner `b/` und ist unter https://iro101101.github.io/IRo-landingpage/b/ erreichbar.
Alle mit "erledigt in B" markierten Punkte sind nur dort umgesetzt. Zeiten stammen aus dem Prompt (Spec),
nicht aus dem Video (Screenshot-Tool, nicht bildgenau).

## Teil 1 - Abweichungen zum Ablauf der Musterseite

### A. Ladepanel und Uebergabe (groesste Wirkung)
1. [Spec] Totzeit nach dem Vollbild: Karte ist nach ca. 0.4 s bildfuellend, Header und Text kommen erst
   0.7 bis 1.0 s spaeter. Ursache: Ausblendung wartet auf die numerische Ruhe der EXPAND-Feder (Nulldurchgang
   bei 1.1 s) statt auf das sichtbare Ankommen. Original: 0.1 bis 0.2 s. Umsetzung: main.js expand() -
   Ausblendung starten, sobald Breite/Hoehe innerhalb 1 px am Ziel sind (Ticker-Check, Fallback 450 ms). Status: erledigt in B
2. [Spec] FINALE_HOLD wirkt ca. 1.2 s statt 0.28 s: Hold startet erst nach Feder-Ruhe der Finale-Karte
   (ca. 0.95 s). Umsetzung: Hold ab Austeil-Takt zaehlen (CARD_LEAD + 6 x CARD_INTERVAL + 330 + 280 ms). Status: erledigt in B
3. [Video] Anzeige steht ca. 2 s auf "100 %", waehrend das Deck noch laeuft. Original: 100 % faellt mit dem
   Start des Wachsens zusammen. Umsetzung: FINISH erst schalten, wenn dealDone; bis dahin HOLD_AT 0.72;
   check()-Schwelle 0.999 -> 0.995. Status: erledigt in B
4. [Entscheid] Original teilt alle fuenf Karten praktisch gleichzeitig aus (innerhalb 0.2 s), Spec sagt
   alle 240 ms. Vorschlag: CARD_INTERVAL 240 -> 70, CARD_LEAD 180 -> 120. Status: offen (Entscheid, A und B teilen alle 240 ms aus)
5. [Bug] Monogramm-Landung springt bei klassischen Scrollbalken (Windows) um ca. 8 px, weil der Scrollbalken
   erst nach der Messung erscheint. Umsetzung: html { scrollbar-gutter: stable } und Monogramm im rAF neu messen. Status: erledigt in B
6. [Bug] Erstes Bild: Monogramm-Basis fehlt (Masken-PNG noch nicht geladen), "LADEN" blitzt vor "LOADING" auf.
   Umsetzung: preload fuer mark-white.png, Readout bis html.js verstecken. Status: erledigt in B
7. [Entscheid] Header-Logo: Original zeigt Monogramm plus Wortmarke, bei uns nur das Monogramm.
   Vorschlag: "SWISS"-Wortmarke neben die Marke (Landung bleibt auf der Marke). Status: offen (Entscheid)

### B. Header
8. [Video] Gestrichelte Unterkante des Headers ueber die ganze Breite bis zum Button (beide Themen) fehlt
   bei uns auf Desktop (Spec nennt sie nur mobil). Umsetzung: .hdr__cell:not(.hdr__action) border-bottom. Status: offen (Entscheid)
9. [Bug] Deutsch bei 768 bis 1023 px: Navigation ueberlappt Logo- und Sprach-Zelle um 23 bis 27 px.
   Umsetzung: in diesem Bereich gap .75rem und 12 px, oder Burger bis 1023 px. Status: erledigt in B
10. [Video] Eckmarker an der linken Fensterkante (Logo-Zelle) gibt es im Original nicht. Umsetzung:
    Logo-Zelle bei Corners() ueberspringen. Status: erledigt in B
11. [Video] Pfeil-Glyphe: Original Hakenpfeil (Linie nach unten, dann nach rechts), bei uns Diagonalpfeil;
    gilt fuer Header-Button, Kontakt-Schiene, Karten, Team-Zeile 4. Umsetzung: ARROW_SVG ersetzen, Drehung entfernen. Status: offen (Entscheid)
12. [Video] Ausblenden des Headers ueber Kontakt reagiert ca. 2 Bilder spaeter. Umsetzung: Abtastung 80 -> 32 ms. Status: erledigt in B

### C. Hero
13. [Spec] Kennzahlen zaehlen unsichtbar hinter dem Ladepanel hoch (Beobachter feuert beim Laden); im Original
    zaehlen sie sichtbar 1.5 s nach der Uebergabe. Umsetzung: Counter manuell am Handoff starten. Status: erledigt in B
14. [Spec] Kennzahlen: Wert und Label auf EINER Zeile ("15 years of building"), drei Zeilen rechtsbuendig,
    bei uns sechs Zeilen gestapelt. Umsetzung: .fig__v/.fig__l inline ab 1024 px, Leerzeichen im Markup. Status: erledigt in B
15. [Entscheid] Das Video laeuft im lg-Layout: Headline 48 px, Schlusszeile 44 px, Mission 18 px - ruhiger als
    unsere xl-Werte (72 / 72 / 24 px). Vorschlag: xl daempfen: h1 4rem, Schlusszeile 3.5rem, Mission 1.25rem. Status: teilweise in B (Schlusszeile 3.5rem; H1 4.5rem und Mission 1.5rem bleiben - Entscheid)
16. [Video] Abstand der CTA-Boxen 1rem statt .75rem; Kontakt-CTAs gleich. Status: erledigt in B
17. [Bug] Drift-Ueberhang: Beim Herausdriften haengen Hero-Foto, Schlusszeile und CTAs 50 px in den
    Unternehmen-Block (Transform auf der Section, kein Clipping). Umsetzung: Flow auf inneren Wrapper,
    section { overflow: clip }. Status: erledigt in B

### D. Unternehmen
18. [Spec] Titel kleiner als Spec (lg 2.5 statt 2.75rem, xl 2.875 statt 3.4375rem). Umsetzung: anheben,
    .about__head 40rem, Kollision mit Foto-Rahmen in DE und EN pruefen. Status: erledigt in B
19. [Bug] Mission-Text laeuft bei 1440 ueber das Foto (6 Zeilen DE, 5 EN; der Einzug deckt nur Zeile 1).
    Umsetzung: Text auf 3 Zeilen kuerzen oder 1.25rem / 26rem. Status: erledigt in B
20. [Video] "Ueber uns"-Button ist im Video immer sichtbar, bei uns ab 1440 nur bei Hover. Umsetzung: immer sichtbar. Status: erledigt in B

### E. Kompetenzen (Karten)
21. [Entscheid] 4 statt 3 Karten (Kundenentscheid). Bei 4 Karten Proportionen des Originals nachbilden:
    .card 21rem / .card--tall 27rem (xl 22 / 29rem), MASK_STAGGER 180 -> 120. Status: erledigt in B
22. [Bug] Schmale Karten schneiden Gesichter an (09, 11, 14). Umsetzung: object-position je Karte. Status: erledigt in B
23. [Bug] Explore-Button zwischen 769 und 1439 px nie sichtbar (weder Hover noch fest). Umsetzung: unter 1440
    fest sichtbar wie beim About-Rahmen. Status: erledigt in B

### F. Leistungen / Prozess
24. [Spec] Schrittzeile "01 / Idee" im Original in EINER Groesse, regular, weiss; bei uns kleine graue Nummer
    plus fetter Name. Umsetzung: .pstep__n erbt Groesse/Farbe, .pstep font-weight 400, Leerzeichen im Markup. Status: erledigt in B
25. [Spec] Caption klebt an der gedrehten Buehne (top 50 % + 15.5rem statt 18.875rem). Umsetzung: Spec-Wert,
    .process min-height 50rem. Status: erledigt in B

### G. Team
26. [Video] Titel und Intro steigen ein, waehrend der Boden noch Carbon Black ist (schwarz auf schwarz).
    Umsetzung: Woerter erst starten, wenn der Titel die Viewport-Mitte erreicht (rootMargin -45 %). Status: erledigt in B
27. [Bug] Zeilen-Stagger (index x 220 ms) laesst spaete Zeilen zu lange unsichtbar: Zeile 4 in der Aufnahme
    nie zu sehen. Umsetzung: Stagger nur fuer gleichzeitig sichtbare Zeilen. Status: erledigt in B
28. [Video] Bio, Zitat und Aufzaehlungen sind von der Zeilen-Einblendung entkoppelt (Zeile scharf, Text tippt
    spaeter; Zitat sofort). Umsetzung: Words/Inview mit watch: row und gestaffelten Delays. Status: erledigt in B
29. [Video] Eckmarker an den Team-Zeilen gibt es im Original nicht. Vorschlag: nur an Zeile 4 (Link). Status: erledigt in B
30. [Bug] tabindex="0" auf drei nicht-interaktiven Zeilen (tote Tabstopps). Status: erledigt in B
31. [Bug] "Better products for life." ohne data-en (Claim? dann bestaetigen). Status: erledigt in B
32. [Spec] Team-Intro oben statt unten buendig mit dem Titel (lg: bottom 0). Status: erledigt in B

### H. Kontakt
33. [Bug] Legal-Zeile und CTAs auf hellem Pflaster kaum lesbar (unter 3:1). Umsetzung: Scrim unten auf der
    Sektion, Legal/Copyright auf 80 % Weiss. Status: erledigt in B
34. [Video] Badges erscheinen ohne Einblendung, waehrend die Links staffeln. Umsetzung: Inview + 260 ms. Status: erledigt in B
35. [Bug] Kontakt-Titel bricht mit Witwe ("... your / project."). Umsetzung: max-width 27rem. Status: erledigt in B
36. [Video] CTAs erscheinen 730 ms nach Vollbild. Umsetzung: Titel + 100, CTAs + 260 ms. Status: erledigt in B

### Bewusst anders (kein Handlungsbedarf, nur bestaetigen)
- Prozentzahl in Signal Green statt gedaempftem Weiss. Fuellfarbe der Buttons Signal Green statt Weiss.
- Teamfoto plus Werte-Zeilen statt Portraits; keine Kontakt-Formularkarte; Badges in der Schiene.
- Fresh-Mint-Zeilen statt #ebebeb (Kundenfarben), Carbon Black / Ice Mint statt Schwarz / #f5f5f5.

## Teil 2 - Fuer den menschlichen Betrachter (Vorschau, Details beim Durchgehen)
1. Ladephase insgesamt kuerzen (Punkte 1 bis 4) und fuer Wiederbesucher im selben Besuch ueberspringen (sessionStorage).
2. Hero: Schleier fuer das helle Gegenlicht-Foto verstaerken (identisch auf Finale-Karte), Labels und CTA-Rahmen heller,
   oder Foto-Ausschnitt verschieben, damit der Sonnenstern nicht unter der Headline liegt.
3. Hero: Eyebrow "IdeeRoth AG · Produktentwicklung aus der Schweiz" ueber der Headline, damit in 10 s klar ist, was wir tun;
   Intro kuerzen (sagt heute dreimal dasselbe).
4. Kennzahlen: echte Werte oder Zeile streichen; "5 Leistungen" nie hochzaehlen.
5. Unternehmen: Fotowechsel 520 ms -> 1000 ms, weichere Ueberblendung; Reihenfolge nach Themen (zwei Fotos je Thema);
   Doppelungen 10 und 15 aufloesen, Foto 08 nutzen, Simulations-Foto beim Kunden anfordern.
6. Prozess: inaktive Schritte lesbar (Opazitaet 0.3 -> 0.5, Blur 5 -> 1.5 px), Auto-Weiterschalten auch auf Desktop,
   erst bei echtem Anfahren eines Schritts stoppen; breitere Schrittnamen; mobil tappbare 01-05-Leiste.
7. Kompetenzen -> Leistungen verbinden: Karten nach den Prozessschritten benennen und auf den passenden Schritt springen.
8. Team: Blur 14 -> 6 px, schnellere Feder, Fliesstext nur einmal animieren (mode once); Slogan nicht sechsmal.
9. Kontakt: eine solide Primaeraktion (E-Mail gruen), Scrim, lesbare Rechtszeile.
10. Mobil und Barrierefreiheit: <picture> mit -m-Fotos (1.5 MB weniger), Fokusring auf hellem Boden dunkel,
    aria-live nur bei Nutzeraktion, Navigation in Seitenreihenfolge, Versal-Labels bei 12 px mit positiver Laufweite.

## Teil 2 - umgesetzt in Variante B (`b/`, Stand 08.10.2026)
Alle zehn Punkte der Vorschau sind in B drin. Zusaetzlich beim Browsertest von B gefunden und behoben:
- Unternehmen: Titel, Foto, Themenliste und Mission klebten mobil aneinander (Band ohne Abstaende); jetzt
  1.5rem Luft, Block vertikal zentriert. Themenliste mobil unter dem Foto statt weiss im Bild.
- "Ueber uns"-Button sitzt unten im Foto statt mittig (verdeckte Gesichter, z. B. Foto 04).
- Prozess mobil (unter 768 px): Schrittliste lag hinter dem Foto und war unlesbar. Jetzt Foto oben,
  Liste darunter, Caption, 01-05-Leiste; Parallaxe des Fotos mobil nur 20 px.
- Karten ohne Hover (unter 1440 px): nur ein Pfeilfeld unten rechts statt des grossen Buttons mitten im Motiv.
- Kartenklick -> Prozessschritt: Beim Scrollen lief die Schrittliste unter dem ruhenden Mauszeiger durch und
  der Hover waehlte einen anderen Schritt. Hover ist nach dem Klick gesperrt, bis sich der Zeiger bewegt (max. 2 s).
- Hero mobil: Schlusszeile 1.25rem statt 1.5rem (war fast so gross wie die H1).
- Karten-Takt MASK_STAGGER 180 -> 120 ms (Punkt 21).

Weiterhin offen fuer den gemeinsamen Durchgang (Entscheide): Punkte 4, 7, 8, 11, 15 sowie die Kennzahlen
(echte Werte vom Kunden) und das Simulations-Foto.
Testlauf B: 48 von 48 Kombinationen (4 Seiten x 6 Viewports x DE/EN) ohne Overflow, Konsolenfehler oder
haengendes Ladepanel; Wiederbesuch im selben Tab ueberspringt das Ladepanel (sessionStorage).
