# Endkontrolle vor jeder Veroeffentlichung

Skripte der Go-Live-Endkontrolle vom 20.11.2026. Sie pruefen das gebaute Paket (`_release/www/`), nicht `r1/`.

Vorbereitung (einmal pro Container):

    cd _release/www && python3 -m http.server 8766 &           # Paket lokal ausliefern
    mkdir -p /tmp/qa && cd /tmp/qa && npm i vnu-jar axe-core lighthouse

| Pruefung | Aufruf (im Repo-Root) | Erwartung |
|---|---|---|
| HTML-Validator (W3C) | `java -jar /tmp/qa/node_modules/vnu-jar/build/dist/vnu.jar --format text _release/www/*.html` | keine Fehler |
| Interne Links und Anker | `python3 -I _handover/tools/golive/endkontrolle/linkcheck.py _release/www` | Probleme: keine |
| Netzwerk ohne Zustimmung, Cookies, axe | `python3 _handover/tools/golive/endkontrolle/netz_und_axe.py /tmp/qa/node_modules/axe-core/axe.min.js` | extern vor Zustimmung: keine; nach Zustimmung nur googletagmanager.com |
| axe je Sektion im Blick | `python3 _handover/tools/golive/endkontrolle/axe_sektionen.py /tmp/qa/node_modules/axe-core/axe.min.js` | nur bekannte Fehlmessungen (siehe unten) |
| Tastatur | `python3 _handover/tools/golive/endkontrolle/tastatur.py` und `tastatur_details.py` | alle Stopps sichtbar mit Fokusring, Esc schliesst Menue, Skip-Link fuehrt in main |
| Scrollen auf Touch | `python3 _handover/tools/golive/endkontrolle/scroll_messung.py` | Startsektion bewegt sich nicht gegen den Finger |
| Sweep | `python3 _handover/tools/test_v2b.py 8766 ""` | PROBLEMS: none |
| Lighthouse | `CHROME_PATH=/opt/pw-browsers/chromium npx --prefix /tmp/qa lighthouse http://127.0.0.1:8766/ --chrome-flags="--headless=new --no-sandbox"` | SEO und Best Practices 100 |

Externe Links laesst diese Umgebung nicht zu; am 20.11.2026 wurden sie ueber Firecrawl (Konto des Kunden, wenige
Credits) geprueft. Bekannte Fehlmessung: axe und Lighthouse melden im Prozessblock und im Footer zu wenig Kontrast,
weil sie den festen dunklen Boden (`.ground`, z-index -10) nicht erkennen und die helle Body-Farbe annehmen.
