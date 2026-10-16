import json, math, os, re
# Erzeugt aus den Overpass-Daten (OpenStreetMap, ODbL) zwei Karten um Hafenstrasse 62, Romanshorn:
#  S-1: detaillierte dunkle Karte (Gebaeude, Strassen, Wasser) als SVG -> wird mit Playwright zu WebP gerendert
#  S-2: gezeichneter Lageplan (Ufer, Hafen, Hauptstrassen, Bahn) als schlankes Inline-SVG-Symbol
OUT = os.path.dirname(os.path.abspath(__file__)) + '/'   # Ein- und Ausgabe neben dem Skript
data = json.load(open(OUT + 'romanshorn.json')); els = data['elements']
LAT0, LON0 = 47.56819, 9.382508          # Pin: Hafenstrasse 62
K = 111320.0; KX = K * math.cos(math.radians(LAT0))
# Fenster in Metern (x nach Osten, y nach Norden), 16:10, Mitte leicht suedwestlich des Pins (Bahnhof und Hafen im Bild)
W, H = 800.0, 500.0
CX, CY = -100.0, -70.0
X0, X1 = CX - W / 2, CX + W / 2
Y0, Y1 = CY - H / 2, CY + H / 2

def xy(p):
    x = (p['lon'] - LON0) * KX; y = (p['lat'] - LAT0) * K
    return (x - X0, Y1 - y)            # SVG-Koordinaten: Ursprung links oben, 1 Einheit = 1 m

def fmt(v): return ('%.1f' % v).rstrip('0').rstrip('.')
def path(pts, close=False):
    d = 'M' + ' L'.join(fmt(x) + ' ' + fmt(y) for x, y in pts)
    return d + (' Z' if close else '')
def simplify(pts, tol):
    # Douglas-Peucker
    if len(pts) < 3: return pts
    def dist(p, a, b):
        ax, ay = a; bx, by = b; px, py = p
        dx, dy = bx - ax, by - ay
        if dx == 0 and dy == 0: return math.hypot(px - ax, py - ay)
        t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
        return math.hypot(px - (ax + t * dx), py - (ay + t * dy))
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = dist(pts[i], pts[0], pts[-1])
        if d > dmax: dmax, idx = d, i
    if dmax > tol:
        return simplify(pts[:idx + 1], tol)[:-1] + simplify(pts[idx:], tol)
    return [pts[0], pts[-1]]

ways = [e for e in els if e['type'] == 'way']
byid = {w['id']: w for w in ways}
rel = [e for e in els if e['type'] == 'relation'][0]
station = [e for e in els if e['type'] == 'node' and e.get('tags', {}).get('railway') == 'station'][0]

# ---- Wasser: See-Umring (outer-Mitglieder im Ausschnitt, nach Reihenfolge verkettet) + oestlicher Rand ----
outer = [byid[m['ref']] for m in rel['members'] if m['role'] == 'outer' and m['ref'] in byid]
# Verketten: Ende eines Weges = Anfang des naechsten
chain = []
for w in outer:
    g = [xy(p) for p in w['geometry']]
    if chain and math.hypot(chain[-1][0] - g[0][0], chain[-1][1] - g[0][1]) > 1: g = g[::-1]
    chain += g if not chain else g[1:]
# Der See liegt oestlich der Linie: Polygon schliessen ueber den rechten Rand (weit ausserhalb des Fensters)
far = W + 400
first, last = chain[0], chain[-1]
lake = chain + [(far, last[1]), (far, first[1])]
islands = [[xy(p) for p in byid[m['ref']]['geometry']] for m in rel['members'] if m['role'] == 'inner' and m['ref'] in byid]
basins = [[xy(p) for p in w['geometry']] for w in ways if w.get('tags', {}).get('natural') == 'water']

def collect(pred):
    return [w for w in ways if w.get('tags') and pred(w['tags'])]
buildings = collect(lambda t: 'building' in t)
green = collect(lambda t: t.get('leisure') in ('park', 'garden', 'pitch') or t.get('landuse') in ('grass', 'meadow', 'forest'))
piers = collect(lambda t: t.get('man_made') in ('pier', 'breakwater', 'quay'))
rails = collect(lambda t: t.get('railway') == 'rail')
roads = collect(lambda t: 'highway' in t)
MAJOR = ('secondary', 'tertiary', 'primary')
MINOR = ('residential', 'living_street', 'service', 'pedestrian', 'unclassified')
SMALL = ('footway', 'path', 'cycleway', 'steps')

def inwin(pts, pad=60):
    return any(-pad <= x <= W + pad and -pad <= y <= H + pad for x, y in pts)

# ---- S-1: dunkle, detaillierte Karte ----
s1 = []
s1.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" width="%d" height="%d" font-family="Inter, system-ui, sans-serif">' % (W, H, W, H))
s1.append('<rect width="%d" height="%d" fill="#171c21"/>' % (W, H))
for g in green:
    pts = [xy(p) for p in g['geometry']]
    if inwin(pts): s1.append('<path d="%s" fill="#1b231d"/>' % path(pts, True))
s1.append('<path d="%s" fill="#0d1319"/>' % path(lake, True))
for b in basins:
    if inwin(b): s1.append('<path d="%s" fill="#0d1319"/>' % path(b, True))
for isl in islands:
    s1.append('<path d="%s" fill="#171c21"/>' % path(isl, True))
# Uferlinie dezent
s1.append('<path d="%s" fill="none" stroke="#2a343e" stroke-width="1.2"/>' % path(chain))
for b in basins:
    if inwin(b): s1.append('<path d="%s" fill="none" stroke="#2a343e" stroke-width="1"/>' % path(b, True))
for p in piers:
    pts = [xy(q) for q in p['geometry']]
    if not inwin(pts): continue
    if p['geometry'][0] == p['geometry'][-1]: s1.append('<path d="%s" fill="#2a3139"/>' % path(pts, True))
    else: s1.append('<path d="%s" fill="none" stroke="#2a3139" stroke-width="3" stroke-linecap="round"/>' % path(pts))
for b in buildings:
    pts = [xy(p) for p in b['geometry']]
    if inwin(pts): s1.append('<path d="%s" fill="#252c34"/>' % path(pts, True))
# Strassen: Kleine zuerst, dann Nebenstrassen, dann Hauptstrassen
for cls, color, wdt, extra in ((SMALL, '#222a31', 1.6, ' stroke-dasharray="4 3"'), (MINOR, '#2f3840', 5, ''), (MAJOR, '#3b454e', 8, '')):
    for r in roads:
        if r['tags']['highway'] not in cls: continue
        pts = [xy(p) for p in r['geometry']]
        if inwin(pts): s1.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round"%s/>' % (path(pts), color, wdt, extra))
for r in rails:
    pts = [xy(p) for p in r['geometry']]
    if not inwin(pts): continue
    s1.append('<path d="%s" fill="none" stroke="#3a434c" stroke-width="3"/>' % path(pts))
    s1.append('<path d="%s" fill="none" stroke="#5a646e" stroke-width="1.2" stroke-dasharray="6 6"/>' % path(pts))
# Beschriftungen: Hafenstrasse (entlang der Strasse), Bahnhof, Hafen
# Hafenstrasse laeuft westlich des Pins fast waagrecht von (391,241) nach (513,232) in SVG-Koordinaten
seg = ((391.0, 241.0), (513.0, 232.0))
ax, ay = seg[0]; bx, by = seg[1]
ang = math.degrees(math.atan2(by - ay, bx - ax))
LX, LY = ax + 4, ay - 7
s1.append('<text x="%s" y="%s" transform="rotate(%.1f %s %s)" fill="#aeb6be" font-size="26" letter-spacing=".04em">Hafenstrasse</text>' % (fmt(LX), fmt(LY), ang, fmt(LX), fmt(LY)))
sx, sy = xy(station)
s1.append('<text x="%s" y="%s" fill="#aeb6be" font-size="22" letter-spacing=".06em" text-anchor="end">BAHNHOF</text>' % (fmt(sx - 12), fmt(sy + 5)))
s1.append('<circle cx="%s" cy="%s" r="3" fill="#aeb6be"/>' % (fmt(sx), fmt(sy)))
hx, hy = xy({'lon': LON0 + 140 / KX, 'lat': LAT0 - 230 / K})
s1.append('<text x="%s" y="%s" fill="#5f6a75" font-size="22" letter-spacing=".12em" text-anchor="middle">HAFEN</text>' % (fmt(hx), fmt(hy)))
# Pin
px, py = xy({'lon': LON0, 'lat': LAT0})
s1.append('<circle cx="%s" cy="%s" r="34" fill="#25C77A" fill-opacity=".18"/>' % (fmt(px), fmt(py)))
s1.append('<circle cx="%s" cy="%s" r="14" fill="#25C77A" stroke="#fff" stroke-width="3.5"/>' % (fmt(px), fmt(py)))
s1.append('</svg>')
open(OUT + 'standort-s1.svg', 'w').write('\n'.join(s1))

# ---- S-2: gezeichneter Lageplan (schlank, als Symbol) ----
s2 = []
s2.append('<symbol id="lageplan" viewBox="0 0 %d %d">' % (W, H))
s2.append('<rect width="%d" height="%d" fill="#111418"/>' % (W, H))
lk = simplify(lake, 2.0)
s2.append('<path d="%s" fill="rgba(255,255,255,.06)"/>' % path(lk, True))
for b in basins:
    if inwin(b): s2.append('<path d="%s" fill="rgba(255,255,255,.06)"/>' % path(simplify(b, 1.5), True))
for isl in islands:
    s2.append('<path d="%s" fill="#111418"/>' % path(simplify(isl, 1.0), True))
s2.append('<path d="%s" fill="none" stroke="#707981" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' % path(lk[:len(chain)]))
for b in basins:
    if inwin(b): s2.append('<path d="%s" fill="none" stroke="#707981" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' % path(simplify(b, 1.5), True))
for p in piers:
    pts = [xy(q) for q in p['geometry']]
    if not inwin(pts) or len(pts) < 2: continue
    closed = p['geometry'][0] == p['geometry'][-1]
    s2.append('<path d="%s" fill="none" stroke="#707981" stroke-width="1" stroke-opacity=".8" vector-effect="non-scaling-stroke"/>' % path(simplify(pts, 1.0), closed))
for r in roads:
    h = r['tags']['highway']
    if h in MAJOR: wdt = 1.8
    elif h in ('residential', 'living_street', 'pedestrian', 'unclassified'): wdt = 1
    else: continue
    pts = [xy(p) for p in r['geometry']]
    if inwin(pts): s2.append('<path d="%s" fill="none" stroke="#707981" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' % (path(simplify(pts, 1.5)), wdt))
for r in rails:
    pts = [xy(p) for p in r['geometry']]
    if not inwin(pts) or r['tags'].get('service'): continue
    s2.append('<path d="%s" fill="none" stroke="#9aa3ab" stroke-width="2" vector-effect="non-scaling-stroke"/>' % path(simplify(pts, 1.5)))
    s2.append('<path d="%s" fill="none" stroke="#111418" stroke-width="1" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>' % path(simplify(pts, 1.5)))
s2.append('<text x="%s" y="%s" transform="rotate(%.1f %s %s)" fill="#B7F3D0" font-size="26" letter-spacing=".04em">Hafenstrasse</text>' % (fmt(LX), fmt(LY - 1), ang, fmt(LX), fmt(LY - 1)))
s2.append('<text x="%s" y="%s" fill="#B7F3D0" font-size="22" letter-spacing=".08em" text-anchor="end">BAHNHOF</text>' % (fmt(sx - 12), fmt(sy + 5)))
s2.append('<circle cx="%s" cy="%s" r="5" fill="none" stroke="#B7F3D0" stroke-width="2" vector-effect="non-scaling-stroke"/>' % (fmt(sx), fmt(sy)))
s2.append('<text x="%s" y="%s" fill="#707981" font-size="22" letter-spacing=".12em" text-anchor="middle">HAFEN</text>' % (fmt(hx), fmt(hy)))
s2.append('<circle cx="%s" cy="%s" r="34" fill="#25C77A" fill-opacity=".18"/>' % (fmt(px), fmt(py)))
s2.append('<circle cx="%s" cy="%s" r="14" fill="#25C77A" stroke="#111418" stroke-width="3.5"/>' % (fmt(px), fmt(py)))
s2.append('</symbol>')
sym = '\n'.join(s2)
open(OUT + 'lageplan-symbol.svg', 'w').write(sym)
print('S-1 svg', len('\n'.join(s1)) // 1024, 'KB; S-2 symbol', len(sym) // 1024, 'KB; pin at', round(px), round(py), 'station at', round(sx), round(sy), 'Hafenstrasse label angle', round(ang, 1), 'seg', seg)
