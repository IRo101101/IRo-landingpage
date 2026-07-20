/* =========================================================================
   IdeeRoth AG — iro.swiss
   Sprache (Auto-Erkennung + Umschalter), Mobile-Nav, Scroll-Reveal.
   Kein externer Code, keine Abhängigkeiten. Läuft rein im Browser.
   ========================================================================= */
(function () {
  'use strict';

  var STORE_KEY = 'iro-lang';
  var SUPPORTED = ['de', 'en'];
  var titlePressure = null;   // Hero-Titel-Effekt (wird bei Sprachwechsel neu aufgebaut)

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

    // Hero-Titel nach Sprachwechsel neu in Zeichen zerlegen (Text-Pressure)
    if (titlePressure && titlePressure.refresh) titlePressure.refresh();
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
    var legal = document.querySelector('.footer__legal') || document.querySelector('.footer__bottom span:last-child');
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
  var MAP_LAT = 47.568190, MAP_LON = 9.382508, MAP_ZOOM = 16;

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

  /* ---- Hero-Effekte: Text-Pressure (Titel) + Pixel-Buttons ------------ */
  // Titel: in Ruhe dünn, unter dem Cursor dicker + grün, beim Wegfahren wieder dünn.
  function makeTitlePressure(el) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var MIN_W = 100, MAX_W = 900, REST_W = 600, SCALE_MAX = 1.05;
    var restE = (REST_W - MIN_W) / (MAX_W - MIN_W);
    var GREEN = [77, 175, 71], WHITE = [255, 255, 255];
    var accent = true, intensity = 0.6;
    var chars = [], mouse = { x: -9999, y: -9999 }, cur = { x: -9999, y: -9999 }, maxDist = 300;
    var press = 0, pressTarget = 0, over = false, raf = null;
    var stage = el.closest('.hero') || el;

    function split() {
      var text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      chars = [];
      var words = text.split(' ');
      words.forEach(function (word, wi) {
        var w = document.createElement('span'); w.className = 'tp-word';
        for (var i = 0; i < word.length; i++) {
          var c = document.createElement('span'); c.className = 'tp-char';
          c.textContent = word[i]; c.setAttribute('aria-hidden', 'true');
          w.appendChild(c); chars.push(c);
        }
        el.appendChild(w);
        if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }
    function recalc() { var r = el.getBoundingClientRect(); maxDist = Math.max(r.width, r.height) * 0.5; }
    function smooth(t) { t = t < 0 ? 0 : (t > 1 ? 1 : t); return t * t * (3 - 2 * t); }
    function paint() {
      for (var i = 0; i < chars.length; i++) {
        var c = chars[i], r = c.getBoundingClientRect();
        var d = Math.hypot(cur.x - (r.left + r.width * 0.5), cur.y - (r.top + r.height * 0.5));
        var lift = smooth(1 - d / maxDist) * press;
        var e = restE + (1 - restE) * intensity * lift;
        c.style.fontVariationSettings = "'wght' " + Math.round(MIN_W + (MAX_W - MIN_W) * e);
        c.style.transform = "scale(" + (1 + (SCALE_MAX - 1) * lift).toFixed(3) + ")";
        if (accent) {
          c.style.color = "rgb(" +
            Math.round(WHITE[0] + (GREEN[0] - WHITE[0]) * lift) + "," +
            Math.round(WHITE[1] + (GREEN[1] - WHITE[1]) * lift) + "," +
            Math.round(WHITE[2] + (GREEN[2] - WHITE[2]) * lift) + ")";
        } else { c.style.color = ''; }
      }
    }
    function loop() {
      cur.x += (mouse.x - cur.x) * 0.12; cur.y += (mouse.y - cur.y) * 0.12;
      press += (pressTarget - press) * (pressTarget > press ? 0.14 : 0.07);
      paint(); raf = requestAnimationFrame(loop);
    }
    function onMove(x, y) { mouse.x = x; mouse.y = y; }
    window.addEventListener('pointermove', function (e) { onMove(e.clientX, e.clientY); }, { passive: true });
    stage.addEventListener('pointermove', function (e) { over = true; pressTarget = 1; onMove(e.clientX, e.clientY); }, { passive: true });
    stage.addEventListener('pointerleave', function () { over = false; pressTarget = 0; });
    stage.addEventListener('touchstart', function (e) { over = true; pressTarget = 1; if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener('touchend', function () { over = false; pressTarget = 0; });
    window.addEventListener('resize', recalc);
    window.addEventListener('scroll', recalc, { passive: true });

    function staticRender() {
      for (var i = 0; i < chars.length; i++) {
        chars[i].style.fontVariationSettings = "'wght' 600";
        chars[i].style.transform = 'none'; chars[i].style.color = '';
      }
    }
    function introSweep() {
      var r = el.getBoundingClientRect(), t0 = null, dur = 1500, pad = r.width * 0.15;
      press = 1; pressTarget = 1;
      mouse.y = r.top + r.height * 0.5; cur.y = mouse.y; mouse.x = r.left - pad; cur.x = mouse.x;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = (ts - t0) / dur;
        if (p >= 1) { pressTarget = over ? 1 : 0; return; }
        var e = p * p * (3 - 2 * p);
        mouse.x = (r.left - pad) + (r.width + 2 * pad) * e; mouse.y = r.top + r.height * 0.5;
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function refresh() { split(); recalc(); if (reduce) staticRender(); }

    var startedTP = false;
    function go() {
      if (startedTP) return; startedTP = true;
      split(); recalc();
      mouse.x = -9999; mouse.y = -9999; cur.x = mouse.x; cur.y = mouse.y;
      if (reduce) { staticRender(); return; }
      raf = requestAnimationFrame(loop); introSweep();
    }
    // Start erst, wenn die variable Inter-Achse verfügbar ist (verhindert Flackern)
    if (document.fonts && document.fonts.load) {
      document.fonts.load("400 20px 'Inter'").then(go, go); setTimeout(go, 700);
    } else { go(); }
    return { refresh: refresh };
  }

  // Buttons: Pixel-Effekt beim Hover (Vanilla-Canvas, angelehnt an ReactBits PixelCard).
  function pxRand(a, b) { return Math.random() * (b - a) + a; }
  function makePixelCanvas(btn, colors, speed, gap) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.createElement('canvas'); canvas.className = 'px-canvas'; canvas.setAttribute('aria-hidden', 'true');
    btn.insertBefore(canvas, btn.firstChild);
    var ctx = canvas.getContext('2d'), pixels = [], raf = null, timePrev = 0, cssW = 0, cssH = 0;
    var effSpeed = Math.max(0, speed) * 0.001;
    function Pixel(x, y, color, delay) {
      this.x = x; this.y = y; this.color = color; this.speed = pxRand(0.1, 0.9) * effSpeed;
      this.size = 0; this.sizeStep = Math.random() * 0.4; this.minSize = 0.5; this.maxInt = 2;
      this.maxSize = pxRand(this.minSize, this.maxInt); this.delay = delay; this.counter = 0;
      this.counterStep = Math.random() * 4 + (cssW + cssH) * 0.02;
      this.isIdle = false; this.isReverse = false; this.isShimmer = false;
    }
    Pixel.prototype.draw = function () { var o = this.maxInt * 0.5 - this.size * 0.5; ctx.fillStyle = this.color; ctx.fillRect(this.x + o, this.y + o, this.size, this.size); };
    Pixel.prototype.appear = function () { this.isIdle = false; if (this.counter <= this.delay) { this.counter += this.counterStep; return; } if (this.size >= this.maxSize) { this.isShimmer = true; } if (this.isShimmer) { this.shimmer(); } else { this.size += this.sizeStep; } this.draw(); };
    Pixel.prototype.disappear = function () { this.isShimmer = false; this.counter = 0; if (this.size <= 0) { this.isIdle = true; return; } this.size -= 0.1; this.draw(); };
    Pixel.prototype.shimmer = function () { if (this.size >= this.maxSize) { this.isReverse = true; } else if (this.size <= this.minSize) { this.isReverse = false; } this.size += this.isReverse ? -this.speed : this.speed; };
    function build() {
      var r = btn.getBoundingClientRect(); cssW = Math.max(1, Math.floor(r.width)); cssH = Math.max(1, Math.floor(r.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cssW * dpr; canvas.height = cssH * dpr; canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); pixels = [];
      var g = Math.max(3, gap);
      for (var x = 0; x < cssW; x += g) { for (var y = 0; y < cssH; y += g) { pixels.push(new Pixel(x, y, colors[Math.floor(Math.random() * colors.length)], Math.hypot(x, y))); } }
    }
    function anim(fn) {
      raf = requestAnimationFrame(function () { anim(fn); });
      var now = performance.now(), passed = now - timePrev, interval = 1000 / 60;
      if (passed < interval) return;
      timePrev = now - (passed % interval);
      ctx.clearRect(0, 0, cssW, cssH);
      var idle = true;
      for (var i = 0; i < pixels.length; i++) { pixels[i][fn](); if (!pixels[i].isIdle) idle = false; }
      if (idle) { cancelAnimationFrame(raf); raf = null; }
    }
    function run(fn) { if (raf) cancelAnimationFrame(raf); raf = null; timePrev = 0; anim(fn); }
    btn.addEventListener('pointerenter', function () { run('appear'); });
    btn.addEventListener('pointerleave', function () { run('disappear'); });
    btn.addEventListener('focus', function () { run('appear'); });
    btn.addEventListener('blur', function () { run('disappear'); });
    var rt = null; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    build();
  }
  // Button-Beschriftungen in ein Label-Span kapseln (früh, damit Sprach-Logik + Canvas sauber sind)
  function prepareButtons() {
    var btns = document.querySelectorAll('.btn:not(.btn--link)');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      if (btn.closest('.consent')) continue;               // Consent-Buttons ausnehmen
      if (btn.querySelector('.btn__label')) continue;       // schon gekapselt (Hero im HTML)
      var span = document.createElement('span'); span.className = 'btn__label';
      while (btn.firstChild) { span.appendChild(btn.firstChild); }
      if (btn.hasAttribute('data-en')) { span.setAttribute('data-en', btn.getAttribute('data-en')); btn.removeAttribute('data-en'); }
      if (btn.hasAttribute('data-de')) { span.setAttribute('data-de', btn.getAttribute('data-de')); btn.removeAttribute('data-de'); }
      btn.appendChild(span);
    }
  }

  function initEffects() {
    var t = document.getElementById('hero-title');
    if (t) titlePressure = makeTitlePressure(t);
    // Pixel-Effekt auf allen Buttons (ausser Text-Links und Consent-Buttons)
    var btns = document.querySelectorAll('.btn:not(.btn--link)');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      if (btn.closest('.consent')) continue;
      var light = btn.classList.contains('btn--primary') || btn.classList.contains('btn--on-dark');
      var colors = light ? ['#eafae8', '#ffffff', '#bfe8bb'] : ['#4DAF47', '#69c162', '#2E7D2A'];
      makePixelCanvas(btn, colors, 36, 4);
    }
  }

  /* ---- Init ----------------------------------------------------------- */
  // Button-Labels kapseln, bevor die Sprache erstmals angewandt wird.
  prepareButtons();
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

    // Effekte: Hero-Text-Pressure + Pixel-Buttons (alle Seiten)
    initEffects();
  });
})();
