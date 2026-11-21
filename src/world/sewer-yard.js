/* ======================= FREE MAPS: SEWER & FREIGHT YARD ======================= */
/* extra 32px textures */
{const o=T2;T2=function(kind){if(TEX2[kind])return TEX2[kind];
  if(!['flag','concrete','gravel','container','chain'].includes(kind))return o(kind);
  const N=32,c=cvs(N,N),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};let s=29;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const noise=(base,cols,n)=>{P(base,0,0,N,N);for(let k=0;k<n;k++)P(cols[(r()*cols.length)|0],(r()*N)|0,(r()*N)|0,1+(r()*2|0),1);};
  if(kind==='flag'){P('#1c201c',0,0,N,N);[[0,0,15,15],[16,0,16,10],[16,11,16,10],[0,16,10,16],[11,16,10,16],[16,22,16,10]].forEach(([x,y,w,h])=>{P('#353c34',x+1,y+1,w-1,h-1);P('#3f473e',x+1,y+1,w-2,1);for(let k=0;k<5;k++)P('#2c322b',x+1+(r()*(w-2)|0),y+1+(r()*(h-2)|0),2,1);});
    for(let k=0;k<6;k++)P('#3a5a2a',(r()*N)|0,(r()*N)|0,1,1);}
  if(kind==='concrete'){noise('#4a4a4c',['#525254','#424244','#58585a','#3e3e40'],240);P('#343436',0,0,N,1);P('#343436',0,0,1,N);for(let k=0;k<3;k++)P('#2e2e30',(r()*N)|0,(r()*N)|0,4,1);}
  if(kind==='gravel'){noise('#3a3632',['#4a4440','#2e2a26','#56504a','#3e3a36'],380);}
  if(kind==='container'){P('#5a2a1e',0,0,N,N);for(let x=0;x<N;x+=4){P('#6e3424',x,0,2,N);P('#7e4030',x,0,1,N);}P('#3a1a12',0,0,N,1);P('#3a1a12',0,N-1,N,1);}
  if(kind==='chain'){g.clearRect(0,0,N,N);g.strokeStyle='#8a9098';for(let k=-N;k<N*2;k+=6){g.beginPath();g.moveTo(k,0);g.lineTo(k+N,N);g.stroke();g.beginPath();g.moveTo(k+N,0);g.lineTo(k,N);g.stroke();}}
  const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return TEX2[kind]=t;};}
/* builder helpers (they record colliders + occluders while building) */
const FB={};
function fbReset(){FB.box=[];FB.circ=[];FB.occ=[];FB.mm=[];}
function fbWall(x0,z0,x1,z1,h,mat,{occ=true,col=true,mm='#5a6070'}={}){const w=x1-x0,d=z1-z0,m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set((x0+x1)/2,h/2,(z0+z1)/2);
  m.castShadow=true;m.receiveShadow=true;E.world.add(m);if(col)FB.box.push([x0,z0,x1,z1]);if(occ)FB.occ.push({meshes:[m],box:new THREE.Box3(new THREE.Vector3(x0-.2,0,z0-.2),new THREE.Vector3(x1+.2,h,z1+.2)),f:1});if(mm)FB.mm.push([x0,z0,x1,z1,mm]);return m;}
function fbFloor(x0,z0,x1,z1,k,rep=2.4,y=0,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),mat2(k,(x1-x0)/rep,(z1-z0)/rep,o));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,y,(z0+z1)/2);m.receiveShadow=true;E.world.add(m);return m;}
function fbHalo(x,z,r,col=0xffa850,op=.42){const m=new THREE.Mesh(new THREE.PlaneGeometry(r*2,r*2).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:haloTex(),color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(x,.04,z);E.world.add(m);return m;}
function fbLamp(x,z,y=2.2,col=0xffd27a){const b=new THREE.Mesh(new THREE.BoxGeometry(.26,.34,.26),new THREE.MeshBasicMaterial({color:col}));b.position.set(x,y,z);E.world.add(b);fbHalo(x,z,2.2,col===0xffd27a?0xffa850:col);}
function fbPipe(x0,z0,x1,z1,y,r=.16,col=0x5a5048){const L=Math.hypot(x1-x0,z1-z0),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,8),new THREE.MeshStandardMaterial({color:col,metalness:.6,roughness:.5}));
  m.position.set((x0+x1)/2,y,(z0+z1)/2);m.rotation.z=Math.PI/2;m.rotation.y=-Math.atan2(z1-z0,x1-x0);m.castShadow=true;E.world.add(m);return m;}
function fbBox(x,z,w,d,h,mat,{rot=0,col=true}={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,h/2,z);m.rotation.y=rot;m.castShadow=true;m.receiveShadow=true;E.world.add(m);if(col)FB.box.push([x-w/2,z-d/2,x+w/2,z+d/2]);return m;}
function fbBarrel(x,z,col=0x5a4030,emis=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.9,10),new THREE.MeshStandardMaterial({color:col,metalness:.4,roughness:.6,emissive:emis}));m.position.set(x,.45,z);m.castShadow=true;E.world.add(m);FB.circ.push([x,z,.38]);return m;}
/* generic free-map build (party, events, lights, rain/drips) */
function buildFree(M){
  clearWorld();fbReset();X.bld=[];X.amb=[];X.trail=[];
  M.build(M);
  X.bld=FB.occ;X.colCache={box:FB.box.slice(),circ:FB.circ.slice()};
  X.sun=keyLight(M.sunCol||0xa8c0ff,M.sunInt||.45,[0,12,0],null);const sc=X.sun.shadow.camera;sc.left=-16;sc.right=16;sc.top=16;sc.bottom=-16;X.sun.shadow.mapSize.set(2048,2048);E.world.add(X.sun.target);
  const rg=new THREE.BufferGeometry(),rn=M.drip?140:380,ra=new Float32Array(rn*3);for(let i=0;i<rn;i++){ra[i*3]=(Math.random()-.5)*28;ra[i*3+1]=Math.random()*8;ra[i*3+2]=(Math.random()-.5)*24;}
  rg.setAttribute('position',new THREE.BufferAttribute(ra,3));X.rain=new THREE.Points(rg,new THREE.PointsMaterial({color:M.dripCol||0x8ab0d8,size:M.drip?.07:.05,transparent:true,opacity:.7,depthWrite:false}));E.world.add(X.rain);
  E.fxs.push(dt=>{const a=rg.attributes.position.array;for(let i=0;i<rn;i++){a[i*3+1]-=dt*(M.drip?4+(i%3):9+(i%5));if(a[i*3+1]<0)a[i*3+1]+=8;}rg.attributes.position.needsUpdate=true;});
  X.lead=hrChar('ryan',1.75);X.follow=hrChar('claire',1.75);E.world.add(X.lead.holder,X.follow.holder);
  X.events.forEach(ev=>{ev.hidden=ev.hideIf?ev.hideIf():(ev.kind==='pillar'&&ev.done);const [x,z]=ev.at;let o=null;
    if(ev.kind==='npc'){const s=hrChar(TOWN_KIND[ev.who]||'folkA',1.75);s.holder.position.set(x,0,z);s.face(ev.face||-1);ev.spr=s;o=s.holder;}
    if(ev.kind==='chest'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.45,.48),mat2('plank',.5,.4));b.position.y=.23;b.castShadow=true;
      const band=new THREE.Mesh(new THREE.BoxGeometry(.72,.07,.5),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8,roughness:.3}));band.position.y=.36;o.add(b,band);o.position.set(x,0,z);if(ev.done)b.material=new THREE.MeshStandardMaterial({color:0x2a1e14});}
    if(ev.kind==='stove'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.9,12),mat2('rustroof',2,1,{metalness:.5}));b.position.y=.45;b.castShadow=true;
      const f=new THREE.Mesh(new THREE.BoxGeometry(.22,.16,.05),new THREE.MeshBasicMaterial({color:0xff8a30}));f.position.set(0,.35,.33);o.add(b,f);o.position.set(x,0,z);fbHalo(x,z+.4,1.6,0xff8a30,.5);}
    if(ev.kind==='desk'){o=new THREE.Group();const d=new THREE.Mesh(new THREE.BoxGeometry(1.4,.75,.7),mat2('plank',.8,.4));d.position.y=.38;d.castShadow=true;
      const tin=new THREE.Mesh(new THREE.BoxGeometry(.26,.07,.18),new THREE.MeshStandardMaterial({color:0x8a6a4a,metalness:.6}));tin.position.set(.3,.79,0);
      const ph=new THREE.Mesh(new THREE.PlaneGeometry(.22,.16),new THREE.MeshBasicMaterial({color:0xd8ccb0}));ph.rotation.x=-Math.PI/2;ph.position.set(-.25,.77,.05);o.add(d,tin,ph);o.position.set(x,0,z);}
    if(ev.kind==='pillar'){o=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.36,.46,2.4,10),mat2('plaster',1,1.5,{color:0xe8e4d8}));p.position.y=1.2;p.castShadow=true;o.add(p);
      for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.DodecahedronGeometry(.18+k*.04),mat2('plaster',.3,.3,{color:0xd8d4c8}));c.position.set(-.5+k*.5,.15,.5-k*.2);o.add(c);}o.position.set(x,0,z);}
    if(ev.kind==='exit'){o=new THREE.Mesh(new THREE.RingGeometry(.5,.66,24),new THREE.MeshBasicMaterial({color:0x5cc2ad,side:THREE.DoubleSide,transparent:true,opacity:.8}));o.rotation.x=-Math.PI/2;o.position.set(x,.05,z);}
    if(o){o.visible=!ev.hidden;E.world.add(o);ev.obj=o;}
    if(['npc','chest','stove','board','sign','desk','pillar'].includes(ev.kind)){const mk=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:0xffd27a}));
      mk.position.set(x,ev.kind==='npc'?2.15:ev.kind==='pillar'?2.8:1.6,z);mk.visible=!ev.hidden&&!ev.done;E.world.add(mk);ev.mk=mk;}
    if(ev.kind==='sign')ev.block=false;});
  X.col=M.colliders();X.zone=null;X.yaw=X.yaw||0;
  drawMinimapBase();$('minimap').hidden=false;
  E.fxs.push((dt,t)=>{X.events.forEach(ev=>{if(ev.mk)ev.mk.rotation.y+=dt*2;if(ev.kind==='exit'&&ev.obj)ev.obj.material.opacity=.5+Math.sin(t*3)*.3;});});
  E.onTick=townTick;setTilt(.52,1.3);
}
{const o=drawMinimapBase;drawMinimapBase=function(){if(!X.M||!X.M.build)return o();const c=$('mm-base'),[W0,H0]=X.M.size,S=c.width/W0,g=c.getContext('2d');
  g.clearRect(0,0,c.width,c.height);g.fillStyle='#0c0d10';g.fillRect(0,0,c.width,c.height);
  (X.M.mmFloor||[]).forEach(([a,b,cc,d,col])=>{g.fillStyle=col;g.fillRect(a*S,b*S,(cc-a)*S,(d-b)*S);});
  g.fillStyle='rgba(208,80,63,.2)';(X.M.zones||[]).filter(z=>z.danger).forEach(z=>g.fillRect(z.r[0]*S,z.r[1]*S,(z.r[2]-z.r[0])*S,(z.r[3]-z.r[1])*S));
  FB.mm.forEach(([a,b,cc,d,col])=>{g.fillStyle=col;g.fillRect(a*S,b*S,Math.max(1,(cc-a)*S),Math.max(1,(d-b)*S));});};}
{const o=townColliders;townColliders=function(){return o();};}

/* ---------------- SEWER ---------------- */
const SW={W:44,H:32,ch:[14,18],br:[18.5,21.5]};
MAPS.sewer={name:'奧姆鎮・地下強酸水道',theme:'sewer',free:1,build:buildSewer,size:[SW.W,SW.H],grid:Array(SW.H).fill('.'.repeat(SW.W)),enc:false,
  table:[['sweeper'],['hound','sweeper'],['miner','sweeper'],['hound','hound']],start:[5,27],rest:[5,27],drip:1,dripCol:0x9ad8a0,sunCol:0x7a9a80,sunInt:.3,
  obj:()=>!P.flags.bridge?'想辦法越過強酸渠（找找能中和強酸的東西）':!P.flags.clinic?'調查北側的廢棄診療室':'前往東北的泵浦室，爬鐵梯上去機庫',
  zones:[{r:[0,18,12.6,32],name:'入口・維修豎井'},{r:[12.6,18,44,32],name:'南側維修道',danger:1},{r:[0,13.9,44,18.1],name:'強酸主渠'},{r:[0,9.5,44,13.9],name:'北側步道',danger:1},
    {r:[0,0,13.5,9.5],name:'廢棄診療室'},{r:[13.5,0,30.5,9.5],name:'管線迷宮',danger:1},{r:[30.5,0,44,9.5],name:'泵浦室'}],
  mmFloor:[[1,1,43,31,'#2a2e2a'],[0,14,44,18,'#2e5a26']],
  colliders:()=>{const C={box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()};
    C.box.push([0,SW.ch[0],SW.br[0],SW.ch[1]],[SW.br[1],SW.ch[0],44,SW.ch[1]]);if(!P.flags.bridge)C.box.push([SW.br[0],SW.ch[0],SW.br[1],SW.ch[1]]);return C;},
  events:[
   {id:'block',kind:'auto',at:[20,19.6],r:1.8,talk:'acidBlock',once:true,cond:()=>!P.flags.bridge},
   {id:'lime',kind:'pillar',at:[15.6,20.4],label:'石灰岩柱',talk:'limestone',once:true,after:()=>{P.flags.bridge=1;sewerBridge(true);const e=X.events.find(o=>o.id==='lime');e.hidden=true;e.obj.visible=false;X.col=MAPS.sewer.colliders();drawMinimapBase();}},
   {id:'clinic',kind:'desk',at:[6,4.2],label:'廢棄診療室的桌子',talk:'clinic',once:true,after:()=>{P.flags.clinic=1;}},
   {id:'chest2',kind:'chest',at:[26.5,2.6],label:'酸液罐補給箱',loot:{Acid:2,Al:1},items:['coating']},
   {id:'chest6',kind:'chest',at:[41.6,29.6],label:'儲藏室的鐵櫃',loot:{Fe:2,H2O:2},items:['bandage']},
   {id:'exit',kind:'exit',at:[40,3.4],r:.9,label:'通往機庫的鐵梯',cond:()=>P.flags.clinic,deny:'診療室那邊好像有東西，先去看看。',go:()=>enterMap('yard')},
  ]};
function sewerBridge(anim){const b=new THREE.Mesh(new THREE.BoxGeometry(SW.br[1]-SW.br[0]+.4,.22,SW.ch[1]-SW.ch[0]+.8),mat2('plank',2,2,{color:0x9aa0a8,metalness:.6}));
  b.position.set((SW.br[0]+SW.br[1])/2,.08,(SW.ch[0]+SW.ch[1])/2);b.receiveShadow=true;E.world.add(b);
  [SW.br[0],SW.br[1]].forEach(x=>{const r=new THREE.Mesh(new THREE.BoxGeometry(.1,.7,SW.ch[1]-SW.ch[0]+.8),new THREE.MeshStandardMaterial({color:0x6a7280,metalness:.7}));r.position.set(x,.5,(SW.ch[0]+SW.ch[1])/2);b.parent.add(r);if(anim){r.scale.y=.01;let k=0;E.fxs.push(dt=>{k+=dt*1.5;r.scale.y=Math.min(1,k);return k<1;});}});
  if(anim){b.scale.x=.01;let k=0;E.fxs.push(dt=>{k+=dt*1.2;b.scale.x=Math.min(1,k);return k<1;});}}
function buildSewer(){
  setFog(0x060906,.52);E.scene.fog.near=12;E.scene.fog.far=30;
  const W0=SW.W,H0=SW.H,wallM=()=>mat2('brick2',4,1.6,{color:0x8a9a88}),H=3.2;
  fbFloor(-6,-6,W0+6,SW.ch[0],'flag',2.4,-.02,{color:0x8a9a8a});fbFloor(-6,SW.ch[1],W0+6,H0+6,'flag',2.4,-.02,{color:0x8a9a8a});
  // acid channel (lowered)
  const acid=fbFloor(0,SW.ch[0],W0,SW.ch[1],'canal',2.4,-.35,{color:0x8aff6a,emissive:0x1e6a10,roughness:.15});E.fxs.push(dt=>{acid.material.map.offset.x+=dt*.18;});
  [SW.ch[0],SW.ch[1]].forEach(z=>{const e=new THREE.Mesh(new THREE.BoxGeometry(W0,.4,.25),mat2('stoneW',14,.2));e.position.set(W0/2,-.15,z);E.world.add(e);});
  for(let x=3;x<W0;x+=7){fbHalo(x,(SW.ch[0]+SW.ch[1])/2,2.6,0x7aff6a,.35);}
  [[6,16],[20,16],[34,16]].forEach(([x,z])=>{const l=new THREE.PointLight(0x7aff6a,1.5,10);l.position.set(x,1.2,z);E.world.add(l);flicker(l,1.5,.35,2+x*.1);});
  // broken bridge stubs
  [[SW.br[0]+.6,SW.ch[0]+.4],[SW.br[1]-.6,SW.ch[1]-.4]].forEach(([x,z])=>{const s=new THREE.Mesh(new THREE.BoxGeometry(1.2,.18,.9),mat2('plank',.6,.4));s.position.set(x,.05,z);s.rotation.z=.12;E.world.add(s);});
  if(P.flags.bridge)sewerBridge(false);
  // outer walls
  fbWall(-1,-1,W0+1,0,H,wallM(),{occ:false});fbWall(-1,H0,W0+1,H0+1,1,wallM());fbWall(-1,0,0,H0,H,wallM(),{occ:false});fbWall(W0,0,W0+1,H0,H,wallM(),{occ:false});
  // south rooms
  [[1,22,6,22.6],[9,22,20,22.6],[24,22,36,22.6],[39,22,43,22.6]].forEach(([a,b,c,d])=>fbWall(a,b,c,d,H,wallM()));
  [[12.4,22,13,25],[12.4,27,13,31],[30.8,22,31.4,26],[30.8,28,31.4,31]].forEach(([a,b,c,d])=>fbWall(a,b,c,d,H,wallM()));
  // north rooms
  [[1,9.4,5,10],[8,9.4,20,10],[24,9.4,34,10],[37,9.4,43,10]].forEach(([a,b,c,d])=>fbWall(a,b,c,d,H,wallM()));
  [[13.4,0,14,4],[13.4,6,14,9.4],[30.4,0,31,3],[30.4,5,31,9.4]].forEach(([a,b,c,d])=>fbWall(a,b,c,d,H,wallM()));
  // pipes along walls
  fbPipe(1,.4,43,.4,2.2,.22,0x6a5a48);fbPipe(1,.8,43,.8,1.5,.14,0x4a5a4a);fbPipe(13,22.3,20,22.3,2.6,.15);fbPipe(24,9.7,34,9.7,2.6,.15,0x5a6a58);
  for(let x=4;x<43;x+=9){const v=new THREE.Mesh(new THREE.TorusGeometry(.28,.06,6,14),new THREE.MeshStandardMaterial({color:0xc85a3a,metalness:.6}));v.position.set(x,1.5,1.05);E.world.add(v);}
  // pipe maze: vertical pipe banks
  [[17,3],[17,6.5],[21,2.5],[24,5.5],[27.5,7]].forEach(([x,z])=>{fbBox(x,z,.9,.9,2.6,mat2('rustroof',.6,1.4,{metalness:.5}));fbPipe(x,z,x+2.2,z,2.3,.13);});
  // gallery pillars + storeroom crates
  [[16,25.5],[16,28.5],[21,25.5],[21,28.5],[26,25.5],[26,28.5]].forEach(([x,z])=>fbBox(x,z,.8,.8,H,mat2('stoneW',.5,1.6)));
  [[34,24.5],[35,24.5],[34,25.6],[38,28],[39.2,28],[42,24],[37,30.6]].forEach(([x,z])=>fbBox(x,z,.9,.9,.9,mat2('plank',.5,.5),{rot:Math.random()*.3}));
  [[33,29.5],[40.5,25.5],[25,30.6],[3,12.6],[40,12.4],[9,20.4]].forEach(([x,z],k)=>fbBarrel(x,z,k%2?0x3a6a2a:0x5a4030,k%2?0x0a2a06:0));
  // entrance shaft
  fbBox(3,30.4,1.2,.4,.1,new THREE.MeshStandardMaterial({color:0x2a2a2e}),{col:false});for(let y=.4;y<3.2;y+=.45)fbPipe(2.6,30.6,3.4,30.6,y,.04,0x8a8a90);
  const sh=new THREE.PointLight(0xffc890,1.4,9);sh.position.set(4,2.6,28);E.world.add(sh);fbHalo(4,28,3,0xffd0a0,.35);
  // clinic room
  [[3,2],[3,6.5]].forEach(([x,z])=>{fbBox(x,z,1.8,.9,.55,mat2('plank',.6,.4));const s=new THREE.Mesh(new THREE.BoxGeometry(1.7,.06,.8),new THREE.MeshStandardMaterial({color:0xc8c4b8}));s.position.set(x,.6,z);E.world.add(s);});
  fbBox(10.5,1.2,2,.6,2,mat2('plank',1,1,{color:0x8a7a68}));fbBox(11,7.6,.6,1.2,1.4,new THREE.MeshStandardMaterial({color:0x8a8e94,metalness:.5}));
  const cl=new THREE.PointLight(0xffd8a0,1.2,8);cl.position.set(6,2.4,4.6);E.world.add(cl);flicker(cl,1.2,.5,7);fbLamp(6,2.6,2.4);
  // pump room
  const pump=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,2.4,14),mat2('rustroof',4,1,{metalness:.6}));pump.position.set(36,1.2,5);pump.castShadow=true;E.world.add(pump);FB.circ.push([36,5,1.3]);
  const fly=new THREE.Mesh(new THREE.TorusGeometry(.8,.12,6,16),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8}));fly.position.set(36,1.6,6.25);E.world.add(fly);E.fxs.push(dt=>{fly.rotation.z+=dt*.8;});
  for(let y=.3;y<3;y+=.4)fbPipe(39.6,1.1,40.4,1.1,y,.04,0x9a9aa0);
  const pl=new THREE.PointLight(0xffb060,1.3,9);pl.position.set(39,2.6,4);E.world.add(pl);fbHalo(40,3.6,2.4,0xffb060,.4);
  // wall lamps + glowing fungus
  [[8,21.6],[28,21.6],[42,21.6],[10,10.4],[26,10.4],[42,10.4]].forEach(([x,z])=>fbLamp(x,z,2.2,0xffd27a));
  for(let k=0;k<28;k++){const x=1+Math.random()*42,z=[1,21,9.8,31][k%4]+(Math.random()-.5)*.6;const f=new THREE.Mesh(new THREE.SphereGeometry(.06+Math.random()*.06,6,4),new THREE.MeshBasicMaterial({color:0x9aff8a}));f.position.set(x,.08,z);E.world.add(f);}
  FB.mm.push([0,14,44,18,'#2e5a26']);
}

/* ---------------- FREIGHT YARD ---------------- */
const YD={W:44,H:34};
MAPS.yard={name:'第三蒸氣機庫・後方貨運場',theme:'yard',free:1,build:buildYard,size:[YD.W,YD.H],grid:Array(YD.H).fill('.'.repeat(YD.W)),enc:false,
  table:[['hound'],['hound','hound'],['guard','hound']],start:[4,30.5],rest:[33,25],sunCol:0xffd0a0,sunInt:.45,dripCol:0x9aa0b0,
  obj:()=>!P.flags.guards?'突破守在機庫後門的憲兵':'在值班室的暖爐休息整備，然後進入機庫後門',
  zones:[{r:[0,29,10,34],name:'排水孔出口'},{r:[0,18.5,16,29],name:'貨櫃區',danger:1},{r:[0,12,44,18.5],name:'貨運鐵道'},{r:[16,18.5,44,34],name:'裝卸場'},{r:[0,3,44,12],name:'機庫後門'}],
  mmFloor:[[0,3,44,34,'#2e2c2a'],[0,13.6,44,17.4,'#3a342c']],
  colliders:()=>{const C={box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()};return C;},
  events:[
   {id:'g1',kind:'npc',who:'guard',at:[20.4,6.6],label:'憲兵隊長',hideIf:()=>P.flags.guards},
   {id:'g2',kind:'npc',who:'guard',at:[23.6,6.6],label:'憲兵',hideIf:()=>P.flags.guards},
   {id:'guards',kind:'auto',at:[22,10],r:3.4,once:true,cond:()=>!P.flags.guards,fight:true},
   {id:'stove2',kind:'stove',at:[33,25],label:'值班室的暖爐（休息・整備）',rest:true},
   {id:'chest3',kind:'chest',at:[41.4,20.4],label:'鋁合金零件箱',loot:{Al:1,Fe:2},items:['caliper','coffee']},
   {id:'chest7',kind:'chest',at:[2,19.6],label:'貨櫃縫裡的工具箱',loot:{C:2,Si:2},items:['bracer']},
   {id:'door',kind:'exit',at:[22,4.2],r:1.5,label:'機庫後門',cond:()=>P.flags.guards,deny:'憲兵擋在門口。',go:()=>toBoss()},
  ]};
function buildYard(){
  setFog(0x120c0a,.5);E.scene.fog.near=13;E.scene.fog.far=36;
  const W0=YD.W,H0=YD.H;
  fbFloor(-8,-8,W0+8,H0+8,'gravel',2,-.02);fbFloor(0,3,W0,12,'concrete',2.6,.005);fbFloor(16,18.5,W0,H0,'concrete',2.6,.005);
  // hangar back wall + big door
  const hw=()=>mat2('rustroof',10,3,{metalness:.4,color:0x9a8a80});
  fbWall(-1,0,19.4,3,7.5,hw(),{occ:false});fbWall(24.6,0,W0+1,3,7.5,hw(),{occ:false});fbWall(19.4,0,24.6,1,7.5,hw(),{occ:false});
  const door=new THREE.Mesh(new THREE.PlaneGeometry(5.2,5.4),new THREE.MeshBasicMaterial({color:0xffa040}));door.position.set(22,2.7,1.02);E.world.add(door);
  fbBox(22,1.9,5.6,.3,.25,new THREE.MeshStandardMaterial({color:0x3a3a40,metalness:.7}),{col:false});
  const dl=new THREE.PointLight(0xff9a40,2.6,14);dl.position.set(22,2.6,3.4);E.world.add(dl);flicker(dl,2.6,.5,4);fbHalo(22,4.4,4.2,0xff9a40,.55);
  for(let x=1;x<W0;x+=4){fbBox(x,3.1,.35,.35,7,new THREE.MeshStandardMaterial({color:0x2a2420,metalness:.6}),{col:false});}
  fbPipe(0,3.4,19,3.4,5.6,.25,0x5a4a3e);fbPipe(25,3.4,44,3.4,5.6,.25,0x5a4a3e);
  amberTower(32,-6,0x5a2208);
  // rails + freight cars
  for(let k=0;k<2;k++)for(let z of [14.2,16.4])fbBox(W0/2,z+k*.9,W0+8,.1,.08,new THREE.MeshStandardMaterial({color:0x6a6a74,metalness:.8,roughness:.3}),{col:false});
  for(let x=-4;x<W0+4;x+=.9){fbBox(x,14.65,.2,1.4,.05,mat2('plank',.2,.5),{col:false});fbBox(x,16.85,.2,1.4,.05,mat2('plank',.2,.5),{col:false});}
  const car=(x0,x1,z,col)=>{const w=x1-x0;const m=fbWall(x0,z-1.2,x1,z+1.2,2.8,mat2('container',w/2,1.4,{color:col}));
    const r=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,w,10,1,false,0,Math.PI),mat2('rustroof',w/2,1));r.rotation.z=Math.PI/2;r.rotation.x=-Math.PI/2;r.position.set((x0+x1)/2,2.8,z);E.world.add(r);FB.occ[FB.occ.length-1].meshes.push(r);FB.occ[FB.occ.length-1].box.max.y=4.1;
    [x0+1,x1-1].forEach(wx=>[-1,1].forEach(s=>{const wh=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.2,10),new THREE.MeshStandardMaterial({color:0x222226,metalness:.7}));wh.rotation.x=Math.PI/2;wh.position.set(wx,.4,z+s*1.25);E.world.add(wh);}));};
  car(3,11,15.1,0x8a8a8a);car(28,37,15.1,0x6a8a9a);car(37.6,43,17.3,0xaa9a7a);
  // container maze (west)
  const cont=(x,z,w,d,h,col)=>{const m=fbWall(x-w/2,z-d/2,x+w/2,z+d/2,h,mat2('container',Math.max(w,d)/2,h/2,{color:col}));return m;};
  cont(4,21.2,6,2.4,2.6,0xc86a4a);cont(3.4,26,5,2.4,5.2,0x4a7aa0);cont(11.5,20.5,2.4,4.6,2.6,0x5a8a5a);cont(11.5,27,2.4,5,2.6,0xc8a04a);cont(8,24,2.4,2.4,2.6,0x9a5a8a);
  // loading dock: guard booth + crates + crane
  fbWall(30,26.4,36,31,3.2,mat2('plank',3,1.6,{color:0x9a8a70}));const rf=roofPrism(6.6,5.4,1,mat2('rustroof',3,1));rf.position.set(33,3.2,28.7);E.world.add(rf);FB.occ[FB.occ.length-1].meshes.push(rf);FB.occ[FB.occ.length-1].box.max.y=4.4;FB.occ[FB.occ.length-1].box.min.z-=.5;FB.occ[FB.occ.length-1].box.max.z+=.5;
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9),new THREE.MeshBasicMaterial({color:0xffc070}));win.position.set(31.6,1.8,26.38);win.rotation.y=Math.PI;E.world.add(win);
  const bl=new THREE.PointLight(0xffb060,1.4,8);bl.position.set(33,2.2,24.6);E.world.add(bl);fbHalo(33,25,2.6);
  [[20,22],[21,22],[20,23.1],[26,30],[27.1,30],[40,31],[41,31],[40,32.1],[38,21]].forEach(([x,z])=>fbBox(x,z,1,1,1,mat2('plank',.5,.5),{rot:Math.random()*.25}));
  [[24,24],[25,24.8],[18,31],[42,26]].forEach(([x,z])=>fbBarrel(x,z,0x5a4030));
  [[14.6,6],[29.4,6]].forEach(([x,z])=>fbBox(x,z,.8,.8,6.4,new THREE.MeshStandardMaterial({color:0xc8a040,metalness:.5,roughness:.5})));
  fbBox(22,6,16,.6,.6,new THREE.MeshStandardMaterial({color:0xc8a040,metalness:.5}),{col:false}).position.y=6.6;
  const hook=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,3,4),new THREE.MeshStandardMaterial({color:0x3a3a3a}));hook.position.set(25,5,6);E.world.add(hook);
  // searchlight towers with sweeping beams
  [[2.4,7],[41.6,7]].forEach(([x,z],k)=>{fbBox(x,z,.8,.8,5,new THREE.MeshStandardMaterial({color:0x2a2a30,metalness:.6}));fbLamp(x,z,5.3,0xfff0c8);
    const beam=new THREE.Mesh(new THREE.ConeGeometry(2.2,9,16,1,true),new THREE.MeshBasicMaterial({color:0xfff0c8,transparent:true,opacity:.06,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
    const piv=new THREE.Group();piv.position.set(x,5.3,z);beam.position.y=-4.5;piv.add(beam);E.world.add(piv);const spot=fbHalo(x,z,2.4,0xfff0c8,.5);
    E.fxs.push((dt,t)=>{const a=Math.sin(t*.5+k*2)*.9;piv.rotation.set(.75,a+(k?Math.PI:0),0,'YXZ');const dx=Math.sin(a+(k?Math.PI:0))*6,dz=Math.cos(a+(k?Math.PI:0))*6;spot.position.set(x+dx*.9,.05,z+dz*.9);});});
  // fences + lamp posts
  [[0,H0-.1,W0,H0+.1],[-.1,3,.1,H0],[W0-.1,3,W0+.1,H0]].forEach(([a,b,c,d])=>{const t=T2('chain').clone();t.repeat.set(Math.max(c-a,d-b)/2,1);t.needsUpdate=true;fbWall(a,b,c,d,2.2,new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:.3,side:THREE.DoubleSide,metalness:.6}),{occ:false});});
  [[8,12],[36,12],[18,19],[28,19],[38,24]].forEach(([x,z])=>{fbBox(x,z,.16,.16,3,new THREE.MeshStandardMaterial({color:0x1e1e22}),{col:true});fbLamp(x,z,3.1);});
  // manhole (arrival)
  const mh=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.08,18),new THREE.MeshStandardMaterial({color:0x3a3a40,metalness:.8}));mh.position.set(4,.04,31.6);E.world.add(mh);
}
/* guards battle: return to the new yard coordinates */
{const o=battleGuards;battleGuards=function(){const c=o();c.onWin=()=>{P.flags.guards=1;enterMap('yard',{pos:[22,11.6]});setTimeout(()=>talkScene('guardsPost'),300);};return c;};}
