/* ======================= SILHOUETTE PORTRAITS for speakers without painted art ======================= */
const SIL={};
/* original ink-silhouette busts: one outline per kind of NPC, rim-lit, no facial features */
const SIL_KIND={keeper:'broad',folkA:'cap',folkB:'scarf',folkC:'peak',soldier:'helmet',miner:'cap'};
function silhouette(who){if(SIL[who]!==undefined)return SIL[who];const kind=SIL_KIND[who]||'plain';
  const W=380,H=560,c=cvs(W,H),g=c.getContext('2d');
  const body=(gc)=>{gc.beginPath();const sw=kind==='broad'?168:kind==='scarf'?132:150,cx=W/2,sy=340;
    // shoulders and torso
    gc.moveTo(cx-sw,H);gc.bezierCurveTo(cx-sw,sy+70,cx-sw+30,sy+8,cx-56,sy-6);gc.lineTo(cx-34,sy-40);gc.lineTo(cx+34,sy-40);gc.lineTo(cx+56,sy-6);
    gc.bezierCurveTo(cx+sw-30,sy+8,cx+sw,sy+70,cx+sw,H);gc.closePath();gc.fill();
    // head
    const hy=kind==='broad'?236:228,hr=kind==='broad'?70:64;gc.beginPath();gc.ellipse(cx,hy,hr*.86,hr,0,0,Math.PI*2);gc.fill();
    // headwear
    gc.beginPath();
    if(kind==='cap'){gc.ellipse(cx-4,hy-38,64,34,-.08,Math.PI,0);gc.fill();gc.beginPath();gc.ellipse(cx+40,hy-26,46,10,-.12,0,Math.PI*2);gc.fill();}
    if(kind==='peak'){gc.rect(cx-62,hy-82,124,46);gc.fill();gc.beginPath();gc.ellipse(cx+18,hy-34,74,12,0,0,Math.PI*2);gc.fill();}
    if(kind==='helmet'){gc.ellipse(cx,hy-20,82,66,0,Math.PI,0);gc.fill();gc.beginPath();gc.ellipse(cx,hy-20,96,12,0,0,Math.PI*2);gc.fill();}
    if(kind==='scarf'){gc.moveTo(cx-78,hy+40);gc.bezierCurveTo(cx-98,hy-60,cx-40,hy-104,cx,hy-102);gc.bezierCurveTo(cx+40,hy-104,cx+98,hy-60,cx+78,hy+40);gc.lineTo(cx+60,sy+10);gc.lineTo(cx-60,sy+10);gc.closePath();gc.fill();}
    if(kind==='broad'){gc.ellipse(cx,sy+40,120,60,0,0,Math.PI*2);gc.fill();}};
  const layer=(fill,dx,dy,blur)=>{const t=cvs(W,H),tg=t.getContext('2d');tg.translate(dx,dy);tg.fillStyle=fill;body(tg);if(blur){g.filter=`blur(${blur}px)`;}g.drawImage(t,0,0);g.filter='none';};
  layer('rgba(140,170,220,.7)',-6,-4,2);layer('rgba(220,150,90,.35)',5,0,2);
  const gr=g.createLinearGradient(0,120,0,H);gr.addColorStop(0,'#252b3c');gr.addColorStop(.5,'#141824');gr.addColorStop(1,'#06070b');layer(gr,0,0,0);
  const fade=g.createLinearGradient(0,H*.8,0,H);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(1,'rgba(0,0,0,1)');
  g.globalCompositeOperation='destination-out';g.fillStyle=fade;g.fillRect(0,H*.8,W,H*.2);
  return SIL[who]=c.toDataURL();}
{const o=showStand;showStand=function(who,e){if(!who||STAND[who])return o(who,e);const url=silhouette(who);if(!url)return o(who,e);
  const st=$('st-stand'),img=$('st-stand-img');
  if(standWho!==who){st.classList.remove('on','swap');void st.offsetWidth;img.src=url;st.classList.add('on','sil');standWho=who;}
  return true;};}
{const o=showStand;showStand=function(who,e){const r=o(who,e);const st=$('st-stand');if(st&&who&&STAND[who])st.classList.remove('sil');return r;};}
{const st=document.createElement('style');st.textContent=`#st-stand.sil img{filter:drop-shadow(0 0 18px rgba(120,150,210,.25))}`;document.body.appendChild(st);}
