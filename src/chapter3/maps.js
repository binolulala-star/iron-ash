/* ======================= CHAPTER 3 — FREE MAPS: 飛艇碼頭 · 高斯港下城區 · 磁軌礦坑 · 避雷塔 ======================= */
Object.assign(PROP_AR,{pr_signal:.42,pr_pylon:.61,pr_rod:.45,pr_bollard:1.44,pr_chain:1.86,pr_railcart:1.35});
Object.assign(ENV_AR,{fp_gauss:1.79});
const c3m=(n,rx,ry,o={})=>envMat(n,rx,ry,Object.assign({emissiveIntensity:0},o));
const c3col=(rx,ry,col=0x6a7488)=>mat2('brick2',rx,ry,{color:col});
/* narrow stone townhouse with the painted facade on its door side and a flat tin roof */
function gaussHouse(x0,z0,x1,z1,h,door='s',lit=true){const m=fbWall(x0,z0,x1,z1,h,c3col((x1-x0)/2,h/2));const occ=FB.occ[FB.occ.length-1];
  const roof=new THREE.Mesh(new THREE.BoxGeometry(x1-x0+.4,.25,z1-z0+.4),new THREE.MeshStandardMaterial({color:0x3a4250,metalness:.5,roughness:.6}));roof.position.set((x0+x1)/2,h+.12,(z0+z1)/2);E.world.add(roof);occ.meshes.push(roof);
  const w=(door==='s'||door==='n')?x1-x0:z1-z0,pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h),facadeMat('fp_gauss',w,h));
  if(door==='s')pl.position.set((x0+x1)/2,h/2,z1+.03);if(door==='n'){pl.position.set((x0+x1)/2,h/2,z0-.03);pl.rotation.y=Math.PI;}
  if(door==='e'){pl.position.set(x1+.03,h/2,(z0+z1)/2);pl.rotation.y=Math.PI/2;}if(door==='w'){pl.position.set(x0-.03,h/2,(z0+z1)/2);pl.rotation.y=-Math.PI/2;}
  E.world.add(pl);occ.meshes.push(pl);
  // brass pipes up the corners
  [[x0+.15,z1+.15],[x1-.15,z1+.15]].forEach(([x,z])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,h+.6,6),new THREE.MeshStandardMaterial({color:0xa88a4a,metalness:.8,roughness:.4}));p.position.set(x,(h+.6)/2,door==='s'?z:z0-.15);E.world.add(p);});
  if(lit){const c=door==='s'?[(x0+x1)/2,z1+.9]:door==='n'?[(x0+x1)/2,z0-.9]:door==='e'?[x1+.9,(z0+z1)/2]:[x0-.9,(z0+z1)/2];fbHalo(c[0],c[1],2.2,0xffb060,.28);}return m;}
function c3Rail(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),a=Math.atan2(z1-z0,x1-x0);[-.35,.35].forEach(o=>{const r=new THREE.Mesh(new THREE.BoxGeometry(L,.06,.06),new THREE.MeshStandardMaterial({color:0x6a6a74,metalness:.8}));
  r.position.set((x0+x1)/2-Math.sin(a)*o,.04,(z0+z1)/2+Math.cos(a)*o);r.rotation.y=-a;E.world.add(r);});
  for(let k=0;k<L;k+=.8){const t=new THREE.Mesh(new THREE.BoxGeometry(.16,.05,1),new THREE.MeshStandardMaterial({color:0x4a3a2a}));t.position.set(x0+Math.cos(a)*k,.02,z0+Math.sin(a)*k);t.rotation.y=-a;E.world.add(t);}}
function c3Railing(x0,z0,x1,z1){const L=Math.hypot(x1-x0,z1-z0),a=Math.atan2(z1-z0,x1-x0),mat=new THREE.MeshStandardMaterial({color:0x8a7040,metalness:.7,roughness:.5});
  const bar=new THREE.Mesh(new THREE.BoxGeometry(L,.06,.06),mat);bar.position.set((x0+x1)/2,.95,(z0+z1)/2);bar.rotation.y=-a;E.world.add(bar);
  for(let k=0;k<=L;k+=1.2){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.95,.07),mat);p.position.set(x0+Math.cos(a)*k,.47,z0+Math.sin(a)*k);E.world.add(p);}
  FB.box.push([Math.min(x0,x1)-.12,Math.min(z0,z1)-.12,Math.max(x0,x1)+.12,Math.max(z0,z1)+.12]);}
const c3Clouds=(W0,H0,y=-3)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(W0+60,H0+60),new THREE.MeshStandardMaterial({color:0x5a6680,roughness:1,transparent:true,opacity:.92}));m.rotation.x=-Math.PI/2;m.position.set(W0/2,y,H0/2);E.world.add(m);
  for(let k=0;k<26;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(2+rnd()*3,8,6),new THREE.MeshStandardMaterial({color:0x7a86a0,roughness:1,transparent:true,opacity:.7}));s.scale.y=.4;s.position.set(rnd()*(W0+30)-15,y+.4,rnd()*(H0+30)-15);
    if(s.position.x>-1&&s.position.x<W0+1&&s.position.z>-1&&s.position.z<H0+1)s.position.x+=W0+6;E.world.add(s);}};

/* ---------------- 飛艇碼頭 ---------------- */
const C3DK={W:34,H:24};
MAPS.dock={name:'風暴外緣・飛艇碼頭',theme:'dock',free:1,ch:3,storm:1,build:buildDock,size:[C3DK.W,C3DK.H],grid:Array(C3DK.H).fill('.'.repeat(C3DK.W)),enc:false,table:[['stormkite']],
  start:[5,19],rest:[6,15.6],sunCol:0xb8c8e8,sunInt:.36,
  obj:()=>!P.flags.b1?'趕走碼頭上的風暴鳶':'碼頭東北角的升降籠，通往高斯港',
  zones:[{r:[0,12,14,24],name:'迫降區・灰鷗號'},{r:[14,8,34,24],name:'貨運棧道',danger:1},{r:[18,0,34,8],name:'升降籠'}],
  mmFloor:[[0,0,34,24,'#8a8478'],[18,0,34,8,'#9a9488']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'captain',kind:'npc',who:'captain',at:[8.6,16.4],label:'灰鷗號的船長',fn:()=>say([{who:'captain',e:'Neutral',t:P.flags.b1?'船三天內修好。等你們辦完事，我再載你們出去——前提是你們還活著。':'先別管船了！那些鳥要把燃油罐啄破了！'}])},
   {id:'hank',kind:'npc',who:'docker',at:[22.6,14.2],label:'沉默的碼頭工人',talk:'dockHank',once:true},
   {id:'b1',kind:'auto',at:[16,15],r:3,cond:()=>!P.flags.b1,battle:()=>battleC3real('b1'),pre:'b1pre3'},
   {id:'reg',kind:'sign',at:[27.4,5.2],label:'港務局登記簿',fn:()=>c3Clue(1)},
   {id:'lensD',kind:'sign',at:[3.2,4],label:'纜繩堆裡閃著光',fn:()=>c3Lens('D')},
   {id:'stoveD',kind:'stove',at:[6,15.6],label:'灰鷗號的鍋爐（休息・整備）',rest:true},
   {id:'chD1',kind:'chest',at:[12.6,21.6],label:'掉出貨艙的木箱',loot:{Fe:2,C:1},items:['bandage']},
   {id:'chD2',kind:'chest',at:[31.4,12.6],label:'棧道盡頭的工具箱',loot:{Al:1,H2O:2},items:['coffee']},
   {id:'lift',kind:'exit',at:[26,2],r:1.4,label:'升降籠・往高斯港',cond:()=>P.flags.b1,deny:'風暴鳶還在升降籠附近盤旋。',go:()=>{if(!P.flags.gauss_in){P.flags.gauss_in=1;playScene(SCENES.gaussIn,()=>enterMap('gauss'));}else enterMap('gauss');}},
  ]};
function buildDock(){
  setFog(0x1e2636,.46);E.scene.fog.near=14;E.scene.fog.far=40;const W0=C3DK.W,H0=C3DK.H;
  c3Clouds(W0,H0,-4);envFloor(0,0,W0,H0,'tx_pier',3,0);fbBound(W0,H0);
  // edges: railings on the cloud side
  c3Railing(0,H0-.2,W0,H0-.2);c3Railing(W0-.2,8,W0-.2,H0);c3Railing(0,0,0,H0);
  // the crashed airship
  const hull=new THREE.Mesh(new THREE.CylinderGeometry(2.2,1.6,9,12,1,false),c3m('tx_pier',3,2,{color:0x8a6a4a}));hull.rotation.z=Math.PI/2;hull.rotation.y=.25;hull.position.set(6,1.6,10);hull.castShadow=true;E.world.add(hull);
  FB.box.push([1.6,8.2,10.6,11.8]);FB.occ.push({meshes:[hull],box:new THREE.Box3(new THREE.Vector3(1.4,0,8),new THREE.Vector3(10.8,3.8,12)),f:1});
  const bag=new THREE.Mesh(new THREE.SphereGeometry(3.2,14,10),new THREE.MeshStandardMaterial({color:0x8a8270,roughness:.95}));bag.scale.set(1.6,.7,.8);bag.position.set(6.4,5.2,9.6);bag.rotation.y=.25;E.world.add(bag);
  steamPlume(9.6,2.8,10.6,12,0x3a3a40);
  // cargo crates as wind shelters
  [[15,11],[16.1,11],[19,17.4],[24,9.6],[25.1,9.6],[29,16],[13,19.2]].forEach(([x,z])=>fbBox(x,z,1,1,1,mat2('plank',.5,.5)));
  [[20,6],[30,6],[12,4],[4,22]].forEach(([x,z])=>fbProp('pr_bollard',x,z,.9,{r:.4}));
  fbProp('pr_chain',17,21.6,.7);fbProp('pr_chain',30.6,20.4,.7);
  [[14,8],[22,20],[33,10],[10,14]].forEach(([x,z])=>fbProp('pr_signal',x,z,2.6,{r:.25,glow:.9}));
  // lift cage
  const cage=new THREE.Group();for(const [x,z] of [[24.6,.6],[27.4,.6],[24.6,3.4],[27.4,3.4]]){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,4.2,.12),new THREE.MeshStandardMaterial({color:0xa88a4a,metalness:.8}));p.position.set(x,2.1,z);cage.add(p);}
  const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,.2,3.2),new THREE.MeshStandardMaterial({color:0x5a4a30,metalness:.6}));top.position.set(26,4.2,2);cage.add(top);E.world.add(cage);chain(26,4.3,2,6);fbLamp(26,3.6,3.8);
  // floating rocks & the city in the distance
  floatRock(-6,1,-4,2.4);floatRock(40,0,8,3);floatRock(16,-1,-8,2);chain(-6,2,-4,8);
  const city=new THREE.Group();for(let k=0;k<9;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(1.6+rnd()*2,3+rnd()*7,1.6+rnd()*2),new THREE.MeshStandardMaterial({color:0x2a3040,emissive:0x0a0c12}));b.position.set(k*2.2-9,2+rnd()*2,0);city.add(b);}
  city.position.set(W0/2+4,6,-16);E.world.add(city);
  const cl=new THREE.PointLight(0xffc890,1.1,10);cl.position.set(8,2.6,14);E.world.add(cl);flicker(cl,1.1,.3,3);
}

/* ---------------- 高斯港・下城區 ---------------- */
const C3GA={W:44,H:34};
MAPS.gauss={name:'高斯港・下城區',theme:'gauss',free:1,ch:3,storm:1,build:buildGauss,size:[C3GA.W,C3GA.H],grid:Array(C3GA.H).fill('.'.repeat(C3GA.W)),enc:false,table:[['gendarme']],
  start:[3,22],rest:[22,17.6],sunCol:0xb0c0e0,sunInt:.46,
  obj:()=>!P.flags.mila?'找一個還能溝通的人（廣場附近）':!P.flags.lh?'跟著米菈去信號燈塔':!P.flags.b3?'城南的升降籠下到磁軌礦坑':!P.flags.r19?'到城西的城帆工坊找蕾溫':'從城北的塔門登上避雷塔',
  zones:[{r:[0,16,10,28],name:'碼頭升降口'},{r:[14,12,30,24],name:'磁鐵廣場'},{r:[0,0,14,16],name:'城帆工坊'},{r:[32,4,44,22],name:'信號燈塔'},{r:[14,24,30,34],name:'礦坑升降籠'},{r:[14,0,32,10],name:'避雷塔門'},{r:[30,22,44,34],name:'舊礦工街'}],
  mmFloor:[[0,0,44,34,'#7a8090'],[14,12,30,24,'#8a90a0']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'milaA',kind:'npc',who:'mila',at:[24.6,21.4],label:'舉著提燈的女孩',hideIf:()=>P.flags.mila,fn:()=>{playScene(SCENES.milaMeet.concat(SCENES.b2pre3),()=>{P.flags.mila=1;fx('flash');setTimeout(()=>startBattle(battleC3real('b2')),500);},{keep:true,actors:exActors()});}},
   {id:'milaB',kind:'npc',who:'mila',at:[36.4,14.6],label:'米菈',hideIf:()=>!P.flags.lh,fn:()=>c3MilaTalk()},
   {id:'lewin',kind:'npc',who:'lewin',at:[8.4,11.2],label:'城帆工坊的老工程師',fn:()=>c3LewinTalk()},
   {id:'bato',kind:'npc',who:'oldminer',at:[36,28.6],label:'握著懷錶的老礦工',fn:()=>c3Clue(2)},
   {id:'catG',kind:'sign',at:[29.4,30.6],label:'屋簷下的黑貓',fn:()=>c3Cat()},
   {id:'lensG',kind:'sign',at:[41.6,31.4],label:'排水溝裡的黃銅片',fn:()=>c3Lens('G')},
   {id:'board3',kind:'sign',at:[20.4,23.6],label:'廣場佈告欄',fn:()=>say([{n:'佈告欄上貼滿了手寫的紙條，沒有一張是印刷的。'},{n:'「尋人：我女兒不說話了，但她會點頭。看到穿紅鞋的小女孩請帶她回麵包店。」'},{n:'「本店改用手寫點單。請指著想要的麵包。——老漢斯麵包」'},{who:'claire',e:'Hurt',t:'……整座城都在努力假裝一切正常。'}])},
   {id:'stoveG',kind:'stove',at:[22,17.6],label:'磁鐵廣場的熱水爐（休息・整備）',rest:true},
   {id:'chG1',kind:'chest',at:[2.6,2.6],label:'工坊後院的零件箱',loot:{Fe:2,Al:1},items:['capsule']},
   {id:'chG2',kind:'chest',at:[42,24.6],label:'舊礦工街的木箱',loot:{C:2,Si:2},items:['bandage']},
   {id:'toDock',kind:'exit',at:[1,22],r:1.2,label:'往碼頭',cond:()=>true,go:()=>enterMap('dock',{pos:[26,4.6]})},
   {id:'toMine',kind:'exit',at:[22,32.6],r:1.4,label:'礦坑升降籠',cond:()=>P.flags.lh,deny:'升降籠鎖著。先弄清楚這座城發生了什麼事。',go:()=>enterMap('mine3')},
   {id:'toTower',kind:'exit',at:[23,1.2],r:1.4,label:'避雷塔門',cond:()=>P.flags.r19,deny:'塔門外的風大得站不住。去城帆工坊問問有沒有辦法。',go:()=>enterMap('tower')},
  ]};
function buildGauss(){
  setFog(0x1a2232,.46);E.scene.fog.near=15;E.scene.fog.far=42;const W0=C3GA.W,H0=C3GA.H;
  c3Clouds(W0,H0,-5);envFloor(0,0,W0,H0,'oh_cobble',3.4,0,{color:0x8a92a4});envFloor(14,12,30,24,'tx_brassdeck',3,.004,{color:0x9a9aa4});fbBound(W0,H0);
  // central magnet plaza: giant electromagnet hanging on chains
  const can=magnetCan(22,6.5,18,2.2);chain(22,8,18,12);[[19,15],[25,15],[19,21],[25,21]].forEach(([x,z])=>fbPipe(22,18,x,z,.3,.12,0xa88a4a));
  fbHalo(22,18,6,0x6ab8ff,.18);FB.circ.push([22,18,1.2]);
  // west: sail workshop (big shed with sails)
  fbWall(2,4,14,5,4.2,c3col(6,2));fbWall(2,5,2.8,14,4.2,c3col(4,2));const shed=roofPrism(13,10.6,1.6,new THREE.MeshStandardMaterial({color:0x5a5040,roughness:.9}));shed.position.set(8,4.2,9.5);E.world.add(shed);
  FB.occ.push({meshes:[shed],box:new THREE.Box3(new THREE.Vector3(1.5,0,3.5),new THREE.Vector3(14.5,5.8,15)),f:1});
  for(let k=0;k<3;k++){const s=new THREE.Mesh(new THREE.PlaneGeometry(2.6,3.4),new THREE.MeshStandardMaterial({color:0xe8dcc0,side:THREE.DoubleSide,roughness:.9}));s.position.set(5+k*3,2.6,7);s.rotation.y=.2;E.world.add(s);
    const ph=k;E.fxs.push((dt,t)=>{if(!s.parent)return false;s.rotation.y=.2+Math.sin(t*1.4+ph)*.18;});}
  // north: tower gate + base of the lightning tower
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(2.4,3.2,22,10),new THREE.MeshStandardMaterial({color:0x4a5060,metalness:.6,roughness:.5}));tw.position.set(23,11,-4);E.world.add(tw);
  fbWall(14,0,20,1.2,3.4,c3col(3,1.6));fbWall(26,0,32,1.2,3.4,c3col(3,1.6));[[20.4,.6],[25.6,.6]].forEach(([x,z])=>{fbBox(x,z,1,1,4.4,mat2('brick2',1,2,{color:0x5a6072}));fbLamp(x,z+.8,4.6,0x9ad8ff);});
  // east: the signal lighthouse
  const lh=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.2,10,12),c3col(4,5,0x8a8478));lh.position.set(38,5,10);lh.castShadow=true;E.world.add(lh);FB.circ.push([38,10,2.4]);
  const lamp=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1.4,10),new THREE.MeshBasicMaterial({color:0xffd27a}));lamp.position.set(38,10.6,10);E.world.add(lamp);
  const ll=new THREE.PointLight(0xffc870,1.6,14);ll.position.set(38,10.6,10);E.world.add(ll);E.fxs.push((dt,t)=>{if(!ll.parent)return false;const on=Math.sin(t*2.2)>0||Math.sin(t*.7)>.6;ll.intensity=on?1.8:.2;lamp.material.color.setHex(on?0xffd27a:0x5a4a2a);});
  FB.occ.push({meshes:[lh],box:new THREE.Box3(new THREE.Vector3(35.6,0,7.6),new THREE.Vector3(40.4,10,12.4)),f:1});
  // houses
  gaussHouse(14,4,19,9.4,4.6,'s');gaussHouse(27,4,32,9.4,4.4,'s');gaussHouse(32,14,37,20,4.2,'w');gaussHouse(10,18,14,24,4.4,'e');
  gaussHouse(31,26,36,31,4,'n');gaussHouse(37,25,43,30,4.6,'w');gaussHouse(4,26,10,32,4.2,'n');gaussHouse(14,27,19.6,32,4.4,'e');gaussHouse(24.4,27,30,32,4.2,'w');
  // mine lift (south) + rails
  const cage=new THREE.Group();for(const [x,z] of [[20.6,31],[23.4,31],[20.6,33.6],[23.4,33.6]]){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,3.6,.12),new THREE.MeshStandardMaterial({color:0xa88a4a,metalness:.8}));p.position.set(x,1.8,z);cage.add(p);}E.world.add(cage);fbLamp(22,32.2,3.2,0x9ad8ff);
  c3Rail(22,24,22,31);fbProp('pr_railcart',24.4,26,1.1,{r:.6});
  // props
  [[16,13],[28,13],[16,23],[28,23],[6,20],[40,20],[33,24]].forEach(([x,z])=>fbProp('pr_signal',x,z,2.6,{r:.25,glow:.7}));
  [[12.6,15],[30.4,12.6],[41,4]].forEach(([x,z])=>fbBarrel(x,z));fbProp('pr_bollard',3,24.6,.9,{r:.4});
  [[8,23],[38.6,22.6],[18,10.6]].forEach(([x,z])=>fbBox(x,z,1,1,1,mat2('plank',.5,.5)));
}

/* ---------------- 磁軌礦坑 ---------------- */
const C3MN={W:36,H:28};
MAPS.mine3={name:'磁軌礦坑',theme:'mine3',free:1,ch:3,build:buildMine3,size:[C3MN.W,C3MN.H],grid:Array(C3MN.H).fill('.'.repeat(C3MN.W)),enc:false,table:[['golem']],
  start:[18,25],rest:[30,23],sunCol:0x8aa8e0,sunInt:.34,
  obj:()=>!P.flags.b3?'往礦坑深處找線圈的電源':!P.flags.lab?'調查礦坑最深處':'搭升降籠回到城裡',
  zones:[{r:[12,20,24,28],name:'升降籠底站'},{r:[8,8,28,20],name:'主礦道',danger:1},{r:[0,0,12,12],name:'舊坑道'},{r:[24,0,36,12],name:'帆布實驗室'}],
  mmFloor:[[0,0,36,28,'#3a4050'],[8,8,28,20,'#4a5264']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'b3',kind:'auto',at:[18,14],r:3,cond:()=>!P.flags.b3,battle:()=>battleC3real('b3'),pre:'b3pre3'},
   {id:'oath',kind:'sign',at:[4.4,4],label:'坑壁上的刻字',fn:()=>c3Clue(3)},
   {id:'lensM',kind:'sign',at:[10.4,22.4],label:'礦車底下有東西在反光',fn:()=>c3Lens('M')},
   {id:'bp',kind:'sign',at:[33,9.6],label:'被風吹到角落的捲軸',fn:()=>c3Blueprint()},
   {id:'stoveM',kind:'stove',at:[30,23],label:'值班室的煤爐（休息・整備）',rest:true},
   {id:'chM1',kind:'chest',at:[2.6,14.6],label:'廢棄的炸藥箱',loot:{C:2,Si:1},items:['coffee']},
   {id:'chM2',kind:'chest',at:[34,26],label:'值班室的鐵櫃',loot:{Fe:3},items:['bandage']},
   {id:'up',kind:'exit',at:[18,27],r:1.4,label:'升降籠・回到城裡',cond:()=>P.flags.lab,deny:'電源還沒切斷。往深處走。',
     go:()=>{const go=()=>enterMap('gauss',{pos:[22,29.6]});if(!P.flags.talk7){P.flags.talk7=1;playScene(SCENES.talk7,go,{keep:true,actors:exActors()});}else go();}},
  ]};
function buildMine3(){
  setFog(0x05070c,.4);E.scene.fog.near=12;E.scene.fog.far=34;const W0=C3MN.W,H0=C3MN.H;
  envFloor(-6,-6,W0+6,H0+6,'tx_magnetite',4,-.02,{color:0x6a7488});fbBound(W0,H0);
  const rockM=(rx,ry)=>c3m('tx_magnetite',rx,ry,{color:0x9aa4b8});
  // cave walls around + rock pillars
  fbWall(-1,-1,W0+1,0,5,rockM(12,2),{occ:false});fbWall(-1,0,0,H0,5,rockM(10,2),{occ:false});fbWall(W0,0,W0+1,H0,5,rockM(10,2),{occ:false});
  fbWall(0,H0,12,H0+1,5,rockM(4,2),{occ:false});fbWall(24,H0,W0,H0+1,5,rockM(4,2),{occ:false});
  [[6,18,4,5],[30,16,4,4],[12,4,3,3],[24,4,2,3]].forEach(([x,z,w,d])=>fbWall(x-w/2,z-d/2,x+w/2,z+d/2,4.6,rockM(w/2,2)));
  // rails, carts, pylons, crystal lamps
  c3Rail(18,26,18,8);c3Rail(18,8,32,8);c3Rail(6,12,18,12);fbProp('pr_railcart',11,22,1.1,{r:.6});fbProp('pr_railcart',26,8.6,1.1,{r:.6});
  [[14,12],[22,16],[9,8],[28,12]].forEach(([x,z])=>fbProp('pr_pylon',x,z,2.4,{r:.4}));
  [[9,8,2],[28,12,2],[14,12,2],[22,16,2]].forEach(([x,z])=>{const l=new THREE.PointLight(0x6ab8ff,1.4,7);l.position.set(x,2.2,z);E.world.add(l);flicker(l,1.4,.4,6+x);});
  magnetCan(18,3.6,6,1.2);
  // canvas lab in the north-east
  const tent=roofPrism(8,7,2.2,new THREE.MeshStandardMaterial({color:0xb8a888,side:THREE.DoubleSide,roughness:.95}));tent.position.set(30,2.4,5);E.world.add(tent);
  [[26.4,1.6],[33.6,1.6],[26.4,8.4],[33.6,8.4]].forEach(([x,z])=>fbBox(x,z,.16,.16,2.4,new THREE.MeshStandardMaterial({color:0x3a2a1e})));
  fbBox(30,4.4,2.6,1.1,.9,mat2('plank',1,.5));fbLamp(30,4.4,1.2,0x9ad8ff);
  [[27,6],[33,6],[31,2.6]].forEach(([x,z])=>fbBarrel(x,z,0x3a4a5a));
  // lift shaft
  const cage=new THREE.Group();for(const [x,z] of [[16.6,26],[19.4,26],[16.6,28],[19.4,28]]){const p=new THREE.Mesh(new THREE.BoxGeometry(.12,4.6,.12),new THREE.MeshStandardMaterial({color:0xa88a4a,metalness:.8}));p.position.set(x,2.3,z);cage.add(p);}E.world.add(cage);fbLamp(18,26.6,3.6);
  dustField(160,[0,0,0,W0,4,H0],0x9ad8ff,.05,.08);E.hemi.intensity=Math.max(E.hemi.intensity,.5);
  [[10,16],[26,16],[18,10],[6,6]].forEach(([x,z])=>{const l=new THREE.PointLight(0xffc890,.9,9);l.position.set(x,2.6,z);E.world.add(l);});
  const sl=new THREE.PointLight(0xffb070,1,8);sl.position.set(30,2,23);E.world.add(sl);flicker(sl,1,.3,3);
}

/* ---------------- 避雷塔 ---------------- */
const C3TW={W:28,H:30};
MAPS.tower={name:'避雷塔',theme:'tower',free:1,ch:3,storm:2,build:buildTower,size:[C3TW.W,C3TW.H],grid:Array(C3TW.H).fill('.'.repeat(C3TW.W)),enc:false,table:[['minicoil']],
  start:[14,27],rest:[22.6,24],sunCol:0xc0cce8,sunInt:.4,
  obj:()=>!P.flags.b4?'往上爬，拆掉中段的小型線圈':'登上塔頂，摧毀雷暴線圈',
  zones:[{r:[0,20,28,30],name:'塔基・錨鏈平台'},{r:[0,10,28,20],name:'中段浮空平台',danger:1},{r:[0,0,28,10],name:'塔頂',danger:1}],
  mmFloor:[[0,0,28,30,'#8a8a90']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  events:[
   {id:'anchor',kind:'sign',at:[4.6,25.4],label:'第 13 號錨鏈',fn:()=>c3Clue(5)},
   {id:'b4',kind:'auto',at:[14,16],r:3,cond:()=>!P.flags.b4,battle:()=>battleC3real('b4'),pre:'b4pre3'},
   {id:'boss',kind:'auto',at:[14,6.4],r:2.6,cond:()=>P.flags.b4&&!P.flags.boss3,battle:()=>battleC3real('boss'),pre:'bossPre3'},
   {id:'stoveT',kind:'stove',at:[22.6,24],label:'塔基的值班爐（休息・整備）',rest:true},
   {id:'chT1',kind:'chest',at:[2.6,14],label:'平台邊的補給箱',loot:{H2O:2,C:2},items:['capsule']},
   {id:'down',kind:'exit',at:[14,29.2],r:1.4,label:'回到城裡',cond:()=>true,go:()=>enterMap('gauss',{pos:[23,3.6]})},
  ]};
function buildTower(){
  setFog(0x222c44,.5);E.scene.fog.near=16;E.scene.fog.far=46;const W0=C3TW.W,H0=C3TW.H;
  c3Clouds(W0,H0,-8);envFloor(0,0,W0,H0,'tx_brassdeck',3,0);fbBound(W0,H0);
  c3Railing(0,0,0,H0);c3Railing(W0,0,W0,H0);c3Railing(0,H0,W0,H0);c3Railing(0,0,W0,0);
  // tower core in the middle-top + the giant rod
  const core=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2,8,10),new THREE.MeshStandardMaterial({color:0x4a5060,metalness:.7,roughness:.4}));core.position.set(14,4,1.4);E.world.add(core);
  const rod=new THREE.Mesh(new THREE.ConeGeometry(.3,9,8),new THREE.MeshStandardMaterial({color:0xc87a40,metalness:.9,roughness:.3,emissive:0x2a1004}));rod.position.set(14,12.5,1.4);E.world.add(rod);
  const glow=new THREE.PointLight(0xb48aff,2,14);glow.position.set(14,8,3);E.world.add(glow);flicker(glow,2,1.2,9);
  // bobbing platforms (decor) on both sides
  [[3,8],[25,8],[3,18],[25,18],[8,12],[20,12]].forEach(([x,z],k)=>{const p=new THREE.Mesh(new THREE.BoxGeometry(2.4,.4,2.4),c3m('tx_brassdeck',1,1));p.position.set(x,.2,z);E.world.add(p);
    E.fxs.push((dt,t)=>{if(!p.parent)return false;p.position.y=.2+Math.max(0,Math.sin(t*.8+k))*.5;});});
  // anchor chains at the base
  [[4,26],[24,26]].forEach(([x,z])=>{chain(x,-6,z,8);fbProp('pr_chain',x+1.2,z+1,.7);});
  [[6,22],[22,22],[6,10],[22,10]].forEach(([x,z])=>fbProp('pr_rod',x,z,2.6,{r:.3}));
  [[2,22],[26,14]].forEach(([x,z])=>fbProp('pr_signal',x,z,2.6,{r:.25,glow:.6}));
  floatRock(-8,-2,10,3);floatRock(36,-1,16,2.6);floatRock(14,-4,-10,4);
}
