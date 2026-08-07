"use strict";
/* ============ VIDEOS + COMPRENSIÓN (perfil adulto, curso de idiomas) ============ */
/* La IA sugiere qué BUSCAR en YouTube (no inventamos IDs de video, igual que el patrón
   de parentSuggestVideos en videos.js); el usuario elige, ve el video afuera de la app,
   y opcionalmente pega la transcripción para un examen de comprensión más preciso.
   Es práctica COMPLEMENTARIA: no bloquea el avance de nivel del curso de idiomas. */
function screenLangVideos(id,lvl){setTheme("adulto");
 render(topbar("screenLangLevelDetail('"+id+"',"+lvl+")")
  +'<h2 style="text-align:center">🎬 Videos y comprensión</h2>'
  +'<p class="mut center" style="margin-bottom:10px">La IA sugiere qué buscar en YouTube; tú eliges el mejor video y lo ves fuera de la app.</p>'
  +(S.geminiKey?'<button class="abtn" onclick="suggestLangVideoSearches(\''+id+'\','+lvl+')">🤖 Sugerir búsquedas</button>'
   :'<p class="tip">💡 Activa tu clave de Gemini en el panel de padres para que la IA sugiera videos.</p>')
  +'<div id="langvidsug"></div>'
  +'<button class="abtn green" style="margin-top:14px" onclick="screenLangComprehension(\''+id+'\','+lvl+')">📝 Ya vi un video → practicar comprensión</button>');}
async function suggestLangVideoSearches(id,lvl){
 const box=document.getElementById("langvidsug");
 box.innerHTML='<div class="card center"><span class="spin">⏳</span> La IA está pensando en buenos videos…</div>';
 try{
  const obj=await geminiJSON('Recomienda 5 videos de YouTube para practicar '+langInfo(id).name+' nivel '+CEFR_LEVELS[lvl]+', variados (noticias cortas, vlogs, entrevistas), apropiados para un adulto que aprende el idioma. Para cada uno da un título descriptivo y una frase de búsqueda exacta para YouTube. Responde SOLO JSON: {"videos":[{"titulo":"...","busqueda":"frase para buscar en youtube"}]} con 5 elementos.');
  const vs=(obj.videos||[]).slice(0,5);
  box.innerHTML='<div style="margin-top:10px">'+vs.map(v=>'<a href="https://www.youtube.com/results?search_query='+encodeURIComponent(v.busqueda)+'" target="_blank" rel="noopener" class="card" style="display:block;text-decoration:none;color:inherit;margin-top:8px">🔎 '+esc(v.titulo)+'</a>').join("")+'</div>';
 }catch(e){box.innerHTML='<div class="card" style="border-color:#DC2626">'+esc(e.message||"No se pudo, intenta de nuevo")+'</div>';}}
function screenLangComprehension(id,lvl){setTheme("adulto");
 render(topbar("screenLangVideos('"+id+"',"+lvl+")")
  +'<h2 style="text-align:center">📝 Comprensión</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Pega la transcripción/subtítulos del video (opcional, da más precisión) o describe brevemente el tema.</p>'
  +'<textarea id="transcriptTxt" rows="6" placeholder="Pega aquí la transcripción o subtítulos (opcional)..." style="width:100%"></textarea>'
  +'<input type="text" id="topicTxt" placeholder="O describe brevemente el tema del video">'
  +'<button class="abtn green" onclick="genLangComprehension(\''+id+'\','+lvl+')">Generar comprensión</button>');}
async function genLangComprehension(id,lvl){
 const tEl=document.getElementById("transcriptTxt"),pEl=document.getElementById("topicTxt");
 const t=(tEl&&tEl.value||"").trim(),topic=(pEl&&pEl.value||"").trim();
 if(!t&&!topic)return toast("Pega la transcripción o describe el tema",false,1500);
 if(!S.geminiKey)return toast("Esto necesita la clave de Gemini activa",false,1800);
 setTheme("adulto");
 render(topbar(null)+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando la comprensión…</h2></div>');
 try{
  const base=t?('esta transcripción: "'+t.slice(0,3000)+'"'):('un video típico sobre: '+topic);
  const obj=await geminiJSON('Crea 5 preguntas de comprensión auditiva/lectora de '+langInfo(id).name+' nivel '+CEFR_LEVELS[lvl]+' sobre '+base+'. Opción múltiple, 3 opciones, 1 sola correcta; preguntas en español, citas en el idioma meta si aplica. Responde SOLO JSON: {"items":[{"q":"...","ops":["...","...","..."],"a":0}]} con 5 items.');
  const items=(obj.items||[]).map(it=>{const ops=(it.ops||[]).map(o=>stripHTML(o));const correct=ops[it.a];const sh=shuffled(ops);return{q:stripHTML(it.q),ops:sh,a:sh.indexOf(correct)};});
  if(!items.length)throw new Error("vacío");
  CQ={id,lvl,items,k:0,ok:0};nextCQ();
 }catch(e){render(topbar("screenLangVideos('"+id+"',"+lvl+")")+'<div class="card" style="border-color:#DC2626">No se pudo generar. '+esc(e.message||"Intenta de nuevo")+'</div><button class="abtn" onclick="screenLangComprehension(\''+id+'\','+lvl+')">Reintentar</button>');}}
let CQ={};
function nextCQ(){
 const it=CQ.items[CQ.k];
 if(!it)return finishCQ();
 CQ.lock=false;
 render(topbar(null)
  +'<div class="progressdots">'+dots(CQ.items.length,CQ.k)+'</div>'
  +'<h2 style="text-align:center">📝 Comprensión '+(CQ.k+1)+'/'+CQ.items.length+'</h2>'
  +'<div class="bigq center">'+esc(it.q)+'</div>'
  +it.ops.map((o,i)=>'<button class="abtn" onclick="ansCQ('+i+')">'+esc(o)+'</button>').join(""));}
function ansCQ(i){
 if(CQ.lock)return;CQ.lock=true;
 const it=CQ.items[CQ.k];const ok=i===it.a;
 recordAnswer(langInfo(CQ.id).name+" comprensión",ok,12);
 if(ok){CQ.ok++;sOK();confetti(6);}else sNO();
 CQ.k++;setTimeout(nextCQ,900);}
function finishCQ(){
 const pct=Math.round(CQ.ok/CQ.items.length*100);
 prof().coins+=10;prof().xp+=15;save();
 render(topbar("screenLangHub()")
  +'<div class="card center"><div style="font-size:3rem">'+(pct>=70?"🌟":"📚")+'</div><h2>Comprensión: '+pct+'%</h2>'
  +'<p style="margin-top:10px">Práctica complementaria — no afecta tu avance de nivel del curso.</p></div>'
  +'<button class="abtn green" onclick="screenLangVideos(\''+CQ.id+'\','+CQ.lvl+')">Otro video</button>'
  +'<button class="abtn ghost" onclick="screenLangHub()">Volver a idiomas</button>');}
