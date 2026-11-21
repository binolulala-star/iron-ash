/* ======================= GRAPHICS LEVELS + AUTOMATIC DOWNGRADE =======================
   high: full post-processing, up to 2× pixel ratio      std: lighter post, up to 1.5×
   low : no bloom, no shadows, 1× (0.85× on high-DPI)    auto: start from a device guess, step down while FPS stays low */
save.gfx=save.gfx||'auto';
const GFX_NAME={auto:'自動',high:'高',std:'標準',low:'省電'};
let GFX_LV=save.gfx==='auto'?(save.gfxAuto||guessGfx()):save.gfx;
function guessGfx(){const mob=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||matchMedia('(pointer:coarse)').matches;
  const mem=navigator.deviceMemory||8,cpu=navigator.hardwareConcurrency||8;return mob||mem<=4||cpu<=4?'std':'high';}
function applyGfx(lv){GFX_LV=lv;const dpr=window.devicePixelRatio||1;
  save.postQ=lv==='high'?'high':'std';
  const pr=lv==='high'?Math.min(2,dpr):lv==='std'?Math.min(1.5,dpr):(dpr>1.5?.85:1);
  E.renderer.setPixelRatio(pr);if(E.composer.setPixelRatio)E.composer.setPixelRatio(pr);
  const sh=lv!=='low';if(E.renderer.shadowMap.enabled!==sh){E.renderer.shadowMap.enabled=sh;E.scene.traverse(o=>{if(o.material){[].concat(o.material).forEach(m=>m.needsUpdate=true);}});}
  E.bloom.enabled=lv!=='low';
  applyQ&&applyQ();resize();}
/* FPS watch: only while actually playing (explore / battle), 4-second windows */
const PERF={frames:0,t:0,low:0,warned:false};
function perfTick(dt){if(save.gfx!=='auto'||document.hidden||!(E.mode==='explore'||E.mode==='battle')||(typeof LOAD!=='undefined'&&!LOAD.ready)){PERF.frames=0;PERF.t=0;return;}
  PERF.frames++;PERF.t+=dt;if(PERF.t<4)return;const fps=PERF.frames/PERF.t;PERF.frames=0;PERF.t=0;PERF.last=Math.round(fps);
  if(fps<42&&GFX_LV!=='low'){PERF.low++;if(PERF.low>=2){PERF.low=0;const nl=GFX_LV==='high'?'std':'low';save.gfxAuto=nl;persist();applyGfx(nl);
      toast(`畫面不夠流暢（約 ${Math.round(fps)} FPS），已自動把畫質調成「${GFX_NAME[nl]}」。可以在 選單 → 設定 調整。`);}}
  else PERF.low=0;}
/* measure with real time, since battle speed scales the engine clock */
{let last=performance.now();const loop=()=>{const n=performance.now(),dt=Math.min(.5,(n-last)/1000);last=n;perfTick(dt);requestAnimationFrame(loop);};requestAnimationFrame(loop);}
/* settings row: replace the two-way 畫質 switch */
{const i=SETTINGS.findIndex(s=>s[0]==='畫質');const row=['畫質',()=>[['auto','自動'],['high','高'],['std','標準'],['low','省電']],()=>save.gfx,v=>{save.gfx=v;persist();applyGfx(v==='auto'?(save.gfxAuto||guessGfx()):v);}];
  if(i>=0)SETTINGS[i]=row;else SETTINGS.splice(1,0,row);}
applyGfx(GFX_LV);
