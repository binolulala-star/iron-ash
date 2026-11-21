/* ======================= CHAPTER 2 — FREE MAPS: 霜港鎮 · 冰河裂谷 · 白銀之顎要塞 · 冰封記憶庫 ======================= */
const snowM=(k,rx,ry,o={})=>mat2(k,rx,ry,o);
function fbBound(W0,H0){FB.box.push([-3,-3,W0+3,0],[-3,H0,W0+3,H0+3],[-3,0,0,H0],[W0,0,W0+3,H0]);}
/* painted environment textures (env/*.webp, published beside the page) */
const ENV_TEX={};
function envTex(name,rx=1,ry=1){const key=name+rx+'x'+ry;if(ENV_TEX[key])return ENV_TEX[key];const t=new THREE.TextureLoader().load('env/'+name+'.webp');
  t.anisotropy=4;if(rx!==1||ry!==1){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);}return ENV_TEX[key]=t;}
function envMat(name,rx=1,ry=1,o={}){return new THREE.MeshStandardMaterial(Object.assign({map:envTex(name,rx,ry),roughness:.85,emissive:0xffffff,emissiveMap:envTex(name,rx,ry),emissiveIntensity:.08},o));}
const ENV_AR={oh_station:2.359,oh_store:1.416,oh_tavern:1.79,oh_hall:2.359,oh_works:2.359,oh_house:1.57,oh_brick:1.79,oh_shack:1.79,oh_ware:1.79};
/* facade cropped (not stretched) to the wall's own proportions; fb = horizontal focus 0..1 */
function facadeMat(name,w,h,fb=.5){const t=new THREE.TextureLoader().load('env/'+name+'.webp'),ar=ENV_AR[name]||1.79,tar=w/h;t.anisotropy=4;
  if(tar<ar){t.repeat.set(tar/ar,1);t.offset.set((1-tar/ar)*fb,0);}else{t.repeat.set(1,ar/tar);t.offset.set(0,0);}
  return new THREE.MeshStandardMaterial({map:t,roughness:.85,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.1});}
function envFloor(x0,z0,x1,z1,name,tile,y=0,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),envMat(name,(x1-x0)/tile,(z1-z0)/tile,Object.assign({emissiveIntensity:0},o)));
  m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,y,(z0+z1)/2);m.receiveShadow=true;E.world.add(m);return m;}
/* snowy house: walls + gable roof with snow; door side 's'|'n'|'e'|'w' gets a lit door + windows */
function snowHouse(x0,z0,x1,z1,h,wallK,{roofK='snowroof',door='s',col=0xc8b8a0,lit=true,rh=1.4,facade=null}={}){
  const m=fbWall(x0,z0,x1,z1,h,snowM(wallK,(x1-x0)/2,h/1.6,{color:col}));const occ=FB.occ[FB.occ.length-1];
  const along=(x1-x0)>=(z1-z0),rf=along?roofPrism(x1-x0+.6,z1-z0+.8,rh,snowM(roofK,(x1-x0)/2,1)):roofPrism(z1-z0+.6,x1-x0+.8,rh,snowM(roofK,(z1-z0)/2,1));
  if(!along)rf.rotation.y=0;rf.position.set((x0+x1)/2,h,(z0+z1)/2);E.world.add(rf);occ.meshes.push(rf);occ.box.max.y=h+rh+.2;occ.box.min.x-=.4;occ.box.max.x+=.4;occ.box.min.z-=.5;occ.box.max.z+=.5;
  if(facade){const w=(door==='s'||door==='n')?x1-x0:z1-z0,pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),envMat(facade));pl.receiveShadow=true;
    if(door==='s')pl.position.set((x0+x1)/2,h/2,z1+.03);if(door==='n'){pl.position.set((x0+x1)/2,h/2,z0-.03);pl.rotation.y=Math.PI;}
    if(door==='e'){pl.position.set(x1+.03,h/2,(z0+z1)/2);pl.rotation.y=Math.PI/2;}if(door==='w'){pl.position.set(x0-.03,h/2,(z0+z1)/2);pl.rotation.y=-Math.PI/2;}
    E.world.add(pl);occ.meshes.push(pl);if(lit){const c=door==='s'?[(x0+x1)/2,z1+.9]:door==='n'?[(x0+x1)/2,z0-.9]:door==='e'?[x1+.9,(z0+z1)/2]:[x0-.9,(z0+z1)/2];fbHalo(c[0],c[1],2.4,0xffb060,.3);}return m;}
  const winM=new THREE.MeshBasicMaterial({color:lit?0xffc878:0x3a4250});
  const face=(x,z,ry)=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.7,.6),winM);w.position.set(x,h*.55,z);w.rotation.y=ry;E.world.add(w);occ.meshes.push(w);};
  if(door==='s'||door==='n'){const z=door==='s'?z1+.02:z0-.02,ry=door==='s'?0:Math.PI;for(let x=x0+1;x<x1-.6;x+=1.8)face(x,z,ry);
    const d=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.5),new THREE.MeshBasicMaterial({color:0x3a2418}));d.position.set((x0+x1)/2,.75,z+(door==='s'?.01:-.01));d.rotation.y=ry;E.world.add(d);occ.meshes.push(d);
    if(lit)fbHalo((x0+x1)/2,z+(door==='s'?.9:-.9),1.6,0xffb060,.35);}
  else{const x=door==='e'?x1+.02:x0-.02,ry=door==='e'?Math.PI/2:-Math.PI/2;for(let z=z0+1;z<z1-.6;z+=1.8)face(x,z,ry);if(lit)fbHalo(x+(door==='e'?.9:-.9),(z0+z1)/2,1.6,0xffb060,.35);}
  return m;}
function fbPine(x,z,h=3.4){const g=new THREE.Group(),tr=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,h*.3,6),new THREE.MeshStandardMaterial({color:0x3a2a1e}));tr.position.y=h*.15;g.add(tr);
  for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(h*(.34-k*.08),h*.42,8),new THREE.MeshStandardMaterial({color:0x24443a,roughness:.9}));c.position.y=h*(.32+k*.22);c.castShadow=true;g.add(c);
    const sn=new THREE.Mesh(new THREE.ConeGeometry(h*(.29-k*.08),h*.13,8),new THREE.MeshStandardMaterial({color:0xeef2f8}));sn.position.y=h*(.47+k*.22);g.add(sn);}
  g.position.set(x,0,z);E.world.add(g);FB.circ.push([x,z,.45]);FB.mm.push([x-.4,z-.4,x+.4,z+.4,'#2a4a3e']);return g;}
function fbRock(x,z,w,d,h,col=0x8a94a4,{snow=true,coll=true}={}){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:col,roughness:.9,flatShading:true}));
  m.scale.set(w/2,h/2,d/2);m.position.set(x,h*.32,z);m.rotation.y=rnd()*3;m.castShadow=true;m.receiveShadow=true;E.world.add(m);
  if(snow){const s=new THREE.Mesh(new THREE.SphereGeometry(1,8,5,0,Math.PI*2,0,Math.PI/2.4),new THREE.MeshStandardMaterial({color:0xeef2f8,roughness:1}));s.scale.set(w/2.1,h/4,d/2.1);s.position.set(x,h*.62,z);E.world.add(s);}
  if(coll){FB.box.push([x-w*.42,z-d*.42,x+w*.42,z+d*.42]);FB.occ.push({meshes:[m],box:new THREE.Box3(new THREE.Vector3(x-w/2,0,z-d/2),new THREE.Vector3(x+w/2,h,z+d/2)),f:1});FB.mm.push([x-w*.42,z-d*.42,x+w*.42,z+d*.42,'#5a6474']);}return m;}
function fbShard(x,z,h,col=0x9ad8ff,coll=true){const m=new THREE.Mesh(new THREE.ConeGeometry(h*.2,h,5),new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.85,roughness:.05,metalness:.2,emissive:0x0a3050}));
  m.position.set(x,h/2,z);m.rotation.set((rnd()-.5)*.3,rnd()*3,(rnd()-.5)*.3);m.castShadow=true;E.world.add(m);if(coll)FB.circ.push([x,z,h*.18]);return m;}
function fbSnowPile(x,z,r){const s=new THREE.Mesh(new THREE.SphereGeometry(r,10,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xe8eef4,roughness:1}));s.scale.y=.45;s.position.set(x,0,z);s.receiveShadow=true;E.world.add(s);}
function steamPlume(x,y,z,n=10,col=0xe8eef4){const ps=[];for(let k=0;k<n;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.3,6,4),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.35,depthWrite:false}));s.userData.ph=k/n;E.world.add(s);ps.push(s);}
  E.fxs.push((dt,t)=>{ps.forEach(s=>{if(!s.parent)return;const q=(t*.18+s.userData.ph)%1;s.position.set(x+Math.sin(q*6+s.userData.ph*9)*.5+q*1.4,y+q*5,z);s.scale.setScalar(.8+q*3);s.material.opacity=.38*(1-q);});});}
/* snow instead of rain on chapter-2 maps */
HOOK.after('buildFree',M=>{if(!M.snow)return;if(X.rain)X.rain.visible=false;
  const n=M.snow===2?500:900,g=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let q=0;q<n;q++){p[q*3]=(rnd()-.5)*30;p[q*3+1]=rnd()*9;p[q*3+2]=(rnd()-.5)*26;}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color:M.snowCol||0xf4f8ff,size:M.snow===2?.06:.08,transparent:true,opacity:.9,depthWrite:false}));E.world.add(pts);X.rain=pts;
  E.fxs.push((dt,t)=>{if(!pts.parent)return false;const a=g.attributes.position.array;for(let q=0;q<n;q++){a[q*3+1]-=dt*(.8+(q%5)*.15);a[q*3]+=Math.sin(t*.7+q)*dt*.3+dt*.25;if(a[q*3+1]<0){a[q*3+1]=9;a[q*3]=(rnd()-.5)*30;}}g.attributes.position.needsUpdate=true;});
  X.events.forEach(ev=>{if(ev.kind!=='crystal')return;const [x,z]=ev.at,gr=new THREE.Group();
    for(let k=0;k<4;k++){const c=new THREE.Mesh(new THREE.OctahedronGeometry(.22+k*.06),new THREE.MeshStandardMaterial({color:0xbfeaff,transparent:true,opacity:.85,emissive:ev.glow||0x4a3a10,roughness:.05}));c.scale.y=1.8;c.position.set((k-1.5)*.24,.4+k*.05,(k%2)*.2-.1);c.rotation.z=(k-1.5)*.2;gr.add(c);}
    const l=new THREE.PointLight(ev.light||0xffc060,1.2,4);l.position.y=.8;gr.add(l);gr.position.set(x,0,z);gr.visible=!ev.hidden;E.world.add(gr);ev.obj=gr;
    E.fxs.push((dt,t)=>{l.intensity=1+Math.sin(t*3)*.4;});
    const mk=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:0xffd27a}));mk.position.set(x,1.7,z);mk.visible=!ev.hidden&&!ev.done;E.world.add(mk);ev.mk=mk;});});
Object.assign(MAP_SONG,{snow:'town',glacier:'yard',fortress:'yard',vault:'sewer'});

/* ---------------- 霜港鎮 ---------------- */
const FP={W:44,H:34};
MAPS.frostport={name:'霜港鎮',theme:'snow',free:1,ch:2,snow:1,build:buildFrostport,size:[FP.W,FP.H],grid:Array(FP.H).fill('.'.repeat(FP.W)),enc:false,table:[['wolf']],
  start:[8,29],rest:[19.6,21.6],sunCol:0xd8e4ff,sunInt:.42,
  obj:()=>!P.flags.c2tavern&&!P.flags.lia?'打聽要塞的消息（廣場西側的酒館）':!P.flags.lia?'到鎮東的雪橇站找信差莉亞':'從北門出發，前往冰河裂谷',
  zones:[{r:[0,26,44,34],name:'北境終點站・月台'},{r:[14,10,30,26],name:'供暖塔廣場'},{r:[0,0,14,26],name:'西街・酒館'},{r:[30,10,44,26],name:'雪橇站'},{r:[14,0,44,10],name:'北門'}],
  mmFloor:[[0,0,44,34,'#c8d0da'],[14,11,30,26,'#9aa2ac'],[18,0,26,11,'#a8b0ba'],[0,26,44,29,'#8a929c']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice().concat(P.flags.lia?[]:[[19,0,25,1.6]]),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'soldier',kind:'npc',who:'soldier',at:[25,23.2],label:'長椅上的士兵',talk:'fpNumb',once:true},
   {id:'keeper',kind:'npc',who:'keeper',at:[9.6,15.4],label:'酒館老闆',talk:'fpTavern',once:true,after:()=>{P.flags.c2tavern=1;}},
   {id:'board',kind:'sign',at:[21.6,25],label:'廣場佈告欄',talk:'fpBoard',once:true},
   {id:'folkA',kind:'npc',who:'folkB',at:[16.4,8.6],label:'掃雪的婦人',talk:'fpFolk',once:true},
   {id:'lia',kind:'npc',who:'lia',at:[35.6,19.6],label:'雪橇站的女孩',talk:'fpLia',once:true,after:()=>{P.flags.lia=1;P.items.bandage=(P.items.bandage||0)+2;X.col=MAPS.frostport.colliders();toast('莉亞給了你們蒸氣繃帶 ×2。她會在北門外的雪橇等你們。');}},
   {id:'stoveF',kind:'stove',at:[19.6,20.6],label:'供暖塔下的暖爐（休息・整備）',rest:true},
   {id:'chF1',kind:'chest',at:[2.6,30.6],label:'月台的行李箱',loot:{C:2,H2O:2},items:['bandage']},
   {id:'chF2',kind:'chest',at:[41.4,31],label:'貨運倉的木箱',loot:{Fe:2,Al:1},items:['coffee']},
   {id:'gate',kind:'exit',at:[22,1.4],r:1.4,label:'北門',cond:()=>P.flags.lia,deny:'北門外是冰河。沒有雪橇過不去——先找人帶路。',go:()=>enterMap('glacier')},
  ]};
function buildFrostport(){
  setFog(0x8a96a8,.5);E.scene.fog.near=16;E.scene.fog.far=40;const W0=FP.W,H0=FP.H;
  fbFloor(-10,-10,W0+10,H0+10,'snow2',2.4,-.02);envFloor(0,0,W0,26,'fp_snow',6.5,.004,{color:0x98a2b0});fbFloor(0,26,W0,29,'flag',2.4,.004,{color:0x8a94a0});
  fbBound(W0,H0);
  // railway + armored train to the south
  for(const z of [31,32.2])fbBox(W0/2,z,W0+16,.1,.08,new THREE.MeshStandardMaterial({color:0x6a6a74,metalness:.8}),{col:false});
  const car=(x0,x1,col)=>{fbWall(x0,30.6,x1,33.4,2.6,mat2('container',(x1-x0)/2,1.4,{color:col}));const r=roofPrism(x1-x0,3,.6,snowM('snowroof',(x1-x0)/2,1));r.position.set((x0+x1)/2,2.6,32);E.world.add(r);const oc=FB.occ[FB.occ.length-1];oc.meshes.push(r);oc.box.max.y=3.4;};
  car(-4,8,0x6a7480);car(9,21,0x5a6a5a);car(22,34,0x6a7480);steamPlume(-2,3.4,32,12);
  fbBox(22,26.6,18,.6,.5,mat2('flag',8,1,{color:0x6a7480}),{col:false});
  [[6,27.4],[16,27.4],[28,27.4],[38,27.4]].forEach(([x,z])=>{fbBox(x,z,.16,.16,3,new THREE.MeshStandardMaterial({color:0x1e1e22}));fbLamp(x,z,3.1);});
  // central heating tower
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(2,2.5,9,16),mat2('brick2',8,4,{color:0x9a8a80}));tw.position.set(22,4.5,17);tw.castShadow=true;E.world.add(tw);FB.circ.push([22,17,2.6]);FB.mm.push([19.6,14.6,24.4,19.4,'#6a5a50']);
  FB.occ.push({meshes:[tw],box:new THREE.Box3(new THREE.Vector3(19.4,0,14.4),new THREE.Vector3(24.6,9,19.6)),f:1});
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2,w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.8),new THREE.MeshBasicMaterial({color:0xffa850,side:THREE.DoubleSide}));w.position.set(22+Math.cos(a)*2.28,5+((k%2)*1.6),17+Math.sin(a)*2.28);w.rotation.y=-a+Math.PI/2;E.world.add(w);}
  const tl=new THREE.PointLight(0xff9a40,1.3,12);tl.position.set(22,3,20.6);E.world.add(tl);flicker(tl,1.3,.3,3);fbHalo(22,17,5,0xff9a40,.18);steamPlume(22,9,17,16);
  [[16,13],[28,13],[16,24],[28,24]].forEach(([x,z])=>fbPipe(22,17,x,z,.35,.16,0x7a5a40));
  // west street: tavern, store, houses
  snowHouse(4,8,14,14,4.4,'plaster',{col:0xb8a088,facade:'fp_tavern'});
  snowHouse(3,17,11,23,3.4,'timber',{col:0xa89070,door:'e',facade:'fp_store'});snowHouse(15,3,20,8,2.8,'plaster',{col:0xc0b098,facade:'fp_house1'});snowHouse(1,1,9,5.4,3.4,'timber',{col:0x9a8068,facade:'fp_row'});
  // east: houses + sled depot (open shed)
  snowHouse(28,3,34,8.4,3.4,'plaster',{col:0xb0a090,facade:'fp_stone'});snowHouse(36,2,43,7.6,3,'timber',{col:0x9a8068,facade:'fp_row'});
  fbWall(32,15,40,15.5,2.8,mat2('timber',4,1.4));fbWall(39.5,15.5,40,23,2.8,mat2('timber',4,1.4));const shed=roofPrism(9,8.6,1.2,snowM('snowroof',4,1));shed.position.set(36,2.8,19.2);E.world.add(shed);FB.occ.push({meshes:[shed],box:new THREE.Box3(new THREE.Vector3(31,0,14),new THREE.Vector3(41,4.2,24)),f:1});
  const sled=new THREE.Group(),sb=new THREE.Mesh(new THREE.BoxGeometry(2.2,.6,1),new THREE.MeshStandardMaterial({color:0x8a3a2a,metalness:.3}));sb.position.y=.55;const boil=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.9,10),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.7}));boil.rotation.z=Math.PI/2;boil.position.set(-.6,1,0);
  [-.4,.4].forEach(z=>{const r=new THREE.Mesh(new THREE.BoxGeometry(2.6,.08,.08),new THREE.MeshStandardMaterial({color:0x3a3a40,metalness:.8}));r.position.set(0,.1,z);sled.add(r);});sled.add(sb,boil);sled.position.set(36.6,0,17.4);E.world.add(sled);FB.box.push([35.4,16.8,37.8,18]);
  [[33,22],[34.1,22],[38.4,16.6]].forEach(([x,z])=>fbBox(x,z,.9,.9,.9,mat2('plank',.5,.5)));fbLamp(34,15.8,2.4);
  // north gate + palisade
  fbWall(0,0,19,1,3.6,mat2('timber',8,1.6),{occ:false});fbWall(25,0,W0,1,3.6,mat2('timber',8,1.6),{occ:false});[[19,.5],[25,.5]].forEach(([x,z])=>{fbBox(x,z,1.2,1.2,4.6,mat2('brick2',1,2));fbLamp(x,z+.8,4.8);});
  if(!P.flags.lia){const g=new THREE.Mesh(new THREE.BoxGeometry(6,3,.2),mat2('timber',3,1.4));g.position.set(22,1.5,.6);E.world.add(g);}
  // pines, snow piles, lamps, benches
  [[1,10],[2,15],[12.6,2],[42,13],[43,25],[30.6,1.4],[12,24.6],[42,9],[27,9.6]].forEach(([x,z])=>fbPine(x,z,3+rnd()*1.4));
  [[14,10],[30,10],[14,25],[31,25],[24,9],[5,25],[40,25]].forEach(([x,z])=>fbSnowPile(x,z,.8+rnd()*.6));
  [[14.6,16],[29.4,16],[22,10.4],[10,16.6],[33,24]].forEach(([x,z])=>{fbBox(x,z,.16,.16,3,new THREE.MeshStandardMaterial({color:0x1e1e22}));fbLamp(x,z,3.1);});
  fbBox(25,23.9,1.8,.5,.45,mat2('plank',.8,.3));
  const sl=new THREE.PointLight(0xffc890,1.2,9);sl.position.set(9.6,2.4,16);E.world.add(sl);
}

/* ---------------- 冰河裂谷 ---------------- */
const GL={W:46,H:34};
MAPS.glacier={name:'冰河裂谷',theme:'glacier',free:1,ch:2,snow:1,build:buildGlacier,size:[GL.W,GL.H],grid:Array(GL.H).fill('.'.repeat(GL.W)),enc:false,
  table:[['wolf','wolf'],['wolf'],['frostguard','wolf'],['turret','wolf'],['wolf','wolf','wolf']],start:[7,30],rest:[37,24.6],sunCol:0xc8dcff,sunInt:.4,
  obj:()=>!P.flags.b1?'沿著雪原北上':!P.flags.b2?'越過結冰的渡口':'抵達北邊的要塞入口',
  zones:[{r:[0,27,16,34],name:'冰河口'},{r:[0,13,16,27],name:'雪狼岩脊',danger:1},{r:[16,9,36,25],name:'冰河渡口',danger:1},{r:[36,18,46,34],name:'獵人小屋'},{r:[16,25,36,34],name:'南側雪原',danger:1},{r:[0,0,46,9],name:'要塞參道'},{r:[36,9,46,18],name:'冰瀑',danger:1}],
  mmFloor:[[0,0,46,34,'#c0cad6'],[17,12,35,22,'#7eaed0']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'liaS',kind:'npc',who:'lia',at:[4.6,31],label:'莉亞',talk:'glLia'},
   {id:'b1',kind:'auto',at:[8,19],r:2.8,cond:()=>!P.flags.b1,battle:()=>battleC2('b1'),pre:'b1pre'},
   {id:'shard',kind:'crystal',at:[13,9.6],label:'冰層裡發光的結晶',talk:'glShard',once:true},
   {id:'b2',kind:'auto',at:[22,17],r:2.6,cond:()=>!P.flags.b2,battle:()=>battleC2('b2'),pre:'b2pre'},
   {id:'hunter',kind:'npc',who:'hunter',at:[39,24.6],label:'小屋前的獵人',talk:'glHunter',once:true},
   {id:'stoveG',kind:'stove',at:[37,24.6],label:'獵人小屋的火爐（休息・整備）',rest:true},
   {id:'chG1',kind:'chest',at:[2.4,11],label:'岩縫裡的補給包',loot:{Si:2,H2O:2},items:['furmantle']},
   {id:'chG2',kind:'chest',at:[43.4,31.4],label:'雪橇殘骸的貨箱',loot:{C:2,Al:1},items:['bandage']},
   {id:'chG3',kind:'chest',at:[43,10.6],label:'冰瀑下的鐵盒',loot:{Fe:2,C:1},items:['capsule']},
   {id:'exitG',kind:'exit',at:[30,1.6],r:1.4,label:'要塞參道',cond:()=>P.flags.b2,deny:'渡口的衛兵還擋在冰面上。',go:()=>enterMap('fortress')},
  ]};
function buildGlacier(){
  setFog(0x6a7e96,.48);E.scene.fog.near=15;E.scene.fog.far=38;const W0=GL.W,H0=GL.H;
  fbFloor(-10,-10,W0+10,H0+10,'snow2',2.4,-.02);const lake=fbFloor(17,12,35,22,'ice2',3,.006,{roughness:.08,metalness:.3,color:0xc8e4f8});
  fbBound(W0,H0);
  // ice cliffs around the edges
  for(let x=-1;x<W0+2;x+=2.6){if(x>26&&x<34)continue;fbRock(x,-1.2,3,2.4,4+rnd()*3,0x9ab0c8,{coll:false});}
  for(let z=2;z<H0;z+=2.8){fbRock(-1.2,z,2.4,3,4+rnd()*2,0x9ab0c8,{coll:false});fbRock(W0+1.2,z,2.4,3,4+rnd()*2,0x9ab0c8,{coll:false});}
  // west ridge (wolves) — corridor of rocks
  [[3,24],[13,25],[14,21],[2,17.6],[13.6,15],[4,13.6],[9.6,26.6]].forEach(([x,z])=>fbRock(x,z,2.6+rnd(),2.2+rnd(),2.4+rnd()*1.6));
  [[6,20.6,1.6],[11,18.4,1.2]].forEach(([x,z,h])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(2.4,h*.4,2),new THREE.MeshStandardMaterial({color:0xdce4ee,roughness:1}));m.position.set(x,h*.2,z);E.world.add(m);});
  // lake rim + shards
  for(let k=0;k<22;k++){const a=k/22*Math.PI*2;const x=26+Math.cos(a)*10.4,z=17+Math.sin(a)*6.4;if(z<13.4&&x>20&&x<32)continue;if(Math.abs(x-22)<2.6&&z>20)continue;fbShard(x,z,.8+rnd()*1.8);}
  [[24,15],[29,19],[31,14.6]].forEach(([x,z])=>fbShard(x,z,1.6+rnd(),0xbfeaff));
  // frozen waterfall (east)
  for(let k=0;k<6;k++)fbShard(40+k*.9,12+rnd()*2,3+rnd()*2.4,0xa8dcff,k%2===0);fbRock(44,13,3,4,6,0x9ab0c8);
  const wf=new THREE.PointLight(0x9ad8ff,1.4,10);wf.position.set(41,3,13);E.world.add(wf);
  // hunter cabin
  snowHouse(34,26,40,30.6,3.3,'timber',{col:0x8a7058,door:'n',facade:'gl_cabin'});const fl=new THREE.PointLight(0xffa850,1.4,7);fl.position.set(37,1.4,25);E.world.add(fl);
  // broken sled (south-east), lia's sled (south-west)
  [[43,30],[42,32]].forEach(([x,z],k)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(1.8,.4,.8),new THREE.MeshStandardMaterial({color:k?0x5a4030:0x6a3a2a}));b.position.set(x,.2,z);b.rotation.y=.6+k;E.world.add(b);});
  const sled=new THREE.Group(),sb=new THREE.Mesh(new THREE.BoxGeometry(2.2,.6,1),new THREE.MeshStandardMaterial({color:0x8a3a2a,metalness:.3}));sb.position.y=.55;const boil=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.9,10),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.7}));boil.rotation.z=Math.PI/2;boil.position.set(-.6,1,0);sled.add(sb,boil);sled.position.set(3,0,32.4);E.world.add(sled);steamPlume(2.4,1.2,32.4,6);
  // pines dotted
  [[18,28],[22,31],[27,27.6],[32,31.6],[16,4],[8,4],[40,5],[44,3],[36,7.4],[20,6]].forEach(([x,z])=>fbPine(x,z,3+rnd()*1.6));
  // fortress silhouette far north
  const fs=new THREE.Mesh(new THREE.BoxGeometry(18,10,2),mat2('fstone2',8,4));fs.position.set(30,5,-6);E.world.add(fs);[[22,-5.4],[38,-5.4]].forEach(([x,z])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.2,13,10),mat2('fstone2',4,4));t.position.set(x,6.5,z);E.world.add(t);});
  const gl=new THREE.PointLight(0xffa850,1.6,12);gl.position.set(30,2.4,-3.6);E.world.add(gl);
}

/* ---------------- 白銀之顎要塞 ---------------- */
const FT={W:44,H:36};
MAPS.fortress={name:'白銀之顎要塞',theme:'fortress',free:1,ch:2,snow:2,build:buildFortress,size:[FT.W,FT.H],grid:Array(FT.H).fill('.'.repeat(FT.W)),enc:false,table:[['frostguard']],
  start:[22,32],rest:[13,30],sunCol:0xb8c8e0,sunInt:.5,
  obj:()=>P.flags.boss?'在城牆上和大家會合':!P.flags.office?'在日落前調查要塞（兵營、醫務室、上校辦公室）':!P.flags.b3?'前往東塔':'進入東塔地下',
  zones:[{r:[14,26,30,36],name:'南門廣場'},{r:[0,4,15,20],name:'兵營'},{r:[0,20,15,36],name:'醫務室・廚房'},{r:[15,2,30,14],name:'司令部'},{r:[30,2,44,22],name:'東塔'},{r:[15,14,30,26],name:'閱兵場'},{r:[30,22,44,36],name:'軍械庫'}],
  mmFloor:[[0,0,44,36,'#6a707a'],[15,14,30,26,'#80868e']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'locke',kind:'npc',who:'locke',at:[22,25.4],label:'洛克上校',talk:'ftLocke',once:true},
   {id:'erik',kind:'npc',who:'erik',at:[9,20.8],label:'兵營門口的士兵',talk:'ftErik',once:true,after:()=>{P.flags.erik=1;}},
   {id:'sold2',kind:'npc',who:'soldier',at:[5,20.6],label:'擦槍的士兵',talk:'ftSoldier',once:true},
   {id:'clinic',kind:'desk',at:[13.6,25.4],label:'醫務室窗口的日誌',talk:'ftClinic',once:true,after:()=>{P.flags.ftclinic=1;}},
   {id:'office',kind:'desk',at:[22,9],label:'上校辦公室的桌子',talk:'ftOffice',once:true,after:()=>{P.flags.office=1;}},
   {id:'b3',kind:'auto',at:[33.4,19.6],r:2.8,cond:()=>P.flags.office&&!P.flags.b3,battle:()=>battleC2('b3'),pre:'b3pre'},
   {id:'eastBlock',kind:'auto',at:[33.4,19.6],r:2.6,once:true,cond:()=>!P.flags.office,talk:'ftEastBlock'},
   {id:'stoveT',kind:'stove',at:[13,30],label:'廚房的大灶（休息・整備）',rest:true},
   {id:'chT1',kind:'chest',at:[2.6,33.4],label:'倉庫角落的木箱',loot:{Fe:2,C:2},items:['icepick']},
   {id:'chT2',kind:'chest',at:[41.4,33],label:'軍械庫的彈藥箱',loot:{Al:1,H2O:2},items:['coffee']},
   {id:'tower',kind:'exit',at:[37,15.6],r:1.2,label:'東塔地下入口',cond:()=>P.flags.b3,deny:'東塔的鐵門鎖著，城牆上的砲台正對著這裡。',go:()=>enterMap('vault')},
  ]};
function buildFortress(){
  setFog(0x2a303a,.58);E.scene.fog.near=15;E.scene.fog.far=40;const W0=FT.W,H0=FT.H,stone=(rx,ry)=>envMat('ft_wall',rx*.8,ry*.8,{emissiveIntensity:0});
  fbFloor(-10,-10,W0+10,H0+10,'snow2',2.4,-.03);envFloor(1,1,W0-1,H0-1,'ft_floor',3.2,.002,{color:0xa8b0bc});fbFloor(15,14,30,26,'flag',2.2,.006,{color:0x7a828e});
  fbBound(W0,H0);
  // curtain walls (north tall, sides, south gate)
  fbWall(-1,-1,W0+1,1.4,7,stone(20,3),{occ:false});fbWall(-1,1,1,H0,6,stone(16,3),{occ:false});fbWall(W0-1,1,W0+1,H0,6,stone(16,3),{occ:false});
  fbWall(-1,H0-.4,19.6,H0+1,2,stone(10,1));fbWall(24.4,H0-.4,W0+1,H0+1,2,stone(10,1));
  for(let x=1;x<W0;x+=2.4){const m=new THREE.Mesh(new THREE.BoxGeometry(1.2,.8,1.4),stone(1,1));m.position.set(x,7.4,.2);E.world.add(m);}
  [[19.6,35],[24.4,35]].forEach(([x,z])=>{fbBox(x,z,1.4,1.4,3.6,stone(1,2));fbLamp(x,z-1,3.8,0xffa850);});
  // barracks (west)
  snowHouse(1.4,6,13.6,18.6,5.2,'fstone2',{col:0xb0b8c4,roofK:'snowroof',door:'s',facade:'ft_barracks'});
  // infirmary + kitchen (south-west)
  snowHouse(1.4,22,12.6,28,3.4,'plaster',{col:0xc8ccd4,door:'e',facade:'ft_clinic'});snowHouse(1.4,29.4,10,34.4,2.6,'timber',{col:0x8a7a68,door:'e',facade:'ft_kitchen'});
  const ch=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,2,8),stone(1,1));ch.position.set(5,4,31.6);E.world.add(ch);steamPlume(5,5,31.6,8,0x8a8a90);
  // HQ (north centre) — open front so the desk is reachable
  fbWall(15,2,16,10,4,stone(4,2));fbWall(28,2,29,10,4,stone(4,2));fbWall(16,2,28,3,4,stone(6,2));
  const hr=roofPrism(15,9.4,1.6,snowM('snowroof',6,1));hr.position.set(22,4,6);E.world.add(hr);FB.occ.push({meshes:[hr],box:new THREE.Box3(new THREE.Vector3(14.4,0,1.4),new THREE.Vector3(29.6,6,10.6)),f:1});
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(7.2,4),envMat('ft_office',1,1,{emissiveIntensity:.12}));fl.position.set(22,2,3.03);E.world.add(fl);FB.occ[FB.occ.length-1]&&0;
  const hl=new THREE.PointLight(0xffc890,1.3,8);hl.position.set(22,3,7);E.world.add(hl);
  // east tower
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.8,12,18),stone(10,5));tw.position.set(37,6,9);tw.castShadow=true;E.world.add(tw);FB.circ.push([37,9,4.9]);FB.mm.push([32.4,4.4,41.6,13.6,'#4a505a']);
  FB.occ.push({meshes:[tw],box:new THREE.Box3(new THREE.Vector3(32,0,4),new THREE.Vector3(42,12,14)),f:1});
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.4),new THREE.MeshBasicMaterial({color:P.flags.b3?0x7fe8ff:0x2a2a30}));door.position.set(37,1.2,13.85);E.world.add(door);
  if(P.flags.b3){const dl=new THREE.PointLight(0x7fe8ff,1.6,8);dl.position.set(37,1.4,15);E.world.add(dl);fbHalo(37,15,2.4,0x7fe8ff,.4);}
  for(let k=0;k<3;k++){const t=new THREE.Mesh(new THREE.CylinderGeometry(.4,.5,.8,8),new THREE.MeshStandardMaterial({color:0x8ab0c8,metalness:.5}));t.position.set(34+k*3,12.4,6+k);E.world.add(t);}
  // armoury crates, parade ground posts, braziers
  [[33,26],[34.1,26],[33,27.1],[38,30],[39.1,30],[40,25],[35,33]].forEach(([x,z])=>fbBox(x,z,1,1,1,mat2('plank',.5,.5)));
  [[17,15.4],[27,15.4],[17,24.6],[27,24.6]].forEach(([x,z])=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.34,.24,.6,8),new THREE.MeshStandardMaterial({color:0x2a2a2e,metalness:.6}));b.position.set(x,.8,z);E.world.add(b);FB.circ.push([x,z,.4]);
    const f=new THREE.PointLight(0xff9a40,1.4,7);f.position.set(x,1.4,z);E.world.add(f);flicker(f,1.4,.5,4+x);fbHalo(x,z,1.8,0xff9a40,.4);});
  [[3,4],[42,3],[42,34],[15,34]].forEach(([x,z])=>fbSnowPile(x,z,1.2));
  fbBox(5,20.4,1.8,.5,.45,mat2('plank',.8,.3));
  if(P.flags.boss){[[18,20],[20,21.4],[25,19],[27,21]].forEach(([x,z],k)=>{const s=hrChar(k%2?'soldier':'guard',1.75);s.holder.position.set(x,0,z);s.face(k%2?1:-1);E.world.add(s.holder);});}
}

/* ---------------- 冰封記憶庫 ---------------- */
const VT={W:38,H:32};
MAPS.vault={name:'東塔地下・冰封記憶庫',theme:'vault',free:1,ch:2,snow:2,snowCol:0xbff4ff,build:buildVault,size:[VT.W,VT.H],grid:Array(VT.H).fill('.'.repeat(VT.W)),enc:false,
  table:[['crystal'],['crystal','turret'],['crystal','crystal']],start:[4,28],rest:[6.6,26.4],sunCol:0x7aa8d8,sunInt:.32,
  obj:()=>!P.flags.b4?'深入記憶庫':!P.flags.boss?'前往最深處的擺鐘室':'離開記憶庫',
  zones:[{r:[0,22,10,32],name:'鐵梯下'},{r:[10,18,38,32],name:'冰晶走廊',danger:1},{r:[0,0,16,22],name:'冰晶倉庫',danger:1},{r:[16,0,38,18],name:'擺鐘室'}],
  mmFloor:[[0,0,38,32,'#1e2a3a'],[16,1,37,17,'#24344a']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'stoveV',kind:'stove',at:[6.6,26.4],label:'蒸氣管的檢修口（休息・整備）',rest:true},
   {id:'b4',kind:'auto',at:[16,25],r:2.6,cond:()=>!P.flags.b4,battle:()=>battleC2('b4'),pre:'b4pre'},
   {id:'shelf',kind:'crystal',at:[8,8],label:'貼著名牌的冰晶',talk:'vShelf',once:true,glow:0x0a3a5a,light:0x7fe8ff},
   {id:'chV1',kind:'chest',at:[35,28],label:'研究員的工具箱',loot:{Al:2,C:1},items:['bandage','coffee']},
   {id:'chV2',kind:'chest',at:[2.4,2.4],label:'冰窖角落的鐵櫃',loot:{Fe:2,H2O:2},items:['capsule']},
   {id:'orrick',kind:'npc',who:'orrick',at:[27,7],label:'擺鐘前的男人',hideIf:()=>P.flags.boss},
   {id:'boss',kind:'auto',at:[27,12.4],r:3,cond:()=>P.flags.b4&&!P.flags.boss,battle:()=>battleC2('boss'),pre:'orrickMeet'},
   {id:'ladder',kind:'exit',at:[2.6,30],r:1,label:'回到地面的鐵梯',cond:()=>true,go:()=>enterMap('fortress',{pos:[37,17]})},
  ]};
function buildVault(){
  setFog(0x060d18,.42);E.scene.fog.near=11;E.scene.fog.far=30;const W0=VT.W,H0=VT.H;
  fbFloor(-6,-6,W0+6,H0+6,'frost2',2.4,-.02,{color:0x8aa0c0});fbFloor(16,1,37,17,'ice2',3,.004,{color:0x6a8ab0,roughness:.1,metalness:.4});
  fbBound(W0,H0);const wall=(rx,ry)=>mat2('frost2',rx,ry,{color:0x8aa8c8});
  fbWall(-1,-1,W0+1,0,4.2,wall(16,2),{occ:false});fbWall(-1,0,0,H0,4.2,wall(14,2),{occ:false});fbWall(W0,0,W0+1,H0,4.2,wall(14,2),{occ:false});fbWall(-1,H0,W0+1,H0+1,1,wall(16,1));
  // inner partitions: corridor (south) / store (west) / clock room (north-east)
  fbWall(10,18,30,18.6,3.6,wall(8,2));fbWall(16,0,16.6,14,3.6,wall(6,2));fbWall(33,18,38,18.6,3.6,wall(2,2));fbWall(0,21.4,6,22,3.6,wall(2,2));fbWall(9.6,22,10.2,32,3.6,wall(4,2));
  // crystal shelves (store)
  for(let x=2;x<14;x+=3.4)for(let z=4;z<20;z+=4.4){fbBox(x+1,z,2.4,.8,2.2,mat2('timber',1,1,{color:0x6a7a8a}));for(let k=0;k<4;k++){const c=new THREE.Mesh(new THREE.OctahedronGeometry(.16),new THREE.MeshBasicMaterial({color:[0xffc060,0x7fe8ff,0xffa0c8][(k+x)%3]}));c.scale.y=1.6;c.position.set(x+.2+k*.55,1.3+(k%2)*.6,z);E.world.add(c);}}
  // corridor pillars and shards
  [[14,21],[20,29],[26,21],[31,29]].forEach(([x,z])=>fbBox(x,z,.9,.9,3.6,wall(1,2)));[[12,30],[24,25],[35,22],[29,30.4]].forEach(([x,z])=>fbShard(x,z,1+rnd()*1.4,0x7fe8ff));
  // pipes along the corridor, ladder shaft
  fbPipe(10,31.2,38,31.2,2.6,.2,0x6a5a48);fbPipe(10,30.6,38,30.6,1.8,.12,0x5a6a7a);for(let y=.4;y<4;y+=.45)fbPipe(2,30.8,3.2,30.8,y,.04,0x8a8a90);
  const sl=new THREE.PointLight(0xffb070,1.4,8);sl.position.set(5,2.6,27);E.world.add(sl);fbHalo(6.6,26.6,2,0xff9a40,.4);
  // the pendulum clock
  const base=new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.2,.8,20),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8,roughness:.3}));base.position.set(27,.4,5);E.world.add(base);FB.circ.push([27,5,3]);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(5,9,1),new THREE.MeshStandardMaterial({color:0x8a6a3a,metalness:.7,roughness:.4}));frame.position.set(27,5,3.4);E.world.add(frame);
  const dial=new THREE.Mesh(new THREE.CircleGeometry(1.8,32),new THREE.MeshBasicMaterial({color:0xd8f4ff}));dial.position.set(27,7.2,3.95);E.world.add(dial);
  const piv=new THREE.Group();piv.position.set(27,6.4,4.4);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,5,6),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.9}));rod.position.y=-2.5;
  const bob=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.3,20),new THREE.MeshStandardMaterial({color:0x9ad8ff,metalness:.5,emissive:0x1a5a8a}));bob.rotation.x=Math.PI/2;bob.position.y=-5;piv.add(rod,bob);E.world.add(piv);
  const cl=new THREE.PointLight(0x7fe8ff,2.4,16);cl.position.set(27,3,7);E.world.add(cl);
  if(!P.flags.boss)E.fxs.push((dt,t)=>{piv.rotation.z=Math.sin(t*1.3)*.5;cl.intensity=2+Math.abs(Math.cos(t*1.3))*1.4;});else{bob.material.emissive.setHex(0x111111);cl.color.setHex(0xffb070);}
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2,x=27+Math.cos(a)*7.6,z=8+Math.sin(a)*4.6;if(z>12&&Math.abs(x-27)<3)continue;fbShard(x,z,1.4+rnd()*2.4,P.flags.boss?0xffd8a0:0x9ad8ff);}
  [[3,25],[34,24],[20,9],[33,12]].forEach(([x,z])=>{const l=new THREE.PointLight(0x7fe8ff,1,7);l.position.set(x,2,z);E.world.add(l);});
}
