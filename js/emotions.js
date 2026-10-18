"use strict";
/* ============ PLANETA DE LAS EMOCIONES (mundo interactivo) ============
   Pedido: actividades, con un planeta en un mundo interactivo, que ayuden al niño a ENTENDER lo que le
   pasa y a manejar la frustración y la ira (ej.: llega la ruta del colegio, no lo dejan seguir jugando y
   dice «la ruta no sirve, los odio»). Un planeta-personaje (el que él armó o uno de los 8) vive situaciones
   reales; su cara y su "clima" (tormenta, lluvia, sol) cambian con lo que el niño decide.
   Cada situación sigue el esquema de la regulación emocional infantil (enfoque cognitivo-conductual,
   adaptado a juego):  1 mira qué pasó · 2 ¿qué siente? · 3 señales del cuerpo · 4 pensamiento «caliente»
   → pensamiento que ayuda · 5 ¿qué hace? (puede probar todas y ver las consecuencias) · 6 practica la
   frase · 7 plan para la próxima vez.
   NO es terapia ni diagnóstico: es un apoyo que se usa con un adulto al lado. Prefijo emw / EMW. */

const EMW_FEELS={
 enojo:{e:"😠",nm:"Enojado"},tristeza:{e:"😢",nm:"Triste"},alegria:{e:"😊",nm:"Contento"},miedo:{e:"😨",nm:"Asustado"},sueno:{e:"😴",nm:"Con sueño"}};
const EMW_BODY=[["Su corazón late muy rápido",1],["Siente calor en la cara",1],["Aprieta los puños y los dientes",1],["Le dan ganas de dormir",0],["Le dan ganas de reírse",0],["Siente que va a explotar",1]];
/* acciones: t texto · e emoji · q 2 = la mejor, 1 = sirve, 0 = no ayuda · out = qué pasa (consecuencia) */
const EMW_SC=[
 {id:"ruta",ic:"🚌",nm:"La ruta llegó",place:"Colegio",
  setup:"{p} está jugando con sus amigos en el patio. De pronto llega la ruta y la profe dice: «Ya es hora de irnos». ¡{p} quería seguir jugando!",
  feel:"enojo",hot:"«¡La ruta no sirve! ¡Los odio a todos!»",
  help:["Estoy muy enojado porque quería seguir jugando. Mañana puedo jugar otra vez.","No me importa nada de nada.","Nunca me dejan hacer lo que quiero."],
  acts:[{e:"🦶",t:"Patear la mochila",q:0,out:"¡Ay! Se lastimó el pie y los amigos se asustaron. La ruta igual se tiene que ir."},
   {e:"🌬️",t:"Respirar, apretar los puños y caminar a la ruta",q:1,out:"El cuerpo de {p} se calmó. Subió a la ruta tranquilo y pudo despedirse."},
   {e:"🗣️",t:"Decir: «Estoy enojado, ¿mañana puedo jugar más rato?»",q:2,out:"La profe lo escuchó y lo abrazó. ¡Dijo lo que sentía sin hacerle daño a nadie!"},
   {e:"📢",t:"Gritar que odia a todos",q:0,out:"Los amigos se pusieron tristes y se alejaron. Gritar hace que el enojo dure más."},
   {e:"🙅",t:"Quedarse sin subir",q:0,out:"No se puede: la ruta lleva a casa y los adultos se preocuparían mucho."}],
  phrase:"Estoy enojado porque quería seguir jugando. Mañana quiero jugar otra vez."},
 {id:"tiempo",ic:"⏰",nm:"Se acabó el tiempo de jugar",place:"Casa",
  setup:"{p} está en lo mejor de su juego favorito y mamá dice: «Se acabó el tiempo». ¡Le faltaba muy poquito para pasar de nivel!",
  feel:"enojo",hot:"«¡Siempre me quitan todo! ¡Es injusto!»",
  help:["Me da rabia parar. Puedo guardar mi juego y seguir mañana.","No quiero hacer nada nunca más.","Mamá no me quiere."],
  acts:[{e:"💥",t:"Tirar el aparato",q:0,out:"Se rompió y ahora no hay juego mañana. La rabia salió, pero hubo un problema más grande."},
   {e:"✋",t:"Respirar y guardar el juego",q:1,out:"{p} guardó su avance y se sintió orgulloso de poder parar."},
   {e:"🗣️",t:"Pedir: «¿Puedo guardar mi nivel?»",q:2,out:"Mamá dijo que sí, un minuto para guardar. Con calma y palabras se consigue más."},
   {e:"😭",t:"Gritar y llorar en el piso",q:0,out:"Se cansó mucho y mamá no pudo entender qué necesitaba."}],
  phrase:"Me da rabia parar. ¿Puedo guardar mi juego para seguir mañana?"},
 {id:"dibujo",ic:"🎨",nm:"No me sale el dibujo",place:"Casa",
  setup:"{p} quiere dibujar un cohete perfecto, pero las líneas salen torcidas. Lo intenta otra vez y sale peor.",
  feel:"enojo",hot:"«¡Soy malo! ¡Esto no sirve!»",
  help:["Todavía no me sale. Si practico, cada vez saldrá mejor.","Nunca voy a aprender.","Mejor no lo intento más."],
  acts:[{e:"📄",t:"Romper la hoja",q:0,out:"Ahora no queda nada del dibujo y {p} se siente peor."},
   {e:"💧",t:"Tomar agua y volver a intentarlo después",q:1,out:"Con la mente más tranquila, el siguiente cohete salió un poquito mejor."},
   {e:"🙋",t:"Pedir ayuda: «¿Me muestras cómo?»",q:2,out:"Aprendió un truco nuevo. ¡Pedir ayuda es de valientes!"},
   {e:"🖍️",t:"Tirar los colores",q:0,out:"Los colores se rompieron y {p} tuvo que recogerlos con la rabia todavía encima."}],
  phrase:"Todavía no me sale. ¿Me ayudas a practicar?"},
 {id:"perdi",ic:"🏆",nm:"Perdí el juego",place:"Colegio",
  setup:"{p} estaba ganando… pero al final su amigo ganó la partida. ¡{p} sentía que ya casi lo lograba!",
  feel:"enojo",hot:"«¡Es trampa! ¡No juego más!»",
  help:["Perdí esta vez. Puedo felicitar y jugar otra vez.","Todos son malos conmigo.","Ya no quiero ser su amigo."],
  acts:[{e:"🗯️",t:"Gritar «¡trampa!»",q:0,out:"Su amigo se puso triste y ya no quiso jugar más."},
   {e:"🤝",t:"Decir «buen juego» y pedir la revancha",q:2,out:"¡Jugaron otra vez y se divirtieron los dos! Saber perder es de campeones."},
   {e:"🌬️",t:"Respirar hondo y contar hasta 10",q:1,out:"El enojo bajó y pudo seguir con sus amigos."},
   {e:"🎲",t:"Tirar las fichas",q:0,out:"Las fichas se perdieron y nadie pudo jugar."}],
  phrase:"Perdí esta vez. Buen juego. ¿Jugamos otra vez?"},
 {id:"no",ic:"🚫",nm:"Me dijeron que no",place:"Colegio",
  setup:"{p} quiere jugar con un grupo de amigos, pero le dicen: «Hoy no, estamos jugando otra cosa». {p} se queda solo en el patio.",
  feel:"tristeza",hot:"«¡Nadie me quiere! ¡Los odio!»",
  help:["Hoy no quisieron jugar conmigo. Puedo buscar a otro amigo.","Soy un niño malo.","Nunca voy a tener amigos."],
  acts:[{e:"👊",t:"Empujar a un amigo",q:0,out:"Lo lastimó y ahora sí nadie quiere jugar con {p}."},
   {e:"🗣️",t:"Decir cómo se siente: «Me puse triste, ¿puedo jugar mañana?»",q:2,out:"Sus amigos entendieron y le dijeron que mañana sí."},
   {e:"🧩",t:"Buscar otro juego u otro amigo",q:1,out:"Encontró a otro niño y jugaron juntos. ¡Hizo un nuevo amigo!"},
   {e:"🤬",t:"Insultar",q:0,out:"Las palabras duras lastiman. Ahora todos están enojados."}],
  phrase:"Me puse triste porque no me dejaron jugar. ¿Podemos jugar mañana?"},
 {id:"turno",ic:"⏳",nm:"Tengo que esperar mi turno",place:"Colegio",
  setup:"{p} quiere el columpio, pero hay una fila y le toca esperar. ¡Esperar se le hace eterno!",
  feel:"enojo",hot:"«¡Es injusto! ¡Yo quiero ya!»",
  help:["Esperar es difícil, pero ya viene mi turno.","Nunca me toca a mí.","Mejor me voy y no juego."],
  acts:[{e:"✋",t:"Quitarle el columpio a otro",q:0,out:"Se armó un problema y la profe lo sacó de la fila."},
   {e:"🔢",t:"Contar hasta 10 y respirar mientras espera",q:1,out:"El tiempo pasó rápido y llegó su turno."},
   {e:"🗣️",t:"Preguntar: «¿Cuántos faltan para mi turno?»",q:2,out:"Supo que faltaban dos y pudo esperar tranquilo."},
   {e:"👊",t:"Pegarle al que está adelante",q:0,out:"Lastimó a su compañero y perdió su turno."}],
  phrase:"Es difícil esperar. ¿Cuántos faltan para mi turno?"},
 {id:"torre",ic:"🧱",nm:"Mi torre se cayó",place:"Casa",
  setup:"{p} construyó una torre altísima con bloques. Estaba por poner el último… ¡y se cayó todo!",
  feel:"enojo",hot:"«¡Nunca puedo terminar nada!»",
  help:["Se cayó, pero puedo construir otra más fuerte.","Soy muy torpe.","Todo me sale mal."],
  acts:[{e:"🦶",t:"Patear los bloques",q:0,out:"Los bloques volaron, uno golpeó una lámpara y {p} se asustó."},
   {e:"🌬️",t:"Respirar y empezar otra torre",q:2,out:"La segunda torre quedó más firme porque aprendió del error."},
   {e:"🙋",t:"Pedir ayuda a alguien",q:1,out:"Entre los dos la terminaron más rápido."},
   {e:"🧱",t:"Tirar los bloques lejos",q:0,out:"Ahora hay que recoger todo con el enojo encima."}],
  phrase:"Se cayó mi torre y me da rabia. Voy a respirar y a intentarlo de nuevo."}];
const EMW_WIN={noWorld:true,replay:"screenEmotions()",replayLabel:"Otra situación 🪐",backFn:"screenCalm()",backLabel:"Mi rincón de calma 💙"};
let EMW={timers:[]};

function emwCleanup(){if(EMW.timers)EMW.timers.forEach(clearTimeout);EMW={timers:[]};try{window.speechSynthesis.cancel();}catch(e){}}
function emwLater(fn,ms){const k=EMW.id,t=setTimeout(function(){if(EMW.id===k)fn();},ms);EMW.timers.push(t);return t;}
function emwFill(t){return String(t).replace(/\{p\}/g,EMW.pname||"Tu planeta");}
function emwPlanets(){
 const my=(prof().myPlanets||[]).map(function(x){return{nm:x.nm,cfg:x.cfg};});
 const pre=["tierra","marte","jupiter","saturno","neptuno"].map(function(k){return{nm:window.PLANET_PRESETS[k].nm,cfg:window.PLANET_PRESETS[k]};});
 return my.concat(pre);}
function emwChosen(){const l=emwPlanets(),i=Math.min(prof().emwPlanet||0,l.length-1);return l[i];}
function emwProg(){const p=prof();if(!p.emwDone)p.emwDone={};return p.emwDone;}
function emwFb(h,cls){const f=document.getElementById("emwFb");if(f)f.innerHTML=h?'<div class="card" style="margin-top:8px;'+(cls==="ok"?"background:#DCFCE7;border:2px solid #22C55E":cls==="no"?"background:#FEE2E2;border:2px solid #F87171":"background:#EFF6FF")+';line-height:1.5">'+h+'</div>':"";}
function emwBody(h){const b=document.getElementById("emwBody");if(b)b.innerHTML=h;}
function emwFace(kind){if(EMW.c3&&EMW.base){EMW.c3.update(Object.assign({},EMW.base,{face:kind}));}}

/* ---------- el mundo: elegir planeta y situación ---------- */
function screenEmotions(){setTheme("kid");
 emwCleanup();
 const list=emwPlanets(),cur=emwChosen(),done=emwProg();
 render(topbar("screenCalm()")+subHeader("🪐 Planeta de las emociones")
  +'<p class="center" style="margin:-4px 0 8px">Tu planeta amigo vive situaciones del cole y de la casa. ¡Ayúdalo a entender lo que siente y a calmar sus tormentas!</p>'
  +'<div class="card center" style="padding:0;overflow:hidden;border-radius:18px"><div id="emwHero" style="width:100%;height:200px"></div></div>'
  +'<p class="appsec" style="margin-top:8px">1. Elige a tu planeta amigo</p>'
  +'<div style="display:flex;gap:6px;overflow-x:auto;padding:2px 2px 8px">'+list.map(function(x,i){const on=(prof().emwPlanet||0)===i;return '<button onclick="emwPick('+i+')" style="flex:0 0 auto;padding:8px 12px;border-radius:14px;border:3px solid '+(on?"#3B82F6":"#E5E7EB")+';background:'+(on?"#DBEAFE":"#fff")+';font-family:Fredoka;font-weight:700;cursor:pointer;color:#1E293B">'+(i<(prof().myPlanets||[]).length?"⭐ ":"🪐 ")+esc(x.nm)+'</button>';}).join("")+'</div>'
  +'<p class="appsec">2. Elige una situación</p>'
  +EMW_SC.map(function(s){const st=done[s.id]||0;return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="emwStart(\''+s.id+'\')"><span style="font-size:2.2rem">'+s.ic+'</span><span style="flex:1"><span>'+s.nm+'</span><br><span style="font-size:.78rem;opacity:.75;font-weight:500">'+s.place+'</span></span><span>'+(st?"⭐".repeat(st):"")+'</span></button>';}).join("")
  +'<p class="center mut" style="font-size:.8rem;margin-top:10px">💙 Es mejor hacerlo con un adulto al lado, para conversar después.</p>');
 if(typeof renderPlanetChar==="function")EMW.hero=renderPlanetChar("emwHero",Object.assign({},cur.cfg,{face:"feliz"}),{});}
function emwPick(i){prof().emwPlanet=i;save();screenEmotions();}

/* ---------- una situación ---------- */
function emwStart(id){setTheme("kid");
 const sc=EMW_SC.find(function(x){return x.id===id;});if(!sc)return;
 const ch=emwChosen();
 render(topbar("screenEmotions()")
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin:0 0 4px">'+sc.ic+' '+sc.nm+'</h2>'
  +'<div class="card center" style="padding:0;overflow:hidden;border-radius:18px"><div id="emwPlanet" style="width:100%;height:clamp(200px,34vh,270px)"></div></div>'
  +'<div class="progressdots" id="emwDots" style="margin:6px 0"></div><div id="emwBody"></div><div id="emwFb"></div>');
 emwCleanup();
 EMW={id:id,sc:sc,timers:[],base:ch.cfg,pname:ch.nm,step:0,ok:0,total:4,tried:{},acts:{}};
 EMW.c3=renderPlanetChar("emwPlanet",Object.assign({},ch.cfg,{face:"sorpresa"}),{});
 emwStep(0);}
function emwDots(){const d=document.getElementById("emwDots");if(d)d.innerHTML=dots(7,EMW.step+1);}
function emwNarrate(t){speakES(emwFill(t).replace(/[«»]/g,""));}
function emwStep(n){
 EMW.step=n;emwDots();emwFb("");const sc=EMW.sc;
 if(n===0){
  emwFace("sorpresa");if(EMW.c3)EMW.c3.mood("");
  emwBody('<div class="card" style="font-size:1.08rem;line-height:1.55"><b>📖 Esto pasó…</b><p style="margin:6px 0 0">'+esc(emwFill(sc.setup))+'</p><button class="speaker small" onclick="emwNarrate(EMW.sc.setup)">🔊 Escúchalo</button></div><button class="kbtn green" onclick="emwStep(1)">Siguiente →</button>');
  setTimeout(function(){emwNarrate(sc.setup);},300);}
 else if(n===1){
  emwBody('<div class="card"><b>1️⃣ ¿Cómo se siente '+esc(EMW.pname)+'?</b></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+Object.keys(EMW_FEELS).filter(function(k){return k!=="sueno";}).map(function(k){return '<button class="kbtn white" id="emwF'+k+'" style="margin:0;min-height:68px;font-size:1.05rem" onclick="emwFeel(\''+k+'\')"><span style="font-size:2rem">'+EMW_FEELS[k].e+'</span><br>'+EMW_FEELS[k].nm+'</button>';}).join("")+'</div>');
  emwNarrate("¿Cómo se siente {p}?");}
 else if(n===2){
  EMW.body={};EMW.bodyGot=0;EMW.bodyErr=0;EMW.bodyWant=EMW_BODY.filter(function(x){return x[1];}).length;
  emwBody('<div class="card"><b>2️⃣ ¿Qué siente su CUERPO?</b><br><span class="mut" style="font-size:.85rem">Toca las señales de que el enojo está subiendo (hay '+EMW.bodyWant+')</span></div>'+EMW_BODY.map(function(x,i){return '<button class="kbtn white" id="emwB'+i+'" style="min-height:52px;text-align:left" onclick="emwBodyTap('+i+')">'+x[0]+'</button>';}).join(""));}
 else if(n===3){
  EMW.hs=shuffled(sc.help.map(function(t,i){return{t:t,ok:i===0};}));
  if(EMW.c3)EMW.c3.mood("storm");
  emwBody('<div class="card" style="background:#FEE2E2"><b>3️⃣ Un pensamiento «caliente» aparece:</b><p style="margin:6px 0 0;font-size:1.15rem;font-weight:700">'+esc(sc.hot)+'</p></div><div class="card"><b>¿Qué puede pensar '+esc(EMW.pname)+' para que la tormenta baje?</b></div>'+EMW.hs.map(function(o,i){return '<button class="kbtn white" id="emwH'+i+'" style="min-height:58px;text-align:left" onclick="emwThought('+i+')">'+esc(o.t)+'</button>';}).join(""));
  emwNarrate("Un pensamiento caliente: "+sc.hot);}
 else if(n===4){
  EMW.as=shuffled(sc.acts.slice());EMW.best=false;EMW.picked=false;
  emwBody('<div class="card"><b>4️⃣ ¿Qué hace '+esc(EMW.pname)+'?</b><br><span class="mut" style="font-size:.85rem">Toca cada una y mira qué pasa. ¡Busca la mejor!</span></div>'+EMW.as.map(function(a,i){return '<button class="kbtn white" id="emwA'+i+'" style="min-height:58px;text-align:left;display:flex;align-items:center;gap:10px" onclick="emwAct('+i+')"><span style="font-size:1.8rem">'+a.e+'</span><span style="flex:1">'+esc(emwFill(a.t))+'</span></button>';}).join(""));
  emwNarrate("¿Qué hace {p}?");}
 else if(n===5){
  EMW.say=0;
  emwBody('<div class="card center"><b>5️⃣ Practica la frase mágica</b><p style="font-size:1.25rem;font-family:Fredoka;font-weight:600;line-height:1.5;margin:8px 0">«'+esc(emwFill(sc.phrase))+'»</p><button class="speaker" onclick="emwNarrate(EMW.sc.phrase)">🔊 Escúchala</button><p class="mut" style="margin:8px 0 0;font-size:.88rem">Dila en voz alta tres veces. Cada vez toca el botón.</p></div><button class="kbtn green" id="emwSay" onclick="emwSay()">🗣️ La dije (0/3)</button>');
  emwNarrate(sc.phrase);}
 else{
  const p=prof(),plan=Array.isArray(p.calmPlan)?p.calmPlan:[];
  const opts=["resp","manos","saltos","pared","almohada","abrazo","palabras","agua"];
  emwBody('<div class="card"><b>6️⃣ Para la próxima vez…</b><p style="margin:6px 0 0">¿Qué truco quieres usar cuando sientas el enojo subir? Elígelo y lo guardo en <b>tu plan de calma</b> ⭐</p></div>'+opts.map(function(id){const s=calmStrat(id);return '<button class="kbtn white" style="min-height:54px;text-align:left;display:flex;align-items:center;gap:10px" onclick="emwPlan(\''+id+'\')"><span style="font-size:1.7rem">'+s.e+'</span><span style="flex:1">'+s.t+(plan.indexOf(id)>=0?" ⭐":"")+'</span></button>';}).join(""));}}

/* paso 1: sentimiento */
function emwFeel(k){
 const sc=EMW.sc,b=document.getElementById("emwF"+k);
 if(k===sc.feel){
  if(!EMW.tried.feel)EMW.ok++;b.style.background="#86EFAC";sOK();
  emwFace(k==="tristeza"?"dormilon":"enojon");if(EMW.c3)EMW.c3.mood(k==="tristeza"?"rain":"storm");
  emwFb("✅ Sí: <b>"+esc(EMW.pname)+" se siente "+EMW_FEELS[k].nm.toLowerCase()+"</b>. Mira su cara y su clima: ¡hay tormenta! Sentirlo está bien; lo importante es qué hace con eso.","ok");
  emwNarrate("Sí. {p} se siente "+EMW_FEELS[k].nm.toLowerCase()+". Sentirlo está bien.");
  emwLater(function(){emwStep(2);},3800);}
 else{EMW.tried.feel=true;b.style.background="#FCA5A5";b.disabled=true;sNO();emwFb("Mira bien la cara de "+esc(EMW.pname)+" y lo que le pasó 🤔","no");}}
/* paso 2: cuerpo */
function emwBodyTap(i){
 if(EMW.body[i])return;const x=EMW_BODY[i],b=document.getElementById("emwB"+i);
 if(x[1]){EMW.body[i]=1;EMW.bodyGot++;b.style.background="#FDE68A";sOK();
  if(EMW.bodyGot>=EMW.bodyWant){if(!EMW.bodyErr)EMW.ok++;emwFb("✅ ¡Esas son las <b>señales del enojo</b>! Cuando las notes, ¡es hora de usar un truco para calmar el cuerpo!","ok");emwNarrate("Esas son las señales del enojo. Cuando las notes, es hora de calmar el cuerpo.");emwLater(function(){emwStep(3);},4200);}}
 else{EMW.body[i]=1;EMW.bodyErr++;b.style.background="#FCA5A5";b.disabled=true;sNO();emwFb("Esa no es una señal de enojo 🙂 Busca las que se sienten cuando uno está muy molesto.","no");}}
/* paso 3: pensamiento */
function emwThought(i){
 const o=EMW.hs[i],b=document.getElementById("emwH"+i);
 if(o.ok){
  if(!EMW.tried.th)EMW.ok++;b.style.background="#86EFAC";sOK();
  if(EMW.c3){EMW.c3.mood("sun");emwFace("feliz");}
  emwFb("✅ ¡Ese es un <b>pensamiento que ayuda</b>! Dice lo que sientes (<i>«estoy enojado porque…»</i>) sin culpar a nadie. Mira cómo se aclara el cielo del planeta.","ok");
  emwNarrate("Ese es un pensamiento que ayuda. Dice lo que sientes sin culpar a nadie.");
  emwLater(function(){emwStep(4);},4800);}
 else{EMW.tried.th=true;b.style.background="#FCA5A5";b.disabled=true;sNO();emwFb("Ese pensamiento hace crecer la tormenta 🌩️ Busca el que dice cómo se siente, sin culpar ni decir «nunca».","no");}}
/* paso 4: acciones (se pueden probar todas) */
function emwAct(i){
 const a=EMW.as[i],b=document.getElementById("emwA"+i);EMW.acts[i]=1;
 if(a.q===0){
  b.style.background="#FEE2E2";sNO();emwFace("enojon");if(EMW.c3)EMW.c3.mood("storm");
  if(!EMW.picked)EMW.tried.act=true;EMW.picked=true;
  emwFb("🌩️ <b>"+esc(emwFill(a.t))+"</b><br>"+esc(emwFill(a.out))+"<br><i>Eso no ayuda. ¡Prueba otra!</i>","no");emwNarrate(a.out);}
 else{
  EMW.picked=true;if(!EMW.tried.act&&!EMW.scored){EMW.scored=a.q===2?true:true;}
  b.style.background=a.q===2?"#86EFAC":"#FEF9C3";sOK();emwFace("feliz");if(EMW.c3)EMW.c3.mood("sun");
  if(!EMW.done4){EMW.done4=true;if(!EMW.tried.act)EMW.ok++;}
  emwFb((a.q===2?"🌟 <b>¡La mejor!</b> ":"✅ <b>¡Esa ayuda!</b> ")+esc(emwFill(a.t))+"<br>"+esc(emwFill(a.out))+(a.q===2?"":"<br><i>Hay una todavía mejor, ¿la encuentras?</i>")+'<br><button class="kbtn green" style="margin-top:8px;min-height:46px" onclick="emwStep(5)">Siguiente →</button>',"ok");
  emwNarrate(a.out);}}
/* paso 5: frase */
function emwSay(){
 EMW.say++;const b=document.getElementById("emwSay");sOK();
 if(EMW.say<3){if(b)b.textContent="🗣️ La dije ("+EMW.say+"/3)";emwNarrate(EMW.sc.phrase);}
 else{if(b)b.style.display="none";emwFb("🎉 ¡Muy bien! Con palabras, el enojo se hace pequeñito. Eso es lo que hacen los grandes.","ok");confetti(10);emwLater(function(){emwStep(6);},2600);}}
/* paso 6: plan y final */
function emwPlan(id){
 const p=prof();let plan=Array.isArray(p.calmPlan)?p.calmPlan.slice():[];
 if(plan.indexOf(id)<0){if(plan.length>=3)plan.shift();plan.push(id);p.calmPlan=plan;}
 const d=emwProg(),stars=starsFor(EMW.ok,EMW.total);
 d[EMW.id]=Math.max(d[EMW.id]||0,stars);
 calmLog({l:3,src:"mundo",sit:EMW.id});
 recordAnswer("Emociones",stars>=2,60);save();
 emwCleanup();
 nodeWin(stars,"Emociones",EMW_WIN);}
