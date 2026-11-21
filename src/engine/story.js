/* ======================= SCRIPT ======================= */
const NAMES={ryan:'萊恩',claire:'克蕾雅',vera:'薇拉（水銀）',howard:'霍華德教授',marta:'礦工之妻・瑪塔',tim:'男孩・提姆',miner:'礦工',hans:'礦工・漢斯',guard:'憲兵隊長'};
const SCENES={
 prologue:[
  {loc:'場景 0-1｜中央學院城・地下零號共振爐　三年前・11 月 11 日',set:'reactor',cast:{ryan:[-2.2,.6,1],claire:[1.8,.6,-1],howard:[3.2,.2,-1]},fx:'shake'},
  {n:'警報與蓋革計數器般的咔噠聲。直徑十公尺的零號逆熵共振爐正發生紫白色的空間扭曲。霍華德教授倒在控制台前，胸口中了一槍。'},
  {who:'howard',e:'Hurt',t:'萊恩……別算了！亞伯特抽走了爐心的阻尼棒，他想引爆零號爐，把整座學院城三十萬人的記憶結晶化來收集樣本！快帶著克蕾雅從排氣井逃走……'},
  {who:'ryan',e:'Combat_Roar',t:'逃不掉的，老師！距離臨界只剩二十秒。只要在主接地端接入一個有分子解析腦波的「活體電阻」，配合這支逆相音叉對沖頻率，就能把爆炸壓縮在這個房間裡！'},
  {who:'claire',e:'Teary_Fierce',t:'萊恩！！你瘋了嗎？！用肉體當接地電阻，你的大腦跟內臟會在一秒鐘內全部結晶化的！給我放手——！！'},
  {n:'萊恩左手握住赤紅發亮的接地桿，右手把黑銀音叉敲在爐心外殼上。',fx:'flash',move:{ryan:[-.9,.2]}},
  {n:'嗡————！！灰白色的結晶波順著他的左臂狂湧而上，左眼在半秒內失去所有色彩。克蕾雅撲上去想把他撞開，次級結晶波正面掃過她的右臂。',fx:'shake',move:{claire:[.1,.3]}},
  {who:'claire',e:'Memory_Headache',t:'啊——！！我的右手變成石頭了……好冷……腦袋裡好冷……躺在地上那個流血的男人是誰？'},
  {who:'ryan',e:'AshEye_Overload',t:'給我……停下來啊啊啊——！！'},
  {n:'一聲琉璃碎裂般的巨響。強光吞沒了一切。',fx:'flash'},
  {loc:'場景 0-2｜前往東部礦區奧姆鎮的裝甲列車　現在',set:'train',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'規律的鐵軌聲。萊恩輕敲音叉，清越的 440 赫茲泛音在車廂裡迴盪，胸前的黃銅差動氣壓計微微顫動。'},
  {who:'claire',e:'Default_Grin',t:'喂，少校大人，別再敲你那支破音叉了，聽得我右肩那塊「石頭」又開始發麻。三年前全實驗室就活下來我們兩個——你的左眼變成人形顯微鏡，我卻少了一隻手，還忘了自己老爸長什麼樣子。'},
  {who:'ryan',e:'Default_Cold',t:'妳右肩那塊記憶結晶的分子結構很穩定。只要找到當年被抽走的原始阻尼波長，我就能把它解凍。在那之前，別隨便把機械鎧的蒸氣壓力開到紅線區，准尉。'},
  {who:'claire',e:'Angry_Steam',t:'安啦！本小姐自己打造的赫菲斯托斯，公差不到千分之一毫米！倒是奧姆鎮的礦工失聯了一個禮拜，葛蘭將軍卻只派我們兩個人來查——這裡面肯定有鬼。'},
  {who:'ryan',e:'Cynical_Smirk',t:'葛蘭上將沒有三倍的利益連眼皮都不會抬。他把我們支開首都，要嘛這裡藏著他不想讓憲兵隊知道的東西，要嘛他根本不希望我們回去。'},
  {n:'列車緊急煞車。窗外數十名眼神空洞、掛著詭異微笑的礦工動作整齊劃一，用焊槍切割車門。',fx:'shake'},
  {who:'ryan',e:'AshEye_Overload',t:'……不是罷工暴動。克蕾雅，看他們的眼睛——痛覺神經跟近期記憶都被抽乾了。是一群被挖空腦子的「工蜂」。'},
  {n:'車門被切開。兩名礦工推倒貨箱堵住走道，舉著鶴嘴鋤一步步逼近。',move:{ryan:[-1.6,-.2],claire:[.4,-.2]}},
  {who:'claire',e:'Angry_Steam',t:'要打嗎？'},
  {who:'ryan',e:'Default_Cold',t:'他們是被抽乾的普通人，不准下死手。打到站不起來就好——用拳頭解決。'},
 ],
 trainOut:[
  {loc:'場景 0-3｜貨運月台',set:'train',cast:{ryan:[-1,-.4,1],claire:[1,-.4,-1],miner:[0,.9,1]}},
  {n:'礦工倒在地上，嘴裡還在念著「要挖……要挖……」。萊恩蹲下來，翻開他的眼皮。'},
  {who:'ryan',e:'AshEye_Overload',t:'瞳孔對光沒有反應，痛覺神經的電位幾乎是零。不是藥物……是被「抽走」的。'},
  {who:'claire',e:'Angry_Steam',t:'抽走？抽去哪裡了？'},
  {who:'ryan',e:'Fork_Gaze',t:'……音叉在響。附近有某種高純度的東西，在 440 赫茲上共鳴——跟三年前爐心的頻率一模一樣。'},
  {who:'claire',e:'Memory_Headache',t:'三年前……嘖，又是那個。每次你一提，我右肩就像被冰錐扎一樣。'},
  {n:'列車停在奧姆鎮外的貨運月台。兩人背起行李，走進下著酸雨的礦業小鎮。'},
 ],
 townIn:[
  {loc:'奧姆鎮・礦工街'},
  {n:'整條街安靜得可怕。礦工們排成一列，面帶微笑走向鎮北的第三蒸氣機庫，連酸雨打在臉上都不眨眼。'},
  {who:'claire',e:'Hurt',t:'……這是什麼地獄景象。'},
  {who:'ryan',e:'Default_Cold',t:'先找鎮上還清醒的人問清楚。機庫在北邊，正門一定有人守著。'},
 ],
 marta:[
  {who:'marta',e:'Hurt',t:'你們是中央來的？……求求你們。我丈夫上禮拜被叫去第三機庫做「體檢」，回來以後就不認得我了。他每天只會笑，手被礦車夾斷了也在笑。'},
  {who:'claire',e:'Teary_Fierce',t:'……我們會把他找回來的。'},
  {who:'marta',e:'Hurt',t:'機庫正門有憲兵守著，誰都進不去。礦工們私下說，地下排水道可以通到機庫後面——入口在鎮東的水塔底下。'},
  {who:'ryan',e:'Default_Cold',t:'鎮東的水塔。謝謝妳，太太。'},
 ],
 tim:[
  {who:'tim',e:'Neutral',t:'大哥哥，你們是軍人嗎？我爸爸在機庫裡面，他說做完這一批工，就有錢買新鞋子給我……他已經七天沒回家了。'},
  {who:'ryan',e:'Fork_Gaze',t:'你爸爸叫什麼名字？'},
  {who:'tim',e:'Happy',t:'漢斯！礦坑裡挖煤最快的就是他！你們看到他，跟他說提姆在等他！'},
  {who:'claire',e:'Default_Grin',t:'交給我們。等我們把你爸爸拎回來，新鞋子讓他買兩雙。'},
 ],
 dazed:[{n:'礦工面帶微笑，盯著空無一物的牆壁。'},{who:'miner',e:'Smile',t:'要挖……要挖……不痛……一點都不痛……'},
  {who:'claire',e:'Hurt',t:'他的指甲全裂開了……真的一點都不痛嗎？'}],
 notice:[{n:'告示：「奉第七裝甲師團長葛蘭上將令，奧姆鎮全體礦工即日起分批至第三蒸氣機庫，接受工業效率體檢。拒絕者以違抗軍令論處。」'},
  {who:'ryan',e:'Cynical_Smirk',t:'「工業效率」。葛蘭的用詞永遠這麼體面。'}],
 sewerIn:[
  {loc:'奧姆鎮・地下強酸水道'},
  {n:'刺鼻的綠煙從生鏽的鐵管裡冒出來。水道裡流的不是水，是抽取站排出的強酸廢液。'},
  {who:'claire',e:'Angry_Steam',t:'嗚，這味道……機械鎧的關節要是泡到這個，我會哭。'},
  {who:'ryan',e:'Default_Cold',t:'跟著我走，別碰綠色的水。水道裡還有清道機在巡邏。'},
 ],
 acidBlock:[{n:'一道冒著泡的強酸渠橫在路中間，寬度跳不過去。'},
  {who:'ryan',e:'Default_Cold',t:'旁邊那根石灰岩柱可以用。先調查它。'}],
 limestone:[
  {who:'ryan',e:'AshEye_Overload',t:'石灰岩，主成分碳酸鈣。CaCO₃ 碰到強酸會中和成鹽、水和二氧化碳。'},
  {who:'ryan',e:'Combat_Roar',t:'分解它丟進酸渠，再用兩點拉一座高碳鋼橋。量得準、拆得開、裝得回去。'},
  {n:'岩柱化成白色粉末灑進酸渠，嘶嘶冒出大量氣泡。酸液退成淡黃色，一座鋼橋從兩岸拔起。',fx:'flash'},
  {who:'claire',e:'Default_Grin',t:'每次看你做這個都覺得很犯規。'},
 ],
 clinic:[
  {loc:'地下強酸水道・廢棄診療室'},
  {n:'桌上散落著幾十支用過的腦波抽取針頭。抽屜裡壓著一張泛黃的字條，還有一個生鏽的餅乾鐵盒。'},
  {who:'ryan',e:'Fork_Gaze',t:'（這個筆跡……）「奧姆鎮的蒸氣機根本不在發電。他們在抽取工人的記憶與痛覺，提煉一種名為記憶琥珀的演算燃料。」'},
  {n:'克蕾雅打開鐵盒。裡面是一張黑白合照：中間戴圓框眼鏡的男人摟著一對少年少女，三人都在笑。'},
  {who:'claire',e:'Default_Grin',t:'咦，這不是我們兩個嗎？萊恩你那時候好臭屁……奇怪，站在我們中間的這個大叔是誰？為什麼我看著他——'},
  {who:'claire',e:'Memory_Headache',t:'……頭好痛……右肩的石頭在發燙……萊恩，我的腦袋裡像被挖走了一大塊齒輪……你是不是有什麼事瞞著我？'},
  {who:'ryan',e:'Fork_Gaze',t:'……那是以前研究院的霍華德主任。三年前死於礦坑瓦斯爆炸，妳當時受了腦震盪，想不起來很正常。'},
  {n:'萊恩把照片收進大衣內袋，動作很輕，沒有讓克蕾雅看見他的手在抖。'},
  {who:'ryan',e:'Default_Cold',t:'別勉強自己，准尉。答應過妳的，不管是少掉的手還是記憶，我都會一樣一樣拿回來。'},
 ],
 yardIn:[
  {loc:'第三蒸氣機庫・後方貨運場'},
  {n:'水道盡頭的鐵梯通往機庫後方的貨運場。巨大的冷卻塔冒著暗紅色的煙，空氣裡有一股甜膩的油味。'},
  {who:'claire',e:'Angry_Steam',t:'聞到了嗎？像燒焦的蜂蜜。'},
  {who:'ryan',e:'AshEye_Overload',t:'是記憶琥珀。濃度高到灰瞳都看得見它在空氣裡的軌跡。'},
 ],
 guardsPre:[
  {who:'guard',e:'Neutral',t:'站住！第三機庫奉葛蘭上將令全面封鎖，任何人——'},
  {who:'ryan',e:'Default_Cold',t:'中央特務測算少校，萊恩・維斯。我有權調查聯邦境內所有工業設施。'},
  {who:'guard',e:'Smile',t:'……少校？上將交代過，如果中央派人來，就讓他們「永遠留在奧姆鎮」。動手！'},
 ],
 guardsPost:[
  {who:'guard',e:'Hurt',t:'我……我只是奉命看門。裡面在做什麼，我真的不知道。只知道每天進去一百個人，出來的都在笑。'},
  {who:'claire',e:'Angry_Steam',t:'滾回去告訴你的上將，下一個要被拆的就是他。'},
  {n:'憲兵隊長連滾帶爬地逃出貨運場。機庫的後門在冷卻塔旁，門縫透出金紅色的光。'},
 ],
 hangar:[
  {loc:'場景 1-2｜第三蒸氣機庫',set:'hangar',cast:{ryan:[-2.6,1.4,1],claire:[-1.3,1.6,1],vera:[1.2,-.6,-1]}},
  {n:'機庫中央矗立著離心式記憶抽取塔。金紅色的黏稠液體順著玻璃管匯入儲油槽，數百名礦工戴著頭盔坐在椅子上，一動也不動。'},
  {who:'vera',e:'Smile',t:'看看這些礦工，以前每天為了工資爭吵不休，多麼混亂啊。我們幫他們把痛苦的記憶抽出來，他們成了不會痛的快樂工蜂；而這台裝了五百名鐵匠記憶的機甲，擁有了宗師級的戰鬥反應——這不是最完美的工業升級嗎，萊恩少校？'},
  {who:'claire',e:'Angry_Steam',t:'把活生生的人當成榨油的芝麻，還敢說什麼工業升級？！老娘今天就把妳連同那台破銅爛鐵一起拆成廢料！！'},
  {who:'vera',e:'Smile',t:'真粗魯的小姑娘，難怪會把自己的右手弄丟呢。想救這些礦工的話，就先陪這孩子玩玩吧。'},
  {n:'ヴェラ化成一灘水銀鑽進通風管。重裝蒸氣警衛機甲亮起紅眼，開始沿著機庫來回巡邏。',hide:['vera']},
  {who:'ryan',e:'AshEye_Overload',t:'它正面是高碳複合裝甲，硬砍沒用。克蕾雅，趁它背對妳的時候繞到後面，砸爛那個藍色的高壓冷卻水箱，讓地面鋪滿積水。我分解兩側的廢鐵連出三角陣，用高壓電解把它炸開。'},
  {who:'claire',e:'Default_Grin',t:'水箱交給我，陣法交給你。出發前先讓我檢查一下手臂的配裝！'},
 ],
 ch1b:[
  {loc:'場景 1-3｜記憶回流與音叉共鳴',set:'aftermath',cast:{ryan:[-1.1,.8,1],claire:[1.1,.8,-1]},fx:'shake'},
  {n:'機甲在氣爆中解體。ヴェラ在遠處引爆了抽取塔的洩壓閥，高溫強酸蒸氣即將灌進底層的礦工拘留區。機甲殘骸裡滾出一枚完好的核心記憶琥珀。'},
  {who:'ryan',e:'Fork_Gaze',t:'這枚核心琥珀裡有完整的逆向解晶波長。現在接進妳右肩，妳父親的記憶馬上就能解凍。但要救底下五百個礦工，我得把它投進抽取塔逆轉幫浦——琥珀會當場燒毀。'},
  {choice:'amber'},
 ],
 ch1self:[{who:'claire',e:'Teary_Fierce',t:'你在說什麼傻話！'},{n:'克蕾雅一腳把琥珀踢回萊恩手裡。'}],
 ch1end:[
  {who:'claire',e:'Teary_Fierce',t:'我老爸要是看到我為了自己的記憶，讓五百個人一輩子當沒有靈魂的傻子，他就算從棺材裡爬出來也會拿扳手敲死我！給我扔進去，少校！！'},
  {n:'萊恩把琥珀拍進抽取塔基座。金紅色的記憶光流倒灌回礦工腦中，他們一個接一個抱著頭醒過來。',fx:'flash'},
  {n:'琥珀燒毀的最後一瞬間，音叉受到次聲波共鳴，表面浮現一段只有灰瞳看得見的駐波刻度。'},
  {who:'ryan',e:'Fork_Gaze',t:'……指向北方。白銀之顎要塞。'},
 ],
 epilogue:[
  {loc:'奧姆鎮・礦工街　隔天清晨',set:'dawn',cast:{ryan:[-2.6,.6,1],claire:[-1.5,.8,1],tim:[1.2,.2,1],hans:[2.2,.2,-1],marta:[3.3,-.2,-1]}},
  {n:'酸雨停了。礦工們一個接一個走出機庫，揉著眼睛，好像剛從很長的夢裡醒來。'},
  {who:'hans',e:'Hurt',t:'提姆……？你怎麼一個人站在這裡……鞋子呢？'},
  {who:'tim',e:'Cry',t:'爸爸！！'},
  {n:'男孩撲進父親懷裡。漢斯抱著他，終於感覺到被礦車夾傷的手在痛，眼淚掉了下來——因為痛，也因為高興。',move:{tim:[1.8,.2]}},
  {who:'claire',e:'Blush_LookAway',t:'……會痛，才是活著啊。'},
  {who:'marta',e:'Happy',t:'少校、准尉——謝謝你們。這個鎮欠你們一條命，不，是五百條。'},
  {who:'ryan',e:'Fork_Gaze',t:'是礦工們自己撐過來的。我們只是把被偷走的東西還回去。'},
  {who:'claire',e:'Default_Grin',t:'那還等什麼，往北走吧。先說好，北方很冷，我的手臂要是凍住了，你負責烤火。'},
 ],
};

/* ======================= STORY ENGINE ======================= */
const S={list:[],i:0,onEnd:null,typing:false,full:'',actors:{},keep:false};
let typeTimer=null;
const CHOICES={
 amber:[{t:'把琥珀接入克蕾雅的右肩',then:()=>SCENES.ch1self.concat(SCENES.ch1end)},{t:'把琥珀投入抽取塔逆轉幫浦',then:()=>SCENES.ch1end}],
};
function buildSet(name){clearWorld();S.actors={};SETS[name]();E.fxs.push(dt=>{Object.values(S.actors).forEach(s=>{if(s.target)s.holder.position.lerp(s.target,Math.min(1,dt*3));});});}
function applyCast(cast){Object.entries(cast).forEach(([k,[x,z,dir]])=>{const s=charSprite(k);s.holder.position.set(x,0,z);s.face(dir||1);s.target=s.holder.position.clone();E.world.add(s.holder);S.actors[k]=s;});}
function applyStage(L){if(L.set){E.mode='scene';buildSet(L.set);}if(L.cast)applyCast(L.cast);if(L.move)Object.entries(L.move).forEach(([k,[x,z]])=>{const s=S.actors[k];if(s)s.target=new THREE.Vector3(x,0,z);});
  if(L.hide)L.hide.forEach(k=>{const s=S.actors[k];if(s)s.holder.visible=false;});if(L.loc!==undefined)$('st-loc').textContent=L.loc;}
/* opts.keep: play over the current world (exploration), opts.actors maps speakers to existing sprites */
function playScene(list,onEnd,opts={}){
  show('story');S.keep=!!opts.keep;if(opts.actors)S.actors=opts.actors;
  if(!opts.keep)E.mode='scene';
  $('st-loc').hidden=!!opts.keep&&!list.some(l=>l.loc);
  Object.assign(S,{list:list.slice(),i:0,onEnd,typing:false});resize();step();
}
function fx(kind){if(kind==='flash'){const L=$('fxlayer');L.classList.remove('fx-flash');void L.offsetWidth;L.classList.add('fx-flash');}if(kind==='shake')E.shake=1;}
function step(){
  clearInterval(typeTimer);$('st-choices').innerHTML='';
  if(S.i>=S.list.length){const f=S.onEnd;S.onEnd=null;f&&f();return;}
  const L=S.list[S.i];applyStage(L);if(L.loc)$('st-loc').hidden=false;if(L.fx)fx(L.fx);
  if(L.loc&&!L.n&&!L.who&&!L.choice){S.i++;return step();}
  if(L.choice){$('st-name').innerHTML='<b>抉擇</b>';drawFace(null);$('st-text').className='st-text';$('st-text').textContent='';$('st-next').hidden=true;
    (Array.isArray(L.choice)?L.choice:CHOICES[L.choice]).forEach(c=>{const b=document.createElement('button');b.textContent='◆ '+c.t;b.onclick=ev=>{ev.stopPropagation();
      if(c.fn){const f=S.onEnd;S.onEnd=null;S.list=[];c.fn(f);return;}
      S.list=c.then();S.i=0;step();};$('st-choices').appendChild(b);});return;}
  $('st-next').hidden=false;
  if(L.who){$('st-name').innerHTML=`<b>${NAMES[L.who]}</b><span>[${L.e}]</span>`;$('st-text').className='st-text';drawFace(L.who,L.e);const s=S.actors[L.who];if(s)s.hop=1;}
  else{$('st-name').innerHTML='';$('st-text').className='st-text narr';drawFace(null);}
  const txt=L.who?`「${L.t}」`:L.n;S.full=txt;S.typing=true;let k=0;const el=$('st-text');el.textContent='';
  const sp=matchMedia('(prefers-reduced-motion: reduce)').matches?1000:2;
  typeTimer=setInterval(()=>{k+=sp;el.textContent=txt.slice(0,k);if(k>=txt.length){clearInterval(typeTimer);S.typing=false;}},22);
}
function advance(){if($('story').hidden)return;const L=S.list[S.i];if(!L||L.choice)return;if(S.typing){clearInterval(typeTimer);$('st-text').textContent=S.full;S.typing=false;return;}S.i++;step();}
$('st-box').addEventListener('click',advance);
$('st-skip').addEventListener('click',e=>{e.stopPropagation();let j=S.i+1;while(j<S.list.length&&!S.list[j].choice){applyStage(S.list[j]);j++;}S.i=j;step();});

/* ======================= ROUTER ======================= */
function show(id){['title','story','base','battle','explore'].forEach(s=>$(s).hidden=(s!==id));$('ov').innerHTML='';
  if(id==='title'){E.mode='scene';E.controls.enabled=false;buildSet('title');}
  if(id!=='battle')E.controls.enabled=false;
  resize();}
function toast(t){const d=$('toast');d.textContent=t;d.classList.remove('show');void d.offsetWidth;d.classList.add('show');}

/* ======================= BASE CAMP ======================= */
let baseTab='r',baseReturn=null;let CHAPTER=1;
function openBase(onGo,label){baseReturn=onGo||null;$('bc-go').textContent=label||'攜帶目前配裝出擊';
  if(E.mode==='battle'){E.mode='scene';buildSet('title');}show('base');renderBase();}
function renderBase(){
  ['r','w','g'].forEach(t=>$('tab-'+t).setAttribute('aria-selected',baseTab===t));const Bd=$('bc-body');
  if(baseTab==='r'){
    const slots=[0,1,2,3].map(i=>{const r=RBY[save.equip[i]];return `<div class="slot">${r?`<span class="id">#${r.id} · ${SHAPE[r.n]}</span><b>${r.name}</b>`:'<span class="note">空槽：點選配方裝入</span>'}</div>`;}).join('');
    Bd.innerHTML=`<div class="bc-grid"><div><p class="note" style="margin:0 0 10px">點選配方裝入或卸下出擊快捷列（最多 4 招）。灰色配方在之後的章節解鎖；#R15 禁忌配方常駐於戰鬥列，不佔欄位。3 點以上的陣可以直接使用陣內網格的物質。</p>
      <div class="rlist">${RECIPES.map(r=>{const locked=r.ch>CHAPTER,eq=save.equip.includes(r.id),sp=r.id==='R15'||r.id==='R30';
        return `<button class="rcard${eq?' eq':''}" data-r="${r.id}" ${locked||sp?'disabled':''}><div class="top"><span class="id">#${r.id}${locked?` · 第 ${r.ch} 章解鎖`:''}</span><span class="id">${r.ap} AP</span></div>
        <div class="nm">${r.name}</div><div class="meta"><span class="chip">${SHAPE[r.n]}</span>${r.el.map(e=>`<span class="chip el">${ELF[e]||e}</span>`).join('')}</div><div class="ds">${r.desc}</div></button>`;}).join('')}</div></div>
      <aside class="panel frame" style="align-self:start;position:sticky;top:0"><h3>出擊戰術快捷列</h3><div class="slots">${slots}</div>
      <p class="note" style="margin-top:12px">小型遭遇戰的敵人裝甲薄，#R06 電網、#R08 鐵枷能一次控制好幾隻。BOSS 機甲的背部水箱會噴出積水，#R09 把三角陣內的積水電解成氫氧氣雲，再用火銃或 #R07 引爆。</p></aside></div>`;
    Bd.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const id=b.dataset.r,k=save.equip.indexOf(id);if(k>=0)save.equip.splice(k,1);else if(save.equip.length<4)save.equip.push(id);else{save.equip.shift();save.equip.push(id);}persist();renderBase();});
  }else if(baseTab==='g'){renderGear(Bd);
  }else{
    const s=claireStats(save.mods),cap=save.cap,over=s.load>cap;
    Bd.innerHTML=`<div class="bc-grid"><div class="mods">${Object.entries(MODS).map(([k,g])=>`<div class="modrow"><h4>${g.label}</h4><div class="modopts">${g.opts.map(o=>`
      <button class="rcard${save.mods[k]===o.id?' eq':''}" data-k="${k}" data-m="${o.id}"><div class="top"><span class="id">${o.id}</span><span class="id">${o.load} Load</span></div>
      <div class="nm">${o.name}</div><div class="meta">${o.hp?`<span class="chip">HP ${o.hp>0?'+':''}${o.hp}</span>`:''}${o.arm?`<span class="chip">護甲 +${o.arm}</span>`:''}${o.atk?`<span class="chip">攻擊 +${o.atk}</span>`:''}${o.mv?`<span class="chip">移動 ${o.mv>0?'+':''}${o.mv}</span>`:''}</div>
      <div class="ds">${o.skill}</div></button>`).join('')}</div></div>`).join('')}</div>
      <aside class="panel frame" style="align-self:start;position:sticky;top:0"><h3>赫菲斯托斯 Mk.IV</h3>
      <div class="note">神經負荷 <span class="px">${s.load} / ${cap} Load</span>${over?' <b class="warn">超載</b>':''}</div>
      <div class="load${over?' over':''}"><i style="width:${Math.min(100,s.load/1.2)}%"></i><span class="cap" style="left:${cap/1.2}%"></span></div>
      <dl class="stat" style="margin-top:12px"><dt>HP</dt><dd>${s.hp}</dd><dt>護甲</dt><dd>${s.arm}</dd><dt>攻擊</dt><dd>${s.atk}</dd><dt>移動</dt><dd>${s.mv} 格</dd></dl>
      <p class="note" style="margin-top:12px">${over?'<span class="warn">超過上限時，克蕾雅的技能傷害 +30%，但每次施放扣 10 HP。</span>':'在上限內配裝，沒有神經反噬。'}</p>
      ${cap<100?`<p class="note warn">使用過禁忌超載逆構，神經負荷上限降到 ${cap}。</p><button class="btn" id="recal">花一晚重新校準神經（上限回到 100）</button>`:''}</aside></div>`;
    Bd.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{save.mods[b.dataset.k]=b.dataset.m;persist();syncMax();renderBase();});
    const rc=$('recal');if(rc)rc.onclick=()=>{save.cap=100;persist();renderBase();};
  }
}
$('tab-r').onclick=()=>{baseTab='r';renderBase();};$('tab-g').onclick=()=>{baseTab='g';renderBase();};$('tab-w').onclick=()=>{baseTab='w';renderBase();};
$('bc-back').onclick=()=>show('title');
$('bc-go').onclick=()=>{syncClaireMax();const f=baseReturn;baseReturn=null;(f||(()=>show('title')))();};
