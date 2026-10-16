import asyncio, os
from playwright.async_api import async_playwright
from PIL import Image
# Rendert standort-s1.svg (dunkle Karte) mit der Site-Schrift Inter zu PNG (2x) und WebP; dazu Pruefbilder des Lageplans
OUT = os.path.dirname(os.path.abspath(__file__)) + '/'   # Ein- und Ausgabe neben dem Skript
FONT = os.path.abspath(os.path.join(OUT, '..', '..', '..', 'r1', 'assets', 'fonts', 'inter.woff2'))
svg1 = open(OUT + 'standort-s1.svg').read()
sym = open(OUT + 'lageplan-symbol.svg').read()
html = """<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url('file://%s') format('woff2'); font-weight: 100 900; }
body { margin: 0; background: #fff; font-family: Inter, sans-serif; }
#s1 { width: 800px; height: 500px; display: block; }
#s2 { width: 800px; height: 500px; display: block; margin-top: 20px; }
</style></head><body>
<div id="s1">%s</div>
<svg id="s2" viewBox="0 0 800 500"><defs>%s</defs><use href="#lageplan"/></svg>
</body></html>""" % (FONT, svg1, sym)
open(OUT + 'render.html', 'w').write(html)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        ctx = await b.new_context(viewport={'width': 900, 'height': 1100}, device_scale_factor=2)
        pg = await ctx.new_page()
        await pg.goto('file://' + OUT + 'render.html', wait_until='load'); await pg.wait_for_timeout(600)
        await pg.evaluate("document.fonts.ready")
        el = await pg.query_selector('#s1 svg'); await el.screenshot(path=OUT + 'standort-s1.png')
        el2 = await pg.query_selector('#s2'); await el2.screenshot(path=OUT + 'lageplan-s2.png')
        await ctx.close(); await b.close()
    im = Image.open(OUT + 'standort-s1.png').convert('RGB'); print('png', im.size)
    im.save(OUT + 'standort.webp', 'WEBP', quality=82, method=6)
    print('webp bytes', os.path.getsize(OUT + 'standort.webp'))
asyncio.run(main())
