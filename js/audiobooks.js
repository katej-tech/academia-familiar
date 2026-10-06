"use strict";
/* ============ AUDIOLIBROS POR NIVEL (español e inglés) ============
   Un libro 3D que pasa las páginas solo mientras una voz lee cada frase (la frase se resalta);
   tocar una frase la repite. 3 niveles por idioma (cada nivel: frases más largas y más páginas) y,
   al final, preguntas de comprensión. Con clave de IA se crean audiolibros nuevos (nivel e idioma a
   elegir). Libros originales. Motor 3D: js/book3d.js. Prefijo ab / AB. */

/* tr = traducción al español de la página (solo libros en inglés) */
const AB_BOOKS=[
 {id:"es1",lang:"es",lv:1,ic:"⭐",title:"La estrella que se perdió",pages:[
  {e:"🌟",bg:"#FEF3C7",s:["Había una estrella pequeña.","Se llamaba Lucero."]},
  {e:"🌙",bg:"#E0E7FF",s:["Una noche, Lucero se alejó del cielo.","Quería ver el mundo de cerca."]},
  {e:"🌳",bg:"#DCFCE7",s:["Cayó en un bosque grande y oscuro.","Tenía mucho miedo."]},
  {e:"🦉",bg:"#FDE68A",s:["Un búho sabio la vio brillar.","—No llores, estrella —le dijo."]},
  {e:"🪲",bg:"#CFFAFE",s:["Las luciérnagas hicieron una escalera de luz.","Lucero subió, subió y subió."]},
  {e:"🌌",bg:"#C7D2FE",s:["Volvió a su lugar en el cielo.","Desde entonces, cuida el bosque cada noche."]}],
  quiz:[{q:"¿Cómo se llamaba la estrella?",ops:["Lucero","Luna","Sol"],a:0},{q:"¿Dónde cayó Lucero?",ops:["En un bosque","En el mar","En una casa"],a:0},{q:"¿Quién la ayudó a volver?",ops:["Un búho y las luciérnagas","Un lobo","Un pescador"],a:0}]},
 {id:"es2",lang:"es",lv:2,ic:"🤖",title:"El robot del parque",pages:[
  {e:"🤖",bg:"#E2E8F0",s:["En el parque de mi barrio vive un robot.","Se llama Tico y es de color plateado.","Todas las tardes riega las flores."]},
  {e:"🌧️",bg:"#BFDBFE",s:["Un día empezó a llover muy fuerte.","Los niños corrieron a esconderse.","Tico se quedó quieto bajo la lluvia."]},
  {e:"⚡",bg:"#FEF08A",s:["Sus luces parpadearon y se apagaron.","Los niños lo miraron preocupados.","—¡Tico necesita ayuda! —gritó Sara."]},
  {e:"☂️",bg:"#FBCFE8",s:["Entre todos abrieron sus paraguas sobre él.","Lo secaron con toallas y pañuelos.","Poco a poco, sus luces volvieron a encenderse."]},
  {e:"🌈",bg:"#DDD6FE",s:["Tico dijo con su voz metálica: «Gracias, amigos».","Salió el arcoíris y todos aplaudieron.","Ese día aprendieron que los amigos se cuidan."]},
  {e:"🌷",bg:"#DCFCE7",s:["Desde entonces, los niños ayudan a Tico a regar las flores.","El parque está más bonito que nunca.","Y Tico ya no se siente solo."]}],
  quiz:[{q:"¿Qué hace Tico todas las tardes?",ops:["Riega las flores","Pinta paredes","Cuenta estrellas"],a:0},{q:"¿Por qué se apagaron las luces de Tico?",ops:["Por la lluvia","Por el calor","Porque se durmió"],a:0},{q:"¿Cuál es el mensaje del cuento?",ops:["Los amigos se cuidan","Hay que correr","La lluvia es mala"],a:0}]},
 {id:"es3",lang:"es",lv:3,ic:"🏝️",title:"La isla de los colores",pages:[
  {e:"🏝️",bg:"#CFFAFE",s:["Cuenta una leyenda que, en medio del mar, existía una isla donde vivían los colores.","Cada color tenía su casa: el rojo vivía en el volcán, el azul en el lago y el verde en la selva.","Todos trabajaban juntos para pintar el mundo."]},
  {e:"⛵",bg:"#E0F2FE",s:["Una mañana llegó un velero con una niña llamada Inés.","Venía buscando el color amarillo para pintar el sol de su pueblo.","—Hace meses que el cielo de mi pueblo es gris —explicó, con tristeza."]},
  {e:"🌋",bg:"#FECACA",s:["El rojo, que era el más orgulloso, dijo que no podía ayudarla.","—Yo soy el color más importante —presumió—. Sin mí no habría atardeceres.","El azul y el verde se miraron, incómodos."]},
  {e:"🏔️",bg:"#FEF9C3",s:["Inés caminó hasta la montaña donde dormía el amarillo.","Era un color tímido y le daba miedo salir de su cueva.","—Si me acompañas —susurró—, te daré un poco de mi luz."]},
  {e:"🌅",bg:"#FED7AA",s:["Juntos regresaron a la playa mientras el sol se escondía.","El rojo los vio y comprendió que había sido egoísta.","Se acercó al amarillo y mezcló su color con el suyo: nació el naranja."]},
  {e:"🌈",bg:"#E9D5FF",s:["Los colores aplaudieron al ver el nuevo tono.","Entendieron que, cuando se unen, nacen colores aún más bellos.","Cada uno regaló a Inés una gota de su color."]},
  {e:"☀️",bg:"#FEF08A",s:["Inés volvió a su pueblo y pintó el sol más brillante que jamás se había visto.","Desde ese día, sus vecinos dicen que el cielo sonríe.","Y en la isla, los colores aprendieron a compartir."]}],
  quiz:[{q:"¿Qué buscaba Inés?",ops:["El color amarillo","Una isla","Un velero"],a:0},{q:"¿Por qué el rojo no quería ayudar al principio?",ops:["Se creía el más importante","Estaba enfermo","No conocía el camino"],a:0},{q:"¿Qué color nació al mezclar el rojo con el amarillo?",ops:["Naranja","Verde","Morado"],a:0},{q:"¿Cuál es el mensaje del cuento?",ops:["Compartir y unirse crea cosas más bellas","Hay que ser orgulloso","Los barcos son lentos"],a:0}]},
 {id:"en1",lang:"en",lv:1,ic:"🐶",title:"Max and the Red Ball",pages:[
  {e:"🐶",bg:"#FEF3C7",s:["This is Max.","Max is a little dog."],tr:"Este es Max. Max es un perrito."},
  {e:"🔴",bg:"#FECACA",s:["Max has a red ball.","He loves his red ball."],tr:"Max tiene una pelota roja. Ama su pelota roja."},
  {e:"🏃",bg:"#DCFCE7",s:["Max runs in the park.","The ball goes up, up, up!"],tr:"Max corre en el parque. ¡La pelota sube, sube, sube!"},
  {e:"🌳",bg:"#BBF7D0",s:["Oh no! The ball is in the tree.","Max is sad."],tr:"¡Oh no! La pelota está en el árbol. Max está triste."},
  {e:"👧",bg:"#FBCFE8",s:["A girl comes to help.","She gets the ball with a stick."],tr:"Una niña viene a ayudar. Saca la pelota con un palo."},
  {e:"🎉",bg:"#DDD6FE",s:["Max is happy again.","Thank you, friend!"],tr:"Max está feliz otra vez. ¡Gracias, amiga!"}],
  quiz:[{q:"What color is the ball?",ops:["Red","Blue","Green"],a:0},{q:"Where is the ball?",ops:["In the tree","In the house","In the water"],a:0},{q:"Who helps Max?",ops:["A girl","A cat","A teacher"],a:0}]},
 {id:"en2",lang:"en",lv:2,ic:"🚀",title:"The Little Rocket",pages:[
  {e:"🚀",bg:"#E0E7FF",s:["Leo is a boy who loves space.","In his room, he has a little rocket.","Every night he looks at the stars."],tr:"Leo es un niño que ama el espacio. En su cuarto tiene un cohete pequeño. Cada noche mira las estrellas."},
  {e:"🌙",bg:"#C7D2FE",s:["One night, the rocket starts to shine.","Leo gets inside and closes the door.","Three, two, one… go!"],tr:"Una noche, el cohete empieza a brillar. Leo entra y cierra la puerta. ¡Tres, dos, uno… vamos!"},
  {e:"🌍",bg:"#BAE6FD",s:["The rocket flies very fast.","Leo sees the Earth. It is blue and green.","It looks like a beautiful ball."],tr:"El cohete vuela muy rápido. Leo ve la Tierra. Es azul y verde. Parece una pelota hermosa."},
  {e:"🪐",bg:"#FDE68A",s:["Next, he sees a big planet with rings.","It is Saturn! The rings are made of ice.","Leo takes a photo with his camera."],tr:"Luego ve un planeta grande con anillos. ¡Es Saturno! Los anillos son de hielo. Leo toma una foto con su cámara."},
  {e:"👽",bg:"#BBF7D0",s:["Suddenly, a small green alien waves at him.","—Hello! Do you want to play? —says the alien.","They play with the stars for a long time."],tr:"De pronto, un pequeño alienígena verde lo saluda. —¡Hola! ¿Quieres jugar? —dice. Juegan con las estrellas mucho tiempo."},
  {e:"🛏️",bg:"#FBCFE8",s:["Leo is tired, so he flies back home.","He sleeps in his bed with a big smile.","What a wonderful night!"],tr:"Leo está cansado y vuelve a casa. Duerme en su cama con una gran sonrisa. ¡Qué noche maravillosa!"}],
  quiz:[{q:"What does Leo love?",ops:["Space","Cars","Fish"],a:0},{q:"What color is the Earth?",ops:["Blue and green","Red and yellow","Black and white"],a:0},{q:"Who says hello?",ops:["A green alien","A dog","A teacher"],a:0}]},
 {id:"en3",lang:"en",lv:3,ic:"🔑",title:"The Lost Key",pages:[
  {e:"🏠",bg:"#FEF3C7",s:["Emma lives in a small house near the river.","Every morning she walks to school with her little brother, Noah.","Today, something strange happens."],tr:"Emma vive en una casa pequeña cerca del río. Cada mañana camina a la escuela con su hermanito Noah. Hoy pasa algo extraño."},
  {e:"🔑",bg:"#FDE68A",s:["When they arrive at school, Emma cannot find her key.","She looks in her bag, in her pockets and in her shoes.","The key is not there!"],tr:"Al llegar a la escuela, Emma no encuentra su llave. Busca en su bolso, en sus bolsillos y en sus zapatos. ¡La llave no está!"},
  {e:"🤔",bg:"#E0E7FF",s:["Emma remembers that she had the key at the river.","She was feeding the ducks before school.","Maybe it fell from her pocket."],tr:"Emma recuerda que tenía la llave en el río. Estaba dando de comer a los patos antes de la escuela. Quizás se cayó de su bolsillo."},
  {e:"🦆",bg:"#BAE6FD",s:["After school, the two children run to the river.","The ducks are swimming near the bridge.","One duck is sitting on something shiny."],tr:"Después de la escuela, los dos niños corren al río. Los patos nadan cerca del puente. Un pato está sentado sobre algo brillante."},
  {e:"✨",bg:"#FEF08A",s:["It is the key! The duck is sitting on it.","Noah gives the duck some bread to make it move.","The duck stands up and walks away."],tr:"¡Es la llave! El pato está sentado sobre ella. Noah le da pan al pato para que se mueva. El pato se levanta y se va."},
  {e:"🎒",bg:"#FBCFE8",s:["Emma picks up the key and cleans it with her sleeve.","She puts it in a small pocket inside her bag.","—Now it is safe —she says."],tr:"Emma recoge la llave y la limpia con su manga. La guarda en un bolsillo pequeño dentro de su bolso. —Ahora está segura —dice."},
  {e:"🏡",bg:"#DCFCE7",s:["At home, their mom opens the door and smiles.","—Where were you? —she asks.","Emma tells the story, and everybody laughs."],tr:"En casa, su mamá abre la puerta y sonríe. —¿Dónde estaban? —pregunta. Emma cuenta la historia y todos ríen."}],
  quiz:[{q:"Where does Emma live?",ops:["Near a river","In a big city","On a farm"],a:0},{q:"Where was the key?",ops:["Under a duck","In her shoe","At school"],a:0},{q:"What does Noah give the duck?",ops:["Bread","A toy","Water"],a:0}]}];
const AB_WIN={noWorld:true,replay:"screenAudiobooks()",replayLabel:"Más audiolibros 🎧",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
let AB={timers:[],run:0};

function abSaved(){const p=prof();if(!p.abooks)p.abooks=[];return p.abooks;}
function abAll(){return AB_BOOKS.concat(abSaved());}
function abFind(id){return abAll().find(function(b){return b.id===id;});}
function abDone(){const p=prof();if(!p.abDone)p.abDone={};return p.abDone;}
function abStop(){AB.timers.forEach(clearTimeout);AB.timers=[];try{window.speechSynthesis.cancel();}catch(e){}if(typeof stopGemAudio==="function")stopGemAudio();}
function abCleanup(){AB.run++;abStop();AB.book=null;}
function abLater(fn,ms,run){const t=setTimeout(function(){if(run===AB.run)fn();},ms);AB.timers.push(t);return t;}
function abSay(b){return b.lang==="en"?speakEN:speakES;}

/* ---------- biblioteca ---------- */
function screenAudiobooks(){setTheme("kid");
 abCleanup();
 const done=abDone();
 const card=function(b){const st=done[b.id]||0;return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="abOpen(\''+b.id+'\')"><span style="font-size:2.2rem">'+b.ic+'</span><span style="flex:1"><span>'+esc(b.title)+'</span><br><span style="font-size:.78rem;opacity:.8;font-weight:500">'+(b.lang==="en"?"🇬🇧 English":"🇪🇸 Español")+' · '+b.pages.length+' páginas</span></span><span>'+(st?"⭐".repeat(st):"")+'</span></button>'+(b.id.charAt(0)==="a"&&b.id.charAt(1)==="i"?'<button class="kbtn white" style="min-height:32px;font-size:.75rem;margin:-6px 0 10px;padding:3px" onclick="abDelete(\''+b.id+'\')">🗑️ Borrar</button>':"");};
 const lvl=function(lang,lv){const l=abAll().filter(function(b){return b.lang===lang&&b.lv===lv;});return l.length?'<p class="appsec" style="margin-top:10px">'+(lang==="en"?"🇬🇧":"🇪🇸")+' Nivel '+lv+' '+["","· frases cortas","· frases medianas","· historia más larga"][lv]+'</p>'+l.map(card).join(""):"";};
 render(topbar("screenKidMap()")+subHeader("🎧 Audiolibros")
  +'<p class="center" style="margin:-4px 0 8px">Un libro 3D que se lee solo. ¡Escucha, sigue la frase iluminada y responde!</p>'
  +[1,2,3].map(function(lv){return lvl("es",lv);}).join("")+[1,2,3].map(function(lv){return lvl("en",lv);}).join("")
  +(S.geminiKey
   ?'<p class="appsec" style="margin-top:14px">✨ Audiolibro nuevo con IA</p><div class="card"><b>🔎 ¿De qué quieres que trate?</b><input id="abTopic" maxlength="60" placeholder="Ej: un dragón que tiene hipo…" style="width:100%;font-size:1.05rem;padding:10px;border-radius:12px;border:2px solid #E5E7EB;margin:8px 0;box-sizing:border-box">'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">'+[1,2,3].map(function(l){return '<button class="kbtn green" style="margin:0;font-size:.85rem;min-height:44px;padding:4px" onclick="abGen(\'es\','+l+')">🇪🇸 Nivel '+l+'</button>';}).join("")+[1,2,3].map(function(l){return '<button class="kbtn blue" style="margin:0;font-size:.85rem;min-height:44px;padding:4px" onclick="abGen(\'en\','+l+')">🇬🇧 Level '+l+'</button>';}).join("")+'</div></div>'
   :'<p class="center mut" style="font-size:.82rem;margin-top:12px">✨ Con la clave de IA (papá o mamá) se pueden crear audiolibros nuevos.</p>')
  +'<div id="abFb"></div>');}

/* ---------- reproductor ---------- */
function abOpen(id){setTheme("kid");
 const b=abFind(id);if(!b)return;
 render(topbar("screenAudiobooks()")
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin:0 0 6px">'+b.ic+' '+esc(b.title)+'</h2>'
  +'<div class="card" style="padding:0;overflow:hidden;border-radius:18px"><div id="abCanvas" style="width:100%;height:clamp(250px,42vh,330px)"></div></div>'
  +'<div id="abBar" style="display:flex;gap:4px;margin:8px 0">'+b.pages.map(function(){return '<i style="flex:1;height:6px;border-radius:3px;background:#CBD5E1"></i>';}).join("")+'</div>'
  +(b.lang==="en"?'<div class="card" id="abTr" style="padding:8px 12px;font-size:.9rem;min-height:44px"></div>':'')
  +'<div style="display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:8px"><button class="kbtn white" style="margin:0;min-height:52px" onclick="abGo(-1)" aria-label="Página anterior">⏮</button><button class="kbtn green" id="abPP" style="margin:0;min-height:52px" onclick="abToggle()">⏸ Pausa</button><button class="kbtn white" style="margin:0;min-height:52px" onclick="abGo(1)" aria-label="Página siguiente">⏭</button></div>'
  +(b.lang==="en"?'<button class="kbtn white" style="min-height:44px;font-size:.9rem;margin-top:8px" onclick="abToggleTr()">🇪🇸 Mostrar / ocultar traducción</button>':'')
  +'<div id="abBody"></div>');
 /* el estado se fija DESPUÉS de render(): topbar() llama stopGames() y eso lo limpia */
 AB.book=b;AB.page=0;AB.sent=0;AB.paused=false;AB.showTr=true;AB.run=AB.run+1;AB.timers=[];
 AB.c3=renderBook3D("abCanvas",b.pages.map(function(p){return{e:p.e,bg:p.bg,s:p.s};}),function(ev,info){
  if(ev==="tap"){AB.paused=true;abStop();const pb=document.getElementById("abPP");if(pb)pb.textContent="▶ Seguir";AB.c3.hi(info.s);AB.sent=info.s;abSay(b)(b.pages[AB.page].s[info.s]);}});
 abPage(0);}
function abBar(){document.querySelectorAll("#abBar i").forEach(function(e,k){e.style.background=k<AB.page?"#22C55E":k===AB.page?"#3B82F6":"#CBD5E1";});}
function abTrDraw(){const e=document.getElementById("abTr");if(!e||!AB.book)return;const p=AB.book.pages[AB.page];e.innerHTML=AB.showTr&&p.tr?'<span style="opacity:.75">🇪🇸 '+esc(p.tr)+'</span>':'<span class="mut">🇪🇸 …</span>';}
function abToggleTr(){AB.showTr=!AB.showTr;abTrDraw();}
function abPage(i,fromFlip){
 const b=AB.book;if(!b)return;
 abStop();const run=AB.run;
 if(i>=b.pages.length)return abQuizStart();
 if(i!==AB.page){AB.c3.go(i,i===AB.page+1);}
 AB.page=i;AB.sent=0;abBar();abTrDraw();
 if(AB.paused)return;
 abLater(function(){abSentence(0);},i===0?200:900,run);}
function abSentence(k){
 const b=AB.book;if(!b||AB.paused)return;
 const run=AB.run,page=b.pages[AB.page];
 if(k>=page.s.length){abLater(function(){abPage(AB.page+1);},700,run);return;}
 AB.sent=k;AB.c3.hi(k);
 const text=page.s[k];let fin=false;
 const next=function(){if(fin||run!==AB.run||AB.paused)return;fin=true;abLater(function(){abSentence(k+1);},350,run);};
 abSay(b)(text.replace(/[«»—]/g,""),next);
 abLater(next,Math.min(14000,text.length*115+2000),run);}
function abGo(d){
 const b=AB.book;if(!b)return;AB.paused=false;const pb=document.getElementById("abPP");if(pb)pb.textContent="⏸ Pausa";
 const n=Math.max(0,AB.page+d);abPage(n);}
function abToggle(){
 const b=AB.book;if(!b)return;AB.paused=!AB.paused;const pb=document.getElementById("abPP");
 if(AB.paused){abStop();if(pb)pb.textContent="▶ Seguir";}
 else{if(pb)pb.textContent="⏸ Pausa";abSentence(AB.sent);}}

/* ---------- preguntas ---------- */
function abQuizStart(){
 const b=AB.book;if(!b)return;
 AB.qi=0;AB.ok=0;AB.tried=false;
 const ctl=document.querySelector('[onclick="abToggle()"]');if(ctl&&ctl.parentNode)ctl.parentNode.style.display="none";
 abQuizRound();}
function abQuizRound(){
 const b=AB.book,q=b.quiz[AB.qi];
 if(!q)return abFinish();
 AB.ops=shuffled(q.ops.map(function(o,i){return{t:o,ok:i===q.a};}));AB.qa=false;AB.tried=false;
 const body=document.getElementById("abBody");
 body.innerHTML='<div class="card" style="margin-top:10px"><b>🧩 '+(b.lang==="en"?"Question ":"Pregunta ")+(AB.qi+1)+' / '+b.quiz.length+'</b><p style="margin:6px 0 0;font-weight:700">'+esc(q.q)+'</p></div>'
  +AB.ops.map(function(o,i){return '<button class="kbtn white" id="abQ'+i+'" style="min-height:52px" onclick="abQuizAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'<div id="abFb"></div>';
 body.scrollIntoView({block:"nearest",behavior:"smooth"});
 abSay(b)(q.q);}
function abQuizAns(i){
 if(AB.qa)return;const b=AB.book,o=AB.ops[i],btn=document.getElementById("abQ"+i);
 if(o.ok){AB.qa=true;if(!AB.tried)AB.ok++;recordAnswer(b.lang==="en"?"Inglés":"Comprensión",!AB.tried,12);sOK();confetti(6);if(btn)btn.style.background="#86EFAC";
  document.getElementById("abFb").innerHTML='<p style="text-align:center;font-weight:800;color:#16A34A">✅ '+(b.lang==="en"?"Great!":"¡Correcto!")+'</p>';
  AB.qi++;const run=AB.run;abLater(abQuizRound,1500,run);}
 else{AB.tried=true;sNO();if(btn){btn.style.background="#FCA5A5";btn.disabled=true;}}}
function abFinish(){
 const b=AB.book;if(!b)return;
 const stars=starsFor(AB.ok,Math.max(1,b.quiz.length));
 abDone()[b.id]=Math.max(abDone()[b.id]||0,stars);save();abStop();
 if(typeof disposeBook3D==="function")disposeBook3D();
 nodeWin(stars,b.lang==="en"?"Inglés":"Comprensión",AB_WIN);}

/* ---------- ✨ audiolibros nuevos con IA ---------- */
async function abGen(lang,lv){
 const inp=document.getElementById("abTopic"),topic=(inp&&inp.value||"").replace(/[<>"]/g,"").trim().slice(0,60)||"un animal simpático y una aventura";
 const f=document.getElementById("abFb");
 if(f)f.innerHTML='<div class="card center"><span class="spin">✍️</span> Escribiendo el audiolibro…</div>';
 const per=lv===1?2:lv===2?3:4,pages=lv===3?7:6;
 const langRule=lang==="en"?'Write the story IN ENGLISH (CEFR A1'+(lv===3?"/A2":"")+', simple present and past, short words). Each page also needs "tr": the Spanish translation of the whole page.':'Escribe el cuento EN ESPAÑOL sencillo para un niño de 7 a 9 años. En "tr" pon una cadena vacía.';
 try{
  const o=await geminiJSON('Write a children\'s story (a short audiobook) about: "'+topic+'". Child-safe only: kind, no violence, no brands or copyrighted characters; if the topic is inappropriate or unclear, write about a friendly animal. '+langRule
   +' Exactly '+pages+' pages, each with exactly '+per+' short sentences (max 16 words each), a beginning, a small problem and a happy ending. Each page has "e" = ONE emoji that illustrates it. '
   +'Then 3 multiple-choice questions ('+(lang==="en"?"in English":"en español")+') with exactly 3 options and the CORRECT option FIRST (a:0). '
   +'Reply ONLY with valid JSON, no markdown: {"title":"...","ic":"emoji","pages":[{"e":"🌟","s":["sentence","sentence"],"tr":"..."}],"quiz":[{"q":"...","ops":["correct","wrong","wrong"],"a":0}]}');
  const pg=(o.pages||[]).filter(function(p){return p&&Array.isArray(p.s)&&p.s.length>=1&&p.s.every(function(x){return typeof x==="string"&&x.length>2;});}).slice(0,8)
   .map(function(p,i){return{e:String(p.e||"📖").slice(0,4),bg:["#FEF3C7","#E0E7FF","#DCFCE7","#FBCFE8","#BAE6FD","#FED7AA","#DDD6FE","#FEF08A"][i%8],s:p.s.slice(0,5).map(function(x){return String(x).slice(0,160);}),tr:String(p.tr||"").slice(0,420)};});
  const quiz=(o.quiz||[]).filter(function(q){return q&&typeof q.q==="string"&&Array.isArray(q.ops)&&q.ops.length>=2;}).slice(0,4).map(function(q){return{q:String(q.q).slice(0,160),ops:q.ops.slice(0,3).map(function(x){return String(x).slice(0,90);}),a:0};});
  if(pg.length<4||quiz.length<2)throw new Error("La IA devolvió un libro incompleto. Intenta otra vez.");
  const b={id:"ai"+Date.now(),lang:lang,lv:lv,ic:String(o.ic||"📖").slice(0,4),title:String(o.title||topic).slice(0,50),pages:pg,quiz:quiz};
  const list=abSaved();list.push(b);while(list.length>6)list.shift();save();
  abOpen(b.id);
 }catch(e){const ff=document.getElementById("abFb");if(ff)ff.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message||"No se pudo crear el audiolibro")+'</div>';}}
function abDelete(id){
 if(!confirm("¿Borrar este audiolibro?"))return;
 const l=abSaved(),k=l.findIndex(function(b){return b.id===id;});if(k>=0){l.splice(k,1);save();}
 screenAudiobooks();}
