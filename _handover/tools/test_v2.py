import asyncio, sys, json, os
from playwright.async_api import async_playwright

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
BASE = f'http://127.0.0.1:{PORT}/'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'shots')   # Screenshots, nicht einchecken
os.makedirs(OUT, exist_ok=True)
PAGES = ['index.html', 'karriere.html', 'impressum.html', 'datenschutz.html']
VIEWS = [(320, 640), (390, 844), (768, 1024), (1024, 768), (1440, 800), (1920, 1080)]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        problems = []
        for lang in ['de', 'en']:
            for (w, h) in VIEWS:
                for page_name in PAGES:
                    ctx = await b.new_context(viewport={'width': w, 'height': h}, locale='de-CH' if lang == 'de' else 'en-US', reduced_motion='no-preference')
                    await ctx.add_init_script(f"try{{localStorage.setItem('iro-lang','{lang}');localStorage.setItem('iro-consent','denied')}}catch(e){{}}")
                    pg = await ctx.new_page()
                    errors = []
                    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
                    pg.on('pageerror', lambda e: errors.append(str(e)))
                    pg.on('requestfailed', lambda r: errors.append('REQFAIL ' + r.url))
                    await pg.goto(BASE + page_name, wait_until='load')
                    await pg.wait_for_timeout(5200 if page_name == 'index.html' else 800)
                    pre = await pg.evaluate("!!document.querySelector('[data-preloader]')")
                    ov = await pg.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth")
                    lang_now = await pg.evaluate("document.documentElement.lang")
                    h1 = await pg.evaluate("(document.querySelector('h1')||{}).getAttribute ? document.querySelector('h1').getAttribute('aria-label') || document.querySelector('h1').textContent : ''")
                    # scroll through to trigger sections
                    total = await pg.evaluate("document.documentElement.scrollHeight")
                    for y in range(0, total, max(300, h // 2)):
                        await pg.evaluate(f"window.scrollTo(0,{y})")
                        await pg.wait_for_timeout(120)
                    ov2 = await pg.evaluate("Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth")
                    await pg.wait_for_timeout(600)
                    tag = f'{page_name[:-5]}_{w}x{h}_{lang}'
                    if (w, h) in [(390, 844), (1440, 800)] or page_name == 'index.html':
                        await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(800)
                        await pg.screenshot(path=f'{OUT}/{tag}.png', full_page=True)
                    status = 'OK'
                    if pre: status = 'PRELOADER-STUCK'; problems.append((tag, 'preloader stuck'))
                    if ov > 0 or ov2 > 0: status = f'OVERFLOW {ov}/{ov2}'; problems.append((tag, f'overflow {ov}/{ov2}'))
                    if errors: problems.append((tag, errors[:3]))
                    if lang_now != lang: problems.append((tag, f'lang {lang_now}'))
                    print(tag, status, 'errors:', len(errors), 'h1:', h1[:40])
                    await ctx.close()
        await b.close()
        print('\nPROBLEMS:', json.dumps(problems, indent=1, ensure_ascii=False) if problems else 'none')

asyncio.run(main())
