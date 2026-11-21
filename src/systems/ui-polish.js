/* ======================= UI POLISH: readable target tiles on bright ground · compact action panel ======================= */
/* --- target tiles: outlined + pulsing, darker fill on snow / ice so they read against the glare --- */
const BRIGHT_THEMES=['snow','glacier'];
{const o=buildBattleWorld;buildBattleWorld=function(){const r=o.apply(this,arguments);if(!B||!B.ovl)return r;
  const eg=new THREE.EdgesGeometry(new THREE.PlaneGeometry(.86,.86));
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const p=B.ovl[i][j];
    const f=new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0,depthWrite:false}));f.position.z=.004;p.add(f);p.userData.frame=f;}
  E.fxs.push((dt,t)=>{if(!B||!B.ovl||!B.targets||!B.targets.size)return;const k=.5+.5*Math.sin(t*5);
    B.targets.forEach((_,key)=>{const [i,j]=key.split(',').map(Number),p=B.ovl[i]&&B.ovl[i][j];if(!p)return;const u=p.userData;
      p.material.opacity=u.baseOp*(.78+.22*k);if(u.frame)u.frame.material.opacity=.65+.35*k;});});
  return r;};}
const shade=(hex,f)=>{const c=new THREE.Color(hex);c.multiplyScalar(f);return c.getHex();};
{const o=setTargets;setTargets=function(cells,color){o(cells,color);if(!B||!B.ovl)return;
  const brightTheme=BRIGHT_THEMES.includes(B.cfg&&B.cfg.theme);
  cells.forEach(([i,j])=>{const p=B.ovl[i]&&B.ovl[i][j];if(!p)return;const bright=brightTheme||B.tiles[i][j]==='ice';
    p.material.color.setHex(bright?shade(color,.45):color);p.userData.baseOp=bright?.78:.55;p.material.opacity=p.userData.baseOp;
    const f=p.userData.frame;if(f){f.material.color.setHex(bright?0x06141c:new THREE.Color(color).lerp(new THREE.Color(0xffffff),.55).getHex());f.material.opacity=.9;}});};}
{const o=clearTargets;clearTargets=function(){o();if(!B||!B.ovl)return;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const f=B.ovl[i][j].userData.frame;if(f)f.material.opacity=0;}};}

/* --- compact action panel on laptop-sized screens --- */
{const st=document.createElement('style');st.textContent=`
@media (max-height:900px) and (min-width:861px),(max-width:1500px) and (min-width:861px){
 .deck{grid-template-columns:minmax(0,210px) minmax(0,.55fr) minmax(0,1.75fr);gap:8px;align-items:end}
 .ucard .bar{margin-top:3px}
 .pool,.acts{padding:6px 8px}
 .pool h5,.acts h5{margin:0 0 4px}
 .ucards{gap:4px}.ucard{padding:5px 8px}.ucard .st{margin-top:2px}
 .abtns{gap:4px}
 .ab{padding:4px 8px;font-size:12px;line-height:1.25}
 .ab small{display:none}
 .ab.rc{max-width:100%}
 .acts h5 .hint{font-family:var(--pixel);font-size:10px;color:var(--mist);letter-spacing:0;margin-left:8px}
}`;document.body.appendChild(st);}
/* the hidden subtitles move into a tooltip and into the panel header on hover / focus */
{const o=renderActions;renderActions=function(){o();const box=$('abtns'),h=$('acts-h');if(!box||!h)return;const base=h.textContent.replace(/\s*—.*$/,'');
  box.querySelectorAll('.ab').forEach(b=>{const sm=b.querySelector('small');if(!sm)return;const tip=sm.textContent.trim();b.title=tip;
    const show=()=>{h.innerHTML=`${base}<span class="hint">— ${tip}</span>`;},hide=()=>{h.textContent=base;};
    b.addEventListener('mouseenter',show);b.addEventListener('focus',show);b.addEventListener('mouseleave',hide);b.addEventListener('blur',hide);});};}
