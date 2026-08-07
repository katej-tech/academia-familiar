"use strict";
/* ============ HISTORIETAS ILUSTRADAS CON IA (perfil adulto, curso de idiomas) ============ */
/* Reusa geminiImage() de videos.js (modelo gemini-2.5-flash-image, ya funciona hoy con la
   clave gratuita, sin facturación) para ilustrar la situación/vocabulario de la lección en
   una sola imagen tipo historieta de varias viñetas. Se guardan en prof().comics (galería
   acotada a 20), igual de simple que el patrón de S.aiBank.kidEN para cuentos ilustrados. */
function langComicsList(){const p=prof();if(!p.comics)p.comics=[];return p.comics;}
async function genLangComic(id,lvl,situation,vocab){
 const words=vocab.slice(0,4).map(w=>w[0]).join(", ");
 const prompt="Historieta ilustrada de 4 viñetas en un solo cuadro, estilo cómic colorido y simple para adultos, SIN texto ni letras, con personajes originales (nada de marcas registradas), mostrando una situación de "+LANG_SITUATION_LABEL[situation]+" en "+langInfo(id).name+", que ayude a recordar estas palabras: "+words;
 return await geminiImage(prompt);}
let LC_LAST=null;
async function screenLangComic(id,lvl,situation,vocab){
 if(!S.geminiKey){
  setTheme("adulto");
  return render(topbar("screenLangHub()")+'<div class="card center"><div style="font-size:2.4rem">🎨</div><h2 style="margin-top:8px">Necesitas tu clave de Gemini</h2><p class="mut" style="margin-top:8px">Actívala en el panel de padres para generar historietas ilustradas.</p></div><button class="abtn ghost" onclick="screenLangHub()">Volver</button>');}
 LC_LAST={id,lvl,situation,vocab};
 setTheme("adulto");
 render(topbar("screenLangHub()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">🎨</div><h2 style="margin-top:10px">Dibujando tu historieta…</h2></div>');
 try{
  const img=await genLangComic(id,lvl,situation,vocab);
  const words=vocab.slice(0,4);
  const list=langComicsList();
  list.unshift({img,langId:id,situation,words,ts:Date.now()});
  while(list.length>20)list.pop();
  save();
  renderLangComicResult(img,id,words);
 }catch(e){
  render(topbar("screenLangHub()")+'<div class="card" style="border-color:#DC2626">No se pudo generar la historieta. '+esc(e.message||"Intenta de nuevo")+'</div><button class="abtn" onclick="retryLangComic()">Reintentar</button><button class="abtn ghost" onclick="screenLangHub()">Volver</button>');}}
function retryLangComic(){if(LC_LAST)screenLangComic(LC_LAST.id,LC_LAST.lvl,LC_LAST.situation,LC_LAST.vocab);}
/* la IA no dibuja texto legible dentro de la imagen (por eso el prompt pide "sin letras"),
   así que la identificación de palabras se hace aquí, con una leyenda tocable + audio */
function comicWordsHTML(id,words){
 if(!words||!words.length)return "";
 return '<div class="card"><h3>🔤 Palabras de esta historieta</h3>'
  +words.map(w=>'<div style="display:flex;align-items:center;gap:8px;margin-top:8px">'
   +'<button class="spk" onclick="speakLang(\''+id+'\','+jsStr(w[0])+')">🔊</button>'
   +'<span><b>'+esc(w[0])+'</b> <span class="mut">— '+esc(w[1])+'</span></span></div>').join("")+'</div>';}
function renderLangComicResult(img,id,words){
 render(topbar("screenLangHub()")
  +'<h2 style="text-align:center">🎨 Tu historieta</h2>'
  +'<img src="'+img+'" style="width:100%;border-radius:16px;margin-top:10px" alt="Historieta ilustrada de la lección">'
  +comicWordsHTML(id,words)
  +'<button class="abtn" onclick="retryLangComic()">🔄 Generar otra</button>'
  +'<button class="abtn ghost" onclick="screenLangComicGallery()">🖼️ Ver galería</button>'
  +'<button class="abtn ghost" onclick="screenLangHub()">Volver a idiomas</button>');}
function screenLangComicGallery(){setTheme("adulto");
 const list=langComicsList();
 render(topbar("screenLangHub()")
  +'<h2 style="text-align:center">🖼️ Tus historietas</h2>'
  +(list.length?list.map(c=>'<div class="card"><img src="'+c.img+'" style="width:100%;border-radius:12px" alt="Historieta"><p class="mut" style="margin-top:6px">'+langInfo(c.langId).flag+' '+(LANG_SITUATION_LABEL[c.situation]||"")+'</p></div>'+comicWordsHTML(c.langId,c.words)).join(""):'<p class="mut center">Aún no has generado historietas. Termina una lección y toca "Ver historieta".</p>'));}
