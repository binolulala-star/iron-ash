/* ======================= PROLOGUE BRIDGE: infirmary → dream on the train → walkable armored train ======================= */
{const P0=SCENES.prologue,cut=P0.findIndex(l=>l.loc&&l.loc.startsWith('場景 0-2')),amb=P0.findIndex(l=>l.n&&l.n.startsWith('列車緊急煞車'));
 SCENES.prologueA=P0.slice(0,cut);
 SCENES.trainAmbush=[{loc:'裝甲列車・三號貨車',set:'train',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}}].concat(P0.slice(amb));}
SETS.infirmary=function(){
  setFog(0x1c2026,.6);tileFloor(12,6,'plate');
  const wall=block(12,4,.2,0,0,-2.6,new THREE.MeshStandardMaterial({color:0xb8bcb4,roughness:.95}));
  const win=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.6),new THREE.MeshBasicMaterial({color:0xe8f0f8}));win.position.set(.4,2.3,-2.48);E.world.add(win);
  [-1,1].forEach(s=>{const fr=new THREE.Mesh(new THREE.BoxGeometry(.08,1.7,.06),new THREE.MeshStandardMaterial({color:0x6a6a70}));fr.position.set(.4+s*1.24,2.3,-2.46);E.world.add(fr);});
  const cur=new THREE.Mesh(new THREE.PlaneGeometry(1,2.2),new THREE.MeshStandardMaterial({color:0xd8dcd0,side:THREE.DoubleSide,roughness:1}));cur.position.set(-1.4,2,-2.4);E.world.add(cur);
  [[-2.4,-1],[1.6,-1]].forEach(([x,z])=>{block(2.2,.55,1.1,x,0,z,new THREE.MeshStandardMaterial({color:0xd8d8d0}));block(.5,.2,.8,x-.75,.55,z,new THREE.MeshStandardMaterial({color:0xf0f0ea}));
    block(.08,.9,1.1,x-1.1,0,z,new THREE.MeshStandardMaterial({color:0x7a7e86,metalness:.6}));});
  block(.5,.7,.5,-.2,0,-1.6,new THREE.MeshStandardMaterial({color:0x8a7a68}));
  const vase=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,.3,8),new THREE.MeshStandardMaterial({color:0x7aa0c0}));vase.position.set(-.2,.85,-1.6);E.world.add(vase);
  const sun=new THREE.PointLight(0xfff4e0,1.2,10);sun.position.set(.4,2.6,-1.4);E.world.add(sun);
  keyLight(0xfff0e0,.55,[3,8,5]);dustField(60,[-4,0,-2,4,3.5,1],0xfff0d8,.04,.08);
  look(0,2.6,8.6,0,1.1,0);setTilt(.46,2.2);
};
NAMES.howard=NAMES.howard||'霍華德教授';NAMES.glan='將軍・葛蘭';
Object.assign(SCENES,{
 infirmary:[
  {loc:'場景 0-2｜學院城軍醫院　事故後第三天',set:'infirmary',cast:{ryan:[-.4,.4,1],claire:[1.5,-.9,-1]}},
  {n:'消毒水的氣味。窗外的學院城完好無缺，鐘樓照常在正午敲響。'},
  {n:'萊恩坐在病床邊，左眼纏著紗布。紗布底下，世界只剩下灰色的分子格線。'},
  {who:'claire',e:'Memory_Headache',t:'……萊恩？你的眼睛怎麼了……我的右手……為什麼感覺不到我的右手？'},
  {who:'ryan',e:'Fork_Gaze',t:'結晶從手肘一路蔓延到肩膀，醫生只能截掉。……對不起。我沒能把妳推開。'},
  {who:'claire',e:'Teary_Fierce',t:'笨蛋，道什麼歉。你自己都差點變成一尊玻璃雕像了……我們活下來了，對吧？其他人呢？'},
  {who:'ryan',e:'Default_Cold',t:'學院城三十萬人都沒事。只有零號實驗室……霍華德老師沒能出來。'},
  {who:'claire',e:'Neutral',t:'霍華德……？'},
  {n:'克蕾雅歪著頭，眉頭一點一點皺起來，像在翻找一個怎麼都打不開的抽屜。'},
  {who:'claire',e:'Memory_Headache',t:'……那是誰？我應該認識他嗎？為什麼一想到這個名字，肩膀裡的石頭就好冷……'},
  {n:'萊恩的手在膝蓋上握緊。灰瞳裡，他看得一清二楚——克蕾雅右肩殘留的結晶，正緩緩吞掉一段記憶的光。'},
  {who:'ryan',e:'Fork_Gaze',t:'……沒什麼。只是研究院的一位主任。妳撞到頭了，先好好休息。'},
  {n:'這是萊恩對她說的第一個謊。'},
  {n:'病房門口傳來兩下不疾不徐的掌聲。一名佩戴將星的男人倚在門框上。'},
  {who:'glan',e:'Smile',t:'第七裝甲師團長，葛蘭。官方紀錄是：學院地下礦坑瓦斯外洩爆炸。亞伯特下落不明，以叛國罪通緝。'},
  {who:'glan',e:'Smile',t:'維斯同學，你那隻灰瞳現在是國家的財產了。想查出亞伯特在哪裡、想把那位小姐的記憶找回來——就穿上這身軍服，替我工作。'},
  {who:'ryan',e:'Cynical_Smirk',t:'……用三十萬人的命換來的眼睛，借你用可以。但要算利息的，將軍。'},
 ],
 trainWake:[
  {loc:'場景 0-3｜開往東部礦區奧姆鎮的裝甲列車　三年後',set:'train',cast:{ryan:[-1.2,-.6,1],claire:[1.2,-.6,-1]}},
  {n:'……規律的鐵軌聲。'},
  {who:'claire',e:'Default_Grin',t:'——喂，少校大人，醒醒。你又在夢裡敲音叉了，整節車廂都在共振，隔壁那個押車兵差點把咖啡潑到臉上。'},
  {who:'ryan',e:'Fork_Gaze',t:'……抱歉。又夢到那天了。'},
  {who:'claire',e:'Angry_Steam',t:'又是「那天」。每次你一提，我右肩這塊石頭就發麻……算了，反正我也想不起來。'},
  {n:'她轉了轉右肩的機械鎧，黃銅關節吐出一縷細細的蒸氣。'},
  {who:'claire',e:'Default_Grin',t:'快到奧姆鎮了，起來活動一下吧。你的公文袋掉在座位底下了——要我說幾次，機密文件不要拿來當枕頭。'},
 ],
 tOrders:[
  {n:'公文袋裡是一份蓋著第七裝甲師團火漆的命令書。'},
  {n:'「致　中央特務測算少校　萊恩・維斯、技術准尉　克蕾雅：東部礦區奧姆鎮礦工五百名失聯七日，著即前往調查。本案列為機密，不得調用地方憲兵。——第七裝甲師團長　葛蘭」'},
  {who:'ryan',e:'Cynical_Smirk',t:'五百人失聯，派兩個人，還不准動用憲兵。葛蘭上將沒有三倍的利益，連眼皮都不會抬。'},
  {who:'claire',e:'Angry_Steam',t:'所以這裡面肯定有鬼。'},
  {who:'ryan',e:'Default_Cold',t:'要嘛，那裡藏著他不想讓憲兵隊知道的東西。要嘛……他根本不希望我們回去。'},
 ],
 tToolbox:[
  {n:'克蕾雅的工具箱。最上層壓著一疊捲邊的設計圖，標題寫著「赫菲斯托斯 Mk.III　右臂機械鎧」。'},
  {n:'圖紙角落有一行紅筆小字：「公差千分之一毫米。這次一定要能握緊。」字跡被擦掉過，又重新寫上。'},
  {who:'claire',e:'Blush_LookAway',t:'喂！誰准你偷看工程師的圖紙了！'},
  {who:'ryan',e:'Fork_Gaze',t:'……三年改了十七版。妳從來沒給我看過。'},
  {who:'claire',e:'Default_Grin',t:'因為前十六版都是失敗作啦。這一版——公差不到千分之一毫米，本小姐的赫菲斯托斯，天下無敵。'},
 ],
 tWindow:[
  {n:'窗外是被酸雨蝕成灰白色的山谷。電線桿一根根往後退，遠方礦區的煙囪冒著暗紅色的煙。'},
  {who:'ryan',e:'Fork_Gaze',t:'（音叉在發燙……440 赫茲。跟那天爐心一樣的頻率，是從東邊傳過來的。）'},
 ],
 tSoldier:[
  {n:'押車兵：「少校，您要去奧姆鎮？……我表哥在那邊挖煤。上個月寄信回家，說鎮上要做什麼『體檢』，做完就加薪。之後就再也沒有消息了。」'},
  {n:'押車兵：「上頭交代，我們這班車只負責把兩位送到月台，誰都不准進鎮。」'},
  {who:'ryan',e:'Default_Cold',t:'你表哥叫什麼名字？我會留意。'},
 ],
 tCards:[
  {n:'正在玩牌的士兵頭也不抬：「聽說那位准尉的鐵手臂，一拳就能打穿裝甲板……長官，您別跟她說是我說的。」'},
  {who:'claire',e:'Angry_Steam',t:'我聽到囉。'},
  {who:'ryan',e:'Cynical_Smirk',t:'放心，她最多只會打穿你的牌桌。'},
 ],
 tConductor:[
  {n:'老列車長：「這條線以前是載煤的。礦工下了工會擠滿整節車廂，一路唱歌唱到月台。」'},
  {n:'老列車長：「這半年……往鎮上開的都是空車廂。往北邊機庫開的，全是人。」'},
  {who:'claire',e:'Hurt',t:'……全是人？'},
 ],
});
/* ---- walkable armored train ---- */
const TR={W:36,H:8,cars:[[1,11],[12.6,22.6],[24.2,34.2]],z0:2.4,z1:5.6};
MAP_SONG.train='yard';
MAPS.train={name:'裝甲列車・往奧姆鎮',theme:'train',free:1,build:buildTrainMap,size:[TR.W,TR.H],grid:Array(TR.H).fill('.'.repeat(TR.W)),enc:false,table:[],start:[3.4,4],rest:[3.4,4],
  sunCol:0x9ab8ff,sunInt:.35,dripCol:0x6a8ab0,
  obj:()=>!P.flags.orders?'讀一讀掉在座位底下的命令書':'到最後面的三號貨車看看',
  zones:[{r:[0,0,11.8,8],name:'一號客車'},{r:[11.8,0,23.4,8],name:'二號車・押運兵'},{r:[23.4,0,36,8],name:'三號貨車'}],
  mmFloor:[[1,2.4,11,5.6,'#4a3a2a'],[12.6,2.4,22.6,5.6,'#4a3a2a'],[24.2,2.4,34.2,5.6,'#4a3a2a'],[11,3.4,12.6,4.6,'#3a3a40'],[22.6,3.4,24.2,4.6,'#3a3a40']],
  colliders:()=>({box:(X.colCache||{box:[]}).box.slice(),circ:(X.colCache||{circ:[]}).circ.slice()}),
  tick:(dt,t)=>{E.camera.position.y+=Math.sin(t*14)*.012;E.camera.position.x+=Math.sin(t*9.3)*.006;},
  events:[
   {id:'orders',kind:'sign',at:[2.6,3],label:'座位底下的公文袋',talk:'tOrders',after:()=>{P.flags.orders=1;}},
   {id:'toolbox',kind:'sign',at:[8.6,3],label:'克蕾雅的工具箱',talk:'tToolbox'},
   {id:'window',kind:'sign',at:[6,2.9],label:'車窗',talk:'tWindow'},
   {id:'soldier',kind:'npc',who:'guard',at:[14.4,3.1],label:'押車兵',talk:'tSoldier'},
   {id:'cards',kind:'npc',who:'guard',at:[19.6,4.9],label:'玩牌的士兵',talk:'tCards',face:-1},
   {id:'conductor',kind:'npc',who:'folkC',at:[21.8,3],label:'老列車長',talk:'tConductor'},
   {id:'supply',kind:'chest',at:[16.8,5],label:'押運兵的補給箱',loot:{Fe:1,C:1},items:['bandage']},
   {id:'cargo',kind:'exit',at:[33.2,4],r:1,label:'三號貨車深處',cond:()=>P.flags.orders,deny:'先讀讀命令書吧（公文袋在一號客車的座位底下）。',go:()=>trainAmbush()},
  ]};
function buildTrainMap(){
  setFog(0x0a0d14,.55);E.scene.fog.near=12;E.scene.fog.far=34;
  const wallM=()=>mat2('rustroof',4,1.2,{color:0x8a7a70,metalness:.4});
  // passing ground far below + sleepers
  const g=fbFloor(-30,-20,70,28,'gravel',2,-1.3,{color:0x6a6670});E.fxs.push(dt=>{g.material.map.offset.x+=dt*9;});
  const sleepers=[];for(let k=0;k<40;k++){const s=new THREE.Mesh(new THREE.BoxGeometry(.25,.1,4.6),mat2('plank',.2,.6));s.position.set(-4+k*1.1,-1.22,4);E.world.add(s);sleepers.push(s);}
  E.fxs.push(dt=>{sleepers.forEach(s=>{s.position.x-=dt*16;if(s.position.x<-4)s.position.x+=44;});});
  // scenery passing by: poles + dead trees + far hills
  const pass=[];for(let k=0;k<14;k++){const far=k%2;const o=new THREE.Mesh(far?new THREE.ConeGeometry(2+Math.random()*2,3+Math.random()*3,6):new THREE.CylinderGeometry(.08,.1,4.5,5),
    new THREE.MeshStandardMaterial({color:far?0x1e2228:0x2a2018,roughness:1}));o.position.set(-10+k*4,far?0:.9,far?-9-Math.random()*4:10+Math.random()*2);E.world.add(o);pass.push([o,far?3:14]);}
  E.fxs.push(dt=>{pass.forEach(([o,sp])=>{o.position.x-=dt*sp;if(o.position.x<-14)o.position.x+=60;});});
  // cars
  TR.cars.forEach(([x0,x1],ci)=>{
    fbFloor(x0,TR.z0,x1,TR.z1,'plank',1.6,.01,{color:0x9a7a5a});
    const ch=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,1.1,TR.z1-TR.z0+.6),new THREE.MeshStandardMaterial({color:0x2a2622,metalness:.6}));ch.position.set((x0+x1)/2,-.56,(TR.z0+TR.z1)/2);E.world.add(ch);
    [x0+1.4,x1-1.4].forEach(wx=>[TR.z0+.2,TR.z1-.2].forEach(wz=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.2,12),new THREE.MeshStandardMaterial({color:0x1a1a1e,metalness:.7}));w.rotation.x=Math.PI/2;w.position.set(wx,-.9,wz);E.world.add(w);E.fxs.push(dt=>{w.rotation.y+=dt*20;});}));
    fbWall(x0,TR.z0-.3,x1,TR.z0,2.4,wallM(),{occ:false,mm:'#6a5a50'});fbWall(x0,TR.z1,x1,TR.z1+.3,1.1,wallM(),{mm:'#6a5a50'});
    fbWall(x0-.3,TR.z0-.3,x0,3.4,2.4,wallM(),{mm:'#6a5a50'});fbWall(x0-.3,4.6,x0,TR.z1+.3,2.4,wallM(),{mm:'#6a5a50'});
    fbWall(x1,TR.z0-.3,x1+.3,3.4,2.4,wallM(),{mm:'#6a5a50'});fbWall(x1,4.6,x1+.3,TR.z1+.3,2.4,wallM(),{mm:'#6a5a50'});
    for(let wx=x0+1.2;wx<x1-.6;wx+=2.2){const wn=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.8),new THREE.MeshBasicMaterial({color:0x5a7aa0}));wn.position.set(wx,1.6,TR.z0+.01);E.world.add(wn);
      E.fxs.push((dt,t)=>{const v=.35+.25*Math.max(0,Math.sin(t*3+wx));wn.material.color.setRGB(v*.6,v*.8,v);});}
    const lamp=new THREE.PointLight(0xffc070,1.5,8);lamp.position.set((x0+x1)/2,2.4,4);E.world.add(lamp);flicker(lamp,1.5,.2,3+ci);fbHalo((x0+x1)/2,4,2.6);
  });
  // gangways
  [[11,12.6],[22.6,24.2]].forEach(([a,b])=>{fbFloor(a-.3,3.4,b+.3,4.6,'concrete',1,.02,{color:0x707078,metalness:.6});
    [3.4,4.6].forEach(z=>{const c=new THREE.Mesh(new THREE.BoxGeometry(b-a,.05,.05),new THREE.MeshStandardMaterial({color:0x8a8a90,metalness:.8}));c.position.set((a+b)/2,.8,z);E.world.add(c);});
    FB.box.push([a,0,b,3.4],[a,4.6,b,8]);});
  FB.box.push([34.2,0,40,8],[-5,0,1,8]);
  // car 1: passenger benches
  [2.4,6.6,9.6].forEach(x=>{fbBox(x,TR.z0+.55,1.6,.8,.5,mat2('plank',.8,.3,{color:0x7a3a2a}));const back=new THREE.Mesh(new THREE.BoxGeometry(1.6,.9,.15),mat2('plank',.8,.4,{color:0x6a3022}));back.position.set(x,.95,TR.z0+.1);E.world.add(back);});
  [3.6,8].forEach(x=>{fbBox(x,TR.z1-.55,1.6,.8,.5,mat2('plank',.8,.3,{color:0x7a3a2a}));});
  const bag=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.34),new THREE.MeshStandardMaterial({color:0x4a3020}));bag.position.set(2.6,.08,3.05);E.world.add(bag);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(.7,.4,.4),new THREE.MeshStandardMaterial({color:0x8a2a1a,metalness:.3}));tb.position.set(8.6,.7,3.1);E.world.add(tb);
  // car 2: soldiers — bunks, card table, ammo crates
  fbBox(14.4,TR.z0+.45,2,.7,.9,mat2('plank',1,.4,{color:0x5a4a3a}));fbBox(19.6,4,1,.9,.7,mat2('plank',.5,.4));
  for(let k=0;k<4;k++){const c=new THREE.Mesh(new THREE.PlaneGeometry(.12,.18),new THREE.MeshBasicMaterial({color:0xf0e8d8,side:THREE.DoubleSide}));c.rotation.x=-Math.PI/2;c.rotation.z=k;c.position.set(19.4+k*.12,.72,4);E.world.add(c);}
  [[13.4,5],[21.6,5.1]].forEach(([x,z])=>fbBox(x,z,.8,.7,.6,mat2('rustroof',.5,.4,{color:0x5a6a4a})));
  // car 3: cargo
  [[25.4,3],[26.4,3],[25.4,5],[28.6,3.2],[29.6,3.2],[28.6,5.2],[31.6,2.9],[31.6,5.1],[27.5,4.1]].forEach(([x,z],k)=>fbBox(x,z,.9,.9,k===8?.5:.9+((k%3)*.3),mat2('plank',.5,.5),{rot:(k%2)*.2}));
  fbBarrel(30.6,5.1);fbBarrel(26.6,5.1,0x3a4a5a);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.2,2),new THREE.MeshStandardMaterial({color:0x3a3a40,metalness:.6}));door.position.set(34.18,1,4);door.rotation.y=-Math.PI/2;E.world.add(door);
}
function trainAmbush(){playScene(SCENES.trainAmbush,()=>startBattle(battleTrain(()=>playScene(SCENES.trainOut,()=>enterMap('town')))));}
/* new opening flow */
newGame=function(){resetParty();playScene(SCENES.prologueA,()=>playScene(SCENES.infirmary,()=>playScene(SCENES.trainWake,()=>enterMap('train'))));};
{const o=townTick;townTick=function(dt,t){o(dt,t);if(X.M&&X.M.tick&&!$('explore').hidden)X.M.tick(dt,t);};}
SET_SONG.infirmary='dawn';
SCENES.trainIn=[{loc:'裝甲列車・一號客車'},{n:'車廂隨著鐵軌輕輕搖晃。窗外的天色暗得像傍晚，其實才剛過中午。'}];
