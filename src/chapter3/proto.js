/* ======================= CHAPTER 3 — mechanic playtest (title menu → 第三章 機制試玩) =======================
   Three small battles, one per new mechanic, with a Lv 7 party carrying chapter-2 notes. Placeholder art where
   the final sheets are not in yet. Nothing here touches save slots; equip loadout is restored on the way out. */
function battleC3(id){
  const C={
   wind:{theme:'fortress',N:7,title:'試玩一・飛艇碼頭的強風',envT:'第三章 · 風暴外緣・飛艇碼頭',envS:'試玩：強風',
     wind:{seq:[[1,0],[0,-1],[-1,0],[0,1]],every:3,edge:'fall'},
     enemies:[['stormkite',2,0],['stormkite',4,1],['guard',5,2]],
     res:[['wall',1,3],['wall',4,4],['wall',2,5],['scrap',0,5],['oil',6,6],['si',3,2]],colTex:'fstone',
     guide:'畫面上的白色氣流是風向（右上角也有標示）。每個敵方回合結束，站在空地上的人都會順風被吹 1 格；牆或高台的正後方是「風影格」，吹不動。風把敵人吹出平台邊緣就直接墜落。風暴鳶乘風飛行，不受影響。每 3 回合風向會轉一次。'},
   magnet:{theme:'fortress',N:7,title:'試玩二・磁軌礦坑的磁柱',envT:'第三章 · 磁軌礦坑',envS:'試玩：磁力格',
     enemies:[['golem',1,1],['golem',5,1],['gendarme',3,0]],
     res:[['pylon',3,2],['pylon',1,4],['pylon',5,4],['scrap',0,6],['oil',6,6],['si',3,5]],colTex:'fstone',
     guide:'藍色光環的是磁柱。每回合開始，磁柱 2 格內的金屬單位會被吸過去 1 格：魔像、憲兵，還有克蕾雅的機械臂。萊恩站在磁柱旁邊可以用「共振反轉」把它改成斥力（紅色）2 回合，當場把周圍的金屬推開。魔像太重，強風吹不動，但磁力拉得動。'},
   lift:{theme:'fortress',N:7,title:'試玩三・避雷塔的浮空平台',envT:'第三章 · 避雷塔中段',envS:'試玩：浮空平台＋強風',
     wind:{seq:[[0,-1],[-1,0],[0,1],[1,0]],every:3,edge:'fall'},
     lift:[[1,2,0],[2,2,1],[4,2,2],[5,2,3],[3,4,1],[0,5,2],[6,5,0]],
     enemies:[['gendarme',1,0],['gendarme',5,0],['turret',3,0]],
     res:[['wall',3,1],['scrap',0,6],['oil',6,6],['si',3,6]],colTex:'fstone',
     guide:'會升降的是浮空平台，高度在 0、1、2 層之間循環。格子角落的箭頭是下一回合的方向：綠色上升、橘色下降。站在上面會跟著移動；從高處攻擊傷害 +25%，被風從高處吹下去會摔傷。這場同時有強風。'},
  };
  const c=C[id];return Object.assign({ch3:true,explore:false},c);
}
const C3P={equip:null,mods:null};
function c3ProtoStart(id){
  C3P.equip=save.equip.slice();C3P.mods=Object.assign({},save.mods);
  if(typeof SLOT!=='undefined')SLOT=0;
  resetParty();P.lv={ryan:{lv:7,exp:0},claire:{lv:7,exp:0}};P.owned=['amulet','bracer','fork'];P.gear={ryan:'fork',claire:'bracer'};
  P.items={bandage:3,coffee:2,capsule:1};P.stash={Fe:2,C:1,H2O:1,Si:1};syncMax();healParty(1);enterChapter2();ch2Equip();
  const c=battleC3(id);c.onWin=c3ProtoEnd;startBattle(c);}
function c3ProtoEnd(){if(C3P.equip){save.equip=C3P.equip;save.mods=C3P.mods;persist();C3P.equip=null;}
  show('title');setTimeout(c3ProtoMenu,300);}
function c3ProtoMenu(){
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><span class="t-eyebrow">CHAPTER 3 · PLAYTEST</span><h3>第三章　機制試玩</h3>
   <p>三場小戰鬥，每場只教一個新機制。角色固定 Lv 7，部分敵人還是暫代圖。打完會回到這裡，不會動到你的存檔。</p>
   <div class="row" style="flex-direction:column;align-items:stretch;gap:8px">
    <button class="btn primary" data-c3="wind">一・強風（飛艇碼頭）</button>
    <button class="btn" data-c3="magnet">二・磁力格（磁軌礦坑）</button>
    <button class="btn" data-c3="lift">三・浮空平台（避雷塔）</button>
    <button class="btn" id="c3-x">關閉</button></div></div></div>`;
  $('ov').querySelectorAll('[data-c3]').forEach(b=>b.onclick=()=>{$('ov').innerHTML='';c3ProtoStart(b.dataset.c3);});
  $('c3-x').onclick=()=>{$('ov').innerHTML='';};}
/* losing a playtest battle: retry or leave, never the chapter-1 base/rest options */
{const o=defeat;defeat=function(){if(!B||!B.cfg.ch3||B.cfg.onWin!==c3ProtoEnd)return o();
  if(B.phase==='lost')return;B.phase='lost';const id=Object.entries({wind:1,magnet:1,lift:1}).map(([k])=>k).find(k=>battleC3(k).title===B.cfg.title);
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><h3>小隊潰滅</h3><p>再試一次，或回到試玩選單。</p>
   <div class="row"><button class="btn primary" id="c3-r">重新挑戰</button><button class="btn" id="c3-m">回試玩選單</button></div></div></div>`;
  $('c3-r').onclick=()=>{$('ov').innerHTML='';c3ProtoStart(id);};$('c3-m').onclick=()=>{$('ov').innerHTML='';c3ProtoEnd();};};}
/* title menu entry, under 第二章 */
{const ch2=$('m-ch2');if(ch2){const b=document.createElement('button');b.className='mbtn';b.id='m-ch3p';b.innerHTML='第三章　機制試玩 <small>強風・磁力格・浮空平台</small>';
  ch2.after(b);b.onclick=c3ProtoMenu;}}
