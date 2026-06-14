"use strict";
/* ============ ACADEMIA DE INGLÉS A1 (unidades + coronas, estilo Duolingo) ============ */

/* ---- Unidades del niño ---- */
const EN_UNITS_KID=[
 {id:"k1",nm:"Saludos",ic:"👋",vocab:[["hello","hola","👋"],["bye","adiós","🙋"],["please","por favor","🙏"],["yes","sí","✅"],["no","no","❌"],["friend","amigo","🧑‍🤝‍🧑"],["good","bueno","👍"],["sorry","perdón","🥺"]],
  phrases:[["Hello! How are you?","¡Hola! ¿Cómo estás?"],["Good morning","Buenos días"],["Thank you very much","Muchas gracias"]]},
 {id:"k2",nm:"Colores",ic:"🎨",vocab:[["red","rojo","🔴"],["blue","azul","🔵"],["green","verde","🟢"],["yellow","amarillo","🟡"],["pink","rosado","🩷"],["black","negro","⚫"],["white","blanco","⚪"],["orange","naranja","🟠"]],
  phrases:[["My favorite color is blue","Mi color favorito es el azul"],["The sun is yellow","El sol es amarillo"],["I like red","Me gusta el rojo"]]},
 {id:"k3",nm:"Números",ic:"🔢",vocab:[["one","uno","1️⃣"],["two","dos","2️⃣"],["three","tres","3️⃣"],["four","cuatro","4️⃣"],["five","cinco","5️⃣"],["six","seis","6️⃣"],["seven","siete","7️⃣"],["ten","diez","🔟"]],
  phrases:[["I am seven years old","Tengo siete años"],["Two plus two is four","Dos más dos es cuatro"],["I have five fingers","Tengo cinco dedos"]]},
 {id:"k4",nm:"Animales",ic:"🦁",vocab:[["dog","perro","🐶"],["cat","gato","🐱"],["bird","pájaro","🐦"],["fish","pez","🐟"],["cow","vaca","🐮"],["horse","caballo","🐴"],["duck","pato","🦆"],["lion","león","🦁"]],
  phrases:[["The dog is my friend","El perro es mi amigo"],["The cat is small","El gato es pequeño"],["I see a bird","Veo un pájaro"]]},
 {id:"k5",nm:"Mi familia",ic:"👨‍👩‍👧",vocab:[["mom","mamá","👩"],["dad","papá","👨"],["baby","bebé","👶"],["sister","hermana","👧"],["brother","hermano","👦"],["grandma","abuela","👵"],["grandpa","abuelo","👴"],["family","familia","👨‍👩‍👧‍👦"]],
  phrases:[["I love my mom","Amo a mi mamá"],["This is my family","Esta es mi familia"],["My brother is big","Mi hermano es grande"]]},
 {id:"k6",nm:"Mi cuerpo",ic:"🧍",vocab:[["hand","mano","✋"],["eye","ojo","👁️"],["nose","nariz","👃"],["mouth","boca","👄"],["foot","pie","🦶"],["ear","oreja","👂"],["hair","cabello","💇"],["head","cabeza","🙂"]],
  phrases:[["I see with my eyes","Veo con mis ojos"],["Wash your hands","Lávate las manos"],["Touch your nose","Toca tu nariz"]]},
 {id:"k7",nm:"Mi casa",ic:"🏠",vocab:[["house","casa","🏠"],["door","puerta","🚪"],["window","ventana","🪟"],["bed","cama","🛏️"],["table","mesa","🪵"],["chair","silla","🪑"],["kitchen","cocina","🍳"],["bathroom","baño","🛁"]],
  phrases:[["My house is big","Mi casa es grande"],["Open the door","Abre la puerta"],["I sleep in my bed","Duermo en mi cama"]]},
 {id:"k8",nm:"Comida",ic:"🍎",vocab:[["apple","manzana","🍎"],["banana","banano","🍌"],["milk","leche","🥛"],["bread","pan","🍞"],["egg","huevo","🥚"],["water","agua","💧"],["cake","torta","🍰"],["rice","arroz","🍚"]],
  phrases:[["I am hungry","Tengo hambre"],["I drink milk","Tomo leche"],["The apple is red","La manzana es roja"]]}];

/* ---- Unidades de la adolescente (A1→A2) ---- */
const EN_UNITS_TEEN=[
 {id:"t1",nm:"Verb To Be",ic:"⭐",vocab:[["singer","cantante"],["band","banda"],["famous","famoso/a"],["happy","feliz"]],
  qs:[{q:"She ___ my favorite singer.",ops:["is","are","am"],a:0},{q:"They ___ in a band.",ops:["are","is","be"],a:0},{q:"I ___ very happy today.",ops:["am","is","are"],a:0},{q:"___ you a fan of pop music?",ops:["Are","Is","Am"],a:0},{q:"The concert ___ amazing!",ops:["is","are","be"],a:0},{q:"We ___ not tired.",ops:["are","is","am"],a:0},{q:"\"It's\" significa…",ops:["It is","It has siempre","Its"],a:0},{q:"My friends ___ at the show.",ops:["are","is","be"],a:0}]},
 {id:"t2",nm:"Present Simple",ic:"🎧",vocab:[["listen","escuchar"],["play","tocar/jugar"],["watch","ver"],["practice","practicar"]],
  qs:[{q:"She ___ to music every day.",ops:["listens","listen","listening"],a:0},{q:"I ___ the guitar.",ops:["play","plays","playing"],a:0},{q:"He ___ TV at night.",ops:["watches","watch","watching"],a:0},{q:"We ___ English at school.",ops:["study","studies","studying"],a:0},{q:"My sister ___ K-pop.",ops:["loves","love","loving"],a:0},{q:"The band ___ on Fridays.",ops:["practices","practice","practicing"],a:0},{q:"They ___ videos online.",ops:["watch","watches","watching"],a:0},{q:"\"Every day\" indica…",ops:["Rutina (presente simple)","Pasado","Futuro"],a:0}]},
 {id:"t3",nm:"Preguntas y negativos",ic:"❓",vocab:[["never","nunca"],["always","siempre"],["question","pregunta"],["answer","respuesta"]],
  qs:[{q:"___ she like rock music?",ops:["Does","Do","Is"],a:0},{q:"I ___ like horror movies.",ops:["don't","doesn't","am not"],a:0},{q:"He ___ play the drums.",ops:["doesn't","don't","isn't"],a:0},{q:"Where ___ you live?",ops:["do","does","are"],a:0},{q:"___ they study English?",ops:["Do","Does","Are"],a:0},{q:"She doesn't ___ coffee.",ops:["like","likes","liked"],a:0},{q:"What time ___ the show start?",ops:["does","do","is"],a:0},{q:"Correcta:",ops:["Where does she live?","Where she lives?","Where does she lives?"],a:0}]},
 {id:"t4",nm:"There is/are + lugares",ic:"📍",vocab:[["stage","escenario"],["crowd","multitud"],["between","entre"],["behind","detrás"]],
  qs:[{q:"___ a concert tonight.",ops:["There is","There are","There be"],a:0},{q:"___ many people here!",ops:["There are","There is","There am"],a:0},{q:"The guitar is ___ the bed.",ops:["under","between sin nada","at"],a:0},{q:"My phone is ___ the table.",ops:["on","in","at"],a:0},{q:"She is ___ the door.",ops:["behind","on","of"],a:0},{q:"The park is ___ my house and the school.",ops:["between","under","on"],a:0},{q:"\"Next to\" significa…",ops:["Al lado de","Lejos de","Dentro de"],a:0},{q:"___ a piano in the room?",ops:["Is there","Are there","There is"],a:0}]},
 {id:"t5",nm:"Past Simple",ic:"⏪",vocab:[["yesterday","ayer"],["last night","anoche"],["concert","concierto"],["ticket","boleta"]],
  qs:[{q:"Past de GO:",ops:["went","goed","gone"],a:0},{q:"I ___ a great movie yesterday.",ops:["watched","watch","watching"],a:0},{q:"She ___ her favorite song.",ops:["sang","singed","sing"],a:0},{q:"Past de BUY:",ops:["bought","buyed","brought"],a:0},{q:"They ___ to the concert last night.",ops:["went","go","gone"],a:0},{q:"He ___ the guitar at the party.",ops:["played","plays","play"],a:0},{q:"Past de HAVE:",ops:["had","haved","has"],a:0},{q:"We ___ tickets online.",ops:["bought","buy","buying"],a:0}]},
 {id:"t6",nm:"Vida diaria",ic:"📱",vocab:[["homework","tarea"],["subject","materia"],["hobby","pasatiempo"],["playlist","lista de canciones"],["share","compartir"],["skills","habilidades"]],
  qs:[{q:"\"Borrow\" significa…",ops:["Pedir prestado","Prestar","Comprar"],a:0},{q:"\"I'm into K-pop\" significa…",ops:["Me encanta el K-pop","Estoy dentro de un concierto","Canto K-pop"],a:0},{q:"\"However\" significa…",ops:["Sin embargo","Además","Por eso"],a:0},{q:"My favorite ___ is science.",ops:["subject","homework","hobby"],a:0},{q:"\"Catchy\" describe una canción…",ops:["Pegajosa","Lenta","Triste"],a:0},{q:"I ___ my playlist with my friends.",ops:["share","spend","study"],a:0},{q:"\"Improve\" significa…",ops:["Mejorar","Olvidar","Empezar"],a:0},{q:"\"Skills\" son…",ops:["Habilidades","Canciones","Tareas"],a:0}]}];

function enCourse(){const p=prof();if(!p.enCourse)p.enCourse={};return p.enCourse;}
function unitCrowns(id){const c=enCourse()[id];return c?c.crowns||0:0;}
function unitUnlocked(units,i){return i===0||unitCrowns(units[i-1].id)>=1;}

/* ---- Pantalla de unidades (niño) ---- */
function screenAcademyKid(){setTheme("kid");
 const path=EN_UNITS_KID.map((u,i)=>{
  const open=unitUnlocked(EN_UNITS_KID,i),cr=unitCrowns(u.id);
  return '<button class="kbtn '+(open?(cr>=3?"green":"yellow"):"white")+'" style="text-align:left;display:flex;align-items:center;gap:14px;'+(open?"":"opacity:.55;")+'" onclick="'+(open?("startEnLesson(\'"+u.id+"\')"):"toast(\'Gana una corona en la unidad anterior 🔒\',false,1500)")+'">'
  +'<span style="font-size:clamp(2rem,9vw,2.6rem)">'+(open?u.ic:"🔒")+'</span>'
  +'<span style="flex:1"><span>Unidad '+(i+1)+': '+u.nm+'</span><br><span style="font-size:1rem">'+(cr?"👑".repeat(cr):"")+("☆".repeat(3-cr))+'</span></span></button>';}).join("");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🎓 Academia de Inglés</h2>'
 +'<p class="center" style="margin-bottom:12px">Gana 👑 coronas en cada unidad — ¡hasta 3 por unidad!</p>'
 +path);}

/* ---- Lección del niño ---- */
let EAK={};
function startEnLesson(uid){setTheme("kid");
 const u=EN_UNITS_KID.find(x=>x.id===uid);
 const vocab=shuffled(u.vocab).slice(0,4);
 const steps=[];
 vocab.forEach(w=>steps.push({t:"learn",w}));
 vocab.forEach(w=>steps.push({t:pick(["listen","mean"]),w}));
 const spellable=vocab.filter(w=>w[0].length<=6);
 if(spellable.length)steps.push({t:"spell",w:pick(spellable)});
 steps.push({t:"phrase",p:pick(u.phrases)});
 EAK={u,steps:steps,i:0,ok:0,n:0};
 nextEAK();}
function nextEAK(){
 EAK.lock=false;
 const s=EAK.steps[EAK.i];
 if(!s)return finishEAK();
 const u=EAK.u,head=topbar("screenAcademyKid()")+'<div class="progressdots">'+dots(EAK.steps.length,EAK.i)+'</div>';
 if(s.t==="learn"){
  render(head
  +'<p class="center" style="font-family:Fredoka;font-weight:600;margin-bottom:6px">'+u.ic+' Palabra nueva</p>'
  +'<div class="card encard"><div class="pic">'+s.w[2]+'</div><div class="en">'+s.w[0]+'</div><div class="es">'+s.w[1]+'</div></div>'
  +(hasVoice()?'<button class="speaker" onclick="speakEN(\''+s.w[0]+'\')"><span class="ic">🔊</span> Escuchar</button>':'')
  +'<button class="kbtn green" onclick="EAK.i++;nextEAK()">¡Lo tengo! →</button>');
  if(hasVoice())setTimeout(()=>speakEN(s.w[0]),300);
  return;}
 if(s.t==="listen"){
  const wrong=shuffled(u.vocab.filter(w=>w[0]!==s.w[0])).slice(0,3);
  EAK.opts=shuffled([s.w,...wrong]);
  render(head
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:8px">'+(hasVoice()?"🔊 Escucha y toca":'¿Cuál es "'+s.w[0]+'"?')+'</h2>'
  +(hasVoice()?'<button class="speaker" onclick="speakEN(\''+s.w[0]+'\')"><span class="ic">🔊</span> Oír otra vez</button>':'')
  +'<div class="choices2">'+EAK.opts.map((o,k)=>'<button class="kbtn white" style="font-size:clamp(2.6rem,12vw,3.6rem);min-height:clamp(90px,24vw,120px)" onclick="ansEAK('+k+')">'+o[2]+'</button>').join("")+'</div>');
  if(hasVoice())setTimeout(()=>speakEN(s.w[0]),300);
  return;}
 if(s.t==="mean"){
  const wrong=shuffled(u.vocab.filter(w=>w[0]!==s.w[0])).slice(0,2).map(w=>w[1]);
  EAK.optsT=shuffled([s.w[1],...wrong]);
  render(head
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:4px">¿Qué significa <span style="color:var(--kid-blue)">'+s.w[0]+'</span>?</h2>'
  +'<div class="bigpic">'+s.w[2]+'</div>'
  +(hasVoice()?'<button class="speaker small" onclick="speakEN(\''+s.w[0]+'\')">🔊 Oír</button>':'')
  +EAK.optsT.map((o,k)=>'<button class="kbtn white" onclick="ansEAKT('+k+')">'+esc(o)+'</button>').join(""));
  return;}
 if(s.t==="spell"){
  EAK.typed=[];EAK.usedK=[];
  const letters=shuffled(s.w[0].toUpperCase().split(""));
  const extra="ABCDEFGHIJKLMNOPRSTUW".split("").filter(c=>!s.w[0].toUpperCase().includes(c));
  EAK.keys=shuffled([...letters,...shuffled(extra).slice(0,2)]);
  return renderEAKSpell();}
 if(s.t==="phrase"){
  const wrong=shuffled(EAK.u.phrases.filter(p=>p[0]!==s.p[0]));
  const others=wrong.length>=2?wrong.slice(0,2).map(p=>p[1]):["Buenas noches","Hasta mañana"];
  EAK.optsT=shuffled([s.p[1],...others]);
  render(head
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:6px">💬 ¿Qué significa?</h2>'
  +'<div class="card encard"><div style="font-size:clamp(1.4rem,6.5vw,2rem);font-weight:700;color:var(--kid-blue);font-family:Fredoka">"'+esc(s.p[0])+'"</div></div>'
  +(hasVoice()?'<button class="speaker" onclick="speakEN(\''+esc(s.p[0]).replace(/'/g,"")+'\')"><span class="ic">🔊</span> Escuchar</button>':'')
  +EAK.optsT.map((o,k)=>'<button class="kbtn white" onclick="ansEAKT('+k+')">'+esc(o)+'</button>').join(""));
  if(hasVoice())setTimeout(()=>speakEN(s.p[0].replace(/'/g,"")),350);
  return;}}
function ansEAK(k){const s=EAK.steps[EAK.i],ok=EAK.opts[k][0]===s.w[0];eakScore(ok,s.w[0],s.w[2]);}
function ansEAKT(k){const s=EAK.steps[EAK.i];
 const correct=s.t==="phrase"?s.p[1]:s.w[1];
 const ok=EAK.optsT[k]===correct;
 eakScore(ok,s.t==="phrase"?null:s.w[0],correct);}
function eakScore(ok,sayWord,showCorrect){
 if(EAK.lock)return;EAK.lock=true; // evita doble toque
 EAK.n++;recordAnswer("Inglés",ok,12);
 if(ok){EAK.ok++;sOK();confetti(8);if(sayWord&&hasVoice())speakEN(sayWord);toast("¡Correcto! 🎉",true,1000);}
 else{sNO();toast("Era: "+showCorrect,false,1600);}
 EAK.i++;setTimeout(nextEAK,ok?1000:1700);}
function renderEAKSpell(){
 const s=EAK.steps[EAK.i],w=s.w;
 const slots=w[0].split("").map((_,i)=>'<div class="slot'+(EAK.typed[i]?' filled':'')+'">'+(EAK.typed[i]||"")+'</div>').join("");
 render(topbar("screenAcademyKid()")+'<div class="progressdots">'+dots(EAK.steps.length,EAK.i)+'</div>'
 +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:4px">✍️ Escribe la palabra</h2>'
 +'<div class="bigpic">'+w[2]+'</div>'
 +(hasVoice()?'<button class="speaker small" onclick="speakEN(\''+w[0]+'\')">🔊 '+w[0]+' ('+w[1]+')</button>':'<p class="center">'+w[0]+' ('+w[1]+')</p>')
 +'<div class="letterslots">'+slots+'</div>'
 +'<div class="keys">'+EAK.keys.map((c,k)=>'<button class="key'+(EAK.usedK.includes(k)?' used':'')+'" onclick="tapEAKKey('+k+',\''+c+'\')">'+c+'</button>').join("")+'</div>'
 +'<div style="height:10px"></div>'
 +'<button class="kbtn white" onclick="EAK.typed=[];EAK.usedK=[];renderEAKSpell()">🧽 Borrar</button>');}
function tapEAKKey(k,c){
 if(EAK.usedK.includes(k))return;
 const s=EAK.steps[EAK.i];
 if(EAK.typed.length>=s.w[0].length)return;
 EAK.typed.push(c);EAK.usedK.push(k);beep([500+EAK.typed.length*50],.07);
 if(EAK.typed.length===s.w[0].length){
  const ok=EAK.typed.join("").toLowerCase()===s.w[0].toLowerCase();
  setTimeout(()=>eakScore(ok,s.w[0],s.w[0].toUpperCase()),250);
  return;}
 renderEAKSpell();}
function finishEAK(){
 const pct=EAK.n?EAK.ok/EAK.n:0;
 const c=enCourse();
 if(!c[EAK.u.id])c[EAK.u.id]={crowns:0,lessons:0};
 c[EAK.u.id].lessons++;
 const p=prof();
 let crownMsg="";
 if(pct>=0.7&&c[EAK.u.id].crowns<3){c[EAK.u.id].crowns++;p.coins+=10*c[EAK.u.id].crowns+5;p.xp+=20;crownMsg='<div style="font-size:clamp(3.5rem,18vw,5rem)">👑</div><h2>¡Nueva corona!</h2><p style="margin-bottom:8px">Unidad "'+EAK.u.nm+'": '+"👑".repeat(c[EAK.u.id].crowns)+'</p>';sWIN();confetti(34);}
 else{p.coins+=5;p.xp+=10;crownMsg='<div style="font-size:clamp(3rem,15vw,4rem)">'+(pct>=0.7?"🌟":"💪")+'</div><h2>'+(pct>=0.7?"¡Muy bien!":"¡Buen intento!")+'</h2><p style="margin-bottom:8px">'+(pct>=0.7?"Esta unidad ya tiene sus coronas al máximo":"Necesitas 70% para la corona — ¡tú puedes!")+'</p>';if(pct>=0.7)sWIN();}
 save();
 // la academia también da criaturas al aprobar
 const got=(pct>=0.7&&profType()==="kid"&&typeof maybeCritter==="function")?maybeCritter():null;
 const gotHTML=got?'<div class="card" style="background:linear-gradient(180deg,#FFF3C4,#FFE08A);margin-top:14px;text-align:center"><div style="font-size:clamp(3rem,15vw,4.5rem)">'+got.e+'</div><b style="font-size:1.15rem">'+(got.isNew?"¡Capturaste a "+got.name+"!":got.evolved?"¡"+got.name+" EVOLUCIONÓ! 🌟":"¡"+got.name+" subió a nivel "+got.count+"! ❤️")+'</b></div>':'';
 if(got)setTimeout(()=>confetti(24),400);
 render(topbar("screenAcademyKid()")
 +'<div class="card endcard">'+crownMsg
 +'<p style="font-size:1.05rem;margin-bottom:14px">'+EAK.ok+' de '+EAK.n+' correctas ('+Math.round(pct*100)+'%)</p>'
 +'<button class="kbtn green" onclick="startEnLesson(\''+EAK.u.id+'\')">Repetir lección 🔁</button>'
 +'<button class="kbtn white" onclick="screenAcademyKid()">Volver a las unidades</button></div>'
 +gotHTML);}

/* ---- Academia teen ---- */
let EAT={};
function screenAcademyTeen(){setTheme("teen");
 const path=EN_UNITS_TEEN.map((u,i)=>{
  const open=unitUnlocked(EN_UNITS_TEEN,i),cr=unitCrowns(u.id);
  return '<button class="tbtn" style="'+(open?"":"opacity:.5;")+'" onclick="'+(open?("startEnLessonTeen(\'"+u.id+"\')"):"toast(\'Gana una corona en la unidad anterior 🔒\',false,1500)")+'">'
  +(open?u.ic:"🔒")+' &nbsp;Unidad '+(i+1)+': '+u.nm+' <span class="mut">· '+("👑".repeat(cr)||"sin coronas")+'</span></button>';}).join("");
 render(topbar("screenTeenHome()")
 +'<h2 style="margin-bottom:4px">🎓 English Academy A1→A2</h2>'
 +'<p class="mut" style="margin-bottom:14px">Cada unidad da hasta 3 👑 — 70% o más para coronar</p>'
 +path);}
function startEnLessonTeen(uid){setTheme("teen");
 const u=EN_UNITS_TEEN.find(x=>x.id===uid);
 const qs=shuffled(u.qs).slice(0,6).map(q=>({q:q.q,ops:q.ops.slice(),a:q.a}));
 const vq=shuffled(u.vocab).slice(0,2).map(v=>{
  const wrong=shuffled(u.vocab.filter(x=>x[0]!==v[0])).slice(0,2).map(x=>x[1]);
  const ops=shuffled([v[1],...wrong]);
  return{q:'¿Qué significa "'+v[0]+'"?',ops,a:ops.indexOf(v[1])};});
 EAT={u,qs:shuffled(qs.concat(vq)),i:0,ok:0};
 nextEAT();}
function nextEAT(){
 EAT.lock=false;
 const q=EAT.qs[EAT.i];
 if(!q)return finishEAT();
 const order=shuffled(q.ops.map((o,i)=>({o,i})));EAT.order=order;
 render(topbar("screenAcademyTeen()")
 +'<div style="display:flex;justify-content:space-between"><b>'+EAT.u.ic+' '+esc(EAT.u.nm)+'</b><b class="mut">'+(EAT.i+1)+'/'+EAT.qs.length+'</b></div>'
 +'<div class="bigq">'+esc(q.q)+'</div>'
 +order.map((it,k)=>'<button class="tbtn opt" onclick="ansEAT('+k+')">'+esc(it.o)+'</button>').join(""));}
function ansEAT(k){
 if(EAT.lock)return;EAT.lock=true;
 const q=EAT.qs[EAT.i],ok=EAT.order[k].i===q.a;
 recordAnswer("Inglés",ok,15);
 if(ok){EAT.ok++;sOK();toast("✓",true,700);}else{sNO();toast("Era: "+esc(q.ops[q.a]),false,1700);}
 EAT.i++;setTimeout(nextEAT,ok?750:1750);}
function finishEAT(){
 const pct=EAT.ok/EAT.qs.length;
 const c=enCourse();
 if(!c[EAT.u.id])c[EAT.u.id]={crowns:0,lessons:0};
 c[EAT.u.id].lessons++;
 const p=prof();let msg;
 if(pct>=0.7&&c[EAT.u.id].crowns<3){c[EAT.u.id].crowns++;p.coins+=10*c[EAT.u.id].crowns+5;p.xp+=20;msg='<div class="big">👑</div><h2>¡Nueva corona!</h2><p class="mut" style="margin-bottom:14px">'+esc(EAT.u.nm)+': '+"👑".repeat(c[EAT.u.id].crowns)+'</p>';sWIN();confetti(26);}
 else{p.coins+=5;p.xp+=10;msg='<div class="big">'+(pct>=0.7?"🌟":"💪")+'</div><h2>'+EAT.ok+'/'+EAT.qs.length+' correctas</h2><p class="mut" style="margin-bottom:14px">'+(pct>=0.7?"Unidad ya coronada al máximo":"Necesitas 70% para la corona")+'</p>';if(pct>=0.7)sWIN();}
 save();
 render(topbar("screenAcademyTeen()")
 +'<div class="card endcard">'+msg
 +'<button class="tbtn acc" onclick="startEnLessonTeen(\''+EAT.u.id+'\')">Repetir lección 🔁</button>'
 +'<button class="tbtn" style="text-align:center" onclick="screenAcademyTeen()">Volver a unidades</button></div>');}
