/* ======================= BATTLE ENGINE (multi-enemy) ======================= */
let N=9,OFF=4,B=null;
const HSTEP=.5;const hAt=(i,j)=>(B&&B.hgt&&i>=0&&j>=0&&i<N&&j<N)?B.hgt[i][j]:0;
const W=(i,j)=>new THREE.Vector3(i-OFF,hAt(i,j)*HSTEP,j-OFF);
const inb=(i,j)=>i>=0&&j>=0&&i<N&&j<N,md=(a,b,c,d)=>Math.abs(a-c)+Math.abs(b-d);
const FLOOR={train:'wood',town:'cobble',sewer:'stone',yard:'plate',hangar:'plate'};
const ENV={train:['序幕 · 裝甲列車車廂','行駛中 · 地面 L0'],town:['奧姆鎮 · 礦工街','酸雨 · 濕度 96% · 地面 L0'],sewer:['地下強酸水道','pH 1.2 · 腐蝕性蒸氣 · 地面 L0'],
  yard:['第三機庫 · 後方貨運場','環境 31°C · 地面 L0'],hangar:['第一章 · 第三蒸氣機庫','環境 38°C · 濕度 92% · 地面 L0']};
const VERB={mech:['重踏','蒸氣砲擊中'],miner:['揮鶴嘴鋤砸向'],hound:['撲咬'],sweeper:['用刷臂掃向','噴出酸液，命中'],guard:['舉盾猛擊']};
const TILE_EL={water:'H2O',scrap:'Fe',si:'Si',oil:'C',acid:'Acid',al:'Al'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function newBattle(cfg){
  N=cfg.N;OFF=(N-1)/2;const s=claireStats(save.mods);
  B={cfg,phase:'player',turn:1,ambush:false,over:s.load>save.cap,tiles:[],tileMesh:[],props:{},gas:new Set(),anchors:[],
    pool:{Si:0,Fe:0,H2O:0,C:0,Acid:0,Al:0},enemies:[],loot:{},
    units:{ryan:{key:'ryan',name:'萊恩',hp:Math.max(1,P.ryan.hp),max:P.ryan.max,ap:4,mv:3,i:OFF,j:N-1,arm:0,alive:true,rec:unitStats('ryan').rec,tap:unitStats('ryan').tap},
           claire:{key:'claire',name:'克蕾雅',hp:Math.max(1,P.claire.hp),max:P.claire.max,ap:4,mv:unitStats('claire').mv,i:OFF,j:N-2,arm:unitStats('claire').arm,atk:unitStats('claire').atk,alive:true,buff2:false,freeMove:false,ventUsed:false}},
    sel:'claire',mode:null,targets:new Map(),forbidUsed:false,snap:{ryan:P.ryan.hp,claire:P.claire.hp,stash:Object.assign({},P.stash),items:Object.assign({},P.items)},itemMenu:false};
  Object.entries(P.stash).forEach(([k,v])=>B.pool[k]=(B.pool[k]||0)+v);P.stash={};
  for(let i=0;i<N;i++){B.tiles[i]=[];for(let j=0;j<N;j++)B.tiles[i][j]='floor';}
  B.hgt=[];for(let i=0;i<N;i++){B.hgt[i]=[];for(let j=0;j<N;j++)B.hgt[i][j]=0;}(cfg.hgt||[]).forEach(([i,j,h])=>{if(inb(i,j))B.hgt[i][j]=h;});
  (cfg.res||[]).forEach(([t,i,j])=>{if(inb(i,j))B.tiles[i][j]=t;});
  const cnt={};cfg.enemies.forEach(([t])=>cnt[t]=(cnt[t]||0)+1);const seen={};
  cfg.enemies.forEach(([type,i,j])=>{const d=ENEMY[type];seen[type]=(seen[type]||0)+1;
    B.enemies.push({type,d,name:d.name+(cnt[type]>1?' '+'ABCD'[seen[type]-1]:''),hp:d.hp,max:d.hp,tg:d.tg,tgMax:d.tg,i,j,stun:0,root:0,alive:true,boss:type==='mech'});});
  B.boss=B.enemies.find(e=>e.boss)||null;
  if(B.boss)Object.assign(B.boss,{x:-1.5,z:-1,dir:1,wait:0});
}
const alive=()=>B.enemies.filter(e=>e.alive);
const enemyAt=(i,j)=>B.enemies.find(e=>e.alive&&e.i===i&&e.j===j);
const enemiesIn=cells=>alive().filter(e=>cells.some(([i,j])=>i===e.i&&j===e.j));
const enemiesNear=(cells,r=1)=>alive().filter(e=>cells.some(([i,j])=>md(i,j,e.i,e.j)<=r));
function nearestTo(pts,r){let best=null,bd=99;alive().forEach(e=>pts.forEach(p=>{const d=md(p.i,p.j,e.i,e.j);if(d<=r&&d<bd){bd=d;best=e;}}));return best;}

const TM={};
function tileMat(t){
  if(t==='water')return TM.water||(TM.water=new THREE.MeshStandardMaterial({map:T('water'),roughness:.15,metalness:.5,emissive:0x0a2a4a}));
  const f=FLOOR[B.cfg.theme]||'plate';return TM[f]||(TM[f]=new THREE.MeshStandardMaterial({map:T(f),roughness:.85,metalness:f==='plate'?.2:0}));}
function backdrop(th){
  const R=OFF+.5,z0=-R-.6;
  if(th==='hangar'){setFog(0x0a0a0c,.42);
    for(let k=-3;k<=3;k++)block(.45,6,.45,k*2.4,0,-5.6,texMat('rust',1,6,{metalness:.4}));amberTower(0,-7,0x4a1a06);
    const pl=new THREE.PointLight(0xff9a40,2.4,16);pl.position.set(0,2.6,-5);E.world.add(pl);flicker(pl,2.4,.5,4);
    const rim=new THREE.PointLight(0x6a8aff,1,14);rim.position.set(5,3,4);E.world.add(rim);keyLight(0xffd8b0,.55,[-6,10,5]);
    dustField(160,[-6,0,-6,6,5,5],0xffc890,.05,.22);return 'rust';}
  if(th==='train'){setFog(0x0c0e14,.5);
    block(N+5,3.4,.3,0,0,z0,texMat('rust',N+5,3,{metalness:.3}));
    const wins=[];for(let k=-2;k<=2;k++){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.9),new THREE.MeshBasicMaterial({color:0x9ab8d8}));w.position.set(k*2.2,2.1,z0+.16);E.world.add(w);wins.push(w);}
    E.fxs.push((dt,t)=>{wins.forEach((w,k)=>{const v=.45+.35*Math.max(0,Math.sin(t*3+k*1.7));w.material.color.setRGB(v*.7,v*.85,v);});});
    for(const x of [-R-.9,R+.9])block(.9,.5,N-1,x,0,0,texMat('wood',1,N));
    const lamp=new THREE.PointLight(0xffc070,2.2,11);lamp.position.set(0,3.2,0);E.world.add(lamp);flicker(lamp,2.2,.25,3);
    keyLight(0x9ab8ff,.45,[3,9,6]);dustField(90,[-5,0,-4,5,4,4],0xffd8a0,.05,.15);
    E.fxs.push(()=>{E.world.position.y=Math.sin(performance.now()/90)*.006;});return 'wood';}
  if(th==='town'){setFog(0x141a24,.6);
    for(let k=-3;k<=3;k++){block(1.9,3.4,1,k*2.1,0,z0-.4,texMat('brick',2,3));const w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.6),new THREE.MeshBasicMaterial({color:0xffc878}));w.position.set(k*2.1+.3,1.9,z0+.11);E.world.add(w);}
    for(const x of [-R-.8,R+.8]){block(.14,2.4,.14,x,0,-1,new THREE.MeshStandardMaterial({color:0x2a2a2a,metalness:.6}));const pl=new THREE.PointLight(0xffc070,1.6,7);pl.position.set(x,2.3,-1);E.world.add(pl);flicker(pl,1.6,.3,3+x);}
    keyLight(0xa8c0ff,.55,[-5,10,6]);rain([-6,0,-6,6,7,6]);return 'rust';}
  if(th==='sewer'){setFog(0x070a07,.38);
    block(N+5,2.6,.6,0,0,z0-.7,texMat('brick',N+5,3));
    const ch=T('acid').clone();ch.needsUpdate=true;ch.repeat.set(N+4,1);const p=new THREE.Mesh(new THREE.PlaneGeometry(N+4,.9),new THREE.MeshStandardMaterial({map:ch,emissive:0x1a5a0a,roughness:.2}));
    p.rotation.x=-Math.PI/2;p.position.set(0,-.05,z0+.15);E.world.add(p);E.fxs.push(dt=>{ch.offset.x+=dt*.2;});
    [[-R,-1],[R,1]].forEach(([x,z])=>{const gl=new THREE.PointLight(0x7aff6a,1.4,8);gl.position.set(x,1.2,z);E.world.add(gl);flicker(gl,1.4,.3,2+x);});
    keyLight(0x8ab090,.5,[-5,10,6]);dustField(120,[-5,0,-5,5,3,5],0x9aff8a,.05,.2);return 'stone';}
  if(th==='yard'){setFog(0x120c0a,.48);
    block(N+5,4.6,.6,0,0,z0-.6,texMat('rust',N+5,4,{metalness:.4}));amberTower(-2.5,z0-3,0x5a2208);
    const d=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.6),new THREE.MeshBasicMaterial({color:0xffa040}));d.position.set(1.5,1.3,z0-.28);E.world.add(d);
    const pl=new THREE.PointLight(0xff9a40,2.4,14);pl.position.set(1.5,2,z0+.6);E.world.add(pl);flicker(pl,2.4,.5,4);
    keyLight(0xffd0a0,.55,[-5,10,6]);dustField(120,[-5,0,-5,5,4,5],0xffc890,.05,.22);return 'rust';}
}
function buildBattleWorld(){
  clearWorld();const th=B.cfg.theme;const und=backdrop(th);
  const under=new THREE.Mesh(new THREE.BoxGeometry(N+.6,.6,N+.6),texMat(und,N,1));under.position.y=-.5;E.world.add(under);
  B.tileMesh=[];B.ovl=[];B.props={};const tg=new THREE.BoxGeometry(.98,.2,.98),og=new THREE.PlaneGeometry(.9,.9);
  for(let i=0;i<N;i++){B.tileMesh[i]=[];B.ovl[i]=[];for(let j=0;j<N;j++){
    const m=new THREE.Mesh(tg,tileMat('floor'));m.position.copy(W(i,j));m.position.y+=-.1;m.receiveShadow=true;m.userData.cell=[i,j];E.world.add(m);B.tileMesh[i][j]=m;
    const p=new THREE.Mesh(og,new THREE.MeshBasicMaterial({color:0x5cc2ad,transparent:true,opacity:0,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.copy(W(i,j));p.position.y+=.015;p.userData.cell=[i,j];E.world.add(p);B.ovl[i][j]=p;}}
  B.colMesh=[];for(let i=0;i<N;i++)for(let j=0;j<N;j++)refreshTile(i,j);
  const r=charSprite('ryan'),c=charSprite('claire');B.units.ryan.spr=r;B.units.claire.spr=c;E.world.add(r.holder,c.holder);
  B.enemies.forEach(e=>{e.spr=makeSprite(e.d.frames(),e.d.h,{speed:e.d.speed||1.6,float:e.d.float,kind:e.type});E.world.add(e.spr.holder);});
  if(B.boss){B.mechFrames={tank:[tex(mechCanvas(0,true)),tex(mechCanvas(1,true))],none:[tex(mechCanvas(0,false)),tex(mechCanvas(1,false))]};
    B.cone=new THREE.Mesh(new THREE.CircleGeometry(3.2,24,-.9,1.8),new THREE.MeshBasicMaterial({color:0xd0503f,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));
    B.cone.rotation.x=-Math.PI/2;B.cone.position.y=.03;E.world.add(B.cone);
    B.tankMark=new THREE.Mesh(new THREE.RingGeometry(.25,.36,20),new THREE.MeshBasicMaterial({color:0x7fc4ff,transparent:true,opacity:0,side:THREE.DoubleSide}));
    B.tankMark.rotation.x=-Math.PI/2;B.tankMark.position.y=.04;E.world.add(B.tankMark);}
  B.anchorGroup=new THREE.Group();B.gasGroup=new THREE.Group();E.world.add(B.anchorGroup,B.gasGroup);
  B.selRing=new THREE.Mesh(new THREE.RingGeometry(.32,.4,24),new THREE.MeshBasicMaterial({color:0xc8a456,side:THREE.DoubleSide,transparent:true,opacity:0}));
  B.selRing.rotation.x=-Math.PI/2;B.selRing.position.y=.03;E.world.add(B.selRing);
  E.onTick=battleTick;
}
function refreshTile(i,j){
  const t=B.tiles[i][j];B.tileMesh[i][j].material=tileMat(t);
  const key=i+','+j;if(B.props[key]){E.world.remove(B.props[key]);delete B.props[key];}
  let p=null;
  if(t==='scrap'){p=new THREE.Group();for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.3,.12,.22),texMat('rust',1,1,{metalness:.7}));b.position.set((k-1)*.18,.06+k*.05,(k%2)*.12-.06);b.rotation.y=k;b.castShadow=true;p.add(b);}}
  if(t==='si'){p=new THREE.Group();[[0,0,.3],[.15,.1,.2],[-.14,.08,.18],[.02,.22,.16]].forEach(([x,y,s],q)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),texMat('stone',1,1));b.position.set(x,y+s/2,q*.04-.05);b.rotation.y=q*1.3;b.castShadow=true;p.add(b);});}
  if(t==='oil'){p=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.5,10),texMat('rust',2,1,{color:0xcc6a40}));p.position.y=.25;p.castShadow=true;}
  if(t==='acid'){p=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.42,10),new THREE.MeshStandardMaterial({color:0x7ad840,emissive:0x2a6a10}));p.position.y=.21;}
  if(t==='al'){p=new THREE.Group();[0,1].forEach(k=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.34,.08,.22),new THREE.MeshStandardMaterial({color:0xd4dce0,metalness:.3,roughness:.3,emissive:0x2a3034}));b.position.set(0,.05+k*.08,k*.06);b.rotation.y=k*.6;p.add(b);});}
  if(t==='wall'){p=new THREE.Mesh(new THREE.BoxGeometry(.98,.9,.98),texMat('brick',1,1));p.position.y=.45;p.castShadow=true;}
  refreshCol(i,j);
  if(p){p.position.x+=i-OFF;p.position.z+=j-OFF;p.position.y+=hAt(i,j)*HSTEP;p.traverse(o=>o.userData.cell=[i,j]);E.world.add(p);B.props[key]=p;}
}
function refreshCol(i,j){if(!B.colMesh)B.colMesh=[];const k=i*64+j;if(B.colMesh[k]){E.world.remove(B.colMesh[k]);B.colMesh[k]=null;}
  const h=hAt(i,j),tm=B.tileMesh[i]&&B.tileMesh[i][j];if(tm)tm.position.y=h*HSTEP-.1;const o=B.ovl&&B.ovl[i]&&B.ovl[i][j];if(o)o.position.y=h*HSTEP+.015;
  if(h>0){const c=new THREE.Mesh(new THREE.BoxGeometry(.98,h*HSTEP,.98),texMat(B.cfg.colTex||'rust',1,h));c.position.set(i-OFF,h*HSTEP/2-.2,j-OFF);c.castShadow=true;c.receiveShadow=true;c.userData.cell=[i,j];E.world.add(c);B.colMesh[k]=c;}}
function placeUnits(instant){
  ['ryan','claire'].forEach(k=>{const u=B.units[k],v=W(u.i,u.j);u.target=v;if(instant)u.spr.holder.position.copy(v);u.spr.holder.visible=u.alive;});
  if(B.phase!=='field')B.enemies.forEach(e=>{if(!e.alive)return;e.target=W(e.i,e.j);if(instant)e.spr.holder.position.copy(e.target);});
}
function orderPoly(pts){const c=pts.reduce((a,p)=>({x:a.x+p.x/pts.length,z:a.z+p.z/pts.length}),{x:0,z:0});return pts.sort((a,b)=>Math.atan2(a.z-c.z,a.x-c.x)-Math.atan2(b.z-c.z,b.x-c.x));}
function rebuildAnchors(){
  const G=B.anchorGroup;while(G.children.length)G.remove(G.children[0]);const pts=B.anchors.map(a=>W(a.i,a.j));
  pts.forEach(v=>{const o=new THREE.Mesh(new THREE.OctahedronGeometry(.15),new THREE.MeshBasicMaterial({color:0xffd27a}));o.position.copy(v);o.position.y+=.5;o.userData.base=o.position.y;o.userData.spin=true;
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,1,6),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.55}));beam.position.copy(v);beam.position.y+=.5;G.add(o,beam);});
  const n=pts.length;
  if(n>=2){const col=n===2?0x4fd1e0:n===3?0x4fe08a:0xe0465a,ring=n>=3?orderPoly(pts.slice()):pts.slice();
    const lp=ring.concat(n>=3?[ring[0]]:[]).map(p=>new THREE.Vector3(p.x,p.y+.08,p.z));
    G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lp),new THREE.LineBasicMaterial({color:col})));
    if(n>=3){const sh=new THREE.Shape(ring.map(p=>new THREE.Vector2(p.x,-p.z))),f=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));
      f.rotation.x=-Math.PI/2;f.position.y=.05;G.add(f);}}
  renderDeck();
}
function rebuildGas(){
  const G=B.gasGroup;while(G.children.length)G.remove(G.children[0]);
  B.gas.forEach(k=>{const [i,j]=k.split(',').map(Number),c=W(i,j),g=new THREE.BufferGeometry(),n=26,p=new Float32Array(n*3);
    for(let q=0;q<n;q++){p[q*3]=c.x+(rnd()-.5)*.9;p[q*3+1]=.1+rnd()*.8;p[q*3+2]=c.z+(rnd()-.5)*.9;}g.setAttribute('position',new THREE.BufferAttribute(p,3));
    G.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xc69bff,size:.16,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false})));});
}
let fieldTarget=null;
function battleTick(dt,t){
  if(!B)return;
  B.anchorGroup.children.forEach(o=>{if(o.userData.spin){o.rotation.y+=dt*2;o.position.y=(o.userData.base||.5)+Math.sin(t*3)*.05;}});
  B.gasGroup.children.forEach((o,k)=>{o.rotation.y+=dt*.4;o.material.opacity=.55+Math.sin(t*2+k)*.2;});
  if(TM.water)TM.water.map.offset.x+=dt*.12;
  if(B.phase==='field')return fieldTick(dt);
  const ghost=!!B.mode&&B.mode!=='move'&&B.mode!=='stake';
  ['ryan','claire'].forEach(k=>{const u=B.units[k];u.spr.mat.opacity=ghost?.62:1;if(u.target){const bp=u.spr.holder.position.clone();u.spr.holder.position.lerp(u.target,Math.min(1,dt*9));const sx=scrX(u.spr.holder.position.x-bp.x,u.spr.holder.position.z-bp.z);if(Math.abs(sx)>.002)u.spr.face(sx);}});
  B.enemies.forEach(e=>{if(e.target&&e.alive){const bp=e.spr.holder.position.clone();e.spr.holder.position.lerp(e.target,Math.min(1,dt*6));const sx=scrX(e.spr.holder.position.x-bp.x,e.spr.holder.position.z-bp.z);if(Math.abs(sx)>.002)e.spr.face(sx);}});
  const su=B.units[B.sel];if(su&&su.alive&&B.phase==='player'){B.selRing.material.opacity=.9;B.selRing.position.x=su.spr.holder.position.x;B.selRing.position.z=su.spr.holder.position.z;B.selRing.position.y=su.spr.holder.position.y+.03;}else B.selRing.material.opacity=0;
}
function fieldTick(dt){
  const m=B.boss,c=B.units.claire;
  if(m.wait>0)m.wait-=dt;else{m.x+=m.dir*dt*.9;if(m.x>2.2||m.x<-2.2){m.x=Math.max(-2.2,Math.min(2.2,m.x));m.dir*=-1;m.wait=1.2;}}
  m.spr.holder.position.set(m.x,0,m.z);const face=m.wait>0?-m.dir:m.dir;m.spr.face(face);
  B.cone.position.set(m.x,.03,m.z);B.cone.rotation.z=face>0?0:Math.PI;
  const ch=c.spr.holder.position;
  if(fieldTarget){const d=fieldTarget.clone().sub(ch);d.y=0;const L=d.length();if(L<.05)fieldTarget=null;else{ch.add(d.normalize().multiplyScalar(Math.min(L,dt*2.6)));if(Math.abs(d.x)>.01)c.spr.face(d.x);c.spr.t+=dt*3;}}
  const rel=new THREE.Vector3(ch.x-m.x,0,ch.z-m.z),dist=rel.length(),cos=dist>0?rel.x*face/dist:1;
  if(dist<3.2&&cos>Math.cos(.9)){spotted();return;}
  const can=dist<1.7&&cos<-Math.cos(1.0);
  $('strike').disabled=!can;$('strike').textContent=can?'重擊冷卻水箱！':(dist<1.7?'繞到它背後':'接近機甲背後');
  B.tankMark.position.set(m.x-face*.9,.04,m.z);B.tankMark.material.opacity=can?.9:.35;
}
function snapField(){
  const m=B.boss;m.i=Math.round(m.x+OFF);m.j=Math.round(m.z+OFF);
  const c=B.units.claire,p=c.spr.holder.position;c.i=Math.max(0,Math.min(N-1,Math.round(p.x+OFF)));c.j=Math.max(0,Math.min(N-1,Math.round(p.z+OFF)));
  if(c.i===m.i&&c.j===m.j)c.j=Math.min(N-1,c.j+1);const r=B.units.ryan;if(c.i===r.i&&c.j===r.j)c.i=c.i>0?c.i-1:c.i+1;B.tankMark.material.opacity=0;
}
function spotted(){if(B.phase!=='field')return;B.phase='trans';fieldTarget=null;snapField();banner('被發現了','機甲轉身迎擊・無先攻');log('機甲的感測器捕捉到克蕾雅，沒有取得先攻。');setTimeout(()=>startTactical(false),1400);}
$('strike').onclick=()=>{
  if(!B||B.phase!=='field')return;B.phase='trans';fieldTarget=null;snapField();const m=B.boss;m.stun=1;B.ambush=true;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const i=m.i+a,j=m.j+b;if(inb(i,j)&&B.tiles[i][j]==='floor')B.tiles[i][j]='water';}
  [[m.i-2,m.j],[m.i+2,m.j]].forEach(([i,j])=>{i=Math.max(0,Math.min(N-1,i));if(B.tiles[i][j]!=='floor'&&B.tiles[i][j]!=='water')j=Math.min(N-1,j+1);B.tiles[i][j]='scrap';});
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)refreshTile(i,j);
  m.spr.setFrames(B.mechFrames.none);burst(W(m.i,m.j),0x7fc4ff,40,2.2);E.shake=.8;
  damageEnemy(m,50,{raw:true,quiet:true});floatAt(W(m.i,m.j),'水箱破裂！','#7fc4ff');banner('原野突襲成功','感測器暈眩・地面鋪滿積水');
  log('水箱破裂：機甲暈眩 1 回合，周圍 3×3 化為積水，掉落兩塊廢鐵甲。');setTimeout(()=>startTactical(true),1500);
};
function burst(c,color,n,spd){
  const g=new THREE.BufferGeometry(),p=new Float32Array(n*3),v=[];for(let q=0;q<n;q++){p[q*3]=c.x;p[q*3+1]=.6;p[q*3+2]=c.z;v.push([(rnd()-.5)*spd,rnd()*spd,(rnd()-.5)*spd]);}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color,size:.12,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));E.world.add(pts);
  let life=1.1;E.fxs.push(dt=>{life-=dt;const a=g.attributes.position.array;for(let q=0;q<n;q++){v[q][1]-=dt*4;a[q*3]+=v[q][0]*dt;a[q*3+1]=Math.max(.02,a[q*3+1]+v[q][1]*dt);a[q*3+2]+=v[q][2]*dt;}
    g.attributes.position.needsUpdate=true;pts.material.opacity=Math.max(0,life);if(life<=0){E.world.remove(pts);return false;}});
}
function startBattle(cfg){
  newBattle(cfg);show('battle');E.mode='battle';buildBattleWorld();
  $('env-t').textContent=ENV[cfg.theme][0];$('env-s').textContent=ENV[cfg.theme][1];$('log').innerHTML='';
  if(B.boss)B.boss.spr.holder.position.set(B.boss.x,0,B.boss.z);
  placeUnits(true);
  const nar=innerWidth<600;
  if(N===9)nar?look(0,14,17.5,0,0,0):look(0,9.5,12.5,0,0,0);else nar?look(0,13,16,0,0,-.2):look(0,9.2,11.9,0,0,-.25);
  Object.assign(E.controls,{enabled:true,minAzimuthAngle:-Infinity,maxAzimuthAngle:Infinity,minPolarAngle:.55,maxPolarAngle:1.05,minDistance:8,maxDistance:26});
  setTilt(.5,1.6);updateHud();
  if(cfg.boss){B.phase='field';$('deck').hidden=true;$('field-ctl').hidden=false;B.cone.visible=true;resize();
    guide('原野突襲','點擊地面移動克蕾雅。避開機甲前方的紅色視野，趁它背對妳時繞到背後的藍色圈，按「重擊冷卻水箱」。');banner('第一章','第三蒸氣機庫・原野突襲');}
  else{$('field-ctl').hidden=true;banner(cfg.title,`${cfg.enemies.length} 名敵人`);startTactical(false);}
}
function startTactical(ambush){
  B.phase='player';if(B.cone)B.cone.visible=false;$('field-ctl').hidden=true;$('deck').hidden=false;placeUnits(false);
  B.units.claire.ap=B.units.claire.alive?4+(save.mods.core==='C2'?2:0):0;B.units.ryan.ap=B.units.ryan.alive?4:0;
  if(B.boss)setTimeout(()=>{banner('戰術展開',ambush?'先攻・全隊行動':'第 1 回合');
    guide('第 1 回合',ambush?'萊恩走到廢鐵旁「分解」取得 Fe 並留下錨點；用克蕾雅的定點樁補第三個錨點，把機甲和積水框進三角陣，再發動 #R09。':'機甲沒有暈眩。先用克蕾雅的急凍或打樁機牽制，萊恩去收集資源、留下錨點。');},300);
  else guide(B.cfg.title,B.cfg.guide);
  selectUnit('claire');updateHud();resize();
}
function occupied(i,j,ignore){for(const k of ['ryan','claire']){const u=B.units[k];if(u!==ignore&&u.alive&&u.i===i&&u.j===j)return true;}
  if(B.enemies.some(e=>e!==ignore&&e.alive&&e.i===i&&e.j===j))return true;return B.tiles[i][j]==='wall';}
function reach(u,steps){const out=new Map(),best={[u.i+','+u.j]:0},q=[[u.i,u.j,0]];
  while(q.length){q.sort((a,b)=>a[2]-b[2]);const [i,j,d]=q.shift();if(d>(best[i+','+j]??99))continue;if(d>0)out.set(i+','+j,{i,j,d});
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const ni=i+a,nj=j+b,k=ni+','+nj;if(!inb(ni,nj)||occupied(ni,nj,u))return;const dh=hAt(ni,nj)-hAt(i,j);if(dh>1)return;
      const nd=d+1+(dh>0?1:0);if(nd>steps||nd>=(best[k]??99))return;best[k]=nd;q.push([ni,nj,nd]);});}return out;}
function cellsOfShape(pts){
  if(pts.length===1)return [[pts[0].i,pts[0].j]];
  if(pts.length===2){const [a,b]=pts,out=[],n=Math.max(Math.abs(b.i-a.i),Math.abs(b.j-a.j));
    for(let k=0;k<=n;k++){const i=Math.round(a.i+(b.i-a.i)*k/(n||1)),j=Math.round(a.j+(b.j-a.j)*k/(n||1));if(!out.some(c=>c[0]===i&&c[1]===j))out.push([i,j]);}return out;}
  const poly=orderPoly(pts.map(p=>({x:p.i,z:p.j}))),out=[];for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(inPoly(i,j,poly)||pts.some(p=>p.i===i&&p.j===j))out.push([i,j]);return out;}
function inPoly(x,z,poly){let inside=false;for(let a=0,b=poly.length-1;a<poly.length;b=a++){
  const xi=poly[a].x,zi=poly[a].z,xj=poly[b].x,zj=poly[b].z,cross=(x-xi)*(zj-zi)-(z-zi)*(xj-xi),dot=(x-xi)*(xj-xi)+(z-zi)*(zj-zi),len=(xj-xi)**2+(zj-zi)**2;
  if(Math.abs(cross)<.6*Math.sqrt(len)&&dot>=0&&dot<=len)return true;if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/(zj-zi)+xi))inside=!inside;}return inside;}
function damageEnemy(e,amt,o={}){
  if(!e||!e.alive)return;let d=B.casting?Math.round(amt*B.units.ryan.rec):amt;if(!o.true&&!o.raw&&e.tg>0)d=Math.round(d*.2);
  e.hp=Math.max(0,e.hp-d);if(!o.quiet){floatAt(W(e.i,e.j),'-'+d,o.true?'#ffd27a':'#ff8a7a');e.spr.hop=1;}
  if(o.tg&&e.tgMax){const before=e.tg;e.tg=Math.max(0,e.tg-o.tg);if(!o.quiet&&before>e.tg)floatAt(W(e.i,e.j).add(new THREE.Vector3(.5,.5,0)),'裝甲 -'+(before-e.tg),'#c8a456');
    if(before>0&&e.tg===0){banner('BREAK',e.name+'・外裝甲粉碎');e.stun=Math.max(e.stun,1);log(`${e.name}外裝甲歸零：BREAK，暈眩 1 回合。`);burst(W(e.i,e.j),0xffc860,50,2.6);}}
  updateHud();if(e.hp<=0){e.alive=false;enemyDie(e);}
}
function enemyDie(e){
  const h=e.spr.holder;
  if(e.boss){banner('擊破',e.name);burst(W(e.i,e.j),0xff8a40,90,3.2);E.shake=1.2;}
  else{floatAt(W(e.i,e.j),e.d.nonlethal?'制伏':'擊破','#ffd27a');burst(W(e.i,e.j),e.d.nonlethal?0xbfeae0:0xff8a40,36,2);log(e.d.nonlethal?`${e.name}倒在地上，昏了過去。`:`${e.name}停止運作。`);}
  if(e.d.drop){const [k,v]=e.d.drop;B.loot[k]=(B.loot[k]||0)+v;}
  let k=0;const iv=setInterval(()=>{k++;h.position.y-=.01;h.scale.multiplyScalar(.97);if(k>40){clearInterval(iv);h.visible=false;}},30);
  if(!alive().length&&B.phase!=='done'){B.phase='done';setTimeout(victory,e.boss?2400:1300);}
}
function victory(){
  const U=B.units;['ryan','claire'].forEach(k=>{P[k].hp=U[k].alive?Math.min(P[k].max,U[k].hp):1;});healParty(.15);
  Object.entries(B.pool).forEach(([k,v])=>{if(v)P.stash[k]=Math.min(4,(P.stash[k]||0)+v);});
  Object.entries(B.loot).forEach(([k,v])=>{P.stash[k]=Math.min(6,(P.stash[k]||0)+v);});
  const exp=B.enemies.reduce((a,e)=>a+(EXP_OF[e.type]||0),0),ups=grantExp(exp);
  let drops=[];B.enemies.forEach(e=>drops=drops.concat(rollDrops(e.type)));if(!drops.length&&Math.random()<.5)drops.push('bandage');
  const got=drops.map(addLoot),els=Object.entries(B.loot).map(([k,v])=>ELF[k]+'×'+v);
  const rows=[['經驗值',`EXP +${exp}`]];
  if(ups.length)rows.push(['升級！',ups.join('、')]);
  rows.push(['等級',`萊恩 Lv ${P.lv.ryan.lv}（${P.lv.ryan.exp}/${needExp(P.lv.ryan.lv)}）・克蕾雅 Lv ${P.lv.claire.lv}（${P.lv.claire.exp}/${needExp(P.lv.claire.lv)}）`]);
  if(els.length)rows.push(['回收元素',els.join('、')]);
  rows.push(['戰利品',got.length?got.join('、'):'—']);
  if(got.some(t=>t.includes('新飾品')))rows.push(['提示','新飾品可在地圖上的「背包・整備」裝備。']);
  const f=B.cfg.onWin;banner(B.boss?'擊破':'戰鬥勝利','');
  setTimeout(()=>showResult(B.boss?'第三機庫・制壓完成':'戰鬥勝利',rows,()=>{f&&f();}),B.boss?200:900);
}
function damageUnit(u,amt){if(!u.alive)return;let d=amt;if(u.arm)d=Math.max(5,Math.round(d-u.arm*.5));if(u.key==='claire'&&save.mods.frame==='F3')d=Math.round(d/2);
  u.hp=Math.max(0,u.hp-d);floatAt(u.spr.holder.position.clone(),'-'+d,'#ff8a7a');u.spr.hop=1;if(u.hp===0){u.alive=false;u.spr.holder.visible=false;log(`${u.name}倒下了。`);}renderDeck();}
function floatAt(v,txt,color){const p=v.clone();p.y+=1.7;p.project(E.camera);const d=document.createElement('div');d.className='ftxt';d.textContent=txt;d.style.color=color;
  d.style.left=((p.x+1)/2*innerWidth)+'px';d.style.top=((1-p.y)/2*innerHeight)+'px';$('ftl').appendChild(d);setTimeout(()=>d.remove(),1400);}
function banner(a,b){const e=$('banner');e.innerHTML=a+(b?`<small>${b}</small>`:'');e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function log(t){const d=document.createElement('div');d.textContent=t;$('log').prepend(d);setTimeout(()=>d.remove(),6200);}
function guide(h,t){$('g-head').textContent=h;$('g-text').textContent=t;}
function updateHud(){
  if(!B)return;
  $('epanel').classList.toggle('compact',B.enemies.length>1);
  $('epanel').innerHTML=B.enemies.map(e=>{const tags=[];if(e.alive){if(e.stun)tags.push('暈眩'+e.stun);if(e.root)tags.push('定身'+e.root);if(e.tgMax&&e.tg===0)tags.push('BREAK');
      if([...B.gas].some(k=>{const [i,j]=k.split(',').map(Number);return md(i,j,e.i,e.j)<=1;}))tags.push('氣雲中');}
    return `<div class="erow${e.alive?'':' dead'}"><div class="row"><b>${e.name}</b><span>${e.alive?(B.phase==='field'?'巡邏中':`${tags.length?`<em class="hot">${tags.join(' ')}</em> `:''}(${e.i},${e.j})`):(e.d.nonlethal?'制伏':'擊破')}</span></div>
      <div class="ebars${e.tgMax?'':' one'}"><div class="bar hp"><i style="width:${e.hp/e.max*100}%"></i></div>${e.tgMax?`<div class="bar tg"><i style="width:${e.tg/e.tgMax*100}%"></i></div>`:''}</div>
      <div class="row sm"><span>HP ${e.hp}/${e.max}${e.tgMax?`　裝甲 ${e.tg}/${e.tgMax}${e.tg>0?'（直傷 -80%）':''}`:''}</span><span class="hot">${tags.join(' ')}</span></div></div>`;}).join('');
}
function selectUnit(k){if(!B.units[k].alive)return;B.sel=k;B.mode=null;B.itemMenu=false;clearTargets();renderDeck();}
function renderDeck(){
  if(!B||B.phase==='field')return;const U=B.units;
  $('ucards').innerHTML=['ryan','claire'].map(k=>{const u=U[k],st=[];if(k==='claire'&&u.buff2)st.push('高碳鋼強化');if(k==='claire'&&B.over)st.push('神經超載');if(k==='ryan'&&B.forbidUsed)st.push('灰瞳透支');
    return `<button class="ucard${B.sel===k?' sel':''}${u.alive?'':' dead'}" data-u="${k}"><div class="r1"><b>${u.name}</b><span class="ap">${[0,1,2,3,4,5].slice(0,Math.max(4,u.ap)).map(n=>`<i class="${n<u.ap?'f':''}"></i>`).join('')}</span></div>
      <div class="r1 px" style="font-size:11px;color:var(--mist)"><span>HP ${u.hp}/${u.max}</span><span>移動 ${u.mv} 格</span></div><div class="bar"><i style="width:${u.hp/u.max*100}%"></i></div><div class="st">${st.join(' · ')}</div></button>`;}).join('');
  $('ucards').querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>selectUnit(b.dataset.u));
  $('els').innerHTML=Object.entries(B.pool).map(([k,v])=>`<span class="el${v?'':' zero'}" title="${EL[k]}">${ELF[k]} ×${v}</span>`).join('');
  const n=B.anchors.length;$('anc').innerHTML=`<span>錨點 ${n}/4</span><span class="shape">${n?SHAPE[n]:'—'}</span>${n?'<button class="btn" id="recall" style="padding:3px 8px;font-size:12px">一鍵回收</button>':''}`;
  const rc=$('recall');if(rc)rc.onclick=()=>{B.anchors=[];rebuildAnchors();log('回收全部錨點。');};
  renderActions();
}
function A(label,sub,fn,{dis=false,on=false,cls=''}={}){return{label,sub,fn,dis,on,cls};}
function renderActions(){
  const u=B.units[B.sel],PL=B.phase==='player',list=[];$('acts-h').textContent=`${u.name}的行動`;
  if(u.alive&&PL){
    const mc=(u.key==='claire'&&save.mods.frame==='F2'&&!u.freeMove)?0:1;
    list.push(A('移動',`${mc} AP · ${u.mv} 格`,()=>enterMode('move'),{dis:u.ap<mc,on:B.mode==='move'}));
    if(u.key==='ryan'){
      list.push(A('分解','1 AP · 相鄰資源',()=>enterMode('decompose'),{dis:u.ap<1,on:B.mode==='decompose'}));
      list.push(A('刻下錨點','1 AP · 腳下',()=>{placeAnchor(u.i,u.j);spend(u,1);},{dis:u.ap<1||hasAnchor(u.i,u.j)}));
      list.push(A('音叉敲擊',`1 AP · 相鄰 ${u.tap} 傷`,()=>enterMode('tap'),{dis:u.ap<1,on:B.mode==='tap'}));
      save.equip.forEach(id=>{const r=RBY[id];if(!r)return;const ok=canCast(r);list.push(A(`#${r.id} ${r.name}`,`${SHAPE[r.n]} · ${r.el.map(e=>ELF[e]).join('+')} · ${r.ap} AP`,()=>cast(r),{dis:!ok,cls:'rc'+(ok?' ready':'')}));});
      list.push(A('禁忌：超載逆構','#R15 · 0 AP · 320 真實傷＋BREAK',()=>forbid(),{dis:B.forbidUsed,cls:'forbid'}));
    }else{
      list.push(A('鐵拳','1 AP · 相鄰',()=>enterMode('punch'),{dis:u.ap<1,on:B.mode==='punch'}));
      const w=save.mods.weapon,ut=save.mods.util,co=save.mods.core;
      if(w==='W1')list.push(A('震盪重錘','1 AP · 削甲 35＋擊退',()=>enterMode('pile'),{dis:u.ap<1,on:B.mode==='pile'}));
      if(w==='W2')list.push(A('打火石點火','1 AP · 射程 4 · 引爆氣雲',()=>enterMode('gun'),{dis:u.ap<1,on:B.mode==='gun'}));
      if(w==='W3')list.push(A('解剖斬擊','1 AP · 對定身／破甲必暴擊',()=>enterMode('blade'),{dis:u.ap<1,on:B.mode==='blade'}));
      if(ut==='U1')list.push(A('遠程釘樁','1 AP · 4 格內錨點',()=>enterMode('stake'),{dis:u.ap<1,on:B.mode==='stake'}));
      if(ut==='U2')list.push(A('隔空取物','1 AP · 吸取 4 格內資源',()=>magnet(),{dis:u.ap<1}));
      if(ut==='U3')list.push(A('瞬間急凍','1 AP · 相鄰定身＋產水',()=>enterMode('freeze'),{dis:u.ap<1,on:B.mode==='freeze'}));
      if(co==='C1')list.push(A('蒸氣洩壓','0 AP · 全隊回復 30',()=>vent(),{dis:u.ventUsed}));
    }
  }
  if(u.alive&&PL){const tot=Object.values(P.items).reduce((a,b)=>a+b,0);
    list.push(A('道具',`背包 ${tot} 件`,()=>{B.itemMenu=!B.itemMenu;B.mode=null;clearTargets();renderDeck();},{dis:!tot,on:B.itemMenu,cls:'item'}));
    if(B.itemMenu)Object.entries(ITEMS).forEach(([id,it])=>{const n=P.items[id]||0;if(!n)return;
      list.push(A(`${it.name} ×${n}`,`${it.ap} AP · ${it.desc}`,()=>{if(u.ap<it.ap)return;useItem(id,u);u.ap-=it.ap;B.itemMenu=false;
        floatAt(u.spr.holder.position.clone(),it.name,'#7fe0b0');log(`${u.name}使用了${it.name}。`);renderDeck();},{dis:u.ap<it.ap,cls:'itm'}));});}
  if(PL&&B.cfg.explore)list.push(A('撤退','70% 成功 · 失敗則結束回合',()=>tryEscape(),{cls:'flee'}));
  if(PL)list.push(A('結束回合','敵方行動',()=>endTurn(),{cls:'end'}));
  const box=$('abtns');box.innerHTML='';list.forEach(a=>{const b=document.createElement('button');b.className='ab '+a.cls+(a.on?' on':'');b.disabled=a.dis;b.innerHTML=`${a.label}<small>${a.sub}</small>`;b.onclick=a.fn;box.appendChild(b);});
}
const hasAnchor=(i,j)=>B.anchors.some(a=>a.i===i&&a.j===j);
function placeAnchor(i,j){if(B.anchors.length>=4)B.anchors.shift();if(!hasAnchor(i,j))B.anchors.push({i,j});rebuildAnchors();floatAt(W(i,j),'錨點','#ffd27a');}
function spend(u,n){u.ap=Math.max(0,u.ap-n);if(u.key==='claire'&&B.over&&n>0)damageUnit(u,10);renderDeck();}
function payPlan(r){const need={};r.el.forEach(e=>need[e]=(need[e]||0)+1);const cells=r.n>=3?cellsOfShape(B.anchors.slice(-r.n)):[],plan={};
  for(const [e,n] of Object.entries(need)){const fp=Math.min(n,B.pool[e]||0);let rest=n-fp;if(rest>0){const on=cells.filter(([i,j])=>TILE_EL[B.tiles[i][j]]===e).length;if(on>=rest)rest=0;}if(rest>0)return null;plan[e]=fp;}return plan;}
function canCast(r){const u=B.units.ryan;if(!u.alive||u.ap<r.ap||B.anchors.length<r.n||r.ch>CHAPTER)return false;return payPlan(r)!==null;}
function clearTargets(){if(!B||!B.ovl)return;B.targets=new Map();for(let i=0;i<N;i++)for(let j=0;j<N;j++)B.ovl[i][j].material.opacity=0;}
function setTargets(cells,color){clearTargets();cells.forEach(([i,j])=>{B.targets.set(i+','+j,true);const m=B.ovl[i][j].material;m.color.setHex(color);m.opacity=.5;});}
function enterMode(mode){
  const u=B.units[B.sel];if(B.mode===mode){B.mode=null;clearTargets();renderDeck();return;}B.mode=mode;let cells=[];
  if(mode==='move'){cells=[...reach(u,u.mv).values()].map(c=>[c.i,c.j]);setTargets(cells,0x5cc2ad);}
  if(mode==='decompose'){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const i=u.i+a,j=u.j+b;if(inb(i,j)&&Math.abs(a)+Math.abs(b)<=1&&TILE_EL[B.tiles[i][j]])cells.push([i,j]);}
    setTargets(cells,0xe8892b);if(!cells.length){log('萊恩身邊沒有可分解的資源，先走到廢鐵、碎石、油桶或積水旁。');B.mode=null;}}
  if(['punch','pile','blade','freeze','tap'].includes(mode)){let hi=false;alive().forEach(e=>{if(md(u.i,u.j,e.i,e.j)===1){if(Math.abs(hAt(u.i,u.j)-hAt(e.i,e.j))<=1)cells.push([e.i,e.j]);else hi=true;}});setTargets(cells,0xd0503f);if(!cells.length){log(hi?'高低差超過 1 層，打不到。用 #R16 升起岩柱墊高，或從遠處攻擊。':'要先走到敵人旁邊（相鄰一格）。');B.mode=null;}}
  if(mode==='gun'){alive().forEach(e=>{if(md(u.i,u.j,e.i,e.j)<=4)cells.push([e.i,e.j]);});B.gas.forEach(k=>{const [i,j]=k.split(',').map(Number);if(md(u.i,u.j,i,j)<=4)cells.push([i,j]);});setTargets(cells,0xe8892b);
    if(!cells.length){log('射程 4 格內沒有目標。');B.mode=null;}}
  if(mode==='stake'){for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(md(u.i,u.j,i,j)<=4&&!hasAnchor(i,j)&&B.tiles[i][j]!=='wall'&&!enemyAt(i,j))cells.push([i,j]);setTargets(cells,0xffd27a);}
  renderDeck();
}
function onCanvasClick(e){
  E.mouse.set((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);E.ray.setFromCamera(E.mouse,E.camera);
  if(E.mode==='explore'&&!$('explore').hidden&&X.lead){
    const h=E.ray.intersectObjects(E.world.children,true).find(h=>h.object.type==='Mesh'&&h.point.y<.6);
    if(h){X.target=new THREE.Vector3(h.point.x,0,h.point.z);}return;}
  if(E.mode!=='battle'||!B)return;
  const hits=E.ray.intersectObjects(E.world.children,true).filter(h=>h.object.userData.cell);
  if(B.phase==='field'){const h=hits[0];if(h){const p=h.point;fieldTarget=new THREE.Vector3(Math.max(-OFF,Math.min(OFF,p.x)),0,Math.max(-OFF,Math.min(OFF,p.z)));}return;}
  if(B.phase!=='player')return;
  let cell=null;for(const en of alive()){if(E.ray.intersectObject(en.spr.holder,true).length){cell=[en.i,en.j];break;}}
  if(!cell)for(const k of ['ryan','claire']){const u=B.units[k];if(u.alive&&E.ray.intersectObject(u.spr.holder,true).length){if(!B.mode){selectUnit(k);return;}cell=[u.i,u.j];}}
  if(!cell&&hits[0])cell=hits[0].object.userData.cell;if(!cell)return;
  if(!B.mode){for(const k of ['ryan','claire']){const u=B.units[k];if(u.alive&&u.i===cell[0]&&u.j===cell[1]){selectUnit(k);return;}}return;}
  if(!B.targets.has(cell[0]+','+cell[1]))return;doAction(B.mode,cell[0],cell[1]);
}
function doAction(mode,i,j){
  const u=B.units[B.sel],e=enemyAt(i,j),bi=u.i,bj=u.j,ebi=e?e.i:0,ebj=e?e.j:0;B.mode=null;clearTargets();const mult=(save.mods.core==='C3'?1.5:1)*(B.over?1.3:1)*(u.buff2?2:1);
  if(mode==='move'){const cost=(u.key==='claire'&&save.mods.frame==='F2'&&!u.freeMove)?0:1;if(cost===0)u.freeMove=true;u.i=i;u.j=j;placeUnits(false);u.ap-=cost;}
  if(mode==='decompose'){const t=B.tiles[i][j],gain={scrap:['Fe',2],si:['Si',2],oil:['C',2],acid:['Acid',2],al:['Al',1],water:['H2O',1],ice:['H2O',2]}[t];
    B.pool[gain[0]]+=gain[1];B.tiles[i][j]='floor';refreshTile(i,j);burst(W(i,j),0xbfeae0,24,1.4);floatAt(W(i,j),`+${ELF[gain[0]]}×${gain[1]}`,'#bfeae0');placeAnchor(i,j);spend(u,1);
    log(`萊恩分解${{scrap:'廢鐵',si:'碎石堆',oil:'油桶',acid:'強酸罐',al:'鋁合金件',water:'積水',ice:'冰面'}[t]}，取得 ${ELF[gain[0]]}×${gain[1]}，原地刻下錨點。`);}
  if(mode==='tap'&&e){u.spr.hop=1;damageEnemy(e,u.tap||30,{tg:10});spend(u,1);}
  if(mode==='punch'&&e){u.spr.hop=1;damageEnemy(e,Math.round(u.atk*mult),{tg:Math.round(20*(u.buff2?2:1))});u.buff2=false;spend(u,1);}
  if(mode==='pile'&&e){u.spr.hop=1;damageEnemy(e,Math.round(u.atk*mult),{tg:Math.round(35*(u.buff2?2:1))});u.buff2=false;
    const di=Math.sign(e.i-u.i),dj=Math.sign(e.j-u.j),ni=e.i+di,nj=e.j+dj;if(e.alive&&inb(ni,nj)&&!occupied(ni,nj,e)){e.i=ni;e.j=nj;placeUnits(false);floatAt(W(ni,nj),'擊退','#c8a456');}spend(u,1);}
  if(mode==='blade'&&e){u.spr.hop=1;const c=(e.root||e.stun||(e.tgMax&&e.tg===0))?2:1;damageEnemy(e,Math.round(u.atk*mult*c),{tg:Math.round(15*(u.buff2?2:1))});if(c>1)floatAt(W(i,j),'暴擊','#ffd27a');
    if(e.tgMax){B.pool.Fe+=1;log('解剖斬擊從裝甲上削落 Fe×1。');}u.buff2=false;spend(u,1);}
  if(mode==='freeze'&&e){e.root=Math.max(e.root,1);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const x=e.i+a,y=e.j+b;if(inb(x,y)&&B.tiles[x][y]==='floor'){B.tiles[x][y]='water';refreshTile(x,y);}}
    burst(W(e.i,e.j),0xd8f4ff,50,1.8);floatAt(W(e.i,e.j),'急凍定身','#9fd4ff');log(`液態氮急凍：${e.name}定身 1 回合，周圍化為融水。`);spend(u,1);}
  if(mode==='stake'){placeAnchor(i,j);spend(u,1);}
  if(mode==='gun'){u.spr.hop=1;if(B.gas.has(i+','+j))ignite('克蕾雅的火銃');else if(e)damageEnemy(e,Math.round(u.atk*.8*mult),{tg:10});spend(u,1);}
  if(typeof CH2DO==='function')CH2DO(mode,u,e,bi,bj,ebi,ebj,i,j);
  updateHud();renderDeck();afterAct();
}
function afterAct(){const U=B.units;if(!U.ryan.alive&&!U.claire.alive)return defeat();if(alive().length&&U.ryan.ap===0&&U.claire.ap===0)guide('回合結束','兩人的 AP 都用完了，按「結束回合」。');}
function ignite(src){
  if(!B.gas.size)return;const cells=[...B.gas].map(k=>k.split(',').map(Number));log(`${src}點燃了氫氧氣雲！`);banner('氫氧氣爆','2H₂ + O₂ → 2H₂O');
  cells.forEach(([i,j])=>burst(W(i,j),0xffb060,24,3));E.shake=1.4;
  const c0=cells[0],fl=new THREE.PointLight(0xffa040,8,12);fl.position.copy(W(c0[0],c0[1]));fl.position.y=1;E.world.add(fl);let life=.8;E.fxs.push(dt=>{life-=dt;fl.intensity=Math.max(0,life*10);if(life<=0){E.world.remove(fl);return false;}});
  enemiesNear(cells,1).forEach(e=>damageEnemy(e,380,{true:true,tg:100}));
  ['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive&&cells.some(([i,j])=>i===u.i&&j===u.j))damageUnit(u,60);});
  B.gas.clear();rebuildGas();updateHud();
}
function magnet(){const u=B.units.claire,got=[];
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(md(u.i,u.j,i,j)<=4){const t=B.tiles[i][j];if(t==='scrap'){B.pool.Fe+=2;got.push('Fe×2');B.tiles[i][j]='floor';refreshTile(i,j);}if(t==='si'){B.pool.Si+=2;got.push('Si×2');B.tiles[i][j]='floor';refreshTile(i,j);}}
  placeAnchor(u.i,u.j);log(got.length?`電磁吸盤收回 ${got.join('、')}。`:'4 格內沒有廢鐵或碎石。');spend(u,1);}
function vent(){const c=B.units.claire;c.ventUsed=true;['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive){u.hp=Math.min(u.max,u.hp+30);floatAt(u.spr.holder.position.clone(),'+30','#7fe0b0');}});burst(c.spr.holder.position,0xffffff,40,1.2);renderDeck();}
function forbid(){
  const r=B.units.ryan;if(!r.alive||B.forbidUsed)return;const tgt=B.boss&&B.boss.alive?B.boss:alive().sort((a,b)=>b.hp-a.hp)[0];if(!tgt)return;B.forbidUsed=true;
  document.body.classList.add('grey');banner('超載逆構','灰瞳迴路透支');log('禁忌發動：萊恩 HP 上限 -25%，神經負荷上限降到 75。');
  r.max=Math.round(r.max*.75);r.hp=Math.min(r.hp,r.max);
  setTimeout(()=>{document.body.classList.remove('grey');burst(W(tgt.i,tgt.j),0xe9e3d4,80,3);damageEnemy(tgt,320,{true:true,tg:100});renderDeck();},900);
  save.cap=75;persist();
}
function cast(r){
  if(!canCast(r))return;const u=B.units.ryan,pts=B.anchors.slice(-r.n),cells=cellsOfShape(pts);
  Object.entries(payPlan(r)).forEach(([e,n])=>B.pool[e]-=n);u.ap-=r.ap;u.spr.hop=1;
  B.anchors=B.anchors.slice(0,B.anchors.length-r.n);rebuildAnchors();
  cells.forEach(([i,j])=>{const o=B.ovl[i][j].material;o.color.setHex(0xffd27a);o.opacity=.65;});setTimeout(clearTargets,700);
  let msg='';const inC=enemiesIn(cells),none=t=>`${t}內沒有敵人。`;B.casting=true;
  switch(r.id){
    case'R01':{const t=nearestTo(pts,3);if(t){damageEnemy(t,75,{tg:20});msg=`石英矛刺中${t.name}。`;}else msg='錨點 3 格內沒有目標。';break;}
    case'R02':B.units.claire.buff2=true;msg='克蕾雅的下一擊強化為高碳鋼重刃。';break;
    case'R03':['ryan','claire'].forEach(k=>{const x=B.units[k];if(x.alive)x.hp=Math.min(x.max,x.hp+50);});msg='蒸氣煙幕：全隊回復 50 HP。';break;
    case'R04':{const t=nearestTo(pts,3);if(t){damageEnemy(t,45,{tg:65});msg=`強酸飛沫腐蝕${t.name}的外裝甲。`;}else msg='錨點 3 格內沒有目標。';break;}
    case'R05':cells.forEach(([i,j])=>{if(!occupied(i,j)&&B.tiles[i][j]!=='wall'){B.tiles[i][j]='wall';refreshTile(i,j);}});msg='石牆拔地而起，擋住敵人的去路與砲擊。';break;
    case'R06':{const hit=enemiesNear(cells,1);hit.forEach(e=>{damageEnemy(e,95,{tg:15});if(e.alive)e.stun=Math.max(e.stun,1);burst(W(e.i,e.j),0x8ad8ff,30,2);});msg=hit.length?`電弧鐵絲網麻痺 ${hit.length} 名敵人 1 回合。`:'電網沒有碰到敵人。';break;}
    case'R07':cells.forEach(([i,j])=>burst(W(i,j),0xff7a30,12,1.6));inC.forEach(e=>damageEnemy(e,110,{tg:10}));if([...B.gas].some(k=>cells.some(c=>c.join()===k)))ignite('火牆');msg=`凝固汽油火牆燃起${inC.length?`，燒到 ${inC.length} 名敵人`:''}。`;break;
    case'R08':inC.forEach(e=>{damageEnemy(e,80,{tg:20});e.root=Math.max(e.root,2);});msg=inC.length?`黑鐵鎖鏈破土而出，${inC.length} 名敵人定身 2 回合。`:none('三角陣');break;
    case'R09':{let n=0;cells.forEach(([i,j])=>{if(B.tiles[i][j]==='water'){B.tiles[i][j]='floor';refreshTile(i,j);B.gas.add(i+','+j);n++;}});
      if(n){rebuildGas();inC.forEach(e=>e.root=Math.max(e.root,1));msg=`陣內 ${n} 格積水電解為氫氧氣雲。用火銃或火牆引爆它！`;guide('引爆','切到克蕾雅，用「打火石點火」射擊紫色氣雲，或用 #R07 火牆。');}else msg='三角陣內沒有積水，電解失敗。';break;}
    case'R10':inC.forEach(e=>{burst(W(e.i,e.j),0xffe0a0,60,2.4);damageEnemy(e,60,{true:true,tg:100});});msg=inC.length?'鋁熱反應 2500°C：外裝甲蒸發。':none('三角陣');break;
    case'R11':inC.forEach(e=>{damageEnemy(e,20,{tg:50});e.root=Math.max(e.root,2);});msg=inC.length?'地面液化成流沙，敵人陷入定身。':none('三角陣');break;
    case'R12':inC.forEach(e=>{burst(W(e.i,e.j),0x9ad840,50,1.6);damageEnemy(e,160,{true:true});});msg=inC.length?'王水毒霧腐蝕陣內的敵人。':none('三角陣');break;
    case'R13':['ryan','claire'].forEach(k=>{const x=B.units[k];if(x.alive)x.hp=x.max;});msg='法拉第穹頂：全隊回滿 HP。';break;
    case'R14':inC.forEach(e=>damageEnemy(e,240,{true:true}));msg=inC.length?'真空內爆。':none('四方陣');break;
    case'R16':{const [ci,cj]=cells[0];const h0=hAt(ci,cj);if(h0>=2){msg='這裡已經升到最高了。';break;}B.hgt[ci][cj]=h0+1;if(B.tiles[ci][cj]==='ice'||B.tiles[ci][cj]==='water'){B.tiles[ci][cj]='floor';}refreshTile(ci,cj);
      burst(W(ci,cj),0xc8b48a,40,2);E.shake=.5;placeUnits(false);const on=enemyAt(ci,cj)||['ryan','claire'].map(k=>B.units[k]).find(x=>x.alive&&x.i===ci&&x.j===cj);
      msg=on?`岩柱把${on.name}頂上 ${h0+1} 層高台。`:`地面隆起成 ${h0+1} 層高的岩柱。`;break;}
    case'R17':{inC.forEach(e=>{burst(W(e.i,e.j),0xbff4ff,46,2.2);damageEnemy(e,185,{tg:30});});['ryan','claire'].forEach(k=>{const x=B.units[k];if(x.alive)x.shield=1;});
      msg=(inC.length?`冰晶稜鏡折射出 ${inC.length} 道光束。`:'稜鏡陣內沒有敵人，')+'全隊獲得反射護盾（下一次受到的傷害減半並反彈）。';break;}
  }
  if(typeof CH2CAST==='function')CH2CAST(r,cells,inC);
  B.casting=false;banner(`#${r.id}`,r.name);log(msg);updateHud();renderDeck();afterAct();
}
async function endTurn(){
  if(B.phase!=='player')return;B.phase='enemy';B.mode=null;clearTargets();renderDeck();banner('敵方回合');await sleep(800);
  for(const e of B.enemies){if(!e.alive||B.phase==='done')continue;await enemyAct(e);if(e.root>0)e.root--;updateHud();
    const U=B.units;if(!U.ryan.alive&&!U.claire.alive)return defeat();}
  if(B.phase==='done'||!alive().length)return;
  const U=B.units;B.turn++;B.phase='player';U.ryan.ap=U.ryan.alive?4:0;U.claire.ap=U.claire.alive?4+(B.turn===1&&save.mods.core==='C2'?2:0):0;U.claire.freeMove=false;U.claire.ventUsed=false;
  if(!U[B.sel].alive)B.sel=U.ryan.alive?'ryan':'claire';banner(`第 ${B.turn} 回合`);
  guide(`第 ${B.turn} 回合`,B.gas.size?'氣雲還在場上，克蕾雅的火銃射程 4 格，點燃它。':B.anchors.length?'巡邏犬和機甲會衝去踩碎錨點，盡量在同一回合連線發動。':
    B.boss?'定身後的機甲踩不到錨點。先用 #R08 或急凍把它固定，再慢慢佈陣。':'敵人聚在一起時，#R06 電網或 #R08 鐵枷能一次控制好幾隻。');
  updateHud();renderDeck();
}
async function enemyAct(e){
  if(e.stun>0){e.stun--;floatAt(W(e.i,e.j),'暈眩中','#c8a456');await sleep(450);return;}
  if(!e.root){
    let stomped=false;
    if(e.d.smart&&B.anchors.length){const r=reach(e,e.d.mv);let best=null;B.anchors.forEach(a=>{const c=r.get(a.i+','+a.j);if(c&&(!best||c.d<best.d))best=c;});
      if(best){e.i=best.i;e.j=best.j;placeUnits(false);await sleep(450);B.anchors=B.anchors.filter(a=>!(a.i===best.i&&a.j===best.j));rebuildAnchors();
        floatAt(W(e.i,e.j),'踩碎錨點','#d0503f');E.shake=.4;log(`${e.name}察覺陣法，衝過去踩碎了一枚錨點。`);stomped=true;await sleep(350);}}
    if(!stomped)await approach(e);
  }
  const U=['ryan','claire'].map(k=>B.units[k]).filter(u=>u.alive);if(!U.length)return;
  const adj=U.find(u=>md(u.i,u.j,e.i,e.j)===1&&Math.abs(hAt(u.i,u.j)-hAt(e.i,e.j))<=1),v=VERB[e.type];
  if(adj){await animAttack(e.spr,adj.spr.holder.position,{lunge:e.boss?.35:.5,heavy:e.boss},()=>{vfxEnemy(e,adj,true);E.shake=e.boss?.6:.25;damageUnit(adj,e.d.atk);});log(`${e.name}${v[0]}${adj.name}。`);}
  else if(e.d.rng){const tgt=U.filter(u=>md(u.i,u.j,e.i,e.j)<=e.d.rng).sort((a,b)=>md(a.i,a.j,e.i,e.j)-md(b.i,b.j,e.i,e.j))[0];
    if(tgt){if(lineBlocked(e,tgt)){log(`${e.name}的攻擊被石牆擋下。`);floatAt(W(e.i,e.j),'被擋下','#9aa3b5');}
      else{await animAttack(e.spr,tgt.spr.holder.position,{ranged:true},()=>{vfxEnemy(e,tgt,false);burst(tgt.spr.holder.position,e.type==='sweeper'?0x9ad840:0xeeeeee,24,1.4);damageUnit(tgt,e.d.ratk);});log(`${e.name}${v[1]} ${tgt.name}。`);}}}
  await sleep(380);
}
async function approach(m){const U=['ryan','claire'].map(k=>B.units[k]).filter(u=>u.alive);if(!U.length)return;const r=reach(m,m.d.mv);let best=null;
  r.forEach(c=>{const d=Math.min(...U.map(u=>md(u.i,u.j,c.i,c.j)));if(d>=1&&(!best||d<best.dd||(d===best.dd&&c.d<best.d)))best={...c,dd:d};});
  const cur=Math.min(...U.map(u=>md(u.i,u.j,m.i,m.j)));if(best&&best.dd<cur){m.i=best.i;m.j=best.j;placeUnits(false);await sleep(420);}}
function tryEscape(){
  if(B.phase!=='player')return;
  if(Math.random()<.7){B.phase='done';const U=B.units;['ryan','claire'].forEach(k=>{P[k].hp=U[k].alive?Math.min(P[k].max,U[k].hp):1;});P.stash=Object.assign({},B.snap.stash);
    banner('撤退成功','沒有經驗值與戰利品');sfx('enc');setTimeout(()=>resumeMap(),1100);}
  else{log('撤退失敗：敵人擋住了退路。');floatAt(B.units[B.sel].spr.holder.position.clone(),'撤退失敗','#d0503f');endTurn();}
}
function lineBlocked(a,b){return cellsOfShape([{i:a.i,j:a.j},{i:b.i,j:b.j}]).some(([i,j])=>B.tiles[i][j]==='wall');}
function defeat(){
  if(B.phase==='lost')return;B.phase='lost';const cfg=B.cfg,snap=B.snap;
  const restore=()=>{P.ryan.hp=snap.ryan;P.claire.hp=snap.claire;P.stash=Object.assign({},snap.stash);P.items=Object.assign({},snap.items);};
  const tip=cfg.boss?'重裝機甲還站在機庫中央。換一套配裝再試一次：#R08 鐵枷能先把它定住，石牆可以擋下蒸氣砲。':
    cfg.explore?'被圍住了。可以重新挑戰，或撤回最近的暖爐休息，整理好配裝再出發。':'換個站位再試一次：先讓克蕾雅擋在前面，萊恩在後方分解資源。';
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><h3>小隊潰滅</h3><p>${tip}</p>
   <div class="row"><button class="btn primary" id="ov-retry">重新挑戰</button>${cfg.explore?'<button class="btn" id="ov-rest">撤回休息點</button>':cfg.boss?'<button class="btn" id="ov-base">回整備基地</button>':''}</div></div></div>`;
  $('ov-retry').onclick=()=>{$('ov').innerHTML='';restore();startBattle(cfg);};
  const rs=$('ov-rest');if(rs)rs.onclick=()=>{$('ov').innerHTML='';restore();healParty(1);enterMap(X.id,{pos:X.M.rest});toast('你們退回暖爐旁，喘了口氣。HP 全滿。');};
  const bs=$('ov-base');if(bs)bs.onclick=()=>{$('ov').innerHTML='';restore();openBase(()=>startBattle(cfg),'再次出擊');};
}

$('cam-l').onclick=()=>rotCam(-1);$('cam-r').onclick=()=>rotCam(1);
$('cam-0').onclick=()=>{if(!B)return;const nar=innerWidth<600;if(N===9)nar?look(0,14,17.5,0,0,0):look(0,9.5,12.5,0,0,0);else nar?look(0,13,16,0,0,-.2):look(0,9.2,11.9,0,0,-.25);};
document.addEventListener('keydown',e=>{if($('battle').hidden||!B)return;if(e.key==='q'||e.key==='Q')rotCam(-1);if(e.key==='e'||e.key==='E')rotCam(1);});
/* ======================= CHAPTER FLOW ======================= */
function chapterEnd(){
  save.cleared=true;persist();show('title');
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><span class="t-eyebrow">CHAPTER 1 COMPLETE</span><h3>第一章　完</h3>
   <p>五百名礦工的記憶回到了他們身上。音叉浮現的駐波刻度，指向北方的極寒要塞「白銀之顎」。</p>
   <p class="note">第二章（高低差、滑冰與凍僵）製作中。#R16、#R17 將在第二章解鎖。</p>
   <div class="row"><button class="btn primary" id="ce-t">回到標題</button><button class="btn" id="ce-b">再戰機庫</button></div></div></div>`;
  $('ce-t').onclick=()=>{$('ov').innerHTML='';};$('ce-b').onclick=()=>{$('ov').innerHTML='';resetParty();openBase(bossFight,'出擊：第三蒸氣機庫');};
}
const afterBattle=()=>playScene(SCENES.ch1b,()=>playScene(SCENES.epilogue,chapterEnd));
const bossFight=()=>startBattle(battleBoss(afterBattle));
function toBoss(){playScene(SCENES.hangar,()=>{healParty(1);openBase(bossFight,'出擊：第三蒸氣機庫');});}
function newGame(){resetParty();
  playScene(SCENES.prologue,()=>startBattle(battleTrain(()=>playScene(SCENES.trainOut,()=>enterMap('town')))));}
$('m-new').onclick=newGame;
$('m-base').onclick=()=>{resetParty();openBase(bossFight,'出擊：第三蒸氣機庫');};
$('m-battle').onclick=()=>{resetParty();bossFight();};
initEngine();show('title');
