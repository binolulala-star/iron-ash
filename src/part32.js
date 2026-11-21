/* ======================= PAINTED PIXEL SPRITES for the party (sheet: idle, walkA, walkB, atk) ======================= */
const CH_ART={ryan:{cw:76,ch:98},claire:{cw:80,ch:98}};
const CH_FR=['idle','walkA','walkB','atk'];
const CHT={};   // kind -> {idle,walkA,walkB,atk,hurt,win} textures once loaded
function chCanvas(img,meta,k){const c=cvs(meta.cw,meta.ch),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,k*meta.cw,0,meta.cw,meta.ch,0,0,meta.cw,meta.ch);return c;}
function chTilt(src,rot,dx=0){const c=cvs(src.width,src.height),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.translate(src.width/2+dx,src.height);g.rotate(rot);g.drawImage(src,-src.width/2,-src.height);return c;}
function chReady(kind){return !!CHT[kind];}
function chSet(kind){const T=CHT[kind];return{idle:[T.idle,T.idle],walk:[T.walkA,T.idle,T.walkB,T.idle]};}
/* swap a live sprite over to the painted frames (keeps its height) */
function chApply(s){if(!s||s.painted||!s.kind||!chReady(s.kind))return;const set=chSet(s.kind),T=CHT[s.kind];
  const h=s.plane.geometry.parameters.height,asp=CH_ART[s.kind].cw/CH_ART[s.kind].ch;s.plane.geometry.dispose();s.plane.geometry=new THREE.PlaneGeometry(h*asp*1.06,h*1.06);s.plane.position.y=h*1.06/2;
  s.idleF=set.idle;s.walkF=set.walk;s.setFrames(s.walking?set.walk:set.idle);if(!s.walking)s.speed=1.6;s.painted=true;s.pose=null;s.mat.emissive.setHex(0x6a6a70);s.mat.emissiveMap=s.frames[0];s.mat.needsUpdate=true;}
Object.entries(CH_ART).forEach(([kind,meta])=>{const img=new Image();img.onload=()=>{const c=CH_FR.map((n,k)=>chCanvas(img,meta,k));
  CHT[kind]={idle:tex(c[0]),walkA:tex(c[1]),walkB:tex(c[2]),atk:tex(c[3]),hurt:tex(chTilt(c[0],-.16,-3)),wind:tex(chTilt(c[2],-.08,-2)),win:tex(c[0])};
  E.sprites.forEach(s=>{if(s.kind===kind)chApply(s);});};img.src='env/ch_'+kind+'.webp';});

{const o=makeSprite;makeSprite=function(frames,hgt,opts={}){const s=o(frames,hgt,opts);if(s.kind&&CH_ART[s.kind]&&chReady(s.kind))chApply(s);return s;};}
/* hrChar sets walkF after makeSprite; re-apply so walking uses the painted cycle */
{const o=hrChar;hrChar=function(kind,h){const s=o(kind,h);if(CH_ART[kind]&&chReady(kind)){s.painted=false;chApply(s);}return s;};}
/* battle poses */
{const o=getPose;getPose=function(s,pose){if(s&&s.painted&&CHT[s.kind]){const T=CHT[s.kind];
  return {strike:T.atk,cast:T.atk,aim:T.atk,follow:T.atk,dash:T.walkA,wind:T.wind,hurt:T.hurt,win:T.win}[pose]||null;}return o(s,pose);};}
/* theater close-ups */
{const o=hrSet;hrSet=function(kind,tank){if(CH_ART[kind]&&chReady(kind)){const T=CHT[kind];
  return{idle:[T.idle,T.idle],wind:[T.wind,T.wind,T.wind],dash:[T.walkA,T.walkB],strike:[T.atk,T.atk,T.atk],hurt:[T.hurt],cast:[T.atk,T.atk,T.atk],aim:[T.atk,T.atk],win:[T.win,T.win]};}
  return o(kind,tank);};}
{const o=thSprite;thSprite=function(src,h){const s=o(src,h);if(s&&src&&CH_ART[src.kind]&&chReady(src.kind)){const asp=CH_ART[src.kind].cw/CH_ART[src.kind].ch,hh=s.plane.geometry.parameters.height;
  s.plane.geometry.dispose();s.plane.geometry=new THREE.PlaneGeometry(hh*asp,hh);s.plane.position.y=hh/2;}return s;};}
/* units strike their attack pose whenever they act (hop from an action, not from being hit) */
let chHurt=new Set();
{const o=damageUnit;damageUnit=function(u,amt){if(u&&u.spr)chHurt.add(u.spr);const r=o(u,amt);setTimeout(()=>u&&u.spr&&chHurt.delete(u.spr),400);return r;};}
function chTick(dt,t){E.sprites.forEach(s=>{if(!s.painted)return;if(s.mat.emissiveMap!==s.mat.map){s.mat.emissiveMap=s.mat.map;s.mat.needsUpdate=true;}
  if(E.mode==='battle'&&s.hop>.9&&!s.busy&&!s.chAtk&&!chHurt.has(s)&&!s.pose){s.chAtk=.38;s.pose=CHT[s.kind].atk;}
  if(s.chAtk){s.chAtk-=dt;if(s.chAtk<=0){s.chAtk=0;if(s.pose===CHT[s.kind].atk&&!s.busy)s.pose=null;}}
  s.mesh.scale.y=s.walking||s.pose?1:1+Math.sin(t*2.2+s.t)*.012;});}
E.fxs.push(chTick);
/* fxs is cleared on some scene changes; keep the tick alive */
{const o=clearWorld;clearWorld=function(...a){const r=o(...a);if(!E.fxs.includes(chTick))E.fxs.push(chTick);return r;};}
/* hit flash restores the old dark emissive; painted sprites keep their own glow */
{const o=hitFlash;hitFlash=function(s,col){o(s,col);if(s&&s.painted)setTimeout(()=>{if(s.painted&&s.mat.emissive.getHex()===0x1c1c26)s.mat.emissive.setHex(0x6a6a70);},160);};}
