"use strict";
/* ============ LISTENING ESTILO CAMBRIDGE (perfil adulto, curso de idiomas) ============ */
/* Genera un dialogo/monologo corto CON VOZ (speakLang, sin depender de un video real de
   YouTube) y preguntas de comprension, como los examenes Cambridge (FCE/PET): opcion
   multiple + verdadero/falso/no se menciona. Reusa la maquinaria de preguntas ya existente
   (CQ/nextCQ/ansCQ/finishCQ de js/lang-video.js) — es el mismo tipo de ejercicio, solo
   cambia de donde sale el texto. Practica complementaria, no bloquea el avance de nivel. */
async function buildListeningPassage(id,lvl,situation){
 const vocab=LANG_VOCAB_SEED[id][situation];
 if(S.geminiKey){
  try{
   const vocabTxt=vocab.map(function(v){return v[0]+" = "+v[1];}).join(", ");
   const obj=await geminiJSON('Eres creador de exámenes de '+langInfo(id).name+' estilo Cambridge (FCE/PET) para un adulto hispanohablante nivel '+CEFR_LEVELS[lvl]+'. Escribe un diálogo o monólogo CORTO (60 a 90 palabras) en '+langInfo(id).name+', sobre "'+LANG_SITUATION_LABEL[situation]+'", usando naturalmente parte de este vocabulario: '+vocabTxt+'. Luego crea 4 preguntas de comprensión sobre ese texto, mezclando opción múltiple (3 opciones) y verdadero/falso/no se menciona (usa las opciones "Verdadero","Falso","No se menciona" para esas). Responde SOLO JSON: {"passage":"el texto completo","items":[{"q":"...","ops":["...","...","..."],"a":0,"why":"explicación breve"}]} con 4 items.');
   if(obj.passage&&obj.items&&obj.items.length){
    const items=obj.items.map(function(it){const q=stripHTML(it.q);const ops=(it.ops||[]).map(function(o){return stripHTML(o);});const correct=ops[it.a];const sh=shuffled(ops);return{q:q,ops:sh,a:sh.indexOf(correct),why:stripHTML(it.why||"")};});
    return{passage:stripHTML(obj.passage),items:items};
   }
  }catch(e){}
 }
 const picks=shuffled(vocab).slice(0,4);
 const passage=picks.map(function(w){return w[2];}).join(" ");
 const items=picks.map(function(w){
  const distractors=pickN(vocab.filter(function(v){return v!==w;}).map(function(v){return v[1];}),2);
  const ops=shuffled([w[1]].concat(distractors));
  return{q:'¿Qué significa "'+w[0]+'"?',ops:ops,a:ops.indexOf(w[1])};});
 return{passage:passage,items:items};}
function screenLangListening(id,lvl){setTheme("adulto");
 render(topbar("screenLangLevelDetail('"+id+"',"+lvl+")")
  +'<h2 style="text-align:center">🎧 Listening estilo Cambridge</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Un diálogo o monólogo corto con preguntas de comprensión, como en los exámenes Cambridge.</p>'
  +'<button class="abtn green" onclick="startLangListening(\''+id+'\','+lvl+')">🎧 Generar listening</button>');}
let LZ={};
async function startLangListening(id,lvl){setTheme("adulto");
 render(topbar("screenLangListening('"+id+"',"+lvl+")")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">🎧</div><h2 style="margin-top:10px">Preparando tu listening…</h2></div>');
 const st=langState(id);
 const situation=LANG_SITUATIONS[Math.min(st.lesson,LANG_SITUATIONS.length-1)];
 const data=await buildListeningPassage(id,lvl,situation);
 LZ={id:id,lvl:lvl,passage:data.passage,items:data.items};
 screenListeningPassage();}
function screenListeningPassage(){setTheme("adulto");
 render(topbar("screenLangListening('"+LZ.id+"',"+LZ.lvl+")")
  +'<h2 style="text-align:center">🎧 Escucha</h2>'
  +'<div class="card"><p style="line-height:1.6;font-style:italic">'+esc(LZ.passage)+'</p></div>'
  +'<button class="abtn green" onclick="speakLang(\''+LZ.id+'\','+jsStr(LZ.passage)+')">▶️ Escuchar</button>'
  +'<button class="abtn" onclick="startListeningQuestions()">Empezar preguntas →</button>');}
function startListeningQuestions(){
 CQ={id:LZ.id,lvl:LZ.lvl,items:LZ.items,k:0,ok:0,mode:"listening"};
 nextCQ();}
