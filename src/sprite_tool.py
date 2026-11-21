#!/usr/bin/env python3
"""把 AI 生成的角色動作排成「真正的點陣圖」精靈表。

用法：python3 src/sprite_tool.py <名稱> <原圖> <幀名,逗號分隔> [角色像素高度]
例：  python3 src/sprite_tool.py ryan raw.png idle,walkA,walkB,atk 80
輸出：env/ch_<名稱>.webp（所有幀橫排、同尺寸、腳底對齊），並印出寫進程式用的設定。
"""
import os, sys, json
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cutout import cut

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def longest_run(row):
    best = cur = 0
    for v in row:
        cur = cur + 1 if v else 0
        best = max(best, cur)
    return best

def ground_row(a, start=.55):
    """地面線：一整條橫跨大半寬度、不間斷的非背景像素列。"""
    H, W = a.shape[:2]
    bgl = np.median(a[:6].reshape(-1, 3), 0).mean()
    diff = np.abs(a.mean(2) - bgl) > 8
    for y in range(int(H * start), H):
        if longest_run(diff[y]) > W * .55: return y
    return H

def prep(path, crop=None):
    """裁掉地平線以下（標籤文字、影子），可再指定裁切框；回傳暫存檔路徑。"""
    im = Image.open(path).convert('RGB')
    if crop: im = im.crop(crop)
    a = np.asarray(im).astype(int); H, W, _ = a.shape
    bg = np.median(a[:6].reshape(-1, 3), 0)
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    line = (lum < bg.mean() - 14) & (sat < 22)
    cut_y = ground_row(a)
    im = im.crop((0, 0, W, cut_y))
    tmp = '/tmp/_sprite_prep.png'; im.save(tmp); return tmp

def frames_from(path, n, tol=(34, 20)):
    im = cut(path, tol=tol[0], tol2=tol[1], minarea=200)
    a = np.asarray(im)[:, :, 3] > 100
    lab, k = ndimage.label(ndimage.binary_dilation(a, iterations=6))
    objs = [(sl, (lab[sl] == i + 1).sum()) for i, sl in enumerate(ndimage.find_objects(lab))]
    objs = sorted([o for o in objs if o[1] > 3000], key=lambda o: -o[1])[:n]
    objs = sorted(objs, key=lambda o: o[0][1].start)
    out = []
    for sl, _ in objs:
        sub = np.asarray(im)[sl].copy()
        out.append(Image.fromarray(sub))
    return im, out

def shadow_trim(fr):
    """去掉腳下殘留的灰色影子：低彩度、接近背景亮度、位於最下方 8% 的像素。"""
    a = np.asarray(fr).astype(np.int32).copy()
    H = a.shape[0]
    rgb = a[:, :, :3]; sat = rgb.max(2) - rgb.min(2); lum = rgb.mean(2)
    zone = np.zeros(sat.shape, bool); zone[int(H * .9):] = True
    a[:, :, 3][zone & (sat < 18) & (lum > 120)] = 0
    return Image.fromarray(a.astype(np.uint8))

def pixelize(frames, height, colors=56):
    frames = [shadow_trim(f) for f in frames]
    boxes = [f.getbbox() for f in frames]
    hs = [b[3] - b[1] for b in boxes]
    ref = hs[0]  # idle frame sets the scale
    s = height / ref
    small = []
    for f, b in zip(frames, boxes):
        c = f.crop(b)
        w, h = max(1, round(c.width * s)), max(1, round(c.height * s))
        small.append(c.resize((w, h), Image.LANCZOS))
    # shared palette across frames
    strip = Image.new('RGBA', (sum(x.width for x in small), max(x.height for x in small)))
    x = 0
    for f in small: strip.paste(f, (x, 0)); x += f.width
    rgb = strip.convert('RGB'); al = np.asarray(strip)[:, :, 3]
    pal = rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)
    q = np.asarray(pal.convert('RGB'))
    out = []
    x = 0
    for f in small:
        qa = q[:f.height, x:x + f.width]; aa = al[:f.height, x:x + f.width] > 128; x += f.width
        # 1px dark outline
        ring = ndimage.binary_dilation(aa) & ~aa
        rgba = np.zeros((f.height + 2, f.width + 2, 4), np.uint8)
        rgba[1:-1, 1:-1, :3] = qa; rgba[1:-1, 1:-1, 3] = aa * 255
        ring2 = np.zeros(rgba.shape[:2], bool); ring2[1:-1, 1:-1] = ring
        full = np.zeros(rgba.shape[:2], bool); full[1:-1, 1:-1] = aa
        ring2 |= ndimage.binary_dilation(full) & ~full
        rgba[ring2] = (26, 20, 32, 255)
        out.append(Image.fromarray(rgba))
    return out

def feet_center(f):
    a = np.asarray(f)[:, :, 3] > 0
    H = a.shape[0]
    cols = np.where(a[int(H * .55):].any(0))[0]
    return (cols.min() + cols.max()) / 2 if len(cols) else f.width / 2

def frames_by_columns(path, n, tol, crop=None):
    """姿勢被地面線連在一起時：裁到地面線為止，再用姿勢之間的空白欄位切開。"""
    src = Image.open(path).convert('RGB')
    x0, y0, x1, y1 = crop or (0, 0, *src.size)
    a = np.asarray(src.crop((x0, y0, x1, y1))).astype(int)
    base = ground_row(a)
    tmp = '/tmp/_sprite_cols.png'; src.crop((x0, y0, x1, y0 + base)).save(tmp)
    im = cut(tmp, tol=tol[0], tol2=tol[1], minarea=200)
    al = np.asarray(im)[:, :, 3] > 100
    occ = al[:max(1, base - 14)].any(0)
    runs, st = [], None
    for x, v in enumerate(list(occ) + [False]):
        if v and st is None: st = x
        if not v and st is not None:
            if runs and st - runs[-1][1] < 10: runs[-1][1] = x
            else: runs.append([st, x])
            st = None
    runs = sorted(sorted(runs, key=lambda r: -(r[1] - r[0]))[:n])
    out = []
    for r0, r1 in runs:
        f = np.asarray(im).copy()[:, max(0, r0 - 4):r1 + 4]
        lab, k = ndimage.label(f[:, :, 3] > 100)
        if k > 1:
            sz = ndimage.sum(np.ones(lab.shape), lab, range(1, k + 1))
            keep = [i + 1 for i, v in enumerate(sz) if v >= sz.max() * .03]
            f[:, :, 3] = np.where(np.isin(lab, keep), f[:, :, 3], 0)
        out.append(Image.fromarray(f))
    return out

def sheet(name, path, names, height=80, crop=None, flip=(), tol=(34, 20)):
    _, fr = frames_from(prep(path, crop), len(names), tol)
    if len(fr) < len(names):
        fr = frames_by_columns(path, len(names), tol, crop)
    fr = [f.transpose(Image.FLIP_LEFT_RIGHT) if k in flip else f for k, f in enumerate(fr)]
    assert len(fr) == len(names), f'找到 {len(fr)} 個姿勢，預期 {len(names)}'
    px = pixelize(fr, height)
    cx = [feet_center(f) for f in px]
    half = int(max(max(c, f.width - c) for c, f in zip(cx, px))) + 2
    cw, ch = half * 2, max(f.height for f in px)
    out = Image.new('RGBA', (cw * len(px), ch))
    for k, (f, c) in enumerate(zip(px, cx)):
        out.paste(f, (k * cw + int(half - c), ch - f.height), f)
    dst = os.path.join(ROOT, 'env', f'ch_{name}.webp')
    out.save(dst, 'WEBP', lossless=True)
    meta = {'cw': cw, 'ch': ch, 'frames': names, 'body': height + 2}
    print(name, json.dumps(meta))
    return meta

if __name__ == '__main__':
    name, path, names = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    sheet(name, path, names, int(sys.argv[4]) if len(sys.argv) > 4 else 80)
