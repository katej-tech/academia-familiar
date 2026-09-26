"use strict";
/* ============ CONSTRUCTOR DE BLOQUES (pantallas; el motor 3D vive en bricks3d.js) ============
   Pedido: "incluir juegos tipo lego". Tres modos: construir libre, retos (copiar un modelo que se
   ve como bloques fantasma) y galería de construcciones guardadas. Bloques genéricos, sin marcas. */

const BR_COLORS=["#E53935","#1E88E5","#FDD835","#43A047","#FB8C00","#F5F5F5","#37474F","#8E24AA"];
const BR_SIZES=[[1,1],[1,2],[1,4],[2,2],[2,4]];
const BR_MODELS=(function(){
 const R="#E53935",B="#1E88E5",Y="#FDD835",G="#43A047",O="#FB8C00",W="#F5F5F5",K="#37474F",P="#8E24AA",BR="#8D6E63";
 /* [x,z,w,d,y,color] — y = piso (0 = sobre la base) */
 return [
  {id:"torre",nm:"Torre arcoíris",ic:"🌈",lvl:1,b:[[4,4,2,2,0,R],[4,4,2,2,1,O],[4,4,2,2,2,Y],[4,4,2,2,3,G],[4,4,2,2,4,B],[4,4,2,2,5,P]]},
  {id:"puente",nm:"El puente",ic:"🌉",lvl:1,b:[[1,4,2,2,0,B],[7,4,2,2,0,B],[1,4,4,2,1,Y],[5,4,4,2,1,Y]]},
  {id:"piramide",nm:"Pirámide",ic:"🔺",lvl:2,b:[[3,3,2,4,0,O],[5,3,2,4,0,O],[4,3,2,4,1,Y],[4,4,2,2,2,R],[4,4,1,1,3,W]]},
  {id:"carro",nm:"El carro",ic:"🚗",lvl:2,b:[[3,4,4,2,0,R],[3,3,1,1,0,K],[6,3,1,1,0,K],[3,6,1,1,0,K],[6,6,1,1,0,K],[4,4,2,2,1,B],[6,4,1,1,1,Y],[6,5,1,1,1,Y]]},
  {id:"robot",nm:"El robot",ic:"🤖",lvl:3,b:[[2,4,1,2,0,B],[5,4,1,2,0,B],[2,4,4,2,1,R],[3,4,2,2,2,Y],[3,4,1,1,3,K],[4,4,1,1,3,K]]},
  {id:"casita",nm:"La casita",ic:"🏠",lvl:3,b:[[2,3,2,4,0,R],[4,3,2,4,0,R],[6,3,2,4,0,R],[2,3,2,4,1,W],[4,3,2,4,1,B],[6,3,2,4,1,W],[2,3,2,4,2,BR],[4,3,2,4,2,BR],[6,3,2,4,2,BR],[4,3,2,4,3,BR]]}
 ];
})();
function brModelList(m){return m.b.map(function(a){return{x:a[0],z:a[1],w:a[2],d:a[3],y:a[4],color:a[5]};});}
let BRS={};

function screenBricks(){setTheme("kid");const p=prof();const done=p.bricksDone||{};
 const nDone=BR_MODELS.filter(function(m){return done[m.id];}).length;
 const btn=function(cls,ic,t,sub,fn){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🧱 Constructor de bloques</h2>'
  +'<p class="center" style="margin-bottom:12px">Construye lo que imagines o copia modelos. Retos completados: <b>'+nDone+'/'+BR_MODELS.length+'</b></p>'
  +btn("yellow","🏗️","Construir libre","Bloques de colores para crear lo que quieras","gameBricksFree()")
  +btn("green","🎯","Retos","Copia el modelo fantasma: torre, puente, carro, robot…","screenBrickChallenges()")
  +btn("blue","🖼️","Mis construcciones","Lo que guardaste ("+((p.bricksGallery||[]).length)+")","screenBricksGallery()"));}

function screenBrickChallenges(){setTheme("kid");const done=prof().bricksDone||{};
 const cards=BR_MODELS.map(function(m){const s=done[m.id]||0;
  return '<button onclick="gameBricksChallenge(\''+m.id+'\')" style="border:3px solid var(--kid-ink);border-radius:16px;background:'+(s?"#FEF9C3":"#fff")+';padding:12px 8px;box-shadow:0 5px 0 rgba(30,42,74,.5);text-align:center">'
   +'<div style="font-size:2.4rem">'+m.ic+'</div><div style="font-family:Fredoka;font-weight:700;font-size:.9rem">'+m.nm+'</div>'
   +'<div style="font-size:.75rem;opacity:.7">'+m.b.length+' bloques · nivel '+m.lvl+'</div><div>'+(s?"⭐".repeat(s):"☆☆☆")+'</div></button>';}).join("");
 render(topbar("screenBricks()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🎯 Retos de construcción</h2>'
  +'<p class="center" style="margin-bottom:10px">Verás el modelo como bloques transparentes: pon cada bloque del mismo color, tamaño y lugar</p>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+cards+'</div>');}

function brBuilderScreen(title,back,extraTop,extraBottom){
 const sizes=BR_SIZES.map(function(s,i){return '<button id="brsz'+i+'" onclick="brSize('+i+')" style="border:3px solid var(--kid-ink);border-radius:12px;background:#fff;padding:6px 8px;font-family:Fredoka;font-weight:700;font-size:.9rem;min-width:50px">'+s[0]+'×'+s[1]+'</button>';}).join("");
 const cols=BR_COLORS.map(function(c,i){return '<button id="brcl'+i+'" onclick="brColor('+i+')" style="width:36px;height:36px;border-radius:10px;border:3px solid #fff;background:'+c+';box-shadow:0 3px 8px rgba(30,42,74,.3)"></button>';}).join("");
 const tool=function(id,t,fn){return '<button id="'+id+'" onclick="'+fn+'" style="border:3px solid var(--kid-ink);border-radius:12px;background:#fff;padding:6px 10px;font-family:Fredoka;font-weight:700;font-size:.85rem">'+t+'</button>';};
 render(topbar(back)
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:2px">'+title+'</h2>'
  +(extraTop||"")
  +'<div class="card" style="padding:6px"><div id="bricks3d" style="width:100%;height:min(88vw,360px);border-radius:12px;overflow:hidden"></div></div>'
  +'<p class="center mut" style="font-size:.8rem;margin:2px 0 6px">Toca para poner un bloque · arrastra para girar la vista</p>'
  +'<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:6px">'+sizes+tool("brrot","🔄 Girar","brRotate()")+'</div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:8px">'+cols+'</div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">'
   +tool("brplace","🧱 Poner","brMode(\'place\')")+tool("brerase","🧽 Quitar","brMode(\'erase\')")+tool("brundo","↩️ Deshacer","BricksAPI&&BricksAPI.undo()")
   +tool("brzin","🔍+","BricksAPI&&BricksAPI.zoom(-2.5)")+tool("brzout","🔍−","BricksAPI&&BricksAPI.zoom(2.5)")+'</div>'
  +(extraBottom||""));
 brStyleSel();}
function brStyleSel(){
 const api=window.BricksAPI;if(!api)return;const s=api.sel();
 BR_SIZES.forEach(function(z,i){const b=document.getElementById("brsz"+i);if(b){const on=(z[0]===s.w&&z[1]===s.d)||(z[0]===s.d&&z[1]===s.w);b.style.background=on?"#FDE68A":"#fff";b.textContent=(on?s.w:z[0])+"×"+(on?s.d:z[1]);}});
 BR_COLORS.forEach(function(c,i){const b=document.getElementById("brcl"+i);if(b)b.style.borderColor=(c===s.color)?"#1E2A4A":"#fff";});
 const mode=BRS.mode||"place";
 [["brplace","place"],["brerase","erase"]].forEach(function(a){const b=document.getElementById(a[0]);if(b)b.style.background=(mode===a[1])?"#BBF7D0":"#fff";});}
function brSize(i){const api=window.BricksAPI;if(!api)return;api.setSize(BR_SIZES[i][0],BR_SIZES[i][1]);brStyleSel();}
function brRotate(){const api=window.BricksAPI;if(!api)return;api.rotate();brStyleSel();}
function brColor(i){const api=window.BricksAPI;if(!api)return;api.setColor(BR_COLORS[i]);BRS.mode="place";api.setMode("place");brStyleSel();}
function brMode(m){const api=window.BricksAPI;if(!api)return;BRS.mode=m;api.setMode(m);brStyleSel();}
function brStart(onChange){
 BRS.mode="place";
 if(typeof initBricks!=="function"){toast("Cargando el juego… intenta de nuevo",false,1500);return null;}
 const api=initBricks("bricks3d",{onChange:onChange,onMsg:function(t){toast(t,false,1400);}});
 if(api){api.setSize(2,2);api.setColor(BR_COLORS[0]);brStyleSel();}
 return api;}

/* ---- construir libre ---- */
function gameBricksFree(loadIdx){setTheme("kid");
 const g=prof().bricksGallery||[];
 brBuilderScreen("🏗️ Construir libre","screenBricks()","",
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><button class="kbtn green" style="min-height:50px;font-size:.95rem" onclick="brSave()">💾 Guardar</button><button class="kbtn yellow" style="min-height:50px;font-size:.95rem" onclick="brClear()">🗑️ Empezar de nuevo</button></div>'
  +'<p class="center mut" id="brCount" style="font-size:.85rem;margin-top:6px">0 bloques</p>');
 BRS.total=0;
 const api=brStart(function(i){const c=document.getElementById("brCount");if(c)c.textContent=i.count+" bloque"+(i.count===1?"":"s");BRS.total=i.count;});
 if(api&&loadIdx!==undefined&&g[loadIdx])api.setBricks(g[loadIdx].bricks);}
function brClear(){if(window.BricksAPI)BricksAPI.clear();}
function brSave(){
 const api=window.BricksAPI;if(!api)return;const bricks=api.getBricks();
 if(!bricks.length){toast("¡Construye algo primero! 🧱",false,1500);return;}
 const p=prof();if(!p.bricksGallery)p.bricksGallery=[];
 p.bricksGallery.unshift({img:api.snapshot(),bricks:bricks,t:Date.now()});if(p.bricksGallery.length>12)p.bricksGallery.pop();
 p.coins+=1;save();sOK();confetti(10);toast("¡Guardado en Mis construcciones! 🖼️ +1 🪙",true,1800);}
function screenBricksGallery(){setTheme("kid");const g=prof().bricksGallery||[];
 render(topbar("screenBricks()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🖼️ Mis construcciones</h2>'
  +(g.length?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+g.map(function(x,i){return '<div style="position:relative;border:3px solid var(--kid-ink);border-radius:14px;background:#DCEBFA;padding:4px;box-shadow:0 4px 0 rgba(30,42,74,.5)"><img src="'+x.img+'" style="width:100%;border-radius:10px;display:block" onclick="gameBricksFree('+i+')"><button class="spk" style="position:absolute;top:4px;right:4px;transform:scale(.7)" onclick="brDelete('+i+')">🗑️</button><div style="text-align:center;font-size:.75rem;font-weight:700">'+x.bricks.length+' bloques · toca para seguir</div></div>';}).join("")+'</div>'
   :'<div class="card center"><p>Aún no guardaste nada. ¡Construye algo y toca 💾 Guardar!</p></div>')
  +'<button class="kbtn green" style="margin-top:12px" onclick="gameBricksFree()">🏗️ Construir</button>');}
function brDelete(i){const p=prof();p.bricksGallery.splice(i,1);save();screenBricksGallery();}

/* ---- retos ---- */
function gameBricksChallenge(id){setTheme("kid");
 const m=BR_MODELS.find(function(x){return x.id===id;});if(!m)return;
 BRS.ch={m:m,done:false};
 brBuilderScreen(m.ic+" Reto: "+m.nm,"screenBrickChallenges()",
  '<p class="center" id="brProg" style="font-family:Fredoka;font-weight:700;color:#3B82F6;margin-bottom:6px">Bloques correctos: 0/'+m.b.length+'</p>',
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><button class="kbtn white" id="brghost" style="min-height:50px;font-size:.95rem" onclick="brToggleGhost()">👻 Modelo: visible</button><button class="kbtn yellow" style="min-height:50px;font-size:.95rem" onclick="brClear()">🗑️ Empezar de nuevo</button></div>'
  +'<p class="center mut" style="font-size:.8rem;margin-top:6px">💡 Empieza por el piso de abajo (los bloques de más arriba se apoyan en ellos)</p>');
 const api=brStart(function(i){
  const el=document.getElementById("brProg");
  if(el)el.textContent="Bloques correctos: "+i.progress.done+"/"+i.progress.total;
  BRS.placed=i.count;
  if(!BRS.ch.done&&i.progress.total&&i.progress.done===i.progress.total)brChallengeDone();});
 if(api)api.setGhost(brModelList(m));}
function brToggleGhost(){const on=BricksAPI.toggleGhost();const b=document.getElementById("brghost");if(b)b.textContent="👻 Modelo: "+(on?"visible":"oculto");}
function brChallengeDone(){
 BRS.ch.done=true;const m=BRS.ch.m,extra=(BRS.placed||m.b.length)-m.b.length;
 const stars=extra<=2?3:extra<=6?2:1;
 const p=prof();if(!p.bricksDone)p.bricksDone={};p.bricksDone[m.id]=Math.max(p.bricksDone[m.id]||0,stars);
 p.coins+=2+stars;p.xp+=8;save();
 setTimeout(function(){sWIN();confetti(24);nodeWin(stars,"Constructor de bloques: "+m.nm);},600);}
