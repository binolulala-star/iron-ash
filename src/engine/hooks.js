/* ======================= HOOKS: extension points instead of stacked wrappers =======================
   HOOK.after('startBattle', cfg=>{...})   runs after the function, in registration (file) order
   HOOK.before('enterMap', id=>{...})      runs before it
   The hooked functions are listed in engine/hooks-install.js (last file in the manifest). */
const HOOK={b:{},a:{},
  before(n,f){(this.b[n]||(this.b[n]=[])).push(f);},
  after(n,f){(this.a[n]||(this.a[n]=[])).push(f);},
  run(kind,n,args){(this[kind][n]||[]).forEach(f=>{try{f(...args);}catch(e){console.error('hook '+n,e);}});}};
