/* ======================= VN MODE: painted-background talk scenes (background + two portraits + text box) ======================= */
const VN_SETS={infirmary:'bg_hospital',dawn:'bg_dawn',snowtrain:'bg_snowtrain'};
const VN={on:false,slots:{left:null,right:null},last:null};
{const story=$('story'),bg=document.createElement('div');bg.id='vn-bg';bg.innerHTML='<div class="vn-img"></div><div class="vn-dust"></div>';
  const L=document.createElement('div'),R=document.createElement('div');L.className='vn-p left';R.className='vn-p right';L.innerHTML=R.innerHTML='<img alt="">';
  story.insertBefore(R,story.firstChild);story.insertBefore(L,story.firstChild);story.insertBefore(bg,story.firstChild);
  VN.el={bg,L,R};}
function vnOff(){if(!VN.on)return;VN.on=false;document.body.classList.remove('vn');VN.slots={left:null,right:null};VN.last=null;
  [VN.el.L,VN.el.R].forEach(e=>{e.classList.remove('on','act');});}
function vnOn(name){VN.on=true;VN.slots={left:null,right:null};VN.last=null;document.body.classList.add('vn');
  const im=VN.el.bg.querySelector('.vn-img');im.style.backgroundImage=`url(env/${VN_SETS[name]}.webp)`;im.style.animation='none';void im.offsetWidth;im.style.animation='';
  [VN.el.L,VN.el.R].forEach(e=>e.classList.remove('on','act'));$('st-stand').classList.remove('on');standWho=null;}
function vnSrc(who,e){const w=standAlt&&standAlt[who]||who;const k=standKey(w,e);if(k)return`portraits/${w}_${k}.webp`;return typeof silhouette==='function'?silhouette(who):null;}
function vnSpeak(who,e){const el=VN.el,sl=VN.slots;
  if(!who){el.L.classList.remove('act');el.R.classList.remove('act');return;}
  const src=vnSrc(who,e);if(!src)return;
  let side=sl.left===who?'left':sl.right===who?'right':null;
  if(!side){if(!sl.right)side='right';else if(!sl.left)side='left';else side=VN.last===sl.right?'left':'right';
    const box=side==='left'?el.L:el.R;box.classList.remove('on');void box.offsetWidth;sl[side]=who;box.dataset.who=who;}
  const box=side==='left'?el.L:el.R,img=box.querySelector('img');
  if(!img.src.endsWith(src)&&img.getAttribute('src')!==src){img.src=src;box.classList.remove('swap');void box.offsetWidth;box.classList.add('swap');}
  box.classList.add('on','act');(side==='left'?el.R:el.L).classList.remove('act');
  box.classList.toggle('sil',src.startsWith('data:'));VN.last=who;}
HOOK.after('buildSet',name=>{if(VN_SETS[name])vnOn(name);else vnOff();});
{const o=show;show=function(id){o(id);if(id!=='story')vnOff();};}
{const o=drawFace;drawFace=function(who,e){if(!VN.on)return o(who,e);$('st-face').hidden=true;$('st-stand').classList.remove('on');standWho=null;vnSpeak(who,e);};}
{const o=playScene;playScene=function(list,onEnd,opts={}){if(opts.keep)vnOff();return o(list,onEnd,opts);};}
{const st=document.createElement('style');st.textContent=`
#vn-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none!important;display:none;background:#05060a}
body.vn #vn-bg{display:block}
#vn-bg .vn-img{position:absolute;inset:-4%;background:center 40%/cover no-repeat;animation:vnkb 38s ease-in-out infinite alternate;filter:saturate(1.05) contrast(1.03)}
@keyframes vnkb{from{transform:scale(1.02) translate(-1%,0)}to{transform:scale(1.09) translate(1.2%,-1%)}}
#vn-bg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,transparent 55%,rgba(4,6,12,.55) 100%),linear-gradient(transparent 62%,rgba(4,6,12,.6))}
#vn-bg .vn-dust{position:absolute;inset:0;opacity:.5;background-image:radial-gradient(1.5px 1.5px at 12% 30%,#fff8,transparent),radial-gradient(1px 1px at 38% 62%,#fff7,transparent),radial-gradient(1.5px 1.5px at 66% 24%,#fff6,transparent),radial-gradient(1px 1px at 84% 70%,#fff7,transparent),radial-gradient(1.2px 1.2px at 52% 48%,#fff6,transparent);background-size:420px 380px;animation:vndust 26s linear infinite}
@keyframes vndust{from{background-position:0 0}to{background-position:120px -380px}}
.vn-p{position:absolute;bottom:calc(18px + 60px + env(safe-area-inset-bottom,0px));height:min(74vh,700px);pointer-events:none!important;display:none;opacity:0;
  transition:opacity .3s ease,transform .35s cubic-bezier(.2,.8,.2,1),filter .3s ease;filter:brightness(.42) saturate(.7);transform:scale(.94)}
body.vn .vn-p{display:block}
.vn-p.left{left:max(1%,calc(50% - 600px));transform-origin:bottom left}
.vn-p.right{right:max(1%,calc(50% - 600px));transform-origin:bottom right}
.vn-p.on{opacity:1}
.vn-p.act{filter:none;transform:none}
.vn-p img{height:100%;width:auto;display:block;filter:drop-shadow(0 6px 18px rgba(0,0,0,.55))}
.vn-p.left img{transform:scaleX(-1)}
.vn-p.sil img{transform:none;filter:drop-shadow(0 0 16px rgba(120,150,210,.3))}
.vn-p.swap img{animation:stswap .22s ease}
.vn-p.left.swap:not(.sil) img{animation-name:vnswapL}
@keyframes vnswapL{from{opacity:.55;transform:scaleX(-1) translateY(4px)}to{opacity:1;transform:scaleX(-1)}}
body.vn #st-stand{display:none}
@media (max-width:600px){.vn-p{height:52vh;bottom:calc(18px + 90px)}.vn-p:not(.act){opacity:0}.vn-p.left{left:-6%}.vn-p.right{right:-6%}}
@media (prefers-reduced-motion:reduce){#vn-bg .vn-img,#vn-bg .vn-dust{animation:none}}`;document.body.appendChild(st);}
