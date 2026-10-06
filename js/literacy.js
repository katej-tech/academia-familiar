"use strict";
/* ============ LETRAS Y PALABRAS (alfabetización: leer y escribir mejor) ============
   Pedido: actividades de lectoescritura estilo fichas + generador de fichas de caligrafía. NIVEL: preparar
   el paso a SEGUNDO de primaria (7-8 años). La primera versión traía reconocer letras y sonido inicial y la
   usuaria dijo que eso era para niños pequeños (y que mostrar la palabra escrita en "sonido inicial" solo hace
   que la lean, no entrena el oído): se quitaron. Ahora: SÍLABAS (armar con bloques 3D, contar, separar,
   completar), QUE/QUI, GUE/GUI, ¿lleva H?, grupos consonánticos, singular/plural, palabras compuestas,
   antes y después, mejor título.
   Se tomaron solo los FORMATOS de actividad (no se copia contenido, dibujos ni marca de ningún sitio):
   todo el contenido y las imágenes son originales (emojis + palabras escritas aquí).
   La actividad de armar con sílabas es en 3D (bloques de sílabas, js/syllables3d.js).
   Cada actividad: 6 rondas, la palabra se lee en voz alta, estrellas por aciertos a la primera.
   Prefijos lit / LIT. */

/* [palabra, emoji, "sí-la-bas"]  (separación silábica correcta; diptongos juntos: cua-der-no, es-cue-la) */
const LIT_SYL2=[["gato","🐱","ga-to"],["casa","🏠","ca-sa"],["luna","🌙","lu-na"],["libro","📖","li-bro"],["árbol","🌳","ár-bol"],["avión","✈️","a-vión"],["ratón","🐭","ra-tón"],["reloj","⌚","re-loj"],["volcán","🌋","vol-cán"],["dragón","🐉","dra-gón"],["pulpo","🐙","pul-po"],["flores","💐","flo-res"]];
const LIT_SYL3=[["pelota","⚽","pe-lo-ta"],["mochila","🎒","mo-chi-la"],["tortuga","🐢","tor-tu-ga"],["naranja","🍊","na-ran-ja"],["zapato","👟","za-pa-to"],["jirafa","🦒","ji-ra-fa"],["ballena","🐳","ba-lle-na"],["ventana","🪟","ven-ta-na"],["tijera","✂️","ti-je-ra"],["cohete","🚀","co-he-te"],["trompeta","🎺","trom-pe-ta"],["cangrejo","🦀","can-gre-jo"],["guitarra","🎸","gui-ta-rra"],["campana","🔔","cam-pa-na"],["sombrero","🎩","som-bre-ro"],["planeta","🪐","pla-ne-ta"],["pirata","🏴‍☠️","pi-ra-ta"],["serpiente","🐍","ser-pien-te"],["cuaderno","📓","cua-der-no"],["escuela","🏫","es-cue-la"],["abuela","👵","a-bue-la"],["familia","👪","fa-mi-lia"],["paraguas","☔","pa-ra-guas"],["canguro","🦘","can-gu-ro"]];
const LIT_SYL4=[["mariposa","🦋","ma-ri-po-sa"],["elefante","🐘","e-le-fan-te"],["bicicleta","🚲","bi-ci-cle-ta"],["teléfono","📞","te-lé-fo-no"],["zanahoria","🥕","za-na-ho-ria"],["cocodrilo","🐊","co-co-dri-lo"],["chocolate","🍫","cho-co-la-te"],["camiseta","👕","ca-mi-se-ta"],["escalera","🪜","es-ca-le-ra"],["unicornio","🦄","u-ni-cor-nio"],["astronauta","👨‍🚀","as-tro-nau-ta"],["dinosaurio","🦖","di-no-sau-rio"],["murciélago","🦇","mur-cié-la-go"],["mariquita","🐞","ma-ri-qui-ta"]];
const LIT_SYL5=[["helicóptero","🚁","he-li-cóp-te-ro"],["hipopótamo","🦛","hi-po-pó-ta-mo"],["computadora","💻","com-pu-ta-do-ra"]];
const LIT_SYL1=[["sol","☀️","sol"],["pan","🍞","pan"],["flor","🌸","flor"],["tren","🚆","tren"],["pez","🐟","pez"],["luz","💡","luz"]];
const LIT_SYL_ALL=LIT_SYL1.concat(LIT_SYL2,LIT_SYL3,LIT_SYL4,LIT_SYL5);
/* [singular, plural, emoji] */
const LIT_PLURAL=[["gato","gatos","🐱"],["perro","perros","🐶"],["libro","libros","📖"],["flor","flores","🌸"],["reloj","relojes","⌚"],["ratón","ratones","🐭"],["árbol","árboles","🌳"],
 ["camión","camiones","🚚"],["pan","panes","🍞"],["avión","aviones","✈️"],["balón","balones","⚽"],["león","leones","🦁"],["corazón","corazones","❤️"],
 ["lápiz","lápices","✏️"],["pez","peces","🐟"],["luz","luces","💡"],["nariz","narices","👃"],["cruz","cruces","✝️"],["lombriz","lombrices","🪱"],["vez","veces","🎲"]];

/* sílabas que faltan: h = pedacito que se oculta; opts = botones */
const LIT_QUE_QUI=[["queso","🧀","que"],["paquete","📦","que"],["esqueleto","💀","que"],["raqueta","🏸","que"],["parque","🏞️","que"],["bosque","🌲","que"],
 ["mosquito","🦟","qui"],["máquina","⚙️","qui"],["orquídea","🌺","qui"],["mariquita","🐞","qui"],["periquito","🦜","qui"],["quiosco","🏪","qui"]];
const LIT_GUE_GUI=[["hamburguesa","🍔","gue"],["juguete","🧸","gue"],["espagueti","🍝","gue"],["manguera","🚿","gue"],["hormiguero","🐜","gue"],
 ["guitarra","🎸","gui"],["águila","🦅","gui"],["guisante","🫛","gui"],["guiso","🍲","gui"],["guirnalda","🎊","gui"]];
const LIT_CLUSTERS=[["brazo","💪","br"],["bruja","🧙","br"],["cabra","🐐","br"],["sombrero","🎩","br"],["libro","📖","br"],["blusa","👚","bl"],
 ["tren","🚆","tr"],["tractor","🚜","tr"],["trompeta","🎺","tr"],["estrella","⭐","tr"],["plato","🍽️","pl"],["planta","🪴","pl"],["pluma","🪶","pl"],
 ["grillo","🦗","gr"],["tigre","🐅","gr"],["cruz","✝️","cr"],["flor","🌸","fl"],["fresa","🍓","fr"],["fruta","🍉","fr"],["dragón","🐉","dr"],
 ["cocodrilo","🐊","dr"],["clave","🔑","cl"],["globo","🎈","gl"],["regla","📏","gl"]];
const LIT_CL_OPTS=["br","bl","tr","pl","gr","cr","fl","fr","dr","cl","gl"];
const LIT_H=[["hoja","🍃"],["huevo","🥚"],["helado","🍦"],["hormiga","🐜"],["hueso","🦴"],["hilo","🧵"],["hielo","🧊"],["hongo","🍄"],["hacha","🪓"],["hada","🧚"],["humo","💨"],["hipopótamo","🦛"],["hierba","🌿"]];
const LIT_NOH=[["oso","🐻","hoso"],["ojo","👁️","hojo"],["uva","🍇","huva"],["isla","🏝️","hisla"],["oreja","👂","horeja"],["oveja","🐑","hoveja"]];
const LIT_COMP=[{a:"saca",b:"puntas",e:"✏️"},{a:"gira",b:"sol",e:"🌻"},{a:"para",b:"guas",e:"☔"},{a:"abre",b:"latas",e:"🥫"},{a:"cumple",b:"años",e:"🎂"},
 {a:"salva",b:"vidas",e:"🛟"},{a:"para",b:"caídas",e:"🪂"},{a:"lava",b:"platos",e:"🍽️"},{a:"rasca",b:"cielos",e:"🏙️"},{a:"corta",b:"uñas",e:"💅"},
 {a:"saca",b:"corchos",e:"🍾"},{a:"espanta",b:"pájaros",e:"🧑‍🌾"}];
const LIT_SEQ=[
 {e:["🌱","🌿","🌻"],t:["Se planta una semilla","Brota un tallito","Se abre la flor"]},
 {e:["🥚","🐣","🐥"],t:["Ponen un huevo","El huevo se rompe","Sale un pollito"]},
 {e:["🍦","☀️","💧"],t:["Compras un helado","El sol lo derrite","Queda un charco"]},
 {e:["☁️","🌧️","🌈"],t:["Aparecen las nubes","Empieza a llover","Sale el arcoíris"]},
 {e:["🌅","☀️","🌙"],t:["Sale el sol","Es mediodía","Llega la noche"]},
 {e:["🪥","🦷","💧"],t:["Pones pasta en el cepillo","Te cepillas los dientes","Te enjuagas la boca"]},
 {e:["✍️","📮","📬"],t:["Escribes una carta","La echas al buzón","El cartero la entrega"]},
 {e:["❄️","⛄","☀️"],t:["Cae la nieve","Armas un muñeco","Sale el sol y se derrite"]},
 {e:["🎶","🕯️","🍰"],t:["Te cantan cumpleaños","Soplas las velas","Comes pastel"]}];
const LIT_TITLES=[
 {x:"Luna es una perrita juguetona. Corre detrás de la pelota y duerme junto a su cama.",t:["Luna y su pelota","El viaje en tren","Una receta de sopa"]},
 {x:"En el huerto crecen tomates, zanahorias y lechugas. Cada mañana, Pedro riega las plantas.",t:["El huerto de Pedro","Los animales del mar","Un día de playa"]},
 {x:"Las ballenas son enormes, pero comen animales muy pequeños. Viven en el mar y cantan bajo el agua.",t:["Las ballenas cantoras","Un tren veloz","La casa del árbol"]},
 {x:"Hoy es el cumpleaños de Mara. Su familia le preparó un pastel y sus amigos le trajeron regalos.",t:["El cumpleaños de Mara","Un día de lluvia","Mara va al médico"]},
 {x:"El cohete despegó con mucho humo. Dentro, la astronauta veía cómo la Tierra se hacía pequeñita.",t:["Viaje al espacio","En la cocina","El jardín de flores"]},
 {x:"Cuando llueve, los charcos se llenan de agua. Los niños se ponen botas y saltan dentro de ellos.",t:["Saltar en los charcos","Una tarde de calor","Mi gato duerme"]},
 {x:"Los murciélagos duermen de día colgados de cabeza. Por la noche salen a buscar insectos.",t:["Los murciélagos de la noche","Cómo se hace el pan","Un partido de fútbol"]},
 {x:"Sofía guardó sus monedas en una alcancía. Después de un mes, pudo comprar el libro que quería.",t:["La alcancía de Sofía","El perro perdido","El volcán dormido"]}];

const LIT_ACTS=[
 {id:"silabas",ic:"🧱",nm:"Arma con sílabas 3D",sub:"Escucha la palabra y ordena los bloques",cls:"blue"},
 {id:"cuantas",ic:"👏",nm:"¿Cuántas sílabas?",sub:"Aplaude y cuenta los golpes de voz",cls:"green"},
 {id:"separa",ic:"✂️",nm:"Separa en sílabas",sub:"Corta la palabra en pedacitos",cls:"yellow"},
 {id:"falta",ic:"🧩",nm:"La sílaba que falta",sub:"Completa la palabra",cls:"red"},
 {id:"queqi",ic:"🧀",nm:"QUE y QUI",sub:"Completa la palabra",cls:"purple"},
 {id:"gueguy",ic:"🎸",nm:"GUE y GUI",sub:"Completa la palabra",cls:"blue"},
 {id:"grupos",ic:"💪",nm:"Grupos de consonantes",sub:"BR, BL, TR, PL, GR…",cls:"green"},
 {id:"hache",ic:"🅷",nm:"¿Lleva H?",sub:"Elige la palabra bien escrita",cls:"yellow"},
 {id:"plural",ic:"🐱",nm:"Singular y plural",sub:"Un gato, dos… ¿gatos? ¿lápices?",cls:"red"},
 {id:"compuestas",ic:"☔",nm:"Palabras compuestas",sub:"Une las dos mitades",cls:"purple"},
 {id:"secuencia",ic:"⏳",nm:"Antes y después",sub:"¿Qué pasó antes? ¿Y después?",cls:"blue"},
 {id:"titulo",ic:"📰",nm:"El mejor título",sub:"Lee y elige el título",cls:"green"}];
const LIT_WIN={noWorld:true,replay:"screenLetters()",replayLabel:"Más letras 🔤",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let LIT={};

function litNorm(s){return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();}
function litCleanup(){if(LIT.timer)clearTimeout(LIT.timer);LIT.timer=null;LIT={};}
function litSay(w){speakES(w);}
function litLater(fn,ms){if(LIT.timer)clearTimeout(LIT.timer);const k=LIT.kind;LIT.timer=setTimeout(function(){if(LIT.kind===k)fn();},ms);}

/* ---------- menú ---------- */
function screenLetters(){setTheme("kid");
 litCleanup();
 const cards=LIT_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="litStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")+subHeader("🔤 Sílabas y palabras")
  +'<p class="center" style="margin:-4px 0 10px">Practica sílabas y ortografía para segundo de primaria. ¡Cada palabra se lee en voz alta!</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="screenCaligrafia()"><span style="font-size:2.4rem">🖨️</span><span style="flex:1"><span>Fichas de caligrafía</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Escribe una frase e imprime tu hoja de práctica</span></span></button>'
  +cards);}

/* ---------- motor común ---------- */
function litStart(kind){
 litCleanup();LIT={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const bank={
  silabas:litSylItems,
  cuantas:function(){return shuffled(LIT_SYL_ALL).slice(0,6).map(function(r){return{w:r[0],e:r[1],p:litSylSplit(r)};});},
  separa:litSepItems,
  falta:litMissItems,
  queqi:function(){return shuffled(LIT_QUE_QUI).slice(0,6).map(function(x){return{w:x[0],e:x[1],h:x[2],opts:["que","qui"]};});},
  gueguy:function(){return shuffled(LIT_GUE_GUI).slice(0,6).map(function(x){return{w:x[0],e:x[1],h:x[2],opts:["gue","gui"]};});},
  grupos:function(){return shuffled(LIT_CLUSTERS).slice(0,6).map(function(x){return{w:x[0],e:x[1],h:x[2],opts:shuffled([x[2]].concat(shuffled(LIT_CL_OPTS.filter(function(o){return o!==x[2];})).slice(0,2)))};});},
  hache:function(){return shuffled(LIT_H).slice(0,4).map(function(x){return{e:x[1],good:x[0],bad:x[0].slice(1)};}).concat(shuffled(LIT_NOH).slice(0,2).map(function(x){return{e:x[1],good:x[0],bad:x[2]};})).sort(function(){return Math.random()-.5;});},
  plural:litPluralItems,
  compuestas:function(){return shuffled(LIT_COMP).slice(0,6);},
  secuencia:function(){return shuffled(LIT_SEQ).slice(0,6).map(function(s){return{s:s,after:Math.random()<.5};});},
  titulo:function(){return shuffled(LIT_TITLES).slice(0,6);}};
 LIT.items=bank[kind]();LIT.total=LIT.items.length;
 litNext();}
function litHeader(){
 const a=LIT_ACTS.find(function(x){return x.id===LIT.kind;});
 return '<div class="progressdots">'+dots(LIT.total,LIT.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function litFb(h,ok){const f=document.getElementById("litFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function litAnswered(ok,firstTry,delay){
 /* cuenta el acierto SOLO si fue a la primera */
 if(ok){if(firstTry)LIT.ok++;recordAnswer("Lenguaje",firstTry,12);sOK();confetti(firstTry?9:4);}
 LIT.done=true;LIT.i++;litLater(litNext,delay||1500);}
function litFinish(){const stars=starsFor(LIT.ok,Math.max(1,LIT.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",LIT_WIN);}
function litNext(){
 if(LIT.i>=LIT.total)return litFinish();
 LIT.tried=false;LIT.done=false;LIT.fails=0;
 const k=LIT.kind,it=LIT.items[LIT.i];
 if(k==="silabas")return litSyl3d(it);
 if(k==="cuantas")return litCount(it);
 if(k==="separa")return litSep(it);
 if(k==="falta")return litMiss(it);
 if(k==="queqi"||k==="gueguy"||k==="grupos")return litSyllable(it);
 if(k==="hache")return litH(it);
 if(k==="plural")return litPlural(it);
 if(k==="compuestas")return litComp(it);
 if(k==="secuencia")return litSeq(it);
 if(k==="titulo")return litTitle(it);}
function litWordCard(e,txt,big){return '<div class="card center" style="padding:10px"><div style="font-size:'+(big||4.2)+'rem;line-height:1.1">'+e+'</div>'+(txt?'<div style="font-family:Fredoka;font-weight:700;font-size:1.5rem;letter-spacing:2px;margin-top:4px">'+txt+'</div>':'')+'</div>';}

/* ---------- 🧱 arma con sílabas (bloques 3D) ---------- */
function litSylSplit(row){return row[2].split("-");}
function litSylItems(){
 const take=function(pool,n){return shuffled(pool).slice(0,n);};
 return take(LIT_SYL2,2).concat(take(LIT_SYL3,2),take(LIT_SYL4,1),take(LIT_SYL4.concat(LIT_SYL5),1)).map(function(r){return{w:r[0],e:r[1],p:litSylSplit(r)};});}
function litSyl3d(it){
 LIT.cur=it;
 render(topbar("screenLetters()")+litHeader()
  +'<div class="card center" style="padding:8px 12px;display:flex;align-items:center;gap:12px;justify-content:center"><span style="font-size:3.2rem">'+it.e+'</span><span><b>Escucha la palabra y toca los bloques en orden</b><br><button class="speaker small" style="margin-top:4px" onclick="litSay(LIT.cur.w)">🔊 Otra vez</button></span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="litCanvas" style="width:100%;height:clamp(250px,42vh,330px)"></div></div><div id="litFb"></div>');
 LIT.c3=renderSyllableBuilder("litCanvas",it.p,function(ev,info){
  if(ev==="place"){litSay(info.syl);}
  else if(ev==="full"){
   const ok=info.order.every(function(v,k){return v===k;});
   if(ok){LIT.c3.celebrate();litFb("✅ "+it.p.join(" · ").toUpperCase(),true);setTimeout(function(){litSay(it.w);},350);litAnswered(true,!LIT.tried,2300);}
   else{LIT.tried=true;sNO();litFb("Casi… escucha la palabra otra vez 🔊 y prueba de nuevo",false);litSay(it.w);setTimeout(function(){if(LIT.c3&&LIT.kind==="silabas")LIT.c3.reset();},900);}}});
 setTimeout(function(){litSay(it.w);},300);}

/* ---------- 👏 ¿cuántas sílabas? ---------- */
function litCount(it){
 LIT.cur=it;
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,it.w.toUpperCase(),4)
  +'<button class="speaker small" onclick="litSay(LIT.cur.w)">🔊 Escucha</button>'
  +'<p class="center" style="margin:6px 0"><b>👏 Aplaude cada golpe de voz. ¿Cuántas sílabas tiene?</b></p>'
  +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">'+[1,2,3,4,5].map(function(k){return '<button class="kbtn white" id="litO'+k+'" style="margin:0;min-height:64px;font-size:1.7rem" onclick="litCountAns('+k+')">'+k+'</button>';}).join("")+'</div><div id="litFb"></div>');
 litSay(it.w);}
function litCountAns(k){
 if(LIT.done)return;const it=LIT.cur,n=it.p.length,b=document.getElementById("litO"+k);
 if(k===n){b.style.background="#86EFAC";litFb("✅ "+it.p.join(" · ").toUpperCase()+" → "+n,true);litSay(it.w);litAnswered(true,!LIT.tried,2200);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Casi… 🤔 Dila despacio y aplaude, un golpe por sílaba.",false);}}

/* ---------- ✂️ separa en sílabas ---------- */
function litSepItems(){return shuffled(LIT_SYL_ALL.filter(function(r){const c=r[2].split("-").length;return c>=2&&r[0].length<=9&&c<=4;})).slice(0,6).map(function(r){return{w:r[0],e:r[1],p:litSylSplit(r)};});}
function litSep(it){
 LIT.cur=it;LIT.cuts={};
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,"",3.6)
  +'<p class="center" style="margin:4px 0"><b>✂️ Toca entre las letras para cortar la palabra en sílabas</b></p>'
  +'<div class="card" id="litSepBox" style="padding:12px 4px;text-align:center"></div>'
  +'<button class="speaker small" onclick="litSay(LIT.cur.w)">🔊 Escucha</button>'
  +'<button class="kbtn green" onclick="litSepCheck()">✅ Comprobar</button><div id="litFb"></div>');
 litSepDraw();litSay(it.w);}
function litSepDraw(){
 const it=LIT.cur,box=document.getElementById("litSepBox");if(!box)return;
 const L=it.w.split("");
 box.innerHTML=L.map(function(c,k){
  const letter='<span style="display:inline-block;width:1.45rem;font-family:Fredoka;font-weight:700;font-size:1.9rem;text-transform:uppercase;vertical-align:middle">'+c+'</span>';
  if(k===L.length-1)return letter;
  const on=LIT.cuts[k];
  return letter+'<button onclick="litCut('+k+')" aria-label="cortar" style="vertical-align:middle;width:1.1rem;height:2.8rem;margin:0 1px;border:0;border-radius:6px;background:'+(on?'#EF4444':'#E2E8F0')+';color:#fff;font-weight:900;cursor:pointer">'+(on?'|':'')+'</button>';}).join("");}
function litCut(k){if(LIT.done)return;LIT.cuts[k]=!LIT.cuts[k];litSepDraw();}
function litSepCheck(){
 if(LIT.done)return;const it=LIT.cur;
 const want={};let acc=0;it.p.forEach(function(s,i){acc+=s.length;if(i<it.p.length-1)want[acc-1]=true;});
 const mine=Object.keys(LIT.cuts).filter(function(k){return LIT.cuts[k];}).map(Number);
 const wrong=mine.filter(function(k){return !want[k];}),missing=Object.keys(want).map(Number).filter(function(k){return !LIT.cuts[k];});
 if(!wrong.length&&!missing.length){litFb("✅ "+it.p.join(" · ").toUpperCase(),true);litSay(it.w);litAnswered(true,!LIT.tried,2300);return;}
 LIT.tried=true;sNO();
 litFb(missing.length&&!wrong.length?"Te faltan cortes ✂️ La palabra tiene "+it.p.length+" sílabas ("+(it.p.length-1)+" cortes).":"Hay cortes que no van 🤔 Dila despacio: "+it.p.join("…"),false);}

/* ---------- 🧩 la sílaba que falta ---------- */
function litMissItems(){
 return shuffled(LIT_SYL_ALL.filter(function(r){const c=r[2].split("-").length;return c>=2&&c<=4;})).slice(0,6).map(function(r){
  const p=litSylSplit(r),k=Math.floor(Math.random()*p.length);
  const pool=[];LIT_SYL_ALL.forEach(function(q){q[2].split("-").forEach(function(sy){if(sy!==p[k]&&pool.indexOf(sy)<0&&Math.abs(sy.length-p[k].length)<=1)pool.push(sy);});});
  return{w:r[0],e:r[1],p:p,k:k,opts:shuffled([p[k]].concat(shuffled(pool).slice(0,2)))};});}
function litMiss(it){
 LIT.cur=it;
 const shown=it.p.map(function(s,i){return i===it.k?'<span style="display:inline-block;min-width:2.4ch;border-bottom:4px solid #3B82F6;margin:0 2px">&nbsp;</span>':s;}).join('<span style="opacity:.35">-</span>');
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,'<span style="text-transform:uppercase">'+shown+'</span>',4)
  +'<button class="speaker small" onclick="litSay(LIT.cur.w)">🔊 Escucha la palabra</button>'
  +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:8px">'+it.opts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="margin:0;min-height:62px;font-size:1.5rem;text-transform:uppercase" onclick="litMissAns('+i+')">'+o+'</button>';}).join("")+'</div><div id="litFb"></div>');
 litSay(it.w);}
function litMissAns(i){
 if(LIT.done)return;const it=LIT.cur,o=it.opts[i],b=document.getElementById("litO"+i);
 if(o===it.p[it.k]){b.style.background="#86EFAC";litFb("✅ "+it.p.join(" · ").toUpperCase(),true);litSay(it.w);litAnswered(true,!LIT.tried,2000);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Casi… ¡lee las sílabas en voz alta! 🤔",false);}}

/* ---------- 🐱 singular y plural ---------- */
function litPluralItems(){return shuffled(LIT_PLURAL).slice(0,6).map(function(r){
 const sing=r[0],pl=r[1],bad=[];
 [sing+"s",sing+"es",sing.replace(/z$/,"")+"s",sing.replace(/z$/,"c")+"es"].forEach(function(x){if(x!==pl&&bad.indexOf(x)<0&&x!==sing)bad.push(x);});
 return{s:sing,pl:pl,e:r[2],opts:shuffled([pl].concat(shuffled(bad).slice(0,2)))};});}
function litPlural(it){
 LIT.cur=it;
 render(topbar("screenLetters()")+litHeader()
  +'<div class="card center" style="padding:10px"><div style="display:flex;justify-content:center;gap:28px;align-items:center"><div><div style="font-size:3.4rem">'+it.e+'</div><b>UNO: '+it.s+'</b></div><div><div style="font-size:2.4rem;letter-spacing:2px">'+it.e+it.e+'</div><b>DOS: ____</b></div></div></div>'
  +'<p class="center" style="margin:6px 0"><b>¿Cómo se escribe cuando hay más de uno?</b></p>'
  +it.opts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="min-height:56px;font-size:1.4rem" onclick="litPluralAns('+i+')">'+o+'</button>';}).join("")+'<div id="litFb"></div>');
 litSay(it.s);}
function litPluralAns(i){
 if(LIT.done)return;const it=LIT.cur,o=it.opts[i],b=document.getElementById("litO"+i);litSay(o);
 if(o===it.pl){b.style.background="#86EFAC";const why=/z$/.test(it.s)?" (la z cambia a c y se agrega -es)":/[aeiouáéíóú]$/.test(it.s)?" (termina en vocal: se agrega -s)":" (termina en consonante: se agrega -es)";litFb("✅ "+it.s+" → "+it.pl+why,true);litAnswered(true,!LIT.tried,2600);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Casi… 🤔 Dilo en voz alta y fíjate cómo termina la palabra.",false);}}

/* ---------- sílabas que faltan: que/qui, gue/gui, grupos ---------- */
function litSyllable(it){
 const nw=litNorm(it.w),idx=nw.indexOf(it.h);
 const shown=it.w.slice(0,idx)+'<span style="display:inline-block;min-width:2.2ch;border-bottom:4px solid #3B82F6;margin:0 3px">&nbsp;</span>'+it.w.slice(idx+it.h.length);
 LIT.cur=it;
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,'<span style="text-transform:uppercase">'+shown+'</span>',4)
  +'<button class="speaker small" onclick="litSay(\''+it.w+'\')">🔊 Escucha la palabra</button>'
  +'<div style="display:grid;grid-template-columns:repeat('+it.opts.length+',1fr);gap:10px;margin-top:8px">'+it.opts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="margin:0;min-height:62px;font-size:1.5rem;text-transform:uppercase" onclick="litSyl('+i+')">'+o+'</button>';}).join("")+'</div><div id="litFb"></div>');
 litSay(it.w);}
function litSyl(i){
 if(LIT.done)return;const it=LIT.cur,o=it.opts[i],b=document.getElementById("litO"+i);
 if(o===it.h){b.style.background="#86EFAC";litFb("✅ "+it.w.toUpperCase(),true);litSay(it.w);litAnswered(true,!LIT.tried,1700);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Casi… ¡lee la palabra otra vez! 🤔",false);}}

/* ---------- 🅷 ¿lleva H? ---------- */
function litH(it){
 LIT.cur=it;LIT.hopts=shuffled([it.good,it.bad]);
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,"",4.4)+'<p class="center" style="margin:2px 0 6px"><b>¿Cuál está bien escrita?</b></p>'
  +LIT.hopts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="min-height:62px;font-size:1.6rem" onclick="litHAns('+i+')">'+o+'</button>';}).join("")+'<div id="litFb"></div>');
 litSay(it.good);}
function litHAns(i){
 if(LIT.done)return;const it=LIT.cur,o=LIT.hopts[i],b=document.getElementById("litO"+i);
 if(o===it.good){b.style.background="#86EFAC";litFb("✅ "+it.good+(it.good.charAt(0)==="h"?" lleva H al principio":" se escribe sin H"),true);litAnswered(true,!LIT.tried,1800);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Casi… 🤔 Fíjate en la primera letra.",false);}}

/* ---------- ☔ palabras compuestas ---------- */
function litComp(it){
 const others=shuffled(LIT_COMP.filter(function(c){return c.b!==it.b;})).slice(0,2).map(function(c){return c.b;});
 LIT.cur=it;LIT.copts=shuffled(others.concat([it.b]));
 render(topbar("screenLetters()")+litHeader()
  +litWordCard(it.e,'<span style="color:#3B82F6">'+it.a+'</span> + <span style="display:inline-block;min-width:3ch;border-bottom:4px solid #F59E0B">&nbsp;</span>',4)
  +'<p class="center" style="margin:2px 0 6px"><b>¿Con qué se completa la palabra?</b></p>'
  +LIT.copts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="min-height:56px;font-size:1.3rem" onclick="litCompAns('+i+')">'+o+'</button>';}).join("")+'<div id="litFb"></div>');}
function litCompAns(i){
 if(LIT.done)return;const it=LIT.cur,o=LIT.copts[i],b=document.getElementById("litO"+i);
 speakES(o);
 if(o===it.b){b.style.background="#86EFAC";litFb("✅ "+it.a+it.b,true);setTimeout(function(){litSay(it.a+it.b);},500);litAnswered(true,!LIT.tried,2000);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("No forma una palabra. ¡Prueba otra!",false);}}

/* ---------- ⏳ antes y después ---------- */
function litSeq(it){
 const s=it.s,idx=it.after?2:0;
 const wrongPool=[];LIT_SEQ.forEach(function(q){if(q!==s)q.t.forEach(function(t,k){wrongPool.push({e:q.e[k],t:t});});});
 const opts=shuffled(shuffled(wrongPool).slice(0,2).concat([{e:s.e[idx],t:s.t[idx],ok:true}]));
 LIT.cur=it;LIT.sopts=opts;
 render(topbar("screenLetters()")+litHeader()
  +'<div class="card center" style="padding:10px"><div style="font-size:3.4rem">'+s.e[1]+'</div><b style="font-size:1.1rem">'+s.t[1]+'</b></div>'
  +'<p class="center" style="margin:6px 0"><b>¿Qué pasó '+(it.after?'<span style="color:#16A34A">DESPUÉS</span>':'<span style="color:#EF4444">ANTES</span>')+'?</b></p>'
  +opts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="min-height:58px;text-align:left;display:flex;align-items:center;gap:10px" onclick="litSeqAns('+i+')"><span style="font-size:1.9rem">'+o.e+'</span><span style="font-size:1rem">'+o.t+'</span></button>';}).join("")+'<div id="litFb"></div>');
 litSay(s.t[1]);}
function litSeqAns(i){
 if(LIT.done)return;const o=LIT.sopts[i],b=document.getElementById("litO"+i);litSay(o.t);
 if(o.ok){b.style.background="#86EFAC";litFb("✅ ¡En orden: "+LIT.cur.s.t.join(" → ")+"!",true);litAnswered(true,!LIT.tried,2600);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Eso no va con esta historia 🤔",false);}}

/* ---------- 📰 el mejor título ---------- */
function litTitle(it){
 LIT.cur=it;LIT.topts=shuffled(it.t.map(function(t,i){return{t:t,ok:i===0};}));
 render(topbar("screenLetters()")+litHeader()
  +'<div class="card" style="font-size:1.12rem;line-height:1.6">'+esc(it.x)+'</div>'
  +'<button class="speaker small" onclick="litSay(LIT.cur.x)">🔊 Léemelo</button>'
  +'<p class="center" style="margin:6px 0"><b>¿Cuál es el mejor título?</b></p>'
  +LIT.topts.map(function(o,i){return '<button class="kbtn white" id="litO'+i+'" style="min-height:54px;text-align:left" onclick="litTitleAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'<div id="litFb"></div>');
 litSay(it.x);}
function litTitleAns(i){
 if(LIT.done)return;const o=LIT.topts[i],b=document.getElementById("litO"+i);
 if(o.ok){b.style.background="#86EFAC";litFb("✅ ¡Ese título cuenta de qué trata el texto!",true);litAnswered(true,!LIT.tried,1900);}
 else{LIT.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();litFb("Ese título habla de otra cosa 🤔 Lee otra vez.",false);}}

/* ============ 🖨️ FICHAS DE CALIGRAFÍA (se imprimen o se guardan como PDF) ============ */
let LCAL={text:"Me quiero tal como soy",style:"print",lines:8,name:true};
function screenCaligrafia(){setTheme("kid");
 const p=prof();if(p.caliText)LCAL.text=p.caliText;
 render(topbar("screenLetters()")+subHeader("🖨️ Ficha de caligrafía")
  +'<p class="center" style="margin:-4px 0 8px">Escribe una frase, mira la hoja y ¡imprímela para practicar con lápiz!</p>'
  +'<div class="card"><b>1. La frase</b><textarea id="caliText" maxlength="80" rows="2" style="width:100%;font-size:1.1rem;padding:10px;border-radius:12px;border:2px solid #E5E7EB;margin-top:6px;box-sizing:border-box;font-family:Nunito,sans-serif" oninput="caliUpdate()">'+esc(LCAL.text)+'</textarea>'
  +'<b style="display:block;margin-top:10px">2. Tipo de letra</b><div style="display:flex;gap:8px;margin-top:6px"><button class="kbtn '+(LCAL.style==="print"?"blue":"white")+'" style="margin:0;min-height:48px;font-size:.95rem" onclick="caliSet(\'style\',\'print\')">Imprenta</button><button class="kbtn '+(LCAL.style==="cursive"?"blue":"white")+'" style="margin:0;min-height:48px;font-size:.95rem" onclick="caliSet(\'style\',\'cursive\')">Cursiva</button></div>'
  +'<b style="display:block;margin-top:10px">3. Renglones</b><div style="display:flex;gap:8px;margin-top:6px">'+[6,8,10].map(function(n){return '<button class="kbtn '+(LCAL.lines===n?"blue":"white")+'" style="margin:0;min-height:44px;font-size:.95rem" onclick="caliSet(\'lines\','+n+')">'+n+'</button>';}).join("")+'</div>'
  +'<label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-weight:700"><input type="checkbox" '+(LCAL.name?"checked":"")+' onchange="caliSet(\'name\',this.checked)"> Con renglón de nombre y fecha</label></div>'
  +'<div class="card" style="padding:8px;background:#E2E8F0"><div id="caliPrev" style="background:#fff;border-radius:6px;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,.15);max-height:340px;overflow:hidden"></div></div>'
  +'<button class="kbtn green" onclick="caliPrint()">🖨️ Imprimir o guardar como PDF</button>'
  +'<button class="kbtn white" onclick="screenLetters()">← Volver</button>');
 caliUpdate();}
function caliSet(k,v){caliUpdate();LCAL[k]=v;screenCaligrafia();}
function caliUpdate(){const t=document.getElementById("caliText");if(t){LCAL.text=t.value;const p=prof();p.caliText=t.value.slice(0,80);}
 const e=document.getElementById("caliPrev");if(e)e.innerHTML=caliSheetHTML(0.5);}
/* scale < 1 = vista previa en pantalla (px); scale = 1 = hoja A4 real (mm / pt) */
function caliSheetHTML(scale){
 const txt=esc(String(LCAL.text||"").trim()||"Mi frase");
 const preview=scale<1,mm=LCAL.style==="cursive"?15:14;
 const h=preview?Math.round(mm*2):mm,unit=preview?"px":"mm";
 const len=String(LCAL.text||"").length,fs=Math.max(.5,Math.min(1,26/Math.max(len,10)))*h*.62;
 const fam=LCAL.style==="cursive"?"'Dancing Script',cursive":"Fredoka,Nunito,sans-serif";
 const gap=Math.round(h*.35)+unit,fsz=preview?"px":"pt";
 const row=function(i){
  const col=i===0?"#334155":i<3?"#CBD5E1":"transparent";
  return '<div style="position:relative;height:'+h+unit+';margin-bottom:'+gap+';border-top:1px solid #94A3B8;border-bottom:1px solid #94A3B8"><div style="position:absolute;left:0;right:0;top:50%;border-top:1px dashed #94A3B8"></div>'
   +'<div style="position:absolute;left:2%;right:2%;top:0;height:100%;line-height:'+h+unit+';font-family:'+fam+';font-weight:600;font-size:'+fs.toFixed(1)+unit+';color:'+col+';white-space:nowrap;overflow:hidden">'+(i<3?txt:'')+'</div></div>';};
 return (LCAL.name?'<div style="display:flex;gap:10px;margin-bottom:'+Math.round(h*.5)+unit+';font-family:Nunito,sans-serif;font-size:'+(preview?10:11)+fsz+';color:#334155"><span style="flex:2">NOMBRE: ____________________</span><span style="flex:1">FECHA: ____________</span></div>':'')
  +'<div style="text-align:center;font-family:Fredoka,sans-serif;font-weight:700;font-size:'+(preview?13:18)+fsz+';color:#0F766E;margin-bottom:'+Math.round(h*.4)+unit+'">✏️ Practico mi caligrafía</div>'
  +Array.from({length:LCAL.lines},function(_,i){return row(i);}).join("");}
function caliPrint(){
 const old=document.getElementById("printSheet");if(old)old.remove();
 const d=document.createElement("div");d.id="printSheet";d.innerHTML=caliSheetHTML(1);document.body.appendChild(d);
 document.body.classList.add("printing");
 const done=function(){document.body.classList.remove("printing");const s=document.getElementById("printSheet");if(s)s.remove();window.removeEventListener("afterprint",done);};
 window.addEventListener("afterprint",done);
 setTimeout(function(){try{window.print();}catch(e){done();}},150);}
