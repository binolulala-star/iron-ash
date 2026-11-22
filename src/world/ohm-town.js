/* ======================= TOWN 2.0 — free-roam Ohm Town ======================= */
/* ---- extra hi-res townsfolk ---- */
Object.assign(HRPAL,{
 marta:{skin:['#eec4a0','#c08c6a','#ffdcbc'],hair:['#5a3a2a','#3a2418','#7a5038'],coat:['#6a4a5a','#4a3040','#8a6478'],shirt:['#e6dccc','#b0a490','#fff4e4'],
   pants:['#4a3a40','#2e2428','#64505a'],boots:['#2e221c','#1a120e','#4a382c'],eyeN:'#5a3a2a',eyeF:'#5a3a2a',acc:'#c8b48a',acc2:'#8a7a5a',scarf:['#8a6a3a','#5e4626','#b08c52'],skirt:1},
 tim:{skin:['#f4d0ac','#cc9878','#ffe6cc'],hair:['#8a5a2e','#5e3a1a','#aa7440'],coat:['#5a6a3a','#3e4a26','#788a52'],shirt:['#e8e0cc','#b4a88c','#fff8e8'],
   pants:['#5a4a3a','#3a2e22','#766450'],boots:['#3a2a1e','#20160e','#584030'],eyeN:'#3a2a1e',eyeF:'#3a2a1e',acc:'#c8a456',acc2:'#7e6630',cap:['#4a4a52','#2e2e36','#64646e']},
 folkA:{skin:['#e8bc94','#b8845e','#fcd6b2'],hair:['#3a2e26','#221a14','#54443a'],coat:['#5a4a3a','#3c3026','#7a6650'],shirt:['#d8ccb4','#a49880','#f0e6d0'],
   pants:['#34343e','#20202a','#4a4a56'],boots:['#2a1e16','#160e08','#44342a'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#b0a080',acc2:'#6a5a40',cap:['#4a4036','#2e2620','#66584a']},
 folkB:{skin:['#f0c8a6','#c49272','#ffe0c4'],hair:['#2e2a30','#1a161c','#4a444e'],coat:['#3e5a5a','#283e3e','#5a7c7c'],shirt:['#ece4d4','#b8ae9a','#fffaf0'],
   pants:['#3a3a44','#24242c','#52525e'],boots:['#2a201a','#160e0a','#443428'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#d8c8a0',acc2:'#8a7a58',skirt:1},
 folkC:{skin:['#e0b490','#ae7e5c','#f4cca8'],hair:['#c8c4bc','#9a968e','#e8e4dc'],coat:['#3a3a46','#24242e','#545462'],shirt:['#c8c0ae','#968e7c','#e6dece'],
   pants:['#2e2e36','#1c1c22','#44444e'],boots:['#2a1e16','#160e08','#44342a'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#8a7a5a',acc2:'#5a4a30',cap:['#26262c','#141418','#3a3a44']},
});
{const o=drawTorso;drawTorso=function(g,r,C,kind){o(g,r,C,kind);
  if(C.skirt){const L=r.L*D2R,rot=v=>[v[0]*Math.cos(L)-v[1]*Math.sin(L),v[0]*Math.sin(L)+v[1]*Math.cos(L)],at=v=>add(r.hip,rot(v));
    poly(g,[at([-5.4,-2]),at([5.4,-2]),at([7,14]),at([-7.5,14])],C.coat[1]);poly(g,[at([-4,-2]),at([5,-2]),at([6.4,13]),at([-2,13])],C.coat[0]);
    poly(g,[at([-1,-1]),at([4,-1]),at([4.6,11]),at([0,11])],C.acc);}};}
{const o=drawHead;drawHead=function(g,r,C,kind,eye){
  if(['ryan','claire','miner','guard'].includes(kind))return o(g,r,C,kind,eye);
  const [x,y]=r.head;
  ell(g,x,y,5.6,6,C.skin[1]);ell(g,x+.6,y-.4,5,5.4,C.skin[0]);poly(g,[[x+2,y+3],[x+5.6,y+1.5],[x+4.8,y+5],[x+1,y+6]],C.skin[0]);rect(g,x+5,y,1,2,C.skin[1]);
  if(eye==='closed'){rect(g,x+1,y,3,1,'#3a2420');}else{rect(g,x+1,y-1,2,3,'#1a1418');rect(g,x+1,y-1,1,1,'#ffffff');rect(g,x+4,y-1,1,3,'#1a1418');}
  rect(g,x+2,y+3.4,2,1,'#8a4a3a');
  if(kind==='marta'){poly(g,[[x-6.5,y+2],[x-6,y-6],[x-1,y-8.6],[x+4,y-8],[x+6.6,y-4.5],[x+5.6,y-3],[x-1,y-4],[x-3,y+1],[x-5,y+8],[x-8,y+6]],C.scarf[0]);
    poly(g,[[x-1,y-8],[x+4,y-7.4],[x+2,y-6]],C.scarf[2]);poly(g,[[x-6,y+3],[x-8,y+6],[x-5,y+8]],C.scarf[1]);rect(g,x+1,y-3.6,4,1,C.hair[0]);}
  if(kind==='tim'||kind==='folkA'){poly(g,[[x-6,y-1],[x-5.5,y-6],[x-1,y-8],[x+4,y-7.5],[x+6,y-4.6],[x-6,y-3]],C.cap[0]);poly(g,[[x+1,y-4.6],[x+9,y-4],[x+8.6,y-3],[x+1,y-3.4]],C.cap[1]);
    poly(g,[[x-1,y-7.6],[x+3,y-7.2],[x+1,y-6]],C.cap[2]);rect(g,x-6,y-2,2,4,C.hair[0]);if(kind==='folkA')rect(g,x+1,y+2,4,2,C.hair[1]);}
  if(kind==='folkB'){poly(g,[[x-6,y+1],[x-5.5,y-6],[x-1,y-8.4],[x+4,y-7.6],[x+6.4,y-4],[x+5,y-2.6],[x+1,y-4.4],[x-2,y-3],[x-4,y+3]],C.hair[0]);ell(g,x-5,y-6,3,3,C.hair[0]);ell(g,x-4.4,y-6.6,1.4,1.2,C.hair[2]);}
  if(kind==='folkC'){poly(g,[[x-6.4,y-3],[x+7,y-3],[x+7,y-2],[x-6.4,y-2]],C.cap[1]);poly(g,[[x-4.6,y-3],[x-4.2,y-9],[x+4.6,y-9],[x+5,y-3]],C.cap[0]);rect(g,x-4,y-4.4,9,1,C.acc);
    poly(g,[[x+1,y+2],[x+6,y+1.4],[x+5,y+7],[x+1,y+6]],C.hair[0]);rect(g,x-6,y-2,2,4,C.hair[1]);}
};}
HPOSE.walk1={lean:5,head:0,fa:[-26,30],ba:[24,24],fl:[26,-6],bl:[-24,-26],dx:0};
HPOSE.walk2={lean:4,head:1,fa:[-4,24],ba:[4,20],fl:[4,-30],bl:[-4,-6],dx:0,dy:-1};
HPOSE.walk3={lean:5,head:0,fa:[24,24],ba:[-26,30],fl:[-24,-26],bl:[26,-6],dx:0};
HPOSE.walk4={lean:4,head:1,fa:[4,20],ba:[-4,24],fl:[-4,-6],bl:[4,-30],dx:0,dy:-1};
const HRW={};
function hrWalk(kind){if(HRW[kind])return HRW[kind];return HRW[kind]=['walk1','walk2','walk3','walk4'].map(n=>tex(humanHR(kind,HPOSE[n],n)));}
function hrIdle(kind){return [tex(humanHR(kind,HPOSE.idle0,'idle0')),tex(humanHR(kind,HPOSE.idle1,'idle1'))];}
const HRI={};
function hrChar(kind,h){const idle=HRI[kind]||(HRI[kind]=hrIdle(kind));const s=makeSprite(idle,h||1.75,{kind,speed:1.6});s.idleF=idle;s.walkF=hrWalk(kind);
  s.walking=false;s.setWalk=on=>{if(on===s.walking)return;s.walking=on;s.setFrames(on?s.walkF:s.idleF);s.speed=on?8:1.6;};return s;}
const TOWN_KIND={ryan:'ryan',claire:'claire',marta:'marta',tim:'tim',miner:'miner',guard:'guard',folkA:'folkA',folkB:'folkB',folkC:'folkC'};

/* ---- 32px textures ---- */
const TEX2={};
function T2(kind){if(TEX2[kind])return TEX2[kind];const N=32,c=cvs(N,N),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;const noise=(base,cols,n)=>{P(base,0,0,N,N);for(let k=0;k<n;k++)P(cols[(r()*cols.length)|0],(r()*N)|0,(r()*N)|0,1+(r()*2|0),1);};
  if(kind==='cobble'){P('#2c2a2c',0,0,N,N);const st=[[0,0,9,7],[10,0,11,6],[22,0,10,7],[0,8,6,7],[7,7,10,8],[18,8,8,7],[27,8,5,7],[0,16,11,7],[12,16,8,7],[21,16,11,7],[0,24,7,8],[8,24,10,8],[19,24,6,8],[26,24,6,8]];
    st.forEach(([x,y,w,h])=>{P('#4a4644',x+1,y+1,w-1,h-1);P('#57524e',x+1,y+1,w-2,1);P('#3a3634',x+1,y+h-1,w-1,1);if(r()<.4)P('#5e6670',x+2,y+2,2,1);});}
  if(kind==='mud'){noise('#2e2a24',['#36302a','#26221e','#3c362e','#2a2a2a'],260);for(let k=0;k<6;k++)P('#1e2228',(r()*28)|0,(r()*30)|0,4,1);}
  if(kind==='plaster'){noise('#8a8070',['#948a7a','#7e7464','#9a9080','#766c5e'],200);for(let k=0;k<4;k++)P('#6a6052',(r()*28)|0,(r()*30)|0,3,2);}
  if(kind==='brick2'){P('#3e3430',0,0,N,N);for(let y=0;y<N;y+=4){const o=(y/4)%2?0:5;for(let x=-o;x<N;x+=10){const col=['#6a4a3c','#5e4034','#744e3e','#5a3e30'][(r()*4)|0];P(col,x+1,y+1,9,3);P('#86604c',x+1,y+1,9,1);}}}
  if(kind==='slate'){P('#22262e',0,0,N,N);for(let y=0;y<N;y+=5){const o=(y/5)%2?0:4;for(let x=-o;x<N;x+=8){P(['#3a4250','#343a46','#404858'][(r()*3)|0],x+1,y,7,4);P('#4c5666',x+1,y,7,1);}}}
  if(kind==='rustroof'){P('#3a2418',0,0,N,N);for(let x=0;x<N;x+=4){P('#6a3e26',x,0,3,N);P('#84502e',x,0,1,N);}for(let k=0;k<40;k++)P('#4a2a1a',(r()*N)|0,(r()*N)|0,2,1);}
  if(kind==='plank'){P('#3a2818',0,0,N,N);for(let y=0;y<N;y+=6){P('#5a3e26',0,y+1,N,5);P('#6c4c30',0,y+1,N,1);for(let k=0;k<3;k++)P('#46301c',(r()*N)|0,y+2+((r()*3)|0),5,1);P('#2a1c10',(r()*N)|0,y+1,1,5);}}
  if(kind==='stoneW'){P('#2a2c2a',0,0,N,N);for(let y=0;y<N;y+=8){const o=(y/8)%2?0:7;for(let x=-o;x<N;x+=14){P(['#4a4c48','#424440','#52544e'][(r()*3)|0],x+1,y+1,13,7);P('#5c5e58',x+1,y+1,13,1);}}}
  if(kind==='canal'){noise('#24402a',['#2c4e32','#1e3622','#36603a'],120);for(let k=0;k<10;k++)P('#7ab070',(r()*26)|0,(r()*N)|0,5,1);}
  if(kind==='slag'){noise('#24201e',['#2e2826','#1a1716','#3a302a','#4a3a2a'],300);}
  const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return TEX2[kind]=t;}
function mat2(k,rx,ry,o={}){const t=T2(k).clone();t.needsUpdate=true;t.repeat.set(rx,ry);return new THREE.MeshStandardMaterial(Object.assign({map:t,roughness:.92},o));}
function labelTex(text,w=128,h=32,bg='#2a1c10',fg='#e8c878'){const c=cvs(w,h),g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=fg;g.lineWidth=2;g.strokeRect(2,2,w-4,h-4);
  g.fillStyle=fg;g.font=`bold ${Math.round(h*.56)}px "Noto Serif TC",serif`;g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+1);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;}

/* ---- layout ---- */
const TW={W:64,H:48};
const TOWN_B=[ /* x0,z0,x1,z1,h,style,roof,front(+1 south/-1 north),sign,extras */
 [3,14,10,20,3.4,'plank','rustroof',1,'奧姆站',{station:1,facade:'oh_station'}],
 [12,15,17,20,4,'plaster','slate',1,'雜貨',{awning:'#7a2a22',facade:'oh_store'}],
 [18,14,24.5,20,5,'brick2','slate',1,'黑煤酒館',{awning:'#2a4a3a',chim:1,facade:'oh_tavern',fb:.38}],
 [27,8.5,37,17,5.2,'stoneW','slate',1,'鎮公所',{tower:1,facade:'oh_hall'}],
 [40,15,45,20,4,'plaster','rustroof',1,null,{chim:1,facade:'oh_house'}],
 [51,14,57,20,4.2,'brick2','rustroof',1,'機械工坊',{chim:1,gear:1,facade:'oh_works',fb:.45}],
 [3,28,9,33,3.4,'plank','rustroof',-1,null,{facade:'oh_shack'}],
 [12,28,18,34,4.2,'plaster','slate',-1,null,{chim:1,facade:'oh_house'}],
 [19,28,25,34,4.2,'brick2','slate',-1,null,{facade:'oh_brick'}],
 [39,28,45,34,4.2,'plaster','slate',-1,null,{chim:1,facade:'oh_house',fb:.6}],
 [46,28,53,34,4.4,'plank','rustroof',-1,'第二倉庫',{facade:'oh_ware'}],
 [54.5,28,57.5,33,3.6,'brick2','rustroof',-1,null,{facade:'oh_brick',fb:.4}],
 [5,43,10,46.5,3.6,'plaster','slate',-1,null,{chim:1,facade:'oh_house',fb:.35}],
 [18,43,23,46.5,3.8,'brick2','rustroof',-1,null,{facade:'oh_brick',fb:.6}],
 [37,43,42,46.5,3.6,'plaster','slate',-1,null,{chim:1,facade:'oh_house',fb:.45}],
 [45,43,49,46.5,3.2,'plank','rustroof',-1,null,{facade:'oh_shack',fb:.4}],
];
const TOWN_ZONES=[
 {r:[1,13,11,27],name:'奧姆站前'},{r:[11,13,26,28],name:'礦工街'},{r:[26,13,39,31],name:'中央廣場'},{r:[39,13,57,28],name:'礦工街・東段'},
 {r:[56,13,63,31],name:'水塔'},{r:[40,1,63,13],name:'礦坑區',danger:1},{r:[44,31,63,39],name:'倉庫後巷',danger:1},
 {r:[1,34,63,42],name:'酸蝕運河'},{r:[1,42,63,47],name:'運河南岸住宅'},{r:[1,27,44,34],name:'礦工街・南側'}];
const CANAL={z0:38.6,z1:41.2,bridges:[[13.5,16.5],[30.5,33.5],[49.5,52.5]]};
function townColliders(){
  const box=[],circ=[];
  TOWN_B.forEach(b=>box.push([b[0],b[1],b[2],b[3]]));
  box.push([0,0,40,12.6]);box.push([0,0,64,1]);box.push([0,47,64,48]);box.push([0,0,1,48]);box.push([63,0,64,48]);
  box.push([26,0,40,8.6]);
  let x=0;CANAL.bridges.forEach(([a,b])=>{box.push([x,CANAL.z0,a,CANAL.z1]);x=b;});box.push([x,CANAL.z0,64,CANAL.z1]);
  box.push([40,0,64,1.6]);box.push([52,1,58,3]);
  circ.push([32,24,2.5]);circ.push([59.6,24,2.4]);
  [[44,5,2.2],[50,9,1.8],[58,9,2],[42,10,1.4]].forEach(c=>circ.push(c));
  return{box,circ};}
const TOWN_PROPS={
 lamps:[[11,21],[26,21.2],[38,21.2],[50,21],[11,27.6],[26,27],[38,27],[50,27.6],[5,37.2],[24,37.2],[36,37.2],[56,37.2],[47.5,12.8],[29,30.5],[35,30.5]],
 crates:[[2.6,25.6],[2.6,26.6],[3.6,25.6],[46,35],[47,35],[46,36],[55,36],[56,36],[58,33.6],[61,35],[44.6,9],[45.6,9],[60,9.4]],
 barrels:[[17.6,21.2],[24.8,21.6],[57.8,21.4],[44.6,26.2],[53.6,35.4],[60,37],[42,6]],
 trees:[[12,36],[27,36.4],[42,36.2],[3,44],[15,44.5],[28,44.5],[34,44],[53,44.5],[60,44]],
 puddles:[[16,24,1.4],[29,22,1],[43,25,1.6],[54,23,1.1],[9,25,1.2],[36,34,1],[20,36,1.4],[48,36,1.2]],
};
MAPS.town={name:'奧姆鎮',theme:'town',free:1,enc:false,table:[['miner','miner'],['miner','hound'],['miner','miner','miner'],['hound','hound']],start:[6.5,23.2],rest:[35.5,19.4],
  grid:Array(TW.H).fill('.'.repeat(TW.W)),
  obj:()=>P.flags.marta?'前往鎮東的水塔，從水塔底下進入地下水道':'在鎮上打聽消息（瑪塔住在礦工街南側）',
  events:[
   {id:'notice',kind:'board',at:[26.4,20.7],label:'廣場告示板',talk:'notice'},
   {id:'marta',kind:'npc',who:'marta',at:[15,27.3],label:'瑪塔',talk:'marta',after:()=>{P.flags.marta=1;}},
   {id:'dazed',kind:'npc',who:'miner',at:[23.6,23.4],label:'發呆的礦工',talk:'dazed'},
   {id:'tim',kind:'npc',who:'tim',at:[32,37.3],label:'提姆',talk:'tim',after:()=>{P.flags.tim=1;}},
   {id:'stove',kind:'stove',at:[34.2,18.4],label:'鎮公所門廊的暖爐（休息・整備）',rest:true},
   {id:'chest1',kind:'chest',at:[3.6,24.6],label:'車站的遺失物箱',loot:{Fe:2,C:2},items:['amulet','bandage']},
   {id:'chest4',kind:'chest',at:[60.6,5.6],label:'礦坑口的補給箱',loot:{Fe:3,Si:2},items:['capsule']},
   {id:'chest5',kind:'chest',at:[61.8,32.4],label:'後巷的舊工具箱',loot:{Al:2,C:1},items:['coffee']},
   {id:'station',kind:'npc',who:'folkA',at:[8.2,21.4],label:'站務員',talk:'tStation'},
   {id:'shop',kind:'npc',who:'folkB',at:[14.4,20.9],label:'雜貨店老闆娘',fn:ev=>townShop(ev)},
   {id:'tavern',kind:'npc',who:'folkC',at:[21.2,20.8],label:'酒館的老礦工',talk:'tTavern',after:()=>{if(!P.flags.tavernGift){P.flags.tavernGift=1;const n=addLoot('capsule');toast('老礦工塞給你一個'+n+'。');}}},
   {id:'statue',kind:'sign',at:[32,26.9],label:'創鎮鍊金術師像',talk:'tStatue'},
   {id:'mech',kind:'npc',who:'folkA',at:[54,21],label:'機械工坊的技師',talk:'tMech',after:()=>{if(!P.flags.mechGift){P.flags.mechGift=1;const n=addLoot('piston');toast('取得 '+n+'。');}}},
   {id:'queue',kind:'npc',who:'miner',at:[48,10.8],label:'排隊的礦工',talk:'tQueue'},
   {id:'canal',kind:'sign',at:[24,37.6],label:'運河邊的警示牌',talk:'tCanal'},
   {id:'exit',kind:'exit',at:[57,24],r:.9,label:'水塔底下的排水口',cond:()=>P.flags.marta,deny:'先向鎮民打聽通往機庫的路。',go:()=>enterMap('sewer')},
  ]};
Object.assign(SCENES,{
 tStation:[{n:'站務員：「列車？從上個月起就只剩軍用車了。鐵軌往北接到第三機庫，礦工一車一車被載上去，再也沒看他們坐車回來。」'},
   {who:'ryan',e:'Default_Cold',t:'鐵軌直通機庫……難怪物資補給這麼快。'}],
 tTavern:[{n:'老礦工：「我老了，不夠格去做『體檢』，這才保住一顆清醒的腦袋。」他把杯裡的劣酒一口喝乾。'},
   {n:'老礦工：「那些傢伙回來後，連痛都不會喊了。小夥子，你身上有鍊金術師的味道……拿著，這是我年輕時從礦脈裡挖出來的東西，比待在我口袋裡有用。」'},
   {who:'claire',e:'Default_Grin',t:'謝啦，大叔。等礦工們回來，第一杯算我們的。'}],
 tStatue:[{n:'銘牌：「奧姆鎮創鎮者　鍊金術師　艾爾文・奧姆　——『等價，是對大地的承諾』」雕像手上的音叉，早已被酸雨蝕出了坑洞。'},
   {who:'ryan',e:'Fork_Gaze',t:'……等價是承諾。不是拿來交換人命的藉口。'}],
 tMech:[{n:'技師：「喲，那隻鋼臂是中央工房的貨吧？活塞磨得厲害喔。來，這個高壓活塞送妳，反正憲兵把我的訂單都收走了。」'},
   {who:'claire',e:'Default_Grin',t:'……眼光不錯嘛。謝了，大叔！'}],
 tQueue:[{n:'礦工們排成一列，面帶微笑地望著北方的機庫。'},{who:'miner',e:'Smile',t:'下一批……輪到我們了……很光榮……一點都不痛……'},
   {who:'claire',e:'Hurt',t:'他們連鞋子都沒穿……'},{who:'ryan',e:'Default_Cold',t:'先別驚動他們。礦坑這一帶有失控的礦工和巡邏犬，小心點。'}],
 tCanal:[{n:'警示牌：「運河水已遭精煉廢液污染，嚴禁飲用、洗滌、垂釣。——奧姆鎮公所」底下有人用炭筆補了一行：「那就叫機庫別再倒了啊」。'}],
});
function townShop(ev){
  const st=P.stash,has=(k,n)=>(st[k]||0)>=n,pay=(k,n)=>{st[k]-=n;},ok=t=>{toast(t);saveRun('map');};
  playScene([{n:'雜貨店老闆娘：「錢？那東西早就買不到糧了。拿元素來換吧，鍊金術師先生。」'},{choice:[
    {t:`蒸氣繃帶 ←  Fe×2（持有 Fe×${st.Fe||0}）`,fn:()=>{if(!has('Fe',2)){toast('Fe 不夠。打倒敵人或分解廢鐵可以取得。');}else{pay('Fe',2);addLoot('bandage');ok('取得 蒸氣繃帶。');}backToMap();}},
    {t:`濃縮黑咖啡 ←  C×2（持有 C×${st.C||0}）`,fn:()=>{if(!has('C',2)){toast('C 不夠。');}else{pay('C',2);addLoot('coffee');ok('取得 濃縮黑咖啡。');}backToMap();}},
    {t:`元素膠囊 ←  Si×2（持有 Si×${st.Si||0}）`,fn:()=>{if(!has('Si',2)){toast('Si 不夠。');}else{pay('Si',2);addLoot('capsule');ok('取得 元素膠囊。');}backToMap();}},
    {t:'不用了',fn:()=>backToMap()}]}],null,{keep:true,actors:exActors()});}

/* ---- builder ---- */
function instMesh(geo,mat,list,cast){if(!list.length)return null;const m=new THREE.InstancedMesh(geo,mat,list.length);const o=new THREE.Object3D();
  list.forEach((t,i)=>{o.position.set(t[0],t[1],t[2]);o.rotation.set(0,t[3]||0,0);o.scale.set(t[4]||1,t[5]||1,t[6]||1);o.updateMatrix();m.setMatrixAt(i,o.matrix);});
  m.castShadow=!!cast;m.receiveShadow=true;E.world.add(m);return m;}
function roofPrism(len,dep,h,mat){const sh=new THREE.Shape();sh.moveTo(-dep/2,0);sh.lineTo(dep/2,0);sh.lineTo(0,h);sh.lineTo(-dep/2,0);
  const g=new THREE.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false});g.translate(0,0,-len/2);const m=new THREE.Mesh(g,mat);m.rotation.y=Math.PI/2;m.castShadow=true;m.receiveShadow=true;return m;}
function buildTown(M){
  clearWorld();setFog(0x121824,.62);E.scene.fog.near=13;E.scene.fog.far=36;
  const W0=TW.W,H0=TW.H,halos=[];
  // ground
  const gnd=new THREE.Mesh(new THREE.PlaneGeometry(W0+20,H0+20),mat2('mud',(W0+20)/3,(H0+20)/3));gnd.rotation.x=-Math.PI/2;gnd.position.set(W0/2,0,H0/2);gnd.receiveShadow=true;E.world.add(gnd);
  const cob=(x0,z0,x1,z1)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),envMat('oh_cobble',(x1-x0)/3.2,(z1-z0)/3.2,{emissiveIntensity:0,color:0xb8b8c0}));m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,.01,(z0+z1)/2);m.receiveShadow=true;E.world.add(m);};
  cob(1,20.4,63,27.6);cob(26,17,38,31);cob(46,1.6,50.5,20.5);cob(30,31,34,38.6);cob(11,34,63,38.4);cob(14,27.6,16.4,34);
  const plz=new THREE.Mesh(new THREE.CircleGeometry(7,40),envMat('oh_cobble',4.4,4.4,{emissiveIntensity:0,color:0xb8b8c0}));plz.rotation.x=-Math.PI/2;plz.position.set(32,.015,24);plz.receiveShadow=true;E.world.add(plz);
  const ringM=new THREE.Mesh(new THREE.RingGeometry(6.6,7,40),new THREE.MeshStandardMaterial({color:0x5a5450,roughness:.8}));ringM.rotation.x=-Math.PI/2;ringM.position.set(32,.02,24);E.world.add(ringM);
  // puddles
  TOWN_PROPS.puddles.forEach(([x,z,r])=>{const p=new THREE.Mesh(new THREE.CircleGeometry(r*.6,16),new THREE.MeshStandardMaterial({color:0x2a3240,roughness:.05,metalness:.9,transparent:true,opacity:.55,depthWrite:false}));p.rotation.x=-Math.PI/2;p.scale.y=.55;p.position.set(x,.025,z);E.world.add(p);});
  // buildings
  X.bld=[];TOWN_B.forEach(([x0,z0,x1,z1,h,style,roof,front,sign,ex])=>{
    const start=E.world.children.length,winF=[],winL=[],winD=[];
    const w=x1-x0,d=z1-z0,cx=(x0+x1)/2,cz=(z0+z1)/2,fz=front>0?z1:z0,fo=front>0?.02:-.02,rotF=front>0?0:Math.PI;
    const wall=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat2(style,w/2,h/2));wall.position.set(cx,h/2,cz);wall.castShadow=true;wall.receiveShadow=true;E.world.add(wall);
    const base=new THREE.Mesh(new THREE.BoxGeometry(w+.16,.5,d+.16),mat2('stoneW',w/2,.25));base.position.set(cx,.25,cz);E.world.add(base);
    if(ex.facade){const pl=new THREE.Mesh(new THREE.PlaneGeometry(w,h-.5),facadeMat(ex.facade,w,h-.5,ex.fb));pl.position.set(cx,.5+(h-.5)/2,fz+fo*1.5);pl.rotation.y=rotF;pl.receiveShadow=true;E.world.add(pl);}
    if(style==='plaster'&&!ex.facade){[x0+.1,x1-.1,cx].forEach(bx=>block(.2,h,.08,bx,0,fz+fo*4,new THREE.MeshStandardMaterial({color:0x3a2616,roughness:.9})));block(w,.2,.08,cx,h*.52,fz+fo*4,new THREE.MeshStandardMaterial({color:0x3a2616}));}
    const rh=ex.tower?2.2:1.4+d*.12;const rf=roofPrism(w+.6,d+.9,rh,mat2(roof,(w+.6)/2,1.2));rf.position.set(cx,h,cz);E.world.add(rf);
    if(ex.chim){block(.6,1.6,.6,x0+w*.75,h+rh*.4,cz-d*.18,mat2('brick2',.4,.8));if(Math.random()<.9)smokeAt(x0+w*.75,h+rh*.4+1.7,cz-d*.18);}
    // windows on facade
    const floors=h>5?2:1;for(let f=0;f<(ex.facade?0:floors);f++){const wy=1.7+f*2.1;for(let wx=x0+1;wx<=x1-1;wx+=1.7){if(Math.abs(wx-cx)<.9&&f===0)continue;
      winF.push([wx,wy,fz+fo*3,rotF]);(Math.random()<.55?winL:winD).push([wx,wy,fz+fo*6,rotF]);}}
    for(let f=0;f<floors;f++){const wy=1.7+f*2.1;for(let wz=z0+1.2;wz<=z1-1.2;wz+=2.2){winF.push([x1+.03,wy,wz,Math.PI/2]);(Math.random()<.4?winL:winD).push([x1+.06,wy,wz,Math.PI/2]);winF.push([x0-.03,wy,wz,-Math.PI/2]);(Math.random()<.4?winL:winD).push([x0-.06,wy,wz,-Math.PI/2]);}}
    // door
    if(!ex.facade){const door=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2),mat2('plank',.5,1,{color:0x8a6a50}));door.position.set(cx,1,fz+fo*5);door.rotation.y=rotF;E.world.add(door);
    block(1.5,.16,.7,cx,0,fz+front*.35,mat2('stoneW',.6,.2));}
    if(!ex.facade){const bulb=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),new THREE.MeshBasicMaterial({color:0xffd890}));bulb.position.set(cx+.8,2.3,fz+front*.25);E.world.add(bulb);halos.push([cx+.8,fz+front*1.2,1.6]);}else halos.push([cx,fz+front*1.2,2]);
    if(sign&&!ex.facade){const sm=new THREE.Mesh(new THREE.PlaneGeometry(Math.max(1.8,sign.length*.55),.55),new THREE.MeshBasicMaterial({map:labelTex(sign,Math.max(96,sign.length*36),28)}));sm.position.set(cx,2.6+(h>5?.6:0),fz+fo*8);sm.rotation.y=rotF;E.world.add(sm);}
    if(ex.awning&&!ex.facade){const aw=new THREE.Mesh(new THREE.PlaneGeometry(w*.8,1.3),new THREE.MeshStandardMaterial({color:new THREE.Color(ex.awning),side:THREE.DoubleSide,roughness:.9}));
      aw.position.set(cx,2.25,fz+front*.55);aw.rotation.x=front>0?-Math.PI*.33:Math.PI*.33;aw.rotation.y=rotF===0?0:0;aw.castShadow=true;E.world.add(aw);}
    if(ex.tower){block(3,5.5,3,cx,h,cz,mat2('stoneW',1.5,2.6));const rp=roofPrism(3.6,3.6,2.4,mat2('slate',1.5,1));rp.position.set(cx,h+5.5,cz);E.world.add(rp);
      const cc=cvs(64,64),g=cc.getContext('2d');g.fillStyle='#e8dcb4';g.beginPath();g.arc(32,32,29,0,7);g.fill();g.strokeStyle='#2a2018';g.lineWidth=3;g.stroke();g.lineWidth=4;g.beginPath();g.moveTo(32,32);g.lineTo(32,12);g.moveTo(32,32);g.lineTo(46,38);g.stroke();
      for(let k=0;k<12;k++){const a=k/12*Math.PI*2;g.fillStyle='#2a2018';g.fillRect(32+Math.sin(a)*24-1,32-Math.cos(a)*24-1,3,3);}
      const ck=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(cc),emissive:0x5a4a20,emissiveIntensity:.8}));ck.position.set(cx,h+3.8,cz+1.52);E.world.add(ck);
      const pl=new THREE.PointLight(0xffc070,1.4,10);pl.position.set(cx,2.6,z1+1.6);E.world.add(pl);flicker(pl,1.4,.2,2);
      if(!ex.facade){[[x0+1.5],[x1-1.5]].forEach(([px])=>block(.5,3,.5,px,0,z1+.6,mat2('stoneW',.3,1.5)));block(w-2,.4,1.4,cx,3,z1+.6,mat2('slate',4,.6));}}
    if(ex.station){block(w+5,.35,3.6,cx,0,12.2,mat2('stoneW',4,1));for(let px=x0-2;px<=x1+2;px+=3)block(.25,3.4,.25,px,.35,13.6,new THREE.MeshStandardMaterial({color:0x2a2a2e,metalness:.6}));
      block(w+5.4,.2,2.8,cx,3.75,12.6,mat2('rustroof',4,1));
      for(let k=0;k<2;k++)block(26,.08,.12,13,0,10.2+k*1.1,new THREE.MeshStandardMaterial({color:0x5a5a64,metalness:.8,roughness:.4}));
      for(let tx=0;tx<26;tx+=.9)block(.2,.05,1.6,tx,0,10.75,mat2('plank',.2,.5));
      const car=block(7,2.6,2.4,18,.5,10.8,mat2('rustroof',4,1.5,{metalness:.5}));for(let k=0;k<3;k++)winL.push([15.8+k*2.2,2.1,12.02,0]);}
    if(ex.gear){const gm=new THREE.Mesh(new THREE.TorusGeometry(.5,.14,6,12),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8,roughness:.3}));gm.position.set(cx+2,3.4,fz+front*.1);E.world.add(gm);E.fxs.push(dt=>{gm.rotation.z+=dt*.6;});}
    instMesh(WG.f,new THREE.MeshStandardMaterial({color:0x2a1c12,roughness:.9}),winF,false);instMesh(WG.w,new THREE.MeshBasicMaterial({color:0xffc070}),winL,false);instMesh(WG.w,new THREE.MeshStandardMaterial({color:0x1a2232,roughness:.2,metalness:.6}),winD,false);
    X.bld.push({meshes:E.world.children.slice(start).filter(o=>o.isMesh),box:new THREE.Box3(new THREE.Vector3(x0-.5,0,z0-.6),new THREE.Vector3(x1+.5,h+rh+(ex.tower?8:0),z1+.6)),f:1});
  });
  // retaining wall + hillside behind the north row
  block(2.5,2.6,.8,25.75,0,13.4,mat2('stoneW',1,1.2));block(3,2.6,.8,38.5,0,13.4,mat2('stoneW',1,1.2));block(14,1.6,.6,17,0,13.4,mat2('stoneW',6,.8));const hill=new THREE.Mesh(new THREE.BoxGeometry(44,7,12),mat2('slag',10,3));hill.position.set(19,3,3);E.world.add(hill);
  block(14,4,.8,33,0,8.4,mat2('stoneW',5,1.6));
  // fences around the map edge
  const fm=new THREE.MeshStandardMaterial({color:0x2a2018,roughness:.9});for(let x=1;x<63;x+=2){block(.12,1,.12,x,0,47,fm);}block(62,.12,.08,32,.75,47,fm);
  for(let z=13;z<47;z+=2){block(.12,1,.12,63,0,z,fm);block(.12,1,.12,1,0,z,fm);}
  // fountain + statue
  const bas=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,.7,24),mat2('stoneW',6,.4));bas.position.set(32,.35,24);bas.castShadow=true;bas.receiveShadow=true;E.world.add(bas);
  const wat=new THREE.Mesh(new THREE.CircleGeometry(2.1,24),new THREE.MeshStandardMaterial({color:0x2a5a4a,roughness:.1,metalness:.5,emissive:0x0a2a20}));wat.rotation.x=-Math.PI/2;wat.position.set(32,.62,24);E.world.add(wat);
  block(.9,1.6,.9,32,.6,24,mat2('stoneW',.5,1));const st=new THREE.Mesh(new THREE.CylinderGeometry(.32,.42,1.6,8),new THREE.MeshStandardMaterial({color:0x4a6a5a,metalness:.6,roughness:.5}));st.position.set(32,3,24);st.castShadow=true;E.world.add(st);
  const sh2=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),st.material);sh2.position.set(32,4,24);E.world.add(sh2);block(.08,1.4,.08,32.45,3.2,24,new THREE.MeshStandardMaterial({color:0x8aa89a,metalness:.8}));
  // water tower (exit)
  const tank=new THREE.Mesh(new THREE.CylinderGeometry(2,2,2.8,16),mat2('rustroof',6,1,{metalness:.5}));tank.position.set(59.6,6,24);tank.castShadow=true;E.world.add(tank);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(2.2,1.2,16),mat2('slate',4,1));cap.position.set(59.6,8,24);E.world.add(cap);
  [[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4],[1.4,1.4]].forEach(([a,b])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,4.6,6),new THREE.MeshStandardMaterial({color:0x2a2420,metalness:.6}));l.position.set(59.6+a,2.3,24+b);l.castShadow=true;E.world.add(l);});
  const hatch=new THREE.Mesh(new THREE.CylinderGeometry(.75,.8,.12,20),new THREE.MeshStandardMaterial({color:0x2a2e34,metalness:.8,roughness:.4}));hatch.position.set(57.6,.06,24);E.world.add(hatch);for(let k=-2;k<=2;k++)block(.08,.04,1.2,57.6+k*.25,.12,24,new THREE.MeshStandardMaterial({color:0x5ab88a,emissive:0x2a8a4a}));
  const wl=new THREE.PointLight(0x7aff9a,1.2,7);wl.position.set(57.6,1,24);E.world.add(wl);flicker(wl,1.2,.4,3);
  // canal
  const cm=new THREE.Mesh(new THREE.PlaneGeometry(64,CANAL.z1-CANAL.z0),mat2('canal',20,1,{roughness:.1,metalness:.3,emissive:0x0c2a10}));cm.rotation.x=-Math.PI/2;cm.position.set(32,-.25,(CANAL.z0+CANAL.z1)/2);E.world.add(cm);
  E.fxs.push(dt=>{cm.material.map.offset.x+=dt*.05;});
  [CANAL.z0,CANAL.z1].forEach(z=>block(64,.35,.3,32,-.1,z,mat2('stoneW',20,.2)));
  CANAL.bridges.forEach(([a,b])=>{const bm=new THREE.Mesh(new THREE.BoxGeometry(b-a,.3,CANAL.z1-CANAL.z0+.8),mat2('plank',2,1));bm.position.set((a+b)/2,.12,(CANAL.z0+CANAL.z1)/2);bm.receiveShadow=true;E.world.add(bm);
    [a+.1,b-.1].forEach(x=>{block(.12,.9,CANAL.z1-CANAL.z0+.8,x,.25,(CANAL.z0+CANAL.z1)/2,new THREE.MeshStandardMaterial({color:0x3a2a1a}));});});
  // mine area
  [[44,5,2.2,3],[50,9,1.8,2.4],[58,9,2,2.6],[42,10,1.4,1.8]].forEach(([x,z,r,h])=>{const c=new THREE.Mesh(new THREE.ConeGeometry(r,h,10),mat2('slag',2,1));c.position.set(x,h/2,z);c.castShadow=true;E.world.add(c);});
  block(6,4,2,55,0,2,mat2('stoneW',3,2));const mo=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.8),new THREE.MeshBasicMaterial({color:0x050505}));mo.position.set(55,1.4,3.02);E.world.add(mo);
  [[53.6],[56.4]].forEach(([x])=>block(.3,3,.3,x,0,3.1,mat2('plank',.2,1)));block(3.4,.3,.3,55,3,3.1,mat2('plank',1,.2));
  const ml=new THREE.PointLight(0xffa050,1.2,8);ml.position.set(55,2.6,4);E.world.add(ml);flicker(ml,1.2,.5,5);
  for(let k=0;k<2;k++)block(.12,.06,10,54.4+k*1.2,0,8,new THREE.MeshStandardMaterial({color:0x5a5a64,metalness:.8}));
  const cart=block(1.3,.8,1.8,55,.25,9,mat2('rustroof',1,1,{metalness:.5}));
  // props: lamps, crates, barrels, trees
  const lampPole=new THREE.CylinderGeometry(.06,.09,2.6,6),poleM=new THREE.MeshStandardMaterial({color:0x1e1e22,metalness:.7,roughness:.4});
  instMesh(lampPole,poleM,TOWN_PROPS.lamps.map(([x,z])=>[x,1.3,z]),true);
  instMesh(new THREE.BoxGeometry(.3,.38,.3),new THREE.MeshBasicMaterial({color:0xffd27a}),TOWN_PROPS.lamps.map(([x,z])=>[x,2.7,z]),false);
  TOWN_PROPS.lamps.forEach(([x,z])=>halos.push([x,z,2.4]));
  instMesh(new THREE.BoxGeometry(.8,.8,.8),mat2('plank',.5,.5),TOWN_PROPS.crates.map(([x,z])=>[x,.4,z,Math.random()*.4]),true);
  instMesh(new THREE.CylinderGeometry(.34,.34,.9,10),mat2('rustroof',1,.6),TOWN_PROPS.barrels.map(([x,z])=>[x,.45,z]),true);
  const trunkM=new THREE.MeshStandardMaterial({color:0x2a2018,roughness:1});
  TOWN_PROPS.trees.forEach(([x,z])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.1,.2,2.6,6),trunkM);t.position.set(x,1.3,z);t.castShadow=true;E.world.add(t);
    for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.03,.07,1.2,5),trunkM);b.position.set(x+Math.sin(k*1.7)*.35,2+k*.18,z+Math.cos(k*1.7)*.35);b.rotation.set(Math.cos(k*1.7)*.8,0,-Math.sin(k*1.7)*.8);b.castShadow=true;E.world.add(b);}});
  // windows
  // light pools (fake lights)
  const hm=new THREE.MeshBasicMaterial({map:haloTex(),color:0xffa850,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false});
  instMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),hm,halos.map(([x,z,r])=>[x,.04,z,0,r*2,1,r*2]),false);
  [[20,24],[44,24],[32,30.5],[48,8],[14,36]].forEach(([x,z])=>{const pl=new THREE.PointLight(0xffb060,1.5,9);pl.position.set(x,2.6,z);E.world.add(pl);flicker(pl,1.5,.25,2+x*.1);});
  // sun (moonlight) that follows the player for crisp shadows near the camera
  X.sun=keyLight(0xa8c0ff,.55,[0,12,0],null);X.sun.shadow.camera.left=-16;X.sun.shadow.camera.right=16;X.sun.shadow.camera.top=16;X.sun.shadow.camera.bottom=-16;X.sun.shadow.mapSize.set(2048,2048);
  E.world.add(X.sun.target);
  // rain that follows the player
  const rg=new THREE.BufferGeometry(),rn=420,ra=new Float32Array(rn*3);for(let i=0;i<rn;i++){ra[i*3]=(Math.random()-.5)*28;ra[i*3+1]=Math.random()*9;ra[i*3+2]=(Math.random()-.5)*24;}
  rg.setAttribute('position',new THREE.BufferAttribute(ra,3));X.rain=new THREE.Points(rg,new THREE.PointsMaterial({color:0x8ab0d8,size:.05,transparent:true,opacity:.75,depthWrite:false}));E.world.add(X.rain);
  E.fxs.push(dt=>{const a=rg.attributes.position.array;for(let i=0;i<rn;i++){a[i*3+1]-=dt*(9+(i%5));if(a[i*3+1]<0)a[i*3+1]+=9;}rg.attributes.position.needsUpdate=true;});
  // party + NPCs
  X.lead=hrChar('ryan',1.75);X.follow=hrChar('claire',1.75);E.world.add(X.lead.holder,X.follow.holder);
  X.events.forEach(ev=>{ev.hidden=ev.hideIf?ev.hideIf():false;const [x,z]=ev.at;let o=null;
    if(ev.kind==='npc'){const s=hrChar(TOWN_KIND[ev.who]||'folkA',ev.who==='tim'?1.3:1.75);s.holder.position.set(x,0,z);s.face(-1);ev.spr=s;o=s.holder;}
    if(ev.kind==='chest'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.45,.48),mat2('plank',.5,.4));b.position.y=.23;b.castShadow=true;
      const band=new THREE.Mesh(new THREE.BoxGeometry(.72,.07,.5),new THREE.MeshStandardMaterial({color:0xc8a456,metalness:.8,roughness:.3}));band.position.y=.36;o.add(b,band);o.position.set(x,0,z);if(ev.done)b.material=new THREE.MeshStandardMaterial({color:0x2a1e14});}
    if(ev.kind==='stove'){o=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.36,.9,12),mat2('rustroof',2,1,{metalness:.5}));b.position.y=.45;b.castShadow=true;
      const f=new THREE.Mesh(new THREE.BoxGeometry(.22,.16,.05),new THREE.MeshBasicMaterial({color:0xff8a30}));f.position.set(0,.35,.33);o.add(b,f);o.position.set(x,0,z);}
    if(ev.kind==='board'||ev.kind==='sign'){o=new THREE.Group();if(ev.kind==='board'||ev.id==='canal'){const p=new THREE.Mesh(new THREE.BoxGeometry(1,.7,.06),mat2('plank',.6,.4));p.position.y=1.2;
      const paper=new THREE.Mesh(new THREE.PlaneGeometry(.7,.45),new THREE.MeshLambertMaterial({color:0xe8dcc0}));paper.position.set(0,1.2,.04);
      [-.4,.4].forEach(dx=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.07,1,.07),mat2('plank',.1,.5));l.position.set(dx,.5,0);o.add(l);});o.add(p,paper);}o.position.set(x,0,z);}
    if(ev.kind==='exit'){o=new THREE.Mesh(new THREE.RingGeometry(.5,.66,24),new THREE.MeshBasicMaterial({color:0x5cc2ad,side:THREE.DoubleSide,transparent:true,opacity:.8}));o.rotation.x=-Math.PI/2;o.position.set(x,.05,z);}
    if(o){o.visible=!ev.hidden;E.world.add(o);ev.obj=o;}
    if(['npc','chest','stove','board','sign'].includes(ev.kind)){const mk=new THREE.Mesh(new THREE.OctahedronGeometry(.12),new THREE.MeshBasicMaterial({color:0xffd27a}));
      mk.position.set(x,ev.kind==='npc'?(ev.who==='tim'?1.7:2.15):(ev.kind==='sign'?1.6:1.75),z);mk.visible=!ev.hidden&&!ev.done;E.world.add(mk);ev.mk=mk;}
    if(ev.kind==='sign')ev.block=false;
  });
  // the waiting queue of smiling miners + ambient walkers
  X.amb=[];[[48,9.2],[48,7.6],[48.2,6],[47.8,4.4]].forEach(([x,z])=>{const s=hrChar('miner',1.75);s.holder.position.set(x,0,z);s.face(1);E.world.add(s.holder);});
  [{k:'folkB',path:[[12,21.4],[40,21.4],[40,27],[12,27]]},{k:'folkC',path:[[28,29],[36,29],[36,33],[28,33]]},{k:'folkA',path:[[5,35.2],[28,35.2],[45,35.2],[28,35.4]]}].forEach(({k,path})=>{
    const s=hrChar(k,1.7);s.holder.position.set(...[path[0][0],0,path[0][1]]);E.world.add(s.holder);X.amb.push({s,path,i:1,wait:0});});
  X.col=townColliders();X.zone=null;X.yaw=X.yaw||0;X.trail=[];
  drawMinimapBase();$('minimap').hidden=false;
  E.fxs.push((dt,t)=>{X.events.forEach(ev=>{if(ev.mk){ev.mk.rotation.y+=dt*2;}if(ev.kind==='exit'&&ev.obj)ev.obj.material.opacity=.5+Math.sin(t*3)*.3;});});
  E.onTick=townTick;setTilt(.52,1.3);
}
function smokeAt(x,y,z){const g=new THREE.BufferGeometry(),n=14,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=x;a[i*3+1]=y+i*.2;a[i*3+2]=z;}g.setAttribute('position',new THREE.BufferAttribute(a,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0x8a8a90,size:.5,transparent:true,opacity:.28,depthWrite:false}));E.world.add(pts);
  E.fxs.push(dt=>{const A=g.attributes.position.array;for(let i=0;i<n;i++){A[i*3+1]+=dt*.6;A[i*3]+=dt*.25;if(A[i*3+1]>y+3){A[i*3+1]=y;A[i*3]=x;}}g.attributes.position.needsUpdate=true;});}
const WG={f:new THREE.BoxGeometry(1,1.25,.08),w:new THREE.PlaneGeometry(.8,1.05)};
const _ray=new THREE.Ray(),_hit=new THREE.Vector3();
function townOcclude(dt){if(!X.bld)return;const cam=E.camera.position;
  const pts=[new THREE.Vector3(X.pos.x,1.1,X.pos.z),new THREE.Vector3(X.pos.x,.3,X.pos.z),X.follow.holder.position.clone().setY(1)];
  X.bld.forEach(b=>{let occ=false;for(const p of pts){const d=p.clone().sub(cam),L=d.length();_ray.set(cam,d.normalize());if(_ray.intersectBox(b.box,_hit)&&cam.distanceTo(_hit)<L-.2){occ=true;break;}}
    const tg=occ?.16:1,nf=b.f+(tg-b.f)*Math.min(1,dt*8);if(Math.abs(nf-b.f)<.002&&(nf===1||nf===tg)){b.f=tg===1&&Math.abs(nf-1)<.01?1:nf;}else b.f=nf;
    if(b.applied!==b.f){b.applied=b.f;const fade=b.f<.995;b.meshes.forEach(m=>{const ms=Array.isArray(m.material)?m.material:[m.material];ms.forEach(mt=>{if(mt.transparent!==fade){mt.transparent=fade;mt.needsUpdate=true;}mt.opacity=fade?b.f:1;mt.depthWrite=!fade;});m.castShadow=!fade||b.f>.5;});}});}
/* collision */
function freeStand(x,z){const r=.32,C=X.col;if(!C)return true;
  for(const b of C.box)if(x>b[0]-r&&x<b[2]+r&&z>b[1]-r&&z<b[3]+r)return false;
  for(const c of C.circ)if(Math.hypot(x-c[0],z-c[1])<c[2]+r)return false;
  for(const ev of X.events)if(ev.block&&!ev.hidden&&Math.hypot(x-ev.at[0],z-ev.at[1])<.55)return false;
  if(X.M===MAPS.town){for(const [px,pz] of TOWN_PROPS.lamps)if(Math.hypot(x-px,z-pz)<.3)return false;
  for(const [px,pz] of TOWN_PROPS.crates)if(Math.abs(x-px)<.75&&Math.abs(z-pz)<.75)return false;
  for(const [px,pz] of TOWN_PROPS.barrels)if(Math.hypot(x-px,z-pz)<.65)return false;
  for(const [px,pz] of TOWN_PROPS.trees)if(Math.hypot(x-px,z-pz)<.45)return false;}
  return true;}
function zoneAt(x,z){for(const zn of (X.M.zones||TOWN_ZONES)){const r=zn.r;if(x>=r[0]&&x<r[2]&&z>=r[1]&&z<r[3])return zn;}return null;}
/* tick */
function townTick(dt,t){
  if($('explore').hidden||!X.lead)return;
  let ix=0,iz=0;const K=X.keys;
  if(K.ArrowLeft||K.a)ix-=1;if(K.ArrowRight||K.d)ix+=1;if(K.ArrowUp||K.w)iz-=1;if(K.ArrowDown||K.s)iz+=1;
  const cy=Math.cos(X.yaw),sy=Math.sin(X.yaw);let dx=ix*cy+iz*sy,dz=-ix*sy+iz*cy;
  if(ix||iz)X.target=null;else if(X.target){const v=X.target.clone().sub(X.pos);v.y=0;if(v.length()<.1)X.target=null;else{dx=v.x;dz=v.z;}}
  let moved=0;
  if(dx||dz){const L=Math.hypot(dx,dz),sp=(K.Shift?5.2:3.6)*dt,mx=dx/L*sp,mz=dz/L*sp;let ok=false;
    if(freeStand(X.pos.x+mx,X.pos.z)){X.pos.x+=mx;ok=true;}if(freeStand(X.pos.x,X.pos.z+mz)){X.pos.z+=mz;ok=true;}
    if(!ok&&X.target)X.target=null;moved=Math.hypot(mx,mz)*(ok?1:0);const sx=scrX(mx,mz);if(Math.abs(sx)>.002&&!X.stuck)X.lead.face(sx);}
  /* pushing into a bench or a corner makes the two-axis slide jitter on the spot: judge walking by real progress over a short window */
  const pg=X.prog||(X.prog={t:0,p:X.pos.clone()});pg.t+=dt;
  if(!(dx||dz)){X.stuck=false;pg.t=0;pg.p.copy(X.pos);}
  else if(pg.t>.25){const want=(K.Shift?5.2:3.6)*pg.t;X.stuck=X.pos.distanceTo(pg.p)<want*.3;if(X.stuck&&X.target)X.target=null;pg.t=0;pg.p.copy(X.pos);}
  X.lead.holder.position.copy(X.pos);X.lead.setWalk(moved>0&&!X.stuck);
  // follower walks along the leader's trail
  const tr=X.trail;if(!tr.length||X.pos.distanceTo(tr[tr.length-1])>.12)tr.push(X.pos.clone());if(tr.length>40)tr.shift();
  let acc=0,goal=null;for(let k=tr.length-1;k>0;k--){acc+=tr[k].distanceTo(tr[k-1]);if(acc>1){goal=tr[k-1];break;}}
  const fp=X.follow.holder.position,fd=goal?goal.clone().sub(fp):new THREE.Vector3();fd.y=0;const fl=fd.length();
  if(goal&&fl>.05){const st=Math.min(fl,(fl>2?6:3.8)*dt);fp.addScaledVector(fd.normalize(),st);const s2=scrX(fd.x,fd.z);if(Math.abs(s2)>.01)X.follow.face(s2);X.follow.setWalk(true);}else X.follow.setWalk(false);
  // camera (Q/E rotates in 90° steps)
  X.yawT=X.yawT??X.yaw;if(K.q)X.yawT-=dt*1.9;if(K.r)X.yawT+=dt*1.9;X.yaw+=(X.yawT-X.yaw)*Math.min(1,dt*(X.dragging?20:6));
  X.pitch=X.pitch??.85;X.dist=X.dist??12.8;X.pitchC=(X.pitchC??X.pitch)+(X.pitch-(X.pitchC??X.pitch))*Math.min(1,dt*10);X.distC=(X.distC??X.dist)+(X.dist-(X.distC??X.dist))*Math.min(1,dt*8);
  const hz=Math.cos(X.pitchC)*X.distC,vt=Math.sin(X.pitchC)*X.distC;
  const off=new THREE.Vector3(Math.sin(X.yaw)*hz,vt,Math.cos(X.yaw)*hz),tgt=new THREE.Vector3(X.pos.x,.8,X.pos.z);
  E.camera.position.lerp(tgt.clone().add(off),Math.min(1,dt*5));E.controls.target.lerp(tgt,Math.min(1,dt*6));E.camera.lookAt(E.controls.target);
  townOcclude(dt);
  X.sun.position.set(X.pos.x-6,14,X.pos.z+8);X.sun.target.position.set(X.pos.x,0,X.pos.z);if(X.rain)X.rain.position.set(X.pos.x,0,X.pos.z);
  // ambient walkers
  (X.amb||[]).forEach(a=>{if(a.wait>0){a.wait-=dt;a.s.setWalk(false);return;}const g=a.path[a.i],p=a.s.holder.position,v=new THREE.Vector3(g[0]-p.x,0,g[1]-p.z),L=v.length();
    if(L<.1){a.i=(a.i+1)%a.path.length;a.wait=1+Math.random()*2;return;}const st=Math.min(L,1.3*dt);p.addScaledVector(v.normalize(),st);a.s.setWalk(true);const s3=scrX(v.x,v.z);if(Math.abs(s3)>.01)a.s.face(s3);});
  // interactions
  X.cool=Math.max(0,X.cool-dt);let near=null,nd=9;
  X.events.forEach(ev=>{if(ev.hidden)return;const d=Math.hypot(ev.at[0]-X.pos.x,ev.at[1]-X.pos.z);
    if(ev.kind==='auto'){if(!ev.done&&(!ev.cond||ev.cond())&&d<(ev.r||1.2))runEvent(ev);return;}
    if(ev.kind==='exit'){if(d<(ev.r||.7)&&X.cool<=0){X.cool=1.5;if(ev.cond())runEvent(ev);else toast(ev.deny);}return;}
    if(ev.once&&ev.done)return;if(d<1.5&&d<nd){nd=d;near=ev;}});
  if(near!==X.near){X.near=near;const b=$('ex-act');b.hidden=!near;if(near)b.innerHTML=`<small>調查</small>${near.label}`;}
  // zones & encounters
  const zn=zoneAt(X.pos.x,X.pos.z);if(zn!==X.zone){X.zone=zn;if(zn)zoneLabel(zn);X.M.enc=!!(zn&&zn.danger);updateDanger();}
  if(moved&&X.M.enc){X.enc+=moved;updateDanger();if(X.enc>X.thresh){X.enc=0;X.thresh=10+Math.random()*6;encounter();}}
  drawMinimap();
}
function zoneLabel(zn){const el=$('ex-zone');el.innerHTML=`<span>${zn.name}</span>${zn.danger?'<small>危險區域・會遭遇敵人</small>':''}`;el.classList.remove('go');void el.offsetWidth;el.classList.add('go');}
/* minimap */
function drawMinimapBase(){const c=$('mm-base');if(!c)return;const S=c.width/TW.W,g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
  g.fillStyle='#1a1c22';g.fillRect(0,0,c.width,c.height);g.fillStyle='#2e2c2c';[[1,20.4,63,27.6],[26,17,38,31],[46,1.6,50.5,20.5],[30,31,34,38.6],[11,34,63,38.4],[14,27.6,16.4,34]].forEach(([a,b,cc,d])=>g.fillRect(a*S,b*S,(cc-a)*S,(d-b)*S));
  g.beginPath();g.arc(32*S,24*S,7*S,0,7);g.fill();
  g.fillStyle='rgba(208,80,63,.18)';TOWN_ZONES.filter(z=>z.danger).forEach(z=>g.fillRect(z.r[0]*S,z.r[1]*S,(z.r[2]-z.r[0])*S,(z.r[3]-z.r[1])*S));
  g.fillStyle='#2a4a32';g.fillRect(0,CANAL.z0*S,c.width,(CANAL.z1-CANAL.z0)*S);g.fillStyle='#4a3a2a';CANAL.bridges.forEach(([a,b])=>g.fillRect(a*S,CANAL.z0*S,(b-a)*S,(CANAL.z1-CANAL.z0)*S));
  g.fillStyle='#0c0d10';g.fillRect(0,0,40*S,12.6*S);
  TOWN_B.forEach(b=>{g.fillStyle='#4e5868';g.fillRect(b[0]*S,b[1]*S,(b[2]-b[0])*S,(b[3]-b[1])*S);g.fillStyle='#6a7488';g.fillRect(b[0]*S,b[1]*S,(b[2]-b[0])*S,1);});
  g.fillStyle='#3a6a8a';g.beginPath();g.arc(59.6*S,24*S,2*S,0,7);g.fill();g.fillStyle='#4a6a5a';g.beginPath();g.arc(32*S,24*S,2.2*S,0,7);g.fill();}
function drawMinimap(){const c=$('mm');if(!c||$('minimap').hidden)return;const S=c.width/(X.M.size?X.M.size[0]:TW.W),g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage($('mm-base'),0,0);
  X.events.forEach(ev=>{if(ev.hidden)return;if(ev.kind==='exit'){g.fillStyle=ev.cond()?'#5cc2ad':'#3a5a54';g.fillRect(ev.at[0]*S-3,ev.at[1]*S-3,6,6);return;}
    if(ev.mk&&ev.mk.visible){g.fillStyle='#ffd27a';g.save();g.translate(ev.at[0]*S,ev.at[1]*S);g.rotate(Math.PI/4);g.fillRect(-2,-2,4,4);g.restore();}});
  g.save();g.translate(X.pos.x*S,X.pos.z*S);g.rotate(-X.yaw);g.fillStyle='#ffffff';g.beginPath();g.moveTo(0,-5);g.lineTo(3.6,4);g.lineTo(-3.6,4);g.closePath();g.fill();g.restore();}
/* integrate with the existing exploration engine */
{const o=buildExploreWorld;buildExploreWorld=function(M){$('minimap').hidden=true;X.col=null;X.bld=null;X.amb=null;X.rain=null;const hp=document.querySelector('.ex-help');if(hp)hp.textContent=M.free?'WASD／方向鍵或點擊地面移動 · 拖曳旋轉視角、滾輪縮放 · E／空白鍵調查':'WASD／方向鍵或點擊地面移動 · E／空白鍵調查';if(M.free)return M.build?buildFree(M):buildTown(M);o(M);
  // upgrade the small-map sprites to the hi-res set too
  const swap=(old,kind,h)=>{const s=hrChar(kind,h);s.holder.position.copy(old.holder.position);E.world.remove(old.holder);E.sprites=E.sprites.filter(x=>x!==old);E.world.add(s.holder);return s;};
  X.lead=swap(X.lead,'ryan',1.7);X.follow=swap(X.follow,'claire',1.7);
  X.events.forEach(ev=>{if(ev.spr&&TOWN_KIND[ev.who]){const v=ev.spr.holder.visible;ev.spr=swap(ev.spr,TOWN_KIND[ev.who],1.7);ev.spr.holder.visible=v;ev.obj=ev.spr.holder;ev.spr.face(-1);}});};}
{const o=exploreTick;exploreTick=function(dt,t){const a=X.lead&&X.lead.holder.position.clone(),b=X.follow&&X.follow.holder.position.clone();o(dt,t);
  if(X.lead&&X.lead.setWalk){X.lead.setWalk(a.distanceTo(X.lead.holder.position)>1e-4);X.follow.setWalk(b.distanceTo(X.follow.holder.position)>1e-4);}};}
{const o=enterMap;enterMap=function(id,opts={}){const M=MAPS[id];
  if(M&&M.free&&!M.build&&opts.pos){X.events=M.events.map(ev=>Object.assign({},ev));X.M=M;X.col=townColliders();if(!freeStand(opts.pos[0],opts.pos[1]))opts={pos:M.start};}
  o(id,opts);if(M&&M.build&&!freeStand(X.pos.x,X.pos.z)){X.pos.set(M.start[0],0,M.start[1]);X.lead.holder.position.copy(X.pos);}if(M&&M.free){X.trail=[];X.follow.holder.position.set(X.pos.x-.8,0,X.pos.z+.4);}};}
{const o=runEvent;runEvent=function(ev){if(ev.fn){X.target=null;X.keys={};$('ex-act').hidden=true;if(ev.mk){ev.mk.visible=false;P.flags['ev_'+X.id+'_'+ev.id]=1;}ev.fn(ev);return;}o(ev);};}
document.addEventListener('keydown',e=>{if($('explore').hidden||!X.M||!X.M.free||!$('story').hidden)return;
  if(e.key==='Home'||e.key==='0'){X.yawT=Math.round((X.yawT??0)/(Math.PI*2))*Math.PI*2;X.pitch=.85;X.dist=12.8;}
  if(e.key==='m'||e.key==='M')$('minimap').classList.toggle('big');});
$('mm-toggle').onclick=()=>$('minimap').classList.toggle('big');
$('ex-rotl').onclick=()=>{X.yawT=(X.yawT??0)-Math.PI/4;};$('ex-rotr').onclick=()=>{X.yawT=(X.yawT??0)+Math.PI/4;};
/* free camera: drag to orbit, wheel / pinch to zoom */
{const cv=$('gl');let drag=null;const pts=new Map();let pinch0=null;
  const active=()=>!$('explore').hidden&&X.M&&X.M.free&&$('story').hidden;
  cv.addEventListener('pointerdown',e=>{if(!active())return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1)drag={x:e.clientX,y:e.clientY,moved:0};
    if(pts.size===2){const [a,b]=[...pts.values()];pinch0={d:Math.hypot(a[0]-b[0],a[1]-b[1]),dist:X.dist??12.8};}});
  window.addEventListener('pointermove',e=>{if(!active()||!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2&&pinch0){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);X.dist=Math.max(7,Math.min(20,pinch0.dist*pinch0.d/Math.max(20,d)));return;}
    if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;drag.moved+=Math.abs(dx)+Math.abs(dy);
    if(drag.moved>6){X.dragging=true;X.yawT=(X.yawT??0)-dx*.008;X.pitch=Math.max(.42,Math.min(1.3,(X.pitch??.85)+dy*.006));}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch0=null;if(!pts.size){drag=null;setTimeout(()=>{X.dragging=false;},0);}};
  window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{if(!active())return;e.preventDefault();X.dist=Math.max(7,Math.min(20,(X.dist??12.8)*(1+Math.sign(e.deltaY)*.1)));},{passive:false});
  cv.style.touchAction='none';}
