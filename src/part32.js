/* ======================= PAINTED PIXEL SPRITES for the party (sheet: idle, walkA, walkB, atk) ======================= */
const CH_FR=['idle','walkA','walkB','atk'];
const CH_ART={ryan:{cw:76,ch:98,body:98},claire:{cw:80,ch:98,body:98}};
/* enemies: two frames (idle, atk); only used on the battle board and in battle close-ups */
Object.assign(CH_ART,{miner:{cw:154,ch:98,body:98,fr:['idle','atk'],foe:1},hound:{cw:104,ch:74,body:74,fr:['idle','atk'],foe:1},sweeper:{cw:104,ch:80,body:78,fr:['idle','atk'],foe:1},
 guard:{cw:116,ch:100,body:100,fr:['idle','atk'],foe:1},mech:{cw:188,ch:142,body:142,fr:['idle','atk'],foe:1},wolf:{cw:122,ch:95,body:78,fr:['idle','atk'],foe:1},
 frostguard:{cw:154,ch:102,body:102,fr:['idle','atk'],foe:1},turret:{cw:138,ch:123,body:86,fr:['idle','atk'],foe:1},crystal:{cw:134,ch:102,body:102,fr:['idle','atk'],foe:1},
 colossus:{cw:140,ch:152,body:152,fr:['idle','atk'],foe:1,scale:1.35}});
const chUse=kind=>CH_ART[kind]&&chReady(kind)&&(!CH_ART[kind].foe||E.mode==='battle');
const CHT={};   // kind -> {idle,walkA,walkB,atk,hurt,win} textures once loaded
function chCanvas(img,meta,k){const c=cvs(meta.cw,meta.ch),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,k*meta.cw,0,meta.cw,meta.ch,0,0,meta.cw,meta.ch);return c;}
function chTilt(src,rot,dx=0){const c=cvs(src.width,src.height),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(src.width/2+dx,src.height);g.rotate(rot);g.drawImage(src,-src.width/2,-src.height);return c;}
function chReady(kind){return !!CHT[kind];}
function chSet(kind){const T=CHT[kind];return{idle:[T.idle,T.idle],walk:T.walkA?[T.walkA,T.idle,T.walkB,T.idle]:[T.idle,T.idle]};}
/* swap a live sprite over to the painted frames (keeps its height) */
function chApply(s){if(!s||s.painted||!s.kind||!chUse(s.kind))return;const set=chSet(s.kind),T=CHT[s.kind],M=CH_ART[s.kind];
  const h=s.plane.geometry.parameters.height*(M.foe?1:1.06)*(M.scale||1)*M.ch/M.body,asp=M.cw/M.ch;s.plane.geometry.dispose();s.plane.geometry=new THREE.PlaneGeometry(h*asp,h);s.plane.position.y=h/2;
  s.idleF=set.idle;s.walkF=set.walk;const sf=s.setFrames;sf(s.walking?set.walk:set.idle);
  s.setFrames=f=>{if(f&&f.every(t=>t&&t.__ch))sf(f);};if(!s.walking)s.speed=1.6;s.painted=true;s.pose=null;s.mat.emissive.setHex(0x6a6a70);s.mat.emissiveMap=s.frames[0];s.mat.needsUpdate=true;}
Object.entries(CH_ART).forEach(([kind,meta])=>{const img=new Image();img.onload=()=>{const names=meta.fr||CH_FR,c={};names.forEach((n,k)=>c[n]=chCanvas(img,meta,k));
  const T={};Object.entries(c).forEach(([n,cv])=>T[n]=tex(cv));T.hurt=tex(chTilt(c.idle,-.16,-3));T.wind=tex(chTilt(c.walkB||c.idle,-.08,-2));T.win=T.idle;
  Object.values(T).forEach(t=>t.__ch=1);CHT[kind]=T;
  E.sprites.forEach(s=>{if(s.kind===kind)chApply(s);});};img.src='env/ch_'+kind+'.webp';});

{const o=makeSprite;makeSprite=function(frames,hgt,opts={}){const s=o(frames,hgt,opts);if(s.kind&&CH_ART[s.kind]&&chReady(s.kind))chApply(s);return s;};}
/* hrChar sets walkF after makeSprite; re-apply so walking uses the painted cycle */
{const o=hrChar;hrChar=function(kind,h){const s=o(kind,h);if(chUse(kind)){s.painted=false;chApply(s);}return s;};}
/* battle poses */
{const o=getPose;getPose=function(s,pose){if(s&&s.painted&&CHT[s.kind]){const T=CHT[s.kind];
  return {strike:T.atk,cast:T.atk,aim:T.atk,follow:T.atk,dash:T.walkA,wind:T.wind,hurt:T.hurt,win:T.win}[pose]||null;}return o(s,pose);};}
/* theater close-ups */
{const o=hrSet;hrSet=function(kind,tank){if(CH_ART[kind]&&chReady(kind)){const T=CHT[kind];
  return{idle:[T.idle,T.idle],wind:[T.wind,T.wind,T.wind],dash:T.walkA?[T.walkA,T.walkB]:[T.wind,T.wind],strike:[T.atk,T.atk,T.atk],hurt:[T.hurt],cast:[T.atk,T.atk,T.atk],aim:[T.atk,T.atk],win:[T.win,T.win]};}
  return o(kind,tank);};}
{const o=thSprite;thSprite=function(src,h){const s=o(src,h);if(s&&src&&CH_ART[src.kind]&&chReady(src.kind)){const M=CH_ART[src.kind],asp=M.cw/M.ch,hh=s.plane.geometry.parameters.height*M.ch/M.body;
  s.plane.geometry.dispose();s.plane.geometry=new THREE.PlaneGeometry(hh*asp,hh);s.plane.position.y=hh/2;}return s;};}
/* units strike their attack pose whenever they act (hop from an action, not from being hit) */
let chHurt=new Set();
{const o=damageUnit;damageUnit=function(u,amt){if(u&&u.spr)chHurt.add(u.spr);const r=o(u,amt);setTimeout(()=>u&&u.spr&&chHurt.delete(u.spr),400);return r;};}
function chTick(dt,t){E.sprites.forEach(s=>{if(!s.painted)return;if(s.mat.emissiveMap!==s.mat.map){s.mat.emissiveMap=s.mat.map;s.mat.needsUpdate=true;}
  if(E.mode==='battle'&&!CH_ART[s.kind].foe&&s.hop>.9&&!s.busy&&!s.chAtk&&!chHurt.has(s)&&!s.pose){s.chAtk=.38;s.pose=CHT[s.kind].atk;}
  if(s.chAtk){s.chAtk-=dt;if(s.chAtk<=0){s.chAtk=0;if(s.pose===CHT[s.kind].atk&&!s.busy)s.pose=null;}}
  s.mesh.scale.y=s.walking||s.pose?1:1+Math.sin(t*2.2+s.t)*.012;});}
E.fxs.push(chTick);
/* fxs is cleared on some scene changes; keep the tick alive */
{const o=clearWorld;clearWorld=function(...a){const r=o(...a);if(!E.fxs.includes(chTick))E.fxs.push(chTick);return r;};}
/* hit flash restores the old dark emissive; painted sprites keep their own glow */
{const o=hitFlash;hitFlash=function(s,col){o(s,col);if(s&&s.painted)setTimeout(()=>{if(s.painted&&s.mat.emissive.getHex()===0x1c1c26)s.mat.emissive.setHex(0x6a6a70);},160);};}

/* tall sprites on the raised back row hide under the enemy list: frame the board a little lower */
function backRowCam(){if(!B)return;const tall=B.enemies.some(e=>e.alive&&e.j<=1&&(hAt(e.i,e.j)>=1||['colossus','mech','turret'].includes(e.type)));if(!tall)return;
  const big=B.enemies.some(e=>e.alive&&e.type==='colossus');
  if(N===9){if(big)innerWidth<600?look(0,15.4,16.4,0,1.2,-1.9):look(0,13.4,13.8,0,1,-1.15);return;}
  if(big)innerWidth<600?look(0,14.4,15.2,0,1.1,-1.6):look(0,10.6,11.2,0,1.05,-1.7);
  else innerWidth<600?look(0,13.6,15.6,0,.3,-1.1):look(0,9.9,11.6,0,.35,-1.25);}
{const o=startBattle;startBattle=function(cfg){const r=o(cfg);backRowCam();return r;};}
{const b=$('cam-0'),o=b.onclick;b.onclick=e=>{o&&o(e);backRowCam();};}
