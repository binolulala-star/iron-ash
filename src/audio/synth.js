/* ======================= AUDIO (procedural chiptune) ======================= */
const AU={ctx:null,on:true,cur:null,pending:null,timer:null,step:0,next:0,lead:null};
try{AU.on=localStorage.getItem('iron-ash-snd')!=='0';}catch(e){}
const mtof=m=>440*Math.pow(2,(m-69)/12);
const SONGS={
 title:{bpm:72,prog:[[57,0],[53,1],[48,1],[55,1]],pad:1,arp:8,bass:[0,8],lead:[1,0,0,1,0,0,1,0],lo:69,seed:3},
 camp:{bpm:76,prog:[[53,1],[57,0],[58,1],[48,1]],pad:1,arp:8,bass:[0,8],lead:[1,0,1,0,0,0,1,0],lo:69,seed:11},
 town:{bpm:80,prog:[[50,0],[46,1],[53,1],[48,1]],pad:1,arp:8,bass:[0,6,8],lead:[1,0,0,1,1,0,0,0],lo:66,seed:5,rain:1},
 sewer:{bpm:64,prog:[[52,0],[48,1],[52,0],[47,1]],pad:1,arp:4,bass:[0],lead:[1,0,0,0,0,1,0,0],lo:64,seed:8,drip:1},
 yard:{bpm:100,prog:[[57,0],[57,0],[53,1],[52,1]],pad:0,arp:8,bass:[0,4,8,12],lead:[1,0,1,1,0,1,0,0],lo:69,seed:13,hat:1},
 battle:{bpm:144,prog:[[57,0],[53,1],[55,1],[52,1]],pad:0,arp:16,bass:[0,2,4,6,8,10,12,14],oct:1,lead:[1,1,0,1,1,0,1,1],lo:69,seed:21,hat:1,kick:1,leadT:'square'},
 boss:{bpm:156,prog:[[50,0],[46,1],[48,1],[45,1]],pad:0,arp:16,bass:[0,2,3,4,6,8,10,11,12,14],oct:1,lead:[1,0,1,1,1,0,1,1],lo:62,seed:34,hat:1,kick:1,leadT:'sawtooth'},
 dawn:{bpm:88,prog:[[48,1],[55,1],[57,0],[53,1]],pad:1,arp:8,bass:[0,8],lead:[1,0,1,1,0,0,1,0],lo:72,seed:2},
};
function auInit(){
  if(AU.ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  try{AU.ctx=new C();}catch(e){return;}const c=AU.ctx;
  AU.master=c.createGain();AU.master.gain.value=AU.on?.55:0;AU.master.connect(c.destination);
  AU.mus=c.createGain();AU.mus.gain.value=.3;AU.mus.connect(AU.master);AU.fx=c.createGain();AU.fx.gain.value=.55;AU.fx.connect(AU.master);
  const len=c.sampleRate;AU.nb=c.createBuffer(1,len,c.sampleRate);const d=AU.nb.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  if(AU.pending){const p=AU.pending;AU.pending=null;song(p);}
}
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();},{capture:true}));
function tone(t,f,dur,type,vol,dest,slide){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.05);}
function noise(t,dur,vol,dest,type='highpass',freq=6000,sweep){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.nb;fl.type=type;fl.frequency.setValueAtTime(freq,t);
  if(sweep)fl.frequency.exponentialRampToValueAtTime(sweep,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0005,t+dur);s.connect(fl);fl.connect(g);g.connect(dest);s.start(t,Math.random()*.5);s.stop(t+dur+.05);}
function chordOf([r,maj]){return [r,r+(maj?4:3),r+7];}
function makeLead(S){let x=S.seed;const rnd=()=>{x=(x*9301+49297)%233280;return x/233280;};const bars=[];
  const motif=S.prog.map(ch=>{const ct=chordOf(ch).map(n=>{while(n<S.lo)n+=12;while(n>S.lo+12)n-=12;return n;}).sort((a,b)=>a-b);
    return S.lead.map((on,i)=>on?(ct[(Math.floor(rnd()*3)+(i>4?1:0))%3]+(rnd()<.18?(rnd()<.5?2:-2):0)):null);});
  S.prog.forEach((_,k)=>bars.push(motif[k]));return bars;}
function song(name){
  if(!AU.ctx){AU.pending=name;return;}if(AU.cur===name)return;AU.cur=name;clearInterval(AU.timer);if(!name)return;
  const S=SONGS[name];AU.lead=makeLead(S);AU.step=0;AU.next=AU.ctx.currentTime+.1;
  // fade in
  AU.mus.gain.cancelScheduledValues(AU.ctx.currentTime);AU.mus.gain.setValueAtTime(0,AU.ctx.currentTime);AU.mus.gain.linearRampToValueAtTime(.3,AU.ctx.currentTime+.8);
  AU.timer=setInterval(()=>sched(S),30);
}
function sched(S){
  const c=AU.ctx,dt=60/S.bpm/4,D=AU.mus;
  while(AU.next<c.currentTime+.15){
    const t=AU.next,s=AU.step,bar=Math.floor(s/16)%S.prog.length,i=s%16,ch=chordOf(S.prog[bar]);
    if(S.pad&&i===0)ch.forEach(n=>tone(t,mtof(n),dt*15,'triangle',.05,D));
    if(S.bass.includes(i)){const r=ch[0]-12-(S.oct&&i%4?0:0);tone(t,mtof(S.oct&&(i%4===2)?r+12:r),dt*(S.oct?1.6:5),S.oct?'square':'triangle',S.oct?.07:.14,D);}
    if(S.arp===16||(S.arp===8&&i%2===0)||(S.arp===4&&i%4===0)){const seq=[0,1,2,1],n=ch[seq[(i/(S.arp===16?1:S.arp===8?2:4))%4|0]]+12;tone(t,mtof(n),dt*1.6,'triangle',S.arp===16?.035:.05,D);}
    if(i%2===0){const n=AU.lead[bar][i/2];if(n)tone(t,mtof(n),dt*(S.bpm>120?1.8:3.6),S.leadT||'square',S.leadT==='sawtooth'?.04:.045,D);}
    if(S.hat&&i%2===0)noise(t,.04,i%4===2?.06:.03,D,'highpass',8000);
    if(S.kick&&i%4===0)tone(t,130,.18,'sine',.35,D,40);
    if(S.kick&&(i===4||i===12))noise(t,.12,.12,D,'bandpass',1800);
    if(S.rain&&i%4===0)noise(t,dt*4.2,.025,D,'highpass',3000);
    if(S.drip&&i===6&&bar%2===0)tone(t,mtof(88),.2,'sine',.05,D,mtof(76));
    AU.step++;AU.next+=dt;
  }
}
function jingle(){if(!AU.ctx)return;song(null);const t=AU.ctx.currentTime+.05;[72,76,79,84].forEach((n,k)=>tone(t+k*.11,mtof(n),.18,'square',.08,AU.mus));
  [72,76,79].forEach(n=>tone(t+.46,mtof(n),1.2,'triangle',.08,AU.mus));tone(t+.46,mtof(84),1.2,'square',.05,AU.mus);
  AU.mus.gain.cancelScheduledValues(t);AU.mus.gain.setValueAtTime(.3,t);}
function sfx(k){
  if(!AU.ctx||!AU.on)return;const t=AU.ctx.currentTime+.01,D=AU.fx;
  switch(k){
    case'hit':noise(t,.09,.25,D,'highpass',1800);tone(t,240,.12,'square',.12,D,70);break;
    case'hurt':noise(t,.18,.3,D,'lowpass',900,200);tone(t,150,.2,'sine',.3,D,50);break;
    case'cast':[0,4,7,12,16].forEach((n,q)=>tone(t+q*.045,mtof(76+n),.22,'triangle',.12,D));noise(t+.2,.4,.06,D,'highpass',6000);break;
    case'boom':noise(t,1.1,.6,D,'lowpass',3000,90);tone(t,90,.9,'sine',.5,D,28);break;
    case'break':noise(t,.35,.25,D,'highpass',4000);tone(t,1400,.35,'triangle',.15,D,300);break;
    case'ui':tone(t,880,.04,'square',.04,D);break;
    case'chest':tone(t,660,.09,'square',.08,D);tone(t+.09,990,.16,'square',.08,D);break;
    case'lvup':[60,64,67,72,76,79,84].forEach((n,q)=>tone(t+q*.06,mtof(n),.18,'square',.07,D));break;
    case'anchor':tone(t,mtof(88),.25,'sine',.12,D);tone(t+.04,mtof(95),.25,'sine',.06,D);break;
    case'enc':tone(t,900,.45,'sawtooth',.08,D,110);noise(t,.4,.12,D,'bandpass',1200,300);break;
    case'step':noise(t,.03,.03,D,'bandpass',600);break;
    case'heal':[67,71,74,79].forEach((n,q)=>tone(t+q*.05,mtof(n),.25,'sine',.1,D));break;
  }
}
function setSound(on){AU.on=on;try{localStorage.setItem('iron-ash-snd',on?'1':'0');}catch(e){}if(AU.master)AU.master.gain.value=on?.55:0;
  document.querySelectorAll('.snd').forEach(b=>{b.textContent=on?'♪ 音效開':'♪ 靜音';b.setAttribute('aria-pressed',String(on));});}
document.querySelectorAll('.snd').forEach(b=>b.onclick=e=>{e.stopPropagation();auInit();setSound(!AU.on);});
setSound(AU.on);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b&&!b.disabled&&!b.classList.contains('snd'))sfx('ui');},true);

/* ======================= RUN SAVE ======================= */
const RUN_KEY='iron-ash-run';
function saveRun(stage){
  if(!P.lv)return;const d={v:1,stage,map:X.id||null,pos:X.pos?[+X.pos.x.toFixed(2),+X.pos.z.toFixed(2)]:null,t:Date.now(),
    P:{ryan:P.ryan,claire:P.claire,stash:P.stash,flags:P.flags,lv:P.lv,gear:P.gear,items:P.items,owned:P.owned}};
  try{localStorage.setItem(RUN_KEY,JSON.stringify(d));}catch(e){}
}
function loadRun(){try{const d=JSON.parse(localStorage.getItem(RUN_KEY)||'null');return d&&d.v===1&&d.P?d:null;}catch(e){return null;}}
function clearRun(){try{localStorage.removeItem(RUN_KEY);}catch(e){}}
function refreshContinue(){const d=loadRun(),b=$('m-cont');if(!b)return;b.hidden=!d;
  if(d){const where=d.stage==='boss'?'第三機庫・決戰前':(MAPS[d.map]?MAPS[d.map].name:'第一章');$('m-cont-s').textContent=`${where} · 萊恩 Lv ${d.P.lv.ryan.lv}`;}}
$('m-cont').onclick=()=>{const d=loadRun();if(!d)return;
  Object.assign(P,JSON.parse(JSON.stringify(d.P)));syncMax();
  if(d.stage==='boss'){openBase(bossFight,'出擊：第三蒸氣機庫');}
  else enterMap(d.map,{pos:d.pos||MAPS[d.map].start});
  toast('已讀取存檔。');};
setInterval(()=>{if(!$('explore').hidden&&E.mode==='explore')saveRun('map');},8000);

/* ======================= HOOKS ======================= */
const MAP_SONG={town:'town',sewer:'sewer',yard:'yard'},SET_SONG={title:'title',reactor:'title',train:'yard',hangar:'yard',aftermath:'title',dawn:'dawn'};
{const o=show;show=function(id){o(id);if(id==='title'){song('title');refreshContinue();}if(id==='base')song('camp');};}
HOOK.after('enterMap',id=>{song(MAP_SONG[MAPS[id].theme]||'town');saveRun('map');
  if(!P.flags.tut_move){P.flags.tut_move=1;setTimeout(()=>toast('WASD／方向鍵或點擊地面移動，靠近 ◆ 按 E 調查。右上角危險度滿了就會遇敵。'),600);}});
{const o=backToMap;backToMap=function(){o();song(MAP_SONG[X.M.theme]);saveRun('map');};}
HOOK.after('buildSet',n=>{if(SET_SONG[n])song(SET_SONG[n]);});
HOOK.after('startBattle',cfg=>{if(cfg.explore&&!P.flags.tut_enc){P.flags.tut_enc=1;guide('第一次遭遇戰','小型戰鬥可以按「撤退」逃跑（70%）。打贏能拿經驗值、元素與道具，偶爾掉落飾品。');}});
{const o=victory;victory=function(){jingle();o();};}
{const o=damageEnemy;damageEnemy=function(e,amt,opt={}){if(e&&e.alive&&!opt.quiet)sfx('hit');o(e,amt,opt);};}
{const o=damageUnit;damageUnit=function(u,amt){if(u&&u.alive)sfx('hurt');o(u,amt);};}
{const o=ignite;ignite=function(src){if(B&&B.gas.size)sfx('boom');o(src);};}
{const o=cast;cast=function(r){if(canCast(r))sfx('cast');o(r);};}
{const o=placeAnchor;placeAnchor=function(i,j){sfx('anchor');o(i,j);};}
{const o=grantExp;grantExp=function(n){const u=o(n);if(u.length)setTimeout(()=>sfx('lvup'),900);return u;};}
{const o=encounter;encounter=function(){sfx('enc');o();};}
{const o=banner;banner=function(a,b){if(a==='BREAK')sfx('break');o(a,b);};}
{const o=useItem;useItem=function(id,u){const r=o(id,u);if(r)sfx('heal');return r;};}
{const o=runEvent;runEvent=function(ev){const chest=ev.kind==='chest'&&!ev.done;o(ev);if(chest){sfx('chest');saveRun('map');}};}
{const o=toBoss;toBoss=function(){P.flags.boss=1;saveRun('boss');o();};}
{const o=chapterEnd;chapterEnd=function(){clearRun();o();};}
$('m-new').onclick=()=>newGame();
$('m-base').onclick=()=>{resetParty();openBase(bossFight,'出擊：第三蒸氣機庫');};
$('m-battle').onclick=()=>{resetParty();bossFight();};
$('ex-act').onclick=()=>{if(X.near)runEvent(X.near);};
refreshContinue();
