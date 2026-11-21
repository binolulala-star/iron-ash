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
OUT, BASE, VEND = os.path.join(T, 'out'), os.path.join(T, 'baseline'), os.path.join(T, 'vendor', 'three')
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
        await ev("try{localStorage.clear()}catch(e){};refreshContinue&&refreshContinue();TH.mode='off';save.tipsOff=true")

        # 1. 標題
        async def s_title():
            await shot('01_title')
            ok('文件為標準模式（有 DOCTYPE）', await ev("document.compatMode") == 'CSS1Compat')
            vs = await visible_screens()
            ok('標題畫面只顯示一個畫面', vs == ['title'], f'目前可見：{vs}')
            for bid in ['m-new', 'm-ch2', 'm-dex', 'm-battle']:
                ok(f'標題按鈕 #{bid} 存在', await ev(f"!!$('{bid}')"))
        await step('標題畫面', s_title)

        # 2. 存檔欄位選單
        async def s_slots():
            await pg.click('#m-new'); await wt(500); await shot('02_slots')
            ok('存檔欄位選單出現 3 格', await ev("document.querySelectorAll('.slot-row').length") == 3)
            await pg.click('[data-pick="1"]'); await wt(4500)
            ok('選擇欄位 1 後開始序幕', await ev("SLOT===1&&!$('story').hidden"))
            await shot('03_prologue')
        await step('開始遊戲／存檔欄位', s_slots)

        # 3. 立繪模式場景
        async def s_vn():
            await ev("playScene(SCENES.infirmary,()=>{})"); await wt(2500)
            for _ in range(8):
                if await ev("document.querySelectorAll('.vn-p.on').length>=1"): break
                await ev("advance();advance()"); await wt(700)
            ok('軍醫院進入立繪模式', await ev("document.body.classList.contains('vn')"))
            ok('立繪已顯示', await ev("document.querySelectorAll('.vn-p.on').length>=1"))
            await shot('04_vn_infirmary')
            await skip_story()
        await step('立繪模式劇情', s_vn)

        # 4. 探索：奧姆鎮
        async def s_town():
            await ev("P.flags.town_in=1;enterMap('town',{pos:[32,24]})"); await wt(3000); await skip_story()
            vs = await visible_screens()
            ok('探索時只顯示探索畫面', vs == ['explore'], f'目前可見：{vs}')
            ok('立繪模式已關閉', await ev("!document.body.classList.contains('vn')"))
            p0 = await ev("[X.pos.x,X.pos.z]")
            await pg.keyboard.down('ArrowUp'); await wt(1200); await pg.keyboard.up('ArrowUp'); await wt(300)
            p1 = await ev("[X.pos.x,X.pos.z]")
            ok('方向鍵可以移動角色', abs(p1[0]-p0[0]) + abs(p1[1]-p0[1]) > .2, f'{p0}→{p1}')
            await shot('05_town')
        await step('探索：奧姆鎮', s_town)

        # 5. 手帳與圖鑑
        async def s_journal():
            await ev("openJournal()"); await wt(500); await shot('06_journal')
            ok('委託手帳開啟', await ev("!!document.querySelector('.qj')"))
            await ev("dexTab='en';openJournal()"); await wt(400)
            ok('敵人圖鑑開啟', await ev("!!document.querySelector('.dex-grid')"))
            await ev("dexTab='q';$('qj-x').click()"); await wt(300)
        await step('手帳／圖鑑', s_journal)

        # 5b. 系統選單（Esc）
        async def s_menu():
            await pg.keyboard.press('Escape'); await wt(500)
            ok('Esc 打開系統選單', await ev("menuOpen()"))
            await shot('06b_menu')
            await pg.click('#mi-set'); await wt(400)
            ok('設定頁有 6 個項目', await ev("document.querySelectorAll('.set-row').length") == 6)
            await pg.click('[data-set="戰鬥速度"][data-v="2"]'); await wt(300)
            ok('設定「戰鬥速度」生效', await ev("save.bspd") == 2)
            await ev("save.bspd=1;persist()")
            await shot('06c_settings')
            await pg.keyboard.press('Escape'); await wt(300)
            await pg.click('#mi-guide'); await wt(400)
            ok('遊戲指南列出所有說明', await ev("document.querySelectorAll('.gd details').length") == await ev("TIP_ORDER.length"))
            await pg.keyboard.press('Escape'); await wt(300); await pg.keyboard.press('Escape'); await wt(400)
            ok('Esc 關閉選單', not await ev("menuOpen()"))
            ok('探索畫面上沒有舊的音效／畫質／背包按鈕', await ev("[...document.querySelectorAll('#explore .ex-tools>.snd,#postq-x,#ex-bag')].every(b=>getComputedStyle(b).display==='none')"))
        await step('系統選單', s_menu)

        # 5c. 新手提示卡
        async def s_tips():
            await ev("save.tipsOff=false;save.tipsSeen={};P.flags.bcount=0;startBattle(battleSkirmish(['hound'],'town'))"); await wt(5000)
            ok('第一場戰鬥跳出提示卡', await ev("!!document.querySelector('.tip-ov')"))
            await shot('06d_tip')
            for _ in range(4):
                if not await ev("!!document.querySelector('.tip-ov')"): break
                await pg.click('#tip-ok'); await wt(300)
            ok('提示卡可以逐張關閉', not await ev("!!document.querySelector('.tip-ov')"))
            ok('看過的提示有記錄', await ev("!!save.tipsSeen.turn&&!!save.tipsSeen.claire"))
            await ev("save.tipsOff=true;victory()"); await wt(1200); await ev("$('ov').innerHTML='';P.flags.town_in=1;enterMap('town',{pos:[32,24]})"); await wt(2500); await skip_story()
        await step('新手提示', s_tips)

        # 6. 一般戰鬥：走完一個敵方回合並勝利
        async def s_battle():
            await ev("startBattle(battleSkirmish(['hound','miner'],'town'))"); await wt(4500); await skip_story()
            vs = await visible_screens()
            ok('戰鬥時只顯示戰鬥畫面', vs == ['battle'], f'目前可見：{vs}')
            await shot('07_battle')
            done = await ev("""(async()=>{save.bspd=3;save.skipFoe=true;const t0=performance.now();endTurn();
              while(B.phase!=='player'&&performance.now()-t0<45000)await new Promise(r=>setTimeout(r,100));save.bspd=1;return B.phase})()""")
            ok('敵方回合能結束並回到玩家回合', done == 'player', f'phase={done}')
            await ev("victory()"); await wt(1500); await shot('08_victory')
            ok('勝利結算畫面出現', await ev("!!document.querySelector('#ov .overlay')"))
            await ev("$('ov').innerHTML=''")
        await step('戰鬥：一般戰', s_battle)

        # 7. 存檔與讀檔
        async def s_save():
            await ev("P.flags.town_in=1;enterMap('town',{pos:[20,23]})"); await wt(2500); await skip_story()
            await ev("saveRun('map')")
            d = await ev("readSlot(1)")
            ok('自動存檔寫入欄位 1', bool(d) and d.get('map') == 'town', str(d and d.get('map')))
            await ev("show('title')"); await wt(600)
            ok('標題出現「繼續遊戲」', await ev("!$('m-cont').hidden"))
            await ev("loadSlot(1)"); await wt(3000); await skip_story()
            ok('讀檔回到奧姆鎮', await ev("X.id") == 'town')
        await step('存檔／讀檔', s_save)

        # 8. 第一章 Boss
        async def s_boss():
            await ev("SLOT=0;resetParty();bossFight()"); await wt(5000); await skip_story()
            ok('Boss 戰開始', await ev("!$('battle').hidden&&!!B&&B.enemies.length>0"))
            await shot('09_boss1')
        await step('戰鬥：第一章 Boss', s_boss)

        # 9. 第一章所有地圖
        async def s_maps1():
            for m in ['train', 'town', 'sewer', 'yard']:
                n0 = len(errors)
                await ev(f"CHAPTER=1;P.flags['{m}_in']=1;enterMap('{m}')"); await wt(2500); await skip_story()
                ok(f'地圖 {m} 載入', await ev("X.id") == m and len(errors) == n0)
                await shot(f'10_map_{m}')
        await step('第一章地圖巡覽', s_maps1)

        # 10. 第二章
        async def s_ch2():
            await ev("SLOT=0;startCh2()"); await wt(4000); await skip_story(60); await wt(2500); await skip_story(60)
            ok('第二章開始後進入霜港鎮', await ev("CHAPTER===2&&X.id==='frostport'"), await ev("X.id"))
            for m in ['frostport', 'glacier', 'fortress', 'vault']:
                n0 = len(errors)
                await ev(f"P.flags['{m}_in']=1;enterMap('{m}')"); await wt(2800); await skip_story()
                ok(f'地圖 {m} 載入', await ev("X.id") == m and len(errors) == n0)
                await shot(f'11_map_{m}')
            await ev("resetParty();enterChapter2();startBattle(battleC2('b1'))"); await wt(4500); await skip_story()
            ok('第二章戰鬥開始（寒氣地形）', await ev("!!B&&!!B.cfg.cold"))
            await shot('12_battle_c2')
            await ev("startBattle(battleC2('boss'))"); await wt(5000); await skip_story()
            ok('第二章 Boss 戰開始', await ev("!!B&&B.enemies.some(e=>e.type==='colossus')"))
            await shot('13_boss2')
        await step('第二章流程', s_ch2)

        # 11. 回到標題，所有畫面正確收起
        async def s_back():
            await ev("show('title')"); await wt(800)
            vs = await visible_screens()
            ok('回到標題後其他畫面都收起', vs == ['title'], f'目前可見：{vs}')
        await step('返回標題', s_back)

        await b.close()

    # 素材
    ok('沒有缺少的素材檔', not missing, ', '.join(sorted(set(missing))[:8]))

    # 截圖總覽與基準比對
    try:
        from PIL import Image, ImageChops, ImageStat
        cols, tw, th = 3, 420, 236
        sheet = Image.new('RGB', (cols*tw, ((len(shots)+cols-1)//cols)*th), (10, 12, 20))
        warns = []
        for i, n in enumerate(shots):
            im = Image.open(os.path.join(OUT, n + '.png')).convert('RGB')
            sheet.paste(im.resize((tw, th)), (i % cols * tw, i // cols * th))
            bf = os.path.join(BASE, n + '.webp')
            if UPDATE:
                os.makedirs(BASE, exist_ok=True); im.resize((640, 360)).save(bf, 'WEBP', quality=80)
            elif os.path.exists(bf):
                d = ImageStat.Stat(ImageChops.difference(im.resize((320, 180)), Image.open(bf).convert('RGB').resize((320, 180)))).mean
                if sum(d)/3 > 18: warns.append(f'{n}（差異 {sum(d)/3:.0f}）')
        sheet.save(os.path.join(OUT, '_sheet.png'))
        if UPDATE: print('\n已更新基準截圖。')
        elif warns: print('\n⚠ 與基準差異較大，請看 tests/out/_sheet.png 確認是否為預期中的改動：\n  ' + '\n  '.join(warns))
    except ImportError:
        pass

    fails = [r for r in results if not r[1]]
    print(f'\n結果：{len(results)-len(fails)}/{len(results)} 通過')
    if errors: print('頁面錯誤（前 5 筆）：\n  ' + '\n  '.join(errors[:5]))
    json.dump({'pass': not fails, 'results': results, 'errors': errors, 'missing': missing}, open(os.path.join(OUT, 'report.json'), 'w'), ensure_ascii=False, indent=1)
    sys.exit(1 if fails else 0)

asyncio.run(main())
