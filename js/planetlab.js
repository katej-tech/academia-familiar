"use strict";
/* ============ LABORATORIO DE PLANETAS (planetas personaje + arma tu planeta + mi sistema solar) ============
   Pedido: "le está gustando la parte planetaria en armar planetas y que un planeta sea un personaje".
   - Conoce a los planetas: cada uno es un personaje 3D con cara que habla en primera persona.
   - Arma tu planeta: tipo, colores, tamaño, anillos, lunas, atmósfera, cara, distancia al Sol. Un
     mensaje en vivo enseña por qué ese planeta sí o no podría tener vida (zona habitable).
   - Mi sistema solar: el Sol + los planetas que construyó, girando; tocar uno lo hace hablar.
   - ¿Cuánto pesarías?: gravedad real de cada mundo.
   - Más para explorar: visor con lista cerrada de sitios educativos verificados (sin escribir URLs).
   Prefijos plb y PLB para no chocar con otros archivos (PL_EMOJI es de missions.js). */

const PLB_ORDER=["sol","mercurio","venus","tierra","marte","jupiter","saturno","urano","neptuno"];
const PLB_VOICE={
 sol:"¡Hola! Soy el Sol, una estrella. Mi luz tarda unos ocho minutos en llegar hasta la Tierra. Sin mí, no habría vida.",
 mercurio:"¡Hola! Soy Mercurio, el planeta más pequeño y el más cercano al Sol. ¡Le doy la vuelta al Sol en solo ochenta y ocho días!",
 venus:"Hmpf. Soy Venus, el planeta más caliente: ¡hasta cuatrocientos sesenta y cinco grados! Mi aire espeso atrapa el calor. Y giro al revés que los demás.",
 tierra:"¡Hola! Soy la Tierra, tu casa. Tengo océanos de agua líquida y aire para respirar. Por ahora soy el único lugar donde sabemos que hay vida.",
 marte:"Qué onda. Soy Marte, el planeta rojo. Mi color viene del óxido, como el hierro oxidado. Tengo el volcán más grande del sistema solar: el Monte Olimpo.",
 jupiter:"¡Jo jo jo! Soy Júpiter, el gigante. ¡Cabrían más de mil Tierras dentro de mí! Mi Gran Mancha Roja es una tormenta enorme.",
 saturno:"Hola, soy Saturno, el de los anillos. Están hechos de hielo y roca. Soy tan liviano que flotaría en una piscina gigante.",
 urano:"¡Ay, qué susto! Soy Urano. Giro acostado, ¡rodando de lado! Mi color verde azulado viene del metano.",
 neptuno:"Zzz… ah, hola. Soy Neptuno, el más lejano. Tengo los vientos más rápidos: ¡más de dos mil kilómetros por hora!"
};
/* gravedad relativa a la Tierra (NASA) */
const PLB_GRAV=[["Mercurio","mercurio",.38],["Venus","venus",.91],["Tierra","tierra",1],["Luna","luna",.165],["Marte","marte",.38],["Júpiter","jupiter",2.53],["Saturno","saturno",1.07],["Urano","urano",.89],["Neptuno","neptuno",1.14],["Sol","sol",27.9]];
const PLB_EMO={sol:"☀️",mercurio:"⚫",venus:"🟡",tierra:"🌍",marte:"🔴",jupiter:"🟤",saturno:"🪐",urano:"🔵",neptuno:"🔷",luna:"🌙"};

/* sitios educativos: LISTA CERRADA y verificada (no se pueden escribir otras direcciones) */
const PLB_SITES=[
 {nm:"NASA Eyes: el sistema solar",ic:"🛰️",desc:"Vuela por el sistema solar real con datos de la NASA.",url:"https://eyes.nasa.gov/apps/solar-system/",bg:"#1E3A8A"},
 {nm:"Gravedad y órbitas (PhET)",ic:"🌌",desc:"Mueve el Sol, la Tierra y la Luna y mira cómo se atraen.",url:"https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_es.html",bg:"#7C3AED"},
 {nm:"Cielo en vivo (Stellarium)",ic:"🔭",desc:"El cielo de esta noche: estrellas, planetas y constelaciones.",url:"https://stellarium-web.org/",bg:"#0F766E"},
 {nm:"Sistema solar a escala",ic:"🪐",desc:"Planetas con texturas reales, órbitas y datos.",url:"https://www.solarsystemscope.com/",bg:"#B45309"}
];

const PLB_TYPES=[
 {id:"rocoso",ic:"🪨",nm:"Rocoso",tex:"rocoso",pal:0},
 {id:"gaseoso",ic:"🌪️",nm:"Gigante de gas",tex:"gaseoso",pal:1},
 {id:"oceano",ic:"🌊",nm:"Océanos",tex:"oceano",pal:2},
 {id:"hielo",ic:"🧊",nm:"De hielo",tex:"hielo",pal:3},
 {id:"lava",ic:"🌋",nm:"De lava",tex:"lava",pal:4}
];
const PLB_PAL=[
 {nm:"Marrón",c1:"#A8705A",c2:"#6E4636"},{nm:"Naranja",c1:"#E8B070",c2:"#B5763F"},{nm:"Azul",c1:"#2E86DE",c2:"#43A047"},
 {nm:"Turquesa",c1:"#9BE7E0",c2:"#5EB6C9"},{nm:"Fuego",c1:"#FF7A18",c2:"#FFD60A"},{nm:"Rosa",c1:"#F9A8D4",c2:"#C026D3"},
 {nm:"Morado",c1:"#A78BFA",c2:"#6D28D9"},{nm:"Verde",c1:"#86EFAC",c2:"#15803D"},{nm:"Rojo",c1:"#EF4444",c2:"#7F1D1D"},
 {nm:"Gris",c1:"#B8B2A8",c2:"#6E6963"}
];
const PLB_FACES=[["feliz","😊","Feliz"],["cool","😎","Cool"],["sorpresa","😮","Sorprendido"],["enojon","😠","Enojón"],["dormilon","😴","Dormilón"]];
const PLB_SIZES=[["Pequeño",.7],["Mediano",1],["Grande",1.3]];

let PLB={ctrl:null,cfg:null,sys:[],sel:0,talkT:null};

function plbPlanets(){const p=prof();if(!p.myPlanets)p.myPlanets=[];return p.myPlanets;}

/* ---------- hub ---------- */
function screenPlanetLab(){setTheme("kid");
 const n=plbPlanets().length;
 const card=function(cls,ic,t,sub,fn){return '<button class="kbtn '+cls+'" style="display:flex;align-items:center;gap:14px;text-align:left" onclick="'+fn+'"><span style="font-size:clamp(2.2rem,10vw,2.8rem)">'+ic+'</span><span style="flex:1"><span>'+t+'</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">'+sub+'</span></span></button>';};
 render(topbar("screenSpace()")
  +'<h2 style="font-size:clamp(1.3rem,6vw,1.6rem);text-align:center;margin-bottom:4px">🪐 Planetas con personalidad</h2>'
  +'<p class="center" style="margin-bottom:10px">¡Cada planeta es un personaje! Conócelos y crea los tuyos</p>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="plbHero" style="width:100%;height:230px"></div></div>'
  +card("blue","👋","Conoce a los planetas","Hablan, parpadean y te cuentan su historia","plbMeet()")
  +card("green","🛠️","Arma tu planeta","Elige tipo, colores, anillos, lunas y cara","plbBuild()")
  +card("purple","🌌","Mi sistema solar"+(n?" ("+n+")":""),n?"Tus planetas girando alrededor del Sol":"Primero arma al menos un planeta","plbSystem()")
  +card("yellow","⚖️","¿Cuánto pesarías?","Tu peso en cada planeta","plbWeight()")
  +card("white","🛰️","Explora más","Sitios de la NASA y simuladores, solo los seguros","plbExplore()"));
 if(typeof renderPlanetChar==="function"){
  const list=plbPlanets();
  const cfg=list.length?list[list.length-1].cfg:window.PLANET_PRESETS.tierra;
  PLB.ctrl=renderPlanetChar("plbHero",cfg,{});}}

/* ---------- habla ---------- */
function plbSay(text){
 if(!PLB.ctrl)return;clearTimeout(PLB.talkT);PLB.ctrl.talk(true);
 const end=function(){clearTimeout(PLB.talkT);if(PLB.ctrl)PLB.ctrl.talk(false);};
 PLB.talkT=setTimeout(end,Math.min(20000,text.length*85+800));
 speakES(text,end);}

/* ---------- 👋 conoce ---------- */
function plbMeet(id){setTheme("kid");
 id=id||"tierra";
 const P=window.PLANET_PRESETS[id],real=(window.PLANETS||[]).find(function(x){return x.id===id;});
 const tabs=PLB_ORDER.map(function(k){const on=k===id;return '<button style="flex:0 0 auto;min-width:46px;height:46px;border-radius:14px;border:3px solid '+(on?"#3B82F6":"#E5E7EB")+';background:'+(on?"#DBEAFE":"#fff")+';font-size:1.4rem;cursor:pointer" onclick="plbMeet(\''+k+'\')" aria-label="'+window.PLANET_PRESETS[k].nm+'">'+PLB_EMO[k]+'</button>';}).join("");
 const chip=function(ic,l,v){return '<span style="background:#EEF2FF;border-radius:12px;padding:4px 8px;font-size:.8rem;font-weight:700;display:inline-block;margin:2px">'+ic+' '+l+': '+v+'</span>';};
 render(topbar("screenPlanetLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:6px">👋 Conoce a '+P.nm+'</h2>'
  +'<div style="display:flex;gap:6px;overflow-x:auto;padding:2px 2px 8px">'+tabs+'</div>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="plbHero" style="width:100%;height:290px"></div></div>'
  +'<p class="center" style="font-family:Fredoka;font-weight:700;color:#3B82F6;margin:6px 0">👉 Tócalo: ¡se mueve y habla!</p>'
  +'<div class="card"><p style="margin:0 0 6px;line-height:1.5;font-weight:700">“'+PLB_VOICE[id]+'”</p>'
  +(real?'<div>'+chip("🧱","Tipo",real.tipo)+chip("🌙","Lunas",real.lunas)+chip("📅","Un año",real.anio)+chip("🌡️","Temperatura",real.temp)+'</div>':'')
  +'</div>'
  +'<button class="kbtn green" onclick="plbSayCur()">🔊 Escúchalo otra vez</button>'
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');
 PLB.cur=id;
 PLB.ctrl=renderPlanetChar("plbHero",P,{onTap:function(){plbSayCur();}});
 setTimeout(plbSayCur,350);}
function plbSayCur(){if(PLB.cur)plbSay(PLB_VOICE[PLB.cur]);}

/* ---------- 🛠️ arma tu planeta ---------- */
function plbAssess(c){
 const d=c.dist,msgs=[];let tone="info";
 if(c.type==="gaseoso"){msgs.push("🌪️ Es un gigante de gas: no tiene suelo donde pararse, como Júpiter y Saturno. ¡Nadie podría aterrizar!");}
 else if(c.type==="lava"){msgs.push("🌋 Un mundo de lava: tan caliente que la roca se derrite. Así son los volcanes de Ío, una luna de Júpiter.");}
 else if(c.type==="hielo"){msgs.push("🧊 Un mundo helado, como Urano y Neptuno. ¡Brrr!");}
 else if(c.type==="oceano"){
  if(c.atmo<1)msgs.push("🌊 Sin atmósfera, el agua se evaporaría o se congelaría. Agrega atmósfera.");
  else if(d===2||d===3){msgs.push("✅ ¡Zona habitable! A esta distancia del Sol el agua puede ser líquida y con atmósfera… ¡podría haber vida, como en la Tierra!");tone="good";}
  else if(d===1)msgs.push("🔥 Muy cerca del Sol: el agua herviría. Aléjalo un poquito.");
  else msgs.push("❄️ Muy lejos del Sol: los océanos se congelarían. Acércalo un poquito.");}
 else{
  if(d===1)msgs.push("🔥 Tan cerca del Sol está muy caliente, como Mercurio.");
  else if(d===5)msgs.push("❄️ Tan lejos del Sol está congelado y oscuro.");
  else msgs.push("🪨 Un planeta rocoso con suelo firme. Para tener vida le haría falta agua líquida y atmósfera.");}
 if(c.rings)msgs.push("💍 ¡Anillos! Los de Saturno son de hielo y roca. Júpiter, Urano y Neptuno también tienen, pero más finitos.");
 if(c.moons>=3)msgs.push("🌙 "+c.moons+" lunas: la Tierra tiene 1, Marte 2 y Saturno ¡cientos!");
 if(c.size>=1.3&&c.type!=="gaseoso")msgs.push("⚖️ Un planeta rocoso muy grande tendría más gravedad y pesarías más.");
 return{html:msgs.join("<br>"),tone:tone};}

function plbBuild(){setTheme("kid");
 PLB.cfg={nm:"",type:"rocoso",tex:"rocoso",c1:PLB_PAL[0].c1,c2:PLB_PAL[0].c2,size:1,atmo:0,rings:0,moons:0,face:"feliz",dist:3,seed:1+Math.floor(Math.random()*9999),pal:0};
 render(topbar("screenPlanetLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🛠️ Arma tu planeta</h2>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="plbHero" style="width:100%;height:250px"></div></div>'
  +'<div class="card" id="plbMsg" style="margin-top:8px;font-size:.92rem;line-height:1.45"></div>'
  +'<div id="plbOpts"></div>'
  +'<div class="card"><b>✏️ Ponle nombre</b><input id="plbName" maxlength="14" placeholder="Ej: Zorbón" style="width:100%;font-size:1.1rem;padding:10px;border-radius:12px;border:2px solid #E5E7EB;margin-top:6px;box-sizing:border-box"></div>'
  +'<button class="kbtn green" onclick="plbSaveNew()">💾 Guardar mi planeta</button>'
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');
 PLB.ctrl=renderPlanetChar("plbHero",PLB.cfg,{});
 plbOpts();}
function plbOpts(){
 const c=PLB.cfg;
 const row=function(title,items){return '<div class="card" style="margin-bottom:8px"><b style="display:block;margin-bottom:6px">'+title+'</b><div style="display:flex;flex-wrap:wrap;gap:6px">'+items+'</div></div>';};
 const btn=function(on,label,fn){return '<button style="flex:1 1 auto;min-width:62px;padding:8px 6px;border-radius:12px;border:3px solid '+(on?"#3B82F6":"#E5E7EB")+';background:'+(on?"#DBEAFE":"#fff")+';font-family:Fredoka;font-weight:700;font-size:.9rem;cursor:pointer" onclick="'+fn+'">'+label+'</button>';};
 const sw=function(on,col,fn,nm){return '<button aria-label="'+nm+'" style="width:42px;height:42px;border-radius:50%;border:4px solid '+(on?"#1D4ED8":"#fff")+';box-shadow:0 0 0 2px #CBD5E1;background:linear-gradient(135deg,'+col.c1+' 50%,'+col.c2+' 50%);cursor:pointer" onclick="'+fn+'"></button>';};
 const types=PLB_TYPES.map(function(t){return btn(c.type===t.id,t.ic+"<br>"+t.nm,"plbSet('type','"+t.id+"')");}).join("");
 const pals=PLB_PAL.map(function(p,i){return sw(c.pal===i,p,"plbSet('pal',"+i+")",p.nm);}).join("");
 const sizes=PLB_SIZES.map(function(s){return btn(c.size===s[1],s[0],"plbSet('size',"+s[1]+")");}).join("");
 const atm=[["Sin aire",0],["Aire fino",1],["Aire espeso",2]].map(function(a){return btn(c.atmo===a[1],a[0],"plbSet('atmo',"+a[1]+")");}).join("");
 const rings=[0,1,2].map(function(n){return btn(c.rings===n,n?("💍 "+n):"Sin anillos","plbSet('rings',"+n+")");}).join("");
 const moons=[0,1,2,3].map(function(n){return btn(c.moons===n,"🌙 "+n,"plbSet('moons',"+n+")");}).join("");
 const faces=PLB_FACES.map(function(f){return btn(c.face===f[0],f[1]+"<br>"+f[2],"plbSet('face','"+f[0]+"')");}).join("");
 const dist=[1,2,3,4,5].map(function(n){return btn(c.dist===n,n+(n===1?" ☀️cerca":n===5?" ❄️lejos":""),"plbSet('dist',"+n+")");}).join("");
 document.getElementById("plbOpts").innerHTML=
  row("1. ¿Qué tipo de mundo es?",types)+row("2. Colores",pals)+row("3. Tamaño",sizes)+row("4. Aire (atmósfera)",atm)
  +row("5. Anillos",rings)+row("6. Lunas",moons)+row("7. Su cara",faces)+row("8. Distancia al Sol (1 = pegadito, 5 = lejísimos)",dist);
 const a=plbAssess(c);
 const m=document.getElementById("plbMsg");m.innerHTML=a.html;m.style.background=a.tone==="good"?"#DCFCE7":"#EEF2FF";}
function plbSet(k,v){
 const c=PLB.cfg;
 if(k==="type"){const t=PLB_TYPES.find(function(x){return x.id===v;});c.type=v;c.tex=t.tex;c.pal=t.pal;c.c1=PLB_PAL[t.pal].c1;c.c2=PLB_PAL[t.pal].c2;if(v==="oceano"&&!c.atmo)c.atmo=1;c.seed=1+Math.floor(Math.random()*9999);}
 else if(k==="pal"){c.pal=v;c.c1=PLB_PAL[v].c1;c.c2=PLB_PAL[v].c2;}
 else c[k]=v;
 if(PLB.ctrl){PLB.ctrl.update(c);PLB.ctrl.bounce();}
 tone(440+Math.random()*200,.08);
 plbOpts();}
function plbSaveNew(){
 const c=PLB.cfg,inp=document.getElementById("plbName"),nm=(inp.value||"").trim();
 if(!nm){inp.focus();inp.style.borderColor="#EF4444";sNO();return;}
 const list=plbPlanets();
 if(list.length>=12){alert("Ya tienes 12 planetas. Borra uno en «Mi sistema solar» para hacer espacio.");return;}
 const cfg=Object.assign({},c,{nm:nm});
 const img=typeof snapshotPlanet==="function"?snapshotPlanet(cfg):"";
 const p=prof();const first=list.length===0;
 list.push({id:"p"+Date.now(),nm:nm,cfg:cfg,img:img,t:Date.now()});
 if(first)p.coins+=3;save();sOK();confetti(14);
 const a=plbAssess(cfg);
 render(topbar("screenPlanetLab()")
  +'<h2 class="center">🎉 ¡Nació '+nm+'!</h2>'
  +'<div class="card center"><img src="'+img+'" alt="'+nm+'" style="width:min(70vw,240px);border-radius:20px"></div>'
  +'<div class="card" style="line-height:1.5">'+a.html+(first?'<br><b>+3 🪙 por tu primer planeta</b>':'')+'</div>'
  +'<button class="kbtn purple" onclick="plbSystem()">🌌 Ver mi sistema solar</button>'
  +'<button class="kbtn green" onclick="plbBuild()">🛠️ Armar otro</button>'
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');
 speakES("¡Nació "+nm+"! "+a.html.replace(/<br>/g," ").replace(/[^\p{L}\p{N}\s.,¡!¿?]/gu,""));}

/* ---------- 🌌 mi sistema solar ---------- */
function plbSystem(){setTheme("kid");
 const list=plbPlanets();
 if(!list.length){
  render(topbar("screenPlanetLab()")+'<h2 class="center">🌌 Mi sistema solar</h2><div class="card center"><p style="font-size:3rem;margin:0">🪐</p><p>Aún no tienes planetas. ¡Arma el primero y aparecerá aquí girando alrededor del Sol!</p></div><button class="kbtn green" onclick="plbBuild()">🛠️ Armar mi primer planeta</button><button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');return;}
 PLB.sel=Math.min(PLB.sel,list.length-1);
 render(topbar("screenPlanetLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:2px">🌌 Mi sistema solar</h2>'
  +'<p class="center" style="margin-bottom:6px;font-family:Fredoka;font-weight:700;color:#3B82F6">👉 Toca uno de tus planetas</p>'
  +'<div class="card center" style="padding:0;overflow:hidden"><div id="plbHero" style="width:100%;height:320px"></div></div>'
  +'<div id="plbSysCard"></div>'
  +'<button class="kbtn green" onclick="plbBuild()">🛠️ Armar otro planeta</button>'
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');
 PLB.ctrl=null;
 renderMySystem("plbHero",list,plbSysPick);
 plbSysCard(PLB.sel);}
function plbSysPick(i){PLB.sel=i;plbSysCard(i);const pl=plbPlanets()[i];if(pl){const a=plbAssess(pl.cfg);speakES("Soy "+pl.nm+". "+a.html.replace(/<br>/g," ").replace(/[^\p{L}\p{N}\s.,¡!¿?]/gu,""));}}
function plbSysCard(i){
 const pl=plbPlanets()[i],box=document.getElementById("plbSysCard");if(!pl||!box)return;
 const a=plbAssess(pl.cfg);
 box.innerHTML='<div class="card" style="display:flex;gap:12px;align-items:center"><img src="'+pl.img+'" alt="" style="width:84px;height:84px;border-radius:16px;flex:0 0 auto"><div style="flex:1;line-height:1.4"><b style="font-size:1.1rem">'+pl.nm+'</b><br><span style="font-size:.85rem">'+a.html+'</span></div></div>'
  +'<button class="kbtn white" style="min-height:44px;font-size:.9rem" onclick="plbDelete('+i+')">🗑️ Borrar a '+pl.nm+'</button>';}
function plbDelete(i){
 const list=plbPlanets(),pl=list[i];if(!pl)return;
 if(!confirm("¿Borrar a "+pl.nm+"? No se puede deshacer."))return;
 list.splice(i,1);PLB.sel=0;save();plbSystem();}

/* ---------- ⚖️ cuánto pesarías ---------- */
function plbWeight(kg){setTheme("kid");
 kg=Math.max(5,Math.min(150,Number(kg)||30));
 const bars=PLB_GRAV.filter(function(g){return g[1]!=="sol";}).map(function(g){const w=kg*g[2];
  return '<div style="display:flex;align-items:center;gap:8px;margin:5px 0"><span style="width:28px;font-size:1.3rem;text-align:center">'+PLB_EMO[g[1]]+'</span><span style="width:70px;font-weight:700;font-size:.85rem">'+g[0]+'</span>'
  +'<div style="flex:1;background:#E5E7EB;border-radius:10px;height:22px;overflow:hidden"><div style="width:'+Math.max(4,Math.round(w/(kg*2.53)*100))+'%;height:100%;background:'+(g[1]==="tierra"?"#22C55E":"#60A5FA")+';border-radius:10px"></div></div>'
  +'<b style="width:58px;text-align:right;font-size:.9rem">'+w.toFixed(1)+' kg</b></div>';}).join("");
 render(topbar("screenPlanetLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">⚖️ ¿Cuánto pesarías?</h2>'
  +'<div class="card"><b>Tu peso en la Tierra: <span id="plbKg">'+kg+'</span> kg</b>'
  +'<input type="range" min="5" max="150" value="'+kg+'" style="width:100%;margin-top:8px" oninput="document.getElementById(\'plbKg\').textContent=this.value" onchange="plbWeight(this.value)"></div>'
  +'<div class="card">'+bars+'<p class="mut" style="font-size:.82rem;margin:8px 0 0">Tu masa no cambia, pero la gravedad de cada mundo te jala distinto. En el Sol pesarías '+(kg*27.9).toFixed(0)+' kg… ¡pero se derretiría hasta el astronauta más valiente! 🔥</p></div>'
  +'<div class="card"><b>🧩 Piensa:</b> ¿en qué planeta saltarías más alto? ¿Y en cuál te sentirías más pesado?</div>'
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');}

/* ---------- 🛰️ explorar más (lista cerrada) ---------- */
function plbExplore(){setTheme("kid");
 const on=navigator.onLine!==false;
 render(topbar("screenPlanetLab()")
  +'<h2 style="font-size:clamp(1.2rem,5.5vw,1.5rem);text-align:center;margin-bottom:4px">🛰️ Explora más</h2>'
  +'<p class="center" style="margin-bottom:10px">Sitios educativos escogidos por tus papás. Necesitan internet.</p>'
  +(on?'':'<div class="card" style="background:#FEF3C7">📡 Ahora no hay internet. Vuelve cuando te conectes.</div>')
  +PLB_SITES.map(function(s,i){return '<button class="kbtn" style="display:flex;align-items:center;gap:14px;text-align:left;background:'+s.bg+';color:#fff" onclick="plbOpenSite('+i+')"><span style="font-size:2.4rem">'+s.ic+'</span><span style="flex:1"><span>'+s.nm+'</span><br><span style="font-size:.78rem;opacity:.9;font-weight:500">'+s.desc+'</span></span></button>';}).join("")
  +'<button class="kbtn white" onclick="screenPlanetLab()">← Volver</button>');}
function plbOpenSite(i){
 const s=PLB_SITES[i];if(!s)return;
 /* sandbox sin allow-top-navigation ni allow-popups: la página no puede sacar al niño de la app */
 render('<div style="position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:#fff">'
  +'<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:'+s.bg+';color:#fff"><button onclick="plbExplore()" style="background:#fff;color:#111827;border:0;border-radius:12px;padding:8px 12px;font-weight:800;cursor:pointer">← Volver</button><b style="flex:1;font-size:.95rem">'+s.ic+' '+s.nm+'</b></div>'
  +'<div style="position:relative;flex:1;background:#0B1120;color:#fff;display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:700;font-size:1.1rem">⏳ Cargando… puede tardar unos segundos'
  +'<iframe title="'+s.nm+'" src="'+s.url+'" sandbox="allow-scripts allow-same-origin allow-forms" referrerpolicy="no-referrer" allow="fullscreen" style="position:absolute;inset:0;border:0;width:100%;height:100%;background:transparent"></iframe></div>'
  +'<div style="padding:5px 10px;font-size:.72rem;background:#F1F5F9;color:#475569">Sitio externo: '+new URL(s.url).hostname+'. Si algo se ve raro, toca «Volver».</div></div>');}
