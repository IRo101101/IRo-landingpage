// Minifiziert das Upload-Paket an Ort und Stelle: node minify.js <ordner>
// HTML: Kommentare raus, Leerraum konservativ (ein Leerzeichen bleibt, Wort-Engine und Inline-Links bleiben intakt).
// CSS: clean-css Stufe 1 (nur sichere Optimierungen). JS: terser (ohne Kommentare).
'use strict';
const fs = require('fs'), path = require('path');
const { minify: htmlMin } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: jsMin } = require('terser');
const dir = process.argv[2];
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]); }
(async () => {
  for (const f of walk(dir)) {
    const ext = path.extname(f), src = fs.readFileSync(f, 'utf8');
    let out = null;
    if (ext === '.html') {
      out = await htmlMin(src, { removeComments: true, collapseWhitespace: true, conservativeCollapse: true, minifyCSS: true, minifyJS: false,
        removeRedundantAttributes: false, removeAttributeQuotes: false, keepClosingSlash: false, decodeEntities: false, sortAttributes: false });
    } else if (ext === '.css') {
      const r = new CleanCSS({ level: 1, inline: false, rebase: false }).minify(src);
      if (r.errors.length) throw new Error(f + ': ' + r.errors.join('; '));
      out = r.styles;
    } else if (ext === '.js') {
      const r = await jsMin(src, { compress: { passes: 2 }, mangle: true, format: { comments: false } });
      out = r.code;
    }
    if (out !== null) { fs.writeFileSync(f, out); console.log(path.relative(dir, f), src.length, '->', out.length); }
  }
})().catch(e => { console.error(e); process.exit(1); });
