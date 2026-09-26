"use strict";
/* ============ MISIONES CON DECISIONES (historias donde eliges y aprendes) ============
   Pedido: "el planetario no es interactivo ni educativo, siempre es lo mismo — colocar historias de
   tomar decisiones o hacer misiones aprendiendo". Un motor de historias por nodos (texto con
   opciones, preguntas que abren el camino, finales distintos) y 3 GENERADORES que arman la
   historia al azar cada vez (planetas, preguntas y desenlace cambian), para que no se repita:
     🚀 Misión espacial · 🧬 Viaje por el cuerpo · 🕰️ La ciudad sin hora
   Un narrador 3D (guide3d.js) habla en cada pantalla. Equivocarse nunca bloquea: cuesta energía y
   se explica por qué; si se acaba la energía la historia sigue con un final más corto. */

let SM=null;
const SM_GUIDES={space:{gi:3,nm:"Astro"},body:{gi:1,nm:"Búho Sabio"},clock:{gi:0,nm:"Robo"}};
const PL_EMOJI={mercurio:"⚪",venus:"🟡",tierra:"🌍",marte:"🔴",jupiter:"🟠",saturno:"🪐",urano:"🔵",neptuno:"🔷"};

function smShuffleQ(q){const ops=shuffled(q.ops.map(function(o,i){return{t:o,ok:i===q.a};}));return ops;}

/* ---------- motor ---------- */
function missionStart(kind){
 setTheme("kid");
 const gen={space:genSpaceMission,body:genBodyMission,clock:genClockMission}[kind];
 SM=gen();SM.kind=kind;SM.vars=Object.assign({energia:4,estrellas:0,pistas:0},SM.vars||{});SM.cur=SM.start;SM.pending=null;
 renderMission();}
function smBars(){const v=SM.vars;
 return '<div style="display:flex;gap:14px;justify-content:center;font-family:Fredoka;font-weight:700;margin:6px 0">'
  +'<span title="energía">⚡ '+"■".repeat(Math.max(0,v.energia))+'<span style="opacity:.25">'+"■".repeat(Math.max(0,4-v.energia))+'</span></span>'
  +'<span>⭐ '+v.estrellas+'</span><span>🔎 '+v.pistas+'</span></div>';}
function smHeader(n){
 const g=SM_GUIDES[SM.kind];
 return '<div style="display:flex;align-items:center;gap:8px">'
  +'<div id="msGuide" style="width:104px;height:120px;flex:0 0 104px"></div>'
  +'<div style="flex:1;background:#fff;border:3px solid var(--kid-ink);border-radius:18px;padding:10px 12px;box-shadow:0 4px 0 rgba(30,42,74,.35);position:relative"><b style="font-family:Fredoka">'+g.nm+':</b> <span id="msText">'+n.text+'</span></div></div>';}
function renderMission(){
 const n=SM.nodes[SM.cur];
 if(n.kind==="end")return missionEnd(n);
 let body="";
 if(n.pic)body+='<div class="card center" style="padding:8px">'+n.pic+'</div>';
 else if(n.scene)body+='<div class="center" style="font-size:clamp(3rem,16vw,4.6rem);line-height:1.1;margin:4px 0">'+n.scene+'</div>';
 if(n.kind==="quiz"){
  SM.opts=smShuffleQ(n.q);SM.answered=false;
  body+='<div class="card"><p style="font-family:Fredoka;font-weight:700;text-align:center;margin-bottom:10px">🧩 '+n.q.q+'</p>'
   +SM.opts.map(function(o,i){return '<button class="kbtn white" style="margin-bottom:8px" onclick="missionAnswer('+i+')">'+o.t+'</button>';}).join("")+'</div>'
   +'<div id="msFeedback"></div>';
 }else{
  body+=(n.choices||[]).map(function(c,i){return '<button class="kbtn '+(c.cls||"green")+'" style="margin-bottom:8px" onclick="missionChoose('+i+')">'+c.t+'</button>';}).join("");
 }
 render(topbar("screenMissions()")+smHeader(n)+smBars()+body
  +'<button class="speaker small" onclick="speakES(document.getElementById(\'msText\').innerText)">🔊 Escuchar</button>');
 if(typeof render3DGuide==="function")render3DGuide("msGuide",SM_GUIDES[SM.kind].gi);}
function smApply(fx){if(!fx)return;for(const k in fx)SM.vars[k]=(SM.vars[k]||0)+fx[k];}
function smGo(id,fx){
 smApply(fx);
 if(SM.vars.energia<=0&&SM.nodes[id]&&SM.nodes[id].kind!=="end"&&SM.fail)id=SM.fail;
 SM.cur=id;renderMission();}
function missionChoose(i){const c=SM.nodes[SM.cur].choices[i];smGo(c.go,c.fx);}
function missionAnswer(i){
 if(SM.answered)return;SM.answered=true;
 const n=SM.nodes[SM.cur],ok=SM.opts[i].ok,r=ok?n.ok:n.bad;
 recordAnswer(SM.subject||"Misión",ok,12);
 if(ok){sOK();confetti(8);}else sNO();
 SM.pending=r;
 const rightTxt=n.q.ops[n.q.a];
 const fb=document.getElementById("msFeedback");
 if(fb)fb.innerHTML='<div class="card" style="background:'+(ok?"#DCFCE7":"#FEE2E2")+';border:3px solid '+(ok?"#16A34A":"#DC2626")+'">'
  +'<b>'+(ok?"✅ ":"❌ ")+r.msg+'</b>'+(ok?"":'<p style="margin:6px 0 0">Respuesta: <b>'+rightTxt+'</b></p>')
  +(n.q.exp?'<p style="margin:6px 0 0">💡 '+n.q.exp+'</p>':'')+'</div>'
  +'<button class="kbtn green" onclick="missionNext()">Continuar ▶️</button>';
 const btns=document.querySelectorAll(".card .kbtn");btns.forEach(function(b,k){if(k===i)b.style.borderColor=ok?"#16A34A":"#DC2626";});
 if(n.q.exp)speakES((ok?"¡Correcto! ":"Casi. ")+n.q.exp);}
function missionNext(){const r=SM.pending;if(!r)return;SM.pending=null;smGo(r.go,r.fx);}
function missionEnd(n){
 const e=n.end(SM.vars);
 render(topbar("screenMissions()")+smHeader({text:e.text})
  +'<div class="center" style="font-size:clamp(3rem,16vw,4.6rem);margin:6px 0">'+e.scene+'</div>'+smBars()
  +'<div class="card center"><b style="font-size:1.2rem">'+e.title+'</b><p style="margin-top:6px">'+e.sum+'</p><p style="font-size:1.6rem">'+"⭐".repeat(e.stars)+'</p></div>'
  +'<button class="kbtn green" onclick="missionFinish('+e.stars+')">🏆 ¡Misión cumplida!</button>'
  +'<button class="kbtn white" onclick="missionStart(SM.kind)">🔁 Otra misión distinta</button>');
 if(typeof render3DGuide==="function")render3DGuide("msGuide",SM_GUIDES[SM.kind].gi);
 speakES(e.text);}
function missionFinish(stars){const p=prof();p.missionsDone=(p.missionsDone||0)+1;save();nodeWin(stars,SM.title);}

/* ---------- menú ---------- */
function screenMissions(){setTheme("kid");const p=prof();
 const card=function(cls,ic,t,sub,k){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="missionStart(\''+k+'\')"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenSpace()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🗺️ Misiones</h2>'
  +'<p class="center" style="margin-bottom:12px">Tú decides el camino y aprendes en el viaje. Cada misión es distinta. Misiones cumplidas: <b>'+(p.missionsDone||0)+'</b></p>'
  +card("blue","🚀","Misión espacial: rescata a Astro","Viaja por el sistema solar, explora planetas y busca pistas","space")
  +card("red","🧬","Viaje por el cuerpo","Encógete y navega por dentro del cuerpo de Lía","body")
  +card("yellow","🕰️","La ciudad sin hora","El reloj de la torre se detuvo: ayuda a los vecinos","clock"));}

/* ---------- 🚀 generador: misión espacial ---------- */
function genSpaceMission(){
 const P=window.PLANETS||[];const pick3=shuffled(P).slice(0,3);
 const nodes={};
 nodes.intro={kind:"text",scene:"🚀",text:"¡Alerta, capitán! El astronauta Astro perdió la señal de radio en algún lugar del sistema solar. Tu energía ⚡ es limitada: ¡cuídala! Visitaremos 3 planetas buscando pistas.",choices:[{t:"🚀 ¡Despegar!",go:"p0"}]};
 pick3.forEach(function(pl,i){
  const after=i===0?"p1":i===1?"radio":"ayuda";
  nodes["p"+i]={kind:"text",scene:PL_EMOJI[pl.id]||"🪐",
   text:"Llegamos a "+pl.nm+". "+pick(pl.facts)+" ¿Qué hacemos?",
   choices:[{t:"🔍 Explorar "+pl.nm+" (cuesta 1 ⚡)",go:"q"+i,fx:{energia:-1}},{t:"➡️ Seguir de largo (ahorras energía)",go:after,cls:"yellow"}]};
  const q=pick(pl.q);
  nodes["q"+i]={kind:"quiz",scene:PL_EMOJI[pl.id]||"🪐",text:"El radar detecta algo en "+pl.nm+". Responde para descifrar la pista.",q:q,
   ok:{go:after,fx:{estrellas:1,pistas:1},msg:"¡Pista encontrada! El mensaje de Astro pasó por aquí."},
   bad:{go:after,fx:{energia:-1},msg:"¡Meteoritos! Los esquivas, pero pierdes 1 ⚡."}};
 });
 nodes.radio={kind:"text",scene:"📡",text:"Se escucha una señal débil de radio… viene de dos direcciones. Puedes pedirle ayuda a la Base (aprendes algo) o gastar energía en seguir la señal tú mismo.",
  choices:[{t:"📞 Llamar a la Base",go:"p2",fx:{estrellas:1}},{t:"📡 Seguir la señal (cuesta 1 ⚡)",go:"p2",fx:{energia:-1,pistas:1},cls:"yellow"}]};
 nodes.ayuda={kind:"text",scene:"🧑‍🚀",text:"¡Ahí está Astro! Está a salvo, pero muy cansado y su nave casi no tiene energía. Tú también vas justo. ¿Le compartes tu energía?",
  choices:[{t:"🤝 Compartir mi energía con Astro",go:"fin",fx:{estrellas:1,energia:-1},cls:"green"},{t:"🛰️ Remolcarlo con cuidado sin gastar energía",go:"fin",cls:"blue"}]};
 nodes.fin={kind:"end",end:function(v){
  const st=Math.max(1,Math.min(3,1+(v.estrellas>=3?1:0)+(v.estrellas>=5?1:0)));
  return{scene:"🌟",title:v.pistas>=2?"¡Rescataste a Astro!":"¡Astro está a salvo!",stars:st,
   text:v.pistas>=2?"¡Lo lograste, capitán! Seguiste las pistas y encontraste a Astro justo a tiempo.":"Astro casi se pierde, pero al final lo encontraste. ¡La próxima vez explora más planetas!",
   sum:"Pistas: "+v.pistas+" · Estrellas: "+v.estrellas+" · Visitaste: "+pick3.map(function(p){return p.nm;}).join(", ")+"."};}};
 nodes.sinEnergia={kind:"end",end:function(v){return{scene:"🛰️",title:"Te quedaste sin energía",stars:1,
  text:"¡Uy! Tu nave se quedó sin energía, pero una nave de la Base vino a remolcarte. Aprendiste mucho del viaje.",sum:"Pistas: "+v.pistas+" · Estrellas: "+v.estrellas+"."};}};
 return{title:"Misión espacial",subject:"Espacio",start:"intro",nodes:nodes,fail:"sinEnergia"};}

/* ---------- 🧬 generador: viaje por el cuerpo ---------- */
const BODY_TOURS={
 digestivo:{nm:"por la boca (sistema digestivo)",entrada:"👄",stops:[
  {nm:"la boca",e:"👄",tx:"Los dientes muerden la comida y la saliva la ablanda.",q:{q:"¿Qué hacen los dientes?",ops:["Trituran la comida","Bombean sangre","Ayudan a respirar","Piensan"],a:0,exp:"Los dientes cortan y trituran la comida para tragarla."}},
  {nm:"el estómago",e:"🍔",tx:"El estómago mezcla la comida con jugos que la deshacen.",q:{q:"¿Qué órgano mezcla la comida con jugos ácidos?",ops:["El estómago","El corazón","Los pulmones","El cerebro"],a:0,exp:"El estómago mezcla y deshace la comida."}},
  {nm:"el intestino",e:"🌀",tx:"En el intestino, los nutrientes pasan a la sangre.",q:{q:"¿Dónde pasan los nutrientes de la comida a la sangre?",ops:["En el intestino","En los pulmones","En el cerebro","En la nariz"],a:0,exp:"Los nutrientes se absorben en el intestino."}}]},
 respiratorio:{nm:"por la nariz (sistema respiratorio)",entrada:"👃",stops:[
  {nm:"la nariz",e:"👃",tx:"En la nariz, unos pelitos y el moco limpian el aire.",q:{q:"¿Por dónde entra el aire cuando respiramos?",ops:["Por la nariz","Por las orejas","Por los ojos","Por los codos"],a:0,exp:"El aire entra por la nariz (y también por la boca)."}},
  {nm:"la tráquea",e:"🌬️",tx:"La tráquea es un tubo que lleva el aire hacia los pulmones.",q:{q:"¿Cómo se llama el tubo que lleva el aire a los pulmones?",ops:["Tráquea","Esófago","Vena","Hueso"],a:0,exp:"La tráquea lleva el aire a los pulmones."}},
  {nm:"los pulmones",e:"🫁",tx:"En los pulmones, el oxígeno del aire pasa a la sangre.",q:{q:"¿Qué órganos usamos para respirar?",ops:["Los pulmones","Los riñones","Los músculos","Los dientes"],a:0,exp:"Los pulmones toman el oxígeno del aire."}}]},
 circulatorio:{nm:"por una vena (sistema circulatorio)",entrada:"🩸",stops:[
  {nm:"el corazón",e:"❤️",tx:"El corazón es una bomba que empuja la sangre por todo el cuerpo.",q:{q:"¿Qué órgano bombea la sangre?",ops:["El corazón","El estómago","El cerebro","Los pulmones"],a:0,exp:"El corazón late y bombea la sangre."}},
  {nm:"los vasos sanguíneos",e:"🛣️",tx:"La sangre viaja por unos tubitos llamados vasos sanguíneos.",q:{q:"¿Por dónde viaja la sangre?",ops:["Por los vasos sanguíneos","Por los huesos","Por los dientes","Por el pelo"],a:0,exp:"Las arterias y las venas son vasos sanguíneos."}},
  {nm:"una célula",e:"🔬",tx:"La sangre lleva oxígeno y alimento a cada parte del cuerpo.",q:{q:"¿Qué lleva la sangre a todo el cuerpo?",ops:["Oxígeno y alimento","Solo agua","Aire frío","Ropa"],a:0,exp:"La sangre reparte oxígeno y alimento a todas las células."}}]}
};
function genBodyMission(){
 const keys=Object.keys(BODY_TOURS);const nodes={};
 nodes.intro={kind:"text",scene:"🧬",text:"¡Doctor explorador! Lía se siente cansada y tu nave puede encogerse para viajar por dentro de su cuerpo. Tu energía ⚡ es limitada: ¡cuídala! ¿Por dónde entramos?",
  choices:keys.map(function(k){return{t:BODY_TOURS[k].entrada+" Entrar "+BODY_TOURS[k].nm,go:k+"0",cls:k==="digestivo"?"yellow":k==="respiratorio"?"blue":"red"};})};
 keys.forEach(function(k){
  const T=BODY_TOURS[k];
  T.stops.forEach(function(s,i){
   const after=i<2?k+(i+1):k+"virus";
   nodes[k+i]={kind:"text",scene:s.e,text:"Estamos en "+s.nm+". "+s.tx+" ¿Qué hacemos?",
    choices:[{t:"🔬 Investigar (cuesta 1 ⚡)",go:k+"q"+i,fx:{energia:-1}},{t:"➡️ Avanzar sin investigar",go:after,cls:"yellow"}]};
   nodes[k+"q"+i]={kind:"quiz",scene:s.e,text:"Tu escáner muestra un acertijo sobre "+s.nm+".",q:s.q,
    ok:{go:after,fx:{estrellas:1,pistas:1},msg:"¡Muy bien! Descubres cómo funciona "+s.nm+"."},
    bad:{go:after,fx:{energia:-1},msg:"Se te cruza una burbuja y gastas 1 ⚡ esquivándola."}};
  });
  nodes[k+"virus"]={kind:"text",scene:"🦠",text:"¡Cuidado! Un microbio se cruza en el camino. ¿Qué haces?",
   choices:[{t:"🛡️ Llamar a los glóbulos blancos (los defensores del cuerpo)",go:"fin",fx:{estrellas:1,pistas:1}},{t:"🚀 Esquivarlo con la nave (cuesta 1 ⚡)",go:"fin",fx:{energia:-1},cls:"yellow"}]};
 });
 nodes.fin={kind:"end",end:function(v){
  const st=Math.max(1,Math.min(3,1+(v.estrellas>=3?1:0)+(v.estrellas>=4?1:0)));
  return{scene:"💪",title:"¡Lía se siente mucho mejor!",stars:st,text:v.pistas>=2?"¡Gracias, doctor explorador! Entendiste cómo funciona el cuerpo y Lía ya tiene energía para jugar.":"Lía se siente mejor. Con más viajes entenderás aún más cosas del cuerpo.",sum:"Descubrimientos: "+v.pistas+" · Estrellas: "+v.estrellas+"."};}};
 nodes.sinEnergia={kind:"end",end:function(v){return{scene:"🩺",title:"Nave sin energía",stars:1,text:"Tu nave se quedó sin energía, pero los doctores de la Base la recargaron. ¡Aprendiste mucho del viaje!",sum:"Descubrimientos: "+v.pistas+"."};}};
 return{title:"Viaje por el cuerpo",subject:"Cuerpo",start:"intro",nodes:nodes,fail:"sinEnergia"};}

/* ---------- 🕰️ generador: la ciudad sin hora ---------- */
function smClockQ(h,m){
 const ans=ckDigital(h,m);const opts=[ans];
 [[m===0?12:(m/5)||12,(h*5)%60],[(h%12)+1,m],[((h+10)%12)+1,m],[h,(m+30)%60],[h,(m+15)%60]].forEach(function(x){const k=ckDigital(x[0],x[1]);if(opts.length<4&&opts.indexOf(k)<0&&x[0]>=1&&x[0]<=12)opts.push(k);});
 let g=0;while(opts.length<4&&g++<30){const k=ckDigital(1+rnd(12),pick(ckMinutesFor(4)));if(opts.indexOf(k)<0)opts.push(k);}
 return{q:"¿Qué hora marca el reloj?",ops:opts,a:0,exp:"La aguja corta marca la hora ("+h+") y la larga los minutos: "+ckWords(h,m).toLowerCase()+"."};}
function genClockMission(){
 const folks=shuffled([{e:"🥖",w:"la panadera",n:"necesita saber a qué hora sacar el pan"},{e:"🏫",w:"el profe",n:"no sabe cuándo empieza la clase"},{e:"🎪",w:"el payaso",n:"quiere saber cuándo empieza la función"},{e:"🚌",w:"el conductor",n:"tiene que salir a tiempo con el bus"},{e:"🍰",w:"la cocinera",n:"debe sacar el pastel del horno"}]).slice(0,3);
 const ms=ckMinutesFor(Math.max(2,ckLevel()));
 const nodes={};
 nodes.intro={kind:"text",scene:"🕰️",text:"¡Bienvenido a Villa Tic-Tac! El reloj de la torre se detuvo y nadie sabe qué hora es. Tu energía ⚡ es limitada: ¡cuídala! Ayuda a los vecinos leyendo sus relojes!",choices:[{t:"🏙️ ¡Vamos a ayudar!",go:"v0"}]};
 folks.forEach(function(f,i){
  const h=1+rnd(12),m=pick(ms),after=i<2?"v"+(i+1):"torre";
  nodes["v"+i]={kind:"text",scene:f.e,text:"Hola, soy "+f.w+" y "+f.n+". ¿Me ayudas a leer mi reloj?",
   choices:[{t:"🕐 Leer su reloj (cuesta 1 ⚡)",go:"q"+i,fx:{energia:-1}},{t:"🚶 Buscar a otro vecino",go:after,cls:"yellow"}]};
  nodes["q"+i]={kind:"quiz",scene:f.e,pic:ckFace("ckM"+i,h,m,190),text:"Mira bien las agujas: la corta es la hora y la larga son los minutos.",q:smClockQ(h,m),
   ok:{go:after,fx:{estrellas:1,pistas:1},msg:"¡Sí! Es la hora correcta y "+f.w+" te da las gracias."},
   bad:{go:after,fx:{energia:-1},msg:"Uy, no era esa. Pierdes 1 ⚡ pensando otra vez."}};
 });
 nodes.torre={kind:"text",scene:"🕰️",text:"Llegas a la torre del reloj. Con la ayuda de los vecinos ya sabes la hora. ¿Cómo arreglas el reloj?",
  choices:[{t:"🔧 Arreglarlo con calma, paso a paso",go:"fin",fx:{estrellas:1}},{t:"⚡ Darle un golpecito rápido (cuesta 1 ⚡)",go:"fin",fx:{energia:-1},cls:"yellow"}]};
 nodes.fin={kind:"end",end:function(v){
  const st=Math.max(1,Math.min(3,1+(v.estrellas>=3?1:0)+(v.estrellas>=4?1:0)));
  return{scene:"🔔",title:"¡El reloj vuelve a sonar!",stars:st,text:v.pistas>=2?"¡Tic-tac, tic-tac! Gracias a ti, Villa Tic-Tac ya sabe la hora otra vez.":"El reloj funciona, aunque a algunos vecinos se les hizo tarde. ¡La próxima vez lee más relojes!",sum:"Relojes leídos bien: "+v.pistas+" · Estrellas: "+v.estrellas+"."};}};
 nodes.sinEnergia={kind:"end",end:function(v){return{scene:"⏰",title:"¡Se acabó el tiempo!",stars:1,text:"Te quedaste sin energía, pero los vecinos terminaron el arreglo contigo. ¡Aprendiste a leer la hora!",sum:"Relojes leídos bien: "+v.pistas+"."};}};
 return{title:"La ciudad sin hora",subject:"El reloj",start:"intro",nodes:nodes,fail:"sinEnergia"};}
