// Gemeinsame Bausteine fuer die PowerPoint-Vorlage IdeeRoth AG (Stand 15.10.2026, alle Kundenentscheide):
// Theme und Tokens der Website, Layouts in Deutsch und Englisch, Referenzfolien (Bausteine, Farbkonzept, Farbregeln)
// und die Beispielfolien. Wird von build_template.js (.potx) und build_samples.js (Beispieldecks) verwendet.
const pptxgen = require('pptxgenjs');
const { applyTheme } = require('./apply_theme.js');
const A = __dirname + '/assets/';

const THEME = {
  name: 'IdeeRoth', headFontFace: 'Inter', bodyFontFace: 'Inter',
  colors: { dk1: '111418', lt1: 'E7FFF2', dk2: '707981', lt2: 'B7F3D0', accent1: '25C77A', accent2: 'B7F3D0', accent3: '707981',
            accent4: 'C4C8CC', accent5: 'B8463A', accent6: 'E2A33D', hlink: '25C77A', folHlink: 'B7F3D0' },
};
const BLACK = '111418', MINT = 'E7FFF2', WHITE = 'FFFFFF', GREEN = '25C77A', FRESH = 'B7F3D0', STEEL = '707981', LGRAY = 'C4C8CC';
const RED = 'B8463A', AMBER = 'E2A33D';
const LINE_L = '91A19B', LINE_D = '707274', LINE_W = 'A0A1A3';
const MUTED_D = 'A0A1A3';
const LW = 0.5;
const W = 13.333, H = 7.5, M = 0.6;
const VX = W - 0.5, R = W - 1.0, CW = R - M;
const GROUNDS = {
  dark:  { bg: BLACK, fg: MINT,  muted: MUTED_D, line: LINE_D, mk: MINT,  name: 'DUNKEL' },
  mint:  { bg: MINT,  fg: BLACK, muted: STEEL,   line: LINE_L, mk: BLACK, name: 'MINT' },
  white: { bg: WHITE, fg: BLACK, muted: STEEL,   line: LINE_W, mk: BLACK, name: 'WEISS' },
};
const G = (k) => GROUNDS[k];
const BUL = { code: '2022' };
const FOOTER_MARK = 'IDEEROTH AG';   // Erkennungsmerkmal fuer finish.py (senkrechte Fusszeile -> Fusszeilen-Platzhalter)

// Sprachabhaengige Texte der Layouts
const T = {
  de: {
    tag: 'DE', eyebrow: '0N //  ABSCHNITT', title: 'Titel', sub: 'Untertitel', chapter: 'Kapitel', lead: 'Kurztext', text: 'Text', photo: 'Foto',
    quote: 'Aussage', source: 'Quelle', caption: 'BILDLEGENDE', titlePhoto: 'Titel auf dem Foto', contact: 'Sprechen wir über Ihr Projekt.',
    footer: 'IDEEROTH AG  ·  TITEL DER PRÄSENTATION  ·  DATUM', conf: 'VERTRAULICH', notice: 'SCHUTZVERMERK ISO 16016 BEACHTEN',
    names: { TITEL: '01 Titel (dunkel)', KAPITEL: '02 Kapitel (dunkel)', ZITAT: '03 Zitat (dunkel)', KONTAKT: '04 Kontakt (dunkel)', FOTO: '05 Foto vollflächig',
             TEXT_MINT: '06 Text (mint)', TEXT_WEISS: '07 Text (weiss)', TEXT_FOTO_MINT: '08 Text und Foto (mint)', TEXT_FOTO_WEISS: '09 Text und Foto (weiss)',
             INHALT_MINT: '10 Inhalt (mint)', INHALT_WEISS: '11 Inhalt (weiss)', INHALT_V_MINT: '12 Inhalt vertraulich (mint)', INHALT_V_WEISS: '13 Inhalt vertraulich (weiss)',
             LEER_MINT: '14 Leer (mint)', LEER_WEISS: '15 Leer (weiss)', LEER_DUNKEL: '16 Leer (dunkel)' },
  },
  en: {
    tag: 'EN', eyebrow: '0N //  SECTION', title: 'Title', sub: 'Subtitle', chapter: 'Chapter', lead: 'Short text', text: 'Text', photo: 'Photo',
    quote: 'Statement', source: 'Source', caption: 'CAPTION', titlePhoto: 'Title on the photo', contact: 'Let us talk about your project.',
    footer: 'IDEEROTH AG  ·  PRESENTATION TITLE  ·  DATE', conf: 'CONFIDENTIAL', notice: 'REFER TO PROTECTION NOTICE ISO 16016',
    names: { TITEL: '01 Title (dark)', KAPITEL: '02 Chapter (dark)', ZITAT: '03 Quote (dark)', KONTAKT: '04 Contact (dark)', FOTO: '05 Full-bleed photo',
             TEXT_MINT: '06 Text (mint)', TEXT_WEISS: '07 Text (white)', TEXT_FOTO_MINT: '08 Text and photo (mint)', TEXT_FOTO_WEISS: '09 Text and photo (white)',
             INHALT_MINT: '10 Content (mint)', INHALT_WEISS: '11 Content (white)', INHALT_V_MINT: '12 Content confidential (mint)', INHALT_V_WEISS: '13 Content confidential (white)',
             LEER_MINT: '14 Blank (mint)', LEER_WEISS: '15 Blank (white)', LEER_DUNKEL: '16 Blank (dark)' },
  },
};

function newPres(title) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = 'IdeeRoth AG'; pres.company = 'IdeeRoth AG'; pres.title = title;
  pres.theme = { headFontFace: 'Inter', bodyFontFace: 'Inter' };
  return pres;
}

// ---- Bausteine fuer Layouts ----------------------------------------------------------------
const ln = (k, extra) => Object.assign({ color: G(k).line, width: LW }, extra || {});
function footerV(k, text) {   // senkrechte Fusszeile rechts (wird von finish.py zum Fusszeilen-Platzhalter)
  const w = 5.5, endY = 6.72;
  return [{ text: { text, options: { x: VX - w / 2, y: endY - w / 2 - 0.14, w, h: 0.28, fontSize: 8, color: G(k).muted, charSpacing: -0.2, margin: 0, rotate: 270, align: 'left', valign: 'middle' } } }];
}
function slideNo(k) { return { x: VX - 0.4, y: 6.9, w: 0.8, h: 0.28, fontSize: 8, color: G(k).muted, align: 'center' }; }
function logo(k, y) { return { image: { x: M, y: y === undefined ? 0.48 : y, w: 0.95, h: 0.342, path: A + (k === 'dark' ? 'mark-mint.png' : 'mark-black.png') } }; }
function ph(name, type, o, text) { return { placeholder: { options: Object.assign({ name, type, margin: 0, valign: 'top' }, o), text } }; }
const eyebrowOpts = (k) => ({ fontSize: 10, color: G(k).muted, charSpacing: -0.3 });
const titleOpts = (size, color) => ({ fontSize: size, color, charSpacing: -(size / 50), lineSpacingMultiple: 0.95, bold: false, align: 'left' });
function flagObjs(k, t) {   // Kennzeichnung oben rechts (V-2 rot) mit Kurzform des Schutzvermerks darunter
  return [
    { rect: { x: R - 1.3, y: 0.5, w: 1.3, h: 0.3, fill: { color: RED }, line: { color: RED, width: LW } } },
    { text: { text: t.conf, options: { x: R - 1.3, y: 0.5, w: 1.3, h: 0.3, fontSize: 8, color: WHITE, charSpacing: -0.2, align: 'center', valign: 'middle', margin: 0 } } },
    { text: { text: t.notice, options: { x: R - 3.2, y: 0.84, w: 3.2, h: 0.2, fontSize: 6.5, color: G(k).muted, charSpacing: -0.2, align: 'right', valign: 'top', margin: 0 } } },
  ];
}
const contentHead = (k, t) => [
  logo(k),
  ph('eyebrow', 'body', { x: M, y: 1.3, w: 8, h: 0.3, ...eyebrowOpts(k) }, t.eyebrow),
  ph('title', 'title', { x: M, y: 1.62, w: 11, h: 0.95, ...titleOpts(34, G(k).fg) }, t.title),
];
const bgOf = (k) => ({ color: G(k).bg });

// Alle 16 Layouts einer Sprache; liefert die masterName-Tabelle
function defineLayouts(pres, lang) {
  const t = T[lang], N = {}, defs = {};
  const name = (key) => { N[key] = t.tag + ' · ' + t.names[key]; return key; };
  // Definitionen sammeln und in der Reihenfolge der Nummern 01 bis 16 anlegen (so zeigt sie PowerPoint im Layout-Menue)
  const real = pres.defineSlideMaster.bind(pres);
  pres.defineSlideMaster = (spec) => { defs[spec.title] = spec; };
  pres.defineSlideMaster({ title: name('TITEL'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [
    logo('dark'),
    ph('eyebrow', 'body', { x: M, y: 2.55, w: 11, h: 0.3, ...eyebrowOpts('dark') }, t.eyebrow),
    ph('title', 'title', { x: M, y: 2.9, w: 11.5, h: 2.0, ...titleOpts(60, MINT) }, t.title),
    ph('sub', 'body', { x: M, y: 5.0, w: 9, h: 0.8, fontSize: 18, color: MINT, lineSpacingMultiple: 1.2 }, t.sub),
    ...footerV('dark', t.footer),
  ]});
  pres.defineSlideMaster({ title: name('KAPITEL'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [
    logo('dark'),
    ph('eyebrow', 'body', { x: M, y: 1.3, w: 8, h: 0.3, ...eyebrowOpts('dark') }, t.eyebrow),
    ph('title', 'title', { x: M, y: 1.85, w: 11.5, h: 3.2, ...titleOpts(84, MINT) }, t.chapter),
    ph('lead', 'body', { x: 7.0, y: 5.35, w: R - 7.0, h: 1.3, fontSize: 14, color: MUTED_D, lineSpacingMultiple: 1.2 }, t.lead),
    ...footerV('dark', t.footer),
  ]});
  pres.defineSlideMaster({ title: name('ZITAT'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [
    logo('dark'),
    ph('eyebrow', 'body', { x: M, y: 1.9, w: 8, h: 0.3, ...eyebrowOpts('dark') }, t.eyebrow),
    ph('quote', 'title', { x: M, y: 2.3, w: 11.3, h: 2.6, ...titleOpts(44, MINT) }, t.quote),
    ph('source', 'body', { x: M, y: 5.2, w: 8, h: 0.4, fontSize: 12, color: MUTED_D }, t.source),
    ...footerV('dark', t.footer),
  ]});
  pres.defineSlideMaster({ title: name('KONTAKT'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [
    logo('dark'),
    ph('title', 'title', { x: M, y: 1.45, w: 11.3, h: 1.2, ...titleOpts(44, MINT) }, t.contact),
    ...footerV('dark', t.footer),
  ]});
  pres.defineSlideMaster({ title: name('FOTO'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [
    ph('photo', 'pic', { x: 0, y: 0, w: W, h: H, color: BLACK }, t.photo),
    ph('title', 'title', { x: M, y: 5.0, w: 9.5, h: 1.3, ...titleOpts(44, MINT) }, t.titlePhoto),
    ph('caption', 'body', { x: M, y: 6.45, w: 9, h: 0.3, ...eyebrowOpts('dark'), color: FRESH }, t.caption),
    ...footerV('dark', t.footer),
  ]});
  pres.defineSlideMaster({ title: name('LEER_DUNKEL'), background: bgOf('dark'), slideNumber: slideNo('dark'), objects: [logo('dark'), ...footerV('dark', t.footer)] });
  for (const [k, sfx] of [['mint', 'MINT'], ['white', 'WEISS']]) {
    pres.defineSlideMaster({ title: name('TEXT_' + sfx), background: bgOf(k), slideNumber: slideNo(k), objects: [
      ...contentHead(k, t),
      ph('body', 'body', { x: M, y: 2.85, w: 7.4, h: 3.8, fontSize: 14, color: BLACK, lineSpacingMultiple: 1.2, paraSpaceAfter: 8, bullet: false }, t.text),
      ...footerV(k, t.footer),
    ]});
    pres.defineSlideMaster({ title: name('TEXT_FOTO_' + sfx), background: bgOf(k), slideNumber: slideNo(k), objects: [
      ...contentHead(k, t),
      ph('body', 'body', { x: M, y: 2.85, w: 5.5, h: 3.8, fontSize: 14, color: BLACK, lineSpacingMultiple: 1.2, paraSpaceAfter: 8 }, t.text),
      ph('photo', 'pic', { x: 6.9, y: 2.85, w: R - 6.9, h: 3.75, color: BLACK }, t.photo),
      ...footerV(k, t.footer),
    ]});
    pres.defineSlideMaster({ title: name('INHALT_' + sfx), background: bgOf(k), slideNumber: slideNo(k), objects: [...contentHead(k, t), ...footerV(k, t.footer)] });
    pres.defineSlideMaster({ title: name('INHALT_V_' + sfx), background: bgOf(k), slideNumber: slideNo(k), objects: [...contentHead(k, t), ...flagObjs(k, t), ...footerV(k, t.footer)] });
    pres.defineSlideMaster({ title: name('LEER_' + sfx), background: bgOf(k), slideNumber: slideNo(k), objects: [logo(k), ...footerV(k, t.footer)] });
  }
  pres.defineSlideMaster = real;
  Object.keys(defs).sort((a, b) => parseInt(t.names[a]) - parseInt(t.names[b])).forEach((key) => real(Object.assign(defs[key], { title: N[key] })));
  return N;
}

// ---- Bausteine fuer Folien ---------------------------------------------------------------
function helpers(pres) {
  const h = {};
  h.marks = (s, x, y, w, hh, k) => {
    const c = G(k).mk, d = 0.08, o = 0.1;
    [[x - o, y - o], [x + w + o - d, y - o], [x - o, y + hh + o - d], [x + w + o - d, y + hh + o - d]].forEach(([px, py], i) =>
      s.addShape(pres.ShapeType.ellipse, { x: px, y: py, w: d, h: d, fill: { color: c }, line: { color: c, width: 0 }, objectName: 'Eckmarker ' + (i + 1) }));
  };
  h.hair = (s, x, y, w, k, name) => s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: ln(k), objectName: name || 'Linie' });
  h.vhair = (s, x, y, hh, k, name) => s.addShape(pres.ShapeType.line, { x, y, w: 0, h: hh, line: ln(k), objectName: name || 'Linie senkrecht' });
  h.frame = (s, x, y, w, hh, k, name, fill) => s.addShape(pres.ShapeType.rect, { x, y, w, h: hh, fill: fill || { color: G(k).bg, transparency: 100 }, line: ln(k), objectName: name || 'Rahmen' });
  h.eyebrow = (s, text, x, y, w, k, extra) => s.addText(text, Object.assign({ x, y, w, h: 0.28, fontSize: 10, color: G(k).muted, charSpacing: -0.3, margin: 0, isTextBox: true, objectName: 'Eyebrow ' + text }, extra || {}));
  h.photo = (s, file, x, y, w, hh, k, name) => { s.addImage({ path: A + file, x, y, w, h: hh, sizing: { type: 'cover', w, h: hh }, objectName: name || 'Foto' }); h.marks(s, x, y, w, hh, k); };
  const CHIP = { rot: [RED, WHITE, RED], orange: [AMBER, BLACK, AMBER], gruen: [FRESH, BLACK, FRESH], fest: [BLACK, MINT, BLACK], aktiv: [GREEN, BLACK, GREEN] };
  h.chip = (s, x, y, text, kind, k, w, name) => {
    const [fill, col, lc] = kind === 'neutral' ? [G(k).bg, G(k).fg, G(k).fg] : kind === 'offen' ? [G(k).bg, G(k).muted, G(k).line] : CHIP[kind];
    const cw = w || 1.05;
    s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: 0.26, fill: { color: fill }, line: { color: lc, width: LW }, objectName: name || 'Label ' + text });
    s.addText(text, { x, y, w: cw, h: 0.26, fontSize: 7.5, color: col, charSpacing: -0.2, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: (name || 'Label ' + text) + ' Text' });
  };
  h.bul = (t, extra) => ({ text: t, options: Object.assign({ bullet: BUL, breakLine: true, paraSpaceAfter: 4 }, extra || {}) });
  return h;
}

// ---- Referenzfolien: Bausteine, Farbkonzept, Farbregeln (in der Vorlage ausgeblendet) ---------------------
function addReferenceSlides(pres, lang, N, hidden) {
  const d = (de, en) => lang === 'de' ? de : en;
  const h = helpers(pres);
  let s;
  // Bausteine
  s = pres.addSlide({ masterName: N.INHALT_MINT }); if (hidden) s.hidden = true;
  s.addText(d('VORLAGE  ·  GRAFISCHE ELEMENTE', 'TEMPLATE  ·  GRAPHIC ELEMENTS'), { placeholder: 'eyebrow' });
  s.addText(d('Bausteine für eigene Folien', 'Building blocks for your own slides'), { placeholder: 'title' });
  {
    const k = 'mint', cw3 = (CW - 2 * 0.4) / 3, by = 2.9, colX = (i) => M + i * (cw3 + 0.4);
    h.eyebrow(s, d('01 //  TEXTFELDER', '01 //  TEXT FIELDS'), colX(0), by, cw3, k);
    h.frame(s, colX(0), by + 0.4, cw3, 0.9, k, 'Textfeld mit Rahmen', { color: WHITE, transparency: 65 });
    s.addText(d('Textfeld mit dünnem Rahmen für Hinweise, Annahmen oder Zitate aus Unterlagen.', 'Text field with a thin frame for notes, assumptions or quotations from documents.'), { x: colX(0) + 0.2, y: by + 0.5, w: cw3 - 0.4, h: 0.7, fontSize: 11, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Textfeld Text' });
    s.addShape(pres.ShapeType.rect, { x: colX(0), y: by + 1.5, w: cw3, h: 0.9, fill: { color: FRESH }, line: { color: FRESH, width: 0 }, objectName: 'Hervorhebung' });
    s.addText(d('Hervorhebung auf Fresh Mint für das Wichtigste einer Folie, eine pro Folie.', 'Highlight on Fresh Mint for the most important point of a slide, one per slide.'), { x: colX(0) + 0.2, y: by + 1.6, w: cw3 - 0.4, h: 0.7, fontSize: 11, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Hervorhebung Text' });
    s.addShape(pres.ShapeType.rect, { x: colX(0), y: by + 2.6, w: cw3, h: 0.9, fill: { color: BLACK }, line: { color: BLACK, width: 0 }, objectName: 'Kernaussage' });
    s.addText(d('Kernaussage auf Carbon Black, Text in Ice Mint, Zahl oder Stichwort in Signal Green.', 'Key message on Carbon Black, text in Ice Mint, number or keyword in Signal Green.'), { x: colX(0) + 0.2, y: by + 2.7, w: cw3 - 0.4, h: 0.7, fontSize: 11, color: MINT, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Kernaussage Text' });
    h.eyebrow(s, d('02 //  LINIEN, PFEILE, MARKER', '02 //  LINES, ARROWS, MARKERS'), colX(1), by, cw3, k);
    [[BLACK, 1, d('Pfeil, Ablauf', 'Arrow, sequence')], [GREEN, 1.25, d('Pfeil, Betonung', 'Arrow, emphasis')], [STEEL, 1, d('Pfeil, Option', 'Arrow, option')]].forEach(([c, wdt, t], i) => {
      s.addShape(pres.ShapeType.line, { x: colX(1), y: by + 0.6 + i * 0.4, w: cw3 - 1.6, h: 0, line: { color: c, width: wdt, endArrowType: 'triangle' }, objectName: 'Pfeil ' + (i + 1) });
      s.addText(t, { x: colX(1) + cw3 - 1.5, y: by + 0.47 + i * 0.4, w: 1.5, h: 0.26, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Pfeil Text ' + (i + 1) });
    });
    h.hair(s, colX(1), by + 1.85, cw3 - 1.6, k, 'Linie Beispiel');
    s.addText(d('Linie, Trenner', 'Line, divider'), { x: colX(1) + cw3 - 1.5, y: by + 1.72, w: 1.5, h: 0.26, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Linie Text' });
    s.addShape(pres.ShapeType.rect, { x: colX(1), y: by + 2.25, w: 1.3, h: 0.85, fill: { color: LGRAY }, line: { color: LGRAY, width: 0 }, objectName: 'Bildplatz' });
    h.marks(s, colX(1), by + 2.25, 1.3, 0.85, k);
    s.addText(d('Runde Eckmarker um Fotos, Skizzen und Screenshots', 'Round corner markers around photos, sketches and screenshots'), { x: colX(1) + 1.6, y: by + 2.3, w: cw3 - 1.6, h: 0.8, fontSize: 9, color: STEEL, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Eckmarker Text' });
    s.addText([h.bul(d('Punkt statt Rechteck als Aufzählungszeichen', 'Dot instead of square as bullet'), { paraSpaceAfter: 0 }), h.bul(d('Gleicher Punkt in allen Listen', 'Same dot in every list'), { breakLine: false })], { x: colX(1), y: by + 3.3, w: cw3, h: 0.55, fontSize: 10, color: BLACK, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Aufzählung Beispiel' });
    h.eyebrow(s, d('03 //  STATUS UND FREIGABE (AMPEL)', '03 //  STATUS AND RELEASE (TRAFFIC LIGHT)'), colX(2), by, cw3, k);
    [[d('ERLEDIGT', 'DONE'), 'fest'], [d('AKTIV', 'ACTIVE'), 'aktiv'], [d('OFFEN', 'OPEN'), 'offen']].forEach(([t, kind], i) => h.chip(s, colX(2) + i * 1.25, by + 0.45, t, kind, k, 1.15));
    s.addText(d('Aufgabenstatus: erledigt, aktiv, offen (Markenfarben)', 'Task status: done, active, open (brand colours)'), { x: colX(2), y: by + 0.8, w: cw3, h: 0.26, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Status Erklärung' });
    [[d('VERTRAULICH', 'CONFIDENTIAL'), 'rot'], [d('IN PRÜFUNG', 'UNDER REVIEW'), 'orange'], [d('FREIGEGEBEN', 'RELEASED'), 'gruen']].forEach(([t, kind], i) => h.chip(s, colX(2) + i * 1.25, by + 1.25, t, kind, k, 1.15));
    s.addText(d('Freigabestatus als Ampel: Rot = Achtung, Verbot, vertraulich; Orange = in Prüfung, vorläufig; Grün = freigegeben. Nur für Labels, nie für Inhalte.', 'Release status as traffic light: red = attention, prohibition, confidential; amber = under review, preliminary; green = released. Labels only, never content.'), { x: colX(2), y: by + 1.6, w: cw3, h: 0.6, fontSize: 9, color: STEEL, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Ampel Erklärung' });
    h.chip(s, colX(2), by + 2.3, d('INTERN', 'INTERNAL'), 'neutral', k, 1.15);
    h.chip(s, colX(2) + 1.25, by + 2.3, d('ENTWURF', 'DRAFT'), 'neutral', k, 1.15);
    s.addText(d('Neutrale Labels ohne Ampelbedeutung', 'Neutral labels without traffic-light meaning'), { x: colX(2), y: by + 2.65, w: cw3, h: 0.26, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Neutral Erklärung' });
    s.addText(d('ZUR SIMULATION  →', 'TO THE SIMULATION  →'), { x: colX(2), y: by + 3.1, w: cw3, h: 0.3, fontSize: 10, color: BLACK, charSpacing: -0.3, margin: 0, isTextBox: true, objectName: 'Pfeil-Link' });
    s.addText(d('Pfeil-Link als Verweis auf eine andere Folie', 'Arrow link as reference to another slide'), { x: colX(2), y: by + 3.4, w: cw3, h: 0.26, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Pfeil-Link Text' });
  }
  s.addNotes(d('Bausteine zum Kopieren. Diese Folie ist in der Vorlage ausgeblendet und wird nicht präsentiert.', 'Building blocks to copy. This slide is hidden in the template and is not presented.'));

  // Farbkonzept
  s = pres.addSlide({ masterName: N.INHALT_MINT }); if (hidden) s.hidden = true;
  s.addText(d('VORLAGE  ·  FARBEN', 'TEMPLATE  ·  COLOURS'), { placeholder: 'eyebrow' });
  s.addText(d('Farbkonzept: Marke, Grund, Status', 'Colour concept: brand, ground, status'), { placeholder: 'title' });
  {
    const k = 'mint', sw = (CW - 5 * 0.2) / 6, sy = 2.75, sh = 0.75;
    const brand = [
      ['Carbon Black', BLACK, d('GRUND DARK  ·  TEXT AUF HELL', 'DARK GROUND  ·  TEXT ON LIGHT'), '#111418', '17 · 20 · 24', '29 · 17 · 0 · 91', '214° · 17 % · 8 %'],
      ['Ice Mint', MINT, d('GRUND MINT  ·  TEXT AUF DARK', 'MINT GROUND  ·  TEXT ON DARK'), '#E7FFF2', '231 · 255 · 242', '9 · 0 · 5 · 0', '148° · 100 % · 95 %'],
      ['Signal Green', GREEN, d('EIN AKZENT PRO FOLIE', 'ONE ACCENT PER SLIDE'), '#25C77A', '37 · 199 · 122', '81 · 0 · 39 · 22', '151° · 69 % · 46 %'],
      ['Fresh Mint', FRESH, d('ZWEITE HERVORHEBUNG  ·  LINKS', 'SECOND HIGHLIGHT  ·  LINKS'), '#B7F3D0', '183 · 243 · 208', '25 · 0 · 14 · 5', '145° · 71 % · 84 %'],
      ['Steel Gray', STEEL, d('ZWEITTEXT  ·  LABELS  ·  INAKTIV', 'SECONDARY TEXT  ·  LABELS  ·  INACTIVE'), '#707981', '112 · 121 · 129', '13 · 6 · 0 · 49', '208° · 7 % · 47 %'],
      ['Light Gray', LGRAY, d('PLATZHALTER  ·  IST-WERTE', 'PLACEHOLDERS  ·  AS-IS VALUES'), '#C4C8CC', '196 · 200 · 204', '4 · 2 · 0 · 20', '210° · 7 % · 78 %'],
    ];
    brand.forEach(([name, c, role, hex, rgb, cmyk, hsl], i) => {
      const x = M + i * (sw + 0.2);
      s.addShape(pres.ShapeType.rect, { x, y: sy, w: sw, h: sh, fill: { color: c }, line: ln(k), objectName: 'Muster ' + name });
      s.addText(name, { x, y: sy + sh + 0.08, w: sw, h: 0.3, fontSize: 12, color: BLACK, charSpacing: -0.2, margin: 0, isTextBox: true, objectName: 'Farbname ' + name });
      s.addText(role, { x, y: sy + sh + 0.37, w: sw, h: 0.4, fontSize: 7.5, color: STEEL, charSpacing: -0.2, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Rolle ' + name });
      s.addText([{ text: 'HEX  ' + hex, options: { breakLine: true } }, { text: 'RGB  ' + rgb, options: { breakLine: true } }, { text: 'CMYK  ' + cmyk, options: { breakLine: true } }, { text: 'HSL  ' + hsl }],
        { x, y: sy + sh + 0.8, w: sw, h: 0.7, fontSize: 8, color: BLACK, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true, valign: 'top', objectName: 'Farbwerte ' + name });
    });
    h.hair(s, M, 5.2, CW, k, 'Linie Status');
    h.eyebrow(s, d('GRUNDFARBEN', 'GROUND COLOURS'), M, 5.3, 5, k);
    [[d('Weiss', 'White'), WHITE, d('Unterlagen, Druck, dichte Inhalte', 'Documents, print, dense content')], ['Mint', MINT, d('Präsentation am Bildschirm', 'Presentation on screen')], ['Dark', BLACK, d('Titel, Kapitel, Zitat, Schluss', 'Title, chapter, quote, closing')]].forEach(([name, c, use], i) => {
      const x = M + i * 2.0;
      s.addShape(pres.ShapeType.rect, { x, y: 5.65, w: 0.55, h: 0.55, fill: { color: c }, line: ln(k), objectName: 'Grund ' + name });
      s.addText([{ text: name, options: { color: BLACK, breakLine: true } }, { text: use, options: { color: STEEL, fontSize: 7.5 } }], { x: x + 0.65, y: 5.63, w: 1.2, h: 0.6, fontSize: 10, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Grund Text ' + name });
    });
    const sx = M + 6.1;
    h.eyebrow(s, d('STATUSFARBEN (NUR FÜR LABELS)', 'STATUS COLOURS (LABELS ONLY)'), sx, 5.3, 5, k);
    [[d('Rot', 'Red'), RED, d('Achtung, Verbot, vertraulich', 'Attention, prohibition, confidential'), '#B8463A · 184 · 70 · 58'], [d('Orange', 'Amber'), AMBER, d('In Prüfung, vorläufig', 'Under review, preliminary'), '#E2A33D · 226 · 163 · 61'], [d('Grün', 'Green'), FRESH, d('Freigegeben (Fresh Mint)', 'Released (Fresh Mint)'), '#B7F3D0 · 183 · 243 · 208']].forEach(([name, c, use, code], i) => {
      const x = sx + i * 1.88;
      s.addShape(pres.ShapeType.rect, { x, y: 5.65, w: 0.55, h: 0.55, fill: { color: c }, line: ln(k), objectName: 'Status ' + name });
      s.addText([{ text: name, options: { color: BLACK, breakLine: true } }, { text: use, options: { color: STEEL, fontSize: 7.5, breakLine: true } }, { text: code, options: { color: STEEL, fontSize: 7 } }], { x: x + 0.65, y: 5.63, w: 1.2, h: 0.8, fontSize: 10, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Status Text ' + name });
    });
  }
  s.addNotes(d('Farbkonzept. CMYK ist die Standard-Umrechnung ohne Farbprofil; Druckwerte mit der Druckerei festlegen. Diese Folie ist in der Vorlage ausgeblendet.', 'Colour concept. CMYK is the standard conversion without a colour profile; agree print values with the printer. This slide is hidden in the template.'));

  // Farbregeln
  s = pres.addSlide({ masterName: N.INHALT_WEISS }); if (hidden) s.hidden = true;
  s.addText(d('VORLAGE  ·  FARBEN', 'TEMPLATE  ·  COLOURS'), { placeholder: 'eyebrow' });
  s.addText(d('Welche Farbe wann', 'Which colour when'), { placeholder: 'title' });
  {
    const k = 'white', rules = lang === 'de' ? [
      ['Grund', 'Pro Folie eine Grundfarbe. Weiss für Unterlagen zum Lesen und Drucken, Mint für Präsentationen am Bildschirm, Dark für Titel, Kapitel, Zitat und Schluss. Innerhalb einer Präsentation nicht zwischen Weiss und Mint wechseln.'],
      ['Anteile', 'Grundfarbe rund 70 %, Text und Grau 25 %, Signal Green höchstens 5 %.'],
      ['Signal Green', 'Nur als Akzent: aktiver Zustand, eine Kennzahl, Heute-Linie, Buttons, Links, Label «Empfohlen», Reihe «Neu» im Diagramm, IdeeRoth-Balken im Terminplan. Nie für Fliesstext, nie als Fläche hinter Text.'],
      ['Fresh Mint', 'Fläche hinter einer Hervorhebung, Links und Hover auf Dark, helle Terminbalken, Label «Freigegeben».'],
      ['Linien', 'Textfarbe mit 40 % Deckkraft: #A0A1A3 auf Weiss, #91A19B auf Mint, #707274 (Weiss) auf Dark. 0.5 pt durchgezogen, wie die Linie im Hero der Website.'],
      ['Ampel', 'Rot, Orange und Grün nur für Freigabe-Labels: Rot = Achtung, Verbot, vertraulich; Orange = in Prüfung, vorläufig; Grün = freigegeben. Nie für Diagramme oder Text, sonst verliert die Ampel ihre Bedeutung.'],
      ['Druck', 'CMYK ist die Standard-Umrechnung ohne Farbprofil. Signal Green liegt ausserhalb des Druckfarbraums und wird matter; Druckwerte einmal mit der Druckerei festlegen.'],
      ['PowerPoint', 'Marken- und Statusfarben liegen als Designfarben im Farbwähler bereit, Abstufungen entstehen automatisch.'],
    ] : [
      ['Ground', 'One ground colour per slide. White for documents to read and print, Mint for presentations on screen, Dark for title, chapter, quote and closing. Do not switch between White and Mint within one presentation.'],
      ['Proportions', 'Ground colour about 70 %, text and grey 25 %, Signal Green at most 5 %.'],
      ['Signal Green', 'Accent only: active state, one key figure, today line, buttons, links, label "Recommended", series "New" in charts, IdeeRoth bars in the schedule. Never for body text, never as a surface behind text.'],
      ['Fresh Mint', 'Surface behind a highlight, links and hover on Dark, light schedule bars, label "Released".'],
      ['Lines', 'Text colour at 40 % opacity: #A0A1A3 on White, #91A19B on Mint, #707274 (white) on Dark. 0.5 pt solid, like the line in the hero of the website.'],
      ['Traffic light', 'Red, amber and green only for release labels: red = attention, prohibition, confidential; amber = under review, preliminary; green = released. Never for charts or text, otherwise the traffic light loses its meaning.'],
      ['Print', 'CMYK is the standard conversion without a colour profile. Signal Green lies outside the print gamut and will look duller; agree print values with the printer once.'],
      ['PowerPoint', 'Brand and status colours are available as theme colours in the colour picker; tints are generated automatically.'],
    ];
    const rcw = (CW - 0.5) / 2;
    rules.forEach(([t, dd], i) => {
      const col = i % 2, row = Math.floor(i / 2), x = M + col * (rcw + 0.5), y = 2.8 + row * 1.08;
      s.addText([{ text: t, options: { color: BLACK, fontSize: 12, breakLine: true } }, { text: dd, options: { color: STEEL, fontSize: 10 } }], { x, y, w: rcw, h: 0.9, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Regel ' + t });
      if (row < 3) h.hair(s, x, y + 0.98, rcw, k, 'Linie Regel ' + (i + 1));
    });
  }
  s.addNotes(d('Farbregeln. Diese Folie ist in der Vorlage ausgeblendet.', 'Colour rules. This slide is hidden in the template.'));
}

// ---- Beispielfolien (Inhalt wie die Vorschau, ohne Vorschau-Hinweise) ------------------------------------
function addSampleSlides(pres, lang, N) {
  const d = (de, en) => lang === 'de' ? de : en;
  const h = helpers(pres);
  let s;
  // Titel
  s = pres.addSlide({ masterName: N.TITEL });
  s.addText(d('IDEEROTH AG  ·  PRODUKTENTWICKLUNG AUS DER SCHWEIZ', 'IDEEROTH AG  ·  PRODUCT DEVELOPMENT FROM SWITZERLAND'), { placeholder: 'eyebrow' });
  s.addText(d('Aus weniger mehr entwickeln.', 'Develop more from less.'), { placeholder: 'title' });
  s.addText(d('Kundenpräsentation  ·  Romanshorn, 15. Oktober 2026', 'Customer presentation  ·  Romanshorn, 15 October 2026'), { placeholder: 'sub' });
  h.hair(s, M, 6.2, CW, 'dark', 'Linie Kennzahlen');
  [['20+', d('JAHRE ERFAHRUNG', 'YEARS OF EXPERIENCE')], ['100+', d('PROJEKTE', 'PROJECTS')], ['5', d('LEISTUNGEN', 'SERVICES')]].forEach(([num, l], i) => {
    const x = M + i * 3.2, nw = 0.14 + 0.2 * num.length;
    s.addText(num, { x, y: 6.28, w: nw, h: 0.5, fontSize: 24, color: MINT, charSpacing: -0.5, margin: 0, isTextBox: true, objectName: 'Kennzahl ' + (i + 1) });
    h.eyebrow(s, l, x + nw + 0.12, 6.4, 1.9, 'dark');
  });
  s.addNotes(d('Kennzahlen sind Platzhalter.', 'Key figures are placeholders.'));
  // Kapitel
  s = pres.addSlide({ masterName: N.KAPITEL });
  s.addText(d('02 //  UNTERNEHMEN', '02 //  COMPANY'), { placeholder: 'eyebrow' });
  s.addText('Swiss engineered.', { placeholder: 'title' });
  s.addText(d('Entwicklung, Konstruktion, Simulation und Prototyping im eigenen Haus. Von der ersten Idee bis zur Serie.', 'Development, design, simulation and prototyping in house. From the first idea to series production.'), { placeholder: 'lead' });
  // Text (mint) und Text (weiss)
  const textBody = [
    { text: d('Von der ersten Idee bis zur fertigen Serienentwicklung: Konstruktion, Simulation, Entwicklung und Prototyping unter einem Dach.', 'From the first idea to series production: engineering, simulation, development and prototyping under one roof.'), options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: d('Unser Team unterstützt Kunden bei der Produktentwicklung und verbessert so deren Wettbewerbsfähigkeit. Wir legen Wert auf:', 'Our team supports customers in product development and so improves their competitiveness. We value:'), options: { breakLine: true, paraSpaceAfter: 10 } },
    h.bul(d('Eine unabhängige und neutrale Sichtweise', 'An independent and neutral perspective')),
    h.bul(d('Eine zielgerichtete Umsetzung und Resultaterreichung', 'Targeted implementation and results')),
    h.bul(d('Einen starken technologischen und betriebswirtschaftlichen Leistungsverbund', 'A strong technological and business network')),
    h.bul(d('Branchenspezifisches Anwendungsfachwissen', 'Industry-specific application expertise'), { breakLine: false }),
  ];
  for (const key of ['TEXT_MINT', 'TEXT_WEISS']) {
    s = pres.addSlide({ masterName: N[key] });
    s.addText(d('02 //  UNTERNEHMEN', '02 //  COMPANY'), { placeholder: 'eyebrow' });
    s.addText(d('Was wir tun', 'What we do'), { placeholder: 'title' });
    s.addText(textBody, { placeholder: 'body' });
  }
  // Text und Foto
  s = pres.addSlide({ masterName: N.TEXT_FOTO_MINT });
  s.addText(d('03 //  KOMPETENZEN', '03 //  EXPERTISE'), { placeholder: 'eyebrow' });
  s.addText(d('Konstruktion mit 3D-CAD', 'Design with 3D CAD'), { placeholder: 'title' });
  s.addText([
    { text: d('Wir konstruieren Baugruppen, Vorrichtungen und Apparate so, dass sie sich wirtschaftlich fertigen lassen.', 'We design assemblies, fixtures and devices so that they can be manufactured economically.'), options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: d('Jede Entscheidung wird im Modell geprüft, bevor sie Geld kostet: Toleranzen, Montage, Materialwahl und Serientauglichkeit.', 'Every decision is checked in the model before it costs money: tolerances, assembly, choice of material and suitability for series production.'), options: { breakLine: true, paraSpaceAfter: 10 } },
    { text: d('Das Ergebnis sind weniger Teile, kürzere Wege und Produkte, die lange halten.', 'The result: fewer parts, shorter paths and products that last.') },
  ], { placeholder: 'body' });
  s.addImage({ path: A + 'p11.jpg', placeholder: 'photo', x: 6.9, y: 2.85, w: R - 6.9, h: 3.75, sizing: { type: 'cover', w: R - 6.9, h: 3.75 }, objectName: 'Foto Konstruktion' });
  h.marks(s, 6.9, 2.85, R - 6.9, 3.75, 'mint');
  // Foto vollflaechig
  s = pres.addSlide({ masterName: N.FOTO });
  s.addImage({ path: A + 'p07.jpg', placeholder: 'photo', x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H }, objectName: 'Foto vollflächig' });
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: BLACK, transparency: 45 }, line: { color: BLACK, width: 0 }, objectName: 'Schleier' });
  s.addImage({ path: A + 'mark-mint.png', x: M, y: 0.48, w: 0.95, h: 0.342, objectName: 'Logo' });
  h.hair(s, M, 4.75, CW, 'dark', 'Linie wie im Hero');
  s.addText(d('Von der ersten Idee. Bis zur Serie.', 'From the first idea. To series production.'), { placeholder: 'title' });
  s.addText(d('FOTO 07  ·  GEGENLICHT DURCH DIE OFFENE TÜR', 'PHOTO 07  ·  BACKLIGHT THROUGH THE OPEN DOOR'), { placeholder: 'caption' });
  s.addNotes(d('Foto in den Platzhalter einfügen, dann den Schleier (schwarzes Rechteck, 45 % transparent) darüber lassen.', 'Insert the photo into the placeholder and keep the veil (black rectangle, 45 % transparent) on top.'));
  // Karten
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('03 //  KOMPETENZEN', '03 //  EXPERTISE'), { placeholder: 'eyebrow' });
  s.addText(d('Kompetenzen unter einem Dach', 'Expertise under one roof'), { placeholder: 'title' });
  [['01', 'IDEATION', d('Ideation', 'Ideation'), 'p09.jpg', d('Ideen schärfen, Varianten bewerten, die einfachste Lösung finden.', 'Sharpen ideas, assess variants, find the simplest solution.')],
   ['02', d('ENTWICKLUNG', 'DEVELOPMENT'), d('Entwicklung', 'Development'), 'p11.jpg', d('Konstruktion mit 3D-CAD, fertigungsgerecht und serientauglich.', 'Design with 3D CAD, ready for manufacturing and series production.')],
   ['03', 'SIMULATION', 'Simulation', 'p13.jpg', d('Festigkeit und Strömung rechnen, bevor das erste Teil entsteht.', 'Calculate strength and flow before the first part is made.')]].forEach(([num, e, t, f, dd], i) => {
    const gap = 0.45, cw = (CW - 2 * gap) / 3, x = M + i * (cw + gap), y = 2.9;
    h.photo(s, f, x, y, cw, 2.2, 'mint', 'Karte ' + t);
    h.eyebrow(s, num + ' //  ' + e, x, y + 2.55, cw, 'mint');
    s.addText(t, { x, y: y + 2.85, w: cw, h: 0.45, fontSize: 20, color: BLACK, charSpacing: -0.4, margin: 0, isTextBox: true, objectName: 'Kartentitel ' + t });
    s.addText(dd, { x, y: y + 3.3, w: cw, h: 0.6, fontSize: 11, color: STEEL, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Kartentext ' + t });
  });
  // Prozess
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('04 //  LEISTUNGEN', '04 //  SERVICES'), { placeholder: 'eyebrow' });
  s.addText(d('So arbeiten wir', 'How we work'), { placeholder: 'title' });
  [d('Idee', 'Idea'), d('Konzept', 'Concept'), d('Konstruktion', 'Design'), d('Entwicklung', 'Development'), d('Prototyp', 'Prototype')].forEach((t, i) => {
    const y = 2.9 + i * 0.76, active = i === 0;
    s.addText('0' + (i + 1), { x: M, y: y + 0.1, w: 0.6, h: 0.3, fontSize: 10, color: active ? GREEN : STEEL, charSpacing: -0.3, margin: 0, isTextBox: true, objectName: 'Schritt Nummer ' + (i + 1) });
    s.addText(t, { x: M + 0.7, y, w: 5.6, h: 0.52, fontSize: 28, color: active ? BLACK : STEEL, charSpacing: -0.5, margin: 0, isTextBox: true, objectName: 'Schritt ' + (i + 1) });
    h.hair(s, M, y + 0.66, 6.4, 'mint', 'Linie Schritt ' + (i + 1));
  });
  h.photo(s, 'p19.jpg', 8.0, 2.9, R - 8.0, 3.4, 'mint', 'Prozessfoto');
  h.eyebrow(s, d('01 //  IDEE  ·  DREI MITARBEITENDE PRÜFEN BAUTEILE', '01 //  IDEA  ·  THREE COLLEAGUES CHECK PARTS'), 8.0, 6.6, R - 8.0, 'mint');
  // Zeilen (weiss)
  s = pres.addSlide({ masterName: N.INHALT_WEISS });
  s.addText(d('05 //  TEAM', '05 //  TEAM'), { placeholder: 'eyebrow' });
  s.addText(d('Wofür wir stehen', 'What we stand for'), { placeholder: 'title' });
  const rows = [['01 //  VISION', 'Better products for life.', d('Mit dieser Vision lösen wir Probleme mit unseren Ideen. Im Innovationsnetzwerk unserer Kunden sind wir langfristige Partnerin - nachhaltig, ökologisch und effizient.', 'With this vision we solve problems with our ideas. In our customers’ innovation networks we are a long-term partner - sustainable, ecological and efficient.')],
                ['02 //  MISSION', d('Aus weniger mehr entwickeln.', 'Develop more from less.'), d('Unser Team unterstützt Kunden bei der Produktentwicklung und verbessert so deren Wettbewerbsfähigkeit.', 'Our team supports customers in product development and so improves their competitiveness.')],
                [d('03 //  LEITBILD', '03 //  VALUES'), d('Verantwortungsbewusst, ehrlich, loyal.', 'Responsible, honest, loyal.'), d('Mitarbeitende sind unser wichtigstes Gut. Wir bieten attraktive Arbeitsplätze und fördern die Menschen gezielt.', 'Our people are our most important asset. We offer attractive workplaces and develop people deliberately.')]];
  rows.forEach(([e, name, b], i) => {
    const y = 2.95 + i * 1.3;
    h.eyebrow(s, e, M, y, 3, 'white');
    s.addText(name, { x: M, y: y + 0.3, w: 5.4, h: 0.75, fontSize: 20, color: BLACK, charSpacing: -0.4, lineSpacingMultiple: 1.0, margin: 0, isTextBox: true, valign: 'top', objectName: 'Zeile ' + (i + 1) + ' Titel' });
    s.addText(b, { x: 6.6, y: y + 0.05, w: R - 6.6, h: 0.95, fontSize: 12, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Zeile ' + (i + 1) + ' Text' });
    h.hair(s, M, y + 1.14, CW, 'white', 'Linie Zeile ' + (i + 1));
  });
  // Zitat
  s = pres.addSlide({ masterName: N.ZITAT });
  s.addText(d('02 //  UNTERNEHMEN  ·  MISSION', '02 //  COMPANY  ·  MISSION'), { placeholder: 'eyebrow' });
  s.addText(d('«Aus weniger mehr entwickeln - die einfachste Lösung ist meist die beste.»', '“Develop more from less - the simplest solution is usually the best.”'), { placeholder: 'quote' });
  s.addText(d('Alain Roth  ·  Gründer, IdeeRoth AG', 'Alain Roth  ·  Founder, IdeeRoth AG'), { placeholder: 'source' });
  // Kennzahlen
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('04 //  LEISTUNGEN', '04 //  SERVICES'), { placeholder: 'eyebrow' });
  s.addText(d('Ein Projekt in Zahlen', 'A project in figures'), { placeholder: 'title' });
  h.hair(s, M, 3.0, CW, 'mint', 'Linie Kennzahlen oben');
  [['38 %', d('WENIGER TEILE', 'FEWER PARTS'), d('Baugruppe neu gedacht, Montage halbiert.', 'Assembly rethought, assembly time halved.')], ['6', d('WOCHEN BIS ZUM PROTOTYP', 'WEEKS TO THE PROTOTYPE'), d('Vom Kickoff bis zum ersten Funktionsmuster.', 'From kick-off to the first functional sample.')], ['100 %', d('IM EIGENEN HAUS', 'IN HOUSE'), d('Konstruktion, Simulation und Prototyp.', 'Design, simulation and prototype.')]].forEach(([num, l, dd], i) => {
    const cw = (CW - 2 * 0.45) / 3, x = M + i * (cw + 0.45);
    s.addText(num, { x, y: 3.25, w: cw, h: 1.1, fontSize: 60, color: i === 1 ? GREEN : BLACK, charSpacing: -1.5, margin: 0, isTextBox: true, objectName: 'Kennzahl ' + (i + 1) });
    h.eyebrow(s, l, x, 4.45, cw, 'mint');
    s.addText(dd, { x, y: 4.8, w: cw, h: 0.6, fontSize: 12, color: STEEL, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Kennzahl Text ' + (i + 1) });
  });
  h.hair(s, M, 5.6, CW, 'mint', 'Linie Kennzahlen unten');
  // Agenda
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('AGENDA  ·  KUNDENPRÄSENTATION  ·  IRO0000', 'AGENDA  ·  CUSTOMER PRESENTATION  ·  IRO0000'), { placeholder: 'eyebrow' });
  s.addText(d('Worum es heute geht', 'What today is about'), { placeholder: 'title' });
  [d('Ausgangslage und Ziel', 'Starting point and goal'), d('Konzeptvarianten', 'Concept variants'), d('Simulation und Ergebnisse', 'Simulation and results'), d('Prototyp und Tests', 'Prototype and tests'), d('Terminplan und Kosten', 'Schedule and costs'), d('Nächste Schritte', 'Next steps')].forEach((t, i) => {
    const y = 2.85 + i * 0.62;
    s.addText('0' + (i + 1), { x: M, y: y + 0.06, w: 0.6, h: 0.3, fontSize: 10, color: i === 0 ? GREEN : STEEL, charSpacing: -0.3, margin: 0, isTextBox: true, objectName: 'Agenda Nummer ' + (i + 1) });
    s.addText(t, { x: M + 0.7, y, w: 5.6, h: 0.42, fontSize: 20, color: BLACK, charSpacing: -0.4, margin: 0, isTextBox: true, objectName: 'Agenda Punkt ' + (i + 1) });
    h.hair(s, M, y + 0.54, 6.4, 'mint', 'Linie Agenda ' + (i + 1));
  });
  h.photo(s, 'p23.jpg', 8.0, 2.85, R - 8.0, 3.55, 'mint', 'Agendafoto');
  h.eyebrow(s, d('15. OKTOBER 2026  ·  ROMANSHORN  ·  60 MINUTEN', '15 OCTOBER 2026  ·  ROMANSHORN  ·  60 MINUTES'), 8.0, 6.55, R - 8.0, 'mint');
  // Tabelle (weiss)
  s = pres.addSlide({ masterName: N.INHALT_WEISS });
  s.addText(d('05 //  TERMINPLAN UND KOSTEN', '05 //  SCHEDULE AND COSTS'), { placeholder: 'eyebrow' });
  s.addText(d('Arbeitspakete und Stand', 'Work packages and status'), { placeholder: 'title' });
  {
    const bNone = { type: 'none' }, bLine = { type: 'solid', pt: LW, color: LINE_W };
    const hdr = (t, align, first) => ({ text: t, options: { fontSize: 9, color: STEEL, charSpacing: -0.2, align: align || 'left', border: [bNone, bNone, bLine, bNone], valign: 'bottom', margin: [0, 0.08, 0.08, first ? 0 : 0.08] } });
    const cell = (t, o, first) => ({ text: t, options: Object.assign({ fontSize: 12, color: BLACK, border: [bNone, bNone, bLine, bNone], valign: 'middle', margin: [0.06, 0.08, 0.06, first ? 0 : 0.08] }, o || {}) });
    const st = (t, kind) => ({ text: t, options: { fontSize: 9, charSpacing: -0.2, color: kind === 'aktiv' ? GREEN : kind === 'offen' ? STEEL : BLACK, border: [bNone, bNone, bLine, bNone], valign: 'middle', margin: [0.06, 0.08, 0.06, 0.35] } });
    const dn = d('ERLEDIGT', 'DONE'), ac = d('AKTIV', 'ACTIVE'), op = d('OFFEN', 'OPEN'), dy = d(' Tage', ' days');
    s.addTable([
      [hdr(d('NR', 'NO'), null, true), hdr(d('ARBEITSPAKET', 'WORK PACKAGE')), hdr(d('VERANTWORTLICH', 'RESPONSIBLE')), hdr(d('TERMIN', 'DUE'), 'right'), hdr(d('AUFWAND', 'EFFORT'), 'right'), { text: 'STATUS', options: { fontSize: 9, color: STEEL, charSpacing: -0.2, border: [bNone, bNone, bLine, bNone], valign: 'bottom', margin: [0, 0.08, 0.08, 0.35] } }],
      [cell('01', { color: STEEL }, true), cell(d('Anforderungen und Lastenheft', 'Requirements and specification')), cell('A. Roth'), cell('31.03.2026', { align: 'right' }), cell('8' + dy, { align: 'right' }), st(dn)],
      [cell('02', { color: STEEL }, true), cell(d('Konzeptvarianten A und B', 'Concept variants A and B')), cell(d('Team Konstruktion', 'Design team')), cell('30.06.2026', { align: 'right' }), cell('22' + dy, { align: 'right' }), st(dn)],
      [cell('03', { color: GREEN }, true), cell(d('Simulation Festigkeit und Strömung', 'Simulation of strength and flow')), cell(d('Team Simulation', 'Simulation team')), cell('30.11.2026', { align: 'right' }), cell('12' + dy, { align: 'right' }), st(ac, 'aktiv')],
      [cell('04', { color: STEEL }, true), cell(d('Prototyp und Funktionstest', 'Prototype and functional test')), cell(d('Werkstatt', 'Workshop')), cell('28.02.2027', { align: 'right' }), cell('18' + dy, { align: 'right' }), st(op, 'offen')],
      [cell('05', { color: STEEL }, true), cell(d('Serienvorbereitung und Dokumentation', 'Series preparation and documentation')), cell('A. Roth'), cell('30.04.2027', { align: 'right' }), cell('10' + dy, { align: 'right' }), st(op, 'offen')],
      [cell('', null, true), cell('Total'), cell(''), cell(''), cell('70' + dy, { align: 'right' }), cell('')],
    ], { x: M, y: 2.85, w: CW, colW: [0.7, 3.8, 2.4, 1.45, 1.35, 2.03], rowH: 0.48, fontFace: 'Inter', fill: { color: WHITE }, objectName: 'Tabelle Arbeitspakete' });
  }
  // Diagramm (weiss)
  s = pres.addSlide({ masterName: N.INHALT_WEISS });
  s.addText(d('03 //  SIMULATION UND ERGEBNISSE', '03 //  SIMULATION AND RESULTS'), { placeholder: 'eyebrow' });
  s.addText(d('Weniger Teile, weniger Risiko', 'Fewer parts, less risk'), { placeholder: 'title' });
  {
    const labels = [d('Teile', 'Parts'), d('Montageschritte', 'Assembly steps'), d('Lieferanten', 'Suppliers'), d('Werkzeuge', 'Tools')];
    s.addChart(pres.ChartType.bar, [
      { name: d('Ist', 'As is'), labels, values: [48, 31, 9, 14] },
      { name: d('Neu', 'New'), labels, values: [30, 17, 5, 8] },
    ], { x: M, y: 2.8, w: 7.3, h: 3.6, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 60,
      chartColors: [LGRAY, GREEN], chartArea: { fill: { color: WHITE } }, plotArea: { fill: { color: WHITE } },
      showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: '+mn-lt', dataLabelFontSize: 10, dataLabelColor: BLACK,
      catAxisLabelFontFace: '+mn-lt', catAxisLabelFontSize: 10, catAxisLabelColor: BLACK, catAxisLineShow: false, catGridLine: { style: 'none' },
      valAxisLabelFontFace: '+mn-lt', valAxisLabelFontSize: 9, valAxisLabelColor: STEEL, valAxisLineShow: false, valGridLine: { color: LINE_W, style: 'solid', size: LW }, valAxisMaxVal: 60, valAxisMajorUnit: 20,
      showLegend: true, legendPos: 'b', legendFontFace: '+mn-lt', legendFontSize: 10, legendColor: BLACK, showTitle: false, objectName: 'Diagramm Teile' });
    s.addText(d('Anzahl je Baugruppe, Variante Ist gegenüber Variante Neu', 'Count per assembly, variant as is versus variant new'), { x: M, y: 6.45, w: 7.3, h: 0.25, fontSize: 9, color: STEEL, margin: 0, isTextBox: true, objectName: 'Diagrammlegende' });
    h.vhair(s, 8.4, 2.85, 3.85, 'white', 'Trennlinie Kommentar');
    s.addText([
      { text: d('38 % weniger Teile', '38 % fewer parts'), options: { fontSize: 20, color: BLACK, charSpacing: -0.4, breakLine: true, paraSpaceAfter: 10 } },
      { text: d('Die neue Baugruppe fasst mehrere Blechteile zu Spritzgussteilen zusammen. Das reduziert die Montageschritte um fast die Hälfte und die Lieferanten von neun auf fünf.', 'The new assembly combines several sheet-metal parts into injection-moulded parts. This cuts assembly steps almost in half and suppliers from nine to five.'), options: { fontSize: 12, color: BLACK, lineSpacingMultiple: 1.2, breakLine: true, paraSpaceAfter: 10 } },
      { text: d('Nächster Schritt: Werkzeugkosten mit zwei Lieferanten verifizieren.', 'Next step: verify tooling costs with two suppliers.'), options: { fontSize: 12, color: STEEL, lineSpacingMultiple: 1.2 } },
    ], { x: 8.75, y: 2.85, w: R - 8.75, h: 3.85, margin: 0, isTextBox: true, valign: 'top', objectName: 'Kommentar' });
  }
  // Terminplan (mint)
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('05 //  TERMINPLAN UND KOSTEN', '05 //  SCHEDULE AND COSTS'), { placeholder: 'eyebrow' });
  s.addText(d('Produktentstehung 2026', 'Product creation 2026'), { placeholder: 'title' });
  {
    const k = 'mint';
    const dim = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], cum = [0];
    for (let i = 0; i < 12; i++) cum.push(cum[i] + dim[i]);
    const doy = (m, dd) => cum[m - 1] + dd;
    const gx = M, gw = CW - 1.2, y0 = 2.8, rh = 0.36, bh = 0.27;
    const bandY = y0 + 8 * rh + 0.1, bandH = 0.34, kwY = bandY + bandH, kwH = 0.2, markY = kwY + kwH + 0.06;
    const X = (dy) => gx + ((dy - 1) / 365) * gw, XE = (dy) => gx + (dy / 365) * gw, XC = (dy) => gx + ((dy - 0.5) / 365) * gw;
    const months = lang === 'de' ? ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'] : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const kinds = { iro: [GREEN, BLACK], mint: [FRESH, BLACK], grey: [STEEL, WHITE] };
    const phases = [[d('Vorentwicklung', 'Pre-development'), [2, 1], [3, 31], 'iro'], [d('Produktdefinition', 'Product definition'), [2, 15], [4, 30], 'mint'],
                    [d('Konzeptentwicklung', 'Concept development'), [4, 1], [6, 15], 'mint'], [d('Serienentwicklung', 'Series development'), [6, 1], [8, 31], 'grey'],
                    [d('Serienvorbereitung', 'Series preparation'), [7, 15], [9, 30], 'grey'], [d('Serienanlauf', 'Ramp-up'), [9, 1], [10, 15], 'iro'],
                    [d('Serie', 'Series'), [10, 1], [11, 30], 'mint'], [d('Produktpflege', 'Product care'), [11, 15], [12, 31], 'mint']];
    const today = doy(10, 15);
    for (let m = 1; m <= 12; m++) h.vhair(s, X(doy(m, 1)), y0 - 0.1, bandY - y0 + 0.1, k, 'Monatslinie ' + months[m - 1]);
    h.vhair(s, gx + gw, y0 - 0.1, bandY - y0 + 0.1, k, 'Monatslinie Ende');
    phases.forEach(([name, [m1, d1], [m2, d2], kind], i) => {
      const y = y0 + i * rh, x1 = X(doy(m1, d1)), x2 = XE(doy(m2, d2)), [fill, col] = kinds[kind];
      const dur = doy(m2, d2) - doy(m1, d1) + 1, range = lang === 'de' ? `${d1}.${m1}. - ${d2}.${m2}.` : `${d1} ${mon[m1 - 1]} - ${d2} ${mon[m2 - 1]}`;
      s.addShape(pres.ShapeType.rect, { x: x1, y: y + 0.045, w: x2 - x1, h: bh, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: 'Balken ' + name });
      s.addText(name, { x: x1 + 0.08, y: y + 0.045, w: x2 - x1 - 0.1, h: bh, fontSize: 10, color: col, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Balken Text ' + name });
      s.addText(dur + d(' Tage', ' days'), { x: x1 - 0.66, y: y + 0.045, w: 0.58, h: bh, fontSize: 8.5, color: BLACK, align: 'right', fill: { color: MINT }, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Dauer ' + name });
      s.addText(range, { x: x2 + 0.08, y: y + 0.045, w: 1.1, h: bh, fontSize: 8.5, color: BLACK, fill: { color: MINT }, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Datum ' + name });
    });
    s.addShape(pres.ShapeType.line, { x: XC(today), y: y0 - 0.1, w: 0, h: bandY - y0 + 0.1, line: { color: GREEN, width: LW }, objectName: 'Heute-Linie' });
    [['IdeeRoth', GREEN], [d('Gemeinsam', 'Joint'), FRESH], [d('Kunde / Lieferant', 'Customer / supplier'), STEEL]].forEach(([t, c], i) => {
      const x = R - 4.2 + i * 1.45;
      s.addShape(pres.ShapeType.rect, { x, y: y0 - 0.5, w: 0.15, h: 0.15, fill: { color: c }, line: { color: c, width: 0 }, objectName: 'Legende ' + t });
      s.addText(t, { x: x + 0.22, y: y0 - 0.56, w: 1.25, h: 0.27, fontSize: 8, color: STEEL, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Legende Text ' + t });
    });
    s.addShape(pres.ShapeType.rect, { x: gx, y: bandY, w: gw, h: bandH, fill: { color: BLACK }, line: { color: BLACK, width: 0 }, objectName: 'Monatsband' });
    months.forEach((mn, i) => {
      const x = X(doy(i + 1, 1));
      if (i > 0) s.addShape(pres.ShapeType.line, { x, y: bandY, w: 0, h: bandH, line: ln('dark'), objectName: 'Bandlinie ' + mn });
      s.addText(mn, { x: x + 0.08, y: bandY, w: 0.7, h: bandH, fontSize: 9, color: MINT, charSpacing: -0.2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Monat ' + mn });
    });
    for (let w = 1; w <= 53; w++) {
      const a = Math.max(1, (w - 1) * 7 - 2), b = Math.min(365, w * 7 - 3), xa = X(a), xb = XE(b);
      h.vhair(s, xa, kwY, kwH, k, 'KW Strich ' + w);
      s.addText(String(w), { x: xa, y: kwY, w: xb - xa, h: kwH, fontSize: 5.5, color: STEEL, align: 'center', margin: 0, isTextBox: true, valign: 'middle', objectName: 'KW ' + w });
    }
    h.vhair(s, gx + gw, kwY, kwH, k, 'KW Strich Ende');
    h.hair(s, gx, kwY + kwH, gw, k, 'Linie unter den Kalenderwochen');
    const startX = X(doy(2, 1)), endX = XE(doy(12, 31)), todayX = XC(today);
    s.addShape(pres.ShapeType.chevron, { x: startX - 0.08, y: markY, w: 0.16, h: 0.2, fill: { color: GREEN }, line: { color: GREEN, width: 0 }, objectName: 'Projektstart' });
    s.addShape(pres.ShapeType.chevron, { x: endX - 0.16, y: markY, w: 0.16, h: 0.2, fill: { color: GREEN }, line: { color: GREEN, width: 0 }, objectName: 'Projektende' });
    s.addText([{ text: d('1. Februar 2026', '1 February 2026'), options: { breakLine: true } }, { text: d('Projektstart', 'Project start') }], { x: startX - 0.9, y: markY + 0.22, w: 1.8, h: 0.36, fontSize: 8, color: BLACK, align: 'center', lineSpacingMultiple: 1.05, margin: 0, isTextBox: true, valign: 'top', objectName: 'Projektstart Text' });
    s.addText([{ text: d('31. Dezember 2026', '31 December 2026'), options: { breakLine: true } }, { text: d('Projektende', 'Project end') }], { x: endX - 1.8, y: markY + 0.22, w: 1.8, h: 0.36, fontSize: 8, color: BLACK, align: 'right', lineSpacingMultiple: 1.05, margin: 0, isTextBox: true, valign: 'top', objectName: 'Projektende Text' });
    s.addShape(pres.ShapeType.triangle, { x: todayX - 0.08, y: markY + 0.03, w: 0.16, h: 0.14, fill: { color: GREEN }, line: { color: GREEN, width: 0 }, objectName: 'Heute' });
    s.addText(d('Heute', 'Today'), { x: todayX - 0.5, y: markY + 0.22, w: 1.0, h: 0.2, fontSize: 8, color: GREEN, align: 'center', margin: 0, isTextBox: true, valign: 'top', objectName: 'Heute Text' });
    [[doy(6, 15), d('Meilenstein 1  ·  Konzeptfreigabe', 'Milestone 1  ·  Concept release')], [doy(8, 31), d('Meilenstein 2  ·  Freigabe Serie', 'Milestone 2  ·  Series release')]].forEach(([dd, t], i) => {
      const x = XC(dd);
      s.addShape(pres.ShapeType.ellipse, { x: x - 0.07, y: markY + 0.03, w: 0.14, h: 0.14, fill: { color: GREEN }, line: { color: GREEN, width: 0 }, objectName: 'Meilenstein ' + (i + 1) });
      s.addText(t, { x: x - 1.1, y: markY + 0.22, w: 2.2, h: 0.2, fontSize: 8, color: BLACK, align: 'center', margin: 0, isTextBox: true, valign: 'top', objectName: 'Meilenstein Text ' + (i + 1) });
    });
  }
  s.addNotes(d('Terminplan aus Formen: Balken verschieben oder dehnen, Beschriftung ändern, Zeile kopieren. Für ein anderes Jahr die Folie kopieren und das Monatsband anpassen.', 'Schedule made of shapes: move or stretch bars, edit labels, copy a row. For another year copy the slide and adjust the month band.'));
  // Zweisprachig A
  const pairs = [[d('Eine unabhängige und neutrale Sichtweise', 'An independent and neutral perspective'), d('An independent and neutral perspective', 'Eine unabhängige und neutrale Sichtweise')],
                 [d('Eine zielgerichtete Umsetzung und Resultaterreichung', 'Targeted implementation and results'), d('Targeted implementation and results', 'Eine zielgerichtete Umsetzung und Resultaterreichung')],
                 [d('Einen starken technologischen und betriebswirtschaftlichen Leistungsverbund', 'A strong technological and business network'), d('A strong technological and business network', 'Einen starken technologischen und betriebswirtschaftlichen Leistungsverbund')],
                 [d('Branchenspezifisches Anwendungsfachwissen', 'Industry-specific application expertise'), d('Industry-specific application expertise', 'Branchenspezifisches Anwendungsfachwissen')]];
  s = pres.addSlide({ masterName: N.TEXT_MINT });
  s.addText(d('02 //  UNTERNEHMEN  ·  COMPANY', '02 //  COMPANY  ·  UNTERNEHMEN'), { placeholder: 'eyebrow' });
  s.addText([{ text: d('Was wir tun', 'What we do'), options: { breakLine: true } }, { text: d('What we do', 'Was wir tun'), options: { fontSize: 18, color: STEEL } }], { placeholder: 'title' });
  s.addText([
    { text: d('Von der ersten Idee bis zur fertigen Serienentwicklung: Konstruktion, Simulation, Entwicklung und Prototyping unter einem Dach.', 'From the first idea to series production: engineering, simulation, development and prototyping under one roof.'), options: { fontSize: 13, color: BLACK, breakLine: true, paraSpaceAfter: 0, lineSpacingMultiple: 1.1 } },
    { text: d('From the first idea to series production: engineering, simulation, development and prototyping under one roof.', 'Von der ersten Idee bis zur fertigen Serienentwicklung: Konstruktion, Simulation, Entwicklung und Prototyping unter einem Dach.'), options: { color: STEEL, fontSize: 11, breakLine: true, paraSpaceBefore: 0, paraSpaceAfter: 12, lineSpacingMultiple: 1.0 } },
    ...pairs.flatMap(([a, b], i) => [
      { text: a, options: { bullet: BUL, fontSize: 13, color: BLACK, breakLine: true, paraSpaceAfter: 0, lineSpacingMultiple: 1.1 } },
      { text: b, options: { bullet: { code: '00A0' }, color: STEEL, fontSize: 11, breakLine: i < pairs.length - 1, paraSpaceBefore: 0, paraSpaceAfter: 9, lineSpacingMultiple: 1.0 } },
    ]),
  ], { x: M, y: 2.85, w: 7.2, h: 3.95, margin: 0, isTextBox: true, valign: 'top', objectName: 'Text zweisprachig A' });
  s.addNotes(d('Zweisprachig A: Zweitsprache als gedämpfte Unterzeile. Für gemischte Runden mit wenig Text.', 'Bilingual A: second language as a muted sub-line. For mixed audiences with little text.'));
  // Zweisprachig B (weiss)
  s = pres.addSlide({ masterName: N.INHALT_WEISS });
  s.addText(d('02 //  UNTERNEHMEN  ·  COMPANY', '02 //  COMPANY  ·  UNTERNEHMEN'), { placeholder: 'eyebrow' });
  s.addText(d('Was wir tun  ·  What we do', 'What we do  ·  Was wir tun'), { placeholder: 'title' });
  {
    const k = 'white', colw = (CW - 0.5) / 2, xe = M + colw + 0.5;
    h.eyebrow(s, d('DEUTSCH', 'ENGLISH'), M, 2.85, colw, k);
    h.eyebrow(s, d('ENGLISH', 'DEUTSCH'), xe, 2.85, colw, k);
    const leadDe = 'Von der ersten Idee bis zur fertigen Serienentwicklung: Konstruktion, Simulation, Entwicklung und Prototyping unter einem Dach.', leadEn = 'From the first idea to series production: engineering, simulation, development and prototyping under one roof.';
    s.addText(d(leadDe, leadEn), { x: M, y: 3.2, w: colw, h: 0.85, fontSize: 13, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Lead 1' });
    s.addText(d(leadEn, leadDe), { x: xe, y: 3.2, w: colw, h: 0.85, fontSize: 13, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Lead 2' });
    pairs.forEach(([a, b], i) => {
      const y = 4.1 + i * 0.64;
      s.addText(a, { x: M, y, w: colw, h: 0.6, fontSize: 13, color: BLACK, bullet: BUL, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Punkt 1 ' + (i + 1) });
      s.addText(b, { x: xe, y, w: colw, h: 0.6, fontSize: 13, color: BLACK, bullet: BUL, lineSpacingMultiple: 1.15, margin: 0, isTextBox: true, valign: 'top', objectName: 'Punkt 2 ' + (i + 1) });
    });
    h.vhair(s, M + colw + 0.25, 2.85, 3.75, k, 'Spaltenlinie');
  }
  // Vergleich (mint)
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('02 //  KONZEPTVARIANTEN', '02 //  CONCEPT VARIANTS'), { placeholder: 'eyebrow' });
  s.addText(d('Blech oder Spritzguss', 'Sheet metal or injection moulding'), { placeholder: 'title' });
  {
    const k = 'mint', cwv = (CW - 0.5) / 2;
    [[d('VARIANTE A  ·  BLECH', 'VARIANT A  ·  SHEET METAL'), 'p14.jpg', [d('48 Teile, 9 Lieferanten', '48 parts, 9 suppliers'), d('Werkzeugkosten tief, Teilekosten hoch', 'Low tooling cost, high part cost'), d('Montage 31 Schritte', 'Assembly 31 steps')], d('48 Teile  ·  CHF 48.-  ·  Werkzeug CHF 9 000.-', '48 parts  ·  CHF 48.-  ·  tooling CHF 9 000.-'), false],
     [d('VARIANTE B  ·  SPRITZGUSS', 'VARIANT B  ·  INJECTION MOULDING'), 'p22.jpg', [d('30 Teile, 5 Lieferanten', '30 parts, 5 suppliers'), d('Werkzeugkosten hoch, Teilekosten tief', 'High tooling cost, low part cost'), d('Montage 17 Schritte', 'Assembly 17 steps')], d('30 Teile  ·  CHF 31.-  ·  Werkzeug CHF 42 000.-', '30 parts  ·  CHF 31.-  ·  tooling CHF 42 000.-'), true]].forEach(([hd, f, pts, sum, rec], i) => {
      const x = M + i * (cwv + 0.5);
      h.eyebrow(s, hd, x, 2.85, cwv, k, { color: rec ? BLACK : STEEL });
      h.photo(s, f, x, 3.3, cwv, 1.7, k, 'Foto ' + hd);
      s.addText(pts.map((t, j) => h.bul(t, { breakLine: j < pts.length - 1 })), { x, y: 5.2, w: cwv, h: 1.1, fontSize: 12, color: BLACK, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Punkte ' + hd });
      h.hair(s, x, 6.33, cwv, k, 'Linie Bewertung ' + (i + 1));
      s.addText(sum, { x, y: 6.45, w: cwv - 1.2, h: 0.3, fontSize: 10, color: BLACK, charSpacing: -0.2, margin: 0, isTextBox: true, valign: 'middle', objectName: 'Bewertung ' + hd });
      if (rec) h.chip(s, x + cwv - 1.05, 6.47, d('EMPFOHLEN', 'RECOMMENDED'), 'aktiv', k);
    });
  }
  // Bildraster (weiss)
  s = pres.addSlide({ masterName: N.INHALT_WEISS });
  s.addText(d('04 //  PROTOTYP UND TESTS', '04 //  PROTOTYPE AND TESTS'), { placeholder: 'eyebrow' });
  s.addText(d('Vom Muster zum Funktionsprototyp', 'From sample to functional prototype'), { placeholder: 'title' });
  {
    const k = 'white', gcw = (CW - 2 * 0.45) / 3, gch = 1.4;
    [['01', d('SHORE-HÄRTEMUSTER', 'SHORE HARDNESS SAMPLES'), 'p22.jpg'], ['02', d('DREHTEIL', 'TURNED PART'), 'p03.jpg'], ['03', d('BAUGRUPPE', 'ASSEMBLY'), 'p09.jpg'], ['04', d('MESSUNG', 'MEASUREMENT'), 'p10.jpg'], ['05', d('FUNKTIONSMUSTER', 'FUNCTIONAL SAMPLE'), 'p13.jpg'], ['06', d('MONTAGE', 'ASSEMBLY'), 'p15.jpg']].forEach(([num, t, f], i) => {
      const r = Math.floor(i / 3), c = i % 3, x = M + c * (gcw + 0.45), y = 2.85 + r * (gch + 0.72);
      h.photo(s, f, x, y, gcw, gch, k, 'Bild ' + num);
      h.eyebrow(s, num + ' //  ' + t, x, y + gch + 0.2, gcw, k);
    });
  }
  // Ansprechpersonen (mint)
  s = pres.addSlide({ masterName: N.INHALT_MINT });
  s.addText(d('06 //  KONTAKT', '06 //  CONTACT'), { placeholder: 'eyebrow' });
  s.addText(d('Ihre Ansprechpersonen', 'Your contacts'), { placeholder: 'title' });
  [['Alain Roth', d('GESCHÄFTSFÜHRER  ·  ENTWICKLUNG', 'MANAGING DIRECTOR  ·  DEVELOPMENT'), '+41 71 855 88 55', 'alain.roth@iro.swiss', 'p15.jpg'], [d('Vorname Name', 'Firstname Lastname'), d('PROJEKTLEITUNG  ·  KONSTRUKTION', 'PROJECT LEAD  ·  DESIGN'), '+41 71 855 88 55', 'vorname.name@iro.swiss', 'p10.jpg']].forEach(([name, r, t, m, f], i) => {
    const k = 'mint', tw = 2.9, x = M + i * (2.75 + tw + 0.43), tx = x + 2.75;
    h.photo(s, f, x, 2.85, 2.4, 2.9, k, 'Porträt ' + name);
    s.addText(name, { x: tx, y: 2.85, w: tw, h: 0.45, fontSize: 22, color: BLACK, charSpacing: -0.4, margin: 0, isTextBox: true, objectName: 'Name ' + name });
    h.eyebrow(s, r, tx, 3.35, tw, k);
    h.hair(s, tx, 3.75, tw, k, 'Linie ' + name);
    s.addText([{ text: t, options: { breakLine: true } }, { text: m, options: { color: GREEN } }], { x: tx, y: 3.9, w: tw, h: 0.7, fontSize: 12, color: BLACK, lineSpacingMultiple: 1.3, margin: 0, isTextBox: true, valign: 'top', objectName: 'Kontakt ' + name });
    s.addText('Hafenstrasse 62  ·  CH-8590 Romanshorn', { x: tx, y: 4.7, w: tw, h: 0.3, fontSize: 10, color: STEEL, margin: 0, isTextBox: true, valign: 'top', objectName: 'Adresse ' + name });
  });
  // Vertraulich mit Ampel
  s = pres.addSlide({ masterName: N.INHALT_V_MINT });
  s.addText(d('04 //  PROTOTYP UND TESTS  ·  FREIGABESTAND', '04 //  PROTOTYPE AND TESTS  ·  RELEASE STATUS'), { placeholder: 'eyebrow' });
  s.addText(d('Drei Bauteile, drei Freigabestände', 'Three parts, three release states'), { placeholder: 'title' });
  {
    const k = 'mint', gcw = (CW - 2 * 0.45) / 3;
    [['p22.jpg', d('VERTRAULICH', 'CONFIDENTIAL'), 'rot', d('01 //  SHORE-HÄRTEMUSTER  ·  NICHT WEITERGEBEN', '01 //  SHORE HARDNESS SAMPLES  ·  DO NOT DISTRIBUTE')], ['p03.jpg', d('IN PRÜFUNG', 'UNDER REVIEW'), 'orange', d('02 //  DREHTEIL  ·  MASSE IN PRÜFUNG', '02 //  TURNED PART  ·  DIMENSIONS UNDER REVIEW')], ['p13.jpg', d('FREIGEGEBEN', 'RELEASED'), 'gruen', d('03 //  FUNKTIONSMUSTER  ·  FREIGEGEBEN 12.10.', '03 //  FUNCTIONAL SAMPLE  ·  RELEASED 12 OCT')]].forEach(([f, t, kind, cap], i) => {
      const x = M + i * (gcw + 0.45);
      h.photo(s, f, x, 2.85, gcw, 2.0, k, 'Bild ' + (i + 1));
      h.chip(s, x + 0.15, 3.0, t, kind, k, 1.05, 'Label ' + t);
      h.eyebrow(s, cap, x, 5.15, gcw, k);
    });
    h.hair(s, M, 5.5, CW, k, 'Linie Erklärung');
    s.addText([
      { text: d('Rot heisst Achtung und Verbot, Orange heisst in Prüfung, Grün heisst freigegeben. ', 'Red means attention and prohibition, amber means under review, green means released. '), options: { color: BLACK } },
      { text: d('Das Label oben rechts gilt für die ganze Folie, die Labels an den Bildern für das einzelne Element. Die Kurzform des Schutzvermerks steht unter dem Label.', 'The label at the top right applies to the whole slide, the labels on the pictures to the single element. The short form of the protection notice sits below the label.'), options: { color: STEEL } },
    ], { x: M, y: 5.6, w: CW, h: 0.8, fontSize: 9.5, lineSpacingMultiple: 1.2, margin: 0, isTextBox: true, valign: 'top', objectName: 'Erklärung Kennzeichnung' });
  }
  // Kontakt
  s = pres.addSlide({ masterName: N.KONTAKT });
  s.addText(d('Sprechen wir über Ihr Projekt.', 'Let us talk about your project.'), { placeholder: 'title' });
  s.addImage({ path: A + 'tile-mint.png', x: M, y: 3.1, w: 1.35, h: 1.35, objectName: 'Logo-Kachel' });
  s.addImage({ path: A + 'badge-nafems-grey.png', x: M, y: 4.85, w: 0.88, h: 0.8, objectName: 'Badge NAFEMS' });
  s.addImage({ path: A + 'badge-lehrbetrieb-grey.png', x: M + 1.05, y: 4.85, w: 0.8, h: 0.8, objectName: 'Badge Lehrbetrieb' });
  [[d('KOMPETENZEN', 'EXPERTISE'), d('UNTERNEHMEN', 'COMPANY'), d('LEISTUNGEN', 'SERVICES')], ['TEAM', d('KARRIERE', 'CAREERS'), d('KONTAKT', 'CONTACT')]].forEach((c, i) => c.forEach((t, j) => s.addText(t, { x: 3.3 + i * 2.3, y: 3.1 + j * 0.42, w: 2.2, h: 0.3, fontSize: 11, color: MINT, charSpacing: -0.3, margin: 0, isTextBox: true, objectName: 'Link ' + t })));
  s.addText([
    { text: 'IdeeRoth AG', options: { breakLine: true } }, { text: 'Hafenstrasse 62', options: { breakLine: true } }, { text: 'CH-8590 Romanshorn', options: { breakLine: true, paraSpaceAfter: 8 } },
    { text: '+41 71 855 88 55', options: { breakLine: true } }, { text: 'info@iro.swiss', options: { color: FRESH } },
  ], { x: 8.3, y: 3.1, w: R - 8.3, h: 1.8, fontSize: 12, color: MINT, lineSpacingMultiple: 1.25, margin: 0, isTextBox: true, valign: 'top', objectName: 'Adresse' });
}

module.exports = { THEME, T, newPres, defineLayouts, addReferenceSlides, addSampleSlides, applyTheme, FOOTER_MARK };
