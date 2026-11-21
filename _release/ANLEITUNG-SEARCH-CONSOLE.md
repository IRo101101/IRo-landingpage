# Google Search Console fuer www.iro.swiss einrichten

Stand 21.11.2026. Dauer rund 20 Minuten, dazu Wartezeit fuer Google. Sie brauchen das Google-Konto, mit dem auch
Google Analytics laeuft, und die Hostpoint-ID fuer das Control Panel.

Die Search Console zeigt, ob Google alle Seiten kennt, mit welchen Suchbegriffen die Seite gefunden wird und ob es
Fehler gibt. Sie kostet nichts und aendert nichts an der Website.

## 1. Domain bei Google anmelden

1. https://search.google.com/search-console oeffnen und mit dem Google-Konto anmelden.
2. Oben links auf die Auswahl der Properties klicken, dann **Property hinzufuegen**.
3. Links die Variante **Domain** waehlen (nicht «URL-Praefix»). Ins Feld nur `iro.swiss` schreiben, ohne `www` und ohne
   `https://`. **Weiter**.
4. Google zeigt jetzt einen **TXT-Eintrag**, der mit `google-site-verification=` beginnt. Auf **Kopieren** klicken.
   Das Fenster offen lassen.

Die Variante Domain deckt alles ab: mit und ohne `www`, `http` und `https`.

## 2. TXT-Eintrag bei Hostpoint setzen

1. Im zweiten Browserfenster das Hostpoint Control Panel oeffnen und mit der Hostpoint-ID anmelden.
2. Links **Domains** waehlen, dann bei `iro.swiss` **DNS-Zone bearbeiten**.
3. Einen neuen Eintrag hinzufuegen. Hostpoint bietet dafuer auch eine Vorlage fuer die Google-Bestaetigung an.
   Von Hand: Typ **TXT**, Name leer lassen oder `@` (gilt fuer die Domain selbst), Wert = der kopierte Text
   `google-site-verification=...` vollstaendig einfuegen. Uebrige Felder so lassen.
4. Speichern.

Hostpoint beschreibt das hier:
https://support.hostpoint.ch/en/technical/dns/frequently-asked-questions/how-do-i-confirm-domain-ownership-for-google

Den TXT-Eintrag **nie mehr loeschen**. Ohne ihn verliert das Konto den Zugriff auf die Search Console.

## 3. Bestaetigen

1. Mindestens 15 Minuten warten, dann im Fenster der Search Console auf **Bestaetigen** klicken.
2. Klappt es nicht: spaeter nochmals versuchen. Die Aenderung kann bis zu 48 Stunden brauchen.

Falls die Domain iro.swiss nicht bei Hostpoint verwaltet wird: bei der Stelle, die die Domain verwaltet, denselben
TXT-Eintrag setzen. Die Bestaetigung ueber Google Analytics funktioniert bei dieser Seite nicht, weil Analytics erst nach
der Cookie-Zustimmung laedt.

## 4. Sitemap einreichen

1. In der Search Console links **Sitemaps** waehlen.
2. Unter «Neue Sitemap hinzufuegen» nach der Adresse `https://www.iro.swiss/` das Wort `sitemap.xml` eintragen.
   **Senden**.
3. Nach einigen Minuten bis Stunden steht beim Status **Erfolgreich**, dazu fuenf erkannte Seiten.

Die Sitemap nennt die fuenf Seiten Startseite, Kontakt, Karriere, Impressum und Datenschutz. Die Fehlerseite gehoert
nicht hinein.

## 5. Startseite neu einlesen lassen

1. Oben in das Suchfeld **URL pruefen** die Adresse `https://www.iro.swiss/` eingeben, Enter.
2. Auf **Indexierung beantragen** klicken. Das beschleunigt, dass Google die neue Seite statt der alten zeigt.
3. Dasselbe fuer `https://www.iro.swiss/kontakt.html` und `https://www.iro.swiss/karriere.html`.

## 6. Nach einer Woche kontrollieren

- **Seiten** (unter «Indexierung»): Die fuenf Seiten sollten als «indexiert» erscheinen. Hinweise wie «Seite mit
  Weiterleitung» fuer `iro.swiss` oder `/index.html` sind richtig so, weil diese Adressen auf `www.iro.swiss`
  weiterleiten.
- **Leistung**: Suchbegriffe, Klicks und Position. Erste Zahlen kommen nach einigen Tagen.
- Google schickt E-Mails, wenn ein Problem auftaucht. Sonst muss man nichts tun.

## 7. Optional

- **Alte Domain ideeroth.ch:** Erscheint ideeroth.ch noch in den Google-Ergebnissen, dieselbe Domain-Bestaetigung
  (Schritte 1 bis 3) fuer `ideeroth.ch` machen. Danach in der Property ideeroth.ch unter **Einstellungen** >
  **Adressaenderung** die neue Adresse `www.iro.swiss` angeben. Die Weiterleitung von ideeroth.ch auf www.iro.swiss
  besteht bereits.
- **Mit Google Analytics verknuepfen:** In Google Analytics unter Verwaltung > Produktverknuepfungen > Search Console.
  Dann stehen die Suchbegriffe auch in Analytics.
- **Bing:** Unter https://www.bing.com/webmasters laesst sich die Search Console mit einem Klick uebernehmen. Bing
  liefert auch die Ergebnisse fuer andere Suchmaschinen.
