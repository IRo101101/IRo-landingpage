#!/usr/bin/env python3
"""Nachbearbeitung der pptxgenjs-Ausgabe.

- Die senkrechte Fusszeile jedes Layouts wird zum Fusszeilen-Platzhalter (type="ftr"), damit PowerPoint sie ueber
  "Kopf- und Fusszeile" fuer alle Folien auf einmal setzt; der Folienmaster bekommt denselben Platzhalter und hf ftr=1.
- Auf jeder Folie eines Beispieldecks wird ein Fusszeilen-Platzhalter mit dem gewuenschten Text eingesetzt.
- Fuer die Vorlage wird der Inhaltstyp auf presentationml.template gesetzt und als .potx geschrieben.

Aufruf: finish.py <in.pptx> <out.(pptx|potx)> [--footer "TEXT"]
"""
import re, sys, zipfile

PH_FTR = '<p:nvPr><p:ph type="ftr" sz="quarter" idx="11"/></p:nvPr>'
MARK = 'IDEEROTH AG'

def convert_layout(xml):
    # Senkrechte Fusszeile (rot=16200000, enthaelt IDEEROTH AG) -> Fusszeilen-Platzhalter
    out, count = [], 0
    for m in re.finditer(r'<p:sp>.*?</p:sp>', xml, re.S):
        pass
    def repl(m):
        nonlocal count
        sp = m.group(0)
        if 'rot="16200000"' in sp and MARK in sp and 'type="ftr"' not in sp:
            count += 1
            sp = sp.replace('<p:nvPr></p:nvPr>', PH_FTR, 1).replace('<p:nvPr/>', PH_FTR, 1)
        return sp
    xml = re.sub(r'<p:sp>.*?</p:sp>', repl, xml, flags=re.S)
    return xml, count

def master_add_ftr(xml, sample_sp):
    if 'type="ftr"' in xml:
        return xml
    # Platzhalter aus dem ersten Layout uebernehmen, Text neutral
    sp = re.sub(r'<a:t>[^<]*</a:t>', '<a:t>Fusszeile</a:t>', sample_sp)
    sp = re.sub(r'<p:cNvPr id="\d+" name="[^"]*"', '<p:cNvPr id="90" name="Fusszeile"', sp)
    xml = xml.replace('</p:spTree>', sp + '</p:spTree>', 1)
    xml = re.sub(r'<p:hf [^>]*/>', '<p:hf sldNum="1" hdr="0" ftr="1" dt="0"/>', xml)
    if '<p:hf ' not in xml:
        xml = xml.replace('</p:cSld>', '</p:cSld><p:hf sldNum="1" hdr="0" ftr="1" dt="0"/>', 1)
    return xml

def slide_add_ftr(xml, text):
    if 'type="ftr"' in xml:
        return xml
    esc = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    sp = ('<p:sp><p:nvSpPr><p:cNvPr id="990" name="Fusszeile"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>'
          + PH_FTR + '</p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="de-CH" dirty="0"/>'
          '<a:t>' + esc + '</a:t></a:r></a:p></p:txBody></p:sp>')
    return xml.replace('</p:spTree>', sp + '</p:spTree>', 1)

def main():
    src, dst = sys.argv[1], sys.argv[2]
    footer = None
    if '--footer' in sys.argv:
        footer = sys.argv[sys.argv.index('--footer') + 1]
    is_template = dst.lower().endswith('.potx')
    zin = zipfile.ZipFile(src)
    zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
    sample_sp = None
    items = {i.filename: zin.read(i.filename) for i in zin.infolist()}
    layouts = sorted([n for n in items if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n)], key=lambda s: int(re.findall(r'\d+', s)[-1]))
    converted = 0
    for n in layouts:
        xml, c = convert_layout(items[n].decode('utf8'))
        converted += c
        if c and sample_sp is None:
            sample_sp = re.search(r'<p:sp>(?:(?!</p:sp>).)*type="ftr"(?:(?!</p:sp>).)*</p:sp>', xml, re.S).group(0)
        items[n] = xml.encode('utf8')
    for n in list(items):
        if re.match(r'ppt/slideMasters/slideMaster\d+\.xml$', n) and sample_sp:
            items[n] = master_add_ftr(items[n].decode('utf8'), sample_sp).encode('utf8')
        if footer and re.match(r'ppt/slides/slide\d+\.xml$', n):
            items[n] = slide_add_ftr(items[n].decode('utf8'), footer).encode('utf8')
    # Das leere Standard-Layout "DEFAULT" von pptxgenjs entfernen, wenn keine Folie es verwendet
    default = [n for n in layouts if '<p:cSld name="DEFAULT"' in items[n].decode('utf8')]
    removed = 0
    for n in default:
        base = n.split('/')[-1]
        used = any(base in items[r].decode('utf8') for r in items if re.match(r'ppt/slides/_rels/slide\d+\.xml\.rels$', r))
        if used:
            continue
        mrels = 'ppt/slideMasters/_rels/slideMaster1.xml.rels'
        rels = items[mrels].decode('utf8')
        rid = re.search(r'<Relationship Id="(rId\d+)"[^>]*Target="[^"]*' + re.escape(base) + '"', rels)
        if not rid:
            continue
        rels = re.sub(r'<Relationship Id="' + rid.group(1) + r'"[^>]*/>', '', rels)
        items[mrels] = rels.encode('utf8')
        m = items['ppt/slideMasters/slideMaster1.xml'].decode('utf8')
        m = re.sub(r'<p:sldLayoutId [^>]*r:id="' + rid.group(1) + r'"[^>]*/>', '', m)
        items['ppt/slideMasters/slideMaster1.xml'] = m.encode('utf8')
        ct = items['[Content_Types].xml'].decode('utf8')
        ct = re.sub(r'<Override PartName="/' + re.escape(n) + r'"[^>]*/>', '', ct)
        items['[Content_Types].xml'] = ct.encode('utf8')
        items.pop(n, None); items.pop('ppt/slideLayouts/_rels/' + base + '.rels', None)
        removed += 1
    if is_template:
        ct = items['[Content_Types].xml'].decode('utf8')
        ct = ct.replace('application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml',
                        'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml')
        items['[Content_Types].xml'] = ct.encode('utf8')
    for i in zin.infolist():
        if i.filename in items:
            zout.writestr(i, items[i.filename])
    zout.close()
    print(f'{dst}: {converted} Fusszeilen in {len(layouts) - removed} Layouts, Master ergaenzt, {removed} Standard-Layout entfernt, Folien-Fusszeile {"gesetzt" if footer else "keine"}, {"Vorlage" if is_template else "Praesentation"}')

if __name__ == '__main__':
    main()
