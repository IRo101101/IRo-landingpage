# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import asyncio, json, sys
from playwright.async_api import async_playwright
BASE=(sys.argv[2] if len(sys.argv) > 2 else 'http://127.0.0.1:8766/')
PAGES=['','karriere.html','kontakt.html','impressum.html','datenschutz.html','404.html','gibt/es/nicht']
AXE=open(sys.argv[1]).read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        allext=set(); axe_out={}
        for pg_name in PAGES:
            for mode in ['desktop','mobile']:
                c = await b.new_context(viewport={'width':1440,'height':900} if mode=='desktop' else {'width':390,'height':844}, is_mobile=mode=='mobile', has_touch=mode=='mobile', locale='de-CH')
                pg = await c.new_page(); reqs=[]; errs=[]
                pg.on('request', lambda r: reqs.append(r.url))
                pg.on('console', lambda m: errs.append(m.text) if m.type in ('error','warning') else None)
                pg.on('pageerror', lambda e: errs.append('PAGEERROR '+str(e)))
                await pg.goto(BASE+pg_name, wait_until='networkidle'); await pg.wait_for_timeout(6500 if pg_name=='' else 1500)
                h = await pg.evaluate('document.documentElement.scrollHeight')
                for y in range(0,h,600): await pg.evaluate(f'scrollTo(0,{y})'); await pg.wait_for_timeout(60)
                await pg.wait_for_timeout(800)
                ext=[u for u in reqs if not u.startswith(BASE)]
                cookies = await c.cookies(); ls = await pg.evaluate('JSON.stringify(Object.keys(localStorage))')
                print(f'{pg_name or "index"} {mode}: requests {len(reqs)}, extern vor Zustimmung: {ext or "keine"}, cookies {[x["name"] for x in cookies]}, localStorage {ls}, console {errs or "sauber"}')
                if mode=='desktop':
                    await pg.add_script_tag(content=AXE)
                    res = await pg.evaluate("axe.run(document, {runOnly: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}).then(r => r.violations.map(v => [v.id, v.impact, v.nodes.length, v.nodes.slice(0,3).map(n => n.target.join(' '))]))")
                    axe_out[pg_name or 'index']=res
                await c.close()
        # Zustimmung: welche Hosts nach "Akzeptieren"
        c = await b.new_context(viewport={'width':1440,'height':900}, locale='de-CH'); pg = await c.new_page(); reqs=[]
        pg.on('request', lambda r: reqs.append(r.url))
        await pg.goto(BASE, wait_until='networkidle'); await pg.wait_for_timeout(6500)
        await pg.evaluate("(() => { const b=[...document.querySelectorAll('button')].find(x=>/Akzeptieren/.test(x.textContent)); b && b.click(); })()")
        await pg.wait_for_timeout(2500)
        print('nach Zustimmung extern:', sorted(set(u.split('/')[2] for u in reqs if not u.startswith(BASE))))
        await c.close(); await b.close()
        print('AXE:'); print(json.dumps(axe_out, indent=1, ensure_ascii=False))
asyncio.run(main())
