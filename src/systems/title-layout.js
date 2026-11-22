/* ======================= TITLE LAYOUT — the logo never sits on top of the menu =======================
   Default: logo centred near the top, menu bottom-left. If the two boxes touch (short/wide windows, long
   "continue" line), the logo moves into the space right of the menu ('side'); if even that is too tight
   (narrow screens), the logo drops into normal flow above the menu and the screen scrolls ('stack'). */
{const st=document.createElement('style');st.textContent=`
#title.tl-side .t-logo{left:var(--tl-left,0px);right:0;top:max(calc(6vh + env(safe-area-inset-top,0px)),16px)}
#title.tl-side .t-name{font-size:clamp(30px,calc((100vw - var(--tl-left,0px) - 40px)/8.2),88px)}
#title.tl-stack{justify-content:flex-start;overflow-y:auto}
#title.tl-stack .t-logo{position:relative;top:auto;left:auto;right:auto;align-self:stretch;padding-top:max(env(safe-area-inset-top,0px),8px)}
#title.tl-stack .t-name{font-size:clamp(30px,8.4vw,64px)}
#title.tl-stack .t-foot{margin-top:auto}
#title.tl-tight .menu{gap:0;padding:6px 10px}#title.tl-tight .mbtn{padding-top:5px;padding-bottom:5px}#title.tl-tight{padding-top:8px;padding-bottom:calc(26px + env(safe-area-inset-bottom,0px))}
#title .menu{max-width:min(520px,calc(100vw - 32px))}
#title .mbtn small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`;document.head.appendChild(st);}
function tlHit(a,b,m=10){return a.right+m>b.left&&a.left-m<b.right&&a.bottom+m>b.top&&a.top-m<b.bottom;}
function layoutTitle(){const T=$('title');if(!T||T.hidden)return;const logo=T.querySelector('.t-logo'),menu=T.querySelector('.menu');
  T.classList.remove('tl-side','tl-stack','tl-tight');T.style.removeProperty('--tl-left');
  if(menu.getBoundingClientRect().top<8)T.classList.add('tl-tight');   /* menu taller than a short landscape screen: tighten it first */
  if(!tlHit(logo.getBoundingClientRect(),menu.getBoundingClientRect()))return;
  const mr=menu.getBoundingClientRect();
  if(innerWidth-mr.right>=420){T.style.setProperty('--tl-left',Math.round(mr.right+16)+'px');T.classList.add('tl-side');
    if(!tlHit(logo.getBoundingClientRect(),menu.getBoundingClientRect()))return;T.classList.remove('tl-side');T.style.removeProperty('--tl-left');}
  T.classList.add('tl-stack');}
{const o=show;show=function(id){o(id);if(id==='title')requestAnimationFrame(layoutTitle);};}
addEventListener('resize',()=>requestAnimationFrame(layoutTitle));
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layoutTitle);
new MutationObserver(()=>requestAnimationFrame(layoutTitle)).observe($('title').querySelector('.menu'),{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});
requestAnimationFrame(layoutTitle);
