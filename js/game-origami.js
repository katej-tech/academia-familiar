"use strict";
/* ============ AVIÓN DE PAPEL: dóblalo paso a paso y luego lánzalo ============ */
/* Idea 3 de la ronda de "reavivar el interés" (Legos/aviones/origami). No es una
   simulación real de origami (la geometría exacta del papel es compleja) — es una
   versión ilustrada y simplificada: cada paso muestra una figura de papel distinta
   con una instrucción corta, y al final se lanza el avión con un mini-juego de
   puntería (barra de potencia) que decide qué tan lejos vuela. */
const PLANE_STEPS=[
 {label:"Empieza con una hoja de papel",
  shape:'<rect x="55" y="14" width="90" height="172" rx="4" fill="#FFFDF5" stroke="#1E2A4A" stroke-width="3"/>'},
 {label:"Dóblala por la mitad y márcala con una línea al centro",
  shape:'<rect x="55" y="14" width="90" height="172" rx="4" fill="#FFFDF5" stroke="#1E2A4A" stroke-width="3"/><line x1="100" y1="18" x2="100" y2="182" stroke="#1E2A4A" stroke-width="2" stroke-dasharray="6 5"/>'},
 {label:"Dobla las esquinas de arriba hacia la línea del centro",
  shape:'<polygon points="100,14 60,74 88,74 88,186 112,186 112,74 140,74" fill="#FFFDF5" stroke="#1E2A4A" stroke-width="3"/>'},
 {label:"Dobla la punta otra vez, más angosta",
  shape:'<polygon points="100,14 78,66 88,66 88,186 112,186 112,66 122,66" fill="#FFFDF5" stroke="#1E2A4A" stroke-width="3"/>'},
 {label:"Dobla las alas hacia los lados — ¡tu avión está listo! ✈️",
  shape:'<polygon points="100,14 78,88 18,152 88,120 88,186 112,186 112,120 182,152 122,88" fill="#FFFDF5" stroke="#1E2A4A" stroke-width="3"/>'}
];
let PA={};
function gamePaperPlane(){setTheme("kid");PA={step:0};renderPA();}
function renderPA(){
 const st=PLANE_STEPS[PA.step];
 const last=PA.step===PLANE_STEPS.length-1;
 render(topbar("screenMyStuff()")
 +'<div class="progressdots">'+dots(PLANE_STEPS.length,PA.step)+'</div>'
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.45rem);text-align:center;margin-bottom:2px">✈️ Avión de papel</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:10px">'+esc(st.label)+'</p>'
 +'<div class="card center" style="padding:10px"><svg viewBox="0 0 200 200" style="width:100%;max-width:280px">'+st.shape+'</svg></div>'
 +(last?'<button class="kbtn green" style="margin-top:12px" onclick="paThrowStart()">🚀 ¡Lánzalo!</button>'
        :'<button class="kbtn blue" style="margin-top:12px" onclick="paNext()">Doblar → siguiente paso</button>')
 +'<button class="kbtn white" style="margin-top:8px" onclick="gamePaperPlane()">🔁 Empezar de nuevo</button>');}
function paNext(){if(PA.step<PLANE_STEPS.length-1){PA.step++;beep([560],.05);renderPA();}}
/* barra de potencia: toca cuando la marca esté en la zona verde para un lanzamiento perfecto */
function paThrowStart(){
 PA.power=0;PA.dir=1;
 if(PA.powerTimer)clearInterval(PA.powerTimer);
 render(topbar("screenMyStuff()")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.45rem);text-align:center;margin-bottom:2px">🚀 ¡Lánzalo!</h2>'
 +'<p class="center" style="font-size:.95rem;margin-bottom:12px">Toca cuando la marca esté en la zona verde</p>'
 +'<div class="pabartrack"><div class="pabarzone"></div><div class="pabarmark" id="paMark"></div></div>'
 +'<button class="kbtn green" style="margin-top:16px" onclick="paLaunch()">✋ ¡Toca aquí!</button>');
 PA.powerTimer=setInterval(function(){
  PA.power+=PA.dir*4;
  if(PA.power>=100){PA.power=100;PA.dir=-1;}
  if(PA.power<=0){PA.power=0;PA.dir=1;}
  const m=document.getElementById("paMark");if(m)m.style.left=PA.power+"%";
 },28);}
function paLaunch(){
 if(PA.powerTimer){clearInterval(PA.powerTimer);PA.powerTimer=null;}
 const power=PA.power||0;
 let dist;
 if(power>=62&&power<=88)dist=65+rnd(36); // zona verde: vuelo largo
 else if(power>=35&&power<=95)dist=30+rnd(31); // cerca: vuelo medio
 else dist=8+rnd(20); // lejos de la zona: vuelo corto
 PA.dist=dist;
 renderPAFlight();}
function renderPAFlight(){
 render(topbar("screenMyStuff()")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.45rem);text-align:center;margin-bottom:10px">✈️ ¡Volando!</h2>'
 +'<div class="parunway"><div class="paticks">'+[0,25,50,75,100].map(function(m){return '<span>'+m+'m</span>';}).join("")+'</div>'
 +'<div class="paplane" id="paPlane">✈️</div></div>'
 +'<p id="paResult" class="center" style="margin-top:14px;font-size:1.1rem;font-weight:700;min-height:1.5em"></p>');
 setTimeout(function(){
  const el=document.getElementById("paPlane");
  const pct=Math.min(96,PA.dist);
  if(el)el.style.left=pct+"%";
 },80);
 setTimeout(paLandResult,1300);}
function paLandResult(){
 const p=prof();
 const best=p.paperPlaneBest||0;
 const isRecord=PA.dist>best;
 if(isRecord){p.paperPlaneBest=PA.dist;save();}
 sOK();confetti(isRecord?26:14);
 const el=document.getElementById("paResult");
 if(el)el.innerHTML="¡Voló <b>"+PA.dist+" metros</b>! "+(isRecord?"🏆 ¡Nuevo récord!":"Tu récord: "+p.paperPlaneBest+"m");
 const stars=PA.dist>=80?3:PA.dist>=45?2:1;
 setTimeout(function(){nodeWin(stars,"Avión de papel");},1600);}
