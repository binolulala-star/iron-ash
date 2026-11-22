/* ======================= CHAPTER 3 — cast (sprites + portraits) =======================
   Mila & Lewin: five-pose sheets (idle + 4-frame walk). The old miner and the dock worker drew their
   "passing" frames as little hops, so they walk on contact frames + idle instead. */
Object.assign(CH_ART,{mila:{cw:62,ch:100,body:100,fr:['idle','w1','w2','w3','w4']},lewin:{cw:64,ch:100,body:100,fr:['idle','w1','w2','w3','w4']},
 oldminer:{cw:76,ch:100,body:100,fr:['idle','walkA','hopA','walkB','hopB']},docker:{cw:68,ch:100,body:100,fr:['idle','walkA','hopA','walkB','hopB']}});
['mila','lewin','oldminer','docker'].forEach(k=>chLoad(k,CH_ART[k]));
Object.assign(STAND,{mila:['calm','smile','surprised','teary'],lewin:['stern','smile','worried']});
