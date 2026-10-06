"use strict";
/* ============ PALABRAS AVANZADAS (2.º de primaria) ============
   Sílaba tónica · sinónimos y antónimos (parejas en canastas 3D, reusa grammar3d.js) ·
   MP / MB (antes de p y b va m) · R / RR. Cada palabra se lee en voz alta, con dibujo (emoji).
   Los gemelos en inglés (same/opposite y sílaba fuerte) están en js/english-play.js.
   Prefijo w2 / W2. */

/* [palabra, emoji, "sí-la-bas", índice de la sílaba tónica (0 = primera)] */
const W2_TON=[
 ["gato","🐱","ga-to",0],["casa","🏠","ca-sa",0],["luna","🌙","lu-na",0],["árbol","🌳","ár-bol",0],["lápiz","✏️","lá-piz",0],
 ["pelota","⚽","pe-lo-ta",1],["mochila","🎒","mo-chi-la",1],["tortuga","🐢","tor-tu-ga",1],["naranja","🍊","na-ran-ja",1],["zapato","👟","za-pa-to",1],
 ["jirafa","🦒","ji-ra-fa",1],["ballena","🐳","ba-lle-na",1],["ventana","🪟","ven-ta-na",1],["tijera","✂️","ti-je-ra",1],["cohete","🚀","co-he-te",1],
 ["guitarra","🎸","gui-ta-rra",1],["campana","🔔","cam-pa-na",1],["sombrero","🎩","som-bre-ro",1],["planeta","🪐","pla-ne-ta",1],["pirata","🏴‍☠️","pi-ra-ta",1],
 ["canguro","🦘","can-gu-ro",1],["ratón","🐭","ra-tón",1],["avión","✈️","a-vión",1],["reloj","⌚","re-loj",1],["volcán","🌋","vol-cán",1],["papel","📄","pa-pel",1],
 ["teléfono","📞","te-lé-fo-no",1],["murciélago","🦇","mur-cié-la-go",1],["mariposa","🦋","ma-ri-po-sa",2],["elefante","🐘","e-le-fan-te",2],
 ["bicicleta","🚲","bi-ci-cle-ta",2],["chocolate","🍫","cho-co-la-te",2],["camiseta","👕","ca-mi-se-ta",2],["cocodrilo","🐊","co-co-dri-lo",2],
 ["zanahoria","🥕","za-na-ho-ria",2],["escalera","🪜","es-ca-le-ra",2],["unicornio","🦄","u-ni-cor-nio",2],["dinosaurio","🦖","di-no-sau-rio",2],
 ["astronauta","👨‍🚀","as-tro-nau-ta",2],["hipopótamo","🦛","hi-po-pó-ta-mo",2],["helicóptero","🚁","he-li-cóp-te-ro",2],["computadora","💻","com-pu-ta-do-ra",3]];
/* palabra → [sinónimo|null, antónimo|null] */
const W2_SA=[
 ["grande","enorme","pequeño"],["pequeño","chiquito","grande"],["feliz","contento","triste"],["triste","apenado","alegre"],["rápido","veloz","lento"],["lento","pausado","rápido"],
 ["bonito","hermoso","feo"],["alto","elevado","bajo"],["caliente","cálido","frío"],["frío","helado","caliente"],["fuerte","poderoso","débil"],["fácil","sencillo","difícil"],
 ["difícil","complicado","fácil"],["limpio","aseado","sucio"],["viejo","antiguo","nuevo"],["nuevo","reciente","viejo"],["empezar","comenzar","terminar"],["hablar","conversar","callar"],
 ["mucho",null,"poco"],["subir",null,"bajar"],["abrir",null,"cerrar"],["día",null,"noche"],["dentro",null,"fuera"],["luz",null,"oscuridad"],["amigo","compañero","enemigo"],["comprar",null,"vender"]];
/* [palabra con hueco, letra correcta, emoji, palabra]: antes de P y B se escribe M */
const W2_MPMB=[
 ["ca_po","m","🏕️","campo"],["lá_para","m","💡","lámpara"],["tie_po","m","⏳","tiempo"],["ho_bre","m","👨","hombre"],["bo_bero","m","🚒","bombero"],["no_bre","m","🏷️","nombre"],
 ["a_bulancia","m","🚑","ambulancia"],["cu_pleaños","m","🎂","cumpleaños"],["ro_pecabezas","m","🧩","rompecabezas"],["so_bra","m","🌑","sombra"],["bo_billa","m","💡","bombilla"],
 ["tra_polín","m","🤸","trampolín"],["li_pio","m","🧼","limpio"],["ha_bre","m","🍽️","hambre"],["ta_bor","m","🥁","tambor"],["co_prar","m","🛒","comprar"],
 ["i_vierno","n","❄️","invierno"],["e_fermo","n","🤒","enfermo"],["co_ejo","n","🐰","conejo"],["ci_co","n","5️⃣","cinco"],["pa_talón","n","👖","pantalón"],
 ["ca_ción","n","🎵","canción"],["mo_taña","n","⛰️","montaña"],["ma_zana","n","🍎","manzana"],["u_icornio","n","🦄","unicornio"]];
/* R suave entre vocales · RR fuerte entre vocales · R fuerte al inicio (se escribe una sola r) */
const W2_RR=[
 ["pe_o","rr","🐶","perro"],["ca_o","rr","🚗","carro"],["to_e","rr","🗼","torre"],["guita_a","rr","🎸","guitarra"],["tie_a","rr","🌍","tierra"],["ce_o","rr","⛰️","cerro"],
 ["zo_o","rr","🦊","zorro"],["ba_o","rr","🟤","barro"],["fe_ocarril","rr","🚂","ferrocarril"],
 ["pe_a","r","🍐","pera"],["_ana","r","🐸","rana"],["to_o","r","🐂","toro"],["lo_o","r","🦜","loro"],["_atón","r","🐭","ratón"],["_egalo","r","🎁","regalo"],
 ["_eloj","r","⌚","reloj"],["_osa","r","🌹","rosa"],["tije_a","r","✂️","tijera"],["ma_iposa","r","🦋","mariposa"],["co_ona","r","👑","corona"]];
const W2_ACTS=[
 {id:"tonica",ic:"🥁",nm:"La sílaba tónica",sub:"¿Cuál suena más fuerte?",cls:"red"},
 {id:"parejas",ic:"🔁",nm:"Sinónimos y antónimos 3D",sub:"¿Se parecen o son contrarias?",cls:"blue"},
 {id:"pareja",ic:"🧲",nm:"¿Cuál es su pareja?",sub:"Busca el sinónimo o el antónimo",cls:"green"},
 {id:"mpmb",ic:"✍️",nm:"MP y MB",sub:"Antes de p y b va M",cls:"yellow"},
 {id:"rr",ic:"🐶",nm:"R y RR",sub:"perro, pera, rana…",cls:"purple"}];
const W2_WIN={noWorld:true,replay:"screenWords2()",replayLabel:"Más palabras 🔤",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
const W2_BINS=[{k:"s",nm:"SINÓNIMOS",sub:"significan lo mismo",col:"#0EA5E9",dark:"#0369A1"},{k:"a",nm:"ANTÓNIMOS",sub:"son contrarias",col:"#F97316",dark:"#C2410C"}];
let W2={};

function w2Cleanup(){if(W2.timer)clearTimeout(W2.timer);W2.timer=null;W2={};}
function w2Later(fn,ms){if(W2.timer)clearTimeout(W2.timer);const k=W2.kind;W2.timer=setTimeout(function(){if(W2.kind===k)fn();},ms);}
function w2Fb(h,ok){const f=document.getElementById("w2Fb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function w2Header(){const a=W2_ACTS.find(function(x){return x.id===W2.kind;});return '<div class="progressdots">'+dots(W2.total,W2.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function w2Answered(first,delay){
 if(first)W2.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 W2.done=true;W2.i++;w2Later(w2Next,delay||1800);}
function w2Finish(){const stars=starsFor(W2.ok,Math.max(1,W2.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",W2_WIN);}
function w2Card(e,txt,big){return '<div class="card center" style="padding:10px"><div style="font-size:'+(big||4)+'rem;line-height:1.1">'+e+'</div>'+(txt?'<div style="font-family:Fredoka;font-weight:700;font-size:1.5rem;margin-top:4px">'+txt+'</div>':'')+'</div>';}

/* ---------- menú ---------- */
function screenWords2(){setTheme("kid");
 w2Cleanup();
 const cards=W2_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="w2Start(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")+subHeader("🔤 Palabras avanzadas")
  +'<p class="center" style="margin:-4px 0 10px">Sílaba tónica, sinónimos, antónimos y ortografía: ¡para segundo grado!</p>'+cards
  +(typeof screenAccent==="function"?'<button class="kbtn red" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="screenAccent()"><span style="font-size:clamp(2rem,9vw,2.6rem)">🥁</span><span style="flex:1"><span>Agudas, llanas y esdrújulas</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Cuenta desde el final y aprende cuándo lleva tilde</span></span></button>':""));}

/* ---------- motor ---------- */
function w2Start(kind){
 w2Cleanup();W2={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const take=function(arr,n){return shuffled(arr).slice(0,n);};
 const bank={
  tonica:function(){return take(W2_TON,6);},
  parejas:function(){return[0,1];},
  pareja:function(){return take(W2_SA,6).map(function(r){const canSyn=!!r[1],isSyn=canSyn&&Math.random()<.5;return{w:r[0],syn:isSyn,ans:isSyn?r[1]:r[2]};});},
  mpmb:function(){return take(W2_MPMB.filter(function(x){return x[1]==="m";}),4).concat(take(W2_MPMB.filter(function(x){return x[1]==="n";}),2)).sort(function(){return Math.random()-.5;});},
  rr:function(){return take(W2_RR.filter(function(x){return x[1]==="rr";}),3).concat(take(W2_RR.filter(function(x){return x[1]==="r";}),3)).sort(function(){return Math.random()-.5;});}};
 W2.items=bank[kind]();
 if(kind==="parejas"){W2.total=12;W2.round=0;}else W2.total=W2.items.length;
 w2Next();}
function w2Next(){
 if(W2.i>=W2.total&&W2.kind!=="parejas")return w2Finish();
 W2.tried=false;W2.done=false;
 const k=W2.kind,it=W2.items[W2.i];
 if(k==="tonica")return w2Ton(it);
 if(k==="parejas")return w2Parejas();
 if(k==="pareja")return w2Pareja(it);
 if(k==="mpmb")return w2Gap(it,"m","n","m: antes de P y B siempre va M");
 if(k==="rr")return w2Gap(it,"r","rr","");}

/* ---------- 🥁 sílaba tónica ---------- */
function w2Ton(it){
 const p=it[2].split("-");W2.cur=it;
 render(topbar("screenWords2()")+w2Header()+w2Card(it[1],"",4)
  +'<button class="speaker small" onclick="speakES(W2.cur[0])">🔊 Escucha la palabra</button>'
  +'<p class="center" style="margin:6px 0"><b>🥁 Dila despacio y golpea la mesa en cada sílaba. ¿Cuál suena MÁS FUERTE?</b></p>'
  +'<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:8px">'+p.map(function(s,i){return '<button id="w2S'+i+'" onclick="w2TonAns('+i+')" style="min-width:64px;padding:12px 14px;border-radius:14px;border:3px solid #CBD5E1;background:#fff;font-family:Fredoka;font-weight:700;font-size:1.6rem;text-transform:uppercase;cursor:pointer">'+s+'</button>';}).join("")+'</div><div id="w2Fb"></div>');
 speakES(it[0]);}
function w2TonAns(i){
 if(W2.done)return;const it=W2.cur,b=document.getElementById("w2S"+i);
 if(i===it[3]){b.style.background="#EF4444";b.style.borderColor="#B91C1C";b.style.color="#fff";b.style.fontSize="2rem";w2Fb("✅ "+it[2].split("-").map(function(s,k){return k===it[3]?s.toUpperCase():s;}).join(" · ")+" — la tónica es la "+["primera","segunda","tercera","cuarta"][it[3]],true);speakES(it[0]);w2Answered(!W2.tried,2600);}
 else{W2.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();w2Fb("Casi… 🤔 Repite la palabra y fíjate dónde la voz golpea más fuerte.",false);}}

/* ---------- 🔁 parejas 3D (sinónimos / antónimos) ---------- */
function w2Parejas(){
 const entries=shuffled(W2_SA),words=[];
 const withSyn=entries.filter(function(r){return r[1];});
 shuffled(withSyn).slice(0,3).forEach(function(r){words.push({w:r[0]+" · "+r[1],k:"s"});});
 const used={};words.forEach(function(x){used[x.w.split(" · ")[0]]=1;});
 entries.filter(function(r){return !used[r[0]]&&r[2];}).slice(0,3).forEach(function(r){words.push({w:r[0]+" · "+r[2],k:"a"});});
 W2.tries={};
 render(topbar("screenWords2()")+'<div class="progressdots">'+dots(2,W2.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🔁 Sinónimos y antónimos 3D</p>'
  +'<div class="card" style="padding:8px 12px"><b>Toca una pareja de palabras y llévala a su canasta</b><br><span class="mut" style="font-size:.82rem">🔵 sinónimos: significan lo mismo (grande · enorme) · 🟠 antónimos: son contrarias (grande · pequeño)</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="w2Canvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="w2Fb"></div>');
 W2.c3=renderWordSorter("w2Canvas",shuffled(words),function(ev,info){
  if(ev==="select"){speakES(info.w.replace(" · "," y "));}
  else if(ev==="ok"){const first=!W2.tries[info.w];if(first)W2.ok++;recordAnswer("Lenguaje",first,8);W2.i++;sOK();confetti(4);w2Fb("✅ "+info.w+(info.k==="s"?" · significan lo mismo":" · son contrarias"),true);}
  else if(ev==="wrong"){W2.tries[info.w]=1;sNO();w2Fb("🤔 «"+info.w+"» "+(info.right==="s"?"significan casi lo mismo":"son contrarias")+". ¡Prueba la otra canasta!",false);}
  else if(ev==="done"){W2.round++;if(W2.round>=2){w2Fb("🎉 ¡Todas las parejas!",true);w2Later(w2Finish,1200);}else{w2Fb("🎉 ¡Muy bien! Otra ronda…",true);w2Later(w2Parejas,1300);}}},W2_BINS);}

/* ---------- 🧲 ¿cuál es su pareja? ---------- */
function w2Pareja(it){
 const others=[];W2_SA.forEach(function(r){if(r[0]!==it.w){[r[1],r[2]].forEach(function(x){if(x&&x!==it.ans&&others.indexOf(x)<0)others.push(x);});}});
 /* el antónimo de la palabra no puede ser señuelo cuando se pide sinónimo (y al revés) */
 const row=W2_SA.find(function(r){return r[0]===it.w;});
 const forbid=[row[1],row[2]];
 W2.cur=it;W2.opts=shuffled([it.ans].concat(shuffled(others.filter(function(x){return forbid.indexOf(x)<0;})).slice(0,2)));
 render(topbar("screenWords2()")+w2Header()
  +'<div class="card center" style="padding:12px"><div style="font-family:Fredoka;font-weight:700;font-size:1.8rem">'+it.w.toUpperCase()+'</div><button class="speaker small" style="margin-top:6px" onclick="speakES(W2.cur.w)">🔊</button></div>'
  +'<p class="center" style="margin:6px 0"><b>'+(it.syn?'Busca una palabra que signifique <span style="color:#0EA5E9">LO MISMO</span>':'Busca la palabra <span style="color:#F97316">CONTRARIA</span>')+'</b></p>'
  +W2.opts.map(function(o,i){return '<button class="kbtn white" id="w2O'+i+'" style="min-height:56px;font-size:1.35rem" onclick="w2ParejaAns('+i+')">'+o+'</button>';}).join("")+'<div id="w2Fb"></div>');
 speakES(it.w);}
function w2ParejaAns(i){
 if(W2.done)return;const it=W2.cur,o=W2.opts[i],b=document.getElementById("w2O"+i);speakES(o);
 if(o===it.ans){b.style.background="#86EFAC";w2Fb("✅ "+it.w+(it.syn?" = ":" ↔ ")+o,true);w2Answered(!W2.tried,2300);}
 else{W2.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();w2Fb("Casi… 🤔 "+(it.syn?"Piensa en una palabra que quiera decir lo mismo.":"Piensa en lo opuesto."),false);}}

/* ---------- ✍️ MP/MB y 🐶 R/RR: completa la letra ---------- */
function w2Gap(it,a,b,rule){
 const word=it[0],fixed=word.replace("_",'<span style="display:inline-block;min-width:1.6ch;border-bottom:4px solid #3B82F6">&nbsp;</span>');
 W2.cur=it;W2.opts=shuffled([a,b]);W2.rule=rule;
 render(topbar("screenWords2()")+w2Header()+w2Card(it[2],'<span style="text-transform:uppercase;letter-spacing:2px">'+fixed+'</span>',4)
  +'<button class="speaker small" onclick="speakES(W2.cur[3])">🔊 Escucha la palabra</button>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px">'+W2.opts.map(function(o,i){return '<button class="kbtn white" id="w2O'+i+'" style="margin:0;min-height:64px;font-size:1.8rem;text-transform:uppercase" onclick="w2GapAns('+i+')">'+o+'</button>';}).join("")+'</div><div id="w2Fb"></div>');
 speakES(it[3]);}
function w2GapAns(i){
 if(W2.done)return;const it=W2.cur,o=W2.opts[i],b=document.getElementById("w2O"+i);
 if(o===it[1]){b.style.background="#86EFAC";
  const kind=W2.kind==="mpmb"?(it[1]==="m"?"Antes de P y B va M.":"Aquí no hay P ni B: va N."):(it[1]==="rr"?"Entre vocales, el sonido fuerte se escribe RR.":(it[3].charAt(0)==="r"?"Al principio suena fuerte, pero se escribe una sola R.":"Entre vocales, el sonido suave se escribe R."));
  w2Fb("✅ "+it[3]+" · "+kind,true);setTimeout(function(){speakES(it[3]);},350);w2Answered(!W2.tried,2900);}
 else{W2.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();w2Fb("Casi… 🤔 "+(W2.kind==="mpmb"?"Mira la letra que viene después: ¿es p o b?":"¿Suena fuerte o suave? ¿Está entre vocales?"),false);}}
