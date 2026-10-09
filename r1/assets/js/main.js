/* =========================================================================
   IdeeRoth AG - iro.swiss - v2
   Feder-Engine (Spring), gemeinsamer Ticker, Wort-fuer-Wort-Text, Ladepanel,
   Boden- und Header-Beobachter, Sektionen, Sprache (DE/EN), Consent (GA4).
   Kein externer Code ausser Lenis (lokal gehostet, globales `Lenis`).
   ========================================================================= */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement, win = window;
  root.classList.add('js');

  var RM = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VW = function () { return win.innerWidth; };
  var VH = function () { return win.innerHeight; };
  var isTouchOnly = win.matchMedia && win.matchMedia('(hover: none)').matches;

  /* ---- Feste Parameter (Northwall-Vorlage) ---------------------------- */
  var HOLD_AT = 0.72, MAX_WAIT = 4000, WARM_BUDGET = 3000;
  var CARD_LEAD = 180, CARD_INTERVAL = 240, FINALE_HOLD = 280, RELEASE_AT = 0.35;
  var FILL = { tension: 15, friction: 15 };        // r1: Hochzaehlen doppelt so lang wie in der Vorlage (60/30)
  var FINISH = { tension: 37.5, friction: 15, clamp: true };   // r1: doppelt (150/30)
  var HANDOFF = { tension: 210, friction: 34, clamp: true };
  var CARD = { tension: 190, friction: 24 };
  var EXPAND = { tension: 80, friction: 16, clamp: true };
  var LEAVE = { tension: 320, friction: 30, clamp: true };

  var ENTRY_DELAY = 180, ENTRY_STAGGER = 110;
  var GROUND = { tension: 22.5, friction: 13 };     // r1: Bodenwechsel doppelt so lang wie in der Vorlage (90/26), beide Richtungen gleich - ab 768 px
  var GROUND_MOBILE = { tension: 170, friction: 26 }; // r1: unter 768 px glaettet diese Feder nur den scroll-gekoppelten Farbverlauf (siehe initGround)
  var MID_LINE = 0.5, MID_LINE_MOBILE = 0.65;        // r1: Testlinie fuer Boden und Header-Thema (Anteil der Viewporthoehe), unter 768 px bei 65 %
  var FLOW = { tension: 110, friction: 26 };
  var PARALLAX = { tension: 120, friction: 26 };
  var HEAD = { tension: 180, friction: 26 }, HEAD_STAGGER = 55;
  var COPY = { tension: 210, friction: 28 }, COPY_STAGGER = 22;
  var REVEAL = { tension: 210, friction: 28 };
  var COUNT = { tension: 90, friction: 34 };
  var ROLL = { tension: 260, friction: 26 };
  var SWAP = { tension: 300, friction: 26 };
  var CORNER = { tension: 300, friction: 22 };
  var BURGER = { tension: 320, friction: 26 };

  var HERO_INTRO_DELAY = 120, TAGLINE_DELAY = 160, TAGLINE_STAGGER = 90, LINKS_DELAY = 320;
  var LINK_FILL = { tension: 240, friction: 30 };

  var START_DELAY = 450, STEP_INTERVAL = 520, TOPIC_DIM = 0.55;
  var FADE = { tension: 420, friction: 38 };
  var TOPIC = { tension: 260, friction: 30 };
  var BUTTON = { tension: 420, friction: 30 };

  var MASK_STAGGER = 180, LABEL_AFTER_MASK = 420, DRIFTS = [90, 55, 55, 90];
  var MASK = { tension: 70, friction: 24, clamp: true };
  var SETTLE = { tension: 60, friction: 26 };
  var LABEL = { tension: 190, friction: 28 };

  var AUTO_STEP_MS = 3800, MAX_TILT = 12, MAX_DEPTH = 18, DIM_OPACITY = 0.45, DIM_BLUR = 2.5;   // r1: Hintergrundzeilen lesbarer (Vorlage 0.3 / 5 px)
  var STAGE_DRIFT = 70, STAGE_DRIFT_MOBILE = 20;    // r1: Parallaxe der Prozess-Buehne (+-px), unter 768 px kleiner
  var LAST_TILT = 30, TILT_STEP = 10;
  var TILT = { tension: 150, friction: 24 };
  var STEPC = { tension: 220, friction: 30 };
  var SWAP_IMG = { tension: 320, friction: 34 };
  var TURN = { tension: 170, friction: 22 };

  var ROW_STAGGER = 220;
  var ROW_REVEAL = { tension: 55, friction: 22 };
  var SLIDE = { tension: 480, friction: 42 };

  var MD = 768, LG = 1024, XL = 1440;
  var CLOSE_DELAY = 260;

  /* ---- Root-Schriftgroesse ueber 1440 daempfen ------------------------ */
  function fitRoot() {
    var w = VW();
    root.style.fontSize = w > XL ? (16 * (1 + (w - XL) / XL * 0.5)) + 'px' : '';
  }
  fitRoot();
  win.addEventListener('resize', fitRoot);

  /* =====================================================================
     1. Feder-Loeser
     ===================================================================== */
  var STEP = 1 / 60;
  function advance(s, dt) {
    if (RM) { s.value = s.target; s.velocity = 0; return true; }
    var acc = Math.min(dt, 0.064);
    while (acc > 0) {
      var h = Math.min(STEP, acc);
      var force = -s.tension * (s.value - s.target);
      var damp = -s.friction * s.velocity;
      s.velocity += (force + damp) * h;
      s.value += s.velocity * h;
      acc -= h;
    }
    if (s.clamp && ((s.velocity > 0 && s.value > s.target) || (s.velocity < 0 && s.value < s.target))) {
      s.value = s.target; s.velocity = 0;
    }
    if (Math.abs(s.value - s.target) < 0.0005 && Math.abs(s.velocity) < 0.0005) {
      s.value = s.target; s.velocity = 0; return true;
    }
    return false;
  }

  /* =====================================================================
     2. Ein Ticker
     ===================================================================== */
  var ticker = (function () {
    var items = [], running = false, last = 0;
    function loop(now) {
      if (!items.length) { running = false; return; }
      var dt = last ? (now - last) / 1000 : 1 / 60; last = now;
      var list = items.slice();
      for (var i = 0; i < list.length; i++) {
        var it = list[i];
        if (it.interval) {
          if (now - it.last < it.interval) continue;
          var d = it.last ? (now - it.last) / 1000 : dt; it.last = now;
          if (it.fn(d, now) === false) remove(it);
        } else if (it.fn(dt, now) === false) remove(it);
      }
      requestAnimationFrame(loop);
    }
    function remove(it) { var k = items.indexOf(it); if (k !== -1) items.splice(k, 1); }
    function add(fn, interval) {
      var it = { fn: fn, interval: interval || 0, last: 0 };
      items.push(it);
      if (!running) { running = true; last = 0; requestAnimationFrame(loop); }
      return it;
    }
    return { add: add, remove: remove };
  })();

  /* =====================================================================
     Feder-Gruppe: mehrere Kanaele, schreibt style pro Frame
     ===================================================================== */
  var UNIT = /^(-?[\d.]+)(%|px|deg)?$/;
  function parseVal(v) {
    if (typeof v === 'number') return { n: v, u: '' };
    if (Array.isArray(v)) return { arr: v.slice() };
    if (typeof v === 'string') {
      var m = UNIT.exec(v.trim());
      if (m) return { n: parseFloat(m[1]), u: m[2] || '' };
      var c = parseColor(v); if (c) return { arr: c, color: true };
    }
    return { n: 0, u: '' };
  }
  function parseColor(str) {
    var m = /^#([0-9a-f]{6})$/i.exec(str.trim());
    if (m) { var h = m[1]; return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
    m = /^rgba?\(([^)]+)\)$/i.exec(str.trim());
    if (m) { return m[1].split(',').slice(0, 3).map(function (x) { return parseFloat(x); }); }
    return null;
  }

  function Group(el, opts) {
    if (!el) { console.warn('Group: Element fehlt', new Error().stack); el = doc.createElement('span'); }
    this.el = el; this.cfg = opts.config || { tension: 170, friction: 26 };
    this.channels = {}; this.units = {}; this.kinds = {};
    this.active = false; this.tick = null; this.onRest = null;
    this.set(opts.from || {});
  }
  Group.prototype._chan = function (name, val) {
    var p = parseVal(val), ch = this.channels[name];
    if (p.arr) {
      if (!ch) { ch = this.channels[name] = p.arr.map(function (n) { return { value: n, velocity: 0, target: n }; }); this.kinds[name] = p.color ? 'color' : 'arr'; }
      return { ch: ch, p: p };
    }
    if (!ch) { ch = this.channels[name] = { value: p.n, velocity: 0, target: p.n }; this.kinds[name] = 'num'; }
    if (p.u) this.units[name] = p.u; else if (!this.units[name]) this.units[name] = '';
    return { ch: ch, p: p };
  };
  Group.prototype.set = function (state) {           // sofort
    for (var k in state) {
      var r = this._chan(k, state[k]);
      if (r.p.arr) { for (var i = 0; i < r.ch.length; i++) { r.ch[i].value = r.ch[i].target = r.p.arr[i]; r.ch[i].velocity = 0; } }
      else { r.ch.value = r.ch.target = r.p.n; r.ch.velocity = 0; }
    }
    this.write();
    return this;
  };
  Group.prototype.to = function (state, config, onRest) {
    if (config) this.cfg = config;
    if (onRest !== undefined) this.onRest = onRest;
    for (var k in state) {
      var r = this._chan(k, state[k]);
      if (r.p.arr) { for (var i = 0; i < r.ch.length; i++) r.ch[i].target = r.p.arr[i]; }
      else r.ch.target = r.p.n;
    }
    this.start();
    return this;
  };
  Group.prototype.start = function () {
    if (this.active) return;
    var self = this; this.active = true;
    this.tick = ticker.add(function (dt) {
      var rest = true;
      for (var k in self.channels) {
        var ch = self.channels[k];
        if (Array.isArray(ch)) { for (var i = 0; i < ch.length; i++) { ch[i].tension = self.cfg.tension; ch[i].friction = self.cfg.friction; ch[i].clamp = self.cfg.clamp; if (!advance(ch[i], dt)) rest = false; } }
        else { ch.tension = self.cfg.tension; ch.friction = self.cfg.friction; ch.clamp = self.cfg.clamp; if (!advance(ch, dt)) rest = false; }
      }
      self.write();
      if (rest) { self.active = false; self.tick = null; if (self.onRest) { var f = self.onRest; self.onRest = null; f(); } return false; }
    });
  };
  Group.prototype.get = function (name) { var ch = this.channels[name]; return ch && !Array.isArray(ch) ? ch.value : 0; };
  Group.prototype.write = function () {
    var s = this.el.style, c = this.channels, u = this.units, t = '';
    if (c.x || c.y) t += 'translate3d(' + (c.x ? c.x.value + (u.x || 'px') : '0') + ',' + (c.y ? c.y.value + (u.y || 'px') : '0') + ',0) ';
    if (c.rotate) t += 'rotate(' + c.rotate.value + 'deg) ';
    if (c.rotateX) t += 'rotateX(' + c.rotateX.value + 'deg) ';
    if (c.rotateY) t += 'rotateY(' + c.rotateY.value + 'deg) ';
    if (c.scale) t += 'scale(' + c.scale.value + ') ';
    if (c.scaleX) t += 'scaleX(' + c.scaleX.value + ') ';
    if (c.scaleY) t += 'scaleY(' + c.scaleY.value + ') ';
    if (t) s.transform = t;
    if (c.opacity) s.opacity = c.opacity.value;
    if (c.blur) s.filter = 'blur(' + Math.max(0, c.blur.value) + 'px)';
    if (c.clip) s.clipPath = 'inset(' + c.clip.map(function (x) { return Math.max(0, x.value) + '%'; }).join(' ') + ')';
    if (c.bg) s.backgroundColor = 'rgb(' + c.bg.map(function (x) { return Math.round(x.value); }).join(',') + ')';
    if (c.left) s.left = c.left.value + 'px';
    if (c.top) s.top = c.top.value + 'px';
    if (c.width) s.width = c.width.value + 'px';
    if (c.height) s.height = c.height.value + 'px';
    if (c.fill) s.clipPath = 'inset(' + ((1 - c.fill.value) * 100) + '% 0 0 0)';
  };

  /* =====================================================================
     3. Die vier Verhalten
     ===================================================================== */
  function delay(ms, fn) { if (RM) ms = 0; return setTimeout(fn, ms); }

  // o.watch: beobachtetes Element (Chrome rechnet clip-path des Ziels in die Sichtbarkeit ein,
  // darum wird bei maskierten Elementen der unmaskierte Elternknoten beobachtet).
  function Inview(el, o) {
    var g = new Group(el, { from: o.from, config: o.config }), shown = false, watch = o.watch || el;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          if (shown && o.once !== false) return;
          shown = true;
          delay(o.delayIn || 0, function () { g.to(o.to, o.config, o.onIn); });
          if (o.once !== false) io.unobserve(watch);
        } else if (o.once === false && shown) { shown = false; g.to(o.from, o.config); }
      });
    }, { threshold: o.threshold || 0, rootMargin: o.rootMargin || '0px' });
    io.observe(watch);
    return g;
  }

  function Hover(el, trigger, o) {
    var g = new Group(el, { from: o.from, config: o.config });
    if (VW() <= MD || isTouchOnly) { g.set(o.to); return g; }
    var on = function () { g.to(o.to); }, off = function () { g.to(o.from); };
    trigger.addEventListener('pointerenter', on); trigger.addEventListener('pointerleave', off);
    trigger.addEventListener('focusin', on); trigger.addEventListener('focusout', off);
    return g;
  }

  function Spring(el, o) { return new Group(el, { from: o.from, config: o.config }); }

  // start/end: "<Element-Kante> <Viewport-Kante>"
  function edgePos(el, spec) {
    var r = el.getBoundingClientRect(), p = spec.split(' ');
    var elEdge = p[0] === 'top' ? r.top : r.bottom;
    var vpEdge = p[1] === 'top' ? 0 : VH();
    return elEdge - vpEdge;           // 0 = Moment erreicht
  }
  function lerpState(from, to, t) {
    var out = {};
    for (var k in from) {
      var a = parseVal(from[k]), b = parseVal(to[k]);
      out[k] = (a.n + (b.n - a.n) * t) + (a.u || b.u || '');
    }
    return out;
  }
  // o.ref: Element, dessen Kanten den Scrollweg bestimmen (Standard: el selbst). Noetig, wenn el ein ueberstehender
  // Layer ist (Hero-Foto 130 % hoch): sonst liegt sein Anfang schon ueber dem Viewport und die Parallaxe startet bei
  // Scrollposition 0 nicht bei 0 - das Foto stand 5 % tiefer als die Finale-Karte, der Sprung am Ende des Ladens.
  function Scrub(el, o) {
    var g = new Group(el, { from: o.from, config: o.config }), lastT = -1, ref = o.ref || el;
    ticker.add(function () {
      var a = edgePos(ref, o.start), b = edgePos(ref, o.end);
      var t = b === a ? 0 : Math.min(1, Math.max(0, a / (a - b)));
      if (t !== lastT) { lastT = t; g.to(lerpState(o.from, o.to, t)); }
    }, o.frameInterval || 32);
    return g;
  }

  /* =====================================================================
     4. Wort-fuer-Wort-Engine
     ===================================================================== */
  var HEAD_IN = { y: '0%', opacity: 1, scale: 1 }, HEAD_OUT = { y: '80%', opacity: 0, scale: 0.9 };
  var COPY_IN = { y: '0%', opacity: 1, scale: 1 }, COPY_OUT = { y: '60%', opacity: 0, scale: 0.94 };

  function Words(el, o) {
    o = o || {};
    var preset = o.preset || el.getAttribute('data-words') || 'copy';
    var self = this;
    this.el = el; this.groups = []; this.shown = false; this.mode = o.mode || 'once';
    this.stagger = o.stagger || (preset === 'head' ? HEAD_STAGGER : COPY_STAGGER);
    this.cfg = o.config || (preset === 'head' ? HEAD : COPY);
    this.IN = o.wordIn || (preset === 'head' ? HEAD_IN : COPY_IN);
    this.OUT = o.wordOut || (preset === 'head' ? HEAD_OUT : COPY_OUT);
    this.indent = el.hasAttribute('data-indent');
    el.classList.add('words');
    this.setText(el.textContent);
    el.__setText = function (t) { self.setText(t); };
    if (o.manual) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { if (!self.shown) self.play(o.delayIn || 0); if (self.mode === 'once') io.unobserve(el); }
        else if (self.mode === 'always' && self.shown) self.reset();
      });
    }, { threshold: 0.05 });
    io.observe(el);
  }
  Words.prototype.setText = function (text) {
    var el = this.el, self = this;
    this.text = text.trim();
    el.__getText = function () { return self.text; };
    el.textContent = '';
    this.groups = [];
    if (this.indent) { var sp = doc.createElement('span'); sp.className = 'words__indent'; sp.setAttribute('aria-hidden', 'true'); el.appendChild(sp); }
    // Leerzeichen haengt am Wort (white-space: pre) - nie leere Textknoten zwischen den Spans,
    // sonst lesen Crawler die Woerter zusammengeklebt.
    var words = this.text.split(/\s+/);
    words.forEach(function (w, i) {
      var clip = doc.createElement('span'); clip.className = 'w';
      var inner = doc.createElement('span'); inner.className = 'w__i'; inner.textContent = i < words.length - 1 ? w + ' ' : w;
      clip.appendChild(inner); el.appendChild(clip);
      var g = new Group(inner, { from: self.shown ? self.IN : self.OUT, config: self.cfg });
      self.groups.push(g);
    });
  };
  Words.prototype.play = function (d) {
    var self = this; this.shown = true;
    delay(d || 0, function () {
      self.groups.forEach(function (g, i) { delay(i * self.stagger, function () { g.to(self.IN, self.cfg); }); });
    });
  };
  Words.prototype.reset = function () { var self = this; this.shown = false; this.groups.forEach(function (g) { g.set(self.OUT); }); };
  Words.prototype.show = function () { var self = this; this.shown = true; this.groups.forEach(function (g) { g.set(self.IN); }); };

  /* =====================================================================
     Interaktions-Primitive: RollLabel, SwapArrow, ArrowLink, Ecken, Zaehler
     ===================================================================== */
  var ARROW_SVG = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square"/></svg>';

  function RollLabel(el, trigger) {
    var text = el.textContent.trim();
    el.classList.add('roll'); el.textContent = '';
    var a = doc.createElement('span'); a.className = 'roll__a'; a.textContent = text;
    var b = doc.createElement('span'); b.className = 'roll__b'; b.textContent = text; b.setAttribute('aria-hidden', 'true');
    el.appendChild(a); el.appendChild(b);
    el.__setText = function (t) { a.textContent = t; b.textContent = t; };
    el.__getText = function () { return a.textContent; };
    var ga = new Group(a, { from: { y: '0%' }, config: ROLL }), gb = new Group(b, { from: { y: '100%' }, config: ROLL });
    if (VW() <= MD || isTouchOnly) return;
    trigger = trigger || el;
    var on = function () { ga.to({ y: '-100%' }); gb.to({ y: '0%' }); }, off = function () { ga.to({ y: '0%' }); gb.to({ y: '100%' }); };
    trigger.addEventListener('pointerenter', on); trigger.addEventListener('pointerleave', off);
    trigger.addEventListener('focusin', on); trigger.addEventListener('focusout', off);
  }
  function SwapArrow(el, trigger) {
    el.classList.add('swap'); el.innerHTML = '<span class="swap__a">' + ARROW_SVG + '</span><span class="swap__b">' + ARROW_SVG + '</span>';
    var a = el.firstChild, b = el.lastChild;
    var ga = new Group(a, { from: { x: 0 }, config: SWAP }), gb = new Group(b, { from: { x: -16 }, config: SWAP });
    if (VW() <= MD || isTouchOnly) return;
    trigger = trigger || el;
    var on = function () { ga.to({ x: 16 }); gb.to({ x: 0 }); }, off = function () { ga.to({ x: 0 }); gb.to({ x: -16 }); };
    trigger.addEventListener('pointerenter', on); trigger.addEventListener('pointerleave', off);
    trigger.addEventListener('focusin', on); trigger.addEventListener('focusout', off);
  }
  function ArrowLink(el) {
    var label = el.querySelector('.al__label');
    if (label) { var g = new Group(label, { from: { x: 0 }, config: SWAP }); if (!(VW() <= MD || isTouchOnly)) { el.addEventListener('pointerenter', function () { g.to({ x: 4 }); }); el.addEventListener('pointerleave', function () { g.to({ x: 0 }); }); } }
    var arrow = el.querySelector('.al__arrow'); if (arrow) SwapArrow(arrow, el);
  }
  function Corners(box, variant, trigger) {
    var names = variant === 'edge' ? ['tl', 'bl'] : ['tl', 'tr', 'bl', 'br'];
    var gs = names.map(function (n) {
      var m = doc.createElement('i'); m.className = 'mk mk--' + n; m.setAttribute('aria-hidden', 'true'); box.appendChild(m);
      return { n: n, g: new Group(m, { from: { x: 0, y: 0 }, config: CORNER }) };
    });
    if (!trigger || VW() <= MD || isTouchOnly) return;
    var dir = { tl: [-3, -3], tr: [3, -3], bl: [-3, 3], br: [3, 3] };
    trigger.addEventListener('pointerenter', function () { gs.forEach(function (c) { c.g.to({ x: dir[c.n][0], y: dir[c.n][1] }); }); });
    trigger.addEventListener('pointerleave', function () { gs.forEach(function (c) { c.g.to({ x: 0, y: 0 }); }); });
    trigger.addEventListener('focusin', function () { gs.forEach(function (c) { c.g.to({ x: dir[c.n][0], y: dir[c.n][1] }); }); });
    trigger.addEventListener('focusout', function () { gs.forEach(function (c) { c.g.to({ x: 0, y: 0 }); }); });
  }

  function Counter(el) {
    var NUM = /-?\d+(?:[.,]\d+)?/, spring = { value: 0, velocity: 0, target: 0, tension: COUNT.tension, friction: COUNT.friction }, parts, latched = false, running = false;
    function parse(text) {
      var m = NUM.exec(text);
      if (!m) { parts = { pre: text, val: 0, suf: '', dec: 0, sep: '' }; return; }
      var raw = m[0], dec = raw.indexOf('.') !== -1 || raw.indexOf(',') !== -1 ? 1 : 0;
      parts = { pre: text.slice(0, m.index), val: parseFloat(raw.replace(',', '.')), suf: text.slice(m.index + raw.length), dec: dec, sep: raw.indexOf(',') !== -1 ? ',' : '.' };
    }
    function render(v) { var s = v.toFixed(parts.dec).replace('.', parts.sep); el.textContent = parts.pre + s + parts.suf; }
    var source = el.textContent;
    parse(source);
    el.setAttribute('aria-label', source);
    render(0);
    el.__getText = function () { return source; };
    el.__setText = function (t) { source = t; parse(t); el.setAttribute('aria-label', t); render(latched && !running ? parts.val : spring.value); if (running) spring.target = parts.val; };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || latched) return;
        latched = true; io.unobserve(el); running = true;
        spring.target = parts.val;
        ticker.add(function (dt) { var r = advance(spring, dt); render(spring.value); if (r) { running = false; return false; } });
      });
    }, { threshold: 0.5 });
    io.observe(el);
  }

  /* =====================================================================
     Sprache (DE Default, EN in data-en) - wie v1, mit Komponenten-Hook
     ===================================================================== */
  var STORE_KEY = 'iro-lang', SUPPORTED = ['de', 'en'];
  function stored() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(STORE_KEY, l); } catch (e) {} }
  function detect() {
    var s = stored(); if (s && SUPPORTED.indexOf(s) !== -1) return s;
    var langs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < langs.length; i++) if (String(langs[i]).toLowerCase().indexOf('de') === 0) return 'de';
    return 'en';
  }
  var langListeners = [];
  function applyLang(lang) {
    root.setAttribute('lang', lang);
    var nodes = doc.querySelectorAll('[data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i], isMeta = el.tagName === 'META';
      if (!el.hasAttribute('data-de')) el.setAttribute('data-de', isMeta ? (el.getAttribute('content') || '') : (el.__getText ? el.__getText() : el.textContent));
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-de');
      if (isMeta) el.setAttribute('content', val);
      else if (el.__setText) el.__setText(val);
      else el.textContent = val;
    }
    var labelled = doc.querySelectorAll('[data-en-label]');
    for (var j = 0; j < labelled.length; j++) {
      var l = labelled[j];
      if (!l.hasAttribute('data-de-label')) l.setAttribute('data-de-label', l.getAttribute('aria-label') || '');
      l.setAttribute('aria-label', lang === 'en' ? l.getAttribute('data-en-label') : l.getAttribute('data-de-label'));
    }
    var codes = doc.querySelectorAll('[data-lang-code]');
    for (var k = 0; k < codes.length; k++) codes[k].textContent = lang.toUpperCase();
    var opts = doc.querySelectorAll('[data-lang]');
    for (var m = 0; m < opts.length; m++) opts[m].setAttribute('aria-current', opts[m].getAttribute('data-lang') === lang ? 'true' : 'false');
    langListeners.forEach(function (f) { f(lang); });
  }
  function setLang(lang, persist) { if (SUPPORTED.indexOf(lang) === -1) lang = 'de'; applyLang(lang); if (persist) save(lang); }
  function currentLang() { return root.getAttribute('lang') || 'de'; }

  /* =====================================================================
     Consent + Google Analytics (Opt-in) - wie v1
     ===================================================================== */
  var GA_ID = 'G-P2GWBZFYTZ', CONSENT_KEY = 'iro-consent';
  function consentGet() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function consentSet(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }
  function loadGA() {
    if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || win.__iroGA) return;
    win.__iroGA = true;
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () { win.dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
    var s = doc.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    doc.head.appendChild(s);
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  function buildBanner() {
    if (doc.querySelector('.consent')) return;
    var wrap = doc.createElement('div');
    wrap.className = 'consent'; wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-label', 'Cookie-Hinweis');
    wrap.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text" data-en="We use Google Analytics to understand how our website is used - only with your consent. You can withdraw your choice at any time via “Cookie settings” in the footer.">' +
        'Wir verwenden Google Analytics, um die Nutzung unserer Website zu verstehen - nur mit Ihrer Einwilligung. Sie können Ihre Wahl jederzeit über „Cookie-Einstellungen“ im Footer widerrufen.</p>' +
        '<div class="consent__actions">' +
          '<a class="consent__more" href="datenschutz.html" data-en="Privacy policy">Datenschutzerklärung</a>' +
          '<button class="cbtn cbtn--ghost" type="button" data-consent="deny" data-en="Decline">Ablehnen</button>' +
          '<button class="cbtn cbtn--solid" type="button" data-consent="allow" data-en="Accept">Akzeptieren</button>' +
        '</div></div>';
    doc.body.appendChild(wrap);
    wrap.querySelector('[data-consent="allow"]').addEventListener('click', function () { consentSet('granted'); loadGA(); wrap.remove(); });
    wrap.querySelector('[data-consent="deny"]').addEventListener('click', function () { consentSet('denied'); wrap.remove(); });
    applyLang(currentLang());
  }
  function initConsent() {
    var links = doc.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) links[i].addEventListener('click', function (e) {
      e.preventDefault(); var b = doc.querySelector('.consent'); if (b) b.remove(); consentSet(''); buildBanner();
    });
    var c = consentGet();
    if (c === 'granted') loadGA(); else if (c !== 'denied') buildBanner();
  }

  /* =====================================================================
     Lenis (lokal) + Anker
     ===================================================================== */
  var lenis = null;
  function initLenis() {
    if (!win.Lenis || RM) return;
    lenis = new win.Lenis({ smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  function scrollToHash(hash) {
    var target = hash && hash.length > 1 ? doc.querySelector(hash) : null;
    if (!target) return false;
    if (lenis) lenis.scrollTo(target, { offset: 0 }); else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    return true;
  }
  function initAnchors() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var h = a.getAttribute('href'); if (h === '#') return;
      if (!doc.querySelector(h)) return;
      e.preventDefault();
      closeMenu();                       // zuerst Lenis wieder starten, sonst ignoriert es scrollTo
      scrollToHash(h);
    });
  }

  /* =====================================================================
     Boden (fixer Hintergrund) und Header-Thema
     ===================================================================== */
  var DARK = '#111418', LIGHT = '#E7FFF2';
  function midLine() { return VH() * (VW() < MD ? MID_LINE_MOBILE : MID_LINE); }
  function sectionAtMid(attr) {
    var secs = doc.querySelectorAll('[' + attr + ']'), mid = midLine();
    for (var i = secs.length - 1; i >= 0; i--) {                       // rueckwaerts
      var r = secs[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) return secs[i];
    }
    return null;
  }
  function initGround() {
    var g = doc.querySelector('[data-ground-layer]'); if (!g) return;
    var first = doc.querySelector('[data-ground]');
    var cur = first ? first.getAttribute('data-ground') : 'light';
    var grp = new Group(g, { from: { bg: cur === 'dark' ? DARK : LIGHT }, config: GROUND });
    root.setAttribute('data-ground-now', cur);
    // r1: aktuelle Bodenfarbe als CSS-Variable (Header unter 1024 px deckend in Bodenfarbe)
    var mirror = function () { root.style.setProperty('--ground-rgb', g.style.backgroundColor); };
    mirror();
    function follow(cfg) { grp.to({ bg: lastTarget }, cfg); ticker.add(function () { mirror(); if (!grp.active) return false; }); }
    var lastTarget = cur === 'dark' ? DARK : LIGHT;
    function colorOf(el) { return el.getAttribute('data-ground') === 'dark' ? DARK : LIGHT; }
    function mix(a, b, t) { var A = parseColor(a), B = parseColor(b); return 'rgb(' + A.map(function (x, i) { return Math.round(x + (B[i] - x) * t); }).join(',') + ')'; }
    ticker.add(function () {
      if (VW() < MD) {
        // r1, unter 768 px: Die Bodenfarbe folgt dem Scrollweg. Waehrend der Anfang der naechsten Sektion von der Unterkante
        // bis 10 % der Viewporthoehe wandert, mischt sich der Boden anteilig zur sichtbaren Flaeche beider Sektionen; die
        // Sektion, die den Bildschirm dominiert, bekommt immer die bessere Lesbarkeit, und ganz langsames Scrollen ergibt
        // einen ganz langsamen Wechsel. (Ab 768 px bleibt der zeitbasierte Wechsel an der Viewportmitte.)
        var secs = doc.querySelectorAll('[data-ground]'), vh = VH(), hi = vh, lo = vh * 0.1, lead = -1;
        for (var i = 0; i < secs.length; i++) { if (secs[i].getBoundingClientRect().top <= hi) lead = i; else break; }
        if (lead < 0) return;
        var prev = secs[lead > 0 ? lead - 1 : lead], top = secs[lead].getBoundingClientRect().top;
        var p = Math.max(0, Math.min(1, (hi - top) / (hi - lo)));
        var target = mix(colorOf(prev), colorOf(secs[lead]), p), now = (p >= 0.5 ? secs[lead] : prev).getAttribute('data-ground');
        if (now !== cur) { cur = now; root.setAttribute('data-ground-now', now); }
        if (target !== lastTarget) { lastTarget = target; follow(GROUND_MOBILE); }
        return;
      }
      var s = sectionAtMid('data-ground'); if (!s) return;
      var v = s.getAttribute('data-ground');
      if (v !== cur) {
        cur = v; root.setAttribute('data-ground-now', v);
        lastTarget = v === 'dark' ? DARK : LIGHT; follow(GROUND);
      }
    }, 50);
  }
  function initHeaderTheme() {
    var h = doc.querySelector('.hdr'); if (!h) return;
    var first = doc.querySelector('[data-header-theme]');
    var cur = first ? first.getAttribute('data-header-theme') : 'light';
    h.setAttribute('data-theme', cur);
    ticker.add(function () {
      var secs = doc.querySelectorAll('[data-header-theme]'), mid = midLine(), theme = cur;
      for (var i = secs.length - 1; i >= 0; i--) {
        var r = secs[i].getBoundingClientRect(), t = secs[i].getAttribute('data-header-theme');
        if (t === 'hidden' && r.top <= mid && r.bottom > 0) { theme = 'hidden'; break; }
        if (r.top <= mid && r.bottom > mid) { theme = t; break; }
      }
      if (theme !== cur) { cur = theme; h.setAttribute('data-theme', theme); }
    }, 80);
  }
  function initFlow() {
    var secs = doc.querySelectorAll('[data-flow]');
    for (var i = 0; i < secs.length; i++) Scrub(secs[i], { start: 'bottom bottom', end: 'bottom top', from: { y: 0, opacity: 1 }, to: { y: 50, opacity: 0.25 }, config: FLOW, frameInterval: 32 });
  }

  /* =====================================================================
     Header: Sprache, Burger, Aktion
     ===================================================================== */
  var menuOpen = false, burgerA, burgerB, menuGroup;
  function closeMenu() {
    if (!menuOpen) return; menuOpen = false;
    doc.body.classList.remove('menu-open');
    var btn = doc.querySelector('.hdr__burger'); if (btn) btn.setAttribute('aria-expanded', 'false');
    if (burgerA) { burgerA.to({ y: 5, rotate: 0 }); burgerB.to({ y: 11, rotate: 0 }); }
    if (menuGroup) menuGroup.to({ opacity: 0, y: -8 }, REVEAL, function () { var m = doc.querySelector('.menu'); if (m && !menuOpen) m.hidden = true; });
    if (lenis) lenis.start();
  }
  function openMenu() {
    menuOpen = true;
    doc.body.classList.add('menu-open');
    var btn = doc.querySelector('.hdr__burger'); btn.setAttribute('aria-expanded', 'true');
    var m = doc.querySelector('.menu'); m.hidden = false;
    burgerA.to({ y: 8, rotate: 45 }); burgerB.to({ y: 8, rotate: -45 });
    menuGroup.set({ opacity: 0, y: -8 }).to({ opacity: 1, y: 0 });
    if (lenis) lenis.stop();
  }
  function initHeader() {
    var h = doc.querySelector('.hdr'); if (!h) return;
    // Ecken an den Zellen (edge-Variante)
    var cells = h.querySelectorAll('.hdr__cell');
    for (var i = 0; i < cells.length; i++) Corners(cells[i], 'edge', null);
    // Aktion
    var act = h.querySelector('.hdr__action');
    if (act) { RollLabel(act.querySelector('.rl'), act); SwapArrow(act.querySelector('.sw'), act); }
    // Sprache
    doc.querySelectorAll('.lang').forEach(function (lg) {
      var btn = lg.querySelector('.lang__btn'), panel = lg.querySelector('.lang__panel'), chev = lg.querySelector('.lang__chev');
      var pg = new Group(panel, { from: { opacity: 0, y: -6, scale: 0.98 }, config: { tension: 300, friction: 30 } });
      var cg = new Group(chev, { from: { rotate: 0 }, config: { tension: 300, friction: 26 } });
      var open = false, timer = null;
      function show() { clearTimeout(timer); if (open) return; open = true; panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); pg.to({ opacity: 1, y: 0, scale: 1 }); cg.to({ rotate: 180 }); }
      function hide() { clearTimeout(timer); if (!open) return; open = false; btn.setAttribute('aria-expanded', 'false'); pg.to({ opacity: 0, y: -6, scale: 0.98 }, null, function () { if (!open) panel.hidden = true; }); cg.to({ rotate: 0 }); }
      var viaHover = false;   // r1: Klick nach Hover-Oeffnung schliesst das Panel nicht mehr sofort wieder
      if (!isTouchOnly) {
        lg.addEventListener('pointerenter', function () { viaHover = !open; show(); });
        lg.addEventListener('pointerleave', function () { clearTimeout(timer); timer = setTimeout(hide, CLOSE_DELAY); });
      }
      btn.addEventListener('click', function () { if (!open) { viaHover = false; show(); } else if (viaHover) { viaHover = false; } else hide(); });
      lg.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hide(); btn.focus(); } });
      doc.addEventListener('click', function (e) { if (!lg.contains(e.target)) hide(); });
      panel.querySelectorAll('[data-lang]').forEach(function (o) {
        o.addEventListener('click', function (e) { e.preventDefault(); setLang(o.getAttribute('data-lang'), true); hide(); });
      });
    });
    // Sprach-Links im Mobilmenue
    doc.querySelectorAll('.menu__langs [data-lang]').forEach(function (o) {
      o.addEventListener('click', function (e) { e.preventDefault(); setLang(o.getAttribute('data-lang'), true); });
    });
    // Burger
    var burger = h.querySelector('.hdr__burger');
    if (burger) {
      var lines = burger.querySelectorAll('i');
      burgerA = new Group(lines[0], { from: { y: 5, rotate: 0 }, config: BURGER });
      burgerB = new Group(lines[1], { from: { y: 11, rotate: 0 }, config: BURGER });
      var menu = doc.querySelector('.menu');
      menuGroup = new Group(menu, { from: { opacity: 0, y: -8 }, config: REVEAL });
      burger.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
      menu.querySelectorAll('.al').forEach(ArrowLink);
      var mact = menu.querySelector('.menu__action');
      if (mact) { RollLabel(mact.querySelector('.rl'), mact); SwapArrow(mact.querySelector('.sw'), mact); }
      win.addEventListener('resize', function () { if (VW() >= MD) closeMenu(); });
    }
  }

  /* =====================================================================
     Ladepanel
     ===================================================================== */
  var handoffFns = [], handoffFired = false;
  function onHandoff(fn) { if (handoffFired) fn(); else handoffFns.push(fn); }
  function fireHandoff() { if (handoffFired) return; handoffFired = true; handoffFns.forEach(function (f) { f(); }); handoffFns = []; }

  function initPreloader() {
    var panel = doc.querySelector('[data-preloader]');
    if (!panel) { fireHandoff(); return; }
    var fill = panel.querySelector('.pre__fill'), pct = panel.querySelector('.pre__pct'), veil = panel.querySelector('.pre__readout');
    var deck = panel.querySelector('.pre__deck'), cards = panel.querySelectorAll('.pre__card'), finale = panel.querySelector('.pre__finale');
    var markWrap = panel.querySelector('.pre__mark'), ghost = panel.querySelector('.pre__ghost .logo-mark');
    var stage = doc.querySelector('[data-hero-stage]');
    if (lenis) lenis.stop();
    try { win.scrollTo(0, 0); } catch (e) {}
    doc.body.classList.add('loading');

    if (RM) { finish(); return; }

    // Fortschritt
    var prog = { value: 0, velocity: 0, target: HOLD_AT, tension: FILL.tension, friction: FILL.friction, clamp: false };
    var loaded = false, done = false, fontsOk = false, winOk = false;
    function readout() { fill.style.clipPath = 'inset(' + ((1 - prog.value) * 100) + '% 0 0 0)'; pct.textContent = String(Math.round(Math.min(1, prog.value) * 100)).padStart(2, '0') + '%'; }
    ticker.add(function (dt) { var r = advance(prog, dt); readout(); if (r && done) return false; });
    function ready() { if (loaded) return; loaded = true; prog.target = 1; prog.tension = FINISH.tension; prog.friction = FINISH.friction; prog.clamp = true; check(); }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { fontsOk = true; if (winOk) ready(); }); else fontsOk = true;
    if (doc.readyState === 'complete') { winOk = true; if (fontsOk) ready(); } else win.addEventListener('load', function () { winOk = true; if (fontsOk) ready(); });
    setTimeout(ready, MAX_WAIT);

    // Karten austeilen
    var tilts = [-12, 9, -5, 14, -8], dealt = 0, dealDone = false;
    cards.forEach(function (c, i) {
      var g = new Group(c, { from: { opacity: 0, scale: 0.82, y: 48, rotate: tilts[i] * 1.8 }, config: CARD });
      setTimeout(function () { g.to({ opacity: 1, scale: 1, y: 0, rotate: tilts[i] }); }, CARD_LEAD + i * CARD_INTERVAL);
    });
    var fg = new Group(finale, { from: { opacity: 0, scale: 0.82, y: 48 }, config: CARD });
    setTimeout(function () { fg.to({ opacity: 1, scale: 1, y: 0 }, CARD, function () { setTimeout(function () { dealDone = true; check(); }, FINALE_HOLD); }); }, CARD_LEAD + cards.length * CARD_INTERVAL);

    var fired = false;
    function check() { if (fired || !dealDone || !loaded) return; if (prog.value < 0.999) { setTimeout(check, 40); return; } fired = true; try { expand(); } catch (err) { console.warn('Ladepanel-Finale fehlgeschlagen', err); finish(); } }

    function rectOf(el) { var r = el.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; }
    function expand() {
      // 1) Finale-Karte waechst auf die Buehne
      var from = rectOf(deck), to = stage ? rectOf(stage) : { left: 0, top: 0, width: VW(), height: VH() };
      finale.classList.add('is-free');
      finale.style.transform = '';
      var eg = new Group(finale, { from: from, config: EXPAND });
      eg.to(to, EXPAND, function () {
        if (lenis) lenis.start();
        doc.body.classList.remove('loading');
        requestAnimationFrame(function () {
          var t2 = stage ? rectOf(stage) : to; eg.set(t2);
          var lg = new Group(panel, { from: { opacity: 1 }, config: LEAVE }), released = false;
          ticker.add(function () { if (!released && lg.get('opacity') <= RELEASE_AT) { released = true; fireHandoff(); return false; } if (!lg.active) return false; });
          lg.to({ opacity: 0 }, LEAVE, function () { released = true; fireHandoff(); panel.remove(); done = true; });
        });
      });
      // 2) Monogramm fliegt in den Header
      var a = markWrap.getBoundingClientRect(), b = ghost.getBoundingClientRect();
      var mg = new Group(markWrap, { from: { x: 0, y: 0, scale: 1 }, config: HANDOFF });
      mg.to({ x: (b.left + b.width / 2) - (a.left + a.width / 2), y: (b.top + b.height / 2) - (a.top + a.height / 2), scale: b.width / a.width });
      new Group(veil, { from: { opacity: 1 }, config: HANDOFF }).to({ opacity: 0 });
      new Group(deck, { from: { opacity: 1 }, config: HANDOFF }).to({ opacity: 0 });
    }
    function finish() {                                   // reduzierte Bewegung / Notausstieg: sofort
      if (lenis) lenis.start(); doc.body.classList.remove('loading'); if (panel.parentNode) panel.remove(); fireHandoff();
    }
    // Notausstieg: Das Panel darf die Seite nie dauerhaft verdecken.
    setTimeout(function () { if (panel.parentNode && !done) { console.warn('Ladepanel: Notausstieg'); finish(); } }, MAX_WAIT + 7000);
  }

  function warmUp() {
    var run = function () {
      var t0 = Date.now(), imgs = doc.querySelectorAll('img[data-warm]');
      imgs.forEach(function (im) { if (Date.now() - t0 > WARM_BUDGET) return; var i = new Image(); i.src = im.currentSrc || im.src; });
    };
    var go = function () { if (win.requestIdleCallback) win.requestIdleCallback(run, { timeout: 2000 }); else setTimeout(run, 500); };
    if (doc.readyState === 'complete') go(); else win.addEventListener('load', go);
  }

  /* =====================================================================
     Sektion 1: Hero
     ===================================================================== */
  function initHero() {
    var hero = doc.querySelector('.hero'); if (!hero) return;
    var photo = hero.querySelector('.hero__photo');
    if (photo) Scrub(photo, { ref: hero.querySelector('.hero__stage') || hero, start: 'top top', end: 'bottom top', from: { y: '0%' }, to: { y: '22%' }, config: PARALLAX, frameInterval: 32 });
    var h1 = hero.querySelector('h1'), lines = hero.querySelectorAll('.hero__line'), intro = hero.querySelector('.hero__intro');
    var wH1 = new Words(h1, { preset: 'head', manual: true });
    var wLines = Array.prototype.map.call(lines, function (l) { return new Words(l, { preset: 'head', manual: true }); });
    var wIntro = new Words(intro, { preset: 'copy', manual: true });
    var figs = hero.querySelectorAll('.fig');
    var figGroups = Array.prototype.map.call(figs, function (f) { return new Group(f, { from: { opacity: 0, y: 18 }, config: REVEAL }); });
    figs.forEach(function (f) { var v = f.querySelector('[data-count]'); if (v) Counter(v); });
    var ctas = hero.querySelector('.hero__ctas'), cg = ctas ? new Group(ctas, { from: { opacity: 0, y: 16 }, config: { tension: 170, friction: 26 } }) : null;
    hero.querySelectorAll('.dbtn').forEach(function (b) {
      var fillEl = b.querySelector('.dbtn__fill');
      var fg = new Group(fillEl, { from: { scaleY: 0 }, config: LINK_FILL });
      RollLabel(b.querySelector('.rl'), b); Corners(b, 'box', b);
      if (!(VW() <= MD || isTouchOnly)) {
        b.addEventListener('pointerenter', function () { fg.to({ scaleY: 1 }); }); b.addEventListener('pointerleave', function () { fg.to({ scaleY: 0 }); });
        b.addEventListener('focusin', function () { fg.to({ scaleY: 1 }); }); b.addEventListener('focusout', function () { fg.to({ scaleY: 0 }); });
      }
    });
    onHandoff(function () {
      hero.classList.add('is-live');
      wH1.play(0);
      wLines.forEach(function (w, i) { w.play(TAGLINE_DELAY + i * TAGLINE_STAGGER); });
      wIntro.play(HERO_INTRO_DELAY);
      figGroups.forEach(function (g, i) { delay(i * ENTRY_STAGGER, function () { g.to({ opacity: 1, y: 0 }); }); });
      if (cg) delay(LINKS_DELAY, function () { cg.to({ opacity: 1, y: 0 }); });
    });
  }

  /* =====================================================================
     Sektion 2: Unternehmen (rotierende Fotos, Themen)
     ===================================================================== */
  /* r1: Foto-Uebergaenge als Bibliothek (alle aus dem Prompt), waehlbar per data-transition am Rahmen:
     dissolve (About-Galerie), dissolve-settle (Team-Foto, Finale-Karte), wipe (Karten-Einstieg), clear (Team-Zeilen),
     deal (Ladepanel-Karten), turn (Prozess-Buehne), push (wanderndes Team-Portraet). data-interval = Takt in ms,
     data-speed = Tempo-Faktor der Federn. Kundenentscheid 09.10.2026 fuer Unternehmen: clear, 2 s, Faktor 1.4. */
  var SLIDE = { tension: 480, friction: 42 };
  var SETTLE_SCALE = 1.12, WIPE_SCALE = 1.18, CLEAR_BLUR = 14, CLEAR_Y = -28, DEAL_SCALE = 0.82, DEAL_Y = 48, DEAL_TILT = 9, DEAL_START = 1.8, TURN_ANGLE = 4;
  // Federn je Uebergang; PhotoSwap skaliert sie mit dem Tempo-Faktor k (data-speed): tension * k^2, friction * k
  function springSet(k) {
    function sc(c) { return { tension: c.tension * k * k, friction: c.friction * k, clamp: !!c.clamp }; }
    return { FADE: sc(FADE), SETTLE: sc(SETTLE), MASK: sc(MASK), ROW: sc(ROW_REVEAL), CARD: sc(CARD), TURN: sc(TURN), SWAP: sc(SWAP_IMG), SLIDE: sc(SLIDE) };
  }
  var TRANSITIONS = {
    'dissolve': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0 }, config: S.FADE })]; },
      hide: function (g) { g[0].set({ opacity: 0 }); }, show: function (g) { g[0].set({ opacity: 1 }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 0 }).to({ opacity: 1 }, S.FADE, done); }
    },
    'dissolve-settle': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0 }, config: S.FADE }), new Group(p, { from: { scale: SETTLE_SCALE }, config: S.SETTLE })]; },
      hide: function (g) { g[0].set({ opacity: 0 }); g[1].set({ scale: SETTLE_SCALE }); }, show: function (g) { g[0].set({ opacity: 1 }); g[1].set({ scale: 1 }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 0 }).to({ opacity: 1 }, S.FADE, done); g[1].set({ scale: SETTLE_SCALE }).to({ scale: 1 }, S.SETTLE); }
    },
    'wipe': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0, clip: [0, 0, 100, 0] }, config: S.MASK }), new Group(p.querySelector('img'), { from: { scale: WIPE_SCALE }, config: S.SETTLE })]; },
      hide: function (g) { g[0].set({ opacity: 0, clip: [0, 0, 100, 0] }); g[1].set({ scale: WIPE_SCALE }); }, show: function (g) { g[0].set({ opacity: 1, clip: [0, 0, 0, 0] }); g[1].set({ scale: 1 }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 1, clip: [0, 0, 100, 0] }).to({ clip: [0, 0, 0, 0] }, S.MASK, done); g[1].set({ scale: WIPE_SCALE }).to({ scale: 1 }, S.SETTLE); }
    },
    'clear': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }, config: S.ROW })]; },
      hide: function (g) { g[0].set({ opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }); }, show: function (g) { g[0].set({ opacity: 1, blur: 0, y: 0 }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }).to({ opacity: 1, blur: 0, y: 0 }, S.ROW, done); }
    },
    'deal': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: 0 }, config: S.CARD })]; },
      hide: function (g) { g[0].set({ opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: 0 }); }, show: function (g) { g[0].set({ opacity: 1, scale: 1, y: 0, rotate: 0 }); },
      enter: function (g, S, step, done) { var tilt = (step % 2 ? -1 : 1) * DEAL_TILT; g[0].set({ opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: tilt * DEAL_START }).to({ opacity: 1, scale: 1, y: 0, rotate: 0 }, S.CARD, done); }
    },
    'turn': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0 }, config: S.SWAP })]; },
      frame: function (el, S) { return new Group(el, { from: { rotate: -TURN_ANGLE }, config: S.TURN }); },
      turn: function (fg, S, step) { fg.to({ rotate: (step % 2 ? 1 : -1) * TURN_ANGLE }, S.TURN); },
      hide: function (g) { g[0].set({ opacity: 0 }); }, show: function (g) { g[0].set({ opacity: 1 }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 0 }).to({ opacity: 1 }, S.SWAP, done); }
    },
    'push': {
      build: function (p, S) { return [new Group(p, { from: { opacity: 0, y: '0%' }, config: S.SLIDE })]; },
      hide: function (g) { g[0].set({ opacity: 0, y: '0%' }); }, show: function (g) { g[0].set({ opacity: 1, y: '0%' }); },
      enter: function (g, S, step, done) { g[0].set({ opacity: 1, y: '100%' }).to({ y: '0%' }, S.SLIDE, done); },
      leave: function (g, S) { g[0].to({ y: '-30%', opacity: 0.6 }, S.SLIDE); }
    }
  };
  // Stapel gestapelter Fotos in einem Rahmen; go(i) blendet Foto i mit dem gewaehlten Uebergang ueber das aktuelle.
  // speed: Tempo-Faktor (1 = Prompt-Feder, 1.4 = 40 % schneller), kommt aus data-speed am Rahmen.
  function PhotoSwap(frame, photos, name, speed) {
    var tr = TRANSITIONS[name] || TRANSITIONS.dissolve, S = springSet(speed > 0 ? speed : 1), z = 1, idx = 0, step = 0;
    var h = Array.prototype.map.call(photos, function (p, i) { var g = tr.build(p, S); if (i === 0) { tr.show(g); p.style.zIndex = '1'; } else { tr.hide(g); p.style.zIndex = '0'; } return { el: p, g: g, gen: -1 }; });
    var fg = tr.frame ? tr.frame(frame, S) : null;
    function go(i) {
      i = i % h.length; if (i === idx) return;
      var hn = h[i], ho = h[idx], oldGen = ho.gen; idx = i; step += 1; hn.gen = step;
      z += 1; hn.el.style.zIndex = String(z);
      tr.enter(hn.g, S, step, function () { if (ho.gen === oldGen) { tr.hide(ho.g); ho.el.style.zIndex = '0'; } });   // nur, wenn das alte Foto nicht inzwischen neu eingetreten ist
      if (tr.leave) tr.leave(ho.g, S);
      if (tr.turn && fg) tr.turn(fg, S, step);
    }
    return { go: go, index: function () { return idx; } };
  }

  function initAbout() {
    var sec = doc.querySelector('.about'); if (!sec) return;
    var eyebrow = sec.querySelector('.eyebrow'), title = sec.querySelector('h2'), mission = sec.querySelector('.about__mission');
    Inview(eyebrow, { from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 }, config: REVEAL, delayIn: ENTRY_DELAY });
    new Words(title, { preset: 'head', delayIn: ENTRY_DELAY + 120 });
    new Words(mission, { preset: 'copy', mode: 'always', delayIn: ENTRY_DELAY + 280 });
    var frame = sec.querySelector('.about__frame'), photos = frame.querySelectorAll('.about__photo'), topics = sec.querySelectorAll('.about__topic');
    var swap = PhotoSwap(frame, photos, frame.getAttribute('data-transition') || 'dissolve', parseFloat(frame.getAttribute('data-speed')) || 1);
    var interval = parseInt(frame.getAttribute('data-interval'), 10) || STEP_INTERVAL;
    var tg = Array.prototype.map.call(topics, function (t, i) { return new Group(t, { from: { opacity: i === 0 ? 1 : TOPIC_DIM }, config: TOPIC }); });
    var idx = 0, timer = null, n = photos.length;
    function setIndex(i) {
      idx = i % n;
      swap.go(idx);
      var active = Math.floor(idx * topics.length / n);
      tg.forEach(function (g, k) { g.to({ opacity: k === active ? 1 : TOPIC_DIM }); });
    }
    function start() { if (timer || RM) return; timer = setTimeout(function () { setIndex(idx + 1); timer = setInterval(function () { setIndex(idx + 1); }, interval); }, START_DELAY); }
    function stop() { clearTimeout(timer); clearInterval(timer); timer = null; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: 0.1 }).observe(frame);
    var btn = sec.querySelector('.about__btn');
    if (btn) {
      RollLabel(btn.querySelector('.rl'), frame); SwapArrow(btn.querySelector('.sw'), frame);
      if (VW() >= XL && !isTouchOnly) Hover(btn, frame, { from: { opacity: 0, scale: 0.94 }, to: { opacity: 1, scale: 1 }, config: BUTTON });
      else new Group(btn, { from: { opacity: 1, scale: 1 } });
    }
  }

  /* =====================================================================
     Sektion 3: Kompetenzen (Karten)
     ===================================================================== */
  function initCards() {
    var sec = doc.querySelector('.cards'); if (!sec) return;
    var cards = sec.querySelectorAll('.card');
    cards.forEach(function (card, i) {
      var mask = card.querySelector('.card__mask'), photo = card.querySelector('.card__photo'), label = card.querySelector('.card__label'), btn = card.querySelector('.card__btn');
      var w = new Words(label, { preset: 'head', manual: true, wordOut: { y: '90%', opacity: 0, scale: 0.9 }, stagger: 50, config: LABEL });
      Inview(mask, { watch: card, from: { clip: [0, 0, 100, 0] }, to: { clip: [0, 0, 0, 0] }, config: MASK, delayIn: ENTRY_DELAY + i * MASK_STAGGER, threshold: 0.15 });
      Inview(photo, { watch: card, from: { scale: 1.18 }, to: { scale: 1 }, config: SETTLE, delayIn: ENTRY_DELAY + i * MASK_STAGGER, threshold: 0.15 });
      new IntersectionObserver(function (es, io) { es.forEach(function (e) { if (e.isIntersecting) { delay(ENTRY_DELAY + i * MASK_STAGGER + LABEL_AFTER_MASK, function () { w.play(0); }); io.unobserve(card); } }); }, { threshold: 0.15 }).observe(card);
      var drift = DRIFTS[i] || 90, inner = card.querySelector('.card__drift');
      Scrub(inner, { start: 'top bottom', end: 'bottom top', from: { y: -drift }, to: { y: drift }, config: PARALLAX, frameInterval: 32 });
      if (btn) {
        RollLabel(btn.querySelector('.rl'), card); SwapArrow(btn.querySelector('.sw'), card);
        if (VW() >= XL && !isTouchOnly) Hover(btn, card, { from: { opacity: 0, scale: 0.94 }, to: { opacity: 1, scale: 1 }, config: BUTTON });
        else if (VW() <= MD) new Group(btn, { from: { opacity: 1, scale: 1 } });
        else new Group(btn, { from: { opacity: 0, scale: 0.94 } });
      }
    });
  }

  /* =====================================================================
     Sektion 4: Leistungen / Prozess (Schritte, Buehne mit Neigung)
     ===================================================================== */
  function initProcess() {
    var sec = doc.querySelector('.process'); if (!sec) return;
    var eyebrow = sec.querySelector('.eyebrow');
    Inview(eyebrow, { from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 }, config: REVEAL, delayIn: ENTRY_DELAY });
    var steps = sec.querySelectorAll('.pstep'), stage = sec.querySelector('.process__stage'), inner = sec.querySelector('.process__inner'), photos = stage.querySelectorAll('.process__photo');
    var caption = sec.querySelector('.process__caption');
    var sg = Array.prototype.map.call(steps, function (s, i) { return new Group(s, { from: { opacity: i === 0 ? 1 : DIM_OPACITY, blur: i === 0 ? 0 : DIM_BLUR }, config: STEPC }); });
    var pg = Array.prototype.map.call(photos, function (p, i) { return new Group(p, { from: { opacity: i === 0 ? 1 : 0 }, config: SWAP_IMG }); });
    var turn = new Group(stage.querySelector('.process__turn'), { from: { rotate: LAST_TILT - (steps.length - 1) * TILT_STEP }, config: TURN });
    var tilt = new Group(stage, { from: { rotateX: 0, rotateY: 0 }, config: TILT });
    var depth = new Group(inner, { from: { x: 0, y: 0, scale: 1.12 }, config: TILT });
    var drift = VW() < MD ? STAGE_DRIFT_MOBILE : STAGE_DRIFT;
    Scrub(stage.parentNode, { start: 'top bottom', end: 'bottom top', from: { y: drift }, to: { y: -drift }, config: PARALLAX, frameInterval: 32 });
    // r1: tappbare Leiste 01-05 unter der Caption (nur unter 1024 px sichtbar, CSS)
    var bar = doc.createElement('div'), dots = [];
    bar.className = 'process__bar'; bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Schritt wählen'); bar.setAttribute('data-en-label', 'Choose step');
    steps.forEach(function (s, i) {
      var b = doc.createElement('button'); b.type = 'button'; b.className = 'process__dot';
      b.textContent = String(i + 1).padStart(2, '0'); b.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { tapped = true; if (i !== active) setActive(i); });
      bar.appendChild(b); dots.push(b);
    });
    caption.parentNode.insertBefore(bar, caption.nextSibling);
    var active = 0, capWords = null, tapped = false;
    function setCaption(i) {
      var src = steps[i].querySelector('.pstep__src');
      caption.textContent = src ? src.textContent : '';
      caption.style.maxWidth = steps[i].getAttribute('data-capw') || '';
      capWords = new Words(caption, { preset: 'copy', manual: true });
      capWords.play(0);
    }
    function setActive(i) {
      active = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      sg.forEach(function (g, k) { g.to({ opacity: k === i ? 1 : DIM_OPACITY, blur: k === i ? 0 : DIM_BLUR }); });
      pg.forEach(function (g, k) { g.to({ opacity: k === i ? 1 : 0 }); });
      turn.to({ rotate: LAST_TILT - (steps.length - 1 - i) * TILT_STEP });
      setCaption(i);
    }
    setCaption(0); steps[0].classList.add('is-active');
    langListeners.push(function () { setCaption(active); });
    steps.forEach(function (s, i) {
      s.addEventListener('pointerenter', function () { if (i !== active) setActive(i); });
      s.addEventListener('focus', function () { if (i !== active) setActive(i); });
      s.addEventListener('click', function () { tapped = true; if (i !== active) setActive(i); });
    });
    // Auto-Weiterschalten unter 1440 (solange >= 40% sichtbar), echte Maus oder erster Tipp (Schritt/Leiste) schaltet ab
    var auto = null, mouseSeen = false, visible = false;
    function tickAuto() { if (visible && !mouseSeen && !tapped && !RM) setActive((active + 1) % steps.length); }
    function arm() { if (auto || VW() >= XL) return; auto = setInterval(tickAuto, AUTO_STEP_MS); }
    new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; if (visible) arm(); }); }, { threshold: 0.4 }).observe(sec);
    sec.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse') { mouseSeen = true; }
      if (e.pointerType !== 'mouse') return;
      var r = sec.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      tilt.to({ rotateX: -py * MAX_TILT * 2, rotateY: px * MAX_TILT * 2 });
      depth.to({ x: px * MAX_DEPTH, y: py * MAX_DEPTH, scale: 1.12 });
    });
    sec.addEventListener('pointerleave', function () { tilt.to({ rotateX: 0, rotateY: 0 }); depth.to({ x: 0, y: 0, scale: 1.12 }); });
  }

  /* =====================================================================
     Sektion 5: Team
     ===================================================================== */
  function initTeam() {
    var sec = doc.querySelector('.team'); if (!sec) return;
    new Words(sec.querySelector('h2'), { preset: 'head', delayIn: ENTRY_DELAY });
    new Words(sec.querySelector('.team__intro'), { preset: 'copy', mode: 'always', delayIn: ENTRY_DELAY + 160 });
    var photo = sec.querySelector('.team__photo');
    if (photo) {
      Inview(photo.querySelector('.team__mask'), { watch: photo, from: { clip: [0, 0, 100, 0] }, to: { clip: [0, 0, 0, 0] }, config: MASK, delayIn: ENTRY_DELAY, threshold: 0.15 });
      Inview(photo.querySelector('img'), { watch: photo, from: { scale: 1.18 }, to: { scale: 1 }, config: SETTLE, delayIn: ENTRY_DELAY, threshold: 0.15 });
      Scrub(photo.querySelector('.team__drift'), { start: 'top bottom', end: 'bottom top', from: { y: -60 }, to: { y: 60 }, config: PARALLAX, frameInterval: 32 });
    }
    sec.querySelectorAll('.trow').forEach(function (row, i) {
      Inview(row, { from: { opacity: 0, y: -28, blur: 14 }, to: { opacity: 1, y: 0, blur: 0 }, config: ROW_REVEAL, delayIn: ENTRY_DELAY + i * ROW_STAGGER, threshold: 0.1 });
      var bio = row.querySelector('.trow__bio'); if (bio) new Words(bio, { preset: 'copy', mode: 'always' });
      var c = row.querySelector('[data-count]'); if (c) Counter(c);
      Corners(row, 'box', row.classList.contains('trow--link') ? row : null);
    });
    sec.querySelectorAll('.al').forEach(ArrowLink);
  }

  /* =====================================================================
     Sektion 6: Kontakt
     ===================================================================== */
  function initContact() {
    var sec = doc.querySelector('.contact'); if (!sec) return;
    // r1: Parallaxe auf der inneren Ebene (.contact__layer, 120 % hoch), die Aussenbox bleibt stehen
    var photo = sec.querySelector('.contact__layer') || sec.querySelector('.contact__photo');
    if (photo) Scrub(photo, { ref: sec.querySelector('.contact__photo') || photo, start: 'top bottom', end: 'bottom bottom', from: { y: '-15%' }, to: { y: '0%' }, config: PARALLAX, frameInterval: 32 });
    sec.querySelectorAll('.rail__links .al').forEach(function (a, i) {
      ArrowLink(a);
      Inview(a, { from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0 }, config: { tension: 200, friction: 30 }, delayIn: ENTRY_DELAY + i * ENTRY_STAGGER });
    });
    var addr = sec.querySelector('.rail__details');
    if (addr) Inview(addr, { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 }, config: REVEAL, delayIn: ENTRY_DELAY + 140 });
    var close = sec.querySelector('.contact__close');
    if (close) {
      new Words(close.querySelector('h2'), { preset: 'head', delayIn: ENTRY_DELAY + 200 });
      var ctas = close.querySelector('.contact__ctas');
      if (ctas) Inview(ctas, { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 }, config: { tension: 170, friction: 26 }, delayIn: ENTRY_DELAY + 420 });
      close.querySelectorAll('.dbtn').forEach(function (b) {
        var fg = new Group(b.querySelector('.dbtn__fill'), { from: { scaleY: 0 }, config: LINK_FILL });
        RollLabel(b.querySelector('.rl'), b); Corners(b, 'box', b);
        if (!(VW() <= MD || isTouchOnly)) {
          b.addEventListener('pointerenter', function () { fg.to({ scaleY: 1 }); }); b.addEventListener('pointerleave', function () { fg.to({ scaleY: 0 }); });
          b.addEventListener('focusin', function () { fg.to({ scaleY: 1 }); }); b.addEventListener('focusout', function () { fg.to({ scaleY: 0 }); });
        }
      });
    }
    var legal = sec.querySelector('.contact__legal'), copy = sec.querySelector('.contact__copy');
    if (legal) Inview(legal, { from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, config: { tension: 200, friction: 30 }, delayIn: ENTRY_DELAY + 320 });
    if (copy) Inview(copy, { from: { opacity: 0, y: 10 }, to: { opacity: 1, y: 0 }, config: { tension: 200, friction: 30 }, delayIn: ENTRY_DELAY + 400 });
    sec.querySelectorAll('.rl-link').forEach(function (a) { RollLabel(a.querySelector('.rl'), a); });
  }

  /* =====================================================================
     Unterseiten (einfacher Einstieg) + Sonstiges
     ===================================================================== */
  function initSubpage() {
    var pg = doc.querySelector('.sub'); if (!pg) return;
    var h1 = pg.querySelector('h1'); if (h1) new Words(h1, { preset: 'head', delayIn: 120 });
    pg.querySelectorAll('.sub__reveal').forEach(function (el, i) { Inview(el, { from: { opacity: 0, y: 14 }, to: { opacity: 1, y: 0 }, config: REVEAL, delayIn: 80 + Math.min(i, 4) * 60 }); });
    pg.querySelectorAll('.dbtn').forEach(function (b) {
      var fg = new Group(b.querySelector('.dbtn__fill'), { from: { scaleY: 0 }, config: LINK_FILL });
      RollLabel(b.querySelector('.rl'), b); Corners(b, 'box', b);
      if (!(VW() <= MD || isTouchOnly)) { b.addEventListener('pointerenter', function () { fg.to({ scaleY: 1 }); }); b.addEventListener('pointerleave', function () { fg.to({ scaleY: 0 }); }); }
    });
    pg.querySelectorAll('.al').forEach(ArrowLink);
  }
  function initYear() { doc.querySelectorAll('[data-year]').forEach(function (y) { y.textContent = String(new Date().getFullYear()); }); }
  function initAssetGuard() {
    doc.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () {
        var n = doc.createElement('div'); n.className = 'asset-error'; n.textContent = 'Bild fehlt: ' + (im.getAttribute('src') || '');
        (im.parentNode || doc.body).appendChild(n);
      });
    });
  }

  /* ---- Start ------------------------------------------------------------ */
  setLang(detect(), false);
  initLenis();
  initAnchors();
  initHeader();
  initGround();
  initHeaderTheme();
  initFlow();
  initHero();
  initAbout();
  initCards();
  initProcess();
  initTeam();
  initContact();
  initSubpage();
  initYear();
  initAssetGuard();
  initPreloader();
  warmUp();
  initConsent();
  applyLang(currentLang());
  if (location.hash && !doc.querySelector('[data-preloader]')) setTimeout(function () { scrollToHash(location.hash); }, 50);
  // r1: Engine fuer die Vorschauseiten (vorschau*.html) zugaenglich machen
  win.IRO = { Group: Group, ticker: ticker, advance: advance, Words: Words, Inview: Inview, Scrub: Scrub, Hover: Hover, onHandoff: onHandoff, PhotoSwap: PhotoSwap, TRANSITIONS: TRANSITIONS,
    springs: { FADE: FADE, SWAP_IMG: SWAP_IMG, MASK: MASK, SETTLE: SETTLE, CARD: CARD, TURN: TURN, ROW_REVEAL: ROW_REVEAL, PARALLAX: PARALLAX } };
})();
