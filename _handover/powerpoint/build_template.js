// Baut die Vorlage: 32 Layouts (16 Deutsch, 16 Englisch) und drei ausgeblendete Referenzfolien (Bausteine, Farbkonzept,
// Farbregeln, Deutsch). finish.py macht daraus die .potx mit Fusszeilen-Platzhaltern.
const L = require('./lib.js');
const pres = L.newPres('IdeeRoth AG Vorlage');
const NDE = L.defineLayouts(pres, 'de');
L.defineLayouts(pres, 'en');
pres.addSection({ title: 'Vorlage' });
L.addReferenceSlides(pres, 'de', NDE, true);
(async () => {
  const out = __dirname + '/out/IdeeRoth_Vorlage_raw.pptx';
  await pres.writeFile({ fileName: out });
  await L.applyTheme(out, L.THEME);
  console.log('written', out);
})();
