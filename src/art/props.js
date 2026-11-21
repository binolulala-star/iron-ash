/* ======================= PAINTED PROPS (billboards that turn to the camera) ======================= */
const PROP_AR={pr_barrel:.73,pr_crates:1.01,pr_lamp:.52,pr_sled:1.21,pr_valve:.63,pr_sign:.63,pr_minecart:1.02,pr_drum:.53,pr_vendor:.81,pr_lamp2:.45,pr_tools:1.09,pr_bench:1.22};
const PROP_MAT={};
function fbProp(name,x,z,h,{r=0,glow=0}={}){
  const mat=PROP_MAT[name]||(PROP_MAT[name]=new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load('env/'+name+'.webp'),transparent:true,alphaTest:.45,emissive:0x1c1c22,side:THREE.DoubleSide}));
  const w=h*(PROP_AR[name]||1),g=new THREE.Group(),p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);p.position.y=h/2;g.add(p);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(w*.42,16),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.32,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.scale.y=.45;sh.position.y=.03;g.add(sh);
  g.position.set(x,0,z);E.world.add(g);if(r)FB.circ.push([x,z,r]);if(FB.mm)FB.mm.push([x-.3,z-.3,x+.3,z+.3,'#6a5a48']);
  if(glow){const l=new THREE.PointLight(0xffb060,glow,6);l.position.set(x,h*.8,z);E.world.add(l);fbHalo(x,z,1.6,0xffa850,.3);}
  E.fxs.push(()=>{if(!g.parent)return false;const c=E.camera.position;p.rotation.y=Math.atan2(c.x-x,c.z-z);});return g;}
const MAP_PROPS={
 frostport:[['pr_barrel',33.2,22.8,1],['pr_barrel',13.4,16.4,.95],['pr_crates',38.4,22.6,1.3],['pr_sled',30.6,23.6,1.1],['pr_valve',25.6,20.4,1.4],['pr_sign',23.6,3.2,1.8],
   ['pr_lamp',6.4,15.6,2.6,{glow:.9}],['pr_crates',2.6,24.4,1.2],['pr_barrel',41,12.6,.95],['pr_sled',17.6,9.4,1.05]],
 glacier:[['pr_sled',41,25.2,1.1],['pr_barrel',33.2,25.6,.95],['pr_sign',9.6,28.4,1.8],['pr_crates',44,29,1.2]],
 fortress:[['pr_barrel',11.4,31.2,.95],['pr_barrel',11.6,32.6,.95],['pr_crates',36.4,30.6,1.3],['pr_valve',15.4,12.8,1.4],['pr_sign',22,30.2,1.7],['pr_crates',14.2,6,1.2],['pr_lamp',30.4,17,2.6,{glow:.9}]],
 town:[['pr_minecart',44,11.4,1.4],['pr_drum',59.4,21.8,1.15],['pr_vendor',36.6,25.6,1.9],['pr_bench',35.6,29.2,1.05],['pr_tools',49.4,21,1.1],['pr_drum',8.6,22.4,1.15],
   ['pr_lamp2',20.6,26.8,2.6,{glow:.8}],['pr_lamp2',44,26.9,2.6,{glow:.8}],['pr_minecart',56.6,7.4,1.4],['pr_bench',14.2,26.4,1.05]],
};
HOOK.after('buildFree',M=>{const id=Object.keys(MAPS).find(k=>MAPS[k]===M),L=MAP_PROPS[id];if(!L)return;
  const before=FB.circ.length;L.forEach(([n,x,z,h,opt])=>fbProp(n,x,z,h,Object.assign({r:h>2?.25:.38},opt||{})));
  if(X.colCache&&FB.circ.length>before)X.colCache.circ=X.colCache.circ.concat(FB.circ.slice(before));X.col=M.colliders?M.colliders():X.col;});
HOOK.after('buildTown',()=>(MAP_PROPS.town||[]).forEach(([n,x,z,h,opt])=>fbProp(n,x,z,h,opt||{})));
