"use strict";
/* ============ SUSTANTIVOS PROPIOS Y COMUNES (2.º de primaria) ============
   Propio = el nombre ESPECIAL de una persona, animal o lugar concreto (Ana, Rocky, Colombia): lleva
   mayúscula inicial. Común = nombra a todos los de su clase (niña, perro, país): minúscula.
   Truco de la lección: en español los días y los meses son comunes (lunes, enero), ¡no llevan mayúscula!
   (en inglés sí: Monday, July — eso se practica en English Playground).
   En las canastas 3D las palabras salen en MAYÚSCULAS para que el niño no se guíe por la letra inicial.
   Actividades: canastas 3D, del común al propio, ¿mayúscula o minúscula? y detective de oraciones.
   Prefijo spc / SPC. */

const SPC_P=["Ana","Mateo","Sofía","Simón","Valentina","Rocky","Pelusa","Toby","Colombia","México","España","Perú","Bogotá","Medellín","Cali","Cartagena","Amazonas","Magdalena","Orinoco","Caribe","Pacífico","América","Marte","Júpiter","Neptuno","Everest","Galeras"];
const SPC_C=["niña","niño","perro","gato","país","ciudad","río","mar","montaña","volcán","planeta","escuela","maestra","pájaro","parque","calle","casa","libro","mascota","océano","continente","familia","doctor","amigo"];
const SPC_CT=["lunes","martes","sábado","enero","marzo","julio"]; /* días y meses: comunes en español */
/* [común, emoji, [propios de ese tipo]] */
const SPC_PAIRS=[["niña","👧",["Sofía","Valentina","Camila"]],["niño","👦",["Mateo","Simón","Juan"]],["perro","🐶",["Rocky","Toby","Max"]],["gato","🐱",["Pelusa","Michi","Tom"]],
 ["país","🌎",["Colombia","México","Perú","España"]],["ciudad","🏙️",["Bogotá","Medellín","Cali","Cartagena"]],["río","🏞️",["Magdalena","Amazonas","Orinoco"]],
 ["océano","🌊",["Pacífico","Atlántico"]],["planeta","🪐",["Marte","Júpiter","Neptuno","Venus"]],["volcán","🌋",["Galeras","Cotopaxi"]],["continente","🗺️",["América","África","Asia","Europa"]]];
/* ¿mayúscula o minúscula? [frase con hueco, palabra bien escrita, por qué] */
const SPC_CAP=[
 ["Mi perro se llama ___.","Rocky","Es el nombre propio de un perro: mayúscula."],["Vivo en ___.","Colombia","Es el nombre propio de un país: mayúscula."],
 ["Mi amiga ___ es muy alegre.","Valentina","Es un nombre propio de persona: mayúscula."],["El ___ es un animal.","gato","Es un nombre común: minúscula."],
 ["Visité la ciudad de ___.","Medellín","Es el nombre propio de una ciudad: mayúscula."],["El río ___ es muy largo.","Amazonas","Es el nombre propio de un río: mayúscula."],
 ["Hoy es ___.","lunes","Los días de la semana son comunes: minúscula."],["Mi cumpleaños es en ___.","marzo","Los meses son comunes: minúscula."],
 ["La ___ me enseña a leer.","maestra","Es un nombre común: minúscula."],["Júpiter es un ___ gigante.","planeta","Es un nombre común: minúscula."],
 ["Mi gato se llama ___.","Pelusa","Es el nombre propio de un gato: mayúscula."],["Mi tío vive en ___.","Cali","Es el nombre propio de una ciudad: mayúscula."]];
/* detective: [palabra|p] propio · [palabra|c] común */
const SPC_SENT=[
 "[Sofía|p] vive en [Medellín|p] con su [perro|c] [Rocky|p].",
 "El [niño|c] [Mateo|p] juega en el [parque|c].",
 "La [maestra|c] [Ana|p] enseña en la [escuela|c].",
 "[Colombia|p] es un [país|c] con [montañas|c] y [ríos|c].",
 "Mi [gato|c] [Pelusa|p] duerme en la [casa|c].",
 "El [río|c] [Magdalena|p] pasa por [Girardot|p].",
 "[Marte|p] es un [planeta|c] rojo.",
 "Los [niños|c] viajaron a [Cartagena|p] en [avión|c]."];
const SPC_BINS=[{k:"p",nm:"PROPIO",sub:"nombre especial",col:"#EC4899",dark:"#BE185D"},{k:"c",nm:"COMÚN",sub:"nombra a todos",col:"#0EA5E9",dark:"#0369A1"}];
const SPC_ACTS=[
 {id:"canastas",ic:"🧺",nm:"Canastas 3D: propio o común",sub:"Lleva cada nombre a su canasta",cls:"blue"},
 {id:"pareja",ic:"🔗",nm:"Del común al propio",sub:"niña → ¿Sofía?  ciudad → ¿Bogotá?",cls:"green"},
 {id:"mayus",ic:"🔠",nm:"¿Mayúscula o minúscula?",sub:"Escribe bien el nombre",cls:"red"},
 {id:"detective",ic:"🔍",nm:"Detective de oraciones",sub:"Toca los nombres propios o comunes",cls:"yellow"}];
const SPC_WIN={noWorld:true,replay:"screenNouns()",replayLabel:"Más sustantivos 🏷️",backFn:"screenGrammar()",backLabel:"Gramática 🏷️"};
let SPC={};

function spcParse(s){
 const out=[];let last=0,m;const re=/\[([^|\]]+)\|([pc])\]/g;
 const push=function(t){t.split(/(\s+)/).forEach(function(x){if(x&&!/^\s+$/.test(x))out.push({w:x,k:null});});};
 while((m=re.exec(s))){if(m.index>last)push(s.slice(last,m.index));out.push({w:m[1],k:m[2]});last=re.lastIndex;}
 if(last<s.length)push(s.slice(last));
 return out;}
function spcPlain(t){return t.map(function(x){return x.w;}).join(" ").replace(/\s+([.,;!?])/g,"$1");}
function spcCleanup(){if(SPC.timer)clearTimeout(SPC.timer);SPC.timer=null;SPC={};}
function spcLater(fn,ms){if(SPC.timer)clearTimeout(SPC.timer);const k=SPC.kind;SPC.timer=setTimeout(function(){if(SPC.kind===k)fn();},ms);}
function spcFb(h,ok){const f=document.getElementById("spcFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function spcHeader(){const a=SPC_ACTS.find(function(x){return x.id===SPC.kind;});return '<div class="progressdots">'+dots(SPC.total,SPC.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function spcAnswered(first,delay){
 if(first)SPC.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 SPC.done=true;SPC.i++;spcLater(spcNext,delay||2000);}
function spcFinish(){const stars=starsFor(SPC.ok,Math.max(1,SPC.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",SPC_WIN);}

/* ---------- menú y lección ---------- */
function screenNouns(){setTheme("kid");
 spcCleanup();
 const cards=SPC_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="spcStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenGrammar()")+subHeader("🏷️ Sustantivos propios y comunes")
  +'<p class="center" style="margin:-4px 0 10px">Nombres especiales y nombres de todos</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="spcLesson()"><span style="font-size:2.4rem">📘</span><span style="flex:1"><span>Mini lección</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Empieza aquí: propio y común con ejemplos</span></span></button>'+cards);}
function spcLesson(){setTheme("kid");
 spcCleanup();
 const chip=function(t,col){return '<button onclick="speakES(\''+t+'\')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid '+col+';background:#fff;color:'+col+';font-weight:800;font-size:1rem;cursor:pointer">🔊 '+t+'</button>';};
 render(topbar("screenNouns()")+subHeader("📘 Propios y comunes")
  +'<div class="card" style="border:3px solid #0EA5E9;background:#E0F2FE"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2.2rem">🐶</span><div><b style="color:#0369A1;font-size:1.25rem">Sustantivo COMÚN</b><br><span style="font-size:.9rem">Nombra a <b>todos</b> los de su clase. Se escribe con <b>minúscula</b>.</span></div></div><div style="margin-top:6px">'+["perro","niña","ciudad","río","país"].map(function(t){return chip(t,"#0EA5E9");}).join("")+'</div></div>'
  +'<div class="card" style="border:3px solid #EC4899;background:#FCE7F3"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2.2rem">⭐</span><div><b style="color:#BE185D;font-size:1.25rem">Sustantivo PROPIO</b><br><span style="font-size:.9rem">Es el nombre <b>especial</b> de uno solo. Se escribe con <b>MAYÚSCULA</b>.</span></div></div><div style="margin-top:6px">'+["Rocky","Sofía","Colombia","Bogotá","Marte"].map(function(t){return chip(t,"#EC4899");}).join("")+'</div></div>'
  +'<div class="card"><b>🔗 Ejemplos de pareja</b><div style="line-height:2;margin-top:4px;font-size:1.05rem"><span style="color:#0369A1;font-weight:700">niña</span> → <span style="color:#BE185D;font-weight:700">Sofía</span><br><span style="color:#0369A1;font-weight:700">perro</span> → <span style="color:#BE185D;font-weight:700">Rocky</span><br><span style="color:#0369A1;font-weight:700">país</span> → <span style="color:#BE185D;font-weight:700">Colombia</span><br><span style="color:#0369A1;font-weight:700">ciudad</span> → <span style="color:#BE185D;font-weight:700">Bogotá</span></div></div>'
  +'<div class="card" style="background:#FEF9C3"><b>⚠️ ¡Ojo!</b><p style="margin:4px 0 0;line-height:1.5;font-size:.95rem">En español los <b>días</b> y los <b>meses</b> son sustantivos comunes: se escriben con minúscula (<i>lunes, marzo</i>). En inglés sí llevan mayúscula (<i>Monday, March</i>).</p></div>'
  +'<button class="kbtn green" onclick="spcStart(\'canastas\')">🧺 ¡A practicar!</button><button class="kbtn white" onclick="screenNouns()">← Volver</button>');}

/* ---------- motor ---------- */
function spcStart(kind){
 spcCleanup();SPC={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const take=function(arr,n){return shuffled(arr).slice(0,n);};
 const bank={
  canastas:function(){return[0,1];},
  pareja:function(){return take(SPC_PAIRS,6).map(function(r){
   const good=pick(r[2]);
   const common=pick(SPC_C.filter(function(c){return c!==r[0];}));
   const other=pick(SPC_PAIRS.filter(function(q){return q!==r;}).reduce(function(a,q){return a.concat(q[2]);},[]).filter(function(x){return r[2].indexOf(x)<0;}));
   return{c:r[0],e:r[1],good:good,opts:shuffled([good,common,other])};});},
  mayus:function(){return take(SPC_CAP,6).map(function(r){return{s:r[0],ok:r[1],why:r[2],opts:shuffled([r[1],r[1].charAt(0)===r[1].charAt(0).toUpperCase()?r[1].toLowerCase():r[1].charAt(0).toUpperCase()+r[1].slice(1)])};});},
  detective:function(){return take(SPC_SENT,6).map(function(s,i){return{t:spcParse(s),ask:["p","c","p","c","p","c"][i]};});}};
 SPC.items=bank[kind]();
 if(kind==="canastas"){SPC.total=12;SPC.round=0;}else SPC.total=SPC.items.length;
 spcNext();}
function spcNext(){
 if(SPC.i>=SPC.total&&SPC.kind!=="canastas")return spcFinish();
 SPC.tried=false;SPC.done=false;
 const k=SPC.kind,it=SPC.items[SPC.i];
 if(k==="canastas")return spcCanastas();
 if(k==="pareja")return spcPareja(it);
 if(k==="mayus")return spcMayus(it);
 if(k==="detective")return spcDetective(it);}

/* ---------- 🧺 canastas 3D (palabras en MAYÚSCULAS) ---------- */
function spcCanastas(){
 const props=shuffled(SPC_P).slice(0,3).map(function(w){return{w:w,k:"p"};});let coms=shuffled(SPC_C).slice(0,3).map(function(w){return{w:w,k:"c"};});
 let tr=[];if(Math.random()<.5){tr=[{w:pick(SPC_CT),k:"c"}];coms=coms.slice(0,2);}
 const list=shuffled(props.concat(coms,tr));
 SPC.orig={};list.forEach(function(x){SPC.orig[x.w.toUpperCase()]=x.w;});
 SPC.tries={};
 render(topbar("screenNouns()")+'<div class="progressdots">'+dots(2,SPC.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🧺 Propio o común</p>'
  +'<div class="card" style="padding:8px 12px"><b>Las palabras vienen en MAYÚSCULAS: ¡piensa qué nombran!</b><br><span class="mut" style="font-size:.82rem">🩷 propio = nombre especial de uno solo · 🩵 común = nombre de todos los de su clase</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="spcCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="spcFb"></div>');
 SPC.c3=renderWordSorter("spcCanvas",list.map(function(x){return{w:x.w.toUpperCase(),k:x.k};}),function(ev,info){
  const o=SPC.orig[info.w]||info.w;
  if(ev==="select"){speakES(o);}
  else if(ev==="ok"){const first=!SPC.tries[info.w];if(first)SPC.ok++;recordAnswer("Lenguaje",first,8);SPC.i++;sOK();confetti(4);
   spcFb("✅ "+(info.k==="p"?"<b>"+esc(o)+"</b> es propio: se escribe con mayúscula.":(SPC_CT.indexOf(o)>=0?"<b>"+esc(o)+"</b> es común (los días y meses van con minúscula).":"<b>"+esc(o)+"</b> es común: se escribe con minúscula.")),true);}
  else if(ev==="wrong"){SPC.tries[info.w]=1;sNO();spcFb("🤔 ¿"+esc(o)+" es el nombre especial de uno solo, o de todos los de su clase?",false);}
  else if(ev==="done"){SPC.round++;if(SPC.round>=2){spcFb("🎉 ¡Todos en su canasta!",true);spcLater(spcFinish,1200);}else{spcFb("🎉 ¡Muy bien! Otra ronda…",true);spcLater(spcCanastas,1300);}}},SPC_BINS);}

/* ---------- 🔗 del común al propio ---------- */
function spcPareja(it){
 SPC.cur=it;
 render(topbar("screenNouns()")+spcHeader()
  +'<div class="card center" style="padding:10px"><div style="font-size:3.8rem">'+it.e+'</div><div style="font-family:Fredoka;font-weight:700;font-size:1.5rem">'+it.c+'</div><div class="mut" style="font-size:.85rem">(nombre común)</div></div>'
  +'<p class="center" style="margin:6px 0"><b>¿Cuál es un nombre <span style="color:#BE185D">PROPIO</span> de un/una '+it.c+'?</b></p>'
  +it.opts.map(function(o,i){return '<button class="kbtn white" id="spcO'+i+'" style="min-height:56px;font-size:1.4rem" onclick="spcParejaAns('+i+')">'+o+'</button>';}).join("")+'<div id="spcFb"></div>');
 speakES(it.c);}
function spcParejaAns(i){
 if(SPC.done)return;const it=SPC.cur,o=it.opts[i],b=document.getElementById("spcO"+i);speakES(o);
 if(o===it.good){b.style.background="#86EFAC";spcFb("✅ "+it.c+" → <b>"+o+"</b> (propio: mayúscula)",true);spcAnswered(!SPC.tried,2200);}
 else{SPC.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();spcFb(SPC_C.indexOf(o)>=0?"«"+o+"» es común, no es el nombre especial de uno solo 🤔":"«"+o+"» es propio, pero no es de un/una "+it.c+" 🤔",false);}}

/* ---------- 🔠 ¿mayúscula o minúscula? ---------- */
function spcMayus(it){
 SPC.cur=it;
 render(topbar("screenNouns()")+spcHeader()
  +'<div class="card center" style="font-size:1.35rem;font-family:Fredoka;font-weight:600;line-height:1.6">'+esc(it.s).replace("___",'<span style="display:inline-block;min-width:4ch;border-bottom:4px solid #6366F1">&nbsp;</span>')+'</div>'
  +'<p class="center" style="margin:6px 0"><b>¿Cómo se escribe?</b></p>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+it.opts.map(function(o,i){return '<button class="kbtn white" id="spcO'+i+'" style="margin:0;min-height:62px;font-size:1.5rem" onclick="spcMayusAns('+i+')">'+o+'</button>';}).join("")+'</div><div id="spcFb"></div>');
 speakES(it.s.replace("___","…"));}
function spcMayusAns(i){
 if(SPC.done)return;const it=SPC.cur,o=SPC.cur.opts[i],b=document.getElementById("spcO"+i);
 if(o===it.ok){b.style.background="#86EFAC";const full=it.s.replace("___",it.ok);spcFb("✅ "+esc(full)+" · "+it.why,true);setTimeout(function(){speakES(full);},350);spcAnswered(!SPC.tried,3200);}
 else{SPC.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();spcFb("Casi… 🤔 ¿Es el nombre especial de uno solo o el nombre de todos?",false);}}

/* ---------- 🔍 detective ---------- */
function spcDetective(it){
 SPC.cur=it;SPC.found={};SPC.errs=0;SPC.want=it.t.filter(function(t){return t.k===it.ask;}).length;
 const lab=it.ask==="p"?"los sustantivos PROPIOS":"los sustantivos COMUNES",col=it.ask==="p"?"#BE185D":"#0369A1",bg=it.ask==="p"?"#FCE7F3":"#E0F2FE";
 render(topbar("screenNouns()")+spcHeader()
  +'<div class="card center" style="background:'+bg+';border:3px solid '+col+'"><b style="font-size:1.1rem;color:'+col+'">Toca '+lab+'</b><br><span id="spcLeft" class="mut" style="font-size:.85rem">Hay '+SPC.want+'</span></div>'
  +'<div class="card" style="line-height:2.4;text-align:center">'+it.t.map(function(t,i){return '<button id="spcT'+i+'" onclick="spcTap('+i+')" style="margin:3px;padding:6px 12px;border-radius:12px;border:3px solid #CBD5E1;background:#fff;font-family:Fredoka;font-weight:600;font-size:1.15rem;cursor:pointer">'+esc(t.w)+'</button>';}).join("")+'</div>'
  +'<button class="speaker small" onclick="speakES(spcPlain(SPC.cur.t))">🔊 Escucha la oración</button><div id="spcFb"></div>');
 speakES(spcPlain(it.t));}
function spcTap(i){
 if(SPC.done||SPC.found[i])return;const it=SPC.cur,t=it.t[i],b=document.getElementById("spcT"+i);speakES(t.w);
 if(t.k===it.ask){SPC.found[i]=1;b.style.background=it.ask==="p"?"#EC4899":"#0EA5E9";b.style.borderColor=b.style.background;b.style.color="#fff";sOK();
  const left=SPC.want-Object.keys(SPC.found).length;const l=document.getElementById("spcLeft");if(l)l.textContent=left?"Te faltan "+left:"¡Todos!";
  if(left===0){spcFb("✅ ¡Los encontraste todos!",true);spcAnswered(SPC.errs===0,1800);}}
 else{SPC.errs++;b.style.background="#FCA5A5";sNO();spcFb(t.k?"«"+esc(t.w)+"» es "+(t.k==="p"?"propio":"común")+", pero buscamos "+(it.ask==="p"?"propios":"comunes")+" 🤔":"Esa palabra no es un sustantivo de los que buscamos 🤔",false);setTimeout(function(){if(b&&!SPC.found[i])b.style.background="#fff";},600);}}
