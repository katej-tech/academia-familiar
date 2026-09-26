"use strict";
/* ============ CUIDA EL PLANETA (un Tamagotchi ecológico) ============
   Pedido: "un juego para cuidar el planeta, así como se cuida el tamagotchi". Igual que la mascota
   (pet.js), las necesidades del planeta BAJAN con las horas reales (así el niño vuelve cada día),
   pero cuidarlo es aprender: cada necesidad se atiende con un reto corto de 5 preguntas sobre
   reciclaje, agua, bosques, aire o energía (con el porqué de cada respuesta) y el planeta 3D
   (ecoplanet3d.js) se ve sano o enfermo según cómo esté. Además hay una TAREA REAL del día
   (cerrar el grifo, apagar la luz…) que se marca cuando se hace de verdad. */

const ECO_NEEDS=[
 {k:"forest",ic:"🌳",nm:"Bosques",cat:"bosques",btn:"Plantar y proteger",color:"#3EC97C",tired:"Tu planeta necesita más árboles 🌳"},
 {k:"water",ic:"💧",nm:"Agua limpia",cat:"agua",btn:"Cuidar el agua",color:"#38BDF8",tired:"¡Tu planeta tiene sed y el agua está sucia! 💧"},
 {k:"air",ic:"🌬️",nm:"Aire limpio",cat:"aire",btn:"Limpiar el aire",color:"#A78BFA",tired:"Hay mucho humo: ¡tu planeta tose! 🌫️"},
 {k:"clean",ic:"🗑️",nm:"Sin basura",cat:"reciclaje",btn:"Reciclar",color:"#F59E0B",tired:"Hay basura flotando por todos lados 🗑️"},
 {k:"energy",ic:"☀️",nm:"Energía limpia",cat:"energia",btn:"Energía limpia",color:"#FBBF24",tired:"Necesita energía limpia: sol y viento ☀️💨"}];
const ECO_RATE={air:2,water:2.8,forest:1.8,clean:3,energy:1.8};   /* puntos que pierde por hora */
function ecoClamp(v){return Math.max(0,Math.min(100,Math.round(v)));}
function ecoState(){const p=prof();return p&&p.eco?p.eco:null;}
function ecoHealth(e){return Math.round((e.air+e.water+e.forest+e.clean+e.energy)/5);}
function ecoTick(){
 const e=ecoState();if(!e)return;
 const now=Date.now(),h=Math.min(48,Math.max(0,(now-(e.lastTs||now))/3600000));
 if(h<.0003){e.lastTs=now;return;}
 ECO_NEEDS.forEach(function(n){e[n.k]=ecoClamp(e[n.k]-ECO_RATE[n.k]*h);});
 e.lastTs=now;save();}
function ecoMood(e){
 const hp=ecoHealth(e);
 if(hp>=80)return{f:"🥰",msg:"¡"+e.name+" está feliz y sano!"};
 if(hp>=60)return{f:"🙂",msg:e.name+" está bien, pero necesita cariño"};
 if(hp>=35)return{f:"😟",msg:e.name+" se siente mal…"};
 return{f:"🤒",msg:"¡"+e.name+" está enfermo! ¡Cuídalo ya!"};}
function ecoLowest(e){return ECO_NEEDS.slice().sort(function(a,b){return e[a.k]-e[b.k];})[0];}

/* ---------- bancos de preguntas: [emoji, pregunta, correcta, mala1, mala2, mala3, porqué] ---------- */
const ECO_BINS=["🟢 Verde: orgánicos","⚪ Blanco: reciclables","⚫ Negro: no reciclables","🔴 Rojo: peligrosos"];
const ECO_SORT=[
 ["🍌","la cáscara de banano",0,"Los restos de comida y plantas se vuelven abono."],
 ["🍶","una botella de plástico",1,"El plástico limpio se recicla y vuelve a ser botella u otros objetos."],
 ["📰","un periódico",1,"El papel y el cartón secos y limpios se reciclan."],
 ["🧻","una servilleta usada",2,"El papel sucio o grasoso ya no se puede reciclar."],
 ["🔋","una pila",3,"Las pilas tienen metales tóxicos: se llevan a un punto de recolección."],
 ["🥫","una lata",1,"El metal se recicla una y otra vez."],
 ["🍂","las hojas secas",0,"Las hojas son orgánicas: se convierten en abono."],
 ["📦","una caja de cartón",1,"El cartón se recicla, pero aplastado y seco."],
 ["💡","un bombillo ahorrador",3,"Contiene mercurio: es un residuo peligroso."],
 ["🍾","una botella de vidrio",1,"El vidrio se recicla infinitas veces."],
 ["🍎","el corazón de una manzana",0,"Los restos de fruta son orgánicos."],
 ["🧴","un envase de champú vacío",1,"Los envases de plástico se enjuagan y se reciclan."]];
const ECO_BANK={
 agua:[
  ["🪥","Mientras te cepillas los dientes, el grifo debe estar…","cerrado","abierto","a medias","abierto y con música","Cerrar el grifo mientras te cepillas ahorra hasta 12 litros de agua."],
  ["🚿","Para ahorrar agua es mejor…","una ducha corta","una ducha muy larga","llenar la bañera","dejar la ducha corriendo","Una ducha corta gasta mucho menos agua que una larga."],
  ["💧","Si ves un grifo que gotea, lo mejor es…","avisar a un adulto para arreglarlo","dejarlo así","abrirlo más","taparlo con un trapo","Un grifo goteando puede desperdiciar cientos de litros al mes."],
  ["🌧️","El agua de la lluvia se puede…","recoger para regar plantas","tirar siempre","pisar y ya","dejar que se pierda","Recoger lluvia ayuda a ahorrar agua potable."],
  ["🌊","¿Qué NO debemos tirar a los ríos y al mar?","basura y aceite","hojas caídas","agua limpia","nada de eso importa","La basura y el aceite ensucian el agua y dañan a los peces."],
  ["🌱","¿A qué hora es mejor regar las plantas?","temprano en la mañana","al mediodía con sol fuerte","a las 2 de la tarde","nunca","Por la mañana el agua no se evapora tan rápido."],
  ["🐟","¿Por qué hay que cuidar los ríos?","ahí viven peces y otros animales","porque son bonitos y ya","no hay motivo","porque hacen ruido","Los ríos son casa de muchos animales y nos dan agua."],
  ["🧼","Para lavar los platos ahorras agua si…","los enjabonas y luego los enjuagas","dejas el agua corriendo","los lavas uno por uno con la llave abierta","no los lavas","Cerrar la llave mientras enjabonas ahorra mucha agua."],
  ["🌍","El agua dulce que podemos tomar en la Tierra es…","muy poca","muchísima","infinita","la mitad","Solo una pequeña parte del agua del planeta es dulce y potable: ¡hay que cuidarla!"],
  ["🚰","¿Se puede tomar agua de un río sucio?","no, puede enfermarnos","sí, siempre","solo si tiene sabor","sí, si tienes sed","El agua sucia tiene microbios que enferman."]],
 bosques:[
  ["🌳","¿Qué gas nos dan los árboles para respirar?","oxígeno","humo","polvo","nada","Los árboles producen oxígeno y absorben dióxido de carbono."],
  ["🌲","¿Qué gas absorben los árboles del aire?","dióxido de carbono","oxígeno","agua","arena","Al absorber CO₂ ayudan a enfriar el planeta."],
  ["🔥","Un incendio en el bosque puede empezar por…","una fogata o una colilla mal apagada","la lluvia","la luna","un pájaro cantando","Nunca dejes fuego encendido en el campo."],
  ["🐝","Las abejas ayudan al bosque porque…","llevan polen de flor en flor","hacen ruido","cortan árboles","se comen las hojas","Al polinizar, las abejas hacen que haya frutos y semillas."],
  ["🦉","¿Quiénes viven en el bosque?","muchos animales y plantas","solo carros","nadie","solo computadores","El bosque es el hogar de miles de especies."],
  ["🌱","Las raíces de los árboles sirven para…","sostener el suelo y tomar agua","hacer sombra","cantar","brillar","Las raíces evitan que la tierra se deslice con la lluvia."],
  ["🧺","Si vas de paseo al campo, la basura…","te la llevas contigo","la escondes en un arbusto","la tiras al río","la entierras","¡Lo que llevas, te lo traes de vuelta!"],
  ["📄","Reciclar papel ayuda a…","salvar árboles","gastar más","hacer más basura","secar ríos","Reciclar una tonelada de papel ahorra muchos árboles."],
  ["🌼","Si ves una flor en el parque, es mejor…","dejarla para que otros la vean","arrancarla toda","pisarla","llevártela siempre","Las flores dan comida a abejas y mariposas."],
  ["🌴","Plantar un árbol es bueno porque…","limpia el aire y da sombra y casa","hace más ruido","no sirve","gasta agua para nada","Un árbol limpia el aire durante toda su vida."]],
 aire:[
  ["🚲","Para ir a un lugar cerquita, lo que menos contamina es…","caminar o ir en bici","ir en carro","ir en moto","ir en avión","Caminar y la bici no producen humo."],
  ["🏭","El humo de las fábricas y los carros ensucia el…","aire","suelo de la casa","teléfono","agua de la piscina","Respirar aire sucio enferma los pulmones."],
  ["🌳","¿Qué ayuda a limpiar el aire?","los árboles","el humo","la basura quemada","los aerosoles","Las hojas atrapan polvo y absorben gases."],
  ["🚌","Usar el bus en vez de muchos carros…","reduce la contaminación","la aumenta","no cambia nada","hace más humo","Un bus lleva a muchas personas con un solo motor."],
  ["🔥","Quemar basura…","contamina mucho el aire","es lo mejor","limpia el planeta","no hace humo","Al quemar plástico salen gases tóxicos."],
  ["⚡","Un carro eléctrico contamina…","menos por la calle","más que uno de gasolina","igual","lo mismo que un tractor","No echa humo por el escape."],
  ["🌡️","¿Qué gas de las fábricas calienta el planeta?","dióxido de carbono (CO₂)","oxígeno","agua","helio","El exceso de CO₂ atrapa el calor: es el calentamiento global."],
  ["🏠","Si hay humo, lo mejor es…","alejarte y avisar a un adulto","respirarlo hondo","jugar cerca","taparlo con la mano","El humo hace daño; pide ayuda."],
  ["🌬️","El viento limpio sirve para…","dar energía en molinos","ensuciar","nada","hacer basura","Los molinos convierten el viento en electricidad sin humo."],
  ["🧒","¿Quién puede ayudar a tener aire limpio?","todos, hasta los niños","solo los científicos","nadie","solo los adultos","Cada pequeña acción cuenta: caminar, plantar, apagar luces."]],
 energia:[
  ["☀️","¿Cuál es una energía limpia?","la del sol (solar)","el carbón","el petróleo","la gasolina","El sol es una fuente renovable que no contamina."],
  ["💡","Al salir de un cuarto, la luz debe quedar…","apagada","encendida","parpadeando","prendida de día","Apagar la luz ahorra energía."],
  ["🔆","¿Qué gasta menos energía?","el bombillo LED","el bombillo viejo","una vela","ninguno","Los LED gastan hasta 80% menos."],
  ["💨","La energía que se saca del viento se llama…","eólica","volcánica","de gasolina","de carbón","Los molinos de viento generan energía eólica."],
  ["🔌","Los cargadores conectados sin usar…","siguen gastando un poquito","no gastan nada","limpian el aire","se cargan solos","Desconéctalos cuando no los uses."],
  ["🛢️","¿Cuál energía se acaba y contamina?","el petróleo","el sol","el viento","el agua que cae","El petróleo y el carbón no son renovables."],
  ["🪟","De día, para ahorrar luz, conviene…","abrir las cortinas","prender todas las luces","cerrar todo","usar linterna","La luz natural es gratis y limpia."],
  ["🧊","Si dejas la nevera abierta mucho rato…","gasta más energía","se enfría más rápido","no pasa nada","ahorra luz","Abrirla mucho hace que trabaje de más."],
  ["🔋","Los paneles solares…","convierten la luz del sol en electricidad","hacen humo","gastan gasolina","no sirven de noche ni de día","Producen energía sin humo ni ruido."],
  ["📺","Cuando termines de ver la tele…","la apagas","la dejas prendida","le subes el volumen","la cambias de canal siempre","Apagar lo que no usas ahorra energía y dinero."]]
};
const ECO_TASKS=[
 "🚰 Cierra el grifo mientras te cepillas los dientes",
 "💡 Apaga la luz cuando salgas de un cuarto",
 "♻️ Ayuda a separar la basura en tu casa",
 "🚶 Camina o usa la bici en un trayecto corto",
 "📄 Usa las dos caras de una hoja",
 "🧴 Usa una botella que se pueda volver a llenar",
 "🍽️ Termina tu comida sin desperdiciar",
 "🧹 Recoge un papelito del piso y ponlo en la caneca",
 "🔌 Desconecta un cargador que no estés usando"];

/* ---------- pantallas ---------- */
function ecoTaskToday(){return ECO_TASKS[seedFromStr(todayStr())%ECO_TASKS.length];}
function screenEco(pulse){setTheme("kid");
 const p=prof();if(!p.eco)return ecoAdopt();
 ecoTick();const e=p.eco,m=ecoMood(e),hp=ecoHealth(e);
 const bar=function(n){const v=e[n.k];
  return '<div style="display:flex;align-items:center;gap:8px;margin:8px 0"><span style="font-size:1.5rem;width:1.8rem">'+n.ic+'</span>'
   +'<div style="flex:1"><div style="display:flex;justify-content:space-between;font-family:Fredoka;font-weight:600;font-size:.82rem"><span>'+n.nm+'</span><span>'+v+'%</span></div>'
   +'<div style="height:13px;border-radius:10px;background:#E6ECF5;border:2px solid var(--kid-ink);overflow:hidden"><div style="height:100%;width:'+v+'%;background:'+(v<30?"#EF4444":n.color)+';transition:width .4s"></div></div></div>'
   +'<button class="kbtn '+(v<40?"red":"green")+'" style="width:auto;min-height:44px;padding:6px 10px;font-size:.8rem;margin:0" onclick="ecoStart(\''+n.cat+'\')">'+(v<40?"🚑 ":"")+n.btn+'</button></div>';};
 const low=ecoLowest(e);
 const done=e.lastTaskDay===todayStr();
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🌍 '+esc(e.name)+'</h2>'
  +'<p class="center" style="font-size:.85rem;margin-bottom:6px">Salud del planeta: <b>'+hp+'%</b> · nivel de cuidado '+(Math.floor(Math.sqrt((e.careXp||0)/6))+1)+' · racha '+(e.streak||0)+' 🔥</p>'
  +'<div class="card" style="padding:0;overflow:hidden"><div style="text-align:center;font-family:Fredoka;font-weight:700;padding:8px;background:#0B1120;color:#fff">'+m.f+' '+esc(m.msg)+'</div><div id="ecoCanvas" style="width:100%;height:270px;background:#0B1120"></div></div>'
  +'<div class="card" style="padding:10px 12px"><b>💬 '+(e[low.k]<60?low.tired:"¡Buen trabajo! Sigue cuidándolo cada día 💚")+'</b></div>'
  +'<div class="card" style="padding:8px 12px">'+ECO_NEEDS.map(bar).join("")+'</div>'
  +'<div class="card" style="padding:12px 14px;background:linear-gradient(160deg,#ECFDF5,#D1FAE5)"><b>🌱 Tarea real de hoy</b><p style="margin:6px 0 8px;line-height:1.4">'+ecoTaskToday()+'</p>'
   +(done?'<div class="center" style="font-weight:700;color:#16A34A">✅ ¡Ya la hiciste hoy! Vuelve mañana</div>':'<button class="kbtn green" style="min-height:50px;font-size:.95rem" onclick="ecoTaskDone()">✅ ¡Lo hice de verdad!</button>')+'</div>'
  +'<p class="center mut" style="font-size:.8rem;margin-top:8px">Tu planeta se cansa con las horas: ¡vuelve cada día a cuidarlo! 💞</p>');
 if(typeof renderEcoPlanet==="function"){renderEcoPlanet("ecoCanvas",e);if(pulse&&typeof ecoPlanetPulse==="function")setTimeout(ecoPlanetPulse,250);}}
function ecoAdopt(){setTheme("kid");
 render(topbar("screenKidMap()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🌍 ¡Adopta un planeta!</h2>'
  +'<p class="center" style="margin-bottom:10px">Este planetita necesita que lo cuides todos los días: agua limpia, árboles, aire puro, sin basura y energía limpia.</p>'
  +'<div class="card" style="padding:0;overflow:hidden"><div id="ecoCanvas" style="width:100%;height:270px;background:#0B1120"></div></div>'
  +'<button class="kbtn green" onclick="ecoAdoptGo()">💚 ¡Lo adopto y le pongo nombre!</button>');
 if(typeof renderEcoPlanet==="function")renderEcoPlanet("ecoCanvas",{air:75,water:75,forest:75,clean:75,energy:60});}
function ecoAdoptGo(){
 let name=null;try{name=window.prompt("¿Cómo se llamará tu planeta?","Tierrita");}catch(e){}
 name=(name||"Tierrita").toString().trim().slice(0,14)||"Tierrita";
 const p=prof();p.eco={name:name,air:70,water:70,forest:70,clean:70,energy:60,careXp:0,streak:0,lastCareDay:"",lastTaskDay:"",lastTs:Date.now(),adopted:Date.now()};
 save();sWIN();confetti(24);toast("¡"+name+" es tuyo! Cuídalo mucho 💚",true,2200);setTimeout(function(){screenEco(true);},400);}

/* streak: días seguidos cuidando */
function ecoCareDay(e){
 const t=todayStr();if(e.lastCareDay===t)return;
 const y=new Date(Date.now()-864e5),ys=y.getFullYear()+"-"+String(y.getMonth()+1).padStart(2,"0")+"-"+String(y.getDate()).padStart(2,"0");
 e.streak=(e.lastCareDay===ys)?(e.streak||0)+1:1;e.lastCareDay=t;}
function ecoTaskDone(){
 const e=ecoState();if(!e||e.lastTaskDay===todayStr())return;
 e.lastTaskDay=todayStr();ecoCareDay(e);
 ECO_NEEDS.forEach(function(n){e[n.k]=ecoClamp(e[n.k]+8);});
 e.careXp=(e.careXp||0)+4;const p=prof();p.coins+=3;p.xp+=6;save();
 sWIN();confetti(20);toast("¡Gracias por cuidar el planeta de verdad! 🌍 +3 🪙",true,2400);
 screenEco(true);}

/* ---------- retos de cuidado ---------- */
let ECX={};
function ecoStart(cat){setTheme("kid");
 let items;
 if(cat==="reciclaje")items=shuffled(ECO_SORT).slice(0,5).map(function(s){return{e:s[0],q:"¿En qué bote va "+s[1]+"?",ops:ECO_BINS.slice(),a:s[2],fact:s[3],sort:true};});
 else items=shuffled(ECO_BANK[cat]).slice(0,5).map(function(b){const ops=shuffled([b[2],b[3],b[4],b[5]]);return{e:b[0],q:b[1],ops:ops,a:ops.indexOf(b[2]),fact:b[6]};});
 ECX={cat:cat,items:items,i:0,ok:0,answered:false};ecoAsk();}
function ecoNeedOf(cat){return ECO_NEEDS.find(function(n){return n.cat===cat;});}
function ecoAsk(){
 if(ECX.i>=ECX.items.length)return ecoChallengeEnd();
 const it=ECX.items[ECX.i],n=ecoNeedOf(ECX.cat);ECX.answered=false;
 const cols=["#DCFCE7","#F3F4F6","#D1D5DB","#FEE2E2"];
 render(topbar("screenEco()")
  +'<div class="progressdots">'+dots(ECX.items.length,ECX.i)+'</div>'
  +'<h2 style="font-size:clamp(1.1rem,5vw,1.35rem);text-align:center;margin-bottom:2px">'+n.ic+' '+n.btn+'</h2>'
  +'<div class="center" style="font-size:clamp(3.2rem,16vw,4.5rem);line-height:1.1;margin:6px 0">'+it.e+'</div>'
  +'<div class="card center" style="padding:10px 12px"><b style="font-size:1.05rem;line-height:1.4">'+it.q+'</b></div>'
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
  +it.ops.map(function(o,k){return '<button class="kbtn white" id="ecoo'+k+'" style="min-height:64px;font-size:.92rem;line-height:1.25;padding:8px;'+(it.sort?"background:"+cols[k]+";":"")+'" onclick="ecoAns('+k+')">'+o+'</button>';}).join("")
  +'</div><div id="ecoFb"></div>');
 speakES(it.q);}
function ecoAns(k){
 if(ECX.answered)return;ECX.answered=true;
 const it=ECX.items[ECX.i],ok=k===it.a;recordAnswer("Medio ambiente",ok,12);
 if(ok){sOK();confetti(8);ECX.ok++;}else sNO();
 const b=document.getElementById("ecoo"+k);if(b)b.style.outline="4px solid "+(ok?"#16A34A":"#DC2626");
 const c=document.getElementById("ecoo"+it.a);if(c)c.style.outline="4px solid #16A34A";
 document.getElementById("ecoFb").innerHTML='<div class="card" style="margin-top:10px;background:'+(ok?"#DCFCE7":"#FEE2E2")+'"><b>'+(ok?"✅ ¡Muy bien!":"❌ Casi…")+'</b><p style="margin:6px 0 0;line-height:1.4">💡 '+it.fact+'</p></div><button class="kbtn green" onclick="ecoNextQ()">Continuar ▶️</button>';
 speakES(it.fact);}
function ecoNextQ(){ECX.i++;ecoAsk();}
function ecoChallengeEnd(){
 const n=ecoNeedOf(ECX.cat),e=ecoState(),p=prof(),ok=ECX.ok,total=ECX.items.length;
 const boost=10+ok*8;e[n.k]=ecoClamp(e[n.k]+boost);
 ecoCareDay(e);e.careXp=(e.careXp||0)+1+ok;p.coins+=1+ok;p.xp+=4+ok*2;save();
 if(ok>=4){sWIN();confetti(24);}
 render(topbar("screenEco()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:6px">'+n.ic+' ¡Cuidaste '+n.nm.toLowerCase()+'!</h2>'
  +'<div class="card center"><div style="font-size:3rem">'+(ok>=4?"🌟":ok>=2?"👍":"💪")+'</div><b style="font-size:1.1rem">'+ok+' de '+total+' bien</b>'
  +'<p style="margin:8px 0 0">'+n.ic+' '+n.nm+' <b>+'+boost+'%</b> · +'+(1+ok)+' 🪙</p><p class="mut" style="font-size:.85rem;margin-top:6px">'+(ok>=4?"¡Eres un gran cuidador del planeta! 🌍":"Cada vez que practicas, aprendes más a cuidarlo 💚")+'</p></div>'
  +'<button class="kbtn green" onclick="screenEco(true)">🌍 Ver cómo está mi planeta</button>'
  +'<button class="kbtn white" onclick="ecoStart(\''+ECX.cat+'\')">🔁 Otro reto de '+n.nm.toLowerCase()+'</button>');}
