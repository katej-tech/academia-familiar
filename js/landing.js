"use strict";
/* ============ ATERRIZA EN UN PLANETA (pantallas y contenido) ============
   Pedido: el modo "aterriza en un planeta" (sentirse en el sitio, tipo enciclopedia multimedia).
   Seis lugares con superficie sólida (Luna, Marte, Mercurio, Venus, Tierra y Titán, la luna de Saturno).
   Los gigantes de gas no tienen suelo: se explican, no se pisan. En cada lugar: caminar, saltar con la
   gravedad real, recoger 5 muestras (cada una cuenta un dato) y 2 preguntas al final.
   Motor 3D: js/landing3d.js. Prefijo land / LAND. */

const LAND_KG=30; /* peso de referencia del explorador */
const LAND_PLACES=[
 {id:"luna",nm:"La Luna",ic:"🌙",g:1.62,temp:"−20 °C de media (de −170 a +120)",air:"Sin aire: no hay viento ni sonido",
  cfg:{g:1.62,sky:"#02030A",ground:["#B6BBC4","#7B8190"],amp:.8,craters:16,rocks:40,stars:true,sunSize:3.2,sunColor:"#FFF7D6",body:"earth",seed:21},
  facts:["La Luna tiene mucha menos gravedad que la Tierra, por eso los astronautas daban saltos largos y lentos.","Aquí no hay aire: el cielo es negro incluso de día y no se escucha nada.","Las huellas que dejaron los astronautas siguen aquí, porque no hay viento que las borre.","Los cráteres son huecos que hicieron rocas del espacio al chocar hace millones de años.","Mira la Tierra en el cielo: se ve como una canica azul y blanca."],
  quiz:[{q:"¿Por qué saltas tan alto en la Luna?",ops:["Porque hay menos gravedad","Porque hay más aire","Porque es de noche"],a:0},{q:"¿De qué color es el cielo de la Luna?",ops:["Negro","Azul","Naranja"],a:0}]},
 {id:"marte",nm:"Marte",ic:"🔴",g:3.71,temp:"−60 °C de media",air:"Aire muy fino (dióxido de carbono)",
  cfg:{g:3.71,sky:"#D9A066",fog:"#D9A066",fogD:.011,ground:["#B45309","#7C2D12"],amp:1.2,craters:7,rocks:55,sunSize:1.9,sunColor:"#FFF1CC",seed:33},
  facts:["Marte es rojo porque su suelo tiene óxido de hierro, como el hierro oxidado.","Aquí vive el volcán más grande del sistema solar: el Monte Olimpo.","La gravedad es poco más de un tercio de la de la Tierra: ¡saltas tres veces más alto!","El cielo es color caramelo por el polvo que flota en el aire.","Marte tiene dos lunas pequeñas llamadas Fobos y Deimos."],
  quiz:[{q:"¿Por qué Marte se ve rojo?",ops:["Por el óxido de hierro del suelo","Porque está en llamas","Porque tiene mucha agua"],a:0},{q:"¿Cómo se llama el volcán más grande?",ops:["Monte Olimpo","Monte Everest","Monte Fuji"],a:0}]},
 {id:"mercurio",nm:"Mercurio",ic:"⚫",g:3.70,temp:"de −180 °C de noche a +430 °C de día",air:"Casi sin aire",
  cfg:{g:3.70,sky:"#04050C",ground:["#8A817C","#57534E"],amp:.7,craters:22,rocks:35,stars:true,sunSize:5.5,sunColor:"#FFF7D6",sunHalo:true,seed:44},
  facts:["Mercurio es el planeta más cercano al Sol: aquí el Sol se ve mucho más grande.","Un año en Mercurio dura solo 88 días terrestres.","Casi no tiene aire, así que de día hace muchísimo calor y de noche muchísimo frío.","Su superficie está llena de cráteres, parecido a la Luna.","Aunque es pequeño, es muy pesado por dentro porque tiene un gran núcleo de hierro."],
  quiz:[{q:"¿Qué planeta está más cerca del Sol?",ops:["Mercurio","Marte","Neptuno"],a:0},{q:"¿Cuánto dura un año en Mercurio?",ops:["88 días terrestres","365 días","Un día"],a:0}]},
 {id:"venus",nm:"Venus",ic:"🟡",g:8.87,temp:"465 °C: ¡el más caliente!",air:"Aire muy espeso y venenoso",
  cfg:{g:8.87,sky:"#E8B24A",fog:"#E8B24A",fogD:.028,ground:["#9A3412","#6B2A0E"],amp:1.4,craters:3,rocks:30,sunSize:0,seed:55},
  facts:["Venus es el planeta más caliente, ¡más que Mercurio!, porque su aire atrapa el calor.","Su aire es 90 veces más pesado que el nuestro: caminar sería como estar bajo el mar.","Desde el suelo casi no se ve el Sol: unas nubes espesas lo tapan siempre.","Venus gira al revés que casi todos los planetas.","Un día en Venus dura más que un año en Venus."],
  quiz:[{q:"¿Cuál es el planeta más caliente?",ops:["Venus","Mercurio","Marte"],a:0},{q:"¿Por qué hace tanto calor en Venus?",ops:["Su aire espeso atrapa el calor","Está pegado al Sol","Tiene volcanes de hielo"],a:0}]},
 {id:"tierra",nm:"La Tierra",ic:"🌍",g:9.81,temp:"15 °C de media",air:"Aire con oxígeno para respirar",
  cfg:{g:9.81,sky:"#8EC5FF",fog:"#CFE8FF",fogD:.006,ground:["#4ADE80","#16A34A"],amp:.9,rocks:16,trees:26,sunSize:3,sunColor:"#FFF3B0",sunHalo:true,seed:66},
  facts:["La Tierra es el único lugar donde sabemos que hay vida.","Más de dos terceras partes de la superficie son agua.","El aire nos da oxígeno y nos protege de los rayos peligrosos del Sol.","Tu salto aquí es el de siempre: unos 50 centímetros.","La Luna hace que suba y baje el mar: son las mareas."],
  quiz:[{q:"¿Qué tiene la Tierra que ayuda a la vida?",ops:["Agua líquida y aire con oxígeno","Cráteres","Cielo negro"],a:0},{q:"¿Qué cubre la mayor parte de la Tierra?",ops:["Agua","Hielo","Arena"],a:0}]},
 {id:"titan",nm:"Titán (luna de Saturno)",ic:"🪐",g:1.35,temp:"−179 °C",air:"Aire espeso de nitrógeno",
  cfg:{g:1.35,sky:"#C98A3C",fog:"#C98A3C",fogD:.016,ground:["#A16207","#6B4A12"],amp:1.1,craters:2,rocks:35,sunSize:.9,sunColor:"#FFE8B0",body:"saturn",seed:77},
  facts:["Titán es la luna más grande de Saturno y tiene una atmósfera espesa y naranja.","Aquí llueve metano y hay lagos de metano líquido, ¡no de agua!","Con tan poca gravedad y tanto aire, un humano con alas podría volar pedaleando.","Mira el cielo: Saturno y sus anillos se verían enormes.","Hace tanto frío que el agua es dura como una roca."],
  quiz:[{q:"¿De qué planeta es luna Titán?",ops:["Saturno","Júpiter","Marte"],a:0},{q:"¿Qué líquido forma los lagos de Titán?",ops:["Metano","Agua","Jugo"],a:0}]}];
const LAND_GAS=[["Júpiter","🟤","24,8"],["Saturno","🪐","10,4"],["Urano","🔵","8,7"],["Neptuno","🔷","11,1"]];
const LAND_WIN={noWorld:true,replay:"screenLanding()",replayLabel:"Otro lugar 🛬",backFn:"screenSpace()",backLabel:"Centro espacial 🪐"};
let LAND={timers:[]};

function landCleanup(){if(LAND.timers)LAND.timers.forEach(clearTimeout);LAND={timers:[]};}
function landLater(fn,ms){const k=LAND.id,t=setTimeout(function(){if(LAND.id===k)fn();},ms);LAND.timers.push(t);return t;}
function landFmt(n,d){return String(Number(n).toFixed(d==null?1:d)).replace(".",",");}

/* ---------- elegir lugar ---------- */
function screenLanding(){setTheme("kid");
 landCleanup();
 const done=(prof().landDone||{});
 render(topbar("screenSpace()")+subHeader("🛬 Aterriza en un planeta")
  +'<p class="center" style="margin:-4px 0 10px">Camina, salta y recoge muestras. ¡La gravedad es la de verdad!</p>'
  +LAND_PLACES.map(function(p){const st=done[p.id]||0;return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="landStart(\''+p.id+'\')"><span style="font-size:2.2rem">'+p.ic+'</span><span style="flex:1"><span>'+p.nm+'</span><br><span style="font-size:.78rem;opacity:.8;font-weight:500">Gravedad: '+landFmt(p.g/9.81,2)+' de la Tierra · saltas '+landFmt(.5*9.81/p.g,1)+' m</span></span><span>'+(st?"⭐".repeat(st):"")+'</span></button>';}).join("")
  +'<div class="card" style="margin-top:12px"><b>⚠️ ¿Y Júpiter, Saturno, Urano y Neptuno?</b><p style="margin:6px 0 0;font-size:.92rem;line-height:1.45">Son <b>gigantes de gas</b>: no tienen suelo donde aterrizar. Si lo intentaras, ¡te hundirías cada vez más en las nubes!</p><div style="margin-top:6px">'+LAND_GAS.map(function(g){return '<span style="display:inline-block;background:#EEF2FF;border-radius:12px;padding:3px 9px;margin:2px;font-size:.82rem;font-weight:700">'+g[1]+' '+g[0]+' · g='+g[2]+'</span>';}).join("")+'</div></div>');}

/* ---------- el aterrizaje ---------- */
function landStart(id){setTheme("kid");
 const p=LAND_PLACES.find(function(x){return x.id===id;});if(!p)return;
 render(topbar("screenLanding()")
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin:0 0 4px">'+p.ic+' '+p.nm+'</h2>'
  +'<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:6px">'
   +'<span class="chip" style="background:#EEF2FF;border-radius:12px;padding:3px 9px;font-size:.78rem;font-weight:700">🌡️ '+p.temp+'</span>'
   +'<span style="background:#EEF2FF;border-radius:12px;padding:3px 9px;font-size:.78rem;font-weight:700">💨 '+p.air+'</span>'
   +'<span style="background:#EEF2FF;border-radius:12px;padding:3px 9px;font-size:.78rem;font-weight:700">⚖️ Pesarías '+landFmt(LAND_KG*p.g/9.81,1)+' kg (en la Tierra, '+LAND_KG+')</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px;position:relative"><div id="landCanvas" style="width:100%;height:clamp(300px,52vh,420px)"></div><div id="landHud" style="position:absolute;left:8px;top:8px;background:rgba(15,23,42,.65);color:#fff;border-radius:12px;padding:4px 10px;font-weight:800;font-size:.9rem">💎 0 / 5</div></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px"><button class="kbtn green" style="margin:0;min-height:56px" onclick="landJump()">🦘 ¡Salta!</button><div class="card" id="landJumpInfo" style="margin:0;padding:6px 10px;font-size:.82rem;display:flex;align-items:center">👆 Toca el suelo para caminar. Busca los 💎</div></div>'
  +'<div id="landFb"></div><div id="landBody"></div>');
 landCleanup();LAND={id:id,place:p,timers:[],got:0,ok:0,best:0};
 LAND.c3=renderLanding("landCanvas",p.cfg,landEvent);}
function landJump(){if(LAND.c3)LAND.c3.jump();}
function landEvent(ev,info){
 const p=LAND.place;if(!p)return;
 if(ev==="jump"){
  const e=document.getElementById("landJumpInfo");
  LAND.best=Math.max(LAND.best||0,info.h);
  if(e)e.innerHTML='🦘 Saltaste <b>&nbsp;'+landFmt(info.h,1)+' m&nbsp;</b> y estuviste <b>&nbsp;'+landFmt(info.t,1)+' s&nbsp;</b> en el aire. En la Tierra: 0,5 m.';}
 else if(ev==="sample"){
  LAND.got=info.n;sOK();confetti(6);
  const h=document.getElementById("landHud");if(h)h.textContent="💎 "+info.n+" / 5";
  const f=p.facts[info.n-1];
  const fb=document.getElementById("landFb");if(fb)fb.innerHTML='<div class="card" style="background:#ECFEFF;border:2px solid #22D3EE;margin-top:8px"><b>💎 Muestra '+info.n+':</b> '+esc(f)+'</div>';
  speakES(f);
  if(info.n>=5){if(LAND.c3)LAND.c3.lock(true);landLater(landQuizStart,Math.min(9000,f.length*85+1500));}}}

/* ---------- preguntas finales ---------- */
function landQuizStart(){LAND.qi=0;LAND.ok=0;landQuizRound();}
function landQuizRound(){
 const p=LAND.place,q=p.quiz[LAND.qi];
 if(!q)return landFinish();
 LAND.ops=shuffled(q.ops.map(function(o,i){return{t:o,ok:i===q.a};}));LAND.qa=false;LAND.tried=false;
 const b=document.getElementById("landBody");
 b.innerHTML='<div class="card" style="margin-top:10px"><b>🧩 Pregunta '+(LAND.qi+1)+' / '+p.quiz.length+'</b><p style="margin:6px 0 0;font-weight:700">'+esc(q.q)+'</p></div>'
  +LAND.ops.map(function(o,i){return '<button class="kbtn white" id="landQ'+i+'" style="min-height:52px" onclick="landQuizAns('+i+')">'+esc(o.t)+'</button>';}).join("");
 b.scrollIntoView({block:"nearest",behavior:"smooth"});speakES(q.q);}
function landQuizAns(i){
 if(LAND.qa)return;const o=LAND.ops[i],btn=document.getElementById("landQ"+i);
 if(o.ok){LAND.qa=true;if(!LAND.tried)LAND.ok++;recordAnswer("Espacio",!LAND.tried,12);sOK();confetti(6);if(btn)btn.style.background="#86EFAC";LAND.qi++;landLater(landQuizRound,1400);}
 else{LAND.tried=true;sNO();if(btn){btn.style.background="#FCA5A5";btn.disabled=true;}}}
function landFinish(){
 const p=LAND.place,stars=Math.max(2,starsFor(LAND.ok,p.quiz.length)); /* llegar hasta aquí ya vale 2 estrellas */
 const d=prof();if(!d.landDone)d.landDone={};d.landDone[p.id]=Math.max(d.landDone[p.id]||0,stars);save();
 if(typeof disposeLanding3D==="function")disposeLanding3D();
 nodeWin(stars,"Espacio",LAND_WIN);}
