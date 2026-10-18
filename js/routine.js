"use strict";
/* ============ MI DÍA VISUAL (rutina, avisos y cambio de actividad) ============
   Pedido (la ruta del colegio, el "se acabó el tiempo"): que el niño sepa QUÉ PASA AHORA y QUÉ VIENE
   DESPUÉS, reciba avisos graduales (10 · 5 · 1 minuto) y tenga un pequeño RITUAL para cambiar de
   actividad en vez de una orden de golpe. La anticipación es una de las ayudas más usadas para bajar la
   frustración en las transiciones.
   - Rutina editable por los papás (profile.routine); trae una de ejemplo.
   - Pantalla "ahora / luego" con un reloj de disco que se va vaciando (estilo Time Timer).
   - Avisos a CUALQUIER pantalla de la app mientras esté abierta (banner arriba + voz suave).
   - Temporizador de juego (10-30 min) con los mismos avisos.
   - Ritual de 4 pasos: último turno → respiro → me despido → voy a lo siguiente (+3 monedas por hacerlo).
   OJO honesto: una PWA no puede avisar si la app está cerrada; eso mejora con la versión empaquetada
   (notificaciones nativas). Prefijo rut / RUT. */

const RUT_KINDS={rest:"Descanso / aseo",meal:"Comida",school:"Colegio",ruta:"Ruta",study:"Tareas / estudio",free:"Juego libre"};
const RUT_EMOJIS=["⏰","🥣","🎒","🚌","🏫","🍽️","✏️","🎮","🛁","🍲","📖","😴","🧸","⚽","🎨","🚿","🦷","📺","🌳","🧹","🎵","👪"];
const RUT_DEFAULT=[
 {id:"b1",e:"⏰",nm:"Despertar",st:"06:30",k:"rest",w:false},{id:"b2",e:"🥣",nm:"Desayuno",st:"06:50",k:"meal",w:false},{id:"b3",e:"🎒",nm:"Prepararme",st:"07:20",k:"rest",w:false},
 {id:"b4",e:"🚌",nm:"Ruta al colegio",st:"07:40",k:"ruta",w:false},{id:"b5",e:"🏫",nm:"Colegio",st:"08:00",k:"school",w:false},{id:"b6",e:"🚌",nm:"Ruta de regreso",st:"14:10",k:"ruta",w:false},
 {id:"b7",e:"🍽️",nm:"Almuerzo",st:"14:40",k:"meal",w:false},{id:"b8",e:"✏️",nm:"Tareas",st:"15:30",k:"study",w:true},{id:"b9",e:"🎮",nm:"Tiempo de juego",st:"16:30",k:"free",w:true},
 {id:"b10",e:"🛁",nm:"Baño",st:"17:30",k:"rest",w:false},{id:"b11",e:"🍲",nm:"Cena",st:"18:30",k:"meal",w:false},{id:"b12",e:"📖",nm:"Leer en la Academia",st:"19:00",k:"study",w:true},
 {id:"b13",e:"😴",nm:"A dormir",st:"19:45",k:"rest",w:false}];
let RUT={iv:null,fired:{},edit:null,timers:[]};

/* ---------- datos y tiempo ---------- */
function rutBlocks(){const p=prof();return (p&&Array.isArray(p.routine)&&p.routine.length)?p.routine:RUT_DEFAULT.map(function(b){return Object.assign({},b);});}
function rutMin(st){const m=/^(\d{1,2}):(\d{2})$/.exec(st||"");return m?Math.min(23,+m[1])*60+Math.min(59,+m[2]):0;}
function rutFmt(min){const h=Math.floor(min/60),m=min%60;return (h%12||12)+":"+String(m).padStart(2,"0")+(h<12?" a. m.":" p. m.");}
function rutSorted(){return rutBlocks().slice().sort(function(a,b){return rutMin(a.st)-rutMin(b.st);});}
function rutNowMin(){const d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;}
/* devuelve {i, cur, next, endMin, left} (cur = null si todavía no empieza el día) */
function rutState(){
 const l=rutSorted(),now=rutNowMin();let i=-1;
 for(let k=0;k<l.length;k++){if(rutMin(l[k].st)<=now)i=k;}
 const cur=i>=0?l[i]:null,next=l[i+1]||null;
 const endMin=next?rutMin(next.st):24*60;
 return{list:l,i:i,cur:cur,next:i<0?l[0]:next,endMin:endMin,startMin:cur?rutMin(cur.st):0,left:endMin-now};}
function rutDay(){return new Date().toISOString().slice(0,10);}
function rutCleanup(){if(RUT.iv)clearInterval(RUT.iv);RUT.iv=null;RUT.timers.forEach(clearTimeout);RUT.timers=[];}
function rutLater(fn,ms){const t=setTimeout(fn,ms);RUT.timers.push(t);return t;}

/* ---------- el disco que se vacía (tipo Time Timer) ---------- */
function rutDisc(frac,size){
 frac=Math.max(0,Math.min(1,frac));
 const col=frac>.5?"#22C55E":frac>.2?"#F59E0B":"#EF4444",r=54,cx=60,cy=60,a=frac*Math.PI*2;
 const x=cx+r*Math.sin(a),y=cy-r*Math.cos(a),big=frac>.5?1:0;
 const path=frac>=.999?'<circle cx="60" cy="60" r="54" fill="'+col+'"/>':frac<=.001?'':'<path d="M60 60 L60 6 A54 54 0 '+big+' 1 '+x.toFixed(2)+' '+y.toFixed(2)+' Z" fill="'+col+'"/>';
 return '<svg viewBox="0 0 120 120" width="'+(size||130)+'" height="'+(size||130)+'"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#CBD5E1" stroke-width="3"/>'+path+'<circle cx="60" cy="60" r="6" fill="#1E293B"/></svg>';}
function rutLeftText(min){
 if(min<=0)return "¡Ya es hora!";
 const m=Math.floor(min),s=Math.floor((min-m)*60);
 return m>=60?Math.floor(m/60)+" h "+(m%60)+" min":m>0?m+" min "+String(s).padStart(2,"0")+" s":s+" s";}

/* ---------- pantalla principal ---------- */
function screenRoutine(){setTheme("kid");
 rutCleanup();
 render(topbar("screenKidMap()")+subHeader("📅 Mi día")
  +'<div class="card center" style="padding:0;overflow:hidden;border-radius:18px"><div id="rutPlanet" style="width:100%;height:130px"></div></div>'
  +'<div id="rutNow"></div><div id="rutNext"></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px"><button class="kbtn yellow" style="margin:0;min-height:54px;font-size:.95rem" onclick="rutTimerPick()">⏱️ Temporizador de juego</button><button class="kbtn white" style="margin:0;min-height:54px;font-size:.95rem" onclick="rutGate()">⚙️ Editar (papás)</button></div>'
  +'<button class="kbtn purple" style="margin-top:8px" onclick="emwStart(\'ruta\')">🪐 Practicar: ¡llegó la ruta!</button>'
  +'<p class="appsec" style="margin-top:10px">Todo mi día</p><div id="rutList"></div>');
 if(typeof renderPlanetChar==="function"&&window.PLANET_PRESETS){const ch=typeof emwChosen==="function"?emwChosen().cfg:window.PLANET_PRESETS.tierra;RUT.c3=renderPlanetChar("rutPlanet",Object.assign({},ch,{face:"feliz"}),{});RUT.face="feliz";}
 rutPaint();RUT.iv=setInterval(rutPaint,1000);}
function rutPaint(){
 const now=document.getElementById("rutNow");if(!now){rutCleanup();return;}
 const st=rutState(),cur=st.cur,nx=st.next;
 if(!cur){
  now.innerHTML='<div class="card center"><div style="font-size:2.4rem">🌙</div><b>Todavía no empieza el día</b><br><span class="mut">Lo primero será:</span> <b>'+(nx?nx.e+" "+esc(nx.nm)+" · "+rutFmt(rutMin(nx.st)):"—")+'</b></div>';
 }else{
  const total=Math.max(1,st.endMin-st.startMin),frac=st.left/total;
  now.innerHTML='<div class="card" style="display:flex;align-items:center;gap:12px;border:3px solid '+(st.left<=5?"#EF4444":st.left<=10?"#F59E0B":"#22C55E")+'"><div>'+rutDisc(frac,112)+'</div><div style="flex:1"><span class="mut" style="font-size:.8rem">AHORA</span><div style="font-family:Fredoka;font-weight:700;font-size:1.5rem;line-height:1.1">'+cur.e+' '+esc(cur.nm)+'</div><div style="font-size:1.25rem;font-weight:800;margin-top:4px;color:'+(st.left<=5?"#DC2626":"#1E293B")+'">'+(st.endMin>=24*60?"Hasta dormir":"Faltan "+rutLeftText(st.left))+'</div>'+(nx&&st.left<=10&&st.endMin<24*60?'<button class="kbtn green" style="margin:8px 0 0;min-height:44px;font-size:.9rem" onclick="rutTransition(\''+cur.id+'\')">Hacer el cambio con calma →</button>':'')+'</div></div>';}
 const nn=document.getElementById("rutNext");
 if(nn)nn.innerHTML=nx&&cur?'<div class="card" style="display:flex;align-items:center;gap:12px;background:#F8FAFC"><span style="font-size:2rem">'+nx.e+'</span><div><span class="mut" style="font-size:.8rem">DESPUÉS</span><div style="font-family:Fredoka;font-weight:700;font-size:1.15rem">'+esc(nx.nm)+'</div><span class="mut" style="font-size:.85rem">a las '+rutFmt(rutMin(nx.st))+'</span></div></div>':"";
 const li=document.getElementById("rutList");
 if(li)li.innerHTML=st.list.map(function(b,i){const past=st.i>=0&&i<st.i,on=i===st.i;return '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;margin-bottom:6px;border-radius:14px;background:'+(on?"#DBEAFE":"#fff")+';border:2px solid '+(on?"#3B82F6":"#E2E8F0")+';opacity:'+(past?".5":"1")+'"><span style="font-size:1.6rem">'+b.e+'</span><span style="flex:1;font-weight:700">'+esc(b.nm)+'</span><span class="mut" style="font-size:.82rem">'+rutFmt(rutMin(b.st))+'</span>'+(past?'<span>✅</span>':on?'<span>👈</span>':'')+'</div>';}).join("");
 /* la cara del planeta cambia al acercarse el cambio */
 if(RUT.c3&&cur&&st.endMin<24*60){const f=st.left<=5?"sorpresa":"feliz";if(f!==RUT.face){RUT.face=f;const ch=typeof emwChosen==="function"?emwChosen().cfg:window.PLANET_PRESETS.tierra;RUT.c3.update(Object.assign({},ch,{face:f}));}}}

/* ---------- ritual para cambiar de actividad ---------- */
function rutTransition(fromId,toId){setTheme("kid");
 rutCleanup();
 const st=rutState(),l=st.list;
 const from=l.find(function(b){return b.id===fromId;})||st.cur;
 const to=toId?l.find(function(b){return b.id===toId;}):(l[l.indexOf(from)+1]||null);
 RUT.tr={from:from,to:to,step:0};
 rutTrStep(0);}
function rutTrStep(n){
 const T=RUT.tr;T.step=n;const from=T.from,to=T.to,isRuta=to&&to.k==="ruta";
 const dots4='<div class="progressdots" style="margin:4px 0 10px">'+dots(4,n+1)+'</div>';
 const calmLink='<button class="kbtn white" style="min-height:42px;font-size:.88rem;margin-top:10px" onclick="typeof calmOverlay===\'function\'&&calmOverlay(\'manual\')">😠 Estoy muy enojado: respirar un momento</button>';
 let body="";
 if(n===0){
  body='<div class="card center"><div style="font-size:3.4rem">✋</div><h2 style="margin:4px 0">1. Mi último turno</h2><p style="font-size:1.1rem;line-height:1.5;margin:0">'+(from&&from.k==="free"?"Termino esta ronda y <b>guardo mi juego</b> para seguir después.":"Termino lo que estoy haciendo y lo <b>dejo guardado</b>.")+'<br>Lo que dejo hoy, lo puedo seguir después.</p></div><button class="kbtn green" onclick="rutTrStep(1)">Listo ✅</button>';
  setTimeout(function(){speakES("Mi último turno. Guardo lo que estoy haciendo para seguir después.");},250);}
 else if(n===1){
  body='<div class="card center"><div style="font-size:1.2rem;font-weight:800;margin-bottom:4px">2. Respiro 3 veces</div><div style="height:150px;display:flex;align-items:center;justify-content:center"><div id="rutBall" style="font-size:5.5rem;line-height:1;animation:calmBreath 11.5s ease-in-out 3">🌍</div></div><div id="rutCue" style="font-family:Fredoka;font-weight:700;font-size:1.4rem;color:#2563EB;min-height:2rem">Inhala por la nariz… 🌬️</div></div><div id="rutNextBtn"></div>';
  for(let c=0;c<3;c++){
   const t0=c*11500;
   rutLater(function(){const e=document.getElementById("rutCue");if(e)e.textContent="Inhala por la nariz… 🌬️";},t0);
   rutLater(function(){const e=document.getElementById("rutCue");if(e)e.textContent="Sostén el aire…";},t0+4000);
   rutLater(function(){const e=document.getElementById("rutCue");if(e)e.textContent="Suelta despacito… 💨";},t0+5500);}
  rutLater(function(){const bt=document.getElementById("rutNextBtn");if(bt)bt.innerHTML='<button class="kbtn green" onclick="rutTrStep(2)">Listo ✅</button>';},11500); /* se puede seguir tras 1 respiración */
  rutLater(function(){const e=document.getElementById("rutCue");if(e)e.textContent="¡Muy bien! 💙";},34500);}
 else if(n===2){
  const phrase=isRuta?"Chao amigos, mañana jugamos otra vez.":"Chao, después seguimos.";
  body='<div class="card center"><div style="font-size:3.4rem">👋</div><h2 style="margin:4px 0">3. Me despido</h2><p style="font-size:1.25rem;font-family:Fredoka;font-weight:600;line-height:1.5;margin:6px 0">«'+phrase+'»</p><button class="speaker" onclick="speakES(\''+phrase+'\')">🔊 Escucharla</button><p class="mut" style="margin:8px 0 0;font-size:.88rem">Dila en voz alta y despídete con la mano.</p></div><button class="kbtn green" onclick="rutTrStep(3)">Ya me despedí ✅</button>';
  setTimeout(function(){speakES(phrase);},250);}
 else{
  const plan=(prof().calmPlan||[]).map(function(id){const s=typeof calmStrat==="function"?calmStrat(id):null;return s?s.e+" "+s.t:"";}).filter(Boolean);
  body='<div class="card center"><div style="font-size:3.4rem">➡️</div><h2 style="margin:4px 0">4. Voy a lo siguiente</h2>'+(to?'<div style="font-size:3rem;margin:6px 0">'+to.e+'</div><div style="font-family:Fredoka;font-weight:700;font-size:1.5rem">'+esc(to.nm)+'</div>':'<div style="font-size:1.2rem">¡Terminé mi día!</div>')+(isRuta?'<p style="margin:10px 0 0;font-size:.95rem;line-height:1.45">En la ruta puedo sentarme, contarle a la profe cómo me siento y mañana vuelvo a jugar. 🚌</p>':"")+'</div>'
   +(plan.length?'<div class="card" style="font-size:.9rem"><b>⭐ Si el enojo sube, uso mi plan:</b><br>'+plan.map(esc).join("<br>")+'</div>':"")
   +'<button class="kbtn green" onclick="rutTrDone()">¡Voy! 🌟</button>';
  setTimeout(function(){speakES(to?"Ahora voy a "+to.nm+".":"Terminé mi día.");},250);}
 render(topbar("screenRoutine()")+subHeader("🔄 Cambio de actividad")+dots4+body+calmLink);}
function rutTrDone(){
 const T=RUT.tr,p=prof(),d=rutDay();
 if(!p.rutLog)p.rutLog=[];p.rutLog.push({t:Date.now(),from:T.from&&T.from.id,to:T.to&&T.to.id});if(p.rutLog.length>200)p.rutLog.shift();
 if(p.rutRewardDay!==d){p.rutRewardDay=d;p.rutRewardN=0;}
 let msg="¡Hiciste el cambio con calma! 🌟";
 if((p.rutRewardN||0)<4){p.rutRewardN=(p.rutRewardN||0)+1;p.coins+=3;msg+=" +3 🪙";}
 save();sOK();confetti(14);toast(msg,true,2200);
 screenRoutine();}

/* ---------- temporizador de juego con avisos ---------- */
function rutTimerPick(){setTheme("kid");
 rutCleanup();
 const p=prof(),t=p.rutTimer&&p.rutTimer.end>Date.now()?p.rutTimer:null;
 render(topbar("screenRoutine()")+subHeader("⏱️ Temporizador de juego")
  +(t?'<div class="card center"><b>Ya hay un tiempo de juego corriendo</b><div style="font-size:2rem;font-weight:800;margin:6px 0" id="rutTL"></div><button class="kbtn red" onclick="rutTimerStop()">Cancelar el tiempo</button></div>':"")
  +'<p class="center" style="margin:-4px 0 10px">¿Cuánto tiempo de juego? Te avisaré a los <b>10, 5 y 1 minuto</b> antes de terminar.</p>'
  +[10,15,20,30].map(function(m){return '<button class="kbtn white" style="min-height:62px;font-size:1.3rem" onclick="rutTimerStart('+m+')">⏱️ '+m+' minutos</button>';}).join("")
  +'<p class="mut center" style="font-size:.82rem">Los avisos salen en cualquier pantalla mientras la app esté abierta.</p>');
 if(t){const u=function(){const e=document.getElementById("rutTL");if(!e){rutCleanup();return;}e.textContent=rutLeftText((t.end-Date.now())/60000);};u();RUT.iv=setInterval(u,1000);}}
function rutTimerStart(min){
 const p=prof();p.rutTimer={end:Date.now()+min*60000,total:min,label:"tiempo de juego"};save();RUT.fired={};
 toast("¡A jugar! Te aviso cuando falte poco 🎮",true,1800);screenKidMap();}
function rutTimerStop(){const p=prof();p.rutTimer=null;save();RUT.fired={};screenRoutine();}

/* ---------- editar la rutina (papás) ---------- */
function rutGate(){setTheme("kid");
 const a=6+Math.floor(Math.random()*5),b=7+Math.floor(Math.random()*6);RUT.gate=a+b;
 render(topbar("screenRoutine()")+subHeader("👨‍👩‍👦 Solo para papás")
  +'<div class="card center"><p style="margin:0 0 8px">Para editar la rutina, resuelve:</p><div style="font-family:Fredoka;font-weight:700;font-size:2rem">'+a+' + '+b+' = ?</div><input id="rutGateIn" type="number" inputmode="numeric" style="width:120px;font-size:1.6rem;text-align:center;padding:8px;border-radius:12px;border:2px solid #CBD5E1;margin:10px 0"><br><button class="kbtn green" onclick="rutGateCheck()">Entrar</button></div>');}
function rutGateCheck(){const v=parseInt((document.getElementById("rutGateIn")||{}).value,10);if(v===RUT.gate)rutEdit(true);else{sNO();toast("Esa no es 🙂 Intenta otra vez",false,1400);rutGate();}}
function rutEdit(fresh){setTheme("kid");
 rutCleanup();
 if(fresh||!RUT.edit)RUT.edit=rutSorted().map(function(b){return Object.assign({},b);});
 const L=RUT.edit;
 render(topbar("screenRoutine()")+subHeader("⚙️ Editar mi día")
  +'<p class="center mut" style="margin:-4px 0 8px;font-size:.88rem">Cambia las horas y los nombres. «Avisos» = el niño recibe aviso a los 10, 5 y 1 minuto antes de que termine esa actividad.</p>'
  +L.map(function(b,i){return '<div class="card" style="padding:8px 10px;margin-bottom:8px"><div style="display:flex;gap:6px;align-items:center"><select onchange="RUT.edit['+i+'].e=this.value" style="font-size:1.4rem;padding:2px;border-radius:10px;border:2px solid #E2E8F0">'+RUT_EMOJIS.map(function(e){return '<option'+(e===b.e?' selected':'')+'>'+e+'</option>';}).join("")+'</select><input value="'+esc(b.nm)+'" maxlength="24" oninput="RUT.edit['+i+'].nm=this.value" style="flex:1;min-width:0;padding:8px;border-radius:10px;border:2px solid #E2E8F0;font-weight:700"><input type="time" value="'+esc(b.st)+'" onchange="RUT.edit['+i+'].st=this.value" style="padding:6px;border-radius:10px;border:2px solid #E2E8F0"></div>'
   +'<div style="display:flex;gap:6px;align-items:center;margin-top:6px;font-size:.85rem"><select onchange="RUT.edit['+i+'].k=this.value" style="flex:1;padding:4px;border-radius:8px;border:2px solid #E2E8F0">'+Object.keys(RUT_KINDS).map(function(k){return '<option value="'+k+'"'+(k===b.k?' selected':'')+'>'+RUT_KINDS[k]+'</option>';}).join("")+'</select><label style="white-space:nowrap"><input type="checkbox"'+(b.w?' checked':'')+' onchange="RUT.edit['+i+'].w=this.checked"> Avisos</label><button onclick="rutDel('+i+')" style="border:0;background:none;font-size:1.2rem;cursor:pointer" aria-label="Borrar">🗑️</button></div></div>';}).join("")
  +'<button class="kbtn white" onclick="rutAdd()">➕ Agregar una actividad</button>'
  +'<button class="kbtn green" onclick="rutSave()">💾 Guardar mi día</button>'
  +'<button class="kbtn white" style="min-height:44px;font-size:.9rem" onclick="rutReset()">↩️ Volver al ejemplo</button>');}
function rutAdd(){RUT.edit.push({id:"n"+Date.now(),e:"🧸",nm:"Nueva actividad",st:"12:00",k:"rest",w:false});rutEdit();}
function rutDel(i){RUT.edit.splice(i,1);rutEdit();}
function rutSave(){
 const L=RUT.edit.filter(function(b){return b.nm&&b.nm.trim();}).map(function(b){return{id:b.id,e:b.e,nm:b.nm.trim().slice(0,24),st:/^\d{1,2}:\d{2}$/.test(b.st)?b.st:"12:00",k:b.k,w:!!b.w};});
 if(!L.length){toast("Deja al menos una actividad",false,1600);return;}
 const p=prof();p.routine=L;save();RUT.edit=null;RUT.fired={};toast("Rutina guardada 💙",true,1500);screenRoutine();}
function rutReset(){if(!confirm("¿Volver a la rutina de ejemplo? Se pierden tus cambios."))return;const p=prof();p.routine=null;save();RUT.edit=null;screenRoutine();}

/* ---------- avisos en cualquier pantalla (mientras la app esté abierta) ---------- */
function rutBanner(icon,title,text,btns){
 let d=document.getElementById("rutBanner");
 if(!d){d=document.createElement("div");d.id="rutBanner";d.style.cssText="position:fixed;left:8px;right:8px;top:8px;z-index:250;max-width:460px;margin:0 auto;background:#FFF7ED;border:4px solid #F59E0B;border-radius:18px;padding:10px 12px;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:Nunito,sans-serif";document.body.appendChild(d);}
 d.innerHTML='<div style="display:flex;gap:10px;align-items:center"><span style="font-size:2.2rem">'+icon+'</span><div style="flex:1"><b style="font-family:Fredoka;font-size:1.1rem">'+title+'</b><div style="font-size:.92rem;line-height:1.35">'+text+'</div></div></div><div style="display:flex;gap:6px;margin-top:8px">'+btns+'</div>';}
function rutBannerClose(){const d=document.getElementById("rutBanner");if(d)d.remove();}
function rutAlert(key,icon,title,text,say,calm,extra){
 if(RUT.fired[key])return;RUT.fired[key]=1;
 try{beep([784,988],.18);}catch(e){}
 rutBanner(icon,title,text,'<button class="kbtn green" style="margin:0;min-height:42px;font-size:.9rem;flex:1" onclick="rutBannerClose()">Entendido 👍</button>'+(calm?'<button class="kbtn white" style="margin:0;min-height:42px;font-size:.9rem;flex:1" onclick="rutBannerClose();typeof calmOverlay===\'function\'&&calmOverlay(\'manual\')">🌬️ Respirar</button>':"")+(extra||""));
 try{speakES(say);}catch(e){}
 setTimeout(function(){const d=document.getElementById("rutBanner");if(d&&RUT.fired[key])d.remove();},30000);}
function rutTick(){
 let p;try{p=prof();}catch(e){return;}
 if(!p||p.type==="teen"||p.type==="adulto"||p.type==="adult")return;
 if(typeof muted==="undefined")return;
 const day=rutDay();
 /* 1) temporizador de juego */
 if(p.rutTimer){
  const left=(p.rutTimer.end-Date.now())/60000;
  if(left<=0){const k=day+"|timer|end|"+p.rutTimer.end;if(!RUT.fired[k]){p.rutTimer=null;save();rutAlert(k,"⏱️","¡Se acabó el tiempo de juego!","Es hora de hacer el cambio con calma. Primero respiramos, luego guardamos.","Se acabó el tiempo de juego. Vamos a hacer el cambio con calma.",true,'<button class="kbtn yellow" style="margin:0;min-height:42px;font-size:.9rem;flex:1" onclick="rutBannerClose();rutTransition()">Cambio →</button>');}}
  else{[10,5,1].forEach(function(m){if(m<p.rutTimer.total&&left<=m&&left>m-1.2)rutAlert(day+"|timer|"+p.rutTimer.end+"|"+m,m===1?"🌬️":"⏳","Quedan "+m+" minuto"+(m>1?"s":"")+" de juego",m===1?"¡Último minuto! Termina esta ronda y guarda tu juego.":m===5?"Termina lo que estás haciendo. Después guardamos.":"Todavía hay tiempo. Disfrútalo.","Quedan "+m+(m>1?" minutos":" minuto")+" de juego.",m<=5);});}}
 /* 2) bloques de la rutina con avisos */
 const st=rutState();
 if(st.cur&&st.cur.w&&st.endMin<24*60){
  [10,5,1].forEach(function(m){if(st.left<=m&&st.left>m-1.2)rutAlert(day+"|"+st.cur.id+"|"+m,m===1?"🌬️":"⏳","Quedan "+m+" minuto"+(m>1?"s":"")+" de "+esc(st.cur.nm),"Después viene: <b>"+(st.next?st.next.e+" "+esc(st.next.nm):"descansar")+"</b>.","Quedan "+m+(m>1?" minutos":" minuto")+" de "+st.cur.nm+". Después viene "+(st.next?st.next.nm:"descansar")+".",m<=5);});}}
setInterval(rutTick,15000);
