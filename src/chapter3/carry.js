/* ======================= CHAPTER 3 — carry-over (prepared before the chapter itself exists) =======================
   When chapter 2 ends, keep the whole party state — levels, gear, items, money AND story flags
   (the "H" letter, the black cat's bell, Erik's letter…) — so chapter 3 can call back to them. */
const CH3_KEY='iron-ash-ch3';
function ch3Snapshot(){return JSON.parse(JSON.stringify({v:3,t:Date.now(),P:typeof snapP==='function'?snapP():P}));}
function ch3Carry(){try{const d=JSON.parse(localStorage.getItem(CH3_KEY)||'null');return d&&d.P?d:null;}catch(e){return null;}}
{const o=chapter2End;chapter2End=function(...a){try{localStorage.setItem(CH3_KEY,JSON.stringify(ch3Snapshot()));}catch(e){}return o(...a);};}
