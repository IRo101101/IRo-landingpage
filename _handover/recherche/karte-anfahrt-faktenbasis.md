# Karte und Anfahrt: Faktenbasis (Recherche 09.10.2026, ergaenzt 18.10.2026)

Herkunft: Nebenprojekt "Karte und Anfahrt fuer iro.swiss" (Claude-Unterhaltung vom 09.10.2026), am 18.10.2026 in
dieses Repository uebernommen. Abschnitt A beschreibt die **Live-Site v1**, nicht r1. Umgesetzt ist die Karte in
`r1/kontakt.html` (Entscheid Punkt 56 in `V2-VIDEOVERGLEICH.md`); wo r1 abweicht, gilt r1 (Apple-Link in der
Legacy-Form `?daddr=`, Ladeverhalten A, eigene Kontaktseite statt Karte auf der Startseite). Anreise-Fakten fuer r1:
`anreise_facts.md`. Die Bezeichnungen O1 bis O13 beziehen sich auf die Liste im Nebenprojekt (Kopie im Projektordner
`karte-anfahrt/01-stand-und-entscheide_2026-10-18.md`).

---


Rechercheergebnisse und technische Angaben aus der Unterhaltung vom 09.10.2026, ergänzt am 18.10.2026. Was sich ändern kann (Nutzungsbedingungen, URL-Parameter, Rechtslage), vor der Verwendung neu prüfen. Nicht geprüfte Angaben sind so markiert.

Inhalt: A Ist-Zustand iro.swiss · B Standortdaten · C Varianten im Vergleich · D swisstopo-Karte · E Routen-Links · F Google Maps, falls doch · G Datenschutz in der Schweiz · H Ladezeit, Platzierung, Stimmen aus Foren und YouTube · I Google-Unternehmensprofil · J Quellen

## A Ist-Zustand iro.swiss

Abgerufen am 09.10.2026. Kontaktbereich und Footer am 18.10.2026 erneut geprüft: unverändert.

### Technik
- Statische Informationsseite, so beschreibt sie datenschutz.html. Seiten: index.html (Startseite mit Ankern), karriere.html, impressum.html, datenschutz.html.
- Bilder unter `/assets/img/`: `logo/logo-color.png`, `logo/logo-light.png`, `services/01-idee.jpg` bis `services/05-prototyp.jpg`, `gallery/bild05.jpg` (Hero), `gallery/bild08.jpg` (Team), `badge-nafems-member.png`, `badge-lehrbetrieb.png`.
- Schriften selbst gehostet, keine externen Schriftdienste.
- Sprachumschalter DE/EN. Wie er umgesetzt ist, ist offen (O8).
- Cookie-Hinweis mit «Akzeptieren» und «Ablehnen». Google Analytics 4 lädt erst nach «Akzeptieren», die Wahl bleibt lokal im Browser gespeichert.
- Hosting bei einem Anbieter in der Schweiz, Name unbekannt (O3).
- Unbekannt: Ablage des Quellcodes, Namen der CSS- und JavaScript-Dateien, Content-Security-Policy (O9). Den Quelltext selbst konnte Claude am 18.10.2026 nicht abrufen, nur den Seitentext.

### Metadaten der Startseite
| Feld | Wert |
|---|---|
| title | IdeeRoth AG - Produktentwicklung von der Idee bis zur Serie |
| description | IdeeRoth AG (iro.swiss): Spezialanbieterin für Produktentwicklung aus Romanshorn - Konstruktion, Simulation (FEM/CFD), Entwicklung und Prototyping im eigenen Haus. Aus weniger mehr entwickeln. |
| canonical | `https://www.iro.swiss/` |
| og:locale | `de_CH`, alternativ `en` |
| og:image | `https://www.iro.swiss/assets/img/services/02-konstruktion.jpg` |
| theme-color | `#243440` |
| twitter:card | `summary_large_image` |

### Aufbau der Startseite
| Anker | Abschnitt | Kicker | Headline |
|---|---|---|---|
| Hero | | Produktentwicklung · Schweiz | Aus weniger mehr entwickeln |
| Teaser | | Nachwuchs · Berufsbildung | Wir bilden aus - werde Teil von uns. |
| `#unternehmen` | 01 · Unternehmen | Spezialanbieterin Produktentwicklung | Von der ersten Idee bis zur fertigen Serienentwicklung. |
| `#leistungen` | 02 · Leistungen | Idee → Serie | Entwickeln unter einem Dach. |
| `#ueber-uns` | 03 · Über uns | Vision · Mission · Leitbild | Better products for life. |
| `#team` | 04 · Team | Von der Idee bis zur Serienreife | Wir geben unser Bestes für Ihre Lösung. |
| `#kontakt` | 05 · Kontakt | Wir sind für Sie da | So erreichen Sie uns. |

Einzelheiten:
- Navigation: Unternehmen, Leistungen, Über uns, Team mit Unterpunkt Karriere (karriere.html), Kontakt. Daneben DE und EN.
- Hero: Unterzeile «Von der ersten Idee bis zur fertigen Serienentwicklung - Konstruktion, Entwicklung und Prototyping unter einem Dach.», Buttons «Projekt starten →» (auf `#kontakt`) und «Leistungen». Faktenleiste: Swiss engineered (Standort Romanshorn), 3D-CAD (Konstruktion), FEM · CFD (Simulation), Prototyping (Eigene Werkstatt).
- Teaser: offene Lehrstelle Konstrukteur/-in EFZ, Start August 2027, Link auf karriere.html.
- Leistungen: fünf Karten mit je drei Schlagworten. 01 Idee: Konzept, Machbarkeit, Kreativtechniken. 02 Konstruktion: 3D-CAD, Detailkonstruktion, Spritzguss. 03 Simulation: FEM, CFD, Nachweis. 04 Entwicklung: FMEA, DFM, Designreview. 05 Prototyp: 3D-Druck · SLS, Fräsen · Drehen, Funktionsmuster. Danach der Aufruf «Ihr Vorhaben» mit «Bereit, wenn Sie es sind.» und «Kontakt aufnehmen →».
- Team: Zitat von Alain Roth, Gründer, auf Deutsch und Englisch.

### Kontaktbereich heute
- Adresse: IdeeRoth AG, Hafenstrasse 62, CH-8590 Romanshorn, ohne Link
- Telefon: +41 71 855 88 55, Link `tel:+41718558855`
- E-Mail: info@iro.swiss
- Ansprechperson: Alain Roth
- Buttons «E-Mail schreiben» (`mailto:info@iro.swiss?subject=Projektanfrage%20IdeeRoth%20AG`) und «Anrufen» (`tel:+41718558855`)
- Link «In Maps öffnen →»: `https://www.google.com/maps/search/?api=1&query=IdeeRoth+AG+Hafenstrasse+62+8590+Romanshorn`
- Keine Karte, keine Routen-Links, kein Anreisetext (geprüft am 18.10.2026)

### Footer
- Helles Logo und der Satz «Spezialanbieterin für Produktentwicklung aus der Schweiz - aus weniger mehr entwickeln.»
- Navigation wie oben
- Kontakt: Adresse «Hafenstrasse 62 · 8590 Romanshorn» mit Link auf dieselbe Google-Suche wie im Kontaktbereich, Telefon, E-Mail
- Badges: NAFEMS Member (Link `https://www.nafems.org`), Lehrbetrieb «Wir machen Profis» (Link `https://www.berufsbildungplus.ch`)
- Fusszeile: © 2026 IdeeRoth AG · Impressum · Datenschutz · Karriere
- Einen Link «Cookie-Einstellungen» zeigte der abgerufene Seitentext am 09.10. und am 18.10.2026 nicht, obwohl datenschutz.html ihn nennt (O10)

### datenschutz.html
Abschnitte: Verantwortliche Stelle, Grundsatz, Server-Logfiles, Hosting, Cookies und Einwilligung, Google Analytics, Kontaktaufnahme per E-Mail oder Telefon, Datensicherheit, Ihre Rechte, Änderungen. Einen Abschnitt zu Karten gibt es noch nicht.

Kernaussagen:
- Verantwortlich ist die IdeeRoth AG, Kontakt datenschutz@iro.swiss.
- Grundsatz: «Ohne Ihre Einwilligung setzen wir keine Analyse-Cookies und kein Tracking ein.» Die Schriften sind selbst gehostet.
- Der Hoster speichert Server-Logfiles: Seite, Datum und Uhrzeit, Datenmenge, Browser, Betriebssystem, Referrer, gekürzte IP-Adresse.
- Google Analytics 4 (Google Ireland Limited) nur mit Einwilligung. Eine Übermittlung in die USA ist möglich, die IP-Anonymisierung ist aktiviert.
- Rechtsgrundlage ist die Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO bzw. nach dem Schweizer Datenschutzgesetz. Die Erklärung beruft sich also auch auf EU-Recht.
- Widerruf über «Cookie-Einstellungen» im Footer.
- Auslieferung verschlüsselt über SSL/TLS.

## B Standortdaten
| Angabe | Wert |
|---|---|
| Adresse | IdeeRoth AG, Hafenstrasse 62, CH-8590 Romanshorn TG |
| LV95 Ost, Nord | `2746262,1270375`, genau `2746262.25` und `1270375.25` |
| WGS84 Breite, Länge | `47.567779541015625, 9.382466316223145` |
| Quelle | Adresssuche des Geoportals: `https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Hafenstrasse%2062%208590%20Romanshorn&type=locations&sr=2056` |

Lage auf der Landeskarte: an der Hafenstrasse beim Euregiogymnasium, zwischen Schlossberg und Inseli. Bahnhof, Hafen und Zoll liegen südwestlich bis südlich davon und sind auf Zoomstufe 9 im selben Ausschnitt zu sehen.

## C Varianten im Vergleich
| Variante | Aufwand (Schätzung) | Kosten | Datenschutz | Gestaltung |
|---|---|---|---|---|
| swisstopo-Karte (map.geo.admin.ch) als iFrame | ca. 10 Min. | gratis | Anbieter ist der Bund | Marker ja, Aussehen fest |
| Google Maps als iFrame | ca. 5 Min. | gratis | Daten an Google, Einwilligung empfohlen | Standard-Look |
| OpenStreetMap als iFrame | ca. 5 Min. | gratis | weniger heikel als Google | schlicht |
| Kartenbild mit Routen-Links | ca. 30 Min. | gratis | lädt nichts von aussen | volles CI, nicht interaktiv |
| Eigene Karte (Leaflet mit swisstopo-Karten) | einige Stunden | gratis | Kartenbilder vom Bund | ganz im IRo-Look |

Empfohlen am 09.10.2026: swisstopo-Karte, dazu Routen-Links, Anreisetext, Ergänzung von datenschutz.html und Prüfung des Google-Unternehmensprofils. Entschieden ist swisstopo (E1).

## D swisstopo-Karte (map.geo.admin.ch)

### Angebot
- Das Geoportal des Bundes bietet seinen Kartenviewer kostenlos zum Einbetten per iFrame in jede Webseite an.
- Funktionen laut geo.admin.ch: beliebige Karten und Datensätze, vier Hintergrundkarten, Objektinformationen wie ÖV-Haltestellen mit Fahrplan, Import eigener Karten und Dateien, Zoom, 3D-Ansicht, eigene Marker und Beschriftungen (Farbe, Stil, Symbol), direkter Link auf map.geo.admin.ch. Alle Funktionen und Daten sind frei zugänglich.
- Die Geodaten von swisstopo sind seit dem 1. März 2021 kostenlos (Open Government Data), auch für kommerzielle Nutzung. Verlangt wird nur die Quellenangabe.
- CI-Farben lassen sich in der eingebetteten Karte nicht einstellen. Wer den IRo-Look will, braucht die eigene Karte aus C.

### Nutzungsbedingungen
Seite «Web Integration: iFrame» von geo.admin.ch:
- Der Kartenviewer darf als iFrame in jede Webseite eingebunden werden. Layout (CSS) und Funktionen dürfen dabei nicht verändert werden.
- Für eigene Daten oder Daten Dritter über Schnittstellen wie KML oder WMS gelten zusätzlich die Bedingungen der jeweiligen Datenherren.
- Haftungsansprüche gegen die Bundesbehörden sind ausgeschlossen, soweit gesetzlich zulässig (disclaimer.admin.ch).

Weitere Punkte:
- Die Quellenangabe blendet die Karte selbst ein, mit ÖV-Ebene «© Daten: swisstopo, BAV». Sie darf nicht verdeckt werden.
- Allgemeine Nutzungsbedingungen der Bundes Geodaten-Infrastruktur (BGDI): Laut einer Fassung vom 01.03.2021, gefunden als Kopie auf einer Drittseite, gilt eine Einbindung in Webanwendungen mit im Schnitt 10'000 Nutzern pro Tag als Fair Use, Quellenangabe «© swisstopo». Aktuelle Fassung auf geo.admin.ch bei Bedarf prüfen.

### Datenschutz
- Für alle Seiten unter admin.ch gilt die Datenschutzerklärung der Bundesverwaltung. Die Webanalyse läuft dort standardmässig mit Matomo, nur innerhalb von admin.ch, und die Daten bleiben in der Schweiz. Einzelne Ämter setzen andere Werkzeuge ein, etwa Siteimprove.
- Nicht geprüft: welche Webanalyse und welche Cookies der Kartenviewer selbst einsetzt.
- Beim Laden der Karte gehen technisch nötige Daten wie IP-Adresse und Browserangaben an den Bund.

### Einbettungscode im Viewer erzeugen
1. Auf map.geo.admin.ch die Adresse suchen und den Ausschnitt einstellen.
2. Im Menü «Teilen» den Punkt «Einbetten» wählen. Der HTML-Code entsteht automatisch.
3. Unter «Vorschau» die Grösse einstellen und den Code in die Webseite übernehmen.
4. Soll die Standortbestimmung im iFrame funktionieren, `allow="geolocation"` ins iFrame-Tag setzen.

Video für Leute ohne Technikkenntnisse: «Tutorial map.geo.admin.ch. Mapviewer einfach erklärt: Iframe», `https://www.youtube.com/watch?v=EDSoNnFBxYU`. Dazu gibt es einen Flyer (PDF, Deutsch, Stand 15.08.2025) und Beispiele: wildruhezonen.ch/karte, natur-freizeit.ch/karte, trail.ch.

### URL-Format und Parameter
Quelle: docs.geo.admin.ch. Eingebettet: `https://map.geo.admin.ch/#/embed?` mit Parametern, verbunden durch `&`. Mit `#/map?` statt `#/embed?` erscheint der volle Viewer mit Suche und Menüs. Die Parameter haben sich im Juni 2024 geändert, ältere Anleitungen sind teils veraltet.

| Parameter | Werte | Bemerkung |
|---|---|---|
| `lang` | `de`, `fr`, `it`, `rm`, `en` | Sprache der Bedienung |
| `center` | `Ost,Nord` in LV95 | Ost 2'450'000 bis 2'900'000, Nord 1'050'000 bis 1'350'000 |
| `z` | `0` bis `13` | Zoomstufe |
| `bgLayer` | `ch.swisstopo.pixelkarte-farbe`, `ch.swisstopo.pixelkarte-grau`, `voidLayer` | Hintergrundkarte |
| `layers` | `Kennung[@year=JJJJ][,Sichtbarkeit][,Deckkraft]` | mehrere Ebenen mit `;` trennen, Sichtbarkeit `t` oder `f`, Deckkraft 0 bis 1 |
| `crosshair` | `cross`, `circle`, `bowl`, `point`, `marker`, optional mit `,Ost,Nord` | Markierung |
| `swisssearch` | Suchtext oder Koordinaten | mit `swisssearch_autoselect=true` wird der erste Treffer gewählt |
| `topic` | z. B. `ech` | Thema |
| `featureInfo` | `default`, `bottomPanel`, `tooltip`, `none` | Anzeige von Objektinformationen |
| `geolocation` | `true`, `false` | Standort anzeigen |
| `noSimpleZoom` | `true`, `false` | nur im Embed: Mausrad zoomt nur mit Ctrl oder Cmd |
| `timeSlider`, `compareRatio` | | Zeitreihen und Vergleich, hier nicht nötig |

Weitere Hinweise aus der Doku:
- Beispiel-Stil: `border: 0; width: 100%; height: 300px; max-width: 100%; max-height: 100%;` und `allow="geolocation"`.
- Eigene Marker, Linien und Texte: im Viewer zeichnen, als KML exportieren, öffentlich ablegen, dann mit `layers=KML%7Chttps://.../datei.kml` einbinden.
- Klickt jemand auf ein KML- oder GeoJSON-Objekt, meldet die Karte das per postMessage an die umgebende Seite.
- Ein Parameter zum Ausblenden der Bedienelemente (etwa hideEmbedUI) ist nicht dokumentiert.

### Getesteter Link
Getestet am 09.10.2026 in Chrome und im Browser der Claude-App:

```text
https://map.geo.admin.ch/#/embed?lang=de&center=2746262,1270375&z=9&bgLayer=ch.swisstopo.pixelkarte-grau&layers=ch.bav.haltestellen-oev&crosshair=marker,2746262,1270375&noSimpleZoom=true
```

Ergebnis:
- Der rote Marker sitzt auf der Hafenstrasse 62.
- Zoomstufe 9, Massstab 200 m: Bahnhof Romanshorn, Hafen, Zoll, Leuchtturm und ÖV-Haltestellen sind im Bild.
- Zoomstufe 10, Massstab 100 m: näher, mit Strassennamen wie Hafenstrasse und Schlossbergstrasse.
- Bedienelemente: oben links «In map.geo.admin.ch ansehen», oben rechts Plus, Minus und 3D, unten rechts «© Daten: swisstopo, BAV».
- Ladezeit: In Chrome war die Fläche nach 5 Sekunden noch leer (nur Raster und Marker), nach 9 Sekunden vollständig. Darum braucht der Container eine feste Höhe und einen ruhigen Hintergrund.
- Der Viewer schreibt die URL nach dem Laden um und ergänzt `topic=ech`. Im Test mit gleicher Mitte und Markerposition stand danach nur noch `crosshair=marker`. Für den Einbau immer den Link oben verwenden.
- Mit einer anderen `center`-Angabe bleibt der Marker auf der Adresse. So lässt sich der Ausschnitt verschieben, etwa damit Bahnhof und Hafen besser ins Bild passen.

## E Routen-Links
Diese Links übertragen erst beim Klick Daten an den jeweiligen Anbieter. Live getestet ist noch keiner (O11).

### Google Maps
- Link: `https://www.google.com/maps/dir/?api=1&destination=IdeeRoth+AG+Hafenstrasse+62+8590+Romanshorn`
- Kein API-Schlüssel nötig. Auf dem Handy öffnet sich die Google-Maps-App, falls installiert.
- Optional `travelmode=driving`, `walking`, `bicycling` oder `transit`.
- Am genauesten mit `destination_place_id` aus dem Google-Unternehmensprofil. Dieser Parameter braucht zusätzlich `destination`.

### Apple Karten
- Link: `https://maps.apple.com/directions?destination=Hafenstrasse%2062,%208590%20Romanshorn,%20Schweiz`
- Einheitliche Apple-Links gibt es ab iOS 18.4, macOS 15.4 und watchOS 11.4. Weitere Parameter: `mode` (`driving`, `walking`, `transit`, `cycling`), `source`, `waypoint`, `avoid`.
- Die ältere Form `https://maps.apple.com/?daddr=...` steht noch in vielen Anleitungen.
- Auf Geräten ohne Apple-System öffnet sich laut einer Zusammenfassung der WWDC 2025 die Webversion. Nicht geprüft.

### SBB-Fahrplan
- Link: `https://www.sbb.ch/de?nach=8590+Romanshorn,+Hafenstrasse+62`, englisch `https://www.sbb.ch/en?nach=8590+Romanshorn,+Hafenstrasse+62`
- Leerzeichen in der Adresse als `+` schreiben.
- Weitere Parameter laut SBB-Anleitung «Deep Linking»: `von`, `moment` (Abfahrt oder Ankunft), `time`, `hidePrices`, `directConnection`, `showAccessibility`. Am einfachsten: Verbindung auf sbb.ch suchen und die URL aus dem Browser kopieren.
- Vorbild: Der Kanton Schaffhausen verlinkt in seinem Leitfaden so den Fahrplan samt Wegbeschreibung und schlägt QR-Codes für Plakate vor. Idee: QR-Code zur Anfahrt auf Drucksachen.

## F Google Maps, falls doch
Seit E1 nicht mehr vorgesehen, hier nur zur Vollständigkeit.
- Einbetten ohne Schlüssel: In Google Maps den Ort öffnen, Menü «Karte teilen oder einbetten», Reiter «Karte einbetten», Grösse wählen, HTML kopieren.
- Maps Embed API mit Schlüssel: laut Google kostenlos und ohne Mengengrenze, Form `https://www.google.com/maps/embed/v1/place?key=API_KEY&q=...`.
- Datenschutz: Schon beim Laden gehen Daten wie die IP-Adresse an Google, auch in die USA. Nach EU-Recht braucht das vorher eine Einwilligung. Üblich ist die Zwei-Klick-Lösung: zuerst ein Bild mit Button «Karte laden (Google)», die echte Karte erst nach dem Klick.
- e-recht24 (deutsches Recht): Google Maps gehört in die Datenschutzerklärung, die Einwilligung holt man über ein Consent-Tool ein.
- Zur Datenschutzerklärung von iro.swiss (kein Tracking ohne Einwilligung) passt nur die Zwei-Klick-Lösung.
- Ladezeit: siehe H.

## G Datenschutz in der Schweiz
Zusammenfassung der Recherche vom 09.10.2026, keine Rechtsberatung.
- Das revidierte Datenschutzgesetz (DSG) gilt seit September 2023.
- Bisherige Schweizer Praxis: Für viele Cookies reichte ein Hinweis mit Link auf die Datenschutzerklärung, eine ausdrückliche Einwilligung war meist nicht nötig.
- Der EDÖB hat seinen Cookie-Leitfaden aktualisiert. Er präzisiert und verschärft faktisch die Erwartungen bei Tracking, Profiling, personalisierter Werbung, Cookie-Paywalls und der Trennung notwendiger und nicht notwendiger Cookies. Der Leitfaden ist keine verbindliche Rechtsnorm (Handelsverband.swiss).
- Laut einer Agentur (e-dialog) erwartet der EDÖB gleichwertige Knöpfe «Alle akzeptieren» und «Alle ablehnen», eine feinere Auswahl und jederzeitigen Widerruf. Sekundärquelle.
- datenschutz.html von iro.swiss beruft sich auch auf die DSGVO. Danach dürfen Personendaten erst nach Einwilligung an Google gehen.
- OpenStreetMap: In den Kommentaren bei Dr. Datenschutz gilt die Einbindung als eher unproblematisch, weil Grossbritannien als sicheres Drittland anerkannt ist. Wer eine fertige Karte eines Anbieters einbindet, ist an dessen Bedingungen gebunden (OSM-Forum).

## H Ladezeit, Platzierung, Stimmen aus Foren und YouTube
- Praxistest von corewebvitals.io: Eine eingebettete Google-Karte kostete 14 % des PageSpeed-Werts, der erste Bildaufbau kam fast eine Sekunde später, der Hauptthread war 320 ms blockiert. Gegenmittel: zuerst ein statisches Kartenbild, die echte Karte erst bei Bedarf.
- Local Search Forum: Eingebettete Karten nicht in den Footer oder auf die Startseite setzen. Auf einer einzelnen Seite ist die Bremse meist klein.
- Sterling Sky und Seeders: Karte auf die Kontaktseite, dazu ein Link «Route» für Handy-Nutzer.
- WebmasterWorld (2008): statisches Kartenbild mit Link auf eine Kartenseite, wegen der Ladezeit.
- OSM-Forum: Die Daten sind frei. Wer eine fertige Karte einbindet, hält sich an die Regeln des Anbieters.
- YouTube: Die Videos zu Google Maps zeigen kaum mehr als die Grundschritte: Google Maps öffnen, Ort suchen, Code kopieren, einfügen (etwa DCP Web). Nützlich für dieses Projekt ist vor allem das swisstopo-Video aus D.
- Folge für iro.swiss: Der Kontaktbereich liegt auf der Startseite. Darum lädt die Karte verzögert (`loading="lazy"`, Variante A) oder erst nach Klick (Variante B), und der Container hat eine feste Höhe gegen Springen. Für die swisstopo-Karte gibt es keine eigene PageSpeed-Messung.

## I Google-Unternehmensprofil
- Kostenlos. Es bestimmt, wie die Firma in der Google-Suche und auf Google Maps erscheint: Adresse, Öffnungszeiten, Telefon, Webseite, Fotos.
- Es muss verifiziert werden, je nach Fall per Postkarte oder kurzem Video.
- Vorher in Google Maps prüfen, ob es den Eintrag schon gibt. Dann beanspruchen statt doppelt anlegen.
- Mit der Place-ID führt ein Google-Link am sichersten genau zum richtigen Ort.
- Status für die IdeeRoth AG unbekannt (O7).

## J Quellen
Abgerufen am 09.10.2026, iro.swiss zusätzlich am 18.10.2026.

Webseite IdeeRoth AG
- https://www.iro.swiss/
- https://www.iro.swiss/datenschutz.html

Geoportal des Bundes und swisstopo
- Web Integration: iFrame, mit Nutzungsbedingungen: https://www.geo.admin.ch/de/web-integration-iframe
- Kartenviewer-Funktion Teilen: https://www.geo.admin.ch/de/kartenviewer-funktionen-teilen
- Video-Tutorial iFrame: https://www.geo.admin.ch/en/tutorial-video-iframe
- YouTube «Mapviewer einfach erklärt: Iframe»: https://www.youtube.com/watch?v=EDSoNnFBxYU
- URL-Parameter: https://docs.geo.admin.ch/map-viewer/url-parameters.html
- Karte als iFrame einbetten: https://docs.geo.admin.ch/map-viewer/embed-in-an-iframe.html
- Änderungen der URL-Parameter 2024: https://www.geo.admin.ch/en/changes-of-the-url-parameters-2024
- Flyer iFrame (PDF): https://backend.geo.admin.ch/fileservice/sdweb-docs-prod-geoadminch-files/files/2025/08/15/1a0d3dd1-17f4-451d-8a45-01c3d57bdbbd.pdf
- Allgemeine Nutzungsbedingungen BGDI: https://www.geo.admin.ch/de/allgemeine-nutzungsbedingungen-bgdi
- BGDI-Bedingungen, Fassung 01.03.2021, Kopie auf einer Drittseite: https://help.emd.dk/mediawiki/images/b/b1/SwissTopo_AlgemeineNutzbedingungen.pdf
- Integrating the map viewer into a website: https://www.swisstopo.admin.ch/en/integrating-the-map-viewer-into-a-website
- Medienmitteilung, Geodaten kostenlos ab 01.03.2021: https://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen.msg-id-82509.html
- Netzwoche zum gleichen Thema: https://www.netzwoche.ch/news/2021-03-01/geodaten-von-swisstopo-sind-ab-sofort-kostenlos
- Datenschutzerklärung der Bundesverwaltung: https://www.eda.admin.ch/de/rechtliches
- Rechtliches admin.ch: https://www.admin.ch/gov/de/start/rechtliches.html
- Adresssuche: siehe B

Routen-Links
- Google Maps URLs: https://developers.google.com/maps/documentation/urls/guide
- Apple, Adopting unified Maps URLs: https://developer.apple.com/documentation/mapkit/unified-map-urls
- Zusammenfassung WWDC 2025 zu MapKit: https://dev.to/arshtechpro/wwdc-2025-go-further-with-mapkit-mapkit-javascript-a5l
- SBB, Deep Linking Fahrplan (PDF): https://company.sbb.ch/content/dam/internet/corporate/en/sbb-als-geschaeftspartner/dienstleistungen/fahrplanintegration/Deep_Linking_SBB_Fahrplan.pdf.sbbdownload.pdf
- Kanton Schaffhausen, Leitfaden ÖV-Links (PDF): https://sh.ch/CMS/get/file/051231d4-57b3-485e-ab52-2731de9f7363

Google Maps und Unternehmensprofil
- Maps Embed API: https://developers.google.com/maps/documentation/embed/guide?hl=de
- GIGA, Google Maps einbinden: https://www.giga.de/tipp/google-maps-einbinden-karte-route-street-view-so-gehts/
- experte.de, Google-Unternehmensprofil erstellen: https://www.experte.de/seo/google-unternehmensprofil-erstellen
- IHK Schwaben, Google Unternehmensprofil: https://www.ihk.de/schwaben/produktmarken/digitalisierung/online-marketing/google-my-business-5495422

Datenschutz
- Handelsverband.swiss, Cookie-Banner in der Schweiz: https://handelsverband.swiss/cookie-banner-in-der-schweiz-reicht-ein-einfacher-cookie-banner-ohne-auswahloption-noch-aus/
- e-dialog, EDÖB-Leitlinien zu Cookie-Bannern: https://e-dialog.group/?p=66204
- Dr. Datenschutz, Google Maps DSGVO-konform einbinden: https://www.dr-datenschutz.de/wie-kann-google-maps-dsgvo-konform-eingebunden-werden/
- e-recht24, Datenschutzerklärung für Google Maps: https://www.e-recht24.de/dsg/12664-google-maps.html

Ladezeit und Foren
- CoreWebVitals.io, Google Maps PageSpeed Guide: https://www.corewebvitals.io/pagespeed/google-maps-100-percent-pagespeed
- Local Search Forum: https://localsearchforum.com/threads/gbm-embedded-map-on-website-branch-pages-does-this-still-help-with-rankings.53938/
- Sterling Sky: https://www.sterlingsky.ca/embed-google-maps/
- Seeders: https://seeders.com/blog/local-seo-best-practices-for-embedding-google-maps-and-directions-on-your-website/
- WebmasterWorld: https://www.webmasterworld.com/google/3653721.htm
- OpenStreetMap-Forum: https://community.openstreetmap.org/t/kann-ich-openstreetmap-kostenlos-uber-das-share-feature-auf-meiner-webseite-einbinden/137293
- DCP Web, Video-Tutorial Google Map: https://www.slideshare.net/slideshow/how-to-embed-google-map-into-a-website-page-tutorial/245623510
