"use strict";
/* ============ VIDEOS EDUCATIVOS (curados por los padres) ============ */
/* Los padres pegan enlaces de YouTube en su panel; los niños los ven aquí
   con reproductor incrustado (youtube-nocookie) y ganan monedas al terminar. */
function videoList(){if(!S.videos)S.videos=[];return S.videos;}
function ytId(url){
 const m=String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/);
 return m?m[1]:null;}
function screenVideosKid(){setTheme("kid");
 const vids=videoList();
 render(topbar("screenKidMap()")
 +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🎬 Videos para aprender</h2>'
 +(vids.length?'<p class="center" style="margin-bottom:12px">Elegidos para ti con amor 💛</p>'
  +vids.map((v,i)=>'<button class="kbtn blue" onclick="watchVideo('+i+')">▶️ '+esc(v.title||("Video "+(i+1)))+'</button>').join("")
 :'<div class="card center"><div style="font-size:3rem">📺</div><p style="font-size:1.05rem;margin-top:8px">Todavía no hay videos. Pídele a papá o mamá que agreguen algunos desde su panel 👨‍👩‍👧</p></div>'));}
function watchVideo(i){setTheme("kid");
 const v=videoList()[i];if(!v)return screenVideosKid();
 render(topbar("screenVideosKid()")
 +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);margin-bottom:8px">▶️ '+esc(v.title||"Video")+'</h2>'
 +'<div style="position:relative;width:100%;padding-top:56.25%;border-radius:18px;overflow:hidden;border:4px solid var(--kid-ink);box-shadow:0 6px 0 rgba(30,42,74,.8)">'
 +'<iframe src="https://www.youtube-nocookie.com/embed/'+esc(v.id)+'?rel=0" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="accelerometer;encrypted-media;picture-in-picture" allowfullscreen></iframe></div>'
 +'<button class="kbtn green" style="margin-top:14px" onclick="videoDone('+i+')">¡Ya lo vi todo! ✅ (+5 🪙)</button>');}
function videoDone(i){
 const d=touchDay();
 if(!d.vids)d.vids=[];
 if(!d.vids.includes(i)){d.vids.push(i);prof().coins+=5;prof().xp+=10;save();sWIN();confetti(16);toast("+5 🪙 por aprender viendo 🎬",true,1500);}
 else toast("Este ya lo viste hoy 😉",false,1200);
 setTimeout(screenVideosKid,1400);}
/* gestión desde el panel de padres */
function parentAddVideo(){
 const inp=document.getElementById("vidurl"),tit=document.getElementById("vidtitle");
 const id=ytId(inp.value);
 if(!id){alert("Pega un enlace válido de YouTube (youtube.com o youtu.be)");return;}
 videoList().push({id,title:tit.value.trim()||("Video "+(videoList().length+1))});
 save();screenParentDash();}
function parentDelVideo(i){videoList().splice(i,1);save();screenParentDash();}
function parentVideosHTML(){
 const vids=videoList();
 return '<div class="card"><h3>🎬 Videos para el niño</h3>'
 +'<p class="mut" style="margin:8px 0">Pega enlaces de YouTube que tú apruebes; el niño los ve dentro de la app y gana monedas.</p>'
 +(vids.length?vids.map((v,i)=>'<p style="display:flex;align-items:center;gap:8px;margin:6px 0"><span style="flex:1">▶️ '+esc(v.title)+'</span><button class="pbtn ghost" style="width:auto;padding:6px 12px" onclick="parentDelVideo('+i+')">🗑️</button></p>').join(""):'<p class="mut">Sin videos aún.</p>')
 +'<input type="text" id="vidtitle" placeholder="Título (ej: Los planetas)">'
 +'<input type="text" id="vidurl" placeholder="https://www.youtube.com/watch?v=...">'
 +'<button class="pbtn" onclick="parentAddVideo()">➕ Agregar video</button>'
 +(S.geminiKey?'<button class="pbtn ghost" onclick="parentSuggestVideos()">🤖 Sugerir videos con IA (según lo que debe reforzar)</button>':'<p class="tip">💡 Activa la clave de Gemini arriba para que la IA sugiera videos según las falencias del niño.</p>')
 +'<div id="vidsug"></div></div>';}
/* La IA sugiere TEMAS de video y abre la búsqueda en YouTube (el padre elige y pega el bueno).
   No incrustamos IDs inventados: la IA recomienda, el padre cura. */
async function parentSuggestVideos(){
 const box=document.getElementById("vidsug");
 box.innerHTML='<div class="card center"><span class="spin">⏳</span> La IA está pensando en buenos videos…</div>';
 // detectar áreas débiles desde las estadísticas del niño
 const p=S.profiles.nino,st=p.stats||{};
 const debiles=Object.keys(st).filter(s=>st[s].attempts>=3&&st[s].correct/st[s].attempts<0.7);
 const foco=debiles.length?debiles.join(", "):"sílabas trabadas, ortografía, sumas llevando, restas prestando, secuencias, el reloj y los números";
 try{
  const obj=await geminiJSON('Recomienda 6 videos educativos de YouTube en ESPAÑOL LATINO para un niño de 7 años de primero de primaria, para reforzar estos temas: '+foco+'. Para cada uno da un título descriptivo y una frase de búsqueda exacta para encontrarlo en YouTube. Responde SOLO JSON: {"videos":[{"titulo":"...","busqueda":"frase para buscar en youtube en español"}]} con 6 elementos.');
  const vs=(obj.videos||[]).slice(0,6);
  box.innerHTML='<div class="card"><b>🤖 Sugerencias de la IA</b><p class="mut" style="font-size:.85rem;margin:6px 0">Toca para ver en YouTube. Si te gusta uno, copia su enlace y pégalo arriba para que el niño lo vea dentro de la app.</p>'
   +vs.map(v=>'<a href="https://www.youtube.com/results?search_query='+encodeURIComponent(v.busqueda)+'" target="_blank" rel="noopener" style="display:block;padding:10px;margin:6px 0;border:1px solid var(--par-line);border-radius:10px;text-decoration:none;color:var(--par-acc)">🔎 '+esc(v.titulo)+'</a>').join("")
   +'</div>';
 }catch(e){box.innerHTML='<div class="card" style="border-color:#DC2626">'+esc(e.message||"No se pudo, intenta de nuevo")+'</div>';}}

/* ============ ILUSTRACIONES CON IA (Gemini genera imágenes) ============ */
async function geminiImage(promptText){
 const models=["gemini-2.5-flash-image","gemini-2.5-flash-image-preview","gemini-2.0-flash-preview-image-generation"];
 for(const m of models){
  try{
   const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+m+":generateContent?key="+encodeURIComponent(S.geminiKey),
    {method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({contents:[{parts:[{text:promptText}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})});
   if(!res.ok)continue;
   const data=await res.json();
   const parts=(data.candidates&&data.candidates[0].content&&data.candidates[0].content.parts)||[];
   const img=parts.find(p=>p.inlineData&&p.inlineData.data);
   if(img)return "data:"+(img.inlineData.mimeType||"image/png")+";base64,"+img.inlineData.data;
  }catch(e){}}
 throw new Error("No se pudo generar la imagen");}
async function illustratePage(){
 if(!S.geminiKey)return;
 const c=ST.c,p=c.pages[ST.page],myPage=ST.page;
 if(p.img||p.imgBusy)return;
 p.imgBusy=true;
 try{
  p.img=await geminiImage("Ilustración infantil tierna y colorida, estilo libro de cuentos, sin texto ni letras: "+stripTags(p.text)+" (cuento: "+c.title+")");
  p.imgBusy=false;
  // solo re-pinta si el niño sigue en esa página
  if(ST.c===c&&ST.page===myPage&&ST.phase==="read")renderStory();
 }catch(e){p.imgBusy=false;p.imgFail=true;
  if(ST.c===c&&ST.page===myPage&&ST.phase==="read")renderStory();}}
