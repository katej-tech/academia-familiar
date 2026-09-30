"use strict";
/* ============ APRENDE A DIBUJAR DE VERDAD (método real, no solo calcar) ============
   Feedback directo: "no le veo ventaja o aprendizaje al módulo de pintura, la verdad que no".
   Tenía razón — "Cómo dibujar" y "Colorear en 3D" son calcar/pintar una plantilla ya hecha, no
   enseñan a dibujar. Katerine mandó una investigación real sobre cómo se enseña dibujo de verdad
   (Art for Kids Hub, Draw So Cute, Mark Crilley): TODO objeto se construye con formas simples
   (cilindro+círculo=árbol), las caras se construyen con un círculo + una CRUZ guía para poner los
   ojos simétricos, y las proporciones se miden en "cabezas" (chibi=2-3, realista=6-8). Esto SÍ es
   una técnica que sirve para dibujar cualquier cosa, no solo la plantilla de turno.
   Nota sobre 3D: esta técnica es explícitamente de dibujo en PAPEL (líneas guía en una hoja plana,
   como enseñan Mark Crilley o Art for Kids Hub) — forzarla a un canvas 3D iría en contra del
   método real, así que este módulo es 2D a propósito (SVG), igual que un cuaderno de dibujo. */

function screenDrawMethod(){setTheme("kid");const p=prof();const done=p.drawMethodDone||{};
 const card=function(id,ic,t,sub,fn){const ok=done[id];
  return '<button class="kbtn '+(ok?"yellow":"white")+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+(ok?" ⭐":"")+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenArt()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">✏️ Aprende a dibujar de verdad</h2>'
  +'<p class="center" style="margin-bottom:12px">El truco de los que dibujan bien: no calcan, ¡construyen! Aprende cómo.</p>'
  +card("formas","🔵","Todo son formas","Cualquier cosa se dibuja con círculos, cilindros y triángulos","dmShapes()")
  +card("cara","😊","La cruz para caras","Un círculo + una cruz guía para poner los ojos derechitos","dmFaceStart()")
  +card("cabezas","📏","Mide con cabezas","Así se calculan las proporciones: chibi o realista","dmHeadsStart()")
  +'<button class="kbtn purple" style="margin-top:6px" onclick="gameDrawLesson()">✂️ Practicar dibujando paso a paso</button>');}

/* ---------- 🔵 Lección 1: todo son formas ---------- */
function dmLabel(x,y,t){return '<rect x="'+(x-19)+'" y="'+(y-9)+'" width="38" height="16" rx="8" fill="#1E2A4A"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="9" fill="#fff" font-family="Fredoka,sans-serif" font-weight="700">'+t+'</text>';}
const DM_SHAPES=[
 {nm:"Árbol",guide:'<rect x="88" y="110" width="24" height="70" rx="4" fill="none" stroke="#8B5E34" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,190,"cilindro")+'<circle cx="100" cy="80" r="46" fill="none" stroke="#3EC97C" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,26,"círculo"),
  result:'<rect x="88" y="110" width="24" height="70" rx="4" fill="#8B5E34"/><circle cx="100" cy="78" r="46" fill="#3EC97C"/><circle cx="76" cy="70" r="20" fill="#4ADE80"/><circle cx="126" cy="66" r="18" fill="#4ADE80"/>'},
 {nm:"Casa",guide:'<rect x="50" y="100" width="100" height="80" fill="none" stroke="#3B82F6" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,196,"cuadrado")+'<polygon points="40,100 100,50 160,100" fill="none" stroke="#EF4444" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,42,"triángulo"),
  result:'<polygon points="40,100 100,50 160,100" fill="#DC2626"/><rect x="50" y="100" width="100" height="80" fill="#FDE68A"/><rect x="88" y="140" width="24" height="40" fill="#8B5E34"/><rect x="60" y="115" width="24" height="24" fill="#7DD3FC"/><rect x="116" y="115" width="24" height="24" fill="#7DD3FC"/>'},
 {nm:"Gato",guide:'<circle cx="100" cy="70" r="30" fill="none" stroke="#F97316" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,26,"círculo")+'<ellipse cx="100" cy="145" rx="38" ry="42" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,193,"óvalo")+'<polygon points="72,50 80,20 96,46" fill="none" stroke="#EA580C" stroke-width="3" stroke-dasharray="4 3"/><polygon points="128,50 120,20 104,46" fill="none" stroke="#EA580C" stroke-width="3" stroke-dasharray="4 3"/>',
  result:null},
 {nm:"Carro",guide:'<rect x="30" y="98" width="140" height="44" rx="16" fill="none" stroke="#EF4444" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,90,"rectángulo")+'<circle cx="62" cy="144" r="18" fill="none" stroke="#1E293B" stroke-width="3" stroke-dasharray="4 3"/><circle cx="138" cy="144" r="18" fill="none" stroke="#1E293B" stroke-width="3" stroke-dasharray="4 3"/>'+dmLabel(100,178,"círculos"),
  result:null},
 {nm:"Persona",guide:'<circle cx="100" cy="34" r="18" fill="none" stroke="#A855F7" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,10,"círculo")+'<ellipse cx="100" cy="90" rx="22" ry="34" fill="none" stroke="#7C3AED" stroke-width="3" stroke-dasharray="5 4"/>'+dmLabel(100,132,"óvalo")+'<ellipse cx="66" cy="150" rx="9" ry="34" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-dasharray="4 3"/><ellipse cx="134" cy="150" rx="9" ry="34" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-dasharray="4 3"/>',
  result:'<circle cx="100" cy="34" r="18" fill="#FBCFE8"/><ellipse cx="100" cy="90" rx="22" ry="34" fill="#38BDF8"/><ellipse cx="66" cy="150" rx="9" ry="34" fill="#1E3A8A"/><ellipse cx="134" cy="150" rx="9" ry="34" fill="#1E3A8A"/><circle cx="93" cy="30" r="3" fill="#1E2A4A"/><circle cx="107" cy="30" r="3" fill="#1E2A4A"/><path d="M92 40 Q100 46 108 40" stroke="#1E2A4A" stroke-width="2" fill="none"/>'}
];
function dmShapeSvg(inner){return '<svg viewBox="0 0 200 200" style="width:100%;max-width:220px;display:block;margin:0 auto">'+inner+'</svg>';}
let DMS={i:0};
function dmShapes(){setTheme("kid");DMS.i=0;dmShapesRender();}
function dmShapesRender(){
 const it=DM_SHAPES[DMS.i];
 const resultHtml=it.result?dmShapeSvg(it.result)
  :(it.nm==="Gato"&&typeof dlPreview==="function"?dlPreview(DRAW_FIGS[3],200)
  :(it.nm==="Carro"&&typeof dlPreview==="function"?dlPreview(DRAW_FIGS[0],200)
  :dmShapeSvg(it.guide)));
 render(topbar("screenDrawMethod()")
  +'<div class="progressdots">'+dots(DM_SHAPES.length,DMS.i)+'</div>'
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:6px">🔵 '+it.nm+' = formas simples</h2>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
   +'<div class="card center" style="padding:8px"><p class="mut" style="font-size:.78rem;margin:0 0 4px">1. Formas guía</p>'+dmShapeSvg(it.guide)+'</div>'
   +'<div class="card center" style="padding:8px"><p class="mut" style="font-size:.78rem;margin:0 0 4px">2. ¡Ya es un '+it.nm.toLowerCase()+'!</p>'+resultHtml+'</div>'
  +'</div>'
  +'<p class="center" style="margin-top:10px;line-height:1.5">Dibuja primero las formas guía bien flojito, y luego dale forma encima. ¡Así se dibuja cualquier cosa!</p>'
  +'<button class="kbtn '+(DMS.i<DM_SHAPES.length-1?"blue":"green")+'" onclick="dmShapesNext()">'+(DMS.i<DM_SHAPES.length-1?"Siguiente →":"🎯 ¡Ya entendí, a practicar!")+'</button>');
 speakES(it.nm+" se dibuja con formas simples.");}
function dmShapesNext(){
 if(DMS.i<DM_SHAPES.length-1){DMS.i++;return dmShapesRender();}
 const p=prof();if(!p.drawMethodDone)p.drawMethodDone={};p.drawMethodDone.formas=true;p.coins+=3;p.xp+=6;save();
 sWIN();confetti(20);nodeWin(3,"Todo son formas");}

/* ---------- 😊 Lección 2: la cruz para caras (círculo + cruz guía, ojos simétricos) ---------- */
let DMF={};
const DMF_ROUNDS=[
 {r:60,ok:[[64,100],[136,100]],bad:[[64,70],[100,100],[150,120]]},
 {r:50,ok:[[70,100],[130,100]],bad:[[70,65],[100,150],[135,72]]},
 {r:66,ok:[[62,100],[138,100]],bad:[[62,60],[100,70],[145,130]]}];
function dmFaceStart(){setTheme("kid");DMF={round:0,total:3,ok:0,picked:[]};dmFaceRender();}
function dmFaceRender(){
 if(DMF.round>=DMF.total)return dmFaceEnd();
 const R=DMF_ROUNDS[DMF.round],r=R.r;DMF.picked=[];DMF.R=R;DMF.answered=false;
 const eyeSpots=R.ok.concat(R.bad);
 const dotsSvg=eyeSpots.map(function(p,i){return '<circle id="dmfp'+i+'" data-x="'+p[0]+'" data-y="'+p[1]+'" cx="'+p[0]+'" cy="'+p[1]+'" r="10" fill="#fff" stroke="#3B82F6" stroke-width="3" style="cursor:pointer" onclick="dmFaceTap('+i+')"/>';}).join("");
 render(topbar("screenDrawMethod()")
  +'<div class="progressdots">'+dots(DMF.total,DMF.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:4px">😊 ¿Dónde van los ojos?</h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:8px">Primero un círculo, luego una <b>cruz guía</b>. Los ojos van SOBRE la línea horizontal, a la misma distancia del centro. Toca los 2 lugares correctos.</p>'
  +'<div class="card center"><svg viewBox="0 0 200 200" style="width:100%;max-width:260px">'
   +'<circle cx="100" cy="100" r="'+r+'" fill="#FDE9C7" stroke="#1E2A4A" stroke-width="3"/>'
   +'<line x1="'+(100-r)+'" y1="100" x2="'+(100+r)+'" y2="100" stroke="#3B82F6" stroke-width="2" stroke-dasharray="6 4"/>'
   +'<line x1="100" y1="'+(100-r)+'" x2="100" y2="'+(100+r)+'" stroke="#3B82F6" stroke-width="2" stroke-dasharray="6 4"/>'
   +'<g id="dmfFace" style="display:none">'
    +'<circle cx="'+R.ok[0][0]+'" cy="'+R.ok[0][1]+'" r="7" fill="#1E2A4A"/><circle cx="'+R.ok[1][0]+'" cy="'+R.ok[1][1]+'" r="7" fill="#1E2A4A"/>'
    +'<circle cx="100" cy="'+(100+r*.28)+'" r="4" fill="#B45309"/>'
    +'<path d="M '+(100-r*.35)+' '+(100+r*.55)+' Q 100 '+(100+r*.8)+' '+(100+r*.35)+' '+(100+r*.55)+'" stroke="#1E2A4A" stroke-width="3" fill="none"/>'
   +'</g>'
   +'<g id="dmfDots">'+dotsSvg+'</g>'
  +'</svg></div>'
  +'<div id="dmfMsg" class="center" style="min-height:1.6em;font-family:Fredoka;font-weight:700"></div>'
  +'<button class="kbtn green" id="dmfCheckBtn" style="display:none" onclick="dmFaceCheck()">✅ Ya elegí los dos</button>');}
function dmFaceTap(i){
 if(DMF.answered)return;
 const el=document.getElementById("dmfp"+i);if(!el)return;
 const idx=DMF.picked.indexOf(i);
 if(idx>=0){DMF.picked.splice(idx,1);el.setAttribute("fill","#fff");}
 else{if(DMF.picked.length>=2)return;DMF.picked.push(i);el.setAttribute("fill","#3B82F6");}
 const btn=document.getElementById("dmfCheckBtn");if(btn)btn.style.display=DMF.picked.length===2?"block":"none";}
function dmFaceCheck(){
 if(DMF.answered||DMF.picked.length!==2)return;DMF.answered=true;
 const R=DMF.R,okIdx=[0,1]; // los primeros 2 índices del array `dots` combinado son siempre R.ok
 const ok=DMF.picked.slice().sort().join(",")===okIdx.join(",");
 recordAnswer("Dibujo",ok,12);
 const msg=document.getElementById("dmfMsg");
 if(ok){sOK();confetti(14);DMF.ok++;document.getElementById("dmfFace").style.display="block";
  if(msg)msg.innerHTML="✅ ¡Perfecto! Simétricos sobre la línea 😊";}
 else{sNO();if(msg)msg.innerHTML="❌ Casi… deben estar sobre la línea horizontal y a la misma distancia del centro";}
 const btn=document.getElementById("dmfCheckBtn");if(btn)btn.style.display="none";
 setTimeout(function(){DMF.round++;dmFaceRender();},ok?1800:2400);}
function dmFaceEnd(){
 const p=prof();if(DMF.ok>=2){if(!p.drawMethodDone)p.drawMethodDone={};p.drawMethodDone.cara=true;}
 p.coins+=2+DMF.ok;p.xp+=8;save();if(DMF.ok>=2){sWIN();confetti(20);}
 nodeWin(starsFor(DMF.ok,DMF.total),"La cruz para caras");}

/* ---------- 📏 Lección 3: mide con cabezas (chibi vs realista) ---------- */
function dmHeadsFigure(heads){
 const R=13,gap=2,bodyH=(heads-1)*(2*R+gap);
 let s='<svg viewBox="0 0 140 '+(24+2*R+bodyH+10)+'" style="width:100%;max-width:150px;margin:0 auto;display:block">';
 s+='<circle cx="40" cy="'+(14+R)+'" r="'+R+'" fill="#FBCFE8" stroke="#1E2A4A" stroke-width="2.5"/>';
 s+='<rect x="'+(40-R*.8)+'" y="'+(14+2*R)+'" width="'+(R*1.6)+'" height="'+bodyH+'" rx="'+(R*.5)+'" fill="#60A5FA" stroke="#1E2A4A" stroke-width="2.5"/>';
 for(let i=0;i<heads;i++)s+='<circle cx="105" cy="'+(14+R+i*(2*R+gap))+'" r="'+(R*.6)+'" fill="none" stroke="#7C3AED" stroke-width="2"/><text x="105" y="'+(14+R+i*(2*R+gap)+4)+'" text-anchor="middle" font-size="9" font-family="Fredoka,sans-serif" font-weight="700" fill="#7C3AED">'+(i+1)+'</text>';
 s+='</svg>';return s;}
let DMH={};
function dmHeadsStart(){setTheme("kid");DMH={round:0,total:5,ok:0};dmHeadsIntro();}
function dmHeadsIntro(){
 render(topbar("screenDrawMethod()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:8px">📏 Mide con cabezas</h2>'
  +'<p class="center" style="margin-bottom:10px;line-height:1.5">Los que dibujan miden el cuerpo usando la <b>cabeza</b> como regla. Cuenta las cabecitas moradas al lado de cada uno 👉</p>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
   +'<div class="card center"><b>Chibi</b>'+dmHeadsFigure(2)+'<p class="mut" style="font-size:.78rem;margin-top:4px">2 cabezas de alto</p></div>'
   +'<div class="card center"><b>Realista</b>'+dmHeadsFigure(7)+'<p class="mut" style="font-size:.78rem;margin-top:4px">7 cabezas de alto</p></div>'
  +'</div>'
  +'<p class="center" style="margin-top:10px">Los personajes chibi (como los de los dibujos animados) miden 2 o 3 cabezas. Los de proporciones reales miden 6, 7 u 8.</p>'
  +'<button class="kbtn green" onclick="dmHeadsNext()">🎯 ¡Ponme a prueba!</button>');
 speakES("Los que dibujan miden el cuerpo usando la cabeza como regla.");}
function dmHeadsNext(){
 if(DMH.round>=DMH.total)return dmHeadsEnd();
 const chibi=Math.random()<.5,heads=chibi?pick([2,3]):pick([6,7,8]);
 DMH.answered=false;DMH.correct=chibi;
 render(topbar("screenDrawMethod()")
  +'<div class="progressdots">'+dots(DMH.total,DMH.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:8px">📏 Cuenta las cabecitas… ¿chibi o realista?</h2>'
  +'<div class="card center">'+dmHeadsFigure(heads)+'</div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px"><button class="kbtn yellow" style="min-height:56px" onclick="dmHeadsAns(true)">🧸 Chibi</button><button class="kbtn blue" style="min-height:56px" onclick="dmHeadsAns(false)">🧍 Realista</button></div>'
  +'<div id="dmhFb"></div>');}
function dmHeadsAns(said){
 if(DMH.answered)return;DMH.answered=true;
 const ok=said===DMH.correct;recordAnswer("Dibujo",ok,10);
 if(ok){sOK();confetti(8);DMH.ok++;}else sNO();
 document.getElementById("dmhFb").innerHTML='<div class="card" style="margin-top:10px;background:'+(ok?"#DCFCE7":"#FEE2E2")+'"><b>'+(ok?"✅ ¡Sí!":"❌ Casi…")+'</b><p style="margin:6px 0 0">'+(DMH.correct?"Era chibi: 2 o 3 cabezas de alto.":"Era realista: 6, 7 u 8 cabezas de alto.")+'</p></div><button class="kbtn green" onclick="dmHeadsContinue()">Continuar ▶️</button>';}
function dmHeadsContinue(){DMH.round++;dmHeadsNext();}
function dmHeadsEnd(){
 const p=prof();if(DMH.ok>=4){if(!p.drawMethodDone)p.drawMethodDone={};p.drawMethodDone.cabezas=true;}
 p.coins+=2+DMH.ok;p.xp+=8;save();if(DMH.ok>=4){sWIN();confetti(20);}
 nodeWin(starsFor(DMH.ok,DMH.total),"Mide con cabezas");}
