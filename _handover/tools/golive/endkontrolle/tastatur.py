# Teil der Endkontrolle (siehe README.md in diesem Ordner)
import asyncio, sys
BASE=(sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8766/')
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        for page in ['', 'kontakt.html']:
            c = await b.new_context(viewport={'width':1440,'height':900}, locale='de-CH')
            await c.add_init_script("try{localStorage.setItem('iro-consent','denied')}catch(e){}")
            pg = await c.new_page()
            await pg.goto(BASE+page, wait_until='networkidle'); await pg.wait_for_timeout(6500 if page=='' else 1500)
            seen=[]; issues=[]
            for i in range(90):
                await pg.keyboard.press('Tab'); await pg.wait_for_timeout(900)
                info = await pg.evaluate('''() => { const e=document.activeElement; if(!e||e===document.body) return null; const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
                  const vis = r.width>0 && r.height>0 && r.bottom>0 && r.top<innerHeight && s.visibility!=='hidden' && parseFloat(s.opacity)>0.05;
                  let hiddenAnc=false; for(let a=e;a;a=a.parentElement){ const cs=getComputedStyle(a); if(cs.visibility==='hidden'||cs.display==='none'||a.inert||parseFloat(cs.opacity)<0.05) {hiddenAnc=true;break;} }
                  const ring = s.outlineStyle!=='none' && parseFloat(s.outlineWidth)>0 || s.boxShadow!=='none';
                  return [e.tagName.toLowerCase()+'.'+(e.className||'').toString().split(' ')[0], (e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,28), vis, ring, hiddenAnc]; }''')
                if not info: continue
                key=info[0]+'|'+info[1]
                if seen and key==seen[0]: break
                seen.append(key)
                if not info[2] or not info[3] or info[4]: issues.append(info)
            print(page or 'index', 'Tab-Stopps:', len(seen), 'Probleme:', issues if issues else 'keine')
            print('   erste 12:', seen[:12])
            # Menue/Esc am Handy-Format
            await c.close()
        c = await b.new_context(viewport={'width':390,'height':844}, locale='de-CH'); await c.add_init_script("try{localStorage.setItem('iro-consent','denied')}catch(e){}")
        pg = await c.new_page(); await pg.goto(BASE+'kontakt.html', wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.focus('.hdr__burger'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(500)
        st1 = await pg.evaluate("[document.querySelector('.hdr__burger').getAttribute('aria-expanded'), !document.querySelector('#menu').hidden]")
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
        st2 = await pg.evaluate("[document.querySelector('.hdr__burger').getAttribute('aria-expanded'), !document.querySelector('#menu').hidden, document.activeElement.className]")
        print('Burger: nach Enter', st1, 'nach Esc', st2)
        await b.close()
asyncio.run(main())
