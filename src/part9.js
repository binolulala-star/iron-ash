/* ======================= BATTLE THEATER (SRW-style cut scenes) ======================= */
const TH={active:false,skip:false,mode:'all'};
try{TH.mode=localStorage.getItem('iron-ash-anim')||'all';}catch(e){}
const EL_COL={Si:0xd8cfb8,Fe:0xff9a6a,H2O:0x8ad8ff,C:0xc8a088,Acid:0x9ad840,Al:0xe0e8ee,Mg:0xffffff,NaCl:0xf0f0f0,P:0xffd060,Org:0x7fe0b0};
const THEME_SKY={hangar:['#1a0e08','#4a2410','#120a08'],train:['#0c1220','#26324a','#0a0c14'],town:['#0a1222','#1e2e4a','#0a0e18'],sewer:['#050a06','#123018','#040806'],yard:['#140a08','#5a2a12','#1a0e0a']};
function thInit(){
  if(TH.scene)return;TH.scene=new THREE.Scene();TH.cam=new THREE.PerspectiveCamera(32,1,.1,100);TH.world=new THREE.Group();TH.scene.add(TH.world);
  TH.scene.add(new THREE.HemisphereLight(0xb8c4e0,0x2a2018,.75));
  const k=new THREE.DirectionalLight(0xffe0c0,.9);k.position.set(-4,8,6);TH.scene.add(k);TH.key=k;
  const r=new THREE.DirectionalLight(0x7aa0ff,.5);r.position.set(5,3,-4);TH.scene.add(r);
}
function skyTex(theme){const c=cvs(256,128),g=c.getContext('2d'),[a,b,d]=THEME_SKY[theme]||THEME_SKY.hangar;
  const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,d);gr.addColorStop(.62,b);gr.addColorStop(1,a);g.fillStyle=gr;g.fillRect(0,0,256,128);
  g.fillStyle='rgba(0,0,0,.55)';
  if(theme==='hangar'||theme==='yard'){for(let x=0;x<256;x+=28){g.fillRect(x,30+(x%3)*6,10,98);}g.fillStyle='rgba(255,150,60,.35)';g.fillRect(110,60,36,68);}
  if(theme==='town'){for(let x=0;x<256;x+=22){const h=30+((x*7)%23);g.fillRect(x,128-h-20,20,h+20);g.fillStyle='rgba(255,200,120,.6)';g.fillRect(x+6,128-h,3,3);g.fillStyle='rgba(0,0,0,.55)';}}
  if(theme==='sewer'){for(let x=-20;x<256;x+=60){g.beginPath();g.arc(x+30,128,34,Math.PI,0);g.lineTo(x+64,0);g.lineTo(x-4,0);g.closePath();g.fill();}}
  if(theme==='train'){g.fillRect(0,0,256,40);g.fillRect(0,96,256,32);g.fillStyle='rgba(160,190,230,.35)';for(let x=10;x<256;x+=50)g.fillRect(x,48,34,30);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;}
let SPEEDTEX=null;
function speedTex(){if(SPEEDTEX)return SPEEDTEX;const c=cvs(256,64),g=c.getContext('2d');for(let k=0;k<40;k++){g.fillStyle=`rgba(255,255,255,${.2+Math.random()*.5})`;g.fillRect(Math.random()*256,Math.random()*64,30+Math.random()*90,1);}
  SPEEDTEX=new THREE.CanvasTexture(c);SPEEDTEX.wrapS=THREE.RepeatWrapping;return SPEEDTEX;}
function thBuild(theme){
  thInit();const W0=TH.world;while(W0.children.length)W0.remove(W0.children[0]);
  TH.scene.background=new THREE.Color((THEME_SKY[theme]||THEME_SKY.hangar)[2]);TH.scene.fog=new THREE.Fog(TH.scene.background.getHex(),14,40);
  const sky=new THREE.Mesh(new THREE.PlaneGeometry(40,14),new THREE.MeshBasicMaterial({map:skyTex(theme),fog:false}));sky.position.set(0,5,-8);W0.add(sky);
  const fl=T(FLOOR[theme]||'plate').clone();fl.needsUpdate=true;fl.repeat.set(20,6);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,12),new THREE.MeshLambertMaterial({map:fl}));floor.rotation.x=-Math.PI/2;floor.position.z=-1;W0.add(floor);
  for(let k=-4;k<=4;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(.8+Math.random(),.6+Math.random()*1.4,.8),texMat(theme==='town'?'brick':'rust',1,1));b.position.set(k*4+Math.random(),.5,-4.5-Math.random()*1.5);W0.add(b);}
  const sl=new THREE.Mesh(new THREE.PlaneGeometry(30,6),new THREE.MeshBasicMaterial({map:speedTex(),transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  sl.position.set(0,2,-2.5);W0.add(sl);TH.speed=sl;
}
function thSprite(src,h){
  const f0=src.frames[0],asp=f0.image.width/f0.image.height;
  const mat=new THREE.MeshLambertMaterial({map:f0,transparent:true,alphaTest:.5,side:THREE.DoubleSide,emissive:0x1c1c26});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(h*asp,h),mat);plane.position.y=h/2;
  const holder=new THREE.Group(),inner=new THREE.Group();inner.add(plane);holder.add(inner);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(h*asp*.32,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.45,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.01;sh.scale.y=.4;holder.add(sh);
  TH.world.add(holder);
  const s={kind:src.kind,frames:src.frames,holder,mesh:inner,plane,mat,depth:{map:null},pose:null,t:0,h,face:d=>{plane.scale.x=d<0?-1:1;}};return s;}
function thTick(dt){
  if(!TH.active)return false;
  (TH.sprites||[]).forEach(s=>{s.t+=dt;const m=s.pose||s.frames[Math.floor(s.t*2)%2];if(s.mat.map!==m){s.mat.map=m;s.mat.needsUpdate=true;}});
  if(TH.speed){TH.speed.material.map.offset.x+=dt*(TH.speedDir||1)*3;TH.speed.material.opacity+=((TH.speedOn?.8:0)-TH.speed.material.opacity)*Math.min(1,dt*10);}
  if(TH.look)TH.cam.lookAt(TH.look);
}
/* timing (skip-aware) */
const tw=ms=>TH.skip?Promise.resolve():new Promise(r=>{const id=setTimeout(r,ms);TH.wakers.push(()=>{clearTimeout(id);r();});});
function tween(dur,fn){return new Promise(res=>{if(TH.skip){fn(1);res();return;}let t=0;E.fxs.push(dt=>{t+=dt;const k=Math.min(1,t/dur),e=k*k*(3-2*k);fn(TH.skip?1:e);if(k>=1||TH.skip){res();return false;}});});}
function camTo(pos,look,dur){const p0=TH.cam.position.clone(),l0=(TH.look||look).clone();if(!dur){TH.cam.position.copy(pos);TH.look=look.clone();return Promise.resolve();}
  return tween(dur,e=>{TH.cam.position.lerpVectors(p0,pos,e);TH.look=l0.clone().lerp(look,e);});}
function moveTo(s,to,dur){const p0=s.holder.position.clone();return tween(dur,e=>s.holder.position.lerpVectors(p0,to,e));}
/* UI */
function thUI(att,def,title,sub,col){
  $('th-title').textContent=title;$('th-sub').textContent=sub||'';$('th-ui').style.setProperty('--tc',col||'#c8a456');
  const set=(side,o)=>{$('th-'+side+'n').textContent=o?o.name:'';$('th-'+side+'b').hidden=!o;if(o){$('th-'+side+'h').style.width=(o.ref.hp/o.ref.max*100)+'%';$('th-'+side+'p').textContent=`${o.ref.hp} / ${o.ref.max}`;}};
  set('a',att);set('d',def);const n=$('th-name');n.classList.remove('go');void n.offsetWidth;n.classList.add('go');
}
function thBar(side,o){if(!o)return;$('th-'+side+'h').style.width=(Math.max(0,o.ref.hp)/o.ref.max*100)+'%';$('th-'+side+'p').textContent=`${Math.max(0,o.ref.hp)} / ${o.ref.max}`;}
function thNum(s,txt,color,big){const p=s.holder.position.clone();p.y+=s.h*.9;p.project(TH.cam);const d=document.createElement('div');d.className='th-num'+(big?' big':'');d.textContent=txt;d.style.color=color||'#fff';
  d.style.left=((p.x+1)/2*innerWidth)+'px';d.style.top=((1-p.y)/2*innerHeight)+'px';$('th-dmg').appendChild(d);setTimeout(()=>d.remove(),1500);}
/* enter / exit */
function thEnter(theme){
  thInit();thBuild(theme);TH.active=true;TH.skip=false;TH.wakers=[];TH.sprites=[];TH.speedOn=false;
  TH.saved={cam:E.camera,world:E.world,tilt:E.tilt,blur:E.blur};E.camera=TH.cam;E.world=TH.world;
  const rp=E.composer.passes[0];rp.scene=TH.scene;rp.camera=TH.cam;E.controls.enabled=false;
  TH.cam.aspect=innerWidth/innerHeight;TH.cam.fov=innerWidth<600?50:32;TH.cam.clearViewOffset();TH.cam.updateProjectionMatrix();
  document.body.classList.add('in-theater');$('th-ui').hidden=false;$('th-dmg').innerHTML='';setTilt(.42,1.4);TH.cam.clearViewOffset();TH.cam.updateProjectionMatrix();
  const fade=$('th-fade');fade.classList.remove('go');void fade.offsetWidth;fade.classList.add('go');
  E.fxs.push(thTick);
}
function thExit(){
  if(!TH.active)return;TH.active=false;TH.wakers.forEach(w=>w());E.camera=TH.saved.cam;E.world=TH.saved.world;
  const rp=E.composer.passes[0];rp.scene=E.scene;rp.camera=E.camera;E.controls.enabled=true;
  document.body.classList.remove('in-theater');$('th-ui').hidden=true;setTilt(TH.saved.tilt,TH.saved.blur);resize();
}
/* run board logic in the board's world so board-side visuals land in the right place */
function withBoard(fn){const c=E.camera,w=E.world;E.camera=TH.saved.cam;E.world=TH.saved.world;TH.muteFloat=true;try{fn();}finally{TH.muteFloat=false;E.camera=c;E.world=w;}}
{const o=floatAt;floatAt=function(v,t,c){if(TH.muteFloat||TH.active)return;o(v,t,c);};}
/* actors */
const TH_H={ryan:2.1,claire:2.1,miner:2.1,guard:2.1,hound:1.4,sweeper:1.5,mech:3.4};
function actorOf(x){const isU=!!x.key;return{ref:x,name:x.name,src:x.spr,kind:x.spr.kind||(isU?x.key:x.type)};}
function spawn(a,pos,face){const s=thSprite({kind:a.kind,frames:a.src.frames},TH_H[a.kind]||2);s.holder.position.copy(pos);s.face(face);TH.sprites.push(s);a.s=s;return s;}
function reactAll(defs,from){defs.forEach(d=>{const s=d.s;if(!s)return;const dmg=d.before-d.ref.hp;
  s.mat.emissive.setHex(0xffffff);setTimeout(()=>s.mat.emissive.setHex(0x1c1c26),90);s.pose=getPose(s,'hurt');
  const dir=Math.sign(s.holder.position.x-from.x)||1,p0=s.holder.position.clone();
  tween(.35,e=>{s.holder.position.x=p0.x+dir*.5*Math.sin(e*Math.PI*.5);});
  if(dmg>0)thNum(s,'-'+dmg,'#ffd27a',dmg>=150);else if(d.statusTxt)thNum(s,d.statusTxt,'#9fd4ff');
  if(!d.ref.alive){setTimeout(()=>{thNum(s,d.ref.d&&d.ref.d.nonlethal?'制伏':(d.ref.key?'倒下':'擊破'),'#ff8a7a',true);
    tween(.6,e=>{s.holder.rotation.z=-dir*e*1.2;s.plane.material.opacity=1-e;s.mat.transparent=true;});},250);}
  else setTimeout(()=>{s.pose=null;},700);});}
function snapshot(defs){defs.forEach(d=>{d.before=d.ref.hp;d.root0=d.ref.root||0;d.stun0=d.ref.stun||0;});}
function statusAfter(defs){defs.forEach(d=>{if(d.before===d.ref.hp){if((d.ref.root||0)>d.root0)d.statusTxt='定身';else if((d.ref.stun||0)>d.stun0)d.statusTxt='暈眩';}});}
function layoutDefs(defs,x0){const n=defs.length,xs=n===1?[x0]:n===2?[x0-.5,x0+.8]:[x0-.8,x0+.4,x0+1.6],zs=[0,-.7,.5];defs.slice(0,3).forEach((d,k)=>spawn(d,V3(xs[k],0,zs[k]),-1));}
/* ---- choreography ---- */
const A0=V3(-2.6,0,0),D0=V3(2.5,0,0);
const MELEE_FX={
  punch:(p)=>{star(p,0xffffff,.35,{size:1.6});vring(p.clone().setY(.05),0xffd8a0,2,.45);parts(p,{n:30,c:0xffe0b0,spd:4,dur:.6,size:.12});},
  pile:(p)=>{vring(p.clone().setY(.05),0xc8a456,3.2,.6,{w:.25});vring(p,0xffffff,2,.4,{vertical:true});star(p,0xffe0a0,.4,{size:2});parts(p.clone().setY(.1),{n:40,c:0xa89070,spd:3.4,up:.6,dur:.8,size:.16});},
  blade:(p)=>{slash(p,0xbff4ff,.4,{size:2.2,tilt:-.6});slash(p,0xffffff,.35,{size:1.8,tilt:2.2,delay:.1});parts(p,{n:30,c:0xd8f4ff,spd:4,dur:.5,size:.1});},
  tap:(p)=>{for(let q=0;q<4;q++)vring(p.clone().add(V3(-1.2+q*.35,0,0)),0x8ae8ff,1,.5,{r0:.2,vertical:true,w:.12,delay:q*.06});star(p,0xbff4ff,.3,{size:1.2,delay:.2});},
  freeze:(p)=>{spikesAt([p.clone().setY(0)],{h:1.8,count:7,dur:1.6,col:0xd8f4ff,emis:0x5aa8d8});vring(p.clone().setY(.05),0xd8f4ff,2.6,.8,{w:.3});smoke(p,0xe8f8ff,{n:30,dur:1.2,size:.7,rise:.3});},
  enemy:(p,heavy)=>{slash(p,heavy?0xff6040:0xff8a7a,.4,{size:heavy?2.6:1.8,tilt:.8});star(p,0xffd0c0,.3,{size:heavy?2:1.3});if(heavy){vring(p.clone().setY(.05),0xff8040,3,.6,{w:.25});parts(p.clone().setY(.1),{n:40,c:0x8a7a6a,spd:3.5,up:.6,dur:.8,size:.16});}},
};
function spikesAt(points,{h=1.2,count=4,dur=1.2,col=0xdfe8f0,emis=0x6a7a8a}={}){
  points.forEach((base,n)=>{const g=new THREE.Group();
    for(let q=0;q<count;q++){const s=new THREE.Mesh(new THREE.ConeGeometry(.12+Math.random()*.1,h*(.6+Math.random()*.6),5),new THREE.MeshStandardMaterial({color:col,emissive:emis,emissiveIntensity:.4,roughness:.25,metalness:.3}));
      s.position.set((Math.random()-.5)*1.1,0,(Math.random()-.5)*.8);s.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6);g.add(s);}
    g.position.copy(base);life(g,dur,k=>{const up=k<.15?k/.15:1,dn=k>.75?(1-k)/.25:1;g.children.forEach(s=>{s.scale.y=Math.max(.01,up*dn);s.position.y=s.geometry.parameters.height/2*up*dn;});},n*.05);});}
async function choreoMelee(att,defs,style,title,impact,heavy){
  const a=spawn(att,A0.clone(),1);layoutDefs(defs,D0.x);const d=defs[0].s;
  thUI(att,defs[0],title,'',heavy?'#e05a3a':'#c8a456');
  const zf=Math.max(1,(TH_H[att.kind]||2.5)/2.5);await camTo(V3(A0.x+2.2*zf,1.5*zf,5.4*zf),V3(A0.x+.5,1.1*zf,0),0);
  a.pose=getPose(a,'wind');await camTo(V3(A0.x+1.6*zf,1.2*zf,4.6*zf),V3(A0.x+.6,1.15*zf,0),.5);
  TH.speedOn=true;TH.speedDir=-1;a.pose=getPose(a,'dash');
  await Promise.all([moveTo(a,V3(d.holder.position.x-1.15,0,d.holder.position.z+.05),.26),camTo(V3(.6,1.5*zf,6.6*zf),V3(1.3,1.1*zf,0),.26)]);
  TH.speedOn=false;a.pose=getPose(a,'strike');const hp=V3(d.holder.position.x-.2,(TH_H[defs[0].kind]||2)*.55,d.holder.position.z+.2);
  snapshot(defs);withBoard(impact);statusAfter(defs);
  (MELEE_FX[style]||MELEE_FX.punch)(hp,heavy);E.hs=heavy?.16:.1;E.shake=heavy?1.2:.6;reactAll(defs,a.holder.position);thBar('d',defs[0]);thBar('a',att);
  await camTo(V3(d.holder.position.x-.6,1.6,5.6),V3(d.holder.position.x-.2,1.1,0),.9);
  await tw(250);a.pose=null;await moveTo(a,A0.clone(),.22);await tw(150);
}
async function choreoRanged(att,defs,style,title,impact){
  const a=spawn(att,A0.clone(),1);layoutDefs(defs,D0.x+.6);const d=defs[0].s;thUI(att,defs[0],title,'','#c8a456');
  const zf=Math.max(1,(TH_H[att.kind]||2.5)/2.5);await camTo(V3(A0.x+2*zf,1.4*zf,5*zf),V3(A0.x+.5,1.1*zf,0),0);a.pose=getPose(a,'wind');await tw(250);
  a.pose=getPose(a,style==='mech'?'strike':(a.kind==='claire'?'aim':'strike'));
  const from=a.holder.position.clone().add(V3(.7,(TH_H[att.kind]||2)*.55,0)),to=d.holder.position.clone().add(V3(-.2,(TH_H[defs[0].kind]||2)*.5,0));
  star(from,0xffd080,.25,{size:1});glow(from,0xffa040,6,.3);
  const col={gun:0xffd080,stake:0xffd27a,acid:0x9ad840,mech:0xe8e8e8,ignite:0xffd080}[style]||0xffffff;
  if(style==='acid')for(let q=0;q<4;q++)proj(from,to.clone().add(V3(0,(Math.random()-.5)*.4,(Math.random()-.5)*.3)),col,.45,{arc:1.4,size:.08,delay:q*.05,trail:false});
  else proj(from,to,col,.4,{size:style==='mech'?.32:.1,shape:style==='stake'?'spear':'sphere',arc:style==='mech'?.3:0});
  if(style==='mech')smoke(from,0xd8d8d8,{n:24,dur:1.2,size:.8});
  TH.speedOn=true;TH.speedDir=-1;await camTo(V3(1.2,1.5,6.6),V3(2.2,1.1,0),.42);TH.speedOn=false;
  snapshot(defs);withBoard(impact);statusAfter(defs);
  if(style==='ignite'){defs.forEach(x=>{const p=x.s.holder.position.clone().setY(1);sphereFx(p,0xffa040,.7,{r0:.3,r1:2.4});parts(p,{n:50,c:0xffb060,spd:4,up:1.4,dur:1,size:.18});smoke(p,0x5a4a40,{n:20,dur:1.8,size:1,delay:.3,rise:1.2});});
    vring(to.clone().setY(.05),0xffd080,5,.8,{w:.1});glow(to,0xffa040,10,.8,10);E.shake=1.4;}
  else{star(to,0xffffff,.3,{size:1.3});parts(to,{n:26,c:col,spd:3,dur:.6,size:.11});E.shake=style==='mech'?1:.5;}
  E.hs=.08;reactAll(defs,a.holder.position);thBar('d',defs[0]);
  await camTo(V3(d.holder.position.x-.5,1.6,5.8),V3(d.holder.position.x-.2,1.1,0),.9);await tw(250);a.pose=null;await tw(150);
}
function recipeFx(id,dp,defs,elcols){
  const tgt=defs.length?defs.map(d=>d.s.holder.position.clone()):[dp.clone()];
  const top=p=>p.clone().setY(1.1);
  switch(id){
   case'R01':tgt.forEach((p,n)=>{for(let q=0;q<3;q++)proj(p.clone().add(V3(-1.5+q*.3,5,1)),top(p).add(V3((q-1)*.15,0,0)),0xe8f4ff,.35,{shape:'spear',size:.22,delay:q*.08+n*.05});
     spikesAt([p.clone().setY(0)],{h:1.4,count:5,dur:1.2,col:0xdfe8f0});});break;
   case'R04':tgt.forEach(p=>{for(let q=0;q<7;q++)proj(p.clone().add(V3(-3,2,0)),top(p).add(V3((Math.random()-.5)*.5,(Math.random()-.5)*.6,0)),0x9ad840,.5,{arc:1.4,size:.13,delay:q*.05,trail:false});
     smoke(top(p),0x6a9a30,{n:20,dur:1.4,delay:.45,size:.7});});break;
   case'R06':tgt.forEach((p,n)=>{for(let q=0;q<4;q++)bolt(p.clone().add(V3((Math.random()-.5)*1.2,6,0)),top(p),0xc8f0ff,.7,{segs:14,jit:.6,delay:q*.09});
     star(top(p),0x8ad8ff,.5,{size:1.8,delay:.1});parts(top(p),{n:40,c:0x8ad8ff,spd:3,dur:.7,size:.1});});glow(dp,0x8ad8ff,10,.7,10);break;
   case'R07':for(let x=-1.5;x<=2.5;x+=.5)parts(V3(dp.x+x,.05,(Math.random()-.5)*.8),{n:26,c:x%1?0xff7a30:0xffd060,spd:.6,up:3.4,grav:-.6,dur:1.4,size:.22,spread:.3,delay:Math.abs(x)*.05});glow(dp,0xff7a30,10,1.4,10);break;
   case'R08':tgt.forEach(p=>{chains(p.clone().setY(0),0xc8a456,1.6);spikesAt([p.clone().setY(0)],{h:1.3,count:5,dur:1.4,col:0x3a3a44,emis:0x1a1a1a});});E.shake=.8;break;
   case'R09':for(let q=0;q<5;q++){const p=V3(dp.x-1.5+q*.8,.05,0);parts(p,{n:24,c:0xbfe6ff,spd:.2,up:2,grav:-.6,dur:1.6,size:.12,spread:.4});bolt(p,p.clone().setY(1.6),0x8ad8ff,.8,{jit:.3,delay:q*.05});}break;
   case'R10':tgt.forEach(p=>{pillar(p.clone(),0xffb060,5,.35,1);parts(p.clone().setY(.2),{n:70,c:0xfff2c0,spd:4,up:2,grav:6,dur:1.4,size:.1});parts(p.clone().setY(.2),{n:24,c:0xff8a30,spd:2,up:3,dur:1.5,size:.18});});glow(dp,0xffa060,6,1.2,8);break;
   case'R11':vring(dp.clone().setY(.04),0x9a7a50,.3,1.6,{r0:3.4,w:.18});vring(dp.clone().setY(.05),0x8a6a40,.3,1.6,{r0:2.4,w:.12,delay:.2});tgt.forEach(p=>parts(p.clone().setY(.1),{n:30,c:0xb89a6a,spd:.8,up:.5,grav:1,dur:1.3,size:.16}));break;
   case'R12':for(let q=0;q<5;q++)smoke(V3(dp.x-1.5+q*.8,.4,0),0x9ad840,{n:20,dur:2,size:.9,delay:q*.06,rise:.6});glow(dp,0x9ad840,8,1.6,10);break;
   case'R14':{const p=dp.clone().setY(1.2);parts(p,{n:70,c:0xb8b0ff,converge:true,dur:.8,size:.14});sphereFx(p,0x4a3ac0,.8,{r0:3.4,r1:.1});vring(p,0xa89aff,.05,.8,{r0:4,w:.1,vertical:true});
     setTimeout(()=>{star(p,0xe0d8ff,.6,{size:3});glow(p,0xa89aff,12,.8,12);E.shake=1.6;},700);break;}
   case'R05':for(let q=0;q<3;q++){const b=new THREE.Mesh(new THREE.BoxGeometry(.9,1.6,.9),texMat('brick',1,2));b.position.set(dp.x-1+q,-.8,0);life(b,1.6,k=>{b.position.y=-.8+Math.min(1,k*4)*1.6;});parts(V3(dp.x-1+q,.1,0),{n:20,c:0xb8a890,spd:2,up:.8,dur:.9,size:.16});}E.shake=.8;break;
   case'R15':tgt.forEach(p=>{pillar(p.clone(),0xffffff,9,.9,1.4);sphereFx(p.clone().setY(1),0xe9e3d4,.7,{r0:.3,r1:3.6});vring(p.clone().setY(.05),0xe9e3d4,6,1.2);glow(p,0xffffff,14,1.2,14);});E.shake=1.8;break;
  }
}
async function choreoCast(att,defs,r,impact,opts={}){
  const a=spawn(att,V3(-2.2,0,0),1);if(defs.length)layoutDefs(defs,D0.x+.3);
  const col=opts.col||'#c8a456';thUI(att,defs[0]||null,opts.title||`#${r.id}　${r.name}`,opts.sub||`${SHAPE[r.n]}・${r.el.map(e=>ELF[e]).join(' + ')}`,col);
  const ap=a.holder.position;await camTo(V3(ap.x+3.4,.6,4.6),V3(ap.x,1.2,0),0);a.pose=getPose(a,'wind');
  // sigil + orbiting element orbs
  vring(ap.clone().setY(.04),opts.ring||0xffd27a,1.8,1.3,{w:.08});vring(ap.clone().setY(.05),opts.ring||0xffd27a,1.3,1.3,{w:.05,delay:.15});
  const els=(r.el||[]).map(e=>EL_COL[e]||0xffffff);
  els.forEach((c,q)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),addM(c,.85));life(m,1.1,k=>{const ang=k*Math.PI*3+q*Math.PI*2/els.length,rr=1.1-k*.8;m.position.set(ap.x+Math.cos(ang)*rr,.6+k*1.2,Math.sin(ang)*rr);if(Math.random()<.5)parts(m.position.clone(),{n:2,c,spd:.1,up:.1,grav:0,dur:.3,size:.08});});});
  parts(ap.clone().setY(.2),{n:40,c:0xffe0a0,spd:.4,up:1.6,grav:-.4,dur:1.2,size:.08,spread:1});
  await camTo(V3(ap.x-1.8,1.3,4.8),V3(ap.x+.3,1.3,0),1.0);
  a.pose=getPose(a,'cast');star(ap.clone().setY(2.3),0xd8f8ff,.4,{size:1.4});glow(ap.clone().setY(2),0xbff4ff,5,.5,6);E.hs=.08;await tw(260);
  if(opts.support){snapshot([]);withBoard(impact);opts.support(ap);await camTo(V3(ap.x+.8,1.7,6),V3(ap.x+.6,1.1,0),1.0);await tw(200);a.pose=null;return;}
  TH.speedOn=true;TH.speedDir=1;const dp=V3(D0.x+.4,0,0);await camTo(V3(dp.x-1.2,2.6,8.4),V3(dp.x,1,0),.35);TH.speedOn=false;
  snapshot(defs);withBoard(impact);statusAfter(defs);recipeFx(opts.fx||r.id,dp,defs,els);
  setTimeout(()=>{if(TH.active){reactAll(defs,ap);if(defs[0])thBar('d',defs[0]);}},opts.fx==='R14'?720:opts.fx==='R15'?1000:260);
  await camTo(V3(dp.x-.6,1.9,7),V3(dp.x,1.1,0),1.2);await tw(250);a.pose=null;
}
/* ---- deciding what gets a cut scene ---- */
function thWants(kind){if(TH.mode==='off')return false;if(TH.mode==='big')return kind==='big';return true;}
async function runTheater(fn){
  if(!B)return;const was=B.busy;B.busy=true;thEnter(B.cfg.theme);
  try{await fn();}catch(err){console.warn(err);}
  await tw(100);thExit();B.busy=was;if(B)renderDeck&&renderDeck();updateHud();
}
const MELEE_MODES={punch:'punch',pile:'pile',blade:'blade',tap:'tap',freeze:'freeze'};
const MODE_NAME={punch:'鐵拳',pile:'震盪重錘',blade:'解剖斬擊',tap:'音叉敲擊',freeze:'瞬間急凍',gun:'打火石點火'};
{const o=doAction;doAction=function(mode,i,j){
  if(!B||B.busy||!thWants('small'))return o(mode,i,j);
  const u=B.units[B.sel],e=enemyAt(i,j);
  if(MELEE_MODES[mode]&&e){B.mode=null;clearTargets();const att=actorOf(u),defs=[actorOf(e)];
    runTheater(()=>choreoMelee(att,defs,MELEE_MODES[mode],(u.buff2&&mode!=='freeze'?'強化・':'')+MODE_NAME[mode],()=>PRE8.doAction(mode,i,j)));return;}
  if(mode==='gun'){const gas=B.gas.has(i+','+j);let defs;
    if(gas){const cells=[...B.gas].map(k=>k.split(',').map(Number));defs=enemiesNear(cells,1).map(actorOf);}else defs=e?[actorOf(e)]:[];
    if(defs.length){B.mode=null;clearTargets();runTheater(()=>choreoRanged(actorOf(u),defs,gas?'ignite':'gun',gas?'氫氧氣爆・點火':MODE_NAME.gun,()=>PRE8.doAction(mode,i,j)));return;}}
  return o(mode,i,j);
};}
function recipeTargets(r,pts,cells){
  switch(r.id){case'R01':case'R04':{const t=nearestTo(pts,3);return t?[t]:[];}
    case'R06':return enemiesNear(cells,1);case'R02':case'R03':case'R13':case'R05':case'R09':return [];default:return enemiesIn(cells);}}
{const o=cast;cast=function(r){
  if(!B||B.busy||!canCast(r))return;const big=r.n>=3;if(!thWants(big?'big':'small'))return o(r);
  const pts=B.anchors.slice(-r.n),cells=cellsOfShape(pts),defs=recipeTargets(r,pts,cells).map(actorOf),R=actorOf(B.units.ryan);
  const sup={R02:ap=>{const C=TH.sprites[0];vring(ap.clone().setY(.05),0xc8a456,2.4,1,{w:.1});pillar(ap.clone(),0xc8a456,4,.6,1);parts(ap.clone().setY(.3),{n:50,c:0xffe0a0,spd:.5,up:2,grav:-.5,dur:1.4,size:.12,spread:.6});},
    R03:ap=>{for(let q=0;q<5;q++)smoke(ap.clone().add(V3(-1+q*.6,.4,0)),0xd8dde4,{n:18,dur:2,size:1,delay:q*.05});parts(ap.clone().setY(.4),{n:30,c:0x7fe0b0,spd:.4,up:1.6,grav:-.4,dur:1.4,size:.12,spread:1.4});},
    R13:ap=>{dome(ap.clone(),0x8ad8ff,1.8,3.2);parts(ap.clone().setY(.6),{n:40,c:0xc8f0ff,spd:.4,up:1.4,grav:-.4,dur:1.6,size:.1,spread:1.6});},
    R09:ap=>{recipeFx('R09',V3(ap.x+3,0,0),[],[]);}};
  runTheater(()=>choreoCast(R,defs,r,()=>PRE8.cast(r),{support:sup[r.id]||(r.id==='R05'?(ap=>recipeFx('R05',V3(ap.x+2.2,0,0),[],[])):null)}));
};}
{const o=forbid;forbid=function(){
  const r=B&&B.units.ryan;if(!B||B.busy||!r.alive||B.forbidUsed||!thWants('big'))return o();
  const tgt=B.boss&&B.boss.alive?B.boss:alive().sort((a,b)=>b.hp-a.hp)[0];if(!tgt)return o();
  document.body.classList.add('grey');
  runTheater(async()=>{await choreoCast(actorOf(r),[actorOf(tgt)],{id:'R15',name:'超載逆構',n:1,el:[]},()=>PRE8.forbid(),{title:'#R15　超載逆構',sub:'禁忌・灰瞳迴路透支',col:'#e9e3d4',ring:0xe9e3d4,fx:'R15'});
    await tw(700);document.body.classList.remove('grey');});
};}
/* enemy attacks */
{const o=animAttack;animAttack=function(att,target,opt,impact){
  const e=B&&B.enemies.find(x=>x.spr===att);
  if(!e||TH.active||!thWants(e.boss?'big':'small'))return o(att,target,opt,impact);
  const u=['ryan','claire'].map(k=>B.units[k]).find(x=>x.spr.holder.position===target);if(!u)return o(att,target,opt,impact);
  const ae=actorOf(e),du=[actorOf(u)],title=(VERB[e.type]||['攻擊'])[opt.ranged?1:0].replace(/中$|，命中$/,'');
  return runTheater(()=>opt.ranged?choreoRanged(ae,du,e.type==='sweeper'?'acid':'mech',`${e.name}・${title}`,impact):choreoMelee(ae,du,'enemy',`${e.name}・${title}`,impact,!!e.boss));
};}
/* skip + mode toggle */
$('th-ui').addEventListener('pointerdown',()=>{if(TH.active){TH.skip=true;TH.wakers.forEach(w=>w());}});
document.addEventListener('keydown',e=>{if(TH.active&&(e.key===' '||e.key==='Enter'||e.key==='Escape')){e.preventDefault();TH.skip=true;TH.wakers.forEach(w=>w());}},true);
const TH_LABEL={all:'演出：全部',big:'演出：大招',off:'演出：關閉'};
function thModeBtn(){const b=$('th-mode');if(b){b.textContent=TH_LABEL[TH.mode];b.title='戰鬥動畫：全部 → 只有大招 → 關閉';}}
$('th-mode').onclick=()=>{TH.mode={all:'big',big:'off',off:'all'}[TH.mode];try{localStorage.setItem('iron-ash-anim',TH.mode);}catch(e){}thModeBtn();toast({all:'所有攻擊都會播放戰鬥動畫。',big:'只有三點以上陣法、禁忌與 Boss 攻擊播放戰鬥動畫。',off:'關閉戰鬥動畫，只在戰場上播放簡易動作。'}[TH.mode]);};
thModeBtn();

{const o=resize;resize=function(){o();if(TH.active&&E.camera===TH.cam){E.camera.fov=innerWidth<600?50:32;E.camera.clearViewOffset();E.camera.updateProjectionMatrix();}};}
