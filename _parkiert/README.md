# Parkierte Inhalte (nicht veröffentlicht)

Dieser Ordner enthält Inhalte, die **bewusst nicht auf der Website** sind, aber
später wieder eingesetzt werden sollen. Der Ordner wird per `.htaccess`
gesperrt (404), falls er versehentlich ins `www` hochgeladen wird – er muss
also **nicht** zwingend hochgeladen werden.

## offene-stellen.html
Der Abschnitt **„Offene Stellen"** (zwei Junior-Positionen) der Karriere-Seite.
Ausgebaut im Juli 2026, weil aktuell **keine offenen Stellen** bestehen – nur
die Lehrstelle 2027.

### Wieder aktivieren (wenn es neue offene Stellen gibt)
1. In `karriere.html` den Marker suchen:
   `<!-- [PARKIERT] Abschnitt "Offene Stellen" ... -->`
   (zwischen dem Lehrstellen-Inserat und „Initiativbewerbung").
2. Den Inhalt aus `offene-stellen.html` (ohne den oberen Kommentar) dort einfügen.
   Stellentexte bei Bedarf aktualisieren.
3. **Startseiten-Banner** (`index.html`, `id="karriere"`) wieder erweitern:
   - Fliesstext-Ende: `Start August 2027.` → `Start August 2027 - dazu weitere offene Stellen.`
   - Button: `Zur Lehrstelle →` → `Lehrstelle & offene Stellen →`
4. **Meta-Description** der Karriere-Seite (`karriere.html`, `<meta name="description">`)
   wieder auf „offene Stellen" anpassen.

Historie steckt zusätzlich in der Git-Historie (Commit, der die Stellen ausbaut).
