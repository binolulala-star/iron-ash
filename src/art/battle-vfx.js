/* ======================= BATTLE VFX: array activation, per-recipe effects, impacts, BREAK shatter ======================= */
const VFX={
 add(o,life,upd){E.world.add(o);let t=0;E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/life);if(upd)upd(k,dt,t);if(k>=1){E.world.remove(o);o.traverse&&o.traverse(m=>{m.geometry&&m.geometry.dispose();});return false;}});return o;},
 mat(color,op=1){return new THREE.MeshBasicMaterial({color,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});},
 ring(p,color,r0,r1,life=.6,y=.06,w=.12){const m=new THREE.Mesh(new THREE.RingGeometry(.9,1,48),this.mat(color));m.rotation.x=-Math.PI/2;m.position.set(p.x,p.y+y,p.z);
   return this.add(m,life,k=>{const r=r0+(r1-r0)*(1-(1-k)**3);m.scale.set(r,r,r);m.material.opacity=(1-k)**1.5;});},
 light(p,color,I,life=.5,dist=9){I*=.5;const l=new THREE.PointLight(color,I,dist);l.position.set(p.x,p.y+1.1,p.z);return this.add(l,life,k=>{l.intensity=I*(1-k)**2;});},
 pillar(p,color,h=3,life=.9,r=.22){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.3,h,16,1,true),this.mat(color,.0));m.position.set(p.x,p.y+h/2,p.z);
   return this.add(m,life,k=>{m.material.opacity=Math.sin(k*Math.PI)*.35;m.scale.x=m.scale.z=1+k*.6;});},
 parts(p,{color=0xffffff,n=30,spd=2,up=1,grav=4,size=.12,life=1,spread=.3,y=.4,drag=0}={}){
   const g=new THREE.BufferGeometry(),a=new Float32Array(n*3),v=[];for(let q=0;q<n;q++){a[q*3]=p.x+(rnd()-.5)*spread;a[q*3+1]=p.y+y+(rnd()-.5)*spread*.5;a[q*3+2]=p.z+(rnd()-.5)*spread;
     const th=rnd()*Math.PI*2,s=spd*(.4+rnd()*.6);v.push([Math.cos(th)*s,up*spd*(.3+rnd()),Math.sin(th)*s]);}
   g.setAttribute('position',new THREE.BufferAttribute(a,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color,size,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
   return this.add(pts,life,(k,dt)=>{for(let q=0;q<n;q++){v[q][1]-=grav*dt;if(drag){v[q][0]*=1-drag*dt;v[q][2]*=1-drag*dt;}a[q*3]+=v[q][0]*dt;a[q*3+1]=Math.max(.03,a[q*3+1]+v[q][1]*dt);a[q*3+2]+=v[q][2]*dt;}
     g.attributes.position.needsUpdate=true;pts.material.opacity=(1-k)**1.2;});},
 spikes(p,color,n=7,h=1.3,life=1.1){const g=new THREE.Group();g.position.set(p.x,p.y,p.z);const mat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.6,roughness:.2,metalness:.1,transparent:true,flatShading:true});
   for(let q=0;q<n;q++){const c=new THREE.Mesh(new THREE.ConeGeometry(.09+rnd()*.07,h*(.6+rnd()*.6),5),mat);const a=rnd()*Math.PI*2,r=rnd()*.45;c.position.set(Math.cos(a)*r,0,Math.sin(a)*r);c.rotation.set((rnd()-.5)*.7,rnd()*3,(rnd()-.5)*.7);c.userData.h=c.geometry.parameters.height;g.add(c);}
   return this.add(g,life,k=>{const s=k<.15?k/.15:k>.7?1-(k-.7)/.3:1;g.children.forEach(c=>{c.scale.set(1,Math.max(.01,s),1);c.position.y=c.userData.h*s/2;});mat.opacity=k>.7?1-(k-.7)/.3:1;});},
 bolt(a,b,color=0xaee8ff,life=.55,w=3){const pts=[],n=10;for(let q=0;q<=n;q++)pts.push(new THREE.Vector3());const g=new THREE.BufferGeometry().setFromPoints(pts);
   const line=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,linewidth:w}));let acc=1;
   return this.add(line,life,(k,dt)=>{acc+=dt;if(acc>.045){acc=0;const arr=g.attributes.position.array;for(let q=0;q<=n;q++){const f=q/n,j=q&&q<n?.28:0;
     arr[q*3]=a.x+(b.x-a.x)*f+(rnd()-.5)*j;arr[q*3+1]=a.y+(b.y-a.y)*f+.5+(rnd()-.5)*j+Math.sin(f*Math.PI)*.25;arr[q*3+2]=a.z+(b.z-a.z)*f+(rnd()-.5)*j;}g.attributes.position.needsUpdate=true;}
     line.material.opacity=rnd()>.25?(1-k):.1;});},
 dome(p,color,r=2.4,life=1.4){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color,wireframe:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
   m.position.set(p.x,p.y,p.z);return this.add(m,life,k=>{const s=r*(1-(1-Math.min(1,k*2.5))**3);m.scale.set(s,s,s);m.rotation.y=k*1.5;m.material.opacity=k<.6?.7:.7*(1-(k-.6)/.4);});},
 shards(p,color,n=14,life=1){const g=new THREE.Group();g.position.set(p.x,p.y+.8,p.z);const mat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.5,metalness:.6,roughness:.3,transparent:true,flatShading:true});const v=[];
   for(let q=0;q<n;q++){const s=new THREE.Mesh(new THREE.TetrahedronGeometry(.07+rnd()*.09),mat);g.add(s);const th=rnd()*Math.PI*2,sp=1.5+rnd()*2.2;v.push([Math.cos(th)*sp,1.2+rnd()*2.4,Math.sin(th)*sp,(rnd()-.5)*14]);}
   return this.add(g,life,(k,dt)=>{g.children.forEach((s,q)=>{v[q][1]-=7*dt;s.position.x+=v[q][0]*dt;s.position.y=Math.max(-p.y-.75,s.position.y+v[q][1]*dt);s.position.z+=v[q][2]*dt;s.rotation.x+=v[q][3]*dt;s.rotation.z+=v[q][3]*dt*.7;});mat.opacity=1-k**3;});},
};
/* rune circle texture (drawn once) */
const SIGIL=(()=>{const c=cvs(256,256),g=c.getContext('2d');g.translate(128,128);g.strokeStyle='#fff';g.fillStyle='#fff';
  const circ=(r,w)=>{g.lineWidth=w;g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.stroke();};circ(122,3);circ(112,1.5);circ(70,2);circ(40,1.2);
  for(let k=0;k<48;k++){const a=k/48*Math.PI*2,l=k%4?6:12;g.lineWidth=k%4?1:2;g.beginPath();g.moveTo(Math.cos(a)*112,Math.sin(a)*112);g.lineTo(Math.cos(a)*(112-l),Math.sin(a)*(112-l));g.stroke();}
  for(const n of [3,4]){g.lineWidth=1.6;g.beginPath();for(let k=0;k<=n;k++){const a=k/n*Math.PI*2-Math.PI/2+(n===4?Math.PI/4:0);k?g.lineTo(Math.cos(a)*108,Math.sin(a)*108):g.moveTo(Math.cos(a)*108,Math.sin(a)*108);}g.stroke();}
  g.font='bold 15px serif';g.textAlign='center';g.textBaseline='middle';['Fe','Si','C','H','O','Al','N','S'].forEach((s,k)=>{const a=k/8*Math.PI*2;g.fillText(s,Math.cos(a)*91,Math.sin(a)*91);});
  return new THREE.CanvasTexture(c);})();
VFX.sigil=function(p,color,r,life=1.3){const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:SIGIL,color,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  m.rotation.x=-Math.PI/2;m.position.set(p.x,p.y+.05,p.z);return this.add(m,life,k=>{const s=r*(k<.2?.6+.4*(k/.2):1);m.scale.set(s,s,s);m.rotation.z=k*1.6;m.material.opacity=k<.2?k/.2:k>.65?1-(k-.65)/.35:1;});};

const RCOL={R01:0xd8eaff,R02:0xffb060,R03:0xe8f4ff,R04:0xb8f040,R05:0xc8a878,R06:0x8ad8ff,R07:0xff7a30,R08:0xb0b8c8,R09:0xc890ff,R10:0xffd070,R11:0xd8b878,R12:0xa8e040,R13:0x7ad0ff,R14:0x9a8aff,R16:0xc8b48a,R17:0xbff4ff};
const center=cs=>{const v=new THREE.Vector3();cs.forEach(([i,j])=>v.add(W(i,j)));return v.multiplyScalar(1/cs.length);};

function castFx(r,pts,cells,inC,near){const col=RCOL[r.id]||0xffd27a,ctr=center(cells),ap=pts.map(p=>W(p.i,p.j));
  // 1. activation: pillars on anchors, beams between them, rune circle over the shape
  ap.forEach(a=>{VFX.pillar(a,col,3.2,1);VFX.ring(a,col,.2,.9,.6);});
  for(let k=0;k<ap.length&&ap.length>1;k++){const a=ap[k],b=ap[(k+1)%ap.length];if(ap.length===2&&k)break;VFX.bolt(a,b,col,.7);}
  const span=Math.max(1.2,...cells.map(([i,j])=>W(i,j).distanceTo(ctr)))+.7;VFX.sigil(ctr,col,span);VFX.light(ctr,col,3,1.1,8);
  // 2. the reaction itself, a beat later
  setTimeout(()=>{if(!B)return;const at=t=>W(t.i,t.j);
    switch(r.id){
     case'R01':if(near){VFX.spikes(at(near),0xd8eaff,9,1.5);VFX.parts(at(near),{color:0xe8f4ff,n:40,spd:2.4});E.shake=.5;}break;
     case'R02':{const c=B.units.claire;if(c.alive){const p=c.spr.holder.position;VFX.pillar(p,0xffb060,2.4,1,.35);VFX.parts(p,{color:0xffa040,n:50,spd:1,up:2.2,grav:-1,life:1.2,spread:.6});}}break;
     case'R03':['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive){const p=u.spr.holder.position;VFX.parts(p,{color:0xe8f4ff,n:60,spd:.8,up:1.4,grav:-.8,size:.22,life:1.6,spread:.9});VFX.ring(p,0x7fe0b0,.3,1.4,.8);}});break;
     case'R04':if(near){const a=ctr.clone(),b=at(near);for(let q=0;q<5;q++)setTimeout(()=>VFX.parts(a.clone().lerp(b,q/4),{color:0xb8f040,n:14,spd:.8,up:1.5,size:.14,life:.7}),q*60);
       VFX.parts(b,{color:0xd8ff60,n:60,spd:1.2,up:1.2,grav:-.6,size:.2,life:1.4,spread:.7});VFX.ring(b,0xa8e040,.2,1.3,.7);}break;
     case'R05':cells.forEach(([i,j])=>{const p=W(i,j);VFX.parts(p,{color:0xc8a878,n:30,spd:2.4,up:.8,size:.16,life:1,y:.1});VFX.ring(p,0xc8a878,.2,1,.6);});E.shake=.7;break;
     case'R06':{const hit=enemiesNear(cells,1);cells.forEach(([i,j])=>VFX.parts(W(i,j),{color:0x6ab0e0,n:6,spd:1.6,size:.08,life:.4}));
       hit.forEach(e=>{for(let q=0;q<3;q++)setTimeout(()=>VFX.bolt(ctr,at(e),0xcff2ff,.35),q*110);VFX.light(at(e),0x8ad8ff,6,.4,5);});}break;
     case'R07':cells.forEach(([i,j],q)=>setTimeout(()=>{const p=W(i,j);VFX.parts(p,{color:0xc84a18,n:26,spd:.7,up:2.6,grav:-1.4,size:.18,life:1.3,spread:.8,y:.1});VFX.parts(p,{color:0xffb040,n:10,spd:.5,up:3.2,grav:-2,size:.1,life:1.1,spread:.6});VFX.light(p,0xff7a30,2,1,4);},q*70));E.shake=.4;break;
     case'R08':inC.forEach(e=>{const p=at(e);VFX.spikes(p,0x6a7080,8,1.1,1.6);VFX.ring(p,0xb0b8c8,1.4,.4,.6,.5);VFX.parts(p,{color:0xffd8a0,n:30,spd:2.2,size:.09,life:.6});});E.shake=.5;break;
     case'R09':cells.forEach(([i,j])=>VFX.parts(W(i,j),{color:0xc890ff,n:16,spd:.5,up:1,grav:-.4,size:.22,life:1.6,spread:.8}));break;
     case'R10':VFX.light(ctr,0xfff0c0,14,1.2,12);fx('flash');E.shake=1;inC.forEach(e=>{const p=at(e);VFX.pillar(p,0xffe0a0,2.6,1.1,.5);VFX.parts(p,{color:0xffd070,n:90,spd:3.2,up:1.4,grav:6,size:.1,life:1.3});VFX.ring(p,0xff9040,.3,2.2,.7);});break;
     case'R11':cells.forEach(([i,j])=>VFX.ring(W(i,j),0xd8b878,1,.15,1.1,.04));inC.forEach(e=>VFX.parts(at(e),{color:0xd8b878,n:40,spd:1.8,up:.4,grav:2,size:.12,life:1.2,y:.1}));break;
     case'R12':cells.forEach(([i,j])=>VFX.parts(W(i,j),{color:0xa8e040,n:18,spd:.6,up:.8,grav:-.5,size:.26,life:1.8,spread:.9}));inC.forEach(e=>VFX.ring(at(e),0xd8ff60,.3,1.2,.8));break;
     case'R13':['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive){const p=u.spr.holder.position;VFX.dome(p,0x7ad0ff,1.3,1.6);VFX.parts(p,{color:0x7fe0b0,n:40,spd:.6,up:1.6,grav:-1,life:1.4,spread:.7});}});break;
     case'R14':VFX.ring(ctr,0x9a8aff,span+1,.2,.7,.5);setTimeout(()=>{fx('flash');E.shake=1.2;VFX.ring(ctr,0xffffff,.2,span+2,.6,.4);VFX.light(ctr,0xc0b0ff,10,.6,12);inC.forEach(e=>VFX.parts(at(e),{color:0xc8c0ff,n:50,spd:3,size:.1,life:.8}));},650);break;
     case'R16':VFX.parts(ctr,{color:0xc8b48a,n:50,spd:2.6,up:.6,size:.15,life:1.1,y:.1});VFX.ring(ctr,0xc8b48a,.3,1.6,.7);break;
     case'R17':VFX.spikes(ctr,0xbff4ff,10,1.8,1.6);inC.forEach((e,q)=>{const c=[0xff8080,0xffe080,0x80ff9a,0x80c8ff,0xc890ff][q%5];VFX.bolt(ctr,at(e),c,.6);VFX.light(at(e),c,4,.6,5);});
       ['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive)VFX.dome(u.spr.holder.position,0xbff4ff,1.1,1.4);});break;
    }},380);}
{const o=cast;cast=function(r){if(!B||!canCast(r))return o(r);const pts=B.anchors.slice(-r.n),cells=cellsOfShape(pts),inC=enemiesIn(cells),near=nearestTo(pts,3);
  try{castFx(r,pts,cells,inC,near);}catch(e){}return o(r);};}

/* impacts on every hit; heavier for Claire's melee; BREAK shatters the armor */
{const o=damageEnemy;damageEnemy=function(e,amt,opt={}){if(!e||!e.alive)return o(e,amt,opt);const tg0=e.tg,p=W(e.i,e.j);const r=o(e,amt,opt);
  if(!opt.quiet){const melee=!B.casting&&B.sel==='claire';const col=opt.true?0xffd27a:melee?0xffe8c0:0xffb0a0;
    VFX.ring(p,col,.2,melee?1.3:.9,.35,.7);VFX.parts(p,{color:col,n:melee?26:14,spd:melee?3:2,up:.6,grav:5,size:.09,life:.45,y:.8});if(melee){E.shake=Math.max(E.shake||0,.35);VFX.light(p,0xffd8a0,3,.25,5);}}
  if(tg0>0&&e.tgMax&&e.tg===0){VFX.shards(p,0xd8b060,18,1.2);VFX.ring(p,0xffc860,.3,2.4,.6,.5,.2);fx('flash');E.shake=Math.max(E.shake||0,.9);}
  if(!e.alive){VFX.parts(p,{color:0xffffff,n:40,spd:1.2,up:1.6,grav:-.5,size:.14,life:1.2,spread:.6});VFX.ring(p,0xffffff,.3,1.6,.6);}
  return r;};}
{const o=damageUnit;damageUnit=function(u,amt){const alive=u&&u.alive,r=o(u,amt);if(alive&&B&&u.spr){const p=u.spr.holder.position;VFX.ring(p,0xff6a5a,.2,1,.35,.7);VFX.parts(p,{color:0xff8a7a,n:14,spd:2,up:.6,grav:5,size:.09,life:.4,y:.8});}return r;};}
/* the gas explosion gets a real fireball */
{const o=ignite;ignite=function(src){if(!B||!B.gas.size)return o(src);const cells=[...B.gas].map(k=>k.split(',').map(Number)),c=center(cells);
  VFX.light(c,0xffa040,16,1,14);VFX.ring(c,0xffd080,.3,4,.8,.3,.3);VFX.ring(c,0xffffff,.2,2.6,.4,.2);fx('flash');
  cells.forEach(([i,j],q)=>{const p=W(i,j);VFX.parts(p,{color:0xffa040,n:46,spd:2.6,up:1.6,grav:-.2,drag:1.5,size:.3,life:1.2,spread:.6});VFX.parts(p,{color:0x403830,n:20,spd:1,up:1.6,grav:-1,size:.34,life:2,spread:.8,y:1});});
  return o(src);};}
/* forbidden overload: grey shockwave */
{const o=forbid;forbid=function(){if(B&&!B.forbidUsed){const r=B.units.ryan;if(r.alive){const p=r.spr.holder.position;VFX.pillar(p,0xe9e3d4,5,1.6,.45);VFX.ring(p,0xe9e3d4,.3,5,1.4,.2);}}return o();};}
