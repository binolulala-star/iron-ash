/* ======================= LOADING SCREEN: preload every painted asset with progress =======================
   ASSETS is injected by build.py (env/*.webp, portraits/*.webp). Critical files (characters, portraits,
   story backdrops) gate the title; the rest keep loading behind it. */
const LOAD={done:0,total:ASSETS.length,crit:0,critTotal:0,ready:false,t0:performance.now(),imgs:{}};
{const ov=document.createElement('div');ov.id='loader';
  ov.innerHTML=`<div class="ld-in"><span class="ld-eye">THE LAW OF IRON &amp; ASH</span><h1>鐵與灰的等價律</h1>
    <div class="ld-bar" role="progressbar" aria-label="載入進度" aria-valuemin="0" aria-valuemax="100"><i id="ld-fill"></i></div>
    <div class="ld-row"><span id="ld-txt">準備素材…</span><span id="ld-pct">0%</span></div>
    <p class="ld-tip" id="ld-tip"></p><button class="btn" id="ld-skip" hidden>網路較慢，先開始遊戲</button></div>`;
  document.body.appendChild(ov);
  const st=document.createElement('style');st.textContent=`
#loader{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));
  background:radial-gradient(ellipse at 50% 60%,#1a1e30 0%,#0a0d16 70%);color:var(--parch);transition:opacity .6s ease}
#loader.out{opacity:0;pointer-events:none}
.ld-in{width:min(440px,100%);text-align:center}
.ld-eye{font-family:var(--pixel);font-size:11px;letter-spacing:.2em;color:var(--gild-dim)}
#loader h1{margin:6px 0 26px;font-family:var(--display);font-size:clamp(30px,6vw,44px);font-weight:700;color:var(--parch);text-shadow:0 0 24px rgba(200,164,86,.25)}
.ld-bar{height:6px;border:1px solid var(--gild-dim);background:#0f1628;overflow:hidden}
#ld-fill{display:block;height:100%;width:0;background:linear-gradient(90deg,#8a6a2a,var(--gild));transition:width .2s ease}
.ld-row{display:flex;justify-content:space-between;margin-top:8px;font-family:var(--pixel);font-size:12px;color:var(--mist)}
.ld-tip{min-height:3em;margin:22px 0 0;font-size:13px;line-height:1.6;color:var(--mist)}
#ld-skip{margin-top:10px}
@media (prefers-reduced-motion:reduce){#loader{transition:none}}`;document.body.appendChild(st);}
const LD_TIPS=['萊恩把元素分解出來，刻下錨點；錨點的數量決定陣形。','把敵人的外裝甲打到 0 就會 BREAK，暈眩一回合。','從高處往下打，每高一層傷害 +25%。',
  '北境的寒氣會讓克蕾雅的機械鎧結霜，記得靠近蒸氣閥。','按 Esc 打開選單，設定、存檔、遊戲指南都在裡面。','地圖角落好像有一隻黑貓……'];
{let k=Math.floor(Math.random()*LD_TIPS.length);const tip=()=>{const e=$('ld-tip');if(e)e.textContent='提示：'+LD_TIPS[k++%LD_TIPS.length];};tip();LOAD.tipT=setInterval(tip,3800);}
function ldCrit(u){return /\/ch_|portraits\/|\/bg_/.test(u);}
function ldDraw(){const p=LOAD.total?Math.round(LOAD.done/LOAD.total*100):100;const f=$('ld-fill');if(f)f.style.width=p+'%';
  const t=$('ld-pct');if(t)t.textContent=p+'%';const x=$('ld-txt');if(x)x.textContent=`載入素材 ${LOAD.done}/${LOAD.total}`;
  const bar=document.querySelector('.ld-bar');if(bar)bar.setAttribute('aria-valuenow',p);}
function ldFinish(){if(LOAD.ready)return;LOAD.ready=true;clearInterval(LOAD.tipT);const ov=$('loader');if(!ov)return;
  const wait=Math.max(0,600-(performance.now()-LOAD.t0));setTimeout(()=>{ov.classList.add('out');setTimeout(()=>ov.remove(),700);},wait);}
{const q=ASSETS.slice().sort((a,b)=>ldCrit(b)-ldCrit(a));LOAD.critTotal=q.filter(ldCrit).length;let i=0;
  const next=()=>{if(i>=q.length)return;const u=q[i++],im=new Image();im.decoding='async';
    const fin=()=>{LOAD.done++;if(ldCrit(u))LOAD.crit++;ldDraw();if(LOAD.done>=LOAD.total)ldFinish();next();};
    im.onload=fin;im.onerror=fin;im.src=u;LOAD.imgs[u]=im;};
  for(let k=0;k<6;k++)next();if(!q.length)ldFinish();
  setTimeout(()=>{if(!LOAD.ready){const b=$('ld-skip');if(b){b.hidden=false;b.onclick=ldFinish;}}},8000);}
