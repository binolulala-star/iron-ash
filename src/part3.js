/* ======================= EXPLORATION ======================= */
const MAPS={
 town:{name:'奧姆鎮・礦工街',theme:'town',enc:true,table:[['miner','miner'],['miner','hound'],['miner','miner','miner']],start:[2,5],rest:[18,8],
  grid:["######################","#hhhh#hhhhh#hhhh#hhhh#","#hhhh#hhhhh#hhhh#hhhh#","#....................#","#..c.......l.........#","#....................E",
        "#.....c..............#","#....~~~~............#","#..........c.....l...#","#....................#","######################"],
  obj:()=>P.flags.marta?'從鎮東水塔下的入口進入地下水道':'向鎮上還清醒的人打聽消息',
  events:[
   {id:'notice',kind:'board',at:[3,3],label:'告示板',talk:'notice'},
   {id:'marta',kind:'npc',who:'marta',at:[7,3],label:'瑪塔',talk:'marta',after:()=>{P.flags.marta=1;}},
   {id:'dazed',kind:'npc',who:'miner',at:[10,3],label:'發呆的礦工',talk:'dazed'},
   {id:'tim',kind:'npc',who:'tim',at:[14,4],label:'提姆',talk:'tim',after:()=>{P.flags.tim=1;}},
   {id:'stove',kind:'stove',at:[19,8],label:'鎮公所的蒸氣暖爐（休息・整備）',rest:true},
   {id:'chest1',kind:'chest',at:[2,9],label:'被丟棄的工具箱',loot:{Fe:2,C:2},items:['amulet','bandage']},
   {id:'exit',kind:'exit',at:[21,5],label:'鎮東水塔入口',cond:()=>P.flags.marta,deny:'先向鎮民打聽通往機庫的路。',go:()=>enterMap('sewer')},
  ]},
 sewer:{name:'奧姆鎮・地下強酸水道',theme:'sewer',enc:true,table:[['sweeper'],['hound','sweeper'],['miner','sweeper'],['hound','hound']],start:[2,7],rest:[2,7],
  grid:["######################","#........#..........E#","#........#...........#","#........#....~~~~~..#","#...............~~~..#","~~~~~~~~~BBB~~~~~~~~~~",
        "#..c.................#","#....................#","######################"],
  bridge:'bridge',
  obj:()=>!P.flags.bridge?'想辦法越過強酸渠':!P.flags.clinic?'調查水道北側的廢棄診療室':'沿水道往東北，找到通往機庫的鐵梯',
  events:[
   {id:'block',kind:'auto',at:[10,6],r:1.3,talk:'acidBlock',once:true,cond:()=>!P.flags.bridge},
   {id:'lime',kind:'pillar',at:[7,6],label:'石灰岩柱',talk:'limestone',once:true,after:()=>{P.flags.bridge=1;buildBridge();const e=X.events.find(o=>o.id==='lime');e.hidden=true;e.obj.visible=false;}},
   {id:'clinic',kind:'desk',at:[3,2],label:'廢棄診療室的桌子',talk:'clinic',once:true,after:()=>{P.flags.clinic=1;}},
   {id:'chest2',kind:'chest',at:[7,1],label:'酸液罐補給箱',loot:{Acid:2,Al:1},items:['coating']},
   {id:'exit',kind:'exit',at:[20,1],label:'通往機庫的鐵梯',cond:()=>P.flags.clinic,deny:'診療室那邊好像有東西，先去看看。',go:()=>enterMap('yard')},
  ]},
 yard:{name:'第三蒸氣機庫・後方貨運場',theme:'yard',enc:false,table:[],start:[2,8],rest:[16,8],
  grid:["##################","#HHHHHHHHHHHHHHHH#","#HHHHHHHDDHHHHHHH#","#................#","#..c.......c.....#","#................#",
        "#................#","#.............c..#","#................#","##################"],
  obj:()=>!P.flags.guards?'突破守在後門的憲兵':'在暖爐休息整備，然後進入機庫後門',
  events:[
   {id:'g1',kind:'npc',who:'guard',at:[8,4],label:'憲兵隊長',hideIf:()=>P.flags.guards},
   {id:'g2',kind:'npc',who:'guard',at:[10,4],label:'憲兵',hideIf:()=>P.flags.guards},
   {id:'guards',kind:'auto',at:[9,6],r:2.2,once:true,cond:()=>!P.flags.guards,fight:true},
   {id:'stove2',kind:'stove',at:[16,8],label:'值班室的暖爐（休息・整備）',rest:true},
   {id:'chest3',kind:'chest',at:[15,3],label:'鋁合金零件箱',loot:{Al:1,Fe:2},items:['caliper','coffee']},
   {id:'door',kind:'exit',at:[8.5,2],r:1.3,label:'機庫後門',cond:()=>P.flags.guards,deny:'憲兵擋在門口。',go:()=>toBoss()},
  ]},
};
const X={keys:{},enc:0,thresh:9};
const THEME={
 town:{fog:0x141a24,hemi:.55,floor:'cobble',wall:'brick',liquid:'water',key:[0xa8c0ff,.55],dust:[0x8ab0d8,'rain']},
 sewer:{fog:0x070a07,hemi:.32,floor:'stone',wall:'brick',liquid:'acid',key:[0x8ab090,.35],dust:[0x9aff8a,.2]},
 yard:{fog:0x120c0a,hemi:.4,floor:'plate',wall:'rust',liquid:'water',key:[0xffd0a0,.5],dust:[0xffc890,.25]},
};
const walkCh='.ED';
function cellAt(x,z){return [Math.round(x),Math.round(z)];}
function walkable(i,j){const M=X.M;if(j<0||j>=M.grid.length||i<0||i>=M.grid[0].length)return false;const ch=M.grid[j][i];
  if(ch==='B')return !!P.flags[M.bridge];if(!walkCh.includes(ch))return false;
  return !X.events.some(ev=>ev.block&&!ev.hidden&&Math.round(ev.at[0])===i&&Math.round(ev.at[1])===j);}
function canStand(x,z){const r=.28;return [[x-r,z-r],[x+r,z-r],[x-r,z+r],[x+r,z+r]].every(([a,b])=>walkable(Math.round(a),Math.round(b)));}
function enterMap(id,opts={}){
  const M=MAPS[id];X.id=id;X.M=M;E.mode='explore';
  X.events=M.events.map(ev=>Object.assign({},ev,{block:['npc','chest','stove','board','desk','pillar'].includes(ev.kind),done:!!P.flags['ev_'+id+'_'+ev.id]}));
  buildExploreWorld(M);
  const sp=opts.pos||M.start;X.pos=new THREE.Vector3(sp[0],0,sp[1]);X.target=null;X.enc=0;X.thresh=10+Math.random()*6;X.cool=0;X.near=null;
  X.lead.holder.position.copy(X.pos);X.follow.holder.position.set(X.pos.x-.8,0,X.pos.z);
  {const Wd=M.grid[0].length,mg=innerWidth<600?2.5:5.5,cx=Wd>14?Math.max(mg,Math.min(Wd-1-mg,X.pos.x)):(Wd-1)/2;E.camera.position.set(cx,7.6,X.pos.z+8.4);E.controls.target.set(cx,.6,X.pos.z);}
  show('explore');updateExHud();
  if(!opts.pos&&!P.flags[id+'_in']){P.flags[id+'_in']=1;talkScene(id+'In');}
}
function resumeMap(){enterMap(X.id,{pos:[X.pos.x,X.pos.z]});}
function buildExploreWorld(M){
  clearWorld();const th=THEME[M.theme],H=M.grid.length,Wd=M.grid[0].length;setFog(th.fog,th.hemi);
  E.scene.fog.near=12;E.scene.fog.far=30;
  tileFloor(Wd,H,th.floor,(Wd-1)/2,(H-1)/2);
  const liq=T(th.liquid).clone();liq.needsUpdate=true;
  const liqMat=new THREE.MeshStandardMaterial({map:liq,roughness:.15,metalness:.4,emissive:th.liquid==='acid'?0x1a5a0a:0x0a2238});
  E.fxs.push(dt=>{liq.offset.x+=dt*.12;});
  const winMat=new THREE.MeshBasicMaterial({color:0xffc878});
  for(let j=0;j<H;j++)for(let i=0;i<Wd;i++){const ch=M.grid[j][i];
    if(ch==='#'){if(j===H-1)block(1,.35,1,i,0,j,texMat(th.wall,1,.3));else block(1,2.4,1,i,0,j,texMat(th.wall,1,2));}
    if(ch==='h'){block(1,3.4,1,i,0,j,texMat('brick',1,3));if(j===2&&(i*7)%3!==0){const w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.6),winMat);w.position.set(i,1.6+(i%2)*.9,j+.51);E.world.add(w);}}
    if(ch==='H')block(1,4.6,1,i,0,j,texMat('rust',1,4,{metalness:.4}));
    if(ch==='D'&&j===2){const d=new THREE.Mesh(new THREE.PlaneGeometry(1,2.6),new THREE.MeshBasicMaterial({color:0xffa040}));d.position.set(i,1.3,j-.3);E.world.add(d);
      block(1,2,.2,i,2.6,j-.4,texMat('rust',1,1));}
    if(ch==='c')block(.8,.8,.8,i,0,j,texMat(M.theme==='town'?'wood':'rust',1,1));
    if(ch==='l'){block(.14,2.4,.14,i,0,j,new THREE.MeshStandardMaterial({color:0x2a2a2a,metalness:.6}));const b=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),new THREE.MeshBasicMaterial({color:0xffd890}));b.position.set(i,2.5,j);E.world.add(b);
      const pl=new THREE.PointLight(0xffc070,1.6,6);pl.position.set(i,2.3,j);E.world.add(pl);flicker(pl,1.6,.3,3+i);}
    if(ch==='~'||ch==='B'){const p=new THREE.Mesh(new THREE.PlaneGeometry(1,1),liqMat);p.rotation.x=-Math.PI/2;p.position.set(i,.01,j);E.world.add(p);}
  }
  if(M.theme==='yard'){amberTower(5,-2.5,0x5a2208);const pl=new THREE.PointLight(0xff9a40,2.6,16);pl.position.set(8.5,2.2,3);E.world.add(pl);flicker(pl,2.6,.5,4);}
  if(M.theme==='sewer'){[[5,4],[15,2],[12,7]].forEach(([x,z])=>{const gl=new THREE.PointLight(0x7aff6a,1.3,7);gl.position.set(x,1.2,z);E.world.add(gl);flicker(gl,1.3,.3,2+x);});
    const lp=new THREE.PointLight(0xffb060,1.2,8);lp.position.set(3,2.4,2);E.world.add(lp);}
  keyLight(th.key[0],th.key[1],[Wd/2-6,12,H+4],[Wd/2,0,H/2]);
  if(th.dust[1]==='rain')rain([-2,0,-2,Wd+2,7,H+2]);else dustField(160,[0,0,0,Wd,4,H],th.dust[0],.06,th.dust[1]);
  if(M.bridge&&P.flags[M.bridge])buildBridge(true);
  X.lead=charSprite('ryan');X.follow=charSprite('claire');E.world.add(X.lead.holder,X.follow.holder);
  X.events.forEach(ev=>{
    ev.hidden=ev.hideIf?ev.hideIf():(ev.kind==='pillar'&&ev.done);const [x,z]=ev.at;let o=null;
    if(ev.kind==='npc'){const s=charSprite(ev.who);s.holder.position.set(x,0,z);s.face(-1);ev.spr=s;o=s.holder;}
    if(ev.kind==='chest'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.4,.42),texMat('wood',1,1));b.position.y=.2;b.castShadow=true;
      const band=new THREE.Mesh(new THREE.BoxGeometry(.62,.06,.44),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8,roughness:.3}));band.position.y=.32;o.add(b,band);o.position.set(x,0,z);}
    if(ev.kind==='stove'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.9,12),texMat('rust',2,1,{metalness:.5}));b.position.y=.45;b.castShadow=true;
      const f=new THREE.Mesh(new THREE.BoxGeometry(.22,.16,.05),new THREE.MeshBasicMaterial({color:0xff8a30}));f.position.set(0,.35,.33);
      const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.6,8),new THREE.MeshStandardMaterial({color:0x3a3a3a}));pipe.position.y=1.6;
      const pl=new THREE.PointLight(0xff9040,1.8,5);pl.position.set(0,.6,.6);flicker(pl,1.8,.4,6);o.add(b,f,pipe,pl);o.position.set(x,0,z);}
    if(ev.kind==='board'){o=new THREE.Group();const p=new THREE.Mesh(new THREE.BoxGeometry(.8,.6,.06),texMat('wood',1,1));p.position.y=1.1;
      const paper=new THREE.Mesh(new THREE.PlaneGeometry(.5,.36),new THREE.MeshLambertMaterial({color:0xe8dcc0}));paper.position.set(0,1.1,.04);
      [-.3,.3].forEach(dx=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.9,.06),texMat('wood',1,1));l.position.set(dx,.45,0);o.add(l);});o.add(p,paper);o.position.set(x,0,z);}
    if(ev.kind==='desk'){o=new THREE.Group();const d=new THREE.Mesh(new THREE.BoxGeometry(1,.6,.5),texMat('wood',1,1));d.position.y=.3;d.castShadow=true;
      const tin=new THREE.Mesh(new THREE.BoxGeometry(.2,.06,.14),new THREE.MeshStandardMaterial({color:0x8a6a4a,metalness:.6}));tin.position.set(.2,.63,0);o.add(d,tin);o.position.set(x,0,z);}
    if(ev.kind==='pillar'){o=new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,1.6,10),texMat('stone',1,2,{color:0xd8d4c8}));o.position.set(x,.8,z);o.castShadow=true;}
    if(ev.kind==='exit'){o=new THREE.Mesh(new THREE.RingGeometry(.3,.42,24),new THREE.MeshBasicMaterial({color:0x5cc2ad,side:THREE.DoubleSide,transparent:true,opacity:.8}));o.rotation.x=-Math.PI/2;o.position.set(x,.03,z);}
    if(o){o.visible=!ev.hidden;E.world.add(o);ev.obj=o;}
    if(['npc','chest','stove','board','desk','pillar'].includes(ev.kind)){
      const mk=new THREE.Mesh(new THREE.OctahedronGeometry(.1),new THREE.MeshBasicMaterial({color:0xffd27a}));mk.position.set(x,ev.kind==='npc'?(ev.who==='tim'?1.45:1.85):1.3,z);
      mk.visible=!ev.hidden&&!ev.done;E.world.add(mk);ev.mk=mk;}
  });
  E.fxs.push((dt,t)=>{X.events.forEach(ev=>{if(ev.mk){ev.mk.rotation.y+=dt*2;ev.mk.position.y+=Math.sin(t*3)*.002;}if(ev.kind==='exit'&&ev.obj)ev.obj.material.opacity=.5+Math.sin(t*3)*.3;});});
  E.onTick=exploreTick;setTilt(.5,2.4);
}
function buildBridge(quiet){const M=X.M;for(let j=0;j<M.grid.length;j++)for(let i=0;i<M.grid[0].length;i++)if(M.grid[j][i]==='B'){
  const b=new THREE.Mesh(new THREE.BoxGeometry(1,.16,1),texMat('plate',1,1,{metalness:.6}));b.position.set(i,.05,j);b.receiveShadow=true;E.world.add(b);
  if(!quiet){b.scale.y=.01;let k=0;E.fxs.push(dt=>{k+=dt*2;b.scale.y=Math.min(1,k);return k<1;});}}}
function exploreTick(dt){
  if($('explore').hidden||!X.lead)return;
  let dx=0,dz=0;const K=X.keys;
  if(K.ArrowLeft||K.a)dx-=1;if(K.ArrowRight||K.d)dx+=1;if(K.ArrowUp||K.w)dz-=1;if(K.ArrowDown||K.s)dz+=1;
  if(dx||dz)X.target=null;
  else if(X.target){const v=X.target.clone().sub(X.pos);v.y=0;if(v.length()<.08)X.target=null;else{dx=v.x;dz=v.z;}}
  let moved=0;
  if(dx||dz){const L=Math.hypot(dx,dz),sp=3.1*dt,mx=dx/L*sp,mz=dz/L*sp;
    if(canStand(X.pos.x+mx,X.pos.z))X.pos.x+=mx;else if(X.target&&Math.abs(mz)<.01)X.target=null;
    if(canStand(X.pos.x,X.pos.z+mz))X.pos.z+=mz;
    moved=Math.hypot(mx,mz);if(Math.abs(mx)>.001)X.lead.face(mx);}
  X.lead.holder.position.copy(X.pos);X.lead.speed=moved?6:1.6;
  const fp=X.follow.holder.position,d=X.pos.clone().sub(fp);d.y=0;const dl=d.length();
  if(dl>.85){fp.add(d.normalize().multiplyScalar(dl-.85));X.follow.speed=6;if(Math.abs(d.x)>.01)X.follow.face(d.x);}else X.follow.speed=1.6;
  const Wd=X.M.grid[0].length,mg=innerWidth<600?2.5:5.5,cx=Wd>14?Math.max(mg,Math.min(Wd-1-mg,X.pos.x)):(Wd-1)/2,want=new THREE.Vector3(cx,7.6,X.pos.z+8.4);E.camera.position.lerp(want,Math.min(1,dt*4));
  E.controls.target.lerp(new THREE.Vector3(cx,.6,X.pos.z),Math.min(1,dt*4));E.camera.lookAt(E.controls.target);
  // interactions
  X.cool=Math.max(0,X.cool-dt);let near=null,nd=9;
  X.events.forEach(ev=>{if(ev.hidden)return;const dd=Math.hypot(ev.at[0]-X.pos.x,ev.at[1]-X.pos.z);
    if(ev.kind==='auto'){if(!ev.done&&(!ev.cond||ev.cond())&&dd<(ev.r||1.2))runEvent(ev);return;}
    if(ev.kind==='exit'){if(dd<(ev.r||.7)&&X.cool<=0){X.cool=1.5;if(ev.cond())runEvent(ev);else toast(ev.deny);}return;}
    if(ev.once&&ev.done)return;if(dd<1.35&&dd<nd){nd=dd;near=ev;}});
  if(near!==X.near){X.near=near;const b=$('ex-act');b.hidden=!near;if(near)b.innerHTML=`<small>調查</small>${near.label}`;}
  // random encounters
  if(moved&&X.M.enc){X.enc+=moved;updateDanger();if(X.enc>X.thresh){X.enc=0;X.thresh=10+Math.random()*6;encounter();}}
}
function updateDanger(){const r=Math.min(1,X.enc/X.thresh),el=$('danger');el.style.setProperty('--p',r);el.dataset.lv=!X.M.enc?'off':r<.5?'low':r<.8?'mid':'high';
  $('danger-t').textContent=!X.M.enc?'安全區域':r<.5?'危險度・低':r<.8?'危險度・中':'危險度・高';}
function updateExHud(){$('ex-area').textContent=X.M.name;$('ex-obj').textContent=X.M.obj();updateDanger();
  $('ex-party').innerHTML=['ryan','claire'].map(k=>`<div class="pm"><b>${k==='ryan'?'萊恩':'克蕾雅'}<small>Lv${P.lv[k].lv}</small></b><div class="bar"><i style="width:${P[k].hp/P[k].max*100}%"></i></div><span>${P[k].hp}/${P[k].max}</span></div>`).join('');}
function talkScene(key,after){playScene(SCENES[key],()=>{after&&after();backToMap();},{keep:true,actors:exActors()});}
function exActors(){const a={ryan:X.lead,claire:X.follow};X.events.forEach(ev=>{if(ev.spr)a[ev.who]=ev.spr;});return a;}
function backToMap(){E.mode='explore';show('explore');updateExHud();X.near=undefined;}
function markDone(ev){ev.done=true;P.flags['ev_'+X.id+'_'+ev.id]=1;if(ev.mk)ev.mk.visible=false;}
function runEvent(ev){
  X.target=null;X.keys={};$('ex-act').hidden=true;
  if(ev.kind==='exit'){ev.go();return;}
  if(ev.fight){markDone(ev);playScene(SCENES.guardsPre,()=>startBattle(battleGuards()),{keep:true,actors:exActors()});return;}
  if(ev.kind==='chest'){if(ev.done){toast('箱子已經空了。');return;}markDone(ev);
    Object.entries(ev.loot).forEach(([k,v])=>P.stash[k]=(P.stash[k]||0)+v);
    ev.obj.children[0].material=new THREE.MeshStandardMaterial({color:0x2a1e14});
    const got=Object.entries(ev.loot).map(([k,v])=>ELF[k]+'×'+v).concat((ev.items||[]).map(addLoot));
    toast(`取得 ${got.join('、')}。飾品可在「背包・整備」裝備。`);return;}
  if(ev.rest){playScene([{n:'暖爐裡的煤火劈啪作響。坐下來喘口氣吧。'},{choice:[
      {t:'休息（HP 全滿），再整理手札、機械鎧與飾品',fn:()=>{healParty(1);openBase(()=>{E.mode='explore';resumeMap();},'整備完成，回到地圖');}},
      {t:'休息就好（HP 全滿）',fn:()=>{healParty(1);toast('小隊的 HP 全滿了。');backToMap();}},
      {t:'離開',fn:()=>backToMap()}]}],null,{keep:true});return;}
  if(!ev.talk){const g=X.events.find(o=>o.fight&&!o.done);if(g)runEvent(g);return;}
  markDone(ev);
  talkScene(ev.talk,()=>{ev.after&&ev.after();});
}
function encounter(){
  const tbl=X.M.table,f=tbl[(Math.random()*tbl.length)|0];
  X.keys={};X.target=null;fx('flash');banner('遭遇敵人','');
  setTimeout(()=>startBattle(battleSkirmish(f,X.M.theme)),700);
}
$('ex-act').onclick=()=>{if(X.near)runEvent(X.near);};
$('ex-bag').onclick=()=>{X.keys={};X.target=null;baseTab='g';openBase(()=>{E.mode='explore';resumeMap();},'回到地圖');};
document.addEventListener('keydown',e=>{
  if(!$('story').hidden){if(e.key===' '||e.key==='Enter'){e.preventDefault();advance();}return;}
  if(!$('explore').hidden){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();
    if(e.key===' '||e.key==='Enter'||e.key==='e'||e.key==='E'){if(X.near)runEvent(X.near);return;}X.keys[e.key.length===1?e.key.toLowerCase():e.key]=true;}
});
document.addEventListener('keyup',e=>{X.keys[e.key.length===1?e.key.toLowerCase():e.key]=false;});
window.addEventListener('blur',()=>{X.keys={};});

/* ======================= BATTLE CONFIGS ======================= */
const ENEMY={
 mech:{name:'重裝蒸氣警衛機甲',hp:560,tg:100,atk:55,rng:4,ratk:40,mv:2,smart:true,h:2.3,speed:1.2,frames:()=>[tex(mechCanvas(0,true)),tex(mechCanvas(1,true))]},
 miner:{name:'失控工蜂礦工',hp:90,tg:0,atk:16,mv:2,h:1.45,nonlethal:true,frames:()=>[tex(humanCanvas('miner',0)),tex(humanCanvas('miner',1))]},
 hound:{name:'蒸氣巡邏犬',hp:90,tg:30,atk:22,mv:3,smart:true,h:.95,speed:3,drop:['Fe',1],frames:()=>[tex(houndCanvas(0)),tex(houndCanvas(1))]},
 sweeper:{name:'酸蝕清道機',hp:120,tg:50,atk:12,rng:3,ratk:22,mv:1,h:1.0,float:true,speed:4,drop:['Acid',2],frames:()=>[tex(sweeperCanvas(0)),tex(sweeperCanvas(1))]},
 guard:{name:'憲兵盾衛',hp:160,tg:80,atk:26,mv:2,h:1.45,drop:['Fe',2],frames:()=>[tex(humanCanvas('guard',0)),tex(humanCanvas('guard',1))]},
};
const LOOT_TYPES={town:['si','oil','scrap','water','si'],sewer:['acid','water','si','scrap','water'],yard:['scrap','oil','al','si'],train:['scrap','oil']};
function battleTrain(onWin){return{theme:'train',N:7,enemies:[['miner',2,1],['miner',4,1]],res:[['scrap',0,3],['scrap',6,4],['oil',5,1]],
  guide:'選克蕾雅，移動到礦工旁邊，用「鐵拳」制伏他們。萊恩可以分解車廂裡的廢鐵箱，留下錨點。',title:'車廂突圍',onWin};}
function battleGuards(){return{theme:'yard',N:7,enemies:[['guard',2,1],['guard',4,1],['hound',3,0]],res:[['scrap',1,3],['oil',5,3],['al',0,5],['si',6,5]],
  guide:'盾衛的外裝甲很厚。用 #R08 鐵枷或 #R06 電網一次控制多個敵人，或用 #R10 鋁熱劑燒掉裝甲。',title:'機庫後門・憲兵封鎖線',
  onWin:()=>{P.flags.guards=1;enterMap('yard',{pos:[9,6]});setTimeout(()=>talkScene('guardsPost'),300);}};}
function battleSkirmish(form,theme){
  const N=7,en=[],used=new Set();
  form.forEach((k,n)=>{let i=1+((n*2+((Math.random()*2)|0))%5),j=(Math.random()*2)|0;while(used.has(i+','+j))i=(i+1)%N;used.add(i+','+j);en.push([k,i,j]);});
  const res=[];const types=LOOT_TYPES[theme];for(let n=0;n<4;n++){let i,j,g=0;do{i=(Math.random()*N)|0;j=2+((Math.random()*3)|0);g++;}while((used.has(i+','+j))&&g<20);used.add(i+','+j);res.push([types[(Math.random()*types.length)|0],i,j]);}
  return{theme,N,enemies:en,res,title:'遭遇戰',guide:'小型遭遇戰。敵人會朝最近的隊員逼近，巡邏犬還會踩碎錨點。',onWin:()=>resumeMap(),explore:true};
}
function battleBoss(onWin){return{theme:'hangar',N:9,boss:true,enemies:[['mech',4,3]],res:[['si',0,7],['si',8,6],['si',3,6],['oil',8,1],['oil',0,2],['acid',6,7],['al',2,7]],title:'第三蒸氣機庫',onWin};}
