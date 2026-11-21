/* ======================= PAINTED MATERIALS, PASS 2: roofs, side walls, ground, landmarks ======================= */
Object.assign(PROP_AR,{pr_sandbag:1.72,pr_rack:.98,pr_search:.56,pr_cannon:1.86,pr_cart:1.18,pr_flag:.51,pr_stall:1.12,pr_mailbox:.6,pr_snowbench:1.28,pr_woodpile:1.6,pr_snowman:.82,pr_fish:.71,
 pr_crates2:1.26,pr_pump:.69,pr_board:1.09,pr_laundry:1.29,pr_barrow:1.45,pr_scrap:1.34,pr_valve2:1.13,pr_grate:1.31,pr_brokencrate:1.55,pr_pipe:1.06,pr_acidbarrel:.66,pr_toolbox:1.5});
Object.assign(ENV_AR,{lm_shed:1.79,lm_mine:1.79,lm_vault:1.79,lm_clock:.424,lm_train:2.36});
let ENV_MAP=null;
/* procedural kind -> [painted texture, repeat scale, extra material options]; a function gets the current map id */
const ENV_KIND={
 snowroof:['tx_snowroof',.5,{color:0xc4ccd8}],
 slate:['tx_slate',.55],
 rustroof:['tx_rustroof',.55],
 timber:['tx_timber',.45],
 plaster:['tx_plaster',.5],
 plank:['tx_plank',.6],
 stoneW:['tx_embank',.5],
 brick2:m=>m==='sewer'?['tx_sewerwall',.5]:['tx_brick',.6],
 mud:['tx_mud',.5,{color:0xb0aaa4}],
 canal:m=>m==='sewer'?['tx_acid',.4,{color:0x8a9a70,emissive:0x0a2006}]:['tx_acid',.4,{color:0xc8d8b0}],
 snow2:['tx_snowfield',.45,{color:0x98a2b0}],
 ice2:['tx_lake',.6],
 frost2:m=>m==='vault'?['tx_frostwall',.5]:null,
 flag:m=>m==='sewer'?['tx_sewerfloor',.6,{color:0xa8b0a8}]:['tx_concrete',.5,{color:0xa8acb4}],
 concrete:['tx_concrete',.5],
};
const ENV_TX2={};
function envRep(name,rx,ry){const key=name+'|'+rx.toFixed(3)+'|'+ry.toFixed(3);if(ENV_TX2[key])return ENV_TX2[key];
  const t=new THREE.TextureLoader().load('env/'+name+'.webp');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return ENV_TX2[key]=t;}
{const o=mat2;mat2=function(k,rx,ry,opt={}){
  let e=ENV_MAP&&ENV_KIND[k];if(typeof e==='function')e=e(ENV_MAP);if(!e)return o(k,rx,ry,opt);
  const [name,s,extra]=e,rest=Object.assign({},opt);delete rest.color;
  return new THREE.MeshStandardMaterial(Object.assign({map:envRep(name,Math.max(rx*s,.15),Math.max(ry*s,.15)),roughness:.9},rest,extra||{}));};}
/* rocks: painted ice-cliff skin */
{const o=fbRock;fbRock=function(...a){const m=o(...a);if(ENV_MAP){m.material.map=envRep('tx_icecliff',1,1);m.material.color.set(0xb8c2ce);m.material.flatShading=false;m.material.needsUpdate=true;}return m;};}

/* helpers for the landmark pieces */
function lmPlane(name,w,h,x,y,z,ry=0,{fb=.5,ei=.1,alpha=false}={}){const mat=facadeMat(name,w,h,fb);if(alpha){mat.transparent=false;mat.alphaTest=.5;}mat.emissiveIntensity=ei;
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);p.position.set(x,y,z);p.rotation.y=ry;p.receiveShadow=true;E.world.add(p);return p;}
function cylSkin(mesh,name,rx){mesh.material=new THREE.MeshStandardMaterial({map:envRep(name,rx,1),roughness:.8,emissive:0xffffff,emissiveMap:envRep(name,rx,1),emissiveIntensity:.06});}

const LANDMARK={
 frostport(){
  // heating tower: painted brick + brass skin, drop the old pasted windows
  const tw=E.world.children.find(o=>o.isMesh&&o.geometry.type==='CylinderGeometry'&&Math.abs(o.position.x-22)<.01&&Math.abs(o.position.z-17)<.01&&o.geometry.parameters.height===9);
  if(tw){cylSkin(tw,'lm_tower',1);E.world.children.filter(o=>o.isMesh&&o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.width===.5&&o.geometry.parameters.height===.8&&Math.hypot(o.position.x-22,o.position.z-17)<2.4).forEach(o=>o.visible=false);}
  // armored train: painted carriage sides on both long faces
  [[-4,8],[9,21],[22,34]].forEach(([x0,x1],i)=>{const w=x1-x0,cx=(x0+x1)/2,h=2.72;
    [[33.42,0],[30.58,Math.PI]].forEach(([z,ry])=>{const t=new THREE.TextureLoader().load('env/lm_train.webp');t.wrapS=THREE.RepeatWrapping;t.repeat.set(Math.max(1,Math.round(w/(h*2.36))),1);t.offset.x=i*.37;
      const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,alphaTest:.5,roughness:.7,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.08}));p.position.set(cx,h/2,z);p.rotation.y=ry;E.world.add(p);});});
  // sled depot back wall (inside face)
  lmPlane('lm_shed',5,2.8,36,1.4,15.52,0,{fb:.5});
 },
 town(){
  // clock tower on the town hall
  const tw=E.world.children.find(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===3&&o.geometry.parameters.height===5.5);
  if(tw){const m=facadeMat('lm_clock',3,5.5,.5);m.map.offset.y=1-m.map.repeat.y;m.emissiveIntensity=.14;const top=tw.material;tw.material=[m,m,top,top,m,m];}
  // mine entrance: painted face replaces the black hole + posts
  E.world.children.filter(o=>o.isMesh&&((o.geometry.type==='PlaneGeometry'&&o.geometry.parameters.width===2.4&&o.geometry.parameters.height===2.8)||
    (o.geometry.type==='BoxGeometry'&&Math.abs(o.position.z-3.1)<.05&&o.position.x>53&&o.position.x<57))).forEach(o=>o.visible=false);
  lmPlane('lm_mine',6.6,3.7,55,1.85,3.03,0,{ei:.12});
  // water tank
  const tk=E.world.children.find(o=>o.isMesh&&o.geometry.type==='CylinderGeometry'&&Math.abs(o.position.x-59.6)<.01&&o.geometry.parameters.height===2.8);
  if(tk)cylSkin(tk,'lm_tank',3);
 },
 vault(){
  // crystal shelves: painted shelf fronts (each one a different slice of the wall)
  let k=0;E.world.children.filter(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===2.4&&o.geometry.parameters.depth===.8&&o.geometry.parameters.height===2.2).forEach(o=>{
    const m=facadeMat('lm_vault',2.4,2.2,(k++*.27)%1);m.emissiveIntensity=.35;const side=o.material;o.material=[side,side,side,side,m,m];});
 },
};
{const o=buildFree;buildFree=function(M){const id=Object.keys(MAPS).find(k=>MAPS[k]===M);ENV_MAP=['sewer','yard','frostport','glacier','fortress','vault'].includes(id)?id:null;
  try{o(M);if(LANDMARK[id])LANDMARK[id]();}finally{ENV_MAP=null;}};}
{const o=buildTown;buildTown=function(M){ENV_MAP='town';try{const r=o(M);LANDMARK.town();return r;}finally{ENV_MAP=null;}};}

/* group 9 props */
Object.assign(MAP_PROPS,{
 sewer:[['pr_valve2',2.3,11.2,1.2],['pr_acidbarrel',12.6,2.2,1.1],['pr_toolbox',8.6,12.6,.8],['pr_brokencrate',30,12.4,.9],['pr_pipe',36,13,1],['pr_grate',24,20.6,.7],['pr_acidbarrel',40,21.4,1.1],['pr_valve2',31,28,1.2]],
 yard:[['pr_crates2',8,22,1.3],['pr_barrow',13,10,1],['pr_scrap',40,10,1.3],['pr_toolbox',27,13,.8],['pr_pump',4,28,1.4]],
});
MAP_PROPS.frostport=MAP_PROPS.frostport.concat([['pr_stall',17,25,2.2],['pr_mailbox',14.6,14.6,1.3],['pr_snowbench',26,25.2,1],['pr_woodpile',2.6,16,1.1],['pr_snowman',30,11,1.5],['pr_fish',39,24.6,1.05]]);
MAP_PROPS.fortress=MAP_PROPS.fortress.concat([['pr_sandbag',18,28.4,1],['pr_sandbag',26,28.4,1],['pr_rack',7.9,19.3,1.5],['pr_search',33.6,13.4,2],['pr_cannon',29,30.6,1.2],['pr_cart',40.4,22,1.6],['pr_flag',22,20,3.6]]);
MAP_PROPS.glacier=MAP_PROPS.glacier.concat([['pr_woodpile',40.8,28.8,1.1],['pr_fish',33,28.6,1]]);
MAP_PROPS.town=MAP_PROPS.town.concat([['pr_crates2',23.6,19.2,1.3],['pr_pump',30,30.2,1.5],['pr_board',39.6,21.2,1.6],['pr_laundry',12.4,20.8,1.5],['pr_barrow',47.6,13.6,1.1],['pr_scrap',52.6,12.6,1.2]]);
