#!/usr/bin/env python3
"""Nachbearbeitung der pptxgenjs-Ausgabe.

- Die senkrechte Fusszeile jedes Layouts wird zum Fusszeilen-Platzhalter (type="ftr"), damit PowerPoint sie ueber
  "Kopf- und Fusszeile" fuer alle Folien auf einmal setzt; der Folienmaster bekommt denselben Platzhalter und hf ftr=1.
- Auf jeder Folie wird ein Fusszeilen-Platzhalter mit dem gewuenschten Text eingesetzt (--footer).
- Aufzaehlungen: ueberall Punkt in Inter (auch Master-Ebenen 2 bis 5, dort statt Gedankenstrich und Guillemet), 14 pt.
- Aufraeumen: leeres Standard-Layout "DEFAULT" entfernen, verwaiste Content-Type-Overrides entfernen, Form-IDs je
  Folie eindeutig machen, absolute Pfade aus Bildbeschreibungen entfernen, Dokumenteigenschaften, Notizenseite 7.5 x 10 in.
- Fuer die Vorlage: Inhaltstyp presentationml.template, Ausgabe als .potx.

Aufruf: finish.py <in.pptx> <out.(pptx|potx)> [--footer "TEXT"]
"""
import re, sys, zipfile

PH_FTR = '<p:nvPr><p:ph type="ftr" sz="quarter" idx="11"/></p:nvPr>'
MARK = 'IDEEROTH AG'
BUFONT = '<a:buFont typeface="Inter" pitchFamily="34" charset="0"/>'

def convert_layout(xml):
    count = 0
    def repl(m):
        nonlocal count
        sp = m.group(0)
        if 'rot="16200000"' in sp and MARK in sp and 'type="ftr"' not in sp:
            count += 1
            sp = sp.replace('<p:nvPr></p:nvPr>', PH_FTR, 1).replace('<p:nvPr/>', PH_FTR, 1)
        return sp
    return re.sub(r'<p:sp>.*?</p:sp>', repl, xml, flags=re.S), count

def master_fix(xml, sample_sp):
    if 'type="ftr"' not in xml and sample_sp:
        sp = re.sub(r'<a:t>[^<]*</a:t>', '<a:t>Fusszeile</a:t>', sample_sp)
        sp = re.sub(r'<p:cNvPr id="\d+" name="[^"]*"', '<p:cNvPr id="90" name="Fusszeile"', sp)
        xml = xml.replace('</p:spTree>', sp + '</p:spTree>', 1)
    xml = re.sub(r'<p:hf [^>]*/>', '<p:hf sldNum="1" hdr="0" ftr="1" dt="0"/>', xml)
    if '<p:hf ' not in xml:
        xml = xml.replace('</p:cSld>', '</p:cSld><p:hf sldNum="1" hdr="0" ftr="1" dt="0"/>', 1)
    # Textebenen des Masters: Punkt in Inter, 14 pt auf allen Ebenen (pptxgenjs schreibt Arial, Gedankenstrich, 32 bis 20 pt)
    def body(m):
        b = m.group(0)
        b = re.sub(r'<a:buFont [^>]*/>', BUFONT, b)
        b = re.sub(r'<a:buChar char="[^"]*"/>', '<a:buChar char="&#8226;"/>', b)
        b = re.sub(r'(<a:defRPr )sz="\d+"', r'\1sz="1400"', b)
        return b
    xml = re.sub(r'<p:bodyStyle>.*?</p:bodyStyle>', body, xml, flags=re.S)
    return xml

def bullets_fix(xml):
    # Jeder Punkt bekommt Inter als Aufzaehlungsschrift, damit Platzhalter und freie Textfelder gleich aussehen
    xml = re.sub(r'<a:buFont [^>]*/>', BUFONT, xml)
    def ppr(m):
        p = m.group(0)
        if '<a:buChar' in p and '<a:buFont' not in p:
            p = p.replace('<a:buChar', BUFONT + '<a:buChar', 1)
        return p
    return re.sub(r'<a:pPr\b[^>]*>.*?</a:pPr>', ppr, xml, flags=re.S)

def unique_ids(xml):
    seen, counter = set(), [1]
    def repl(m):
        counter[0] += 1
        return f'<p:cNvPr id="{counter[0]}"'
    return re.sub(r'<p:cNvPr id="\d+"', repl, xml)

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
    footer = sys.argv[sys.argv.index('--footer') + 1] if '--footer' in sys.argv else None
    is_template = dst.lower().endswith('.potx')
    zin = zipfile.ZipFile(src)
    items = {i.filename: zin.read(i.filename) for i in zin.infolist()}
    layouts = sorted([n for n in items if re.match(r'ppt/slideLayouts/slideLayout\d+\.xml$', n)], key=lambda s: int(re.findall(r'\d+', s)[-1]))
    sample_sp, converted = None, 0
    for n in layouts:
        xml, c = convert_layout(items[n].decode('utf8'))
        converted += c
        if c and sample_sp is None:
            sample_sp = re.search(r'<p:sp>(?:(?!</p:sp>).)*type="ftr"(?:(?!</p:sp>).)*</p:sp>', xml, re.S).group(0)
        items[n] = xml.encode('utf8')
    for n in list(items):
        if re.match(r'ppt/slideMasters/slideMaster\d+\.xml$', n):
            items[n] = master_fix(items[n].decode('utf8'), sample_sp).encode('utf8')
        if footer and re.match(r'ppt/slides/slide\d+\.xml$', n):
            items[n] = slide_add_ftr(items[n].decode('utf8'), footer).encode('utf8')
    # Standard-Layout "DEFAULT" entfernen, wenn keine Folie es verwendet
    removed = 0
    for n in [n for n in layouts if '<p:cSld name="DEFAULT"' in items[n].decode('utf8')]:
        base = n.split('/')[-1]
        if any(base in items[r].decode('utf8') for r in items if re.match(r'ppt/slides/_rels/slide\d+\.xml\.rels$', r)):
            continue
        mrels = 'ppt/slideMasters/_rels/slideMaster1.xml.rels'
        rels = items[mrels].decode('utf8')
        rid = re.search(r'<Relationship Id="(rId\d+)"[^>]*Target="[^"]*' + re.escape(base) + '"', rels)
        if not rid:
            continue
        items[mrels] = re.sub(r'<Relationship Id="' + rid.group(1) + r'"[^>]*/>', '', rels).encode('utf8')
        m = items['ppt/slideMasters/slideMaster1.xml'].decode('utf8')
        items['ppt/slideMasters/slideMaster1.xml'] = re.sub(r'<p:sldLayoutId [^>]*r:id="' + rid.group(1) + r'"[^>]*/>', '', m).encode('utf8')
        items.pop(n, None); items.pop('ppt/slideLayouts/_rels/' + base + '.rels', None)
        removed += 1
    # Aufzaehlungen, IDs, Bildbeschreibungen in allen Folien, Layouts und Mastern
    for n in list(items):
        if re.match(r'ppt/(slides/slide|slideLayouts/slideLayout|slideMasters/slideMaster)\d+\.xml$', n):
            xml = items[n].decode('utf8')
            xml = bullets_fix(xml)
            xml = unique_ids(xml)
            xml = re.sub(r'descr="/[^"]*/([^/"]+)"', lambda m: 'descr="' + m.group(1).rsplit('.', 1)[0] + '"', xml)
            items[n] = xml.encode('utf8')
    # Content-Types: verwaiste Overrides entfernen, Vorlagen-Typ setzen
    ct = items['[Content_Types].xml'].decode('utf8')
    ct = re.sub(r'<Override PartName="/([^"]+)"[^>]*/>', lambda m: m.group(0) if m.group(1) in items else '', ct)
    if is_template:
        ct = ct.replace('application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml',
                        'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml')
    items['[Content_Types].xml'] = ct.encode('utf8')
    # Dokumenteigenschaften und Notizenseite
    if 'docProps/core.xml' in items:
        items['docProps/core.xml'] = re.sub(r'<dc:subject>[^<]*</dc:subject>', '<dc:subject>IdeeRoth AG</dc:subject>', items['docProps/core.xml'].decode('utf8')).encode('utf8')
    if 'docProps/app.xml' in items:
        hidden = sum(1 for n in items if re.match(r'ppt/slides/slide\d+\.xml$', n) and 'show="0"' in items[n].decode('utf8'))
        items['docProps/app.xml'] = re.sub(r'<HiddenSlides>\d+</HiddenSlides>', f'<HiddenSlides>{hidden}</HiddenSlides>', items['docProps/app.xml'].decode('utf8')).encode('utf8')
    items['ppt/presentation.xml'] = re.sub(r'<p:notesSz [^>]*/>', '<p:notesSz cx="6858000" cy="9144000"/>', items['ppt/presentation.xml'].decode('utf8')).encode('utf8')
    zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
    for i in zin.infolist():
        if i.filename in items:
            zout.writestr(i, items[i.filename])
    zout.close()
    print(f'{dst}: {converted} Fusszeilen in {len(layouts) - removed} Layouts, Master ergaenzt, {removed} Standard-Layout entfernt, Folien-Fusszeile {"gesetzt" if footer else "keine"}, {"Vorlage" if is_template else "Praesentation"}')

if __name__ == '__main__':
    main()
