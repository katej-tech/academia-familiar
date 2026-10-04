"use strict";
/* ============ INGLÉS EN ACCIÓN (escenas de la vida real, estilo "EWA") ============
   Pedido: mejorar el inglés de forma interactiva como EWA: situaciones reales (restaurante,
   aeropuerto, taxi, hotel…), diálogos con audio, lecturas, juegos de duelo de palabras.
   Cada ESCENA tiene 4 pasos: 1) Mira y escucha el diálogo con personajes 3D, 2) Palabras
   (oído → imagen), 3) Tú eres el protagonista (eliges qué responder), 4) Ordena la frase.
   Las palabras nuevas entran a un REPASO ESPACIADO (cajas de Leitner: 1, 2, 4, 8, 16 días).
   También hay Duelo de palabras contra el Robo-Rival y escenas nuevas con IA (si hay clave).
   Todo original: personajes = las mascotas de la app; nada de marcas ni personajes con derechos.
   Contenido en inglés A1 para niños; "who": 0 = personaje de la escena, 1 = tú. */

const EN_SCENES=[
 {id:"restaurante",ic:"🍕",nm:"En el restaurante",en:"At the restaurant",bg:["#FFE2B8","#F5B56B"],props:["🍕","🥤","🍽️"],npc:"Zorro, el mesero",pets:[4],
  lines:[
   {who:0,en:"Hello! Welcome to our restaurant.",es:"¡Hola! Bienvenido a nuestro restaurante."},
   {who:1,en:"Hello! A table for two, please.",es:"¡Hola! Una mesa para dos, por favor."},
   {who:0,en:"Here is the menu. What would you like?",es:"Aquí está el menú. ¿Qué quieres?"},
   {who:1,en:"I would like a pizza, please.",es:"Quiero una pizza, por favor."},
   {who:0,en:"And what would you like to drink?",es:"¿Y qué quieres tomar?"},
   {who:1,en:"Orange juice, please.",es:"Jugo de naranja, por favor."},
   {who:0,en:"Here you are. Enjoy your meal!",es:"Aquí tienes. ¡Buen provecho!"},
   {who:1,en:"Thank you! It is delicious.",es:"¡Gracias! Está delicioso."}],
  vocab:[["menu","menú","📋"],["pizza","pizza","🍕"],["juice","jugo","🧃"],["water","agua","💧"],["soup","sopa","🍲"],["bill","cuenta","🧾"]]},
 {id:"aeropuerto",ic:"✈️",nm:"En el aeropuerto",en:"At the airport",bg:["#CFE8FF","#8FC3F2"],props:["✈️","🧳","🎫"],npc:"Pingüino, el oficial",pets:[6],
  lines:[
   {who:0,en:"Good morning! Passport, please.",es:"¡Buenos días! Pasaporte, por favor."},
   {who:1,en:"Here is my passport.",es:"Aquí está mi pasaporte."},
   {who:0,en:"Where are you going?",es:"¿A dónde vas?"},
   {who:1,en:"I am going to Miami.",es:"Voy a Miami."},
   {who:0,en:"Do you have a bag?",es:"¿Tienes una maleta?"},
   {who:1,en:"Yes, I have one small bag.",es:"Sí, tengo una maleta pequeña."},
   {who:0,en:"Here is your ticket. Gate number five.",es:"Aquí está tu boleto. Puerta número cinco."},
   {who:1,en:"Thank you! Have a nice day.",es:"¡Gracias! Que tengas un lindo día."}],
  vocab:[["passport","pasaporte","🛂"],["ticket","boleto","🎫"],["bag","maleta","🧳"],["plane","avión","✈️"],["gate","puerta de embarque","🚪"],["pilot","piloto","🧑‍✈️"]]},
 {id:"taxi",ic:"🚕",nm:"En el taxi",en:"In the taxi",bg:["#FFF3B0","#F2D04B"],props:["🚕","🗺️","🏨"],npc:"Perrito, el taxista",pets:[1],
  lines:[
   {who:0,en:"Hello! Where to?",es:"¡Hola! ¿A dónde vamos?"},
   {who:1,en:"To the Sun Hotel, please.",es:"Al Hotel Sol, por favor."},
   {who:0,en:"Sure. Put on your seat belt.",es:"Claro. Ponte el cinturón."},
   {who:1,en:"OK. How long is the trip?",es:"Bueno. ¿Cuánto dura el viaje?"},
   {who:0,en:"About ten minutes.",es:"Unos diez minutos."},
   {who:1,en:"Please stop here.",es:"Pare aquí, por favor."},
   {who:0,en:"That is five dollars.",es:"Son cinco dólares."},
   {who:1,en:"Here you go. Thank you!",es:"Aquí tiene. ¡Gracias!"}],
  vocab:[["taxi","taxi","🚕"],["map","mapa","🗺️"],["stop","parar","🛑"],["money","dinero","💵"],["street","calle","🛣️"],["fast","rápido","⚡"]]},
 {id:"hotel",ic:"🏨",nm:"En el hotel",en:"At the hotel",bg:["#E3D5FF","#B79CF0"],props:["🏨","🔑","🛏️"],npc:"Conejo, el recepcionista",pets:[2],
  lines:[
   {who:0,en:"Welcome to the hotel!",es:"¡Bienvenido al hotel!"},
   {who:1,en:"Hello! I have a reservation.",es:"¡Hola! Tengo una reservación."},
   {who:0,en:"What is your name?",es:"¿Cómo te llamas?"},
   {who:1,en:"My name is {name}.",es:"Me llamo {name}."},
   {who:0,en:"Here is your key. Room twelve.",es:"Aquí está tu llave. Habitación doce."},
   {who:1,en:"Where is the elevator?",es:"¿Dónde está el ascensor?"},
   {who:0,en:"It is on the left.",es:"Está a la izquierda."},
   {who:1,en:"What time is breakfast?",es:"¿A qué hora es el desayuno?"},
   {who:0,en:"At seven o'clock. Enjoy your stay!",es:"A las siete. ¡Disfruta tu estadía!"}],
  vocab:[["key","llave","🔑"],["room","habitación","🛏️"],["elevator","ascensor","🛗"],["breakfast","desayuno","🥞"],["left","izquierda","⬅️"],["reservation","reservación","📅"]]},
 {id:"super",ic:"🛒",nm:"En el supermercado",en:"At the supermarket",bg:["#D6F5D6","#8ED98E"],props:["🛒","🍎","🥛"],npc:"Osito, el vendedor",pets:[9],
  lines:[
   {who:0,en:"Hi! Can I help you?",es:"¡Hola! ¿Te puedo ayudar?"},
   {who:1,en:"Yes, where are the apples?",es:"Sí, ¿dónde están las manzanas?"},
   {who:0,en:"They are next to the bananas.",es:"Están al lado de los plátanos."},
   {who:1,en:"How much is the milk?",es:"¿Cuánto cuesta la leche?"},
   {who:0,en:"It is two dollars.",es:"Cuesta dos dólares."},
   {who:1,en:"I want two apples, please.",es:"Quiero dos manzanas, por favor."},
   {who:0,en:"Anything else?",es:"¿Algo más?"},
   {who:1,en:"No, that is all. Thank you!",es:"No, eso es todo. ¡Gracias!"}],
  vocab:[["apple","manzana","🍎"],["milk","leche","🥛"],["bread","pan","🍞"],["cart","carrito","🛒"],["cheese","queso","🧀"],["banana","plátano","🍌"]]},
 {id:"doctor",ic:"🩺",nm:"En el doctor",en:"At the doctor",bg:["#D9F2F2","#8FD3D3"],props:["🩺","💊","🌡️"],npc:"Tortuga, la doctora",pets:[7],
  lines:[
   {who:0,en:"Hello! What is the matter?",es:"¡Hola! ¿Qué te pasa?"},
   {who:1,en:"I have a headache.",es:"Me duele la cabeza."},
   {who:0,en:"Open your mouth, please.",es:"Abre la boca, por favor."},
   {who:1,en:"Ahh. Is it bad?",es:"Aaah. ¿Es grave?"},
   {who:0,en:"No, it is not bad. You need rest.",es:"No, no es grave. Necesitas descansar."},
   {who:1,en:"Do I need medicine?",es:"¿Necesito medicina?"},
   {who:0,en:"Drink water and sleep a lot.",es:"Toma agua y duerme mucho."},
   {who:1,en:"OK, thank you, doctor!",es:"Bien, ¡gracias, doctora!"}],
  vocab:[["doctor","doctor","🧑‍⚕️"],["medicine","medicina","💊"],["headache","dolor de cabeza","🤕"],["fever","fiebre","🌡️"],["water","agua","💧"],["sleep","dormir","😴"]]},
 {id:"escuela",ic:"🏫",nm:"Nuevos amigos",en:"Making new friends",bg:["#FFD9E6","#F59BBB"],props:["🏫","🎒","✏️"],npc:"Hámster, tu compañera Lily",pets:[3],
  lines:[
   {who:0,en:"Hi! I am Lily. What is your name?",es:"¡Hola! Soy Lily. ¿Cómo te llamas?"},
   {who:1,en:"Hi, Lily! My name is {name}.",es:"¡Hola, Lily! Me llamo {name}."},
   {who:0,en:"Nice to meet you! Do you like soccer?",es:"¡Mucho gusto! ¿Te gusta el fútbol?"},
   {who:1,en:"Yes, I love soccer!",es:"¡Sí, me encanta el fútbol!"},
   {who:0,en:"Let us play at recess!",es:"¡Juguemos en el recreo!"},
   {who:1,en:"Great idea! Let us go!",es:"¡Buena idea! ¡Vamos!"},
   {who:0,en:"Do you have a pencil? I forgot mine.",es:"¿Tienes un lápiz? Olvidé el mío."},
   {who:1,en:"Yes, you can use mine.",es:"Sí, puedes usar el mío."}],
  vocab:[["friend","amigo","👫"],["pencil","lápiz","✏️"],["backpack","mochila","🎒"],["teacher","profesora","👩‍🏫"],["soccer","fútbol","⚽"],["recess","recreo","🛝"]]},
 {id:"espacio",ic:"🚀",nm:"La estación espacial",en:"The space station",bg:["#2B2F6B","#12163F"],props:["🚀","🪐","⭐"],npc:"Dragón, el capitán",pets:[5],
  lines:[
   {who:0,en:"Welcome aboard, astronaut!",es:"¡Bienvenido a bordo, astronauta!"},
   {who:1,en:"Thank you, Captain! I am ready.",es:"¡Gracias, capitán! Estoy listo."},
   {who:0,en:"Look out the window. What do you see?",es:"Mira por la ventana. ¿Qué ves?"},
   {who:1,en:"I see the Earth. It is blue and green.",es:"Veo la Tierra. Es azul y verde."},
   {who:0,en:"Very good! Ten, nine, eight… are you ready?",es:"¡Muy bien! Diez, nueve, ocho… ¿estás listo?"},
   {who:1,en:"Yes! Three, two, one, blast off!",es:"¡Sí! Tres, dos, uno, ¡despegue!"},
   {who:0,en:"Wow! You are a real astronaut!",es:"¡Guau! ¡Eres un verdadero astronauta!"},
   {who:1,en:"I love space!",es:"¡Me encanta el espacio!"}],
  vocab:[["rocket","cohete","🚀"],["planet","planeta","🪐"],["star","estrella","⭐"],["moon","luna","🌙"],["astronaut","astronauta","👨‍🚀"],["Earth","la Tierra","🌍"]]}
];

/* ---------- estado y utilidades ---------- */
let ENS={};
const EN_WIN={noWorld:true,replay:"screenEnglishScenes()",replayLabel:"Más escenas 🎭",backFn:"screenEnglishHub()",backLabel:"Volver a Inglés 🇬🇧"};
const EN_BOX_DAYS=[0,1,2,4,8,16];
function enDay(){return Math.floor(Date.now()/86400000);}
function enNameKid(){const p=prof();return String((p&&p.name)||"Alex").trim().split(/\s+/)[0].slice(0,12)||"Alex";}
function enFill(t){return String(t).replace(/\{name\}/g,enNameKid());}
function enAiScenes(){const p=prof();if(!p.enAiScenes)p.enAiScenes=[];return p.enAiScenes;}
function enAllScenes(){return EN_SCENES.concat(enAiScenes());}
function enProgress(){const p=prof();if(!p.enScenes)p.enScenes={};return p.enScenes;}
function enWords(){const p=prof();if(!p.enWords)p.enWords={};return p.enWords;}
function enDueWords(){const d=enDay();return Object.keys(enWords()).filter(function(k){return enWords()[k].due<=d;});}
function enSrs(word,es,ic,ok){
 const w=enWords(),r=w[word]||{es:es,ic:ic,box:0,due:0};
 r.es=es;r.ic=ic;r.box=ok?Math.min(5,r.box+1):0;
 r.due=ok?enDay()+EN_BOX_DAYS[r.box]:enDay(); /* fallar = vuelve hoy mismo a la caja 0 */
 w[word]=r;}
function enEsc(s){return esc(enFill(s));}
function enJs(s){return jsStr(s);}
function enStopAll(){try{window.speechSynthesis.cancel();}catch(e){}if(typeof stopGemAudio==="function")stopGemAudio();if(ENS)ENS.timers&&ENS.timers.forEach(clearTimeout);if(ENS)ENS.timers=[];}
function enSceneCleanup(){enStopAll();if(typeof disposeScene3D==="function")disposeScene3D();}
function enLater(fn,ms){const t=setTimeout(fn,ms);(ENS.timers=ENS.timers||[]).push(t);return t;}
function enSay(text,onEnd){
 let done=false;const fin=function(){if(done)return;done=true;if(onEnd)onEnd();};
 speakEN(enFill(text),fin);
 /* respaldo: si el audio falla o está en silencio, no dejar la escena trabada */
 enLater(fin,Math.min(9000,enFill(text).length*110+1500));}

/* ---------- hub ---------- */
function screenEnglishScenes(){setTheme("kid");
 enStopAll();
 const prog=enProgress(),due=enDueWords().length,nW=Object.keys(enWords()).length;
 const card=function(cls,ic,t,sub,fn,badge){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left;position:relative" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+sub+'</span></span>'+(badge?'<span style="background:#fff;color:#111;border-radius:12px;padding:3px 9px;font-size:.85rem;font-weight:800">'+badge+'</span>':'')+'</button>';};
 const scenes=enAllScenes().map(function(s,i){
  const st=(prog[s.id]||{}).stars||0;
  return card(["red","blue","yellow","purple","green","red","blue","yellow"][i%8],s.ic,esc(s.nm),esc(s.en),"enSceneStart("+i+")",st?("⭐".repeat(st)):"");}).join("");
 render(topbar("screenEnglishHub()")
  +subHeader("🎭 Inglés en acción")
  +'<p class="center" style="margin:-4px 0 10px">Situaciones de la vida real: míralas, escúchalas y ¡habla como un experto!</p>'
  +scenes
  +(S.geminiKey?card("white","✨","Escena nueva con IA","Pide un lugar y se inventa un diálogo nuevo","enAiPick()"):'<p class="center mut" style="font-size:.82rem">✨ Con la clave de IA (papá o mamá) se pueden inventar escenas nuevas.</p>')
  +'<p class="appsec" style="margin-top:14px">🧠 Practica</p>'
  +card("green","🔁","Repaso de palabras",nW?(due?due+" palabras te esperan hoy":"¡Al día! Vuelve mañana"):"Aprende palabras en una escena primero","enReviewStart()",due?String(due):"")
  +card("yellow","⚔️","Duelo de palabras","Compite contra el Robo-Rival","enDuelStart()"));}

/* ---------- arranque de una escena ---------- */
function enSceneStart(i){setTheme("kid");
 const all=enAllScenes(),sc=all[i];if(!sc)return;
 enStopAll();
 const t=typeof tamaState==="function"?tamaState():null;
 const ti=t&&typeof TAMA_STARTERS!=="undefined"?TAMA_STARTERS.findIndex(function(s){return s[0]===t.sp;}):-1;
 const youPet=ti>=0?ti:8;
 const npcPet=(sc.pets&&sc.pets[0]!=null)?sc.pets[0]:(youPet+3)%10;
 ENS={sc:sc,idx:i,stage:0,ok:0,total:0,youPet:youPet,npcPet:npcPet===youPet?(npcPet+1)%10:npcPet,showEs:true,timers:[],played:-1};
 render(topbar("screenEnglishScenes()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin:0 0 2px">'+sc.ic+' '+esc(sc.nm)+'</h2>'
  +'<p class="center" id="ensWho" style="margin:0 0 6px;font-size:.85rem;opacity:.8">Hablas con: '+esc(sc.npc)+'</p>'
  +'<div class="card center" style="padding:0;overflow:hidden;border-radius:18px"><div id="ensStage" style="width:100%;height:clamp(190px,34vh,260px)"></div></div>'
  +'<div class="progressdots" id="ensDots" style="margin:8px 0"></div>'
  +'<div id="ensBody"></div>');
 if(typeof renderScene3D==="function")ENS.stage3d=renderScene3D("ensStage",{pets:[ENS.npcPet,ENS.youPet],bg:sc.bg,props:sc.props,sign:sc.ic});
 enStage(0);}
function enDots(){const d=document.getElementById("ensDots");if(d)d.innerHTML=dots(4,ENS.stage+1);}
function enStage(n){
 enStopAll();ENS.stage=n;enDots();
 if(n===0)enWatch();else if(n===1)enWordsStart();else if(n===2)enRoleStart();else if(n===3)enOrderStart();else enFinish();}
function enBody(h){const b=document.getElementById("ensBody");if(b)b.innerHTML=h;}
function enSpeak3d(who,text){if(ENS.stage3d)ENS.stage3d.say(who,Math.min(8,text.length*.07+.8));}

/* ---------- 1) mira y escucha ---------- */
function enBubble(l,i,live){
 const you=l.who===1;
 return '<div id="ensL'+i+'" onclick="enReplayLine('+i+')" style="display:flex;justify-content:'+(you?'flex-end':'flex-start')+';margin:6px 0;cursor:pointer;'+(live?'':'opacity:1')+'"><div style="max-width:84%;padding:9px 12px;border-radius:'+(you?'16px 16px 4px 16px':'16px 16px 16px 4px')+';background:'+(you?'#DBEAFE':'#FEF3C7')+';border:2px solid '+(you?'#93C5FD':'#FCD34D')+'"><div style="font-family:Fredoka;font-weight:600;font-size:1.05rem;line-height:1.3">'+(you?'':'🔊 ')+enEsc(l.en)+'</div><div class="ensEs" style="font-size:.82rem;opacity:.7;margin-top:2px;display:'+(ENS.showEs?'block':'none')+'">'+enEsc(l.es)+'</div></div></div>';}
function enWatch(){
 const lines=ENS.sc.lines;
 enBody('<div class="card" style="padding:10px 12px"><b>1️⃣ Mira y escucha</b><p class="mut" style="margin:2px 0 6px;font-size:.88rem">Toca ▶ para ver la escena. Toca cualquier frase para oírla otra vez.</p>'
  +'<div id="ensChat">'+lines.map(function(l,i){return enBubble(l,i);}).join("")+'</div></div>'
  +'<button class="kbtn blue" onclick="enPlayAll()">▶ Reproducir la escena</button>'
  +'<button class="kbtn white" style="min-height:44px;font-size:.95rem" onclick="enToggleEs()">🇪🇸 Mostrar / ocultar español</button>'
  +'<button class="kbtn green" onclick="enStage(1)">Siguiente: palabras →</button>');}
function enToggleEs(){ENS.showEs=!ENS.showEs;document.querySelectorAll(".ensEs").forEach(function(e){e.style.display=ENS.showEs?"block":"none";});}
function enHi(i,on){const e=document.getElementById("ensL"+i);if(e)e.firstChild.style.boxShadow=on?"0 0 0 4px #3B82F6":"none";}
function enReplayLine(i){const l=ENS.sc.lines[i];if(!l)return;enStopAll();enHi(i,true);enSpeak3d(l.who===1?1:0,l.en);enSay(l.en,function(){enHi(i,false);});}
function enPlayAll(){
 enStopAll();let i=0;
 const step=function(){
  if(ENS.stage!==0)return;
  if(i>=ENS.sc.lines.length){return;}
  const l=ENS.sc.lines[i],k=i;i++;
  enHi(k,true);const e=document.getElementById("ensL"+k);if(e)e.scrollIntoView({block:"nearest",behavior:"smooth"});
  enSpeak3d(l.who===1?1:0,l.en);
  enSay(l.en,function(){enHi(k,false);enLater(step,350);});};
 step();}

/* ---------- 2) palabras (oído → imagen, imagen → palabra) ---------- */
function enWordsStart(){
 const v=ENS.sc.vocab.slice();
 ENS.wq=shuffled(v).map(function(w,i){return{w:w,type:i%2};});ENS.wi=0;ENS.total+=ENS.wq.length;ENS.wTried=false;
 enWordRound();}
function enWordRound(){
 if(ENS.wi>=ENS.wq.length)return enStage(2);
 const q=ENS.wq[ENS.wi],all=ENS.sc.vocab;
 const others=shuffled(all.filter(function(x){return x[0]!==q.w[0];})).slice(0,q.type?2:3);
 const opts=shuffled(others.concat([q.w]));ENS.wOpts=opts;ENS.wTried=false;
 const head=q.type===0
  ?'<button class="speaker" onclick="enSay(\''+enJs(q.w[0])+'\')"><span class="ic">🔊</span> Escucha la palabra</button><div class="ensOpts" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">'+opts.map(function(o,k){return '<button class="kbtn white" id="ensW'+k+'" style="font-size:2.4rem;min-height:84px" onclick="enWordAns('+k+')">'+o[2]+'</button>';}).join("")+'</div>'
  :'<div class="card center" style="padding:10px"><div style="font-size:4rem">'+q.w[2]+'</div><div class="mut">'+esc(q.w[1])+'</div></div><p class="center" style="margin:4px 0">¿Cómo se dice en inglés?</p>'+opts.map(function(o,k){return '<button class="kbtn white" id="ensW'+k+'" style="min-height:52px" onclick="enWordAns('+k+')">🔊 '+esc(o[0])+'</button>';}).join("");
 enBody('<div class="card" style="padding:10px 12px"><b>2️⃣ Palabras</b> <span class="mut" style="font-size:.85rem">('+(ENS.wi+1)+'/'+ENS.wq.length+')</span></div>'+head+'<div id="ensFb"></div>');
 if(q.type===0)enLater(function(){enSay(q.w[0]);},300);}
function enWordAns(k){
 const q=ENS.wq[ENS.wi];if(!q||q.done)return;
 const ok=ENS.wOpts[k][0]===q.w[0];
 const b=document.getElementById("ensW"+k);
 if(q.type===1)speakEN(ENS.wOpts[k][0]);
 if(ok){q.done=true;if(!ENS.wTried)ENS.ok++;enSrs(q.w[0],q.w[1],q.w[2],!ENS.wTried);save();sOK();if(b)b.style.background="#86EFAC";
  enBody0Fb('✅ '+esc(q.w[0])+' = '+esc(q.w[1]),true);speakEN(q.w[0]);
  enLater(function(){ENS.wi++;enWordRound();},1400);}
 else{ENS.wTried=true;sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}enBody0Fb('Casi… ¡inténtalo otra vez!',false);}}
function enBody0Fb(t,ok){const f=document.getElementById("ensFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(ok?'#16A34A':'#DC2626')+'">'+t+'</p>';}

/* ---------- 3) tú eres el protagonista ---------- */
function enRoleStart(){
 ENS.li=0;ENS.roleTried=false;ENS.chat=[];
 ENS.total+=ENS.sc.lines.filter(function(l){return l.who===1;}).length;
 enRoleNext();}
function enRoleChat(){return ENS.chat.map(function(i){return enBubble(ENS.sc.lines[i],i,true);}).join("");}
function enRoleNext(){
 const lines=ENS.sc.lines;
 if(ENS.li>=lines.length)return enStage(3);
 const l=lines[ENS.li],i=ENS.li;
 if(l.who===0){
  ENS.chat.push(i);ENS.li++;
  enBody('<div class="card" style="padding:10px 12px"><b>3️⃣ ¡Tú eres el protagonista!</b></div><div class="card" style="padding:8px 12px" id="ensChat">'+enRoleChat()+'</div>');
  enSpeak3d(0,l.en);
  enSay(l.en,function(){enLater(enRoleNext,300);});
  return;}
 /* turno del niño: 3 respuestas posibles */
 const mine=lines.filter(function(x){return x.who===1&&x.en!==l.en;});
 const wrong=shuffled(mine).slice(0,2);
 ENS.rOpts=shuffled(wrong.concat([l]));ENS.roleTried=false;
 enBody('<div class="card" style="padding:10px 12px"><b>3️⃣ ¡Tú eres el protagonista!</b> <span class="mut" style="font-size:.85rem">Elige qué responder</span></div>'
  +'<div class="card" style="padding:8px 12px" id="ensChat">'+enRoleChat()+'</div>'
  +ENS.rOpts.map(function(o,k){return '<button class="kbtn white" id="ensR'+k+'" style="min-height:54px;font-size:1rem;text-align:left" onclick="enRoleAns('+k+')">🔊 '+enEsc(o.en)+(ENS.showEs?'<br><span style="font-size:.78rem;opacity:.7;font-weight:500">'+enEsc(o.es)+'</span>':'')+'</button>';}).join("")
  +'<div id="ensFb"></div>');}
function enRoleAns(k){
 const l=ENS.sc.lines[ENS.li],o=ENS.rOpts[k],b=document.getElementById("ensR"+k);
 if(!o||ENS.rDone)return;
 if(o.en!==l.en){ENS.roleTried=true;sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}speakEN(o.en);enBody0Fb('Escucha otra vez lo que dijo el personaje y piensa 🤔',false);return;}
 ENS.rDone=true;if(!ENS.roleTried)ENS.ok++;sOK();confetti(6);
 ENS.chat.push(ENS.li);ENS.li++;
 const mic=typeof micAvailable==="function"&&micAvailable();
 enBody('<div class="card" style="padding:10px 12px"><b>3️⃣ ¡Muy bien!</b></div><div class="card" style="padding:8px 12px" id="ensChat">'+enRoleChat()+'</div>'
  +(mic?'<button class="kbtn yellow" id="ensMic" style="min-height:50px" onclick="enMic('+(ENS.li-1)+')">🎤 Dilo tú con tu voz</button>':'')
  +'<div id="ensFb"></div><button class="kbtn green" onclick="ENS.rDone=false;enRoleNext()">Continuar →</button>');
 enSpeak3d(1,l.en);enSay(l.en);}
function enMic(i){
 const l=ENS.sc.lines[i];if(!l||ENS.listening)return;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
 const rec=new SR();rec.lang="en-US";rec.maxAlternatives=5;rec.interimResults=false;
 ENS.listening=true;enStopAll();
 const btn=document.getElementById("ensMic");if(btn)btn.textContent="🔴 Te escucho… ¡habla!";
 let got=false;
 rec.onresult=function(e){got=true;ENS.listening=false;
  const alts=[];for(let k=0;k<e.results[0].length;k++)alts.push(e.results[0][k].transcript);
  const target=enFill(l.en).replace(/[.,!?]/g,"");
  const words=normSpeech(target).split(" ").filter(Boolean);
  let best=0;alts.forEach(function(a){const h=normSpeech(a).split(" ");const n=words.filter(function(w){return h.some(function(x){return x===w||lev(x,w)<=(w.length<=4?1:2);});}).length;if(n>best)best=n;});
  const ok=best>=Math.ceil(words.length*.7);
  recordAnswer("Pronunciación",ok,15);
  if(ok){sOK();confetti(14);enBody0Fb('🎉 ¡Excelente pronunciación!',true);ENS.mic=(ENS.mic||0)+1;}
  else{sNO();enBody0Fb('Escuché “'+esc(alts[0]||"…")+'”. Oye al personaje y prueba otra vez 🔊',false);}
  if(btn)btn.textContent="🎤 Intentar otra vez";};
 rec.onerror=function(){ENS.listening=false;if(btn)btn.textContent="🎤 Dilo tú con tu voz";};
 rec.onend=function(){ENS.listening=false;if(!got&&btn)btn.textContent="🎤 No te escuché — toca y habla";};
 try{rec.start();}catch(e){ENS.listening=false;}}

/* ---------- 4) ordena la frase ---------- */
function enOrderStart(){
 const cand=ENS.sc.lines.filter(function(l){const n=enFill(l.en).split(" ").length;return l.who===1&&n>=3&&n<=8;});
 ENS.oq=shuffled(cand).slice(0,2);ENS.oi=0;ENS.total+=ENS.oq.length;enOrderRound();}
function enOrderRound(){
 if(ENS.oi>=ENS.oq.length)return enStage(4);
 const l=ENS.oq[ENS.oi],words=enFill(l.en).split(" ");
 ENS.oWords=words;ENS.oPool=shuffled(words.map(function(w,i){return{w:w,i:i};}));
 /* si quedó en el mismo orden, mézclalo otra vez */
 if(ENS.oPool.every(function(x,k){return x.i===k;})&&words.length>1)ENS.oPool.reverse();
 ENS.oPick=[];ENS.oTried=false;enOrderDraw();}
function enOrderDraw(){
 const l=ENS.oq[ENS.oi];
 enBody('<div class="card" style="padding:10px 12px"><b>4️⃣ Ordena la frase</b> <span class="mut" style="font-size:.85rem">('+(ENS.oi+1)+'/'+ENS.oq.length+')</span><p style="margin:6px 0 0">'+enEsc(l.es)+'</p></div>'
  +'<button class="speaker small" onclick="enSay(\''+enJs(l.en)+'\')">🔊 Escúchala</button>'
  +'<div class="card" style="min-height:64px;display:flex;flex-wrap:wrap;gap:6px;padding:10px;background:#F1F5F9">'+(ENS.oPick.length?ENS.oPick.map(function(x,k){return '<button class="kbtn blue" style="width:auto;margin:0;padding:8px 12px;min-height:44px;font-size:1.05rem" onclick="enOrderUndo('+k+')">'+esc(x.w)+'</button>';}).join(""):'<span class="mut">Toca las palabras en orden 👇</span>')+'</div>'
  +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0">'+ENS.oPool.map(function(x,k){return '<button class="kbtn white" style="width:auto;margin:0;padding:8px 14px;min-height:46px;font-size:1.1rem" onclick="enOrderTap('+k+')">'+esc(x.w)+'</button>';}).join("")+'</div>'
  +'<div id="ensFb"></div>');}
function enOrderTap(k){
 const x=ENS.oPool.splice(k,1)[0];if(!x)return;ENS.oPick.push(x);speakEN(x.w);
 if(ENS.oPool.length===0){
  const got=ENS.oPick.map(function(y){return y.w;}).join(" "),want=ENS.oWords.join(" ");
  if(got===want){if(!ENS.oTried)ENS.ok++;sOK();confetti(14);enOrderDraw();enBody0Fb('✅ ¡Perfecto!',true);enSay(want);
   enLater(function(){ENS.oi++;enOrderRound();},1900);return;}
  ENS.oTried=true;sNO();enOrderDraw();enBody0Fb('Casi… ¡las devuelvo para que lo intentes otra vez!',false);
  enLater(function(){ENS.oPool=shuffled(ENS.oPick);ENS.oPick=[];enOrderDraw();},1400);return;}
 enOrderDraw();}
function enOrderUndo(k){const x=ENS.oPick.splice(k,1)[0];if(x)ENS.oPool.push(x);enOrderDraw();}

/* ---------- fin de la escena ---------- */
function enFinish(){
 enStopAll();
 const stars=starsFor(ENS.ok,Math.max(1,ENS.total));
 const pr=enProgress(),sc=ENS.sc,prev=pr[sc.id]||{stars:0,plays:0};
 pr[sc.id]={stars:Math.max(prev.stars||0,stars),plays:(prev.plays||0)+1};
 recordAnswer("Inglés",stars>=2,40);save();
 if(typeof disposeScene3D==="function")disposeScene3D();
 nodeWin(stars,"Inglés",EN_WIN);}

/* ---------- 🔁 repaso espaciado ---------- */
function enReviewStart(){setTheme("kid");
 enStopAll();
 const due=shuffled(enDueWords()).slice(0,8);
 if(!due.length){
  const n=Object.keys(enWords()).length;
  render(topbar("screenEnglishScenes()")+subHeader("🔁 Repaso de palabras")
   +'<div class="card center"><div style="font-size:3.5rem">'+(n?'🌟':'🌱')+'</div><p style="line-height:1.5">'+(n?'¡Estás al día! Tienes <b>'+n+'</b> palabras guardadas. Vuelve mañana: las palabras difíciles regresan pronto y las fáciles tardan más.':'Todavía no hay palabras. Juega una escena y las palabras nuevas aparecerán aquí para repasarlas justo cuando las ibas a olvidar.')+'</p></div>'
   +'<button class="kbtn green" onclick="screenEnglishScenes()">Ir a las escenas</button>');return;}
 const w=enWords();
 ENS={rv:due.map(function(k,i){return{k:k,type:i%2,es:w[k].es,ic:w[k].ic};}),ri:0,ok:0,timers:[],mode:"review"};
 enReviewRound();}
function enReviewRound(){
 if(ENS.ri>=ENS.rv.length){
  const stars=starsFor(ENS.ok,ENS.rv.length);recordAnswer("Inglés",stars>=2,30);save();nodeWin(stars,"Inglés",EN_WIN);return;}
 const q=ENS.rv[ENS.ri],pool=Object.keys(enWords()).concat(EN_SCENES.reduce(function(a,s){return a.concat(s.vocab.map(function(v){return v[0];}));},[]));
 const uniq=pool.filter(function(x,i){return pool.indexOf(x)===i&&x!==q.k;});
 const allV={};EN_SCENES.forEach(function(s){s.vocab.forEach(function(v){allV[v[0]]=v;});});
 const wr=enWords();Object.keys(wr).forEach(function(k){if(!allV[k])allV[k]=[k,wr[k].es,wr[k].ic];});
 const others=shuffled(uniq).slice(0,q.type?2:3).map(function(k){return allV[k];}).filter(Boolean);
 const me=[q.k,q.es,q.ic];ENS.rOptsV=shuffled(others.concat([me]));q.tried=false;q.done=false;
 const head=q.type===0
  ?'<button class="speaker" onclick="enSay(\''+enJs(q.k)+'\')"><span class="ic">🔊</span> Escucha la palabra</button><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">'+ENS.rOptsV.map(function(o,k){return '<button class="kbtn white" id="ensV'+k+'" style="font-size:2.4rem;min-height:84px" onclick="enReviewAns('+k+')">'+o[2]+'</button>';}).join("")+'</div>'
  :'<div class="card center" style="padding:10px"><div style="font-size:4rem">'+q.ic+'</div><div class="mut">'+esc(q.es)+'</div></div><p class="center" style="margin:4px 0">¿Cómo se dice en inglés?</p>'+ENS.rOptsV.map(function(o,k){return '<button class="kbtn white" id="ensV'+k+'" style="min-height:52px" onclick="enReviewAns('+k+')">🔊 '+esc(o[0])+'</button>';}).join("");
 render(topbar("screenEnglishScenes()")+'<div class="progressdots">'+dots(ENS.rv.length,ENS.ri)+'</div>'+subHeader("🔁 Repaso")+head+'<div id="ensFb"></div>');
 if(q.type===0)enLater(function(){enSay(q.k);},300);}
function enReviewAns(k){
 const q=ENS.rv[ENS.ri];if(!q||q.done)return;const o=ENS.rOptsV[k],b=document.getElementById("ensV"+k);
 if(q.type===1)speakEN(o[0]);
 if(o[0]===q.k){q.done=true;if(!q.tried)ENS.ok++;enSrs(q.k,q.es,q.ic,!q.tried);save();sOK();if(b)b.style.background="#86EFAC";enBody0Fb('✅ '+esc(q.k)+' = '+esc(q.es),true);speakEN(q.k);enLater(function(){ENS.ri++;enReviewRound();},1400);}
 else{q.tried=true;sNO();if(b){b.style.background="#FCA5A5";b.disabled=true;}enBody0Fb('Casi… ¡inténtalo otra vez!',false);}}

/* ---------- ⚔️ duelo de palabras ---------- */
function enDuelStart(){setTheme("kid");
 enStopAll();
 const pool=[];EN_SCENES.forEach(function(s){s.vocab.forEach(function(v){pool.push(v);});});
 const wr=enWords();/* prioriza palabras que ya vio */
 const seen=pool.filter(function(v){return wr[v[0]];}),rest=pool.filter(function(v){return !wr[v[0]];});
 const pick6=shuffled(seen).slice(0,4).concat(shuffled(rest)).slice(0,6);
 ENS={mode:"duel",dq:pick6,di:0,me:0,bot:0,pool:pool,timers:[]};
 render(topbar("screenEnglishScenes()")+subHeader("⚔️ Duelo de palabras")
  +'<div class="card center"><div style="font-size:3.5rem">🤖⚔️🧒</div><p style="line-height:1.5;margin:6px 0">Vas contra el <b>Robo-Rival</b>. Te muestro una imagen: ¡toca primero la palabra correcta en inglés!<br>Si aciertas antes que el robot, ganas el punto.</p></div>'
  +'<button class="kbtn green" onclick="enDuelRound()">¡Empezar el duelo!</button>');}
function enDuelRound(){
 if(ENS.di>=ENS.dq.length)return enDuelEnd();
 const q=ENS.dq[ENS.di];
 const opts=shuffled(shuffled(ENS.pool.filter(function(v){return v[0]!==q[0];})).slice(0,3).concat([q]));
 ENS.dopts=opts;ENS.dstate="open";
 render(topbar("screenEnglishScenes()")
  +'<div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:8px 14px;font-family:Fredoka;font-weight:700"><span>🧒 Tú: '+ENS.me+'</span><span>Ronda '+(ENS.di+1)+'/'+ENS.dq.length+'</span><span>🤖 Robot: '+ENS.bot+'</span></div>'
  +'<div class="card center" style="padding:10px"><div style="font-size:4.2rem">'+q[2]+'</div><div class="mut">'+esc(q[1])+'</div></div>'
  +'<div style="height:10px;background:#E5E7EB;border-radius:6px;overflow:hidden;margin:2px 0 8px"><div id="ensBot" style="height:100%;width:0;background:#EF4444;transition:width 4s linear"></div></div>'
  +opts.map(function(o,k){return '<button class="kbtn white" id="ensD'+k+'" style="min-height:52px" onclick="enDuelAns('+k+')">'+esc(o[0])+'</button>';}).join("")
  +'<div id="ensFb"></div>');
 enLater(function(){const b=document.getElementById("ensBot");if(b)b.style.width="100%";},60);
 /* el robot contesta entre 2.5 y 4 s, acierta ~65 % */
 enLater(function(){
  if(ENS.dstate!=="open")return;
  ENS.dstate="closed";
  if(Math.random()<.65){ENS.bot++;sNO();enDuelReveal('🤖 ¡El robot fue más rápido! Era “'+esc(q[0])+'”.',false);}
  else{enDuelReveal('🤖 El robot se equivocó… ¡era “'+esc(q[0])+'”! Nadie gana este punto.',null);}
 },2500+Math.random()*1500);}
function enDuelAns(k){
 if(ENS.dstate!=="open")return;const q=ENS.dq[ENS.di];ENS.dstate="closed";
 const o=ENS.dopts[k];speakEN(o[0]);
 if(o[0]===q[0]){ENS.me++;enSrs(q[0],q[1],q[2],true);save();sOK();confetti(10);enDuelReveal('🎉 ¡Punto para ti! “'+esc(q[0])+'”',true);}
 else{enSrs(q[0],q[1],q[2],false);save();sNO();enDuelReveal('Era “'+esc(q[0])+'”. ¡La próxima!',false);}}
function enDuelReveal(msg,good){
 const q=ENS.dq[ENS.di];
 ENS.dopts.forEach(function(o,k){const b=document.getElementById("ensD"+k);if(b){b.disabled=true;if(o[0]===q[0])b.style.background="#86EFAC";}});
 const f=document.getElementById("ensFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:'+(good===true?'#16A34A':good===false?'#DC2626':'#475569')+'">'+msg+'</p>';
 enLater(function(){ENS.di++;enDuelRound();},1900);}
function enDuelEnd(){
 const win=ENS.me>ENS.bot,tie=ENS.me===ENS.bot;
 const stars=win?(ENS.me-ENS.bot>=2?3:2):1;
 recordAnswer("Inglés",win,30);save();
 nodeWin(stars,"Inglés",EN_WIN);}

/* ---------- ✨ escenas nuevas con IA ---------- */
const EN_AI_PLACES=[["🌳","El parque"],["🦁","El zoológico"],["🎬","El cine"],["🏖️","La playa"],["📚","La biblioteca"],["🧸","La tienda de juguetes"],["🍦","La heladería"],["🏥","El hospital de mascotas"]];
function enAiPick(){setTheme("kid");
 render(topbar("screenEnglishScenes()")+subHeader("✨ Escena nueva con IA")
  +'<p class="center" style="margin:-4px 0 10px">Elige un lugar y la IA inventa un diálogo nuevo para ti</p>'
  +EN_AI_PLACES.map(function(p,i){return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="enAiMake('+i+')"><span style="font-size:2rem">'+p[0]+'</span>'+p[1]+'</button>';}).join("")
  +'<div id="ensFb"></div>');}
async function enAiMake(i){
 const pl=EN_AI_PLACES[i];
 const f=document.getElementById("ensFb");if(f)f.innerHTML='<div class="card center"><span class="spin">⏳</span> Inventando la escena…</div>';
 try{
  const o=await geminiJSON('Create a short English dialogue for a child (age 7-10, level A1) set at: '+pl[1]+' (in Spanish). Two speakers alternate: the character (who:0) speaks first, the child (who:1) answers. 8 lines total, each line max 9 words, very simple present tense. Reply ONLY valid JSON, no markdown: {"nm":"Spanish title","en":"English title","npc":"Spanish name and role of the character","props":["emoji","emoji","emoji"],"lines":[{"who":0,"en":"English line","es":"Spanish translation"}],"vocab":[["english word","spanish","emoji"]]} with exactly 6 vocab words that appear in the dialogue.');
  const lines=(o.lines||[]).filter(function(l){return l&&typeof l.en==="string"&&typeof l.es==="string"&&(l.who===0||l.who===1);}).slice(0,10);
  const vocab=(o.vocab||[]).filter(function(v){return Array.isArray(v)&&v.length>=3&&v.slice(0,3).every(function(x){return typeof x==="string"&&x.length<40;});}).slice(0,6);
  if(lines.length<6||lines.filter(function(l){return l.who===1;}).length<3||vocab.length<4)throw new Error("La IA devolvió una escena incompleta. Intenta otra vez.");
  const sc={id:"ia"+Date.now(),ic:pl[0],nm:String(o.nm||pl[1]).slice(0,40),en:String(o.en||"").slice(0,40),bg:["#E0F2FE","#7DD3FC"],props:(Array.isArray(o.props)?o.props:[pl[0],"⭐","🎈"]).slice(0,3).map(function(x){return String(x).slice(0,4);}),npc:String(o.npc||"Tu nuevo amigo").slice(0,40),pets:[Math.floor(Math.random()*10)],lines:lines.map(function(l){return{who:l.who,en:String(l.en).slice(0,90),es:String(l.es).slice(0,110)};}),vocab:vocab.map(function(v){return[String(v[0]).slice(0,24),String(v[1]).slice(0,30),String(v[2]).slice(0,4)];}),ai:true};
  const list=enAiScenes();list.push(sc);if(list.length>8)list.shift();save();
  enSceneStart(EN_SCENES.length+list.length-1);
 }catch(e){const ff=document.getElementById("ensFb");if(ff)ff.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message||"No se pudo crear la escena")+'</div>';}}
