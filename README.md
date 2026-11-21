# 鐵與灰的等價律（The Law of Iron & Ash）

HD-2D 戰棋鍊金 RPG 試作版：序幕＋第一章＋第二章。單一 HTML 頁面，使用 Three.js r128。

## 目錄

| 路徑 | 內容 |
|---|---|
| `src/part*.js` | 遊戲程式，依 `src/build.py` 裡的順序串接 |
| `src/build.py` | 建置：把 `v2-hd2d.html`（版面與樣式）和各 part 組成 `index.html` |
| `src/cutout.py` | 立繪去背工具 |
| `portraits/` | 角色立繪（webp） |
| `env/` | 場景材質、地標、物件、劇情背景（webp） |
| `index.html` | 建置產物，也就是發布出去的頁面 |
| `tests/smoke.py` | 冒煙測試 |
| `tests/baseline/` | 測試的基準截圖 |
| `tests/vendor/three/` | 測試用的 Three.js 本機副本（不需連網） |
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
