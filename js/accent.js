"use strict";
/* ============ AGUDAS, LLANAS Y ESDRÚJULAS (y cuándo lleva tilde) ============
   Continúa "la sílaba tónica": se cuenta desde el FINAL de la palabra.
     1.ª sílaba desde el final es la fuerte → AGUDA   (ca-FÉ, can-CIÓN)
     2.ª desde el final                    → LLANA    (CA-sa, LÁ-piz)
     3.ª desde el final                    → ESDRÚJULA (te-LÉ-fo-no)
   Tilde (versión sencilla): aguda → lleva si termina en n, s o vocal · llana → lleva si NO termina en
   n, s o vocal · esdrújula → SIEMPRE. Actividades: canastas 3D, cuenta desde el final, ¿lleva tilde?
   (la clase y la tilde de cada palabra se verifican contra estas reglas al cargar). Prefijo acc / ACC. */

/* [palabra como se escribe, emoji, "sí-la-bas", índice de la sílaba tónica] */
const ACC_W=[
 ["café","☕","ca-fé",1],["canción","🎵","can-ción",1],["camión","🚚","ca-mión",1],["jabón","🧼","ja-bón",1],["sofá","🛋️","so-fá",1],["bebé","👶","be-bé",1],["mamá","👩","ma-má",1],
 ["corazón","❤️","co-ra-zón",2],["pantalón","👖","pan-ta-lón",2],["reloj","⌚","re-loj",1],["ratón","🐭","ra-tón",1],["avión","✈️","a-vión",1],["volcán","🌋","vol-cán",1],
 ["papel","📄","pa-pel",1],["color","🎨","co-lor",1],["pared","🧱","pa-red",1],["ciudad","🏙️","ciu-dad",1],["tambor","🥁","tam-bor",1],["león","🦁","le-ón",1],["limón","🍋","li-món",1],
 ["melón","🍈","me-lón",1],["jamón","🍖","ja-món",1],["maní","🥜","ma-ní",1],["colibrí","🐦","co-li-brí",2],
 ["árbol","🌳","ár-bol",0],["lápiz","✏️","lá-piz",0],["azúcar","🍬","a-zú-car",1],["ángel","👼","án-gel",0],["dólar","💵","dó-lar",0],["móvil","📱","mó-vil",0],
 ["casa","🏠","ca-sa",0],["gato","🐱","ga-to",0],["luna","🌙","lu-na",0],["mariposa","🦋","ma-ri-po-sa",2],["elefante","🐘","e-le-fan-te",2],["pelota","⚽","pe-lo-ta",1],
 ["zapato","👟","za-pa-to",1],["naranja","🍊","na-ran-ja",1],["ventana","🪟","ven-ta-na",1],["tijera","✂️","ti-je-ra",1],["mochila","🎒","mo-chi-la",1],["tortuga","🐢","tor-tu-ga",1],
 ["ballena","🐳","ba-lle-na",1],["cohete","🚀","co-he-te",1],["guitarra","🎸","gui-ta-rra",1],["campana","🔔","cam-pa-na",1],["planeta","🪐","pla-ne-ta",1],["pirata","🏴‍☠️","pi-ra-ta",1],
 ["sombrero","🎩","som-bre-ro",1],["canguro","🦘","can-gu-ro",1],["examen","📝","e-xa-men",1],["joven","🧑","jo-ven",0],["lunes","📅","lu-nes",0],
 ["teléfono","📞","te-lé-fo-no",1],["murciélago","🦇","mur-cié-la-go",1],["hipopótamo","🦛","hi-po-pó-ta-mo",2],["helicóptero","🚁","he-li-cóp-te-ro",2],["pájaro","🐦","pá-ja-ro",0],
 ["música","🎶","mú-si-ca",0],["médico","🧑‍⚕️","mé-di-co",0],["lámpara","💡","lám-pa-ra",0],["plátano","🍌","plá-ta-no",0],["número","🔢","nú-me-ro",0],["círculo","⭕","cír-cu-lo",0],
 ["triángulo","🔺","trián-gu-lo",0],["sábado","📅","sá-ba-do",0],["cámara","📷","cá-ma-ra",0]];
const ACC_K={
 a:{k:"a",nm:"AGUDA",sub:"última",col:"#F97316",dark:"#C2410C",bg:"#FFEDD5",ex:"ca-FÉ"},
 l:{k:"l",nm:"LLANA",sub:"penúltima",col:"#22C55E",dark:"#15803D",bg:"#DCFCE7",ex:"CA-sa"},
 e:{k:"e",nm:"ESDRÚJULA",sub:"antepenúltima",col:"#8B5CF6",dark:"#5B21B6",bg:"#EDE9FE",ex:"te-LÉ-fo-no"}};
const ACC_BINS=[ACC_K.a,ACC_K.l,ACC_K.e];
const ACC_ACTS=[
 {id:"canastas",ic:"🧺",nm:"Canastas 3D: aguda, llana o esdrújula",sub:"Lleva cada palabra a su canasta",cls:"red"},
 {id:"cuenta",ic:"🔢",nm:"Cuenta desde el final",sub:"1.ª, 2.ª, 3.ª… ¿qué clase es?",cls:"green"},
 {id:"tilde",ic:"✏️",nm:"¿Lleva tilde?",sub:"Elige la palabra bien escrita",cls:"purple"}];
const ACC_WIN={noWorld:true,replay:"screenAccent()",replayLabel:"Más acentos 🔤",backFn:"screenWords2()",backLabel:"Palabras avanzadas 🔤"};
let ACC={};

/* clase y regla de la tilde de cada palabra */
function accClass(r){const n=r[2].split("-").length,pos=n-1-r[3];return pos===0?"a":pos===1?"l":"e";}
function accEnd(word){const c=word.charAt(word.length-1).toLowerCase();return /[aeiouáéíóúns]/.test(c);}
function accNorm(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"");}
function accHasTilde(w){return /[áéíóú]/.test(w);}
function accShould(r){const k=accClass(r),end=accEnd(r[0]);return k==="e"?true:k==="a"?end:!end;}
function accRule(r){
 const k=accClass(r),end=accEnd(r[0]);
 if(k==="e")return "Las esdrújulas SIEMPRE llevan tilde.";
 if(k==="a")return end?"Es aguda y termina en n, s o vocal: lleva tilde.":"Es aguda pero no termina en n, s ni vocal: no lleva tilde.";
 return end?"Es llana y termina en n, s o vocal: no lleva tilde.":"Es llana y NO termina en n, s ni vocal: lleva tilde.";}
function accSylHtml(r,bare){return r[2].split("-").map(function(s,i){return i===r[3]?'<b style="color:#EF4444;font-size:1.15em">'+s.toUpperCase()+'</b>':s;}).join('<span style="opacity:.35">·</span>');}
function accVerify(){ /* comprobación interna de los datos (se usa en pruebas) */
 return ACC_W.filter(function(r){
  const joined=r[2].replace(/-/g,"");
  return joined!==r[0]||r[3]>=r[2].split("-").length||accHasTilde(r[0])!==accShould(r);}).map(function(r){return r[0];});}

function accCleanup(){if(ACC.timer)clearTimeout(ACC.timer);ACC.timer=null;ACC={};}
function accLater(fn,ms){if(ACC.timer)clearTimeout(ACC.timer);const k=ACC.kind;ACC.timer=setTimeout(function(){if(ACC.kind===k)fn();},ms);}
function accFb(h,ok){const f=document.getElementById("accFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#475569')+'">'+h+'</p>';}
function accHeader(){const a=ACC_ACTS.find(function(x){return x.id===ACC.kind;});return '<div class="progressdots">'+dots(ACC.total,ACC.i)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+a.ic+' '+a.nm+'</p>';}
function accAnswered(first,delay){
 if(first)ACC.ok++;recordAnswer("Lenguaje",first,12);sOK();confetti(first?9:4);
 ACC.done=true;ACC.i++;accLater(accNext,delay||2000);}
function accFinish(){const stars=starsFor(ACC.ok,Math.max(1,ACC.total));recordAnswer("Lenguaje",stars>=2,40);save();nodeWin(stars,"Lenguaje",ACC_WIN);}
function accCard(e,txt,big){return '<div class="card center" style="padding:10px"><div style="font-size:'+(big||4)+'rem;line-height:1.1">'+e+'</div>'+(txt?'<div style="font-family:Fredoka;font-weight:700;font-size:1.5rem;margin-top:4px">'+txt+'</div>':'')+'</div>';}

/* ---------- menú y lección ---------- */
function screenAccent(){setTheme("kid");
 accCleanup();
 const cards=ACC_ACTS.map(function(a){return '<button class="kbtn '+a.cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="accStart(\''+a.id+'\')"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+a.ic+'</span><span style="flex:1"><span>'+a.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+a.sub+'</span></span></button>';}).join("");
 render(topbar("screenWords2()")+subHeader("🔤 Agudas, llanas y esdrújulas")
  +'<p class="center" style="margin:-4px 0 10px">Cuenta las sílabas desde el final y descubre dónde suena fuerte</p>'
  +'<button class="kbtn white" style="display:flex;align-items:center;gap:14px;text-align:left;border-style:dashed" onclick="accLesson()"><span style="font-size:2.4rem">📘</span><span style="flex:1"><span>Mini lección</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Empieza aquí: las tres clases y la tilde</span></span></button>'+cards);}
function accLesson(){setTheme("kid");
 accCleanup();
 const ex=function(k,words){const K=ACC_K[k];return '<div class="card" style="border:3px solid '+K.col+';background:'+K.bg+'"><b style="color:'+K.col+';font-size:1.3rem">'+K.nm+'</b> <span style="font-size:.9rem">· suena fuerte la '+K.sub+'</span><div style="margin-top:6px">'+words.map(function(w){const r=ACC_W.find(function(x){return x[0]===w;});return '<button onclick="speakES(\''+w+'\')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid '+K.col+';background:#fff;font-size:1.05rem;cursor:pointer">🔊 '+r[1]+' '+accSylHtml(r)+'</button>';}).join("")+'</div></div>';};
 render(topbar("screenAccent()")+subHeader("📘 Mini lección")
  +'<div class="card"><b>🔑 El truco: cuenta las sílabas desde el FINAL</b><p style="margin:6px 0 0;line-height:1.5">Dila despacio y busca la sílaba que suena más fuerte. ¿Cuál es, contando desde el final?</p>'
  +'<div style="display:flex;justify-content:center;gap:6px;margin-top:8px;font-family:Fredoka;font-weight:700;text-align:center"><div style="background:#EDE9FE;border-radius:12px;padding:6px 10px">3.ª<br><span style="font-size:.7rem">antepenúltima</span></div><div style="background:#DCFCE7;border-radius:12px;padding:6px 10px">2.ª<br><span style="font-size:.7rem">penúltima</span></div><div style="background:#FFEDD5;border-radius:12px;padding:6px 10px">1.ª<br><span style="font-size:.7rem">última</span></div></div></div>'
  +ex("a",["café","canción","reloj"])+ex("l",["casa","árbol","lápiz"])+ex("e",["teléfono","pájaro","música"])
  +'<div class="card"><b>✏️ ¿Cuándo lleva tilde?</b><ul style="margin:6px 0 0;padding-left:20px;line-height:1.6;font-size:.95rem"><li><b style="color:#F97316">Aguda</b>: lleva tilde si termina en <b>n, s o vocal</b> (can<b>ción</b>, ca<b>fé</b>) — reloj y color no.</li><li><b style="color:#22C55E">Llana</b>: lleva tilde si <b>NO</b> termina en n, s ni vocal (<b>ár</b>bol, <b>lá</b>piz) — casa y examen no.</li><li><b style="color:#8B5CF6">Esdrújula</b>: ¡<b>siempre</b> lleva tilde! (te<b>lé</b>fono)</li></ul></div>'
  +'<button class="kbtn green" onclick="accStart(\'canastas\')">🧺 ¡A practicar!</button><button class="kbtn white" onclick="screenAccent()">← Volver</button>');}

/* ---------- motor ---------- */
function accStart(kind){
 accCleanup();ACC={kind:kind,i:0,ok:0,total:6,tried:false,done:false};
 const take=function(arr,n){return shuffled(arr).slice(0,n);};
 const byK=function(k){return ACC_W.filter(function(r){return accClass(r)===k;});};
 const bank={
  canastas:function(){return[0,1];},
  cuenta:function(){return take(byK("a"),2).concat(take(byK("l"),2),take(byK("e"),2)).sort(function(){return Math.random()-.5;});},
  tilde:function(){return take(ACC_W.filter(function(r){return accHasTilde(r[0]);}),3).concat(take(ACC_W.filter(function(r){return !accHasTilde(r[0]);}),3)).sort(function(){return Math.random()-.5;});}};
 ACC.items=bank[kind]();
 if(kind==="canastas"){ACC.total=12;ACC.round=0;}else ACC.total=ACC.items.length;
 accNext();}
function accNext(){
 if(ACC.i>=ACC.total&&ACC.kind!=="canastas")return accFinish();
 ACC.tried=false;ACC.done=false;
 const k=ACC.kind,it=ACC.items[ACC.i];
 if(k==="canastas")return accCanastas();
 if(k==="cuenta")return accCuenta(it);
 if(k==="tilde")return accTilde(it);}

/* ---------- 🧺 canastas 3D ---------- */
function accCanastas(){
 const byK=function(k){return shuffled(ACC_W.filter(function(r){return accClass(r)===k;})).slice(0,2).map(function(r){return{w:r[0],k:k};});};
 const words=shuffled(byK("a").concat(byK("l"),byK("e")));
 ACC.tries={};
 render(topbar("screenAccent()")+'<div class="progressdots">'+dots(2,ACC.round)+'</div><p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">🧺 Aguda · llana · esdrújula</p>'
  +'<div class="card" style="padding:8px 12px"><b>Dila despacio, cuenta desde el final y elige la canasta</b><br><span class="mut" style="font-size:.82rem">🟠 última fuerte · 🟢 penúltima fuerte · 🟣 antepenúltima fuerte</span></div>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="accCanvas" style="width:100%;height:clamp(300px,50vh,400px)"></div></div><div id="accFb"></div>');
 ACC.c3=renderWordSorter("accCanvas",words,function(ev,info){
  const r=ACC_W.find(function(x){return x[0]===info.w;});
  if(ev==="select"){speakES(info.w);}
  else if(ev==="ok"){const first=!ACC.tries[info.w];if(first)ACC.ok++;recordAnswer("Lenguaje",first,8);ACC.i++;sOK();confetti(4);accFb("✅ "+accSylHtml(r)+" · "+ACC_K[info.k].nm.toLowerCase(),true);}
  else if(ev==="wrong"){ACC.tries[info.w]=1;sNO();accFb("🤔 Cuenta desde el final: "+accSylHtml(r)+". ¡Prueba otra canasta!",false);}
  else if(ev==="done"){ACC.round++;if(ACC.round>=2){accFb("🎉 ¡Todas clasificadas!",true);accLater(accFinish,1200);}else{accFb("🎉 ¡Muy bien! Otra ronda…",true);accLater(accCanastas,1300);}}},ACC_BINS);}

/* ---------- 🔢 cuenta desde el final ---------- */
function accCuenta(it){
 const p=it[2].split("-"),n=p.length;ACC.cur=it;
 render(topbar("screenAccent()")+accHeader()+accCard(it[1],"",3.6)
  +'<button class="speaker small" onclick="speakES(ACC.cur[0])">🔊 Escucha la palabra</button>'
  +'<div class="card center" style="margin:6px 0"><div style="font-family:Fredoka;font-weight:700;font-size:1.6rem">'+accSylHtml(it)+'</div><div class="mut" style="font-size:.85rem;margin-top:4px">La sílaba fuerte está en <b style="color:#EF4444">rojo</b></div></div>'
  +'<p class="center" style="margin:4px 0"><b>Contando desde el final, ¿en qué lugar está?</b></p>'
  +'<div style="display:flex;flex-direction:column;gap:8px">'+["a","l","e"].map(function(k){const K=ACC_K[k];return '<button id="accK'+k+'" onclick="accCuentaAns(\''+k+'\')" style="min-height:56px;border-radius:16px;border:3px solid '+K.col+';background:'+K.bg+';font-family:Fredoka;font-weight:700;font-size:1.05rem;color:'+K.dark+';cursor:pointer;text-align:left;padding:8px 14px">'+K.nm+' <span style="font-weight:500;font-size:.85rem">· la '+K.sub+' es la fuerte</span></button>';}).join("")+'</div><div id="accFb"></div>');
 speakES(it[0]);}
function accCuentaAns(k){
 if(ACC.done)return;const it=ACC.cur,b=document.getElementById("accK"+k),right=accClass(it);
 if(k===right){b.style.background=ACC_K[k].col;b.style.color="#fff";accFb("✅ "+it[0]+" es "+ACC_K[k].nm.toLowerCase()+" ("+["1.ª","2.ª","3.ª"][["a","l","e"].indexOf(k)]+" desde el final)",true);speakES(it[0]);accAnswered(!ACC.tried,2600);}
 else{ACC.tried=true;b.style.opacity=".35";b.disabled=true;sNO();accFb("Casi… 🤔 Cuenta desde la ÚLTIMA sílaba: 1.ª, 2.ª, 3.ª… ¿en cuál cae el rojo?",false);}}

/* ---------- ✏️ ¿lleva tilde? ---------- */
function accPutTilde(word,absIdx){
 const m={a:"á",e:"é",i:"í",o:"ó",u:"ú"};const ch=word.charAt(absIdx),lc=accNorm(ch).toLowerCase();
 return m[lc]?word.slice(0,absIdx)+m[lc]+word.slice(absIdx+1):null;}
function accTilde(it){
 const plain=accNorm(it[0]),has=accHasTilde(it[0]);
 const vowels=[];for(let i=0;i<plain.length;i++)if(/[aeiou]/.test(plain.charAt(i)))vowels.push(i);
 /* posición de la vocal de la sílaba tónica (la primera vocal fuerte, o la última vocal, de esa sílaba) */
 const syl=it[2].replace(/á|é|í|ó|ú/g,function(c){return accNorm(c);}).split("-");let off=0;for(let s=0;s<it[3];s++)off+=syl[s].length;
 const sy=syl[it[3]];let vi=-1;for(let j=0;j<sy.length;j++){if(/[aeo]/.test(sy.charAt(j))){vi=off+j;break;}}if(vi<0){for(let j=sy.length-1;j>=0;j--){if(/[iu]/.test(sy.charAt(j))){vi=off+j;break;}}}
 const bad=[];
 if(has){bad.push(plain);const other=vowels.filter(function(v){return v!==vi;});if(other.length){const o=accPutTilde(plain,other[Math.floor(Math.random()*other.length)]);if(o)bad.push(o);}}
 else{const t1=accPutTilde(plain,vi);if(t1)bad.push(t1);const other=vowels.filter(function(v){return v!==vi;});if(other.length){const o=accPutTilde(plain,other[Math.floor(Math.random()*other.length)]);if(o&&bad.indexOf(o)<0)bad.push(o);}}
 ACC.cur=it;ACC.opts=shuffled([it[0]].concat(bad.filter(function(x,i,a){return x!==it[0]&&a.indexOf(x)===i;}).slice(0,2)));
 render(topbar("screenAccent()")+accHeader()+accCard(it[1],"",4)
  +'<button class="speaker small" onclick="speakES(ACC.cur[0])">🔊 Escucha la palabra</button>'
  +'<p class="center" style="margin:6px 0"><b>¿Cuál está bien escrita?</b></p>'
  +ACC.opts.map(function(o,i){return '<button class="kbtn white" id="accO'+i+'" style="min-height:58px;font-size:1.5rem" onclick="accTildeAns('+i+')">'+o+'</button>';}).join("")+'<div id="accFb"></div>');
 speakES(it[0]);}
function accTildeAns(i){
 if(ACC.done)return;const it=ACC.cur,o=ACC.opts[i],b=document.getElementById("accO"+i);
 if(o===it[0]){b.style.background="#86EFAC";accFb("✅ "+it[0]+" · "+accSylHtml(it)+" · "+accRule(it),true);speakES(it[0]);accAnswered(!ACC.tried,3600);}
 else{ACC.tried=true;b.style.background="#FCA5A5";b.disabled=true;sNO();accFb("Casi… 🤔 Cuenta desde el final: ¿es aguda, llana o esdrújula? ¿Cómo termina?",false);}}
