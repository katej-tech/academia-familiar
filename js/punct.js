"use strict";
/* ============ MAYÚSCULA, PUNTO Y SIGNOS (la oración) — 2.º de primaria ============
   La oración empieza con MAYÚSCULA y termina con PUNTO. Si pregunta: ¿ ? · si exclama: ¡ ! · y en
   las listas, la COMA separa los elementos (y antes de «y» no va coma).
   Actividades: arma la oración con bloques 3D (reusa syllables3d.js: cada bloque es una palabra),
   ¿qué le falta?, ¿pregunta, exclamación o afirmación? y la coma en las listas.
   El gemelo en inglés está en english-play.js (allí el signo va solo al final, sin ¿ ni ¡).
   Prefijo pun / PUN. */

/* oraciones para armar (sin palabras repetidas, para que el orden correcto sea único) */
const PUN_BUILD=[
 "Mi gato duerme.","El perro corre rápido.","La niña lee un libro.","Mamá cocina una sopa.","Los pájaros vuelan alto.","Hoy hace mucho sol.","Yo juego con mi amigo.","La luna brilla de noche.",
 "Mi hermano toca guitarra.","Las flores huelen bien.","Ana pinta un dibujo.","El barco navega despacio.","¿Cómo te llamas?","¿Dónde vives tú?","¡Qué lindo día!","¡Vamos al parque!","¿Quieres jugar conmigo?","¡Feliz cumpleaños, Sofía!"];
/* afirmaciones para quitar mayúscula y/o punto */
const PUN_BASE=["Mi mamá cocina sopa","El gato duerme en la cama","Los niños juegan en el parque","La maestra lee un cuento","Hoy vamos a la playa","Mi abuela teje una bufanda","Pedro monta en bicicleta","El sol brilla en el cielo"];
/* [oración sin signos, tipo: q pregunta · e exclamación · d afirmación, pista] */
const PUN_SIGNS=[
 ["Cómo te llamas","q","Quieres saber su nombre"],["Qué lindo día","e","Estás muy contento"],["Mi perro duerme","d","Cuentas algo"],["Cuántos años tienes","q","Quieres saber su edad"],
 ["Auxilio","e","Pides ayuda gritando"],["Hoy llueve mucho","d","Cuentas algo del clima"],["Dónde vives","q","Quieres saber un lugar"],["Qué susto","e","Te asustaste"],
 ["Me gusta el helado","d","Cuentas lo que te gusta"],["Quieres jugar conmigo","q","Invitas con una pregunta"],["Feliz cumpleaños","e","Saludas con alegría"],["Mi hermana canta","d","Cuentas algo"],
 ["Qué hora es","q","Quieres saber la hora"],["Qué rico huele","e","Te encanta el olor"]];
/* listas: [comienzo, [a, b, c]] */
const PUN_LIST=[
 ["Compré",["manzanas","peras","uvas"]],["En mi mochila hay",["libros","lápices","colores"]],["Mi familia es",["alegre","unida","cariñosa"]],["Vimos en el zoológico",["leones","jirafas","monos"]],
 ["Para la fiesta traje",["globos","pastel","regalos"]],["En el parque hay",["árboles","bancas","flores"]],["Mi mamá compró",["pan","leche","huevos"]],["En la granja vi",["vacas","gallinas","caballos"]]];
const PUN_ACTS=[
 {id:"arma",ic:"🧱",nm:"Arma la oración 3D",sub:"Ordena las palabras: empieza con mayúscula y termina con punto",cls:"blue"},
 {id:"falta",ic:"🔎",nm:"¿Qué le falta?",sub:"¿Mayúscula, punto o las dos?",cls:"red"},
 {id:"signos",ic:"❓",nm:"¿Pregunta o exclamación?",sub:"¿ ? · ¡ ! · punto",cls:"green"},
 {id:"coma",ic:"🛒",nm:"La coma en las listas",sub:"manzanas, peras y uvas",cls:"purple"}];
const PUN_WIN={noWorld:true,replay:"screenPunct()",replayLabel:"Más oraciones ✍️",backFn:"screenGrammar()",backLabel:"Gramática 🏷️"};
let PUN={};

function punCleanup(){if(PUN.timer)clearTimeout(PUN.timer);PUN.timer=null;PUN={};}
function punLater(fn,ms){if(PUN.timer)clearTimeout(PUN.timer);const k=PUN.kind;PUN.timer=setTimeout(function(){if(PUN.kind===k)fn();},ms);}
function punFb(h,ok){const f=document.getElementById("punFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function punHeader(){const a=PUN_ACTS.find(function(x){return x.id===PUN.kind;});return '<div class="progressdots">'+dots(PUN.total,PUN.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function punAnswered(first,delay){
 if(first)PUN.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 PUN.done=true;PUN.i++;punLater(punNext,delay||2000);}
function punFinish(){const stars=starsFor(PUN.ok,Math.max(1,PUN.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",PUN_WIN);}
function punLow(s){return s.charAt(0).toLowerCase()+s.slice(1);}

/* ---------- menú y lección ---------- */
function screenPunct(){setTheme("kid");
 punCleanup();
 const cards=PUN_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="punStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenGrammar()")+subHeader("✍️ Mayúscula, punto y signos")
  +'<p class="center" style="margin:-4px 0 10px">Escribe oraciones como un experto</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="punLesson()"><span style="font-size:2.4rem">📘</span><span style="flex:1"><span>Mini lección</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Empieza aquí: la oración y sus signos</span></span></button>'+cards);}
function punLesson(){setTheme("kid");
 punCleanup();
 const row=function(col,bg,title,text,ex){return '<div class="card" style="border:3px solid '+col+';background:'+bg+'"><b style="color:'+col+';font-size:1.15rem">'+title+'</b><p style="margin:4px 0;font-size:.92rem;line-height:1.45">'+text+'</p><button onclick="speakES(\''+ex.replace(/[¿?¡!]/g,"")+'\')" style="padding:6px 12px;border-radius:12px;border:2px solid '+col+';background:#fff;font-family:Fredoka;font-weight:700;font-size:1.15rem;cursor:pointer">🔊 '+ex+'</button></div>';};
 render(topbar("screenPunct()")+subHeader("📘 La oración")
  +row("#2563EB","#DBEAFE","1. Empieza con MAYÚSCULA y termina con PUNTO","Una oración cuenta algo completo. La primera letra va en mayúscula y al final va un punto.","Mi gato duerme.")
  +row("#16A34A","#DCFCE7","2. Si PREGUNTAS: ¿ … ?","En español los signos van <b>al principio y al final</b>: ¿ abre y ? cierra.","¿Cómo te llamas?")
  +row("#F59E0B","#FEF3C7","3. Si te EMOCIONAS: ¡ … !","Sirven para gritar, sorprenderse o alegrarse. También se abren y se cierran.","¡Qué lindo día!")
  +row("#7C3AED","#EDE9FE","4. La COMA separa las listas","Entre un elemento y otro va coma, pero <b>antes de «y» no</b>.","Compré manzanas, peras y uvas.")
  +'<button class="kbtn green" onclick="punStart(\'arma\')">🧱 ¡A practicar!</button><button class="kbtn white" onclick="screenPunct()">← Volver</button>');}

/* ---------- motor ---------- */
function punStart(kind){
 punCleanup();PUN={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const take=function(arr,n){return shuffled(arr).slice(0,n);};
 const bank={
  arma:function(){return take(PUN_BUILD,6);},
  falta:function(){return take(PUN_BASE,6).map(function(b,i){const d=["m","p","mp","ok"][i%4];return{base:b,def:d};}).sort(function(){return Math.random()-.5;});},
  signos:function(){return take(PUN_SIGNS,6);},
  coma:function(){return take(PUN_LIST,6);}};
 PUN.items=bank[kind]();PUN.total=PUN.items.length;
 punNext();}
function punNext(){
 if(PUN.i>=PUN.total)return punFinish();
 PUN.tried=false;PUN.done=false;
 const k=PUN.kind,it=PUN.items[PUN.i];
 if(k==="arma")return punArma(it);
 if(k==="falta")return punFalta(it);
 if(k==="signos")return punSignos(it);
 if(k==="coma")return punComa(it);}

/* ---------- 🧱 arma la oración (bloques 3D de palabras) ---------- */
function punArma(s){
 const words=s.split(" ");PUN.cur=s;
 render(topbar("screenPunct()")+punHeader()
  +'<div class="card center" style="padding:8px 12px"><b>Toca las palabras en orden para formar la oración</b><br><span class="mut" style="font-size:.82rem">La primera empieza con mayúscula y la última lleva el signo final</span><br><button class="speaker small" style="margin-top:4px" onclick="speakES(PUN.cur.replace(/[¿?¡!]/g,\'\'))">🔊 Escúchala</button></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="punCanvas" style="width:100%;height:clamp(250px,42vh,330px)"></div></div><div id="punFb"></div>');
 PUN.c3=renderSyllableBuilder("punCanvas",words,function(ev,info){
  if(ev==="place"){speakES(info.syl.replace(/[¿?¡!.,]/g,""));}
  else if(ev==="full"){
   const ok=info.order.every(function(v,k){return v===k;});
   if(ok){PUN.c3.celebrate();punFb("✅ "+esc(s),true);setTimeout(function(){speakES(s.replace(/[¿?¡!]/g,""));},300);punAnswered(!PUN.tried,2600);}
   else{PUN.tried=true;sNO();punFb("Casi… 🤔 Empieza por la que lleva mayúscula y termina con la del signo final",false);setTimeout(function(){if(PUN.c3&&PUN.kind==="arma")PUN.c3.reset();},900);}}});
 setTimeout(function(){speakES(s.replace(/[¿?¡!]/g,""));},300);}

/* ---------- 🔎 ¿qué le falta? ---------- */
function punFalta(it){
 const cap=it.base,low=punLow(it.base);
 const text=it.def==="m"?low+".":it.def==="p"?cap:it.def==="mp"?low:cap+".";
 PUN.cur=it;PUN.text=text;
 const opts=[["m","Le falta la MAYÚSCULA"],["p","Le falta el PUNTO"],["mp","Le faltan las dos cosas"],["ok","¡Está bien escrita!"]];
 PUN.opts=opts;
 render(topbar("screenPunct()")+punHeader()
  +'<div class="card center" style="font-size:1.35rem;font-family:Fredoka;font-weight:600;line-height:1.6">'+esc(text)+'</div>'
  +'<button class="speaker small" onclick="speakES(PUN.cur.base)">🔊 Escúchala</button>'
  +'<p class="center" style="margin:4px 0"><b>¿Qué le pasa a esta oración?</b></p>'
  +opts.map(function(o,i){return '<button class="kbtn white" id="punO'+i+'" style="min-height:54px;font-size:1.05rem" onclick="punFaltaAns('+i+')">'+o[1]+'</button>';}).join("")+'<div id="punFb"></div>');
 speakES(it.base);}
function punFaltaAns(i){
 if(PUN.done)return;const it=PUN.cur,o=PUN.opts[i],b=document.getElementById("punO"+i);
 if(o[0]===it.def){b.style.background="#86EFAC";punFb("✅ Bien escrita: <b>"+esc(it.base+".")+"</b>",true);punAnswered(!PUN.tried,2400);}
 else{PUN.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();punFb("Casi… 🤔 Mira la primera letra y el final de la oración.",false);}}

/* ---------- ❓ pregunta, exclamación o afirmación ---------- */
function punSignos(it){
 const t=it[0];
 const forms={q:"¿"+t+"?",e:"¡"+t+"!",d:t+"."};
 PUN.cur=it;PUN.opts=shuffled(["q","e","d"]).map(function(k){return{k:k,txt:forms[k]};});
 render(topbar("screenPunct()")+punHeader()
  +'<div class="card center" style="padding:10px"><div style="font-size:2.4rem">🗣️</div><b style="font-size:1.05rem">'+esc(it[2])+'</b><div style="font-family:Fredoka;font-weight:600;font-size:1.3rem;margin-top:6px;opacity:.85">«'+esc(t)+'»</div></div>'
  +'<p class="center" style="margin:6px 0"><b>¿Cómo se escribe bien?</b></p>'
  +PUN.opts.map(function(o,i){return '<button class="kbtn white" id="punO'+i+'" style="min-height:58px;font-size:1.3rem" onclick="punSignosAns('+i+')">'+esc(o.txt.charAt(0).toUpperCase()+o.txt.slice(1))+'</button>';}).join("")+'<div id="punFb"></div>');
 speakES(t);}
function punSignosAns(i){
 if(PUN.done)return;const it=PUN.cur,o=PUN.opts[i],b=document.getElementById("punO"+i);
 const txt=function(x){return x.charAt(0).toUpperCase()+x.slice(1);};
 if(o.k===it[1]){b.style.background="#86EFAC";punFb("✅ "+esc(txt(o.txt))+" · "+(o.k==="q"?"Pregunta: ¿ ? al principio y al final.":o.k==="e"?"Exclamación: ¡ ! al principio y al final.":"Afirmación: termina con punto."),true);speakES(it[0]);punAnswered(!PUN.tried,3000);}
 else{PUN.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();punFb("Casi… 🤔 Piensa: ¿preguntas, gritas de emoción o cuentas algo?",false);}}

/* ---------- 🛒 la coma en las listas ---------- */
function punComa(it){
 const a=it[1],lead=it[0];
 const good=lead+" "+a[0]+", "+a[1]+" y "+a[2]+".";
 const bads=[lead+", "+a[0]+" "+a[1]+" y "+a[2]+".",lead+" "+a[0]+" "+a[1]+" y "+a[2]+".",lead+" "+a[0]+", "+a[1]+", y "+a[2]+".",lead+" "+a[0]+" "+a[1]+", y "+a[2]+"."];
 PUN.cur=it;PUN.good=good;PUN.opts=shuffled([good].concat(shuffled(bads).slice(0,2)));
 render(topbar("screenPunct()")+punHeader()
  +'<div class="card center"><b>¿Cuál oración tiene las comas bien puestas?</b><p class="mut" style="margin:4px 0 0;font-size:.85rem">Entre elemento y elemento va coma… pero antes de «y» no.</p></div>'
  +PUN.opts.map(function(o,i){return '<button class="kbtn white" id="punO'+i+'" style="min-height:58px;font-size:1.05rem;text-align:left" onclick="punComaAns('+i+')">🔊 '+esc(o)+'</button>';}).join("")+'<div id="punFb"></div>');}
function punComaAns(i){
 if(PUN.done)return;const o=PUN.opts[i],b=document.getElementById("punO"+i);speakES(o);
 if(o===PUN.good){b.style.background="#86EFAC";punFb("✅ ¡Las comas separan la lista y antes de «y» no hay coma!",true);punAnswered(!PUN.tried,2600);}
 else{PUN.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();punFb("Casi… 🤔 Lee en voz alta: ¿dónde haces una pausa?",false);}}
