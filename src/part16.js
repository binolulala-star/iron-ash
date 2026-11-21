/* ======================= CHAPTER 2 — BATTLE SYSTEMS (heights · ice · cold · new foes) ======================= */
/* ---- pixel textures ---- */
{const o=pixTex;pixTex=function(kind){
  if(!['snow','ice','frost','fstone','vent'].includes(kind))return o(kind);
  const c=cvs(16,16),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const noise=(base,cols,n)=>{P(base,0,0,16,16);for(let k=0;k<n;k++)P(cols[(rnd()*cols.length)|0],(rnd()*16)|0,(rnd()*16)|0);};
  if(kind==='snow'){noise('#a2acba',['#aeb8c4','#96a2b0','#b8c0ca','#8a96a6'],80);P('#7a8698',0,15,16,1);}
  if(kind==='ice'){noise('#7eb4d8',['#8ec4e6','#6aa2c8','#a8d8f4'],40);for(let k=0;k<4;k++){const x=(rnd()*12)|0,y=(rnd()*14)|0;P('#d8f2ff',x,y,4,1);P('#d8f2ff',x+1,y+1,2,1);}P('#5a8ab0',0,0,16,1);}
  if(kind==='frost'){noise('#56606e',['#606a78','#4a5260','#6e7886'],60);P('#3a424e',0,0,16,1);P('#3a424e',0,0,1,16);for(let k=0;k<10;k++)P('#c8dcec',(rnd()*16)|0,(rnd()*16)|0);P('#2e343e',2,2);P('#2e343e',13,13);}
  if(kind==='fstone'){P('#3a3e46',0,0,16,16);[[0,0,7,5],[8,0,8,5],[0,6,4,5],[5,6,7,5],[13,6,3,5],[0,12,9,4],[10,12,6,4]].forEach(([x,y,w,h])=>{P('#565c66',x,y,w,h);P('#646a74',x,y,w,1);P('#4a5058',x,y+h-1,w,1);});for(let k=0;k<8;k++)P('#d8e4ee',(rnd()*16)|0,(rnd()*16)|0);}
  if(kind==='vent'){noise('#4a4a50',['#54545a','#3e3e44'],30);P('#2a2a2e',3,3,10,10);P('#c8a456',4,4,8,8);P('#3a2a1e',5,5,6,6);for(let k=5;k<11;k+=2)P('#ff9a40',k,6,1,4);}
  return tex(c);};}
Object.assign(FLOOR,{snow:'snow',glacier:'ice',fortress:'fstone',vault:'frost'});
Object.assign(ENV,{snow:['霜港鎮郊・雪原','−18°C · 積雪 40cm · 地面 L0–2'],glacier:['冰河裂谷','−24°C · 冰面濕滑 · 地面 L0–2'],
  fortress:['白銀之顎要塞','−21°C · 強風 · 地面 L0–2'],vault:['要塞地下・冰封記憶庫','−40°C · 記憶冰晶共鳴中 · 地面 L0–2']});
Object.assign(TILE_EL,{ice:'H2O'});
Object.assign(LOOT_TYPES,{snow:['si','oil','ice','scrap','si'],glacier:['ice','si','ice','scrap'],fortress:['scrap','oil','al','si'],vault:['ice','scrap','al','oil']});
Object.assign(THEME_SKY,{snow:['#2a3444','#6a7e96','#1a2230'],glacier:['#1e3448','#5a8ab0','#121e2c'],fortress:['#1a1e26','#4a5466','#0e1218'],vault:['#06101c','#1a3a5a','#040a12']});
const CH2_THEMES=['snow','glacier','fortress','vault'];
{const o=tileMat;tileMat=function(t){
  if(t==='ice')return TM.ice||(TM.ice=new THREE.MeshStandardMaterial({map:T('ice'),roughness:.08,metalness:.35,emissive:0x0a2a40}));
  if(t==='vent')return TM.vent||(TM.vent=new THREE.MeshStandardMaterial({map:T('vent'),roughness:.6,metalness:.5,emissive:0x2a1004}));
  return o(t);};}
/* steam valve prop */
{const o=refreshTile;refreshTile=function(i,j){o(i,j);if(B.tiles[i][j]!=='vent')return;const key=i+','+j;
  const p=new THREE.Group(),pipe=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.6,8),new THREE.MeshStandardMaterial({color:0x6a5a48,metalness:.7,roughness:.4}));pipe.position.y=.3;
  const wheel=new THREE.Mesh(new THREE.TorusGeometry(.16,.035,6,14),new THREE.MeshStandardMaterial({color:0xc85a3a,metalness:.6}));wheel.position.y=.52;wheel.rotation.x=Math.PI/2;
  const glow=new THREE.PointLight(0xff9a40,.8,2.4);glow.position.y=.4;p.add(pipe,wheel,glow);p.position.set(i-OFF,hAt(i,j)*HSTEP,j-OFF);p.traverse(x=>x.userData.cell=[i,j]);
  E.world.add(p);B.props[key]=p;
  const puffs=[];for(let k=0;k<5;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.12,6,4),new THREE.MeshBasicMaterial({color:0xe8eef4,transparent:true,opacity:.4,depthWrite:false}));s.userData.ph=k/5;p.add(s);puffs.push(s);}
  E.fxs.push((dt,t)=>{if(!p.parent)return false;puffs.forEach(s=>{const q=(t*.5+s.userData.ph)%1;s.position.set(Math.sin(q*9+s.userData.ph*6)*.08,.6+q*1.2,0);s.scale.setScalar(.6+q*1.6);s.material.opacity=.45*(1-q);});});};}
/* ---- battle backdrops ---- */
function snowfall(box,n=320,col=0xf4f8ff){const g=new THREE.BufferGeometry(),p=new Float32Array(n*3),[x0,y0,z0,x1,y1,z1]=box;
  for(let q=0;q<n;q++){p[q*3]=x0+rnd()*(x1-x0);p[q*3+1]=y0+rnd()*(y1-y0);p[q*3+2]=z0+rnd()*(z1-z0);}g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:col,size:.07,transparent:true,opacity:.85,depthWrite:false}));E.world.add(pts);
  E.fxs.push((dt,t)=>{if(!pts.parent)return false;const a=g.attributes.position.array;for(let q=0;q<n;q++){a[q*3+1]-=dt*(.7+(q%5)*.12);a[q*3]+=Math.sin(t*.8+q)*dt*.25+dt*.18;if(a[q*3+1]<y0){a[q*3+1]=y1;a[q*3]=x0+rnd()*(x1-x0);}}g.attributes.position.needsUpdate=true;});return pts;}
function pine(x,z,h=3){const g=new THREE.Group(),tr=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,h*.3,6),new THREE.MeshStandardMaterial({color:0x3a2a1e}));tr.position.y=h*.15;g.add(tr);
  for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(h*(.34-k*.08),h*.42,8),new THREE.MeshStandardMaterial({color:k===2?0xe8eef4:0x2a4a3e,roughness:.9}));c.position.y=h*(.32+k*.22);g.add(c);
    const sn=new THREE.Mesh(new THREE.ConeGeometry(h*(.3-k*.08),h*.12,8),new THREE.MeshStandardMaterial({color:0xe8eef4}));sn.position.y=h*(.46+k*.22);g.add(sn);}
  g.position.set(x,0,z);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});E.world.add(g);return g;}
function iceShard(x,z,h,col=0x9ad8ff){const m=new THREE.Mesh(new THREE.ConeGeometry(h*.22,h,5),new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.8,roughness:.05,metalness:.2,emissive:0x0a3050}));
  m.position.set(x,h/2,z);m.rotation.set((rnd()-.5)*.4,rnd()*3,(rnd()-.5)*.4);m.castShadow=true;E.world.add(m);return m;}
{const o=backdrop;backdrop=function(th){
  if(!CH2_THEMES.includes(th))return o(th);
  const R=OFF+.5,z0=-R-.6;
  if(th==='snow'){setFog(0x5a6a7e,.5);E.scene.fog.near=14;E.scene.fog.far=34;
    for(let k=-4;k<=4;k++)pine(k*2.3+rnd()*.6,z0-1.2-rnd()*2,2.6+rnd()*1.6);[[-R-1.4,-2],[-R-1.6,2],[R+1.4,-1],[R+1.5,3]].forEach(([x,z])=>pine(x,z,2.4+rnd()));
    keyLight(0xe8f0ff,.55,[-5,10,6]);snowfall([-7,0,-7,7,7,7]);return 'snow';}
  if(th==='glacier'){setFog(0x3a5a78,.6);E.scene.fog.near=13;E.scene.fog.far=32;
    for(let k=-5;k<=5;k++)block(1.6+rnd(),2.4+rnd()*3.4,1.4,k*1.8,0,z0-1-rnd()*1.2,new THREE.MeshStandardMaterial({color:0x8ec4e6,roughness:.15,metalness:.2,emissive:0x0a2a40,transparent:true,opacity:.92}));
    for(let k=0;k<8;k++)iceShard((rnd()-.5)*(N+4),z0-.4-rnd(),1+rnd()*1.6);
    const l=new THREE.PointLight(0x9ad8ff,1.4,14);l.position.set(0,3,z0+1);E.world.add(l);keyLight(0xd8eeff,.6,[-5,10,6]);snowfall([-7,0,-7,7,7,7],220);return 'frost';}
  if(th==='fortress'){setFog(0x1a1e26,.5);E.scene.fog.near=13;E.scene.fog.far=34;
    block(N+5,4.4,.8,0,0,z0-.7,texMat('fstone',N+5,4));for(let k=-3;k<=3;k++){block(.9,5.2,.9,k*2.4,0,z0-.4,texMat('fstone',1,4));}
    [[-R-.8,-1],[R+.8,1]].forEach(([x,z])=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.2,.5,8),new THREE.MeshStandardMaterial({color:0x2a2a2e,metalness:.6}));b.position.set(x,.9,z);E.world.add(b);
      const f=new THREE.PointLight(0xff9a40,1.8,8);f.position.set(x,1.4,z);E.world.add(f);flicker(f,1.8,.6,5+x);});
    keyLight(0xb8c8e0,.5,[-5,10,6]);snowfall([-7,0,-7,7,7,7],160);return 'fstone';}
  if(th==='vault'){setFog(0x050c16,.62);E.scene.fog.near=11;E.scene.fog.far=28;
    block(N+5,4,.8,0,0,z0-.7,texMat('frost',N+5,4));
    for(let k=0;k<14;k++)iceShard((rnd()-.5)*(N+6),z0-.2-rnd()*1.4,1+rnd()*2.6,[0x9ad8ff,0x7fe8ff,0xbfa8ff][k%3]);
    [[-3,z0+.4],[3,z0+.4],[0,z0-.2]].forEach(([x,z])=>{const l=new THREE.PointLight(0x7fe8ff,1.6,9);l.position.set(x,2,z);E.world.add(l);flicker(l,1.6,.4,2+x);});
    keyLight(0xb8d4f0,.85,[-5,10,6]);dustField(140,[-6,0,-6,6,4,6],0xbff4ff,.05,.12);return 'frost';}
};}
/* ---- recolored foes (board + theater) ---- */
function recolorCanvas(src,fn){const c=cvs(src.width,src.height),g=c.getContext('2d');g.drawImage(src,0,0);const d=g.getImageData(0,0,c.width,c.height),a=d.data;
  for(let k=0;k<a.length;k+=4){if(a[k+3]===0)continue;const r=a[k],gg=a[k+1],b=a[k+2],o=fn(r,gg,b);a[k]=Math.max(0,Math.min(255,o[0]|0));a[k+1]=Math.max(0,Math.min(255,o[1]|0));a[k+2]=Math.max(0,Math.min(255,o[2]|0));}
  g.putImageData(d,0,0);return c;}
const lum=(r,g,b)=>.3*r+.59*g+.11*b;
const isRed=(r,g,b)=>r>170&&g<110&&b<110,isOrange=(r,g,b)=>r>190&&g>90&&g<200&&b<90,isSkin=(r,g,b)=>r>150&&r>g&&g>b&&r-b>45&&r-b<130,isGold=(r,g,b)=>r>150&&g>110&&b<95&&r-b>70,isDark=(r,g,b)=>r+g+b<70;
const RC={
 wolf:(r,g,b)=>{if(isRed(r,g,b)||isDark(r,g,b))return[r,g,b];if(isOrange(r,g,b))return[90,210,255];const l=lum(r,g,b);return[l*1.05+82,l*1.1+90,l*1.15+104];},
 frost:(r,g,b)=>{if(isSkin(r,g,b)||isGold(r,g,b)||isDark(r,g,b))return[r,g,b];const l=lum(r,g,b);if(b>=r-14&&Math.abs(r-g)<40)return[l*1.15+62,l*1.2+70,l*1.25+86];return[l*.9+20,l*.95+26,l*1.05+40];},
 crystal:(r,g,b)=>{if(isDark(r,g,b))return[20,40,60];const l=lum(r,g,b);return[l*.55+40,l*.85+80,l*.9+120];},
 turret:(r,g,b)=>{if(isDark(r,g,b))return[r,g,b];if(g>r+25&&g>b)return[g*.4,g*.85,Math.min(255,g*1.15)];if(isOrange(r,g,b)||isGold(r,g,b))return[120,220,255];if(isRed(r,g,b))return[r,g,b];const l=lum(r,g,b);return[l*.8+20,l*.92+32,l*1.1+52];},
 colossus:(r,g,b)=>{if(isDark(r,g,b))return[r,g,b];if(isRed(r,g,b))return[120,230,255];if(isOrange(r,g,b))return[150,235,255];if(b>r+30)return[r*.6+60,g*.8+60,b*.9+40];const l=lum(r,g,b);return[l*1.05+56,l*1.12+70,l*1.2+92];},
};
const rcTex=(cv,fn)=>tex(recolorCanvas(cv,fn));
Object.assign(ENEMY,{
 wolf:{name:'蒸氣雪狼',hp:85,tg:20,atk:24,mv:4,smart:true,h:.95,speed:3,drop:['Fe',1],frames:()=>[rcTex(houndCanvas(0),RC.wolf),rcTex(houndCanvas(1),RC.wolf)]},
 frostguard:{name:'霜甲衛兵',hp:170,tg:90,atk:28,mv:2,h:1.5,drop:['Fe',2],frames:()=>[rcTex(humanCanvas('guard',0),RC.frost),rcTex(humanCanvas('guard',1),RC.frost)]},
 turret:{name:'寒霧砲台',hp:130,tg:60,atk:10,rng:4,ratk:30,mv:0,h:1.1,float:true,speed:4,drop:['Al',1],frames:()=>[rcTex(sweeperCanvas(0),RC.turret),rcTex(sweeperCanvas(1),RC.turret)]},
 crystal:{name:'冰晶化士兵',hp:110,tg:30,atk:20,mv:2,h:1.5,nonlethal:true,frames:()=>[rcTex(humanCanvas('guard',0),RC.crystal),rcTex(humanCanvas('guard',1),RC.crystal)]},
 colossus:{name:'永凍鍾擺',hp:980,tg:150,atk:58,rng:4,ratk:42,mv:1,h:2.6,speed:1.1,frames:()=>[rcTex(mechCanvas(0,true),RC.colossus),rcTex(mechCanvas(1,true),RC.colossus)]},
});
Object.assign(VERB,{wolf:['撲咬'],frostguard:['舉起冰盾撞向'],turret:['噴出寒霧','發射冰錐，命中'],crystal:['僵硬地揮拳打向'],colossus:['以鍾擺錘砸向','射出冰晶霰彈，命中']});
Object.assign(EXP_OF,{wolf:30,frostguard:48,turret:40,crystal:26,colossus:320});
Object.assign(GEAR,{
 heatsink:{name:'熱交換散熱片',who:'claire',hp:20,desc:'HP +20。機械鎧的寒氣上限 +2，比較不容易凍僵。'},
 furmantle:{name:'雪狼毛皮披肩',who:'ryan',hp:30,desc:'HP +30。北境獵人縫的披肩，暖得不像話。'},
 icepick:{name:'破冰鎬頭',who:'claire',atk:12,desc:'攻擊 +12。鎬尖對冰面與冰甲特別有效。'},
});
Object.assign(DROPS,{wolf:[['bandage',.3],['furmantle',.14]],frostguard:[['bandage',.4],['icepick',.18],['coffee',.15]],turret:[['capsule',.45]],crystal:[['bandage',.35],['coffee',.15]],colossus:[['heatsink',1],['coffee',1]]});
const CH2_ALT={wolf:['hound',RC.wolf],frostguard:['guard',RC.frost],crystal:['guard',RC.crystal],turret:['sweeper',RC.turret],colossus:['mech',RC.colossus]};
{const o=hrSet;hrSet=function(kind,tank=true){const a=CH2_ALT[kind];if(!a)return o(kind,tank);if(HR_CACHE[kind])return HR_CACHE[kind];
  const base=o(a[0],true);if(!base)return null;const set={};Object.entries(base).forEach(([k,arr])=>{set[k]=arr.map(t=>tex(recolorCanvas(t.image,a[1])));});return HR_CACHE[kind]=set;};}
Object.assign(TH_H2,{wolf:1.6,frostguard:2.5,crystal:2.5,turret:1.8,colossus:4.2});
{const o=recipeTargets;recipeTargets=function(r,pts,cells){if(r.id==='R16')return [];return o(r,pts,cells);};}

/* ---- ice sliding & falling ---- */
const isUnit=x=>!!(x&&x.key);
function slideFrom(x,di,dj){let n=0;if(!di&&!dj)return 0;
  while(B.tiles[x.i][x.j]==='ice'){const ni=x.i+di,nj=x.j+dj,h0=hAt(x.i,x.j);
    if(!inb(ni,nj)||occupied(ni,nj,x)||hAt(ni,nj)>h0){if(n||!isUnit(x)){const who=enemyAt(ni,nj);if(!isUnit(x)&&x.alive){damageEnemy(x,30,{raw:true});floatAt(W(x.i,x.j),'撞擊','#9fd4ff');if(who&&who!==x)damageEnemy(who,20,{raw:true});E.shake=.5;}}break;}
    x.i=ni;x.j=nj;n++;if(hAt(ni,nj)<h0){fallHit(x,h0-hAt(ni,nj));break;}if(n>12)break;}
  if(n){placeUnits(false);floatAt(W(x.i,x.j),'滑行 '+n+' 格','#bff4ff');burst(W(x.i,x.j),0xd8f4ff,18,1.2);}
  return n;}
function fallHit(x,dh){if(dh<=0)return;const d=40*dh;if(isUnit(x)){damageUnit(x,Math.round(d*.5));}else{damageEnemy(x,d,{raw:true});floatAt(W(x.i,x.j),'墜落','#ffd27a');}E.shake=.6;}
function CH2DO(mode,u,e,bi,bj,ebi,ebj,i,j){
  if(mode==='move'&&(u.i!==bi||u.j!==bj)){const di=u.i-bi,dj=u.j-bj,ax=Math.abs(di)>=Math.abs(dj);
    if(B.tiles[u.i][u.j]==='ice'){log(`${u.name}踩上冰面，煞不住腳……`);slideFrom(u,ax?Math.sign(di):0,ax?0:Math.sign(dj));}}
  if(mode==='pile'&&e){const di=Math.sign(ebi-u.i),dj=Math.sign(ebj-u.j);
    if(e.alive&&(e.i!==ebi||e.j!==ebj)){const dh=hAt(ebi,ebj)-hAt(e.i,e.j);if(dh>0)fallHit(e,dh);else if(e.alive&&B.tiles[e.i][e.j]==='ice'){log(`${e.name}被打飛到冰面上一路滑出去！`);slideFrom(e,di,dj);}}
    else if(e.alive){const ni=ebi+di,nj=ebj+dj;if(!inb(ni,nj)||B.tiles[ni]&&B.tiles[ni][nj]==='wall'||hAt(ni,nj)>hAt(ebi,ebj)){damageEnemy(e,25,{raw:true});floatAt(W(e.i,e.j),'撞牆','#c8a456');}}}
}
{const o=approach;approach=async function(m){const bi=m.i,bj=m.j;await o(m);
  if(B&&m.alive&&(m.i!==bi||m.j!==bj)&&B.tiles[m.i][m.j]==='ice'){const di=m.i-bi,dj=m.j-bj,ax=Math.abs(di)>=Math.abs(dj);if(slideFrom(m,ax?Math.sign(di):0,ax?0:Math.sign(dj)))await sleep(380);}};}

/* ---- height advantage + prism shield ---- */
{const o=damageEnemy;damageEnemy=function(e,amt,opt={}){
  if(B&&e&&e.alive&&!B.casting&&!opt.raw&&!opt.quiet&&B.phase==='player'){const u=B.units[B.sel];if(u&&u.alive){const dh=hAt(u.i,u.j)-hAt(e.i,e.j);
    if(dh>0){amt=Math.round(amt*(1+.25*dh));floatAt(W(e.i,e.j).add(new THREE.Vector3(-.5,.3,0)),'高處 +'+(25*dh)+'%','#ffd27a');}}}
  return o(e,amt,opt);};}
{const o=damageUnit;damageUnit=function(u,amt){
  if(B&&u&&u.alive){const a=B.curAtk;if(a&&a.alive){const dh=hAt(a.i,a.j)-hAt(u.i,u.j);if(dh>0)amt=Math.round(amt*(1+.25*dh));}
    if(u.shield&&amt>0){amt=Math.round(amt/2);u.shield=0;floatAt(u.spr.holder.position.clone().add(new THREE.Vector3(.4,.4,0)),'稜鏡反射','#bff4ff');
      if(a&&a.alive){const ref=Math.max(15,Math.round(amt*.6));setTimeout(()=>{if(B&&a.alive){damageEnemy(a,ref,{raw:true});burst(W(a.i,a.j),0xbff4ff,24,1.6);}},120);}}}
  return o(u,amt);};}

/* ---- cold / freezing (Claire's automail) ---- */
const coldCap=()=>3+(P.gear&&P.gear.claire==='heatsink'?2:0);
const nearVent=u=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(Math.abs(a)+Math.abs(b)>1)continue;const i=u.i+a,j=u.j+b;if(inb(i,j)&&B.tiles[i][j]==='vent')return true;}return false;};
function warmClaire(src){const c=B.units.claire;if(!c.alive)return;const was=(c.cold||0)>=coldCap();c.cold=0;c.warm=1;floatAt(c.spr.holder.position.clone(),was?'解凍！':'回暖','#ffb070');if(was)log(`${src}：克蕾雅的機械鎧解凍了。`);renderDeck();}
function coldTick(){const c=B.units.claire;if(!c.alive||!B.cfg.cold)return;
  if(nearVent(c)||c.warm){c.cold=0;c.warm=0;return;}
  c.cold=Math.min(coldCap(),(c.cold||0)+1);
  if(c.cold>=coldCap()){c.ap=Math.max(0,c.ap-1);floatAt(c.spr.holder.position.clone(),'凍僵 AP−1','#9fd4ff');log('克蕾雅的機械鎧結霜卡住了（AP −1）。站到蒸氣閥旁，或讓萊恩用碳火暖身。');
    if(!P.flags.tut_cold){P.flags.tut_cold=1;guide('凍僵','寒氣累積滿了，克蕾雅每回合少 1 AP。站到蒸氣閥（橘色閥門）旁邊、用 #R07 火牆或 #R03 蒸氣煙幕，或讓萊恩消耗 C×1 施放「碳火暖身」都能解凍。');}}
  else if(c.cold===coldCap()-1)floatAt(c.spr.holder.position.clone(),'機械鎧結霜中…','#9fd4ff');}
function CH2CAST(r,cells,inC){
  if(r.id==='R03'&&B.cfg.cold)warmClaire('蒸氣煙幕');
  if(r.id==='R07'&&B.cfg.cold){const c=B.units.claire;if(c.alive&&cells.some(([i,j])=>md(i,j,c.i,c.j)<=2))warmClaire('火牆的熱氣');}
  if(r.id==='R07'){cells.forEach(([i,j])=>{if(B.tiles[i][j]==='ice'){B.tiles[i][j]='water';refreshTile(i,j);}});}
}
{const o=endTurn;endTurn=async function(){const t0=B?B.turn:0;const r=await o();
  if(B&&B.turn>t0&&B.phase==='player'){['ryan','claire'].forEach(k=>{B.units[k].shield=0;});if(B.cfg.cold)coldTick();renderDeck();}return r;};}
{const o=enemyAct;enemyAct=async function(e){B.curAtk=e;try{
  if(e.type==='colossus'&&!e.stun&&B.turn%2===0)return await pendulumSweep(e);
  return await o(e);}finally{if(B)B.curAtk=null;}};}
async function pendulumSweep(e){
  const U=['ryan','claire'].map(k=>B.units[k]).filter(u=>u.alive);if(!U.length)return;
  const tgt=U.sort((a,b)=>md(a.i,a.j,e.i,e.j)-md(b.i,b.j,e.i,e.j))[0],row=tgt.j;
  banner('永凍鍾擺','橫掃・地面急速凍結');E.shake=1;await sleep(500);
  for(let i=0;i<N;i++){if(B.tiles[i][row]==='floor'||B.tiles[i][row]==='water'){B.tiles[i][row]='ice';refreshTile(i,row);}burst(W(i,row),0xd8f4ff,10,1.6);}
  U.filter(u=>u.j===row).forEach(u=>{damageUnit(u,e.d.ratk);if(u.key==='claire'&&B.cfg.cold){u.cold=Math.min(coldCap(),(u.cold||0)+1);}});
  log(`鍾擺掃過第 ${row} 列：整列地面結冰${U.some(u=>u.j===row)?'，站在線上的人被冰霜擊中':''}。`);
  if(e.hp<e.max*.5&&!e.enraged){e.enraged=true;banner('永凍鍾擺','核心過冷・暴走');log('鍾擺的核心開始過冷，周圍的地面全面結凍。蒸氣閥是唯一的熱源。');
    for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(B.tiles[i][j]==='floor'&&rnd()<.35){B.tiles[i][j]='ice';refreshTile(i,j);}}
  await sleep(500);
}
/* ---- deck: cold status + Ryan's warm action ---- */
{const o=renderDeck;renderDeck=function(){o();if(!B||B.phase==='field')return;const c=B.units.claire;
  const card=document.querySelector('#ucards [data-u="claire"] .st');
  if(card&&B.cfg.cold&&c.alive){const cap=coldCap(),v=c.cold||0;const s=v>=cap?'<em class="hot" style="color:#9fd4ff">凍僵</em>':`寒氣 ${'❄'.repeat(v)}${'·'.repeat(cap-v)}`;card.innerHTML=(card.innerHTML?card.innerHTML+' · ':'')+s;}
  ['ryan','claire'].forEach(k=>{const u=B.units[k],el=document.querySelector(`#ucards [data-u="${k}"] .st`);if(el&&u.shield)el.innerHTML=(el.innerHTML?el.innerHTML+' · ':'')+'<span style="color:#bff4ff">稜鏡護盾</span>';
    if(el&&u.alive&&hAt(u.i,u.j)>0)el.innerHTML=(el.innerHTML?el.innerHTML+' · ':'')+`高台 L${hAt(u.i,u.j)}`;});};}
{const o=renderActions;renderActions=function(){o();if(!B||!B.cfg.cold||B.phase!=='player')return;const u=B.units[B.sel];if(!u||u.key!=='ryan'||!u.alive)return;
  const c=B.units.claire,ok=u.ap>=1&&(B.pool.C||0)>=1&&c.alive&&md(u.i,u.j,c.i,c.j)<=2;
  const b=document.createElement('button');b.className='ab rc'+(ok?' ready':'');b.disabled=!ok;b.innerHTML=`碳火暖身<small>1 AP · C×1 · 2 格內的克蕾雅解凍</small>`;
  b.onclick=()=>{if(!ok)return;B.pool.C-=1;spend(u,1);burst(c.spr.holder.position.clone(),0xff9a40,30,1.4);warmClaire('萊恩的碳火');renderDeck();};
  const box=$('abtns'),end=box.querySelector('.ab.end');box.insertBefore(b,end||null);};}
/* ---- random terrain for ch2 skirmishes ---- */
{const o=battleSkirmish;battleSkirmish=function(form,theme){const c=o(form,theme);if(!CH2_THEMES.includes(theme))return c;
  const used=new Set(c.enemies.map(([,i,j])=>i+','+j).concat(c.res.map(([,i,j])=>i+','+j)));c.hgt=[];
  const pl=[[(rnd()*2)|0,2+((rnd()*2)|0)],[5+((rnd()*2)|0),2+((rnd()*3)|0)]];pl.forEach(([i,j])=>{c.hgt.push([i,j,1]);if(inb(i+1,j)&&rnd()<.6)c.hgt.push([i+1,j,1]);if(rnd()<.4)c.hgt.push([i,j+1,1]);});
  if(theme==='glacier'||theme==='snow'){for(let k=0;k<(theme==='glacier'?7:4);k++){const i=(rnd()*7)|0,j=2+((rnd()*4)|0);if(!used.has(i+','+j)&&!c.hgt.some(h=>h[0]===i&&h[1]===j))c.res.push(['ice',i,j]);}}
  const vi=rnd()<.5?0:6;if(!used.has(vi+',6'))c.res.push(['vent',vi,6]);
  c.cold=true;c.colTex=theme==='fortress'?'fstone':theme==='vault'?'frost':'snow';
  c.guide=theme==='glacier'?'冰面會讓人滑到撞上東西為止。用打樁機把敵人推上冰面，看它一路滑去撞牆。':'站上高台攻擊傷害 +25%。克蕾雅待在寒冷中會累積寒氣，記得靠近蒸氣閥。';return c;};}
/* ---- foe cut-ins (portraits arrive later) ---- */
Object.assign(CUT_LINES,{orrick:{melee:['擺錘的節拍，就是你們心跳停止的節拍。','記憶不過是熱量。我只是把它收好。','冷靜一點——永遠冷靜下去吧。'],
  angry:['你們竟敢……弄碎我的收藏！','區區軍犬，給我凍成標本！'],hurt:['……嘖，溫度上升了。','有意思，你們的熱量真是浪費。']}});
FOE_CUT.colossus={who:'orrick',k:'smile',hk:'cold',p:.6};
{const o=foeAttackCut;foeAttackCut=async function(att){const f=foeCut(att.ref);
  if(f&&f.who==='orrick'&&att.ref.hp<att.ref.max*.5){const el=$('th-cut');el.classList.add('foe');await thPilotCut('orrick',STAND.orrick&&STAND.orrick.includes('angry')?'angry':STAND.orrick?STAND.orrick[0]:'smile',pick(CUT_LINES.orrick.angry),'#7fe8ff');el.classList.remove('foe');return;}
  return o(att);};}
