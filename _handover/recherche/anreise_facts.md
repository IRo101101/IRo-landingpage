# Faktenbasis Anreise kontakt.html (Stand 10.10.2026)

Ziel: IdeeRoth AG, Hafenstrasse 62, 8590 Romanshorn. WGS84 ca. 47.56819 N, 9.382508 E (LV95 2746262/1270375).
Gebaeude: Restaurant Panem (am See), Hafenstrasse 62 (panem.ch, local.ch, tripadvisor, thurgau-bodensee.ch); Kunde nennt es "Panem-Gebaeude".

## Quellen
- OSRM Demo-Router (router.project-osrm.org, OSM-Daten), per Firecrawl abgerufen, Routen mit steps=true:
  - Amriswil (9.2990,47.5466) -> Ziel: Romanshornerstrasse (ref 14) > Amriswilerstrasse (ref 14) > Rotary "Hub-Kreisel" (9.365584,47.565214) > Bahnhofstrasse 713 m > links Hafenstrasse (9.37536,47.565716) 620 m > links Zufahrt > Ziel.
  - Kreuzlingen Sued (Ausfahrtsknoten 9.1442,47.6343) -> Ziel: Schwaderlohstrasse (ref 1) > Brunnenstrasse > Bergstrasse > Baerenstrasse > Egelseestrasse > Romanshornerstrasse (ref 13) > Hauptstrasse (13) > Seestrasse (13, Bottighofen) > Landstrasse (13) > Hauptstrasse (13) > Guettingerstrasse (13) > Uttwilerstrasse (13, destinations "Romanshorn, Uttwil") > Kesswilerstrasse (13) > Romanshornerstrasse (13, destinations "Romanshorn") > Kreuzlingerstrasse (13, Romanshorn) > (OSRM-Abkuerzung Reckholdernstrasse/Alleestrasse/Zelgstrasse) > Hafenstrasse.
  - Kreuzlingerstrasse (9.3600,47.5750) -> Hub-Kreisel -> Arbonerstrasse (9.3690,47.5590): Kreuzlingerstrasse (13) 809 m muendet in Rotary Hub-Kreisel; Ausfahrt 3 = Arbonerstrasse (13, destinations "St. Gallen, Rorschach, Arbon, Egnach").
  - Bregenz (9.7471,47.5031) -> Ziel: L202 > A1 (Hoechst/St. Margrethen) > off ramp "Kreuzlingen, Arbon, Rorschach" (Verzweigung Meggenhus) > A23 8.6 km > "Buch" (ref 13) 1.5 km > Kreisel (destinations "Konstanz, Kreuzlingen, Romanshorn") > Romanshornerstrasse (13) > Arbonerstrasse (13) > (OSRM-Abkuerzung Salmsacherstrasse) > Hafenstrasse 620 m > Ziel.
- Overpass (overpass.osm.ch):
  - motorway_junction "Kreuzlingen Süd" ref 6 (47.6343,9.1442) und "Kreuzlingen Nord" ref 7; "Arbon-West" ref 1 (47.5213,9.3990), "Arbon-Süd" ref 2, "Verzweigung Meggenhus" ref 84 / 4.
  - amenity=ferry_terminal "Romanshorn Autoquai" (47.5646968,9.3810776, cargo passengers;vehicle, operator SBS, uic 8506346) und "Romanshorn (See)" (47.5652538,9.3802648, operator SBS, uic 8506112, Kursschiffe).
  - highway=bus_stop "Romanshorn Bahnhof" Kanten A/B/C (47.5652,9.3790 etc., uic 8587195, Ostwind/BOTG).
  - amenity=parking oeffentlich (access=yes, fee=yes) direkt am Hafen neben dem Gebaeude: ways 195821120 (47.5678334,9.3835204) und 195821122 (47.5677311,9.3835764); weitere fee-Parkplaetze 207942784 (47.5672453,9.3799260, 7 CHF/4h, 12 CHF/Tag, frei 18-07) und 306495552 (47.5691904,9.3811864). Private Parkplaetze 207942791 (47.5673816,9.3825621) u. a.
- Wikipedia de "Autobahn A7 (Schweiz)": Anschluss (6) Kreuzlingen Sued (H1), Girsbergtunnel, (7) Kreuzlingen Nord, Grenze Konstanz. "Autostrasse A23 (Schweiz)": frueher A1.1 (Zubringer Arbon), Verzweigung Meggenhus (A1) - (12) Rorschach - (11) Arbon-Sued - Rinderweidtunnel - (10) Arbon-West (H13); Rest in Planung (BTS).
- faehre-bodensee.de/romanshorn: Faehranleger Friedrichshafnerstrasse 55, unmittelbar neben dem Bahnhof; Autofaehre Friedrichshafen stuendlich; Kursschiffe SBS nach Arbon, Rorschach, Altnau, Bottighofen.
- OSM-Extrakt scratchpad/osm/romanshorn.json (overpass.osm.ch, ODbL), Fusswegnetz: Bahnhof -> Treppen -> pedestrian way 1071205184 (Westquai, 200 m, < 5 m vom Wasser) -> 428231136 -> footway 35861099 (Nordquai, 176 m, < 5 m vom Wasser) -> Hafenstrasse bei (dx -33, dy -62 m zum Pin) -> Gebaeude. Laengen: Bahnhof 604 m (8 min), Bushaltestelle 564 m, Kursschiff-Anleger 653 m (9 min), Autoquai 696 m (9 min) bei 4.5 km/h.
- Gebaeude 62 (OSM way 193796210) liegt noerdlich der Hafenstrasse; Parkplatz-Gassen westlich (dx -59/-30, dy -26/-21) = Westseite.

## Kundenangaben (Alain Roth, 10.10.2026), keine eigene Pruefung moeglich
- Parkplaetze: viele oeffentliche in der Naehe; sonst 5 Minuten vor Ankunft anrufen, Schranke wird geoeffnet.
- Eingang Westseite, Hochparterre, Treppenhaus hinauf, links den Flur entlang; Buero im "Panem-Gebaeude".
- Drei Anfahrtsrichtungen: Amriswil (auch Weinfelden), Zuerich/Winterthur/Frauenfeld via Ausfahrt Kreuzlingen und Seestrasse, Oesterreich via Autobahnzubringer Arbon.
- Fussweg Bahnhof -> Buero unten am Hafenbecken entlang; dasselbe ab Faehre und Kursschiff.
