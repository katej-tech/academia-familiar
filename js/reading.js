"use strict";
/* ============ COMPRENSIÓN LECTORA (modo propio) ============
   Pedido: "comprensión lectora" como práctica dedicada. No es un cuento con preguntas sueltas:
   se entrena CADA habilidad por separado y se ve cuál cuesta más.
   Flujo: 1) leer (con voz que resalta cada frase) → 2) preguntas de 4 tipos:
     📍 lo dice el texto (literal) · 🧠 infiere (lo que no está escrito) · 📖 vocabulario en contexto ·
     💡 idea principal · y al final 🔢 ordena los hechos.
   3) Tras cada acierto con pista, "Detective 🔦": toca la FRASE donde está la prueba.
   Los textos tienen 3 niveles de dificultad; con clave de IA se crean textos nuevos de cualquier tema.
   Estadística por habilidad en prof().readStats. Prefijos rc/RDC. */

const RC_TYPES={lit:{ic:"📍",nm:"Lo dice el texto",tip:"La respuesta está escrita tal cual en el texto."},
 inf:{ic:"🧠",nm:"Infiere",tip:"La respuesta no está escrita: se descubre con pistas."},
 vocab:{ic:"📖",nm:"Vocabulario",tip:"¿Qué significa la palabra en esta historia?"},
 main:{ic:"💡",nm:"Idea principal",tip:"¿De qué trata TODO el texto?"},
 order:{ic:"🔢",nm:"Orden de los hechos",tip:"¿Qué pasó primero, después y al final?"},
 det:{ic:"🔦",nm:"Detective de pistas",tip:"Encontrar la frase que prueba la respuesta."}};
const RC_LV=["","⭐ Pequeños lectores","⭐⭐ Lectores medios","⭐⭐⭐ Superlectores"];
const RC_WIN={noWorld:true,replay:"screenReadComp()",replayLabel:"Otro texto 📖",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};

/* En "ops" la respuesta correcta va SIEMPRE primero; se mezclan al mostrarlas. ev = frases que sirven de prueba. */
const RC_TEXTS=[
 {id:"t1",lv:1,ic:"🐶",title:"Tom y la lluvia",
  s:["Tom es un perro pequeño y café.","Todas las mañanas sale al parque con Ana.","Hoy empezó a llover muy fuerte.","Tom se escondió debajo de un banco para no mojarse.","Ana abrió su paraguas amarillo y lo cubrió.","Los dos volvieron a casa saltando en los charcos."],
  qs:[{k:"lit",q:"¿De qué color es Tom?",ops:["Café","Negro","Blanco"],ev:[0]},
      {k:"lit",q:"¿Qué hizo Tom cuando empezó a llover?",ops:["Se escondió debajo de un banco","Corrió a casa","Se fue a nadar"],ev:[3]},
      {k:"inf",q:"¿Por qué Ana abrió el paraguas?",ops:["Para cubrir a Tom de la lluvia","Porque hacía mucho sol","Para jugar a la pelota"],ev:[4,2]},
      {k:"vocab",q:"En el texto, «charcos» son…",ops:["Agua de lluvia en el suelo","Árboles muy grandes","Piedras de colores"],ev:[5]},
      {k:"main",q:"¿De qué trata el texto?",ops:["De un paseo de Tom y Ana bajo la lluvia","De cómo se fabrica un paraguas","De un gato que se perdió"],ev:[]}],
  order:["Empezó a llover","Tom se escondió","Ana abrió el paraguas","Volvieron a casa"]},
 {id:"t2",lv:1,ic:"🌻",title:"La semilla de girasol",
  s:["Luis plantó una semilla de girasol en una maceta.","Cada día la regaba con un poco de agua.","Después de una semana, salió un tallito verde.","Luis lo puso junto a la ventana para que recibiera sol.","Pasaron dos meses y la planta creció más alta que él.","Un día se abrió una flor amarilla enorme y Luis sonrió muy feliz."],
  qs:[{k:"lit",q:"¿Dónde plantó Luis la semilla?",ops:["En una maceta","En el patio","En un vaso"],ev:[0]},
      {k:"lit",q:"¿Qué salió después de una semana?",ops:["Un tallito verde","Una flor amarilla","Una fruta"],ev:[2]},
      {k:"inf",q:"¿Por qué Luis puso la planta junto a la ventana?",ops:["Para que recibiera sol","Para que nadie la viera","Porque tenía frío"],ev:[3]},
      {k:"vocab",q:"En el texto, «tallito» significa…",ops:["Un tallo pequeño","Una hoja enorme","Una raíz"],ev:[2]},
      {k:"main",q:"¿Cuál es la idea principal?",ops:["Luis cuidó una semilla hasta que floreció","Luis aprendió a nadar","Los girasoles son azules"],ev:[]}],
  order:["Luis plantó la semilla","Salió un tallito","La planta creció","Se abrió la flor"]},
 {id:"t3",lv:2,ic:"🍱",title:"El misterio de la lonchera",
  s:["Sofía llegó a la escuela y abrió su mochila.","¡Su lonchera no estaba! Revisó otra vez, pero solo encontró sus cuadernos.","Recordó que esa mañana estaba apurada porque se le había hecho tarde.","También recordó que su mamá le había dicho: «No olvides nada en la mesa».","Sofía sintió un poco de vergüenza, pero decidió contárselo a su profesora.","La profesora sonrió y le prestó parte de su merienda.","A la salida, el papá de Sofía llegó con la lonchera: la había olvidado sobre la mesa de la cocina.","Desde ese día, Sofía revisa su mochila antes de salir de casa."],
  qs:[{k:"lit",q:"¿Qué encontró Sofía en la mochila en lugar de la lonchera?",ops:["Sus cuadernos","Un juguete","Un sándwich"],ev:[1]},
      {k:"lit",q:"¿Quién le prestó comida a Sofía?",ops:["Su profesora","Su mamá","Un compañero"],ev:[5]},
      {k:"inf",q:"¿Por qué olvidó Sofía la lonchera?",ops:["Estaba apurada porque se le hizo tarde","Su mamá la escondió","La perdió en el bus"],ev:[2,3]},
      {k:"inf",q:"¿Cómo se sintió Sofía al contárselo a la profesora?",ops:["Con un poco de vergüenza","Muy enojada","Aburrida"],ev:[4]},
      {k:"vocab",q:"En el texto, «merienda» es…",ops:["Una comida ligera","Un juguete","Una tarea"],ev:[5]},
      {k:"main",q:"¿Qué aprendió Sofía?",ops:["A revisar su mochila antes de salir","A cocinar","A correr más rápido"],ev:[]}],
  order:["Sofía no encontró su lonchera","Habló con su profesora","Su papá trajo la lonchera","Empezó a revisar su mochila antes de salir"]},
 {id:"t4",lv:2,ic:"🐝",title:"Las abejas trabajadoras",
  s:["Las abejas viven en grupos muy grandes llamados colmenas.","En cada colmena hay una reina, que pone los huevos.","Las abejas obreras salen a buscar néctar en las flores.","Con el néctar fabrican la miel, que es su alimento.","Mientras vuelan de flor en flor, llevan polen de una a otra.","Gracias a eso, muchas plantas pueden dar frutos y semillas.","Por eso las abejas son muy importantes para la naturaleza y también para nosotros.","Si ves una abeja, no la molestes: solo pica cuando se siente en peligro."],
  qs:[{k:"lit",q:"¿Qué es una colmena?",ops:["El hogar de un grupo de abejas","Un tipo de flor","Un frasco de miel"],ev:[0]},
      {k:"lit",q:"¿Qué hace la reina?",ops:["Pone los huevos","Busca néctar","Fabrica el polen"],ev:[1]},
      {k:"inf",q:"¿Por qué son importantes las abejas?",ops:["Ayudan a que las plantas den frutos","Porque hacen mucho ruido","Porque son muy grandes"],ev:[4,5]},
      {k:"inf",q:"¿Cuándo pica una abeja?",ops:["Cuando se siente en peligro","Siempre que ve una persona","Nunca"],ev:[7]},
      {k:"vocab",q:"En el texto, «néctar» es…",ops:["Un líquido dulce que hay en las flores","Un tipo de insecto","La casa de las abejas"],ev:[2,3]},
      {k:"main",q:"¿De qué trata el texto?",ops:["De cómo viven las abejas y por qué son importantes","De cómo cuidar un jardín","De los animales que pican"],ev:[]}],
  order:["Las obreras recogen néctar","Fabrican la miel","Llevan polen de flor en flor","Las plantas dan frutos"]},
 {id:"t5",lv:3,ic:"🏝️",title:"El faro de la isla",
  s:["Hace muchos años, en una isla pequeña, vivía un farero llamado Don Mateo.","Cada tarde subía los ciento veinte escalones del faro para encender la gran luz.","Esa luz ayudaba a los barcos a no chocar con las rocas durante la noche.","Una noche, una tormenta apagó la luz y el mar se llenó de olas enormes.","Don Mateo, con las manos temblando, volvió a subir las escaleras.","Descubrió que el viento había roto el cristal de la lámpara.","Sin pensarlo mucho, tomó todas las linternas que tenía y las colocó en la ventana, una al lado de otra.","Aunque la luz era más débil, los marineros la vieron a lo lejos y se alejaron de las rocas.","A la mañana siguiente, todos los barcos habían llegado sanos y salvos al puerto.","Don Mateo aprendió que, incluso con pocas cosas, se puede resolver un problema si uno piensa con calma."],
  qs:[{k:"lit",q:"¿Cuántos escalones tenía el faro?",ops:["Ciento veinte","Cien","Veinte"],ev:[1]},
      {k:"lit",q:"¿Qué rompió el viento?",ops:["El cristal de la lámpara","La puerta del faro","Una de las linternas"],ev:[5]},
      {k:"inf",q:"¿Para qué servía la luz del faro?",ops:["Para que los barcos no chocaran con las rocas","Para atraer a los peces","Para decorar la isla"],ev:[2]},
      {k:"inf",q:"¿Cómo se sentía Don Mateo al volver a subir?",ops:["Nervioso, con las manos temblando","Aburrido","Muy dormido"],ev:[4]},
      {k:"inf",q:"¿Por qué pudieron los marineros alejarse de las rocas?",ops:["Vieron la luz de las linternas","Oyeron una campana","Conocían el mar de memoria"],ev:[7]},
      {k:"vocab",q:"En el texto, «sanos y salvos» significa…",ops:["Sin daño y a salvo","Muy cansados","Enfermos pero vivos"],ev:[8]},
      {k:"main",q:"¿Cuál es el mensaje del texto?",ops:["Con calma se puede resolver un problema aun con pocas cosas","Las tormentas son divertidas","Los faros son muy pequeños"],ev:[9]}],
  order:["La tormenta apagó la luz","Don Mateo descubrió el cristal roto","Puso las linternas en la ventana","Los barcos llegaron al puerto"]},
 {id:"t6",lv:3,ic:"🌤️",title:"¿Por qué el cielo es azul?",
  s:["La luz del Sol parece blanca, pero en realidad está formada por todos los colores del arcoíris.","Cuando esa luz entra en la atmósfera, choca con las moléculas diminutas del aire.","Los colores no se desvían todos igual: el azul se dispersa mucho más que el rojo.","Por eso, desde cualquier lugar del cielo nos llega luz azul.","Al atardecer, la luz tiene que atravesar más aire para llegar a nuestros ojos.","En ese recorrido largo, casi todo el azul se pierde por el camino.","Entonces nos llegan sobre todo los colores naranja y rojo, y el cielo se tiñe de esos tonos.","Así que el cielo no es azul porque refleje el mar, como muchos creen.","¡Es la luz del Sol jugando con el aire!"],
  qs:[{k:"lit",q:"¿Cómo es en realidad la luz del Sol?",ops:["Está formada por todos los colores del arcoíris","Es solamente blanca","Es solamente amarilla"],ev:[0]},
      {k:"lit",q:"¿Qué color se dispersa más en el aire?",ops:["El azul","El rojo","El verde"],ev:[2]},
      {k:"inf",q:"¿Por qué el atardecer se ve naranja y rojo?",ops:["Porque el azul se pierde en el camino largo de la luz","Porque el Sol cambia de color","Porque el mar lo pinta"],ev:[4,5,6]},
      {k:"inf",q:"¿Qué idea equivocada corrige el texto?",ops:["Que el cielo es azul porque refleja el mar","Que el Sol es una estrella","Que el aire tiene moléculas"],ev:[7]},
      {k:"vocab",q:"En el texto, «se dispersa» significa…",ops:["Se esparce hacia muchos lados","Se junta en un solo punto","Se apaga"],ev:[2]},
      {k:"main",q:"¿De qué trata el texto?",ops:["De por qué el cielo es azul y por qué cambia al atardecer","De cómo se forma el arcoíris","De cómo es el mar"],ev:[]}],
  order:["La luz del Sol entra en la atmósfera","Choca con las moléculas del aire","El azul se dispersa por todo el cielo","Al atardecer el azul se pierde y vemos naranja y rojo"]}
];

let RDC={timers:[],run:0};
function rcCleanup(){RDC.run++;RDC.timers.forEach(clearTimeout);RDC.timers=[];try{window.speechSynthesis.cancel();}catch(e){}if(typeof stopGemAudio==="function")stopGemAudio();}
function rcLater(fn,ms){const run=RDC.run;const t=setTimeout(function(){if(run===RDC.run)fn();},ms);RDC.timers.push(t);return t;}
function rcStats(){const p=prof();if(!p.readStats)p.readStats={};return p.readStats;}
function rcProg(){const p=prof();if(!p.readComp)p.readComp={};return p.readComp;}
function rcAi(){const p=prof();if(!p.readAi)p.readAi=[];return p.readAi;}
function rcAll(){return RC_TEXTS.concat(rcAi());}
function rcFind(id){return rcAll().find(function(t){return t.id===id;});}
function rcStat(k,ok){const st=rcStats();if(!st[k])st[k]=[0,0];st[k][1]++;if(ok)st[k][0]++;}

/* ---------- menú ---------- */
function screenReadComp(){setTheme("kid");
 rcCleanup();
 const prog=rcProg(),st=rcStats();
 const bars=["lit","inf","vocab","main","order","det"].map(function(k){const v=st[k]||[0,0],pc=v[1]?Math.round(v[0]/v[1]*100):0;
  return '<div style="display:flex;align-items:center;gap:6px;margin:4px 0;font-size:.82rem"><span style="width:120px;font-weight:700">'+RC_TYPES[k].ic+' '+RC_TYPES[k].nm+'</span><div style="flex:1;height:12px;background:#E5E7EB;border-radius:6px;overflow:hidden"><div style="width:'+pc+'%;height:100%;background:'+(pc>=70?"#22C55E":pc>=40?"#FACC15":"#F87171")+'"></div></div><span style="width:34px;text-align:right">'+(v[1]?pc+'%':'—')+'</span></div>';}).join("");
 const total=Object.keys(st).reduce(function(a,k){return a+st[k][1];},0);
 const card=function(t){const s=prog[t.id]||0;return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="rcOpen(\''+t.id+'\')"><span style="font-size:2.2rem">'+t.ic+'</span><span style="flex:1"><span>'+esc(t.title)+'</span><br><span style="font-size:.78rem;opacity:.8;font-weight:500">'+t.s.length+' frases · '+(t.qs.length+1)+' preguntas</span></span><span>'+(s?"⭐".repeat(s):"")+'</span></button>';};
 const lvBlock=function(lv){const l=rcAll().filter(function(t){return t.lv===lv;});return l.length?'<p class="appsec" style="margin-top:12px">'+RC_LV[lv]+'</p>'+l.map(card).join(""):"";};
 render(topbar("screenKidMap()")+subHeader("🔎 Comprensión lectora")
  +'<p class="center" style="margin:-4px 0 10px">Lee, responde y demuestra con una pista que lo entendiste 🔦</p>'
  +(total?'<div class="card" style="padding:10px 12px"><b>📊 Tus superpoderes de lectura</b>'+bars+'</div>':"")
  +lvBlock(1)+lvBlock(2)+lvBlock(3)
  +(S.geminiKey
   ?'<p class="appsec" style="margin-top:14px">✨ Texto nuevo con IA</p>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+RC_AI_TOPICS.map(function(t,i){return '<button class="kbtn white" style="font-size:.88rem;min-height:56px;padding:6px;margin:0" onclick="rcGen('+i+')">'+t[0]+' '+esc(t[1])+'</button>';}).join("")+'</div>'
    +'<div class="card" style="margin-top:10px"><b>🔎 ¿Sobre qué quieres leer?</b><input id="rcTopic" maxlength="60" placeholder="Ej: los pulpos…" style="width:100%;font-size:1.05rem;padding:10px;border-radius:12px;border:2px solid #E5E7EB;margin:8px 0;box-sizing:border-box"><div style="display:flex;gap:6px">'+[1,2,3].map(function(l){return '<button class="kbtn green" style="margin:0;font-size:.9rem;min-height:46px;padding:4px" onclick="rcGenCustom('+l+')">Nivel '+l+'</button>';}).join("")+'</div></div>'
   :'<p class="center mut" style="font-size:.82rem;margin-top:12px">✨ Con la clave de IA (papá o mamá) se pueden crear textos nuevos sobre cualquier tema.</p>')
  +'<div id="rcGenFb"></div>');}

/* ---------- 1) leer ---------- */
function rcOpen(id){setTheme("kid");
 const t=rcFind(id);if(!t)return;
 render(topbar("screenReadComp()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin:0 0 4px">'+t.ic+' '+esc(t.title)+'</h2>'
  +'<p class="center mut" style="margin:0 0 8px;font-size:.88rem">Paso 1: lee con calma. Después vendrán las preguntas.</p>'
  +'<div class="card" id="rcText" style="font-size:clamp(1.1rem,4.8vw,1.3rem);line-height:1.75">'+t.s.map(function(x,i){return '<span id="rcS'+i+'" style="border-radius:6px;padding:1px 2px;transition:background .2s">'+esc(x)+'</span> ';}).join("")+'</div>'
  +'<button class="kbtn blue" onclick="rcReadAloud()">🔊 Que me lo lean (se ilumina cada frase)</button>'
  +'<button class="kbtn green" onclick="rcStart()">✅ Ya lo leí, ¡a las preguntas!</button>');
 RDC.t=t;RDC.q=0;}
function rcReadAloud(){
 rcCleanup();const t=RDC.t;let i=0;
 const step=function(){
  if(i>=t.s.length){t.s.forEach(function(_,k){rcHi(k,false);});return;}
  const k=i++;rcHi(k,true);
  let fin=false;const next=function(){if(fin)return;fin=true;rcHi(k,false);rcLater(step,250);};
  speakES(t.s[k],next);rcLater(next,Math.min(12000,t.s[k].length*110+1800));};
 step();}
function rcHi(i,on){const e=document.getElementById("rcS"+i);if(e)e.style.background=on?"#FEF08A":"transparent";}

/* ---------- 2) preguntas ---------- */
function rcStart(){
 rcCleanup();const t=RDC.t;
 RDC.qs=t.qs.map(function(q){return Object.assign({},q,{opts:shuffled(q.ops.map(function(o,i){return{t:o,ok:i===0};}))});});
 RDC.qs.push({k:"order",q:"Ordena los hechos: toca primero lo que pasó antes.",order:t.order,ev:[]});
 RDC.i=0;RDC.ok=0;RDC.total=RDC.qs.length;rcQ();}
function rcTextBox(open){
 const t=RDC.t;
 return '<div id="rcTxt" style="display:'+(open?'block':'none')+'" class="card"><div style="font-size:1rem;line-height:1.6">'+t.s.map(function(x,i){return '<span id="rcS'+i+'">'+esc(x)+'</span> ';}).join("")+'</div></div>';}
function rcToggleText(){const e=document.getElementById("rcTxt");if(e)e.style.display=e.style.display==="none"?"block":"none";}
function rcQ(){
 if(RDC.i>=RDC.qs.length)return rcFinish();
 const q=RDC.qs[RDC.i],ty=RC_TYPES[q.k],open=RDC.t.lv===1;
 RDC.tried=false;RDC.done=false;
 const head='<div class="progressdots">'+dots(RDC.total,RDC.i)+'</div>'
  +'<div class="card" style="padding:10px 12px"><span style="background:#EEF2FF;border-radius:12px;padding:3px 9px;font-size:.8rem;font-weight:800">'+ty.ic+' '+ty.nm+'</span> <span class="mut" style="font-size:.8rem">'+ty.tip+'</span><p style="margin:8px 0 0;font-weight:700;font-size:1.05rem;line-height:1.4">'+esc(q.q)+'</p></div>';
 if(q.k==="order"){
  RDC.pool=shuffled(q.order.map(function(e,i){return{e:e,i:i};}));RDC.pick=[];
  if(RDC.pool.every(function(x,k){return x.i===k;}))RDC.pool.reverse();
  render(topbar("screenReadComp()")+head+'<div id="rcOrd"></div><div id="rcFb"></div>');rcOrderDraw();return;}
 render(topbar("screenReadComp()")+head
  +(open?rcTextBox(true):'<button class="kbtn white" style="min-height:44px;font-size:.9rem" onclick="rcToggleText()">👀 Releer el texto</button>'+rcTextBox(false))
  +q.opts.map(function(o,i){return '<button class="kbtn white" id="rcO'+i+'" style="min-height:54px;text-align:left" onclick="rcAns('+i+')">'+esc(o.t)+'</button>';}).join("")
  +'<div id="rcFb"></div>');}
function rcAns(i){
 if(RDC.done)return;const q=RDC.qs[RDC.i],o=q.opts[i],b=document.getElementById("rcO"+i);
 if(o.ok){
  RDC.done=true;const first=!RDC.tried;if(first)RDC.ok++;rcStat(q.k,first);recordAnswer("Comprensión",first,15);
  sOK();if(b)b.style.background="#86EFAC";
  if(q.ev&&q.ev.length){rcDetective();}
  else{rcFb('✅ ¡Correcto!',true);rcLater(function(){RDC.i++;rcQ();},1500);}
 }else{
  RDC.tried=true;sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}
  rcFb('Casi… 🤔 Vuelve a mirar el texto y piensa: <i>'+esc(RC_TYPES[q.k].tip)+'</i>',false);}}
function rcFb(h,ok){const f=document.getElementById("rcFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}

/* ---------- detective: toca la frase que lo prueba ---------- */
function rcDetective(){
 const q=RDC.qs[RDC.i];RDC.det=false;
 const f=document.getElementById("rcFb");
 document.querySelectorAll('[id^="rcO"]').forEach(function(b){b.disabled=true;});
 const txt=document.getElementById("rcTxt");if(txt)txt.style.display="none";
 f.innerHTML='<div class="card" style="margin-top:10px;background:#FEF9C3"><b>🔦 ¡Detective! ¿En qué frase está la pista?</b><p class="mut" style="margin:2px 0 8px;font-size:.85rem">Toca la frase que prueba tu respuesta.</p>'
  +RDC.t.s.map(function(x,i){return '<button id="rcD'+i+'" onclick="rcDet('+i+')" style="display:block;width:100%;text-align:left;margin:4px 0;padding:8px 10px;border-radius:12px;border:2px solid #E5E7EB;background:#fff;font-size:.95rem;line-height:1.35;cursor:pointer">'+esc(x)+'</button>';}).join("")
  +'</div><div id="rcDf"></div>';
 f.scrollIntoView({block:"nearest",behavior:"smooth"});}
function rcDet(i){
 if(RDC.det)return;const q=RDC.qs[RDC.i],ok=q.ev.indexOf(i)>=0;
 const b=document.getElementById("rcD"+i);
 if(ok){RDC.det=true;rcStat("det",true);sOK();confetti(8);if(b)b.style.background="#86EFAC";
  document.getElementById("rcDf").innerHTML='<p style="text-align:center;font-weight:800;color:#16A34A;margin-top:8px">🔦 ¡Encontraste la pista!</p><button class="kbtn green" onclick="RDC.i++;rcQ()">Continuar →</button>';}
 else{
  if(!RDC.detTried){rcStat("det",false);RDC.detTried=true;}
  sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}
  RDC.detCount=(RDC.detCount||0)+1;
  if(RDC.detCount>=2){RDC.det=true;q.ev.forEach(function(k){const e=document.getElementById("rcD"+k);if(e)e.style.background="#86EFAC";});
   document.getElementById("rcDf").innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px">La pista estaba en la frase verde 💚</p><button class="kbtn green" onclick="RDC.i++;rcQ()">Continuar →</button>';}
  else document.getElementById("rcDf").innerHTML='<p style="text-align:center;margin-top:8px">Esa no es. Busca la frase que dice la prueba 🔍</p>';}
 if(RDC.det){RDC.detTried=false;RDC.detCount=0;}}

/* ---------- ordenar hechos ---------- */
function rcOrderDraw(){
 const el=document.getElementById("rcOrd");if(!el)return;
 el.innerHTML='<div class="card" style="min-height:60px;padding:8px">'+(RDC.pick.length?RDC.pick.map(function(x,k){return '<div onclick="rcOrderUndo('+k+')" style="margin:4px 0;padding:8px 10px;border-radius:12px;background:#DBEAFE;border:2px solid #93C5FD;cursor:pointer"><b>'+(k+1)+'.</b> '+esc(x.e)+'</div>';}).join(""):'<span class="mut">Toca los hechos en el orden en que pasaron 👇</span>')+'</div>'
  +RDC.pool.map(function(x,k){return '<button class="kbtn white" style="min-height:48px;text-align:left;font-size:.98rem" onclick="rcOrderTap('+k+')">'+esc(x.e)+'</button>';}).join("");}
function rcOrderTap(k){
 const x=RDC.pool.splice(k,1)[0];if(!x)return;RDC.pick.push(x);
 if(RDC.pool.length){rcOrderDraw();return;}
 const ok=RDC.pick.every(function(y,i){return y.i===i;});
 rcOrderDraw();
 if(ok){RDC.ok++;rcStat("order",true);recordAnswer("Comprensión",true,20);sOK();confetti(12);rcFb('✅ ¡En el orden perfecto!',true);rcLater(function(){RDC.i++;rcQ();},1700);}
 else{if(!RDC.tried){rcStat("order",false);recordAnswer("Comprensión",false,20);}RDC.tried=true;sNO();rcFb('Casi… 🤔 Voy a devolverlos para que lo intentes otra vez.',false);
  rcLater(function(){RDC.pool=shuffled(RDC.pick);RDC.pick=[];rcOrderDraw();},1500);}}
function rcOrderUndo(k){const x=RDC.pick.splice(k,1)[0];if(x)RDC.pool.push(x);rcOrderDraw();}

function rcFinish(){
 rcCleanup();
 const stars=starsFor(RDC.ok,RDC.total),pr=rcProg();
 pr[RDC.t.id]=Math.max(pr[RDC.t.id]||0,stars);save();
 nodeWin(stars,"Comprensión",RC_WIN);}

/* ---------- ✨ textos nuevos con IA ---------- */
const RC_AI_TOPICS=[["🦖","Dinosaurios"],["🌊","El mar profundo"],["🚀","Viajar al espacio"],["🐆","Animales de la selva"],["🤖","Inventos geniales"],["🌋","Volcanes"],["🧙","Una aventura mágica"],["⚽","Un partido de fútbol"]];
function rcGen(i){const t=RC_AI_TOPICS[i];if(t)rcGenerate(t[1],1+Math.floor(Math.random()*3),t[0]);}
function rcGenCustom(lv){
 const inp=document.getElementById("rcTopic"),raw=(inp&&inp.value||"").replace(/[<>"]/g,"").trim().slice(0,60);
 if(raw.length<3){if(inp){inp.focus();inp.style.borderColor="#EF4444";}return;}
 rcGenerate(raw,lv,"✨");}
async function rcGenerate(topic,lv,ic){
 const f=document.getElementById("rcGenFb");
 if(f)f.innerHTML='<div class="card center"><span class="spin">✍️</span> Escribiendo un texto sobre “'+esc(topic)+'”…</div>';
 const n=lv===1?6:lv===2?8:10;
 try{
  const o=await geminiJSON('Write a reading-comprehension text IN SPANISH for a child aged 7-10 about: "'+topic+'". Level '+lv+' of 3 ('+(lv===1?"very simple short sentences":lv===2?"simple sentences with some connectors":"richer vocabulary and a short message")+'). '
   +'RULES: true, kind and child-safe content only; if the topic is inappropriate or unclear, write about friendly animals instead; no brands or copyrighted characters. Exactly '+n+' sentences. '
   +'Then write 5 multiple-choice questions in Spanish, each with "k" one of lit (answer written in the text), inf (answer must be inferred), vocab (meaning of a word in context), main (main idea) — include at least 1 inf, 1 vocab and 1 main. '
   +'In "ops" put exactly 3 options with the CORRECT one FIRST. "ev" = array with the 0-based index(es) of the sentence(s) that prove the answer (empty array for main). '
   +'Also give "order": 4 key events of the text in the correct chronological order (short phrases). '
   +'Reply ONLY with valid JSON, no markdown: {"title":"...","ic":"emoji","s":["sentence 1","..."],"qs":[{"k":"lit","q":"...","ops":["correct","wrong","wrong"],"ev":[0]}],"order":["a","b","c","d"]}');
  const s=(o.s||[]).filter(function(x){return typeof x==="string"&&x.length>3;}).slice(0,12);
  const qs=(o.qs||[]).filter(function(q){return q&&["lit","inf","vocab","main"].indexOf(q.k)>=0&&typeof q.q==="string"&&Array.isArray(q.ops)&&q.ops.length>=3&&Array.isArray(q.ev||[]);}).slice(0,6)
   .map(function(q){return{k:q.k,q:String(q.q).slice(0,160),ops:q.ops.slice(0,3).map(function(x){return String(x).slice(0,110);}),ev:(q.ev||[]).filter(function(e){return Number.isInteger(e)&&e>=0&&e<s.length;}).slice(0,3)};});
  const order=(o.order||[]).filter(function(x){return typeof x==="string"&&x.length>2;}).slice(0,4).map(function(x){return x.slice(0,90);});
  if(s.length<5||qs.length<4||order.length<4||!qs.some(function(q){return q.k==="main";}))throw new Error("La IA devolvió un texto incompleto. Intenta otra vez.");
  /* sin pista que probar, esa pregunta no pasa por el detective */
  const t={id:"ai"+Date.now(),lv:lv,ic:String(o.ic||ic||"📖").slice(0,4),title:String(o.title||topic).slice(0,50),s:s.map(function(x){return x.slice(0,200);}),qs:qs,order:order,ai:true};
  const list=rcAi();list.push(t);while(list.length>8)list.shift();save();
  rcOpen(t.id);
 }catch(e){const ff=document.getElementById("rcGenFb");if(ff)ff.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message||"No se pudo crear el texto")+'</div>';}}
