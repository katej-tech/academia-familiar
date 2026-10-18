"use strict";
/* ============ RINCÓN DE LA CALMA (ira y frustración) ============
   Contexto: el niño se frustra cuando quiere terminar algo y no le sale, le da rabia y patea cosas.
   Principios que sigue este módulo (psicología infantil básica, NO es terapia):
   - Toda emoción está bien; lo que se regula es la ACCIÓN (se puede estar furioso, no se patea).
   - Calmar el cuerpo primero (respiración lenta), enseñar después.
   - Poner nombre a la emoción (termómetro de 1 a 5) y tener un PLAN acordado de antemano.
   - Salidas seguras para la energía (apretar, empujar la pared, saltos, almohada).
   - Premiar USAR la estrategia (monedas), no solo ganar.
   Piezas: respiración con un planeta 3D que respira (planetchar3d), termómetro de enojo con
   estrategias por nivel, "mi plan de calma", panel para papás, botón 🌬️ en la barra de todas las
   pantallas del perfil infantil y una pausa AUTOMÁTICA tras 4 respuestas seguidas equivocadas.
   Prefijo calm / CALM. */

const CALM_LV=[
 {l:1,e:"😊",nm:"Tranquilo",col:"#22C55E"},{l:2,e:"😕",nm:"Un poquito molesto",col:"#84CC16"},{l:3,e:"😠",nm:"Enojado",col:"#F59E0B"},
 {l:4,e:"😡",nm:"Muy enojado",col:"#F97316"},{l:5,e:"🤬",nm:"¡Furioso!",col:"#EF4444"}];
const CALM_S=[
 {id:"resp",e:"🌬️",t:"Respirar con el planeta",d:"Cinco respiraciones lentas, como el planeta.",kind:"breathe"},
 {id:"cuenta",e:"🔟",t:"Contar hasta 10 despacio",d:"Cuenta conmigo, despacito.",secs:10,say:"Uno… dos… tres… cuatro… cinco… seis… siete… ocho… nueve… diez."},
 {id:"agua",e:"💧",t:"Tomar agua",d:"Ve por un vaso de agua y bébelo despacio, a sorbitos.",secs:0},
 {id:"manos",e:"✊",t:"Apretar y soltar",d:"Aprieta los puños MUY fuerte… y suelta.",secs:5,say:"Aprieta fuerte, fuerte, fuerte… ¡y suelta!"},
 {id:"almohada",e:"🛏️",t:"Golpear una almohada",d:"Una almohada sí se puede golpear. ¡Saca la rabia!",secs:10},
 {id:"saltos",e:"🐸",t:"Saltos de rana",d:"Salta como una rana, bien fuerte.",secs:10},
 {id:"pared",e:"🧱",t:"Empujar la pared",d:"Empuja la pared con las dos manos todo lo que puedas.",secs:10,say:"Empuja, empuja, empuja… ¡y descansa!"},
 {id:"palabras",e:"🗣️",t:"Decir cómo me siento",d:"Dile a un adulto: «Estoy muy enojado porque…».",secs:0},
 {id:"rincon",e:"⛺",t:"Ir a mi rincón de calma",d:"Un lugar tranquilo con tus peluches. Vuelves cuando estés listo.",secs:0},
 {id:"abrazo",e:"🤗",t:"Pedir un abrazo",d:"Pide un abrazo a mamá o a papá.",secs:0},
 {id:"dibujo",e:"✏️",t:"Dibujar mi enojo",d:"Haz garabatos fuertes en una hoja: ¡todo el enojo en el papel!",secs:0}];
const CALM_BY_LV={1:["resp","cuenta"],2:["resp","agua","palabras"],3:["manos","resp","almohada"],4:["saltos","pared","rincon"],5:["rincon","almohada","abrazo"]};
const CALM_SAY={1:"Qué bueno que estés tranquilo.",2:"Está bien sentirse un poquito molesto. Vamos a cuidarlo.",3:"Está bien estar enojado. Vamos a calmar el cuerpo.",4:"Estás muy enojado y es normal. Primero el cuerpo, después hablamos.",5:"Estás furioso. Es una emoción fuerte y puedes con ella. Aléjate un poco y pide ayuda."};
let CALM={timers:[],run:0};

function calmCleanup(){CALM.run++;CALM.timers.forEach(clearTimeout);CALM.timers=[];if(CALM.raf)cancelAnimationFrame(CALM.raf);CALM.raf=null;try{window.speechSynthesis.cancel();}catch(e){}}
function calmLater(fn,ms){const run=CALM.run,t=setTimeout(function(){if(run===CALM.run)fn();},ms);CALM.timers.push(t);return t;}
function calmLog(entry){const p=prof();if(!p.feelLog)p.feelLog=[];entry.t=Date.now();p.feelLog.push(entry);if(p.feelLog.length>200)p.feelLog.shift();save();}
function calmPlanIds(){const p=prof();return Array.isArray(p.calmPlan)?p.calmPlan:[];}
function calmStrat(id){return CALM_S.find(function(s){return s.id===id;});}
function calmReward(){
 /* premia USAR la herramienta (máx. 3 veces al día), no solo ganar */
 const p=prof(),d=new Date().toISOString().slice(0,10);
 if(p.calmRewardDay!==d){p.calmRewardDay=d;p.calmRewardN=0;}
 if((p.calmRewardN||0)<3){p.calmRewardN=(p.calmRewardN||0)+1;p.coins+=3;save();return true;}
 return false;}
function calmCard(cls,ic,t,sub,fn){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+sub+'</span></span></button>';}

/* ---------- rincón de la calma ---------- */
function screenCalm(){setTheme("kid");
 calmCleanup();
 render(topbar("screenKidMap()")+subHeader("💙 Mi rincón de la calma")
  +'<div class="card center" style="background:#EFF6FF"><div style="font-size:3rem">🫶</div><p style="margin:4px 0 0;line-height:1.5;font-size:1.02rem"><b>Todas las emociones están bien.</b><br>Lo importante es qué hacemos con el enojo: <b>sin patear ni golpear cosas o personas</b>.</p></div>'
  +calmCard("red","🌡️","Estoy enojado o frustrado","Dime cuánto y te muestro qué hacer","calmThermo()")
  +calmCard("blue","🌬️","Respirar con el planeta","Un planeta 3D que respira contigo","calmBreathe()")
  +(typeof screenEmotions==="function"?calmCard("yellow","🪐","Planeta de las emociones","Un planeta vive situaciones como las del cole","screenEmotions()"):"")
  +(typeof screenRoutine==="function"?calmCard("yellow","📅","Mi día: ahora y después","Sé qué viene y recibo avisos antes de cambiar","screenRoutine()"):"")
  +calmCard("green","⭐","Mi plan de calma","Elige tus 3 trucos favoritos","calmPlan()")
  +calmCard("white","👨‍👩‍👦","Para mamá y papá","Consejos y cómo me he sentido","calmParents()"));}

/* ---------- 🌡️ termómetro ---------- */
function calmThermo(){setTheme("kid");
 calmCleanup();
 render(topbar("screenCalm()")+subHeader("🌡️ ¿Cuánto enojo tengo?")
  +'<p class="center" style="margin:-4px 0 10px">Toca la cara que se parece a cómo te sientes ahora</p>'
  +CALM_LV.slice().reverse().map(function(L){return '<button onclick="calmStrategies('+L.l+')" style="display:flex;align-items:center;gap:14px;width:100%;margin-bottom:10px;padding:12px 16px;border-radius:18px;border:4px solid '+L.col+';background:#fff;font-family:Fredoka;font-weight:700;font-size:1.2rem;cursor:pointer;color:#1E293B"><span style="font-size:2.4rem">'+L.e+'</span><span style="flex:1;text-align:left">'+L.nm+'</span><span style="width:'+(L.l*18)+'px;height:14px;border-radius:7px;background:'+L.col+'"></span></button>';}).join(""));}
function calmStrategies(level){setTheme("kid");
 calmCleanup();
 const L=CALM_LV[level-1],plan=calmPlanIds();
 const base=CALM_BY_LV[level].slice();
 const ids=plan.filter(function(x){return level>=3||x==="resp"||x==="cuenta"||x==="agua"||x==="palabras";}).concat(base).filter(function(x,i,a){return a.indexOf(x)===i;}).slice(0,5);
 render(topbar("calmThermo()")+subHeader(L.e+' '+L.nm)
  +'<div class="card center" style="border:3px solid '+L.col+'"><p style="margin:0;line-height:1.5">'+CALM_SAY[level]+'</p></div>'
  +'<p class="appsec">Elige uno y lo hacemos juntos</p>'
  +ids.map(function(id){const s=calmStrat(id);return calmCard(plan.indexOf(id)>=0?"yellow":"white",s.e,s.t+(plan.indexOf(id)>=0?" ⭐":""),s.d,"calmDo('"+id+"',"+level+")");}).join("")
  +(level>=4?'<div class="card" style="background:#FEE2E2"><b>🤗 Si sigues muy enojado:</b> busca a mamá o a papá y diles «necesito ayuda para calmarme». Pedir ayuda es de valientes.</div>':""));
 calmLog({l:level});
 speakES(CALM_SAY[level]);}
function calmDo(id,level){
 const s=calmStrat(id);if(!s)return;
 if(s.kind==="breathe")return calmBreathe(level);
 calmCleanup();
 render(topbar("calmStrategies("+level+")")+subHeader(s.e+' '+s.t)
  +'<div class="card center"><p style="margin:0;font-size:1.15rem;line-height:1.5">'+s.d+'</p></div>'
  +(s.secs?'<div class="card center"><div id="calmCount" style="font-family:Fredoka;font-weight:700;font-size:5rem;color:#2563EB">'+s.secs+'</div><button class="kbtn green" onclick="calmCountdown(\''+id+'\','+level+')">▶ ¡Hagámoslo!</button></div>':'<button class="kbtn green" onclick="calmFeel('+level+')">✅ Ya lo hice</button>')
  +'<button class="kbtn white" onclick="calmStrategies('+level+')">← Elegir otra cosa</button>');
 speakES(s.d);}
function calmCountdown(id,level){
 const s=calmStrat(id);let n=s.secs;const el=document.getElementById("calmCount");
 if(s.say)speakES(s.say);
 const tick=function(){n--;if(el)el.textContent=n>0?n:"✔";if(n>0)calmLater(tick,1000);else calmLater(function(){calmFeel(level);},700);};
 calmLater(tick,1000);}
function calmFeel(level){setTheme("kid");
 calmCleanup();
 render(topbar("screenCalm()")+subHeader("¿Cómo estás ahora?")
  +'<p class="center" style="margin:-4px 0 10px">Toca la cara que se parece a ti</p>'
  +CALM_LV.map(function(L){return '<button onclick="calmAfter('+level+','+L.l+')" style="display:flex;align-items:center;gap:14px;width:100%;margin-bottom:8px;padding:10px 16px;border-radius:18px;border:4px solid '+L.col+';background:#fff;font-family:Fredoka;font-weight:700;font-size:1.1rem;cursor:pointer;color:#1E293B"><span style="font-size:2rem">'+L.e+'</span>'+L.nm+'</button>';}).join(""));}
function calmAfter(from,to){
 calmLog({l:from,after:to});
 const better=to<from||to<=2,got=calmReward();
 render(topbar("screenCalm()")
  +'<div class="card center" style="padding:20px"><div style="font-size:4rem">'+(better?"🌟":"💙")+'</div><h2 style="margin:6px 0">'+(better?"¡Lo lograste!":"Gracias por intentarlo")+'</h2>'
  +'<p style="line-height:1.5;margin:0">'+(better?"Usaste tu cabeza y tu cuerpo para calmarte. Eso es muy difícil y lo hiciste.":"A veces el enojo tarda un poco en irse. Eso es normal. Puedes probar otra cosa o pedir un abrazo.")+'</p>'
  +(got?'<p style="margin:10px 0 0;font-weight:800;color:#16A34A">+3 🪙 por cuidar tus emociones</p>':'')+'</div>'
  +(better?'':'<button class="kbtn yellow" onclick="calmStrategies('+Math.max(1,to)+')">Probar otra cosa</button>')
  +'<button class="kbtn green" onclick="screenKidMap()">Volver a jugar 🎮</button>');
 speakES(better?"¡Lo lograste! Qué orgullo.":"Gracias por intentarlo. Estoy contigo.");}

/* ---------- 🌬️ respirar con el planeta (3D) ---------- */
function calmBreathe(level){setTheme("kid");
 calmCleanup();
 render(topbar(level?"calmStrategies("+level+")":"screenCalm()")+subHeader("🌬️ Respira con el planeta")
  +'<div class="card center" style="padding:0;overflow:hidden;border-radius:18px"><div id="calmPlanet" style="width:100%;height:clamp(250px,42vh,330px)"></div></div>'
  +'<div class="card center"><div id="calmCue" style="font-family:Fredoka;font-weight:700;font-size:1.6rem;color:#2563EB;min-height:2.4rem">Prepárate…</div><div id="calmDots" class="progressdots" style="margin-top:6px"></div></div>'
  +'<button class="kbtn white" onclick="calmCleanup();screenCalm()">← Salir</button>');
 const ctrl=typeof renderPlanetChar==="function"?renderPlanetChar("calmPlanet",Object.assign({},window.PLANET_PRESETS.tierra,{face:"feliz"}),{}):null;
 const run=CALM.run,CYC=5,IN=4000,HOLD=1500,OUT=6000,T=IN+HOLD+OUT,t0=performance.now()+1500;
 const ease=function(x){return x*x*(3-2*x);};
 const cueEl=function(){return document.getElementById("calmCue");},dotsEl=function(){return document.getElementById("calmDots");};
 let phase="";
 (function loop(){
  if(run!==CALM.run)return;
  const t=performance.now()-t0;
  if(t<0){CALM.raf=requestAnimationFrame(loop);return;}
  const cyc=Math.floor(t/T);
  if(cyc>=CYC){if(ctrl)ctrl.breath(1);calmBreatheDone(level);return;}
  const u=t-cyc*T;let v,ph;
  if(u<IN){v=.92+.33*ease(u/IN);ph="in";}
  else if(u<IN+HOLD){v=1.25;ph="hold";}
  else{v=1.25-.33*ease((u-IN-HOLD)/OUT);ph="out";}
  if(ctrl)ctrl.breath(v);
  if(ph!==phase){phase=ph;const c=cueEl();if(c)c.textContent=ph==="in"?"Inhala por la nariz… 🌬️":ph==="hold"?"Sostén el aire…":"Suelta despacito por la boca… 💨";}
  const d=dotsEl();if(d)d.innerHTML=Array.from({length:CYC},function(_,i){return '<i class="'+(i<cyc?"on":"")+'"></i>';}).join("");
  CALM.raf=requestAnimationFrame(loop);})();}
function calmBreatheDone(level){
 const c=document.getElementById("calmCue");if(c)c.textContent="¡Muy bien! 💙";
 speakES("Muy bien. Tu cuerpo se está calmando.");
 calmLater(function(){calmFeel(level||3);},1500);}

/* ---------- ⭐ mi plan de calma ---------- */
function calmPlan(){setTheme("kid");
 calmCleanup();
 const plan=calmPlanIds();
 render(topbar("screenCalm()")+subHeader("⭐ Mi plan de calma")
  +'<p class="center" style="margin:-4px 0 10px">Elige hasta <b>3</b> cosas que te ayudan. Las pondré primero cuando te enojes.</p>'
  +CALM_S.map(function(s){const on=plan.indexOf(s.id)>=0;return '<button onclick="calmTogglePlan(\''+s.id+'\')" style="display:flex;align-items:center;gap:12px;width:100%;margin-bottom:8px;padding:10px 14px;border-radius:16px;border:3px solid '+(on?"#EAB308":"#E2E8F0")+';background:'+(on?"#FEF9C3":"#fff")+';text-align:left;cursor:pointer;color:#1E293B"><span style="font-size:1.8rem">'+s.e+'</span><span style="flex:1"><b>'+s.t+'</b><br><span style="font-size:.78rem;opacity:.75">'+s.d+'</span></span><span style="font-size:1.4rem">'+(on?"⭐":"☆")+'</span></button>';}).join("")
  +'<button class="kbtn green" onclick="screenCalm()">✅ Listo</button>');}
function calmTogglePlan(id){
 const p=prof();let plan=calmPlanIds().slice();const k=plan.indexOf(id);
 if(k>=0)plan.splice(k,1);else{if(plan.length>=3){toast("Máximo 3 favoritos. Quita uno primero 🙂",false,1600);return;}plan.push(id);}
 p.calmPlan=plan;save();calmPlan();}

/* ---------- 👨‍👩‍👦 para mamá y papá ---------- */
function calmParents(){setTheme("kid");
 calmCleanup();
 const p=prof(),log=p.feelLog||[],now=Date.now(),days=[];
 for(let i=6;i>=0;i--){const d0=new Date(now-i*86400000);const key=d0.toISOString().slice(0,10);
  const day=log.filter(function(x){return new Date(x.t).toISOString().slice(0,10)===key;});
  days.push({k:key,wd:["D","L","M","M","J","V","S"][d0.getDay()],uses:day.length,high:day.filter(function(x){return x.l>=4;}).length});}
 const maxU=Math.max(1,Math.max.apply(null,days.map(function(d){return d.uses;})));
 const after=log.filter(function(x){return x.after;}),better=after.filter(function(x){return x.after<x.l||x.after<=2;}).length;
 render(topbar("screenCalm()")+subHeader("👨‍👩‍👦 Para mamá y papá")
  +'<div class="card"><b>📊 Últimos 7 días</b><div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:8px">'+days.map(function(d){return '<div style="flex:1;text-align:center;font-size:.7rem"><div style="height:'+Math.max(4,Math.round(d.uses/maxU*64))+'px;background:'+(d.high?"#F97316":"#60A5FA")+';border-radius:6px 6px 0 0"></div>'+d.wd+'<br><b>'+d.uses+'</b></div>';}).join("")+'</div><p class="mut" style="margin:6px 0 0;font-size:.82rem">Cada barra = veces que usó la calma. Naranja = hubo momentos de enojo alto (4-5).'+(after.length?' Se sintió mejor después en <b>'+better+' de '+after.length+'</b> ocasiones.':'')+'</p></div>'
  +'<button class="kbtn purple" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="screenABC()"><span style="font-size:2rem">📝</span><span style="flex:1"><span>Registro para la psicóloga</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">Anota qué pasó antes, qué hizo y qué pasó después</span></span></button>'
  +'<div class="card"><b>🔔 Pausa automática</b><p style="margin:4px 0 8px;font-size:.88rem;line-height:1.45">Si falla 4 respuestas seguidas, la app le ofrece respirar un momento antes de seguir.</p><button class="kbtn '+(p.calmWatch===false?"white":"green")+'" style="min-height:48px;font-size:.95rem" onclick="calmToggleWatch()">'+(p.calmWatch===false?"Desactivada · tocar para activar":"Activada ✓ · tocar para desactivar")+'</button></div>'
  +'<div class="card" style="line-height:1.55;font-size:.93rem"><b>💡 Ideas que suelen ayudar</b><ul style="margin:6px 0 0;padding-left:18px">'
  +'<li><b>Primero calmar, después enseñar.</b> En plena rabia el niño no puede razonar. Espera a que baje el enojo.</li>'
  +'<li><b>Ponerle nombre:</b> «Veo que estás frustrado porque quieres terminar». Sentirse entendido baja la intensidad.</li>'
  +'<li><b>Límite claro y amable:</b> «Puedes estar furioso. No puedes patear cosas ni a personas. Puedes golpear la almohada».</li>'
  +'<li><b>Acordar el plan cuando está tranquilo</b> (pestaña ⭐ Mi plan de calma) y recordarlo antes de las actividades difíciles.</li>'
  +'<li><b>Avisar los finales:</b> «En 5 minutos terminamos». Dividir tareas largas en partes pequeñas y celebrar cada parte.</li>'
  +'<li><b>Si no termina, guardar:</b> «Lo dejamos listo y lo terminas después». Terminar no tiene que ser ahora.</li>'
  +'<li><b>Elogiar el esfuerzo y el intento</b> («me gustó que respiraste»), no solo el resultado.</li>'
  +'<li><b>Tú también regulas:</b> tu calma es su modelo. Respirar juntos funciona.</li></ul></div>'
  +'<div class="card" style="background:#FEF3C7;line-height:1.5;font-size:.9rem"><b>🩺 Cuándo pedir ayuda profesional</b><p style="margin:4px 0 0">Consulta con un psicólogo infantil o con su pediatra si las explosiones son muy frecuentes (varias por semana), muy intensas o largas, si se lastima o lastima a otros, si rompe cosas con frecuencia o si afectan el colegio o la convivencia. Esta app es un apoyo cotidiano; <b>no reemplaza</b> la ayuda de un profesional.</p></div>'
  +'<button class="kbtn white" onclick="screenCalm()">← Volver</button>');}
function calmToggleWatch(){const p=prof();p.calmWatch=p.calmWatch===false?true:false;save();calmParents();}

/* ---------- 🌬️ pausa rápida (superpuesta: sirve en cualquier pantalla sin perder el juego) ---------- */
function calmOverlay(reason){
 if(document.getElementById("calmOv"))return;
 const run=++CALM.run;
 const d=document.createElement("div");d.id="calmOv";
 d.style.cssText="position:fixed;inset:0;z-index:300;background:rgba(15,23,42,.74);display:flex;align-items:center;justify-content:center;padding:16px";
 d.innerHTML='<div style="background:#fff;border-radius:24px;max-width:420px;width:100%;padding:18px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.4)">'
  +'<div id="calmOvT" style="font-family:Fredoka;font-weight:700;font-size:1.2rem;line-height:1.3">'+(reason==="auto"?"Parece difícil. ¿Respiramos un momento? 💙":"Respiremos juntos 💙")+'</div>'
  +'<div style="height:190px;display:flex;align-items:center;justify-content:center"><div id="calmOvBall" style="font-size:6.5rem;line-height:1;animation:calmBreath 11.5s ease-in-out infinite">🌍</div></div>'
  +'<div id="calmOvCue" style="font-family:Fredoka;font-weight:700;font-size:1.5rem;color:#2563EB;min-height:2.2rem">Cuando estés listo, toca el botón</div>'
  +'<div id="calmOvB" style="margin-top:10px"></div></div>';
 document.body.appendChild(d);
 const B=function(h){const b=document.getElementById("calmOvB");if(b)b.innerHTML=h;};
 const cue=function(t){const c=document.getElementById("calmOvCue");if(c)c.textContent=t;};
 const close=function(){const o=document.getElementById("calmOv");if(o)o.remove();};
 window.calmOvClose=close;
 B('<button class="kbtn green" style="margin:0 0 8px" onclick="calmOvStart()">🌬️ Respirar 3 veces</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem" onclick="calmOvClose()">Seguir sin pausa</button>');
 window.calmOvStart=function(){
  const ball=document.getElementById("calmOvBall");if(ball){ball.style.animation="none";void ball.offsetWidth;ball.style.animation="calmBreath 11.5s ease-in-out 3";}
  B('<span class="mut" style="font-size:.85rem">Sigue la bola: crece al inhalar, se achica al soltar</span>');
  let c=0;
  const cycle=function(){
   if(run!==CALM.run||!document.getElementById("calmOv"))return;
   if(c>=3)return finish();
   cue("Inhala por la nariz… 🌬️");
   CALM.timers.push(setTimeout(function(){if(run!==CALM.run)return;cue("Sostén el aire…");},4000));
   CALM.timers.push(setTimeout(function(){if(run!==CALM.run)return;cue("Suelta despacito… 💨");},5500));
   CALM.timers.push(setTimeout(function(){c++;cycle();},11500));};
  cycle();};
 const finish=function(){
  if(run!==CALM.run)return;
  cue("¡Muy bien! 💙");const t=document.getElementById("calmOvT");if(t)t.textContent="¿Cómo te sientes ahora?";
  B('<div style="display:flex;gap:8px"><button class="kbtn white" style="margin:0;font-size:1.8rem;min-height:64px" onclick="calmOvFeel(1)">😊</button><button class="kbtn white" style="margin:0;font-size:1.8rem;min-height:64px" onclick="calmOvFeel(2)">😐</button><button class="kbtn white" style="margin:0;font-size:1.8rem;min-height:64px" onclick="calmOvFeel(3)">😠</button></div>');};
 window.calmOvFeel=function(k){
  calmLog({l:reason==="auto"?3:2,after:k===1?1:k===2?3:5,src:"overlay"});
  const got=calmReward();
  if(k===1){cue("¡Qué bien! Seguimos 🌟"+(got?" +3 🪙":""));B('<button class="kbtn green" style="margin:0" onclick="calmOvClose()">Seguir jugando 🎮</button>');}
  else{cue(k===2?"Está bien. Podemos probar otra cosa.":"Es normal. Vamos a tu rincón.");B('<button class="kbtn yellow" style="margin:0 0 8px" onclick="calmOvClose();screenCalm()">💙 Ir a mi rincón de la calma</button><button class="kbtn white" style="margin:0;min-height:44px;font-size:.9rem" onclick="calmOvClose()">Seguir jugando</button>');}};};

/* ---------- detector de frustración: 4 errores seguidos ---------- */
const CALMW={streak:0,last:0};
function calmWatch(correct){
 const p=prof();if(!p||p.calmWatch===false||(typeof profType==="function"&&profType()!=="kid"))return;
 if(correct){CALMW.streak=0;return;}
 CALMW.streak++;
 const now=Date.now();
 if(CALMW.streak>=4&&now-CALMW.last>15*60000&&!document.getElementById("calmOv")){CALMW.last=now;CALMW.streak=0;setTimeout(function(){calmOverlay("auto");},900);}}

/* ============ REGISTRO PARA LA PSICÓLOGA (modelo A-B-C: antes · conducta · después) ============
   Para papás: anotar cada episodio en 1 minuto. A una psicóloga infantil le sirve para ver QUÉ lo dispara
   (antecedente), CÓMO reacciona (conducta, intensidad, duración) y QUÉ pasa después (consecuencia).
   Los datos quedan en el perfil; se pueden copiar o imprimir para llevarlos a la consulta. */
const ABC_PLACES=["🏠 Casa","🏫 Colegio","🚌 Ruta","📍 Otro lugar"];
const ABC_DID=["Gritó","Pateó cosas","Lloró mucho","Dijo cosas hirientes («los odio»)","Rompió o tiró algo","Golpeó a alguien","Se encerró o se fue","Se quedó callado y tenso"];
let ABCF={};
function abcList(){const p=prof();if(!p.abcLog)p.abcLog=[];return p.abcLog;}
function abcDate(t){const d=new Date(t);return d.toLocaleDateString("es-CO",{day:"2-digit",month:"short"})+" "+d.toLocaleTimeString("es-CO",{hour:"2-digit",minute:"2-digit"});}
function screenABC(){setTheme("kid");
 calmCleanup();
 const l=abcList();
 render(topbar("calmParents()")+subHeader("📝 Registro para la psicóloga")
  +'<div class="card" style="font-size:.92rem;line-height:1.5">Anota cada episodio en 1 minuto: <b>qué pasó antes</b>, <b>qué hizo</b> y <b>qué pasó después</b>. Con unas semanas de registro, una psicóloga infantil puede ver qué lo dispara y qué le ayuda.</div>'
  +'<button class="kbtn green" onclick="abcNew()">➕ Anotar un episodio</button>'
  +(l.length?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="kbtn white" style="margin:0;min-height:48px;font-size:.9rem" onclick="abcCopy()">📋 Copiar resumen</button><button class="kbtn white" style="margin:0;min-height:48px;font-size:.9rem" onclick="abcPrint()">🖨️ Imprimir</button></div>':"")
  +l.slice(0,15).map(function(x,i){return '<div class="card" style="margin-top:10px;font-size:.88rem;line-height:1.45"><b>'+abcDate(x.t)+'</b> · '+esc(x.place)+' · intensidad '+x.int+'/5'+(x.mins?' · '+x.mins+' min':'')+'<br><b>Antes:</b> '+esc(x.a||"—")+'<br><b>Hizo:</b> '+esc((x.did||[]).join(", ")||"—")+'<br><b>Después:</b> '+esc(x.c||"—")+(x.h?'<br><b>Ayudó:</b> '+esc(x.h):"")+'<br><button onclick="abcDel('+i+')" style="margin-top:4px;border:0;background:none;color:#DC2626;font-weight:700;cursor:pointer">🗑️ borrar</button></div>';}).join("")
  +'<div class="card" style="margin-top:12px;background:#EFF6FF;font-size:.88rem;line-height:1.5"><b>❓ Preguntas para llevar a la consulta</b><ul style="margin:6px 0 0;padding-left:18px"><li>¿Estas reacciones son esperables a su edad o hay que trabajarlas más?</li><li>¿Qué estrategias me recomienda para el momento de la rabia y para después?</li><li>¿Conviene hacer evaluación (atención, ansiedad, regulación emocional)?</li><li>¿Cómo coordinamos con el colegio y con el transporte escolar para el momento de la ruta?</li><li>¿Cada cuánto debemos volver y qué hacemos en casa entre sesiones?</li></ul></div>'
  +'<button class="kbtn white" onclick="calmParents()">← Volver</button>');}
function abcNew(){setTheme("kid");
 ABCF={place:"",did:[],int:0,mins:"",a:"",c:"",h:""};
 const chip=function(on,t,fn){return '<button onclick="'+fn+'" style="margin:3px;padding:8px 12px;border-radius:14px;border:3px solid '+(on?"#3B82F6":"#E2E8F0")+';background:'+(on?"#DBEAFE":"#fff")+';font-weight:700;font-size:.9rem;cursor:pointer;color:#1E293B">'+t+'</button>';};
 render(topbar("screenABC()")+subHeader("📝 Nuevo episodio")
  +'<div class="card"><b>¿Dónde fue?</b><div>'+ABC_PLACES.map(function(x){return chip(ABCF.place===x,x,"abcSet('place',this.dataset.v)").replace('<button ','<button data-v="'+x+'" ');}).join("")+'</div></div>'
  +'<div class="card"><b>1. ANTES: ¿qué pasó justo antes?</b><textarea id="abcA" rows="2" placeholder="Ej: llegó la ruta y no lo dejaron seguir jugando" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-family:Nunito,sans-serif"></textarea></div>'
  +'<div class="card"><b>2. ¿Qué hizo?</b> <span class="mut" style="font-size:.82rem">(puedes marcar varias)</span><div id="abcDid">'+ABC_DID.map(function(x,i){return chip(false,x,"abcDid("+i+")");}).join("")+'</div></div>'
  +'<div class="card"><b>¿Qué tan fuerte fue?</b><div style="display:flex;gap:6px;margin-top:6px">'+[1,2,3,4,5].map(function(n){return '<button id="abcI'+n+'" onclick="abcInt('+n+')" style="flex:1;padding:10px 0;border-radius:12px;border:3px solid #E2E8F0;background:#fff;font-family:Fredoka;font-weight:700;font-size:1.1rem;cursor:pointer;color:#1E293B">'+n+'</button>';}).join("")+'</div><div style="margin-top:8px"><b>¿Cuántos minutos duró?</b> <input id="abcM" type="number" min="0" max="180" style="width:80px;padding:6px;border-radius:10px;border:2px solid #E2E8F0;margin-left:6px"></div></div>'
  +'<div class="card"><b>3. DESPUÉS: ¿qué pasó y qué hicimos los adultos?</b><textarea id="abcC" rows="2" placeholder="Ej: lo abracé, se calmó en 10 minutos" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-family:Nunito,sans-serif"></textarea><b style="display:block;margin-top:8px">¿Qué ayudó a calmarlo? (opcional)</b><textarea id="abcH" rows="1" style="width:100%;padding:8px;border-radius:12px;border:2px solid #E2E8F0;margin-top:6px;box-sizing:border-box;font-family:Nunito,sans-serif"></textarea></div>'
  +'<button class="kbtn green" onclick="abcSave()">💾 Guardar episodio</button><button class="kbtn white" onclick="screenABC()">Cancelar</button>');}
function abcSet(k,v){ABCF[k]=v;abcPaint();}
function abcDid(i){const x=ABC_DID[i],k=ABCF.did.indexOf(x);if(k>=0)ABCF.did.splice(k,1);else ABCF.did.push(x);abcPaint();}
function abcInt(n){ABCF.int=n;abcPaint();}
function abcPaint(){
 document.querySelectorAll('button[data-v]').forEach(function(b){const on=ABCF.place===b.dataset.v;b.style.borderColor=on?"#3B82F6":"#E2E8F0";b.style.background=on?"#DBEAFE":"#fff";});
 document.querySelectorAll('#abcDid button').forEach(function(b,i){const on=ABCF.did.indexOf(ABC_DID[i])>=0;b.style.borderColor=on?"#3B82F6":"#E2E8F0";b.style.background=on?"#DBEAFE":"#fff";});
 for(let n=1;n<=5;n++){const b=document.getElementById("abcI"+n);if(b){const on=ABCF.int===n;b.style.borderColor=on?["","#22C55E","#84CC16","#F59E0B","#F97316","#EF4444"][n]:"#E2E8F0";b.style.background=on?"#FEF9C3":"#fff";}}}
function abcSave(){
 const g=function(id){const e=document.getElementById(id);return e?e.value.trim().slice(0,300):"";};
 if(!ABCF.place||!ABCF.int){toast("Falta el lugar y qué tan fuerte fue 🙂",false,1800);return;}
 const l=abcList();
 l.unshift({t:Date.now(),place:ABCF.place,a:g("abcA"),did:ABCF.did.slice(),int:ABCF.int,mins:parseInt(g("abcM"),10)||0,c:g("abcC"),h:g("abcH")});
 while(l.length>100)l.pop();save();toast("Episodio guardado 💙",true,1400);screenABC();}
function abcDel(i){if(!confirm("¿Borrar este episodio?"))return;abcList().splice(i,1);save();screenABC();}
function abcSummary(){
 const l=abcList().filter(function(x){return Date.now()-x.t<60*86400000;}),p=prof();
 if(!l.length)return "Sin episodios registrados.";
 const avg=(l.reduce(function(a,x){return a+x.int;},0)/l.length).toFixed(1),places={},did={};
 l.forEach(function(x){places[x.place]=(places[x.place]||0)+1;(x.did||[]).forEach(function(d){did[d]=(did[d]||0)+1;});});
 const top=function(o){return Object.keys(o).sort(function(a,b){return o[b]-o[a];}).slice(0,3).map(function(k){return k+" ("+o[k]+")";}).join(", ");};
 let t="REGISTRO DE EPISODIOS DE ENOJO/FRUSTRACIÓN — "+(p.name||"niño")+"\nPeríodo: últimos 60 días · Episodios: "+l.length+" · Intensidad promedio: "+avg+"/5\nLugares más frecuentes: "+top(places)+"\nConductas más frecuentes: "+top(did)+"\n\nDETALLE (antes → conducta → después):\n";
 l.slice(0,30).forEach(function(x){t+="• "+abcDate(x.t)+" · "+x.place.replace(/^\S+\s/,"")+" · int. "+x.int+"/5"+(x.mins?" · "+x.mins+" min":"")+"\n   ANTES: "+(x.a||"—")+"\n   CONDUCTA: "+((x.did||[]).join(", ")||"—")+"\n   DESPUÉS: "+(x.c||"—")+(x.h?"\n   AYUDÓ: "+x.h:"")+"\n";});
 const fl=(p.feelLog||[]).filter(function(x){return x.after;});
 if(fl.length)t+="\nUso del rincón de calma en la app: "+fl.length+" veces; se sintió mejor después en "+fl.filter(function(x){return x.after<x.l||x.after<=2;}).length+".\n";
 return t;}
function abcCopy(){
 const t=abcSummary();
 const done=function(){toast("Resumen copiado 📋 Pégalo en un mensaje o documento",true,2200);};
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){abcFallbackCopy(t,done);});}else abcFallbackCopy(t,done);}
function abcFallbackCopy(t,done){const a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done();}catch(e){toast("No se pudo copiar. Usa Imprimir.",false,2000);}a.remove();}
function abcPrint(){
 const old=document.getElementById("printSheet");if(old)old.remove();
 const d=document.createElement("div");d.id="printSheet";d.style.cssText="font-family:Nunito,Arial,sans-serif;font-size:11pt;line-height:1.45;color:#111;white-space:pre-wrap";d.textContent=abcSummary();document.body.appendChild(d);
 document.body.classList.add("printing");
 const fin=function(){document.body.classList.remove("printing");const s=document.getElementById("printSheet");if(s)s.remove();window.removeEventListener("afterprint",fin);};
 window.addEventListener("afterprint",fin);setTimeout(function(){try{window.print();}catch(e){fin();}},150);}
