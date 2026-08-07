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

/* camino/roadmap visual reutilizable (mapa de niveles y mapa de lecciones dentro de un nivel).
   nodes: [{ic,nm,state:"done"|"open"|"locked",current:bool,onclick:"...js..."}] */
function roadmapHTML(nodes){
 return '<div class="map">'+nodes.map((n,i)=>{
  const cls=["node",i%2===0?"left":"right",n.state];
  if(n.current)cls.push("current");
  return '<div class="'+cls.join(" ")+'" onclick="'+n.onclick+'">'
   +'<span class="ic">'+(n.state==="locked"?"🔒":n.ic)+'</span>'
   +'<span class="nm">'+n.nm+'</span>'
   +(n.state==="done"?'<span class="stars">⭐</span>':'')+'</div>';
 }).join("")+'</div>';}

function screenLangLevels(id){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 const nodes=CEFR_LEVELS.map((nm,i)=>{
  const unlocked=i<=st.lvl,passed=st.passed[i];
  return{ic:passed?"✅":info.flag,nm:nm,state:passed?"done":unlocked?"open":"locked",
   current:unlocked&&!passed&&i===st.lvl,
   onclick:unlocked?"screenLangLevelDetail('"+id+"',"+i+")":"toast('Aprueba el nivel anterior primero 🔒',false,1600)"};});
 render(topbar("screenLangHub()")
  +'<h2 style="text-align:center">'+info.flag+' '+info.name+'</h2>'
  +'<p class="mut center" style="margin-bottom:6px">Completa las '+LANG_SITUATIONS.length+' lecciones de cada nivel (80% en el quiz) para subir</p>'
  +roadmapHTML(nodes));}

function screenLangLevelDetail(id,lvl){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 const pastLevel=lvl<st.lvl; // nivel ya superado: sus lecciones quedan todas marcadas como hechas
 const nodes=LANG_SITUATIONS.map((sit,i)=>{
  const label=LANG_SITUATION_LABEL[sit],parts=label.split(" ");
  const done=pastLevel||i<st.lesson;
  const isCurrent=!pastLevel&&i===st.lesson;
  const locked=!pastLevel&&i>st.lesson;
  let onclick;
  if(locked)onclick="toast('Completa la lección anterior primero 🔒',false,1600)";
  else if(done)onclick="toast('✓ Ya completaste esta lección',true,1200)";
  else onclick="startLangLesson('"+id+"',"+lvl+")";
  return{ic:parts[0],nm:parts.slice(1).join(" "),state:done?"done":locked?"locked":"open",current:isCurrent,onclick:onclick};});
 const curSituation=LANG_SITUATIONS[Math.min(st.lesson,LANG_SITUATIONS.length-1)];
 render(topbar("screenLangLevels('"+id+"')")
  +'<h2 style="text-align:center">'+info.flag+' Nivel '+CEFR_LEVELS[lvl]+'</h2>'
  +roadmapHTML(nodes)
  +'<button class="abtn" onclick="screenLangVideos(\''+id+'\','+lvl+')">🎬 Videos y comprensión</button>'
  +'<button class="abtn" onclick="startMemoryFromSituation(\''+id+'\',\''+curSituation+'\')">🔤 Practicar emparejando</button>');}
function startMemoryFromSituation(id,situation){
 const vocab=LANG_VOCAB_SEED[id]&&LANG_VOCAB_SEED[id][situation];
 if(!vocab)return;
 startMemoryGame(vocab.map(w=>[w[0],w[1]]),{back:"screenLangHub()"});}

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
   +'<button class="spk" onclick="speakLang(\''+LL.id+'\','+jsStr(w[0])+')">🔊</button>'
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
 const msgs=LL.convo.history.map(h=>'<div class="langmsg '+(h.role==="model"?"npc":"me")+'">'+mdBold(h.text)+'</div>').join("");
 render(topbar(null)
  +'<h2 style="text-align:center">💬 Conversación · '+LANG_SITUATION_LABEL[LL.situation]+'</h2>'
  +'<div class="langchat">'+msgs+'</div>'
  +(LL.convo.mode==="fallback"?renderFallbackConvoOptions():renderLangConvoInput())
  +'<button class="abtn ghost" style="margin-top:10px" onclick="finishLangConvo()">Terminar conversación → Quiz</button>');
 speakLastLangConvo();}
/* hace que se sienta como una conversación real: el "nativo" habla en voz alta cada mensaje nuevo */
function speakLastLangConvo(){
 const hist=LL.convo.history;const lastIdx=hist.length-1;
 if(lastIdx<0||hist[lastIdx].role!=="model")return;
 if(LL.convo.lastSpokenIdx===lastIdx)return;
 LL.convo.lastSpokenIdx=lastIdx;
 speakLang(LL.id,hist[lastIdx].text);}
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

/* ---- mini quiz (5 preguntas, 80% para avanzar): mezcla opción múltiple + ordenar + dictado ---- */
async function buildLangQuizMCQ(id,lvl,vocab,grammar){
 const topicKey="lang_"+id+"_"+lvl;
 if(S.geminiKey){
  try{
   const seen=aiSeenList(topicKey);const avoid=seen.slice(-15);
   const noRep=avoid.length?(' No repitas ni parafrasees: '+avoid.map(q=>'"'+q+'"').join("; ")+'.'):'';
   const vocabTxt=vocab.map(v=>v[0]+" = "+v[1]).join(", ");
   const obj=await geminiJSON('Eres profesor de '+langInfo(id).name+' para un adulto hispanohablante nivel '+CEFR_LEVELS[lvl]+'. Crea 3 preguntas de opción múltiple (3 opciones, 1 correcta) para practicar este vocabulario: '+vocabTxt+'; y esta regla gramatical: "'+grammar.rule+'" ('+grammar.explicacion+').'+noRep+' Responde SOLO JSON: {"items":[{"q":"...","ops":["correcta","mala","mala"],"a":0,"why":"explicación breve en español de por qué es correcta, útil si el estudiante se equivoca"}]} con 3 items.');
   if(obj.items&&obj.items.length){
    const items=obj.items.map(it=>{const q=stripHTML(it.q);const ops=(it.ops||[]).map(o=>stripHTML(o));const correct=ops[it.a];const sh=shuffled(ops);return{kind:"mcq",q,ops:sh,a:sh.indexOf(correct),why:stripHTML(it.why||"")};});
    aiRemember(topicKey,items.map(i=>i.q));
    return items;}
  }catch(e){}
 }
 const items=[];
 for(let i=0;i<3;i++){
  const w=vocab[i%vocab.length];
  const distractors=pickN(vocab.filter(v=>v!==w).map(v=>v[1]),2);
  const ops=shuffled([w[1],...distractors]);
  items.push({kind:"mcq",q:'¿Qué significa "'+w[0]+'"?',ops,a:ops.indexOf(w[1]),why:'"'+w[0]+'" significa "'+w[1]+'". '+(w[3]||"")});}
 return items;}
/* ejercicio de ordenar la frase: usa el ejemplo de uso que ya trae cada palabra del vocabulario */
function buildOrderItem(vocab){
 let w=null;
 for(let tries=0;tries<6;tries++){
  const cand=pick(vocab);
  const clean=cand[2].replace(/[.!?¿¡"]/g,"").trim();
  if(clean.split(/\s+/).length>=3){w=cand;break;}
 }
 if(!w)w=vocab[0];
 const words=w[2].replace(/[.!?¿¡"]/g,"").trim().split(/\s+/);
 return{kind:"order",words:shuffled(words),correct:words,es:w[1],full:w[2]};}
/* ejercicio de escucha y escribe (dictado): usa lev() de kid.js con tolerancia por longitud */
function buildListenItem(vocab){
 const w=pick(vocab);
 return{kind:"listen",target:w[0],es:w[1]};}
async function buildLangQuiz(id,lvl,vocab,grammar){
 const mcq=await buildLangQuizMCQ(id,lvl,vocab,grammar);
 const extra=[buildOrderItem(vocab),buildListenItem(vocab)].filter(Boolean);
 return shuffled([...mcq,...extra]);}
async function startLangQuiz(){setTheme("adulto");
 render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando el quiz…</h2></div>');
 LL.quiz=await buildLangQuiz(LL.id,LL.lvl,LL.vocab,LL.grammar);
 LL.quizK=0;LL.quizOk=0;LL.quizErrors=[];
 nextLangQuiz();}
function nextLangQuiz(){
 const it=LL.quiz[LL.quizK];
 if(!it)return screenLangQuizResult();
 LL.quizLock=false;
 if(it.kind==="order")return renderLangQuizOrder(it);
 if(it.kind==="listen")return renderLangQuizListen(it);
 render(topbar(null)
  +'<div class="progressdots">'+dots(LL.quiz.length,LL.quizK)+'</div>'
  +'<h2 style="text-align:center">📝 Mini quiz '+(LL.quizK+1)+'/'+LL.quiz.length+'</h2>'
  +'<div class="bigq center">'+mdBold(it.q)+' <button class="spk" onclick="speakLang(\''+LL.id+'\','+jsStr(it.q)+')">🔊</button></div>'
  +it.ops.map((o,i)=>'<div style="display:flex;gap:8px;align-items:center">'
   +'<button class="spk" onclick="speakLang(\''+LL.id+'\','+jsStr(o)+')">🔊</button>'
   +'<button class="abtn" style="flex:1" onclick="ansLangQuiz('+i+')">'+mdBold(o)+'</button></div>').join(""));}
function ansLangQuiz(i){
 if(LL.quizLock)return;LL.quizLock=true;
 const it=LL.quiz[LL.quizK];const ok=i===it.a;
 recordAnswer(langInfo(LL.id).name,ok,12);
 if(ok){LL.quizOk++;sOK();confetti(6);}
 else{sNO();LL.quizErrors.push({q:it.q,tuResp:it.ops[i],correcta:it.ops[it.a],why:it.why||""});}
 LL.quizK++;setTimeout(nextLangQuiz,900);}
/* --- ordenar la frase --- */
function renderLangQuizOrder(it){
 LL.orderPicked=[];
 render(topbar(null)
  +'<div class="progressdots">'+dots(LL.quiz.length,LL.quizK)+'</div>'
  +'<h2 style="text-align:center">🔀 Ordena la frase</h2>'
  +'<p class="mut center" style="margin-bottom:6px">'+esc(it.es)+'</p>'
  +'<button class="abtn ghost" style="display:block;margin:0 auto 10px;width:auto" onclick="speakLang(\''+LL.id+'\','+jsStr(it.full)+')">🔊 Escuchar frase completa</button>'
  +'<div class="wordslots" id="orderSlots"></div>'
  +'<div class="wordbank" id="orderBank">'+it.words.map((w,i)=>'<button class="wtile" id="wbtn'+i+'" onclick="pickOrderWord('+i+')">'+esc(w)+'</button>').join("")+'</div>'
  +'<button class="abtn green" onclick="checkOrderAnswer()">Comprobar</button>');}
function pickOrderWord(i){
 if(LL.orderPicked.includes(i))return;
 LL.orderPicked.push(i);
 const btn=document.getElementById("wbtn"+i);if(btn)btn.classList.add("used");
 renderOrderSlots();}
function unpickOrderWord(i){
 LL.orderPicked=LL.orderPicked.filter(x=>x!==i);
 const btn=document.getElementById("wbtn"+i);if(btn)btn.classList.remove("used");
 renderOrderSlots();}
function renderOrderSlots(){
 const it=LL.quiz[LL.quizK];
 const slots=document.getElementById("orderSlots");if(!slots)return;
 slots.innerHTML=LL.orderPicked.map(i=>'<button class="wtile" onclick="unpickOrderWord('+i+')">'+esc(it.words[i])+'</button>').join("");}
function checkOrderAnswer(){
 if(LL.quizLock)return;LL.quizLock=true;
 const it=LL.quiz[LL.quizK];
 const chosen=LL.orderPicked.map(i=>it.words[i]);
 const ok=chosen.length===it.correct.length&&chosen.every((w,i)=>w===it.correct[i]);
 recordAnswer(langInfo(LL.id).name,ok,15);
 if(ok){LL.quizOk++;sOK();confetti(6);}
 else{sNO();LL.quizErrors.push({q:"Ordenar: "+it.es,tuResp:chosen.join(" ")||"(nada)",correcta:it.correct.join(" "),why:""});}
 LL.quizK++;setTimeout(nextLangQuiz,900);}
/* --- escucha y escribe (dictado) --- */
function renderLangQuizListen(it){
 render(topbar(null)
  +'<div class="progressdots">'+dots(LL.quiz.length,LL.quizK)+'</div>'
  +'<h2 style="text-align:center">🎧 Escucha y escribe</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Toca para escuchar, luego escribe lo que oyes</p>'
  +'<button class="abtn" onclick="speakLang(\''+LL.id+'\','+jsStr(it.target)+')">🔊 Reproducir</button>'
  +'<input type="text" id="listenInput" placeholder="Escribe lo que escuchaste...">'
  +'<button class="abtn green" onclick="checkListenAnswer()">Comprobar</button>');
 speakLang(LL.id,it.target);}
function checkListenAnswer(){
 if(LL.quizLock)return;LL.quizLock=true;
 const it=LL.quiz[LL.quizK];
 const inp=document.getElementById("listenInput");
 const said=(inp&&inp.value||"").trim();
 const tol=it.target.length<=6?1:it.target.length<=12?2:3;
 const ok=said.length>0&&typeof lev==="function"&&lev(said.toLowerCase(),it.target.toLowerCase())<=tol;
 recordAnswer(langInfo(LL.id).name,ok,15);
 if(ok){LL.quizOk++;sOK();confetti(6);}
 else{sNO();LL.quizErrors.push({q:"Dictado ("+it.es+")",tuResp:said||"(nada)",correcta:it.target,why:""});}
 LL.quizK++;setTimeout(nextLangQuiz,900);}
function screenLangQuizResult(){setTheme("adulto");
 const pct=Math.round(LL.quizOk/LL.quiz.length*100);const passed=pct>=80;
 const errHtml=LL.quizErrors.length?'<div class="card"><h3>Repasemos tus errores</h3>'
  +LL.quizErrors.map(e=>'<p style="margin-top:10px;line-height:1.5"><b>'+mdBold(e.q)+'</b><br>❌ Dijiste: '+mdBold(e.tuResp)+' — ✅ Era: '+mdBold(e.correcta)+(e.why?'<br><span class="mut">'+mdBold(e.why)+'</span>':'')+'</p>').join("")+'</div>':'';
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
  touchDay().langDone=true;
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
