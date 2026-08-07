"use strict";
/* ============ JUEGO DE MEMORIA GENÉRICO (perfil adulto) ============ */
/* startMemoryGame(pairs,opts): pairs=[[frente,reverso],...] — se arma con el vocabulario
   de la lección activa de idiomas, pero es genérico (reutilizable por Python: término↔definición). */
let MG={};
function startMemoryGame(pairs,opts){
 if(!pairs||!pairs.length)return toast("No hay contenido para el juego de memoria",false,1500);
 opts=opts||{};
 const n=Math.min(pairs.length,8);
 const chosen=shuffled(pairs.slice()).slice(0,n);
 let cards=[];
 chosen.forEach((p,i)=>{cards.push({text:p[0],pairIdx:i,revealed:false,matched:false});cards.push({text:p[1],pairIdx:i,revealed:false,matched:false});});
 cards=shuffled(cards);
 if(MG.timer)clearInterval(MG.timer);
 MG={cards,flipped:[],matches:0,moves:0,seconds:0,back:opts.back||"screenAdultHome()",lock:false};
 MG.timer=setInterval(function(){MG.seconds++;updateMGTimer();},1000);
 renderMemoryGame();}
function renderMemoryGame(){setTheme("adulto");
 render(topbar(MG.back)
  +'<h2 style="text-align:center">🧠 Memoria</h2>'
  +'<p class="mut center" id="mgstats">Movimientos: '+MG.moves+' · Tiempo: '+MG.seconds+'s</p>'
  +'<div class="mgrid">'+MG.cards.map((c,i)=>'<button class="mgcard'+(c.matched?" matched":c.revealed?" revealed":"")+'" onclick="flipMG('+i+')">'+((c.revealed||c.matched)?esc(c.text):"❓")+'</button>').join("")+'</div>');}
function updateMGTimer(){const el=document.getElementById("mgstats");if(el)el.textContent="Movimientos: "+MG.moves+" · Tiempo: "+MG.seconds+"s";}
function flipMG(i){
 if(MG.lock)return;
 const c=MG.cards[i];
 if(!c||c.matched||c.revealed||MG.flipped.length>=2)return;
 c.revealed=true;MG.flipped.push(i);
 renderMemoryGame();
 if(MG.flipped.length===2){
  MG.moves++;MG.lock=true;
  const a=MG.flipped[0],b=MG.flipped[1];
  const same=MG.cards[a].pairIdx===MG.cards[b].pairIdx;
  setTimeout(function(){
   if(same){MG.cards[a].matched=true;MG.cards[b].matched=true;MG.matches++;sOK();confetti(4);}
   else{MG.cards[a].revealed=false;MG.cards[b].revealed=false;sNO();}
   MG.flipped=[];MG.lock=false;
   if(MG.matches===MG.cards.length/2)return finishMemoryGame();
   renderMemoryGame();
  },800);}}
function finishMemoryGame(){
 clearInterval(MG.timer);MG.timer=null;
 prof().coins+=10;prof().xp+=12;save();
 setTheme("adulto");
 render(topbar(MG.back)
  +'<div class="card center"><div style="font-size:3rem">🎉</div><h2>¡Completaste la memoria!</h2>'
  +'<p style="margin-top:8px">'+MG.moves+' movimientos en '+MG.seconds+' segundos</p></div>'
  +'<button class="abtn green" onclick="'+MG.back+'">Continuar</button>');}
