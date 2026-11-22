/* ======================= CHAPTER 3 — STORY · BATTLES · FLOW (風暴之環) ======================= */
Object.assign(SCENES,{
 /* ---------- 第一幕　飛入風暴 ---------- */
 c3open:[
  {loc:'第三章　風暴之環｜走私飛艇「灰鷗號」　離開白銀之顎第九天',set:'airship',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'舷窗外的雲層一直在發亮。不是陽光——是雷。風暴之環的雷暴從來不停，像一圈永遠在打鼓的牆。'},
  {who:'captain',e:'Neutral',t:'抓穩了，客人。進風暴之環的航道只有一條，偏一度就會被吹去餵雲海。'},
  {n:'克蕾雅坐在貨箱上擦機械鎧的指節。從要塞出來以後，她跟萊恩說過的話，十根手指數得完。'},
  {who:'claire',e:'Neutral',t:'……亞伯特的筆記，指的就是這裡？'},
  {who:'ryan',e:'Default_Cold',t:'駐波刻度一路往西。最後停在風暴的正中央。'},
  {n:'萊恩取出音叉，在膝蓋上輕輕一敲。'},
  {n:'——沒有聲音。'},
  {n:'不是被雷聲蓋過，是真的沒有。音叉在他手裡顫動，卻像被什麼東西掐住了喉嚨。'},
  {who:'ryan',e:'Fork_Gaze',t:'……響不起來。'},
  {who:'claire',e:'Hurt',t:'怎麼會？那東西從學院到現在，從來沒失靈過。'},
  {who:'ryan',e:'Fork_Gaze',t:'有東西在吃聲音。整片風暴……都在吃。'},
  {n:'一道白光劈在船殼上。燈全滅了。'},
  {who:'captain',e:'Neutral',t:'右舷著火！抓住任何能抓的東西——我們要迫降了！'},
 ],
 dockIn:[
  {loc:'風暴外緣・飛艇碼頭'},
  {n:'灰鷗號拖著黑煙，一頭栽進碼頭的纜繩網。木棧道在腳下嘎吱作響，再往外一步，就是翻滾的雲海。'},
  {who:'claire',e:'Angry_Steam',t:'咳……還活著。萊恩？'},
  {who:'ryan',e:'Default_Cold',t:'沒事。風很大，靠著牆走。站在空地上，會被吹下去。'},
  {who:'captain',e:'Neutral',t:'船要修三天。碼頭盡頭有升降籠通往城裡——如果那些鳥讓你們過去的話。'},
 ],
 b1pre3:[
  {n:'纜繩上停著一排灰色的大鳥。牠們的羽毛末端劈啪作響，帶著靜電。'},
  {who:'captain',e:'Neutral',t:'風暴鳶！牠們聞到船上的燃油了——還有那幾個想趁亂搶貨的混帳！'},
  {who:'ryan',e:'Default_Cold',t:'克蕾雅，躲到貨箱後面再出手。風會把站在外面的人推出去。'},
 ],
 b1post3:[
  {who:'captain',e:'Neutral',t:'……謝了。說真的，我以為你們是那種只會看地圖的中央官員。'},
  {who:'captain',e:'Neutral',t:'進城以後小心點。高斯港三個月前開始就怪怪的，我送貨進去，沒有一個人開口跟我講價。'},
  {who:'claire',e:'Hurt',t:'沒有人……講話？'},
 ],
 dockHank:[
  {who:'docker',e:'Neutral',t:'（碼頭工人比了個手勢，又指指自己的喉嚨，搖搖頭。）'},
  {n:'他從口袋掏出一張被雨打濕的紙條：「城裡的人都說不出話了。我是三天前才上來的，今天早上也開始啞了。快走。」'},
  {who:'ryan',e:'Fork_Gaze',t:'三天。……越久越嚴重。'},
 ],
 /* ---------- 第二幕　沉默的城 ---------- */
 gaussIn:[
  {loc:'高斯港・下城區',set:'gaussvn',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'高斯港懸在雷雲正中。整座城由四條巨大的鐵鏈吊著，鏈子末端是發著藍光的電磁鐵——城就這麼浮著，不靠地，也不靠天。'},
  {n:'街上有人。賣煤的、修管線的、抱著小孩的。他們張口、比手勢、點頭——'},
  {n:'可是整條街，除了風聲和雷聲，什麼都聽不到。'},
  {who:'claire',e:'Hurt',t:'……好像整座城都被按了靜音。'},
  {n:'萊恩的灰瞳裡，每個人的喉嚨都纏著一圈細細的灰白絲線。絲線全都往上，往城中央那座高聳的避雷塔飄去。'},
  {who:'ryan',e:'Fork_Gaze',t:'聲音被抽走了。和奧姆鎮的記憶、要塞的情緒一樣——收集起來，送去同一個地方。'},
  {who:'claire',e:'Neutral',t:'那為什麼我們還能說話？'},
  {who:'ryan',e:'Fork_Gaze',t:'……不知道。'},
 ],
 milaMeet:[
  {n:'巷口的燈柱下，一個披著黃色雨衣的女孩舉著提燈，瞪大眼睛看著你們。'},
  {n:'她的提燈一明、一滅、又一明——是信號燈的燈語。'},
  {who:'mila',e:'Surprised',t:'（燈光：短、短、長）……你們，還能說話？'},
  {who:'claire',e:'Default_Grin',t:'看得懂燈語嗎？我來翻譯——她問我們是不是還能說話。……對，我們能。妳叫什麼名字？'},
  {who:'mila',e:'Neutral',t:'（燈光）米、菈。信號燈手。……快躲起來。'},
  {who:'mila',e:'Hurt',t:'（燈光急促地閃）憲兵——在抓——還有聲音的人。'},
 ],
 b2pre3:[
  {n:'巷子兩頭同時出現了穿灰色大衣的憲兵。他們的臉被黃銅口罩罩住，口罩上的格柵裡沒有呼吸聲。'},
  {who:'gendarme',e:'Neutral',t:'……（口罩下傳來電流般的嗡鳴）'},
  {who:'ryan',e:'Default_Cold',t:'米菈，退到我們後面。'},
 ],
 b2post3:[
  {who:'mila',e:'Neutral',t:'（燈光）跟我來。燈塔。安全。'},
  {n:'米菈領著兩人穿過一條又一條管線小巷，來到城東一座老舊的信號燈塔。'},
 ],
 lighthouse:[
  {loc:'高斯港・信號燈塔'},
  {n:'燈塔頂層貼滿了手寫的燈語表。米菈在一塊黑板上飛快地寫字，寫完就舉給你們看。'},
  {who:'mila',e:'Neutral',t:'（黑板）「三個月前，一個戴灰色手套的男人上了避雷塔。他在塔頂裝了一個大線圈。」'},
  {who:'mila',e:'Hurt',t:'（黑板）「那天晚上打了很大的雷。第二天早上，全城的人都說不出話了。」'},
  {who:'claire',e:'Angry_Steam',t:'灰色手套……是亞伯特。'},
  {who:'mila',e:'Neutral',t:'（黑板）「線圈要很多很多電。電是從城底下的磁軌礦坑拉上去的。」'},
  {who:'ryan',e:'Default_Cold',t:'先切斷礦坑的電源，線圈就沒有足夠的電能吸收聲音。'},
  {who:'mila',e:'Teary_Fierce',t:'（黑板上的字寫得很用力）「我想再聽一次我媽媽唱歌。」'},
  {who:'claire',e:'Teary_Fierce',t:'……交給我們。礦坑的入口在哪？'},
  {who:'mila',e:'Smile',t:'（燈光：長、長）城南。升降籠。'},
 ],
 /* ---------- 第三幕　磁軌礦坑 ---------- */
 mine3In:[
  {loc:'高斯港地底・磁軌礦坑'},
  {n:'升降籠一路往下。城的底部是整塊巨大的磁鐵礦，礦坑就挖在這塊浮岩的肚子裡。'},
  {n:'岩壁上釘著一根根磁柱，泛著藍光。克蕾雅的右臂忽然被往旁邊一扯。'},
  {who:'claire',e:'Angry_Steam',t:'哇——！我的手自己在動！'},
  {who:'ryan',e:'Default_Cold',t:'磁柱在吸妳的機械鎧。離它們遠一點，或者讓我把它們反過來。'},
 ],
 b3pre3:[
  {n:'礦道深處，兩團黑色的岩塊站了起來。岩縫間流著藍色的電光，鐵釘和碎鐵像毛刺一樣黏在它們身上。'},
  {who:'claire',e:'Default_Grin',t:'磁鐵礦做的魔像……牠們吸鐵，我的手也是鐵。這下有意思了。'},
 ],
 lab3:[
  {n:'礦坑最深處，有一間用帆布隔起來的臨時實驗室。桌上散著筆記，旁邊是一排被拆空的電容。'},
  {n:'萊恩翻開最上面那本。字跡工整得近乎冷酷。'},
  {n:'「聲音是記憶的振動。人說出的每一個字，都帶著他想起那件事時的頻率。」'},
  {n:'「只要收集到足夠的共振頻率，就能把一個人『唱』回來。」'},
  {who:'claire',e:'Hurt',t:'……把一個人唱回來？他想復活誰？'},
  {who:'ryan',e:'Fork_Gaze',t:'……'},
  {n:'筆記下面壓著一本礦工名冊。其中一頁被整齊地撕掉了，只在裝訂線旁留下半個字母——「A」。'},
 ],
 talk7:[
  {n:'回程的升降籠很慢。鐵鏈一節一節地響，克蕾雅背靠著籠壁，看著萊恩。'},
  {who:'claire',e:'Neutral',t:'萊恩。'},
  {who:'claire',e:'Neutral',t:'你在要塞說過，救我的人不是你。那時候我很生氣。……現在我只想知道，你還有什麼沒告訴我。'},
  {who:'ryan',e:'Default_Cold',t:'……'},
  {who:'ryan',e:'Fork_Gaze',t:'我的灰瞳，不是天生的。'},
  {who:'claire',e:'Hurt',t:'什麼？'},
  {who:'ryan',e:'Fork_Gaze',t:'事故那天晚上，我的眼睛被零號爐的光燒壞了。醒來的時候，就變成這樣——看得見那些不該看見的東西。'},
  {who:'ryan',e:'Fork_Gaze',t:'是誰動的手、為什麼，我還不知道。……這是真話。'},
  {n:'克蕾雅看了他很久。'},
  {who:'claire',e:'Teary_Fierce',t:'……好。這次我信你。'},
 ],
 /* ---------- 第四幕　避雷塔 ---------- */
 workshop:[
  {loc:'高斯港・城帆工坊'},
  {n:'工坊裡掛滿了巨大的帆布翼。一位綁著灰色長辮的老太太正在黑板上畫風洞圖，看到你們進來，用粉筆敲了敲黑板。'},
  {who:'lewin',e:'Neutral',t:'（黑板）「米菈說了。你們要上塔。用走的會被吹下去。」'},
  {who:'lewin',e:'Neutral',t:'（黑板上畫出一片帆的剖面，上下兩條箭頭）「上面跑得快，下面跑得慢。快的地方壓力小——帆就被往上推。這是城帆讓整座城保持平衡的原理。」'},
  {who:'claire',e:'Default_Grin',t:'伯努利定律！學院的流體力學課教過。'},
  {who:'lewin',e:'Cynical_Smirk',t:'（黑板）「那妳應該知道，把帆繞成一圈，就能在身邊造一圈風牆。」'},
  {n:'萊恩把礦坑帶回的水和炭粉混進陣式，畫出一圈旋轉的氣流——工坊裡的帆布同時鼓了起來。'},
  {who:'ryan',e:'Default_Cold',t:'#R19 伯努利・暴風氣旋障壁。陣裡的人不怕風，陣裡的敵人會被捲到半空。'},
  {n:'窗外又是一道雷。音叉在萊恩手裡猛地一震——依然沒有聲音，但他感覺得到那股共振。'},
  {who:'ryan',e:'Fork_Gaze',t:'……雷打下來的瞬間，音叉會跟著共振。不是聲音，是電流。'},
  {who:'ryan',e:'Cynical_Smirk',t:'鐵、電流、磁場——勞倫茲力。把兩塊鐵當成軌道，電流一通，就能把東西射出去。'},
  {who:'ryan',e:'Default_Cold',t:'#R18 勞倫茲力・電磁軌道砲。站在磁柱旁邊發射，射程更遠。'},
  {who:'lewin',e:'Smile',t:'（黑板）「去吧。把那個線圈拆了。我想念罵學徒的聲音。」'},
 ],
 towerIn:[
  {loc:'避雷塔'},
  {n:'避雷塔是整座城最高的地方。塔身外圍是一圈一圈的浮空平台，跟著電磁鐵的脈衝起落。'},
  {n:'越往上，風越大。雷就在頭頂上翻滾。'},
  {who:'claire',e:'Angry_Steam',t:'這種地方蓋什麼平台……建築師是想謀殺誰？'},
  {who:'ryan',e:'Default_Cold',t:'看平台角落的箭頭。綠色往上，橘色往下。算好再跳。'},
 ],
 b4pre3:[
  {n:'平台中段架著兩座小型線圈，電弧在它們之間來回跳動。憲兵守在平台邊緣。'},
  {who:'ryan',e:'Default_Cold',t:'先拆線圈。它們在幫塔頂充電。'},
 ],
 bossPre3:[
  {n:'塔頂。'},
  {n:'一座三人高的銅線圈蹲踞在避雷針下，四隻黃銅腳抓著地板。頂端的水晶球裡，有成千上萬條細小的聲紋在亂竄——那是整座城的聲音。'},
  {who:'claire',e:'Hurt',t:'那些……都是人的聲音？'},
  {who:'ryan',e:'AshEye_Overload',t:'米菈的媽媽、碼頭的漢克、整條街的人。全都被關在那顆球裡。'},
  {n:'線圈發出一陣尖銳的嗡鳴，像在笑。'},
  {who:'ryan',e:'Default_Cold',t:'它每兩回合放一次電，橫掃一整排。站到有避雷針的那一排——雷會被引去打避雷針，它會接地，外殼會短暫失效。'},
  {who:'claire',e:'Combat_Roar',t:'聽起來很簡單。——上吧！'},
 ],
 bossPost3:[
  {n:'水晶球從內部裂開。'},
  {n:'不是碎片落下來——是聲音。成千上萬個被關住的字、笑聲、哭聲、名字，像一場倒著下的雨，衝上雷雲，又灑回城裡。'},
  {n:'底下的街道上，有人喊出了第一聲。然後是第二聲、第十聲、一百聲。'},
  {who:'claire',e:'Teary_Fierce',t:'……聽到了嗎，萊恩。他們在叫彼此的名字。'},
  {n:'萊恩握著音叉。它終於響了——清亮的一聲，在雷聲之間傳得很遠。'},
 ],
 /* ---------- 第五幕　信 ---------- */
 c3end:[
  {loc:'信號燈塔頂｜風暴之環　黎明',set:'lighthouse',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'風暴之環破了一個口。三個月來第一次，陽光照到了高斯港。'},
  {who:'mila',e:'Teary_Fierce',t:'……謝、謝、你們。'},
  {who:'mila',e:'Smile',t:'嘿嘿。我的聲音，原來是這樣的啊。好奇怪。'},
  {who:'claire',e:'Default_Grin',t:'很好聽喔。比燈語好懂多了。'},
  {n:'米菈跑下樓去找媽媽了。燈塔頂上只剩下兩個人，和一陣終於平靜下來的風。'},
  {n:'克蕾雅從外套內袋拿出那封信。郵戳是三年前的十一月十日，寄件人只寫了一個字母——「H」。'},
  {who:'claire',e:'Neutral',t:'我想起來了。這是霍華德教授的字。'},
  {n:'她拆開信封。'},
 ],
 c3letter:[
  {n:'「克蕾雅：」'},
  {n:'「如果這封信送到了妳手上，代表我沒來得及當面跟妳說。亞伯特在零號爐上做的實驗，已經超出了學院能控制的範圍。他相信只要收集夠多的『人』，就能把失去的東西找回來。」'},
  {n:'「我沒辦法阻止他。所以拜託妳一件事——如果我出了什麼事，照顧好萊恩。那孩子什麼都往自己身上扛，從來不說。」'},
 ],
 c3letter13:[
  {n:'「還有一件事。亞伯特是我從第十三號採掘聚落帶出來的。他父親死在一點十三分的那場崩塌裡，那年他九歲。」'},
  {n:'「他想找回來的，也許從來不是什麼理論。」'},
 ],
 c3letterEnd:[
  {n:'「真正的阻尼棒，我藏在學院城地下的舊溫室。只有你們兩個打得開。——H」'},
  {who:'claire',e:'Cry',t:'……照顧好萊恩。教授，你自己才是什麼都往身上扛的那個人。'},
  {who:'ryan',e:'Fork_Gaze',t:'學院城的舊溫室……'},
  {who:'ryan',e:'Default_Cold',t:'回去吧。回到一切開始的地方。'},
 ],
});

/* ---------------- battles ---------------- */
function battleC3real(id){
  const done=(flag,post,after)=>()=>{P.flags[flag]=1;if(after)after();else{resumeMap();if(post)setTimeout(()=>talkScene(post),300);}};
  const C={
   b1:{theme:'dock',N:7,title:'飛艇碼頭・風暴鳶來襲',wind:{seq:[[1,0],[0,1],[-1,0],[0,-1]],every:3,edge:'fall'},
     enemies:[['stormkite',1,0],['stormkite',3,1],['stormkite',5,0],['smuggler',6,2]],
     res:[['wall',1,3],['wall',5,4],['wall',3,5],['scrap',0,5],['oil',6,6],['si',2,2]],colTex:'rust',onWin:done('b1','b1post3'),
     guide:'白色氣流是風向。每個敵方回合結束，站在空地上的人會順風被吹 1 格；貨箱（牆）的正後方是「風影格」，吹不動。把敵人吹出平台邊緣就會直接墜落。風暴鳶乘風飛行，不受影響。'},
   b2:{theme:'alley',N:7,title:'下城區巷戰',
     enemies:[['gendarme',1,0],['gendarme',5,0],['gendarme',3,1],['patroldog',0,2],['patroldog',6,2]],hgt:[[0,4,1],[6,4,1]],
     res:[['wall',2,3],['wall',4,3],['scrap',0,6],['al',6,6],['oil',3,4],['si',1,5]],colTex:'fstone',onWin:done('b2',null,()=>{resumeMap();setTimeout(()=>playScene(SCENES.b2post3.concat(SCENES.lighthouse),()=>{P.flags.lh=1;enterMap('gauss',{pos:[34.6,15.6]});setTimeout(()=>toast('城南的礦坑升降籠可以搭了。'),800);},{keep:true,actors:exActors()}),300);}),
     guide:'窄巷裡沒有強風，但兩側都是敵人。用石牆和高台卡住巡邏犬的路線，讓憲兵一個一個過來。'},
   b3:{theme:'mine3',N:7,title:'磁軌礦坑・磁鐵礦魔像',
     enemies:[['golem',1,1],['golem',5,1],['gendarme',3,0],['patroldog',6,0]],
     res:[['pylon',3,2],['pylon',1,4],['pylon',5,4],['scrap',0,6],['oil',6,6],['si',3,5],['si',0,3]],colTex:'rust',onWin:done('b3',null,()=>{resumeMap();setTimeout(()=>talkScene('lab3',()=>{P.flags.lab=1;c3Clue(4);}),300);}),
     guide:'藍色光環是磁柱：每回合開始，2 格內的金屬單位（魔像、憲兵、克蕾雅的機械臂）會被吸過去 1 格。萊恩站在磁柱旁可以用「共振反轉」改成斥力 2 回合。魔像太重，風吹不動，但磁力拉得動。'},
   b4:{theme:'tower',N:7,title:'避雷塔中段',wind:{seq:[[0,-1],[-1,0],[0,1],[1,0]],every:3,edge:'fall'},
     lift:[[1,2,0],[2,2,1],[4,2,2],[5,2,3],[3,4,1],[0,5,2],[6,5,0]],
     enemies:[['minicoil',1,0],['minicoil',5,0],['gendarme',3,1],['gendarme',3,3]],
     res:[['wall',3,0],['scrap',0,6],['oil',6,6],['si',3,6],['al',6,3]],colTex:'rust',onWin:done('b4',null),
     guide:'浮空平台在 0、1、2 層之間升降，角落的箭頭是下一回合的方向。站在高處攻擊傷害 +25%。這裡同時有強風——#R19 的氣旋障壁能讓全隊不受風影響，#R18 能把敵人一路轟下平台。'},
   boss:{theme:'tower',N:9,bigBoss:true,title:'避雷塔頂・雷暴線圈',wind:{seq:[[1,0],[-1,0]],every:4,edge:'wall'},
     lift:[[0,6,0],[8,6,2]],
     enemies:[['coil',4,1],['minicoil',1,2],['minicoil',7,2]],
     res:[['rod',0,4],['rod',8,5],['rod',4,6],['si',1,7],['si',7,7],['scrap',2,6],['scrap',6,6],['oil',0,8],['oil',8,8],['al',4,8]],colTex:'rust',
     onWin:()=>{P.flags.boss3=1;resumeMap();setTimeout(()=>playScene(SCENES.bossPost3,c3Ending,{keep:true,actors:exActors()}),300);},
     guide:'雷暴線圈每兩回合放一次電，橫掃一整排。紅銅色的是避雷針：站在有避雷針的那一排，雷會被引過去，線圈會「接地」1 回合——外殼失效，受到的傷害 +50%，#R18 加倍。小線圈會替它充電，先拆掉比較輕鬆。'},
  };
  return Object.assign({ch3:true,explore:false},C[id]);
}
HOOK.after('startBattle',cfg=>{if(cfg.bigBoss&&cfg.ch3)banner('第三章',cfg.title);});

/* ---------------- chapter flow ---------------- */
function enterChapter3(){CHAPTER=3;P.flags.ch3=1;}
{const o=enterMap;enterMap=function(id,opts={}){if(MAPS[id]&&MAPS[id].ch===3)enterChapter3();return o(id,opts);};}
function ch3Equip(ids){ids.forEach(id=>{if(!save.equip.includes(id)){if(save.equip.length>=4)save.equip.pop();save.equip.unshift(id);}});persist();}
/* R18/R19 belong to chapter 3 but stay sealed until the workshop scene */
{const o=canCast;canCast=function(r){if((r.id==='R18'&&!P.flags.r18)||(r.id==='R19'&&!P.flags.r19))return false;return o(r);};}
function startCh3(){
  const snap=ch3Carry();resetParty();
  if(snap&&snap.P&&snap.P.lv){Object.assign(P,JSON.parse(JSON.stringify(snap.P)));P.flags=Object.assign({},snap.P.flags||{});}
  else{P.lv={ryan:{lv:9,exp:0},claire:{lv:9,exp:0}};P.owned=['amulet','bracer','fork','heatsink'];P.gear={ryan:'fork',claire:'heatsink'};P.items={bandage:3,coffee:2,capsule:1};P.stash={Fe:2,C:1,H2O:1};P.money=P.money||120;}
  ['dock','gauss','mine3','tower'].forEach(m=>{Object.keys(P.flags).forEach(k=>{if(k.startsWith('ev_'+m+'_')||k===m+'_in')delete P.flags[k];});});
  ['b1','b2','b3','b4','boss3','mila','lh','lab','talk7','r18','r19','c3_13','lens','blueprint'].forEach(k=>delete P.flags[k]);
  Object.keys(P.flags).forEach(k=>{if(k.startsWith('c3')||k.startsWith('q_c3'))delete P.flags[k];});
  syncMax();healParty(1);enterChapter3();
  if(typeof SLOT!=='undefined'&&SLOT)writeSlot(SLOT,{v:2,stage:'ch3start',map:null,pos:null,t:Date.now(),ch:3,P:snapP()});
  playScene(SCENES.c3open,()=>{enterMap('dock');});}
function c3Ending(){enterMap('gauss',{pos:[22,20]});setTimeout(()=>{
  const list=SCENES.c3end.concat(SCENES.c3letter,P.flags.c3_13?SCENES.c3letter13:[],SCENES.c3letterEnd);
  playScene(list,chapter3End);},300);}
function chapter3End(){
  save.cleared3=true;persist();if(typeof SLOT!=='undefined'&&SLOT)writeSlot(SLOT,{v:2,stage:'cleared3',map:null,pos:null,t:Date.now(),ch:3,P:snapP()});
  clearRun();show('title');
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><span class="t-eyebrow">CHAPTER 3 COMPLETE</span><h3>第三章　完</h3>
   <p>高斯港的聲音回來了。克蕾雅讀完了霍華德教授的信${P.flags.c3_13?'，也知道了亞伯特的來處':''}。下一站，是一切開始的地方——中央學院城。</p>
   <p class="note">第四章（中央學院城・舊溫室）製作中。</p>
   <div class="row"><button class="btn primary" id="c3-t">回到標題</button><button class="btn" id="c3-b">再戰雷暴線圈</button></div></div></div>`;
  $('c3-t').onclick=()=>{$('ov').innerHTML='';};
  $('c3-b').onclick=()=>{$('ov').innerHTML='';enterChapter3();P.flags.r18=P.flags.r19=1;const c=battleC3real('boss');c.onWin=()=>chapter3End();openBase(()=>startBattle(c),'出擊：避雷塔頂');};}
/* chapter 2 end → straight into chapter 3 */
{const o=chapter2End;chapter2End=function(...a){const r=o(...a);const card=document.querySelector('#ov .card');if(!card)return r;
  const note=card.querySelector('.note');if(note)note.textContent='你的等級、飾品、道具和劇情進度會帶進第三章。';
  const row=card.querySelector('.row'),b=document.createElement('button');b.className='btn primary';b.id='c2-3';b.textContent='進入第三章';row.prepend(b);
  const t=$('c2-t');if(t)t.classList.remove('primary');b.onclick=()=>{$('ov').innerHTML='';startCh3();};return r;};}
/* save slots: a slot that finished chapter 2 (or sits at chapter 3's start) continues into chapter 3 */
{const o=loadSlot;loadSlot=function(n){const d=readSlot(n);
  if(d&&(d.stage==='cleared2'||d.stage==='ch3start'||d.stage==='cleared3')){SLOT=n;try{localStorage.setItem(CH3_KEY,JSON.stringify({v:3,t:Date.now(),P:d.P}));}catch(e){}
    if(d.stage==='cleared3')setTimeout(()=>toast('這個存檔已經通關第三章。從第三章開頭重新遊玩（等級與道具保留）。'),400);startCh3();return;}
  return o(n);};}
/* title menu: 第三章 under 第二章 (the playtest entry stays below it) */
{const ch2=$('m-ch2');if(ch2){const b=document.createElement('button');b.className='mbtn';b.id='m-ch3';b.innerHTML='第三章　風暴之環 <small>從第三章開始・高斯港</small>';
  ch2.after(b);b.onclick=()=>typeof slotMenu==='function'?slotMenu('new',()=>startCh3()):startCh3();}}
