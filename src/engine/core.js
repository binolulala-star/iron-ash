"use strict";
const $=id=>document.getElementById(id);
/* ======================= DATA ======================= */
const EL={Si:'土石',Fe:'純鐵',H2O:'水',C:'碳油',Acid:'強酸',Al:'鋁',Mg:'鎂',NaCl:'鹽',P:'磷',Org:'有機物'};
const ELF={Si:'Si',Fe:'Fe',H2O:'H₂O',C:'C',Acid:'H⁺',Al:'Al',Mg:'Mg',NaCl:'NaCl',P:'P',Org:'Org'};
const SHAPE={1:'1 點・單格',2:'2 點・直線',3:'3 點・三角',4:'4 點・四方',8:'8 點・八邊形'};
const RECIPES=[
 ['R01','石英穿刺矛',1,['Si','Si'],1,1,'錨點 3 格內最近的敵人：75 穿刺傷，削減 20 外裝甲'],
 ['R02','高碳鋼重刃強化',1,['Fe','C'],1,1,'克蕾雅下次攻擊傷害與破甲效率 +100%'],
 ['R03','緊急蒸氣煙幕',1,['H2O','C'],1,1,'全隊回復 50 HP'],
 ['R04','強酸破甲飛沫',1,['Acid','H2O'],1,1,'錨點 3 格內最近的敵人：削減 65 外裝甲，45 酸蝕傷'],
 ['R05','防爆石牆',2,['Si','Si'],1,1,'沿兩點連線升起石牆，阻擋移動與砲擊'],
 ['R06','高壓電弧鐵絲網',2,['Fe','H2O'],2,1,'連線上或相鄰的敵人：95 電擊傷並麻痺 1 回合'],
 ['R07','凝固汽油火牆',2,['C','C'],1,1,'連線上的敵人 110 火傷；碰到氫氧氣雲立即引爆'],
 ['R08','鋼鐵捕獸枷・改',3,['Fe','Fe'],2,1,'陣內敵人：80 傷害並完全定身 2 回合'],
 ['R09','高壓電解氫氧雲',3,['H2O','Fe'],2,1,'陣內積水電解為 2H₂+O₂ 氣雲，遇火引爆 380 真實傷'],
 ['R10','鋁熱劑高溫熔爐',3,['Al','Fe'],2,1,'鋁粉還原鐵鏽 2500°C：陣內敵人外裝甲歸零＋60 傷'],
 ['R11','矽藻流沙陷坑',3,['Si','H2O'],2,1,'陣內敵人定身 2 回合，削減 50 外裝甲'],
 ['R12','王水腐蝕毒霧陣',3,['Acid','Fe'],2,1,'陣內敵人 160 真實毒傷'],
 ['R13','法拉第電磁穹頂',4,['Fe','Si'],2,1,'全隊回滿 HP'],
 ['R14','真空抽氧窒息室',4,['C','Acid'],2,1,'陣內敵人 240 無視防禦傷害'],
 ['R15','超載諧振・強制逆構',4,['Org','Fe'],0,1,'禁忌：常駐於戰鬥列，不需裝備'],
 ['R16','地殼隆起・升降岩柱',1,['Si','Fe'],1,2,'目標網格升高 1 層'],
 ['R17','極寒折射・冰晶稜鏡陣',3,['H2O','Si'],2,2,'185 折射傷，全隊反射護盾'],
 ['R18','勞倫茲力・電磁軌道砲',2,['Fe','Fe'],2,3,'180 貫穿傷，擊退 3 格'],
 ['R19','伯努利・暴風氣旋障壁',3,['H2O','C'],2,3,'免疫強風；陣內敵人浮空 1 回合'],
 ['R20','鎂光閃焰・白晝照明彈',1,['Mg','Mg'],1,4,'照亮 5×5 漆黑區，致盲 2 回合'],
 ['R21','逆向諧振・神經剝離陣',3,['Fe','Org'],2,4,'停機琥珀植入物，剝離控制晶片'],
 ['R22','阿基米德・聚焦太陽熱線',2,['Si','C'],2,5,'120 火傷；經青銅鏡折射升至 200'],
 ['R23','亥姆霍茲・逆相位消音陣',3,['Fe','Si'],2,5,'封鎖同步復活與吟唱 2 回合'],
 ['R24','伯努利・跨谷上升氣流橋',2,['H2O','Si'],1,5,'滑翔越過深淵'],
 ['R25','氯鹼工業・食鹽水電解陣',3,['H2O','Acid'],2,6,'電解海水產生氯氣，240 真實腐蝕傷'],
 ['R26','戴維法・純鈉金屬水雷',2,['NaCl','C'],2,6,'碳電極電解熔融海鹽，遇水爆炸 320 傷'],
 ['R27','非晶質・強化玻璃壁壘',4,['Si','C'],3,6,'免疫錫疫與強酸的玻璃穹頂'],
 ['R28','法拉第・反重力磁浮矩陣',4,['Fe','Si'],3,7,'中和重力壓制，全隊移動 +2'],
 ['R29','白磷閃燃・無死角封鎖陣',3,['P','C'],2,7,'220 真實灼燒，架勢崩潰 2 回合'],
 ['R30','麥克斯韋・逆熵歸還大陣',8,['音叉','八基座'],0,8,'歸還兩千萬國民記憶'],
].map(r=>({id:r[0],name:r[1],n:r[2],el:r[3],ap:r[4],ch:r[5],desc:r[6]}));
const RBY=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
const MODS={
 frame:{label:'主骨架',opts:[
  {id:'F1',name:'制式黑鐵骨架',load:20,hp:30,arm:20,atk:0,mv:0,skill:'穩固重心：免疫擊退'},
  {id:'F2',name:'航空杜拉鋁輕骨架',load:10,hp:0,arm:0,atk:10,mv:2,skill:'疾風走位：每回合首次移動 0 AP'},
  {id:'F3',name:'重型鎢鋼防爆骨架',load:45,hp:80,arm:60,atk:0,mv:-1,skill:'鎢鋼重甲：受到的傷害再減半'}]},
 weapon:{label:'腕部兵裝',opts:[
  {id:'W1',name:'高壓蒸氣打樁機',load:25,hp:0,arm:10,atk:45,mv:0,skill:'震盪重錘（1 AP）：相鄰，削 35 裝甲並擊退 1 格'},
  {id:'W2',name:'內藏式燧發火銃',load:20,hp:0,arm:0,atk:35,mv:0,skill:'打火石點火（1 AP）：射程 4，引爆氣雲或射擊'},
  {id:'W3',name:'高頻震動鍊金刃',load:35,hp:0,arm:0,atk:65,mv:0,skill:'解剖斬擊（1 AP）：對定身／破甲目標必暴擊，削落 Fe×2'}]},
 util:{label:'掌部輔助',opts:[
  {id:'U1',name:'氣動定點樁發射器',load:15,hp:0,arm:0,atk:10,mv:0,skill:'遠程釘樁（1 AP）：4 格內任意網格釘下錨點'},
  {id:'U2',name:'工業電磁吸盤模組',load:25,hp:0,arm:10,atk:15,mv:0,skill:'隔空取物（1 AP）：吸取 4 格內廢鐵與碎石，腳下刻錨點'},
  {id:'U3',name:'液態氮急速冷凍噴嘴',load:30,hp:10,arm:15,atk:20,mv:0,skill:'瞬間急凍（1 AP）：相鄰敵人定身 1 回合，周圍化為融水'}]},
 core:{label:'動力爐心',opts:[
  {id:'C1',name:'雙缸微型蒸氣鍋爐',load:20,hp:20,arm:10,atk:10,mv:0,skill:'蒸氣洩壓（0 AP）：每回合一次，全隊回復 30 HP'},
  {id:'C2',name:'高轉速發條儲能匣',load:15,hp:0,arm:0,atk:5,mv:0,skill:'先手突襲：第 1 回合額外 +2 AP'},
  {id:'C3',name:'試作型記憶琥珀核心',load:40,hp:0,arm:25,atk:60,mv:1,skill:'赤紅超載：傷害 +50%，每次施放技能扣 8 HP'}]},
};
const MODBY={};Object.values(MODS).forEach(g=>g.opts.forEach(o=>MODBY[o.id]=o));
const SAVE_KEY='iron-ash-v2';
let save={equip:['R09','R08','R06','R10'],mods:{frame:'F1',weapon:'W2',util:'U1',core:'C2'},cap:100,cleared:false};
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&s.equip&&s.mods)save=Object.assign(save,s);}catch(e){}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(e){}}
function claireStats(mods){let s={hp:200,arm:0,atk:30,mv:3,load:0};Object.values(mods).forEach(id=>{const m=MODBY[id];s.hp+=m.hp;s.arm+=m.arm;s.atk+=m.atk;s.mv+=m.mv;s.load+=m.load;});return s;}
/* party state that persists across the chapter */
const P={ryan:{hp:160,max:160},claire:{hp:230,max:230},stash:{},flags:{},lv:{ryan:{lv:1,exp:0},claire:{lv:1,exp:0}},gear:{ryan:null,claire:null},items:{bandage:2},owned:[]};
function resetParty(){P.lv={ryan:{lv:1,exp:0},claire:{lv:1,exp:0}};P.gear={ryan:null,claire:null};P.items={bandage:2,coffee:1};P.owned=[];P.stash={};P.flags={};
  P.ryan={hp:0,max:0};P.claire={hp:0,max:0};syncMax();P.ryan.hp=P.ryan.max;P.claire.hp=P.claire.max;}
function syncClaireMax(){syncMax();}
function healParty(f){['ryan','claire'].forEach(k=>{const u=P[k];u.hp=Math.min(u.max,Math.max(u.hp,1)+Math.round(u.max*f));});}

/* ======================= PIXEL ART ======================= */
function cvs(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function tex(c){const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
function outline(g,w,h,col){const d=g.getImageData(0,0,w,h).data,a=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&d[(y*w+x)*4+3]>0,m=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!a(x,y)&&(a(x-1,y)||a(x+1,y)||a(x,y-1)||a(x,y+1)))m.push([x,y]);g.fillStyle=col;m.forEach(([x,y])=>g.fillRect(x,y,1,1));}
const CHAR={
 ryan:{skin:'#e9c3a0',skinD:'#c99a7a',eyeL:'#e8a030',eyeR:'#cfd6d8',coat:'#2c4466',coatD:'#1b2b44',shirt:'#e6e0d0',pants:'#23262e',boots:'#4a3020',
   hair:(P,b)=>{const h='#191a20';P(h,6,1+b,8,4);P(h,5,3+b,1,4);P(h,14,3+b,1,3);P(h,7,5+b,2,1);P(h,11,5+b,2,1);P(h,8,0+b,2,1);P(h,12,0+b,1,1);P('#30323c',8,2+b,3,1);},
   extra:(P,b)=>{P('#d9b25a',8,14+b,2,2);P('#fff2b0',8,14+b,1,1);P('#cfd6dc',16,8+b,1,7);P('#cfd6dc',18,8+b,1,7);P('#cfd6dc',16,15+b,3,1);P('#2a2a30',17,16+b,1,3);P('#eef3f6',12,6+b,1,1);}},
 claire:{skin:'#f1cdb0',skinD:'#d6a88a',eyeL:'#38a870',eyeR:'#38a870',coat:'#6a4026',coatD:'#45291a',shirt:'#e2d6c0',pants:'#4a3a2a',boots:'#2e2420',
   hair:(P,b)=>{const h='#cf3a2a';P(h,6,1+b,8,4);P(h,5,3+b,1,5);P(h,14,3+b,1,4);P(h,7,5+b,1,1);P(h,12,5+b,1,1);P(h,15,2+b,2,2);P(h,16,4+b,2,6);P('#f0684a',8,1+b,4,1);
     P('#d9b25a',7,3+b,2,1);P('#d9b25a',11,3+b,2,1);P('#8a6a2a',9,3+b,2,1);},
   extra:(P,b)=>{P('#4a4f58',2,11+b,4,8);P('#c9a24a',2,13+b,4,1);P('#c9a24a',2,16+b,4,1);P('#707884',2,19+b,4,2);P('#d8dde2',3,11+b,1,2);P('#8fe0ff',7,12+b,1,1);}},
 vera:{skin:'#f1ecf2',skinD:'#cfc6d4',eyeL:'#8a90a8',eyeR:'#8a90a8',coat:'#1c1a22',coatD:'#0e0d12',shirt:'#2a2632',pants:'#1c1a22',boots:'#0e0d12',
   hair:(P,b)=>{const h='#d4dae2';P(h,6,1+b,8,4);P(h,5,3+b,2,13);P(h,13,3+b,2,13);P('#ffffff',8,1+b,3,1);P(h,5,17+b,1,2);P(h,14,18+b,1,2);},
   extra:(P,b)=>{P('#b04060',9,9+b,2,1);P('#d4dae2',8,20,1,2);P('#d4dae2',12,21,1,2);}},
 howard:{skin:'#e3c2a2',skinD:'#c49e7e',eyeL:'#3a2a20',eyeR:'#3a2a20',coat:'#e4e0d6',coatD:'#bdb6a6',shirt:'#5a3a2a',pants:'#3a3a40',boots:'#2a2420',
   hair:(P,b)=>{const h='#9a9894';P(h,6,1+b,8,3);P(h,5,3+b,1,3);P(h,14,3+b,1,3);P('#c4c2bc',7,1+b,3,1);P('#2a2a2a',7,6+b,3,1);P('#2a2a2a',10,6+b,3,1);},
   extra:(P,b)=>{P('#8a1a1a',8,15+b,3,2);P('#8a1a1a',10,17+b,2,1);}},
 miner:{skin:'#d9b08a',skinD:'#b88a64',eyeL:'#f4f0e0',eyeR:'#f4f0e0',coat:'#3a5a7a',coatD:'#26405a',shirt:'#8a7a5a',pants:'#3a5a7a',boots:'#3a2a1a',
   hair:(P,b)=>{P('#c8a03a',5,1+b,10,4);P('#e8c86a',6,1+b,8,1);P('#fff2a0',9,2+b,2,2);P('#7a6020',5,5+b,10,1);},
   extra:(P,b)=>{P('#5a4a3a',8,9+b,4,1);P('#2a2a2a',16,10+b,1,10);P('#8a8a90',15,9+b,3,2);}},
 guard:{skin:'#dcb894',skinD:'#bc966e',eyeL:'#2a2a2a',eyeR:'#2a2a2a',coat:'#4a5868',coatD:'#323e4c',shirt:'#c8b07a',pants:'#2a323c',boots:'#1a1a1e',
   hair:(P,b)=>{P('#2a323c',5,1+b,10,3);P('#c8a456',5,4+b,10,1);P('#1a1e24',6,0+b,8,1);},
   extra:(P,b)=>{P('#6a7888',1,10+b,5,10);P('#8a98a8',2,11+b,3,8);P('#c8a456',3,14+b,1,2);}},
 marta:{skin:'#e8c4a4',skinD:'#c8a080',eyeL:'#4a3020',eyeR:'#4a3020',coat:'#7a3a3a',coatD:'#552626',shirt:'#e0d6c4',pants:'#7a3a3a',boots:'#3a2a20',
   hair:(P,b)=>{const h='#6a4228';P(h,6,1+b,8,3);P(h,5,3+b,1,5);P(h,14,3+b,1,5);P(h,8,0+b,4,1);P('#8a5a38',8,1+b,3,1);},
   extra:(P,b)=>{P('#e0d6c4',6,16+b,8,2);}},
 tim:{skin:'#f0caa8',skinD:'#d0a684',eyeL:'#2a4a6a',eyeR:'#2a4a6a',coat:'#6a7a3a',coatD:'#4a5826',shirt:'#e8e0c8',pants:'#4a3a2a',boots:'#2a2018',
   hair:(P,b)=>{const h='#a06a2a';P(h,6,1+b,8,4);P(h,5,3+b,1,3);P(h,14,3+b,1,3);P(h,7,5+b,1,1);P('#c88a40',9,1+b,3,1);},extra:null},
};
function humanCanvas(k,f){
  const sp=CHAR[k],W=20,H=28,c=cvs(W,H),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},b=f?1:0;
  P(sp.pants,7,20,2,5);P(sp.pants,11,20,2,5);P(sp.boots,6,24,3,2);P(sp.boots,11,24,3,2);
  P(sp.coat,6,11+b,8,10-b);P(sp.coatD,6,19,8,2);P(sp.coatD,13,12+b,1,7);P(sp.shirt,9,11+b,2,4);
  P(sp.coat,4,12+b,2,7);P(sp.coat,14,12+b,2,7);P(sp.skin,4,19+b,2,1);P(sp.skin,14,19+b,2,1);
  P(sp.skin,6,3+b,8,8);P(sp.skinD,6,10+b,8,1);P(sp.skinD,13,4+b,1,6);
  P(sp.eyeL,8,7+b,1,2);P(sp.eyeR,11,7+b,1,2);P('#7a4a3a',9,9+b,2,1);
  sp.hair(P,b);sp.extra&&sp.extra(P,b);outline(g,W,H,'#0e0a10');return c;
}
function mechCanvas(f,tank){
  const W=36,H=36,c=cvs(W,H),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},b=f?1:0;
  P('#2b3036',10,25,4,8);P('#2b3036',22,25,4,8);P('#1d2126',8,32,8,3);P('#1d2126',20,32,8,3);P('#454c55',11,26,2,5);P('#454c55',23,26,2,5);
  P('#5c6670',8,10+b,21,15);P('#46505a',8,20+b,21,5);P('#76828c',8,10+b,21,2);for(let x=10;x<28;x+=4)P('#2e353c',x,13+b,1,1);
  P('#e8892b',15,6+b,7,4);P('#ffd08a',17,7+b,3,2);P('#3a3a3a',14,9+b,9,1);
  P('#1a1d22',21,13+b,7,4);P('#ff3a2a',22,14+b,5,2);P('#ffb0a0',23,14+b,2,1);
  P('#4a525a',28,15+b,6,7);P('#2e353c',32,21+b,3,4);P('#6a747e',28,15+b,6,1);
  if(tank){P('#2f6fb0',2,10+b,6,13);P('#7fc4ff',3,12+b,2,9);P('#1d4a7a',7,10+b,1,13);P('#9aa2aa',2,9+b,6,1);P('#9aa2aa',2,23+b,6,1);}
  else{P('#3a3f46',4,13+b,4,8);P('#e8892b',5,15+b,2,2);}
  outline(g,W,H,'#0a0a0e');return c;
}
function houndCanvas(f){
  const W=28,H=20,c=cvs(W,H),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},b=f?1:0;
  P('#3a4048',5,6+b,15,6);P('#5a626c',5,6+b,15,2);P('#2a2e34',6,12,2,6-b);P('#2a2e34',10,12,2,6);P('#2a2e34',15,12,2,6-b);P('#2a2e34',18,12,2,6);
  P('#4a525c',19,3+b,7,6);P('#ff3a2a',23,5+b,2,1);P('#1a1d22',24,8+b,3,1);P('#c8a456',8,4+b,2,2);P('#9aa2aa',3,7+b,3,1);
  P('#e8892b',12,7+b,3,2);outline(g,W,H,'#0a0a0e');return c;
}
function sweeperCanvas(f){
  const W=24,H=24,c=cvs(W,H),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);},b=f?1:0;
  P('#5a5040',5,8+b,14,9);P('#7a6c54',5,8+b,14,2);P('#4ab830',7,3+b,10,5);P('#a8f070',8,4+b,3,2);P('#2a2a24',7,17+b,10,2);
  P('#ffd02a',15,11+b,2,2);P('#2a2a24',3,10+b,2,5);P('#2a2a24',19,10+b,2,5);P(f?'#9aa2aa':'#5a626c',2,9+b,1,7);P(f?'#5a626c':'#9aa2aa',21,9+b,1,7);
  P('#4ab830',10,19+b,1,3);P('#4ab830',13,20+b,1,2);outline(g,W,H,'#0a0a0e');return c;
}
let SEED=7;const rnd=()=>{SEED=(SEED*16807)%2147483647;return SEED/2147483647;};
function pixTex(kind){
  const c=cvs(16,16),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  const noise=(base,cols,n)=>{P(base,0,0,16,16);for(let k=0;k<n;k++)P(cols[(rnd()*cols.length)|0],(rnd()*16)|0,(rnd()*16)|0);};
  if(kind==='plate'){noise('#3b444c',['#434d56','#353d44','#4a545e'],60);P('#262c32',0,0,16,1);P('#262c32',0,0,1,16);P('#56616b',0,15,16,1);P('#56616b',15,0,1,16);P('#20262b',2,2);P('#20262b',13,2);P('#20262b',2,13);P('#20262b',13,13);}
  if(kind==='rust'){noise('#4a3a30',['#5a4434','#3e3028','#6a4a30','#2e2620'],90);P('#2a221c',0,0,16,1);}
  if(kind==='water'){noise('#1f5a8e',['#2a6aa4','#18507e'],40);for(let k=0;k<6;k++)P('#7fc4ff',(rnd()*12)|0,(rnd()*16)|0,3,1);}
  if(kind==='acid'){noise('#3a7a1a',['#4a9a26','#2a5a12'],50);for(let k=0;k<6;k++)P('#b8f070',(rnd()*12)|0,(rnd()*16)|0,3,1);}
  if(kind==='wood'){P('#5a3a24',0,0,16,16);for(let y=0;y<16;y+=4){P('#3e2818',0,y,16,1);for(let k=0;k<5;k++)P('#6a4630',(rnd()*16)|0,y+1+((rnd()*2)|0),2,1);}}
  if(kind==='brick'){P('#4a4440',0,0,16,16);for(let y=0;y<16;y+=4){P('#2e2a28',0,y,16,1);const o=(y/4)%2?0:4;for(let x=o;x<16;x+=8)P('#2e2a28',x,y,1,4);}for(let k=0;k<30;k++)P('#5a524c',(rnd()*16)|0,(rnd()*16)|0);}
  if(kind==='stone'){noise('#3c4038',['#464a40','#33362f','#2e3a2a'],80);P('#26281f',0,0,16,1);P('#26281f',0,8,16,1);P('#26281f',8,0,1,8);P('#26281f',3,8,1,8);}
  if(kind==='cobble'){P('#3a3634',0,0,16,16);[[0,0,7,5],[8,0,8,5],[0,6,5,5],[6,6,6,5],[13,6,3,5],[0,12,8,4],[9,12,7,4]].forEach(([x,y,w,h])=>{P('#4c4642',x+1,y+1,w-1,h-1);P('#5a5450',x+1,y+1,w-2,1);});}
  const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}

/* ======================= ENGINE ======================= */
const E={};
function initEngine(){
  const canvas=$('gl');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x07090f);scene.fog=new THREE.Fog(0x07090f,16,34);
  const camera=new THREE.PerspectiveCamera(30,1,.1,120);
  const controls=new THREE.OrbitControls(camera,canvas);controls.enableDamping=true;controls.enablePan=false;controls.enabled=false;
  const world=new THREE.Group();scene.add(world);
  const composer=new THREE.EffectComposer(renderer);composer.addPass(new THREE.RenderPass(scene,camera));
  const bloom=new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.55,.5,.78);composer.addPass(bloom);
  const hts=new THREE.ShaderPass(THREE.HorizontalTiltShiftShader),vts=new THREE.ShaderPass(THREE.VerticalTiltShiftShader);composer.addPass(hts);composer.addPass(vts);
  const grade=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},vig:{value:1.1}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D tDiffuse;uniform float vig;varying vec2 vUv;
      void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.18);
      c*=vec3(1.06,1.0,.92);c=pow(c,vec3(.94));float d=distance(vUv,vec2(.5));c*=smoothstep(.9,.32,d*vig);gl_FragColor=vec4(c,1.);}`});
  composer.addPass(grade);
  Object.assign(E,{renderer,scene,camera,controls,world,composer,bloom,hts,vts,grade,ray:new THREE.Raycaster(),mouse:new THREE.Vector2(),
    clock:new THREE.Clock(),sprites:[],fxs:[],mode:'scene',shake:0,tilt:.55,blur:2.2});
  E.hemi=new THREE.HemisphereLight(0x8a9ab8,0x1a1410,.45);scene.add(E.hemi);
  window.addEventListener('resize',resize);resize();
  canvas.addEventListener('pointerdown',e=>{E.downAt=[e.clientX,e.clientY];});
  canvas.addEventListener('pointerup',e=>{if(!E.downAt)return;const d=Math.hypot(e.clientX-E.downAt[0],e.clientY-E.downAt[1]);E.downAt=null;if(d<8)onCanvasClick(e);});
  loop();
}
function resize(){
  const w=innerWidth,h=innerHeight;E.renderer.setSize(w,h,false);E.composer.setSize(w,h);
  E.camera.aspect=w/h;E.camera.fov=w<600?46:30;
  E.hts.uniforms.h.value=E.blur/w;E.vts.uniforms.v.value=E.blur/h;E.hts.uniforms.r.value=E.vts.uniforms.r.value=E.tilt;
  let off=0;
  if(E.mode==='battle'&&!$('battle').hidden){const top=document.querySelector('.hud-top').offsetHeight||0,deck=$('deck').hidden?0:($('deck').offsetHeight||0);off=Math.round((deck-top)/2);}
  if(!$('story').hidden)off=Math.round(($('st-box').offsetHeight||0)/2.4);
  E.camera.setViewOffset(w,h,0,off,w,h);E.camera.updateProjectionMatrix();
}
function setTilt(r,blur){E.tilt=r;E.blur=blur;resize();}
function loop(){
  requestAnimationFrame(loop);
  const raw=Math.min(.05,E.clock.getDelta()),t=E.clock.elapsedTime;let dt=raw;if(E.hs>0){E.hs-=raw;dt=raw*.04;}
  if(E.controls.enabled)E.controls.update();
  const yaw=Math.atan2(E.camera.position.x-E.controls.target.x,E.camera.position.z-E.controls.target.z);
  E.sprites.forEach(s=>{s.mesh.rotation.y=yaw;s.t+=dt;const fr=Math.floor(s.t*s.speed)%s.frames.length;
    if(s.pose){if(s.mat.map!==s.pose){s.mat.map=s.pose;s.depth.map=s.pose;s.mat.needsUpdate=true;s.fr=-1;}}
    else if(fr!==s.fr){s.fr=fr;s.mat.map=s.frames[fr];s.depth.map=s.frames[fr];s.mat.needsUpdate=true;}
    const fl=s.float?(.25+Math.sin(t*3+s.t)*.06):0;
    if(s.hop>0){s.hop=Math.max(0,s.hop-dt*3);s.mesh.position.y=fl+Math.sin(s.hop*Math.PI)*.18;}else s.mesh.position.y=fl;});
  E.fxs=E.fxs.filter(f=>f(dt,t)!==false);
  if(E.onTick)E.onTick(dt,t);
  if(E.shake>0){E.shake=Math.max(0,E.shake-dt*2.5);E.camera.position.x+=(Math.random()-.5)*E.shake*.2;E.camera.position.y+=(Math.random()-.5)*E.shake*.15;}
  E.composer.render();
}
function clearWorld(){while(E.world.children.length)E.world.remove(E.world.children[0]);E.sprites=[];E.fxs=[];E.onTick=null;}
const TEX={};function T(k){return TEX[k]||(TEX[k]=pixTex(k));}
function texMat(k,rx,ry,o={}){const t=T(k).clone();t.needsUpdate=true;t.repeat.set(rx,ry);return new THREE.MeshStandardMaterial(Object.assign({map:t,roughness:.9},o));}
function makeSprite(frames,hgt,opts={}){
  const asp=frames[0].image.width/frames[0].image.height;
  const mat=new THREE.MeshLambertMaterial({map:frames[0],transparent:true,alphaTest:.5,side:THREE.DoubleSide,emissive:0x1c1c26});
  const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:frames[0],alphaTest:.5});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(hgt*asp,hgt),mat);plane.position.y=hgt/2;plane.castShadow=true;plane.customDepthMaterial=depth;
  const holder=new THREE.Group(),inner=new THREE.Group();inner.add(plane);holder.add(inner);
  const sh=new THREE.Mesh(new THREE.CircleGeometry(Math.min(hgt*asp,1.4)*.32,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.42,depthWrite:false}));
  sh.rotation.x=-Math.PI/2;sh.position.y=.012;sh.scale.y=.55;holder.add(sh);
  const s={mesh:inner,holder,plane,mat,depth,frames,t:Math.random()*2,fr:0,hop:0,speed:opts.speed||1.6,float:!!opts.float,pose:null,kind:opts.kind||null};
  s.face=dir=>{plane.scale.x=dir<0?-1:1;};s.setFrames=f=>{s.frames=f;s.fr=-1;};
  E.sprites.push(s);return s;
}
const SPRITE_H={tim:1.1};
const SPRITE_ALIAS={hans:'miner'};
function charSprite(k){const c=SPRITE_ALIAS[k]||k;return makeSprite([tex(humanCanvas(c,0)),tex(humanCanvas(c,1))],SPRITE_H[k]||1.45,{kind:c});}
function dustField(n,box,color,size,speed){
  const g=new THREE.BufferGeometry(),p=new Float32Array(n*3);
  for(let i=0;i<n;i++){p[i*3]=box[0]+rnd()*(box[3]-box[0]);p[i*3+1]=box[1]+rnd()*(box[4]-box[1]);p[i*3+2]=box[2]+rnd()*(box[5]-box[2]);}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color,size,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));E.world.add(pts);
  E.fxs.push((dt,t)=>{const a=g.attributes.position.array;for(let i=0;i<n;i++){a[i*3+1]+=dt*speed*(.4+((i*37)%10)/10);a[i*3]+=Math.sin(t+i)*dt*.05;
    if(speed>0&&a[i*3+1]>box[4])a[i*3+1]=box[1];if(speed<0&&a[i*3+1]<box[1])a[i*3+1]=box[4];}g.attributes.position.needsUpdate=true;});
}
function flicker(l,base,amp,spd){E.fxs.push((dt,t)=>{l.intensity=base+Math.sin(t*spd)*amp*.5+Math.sin(t*spd*2.7)*amp*.5;});}
function tileFloor(w,d,k,ox=0,oz=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.3,d),texMat(k,w,d));m.position.set(ox,-.15,oz);m.receiveShadow=true;E.world.add(m);return m;}
function block(w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y+h/2,z);m.castShadow=true;m.receiveShadow=true;E.world.add(m);return m;}
function keyLight(color,int,pos,tgt){const l=new THREE.DirectionalLight(color,int);l.position.set(...pos);l.castShadow=true;l.shadow.mapSize.set(1024,1024);
  const s=l.shadow.camera;s.left=-13;s.right=13;s.top=13;s.bottom=-13;s.near=.5;s.far=50;l.shadow.bias=-.0008;
  if(tgt){l.target.position.set(...tgt);E.world.add(l.target);}E.world.add(l);return l;}
function amberTower(x,z,emis){
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.4,7,16),new THREE.MeshStandardMaterial({color:0x3a2416,emissive:emis,roughness:.5,metalness:.4}));tw.position.set(x,3.5,z);E.world.add(tw);
  for(let k=0;k<6;k++){const tube=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3,6),new THREE.MeshBasicMaterial({color:0xffa040}));tube.position.set(x-3+k*1.2,1.5,z+1.6);E.world.add(tube);}
}
function look(px,py,pz,tx,ty,tz){E.camera.position.set(px,py,pz);E.controls.target.set(tx,ty,tz);E.camera.lookAt(tx,ty,tz);}
function setFog(c,hemi){E.scene.fog.color.set(c);E.scene.background.set(c);E.hemi.intensity=hemi;}
function rain(box){dustField(260,box,0x8ab0d8,.05,-5);}

/* ======================= STORY SETS ======================= */
const SETS={
 title(){
  setFog(0x0a0c14,.35);tileFloor(14,8,'plate');
  for(let k=-3;k<=3;k++)block(.4,6,.4,k*2.2,0,-3.4,texMat('rust',1,6,{metalness:.4}));
  amberTower(0,-5,0x5a2208);
  const glow=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),new THREE.MeshBasicMaterial({color:0xffa040}));glow.position.set(0,2.2,-4.2);E.world.add(glow);
  const pl=new THREE.PointLight(0xff9a40,2.6,14);pl.position.set(0,2.4,-3.2);E.world.add(pl);flicker(pl,2.6,.6,5);
  keyLight(0x9fb8ff,.35,[5,8,6]);dustField(160,[-7,0,-4,7,6,4],0xffc890,.06,.25);
  const r=charSprite('ryan'),c=charSprite('claire'),nar=innerWidth<700;
  r.holder.position.set(nar?-.7:1.1,0,nar?-.4:1.2);c.holder.position.set(nar?.7:2.5,0,nar?-.4:1.2);c.face(-1);E.world.add(r.holder,c.holder);
  look(0,2.6,9.5,0,1.5,0);
  E.onTick=(dt,t)=>{E.camera.position.x=Math.sin(t*.12)*1.2;E.camera.lookAt(E.controls.target);};
  setTilt(.36,2.4);
 },
 reactor(){
  setFog(0x0c0814,.25);tileFloor(12,8,'plate');
  const core=new THREE.Mesh(new THREE.SphereGeometry(1.6,24,18),new THREE.MeshBasicMaterial({color:0xc69bff}));core.position.set(0,2.4,-3.2);E.world.add(core);
  const shell=new THREE.Mesh(new THREE.TorusGeometry(2.2,.12,8,40),new THREE.MeshStandardMaterial({color:0x6a5a80,metalness:.8,roughness:.3}));shell.position.copy(core.position);E.world.add(shell);
  const shell2=shell.clone();shell2.rotation.x=Math.PI/2;E.world.add(shell2);
  E.fxs.push((dt,t)=>{shell.rotation.y+=dt*.6;shell2.rotation.z+=dt*.4;core.scale.setScalar(1+Math.sin(t*6)*.03);});
  const pl=new THREE.PointLight(0xb080ff,3.2,14);pl.position.set(0,2.4,-2);E.world.add(pl);flicker(pl,3.2,1,9);
  for(const x of [-4.5,4.5])block(.6,5,.6,x,0,-2.6,texMat('plate',1,5,{metalness:.5}));
  block(2.2,.9,.8,3.9,0,-1.2,texMat('plate',2,1,{metalness:.5}));
  block(1.6,1.4,.12,-4.2,0,-1.9,new THREE.MeshStandardMaterial({color:0x2a2f3a,emissive:0x0a1a2a}));
  dustField(120,[-6,0,-4,6,5,3],0xd8b0ff,.07,.6);keyLight(0xb8a0ff,.4,[-4,8,6]);
  look(0,3.2,10,0,1.3,0);setTilt(.5,2.4);
 },
 train(){
  setFog(0x0c0e14,.4);tileFloor(12,4,'wood');
  block(12,4,.2,0,0,-2.1,texMat('rust',12,4,{metalness:.3}));
  const wins=[];for(let k=-2;k<=2;k++){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.4,1),new THREE.MeshBasicMaterial({color:0x9ab8d8}));w.position.set(k*2.4,2.2,-1.98);E.world.add(w);wins.push(w);}
  E.fxs.push((dt,t)=>{wins.forEach((w,k)=>{const v=.45+.35*Math.max(0,Math.sin(t*3+k*1.7));w.material.color.setRGB(v*.7,v*.85,v);});});
  for(const x of [-2.4,2.4]){block(1.6,.5,.9,x,0,-1.4,texMat('wood',2,1));block(1.6,1.1,.2,x,.5,-1.85,texMat('wood',2,1));}
  const lamp=new THREE.PointLight(0xffc070,2,9);lamp.position.set(0,3.2,0);E.world.add(lamp);flicker(lamp,2,.25,3);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshBasicMaterial({color:0xffd890}));bulb.position.copy(lamp.position);E.world.add(bulb);
  keyLight(0x9ab8ff,.4,[2,8,6]);dustField(80,[-5,0,-2,5,4,2],0xffd8a0,.05,.15);
  look(0,2.6,8.4,0,1.2,0);E.onTick=()=>{E.camera.position.y=2.6+Math.sin(performance.now()/90)*.012;};setTilt(.48,2.2);
 },
 hangar(){hangarBase(false);const m=makeSprite([tex(mechCanvas(0,true)),tex(mechCanvas(1,true))],2.4,{speed:1.2});m.holder.position.set(2.6,0,-1.4);m.face(-1);E.world.add(m.holder);
  look(0,3,10,0,1.3,0);setTilt(.5,2.4);},
 aftermath(){hangarBase(true);look(0,2.8,9.2,0,1.2,0);setTilt(.5,2.6);},
 dawn(){
  setFog(0x2a2430,.75);tileFloor(14,6,'cobble');
  for(let k=-3;k<=3;k++){const h=block(1.8,3.2,1,k*2,0,-2.6,texMat('brick',2,3));const w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.6),new THREE.MeshBasicMaterial({color:0xffd890}));w.position.set(k*2+.3,1.8,-2.08);E.world.add(w);}
  keyLight(0xffc8a0,1.1,[-8,5,6]);const sun=new THREE.PointLight(0xffb080,1.6,20);sun.position.set(-6,4,2);E.world.add(sun);
  dustField(90,[-7,0,-2,7,4,3],0xffe0b0,.05,.15);
  look(0,2.6,9,0,1.2,0);setTilt(.48,2.4);
 },
};
function hangarBase(burning){
  setFog(0x0c0a0a,.3);tileFloor(14,8,'plate');
  for(let k=-3;k<=3;k++)block(.45,6,.45,k*2.3,0,-3.6,texMat('rust',1,6,{metalness:.4}));
  amberTower(-.5,-5,burning?0x8a3a0a:0x4a1a06);
  const pl=new THREE.PointLight(0xff9a40,burning?3.4:2.4,14);pl.position.set(-.5,2.5,-3);E.world.add(pl);flicker(pl,burning?3.4:2.4,burning?1.2:.5,burning?11:4);
  keyLight(0xffd0a0,.45,[-5,9,5]);
  dustField(burning?220:120,[-7,0,-4,7,6,3],burning?0xff8a40:0xffc890,burning?.08:.06,burning?1.2:.25);
}

/* ======================= PORTRAITS ======================= */
function face({skin,hair,hairBack,eyeL,eyeR,coat,collar,expr,extra,brow='#2a2420'}){
  const mouths={neutral:'M88 150 Q100 153 112 150',grin:'M84 146 Q100 162 116 146 Q100 154 84 146 Z',smirk:'M88 151 Q102 152 114 144',
    angry:'M86 154 Q100 146 114 154',open:'M88 148 Q100 166 112 148 Q100 156 88 148 Z',sad:'M88 154 Q100 147 112 154',soft:'M88 149 Q100 156 112 149'};
  const m=mouths[expr.mouth||'neutral'];
  const bl=expr.brow==='angry'?'M70 104 L92 112':expr.brow==='sad'?'M70 110 L92 104':'M70 106 L92 106';
  const br=expr.brow==='angry'?'M130 104 L108 112':expr.brow==='sad'?'M130 110 L108 104':'M130 106 L108 106';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 50 160 208" width="160" height="208"><rect x="0" y="0" width="200" height="260" fill="#0f1628"/>${hairBack||''}
   <path d="M40 260 Q44 196 100 188 Q156 196 160 260 Z" fill="${coat}"/>${collar||''}
   <rect x="88" y="168" width="24" height="24" fill="${skin}"/><ellipse cx="100" cy="125" rx="40" ry="48" fill="${skin}"/>
   <path d="${bl}" stroke="${brow}" stroke-width="5" stroke-linecap="round"/><path d="${br}" stroke="${brow}" stroke-width="5" stroke-linecap="round"/>
   <ellipse cx="81" cy="124" rx="8" ry="${expr.closed?1.5:8}" fill="${eyeL}"/><ellipse cx="119" cy="124" rx="8" ry="${expr.closed?1.5:8}" fill="${eyeR}"/>
   ${expr.closed?'':'<rect x="80" y="119" width="4" height="4" fill="#fff"/><rect x="118" y="119" width="4" height="4" fill="#fff"/>'}
   <path d="${m}" stroke="#4a2a24" stroke-width="4" fill="${/Z$/.test(m)?'#5a2a24':'none'}" stroke-linecap="round"/>
   ${expr.blush?'<ellipse cx="74" cy="140" rx="9" ry="4" fill="#e06a6a" opacity=".55"/><ellipse cx="126" cy="140" rx="9" ry="4" fill="#e06a6a" opacity=".55"/>':''}
   ${expr.tear?'<path d="M76 132 Q72 144 76 150 Q81 144 76 132" fill="#9fd4ff"/>':''}${hair}${extra||''}</svg>`;
}
const EXPR={Default_Cold:{mouth:'neutral'},Cynical_Smirk:{mouth:'smirk'},AshEye_Overload:{mouth:'angry',brow:'angry',ash:true},Fork_Gaze:{mouth:'soft',brow:'sad'},
  Combat_Roar:{mouth:'open',brow:'angry'},Default_Grin:{mouth:'grin'},Angry_Steam:{mouth:'angry',brow:'angry',steam:true},Memory_Headache:{mouth:'sad',brow:'sad',closed:true,quartz:true},
  Teary_Fierce:{mouth:'angry',brow:'angry',tear:true},Blush_LookAway:{mouth:'soft',blush:true},Smile:{mouth:'smirk'},Hurt:{mouth:'sad',brow:'sad'},Neutral:{mouth:'neutral'},
  Happy:{mouth:'grin'},Cry:{mouth:'open',brow:'sad',tear:true},Blank:{mouth:'grin',closed:true}};
function portraitSVG(who,en){
  const e=EXPR[en]||EXPR.Neutral;
  if(who==='ryan')return face({skin:'#e9c3a0',coat:'#2c4466',eyeL:'#e8a030',eyeR:'#9aa3a6',expr:e,
    hair:'<path d="M58 120 Q54 68 100 64 Q148 66 144 120 Q138 92 122 90 Q112 106 96 92 Q84 106 70 96 Q62 106 58 120 Z" fill="#191a20"/>',
    collar:'<path d="M70 196 L100 230 L130 196 L120 190 L100 214 L80 190 Z" fill="#1b2b44"/><circle cx="128" cy="226" r="12" fill="#b88a36"/>',
    extra:`<g stroke="#eef3f6" stroke-width="2" opacity="${e.ash?1:.6}"><path d="M110 118 H128 M110 128 H128 M114 114 V134 M124 114 V134"/></g>${e.ash?'<rect x="117" y="132" width="4" height="22" fill="#cfd6d8"/>':''}`});
  if(who==='claire')return face({skin:'#f1cdb0',coat:'#6a4026',eyeL:'#38a870',eyeR:'#38a870',expr:e,brow:'#8a2a1a',
    hairBack:'<path d="M130 80 Q180 92 170 176 Q160 140 146 120 Z" fill="#cf3a2a"/>',
    hair:'<path d="M58 122 Q54 66 100 64 Q146 66 142 122 Q134 90 100 84 Q70 90 58 122 Z" fill="#cf3a2a"/><rect x="66" y="80" width="68" height="12" fill="#8a6a2a"/><circle cx="84" cy="86" r="9" fill="#d9b25a"/><circle cx="116" cy="86" r="9" fill="#d9b25a"/>',
    collar:`<path d="M40 260 Q40 206 64 194 L78 260 Z" fill="#4a4f58"/><circle cx="62" cy="214" r="7" fill="${e.quartz?'#d8f4ff':'#7fd0ff'}"/>`,
    extra:e.steam?'<g fill="#efe6d0" opacity=".6"><circle cx="40" cy="200" r="10"/><circle cx="30" cy="184" r="7"/></g>':''});
  if(who==='vera')return face({skin:'#f1ecf2',coat:'#1c1a22',eyeL:'#8a90a8',eyeR:'#8a90a8',expr:e,brow:'#333',
    hairBack:'<path d="M54 110 Q40 200 60 250 L80 250 Q70 180 76 120 Z M146 110 Q160 200 140 250 L120 250 Q130 180 124 120 Z" fill="#d4dae2"/>',
    hair:'<path d="M56 124 Q52 64 100 62 Q148 64 144 124 Q132 82 100 80 Q68 82 56 124 Z" fill="#d4dae2"/>'});
  if(who==='howard')return face({skin:'#e3c2a2',coat:'#e4e0d6',eyeL:'#3a2a20',eyeR:'#3a2a20',expr:e,
    hair:'<path d="M60 112 Q62 72 100 70 Q138 72 140 112 Q130 88 100 86 Q70 88 60 112 Z" fill="#9a9894"/><g fill="none" stroke="#2a2a2a" stroke-width="3"><circle cx="81" cy="124" r="13"/><circle cx="119" cy="124" r="13"/><path d="M94 124 H106"/></g>'});
  if(who==='marta')return face({skin:'#e8c4a4',coat:'#7a3a3a',eyeL:'#4a3020',eyeR:'#4a3020',expr:e,
    hair:'<path d="M58 124 Q54 70 100 66 Q146 70 142 124 Q132 92 100 88 Q68 92 58 124 Z" fill="#6a4228"/><circle cx="100" cy="62" r="16" fill="#6a4228"/>'});
  if(who==='tim')return face({skin:'#f0caa8',coat:'#6a7a3a',eyeL:'#2a4a6a',eyeR:'#2a4a6a',expr:e,
    hair:'<path d="M58 120 Q54 70 100 66 Q146 70 142 120 Q130 94 112 92 Q100 104 88 92 Q70 96 58 120 Z" fill="#a06a2a"/><g fill="#c48a5a"><circle cx="76" cy="140" r="2"/><circle cx="82" cy="144" r="2"/><circle cx="122" cy="142" r="2"/></g>'});
  if(who==='miner'||who==='hans')return face({skin:'#d9b08a',coat:'#3a5a7a',eyeL:'#4a3a2a',eyeR:'#4a3a2a',expr:e,
    hair:'<path d="M54 106 Q56 62 100 60 Q144 62 146 106 Z" fill="#c8a03a"/><rect x="50" y="100" width="100" height="10" fill="#7a6020"/><circle cx="100" cy="82" r="10" fill="#fff2a0"/>'});
  if(who==='guard')return face({skin:'#dcb894',coat:'#4a5868',eyeL:'#2a2a2a',eyeR:'#2a2a2a',expr:e,
    hair:'<path d="M56 104 Q60 66 100 64 Q140 66 144 104 Z" fill="#2a323c"/><rect x="50" y="98" width="100" height="10" fill="#c8a456"/>'});
  return '';
}
let faceToken=0;
function drawFace(who,en){
  const cv=$('st-face');if(!who){cv.hidden=true;return;}cv.hidden=false;const tok=++faceToken;
  const img=new Image();img.onload=()=>{if(tok!==faceToken)return;const g=cv.getContext('2d');g.clearRect(0,0,40,52);g.drawImage(img,0,0,40,52);
    const d=g.getImageData(0,0,40,52);for(let i=0;i<d.data.length;i+=4)for(let c=0;c<3;c++)d.data[i+c]=Math.round(d.data[i+c]/36)*36;g.putImageData(d,0,0);};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(portraitSVG(who,en));
}
