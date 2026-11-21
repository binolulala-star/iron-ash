#!/usr/bin/env python3
"""架構健康報告：列出被包裝最多層的函式與 HOOK 使用情況。用法：python3 tools/wrapreport.py"""
import os, re, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
man = [l.strip() for l in open(os.path.join(ROOT, 'src', 'manifest.txt'), encoding='utf-8') if l.strip() and not l.startswith('#')]
wraps, hooks, lines = collections.defaultdict(list), collections.Counter(), 0
for p in man:
    s = open(os.path.join(ROOT, 'src', p), encoding='utf-8').read(); lines += s.count('\n')
    for m in re.finditer(r"\{const o=([A-Za-z_$]+);\s*\1=function", s):
        if p != 'engine/hooks-install.js': wraps[m.group(1)].append(p)
    for m in re.finditer(r"HOOK\.(after|before)\('([A-Za-z_$]+)'", s): hooks[m.group(2)] += 1
print(f'檔案 {len(man)}、程式 {lines} 行、包裝 {sum(map(len, wraps.values()))} 層（{len(wraps)} 個函式）、HOOK 監聽 {sum(hooks.values())} 個')
print('\n包裝最多層的函式（建議改成 HOOK）：')
for k, v in sorted(wraps.items(), key=lambda x: -len(x[1]))[:12]:
    print(f'  {len(v)} 層  {k:16} ← ' + ', '.join(v))
print('\nHOOK 監聽：' + '、'.join(f'{k}×{v}' for k, v in hooks.most_common()))
