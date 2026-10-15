// Baut die Beispieldecks (Deutsch und Englisch) auf denselben Layouts wie die Vorlage; Referenzfolien als Anhang.
const L = require('./lib.js');
async function build(lang) {
  const pres = L.newPres(lang === 'de' ? 'IdeeRoth AG Beispielpräsentation' : 'IdeeRoth AG sample presentation');
  const NDE = L.defineLayouts(pres, 'de');
  const NEN = L.defineLayouts(pres, 'en');
  const N = lang === 'de' ? NDE : NEN;
  pres.addSection({ title: lang === 'de' ? 'Beispiel' : 'Sample' });
  L.addSampleSlides(pres, lang, N);
  pres.addSection({ title: lang === 'de' ? 'Anhang: Bausteine und Farben' : 'Appendix: building blocks and colours' });
  L.addReferenceSlides(pres, lang, N, false);
  const out = __dirname + '/out/IdeeRoth_Beispiel_' + lang.toUpperCase() + '_raw.pptx';
  await pres.writeFile({ fileName: out });
  await L.applyTheme(out, L.THEME);
  console.log('written', out);
}
(async () => { await build('de'); await build('en'); })();
