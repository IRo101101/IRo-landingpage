# v2 - Vergleich mit dem Video der Musterseite (Stand 08.10.2026)

Grundlage: Video der Northwall-Musterseite (11.3 s, 15 Bilder/s, Browserfenster ca. 1420 px breit,
zweimal geladen), eigene Aufnahme der IRo-Seite (1460 x 980, EN, Mausrad-Scroll), Original-Prompt (Spec),
Code auf Branch `v2-redesign`. Hover-Zustaende zeigt das Video nicht (Mauszeiger ruht).
Wichtig: Das Video laeuft im lg-Layout (unter 1440 px), unsere Aufnahme im xl-Layout - Groessen sind
deshalb nicht 1:1 vergleichbar, Aufbau, Reihenfolge und Zeiten schon.

Legende: [Spec] = Spec nicht eingehalten, [Video] = Video zeigt es, Spec regelt es nicht,
[Bug] = Fehler unabhaengig vom Video, [Entscheid] = Abweichung ist bewusst oder braucht einen Entscheid.
Status: offen / erledigt / verworfen.

Hinweis 08.10.2026: Eine Variante B mit allen Teil-2-Punkten wurde gebaut, gezeigt und verworfen. Der Stand
vom 30.09. bleibt die Basis; die Punkte werden einzeln mit dem Kunden entschieden. Zeiten gelten nach Prompt
(Spec), nicht nach dem Video (Screenshot-Tool, nicht bildgenau).

## Teil 1 - Abweichungen zum Ablauf der Musterseite

### A. Ladepanel und Uebergabe (groesste Wirkung)
1. [Spec] Totzeit nach dem Vollbild: Karte ist nach ca. 0.4 s bildfuellend, Header und Text kommen erst
   0.7 bis 1.0 s spaeter. Ursache: Ausblendung wartet auf die numerische Ruhe der EXPAND-Feder (Nulldurchgang
   bei 1.1 s) statt auf das sichtbare Ankommen. Original: 0.1 bis 0.2 s. Umsetzung: main.js expand() -
   Ausblendung starten, sobald Breite/Hoehe innerhalb 1 px am Ziel sind (Ticker-Check, Fallback 450 ms). Status: offen
2. [Spec] FINALE_HOLD wirkt ca. 1.2 s statt 0.28 s: Hold startet erst nach Feder-Ruhe der Finale-Karte
   (ca. 0.95 s). Umsetzung: Hold ab Austeil-Takt zaehlen (CARD_LEAD + 6 x CARD_INTERVAL + 330 + 280 ms). Status: offen
3. [Video] Anzeige steht ca. 2 s auf "100 %", waehrend das Deck noch laeuft. Original: 100 % faellt mit dem
   Start des Wachsens zusammen. Umsetzung: FINISH erst schalten, wenn dealDone; bis dahin HOLD_AT 0.72;
   check()-Schwelle 0.999 -> 0.995. Status: offen
4. [Entscheid] Original teilt alle fuenf Karten praktisch gleichzeitig aus (innerhalb 0.2 s), Spec sagt
   alle 240 ms. Vorschlag: CARD_INTERVAL 240 -> 70, CARD_LEAD 180 -> 120. Status: offen
5. [Bug] Monogramm-Landung springt bei klassischen Scrollbalken (Windows) um ca. 8 px, weil der Scrollbalken
   erst nach der Messung erscheint. Umsetzung: html { scrollbar-gutter: stable } und Monogramm im rAF neu messen. Status: erledigt in r1 (Gutter)
6. [Bug] Erstes Bild: Monogramm-Basis fehlt (Masken-PNG noch nicht geladen), "LADEN" blitzt vor "LOADING" auf.
   Umsetzung: preload fuer mark-white.png, Readout bis html.js verstecken. Status: offen
7. [Entscheid] Header-Logo: Original zeigt Monogramm plus Wortmarke, bei uns nur das Monogramm.
   Vorschlag: "SWISS"-Wortmarke neben die Marke (Landung bleibt auf der Marke). Status: offen

### B. Header
8. [Video] Gestrichelte Unterkante des Headers ueber die ganze Breite bis zum Button (beide Themen) fehlt
   bei uns auf Desktop (Spec nennt sie nur mobil). Umsetzung: .hdr::after als durchgehende Linie hinter den Zellen, der
   Button deckt sie ab. Status: erledigt in r1 (Kundenentscheid 09.10.2026)
9. [Bug] Deutsch bei 768 bis 1023 px: Navigation ueberlappt Logo- und Sprach-Zelle um 23 bis 27 px.
   Umsetzung: in diesem Bereich gap .75rem und 12 px, oder Burger bis 1023 px. Status: offen
10. [Video] Eckmarker an der linken Fensterkante (Logo-Zelle) gibt es im Original nicht. Umsetzung:
    Logo-Zelle bei Corners() ueberspringen. Status: offen
11. [Video] Pfeil-Glyphe: Original Hakenpfeil (Linie nach unten, dann nach rechts), bei uns Diagonalpfeil;
    gilt fuer Header-Button, Kontakt-Schiene, Karten, Team-Zeile 4. Umsetzung: ARROW_SVG ersetzen, Drehung entfernen. Status: offen
12. [Video] Ausblenden des Headers ueber Kontakt reagiert ca. 2 Bilder spaeter. Umsetzung: Abtastung 80 -> 32 ms. Status: offen

### C. Hero
13. [Spec] Kennzahlen zaehlen unsichtbar hinter dem Ladepanel hoch (Beobachter feuert beim Laden); im Original
    zaehlen sie sichtbar 1.5 s nach der Uebergabe. Umsetzung: Counter manuell am Handoff starten. Status: offen
14. [Spec] Kennzahlen: Wert und Label auf EINER Zeile ("15 years of building"), drei Zeilen rechtsbuendig,
    bei uns sechs Zeilen gestapelt. Umsetzung: .fig__v/.fig__l inline ab 1024 px, Leerzeichen im Markup. Status: offen
15. [Entscheid] Das Video laeuft im lg-Layout: Headline 48 px, Schlusszeile 44 px, Mission 18 px - ruhiger als
    unsere xl-Werte (72 / 72 / 24 px). Vorschlag: xl daempfen: h1 4rem, Schlusszeile 3.5rem, Mission 1.25rem. Status: offen
16. [Video] Abstand der CTA-Boxen 1rem statt .75rem; Kontakt-CTAs gleich. Status: offen
17. [Bug] Drift-Ueberhang: Beim Herausdriften haengen Hero-Foto, Schlusszeile und CTAs 50 px in den
    Unternehmen-Block (Transform auf der Section, kein Clipping). Umsetzung: Flow auf inneren Wrapper,
    section { overflow: clip }. Status: offen

### D. Unternehmen
18. [Spec] Titel kleiner als Spec (lg 2.5 statt 2.75rem, xl 2.875 statt 3.4375rem). Umsetzung: anheben,
    .about__head 40rem, Kollision mit Foto-Rahmen in DE und EN pruefen. Status: offen
19. [Bug] Mission-Text laeuft bei 1440 ueber das Foto (6 Zeilen DE, 5 EN; der Einzug deckt nur Zeile 1).
    Umsetzung: Text auf 3 Zeilen kuerzen oder 1.25rem / 26rem. Status: offen
20. [Video] "Ueber uns"-Button ist im Video immer sichtbar, bei uns ab 1440 nur bei Hover. Umsetzung: immer sichtbar. Status: offen

### E. Kompetenzen (Karten)
21. [Entscheid] 4 statt 3 Karten (Kundenentscheid). Bei 4 Karten Proportionen des Originals nachbilden:
    .card 21rem / .card--tall 27rem (xl 22 / 29rem), MASK_STAGGER 180 -> 120. Status: offen
22. [Bug] Schmale Karten schneiden Gesichter an (09, 11, 14). Umsetzung: object-position je Karte. Status: offen
23. [Bug] Explore-Button zwischen 769 und 1439 px nie sichtbar (weder Hover noch fest). Umsetzung: unter 1440
    fest sichtbar wie beim About-Rahmen. Status: offen

### F. Leistungen / Prozess
24. [Spec] Schrittzeile "01 / Idee" im Original in EINER Groesse, regular, weiss; bei uns kleine graue Nummer
    plus fetter Name. Umsetzung: .pstep__n erbt Groesse/Farbe, .pstep font-weight 400, Leerzeichen im Markup. Status: offen
25. [Spec] Caption klebt an der gedrehten Buehne (top 50 % + 15.5rem statt 18.875rem). Umsetzung: Spec-Wert,
    .process min-height 50rem. Status: offen

### G. Team
26. [Video] Titel und Intro steigen ein, waehrend der Boden noch Carbon Black ist (schwarz auf schwarz).
    Umsetzung: Woerter erst starten, wenn der Titel die Viewport-Mitte erreicht (rootMargin -45 %). Status: offen
27. [Bug] Zeilen-Stagger (index x 220 ms) laesst spaete Zeilen zu lange unsichtbar: Zeile 4 in der Aufnahme
    nie zu sehen. Umsetzung: Stagger nur fuer gleichzeitig sichtbare Zeilen. Status: offen
28. [Video] Bio, Zitat und Aufzaehlungen sind von der Zeilen-Einblendung entkoppelt (Zeile scharf, Text tippt
    spaeter; Zitat sofort). Umsetzung: Words/Inview mit watch: row und gestaffelten Delays. Status: offen
29. [Video] Eckmarker an den Team-Zeilen gibt es im Original nicht. Vorschlag: nur an Zeile 4 (Link). Status: offen
30. [Bug] tabindex="0" auf drei nicht-interaktiven Zeilen (tote Tabstopps). Status: offen
31. [Bug] "Better products for life." ohne data-en (Claim? dann bestaetigen). Status: offen
32. [Spec] Team-Intro oben statt unten buendig mit dem Titel (lg: bottom 0). Status: offen

### H. Kontakt
33. [Bug] Legal-Zeile und CTAs auf hellem Pflaster kaum lesbar (unter 3:1). Umsetzung: Scrim unten auf der
    Sektion, Legal/Copyright auf 80 % Weiss. Status: offen
34. [Video] Badges erscheinen ohne Einblendung, waehrend die Links staffeln. Umsetzung: Inview + 260 ms. Status: offen
35. [Bug] Kontakt-Titel bricht mit Witwe ("... your / project."). Umsetzung: max-width 27rem. Status: offen
36. [Video] CTAs erscheinen 730 ms nach Vollbild. Umsetzung: Titel + 100, CTAs + 260 ms. Status: offen

### Beim Browsertest (08.10.2026) zusaetzlich gefunden, gilt fuer den aktuellen Stand
37. [Bug] Unternehmen mobil/tablet: Titel, Foto und Mission kleben ohne Abstand aneinander (das `gap` auf
    `.about` greift nicht, weil `.about__band` das einzige Kind ist). Status: offen
38. [Bug] Prozess unter 768 px: Die Schrittliste liegt hinter dem Foto und ist praktisch unlesbar. Status: offen
39. [Bug] Kartenklick auf Desktop: Beim Scrollen zum Ziel laeuft die Schrittliste unter dem ruhenden Mauszeiger
    durch, ein Hover waehlt dann einen anderen Schritt (nur relevant, falls Karten auf Schritte springen). Status: offen
40. [Bug] Header 768 bis 1023 px (DE): Navigation ueberlappt die Sprach-Zelle, sobald ein Label laenger wird. Status: erledigt in r1
41. [Bug] Sprung am Ende des Ladens (Kunde 09.10.): Das Hero-Foto stand 5 % tiefer als die Finale-Karte, weil die
    Hero-Parallaxe ihren Scrollweg am 130 % hohen Fotolayer mass (Anfang schon ueber dem Viewport, Fortschritt 0.23
    bei Scrollposition 0 statt 0). Beim Ausblenden des Panels rutschte das Bild um ca. 49 px (1440) bzw. 58 px (1920).
    Dazu auf Windows: klassischer Scrollbalken erscheint erst bei der Freigabe, Seite wird 17 px schmaler, Foto wird neu
    eingepasst. Umsetzung: Scrub mit Referenzelement (Buehne) statt Layer, html { scrollbar-gutter: stable }. Status: erledigt in r1
42. [Bug] Unternehmen ab 1024 px (Kunde 09.10., Screenshot): Titel laeuft bei kurzen Fenstern ins Foto, weil das Band
    auf 100 % Hoehe zentriert war und der Rahmen von der Mitte aus positioniert wurde, der Titel aber von oben; bei
    1366 x 768 mit 125 % Windows-Skalierung (1093 x 614 CSS-px) oder 150 % lagen Titelzeile 2 und Foto uebereinander.
    Umsetzung: Band im Fluss (Titel oben, Rahmen mit Liste und Mission zentriert im Rest, min 1.5rem Luft), Sektion
    waechst bei Bedarf ueber 100vh. Abstand Titel zu Foto fest 2rem (wie seitlich zum Foto), Ueberschuss ueber dem
    Titel und unter der Fotogruppe (Kundenwunsch 09.10.: Titel und Foto bleiben zusammen). Status: erledigt in r1
43. [Bug] Kompetenzen ab 1024 px bei breiten, kurzen Fenstern (1920 x 700, 2200 x 800, 2560 x 800): Die Kartenreihe
    (absolut, Hoehe in rem, Root-Schrift waechst ueber 1440 px mit) ragte unter der 100vh-Sektion in den Prozessblock.
    Gefunden mit dem Raster 10 Breiten x 4 Hoehen x DE/EN. Umsetzung: Reihe im Fluss, Sektion min-height 100vh und
    waechst. Status: erledigt in r1
    Raster-Ergebnis sonst: keine ungewollte Ueberlappung von Text und Foto (Unternehmen, Team, Prozess) in DE und EN.
44. [Bug] Anker nach oben landen zu tief (Kunde 09.10.: Logo in der Kontakt-Schiene fuehrt nicht ganz nach oben): Der
    Flow-Scrub verschiebt verlassene Bloecke um bis zu 50 px nach unten, Lenis mass das Ziel am verschobenen Block.
    Umsetzung: scrollToHash nimmt die Layout-Position (offsetTop-Kette). Gilt fuer alle Anker (Header-Logo, Navigation,
    Burger-Menue, Kontakt-Schiene, Hero-CTAs, Karten). Status: erledigt in r1
45. [Kunde 09.10.] Header unter 1024 px als Milchglas statt deckend (Bodenfarbe 72 % plus Unschaerfe 14 px); am
    Desktop bleibt er wie im Prompt ohne Hintergrund. Status: erledigt in r1
46. [Kunde 09.10.] Unterseiten (Karriere, Impressum, Datenschutz) im Stil der Team-Zeilen: nummerierte Zeilen
    "0N //  Seitenname", Abschnittstitel links, Text rechts, mobil gestapelt, Breite 64rem, Einblenden wie die
    Team-Zeilen. Inserat unveraendert. Status: erledigt in r1
47. [Bug] "Ueber uns"-Button im Unternehmen-Foto erschien ab 1440 px nur beim ersten Hineinfahren (Kunde 09.10.): Der
    neue Fotowechsel (PhotoSwap) hob jedes eintretende Foto eine Ebene hoeher (z-index 2, 3, 4 ...), nach zwei bis drei
    Wechseln lagen die Fotos ueber dem Button (Ebene 3); der Button wurde zwar eingeblendet, war aber verdeckt und die
    Maus traf das Foto. Umsetzung: Fotos belegen fest nur Ebene 0 bis 2 (eintretend 2, aktuell 1, uebrige 0), Schleier 3,
    Button und Themenliste 4. Gedacht ist: ab 1440 px mit Maus erscheint der Button bei jedem Hineinfahren und
    verschwindet beim Verlassen; unter 1440 px und auf Touch-Geraeten ist er immer sichtbar (vgl. Punkt 20). Status:
    erledigt in r1

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

## Runde 1 (Ordner `r1/`, Stand 08.10.2026) - Kundenwuensche vom 08.10.
Vorschau: https://iro101101.github.io/IRo-landingpage/r1/ (Root bleibt der Stand vom 30.09. zum Vergleich).
Umgesetzt in r1:
- Ladepanel: Hochzaehlen bis 100 % doppelt so lang (1.9 s statt 1.0 s), Panel insgesamt ca. 4.3 s.
- Bodenwechsel ab 768 px doppelt so lang (90 % in 1.2 s statt 0.55 s), beide Richtungen gleich. Unter 768 px folgt
  der Boden dem Scrollweg (kein Text mehr in der eigenen Bodenfarbe, Befund 2 des Handy-Audits).
- Prozess: Hintergrundzeilen 30 % groesser, Foto 15 % kleiner, Unschaerfe 2.5 statt 5 px, Deckkraft .45 statt .3.
- Mobil (unter 768 px, Audit mit 142 Rohbefunden): Prozess gestapelt mit Leiste 01-05 (Punkt 38), Abstaende im
  Unternehmen-Block (Punkt 37), Header deckend in Bodenfarbe (auch Tablet), Root-Schrift mit Untergrenze 14 px,
  keine Schrift unter 12 px, Tap-Ziele 40 px, Kontakt-Parallaxe ohne Ueberdeckung der Adresse, Hero-CTAs ueber der
  Falz (390 px), Datenschutz-Titel nicht mehr abgeschnitten, Rechtszeile ohne haengenden Trennstrich, Navigation
  768 bis 1023 px ohne Ueberlappung (Punkte 9 und 40), Sprachpanel-Klick, Unterseiten-Links ohne Unterstreichung.
- Pruefung r1: Sweep 48/48 (4 Seiten x 6 Viewports x DE/EN) ohne Overflow, Konsolenfehler, Ladepanel-Haenger;
  zwei unabhaengige Audit-Runden auf 390/360/320/768/1024 plus Unterseiten.
Entschieden am 09.10.2026 (Vorschauseiten bleiben in r1 als Nachschlagewerk):
- Fotowechsel Unternehmen (zweiter Entscheid am selben Tag): 04 Clear im Takt 2 s mit 40 % schnellerer Feder
  (`data-transition="clear" data-interval="2000" data-speed="1.4"` am Rahmen; Feder 55/22 wird zu 107.8/30.8, unscharf
  zu scharf: 90 % nach 0.62 s statt 0.87 s). Alle sieben Uebergaenge aus `vorschau-uebergaenge.html` liegen als
  Bibliothek TRANSITIONS in main.js (dissolve, dissolve-settle, wipe, clear, deal, turn, push), waehlbar per
  data-transition, Takt per data-interval, Tempo per data-speed an jedem Fotostapel; die anderen Bloecke bleiben wie bisher.
- Unternehmen U-A: Themenliste links und Mission rechts neben dem Foto, beide an der Rahmenunterkante, Mission ohne
  Einzug (Punkt 19 erledigt). Karten K-A: alle vier gleich hoch (30rem, xl 34rem; Punkt 21 erledigt). Team T-A
  (zweiter Entscheid): Zeilen auf 64rem begrenzt und zentriert, Spaltenbreiten wie in der Vorlage.
Nicht in r1 (bewusst, Kunde): Hero-Text (spaeter), Karten bleiben vier, Teil-1-Punkte 4, 7, 8, 11, 15.
