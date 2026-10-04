"use strict";
/* ============ CÁPSULAS (micro-lecciones narradas e ilustradas, estilo "video corto") ============
   Pedido: algo como los fragmentos de video de EWA, hecho con la API de Gemini. Veo (video real)
   se descartó por costo; esto lo reemplaza con una "cápsula": 5 escenas ilustradas que se mueven
   (efecto Ken Burns), narradas con voz y subtituladas, con un GUÍA 3D en la esquina y 2 preguntas
   al final. Todo es ORIGINAL (nada de Among Us, Roblox ni marcas): el guía es uno de los
   personajes 3D de la app.
   - Con clave de IA: Gemini escribe el guion (JSON) y dibuja cada escena (geminiImage). El guion
     se guarda en prof().capsules (liviano); las imágenes van a IndexedDB ("afCapsules") porque
     pesan demasiado para localStorage.
   - Sin clave o sin internet: 3 cápsulas listas (CAP_BUILTIN) con escenas hechas de emojis.
   Prefijos cap y CAP para no chocar con otros archivos. */

const CAP_GUIDES={robo:0,buho:1,mago:2,astro:3};
const CAP_BG=[["#BFE3FF","#7DB8F2"],["#FFE2B8","#F5B56B"],["#D6F5D6","#7ED08A"],["#E3D5FF","#A78BEA"],["#FFD9E6","#F59BBB"]];
const CAP_WIN={noWorld:true,replay:"screenCapsules()",replayLabel:"Más cápsulas 🎞️",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};

const CAP_BUILTIN=[
 {id:"b0",ic:"🌙",title:"Las fases de la Luna",lang:"es",guide:"astro",
  frames:[
   {emo:"🌙🌍",narr:"La Luna es la vecina más cercana de la Tierra. Gira a nuestro alrededor y tarda casi un mes en dar una vuelta completa."},
   {emo:"☀️🌙",narr:"La Luna no tiene luz propia. Brilla porque el Sol la ilumina, como una linterna sobre una pelota."},
   {emo:"🌑🌒🌓",narr:"Mientras la Luna da su vuelta, vemos más o menos de su parte iluminada. Por eso parece que cambia de forma."},
   {emo:"🌓🌕",narr:"Cuando casi no vemos nada, es luna nueva. Cuando vemos el círculo completo, es luna llena."},
   {emo:"🔭✨",narr:"Después de la luna llena, la parte brillante se va haciendo más pequeña otra vez, y el ciclo empieza de nuevo. ¡Mira el cielo esta noche!"}],
  quiz:[{q:"¿Por qué brilla la Luna?",ops:["Porque la ilumina el Sol","Porque tiene bombillos","Porque es de fuego"],a:0,exp:"La Luna refleja la luz del Sol."},
        {q:"¿Cómo se llama la fase en que vemos el círculo completo?",ops:["Luna llena","Luna nueva","Luna pequeña"],a:0,exp:"Es la luna llena."}]},
 {id:"b1",ic:"🍎",title:"Fruits in English",lang:"en",guide:"mago",
  frames:[
   {emo:"🍎",narr:"This is an apple. The apple is red. I like apples!",sub:"Esto es una manzana. La manzana es roja. ¡Me gustan las manzanas!"},
   {emo:"🍌",narr:"This is a banana. The banana is yellow. Bananas are long.",sub:"Esto es un plátano. El plátano es amarillo. Los plátanos son largos."},
   {emo:"🍇🍓",narr:"Look! Grapes are small. Strawberries are red and sweet.",sub:"¡Mira! Las uvas son pequeñas. Las fresas son rojas y dulces."},
   {emo:"🍊",narr:"This is an orange. It is round, and it is orange too! Oranges have a lot of juice.",sub:"Esto es una naranja. Es redonda, ¡y también es de color naranja! Las naranjas tienen mucho jugo."},
   {emo:"🧺🍎🍌🍊",narr:"I have a basket of fruit. What is your favorite fruit?",sub:"Tengo una canasta de frutas. ¿Cuál es tu fruta favorita?"}],
  vocab:[["apple","manzana","🍎"],["banana","plátano","🍌"],["grapes","uvas","🍇"],["strawberry","fresa","🍓"],["orange","naranja","🍊"]],
  quiz:[{q:"¿De qué color es la banana (banana)?",ops:["Yellow","Red","Blue"],a:0,exp:"Banana = yellow (amarillo)."},
        {q:"¿Cómo se dice “naranja” (la fruta) en inglés?",ops:["Orange","Apple","Grapes"],a:0,exp:"Naranja se dice orange."}]},
 {id:"b2",ic:"🧠",title:"Trucos para aprender más rápido",lang:"es",guide:"buho",
  frames:[
   {emo:"🧠💡",narr:"Tu cerebro olvida muchas cosas si las ve una sola vez. Pero hay trucos para que se queden."},
   {emo:"🔁📅",narr:"El primero se llama repaso espaciado: repasas hoy, mañana, en unos días y luego en una semana. Cada repaso hace el recuerdo más fuerte."},
   {emo:"🏰🗝️",narr:"El segundo es el palacio de la memoria. Imagina tu casa y deja cada cosa que quieres recordar en un cuarto, como un juguete olvidado."},
   {emo:"🎤😄",narr:"El tercero es explicárselo a alguien. Si puedes enseñarlo con tus propias palabras, ya lo aprendiste."},
   {emo:"😴⭐",narr:"Y dormir bien también ayuda: mientras duermes, tu cerebro guarda lo que aprendiste. ¡Buenas noches y buen estudio!"}],
  quiz:[{q:"¿Qué es el repaso espaciado?",ops:["Repasar poco a poco en varios días","Estudiar todo en una sola noche","No volver a mirar el tema"],a:0,exp:"Repasar en días distintos fija el recuerdo."},
        {q:"¿Qué puedes hacer para recordar mejor?",ops:["Explicárselo a alguien","Taparte los ojos","Dormir muy poco"],a:0,exp:"Enseñar lo que aprendes ayuda a recordarlo."}]}
];

const CAP_TOPICS=[
 ["🪐","El viaje de un rayo de Sol","es","astro"],["🌋","Cómo funciona un volcán","es","robo"],["🦕","Los dinosaurios","es","buho"],
 ["🌧️","El ciclo del agua","es","mago"],["🚀","Cómo llega un cohete al espacio","es","astro"],["🦈","Ocean animals","en","buho"],
 ["🍕","Ordering food in English","en","mago"],["🏙️","Places in the city","en","robo"]];

let CAPS={timers:[],img:{}};
let CAP_RUN=0; /* id de reproducción: invalida temporizadores/imágenes de pantallas anteriores */

/* ---------- guardado de imágenes (IndexedDB) ---------- */
function capDb(){return new Promise(function(res,rej){try{const r=indexedDB.open("afCapsules",1);r.onupgradeneeded=function(){r.result.createObjectStore("img");};r.onsuccess=function(){res(r.result);};r.onerror=function(){rej(r.error);};}catch(e){rej(e);}});}
async function capImgPut(k,v){try{const db=await capDb();await new Promise(function(res,rej){const tx=db.transaction("img","readwrite");tx.objectStore("img").put(v,k);tx.oncomplete=res;tx.onerror=rej;});}catch(e){}}
async function capImgGet(k){try{const db=await capDb();return await new Promise(function(res){const rq=db.transaction("img","readonly").objectStore("img").get(k);rq.onsuccess=function(){res(rq.result||null);};rq.onerror=function(){res(null);};});}catch(e){return null;}}
async function capImgDelAll(id){try{const db=await capDb();const st=db.transaction("img","readwrite").objectStore("img");for(let i=0;i<8;i++)st.delete(id+":"+i);}catch(e){}}

/* ---------- datos ---------- */
function capSaved(){const p=prof();if(!p.capsules)p.capsules=[];return p.capsules;}
function capAll(){return CAP_BUILTIN.concat(capSaved());}
function capFind(id){return capAll().find(function(c){return c.id===id;});}
function capDone(){const p=prof();if(!p.capDone)p.capDone={};return p.capDone;}
function capStopAll(){CAPS.timers.forEach(clearTimeout);CAPS.timers=[];try{window.speechSynthesis.cancel();}catch(e){}if(typeof stopGemAudio==="function")stopGemAudio();}
function capCleanup(){CAP_RUN++;capStopAll();CAPS.cap=null;}
function capLater(fn,ms,run){const t=setTimeout(function(){if(run===CAP_RUN)fn();},ms);CAPS.timers.push(t);return t;}

/* ---------- pantalla de cápsulas ---------- */
function screenCapsules(){setTheme("kid");
 capCleanup();
 const done=capDone();
 const card=function(cls,ic,t,sub,fn,badge){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+sub+'</span></span>'+(badge?'<span style="font-size:1.2rem">'+badge+'</span>':'')+'</button>';};
 const list=capAll().map(function(c,i){return card(["blue","green","purple","yellow","red"][i%5],c.ic,esc(c.title),(c.lang==="en"?"🇬🇧 En inglés · ":"🇪🇸 ")+(c.frames.length)+" escenas",'capOpen(\''+c.id+'\')',done[c.id]?"✅":"")+(c.id.charAt(0)==="s"?'<button class="kbtn white" style="min-height:34px;font-size:.78rem;margin:-6px 0 10px;padding:4px" onclick="capDelete(\''+c.id+'\')">🗑️ Borrar esta cápsula</button>':"");}).join("");
 render(topbar("screenKidMap()")+subHeader("🎞️ Cápsulas")
  +'<p class="center" style="margin:-4px 0 10px">Mini-lecciones con dibujos, voz y un guía 3D. ¡Mira, escucha y responde!</p>'
  +list
  +(S.geminiKey
   ?'<p class="appsec" style="margin-top:14px">✨ Crea una cápsula nueva con IA</p>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+CAP_TOPICS.map(function(t,i){return '<button class="kbtn white" style="font-size:.9rem;min-height:64px;padding:8px;text-align:center" onclick="capCreate('+i+')"><span style="font-size:1.6rem">'+t[0]+'</span><br>'+esc(t[1])+'</button>';}).join("")+'</div>'
    +'<div class="card" style="margin-top:10px"><b>🔎 ¿Sobre qué quieres aprender?</b><input id="capTopic" maxlength="60" placeholder="Ej: los pulpos, el arcoíris…" style="width:100%;font-size:1.05rem;padding:10px;border-radius:12px;border:2px solid #E5E7EB;margin:8px 0;box-sizing:border-box"><div style="display:flex;gap:8px"><button class="kbtn green" style="margin:0;font-size:.95rem;min-height:48px" onclick="capCreateCustom(\'es\')">🇪🇸 En español</button><button class="kbtn blue" style="margin:0;font-size:.95rem;min-height:48px" onclick="capCreateCustom(\'en\')">🇬🇧 In English</button></div></div>'
   :'<p class="center mut" style="font-size:.82rem;margin-top:12px">✨ Con la clave de IA (papá o mamá) se pueden crear cápsulas nuevas sobre cualquier tema.</p>')
  +'<div id="capGenFb"></div>');}

function capOpen(id){
 const cap=capFind(id);if(!cap)return;
 capPlay(cap);
 if(cap.id.charAt(0)==="s"&&S.geminiKey)capLoadImages(cap);}

/* ---------- reproductor ---------- */
function capPlay(cap){setTheme("kid");
  const gi=CAP_GUIDES[cap.guide]!=null?CAP_GUIDES[cap.guide]:3;
 render(topbar("screenCapsules()")
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin:0 0 6px">'+cap.ic+' '+esc(cap.title)+'</h2>'
  +'<div id="capStage" style="position:relative;width:100%;aspect-ratio:16/9;border-radius:18px;overflow:hidden;background:#1E293B;box-shadow:0 6px 0 rgba(30,42,74,.35)">'
   +'<div id="capImg" style="position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity .6s"></div>'
   +'<div id="capEmo" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-left:18%;box-sizing:border-box;font-size:clamp(3rem,17vw,6rem);transition:opacity .5s"></div>'
   +'<div id="capGuide" style="position:absolute;left:2px;bottom:0;width:27%;height:66%;pointer-events:none"></div>'
  +'</div>'
  +'<div id="capBar" style="display:flex;gap:4px;margin:8px 0">'+cap.frames.map(function(f,i){return '<i style="flex:1;height:6px;border-radius:3px;background:#CBD5E1"></i>';}).join("")+'</div>'
  +'<div class="card" id="capSub" style="min-height:70px;font-size:1.02rem;line-height:1.45"></div>'
  +'<div id="capCtl" style="display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:8px">'
   +'<button class="kbtn white" style="margin:0;min-height:52px" onclick="capGo(-1)" aria-label="Escena anterior">⏮</button>'
   +'<button class="kbtn green" id="capPP" style="margin:0;min-height:52px" onclick="capToggle()">⏸ Pausa</button>'
   +'<button class="kbtn white" style="margin:0;min-height:52px" onclick="capGo(1)" aria-label="Escena siguiente">⏭</button></div>'
  +(cap.lang==="en"?'<button class="kbtn white" style="min-height:44px;font-size:.9rem;margin-top:8px" onclick="capToggleSub()">🇪🇸 Mostrar / ocultar español</button>':'')
  +'<div id="capBody"></div>');
 /* el estado se fija DESPUÉS de render(): topbar() llama stopGames() y eso limpia CAPS */
 CAPS.cap=cap;CAPS.i=0;CAPS.paused=false;CAPS.showSub=true;CAPS.run=CAP_RUN;CAPS.start=0;
 if(typeof render3DGuide==="function")render3DGuide("capGuide",gi);
 capImgsFromMemory(cap);
 capFrame(0);}

function capImgKey(cap,i){return cap.id+":"+i;}
function capImgsFromMemory(cap){
 /* trae del almacenamiento local las imágenes ya dibujadas de esta cápsula */
 cap.frames.forEach(function(f,i){
  const k=capImgKey(cap,i);if(CAPS.img[k])return;
  capImgGet(k).then(function(v){if(v){CAPS.img[k]=v;if(CAPS.cap===cap&&CAPS.i===i)capShowImg(cap,i);}});});}
function capShowImg(cap,i){
 const k=capImgKey(cap,i),el=document.getElementById("capImg"),em=document.getElementById("capEmo");
 if(!el)return;
 if(CAPS.img[k]){
  el.style.backgroundImage='url("'+CAPS.img[k]+'")';
  el.style.animation="none";void el.offsetWidth;el.style.animation=(i%2?"capKenB":"capKenA")+" 16s ease-in-out forwards";
  el.style.opacity="1";if(em)em.style.opacity="0";}
 else{el.style.opacity="0";if(em)em.style.opacity="1";}}

function capFrame(i){
 const cap=CAPS.cap;if(!cap)return;
 capStopAll();const run=CAP_RUN;
 if(i>=cap.frames.length)return capQuizStart();
 if(i<0)i=0;
 CAPS.i=i;const f=cap.frames[i],bg=CAP_BG[i%CAP_BG.length];
 const st=document.getElementById("capStage");if(st)st.style.background="linear-gradient(135deg,"+bg[0]+","+bg[1]+")";
 const em=document.getElementById("capEmo");
 if(em){em.textContent=f.emo||cap.ic;em.style.animation="bob 2.4s ease-in-out infinite alternate";}
 capShowImg(cap,i);
 document.querySelectorAll("#capBar i").forEach(function(b,k){b.style.background=k<i?"#22C55E":k===i?"#3B82F6":"#CBD5E1";});
 capSubDraw();
 const t0=Date.now();CAPS.start=t0;
 const minMs=Math.max(3200,String(f.narr).length*62);
 let fin=false;
 const next=function(){if(fin||run!==CAP_RUN||CAPS.paused)return;fin=true;
  const wait=Math.max(400,minMs-(Date.now()-t0));capLater(function(){capFrame(i+1);},wait,run);};
 if(CAPS.paused)return;
 const say=cap.lang==="en"?speakEN:speakES;
 say(f.narr,next);
 capLater(next,Math.min(16000,String(f.narr).length*130+2500),run);}
function capSubDraw(){
 const cap=CAPS.cap,el=document.getElementById("capSub");if(!cap||!el)return;
 const f=cap.frames[CAPS.i];
 el.innerHTML=cap.lang==="en"
  ?'<div style="font-family:Fredoka;font-weight:600;font-size:1.12rem">'+esc(f.narr)+'</div>'+(CAPS.showSub&&f.sub?'<div style="opacity:.7;font-size:.88rem;margin-top:4px">'+esc(f.sub)+'</div>':'')
  :'<div style="font-family:Fredoka;font-weight:600">'+esc(f.narr)+'</div>';}
function capToggleSub(){CAPS.showSub=!CAPS.showSub;capSubDraw();}
function capGo(d){if(!CAPS.cap)return;CAPS.paused=false;const b=document.getElementById("capPP");if(b)b.textContent="⏸ Pausa";capFrame(Math.max(0,CAPS.i+d));}
function capToggle(){
 if(!CAPS.cap)return;CAPS.paused=!CAPS.paused;
 const b=document.getElementById("capPP");
 if(CAPS.paused){capStopAll();if(b)b.textContent="▶ Seguir";}
 else{if(b)b.textContent="⏸ Pausa";capFrame(CAPS.i);}}

/* ---------- preguntas al final ---------- */
function capQuizStart(){
 const cap=CAPS.cap;if(!cap)return;
 CAPS.qi=0;CAPS.ok=0;
 document.querySelectorAll("#capBar i").forEach(function(b){b.style.background="#22C55E";});
 const ctl=document.getElementById("capCtl");if(ctl)ctl.style.display="none";
 capQuizRound();}
function capQuizRound(){
 const cap=CAPS.cap,q=cap.quiz[CAPS.qi];
 if(!q)return capFinish();
 CAPS.ops=shuffled(q.ops.map(function(o,i){return{t:o,ok:i===q.a};}));CAPS.qa=false;
 const body=document.getElementById("capBody");
 body.innerHTML='<div class="card" style="margin-top:10px"><b>🧩 Pregunta '+(CAPS.qi+1)+' de '+cap.quiz.length+'</b><p style="margin:6px 0 0;font-weight:700">'+esc(q.q)+'</p></div>'
  +CAPS.ops.map(function(o,i){return '<button class="kbtn white" id="capQ'+i+'" style="min-height:52px" onclick="capQuizAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'<div id="capFb"></div>';
 body.scrollIntoView({block:"nearest",behavior:"smooth"});
 speakES(q.q);}
function capQuizAns(i){
 if(CAPS.qa)return;CAPS.qa=true;
 const cap=CAPS.cap,q=cap.quiz[CAPS.qi],ok=CAPS.ops[i].ok,b=document.getElementById("capQ"+i);
 recordAnswer(cap.lang==="en"?"Inglés":"Ciencias",ok,15);
 if(ok){CAPS.ok++;sOK();confetti(8);if(b)b.style.background="#86EFAC";}else{sNO();if(b)b.style.background="#FCA5A5";CAPS.ops.forEach(function(o,k){if(o.ok){const e=document.getElementById("capQ"+k);if(e)e.style.background="#86EFAC";}});}
 document.getElementById("capFb").innerHTML='<p style="font-weight:700;text-align:center;color:'+(ok?'#16A34A':'#DC2626')+'">'+(ok?'✅ ¡Correcto!':'Casi…')+'</p><p style="text-align:center">💡 '+esc(q.exp||"")+'</p>';
 CAPS.qi++;
 const run=CAP_RUN;capLater(capQuizRound,2200,run);}
function capFinish(){
 const cap=CAPS.cap;if(!cap)return;
 const stars=starsFor(CAPS.ok,Math.max(1,cap.quiz.length));
 capDone()[cap.id]=Math.max(capDone()[cap.id]||0,stars);
 /* las palabras de inglés de la cápsula pasan al repaso espaciado */
 if(cap.vocab&&typeof enWords==="function"){const w=enWords(),d=enDay();cap.vocab.forEach(function(v){if(Array.isArray(v)&&v[0]&&!w[v[0]])w[v[0]]={es:v[1],ic:v[2]||"📝",box:0,due:d};});}
 save();capStopAll();
 if(typeof dispose3DGuide==="function")dispose3DGuide();
 nodeWin(stars,cap.lang==="en"?"Inglés":"Ciencias",CAP_WIN);}

/* ---------- crear con IA ---------- */
function capCreate(i){const t=CAP_TOPICS[i];if(t)capGenerate(t[1],t[2],t[3],t[0]);}
function capCreateCustom(lang){
 const inp=document.getElementById("capTopic"),raw=(inp&&inp.value||"").replace(/[<>"]/g,"").trim().slice(0,60);
 if(raw.length<3){if(inp){inp.focus();inp.style.borderColor="#EF4444";}return;}
 capGenerate(raw,lang,["astro","buho","mago","robo"][Math.floor(Math.random()*4)],"✨");}
function capFb(h){const f=document.getElementById("capGenFb");if(f)f.innerHTML=h;}
async function capGenerate(topic,lang,guide,ic){
 capFb('<div class="card center"><span class="spin">✍️</span> Escribiendo el guion de “'+esc(topic)+'”…</div>');
 const run=CAP_RUN;
 const langRule=lang==="en"
  ?'The narration ("narr") must be in very simple English (CEFR A1, present tense, max 22 words per scene) and "sub" is the Spanish translation. Include "vocab": 4 to 5 key English words as [english, spanish, emoji].'
  :'La narración ("narr") debe estar en español sencillo para un niño de 7 a 10 años (máximo 32 palabras por escena) y "sub" debe ser una cadena vacía.';
 try{
  const o=await geminiJSON('You write a short educational "capsule" (a narrated picture story) for a child aged 7-10 about: "'+topic+'". '
   +'RULES: only facts that are true and appropriate for children; if the topic is inappropriate, unsafe or unclear, write about friendly animals instead; never mention brands, copyrighted characters, violence or scary things. '+langRule
   +' Make exactly 5 scenes that tell a clear story (hook, 3 ideas, wrap-up). For each scene "emo" = 1 to 3 emoji that represent it and "prompt" = a short English description of the picture to draw (cute flat picture-book style, no text). '
   +'Also write exactly 2 multiple-choice questions in Spanish about what was taught: the correct option must ALWAYS be the first in "ops" (index a = 0), 3 options each, and a one-sentence "exp". '
   +'Reply ONLY with valid JSON, no markdown: {"title":"short title","ic":"emoji","frames":[{"narr":"...","sub":"...","emo":"🌍","prompt":"..."}],"vocab":[["word","palabra","emoji"]],"quiz":[{"q":"...","ops":["correcta","otra","otra"],"a":0,"exp":"..."}]}');
  const frames=(o.frames||[]).filter(function(f){return f&&typeof f.narr==="string"&&f.narr.length>8;}).slice(0,6);
  const quiz=(o.quiz||[]).filter(function(q){return q&&typeof q.q==="string"&&Array.isArray(q.ops)&&q.ops.length>=2&&Number.isInteger(q.a)&&q.a>=0&&q.a<q.ops.length;}).slice(0,3);
  if(frames.length<4||quiz.length<1)throw new Error("La IA devolvió una cápsula incompleta. Intenta otra vez.");
  const cap={id:"s"+Date.now(),ic:String(o.ic||ic||"🎞️").slice(0,4),title:String(o.title||topic).slice(0,50),lang:lang,guide:guide,
   frames:frames.map(function(f){return{narr:String(f.narr).slice(0,260),sub:String(f.sub||"").slice(0,300),emo:String(f.emo||"").slice(0,12)||"✨",prompt:String(f.prompt||"").slice(0,220)};}),
   quiz:quiz.map(function(q){return{q:String(q.q).slice(0,160),ops:q.ops.slice(0,3).map(function(x){return String(x).slice(0,80);}),a:q.a,exp:String(q.exp||"").slice(0,160)};}),
   vocab:lang==="en"?(o.vocab||[]).filter(function(v){return Array.isArray(v)&&v.length>=2;}).slice(0,6).map(function(v){return[String(v[0]).slice(0,24),String(v[1]).slice(0,30),String(v[2]||"📝").slice(0,4)];}):[]};
  if(run!==CAP_RUN)return; /* se fue de la pantalla mientras se escribía */
  const list=capSaved();list.push(cap);
  while(list.length>10){const old=list.shift();capImgDelAll(old.id);}
  save();
  capPlay(cap);capLoadImages(cap);
 }catch(e){capFb('<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message||"No se pudo crear la cápsula")+'</div>');}}

/* dibuja una escena a la vez; si la IA de imágenes falla, la escena queda con emojis */
async function capLoadImages(cap){
 const run=CAPS.run;
 let fails=0;
 for(let i=0;i<cap.frames.length;i++){
  if(CAP_RUN!==run||CAPS.cap!==cap)return;
  const k=capImgKey(cap,i);
  if(CAPS.img[k])continue;
  const stored=await capImgGet(k);
  if(stored){CAPS.img[k]=stored;if(CAPS.cap===cap&&CAPS.i===i)capShowImg(cap,i);continue;}
  if(!S.geminiKey||fails>=2)continue;
  try{
   const f=cap.frames[i];
   const url=await geminiImage("Children's picture-book illustration, bright friendly flat colors, cute original characters, wide 16:9 composition, absolutely no text, no letters, no logos. Scene: "+(f.prompt||f.narr)+" (topic: "+cap.title+")");
   CAPS.img[k]=url;capImgPut(k,url);
   if(CAP_RUN===run&&CAPS.cap===cap&&CAPS.i===i)capShowImg(cap,i);
  }catch(e){fails++;}
 }}

function capDelete(id){
 if(!confirm("¿Borrar esta cápsula?"))return;
 const l=capSaved(),k=l.findIndex(function(c){return c.id===id;});if(k>=0){l.splice(k,1);capImgDelAll(id);save();}
 screenCapsules();}
