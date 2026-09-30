"use strict";
/* ============ PRINCIPIOS DE AJEDREZ (para niños, no un motor completo) ============
   Pedido: "principios de ajedrez". No es un juego de ajedrez jugable contra alguien — es una
   lección interactiva: cómo se mueve cada pieza (tablero vacío, casillas válidas resaltadas),
   un quiz de "¿puede moverse ahí?", el valor relativo de las piezas y 5 trucos de apertura para
   empezar bien. Tablero: grid CSS 8x8, piezas con el glyph Unicode + círculo de color detrás
   para que se vean bien en cualquier pantalla (los glyphs huecos ♙♖♘ se ven mal en fondo claro). */

const CH_PIECES=[
 {id:"peon",nm:"Peón",g:"♟",val:1,color:"#64748B",tx:"El peón avanza UNA casilla hacia adelante (dos si es su primer movimiento). Para comer, avanza en diagonal. ¡Nunca retrocede!"},
 {id:"caballo",nm:"Caballo",g:"♞",val:3,color:"#B45309",tx:"El caballo se mueve en 'L': dos casillas en una dirección y una hacia el lado. Es la única pieza que puede saltar por encima de otras."},
 {id:"alfil",nm:"Alfil",g:"♝",val:3,color:"#0EA5E9",tx:"El alfil se mueve solo en diagonal, todo lo lejos que quiera. Cada alfil se queda toda la partida en casillas del mismo color."},
 {id:"torre",nm:"Torre",g:"♜",val:5,color:"#DC2626",tx:"La torre se mueve en línea recta: hacia arriba, abajo o los lados, todo lo lejos que quiera."},
 {id:"dama",nm:"Dama (reina)",g:"♛",val:9,color:"#7C3AED",tx:"La dama es la pieza más poderosa: se mueve como la torre Y como el alfil juntos, todo lo lejos que quiera."},
 {id:"rey",nm:"Rey",g:"♚",val:0,color:"#16A34A",tx:"El rey se mueve UNA casilla en cualquier dirección. Es el más importante: si no puede escapar de un ataque, ¡es jaque mate y se acaba la partida!"}];
const CH_TIPS=[
 {ic:"🎯",t:"Controla el centro",d:"Las 4 casillas del centro del tablero son las más valiosas: desde ahí tus piezas ven más casillas."},
 {ic:"🐴",t:"Saca primero caballos y alfiles",d:"Antes de mover la dama, desarrolla tus caballos y alfiles — así tienes más piezas listas para atacar y defender."},
 {ic:"🏰",t:"Protege a tu rey (enroque)",d:"Pon a tu rey a salvo pronto, escondido detrás de sus peones, en vez de dejarlo en el centro."},
 {ic:"🔁",t:"No muevas la misma pieza dos veces",d:"Al principio, es mejor sacar piezas nuevas que mover la misma una y otra vez — ¡así avanzas más rápido!"},
 {ic:"🎁",t:"No regales piezas gratis",d:"Antes de mover, pregúntate: ¿mi pieza queda protegida, o el rival se la puede comer sin perder nada?"}];
function pieceOf(id){return CH_PIECES.find(function(p){return p.id===id;});}

/* ---------- movimientos legales en tablero vacío (8x8, r,c de 0 a 7) ---------- */
function chDests(id,r,c){
 const N=8,out=[],push=function(rr,cc){if(rr>=0&&rr<N&&cc>=0&&cc<N)out.push(rr+","+cc);};
 if(id==="peon"){push(r-1,c);if(r===6)push(r-2,c);}
 else if(id==="rey"){for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc)push(r+dr,c+dc);}
 else if(id==="caballo"){[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]].forEach(function(d){push(r+d[0],c+d[1]);});}
 else{
  const dirs=id==="torre"?[[1,0],[-1,0],[0,1],[0,-1]]:id==="alfil"?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  dirs.forEach(function(d){for(let k=1;k<N;k++){const rr=r+d[0]*k,cc=c+d[1]*k;if(rr<0||rr>=N||cc<0||cc>=N)break;out.push(rr+","+cc);}});
 }
 return out;}
function chBoard(id,piece,highlight,star){
 const N=8,cells=[];
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const dark=(r+c)%2===1,key=r+","+c;
  let content="";
  if(piece&&piece.r===r&&piece.c===c)content='<span style="position:relative;display:inline-block;width:1.6em;height:1.6em;line-height:1.6em;border-radius:50%;background:'+piece.def.color+'22;color:'+piece.def.color+';font-size:clamp(1.3rem,6.5vw,1.9rem);text-shadow:0 1px 0 rgba(0,0,0,.15)">'+piece.def.g+'</span>';
  else if(star===key)content='<span style="font-size:clamp(1.1rem,5.5vw,1.5rem)">★</span>';
  cells.push('<div style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:'+(highlight&&highlight.has(key)?"#86EFAC":dark?"#7C9CB5":"#EAF1F8")+'">'+content+'</div>');}
 return '<div style="display:grid;grid-template-columns:repeat(8,1fr);border:4px solid var(--kid-ink);border-radius:12px;overflow:hidden;max-width:340px;margin:0 auto">'+cells.join("")+'</div>';}

/* ---------- hub ---------- */
function screenChess(){setTheme("kid");const p=prof();const done=p.chessDone||{};
 const pieces=CH_PIECES.map(function(pc){const ok=done[pc.id];
  return '<button onclick="chessLesson(\''+pc.id+'\')" style="border:3px solid var(--kid-ink);border-radius:16px;background:'+(ok?"#FEF9C3":"#fff")+';padding:10px 6px;box-shadow:0 5px 0 rgba(30,42,74,.5);text-align:center">'
   +'<div style="width:1.8em;height:1.8em;line-height:1.8em;border-radius:50%;background:'+pc.color+'22;color:'+pc.color+';margin:0 auto;font-size:1.7rem">'+pc.g+'</div>'
   +'<div style="font-family:Fredoka;font-weight:700;font-size:.85rem;margin-top:4px">'+pc.nm+'</div>'+(ok?'<div>⭐</div>':'')+'</button>';}).join("");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">♟️ Ajedrez para principiantes</h2>'
  +'<p class="center" style="margin-bottom:10px">Aprende cómo se mueve cada pieza — toca una para empezar</p>'
  +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">'+pieces+'</div>'
  +'<button class="kbtn purple" onclick="chessValueStart()">💎 ¿Cuál pieza vale más?</button>'
  +'<button class="kbtn blue" onclick="screenChessTips()">💡 Trucos para empezar bien</button>');}

/* ---------- lección de movimiento ---------- */
function chessLesson(id){setTheme("kid");
 const def=pieceOf(id),r=3,c=3,dests=new Set(chDests(id,r,c));
 render(topbar("screenChess()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">'+def.g+' '+def.nm+'</h2>'
  +'<p class="center" style="margin-bottom:8px;line-height:1.5">'+def.tx+'</p>'
  +'<p class="center mut" style="font-size:.8rem;margin-bottom:6px">🟢 = casillas a las que se puede mover desde aquí</p>'
  +chBoard(null,{r:r,c:c,def:def},dests)
  +'<button class="kbtn green" style="margin-top:14px" onclick="chessQuizStart(\''+id+'\')">🎯 ¡Ponme a prueba!</button>'
  +'<button class="kbtn white" style="margin-top:8px" onclick="screenChess()">← Volver</button>');
 speakES(def.nm+". "+def.tx);}

/* ---------- quiz: ¿puede moverse ahí? sí/no ---------- */
let CHQ={};
function chessQuizStart(id){setTheme("kid");CHQ={id:id,round:0,total:5,ok:0};chessQuizNext();}
function chessQuizNext(){
 if(CHQ.round>=CHQ.total)return chessQuizEnd();
 const def=pieceOf(CHQ.id),r=1+rnd(6),c=1+rnd(6),dests=new Set(chDests(CHQ.id,r,c));
 let star,isValid;
 if(Math.random()<.5){const arr=[...dests];if(arr.length){star=pick(arr);isValid=true;}}
 if(!star){
  let tries=0;do{const rr=rnd(8),cc=rnd(8),k=rr+","+cc;if(k!==r+","+c&&!dests.has(k)){star=k;isValid=false;}}while(!star&&tries++<60);
  if(!star){star=[...dests][0];isValid=true;}}
 CHQ.answered=false;CHQ.correct=isValid;
 render(topbar("screenChess()")
  +'<div class="progressdots">'+dots(CHQ.total,CHQ.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:4px">'+def.g+' ¿Puede el '+def.nm.toLowerCase()+' moverse a la ★?</h2>'
  +chBoard(null,{r:r,c:c,def:def},null,star)
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px"><button class="kbtn green" style="min-height:56px;font-size:1.1rem" onclick="chessAns(true)">✅ Sí</button><button class="kbtn red" style="min-height:56px;font-size:1.1rem" onclick="chessAns(false)">❌ No</button></div>'
  +'<div id="chFb"></div>');}
function chessAns(said){
 if(CHQ.answered)return;CHQ.answered=true;
 const ok=said===CHQ.correct;recordAnswer("Ajedrez",ok,12);
 if(ok){sOK();confetti(8);CHQ.ok++;}else sNO();
 document.getElementById("chFb").innerHTML='<div class="card" style="margin-top:10px;background:'+(ok?"#DCFCE7":"#FEE2E2")+'"><b>'+(ok?"✅ ¡Correcto!":"❌ Casi…")+'</b><p style="margin:6px 0 0">'+(CHQ.correct?"Sí, esa casilla SÍ está en su camino de movimiento.":"No, esa casilla NO está en su camino de movimiento.")+'</p></div><button class="kbtn green" onclick="chessQuizContinue()">Continuar ▶️</button>';}
function chessQuizContinue(){CHQ.round++;chessQuizNext();}
function chessQuizEnd(){
 const def=pieceOf(CHQ.id),p=prof();if(!p.chessDone)p.chessDone={};
 if(CHQ.ok>=4)p.chessDone[CHQ.id]=true;
 p.coins+=2+CHQ.ok;p.xp+=8;save();
 if(CHQ.ok>=4){sWIN();confetti(24);}
 render(topbar("screenChess()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">'+def.g+' ¡Practicaste el '+def.nm.toLowerCase()+'!</h2>'
  +'<div class="card center"><div style="font-size:3rem">'+(CHQ.ok>=4?"🌟":CHQ.ok>=2?"👍":"💪")+'</div><b style="font-size:1.1rem">'+CHQ.ok+' de '+CHQ.total+' bien</b></div>'
  +'<button class="kbtn green" onclick="screenChess()">♟️ Ver más piezas</button>'
  +'<button class="kbtn white" onclick="chessQuizStart(\''+CHQ.id+'\')">🔁 Practicar otra vez</button>');}

/* ---------- valor de las piezas ---------- */
let CHV={};
function chessValueStart(){setTheme("kid");CHV={round:0,total:5,ok:0};chessValueNext();}
function chessValueNext(){
 if(CHV.round>=CHV.total)return chessValueEnd();
 let a,b;do{a=pick(CH_PIECES);b=pick(CH_PIECES);}while(a.id===b.id||a.val===b.val);
 CHV.a=a;CHV.b=b;CHV.answered=false;
 render(topbar("screenChess()")
  +'<div class="progressdots">'+dots(CHV.total,CHV.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:10px">💎 ¿Cuál pieza vale más?</h2>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">'
  +[a,b].map(function(pc){return '<button onclick="chessValueAns(\''+pc.id+'\')" style="border:3px solid var(--kid-ink);border-radius:16px;background:#fff;padding:16px 8px;box-shadow:0 5px 0 rgba(30,42,74,.5)"><div style="width:2em;height:2em;line-height:2em;border-radius:50%;background:'+pc.color+'22;color:'+pc.color+';margin:0 auto;font-size:2.2rem">'+pc.g+'</div><div style="font-family:Fredoka;font-weight:700;margin-top:6px">'+pc.nm+'</div></button>';}).join("")
  +'</div><div id="chvFb"></div>');}
function chessValueAns(id){
 if(CHV.answered)return;CHV.answered=true;
 const winner=CHV.a.val>CHV.b.val?CHV.a:CHV.b,ok=id===winner.id;
 recordAnswer("Ajedrez",ok,10);
 if(ok){sOK();confetti(8);CHV.ok++;}else sNO();
 document.getElementById("chvFb").innerHTML='<div class="card" style="margin-top:10px;background:'+(ok?"#DCFCE7":"#FEE2E2")+'"><b>'+(ok?"✅ ¡Sí!":"❌ Casi…")+'</b><p style="margin:6px 0 0">La '+winner.nm.toLowerCase()+' vale más ('+CH_PIECES.map(function(p){return p.nm+"="+p.val;}).join(", ")+' — el rey no tiene número: ¡si lo pierdes, se acaba el juego!).</p></div><button class="kbtn green" onclick="chessValueContinue()">Continuar ▶️</button>';}
function chessValueContinue(){CHV.round++;chessValueNext();}
function chessValueEnd(){
 const p=prof();p.coins+=2+CHV.ok;p.xp+=8;save();if(CHV.ok>=4){sWIN();confetti(20);}
 nodeWin(starsFor(CHV.ok,CHV.total),"Valor de las piezas");}

/* ---------- trucos de apertura ---------- */
function screenChessTips(){setTheme("kid");
 render(topbar("screenChess()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:10px">💡 Trucos para empezar bien</h2>'
  +CH_TIPS.map(function(t){return '<div class="card" style="display:flex;gap:12px;align-items:flex-start"><span style="font-size:2rem">'+t.ic+'</span><div><b>'+t.t+'</b><p style="margin:4px 0 0;line-height:1.4;font-size:.92rem">'+t.d+'</p></div></div>';}).join("")
  +'<button class="kbtn green" style="margin-top:10px" onclick="screenChess()">♟️ Volver</button>');}
