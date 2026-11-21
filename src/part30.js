/* ======================= SYSTEM MENU (Esc) + GAME GUIDE / TUTORIAL CARDS ======================= */

/* ---------- guide cards ---------- */
const TIPS={
 explore:{cat:'探索',t:'在地圖上移動',b:['<b>WASD／方向鍵</b>或點擊地面移動，拖曳畫面旋轉視角，滾輪縮放。','靠近 ◆ 標記按 <b>E／空白鍵</b>調查或對話。頭上有金色「！」的人有委託。','右上角的<b>危險度</b>滿了會遇到敵人。','按 <b>Esc</b> 打開選單：背包、整備、設定、存檔都在裡面。']},
 turn:{cat:'戰鬥基礎',t:'回合與行動點（AP）',b:['每位隊員每回合有 <b>4 AP</b>（左下角的 ◆）。點頭像或角色本身切換要操作的人。','移動、攻擊、分解、施放陣法都要花 AP。兩人的行動可以穿插。','行動完按右下角<b>「結束回合」</b>，換敵人行動。沒用完的 AP 不會留到下一回合。']},
 claire:{cat:'戰鬥基礎',t:'克蕾雅：近戰',b:['選克蕾雅，按<b>「鐵拳」</b>，再點相鄰的敵人攻擊。','礦工這類「只能制伏」的敵人，打倒後不會死，只是倒地。','克蕾雅比萊恩耐打，讓她站在前面擋住敵人。']},
 decompose:{cat:'鍊金術',t:'分解與元素',b:['萊恩站到廢鐵箱、石塊、積水等<b>資源旁邊</b>，按「分解」並點擊資源。','分解出的元素（Si、Fe、H₂O、C……）會存進下方的<b>物質暫存庫</b>，是施放陣法的材料。','有些敵人被打倒時也會掉落元素。']},
 anchor:{cat:'鍊金術',t:'錨點與陣法',b:['萊恩按<b>「刻下錨點」</b>，在腳下留一個錨點，戰場上最多 4 個。','錨點的數量決定陣形：<b>1 單格・2 直線・3 三角・4 四方</b>。陣法需要對應數量的錨點，加上指定的元素。','條件都滿足時，陣法按鈕會<b>亮起</b>，按下就發動，效果作用在錨點連成的範圍內。','巡邏犬和機甲會衝去<b>踩碎錨點</b>，最好在同一回合刻完就發動。']},
 armor:{cat:'戰鬥進階',t:'外裝甲與 BREAK',b:['敵人名條下方的<b>黃色條是外裝甲</b>。有外裝甲時，傷害會被大幅削弱。','把外裝甲打到 0 會 <b>BREAK</b>：敵人暈眩 1 回合，之後的攻擊全額命中。','#R01 石英矛、#R04 強酸、#R10 鋁熱劑都很擅長削甲。']},
 items:{cat:'戰鬥進階',t:'道具與撤退',b:['「道具」可以使用背包裡的繃帶、咖啡等，也要花 AP。','探索時遇到的小型戰鬥可以按<b>「撤退」</b>，有 70% 機率逃跑，失敗會直接結束回合。','整備可以換陣法、改裝克蕾雅的機械鎧，打開選單 →「背包・整備」。']},
 combo:{cat:'鍊金術',t:'氣雲引爆',b:['#R09 會把三角陣內的積水電解成<b>氫氧氣雲</b>（紫色）。','用克蕾雅的「打火石點火」或 #R07 火牆點燃，造成大量真實傷害。']},
 height:{cat:'地形',t:'高低差',b:['有些格子比較高。往上爬一層要多花 1 移動，<b>高差超過 1 層爬不上去</b>。','近戰只能打到高低差 1 層以內的敵人。','<b>從高處往下打，每高一層傷害 +25%</b>。把敵人擊退下高台還會造成墜落傷害。','#R16 可以把指定格子升高一層。']},
 ice:{cat:'地形',t:'冰面',b:['踩上<b>冰面</b>會一路滑到撞上障礙為止，移動前先看好方向。','把敵人擊退到冰面上，它會滑出去撞牆受傷。','冰塊可以分解，得到 H₂O×2。']},
 cold:{cat:'地形',t:'寒氣',b:['北境戰場上，克蕾雅的機械鎧每回合會累積<b>寒氣</b>（頭像下方的 ❄）。','寒氣滿了會<b>凍僵：每回合少 1 AP</b>。','站在<b>蒸氣閥</b>（橘色閥門）旁邊、用 #R03 蒸氣煙幕或 #R07 火牆、或讓萊恩用「碳火暖身」都能驅寒。']},
 shop:{cat:'城鎮',t:'商店',b:['打倒敵人、開寶箱可以拿到<b>馬克</b>。','商店可以買道具、元素和飾品，也能把用不到的東西賣掉。']},
 quest:{cat:'城鎮',t:'委託與彩蛋',b:['頭上有<b>金色「！」</b>的人有委託可接，<b>藍色「？」</b>表示可以回報。','進度記在「委託手帳」。地圖角落還藏著一些沒有標記的彩蛋。']},
 menu:{cat:'系統',t:'選單與設定',b:['按 <b>Esc</b>（戰鬥中按右側的 ⚙）打開選單。','設定裡可以調整音效、畫質、戰鬥速度、敵方動畫與戰鬥演出。','遊戲會自動存檔到目前的欄位，也可以在選單裡手動存檔。']},
};
const TIP_ORDER=['explore','menu','turn','claire','decompose','anchor','armor','items','combo','height','ice','cold','shop','quest'];
save.tipsSeen=save.tipsSeen||{};save.tipsOff=!!save.tipsOff;
const tipHtml=k=>`<ul class="tip-b">${TIPS[k].b.map(x=>`<li>${x}</li>`).join('')}</ul>`;
let TIPQ=[],tipOpen=false;
function tip(...ks){ks.forEach(k=>{if(!TIPS[k]||save.tipsSeen[k]||TIPQ.includes(k))return;TIPQ.push(k);});if(!save.tipsOff)pumpTips();else{TIPQ.forEach(k=>save.tipsSeen[k]=1);TIPQ=[];persist();}}
function tipBlocked(){return !$('story').hidden||(typeof TH!=='undefined'&&TH.active)||!!document.querySelector('#ov .overlay')||(B&&!$('battle').hidden&&B.phase!=='player');}
function pumpTips(){if(tipOpen||!TIPQ.length)return;if(tipBlocked()){setTimeout(pumpTips,400);return;}
  const batch=TIPQ.splice(0,TIPQ.length);let i=0;tipOpen=true;X.keys={};
  const box=document.createElement('div');box.className='tip-ov';document.body.appendChild(box);
  const draw=()=>{const k=batch[i];save.tipsSeen[k]=1;persist();
    box.innerHTML=`<div class="tip-card frame" role="dialog" aria-label="${TIPS[k].t}"><div class="tip-h"><span class="tip-cat">${TIPS[k].cat}</span><span class="tip-n">${batch.length>1?`${i+1}/${batch.length}`:''}</span></div>
     <h3>${TIPS[k].t}</h3>${tipHtml(k)}<div class="tip-f"><label><input type="checkbox" id="tip-off" ${save.tipsOff?'checked':''}> 不再自動顯示提示</label><button class="btn primary" id="tip-ok">${i<batch.length-1?'下一則':'知道了'}</button></div>
     <p class="tip-note">所有提示都能在 選單 →「遊戲指南」重看。</p></div>`;
    $('tip-off').onchange=e=>{save.tipsOff=e.target.checked;persist();};
    $('tip-ok').onclick=()=>{i++;if(i<batch.length)draw();else{box.remove();tipOpen=false;pumpTips();}};$('tip-ok').focus();};
  draw();}
document.addEventListener('keydown',e=>{if(!tipOpen)return;if(e.key==='Enter'||e.key===' '||e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();const b=$('tip-ok');b&&b.click();}},true);

/* triggers */
{const o=startBattle;startBattle=function(cfg){o(cfg);P.flags.bcount=(P.flags.bcount||0)+1;const n=P.flags.bcount;
  const ks=n===1?['turn','claire']:n===2?['decompose','anchor']:n===3?['armor','items']:[];
  if(n>3)ks.push('turn','decompose','anchor');
  if(B.cfg.hgt&&B.cfg.hgt.length)ks.push('height');
  if(B.tiles&&B.tiles.some(r=>r.includes('ice')))ks.push('ice');
  if(B.cfg.cold)ks.push('cold');
  setTimeout(()=>tip(...ks),900);};}
{const o=enterMap;enterMap=function(...a){const r=o(...a);setTimeout(()=>tip('explore','menu'),1800);return r;};}
{const o=openShop;openShop=function(...a){const r=o(...a);tip('shop');return r;};}
{const o=qStart;qStart=function(id){o(id);setTimeout(()=>tip('quest'),1200);};}
{const o=cast;cast=function(r){const res=o(r);if(r&&r.id==='R09')setTimeout(()=>tip('combo'),1500);return res;};}

/* ---------- system menu ---------- */
function setRow(label,opts,cur,fn){return`<div class="set-row"><span class="set-l">${label}</span><div class="seg" role="group" aria-label="${label}">${opts.map(([v,t])=>`<button type="button" class="${String(v)===String(cur)?'on':''}" data-v="${v}" data-set="${label}">${t}</button>`).join('')}</div></div>`;}
const SETTINGS=[
 ['音效',()=>[[1,'開'],[0,'關']],()=>AU.on?1:0,v=>{auInit();setSound(v==='1');}],
 ['畫質',()=>[['high','高'],['std','標準']],()=>save.postQ,v=>{save.postQ=v;persist();applyQ();}],
 ['戰鬥速度',()=>[[1,'×1'],[2,'×2'],[3,'×3']],()=>save.bspd,v=>{save.bspd=+v;persist();}],
 ['敵方攻擊特寫',()=>[[0,'播放'],[1,'跳過']],()=>save.skipFoe?1:0,v=>{save.skipFoe=v==='1';persist();}],
 ['戰鬥演出',()=>[['all','全部'],['big','只有大招'],['off','關閉']],()=>TH.mode,v=>{TH.mode=v;try{localStorage.setItem('iron-ash-anim',v);}catch(e){}thModeBtn&&thModeBtn();}],
 ['新手提示',()=>[[0,'顯示'],[1,'不顯示']],()=>save.tipsOff?1:0,v=>{save.tipsOff=v==='1';persist();}],
];
let menuTab='main';
function menuOpen(){return !!document.querySelector('#ov .sysmenu');}
function openMenu(tab='main'){if(tipOpen)return;menuTab=tab;X.keys={};X.target=null;const inB=!$('battle').hidden&&B,inX=!$('explore').hidden;
  const where=inB?(B.cfg.title||'戰鬥中'):inX&&X.M?X.M.name:'';
  const head=`<div class="sh-h"><div><span class="t-eyebrow">MENU</span><h3>選單</h3></div><div class="sh-m">${P.money||0} ${MK}</div></div>
    <p class="sh-g">${where}${SLOT?`　・　存檔欄位 ${SLOT}`:'　・　這場不會存檔'}　・　遊玩 ${fmtPlay(P.play)}</p>`;
  let body='';
  if(tab==='main'){const it=(id,t,s,dis)=>`<button class="mm-it" id="${id}" type="button" ${dis?'disabled':''}><b>${t}</b><span>${s}</span></button>`;
    body=`<div class="mm-grid">${it('mi-back','回到遊戲','Esc')}${it('mi-bag','背包・整備','道具、陣法、機械鎧改裝',!inX)}${it('mi-quest','手帳・圖鑑','委託、見聞錄、敵人、飾品')}
      ${it('mi-guide','遊戲指南','重看所有操作與系統說明')}${it('mi-set','設定','音效、畫質、戰鬥速度、演出')}${it('mi-save','存檔',SLOT?(inB?'戰鬥中無法存檔':`存到欄位 ${SLOT}`):'這場不會存檔',!SLOT||inB)}
      ${it('mi-title','回到標題',inB?'會放棄這場戰鬥':'未存檔的進度會遺失')}</div>`;}
  if(tab==='set')body=`<div class="set-list">${SETTINGS.map(([l,o,c])=>setRow(l,o(),c())).join('')}</div><p class="note">戰鬥速度與特寫設定只影響戰鬥畫面。</p>`;
  if(tab==='guide'){const cats=[...new Set(TIP_ORDER.map(k=>TIPS[k].cat))];
    body=`<div class="gd">${cats.map(c=>`<h4 class="gh">${c}</h4>`+TIP_ORDER.filter(k=>TIPS[k].cat===c).map(k=>`<details ${save.tipsSeen[k]?'':'class="new"'}><summary>${TIPS[k].t}</summary>${tipHtml(k)}</details>`).join('')).join('')}</div>`;}
  if(tab==='title')body=`<div class="mm-confirm"><p>${inB?'確定要放棄這場戰鬥並回到標題嗎？':'確定要回到標題嗎？'}${SLOT&&!inB?'<br><span class="note">最後一次自動存檔在欄位 '+SLOT+'。</span>':''}</p><div class="row"><button class="btn primary" id="mi-title-ok">回到標題</button><button class="btn" id="mi-cancel">取消</button></div></div>`;
  const backBtn=(tab==='main'||!$('title').hidden)?'<button class="btn" id="mm-x">關閉</button>':'<button class="btn" id="mm-up">‹ 返回選單</button>';
  $('ov').innerHTML=`<div class="overlay"><div class="card frame shop sysmenu">${head}${tab!=='main'?`<h4 class="mm-sub">${{set:'設定',guide:'遊戲指南',title:'回到標題'}[tab]}</h4>`:''}<div class="sh-list">${body}</div><div class="row">${backBtn}</div></div></div>`;
  const on=(id,f)=>{const e=$(id);if(e)e.onclick=f;};
  on('mm-x',closeMenu);on('mi-back',closeMenu);on('mm-up',()=>openMenu('main'));on('mi-cancel',()=>openMenu('main'));
  on('mi-bag',()=>{$('ov').innerHTML='';X.keys={};baseTab='g';openBase(()=>{E.mode='explore';resumeMap();},'回到地圖');});
  on('mi-quest',()=>{$('ov').innerHTML='';dexTab='q';openJournal();});
  on('mi-guide',()=>openMenu('guide'));on('mi-set',()=>openMenu('set'));on('mi-title',()=>openMenu('title'));
  on('mi-save',()=>{saveRun('map');toast(`已存檔到欄位 ${SLOT}。`);closeMenu();});
  on('mi-title-ok',()=>{$('ov').innerHTML='';if(typeof vnOff==='function')vnOff();show('title');refreshContinue();});
  document.querySelectorAll('#ov [data-set]').forEach(b=>b.onclick=()=>{const s=SETTINGS.find(x=>x[0]===b.dataset.set);s[3](b.dataset.v);openMenu('set');});
  const f=document.querySelector('#ov .sysmenu button:not([disabled])');f&&f.focus();}
function closeMenu(){$('ov').innerHTML='';if(!$('explore').hidden&&E.mode==='explore')backToMap&&backToMap();}
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||tipOpen)return;if(!$('story').hidden||!$('title').hidden)return;
  if(menuOpen()){e.preventDefault();menuTab==='main'?closeMenu():openMenu('main');return;}
  if(document.querySelector('#ov .overlay'))return;
  if(!$('explore').hidden||(!$('battle').hidden&&B)){e.preventDefault();openMenu();}});

/* ---------- declutter the HUD ---------- */
{const tools=document.querySelector('#explore .ex-tools');if(tools){
  const mb=document.createElement('button');mb.className='frame';mb.id='ex-menu';mb.type='button';mb.title='選單（Esc）';tools.insertBefore(mb,$('danger'));mb.onclick=()=>openMenu();
  const q=$('ex-quest');if(q)q.textContent='手帳';}}
{const o=moneyHud;moneyHud=function(){o();const m=$('ex-menu');if(m)m.innerHTML=`☰ 選單 <span class="mk">${P.money||0} ${MK}</span>`;};}
moneyHud();
{const cc=$('camctl');if(cc){const b=document.createElement('button');b.id='b-menu';b.type='button';b.title='選單（Esc）';b.setAttribute('aria-label','選單');b.textContent='⚙';cc.appendChild(b);b.onclick=()=>openMenu();}}

{const st=document.createElement('style');st.textContent=`
#explore .ex-tools>.snd,#postq-x,#ex-bag{display:none!important}
.camctl #th-mode,.camctl .snd,.camctl #bspd,.camctl #bskip,.camctl #postq-b{display:none!important}
#ex-menu{padding:8px 12px;color:var(--parch);font-size:13px;font-family:var(--display)}
#ex-menu .mk,#ex-bag .mk{color:var(--gild);margin-left:6px;font-family:var(--pixel);font-size:12px}
.sysmenu{width:min(620px,94vw)}
.mm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.mm-it{display:flex;flex-direction:column;align-items:flex-start;gap:3px;text-align:left;padding:12px 14px;min-height:62px;background:#0f1428;border:1px solid #2a3458;color:var(--parch);cursor:pointer;font:inherit}
.mm-it b{font-family:var(--display);font-size:16px}.mm-it span{font-size:12px;color:var(--mist)}
.mm-it:hover:not([disabled]),.mm-it:focus-visible{border-color:var(--gild);outline:none;background:#151b36}
.mm-it[disabled]{opacity:.4;cursor:default}
#mi-title{border-color:#5a2a2a}
.mm-sub{margin:0 0 6px;font-family:var(--display);color:var(--gild)}
.set-list{display:flex;flex-direction:column}
.set-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #222c48;flex-wrap:wrap}
.set-l{font-family:var(--display);font-size:15px}
.seg{display:flex;border:1px solid #3a4468}
.seg button{background:transparent;border:0;border-left:1px solid #3a4468;color:var(--mist);padding:8px 14px;min-height:38px;cursor:pointer;font:13px var(--display)}
.seg button:first-child{border-left:0}.seg button.on{background:var(--gild);color:#1a1208;font-weight:700}
.seg button:focus-visible{outline:2px solid var(--gild);outline-offset:-2px}
.gd details{border:1px solid #2a3458;margin:0 0 6px;padding:0 12px}
.gd summary{cursor:pointer;padding:10px 0;font-family:var(--display);font-size:15px}
.gd details.new summary::after{content:'未讀';margin-left:8px;font-size:11px;color:var(--gild);border:1px solid var(--gild);padding:0 5px}
.gd .tip-b{padding-bottom:10px}
.mm-confirm p{font-size:15px;line-height:1.7}
.tip-ov{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(4,6,14,.55);padding:16px;animation:tipin .25s ease}
@keyframes tipin{from{opacity:0}to{opacity:1}}
.tip-card{width:min(520px,100%);padding:18px 22px 14px;background:linear-gradient(#141a34,#0c1020)}
.tip-h{display:flex;justify-content:space-between;font-family:var(--pixel);font-size:11px;color:var(--gild)}
.tip-card h3{margin:4px 0 8px;font-family:var(--display);font-size:22px;color:var(--parch)}
.tip-b{margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:7px;font-size:14.5px;line-height:1.6;color:var(--parch)}
.tip-b b{color:var(--gild);font-weight:600}
.tip-f{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap}
.tip-f label{font-size:12px;color:var(--mist);display:flex;gap:6px;align-items:center}
.tip-note{margin:8px 0 0;font-size:11px;color:#5a648a}
@media (max-width:560px){.mm-grid{grid-template-columns:1fr}.mm-it{min-height:52px}}
`;document.body.appendChild(st);}

/* journal tabs gain the guide */
addTabs=function(){const h=document.querySelector('.qj .sh-h');if(!h)return;const t=document.createElement('div');t.className='sh-tabs dex-tabs';
  t.innerHTML=[['q','委託'],['en','敵人'],['gear','飾品'],['el','元素']].filter(x=>x[0]!=='q'||$('title').hidden).map(([k,n])=>`<button class="btn ${dexTab===k?'primary':''}" data-dt="${k}">${n}</button>`).join('')+`<button class="btn" data-gd="1">指南</button>`;h.after(t);
  t.querySelectorAll('[data-dt]').forEach(b=>b.onclick=()=>{dexTab=b.dataset.dt;openJournal();});
  t.querySelector('[data-gd]').onclick=()=>openMenu('guide');};
