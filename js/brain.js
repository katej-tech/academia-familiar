"use strict";
/* ============ CEREBRO EN FORMA (memoria y concentración) ============
   Pedido explícito: "actividades para fortalecer memoria y concentración". Tres juegos cortos,
   clásicos en entrenamiento cognitivo infantil, con nivel que sube solo con aciertos seguidos
   (mismo patrón que enNumBump/ckBump — nunca baja de golpe por un solo error):
     🔴 Secuencia   — repite un patrón de colores/sonidos que crece (tipo "Simon")
     🔢 Memoria de números — mira una fila de números y escríbela de memoria
     👀 Encuentra el intruso — un emoji distinto entre muchos iguales, contra el reloj
   Guarda su propio récord y nivel por juego en el perfil (p.brainLv). */

const BRAIN_GAMES=[
 {id:"seq",ic:"🔴",nm:"Secuencia",sub:"Mira, escucha y repite el patrón"},
 {id:"span",ic:"🔢",nm:"Memoria de números",sub:"Míralos y escríbelos de memoria"},
 {id:"odd",ic:"👀",nm:"Encuentra el intruso",sub:"Un emoji distinto, contra el reloj"}];
function brainLv(id){const p=prof();if(!p.brainLv)p.brainLv={};return p.brainLv[id]||1;}
function brainBump(id,ok,max){
 const p=prof();if(!p.brainLv)p.brainLv={};if(!p.brainStreak)p.brainStreak={};
 if(ok){p.brainStreak[id]=(p.brainStreak[id]||0)+1;
  if(p.brainStreak[id]>=3&&(p.brainLv[id]||1)<max){p.brainLv[id]=(p.brainLv[id]||1)+1;p.brainStreak[id]=0;save();return true;}}
 else p.brainStreak[id]=0;
 save();return false;}
function screenBrain(){setTheme("kid");const p=prof();
 const cards=BRAIN_GAMES.map(function(g){const lv=brainLv(g.id),best=(p.brainBest||{})[g.id]||0;
  return '<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="brainStart(\''+g.id+'\')"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+g.ic+'</span><span style="flex:1"><span>'+g.nm+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+g.sub+' · nivel '+lv+(best?" · récord "+best:"")+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🧠 Cerebro en forma</h2>'
  +'<p class="center" style="margin-bottom:12px">Juegos cortos para entrenar tu memoria y tu concentración — el nivel sube solo cuando aciertas varias veces seguidas</p>'
  +cards
  +'<button class="kbtn purple" style="margin-top:6px" onclick="openWorld(\'logica\')">🧩 Lógica y genio (acertijos)</button>');}
function brainStart(id){if(id==="seq")return seqStart();if(id==="span")return spanStart();return oddStart();}
function brainBest(id,score){const p=prof();if(!p.brainBest)p.brainBest={};if(score>(p.brainBest[id]||0)){p.brainBest[id]=score;save();return true;}return false;}

/* ---------- 🔴 SECUENCIA (Simon): repite el patrón que crece ---------- */
const SEQ_PADS=[{c:"#EF4444",f:329.6},{c:"#3B82F6",f:392},{c:"#FACC15",f:440},{c:"#22C55E",f:523.3}];
let SEQ={};
function seqStart(){setTheme("kid");
 SEQ={round:0,total:6,ok:0,len:1+brainLv("seq"),pattern:[],input:[],busy:true};
 seqRender();seqNewRound();}
function seqRender(){
 render(topbar("screenBrain()")
  +'<div class="progressdots">'+dots(SEQ.total,SEQ.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:2px">🔴 Secuencia</h2>'
  +'<p class="center" id="seqMsg" style="font-size:.9rem;margin-bottom:6px;min-height:1.4em">Mira bien… 👀</p>'
  +'<div class="card" style="padding:6px"><div id="seqCanvas" style="width:100%;height:min(88vw,320px)"></div></div>');
 if(typeof render3DPads==="function")render3DPads("seqCanvas",function(i){seqTap(i);});}
function seqNewRound(){
 if(SEQ.round>=SEQ.total)return seqEnd();
 SEQ.pattern.push(rnd(4));SEQ.input=[];SEQ.busy=true;
 const msg=document.getElementById("seqMsg");if(msg)msg.textContent="Mira bien… 👀";
 let i=0;
 (function step(){
  if(i>=SEQ.pattern.length){SEQ.busy=false;
   const m=document.getElementById("seqMsg");if(m)m.textContent="¡Ahora repítelo tú! 👉";
   return;}
  const k=SEQ.pattern[i];
  if(typeof pad3DLight==="function")pad3DLight(k,true);tone(SEQ_PADS[k].f,.3);
  setTimeout(function(){if(typeof pad3DLight==="function")pad3DLight(k,false);i++;setTimeout(step,220);},480);
 })();}
function seqTap(i){
 if(SEQ.busy)return;
 if(typeof pad3DLight==="function")pad3DLight(i,true);tone(SEQ_PADS[i].f,.15);setTimeout(function(){if(typeof pad3DLight==="function")pad3DLight(i,false);},180);
 SEQ.input.push(i);
 const k=SEQ.input.length-1;
 if(SEQ.pattern[k]!==i){
  sNO();recordAnswer("Memoria",false,12);brainBump("seq",false,8);
  const m=document.getElementById("seqMsg");if(m)m.textContent="Casi… ¡era otro color! 💪";
  SEQ.busy=true;return setTimeout(seqRestartRound,1300);}
 if(SEQ.input.length===SEQ.pattern.length){
  sOK();confetti(6);SEQ.ok++;recordAnswer("Memoria",true,12);brainBump("seq",true,8);
  SEQ.round++;SEQ.busy=true;const m=document.getElementById("seqMsg");if(m)m.textContent="¡Bien! Uno más… ➕";
  setTimeout(seqNewRound,1000);}}
function seqRestartRound(){SEQ.round++;SEQ.pattern.pop();seqNewRound();}
function seqEnd(){
 const rec=brainBest("seq",SEQ.pattern.length);const p=prof();p.coins+=2+SEQ.ok;p.xp+=8;save();
 sWIN();confetti(20);nodeWin(starsFor(SEQ.ok,SEQ.total),"Secuencia"+(rec?" 🏆 ¡Nuevo récord!":""));}

/* ---------- 🔢 MEMORIA DE NÚMEROS (digit span) ---------- */
let SPAN={};
function spanStart(){setTheme("kid");SPAN={round:0,total:5,ok:0,len:Math.min(8,2+brainLv("span"))};spanNext();}
function spanNext(){
 if(SPAN.round>=SPAN.total)return spanEnd();
 const n=[];for(let i=0;i<SPAN.len;i++)n.push(rnd(10));
 SPAN.n=n;SPAN.typed="";SPAN.show=true;
 render(topbar("screenBrain()")
  +'<div class="progressdots">'+dots(SPAN.total,SPAN.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:6px">🔢 Memoria de números</h2>'
  +'<p class="center" style="margin-bottom:8px">¡Memorízalos! Se ocultan solos</p>'
  +'<div class="numdisp" id="spanNums" style="font-size:clamp(1.8rem,9vw,2.6rem);letter-spacing:.15em">'+n.join(" ")+'</div>'
  +'<div id="spanPad" style="display:none">'
   +'<p class="center" style="margin:10px 0 6px;font-family:Fredoka;font-weight:700">Escríbelos en el mismo orden</p>'
   +'<div class="numdisp" id="spanTyped">&nbsp;</div>'
   +'<div class="numpad">'+[1,2,3,4,5,6,7,8,9].map(function(d){return '<button class="key" onclick="spanTap(\''+d+'\')">'+d+'</button>';}).join("")
   +'<button class="key" onclick="spanBack()">⌫</button><button class="key" onclick="spanTap(\'0\')">0</button><button class="key okk" onclick="spanCheck()">✓</button></div></div>');
 setTimeout(function(){
  SPAN.show=false;const nd=document.getElementById("spanNums");if(nd)nd.innerHTML="❓ ".repeat(n.length);
  const pad=document.getElementById("spanPad");if(pad)pad.style.display="block";
 },900+SPAN.len*700);}
function spanTap(d){if(SPAN.show||SPAN.typed.length>=SPAN.len)return;SPAN.typed+=d;beep([560],.04);const t=document.getElementById("spanTyped");if(t)t.textContent=SPAN.typed.split("").join(" ");}
function spanBack(){SPAN.typed=SPAN.typed.slice(0,-1);const t=document.getElementById("spanTyped");if(t)t.textContent=SPAN.typed.split("").join(" ")||" ";}
function spanCheck(){
 if(!SPAN.typed)return;
 const ok=SPAN.typed===SPAN.n.join("");recordAnswer("Memoria",ok,15);const lvUp=brainBump("span",ok,8);
 const nd=document.getElementById("spanNums");if(nd)nd.textContent=SPAN.n.join(" ");
 if(ok){sOK();confetti(10);SPAN.ok++;toast("¡Perfecto! 🎉"+(lvUp?" Subiste de nivel 📈":""),true,1400);}
 else sNO();
 if(!ok)toast("Eran: "+SPAN.n.join(" · "),false,2200);
 SPAN.round++;setTimeout(spanNext,ok?1400:2600);}
function spanEnd(){const p=prof();const rec=brainBest("span",SPAN.len);p.coins+=2+SPAN.ok;p.xp+=8;save();sWIN();confetti(20);nodeWin(starsFor(SPAN.ok,SPAN.total),"Memoria de números"+(rec?" 🏆 ¡Nuevo récord!":""));}

/* ---------- 👀 ENCUENTRA EL INTRUSO (atención y velocidad) ---------- */
const ODD_SETS=[["🍎","🍒"],["🐶","🐱"],["⭐","🌟"],["🔵","🟢"],["🍌","🌙"],["❤️","💙"],["🐟","🦈"],["🌸","🌼"],["🍩","🍪"],["🚗","🚕"]];
let ODD={};
function oddStart(){setTheme("kid");ODD={round:0,total:6,ok:0,n:Math.min(24,4+brainLv("odd")*3)};oddNext();}
function oddNext(){
 if(ODD.round>=ODD.total)return oddEnd();
 const pair=pick(ODD_SETS),n=ODD.n,oddIdx=rnd(n);
 ODD.oddIdx=oddIdx;ODD.answered=false;ODD.t0=Date.now();
 const cells=[];for(let i=0;i<n;i++)cells.push('<button onclick="oddTap('+i+','+(i===oddIdx)+')" style="aspect-ratio:1;border-radius:12px;border:3px solid var(--kid-ink);background:#fff;font-size:clamp(1.4rem,7vw,2rem)">'+(i===oddIdx?pair[1]:pair[0])+'</button>');
 const cols=n<=9?3:n<=16?4:5;
 render(topbar("screenBrain()")
  +'<div class="progressdots">'+dots(ODD.total,ODD.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:6px">👀 ¡Encuentra el que es diferente!</h2>'
  +'<div style="display:grid;grid-template-columns:repeat('+cols+',1fr);gap:8px;max-width:380px;margin:0 auto">'+cells.join("")+'</div>');}
function oddTap(i,isOdd){
 if(ODD.answered)return;ODD.answered=true;
 const ms=Date.now()-ODD.t0,ok=isOdd;
 recordAnswer("Atención",ok,10);
 if(ok){sOK();confetti(6);ODD.ok++;if(ms<2500)brainBump("odd",true,7);}
 else{sNO();brainBump("odd",false,7);}
 ODD.round++;setTimeout(oddNext,ok?450:1100);}
function oddEnd(){const p=prof();p.coins+=2+ODD.ok;p.xp+=8;save();sWIN();confetti(20);nodeWin(starsFor(ODD.ok,ODD.total),"Encuentra el intruso");}
