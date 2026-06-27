/* ============ PANTALLA INICIAL ============ */
/* recordatorio: si jugó ayer y hoy no, avisa que la racha está en riesgo */
function streakReminderHTML(){
 const y=new Date();y.setDate(y.getDate()-1);
 const ys=y.getFullYear()+"-"+String(y.getMonth()+1).padStart(2,"0")+"-"+String(y.getDate()).padStart(2,"0");
 const msgs=[];
 Object.keys(S.profiles).forEach(k=>{const p=S.profiles[k];
  if(p.streak>0&&p.lastDay===ys)msgs.push("🔥 <b>"+esc(p.name)+"</b>: ¡juega hoy para no perder tu racha de "+p.streak+(p.streak===1?" día":" días")+"!");});
 if(!msgs.length)return "";
 return '<div class="card" style="border:3px solid #F59E0B;background:#FFF7E0;font-size:1rem;line-height:1.6">'+msgs.join("<br>")+'</div>';}
function screenStart(){setTheme("parent");current.profile=null;
 if(typeof stopGames==="function")stopGames();
 if(typeof startUsageTracking==="function")startUsageTracking();
 // SOLO un hijo invitado de verdad (cuenta propia amarrada a una familia) entra directo a su perfil.
 // El padre/dueño SIEMPRE ve la selección y el panel de padres.
 if(typeof afMember!=="undefined"&&afMember&&afMember.familyId){
  const pid=(S.childProfile&&S.profiles[S.childProfile])?S.childProfile:Object.keys(S.profiles)[0];
  if(pid){current.profile=pid;touchDay();save();return (profType()==="teen")?screenTeenHome():screenKidMap();}
 }
 // padre/dueño: limpiar marca de "estudiante" si quedó de una versión anterior
 if(S.role==="child"){S.role="parent";S.childProfile=null;save();}
 const cards=childProfiles().map(p=>{
  const sub=p.type==="teen"?"Studio de retos":"Mundo de Aventuras";
  const agetxt=p.age?(" · "+p.age+" años"):"";
  return '<div class="card profilecard" onclick="enterProfile(\''+p.id+'\')"><span class="av">'+(p.emoji||"🙂")+'</span><b style="font-size:1.35rem">'+esc(p.name)+'</b><br><span class="mut">'+sub+agetxt+'</span></div>';
 }).join("");
 render('<div style="margin-top:6vh">'
 +'<h1 class="title center" style="font-size:2rem">🏠 Academia Familiar</h1>'
 +'<p class="center mut" style="margin-bottom:22px;font-size:1.05rem">¿Quién va a jugar hoy?</p>'
 +streakReminderHTML()
 +cards
 +'<p class="center" style="margin-top:20px"><button class="pbtn ghost" onclick="screenParentLogin()">👨‍👩‍👧 Panel de padres</button></p>'
 +'<p class="center" style="margin-top:6px"><button class="pbtn ghost" style="font-size:.92rem" onclick="doLogout()">🚪 Cerrar sesión / cambiar de cuenta</button></p></div>');}
function enterProfile(id){if(!S.profiles[id])return;current.profile=id;touchDay();save();
 if(profType()==="teen")screenTeenHome();else screenKidMap();}
function enterKid(){enterProfile("nino");}
function enterTeen(){enterProfile("nina");}

/* ============ MAPA DE AVENTURA (NIÑO) ============ */
/* MUNDOS temáticos: cada uno agrupa temas y se juega con el motor infinito */
const KID_WORLDS=[
 {id:"mate",ic:"🔢",nm:"Matemáticas",color:"green",cat:"cole",topics:["sumas2","restas2","restapres","sumas3","multi","mayorMenor","decenas","numpalabra","palabra_num","problemas2"],desc:"Sumas, restas, problemas, decenas y números en letras"},
 {id:"lenguaje",ic:"📚",nm:"Lenguaje",color:"red",cat:"cole",topics:["sustantivos","silabas","ortografia","narracion"],desc:"Sustantivos, sílabas, ortografía y cuentos"},
 {id:"ciencias",ic:"🌎",nm:"Ciencias",color:"green",cat:"cole",topics:["ciclo_agua","cuerpo_es","cuerpo_partes","sistemas","natura"],desc:"Ciclo del agua, el cuerpo, sus sistemas y naturaleza"},
 {id:"cuerpo",ic:"🫀",nm:"El cuerpo humano",color:"red",cat:"cole",special:"body",topics:["cuerpo_partes","sistemas","cuerpo_es"],desc:"Señala las partes y aprende los sistemas"},
 {id:"sociales",ic:"🌎",nm:"Sociales y trivias",color:"blue",cat:"cole",special:"social",topics:["geografia","sociales","cultura","informatica"],desc:"Banderas, geografía, sociales y cultura"},
 {id:"calendario",ic:"📅",nm:"Tiempo",color:"blue",cat:"cole",topics:["tiempo","diasES","mesesES","ordinales"],desc:"Días, meses y orden"},
 {id:"reloj",ic:"🕐",nm:"Aprende la hora",color:"yellow",cat:"cole",special:"clock",desc:"Lee el reloj: en punto y y media"},
 {id:"ingles",ic:"🔤",nm:"Inglés con voz",color:"red",cat:"en",topics:["en_animals","en_colors","en_body","en_house","en_numbers","en_vowels","en_days","en_phrases"],desc:"Escucha y aprende inglés",en:true},
 {id:"cuentosen",ic:"🇬🇧",nm:"Cuentos en inglés",color:"blue",cat:"en",special:"storiesEN",desc:"Lee y toca para traducir"},
 {id:"lectura",ic:"📖",nm:"Cuentos",color:"yellow",cat:"leer",special:"stories",desc:"Cuentos ilustrados y comprensión"},
 {id:"escritura",ic:"✍️",nm:"Escribir bien",color:"white",cat:"leer",special:"writing",desc:"Ordena frases y letras"},
 {id:"logica",ic:"🧩",nm:"Lógica y genio",color:"purple",cat:"pensar",topics:["logica","secuencias","ordinales","izqder","acertijos"],desc:"Acertijos, adivinanzas y patrones"},
 {id:"ubicacion",ic:"🧭",nm:"¿Dónde está?",color:"yellow",cat:"pensar",topics:["izqder"],desc:"Izquierda, derecha, sobre y debajo"},
 {id:"juegos",ic:"🎮",nm:"Todos los juegos",color:"blue",cat:"jugar",special:"games",desc:"Robot, arcade, impostor y más"}];
const KID_CATS=[["cole","📚 Aprende para el cole"],["en","🇬🇧 Inglés"],["leer","📖 Leer y escribir"],["pensar","🧩 Pensar"],["jugar","🎮 Jugar"]];
let curNode=null;
function worldBtn(w,p){
 const done=(p.worldWins&&p.worldWins[w.id])||0;
 return '<button class="kbtn '+w.color+'" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="openWorld(\''+w.id+'\')">'
  +'<span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+w.ic+'</span>'
  +'<span style="flex:1"><span style="font-size:clamp(1.1rem,5vw,1.35rem)">'+w.nm+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+w.desc+(done?' · ✅ '+done:'')+'</span></span></button>';}
/* tile grande de menú (lleva a un submenú) */
function hubTile(onclick,ic,title,sub,color){
 return '<button class="kbtn '+color+'" style="text-align:left;display:flex;align-items:center;gap:14px;margin:0" onclick="'+onclick+'">'
  +'<span style="font-size:clamp(2.4rem,12vw,3rem)">'+ic+'</span>'
  +'<span style="flex:1"><span style="font-size:clamp(1.15rem,5.2vw,1.4rem)">'+title+'</span><br><span style="font-size:.76rem;opacity:.85;font-weight:500">'+sub+'</span></span>'
  +'<span style="font-size:1.4rem;opacity:.6">›</span></button>';}
/* ===== HUB principal: pocas opciones, sin scroll largo ===== */
function screenKidMap(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 const p=prof();const pet=(typeof legendaryPet==="function"&&legendaryPet())||petStage(p.xp);
 render(topbar("screenStart()")
 +'<div class="card" style="display:flex;align-items:center;gap:12px;padding:14px">'
 +'<div onclick="screenAvatar()">'+(typeof avatarHTML==="function"?avatarHTML(64):"🧒")+'</div>'
 +'<div style="flex:1"><h1 class="title" style="font-size:clamp(1.2rem,5.5vw,1.5rem)">¡Hola, '+esc(p.name)+'!</h1>'
 +'<p style="font-size:.92rem">Mascota: <b>'+pet.n+'</b> '+pet.e+' · 🎒 '+uniqueCritters()+'/'+CRITTERS.length+'</p></div>'
 +'<div style="font-size:clamp(2.2rem,11vw,3rem);cursor:pointer" onclick="screenTama()">'+(p.tama?p.tama.sp:"🥚")+'</div></div>'
 +missionsHTML()
 +'<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:6px">'
 +hubTile("screenCole()","📚","Aprender","Mate, lenguaje, ciencias y la hora","green")
 +hubTile("screenEnglishHub()","🇬🇧","Inglés","Academia A1, voz y cuentos","red")
 +hubTile("screenLeer()","📖","Cuentos y escribir","Lee, escucha y ordena frases","yellow")
 +hubTile("screenGamesPick()","🎮","Jugar","Arcade, impostor, culebra y más","blue")
 +hubTile("screenMyStuff()","🛍️","Mi mundo","Tienda, personaje y premios","purple")
 +'</div>'
 +'<p class="center" style="margin-top:14px"><button class="kbtn white" style="width:auto;display:inline-block;min-height:46px;padding:10px 18px;font-size:.95rem;margin:0" onclick="doLogout()">🚪 Cerrar sesión / cambiar de cuenta</button></p>');}
function subHeader(title){return '<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin:2px 0 12px">'+title+'</h2>';}
function screenCole(){setTheme("kid");const p=prof();
 const ws=KID_WORLDS.filter(w=>w.cat==="cole"||w.cat==="pensar");
 render(topbar("screenKidMap()")+subHeader("📚 Aprender")
  +ws.map(w=>worldBtn(w,p)).join(""));}
function screenEnglishHub(){setTheme("kid");const p=prof();
 const ws=KID_WORLDS.filter(w=>w.cat==="en");
 render(topbar("screenKidMap()")+subHeader("🇬🇧 Inglés")
  +'<button class="kbtn red" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="screenAcademyKid()"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">🎓</span><span style="flex:1"><span>Academia de Inglés</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Unidades y coronas 👑</span></span></button>'
  +'<button class="kbtn green" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="screenLevelsEN()"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">📈</span><span style="flex:1"><span>Inglés por niveles A1→B2</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Aprueba exámenes y sube de nivel</span></span></button>'
  +'<button class="kbtn yellow" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="screenTutorEN()"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">🎧</span><span style="flex:1"><span>Tutor de inglés (habla)</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">El profe dice y tú repites 🎤</span></span></button>'
  +ws.map(w=>worldBtn(w,p)).join(""));}
function screenLeer(){setTheme("kid");const p=prof();
 const ws=KID_WORLDS.filter(w=>w.cat==="leer");
 render(topbar("screenKidMap()")+subHeader("📖 Cuentos y escribir")
  +ws.map(w=>worldBtn(w,p)).join("")
  +'<button class="kbtn red" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="gameReadAloud()"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">🎤</span><span style="flex:1"><span style="font-size:clamp(1.1rem,5vw,1.35rem)">Leer en voz alta</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">Lee y te corrijo la pronunciación</span></span></button>');}
function screenMyStuff(){setTheme("kid");
 render(topbar("screenKidMap()")+subHeader("🛍️ Mi mundo")
  +'<div class="card center" style="padding:14px">'+(typeof avatarScene==="function"?avatarScene(120):avatarHTML(110))+'</div>'
  +'<button class="kbtn red" onclick="screenTama()">🐾 Mi mascota (cuídala)</button>'
  +'<button class="kbtn yellow" onclick="screenShop()">🛍️ La tienda</button>'
  +'<button class="kbtn white" onclick="screenAvatar()">😎 Mi personaje</button>'
  +'<button class="kbtn green" onclick="screenCritters()">🎒 Mi colección</button>'
  +'<button class="kbtn blue" onclick="screenVideosKid()">🎬 Videos</button>'
  +'<button class="kbtn white" style="margin-top:8px" onclick="doLogout()">🚪 Cerrar sesión / cambiar de cuenta</button>');}
function lockedMsg(){}
function openWorld(id){
 const w=KID_WORLDS.find(x=>x.id===id);curNode=id;
 if(w.special==="stories")return screenStoryPick();
 if(w.special==="storiesEN")return screenStoryEN();
 if(w.special==="writing")return screenWritingPick();
 if(w.special==="games")return screenGamesPick();
 if(w.special==="clock")return gameClock();
 if(w.special==="body")return gameBody();
 if(w.special==="social")return screenSocial();
 // mundo de retos infinitos adaptativos
 playTopics(w.nm,w.topics,{perTopic:4,topicsPerSession:2,total:8});}
function bumpWorld(id){const p=prof();if(!p.worldWins)p.worldWins={};p.worldWins[id]=(p.worldWins[id]||0)+1;save();}

/* sub-menús de mundos especiales */
function screenStoryPick(){setTheme("kid");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">📖 Cuentos</h2>'
 +'<p class="center" style="margin-bottom:14px">Lee, escucha y responde</p>'
 +CUENTOS.map((c,i)=>'<button class="kbtn yellow" onclick="gameStory('+i+')"><span style="font-size:1.6rem">'+c.pages[0].scene.split(/(?=)/)[0]+'</span> '+esc(c.title)+'</button>').join("")
 +'<button class="kbtn blue" onclick="screenStoryEN()">🇬🇧 Cuentos en inglés (toca y traduce)</button>'
 +(S.geminiKey?'<button class="kbtn green" onclick="aiStoryKid()">✨ Cuento nuevo con IA</button>':'<p class="audiotip">💡 Activa la clave de Gemini en el panel de padres para cuentos nuevos infinitos e ilustrados.</p>'));}
function screenWritingPick(){setTheme("kid");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">✍️ Escribir bien</h2>'
 +'<p class="center" style="margin-bottom:14px">Frases, letras y palabras</p>'
 +'<button class="kbtn yellow" onclick="gameOrder()">🧩 Ordena la frase</button>'
 +'<button class="kbtn green" onclick="gameDictation()">✍️ Dictado de frases</button>'
 +'<button class="kbtn blue" onclick="gameLetters()">🔡 Sonido de las letras (C, S, Q…)</button>'
 +'<button class="kbtn white" onclick="gameSpell()">⌨️ Escribe la palabra en inglés</button>');}
const DAILY_GOAL=10; /* aciertos del día para desbloquear los juegos */
function dailyGoalDone(){return touchDay().ok>=DAILY_GOAL;}
function screenGamesLocked(){setTheme("kid");
 const d=touchDay();const have=Math.min(d.ok,DAILY_GOAL);const pctv=Math.round(have/DAILY_GOAL*100);
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🎮🔒 Juegos bloqueados</h2>'
 +'<div class="card center" style="padding:22px 16px">'
 +'<div style="font-size:3.4rem;margin-bottom:6px">🔒</div>'
 +'<p style="font-size:1.1rem;line-height:1.5">Primero haz tus <b>actividades de hoy</b>.<br>¡Cuando logres <b>'+DAILY_GOAL+' aciertos</b>, se abren todos los juegos!</p>'
 +'<div style="height:18px;border-radius:12px;background:#E6ECF5;border:3px solid var(--kid-ink);overflow:hidden;margin:14px 0 6px"><div style="height:100%;width:'+pctv+'%;background:var(--kid-green);transition:width .4s"></div></div>'
 +'<p style="font-family:Fredoka;font-weight:700">'+have+' / '+DAILY_GOAL+' aciertos ✅</p>'
 +'<button class="kbtn green" style="margin-top:12px" onclick="screenCole()">📚 Ir a aprender</button>'
 +'<button class="kbtn blue" onclick="screenEnglishHub()">🇬🇧 Practicar inglés</button>'
 +'</div>');}
function screenGamesPick(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 if(!dailyGoalDone())return screenGamesLocked();
 const sub=t=>'<p style="font-size:1rem;margin:14px 2px 8px;font-family:Fredoka;font-weight:700">'+t+'</p>';
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:2px">🎮 Juegos</h2>'
 +'<div class="card center" style="padding:8px;margin-bottom:6px;background:linear-gradient(180deg,#E8FBF0,#D6F5E3)">✅ ¡Desbloqueaste los juegos de hoy! 🎉</div>'
 +sub("🧠 Letras y palabras")
 +'<button class="kbtn white" onclick="gameHangman(\'es\')">⛄ Salva al muñeco (palabras)</button>'
 +'<button class="kbtn yellow" onclick="gameWordSearch()">🔍 Sopa de letras</button>'
 +'<button class="kbtn purple" onclick="gameCrossword()">📝 Crucigrama</button>'
 +'<button class="kbtn green" onclick="gameDictation()">✍️ Dictado de frases</button>'
 +sub("🔢 Números y lógica")
 +'<button class="kbtn green" onclick="gameSymbols()">🐊 Coloca el signo (&gt; &lt; =)</button>'
 +'<button class="kbtn yellow" onclick="gameMathCross()">🔢 Crucigrama matemático</button>'
 +'<button class="kbtn purple" onclick="gameImpostor()">🚀 ¿Quién es el impostor?</button>'
 +'<button class="kbtn red" onclick="gameSimon()">🎵 Simón Dice</button>'
 +sub("🇬🇧 Inglés")
 +'<button class="kbtn blue" onclick="gameHangman(\'en\')">⛄ Salva al muñeco (inglés)</button>'
 +'<button class="kbtn green" onclick="gameSay()">🎤 Di la palabra (micrófono)</button>'
 +sub("🕹️ Arcade (pura diversión)")
 +'<button class="kbtn red" onclick="gameBalloons(\'mix1\')">🎈 Revienta globos</button>'
 +'<button class="kbtn blue" onclick="gameRace()">🏎️ Carrera izquierda y derecha</button>'
 +'<button class="kbtn purple" onclick="gameDoodle()">🦘 Saltarín</button>');}
function screenMemoryPick(){setTheme("kid");
 render(topbar("screenGamesPick()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🃏 Memoria</h2>'
 +'<p class="center" style="margin-bottom:14px">Encuentra las parejas que se relacionan</p>'
 +Object.keys(MEMORY_SETS).map((k,i)=>{const s=MEMORY_SETS[k];
   const colors=["yellow","blue","green","red","purple","white","yellow"];
   return '<button class="kbtn '+colors[i%colors.length]+'" style="text-align:left;display:flex;align-items:center;gap:12px" onclick="gameMemory(\''+k+'\')">'
    +'<span style="font-size:2rem">'+s.ic+'</span><span style="flex:1"><span>'+s.nm+'</span><br><span style="font-size:.78rem;opacity:.8;font-weight:500">'+s.desc+'</span></span></button>';
  }).join(""));}
function tapNode(id){if(typeof id==="string")openWorld(id);}
async function aiStoryKid(){
 setTheme("kid");
 render(topbar("screenStoryPick()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Creando un cuento nuevo…</h2></div>');
 try{
  const temas=["la amistad","el valor de la honestidad","cuidar la naturaleza","el trabajo en equipo","superar el miedo","la importancia de compartir","la perseverancia","ser amable con los demás","la curiosidad por aprender","cuidar a los animales",
   "un misterio que el protagonista resuelve buscando pistas","un descubrimiento sorprendente (un lugar o un tesoro escondido)","una aventura de exploración y valentía","resolver un enigma usando la lógica","una búsqueda para encontrar algo perdido"];
  const tema=temas[Math.floor(Math.random()*temas.length)];
  if(!S.aiStoriesSeen)S.aiStoriesSeen=[];
  const evitar=S.aiStoriesSeen.slice(-12);
  const noRep=evitar.length?(' NO repitas estos cuentos ya creados (cambia personajes, lugar y trama): '+evitar.map(t=>'"'+t+'"').join("; ")+'.'):'';
  const animales=["un zorro","una ardilla","un conejo","una tortuga","un búho","un gatito","un dragón pequeño","una abeja","un pingüino","un elefantito"][Math.floor(Math.random()*10)];
  const obj=await geminiJSON('Crea un cuento infantil ORIGINAL y ÚNICO en español para un niño de 7 años, sobre el tema: '+tema+'. Que el protagonista sea '+animales+' (con nombre propio).'+noRep+' Con valores positivos, un problema que se resuelve y una enseñanza clara. Debe ser LARGO y entretenido: 7 escenas, cada escena con 4 o 5 frases sencillas y descriptivas. Responde SOLO JSON: {"title":"título lindo","pages":[{"scene":"2-3 emojis que ilustren la escena","text":"4-5 frases, marca 2-3 palabras clave con <b>palabra</b>"}],"qs":[{"q":"pregunta de comprensión (por qué / causa-efecto / qué sintió / qué aprende)","ops":["correcta","mala","mala"],"a":0}]} con 7 pages y 4 qs.');
  // sanitizar lo que devuelve la IA (solo se permite <b> en el texto)
  obj.title=stripHTML(obj.title||"Cuento");
  obj.pages=(obj.pages||[]).map(p=>({scene:stripHTML(p.scene||"✨"),text:keepBold(p.text||"")}));
  obj.qs=(obj.qs||[]).map(q=>({q:stripHTML(q.q),ops:(q.ops||[]).map(o=>stripHTML(o)),a:q.a||0}));
  S.aiStoriesSeen.push(obj.title);while(S.aiStoriesSeen.length>20)S.aiStoriesSeen.shift();save();
  CUENTOS.push(obj);gameStory(CUENTOS.length-1);
 }catch(e){toast("No se pudo crear, intenta de nuevo",false,2000);screenStoryPick();}}
function nodeWin(stars,subject){
 const p=prof();
 if(typeof curNode==="string")bumpWorld(curNode);
 p.coins+=stars*5;p.xp+=stars*10;touchDay().games++;save();
 sWIN();confetti(34);
 const got=stars>=2?maybeCritter():null;
 const gotMsg=got?(got.isNew?"¡Capturaste a "+got.name+"!":got.evolved?"¡"+got.name+" EVOLUCIONÓ! 🌟":"¡"+got.name+" subió a nivel "+got.count+"! ❤️"):"";
 const gotSub=got?(got.isNew?"Una nueva criatura para tu colección 🎒":got.evolved?"Mira su nueva forma en tu colección 🎒":"Recaptúrala para que evolucione"):"";
 const critterHTML=got?'<div class="card" style="background:linear-gradient(180deg,#FFF3C4,#FFE08A);margin-top:14px;text-align:center;cursor:pointer" onclick="screenCritters()"><div style="font-size:clamp(3.5rem,18vw,5rem)">'+got.e+'</div><b style="font-size:1.2rem">'+gotMsg+'</b><p>'+gotSub+'</p><p style="margin-top:8px;font-family:Fredoka;font-weight:700;color:var(--kid-blue)">👉 Toca para ver tu colección 🎒</p></div>':'';
 if(got)setTimeout(()=>confetti(30),400);
 render(topbar("screenKidMap()")
 +'<div class="card endcard"><div class="big">'+(stars===3?"🏆":stars===2?"🌟":"⭐")+'</div>'
 +'<h2>¡Muy bien!</h2>'
 +'<div style="font-size:2.4rem;margin:6px 0">'+"⭐".repeat(stars)+"☆".repeat(3-stars)+'</div>'
 +'<p style="font-size:1.15rem;margin-bottom:16px">Ganaste <b>+'+(stars*5)+' 🪙</b></p>'
 +'<button class="kbtn green" onclick="replayWorld()">Seguir jugando 🔁</button>'
 +'<button class="kbtn white" onclick="screenKidMap()">Ir a los mundos 🌍</button></div>'
 +critterHTML);}
function replayWorld(){
 if(typeof curNode==="string"){const w=KID_WORLDS.find(x=>x.id===curNode);
  if(w&&!w.special)return playTopics(w.nm,w.topics,{perTopic:4,topicsPerSession:2,total:8});
  return openWorld(curNode);}
 screenKidMap();}
function afterWin(){screenKidMap();}
function starsFor(ok,total){const p=ok/total;return p>=0.9?3:p>=0.6?2:1;}

/* ============ MISIONES ============ */
const MISSIONS={
 kid:[{id:"m1",label:"Explora 2 mundos hoy",emoji:"🌍",check:d=>d.games>=2,reward:10},
       {id:"m2",label:"Practica inglés con voz",emoji:"🔊",check:d=>d.enDone,reward:15},
       {id:"m3",label:"Logra 10 aciertos hoy",emoji:"✅",check:d=>d.ok>=10,reward:15}],
 teen:[{id:"m1",label:"Completa 10 ejercicios",emoji:"🎯",check:d=>d.ex>=10,reward:10},
       {id:"m2",label:"Termina una lectura en inglés",emoji:"📖",check:d=>d.readDone,reward:15},
       {id:"m3",label:"Consigue un combo x3",emoji:"⚡",check:d=>d.combo3,reward:15}]};
function missionsHTML(){
 const d=touchDay();const list=MISSIONS[profType()]||MISSIONS.kid;
 let h='<div class="card"><b style="font-size:1.1rem">📅 Misiones de hoy</b>';
 list.forEach(mi=>{
  if(mi.check(d)&&!d.missions.includes(mi.id)){d.missions.push(mi.id);prof().coins+=mi.reward;prof().xp+=mi.reward*2;save();}
  const done=d.missions.includes(mi.id);
  h+='<div class="misionrow'+(done?" done":"")+'"><span class="chk">'+(done?"✓":"")+'</span><span>'+mi.emoji+' '+mi.label+' <b>+'+mi.reward+'🪙</b></span></div>';});
 return h+'</div>';}

/* ============ JUEGO: GLOBOS ============ */
let BL={};
function balloonQuestion(mode){
 if(mode==="ingles"){const w=pick(EN_KID);return{q:'¿Qué significa "'+w[0].toUpperCase()+'"?',ans:w[1],pool:EN_KID.map(x=>x[1])};}
 const r=Math.random();
 if(r<0.34){const a=1+rnd(9),b=1+rnd(9);return{q:a+" + "+b+" = ?",ans:String(a+b),pool:null,num:a+b};}
 if(r<0.6){const a=3+rnd(14),b=1+rnd(a-1);return{q:a+" − "+b+" = ?",ans:String(a-b),pool:null,num:a-b};}
 const v=pick(VOCAL_WORDS);return{q:"¿Con qué vocal empieza "+v[1]+"?",ans:v[0],pool:["A","E","I","O","U"]};}
function gameBalloons(mode){setTheme("kid");
 BL={mode,round:0,ok:0,total:6};nextBalloonRound();}
function nextBalloonRound(){
 if(BL.round>=BL.total)return nodeWin(starsFor(BL.ok,BL.total),"Globos");
 const Q=balloonQuestion(BL.mode);BL.cur=Q;
 let answers;
 if(Q.pool){answers=shuffled(Q.pool.filter(x=>x!==Q.ans)).slice(0,3);answers.push(Q.ans);}
 else{const set=new Set([Q.num]);while(set.size<4){const d=Q.num+1+rnd(4)*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}answers=[...set].map(String);}
 answers=shuffled(answers);
 const colors=["#FF6B6B","#3B82F6","#3EC97C","#A78BFA","#F59E0B"];
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+Array.from({length:BL.total},(x,i)=>'<i class="'+(i<BL.round?"on":"")+'"></i>').join("")+'</div>'
 +'<div class="bigq center">'+esc(Q.q)+'</div>'
 +'<div id="sky"></div>'
 +'<p class="center" style="margin-top:12px;font-size:1.05rem">💥 ¡Revienta el globo correcto!</p>');
 const sky=document.getElementById("sky");
 answers.forEach((a,i)=>{
  const b=document.createElement("div");b.className="balloon";b.textContent=a;
  b.style.background=colors[i%colors.length];
  b.style.left=(4+i*24)+"%";
  b.style.top=(8+rnd(48))+"%"; // aparecen YA, flotando y meciéndose
  b.style.animationDuration=(2+Math.random()*1.5)+"s";
  b.style.animationDelay=(Math.random()*0.8)+"s";
  b.onclick=()=>popBalloon(b,a===BL.cur.ans);
  sky.appendChild(b);});
 BL.timer=setTimeout(()=>{if(document.getElementById("sky")){toast("¡Se escaparon! 🎈 La respuesta era "+BL.cur.ans,false,1800);sNO();recordAnswer(BL.mode==="ingles"?"Inglés":"Números",false,12);BL.round++;setTimeout(nextBalloonRound,1700);}},12500);}
function popBalloon(el,ok){
 if(BL.done)return;
 if(ok){BL.done=true;clearTimeout(BL.timer);el.classList.add("pop");sOK();confetti(10);
  recordAnswer(BL.mode==="ingles"?"Inglés":"Números",true,8);BL.ok++;BL.round++;
  toast("¡Correcto! +2 🪙",true,1000);
  setTimeout(()=>{BL.done=false;nextBalloonRound();},1000);}
 else{el.style.animationPlayState="paused";el.style.opacity=".4";sNO();
  recordAnswer(BL.mode==="ingles"?"Inglés":"Números",false,8);}}

/* ============ JUEGO: MEMORIA ============ */
let MM={};
function gameMemory(kind){setTheme("kid");
 const set=MEMORY_SETS[kind]||MEMORY_SETS.meses;
 const pares=set.pairs();
 const cards=shuffled(pares.flatMap((p,i)=>[{id:i,txt:p[0]},{id:i,txt:p[1]}]));
 MM={cards,first:null,lock:false,found:0,tries:0,kind,set,total:pares.length};
 render(topbar("screenMemoryPick()")
 +'<h2 style="font-size:1.4rem;margin-bottom:4px">'+set.ic+' ¡Encuentra las parejas!</h2>'
 +'<p style="margin-bottom:14px;font-size:1.05rem">'+set.desc+'</p>'
 +'<div class="memgrid">'+cards.map((c,k)=>'<div class="mem" id="mm'+k+'" onclick="flipMem('+k+')"><div class="in"><div class="f">❓</div><div class="b">'+esc(c.txt)+'</div></div></div>').join("")+'</div>');}
function flipMem(k){
 if(MM.lock)return;const el=document.getElementById("mm"+k);
 if(el.classList.contains("flip"))return;
 el.classList.add("flip");beep([440],.08);
 // si la carta es palabra en inglés, pronúnciala
 if(MM.set.subj==="Inglés"&&/^[a-z]+$/i.test(MM.cards[k].txt))speakEN(MM.cards[k].txt);
 if(MM.first===null){MM.first=k;return;}
 const a=MM.cards[MM.first],b=MM.cards[k],elA=document.getElementById("mm"+MM.first);
 MM.tries++;MM.lock=true;
 if(a.id===b.id){MM.found++;sOK();el.classList.add("ok");elA.classList.add("ok");
  recordAnswer(MM.set.subj,true,6);
  MM.first=null;MM.lock=false;
  if(MM.found===MM.total){const st=MM.tries<=MM.total+2?3:MM.tries<=MM.total+5?2:1;setTimeout(()=>nodeWin(st,"Memoria"),700);}}
 else{sNO();recordAnswer(MM.set.subj,false,6);
  setTimeout(()=>{el.classList.remove("flip");elA.classList.remove("flip");MM.first=null;MM.lock=false;},900);}}

/* ============ MATE VISUAL ============ */
let MV={};
function gameMathVisual(){setTheme("kid");MV={round:0,ok:0,total:6};nextMV();}
function nextMV(){
 if(MV.round>=MV.total)return nodeWin(starsFor(MV.ok,MV.total),"Mate");
 const Q=genSumImg();MV.cur=Q;
 const set=new Set([Q.ans]);while(set.size<3){const d=Q.ans+1+rnd(3)*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}
 const ops=shuffled([...set]);
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(MV.total,MV.round)+'</div>'
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:10px">🧮 Cuenta y suma</h2>'
 +'<div class="card"><div class="dots">'+'<span class="dot"></span>'.repeat(Q.a)+'</div>'
 +'<div style="text-align:center;font-size:clamp(2rem,9vw,2.8rem);font-family:Fredoka;font-weight:700">➕</div>'
 +'<div class="dots">'+'<span class="dot" style="background:var(--kid-blue)"></span>'.repeat(Q.b)+'</div></div>'
 +'<div class="bigq center">'+Q.q+'</div>'
 +'<div class="choices2">'+ops.map(o=>'<button class="kbtn" onclick="ansMV('+o+')">'+o+'</button>').join("")+'</div>');}
function ansMV(v){const ok=v===MV.cur.ans;recordAnswer("Mate",ok,12);
 if(ok){sOK();confetti(8);toast("¡Correcto! 🎉",true,900);MV.ok++;}
 else{sNO();toast("Cuenta de nuevo: eran "+MV.cur.ans,false,1500);}
 MV.round++;setTimeout(nextMV,ok?900:1500);}
function dots(total,cur){return Array.from({length:total},(x,i)=>'<i class="'+(i<cur?"on":"")+'"></i>').join("");}

/* ============ PROBLEMAS HABLADOS ============ */
let PR={};
function gameProblems(){setTheme("kid");PR={qs:shuffled(PROBLEMS_KID).slice(0,5),i:0,ok:0};nextPR();}
function nextPR(){
 if(PR.i>=PR.qs.length)return nodeWin(starsFor(PR.ok,PR.qs.length),"Problemas");
 const q=PR.qs[PR.i];const order=shuffled(q.ops.map((o,i)=>({o,i})));PR.order=order;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(PR.qs.length,PR.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:10px">🔢 Resuelve el problema</h2>'
 +'<div class="card storytext" style="text-align:center">'+esc(q.q)+'</div>'
 +'<button class="speaker small" onclick="speakES(\''+esc(q.q).replace(/'/g,"\\'")+'\')">🔊 Leer en voz alta</button>'
 +'<div class="choices2">'+order.map((it,k)=>'<button class="kbtn white" onclick="ansPR('+k+')">'+esc(it.o)+'</button>').join("")+'</div>');}
function ansPR(k){const q=PR.qs[PR.i],ok=PR.order[k].i===q.a;recordAnswer("Problemas",ok,20);
 if(ok){sOK();confetti(8);toast("¡Genio! 🧠✨",true,900);PR.ok++;}else{sNO();toast("Era "+q.ops[q.a],false,1500);}
 PR.i++;setTimeout(nextPR,ok?900:1500);}

/* ============ LÓGICA ============ */
let LG={};
function gameLogic(){setTheme("kid");LG={qs:shuffled(LOGIC_KID).slice(0,5),i:0,ok:0};nextLG();}
function nextLG(){
 if(LG.i>=LG.qs.length)return nodeWin(starsFor(LG.ok,LG.qs.length),"Lógica");
 const q=LG.qs[LG.i];const order=shuffled(q.ops.map((o,i)=>({o,i})));LG.order=order;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(LG.qs.length,LG.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:8px">🧩 Piensa bien</h2>'
 +'<div class="bigpic">'+q.scene+'</div>'
 +'<div class="bigq center">'+esc(q.q)+'</div>'
 +'<button class="speaker small" onclick="speakES(\''+esc(q.q+(q.say?". "+q.say:"")).replace(/'/g,"\\'")+'\')">🔊 Leer</button>'
 +'<div class="choices2">'+order.map((it,k)=>'<button class="kbtn yellow" onclick="ansLG('+k+')">'+esc(it.o)+'</button>').join("")+'</div>');}
function ansLG(k){const q=LG.qs[LG.i],ok=LG.order[k].i===q.a;recordAnswer("Lógica",ok,15);
 if(ok){sOK();confetti(8);toast("¡Exacto! 🎯",true,900);LG.ok++;}else{sNO();toast("Era "+q.ops[q.a],false,1500);}
 LG.i++;setTimeout(nextLG,ok?900:1500);}

/* ============ SECUENCIAS ============ */
let SQ={};
function gameSeq(){setTheme("kid");SQ={qs:shuffled(SEQUENCES).slice(0,5),i:0,ok:0};nextSQ();}
function nextSQ(){
 if(SQ.i>=SQ.qs.length)return nodeWin(starsFor(SQ.ok,SQ.qs.length),"Secuencias");
 const q=SQ.qs[SQ.i];const order=shuffled(q.ops.map((o,i)=>({o,i})));SQ.order=order;
 const row=q.show.map(x=>x==="❓"?'<span class="seqq">❓</span>':'<span>'+x+'</span>').join("");
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(SQ.qs.length,SQ.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">➡️ ¿Qué sigue?</h2>'
 +'<div class="card"><div class="seqrow">'+row+'</div></div>'
 +'<div class="choices2">'+order.map((it,k)=>'<button class="kbtn blue" style="font-size:clamp(1.6rem,8vw,2.2rem)" onclick="ansSQ('+k+')">'+it.o+'</button>').join("")+'</div>');}
function ansSQ(k){const q=SQ.qs[SQ.i],ok=SQ.order[k].i===q.a;recordAnswer("Secuencias",ok,15);
 if(ok){sOK();confetti(8);toast("¡Buen patrón! 🔥",true,900);SQ.ok++;}else{sNO();toast("Era "+q.ops[q.a],false,1500);}
 SQ.i++;setTimeout(nextSQ,ok?900:1500);}

/* ============ INGLÉS: ESCUCHA Y TOCA ============ */
let LS={};
function gameListen(){setTheme("kid");
 if(!hasVoice())return noVoiceScreen("screenKidMap()");
 const pool=Object.values(EN_VOCAB).flat();
 LS={pool,round:0,ok:0,total:6};nextLS();}
function nextLS(){
 if(LS.round>=LS.total)return nodeWin(starsFor(LS.ok,LS.total),"Inglés");
 const correct=pick(LS.pool);LS.cur=correct;
 const wrong=shuffled(LS.pool.filter(w=>w[0]!==correct[0])).slice(0,3);
 LS.opts=shuffled([correct,...wrong]);
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(LS.total,LS.round)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:4px">🔊 Escucha y toca</h2>'
 +'<p class="center" style="margin-bottom:12px;font-size:1.05rem">Oye la palabra en inglés y toca el dibujo correcto</p>'
 +'<button class="speaker" onclick="speakEN(\''+correct[0]+'\')"><span class="ic">🔊</span> Escuchar otra vez</button>'
 +'<div class="choices2">'+LS.opts.map((o,k)=>'<button class="kbtn white" style="font-size:clamp(3rem,14vw,4rem);min-height:clamp(96px,26vw,130px)" onclick="ansLS('+k+')">'+o[2]+'</button>').join("")+'</div>');
 setTimeout(()=>speakEN(correct[0]),350);}
function ansLS(k){const ok=LS.opts[k][0]===LS.cur[0];recordAnswer("Inglés",ok,12);
 if(ok){sOK();confetti(10);speakEN(LS.cur[0]);toast("✓ "+LS.cur[0]+" = "+LS.cur[1],true,1400);LS.ok++;}
 else{sNO();toast("Era "+LS.cur[2]+" = "+LS.cur[0],false,1700);}
 LS.round++;setTimeout(nextLS,ok?1400:1700);}

/* ============ INGLÉS: APRENDER (tarjetas con audio) ============ */
let EL={};
function gameEnLearn(){setTheme("kid");
 if(!hasVoice())return noVoiceScreen("screenKidMap()");
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:6px">🎴 ¿Qué quieres aprender?</h2>'
 +'<p class="center" style="margin-bottom:14px">Toca un tema, escucha cada palabra y repítela</p>'
 +'<div class="choices2">'+EN_CATS.map(c=>'<button class="kbtn yellow" onclick="learnCat(\''+c[0]+'\')"><div style="font-size:2.4rem">'+c[2]+'</div>'+c[1]+'</button>').join("")+'</div>');}
function learnCat(cat){
 EL={cat,list:EN_VOCAB[cat],i:0};showCard();}
function showCard(){
 const w=EL.list[EL.i];const last=EL.i===EL.list.length-1;
 render(topbar("gameEnLearn()")
 +'<div class="progressdots">'+dots(EL.list.length,EL.i)+'</div>'
 +'<div class="card encard"><div class="pic">'+w[2]+'</div><div class="en">'+w[0]+'</div><div class="es">'+w[1]+'</div></div>'
 +'<button class="speaker" onclick="speakEN(\''+w[0]+'\')"><span class="ic">🔊</span> Escuchar</button>'
 +(last?'<button class="kbtn green" onclick="learnQuiz()">¡A practicar! 🎯</button>'
       :'<button class="kbtn blue" onclick="EL.i++;showCard()">Siguiente →</button>')
 +(EL.i>0?'<button class="kbtn white" onclick="EL.i--;showCard()">← Anterior</button>':''));
 setTimeout(()=>speakEN(w[0]),300);}
function learnQuiz(){EL.q={list:shuffled(EL.list),i:0,ok:0};nextLearnQ();}
function nextLearnQ(){
 const Q=EL.q;
 if(Q.i>=Q.list.length)return nodeWin(starsFor(Q.ok,Q.list.length),"Inglés");
 const correct=Q.list[Q.i];
 const wrong=shuffled(EL.list.filter(w=>w[0]!==correct[0])).slice(0,2);
 const opts=shuffled([correct,...wrong]);EL.q.opts=opts;EL.q.cur=correct;
 render(topbar("gameEnLearn()")
 +'<div class="progressdots">'+dots(Q.list.length,Q.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:10px">¿Cuál es <span style="color:var(--kid-blue)">'+correct[0]+'</span>?</h2>'
 +'<button class="speaker small" onclick="speakEN(\''+correct[0]+'\')">🔊 Oír</button>'
 +'<div class="choices2">'+opts.map((o,k)=>'<button class="kbtn white" style="font-size:clamp(3rem,14vw,4rem);min-height:clamp(96px,26vw,130px)" onclick="ansLearnQ('+k+')">'+o[2]+'</button>').join("")+'</div>');
 setTimeout(()=>speakEN(correct[0]),300);}
function ansLearnQ(k){const ok=EL.q.opts[k][0]===EL.q.cur[0];recordAnswer("Inglés",ok,12);
 if(ok){sOK();confetti(8);speakEN(EL.q.cur[0]);toast("✓ "+EL.q.cur[0],true,1200);EL.q.ok++;}
 else{sNO();toast("Era "+EL.q.cur[2],false,1500);}
 EL.q.i++;setTimeout(nextLearnQ,ok?1200:1500);}

/* ============ INGLÉS: ESCRIBIR (deletreo) ============ */
let SP={};
function gameSpell(){setTheme("kid");
 if(!hasVoice())return noVoiceScreen("screenKidMap()");
 const pool=[...EN_VOCAB.animals,...EN_VOCAB.colors,...EN_VOCAB.food,...EN_VOCAB.numbers].filter(w=>w[0].length<=5);
 SP={pool,round:0,ok:0,total:5};nextSP();}
function nextSP(){
 if(SP.round>=SP.total)return nodeWin(starsFor(SP.ok,SP.total),"Inglés");
 const w=pick(SP.pool);SP.cur=w;SP.typed=[];
 const letters=shuffled(w[0].toUpperCase().split(""));
 // añadir 2 letras señuelo
 const extra="ABCDEFGHIJKLMNOPRSTUW".split("").filter(c=>!w[0].toUpperCase().includes(c));
 const keys=shuffled([...letters,...shuffled(extra).slice(0,2)]);SP.keys=keys;
 renderSP();}
function renderSP(){
 const w=SP.cur;
 const slots=w[0].split("").map((_,i)=>'<div class="slot'+(SP.typed[i]?' filled':'')+'">'+(SP.typed[i]||"")+'</div>').join("");
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(SP.total,SP.round)+'</div>'
 +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:4px">✍️ Escribe la palabra</h2>'
 +'<div class="bigpic">'+w[2]+'</div>'
 +'<button class="speaker small" onclick="speakEN(\''+w[0]+'\')">🔊 '+w[0]+' ('+w[1]+')</button>'
 +'<div class="letterslots">'+slots+'</div>'
 +'<div class="keys">'+SP.keys.map((c,k)=>'<button class="key'+(SP.usedKeys&&SP.usedKeys.includes(k)?' used':'')+'" onclick="tapKey('+k+',\''+c+'\')">'+c+'</button>').join("")+'</div>'
 +'<div style="height:10px"></div>'
 +'<button class="kbtn white" onclick="SP.typed=[];SP.usedKeys=[];renderSP()">🧽 Borrar</button>');
 setTimeout(()=>speakEN(w[0]),300);}
function tapKey(k,c){
 if(!SP.usedKeys)SP.usedKeys=[];
 if(SP.usedKeys.includes(k))return;
 if(SP.typed.length>=SP.cur[0].length)return;
 SP.typed.push(c);SP.usedKeys.push(k);beep([500+SP.typed.length*50],.07);
 renderSP();
 if(SP.typed.length===SP.cur[0].length)setTimeout(checkSP,300);}
function checkSP(){
 const guess=SP.typed.join("").toLowerCase(),ok=guess===SP.cur[0].toLowerCase();
 recordAnswer("Inglés",ok,25);
 if(ok){sOK();confetti(12);speakEN(SP.cur[0]);toast("✓ ¡"+SP.cur[0]+"! 🎉",true,1400);SP.ok++;SP.round++;setTimeout(nextSP,1500);}
 else{sNO();toast("Casi… se escribe "+SP.cur[0].toUpperCase(),false,1800);SP.typed=[];SP.usedKeys=[];setTimeout(renderSP,1000);}}

/* ============ INGLÉS: FRASES ============ */
let PH={};
function gamePhrases(){setTheme("kid");
 if(!hasVoice())return noVoiceScreen("screenKidMap()");
 PH={qs:shuffled(EN_PHRASES).slice(0,6),i:0,ok:0};nextPH();}
function nextPH(){
 if(PH.i>=PH.qs.length)return nodeWin(starsFor(PH.ok,PH.qs.length),"Inglés");
 const p=PH.qs[PH.i];PH.cur=p;
 const wrong=shuffled(EN_PHRASES.filter(x=>x[0]!==p[0])).slice(0,2);
 const opts=shuffled([p,...wrong]);PH.opts=opts;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(PH.qs.length,PH.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">💬 ¿Qué significa?</h2>'
 +'<div class="card encard"><div style="font-size:clamp(1.6rem,7vw,2.2rem);font-weight:700;color:var(--kid-blue);font-family:Fredoka">"'+esc(p[0])+'"</div></div>'
 +'<button class="speaker" onclick="speakEN(\''+esc(p[0]).replace(/'/g,"")+'\')"><span class="ic">🔊</span> Escuchar la frase</button>'
 +opts.map((o,k)=>'<button class="kbtn white" onclick="ansPH('+k+')">'+esc(o[1])+'</button>').join(""));
 setTimeout(()=>speakEN(p[0].replace(/'/g,"")),350);}
function ansPH(k){const ok=PH.opts[k][0]===PH.cur[0];recordAnswer("Inglés",ok,15);
 if(ok){sOK();confetti(8);toast("✓ "+PH.cur[1],true,1300);PH.ok++;}else{sNO();toast("Era: "+PH.cur[1],false,1700);}
 PH.i++;setTimeout(nextPH,ok?1300:1700);}

/* ============ SONIDOS DE LETRAS (C, S, Q...) ============ */
let LT={};
function gameLetters(){setTheme("kid");
 LT={set:shuffled(LETTER_SOUNDS).slice(0,3),i:0,phase:"learn",ci:0,ok:0,total:0};
 LT.set.forEach(s=>LT.total+=Math.min(2,s.cases.length));renderLetters();}
function renderLetters(){
 const grp=LT.set[LT.i];
 if(!grp)return nodeWin(starsFor(LT.ok,Math.max(1,LT.qpool?LT.qpool.length:LT.ok)),"Letras");
 if(LT.phase==="learn"){
  const c=grp.cases[LT.ci];const last=LT.ci===grp.cases.length-1;
  render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🔡 El sonido de la <span style="color:var(--kid-blue);font-size:1.4em">'+grp.letter+'</span></h2>'
  +'<div class="card encard"><div class="pic">'+c[1]+'</div><div class="en" style="color:var(--kid-ink)">'+c[0]+'</div><div class="es">'+c[2]+'</div></div>'
  +'<button class="speaker" onclick="speakES(\''+c[0]+'\')"><span class="ic">🔊</span> Escuchar "'+c[0]+'"</button>'
  +(last?'<button class="kbtn green" onclick="lettersToQuiz()">¡A practicar! 🎯</button>'
        :'<button class="kbtn blue" onclick="LT.ci++;renderLetters()">Siguiente →</button>'));
  return;}
 // quiz: ¿con qué letra empieza?
 const q=LT.qpool[LT.qi];
 if(!q)return nodeWin(starsFor(LT.ok,LT.qpool.length),"Letras");
 const order=shuffled(q.ops);LT.order=order;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(LT.qpool.length,LT.qi)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">¿Con qué letra empieza?</h2>'
 +'<div class="bigpic">'+q.pic+'</div>'
 +'<button class="speaker small" onclick="speakES(\''+q.word+'\')">🔊 '+q.word+'</button>'
 +'<div class="choices2">'+order.map(o=>'<button class="kbtn yellow" style="font-size:clamp(2rem,9vw,2.6rem)" onclick="ansLetters(\''+o+'\')">'+o+'</button>').join("")+'</div>');}
function lettersToQuiz(){
 // construir preguntas de los grupos vistos
 LT.qpool=[];const letters=LETTER_SOUNDS.map(s=>s.letter);
 LT.set.forEach(g=>{g.cases.slice(0,2).forEach(c=>{
  const correct=c[0][0].toUpperCase();
  const others=shuffled(letters.filter(l=>l!==correct)).slice(0,2);
  LT.qpool.push({word:c[0],pic:c[1],correct,ops:shuffled([correct,...others])});});});
 LT.qpool=shuffled(LT.qpool);LT.qi=0;LT.phase="quiz";LT.ok=0;renderLetters();}
function ansLetters(o){const q=LT.qpool[LT.qi],ok=o===q.correct;recordAnswer("Letras",ok,15);
 if(ok){sOK();confetti(8);speakES(q.word);toast("✓ "+q.word+" empieza con "+q.correct,true,1400);LT.ok++;}
 else{sNO();toast(q.word+" empieza con "+q.correct,false,1700);}
 LT.qi++;setTimeout(renderLetters,ok?1400:1700);}

/* ============ pantalla sin voz ============ */
function noVoiceScreen(back){
 render(topbar(back)
 +'<div class="card" style="text-align:center"><div style="font-size:3rem">🔇</div>'
 +'<h2 style="margin:8px 0">Este juego necesita voz</h2>'
 +'<p style="font-size:1.05rem;line-height:1.5">Tu navegador no tiene síntesis de voz. Ábrela en <b>Google Chrome</b> (Android) o <b>Safari</b> (iPad) para escuchar el inglés.</p>'
 +'<button class="kbtn green" style="margin-top:14px" onclick="screenKidMap()">Volver al mapa</button></div>');}

/* ============ CRIATURAS COLECCIONABLES + MASCOTA ============ */
/* Cada criatura tiene 3 formas: se captura (nivel 1), sube de nivel al recapturarla,
   evoluciona en el nivel 3 y alcanza su forma final en el nivel 5. Sin tope: siempre hay algo que coleccionar o evolucionar. */
const CRITTERS=[
 {id:"flamy",name:"Flamy",forms:["🔥","🐉","🌋"]},{id:"aqua",name:"Aqua",forms:["💧","🐟","🐬"]},
 {id:"leafy",name:"Leafy",forms:["🍃","🌿","🌳"]},{id:"sparky",name:"Sparky",forms:["⚡","🌩️","🌟"]},
 {id:"rocky",name:"Rocky",forms:["🪨","⛰️","🗻"]},{id:"star",name:"Estela",forms:["⭐","🌟","💫"]},
 {id:"drako",name:"Drako",forms:["🦎","🐲","🐉"]},{id:"foxy",name:"Foxy",forms:["🦊","🐺","🦁"]},
 {id:"buho",name:"Búho",forms:["🐣","🦉","🦅"]},{id:"crab",name:"Pinza",forms:["🦐","🦀","🦞"]},
 {id:"uni",name:"Uny",forms:["🐴","🦓","🦄"]},{id:"robi",name:"Robi",forms:["⚙️","🤖","🛸"]},
 {id:"dino",name:"Dino",forms:["🥚","🦕","🦖"]},{id:"cat",name:"Michi",forms:["🐱","🐈","🐯"]},
 {id:"frog",name:"Brinco",forms:["🐸","🦎","🐊"]},{id:"bee",name:"Zumby",forms:["🐛","🐝","🦋"]},
 {id:"pingu",name:"Pingu",forms:["🐧","🦭","🐋"]},{id:"ghost",name:"Boo",forms:["👻","🎃","🧙"]},
 {id:"pup",name:"Rocco",forms:["🐶","🐕","🦮"]},{id:"pip",name:"Pip",forms:["🐭","🐿️","🦔"]},
 {id:"shelly",name:"Caracola",forms:["🐚","🐌","🐢"]},{id:"bambu",name:"Bambú",forms:["🐼","🐨","🦥"]},
 {id:"cometa",name:"Cometa",forms:["🌙","🪐","☄️"]},{id:"melody",name:"Melodía",forms:["🎵","🎶","🎸"]},
 // ----- nuevas (con rareza: r0 común, r1 rara, r2 legendaria) -----
 {id:"chispa",name:"Chispa",forms:["🐹","🐰","🦘"],r:0},{id:"nube",name:"Nubecita",forms:["☁️","🌧️","🌈"],r:0},
 {id:"sol",name:"Solín",forms:["🌱","🌻","🌞"],r:0},{id:"mar",name:"Marino",forms:["🐚","🐠","🐙"],r:0},
 {id:"hielo",name:"Hielo",forms:["❄️","⛄","🧊"],r:1},{id:"trueno",name:"Trueno",forms:["🐴","🦓","🦄"],r:1},
 {id:"selva",name:"Selva",forms:["🐍","🐊","🐉"],r:1},{id:"abeja2",name:"Polen",forms:["🌼","🐝","🍯"],r:0},
 {id:"luz",name:"Lumen",forms:["🕯️","💡","🌟"],r:1},{id:"ola",name:"Ola",forms:["💧","🌊","🐳"],r:1},
 {id:"fenixb",name:"Fénix",forms:["🥚","🐤","🔥🦅"],r:2},{id:"krak",name:"Kraken",forms:["🦑","🐙","🌊🐙"],r:2},
 {id:"galax",name:"Galaxo",forms:["⭐","🌌","🌠"],r:2},{id:"titan",name:"Titán",forms:["🦴","🦣","🦏"],r:2},
 {id:"hada",name:"Hada",forms:["🧚","✨","🦋✨"],r:2},{id:"golem",name:"Golem",forms:["🧱","🗿","🏔️"],r:1},
 {id:"draco2",name:"Dracón",forms:["🥚","🐲","🐉🔥"],r:2},{id:"lobo2",name:"Lunar",forms:["🐺","🌕🐺","🌑🐺"],r:1},
 // ----- tanda 3 (más para coleccionar) -----
 {id:"selene",name:"Selene",forms:["🌑","🌓","🌕"],r:0},{id:"trebol",name:"Trébol",forms:["🌱","🍀","🌳"],r:0},
 {id:"chili",name:"Chili",forms:["🌶️","🔥","🌋"],r:1},{id:"perla",name:"Perla",forms:["🦪","🐚","💎"],r:1},
 {id:"voltio",name:"Voltio",forms:["🔋","⚡","🌩️"],r:1},{id:"coral",name:"Coral",forms:["🪸","🐠","🐡"],r:0},
 {id:"tuki",name:"Tuki",forms:["🥚","🐤","🦜"],r:0},{id:"maple",name:"Maple",forms:["🍁","🦝","🌰"],r:0},
 {id:"yeti",name:"Yeti",forms:["❄️","⛄","🏔️"],r:2},{id:"aura",name:"Aura",forms:["🌊","🪼","✨🪼"],r:1},
 {id:"escar",name:"Escar",forms:["🐛","🪲","🌟🪲"],r:0},{id:"vulcan",name:"Vulcán",forms:["🪨","🌋","🔥🌋"],r:2},
 {id:"nimbo",name:"Nimbo",forms:["☁️","⛈️","🌪️"],r:1},{id:"marina",name:"Marina",forms:["🐚","🧜","🧜‍♀️"],r:2},
 {id:"zumzum",name:"Zumzum",forms:["🌸","🐦","🦚"],r:1},{id:"pincho",name:"Pincho",forms:["🌵","🏜️","🌸🌵"],r:0},
 {id:"espectro",name:"Espectro",forms:["👻","🕯️","🔮"],r:1},{id:"grifo2",name:"Grifo",forms:["🥚","🦅","🦁🦅"],r:2},
 // ----- tanda 4 (hasta 100) -----
 {id:"delfin",name:"Splash",forms:["🐟","🐬","🌊🐬"],r:0},{id:"loro2",name:"Kiko",forms:["🥚","🐤","🦜"],r:0},
 {id:"mariposa",name:"Aleta",forms:["🐛","🐝","🦋"],r:0},{id:"camaleon",name:"Cromo",forms:["🥚","🦎","🌈🦎"],r:1},
 {id:"ardilla2",name:"Nuez",forms:["🌰","🐿️","🌳🐿️"],r:0},{id:"erizo",name:"Pinchitos",forms:["🌰","🦔","🌟🦔"],r:0},
 {id:"morsa",name:"Bigotes",forms:["🐟","🦭","🐋"],r:1},{id:"caballito",name:"Marito",forms:["🌊","🐠","🐡"],r:0},
 {id:"lince",name:"Sombra",forms:["🐱","🐈","🐆"],r:1},{id:"alce",name:"Ramón",forms:["🦌","🌲🦌","❄️🦌"],r:1},
 {id:"tucan2",name:"Pico",forms:["🥚","🐦","🦤"],r:0},{id:"murcielago",name:"Nocturno",forms:["🐭","🦇","🌙🦇"],r:1},
 {id:"pulpo2",name:"Tinta",forms:["🐚","🐙","🌊🐙"],r:1},{id:"foca",name:"Copo",forms:["🐟","🦭","❄️🦭"],r:0},
 {id:"jirafa",name:"Altura",forms:["🌿","🦒","🌳🦒"],r:0},{id:"rino",name:"Tanque",forms:["🦏","⛰️🦏","🌋🦏"],r:1},
 {id:"cocodrilo",name:"Mandíbula",forms:["🥚","🐊","🐉🐊"],r:1},{id:"flamenco",name:"Rosa",forms:["🥚","🦩","🌅🦩"],r:0},
 {id:"mapache2",name:"Bandido",forms:["🌙","🦝","🌟🦝"],r:0},{id:"koala2",name:"Eucalipto",forms:["🌿","🐨","🌳🐨"],r:0},
 {id:"orca",name:"Capitán",forms:["🐟","🐋","🌊🐋"],r:2},{id:"aguila2",name:"Cielo",forms:["🥚","🦅","⚡🦅"],r:1},
 {id:"toro",name:"Embiste",forms:["🐄","🐂","🔥🐂"],r:1},{id:"oveja",name:"Nubosa",forms:["☁️","🐑","🌈🐑"],r:0},
 {id:"caballo2",name:"Galope",forms:["🐴","🏇","🦄"],r:1},{id:"gallo",name:"Alba",forms:["🥚","🐔","🌅🐓"],r:0},
 {id:"pato",name:"Chapoteo",forms:["🥚","🐤","🦆"],r:0},{id:"cangrejo2",name:"Tenaza",forms:["🦐","🦀","🌊🦀"],r:0},
 {id:"escorpion",name:"Aguijón",forms:["🦂","🌵🦂","🔥🦂"],r:1},{id:"libelula",name:"Brisa",forms:["🐛","🦗","🌈🦗"],r:0},
 {id:"panda2",name:"Bambino",forms:["🎋","🐼","🌸🐼"],r:1},{id:"zorro2",name:"Llama",forms:["🦊","🔥🦊","🌟🦊"],r:1},
 {id:"lobo3",name:"Aullido",forms:["🐺","🌕🐺","⚡🐺"],r:1},{id:"tigre2",name:"Rayo",forms:["🐱","🐯","🔥🐯"],r:2},
 {id:"leon2",name:"Melena",forms:["🐱","🦁","👑🦁"],r:2},{id:"dragon3",name:"Inferno",forms:["🥚","🐲","🌋🐉"],r:2},
 {id:"unicornio2",name:"Brillo",forms:["🐴","🦄","🌈🦄"],r:2},{id:"fenix2",name:"Renacer",forms:["🔥","🐤","🔥🦅"],r:2},
 {id:"pegaso",name:"Viento",forms:["🐴","🕊️🐴","☁️🐴"],r:2},{id:"hidra",name:"Hidra",forms:["🐍","🐲","🌊🐉"],r:2}];
function critters(){const p=prof();if(!p.critters)p.critters=[];return p.critters;}
function critterCount(id){return critters().filter(x=>x===id).length;}
function uniqueCritters(){return new Set(critters()).size;}
function critterForm(c,count){return c.forms[count>=5?2:count>=3?1:0];}
function maybeCritter(){
 // aparece seguido pero no siempre (~1 de cada 3), y NUNCA más de 4 victorias sin premio
 const p=prof();
 p.sinceCritter=(p.sinceCritter||0)+1;
 if(Math.random()>=0.35&&p.sinceCritter<4){save();return null;}
 p.sinceCritter=0;
 const owned=critters();
 const news=CRITTERS.filter(c=>!owned.includes(c.id));
 let c;
 if(news.length&&(Math.random()<0.6||!owned.length)){
  // selección ponderada por rareza: comunes salen más, legendarias muy poco
  const weighted=[];news.forEach(x=>{const w=(x.r===2?1:x.r===1?3:7);for(let i=0;i<w;i++)weighted.push(x);});
  c=pick(weighted);
 }else{
  const upgradable=CRITTERS.filter(x=>{const n=critterCount(x.id);return n>=1&&n<5;});
  if(upgradable.length)c=pick(upgradable);
  else if(news.length)c=pick(news);
  else return null; // colección completa al máximo
 }
 owned.push(c.id);save();
 const n=critterCount(c.id);
 return{id:c.id,name:c.name,count:n,isNew:n===1,evolved:n===3||n===5,e:critterForm(c,n)};}
/* mascota que evoluciona según XP total */
function petStage(xp){const lv=level(xp);
 return lv>=16?{e:"✨🐉✨",n:"Dragón Legendario"}:lv>=12?{e:"🐉",n:"Dragón"}:lv>=8?{e:"🦅",n:"Águila"}:lv>=5?{e:"🐯",n:"Tigre"}:lv>=3?{e:"🐺",n:"Lobo"}:{e:"🥚",n:"Huevo"};}
function screenCritters(){setTheme("kid");
 const grid=CRITTERS.map(c=>{
  const n=critterCount(c.id);
  const has=n>0;
  const lvl=Math.min(n,5);
  const dots=has?"❤️".repeat(lvl)+"🤍".repeat(5-lvl):"";
  return '<div style="text-align:center;padding:10px;border-radius:18px;border:4px solid var(--kid-ink);background:'+(has?(n>=5?"linear-gradient(180deg,#FFF3C4,#FFE08A)":"#FFF"):"#D7DCE6")+';box-shadow:0 5px 0 rgba(30,42,74,.7)">'
   +'<div style="font-size:clamp(2.2rem,10vw,3rem);filter:'+(has?"none":"grayscale(1) opacity(.4)")+'">'+(has?critterForm(c,n):"❓")+'</div>'
   +'<div style="font-family:Fredoka;font-weight:700;font-size:.8rem">'+(has?c.name:"???")+'</div>'
   +(has?'<div style="font-size:.55rem;letter-spacing:-1px">'+dots+'</div>':'')
   +'</div>';}).join("");
 const pet=petStage(prof().xp);
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🎒 Mi colección</h2>'
 +'<div class="card center"><div style="font-size:clamp(3.5rem,18vw,5rem)">'+pet.e+'</div><b style="font-size:1.2rem">Tu mascota: '+pet.n+'</b><p style="margin-top:4px">Sigue aprendiendo para que evolucione 🌟</p></div>'
 +'<div class="card"><b style="font-size:1.1rem">Criaturas: '+uniqueCritters()+'/'+CRITTERS.length+'</b>'
 +'<p style="font-size:.85rem;margin:4px 0 0">Si capturas una repetida, sube de nivel ❤️ — en el nivel 3 <b>evoluciona</b> y en el 5 llega a su forma final ✨</p>'
 +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px">'+grid+'</div></div>'
 +'<button class="kbtn green" onclick="screenKidMap()">← Volver al mapa</button>');}

/* ============ MOTOR DE RETO ADAPTATIVO UNIVERSAL ============ */
/* Toma uno o varios temas, pide retos (IA o fallback) y los juega con audio si es inglés. */
let CH={};
async function playTopics(label,topicKeys,opts){
 opts=opts||{};
 setTheme("kid");
 render(topbar("screenKidMap()")
  +'<div class="card center" style="padding:40px"><div style="font-size:3rem" class="spin">⏳</div>'
  +'<h2 style="margin-top:10px">Preparando tus retos…</h2>'
  +'<p class="mut">'+(S.geminiKey?"Creando preguntas nuevas con IA ✨":"Cargando retos")+'</p></div>');
 // elige los temas más débiles si son varios
 const chosen = topicKeys.length>1 ? weakestTopics(topicKeys, Math.min(opts.topicsPerSession||2,topicKeys.length)) : topicKeys;
 let items=[];
 for(const tk of chosen){
  const part=await buildChallenges(tk, opts.perTopic||4);
  part.forEach(it=>it._topic=tk);
  items=items.concat(part);
 }
 items=shuffled(items).slice(0,opts.total||8);
 if(!items.length){toast("No se pudo cargar. Intenta de nuevo.",false,2000);return screenKidMap();}
 CH={label,items,i:0,ok:0,wrongTopics:{}};
 renderCH();}
function renderCH(){
 const it=CH.items[CH.i];
 if(!it)return finishCH();
 const order=it.ops.map((o,k)=>({o,k}));
 const shown=shuffled(order);CH.order=shown;CH.correctK=it.a;
 const isEN=it.word||KID_TOPICS[it._topic]&&KID_TOPICS[it._topic].en;
 const topic=KID_TOPICS[it._topic];
 const head=topic?topic.emoji+" "+topic.name:CH.label;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(CH.items.length,CH.i)+'</div>'
 +'<p class="center" style="font-family:Fredoka;font-weight:600;margin-bottom:8px">'+head+' · '+(CH.i+1)+'/'+CH.items.length+'</p>'
 +(it.pic?'<div class="bigpic">'+it.pic+'</div>':'')
 +'<div class="bigq center">'+esc(it.q)+'</div>'
 +(isEN&&it.word?'<button class="speaker" onclick="speakEN(\''+esc(it.word).replace(/'/g,"")+'\')"><span class="ic">🔊</span> Escuchar en inglés</button>'
   :'<button class="speaker small" onclick="speakES(\''+esc(it.q).replace(/'/g,"\\'")+'\')">🔊 Leer pregunta</button>')
 +'<div class="choices2">'+shown.map((s,vi)=>'<button class="kbtn white" style="font-size:clamp(1.15rem,5vw,1.45rem)" onclick="ansCH('+vi+')">'+esc(s.o)+'</button>').join("")+'</div>');
 if(isEN&&it.word)setTimeout(()=>speakEN(it.word.replace(/'/g,"")),350);}
function ansCH(vi){
 const it=CH.items[CH.i];
 const ok=CH.order[vi].k===CH.correctK;
 const subj=(KID_TOPICS[it._topic]&&KID_TOPICS[it._topic].en)?"Inglés":(KID_TOPICS[it._topic]?KID_TOPICS[it._topic].name:CH.label);
 recordAnswer(subj,ok,it.word?12:15);
 if(it._topic)recordTopic(it._topic,ok);
 if(ok){sOK();confetti(8);if(it.word)speakEN(it.word.replace(/'/g,""));toast("¡Correcto! 🎉",true,1000);CH.ok++;}
 else{sNO();CH.wrongTopics[it._topic]=(CH.wrongTopics[it._topic]||0)+1;
  toast("Era: "+it.ops[it.a]+(it.tip?"  💡 "+it.tip:""),false,it.tip?3000:1800);}
 CH.i++;setTimeout(renderCH,ok?1000:1800);}
async function finishCH(){
 // refuerzo adaptativo: si falló mucho un tema, añade 2 retos extra de ese tema al final
 const worst=Object.entries(CH.wrongTopics).sort((a,b)=>b[1]-a[1])[0];
 if(worst&&worst[1]>=2&&!CH.reinforced){
  CH.reinforced=true;
  toast("💪 ¡Vamos a practicar "+(KID_TOPICS[worst[0]]?KID_TOPICS[worst[0]].name:"esto")+" un poco más!",false,2200);
  const extra=await buildChallenges(worst[0],2);extra.forEach(it=>it._topic=worst[0]);
  CH.items=CH.items.concat(extra);
  return setTimeout(renderCH,2200);
 }
 nodeWin(starsFor(CH.ok,CH.items.length),CH.label);}

/* ============ ORDENA LA FRASE ============ */
const SENTENCES_ES=[["El","gato","duerme","en","la","cama"],["Yo","tomo","leche","caliente"],["La","niña","juega","con","la","pelota"],["Mi","perro","corre","muy","rápido"],["El","sol","brilla","en","el","cielo"],["Ana","come","una","manzana","roja"]];
let OS={};
function gameOrder(){setTheme("kid");OS={qs:shuffled(SENTENCES_ES).slice(0,4),i:0,ok:0};nextOS();}
function nextOS(){
 if(OS.i>=OS.qs.length)return nodeWin(starsFor(OS.ok,OS.qs.length),"Ordenar");
 const correct=OS.qs[OS.i];OS.correct=correct;OS.built=[];OS.used=[]; // reinicia las palabras usadas (bug: la 2ª frase quedaba desactivada)
 OS.pool=shuffled(correct.map((w,idx)=>({w,idx})));
 renderOS();}
function renderOS(){
 const sentence=OS.built.map(b=>b.w).join(" ");
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(OS.qs.length,OS.i)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">🧩 Ordena la frase</h2>'
 +'<button class="speaker small" onclick="speakES(\''+OS.correct.join(" ")+'\')">🔊 Escuchar cómo suena</button>'
 +'<div class="card" style="min-height:70px;font-size:clamp(1.3rem,6vw,1.7rem);font-family:Fredoka;font-weight:600;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px">'+(sentence||'<span class="mut">Toca las palabras en orden…</span>')+'</div>'
 +'<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:14px">'
 + OS.pool.map((p,k)=>'<button class="kbtn yellow" style="display:inline-block;width:auto;margin:0;padding:12px 18px;font-size:clamp(1.1rem,5vw,1.4rem)'+(OS.used&&OS.used.includes(k)?';opacity:.3;pointer-events:none':'')+'" onclick="tapWord('+k+')">'+esc(p.w)+'</button>').join("")
 +'</div><div style="height:14px"></div>'
 +(OS.built.length?'<button class="kbtn white" onclick="OS.built=[];OS.used=[];renderOS()">🧽 Borrar</button>':''));}
function tapWord(k){
 if(!OS.used)OS.used=[];if(OS.used.includes(k))return;
 OS.used.push(k);OS.built.push(OS.pool[k]);beep([480+OS.built.length*40],.07);
 if(OS.built.length===OS.correct.length){
  const ok=OS.built.every((b,idx)=>b.w===OS.correct[idx]);
  recordAnswer("Ordenar",ok,25);
  if(ok){sOK();confetti(12);speakES(OS.correct.join(" "));toast("¡Frase perfecta! 🌟",true,1500);OS.ok++;OS.i++;setTimeout(nextOS,1600);}
  else{sNO();toast("Casi… escucha cómo va y prueba de nuevo",false,2000);OS.built=[];OS.used=[];setTimeout(renderOS,1200);}
 }else renderOS();}

/* ============ TRANSCRIPCIÓN POR VOZ (di la palabra) ============ */
let VR={};
/* el reconocimiento a veces devuelve "2" en vez de "two": normalizamos */
const NUM_WORDS={"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten"};
function normSpeech(s){return String(s).toLowerCase().trim().replace(/[^a-z0-9 ]/g,"").split(/\s+/).map(w=>NUM_WORDS[w]||w).join(" ");}
function lev(a,b){
 if(a===b)return 0;
 const m=a.length,n=b.length;if(!m)return n;if(!n)return m;
 let prev=Array.from({length:n+1},(_,j)=>j);
 for(let i=1;i<=m;i++){const cur=[i];
  for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
  prev=cur;}
 return prev[n];}
/* homófonos: el reconocedor a veces escribe la otra palabra que suena igual */
const HOMOPHONES={blue:["blew"],red:["read"],one:["won"],two:["to","too"],four:["for","fore"],eight:["ate"],bear:["bare"],horse:["hoarse"],sun:["son"],eye:["i"],hair:["hare"],sea:["see"],flower:["flour"]};
function speechMatches(target,alts){
 const t=normSpeech(target);
 const tol=t.length<=4?1:2; // tolerancia: pronunciación de niño de 6 años
 const homo=HOMOPHONES[t]||[];
 return alts.some(raw=>{
  const a=normSpeech(raw);
  if(!a)return false;
  if(a===t||a.split(" ").includes(t))return true;
  if(homo.includes(a)||a.split(" ").some(w=>homo.includes(w)))return true;
  return lev(a,t)<=tol||a.split(" ").some(w=>lev(w,t)<=tol);});}
function gameSay(){setTheme("kid");
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){return render(topbar("screenKidMap()")
  +'<div class="card center"><div style="font-size:3rem">🎤</div><h2 style="margin:8px 0">Este juego usa el micrófono</h2>'
  +'<p style="font-size:1.05rem;line-height:1.5">Funciona en <b>Google Chrome (Android)</b>. Abre la app ahí y permite el micrófono.</p>'
  +'<button class="kbtn green" style="margin-top:14px" onclick="screenKidMap()">Volver</button></div>');}
 const pool=[...EN_VOCAB.animals,...EN_VOCAB.colors,...EN_VOCAB.numbers];
 VR={pool,round:0,ok:0,total:5,listening:false};nextVR();}
function nextVR(){
 VR.listening=false;
 if(VR.round>=VR.total)return nodeWin(starsFor(VR.ok,VR.total),"Pronunciación");
 const w=pick(VR.pool);VR.cur=w;VR.tries=0;
 render(topbar("screenKidMap()")
 +'<div class="progressdots">'+dots(VR.total,VR.round)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.4rem);text-align:center;margin-bottom:6px">🎤 Di la palabra en inglés</h2>'
 +'<div class="card encard"><div class="pic">'+w[2]+'</div><div class="en">'+w[0]+'</div><div class="es">'+w[1]+'</div></div>'
 +'<button class="speaker" onclick="speakEN(\''+w[0]+'\')"><span class="ic">🔊</span> Escuchar primero</button>'
 +'<button class="kbtn green" id="micbtn" onclick="startListen()">🎤 ¡Tocar y hablar!</button>'
 +'<div id="vrfb"></div>'
 +'<button class="kbtn white" onclick="VR.round++;nextVR()" style="margin-top:6px">Saltar esta palabra →</button>');}
function vrFeedback(ok,heard){
 const box=document.getElementById("vrfb");if(!box)return;
 box.innerHTML=ok
  ?'<div style="background:var(--kid-green);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">¡Muy bien dicho! 🎉</div>'
  :'<div style="background:var(--kid-red);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">Escuché "'+esc(heard||"…")+'". Oye la palabra 🔊 e intenta otra vez</div>';}
function startListen(){
 if(VR.listening)return; // evita dobles arranques que rompían el juego
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const rec=new SR();rec.lang="en-US";rec.maxAlternatives=5;rec.interimResults=false;rec.continuous=false;
 VR.listening=true;
 window.speechSynthesis&&window.speechSynthesis.cancel(); // que la voz no se oiga a sí misma
 const btn=document.getElementById("micbtn");
 if(btn)btn.textContent="🔴 Escuchando… ¡habla!";
 const fb=document.getElementById("vrfb");if(fb)fb.innerHTML="";
 let gotResult=false;
 rec.onresult=(e)=>{
  gotResult=true;VR.listening=false;
  const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);
  const ok=speechMatches(VR.cur[0],alts);
  recordAnswer("Pronunciación",ok,20);
  if(ok){sOK();confetti(12);VR.ok++;vrFeedback(true);VR.round++;setTimeout(nextVR,1800);}
  else{sNO();VR.tries++;vrFeedback(false,alts[0]);
   speakEN(VR.cur[0]);
   if(VR.tries>=3){toast("Vamos con otra palabra 💪",false,1500);VR.round++;setTimeout(nextVR,1600);}}};
 rec.onerror=(e)=>{
  VR.listening=false;
  const b=document.getElementById("micbtn");if(b)b.textContent="🎤 ¡Tocar y hablar!";
  const msg=e.error==="not-allowed"?"Permite el micrófono en el navegador 🙏":e.error==="no-speech"?"No te oí — acércate y habla fuerte 🎤":"No escuché bien, intenta de nuevo";
  toast(msg,false,1800);};
 rec.onend=()=>{
  VR.listening=false;
  const b=document.getElementById("micbtn");if(b)b.textContent="🎤 ¡Tocar y hablar!";
  if(!gotResult){const box=document.getElementById("vrfb");
   if(box&&!box.innerHTML)box.innerHTML='<p class="center" style="margin-top:10px">No te escuché 😅 — toca el botón y habla cerquita</p>';}};
 try{rec.start();}catch(e){VR.listening=false;}}

/* ============ JUEGO: ROBOT ============ */
let RB={};
function gameRobot(startLvl){setTheme("kid");RB={lvl:startLvl,cmds:[],wins:0};renderRobot();}
function renderRobot(){
 const L=ROBOT_LEVELS[RB.lvl%ROBOT_LEVELS.length];
 let cells="";
 for(let y=0;y<L.h;y++)for(let x=0;x<L.w;x++){
  let c="";
  if(x===L.start[0]&&y===L.start[1])c="🤖";
  else if(x===L.goal[0]&&y===L.goal[1])c="⭐";
  else if(L.walls.some(w=>w[0]===x&&w[1]===y))c="🪨";
  cells+='<div class="cell" id="c'+x+'_'+y+'">'+c+'</div>';}
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:1.4rem">🤖 Programa al robot</h2>'
 +'<p style="margin:4px 0 8px;font-size:1.05rem">Llévalo a la ⭐ — Pista: '+L.hint+'</p>'
 +'<div class="robotgrid" style="grid-template-columns:repeat('+L.w+',1fr)">'+cells+'</div>'
 +'<div class="cmdrow" id="cmdrow"></div>'
 +'<div class="cmdbtns"><button onclick="addCmd(0)">⬆️</button><button onclick="addCmd(1)">⬇️</button><button onclick="addCmd(2)">⬅️</button><button onclick="addCmd(3)">➡️</button></div>'
 +'<button class="kbtn green" onclick="runRobot()">▶️ ¡EJECUTAR!</button>'
 +'<button class="kbtn white" onclick="RB.cmds=[];drawCmds()">🧽 Borrar programa</button>');
 drawCmds();}
const ARROWS=["⬆️","⬇️","⬅️","➡️"];
function addCmd(i){if(RB.cmds.length<12){RB.cmds.push(i);beep([500+i*60],.08);drawCmds();}}
function drawCmds(){document.getElementById("cmdrow").innerHTML=RB.cmds.map(c=>'<span class="cmd">'+ARROWS[c]+'</span>').join("")||'<span style="opacity:.5;font-size:1rem;padding:8px">Toca las flechas para armar tu programa…</span>';}
function runRobot(){
 const L=ROBOT_LEVELS[RB.lvl%ROBOT_LEVELS.length];
 let[x,y]=L.start.slice();let i=0;
 const step=()=>{
  if(i>=RB.cmds.length)return finish();
  const c=RB.cmds[i++];
  const nx=x+(c===3?1:c===2?-1:0),ny=y+(c===1?1:c===0?-1:0);
  if(nx<0||ny<0||nx>=L.w||ny>=L.h||L.walls.some(w=>w[0]===nx&&w[1]===ny)){
   sNO();toast("💥 ¡Chocó! Revisa los pasos",false,1500);recordAnswer("Robot",false,25);
   setTimeout(renderRobot,1400);return;}
  document.getElementById("c"+x+"_"+y).textContent=(x===L.goal[0]&&y===L.goal[1])?"⭐":"";
  x=nx;y=ny;document.getElementById("c"+x+"_"+y).textContent="🤖";beep([400],.06);
  setTimeout(step,360);};
 const finish=()=>{
  const win=(x===L.goal[0]&&y===L.goal[1]);recordAnswer("Robot",win,25);
  if(win){RB.wins++;sWIN();confetti(16);
   if(RB.wins>=2)return nodeWin(3,"Robot");
   toast("¡Llegó! 🎉 Uno más…",true,1300);
   setTimeout(()=>{RB.lvl++;RB.cmds=[];renderRobot();},1400);}
  else{sNO();toast("No llegó a la ⭐ — ¡ajusta el programa!",false,1500);}};
 step();}

/* ============ JUEGO: CUENTO LARGO ILUSTRADO ============ */
let ST={};
function gameStory(idx){setTheme("kid");
 const c=CUENTOS[idx%CUENTOS.length];
 ST={c,page:0,phase:"read",qi:0,ok:0};renderStory();}
function renderStory(){
 const c=ST.c;
 if(ST.phase==="read"){
  const p=c.pages[ST.page];
  const last=ST.page===c.pages.length-1;
  render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);margin-bottom:8px">📖 '+esc(c.title)+'</h2>'
  +'<div class="progressdots">'+c.pages.map((x,i)=>'<i class="'+(i<=ST.page?"on":"")+'"></i>').join("")+'</div>'
  +(p.img?'<img src="'+p.img+'" alt="Ilustración" style="display:block;width:100%;border-radius:18px;border:4px solid var(--kid-ink);box-shadow:0 6px 0 rgba(30,42,74,.8);margin-bottom:12px">'
    :'<div class="scene">'+p.scene+(S.geminiKey&&!p.imgFail?'<div style="font-size:.8rem;font-family:Nunito;font-weight:700;opacity:.65">🎨 pintando la escena con IA…</div>':'')+'</div>')
  +'<div class="card storytext">'+boldHTML(p.text)+'</div>'
  +'<button class="speaker" onclick="speakES(\''+esc(stripTags(p.text)).replace(/'/g,"\\'")+'\')"><span class="ic">🔊</span> Escuchar esta parte</button>'
  +(last?'<button class="kbtn green" onclick="ST.phase=\'quiz\';renderStory()">Responder preguntas →</button>'
        :'<button class="kbtn blue" onclick="ST.page++;renderStory()">Siguiente página →</button>')
  +(ST.page>0?'<button class="kbtn white" onclick="ST.page--;renderStory()">← Volver atrás</button>':''));
  // ilustración automática con IA (si hay clave): no hay que tocar nada
  if(S.geminiKey&&!p.img&&!p.imgFail)illustratePage();
  return;}
 // fase quiz
 const q=c.qs[ST.qi];
 if(!q)return nodeWin(starsFor(ST.ok,c.qs.length),"Comprensión");
 const order=shuffled(q.ops.map((o,i)=>({o,i})));ST.order=order;
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);margin-bottom:8px">🧠 '+esc(c.title)+' — pregunta '+(ST.qi+1)+'/'+c.qs.length+'</h2>'
 +'<div class="scene" style="font-size:clamp(2.4rem,11vw,3.6rem);min-height:80px">'+c.pages.map(p=>p.scene).join("")+'</div>'
 +'<div class="bigq">'+esc(q.q)+'</div>'
 +'<button class="speaker small" onclick="speakES(\''+esc(q.q).replace(/'/g,"\\'")+'\')">🔊 Leer pregunta</button>'
 +order.map((it,k)=>'<button class="kbtn white" onclick="ansStory('+k+')" style="font-size:clamp(1.1rem,5vw,1.4rem)">'+esc(it.o)+'</button>').join(""));}
function stripTags(s){return s.replace(/<\/?b>/g,"");}
function ansStory(k){
 const c=ST.c,q=c.qs[ST.qi],ok=ST.order[k].i===q.a;
 recordAnswer("Comprensión",ok,30);
 if(ok){sOK();confetti(10);toast("¡Muy bien pensado! 🌟",true,1200);ST.ok++;}
 else{sNO();toast("La respuesta era: "+q.ops[q.a],false,2200);}
 ST.qi++;setTimeout(renderStory,ok?1300:2300);}
