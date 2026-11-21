/* ======================= SIDE QUESTS, JOURNAL & EASTER EGGS ======================= */
Object.assign(GEAR,{
 coating2:{name:'強化防酸塗層',who:'claire',hp:50,atk:4,desc:'HP +50、攻擊 +4。走私客私藏的軍規釉料，連強酸都咬不動。'},
 bell:{name:'煤灰的鈴鐺',who:'claire',hp:25,atk:6,desc:'HP +25、攻擊 +6。黑貓留下的小銅鈴。搖起來的時候，好像有人在說「走吧」。'},
 medal:{name:'白銀連隊徽章',who:'ryan',hp:20,atk:10,desc:'HP +20、攻擊 +10。要塞連隊的舊徽章，背面刻著每一任連長的名字。'},
});
Object.assign(PRICE,{coating2:300,bell:400,medal:380});
const Q=id=>P.flags['q_'+id]||0;
const QUESTS=[
 {id:'cards',ch:1,map:'train',title:'押車兵的牌局',where:'裝甲列車',act:'答對玩牌士兵出的三道鍊金題。',done:'贏得了他的元素膠囊。'},
 {id:'miner',ch:1,map:'town',title:'咳嗽的老礦工',where:'奧姆鎮・礦坑區',act:'把「蒸氣繃帶」或「濃縮黑咖啡」交給配給隊伍末端的老礦工。',done:'老礦工想起了一個戴圓眼鏡的教授。'},
 {id:'watch',ch:1,map:'town',title:'瑪塔的懷錶',where:'奧姆鎮 → 機庫後方貨運場',act:'瑪塔的丈夫去機庫「體檢」那天，懷錶不見了。也許掉在機庫附近。',done:'找到刻著「給瑪塔」的懷錶。等一切結束，親手還給她。'},
 {id:'nest',ch:1,map:'sewer',title:'走私客的藏貨',where:'地下強酸水道・南側',act:'紙條說貨藏在水道西南角，有巡邏犬守著。',done:'打倒巡邏犬，取得強化防酸塗層。'},
 {id:'coal',ch:2,map:'frostport',title:'等價交換的柴火',where:'霜港鎮',act:'把 C×3 交給掃雪的婦人，讓她的暖爐撐到配給日。',done:'婦人用暖暖包回禮。'},
 {id:'dog',ch:2,map:'glacier',title:'獵人的北斗',where:'冰河裂谷・西南松林',act:'沿著雪地上的腳印，到狼窩找回獵人的狗。',done:'北斗回到了小屋。'},
 {id:'letter',ch:2,map:'fortress',title:'寄不出的家書',where:'白銀之顎要塞',act:'把艾瑞克的信交給東側倉庫的軍需官。',done:'信塞進了下一班雪橇的郵袋。軍需處多了新貨。'},
 {id:'tags',ch:2,map:'vault',title:'冰晶上的名牌',where:'冰封記憶庫・儲藏區',act:'讀完貨架上那些發光的名牌。',done:'最後一格是空的。名牌上寫著「霍華德」。'},
];
const CAT_MAPS=['train','town','sewer','yard','frostport','glacier','fortress','vault'];
const catN=()=>CAT_MAPS.filter(m=>P.flags['cat_'+m]).length;
const EGGS=[['egg_cat','煤灰的鈴鐺','八個地方都摸過了那隻黑貓。'],['egg_tank','第十三號','水塔上的舊編號。'],['egg_statue','雕像背面','創鎮者刻下的另一半誓言。'],
 ['egg_snowman','倒下的雪人','對不起，萊恩。'],['egg_chest','冰瀑後的暗格','只有好奇的人找得到。'],['egg_mail','寄給克蕾雅的信','寄件人只寫了「H」。']];
const qInfo=id=>QUESTS.find(q=>q.id===id);
function qStart(id){if(Q(id))return;P.flags['q_'+id]=1;sfx('ui');setTimeout(()=>toast(`新委託：${qInfo(id).title}　（可在「委託手帳」查看）`),400);qBadge(1);}
function qDone(id){P.flags['q_'+id]=2;sfx('ui');setTimeout(()=>toast(`委託完成：${qInfo(id).title}`),500);try{saveRun('map');}catch(e){}}
function egg(k){if(P.flags[k])return;P.flags[k]=1;setTimeout(()=>toast(`見聞錄更新（${EGGS.filter(e=>P.flags[e[0]]).length}/${EGGS.length}）`),900);}
const has=(k,n)=>(P.stash[k]||0)>=n;
/* scene helper: after() returning false keeps the map from resuming (e.g. a battle started) */
function say(list,after){playScene(list,()=>{if(after&&after()===false)return;backToMap();},{keep:true,actors:exActors()});}
function giveMoney(n){P.money=(P.money||0)+n;moneyHud();}

/* ---------- scenes used by auto/battle events ---------- */
Object.assign(SCENES,{
 qNestPre:[{n:'儲藏區的角落堆著幾個上了蠟的木箱。三隻巡邏犬繞著箱子打轉，聽見腳步聲，同時亮起了紅色的眼燈。'},
  {who:'claire',e:'Angry_Steam',t:'看門狗啊。……正好，我的鐵拳也想活動一下。'}],
 qDenPre:[{n:'松林深處，雪地被踩得一片狼藉。一隻灰白色的獵犬縮在倒木底下，四周圍著一圈低吼的雪狼。'},
  {who:'ryan',e:'Default_Cold',t:'是北斗。狼群把牠困在這裡了。'},{who:'claire',e:'Angry_Steam',t:'那就讓開，毛球們！'}],
});

/* ---------- optional battles ---------- */
function nestBattle(){return{theme:'sewer',N:7,enemies:[['hound',1,0],['hound',3,0],['hound',5,0],['sweeper',3,1]],
  res:[['acid',0,4],['water',6,4],['scrap',2,5],['si',4,6],['scrap',5,6]],title:'走私客的藏貨',explore:false,side:true,
  guide:'巡邏犬會踩碎錨點，酸蝕清道機在後排遠程攻擊。先用廢鐵箱擋住通道，再一隻一隻收拾。',
  onWin:()=>{resumeMap();setTimeout(()=>say([
   {n:'木箱裡塞著幾罐封蠟的釉料，標籤上蓋著軍方的鋼印。最底下壓著一封寫給「娘」的信。'},
   {who:'claire',e:'Default_Grin',t:'軍規防酸釉！這個塗在機械鎧上，連水道的酸霧都不怕。'},
   {who:'ryan',e:'Cynical_Smirk',t:'信我會讓人寄出去。至於釉料……就當是走私客付的保鏢費。'}],()=>{
   const n=addLoot('coating2');giveMoney(80);qDone('nest');toast(`取得 ${n}、80 ${MK}。`);}),300);}};}
function denBattle(){return{theme:'snow',N:7,cold:true,explore:false,colTex:'snow',enemies:[['wolf',1,0],['wolf',3,0],['wolf',5,0],['wolf',6,1]],hgt:[[0,4,1],[1,4,1],[6,5,1],[3,2,1]],
  res:[['si',0,5],['oil',6,6],['scrap',2,4],['vent',4,6],['si',5,3]],title:'松林狼窩',side:true,
  guide:'四隻雪狼會包抄過來。站上岩台打高打低（傷害 +25%），冷到受不了就靠近蒸氣閥。',
  onWin:()=>{P.flags.dogSaved=1;resumeMap();setTimeout(()=>say([
   {n:'狼群散去。倒木底下的獵犬一瘸一拐地爬出來，在克蕾雅的機械鎧上聞了聞，然後用力搖起尾巴。'},
   {who:'claire',e:'Default_Grin',t:'好乖好乖——你就是北斗吧？走，回家了。'},
   {n:'北斗跑在前面，一路回頭確認兩人有沒有跟上。'}]),300);}};}

/* ---------- critter sprites (procedural; painted art drops in via CRITTER_ART) ---------- */
const CRITTER_ART={cat:true,dog:true};
function critterCanvas(kind){const c=cvs(96,80),g=c.getContext('2d');
  const el=(x,y,rx,ry,col)=>{g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();};
  const tri=(p,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[2],p[3]);g.lineTo(p[4],p[5]);g.fill();};
  if(kind==='cat'){g.strokeStyle='#14141a';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(62,70);g.quadraticCurveTo(86,66,80,40);g.stroke();
    el(48,58,20,18,'#1a1a22');el(48,32,15,13,'#1e1e26');tri([35,26,38,10,46,22],'#1a1a22');tri([50,22,58,10,61,26],'#1a1a22');
    tri([38,24,40,15,44,22],'#5a3a44');tri([52,22,57,15,58,24],'#5a3a44');el(42,32,3,3.4,'#e8c040');el(54,32,3,3.4,'#e8c040');el(42,32,1,2.6,'#101010');el(54,32,1,2.6,'#101010');
    el(48,37,1.6,1.2,'#c87888');el(48,46,4,3,'#c8a456');el(48,46,1.4,1,'#5a4220');el(40,74,6,4,'#1a1a22');el(56,74,6,4,'#1a1a22');el(36,50,3,6,'#2a2a34');}
  else{el(46,58,22,16,'#b8c0c8');el(46,62,12,12,'#eef0f2');el(48,32,15,13,'#a8b0ba');el(50,38,9,7,'#eef0f2');tri([35,26,38,8,46,20],'#8a929c');tri([52,20,60,8,62,26],'#8a929c');
    el(43,30,2.6,2.6,'#3a6a9a');el(55,30,2.6,2.6,'#3a6a9a');el(50,40,3,2.2,'#1a1a1a');g.strokeStyle='#8a929c';g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(66,62);g.quadraticCurveTo(86,56,82,38);g.stroke();
    el(38,74,6,4,'#d8dce0');el(56,74,6,4,'#d8dce0');g.fillStyle='#8a3a2a';g.fillRect(38,44,22,4);}
  return c;}
function critter(kind,x,z,h){const t=new THREE.CanvasTexture(critterCanvas(kind));const mat=new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.4,emissive:0x3a3a46,side:THREE.DoubleSide});
  const g=new THREE.Group(),w=h*1.2,p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);p.position.y=h/2;g.add(p);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(w*.38,14),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.3,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.y=.45;sh.position.y=.03;g.add(sh);
  if(CRITTER_ART[kind])new THREE.TextureLoader().load('env/cr_'+kind+'.webp',tt=>{mat.map=tt;mat.emissive.set(0x26262e);mat.needsUpdate=true;const ar=tt.image.width/tt.image.height;p.scale.set(ar/1.2*1.25,1.25,1);p.position.y=h*.625;});
  g.position.set(x,0,z);E.world.add(g);E.fxs.push((dt,tm)=>{if(!g.parent)return false;const c=E.camera.position;p.rotation.y=Math.atan2(c.x-x,c.z-z);p.position.y=h*p.scale.y/2+Math.abs(Math.sin(tm*1.6))*.015;});return g;}
function pawTrail(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),n=Math.floor(L/.7),ang=Math.atan2(x1-x0,z1-z0),m=new THREE.MeshBasicMaterial({color:0x4a5464,transparent:true,opacity:.55,depthWrite:false});
  for(let k=1;k<n;k++){const t=k/n,s=(k%2?.12:-.12),px=x0+(x1-x0)*t+Math.cos(ang)*s,pz=z0+(z1-z0)*t-Math.sin(ang)*s;
    const d=new THREE.Mesh(new THREE.CircleGeometry(.09,8),m);d.rotation.x=-Math.PI/2;d.scale.y=1.3;d.position.set(px,.02,pz);E.world.add(d);}}

/* ---------- quest marks (！ = new, ？ = ready to report) ---------- */
const QM_TEX={};function qmTex(ch){if(QM_TEX[ch])return QM_TEX[ch];const c=cvs(64,64),g=c.getContext('2d');g.font='bold 52px "Noto Serif TC",serif';g.textAlign='center';g.textBaseline='middle';
  g.lineWidth=8;g.strokeStyle='#1a1208';g.strokeText(ch,32,34);g.fillStyle=ch==='！'?'#ffd27a':'#9ae0ff';g.fillText(ch,32,34);return QM_TEX[ch]=new THREE.CanvasTexture(c);}
function addQuestMarks(){X.events.forEach(ev=>{if(!ev.qm||ev.hidden)return;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:qmTex('！'),depthTest:false,transparent:true}));
  s.scale.set(.55,.55,1);const y=ev.kind==='npc'?2.55:1.9;s.position.set(ev.at[0],y,ev.at[1]);s.renderOrder=5;E.world.add(s);
  E.fxs.push((dt,t)=>{if(!s.parent)return false;const m=ev.qm();s.visible=!!m;if(m){s.material.map=qmTex(m);s.position.y=y+Math.sin(t*3)*.06;if(ev.mk)ev.mk.visible=false;}});});}

/* ---------- journal ---------- */
function qBadge(on){const b=$('ex-quest');if(b)b.classList.toggle('new',!!on);}
function openJournal(){X.keys={};X.target=null;qBadge(0);const ch=CHAPTER||1;
  const row=q=>{const s=Q(q.id);return`<div class="qj-row ${s===2?'done':s?'act':'unk'}"><div class="qj-st">${s===2?'完成':s?'進行中':'未接'}</div><div class="qj-b"><b>${s?q.title:'？？？'}</b><span class="px">第${q.ch===1?'一':'二'}章・${q.where}</span>${s?`<p>${s===2?q.done:q.act}${q.id==='tags'&&s===1?`（${['tagA','tagB'].filter(k=>P.flags[k]).length}/2）`:''}</p>`:''}</div></div>`;};
  const qs=QUESTS.filter(q=>q.ch<=ch);
  const eg=EGGS.map(([k,t,d])=>P.flags[k]?`<li><b>${t}</b><span>${d}</span></li>`:'<li class="unk"><b>？？？</b></li>').join('');
  $('ov').innerHTML=`<div class="overlay"><div class="card frame shop qj"><div class="sh-h"><div><span class="t-eyebrow">JOURNAL</span><h3>委託手帳</h3></div><div class="sh-m">${qs.filter(q=>Q(q.id)===2).length}/${qs.length}</div></div>
   <div class="sh-list">${qs.map(row).join('')}<h4 class="gh">見聞錄 ${EGGS.filter(e=>P.flags[e[0]]).length}/${EGGS.length}</h4><ul class="qj-eggs">${eg}</ul>
   <p class="note">煤灰：${catN()}/8　——　牠好像會出現在每一張地圖的角落。</p></div><div class="row"><button class="btn" id="qj-x">關閉</button></div></div></div>`;
  $('qj-x').onclick=()=>{$('ov').innerHTML='';backToMap();};}
{const bag=$('ex-bag');if(bag&&!$('ex-quest')){const b=document.createElement('button');b.className='frame';b.id='ex-quest';b.type='button';b.textContent='委託手帳';bag.parentNode.insertBefore(b,bag);b.onclick=openJournal;}}
{const st=document.createElement('style');st.textContent=`
#ex-quest{padding:8px 12px;color:var(--parch);font-size:13px;font-family:var(--display);position:relative}
#ex-quest.new::after{content:'';position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:var(--gild);box-shadow:0 0 6px var(--gild)}
.qj-row{display:grid;grid-template-columns:56px minmax(0,1fr);gap:10px;padding:8px 0;border-bottom:1px solid #222c48;align-items:start}
.qj-st{font-family:var(--pixel);font-size:11px;padding:3px 0;text-align:center;border:1px solid #3a4468;color:var(--mist)}
.qj-row.act .qj-st{color:var(--gild);border-color:var(--gild)}.qj-row.done .qj-st{color:#7ad8a8;border-color:#3a7a5a}
.qj-row.done b{color:var(--mist)}.qj-row.unk b{color:#4a5478}
.qj-b b{display:block;font-family:var(--display);font-size:15px}.qj-b .px{font-size:11px;color:var(--mist)}.qj-b p{margin:4px 0 0;font-size:13px;line-height:1.55}
.qj-eggs{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px}
.qj-eggs li{border:1px solid #2a3458;padding:6px 8px;font-size:12px}.qj-eggs li b{display:block;font-size:13px;color:var(--gild)}.qj-eggs li span{color:var(--mist)}.qj-eggs li.unk b{color:#4a5478}
`;document.body.appendChild(st);}

/* ---------- event helpers ---------- */
const evOf=(m,id)=>MAPS[m]&&MAPS[m].events.find(e=>e.id===id);
function addEv(m,ev){if(MAPS[m]&&!evOf(m,ev.id))MAPS[m].events.push(ev);}
function catEv(m,at){addEv(m,{id:'cat',kind:'cat',at,label:'角落裡的黑貓',secret:1,fn:()=>petCat(m)});}
function petCat(m){const first=!catN(),fresh=!P.flags['cat_'+m];P.flags['cat_'+m]=1;const n=catN();
  if(fresh&&n===8){say([{n:'煤灰繞著克蕾雅的腳轉了三圈，然後叼下脖子上的小銅鈴，放在她的靴子上。'},
     {who:'claire',e:'Blush_LookAway',t:'……要送我？你這傢伙，從列車一路跟到北境，就是為了這個？'},
     {who:'ryan',e:'Cynical_Smirk',t:'也許牠只是覺得妳比較需要一個護身符。'},{n:'鈴聲輕輕響了一下。再抬頭時，黑貓已經不見了。'}],()=>{const k=addLoot('bell');egg('egg_cat');toast(`取得 ${k}。`);});return;}
  if(first){say([{n:'一隻黑貓蹲在角落，脖子上掛著一顆小銅鈴。'},{who:'claire',e:'Default_Grin',t:'哎呀，你從哪裡冒出來的？'},
     {n:'黑貓蹭了蹭克蕾雅的機械鎧，打了個噴嚏——整張臉都是煤灰。'},{who:'claire',e:'Default_Grin',t:'……那就叫你「煤灰」吧。'}],()=>toast(`煤灰 ${n}/8`));return;}
  if(fresh&&m==='frostport'){say([{n:'雪地上蹲著一團黑。是煤灰。'},{who:'ryan',e:'Fork_Gaze',t:'……牠是怎麼跟到北境來的？'},{who:'claire',e:'Default_Grin',t:'大概跟你一樣，是搭霸王車來的吧。'}],()=>toast(`煤灰 ${n}/8`));return;}
  const L=['煤灰蹭了蹭克蕾雅的腳。','煤灰打了個大呵欠。','煤灰盯著萊恩看，萊恩假裝沒看到。','煤灰的鈴鐺叮了一聲。','煤灰翻過肚子，要人摸。'];
  toast(`${L[(Math.random()*L.length)|0]}（煤灰 ${n}/8）`);backToMap();}

/* ======== CHAPTER 1 ======== */
// train: card puzzle
{const ev=evOf('train','cards');if(ev){delete ev.talk;ev.qm=()=>Q('cards')<2?(Q('cards')?'？':'！'):null;
  const quiz=(i)=>{const QZ=[['一個水分子（H₂O）拆開，總共有幾個原子？',['兩個','三個','四個'],1],['鐵鏽（Fe₂O₃）裡，鐵原子和氧原子哪一種比較多？',['鐵','氧','一樣多'],1],['鋁熱劑燒起來，需要哪兩樣東西？',['鐵粉和水','碳和食鹽','鋁粉和氧化鐵'],2]];
    if(i>=QZ.length){say([{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:'……全對？我在學院門口站了兩年崗，從沒贏過任何一個鍊金術師。'},{who:'claire',e:'Default_Grin',t:'承讓啦。膠囊拿來。'},
      {who:'ryan',e:'Cynical_Smirk',t:'你輸給的不是她，是基礎化學課本。'}],()=>{const n=addLoot('capsule');qDone('cards');toast(`取得 ${n}。`);});return;}
    const [q,opts,ok]=QZ[i];playScene([{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:`第 ${i+1} 題：${q}`},{choice:opts.map((t,k)=>({t,fn:()=>{if(k===ok){sfx('ui');quiz(i+1);}else say([{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:'嘿嘿，錯了！准尉也有失手的時候嘛。想再挑戰就再來找我。'},{who:'claire',e:'Angry_Steam',t:'……剛剛那題不算！'}]);}}))}],null,{keep:true,actors:exActors()});};
  ev.fn=()=>{if(Q('cards')===2){say([{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:'不玩了不玩了，再輸下去我連靴子都要押上了。'}]);return;}
    const intro=Q('cards')?[{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:'回來雪恥啦？好，同樣三題，從頭開始。'}]:SCENES.tCards.concat([{who:'guard',nm:'玩牌的士兵',e:'Neutral',t:'……准尉，那賭一把吧？我出三題鍊金題，妳全答對，我這顆元素膠囊就是妳的。'}]);
    playScene(intro.concat([{choice:[{t:'來吧',fn:()=>{qStart('cards');quiz(0);}},{t:'下次吧',fn:()=>{qStart('cards');backToMap();}}]}]),null,{keep:true,actors:exActors()});};}}
catEv('train',[30.5,4.9]);
// town: coughing miner
{const ev=evOf('town','queue');if(ev){delete ev.talk;ev.qm=()=>Q('miner')===0?'！':Q('miner')===1&&((P.items.bandage||0)+(P.items.coffee||0))>0?'？':null;
  const give=()=>{const opts=[];['bandage','coffee'].forEach(k=>{if(P.items[k])opts.push({t:`給他 ${ITEMS[k].name}（持有 ${P.items[k]}）`,fn:()=>{P.items[k]--;P.stash.Fe=(P.stash.Fe||0)+3;
      say([{n:'老礦工接過去，愣了很久。然後他的笑容慢慢垮了下來，換成一種很累、很真的表情。'},{who:'miner',e:'Smile',t:'……謝了，小姑娘。我好像……想起一點事情了。'},
       {who:'miner',e:'Smile',t:'以前礦坑常來一個戴圓眼鏡的教授，口袋裡永遠有薄荷糖。他說礦工的手，比學院那些腦袋值錢多了。'},
       {who:'claire',e:'Memory_Headache',t:'圓眼鏡……薄荷糖……'},{who:'ryan',e:'Fork_Gaze',t:'……走吧。這裡不安全。'}],()=>{qDone('miner');toast('取得 Fe×3。');});}});});
    opts.push({t:'等一下再說',fn:()=>backToMap()});
    if(opts.length===1){say([{who:'claire',e:'Hurt',t:'繃帶和咖啡都用完了……先去雜貨店換一點吧。'}]);return;}
    playScene([{n:'老礦工又咳了起來。'},{choice:opts}],null,{keep:true,actors:exActors()});};
  ev.fn=()=>{const s=Q('miner');if(s===2){say([{who:'miner',e:'Smile',t:'薄荷糖的味道……我想起來了，是綠色包裝的。'}]);return;}
    if(s===0){say(SCENES.tQueue.concat([{n:'隊伍末端，一個老礦工咳得整個人彎下了腰，卻還在笑。'},{who:'claire',e:'Hurt',t:'這樣咳下去會出事的……萊恩，我們身上有藥嗎？'},
      {who:'ryan',e:'Default_Cold',t:'繃帶或咖啡都行。至少能讓他清醒一點。'}]),()=>{qStart('miner');});return;}
    give();};}}
// town: Marta's watch (offered after her first talk)
{const ev=evOf('town','marta');if(ev){const talk=ev.talk,after=ev.after;delete ev.talk;ev.qm=()=>P.flags.marta&&!Q('watch')?'！':null;
  const offer=[{who:'marta',e:'Hurt',t:'還有……他去機庫那天，帶著我送他的懷錶。回來的時候，錶不見了，他也不記得放在哪裡。'},
    {who:'marta',e:'Hurt',t:'那只錶不值錢。只是……錶蓋裡刻著我的名字。'},{who:'claire',e:'Teary_Fierce',t:'我們會找找看。機庫那邊，我們本來就要去。'}];
  ev.fn=()=>{if(!P.flags.marta){say(SCENES[talk].concat(offer),()=>{after&&after();qStart('watch');});return;}
    if(!Q('watch')){say(offer,()=>qStart('watch'));return;}
    say([{who:'marta',e:Q('watch')===2?'Happy':'Hurt',t:Q('watch')===2?'……你們找到了？不，先別給我。等他想起我的那天，我要他親手還我。':'拜託你們了。下水道很危險，千萬小心。'}]);};}}
// town eggs: water tank 13, statue
addEv('town',{id:'tank13',kind:'sign',at:[59.6,26.6],label:'水塔的鐵板',secret:1,fn:()=>{const n=P.flags.tank13n=(P.flags.tank13n||0)+1;
  if(n<3){say([{n:n===1?'鏽蝕的鐵板上，用白漆印著一行褪色的字：「TOWN NO. 13」。':'「TOWN NO. 13」。漆字底下，好像還有更舊的一層字。'}]);return;}
  if(P.flags.egg_tank){say([{n:'「第十三號採掘聚落」。這座鎮最早的名字。'}]);return;}
  say([{n:'克蕾雅用機械鎧的指節刮掉一層鏽。白漆底下，還壓著一行更舊的黑字。'},{who:'ryan',e:'Fork_Gaze',t:'奧姆鎮以前不叫奧姆鎮。開礦那年，它在帝國的地圖上只是「第十三號採掘聚落」。'},
   {who:'claire',e:'Neutral',t:'……你連這個都知道？'},{who:'ryan',e:'Cynical_Smirk',t:'鎮公所的鐘停在一點十三分。我猜，有人到現在都還很念舊。'},{n:'鐵板縫裡卡著一枚舊硬幣。'}],()=>{giveMoney(13);egg('egg_tank');toast(`撿到 13 ${MK}。`);});}});
{const ev=evOf('town','statue');if(ev){const talk=ev.talk;delete ev.talk;ev.secret=0;
  ev.fn=()=>{const n=P.flags.statueN=(P.flags.statueN||0)+1;
    if(n<5){say(n===1?SCENES[talk]:[{n:['雕像的音叉被酸雨蝕出了一個個小洞。','底座的苔蘚底下，好像刻著什麼。','克蕾雅蹲下來，用手撥開一點苔蘚。'][Math.min(n-2,2)]}]);return;}
    say([{n:'雕像底座的背面，被苔蘚蓋住的地方，還刻著一段字——'},{n:'「取之於地者，還之於地；取之於人者，還之於人。凡鍊成，必有其價——唯人心，不在可議價之列。」'},
      {who:'ryan',e:'Fork_Gaze',t:'……「人心不在可議價之列」。機庫那群人，大概從來沒繞到雕像背後看過。'},{who:'claire',e:'Teary_Fierce',t:'那我們就替他們看。'}],()=>{if(!P.flags.egg_statue){P.stash.Si=(P.stash.Si||0)+1;toast('苔蘚裡藏著一小塊矽晶（Si×1）。');}egg('egg_statue');});};}}
catEv('town',[6,27.6]);
// sewer: smuggler's note + hound nest
addEv('sewer',{id:'q2note',kind:'sign',at:[10.5,10.8],label:'牆縫裡的紙條',qm:()=>Q('nest')?null:'！',fn:()=>{
  if(Q('nest')){say([{n:Q('nest')===2?'紙條已經被克蕾雅收起來了。':'「貨在南邊儲藏區的西南角。那幾隻機械狗是憲兵放的。」'}]);return;}
  say([{n:'磚縫裡塞著一張油紙，字跡潦草：'},{n:'「貨藏在南邊儲藏區的西南角。那幾隻機械狗是憲兵放的，誰靠近就咬誰。」'},{n:'「拿到的人，順手把箱底那封信寄給我娘。——不會游泳的老鼠」'},
   {who:'claire',e:'Default_Grin',t:'走私客的藏貨啊……聽起來挺有意思的。'},{who:'ryan',e:'Default_Cold',t:'先說好，這不是正事。要去的話，速戰速決。'}],()=>qStart('nest'));}});
addEv('sewer',{id:'nest',kind:'auto',at:[8,27],r:2.2,cond:()=>Q('nest')===1,battle:nestBattle,pre:'qNestPre'});
catEv('sewer',[42,8]);
// yard: the watch
addEv('yard',{id:'q3watch',kind:'sign',at:[36,32],label:'貨櫃底下閃著的東西',qm:()=>Q('watch')===1?'？':null,hideIf:()=>Q('watch')===2,fn:()=>{
  const known=Q('watch')===1;
  say([{n:'貨櫃底下壓著一只黃銅懷錶。錶蓋內側刻著一行小字：「給瑪塔的那個人　每天準時回家」。'},
   known?{who:'claire',e:'Teary_Fierce',t:'是瑪塔太太說的那只錶……指針停在五點。礦工下工的時間。'}:{who:'claire',e:'Hurt',t:'「瑪塔」……是鎮上那位太太？'},
   {who:'ryan',e:'Default_Cold',t:'收好。等這件事結束，親手還給她——還給他們兩個。'},{n:'錶旁邊散著幾塊從貨櫃上震落的零件。'}],()=>{P.stash.Fe=(P.stash.Fe||0)+2;P.stash.Si=(P.stash.Si||0)+2;
   if(!known)P.flags.q_watch=1;qDone('watch');toast('取得 瑪塔的懷錶（重要物品）、Fe×2、Si×2。');});}});
catEv('yard',[3,4]);

/* ======== CHAPTER 2 ======== */
// frostport: coal for the stove
{const ev=evOf('frostport','folkA');if(ev){const talk=ev.talk;delete ev.talk;delete ev.once;ev.qm=()=>Q('coal')===0?'！':Q('coal')===1&&has('C',3)?'？':null;
  const ask=()=>playScene([{who:'folkw',e:'Hurt',t:'煤……妳們真的有多的嗎？'},{choice:[{t:`交給她 C×3（持有 C×${P.stash.C||0}）`,fn:()=>{if(!has('C',3)){say([{who:'claire',e:'Hurt',t:'……還差一點。打倒敵人或分解木箱應該能湊到。'}]);return;}
      P.stash.C-=3;say([{n:'婦人把碳塊倒進暖爐。火苗竄起來的時候，她的手終於不抖了。'},{who:'folkw',e:'Hurt',t:'謝謝……這個妳們拿去。冰河上用得到。'},
       {who:'folkw',e:'Hurt',t:'要是你們上山……幫我看看他有沒有好好吃飯。他叫馬汀，是要塞的廚子。'},{who:'claire',e:'Default_Grin',t:'等價交換嘛。我們會幫妳看的。'}],()=>{addLoot('hotpack');addLoot('hotpack');qDone('coal');toast('取得 暖暖包×2。');});}},
     {t:'等一下',fn:()=>backToMap()}]}],null,{keep:true,actors:exActors()});
  ev.fn=()=>{const s=Q('coal');if(s===2){say([{who:'folkw',e:'Hurt',t:'暖爐還燒著。……馬汀那個人，一定又在抱怨伙食了吧。'}]);return;}
    if(s===0){say(SCENES[talk].concat([{who:'folkw',e:'Hurt',t:'……家裡的暖爐也快熄了。配給的煤要等到下個月。'},{who:'claire',e:'Neutral',t:'碳的話，我們身上可能有。'},
      {who:'ryan',e:'Default_Cold',t:'C×3 應該夠她撐到配給日。'}]),()=>qStart('coal'));return;}ask();};}}
// frostport eggs: snowman, mailbox
addEv('frostport',{id:'snowman',kind:'sign',at:[30.5,12],label:'戴護目鏡的雪人',secret:1,fn:()=>{const n=P.flags.snowN=(P.flags.snowN||0)+1;
  if(P.flags.egg_snowman){say([{n:'倒下的雪人頭還在地上。克蕾雅假裝沒看到。'}]);return;}
  if(n===1){say([{who:'claire',e:'Default_Grin',t:'萊恩你看！這不就是你嗎？護目鏡、臭臉，一模一樣。'},{who:'ryan',e:'Cynical_Smirk',t:'……哪裡像。'}]);return;}
  if(n<5){toast(['雪人的護目鏡歪了一點。','克蕾雅幫雪人把護目鏡扶正。','雪人的頭好像晃了一下……'][n-2]);backToMap();return;}
  snowmanFall(true);
  say([{n:'雪人的頭滾了下來。'},{who:'claire',e:'Hurt',t:'啊。……萊恩，對不起，是你先倒的。'},{who:'ryan',e:'Default_Cold',t:'……我還站著。'},{n:'雪人的肚子裡埋著一枚舊硬幣，背面刻著「13」。'}],()=>{giveMoney(13);egg('egg_snowman');toast(`撿到 13 ${MK}。`);});}});
function snowmanFall(anim){const mat=PROP_MAT&&PROP_MAT.pr_snowman;if(!mat)return;E.world.traverse(o=>{if(o.isMesh&&o.material===mat&&o.parent){const g=o.parent;
  if(!anim){g.scale.y=.55;return;}let t=0;E.fxs.push(dt=>{t+=dt;g.scale.y=Math.max(.55,1-t*1.5);g.rotation.z=Math.sin(Math.min(t,.4)*8)*.04;return t<.6;});}});}
addEv('frostport',{id:'mailbox',kind:'sign',at:[15.6,15.6],label:'黃銅郵筒',secret:1,fn:()=>{
  if(P.flags.egg_mail){say([{n:'郵筒裡只剩下一疊退件。那封寫著克蕾雅名字的信，正收在她的外套內袋裡。'}]);return;}
  say([{n:'郵筒的投信口卡著一疊沒人領的退件。北境的郵件都要在這裡轉運，寄不到的信，最後就全堆在這裡。'},
   {n:'最上面那封，收件人寫著：「中央學院城　第三研究室　克蕾雅 收」。'},{n:'郵戳是三年前的十一月十日。退件章蓋得歪歪斜斜：「收件地址已不存在」。'},
   {n:'寄件人欄只寫了一個字母——「H」。'},{who:'claire',e:'Memory_Headache',t:'……十一月十日。是學院出事的前一天。'},
   {who:'claire',e:'Hurt',t:'這個字跡……我好像在哪裡看過。萊恩，你知道是誰寄的嗎？'},{who:'ryan',e:'Fork_Gaze',t:'……'},
   {n:'信封封得很緊。克蕾雅盯著它看了很久，最後沒有拆開，只是把它收進了外套的內袋。'},{who:'claire',e:'Neutral',t:'等我自己想起寄信的人是誰，再拆。'}],()=>egg('egg_mail'));}});
catEv('frostport',[39.9,8.5]);
// glacier: the hunter's dog
{const ev=evOf('glacier','hunter');if(ev){const talk=ev.talk;delete ev.talk;delete ev.once;ev.qm=()=>Q('dog')===0?'！':Q('dog')===1&&P.flags.dogSaved?'？':null;
  ev.fn=()=>{const s=Q('dog');
    if(s===0){say(SCENES[talk].concat([{who:'hunter',e:'Hurt',t:'……還有一件事。我的狗「北斗」三天前追著那些發光的雪橇跑出去，到現在還沒回來。'},
      {who:'hunter',e:'Hurt',t:'牠的腳印往西南邊的松林去了。那一帶有狼窩，我這條老腿追不上。'},{who:'claire',e:'Default_Grin',t:'交給我們吧。跟著腳印走就行了吧？'}]),()=>qStart('dog'));return;}
    if(s===1&&!P.flags.dogSaved){say([{who:'hunter',e:'Hurt',t:'腳印往西南邊去了，在松林深處。小心狼群。'}]);return;}
    if(s===1){const g=P.owned.includes('furmantle')?(P.owned.includes('icepick')?null:'icepick'):'furmantle';
      say([{n:'北斗一路衝進小屋，把獵人撲倒在雪地上。'},{who:'hunter',e:'Neutral',t:'你這笨狗……！……謝謝你們。真的。'},
       {who:'hunter',e:'Neutral',t:g==='icepick'?'這把鎬頭是我年輕時鑿冰用的，帶上山去吧。':g?'這件披肩是我老婆縫的，暖得不像話。給那位臭臉的少校穿吧。':'我沒什麼好東西了……這些錢，拿去買點熱的吃。'},
       {who:'ryan',e:'Cynical_Smirk',t:'……為什麼大家都叫我臭臉。'}],()=>{const n=g?addLoot(g):null;giveMoney(120);qDone('dog');toast(`取得 ${n?n+'、':''}120 ${MK}。`);});return;}
    say([{who:'hunter',e:'Neutral',t:'北斗現在一步都不肯離開小屋了。……也好。'}]);};}}
addEv('glacier',{id:'den',kind:'auto',at:[20,31],r:2.4,cond:()=>Q('dog')===1&&!P.flags.dogSaved,battle:denBattle,pre:'qDenPre'});
addEv('glacier',{id:'dog',kind:'dog',at:[19.4,31.8],label:'受傷的獵犬',hideIf:()=>!!P.flags.dogSaved,fn:()=>{say([{n:'獵犬縮在倒木底下發抖。四周的狼群還沒有散去。'}]);}});
addEv('glacier',{id:'dogHome',kind:'dog',at:[40.6,25.6],label:'北斗',hideIf:()=>!P.flags.dogSaved,fn:()=>{toast(['北斗把頭靠在克蕾雅的膝蓋上。','北斗對萊恩搖了搖尾巴。','北斗在雪地裡打滾。'][(Math.random()*3)|0]);backToMap();}});
addEv('glacier',{id:'chGx',kind:'chest',at:[44.9,10.6],label:'冰瀑後的暗格',secret:1,loot:{Al:2,Si:2},items:['capsule'],money:50});
catEv('glacier',[3,4]);
// fortress: Erik's letter -> quartermaster
{const ev=evOf('fortress','erik');if(ev){const talk=ev.talk,after=ev.after;delete ev.talk;delete ev.once;ev.qm=()=>P.flags.erik&&!Q('letter')?'！':null;
  ev.fn=()=>{if(!P.flags.erik){say(SCENES[talk],()=>{after&&after();});return;}const s=Q('letter');
    if(s===0){say([{who:'erik',e:'Neutral',t:'……這封信，是我在自己的櫃子裡找到的。是我的字。收件人是莉亞。'},{who:'erik',e:'Neutral',t:'我不記得寫了什麼，也不記得為什麼要寫。'},
      {who:'erik',e:'Neutral',t:'寄信要經過軍需官。你們……可以幫我拿過去嗎？我自己去的話，大概會把它歸檔。'},{who:'claire',e:'Hurt',t:'……嗯。交給我。'}],()=>qStart('letter'));return;}
    say([{who:'erik',e:'Neutral',t:s===2?'軍需官說會寄出去。……莉亞收到的話，會高興嗎？我想不起來那是什麼表情。':'軍需官在東側的倉庫。'}]);};}}
{const ev=evOf('fortress','quarter');if(ev){const open=ev.fn;ev.qm=()=>Q('letter')===1?'？':null;
  ev.fn=()=>{if(Q('letter')===2&&!SHOPS.quarter.gear.includes('medal'))SHOPS.quarter.gear.push('medal');
    if(Q('letter')!==1){open();return;}
    say([{who:'guard',nm:'軍需官',e:'Neutral',t:'信？……這三個月，兵營一封信都沒寄出去過。上面說，沒有必要。'},{n:'軍需官拆開信紙，讀到一半，停了下來。'},
     {n:'「莉亞，要是哪天我變得不像我，妳就揍我一拳。妳揍人最痛了。」'},{who:'guard',nm:'軍需官',e:'Neutral',t:'……我會把它塞進下一班雪橇的郵袋。不登記。'},
     {who:'guard',nm:'軍需官',e:'Neutral',t:'倉庫最裡面還有幾樣東西，本來是留給上校的。你們要的話，照價拿去。'}],()=>{addLoot('bandage');addLoot('bandage');qDone('letter');SHOPS.quarter.gear.push('medal');
       toast('取得 蒸氣繃帶×2。軍需處新增「白銀連隊徽章」。');backToMap();open();return false;});};}}
catEv('fortress',[40,4]);
// vault: name tags
const TAGS={tagA:['「馬汀・柯爾　炊事兵　第二次處置」','「主要成分：思念（妻）、煩躁（伙食預算）、驕傲（燉菜）」',{who:'claire',e:'Angry_Steam',t:'馬汀……要塞的廚子？霜港鎮那位太太的丈夫！'}],
 tagB:['「托比　見習號兵　年齡十四　第一次處置」','「主要成分：恐懼（黑暗）、好奇（星星）、想家（未分類）」',{who:'claire',e:'Teary_Fierce',t:'十四歲……連「想家」都被抽走了，還說是「未分類」。'}]};
Object.entries({tagA:[4.6,13.9],tagB:[11.5,19.4]}).forEach(([id,at])=>addEv('vault',{id,kind:'crystal',at,label:'貼著名牌的冰晶',glow:0x0a3a5a,light:0x7fe8ff,qm:()=>Q('tags')<2&&!P.flags[id]?'！':null,fn:()=>readTag(id)}));
function readTag(id){const [a,b,c]=TAGS[id];const was=P.flags[id];P.flags[id]=1;if(!Q('tags'))qStart('tags');const n=['tagA','tagB'].filter(k=>P.flags[k]).length;
  const base=[{n:'結晶上貼著一張被霜凍硬的名牌。'},{n:a},{n:b},c];
  if(was||n<2||Q('tags')===2){say(base);return;}
  say(base.concat([{n:'名牌底下的隔壁那一格，是空的。'},{n:'空格底下的名牌結了一層厚厚的霜。克蕾雅用袖子擦開——'},
   {n:'「編號 0-001　霍華德　採集地：中央學院城・零號爐　採集日：十一月十一日」'},{n:'「狀態：特別保管——移至擺鐘室」'},
   {who:'claire',e:'Memory_Headache',t:'霍華德……醫院裡，你說他是研究院的一位主任。'},{who:'claire',e:'Hurt',t:'為什麼他的名字會在這裡？他不是三年前就……'},
   {who:'ryan',e:'Fork_Gaze',t:'……先往前走。答案在擺鐘室。'}]),()=>qDone('tags'));}
catEv('vault',[30,23.6]);

/* ---------- build hooks: critters, trails, secret markers, quest marks ---------- */
function questVisuals(id){
  X.events.forEach(ev=>{if(ev.secret&&ev.mk)ev.mk.visible=false;
    if((ev.kind==='cat'||ev.kind==='dog')&&!ev.hidden){ev.obj=critter(ev.kind,ev.at[0],ev.at[1],ev.kind==='cat'?.62:.85);}});
  if(id==='glacier'){pawTrail(35.6,26.8,20.8,30.8);}
  if(id==='frostport'&&P.flags.egg_snowman)snowmanFall(false);
  addQuestMarks();}
{const o=buildFree;buildFree=function(M){o(M);const id=Object.keys(MAPS).find(k=>MAPS[k]===M);questVisuals(id);};}
{const o=buildTown;buildTown=function(M){const r=o(M);questVisuals('town');return r;};}
/* chapter-2 replay resets its own quests (the cat collection carries over) */
{const o=startCh2;startCh2=function(){o();['q_coal','q_dog','q_letter','q_tags','tagA','tagB','dogSaved','snowN','egg_snowman','egg_mail'].forEach(k=>delete P.flags[k]);};}

/* portraits for the side-quest NPCs */
Object.assign(STAND,{erik:['neutral','cry'],hunter:['neutral','hurt'],folkw:['hurt']});
Object.assign(STAND_MAP,{erik:{Neutral:'neutral',Cry:'cry',Teary_Fierce:'cry',Smile:'cry'},hunter:{Neutral:'neutral',Hurt:'hurt'},folkw:{}});
['erik_neutral','erik_cry','hunter_neutral','hunter_hurt','folkw_hurt'].forEach(k=>{const im=new Image();im.decoding='async';im.src=`portraits/${k}.webp`;STAND_PRE[k]=im;});
