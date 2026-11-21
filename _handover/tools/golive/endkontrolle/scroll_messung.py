# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import asyncio, json, statistics, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        c = await b.new_context(viewport={'width': 390, 'height': 664}, locale='de-CH', has_touch=True, is_mobile=True, device_scale_factor=3)
        pg = await c.new_page()
        cdp = await c.new_cdp_session(pg)
        await pg.goto((sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8766/'), wait_until='networkidle'); await pg.wait_for_timeout(6000)
        await pg.evaluate("(() => { const b=[...document.querySelectorAll('button')].find(x=>/Ablehnen/.test(x.textContent)); if(b) b.click(); })()")
        await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
        await pg.evaluate('''() => { window.__log=[]; const hero=document.querySelector('.hero'), ph=document.querySelector('.hero__photo'); let last=performance.now();
          (function f(){ const now=performance.now(); const tr=getComputedStyle(hero).transform, tp=getComputedStyle(ph).transform;
            const m=s=>{ const r=/matrix\\(([^)]+)\\)/.exec(s); return r? +r[1].split(',')[5] : 0; };
            window.__log.push([+(now-last).toFixed(1), scrollY, +m(tr).toFixed(1), +m(tp).toFixed(1), +getComputedStyle(hero).opacity]); last=now; if(window.__log.length<400) requestAnimationFrame(f); })(); }''')
        await cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':200,'y':560}]})
        for i in range(1,31):
            await cdp.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':200,'y':560-i*12}]}); await pg.wait_for_timeout(16)
        await cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
        await pg.wait_for_timeout(2500)
        log = await pg.evaluate('window.__log')
        dts=[l[0] for l in log[1:]]
        print('frames', len(log), 'median dt', statistics.median(dts), 'p95 dt', sorted(dts)[int(len(dts)*.95)], 'max', max(dts))
        # lag: hero flow y and photo y vs scroll after the gesture ended
        moving=[l for l in log if l[1]>0]
        print('samples (dt, scrollY, heroFlowY, photoY, heroOpacity):')
        for l in moving[::4][:45]: print(l)
        await b.close()
asyncio.run(main())
