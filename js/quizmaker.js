"use strict";
/* ============ MIS QUIZZES (crea los tuyos, con IA o a mano) ============
   Pedido: "crear tus propios quizzes con IA". Papás o niño pegan los apuntes del colegio (o escriben un
   tema) y Gemini arma preguntas de opción múltiple; sin clave se puede crear a mano. Aprender haciendo
   preguntas también es aprender: «¡Sé el profe!».
   - Se guardan en prof().myQuizzes (la correcta va SIEMPRE primera y se mezcla al jugar).
   - Al jugar se anotan las falladas para un REPASO solo de esas preguntas.
   - Cada respuesta cuenta en el aprendizaje del día (recordAnswer).
   - Código para compartir/importar entre dispositivos (AFQ1:…).
   - Las puertas del Mundo de retos pueden usar tus quizzes (worldgame.js).
   Prefijo myq / MYQ (QZ ya existe en teen.js). */

const MYQ_WIN={noWorld:true,replay:"screenQuizzes()",replayLabel:"Más quizzes 📝",backFn:"screenKidMap()",backLabel:"Ir a los mundos 🌍"};
const MYQ_SUBJ=[["📚","Lenguaje"],["🔢","Matemáticas"],["🌎","Ciencias"],["🏛️","Sociales"],["🇬🇧","Inglés"],["✨","Otro"]];
let MYQ={timers:[]};

function myqList(){const p=prof();if(!p.myQuizzes)p.myQuizzes=[];return p.myQuizzes;}
function myqFind(id){return myqList().find(function(q){return q.id===id;});}
/* solo temporizadores y voz: el estado (form/draft/play) se conserva porque topbar() → stopGames() corre en CADA repintado */
function myqCleanup(){if(MYQ.timers)MYQ.timers.forEach(clearTimeout);MYQ.timers=[];try{window.speechSynthesis.cancel();}catch(e){}}
function myqLater(fn,ms){const t=setTimeout(fn,ms);MYQ.timers.push(t);return t;}
/* materia que se anota en las estadísticas: inglés cuenta como Inglés; el resto, con el nombre que ya entiende el panel de padres */
function myqStat(q){if(q.lang==="en")return"Inglés";return({"Matemáticas":"Mate","Ciencias":"La naturaleza","Lenguaje":"Comprensión"})[q.subj]||q.subj||"Mis quizzes";}
function myqSay(t,lang){if(lang==="en")speakEN(t);else speakES(t);}
function myqClean(s,n){return String(s==null?"":s).replace(/[<>]/g,"").trim().slice(0,n);}

/* ---------- lista ---------- */
function screenQuizzes(){setTheme("kid");
 myqCleanup();
 const l=myqList(),st=prof().myqBest||{};
 render(topbar("screenKidMap()")+subHeader("📝 Mis quizzes")
  +'<p class="center" style="margin:-4px 0 10px">¡Sé el profe! Crea preguntas sobre lo que estás aprendiendo y juega con ellas. 🇨🇴 Español o 🇬🇧 English.</p>'
  +(S.geminiKey?'<button class="kbtn purple" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="myqNewAI()"><span style="font-size:2.2rem">✨</span><span style="flex:1"><span>Crear con IA</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Pega tus apuntes o escribe un tema</span></span></button>'
   :'<div class="card" style="font-size:.88rem;background:#FEF9C3">✨ Con la clave de IA (papá o mamá) también se pueden crear quizzes pegando los apuntes del colegio.</div>')
  +'<button class="kbtn green" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="myqNewManual()"><span style="font-size:2.2rem">✍️</span><span style="flex:1"><span>Crear a mano</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Escribe tus preguntas y respuestas</span></span></button>'
  +'<button class="kbtn white" style="min-height:44px;font-size:.9rem" onclick="myqImportScreen()">📥 Importar con código</button>'
  +(l.length?'<p class="appsec" style="margin-top:12px">Mis quizzes ('+l.length+')</p>':'<div class="card center"><div style="font-size:2.6rem">📝</div><p style="margin:4px 0 0">Aún no tienes quizzes. ¡Crea el primero!</p></div>')
  +l.map(function(q){const b=st[q.id];return '<div class="card" style="padding:10px 12px;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:2rem">'+q.ic+'</span><div style="flex:1;line-height:1.3"><b>'+(q.lang==="en"?"🇬🇧 ":"")+esc(q.ti)+'</b><br><span class="mut" style="font-size:.8rem">'+esc(q.subj||"")+' · '+q.q.length+' preguntas'+(q.ai?" · ✨ IA":"")+(b?" · mejor: "+"⭐".repeat(b):"")+'</span></div></div>'
   +'<div style="display:flex;gap:6px;margin-top:8px"><button class="kbtn green" style="margin:0;min-height:44px;font-size:.9rem;flex:2" onclick="myqPlay(\''+q.id+'\')">▶ Jugar</button>'
   +((prof().myqMissed||{})[q.id]&&(prof().myqMissed[q.id].length)?'<button class="kbtn yellow" style="margin:0;min-height:44px;font-size:.85rem;flex:2" onclick="myqPlay(\''+q.id+'\',true)">🔁 Repasar ('+prof().myqMissed[q.id].length+')</button>':"")
   +'<button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem;flex:1" onclick="myqShare(\''+q.id+'\')" aria-label="Compartir">📤</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem;flex:1" onclick="myqDel(\''+q.id+'\')" aria-label="Borrar">🗑️</button></div></div>';}).join(""));}

/* ---------- crear con IA ---------- */
function myqNewAI(){setTheme("kid");
 myqCleanup();
 MYQ.form={n:6,lv:2,subj:1,lang:0};
 const chip=function(g,v,t,on){return '<button onclick="myqPick(\''+g+'\','+v+')" id="myq'+g+v+'" style="margin:3px;padding:8px 14px;border-radius:14px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';font-weight:700;cursor:pointer;color:#1E293B">'+t+'</button>';};
 render(topbar("screenQuizzes()")+subHeader("✨ Crear un quiz con IA")
  +'<div class="card"><b>1. Pega tus apuntes o escribe el tema</b><textarea id="myqText" rows="6" maxlength="2500" placeholder="Ej: El ciclo del agua: el agua se evapora, sube, forma nubes (condensación) y vuelve a caer como lluvia…" style="width:100%;padding:10px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-family:Nunito,sans-serif;font-size:1rem"></textarea><div class="mut" style="font-size:.78rem">Hasta 2.500 letras. Si solo escribes un tema («las fracciones»), la IA lo inventa.</div></div>'
  +'<div class="card"><b>2. Idioma / Language</b><div>'+[[0,"🇨🇴 Español"],[1,"🇬🇧 English"]].map(function(x){return chip("lang",x[0],x[1],x[0]===0);}).join("")+'</div><div class="mut" style="font-size:.78rem">En English las preguntas salen en inglés sencillo (aunque pegues los apuntes en español).</div><b style="display:block;margin-top:8px">Materia</b><div>'+MYQ_SUBJ.map(function(s,i){return chip("subj",i,s[0]+" "+s[1],i===1);}).join("")+'</div><b style="display:block;margin-top:8px">¿Cuántas preguntas?</b><div>'+[4,6,8,10].map(function(n){return chip("n",n,String(n),n===6);}).join("")+'</div><b style="display:block;margin-top:8px">Dificultad</b><div>'+[[1,"🌱 Fácil"],[2,"🌿 Medio"],[3,"🌳 Reto"]].map(function(x){return chip("lv",x[0],x[1],x[0]===2);}).join("")+'</div></div>'
  +'<button class="kbtn purple" onclick="myqGen()">✨ ¡Crear mi quiz!</button><div id="myqFb"></div>');}
function myqPick(g,v){
 MYQ.form[g]=v;
 const sets={subj:MYQ_SUBJ.map(function(_,i){return i;}),n:[4,6,8,10],lv:[1,2,3],lang:[0,1]};
 if(g==="lang"){MYQ.form.subj=v===1?4:1;myqPick("subj",MYQ.form.subj);}
 sets[g].forEach(function(x){const b=document.getElementById("myq"+g+x);if(b){const on=x===v;b.style.borderColor=on?"#7C3AED":"#E2E8F0";b.style.background=on?"#EDE9FE":"#fff";}});}
async function myqGen(){
 const raw=myqClean((document.getElementById("myqText")||{}).value,2500);
 if(raw.length<4){const t=document.getElementById("myqText");if(t){t.focus();t.style.borderColor="#EF4444";}return;}
 const F=MYQ.form||{n:6,lv:2,subj:1,lang:0},subj=MYQ_SUBJ[F.subj]||MYQ_SUBJ[5],lang=F.lang===1?"en":"es";
 const fb=document.getElementById("myqFb");if(fb)fb.innerHTML='<div class="card center"><span class="spin">✍️</span> Escribiendo las preguntas…</div>';
 const lvTxt=F.lv===1?"easy, direct recall":F.lv===2?"medium, some understanding":"challenging, needs reasoning";
 try{
  const intro=lang==="en"
   ?'You create a multiple-choice quiz for a Colombian child about 7-9 years old who is learning English (level A1-A2). Write EVERYTHING in SIMPLE ENGLISH: short sentences, very common words, no idioms. The material below may be in Spanish: write the questions in English anyway. Subject: '+subj[1]+'. Difficulty: '+lvTxt+'. '
   :'You create a multiple-choice quiz for a Colombian child about 7-9 years old (2nd-3rd grade) in SPANISH. Subject: '+subj[1]+'. Difficulty: '+lvTxt+'. ';
  const o=await geminiJSON(intro
   +'Base the questions ONLY on this material (if it is just a short topic, use true, age-appropriate facts about it):\n"""'+raw+'"""\n'
   +'RULES: exactly '+F.n+' questions; each with exactly 3 options and the CORRECT option FIRST; a one-sentence child-friendly explanation "exp"'+(lang==="en"?' (in simple English)':'')+'; only facts that are true; child-safe; no tricky wording. '
   +'Reply ONLY valid JSON, no markdown: {"title":"short title","ic":"emoji","q":[{"q":"question","ops":["correct","wrong","wrong"],"exp":"why"}]}');
  const qs=(o.q||[]).filter(function(x){return x&&typeof x.q==="string"&&Array.isArray(x.ops)&&x.ops.length>=2&&x.ops.every(function(t){return typeof t==="string"&&t.length;});}).slice(0,12)
   .map(function(x){return{q:myqClean(x.q,220),ops:x.ops.slice(0,3).map(function(t){return myqClean(t,120);}),exp:myqClean(x.exp,200)};});
  if(qs.length<3)throw new Error("La IA devolvió muy pocas preguntas. Intenta de nuevo.");
  const quiz={id:"q"+Date.now(),ti:myqClean(o.title||raw.slice(0,30),40)||"Mi quiz",ic:myqClean(o.ic,4)||subj[0],subj:subj[1],lang:lang,q:qs,ai:true,ts:Date.now()};
  myqSave(quiz);myqPlay(quiz.id);
 }catch(e){const f2=document.getElementById("myqFb");if(f2)f2.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message||"No se pudo crear el quiz")+'</div>';}}
function myqSave(quiz){const l=myqList();const k=l.findIndex(function(x){return x.id===quiz.id;});if(k>=0)l[k]=quiz;else l.unshift(quiz);while(l.length>30)l.pop();save();}

/* ---------- crear a mano ---------- */
function myqNewManual(){setTheme("kid");
 myqCleanup();
 MYQ.draft={ti:"",subj:1,lang:"es",q:[]};myqManualDraw();}
function myqDraftLang(l){MYQ.draft.lang=l;MYQ.draft.subj=l==="en"?4:1;myqManualDraw();}
function myqManualDraw(){
 const D=MYQ.draft,en=D.lang==="en";
 render(topbar("screenQuizzes()")+subHeader("✍️ Crear a mano")
  +'<div class="card" style="padding:8px 12px"><b>Idioma / Language</b> '+[["es","🇨🇴 Español"],["en","🇬🇧 English"]].map(function(x){const on=D.lang===x[0];return '<button onclick="myqDraftLang(\''+x[0]+'\')" style="margin:3px;padding:7px 12px;border-radius:14px;border:3px solid '+(on?"#7C3AED":"#E2E8F0")+';background:'+(on?"#EDE9FE":"#fff")+';font-weight:700;cursor:pointer;color:#1E293B">'+x[1]+'</button>';}).join("")+'</div>'
  +'<div class="card"><b>Título del quiz</b><input id="myqTi" value="'+esc(D.ti)+'" maxlength="40" placeholder="'+(en?"Ex: Animals":"Ej: Los animales")+'" oninput="MYQ.draft.ti=this.value" style="width:100%;padding:10px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-size:1.05rem"></div>'
  +D.q.map(function(x,i){return '<div class="card" style="padding:8px 12px;margin-bottom:6px"><b>'+(i+1)+'. '+esc(x.q)+'</b><br><span style="color:#16A34A;font-size:.88rem">✔ '+esc(x.ops[0])+'</span> <span class="mut" style="font-size:.85rem">· '+esc(x.ops.slice(1).join(" · "))+'</span> <button onclick="MYQ.draft.q.splice('+i+',1);myqManualDraw()" style="border:0;background:none;cursor:pointer" aria-label="Quitar">🗑️</button></div>';}).join("")
  +'<div class="card"><b>Nueva pregunta</b><input id="myqQ" placeholder="'+(en?"The question (in English)":"La pregunta")+'" maxlength="200" style="width:100%;padding:8px;border-radius:10px;border:2px solid #E2E8F0;margin:6px 0;box-sizing:border-box"><input id="myqA" placeholder="✔ Respuesta CORRECTA" maxlength="100" style="width:100%;padding:8px;border-radius:10px;border:2px solid #86EFAC;margin-bottom:6px;box-sizing:border-box"><input id="myqB" placeholder="Otra opción (incorrecta)" maxlength="100" style="width:100%;padding:8px;border-radius:10px;border:2px solid #FCA5A5;margin-bottom:6px;box-sizing:border-box"><input id="myqC" placeholder="Otra opción (incorrecta)" maxlength="100" style="width:100%;padding:8px;border-radius:10px;border:2px solid #FCA5A5;margin-bottom:6px;box-sizing:border-box"><button class="kbtn white" style="min-height:46px;margin:0" onclick="myqAddQ()">➕ Agregar pregunta</button></div>'
  +'<button class="kbtn green" onclick="myqManualSave()">💾 Guardar quiz ('+D.q.length+' preguntas)</button>');}
function myqAddQ(){
 const g=function(id){return myqClean((document.getElementById(id)||{}).value,200);};
 const q=g("myqQ"),a=g("myqA"),b=g("myqB"),c=g("myqC");
 if(!q||!a||!b){toast("Falta la pregunta, la correcta y al menos una incorrecta 🙂",false,2200);return;}
 const ops=[a,b].concat(c?[c]:[]);if(new Set(ops.map(function(x){return x.toLowerCase();})).size!==ops.length){toast("Las opciones no pueden repetirse 🙂",false,2000);return;}
 MYQ.draft.q.push({q:q,ops:ops,exp:""});myqManualDraw();}
function myqManualSave(){
 const D=MYQ.draft;D.ti=myqClean((document.getElementById("myqTi")||{}).value||D.ti,40);
 if(!D.ti){toast("Ponle un título al quiz",false,1600);return;}
 if(D.q.length<2){toast("Agrega al menos 2 preguntas",false,1600);return;}
 myqSave({id:"q"+Date.now(),ti:D.ti,ic:"📝",subj:(MYQ_SUBJ[D.subj]||MYQ_SUBJ[5])[1],lang:D.lang==="en"?"en":"es",q:D.q,ai:false,ts:Date.now()});
 toast("Quiz guardado 📝",true,1400);screenQuizzes();}

/* ---------- jugar ---------- */
function myqPlay(id,reviewOnly){setTheme("kid");
 const q=myqFind(id);if(!q)return;
 myqCleanup();
 let idx=q.q.map(function(_,i){return i;});
 if(reviewOnly){const m=(prof().myqMissed||{})[id]||[];idx=idx.filter(function(i){return m.indexOf(i)>=0;});if(!idx.length)idx=q.q.map(function(_,i){return i;});}
 MYQ.play={id:id,quiz:q,order:shuffled(idx),i:0,ok:0,review:!!reviewOnly,missed:[],tried:false,done:false};
 myqNext();}
function myqNext(){
 const P=MYQ.play;if(!P)return;
 if(P.i>=P.order.length)return myqFinish();
 P.tried=false;P.done=false;
 const qi=P.order[P.i],it=P.quiz.q[qi];
 P.cur=qi;P.opts=shuffled(it.ops.map(function(t,k){return{t:t,ok:k===0};}));
 render(topbar("screenQuizzes()")+'<div class="progressdots">'+dots(P.order.length,P.i)+'</div>'
  +'<p class="center" style="margin:2px 0 6px;font-family:Fredoka;font-weight:700">'+P.quiz.ic+' '+esc(P.quiz.ti)+(P.review?" · repaso":"")+'</p>'
  +'<div class="card" style="font-size:1.12rem;line-height:1.5;font-weight:700">'+esc(it.q)+'</div><button class="speaker small" onclick="myqSay(MYQ.play.quiz.q[MYQ.play.cur].q,MYQ.play.quiz.lang)">🔊 '+(P.quiz.lang==="en"?"Listen":"Léemela")+'</button>'
  +P.opts.map(function(o,i){return '<button class="kbtn white" id="myqO'+i+'" style="min-height:54px;text-align:left" onclick="myqAns('+i+')">'+esc(o.t)+'</button>';}).join("")+'<div id="myqF"></div>');
 myqSay(it.q,P.quiz.lang);}
function myqAns(i){
 const P=MYQ.play;if(!P||P.done)return;
 const o=P.opts[i],b=document.getElementById("myqO"+i),it=P.quiz.q[P.cur],f=document.getElementById("myqF");
 if(o.ok){
  P.done=true;const first=!P.tried;if(first)P.ok++;else if(P.missed.indexOf(P.cur)<0)P.missed.push(P.cur);
  recordAnswer(myqStat(P.quiz),first,12);sOK();confetti(first?8:3);b.style.background="#86EFAC";
  if(f)f.innerHTML='<p style="text-align:center;font-weight:800;color:#16A34A;margin-top:8px">✅ '+(P.quiz.lang==="en"?"Correct! ¡Muy bien!":"¡Correcto!")+'</p>'+(it.exp?'<p style="text-align:center;line-height:1.45">💡 '+esc(it.exp)+'</p>':"");
  P.i++;myqLater(myqNext,it.exp?3200:1500);
 }else{
  P.tried=true;if(P.missed.indexOf(P.cur)<0)P.missed.push(P.cur);sNO();b.style.background="#FCA5A5";b.disabled=true;
  if(f)f.innerHTML='<p style="text-align:center;font-weight:700;margin-top:8px">'+(P.quiz.lang==="en"?"Almost… 🤔 Read again and try once more.":"Casi… 🤔 Lee otra vez y prueba con calma.")+'</p>';}}
function myqFinish(){
 const P=MYQ.play;if(!P)return;
 const p=prof(),stars=starsFor(P.ok,Math.max(1,P.order.length));
 if(!p.myqBest)p.myqBest={};if(!P.review)p.myqBest[P.quiz.id]=Math.max(p.myqBest[P.quiz.id]||0,stars);
 if(!p.myqMissed)p.myqMissed={};
 const prev=p.myqMissed[P.quiz.id]||[];
 /* en repaso, lo que acertó a la primera sale de la lista; en juego completo, la lista = las falladas */
 p.myqMissed[P.quiz.id]=P.review?prev.filter(function(i){return P.missed.indexOf(i)>=0;}):P.missed.slice();
 save();MYQ.timers.forEach(clearTimeout);
 nodeWin(stars,"Mis quizzes",MYQ_WIN);}

/* ---------- compartir / importar / borrar ---------- */
function myqEncode(q){const compact={t:q.ti,i:q.ic,s:q.subj,l:q.lang==="en"?"en":"es",q:q.q.map(function(x){return[x.q,x.ops,x.exp||""];})};return "AFQ1:"+btoa(unescape(encodeURIComponent(JSON.stringify(compact))));}
function myqDecode(code){
 const m=/^AFQ1:([A-Za-z0-9+/=]+)$/.exec(String(code||"").trim());if(!m)throw new Error("El código no es válido");
 const o=JSON.parse(decodeURIComponent(escape(atob(m[1]))));
 const qs=(o.q||[]).filter(function(x){return Array.isArray(x)&&typeof x[0]==="string"&&Array.isArray(x[1])&&x[1].length>=2;}).slice(0,15).map(function(x){return{q:myqClean(x[0],220),ops:x[1].slice(0,3).map(function(t){return myqClean(t,120);}),exp:myqClean(x[2],200)};});
 if(qs.length<2)throw new Error("El quiz del código no tiene preguntas");
 return{id:"q"+Date.now(),ti:myqClean(o.t,40)||"Quiz importado",ic:myqClean(o.i,4)||"📝",subj:myqClean(o.s,20)||"Otro",lang:o.l==="en"?"en":"es",q:qs,ai:false,ts:Date.now()};}
function myqShare(id){
 const q=myqFind(id);if(!q)return;const code=myqEncode(q);
 const done=function(){toast("Código copiado 📋 Pégalo en un mensaje y en el otro dispositivo usa «Importar»",true,2800);};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(done,function(){myqFallback(code,done);});else myqFallback(code,done);}
function myqFallback(t,done){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done();}catch(e){prompt("Copia este código:",t);}a.remove();}
function myqImportScreen(){setTheme("kid");
 render(topbar("screenQuizzes()")+subHeader("📥 Importar un quiz")
  +'<div class="card"><b>Pega el código</b> <span class="mut" style="font-size:.82rem">(empieza con AFQ1:)</span><textarea id="myqCode" rows="4" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-size:.85rem"></textarea></div><button class="kbtn green" onclick="myqImport()">Importar</button><div id="myqFb"></div>');}
function myqImport(){
 try{const q=myqDecode((document.getElementById("myqCode")||{}).value);myqSave(q);toast("Quiz importado 📝",true,1600);screenQuizzes();}
 catch(e){const f=document.getElementById("myqFb");if(f)f.innerHTML='<div class="card" style="background:#FEE2E2">⚠️ '+esc(e.message)+'</div>';}}
function myqDel(id){if(!confirm("¿Borrar este quiz?"))return;const l=myqList(),k=l.findIndex(function(q){return q.id===id;});if(k>=0){l.splice(k,1);save();}screenQuizzes();}
/* una pregunta al azar de un quiz (la usan las puertas del mundo de retos) */
function myqRandomQuestion(id){const q=myqFind(id);if(!q||!q.q.length)return null;const it=q.q[Math.floor(Math.random()*q.q.length)];return{q:it.q,ops:shuffled(it.ops.map(function(t,k){return{t:t,ok:k===0};})),exp:it.exp,subj:myqStat(q),lang:q.lang==="en"?"en":"es"};}
