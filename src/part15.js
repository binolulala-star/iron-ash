/* ======================= STANDING PORTRAITS IN BATTLE CUT-INS ======================= */
const CUT_LINES={
 claire:{melee:['赫菲斯托斯，蒸氣壓力全開！','給我——站好別動！','公差千分之一毫米，打歪了算我的！'],hurt:['痛死了啦！','這點程度……還差得遠！','可惡，機械鎧過熱了……！']},
 ryan:{cast:['等價交換——構築！','分子結構，鎖定。','把這一帶的物質……全部重寫！'],big:['灰瞳，全開！！','三點定陣——給我崩解！','計算完畢。這一擊不會偏。'],
   melee:['共振吧！','別小看鍊金術師的近身戰！'],forbid:['超載逆構……就算要燒掉這隻眼睛！'],hurt:['嘖……！','還撐得住……！','數據誤差，在容許範圍內……']},
};
Object.assign(CUT_LINES,{
 guard:{melee:['奉葛蘭上將令——排除！','盾陣，推進！','中央的走狗，滾回去！'],hurt:['呃啊……！','盾、盾牌撐不住了……！','這、這不是說好的……！']},
 miner:{melee:['不痛……一點都不痛……','要挖……要挖……','很光榮……輪到你們了……'],hurt:['……呵呵……','不痛……不痛……']},
 vera:{melee:['乖孩子，把他們碾碎吧。','五百名鐵匠的手藝，好好品嚐。','別客氣，這是最完美的工業升級。'],
   angry:['你們……竟敢弄傷我的作品！','區區鍊金術師，不許碰它！'],hurt:['……嘖。','有意思，再多掙扎一點吧。']},
});
const FOE_CUT={guard:{who:'guard',k:'stern',hk:'scared',p:.4},miner:{who:'miner',k:'smile',hk:'smile',p:.45},mech:{who:'vera',k:'smile',hk:'cold',p:.6}};
function foeCut(ref){const f=ref&&!ref.key&&FOE_CUT[ref.type];return f&&hasStand(f.who)?f:null;}
async function foeAttackCut(att){const f=foeCut(att.ref);if(!f)return;
  const first=!att.ref._cutSeen;if(!first&&Math.random()>f.p)return;att.ref._cutSeen=1;
  const low=att.ref.hp<(att.ref.max||att.ref.hp)*.5;let k=f.k,line=pick(CUT_LINES[f.who].melee);
  if(f.who==='vera'&&low){k='angry';line=pick(CUT_LINES.vera.angry);}
  const el=$('th-cut');el.classList.add('foe');await thPilotCut(f.who,k,line,f.who==='vera'?'#c0c8d8':'#d0503f');el.classList.remove('foe');}
function reactFor(defs){const u=defs.find(d=>d.ref&&d.ref.key&&hasCut(d.ref.key));
  if(u)return()=>thReact(u.ref.key,u.ref.key==='claire'?'hurt':'gaze',pick(CUT_LINES[u.ref.key].hurt));
  const e=defs.find(d=>foeCut(d.ref));if(!e||Math.random()>.45)return null;const f=foeCut(e.ref);
  return()=>thReact(f.who,f.hk,pick(CUT_LINES[f.who].hurt));}
const pick=a=>a[(Math.random()*a.length)|0];
function hasCut(who){return !!(CUT_LINES[who]&&hasStand(who));}
function hasStand(who){return !!(STAND[who]&&STAND[who].length);}
function standSrc(who,k){const list=STAND[who];return `portraits/${who}_${list.includes(k)?k:list[0]}.webp`;}
/* big SRW-style cut-in band inside the theater */
async function thPilotCut(who,k,line,col){
  if(!hasStand(who)||TH.skip)return;const el=$('th-cut');
  $('th-cut-img').src=standSrc(who,k);$('th-cut-line').textContent=line||'';el.style.setProperty('--cc',col||'#c8a456');
  el.hidden=false;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');sfx&&sfx('cast');
  await tw(950);el.hidden=true;}
/* small reaction portrait when a party member gets hit */
function thReact(who,k,line){if(!hasStand(who))return;const el=$('th-react');$('th-react-img').src=standSrc(who,k);$('th-react-line').textContent=line||'';
  el.hidden=false;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');clearTimeout(thReact.t);thReact.t=setTimeout(()=>{el.hidden=true;},1500);}
{const o=choreoMelee;choreoMelee=async function(att,defs,style,title,impact,heavy){
  if(att.ref&&att.ref.key&&hasCut(att.ref.key))await thPilotCut(att.ref.key,att.ref.key==='claire'?pick(['angry','grin']):'roar',pick(CUT_LINES[att.ref.key].melee),att.ref.key==='claire'?'#e05a3a':'#e8892b');
  else await foeAttackCut(att);
  const r=reactFor(defs);const wrapped=r?()=>{impact();setTimeout(()=>{if(TH.active)r();},200);}:impact;
  return o(att,defs,style,title,wrapped,heavy);};}
{const o=choreoRanged;choreoRanged=async function(att,defs,style,title,impact){
  if(!(att.ref&&att.ref.key))await foeAttackCut(att);
  const r=reactFor(defs);const wrapped=r?()=>{impact();setTimeout(()=>{if(TH.active)r();},200);}:impact;
  return o(att,defs,style,title,wrapped);};}
{const o=choreoCast;choreoCast=async function(att,defs,r,impact,opts={}){
  const who=att.ref&&att.ref.key;
  if(who&&hasCut(who)){const forb=r.id==='R15',big=forb||r.n>=3;
    await thPilotCut(who,big?'ash':'cold',pick(CUT_LINES[who][forb?'forbid':big?'big':'cast']),forb?'#e9e3d4':big?'#7fe8ff':'#c8a456');}
  return o(att,defs,r,impact,opts);};}
/* the on-board cut-in (used when battle animations are set to 'off' or for big casts) */
{const o=portraitInto;portraitInto=function(cv,who,expr){
  if(!hasStand(who))return o(cv,who,expr);const k=(STAND_MAP[who]||{})[expr]||'ash';const img=new Image();
  img.onload=()=>{cv.width=360;cv.height=300;cv.style.imageRendering='auto';const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);
    const sw=img.width*.62,sh=sw*300/360;g.drawImage(img,(img.width-sw)/2+img.width*.08,0,sw,sh,0,0,cv.width,cv.height);};
  img.src=standSrc(who,k);};}
