"use strict";
/* ============ LECTURAS CON TRADUCCIÓN (perfil adulto, curso de idiomas) ============ */
/* Igual patrón "toca la palabra para traducirla" que ya usa english-stories.js para niños
   (openStoryEN/tapWordEN) — aquí generalizado a los 4 idiomas del curso de adulto. */
async function buildLangStory(id,lvl,situation){
 const vocab=LANG_VOCAB_SEED[id][situation];
 if(S.geminiKey){
  try{
   const vocabTxt=vocab.map(function(v){return v[0]+" = "+v[1];}).join(", ");
   const obj=await geminiJSON('Eres autor de lecturas de '+langInfo(id).name+' para un adulto hispanohablante nivel '+CEFR_LEVELS[lvl]+'. Escribe un texto corto (100 a 150 palabras) en '+langInfo(id).name+' sobre "'+LANG_SITUATION_LABEL[situation]+'", usando naturalmente parte de este vocabulario: '+vocabTxt+'. Luego arma un glosario con la traducción al español de TODAS las palabras no triviales del texto (sustantivos, verbos, adjetivos — no artículos ni preposiciones comunes), y también la traducción completa del texto al español. Responde SOLO JSON: {"title":"título corto","text":"el texto completo","text_es":"la traducción completa del texto al español","words":{"palabra1":"traducción1","palabra2":"traducción2"}}. Las claves de "words" deben estar en minúsculas y sin puntuación, tal como aparecen en el texto.');
   if(obj.text&&obj.words)return{title:stripHTML(obj.title||LANG_SITUATION_LABEL[situation]),text:stripHTML(obj.text),text_es:stripHTML(obj.text_es||""),words:obj.words};
  }catch(e){}
 }
 const picks=shuffled(vocab).slice(0,5);
 const text=picks.map(function(w){return w[2];}).join(" ");
 const text_es=picks.map(function(w){return w[4]||"";}).join(" ");
 const words={};
 vocab.forEach(function(w){
  const clean=w[0].toLowerCase().replace(/[.,!?¿¡";:()]/g,"").trim();
  if(clean)words[clean]=w[1];});
 return{title:LANG_SITUATION_LABEL[situation],text:text,text_es:text_es,words:words};}
function screenLangReading(id,lvl){setTheme("adulto");
 render(topbar("screenLangLevelDetail('"+id+"',"+lvl+")")
  +'<h2 style="text-align:center">📖 Lecturas</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Un texto corto en el idioma meta — toca cualquier palabra para ver su traducción.</p>'
  +'<button class="abtn green" onclick="startLangReading(\''+id+'\','+lvl+')">📖 Generar lectura</button>');}
let RD={};
async function startLangReading(id,lvl){setTheme("adulto");
 render(topbar("screenLangReading('"+id+"',"+lvl+")")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">📖</div><h2 style="margin-top:10px">Preparando tu lectura…</h2></div>');
 const st=langState(id);
 const situation=LANG_SITUATIONS[Math.min(st.lesson,LANG_SITUATIONS.length-1)];
 const story=await buildLangStory(id,lvl,situation);
 RD={id:id,lvl:lvl,story:story};
 screenReadLangStory();}
function screenReadLangStory(){setTheme("adulto");
 const c=RD.story;
 const html=c.text.split(/(\s+)/).map(function(tok){
  const clean=tok.toLowerCase().replace(/[.,!?¿¡";:()]/g,"").trim();
  if(clean&&c.words&&c.words[clean])return '<span class="word" onclick="tapLangWord(\''+clean.replace(/'/g,"\\'")+'\')">'+esc(tok)+'</span>';
  return esc(tok);}).join("");
 render(topbar("screenLangReading('"+RD.id+"',"+RD.lvl+")")
  +'<h2 style="text-align:center">'+esc(c.title)+'</h2>'
  +'<p class="mut center" style="margin-bottom:8px">Toca las palabras subrayadas para traducirlas 👆</p>'
  +'<button class="abtn" onclick="speakLang(\''+RD.id+'\','+jsStr(c.text)+')">🔊 Escuchar todo</button>'
  +'<div class="card" style="line-height:2">'+html+'</div>'
  +'<div id="langwordbox"></div>'
  +(c.text_es?'<button class="abtn ghost" onclick="toggleFullTranslation()">👁️ Ver traducción completa</button><div id="fullTransBox"></div>':'')
  +'<button class="abtn green" onclick="startLangReading(\''+RD.id+'\','+RD.lvl+')">🔄 Otra lectura</button>'
  +'<button class="abtn ghost" onclick="screenLangLevelDetail(\''+RD.id+'\','+RD.lvl+')">← Volver a niveles</button>');}
function toggleFullTranslation(){
 const c=RD.story;const box=document.getElementById("fullTransBox");if(!box)return;
 box.innerHTML=box.innerHTML?'':'<div class="card" style="margin-top:8px;line-height:1.6"><i>'+esc(c.text_es)+'</i></div>';}
function tapLangWord(w){
 const c=RD.story;
 speakLang(RD.id,w);
 const es=(c.words&&c.words[w])||"?";
 const box=document.getElementById("langwordbox");
 if(box)box.innerHTML='<div class="card" style="border-color:var(--adult-accent);border-width:2px;text-align:center"><b style="color:var(--adult-accent);font-size:1.2rem">'+esc(w)+'</b> = <span style="font-size:1.1rem">'+esc(es)+'</span> '
  +'<button class="spk" onclick="toggleWordVault(\''+RD.id+'\','+jsStr(w)+','+jsStr(es)+',this)">'+(isInVault(RD.id,w)?"⭐":"☆")+'</button></div>';}
