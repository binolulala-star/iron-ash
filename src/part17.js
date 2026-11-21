/* ======================= CHAPTER 2 — CAST (faces, sprites) & SNOW TEXTURES ======================= */
Object.assign(NAMES,{lia:'雪橇信差・莉亞',locke:'要塞司令・洛克上校',orrick:'寒霜鍊金術師・歐利克',erik:'要塞士兵・艾瑞克',keeper:'酒館老闆・博格',hunter:'獵人・老約翰',folkw:'掃雪的婦人'});
/* low-res board / scene sprites */
Object.assign(CHAR,{
 lia:{skin:'#f2cca8',skinD:'#d0a280',eyeL:'#c88a2a',eyeR:'#c88a2a',coat:'#8a3a2a',coatD:'#5e2618',shirt:'#e8dcc4',pants:'#4a3a30',boots:'#2a1e16',
   hair:(P,b)=>{P('#6a4a30',5,1+b,10,4);P('#8a6a44',6,1+b,8,1);P('#d8c8a0',5,4+b,2,4);P('#d8c8a0',13,4+b,2,3);P('#c8a456',7,3+b,2,2);P('#c8a456',11,3+b,2,2);P('#e8f0f8',5,0+b,10,1);},
   extra:(P,b)=>{P('#e8dcc4',6,11+b,8,2);P('#5a3a20',5,13+b,1,6);}},
 locke:{skin:'#e0bc98',skinD:'#bc966e',eyeL:'#5a6a7a',eyeR:'#5a6a7a',coat:'#c8ccd2',coatD:'#8a9098',shirt:'#3a4250',pants:'#2a2e36',boots:'#1a1a1e',
   hair:(P,b)=>{P('#7a7e84',6,1+b,8,3);P('#9a9ea4',7,1+b,4,1);P('#7a7e84',5,3+b,1,3);P('#7a7e84',14,3+b,1,3);P('#8a4a3a',8,6+b,2,1);},
   extra:(P,b)=>{P('#e8e4dc',4,10+b,12,2);P('#c8a456',8,13+b,1,1);P('#c8a456',11,13+b,1,1);P('#3a3e46',15,15+b,1,7);}},
 orrick:{skin:'#eef0f4',skinD:'#c8ccd6',eyeL:'#4ad8ff',eyeR:'#4ad8ff',coat:'#232a44',coatD:'#151a2c',shirt:'#c8d8e8',pants:'#1a1e2c',boots:'#10121a',
   hair:(P,b)=>{const h='#a8cce4';P(h,6,1+b,8,3);P(h,5,3+b,1,10);P(h,14,3+b,1,12);P('#d8ecf8',7,1+b,4,1);P('#cfe0ee',7,7+b,6,1);},
   extra:(P,b)=>{P('#7fe8ff',5,17+b,1,2);P('#7fe8ff',14,16+b,1,2);P('#d8e4f0',8,12+b,4,1);}},
 erik:{skin:'#e8c4a0',skinD:'#c49c78',eyeL:'#6a7a8a',eyeR:'#6a7a8a',coat:'#b8c0cc',coatD:'#7e8896',shirt:'#3a4250',pants:'#2a2e36',boots:'#1a1a1e',
   hair:(P,b)=>{P('#b8a07a',6,1+b,8,3);P('#d8c49a',7,1+b,3,1);P('#5a6270',5,3+b,10,1);},extra:null},
 keeper:{skin:'#e0b490',skinD:'#ae7e5c',eyeL:'#2a2220',eyeR:'#2a2220',coat:'#5a3a2a',coatD:'#3a2418',shirt:'#e0d6c4',pants:'#3a3a40',boots:'#2a1e16',
   hair:(P,b)=>{P('#c8c4bc',6,1+b,8,2);P('#c8c4bc',7,8+b,6,3);},extra:(P,b)=>{P('#e0d6c4',6,13+b,8,6);}},
 folkw:{skin:'#f0c8a6',skinD:'#c49272',eyeL:'#2a2220',eyeR:'#2a2220',coat:'#3e5a5a',coatD:'#283e3e',shirt:'#ece4d4',pants:'#3e5a5a',boots:'#2a201a',
   hair:(P,b)=>{P('#2e2a30',6,1+b,8,3);P('#8a3a3a',5,1+b,10,1);},extra:null},
 hunter:{skin:'#d8a882',skinD:'#a87a58',eyeL:'#2a2220',eyeR:'#2a2220',coat:'#6a5a44',coatD:'#46392a',shirt:'#c8b48a',pants:'#3a3a32',boots:'#2a1e16',
   hair:(P,b)=>{P('#8a7a64',5,1+b,10,3);P('#e8e4dc',6,0+b,8,1);P('#9a9a94',7,8+b,6,3);},extra:null},
});
{const o=portraitSVG;portraitSVG=function(who,en){const e=EXPR[en]||EXPR.Neutral;
  if(who==='lia')return face({skin:'#f2cca8',coat:'#8a3a2a',eyeL:'#c88a2a',eyeR:'#c88a2a',expr:e,brow:'#6a5030',
    hair:'<path d="M58 124 Q56 74 100 70 Q144 74 142 124 Q132 100 116 100 Q108 112 96 100 Q80 110 70 102 Q62 112 58 124 Z" fill="#d8c8a0"/><path d="M48 98 Q50 52 100 48 Q150 52 152 98 L146 104 Q140 66 100 64 Q60 66 54 104 Z" fill="#6a4a30"/><path d="M46 100 Q100 86 154 100 L154 110 Q100 96 46 110 Z" fill="#e8e0d0"/><circle cx="80" cy="74" r="11" fill="#c8a456"/><circle cx="120" cy="74" r="11" fill="#c8a456"/><circle cx="80" cy="74" r="6" fill="#8ad0e8"/><circle cx="120" cy="74" r="6" fill="#8ad0e8"/>',
    collar:'<path d="M40 260 Q44 204 72 196 L100 232 L128 196 Q156 204 160 260 Z" fill="#8a3a2a"/><path d="M60 200 Q100 222 140 200 L144 212 Q100 236 56 212 Z" fill="#e8e0d0"/>'});
  if(who==='locke')return face({skin:'#e0bc98',coat:'#c8ccd2',eyeL:'#5a6a7a',eyeR:'#5a6a7a',expr:e,brow:'#5a5e64',
    hair:'<path d="M60 108 Q60 68 100 66 Q140 68 140 108 Q130 84 100 82 Q70 84 60 108 Z" fill="#7a7e84"/><path d="M70 98 L84 116" stroke="#9a5a4a" stroke-width="3"/>',
    collar:'<path d="M36 260 Q40 200 74 194 L100 222 L126 194 Q160 200 164 260 Z" fill="#c8ccd2"/><path d="M40 210 Q100 186 160 210 L160 226 Q100 204 40 226 Z" fill="#e8e4dc"/><circle cx="84" cy="236" r="5" fill="#c8a456"/><circle cx="116" cy="236" r="5" fill="#c8a456"/>'});
  if(who==='orrick')return face({skin:'#eef0f4',coat:'#232a44',eyeL:'#4ad8ff',eyeR:'#4ad8ff',expr:e,brow:'#7a9ab4',
    hairBack:'<path d="M58 110 Q46 190 70 250 L86 250 Q74 180 78 120 Z M142 110 Q156 190 132 250 L116 250 Q128 180 122 120 Z" fill="#a8cce4"/>',
    hair:'<path d="M56 124 Q52 64 100 62 Q148 64 144 124 Q134 86 104 84 Q96 100 82 92 Q64 98 56 124 Z" fill="#a8cce4"/><g fill="none" stroke="#c8d8e8" stroke-width="2"><rect x="68" y="114" width="26" height="18" rx="3"/><rect x="106" y="114" width="26" height="18" rx="3"/><path d="M94 122 H106"/></g>',
    collar:'<path d="M40 260 Q44 204 74 196 L100 226 L126 196 Q156 204 160 260 Z" fill="#232a44"/><path d="M80 210 Q100 230 120 210" stroke="#c8d8e8" stroke-width="3" fill="none"/>'});
  if(who==='erik')return face({skin:'#e8c4a0',coat:'#b8c0cc',eyeL:'#6a7a8a',eyeR:'#6a7a8a',expr:e,
    hair:'<path d="M58 116 Q58 68 100 66 Q142 68 142 116 Q132 88 112 90 Q100 100 86 90 Q66 94 58 116 Z" fill="#b8a07a"/>'});
  if(who==='keeper')return face({skin:'#e0b490',coat:'#5a3a2a',eyeL:'#2a2220',eyeR:'#2a2220',expr:e,
    hair:'<path d="M62 100 Q66 72 100 70 Q134 72 138 100 Z" fill="#c8c4bc"/><path d="M76 150 Q100 196 124 150 Q118 176 100 180 Q82 176 76 150 Z" fill="#d8d4cc"/>'});
  if(who==='hunter')return face({skin:'#d8a882',coat:'#6a5a44',eyeL:'#2a2220',eyeR:'#2a2220',expr:e,
    hair:'<path d="M52 108 Q56 56 100 54 Q144 56 148 108 Z" fill="#8a7a64"/><path d="M48 104 Q100 92 152 104 L152 114 Q100 102 48 114 Z" fill="#e8e4dc"/><path d="M78 152 Q100 190 122 152 Q116 172 100 176 Q84 172 78 152 Z" fill="#a8a49c"/>'});
  if(who==='folkw')return face({skin:'#f0c8a6',coat:'#3e5a5a',eyeL:'#2a2220',eyeR:'#2a2220',expr:e,
    hair:'<path d="M58 124 Q54 70 100 66 Q146 70 142 124 Q132 92 100 88 Q68 92 58 124 Z" fill="#2e2a30"/><path d="M50 100 Q100 70 150 100 L150 112 Q100 86 50 112 Z" fill="#8a3a3a"/>'});
  return o(who,en);};}
/* hi-res townsfolk for the free maps */
Object.assign(HRPAL,{
 lia:{skin:['#f2cca8','#cc9a76','#ffe4c8'],hair:['#d8c8a0','#a8946c','#f0e4c4'],coat:['#8a3a2a','#5e2618','#ae5240'],shirt:['#e8dcc4','#b4a88c','#fff6e4'],
   pants:['#4a3a30','#2e241c','#665244'],boots:['#2a1e16','#160e08','#44342a'],eyeN:'#c88a2a',eyeF:'#c88a2a',acc:'#c8a456',acc2:'#7e6630',cap:['#6a4a30','#46301c','#8a6a44'],fur:['#e8e0d0','#b8b0a0','#ffffff']},
 locke:{skin:['#e0bc98','#b48e6c','#f4d4b4'],hair:['#7a7e84','#54585e','#9a9ea4'],coat:['#c8ccd2','#8a9098','#eef0f4'],shirt:['#3a4250','#262c36','#525c6c'],
   pants:['#2a2e36','#181a20','#3e424c'],boots:['#1a1a1e','#0c0c10','#2e2e34'],eyeN:'#5a6a7a',eyeF:'#5a6a7a',acc:'#c8a456',acc2:'#7e6630',fur:['#e8e4dc','#b0aca4','#ffffff'],skirt:1},
 orrick:{skin:['#eef0f4','#c4c8d2','#ffffff'],hair:['#a8cce4','#7898b4','#d8ecf8'],coat:['#232a44','#151a2c','#38446a'],shirt:['#c8d8e8','#94a4b8','#eef6ff'],
   pants:['#1a1e2c','#0e1018','#2a3044'],boots:['#10121a','#06080c','#22263a'],eyeN:'#4ad8ff',eyeF:'#4ad8ff',acc:'#7fe8ff',acc2:'#3a8aa8',skirt:1},
 erik:{skin:['#e8c4a0','#c09a76','#fcdcbc'],hair:['#b8a07a','#8a7656','#d8c49a'],coat:['#b8c0cc','#7e8896','#dce2ea'],shirt:['#3a4250','#262c36','#525c6c'],
   pants:['#2a2e36','#181a20','#3e424c'],boots:['#1a1a1e','#0c0c10','#2e2e34'],eyeN:'#6a7a8a',eyeF:'#6a7a8a',acc:'#c8a456',acc2:'#7e6630',cap:['#8a929e','#5e6670','#aab2be']},
 keeper:{skin:['#e0b490','#ae7e5c','#f4cca8'],hair:['#c8c4bc','#9a968e','#e8e4dc'],coat:['#5a3a2a','#3a2418','#7a523a'],shirt:['#e0d6c4','#aca290','#fff4e4'],
   pants:['#3a3a40','#24242a','#52525a'],boots:['#2a1e16','#160e08','#44342a'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#e0d6c4',acc2:'#a89e8c'},
 hunter:{skin:['#d8a882','#a87a58','#f0c4a0'],hair:['#8a7a64','#5e5240','#aa9a82'],coat:['#6a5a44','#46392a','#8a7a60'],shirt:['#c8b48a','#968460','#e6d4aa'],
   pants:['#3a3a32','#24241e','#52524a'],boots:['#2a1e16','#160e08','#44342a'],eyeN:'#2a2220',eyeF:'#2a2220',acc:'#b0a080',acc2:'#6a5a40',fur:['#e8e4dc','#b0aca4','#ffffff']},
});
{const o=drawHead;drawHead=function(g,r,C,kind,eye){
  if(!['lia','locke','orrick','erik','keeper','hunter'].includes(kind))return o(g,r,C,kind,eye);
  const [x,y]=r.head;
  if(kind==='orrick'){poly(g,[[x-6,y-2],[x-8,y+12],[x-5,y+16],[x-3,y+4]],C.hair[1]);}
  ell(g,x,y,5.6,6,C.skin[1]);ell(g,x+.6,y-.4,5,5.4,C.skin[0]);poly(g,[[x+2,y+3],[x+5.6,y+1.5],[x+4.8,y+5],[x+1,y+6]],C.skin[0]);rect(g,x+5,y,1,2,C.skin[1]);
  if(eye==='closed'){rect(g,x+1,y,3,1,'#3a2420');}else{rect(g,x+1,y-1,2,3,'#1a1418');rect(g,x+1,y-1,2,2,C.eyeN);rect(g,x+1,y-1,1,1,'#ffffff');rect(g,x+4,y-1,1,3,'#1a1418');}
  rect(g,x+2,y+3.4,2,1,'#8a4a3a');
  if(kind==='lia'){poly(g,[[x-6.6,y+1],[x-6.2,y-6],[x-1,y-9],[x+4.6,y-8.4],[x+7,y-4.6],[x+6.6,y-3],[x-6.6,y-2.6]],C.cap[0]);poly(g,[[x-1,y-8.6],[x+4,y-8],[x+2,y-6.6]],C.cap[2]);
    poly(g,[[x-7.4,y-3.6],[x+7.4,y-3.6],[x+7.4,y-2],[x-7.4,y-2]],C.fur[0]);ell(g,x+2.4,y-6.6,1.8,1.6,C.acc);ell(g,x-1.6,y-6.8,1.8,1.6,C.acc);ell(g,x+2.4,y-6.6,1,1,'#8ad0e8');
    poly(g,[[x-7,y-2],[x-8.4,y+6],[x-5.4,y+5],[x-5,y-1]],C.cap[1]);rect(g,x+1,y-2,4,1,C.hair[0]);rect(g,x-5,y-1,2,4,C.hair[0]);}
  if(kind==='locke'){poly(g,[[x-6,y-1],[x-5.6,y-6.4],[x-1,y-8.4],[x+4.4,y-7.8],[x+6.4,y-4.8],[x+5.4,y-3.4],[x-1,y-4.4],[x-4,y-1]],C.hair[0]);poly(g,[[x-1,y-8],[x+3,y-7.6],[x+1,y-6.6]],C.hair[2]);
    rect(g,x+1,y-3,1,3,'#9a5a4a');rect(g,x-3,y+6.6,9,1.4,C.fur[1]);}
  if(kind==='orrick'){poly(g,[[x-6,y+2],[x-5.8,y-6],[x-1,y-8.6],[x+4.4,y-8],[x+6.6,y-4.6],[x+6,y-2],[x+3,y-4],[x-1,y-3.6],[x-4,y+1]],C.hair[0]);poly(g,[[x-1,y-8.2],[x+3.6,y-7.6],[x+1,y-6.4]],C.hair[2]);
    rect(g,x+.4,y-1.6,3,1,'#c8d8e8');rect(g,x+3.4,y-1.6,2,1,'#c8d8e8');}
  if(kind==='erik'){poly(g,[[x-6,y-1],[x-5.6,y-6],[x-1,y-8],[x+4,y-7.6],[x+6,y-4.6],[x-6,y-3]],C.cap[0]);poly(g,[[x+1,y-4.6],[x+8,y-4],[x+7.6,y-3],[x+1,y-3.4]],C.cap[1]);rect(g,x-6,y-2,2,4,C.hair[0]);}
  if(kind==='keeper'){poly(g,[[x-5.6,y-2],[x-4.6,y-6.6],[x+1,y-8],[x+5,y-6.4],[x+5.6,y-3.6],[x+1,y-5.4],[x-3,y-3.4]],C.hair[0]);poly(g,[[x+1,y+2.6],[x+6,y+2],[x+5,y+8],[x+1,y+7]],C.hair[0]);}
  if(kind==='hunter'){poly(g,[[x-7,y-2.4],[x-6.4,y-7],[x-1,y-9.6],[x+4.6,y-9],[x+7.4,y-4.6],[x+7.4,y-2.4]],C.hair[1]);poly(g,[[x-7.6,y-3],[x+8,y-3],[x+8,y-1.6],[x-7.6,y-1.6]],C.fur[0]);
    poly(g,[[x+1,y+2.4],[x+6,y+1.8],[x+5.4,y+8],[x+1,y+7]],C.hair[0]);}
};}
Object.assign(TOWN_KIND,{lia:'lia',locke:'locke',orrick:'orrick',erik:'erik',keeper:'keeper',hunter:'hunter',soldier:'erik'});
/* 32px snow textures for free maps */
{const o=T2;T2=function(kind){if(TEX2[kind])return TEX2[kind];
  if(!['snow2','ice2','snowroof','fstone2','frost2','timber','pine'].includes(kind))return o(kind);
  const N=32,c=cvs(N,N),g=c.getContext('2d'),P=(col,x,y,w=1,h=1)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};let s=41;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  const noise=(base,cols,n)=>{P(base,0,0,N,N);for(let k=0;k<n;k++)P(cols[(r()*cols.length)|0],(r()*N)|0,(r()*N)|0,1+(r()*2|0),1);};
  if(kind==='snow2'){noise('#a6b0bd',['#b2bcc8','#9aa4b2','#bcc4ce','#8e98a8'],320);for(let k=0;k<5;k++)P('#86909e',(r()*N)|0,(r()*N)|0,3,1);}
  if(kind==='ice2'){noise('#86bcde',['#96caea','#76aed2','#aedcf4'],120);for(let k=0;k<8;k++){const x=(r()*26)|0,y=(r()*30)|0;P('#e0f6ff',x,y,6,1);P('#c8ecff',x+2,y+1,3,1);}for(let k=0;k<4;k++)P('#5a8ab0',(r()*N)|0,(r()*N)|0,1,4);}
  if(kind==='snowroof'){P('#c4ccd6',0,0,N,N);for(let y=0;y<N;y+=8){P('#a8b2be',0,y+6,N,2);for(let k=0;k<4;k++)P('#dce2ea',(r()*N)|0,y+(r()*5|0),3,1);}}
  if(kind==='fstone2'){P('#3a3e46',0,0,N,N);for(let y=0;y<N;y+=8){const o2=(y/8)%2?0:6;for(let x=-o2;x<N;x+=12){P(['#5a606a','#545a64','#626872'][(r()*3)|0],x+1,y+1,11,7);P('#6e747e',x+1,y+1,11,1);}}for(let k=0;k<30;k++)P('#e0eaf2',(r()*N)|0,(r()*N)|0,1,1);}
  if(kind==='frost2'){noise('#2a3a4e',['#324458','#223244','#3a5068'],200);for(let k=0;k<20;k++)P('#9ad8ff',(r()*N)|0,(r()*N)|0,1,1);for(let k=0;k<4;k++)P('#5a8ab0',(r()*N)|0,(r()*N)|0,5,1);}
  if(kind==='timber'){P('#4a3424',0,0,N,N);for(let x=0;x<N;x+=8){P('#6a4a30',x+1,0,6,N);P('#7a5a3a',x+1,0,1,N);for(let k=0;k<3;k++)P('#3a2818',x+1+(r()*5|0),(r()*N)|0,1,4);}}
  const t=tex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return TEX2[kind]=t;};}
