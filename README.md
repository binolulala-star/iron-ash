# 鐵與灰的等價律（The Law of Iron & Ash）

HD-2D 戰棋鍊金 RPG 試作版：序幕＋第一章＋第二章。單一 HTML 頁面，使用 Three.js r128。

## 目錄

| 路徑 | 內容 |
|---|---|
| `src/engine/` `world/` `chapter2/` `systems/` `art/` `audio/` | 遊戲程式，依 `src/manifest.txt` 的順序串接（架構說明見 `docs/ARCHITECTURE.md`） |
| `src/build.py` | 建置：把 `v2-hd2d.html`（版面與樣式）和各 part 組成 `index.html` |
| `src/cutout.py` | 立繪去背工具 |
| `portraits/` | 角色立繪（webp） |
| `env/` | 場景材質、地標、物件、劇情背景（webp） |
| `index.html` | 建置產物，也就是發布出去的頁面 |
| `tests/smoke.py` | 冒煙測試 |
| `tools/wrapreport.py` | 架構健康報告 |
| `docs/` | 架構說明、美術規範（`docs/ART_GUIDE.md`） |
| `tests/baseline/` | 測試的基準截圖 |
| `tests/vendor/three/` | 測試用的 Three.js 本機副本（不需連網） |
| `music/` | 正式音樂（放進去就會取代程式合成的曲子，見下方） |
| `sfx/` | 音效檔（放進去就會取代同名的合成音效） |
| `art_src/` | AI 生成的原始角色圖 |
| `archive/` | 舊版存檔 |

## 改版流程

```bash
python3 src/build.py          # 1. 建置 index.html
python3 tests/smoke.py        # 2. 冒煙測試，全部通過才發布
git add -A && git commit      # 3. 提交
```

畫面有預期中的改動時，跑 `python3 tests/smoke.py --update-baseline` 更新基準截圖，再一起提交。

## 冒煙測試涵蓋

標題、存檔欄位、序幕、立繪模式劇情、奧姆鎮探索與移動、委託手帳與圖鑑、一般戰鬥（含完整敵方回合與勝利結算）、
自動存檔與讀檔、第一章 Boss、第一章四張地圖、第二章開頭與四張地圖、第二章戰鬥與 Boss、返回標題，
並檢查頁面錯誤、缺少的素材，以及各畫面是否互相疊在一起。需要 Python 3、Playwright（Chromium）與 Pillow。

## 音樂與音效檔

把檔案放進 `music/`，檔名就是曲目代號，建置時會自動登記：

| 檔名 | 用在哪裡 | 沒有檔案時 |
|---|---|---|
| `title` | 標題、序幕 | 合成版 |
| `town` | 奧姆鎮（也代替黎明場景） | 合成版 |
| `battle` | 一般戰鬥（也代替第二章戰鬥、支線戰鬥） | 合成版 |
| `boss` | 第一章、第二章 Boss 戰 | 合成版 |
| `town2`、`battle2`、`boss2`、`snowtown`… | 有檔案就用專屬曲，沒有就用上面的替代 | — |

支援 mp3／ogg／m4a／wav。曲子有前奏時，在 `music/loops.json` 寫 `{"battle": 12.5}`，循環就會從第 12.5 秒開始。
`sfx/` 同理，檔名對應音效代號（例如 `punch.mp3`、`step_snow.mp3`、`coin.mp3`），有檔案就優先使用。
新增檔案後，發布時要把該檔案一起上傳。
