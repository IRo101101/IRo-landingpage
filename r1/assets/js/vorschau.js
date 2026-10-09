/* =========================================================================
   IdeeRoth AG - iro.swiss - v2 r1 - Vorschau Fotouebergaenge
   (vorschau-uebergaenge.html). Nutzt die Feder-Engine aus main.js (window.IRO).
   Sieben Uebergaenge fuer den Fotowechsel im Block "Unternehmen", alle auf
   einer gemeinsamen Uhr (gleicher Index, gleicher Takt). Prompt-Werte als
   Konstanten oben; Tempo k skaliert jede Feder: tension / k^2, friction / k.
   ========================================================================= */
(function () {
  'use strict';
  var IRO = window.IRO; if (!IRO) { console.warn('vorschau.js: Engine (window.IRO) fehlt'); return; }
  var doc = document, Group = IRO.Group, S = IRO.springs;
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Prompt-Werte ---------------------------------------------------- */
  var TAKT_PROMPT = 520;                                   // STEP_INTERVAL der About-Galerie
  var FADE = S.FADE;                                       // 420 / 38   Dissolve (About-Galerie)
  var SETTLE = S.SETTLE;                                   // 60 / 26    Settle (Team-Foto, Karten)
  var MASK = S.MASK;                                       // 70 / 24 clamp  Wipe (Karten-Einstieg)
  var ROW = S.ROW_REVEAL;                                  // 55 / 22    Clear (Team-Zeilen)
  var CARD = S.CARD;                                       // 190 / 24   Deal (Ladepanel-Karten)
  var TURN = S.TURN;                                       // 170 / 22   Turn (Prozess-Buehne)
  var SWAP_IMG = S.SWAP_IMG;                               // 320 / 34   Foto-Ueberblendung der Prozess-Buehne
  var SLIDE = { tension: 480, friction: 42 };              // Push (wanderndes Team-Portraet)
  var TOPIC = { tension: 260, friction: 30 }, TOPIC_DIM = 0.55;

  var SETTLE_SCALE = 1.12, WIPE_SCALE = 1.18;
  var CLEAR_BLUR = 14, CLEAR_Y = -28;
  var DEAL_SCALE = 0.82, DEAL_Y = 48, DEAL_TILT = 9, DEAL_START = 1.8;   // Startwinkel = 1.8 x Neigung, Ruhe 0
  var TURN_ANGLE = 4;
  var PUSH_OUT = '-30%', PUSH_DIM = 0.6;

  /* ---- Helfer ---------------------------------------------------------- */
  function qs(s, r) { return (r || doc).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function scaled(cfg, k) { return { tension: cfg.tension / (k * k), friction: cfg.friction / k, clamp: !!cfg.clamp }; }
  function num(n) { return String(Math.round(n * 10) / 10); }
  function springText(cfg, k) { return num(cfg.tension / (k * k)) + ' / ' + num(cfg.friction / k) + (cfg.clamp ? ' clamp' : ''); }
  function taktText(ms) { return String(Math.round(ms / 10) / 100) + ' s' + (ms === TAKT_PROMPT ? ' (Prompt)' : ''); }
  function pad(i) { return (i < 10 ? '0' : '') + i; }
  function kill(g) { if (!g) return; if (g.tick) { IRO.ticker.remove(g.tick); g.tick = null; } g.active = false; g.onRest = null; }

  /* ---- Die sieben Uebergaenge ------------------------------------------
     build(photo) -> Handle mit groups[]; hide/show setzen sofort;
     enter(h, step, k, done) startet das eintretende Foto, done = Ruhe;
     leave(h, k) optional fuer das alte Foto; frame/turn optional fuer den Rahmen. */
  var TR = {
    dissolve: {
      springs: [{ label: 'Fade', cfg: FADE }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0 }, config: FADE })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0 }); },
      show: function (h) { h.groups[0].set({ opacity: 1 }); },
      enter: function (h, step, k, done) { h.groups[0].set({ opacity: 0 }).to({ opacity: 1 }, scaled(FADE, k), done); }
    },
    settle: {
      springs: [{ label: 'Fade', cfg: FADE }, { label: 'Settle', cfg: SETTLE }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0 }, config: FADE }), new Group(p, { from: { scale: SETTLE_SCALE }, config: SETTLE })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0 }); h.groups[1].set({ scale: SETTLE_SCALE }); },
      show: function (h) { h.groups[0].set({ opacity: 1 }); h.groups[1].set({ scale: 1 }); },
      enter: function (h, step, k, done) {
        h.groups[0].set({ opacity: 0 }).to({ opacity: 1 }, scaled(FADE, k), done);
        h.groups[1].set({ scale: SETTLE_SCALE }).to({ scale: 1 }, scaled(SETTLE, k));
      }
    },
    wipe: {
      springs: [{ label: 'Mask', cfg: MASK }, { label: 'Settle', cfg: SETTLE }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0, clip: [0, 0, 100, 0] }, config: MASK }), new Group(qs('img', p), { from: { scale: WIPE_SCALE }, config: SETTLE })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0, clip: [0, 0, 100, 0] }); h.groups[1].set({ scale: WIPE_SCALE }); },
      show: function (h) { h.groups[0].set({ opacity: 1, clip: [0, 0, 0, 0] }); h.groups[1].set({ scale: 1 }); },
      enter: function (h, step, k, done) {
        h.groups[0].set({ opacity: 1, clip: [0, 0, 100, 0] }).to({ clip: [0, 0, 0, 0] }, scaled(MASK, k), done);
        h.groups[1].set({ scale: WIPE_SCALE }).to({ scale: 1 }, scaled(SETTLE, k));
      }
    },
    clear: {
      springs: [{ label: 'Row', cfg: ROW }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }, config: ROW })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }); },
      show: function (h) { h.groups[0].set({ opacity: 1, blur: 0, y: 0 }); },
      enter: function (h, step, k, done) { h.groups[0].set({ opacity: 0, blur: CLEAR_BLUR, y: CLEAR_Y }).to({ opacity: 1, blur: 0, y: 0 }, scaled(ROW, k), done); }
    },
    deal: {
      springs: [{ label: 'Card', cfg: CARD }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: 0 }, config: CARD })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: 0 }); },
      show: function (h) { h.groups[0].set({ opacity: 1, scale: 1, y: 0, rotate: 0 }); },
      enter: function (h, step, k, done) {
        var tilt = (step % 2 ? -1 : 1) * DEAL_TILT;
        h.groups[0].set({ opacity: 0, scale: DEAL_SCALE, y: DEAL_Y, rotate: tilt * DEAL_START }).to({ opacity: 1, scale: 1, y: 0, rotate: 0 }, scaled(CARD, k), done);
      }
    },
    turn: {
      springs: [{ label: 'Turn', cfg: TURN }, { label: 'Swap', cfg: SWAP_IMG }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0 }, config: SWAP_IMG })] }; },
      frame: function (el) { return new Group(el, { from: { rotate: -TURN_ANGLE }, config: TURN }); },
      turn: function (fg, step, k) { fg.to({ rotate: (step % 2 ? 1 : -1) * TURN_ANGLE }, scaled(TURN, k)); },
      hide: function (h) { h.groups[0].set({ opacity: 0 }); },
      show: function (h) { h.groups[0].set({ opacity: 1 }); },
      enter: function (h, step, k, done) { h.groups[0].set({ opacity: 0 }).to({ opacity: 1 }, scaled(SWAP_IMG, k), done); }
    },
    push: {
      springs: [{ label: 'Slide', cfg: SLIDE }],
      build: function (p) { return { groups: [new Group(p, { from: { opacity: 0, y: '0%' }, config: SLIDE })] }; },
      hide: function (h) { h.groups[0].set({ opacity: 0, y: '0%' }); },
      show: function (h) { h.groups[0].set({ opacity: 1, y: '0%' }); },
      enter: function (h, step, k, done) { h.groups[0].set({ opacity: 1, y: '100%' }).to({ y: '0%' }, scaled(SLIDE, k), done); },
      leave: function (h, k) { h.groups[0].to({ y: PUSH_OUT, opacity: PUSH_DIM }, scaled(SLIDE, k)); }
    }
  };
  var ORDER = ['dissolve', 'settle', 'wipe', 'clear', 'deal', 'turn', 'push'];

  /* ---- Gemeinsame Uhr -------------------------------------------------- */
  var tpl = qs('#vs-photos');
  var N = tpl ? tpl.content.querySelectorAll('.about__photo').length : 10;
  var state = { takt: TAKT_PROMPT, k: 1, running: !RM, idx: 0, step: 0 };
  var timer = null, frames = [];

  /* ---- Ein Rahmen ------------------------------------------------------ */
  function Frame(el) { this.el = el; this.stage = el.parentNode; this.h = []; this.fg = null; this.tr = null; this.z = 1; }
  Frame.prototype.use = function (id) {
    var tr = TR[id], self = this;
    this.h.forEach(function (h) { h.groups.forEach(kill); });
    kill(this.fg);
    this.tr = tr; this.id = id;
    this.el.removeAttribute('style');
    this.el.innerHTML = '';
    this.el.appendChild(tpl.content.cloneNode(true));
    this.h = qsa('.about__photo', this.el).map(function (p) { var h = tr.build(p); h.el = p; h.gen = -1; return h; });
    this.fg = tr.frame ? tr.frame(this.el) : null;
    this.idx = state.idx;
    this.h.forEach(function (h, i) {
      if (i === self.idx) { tr.show(h); h.el.style.zIndex = '1'; } else { tr.hide(h); h.el.style.zIndex = '0'; }
    });
    this.stage.setAttribute('data-vs', id);
    this.el.setAttribute('data-vs-idx', String(this.idx));
  };
  Frame.prototype.go = function (idx, step) {
    var tr = this.tr, prev = this.idx, k = state.k;
    if (!tr || idx === prev) return;
    this.idx = idx;
    var hn = this.h[idx], ho = this.h[prev], oldGen = ho.gen;
    hn.gen = step;
    // wie PhotoSwap in main.js: feste Ebenen 2 (eintretend), 1 (aktuell), 0 (uebrige) statt hochzaehlen
    this.h.forEach(function (x) { if (x !== hn && x !== ho) x.el.style.zIndex = '0'; });
    ho.el.style.zIndex = '1'; hn.el.style.zIndex = '2';
    tr.enter(hn, step, k, function () {
      if (ho.gen === oldGen) { tr.hide(ho); ho.el.style.zIndex = '0'; }   // nur, wenn das alte Foto nicht inzwischen neu eingetreten ist
    });
    if (tr.leave) tr.leave(ho, k);
    if (tr.turn && this.fg) tr.turn(this.fg, step, k);
    this.el.setAttribute('data-vs-idx', String(idx));
  };

  /* ---- Themenliste der Grossansicht ------------------------------------ */
  var topics = qsa('.vs-topic');
  var tg = topics.map(function (t, i) { return new Group(t, { from: { opacity: i === 0 ? 1 : TOPIC_DIM }, config: TOPIC }); });
  function setTopics(idx) {
    var active = Math.floor(idx * topics.length / N), cfg = scaled(TOPIC, state.k);
    tg.forEach(function (g, i) { g.to({ opacity: i === active ? 1 : TOPIC_DIM }, cfg); });
  }

  /* ---- Anzeige der wirksamen Zahlen ------------------------------------ */
  function updateNums() {
    qsa('[data-vs-nums]').forEach(function (el) {
      var tr = TR[el.getAttribute('data-vs-nums')]; if (!tr) return;
      el.textContent = tr.springs.map(function (s) { return s.label + ' ' + springText(s.cfg, state.k); }).join(' · ') + (state.k > 1 ? ' (' + state.k + 'x)' : '');
    });
    qsa('[data-vs-takt-text]').forEach(function (el) { el.textContent = taktText(state.takt); });
  }
  function updateIdx() { qsa('[data-vs-idx-text]').forEach(function (el) { el.textContent = pad(state.idx + 1) + ' / ' + pad(N); }); }
  function setPressed(list, test) { list.forEach(function (b) { b.setAttribute('aria-pressed', test(b) ? 'true' : 'false'); }); }

  /* ---- Uhr ------------------------------------------------------------- */
  function tick() {
    state.step += 1; state.idx = (state.idx + 1) % N;
    frames.forEach(function (f) { f.go(state.idx, state.step); });
    setTopics(state.idx);
    updateIdx();
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function start() { stop(); if (state.running) timer = setInterval(tick, state.takt); }
  function updatePause() {
    var b = qs('[data-vs-pause]'); if (!b) return;
    b.textContent = state.running ? 'Pause' : 'Weiter';
    b.setAttribute('aria-pressed', state.running ? 'false' : 'true');
  }

  /* ---- Aufbau ---------------------------------------------------------- */
  if (!tpl) return;
  qsa('[data-vs-frame]').forEach(function (el) {
    var id = el.getAttribute('data-vs-frame'), f = new Frame(el);
    f.use(TR[id] ? id : ORDER[0]);
    frames.push(f);
    if (id === 'big') f.isBig = true;
  });
  var big = frames.filter(function (f) { return f.isBig; })[0];
  var bigMeta = qs('[data-vs-big-meta]');
  function pickBig(id) {
    if (!big || !TR[id]) return;
    big.use(id);
    setPressed(qsa('[data-vs-pick]'), function (b) { return b.getAttribute('data-vs-pick') === id; });
    if (bigMeta) {
      var cell = qs('.vs-cell[data-vs="' + id + '"]');
      bigMeta.innerHTML = '';
      if (cell) {
        bigMeta.appendChild(qs('.vs-cell__name', cell).cloneNode(true));
        bigMeta.appendChild(qs('.vs-cell__desc', cell).cloneNode(true));
        bigMeta.appendChild(qs('.vs-meta', cell).cloneNode(true));
      }
    }
    updateNums();
  }
  pickBig('dissolve');

  var taktBtns = qsa('[data-vs-takt]'), tempoBtns = qsa('[data-vs-tempo]');
  taktBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      state.takt = parseInt(b.getAttribute('data-vs-takt'), 10) || TAKT_PROMPT;
      setPressed(taktBtns, function (x) { return x === b; });
      updateNums(); start();
    });
  });
  tempoBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      state.k = parseInt(b.getAttribute('data-vs-tempo'), 10) || 1;
      setPressed(tempoBtns, function (x) { return x === b; });
      updateNums();
    });
  });
  var pauseBtn = qs('[data-vs-pause]');
  if (pauseBtn) pauseBtn.addEventListener('click', function () { state.running = !state.running; updatePause(); start(); });
  var stepBtn = qs('[data-vs-step]');
  if (stepBtn) stepBtn.addEventListener('click', function () { state.running = false; stop(); updatePause(); tick(); });
  qsa('[data-vs-pick]').forEach(function (b) { b.addEventListener('click', function () { pickBig(b.getAttribute('data-vs-pick')); }); });

  if (RM) { var note = qs('[data-vs-rm]'); if (note) note.hidden = false; }
  updateNums(); updateIdx(); updatePause();
  start();

  // Tab im Hintergrund: Uhr anhalten, damit beim Zurueckkommen nicht alles auf einmal springt
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });

  window.__vs = { state: state, frames: frames, TR: TR };   // fuer Tests
})();
