# Pruefung Impressum und Datenschutz (21.11.2026)

Auftrag des Kunden vom 21.11.2026: Impressum und Datenschutzerklaerung von www.iro.swiss mit Better Call Claude pruefen.
Das ist keine Rechtsberatung. Die Punkte unter «Offen» gehoeren vor eine Fachperson.

## Vorgehen

- Das Analyse-Werkzeug von Better Call Claude (`legal_analyze`) lieferte bei drei Versuchen nur eine leere Antwort.
- Geprueft wurde darum am Gesetzestext, abgerufen ueber die Fedlex-Anbindung derselben Sammlung (Stand der Fedlex-Fassung
  beim Abruf): DSG Art. 6, 16, 19, 25, 28, 32, 49, DSV Art. 8, UWG Art. 3 Abs. 1 lit. s, OR Art. 100. Fuer Besucher aus
  der EU zusaetzlich die Informationspflichten der DSGVO (Art. 13), aus Fachwissen, nicht aus der Sammlung.

## Befund und Umsetzung (in r1, DE und EN, Paket 20261121b)

| Stelle | Befund | Umgesetzt |
|---|---|---|
| Datenschutz 03 Server-Logfiles | «gekuerzte IP-Adresse» war beim Hosting-Anbieter nicht belegt | «IP-Adresse» ohne Zusage zur Kuerzung |
| Datenschutz 03 | Aufbewahrung fehlte (DSG Art. 6 Abs. 4, DSGVO Art. 13 Abs. 2 lit. a) | Kriterium: so lange der Zweck es verlangt, danach geloescht, dazu Rechtsgrundlage DSGVO Art. 6 Abs. 1 lit. f genannt |
| Datenschutz 06 Google Analytics | Bekanntgabe ins Ausland: Staat und Garantien fehlten (DSG Art. 19 Abs. 4 mit Art. 16) | Empfaengerin Google Ireland Limited, USA mit Swiss-U.S. Data Privacy Framework und Standardvertragsklauseln «nach Angaben von Google», Loeschung nach der im Konto eingestellten Dauer |
| Datenschutz 07 Kontakt | Rechtsgrundlage nach DSGVO und Aufbewahrung fehlten | Art. 6 Abs. 1 lit. b und f DSGVO, Loeschung, sobald nicht mehr noetig und keine gesetzliche Aufbewahrungspflicht |
| Datenschutz 10 Ihre Rechte | Herausgabe und Uebertragung (DSG Art. 28), Widerruf und Anlaufstelle fehlten | ergaenzt, dazu EDOEB (DSG Art. 49, Anzeige) und fuer die EU die Behoerde des Landes, Link www.edoeb.admin.ch |
| Datenschutz 11 Aenderungen | kein Stand-Datum | «Stand: 21. November 2026» |
| Impressum 03 Haftungsausschluss | Voller Ausschluss ist fuer Absicht und grobe Fahrlaessigkeit nichtig (OR Art. 100 Abs. 1) | «soweit das Gesetz dies zulaesst» |
| Impressum 01 | Identitaet und Kontaktadresse mit E-Mail vorhanden (UWG Art. 3 Abs. 1 lit. s Ziff. 1, falls anwendbar) | nichts noetig |

## Offen (braucht Angaben oder einen Entscheid des Kunden)

1. **Impressum, UID und Handelsregister:** UID-Nummer (CHE-...) und «Handelsregister des Kantons Thurgau» ergaenzen,
   dazu die vertretungsberechtigte Person mit Funktion. Nach UWG nicht zwingend, fuer Besucher aus Deutschland und
   Oesterreich ueblich. Die Angaben stehen auf zefix.ch. Nicht erfinden, vom Kunden geben lassen.
2. **Aufbewahrung Google Analytics:** In Google Analytics unter Verwaltung > Datenerhebung und -aenderung >
   Datenaufbewahrung nachsehen (2 oder 14 Monate) und die Zahl in Abschnitt 06 nennen.
3. **Swiss-U.S. Data Privacy Framework:** Pruefen lassen, ob die Google LLC dort zertifiziert ist und der Satz so stehen
   kann (Liste auf dataprivacyframework.gov, Angemessenheit nach DSV Anhang 1).
4. **KI-bearbeitete Fotos:** Die EU-KI-Verordnung (Art. 50 Abs. 4, Kennzeichnung von «Deepfakes») gilt nach dem Text der
   Verordnung ab 2. August 2026, auch fuer Firmen ausserhalb der EU, wenn das Ergebnis in der EU genutzt wird (Art. 2
   Abs. 1 lit. c). Ob erfundene Gesichter in echten Bueroaufnahmen darunter fallen und ob sich Fristen seither verschoben
   haben, soll eine Fachperson beurteilen. Moeglicher Hinweis im Impressum, Abschnitt Urheberrechte oder eigener
   Abschnitt «Bildnachweis»: «Auf einzelnen Fotos sind die abgebildeten Personen mit KI erzeugt.» Dazu passen die
   Alt-Texte, die diese Personen heute «Mitarbeiter» nennen.
5. **Server-Logfiles:** Beim Hosting-Anbieter erfragen, wie lange die Logfiles aufbewahrt werden und ob die IP-Adresse
   gekuerzt wird. Dann die Dauer nennen.
6. **EU-Vertretung (DSGVO Art. 27):** Fuer eine Schweizer Firma mit gelegentlicher Verarbeitung ohne grosses Risiko
   meist nicht noetig (Ausnahme Art. 27 Abs. 2 lit. a). Bestaetigen lassen.
7. **Mitarbeiterfotos bei einem externen KI-Dienst:** Einwilligung der abgebildeten Mitarbeitenden und Vertrag mit dem
   Dienst pruefen (offener Punkt seit 20.11.2026).
