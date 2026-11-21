/* ======================= SYSTEMS: save slots, battle speed, chapter-2 music, collection ======================= */

/* ---------- save slots ---------- */
const SLOT_KEY=n=>'iron-ash-slot-'+n;
let SLOT=0; // 0 = not saving (quick battle / before a slot is chosen)
function readSlot(n){try{const d=JSON.parse(localStorage.getItem(SLOT_KEY(n))||'null');return d&&d.P?d:null;}catch(e){return null;}}
function writeSlot(n,d){if(!n)return;try{localStorage.setItem(SLOT_KEY(n),JSON.stringify(d));}catch(e){}}
// one-time migration of the old single save into slot 1
try{const old=localStorage.getItem(RUN_KEY);if(old&&!localStorage.getItem(SLOT_KEY(1))){const d=JSON.parse(old);if(d&&d.P){d.ch=MAPS[d.map]&&MAPS[d.map].ch===2?2:1;localStorage.setItem(SLOT_KEY(1),JSON.stringify(d));}}}catch(e){}
const snapP=()=>JSON.parse(JSON.stringify({ryan:P.ryan,claire:P.claire,stash:P.stash,flags:P.flags,lv:P.lv,gear:P.gear,items:P.items,owned:P.owned,money:P.money||0,play:P.play||0}));
saveRun=function(stage){if(!SLOT||!P.lv)return;if(P.flags.ch1done&&CHAPTER!==2)return;
  writeSlot(SLOT,{v:2,stage,map:X.id||null,pos:X.pos?[+X.pos.x.toFixed(2),+X.pos.z.toFixed(2)]:null,t:Date.now(),ch:CHAPTER||1,P:snapP()});dexSync();};
loadRun=function(){return SLOT?readSlot(SLOT):null;};
clearRun=function(){};
// chapter boundaries become slot states instead of wiping the save
{const o=chapterEnd;chapterEnd=function(){const sl=SLOT;o();SLOT=sl;P.flags.ch1done=1;if(SLOT)writeSlot(SLOT,{v:2,stage:'ch2start',map:null,pos:null,t:Date.now(),ch:2,P:snapP()});};}
{const o=chapter2End;chapter2End=function(){if(SLOT)writeSlot(SLOT,{v:2,stage:'cleared2',map:null,pos:null,t:Date.now(),ch:2,P:snapP()});o();};}
setInterval(()=>{if($('title').hidden&&P.lv&&!document.hidden)P.play=(P.play||0)+1;},1000);
const fmtPlay=s=>{s=s|0;const h=(s/3600)|0,m=((s%3600)/60)|0;return h?`${h} 小時 ${m} 分`:`${m} 分`;};
const slotWhere=d=>d.stage==='boss'?'第三機庫・決戰前':d.stage==='ch2start'?'第一章 完 → 第二章':d.stage==='cleared2'?'第二章 完':(MAPS[d.map]?MAPS[d.map].name:'—');
function loadSlot(n){const d=readSlot(n);if(!d)return;SLOT=n;
  if(d.stage==='ch2start'||d.stage==='cleared2'){try{localStorage.setItem(CH2_KEY,JSON.stringify(Object.assign({},d.P,{flags:Object.assign({tut_move:1,tut_enc:1},d.P.flags)})));}catch(e){}
    if(d.stage==='cleared2')setTimeout(()=>toast('這個存檔已經通關第二章。從第二章開頭重新遊玩（等級與道具保留）。'),400);startCh2();return;}
  resetParty();Object.assign(P,JSON.parse(JSON.stringify(d.P)));syncMax();if(d.ch===2)enterChapter2();else CHAPTER=1;
  if(d.stage==='boss')openBase(bossFight,'出擊：第三蒸氣機庫');else enterMap(d.map,{pos:d.pos||MAPS[d.map].start});
  toast(`已讀取存檔（欄位 ${n}）。`);}
function slotMenu(mode,onPick){
  const draw=(confirmN)=>{const rows=[1,2,3].map(n=>{const d=readSlot(n);
    const info=d?`<b>${slotWhere(d)}</b><span class="px">第${d.ch===2?'二':'一'}章・萊恩 Lv ${d.P.lv.ryan.lv}・克蕾雅 Lv ${d.P.lv.claire.lv}・${d.P.money||0} ${MK}</span><span class="px">遊玩 ${fmtPlay(d.P.play)}・${new Date(d.t).toLocaleString('zh-TW',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>`:'<b class="empty">空白欄位</b>';
    let btn='';if(mode==='load')btn=d?`<button class="btn primary" data-load="${n}">讀取</button><button class="btn" data-del="${n}">刪除</button>`:'';
    else btn=confirmN===n?`<button class="btn primary" data-pick="${n}">確定覆蓋</button><button class="btn" data-cancel>取消</button>`:`<button class="btn ${d?'':'primary'}" data-${d?'ask':'pick'}="${n}">${d?'覆蓋':'使用'}</button>`;
    if(mode==='load'&&confirmN===n)btn=`<button class="btn primary" data-delok="${n}">確定刪除</button><button class="btn" data-cancel>取消</button>`;
    return`<div class="slot-row"><div class="slot-n">${n}</div><div class="slot-i">${info}</div><div class="slot-b">${btn}</div></div>`;}).join('');
    $('ov').innerHTML=`<div class="overlay"><div class="card frame shop slots"><div class="sh-h"><div><span class="t-eyebrow">SAVE DATA</span><h3>${mode==='load'?'讀取存檔':'選擇存檔欄位'}</h3></div></div>
      <p class="sh-g">${mode==='load'?'遊戲會在移動、對話與戰鬥後自動存到目前使用的欄位。':'新的冒險會自動存到這個欄位。'}</p><div class="sh-list">${rows}</div><div class="row"><button class="btn" id="slot-x">返回</button></div></div></div>`;
    const ov=$('ov');
    ov.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{$('ov').innerHTML='';loadSlot(+b.dataset.load);});
    ov.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>draw(+b.dataset.del));
    ov.querySelectorAll('[data-delok]').forEach(b=>b.onclick=()=>{try{localStorage.removeItem(SLOT_KEY(+b.dataset.delok));}catch(e){}draw();refreshContinue();});
    ov.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>draw(+b.dataset.ask));
    ov.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>draw());
    ov.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{$('ov').innerHTML='';SLOT=+b.dataset.pick;onPick();});
    $('slot-x').onclick=()=>{$('ov').innerHTML='';};};
  draw();}
refreshContinue=function(){const b=$('m-cont');if(!b)return;const all=[1,2,3].map(n=>[n,readSlot(n)]).filter(x=>x[1]);b.hidden=!all.length;
  if(all.length){const [n,d]=all.sort((a,c)=>c[1].t-a[1].t)[0];$('m-cont-s').textContent=`最近：欄位 ${n}・${slotWhere(d)}・萊恩 Lv ${d.P.lv.ryan.lv}`;}};
$('m-cont').onclick=()=>slotMenu('load');
$('m-new').onclick=()=>slotMenu('new',()=>newGame());
{const b=$('m-ch2');if(b)b.onclick=()=>slotMenu('new',()=>startCh2());}
$('m-battle').onclick=()=>{SLOT=0;resetParty();bossFight();};
{const b=$('m-base');if(b)b.onclick=()=>{SLOT=0;resetParty();openBase(bossFight,'出擊：第三蒸氣機庫');};}
{const o=show;show=function(id){o(id);if(id==='title')SLOT=0;};}
refreshContinue();

/* ---------- battle speed & skipping enemy cut-ins ---------- */
save.bspd=save.bspd||1;save.skipFoe=!!save.skipFoe;
{const ts=window.setTimeout.bind(window);window.setTimeout=function(f,ms,...a){if(E.mode==='battle'&&save.bspd>1&&typeof ms==='number')ms=ms/save.bspd;return ts(f,ms,...a);};}
{const g=E.clock.getDelta.bind(E.clock);E.clock.getDelta=function(){const d=g();return E.mode==='battle'&&save.bspd>1?Math.min(d,.05)*save.bspd:d;};}
{const o=thWants;thWants=function(kind){if(B&&B.phase==='enemy'&&save.skipFoe)return false;return o(kind);};}
{const cc=$('camctl');if(cc){const sp=document.createElement('button'),sk=document.createElement('button');sp.id='bspd';sk.id='bskip';
  const lab=()=>{sp.textContent=`速度 ×${save.bspd}`;sk.textContent=save.skipFoe?'敵方動畫：跳過':'敵方動畫：播放';document.documentElement.style.setProperty('--bspd',save.bspd);};
  sp.title='戰鬥速度 ×1 → ×2 → ×3';sk.title='敵方攻擊時是否播放特寫動畫';
  sp.onclick=()=>{save.bspd=save.bspd>=3?1:save.bspd+1;persist();lab();toast(`戰鬥速度 ×${save.bspd}`);};
  sk.onclick=()=>{save.skipFoe=!save.skipFoe;persist();lab();toast(save.skipFoe?'敵方回合不再播放特寫，直接結算。':'敵方攻擊會播放特寫動畫。');};
  cc.appendChild(sp);cc.appendChild(sk);lab();}}

/* ---------- music: chapter 2 and side battles ---------- */
Object.assign(SONGS,{
 snowtown:{bpm:76,prog:[[52,0],[48,1],[55,1],[50,0]],pad:1,arp:8,bass:[0,8],lead:[1,0,0,1,0,1,0,0],lo:71,seed:41,bell:1,wind:1},
 glacier:{bpm:66,prog:[[50,0],[46,1],[52,0],[45,1]],pad:1,arp:4,bass:[0],lead:[1,0,0,0,1,0,0,0],lo:69,seed:47,bell:1,wind:1},
 fortress:{bpm:96,prog:[[50,0],[50,0],[46,1],[45,1]],pad:1,arp:8,bass:[0,4,8,12],lead:[1,0,1,0,1,1,0,0],lo:66,seed:53,snare:1,leadT:'square'},
 vault:{bpm:58,prog:[[49,0],[45,1],[49,0],[44,1]],pad:1,arp:4,bass:[0],lead:[0,0,1,0,0,0,0,1],lo:73,seed:59,bell:1,tick:1},
 battle2:{bpm:148,prog:[[52,0],[48,1],[50,1],[47,1]],pad:0,arp:16,bass:[0,2,4,6,8,10,12,14],oct:1,lead:[1,1,0,1,0,1,1,1],lo:71,seed:61,hat:1,kick:1,bell:1,leadT:'square'},
 side:{bpm:132,prog:[[55,1],[52,0],[48,1],[50,1]],pad:0,arp:8,bass:[0,3,8,11],oct:1,lead:[1,0,1,1,0,1,1,0],lo:71,seed:67,hat:1,kick:1,leadT:'triangle'},
 boss2:{bpm:150,prog:[[50,0],[46,1],[49,1],[45,0]],pad:1,arp:16,bass:[0,2,3,4,6,8,10,11,12,14],oct:1,lead:[1,0,1,1,1,0,1,1],lo:62,seed:71,hat:1,kick:1,tick:1,bell:1,leadT:'sawtooth'},
});
Object.assign(MAP_SONG,{snow:'snowtown',glacier:'glacier',fortress:'fortress',vault:'vault'});
{const o=sched;sched=function(S){if(!S.bell&&!S.wind&&!S.tick&&!S.snare)return o(S);
  const c=AU.ctx,dt=60/S.bpm/4,D=AU.mus;let t=AU.next,s=AU.step;
  while(t<c.currentTime+.15){const bar=Math.floor(s/16)%S.prog.length,i=s%16,ch=chordOf(S.prog[bar]);
    if(S.bell&&(i===0||(i===10&&bar%2)))tone(t,mtof(ch[2]+24),1.4,'sine',.035,D);
    if(S.wind&&i===0&&bar%2===0)noise(t,dt*28,.03,D,'bandpass',600,1400);
    if(S.tick&&i%4===0)noise(t,.03,i%8===0?.07:.04,D,'bandpass',i%8===0?2600:3400);
    if(S.snare&&(i===4||i===12))noise(t,.14,.1,D,'bandpass',1500);if(S.snare&&i%4===0)tone(t,110,.16,'sine',.25,D,45);
    s++;t+=dt;}
  o(S);};}
{const o=startBattle;startBattle=function(cfg){o(cfg);song(cfg.bigBoss?'boss2':cfg.boss?'boss':cfg.side?'side':CHAPTER===2?'battle2':'battle');};}

/* ---------- collection (persists across slots) ---------- */
save.dex=save.dex||{en:{},seen:{},gear:{},el:{}};
function dexSync(){let ch=false;(P.owned||[]).forEach(k=>{if(!save.dex.gear[k]){save.dex.gear[k]=1;ch=true;}});
  Object.keys(P.stash||{}).forEach(k=>{if(P.stash[k]>0&&!save.dex.el[k]){save.dex.el[k]=1;ch=true;}});if(ch)persist();}
{const o=startBattle;startBattle=function(cfg){(cfg.enemies||[]).forEach(([k])=>save.dex.seen[k]=1);persist();o(cfg);};}
{const o=victory;victory=function(){if(B)B.enemies.forEach(e=>save.dex.en[e.type]=(save.dex.en[e.type]||0)+1);persist();o();dexSync();};}
{const o=addLoot;addLoot=function(id){const r=o(id);if(GEAR[id]){save.dex.gear[id]=1;persist();}return r;};}
const EN_DESC={miner:'被「體檢」掏空情緒的礦工。不會痛，也不會停。只能制伏。',hound:'憲兵隊的蒸氣犬。嗅得到鍊金錨點，會衝過去踩碎。',
 sweeper:'在水道裡噴灑中和劑的清道機，酸液壺會遠程潑灑。',guard:'舉著鋼盾的憲兵，正面幾乎打不穿。',mech:'第三蒸氣機庫的守門巨像。外裝甲要先削掉才傷得了核心。',
 wolf:'裝上蒸氣關節的北境雪狼，跑得比雪橇還快。',frostguard:'冰盾衛兵，寒氣讓他們的盾越打越硬。',turret:'架在城牆高台上的寒霧砲台。近戰打不到，得先墊高。',
 crystal:'被抽走情緒、身上長滿冰晶的要塞士兵。只能用稜鏡陣震碎晶體。',colossus:'記憶庫深處的擺鐘機械。每兩回合橫掃一整列。'};
const EL_DESC={Si:'矽。錨點與陣法的基礎材料，分解石頭或廢鐵箱可得。',Fe:'鐵。鐵枷、岩柱與強化用的主要金屬。',H2O:'水。急凍與蒸氣類手札的原料。',C:'碳。燃燒與熱量的來源，也能拿去換東西。',
 Acid:'強酸（H⁺）。腐蝕裝甲用，水道裡到處都是。',Al:'鋁。鋁熱劑的主角，削甲最有效。'};
const DEX_TEX={};function enImg(k){if(DEX_TEX[k]!==undefined)return DEX_TEX[k];let u='';try{const f=ENEMY[k].frames()[0],im=f.image;u=im&&im.toDataURL?im.toDataURL():(im&&im.src)||'';}catch(e){}return DEX_TEX[k]=u;}
let dexTab='q';
{const o=openJournal;openJournal=function(){dexSync();if(dexTab==='q'){o();addTabs();return;}X.keys={};X.target=null;
  let body='';
  if(dexTab==='en')body=`<div class="dex-grid">${Object.keys(ENEMY).map(k=>{const n=save.dex.en[k]||0,s=save.dex.seen[k]||n;const d=ENEMY[k];
    return s?`<div class="dex-c"><div class="dex-im">${enImg(k)?`<img src="${enImg(k)}" alt="">`:''}</div><b>${d.name}</b><span class="px">HP ${d.hp}・攻擊 ${d.atk}${d.rng?`・射程 ${d.rng}`:''}${d.nonlethal?'・只能制伏':''}</span><p>${EN_DESC[k]||''}</p><span class="px">${n?`打倒 ${n} 次`:'遭遇過'}</span></div>`:
      `<div class="dex-c unk"><div class="dex-im"></div><b>？？？</b><span class="px">尚未遭遇</span></div>`;}).join('')}</div>`;
  if(dexTab==='gear')body=`<div class="dex-grid">${Object.keys(GEAR).map(k=>save.dex.gear[k]?`<div class="dex-c"><b>${GEAR[k].name}</b><span class="px">${UNAME[GEAR[k].who]}</span><p>${GEAR[k].desc}</p></div>`:`<div class="dex-c unk"><b>？？？</b><span class="px">尚未取得</span></div>`).join('')}</div>`;
  if(dexTab==='el')body=`<div class="dex-grid">${Object.keys(EL_DESC).map(k=>save.dex.el[k]?`<div class="dex-c"><b class="dex-el">${ELF[k]}</b><p>${EL_DESC[k]}</p></div>`:`<div class="dex-c unk"><b class="dex-el">？</b><span class="px">尚未取得</span></div>`).join('')}</div>`;
  const cnt={en:[Object.keys(save.dex.en).length,Object.keys(ENEMY).length],gear:[Object.keys(save.dex.gear).filter(k=>GEAR[k]).length,Object.keys(GEAR).length],el:[Object.keys(save.dex.el).filter(k=>EL_DESC[k]).length,Object.keys(EL_DESC).length]}[dexTab];
  $('ov').innerHTML=`<div class="overlay"><div class="card frame shop qj"><div class="sh-h"><div><span class="t-eyebrow">COLLECTION</span><h3>${{en:'敵人圖鑑',gear:'飾品圖鑑',el:'元素圖鑑'}[dexTab]}</h3></div><div class="sh-m">${cnt[0]}/${cnt[1]}</div></div>
    <div class="sh-list">${body}</div><div class="row"><button class="btn" id="qj-x">關閉</button></div></div></div>`;
  $('qj-x').onclick=()=>{$('ov').innerHTML='';if(E.mode==='explore')backToMap();};addTabs();};}
function addTabs(){const h=document.querySelector('.qj .sh-h');if(!h)return;const t=document.createElement('div');t.className='sh-tabs dex-tabs';
  t.innerHTML=[['q','委託'],['en','敵人'],['gear','飾品'],['el','元素']].filter(x=>x[0]!=='q'||$('title').hidden).map(([k,n])=>`<button class="btn ${dexTab===k?'primary':''}" data-dt="${k}">${n}</button>`).join('');h.after(t);
  t.querySelectorAll('[data-dt]').forEach(b=>b.onclick=()=>{dexTab=b.dataset.dt;openJournal();});}
{const q=$('ex-quest');if(q)q.textContent='手帳・圖鑑';}
{const tb=$('m-cont');if(tb&&!$('m-dex')){const b=document.createElement('button');b.className='mbtn';b.id='m-dex';b.type='button';b.innerHTML='圖鑑 <small>敵人・飾品・元素</small>';
  const last=$('m-battle');(last||tb).parentNode.insertBefore(b,last||null);b.onclick=()=>{dexTab='en';openJournal();};}}
{const st=document.createElement('style');st.textContent=`
.slot-row{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #222c48}
.slot-n{font-family:var(--pixel);font-size:20px;color:var(--gild);text-align:center}
.slot-i b{display:block;font-family:var(--display);font-size:15px}.slot-i b.empty{color:#4a5478}.slot-i .px{display:block;font-size:11px;color:var(--mist);margin-top:2px}
.slot-b{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
@media (max-width:560px){.slot-row{grid-template-columns:28px minmax(0,1fr)}.slot-b{grid-column:1/-1;justify-content:flex-start}}
.dex-tabs{margin:2px 0 0}
.dex-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.dex-c{border:1px solid #2a3458;padding:8px;display:flex;flex-direction:column;gap:3px;min-width:0}
.dex-c b{font-family:var(--display);font-size:14px;color:var(--parch)}.dex-c .px{font-size:11px;color:var(--mist)}.dex-c p{margin:2px 0 0;font-size:12px;line-height:1.5}
.dex-c.unk b{color:#4a5478}.dex-im{height:72px;display:flex;align-items:flex-end;justify-content:center;background:#0c1020}
.dex-im img{height:68px;width:auto;max-width:100%;object-fit:contain;image-rendering:pixelated}
.dex-el{font-family:var(--pixel)!important;font-size:22px!important;color:var(--gild)!important}
.camctl #bspd,.camctl #bskip{width:auto;height:auto;font-size:10px;padding:4px 3px;font-family:var(--pixel);white-space:nowrap}
`;document.body.appendChild(st);}
