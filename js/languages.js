"use strict";
/* ============ CURSO DE IDIOMAS (perfil adulto) — CEFR A1→C2 ============ */
/* Estructura fija por lección: repaso → vocabulario → gramática → conversación → quiz (80% para avanzar) → cierre.
   Vocabulario/gramática/pronunciación SIEMPRE vienen del banco curado (js/languages-content.js) — así la
   lección nunca inventa gramática incorrecta. La IA (si hay clave) enriquece lo que más se beneficia de
   variedad: el repaso, el quiz y sobre todo la conversación libre. Sin clave, todo sigue funcionando con
   bancos fijos y un diálogo de opción múltiple. */
function langState(id){
 const p=prof();if(!p.lang)p.lang={};
 if(!p.lang[id])p.lang[id]={lvl:0,lesson:0,passed:[false,false,false,false,false,false],history:[],totalDone:0};
 return p.lang[id];}

function screenLangHub(){setTheme("adulto");
 render(topbar("screenAdultHome()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🌍 Idiomas</h2>'
  +'<p class="mut center" style="margin-bottom:14px">Elige un idioma y avanza nivel por nivel (CEFR A1→C2)</p>'
  +LANGS.map(l=>{const st=langState(l.id);
   return '<button class="abtn" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="screenLangLevels(\''+l.id+'\')">'
    +'<span style="font-size:2.2rem">'+l.flag+'</span>'
    +'<span style="flex:1"><span style="font-size:1.15rem;font-weight:700">'+l.name+'</span><br>'
    +'<span class="mut" style="font-size:.82rem">Nivel '+CEFR_LEVELS[st.lvl]+' · lección '+(st.lesson+1)+'/'+LANG_SITUATIONS.length+'</span></span></button>';
  }).join("")
  +(S.geminiKey?'':'<p class="mut" style="margin-top:12px">💡 Con la clave de Gemini activa, la conversación y el quiz se generan libremente. Sin ella, usa un banco fijo curado.</p>'));}

function screenLangLevels(id){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 const path=CEFR_LEVELS.map((nm,i)=>{
  const unlocked=i<=st.lvl,passed=st.passed[i];
  return '<button class="abtn'+(passed?' green':unlocked?'':' locked')+'" '+(unlocked?'':'style="opacity:.5"')+' onclick="'
   +(unlocked?"screenLangLevelDetail('"+id+"',"+i+")":"toast('Aprueba el nivel anterior primero 🔒',false,1600)")+'">'
   +(unlocked?nm:'🔒 '+nm)+(passed?' ✓':'')+'</button>';
 }).join("");
 render(topbar("screenLangHub()")
  +'<h2 style="text-align:center">'+info.flag+' '+info.name+'</h2>'
  +'<p class="mut center" style="margin-bottom:14px">Completa las 6 situaciones de cada nivel (80% en el quiz) para subir</p>'
  +path);}

function screenLangLevelDetail(id,lvl){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 const situation=LANG_SITUATIONS[st.lesson%LANG_SITUATIONS.length];
 render(topbar("screenLangLevels('"+id+"')")
  +'<h2 style="text-align:center">'+info.flag+' Nivel '+CEFR_LEVELS[lvl]+'</h2>'
  +'<div class="card center"><p style="font-size:1.05rem">Lección de hoy:</p><h3>'+LANG_SITUATION_LABEL[situation]+'</h3>'
  +'<p class="mut" style="margin-top:6px">Lección '+(st.lesson+1)+' de '+LANG_SITUATIONS.length+' de este nivel</p></div>'
  +'<button class="abtn green" onclick="startLangLesson(\''+id+'\','+lvl+')">▶️ Empezar lección</button>'
  +'<button class="abtn" onclick="screenLangVideos(\''+id+'\','+lvl+')">🎬 Videos y comprensión</button>');}

/* ---- estado de la lección activa ---- */
let LL={};
function buildRepaso(prevEntry){
 if(!prevEntry||!prevEntry.vocab||!prevEntry.vocab.length)return [];
 const pool=shuffled(prevEntry.vocab).slice(0,3);
 return pool.map(w=>{
  const distractors=pickN(prevEntry.vocab.filter(v=>v!==w).map(v=>v[1]),2);
  const ops=shuffled([w[1],...distractors]);
  return{q:'Repaso: ¿qué significa "'+w[0]+'"?',ops,a:ops.indexOf(w[1])};});}

async function startLangLesson(id,lvl){setTheme("adulto");
 render(topbar("screenLangLevelDetail('"+id+"',"+lvl+")")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando tu lección…</h2></div>');
 const st=langState(id);
 const situation=LANG_SITUATIONS[st.lesson%LANG_SITUATIONS.length];
 const vocab=LANG_VOCAB_SEED[id][situation];
 const grammar=LANG_GRAMMAR_SEED[id][lvl];
 const prev=st.history.length?st.history[st.history.length-1]:null;
 LL={id,lvl,situation,vocab,grammar,repaso:buildRepaso(prev),repasoK:0,repasoOk:0};
 screenLangRepaso();}

function screenLangRepaso(){setTheme("adulto");
 if(!LL.repaso.length)return screenLangVocab();
 const it=LL.repaso[LL.repasoK];
 if(!it)return screenLangVocab();
 render(topbar(null)
  +'<div class="progressdots">'+dots(LL.repaso.length,LL.repasoK)+'</div>'
  +'<h2 style="text-align:center">🔁 Repaso rápido</h2>'
  +'<p class="mut center" style="margin-bottom:10px">De la lección anterior</p>'
  +'<div class="bigq center">'+esc(it.q)+'</div>'
  +it.ops.map((o,i)=>'<button class="abtn" onclick="ansLangRepaso('+i+')">'+esc(o)+'</button>').join(""));}
function ansLangRepaso(i){
 const it=LL.repaso[LL.repasoK];if(!it)return;
 const ok=i===it.a;if(ok){LL.repasoOk++;sOK();}else sNO();
 LL.repasoK++;setTimeout(screenLangRepaso,700);}

function screenLangVocab(){setTheme("adulto");
 render(topbar(null)
  +'<h2 style="text-align:center">'+LANG_SITUATION_LABEL[LL.situation]+'</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Vocabulario de hoy — toca 🔊 para escuchar</p>'
  +LL.vocab.map(w=>
   '<div class="card langword"><b style="font-size:1.1rem">'+esc(w[0])+'</b> '
   +'<button class="spk" onclick="speakLang(\''+LL.id+'\','+JSON.stringify(w[0])+')">🔊</button>'
   +'<br><span class="mut">'+esc(w[1])+'</span>'
   +'<p style="font-size:.88rem;margin-top:6px"><i>"'+esc(w[2])+'"</i></p>'
   +'<p style="font-size:.82rem;margin-top:4px">💡 '+esc(w[3])+'</p></div>'
  ).join("")
  +'<button class="abtn green" onclick="screenLangGrammar()">Siguiente →</button>');}

function pronCard(id){
 const items=LANG_PRONUNCIATION[id]||[];
 if(!items.length)return "";
 return '<div class="card"><h3>🗣️ Pronunciación</h3>'
  +items.map(p=>'<p style="margin-top:6px;line-height:1.4"><b>'+esc(p.sonido)+':</b> '+esc(p.compara)+'</p>').join("")+'</div>';}

function screenLangGrammar(){setTheme("adulto");
 const g=LL.grammar;
 render(topbar(null)
  +'<h2 style="text-align:center">📐 Una regla de hoy</h2>'
  +'<div class="card"><h3>'+esc(g.rule)+'</h3>'
  +'<p style="margin-top:8px;line-height:1.6">'+esc(g.explicacion)+'</p>'
  +'<p style="margin-top:10px;line-height:1.6"><b>🇪🇸 vs. español:</b> '+esc(g.compara)+'</p></div>'
  +pronCard(LL.id)
  +'<button class="abtn green" onclick="startLangConvo()">Practicar en conversación →</button>');}

/* ---- conversación: IA libre si hay clave, diálogo fijo si no ---- */
function langMixInstruction(lvl){
 if(lvl<=0)return "Escribe casi todo en español, con solo 2-3 palabras sueltas en el idioma meta.";
 if(lvl<=1)return "Mezcla mitad español, mitad idioma meta.";
 if(lvl<=2)return "Escribe sobre todo en el idioma meta, con aclaraciones cortas en español solo si hace falta.";
 if(lvl<=3)return "Escribe casi todo en el idioma meta; aclara en español solo palabras muy difíciles.";
 return "Escribe TODO en el idioma meta, sin usar español.";}
function buildFallbackConvoScript(id,situation){
 const ph=LANG_PHRASES[id],vocab=LANG_VOCAB_SEED[id][situation];
 return [
  {npc:ph.greet+" "+ph.howAreYou,opts:[{text:ph.imFine},{text:ph.dontUnderstand}]},
  {npc:ph.whatsYourName,opts:[{text:ph.myNameIs+" Kate."}]},
  {npc:vocab[0][0]+"?",opts:[{text:ph.yes},{text:ph.no}]},
  {npc:pick(vocab)[0]+" — "+ph.canYouRepeat+"?",opts:[{text:ph.thanks},{text:ph.canYouRepeat}]},
  {npc:ph.goodbye,opts:[]}
 ];}
async function startLangConvo(){setTheme("adulto");
 LL.convo={history:[],mode:S.geminiKey?"ai":"fallback",fallbackIdx:0};
 if(LL.convo.mode==="ai"){
  render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando la conversación…</h2></div>');
  try{
   const obj=await geminiJSON('Eres un hablante nativo de '+langInfo(LL.id).name+' en una situación de "'+LANG_SITUATION_LABEL[LL.situation]+'" con un estudiante hispanohablante de nivel '+CEFR_LEVELS[LL.lvl]+'. '+langMixInstruction(LL.lvl)+' Empieza la conversación con un saludo breve y UNA pregunta relacionada con la situación. Responde SOLO JSON: {"msg":"tu mensaje"}');
   LL.convo.history.push({role:"model",text:obj.msg||LANG_PHRASES[LL.id].greet});
  }catch(e){LL.convo.mode="fallback";}
 }
 if(LL.convo.mode==="fallback"){
  LL.convo.script=buildFallbackConvoScript(LL.id,LL.situation);
  LL.convo.history.push({role:"model",text:LL.convo.script[0].npc});
 }
 renderLangConvo();}
function renderLangConvo(){setTheme("adulto");
 const msgs=LL.convo.history.map(h=>'<div class="langmsg '+(h.role==="model"?"npc":"me")+'">'+esc(h.text)+'</div>').join("");
 render(topbar(null)
  +'<h2 style="text-align:center">💬 Conversación · '+LANG_SITUATION_LABEL[LL.situation]+'</h2>'
  +'<div class="langchat">'+msgs+'</div>'
  +(LL.convo.mode==="fallback"?renderFallbackConvoOptions():renderLangConvoInput())
  +'<button class="abtn ghost" style="margin-top:10px" onclick="finishLangConvo()">Terminar conversación → Quiz</button>');}
function renderLangConvoInput(){
 return '<div style="display:flex;gap:8px;margin-top:10px">'
  +'<input type="text" id="langMsgInput" placeholder="Escribe tu respuesta..." style="flex:1">'
  +(typeof micAvailable==="function"&&micAvailable()?'<button class="abtn" style="width:auto" onclick="langMicInput()">🎤</button>':'')
  +'<button class="abtn" style="width:auto" onclick="sendLangMsg()">Enviar</button></div>';}
function renderFallbackConvoOptions(){
 const step=LL.convo.script[LL.convo.fallbackIdx];
 if(!step||!step.opts||!step.opts.length)return '<p class="mut center" style="margin-top:10px">Fin del diálogo.</p>';
 return step.opts.map((o,i)=>'<button class="abtn" onclick="pickFallbackConvo('+i+')">'+esc(o.text)+'</button>').join("");}
function langMicInput(){
 if(!micAvailable())return toast("🎤 No disponible en este navegador",false,1500);
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const rec=new SR();rec.lang=langInfo(LL.id).bcp;rec.maxAlternatives=1;rec.interimResults=false;rec.continuous=false;
 const inp=document.getElementById("langMsgInput");if(inp)inp.value="🎤 Escuchando…";
 rec.onresult=function(e){const t=e.results[0][0].transcript;if(inp)inp.value=t;};
 rec.onerror=function(){if(inp)inp.value="";};
 try{rec.start();}catch(e){}}
async function sendLangMsg(){
 const inp=document.getElementById("langMsgInput");const text=(inp&&inp.value||"").trim();
 if(!text||text==="🎤 Escuchando…")return;
 LL.convo.history.push({role:"user",text});
 const box=document.querySelector(".langchat");if(box)box.innerHTML+='<div class="langmsg me">'+esc(text)+'</div><div class="langmsg npc">⏳…</div>';
 if(inp)inp.value="";
 try{
  const hist=LL.convo.history.map(h=>(h.role==="model"?"Tú (nativo): ":"Estudiante: ")+h.text).join("\n");
  const obj=await geminiJSON('Continúas como hablante nativo de '+langInfo(LL.id).name+' en una conversación de "'+LANG_SITUATION_LABEL[LL.situation]+'" con un estudiante nivel '+CEFR_LEVELS[LL.lvl]+'. '+langMixInstruction(LL.lvl)+' Si el estudiante cometió un error, corrígelo con cariño en UNA frase corta en español antes de responder. Historial:\n'+hist+'\nResponde con tu siguiente mensaje (incluye una pregunta si tiene sentido). Responde SOLO JSON: {"msg":"..."}');
  LL.convo.history.push({role:"model",text:obj.msg||"..."});
 }catch(e){LL.convo.history.push({role:"model",text:"(sin conexión, sigamos) "+LANG_PHRASES[LL.id].canYouRepeat});}
 renderLangConvo();}
function pickFallbackConvo(i){
 const step=LL.convo.script[LL.convo.fallbackIdx];if(!step)return;
 const opt=step.opts[i];if(!opt)return;
 LL.convo.history.push({role:"user",text:opt.text});
 LL.convo.fallbackIdx++;
 const next=LL.convo.script[LL.convo.fallbackIdx];
 if(next)LL.convo.history.push({role:"model",text:next.npc});
 renderLangConvo();}
function finishLangConvo(){startLangQuiz();}

/* ---- mini quiz (5 preguntas, 80% para avanzar) ---- */
async function buildLangQuiz(id,lvl,vocab,grammar){
 const topicKey="lang_"+id+"_"+lvl;
 if(S.geminiKey){
  try{
   const seen=aiSeenList(topicKey);const avoid=seen.slice(-15);
   const noRep=avoid.length?(' No repitas ni parafrasees: '+avoid.map(q=>'"'+q+'"').join("; ")+'.'):'';
   const vocabTxt=vocab.map(v=>v[0]+" = "+v[1]).join(", ");
   const obj=await geminiJSON('Eres profesor de '+langInfo(id).name+' para un adulto hispanohablante nivel '+CEFR_LEVELS[lvl]+'. Crea 5 preguntas de opción múltiple (3 opciones, 1 correcta) para practicar este vocabulario: '+vocabTxt+'; y esta regla gramatical: "'+grammar.rule+'" ('+grammar.explicacion+').'+noRep+' Responde SOLO JSON: {"items":[{"q":"...","ops":["correcta","mala","mala"],"a":0,"why":"explicación breve en español de por qué es correcta, útil si el estudiante se equivoca"}]} con 5 items.');
   if(obj.items&&obj.items.length){
    const items=obj.items.map(it=>{const q=stripHTML(it.q);const ops=(it.ops||[]).map(o=>stripHTML(o));const correct=ops[it.a];const sh=shuffled(ops);return{q,ops:sh,a:sh.indexOf(correct),why:stripHTML(it.why||"")};});
    aiRemember(topicKey,items.map(i=>i.q));
    return items;}
  }catch(e){}
 }
 const items=[];
 for(let i=0;i<5;i++){
  const w=vocab[i%vocab.length];
  const distractors=pickN(vocab.filter(v=>v!==w).map(v=>v[1]),2);
  const ops=shuffled([w[1],...distractors]);
  items.push({q:'¿Qué significa "'+w[0]+'"?',ops,a:ops.indexOf(w[1]),why:'"'+w[0]+'" significa "'+w[1]+'". '+(w[3]||"")});}
 return items;}
async function startLangQuiz(){setTheme("adulto");
 render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando el quiz…</h2></div>');
 LL.quiz=await buildLangQuiz(LL.id,LL.lvl,LL.vocab,LL.grammar);
 LL.quizK=0;LL.quizOk=0;LL.quizErrors=[];
 nextLangQuiz();}
function nextLangQuiz(){
 const it=LL.quiz[LL.quizK];
 if(!it)return screenLangQuizResult();
 LL.quizLock=false;
 render(topbar(null)
  +'<div class="progressdots">'+dots(LL.quiz.length,LL.quizK)+'</div>'
  +'<h2 style="text-align:center">📝 Mini quiz '+(LL.quizK+1)+'/'+LL.quiz.length+'</h2>'
  +'<div class="bigq center">'+esc(it.q)+'</div>'
  +it.ops.map((o,i)=>'<button class="abtn" onclick="ansLangQuiz('+i+')">'+esc(o)+'</button>').join(""));}
function ansLangQuiz(i){
 if(LL.quizLock)return;LL.quizLock=true;
 const it=LL.quiz[LL.quizK];const ok=i===it.a;
 recordAnswer(langInfo(LL.id).name,ok,12);
 if(ok){LL.quizOk++;sOK();confetti(6);}
 else{sNO();LL.quizErrors.push({q:it.q,tuResp:it.ops[i],correcta:it.ops[it.a],why:it.why||""});}
 LL.quizK++;setTimeout(nextLangQuiz,900);}
function screenLangQuizResult(){setTheme("adulto");
 const pct=Math.round(LL.quizOk/LL.quiz.length*100);const passed=pct>=80;
 const errHtml=LL.quizErrors.length?'<div class="card"><h3>Repasemos tus errores</h3>'
  +LL.quizErrors.map(e=>'<p style="margin-top:10px;line-height:1.5"><b>'+esc(e.q)+'</b><br>❌ Dijiste: '+esc(e.tuResp)+' — ✅ Era: '+esc(e.correcta)+(e.why?'<br><span class="mut">'+esc(e.why)+'</span>':'')+'</p>').join("")+'</div>':'';
 render(topbar(null)
  +'<h2 style="text-align:center">'+(passed?"🎉 ¡Aprobaste!":"💪 Casi")+' — '+pct+'%</h2>'
  +'<p class="mut center">Necesitas 80% para avanzar a la siguiente lección.</p>'
  +errHtml
  +'<button class="abtn green" onclick="finishLangLesson('+passed+')">'+(passed?"Continuar al cierre →":"Ver el cierre (repites esta lección)")+'</button>');}

/* ---- cierre ---- */
function finishLangLesson(passed){
 const st=langState(LL.id);
 st.history.push({situation:LL.situation,vocab:LL.vocab,grammar:LL.grammar});
 if(st.history.length>5)st.history.shift();
 let advancedLevel=false;
 if(passed){
  st.lesson++;
  if(st.lesson>=LANG_SITUATIONS.length){
   st.passed[st.lvl]=true;
   if(st.lvl+1<CEFR_LEVELS.length){st.lvl++;advancedLevel=true;}
   st.lesson=0;
  }
  st.totalDone=(st.totalDone||0)+1;
  prof().coins+=15;prof().xp+=20;
 }
 save();
 screenLangClosing(passed,advancedLevel);}
function screenLangClosing(passed,advancedLevel){setTheme("adulto");
 const st=langState(LL.id);
 const nextSituation=LANG_SITUATION_LABEL[LANG_SITUATIONS[st.lesson%LANG_SITUATIONS.length]];
 const resumen="Hoy practicaste "+LANG_SITUATION_LABEL[LL.situation]+" en "+langInfo(LL.id).name+": "+LL.vocab.length+" palabras nuevas y la regla \""+LL.grammar.rule+"\".";
 const tarea="Tarea de 5 minutos: usa 3 de las palabras de hoy en una frase propia, en voz alta.";
 render(topbar("screenLangHub()")
  +'<div class="card center">'
  +'<div style="font-size:3rem">'+(passed?"🎉":"📚")+'</div>'
  +(advancedLevel?'<h2>¡Subiste a nivel '+CEFR_LEVELS[st.lvl]+'! 🔓</h2>':'')
  +'<p style="line-height:1.6;margin-top:10px">'+esc(resumen)+'</p>'
  +'<p style="line-height:1.6;margin-top:10px">'+esc(tarea)+'</p>'
  +'<p style="margin-top:14px;font-weight:700">'+(passed?('✅ Lección '+(st.totalDone||0)+' completada — Tema de mañana: '+nextSituation):'Repite esta lección cuando quieras — ¡tú puedes! 💪')+'</p>'
  +'</div>'
  +'<button class="abtn" onclick="startLangComic()">🎨 Ver historieta de esta lección</button>'
  +'<button class="abtn" onclick="startMemoryFromLesson()">🧠 Jugar memoria con este vocabulario</button>'
  +'<button class="abtn ghost" onclick="screenLangLevels(\''+LL.id+'\')">Volver a niveles</button>');}
function startMemoryFromLesson(){
 if(typeof startMemoryGame!=="function")return toast("Juego de memoria no disponible",false,1200);
 startMemoryGame(LL.vocab.map(w=>[w[0],w[1]]),{back:"screenLangHub()"});}
function startLangComic(){
 if(typeof screenLangComic!=="function")return toast("Historietas no disponibles",false,1200);
 screenLangComic(LL.id,LL.lvl,LL.situation,LL.vocab);}
