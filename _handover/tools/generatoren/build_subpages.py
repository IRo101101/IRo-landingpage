# Baut karriere.html, impressum.html, datenschutz.html (v2) mit gemeinsamem Header/Footer.
import io, os
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))

HEAD = '''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title data-en="{title_en}">{title_de}</title>
<meta name="description" data-en="{desc_en}" content="{desc_de}">
<meta name="theme-color" content="#111418">
<link rel="canonical" href="https://www.iro.swiss/{file}">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preload" href="assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/vendor/lenis/lenis.css">
<link rel="stylesheet" href="assets/css/styles.css?v=20260930">
</head>
<body>
<a class="skip" href="#main" data-en="Skip to content">Zum Inhalt springen</a>
<div class="ground" data-ground-layer aria-hidden="true"></div>

<header class="hdr" data-theme="light">
  <a class="hdr__cell hdr__logo" href="index.html" aria-label="IdeeRoth AG - Startseite" data-en-label="IdeeRoth AG - Home"><span class="logo-mark" role="img" aria-label="iro.swiss"></span></a>
  <div class="hdr__cell hdr__spacer" aria-hidden="true"></div>
  <nav class="hdr__nav" aria-label="Hauptnavigation">
    <a href="index.html#kompetenzen" data-en="Expertise">Kompetenzen</a>
    <a href="index.html#unternehmen" data-en="Company">Unternehmen</a>
    <a href="index.html#leistungen" data-en="Services">Leistungen</a>
    <a href="index.html#team">Team</a>
    <a href="index.html#kontakt" data-en="Contact">Kontakt</a>
  </nav>
  <div class="hdr__cell hdr__lang lang">
    <button class="lang__btn" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Sprache wählen" data-en-label="Choose language"><span data-lang-code>DE</span><span class="lang__chev" aria-hidden="true"></span></button>
    <ul class="lang__panel" hidden>
      <li><a href="#" data-lang="de" hreflang="de">DE <span>Deutsch</span></a></li>
      <li><a href="#" data-lang="en" hreflang="en">EN <span>English</span></a></li>
    </ul>
  </div>
  <a class="hdr__cell hdr__action" href="index.html#kontakt"><span class="sw" aria-hidden="true"></span><span class="rl" data-en="start Project">Projekt starten</span></a>
  <button class="hdr__cell hdr__burger" type="button" aria-label="Menü" data-en-label="Menu" aria-expanded="false" aria-controls="menu"><span><i></i><i></i></span></button>
</header>

<div class="menu" id="menu" hidden>
  <div class="menu__links">
    <a class="al" href="index.html#kompetenzen"><span class="al__label" data-en="Expertise">Kompetenzen</span><span class="al__arrow" aria-hidden="true"></span></a>
    <a class="al" href="index.html#unternehmen"><span class="al__label" data-en="Company">Unternehmen</span><span class="al__arrow" aria-hidden="true"></span></a>
    <a class="al" href="index.html#leistungen"><span class="al__label" data-en="Services">Leistungen</span><span class="al__arrow" aria-hidden="true"></span></a>
    <a class="al" href="index.html#team"><span class="al__label">Team</span><span class="al__arrow" aria-hidden="true"></span></a>
    <a class="al" href="karriere.html"><span class="al__label" data-en="Careers">Karriere</span><span class="al__arrow" aria-hidden="true"></span></a>
    <a class="al" href="index.html#kontakt"><span class="al__label" data-en="Contact">Kontakt</span><span class="al__arrow" aria-hidden="true"></span></a>
  </div>
  <div class="menu__lang"><span data-en="Language">Sprache</span><span class="menu__langs"><a href="#" data-lang="de">DE</a><a href="#" data-lang="en">EN</a></span></div>
  <a class="menu__action" href="index.html#kontakt"><span class="sw" aria-hidden="true"></span><span class="rl" data-en="start Project">Projekt starten</span></a>
</div>

<div data-ground="light" data-header-theme="light">
<main id="main" class="sub">
'''

FOOT = '''
  <p class="sub__reveal"><a class="dbtn dbtn--light sub__back" href="index.html"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Back to home">Zurück zur Startseite</span></a></p>
</main>
</div>

<footer class="subfoot" data-header-theme="dark">
  <div class="subfoot__grid">
    <a class="rail__logo" href="index.html" aria-label="IdeeRoth AG - Startseite" data-en-label="IdeeRoth AG - Home"><span class="logo-lock" role="img" aria-label="iro.swiss"></span></a>
    <nav class="rail__links" aria-label="Abschnitte">
      <a class="al" href="index.html#kompetenzen"><span class="al__label" data-en="Expertise">Kompetenzen</span><span class="al__arrow" aria-hidden="true"></span></a>
      <a class="al" href="index.html#unternehmen"><span class="al__label" data-en="Company">Unternehmen</span><span class="al__arrow" aria-hidden="true"></span></a>
      <a class="al" href="index.html#leistungen"><span class="al__label" data-en="Services">Leistungen</span><span class="al__arrow" aria-hidden="true"></span></a>
      <a class="al" href="index.html#team"><span class="al__label">Team</span><span class="al__arrow" aria-hidden="true"></span></a>
      <a class="al" href="karriere.html"><span class="al__label" data-en="Careers">Karriere</span><span class="al__arrow" aria-hidden="true"></span></a>
      <a class="al" href="index.html#kontakt"><span class="al__label" data-en="Contact">Kontakt</span><span class="al__arrow" aria-hidden="true"></span></a>
    </nav>
    <address class="subfoot__details">
      <a href="tel:+41718558855">+41 71 855 88 55</a>
      <a href="mailto:info@iro.swiss">info@iro.swiss</a>
      <span>IdeeRoth AG<br>Hafenstrasse 62<br>CH-8590 Romanshorn</span>
      <span class="rail__badges">
        <a href="https://www.nafems.org" target="_blank" rel="noopener" aria-label="NAFEMS - nafems.org (neues Fenster)"><img src="assets/img/badge-nafems-member.png" alt="NAFEMS Member" width="165" height="150" loading="lazy"></a>
        <a href="https://www.berufsbildungplus.ch" target="_blank" rel="noopener" aria-label="Berufsbildung - Wir machen Profis, berufsbildungplus.ch (neues Fenster)"><img src="assets/img/badge-lehrbetrieb.png" alt="Lehrbetrieb - Wir machen Profis" width="130" height="130" loading="lazy"></a>
      </span>
    </address>
  </div>
  <div class="subfoot__bottom">
    <span>© <span data-year>2026</span> IdeeRoth AG</span>
    <span class="subfoot__legal">
      <a href="impressum.html" data-en="Legal notice">Impressum</a><span aria-hidden="true">/</span>
      <a href="datenschutz.html" data-en="Privacy">Datenschutz</a><span aria-hidden="true">/</span>
      <a href="#" data-cookie-settings data-en="Cookie settings">Cookie-Einstellungen</a>
    </span>
  </div>
</footer>

<script src="assets/vendor/lenis/lenis.min.js"></script>
<script src="assets/js/main.js?v=20260930"></script>
</body>
</html>
'''

KARRIERE = '''  <span class="eyebrow sub__reveal" data-en="Careers">Karriere</span>
  <h1 data-en="Great people fit well with us.">Gute Leute passen gut zu uns.</h1>
  <p class="lead sub__reveal" data-en="A steep learning curve through varied tasks and projects with a high degree of personal responsibility. Integration into a dynamic team and a culture of openness, active participation and teamwork. Regular team and company events strengthen our sense of togetherness.">Eine steile Lernkurve durch abwechslungsreiche Aufgaben und Projekte mit hoher Eigenverantwortung. Einbindung in ein dynamisches Team und eine Kultur der Offenheit, aktiven Mitgestaltung und Teamarbeit. Regelmässige Team- und Firmenevents festigen den Zusammenhalt.</p>

  <h2 class="sub__reveal" data-en="We train talent.">Wir bilden aus.</h2>
  <p class="sub__reveal" data-en="There is a lot of talk about the skills shortage. We prefer to do something about it - we train.">Vom Fachkräftemangel wird viel geredet. Wir tun etwas dagegen - und bilden aus.</p>
  <p class="sub__reveal" data-en="IdeeRoth AG trains design engineers (Konstrukteur:in EFZ, the Swiss Federal VET Diploma) and gives young people the tools for a demanding technical career. From day one, our apprentices work on real projects and learn design, calculation and development in the daily life of an engineering office.">Die IdeeRoth AG bildet Konstrukteurinnen und Konstrukteure EFZ aus und gibt jungen Menschen das Rüstzeug für eine anspruchsvolle technische Laufbahn. Unsere Lernenden arbeiten von Beginn an an realen Projekten mit und lernen Konstruktion, Berechnung und Entwicklung im Alltag eines Ingenieurbüros.</p>
  <p class="sub__reveal" data-en="Step by step, they grow into independent professionals. What they gain with us stays with them - and with Swiss industry.">Schritt für Schritt werden sie so zu eigenständigen Fachleuten. Was sie bei uns erwerben, bleibt ihnen - und dem Werkplatz Schweiz - erhalten.</p>
  <p class="sub__reveal" data-en="That way we don't just secure our own next generation; we make a concrete contribution against the skills shortage. Not by complaining, but by training.">So sichern wir nicht nur unseren eigenen Nachwuchs, sondern leisten einen konkreten Beitrag gegen den Fachkräftemangel. Nicht mit Klagen, sondern mit Ausbildung.</p>

  <h2 class="sub__reveal" data-en="Apprenticeship 2027">Lehrstelle 2027</h2>
  <div class="job sub__reveal">
    <span class="eyebrow">Wir suchen dich</span>
    <p>Develop more from less - entwickle aus weniger mehr. Dieser Leitsatz prägt unsere Arbeit als Spezialist für Produktentwicklung. Wir lösen Probleme durch kreative Ansätze und sind als langfristiger Partner fest in den Innovationsnetzwerken unserer Kunden verankert. Dabei verbinden wir Herzblut mit Zuverlässigkeit und arbeiten konsequent nachhaltig, ökologisch und effizient.</p>
    <p>Wir setzen auf wertvolles, gesundes Wachstum. Das gilt für unsere Kundenprojekte genauso wie für unsere Unternehmenskultur. Als attraktiver Arbeitgeber fördern wir Talente und fordern Bestleistungen. Wenn diese Leidenschaft auf unsere strategische Weitsicht trifft, entsteht echter, nachhaltiger Wert.</p>
    <p>Im Sommer 2027 kann deine berufliche Laufbahn bei der IdeeRoth AG starten mit einer</p>
    <h3>Lehre als Konstrukteur/-in EFZ (Eintritt 1. August 2027)</h3>

    <h4>Deine Aufgaben bestehen aus:</h4>
    <ul>
      <li>Entwickeln und Konstruieren von Bauteilen und ganzen Baugruppen</li>
      <li>Erstellen von Konstruktionszeichnungen</li>
      <li>Erstellen von technischen Dokumentationen</li>
      <li>Technische Abklärungen innerhalb unseres Betriebs</li>
    </ul>

    <h4>Damit überzeugst du uns:</h4>
    <ul>
      <li>Freude an Mathematik, Geometrie und Physik</li>
      <li>Interesse an technischen Zusammenhängen und Mechanik</li>
      <li>Technisches Verständnis</li>
      <li>Fähigkeit, räumlich zu denken</li>
      <li>Freude an der Arbeit am Computer</li>
      <li>Abgeschlossene Oberstufe mit guten Noten in Niveau M oder E</li>
      <li>Geduld, Ausdauer und Konzentration</li>
      <li>Teamfähigkeit und Zuverlässigkeit</li>
    </ul>

    <h4>Das kannst du von uns erwarten:</h4>
    <p>Eine abwechslungsreiche 4-jährige Ausbildung, bei der deine persönliche Entwicklung im Fokus steht. Wir unterstützen dich aktiv dabei, mehr als nur das Minimum zu erreichen und über deine Grenzen hinauszuwachsen. Freue dich auf ein innovatives, ambitioniertes Umfeld und eine steile Lernkurve in spannenden Projekten. Ein offenes Miteinander, Raum für deine eigenen Ideen sowie coole Teamevents sind bei uns feste Bestandteile des Arbeitsalltags.</p>
    <p>Gerne laden wir dich bei Interesse auf abwechslungsreiche Schnuppertage ein. Mach den ersten Schritt in deine berufliche Zukunft und melde dich bei uns.</p>
    <p>Weitere Informationen über deinen zukünftigen Beruf findest du unter <a href="https://www.berufsberatung.ch" target="_blank" rel="noopener">www.berufsberatung.ch</a></p>
    <p>Du erreichst uns unter <a href="tel:+41718558855">+41 71 855 88 55</a> für einen ersten Austausch und darfst dann gerne deine vollständigen Bewerbungsunterlagen (inkl. Foto) an <a href="mailto:info@iro.swiss">info@iro.swiss</a> versenden.</p>
    <p><strong>Wir freuen uns auf dich!</strong></p>
    <p class="actions"><a class="dbtn dbtn--light" href="mailto:info@iro.swiss?subject=Bewerbung%20Lehrstelle%20Konstrukteur%2F-in%20EFZ"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl">Jetzt bewerben</span></a></p>
  </div>

  <!-- [PARKIERT] Abschnitt "Offene Stellen" ausgebaut (aktuell keine offenen Stellen, nur die Lehrstelle).
       Wieder einsetzen: Inhalt aus _parkiert/offene-stellen.html hierher kopieren (siehe _parkiert/README.md). -->

  <h2 class="sub__reveal" data-en="Unsolicited application">Initiativbewerbung</h2>
  <p class="sub__reveal" data-en="Currently nothing specific for you? Not a problem - because you are talented and you know it better. Taking initiative has always been one of our favourite qualities. If you have matching qualities to offer, we would love to hear from you.">Aktuell nichts Passendes dabei? Kein Problem - denn du bist talentiert und weisst es selbst am besten. Eigeninitiative war schon immer eine unserer Lieblingseigenschaften. Wenn du passende Qualitäten mitbringst, hören wir gerne von dir.</p>
  <p class="sub__reveal" data-en="Please send your complete application documents to:">Bitte sende deine vollständigen Bewerbungsunterlagen an:</p>
  <address class="sub__reveal">
    IdeeRoth AG · <span data-en="Engineering Development Prototypes">Konstruktion Entwicklung Prototypen</span><br>
    Hafenstrasse 62 · CH-8590 Romanshorn<br>
    <a href="mailto:info@iro.swiss">info@iro.swiss</a><br>
    <span data-en="For more information, Alain Roth is happy to help:">Auskunft erteilt dir gerne Alain Roth:</span> <a href="tel:+41718558855">+41 71 855 88 55</a>
  </address>
  <p class="actions sub__reveal"><a class="dbtn dbtn--light" href="mailto:info@iro.swiss?subject=Bewerbung%20IdeeRoth%20AG"><span class="dbtn__fill" aria-hidden="true"></span><span class="rl" data-en="Apply now">Jetzt bewerben</span></a></p>
'''

IMPRESSUM = '''  <span class="eyebrow sub__reveal" data-en="Legal notice">Impressum</span>
  <h1 data-en="Legal notice">Impressum</h1>

  <h2 class="sub__reveal" data-en="Contact address">Kontaktadresse</h2>
  <address class="sub__reveal">
    IdeeRoth AG<br>
    Hafenstrasse 62<br>
    CH-8590 Romanshorn<br><br>
    <span data-en="Phone">Tel</span> <a href="tel:+41718558855">+41 71 855 88 55</a><br>
    Mail <a href="mailto:info@iro.swiss">info@iro.swiss</a><br>
    Web <a href="https://www.iro.swiss" target="_blank" rel="noopener">www.iro.swiss</a>
  </address>

  <h2 class="sub__reveal" data-en="Copyright">Urheberrechte</h2>
  <p class="sub__reveal" data-en="The copyright and all other rights to content, images, photos or other files on the website belong exclusively to IdeeRoth AG or the specifically named rights holders. Written consent from the copyright holders must be obtained in advance for the reproduction of any elements.">Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich der IdeeRoth AG oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.</p>

  <h2 class="sub__reveal" data-en="Disclaimer">Haftungsausschluss</h2>
  <p class="sub__reveal" data-en="IdeeRoth AG provides general information about the company, its activities and services on this website as an initial orientation. Although the information is kept up to date, IdeeRoth AG assumes no responsibility for the timeliness, correctness or completeness of the data provided. Liability claims for damages of a material or immaterial nature arising from access to or use of the published information are excluded.">Die IdeeRoth AG bietet auf dieser Seite allgemeine Informationen über die Firma, ihre Aktivitäten und Dienstleistungen als erste Orientierungshilfe an. Obwohl die Informationen aktuell gehalten werden, übernimmt die IdeeRoth AG keine Verantwortung für die Aktualität, Richtigkeit und Vollständigkeit der aufgeführten Daten. Haftungsansprüche wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung der veröffentlichten Informationen entstehen, werden ausgeschlossen.</p>

  <h2 class="sub__reveal" data-en="Links">Haftung für Links</h2>
  <p class="sub__reveal" data-en="References and links to third-party websites lie outside our area of responsibility. Any responsibility for such websites is rejected. Access to and use of such websites is at the user's own risk.">Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr der Nutzerin oder des Nutzers.</p>
'''

DATENSCHUTZ = '''  <span class="eyebrow sub__reveal" data-en="Privacy">Datenschutz</span>
  <h1 data-en="Privacy policy">Datenschutzerklärung</h1>
  <p class="lead sub__reveal" data-en="IdeeRoth AG works with high transparency; the trust of our customers is important to us. This policy explains what data this website processes and how.">Die IdeeRoth AG arbeitet mit hoher Transparenz; das Vertrauen unserer Kunden ist uns wichtig. Diese Erklärung informiert, welche Daten diese Website verarbeitet und wie.</p>

  <h2 class="sub__reveal" data-en="Responsible party">Verantwortliche Stelle</h2>
  <address class="sub__reveal">
    IdeeRoth AG<br>
    Hafenstrasse 62<br>
    CH-8590 Romanshorn<br><br>
    <span data-en="Phone">Telefon</span>: <a href="tel:+41718558855">+41 71 855 88 55</a><br>
    E-Mail: <a href="mailto:datenschutz@iro.swiss">datenschutz@iro.swiss</a>
  </address>

  <h2 class="sub__reveal" data-en="Principle">Grundsatz</h2>
  <p class="sub__reveal" data-en="This website is a static information site. Without your consent we set no analytics cookies and no tracking. Fonts are self-hosted - no external font services are called. With your explicit consent we use Google Analytics for reach measurement (see the “Google Analytics” section). We only process personal data that you provide to us voluntarily, for example by e-mail or telephone.">Diese Website ist eine statische Informationsseite. Ohne Ihre Einwilligung setzen wir keine Analyse-Cookies und kein Tracking ein. Schriften sind selbst gehostet - es werden keine externen Schriftdienste aufgerufen. Mit Ihrer ausdrücklichen Einwilligung verwenden wir Google Analytics zur Reichweitenmessung (siehe Abschnitt „Google Analytics“). Personenbezogene Daten verarbeiten wir nur, wenn Sie uns diese freiwillig übermitteln, etwa per E-Mail oder Telefon.</p>

  <h2 class="sub__reveal" data-en="Server log files">Server-Logfiles</h2>
  <p class="sub__reveal" data-en="When you visit this website, our hosting provider automatically stores technical access data that your browser transmits, in so-called server log files:">Beim Besuch dieser Website speichert unser Hosting-Anbieter automatisch technische Zugriffsdaten, die Ihr Browser übermittelt, in sogenannten Server-Logfiles:</p>
  <ul class="sub__reveal">
    <li data-en="Name of the page accessed, date and time">Name der abgerufenen Seite, Datum und Uhrzeit</li>
    <li data-en="Amount of data transferred and message about successful access">Übertragene Datenmenge und Meldung über erfolgreichen Abruf</li>
    <li data-en="Browser type and version, operating system">Browsertyp und -version, Betriebssystem</li>
    <li data-en="Referrer URL and shortened IP address">Referrer-URL und (gekürzte) IP-Adresse</li>
  </ul>
  <p class="sub__reveal" data-en="These data are used solely for the technically secure operation, stability and optimisation of the website and are not merged with other data sources. Legal basis is our legitimate interest in the secure operation of the site.">Diese Daten werden ausschliesslich für den technisch sicheren Betrieb, die Stabilität und die Optimierung der Website verwendet und nicht mit anderen Datenquellen zusammengeführt. Rechtsgrundlage ist unser berechtigtes Interesse am sicheren Betrieb der Website.</p>

  <h2 class="sub__reveal" data-en="Hosting">Hosting</h2>
  <p class="sub__reveal" data-en="This website is hosted by a hosting provider in Switzerland. The provider processes the server log files described above on our behalf.">Diese Website wird bei einem Hosting-Anbieter in der Schweiz betrieben. Der Anbieter verarbeitet die oben beschriebenen Server-Logfiles in unserem Auftrag.</p>

  <h2 class="sub__reveal" data-en="Cookies and consent">Cookies und Einwilligung</h2>
  <p class="sub__reveal" data-en="On your first visit we ask for your consent via a notice. Only if you choose “Accept” are analytics cookies set and Google Analytics loaded. If you choose “Decline”, none of this happens. We store your choice locally in your browser. You can change or withdraw it at any time via the “Cookie settings” link in the footer.">Beim ersten Besuch fragen wir Sie über einen Hinweis um Ihre Einwilligung. Erst wenn Sie „Akzeptieren“ wählen, werden Analyse-Cookies gesetzt und Google Analytics geladen. Wählen Sie „Ablehnen“, geschieht nichts dergleichen. Ihre Wahl speichern wir lokal in Ihrem Browser. Sie können sie jederzeit über den Link „Cookie-Einstellungen“ im Footer ändern oder widerrufen.</p>

  <h2 class="sub__reveal" data-en="Google Analytics">Google Analytics</h2>
  <p class="sub__reveal" data-en="With your consent we use Google Analytics 4, a web analytics service of Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Ireland). Google Analytics uses cookies and similar technologies to evaluate the use of the website. The information generated (including a shortened IP address, page views, approximate location, device and browser) is transmitted to Google and stored there; this may involve a transfer to the USA. We have activated IP anonymisation.">Mit Ihrer Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irland). Google Analytics verwendet Cookies und ähnliche Technologien, um die Nutzung der Website auszuwerten. Die dabei erzeugten Informationen (u. a. gekürzte IP-Adresse, Seitenaufrufe, ungefährer Standort, Gerät und Browser) werden an Google übertragen und dort gespeichert; dabei kann eine Übermittlung in die USA erfolgen. Wir haben die IP-Anonymisierung aktiviert.</p>
  <p class="sub__reveal" data-en="The purpose is the statistical evaluation of website use to improve our offering. The legal basis is your consent (Art. 6(1)(a) GDPR and the Swiss Data Protection Act). You can withdraw your consent at any time with effect for the future via “Cookie settings” in the footer.">Zweck ist die statistische Auswertung der Websitenutzung zur Verbesserung unseres Angebots. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO bzw. das Schweizer Datenschutzgesetz). Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen - über „Cookie-Einstellungen“ im Footer.</p>
  <p class="sub__reveal">Google Opt-out-Add-on: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a> · <span data-en="Google privacy policy">Datenschutz bei Google</span>: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></p>

  <h2 class="sub__reveal" data-en="Contact by e-mail or phone">Kontaktaufnahme per E-Mail oder Telefon</h2>
  <p class="sub__reveal" data-en="If you contact us by e-mail or telephone, the details you provide (e.g. name, e-mail address, message) are stored for the purpose of handling your enquiry and any follow-up questions. We do not pass on these data without your consent.">Wenn Sie uns per E-Mail oder Telefon kontaktieren, werden Ihre Angaben (z. B. Name, E-Mail-Adresse, Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage sowie für allfällige Anschlussfragen gespeichert. Diese Daten geben wir ohne Ihre Einwilligung nicht weiter.</p>

  <h2 class="sub__reveal" data-en="Data security">Datensicherheit</h2>
  <p class="sub__reveal" data-en="This website is delivered encrypted via SSL/TLS (recognisable by the lock icon and “https” in the address bar). We take technical and organisational security measures to protect your data against loss, manipulation and unauthorised access.">Diese Website wird verschlüsselt via SSL/TLS ausgeliefert (erkennbar am Schloss-Symbol und „https“ in der Adresszeile). Wir treffen technische und organisatorische Sicherheitsmassnahmen, um Ihre Daten vor Verlust, Manipulation und unberechtigtem Zugriff zu schützen.</p>

  <h2 class="sub__reveal" data-en="Your rights">Ihre Rechte</h2>
  <p class="sub__reveal" data-en="You have the right to access, correction, deletion and restriction of the personal data stored about you, and you may object to processing at any time. To exercise these rights, please contact us:">Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der zu Ihrer Person gespeicherten Daten und können der Verarbeitung jederzeit widersprechen. Zur Ausübung dieser Rechte wenden Sie sich bitte an uns:</p>
  <p class="sub__reveal"><a href="mailto:datenschutz@iro.swiss">datenschutz@iro.swiss</a></p>

  <h2 class="sub__reveal" data-en="Amendments">Änderungen</h2>
  <p class="sub__reveal" data-en="We may adapt this privacy policy from time to time so that it always meets current legal requirements or reflects changes to our services. Your renewed visit is subject to the then-current version.">Wir können diese Datenschutzerklärung von Zeit zu Zeit anpassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder Änderungen unserer Leistungen abbildet. Für Ihren erneuten Besuch gilt die jeweils aktuelle Fassung.</p>
'''

PAGES = {
  'karriere.html': dict(title_de='Karriere - IdeeRoth AG', title_en='Careers - IdeeRoth AG',
    desc_de='Karriere und Berufsbildung bei der IdeeRoth AG in Romanshorn: offene Lehrstelle Konstrukteur/-in EFZ 2027 und Initiativbewerbungen willkommen.',
    desc_en='Careers and vocational training at IdeeRoth AG in Romanshorn: open apprenticeship Konstrukteur/-in EFZ 2027 and unsolicited applications welcome.', body=KARRIERE),
  'impressum.html': dict(title_de='Impressum - IdeeRoth AG', title_en='Legal notice - IdeeRoth AG',
    desc_de='Impressum der IdeeRoth AG, Hafenstrasse 62, 8590 Romanshorn.', desc_en='Legal notice of IdeeRoth AG, Hafenstrasse 62, 8590 Romanshorn.', body=IMPRESSUM),
  'datenschutz.html': dict(title_de='Datenschutzerklärung - IdeeRoth AG', title_en='Privacy policy - IdeeRoth AG',
    desc_de='Datenschutzerklärung der IdeeRoth AG: Server-Logfiles, Cookies und Einwilligung, Google Analytics nur mit Opt-in, Ihre Rechte.',
    desc_en='Privacy policy of IdeeRoth AG: server log files, cookies and consent, Google Analytics only with opt-in, your rights.', body=DATENSCHUTZ),
}
for f, d in PAGES.items():
    html = HEAD.format(file=f, **{k: v for k, v in d.items() if k != 'body'}) + d['body'] + FOOT
    with io.open(os.path.join(ROOT, f), 'w', encoding='utf-8') as fh: fh.write(html)
    print('wrote', f, len(html))
