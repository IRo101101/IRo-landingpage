/* =========================================================================
   IdeeRoth AG — iro.swiss
   Sprache (Auto-Erkennung + Umschalter), Mobile-Nav, Scroll-Reveal.
   Kein externer Code, keine Abhängigkeiten. Läuft rein im Browser.
   ========================================================================= */
(function () {
  'use strict';

  var STORE_KEY = 'iro-lang';
  var SUPPORTED = ['de', 'en'];

  // JS aktiv → erlaubt CSS, Reveal-Elemente zunächst zu verbergen.
  // Ohne JS greift diese Klasse nie und der Inhalt bleibt sichtbar.
  document.documentElement.classList.add('js');

  /* ---- Sprache bestimmen ---------------------------------------------- */
  function stored() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function save(lang) {
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }
  function detect() {
    var saved = stored();
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    // Browser-Sprache: beginnt sie mit "de" → Deutsch, sonst Englisch.
    var langs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < langs.length; i++) {
      if (String(langs[i]).toLowerCase().indexOf('de') === 0) return 'de';
    }
    return 'en';
  }

  /* ---- Übersetzbare Knoten anwenden ----------------------------------- */
  // Elemente mit data-en tragen die englische Fassung; die deutsche wird
  // beim ersten Lauf zwischengespeichert. <meta> tauscht content, sonst Text.
  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);

    var nodes = document.querySelectorAll('[data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var isMeta = el.tagName === 'META';
      if (!el.hasAttribute('data-de')) {
        el.setAttribute('data-de', isMeta ? (el.getAttribute('content') || '') : el.textContent);
      }
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-de');
      if (isMeta) { el.setAttribute('content', val); }
      else { el.textContent = val; }
    }

    // aria-label-Übersetzungen (data-en-label)
    var labelled = document.querySelectorAll('[data-en-label]');
    for (var j = 0; j < labelled.length; j++) {
      var l = labelled[j];
      if (!l.hasAttribute('data-de-label')) {
        l.setAttribute('data-de-label', l.getAttribute('aria-label') || '');
      }
      l.setAttribute('aria-label', lang === 'en' ? l.getAttribute('data-en-label') : l.getAttribute('data-de-label'));
    }

    // Umschalter-Zustand
    var btns = document.querySelectorAll('.lang__btn');
    for (var k = 0; k < btns.length; k++) {
      btns[k].setAttribute('aria-pressed', String(btns[k].getAttribute('data-lang') === lang));
    }
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) lang = 'de';
    applyLang(lang);
    if (persist) save(lang);
  }

  /* ---- Cookie-Consent + Google Analytics (Opt-in) --------------------- */
  // >>> HIER deine GA4-Mess-ID eintragen (Format G-XXXXXXXXXX). Solange der
  //     Platzhalter steht, wird Google Analytics NICHT geladen. <<<
  var GA_ID = 'G-P2GWBZFYTZ';
  var CONSENT_KEY = 'iro-consent';

  function consentGet() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function consentSet(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }
  function gaConfigured() { return /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX'; }
  function relocalize() { setLang(document.documentElement.getAttribute('lang') || 'de', false); }

  // Google Analytics erst NACH Einwilligung nachladen (kein Call vorher).
  function loadGA() {
    if (!gaConfigured() || window.__iroGA) return;
    window.__iroGA = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function buildBanner() {
    if (document.querySelector('.consent')) return;
    var wrap = document.createElement('div');
    wrap.className = 'consent';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Cookie-Hinweis');
    wrap.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text" data-en="We use Google Analytics to understand how our website is used - only with your consent. You can withdraw your choice at any time via “Cookie settings” in the footer.">' +
        'Wir verwenden Google Analytics, um die Nutzung unserer Website zu verstehen - nur mit Ihrer Einwilligung. Sie können Ihre Wahl jederzeit über „Cookie-Einstellungen“ im Footer widerrufen.</p>' +
        '<div class="consent__actions">' +
          '<a class="consent__more" href="/datenschutz.html" data-en="Privacy policy">Datenschutzerklärung</a>' +
          '<button class="btn btn--ghost" type="button" data-consent="deny" data-en="Decline">Ablehnen</button>' +
          '<button class="btn btn--primary" type="button" data-consent="allow" data-en="Accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    wrap.querySelector('[data-consent="allow"]').addEventListener('click', function () { consentSet('granted'); loadGA(); wrap.remove(); });
    wrap.querySelector('[data-consent="deny"]').addEventListener('click', function () { consentSet('denied'); wrap.remove(); });
  }

  function initConsent() {
    // Footer-Link „Cookie-Einstellungen" (Widerruf jederzeit) injizieren
    var legal = document.querySelector('.footer__bottom span:last-child');
    if (legal && !legal.querySelector('[data-cookie-settings]')) {
      var a = document.createElement('a');
      a.href = '#';
      a.setAttribute('data-cookie-settings', '');
      a.setAttribute('data-en', 'Cookie settings');
      a.textContent = 'Cookie-Einstellungen';
      legal.appendChild(a);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var b = document.querySelector('.consent'); if (b) b.remove();
        consentSet('');
        buildBanner();
        relocalize();
      });
    }
    var c = consentGet();
    if (c === 'granted') { loadGA(); }
    else if (c !== 'denied') { buildBanner(); }
    relocalize();
  }

  /* ---- Karte (Leaflet + dunkle Kacheln, lazy) ------------------------- */
  // Standort IdeeRoth AG. Feinjustierung: nur diese zwei Werte anpassen.
  var MAP_LAT = 47.5645, MAP_LON = 9.3810, MAP_ZOOM = 16;

  function initMap() {
    var el = document.getElementById('iro-map');
    if (!el || !window.L || el.__init) return;

    function build() {
      if (el.__init) return; el.__init = true;
      var map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([MAP_LAT, MAP_LON], MAP_ZOOM);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>'
      }).addTo(map);
      var pin = L.divIcon({
        className: 'iro-pin',
        html: '<svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg"><path d="M20 1C10 1 2 9 2 19c0 14 18 32 18 32s18-18 18-32C38 9 30 1 20 1z" fill="#4DAF47" stroke="#fff" stroke-width="2"/><circle cx="20" cy="19" r="7" fill="#fff"/></svg>',
        iconSize: [40, 52], iconAnchor: [20, 51], popupAnchor: [0, -46]
      });
      L.marker([MAP_LAT, MAP_LON], { icon: pin, title: 'IdeeRoth AG', keyboard: false })
        .addTo(map)
        .bindPopup('<strong>IdeeRoth AG</strong><br>Hafenstrasse 62<br>8590 Romanshorn');
      // Mausrad-Zoom erst nach Klick/Fokus (blockiert das Seiten-Scrollen nicht)
      map.on('focus', function () { map.scrollWheelZoom.enable(); });
      map.on('blur', function () { map.scrollWheelZoom.disable(); });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { build(); io.disconnect(); } });
      }, { rootMargin: '250px' });
      io.observe(el);
    } else { build(); }
  }

  /* ---- Init ----------------------------------------------------------- */
  // So früh wie möglich anwenden (Attribut auf <html> setzt Basissprache).
  setLang(detect(), false);

  document.addEventListener('DOMContentLoaded', function () {
    setLang(document.documentElement.getAttribute('lang') || 'de', false);

    // Sprachumschalter
    var langBtns = document.querySelectorAll('.lang__btn');
    for (var i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'), true);
      });
    }

    // Mobile-Navigation
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav__toggle');
    if (nav && toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('nav--open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      var links = nav.querySelectorAll('.nav__link');
      for (var n = 0; n < links.length; n++) {
        links[n].addEventListener('click', function () {
          nav.classList.remove('nav--open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    }

    // Footer-Jahr
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    // Scroll-Reveal
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      for (var r = 0; r < reveals.length; r++) io.observe(reveals[r]);
    } else {
      for (var s = 0; s < reveals.length; s++) reveals[s].classList.add('is-in');
    }

    // Cookie-Consent + Google Analytics (Opt-in)
    initConsent();

    // Karte
    initMap();
  });
})();
