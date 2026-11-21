/* ======================= BATTLE VFX ======================= */
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const addM=(c,o=1)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const cellP=(i,j,y=0)=>{const v=W(i,j);v.y=y;return v;};
const uPos=(u,y=.7)=>{const v=u.spr.holder.position.clone();v.y=y;return v;};
function life(obj,dur,upd,delay=0){let t=-delay;obj.visible=delay<=0;E.world.add(obj);
  E.fxs.push(dt=>{t+=dt;if(t<0)return;obj.visible=true;const k=Math.min(1,t/dur);upd(k,dt,t);
    if(k>=1){E.world.remove(obj);obj.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.dispose)o.material.dispose();});return false;}});}
function vring(p,c,r1,dur,{r0=.1,y=.06,vertical=false,delay=0,w=.18}={}){
  const m=new THREE.Mesh(new THREE.RingGeometry(1-w,1,48),addM(c,.9));m.position.copy(p);m.position.y=vertical?p.y:y;
  if(vertical)m.quaternion.copy(E.camera.quaternion);else m.rotation.x=-Math.PI/2;
  life(m,dur,k=>{const r=r0+(r1-r0)*(1-Math.pow(1-k,3));m.scale.set(r,r,r);m.material.opacity=.9*(1-k);},delay);}
function pillar(p,c,h,w,dur,delay=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(w,w*1.2,h,16,1,true),addM(c,.8));m.position.set(p.x,h/2,p.z);
  life(m,dur,k=>{m.scale.set(1-k*.6,Math.min(1,k*5),1-k*.6);m.material.opacity=.8*(1-k);},delay);}
let HALO=null;
function haloTex(){if(HALO)return HALO;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);HALO=new THREE.CanvasTexture(c);return HALO;}
function glow(p,c,int,dur,dist=7,delay=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:haloTex(),color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  m.position.copy(p);m.position.y=Math.max(.6,p.y);const S=Math.min(3.2,dist*.22+int*.1);
  life(m,dur,k=>{m.quaternion.copy(E.camera.quaternion);const a=k<.1?k*10:1-k;m.material.opacity=a*.5;m.scale.setScalar(S*(.7+.3*a));},delay);
  const f=new THREE.Mesh(new THREE.CircleGeometry(1,24),new THREE.MeshBasicMaterial({map:haloTex(),color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  f.rotation.x=-Math.PI/2;f.position.set(p.x,.04,p.z);life(f,dur,k=>{f.material.opacity=(k<.1?k*10:1-k)*.45;f.scale.setScalar(S*.8);},delay);}
function parts(p,{n=30,c=0xffffff,spd=2,up=1,grav=3,dur=.9,size=.12,spread=.3,converge=false,delay=0,drag=0}={}){
  const g=new THREE.BufferGeometry(),a=new Float32Array(n*3),v=[];
  for(let q=0;q<n;q++){const ang=Math.random()*Math.PI*2,r=Math.random()*spread;
    if(converge){const R=1.6+Math.random();a[q*3]=p.x+Math.cos(ang)*R;a[q*3+1]=p.y+Math.random()*1.2;a[q*3+2]=p.z+Math.sin(ang)*R;v.push([0,0,0]);}
    else{a[q*3]=p.x+Math.cos(ang)*r;a[q*3+1]=p.y;a[q*3+2]=p.z+Math.sin(ang)*r;const s=spd*(.4+Math.random()*.8);v.push([Math.cos(ang)*s,up*(.5+Math.random())*spd,Math.sin(ang)*s]);}}
  g.setAttribute('position',new THREE.BufferAttribute(a,3));const pts=new THREE.Points(g,new THREE.PointsMaterial({color:c,size,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  life(pts,dur,(k,dt)=>{const A=g.attributes.position.array;for(let q=0;q<n;q++){
      if(converge){A[q*3]+=(p.x-A[q*3])*dt*5;A[q*3+1]+=(p.y-A[q*3+1])*dt*5;A[q*3+2]+=(p.z-A[q*3+2])*dt*5;}
      else{v[q][1]-=grav*dt;if(drag){v[q][0]*=1-drag*dt;v[q][2]*=1-drag*dt;}A[q*3]+=v[q][0]*dt;A[q*3+1]=Math.max(.02,A[q*3+1]+v[q][1]*dt);A[q*3+2]+=v[q][2]*dt;}}
    g.attributes.position.needsUpdate=true;pts.material.opacity=1-k*k;},delay);}
function bolt(a,b,c,dur,{segs=9,jit=.28,delay=0,width=1}={}){
  const g=new THREE.BufferGeometry(),arr=new Float32Array((segs+1)*3);g.setAttribute('position',new THREE.BufferAttribute(arr,3));
  const ln=new THREE.Line(g,new THREE.LineBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));let acc=1;
  life(ln,dur,(k,dt)=>{acc+=dt;if(acc>.05){acc=0;for(let q=0;q<=segs;q++){const t=q/segs,j=(q===0||q===segs)?0:jit;
      arr[q*3]=a.x+(b.x-a.x)*t+(Math.random()-.5)*j;arr[q*3+1]=a.y+(b.y-a.y)*t+(Math.random()-.5)*j;arr[q*3+2]=a.z+(b.z-a.z)*t+(Math.random()-.5)*j;}g.attributes.position.needsUpdate=true;}
    ln.material.opacity=Math.random()<.25?.2:1-k*.6;},delay);}
function proj(a,b,c,dur,{arc=0,size=.14,shape='sphere',delay=0,trail=true,spin=false}={}){
  const geo=shape==='spear'?new THREE.OctahedronGeometry(size):new THREE.SphereGeometry(size,10,8);
  const m=new THREE.Mesh(geo,addM(c,1));if(shape==='spear')m.scale.set(.5,.5,2.6);
  life(m,dur,k=>{const p=a.clone().lerp(b,k);p.y+=Math.sin(k*Math.PI)*arc;m.position.copy(p);if(shape==='spear')m.lookAt(b.clone().setY(b.y+Math.cos(k*Math.PI)*arc*.5));if(spin)m.rotation.z+=.4;
    if(trail&&Math.random()<.7)parts(p,{n:3,c,spd:.2,up:.2,grav:0,dur:.35,size:size*.9,spread:.02});},delay);}
function slash(p,c,dur,{size=1,tilt=0,delay=0}={}){
  const m=new THREE.Mesh(new THREE.RingGeometry(.55,.8,32,1,0,Math.PI*.9),addM(c,1));m.position.copy(p);
  life(m,dur,k=>{m.quaternion.copy(E.camera.quaternion);m.rotateZ(tilt+k*1.6);const s=size*(.6+k*.6);m.scale.set(s,s,s);m.material.opacity=1-k;},delay);}
function star(p,c,dur,{size=.8,delay=0}={}){const g=new THREE.Group();for(let q=0;q<4;q++){const b=new THREE.Mesh(new THREE.PlaneGeometry(size*1.6,size*.12),addM(c,1));b.rotation.z=q*Math.PI/4;g.add(b);}
  g.position.copy(p);life(g,dur,k=>{g.quaternion.copy(E.camera.quaternion);const s=k<.2?k*5:1+(k-.2)*.3;g.scale.set(s,s,s);g.children.forEach(b=>b.material.opacity=1-k);},delay);}
function spikes(cells,c,{h=1.1,dur=1,delay=0,count=3,mat}={}){
  cells.forEach(([i,j],n)=>{const g=new THREE.Group(),base=cellP(i,j);
    for(let q=0;q<count;q++){const s=new THREE.Mesh(new THREE.ConeGeometry(.09+Math.random()*.07,h*(.6+Math.random()*.6),5),mat||new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,roughness:.3,metalness:.4,transparent:true}));
      s.position.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6);s.rotation.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5);g.add(s);}
    g.position.copy(base);life(g,dur,k=>{const up=k<.18?k/.18:1,down=k>.75?(1-k)/.25:1;g.children.forEach(s=>{s.scale.y=Math.max(.01,up*down);s.position.y=s.geometry.parameters.height/2*up*down;});},delay+n*.04);});}
function cubes(p,c,{n=10,dur=.9,delay=0}={}){for(let q=0;q<n;q++){const m=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.1),addM(c,.9));const v=V3((Math.random()-.5)*2,1+Math.random()*1.5,(Math.random()-.5)*2);
  m.position.copy(p);m.position.y=.3;life(m,dur,(k,dt)=>{v.y-=3*dt;m.position.addScaledVector(v,dt);m.rotation.x+=dt*6;m.rotation.y+=dt*4;m.material.opacity=1-k;},delay);}}
function lattice(p,c,dur,delay=0){const g=new THREE.Group(),mat=new THREE.LineBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending});
  const geo=new THREE.EdgesGeometry(new THREE.BoxGeometry(.7,.7,.7));for(let q=0;q<3;q++){const l=new THREE.LineSegments(geo,mat);l.rotation.y=q*.5;l.rotation.x=q*.3;g.add(l);}
  g.position.copy(p);g.position.y=.5;life(g,dur,k=>{g.rotation.y+=.05;const s=1+k*.8;g.scale.set(s,s,s);mat.opacity=1-k;},delay);}
function chains(p,c,dur,delay=0){const g=new THREE.Group();for(let q=0;q<9;q++){const t=new THREE.Mesh(new THREE.TorusGeometry(.09,.025,6,12),new THREE.MeshStandardMaterial({color:0x2a2a30,metalness:.9,roughness:.35,emissive:c,emissiveIntensity:.25}));
    t.userData.a=q*.7;t.rotation.y=q*Math.PI/2;g.add(t);}g.position.copy(p);
  life(g,dur,k=>{g.children.forEach((t,q)=>{const a=t.userData.a+k*6,r=.45-k*.1;t.position.set(Math.cos(a)*r,Math.min(1.4,k*4)*q/9+.1,Math.sin(a)*r);t.rotation.x+=.1;});
    if(k>.85)g.scale.setScalar((1-k)/.15);},delay);}
function dome(p,c,dur,r=2.6,delay=0){const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:c,wireframe:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  m.position.copy(p);m.position.y=0;life(m,dur,k=>{const s=r*Math.min(1,k*3);m.scale.set(s,s,s);m.rotation.y+=.02;m.material.opacity=k<.7?.8:(1-k)/.3*.8;},delay);}
function sphereFx(p,c,dur,{r0=1.6,r1=.05,delay=0}={}){const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),addM(c,.4));m.position.copy(p);
  life(m,dur,k=>{const s=r0+(r1-r0)*k*k;m.scale.set(s,s,s);m.material.opacity=.35*(r1>r0?1-k:.3+k*.7);},delay);}
function smoke(p,c,{n=26,dur=1.6,size=.5,delay=0,rise=.6}={}){parts(p,{n,c,spd:.6,up:rise,grav:-.1,dur,size,spread:.6,delay,drag:1.5});}
function flashScreen(){fx('flash');}
const centroid=cells=>{const s=V3(0,0,0);cells.forEach(([i,j])=>s.add(W(i,j)));return s.multiplyScalar(1/Math.max(1,cells.length));};

/* recipe visuals */
function vfxRecipe(r,pts,cells){
  const R=B.units.ryan,from=uPos(R,1.2),ctr=centroid(cells),tgt=(r.id==='R01'||r.id==='R04')?nearestTo(pts,3):null;
  // casting sigil under Ryan + anchor beams
  vring(uPos(R,0),0xffd27a,.9,.7,{w:.12});pts.forEach(a=>pillar(cellP(a.i,a.j),0xffd27a,2.2,.06,.6));
  if(pts.length>=2)for(let q=0;q<pts.length;q++){const a=cellP(pts[q].i,pts[q].j,.15),b=cellP(pts[(q+1)%pts.length].i,pts[(q+1)%pts.length].j,.15);if(pts.length===2&&q===1)break;bolt(a,b,0xffe6a0,.5,{jit:.08});}
  switch(r.id){
   case'R01':{const to=tgt?cellP(tgt.i,tgt.j,.8):cellP(pts[0].i,pts[0].j,.8),st=cellP(pts[0].i,pts[0].j,.2);
     spikes([[pts[0].i,pts[0].j]],0xdfe8f0,{h:.9,dur:.6});proj(st,to,0xe8f4ff,.28,{shape:'spear',size:.18,arc:.4,delay:.12});
     star(to,0xffffff,.35,{delay:.38});parts(to,{n:24,c:0xdff0ff,spd:2.2,dur:.6,delay:.38,size:.09});break;}
   case'R02':{const C=B.units.claire,p=uPos(C,0);vring(p,0xc8a456,1.1,1,{w:.1});vring(p,0xffe0a0,.8,1,{w:.08,delay:.15});pillar(p,0xc8a456,2.4,.35,.9);
     parts(uPos(C,.2),{n:30,c:0xffe0a0,spd:.4,up:1.4,grav:-.5,dur:1.1,size:.09,spread:.35});glow(uPos(C),0xffc860,4,.8);break;}
   case'R03':cells.concat([[R.i,R.j],[B.units.claire.i,B.units.claire.j]]).slice(0,6).forEach(([i,j])=>smoke(cellP(i,j,.3),0xd8dde4,{n:16,dur:1.8,size:.6}));
     parts(uPos(R,.3),{n:20,c:0x7fe0b0,spd:.3,up:1.2,grav:-.3,dur:1.2,size:.1,spread:1.2});break;
   case'R04':{const to=tgt?cellP(tgt.i,tgt.j,.7):ctr.clone().setY(.7);for(let q=0;q<5;q++)proj(cellP(pts[0].i,pts[0].j,.4),to.clone().add(V3((Math.random()-.5)*.4,0,(Math.random()-.5)*.4)),0x9ad840,.35,{arc:.9+q*.1,size:.08,delay:q*.05,trail:false});
     parts(to,{n:30,c:0x9ad840,spd:1.6,up:.8,dur:.9,delay:.4,size:.1});smoke(to,0x6a9a30,{n:12,dur:1.2,delay:.4,size:.4});break;}
   case'R05':cells.forEach(([i,j],n)=>{parts(cellP(i,j,.1),{n:14,c:0xb8a890,spd:1.4,up:.6,dur:.8,size:.12,delay:n*.05,spread:.4});vring(cellP(i,j),0xc8b090,.7,.5,{delay:n*.05});});E.shake=.6;break;
   case'R06':{for(let q=0;q<pts.length;q++){const a=cellP(pts[q].i,pts[q].j,.5),b=cellP(pts[(q+1)%pts.length].i,pts[(q+1)%pts.length].j,.5);if(pts.length===2&&q===1)break;
       for(let z=0;z<3;z++)bolt(a,b,0x8ad8ff,.8,{jit:.35,delay:z*.08});}
     enemiesNear(cells,1).forEach(e=>{const p=cellP(e.i,e.j,.8);bolt(cellP(pts[0].i,pts[0].j,.5),p,0xc8f0ff,.6,{jit:.4,delay:.15});star(p,0x8ad8ff,.4,{delay:.2});parts(p,{n:20,c:0x8ad8ff,spd:2,dur:.5,size:.07,delay:.2});});
     glow(ctr,0x8ad8ff,6,.6,9);break;}
   case'R07':cells.forEach(([i,j],n)=>{const p=cellP(i,j,.05);parts(p,{n:22,c:0xff7a30,spd:.5,up:2.2,grav:-.4,dur:1.2,size:.16,spread:.4,delay:n*.03});parts(p,{n:10,c:0xffd060,spd:.3,up:2.8,grav:-.6,dur:.9,size:.1,spread:.3,delay:n*.03});});
     glow(ctr,0xff7a30,5,1.2,9);break;
   case'R08':enemiesIn(cells).forEach(e=>{const p=cellP(e.i,e.j,0);chains(p,0xc8a456,1.3);parts(cellP(e.i,e.j,.05),{n:16,c:0x6a5a40,spd:1.2,up:.8,dur:.7,size:.12});});
     spikes(cells,0x3a3a44,{h:.7,count:2,dur:1.1,mat:new THREE.MeshStandardMaterial({color:0x2a2a30,metalness:.9,roughness:.3})});E.shake=.5;break;
   case'R09':cells.forEach(([i,j],n)=>{if(B.tiles[i][j]!=='water')return;const p=cellP(i,j,.05);parts(p,{n:18,c:0xbfe6ff,spd:.2,up:1.4,grav:-.5,dur:1.4,size:.08,spread:.4,delay:n*.04});
       bolt(p.clone().setY(.1),p.clone().setY(.9),0x8ad8ff,.6,{jit:.2,delay:n*.04});});glow(ctr,0x8ad8ff,4,1,8);break;
   case'R10':enemiesIn(cells).concat([]).forEach(e=>{const p=cellP(e.i,e.j,.1);parts(p,{n:60,c:0xfff2c0,spd:2.6,up:1.6,grav:5,dur:1.2,size:.08});parts(p,{n:20,c:0xff8a30,spd:1.2,up:2,dur:1.3,size:.14});
       pillar(p,0xfff0c0,2.2,.3,.7);glow(p,0xffe0a0,6,1,7);});if(!enemiesIn(cells).length)parts(ctr.setY(.1),{n:40,c:0xfff2c0,spd:2,up:1.4,grav:5,dur:1});break;
   case'R11':cells.forEach(([i,j],n)=>vring(cellP(i,j),0x9a7a50,.6,1.2,{r0:.6,w:.3,delay:n*.03}));vring(ctr,0x8a6a40,.3,1.4,{r0:2.2,w:.15});
     enemiesIn(cells).forEach(e=>parts(cellP(e.i,e.j,.1),{n:20,c:0xb89a6a,spd:.5,up:.4,grav:1,dur:1,size:.12}));break;
   case'R12':cells.forEach(([i,j],n)=>smoke(cellP(i,j,.2),0x9ad840,{n:14,dur:1.8,size:.55,delay:n*.04,rise:.4}));glow(ctr,0x9ad840,4,1.6,9);break;
   case'R13':dome(uPos(R,0),0x8ad8ff,1.6,2.8);dome(uPos(B.units.claire,0),0x8ad8ff,1.6,2.2,.1);parts(uPos(R,.5),{n:30,c:0xc8f0ff,spd:.4,up:1,grav:-.4,dur:1.4,size:.08,spread:1.2});break;
   case'R14':{const p=ctr.clone().setY(.8);sphereFx(p,0x4a3ac0,.7);vring(p,0xa89aff,.05,.7,{r0:2.4,w:.12,vertical:true});parts(p,{n:40,c:0xb8b0ff,converge:true,dur:.7,size:.1});
     star(p,0xd8d0ff,.5,{size:1.4,delay:.65});glow(p,0xa89aff,6,.6,8,.6);setTimeout(()=>{E.shake=1.2;},650);break;}
  }
}
/* action visuals */
function vfxAction(mode,u,i,j,e){
  const up=uPos(u,.8),tp=cellP(i,j,.8);
  switch(mode){
   case'decompose':lattice(cellP(i,j),0x8ad8ff,.8);cubes(cellP(i,j),0xbfeae0,{n:12});vring(cellP(i,j),0x8ad8ff,.8,.5);break;
   case'tap':if(!e)return;for(let q=0;q<3;q++)vring(up.clone().lerp(tp,.3+q*.25),0x8ae8ff,.5,.45,{r0:.1,vertical:true,w:.15,delay:q*.07});star(tp,0xbff4ff,.3,{size:.6,delay:.2});break;
   case'punch':if(!e)return;star(tp,u.buff2?0xffd27a:0xffffff,.32,{size:u.buff2?1.2:.8});vring(cellP(i,j),0xffd8a0,.9,.35);
     if(u.buff2){slash(tp,0xffc860,.4,{size:1.2});glow(tp,0xffc860,5,.4);}parts(tp,{n:14,c:0xffe0b0,spd:2.2,dur:.4,size:.08});E.shake=Math.max(E.shake,.3);break;
   case'pile':if(!e)return;vring(cellP(i,j),0xc8a456,1.6,.5,{w:.25});vring(cellP(i,j),0xffffff,1,.35,{w:.1,delay:.05});star(tp,0xffe0a0,.35,{size:1.1});
     parts(cellP(i,j,.1),{n:22,c:0xa89070,spd:2,up:.5,dur:.6,size:.12});E.shake=Math.max(E.shake,.6);break;
   case'blade':if(!e)return;slash(tp,0xbff4ff,.35,{size:1.1,tilt:-.6});slash(tp,0xffffff,.3,{size:.9,tilt:2.2,delay:.08});parts(tp,{n:18,c:0xd8f4ff,spd:2.6,dur:.45,size:.07});break;
   case'freeze':if(!e)return;spikes([[i,j]],0xbfeaff,{h:.9,count:5,dur:1.4,mat:new THREE.MeshStandardMaterial({color:0xd8f4ff,emissive:0x5aa8d8,emissiveIntensity:.4,transparent:true,opacity:.85,roughness:.1})});
     vring(cellP(i,j),0xd8f4ff,1.5,.7,{w:.3});smoke(cellP(i,j,.2),0xe8f8ff,{n:16,dur:1,size:.4,rise:.2});glow(tp,0x8ad8ff,4,.8);break;
   case'gun':{const muzzle=up.clone().lerp(tp,.12);star(muzzle,0xffd080,.18,{size:.5});glow(muzzle,0xffa040,4,.2);
     proj(muzzle,tp,0xffd080,.14,{size:.06,trail:true});parts(tp,{n:12,c:0xffc060,spd:2,dur:.35,size:.07,delay:.12});break;}
   case'stake':proj(up,cellP(i,j,.1),0xffd27a,.25,{shape:'spear',size:.1,arc:.6});vring(cellP(i,j),0xffd27a,.7,.45,{delay:.22});parts(cellP(i,j,.1),{n:10,c:0xffd27a,spd:1.2,dur:.4,size:.07,delay:.22});break;
   case'move':break;
  }
}
function vfxEnemy(e,tgt,melee){
  const ep=cellP(e.i,e.j,e.boss?1.2:.7),tp=uPos(tgt,.8);
  if(melee){slash(tp,e.boss?0xff6040:0xff8a7a,.32,{size:e.boss?1.5:1,tilt:.8});if(e.boss){vring(uPos(tgt,0),0xff8040,1.6,.5,{w:.25});parts(uPos(tgt,.1),{n:24,c:0x8a7a6a,spd:2,up:.5,dur:.6,size:.12});}return;}
  if(e.type==='sweeper'){for(let q=0;q<3;q++)proj(ep,tp.clone().add(V3((Math.random()-.5)*.3,0,(Math.random()-.5)*.3)),0x9ad840,.32,{arc:1.1,size:.09,delay:q*.04,trail:false});return;}
  proj(ep,tp,0xe8e8e8,.3,{size:.2,arc:.2});smoke(ep,0xd8d8d8,{n:14,dur:.9,size:.5});glow(ep,0xffd8a0,4,.3);
}
/* hooks */
{const o=cast;cast=function(r){if(canCast(r)){const pts=B.anchors.slice(-r.n),cells=cellsOfShape(pts);try{vfxRecipe(r,pts,cells);}catch(err){}}o(r);};}
{const o=doAction;doAction=function(mode,i,j){const u=B.units[B.sel],e=enemyAt(i,j);try{vfxAction(mode,u,i,j,e);}catch(err){}o(mode,i,j);};}
{const o=ignite;ignite=function(src){if(B&&B.gas.size){const cells=[...B.gas].map(k=>k.split(',').map(Number)),ctr=centroid(cells);
    cells.forEach(([i,j],n)=>{const p=cellP(i,j,.4);sphereFx(p,0xffa040,.6,{r0:.2,r1:1.3,delay:n*.04});parts(p,{n:24,c:0xffb060,spd:2.8,up:1.2,dur:.9,size:.14,delay:n*.04});smoke(p,0x6a5a50,{n:10,dur:1.6,size:.6,delay:.3+n*.04,rise:1});});
    vring(ctr,0xffd080,3.2,.7,{w:.12});flashScreen();}o(src);};}
{const o=forbid;forbid=function(){const r=B.units.ryan;if(r.alive&&!B.forbidUsed){const tgt=B.boss&&B.boss.alive?B.boss:alive().sort((a,b)=>b.hp-a.hp)[0];
    if(tgt){parts(uPos(r,.8),{n:50,c:0xe9e3d4,converge:true,dur:.9,size:.1});const p=cellP(tgt.i,tgt.j,.9);pillar(cellP(tgt.i,tgt.j),0xffffff,6,.5,1.2,.85);sphereFx(p,0xe9e3d4,.5,{r0:.2,r1:2.2,delay:.9});
      vring(cellP(tgt.i,tgt.j),0xe9e3d4,3.5,.9,{delay:.9});glow(p,0xffffff,12,1,12,.85);}}o();};}
{const o=magnet;magnet=function(){const u=B.units.claire;for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(md(u.i,u.j,i,j)<=4&&['scrap','si'].includes(B.tiles[i][j]))bolt(cellP(i,j,.3),uPos(u,.8),0x8ad8ff,.4,{jit:.15});
  parts(uPos(u,.8),{n:30,c:0x8ad8ff,converge:true,dur:.6,size:.08});o();};}
{const o=vent;vent=function(){const c=B.units.claire;smoke(uPos(c,.6),0xffffff,{n:36,dur:1.6,size:.7,rise:1.4});['ryan','claire'].forEach(k=>{const u=B.units[k];if(u.alive)parts(uPos(u,.2),{n:16,c:0x7fe0b0,spd:.3,up:1,grav:-.4,dur:1,size:.09,spread:.4});});o();};}
{const o=useItem;useItem=function(id,u){const r=o(id,u);if(r&&u&&u.spr){const p=uPos(u,.2);
  if(id==='bandage'){parts(p,{n:24,c:0x7fe0b0,spd:.3,up:1.3,grav:-.4,dur:1.1,size:.09,spread:.35});vring(uPos(u,0),0x7fe0b0,.8,.6);}
  if(id==='coffee'){vring(uPos(u,0),0xffc860,.9,.5);parts(p,{n:16,c:0xffd27a,spd:.6,up:1.6,grav:0,dur:.7,size:.08});}
  if(id==='capsule'){['Fe','Si','H2O'].forEach((_,q)=>proj(uPos(u,1.6),uPos(u,.6).add(V3(q-1,0,0)),[0xff9a6a,0xd8d0c0,0x8ad8ff][q],.4,{arc:.6,size:.1,delay:q*.08}));}}return r;};}
{const o=enemyDie;enemyDie=function(e){const p=cellP(e.i,e.j,.6);if(e.boss){sphereFx(p,0xff8a40,.8,{r0:.3,r1:3});vring(cellP(e.i,e.j),0xffc860,5,1.2,{w:.1});flashScreen();}
  else{vring(cellP(e.i,e.j),e.d.nonlethal?0xbfeae0:0xff8a40,1.4,.5);smoke(p,0x8a8a8a,{n:10,dur:1,size:.45});}o(e);};}
