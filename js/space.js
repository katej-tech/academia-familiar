"use strict";
/* ============ CENTRO ESPACIAL (planetario interactivo + misiones + dibuja un planeta) ============
   Pedido: "lo de los planetas no es interactivo ni educativo tampoco, siempre es lo mismo" y
   "agregar un juego para dibujar planetas". El planetario 3D ahora tiene ficha por planeta (datos,
   dato curioso que cambia, pregunta al vuelo) y un RETO (toca el planeta número 3 desde el Sol);
   además hay misiones con decisiones (missions.js) y el juego de dibujar un planeta que se
   envuelve en una esfera 3D (planet3d.js). */

function screenSpace(){setTheme("kid");const p=prof();
 const card=function(cls,ic,t,sub,fn){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenCole()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🪐 Centro espacial</h2>'
  +'<p class="center" style="margin-bottom:12px">Explora, resuelve misiones y crea tus propios planetas</p>'
  +card("blue","🔭","Explora el sistema solar","Toca los planetas, aprende datos y acepta retos","screenPlanetario()")
  +card("green","🗺️","Misiones","Tú decides el camino: rescata a Astro, viaja por el cuerpo…","screenMissions()")
  +card("purple","🎨","Dibuja un planeta","Píntalo y míralo girar en 3D","screenPlanetDrawPick()")
  +card("yellow","❓","Preguntas del espacio","Pon a prueba lo que sabes","playTopics('Espacio',['tierra'],{perTopic:6,topicsPerSession:1,total:6})"));}

/* ---------- 🔭 explorar ---------- */
let PLX={};
function screenPlanetario(){setTheme("kid");
 PLX={mode:null,k:0,ok:0,fi:{}};
 render(topbar("screenSpace()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🔭 Explora el sistema solar</h2>'
  +'<p class="center" id="planetHint" style="margin-bottom:6px;font-family:Fredoka;font-weight:700;color:#3B82F6">👉 Toca el Sol o un planeta</p>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="planet3dCanvas" style="width:100%;height:300px"></div></div>'
  +'<div id="planetCard"></div>'
  +'<button class="kbtn yellow" onclick="planetChallengeStart()">🎯 Reto: ¿en qué orden están?</button>'
  +'<button class="kbtn white" onclick="screenSpace()">← Volver</button>');
 if(typeof render3DPlanets==="function")render3DPlanets("planet3dCanvas",onPlanetSelected);}
function onPlanetSelected(id){
 if(!id)return;
 if(PLX.mode==="orden")return planetChallengeTap(id);
 const box=document.getElementById("planetCard");if(!box)return;
 if(id==="sol"){
  box.innerHTML='<div class="card"><b style="font-size:1.1rem">☀️ El Sol</b><p style="margin:6px 0 0">'+SUN_FACT+'</p><p class="mut" style="font-size:.85rem;margin-top:6px">Es una estrella: su luz y calor hacen posible la vida en la Tierra.</p></div>';
  speakES("El Sol. "+SUN_FACT);return;}
 const p=(window.PLANETS||[]).find(function(x){return x.id===id;});if(!p)return;
 PLX.cur=p;PLX.fi[id]=((PLX.fi[id]===undefined?-1:PLX.fi[id])+1)%p.facts.length;
 const chip=function(ic,l,v){return '<span style="background:#EEF2FF;border-radius:12px;padding:4px 8px;font-size:.8rem;font-weight:700;display:inline-block;margin:2px">'+ic+' '+l+': '+v+'</span>';};
 const order=(window.PLANETS||[]).findIndex(function(x){return x.id===id;})+1;
 box.innerHTML='<div class="card"><b style="font-size:1.15rem">'+(PL_EMOJI[id]||"🪐")+' '+p.nm+'</b> <span class="mut" style="font-size:.85rem">· planeta n.º '+order+' desde el Sol</span>'
  +'<div style="margin:6px 0">'+chip("🧱","Tipo",p.tipo)+chip("🌙","Lunas",p.lunas)+chip("📅","Un año",p.anio)+chip("🌡️","Temperatura",p.temp)+'</div>'
  +'<p style="margin:6px 0;line-height:1.5">💡 '+p.facts[PLX.fi[id]]+'</p>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="kbtn white" style="min-height:48px;font-size:.95rem" onclick="onPlanetSelected(\''+id+'\')">🔄 Otro dato</button>'
  +'<button class="kbtn green" style="min-height:48px;font-size:.95rem" onclick="planetQuiz()">✅ Ponme a prueba</button></div><div id="planetQ"></div></div>';
 speakES(p.nm+". "+p.facts[PLX.fi[id]]);}
function planetQuiz(){
 const p=PLX.cur;if(!p)return;const q=pick(p.q);PLX.q=q;
 PLX.ops=shuffled(q.ops.map(function(o,i){return{t:o,ok:i===q.a};}));PLX.qa=false;
 document.getElementById("planetQ").innerHTML='<p style="font-family:Fredoka;font-weight:700;margin:10px 0 6px">🧩 '+q.q+'</p>'
  +PLX.ops.map(function(o,i){return '<button class="kbtn white" style="min-height:46px;font-size:.95rem;margin-bottom:6px" onclick="planetQuizAns('+i+')">'+o.t+'</button>';}).join("")+'<div id="planetQfb"></div>';}
function planetQuizAns(i){
 if(PLX.qa)return;PLX.qa=true;const ok=PLX.ops[i].ok;recordAnswer("Espacio",ok,10);
 if(ok){sOK();confetti(8);const p=prof();p.coins+=1;save();}else sNO();
 document.getElementById("planetQfb").innerHTML='<p style="font-weight:700;color:'+(ok?"#16A34A":"#DC2626")+'">'+(ok?"✅ ¡Correcto! +1 🪙":"❌ Casi")+'</p><p>💡 '+PLX.q.exp+'</p>';
 speakES(PLX.q.exp);}
/* reto: tocar los planetas en su orden desde el Sol */
function planetChallengeStart(){
 PLX.mode="orden";PLX.k=0;PLX.ok=0;PLX.err=0;
 document.getElementById("planetCard").innerHTML="";
 planetChallengeAsk();}
function planetChallengeAsk(){
 const h=document.getElementById("planetHint");
 if(h)h.innerHTML="🎯 Toca el planeta n.º <b>"+(PLX.k+1)+"</b> contando desde el Sol";
 speakES("Toca el planeta número "+(PLX.k+1)+" contando desde el Sol");}
function planetChallengeTap(id){
 const P=window.PLANETS;
 if(id==="sol"){toast("El Sol es la estrella del centro ☀️ — cuenta desde los planetas",false,1800);return;}
 if(id===P[PLX.k].id){
  sOK();PLX.k++;
  if(PLX.k>=P.length){
   PLX.mode=null;const p=prof();const st=PLX.err<=2?3:PLX.err<=5?2:1;p.coins+=2+st;p.xp+=8;save();confetti(24);sWIN();
   document.getElementById("planetHint").innerHTML="🏆 ¡Ordenaste todos los planetas! ("+PLX.err+" errores) +"+(2+st)+" 🪙";
   speakES("¡Muy bien! Ordenaste todos los planetas.");
   recordAnswer("Espacio",PLX.err<=3,20);return;}
  planetChallengeAsk();
 }else{
  sNO();PLX.err++;const p=P.find(function(x){return x.id===id;});
  const pos=P.findIndex(function(x){return x.id===id;})+1;
  toast((p?p.nm:"Ese")+" es el n.º "+pos+". Busca el n.º "+(PLX.k+1),false,2200);}}

/* ---------- 🎨 dibuja un planeta ---------- */
function planetRefSVG(id,px){
 const P=(window.PLANETS||[]).find(function(x){return x.id===id;});const c=P?P.color:"#8B5CF6";
 let f="";
 if(id==="jupiter")f='<rect x="0" y="34" width="100" height="8" fill="#B5763F" opacity=".8"/><rect x="0" y="52" width="100" height="10" fill="#F1D3A8"/><rect x="0" y="68" width="100" height="7" fill="#B5763F" opacity=".7"/><ellipse cx="62" cy="58" rx="9" ry="5" fill="#C1440E"/>';
 else if(id==="saturno")f='<rect x="0" y="40" width="100" height="8" fill="#C9B27C" opacity=".7"/><rect x="0" y="58" width="100" height="9" fill="#F3E6BE" opacity=".8"/>';
 else if(id==="marte")f='<ellipse cx="34" cy="44" rx="10" ry="6" fill="#8E2F08" opacity=".7"/><ellipse cx="64" cy="64" rx="12" ry="7" fill="#8E2F08" opacity=".6"/><ellipse cx="50" cy="14" rx="14" ry="5" fill="#fff"/>';
 else if(id==="tierra")f='<path d="M22 36q10-10 22-2t2 14-16 4-8-16z" fill="#4CAF50"/><path d="M56 56q12-8 22 2t-2 14-16 0-4-16z" fill="#4CAF50"/><ellipse cx="46" cy="24" rx="12" ry="4" fill="#fff" opacity=".8"/><ellipse cx="66" cy="44" rx="10" ry="3.5" fill="#fff" opacity=".7"/>';
 else if(id==="venus")f='<path d="M6 40q22-14 44 0t44 0" stroke="#F5DD9E" stroke-width="7" fill="none"/><path d="M6 62q22-14 44 0t44 0" stroke="#C99A3E" stroke-width="7" fill="none" opacity=".7"/>';
 else if(id==="mercurio")f='<circle cx="36" cy="42" r="7" fill="#8E877F"/><circle cx="62" cy="58" r="9" fill="#8E877F"/><circle cx="52" cy="30" r="4" fill="#8E877F"/><circle cx="34" cy="66" r="4" fill="#8E877F"/>';
 else if(id==="urano"||id==="neptuno")f='<rect x="0" y="46" width="100" height="6" fill="#fff" opacity=".22"/><rect x="0" y="62" width="100" height="5" fill="#fff" opacity=".15"/>';
 const ring=id==="saturno"?'<ellipse cx="50" cy="50" rx="58" ry="12" fill="none" stroke="#D9C58F" stroke-width="7" transform="rotate(-18 50 50)"/>':'';
 return '<svg viewBox="-10 0 120 100" style="width:'+px+'px;height:'+Math.round(px*.83)+'px"><defs><clipPath id="pc'+id+'"><circle cx="50" cy="50" r="38"/></clipPath><radialGradient id="pg'+id+'" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="'+c+'"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>'
  +'<circle cx="50" cy="50" r="38" fill="'+c+'"/><g clip-path="url(#pc'+id+')">'+f+'</g>'+ring+'<circle cx="50" cy="50" r="38" fill="url(#pg'+id+')"/></svg>';}
function screenPlanetDrawPick(){setTheme("kid");
 const P=window.PLANETS||[];
 const grid=P.map(function(p){return '<button onclick="gamePlanetDraw(\''+p.id+'\')" style="border:3px solid var(--kid-ink);border-radius:14px;background:#0B1120;color:#fff;padding:6px;box-shadow:0 4px 0 rgba(30,42,74,.5)">'+planetRefSVG(p.id,70)+'<div style="font-size:.78rem;font-family:Fredoka;font-weight:700">'+p.nm+'</div></button>';}).join("");
 render(topbar("screenSpace()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">🎨 Dibuja un planeta</h2>'
  +'<p class="center" style="margin-bottom:10px">Elige uno para copiarlo, o inventa el tuyo</p>'
  +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+grid+'</div>'
  +'<button class="kbtn purple" style="margin-top:14px" onclick="gamePlanetDraw(\'libre\')">✨ Inventar mi propio planeta</button>');}
let PD={};
function gamePlanetDraw(id){setTheme("kid");
 const P=(window.PLANETS||[]).find(function(x){return x.id===id;});
 PD={id:id,color:"#EF4444",brush:14,base:P?P.color:"#8B5CF6",name:P?P.nm:"tu planeta",ring:id==="saturno",p:P};
 const hint=P?('Se pinta de <b>'+P.tipo.toLowerCase()+'</b>: mira sus colores y cópialos.'):'Inventa colores, bandas, manchas, anillos…';
 render(topbar("screenPlanetDrawPick()")
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:2px">🎨 '+(P?P.nm:"Mi planeta")+'</h2>'
  +'<div class="center" style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:6px">'+(P?'<div style="background:#0B1120;border-radius:14px;padding:4px">'+planetRefSVG(id,86)+'</div>':'<span style="font-size:2.4rem">🪐</span>')+'<p class="mut" style="font-size:.85rem;max-width:210px;margin:0">'+hint+'<br>Tu dibujo es el <b>mapa</b>: se enrolla en una esfera.</p></div>'
  +'<canvas id="pdcanvas" style="width:100%;max-width:440px;aspect-ratio:2/1;display:block;margin:0 auto;border:3px solid var(--kid-ink);border-radius:14px;touch-action:none;background:'+PD.base+'"></canvas>'
  +'<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0">'+COLOR_PALETTE.concat(["#7C3AED","#06B6D4","#0EA5E9"]).map(function(c){return '<button type="button" onclick="pdColor(\''+c+'\')" style="width:34px;height:34px;border-radius:50%;border:3px solid #fff;background:'+c+';box-shadow:0 3px 8px rgba(30,42,74,.25)"></button>';}).join("")+'</div>'
  +'<div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px"><button class="kbtn white" style="width:auto;min-height:44px;padding:8px 14px" onclick="PD.brush=6">✏️ Fino</button><button class="kbtn white" style="width:auto;min-height:44px;padding:8px 14px" onclick="PD.brush=16">🖌️ Medio</button><button class="kbtn white" style="width:auto;min-height:44px;padding:8px 14px" onclick="PD.brush=34">🧹 Grueso</button></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:440px;margin:0 auto">'
   +'<button class="kbtn yellow" onclick="pdClear()" style="min-height:52px">🧽 De nuevo</button>'
   +'<button class="kbtn white" id="pdRingBtn" onclick="pdRing()" style="min-height:52px">💍 Anillos: '+(PD.ring?"sí":"no")+'</button></div>'
  +'<button class="kbtn green" style="max-width:440px;margin:10px auto 0" onclick="pdFinish()">🌍 ¡Listo! Verlo girar en 3D</button>');
 const cv=document.getElementById("pdcanvas");const r=cv.getBoundingClientRect();
 cv.width=800;cv.height=400;const ctx=cv.getContext("2d");ctx.lineCap="round";ctx.lineJoin="round";
 ctx.fillStyle=PD.base;ctx.fillRect(0,0,800,400);PD.ctx=ctx;PD.cv=cv;PD.drawing=false;
 const pos=function(e){const b=cv.getBoundingClientRect();return{x:(e.clientX-b.left)/b.width*800,y:(e.clientY-b.top)/b.height*400};};
 cv.addEventListener("pointerdown",function(e){PD.drawing=true;const p=pos(e);ctx.strokeStyle=PD.color;ctx.lineWidth=PD.brush;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.1,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);try{cv.setPointerCapture(e.pointerId);}catch(_){}});
 cv.addEventListener("pointermove",function(e){if(!PD.drawing)return;const p=pos(e);ctx.strokeStyle=PD.color;ctx.lineWidth=PD.brush;ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);});
 const stop=function(){PD.drawing=false;};cv.addEventListener("pointerup",stop);cv.addEventListener("pointercancel",stop);}
function pdColor(c){PD.color=c;}
function pdClear(){PD.ctx.fillStyle=PD.base;PD.ctx.fillRect(0,0,800,400);}
function pdRing(){PD.ring=!PD.ring;const b=document.getElementById("pdRingBtn");if(b)b.textContent="💍 Anillos: "+(PD.ring?"sí":"no");}
function pdFinish(){
 let url;try{url=PD.cv.toDataURL("image/png");}catch(e){return;}
 sWIN();confetti(16);const p=prof();p.coins+=3;p.xp+=6;if(typeof artPlus==="function")artPlus();save();
 const P=PD.p;
 render(topbar("screenPlanetDrawPick()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🌍 ¡Tu planeta'+(P?" "+P.nm:"")+'! +3 🪙</h2>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="drawnPlanet3d" style="width:100%;height:280px"></div></div>'
  +(P?'<div class="card"><b>💡 ¿Sabías qué?</b><p style="margin:6px 0 0">'+pick(P.facts)+'</p></div>':'<div class="card"><b>💡 ¡Qué planeta tan original!</b><p style="margin:6px 0 0">Los planetas de verdad pueden ser rocosos, de gas o de hielo. ¿De qué sería el tuyo?</p></div>')
  +'<button class="kbtn white" style="margin-top:10px" onclick="screenPlanetDrawPick()">🔁 Dibujar otro</button>'
  +'<button class="kbtn green" style="margin-top:10px" onclick="screenSpace()">← Al centro espacial</button>');
 if(typeof render3DDrawnPlanet==="function")render3DDrawnPlanet("drawnPlanet3d",url,PD.ring);}
