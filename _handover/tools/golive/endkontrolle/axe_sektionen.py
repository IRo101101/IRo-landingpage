# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import asyncio, json, sys, collections
from playwright.async_api import async_playwright
AXE=open(sys.argv[1]).read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        for lang in ['de','en']:
          for w,h in [(1440,900),(390,844)]:
            c = await b.new_context(viewport={'width':w,'height':h}, locale='de-CH' if lang=='de' else 'en-US', is_mobile=w<500, has_touch=w<500)
            await c.add_init_script(f"try{{localStorage.setItem('iro-lang','{lang}');localStorage.setItem('iro-consent','denied')}}catch(e){{}}")
            pg = await c.new_page()
            await pg.goto((sys.argv[2] if len(sys.argv) > 2 else 'http://127.0.0.1:8766/'), wait_until='networkidle'); await pg.wait_for_timeout(6500)
            await pg.add_script_tag(content=AXE)
            secs = await pg.evaluate("[...document.querySelectorAll('main section, section, footer')].map(s => s.id || s.className.split(' ')[0])")
            tot=collections.Counter()
            for i,sid in enumerate(secs):
                await pg.evaluate(f"(() => {{ const s=[...document.querySelectorAll('main section, section, footer')][{i}]; window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 40); }})()")
                await pg.wait_for_timeout(2600)
                res = await pg.evaluate(f"(() => {{ const s=[...document.querySelectorAll('main section, section, footer')][{i}]; return axe.run(s, {{runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice']}}).then(r => r.violations.map(v => [v.id, v.nodes.map(n => [n.target.join(' '), n.any[0] && n.any[0].data && n.any[0].data.contrastRatio, n.any[0] && n.any[0].data && n.any[0].data.fgColor, n.any[0] && n.any[0].data && n.any[0].data.bgColor])])); }})()")
                for vid, nodes in res:
                    for n in nodes[:4]: print(lang, w, sid, vid, n)
            await c.close()
        await b.close()
asyncio.run(main())
