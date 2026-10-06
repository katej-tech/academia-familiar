"use strict";
/* ============ SUSTANTIVO · ADJETIVO · VERBO (gramática de 2.º de primaria) ============
   Pedido: seguir con sustantivo, adjetivo y verbo. Colores fijos en toda la app:
   sustantivo AZUL (nombra), adjetivo VERDE (cómo es), verbo ROJO (qué hace).
   Incluye una mini LECCIÓN y 5 actividades: canastas de palabras en 3D (js/grammar3d.js),
   ¿qué palabra es?, detective de oraciones, completa la oración e imagen y palabra.
   Las oraciones se escriben con marcas [palabra|n|a|v] para saber qué es cada palabra.
   Prefijo gram / GRAM (GM ya lo usa game-money.js). */

const GRAM_K={
 n:{nm:"Sustantivo",col:"#3B82F6",bg:"#DBEAFE",ic:"🏷️",def:"Nombra personas, animales, cosas y lugares.",ask:"¿Quién es? ¿Qué es?",ex:["niña","perro","mesa","parque"]},
 a:{nm:"Adjetivo",col:"#22C55E",bg:"#DCFCE7",ic:"🎨",def:"Dice cómo es algo: su color, su tamaño o cómo se siente.",ask:"¿Cómo es?",ex:["grande","rojo","suave","alegre"]},
 v:{nm:"Verbo",col:"#EF4444",bg:"#FEE2E2",ic:"🏃",def:"Dice qué hace alguien o qué le pasa.",ask:"¿Qué hace?",ex:["correr","saltar","comer","dormir"]}};
const GRAM_N=["niña","niño","perro","gato","mesa","casa","parque","escuela","maestra","libro","pelota","árbol","río","ciudad","mamá","pez","flor","luna","carro","playa","cuaderno","ratón","montaña","bicicleta","hospital","tienda","abuelo","jirafa"];
const GRAM_A=["grande","pequeño","rojo","azul","bonito","alto","rápido","lento","sabroso","caliente","feliz","triste","suave","fuerte","amarillo","redondo","brillante","divertido","cansado","hermoso","largo","pesado","ligero","peludo","alegre","valiente","amable","tranquilo"];
const GRAM_V=["correr","saltar","comer","dormir","jugar","leer","escribir","cantar","nadar","volar","bailar","cocinar","mirar","abrazar","beber","caminar","dibujar","reír","ayudar","llorar"];
/* [palabra|tipo] marca cada sustantivo (n), adjetivo (a) y verbo (v); lo demás es relleno */
const GRAM_SENT=[
 "El [perro|n] [pequeño|a] [corre|v] en el [parque|n].",
 "La [niña|n] [alegre|a] [canta|v] una [canción|n].",
 "Mi [mamá|n] [cocina|v] una [sopa|n] [caliente|a].",
 "El [gato|n] [negro|a] [duerme|v] en el [sillón|n].",
 "Los [pájaros|n] [pequeños|a] [vuelan|v] sobre el [río|n].",
 "La [maestra|n] [amable|a] [lee|v] un [cuento|n] [divertido|a].",
 "El [niño|n] [valiente|a] [salta|v] el [charco|n].",
 "Mi [abuela|n] [prepara|v] un [pastel|n] [sabroso|a].",
 "La [flor|n] [amarilla|a] [crece|v] en el [jardín|n].",
 "Los [niños|n] [felices|a] [juegan|v] con la [pelota|n] [roja|a].",
 "El [elefante|n] [grande|a] [bebe|v] [agua|n] [fresca|a].",
 "La [tortuga|n] [lenta|a] [camina|v] por la [playa|n].",
 "El [payaso|n] [gracioso|a] [baila|v] en la [fiesta|n].",
 "Mi [hermano|n] [dibuja|v] una [casa|n] [bonita|a].",
 "La [luna|n] [brillante|a] [sale|v] por la [noche|n].",
 "El [bebé|n] [tranquilo|a] [duerme|v] en su [cuna|n].",
 "Los [estudiantes|n] [escriben|v] en el [cuaderno|n] [nuevo|a].",
 "La [mariposa|n] [colorida|a] [vuela|v] sobre las [flores|n]."];
/* completa la oración: k = tipo de palabra que se pide; bad = palabras de OTROS tipos */
const GRAM_FILL=[
 {s:"El ___ ladra mucho.",k:"n",ok:"perro",bad:["bonito","corre"]},
 {s:"La casa es muy ___.",k:"a",ok:"grande",bad:["perro","salta"]},
 {s:"Mi hermano ___ todos los días.",k:"v",ok:"lee",bad:["libro","alto"]},
 {s:"La ___ vuela muy alto.",k:"n",ok:"mariposa",bad:["rápido","canta"]},
 {s:"Tengo un gato muy ___.",k:"a",ok:"suave",bad:["duerme","jardín"]},
 {s:"Los niños ___ en el patio.",k:"v",ok:"juegan",bad:["pelota","felices"]},
 {s:"El helado está ___.",k:"a",ok:"sabroso",bad:["cocina","mesa"]},
 {s:"Mi ___ me abraza fuerte.",k:"n",ok:"mamá",bad:["tranquila","canta"]},
 {s:"El pájaro ___ en el árbol.",k:"v",ok:"canta",bad:["azul","nido"]},
 {s:"La ___ es muy alta.",k:"n",ok:"torre",bad:["salta","brillante"]},
 {s:"Ana tiene un vestido ___.",k:"a",ok:"rojo",bad:["baila","parque"]},
 {s:"Los peces ___ en el río.",k:"v",ok:"nadan",bad:["grandes","agua"]}];
/* imagen y palabra: k = adjetivo o verbo que completa */
const GRAM_PIC=[
 {e:"🐘",s:"El elefante es ___.",k:"a",ok:"grande",bad:["pequeño","ligero"]},
 {e:"🐢",s:"La tortuga es ___.",k:"a",ok:"lenta",bad:["rápida","ligera"]},
 {e:"🧊",s:"El hielo está ___.",k:"a",ok:"frío",bad:["caliente","dulce"]},
 {e:"🔥",s:"El fuego está ___.",k:"a",ok:"caliente",bad:["frío","suave"]},
 {e:"🪨",s:"La piedra es ___.",k:"a",ok:"pesada",bad:["ligera","blanda"]},
 {e:"🍰",s:"El pastel es ___.",k:"a",ok:"dulce",bad:["salado","amargo"]},
 {e:"🏃",s:"El niño ___ rápido.",k:"v",ok:"corre",bad:["duerme","come"]},
 {e:"🍎",s:"La niña ___ una manzana.",k:"v",ok:"come",bad:["canta","nada"]},
 {e:"😴",s:"El bebé ___ en su cuna.",k:"v",ok:"duerme",bad:["corre","vuela"]},
 {e:"🐟",s:"Los peces ___ en el agua.",k:"v",ok:"nadan",bad:["bailan","leen"]},
 {e:"🐦",s:"El pájaro ___ en el cielo.",k:"v",ok:"vuela",bad:["nada","escribe"]},
 {e:"📖",s:"Mi hermano ___ un cuento.",k:"v",ok:"lee",bad:["salta","canta"]}];
const GRAM_ACTS=[
 {id:"canastas",ic:"🧺",nm:"Canastas de palabras 3D",sub:"Lanza cada palabra a su canasta",cls:"blue"},
 {id:"cual",ic:"❓",nm:"¿Qué palabra es?",sub:"Sustantivo, adjetivo o verbo",cls:"green"},
 {id:"detective",ic:"🔍",nm:"Detective de oraciones",sub:"Toca el verbo, el adjetivo, los sustantivos",cls:"yellow"},
 {id:"completa",ic:"🧩",nm:"Completa la oración",sub:"Busca la palabra que falta",cls:"red"},
 {id:"imagen",ic:"🖼️",nm:"Imagen y palabra",sub:"¿Cómo es? ¿Qué hace?",cls:"purple"}];
const GRAM_WIN={noWorld:true,replay:"screenGrammar()",replayLabel:"Más gramática 🏷️",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let GRAM={};

function gramParse(s){
 const out=[];let last=0,m;const re=/\[([^|\]]+)\|([nav])\]/g;
 const push=function(t){t.split(/(\s+)/).forEach(function(x){if(x&&!/^\s+$/.test(x))out.push({w:x,k:null});});};
 while((m=re.exec(s))){if(m.index>last)push(s.slice(last,m.index));out.push({w:m[1],k:m[2]});last=re.lastIndex;}
 if(last<s.length)push(s.slice(last));
 return out;}
function gramPlain(toks){return toks.map(function(t){return t.w;}).join(" ").replace(/\s+([.,;!?])/g,"$1");}
function gramChip(t,bare){const K=t.k?GRAM_K[t.k]:null;return '<span style="display:inline-block;margin:2px 3px;padding:2px 8px;border-radius:10px;font-weight:700;'+(K&&!bare?'background:'+K.bg+';border:2px solid '+K.col+';color:'+K.col:'')+'">'+esc(t.w)+'</span>';}
function gramKindBtn(k,fn){const K=GRAM_K[k];return '<button id="gk'+k+'" onclick="'+fn+'(\''+k+'\')" style="flex:1;min-height:64px;border-radius:16px;border:3px solid '+K.col+';background:'+K.bg+';color:'+K.col+';font-family:Fredoka;font-weight:700;font-size:1rem;cursor:pointer">'+K.ic+'<br>'+K.nm+'</button>';}
function gramCleanup(){if(GRAM.timer)clearTimeout(GRAM.timer);GRAM.timer=null;GRAM={};}
function gramLater(fn,ms){if(GRAM.timer)clearTimeout(GRAM.timer);const k=GRAM.kind;GRAM.timer=setTimeout(function(){if(GRAM.kind===k)fn();},ms);}
function gramFb(h,ok){const f=document.getElementById("gramFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function gramHeader(){const a=GRAM_ACTS.find(function(x){return x.id===GRAM.kind;});return '<div class="progressdots">'+dots(GRAM.total,GRAM.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function gramAnswered(first,delay){
 if(first)GRAM.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 GRAM.done=true;GRAM.i++;gramLater(gramNext,delay||1600);}
function gramFinish(){const stars=starsFor(GRAM.ok,Math.max(1,GRAM.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",GRAM_WIN);}

/* ---------- menú y lección ---------- */
function screenGrammar(){setTheme("kid");
 gramCleanup();
 const cards=GRAM_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="gramStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")+subHeader("🏷️ Sustantivo, adjetivo y verbo")
  +'<p class="center" style="margin:-4px 0 10px">Aprende cómo se llaman las palabras y practica con juegos</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="gramLesson()"><span style="font-size:2.4rem">📘</span><span style="flex:1"><span>Mini lección</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Empieza aquí: qué es cada uno, con ejemplos</span></span></button>'
  +cards);}
function gramLesson(){setTheme("kid");
 gramCleanup();
 const ex=gramParse(GRAM_SENT[Math.floor(Math.random()*GRAM_SENT.length)]);
 const card=function(k){const K=GRAM_K[k];return '<div class="card" style="border:3px solid '+K.col+';background:'+K.bg+'"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2.4rem">'+K.ic+'</span><div><b style="color:'+K.col+';font-size:1.3rem">'+K.nm+'</b><br><span style="font-size:.9rem">'+K.def+'</span></div></div>'
  +'<p style="margin:8px 0 4px;font-size:.85rem;opacity:.8">Responde: <b>'+K.ask+'</b></p><div>'+K.ex.map(function(w){return '<button onclick="speakES(\''+w+'\')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid '+K.col+';background:#fff;color:'+K.col+';font-weight:800;font-size:1rem;cursor:pointer">🔊 '+w+'</button>';}).join("")+'</div></div>';};
 render(topbar("screenGrammar()")+subHeader("📘 Mini lección")
  +card("n")+card("a")+card("v")
  +'<div class="card"><b>Mira una oración con colores:</b><div style="font-size:1.15rem;line-height:2.2;margin-top:6px">'+ex.map(function(t){return gramChip(t);}).join(" ")+'</div><button class="speaker small" onclick="speakES(\''+gramPlain(ex).replace(/'/g,"")+'\')">🔊 Escucharla</button></div>'
  +'<button class="kbtn green" onclick="gramStart(\'canastas\')">🧺 ¡A practicar!</button><button class="kbtn white" onclick="screenGrammar()">← Volver</button>');}

/* ---------- motor ---------- */
function gramStart(kind){
 gramCleanup();GRAM={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const bank={
  canastas:function(){return[0,1];},
  cual:function(){return shuffled(GRAM_SENT).slice(0,6).map(function(s){const t=gramParse(s),c=t.filter(function(x){return x.k;});return{t:t,target:pick(c)};});},
  detective:function(){return shuffled(GRAM_SENT).slice(0,6).map(function(s,i){const t=gramParse(s);return{t:t,ask:["v","a","n","v","a","n"][i]};});},
  completa:function(){return shuffled(GRAM_FILL).slice(0,6);},
  imagen:function(){return shuffled(GRAM_PIC.filter(function(x){return x.k==="a";})).slice(0,3).concat(shuffled(GRAM_PIC.filter(function(x){return x.k==="v";})).slice(0,3)).sort(function(){return Math.random()-.5;});}};
 GRAM.items=bank[kind]();
 if(kind==="canastas"){GRAM.total=12;GRAM.round=0;}else GRAM.total=GRAM.items.length;
 gramNext();}
function gramNext(){
 if(GRAM.i>=GRAM.total&&GRAM.kind!=="canastas")return gramFinish();
 GRAM.tried=false;GRAM.done=false;
 const k=GRAM.kind,it=GRAM.items[GRAM.i];
 if(k==="canastas")return gramSorter();
 if(k==="cual")return gramCual(it);
 if(k==="detective")return gramDetective(it);
 if(k==="completa"||k==="imagen")return gramFill(it);}

/* ---------- 🧺 canastas 3D ---------- */
function gramSorter(){
 const words=shuffled(shuffled(GRAM_N).slice(0,2).map(function(w){return{w:w,k:"n"};}).concat(shuffled(GRAM_A).slice(0,2).map(function(w){return{w:w,k:"a"};}),shuffled(GRAM_V).slice(0,2).map(function(w){return{w:w,k:"v"};})));
 GRAM.tries={};
 render(topbar("screenGrammar()")+'<div class="progressdots">'+dots(2,GRAM.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🧺 Canastas de palabras 3D</p>'
  +'<div class="card" style="padding:8px 12px"><b>Toca una palabra y luego su canasta</b><br><span class="mut" style="font-size:.82rem">🔵 nombra · 🟢 dice cómo es · 🔴 dice qué hace</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="gramCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="gramFb"></div>');
 GRAM.c3=renderWordSorter("gramCanvas",words,function(ev,info){
  if(ev==="select"){speakES(info.w);}
  else if(ev==="ok"){if(!GRAM.tries[info.w])GRAM.ok++;recordAnswer("Lenguaje",!GRAM.tries[info.w],8);GRAM.i++;sOK();confetti(4);gramFb("✅ "+info.w+" es "+(info.k==="v"?"un verbo":info.k==="a"?"un adjetivo":"un sustantivo"),true);}
  else if(ev==="wrong"){GRAM.tries[info.w]=1;sNO();const K=GRAM_K[info.right];gramFb("🤔 «"+info.w+"» "+(info.right==="v"?"dice qué hace":info.right==="a"?"dice cómo es":"nombra algo")+". ¡Prueba otra canasta!",false);}
  else if(ev==="done"){GRAM.round++;if(GRAM.round>=2){gramFb("🎉 ¡Todas las palabras!",true);gramLater(gramFinish,1200);}else{gramFb("🎉 ¡Muy bien! Otra ronda…",true);gramLater(gramSorter,1300);}}});}

/* ---------- ❓ ¿qué palabra es? ---------- */
function gramCual(it){
 const toks=it.t.map(function(t){return t===it.target?'<span style="display:inline-block;margin:2px 3px;padding:2px 8px;border-radius:10px;font-weight:800;background:#FEF9C3;border:3px solid #EAB308">'+esc(t.w)+'</span>':'<span style="margin:2px 3px">'+esc(t.w)+'</span>';}).join(" ");
 GRAM.cur=it;
 render(topbar("screenGrammar()")+gramHeader()
  +'<div class="card" style="font-size:1.25rem;line-height:2.1">'+toks+'</div><button class="speaker small" onclick="speakES(GRAM.cur.t.map(function(x){return x.w;}).join(\' \'))">🔊 Escucha la oración</button>'
  +'<p class="center" style="margin:6px 0"><b>La palabra marcada es un…</b></p>'
  +'<div style="display:flex;gap:8px">'+["n","a","v"].map(function(k){return gramKindBtn(k,"gramCualAns");}).join("")+'</div><div id="gramFb"></div>');
 speakES(gramPlain(it.t));}
function gramCualAns(k){
 if(GRAM.done)return;const it=GRAM.cur,b=document.getElementById("gk"+k);
 if(k===it.target.k){b.style.background=GRAM_K[k].col;b.style.color="#fff";const K=GRAM_K[k];gramFb("✅ «"+it.target.w+"» es "+(k==="v"?"un verbo":k==="a"?"un adjetivo":"un sustantivo")+" — "+(k==="v"?"dice qué hace":k==="a"?"dice cómo es":"nombra algo"),true);gramAnswered(!GRAM.tried,2400);}
 else{GRAM.tried=true;b.style.opacity=".35";b.disabled=true;sNO();gramFb("Casi… 🤔 Pregúntate: ¿nombra algo, dice cómo es o dice qué hace?",false);}}

/* ---------- 🔍 detective de oraciones ---------- */
function gramDetective(it){
 GRAM.cur=it;GRAM.found={};GRAM.errs=0;
 GRAM.want=it.t.filter(function(t){return t.k===it.ask;}).length;
 const K=GRAM_K[it.ask];
 render(topbar("screenGrammar()")+gramHeader()
  +'<div class="card center" style="background:'+K.bg+';border:3px solid '+K.col+'"><b style="font-size:1.1rem;color:'+K.col+'">'+K.ic+' Toca '+(it.ask==="n"?"los SUSTANTIVOS":it.ask==="a"?"los ADJETIVOS":"el VERBO")+'</b><br><span style="font-size:.85rem">'+K.def+'</span>'+(GRAM.want>1?'<br><span id="gramLeft" class="mut" style="font-size:.85rem">Hay '+GRAM.want+'</span>':'<br><span id="gramLeft" class="mut" style="font-size:.85rem">Hay 1</span>')+'</div>'
  +'<div class="card" style="line-height:2.4;text-align:center">'+it.t.map(function(t,i){return '<button id="gramT'+i+'" onclick="gramTap('+i+')" style="margin:3px;padding:6px 12px;border-radius:12px;border:3px solid #CBD5E1;background:#fff;font-family:Fredoka;font-weight:600;font-size:1.15rem;cursor:pointer">'+esc(t.w)+'</button>';}).join("")+'</div>'
  +'<button class="speaker small" onclick="speakES(gramPlain(GRAM.cur.t))">🔊 Escucha la oración</button><div id="gramFb"></div>');
 speakES(gramPlain(it.t));}
function gramTap(i){
 if(GRAM.done||GRAM.found[i])return;const it=GRAM.cur,t=it.t[i],b=document.getElementById("gramT"+i),K=GRAM_K[it.ask];
 speakES(t.w);
 if(t.k===it.ask){GRAM.found[i]=1;b.style.background=K.col;b.style.borderColor=K.col;b.style.color="#fff";sOK();
  const left=GRAM.want-Object.keys(GRAM.found).length;const l=document.getElementById("gramLeft");if(l)l.textContent=left?"Te faltan "+left:"¡Todos!";
  if(left===0){gramFb("✅ ¡Los encontraste!",true);gramAnswered(GRAM.errs===0,1700);}}
 else{GRAM.errs++;b.style.background="#FCA5A5";sNO();gramFb(t.k?"«"+t.w+"» es "+(t.k==="v"?"un verbo":t.k==="a"?"un adjetivo":"un sustantivo")+", pero buscamos "+(it.ask==="v"?"el verbo":it.ask==="a"?"los adjetivos":"los sustantivos")+" 🤔":"Esa palabra no es la que buscamos 🤔",false);setTimeout(function(){if(b&&!GRAM.found[i])b.style.background="#fff";},600);}}

/* ---------- 🧩 completa la oración / 🖼️ imagen y palabra ---------- */
function gramFill(it){
 GRAM.cur=it;GRAM.opts=shuffled([it.ok].concat(it.bad));
 const K=GRAM_K[it.k];
 render(topbar("screenGrammar()")+gramHeader()
  +(it.e?'<div class="card center" style="padding:8px"><div style="font-size:4.2rem">'+it.e+'</div></div>':'')
  +'<div class="card center" style="font-size:1.35rem;font-family:Fredoka;font-weight:600;line-height:1.5">'+esc(it.s).replace("___",'<span style="display:inline-block;min-width:3ch;border-bottom:4px solid '+K.col+'">&nbsp;</span>')+'</div>'
  +'<p class="center" style="margin:4px 0"><b>Busca '+(it.k==="n"?"un":"un")+' <span style="color:'+K.col+'">'+K.nm.toUpperCase()+'</span> que complete la oración</b></p>'
  +GRAM.opts.map(function(o,i){return '<button class="kbtn white" id="gramO'+i+'" style="min-height:56px;font-size:1.3rem" onclick="gramFillAns('+i+')">'+o+'</button>';}).join("")+'<div id="gramFb"></div>');
 speakES(it.s.replace("___","…"));}
function gramFillAns(i){
 if(GRAM.done)return;const it=GRAM.cur,o=GRAM.opts[i],b=document.getElementById("gramO"+i);speakES(o);
 if(o===it.ok){b.style.background="#86EFAC";gramFb("✅ "+it.s.replace("___",it.ok),true);setTimeout(function(){speakES(it.s.replace("___",it.ok));},400);gramAnswered(!GRAM.tried,2600);}
 else{GRAM.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();gramFb("Esa palabra no encaja 🤔 Lee la oración y piensa qué falta.",false);}}
