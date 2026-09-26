"use strict";
/* ============ LABORATORIO DEL RELOJ (aprender las horas y las partes del reloj) ============
   Pedido explícito: "refuerzo del reloj, aprender las horas y las partes del reloj para niños".
   Antes solo existía UNA pregunta de opción múltiple (en punto / y media / y cuarto). Ahora:
     1) Conoce las partes  — toca cada parte del reloj y escucha qué hace; luego se pone a prueba.
     2) Pon la hora        — arrastra las agujas (la corta elige la hora, la larga los minutos).
     3) Lee la hora        — opciones digitales con errores típicos (confundir las dos agujas).
     4) Rutinas del día    — desayuno, colegio, dormir: ¿cuál reloj marca esa hora?
   Nivel 1→4 (en punto → y media → y cuarto/menos cuarto → de 5 en 5 minutos) que SUBE solo con
   5 aciertos seguidos y nunca baja por un error (mismo criterio que los números en inglés). */

function ckLevel(){const p=prof();return p.clockLevel||1;}
const CK_LEVEL_NAMES=["","En punto","En punto y y media","Y cuarto y menos cuarto","De 5 en 5 minutos"];
function ckBump(ok){
 const p=prof();if(!p.clockLevel)p.clockLevel=1;
 if(ok){p.clockStreak=(p.clockStreak||0)+1;
  if(p.clockStreak>=5&&p.clockLevel<4){p.clockLevel++;p.clockStreak=0;save();
   setTimeout(function(){toast("🎉 ¡Subiste al nivel "+p.clockLevel+" del reloj! "+CK_LEVEL_NAMES[p.clockLevel],true,2600);},1200);return true;}}
 else p.clockStreak=0;
 save();return false;}
function ckMinutesFor(level){
 return level===1?[0]:level===2?[0,30]:level===3?[0,15,30,45]:[0,5,10,15,20,25,30,35,40,45,50,55];}
function ckTarget(){const ms=ckMinutesFor(ckLevel());return{h:1+rnd(12),m:pick(ms)};}
function ckDigital(h,m){return h+":"+(m<10?"0"+m:m);}
function ckWords(h,m){
 const nx=h%12+1;
 if(m===0)return (h===1?"La ":"Las ")+h+" en punto";
 if(m===15)return (h===1?"La ":"Las ")+h+" y cuarto";
 if(m===30)return (h===1?"La ":"Las ")+h+" y media";
 if(m===45)return (nx===1?"La ":"Las ")+nx+" menos cuarto";
 return (h===1?"La ":"Las ")+h+" y "+m;}

/* ---------- el reloj dibujado (SVG con ids para poder mover las agujas) ---------- */
function ckPt(deg,len){const a=deg*Math.PI/180;return[120+len*Math.sin(a),120-len*Math.cos(a)];}
function ckFace(id,h,m,px,opt){
 opt=opt||{};let s='<svg id="'+id+'" viewBox="0 0 240 240" style="width:'+px+'px;height:'+px+'px;display:block;margin:0 auto;touch-action:none;user-select:none">';
 s+='<circle cx="120" cy="120" r="112" fill="#FFF7D6" stroke="#1E2A4A" stroke-width="7"/>';
 if(opt.parts)s+='<circle data-part="esfera" cx="120" cy="120" r="108" fill="rgba(0,0,0,0)"/>';
 for(let i=0;i<60;i++){const big=i%5===0;const p1=ckPt(i*6,big?90:98),p2=ckPt(i*6,104);
  s+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="#1E2A4A" stroke-width="'+(big?3.5:1.4)+'" stroke-linecap="round"/>';}
 if(opt.parts){s+='<circle data-part="marcas" cx="120" cy="120" r="98" fill="none" stroke="rgba(0,0,0,0)" stroke-width="16"/>';
  s+='<circle data-part="numeros" cx="120" cy="120" r="74" fill="none" stroke="rgba(0,0,0,0)" stroke-width="30"/>';}
 for(let i=1;i<=12;i++){const p=ckPt(i*30,74);
  s+='<text x="'+p[0].toFixed(1)+'" y="'+(p[1]+8).toFixed(1)+'" text-anchor="middle" font-size="24" font-family="Fredoka,sans-serif" font-weight="700" fill="#1E2A4A" pointer-events="none">'+i+'</text>';}
 const ha=(h%12)*30+m*.5,ma=m*6;
 const hp=ckPt(ha,54),mp=ckPt(ma,84);
 s+='<line id="'+id+'_h" x1="120" y1="120" x2="'+hp[0].toFixed(1)+'" y2="'+hp[1].toFixed(1)+'" stroke="#EF4444" stroke-width="11" stroke-linecap="round"/>';
 s+='<line id="'+id+'_m" x1="120" y1="120" x2="'+mp[0].toFixed(1)+'" y2="'+mp[1].toFixed(1)+'" stroke="#3B82F6" stroke-width="7" stroke-linecap="round"/>';
 if(opt.parts){
  s+='<line data-part="hora" x1="120" y1="120" x2="'+hp[0].toFixed(1)+'" y2="'+hp[1].toFixed(1)+'" stroke="rgba(0,0,0,0)" stroke-width="30" stroke-linecap="round"/>';
  s+='<line data-part="minutos" x1="120" y1="120" x2="'+mp[0].toFixed(1)+'" y2="'+mp[1].toFixed(1)+'" stroke="rgba(0,0,0,0)" stroke-width="26" stroke-linecap="round"/>';}
 if(opt.handles){
  s+='<circle id="'+id+'_hh" cx="'+hp[0].toFixed(1)+'" cy="'+hp[1].toFixed(1)+'" r="15" fill="#EF4444" fill-opacity=".28" stroke="#EF4444" stroke-width="3"/>';
  s+='<circle id="'+id+'_mh" cx="'+mp[0].toFixed(1)+'" cy="'+mp[1].toFixed(1)+'" r="15" fill="#3B82F6" fill-opacity=".28" stroke="#3B82F6" stroke-width="3"/>';}
 s+='<circle '+(opt.parts?'data-part="centro" ':'')+'cx="120" cy="120" r="11" fill="#1E2A4A"/>';
 return s+'</svg>';}
function ckSetHands(id,h,m){
 const ha=(h%12)*30+m*.5,ma=m*6,hp=ckPt(ha,54),mp=ckPt(ma,84);
 const set=function(el,p){if(!el)return;if(el.tagName==="line"){el.setAttribute("x2",p[0]);el.setAttribute("y2",p[1]);}else{el.setAttribute("cx",p[0]);el.setAttribute("cy",p[1]);}};
 set(document.getElementById(id+"_h"),hp);set(document.getElementById(id+"_m"),mp);
 set(document.getElementById(id+"_hh"),hp);set(document.getElementById(id+"_mh"),mp);}

/* ---------- menú ---------- */
function screenClockLab(){setTheme("kid");
 const lv=ckLevel(),p=prof();
 const btn=function(cls,ic,t,sub,fn){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2rem,9vw,2.6rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🕐 El reloj</h2>'
  +'<div class="card center" style="padding:10px 14px;margin-bottom:8px">'+ckFace("ckMenu",10,10,120)
  +'<b>Nivel '+lv+' de 4</b> — '+CK_LEVEL_NAMES[lv]+'<div style="height:12px;border-radius:10px;background:#E6ECF5;border:2px solid var(--kid-ink);overflow:hidden;margin-top:6px"><div style="height:100%;width:'+Math.round(Math.min(5,(p.clockStreak||0))/5*100)+'%;background:#3EC97C"></div></div><span class="mut" style="font-size:.78rem">5 aciertos seguidos y subes de nivel</span></div>'
  +btn("yellow","🧩","Conoce las partes","Toca cada parte del reloj y descubre para qué sirve","ckParts()")
  +btn("green","🕹️","Pon la hora","Arrastra las agujas hasta la hora que te piden","ckSetStart()")
  +btn("blue","👀","Lee la hora","¿Qué hora marca el reloj?","ckReadStart()")
  +btn("purple","🌞","Rutinas del día","Desayuno, colegio, dormir… ¿cuál reloj es?","ckRoutStart()"));}

/* ---------- 1) partes del reloj ---------- */
const CK_PARTS={
 esfera:{nm:"La esfera",ic:"🟡",tx:"La esfera es la cara del reloj: el círculo donde están los números y las rayitas."},
 numeros:{nm:"Los números",ic:"🔢",tx:"Los números del 1 al 12 marcan las horas. En total hay doce."},
 marcas:{nm:"Las rayitas",ic:"➖",tx:"Las rayitas son los minutos. Hay sesenta. Cada número grande vale cinco minutos."},
 hora:{nm:"La manecilla de las horas",ic:"🔴",tx:"La manecilla corta y roja señala la hora. Es la más gordita y la más corta, y se mueve despacito."},
 minutos:{nm:"La manecilla de los minutos",ic:"🔵",tx:"La manecilla larga y azul señala los minutos. Es la más larga y se mueve más rápido."},
 centro:{nm:"El centro",ic:"⚫",tx:"En el centro se unen las dos manecillas y giran alrededor de él."}
};
let CKP={};
function ckParts(){setTheme("kid");CKP={h:2+rnd(9),m:pick([0,10,20,40,50]),shown:null};
 render(topbar("screenClockLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🧩 Las partes del reloj</h2>'
  +'<p class="center" id="ckpInfo" style="margin-bottom:8px;font-family:Fredoka;font-weight:700;color:var(--kid-blue);min-height:3.4em">👉 Toca una parte del reloj para conocerla</p>'
  +'<div class="card" style="padding:12px" onclick="ckPartsTap(event)">'+ckFace("ckP",CKP.h,CKP.m,290,{parts:true})+'</div>'
  +'<div class="card" style="padding:10px 14px;font-size:.9rem;line-height:1.5"><b>Truco:</b> cuando la manecilla larga llega al <b>12</b> es <b>en punto</b>; al <b>6</b>, <b>y media</b>; al <b>3</b>, <b>y cuarto</b>.</div>'
  +'<button class="kbtn green" onclick="ckPartsQuiz()">🎯 ¡Ponte a prueba!</button>');}
function ckPartsTap(ev){
 const t=ev.target;const part=t&&t.getAttribute&&t.getAttribute("data-part");if(!part)return;
 if(CKP.quiz)return ckPartsAnswer(part);
 const d=CK_PARTS[part];if(!d)return;
 const el=document.getElementById("ckpInfo");if(el)el.innerHTML=d.ic+" <b>"+d.nm+"</b> — "+d.tx;
 speakES(d.nm+". "+d.tx);}
function ckPartsQuiz(){
 CKP.quiz=true;CKP.round=0;CKP.ok=0;CKP.total=6;CKP.order=shuffled(["hora","minutos","numeros","marcas","centro","esfera"]);
 ckPartsNext();}
function ckPartsNext(){
 if(CKP.round>=CKP.total){CKP.quiz=false;ckBump(CKP.ok>=4);return nodeWin(starsFor(CKP.ok,CKP.total),"Partes del reloj");}
 CKP.target=CKP.order[CKP.round];CKP.answered=false;
 CKP.h=2+rnd(9);CKP.m=pick([0,10,20,40,50]);
 const q={hora:"la manecilla de las HORAS (la corta)",minutos:"la manecilla de los MINUTOS (la larga)",numeros:"los NÚMEROS",marcas:"las RAYITAS de los minutos",centro:"el CENTRO del reloj",esfera:"la ESFERA (la cara del reloj)"}[CKP.target];
 render(topbar("screenClockLab()")
  +'<div class="progressdots">'+dots(CKP.total,CKP.round)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.4rem);text-align:center;margin-bottom:4px">🎯 Toca: <span style="color:#3B82F6">'+q+'</span></h2>'
  +'<p class="center" id="ckpInfo" style="min-height:2.4em"></p>'
  +'<div class="card" style="padding:12px" onclick="ckPartsTap(event)">'+ckFace("ckP",CKP.h,CKP.m,290,{parts:true})+'</div>');
 speakES("Toca "+q.replace(/[()]/g,""));}
function ckPartsAnswer(part){
 if(CKP.answered)return;CKP.answered=true;
 const ok=part===CKP.target;recordAnswer("El reloj",ok,12);
 const el=document.getElementById("ckpInfo");const d=CK_PARTS[CKP.target];
 if(ok){sOK();confetti(8);CKP.ok++;if(el)el.innerHTML="✅ ¡Sí! "+d.nm;}
 else{sNO();if(el)el.innerHTML="❌ Tocaste "+(CK_PARTS[part]?CK_PARTS[part].nm.toLowerCase():"otra parte")+". "+d.nm+": "+d.tx;speakES(d.tx);}
 CKP.round++;setTimeout(ckPartsNext,ok?1200:3200);}

/* ---------- 2) pon la hora (arrastrar agujas) ---------- */
let CKS={};
function ckSetStart(){setTheme("kid");CKS={round:0,ok:0,total:6};ckSetNext();}
function ckSetNext(){
 if(CKS.round>=CKS.total)return nodeWin(starsFor(CKS.ok,CKS.total),"Pon la hora");
 const t=ckTarget();CKS.t=t;CKS.h=12;CKS.m=0;CKS.done=false;
 render(topbar("screenClockLab()")
  +'<div class="progressdots">'+dots(CKS.total,CKS.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:2px">🕹️ Pon el reloj a las <span style="color:#3B82F6">'+ckDigital(t.h,t.m)+'</span></h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:6px"><b>'+ckWords(t.h,t.m)+'</b> · arrastra la bolita <span style="color:#EF4444;font-weight:700">roja</span> (hora) y la <span style="color:#3B82F6;font-weight:700">azul</span> (minutos)</p>'
  +'<div class="card" style="padding:12px">'+ckFace("ckS",CKS.h,CKS.m,300,{handles:true})+'<div id="ckSdig" style="text-align:center;font-family:Fredoka;font-weight:700;font-size:1.6rem;margin-top:4px">'+ckDigital(CKS.h,CKS.m)+'</div></div>'
  +'<button class="speaker small" onclick="speakES(\''+ckWords(t.h,t.m)+'\')">🔊 Escuchar la hora</button>'
  +'<button class="kbtn green" onclick="ckSetCheck()">✅ ¡Listo!</button>');
 ckDragAttach("ckS",function(h,m){CKS.h=h;CKS.m=m;const d=document.getElementById("ckSdig");if(d)d.textContent=ckDigital(h,m);},function(){return{h:CKS.h,m:CKS.m};});
 speakES("Pon el reloj a "+ckWords(t.h,t.m).toLowerCase());}
function ckDragAttach(id,onChange,getState){
 const svg=document.getElementById(id);if(!svg)return;
 let mode=null;
 const toSvg=function(e){const r=svg.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*240,y:(e.clientY-r.top)/r.height*240};};
 const angle=function(p){let a=Math.atan2(p.x-120,-(p.y-120))*180/Math.PI;if(a<0)a+=360;return a;};
 svg.addEventListener("pointerdown",function(e){
  const p=toSvg(e),s=getState();
  const hp=ckPt((s.h%12)*30+s.m*.5,54),mp=ckPt(s.m*6,84);
  const dh=Math.hypot(p.x-hp[0],p.y-hp[1]),dm=Math.hypot(p.x-mp[0],p.y-mp[1]);
  mode=(dh<dm&&dh<40)?"h":(dm<46?"m":(dh<dm?"h":"m"));
  try{svg.setPointerCapture(e.pointerId);}catch(_){}
  move(e);});
 const move=function(e){
  if(!mode)return;const p=toSvg(e),a=angle(p),s=getState();let h=s.h,m=s.m;
  if(mode==="m"){m=Math.round(a/30)*5%60;}
  else{h=Math.round((a-m*.5)/30)%12;if(h<=0)h+=12;}
  onChange(h,m);ckSetHands(id,h,m);};
 svg.addEventListener("pointermove",move);
 const stop=function(){mode=null;};
 svg.addEventListener("pointerup",stop);svg.addEventListener("pointercancel",stop);}
function ckSetCheck(){
 if(CKS.done)return;CKS.done=true;
 const ok=(CKS.h===CKS.t.h&&CKS.m===CKS.t.m);recordAnswer("El reloj",ok,15);
 const lv=ckBump(ok);
 if(ok){sOK();confetti(10);toast("¡Perfecto! "+ckDigital(CKS.t.h,CKS.t.m)+" 🎉",true,1300);CKS.ok++;}
 else{sNO();
  let why="Era "+ckDigital(CKS.t.h,CKS.t.m)+" ("+ckWords(CKS.t.h,CKS.t.m).toLowerCase()+").";
  if(CKS.m!==CKS.t.m)why+=" Los minutos los marca la aguja larga: ¡cada número vale 5!";
  else why+=" La hora la marca la aguja corta.";
  toast(why,false,3400);ckSetHands("ckS",CKS.t.h,CKS.t.m);}
 CKS.round++;setTimeout(ckSetNext,ok?1300:3600);}

/* ---------- 3) lee la hora ---------- */
let CKR={};
function ckReadStart(){setTheme("kid");CKR={round:0,ok:0,total:6};ckReadNext();}
function ckReadNext(){
 if(CKR.round>=CKR.total)return nodeWin(starsFor(CKR.ok,CKR.total),"Lee la hora");
 const t=ckTarget();CKR.t=t;
 const opts=new Map();opts.set(ckDigital(t.h,t.m),true);
 /* errores típicos: intercambiar las agujas, ±1 hora, minutos vecinos */
 const tries=[[t.m===0?12:Math.max(1,t.m/5)%12||12,(t.h*5)%60],[(t.h%12)+1,t.m],[((t.h+10)%12)+1,t.m],[t.h,(t.m+30)%60],[t.h,(t.m+15)%60],[(t.h%12)+1,(t.m+30)%60]];
 shuffled(tries).forEach(function(x){if(opts.size<4){const k=ckDigital(x[0],x[1]);if(!opts.has(k)&&x[0]>=1&&x[0]<=12)opts.set(k,false);}});
 let g=0;while(opts.size<4&&g++<40){const k=ckDigital(1+rnd(12),pick(ckMinutesFor(4)));if(!opts.has(k))opts.set(k,false);}
 const list=shuffled([...opts.keys()]);CKR.list=list;CKR.a=list.indexOf(ckDigital(t.h,t.m));
 render(topbar("screenClockLab()")
  +'<div class="progressdots">'+dots(CKR.total,CKR.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:4px">👀 ¿Qué hora marca el reloj?</h2>'
  +'<p class="center" style="font-size:.82rem;margin-bottom:6px">Primero mira la aguja <span style="color:#EF4444;font-weight:700">corta</span> (hora) y luego la <span style="color:#3B82F6;font-weight:700">larga</span> (minutos)</p>'
  +'<div class="card" style="padding:12px">'+ckFace("ckR",t.h,t.m,260)+'</div>'
  +'<div class="choices2">'+list.map(function(o,i){return '<button class="kbtn white" style="font-size:1.4rem;font-family:Fredoka" onclick="ckReadAns('+i+')">'+o+'</button>';}).join("")+'</div>');}
function ckReadAns(i){
 const ok=i===CKR.a;recordAnswer("El reloj",ok,15);ckBump(ok);
 const said=ckWords(CKR.t.h,CKR.t.m);
 if(ok){sOK();confetti(8);CKR.ok++;toast("¡Correcto! "+said+" 🎉",true,1500);}
 else{sNO();toast("Era "+ckDigital(CKR.t.h,CKR.t.m)+" — "+said.toLowerCase()+". La aguja corta marca la hora y la larga los minutos.",false,3600);}
 speakES(said);CKR.round++;setTimeout(ckReadNext,ok?1400:3800);}

/* ---------- 4) rutinas del día ---------- */
const CK_ROUT=[
 {e:"🍳",t:"desayunamos",h:7,m:0},{e:"🏫",t:"entramos al colegio",h:7,m:30},{e:"🍽️",t:"almorzamos",h:12,m:0},
 {e:"⚽",t:"jugamos afuera",h:4,m:0},{e:"📚",t:"hacemos las tareas",h:3,m:30},{e:"🛁",t:"nos bañamos",h:6,m:30},
 {e:"🌙",t:"nos vamos a dormir",h:8,m:0},{e:"🥪",t:"merendamos",h:5,m:0},{e:"📺",t:"vemos dibujos",h:5,m:30},
 {e:"🌅",t:"nos despertamos",h:6,m:0},{e:"🚌",t:"salimos del colegio",h:1,m:30},{e:"🧸",t:"hacemos la siesta",h:2,m:0},
 {e:"🎂",t:"cantamos el cumpleaños",h:4,m:15},{e:"🎬",t:"vemos la película",h:8,m:45},{e:"🥛",t:"tomamos la leche",h:9,m:15},{e:"🚿",t:"nos lavamos los dientes",h:7,m:45}];
let CKO={};
function ckRoutStart(){setTheme("kid");
 const lv=ckLevel();const ms=ckMinutesFor(Math.max(2,lv));
 CKO={round:0,ok:0,total:6,pool:shuffled(CK_ROUT.filter(function(r){return ms.indexOf(r.m)>=0;}))};
 ckRoutNext();}
function ckRoutNext(){
 if(CKO.round>=CKO.total||CKO.round>=CKO.pool.length)return nodeWin(starsFor(CKO.ok,CKO.total),"Rutinas del día");
 const r=CKO.pool[CKO.round];CKO.r=r;
 const opts=[{h:r.h,m:r.m,ok:true}];
 let g=0;while(opts.length<3&&g++<50){const h=Math.random()<.5?r.h:1+rnd(12),m=Math.random()<.5?r.m:pick(ckMinutesFor(3));
  if(!opts.some(function(o){return o.h===h&&o.m===m;})&&!(h===r.h&&m===r.m))opts.push({h:h,m:m,ok:false});}
 const list=shuffled(opts);CKO.list=list;
 render(topbar("screenClockLab()")
  +'<div class="progressdots">'+dots(CKO.total,CKO.round)+'</div>'
  +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:4px">'+r.e+' ¿Cuál reloj es?</h2>'
  +'<div class="card center" style="padding:12px 14px"><p style="font-size:1.1rem;line-height:1.5;margin:0">Todos los días <b>'+r.t+'</b> a <b>'+ckWords(r.h,r.m).toLowerCase()+'</b>.</p></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">'+list.map(function(o,i){return '<button onclick="ckRoutAns('+i+')" style="border:3px solid var(--kid-ink);border-radius:16px;background:#fff;padding:6px;box-shadow:0 5px 0 rgba(30,42,74,.5)">'+ckFace("ckO"+i,o.h,o.m,100)+'</button>';}).join("")+'</div>');
 speakES("Todos los días "+r.t+" a "+ckWords(r.h,r.m).toLowerCase());}
function ckRoutAns(i){
 if(CKO.answered===CKO.round)return;CKO.answered=CKO.round;
 const ok=CKO.list[i].ok;recordAnswer("El reloj",ok,12);ckBump(ok);
 if(ok){sOK();confetti(8);CKO.ok++;toast("¡Ese es! 🎉",true,1100);}
 else{sNO();toast("Busca el reloj de "+ckDigital(CKO.r.h,CKO.r.m)+": la corta en el "+CKO.r.h+" y la larga en el "+(CKO.r.m/5||12),false,3200);}
 CKO.round++;setTimeout(ckRoutNext,ok?1200:3400);}
