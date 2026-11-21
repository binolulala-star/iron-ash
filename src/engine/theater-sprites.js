/* ======================= HI-RES BATTLE SPRITES (48×64 rig) ======================= */
const D2R=Math.PI/180;
const HRPAL={
 ryan:{skin:['#f2cba4','#c98f6c','#ffe4c8'],hair:['#28304a','#161b2a','#41507a'],coat:['#2f3f66','#1d2742','#4c64a0'],shirt:['#ece6da','#b4ab9c','#ffffff'],
   pants:['#2b2b36','#1a1a22','#41414f'],boots:['#5a3e2a','#382618','#7a563a'],eyeN:'#b8702c',eyeF:'#c8d2dc',acc:'#e0b85a',acc2:'#8a6a2a',metal:['#cfd6dc','#8a949e','#ffffff']},
 claire:{skin:['#f4cfac','#cc9472','#ffe6cc'],hair:['#cc3f2c','#8a2418','#f06a48'],coat:['#7c4a2c','#52301a','#a6683e'],shirt:['#ece0c4','#b8a888','#fff6e0'],
   pants:['#3a3444','#24202c','#524a60'],boots:['#3e2c20','#241810','#5c4230'],eyeN:'#2fa868',eyeF:'#2fa868',acc:'#c9a24a',acc2:'#7a5e22',
   steel:['#727c8a','#474e5a','#b0b8c4'],core:'#7fe8ff'},
 miner:{skin:['#e0b08a','#b07a58','#f4caa4'],hair:['#3a3026','#221a14','#54463a'],coat:['#4c5c70','#323e4e','#6a7e96'],shirt:['#8a6a4a','#5e4630','#a8865e'],
   pants:['#4c5c70','#323e4e','#6a7e96'],boots:['#3a2a1e','#20160e','#584030'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#d8b040',acc2:'#9c7c24',metal:['#9aa0a8','#62686e','#d0d6dc'],wood:['#7a5a3a','#4e3822','#9c7650']},
 guard:{skin:['#ecc6a0','#c08c68','#ffdcbc'],hair:['#2a2420','#16120e','#40362e'],coat:['#575f70','#3a404e','#7a8496'],shirt:['#cfc6b4','#9a907e','#eee6d4'],
   pants:['#3a3f4a','#24282f','#505664'],boots:['#1e1e24','#0e0e12','#34343e'],eyeN:'#2a2420',eyeF:'#2a2420',acc:'#c8a456',acc2:'#7e6630',
   cap:['#2e3242','#1c1e28','#464c62'],steel:['#7c8a9a','#535e6c','#b4c0ce']},
};
const OUTLINE='#120e16';
function hexRGB(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];}
function palOf(obj){const out=[];const walk=v=>{if(typeof v==='string'&&v[0]==='#')out.push(hexRGB(v));else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);};walk(obj);return out;}
/* quantize + outline + rim light */
function pixelize(c,pal,{rim=true}={}){
  const g=c.getContext('2d'),W=c.width,H=c.height,d=g.getImageData(0,0,W,H),a=d.data;
  for(let i=0;i<a.length;i+=4){if(a[i+3]<120){a[i+3]=0;continue;}let best=0,bd=1e9;for(let k=0;k<pal.length;k++){const p=pal[k],dd=(a[i]-p[0])**2+(a[i+1]-p[1])**2+(a[i+2]-p[2])**2;if(dd<bd){bd=dd;best=k;}}
    a[i]=pal[best][0];a[i+1]=pal[best][1];a[i+2]=pal[best][2];a[i+3]=255;}
  const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&a[(y*W+x)*4+3]>0;const ol=hexRGB(OUTLINE),mark=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(op(x,y))continue;if(op(x+1,y)||op(x-1,y)||op(x,y+1)||op(x,y-1))mark[y*W+x]=1;}
  if(rim)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(!op(x,y))continue;if(!op(x+1,y)||!op(x,y-1)){for(let c2=0;c2<3;c2++)a[i+c2]=Math.min(255,a[i+c2]*1.18+14);}}
  for(let k=0;k<W*H;k++)if(mark[k]){const i=k*4;a[i]=ol[0];a[i+1]=ol[1];a[i+2]=ol[2];a[i+3]=255;}
  g.putImageData(d,0,0);return c;}
/* primitives */
function capS(g,a,b,w,col){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
function shadedCap(g,a,b,w,P){capS(g,a,b,w,P[1]);const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,sx=nx>0?-nx:nx,sy=nx>0?-ny:ny;
  capS(g,[a[0]+.5,a[1]-.5],[b[0]+.5,b[1]-.5],w-1.6,P[0]);capS(g,[a[0]+w*.28,a[1]-w*.2],[b[0]+w*.28,b[1]-w*.2],Math.max(.9,w*.22),P[2]);}
function poly(g,pts,col){g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();}
function ell(g,x,y,rx,ry,col,rot=0){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,rot,0,Math.PI*2);g.fill();}
function rect(g,x,y,w,h,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h);}
const add=(p,v)=>[p[0]+v[0],p[1]+v[1]];
const dirD=(deg,len)=>[Math.sin(deg*D2R)*len,Math.cos(deg*D2R)*len];/* 0 = straight down, +90 = forward */
const upD=(deg,len)=>[Math.sin(deg*D2R)*len,-Math.cos(deg*D2R)*len];/* 0 = straight up, + = lean forward */
const lerp=(a,b,t)=>a+(b-a)*t;
/* poses: lean, head tilt, arms [upper, elbow], legs [thigh, knee] (degrees), dx, eye: 'open'|'closed'|'glow' */
const HPOSE={
 idle0:{lean:0,head:0,fa:[8,22],ba:[-8,16],fl:[8,-8],bl:[-8,-4],dx:0},
 idle1:{lean:1,head:1,fa:[10,26],ba:[-6,20],fl:[8,-8],bl:[-8,-4],dx:0,dy:1},
 wind:{lean:-9,head:-4,fa:[-70,110],ba:[35,45],fl:[28,-34],bl:[-30,-8],dx:-2,dy:1},
 dash:{lean:26,head:-6,fa:[-55,70],ba:[60,30],fl:[55,-70],bl:[-55,-35],dx:2,dy:2},
 strike:{lean:14,head:-2,fa:[95,0],ba:[-45,40],fl:[45,-22],bl:[-42,-10],dx:4},
 follow:{lean:10,head:0,fa:[84,14],ba:[-30,30],fl:[38,-26],bl:[-36,-10],dx:3},
 castA:{lean:-5,head:-6,fa:[150,25],ba:[-25,40],fl:[10,-6],bl:[-14,-6],dx:0},
 castB:{lean:2,head:-10,fa:[172,0],ba:[-35,50],fl:[12,-8],bl:[-16,-6],dx:0,eye:'glow'},
 aim:{lean:4,head:0,fa:[90,0],ba:[62,26],fl:[22,-16],bl:[-24,-6],dx:1},
 hurt:{lean:-20,head:-14,fa:[-38,46],ba:[58,64],fl:[-8,-24],bl:[-28,-6],dx:-3,eye:'closed'},
 win:{lean:-2,head:-8,fa:[165,5],ba:[-15,30],fl:[10,-6],bl:[-12,-4],dx:0},
};
function mixPose(a,b,t){const o={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){const va=a[k]??(Array.isArray(b[k])?[0,0]:0),vb=b[k]??va;
  o[k]=Array.isArray(va)?va.map((x,i)=>lerp(x,vb[i],t)):typeof va==='number'?lerp(va,vb,t):(t<.5?va:vb);}return o;}
function rigOf(p){
  const hip=[24+(p.dx||0),39],L=p.lean||0,neck=add(hip,upD(L,14)),head=add(neck,upD(L+(p.head||0),7));
  const shF=add(neck,[1+Math.sin(L*D2R)*0,2.5]),shB=add(neck,[-1.5,2.5]);
  const arm=(sh,[u,e])=>{const el=add(sh,dirD(u,9));return{sh,el,ha:add(el,dirD(u+e,8)),u,f:u+e};};
  const leg=(h,[t,s])=>{const kn=add(h,dirD(t,11));return{h,kn,an:add(kn,dirD(t+s,11)),t,s:t+s};};
  const r={hip,neck,head,L,fa:arm(shF,p.fa),ba:arm(shB,p.ba),fl:leg(add(hip,[1.5,0]),p.fl),bl:leg(add(hip,[-1.5,0]),p.bl)};
  const low=Math.max(r.fl.an[1],r.bl.an[1]),sh=61-low+(p.dy||0);
  const mv=v=>{v[1]+=sh;};[r.hip,r.neck,r.head].forEach(mv);['fa','ba'].forEach(k=>['sh','el','ha'].forEach(j=>mv(r[k][j])));['fl','bl'].forEach(k=>['h','kn','an'].forEach(j=>mv(r[k][j])));
  return r;}
const dark=(P,f=.78)=>P.map(h=>{const c=hexRGB(h).map(v=>Math.round(v*f));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');});
function drawLeg(g,lg,C,back){const pn=back?dark(C.pants):C.pants,bt=back?dark(C.boots):C.boots;
  shadedCap(g,lg.h,lg.kn,5.2,pn);const mid=[lerp(lg.kn[0],lg.an[0],.35),lerp(lg.kn[1],lg.an[1],.35)];shadedCap(g,lg.kn,mid,4.6,pn);shadedCap(g,mid,lg.an,4.8,bt);
  const f=dirD(lg.s+90,4);poly(g,[add(lg.an,[-2,-1.5]),add(lg.an,[f[0]+2.5,f[1]-1]),add(lg.an,[f[0]+2.5,f[1]+1.5]),add(lg.an,[-2,1.6])],bt[1]);
  poly(g,[add(lg.an,[-1.5,-1.4]),add(lg.an,[f[0]+2,f[1]-1]),add(lg.an,[f[0]+1.5,f[1]]),add(lg.an,[-1.5,0])],bt[0]);}
function drawArm(g,A,C,back,kind){
  if(kind==='claire'&&!back){const S=C.steel;shadedCap(g,A.sh,A.el,5.4,S);shadedCap(g,A.el,A.ha,6.2,S);
    const b1=[lerp(A.el[0],A.ha[0],.15),lerp(A.el[1],A.ha[1],.15)],b2=[lerp(A.el[0],A.ha[0],.8),lerp(A.el[1],A.ha[1],.8)];capS(g,b1,add(b1,dirD(A.f,1)),6.6,C.acc);capS(g,b2,add(b2,dirD(A.f,1)),6.6,C.acc);
    const cr=[lerp(A.el[0],A.ha[0],.5),lerp(A.el[1],A.ha[1],.5)];ell(g,cr[0],cr[1],1.3,1.3,C.core);ell(g,A.el[0],A.el[1],2.6,2.6,S[1]);ell(g,A.el[0]+.5,A.el[1]-.5,1.4,1.4,S[2]);
    const fd=dirD(A.f,3.2);ell(g,A.ha[0]+fd[0]*.6,A.ha[1]+fd[1]*.6,3.4,3.4,S[1]);ell(g,A.ha[0]+fd[0]*.6+.6,A.ha[1]+fd[1]*.6-.6,2.4,2.4,S[0]);ell(g,A.ha[0]+fd[0]*.6+1.2,A.ha[1]+fd[1]*.6-1.2,.9,.9,S[2]);return;}
  const cP=back?dark(C.coat):C.coat;shadedCap(g,A.sh,A.el,4.4,cP);shadedCap(g,A.el,A.ha,4,cP);
  const cuff=[lerp(A.el[0],A.ha[0],.82),lerp(A.el[1],A.ha[1],.82)];capS(g,cuff,add(cuff,dirD(A.f,1.2)),4.4,back?dark(C.shirt)[0]:C.shirt[0]);
  const hd=add(A.ha,dirD(A.f,1.5));ell(g,hd[0],hd[1],2,2,back?C.skin[1]:C.skin[0]);ell(g,hd[0]+.6,hd[1]-.6,.8,.8,C.skin[2]);}
function drawTorso(g,r,C,kind){
  const L=r.L*D2R,rot=v=>[v[0]*Math.cos(L)-v[1]*Math.sin(L),v[0]*Math.sin(L)+v[1]*Math.cos(L)],at=v=>add(r.hip,rot(v));
  const flare=-2-r.L*.12;
  // coat tails
  if(kind!=='guard'&&kind!=='miner'){poly(g,[at([-5,-2]),at([5,-2]),at([5.5+(r.L>15?-2:0),9]),at([1,7]),at([-6+flare,10])],C.coat[1]);poly(g,[at([-4,-2]),at([4.5,-2]),at([4.5,8]),at([0,6])],C.coat[0]);}
  poly(g,[at([-5.5,-14]),at([5.5,-14]),at([5,0]),at([-5,0])],C.coat[1]);poly(g,[at([-4,-14]),at([5.5,-14]),at([5,-1]),at([-3,-1])],C.coat[0]);poly(g,[at([3.5,-13]),at([5.4,-13]),at([5,-2]),at([3.8,-2])],C.coat[2]);
  if(kind==='miner'){poly(g,[at([-4,-13]),at([4.5,-13]),at([4.5,-6]),at([-4,-6])],C.shirt[0]);rect(g,...at([-3,-13]),1,8,C.acc2);}
  else{poly(g,[at([0,-14]),at([4,-14]),at([2,-8])],C.shirt[0]);poly(g,[at([2,-14]),at([4,-14]),at([2.6,-10])],C.shirt[2]);}
  // belt
  poly(g,[at([-5.2,-2.4]),at([5.3,-2.4]),at([5.3,-.6]),at([-5.2,-.6])],kind==='claire'?C.acc2:'#24202a');const bk=at([2.5,-1.5]);rect(g,bk[0]-1,bk[1]-1,2,2,C.acc);
  if(kind==='ryan'){const b=at([-1.5,-10]);ell(g,b[0],b[1],1.4,1.4,C.acc);ell(g,b[0]+.4,b[1]-.4,.5,.5,'#fff2c0');}
  if(kind==='guard'){const e=at([-2.5,-10]);rect(g,e[0]-1,e[1]-1,3,2,C.acc);for(let k=0;k<3;k++){const bt=at([3,-12+k*3.5]);rect(g,bt[0],bt[1],1,1,C.acc);}}
  if(kind==='claire'){const s=at([-4,-14]);poly(g,[s,at([-2,-14]),at([3,-1]),at([1,-1])],C.acc2);}
}
function drawHead(g,r,C,kind,eye){
  const [x,y]=r.head,T=((r.L||0)+0)*D2R*.4;
  if(kind==='claire'){const sw=Math.max(-1,Math.min(1,-r.L/20));const tail=[[x-4,y-3],[x-9-sw*3,y-1],[x-12-sw*5,y+5],[x-10-sw*4,y+11],[x-7,y+4],[x-4,y+1]];poly(g,tail,C.hair[1]);
    poly(g,[[x-4,y-3],[x-8-sw*3,y-1],[x-10-sw*4,y+4],[x-6,y+3]],C.hair[0]);capS(g,[x-5,y-3],[x-4,y-1],2.5,C.acc);}
  ell(g,x,y,5.6,6,C.skin[1]);ell(g,x+.6,y-.4,5,5.4,C.skin[0]);poly(g,[[x+2,y+3],[x+5.6,y+1.5],[x+4.8,y+5],[x+1,y+6]],C.skin[0]);
  rect(g,x+5,y,1,2,C.skin[1]);ell(g,x-2.4,y+1,1.2,1.6,C.skin[1]);
  // eyes
  if(eye==='closed'){rect(g,x+1,y,3,1,'#3a2420');rect(g,x+4.6,y,1,1,'#3a2420');}
  else{const eN=eye==='glow'&&kind==='ryan'?'#d8fbff':C.eyeN,eF=eye==='glow'&&kind==='ryan'?'#bff4ff':C.eyeF;
    rect(g,x+1,y-1,2,3,'#1a1418');rect(g,x+1,y-1,2,2,kind==='ryan'?eF:eN);rect(g,x+1,y-1,1,1,'#ffffff');rect(g,x+4,y-1,1,3,'#1a1418');rect(g,x+4,y-1,1,2,kind==='ryan'?eN:eF);
    if(kind==='ryan'&&eye==='glow'){ell(g,x+2,y,2.6,2.6,'#bff4ff');rect(g,x+1,y-1,2,2,'#ffffff');}}
  rect(g,x+2,y+3.4,2,1,'#8a4a3a');
  if(kind==='ryan'){poly(g,[[x-6,y-1],[x-5.5,y-6],[x-2,y-8],[x+3,y-8],[x+6.5,y-5],[x+6,y-2],[x+3,y-3.4],[x+1,y-1.8],[x-1,y-3.5],[x-3,y-1],[x-4,y+2]],C.hair[0]);
    poly(g,[[x-6,y-1],[x-8,y-4],[x-5,y-5]],C.hair[1]);poly(g,[[x-1,y-8],[x+1,y-11],[x+2,y-8]],C.hair[0]);poly(g,[[x+3,y-8],[x+6,y-10],[x+5.5,y-6]],C.hair[1]);
    poly(g,[[x-2,y-7],[x+3,y-7],[x+1,y-5.5]],C.hair[2]);}
  if(kind==='claire'){poly(g,[[x-6,y],[x-5.5,y-6],[x-1,y-8.4],[x+4,y-7.6],[x+6.4,y-4],[x+6,y-1],[x+4,y-3.6],[x+2,y-2],[x,y-3.8],[x-2,y-1.5],[x-4,y+3]],C.hair[0]);
    poly(g,[[x-1,y-7.5],[x+4,y-7],[x+2,y-5.8]],C.hair[2]);
    capS(g,[x-5,y-5.6],[x+5.4,y-6.2],2.2,C.acc2);ell(g,x+4.4,y-6.4,1.8,1.6,'#4ec8d8');ell(g,x+4.9,y-6.9,.6,.6,'#ffffff');}
  if(kind==='miner'){poly(g,[[x-6.5,y-2],[x-6,y-6],[x-2,y-9],[x+3,y-9],[x+6.5,y-5.5],[x+7.5,y-2.5],[x-6.5,y-2.5]],C.acc);poly(g,[[x-6,y-3.4],[x+7.5,y-2.6],[x+7.5,y-1.6],[x-6.5,y-1.6]],C.acc2);
    poly(g,[[x-1,y-8.5],[x+3,y-8.5],[x+2,y-6]],'#f6e290');ell(g,x+6.4,y-5.6,1.6,1.4,'#fff6c0');rect(g,x+2,y+2,3,1,C.hair[1]);rect(g,x+1,y+4.6,4,1,C.hair[0]);}
  if(kind==='guard'){poly(g,[[x-6,y-3],[x-5,y-7.5],[x+3,y-8.6],[x+6,y-6],[x+5.5,y-3.6]],C.cap[0]);poly(g,[[x-5,y-7.5],[x+3,y-8.6],[x+2,y-7]],C.cap[2]);
    poly(g,[[x+1,y-3.8],[x+9,y-3],[x+8.6,y-2],[x+1,y-2.6]],C.cap[1]);rect(g,x-5,y-4.4,10,1,C.acc);rect(g,x+1,y-7,2,2,C.acc);rect(g,x-6,y-2,2,4,C.hair[0]);}
}
function drawWeapon(g,r,C,kind,pn){
  const A=r.fa,h=add(A.ha,dirD(A.f,1.5));
  if(kind==='ryan'){const d=dirD(A.f,1),stem=add(h,dirD(A.f,4)),n=[-d[1],d[0]];capS(g,h,stem,1.4,C.metal[1]);
    const p1=add(stem,[n[0]*1.8,n[1]*1.8]),p2=add(stem,[-n[0]*1.8,-n[1]*1.8]);capS(g,p1,p2,1.4,C.metal[1]);
    capS(g,p1,add(p1,dirD(A.f,8)),1.6,C.metal[0]);capS(g,p2,add(p2,dirD(A.f,8)),1.6,C.metal[0]);capS(g,add(p1,[.4,-.4]),add(add(p1,dirD(A.f,7)),[.4,-.4]),.7,C.metal[2]);
    if(pn==='castB'||pn==='castA'){const tip=add(stem,dirD(A.f,9));ell(g,tip[0],tip[1],2.6,2.6,'#bff4ff');ell(g,tip[0],tip[1],1.2,1.2,'#ffffff');}}
  if(kind==='miner'){const tip=add(h,dirD(A.f+40,13)),d=dirD(A.f+40,1),n=[-d[1],d[0]];capS(g,add(h,dirD(A.f+40,-3)),tip,1.8,C.wood[0]);
    poly(g,[add(tip,[n[0]*6,n[1]*6]),add(tip,[n[0]*-5+d[0]*1.5,n[1]*-5+d[1]*1.5]),add(tip,[-n[0]*5-d[0]*1.5,-n[1]*5-d[1]*1.5]),add(tip,[n[0]*5-d[0]*2,n[1]*5-d[1]*2])],C.metal[1]);
    capS(g,add(tip,[n[0]*5,n[1]*5]),add(tip,[-n[0]*4,-n[1]*4]),1.2,C.metal[0]);}
  if(kind==='guard'){const sc=add(h,dirD(A.f,-2.5)),S=C.steel;sc[0]=Math.min(sc[0],41);sc[1]=Math.min(sc[1],50);const _u=0,ang=A.f>60?-.15:.1;g.save();g.translate(sc[0],sc[1]);g.rotate(ang);
    g.fillStyle=S[1];g.fillRect(-2,-11,7,22);g.fillStyle=S[0];g.fillRect(-1,-10,5,20);g.fillStyle=S[2];g.fillRect(3,-10,1,20);g.fillStyle=C.acc;g.fillRect(0,-3,3,5);g.fillRect(1,-6,1,11);g.restore();}
}
function humanHR(kind,p,pn){
  const C=HRPAL[kind],c=cvs(48,64),g=c.getContext('2d'),r=rigOf(p);
  drawLeg(g,r.bl,C,true);drawArm(g,r.ba,C,true,kind);drawLeg(g,r.fl,C,false);drawTorso(g,r,C,kind);drawHead(g,r,C,kind,p.eye);
  if(kind==='guard'){drawArm(g,r.fa,C,false,kind);drawWeapon(g,r,C,kind,pn);}
  else if(kind==='miner'){drawWeapon(g,r,C,kind,pn);drawArm(g,r.fa,C,false,kind);}
  else{drawArm(g,r.fa,C,false,kind);drawWeapon(g,r,C,kind,pn);}
  return pixelize(c,palOf(C).concat([hexRGB('#ffffff'),hexRGB('#1a1418'),hexRGB('#8a4a3a'),hexRGB('#3a2420'),hexRGB('#24202a'),hexRGB('#bff4ff'),hexRGB('#d8fbff'),hexRGB('#4ec8d8'),hexRGB('#f6e290'),hexRGB('#fff6c0'),hexRGB('#fff2c0')]));
}
/* ---- enemies at higher resolution ---- */
const EPAL={steel:['#6e7886','#474e5a','#a6b0bc','#2e333c'],rust:['#8a5a3a','#5a3a24','#b07a4e'],red:'#ff4a3a',orange:'#ff9a40',acid:['#9ad840','#5a9a20','#d8ff8a'],glass:['#5ac8e8','#2a7a9a','#c8f4ff'],dark:'#20232a',white:'#ffffff',yel:'#ffe08a'};
function houndHR(p){const c=cvs(64,44),g=c.getContext('2d'),S=EPAL.steel,dy=p.dy||0,lean=p.lean||0,bx=30+(p.dx||0),by=22+dy;
  const legs=[[bx+9,by+4,p.f1],[bx-9,by+4,p.b1]],legsB=[[bx+11,by+3,p.f2],[bx-7,by+3,p.b2]];
  legsB.forEach(([x,y,a])=>{const k=add([x,y],dirD(a,7));shadedCap(g,[x,y],k,3.2,dark(S));shadedCap(g,k,add(k,dirD(-a*.6,8)),2.6,dark(S));});
  g.save();g.translate(bx,by);g.rotate(lean*D2R);ell(g,0,0,14,6.5,S[1]);ell(g,1,-1,13,5.4,S[0]);ell(g,3,-3,9,2,S[2]);
  for(let k=-8;k<=6;k+=4)rect(g,k,-1,2,4,S[3]);rect(g,-4,-6,6,2,EPAL.orange);rect(g,-3,-6,2,1,EPAL.yel);
  capS(g,[-13,-2],[-19,-7+(p.tail||0)],2,S[1]);ell(g,-20,-8+(p.tail||0),1.6,1.6,S[2]);
  g.translate(13,-4);g.rotate((p.head||0)*D2R);capS(g,[0,0],[4,-3],5,S[1]);
  poly(g,[[2,-8],[13,-6],[14,-2],[12,0],[3,0]],S[1]);poly(g,[[3,-7],[12,-5.5],[12,-2.5],[4,-2]],S[0]);poly(g,[[3,-8],[5,-12],[7,-7]],S[1]);
  const jaw=p.jaw||0;poly(g,[[4,0],[13,-1+jaw*.2],[12,1+jaw],[5,2]],S[1]);if(jaw>1){rect(g,7,-1,5,jaw,'#5a1a1a');rect(g,8,-1,1,1,'#ffffff');rect(g,10,-1,1,1,'#ffffff');}
  rect(g,9,-5,3,2,EPAL.red);rect(g,10,-5,1,1,EPAL.white);g.restore();
  legs.forEach(([x,y,a])=>{const k=add([x,y],dirD(a,7));shadedCap(g,[x,y],k,3.6,S);shadedCap(g,k,add(k,dirD(-a*.6,8)),3,S);ell(g,...add(k,dirD(-a*.6,8)),2,1.4,S[3]);ell(g,k[0],k[1],1.6,1.6,EPAL.orange);});
  return pixelize(c,palOf(EPAL));}
function sweeperHR(p){const c=cvs(48,52),g=c.getContext('2d'),S=EPAL.steel,A=EPAL.acid,cx=24+(p.dx||0),cy=24+(p.dy||0);
  g.save();g.translate(cx,cy);g.rotate((p.lean||0)*D2R);
  [[-1,p.a2||-30],[1,p.a1||30]].forEach(([s,a],k)=>{const sh=[s*9,-4],el=add(sh,dirD(90*s+a*s*-1,8));shadedCap(g,sh,el,2.6,k?S:dark(S));const br=add(el,dirD(90*s+a*s*-1+40*s,6));capS(g,el,br,2,S[3]);
    for(let q=-2;q<=2;q++)capS(g,add(br,[q,0]),add(br,[q*1.4,4]),1,'#c8b070');});
  poly(g,[[-10,-12],[10,-12],[11,12],[-11,12]],S[1]);poly(g,[[-8,-12],[10,-12],[10.5,11],[-7,11]],S[0]);rect(g,7,-11,2,22,S[2]);
  ell(g,0,-12,10,4,S[1]);ell(g,1,-13,8,3,S[2]);rect(g,-6,-20,3,6,S[3]);ell(g,-4.5,-20,2.2,1.2,S[1]);
  rect(g,-5,-6,11,12,'#1a2a14');rect(g,-4,-5,9,10,A[1]);rect(g,-4,-5+(p.slosh||0),9,6,A[0]);rect(g,3,-4,1,4,A[2]);
  for(let k=-9;k<=9;k+=6){rect(g,k,-9,2,2,S[3]);rect(g,k,9,2,2,S[3]);}
  capS(g,[10,6],[16+(p.noz||0),5],3,S[1]);ell(g,17+(p.noz||0),5,2,2,p.spray?A[2]:S[3]);
  if(p.spray){for(let q=0;q<6;q++)ell(g,20+q*1.8,5+(q%2?1:-1)*q*.4,1.4-q*.12,1.2,A[q%2?0:2]);}
  poly(g,[[-6,12],[6,12],[4,16],[-4,16]],S[3]);g.restore();
  for(let q=0;q<4;q++)ell(g,cx+(q-1.5)*2,cy+19+q%2,1.4,2.6-q%2,q%2?EPAL.orange:EPAL.yel);
  return pixelize(c,palOf(EPAL));}
function mechHR(p,tank){const c=cvs(96,96),g=c.getContext('2d'),S=EPAL.steel,R=EPAL.rust,bx=46+(p.dx||0),by=44+(p.dy||0);
  const leg=(hx,a,b,col)=>{const h=[hx,by+10],k=add(h,dirD(a,15)),f=add(k,dirD(b,16));shadedCap(g,h,k,8,col);shadedCap(g,k,f,7,col);ell(g,k[0],k[1],4.4,4.4,col[1]);ell(g,k[0]+1,k[1]-1,2.2,2.2,col[2]);
    poly(g,[add(f,[-7,-2]),add(f,[9,-2]),add(f,[10,4]),add(f,[-8,4])],col[1]);poly(g,[add(f,[-6,-2]),add(f,[8,-2]),add(f,[8,1]),add(f,[-6,1])],col[0]);capS(g,add(h,[2,2]),add(k,[3,1]),1.6,EPAL.dark);};
  leg(bx-8,p.bl||-10,p.bl2||20,dark(R));
  if(tank){poly(g,[[bx-30,by-20],[bx-14,by-22],[bx-14,by+6],[bx-30,by+4]],EPAL.glass[1]);poly(g,[[bx-28,by-18],[bx-16,by-19],[bx-16,by+3],[bx-28,by+2]],EPAL.glass[0]);rect(g,bx-26,by-16,2,16,EPAL.glass[2]);
    for(let k=0;k<3;k++)rect(g,bx-30,by-14+k*8,16,2,S[1]);}
  else{for(let q=0;q<6;q++)capS(g,[bx-18,by-14+q*3],[bx-26-q,by-16+q*4],1.4,q%2?EPAL.dark:S[3]);}
  poly(g,[[bx-18,by-26],[bx+16,by-28],[bx+20,by+10],[bx-16,by+12]],R[1]);poly(g,[[bx-15,by-24],[bx+15,by-26],[bx+18,by+8],[bx-13,by+9]],R[0]);poly(g,[[bx+10,by-25],[bx+15,by-26],[bx+18,by+7],[bx+13,by+7]],R[2]);
  for(let y=-20;y<=6;y+=8)for(let x=-11;x<=11;x+=11)rect(g,bx+x,by+y,2,2,R[1]);
  rect(g,bx-14,by-2,28,3,EPAL.dark);
  poly(g,[[bx+2,by-36+(p.hd||0)],[bx+20,by-36+(p.hd||0)],[bx+22,by-26],[bx+2,by-25]],S[1]);poly(g,[[bx+3,by-35+(p.hd||0)],[bx+19,by-35+(p.hd||0)],[bx+20,by-27],[bx+3,by-26]],S[0]);
  rect(g,bx+10,by-32+(p.hd||0),10,3,p.hurt?EPAL.white:EPAL.red);rect(g,bx+17,by-32+(p.hd||0),2,1,EPAL.white);
  capS(g,[bx-6,by-30],[bx-6,by-42],3,S[3]);ell(g,bx-6,by-43,2.6,1.4,S[1]);
  leg(bx+8,p.fl||8,p.fl2||-8,R);
  const sh=[bx+14,by-18],el=add(sh,dirD(p.ca||70,14)),mz=add(el,dirD(p.ca2||90,18));
  shadedCap(g,sh,el,7,S);ell(g,sh[0],sh[1],5.5,5.5,S[1]);ell(g,sh[0]+1,sh[1]-1,3,3,S[2]);
  shadedCap(g,el,mz,9,dark(S,.9));capS(g,add(el,[1,-3]),add(mz,[0,-3]),1.4,S[2]);ell(g,mz[0],mz[1],4.2,4.2,S[3]);ell(g,mz[0],mz[1],2.4,2.4,EPAL.dark);
  if(p.flash){ell(g,mz[0]+5,mz[1],6,5,EPAL.yel);ell(g,mz[0]+4,mz[1],3.4,3,EPAL.white);ell(g,mz[0]+11,mz[1],3,2.4,EPAL.orange);}
  return pixelize(c,palOf(EPAL));}
const EPOSE={
 hound:{idle0:{f1:8,b1:-8,f2:4,b2:-4},idle1:{dy:1,tail:2,f1:10,b1:-6,f2:6,b2:-2},wind:{dy:3,lean:-6,head:12,f1:30,b1:-20,f2:20,b2:-30,tail:-3},dash:{lean:6,head:-6,f1:70,b1:-60,f2:60,b2:-70,dx:2},
   strike:{lean:8,head:-10,jaw:4,f1:80,b1:-50,f2:70,b2:-60,dx:4},follow:{lean:4,head:-4,jaw:3,f1:50,b1:-30,f2:40,b2:-40,dx:3},hurt:{lean:-14,head:18,f1:-20,b1:-10,f2:-30,b2:-5,dx:-3}},
 sweeper:{idle0:{a1:30,a2:-30},idle1:{a1:35,a2:-25,dy:1,slosh:1},wind:{a1:-30,a2:-60,lean:-8,noz:-2},dash:{a1:20,a2:-20,lean:10},
   strike:{a1:60,a2:20,lean:8,noz:2,spray:1,slosh:-1},follow:{a1:50,a2:10,lean:5,noz:1,spray:1},hurt:{a1:-10,a2:-80,lean:-16,dx:-2,slosh:2}},
 mech:{idle0:{},idle1:{dy:1,ca:72},wind:{fl:40,fl2:-10,dy:-4,hd:-1,ca:120,ca2:110,dx:-2},dash:{fl:30,bl:-30,dx:2},
   strike:{fl:20,fl2:-15,dy:2,ca:80,ca2:92,flash:1,dx:3},follow:{fl:14,dy:1,ca:76,ca2:92,dx:2},hurt:{dy:-1,dx:-3,hd:2,hurt:1,ca:50,ca2:60}},
};
/* frame sets */
const HR_CACHE={};
const HUMAN_HR=['ryan','claire','miner','guard'];
function hrSet(kind,tank=true){
  const key=kind+(kind==='mech'?(tank?'T':'N'):'');if(HR_CACHE[key])return HR_CACHE[key];
  let draw,P;
  if(HUMAN_HR.includes(kind)){P=HPOSE;draw=(p,n)=>humanHR(kind,p,n);}
  else if(EPOSE[kind]){P=EPOSE[kind];draw=p=>kind==='hound'?houndHR(p):kind==='sweeper'?sweeperHR(p):mechHR(p,tank);}
  else return null;
  const T=(p,n)=>tex(draw(p,n)),mk=(a,b,n)=>{const out=[];for(let k=1;k<=n;k++)out.push(T(mixPose(P[a],P[b],k/n),k===n?b:a));return out;};
  const set={idle:[T(P.idle0,'idle0'),T(P.idle1,'idle1')],
    wind:mk('idle0','wind',3),dash:mk('wind','dash',2),
    strike:[T(P.strike,'strike'),T(mixPose(P.strike,P.follow,.5),'strike'),T(P.follow,'follow')],
    hurt:[T(P.hurt,'hurt')]};
  if(P.castA){set.cast=[T(P.castA,'castA'),T(mixPose(P.castA,P.castB,.5),'castA'),T(P.castB,'castB')];set.aim=mk('idle0','aim',2);set.win=mk('idle0','win',2);}
  else{set.cast=set.strike;set.aim=set.strike;set.win=set.idle;}
  if(kind==='claire'){set.cast=set.strike;}
  return HR_CACHE[key]=set;}
/* ---- plug into the battle theater ---- */
const TH_H2={ryan:2.5,claire:2.5,miner:2.5,guard:2.5,hound:1.6,sweeper:1.8,mech:3.8};
{const o=thSprite;thSprite=function(src,h){
  const tank=src.kind!=='mech'||!B||!B.mechFrames||src.frames===B.mechFrames.tank,hr=hrSet(src.kind,tank);
  if(!hr)return o(src,h);const s=o({kind:src.kind,frames:hr.idle},TH_H2[src.kind]||h);s.hr=hr;s.h=TH_H2[src.kind]||h;return s;};}
{const o=getPose;getPose=function(s,pose){
  if(s&&s.hr){const seq=s.hr[pose]||null;s.pn=pose;s.pt=0;return seq?seq[0]:null;}
  return o(s,pose==='dash'?'strike':pose);};}
{const o=thTick;thTick=function(dt){
  if(TH.active)(TH.sprites||[]).forEach(s=>{if(s.hr&&s.pose&&s.pn){s.pt+=dt;const seq=s.hr[s.pn];if(seq){const fps=s.pn==='strike'?18:s.pn==='hurt'?1:12;s.pose=seq[Math.min(seq.length-1,Math.floor(s.pt*fps))];}}
    if(s.hr&&!s.pose&&s.mat.map!==s.frames[0]&&s.mat.map!==s.frames[1])s.mat.map=s.frames[0];});
  return o(dt);};}
/* richer theater backdrop: painted sky + parallax silhouettes + floating dust */
function skyHR(theme){const W=480,H=200,c=cvs(W,H),g=c.getContext('2d'),[a,b,d]=THEME_SKY[theme]||THEME_SKY.hangar;
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,d);gr.addColorStop(.7,b);gr.addColorStop(1,a);g.fillStyle=gr;g.fillRect(0,0,W,H);
  let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  if(theme==='town'||theme==='train'){for(let k=0;k<70;k++){g.fillStyle=`rgba(220,230,255,${.2+rnd()*.5})`;g.fillRect(rnd()*W|0,rnd()*H*.5|0,1,1);}g.fillStyle='rgba(230,236,255,.85)';g.beginPath();g.arc(380,40,14,0,7);g.fill();}
  if(theme==='hangar'||theme==='yard'){const gg=g.createRadialGradient(240,150,10,240,150,190);gg.addColorStop(0,'rgba(255,150,60,.55)');gg.addColorStop(1,'rgba(255,150,60,0)');g.fillStyle=gg;g.fillRect(0,0,W,H);
    g.fillStyle='rgba(20,10,6,.85)';for(let x=0;x<W;x+=40){g.fillRect(x,20,8,H);g.fillRect(x-14,20+((x/40)%3)*10,36,4);}for(let k=0;k<5;k++){g.fillRect(0,30+k*34,W,2);}}
  if(theme==='sewer'){g.fillStyle='rgba(6,14,8,.9)';for(let x=-40;x<W;x+=96){g.beginPath();g.moveTo(x,H);g.lineTo(x,90);g.arc(x+48,90,48,Math.PI,0);g.lineTo(x+96,H);g.lineTo(x+86,H);g.lineTo(x+86,92);g.arc(x+48,92,38,0,Math.PI,true);g.lineTo(x+10,H);g.fill();}
    g.fillStyle='rgba(120,255,110,.18)';for(let k=0;k<40;k++)g.fillRect(rnd()*W|0,120+rnd()*80|0,2,1);}
  if(theme==='town'){g.fillStyle='rgba(8,12,22,.95)';let x=0;while(x<W){const w=24+rnd()*30|0,h=50+rnd()*70|0;g.fillRect(x,H-h,w,h);g.beginPath();g.moveTo(x-3,H-h);g.lineTo(x+w/2,H-h-14);g.lineTo(x+w+3,H-h);g.fill();
      g.fillStyle='rgba(255,196,110,.75)';for(let q=0;q<3;q++)if(rnd()<.6)g.fillRect(x+4+q*7,H-h+10+((q*13)%30),3,4);g.fillStyle='rgba(8,12,22,.95)';x+=w+2;}
    g.strokeStyle='rgba(160,190,230,.18)';for(let k=0;k<120;k++){const rx=rnd()*W,ry=rnd()*H;g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-3,ry+9);g.stroke();}}
  if(theme==='train'){g.fillStyle='rgba(10,12,20,.95)';g.fillRect(0,0,W,46);g.fillRect(0,150,W,50);for(let x=10;x<W;x+=80){g.fillStyle='rgba(10,12,20,.95)';g.fillRect(x-10,46,12,104);g.fillStyle='rgba(150,180,220,.25)';g.fillRect(x+6,60,58,60);}
    g.fillStyle='rgba(255,200,120,.6)';for(let x=50;x<W;x+=120)g.fillRect(x,40,10,4);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;return t;}
{const o=thBuild;thBuild=function(theme){o(theme);const sky=TH.world.children[0];if(sky&&sky.material){sky.material.map=skyHR(theme);sky.material.needsUpdate=true;}
  const dc={hangar:0xffc890,yard:0xffc890,sewer:0x9aff8a,town:0xa8c8ff,train:0xffe0b0}[theme]||0xffffff;
  const g=new THREE.BufferGeometry(),n=90,a=new Float32Array(n*3);for(let q=0;q<n;q++){a[q*3]=(Math.random()-.5)*16;a[q*3+1]=Math.random()*5;a[q*3+2]=(Math.random()-.5)*6;}
  g.setAttribute('position',new THREE.BufferAttribute(a,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color:dc,size:.05,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));
  TH.world.add(pts);E.fxs.push(dt=>{if(!TH.active||!pts.parent)return false;const A=g.attributes.position.array;for(let q=0;q<n;q++){A[q*3]+=dt*.15;A[q*3+1]+=Math.sin(q+performance.now()/900)*dt*.05;if(A[q*3]>8)A[q*3]=-8;}g.attributes.position.needsUpdate=true;});};}
Object.assign(TH_H,TH_H2);
