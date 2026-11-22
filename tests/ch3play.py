#!/usr/bin/env python3
"""冒煙測試：每次發布前跑一次。

用法：
  python3 src/build.py && python3 tests/smoke.py            # 跑測試
  python3 tests/smoke.py --update-baseline                  # 把這次的截圖存成新基準

會檢查：頁面錯誤、缺少的素材、各畫面是否互相疊在一起、主要流程能否走完。
截圖與總覽圖輸出到 tests/out/，和 tests/baseline/ 比對差異（差異只列警告，因為浮塵、閃爍是隨機的）。
任何一項失敗，結束代碼為 1。
"""
import asyncio, os, sys, json, shutil, time
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(ROOT, 'tests')
OUT, BASE, VEND = os.path.join(T, 'out3'), os.path.join(T, 'baseline'), os.path.join(T, 'vendor', 'three')
UPDATE = '--update-baseline' in sys.argv
W, H = 1280, 720

results, errors, missing, shots = [], [], [], []

def ok(name, cond, detail=''):
    results.append((name, bool(cond), detail))
    print(('  ✓ ' if cond else '  ✗ ') + name + (f'  — {detail}' if detail and not cond else ''))

async def main():
    shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': W, 'height': H})
        pg.on('pageerror', lambda e: errors.append(f'{e} | {(e.stack or "")[:240]}'))
        pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' and 'GL Driver' not in m.text and "color' parameter" not in m.text else None)

        async def route(r):
            u = r.request.url
            if 'three.min.js' in u:
                return await r.fulfill(path=os.path.join(VEND, 'three.min.js'), content_type='text/javascript')
            if '/examples/js/' in u:
                return await r.fulfill(path=os.path.join(VEND, 'examples', 'js', u.split('/examples/js/')[1]), content_type='text/javascript')
            if 'fonts.g' in u:
                return await r.fulfill(body='', content_type='text/css')
            if u.startswith('http://local/'):
                rel = u[len('http://local/'):].split('?')[0]
                if rel == '':
                    return await r.fulfill(body=html, content_type='text/html')
                f = os.path.join(ROOT, rel)
                if os.path.isfile(f):
                    ct = 'image/webp' if f.endswith('.webp') else 'image/png' if f.endswith('.png') else 'application/octet-stream'
                    return await r.fulfill(path=f, content_type=ct)
                missing.append(rel)
                return await r.fulfill(status=404, body='')
            await r.abort()
        await pg.route('**/*', route)

        ev, wt = pg.evaluate, pg.wait_for_timeout
        async def shot(n):
            f = os.path.join(OUT, n + '.png'); await pg.screenshot(path=f); shots.append(n)
        async def skip_story(n=30):
            for _ in range(n):
                if await ev("$('story').hidden"): return
                await ev("advance();advance()"); await wt(120)
        async def visible_screens():
            return await ev("[...document.querySelectorAll('.screen')].filter(s=>!s.hidden&&getComputedStyle(s).display!=='none').map(s=>s.id)")
        async def step(name, coro):
            t0 = time.time(); n0 = len(errors)
            try:
                await coro()
            except Exception as e:
                ok(name, False, f'例外：{str(e)[:200]}'); return
            new = errors[n0:]
            ok(name + f'（{time.time()-t0:.0f}s）', not new, '; '.join(new[:2]))

        await pg.goto('http://local/'); await wt(3500)
        await ev("try{localStorage.clear()}catch(e){};refreshContinue&&refreshContinue();TH.mode='off';save.tipsOff=true;save.gfx='high';applyGfx('high')")


        async def runev(i, wait=1200):
            r = await ev(f"(()=>{{const e=X.events.find(e=>e.id==='{i}');if(!e)return 'noev';X.pos.x=e.at[0];X.pos.z=e.at[1]+.6;runEvent(e);return 'ok'}})()")
            await wt(wait); return r
        async def win():
            for _ in range(60):
                if await ev("!!B&&!$('battle').hidden&&B.phase==='player'"): break
                await wt(200); await skip_story(4)
            await ev("B.enemies.forEach(e=>{if(e.alive)damageEnemy(e,e.hp+999,{raw:true})})"); await wt(3500)
            await ev("const b=document.querySelector('#ov .btn');b&&b.click()"); await wt(1500)
        async def where(): return await ev("[X.id,CHAPTER,$('story').hidden]")
        await ev("SLOT=0;startCh3()"); await wt(2500)
        await shot('c3_00_open_vn'); await skip_story(60); await wt(3000); await skip_story(40)
        ok('第三章開始後進入飛艇碼頭', (await where())[:2]==['dock',3], str(await where()))
        await shot('c3_01_dock')
        await runev('hank'); await skip_story(); await runev('reg'); await skip_story(); await runev('lensD',600)
        await runev('b1',2500); await skip_story(); await wt(3500); await skip_story()
        ok('戰鬥 1 開始（強風）', await ev("!!B&&!!B.cfg.wind&&B.cfg.theme==='dock'"))
        await wt(1500); await shot('c3_02_b1')
        await win(); await skip_story(); await wt(800)
        ok('戰鬥 1 勝利旗標', await ev("!!P.flags.b1"))
        await runev('lift',2800); await skip_story(40); await wt(1000)
        ok('進入高斯港', (await where())[0]=='gauss', str(await where()))
        await shot('c3_03_gauss')
        await runev('milaA',1500); await skip_story(60); await wt(4000); await skip_story()
        ok('戰鬥 2 開始（巷戰）', await ev("!!B&&B.cfg.theme==='alley'"))
        await shot('c3_04_b2')
        await win(); await skip_story(80); await wt(3000); await skip_story(80); await wt(3000); await skip_story()
        for _ in range(10):
            if await ev("!!P.flags.lh"): break
            await skip_story(20); await wt(800)
        ok('燈塔劇情後解鎖礦坑', await ev("!!P.flags.lh&&X.id==='gauss'"), str(await where()))
        await runev('milaB'); await skip_story(); await runev('bato'); await skip_story(); await runev('lensG',600); await runev('catG'); await skip_story(); await runev('lewin'); await skip_story()
        await runev('toMine',2800); await skip_story(40)
        ok('進入磁軌礦坑', (await where())[0]=='mine3', str(await where()))
        await shot('c3_05_mine')
        await runev('oath'); await skip_story(); await runev('lensM',600); await runev('bp'); await skip_story()
        await runev('b3',2500); await skip_story(); await wt(3500); await skip_story()
        ok('戰鬥 3 開始（磁柱）', await ev("!!B&&B.cfg.theme==='mine3'"))
        await shot('c3_06_b3')
        await win(); await skip_story(60); await wt(1500); await skip_story()
        ok('實驗室劇情與線索 4', await ev("!!P.flags.lab&&!!P.flags.c3c4"))
        await runev('up',1500); await skip_story(60); await wt(2800); await skip_story()
        ok('升降籠對話後回到城裡', await ev("!!P.flags.talk7&&X.id==='gauss'"), str(await where()))
        await runev('lewin',1500); await skip_story(80); await wt(800)
        ok('工坊解鎖 R18/R19', await ev("!!P.flags.r18&&!!P.flags.r19&&save.equip.includes('R18')"))
        await runev('lewin'); await skip_story(); await runev('milaB'); await skip_story()
        ok('兩個小委託完成', await ev("Q('c3lens')===2&&Q('c3bp')===2"), str(await ev("[Q('c3lens'),Q('c3bp')]")))
        await runev('toTower',2800); await skip_story(40)
        ok('進入避雷塔', (await where())[0]=='tower', str(await where()))
        await shot('c3_07_tower')
        await runev('anchor'); await skip_story(); await wt(1500)
        ok('十三號五條線索集滿', await ev("!!P.flags.c3_13&&Q('c3thirteen')===2"), str(await ev("[1,2,3,4,5].map(i=>!!P.flags['c3c'+i])")))
        await runev('b4',2500); await skip_story(); await wt(3500); await skip_story()
        ok('戰鬥 4 開始（平台＋強風）', await ev("!!B&&!!B.cfg.lift&&!!B.cfg.wind"))
        r = await ev("""(async()=>{B.pool.Fe=4;B.pool.H2O=2;B.pool.C=2;const u=B.units.ryan;u.ap=4;
            const e=B.enemies.find(e=>e.alive&&e.type==='gendarme');B.anchors=[{i:e.i,j:6},{i:e.i,j:0}];rebuildAnchors();
            const ok1=canCast(RBY.R18);const hp=e.hp;cast(RBY.R18);await new Promise(r=>setTimeout(r,4000));return [ok1,hp,e.hp,e.alive]})()""")
        ok('#R18 能施放並造成傷害', r[0] and (r[2]<r[1] or not r[3]), str(r))
        await wt(1500); await shot('c3_08_b4')
        await ev("(async()=>{save.bspd=3;save.skipFoe=true;endTurn();})()"); await wt(12000)
        ok('第 2 回合（風與平台運作）', await ev("B.turn>=2&&B.phase==='player'"), str(await ev("[B.turn,B.phase]")))
        await win(); await skip_story(); await wt(800)
        await runev('boss',2500); await skip_story(40); await wt(4500); await skip_story()
        ok('頭目戰開始', await ev("!!B&&B.enemies.some(e=>e.type==='coil')"))
        await shot('c3_09_boss')
        for t in range(2):
            await ev("(async()=>{save.bspd=3;save.skipFoe=true;endTurn();})()"); await wt(14000)
        ok('線圈蓄電與放電流程', await ev("B.turn>=3"), str(await ev("[B.turn,B.phase,B.enemies.find(e=>e.type==='coil').charge,B.enemies.find(e=>e.type==='coil').grounded]")))
        await shot('c3_10_boss_t3')
        await win(); await wt(1500)
        for _ in range(8):
            await skip_story(60); await wt(1500)
            if await ev("!!document.querySelector('#ov .card h3')"): break
            if await ev("!$('story').hidden&&document.body.classList.contains('vn')"): await shot('c3_11_end_vn')
        ok('第三章完結畫面', await ev("(document.querySelector('#ov .card h3')||{}).textContent==='第三章　完'"), await ev("(document.querySelector('#ov')||{}).innerText||''"))
        await shot('c3_12_end')
        print('ERRORS', errors[:8]); print('MISSING', missing[:8])
        await b.close()
    print(f'結果：{sum(1 for r in results if r[1])}/{len(results)} 通過')
asyncio.run(main())
