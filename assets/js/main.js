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
  });
})();
