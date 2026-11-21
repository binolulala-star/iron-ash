/* ======================= AUDIO PASS: file-based music with fallback, richer SFX ======================= */
/* MUSIC_FILES / SFX_FILES are injected by build.py from the music/ and sfx/ folders */
const MUS_ALIAS={battle2:'battle',side:'battle',boss2:'boss',snowtown:'town2',dawn:'town'};
const MUS_VOL=.62;
const MBUF={},SBUF={},MLOAD={};
function fileFor(name){if(!name)return null;if(MUSIC_FILES[name])return name;const a=MUS_ALIAS[name];return a&&MUSIC_FILES[a]?a:null;}
function loadBuf(store,key,url){if(store[key]||MLOAD[url])return;MLOAD[url]=1;
  fetch(url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>AU.ctx.decodeAudioData(b)).then(buf=>{store[key]=buf;
    if(store===MBUF&&AU.want&&fileFor(AU.want)===key)playFile(AU.want,true);}).catch(()=>{});}
function preloadAudio(){if(!AU.ctx)return;Object.entries(MUSIC_FILES).forEach(([k,f])=>loadBuf(MBUF,k,'music/'+f));Object.entries(SFX_FILES).forEach(([k,f])=>loadBuf(SBUF,k,'sfx/'+f));}
{const o=auInit;auInit=function(){const had=!!AU.ctx;o();if(!had&&AU.ctx)preloadAudio();};}
let MTRACK=null;
function stopFile(fade=.8){if(!MTRACK)return;const {src,g}=MTRACK,t=AU.ctx.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+fade);
  try{src.stop(t+fade+.05);}catch(e){}MTRACK=null;}
function playFile(name,swap){const key=fileFor(name),buf=MBUF[key];if(!buf)return false;
  if(MTRACK&&MTRACK.key===key)return true;
  if(swap){clearInterval(AU.timer);}
  stopFile(1.2);const c=AU.ctx,src=c.createBufferSource(),g=c.createGain();src.buffer=buf;src.loop=true;
  const intro=+(MUSIC_FILES[key+'_loop']||0);if(intro){src.loopStart=intro;src.loopEnd=buf.duration;}
  g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(MUS_VOL,c.currentTime+1.2);src.connect(g);g.connect(AU.mus);src.start();
  AU.mus.gain.cancelScheduledValues(c.currentTime);AU.mus.gain.setValueAtTime(1,c.currentTime);MTRACK={src,g,key};return true;}
{const o=song;song=function(name){AU.want=name;
  if(!AU.ctx)return o(name);
  if(!name){stopFile(.4);return o(name);}
  if(fileFor(name)){if(MBUF[fileFor(name)]){clearInterval(AU.timer);AU.cur=name;playFile(name);return;}loadBuf(MBUF,fileFor(name),'music/'+MUSIC_FILES[fileFor(name)]);}
  stopFile(.8);if(AU.mus.gain.value>.5){AU.mus.gain.cancelScheduledValues(AU.ctx.currentTime);AU.mus.gain.setValueAtTime(.3,AU.ctx.currentTime);}return o(name);};}
/* victory jingle cuts file music too */
{const o=jingle;jingle=function(){stopFile(.3);return o();};}

/* ---------- SFX: file override, then a richer synth set ---------- */
function playSbuf(k,vol=1,rate=1){const b=SBUF[k];if(!b)return false;const c=AU.ctx,s=c.createBufferSource(),g=c.createGain();s.buffer=b;s.playbackRate.value=rate*(.96+Math.random()*.08);g.gain.value=vol;s.connect(g);g.connect(AU.fx);s.start();return true;}
let HIT_KIND='flesh';
const SYN={
 hit_flesh:(t,D)=>{noise(t,.08,.3,D,'lowpass',1400,300);tone(t,170,.14,'sine',.35,D,60);},
 hit_metal:(t,D)=>{noise(t,.05,.22,D,'highpass',3000);[1180,1710,2430].forEach((f,q)=>tone(t,f,.32-q*.06,'triangle',.07,D,f*.97));tone(t,140,.1,'square',.12,D,60);},
 punch:(t,D)=>{noise(t,.05,.35,D,'lowpass',2600,400);tone(t,110,.18,'sine',.5,D,40);noise(t+.02,.12,.12,D,'bandpass',900);},
 zap:(t,D)=>{for(let q=0;q<6;q++)tone(t+q*.035,700+Math.random()*900,.05,'sawtooth',.06,D,200);noise(t,.3,.1,D,'highpass',5000);},
 fire:(t,D)=>{noise(t,.7,.28,D,'lowpass',400,2400);noise(t+.1,.9,.12,D,'bandpass',800,300);},
 freeze:(t,D)=>{[2100,2600,3200,3900].forEach((f,q)=>tone(t+q*.05,f,.35,'sine',.05,D,f*1.08));noise(t,.4,.08,D,'highpass',7000);},
 crystal:(t,D)=>{[88,93,96,100].forEach((n,q)=>tone(t+q*.06,mtof(n),.6,'sine',.06,D));},
 sizzle:(t,D)=>{noise(t,.8,.14,D,'highpass',5000,2500);noise(t,.2,.08,D,'bandpass',1200);},
 rumble:(t,D)=>{noise(t,.8,.4,D,'lowpass',260,60);tone(t,55,.8,'sine',.4,D,35);},
 steam:(t,D)=>{noise(t,.9,.2,D,'bandpass',3000,1200);},
 chain:(t,D)=>{for(let q=0;q<5;q++){const f=900+q*130;tone(t+q*.05,f,.12,'square',.04,D,f*.8);noise(t+q*.05,.04,.08,D,'highpass',4000);}},
 roar:(t,D)=>{noise(t,1.2,.4,D,'lowpass',900,4000);tone(t,80,1,'sawtooth',.12,D,40);},
 implode:(t,D)=>{noise(t,.6,.2,D,'lowpass',3000,150);tone(t+.62,60,.8,'sine',.5,D,25);noise(t+.62,.6,.35,D,'lowpass',2000,80);},
 heal:(t,D)=>{[67,71,74,79,83].forEach((n,q)=>tone(t+q*.06,mtof(n),.5,'sine',.07,D));},
 shatter:(t,D)=>{noise(t,.5,.3,D,'highpass',3500);for(let q=0;q<8;q++)tone(t+Math.random()*.25,1800+Math.random()*2500,.15,'triangle',.05,D);tone(t,90,.4,'sine',.35,D,40);},
 death:(t,D)=>{tone(t,500,.6,'triangle',.08,D,120);noise(t,.6,.08,D,'bandpass',2000,400);},
 coin:(t,D)=>{tone(t,mtof(88),.08,'square',.06,D);tone(t+.07,mtof(95),.25,'square',.06,D);},
 quest:(t,D)=>{[72,79,84].forEach((n,q)=>tone(t+q*.09,mtof(n),.3,'triangle',.08,D));},
 qdone:(t,D)=>{[72,76,79,84,88].forEach((n,q)=>tone(t+q*.08,mtof(n),.35,'triangle',.08,D));tone(t+.4,mtof(84),.8,'sine',.05,D);},
 menu_open:(t,D)=>{tone(t,mtof(79),.08,'triangle',.07,D);tone(t+.05,mtof(86),.12,'triangle',.06,D);},
 menu_close:(t,D)=>{tone(t,mtof(86),.08,'triangle',.06,D);tone(t+.05,mtof(79),.12,'triangle',.06,D);},
 tip:(t,D)=>{tone(t,mtof(84),.25,'sine',.07,D);tone(t+.08,mtof(91),.35,'sine',.05,D);},
 door:(t,D)=>{noise(t,.35,.18,D,'lowpass',700,200);tone(t+.05,120,.25,'square',.05,D,80);},
 step_stone:(t,D)=>{noise(t,.04,.06,D,'bandpass',900+Math.random()*300);},
 step_snow:(t,D)=>{noise(t,.11,.07,D,'bandpass',2600+Math.random()*600,1400);},
 step_wood:(t,D)=>{noise(t,.05,.07,D,'bandpass',450+Math.random()*150);tone(t,140,.05,'sine',.06,D,90);},
 slide:(t,D)=>{noise(t,.6,.1,D,'highpass',4000,8000);},
};
{const o=sfx;sfx=function(k){if(!AU.ctx||!AU.on)return;
  if(k==='hit')k='hit_'+HIT_KIND;
  if(playSbuf(k,k.startsWith('step')?.5:1))return;
  const f=SYN[k];if(f){f(AU.ctx.currentTime+.01,AU.fx);return;}
  return o(k);};}
/* hit material */
const METAL=['mech','hound','sweeper','turret','guard','frostguard','colossus','crystal'];
{const o=damageEnemy;damageEnemy=function(e,amt,opt={}){if(e&&e.alive&&!opt.quiet){const melee=B&&!B.casting&&B.sel==='claire';
    HIT_KIND=METAL.includes(e.type)||(e.tg>0)?'metal':'flesh';if(melee&&!opt.true)sfx('punch');}
  const was=e&&e.alive;const r=o(e,amt,opt);if(was&&e&&!e.alive)setTimeout(()=>sfx('death'),120);return r;};}
/* per-recipe reaction sounds, timed with the visual reaction */
const RSND={R01:'crystal',R02:'fire',R03:'steam',R04:'sizzle',R05:'rumble',R06:'zap',R07:'fire',R08:'chain',R09:'steam',R10:'roar',R11:'rumble',R12:'sizzle',R13:'heal',R14:'implode',R16:'rumble',R17:'freeze'};
{const o=cast;cast=function(r){if(B&&canCast(r)&&RSND[r.id])setTimeout(()=>sfx(RSND[r.id]),380);return o(r);};}
{const o=banner;banner=function(a,b){if(a==='BREAK')setTimeout(()=>sfx('shatter'),30);return o(a,b);};}
/* world & UI */
{const o=giveMoney;giveMoney=function(n){sfx('coin');return o(n);};}
{const o=qStart;qStart=function(id){if(!Q(id))sfx('quest');return o(id);};}
{const o=qDone;qDone=function(id){sfx('qdone');return o(id);};}
{const o=openMenu;openMenu=function(tab){if(!menuOpen())sfx('menu_open');else sfx('ui');return o(tab);};}
{const o=closeMenu;closeMenu=function(){sfx('menu_close');return o();};}
{const o=pumpTips;pumpTips=function(){const was=tipOpen;o();if(!was&&tipOpen)sfx('tip');};}
{const o=enterMap;enterMap=function(...a){sfx('door');return o(...a);};}
{const o=slideFrom;slideFrom=function(...a){sfx('slide');return o(...a);};}
if(typeof addLoot==='function'){const o=addLoot;addLoot=function(id){const r=o(id);sfx('chest');return r;};}
/* footsteps */
const SNOWY=['frostport','glacier','fortress'];
let stepT=0;
function stepTick(dt){if(E.mode!=='explore'||!X.lead||!X.lead.walking||!$('story').hidden){stepT=0;return;}
  stepT-=dt;if(stepT<=0){stepT=.34;sfx(X.id==='train'?'step_wood':SNOWY.includes(X.id)?'step_snow':'step_stone');}}
E.fxs.push(stepTick);{const o=clearWorld;clearWorld=function(...a){const r=o(...a);if(!E.fxs.includes(stepTick))E.fxs.push(stepTick);return r;};}
