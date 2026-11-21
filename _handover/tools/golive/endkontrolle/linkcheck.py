# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import os, re, sys, html
from html.parser import HTMLParser
ROOT=sys.argv[1]
class P(HTMLParser):
    def __init__(s): super().__init__(); s.links=[]; s.ids=set()
    def handle_starttag(s, tag, a):
        a=dict(a)
        if 'id' in a: s.ids.add(a['id'])
        for k in ('href','src','data-en-href','srcset'):
            if k in a and a[k]: s.links.append((tag,k,a[k]))
pages={}
for f in os.listdir(ROOT):
    if f.endswith('.html'):
        p=P(); p.feed(open(os.path.join(ROOT,f),encoding='utf-8').read()); pages[f]=p
ext=set(); bad=[]
for f,p in sorted(pages.items()):
    for tag,k,u in p.links:
        u=html.unescape(u)
        if re.match(r'^(mailto:|tel:)',u):
            ext.add(u.split('?')[0]); continue
        if re.match(r'^https?://',u):
            if u.startswith('https://www.iro.swiss/'):
                local=u[len('https://www.iro.swiss/'):] or 'index.html'
                if not os.path.exists(os.path.join(ROOT,local.split('#')[0].split('?')[0])): bad.append((f,u,'iro.swiss-Datei fehlt'))
            else: ext.add(u)
            continue
        if u=='#': continue
        path,_,frag=u.partition('#'); path=path.split('?')[0]
        if path.startswith('/'): path=path[1:]
        if path in ('','./'): target=f if not u.startswith(('./','/')) or u.startswith('#') else 'index.html'
        else: target=os.path.normpath(path)
        if u.startswith('#'): target=f
        if not os.path.exists(os.path.join(ROOT,target)): bad.append((f,u,'Datei fehlt')); continue
        if frag and target.endswith('.html'):
            if frag not in pages[target].ids: bad.append((f,u,'Anker fehlt in '+target))
print('Interne Verweise geprueft:', sum(len(p.links) for p in pages.values()))
print('Probleme:', bad if bad else 'keine')
print('Externe Ziele:'); [print('  ',e) for e in sorted(ext)]
