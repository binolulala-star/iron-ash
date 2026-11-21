/* ======================= BATTLE LAYOUT — keep the board out from under the HUD =======================
   fitBoardCam(): keeps the current view angle, then moves/zooms the camera so the whole board plus
   every standing unit (feet to head) lands inside the screen area the HUD leaves free.
   hudSeeThru(): if a unit still ends up under a panel (manual zoom, tiny screens), that panel fades. */
const BL={auto:true,sig:''};
{const st=document.createElement('style');st.textContent=`
#battle .hud-top>.frame,#deck .ucards>*,#deck .pool,#deck .acts{transition:opacity .25s}
#battle .see-thru{opacity:.3}#battle .see-thru:hover,#battle .see-thru:focus-within{opacity:1}
.epanel.cols{display:grid;grid-template-columns:1fr 1fr;column-gap:14px;row-gap:5px}
.epanel.cols .erow+.erow{border-top:0;padding-top:0}
.epanel.cols .erow .row{white-space:nowrap}.epanel.cols .erow .row b{overflow:hidden;text-overflow:ellipsis}
.epanel.cols .erow .row span{font-size:10.5px}
/* short landscape screens (phones on their side): one slim strip at the bottom instead of two tall rows */
@media (max-height:520px) and (min-width:560px){
 #battle .deck{grid-template-columns:128px minmax(0,.62fr) minmax(0,1.9fr)!important;gap:5px!important;align-items:end}
 #battle .deck .acts{grid-column:auto!important}
 #battle .ucards{gap:3px}#battle .ucard{padding:2px 7px}#battle .ucard .r1 b{font-size:12px}
 #battle .ucard .r1.px{font-size:9.5px!important}#battle .ucard .r1.px span+span,#battle .ucard .st{display:none}
 #battle .ucard .ap i{width:6px;height:6px}#battle .ucard .bar{margin-top:2px;height:4px}
 #battle .pool h5,#battle .acts h5{display:none}#battle .pool,#battle .acts{padding:4px 6px}
 #battle .els{gap:3px}#battle .els .el{font-size:9.5px;padding:0 3px}#battle .anc{font-size:9.5px}
 #battle .abtns{gap:4px}#battle .ab{padding:3px 7px;font-size:11.5px;min-height:0}#battle .ab small{display:none}
 #battle .hud-top{gap:5px}#battle .guide{font-size:10.5px;line-height:1.4;padding:4px 8px}
 #battle .guide span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#battle .guide:hover span{-webkit-line-clamp:unset}#battle .guide b{font-size:9.5px}
 #battle .env{padding:4px 8px}#battle .epanel{padding:4px 8px;max-height:26vh}
 #battle .erow .row b{font-size:12px}#battle .epanel .erow .row span{font-size:9.5px}
 #battle .camctl{top:auto;bottom:auto;top:calc(50% - 60px);flex-direction:column;padding:3px;gap:3px}
 #battle .camctl small,#battle .camctl .snd{display:none}#battle .camctl button{width:30px;height:26px;font-size:14px}
}`;document.head.appendChild(st);}
function blVisible(el){if(!el||el.hidden)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).visibility!=='hidden'?r:false;}
/* free rectangle in CSS px; panels only count when they sit over the board's horizontal span */
function blSafe(span){const w=innerWidth,h=innerHeight,m=w<600?6:12;let top=m,bot=h-m,left=m,right=w-m;
  const tops=[...document.querySelectorAll('#battle .hud-top>.frame')],bots=[...document.querySelectorAll('#deck .ucards>*,#deck .frame,#field-ctl .strike')];
  const hit=r=>r.right>span[0]&&r.left<span[1];
  tops.forEach(el=>{const r=blVisible(el);if(r&&hit(r))top=Math.max(top,r.bottom+m);});
  bots.forEach(el=>{const r=blVisible(el);if(r&&hit(r)&&r.top>h*.35)bot=Math.min(bot,r.top-m);});
  const cc=blVisible($('camctl'));if(cc){if(cc.height>cc.width){if(cc.bottom>top)right=Math.min(right,cc.left-m);}else if(hit(cc)&&cc.top>h*.35)bot=Math.min(bot,cc.top-m);}
  if(bot-top<h*.3){const c=(top+bot)/2;top=c-h*.15;bot=c+h*.15;}
  return {top,bot,left,right};}
function blHolders(){const out=[];if(!B)return out;
  ['ryan','claire'].forEach(k=>{const u=B.units[k];if(u&&u.alive&&u.spr)out.push(u.spr.holder);});
  B.enemies.forEach(e=>{if(e.alive&&e.spr&&e.spr.holder.visible)out.push(e.spr.holder);});
  if(B.boss&&B.boss.spr&&B.boss.spr.holder.visible)out.push(B.boss.spr.holder);return out;}
function blPoints(){const pts=[],e=OFF+.5,box=new THREE.Box3();let hmax=0;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++)hmax=Math.max(hmax,hAt(i,j)*HSTEP);
  [[-e,-e],[e,-e],[-e,e],[e,e]].forEach(([x,z])=>{pts.push(new THREE.Vector3(x,0,z));if(hmax)pts.push(new THREE.Vector3(x,hmax,z));});
  blHolders().forEach(hd=>{const p=hd.position.clone();pts.push(p);
    box.setFromObject(hd);const top=isFinite(box.max.y)?Math.max(box.max.y,p.y+1.1):p.y+1.4;pts.push(new THREE.Vector3(p.x,top,p.z));});
  return pts;}
/* project → NDC bbox, then convert to px */
function blBBox(pts){const c=E.camera;c.updateMatrixWorld();let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const v=new THREE.Vector3();
  pts.forEach(p=>{v.copy(p).project(c);const sx=(v.x+1)/2*innerWidth,sy=(1-v.y)/2*innerHeight;x0=Math.min(x0,sx);x1=Math.max(x1,sx);y0=Math.min(y0,sy);y1=Math.max(y1,sy);});
  return {x0,x1,y0,y1};}
function fitBoardCam(force){if(!B||E.mode!=='battle'||$('battle').hidden||document.body.classList.contains('in-theater'))return;
  if(!force&&!BL.auto)return;
  const c=E.camera,T=E.controls.target,pts=blPoints(),lo=E.controls.minDistance||6,hi=40;
  const d0=c.position.distanceTo(T);
  for(let k=0;k<7;k++){
    const b=blBBox(pts),S=blSafe([b.x0,b.x1]);
    const sw=(S.right-S.left)/(b.x1-b.x0),sh=(S.bot-S.top)/(b.y1-b.y0);let s=Math.min(sw,sh)*.97;
    const off=c.position.clone().sub(T),d=off.length();
    let nd=Math.max(lo,Math.min(hi,d/s));nd=Math.max(nd,d0*.82); /* never punch in much tighter than the authored framing */
    /* shift so the bbox centre meets the free-area centre (screen px → world on the target plane) */
    const cx=(b.x0+b.x1)/2,cy=(b.y0+b.y1)/2,tx=(S.left+S.right)/2,ty=(S.top+S.bot)/2;
    const wpp=2*d*Math.tan(c.fov*Math.PI/360)/innerHeight;
    const right=new THREE.Vector3().setFromMatrixColumn(c.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(c.matrixWorld,1);
    T.add(right.multiplyScalar((cx-tx)*wpp)).add(up.multiplyScalar((ty-cy)*wpp));
    c.position.copy(T).add(off.setLength(nd));c.lookAt(T);
  }
  const dn=c.position.distanceTo(T),f=E.scene.fog;E.controls.maxDistance=Math.max(26,dn+2);
  /* pulling back must not push the board into the fog */
  if(f&&f.far!==undefined){if(!BL.fog0)BL.fog0=[f.near,f.far,d0];const ex=Math.max(0,dn-BL.fog0[2]);f.near=BL.fog0[0]+ex;f.far=BL.fog0[1]+ex;}
E.controls.update&&E.controls.update();}
/* fade any HUD panel that has a unit under it; hovering the panel brings it back */
function hudSeeThru(){if(!B||E.mode!=='battle'||$('battle').hidden)return;
  const els=[...document.querySelectorAll('#battle .hud-top>.frame,#deck .ucards>*,#deck .pool,#deck .acts')].map(el=>[el,blVisible(el)]).filter(x=>x[1]);
  const v=new THREE.Vector3(),box=new THREE.Box3(),rs=[];
  blHolders().forEach(hd=>{const p=hd.position;v.copy(p).project(E.camera);const fx=(v.x+1)/2*innerWidth,fy=(1-v.y)/2*innerHeight;
    box.setFromObject(hd);v.set(p.x,isFinite(box.max.y)?box.max.y:p.y+1.4,p.z).project(E.camera);const hy=(1-v.y)/2*innerHeight;
    const hw=Math.max(14,(fy-hy)*.28);rs.push({l:fx-hw,r:fx+hw,t:hy,b:fy});});
  els.forEach(([el,r])=>el.classList.toggle('see-thru',rs.some(u=>u.r>r.left&&u.l<r.right&&u.b>r.top&&u.t<r.bottom)));}
/* every 0.2s: fade panels; and if the HUD around the board changed shape (story closed, deck shown, enemy list grew), refit */
function blSig(){return [$('epanel').offsetHeight,$('deck').hidden,$('story').hidden,$('field-ctl').hidden,innerWidth,innerHeight,document.body.classList.contains('in-theater')].join();}
function blTick(dt){BL.t=(BL.t||0)+dt;if(BL.t<.2)return true;BL.t=0;if(!B||E.mode!=='battle'||$('battle').hidden)return true;
  hudSeeThru();const sg=blSig();if(BL.auto&&sg!==BL.sig&&$('story').hidden&&!document.body.classList.contains('in-theater')){BL.sig=sg;fitBoardCam();}return true;}
E.fxs.push(blTick);
{const o=clearWorld;clearWorld=function(...a){const r=o(...a);if(!E.fxs.includes(blTick))E.fxs.push(blTick);return r;};}
/* when to refit: battle start, ⌂ reset, window resize, HUD height changes (enemy list, deck shown). Manual drag/zoom turns auto off until ⌂ */
HOOK.after('startBattle',()=>{BL.auto=true;BL.sig='';BL.fog0=null;requestAnimationFrame(()=>requestAnimationFrame(()=>fitBoardCam(true)));});
E.controls.addEventListener('start',()=>{BL.auto=false;});
{const b=$('cam-0'),o=b.onclick;b.onclick=e=>{o&&o(e);BL.auto=true;fitBoardCam(true);};}
{const o=rotCam;rotCam=function(dir){o(dir);if(!BL.auto)return;setTimeout(()=>fitBoardCam(),420);};}
addEventListener('resize',()=>setTimeout(()=>fitBoardCam(),60));
{const o=updateHud;updateHud=function(...a){const r=o(...a);if(B)$('epanel').classList.toggle('cols',B.enemies.length>=3&&innerWidth>=700);return r;};}
