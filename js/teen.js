/* ============ HOME TEEN ============ */
function screenTeenHome(){setTheme("teen");
 const ai=S.geminiKey?'<button class="tbtn acc" onclick="screenAIGen()">✨ Generar reto nuevo con IA</button>':'';
 render(topbar("screenStart()")
 +'<div class="card" style="display:flex;align-items:center;justify-content:space-between">'
 +'<div><h1 class="title">Hey, '+esc(prof().name)+' '+prof().emoji+'</h1><p class="mut">Reto rápido: responde antes de que acabe el tiempo y arma combos ⚡</p></div>'
 +'<div class="eq"><i></i><i></i><i></i><i></i><i></i></div></div>'
 +missionsHTML()+ai
 +'<button class="tbtn acc" onclick="screenAcademyTeen()">🎓 &nbsp;English Academy <span class="mut">· unidades y coronas 👑</span></button>'
 +'<button class="tbtn" onclick="startQuiz(\'Química\',B_QUIMICA)">⚗️ &nbsp;Química <span class="mut">· reto cronometrado</span></button>'
 +'<button class="tbtn" onclick="startQuiz(\'Física\',B_FISICA)">🚀 &nbsp;Física <span class="mut">· reto cronometrado</span></button>'
 +'<button class="tbtn" onclick="screenReadList()">📖 &nbsp;Lecturas en inglés <span class="mut">· toca y traduce</span></button>'
 +'<button class="tbtn" onclick="startFlash()">🎴 &nbsp;Flashcards de vocabulario</button>'
 +'<button class="tbtn" onclick="startQuiz(\'Grammar\',B_GRAMMAR)">🇬🇧 &nbsp;Grammar challenge</button>'
 +'<button class="tbtn" onclick="startComprension()">🧠 &nbsp;Comprensión lectora</button>'
 +'<button class="tbtn" onclick="startQuiz(\'Lógica\',B_LOGICA)">💻 &nbsp;Lógica & código</button>'
 +'<button class="tbtn" onclick="startQuiz(\'Música\',B_MUSICA)">🎧 &nbsp;Teoría musical</button>'
 +'<button class="tbtn" onclick="startEar()">🎹 &nbsp;Entrena tu oído</button>');}

/* ============ QUIZ TEEN: cronómetro + combos ============ */
let QZ={};
function startQuiz(subject,bank){setTheme("teen");
 const rng=dailyRng(subject);
 QZ={subject,bank,qs:shuffled(bank,rng).slice(0,8),i:0,ok:0,combo:0,maxCombo:0,score:0,t0:Date.now()};
 renderQ();}
function renderQ(){
 clearInterval(QZ.tick);
 const q=QZ.qs[QZ.i];
 if(!q)return quizEnd();
 QZ.order=shuffled(q.ops.map((o,i)=>({o,i})));
 QZ.timeLeft=100;
 const qtext=q.code?'<pre style="white-space:pre-wrap;background:#141127;border:1px solid #322B52;padding:14px;border-radius:14px;font-size:1rem;line-height:1.5">'+esc(q.q)+'</pre>':'<div class="bigq">'+esc(stripHTML(q.q))+'</div>';
 const textBlock=q.t?'<div class="card" style="line-height:1.7;font-size:1.05rem">'+esc(stripHTML(q.t))+'</div>':'';
 render(topbar("screenTeenHome()")
 +'<div style="display:flex;justify-content:space-between;align-items:center"><b>'+esc(QZ.subject)+' · '+(QZ.i+1)+'/'+QZ.qs.length+'</b><b style="color:var(--teen-cyan)">'+QZ.score+' pts</b></div>'
 +'<div class="timerbar"><div id="tb" style="width:100%"></div></div>'
 +textBlock+qtext
 +QZ.order.map((it,k)=>'<button class="tbtn opt" id="op'+k+'" onclick="ansQ('+k+')">'+esc(it.o)+'</button>').join(""));
 QZ.tick=setInterval(()=>{QZ.timeLeft-=1.25;
  const el=document.getElementById("tb");if(el)el.style.width=Math.max(0,QZ.timeLeft)+"%";
  if(QZ.timeLeft<=0){clearInterval(QZ.tick);timeUp();}},250);}
function timeUp(){
 const q=QZ.qs[QZ.i];QZ.combo=0;sNO();
 recordAnswer(QZ.subject,false,20);
 toast("⏱️ ¡Tiempo! Era: "+esc(q.ops[q.a]),false,1900);
 QZ.i++;setTimeout(renderQ,1800);}
function ansQ(k){
 clearInterval(QZ.tick);
 const q=QZ.qs[QZ.i],ok=QZ.order[k].i===q.a;
 const secs=Math.round((100-QZ.timeLeft)/5);
 recordAnswer(QZ.subject,ok,secs);
 document.querySelectorAll(".opt").forEach(b=>b.disabled=true);
 if(ok){QZ.ok++;QZ.combo++;QZ.maxCombo=Math.max(QZ.maxCombo,QZ.combo);
  const mult=Math.min(QZ.combo,4);
  const pts=10*mult+Math.round(QZ.timeLeft/10);
  QZ.score+=pts;prof().coins+=mult-1;
  if(QZ.combo>=3)touchDay().combo3=true;
  save();sOK();
  if(QZ.combo>=2){const c=document.createElement("div");c.className="combo";c.textContent="⚡ COMBO x"+QZ.combo;document.body.appendChild(c);setTimeout(()=>c.remove(),900);}
  toast("✓ +"+pts+" pts"+(QZ.combo>=2?" · combo x"+QZ.combo:""),true,900);}
 else{QZ.combo=0;sNO();toast("Era: "+esc(q.ops[q.a]),false,2000);}
 QZ.i++;setTimeout(renderQ,ok?950:1950);}
function quizEnd(){
 const pct=Math.round(QZ.ok/QZ.qs.length*100);
 const best=prof().best[QZ.subject]||0;
 const isRecord=QZ.score>best;
 if(isRecord){prof().best[QZ.subject]=QZ.score;save();}
 if(pct>=70){sWIN();confetti(26);}
 render(topbar("screenTeenHome()")
 +'<div class="card endcard"><div class="big">'+(pct>=80?"🏆":pct>=50?"🌟":"💪")+'</div>'
 +'<h2>'+QZ.score+' puntos'+(isRecord?" · ¡NUEVO RÉCORD! 🎉":"")+'</h2>'
 +'<p class="mut" style="margin-bottom:6px">'+QZ.ok+'/'+QZ.qs.length+' correctas ('+pct+'%) · mejor combo x'+QZ.maxCombo+'</p>'
 +(best&&!isRecord?'<p class="mut" style="margin-bottom:14px">Tu récord en '+esc(QZ.subject)+': '+best+' pts</p>':'<div style="height:10px"></div>')
 +(QZ.bank?'<button class="tbtn acc" onclick="startQuiz(QZ.subject,QZ.bank)">🔁 Superar mi puntaje</button>':'')
 +'<button class="tbtn" style="text-align:center" onclick="screenTeenHome()">Volver al menú</button></div>');}

/* ============ FLASHCARDS ============ */
let FC={};
function startFlash(){setTheme("teen");
 FC={deck:shuffled(FLASHCARDS).slice(0,10),i:0,known:0};renderFlash();}
function renderFlash(){
 if(FC.i>=FC.deck.length){
  sWIN();if(FC.known>=7)confetti(20);
  return render(topbar("screenTeenHome()")
  +'<div class="card endcard"><div class="big">🎴</div><h2>'+FC.known+' de '+FC.deck.length+' palabras dominadas</h2>'
  +'<p class="mut" style="margin-bottom:16px">Las que marcaste como difíciles volverán a salir otro día</p>'
  +'<button class="tbtn acc" onclick="startFlash()">Otra ronda 🔁</button>'
  +'<button class="tbtn" style="text-align:center" onclick="screenTeenHome()">Volver</button></div>');}
 const c=FC.deck[FC.i];
 render(topbar("screenTeenHome()")
 +'<p class="mut center" style="margin-bottom:10px">Carta '+(FC.i+1)+' de '+FC.deck.length+' · toca para voltear</p>'
 +'<div class="flash" id="fc" onclick="document.getElementById(\'fc\').classList.toggle(\'flip\')"><div class="in">'
 +'<div class="f">'+esc(c[0])+'<span class="hint">🇬🇧 inglés — toca para ver el significado</span></div>'
 +'<div class="b">'+esc(c[1])+'<span class="hint">🇪🇸 español</span></div></div></div>'
 +'<div style="display:flex;gap:12px">'
 +'<button class="tbtn" style="flex:1;text-align:center;border-color:#DC2626;color:#FCA5A5" onclick="flashAns(false)">😅 No la sabía</button>'
 +'<button class="tbtn" style="flex:1;text-align:center;border-color:#16A34A;color:#86EFAC" onclick="flashAns(true)">😎 ¡La sabía!</button></div>');}
function flashAns(knew){
 recordAnswer("Vocabulario",knew,8);
 if(knew){FC.known++;sOK();}else sNO();
 FC.i++;renderFlash();}

/* ============ LECTURAS TAP-TRANSLATE ============ */
function allReadings(){return B_LECTURAS.concat(S.aiBank.nina.filter(x=>x.type==="reading"));}
function screenReadList(){setTheme("teen");
 render(topbar("screenTeenHome()")
 +'<h2 style="margin-bottom:4px">📖 Lecturas en inglés</h2>'
 +'<p class="mut" style="margin-bottom:14px">Toca cualquier palabra punteada para ver su traducción al instante</p>'
 +allReadings().map((r,i)=>'<button class="tbtn" onclick="openReading('+i+')">'+esc(r.title)+' <span class="mut">· nivel '+esc(r.level||"A2")+'</span></button>').join(""));}
function openReading(i){
 const r=allReadings()[i];
 const html=stripHTML(r.text).split(/(\s+)/).map(tok=>{
  const clean=tok.toLowerCase().replace(/[^a-z']/g,"");
  if(r.words&&r.words[clean])return '<span class="word" onclick="showWord(this,\''+clean+'\','+i+')">'+esc(tok)+'</span>';
  return esc(tok);}).join("");
 render(topbar("screenReadList()")
 +'<h2 style="margin-bottom:10px">'+esc(r.title)+'</h2>'
 +'<div class="card" style="line-height:2.1;font-size:1.12rem">'+html+'</div>'
 +'<div id="wordbox"></div>'
 +'<button class="tbtn acc" onclick="readingQuiz('+i+')">Responder las preguntas →</button>');}
function showWord(el,w,i){
 el.classList.add("tapped");beep([880],.07);
 const r=allReadings()[i];
 document.getElementById("wordbox").innerHTML='<div class="card" style="border-color:var(--teen-cyan)"><b style="color:var(--teen-cyan);font-size:1.2rem">'+esc(w)+'</b> &nbsp;=&nbsp; <span style="font-size:1.1rem">'+esc(r.words[w])+'</span></div>';}
function readingQuiz(i){
 const r=allReadings()[i];touchDay().readDone=true;save();
 QZ={subject:"Inglés-Lectura",qs:r.qs,i:0,ok:0,combo:0,maxCombo:0,score:0};renderQ();}
function startComprension(){setTheme("teen");
 const item=pick(B_COMPRENSION.concat(S.aiBank.nina.filter(x=>x.type==="comp")),dailyRng("comp"));
 QZ={subject:"Comprensión",qs:item.qs.map(q=>({t:item.t,q:q.q,ops:q.ops,a:q.a})),i:0,ok:0,combo:0,maxCombo:0,score:0};renderQ();}

/* ============ OÍDO MUSICAL ============ */
const NOTES={"Do":261.6,"Re":293.7,"Mi":329.6,"Fa":349.2,"Sol":392,"La":440,"Si":493.9};
let ER={};
function startEar(){setTheme("teen");ER={i:0,ok:0,total:6};nextEar();}
function nextEar(){
 if(ER.i>=ER.total){sWIN();if(ER.ok>=4)confetti(18);
  return render(topbar("screenTeenHome()")
  +'<div class="card endcard"><div class="big">🎧</div><h2>'+ER.ok+'/'+ER.total+' notas identificadas</h2>'
  +'<button class="tbtn acc" onclick="startEar()">Otra ronda 🔁</button>'
  +'<button class="tbtn" style="text-align:center" onclick="screenTeenHome()">Volver</button></div>');}
 const names=Object.keys(NOTES);ER.note=pick(names);
 ER.opts=shuffled([ER.note,...shuffled(names.filter(n=>n!==ER.note)).slice(0,2)]);
 render(topbar("screenTeenHome()")
 +'<h2 style="margin-bottom:4px">🎹 ¿Qué nota suena?</h2>'
 +'<p class="mut" style="margin-bottom:14px">Ronda '+(ER.i+1)+' de '+ER.total+' · compárala con el Do</p>'
 +'<div style="display:flex;gap:12px"><button class="tbtn cyan" style="flex:1;text-align:center" onclick="tone(NOTES.Do,.8)">🔉 Do de referencia</button>'
 +'<button class="tbtn acc" style="flex:1" onclick="tone(NOTES[ER.note],1)">🔊 Nota misteriosa</button></div>'
 +ER.opts.map((n,k)=>'<button class="tbtn opt" style="text-align:center;font-size:1.25rem" onclick="ansEar('+k+')">'+n+'</button>').join(""));}
function ansEar(k){
 const ok=ER.opts[k]===ER.note;recordAnswer("Oído",ok,10);
 if(ok){ER.ok++;sOK();toast("¡Exacto! Era "+ER.note,true,1100);}
 else{sNO();toast("Era "+ER.note+" — escúchala de nuevo 👂",false,1500);tone(NOTES[ER.note],1);}
 ER.i++;setTimeout(nextEar,1400);}

/* ============ IA GEMINI ============ */
async function geminiJSON(promptText){
 const models=["gemini-2.5-flash","gemini-2.0-flash","gemini-flash-latest"];
 let res=null;
 for(const m of models){
  res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent?key="+encodeURIComponent(S.geminiKey),
   {method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({contents:[{parts:[{text:promptText}]}],generationConfig:{temperature:0.9}})});
  if(res.ok)break;if(res.status!==404)break;}
 if(!res||!res.ok){
  let detalle="";try{const j=await res.json();detalle=(j.error&&j.error.message)||"";}catch(e){}
  throw new Error("Error de la API ("+(res?res.status:"red")+")"+(detalle?": "+detalle.slice(0,130):"")+" — prueba la clave en el panel de padres.");}
 const data=await res.json();
 let txt=(data.candidates&&data.candidates[0].content.parts.map(p=>p.text||"").join(""))||"";
 txt=txt.replace(/```json|```/g,"").trim();
 const a=txt.indexOf("{"),b=txt.lastIndexOf("}");
 return JSON.parse(txt.slice(a,b+1));}
function screenAIGen(){setTheme("teen");
 render(topbar("screenTeenHome()")
 +'<h2 style="margin-bottom:4px">✨ Reto generado por IA</h2><p class="mut" style="margin-bottom:14px">Gemini crea contenido nuevo solo para ti:</p>'
 +'<button class="tbtn" onclick="aiGen(\'reading\')">📖 Nueva lectura en inglés (música / series)</button>'
 +'<button class="tbtn" onclick="aiGen(\'comp\')">🧠 Nueva lectura de curiosidades científicas</button>'
 +'<button class="tbtn" onclick="aiGen(\'quiz_quimica\')">⚗️ Quiz nuevo de química</button>'
 +'<button class="tbtn" onclick="aiGen(\'quiz_fisica\')">🚀 Quiz nuevo de física</button>'
 +'<div id="fb"></div>');}
async function aiGen(kind){
 document.getElementById("fb").innerHTML='<div class="card center"><span class="spin">⏳</span> Generando con IA…</div>';
 const P={
  reading:'Crea una lectura corta en inglés nivel A2-B1 para una estudiante de 14 años fan de la música. Responde SOLO JSON válido sin markdown: {"type":"reading","title":"Título","level":"A2","text":"70-100 palabras en inglés","words":{"palabra":"traducción español (mínimo 8 palabras que aparezcan en el texto, en minúscula)"},"qs":[{"q":"pregunta en inglés","ops":["correcta","mala","mala"],"a":0},{"q":"otra","ops":["correcta","mala","mala"],"a":0}]}',
  comp:'Crea un texto breve en español (80-110 palabras) sobre una curiosidad científica real, nivel 9° grado. SOLO JSON: {"type":"comp","t":"texto","qs":[{"q":"pregunta","ops":["correcta","mala","mala"],"a":0},{"q":"pregunta2","ops":["correcta","mala","mala"],"a":0}]}',
  quiz_quimica:'Crea 6 preguntas de química de 9° (tabla periódica, enlaces, reacciones, pH). SOLO JSON: {"type":"quiz","subject":"Química IA","qs":[{"q":"...","ops":["correcta","mala","mala"],"a":0}]} con 6 en qs.',
  quiz_fisica:'Crea 6 preguntas de física de 9° (cinemática, Newton, energía). SOLO JSON: {"type":"quiz","subject":"Física IA","qs":[{"q":"...","ops":["correcta","mala","mala"],"a":0}]} con 6 en qs.'};
 try{
  const obj=await geminiJSON(P[kind]);
  // sanitizar: la IA a veces devuelve etiquetas HTML que salían como texto visible
  if(obj.title)obj.title=stripHTML(obj.title);
  if(obj.text)obj.text=stripHTML(obj.text);
  if(obj.t)obj.t=stripHTML(obj.t);
  if(obj.qs)obj.qs=obj.qs.map(q=>({q:stripHTML(q.q),ops:(q.ops||[]).map(o=>stripHTML(o)),a:q.a||0}));
  if(obj.words){const w={};Object.keys(obj.words).forEach(k=>{w[stripHTML(k).toLowerCase()]=stripHTML(obj.words[k]);});obj.words=w;}
  if(obj.type==="reading"||obj.type==="comp"){S.aiBank.nina.push(obj);save();
   toast("✨ ¡Nuevo contenido agregado!",true,1300);
   setTimeout(obj.type==="reading"?screenReadList:startComprension,1200);}
  else if(obj.type==="quiz"){QZ={subject:obj.subject,qs:obj.qs,i:0,ok:0,combo:0,maxCombo:0,score:0};renderQ();}
 }catch(e){document.getElementById("fb").innerHTML='<div class="card" style="border-color:#DC2626">'+esc(e.message||"No se pudo generar, intenta de nuevo.")+'</div>';}}
