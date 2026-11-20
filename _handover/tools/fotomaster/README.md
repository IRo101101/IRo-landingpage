# Fotos mit erfundenen Personen: Master in Originalgroesse (Stand 20.11.2026)

Auf mehreren Fotos der Website sind die Koepfe echter Mitarbeitender durch erfundene Personen ersetzt. Dieser Ordner
beschreibt, was daran am 19. und 20.11.2026 neu gemacht wurde, und enthaelt die Werkzeuge dazu. Die grossen Bilddateien selbst
liegen nicht im Repository (siehe "Wo die Dateien liegen").

## 1. Ausgangslage

- Am 24.09.2026 entstanden im Higgsfield-Konto des Kunden 42 Bearbeitungen (Modell `nano_banana_flash`, Ausgabe
  5056 x 3392) auf 19 Fotos in voller Groesse und vier Testausschnitten. Jede Bearbeitung hat das ganze Bild neu
  gerechnet. Der Inhaber bleibt auf allen Fotos unveraendert.
- Der Fotofundus der Website (`r1/assets/img/v2`, Fotos 09, 10, 11, 12, 15, 16, 18, 19, 20, 21) stammte aus diesen
  Bearbeitungen. Im Repository war das bis 19.11.2026 nirgends vermerkt.
- Maengel des alten Stands: Farbstich ins Magenta (schwarze Hemden violett, Decken rosa), das ganze Bild weicher als
  das Original, der Lehrling mit rosa Haut und kindlichem Gesicht auf einem erwachsenen Koerper, Haende der
  dunkleren Figur hell geblieben.
- Kundenauftrag 19.11.2026: alle bearbeiteten Bilder auf Plausibilitaet pruefen (Haarton zu Armhaaren, Teint),
  Qualitaet verbessern, auf den Originaldateien in voller Groesse arbeiten. Die Frau am Bildschirm (Foto 04) bleibt
  Original, auch auf anderen Fotos.

## 2. Verfahren

Grundsatz: Das unveraenderte Original in voller Groesse ist die Basis. Ersetzt werden nur die Stellen, die sich
aendern muessen. Farbstich und Unschaerfe des alten Stands verschwinden damit von selbst.

1. **Koepfe aus der frueheren Bearbeitung uebernehmen** (`analyze.py`, `comp.py`, `build1.py`): Die alte Bearbeitung
   wird auf das Original ausgerichtet (SIFT, affine Abbildung), farblich angeglichen (quadratische Abbildung, gelernt
   auf unveraenderten Flaechen) und nur im Kopfbereich ins Original gesetzt (Differenzmaske, Feinverschiebung,
   Kornangleich). Die Gesichter selbst sind die vom Kunden freigegebenen.
2. **Lehrling neu** (`jobs.py`, `prep_gen.py`, `place.py`): In sechs Fotos wurde der Kopf neu erzeugt (Higgsfield,
   Modell `nano_banana_2_1`, 4k, Ausschnitt 4:5 aus dem Original, dazu ein Referenzkopf). Das Ergebnis wird auf den
   Ausschnitt ausgerichtet, farblich angeglichen und nur im Kopfbereich eingesetzt. Koerper, Arme und Haende bleiben
   Original.
3. **Hautton der dunkleren Figur** (`skin.py`, `skinreg.py`): Haende und Unterarme werden nur in der Farbe an das
   Gesicht angeglichen (Verhaeltnis neues Gesicht zu Originalgesicht je Helligkeitsstufe). Struktur, Uhr, Ring und
   Armband bleiben Original. Es wird nichts erzeugt.
4. **Export** (`build2.py`): JPEG mit den Quantisierungstabellen, der Farbunterabtastung und dem Farbprofil des
   Originals. Die Originale tragen keine EXIF-Daten, die Master auch nicht.
5. **Zusaetzliche Fassungen 24, 25, 26** (20.11.2026, `jobs_b.py`, `prep_b.py`, `place_b.py`, `build_b.py`): Die drei
   uebernommenen Koepfe auf der Website, die der echten Person noch glichen, sind neu erzeugt (Modell
   `nano_banana_2_1`, 4k, Ausschnitt 4:5 aus dem fertigen Master, ohne Referenzkopf, Auftrag "andere, erfundene
   Person, gleiche Haltung, Hautton passend zu den Haenden"). Basis ist der fertige Master, ersetzt ist nur dieser
   Kopf. Kundenentscheid: als zusaetzliche Bilder, die bisherigen Fassungen 16, 21 und 11 bleiben.

## 3. Pruefung

- **Gesichtsvergleich** (`facecheck.py`, `facecheck2.py`, YuNet und SFace aus OpenCV, gleiche Person ab 0.363):
  Der Lehrling ist in allen sechs Fotos dieselbe Person (0.57 bis 0.97 zur Vorlage) und der echten Person nicht
  aehnlich (0.12 bis 0.31 im fertigen Master). Von den 20 uebernommenen Koepfen mit sichtbarem Gesicht liegen 15
  unter der Schwelle. Fuenf liegen darueber, sind der echten Person also noch aehnlich: Teamfoto rechts 0.62,
  Profil am Bildschirm 0.47, zweite Drehmaschine 0.46, 3D-Drucker 0.44, Besprechung mit Flasche 0.43. Alle Werte
  stehen in `protokoll/gesichtsvergleich.json` im Lieferpaket.
- **Fassungen 24, 25, 26** (20.11.2026): je ein bis vier brauchbare Varianten, gewaehlt die unaehnlichste plausible.
  Teamfoto rechts 0.11 (vorher 0.62), 3D-Drucker 0.16 (vorher 0.44), Besprechung mit Flasche 0.22 (vorher 0.43).
  Verworfen wurden Varianten mit 0.26 bis 0.37. Die Werte stehen in den Protokollen der drei Master.
- **Unabhaengige Durchsicht**: zehn Pruefer (je Fotogruppe ein Blick auf die Technik und einer auf die
  Plausibilitaet, dazu ein Vergleich der Figuren ueber alle Fotos), danach wurde jeder Befund von einem zweiten
  Pruefer am Bild nachgeprueft. Bestaetigte und behobene Befunde: zweite Hand der dunkleren Figur am Tablet,
  Sonnenflecken am Handgelenk, heller Hautstreifen an der goldenen Uhr und am Uhrenband, Bartrest neben dem Kinn
  des Lehrlings, angeschnittene Stirn des Lehrlings, unleserlich gewordenes Schild im Hintergrund, Einsetzkanten und
  zu scharfer Hinterkopf bei zwei Rueckenfiguren.

## 4. Bekannte Grenzen und offene Punkte

- Fuenf uebernommene Koepfe waren der echten Person laut Gesichtsvergleich noch aehnlich (siehe Abschnitt 3). Die
  drei auf der Website (16, 21, 11) gibt es seit 20.11.2026 zusaetzlich mit neuem Kopf als 24, 25, 26. Die Seiten
  zeigen weiterhin 16, 21 und 11; welche Fassung gilt, entscheidet der Kunde. Die zwei uebrigen (Profil am
  Bildschirm, zweite Drehmaschine) sind nicht auf der Website und bleiben so.
- Die uebernommenen Koepfe stammen aus Bildern mit 5056 Pixeln Breite. In der 100-Prozent-Ansicht sind sie etwas
  weicher als das Original daneben. Fuer Web und uebliche Druckgroessen spielt das keine Rolle.
- Die Figuren aus der frueheren Bearbeitung sind von Foto zu Foto nicht streng dieselbe Person (junger Mann mit
  glattem Gesicht dreimal verschieden, Bart und Brille wechseln). Jedes Foto ist fuer sich stimmig. Kundenentscheid
  20.11.2026: so belassen.
- Auf dem Foto mit den drei Sitzenden ist am Knoechel der rechten Person eine Taetowierung zu sehen.
  Kundenentscheid 20.11.2026: darf sichtbar bleiben.
- Die Fotos der PowerPoint-Beispieldecks sind seit 20.11.2026 aus den Mastern gerechnet
  (`_handover/powerpoint/assets`). Der eingefrorene Fundus im Root (`assets/img/v2`) zeigt den alten Stand und bleibt
  als Vergleichsbasis unberuehrt.
- Rechtlich zu pruefen (keine Rechtsberatung): Verarbeitung von Mitarbeiterfotos bei einem externen KI-Dienst und
  eine allfaellige Kennzeichnung KI-bearbeiteter Bilder.

## 5. Die 21 Master

`W` = Nummer im Fotofundus der Website. Ohne Nummer: nicht auf der Website.

| W | Datei im Lieferpaket | Inhalt | Schritte |
|---|---|---|---|
| 09 | `IRo_09_tablet_master.jpg` | Zwei Personen am Tablet | Koepfe uebernommen, Hautton beider Haende |
| 10 | `IRo_10_besprechung_geste_master.jpg` | Besprechung, Person von hinten | Koepfe uebernommen |
| 11 | `IRo_11_besprechung_flasche_master.jpg` | Besprechung mit Flasche | Koepfe uebernommen |
| 12 | `IRo_12_gespraech_master.jpg` | Inhaber im Gespraech | Hinterkopf uebernommen |
| 15 | `IRo_15_skizze_master.jpg` | Skizzieren am Tablet | Kopf uebernommen |
| 16 | `IRo_16_team_master.jpg` | Team am Tisch | Lehrling neu, ein Kopf uebernommen |
| 18 | `IRo_18_kaffee_master.jpg` | Kaffeetasse | Kopf uebernommen |
| 19 | `IRo_19_bauteile_master.jpg` | Bauteile pruefen | Koepfe uebernommen, Hautton der Haende |
| 20 | `IRo_20_drehbank_master.jpg` | Drehmaschine | Kopf uebernommen |
| 21 | `IRo_21_drucker_master.jpg` | 3D-Drucker | Kopf uebernommen |
| 24 | `IRo_24_team_variante_master.jpg` | Wie 16 | Mann rechts neu (20.11.) |
| 25 | `IRo_25_drucker_variante_master.jpg` | Wie 21 | Kopf neu (20.11.) |
| 26 | `IRo_26_besprechung_flasche_variante_master.jpg` | Wie 11 | Kopf vorne neu (20.11.) |
|  | `IRo_x1_fraesmaschine_master.jpg` | Fraesmaschine, Schutzbrille | Kopf uebernommen |
|  | `IRo_x2_drehbank_zweite_master.jpg` | Drehmaschine, zweite Aufnahme | Kopf uebernommen |
|  | `IRo_x3_profil_monitor_master.jpg` | Profil am Bildschirm | Kopf uebernommen |
|  | `IRo_x4_vier_am_tisch_master.jpg` | Vier am Stehtisch | Lehrling neu, Koepfe uebernommen, Hautton |
|  | `IRo_x5_drei_sitzend_master.jpg` | Drei mit Zeitschrift | Lehrling neu, Koepfe uebernommen, Hautton |
|  | `IRo_x6_langer_tisch_master.jpg` | Langer Tisch, Frau bleibt Original | Lehrling neu, Kopf uebernommen, Hautton |
|  | `IRo_x7_theke_master.jpg` | Vier an der Theke | Lehrling neu, Koepfe uebernommen, Hautton |
|  | `IRo_x8_gruppe_gruen_master.jpg` | Gruppe vor gruener Wand | Lehrling neu, Koepfe uebernommen |

Foto 04 (Mitarbeiterin am Bildschirm) bleibt das Original. Die Fotos 05 und 14 zeigen den Inhaber selbst.

Higgsfield-Auftraege fuer den Lehrling (Modell `nano_banana_2_1`, 19.11.2026): Team `584d5ace`, Vier am Tisch
`f096e3f8`, Drei sitzend `b71731ef`, Langer Tisch `22a48b8c`, Theke `db61cfba`, Gruppe `32e6cd9e` (jeweils die
ersten acht Zeichen der Auftragsnummer, vollstaendig in `jobids.json`).
Fassungen 24 bis 26 (20.11.2026): Teamfoto `47b34580`, 3D-Drucker `63b052d6`, Besprechung `b6971169` (vollstaendig
in `jobids_b.json`, die gewaehlten Varianten in `choice_b.json`).

## 6. Wo die Dateien liegen

- **Master** (21 JPEG, 6038 bis 8192 Pixel breit, zusammen rund 120 MB), Protokolle je Foto und diese Werkzeuge:
  als ZIP `IRo_Fotomaster_2026-11-20.zip` im Higgsfield-Konto des Kunden (das Paket vom 19.11. mit 18 Mastern liegt
  daneben und ist darin vollstaendig enthalten). Der Link wurde dem Kunden direkt uebergeben und steht bewusst nicht hier,
  weil dieses Repository oeffentlich ausgeliefert wird.
- **Originale und alte Bearbeitungen**: im Higgsfield-Konto (Uploads und Verlauf vom 24.09.2026).
- **Bildwerkstatt**: Die Rechenumgebung bei Higgsfield haelt Dateien nur 24 Stunden nach der letzten Nutzung. Was
  bleiben soll, liegt im ZIP.
- **Website**: Die zehn Fotos im Fundus `r1/assets/img/v2` sind aus den Mastern neu gerechnet (1800 x 1200 und
  1100 x 733, WebP 85), ebenso die zusaetzlichen Fotos 24, 25, 26 (nirgends eingebunden).

## 7. Werkzeuge

Im Repository liegt nur `web_einsetzen.py` (setzt die Web-Groessen in den Fundus ein). Die Skripte der Bildwerkstatt
liegen im Lieferpaket unter `werkzeuge/`, weil sie nur dort laufen (Originale und alte Bearbeitungen liegen bei
Higgsfield). Eine spaetere Sitzung holt das ZIP `IRo_Fotomaster_2026-11-20.zip` ueber die Medienliste des
Higgsfield-Kontos in die Bildwerkstatt.

| Datei | Zweck |
|---|---|
| `analyze.py` | Alte Bearbeitung auf das Original ausrichten, Abweichungen messen |
| `comp.py` | Kern: Farbangleich, Masken, Feinverschiebung, Korn, Einsetzen |
| `spec.py`, `build1.py` | Koepfe je Foto (Kurzname, grobe Box) und Uebernahme aus der alten Bearbeitung |
| `jobs.py`, `prep_gen.py`, `place.py` | Lehrling: Ausschnitte und Masken, Einsetzen der erzeugten Koepfe |
| `skin.py`, `skinreg.py` | Hautton der dunkleren Figur: Messung am Gesicht, Bereiche je Foto |
| `build2.py` | Master zusammensetzen und als JPEG schreiben |
| `jobs_b.py`, `prep_b.py`, `place_b.py`, `build_b.py` | Fassungen 24 bis 26: Ausschnitte aus dem Master, Einsetzen mit Gesichtsvergleich, Master und Web-Haelften |
| `facecheck.py`, `facecheck2.py` | Gesichtsvergleich |
| `qa.py`, `qacrop.py`, `kontakt.py` | Pruefblaetter, Ausschnitte, Kontaktblaetter je Figur |
| `web.py` | Web-Groesse 1800 x 1200 aus einem Master, als zwei JPEG-Haelften |
| `web_einsetzen.py` (im Repository) | Haelften zusammensetzen und als WebP in den Fundus schreiben; neue Nummer als Variante mit `NN:MM` (z. B. `24:16`), der Ausschnitt wird dann gegen `MM` geprueft |

Ablauf zum Nachbauen in der Bildwerkstatt (Ordner mit `orig/`, `raw/`, `work/`, `gen/`, `master/`):
`analyze.py`, dann `build1.py`, `prep_gen.py`, Koepfe erzeugen, `place.py`, `skin.py`, `build2.py`, `qa.py`.
Benoetigt Python 3 mit Pillow, numpy und OpenCV. Die Skripte erwarten die Originale als `orig/<Kuerzel>.jpg` und die
alten Bearbeitungen als `raw/<Nummer>.png`. Die Zuordnung steht in `spec.py`.

Dieser Container erreicht die Bildablage von Higgsfield nicht direkt. Die Web-Groessen kamen deshalb als JPEG-Haelften
ueber die Bildrueckgabe der Werkstatt ins Projekt (`web.py`, dann `web_einsetzen.py`).
