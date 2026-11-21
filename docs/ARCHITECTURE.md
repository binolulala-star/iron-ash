# 程式架構｜鐵與灰的等價律

## 一句話

單一 HTML 頁面。`src/` 裡的 JS 檔依 `src/manifest.txt` 的順序串接成一個 `<script>`，加上 `v2-hd2d.html` 的版面與樣式，由 `src/build.py` 組成 `index.html`。

## 資料夾

| 資料夾 | 內容 |
|---|---|
| `src/engine/` | 核心：資料表、Three.js 場景、劇情播放、探索、戰鬥規則、成長、戰鬥動畫與特寫、HOOK |
| `src/world/` | 第一章地圖：奧姆鎮、下水道與貨運場、序幕列車 |
| `src/chapter2/` | 第二章：戰鬥規則（高低差、冰面、寒氣）、角色、地圖、劇情與流程 |
| `src/systems/` | 遊戲系統：介面調整、金錢與商店、委託與彩蛋、存檔與圖鑑、選單與新手提示 |
| `src/art/` | 畫面：立繪、手繪材質與物件、戰鬥棋盤與劇情背景、黑影立繪、後製、立繪模式、戰鬥特效、點陣精靈 |
| `src/audio/` | 合成音樂與音效、音樂／音效檔播放 |
| `src/*.py` | 建置與素材工具 |
| `tests/` | 冒煙測試與基準截圖 |
| `tools/` | 維護工具（架構報告） |
| `docs/` | 本文件、美術規範 |

## 執行流程

```
標題 ─ 開始遊戲 → 選存檔欄位 → newGame()
        │
        ├─ playScene(劇情) ── buildSet(場景) ── 立繪模式（有手繪背景時）
        │
        ├─ enterMap(地圖) ── buildFree / buildTown ── 事件（對話、寶箱、商店、委託、自動戰鬥）
        │       └─ 遇敵 → startBattle(cfg)
        │
        └─ startBattle(cfg) ── 玩家回合（移動、分解、錨點、陣法 cast、攻擊 doAction）
                └─ endTurn → 敵方回合 → … → victory / defeat → 回到地圖
```

## 擴充方式：HOOK 優先

早期新功能是用「包住舊函式」的方式疊上去：

```js
{const o=startBattle;startBattle=function(cfg){o(cfg);/* 新功能 */};}
```

包太多層後，執行順序很難追，所以現在改用 HOOK：

```js
HOOK.after('startBattle', cfg => { /* 戰鬥開始後要做的事 */ });
HOOK.before('enterMap', id => { /* 進地圖前要做的事 */ });
```

- 監聽依檔案順序執行，單一監聽出錯不會影響其他監聽（錯誤會印在 console，冒煙測試會抓到）。
- 目前開放 HOOK 的函式：`startBattle`、`buildFree`、`buildTown`、`buildSet`、`enterMap`。要新增請改 `src/engine/hooks-install.js`（必須是 manifest 最後一個檔案）。
- **仍然要用包裝的情況**：需要改變參數或回傳值（例如第二章的高低差加成會改傷害值）、需要在原函式「中間」插入邏輯，或需要等待動畫完成（戰鬥特寫）。

執行 `python3 tools/wrapreport.py` 可以看到目前還有哪些函式被包了很多層。下一批建議改成 HOOK 的是 `cast`、`damageEnemy`、`damageUnit`、`victory`。這幾個牽涉傷害計算與動畫等待，需要先在原函式裡開出事件點。

## 重要的全域物件

| 名稱 | 內容 |
|---|---|
| `E` | 引擎：Three.js 場景、相機、後製、每幀更新清單 `E.fxs`、精靈清單 `E.sprites`、目前模式 `E.mode`（title／scene／explore／battle） |
| `P` | 隊伍：等級、HP、背包、元素、飾品、金錢、劇情旗標 `P.flags` |
| `B` | 目前的戰鬥：棋盤、單位、敵人、錨點、回合 |
| `X` | 目前的地圖：位置、事件、碰撞 |
| `S` | 目前的劇情播放狀態 |
| `save` | 跨存檔的設定與圖鑑（存在瀏覽器） |
| `MAPS`、`SCENES`、`ENEMY`、`RECIPES`、`GEAR`、`ITEMS`、`QUESTS` | 內容資料表 |

## 改版流程

```bash
python3 src/build.py        # 建置
python3 tests/smoke.py      # 冒煙測試，全部通過才發布
python3 tools/wrapreport.py # （選用）看架構健康度
git add -A && git commit && git push
```

## 慣例

- 新功能**開新檔案**放進對應資料夾並加到 manifest，不要把無關的東西塞進舊檔。
- 樣式用 `document.body.appendChild(style)` 加在 body，才蓋得過頁面原本的樣式。
- 本機存取一律 `try/catch`（瀏覽器可能封鎖 localStorage）。
- 素材命名見 `docs/ART_GUIDE.md`。
