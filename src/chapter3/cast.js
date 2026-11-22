/* ======================= CHAPTER 3 — cast (sprites + portraits) =======================
   Mila & Lewin: five-pose sheets (idle + 4-frame walk). The old miner and the dock worker drew their
   "passing" frames as little hops, so they walk on contact frames + idle instead. */
Object.assign(CH_ART,{mila:{cw:62,ch:100,body:100,fr:['idle','w1','w2','w3','w4']},lewin:{cw:64,ch:100,body:100,fr:['idle','w1','w2','w3','w4']},
 oldminer:{cw:76,ch:100,body:100,fr:['idle','walkA','hopA','walkB','hopB']},docker:{cw:68,ch:100,body:100,fr:['idle','walkA','hopA','walkB','hopB']}});
['mila','lewin','oldminer','docker'].forEach(k=>chLoad(k,CH_ART[k]));
Object.assign(STAND,{mila:['calm','smile','surprised','teary'],lewin:['stern','smile','worried']});
Object.assign(NAMES,{mila:'信號燈手・米菈',lewin:'城帆工程師・蕾溫',oldminer:'老礦工・巴托',docker:'碼頭工人・漢克',captain:'走私船長・葛洛',gendarme:'靜默憲兵'});
Object.assign(STAND_MAP,{mila:{Neutral:'calm',Default_Cold:'calm',Smile:'smile',Happy:'smile',Default_Grin:'smile',Surprised:'surprised',Hurt:'surprised',Fork_Gaze:'surprised',Teary_Fierce:'teary',Cry:'teary'},
 lewin:{Neutral:'stern',Default_Cold:'stern',Angry_Steam:'stern',Smile:'smile',Cynical_Smirk:'smile',Happy:'smile',Hurt:'worried',Memory_Headache:'worried',Fork_Gaze:'worried'}});
['mila','lewin'].forEach(w=>STAND[w].forEach(k=>{const im=new Image();im.src=`portraits/${w}_${k}.webp`;STAND_PRE[w+'_'+k]=im;}));
/* fallback palettes / low-res faces until the painted sheets load */
Object.assign(HRPAL,{mila:HRPAL.lia,lewin:HRPAL.keeper,oldminer:HRPAL.hunter,docker:HRPAL.hunter,captain:HRPAL.keeper});
Object.assign(CHAR,{mila:CHAR.lia,lewin:CHAR.keeper,oldminer:CHAR.hunter,docker:CHAR.hunter,captain:CHAR.keeper});
Object.assign(TOWN_KIND,{mila:'mila',lewin:'lewin',oldminer:'oldminer',docker:'docker',captain:'keeper'});
/* enemy aliases that reuse chapter-1/2 sheets under new names */
Object.assign(CH_ART,{smuggler:Object.assign({},CH_ART.guard),patroldog:Object.assign({},CH_ART.hound),minicoil:Object.assign({},CH_ART.turret)});
['smuggler','patroldog','minicoil'].forEach(k=>chLoad(k,CH_ART[k]));
Object.assign(ENEMY,{
 smuggler:Object.assign({},ENEMY.guard,{name:'走私客打手',hp:150,atk:24,drop:['C',1]}),
 patroldog:Object.assign({},ENEMY.hound,{name:'憲兵巡邏犬',hp:80,atk:20}),
 minicoil:Object.assign({},ENEMY.turret,{name:'小型線圈',hp:120,tg:40,atk:10,rng:4,ratk:28,metal:true,drop:['Fe',1],frames:()=>[tex(sweeperCanvas(0)),tex(sweeperCanvas(1))]}),
});
Object.assign(VERB,{smuggler:VERB.guard||['揮拳打向'],patroldog:VERB.hound||['撲咬'],minicoil:['放出電弧，打中']});
Object.assign(EXP_OF,{smuggler:40,patroldog:24,minicoil:36});
Object.assign(TH_H2,{smuggler:2.5,patroldog:1.6,minicoil:1.8});
