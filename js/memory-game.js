"use strict";
/* ============ JUEGO DE MEMORIA GENÉRICO (perfil adulto) ============ */
/* startMemoryGame(pairs,opts): pairs=[[frente,reverso],...] — se arma con el vocabulario
   de la lección activa de idiomas, pero es genérico (reutilizable por Python: término↔definición).
   Guarda el mejor puntaje por set de palabras (mgScoreKey) y califica con estrellas al terminar,
   para que se sienta menos plano que solo emparejar tarjetas. */
let MG={};
function mgScoreKey(pairs){
 const words=pairs.map(function(p){return p[0];}).slice().sort().join("|");
 return "mg_"+seedFromStr(words);}
function mgBestList(){const p=prof();if(!p.memoryBest)p.memoryBest={};return p.memoryBest;}
function mgStars(moves,pairCount){
 if(moves<=pairCount+2)return 3;
 if(moves<=pairCount*2)return 2;
 return 1;}
function startMemoryGame(pairs,opts){
 if(!pairs||!pairs.length)return toast("No hay contenido para el juego de memoria",false,1500);
 opts=opts||{};
 const scoreKey=mgScoreKey(pairs);
 const n=Math.min(pairs.length,8);
 const chosen=shuffled(pairs.slice()).slice(0,n);
 let cards=[];
 chosen.forEach((p,i)=>{cards.push({text:p[0],pairIdx:i,revealed:false,matched:false});cards.push({text:p[1],pairIdx:i,revealed:false,matched:false});});
 cards=shuffled(cards);
 if(MG.timer)clearInterval(MG.timer);
 MG={cards,flipped:[],matches:0,moves:0,seconds:0,back:opts.back||"screenAdultHome()",lock:false,scoreKey:scoreKey};
 MG.timer=setInterval(function(){MG.seconds++;updateMGTimer();},1000);
 renderMemoryGame();}
function renderMemoryGame(){setTheme("adulto");
 const best=mgBestList()[MG.scoreKey];
 render(topbar(MG.back)
  +'<h2 style="text-align:center">🧠 Memoria</h2>'
  +'<p class="mut center" id="mgstats">Movimientos: '+MG.moves+' · Tiempo: '+MG.seconds+'s'+(best?' · Récord: '+best.moves+' mov. / '+best.seconds+'s':'')+'</p>'
  +'<div class="mgrid">'+MG.cards.map((c,i)=>'<button class="mgcard'+(c.matched?" matched":c.revealed?" revealed":"")+'" onclick="flipMG('+i+')">'+((c.revealed||c.matched)?esc(c.text):"❓")+'</button>').join("")+'</div>');}
function updateMGTimer(){const el=document.getElementById("mgstats");if(el){const best=mgBestList()[MG.scoreKey];el.textContent="Movimientos: "+MG.moves+" · Tiempo: "+MG.seconds+"s"+(best?" · Récord: "+best.moves+" mov. / "+best.seconds+"s":"");}}
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
   if(same){MG.cards[a].matched=true;MG.cards[b].matched=true;MG.matches++;sOK();} // sin confetti aquí: por cada match se sentía saturado/feo; la animación mgpop + el confetti final (finishMemoryGame) ya celebran
   else{MG.cards[a].revealed=false;MG.cards[b].revealed=false;sNO();}
   MG.flipped=[];MG.lock=false;
   if(MG.matches===MG.cards.length/2)return finishMemoryGame();
   renderMemoryGame();
  },800);}}
function finishMemoryGame(){
 clearInterval(MG.timer);MG.timer=null;
 const pairCount=MG.cards.length/2;
 const stars=mgStars(MG.moves,pairCount);
 const best=mgBestList();
 const prevBest=best[MG.scoreKey];
 const isRecord=!prevBest||MG.moves<prevBest.moves||(MG.moves===prevBest.moves&&MG.seconds<prevBest.seconds);
 if(isRecord)best[MG.scoreKey]={moves:MG.moves,seconds:MG.seconds};
 prof().coins+=10+stars*3;prof().xp+=12;save();
 setTheme("adulto");
 render(topbar(MG.back)
  +'<div class="card center"><div style="font-size:3rem">'+(stars===3?"🏆":stars===2?"🌟":"🎉")+'</div><h2>¡Completaste la memoria!</h2>'
  +'<p style="font-size:1.8rem;margin-top:6px;letter-spacing:2px">'+"⭐".repeat(stars)+"☆".repeat(3-stars)+'</p>'
  +'<p style="margin-top:8px">'+MG.moves+' movimientos en '+MG.seconds+' segundos</p>'
  +(isRecord?'<p style="margin-top:8px;font-weight:700;color:var(--adult-accent)">🏆 ¡Nuevo récord!</p>':(prevBest?'<p class="mut" style="margin-top:8px">Tu récord: '+prevBest.moves+' movimientos en '+prevBest.seconds+'s</p>':''))
  +'</div>'
  +'<button class="abtn green" onclick="'+MG.back+'">Continuar</button>');}
