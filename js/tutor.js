"use strict";
/* ============ TUTOR DE INGLÉS INTERACTIVO + LECTURA EN VOZ ALTA ============
   Usan el micrófono (Web Speech API) — funcionan en Google Chrome.
   El tutor dice una frase, el niño la repite y se le corrige la pronunciación.
   En lectura, el niño lee un cuento y se marca palabra por palabra. */

function micAvailable(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
function micNeededScreen(back){
 return '<div class="card center"><div style="font-size:3rem">🎤</div><h2 style="margin:8px 0">Esto usa el micrófono</h2>'
  +'<p style="font-size:1.05rem;line-height:1.5">Funciona en <b>Google Chrome</b> (Android o PC). Ábrelo ahí y permite el micrófono.</p>'
  +'<button class="kbtn green" style="margin-top:14px" onclick="'+back+'">Volver</button></div>';
}
function normEs(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[.,;:!¡¿?"]/g,"").replace(/\s+/g," ").trim();}

/* ---------- TUTOR DE INGLÉS ---------- */
const TUTOR_EN=[
 {t:"Saludos",ic:"👋",items:[["Hello","Hola"],["Good morning","Buenos días"],["How are you?","¿Cómo estás?"],["I am fine","Estoy bien"],["Thank you","Gracias"],["See you later","Hasta luego"]]},
 {t:"Sobre mí",ic:"🙂",items:[["My name is Lyan","Me llamo Lyan"],["I am a kid","Soy un niño"],["I am happy","Estoy feliz"],["I like to play","Me gusta jugar"],["I am six years old","Tengo seis años"]]},
 {t:"Animales",ic:"🐶",items:[["The dog","El perro"],["The cat","El gato"],["A big lion","Un león grande"],["I see a bird","Veo un pájaro"],["The fish","El pez"]]},
 {t:"Colores y números",ic:"🌈",items:[["The red ball","La pelota roja"],["A blue sky","Un cielo azul"],["One, two, three","Uno, dos, tres"],["Green grass","Pasto verde"],["The yellow sun","El sol amarillo"]]},
 {t:"En casa",ic:"🏠",items:[["This is my house","Esta es mi casa"],["I am hungry","Tengo hambre"],["I love my family","Amo a mi familia"],["Good night","Buenas noches"]]}];
let TU={};
function screenTutorEN(){setTheme("kid");
 if(!micAvailable())return render(topbar("screenEnglishHub()")+micNeededScreen("screenEnglishHub()"));
 render(topbar("screenEnglishHub()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🎧 Tutor de inglés</h2>'
  +'<p class="center" style="margin-bottom:14px">El profe dice una frase y tú la repites 🎤. Elige un tema:</p>'
  +TUTOR_EN.map((l,i)=>'<button class="kbtn '+["red","blue","green","yellow","purple"][i%5]+'" style="text-align:left;display:flex;align-items:center;gap:12px" onclick="tutorStart('+i+')"><span style="font-size:1.8rem">'+l.ic+'</span> '+l.t+'</button>').join(""));
}
function tutorStart(i){
 const l=TUTOR_EN[i];
 TU={items:l.items.slice(),i:0,ok:0,total:l.items.length,listening:false,title:l.t};
 nextTutor();
}
function nextTutor(){
 TU.listening=false;
 if(TU.i>=TU.total)return nodeWin(starsFor(TU.ok,TU.total),"Pronunciación");
 const it=TU.items[TU.i];TU.cur=it;
 render(topbar("screenTutorEN()")
  +'<div class="progressdots">'+dots(TU.total,TU.i)+'</div>'
  +'<div class="card center" style="padding:16px 14px;background:linear-gradient(180deg,#EAF6FF,#D6ECFF)">'
   +'<div style="font-size:3rem">👩‍🏫</div>'
   +'<div style="font-family:Fredoka;font-weight:700;font-size:clamp(1.4rem,7vw,2rem);margin-top:6px">'+esc(it[0])+'</div>'
   +'<div style="opacity:.75;font-size:1.05rem">'+esc(it[1])+'</div>'
  +'</div>'
  +'<button class="speaker" onclick="speakEN(\''+esc(it[0]).replace(/'/g,"")+'\')"><span class="ic">🔊</span> Escuchar al profe</button>'
  +'<button class="kbtn green" id="tumic" onclick="tutorListen()">🎤 ¡Mi turno! Repetir</button>'
  +'<div id="tufb"></div>'
  +'<button class="kbtn white" style="margin-top:6px" onclick="TU.i++;nextTutor()">Saltar →</button>');
 setTimeout(()=>speakEN(it[0]),350);
}
function tutorListen(){
 if(TU.listening)return;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const rec=new SR();rec.lang="en-US";rec.maxAlternatives=5;rec.interimResults=false;rec.continuous=false;
 TU.listening=true;
 try{window.speechSynthesis.cancel();}catch(e){}
 if(typeof stopGemAudio==="function")stopGemAudio();
 const btn=document.getElementById("tumic");if(btn)btn.textContent="🔴 Escuchando… ¡habla!";
 const fb=document.getElementById("tufb");if(fb)fb.innerHTML="";
 let got=false;
 rec.onresult=(e)=>{got=true;TU.listening=false;
  const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);
  const ok=speechMatches(TU.cur[0],alts);
  recordAnswer("Pronunciación",ok,20);
  const box=document.getElementById("tufb");
  if(ok){sOK();confetti(12);TU.ok++;
   if(box)box.innerHTML='<div style="background:var(--kid-green);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">¡Excelente pronunciación! 🎉</div>';
   TU.i++;setTimeout(nextTutor,1700);}
  else{sNO();
   if(box)box.innerHTML='<div style="background:var(--kid-red);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">Escuché "'+esc(alts[0]||"…")+'". Oye al profe 🔊 e inténtalo otra vez</div>';
   const b=document.getElementById("tumic");if(b)b.textContent="🎤 Intentar otra vez";}};
 rec.onerror=()=>{TU.listening=false;const b=document.getElementById("tumic");if(b)b.textContent="🎤 ¡Mi turno! Repetir";};
 rec.onend=()=>{TU.listening=false;if(!got){const b=document.getElementById("tumic");if(b)b.textContent="🎤 No te escuché — toca y habla";}};
 try{rec.start();}catch(e){TU.listening=false;}
}

/* ---------- LECTURA EN VOZ ALTA (corrige la pronunciación al leer) ---------- */
const READINGS=[
 "El gato corre por el parque.",
 "Mi mamá hace una rica sopa.",
 "El sol brilla en el cielo azul.",
 "La niña juega con su pelota roja.",
 "Mi perro mueve la cola feliz.",
 "Hoy vamos a leer un cuento bonito.",
 "El pez nada en el agua clara.",
 "Me gusta correr y saltar mucho.",
 "La luna sale grande en la noche.",
 "Mi amigo y yo somos muy felices."];
let RA={};
function gameReadAloud(){setTheme("kid");
 if(!micAvailable())return render(topbar("screenLeer()")+micNeededScreen("screenLeer()"));
 RA={qs:shuffled(READINGS).slice(0,5),i:0,ok:0,listening:false};nextRead();}
function nextRead(){
 RA.listening=false;
 if(RA.i>=RA.qs.length)return nodeWin(starsFor(RA.ok,RA.qs.length),"Comprensión");
 const ph=RA.qs[RA.i];RA.cur=ph;
 render(topbar("screenLeer()")
  +'<div class="progressdots">'+dots(RA.qs.length,RA.i)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">📖 Lee en voz alta</h2>'
  +'<p class="center" style="font-size:.9rem;margin-bottom:10px">Lee la frase claro y fuerte 🎤. Te marco cada palabra.</p>'
  +'<div id="raText" class="card" style="font-size:clamp(1.4rem,6.5vw,1.9rem);font-family:Fredoka;font-weight:600;text-align:center;line-height:1.5">'+ph.split(" ").map(w=>'<span style="display:inline-block;margin:2px 3px">'+esc(w)+'</span>').join(" ")+'</div>'
  +'<button class="speaker small" onclick="speakES(\''+esc(ph).replace(/'/g,"\\'")+'\')">🔊 Escúchala primero</button>'
  +'<button class="kbtn green" id="ramic" onclick="readListen()">🎤 ¡Leer en voz alta!</button>'
  +'<div id="rafb"></div>'
  +'<button class="kbtn white" style="margin-top:6px" onclick="RA.i++;nextRead()">Saltar →</button>');
}
function readListen(){
 if(RA.listening)return;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const rec=new SR();rec.lang="es-CO";rec.maxAlternatives=5;rec.interimResults=false;rec.continuous=false;
 RA.listening=true;
 try{window.speechSynthesis.cancel();}catch(e){}
 if(typeof stopGemAudio==="function")stopGemAudio();
 const btn=document.getElementById("ramic");if(btn)btn.textContent="🔴 Escuchando… ¡lee!";
 const fb=document.getElementById("rafb");if(fb)fb.innerHTML="";
 let got=false;
 rec.onresult=(e)=>{got=true;RA.listening=false;
  const alts=[];for(let i=0;i<e.results[0].length;i++)alts.push(e.results[0][i].transcript);
  evalReading(alts);};
 rec.onerror=()=>{RA.listening=false;const b=document.getElementById("ramic");if(b)b.textContent="🎤 ¡Leer en voz alta!";};
 rec.onend=()=>{RA.listening=false;if(!got){const b=document.getElementById("ramic");if(b)b.textContent="🎤 No te escuché — toca y lee";}};
 try{rec.start();}catch(e){RA.listening=false;}
}
function evalReading(alts){
 const origWords=RA.cur.split(" ");
 const expected=origWords.map(w=>normEs(w)).filter(Boolean);
 // mejor coincidencia entre las alternativas escuchadas
 let best=null,bestScore=-1;
 alts.forEach(a=>{
  const heard=normEs(a).split(" ").filter(Boolean);
  const res=expected.map(w=>heard.some(h=>h===w||lev(h,w)<=(w.length<=4?1:2)));
  const score=res.filter(Boolean).length;
  if(score>bestScore){bestScore=score;best=res;}
 });
 const correct=bestScore,total=expected.length,ratio=total?correct/total:0;
 // pinta cada palabra verde/roja
 const txt=document.getElementById("raText");
 if(txt)txt.innerHTML=origWords.map((w,i)=>'<span style="display:inline-block;margin:2px 3px;padding:1px 6px;border-radius:8px;color:#fff;background:'+(best&&best[i]?"#3EC97C":"#FF6B6B")+'">'+esc(w)+'</span>').join(" ");
 const passed=ratio>=0.7;
 recordAnswer("Comprensión",passed,30);
 const fb=document.getElementById("rafb");
 if(passed){sOK();confetti(12);RA.ok++;
  if(fb)fb.innerHTML='<div style="background:var(--kid-green);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">¡Muy bien leído! Acertaste '+correct+'/'+total+' palabras 🌟</div>';
  RA.i++;setTimeout(nextRead,2200);}
 else{sNO();
  if(fb)fb.innerHTML='<div style="background:var(--kid-red);color:#fff;border:4px solid var(--kid-ink);border-radius:16px;padding:14px;text-align:center;font-family:Fredoka;margin-top:12px">Las palabras en rojo practícalas otra vez 🔴. Escucha 🔊 y vuelve a leer.</div>';
  const b=document.getElementById("ramic");if(b)b.textContent="🎤 Leer otra vez";}
}
