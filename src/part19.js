/* ======================= CHAPTER 2 — STORY · BATTLES · FLOW ======================= */
/* optional speaker-name override on a line: {who:'guard',nm:'換班回來的士兵',...} */
{const o=step;step=function(){const L=S.list[S.i];o();if(L&&L.who&&L.nm){const b=$('st-name').querySelector('b');if(b)b.textContent=L.nm;}};}
SETS.snowtrain=function(){SETS.train();setFog(0x1a2230,.45);E.world.children.forEach(m=>{if(m.isMesh&&m.geometry&&m.geometry.type==='PlaneGeometry'&&m.material&&m.material.color&&m.position.y>2)m.material.color.setHex(0xdce8f4);});
  const g=new THREE.BufferGeometry(),n=160,p=new Float32Array(n*3);for(let q=0;q<n;q++){p[q*3]=(rnd()-.5)*12;p[q*3+1]=1.6+rnd()*1.4;p[q*3+2]=-2.2;}g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.05,transparent:true,opacity:.9}));E.world.add(pts);
  E.fxs.push(dt=>{const a=g.attributes.position.array;for(let q=0;q<n;q++){a[q*3]-=dt*(3+(q%4));a[q*3+1]-=dt*.4;if(a[q*3]<-6){a[q*3]=6;a[q*3+1]=1.6+rnd()*1.4;}}g.attributes.position.needsUpdate=true;});};
SET_SONG.snowtrain='yard';
Object.assign(SCENES,{
 c2train:[
  {loc:'第二章　白銀之顎｜北境鐵路　離開奧姆鎮第五天',set:'snowtrain',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'窗外的雪已經連下了三天。車廂的暖氣管嘶嘶作響，還是擋不住從鐵皮縫隙滲進來的冷。'},
  {n:'克蕾雅用左手狠狠拍了一下右臂。機械鎧的指節結了一層白霜，怎麼也握不攏。'},
  {who:'claire',e:'Angry_Steam',t:'可惡，又卡住了！潤滑油一到零下十五度就開始變稠，再往北走，我這隻手會變成一根冰棒。'},
  {who:'ryan',e:'Default_Cold',t:'霜港鎮有蒸氣供暖網。到了以後，先找人幫妳處理機械鎧。'},
  {who:'claire',e:'Default_Grin',t:'喔？少校大人難得這麼體貼。是怕我凍住了，沒人幫你扛行李吧？'},
  {n:'萊恩沒有回答。他的灰瞳望著窗外——白茫茫的雪原上，零星飄著幾點金紅色的微光，像被風吹散的螢火。'},
  {who:'ryan',e:'Fork_Gaze',t:'……和奧姆鎮的琥珀一樣。是被抽出來的東西，散落在雪裡。'},
  {who:'claire',e:'Hurt',t:'這裡也有？那「白銀之顎」裡面……'},
  {who:'ryan',e:'Fork_Gaze',t:'音叉的駐波刻度一路指著北邊。不管那裡有什麼，答案都在要塞裡。'},
  {n:'汽笛長鳴。列車在一片雪白中減速，月台上的煤氣燈一盞接一盞亮了起來。'},
 ],
 frostportIn:[
  {loc:'霜港鎮・北境終點站'},
  {n:'霜港鎮是鐵路的盡頭。再往北，只剩下冰河，和嵌在冰峰之間的要塞。'},
  {n:'整座城靠著廣場中央那座巨大的供暖塔活下去。蒸氣管線像血管一樣，沿著每一條街爬行。'},
  {who:'claire',e:'Hurt',t:'奇怪……店都開著，街上也有人，可是好安靜。'},
  {who:'ryan',e:'Default_Cold',t:'先打聽要塞的消息。廣場西邊有間酒館。'},
 ],
 fpNumb:[
  {n:'一名穿著白色要塞制服的士兵坐在長椅上。雪落在他肩上，他連拍都不拍。'},
  {who:'guard',nm:'換班回來的士兵',e:'Neutral',t:'……中央的人？要塞的事我記得很清楚。三月十二日換防，十四日暴風雪，二十日輪休下山。'},
  {who:'claire',e:'Hurt',t:'你……不冷嗎？你的手都凍紫了。'},
  {who:'guard',nm:'換班回來的士兵',e:'Neutral',t:'冷？我知道這叫冷。我也知道今天是我女兒的生日。……可是我什麼感覺都沒有。像是隔著一層冰，在看自己的人生。'},
  {n:'灰瞳裡，士兵胸口只剩一團凝固的灰白色。他的記憶都還在——只有「感覺」被整塊凍住、剝走了。'},
  {who:'ryan',e:'Fork_Gaze',t:'奧姆鎮偷的是記憶。這裡偷的……是情緒。'},
 ],
 fpTavern:[
  {who:'keeper',e:'Neutral',t:'要塞封了三個月啦。洛克上校不讓人進，也不讓人出——只有換班的兵會下山，一個比一個安靜。'},
  {who:'claire',e:'Neutral',t:'我們想上要塞，有路嗎？'},
  {who:'keeper',e:'Smile',t:'冰河那條路，只有蒸氣雪橇過得去。去鎮東的雪橇站找莉亞吧，那丫頭什麼天氣都敢跑。'},
  {who:'keeper',e:'Hurt',t:'……不過她最近脾氣不太好。她哥哥艾瑞克就在要塞裡。上個月換班回來，吃著她燉的肉，只說了一句「沒有味道」。'},
 ],
 fpBoard:[
  {n:'佈告欄上貼著一張泛黃的告示：「白銀之顎要塞即日起實施冬季封鎖。奉第七裝甲師團長葛蘭上將令。」'},
  {n:'底下有人用炭筆潦草地補了一行字——「把我們的兒子還來。」'},
  {who:'claire',e:'Angry_Steam',t:'又是葛蘭……那傢伙到底在東邊西邊北邊搞了多少事？'},
 ],
 fpFolk:[
  {who:'folkw',e:'Hurt',t:'我丈夫在要塞當廚子。以前他每封信都會抱怨山上有多冷、伙食有多難吃。'},
  {who:'folkw',e:'Hurt',t:'這三個月的信，只剩下一行：「一切正常。」……一切正常，才最不正常啊。'},
 ],
 fpLia:[
  {n:'雪橇站裡，一個裹著紅棕色大衣的女孩正趴在蒸氣雪橇底下，扳手敲得叮噹響。'},
  {who:'lia',e:'Default_Grin',t:'要租雪橇？今天不跑了，冰河在起風——……等等，那是機械鎧？還是赫菲斯托斯式的！'},
  {who:'claire',e:'Default_Grin',t:'喔？識貨嘛。我自己造的。'},
  {who:'lia',e:'Default_Grin',t:'我叫莉亞，北境跑得最快的信差。妳的關節在冒霜，這樣下去會卡死的，借我看一下。'},
  {n:'莉亞從工具箱翻出一片布滿細密鰭片的銅板，三兩下鎖進克蕾雅肩甲的散熱口。'},
  {who:'lia',e:'Smile',t:'這是熱交換片的反向用法——把蒸氣管的熱導進來，而不是排出去。撐不了多久，但夠妳走到要塞。'},
  {who:'lia',e:'Smile',t:'在冰河上打架的話，記得往有蒸氣閥的地方靠。手卡住了，就讓這位一臉臭的少校幫妳生火。'},
  {who:'ryan',e:'Cynical_Smirk',t:'……我有名字。妳願意載我們上山？'},
  {who:'lia',e:'Hurt',t:'我哥艾瑞克在要塞裡。他上個月回家，吃著我煮的燉肉，說「我知道這很好吃，但我嚐不出來」。'},
  {who:'lia',e:'Teary_Fierce',t:'我要知道要塞對他做了什麼。雪橇只能送你們到冰河口，剩下的路得用走的——冰河裡有雪狼，還有要塞的巡邏兵。'},
  {who:'claire',e:'Angry_Steam',t:'那還等什麼？出發！'},
 ],
 glacierIn:[
  {loc:'冰河裂谷'},
  {n:'雪橇在冰河口停下。往北望去，兩道冰崖之間夾著一條蜿蜒的雪路，盡頭隱約看得見要塞的燈火。'},
  {who:'lia',e:'Hurt',t:'我在這裡等到天黑。……拜託了，把我哥的事查清楚。'},
  {who:'claire',e:'Default_Grin',t:'交給我們。妳把茶煮好等著就行了。'},
 ],
 glLia:[{who:'lia',e:'Smile',t:'冰面很滑，走路小心。打架的時候站到高處去——雪狼最喜歡從岩脊上往下撲。'}],
 b1pre:[
  {n:'風雪裡傳來金屬摩擦般的嚎叫。三頭蒸氣雪狼從岩脊上竄了下來！'},
  {who:'claire',e:'Angry_Steam',t:'從上面撲下來……牠們會搶高處！'},
  {who:'ryan',e:'Default_Cold',t:'那我們也搶。站上岩台再出手，力道會更重。'},
 ],
 b1post:[
  {who:'ryan',e:'Fork_Gaze',t:'雪狼的齒輪上刻著要塞的編號。是軍方養的獵犬。'},
  {who:'claire',e:'Hurt',t:'在自家門口放狼……要塞到底在防誰？'},
 ],
 glShard:[
  {n:'冰層裡嵌著一塊拳頭大的結晶，裡面封著一團微微跳動的金光。'},
  {n:'克蕾雅伸手碰了一下，又猛地縮回來。'},
  {who:'claire',e:'Hurt',t:'……好溫暖。明明是冰，摸起來卻像有人在哭。'},
  {who:'ryan',e:'Fork_Gaze',t:'是情緒。有人把「感覺」從記憶裡剝出來，凍成了晶體。……大概是運送途中掉下來的。'},
 ],
 b2pre:[
  {n:'冰河渡口。兩名穿著白色冰甲的士兵擋在結冰的河面上。'},
  {who:'guard',nm:'霜甲衛兵',e:'Neutral',t:'止步。要塞封鎖中，擅闖者格殺勿論。'},
  {who:'ryan',e:'Cynical_Smirk',t:'中央特務測算少校，萊恩・維斯。你們的上校知道你們在這裡殺人嗎？'},
  {who:'guard',nm:'霜甲衛兵',e:'Neutral',t:'……我們只聽歐利克大人的命令。'},
  {who:'claire',e:'Angry_Steam',t:'歐利克又是誰啦！'},
  {n:'冰甲衛兵舉盾逼近。腳下的冰面光滑得像一面鏡子。'},
 ],
 b2post:[
  {who:'claire',e:'Default_Grin',t:'把人打飛到冰上，一路滑去撞牆——這招我喜歡！'},
  {who:'ryan',e:'Default_Cold',t:'歐利克……要塞的編制裡沒有這個名字。有人在要塞裡另立山頭。'},
 ],
 glHunter:[
  {who:'hunter',e:'Neutral',t:'這種天氣還往要塞走？年輕人真是不要命。'},
  {who:'hunter',e:'Hurt',t:'這陣子夜裡，常有雪橇從要塞往南運箱子。箱子裡會發光，像裝了一整箱的螢火蟲。'},
  {who:'hunter',e:'Neutral',t:'進屋烤烤火吧。要塞的人不會往這邊巡。'},
 ],
 fortressIn:[
  {loc:'白銀之顎要塞・南門廣場'},
  {n:'要塞嵌在兩座冰峰之間，城牆上的砲台像一排咬合的銀牙——這就是「白銀之顎」名字的由來。'},
  {n:'城門內，一名披著毛皮斗篷的高大軍官正等著他們。他身後站著一整排士兵，連呼吸都整齊得可怕。'},
  {who:'locke',e:'Default_Cold',t:'中央特務測算少校，萊恩・維斯。葛蘭的人。'},
  {who:'ryan',e:'Default_Cold',t:'我是中央派來的。來調查要塞士兵的異狀。'},
  {who:'locke',e:'Default_Cold',t:'異狀？我的兵一個也沒少。該站崗的站崗，該巡邏的巡邏。他們比以前更守紀律——不吵、不怕、不想家。'},
  {who:'claire',e:'Angry_Steam',t:'那叫守紀律？那叫被掏空了！'},
  {who:'locke',e:'Default_Cold',t:'注意妳的語氣，准尉。'},
  {n:'洛克上校沉默了很久。'},
  {who:'locke',e:'Default_Cold',t:'日落之前，你們可以在要塞裡自由行動。日落之後還留在這裡，我就以間諜罪處置。'},
  {who:'locke',e:'Default_Cold',t:'——還有，別靠近東塔。'},
 ],
 ftLocke:[
  {who:'locke',e:'Default_Cold',t:'還有事？'},
  {who:'ryan',e:'Fork_Gaze',t:'上校，你的兵在山下連女兒的生日都不在乎了。你真的覺得這樣叫「正常」？'},
  {who:'locke',e:'Default_Cold',t:'……軍人的職責是守住城牆，不是在乎生日。'},
  {n:'上校轉過身去。萊恩注意到，他戴著手套的手，握得指節發白。'},
 ],
 ftErik:[
  {n:'兵營門口，一名年輕士兵正機械地擦著靴子。名牌上寫著「艾瑞克」。'},
  {who:'claire',e:'Neutral',t:'你是艾瑞克？莉亞的哥哥？'},
  {who:'erik',e:'Neutral',t:'莉亞……是啊，我妹妹。她燉的肉很好吃。我記得。'},
  {who:'claire',e:'Hurt',t:'她很擔心你。她在冰河口等著。'},
  {who:'erik',e:'Neutral',t:'擔心……我知道那是什麼意思。可是我想不起來，那是什麼感覺。'},
  {who:'erik',e:'Neutral',t:'每個月，我們會被叫去東塔地下做「低溫適應處置」。睡一覺起來，身體就不怕冷了。歐利克大人說，這樣我們在零下四十度也能站崗。'},
  {who:'ryan',e:'Fork_Gaze',t:'把士兵的情緒抽走，讓他們不怕冷、不怕死……這是在把人造成兵器。'},
 ],
 ftSoldier:[
  {who:'guard',nm:'擦槍的士兵',e:'Neutral',t:'上校？上校是好人。他每天晚上都會一個人到東塔門口站很久。'},
  {who:'guard',nm:'擦槍的士兵',e:'Neutral',t:'他在想什麼，我不知道。……以前的我，大概會知道吧。'},
 ],
 ftClinic:[
  {n:'醫務室窗口攤著一本值班日誌：「本月低溫適應處置 312 人次。副作用：情感遲鈍、味覺喪失、睡眠中不再做夢。」'},
  {n:'頁尾有一行批示：「繼續觀察。——洛克」'},
  {who:'claire',e:'Angry_Steam',t:'那個上校明明全都知道！'},
 ],
 ftOffice:[
  {n:'上校辦公室的桌上攤著一份電報。'},
  {n:'「東塔工程由特聘研究員歐利克全權負責。洛克上校不得干預、不得查問、不得上報。違者以抗命論處。——葛蘭」'},
  {n:'電報旁邊，壓著一張全家福。照片裡的洛克上校抱著一個小女孩，笑得很開心。'},
  {who:'ryan',e:'Fork_Gaze',t:'……他不是同夥。他是被架空了。'},
  {who:'claire',e:'Hurt',t:'所以他才說「別靠近東塔」。不是威脅——是警告。'},
  {who:'ryan',e:'Default_Cold',t:'去東塔。'},
 ],
 ftEastBlock:[
  {n:'東塔的鐵門緊閉，城牆上的寒霧砲台緩緩轉向你們，發出低沉的嗡鳴。'},
  {who:'ryan',e:'Default_Cold',t:'現在硬闖太冒險了。先在要塞裡找找，東塔到底在做什麼。'},
 ],
 b3pre:[
  {n:'東塔城牆上，寒霧砲台一座接一座亮起了藍光。'},
  {who:'guard',nm:'東塔衛兵',e:'Neutral',t:'歐利克大人有令：任何人接近東塔，就地凍結。'},
  {who:'claire',e:'Angry_Steam',t:'砲台架在高台上！我的拳頭搆不到啦！'},
  {who:'ryan',e:'Default_Cold',t:'那就把地面升上去。#R16 地殼隆起——我幫妳搭一條路。'},
 ],
 b3post:[
  {n:'最後一座砲台冒著白煙停止運轉。東塔底部的鐵門被震開了一道縫，冷氣從裡面湧出來，帶著淡淡的藍光。'},
  {who:'claire',e:'Default_Grin',t:'岩柱搭的樓梯，還挺好爬的嘛。'},
  {who:'ryan',e:'Fork_Gaze',t:'下面的溫度……比冰河還低。走吧。'},
 ],
 vaultIn:[
  {loc:'東塔地下・冰封記憶庫'},
  {n:'鐵梯往下延伸了很久。每往下一層，溫度就低一截，最後連呼出的氣都結成了冰屑。'},
  {n:'地下是一座巨大的冰窖。上千塊結晶整齊地排在架子上，每一塊都封著一團微弱的光。'},
  {who:'claire',e:'Hurt',t:'這些……全部都是？'},
  {who:'ryan',e:'Fork_Gaze',t:'三個月，三百多人，每人每月一次。……這是整座要塞的心。'},
 ],
 vShelf:[
  {n:'每一塊結晶都貼著一張小小的名牌。克蕾雅停在其中一格前面。'},
  {n:'「艾瑞克・霍斯特　第三次處置　主要成分：思念（妹）、恐懼（高處）、喜悅（燉肉）」'},
  {who:'claire',e:'Teary_Fierce',t:'連燉肉的味道都被收在這裡……這些傢伙，到底把人當成什麼了！'},
 ],
 b4pre:[
  {n:'走廊盡頭，十幾名士兵像雕像一樣站著，皮膚上覆滿了冰晶。他們同時轉過頭來。'},
  {who:'claire',e:'Hurt',t:'是要塞的兵！不能下重手——'},
  {who:'ryan',e:'Default_Cold',t:'冰晶在他們身上長得太深了。用折射陣把晶體震碎，人就會醒過來。'},
 ],
 b4post:[
  {n:'冰晶碎裂的聲音此起彼落。士兵們一個個倒下，臉上第一次露出痛苦的表情——然後是哭聲。'},
  {who:'claire',e:'Teary_Fierce',t:'會痛，才是活著……對吧。'},
 ],
 orrickMeet:[
  {n:'冰窖最深處，一座巨大的黃銅擺鐘佇立在中央。擺錘每晃一次，整座地窖的結晶就跟著亮一下。'},
  {who:'orrick',e:'Smile',t:'歡迎。中央的灰瞳少校，還有……赫菲斯托斯的小主人。薇拉跟我提過你們。'},
  {who:'ryan',e:'Default_Cold',t:'寒霜鍊金術師歐利克。你和薇拉是同一夥的。'},
  {who:'orrick',e:'Smile',t:'同一夥？我們只是一群相信「效率」的研究者。情緒是人類最浪費的熱量——恐懼、思念、憤怒。我只是把它們收集起來。'},
  {who:'orrick',e:'Default_Cold',t:'士兵不再怕冷、不再想家，要塞永不陷落。這有什麼不對？'},
  {who:'claire',e:'Angry_Steam',t:'你把人變成了不會哭的機器！'},
  {who:'orrick',e:'Smile',t:'說到哭——准尉，妳不記得了吧？零號實驗室裡，是誰把妳推出門外的。'},
  {n:'克蕾雅僵住了。'},
  {who:'orrick',e:'Smile',t:'……原來如此。少校，你沒有告訴她。真是溫柔的謊言。'},
  {who:'ryan',e:'AshEye_Overload',t:'閉嘴。'},
  {who:'orrick',e:'Default_Cold',t:'那就讓擺錘替我說吧。——永凍鍾擺，起動。'},
 ],
 bossPost:[
  {n:'鍾擺的核心碎裂。滿室的結晶同時迸出光芒，暖流像潮水一樣往上湧——三百多名士兵的情緒，正在回到他們身上。'},
  {who:'orrick',e:'Default_Cold',t:'……可惜。真的很可惜。'},
  {n:'歐利克退入寒霧之中。冰面裂開又閉合，只留下一陣笑聲在地窖裡迴盪。'},
  {n:'一塊碎掉的結晶滾到克蕾雅腳邊。和其他的不同，它的光是銀白色的。'},
  {n:'克蕾雅撿起它的瞬間，眼前一白——',fx:'flash'},
  {n:'——紅色的警報燈。崩塌的實驗室。一個穿著白袍、戴著圓眼鏡的男人，用盡全力把她推出門外。'},
  {who:'howard',e:'Smile',t:'克蕾雅，聽好——妳的手很巧，以後一定能做出比我更好的東西。……去吧。'},
  {n:'門關上了。結晶的光吞沒了一切。'},
  {who:'claire',e:'Cry',t:'……那個人是誰？'},
  {who:'claire',e:'Teary_Fierce',t:'我不認識他。可是……為什麼我在哭？萊恩，為什麼我的眼淚停不下來？'},
  {who:'ryan',e:'Fork_Gaze',t:'……'},
  {who:'claire',e:'Teary_Fierce',t:'他就是「霍華德」，對不對？你在醫院說，他只是研究院的一位主任。萊恩，你看著我說。'},
  {who:'ryan',e:'Fork_Gaze',t:'……他是我們的老師。是他把妳推出了零號實驗室。'},
  {who:'claire',e:'Hurt',t:'……為什麼要騙我？'},
  {who:'ryan',e:'Fork_Gaze',t:'因為妳肩膀裡的結晶在吃妳的記憶。我怕妳想起他的那一刻，會連剩下的都一起失去。'},
  {n:'克蕾雅沒有回答。她把銀白色的結晶小心地收進胸前的口袋，轉身走向鐵梯。'},
  {who:'claire',e:'Hurt',t:'……剩下的，等我自己想起來。在那之前——不准再對我說謊。'},
 ],
 c2end:[
  {loc:'白銀之顎要塞・城牆　黎明'},
  {n:'黎明。士兵們三三兩兩坐在城牆上。有人在哭，有人在笑，有人第一次大喊「好冷」。'},
  {who:'locke',e:'Default_Cold',t:'……收到那封電報時，我就知道東塔不對勁。但我選擇了服從。'},
  {who:'locke',e:'Smile',t:'維斯少校。這是亞伯特三年前留在要塞的東西。葛蘭要我燒掉，我沒燒。'},
  {n:'上校遞來一本燒焦了一角的筆記。封面上寫著：「逆熵歸還理論・草稿」。'},
  {n:'萊恩翻開筆記的瞬間，腰間的音叉自己響了起來。駐波刻度再次浮現——這一次，指向西方。'},
  {who:'ryan',e:'Fork_Gaze',t:'……風暴之環。'},
  {n:'遠處的雪原上，一架蒸氣雪橇正朝要塞衝來。駕駛座上的女孩，遠遠地揮著手。'},
  {who:'lia',e:'Teary_Fierce',t:'哥——！！'},
  {who:'erik',e:'Cry',t:'……莉亞。好冷。……我好想妳。'},
  {who:'claire',e:'Default_Grin',t:'西邊啊……先說好，這次換你負責生火。'},
  {who:'ryan',e:'Cynical_Smirk',t:'……我有名字。'},
 ],
});
/* ---- fixed battles ---- */
function battleC2(id){
  const done=(flag,post,after)=>()=>{P.flags[flag]=1;if(after)after();else{resumeMap();if(post)setTimeout(()=>talkScene(post),300);}};
  const C={
   b1:{theme:'snow',N:7,enemies:[['wolf',1,0],['wolf',3,0],['wolf',5,1]],hgt:[[0,3,1],[1,3,1],[5,4,1],[6,4,1],[6,3,2],[3,2,1]],
     res:[['si',0,5],['oil',6,6],['scrap',2,4],['vent',5,6],['si',4,3]],colTex:'snow',title:'雪原狼群伏擊',onWin:done('b1','b1post'),
     guide:'灰色隆起的格子是岩台。往上爬一層要多花 1 步，從高處攻擊傷害 +25%。克蕾雅在寒冷中會累積寒氣，滿了會凍僵（AP −1），靠近蒸氣閥就能解凍。'},
   b2:{theme:'glacier',N:7,enemies:[['frostguard',2,1],['frostguard',4,1],['wolf',6,0]],hgt:[[0,5,1],[6,6,1]],
     res:[['ice',1,2],['ice',2,2],['ice',3,2],['ice',4,2],['ice',5,2],['ice',1,3],['ice',2,3],['ice',3,3],['ice',4,3],['ice',5,3],['ice',2,4],['ice',3,4],['ice',4,4],
       ['wall',0,2],['wall',6,3],['oil',0,6],['scrap',1,5],['si',5,5],['vent',6,5]],colTex:'snow',title:'冰河渡口',onWin:done('b2','b2post'),
     guide:'藍色的冰面會讓人一路滑到撞上東西為止，敵人也一樣。用「震盪重錘」把敵人打上冰面，撞牆會多受傷害（腕部兵裝可在整備基地換成打樁機）。萊恩可以分解冰面取得 H₂O×2。'},
   b3:{theme:'fortress',N:7,enemies:[['turret',1,1],['turret',5,1],['frostguard',2,2],['frostguard',4,2]],hgt:[[1,1,2],[5,1,2],[0,0,1],[6,0,1]],
     res:[['scrap',0,4],['si',6,4],['al',1,5],['oil',5,6],['vent',0,6],['wall',2,4],['wall',4,4]],colTex:'fstone',title:'東塔城牆',onWin:done('b3',null,()=>{enterMap('fortress',{pos:[34,18.6]});setTimeout(()=>talkScene('b3post'),300);}),
     guide:'砲台站在 2 層高台上，高低差超過 1 層時近戰打不到。萊恩把錨點刻在砲台旁邊，用 #R16 升起岩柱，克蕾雅就能爬上去。石牆可以擋住砲擊。'},
   b4:{theme:'vault',N:7,enemies:[['crystal',1,1],['crystal',3,1],['crystal',5,1],['turret',3,0]],hgt:[[3,0,1]],
     res:[['ice',2,3],['ice',3,3],['ice',4,3],['al',6,5],['scrap',0,4],['oil',5,6],['vent',0,6],['si',6,3]],colTex:'frost',title:'記憶庫走廊',onWin:done('b4','b4post'),
     guide:'冰晶化士兵只能制伏，不能殺。用三個錨點框住他們發動 #R17 冰晶稜鏡陣：185 傷害，全隊還會得到稜鏡護盾（下一次受傷減半，並把傷害反彈回去）。'},
   boss:{theme:'vault',N:9,bigBoss:true,enemies:[['colossus',4,1],['crystal',1,2],['crystal',7,2]],hgt:[[0,4,1],[1,4,1],[7,4,1],[8,4,1],[0,3,2],[8,3,2]],
     res:[['si',0,7],['si',8,6],['scrap',2,6],['scrap',6,6],['oil',1,8],['oil',7,8],['al',3,7],['vent',0,8],['vent',8,8],['vent',4,5],['ice',3,3],['ice',5,3],['ice',4,4]],colTex:'frost',title:'擺鐘室・永凍鍾擺',
     onWin:()=>{P.flags.boss=1;resumeMap();setTimeout(()=>playScene(SCENES.bossPost,()=>{enterMap('fortress',{pos:[22,22]});setTimeout(()=>playScene(SCENES.c2end,chapter2End,{keep:true,actors:exActors()}),300);},{keep:true,actors:exActors()}),300);},
     guide:'鍾擺每兩回合會橫掃一整列，讓那一列結冰並凍傷站在線上的人。血量剩一半時會暴走，大片地面結凍。它的外裝甲很厚：先用 #R10 鋁熱劑、強酸或打樁機削甲，再集中火力。'},
  };
  const c=C[id];return Object.assign({cold:true,explore:false},c);
}
{const o=startBattle;startBattle=function(cfg){o(cfg);if(cfg.bigBoss){song('boss');banner('第二章',cfg.title);}};}
/* auto events that start a fixed battle */
{const o=runEvent;runEvent=function(ev){
  if(ev.battle){X.target=null;X.keys={};$('ex-act').hidden=true;const go=()=>{fx('flash');setTimeout(()=>startBattle(ev.battle()),500);};
    if(ev.pre)playScene(SCENES[ev.pre],go,{keep:true,actors:exActors()});else go();return;}
  return o(ev);};}
/* ---- chapter flow ---- */
const CH2_KEY='iron-ash-ch2';
function ch2Equip(){['R17','R16'].forEach(id=>{if(!save.equip.includes(id)){if(save.equip.length>=4)save.equip.pop();save.equip.unshift(id);}});persist();}
function enterChapter2(){CHAPTER=2;P.flags.ch2=1;}
function startCh2(){
  let snap=null;try{snap=JSON.parse(localStorage.getItem(CH2_KEY)||'null');}catch(e){}
  resetParty();
  if(snap&&snap.lv){Object.assign(P,JSON.parse(JSON.stringify(snap)));P.flags=Object.assign({},snap.flags||{});}
  else{P.lv={ryan:{lv:5,exp:0},claire:{lv:5,exp:0}};P.owned=['amulet','bracer','fork'];P.gear={ryan:'fork',claire:'bracer'};P.items={bandage:3,coffee:1,capsule:1};P.stash={Fe:1,C:1};}
  ['frostport','glacier','fortress','vault'].forEach(m=>{Object.keys(P.flags).forEach(k=>{if(k.startsWith('ev_'+m+'_')||k===m+'_in')delete P.flags[k];});});
  ['c2tavern','lia','b1','b2','b3','b4','boss','office','erik','ftclinic','tut_cold'].forEach(k=>delete P.flags[k]);
  syncMax();healParty(1);enterChapter2();ch2Equip();
  playScene(SCENES.c2train,()=>{enterMap('frostport');setTimeout(()=>toast('第二章解鎖了手札 #R16 地殼隆起、#R17 冰晶稜鏡陣，已自動裝入。可在「背包・整備」調整。'),1200);});
}
{const o=enterMap;enterMap=function(id,opts={}){if(MAPS[id]&&MAPS[id].ch===2)enterChapter2();return o(id,opts);};}
{const o=chapterEnd;chapterEnd=function(){
  try{localStorage.setItem(CH2_KEY,JSON.stringify({ryan:P.ryan,claire:P.claire,stash:P.stash,flags:{tut_move:1,tut_enc:1},lv:P.lv,gear:P.gear,items:P.items,owned:P.owned}));}catch(e){}
  o();const card=document.querySelector('#ov .card');if(!card)return;const note=card.querySelector('.note');if(note)note.textContent='你的等級、飾品與道具會帶進第二章。';
  const row=card.querySelector('.row'),b=document.createElement('button');b.className='btn primary';b.id='ce-2';b.textContent='進入第二章';row.prepend(b);
  const t=$('ce-t');if(t)t.classList.remove('primary');b.onclick=()=>{$('ov').innerHTML='';startCh2();};};}
function chapter2End(){
  save.cleared2=true;persist();clearRun();show('title');
  $('ov').innerHTML=`<div class="overlay"><div class="card frame"><span class="t-eyebrow">CHAPTER 2 COMPLETE</span><h3>第二章　完</h3>
   <p>三百多名士兵的情緒回到了他們身上。克蕾雅想起了救她的人，也知道了萊恩的謊。亞伯特的筆記和音叉，一起指向西方的「風暴之環」。</p>
   <p class="note">第三章（強風、浮空與電磁）製作中。#R18、#R19 將在第三章解鎖。</p>
   <div class="row"><button class="btn primary" id="c2-t">回到標題</button><button class="btn" id="c2-b">再戰永凍鍾擺</button></div></div></div>`;
  $('c2-t').onclick=()=>{$('ov').innerHTML='';};
  $('c2-b').onclick=()=>{$('ov').innerHTML='';enterChapter2();const c=battleC2('boss');c.onWin=()=>chapter2End();openBase(()=>startBattle(c),'出擊：擺鐘室');};
}
{const b=$('m-ch2');if(b)b.onclick=()=>startCh2();}
