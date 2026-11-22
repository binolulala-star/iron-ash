/* ======================= CHAPTER 3 — BATTLE SYSTEMS (wind · magnet pylons · floating platforms) =======================
   B.cfg.wind  = {seq:[[di,dj],…], every:3, edge:'fall'|'wall'}  → after every enemy phase, units on open ground drift 1 cell downwind
   tiles 'pylon'                                                  → each new turn, metal units within 2 cells are pulled 1 cell (or pushed, after Ryan flips it)
   B.cfg.lift  = [[i,j,phase],…]                                  → platforms cycle height 0→1→2→1… one step per turn; riders go with them */

/* ---- new foes: painted sheets (env/ch_<type>.webp) + hand-drawn fallbacks ---- */
Object.assign(CH_ART,{stormkite:{cw:172,ch:72,body:58,fr:['idle','atk'],foe:1},gendarme:{cw:78,ch:102,body:102,fr:['idle','atk'],foe:1},
 golem:{cw:158,ch:142,body:142,fr:['idle','atk'],foe:1,scale:1.15},coil:{cw:202,ch:162,body:162,fr:['idle','atk'],foe:1,scale:1.4}});
['stormkite','gendarme','golem','coil'].forEach(k=>chLoad(k,CH_ART[k]));
Object.assign(ENEMY,{
 stormkite:{name:'風暴鳶',hp:70,tg:15,atk:22,mv:5,h:1.05,float:true,speed:3,fly:true,drop:['H2O',1],frames:()=>[tex(sweeperCanvas(0)),tex(sweeperCanvas(1))]},
 gendarme:{name:'靜默憲兵',hp:140,tg:60,atk:26,mv:3,h:1.5,metal:true,drop:['Fe',1],frames:()=>[tex(humanCanvas('guard',0)),tex(humanCanvas('guard',1))]},
 golem:{name:'磁鐵礦魔像',hp:260,tg:120,atk:36,mv:2,h:2.2,metal:true,heavy:true,speed:1.2,drop:['Fe',2],frames:()=>[tex(mechCanvas(0,false)),tex(mechCanvas(1,false))]},
 coil:{name:'雷暴線圈',hp:1100,tg:160,atk:50,rng:5,ratk:44,mv:1,h:2.8,metal:true,heavy:true,speed:1.1,frames:()=>[tex(mechCanvas(0,true)),tex(mechCanvas(1,true))]},
});
Object.assign(VERB,{stormkite:['乘著強風俯衝，抓向'],gendarme:['揮下電擊警棍，打中'],golem:['掄起磁石巨拳砸向'],coil:['放出雷擊，劈中']});
Object.assign(EXP_OF,{stormkite:28,gendarme:44,golem:70,coil:360});
Object.assign(DROPS,{stormkite:[['bandage',.3]],gendarme:[['bandage',.35],['coffee',.15]],golem:[['capsule',.4]],coil:[['coffee',1]]});
Object.assign(TH_H2,{stormkite:1.6,gendarme:2.5,golem:3.4,coil:4.2});

const isMetal=x=>x&&(x.key==='claire'||(x.d&&x.d.metal));
const isHeavy=x=>x&&x.d&&x.d.heavy;
const c3Units=()=>['ryan','claire'].map(k=>B.units[k]).filter(u=>u.alive).concat(alive());
const c3Pos=x=>x.spr?x.spr.holder.position.clone():W(x.i,x.j);
/* pylons block movement like walls */
{const o=occupied;occupied=function(i,j,ign){return o(i,j,ign)||(B&&B.tiles[i]&&B.tiles[i][j]==='pylon');};}

/* ---- pylon prop ---- */
{const o=refreshTile;refreshTile=function(i,j){o(i,j);if(!B||B.tiles[i][j]!=='pylon')return;const key=i+','+j;if(B.props[key])E.world.remove(B.props[key]);
  const rep=B.pol&&B.pol[key]>0,col=rep?0xff7a5a:0x5ab8ff,g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.16,10),texMat('rust',1,1,{metalness:.7}));base.position.y=.08;
  const post=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,1.05,10),new THREE.MeshStandardMaterial({color:0x3a4048,metalness:.8,roughness:.35}));post.position.y=.6;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.24,.05,8,20),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1.4}));ring.rotation.x=Math.PI/2;ring.position.y=.95;
  const ring2=ring.clone();ring2.position.y=.62;ring2.scale.setScalar(.8);
  [base,post].forEach(m=>{m.castShadow=true;});g.add(base,post,ring,ring2);g.userData.pylon=ring;
  g.position.set(i-OFF,hAt(i,j)*HSTEP,j-OFF);g.traverse(m=>m.userData.cell=[i,j]);E.world.add(g);B.props[key]=g;};}

/* ---- shared mover: one cell along (di,dj); returns what happened ---- */
function c3Shove(x,di,dj,why){
  const ni=x.i+di,nj=x.j+dj,unit=isUnit(x);
  if(!inb(ni,nj)){
    if(B.cfg.wind&&B.cfg.wind.edge==='fall'){
      if(unit){damageUnit(x,35);floatAt(c3Pos(x),'抓住纜繩！','#ffd27a');log(`${x.name}差點被${why}吹下平台，抓住了纜繩。`);}
      else if(!x.boss){floatAt(c3Pos(x),'墜落','#ffd27a');log(`${x.name}被${why}吹出平台，消失在雲海裡。`);damageEnemy(x,x.hp,{raw:true});}
      E.shake=.5;return 'edge';}
    return 'stop';}
  if(occupied(ni,nj,x)){const wall=B.tiles[ni][nj]==='wall'||B.tiles[ni][nj]==='pylon';
    if(wall){if(unit)damageUnit(x,10);else damageEnemy(x,15,{raw:true});floatAt(c3Pos(x),'撞擊','#c8a456');}return 'stop';}
  const dh=hAt(ni,nj)-hAt(x.i,x.j);if(dh>0)return 'stop';
  x.i=ni;x.j=nj;if(dh<0)fallHit(x,-dh);return 'moved';}

/* ---- wind ---- */
const WIND_NAME=d=>d[0]>0?'→':d[0]<0?'←':d[1]>0?'↓':'↑';
function windDir(){const w=B.cfg.wind;return w.seq[(B.windIdx||0)%w.seq.length];}
function windSheltered(x,d){const ui=x.i-d[0],uj=x.j-d[1];if(!inb(ui,uj))return false;
  return B.tiles[ui][uj]==='wall'||B.tiles[ui][uj]==='pylon'||hAt(ui,uj)>hAt(x.i,x.j);}
function windImmune(x){return isHeavy(x)||(x.d&&x.d.fly)||(x.calm>0)||(x.root>0);}
async function windTick(){const d=windDir();
  const list=c3Units().filter(x=>!windImmune(x)).sort((a,b)=>(b.i*d[0]+b.j*d[1])-(a.i*d[0]+a.j*d[1]));   // downwind first, so a row slides as one
  let moved=0;for(const x of list){if(!x.alive)continue;if(windSheltered(x,d)){floatAt(c3Pos(x),'風影','#bfe8ff');continue;}
    const r=c3Shove(x,d[0],d[1],'強風');if(r==='moved')moved++;}
  if(list.length){placeUnits(false);windGust(d);log(`強風${WIND_NAME(d)}：${moved?moved+' 個單位被吹動':'所有人都穩住了'}。`);await sleep(420);}
  const w=B.cfg.wind;if(w.every&&B.turn%w.every===0){B.windIdx=(B.windIdx||0)+1;banner('風向改變',`現在吹向 ${WIND_NAME(windDir())}`);}
  else if(w.every&&(B.turn+1)%w.every===0){const nx=w.seq[((B.windIdx||0)+1)%w.seq.length];floatAt(W(OFF,OFF),'下回合風向 '+WIND_NAME(nx),'#bfe8ff');log(`風勢在變，下回合會改吹 ${WIND_NAME(nx)}。`);}
  windHud();}
function windHud(){const el=$('env-s');if(!el||!B||!B.cfg.wind)return;let w=$('wind-ind');if(!w){w=document.createElement('span');w.id='wind-ind';w.style.cssText='margin-left:8px;color:#bfe8ff;font-weight:600';el.after(w);}
  const ev=B.cfg.wind.every,left=ev?ev-(B.turn%ev):0;w.textContent=`風向 ${WIND_NAME(windDir())}`+(ev?`（${left} 回合後轉向）`:'');}
/* streaks drifting across the board so the wind is visible at a glance */
function windStreaks(){if(B.windFx)return;const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:0xe8f4ff,transparent:true,opacity:.28,depthWrite:false});
  for(let k=0;k<26;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.9+Math.random()*.8,.035),mat);m.rotation.x=-Math.PI/2;m.position.set((Math.random()-.5)*N,.25+Math.random()*1.4,(Math.random()-.5)*N);m.userData.v=1.6+Math.random()*1.8;g.add(m);}
  E.world.add(g);B.windFx=g;
  E.fxs.push(function windFxTick(dt){if(!B||B.windFx!==g)return false;const d=windDir(),half=N/2+1;g.children.forEach(m=>{m.rotation.z=d[0]?0:Math.PI/2;
    m.position.x+=d[0]*m.userData.v*dt;m.position.z+=d[1]*m.userData.v*dt;if(m.position.x>half)m.position.x=-half;if(m.position.x<-half)m.position.x=half;if(m.position.z>half)m.position.z=-half;if(m.position.z<-half)m.position.z=half;});return true;});}
function windGust(d){c3Units().forEach(x=>burst(c3Pos(x),0xe8f4ff,6,.8));}

/* ---- magnet pylons ---- */
function pylons(){const out=[];for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(B.tiles[i][j]==='pylon')out.push([i,j]);return out;}
function stepToward(x,ti,tj,sign){const dx=ti-x.i,dz=tj-x.j;if(!dx&&!dz)return [0,0];const ax=Math.abs(dx)>=Math.abs(dz);return ax?[Math.sign(dx)*sign,0]:[0,Math.sign(dz)*sign];}
async function pylonTick(pulse){const PY=pylons();if(!PY.length)return;B.pol=B.pol||{};let n=0;
  for(const [pi,pj] of PY){const key=pi+','+pj,rep=B.pol[key]>0;if(pulse&&pulse!==key)continue;
    const hit=c3Units().filter(x=>isMetal(x)&&md(x.i,x.j,pi,pj)<=2&&!(x.d&&x.d.fly));
    hit.sort((a,b)=>rep?md(a.i,a.j,pi,pj)-md(b.i,b.j,pi,pj):md(a.i,a.j,pi,pj)-md(b.i,b.j,pi,pj));
    for(const x of hit){if(!rep&&md(x.i,x.j,pi,pj)===1)continue;const [di,dj]=stepToward(x,pi,pj,rep?-1:1);if(!di&&!dj)continue;
      if(c3Shove(x,di,dj,'磁力')==='moved'){n++;floatAt(c3Pos(x),rep?'磁力推開':'磁力吸引',rep?'#ff9a7a':'#8fd0ff');}}
    if(!pulse&&B.pol[key]>0){B.pol[key]--;if(!B.pol[key]){refreshTile(pi,pj);floatAt(W(pi,pj),'恢復吸引','#8fd0ff');}}}
  if(n){placeUnits(false);await sleep(380);}}
/* Ryan: strike the pylon with the tuning fork to flip it to repel for 2 turns (and fire one push right away) */
{const o=renderActions;renderActions=function(){o();if(!B||B.phase!=='player')return;const u=B.units[B.sel];if(!u||u.key!=='ryan'||!u.alive)return;
  const near=pylons().find(([i,j])=>md(u.i,u.j,i,j)===1);if(!near)return;const key=near.join(','),ok=u.ap>=1&&!(B.pol&&B.pol[key]>0);
  const b=document.createElement('button');b.className='ab rc'+(ok?' ready':'');b.disabled=!ok;b.innerHTML=`共振反轉<small>1 AP · 旁邊的磁柱改成斥力 2 回合</small>`;
  b.onclick=async()=>{if(!ok)return;spend(u,1);B.pol=B.pol||{};B.pol[key]=2;refreshTile(near[0],near[1]);burst(W(near[0],near[1]),0xff9a7a,30,1.6);E.shake=.4;
    log('萊恩用音叉敲響磁柱——磁極翻轉成斥力。');await pylonTick(key);updateHud();renderDeck();renderActions();};
  const box=$('abtns'),end=box.querySelector('.ab.end');box.insertBefore(b,end||null);};}

/* ---- floating platforms ---- */
const LIFT=[0,1,2,1];
function liftH(phase,turn){return LIFT[(turn+phase)%LIFT.length];}
function liftMarks(){if(B.liftMarks)B.liftMarks.forEach(m=>E.world.remove(m));B.liftMarks=[];
  (B.cfg.lift||[]).forEach(([i,j,ph])=>{const now=hAt(i,j),nx=liftH(ph,B.turn+1);if(nx===now)return;const up=nx>now;
    const m=new THREE.Mesh(new THREE.ConeGeometry(.12,.22,4),new THREE.MeshBasicMaterial({color:up?0x9be39b:0xffb070,transparent:true,opacity:.85}));
    m.position.copy(W(i,j));m.position.y+=.12;m.rotation.x=up?0:Math.PI;m.position.x+=.34;m.position.z+=.34;E.world.add(m);B.liftMarks.push(m);});}
async function liftTick(){const L=B.cfg.lift||[];if(!L.length)return;
  L.forEach(([i,j,ph])=>{B.hgt[i][j]=liftH(ph,B.turn);refreshTile(i,j);});placeUnits(false);liftMarks();await sleep(300);}

/* ---- turn order: enemy phase ends → wind → platforms move → pylons pull ---- */
{const o=endTurn;endTurn=async function(){const t0=B?B.turn:0;const r=await o();
  if(B&&B.turn>t0&&B.phase==='player'&&(B.cfg.wind||B.cfg.lift||B.cfg.ch3)){
    if(B.cfg.wind)await windTick();if(B.cfg.lift)await liftTick();await pylonTick();
    const U=B.units;if(!U.ryan.alive&&!U.claire.alive)return defeat();
    if(B.phase==='done')return r;
    updateHud();renderDeck();renderActions();}
  return r;};}
HOOK.after('startBattle',cfg=>{const wi=$('wind-ind');if(wi)wi.remove();if(!cfg.wind&&!cfg.lift&&!cfg.ch3)return;B.windIdx=0;B.pol={};
  if(cfg.lift)cfg.lift.forEach(([i,j,ph])=>{B.hgt[i][j]=liftH(ph,1);refreshTile(i,j);});
  pylons().forEach(([i,j])=>refreshTile(i,j));placeUnits(true);if(pylons().length)E.fxs.push(pylonGlow);
  if(cfg.wind){windStreaks();windHud();}if(cfg.lift)liftMarks();
  if(cfg.envT){$('env-t').textContent=cfg.envT;$('env-s').textContent=cfg.envS||'';windHud();}});
{const o=updateHud;updateHud=function(...a){const r=o(...a);if(B&&B.cfg.wind)windHud();return r;};}
/* pulse the pylon rings */
function pylonGlow(dt){if(B&&B.props)Object.values(B.props).forEach(p=>{const r=p.userData&&p.userData.pylon;if(r)r.material.emissiveIntensity=1.1+Math.sin(performance.now()/260)*.5;});return !!B;}
