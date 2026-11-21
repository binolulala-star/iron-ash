/* ======================= VN-STYLE STANDING PORTRAITS ======================= */
const STAND={ryan:['cold','smirk','ash','gaze','roar'],claire:['neutral','angry','hurt','teary','grin'],claireh:['soft'],vera:['smile','cold','angry'],howard:['smile','hurt'],marta:['worried','happy'],tim:['neutral','laugh','cry'],hans:['teary','smile'],guard:['stern','scared'],glan:['smirk'],lia:['grin','worried','teary'],locke:['cold','smile'],orrick:['smile','cold','angry'],miner:['smile']};
const STAND_MAP={
 claire:{Default_Grin:'grin',Smile:'grin',Happy:'grin',Neutral:'neutral',Default_Cold:'neutral',Angry_Steam:'angry',Blush_LookAway:'angry',Combat_Roar:'teary',
   Teary_Fierce:'teary',Hurt:'hurt',Memory_Headache:'hurt',Cry:'hurt',Fork_Gaze:'hurt'},
 vera:{Smile:'smile',Happy:'smile',Default_Grin:'smile',Cynical_Smirk:'smile',Default_Cold:'cold',Neutral:'cold',Fork_Gaze:'cold',Angry_Steam:'angry',Combat_Roar:'angry',Hurt:'angry'},
 howard:{Hurt:'hurt',Cry:'hurt',Memory_Headache:'hurt'},
 marta:{Happy:'happy',Smile:'happy',Teary_Fierce:'happy'},
 tim:{Happy:'laugh',Smile:'laugh',Default_Grin:'laugh',Cry:'cry',Teary_Fierce:'cry'},
 hans:{Smile:'smile',Happy:'smile',Default_Grin:'smile'},
 guard:{Hurt:'scared',Cry:'scared',Memory_Headache:'scared'},
 lia:{Default_Grin:'grin',Smile:'grin',Happy:'grin',Neutral:'grin',Hurt:'worried',Memory_Headache:'worried',Fork_Gaze:'worried',Teary_Fierce:'teary',Cry:'teary'},
 locke:{Default_Cold:'cold',Neutral:'cold',Angry_Steam:'cold',Smile:'smile',Happy:'smile',Cynical_Smirk:'smile'},
 orrick:{Smile:'smile',Default_Grin:'smile',Cynical_Smirk:'smile',Default_Cold:'cold',Neutral:'cold',Fork_Gaze:'cold',Angry_Steam:'angry',Combat_Roar:'angry'},
 ryan:{Default_Cold:'cold',Cynical_Smirk:'smirk',Smile:'smirk',Default_Grin:'smirk',Happy:'smirk',AshEye_Overload:'ash',Angry_Steam:'ash',Fork_Gaze:'gaze',Hurt:'gaze',Memory_Headache:'gaze',Cry:'gaze',Teary_Fierce:'roar',Combat_Roar:'roar'},
};
const STAND_PRE={};
Object.entries(STAND).forEach(([who,list])=>list.forEach(k=>{const im=new Image();im.decoding='async';im.src=`portraits/${who}_${k}.webp`;STAND_PRE[who+'_'+k]=im;}));
function standKey(who,e){const list=STAND[who];if(!list)return null;const m=(STAND_MAP[who]||{})[e];return m&&list.includes(m)?m:list[0];}
let standWho=null;
function showStand(who,e){
  const st=$('st-stand'),img=$('st-stand-img');const k=who&&standKey(who,e);
  if(!k){st.classList.remove('on');standWho=null;return false;}
  const src=`portraits/${who}_${k}.webp`;
  if(standWho!==who){st.classList.remove('on','swap');void st.offsetWidth;img.src=src;st.classList.add('on');standWho=who;}
  else if(!img.src.endsWith(src)){img.src=src;st.classList.remove('swap');void st.offsetWidth;st.classList.add('swap');}
  return true;}
let standAlt=null;
{const o=playScene;playScene=function(list,onEnd,opts){standAlt=(typeof SCENES!=='undefined'&&list===SCENES.infirmary)?{claire:'claireh'}:null;return o(list,onEnd,opts);};}
{const o=drawFace;drawFace=function(who,e){const has=showStand(standAlt&&standAlt[who]||who,e);$('st-face').hidden=has;if(!has)o(who,e);};}
{const o=show;show=function(id){o(id);if(id!=='story'){const st=$('st-stand');if(st)st.classList.remove('on');standWho=null;}};}
