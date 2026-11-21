/* ======================= MONEY (馬克) · SHOPS ======================= */
const MK='馬克';
P.money=P.money||0;
{const o=resetParty;resetParty=function(){o();P.money=100;};}
const GOLD_OF={miner:8,hound:14,sweeper:18,guard:26,mech:240,wolf:22,frostguard:34,turret:30,crystal:16,colossus:320};
/* new consumable for the north */
ITEMS.hotpack={name:'化學暖暖包',ap:0,desc:'選中的隊員寒氣歸零（克蕾雅凍僵時立刻解凍）'};
{const o=useItem;useItem=function(id,u){if(id!=='hotpack')return o(id,u);if(!P.items.hotpack)return false;P.items.hotpack--;
  if(B&&u){u.cold=0;u.warm=1;if(u.spr)floatAt(u.spr.holder.position.clone(),'回暖','#ffb070');}return true;};}
/* price list: buy price; selling returns half */
const PRICE={bandage:40,coffee:70,capsule:60,hotpack:45,
  amulet:160,caliper:280,fork:260,bracer:160,piston:240,coating:240,furmantle:300,icepick:340,heatsink:520};
const EL_PRICE={Fe:14,Si:12,C:14,H2O:10,Al:24,Acid:26};
const SHOPS={
 ohm:{name:'奧姆鎮雜貨店',who:'folkB',greet:'錢？早就買不到糧了……不過你們是軍人，軍票我還是收的。拿元素來換也行。',items:['bandage','coffee','capsule'],els:['Fe','Si','C','H2O'],barter:{bandage:['Fe',2],coffee:['C',2],capsule:['Si',2]}},
 ohmMech:{name:'機械工坊',who:'folkA',greet:'清道機和巡邏犬的零件拆下來還能用。要的話算你便宜。',items:[],gear:['piston','coating','caliper','bracer'],els:['Fe','Al']},
 frost:{name:'霜港鎮雜貨鋪',who:'keeper',greet:'北境的東西貴，可每一樣都救得了命。暖暖包記得多帶幾個。',items:['bandage','coffee','capsule','hotpack'],els:['Fe','Si','C','H2O']},
 lia:{name:'莉亞的雪橇站',who:'lia',greet:'跑信順便收的好東西！雪狼披肩超暖，破冰鎬是我爸以前用的。',items:['hotpack'],gear:['furmantle','icepick','amulet']},
 quarter:{name:'要塞軍需處',who:'erik',greet:'……上校說，中央的人要什麼就給。照價付款就行。',items:['bandage','coffee','hotpack','capsule'],gear:['heatsink'],els:['Al','Acid','Fe','C']},
};
const fmtMk=n=>`${n} ${MK}`;
function moneyHud(){const b=$('ex-bag');if(b)b.innerHTML=`背包・整備 <span class="mk">${P.money||0} ${MK}</span>`;}
{const o=updateExHud;updateExHud=function(){o.apply(this,arguments);moneyHud();};}
let shopTab='buy';
function openShop(id){const S0=SHOPS[id];X.keys={};X.target=null;shopTab='buy';
  const draw=()=>{const rows=[];const own=k=>GEAR[k]?(P.owned.includes(k)?'已持有':''):`持有 ${P.items[k]||0}`;
    if(shopTab==='buy'){
      (S0.items||[]).forEach(k=>{const it=ITEMS[k],bt=S0.barter&&S0.barter[k];rows.push(`<div class="sh-row"><div class="sh-i"><b>${it.name}</b><span class="px">${own(k)}</span><div class="note">${it.desc}・戰鬥中 ${it.ap} AP</div></div>
        <div class="sh-b"><button class="btn" data-buy="${k}" ${P.money>=PRICE[k]?'':'disabled'}>${fmtMk(PRICE[k])}</button>${bt?`<button class="btn" data-bart="${k}" ${(P.stash[bt[0]]||0)>=bt[1]?'':'disabled'}>${ELF[bt[0]]}×${bt[1]}</button>`:''}</div></div>`);});
      (S0.gear||[]).forEach(k=>{const g=GEAR[k],has=P.owned.includes(k);rows.push(`<div class="sh-row"><div class="sh-i"><b>${g.name}</b><span class="px">${UNAME[g.who]}・${has?'已持有':'飾品'}</span><div class="note">${g.desc}</div></div>
        <div class="sh-b"><button class="btn" data-buy="${k}" ${!has&&P.money>=PRICE[k]?'':'disabled'}>${has?'已持有':fmtMk(PRICE[k])}</button></div></div>`);});
      (S0.els||[]).forEach(k=>{const n=P.stash[k]||0;rows.push(`<div class="sh-row"><div class="sh-i"><b>元素 ${ELF[k]}</b><span class="px">攜帶 ${n}/6</span><div class="note">放進暫存庫，下一場戰鬥開場就能用。</div></div>
        <div class="sh-b"><button class="btn" data-el="${k}" ${n<6&&P.money>=EL_PRICE[k]?'':'disabled'}>${fmtMk(EL_PRICE[k])}</button></div></div>`);});
    }else{
      Object.entries(P.items).filter(([k,n])=>n>0&&ITEMS[k]).forEach(([k,n])=>rows.push(`<div class="sh-row"><div class="sh-i"><b>${ITEMS[k].name}</b><span class="px">持有 ${n}</span></div>
        <div class="sh-b"><button class="btn" data-sell="${k}">賣出 ${fmtMk(Math.floor(PRICE[k]/2))}</button></div></div>`));
      P.owned.filter(k=>GEAR[k]&&P.gear.ryan!==k&&P.gear.claire!==k).forEach(k=>rows.push(`<div class="sh-row"><div class="sh-i"><b>${GEAR[k].name}</b><span class="px">${UNAME[GEAR[k].who]}・未裝備</span></div>
        <div class="sh-b"><button class="btn" data-sellg="${k}">賣出 ${fmtMk(Math.floor((PRICE[k]||100)/2))}</button></div></div>`));
      if(!rows.length)rows.push('<p class="note">沒有可以賣的東西。裝備中的飾品不能賣。</p>');
    }
    $('ov').innerHTML=`<div class="overlay"><div class="card frame shop"><div class="sh-h"><div><span class="t-eyebrow">SHOP</span><h3>${S0.name}</h3></div><div class="sh-m">${fmtMk(P.money||0)}</div></div>
      <p class="sh-g">「${S0.greet}」</p><div class="sh-tabs"><button class="btn ${shopTab==='buy'?'primary':''}" data-tab="buy">購買</button><button class="btn ${shopTab==='sell'?'primary':''}" data-tab="sell">出售</button></div>
      <div class="sh-list">${rows.join('')}</div><div class="row"><button class="btn" id="sh-x">離開</button></div></div></div>`;
    const ov=$('ov');
    ov.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{shopTab=b.dataset.tab;draw();});
    ov.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy;if(P.money<PRICE[k])return;P.money-=PRICE[k];const n=addLoot(k);sfx('ui');toast(`買下 ${n}。`);draw();});
    ov.querySelectorAll('[data-bart]').forEach(b=>b.onclick=()=>{const k=b.dataset.bart,[e,n]=S0.barter[k];if((P.stash[e]||0)<n)return;P.stash[e]-=n;addLoot(k);toast(`用 ${ELF[e]}×${n} 換到 ${ITEMS[k].name}。`);draw();});
    ov.querySelectorAll('[data-el]').forEach(b=>b.onclick=()=>{const k=b.dataset.el;if(P.money<EL_PRICE[k]||(P.stash[k]||0)>=6)return;P.money-=EL_PRICE[k];P.stash[k]=(P.stash[k]||0)+1;draw();});
    ov.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const k=b.dataset.sell;if(!P.items[k])return;P.items[k]--;P.money+=Math.floor(PRICE[k]/2);draw();});
    ov.querySelectorAll('[data-sellg]').forEach(b=>b.onclick=()=>{const k=b.dataset.sellg;const i=P.owned.indexOf(k);if(i<0)return;P.owned.splice(i,1);P.money+=Math.floor((PRICE[k]||100)/2);toast(`賣掉了 ${GEAR[k].name}。`);draw();});
    $('sh-x').onclick=()=>{$('ov').innerHTML='';saveRun('map');backToMap();};};
  draw();}
{const st=document.createElement('style');st.textContent=`
.mk{margin-left:8px;color:var(--gild);font-family:var(--pixel);font-size:12px}
.overlay .card.shop{max-width:560px;max-height:calc(100vh - 40px);gap:10px}
.sh-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}.sh-h h3{margin:2px 0 0}
.sh-m{font-family:var(--pixel);color:var(--gild);font-size:16px;white-space:nowrap}
.sh-g{margin:0;color:var(--mist);font-size:13px}
.sh-tabs{display:flex;gap:6px}.sh-tabs .btn{padding:5px 14px;font-size:13px}
.sh-list{overflow:auto;display:flex;flex-direction:column;gap:6px;min-height:0;flex:1 1 auto;max-height:52vh;padding-right:4px}
.sh-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 9px;border:1px solid rgba(200,164,86,.22);background:rgba(20,24,36,.5)}
.sh-i{min-width:0}.sh-i .px{margin-left:8px;font-size:11px;color:var(--mist)}.sh-i .note{margin:2px 0 0;font-size:12px}
.sh-b{display:flex;gap:6px;flex-shrink:0}.sh-b .btn{padding:5px 10px;font-size:12px;font-family:var(--pixel)}
@media (max-width:520px){.sh-row{flex-direction:column;align-items:stretch}.sh-b{justify-content:flex-end}}`;document.body.appendChild(st);}
/* ---- earning ---- */
{const o=showResult;showResult=function(title,rows,onGo){
  if(B&&B.enemies&&!B._paid){B._paid=1;
    const g=B.enemies.reduce((a,e)=>a+Math.round((GOLD_OF[e.type]||10)*(.85+Math.random()*.3)),0);P.money=(P.money||0)+g;
    const i=rows.findIndex(r=>r[0]==='戰利品');rows.splice(i<0?rows.length:i,0,['軍費',`+${g} ${MK}（持有 ${P.money}）`]);}
  return o(title,rows,onGo);};}
{const o=runEvent;runEvent=function(ev){const fresh=ev.kind==='chest'&&!ev.done;const r=o(ev);
  if(fresh){const g=ev.money||(20+((Math.random()*4)|0)*10);P.money=(P.money||0)+g;setTimeout(()=>toast(`箱底還有 ${g} ${MK}。`),900);moneyHud();}return r;};}
/* ---- persistence ---- */
{const o=saveRun;saveRun=function(stage){o(stage);try{const d=JSON.parse(localStorage.getItem(RUN_KEY)||'null');if(d&&d.P){d.P.money=P.money||0;localStorage.setItem(RUN_KEY,JSON.stringify(d));}}catch(e){}};}
{const o=chapterEnd;chapterEnd=function(){o();try{const s=JSON.parse(localStorage.getItem(CH2_KEY)||'null');if(s){s.money=P.money||0;localStorage.setItem(CH2_KEY,JSON.stringify(s));}}catch(e){}};}
{const o=startCh2;startCh2=function(){let had=null;try{const s=JSON.parse(localStorage.getItem(CH2_KEY)||'null');had=s&&typeof s.money==='number'?s.money:null;}catch(e){}
  o();P.money=had!=null?had:260;moneyHud();};}
/* ---- shop NPCs ---- */
{const ev=MAPS.town&&MAPS.town.events.find(e=>e.id==='shop');if(ev){delete ev.talk;ev.fn=()=>openShop('ohm');ev.label='雜貨店老闆娘（商店）';}}
{const ev=MAPS.town&&MAPS.town.events.find(e=>e.id==='mech');if(ev){const after=ev.after,talk=ev.talk;delete ev.talk;delete ev.after;ev.label='機械工坊的技師（商店）';
  ev.fn=()=>{if(!P.flags.mechGift){talkScene(talk,()=>{after&&after();});}else openShop('ohmMech');};}}
MAPS.frostport.events.push({id:'store',kind:'npc',who:'keeper',at:[12.4,20],label:'雜貨鋪老闆（商店）',fn:()=>openShop('frost')});
{const ev=MAPS.frostport.events.find(e=>e.id==='lia');if(ev){const after=ev.after;ev.once=false;delete ev.talk;ev.label='雪橇站的女孩';
  ev.fn=()=>{if(!P.flags.lia){talkScene('fpLia',()=>{after&&after();});}else openShop('lia');};}}
MAPS.fortress.events.push({id:'quarter',kind:'npc',who:'soldier',at:[36.4,24.4],label:'軍需官（商店）',cond:()=>true,fn:()=>openShop('quarter')});
