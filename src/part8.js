/* ======================= ATTACK ANIMATION ======================= */
/* ---- pose frames (same canvas size as walk frames so the sprite plane never stretches) ---- */
const POSE_CACHE={};
function humanPose(k,pose){
  const sp=CHAR[k],W=20,H=28,c=cvs(W,H),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const lean={wind:-1,strike:1,hurt:-1,aim:0,cast:0}[pose]||0;
  // legs / stance
  if(pose==='strike'){P(sp.pants,6,20,2,5);P(sp.pants,12,20,2,5);P(sp.boots,5,24,3,2);P(sp.boots,12,24,4,2);}
  else if(pose==='hurt'){P(sp.pants,6,20,2,5);P(sp.pants,11,21,2,4);P(sp.boots,4,24,4,2);P(sp.boots,11,24,3,2);}
  else if(pose==='wind'){P(sp.pants,6,20,2,5);P(sp.pants,11,20,2,5);P(sp.boots,4,24,4,2);P(sp.boots,11,24,3,2);}
  else{P(sp.pants,7,20,2,5);P(sp.pants,11,20,2,5);P(sp.boots,6,24,3,2);P(sp.boots,11,24,3,2);}
  g.save();g.translate(lean,pose==='hurt'?1:0);
  P(sp.coat,6,11,8,10);P(sp.coatD,6,19,8,2);P(sp.coatD,13,12,1,7);P(sp.shirt,9,11,2,4);
  P(sp.skin,6,3,8,8);P(sp.skinD,6,10,8,1);P(sp.skinD,13,4,1,6);
  if(pose==='hurt'){P('#2a1a1a',8,8,2,1);P('#2a1a1a',11,8,2,1);P('#7a3a3a',9,9,2,2);}
  else{const eR=(k==='ryan'&&pose==='cast')?'#d8f8ff':sp.eyeR;P(sp.eyeL,8,7,1,2);P(eR,11,7,1,2);P('#7a4a3a',9,9,2,1);
    if(pose==='strike'||pose==='wind')P('#5a2a2a',9,9,2,1);}
  sp.hair(P,0);
  const C=sp.coat,S=sp.skin;
  const backArm=()=>{P(C,4,12,2,7);P(S,4,19,2,1);};
  const front={
    wind:()=>{P(C,14,7,2,6);P(S,14,5,2,2);},
    strike:()=>{P(C,14,12,4,2);P(S,18,12,2,2);},
    cast:()=>{P(C,14,4,2,8);P(S,14,2,2,2);},
    aim:()=>{P(C,14,11,4,2);P(S,18,11,1,2);},
    hurt:()=>{P(C,14,9,2,5);P(S,15,8,1,1);}}[pose];
  if(k==='ryan'){const sv='#cfd6dc';backArm();front();P('#d9b25a',8,14,2,2);
    if(pose==='wind'){P(sv,15,0,1,5);P(sv,13,0,1,4);P(sv,13,4,3,1);}
    if(pose==='strike'){P(sv,18,10,2,1);P(sv,18,15,2,1);P(sv,18,10,1,6);}
    if(pose==='cast'){P(sv,13,0,1,2);P(sv,16,0,1,2);P(sv,13,1,4,1);P('#bff4ff',14,0,2,1);}
    if(pose==='aim'){P(sv,19,9,1,6);}
  }
  else if(k==='claire'){const gm='#4a4f58',gb='#c9a24a',fs='#707884';
    if(pose==='wind'){P(C,14,12,2,7);P(S,14,19,2,1);P(gm,1,7,4,7);P(gb,1,9,4,1);P(gb,1,12,4,1);P(fs,1,4,4,3);P('#d8dde2',2,4,1,2);}
    else if(pose==='strike'||pose==='aim'){P(C,4,12,2,6);P(gm,12,12,5,4);P(gb,13,12,1,4);P(gb,15,12,1,4);P(fs,17,11,3,6);P('#d8dde2',18,11,1,2);
      if(pose==='strike')P('#8fe0ff',16,13,1,1);}
    else if(pose==='hurt'){P(C,14,10,2,5);P(gm,1,13,4,8);P(gb,1,15,4,1);P(fs,1,21,4,2);}
    else{backArm();front();}
  }
  else if(k==='miner'){backArm();
    if(pose==='wind'){P(C,13,5,2,7);P(S,13,4,2,1);P('#2a2a2a',14,0,1,9);P('#8a8a90',11,0,6,2);}
    else if(pose==='strike'){P(C,14,12,3,2);P(S,17,12,1,2);[[16,13],[17,13],[17,14],[18,14],[18,15],[18,16]].forEach(([x,y])=>P('#5a4a3a',x,y));P('#8a8a90',15,17,5,2);P('#c8c8d0',19,16,1,4);}
    else front();
  }
  else if(k==='guard'){const sh='#6a7888',sl='#8a98a8';
    if(pose==='strike'){P(C,12,13,3,2);P(sh,14,9,6,13);P(sl,15,10,4,11);P('#c8a456',17,14,1,2);}
    else if(pose==='wind'){P(sh,0,9,5,11);P(sl,1,10,3,9);P(C,14,12,2,7);P(S,14,19,2,1);}
    else{backArm();front();P(sh,0,11,5,10);P(sl,1,12,3,8);}
  }
  else{backArm();front&&front();}
  g.restore();outline(g,W,H,'#0e0a10');return c;
}
function xformPose(base,{rot=0,dx=0,dy=0,sx=1,sy=1,over=null}){
  const W=base.width,H=base.height,c=cvs(W,H),g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.translate(W/2+dx,H+dy);g.rotate(rot);g.scale(sx,sy);g.drawImage(base,-W/2,-H);g.setTransform(1,0,0,1,0,0);
  if(over){const P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};over(P);}return c;}
function poseCanvas(kind,pose,tank){
  if(['ryan','claire','miner','guard'].includes(kind)){if(kind==='claire'&&pose==='cast')pose='aim';return humanPose(kind,pose);}
  if(kind==='hound'){const b=houndCanvas(0);
    if(pose==='wind')return xformPose(b,{rot:-.12,dx:-2,dy:1,sy:.9});
    if(pose==='strike')return xformPose(b,{rot:.1,dx:2,sx:1.08,over:P=>{P('#ff5a3a',25,9,2,1);P('#f4f0e0',24,9,1,1);}});
    if(pose==='hurt')return xformPose(b,{rot:-.2,dx:-2});}
  if(kind==='sweeper'){const b=sweeperCanvas(0);
    if(pose==='wind')return xformPose(b,{rot:-.08,dy:-1,over:P=>{P('#9aa2aa',1,6,1,6);P('#9aa2aa',22,6,1,6);}});
    if(pose==='strike')return xformPose(b,{rot:.1,dx:1,over:P=>{P('#c8ff70',19,12,3,2);P('#4ab830',21,11,2,1);}});
    if(pose==='hurt')return xformPose(b,{rot:-.18,dx:-1});}
  if(kind==='mech'){const b=mechCanvas(0,tank);
    if(pose==='wind')return xformPose(b,{rot:-.07,dy:-2,over:P=>{P('#ff6a4a',22,14,5,2);}});
    if(pose==='strike')return xformPose(b,{rot:.05,dx:1,dy:1,over:P=>{P('#fff2a0',34,17,2,3);P('#ffb060',33,16,1,5);}});
    if(pose==='hurt')return xformPose(b,{rot:-.1,dx:-1,over:P=>{P('#ffffff',22,14,5,2);}});}
  return null;
}
function getPose(s,pose){
  if(!s||!s.kind||!pose)return null;const tank=s.kind==='mech'&&B&&B.mechFrames?s.frames===B.mechFrames.tank:true;
  const key=s.kind+'|'+pose+'|'+tank;if(!(key in POSE_CACHE)){const c=poseCanvas(s.kind,pose,tank);POSE_CACHE[key]=c?tex(c):null;}return POSE_CACHE[key];}
function setPose(s,pose){if(s)s.pose=getPose(s,pose);}

/* ---- motion helpers ---- */
const asleep=ms=>new Promise(r=>setTimeout(r,ms));
function tweenOff(s,to,dur){return new Promise(res=>{const from=s.mesh.position.clone();from.y=0;let t=0;
  E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/dur),e=1-Math.pow(1-k,3);s.mesh.position.x=from.x+(to.x-from.x)*e;s.mesh.position.z=from.z+(to.z-from.z)*e;if(k>=1){res();return false;}});
  setTimeout(res,dur*1000+600);});}
function faceTo(s,target){const p=s.holder.position,sx=scrX(target.x-p.x,target.z-p.z);if(Math.abs(sx)>.01)s.face(sx);}
function hitFlash(s,col=0xffffff){if(!s)return;s.mat.emissive.setHex(col);s.mat.emissiveIntensity=1;let t=0;
  E.fxs.push(dt=>{t+=dt;if(t>.09){s.mat.emissive.setHex(0x1c1c26);return false;}});}
function hitReact(s,fromPos,heavy){
  if(!s||!s.holder.visible)return;hitFlash(s);const prev=s.pose;
  if(!s.busy)setPose(s,'hurt');
  const p=s.holder.position,d=fromPos?V3(p.x-fromPos.x,0,p.z-fromPos.z):V3(0,0,1);if(d.lengthSq()<1e-4)d.set(0,0,1);d.normalize().multiplyScalar(heavy?.32:.18);
  s.mesh.position.x=d.x;s.mesh.position.z=d.z;let t=0;
  E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/.32);s.mesh.position.x=d.x*(1-k)+(Math.random()-.5)*.04*(1-k);s.mesh.position.z=d.z*(1-k);
    if(k>=1){s.mesh.position.x=0;s.mesh.position.z=0;if(!s.busy)s.pose=null;return false;}});
}
function hitstop(sec){E.hs=Math.max(E.hs||0,sec);}
/* att: sprite, target: world pos; impact(): runs at the hit frame */
async function animAttack(att,target,o,impact){
  if(!att){impact&&impact();return;}
  att.busy=true;faceTo(att,target);
  const p=att.holder.position,dir=V3(target.x-p.x,0,target.z-p.z);const dist=dir.length();dir.normalize();
  setPose(att,'wind');await tweenOff(att,dir.clone().multiplyScalar(-.12),.14);await asleep(o.heavy?140:70);
  if(o.ranged||o.cast){setPose(att,o.cast?'cast':'strike');await asleep(60);impact&&impact();hitstop(.05);await asleep(o.cast?380:260);}
  else{const reach=Math.max(0,Math.min(o.lunge||.5,dist-.55));setPose(att,'strike');await tweenOff(att,dir.clone().multiplyScalar(reach),.08);
    impact&&impact();hitstop(o.heavy?.12:.07);await asleep(o.heavy?260:200);}
  await tweenOff(att,V3(0,0,0),.16);att.pose=null;att.busy=false;
}

/* ---- cut-in for big techniques ---- */
function portraitInto(cv,who,expr){const img=new Image();img.onload=()=>{const g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,cv.width,cv.height);g.drawImage(img,0,0,cv.width,cv.height);
  const d=g.getImageData(0,0,cv.width,cv.height);for(let i=0;i<d.data.length;i+=4)for(let c=0;c<3;c++)d.data[i+c]=Math.round(d.data[i+c]/36)*36;g.putImageData(d,0,0);};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(portraitSVG(who,expr));}
function camPush(toPos,amount,dur){const t0=E.controls.target.clone(),c0=E.camera.position.clone(),tt=toPos.clone().setY(.7),ct=c0.clone().lerp(tt,amount);let t=0;
  return new Promise(res=>{E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/dur),e=k*k*(3-2*k);E.controls.target.lerpVectors(t0,t0.clone().lerp(tt,.6),e);E.camera.position.lerpVectors(c0,ct,e);E.camera.lookAt(E.controls.target);
    if(k>=1){res({t0,c0});return false;}});setTimeout(()=>res({t0,c0}),dur*1000+600);});}
function camBack(saved,dur){const t1=E.controls.target.clone(),c1=E.camera.position.clone();let t=0;
  return new Promise(res=>{E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/dur),e=k*k*(3-2*k);E.controls.target.lerpVectors(t1,saved.t0,e);E.camera.position.lerpVectors(c1,saved.c0,e);E.camera.lookAt(E.controls.target);
    if(k>=1){res();return false;}});setTimeout(res,dur*1000+600);});}
async function cutIn(who,expr,title,sub,color){
  const el=$('cutin');el.style.setProperty('--ci',color||'#c8a456');$('ci-t').textContent=title;$('ci-s').textContent=sub||'';portraitInto($('ci-face'),who,expr);
  el.hidden=false;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');sfx('cast');
  await asleep(900);el.hidden=true;
}

/* ---- hooks: player actions ---- */
const PRE8={doAction,cast,forbid};
const ATK_MODES={punch:{},pile:{heavy:true,lunge:.55},blade:{lunge:.6},freeze:{lunge:.4},tap:{lunge:.4},gun:{ranged:true},stake:{ranged:true},decompose:{cast:true}};
{const o=doAction;doAction=function(mode,i,j){
  if(!B||B.busy)return;const u=B.units[B.sel],cfg=ATK_MODES[mode];
  if(!cfg||!u){o(mode,i,j);return;}
  B.busy=true;B.mode=null;clearTargets();renderDeck();
  const tp=W(i,j);
  animAttack(u.spr,tp,cfg,()=>{o(mode,i,j);}).then(()=>{B.busy=false;renderDeck();});
};}
{const o=cast;cast=function(r){
  if(!B||B.busy||!canCast(r))return;const R=B.units.ryan;B.busy=true;B.mode=null;clearTargets();
  const pts=B.anchors.slice(-r.n),ctr=centroid(cellsOfShape(pts)),big=r.n>=3;
  (async()=>{let saved=null;
    if(big){saved=await camPush(R.spr.holder.position,.3,.3);await cutIn('ryan','AshEye_Overload',`#${r.id}　${r.name}`,`${SHAPE[r.n]}・${r.el.map(e=>ELF[e]).join(' + ')}`,'#c8a456');}
    await animAttack(R.spr,ctr,{cast:true},()=>o(r));
    if(saved){await asleep(350);await camBack(saved,.5);}
    B.busy=false;renderDeck();})();
};}
{const o=forbid;forbid=function(){
  const r=B.units.ryan;if(!B||B.busy||!r.alive||B.forbidUsed)return;B.busy=true;
  (async()=>{const saved=await camPush(r.spr.holder.position,.36,.35);await cutIn('ryan','AshEye_Overload','#R15　超載逆構','禁忌・灰瞳迴路透支','#e9e3d4');
    setPose(r.spr,'cast');r.spr.busy=true;o();await asleep(1500);r.spr.pose=null;r.spr.busy=false;await camBack(saved,.6);B.busy=false;renderDeck();})();
};}
{const o=magnet;magnet=function(){const u=B.units.claire;setPose(u.spr,'aim');setTimeout(()=>{u.spr.pose=null;},600);o();};}
{const o=vent;vent=function(){const u=B.units.claire;setPose(u.spr,'cast');setTimeout(()=>{u.spr.pose=null;},700);o();};}
{const o=useItem;useItem=function(id,u){const r=o(id,u);if(r&&u&&u.spr){u.spr.hop=1;}return r;};}
{const o=endTurn;endTurn=async function(){if(B&&B.busy)return;return o();};}
{const o=onCanvasClick;onCanvasClick=function(e){if(E.mode==='battle'&&B&&B.busy)return;o(e);};}
/* reactions */
{const o=damageEnemy;damageEnemy=function(e,amt,opt={}){
  if(e&&e.alive&&!opt.quiet&&e.spr){const src=B.units[B.sel]&&B.units[B.sel].spr.holder.position;hitReact(e.spr,src,amt>=150||opt.true);}
  o(e,amt,opt);};}
{const o=damageUnit;damageUnit=function(u,amt){
  if(u&&u.alive&&u.spr){const near=alive().sort((a,b)=>md(a.i,a.j,u.i,u.j)-md(b.i,b.j,u.i,u.j))[0];hitReact(u.spr,near?near.spr.holder.position:null,amt>=40);}
  o(u,amt);};}
/* victory pose */
{const o=victory;victory=function(){if(B){['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive){setPose(u.spr,k==='ryan'?'cast':'strike');u.spr.hop=1;}});
  setTimeout(()=>{if(B)['ryan','claire'].forEach(k=>{B.units[k].spr.pose=null;});},1600);}o();};}
/* walking animation speed while sliding between cells */
{const o=battleTick;battleTick=function(dt,t){o(dt,t);if(!B)return;
  ['ryan','claire'].map(k=>B.units[k]).concat(B.enemies).forEach(x=>{if(!x.spr)return;const h=x.spr.holder.position,lp=x._lp||(x._lp=h.clone());const v=h.distanceTo(lp)/Math.max(dt,1e-3);x._lp.copy(h);
    x.spr.speed=v>.4?7:(x.d&&x.d.speed)||1.6;});};}
{const o=selectUnit;selectUnit=function(k){if(B&&B.busy)return;o(k);};}
{const o=enterMode;enterMode=function(m){if(B&&B.busy)return;o(m);};}
