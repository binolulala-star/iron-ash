/* ======================= POST-PROCESSING PASS: banded tilt-shift, split-tone grade, flicker, motes ======================= */
save.postQ=save.postQ||'high';
const POST={blurMul:1.3,band:.12};
/* tilt-shift with an in-focus band in the middle (the "diorama" look) */
function tiltShader(dir){return{uniforms:{tDiffuse:{value:null},h:{value:1/512},v:{value:1/512},r:{value:.5},band:{value:.1}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform sampler2D tDiffuse;uniform float h,v,r,band;varying vec2 vUv;
   void main(){float k=max(0.,abs(r-vUv.y)-band)*1.6;vec2 o=${dir==='h'?'vec2(h*k,0.)':'vec2(0.,v*k)'};vec4 s=vec4(0.);
    s+=texture2D(tDiffuse,vUv-4.*o)*.051;s+=texture2D(tDiffuse,vUv-3.*o)*.0918;s+=texture2D(tDiffuse,vUv-2.*o)*.12245;s+=texture2D(tDiffuse,vUv-o)*.1531;
    s+=texture2D(tDiffuse,vUv)*.1633;s+=texture2D(tDiffuse,vUv+o)*.1531;s+=texture2D(tDiffuse,vUv+2.*o)*.12245;s+=texture2D(tDiffuse,vUv+3.*o)*.0918;s+=texture2D(tDiffuse,vUv+4.*o)*.051;gl_FragColor=s;}`};}
const GRADE_SHADER={uniforms:{tDiffuse:{value:null},vig:{value:1.1},sat:{value:1.15},con:{value:1.04},warm:{value:.4},grain:{value:.025},ca:{value:.6},time:{value:0},
   lift:{value:new THREE.Vector3(.35,.2,.6)},gain:{value:new THREE.Vector3(1.05,1,.92)}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:`uniform sampler2D tDiffuse;uniform float vig,sat,con,warm,grain,ca,time;uniform vec3 lift,gain;varying vec2 vUv;
   float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
   void main(){vec2 dc=vUv-.5;float a=ca*.012*dot(dc,dc)*4.;
    vec3 c=vec3(texture2D(tDiffuse,vUv+dc*a).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-dc*a).b);
    float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,sat);
    float sh=1.-smoothstep(.02,.32,l),hi=smoothstep(.45,1.,l);
    vec3 tint=1.+(lift-vec3((lift.x+lift.y+lift.z)/3.))*.4;c*=mix(vec3(1.),tint,sh);c*=mix(vec3(1.),gain,hi);
    c=clamp(c*1.08,0.,1.);c=mix(c,c*c*(3.-2.*c),clamp((con-1.)*2.,0.,1.));
    c*=vec3(1.+warm*.07,1.+warm*.01,1.-warm*.09);c=pow(max(c,0.),vec3(.9));
    c*=smoothstep(.95,.3,length(dc)*vig);
    c+=(hash(vUv*vec2(1920.,1080.)+fract(time)*61.)-.5)*grain;gl_FragColor=vec4(c,1.);}`};
{const C=E.composer,ix=k=>C.passes.indexOf(E[k]);
  const hts=new THREE.ShaderPass(tiltShader('h')),vts=new THREE.ShaderPass(tiltShader('v')),gr=new THREE.ShaderPass(GRADE_SHADER);
  C.passes[ix('hts')]=hts;C.passes[ix('vts')]=vts;C.passes[ix('grade')]=gr;Object.assign(E,{hts,vts,grade:gr});resize();}
{const o=resize;resize=function(){o();if(!E.hts)return;const w=innerWidth,h=innerHeight;E.hts.uniforms.h.value=E.blur/w;E.vts.uniforms.v.value=E.blur/h;
  E.hts.uniforms.band.value=E.vts.uniforms.band.value=E.mode==='battle'?.36:POST.band;};}
setTilt=function(r,blur){E.tilt=r;E.blurRaw=blur;E.blur=blur*(E.mode==='battle'?.6:POST.blurMul);resize();};

/* grade presets: lift = shadow tint, gain = highlight multiplier */
const GRADES={
 base:{sat:1.12,con:1.04,warm:.4,lift:[.35,.2,.6],gain:[1.05,1,.92],bloom:[.6,.55,.76]},
 town:{sat:1.14,con:1.1,warm:1.1,lift:[.42,.2,.72],gain:[1.12,1.,.84],bloom:[.9,.65,.68]},
 sewer:{sat:1.04,con:1.05,warm:-.2,lift:[.1,.42,.36],gain:[1.,1.07,.92],bloom:[.75,.6,.7]},
 yard:{sat:1.,con:1.06,warm:.2,lift:[.25,.3,.62],gain:[1.1,1.,.9],bloom:[.65,.55,.74]},
 hangar:{sat:1.04,con:1.08,warm:.3,lift:[.45,.2,.5],gain:[1.12,.98,.9],bloom:[.8,.6,.7]},
 train:{sat:1.14,con:1.08,warm:1.2,lift:[.45,.22,.6],gain:[1.14,1.,.84],bloom:[.9,.65,.68]},
 frost:{sat:1.04,con:1.05,warm:-.4,lift:[.3,.32,.82],gain:[1.1,1.02,.94],bloom:[.6,.55,.78]},
 glacier:{sat:1.,con:1.04,warm:-.7,lift:[.2,.4,.82],gain:[1.,1.04,1.08],bloom:[.55,.5,.8]},
 fortress:{sat:.92,con:1.07,warm:-.3,lift:[.3,.3,.62],gain:[1.06,1.,.96],bloom:[.6,.55,.76]},
 vault:{sat:1.12,con:1.06,warm:-.8,lift:[.42,.3,.9],gain:[.98,1.06,1.14],bloom:[.95,.65,.66]},
 dawn:{sat:1.12,con:1.03,warm:1.3,lift:[.4,.25,.6],gain:[1.16,1.,.82],bloom:[.8,.65,.7]},
 reactor:{sat:1.1,con:1.08,warm:-.2,lift:[.4,.25,.8],gain:[1.04,1.04,1.1],bloom:[1.,.7,.62]},
 infirmary:{sat:.94,con:1.02,warm:.1,lift:[.3,.3,.5],gain:[1.04,1.02,.98],bloom:[.5,.6,.8]},
};
const GRADE_OF={town:'town',sewer:'sewer',yard:'yard',hangar:'hangar',train:'train',snow:'frost',frostport:'frost',glacier:'glacier',fortress:'fortress',vault:'vault',
 reactor:'reactor',infirmary:'infirmary',dawn:'dawn',snowtrain:'frost',aftermath:'hangar',title:'base'};
let GT=GRADES.base;function grade(k){GT=GRADES[GRADE_OF[k]||k]||GRADES.base;}

/* warm lights flicker; motes drift */
let FLICK=[];
function collectLights(){FLICK=[];E.world.traverse(o=>{if(o.isPointLight&&o.color.r>o.color.b*1.25&&o.intensity>0)FLICK.push([o,o.intensity,Math.random()*9]);});}
const MOTES={town:[0xffb070,110,.07,.12],sewer:[0x9aff8a,90,.06,.07],yard:[0xff9a60,60,.06,.12],train:[0xffd8a0,60,.05,.05],hangar:[0xff7a50,70,.07,.14],vault:[0x9ae8ff,140,.07,.1],fortress:[0xdfe8ff,50,.05,.05]};
function motes(k,box){const d=MOTES[k];if(!d||save.postQ!=='high')return;dustField(d[1],box,d[0],d[2],d[3]);}
{const r=E.composer.render.bind(E.composer);E.composer.render=function(...a){const t=performance.now()/1000,U=E.grade.uniforms,q=save.postQ==='high';
  const L=(u,v)=>{U[u].value+=(v-U[u].value)*.06;};L('sat',GT.sat);L('con',GT.con);L('warm',GT.warm);U.lift.value.lerp(new THREE.Vector3(...GT.lift),.06);U.gain.value.lerp(new THREE.Vector3(...GT.gain),.06);
  U.time.value=t;U.grain.value=q?.022:0;U.ca.value=q&&E.mode!=='battle'?.6:0;
  if(!TH||TH.mode==='off'||!document.body.classList.contains('in-theater')){const b=E.bloom;b.strength+=(GT.bloom[0]-b.strength)*.06;b.radius=GT.bloom[1];b.threshold=GT.bloom[2];}
  FLICK.forEach(([l,base,ph])=>{l.intensity=base*(1.04+.08*Math.sin(t*7.3+ph)+.05*Math.sin(t*17.1+ph*2.3)+.04*Math.sin(t*2.1+ph));});
  return r(...a);};}

/* hooks: pick the grade, collect flickering lights, add motes */
{const o=buildFree;buildFree=function(M){o(M);const id=Object.keys(MAPS).find(k=>MAPS[k]===M);grade(id);collectLights();
  const sz=M.size||[40,34];motes(id,[0,.2,0,sz[0],3.4,sz[1]]);};}
{const o=buildTown;buildTown=function(M){const r=o(M);grade('town');collectLights();motes('town',[0,.3,0,64,4,40]);return r;};}
{const o=startBattle;startBattle=function(cfg){o(cfg);setTilt(E.tilt,E.blurRaw||1.6);grade(cfg.theme);collectLights();motes(cfg.theme,[-7,.2,-7,7,3.6,7]);};}
{const o=buildSet;buildSet=function(n){o(n);grade(n);collectLights();E.blur=(E.blurRaw||2)*.7;POST.band=.22;resize();POST.band=save.postQ==='high'?.1:.16;};}

/* quality toggle (battle side panel + explore HUD) */
function applyQ(){POST.blurMul=save.postQ==='high'?1.3:1;POST.band=save.postQ==='high'?.12:.16;setTilt(E.tilt,E.blurRaw||E.blur);
  document.querySelectorAll('.postq').forEach(b=>b.textContent=`畫質：${save.postQ==='high'?'高':'標準'}`);}
function qBtn(){const b=document.createElement('button');b.className='postq';b.type='button';b.title='高：移軸景深、色差、底片顆粒、環境粒子。標準：較省電。';
  b.onclick=()=>{save.postQ=save.postQ==='high'?'std':'high';persist();applyQ();toast(save.postQ==='high'?'畫質：高（完整光影後製）':'畫質：標準（較省效能）');};return b;}
{const cc=$('camctl');if(cc){const b=qBtn();b.id='postq-b';cc.appendChild(b);}
 const bag=$('ex-quest');if(bag){const b=qBtn();b.id='postq-x';b.classList.add('frame');bag.parentNode.insertBefore(b,bag);}
 const st=document.createElement('style');st.textContent=`.camctl #postq-b{width:auto;height:auto;font-size:10px;padding:4px 3px;font-family:var(--pixel);white-space:nowrap}
 #postq-x{padding:8px 10px;color:var(--mist);font-size:12px;font-family:var(--display)}`;document.body.appendChild(st);}
applyQ();
