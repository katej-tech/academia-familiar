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
  +'<button class="abtn ghost" onclick="screenLangBook(\''+id+'\')">📖 Ver como libro</button>'
  +roadmapHTML(nodes));}

/* ---- vista de libro: índice navegable para hojear lo ya aprendido, de solo lectura ---- */
function bookLessonDone(st,lvl,i){
 if(lvl<st.lvl)return true;
 if(lvl>st.lvl)return false;
 if(st.passed[lvl])return true;
 return i<st.lesson;}
function screenLangBook(id){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 let html="";
 CEFR_LEVELS.forEach(function(lvlName,lvl){
  html+='<p class="mut" style="margin:14px 4px 4px;font-weight:700;text-transform:uppercase;font-size:.78rem">Nivel '+lvlName+(st.passed[lvl]?' ✓':'')+'</p>';
  LANG_SITUATIONS.forEach(function(sit,i){
   const done=bookLessonDone(st,lvl,i);
   const label=LANG_SITUATION_LABEL[sit];
   if(done)html+='<button class="abtn" style="text-align:left" onclick="screenLangBookLesson(\''+id+'\','+lvl+','+i+')">'+label+' <span class="mut" style="float:right">✅</span></button>';
   else html+='<button class="abtn locked" style="text-align:left;opacity:.5" onclick="toast(\'Todavía no llegas a esta lección 🔒\',false,1500)">'+label+' <span class="mut" style="float:right">🔒</span></button>';
  });});
 render(topbar("screenLangLevels('"+id+"')")
  +'<h2 style="text-align:center">📖 '+info.flag+' '+info.name+' — Libro del curso</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Hojea lo que ya aprendiste</p>'
  +html);}
function screenLangBookLesson(id,lvl,i){setTheme("adulto");
 const situation=LANG_SITUATIONS[i];
 const vocab=LANG_VOCAB_SEED[id][situation];
 const variants=LANG_GRAMMAR_SEED[id][lvl];
 const grammar=variants[i%variants.length];
 render(topbar("screenLangBook('"+id+"')")
  +'<h2 style="text-align:center">'+LANG_SITUATION_LABEL[situation]+'</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Nivel '+CEFR_LEVELS[lvl]+' · repaso de lo aprendido</p>'
  +vocab.map(function(w){
   return '<div class="card langword"><b style="font-size:1.05rem">'+esc(w[0])+'</b> '
    +'<button class="spk" onclick="speakLang(\''+id+'\','+jsStr(w[0])+')">🔊</button>'
    +'<br><span class="mut">'+esc(w[1])+'</span>'
    +'<p style="font-size:.85rem;margin-top:4px"><i>"'+esc(w[2])+'"</i> → '+esc(w[4]||"")+'</p></div>';}).join("")
  +'<div class="card"><h3>'+esc(grammar.rule)+'</h3><p style="margin-top:6px;line-height:1.5">'+esc(grammar.explicacion)+'</p>'
  +(grammar.ejemplo?'<p style="margin-top:8px"><b>Ejemplo:</b> '+esc(grammar.ejemplo.t)+' → '+esc(grammar.ejemplo.es)+'</p>':'')+'</div>'
  +'<button class="abtn ghost" onclick="screenLangBook(\''+id+'\')">← Volver al índice</button>');}

function screenLangLevelDetail(id,lvl){setTheme("adulto");
 const info=langInfo(id),st=langState(id);
 const pastLevel=lvl<st.lvl; // nivel ya superado: sus lecciones quedan todas marcadas como hechas
 const levelPassed=pastLevel||st.passed[lvl];
 const nodes=LANG_SITUATIONS.map((sit,i)=>{
  const label=LANG_SITUATION_LABEL[sit],parts=label.split(" ");
  const done=levelPassed||i<st.lesson;
  const isCurrent=!levelPassed&&i===st.lesson;
  const locked=!levelPassed&&i>st.lesson;
  let onclick;
  if(locked)onclick="toast('Completa la lección anterior primero 🔒',false,1600)";
  else if(done)onclick="toast('✓ Ya completaste esta lección',true,1200)";
  else onclick="startLangLesson('"+id+"',"+lvl+")";
  return{ic:parts[0],nm:parts.slice(1).join(" "),state:done?"done":locked?"locked":"open",current:isCurrent,onclick:onclick};});
 const examReady=!levelPassed&&st.lesson>=LANG_SITUATIONS.length;
 if(levelPassed)nodes.push({ic:"🏆",nm:"Examen final",state:"done",current:false,onclick:"toast('✓ Ya aprobaste el examen de este nivel',true,1200)"});
 else if(examReady)nodes.push({ic:"🏆",nm:"Examen final",state:"open",current:true,onclick:"startLangLevelExam('"+id+"',"+lvl+")"});
 else nodes.push({ic:"🏆",nm:"Examen final",state:"locked",current:false,onclick:"toast('Completa las "+LANG_SITUATIONS.length+" lecciones primero 🔒',false,1600)"});
 const curSituation=LANG_SITUATIONS[Math.min(st.lesson,LANG_SITUATIONS.length-1)];
 render(topbar("screenLangLevels('"+id+"')")
  +'<h2 style="text-align:center">'+info.flag+' Nivel '+CEFR_LEVELS[lvl]+'</h2>'
  +roadmapHTML(nodes)
  +'<button class="abtn" onclick="screenLangVideos(\''+id+'\','+lvl+')">🎬 Videos y comprensión</button>'
  +'<button class="abtn" onclick="screenLangListening(\''+id+'\','+lvl+')">🎧 Listening estilo Cambridge</button>'
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
 const grammarVariants=LANG_GRAMMAR_SEED[id][lvl];
 const grammar=grammarVariants[st.lesson%grammarVariants.length];
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
  +'<p class="mut center" style="margin-bottom:10px">Vocabulario de hoy — 🔊 escuchar · ⭐ guardar en tu baúl si no la conoces</p>'
  +LL.vocab.map(w=>
   '<div class="card langword">'
   +'<div style="display:flex;align-items:center;gap:8px">'
   +'<b style="font-size:1.1rem;flex:1">'+esc(w[0])+'</b>'
   +'<button class="spk" onclick="speakLang(\''+LL.id+'\','+jsStr(w[0])+')">🔊</button>'
   +'<button class="spk" id="vaultbtn_'+esc(w[0]).replace(/[^a-zA-Z0-9]/g,"")+'" onclick="toggleWordVault(\''+LL.id+'\','+jsStr(w[0])+','+jsStr(w[1])+',this)">'+(isInVault(LL.id,w[0])?"⭐":"☆")+'</button>'
   +'</div>'
   +'<span class="mut">'+esc(w[1])+'</span>'
   +'<p style="font-size:.88rem;margin-top:6px"><i>"'+esc(w[2])+'"</i></p>'
   +'<p style="font-size:.82rem;margin-top:2px;color:var(--adult-mut)">→ '+esc(w[4]||"")+'</p>'
   +'<p style="font-size:.82rem;margin-top:4px">💡 '+esc(w[3])+'</p></div>'
  ).join("")
  +'<button class="abtn ghost" onclick="screenWordVault()">🗃️ Ver mi baúl de palabras</button>'
  +'<button class="abtn green" onclick="screenLangGrammar()">Siguiente →</button>');}

/* ---- baúl de palabras: marcar/guardar palabras que no conoces para repasarlas ---- */
function wordVaultList(){const p=prof();if(!p.wordVault)p.wordVault=[];return p.wordVault;}
function isInVault(id,word){return wordVaultList().some(v=>v.lang===id&&v.word===word);}
function toggleWordVault(id,word,es,btn){
 const list=wordVaultList();
 const idx=list.findIndex(v=>v.lang===id&&v.word===word);
 if(idx>=0){list.splice(idx,1);if(btn)btn.textContent="☆";}
 else{list.unshift({lang:id,word:word,es:es,ts:Date.now()});if(btn)btn.textContent="⭐";toast("Guardado en tu baúl 🗃️",true,1000);}
 save();}
function screenWordVault(){setTheme("adulto");
 const list=wordVaultList();
 render(topbar("screenAdultHome()")
  +'<h2 style="text-align:center">🗃️ Baúl de palabras</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Palabras que marcaste para repasar</p>'
  +(list.length?list.map((v,i)=>'<div class="card" style="display:flex;align-items:center;gap:10px">'
    +'<button class="spk" onclick="speakLang(\''+v.lang+'\','+jsStr(v.word)+')">🔊</button>'
    +'<span style="flex:1"><b>'+esc(v.word)+'</b> <span class="mut">— '+esc(v.es)+'</span> <span class="mut" style="font-size:.75rem">('+langInfo(v.lang).flag+')</span></span>'
    +'<button class="spk" onclick="removeFromVault('+i+')">🗑️</button></div>').join("")
   :'<p class="mut center">Aún no has guardado palabras. Marca las que no conozcas con ⭐ en el vocabulario de cada lección.</p>')
  +(list.length?'<button class="abtn" onclick="startMemoryFromVault()">🧠 Practicar emparejando</button>':''));}
function removeFromVault(i){const list=wordVaultList();list.splice(i,1);save();screenWordVault();}
function startMemoryFromVault(){
 const list=wordVaultList();
 if(!list.length)return;
 startMemoryGame(list.map(v=>[v.word,v.es]),{back:"screenWordVault()"});}

function pronCard(id){
 const items=LANG_PRONUNCIATION[id]||[];
 if(!items.length)return "";
 return '<div class="card"><h3>🗣️ Pronunciación</h3>'
  +items.map(p=>'<p style="margin-top:6px;line-height:1.4"><b>'+esc(p.sonido)+':</b> '+esc(p.compara)+'</p>').join("")+'</div>';}

function screenLangGrammar(){setTheme("adulto");
 const g=LL.grammar;
 render(topbar(null)
  +'<h2 style="text-align:center">📐 Teoría de hoy</h2>'
  +'<div class="card"><h3>'+esc(g.rule)+'</h3>'
  +'<p style="margin-top:8px;line-height:1.6">'+esc(g.explicacion)+'</p>'
  +'<p style="margin-top:10px;line-height:1.6"><b>🇪🇸 vs. español:</b> '+esc(g.compara)+'</p>'
  +(g.ejemplo?'<div style="margin-top:12px;padding:10px;border-left:3px solid var(--adult-accent)"><b>Ejemplo:</b> '
    +'<button class="spk" style="margin-left:4px" onclick="speakLang(\''+LL.id+'\','+jsStr(g.ejemplo.t)+')">🔊</button>'
    +'<br>'+esc(g.ejemplo.t)+'<br><span class="mut">→ '+esc(g.ejemplo.es)+'</span></div>':'')
  +'</div>'
  +pronCard(LL.id)
  +'<button class="abtn green" onclick="screenLangWorksheet()">Ir a la hoja de ejercicios →</button>');}

/* ---- hoja de ejercicios: completar el espacio en blanco, respuesta escrita (no opción múltiple) ----
   Práctica intermedia entre la teoría y la conversación libre, como un cuaderno de ejercicios real.
   No bloquea el avance (igual que Videos y comprensión) — siempre se puede continuar. */
async function buildWorksheet(id,lvl,vocab,grammar){
 /* con clave, la IA genera la hoja COMPLETA (varía cada vez, más rica) — el banco curado
    de abajo solo entra si no hay clave o si la IA falla, para que nunca se quede sin hoja. */
 if(S.geminiKey){
  try{
   const vocabTxt=vocab.map(function(v){return v[0]+" = "+v[1];}).join(", ");
   const obj=await geminiJSON('Eres profesor de '+langInfo(id).name+' nivel '+CEFR_LEVELS[lvl]+' para un adulto hispanohablante. Crea 5 ejercicios de completar el espacio en blanco (una frase en '+langInfo(id).name+' con "____" donde falta UNA palabra) que practiquen este vocabulario: '+vocabTxt+'; y esta regla gramatical: "'+grammar.rule+'" ('+grammar.explicacion+'). Varía qué palabra falta en cada frase. Responde SOLO JSON: {"items":[{"prompt":"frase con ____","answer":"palabra que falta","hint":"pista corta en español"}]} con 5 items.');
   if(obj.items&&obj.items.length>=3){
    const items=obj.items.filter(function(it){return it.prompt&&it.answer;}).map(function(it){return{prompt:stripHTML(it.prompt),answer:stripHTML(it.answer),hint:stripHTML(it.hint||"")};});
    return shuffled(items);
   }
  }catch(e){}
 }
 const items=[];
 shuffled(vocab).slice(0,3).forEach(function(w){
  const re=new RegExp(w[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");
  if(re.test(w[2]))items.push({prompt:w[2].replace(re,"____"),answer:w[0],hint:w[1]});
  else items.push({prompt:'¿Cómo se dice "'+w[1]+'"?',answer:w[0],hint:w[2]});
 });
 if(grammar.ejemplo){
  const words=grammar.ejemplo.t.replace(/[.!?¿¡"]/g,"").trim().split(/\s+/);
  if(words.length>=2){
   const idx=words.length>3?Math.floor(words.length/2):words.length-1;
   const answer=words[idx];const blanked=words.slice();blanked[idx]="____";
   items.push({prompt:blanked.join(" "),answer:answer,hint:grammar.ejemplo.es});
  }
 }
 return shuffled(items);}
function screenLangWorksheet(){setTheme("adulto");
 render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando tu hoja de ejercicios…</h2></div>');
 buildWorksheet(LL.id,LL.lvl,LL.vocab,LL.grammar).then(function(items){LL.worksheet=items;renderLangWorksheet();});}
function renderLangWorksheet(){setTheme("adulto");
 render(topbar(null)
  +'<h2 style="text-align:center">✍️ Hoja de ejercicios</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Completa el espacio en blanco. Es práctica — no afecta tu avance.</p>'
  +LL.worksheet.map(function(it,i){
   return '<div class="card"><p style="line-height:1.5">'+esc(it.prompt)+'</p>'
    +'<input type="text" id="wsInput'+i+'" placeholder="Tu respuesta...">'
    +'<p class="mut" style="font-size:.8rem">💡 '+esc(it.hint)+'</p>'
    +'<div id="wsResult'+i+'"></div></div>';
  }).join("")
  +'<button class="abtn green" onclick="checkWorksheet()">Corregir</button>'
  +'<button class="abtn ghost" onclick="startLangConvo()">Continuar a la conversación →</button>');}
function checkWorksheet(){
 let ok=0;
 LL.worksheet.forEach(function(it,i){
  const inp=document.getElementById("wsInput"+i);
  const said=(inp&&inp.value||"").trim();
  const tol=it.answer.length<=6?1:it.answer.length<=12?2:3;
  const correct=said.length>0&&typeof lev==="function"&&lev(said.toLowerCase(),it.answer.toLowerCase())<=tol;
  if(correct)ok++;
  const box=document.getElementById("wsResult"+i);
  if(box)box.innerHTML=correct?'<p style="color:#16A34A;font-weight:700;margin-top:4px">✅ ¡Correcto!</p>':'<p style="color:#DC2626;font-weight:700;margin-top:4px">❌ Era: '+esc(it.answer)+'</p>';});
 recordAnswer(langInfo(LL.id).name+" hoja",ok>=LL.worksheet.length*0.6,20);
 if(ok===LL.worksheet.length){sWIN();confetti(20);}else sOK();
 toast(ok+"/"+LL.worksheet.length+" correctas",true,1800);}

/* ---- conversación: IA libre si hay clave, diálogo fijo si no ----
   Diseño "academia profesional": el mensaje del nativo va SIEMPRE 100% en el idioma meta
   (nunca mezclado con español a mitad de frase — eso se sentía raro); la traducción se
   muestra aparte, bajo demanda ("Ver traducción"). El prompt se acota al vocabulario ya
   visto en la lección (+ conectores básicos) para que la IA no pregunte cosas que el
   estudiante todavía no aprendió. Cada burbuja del nativo se puede guardar al baúl. */
function buildFallbackConvoScript(id,situation){
 const ph=LANG_PHRASES[id],pes=LANG_PHRASES_ES,vocab=LANG_VOCAB_SEED[id][situation];
 const w0=vocab[0],w1=pick(vocab);
 return [
  {npc:ph.greet+" "+ph.howAreYou,es:pes.greet+" "+pes.howAreYou,opts:[{text:ph.imFine,es:pes.imFine},{text:ph.dontUnderstand,es:pes.dontUnderstand}]},
  {npc:ph.whatsYourName,es:pes.whatsYourName,opts:[{text:ph.myNameIs+" Kate.",es:pes.myNameIs+" Kate."}]},
  {npc:w0[0]+"?",es:w0[1]+"?",opts:[{text:ph.yes,es:pes.yes},{text:ph.no,es:pes.no}]},
  {npc:w1[0]+" — "+ph.canYouRepeat+"?",es:w1[1]+" — "+pes.canYouRepeat+"?",opts:[{text:ph.thanks,es:pes.thanks},{text:ph.canYouRepeat,es:pes.canYouRepeat}]},
  {npc:ph.goodbye,es:pes.goodbye,opts:[]}
 ];}
function convoVocabPool(){return LL.vocab.map(v=>v[0]+" ("+v[1]+")").join(", ");}
async function startLangConvo(){setTheme("adulto");
 LL.convo={history:[],mode:S.geminiKey?"ai":"fallback",fallbackIdx:0,revealed:{}};
 if(LL.convo.mode==="ai"){
  render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando la conversación…</h2></div>');
  try{
   const obj=await geminiJSON('Eres un hablante nativo de '+langInfo(LL.id).name+' en una situación de "'+LANG_SITUATION_LABEL[LL.situation]+'" con un estudiante hispanohablante de nivel '+CEFR_LEVELS[LL.lvl]+'. Escribe tu mensaje SOLO en '+langInfo(LL.id).name+', nunca mezcles español dentro del mismo mensaje. Usa SOLO este vocabulario que el estudiante ya conoce: '+convoVocabPool()+', más palabras universales muy básicas (hola, sí, no, gracias) — NO introduzcas vocabulario nuevo fuera de esta lista. Empieza con un saludo breve y UNA pregunta simple relacionada con la situación. Responde SOLO JSON: {"msg":"tu mensaje en '+langInfo(LL.id).name+'","es":"su traducción al español"}');
   LL.convo.history.push({role:"model",text:obj.msg||LANG_PHRASES[LL.id].greet,es:obj.es||LANG_PHRASES_ES.greet});
  }catch(e){LL.convo.mode="fallback";}
 }
 if(LL.convo.mode==="fallback"){
  LL.convo.script=buildFallbackConvoScript(LL.id,LL.situation);
  LL.convo.history.push({role:"model",text:LL.convo.script[0].npc,es:LL.convo.script[0].es});
 }
 renderLangConvo();}
function renderLangConvo(){setTheme("adulto");
 if(!LL.convo.revealed)LL.convo.revealed={};
 const msgs=LL.convo.history.map((h,i)=>{
  if(h.role!=="model")return '<div class="langmsg me">'+esc(h.text)+'</div>';
  const shown=LL.convo.revealed[i];
  return '<div class="langmsg npc">'+mdBold(h.text)
   +(h.es?'<br><span class="mut" style="font-size:.8rem;cursor:pointer" onclick="toggleTranslation('+i+')">'+(shown?"👁️ "+esc(h.es):"👁️ Ver traducción")+'</span>':'')
   +' <button class="spk" style="margin-left:6px;transform:scale(.8)" onclick="saveConvoToVault('+i+')">⭐</button>'
   +'</div>';
 }).join("");
 render(topbar(null)
  +'<h2 style="text-align:center">💬 Conversación · '+LANG_SITUATION_LABEL[LL.situation]+'</h2>'
  +'<p class="mut center" style="margin-bottom:6px;font-size:.82rem">👁️ ver traducción · ⭐ guardar en tu baúl</p>'
  +'<div class="langchat">'+msgs+'</div>'
  +(LL.convo.mode==="fallback"?renderFallbackConvoOptions():renderLangConvoInput())
  +'<button class="abtn ghost" style="margin-top:10px" onclick="finishLangConvo()">Terminar conversación → Quiz</button>');
 speakLastLangConvo();}
function toggleTranslation(i){
 if(!LL.convo.revealed)LL.convo.revealed={};
 LL.convo.revealed[i]=!LL.convo.revealed[i];
 renderLangConvo();}
function saveConvoToVault(i){
 const h=LL.convo.history[i];if(!h)return;
 toggleWordVault(LL.id,h.text,h.es||"(sin traducción)");}
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
  +'<button class="abtn" style="width:auto" onclick="sendLangMsg()">Enviar</button></div>'
  +(typeof micAvailable==="function"&&micAvailable()?'<p class="mut center" style="font-size:.78rem;margin-top:4px">🎤 toca y habla — se envía solo al reconocer tu voz</p>':'');}
function renderFallbackConvoOptions(){
 const step=LL.convo.script[LL.convo.fallbackIdx];
 if(!step||!step.opts||!step.opts.length)return '<p class="mut center" style="margin-top:10px">Fin del diálogo.</p>';
 return step.opts.map((o,i)=>'<button class="abtn" onclick="pickFallbackConvo('+i+')">'+esc(o.text)+(o.es?'<br><span class="mut" style="font-size:.78rem">'+esc(o.es)+'</span>':'')+'</button>').join("");}
function langMicInput(){
 if(!micAvailable())return toast("🎤 No disponible en este navegador",false,1500);
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const rec=new SR();rec.lang=langInfo(LL.id).bcp;rec.maxAlternatives=1;rec.interimResults=false;rec.continuous=false;
 const inp=document.getElementById("langMsgInput");if(inp)inp.value="🎤 Escuchando…";
 rec.onresult=function(e){const t=e.results[0][0].transcript;if(inp)inp.value=t;sendLangMsg();};
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
  const obj=await geminiJSON('Continúas como hablante nativo de '+langInfo(LL.id).name+' en una conversación de "'+LANG_SITUATION_LABEL[LL.situation]+'" con un estudiante nivel '+CEFR_LEVELS[LL.lvl]+'. Escribe tu mensaje SOLO en '+langInfo(LL.id).name+', nunca mezcles español dentro del mismo mensaje. Usa SOLO este vocabulario conocido: '+convoVocabPool()+', más palabras universales muy básicas — NO introduzcas vocabulario nuevo fuera de esta lista. Historial:\n'+hist+'\nResponde con tu siguiente mensaje (incluye una pregunta si tiene sentido). Si el estudiante cometió un error notable, indícalo en el campo "correccion" (en español, una frase corta) — deja "correccion" vacío si no hubo error. Responde SOLO JSON: {"msg":"tu mensaje en '+langInfo(LL.id).name+'","es":"su traducción al español","correccion":"..."}');
  LL.convo.history.push({role:"model",text:obj.msg||"...",es:obj.es||""});
  if(obj.correccion)toast("💡 "+obj.correccion,true,3200);
 }catch(e){LL.convo.history.push({role:"model",text:"(sin conexión, sigamos) "+LANG_PHRASES[LL.id].canYouRepeat,es:"(sin conexión, sigamos) "+LANG_PHRASES_ES.canYouRepeat});}
 renderLangConvo();}
function pickFallbackConvo(i){
 const step=LL.convo.script[LL.convo.fallbackIdx];if(!step)return;
 const opt=step.opts[i];if(!opt)return;
 LL.convo.history.push({role:"user",text:opt.text});
 LL.convo.fallbackIdx++;
 const next=LL.convo.script[LL.convo.fallbackIdx];
 if(next)LL.convo.history.push({role:"model",text:next.npc,es:next.es});
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

/* ---- examen final de nivel: el verdadero "sube de nivel", igual que en english-levels.js ----
   Junta vocabulario de las 10 situaciones del nivel completo (no solo la última lección) y
   reutiliza toda la maquinaria de preguntas/render del quiz normal vía el flag LL.isExam. */
async function buildLangExamQuiz(id,lvl){
 const allVocab=LANG_SITUATIONS.reduce(function(acc,sit){return acc.concat(LANG_VOCAB_SEED[id][sit]);},[]);
 const topicKey="lang_exam_"+id+"_"+lvl;
 let mcq=[];
 if(S.geminiKey){
  try{
   const seen=aiSeenList(topicKey);const avoid=seen.slice(-15);
   const noRep=avoid.length?(' No repitas ni parafrasees: '+avoid.map(function(q){return '"'+q+'"';}).join("; ")+'.'):'';
   const sample=shuffled(allVocab).slice(0,14).map(function(v){return v[0]+" = "+v[1];}).join(", ");
   const grammarSummary=LANG_GRAMMAR_SEED[id][lvl].map(function(g){return g.rule;}).join("; ");
   const obj=await geminiJSON('Eres examinador de '+langInfo(id).name+' nivel '+CEFR_LEVELS[lvl]+' para un adulto hispanohablante. Crea 6 preguntas de opción múltiple (3 opciones, 1 correcta) que evalúen este vocabulario del nivel completo: '+sample+'; y estas reglas gramaticales: '+grammarSummary+'.'+noRep+' Es un EXAMEN FINAL, un poco más exigente que la práctica normal. Responde SOLO JSON: {"items":[{"q":"...","ops":["correcta","mala","mala"],"a":0,"why":"explicación breve"}]} con 6 items.');
   if(obj.items&&obj.items.length){
    mcq=obj.items.map(function(it){const q=stripHTML(it.q);const ops=(it.ops||[]).map(function(o){return stripHTML(o);});const correct=ops[it.a];const sh=shuffled(ops);return{kind:"mcq",q:q,ops:sh,a:sh.indexOf(correct),why:stripHTML(it.why||"")};});
    aiRemember(topicKey,mcq.map(function(i){return i.q;}));
   }
  }catch(e){}
 }
 if(!mcq.length){
  const pool=shuffled(allVocab);
  for(let i=0;i<6;i++){
   const w=pool[i%pool.length];
   const distractors=pickN(allVocab.filter(function(v){return v!==w;}).map(function(v){return v[1];}),2);
   const ops=shuffled([w[1]].concat(distractors));
   mcq.push({kind:"mcq",q:'¿Qué significa "'+w[0]+'"?',ops:ops,a:ops.indexOf(w[1]),why:'"'+w[0]+'" significa "'+w[1]+'". '+(w[3]||"")});
  }
 }
 const extra=[buildOrderItem(allVocab),buildOrderItem(allVocab),buildListenItem(allVocab),buildListenItem(allVocab)].filter(Boolean);
 return shuffled(mcq.concat(extra));}
async function startLangLevelExam(id,lvl){setTheme("adulto");
 render(topbar("screenLangLevelDetail('"+id+"',"+lvl+")")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">🏆</div><h2 style="margin-top:10px">Preparando tu examen final…</h2></div>');
 LL={id:id,lvl:lvl,isExam:true,vocab:LANG_VOCAB_SEED[id][LANG_SITUATIONS[0]]};
 LL.quiz=await buildLangExamQuiz(id,lvl);
 LL.quizK=0;LL.quizOk=0;LL.quizErrors=[];
 nextLangQuiz();}
function screenLangExamResult(passed,pct,errHtml){
 const st=langState(LL.id);
 let newLvl=LL.lvl;
 if(passed){
  st.passed[LL.lvl]=true;
  if(LL.lvl+1<CEFR_LEVELS.length){st.lvl=LL.lvl+1;st.lesson=0;newLvl=st.lvl;}
  prof().coins+=40;prof().xp+=60;
  sWIN();confetti(40);
 }
 save();
 render(topbar("screenLangHub()")
  +'<h2 style="text-align:center">'+(passed?"🏆 ¡Aprobaste el examen!":"💪 Casi — sigue practicando")+' — '+pct+'%</h2>'
  +'<p class="mut center">Necesitas 80% para aprobar el examen final del nivel.</p>'
  +errHtml
  +(passed?('<div class="card center"><div style="font-size:2.4rem">🎉</div><h3>¡Subiste a nivel '+CEFR_LEVELS[newLvl]+'!</h3></div>'):'')
  +'<button class="abtn green" onclick="'+(passed?"screenLangLevels('"+LL.id+"')":"screenLangLevelDetail('"+LL.id+"',"+LL.lvl+")")+'">'+(passed?"Ver niveles →":"Volver a practicar")+'</button>');}
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
 if(LL.isExam)return screenLangExamResult(passed,pct,errHtml);
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
 if(passed){
  if(st.lesson<LANG_SITUATIONS.length)st.lesson++;
  st.totalDone=(st.totalDone||0)+1;
  prof().coins+=15;prof().xp+=20;
  touchDay().langDone=true;
 }
 save();
 screenLangClosing(passed);}
/* tarea de cierre variada — antes era un solo texto fijo siempre igual; ahora rota y
   menciona las palabras reales de la lección para que sea concreta, no genérica */
function buildTareaText(st){
 const words=LL.vocab.slice(0,3).map(w=>"'"+w[0]+"'").join(", ");
 const templates=[
  "Tarea de 5 minutos: escribe una frase propia usando "+words+".",
  "Tarea de 5 minutos: grábate diciendo en voz alta "+words+" y escúchate.",
  "Tarea de 5 minutos: enséñale a alguien de tu casa qué significan "+words+".",
  "Tarea de 5 minutos: usa una de estas palabras ("+words+") en un mensaje de texto hoy.",
  "Tarea de 5 minutos: cierra los ojos y repite "+words+" de memoria, sin mirar.",
  "Tarea de 5 minutos: describe tu día usando al menos una de estas palabras: "+words+"."
 ];
 return templates[(st.totalDone||0)%templates.length];}
function screenLangClosing(passed){setTheme("adulto");
 const st=langState(LL.id);
 const examUnlocked=st.lesson>=LANG_SITUATIONS.length;
 const nextSituation=examUnlocked?"🏆 ¡el examen final del nivel!":LANG_SITUATION_LABEL[LANG_SITUATIONS[st.lesson]];
 const resumen="Hoy practicaste "+LANG_SITUATION_LABEL[LL.situation]+" en "+langInfo(LL.id).name+": "+LL.vocab.length+" palabras nuevas y la regla \""+LL.grammar.rule+"\".";
 const tarea=buildTareaText(st);
 render(topbar("screenLangHub()")
  +'<div class="card center">'
  +'<div style="font-size:3rem">'+(passed?"🎉":"📚")+'</div>'
  +'<p style="line-height:1.6;margin-top:10px">'+esc(resumen)+'</p>'
  +'<p style="line-height:1.6;margin-top:10px">'+esc(tarea)+'</p>'
  +'<p style="margin-top:14px;font-weight:700">'+(passed?('✅ Lección '+(st.totalDone||0)+' completada — '+(examUnlocked?nextSituation:'Tema de mañana: '+nextSituation)):'Repite esta lección cuando quieras — ¡tú puedes! 💪')+'</p>'
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
