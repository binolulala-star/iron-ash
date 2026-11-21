/* ======================= GROWTH · LOOT · GEAR ======================= */
const GEAR={
 amulet:{name:'黃銅護符',who:'ryan',hp:20,desc:'HP +20。母親留下的舊護符，背面刻著礦坑編號。'},
 caliper:{name:'精密游標卡尺',who:'ryan',rec:.12,desc:'陣法傷害 +12%。量得準，陣就收得緊。'},
 fork:{name:'校準音叉',who:'ryan',tap:20,hp:10,desc:'音叉敲擊 +20 傷害，HP +10。'},
 bracer:{name:'鉚釘護腕',who:'claire',arm:8,desc:'護甲 +8。憲兵制式護具，改裝過鉚釘。'},
 piston:{name:'高壓活塞',who:'claire',atk:8,desc:'攻擊 +8。從巡邏犬腿上拆下來的。'},
 coating:{name:'防酸塗層',who:'claire',hp:30,desc:'HP +30。清道機外殼上的耐酸釉。'},
};
const ITEMS={
 bandage:{name:'蒸氣繃帶',ap:1,desc:'選中的隊員回復 80 HP'},
 coffee:{name:'濃縮黑咖啡',ap:0,desc:'選中的隊員 AP +2'},
 capsule:{name:'元素膠囊',ap:0,desc:'隨機取得 3 個元素放進暫存庫'},
};
const EXP_OF={miner:12,hound:18,sweeper:22,guard:34,mech:160};
const DROPS={miner:[['bandage',.35],['coffee',.12]],hound:[['bandage',.3],['piston',.16],['caliper',.08]],
  sweeper:[['capsule',.4],['coating',.18]],guard:[['bandage',.4],['bracer',.35],['amulet',.15]],mech:[['fork',1],['coffee',1]]};
const needExp=lv=>40+lv*30;
const UNAME={ryan:'萊恩',claire:'克蕾雅'};
function unitStats(k){const L=P.lv[k].lv-1,g=GEAR[P.gear[k]]||{};
  if(k==='ryan')return{max:160+12*L+(g.hp||0),arm:0,atk:0,mv:3,rec:1+.06*L+(g.rec||0),tap:30+(g.tap||0)};
  const s=claireStats(save.mods);return{max:s.hp+15*L+(g.hp||0),arm:s.arm+(g.arm||0),atk:s.atk+3*L+(g.atk||0),mv:s.mv,rec:1,tap:0};}
function syncMax(){['ryan','claire'].forEach(k=>{const m=unitStats(k).max,d=m-P[k].max;P[k].max=m;P[k].hp=Math.max(1,Math.min(m,P[k].hp+Math.max(0,d)));});}
function addLoot(id){
  if(GEAR[id]){if(P.owned.includes(id)){P.items.bandage=(P.items.bandage||0)+1;return ITEMS.bandage.name;}P.owned.push(id);return GEAR[id].name+'（新飾品）';}
  P.items[id]=(P.items[id]||0)+1;return ITEMS[id].name;}
function rollDrops(type){const out=[];(DROPS[type]||[]).forEach(([id,c])=>{if(Math.random()<c)out.push(id);});return out;}
function grantExp(n){const ups=[];['ryan','claire'].forEach(k=>{const L=P.lv[k];L.exp+=n;while(L.exp>=needExp(L.lv)){L.exp-=needExp(L.lv);L.lv++;ups.push(`${UNAME[k]} Lv ${L.lv}`);}});
  const before={ryan:P.ryan.max,claire:P.claire.max};syncMax();['ryan','claire'].forEach(k=>{P[k].hp=Math.min(P[k].max,P[k].hp+(P[k].max-before[k]));});return ups;}
function useItem(id,u){
  if(!P.items[id])return false;P.items[id]--;
  if(id==='bandage'){u.hp=Math.min(u.max,u.hp+80);}
  if(id==='coffee'){u.ap+=2;}
  if(id==='capsule'){const pool=['Fe','Si','H2O','C','Acid','Al'];for(let k=0;k<3;k++){const e=pool[(Math.random()*pool.length)|0];B.pool[e]=(B.pool[e]||0)+1;}}
  return true;}
function renderGear(Bd){
  const card=k=>{const L=P.lv[k],st=unitStats(k),g=P.gear[k],mine=P.owned.filter(id=>GEAR[id].who===k);
    return `<section class="panel frame gearcol"><h3>${UNAME[k]}　<span class="px">Lv ${L.lv}</span></h3>
     <div class="note">EXP ${L.exp} / ${needExp(L.lv)}</div><div class="load"><i style="width:${L.exp/needExp(L.lv)*100}%"></i></div>
     <dl class="stat" style="margin:10px 0"><dt>HP</dt><dd>${P[k].hp} / ${st.max}</dd>${k==='ryan'?`<dt>陣法傷害</dt><dd>×${st.rec.toFixed(2)}</dd><dt>音叉敲擊</dt><dd>${st.tap}</dd>`:`<dt>攻擊</dt><dd>${st.atk}</dd><dt>護甲</dt><dd>${st.arm}</dd><dt>移動</dt><dd>${st.mv} 格</dd>`}</dl>
     <h4 class="gh">飾品欄</h4><div class="slot">${g?`<span class="id">裝備中</span><b>${GEAR[g].name}</b><span class="note">${GEAR[g].desc}</span>`:'<span class="note">空槽</span>'}</div>
     <div class="glist">${mine.length?mine.map(id=>`<button class="rcard${g===id?' eq':''}" data-g="${id}" data-k="${k}"><div class="nm">${GEAR[id].name}</div><div class="ds">${GEAR[id].desc}</div><div class="id">${g===id?'點擊卸下':'點擊裝備'}</div></button>`).join(''):'<p class="note">還沒有這名角色的飾品。打倒敵人或打開補給箱有機會取得。</p>'}</div></section>`;};
  const items=Object.entries(ITEMS).map(([id,it])=>`<div class="irow"><div><b>${it.name}</b> <span class="px">×${P.items[id]||0}</span><div class="note">${it.desc}・戰鬥中 ${it.ap} AP</div></div>
    ${id==='bandage'?`<div class="row">${['ryan','claire'].map(k=>`<button class="btn" data-use="${k}" ${(P.items.bandage||0)&&P[k].hp<P[k].max?'':'disabled'}>給${UNAME[k]}用</button>`).join('')}</div>`:''}</div>`).join('');
  Bd.innerHTML=`<div class="gear-grid">${card('ryan')}${card('claire')}<section class="panel frame"><h3>道具袋</h3>${items}<p class="note">升級時 HP 上限提高；萊恩的陣法傷害每級 +6%，克蕾雅的攻擊每級 +3。</p></section></div>`;
  Bd.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,id=b.dataset.g;P.gear[k]=P.gear[k]===id?null:id;syncMax();renderBase();});
  Bd.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{const k=b.dataset.use;if(!P.items.bandage)return;P.items.bandage--;P[k].hp=Math.min(P[k].max,P[k].hp+80);renderBase();});
}
/* battle result card */
function showResult(title,rows,onGo){
  $('ov').innerHTML=`<div class="overlay"><div class="card frame result"><span class="t-eyebrow">BATTLE RESULT</span><h3>${title}</h3>${rows.map(([h,t])=>`<div class="rrow"><span>${h}</span><b>${t}</b></div>`).join('')}
    <div class="row"><button class="btn primary" id="rs-go">繼續</button></div></div></div>`;
  $('rs-go').onclick=()=>{$('ov').innerHTML='';onGo();};$('rs-go').focus();
}
/* camera rotation in battle */
function rotCam(dir){let left=Math.PI/2;const Y=new THREE.Vector3(0,1,0);
  E.fxs.push(dt=>{const a=Math.min(left,dt*5);left-=a;const off=E.camera.position.clone().sub(E.controls.target);off.applyAxisAngle(Y,a*dir);
    E.camera.position.copy(E.controls.target).add(off);E.camera.lookAt(E.controls.target);return left>1e-4;});}
function scrX(dx,dz){const y=Math.atan2(E.camera.position.x-E.controls.target.x,E.camera.position.z-E.controls.target.z);return dx*Math.cos(y)-dz*Math.sin(y);}
