/* ======================= PAINTED PASS 3: battle boards, train interior, hangar, story backdrops ======================= */
Object.assign(PROP_AR,{pr_bench2:1.19,pr_luggage:1.24,pr_cardtable:1.18,pr_stove:.7,pr_supply:1.53,pr_lantern:.41});
Object.assign(ENV_AR,{lm_hangarin:1.79,lm_hangargate:1.79,lm_trainwall:1.79,lm_cargowall:1.79});
/* preload so battle boards can build their materials synchronously */
const PIMG={};['oh_cobble','tx_sewerfloor','tx_concrete','tx_hangar','tx_trainfloor','tx_snowfield','ft_floor','tx_frostwall'].forEach(k=>{const im=new Image();im.src='env/'+k+'.webp';PIMG[k]=im;});
const BOARD_PAINT={town:['oh_cobble',0xb8b4b0],sewer:['tx_sewerfloor',0xb0b8b0],yard:['tx_concrete',0xa8a8ae],hangar:['tx_hangar',0xb4b4b8],train:['tx_trainfloor',0xc0b0a0],
 snow:['tx_snowfield',0x8a94a2],glacier:['tx_snowfield',0x8a96a8],fortress:['ft_floor',0xb0b0b4],vault:['tx_frostwall',0x8a9ab0]};
const BMAT={};
function boardMat(th,i,j){const p=BOARD_PAINT[th];if(!p)return null;const im=PIMG[p[0]];if(!im||!im.complete||!im.naturalWidth)return null;
  const K=3,a=((i%K)+K)%K,b=((j%K)+K)%K,key=th+a+b;if(BMAT[key])return BMAT[key];
  const t=new THREE.Texture(im);t.needsUpdate=true;t.repeat.set(1/K,1/K);t.offset.set(a/K,1-(b+1)/K);t.anisotropy=4;
  return BMAT[key]=new THREE.MeshStandardMaterial({map:t,color:p[1],roughness:.85,metalness:th==='hangar'?.25:0});}
{const o=refreshTile;refreshTile=function(i,j){o(i,j);const m=B.tileMesh[i]&&B.tileMesh[i][j];if(!m)return;
  if(m.material===tileMat('floor')){const pm=boardMat(B.cfg.theme,i,j);if(pm)m.material=pm;}};}

/* helpers */
function bgPlane(name,w,h,x,y,z,{tint=0xffffff,ry=0}={}){const t=new THREE.TextureLoader().load('env/'+name+'.webp');
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,color:tint,fog:false}));p.position.set(x,y,z);p.rotation.y=ry;E.world.add(p);return p;}
function hideBehind(z,keep=()=>false){const v=new THREE.Vector3();E.world.traverse(o=>{if(o.isMesh&&o.visible){o.getWorldPosition(v);if(v.z<z&&!keep(o))o.visible=false;}});}
function wallTex(name,len,h,rep){const t=new THREE.TextureLoader().load('env/'+name+'.webp');t.wrapS=THREE.RepeatWrapping;t.repeat.set(rep||Math.max(1,Math.round(len/(h*1.79))),1);return t;}
function paintFace(mesh,name,len,h,face=4){const t=wallTex(name,len,h);const m=new THREE.MeshStandardMaterial({map:t,roughness:.85,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.12});
  const base=Array.isArray(mesh.material)?mesh.material[0]:mesh.material;const arr=[base,base,base,base,base,base];arr[face]=m;mesh.material=arr;}
const isPlane=(o,w,h)=>o.isMesh&&o.geometry.type==='PlaneGeometry'&&Math.abs(o.geometry.parameters.width-w)<.01&&Math.abs(o.geometry.parameters.height-h)<.01;

/* battle backdrops */
{const o=backdrop;backdrop=function(th){const before=new Set(E.world.children);const r=o(th);const add=E.world.children.filter(c=>!before.has(c));
  const R=OFF+.5,z0=-R-.6;
  if(th==='hangar')bgPlane('lm_hangarin',24,13.4,0,5.2,-9.4,{tint:0x9a9aa0});
  if(th==='train'){add.forEach(c=>{if(isPlane(c,1.3,.9))c.visible=false;if(c.isMesh&&c.geometry.type==='BoxGeometry'&&Math.abs(c.position.z-z0)<.01)paintFace(c,'lm_trainwall',c.geometry.parameters.width,3.4);});}
  if(th==='yard'){add.forEach(c=>{if(isPlane(c,1.8,2.6))c.visible=false;if(c.isMesh&&c.geometry.type==='BoxGeometry'&&Math.abs(c.position.z-(z0-.6))<.01&&c.geometry.parameters.height===4.6){
    const m=facadeMat('lm_hangargate',c.geometry.parameters.width,4.6,.5);m.emissiveIntensity=.14;const base=c.material;c.material=[base,base,base,base,m,base];}});}
  return r;};}

/* fit a painted backdrop to the story camera: full width, top edge at the top of the frame, reaching down to the floor */
function fitBg(p,zp,ar=2.36){const cam=E.camera;cam.updateMatrixWorld();const hit=(nx,ny)=>{const v=new THREE.Vector3(nx,ny,.5).unproject(cam).sub(cam.position);const t=(zp-cam.position.z)/v.z;return cam.position.clone().add(v.multiplyScalar(t));};
  const tl=hit(-1,1),br=hit(1,-1),vw=br.x-tl.x,top=tl.y;let W=Math.max(vw*1.04,(top+.3)*ar),H=W/ar;p.scale.set(W/p.geometry.parameters.width,H/p.geometry.parameters.height,1);
  p.position.set((tl.x+br.x)/2,top-H/2+.05,zp);}
function storyBg(name,zp,tint){const p=bgPlane(name,10,10/2.36,0,0,zp,{tint});fitBg(p,zp);return p;}
/* painted-backdrop scenes: lower the camera so the floor is a strip and the painting fills the frame */
function flatCam(name){const c=E.camera.position.clone(),t=E.controls.target.clone(),ty=t.y+.45,ny=ty+(c.y-t.y)*.38;look(c.x,ny,c.z,t.x,ty,t.z);
  if(name==='snowtrain')E.onTick=()=>{E.camera.position.y=ny+Math.sin(performance.now()/90)*.012;};}
/* story sets */
{const o=SETS.reactor;SETS.reactor=function(){o();flatCam('reactor');hideBehind(-1);storyBg('bg_reactor',-5,0xd8d8e0);};}
{const o=SETS.infirmary;SETS.infirmary=function(){o();flatCam('infirmary');hideBehind(-.4);storyBg('bg_hospital',-5,0xe0e0e0);};}
{const o=SETS.dawn;SETS.dawn=function(){o();flatCam('dawn');hideBehind(-1.5);storyBg('bg_dawn',-5,0xe8e0d8);};}
{const o=SETS.snowtrain;SETS.snowtrain=function(){o();flatCam('snowtrain');hideBehind(-1.3);storyBg('bg_snowtrain',-3.6,0xd8dce4);};}
{const o=SETS.train;SETS.train=function(){o();E.world.children.forEach(c=>{if(isPlane(c,1.4,1))c.visible=false;
  if(c.isMesh&&c.geometry.type==='BoxGeometry'&&c.geometry.parameters.width===12&&c.geometry.parameters.height===4)paintFace(c,'lm_trainwall',12,4);
    if(c.isMesh&&c.geometry.type==='BoxGeometry'&&c.geometry.parameters.width===1.6&&Math.abs(Math.abs(c.position.x)-2.4)<.01)c.visible=false;});
  [-2.4,2.4].forEach(x=>fbProp('pr_bench2',x,-1.5,1.35));};}
{const o=SETS.hangar;SETS.hangar=function(){o();bgPlane('lm_hangarin',26,14.5,0,5,-9,{tint:0x8a8a90});};}
{const o=SETS.aftermath;SETS.aftermath=function(){o();bgPlane('lm_hangarin',26,14.5,0,5,-9,{tint:0x9a7a6a});};}

/* walkable train: painted walls, floors and furniture */
function paintTrain(){const z0=TR.z0;
  E.world.children.filter(c=>isPlane(c,1.2,.8)).forEach(c=>c.visible=false);
  TR.cars.forEach(([x0,x1],ci)=>{const len=x1-x0,h=2.4;
    const w=new THREE.Mesh(new THREE.PlaneGeometry(len,h),new THREE.MeshStandardMaterial({map:wallTex(ci<2?'lm_trainwall':'lm_cargowall',len,h),roughness:.85,emissive:0xffffff,emissiveIntensity:.1}));
    w.material.emissiveMap=w.material.map;w.position.set((x0+x1)/2,h/2,z0+.012);E.world.add(w);
    const ft=new THREE.TextureLoader().load('env/tx_trainfloor.webp');ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.center.set(.5,.5);ft.rotation=Math.PI/2;ft.repeat.set((TR.z1-TR.z0)/2.6,len/2.6);
    const f=new THREE.Mesh(new THREE.PlaneGeometry(len,TR.z1-TR.z0),new THREE.MeshStandardMaterial({map:ft,roughness:.9,color:0xc8b8a8}));f.rotation.x=-Math.PI/2;f.position.set((x0+x1)/2,.02,(TR.z0+TR.z1)/2);f.receiveShadow=true;E.world.add(f);});
  // benches and card table become painted props (the old boxes keep their colliders, just hidden)
  const bench=[[2.4,TR.z0+.55],[6.6,TR.z0+.55],[9.6,TR.z0+.55],[3.6,TR.z1-.55],[8,TR.z1-.55]];
  E.world.children.forEach(c=>{if(!c.isMesh||c.geometry.type!=='BoxGeometry')return;const g=c.geometry.parameters,p=c.position;
    if(g.width===1.6&&(g.height===.5||g.height===.9)&&bench.some(([x,z])=>Math.abs(p.x-x)<.01&&Math.abs(p.z-z)<.7))c.visible=false;
    if(g.width===1&&g.depth===.9&&Math.abs(p.x-19.6)<.01)c.visible=false;});
  E.world.children.filter(c=>isPlane(c,.12,.18)).forEach(c=>c.visible=false);
  bench.forEach(([x,z])=>fbProp('pr_bench2',x,z,1.25,{r:0}));fbProp('pr_cardtable',19.6,4,1.05,{r:0});
  fbProp('pr_luggage',5,TR.z1-.5,.9,{r:.35});fbProp('pr_stove',16.6,TR.z1-.45,1.2,{r:.35,glow:.6});fbProp('pr_supply',30.4,TR.z0+.6,1,{r:0});
  [5.6,17.6,29.2].forEach(x=>{const g=fbProp('pr_lantern',x,TR.z0+.3,.9,{r:0});g.position.y=1.15;g.children[1].visible=false;});}
HOOK.after('buildFree',M=>{if(M===MAPS.train)paintTrain();if(M===MAPS.yard)paintYard();});

/* yard: hangar gate + containers */
ENV_KIND.container=null;
{const o=mat2;mat2=function(k,rx,ry,opt={}){if(k!=='container'||ENV_MAP!=='yard')return o(k,rx,ry,opt);
  const c=new THREE.Color(opt.color||0xffffff).lerp(new THREE.Color(0xffffff),.5);
  return new THREE.MeshStandardMaterial({map:envRep('tx_container',Math.max(1,Math.round(rx/(1.79*ry))),1),color:c,roughness:.8,metalness:.2});};}
function paintYard(){E.world.children.forEach(c=>{if(isPlane(c,5.2,5.4))c.visible=false;if(c.isMesh&&c.geometry.type==='BoxGeometry'&&Math.abs(c.position.x-22)<.01&&Math.abs(c.position.z-1.9)<.01)c.visible=false;});
  lmPlane('lm_hangargate',12,6.7,22,3.35,3.03,0,{ei:.16});}

/* compact dialogue box: less height, smaller face, so scenes show more of the picture */
{const st=document.createElement('style');st.textContent=`
.st-box{min-height:112px;padding:11px 18px 9px;gap:14px}
.st-face{width:70px;height:91px}
.st-name{margin-bottom:3px;min-height:20px}
.st-text{font-size:clamp(14px,1.75vw,17px);line-height:1.65;min-height:3.3em}
.st-stand{bottom:calc(18px + 74px + env(safe-area-inset-bottom,0px))}
@media (max-width:560px){.st-box{min-height:96px;padding:10px 12px}.st-face{width:52px;height:68px}}`;document.body.appendChild(st);}
