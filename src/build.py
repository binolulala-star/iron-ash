import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import re
src=open(os.path.join(ROOT,'v2-hd2d.html')).read()
head,rest=src.split('<script src=',1)
scripts='<script src='+rest.split('<script>\n',1)[0]

CSS='''/* ---------- Exploration ---------- */
#explore{pointer-events:none}
#explore>*{pointer-events:auto}
.ex-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;pointer-events:none;
  padding:calc(12px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px))}
.ex-top>*{pointer-events:auto;min-width:0}
.ex-area{padding:8px 14px;max-width:min(460px,62vw)}
.ex-area b{display:block;font-family:var(--display);font-size:17px;letter-spacing:.06em}
.ex-area b::before{content:"◆ ";color:var(--gild);font-size:12px}
.ex-area span{display:block;font-size:12.5px;color:var(--mist);margin-top:3px;line-height:1.5}
.ex-area span::before{content:"目標　";font-family:var(--pixel);color:var(--verd);font-size:11px}
.danger{padding:8px 12px;min-width:150px}
.danger span{font-family:var(--pixel);font-size:12px;letter-spacing:.08em}
.dbar{height:6px;background:#060912;border:1px solid #2a3556;margin-top:5px;position:relative;overflow:hidden}
.dbar i{position:absolute;inset:0 auto 0 0;width:calc(var(--p,0)*100%);background:#5c9ad8;transition:width .2s,background .3s}
.danger[data-lv="mid"] .dbar i{background:var(--amber)}.danger[data-lv="high"] .dbar i{background:var(--crimson)}
.danger[data-lv="high"] span{color:#f0a49a}.danger[data-lv="off"] .dbar{opacity:.3}
.ex-party{position:absolute;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));padding:8px 12px;display:flex;flex-direction:column;gap:6px;min-width:190px}
.pm{display:grid;grid-template-columns:50px minmax(0,1fr) auto;gap:8px;align-items:center;font-size:12px}
.pm b{font-family:var(--display);font-size:13px}
.pm .bar{margin:0}.pm .bar i{background:linear-gradient(90deg,#2a7a6a,var(--verd))}
.pm span{font-family:var(--pixel);font-size:11px;color:var(--mist);font-variant-numeric:tabular-nums}
.ex-act{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(22px + env(safe-area-inset-bottom,0px));color:var(--parch);padding:10px 20px;font-size:15px;font-family:var(--display);
  display:flex;flex-direction:column;align-items:center;gap:2px;animation:pulse 1.6s infinite}
.ex-act small{font-family:var(--pixel);font-size:10px;color:var(--gild);letter-spacing:.2em}
@keyframes pulse{50%{box-shadow:inset 0 0 0 3px rgba(10,14,28,.9),inset 0 0 0 4px var(--gild),0 0 18px rgba(200,164,86,.45)}}
.ex-help{position:absolute;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));font-size:11px;color:#8a93a8;text-shadow:0 1px 0 #000;max-width:46vw;text-align:right}
@media (max-width:700px){.ex-help{display:none}.ex-party{min-width:150px}.ex-act{bottom:calc(110px + env(safe-area-inset-bottom,0px))}.danger{min-width:110px}}
.toast{position:fixed;left:50%;top:22%;transform:translateX(-50%);padding:10px 18px;font-size:14px;z-index:7;pointer-events:none;opacity:0;max-width:calc(100% - 32px);text-align:center}
.toast.show{animation:tst 3.2s ease-out}
@keyframes tst{0%{opacity:0;margin-top:8px}10%{opacity:1;margin-top:0}80%{opacity:1}100%{opacity:0}}
/* gear / items / result / camera */
.gear-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:16px;max-width:1200px;margin:0 auto;align-items:start}
.gearcol h3 .px{font-size:13px;color:var(--parch)}
.gh{margin:12px 0 6px;font-size:12px;color:var(--mist);font-weight:500;letter-spacing:.12em}
.glist{display:grid;gap:6px;margin-top:8px}
.irow{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid #222c48}
.irow .row{display:flex;gap:6px}.irow .btn{padding:5px 10px;font-size:12px}
.result .rrow{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;font-size:14px;border-bottom:1px solid #222c48;padding-bottom:6px}
.result .rrow span{font-family:var(--pixel);font-size:11px;color:var(--gild);padding-top:3px}
.result .rrow b{font-weight:500;line-height:1.6}
.ab.item{border-color:#2a6a5a}.ab.itm{border-color:#2a6a5a;background:rgba(92,194,173,.1)}
.pm b small{font-family:var(--pixel);font-size:10px;color:var(--gild);margin-left:4px;font-weight:400}
.camctl{position:absolute;right:max(12px,env(safe-area-inset-right,0px));top:44%;display:flex;flex-direction:column;gap:6px;align-items:center;padding:6px}
.camctl button{width:40px;height:36px;background:transparent;border:1px solid var(--gild-dim);color:var(--parch);font-size:18px;line-height:1}
.camctl button:hover{border-color:var(--gild)}
.camctl small{font-family:var(--pixel);font-size:10px;color:var(--mist)}
@media (max-width:760px){.camctl{top:auto;bottom:calc(46vh + 8px);padding:3px;gap:3px;flex-direction:row}.camctl small,.camctl .snd{display:none}.camctl button{width:32px;height:28px;font-size:15px}}
.ex-tools{display:flex;gap:8px;align-items:flex-start}
#ex-bag{padding:8px 12px;color:var(--parch);font-size:13px;font-family:var(--display)}
/* sound / continue / flee */
.snd{background:transparent;border:1px solid var(--gild-dim);color:var(--mist);font-family:var(--pixel);font-size:11px;padding:4px 8px;cursor:pointer}
.snd[aria-pressed="true"]{color:var(--parch)}
.camctl .snd{width:auto;height:auto;font-size:10px;padding:3px 4px;border:0}
.ex-tools .snd{padding:8px 10px}
.title-snd{margin:6px 0 2px 28px;align-self:flex-start}
.epanel.compact .row.sm{display:none}
.erow .row em{font-style:normal;color:var(--amber);font-size:11px}
.ab.flee{border-color:#5a4a7a}
/* cut-in */
.cutin{position:fixed;inset:0;z-index:6;pointer-events:none;--ci:#c8a456}
.cutin::before{content:"";position:absolute;inset:0;background:rgba(4,6,12,.45);opacity:0}
.cutin.go::before{animation:cidim .9s ease both}
@keyframes cidim{0%{opacity:0}15%{opacity:1}80%{opacity:1}100%{opacity:0}}
.ci-band{position:absolute;left:0;right:0;top:calc(30% + env(safe-area-inset-top,0px));height:128px;display:flex;align-items:center;gap:18px;
  padding-left:max(16px,env(safe-area-inset-left,0px));background:linear-gradient(90deg,rgba(10,14,28,.95) 40%,rgba(10,14,28,.55));border-top:2px solid var(--ci);border-bottom:2px solid var(--ci);overflow:hidden}
.ci-band::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 18px,rgba(255,255,255,.04) 18px 20px)}
.cutin.go .ci-band{animation:ciband .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes ciband{0%{transform:translateX(-105%)}18%{transform:translateX(0)}78%{transform:translateX(0);opacity:1}100%{transform:translateX(18%);opacity:0}}
#ci-face{height:124px;width:auto;image-rendering:pixelated;align-self:flex-end;filter:drop-shadow(0 0 8px var(--ci))}
.ci-txt{display:flex;flex-direction:column;gap:4px;min-width:0;position:relative;z-index:1}
.ci-txt b{font-family:var(--display);font-size:clamp(22px,4.4vw,38px);letter-spacing:.08em;color:#fff;text-shadow:0 0 14px var(--ci)}
.ci-txt span{font-family:var(--pixel);font-size:12px;color:var(--ci);letter-spacing:.12em}
/* battle theater */
#th-ui{position:fixed;inset:0;z-index:5;cursor:pointer;--tc:#c8a456}
.th-letter{position:absolute;left:0;right:0;height:9vh;background:#000;z-index:1}
.th-letter.top{top:0;animation:ltop .3s ease-out both}.th-letter.bot{bottom:0;animation:lbot .3s ease-out both}
@keyframes ltop{from{transform:translateY(-100%)}}@keyframes lbot{from{transform:translateY(100%)}}
.th-name{position:absolute;left:0;top:calc(9vh + 14px);padding:8px 28px 10px max(16px,env(safe-area-inset-left,0px));background:linear-gradient(90deg,rgba(8,10,20,.92) 70%,transparent);
  border-left:4px solid var(--tc);display:flex;flex-direction:column;gap:2px;max-width:calc(100% - 32px)}
.th-name.go{animation:thn .5s cubic-bezier(.2,.8,.2,1) both}
@keyframes thn{from{transform:translateX(-110%)}}
.th-name b{font-family:var(--display);font-size:clamp(22px,3.8vw,36px);letter-spacing:.06em;color:#fff;text-shadow:0 0 14px var(--tc),2px 2px 0 #000;font-style:italic}
.th-name small{font-family:var(--pixel);font-size:11px;color:var(--tc);letter-spacing:.14em}
.th-hp{position:absolute;bottom:calc(9vh + 12px);width:min(340px,44vw);padding:8px 12px;background:rgba(8,10,20,.88);border:1px solid var(--gild-dim);box-shadow:inset 0 0 0 2px rgba(10,14,28,.9);display:grid;gap:4px}
.th-hp.a{left:max(16px,env(safe-area-inset-left,0px))}.th-hp.d{right:max(16px,env(safe-area-inset-right,0px));text-align:right}
.th-hp b{font-family:var(--display);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.th-hp .bar{height:8px;margin:0}.th-hp .bar i{transition:width .7s ease-out;background:linear-gradient(90deg,#2a7a6a,var(--verd))}
.th-hp.d .bar i{background:linear-gradient(90deg,#8a2a22,var(--crimson));margin-left:auto}
.th-hp span{font-family:var(--pixel);font-size:11px;color:var(--mist)}
.th-skip{position:absolute;bottom:2.4vh;right:max(16px,env(safe-area-inset-right,0px));z-index:2;font-size:11px;color:#8a93a8;font-family:var(--pixel)}
#th-dmg{position:absolute;inset:0;pointer-events:none}
.th-num{position:absolute;transform:translate(-50%,-50%);font-family:var(--display);font-weight:700;font-size:34px;letter-spacing:.02em;
  text-shadow:0 0 2px #000,2px 2px 0 #000,-2px 2px 0 #000,0 0 18px rgba(255,160,60,.6);animation:thnum 1.4s ease-out both;white-space:nowrap}
.th-num.big{font-size:54px}
@keyframes thnum{0%{opacity:0;transform:translate(-50%,-20%) scale(1.8)}12%{opacity:1;transform:translate(-50%,-50%) scale(1)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-110%)}}
#th-fade{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:6}
#th-fade.go{animation:thf .35s ease-out}
@keyframes thf{0%{opacity:.85}100%{opacity:0}}
body.in-theater .hud-top,body.in-theater #deck,body.in-theater .camctl,body.in-theater #log,body.in-theater .field-ctl,body.in-theater #ftl{visibility:hidden}
.camctl #th-mode{width:auto;height:auto;font-size:10px;padding:4px 3px;font-family:var(--pixel);white-space:nowrap}
@media (max-width:760px){.th-hp{width:calc(50% - 22px)}.th-name b{font-size:20px}}
/* town 2.0 */
.minimap{position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:calc(82px + env(safe-area-inset-top,0px));padding:6px;display:flex;flex-direction:column;gap:5px}
.minimap canvas{display:block;width:192px;height:144px;image-rendering:pixelated;border:1px solid #2a3556}
.minimap.big canvas{width:min(560px,80vw);height:auto}
.mm-bar{display:flex;gap:4px}.mm-bar button{flex:1;background:transparent;border:1px solid var(--gild-dim);color:var(--parch);font-family:var(--pixel);font-size:11px;padding:4px 0;cursor:pointer}
.ex-zone{position:absolute;left:50%;top:calc(18% + env(safe-area-inset-top,0px));transform:translateX(-50%);text-align:center;pointer-events:none;opacity:0}
.ex-zone span{display:block;font-family:var(--display);font-size:clamp(22px,3.4vw,32px);letter-spacing:.3em;color:var(--parch);text-shadow:0 2px 0 #000,0 0 14px rgba(200,164,86,.5);white-space:nowrap}
.ex-zone span::before,.ex-zone span::after{content:" — ";color:var(--gild)}
.ex-zone small{font-family:var(--pixel);font-size:12px;color:#f0a49a;letter-spacing:.12em}
.ex-zone.go{animation:zn 2.8s ease both}
@keyframes zn{0%{opacity:0;margin-top:8px}15%{opacity:1;margin-top:0}75%{opacity:1}100%{opacity:0}}
@media (max-width:700px){.minimap canvas{width:132px;height:99px}.minimap{top:calc(118px + env(safe-area-inset-top,0px))}}
/* standing portraits */
.st-stand{position:absolute;right:max(2%,calc(50% - 520px));bottom:calc(18px + 96px + env(safe-area-inset-bottom,0px));height:min(68vh,640px);pointer-events:none;opacity:0;transform:translateX(40px);transition:opacity .25s ease,transform .3s cubic-bezier(.2,.8,.2,1)}
.st-stand.on{opacity:1;transform:none}
.st-stand img{height:100%;width:auto;display:block;filter:drop-shadow(0 6px 18px rgba(0,0,0,.55)) drop-shadow(0 0 1px rgba(255,220,160,.35))}
.st-stand.swap img{animation:stswap .22s ease}
@keyframes stswap{from{opacity:.55;transform:translateY(4px)}to{opacity:1;transform:none}}
.st-name span{display:none}
@media (max-width:700px){.st-stand{height:46vh;right:-6%;bottom:calc(18px + 120px + env(safe-area-inset-bottom,0px))}}
/* pilot cut-in (theater) */
#th-cut{position:absolute;inset:0;z-index:3;pointer-events:none;--cc:#c8a456;overflow:hidden}
#th-cut .band{position:absolute;left:-10%;right:-10%;top:calc(50% - min(21vh,170px));height:min(42vh,340px);transform:skewY(-6deg);
  background:linear-gradient(90deg,rgba(6,8,16,.96),rgba(14,18,34,.9) 55%,rgba(6,8,16,.96));border-top:3px solid var(--cc);border-bottom:3px solid var(--cc);box-shadow:0 0 40px rgba(0,0,0,.6)}
#th-cut .band::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 30px,rgba(255,255,255,.035) 30px 33px)}
#th-cut-img{position:absolute;right:6%;top:calc(50% - min(32vh,260px));height:min(64vh,520px);width:auto;filter:drop-shadow(0 0 14px var(--cc))}
#th-cut-line{position:absolute;left:8%;top:50%;transform:translateY(-50%);max-width:52%;font-family:var(--display);font-weight:700;font-style:italic;
  font-size:clamp(22px,3.6vw,40px);color:#fff;text-shadow:0 0 16px var(--cc),3px 3px 0 #000;letter-spacing:.04em;line-height:1.3}
#th-cut.go .band{animation:cband .95s cubic-bezier(.2,.8,.2,1) both}
#th-cut.go #th-cut-img{animation:cimg .95s cubic-bezier(.2,.8,.2,1) both}
#th-cut.go #th-cut-line{animation:cline .95s cubic-bezier(.2,.8,.2,1) both}
@keyframes cband{0%{transform:skewY(-6deg) translateX(110%)}16%{transform:skewY(-6deg) translateX(0)}82%{transform:skewY(-6deg) translateX(0);opacity:1}100%{transform:skewY(-6deg) translateX(-30%);opacity:0}}
@keyframes cimg{0%{transform:translateX(60%);opacity:0}22%{transform:translateX(0);opacity:1}80%{transform:translateX(-4%);opacity:1}100%{transform:translateX(-14%);opacity:0}}
@keyframes cline{0%{opacity:0;transform:translateY(-50%) translateX(-40px)}28%{opacity:1;transform:translateY(-50%)}82%{opacity:1}100%{opacity:0}}
#th-cut.foe #th-cut-img{right:auto;left:6%}
#th-cut.foe #th-cut-line{left:auto;right:8%;text-align:right}
#th-cut.foe .band{background:linear-gradient(90deg,rgba(26,6,10,.96),rgba(40,10,16,.9) 45%,rgba(14,6,10,.96))}
#th-cut.foe.go .band{animation-name:cbandF}#th-cut.foe.go #th-cut-img{animation-name:cimgF}
@keyframes cbandF{0%{transform:skewY(6deg) translateX(-110%)}16%{transform:skewY(6deg) translateX(0)}82%{transform:skewY(6deg) translateX(0);opacity:1}100%{transform:skewY(6deg) translateX(30%);opacity:0}}
@keyframes cimgF{0%{transform:translateX(-60%);opacity:0}22%{transform:translateX(0);opacity:1}80%{transform:translateX(4%);opacity:1}100%{transform:translateX(14%);opacity:0}}
@media (max-width:700px){#th-cut.foe #th-cut-img{left:-8%}}
#th-react{position:absolute;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(9vh + 92px);z-index:2;display:flex;align-items:flex-end;gap:8px;pointer-events:none}
#th-react .rf{width:120px;height:120px;overflow:hidden;border:2px solid #d0503f;background:rgba(8,10,20,.9);box-shadow:0 0 18px rgba(208,80,63,.5)}
#th-react-img{height:260px;width:auto;margin-left:-58px;margin-top:-6px}
#th-react-line{font-family:var(--display);font-size:16px;color:#fff;background:rgba(8,10,20,.88);border:1px solid var(--gild-dim);padding:6px 10px;margin-bottom:6px}
#th-react.go{animation:rct 1.5s ease both}
@keyframes rct{0%{opacity:0;transform:translateX(-30px)}12%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0}}
@media (max-width:700px){#th-cut-img{right:-8%;height:min(50vh,420px);top:calc(50% - min(25vh,210px))}#th-cut-line{max-width:60%;font-size:20px}#th-react .rf{width:84px;height:84px}#th-react-img{height:190px;margin-left:-44px}}
#ci-face{image-rendering:auto}
/* enemy list */
.epanel{padding:7px 10px;display:flex;flex-direction:column;gap:5px;max-height:30vh;overflow:auto}
.erow .row{display:flex;justify-content:space-between;font-size:12px;gap:8px;font-family:var(--pixel)}
.erow .row b{font-family:var(--display);font-size:13.5px}
.erow .row.sm{font-size:10.5px;color:var(--mist)}
.erow+.erow{border-top:1px solid #222c48;padding-top:5px}
.erow.dead{opacity:.38}
.ebars{display:grid;grid-template-columns:2fr 1fr;gap:4px}.ebars.one{grid-template-columns:1fr}.ebars .bar{height:5px}
.erow .row.sm .hot{color:var(--amber)}
'''
head=head.replace('.grey #gl{',CSS+'.grey #gl{')

# enemy panel + env ids
head=re.sub(r'<div class="env frame">.*?</div>\s*<div class="boss frame">.*?<div class="tags" id="h-tags"></div>\s*</div>',
  '<div class="env frame"><b id="env-t">第一章 · 第三蒸氣機庫</b><span id="env-s"></span></div>\n    <div class="epanel frame" id="epanel"></div>',head,flags=re.S)
assert 'epanel' in head
head=head.replace('<button class="mbtn" id="m-new">','<button class="mbtn" id="m-cont" hidden>繼續遊戲 <small id="m-cont-s"></small></button>\n    <button class="mbtn" id="m-new">',1)
head=head.replace('<button class="mbtn" id="m-battle">直接進入戰鬥 <small>第三蒸氣機庫</small></button>','<button class="mbtn" id="m-battle">直接進入 BOSS 戰 <small>第三蒸氣機庫</small></button>\n    <button class="snd title-snd" type="button">♪</button>')
head=head.replace('<button class="btn" id="bc-back">回到標題</button>','<button class="snd" type="button">♪</button>\n    <button class="btn" id="bc-back">回到標題</button>')
head=head.replace('<button class="mbtn" id="m-new">開始遊戲 <small>序幕 → 第一章</small></button>','<button class="mbtn" id="m-new">開始遊戲 <small>序幕 → 第一章・奧姆鎮</small></button>\n    <button class="mbtn" id="m-ch2">第二章　白銀之顎 <small>從第二章開始・北境要塞</small></button>')
head=head.replace('試作版　序幕＋第一章','試作版　序幕＋第一章＋第二章')
EX='''<section id="explore" class="screen" hidden>
  <div class="ex-top">
    <div class="ex-area frame"><b id="ex-area"></b><span id="ex-obj"></span></div>
    <div class="ex-tools"><button class="snd frame" type="button">♪</button><button class="frame" id="ex-bag">背包・整備</button><div class="danger frame" id="danger"><span id="danger-t">危險度・低</span><div class="dbar"><i></i></div></div></div>
  </div>
  <div class="ex-party frame" id="ex-party"></div>
  <div class="minimap frame" id="minimap" hidden><canvas id="mm" width="192" height="144"></canvas><canvas id="mm-base" width="192" height="144" hidden></canvas><div class="mm-bar"><button id="ex-rotl" title="視角左轉（按住 Q 連續旋轉）">⟲ Q</button><button id="mm-toggle" title="放大地圖 (M)">地圖 M</button><button id="ex-rotr" title="視角右轉（按住 R 連續旋轉）">R ⟳</button></div></div>
  <div class="ex-zone" id="ex-zone"></div>
  <button class="ex-act frame" id="ex-act" hidden></button>
  <div class="ex-help px">WASD／方向鍵或點擊地面移動 · 拖曳旋轉視角、滾輪縮放 · E／空白鍵調查</div>
</section>
<div class="toast frame" id="toast"></div>
'''
head=head.replace('<div class="banner" id="banner"></div>',EX+'<div id="th-fade"></div><div id="th-ui" hidden><div class="th-letter top"></div><div class="th-letter bot"></div><div class="th-name" id="th-name"><small id="th-sub"></small><b id="th-title"></b></div><div class="th-hp a" id="th-ab"><b id="th-an"></b><div class="bar"><i id="th-ah"></i></div><span id="th-ap"></span></div><div class="th-hp d" id="th-db"><b id="th-dn"></b><div class="bar"><i id="th-dh"></i></div><span id="th-dp"></span></div><div id="th-cut" hidden><div class="band"></div><img id="th-cut-img" alt=""><div id="th-cut-line"></div></div><div id="th-react" hidden><div class="rf"><img id="th-react-img" alt=""></div><div id="th-react-line"></div></div><div class="th-skip">點擊畫面或按空白鍵略過</div><div id="th-dmg"></div></div>\n<div class="cutin" id="cutin" hidden><div class="ci-band"><canvas id="ci-face" width="80" height="104"></canvas><div class="ci-txt"><b id="ci-t"></b><span id="ci-s"></span></div></div></div>\n<div class="banner" id="banner"></div>')
head=head.replace('<button class="tab" role="tab" id="tab-w" aria-selected="false">克蕾雅・機械鎧工坊</button>','<button class="tab" role="tab" id="tab-w" aria-selected="false">克蕾雅・機械鎧工坊</button>\n      <button class="tab" role="tab" id="tab-g" aria-selected="false">等級・飾品・道具</button>')
assert 'tab-g' in head
head=head.replace('<div class="field-ctl" id="field-ctl">','<div class="camctl frame" id="camctl"><small>視角</small><button id="cam-l" title="向左旋轉 (Q)" aria-label="向左旋轉視角">⟲</button><button id="cam-r" title="向右旋轉 (E)" aria-label="向右旋轉視角">⟳</button><button id="cam-0" title="重置視角" aria-label="重置視角" style="font-size:12px">⌂</button><button id="th-mode" type="button">演出：全部</button><button class="snd" type="button">♪</button></div>\n  <div class="field-ctl" id="field-ctl">')
assert 'cam-l' in head
js=''.join(open(os.path.join(ROOT,'src',f'part{i}.js')).read()+'\n' for i in (1,2,3,5,4,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30))
out=head+scripts+'<script>\n'+js+'</script>\n'
out=out.replace('<div class="st-box frame" id="st-box">','<div class="st-stand" id="st-stand"><img id="st-stand-img" alt=""></div>\n  <div class="st-box frame" id="st-box">',1)
assert 'st-stand-img' in out
SKEL='<!DOCTYPE html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>body{margin:0}[hidden]{display:none!important}</style>\n</head><body>\n'
if not out.lstrip().lower().startswith('<!doctype'):out=SKEL+out+'\n</body></html>'
open(os.path.join(ROOT,'index.html'),'w').write(out)
print(len(out))
