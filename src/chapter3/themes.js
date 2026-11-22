/* ======================= CHAPTER 3 — themes: battle boards, backdrops, storm ambience, story sets ======================= */
const CH3_THEMES=['dock','alley','mine3','tower'];
['tx_pier','tx_brassdeck','tx_magnetite'].forEach(k=>{if(!PIMG[k]){const im=new Image();im.src='env/'+k+'.webp';PIMG[k]=im;}});
Object.assign(BOARD_PAINT,{dock:['tx_pier',0xb8b4ae],alley:['oh_cobble',0x9aa2b0],mine3:['tx_magnetite',0xc8d0e0],tower:['tx_brassdeck',0xb8b8bc]});
Object.assign(FLOOR,{dock:'wood',alley:'cobble',mine3:'stone',tower:'plate'});
Object.assign(ENV,{dock:['風暴外緣・飛艇碼頭','風速 22 m/s · 雷暴 · 地面 L0'],alley:['高斯港・下城區','無聲 · 雷暴 · 地面 L0–1'],
  mine3:['高斯港地底・磁軌礦坑','磁場 0.8 T · 地面 L0–1'],tower:['避雷塔','高度 300 m · 風速 30 m/s · 浮空平台']});
Object.assign(LOOT_TYPES,{dock:['scrap','oil','si'],alley:['scrap','al','oil'],mine3:['si','scrap','si','al'],tower:['al','scrap','oil']});
Object.assign(THEME_SKY,{dock:['#141c2a','#3a4a64','#0a1018'],alley:['#121822','#34405a','#080c14'],mine3:['#06080e','#1a2236','#030408'],tower:['#101828','#40507a','#060a14']});
Object.assign(GRADE_OF,{dock:'fortress',alley:'fortress',mine3:'vault',tower:'fortress',storm:'fortress',airship:'fortress',gauss:'fortress',gaussvn:'fortress',lighthouse:'dawn'});
Object.assign(MOTES,{dock:[0xdfe8ff,50,.05,.05],tower:[0xdfe8ff,60,.05,.06],mine3:[0x8ab8ff,80,.05,.08]});
Object.assign(MAP_SONG,{dock:'yard',gauss:'town',mine3:'sewer',tower:'yard'});
Object.assign(VN_SETS,{airship:'bg_airship',gaussvn:'bg_gauss',lighthouse:'bg_lighthouse'});
SETS.airship=function(){SETS.title();setFog(0x0a1018,.35);};
SETS.gaussvn=function(){SETS.title();setFog(0x101828,.35);};
SETS.lighthouse=function(){SETS.dawn();};
Object.assign(SET_SONG,{airship:'yard',gaussvn:'town',lighthouse:'dawn'});

/* rain + lightning used on boards and free maps */
function stormRain(box,n=420){const [x0,y0,z0,x1,y1,z1]=box,g=new THREE.BufferGeometry(),p=new Float32Array(n*6);
  for(let q=0;q<n;q++){const x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0),z=z0+rnd()*(z1-z0);p.set([x,y,z,x+.18,y-.5,z],q*6);}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));const L=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xb8c8e0,transparent:true,opacity:.42,depthWrite:false}));E.world.add(L);
  E.fxs.push(dt=>{if(!L.parent)return false;const a=g.attributes.position.array;for(let q=0;q<n;q++){const o=q*6;let dy=dt*(14+(q%5));a[o+1]-=dy;a[o+4]-=dy;a[o]+=dt*4;a[o+3]+=dt*4;
    if(a[o+4]<y0){const x=x0+rnd()*(x1-x0),z=z0+rnd()*(z1-z0);a.set([x,y1,z,x+.18,y1-.5,z],o);}}g.attributes.position.needsUpdate=true;});return L;}
function lightning(every=6){let t=every*rnd(),f=0;const l=new THREE.DirectionalLight(0xd8e4ff,0);l.position.set(4,12,-6);E.world.add(l);
  E.fxs.push(dt=>{if(!l.parent)return false;t-=dt;if(t<0){t=every*(.5+rnd());f=.32;if(typeof sfx==='function'&&E.mode!=='scene'&&rnd()<.5)try{sfx('rumble');}catch(e){}}
    if(f>0){f-=dt;l.intensity=f>.22?2.6:f>.14?.2:f>.06?1.8:0;}else l.intensity=0;});return l;}
function chain(x,y0,z,len,col=0x4a4a52){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:col,metalness:.8,roughness:.4});
  for(let k=0;k<len/.32;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(.12,.035,5,10),m);r.position.y=y0+k*.32;r.rotation.y=k%2?Math.PI/2:0;g.add(r);}g.position.set(x,0,z);E.world.add(g);return g;}
function floatRock(x,y,z,s,col=0x3a404c){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),new THREE.MeshStandardMaterial({color:col,roughness:.95,flatShading:true}));
  m.scale.y=.55;m.position.set(x,y,z);m.rotation.y=rnd()*3;E.world.add(m);const ph=rnd()*6;E.fxs.push((dt,t)=>{if(!m.parent)return false;m.position.y=y+Math.sin(t*.6+ph)*.15;});return m;}
function magnetCan(x,y,z,s=1){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.4*s,.4*s,1.2*s,12),new THREE.MeshStandardMaterial({color:0x6a5a3a,metalness:.8,roughness:.35}));
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.3*s,.3*s,.8*s,12),new THREE.MeshStandardMaterial({color:0x9ad8ff,emissive:0x4ab8ff,emissiveIntensity:1.2,transparent:true,opacity:.85}));
  g.add(b,c);g.position.set(x,y,z);E.world.add(g);const l=new THREE.PointLight(0x7ac8ff,1.2,6);l.position.set(x,y,z);E.world.add(l);flicker(l,1.2,.5,7);return g;}
{const o=backdrop;backdrop=function(th){
  if(!CH3_THEMES.includes(th))return o(th);
  const R=OFF+.5,z0=-R-.6;
  if(th==='dock'){setFog(0x1a2232,.5);E.scene.fog.near=13;E.scene.fog.far=36;
    for(let k=-3;k<=3;k++){block(.3,2.6,.3,k*2.3,-.2,z0-.2,texMat('rust',1,3,{color:0x6a5a48}));}block(N+5,.25,.3,0,1.1,z0-.2,texMat('rust',N,1,{color:0x6a5a48}));
    floatRock(-5,-2,-7,1.6);floatRock(4,-1,-8,2.2);floatRock(7,1,-4,1.1);chain(-4.5,-1,-7.5,6);
    const hull=block(4.4,1.6,1.6,R+2.2,0,-1.4,texMat('rust',3,1,{color:0x5a4a3a}));hull.rotation.y=.5;
    keyLight(0xb8c8e8,.5,[-5,10,6]);stormRain([-8,-1,-8,8,9,8]);lightning(5);return 'rust';}
  if(th==='alley'){setFog(0x141a26,.48);E.scene.fog.near=12;E.scene.fog.far=32;
    block(N+5,5,.8,0,0,z0-.7,texMat('fstone',N+5,5,{color:0x6a7488}));
    for(let k=-2;k<=2;k++){const l=new THREE.PointLight(0xffb060,1.1,6);l.position.set(k*2.8,2.4,z0+.2);E.world.add(l);flicker(l,1.1,.3,3+k);fbHaloLike(k*2.8,z0+.6);}
    [[-R-.9,-2],[R+.9,0],[-R-.9,2.6]].forEach(([x,z])=>block(.25,3.2,.25,x,0,z,new THREE.MeshStandardMaterial({color:0xa88a4a,metalness:.8,roughness:.4})));
    keyLight(0xb8c4e0,.48,[-5,10,6]);stormRain([-7,0,-7,7,8,7],320);lightning(7);return 'fstone';}
  if(th==='mine3'){setFog(0x05070c,.6);E.scene.fog.near=10;E.scene.fog.far=26;
    block(N+5,4.4,.8,0,0,z0-.7,new THREE.MeshStandardMaterial({map:envTex('tx_magnetite',N+5,4.4),roughness:.9}));
    for(let k=-3;k<=3;k+=2){block(.35,3.6,.35,k*2,0,z0-.1,texMat('rust',1,3,{color:0x5a4a3a}));}
    [[-3,z0+.4],[3,z0+.4]].forEach(([x,z])=>magnetCan(x,2.4,z,.8));
    keyLight(0x9ab8e8,.7,[-5,10,6]);dustField(120,[-6,0,-6,6,4,6],0x9ad8ff,.05,.1);return 'rust';}
  if(th==='tower'){setFog(0x1a2438,.55);E.scene.fog.near=14;E.scene.fog.far=40;
    for(let k=-2;k<=2;k++)block(.28,6,.28,k*3,-3,z0-.3,new THREE.MeshStandardMaterial({color:0x5a5a64,metalness:.8,roughness:.4}));
    floatRock(-6,-3,-6,2);floatRock(6,-2.6,-5,1.6);floatRock(0,-4,-9,3);
    const rod=new THREE.Mesh(new THREE.ConeGeometry(.12,3.4,6),new THREE.MeshStandardMaterial({color:0xc87a40,metalness:.9,roughness:.3}));rod.position.set(0,4.6,z0-.4);E.world.add(rod);
    keyLight(0xc8d4f0,.55,[-5,10,6]);stormRain([-8,-2,-8,8,10,8],460);lightning(4);return 'rust';}
  return o(th);};}
function fbHaloLike(x,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:haloTex(),color:0xffa850,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set(x,.02,z);E.world.add(m);}

/* free-map storm: rain is already there on non-snow maps; add lightning + wind streaks */
HOOK.after('buildFree',M=>{if(!M.storm)return;lightning(M.storm===2?4:6);
  const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:0xe8f4ff,transparent:true,opacity:.22,depthWrite:false}),[W0,H0]=M.size;
  for(let k=0;k<40;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1.4+rnd()*1.6,.04),mat);m.rotation.x=-Math.PI/2;m.position.set(rnd()*W0,.4+rnd()*3,rnd()*H0);m.userData.v=4+rnd()*4;g.add(m);}
  E.world.add(g);E.fxs.push(dt=>{if(!g.parent)return false;g.children.forEach(m=>{m.position.x+=m.userData.v*dt;if(m.position.x>W0+2)m.position.x=-2;});});});
