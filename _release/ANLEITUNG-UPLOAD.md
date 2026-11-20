# Go-Live www.iro.swiss - Upload auf Hostpoint mit FileZilla

Paket: `iro-swiss-www-20261120.zip` (52 Dateien, 4,1 MB entpackt). Die Dateien liegen im ZIP direkt auf oberster
Ebene; ihr Inhalt gehoert 1:1 in das Verzeichnis `www` bei Hostpoint.

## 1. Sicherung der alten Seite (5 Minuten)

1. FileZilla oeffnen und mit Hostpoint verbinden (wie bisher).
2. Server-Menue: **Server > Anzeige versteckter Dateien erzwingen** einschalten (sonst fehlt `.htaccess`).
3. Rechts das Verzeichnis `www` oeffnen, alles markieren und nach links in einen neuen Ordner
   `iro-backup-2026-11-20` herunterladen.

## 2. Alte Dateien entfernen

Die bisherige Seite hatte andere Ordner (alte Schriften, Kartenbibliothek, alte Fotos). Damit davon nichts
oeffentlich liegen bleibt, im Verzeichnis `www` alles loeschen **ausser**:

- einem Ordner `.well-known` (falls vorhanden, Hostpoint braucht ihn fuer das SSL-Zertifikat),
- Dateien, die Hostpoint selbst angelegt hat und die Sie nicht kennen (im Zweifel stehen lassen).

## 3. Neue Seite hochladen

1. ZIP auf dem Computer entpacken (Mac: Doppelklick; Windows: Rechtsklick > Alle extrahieren).
2. In FileZilla links in den entpackten Ordner wechseln. Dort muessen u. a. `index.html`, `.htaccess`
   und der Ordner `assets` liegen.
3. Alles markieren (auch `.htaccess`) und nach rechts in `www` ziehen. Bei Rueckfragen "Ueberschreiben" waehlen.
4. Kontrolle rechts: `.htaccess`, `404.html`, `index.html`, `karriere.html`, `kontakt.html`,
   `impressum.html`, `datenschutz.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, Favicons, `assets/`.

## 4. Kontrolle im Browser (am besten in einem privaten Fenster)

| Test | Erwartung |
|---|---|
| https://www.iro.swiss | Startseite mit Ladebalken, danach Hinweis zu Cookies |
| http://iro.swiss | leitet auf https://www.iro.swiss |
| https://www.ideeroth.ch | leitet auf https://www.iro.swiss |
| https://www.iro.swiss/index.html | leitet auf https://www.iro.swiss/ |
| https://www.iro.swiss/gibt-es-nicht | eigene Seite «Diese Seite gibt es nicht.» im IRo-Design |
| Kontakt, Karriere, Impressum, Datenschutz | laden, Footer und Menue funktionieren |
| Sprachwahl DE/EN | Texte wechseln |
| Cookie-Hinweis «Akzeptieren» | Seite laeuft weiter, Google Analytics zaehlt (in GA "Echtzeit" sichtbar) |
| Handy hochkant und quer | Darstellung wie in der Vorschau |

Falls nach dem Upload nur «Internal Server Error» erscheint: in FileZilla `.htaccess` in `htaccess.txt`
umbenennen (Seite laeuft dann ohne Weiterleitungen und Sicherheitsangaben) und melden.

## 5. Danach (optional, empfohlen)

- Google Search Console: Sitemap `https://www.iro.swiss/sitemap.xml` einreichen.
- Browser-Cache: Wer die alte Seite kuerzlich besucht hat, sieht die neue nach einem Neuladen.
- Die Vorschau auf GitHub Pages bleibt mit "noindex" bestehen; nach dem Go-Live kann sie abgeschaltet werden.

## Neu bauen (fuer spaetere Aenderungen)

Im Repository: `python3 _handover/tools/golive/build_release.py`. Quelle ist `r1/`, das Ergebnis landet in
`_release/` (Ordner `www/` und ZIP). Der Build entfernt Vorschauseiten und Kommentare, minifiziert HTML/CSS/JS,
setzt robots.txt und sitemap.xml und prueft auf Entwicklungsspuren und fehlende Dateien.
