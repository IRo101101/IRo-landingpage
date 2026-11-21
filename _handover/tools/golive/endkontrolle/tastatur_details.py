# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import asyncio, sys
from playwright.async_api import async_playwright
B=(sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8766/')
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        # 1 Skip-Link
        c = await b.new_context(viewport={'width':1440,'height':900}); await c.add_init_script("try{localStorage.setItem('iro-consent','denied')}catch(e){}")
        pg = await c.new_page(); await pg.goto(B+'datenschutz.html', wait_until='networkidle'); await pg.wait_for_timeout(1200)
        await pg.keyboard.press('Tab'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(800); await pg.keyboard.press('Tab'); await pg.wait_for_timeout(200)
        print('1 Skip-Link: nach Enter+Tab in main?', await pg.evaluate("!!document.activeElement.closest('main')"), await pg.evaluate("document.activeElement.outerHTML.slice(0,80)"))
        # 5 SmoothScroll-Uebersteuerung
        await pg.mouse.move(700,450); await pg.mouse.wheel(0,3000); await pg.wait_for_timeout(100); await pg.evaluate("scrollTo(0,0)"); await pg.wait_for_timeout(1500)
        print('5 Glide abgebrochen, scrollY =', await pg.evaluate('scrollY'))
        await c.close()
        # 3 Laden + 2 Menue (mobil)
        c = await b.new_context(viewport={'width':390,'height':844}, is_mobile=True, has_touch=True); await c.add_init_script("try{localStorage.setItem('iro-consent','denied')}catch(e){}")
        pg = await c.new_page(); await pg.goto(B, wait_until='domcontentloaded'); await pg.wait_for_timeout(400)
        foc=[]
        for i in range(6): await pg.keyboard.press('Tab'); foc.append(await pg.evaluate("document.activeElement===document.body ? 'body' : document.activeElement.className"))
        print('3 Tab waehrend Laden:', foc)
        await pg.wait_for_timeout(6000)
        await pg.click('.hdr__burger'); await pg.wait_for_timeout(600)
        foc=[]
        for i in range(14): await pg.keyboard.press('Tab'); foc.append(await pg.evaluate("(document.activeElement.closest('.menu')?'menu':document.activeElement.closest('.hdr')?'hdr':'DRAUSSEN:'+document.activeElement.className)"))
        print('2 Tab bei offenem Menue:', sorted(set(foc)), 'scrollY', await pg.evaluate('scrollY'))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700)
        print('   nach Esc inert entfernt?', await pg.evaluate("![...document.body.children].some(e=>e.inert)"))
        await c.close()
        # 4 Consent
        c = await b.new_context(viewport={'width':1440,'height':900}); pg = await c.new_page()
        await pg.goto(B+'impressum.html', wait_until='networkidle'); await pg.wait_for_timeout(1200)
        seq=[]
        for i in range(4): await pg.keyboard.press('Tab'); seq.append(await pg.evaluate("document.activeElement.textContent.trim().slice(0,20)"))
        print('4 erste Tabs mit Banner:', seq)
        await pg.click('[data-consent="deny"]'); await pg.wait_for_timeout(300)
        await pg.focus('[data-cookie-settings]'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(400)
        print('   nach Cookie-Einstellungen Fokus auf:', await pg.evaluate("document.activeElement.textContent.trim()"))
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(300)
        print('   nach Wahl Fokus zurueck auf:', await pg.evaluate("document.activeElement.getAttribute('data-cookie-settings')!==null ? 'Cookie-Einstellungen' : document.activeElement.outerHTML.slice(0,60)"))
        await c.close()
        # 7 404 tief
        c = await b.new_context(viewport={'width':1440,'height':900}); pg = await c.new_page()
        await pg.goto(B+'404.html', wait_until='networkidle'); await pg.wait_for_timeout(800)
        print('7 Banner-Link auf 404:', await pg.evaluate("document.querySelector('.consent__more') && document.querySelector('.consent__more').getAttribute('href')"))
        await c.close(); await b.close()
asyncio.run(main())
