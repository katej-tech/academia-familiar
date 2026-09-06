"use strict";
/* ============ CONTAR MONEDAS: arrastrar monedas hasta un monto exacto ============ */
/* Inspirado en Matific (video que compartió Katerine): arrastrar monedas a un "mostrador"
   hasta completar un monto exacto. Denominaciones genéricas con símbolo "$" — no es una
   moneda real específica, fácil de cambiar después si hace falta.
   Arrastre con eventos de puntero (mismo patrón que ya usa board.js para dibujar en la
   pizarra): un "fantasma" sigue al dedo/mouse y al soltar se revisa si cayó dentro del
   rectángulo del mostrador — no existía ningún mecanismo de arrastrar-y-soltar antes en
   la app, así que esto es nuevo. */
const MONEY_DIFF={
 facil:{coins:[1,5,10],min:1,max:20,rounds:5},
 medio:{coins:[1,5,10,20],min:10,max:50,rounds:6},
 dificil:{coins:[1,5,10,20,50],min:20,max:100,rounds:6}
};
function coinColor(v){
 if(v>=50)return"#F59E0B";if(v>=20)return"#A78BFA";if(v>=10)return"#3B82F6";if(v>=5)return"#3EC97C";return"#FF6B6B";}
function screenMoneyDiff(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 render(topbar("screenGamesPick()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🪙 Contar monedas</h2>'
 +'<p class="center" style="margin-bottom:14px">Arrastra las monedas para pagar el monto exacto</p>'
 +'<button class="kbtn green" onclick="gameMoney(\'facil\')">🟢 Fácil</button>'
 +'<button class="kbtn yellow" onclick="gameMoney(\'medio\')">🟡 Medio</button>'
 +'<button class="kbtn red" onclick="gameMoney(\'dificil\')">🔴 Difícil</button>');}
let GM={};
function gameMoney(diff){setTheme("kid");GM={diff:diff,round:0,ok:0,total:MONEY_DIFF[diff].rounds};nextGM();}
function moneySupply(diff,target){
 /* arma una oferta que SIEMPRE alcanza para formar el monto exacto (algoritmo codicioso con
    las denominaciones del nivel), más 3 monedas de más como distractor. */
 const cfg=MONEY_DIFF[diff];
 const denoms=cfg.coins.slice().sort(function(a,b){return b-a;});
 let rem=target;const need=[];
 denoms.forEach(function(d){while(rem>=d){need.push(d);rem-=d;}});
 const extra=[];for(let i=0;i<3;i++)extra.push(pick(cfg.coins));
 return shuffled(need.concat(extra)).map(function(v,i){return{v:v,id:i,placed:false};});}
function nextGM(){
 if(GM.round>=GM.total)return endGM();
 const cfg=MONEY_DIFF[GM.diff];
 GM.target=cfg.min+rnd(cfg.max-cfg.min+1);
 GM.supply=moneySupply(GM.diff,GM.target);
 GM.paid=0;
 renderGM();}
function renderGM(){
 const supplyHTML=GM.supply.filter(function(c){return!c.placed;})
  .map(function(c){return '<div class="gmcoin" id="gc'+c.id+'" data-v="'+c.v+'" style="background:'+coinColor(c.v)+'">$'+c.v+'</div>';}).join("");
 const trayHTML=GM.supply.filter(function(c){return c.placed;})
  .map(function(c){return '<div class="gmcoin placed" style="background:'+coinColor(c.v)+'" onclick="returnCoin('+c.id+')">$'+c.v+'</div>';}).join("");
 render(topbar("screenGamesPick()")
 +'<div class="progressdots">'+dots(GM.total,GM.round)+'</div>'
 +'<h2 style="text-align:center;margin-bottom:4px">🪙 Paga $'+GM.target+'</h2>'
 +'<p class="center" style="margin-bottom:8px">Arrastra las monedas al mostrador — toca una del mostrador para regresarla</p>'
 +'<div id="gmCounter" class="gmcounter">🧾 Mostrador: <b>$'+GM.paid+'</b><div class="gmgrid">'+(trayHTML||'<span class="mut" style="font-size:.85rem">(vacío)</span>')+'</div></div>'
 +'<div class="gmgrid" id="gmSupply">'+supplyHTML+'</div>'
 +'<button class="kbtn green" onclick="confirmGM()">✅ Confirmar pago</button>'
 +'<p id="gmMsg" class="center" style="margin-top:8px;font-weight:700;min-height:1.4em"></p>');
 setupCoinDrag();}
function setupCoinDrag(){
 document.querySelectorAll("#gmSupply .gmcoin").forEach(function(el){
  el.addEventListener("pointerdown",function(e){
   e.preventDefault();
   const startX=e.clientX,startY=e.clientY;
   const rect=el.getBoundingClientRect();
   const ghost=document.createElement("div");
   ghost.className="gmcoin gmghost";
   ghost.style.background=el.style.background;
   ghost.textContent=el.textContent;
   ghost.style.left=rect.left+"px";ghost.style.top=rect.top+"px";
   ghost.style.width=rect.width+"px";ghost.style.height=rect.height+"px";
   document.body.appendChild(ghost);
   el.style.visibility="hidden";
   try{el.setPointerCapture(e.pointerId);}catch(err){}
   function onMove(ev){
    ghost.style.left=(rect.left+(ev.clientX-startX))+"px";
    ghost.style.top=(rect.top+(ev.clientY-startY))+"px";}
   function onUp(ev){
    el.removeEventListener("pointermove",onMove);
    el.removeEventListener("pointerup",onUp);
    const counter=document.getElementById("gmCounter");
    const dr=counter.getBoundingClientRect();
    ghost.remove();
    if(ev.clientX>=dr.left&&ev.clientX<=dr.right&&ev.clientY>=dr.top&&ev.clientY<=dr.bottom){
     placeCoin(parseInt(el.id.replace("gc",""),10));
    }else{el.style.visibility="visible";}}
   el.addEventListener("pointermove",onMove);
   el.addEventListener("pointerup",onUp);
  });});}
function placeCoin(id){
 const c=GM.supply.find(function(x){return x.id===id;});
 if(!c||c.placed)return;
 c.placed=true;GM.paid+=c.v;beep([520],.06);renderGM();}
function returnCoin(id){
 const c=GM.supply.find(function(x){return x.id===id;});
 if(!c||!c.placed)return;
 c.placed=false;GM.paid-=c.v;beep([420],.06);renderGM();}
function confirmGM(){
 const msg=document.getElementById("gmMsg");if(!msg)return;
 if(GM.paid===GM.target){
  sOK();confetti(10);GM.ok++;GM.round++;
  msg.style.color="#16A34A";msg.textContent="¡Exacto! 🎉";
  setTimeout(nextGM,900);
 }else if(GM.paid<GM.target){
  sNO();msg.style.color="#DC2626";msg.textContent="Te falta $"+(GM.target-GM.paid);
 }else{
  sNO();msg.style.color="#DC2626";msg.textContent="Te pasaste por $"+(GM.paid-GM.target);
 }}
function endGM(){const st=starsFor(GM.ok,GM.total);setTimeout(function(){nodeWin(st,"Dinero");},200);}
