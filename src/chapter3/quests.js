/* ======================= CHAPTER 3 — side story 「十三號」 + two small requests ======================= */
QUESTS.push(
 {id:'c3thirteen',ch:3,map:'dock',title:'十三號',where:'高斯港各處',act:'第十三號採掘聚落的痕跡散落在風暴之環。找齊五條線索。',done:'亞伯特來自第十三號聚落。'},
 {id:'c3lens',ch:3,map:'gauss',title:'信號燈的透鏡',where:'碼頭・下城區・礦坑',act:'米菈的信號燈少了 3 片黃銅透鏡。找到後交給燈塔的米菈。',done:'米菈的燈又能打出完整的燈語了。'},
 {id:'c3bp',ch:3,map:'gauss',title:'被吹走的設計圖',where:'磁軌礦坑',act:'蕾溫的城帆設計圖被風吹進了礦坑。找到後交還給她。',done:'蕾溫用新的城帆把整座城扶正了一點。'});
Object.assign(GEAR,{
 lampcharm:{name:'信號燈片護符',who:'ryan',hp:25,desc:'HP +25。米菈用多出來的透鏡磨成的護符，迎著光會打出「平安」的燈語。'},
 watch13:{name:'十三號的懷錶',who:'claire',hp:20,atk:10,desc:'HP +20、攻擊 +10。停在一點十三分的懷錶。巴托說，該有人把它帶出風暴了。'},
 sailcloth:{name:'城帆布斗篷',who:'claire',hp:35,desc:'HP +35。蕾溫用城帆的邊角料縫的斗篷，風再大也吹不透。'},
});
/* ---- 十三號 clues ---- */
const C3_CLUE={
 1:[{n:'登記簿的紙頁被潮氣泡得發皺。萊恩一頁一頁往前翻，翻到二十年前。'},
    {n:'「入港登記：移民船『第十三號』。出發地：第十三號採掘聚落。乘客：礦工十三戶，共四十一人。」'},
    {who:'claire',e:'Neutral',t:'第十三號採掘聚落……在哪裡聽過。'},
    {who:'ryan',e:'Fork_Gaze',t:'奧姆鎮最早的名字。水塔上寫著，鎮公所的鐘也停在一點十三分。',if:'egg_tank'},
    {who:'ryan',e:'Fork_Gaze',t:'……奧姆鎮最早就叫這個名字。',ifnot:'egg_tank'}],
 2:[{n:'老礦工坐在門檻上，一遍一遍地打開懷錶，又闔上。看到你們走近，他把懷錶遞了過來。'},
    {n:'錶針停在一點十三分。錶蓋內側刻著一行小字：「第十三號採掘聚落・第七坑道」。'},
    {who:'oldminer',e:'Neutral',t:'（他用粉筆在地上寫）「二十年前，奧姆的礦坑塌了。一點十三分。我們剩下的人搬來這裡。」'},
    {who:'oldminer',e:'Neutral',t:'（又寫）「有個小男孩，爸爸被埋在裡面。他每天都坐在坑口，對著石頭說話。後來一個戴圓眼鏡的教授把他帶走了。」'},
    {who:'claire',e:'Memory_Headache',t:'圓眼鏡的教授……霍華德教授？'},
    {who:'ryan',e:'Fork_Gaze',t:'奧姆鎮那個咳嗽的老礦工，也說過一樣的話。',if:'q_miner'}],
 3:[{n:'坑壁上刻著一排很深的字，被磁鐵礦的粉末填得發黑。'},
    {n:'「鐵與灰，可以等價交換——」'},
    {n:'後半句被一塊崩落的岩石擋住了。'},
    {who:'ryan',e:'Fork_Gaze',t:'……「人心不在可議價之列」。奧姆鎮雕像背後刻的，就是後半段。',if:'egg_statue'},
    {who:'claire',e:'Neutral',t:'鐵與灰可以等價交換，人心不在可議價之列……這是礦工們的誓言。',if:'egg_statue'},
    {who:'ryan',e:'Fork_Gaze',t:'這是一句誓言的前半段。後半段……也許刻在別的地方。',ifnot:'egg_statue'}],
 4:[{n:'（礦工名冊被撕掉的那一頁，只剩裝訂線旁的半個「A」。）'},{who:'ryan',e:'Fork_Gaze',t:'第十三號聚落的名冊。被撕掉的那頁……姓 A 開頭。'}],
 5:[{n:'第 13 號錨鏈的鐵環上，有人用釘子刻了一個小小的圖案。'},
    {n:'是一把音叉。刻痕很淺、歪歪扭扭，看得出是小孩子的手筆。旁邊還有一個字母：「A」。'},
    {who:'claire',e:'Hurt',t:'音叉……跟你那把一模一樣。'},
    {who:'ryan',e:'AshEye_Overload',t:'……這把音叉，是霍華德教授給我的。他說，是「一個學生留下來的」。'}],
};
function c3Clue(n){const key='c3c'+n,first=!P.flags[key];
  if(!first&&n!==4){say([{n:['','登記簿上那一頁，萊恩已經記住了。','老礦工又把懷錶打開、闔上。','「鐵與灰，可以等價交換——」','','錨鏈上的小音叉，被雨洗得發亮。'][n]}]);return;}
  if(first&&!Q('c3thirteen'))P.flags['q_c3thirteen']=1;
  const L=C3_CLUE[n].filter(l=>(!l.if||P.flags[l.if])&&(!l.ifnot||!P.flags[l.ifnot]));
  const run=()=>{P.flags[key]=1;const got=[1,2,3,4,5].filter(i=>P.flags['c3c'+i]).length;
    if(first)setTimeout(()=>toast(`支線「十三號」線索 ${got}/5`),300);
    if(got===5&&!P.flags.c3_13){P.flags.c3_13=1;qDone('c3thirteen');const k=addLoot('watch13');setTimeout(()=>toast(`五條線索都齊了。取得 ${k}。`),1400);}};
  if(n===4){run();return;}
  say(L,run);}
/* ---- 米菈的透鏡 ---- */
function c3Lens(where){const key='c3lens'+where;if(P.flags[key]){toast('這裡已經找過了。');return;}
  P.flags[key]=1;const n=['D','G','M'].filter(w=>P.flags['c3lens'+w]).length;sfx('ui');toast(`撿到黃銅透鏡（${n}/3）`);
  if(Q('c3lens')!==2&&!Q('c3lens'))P.flags['q_c3lens']=1;}
function c3MilaTalk(){const n=['D','G','M'].filter(w=>P.flags['c3lens'+w]).length;
  if(Q('c3lens')===2){say([{who:'mila',e:'Smile',t:P.flags.boss3?'……我的聲音，好奇怪。可是我好喜歡。':'（燈光：長、短、長）——平安。'}]);return;}
  if(n>=3){say([{who:'mila',e:'Surprised',t:'（燈光瘋狂地閃）三片！全部！'},{n:'米菈把透鏡一片一片裝回燈罩。燈塔的光一下子變得又白又亮，直直射穿了雨幕。'},
    {who:'mila',e:'Teary_Fierce',t:'（黑板）「多的這片，給你們。磨成護符。」'}],()=>{qDone('c3lens');const k=addLoot('lampcharm');toast(`取得 ${k}。`);});return;}
  if(!Q('c3lens')){say([{who:'mila',e:'Neutral',t:'（黑板）「燈少了三片透鏡，燈語打不清楚。被雷打下來的時候掉到城裡各處去了。」'},
    {who:'mila',e:'Neutral',t:'（黑板）「碼頭、街上、礦坑。如果看到黃銅色的圓片……」'},{who:'claire',e:'Default_Grin',t:'包在我們身上。'}],()=>{P.flags['q_c3lens']=1;qBadge&&qBadge(1);toast('新委託：信號燈的透鏡');});return;}
  say([{who:'mila',e:'Neutral',t:`（燈光）透鏡……${n}/3。`},{who:'mila',e:'Neutral',t:!P.flags.b3?'（黑板）「礦坑的升降籠在城南。」':!P.flags.r19?'（黑板）「去城帆工坊找蕾溫奶奶。她什麼都會。」':'（黑板）「塔門在城北。小心風。」'}]);}
/* ---- 蕾溫：工坊（R18/R19）+ 設計圖 ---- */
function c3Blueprint(){if(P.flags.c3bpgot){toast('捲軸已經收起來了。');return;}P.flags.c3bpgot=1;
  say([{n:'一捲被風吹到角落的設計圖，上面畫著巨大的帆布翼，邊角簽著「L.」。'},{who:'claire',e:'Default_Grin',t:'這個……是不是城帆工坊的東西？帶回去還給她吧。'}],()=>{if(!Q('c3bp'))P.flags['q_c3bp']=1;toast('取得「城帆設計圖」。');});}
function c3LewinTalk(){
  if(P.flags.lab&&!P.flags.r19){playScene(SCENES.workshop,()=>{P.flags.r18=P.flags.r19=1;ch3Equip(['R19','R18']);backToMap();
      setTimeout(()=>toast('解鎖手札 #R18 勞倫茲力・電磁軌道砲、#R19 伯努利・暴風氣旋障壁，已自動裝入。'),400);},{keep:true,actors:exActors()});return;}
  if(P.flags.c3bpgot&&Q('c3bp')!==2){say([{who:'lewin',e:'Hurt',t:'（黑板上的字抖了一下）「……我的設計圖。我以為再也找不回來了。」'},
      {who:'lewin',e:'Smile',t:'（黑板）「拿著。用城帆的邊角料縫的。風再大也吹不透。」'}],()=>{qDone('c3bp');const k=addLoot('sailcloth');giveMoney(80);toast(`取得 ${k}、80 ${MK}。`);});return;}
  if(!P.flags.lab){say([{who:'lewin',e:'Neutral',t:'（老太太頭也不抬，在黑板上寫字）「要上塔？先去把礦坑的電切了。線圈沒電，風才會小一點。」'},
      {who:'lewin',e:'Neutral',t:'（又寫）「還有，看到一捲畫著帆的設計圖，幫我撿回來。上個月被風吹進礦坑了。」'}],()=>{if(!Q('c3bp'))P.flags['q_c3bp']=1;});return;}
  say([{who:'lewin',e:'Cynical_Smirk',t:'（黑板）「還在這幹嘛？塔在北邊。」'}]);}
/* ---- 煤灰 cameo ---- */
function c3Cat(){const seen=P.flags.egg_cat;
  say(seen?[{n:'屋簷下蹲著一隻黑貓。脖子上沒有鈴鐺——鈴鐺在克蕾雅的工具包裡。'},{who:'claire',e:'Default_Grin',t:'……煤灰？你怎麼跑到這麼遠的地方來？'},
      {n:'黑貓「喵」了一聲。在這座沒有聲音的城裡，那聲音清楚得不可思議。'},{who:'ryan',e:'Fork_Gaze',t:'……貓的聲音沒被拿走。'}]
    :[{n:'屋簷下蹲著一隻黑貓，正在舔爪子。'},{n:'牠「喵」了一聲。在這座沒有聲音的城裡，那聲音清楚得不可思議。'},{who:'ryan',e:'Fork_Gaze',t:'……貓的聲音沒被拿走。'}]);}
