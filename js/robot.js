"use strict";
/* ============ PROGRAMA AL ROBOT (pensamiento computacional, inspirado en Scratch / Blockly Games) ============
   Pedido: "tener en cuenta las nuevas plataformas de estudio en GitHub". Revisé proyectos abiertos
   (GCompris, Tux Paint, Blockly Games, Scratch) y de ahí sale esta idea: armar una SECUENCIA de
   órdenes (avanzar, girar) para llevar al robot a la meta sin chocar; desde el nivel 6 aparecen los
   BUCLES ("repetir 4 veces") porque el programa tiene pocos espacios. Nada de teclear código:
   se toca y se ve al robot ejecutarlo paso a paso. */

const RB_DIRS=[[1,0],[0,1],[-1,0],[0,-1]];   /* 0=este 1=sur 2=oeste 3=norte */
const RB_ARROW=["➡️","⬇️","⬅️","⬆️"];
/* S=inicio(mirando al este) G=meta #=roca *=estrella; slots = espacios del programa; par = programa ideal */
const RB_LEVELS=[
 {nm:"Primer paso",rows:["","","S..G.","",""],slots:6,par:3,tip:"Toca ⬆️ Avanzar tres veces y ▶️ Ejecutar."},
 {nm:"Girar",rows:["","..G..","","","S...."],slots:8,par:6,tip:"El robot mira a la derecha. Gira a la izquierda ↩️ para subir."},
 {nm:"¡Una roca!",rows:["","","S.#.G","",""],slots:12,par:10,tip:"Rodea la roca 🪨 por abajo."},
 {nm:"Estrellas",rows:["S.*.*","","","","....G"],slots:12,par:9,tip:"Pasa por las estrellas ⭐ de camino a la meta."},
 {nm:"El laberinto",rows:["S.#.G","..#..","....."],slots:14,par:11,tip:"Sigue el camino libre y esquiva las rocas."},
 {nm:"¡Bucles!",rows:["S....","","","","....G"],slots:8,par:7,loops:true,tip:"🔁 Repetir ahorra espacios: ×4[ Avanzar ] va cuatro casillas."},
 {nm:"La escalera",rows:["....G","","","","S...."],slots:8,par:6,loops:true,tip:"Puedes subir en escalera o en 'L'. ¡Con un bucle cabe en pocos espacios!"},
 {nm:"Rodea las rocas",rows:["","..#..","S.#.G","..#..",""],slots:12,par:11,loops:true,tip:"Sube, cruza por arriba y baja. Los bucles ayudan."}
];
let RBT={};
function rbParse(lv){
 const g=[];let sx=0,sy=0,gx=0,gy=0;
 for(let y=0;y<5;y++){const row=(lv.rows[y]||"").padEnd(5,".");g.push([]);
  for(let x=0;x<5;x++){const c=row[x]==="…"?".":row[x];
   if(c==="S"){sx=x;sy=y;g[y].push(".");}else if(c==="G"){gx=x;gy=y;g[y].push(".");}else g[y].push(c);}}
 return{g:g,sx:sx,sy:sy,gx:gx,gy:gy};}

function screenRobot(){setTheme("kid");const p=prof();const unlocked=p.robotUnlocked||1;const st=p.robotStars||{};
 const cards=RB_LEVELS.map(function(l,i){const open=i<unlocked;
  return '<button '+(open?'onclick="robotStart('+i+')"':'disabled')+' style="border:3px solid var(--kid-ink);border-radius:16px;background:'+(open?"#fff":"#D7DCE6")+';padding:10px 6px;box-shadow:0 5px 0 rgba(30,42,74,.5);opacity:'+(open?1:.55)+'"><div style="font-size:1.6rem">'+(open?(l.loops?"🔁":"🤖"):"🔒")+'</div><div style="font-family:Fredoka;font-weight:700;font-size:.85rem">'+(i+1)+'. '+l.nm+'</div><div>'+(st[i]?"⭐".repeat(st[i]):"☆☆☆")+'</div></button>';}).join("");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🤖 Programa al robot</h2>'
  +'<p class="center" style="margin-bottom:10px">Dale órdenes en orden para llevar al robot hasta la meta 🏁. ¡Así piensan los programadores!</p>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+cards+'</div>');}

function robotStart(i){setTheme("kid");
 const lv=RB_LEVELS[i];const P=rbParse(lv);
 RBT={i:i,lv:lv,P:P,prog:[],x:P.sx,y:P.sy,d:0,got:{},running:false,tries:0};
 render(topbar("screenRobot()")
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:2px">🤖 Nivel '+(i+1)+': '+lv.nm+'</h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:6px">💡 '+lv.tip+'</p>'
  +'<div id="rbGrid" class="card" style="padding:8px"></div>'
  +'<div class="card" style="padding:8px 10px"><div style="font-family:Fredoka;font-weight:700;font-size:.85rem;margin-bottom:4px">📋 Tu programa <span id="rbCount"></span></div><div id="rbProg" style="display:flex;flex-wrap:wrap;gap:4px;min-height:38px"></div></div>'
  +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px">'
   +'<button class="kbtn green" style="min-height:52px;font-size:.9rem;padding:6px" onclick="rbAdd(\'F\')">⬆️ Avanzar</button>'
   +'<button class="kbtn blue" style="min-height:52px;font-size:.9rem;padding:6px" onclick="rbAdd(\'L\')">↩️ Girar izq.</button>'
   +'<button class="kbtn blue" style="min-height:52px;font-size:.9rem;padding:6px" onclick="rbAdd(\'R\')">↪️ Girar der.</button>'
   +(lv.loops?'<button class="kbtn yellow" style="min-height:52px;font-size:.85rem;padding:6px" onclick="rbAdd(\'X2\')">🔁 ×2 [</button><button class="kbtn yellow" style="min-height:52px;font-size:.85rem;padding:6px" onclick="rbAdd(\'X4\')">🔁 ×4 [</button><button class="kbtn yellow" style="min-height:52px;font-size:.85rem;padding:6px" onclick="rbAdd(\'E\')">] fin</button>':'')
  +'</div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"><button class="kbtn white" style="min-height:48px;font-size:.9rem" onclick="rbBack()">⌫ Borrar</button><button class="kbtn white" style="min-height:48px;font-size:.9rem" onclick="rbClear()">🗑️ Limpiar</button></div>'
  +'<button class="kbtn purple" style="margin-top:8px" onclick="rbRun()">▶️ ¡Ejecutar!</button>'
  +'<div id="rbMsg" class="center" style="min-height:1.6em;font-family:Fredoka;font-weight:700;margin-top:6px"></div>');
 rbDraw();rbDrawProg();}

function rbDraw(){
 const P=RBT.P,S=[];
 for(let y=0;y<5;y++)for(let x=0;x<5;x++){
  let c="",bg="#F1F5F9";
  if(P.g[y][x]==="#"){c="🪨";bg="#CBD5E1";}
  else if(P.g[y][x]==="*"&&!RBT.got[x+","+y])c="⭐";
  if(x===P.gx&&y===P.gy){c=(RBT.x===x&&RBT.y===y)?"":"🏁";bg="#DCFCE7";}
  if(x===RBT.x&&y===RBT.y)c='<span style="position:relative;display:inline-block">🤖<span style="position:absolute;right:-8px;bottom:-4px;font-size:.6em">'+RB_ARROW[RBT.d]+'</span></span>';
  S.push('<div style="aspect-ratio:1;background:'+bg+';border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:clamp(1.4rem,8vw,2.1rem)">'+c+'</div>');}
 document.getElementById("rbGrid").innerHTML='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;max-width:320px;margin:0 auto">'+S.join("")+'</div>';}
function rbLabel(t){return{F:"⬆️",L:"↩️",R:"↪️",X2:"🔁×2[",X4:"🔁×4[",E:"]"}[t];}
function rbDrawProg(){
 const el=document.getElementById("rbProg");if(!el)return;
 el.innerHTML=RBT.prog.map(function(t){return '<span style="background:'+(t==="F"?"#BBF7D0":t==="E"||t[0]==="X"?"#FEF08A":"#BFDBFE")+';border:2px solid var(--kid-ink);border-radius:10px;padding:4px 8px;font-size:1.05rem;font-weight:700">'+rbLabel(t)+'</span>';}).join("")||'<span class="mut" style="font-size:.85rem">Toca los botones para agregar órdenes…</span>';
 const c=document.getElementById("rbCount");if(c)c.textContent="("+RBT.prog.length+" de "+RBT.lv.slots+")";}
function rbAdd(t){if(RBT.running)return;if(RBT.prog.length>=RBT.lv.slots){toast("¡El programa está lleno! Prueba con menos órdenes 🔁",false,1600);return;}RBT.prog.push(t);beep([520],.04);rbDrawProg();}
function rbBack(){if(RBT.running)return;RBT.prog.pop();rbDrawProg();}
function rbClear(){if(RBT.running)return;RBT.prog=[];rbReset();rbDrawProg();}
function rbReset(){RBT.x=RBT.P.sx;RBT.y=RBT.P.sy;RBT.d=0;RBT.got={};rbDraw();}
/* expande bucles a una lista plana de F/L/R (null = paréntesis mal cerrados) */
function rbExpand(prog){
 function parse(i,stop){const out=[];while(i<prog.length){const t=prog[i];
   if(t==="E"){if(stop)return{out:out,i:i+1};return null;}
   if(t[0]==="X"){const n=parseInt(t.slice(1),10);const r=parse(i+1,true);if(!r)return null;for(let k=0;k<n;k++)r.out.forEach(function(x){out.push(x);});i=r.i;}
   else{out.push(t);i++;}}
  return stop?null:{out:out,i:i};}
 const r=parse(0,false);return r?r.out:null;}
function rbRun(){
 if(RBT.running)return;const flat=rbExpand(RBT.prog);
 const msg=document.getElementById("rbMsg");
 if(!RBT.prog.length){if(msg)msg.textContent="Primero agrega órdenes 👆";return;}
 if(!flat){if(msg)msg.textContent="Cada 🔁 necesita su ] para cerrarse";return;}
 RBT.running=true;RBT.tries++;rbReset();if(msg)msg.textContent="";
 let k=0;
 (function step(){
  if(k>=flat.length){RBT.running=false;return rbEnd(false,"El robot terminó, pero no llegó a la meta 🏁. ¡Prueba otra vez!");}
  const t=flat[k++];
  if(t==="L")RBT.d=(RBT.d+3)%4;else if(t==="R")RBT.d=(RBT.d+1)%4;
  else{const nx=RBT.x+RB_DIRS[RBT.d][0],ny=RBT.y+RB_DIRS[RBT.d][1];
   if(nx<0||ny<0||nx>4||ny>4||RBT.P.g[ny][nx]==="#"){beep([160],.25);RBT.running=false;return rbEnd(false,"¡Ay, choqué! 💥 Revisa el camino.");}
   RBT.x=nx;RBT.y=ny;if(RBT.P.g[ny][nx]==="*"){RBT.got[nx+","+ny]=1;beep([880],.08);}else beep([400],.04);}
  rbDraw();
  if(RBT.x===RBT.P.gx&&RBT.y===RBT.P.gy){RBT.running=false;return rbEnd(true);}
  setTimeout(step,420);})();}
function rbEnd(ok,text){
 const msg=document.getElementById("rbMsg");
 if(!ok){sNO();recordAnswer("Programación",false,8);if(msg)msg.textContent=text;return;}
 const stars=Object.keys(RBT.got).length,total=RBT.P.g.flat().filter(function(c){return c==="*";}).length;
 const used=RBT.prog.length,par=RBT.lv.par;
 let s=used<=par+1?3:used<=par+4?2:1;
 if(total&&stars<total)s=Math.min(s,2);
 const p=prof();if(!p.robotStars)p.robotStars={};p.robotStars[RBT.i]=Math.max(p.robotStars[RBT.i]||0,s);
 if((p.robotUnlocked||1)<RBT.i+2&&RBT.i+1<RB_LEVELS.length)p.robotUnlocked=RBT.i+2;
 p.coins+=2+s+stars;p.xp+=8;save();recordAnswer("Programación",true,15);
 sWIN();confetti(24);
 const last=RBT.i+1>=RB_LEVELS.length;
 document.getElementById("rbMsg").innerHTML='🏆 ¡Llegó a la meta con '+used+' órdenes! '+"⭐".repeat(s)+'<br><button class="kbtn green" style="margin-top:8px" onclick="'+(last?"screenRobot()":"robotStart("+(RBT.i+1)+")")+'">'+(last?"🎉 ¡Todos los niveles! Volver":"Siguiente nivel ▶️")+'</button>';}
