/* ============================================================
   exam.js — MODO EXAMEN (temario del colegio)
   Se integra con: core.js (prof, save, render, topbar, recordAnswer,
   speakES, dots, shuffled, pick, rnd, toast, confetti, sOK/sNO/sWIN)
   y con teen.js (geminiJSON). Sin clave de IA funciona igual con bancos locales.
   ============================================================ */

const EXAM_SUBJECTS=[
 {id:"leng",nm:"Lenguaje",ic:"✏️",color:"#EC4899",units:[
  {id:"bv",nm:"Uso de la B y la V",ic:"🅱"},{id:"scz",nm:"Uso de S, C y Z",ic:"🇸"},
  {id:"cqk",nm:"Uso de C, Q y K",ic:"🇰"},{id:"dictado",nm:"Dictado de palabras",ic:"🎧"}]},
 {id:"mate",nm:"Matemática",ic:"🔢",color:"#F59E0B",units:[
  {id:"restapres",nm:"Restas prestando",ic:"➖"},{id:"sumallev",nm:"Sumas llevando",ic:"➕"},
  {id:"dictnum",nm:"Dictado de números",ic:"🔊"}]},
 {id:"nat",nm:"Naturales",ic:"❤️",color:"#22C55E",units:[
  {id:"piramide",nm:"Pirámide alimenticia",ic:"🍎"},{id:"niveles",nm:"Niveles de la pirámide",ic:"🍞"},
  {id:"sistemas",nm:"Sistemas del cuerpo",ic:"🫀"}]},
 {id:"soc",nm:"Sociales",ic:"🌍",color:"#3B82F6",units:[
  {id:"tierra",nm:"La Tierra",ic:"🌎"},{id:"capas",nm:"Capas de la Tierra",ic:"🧅"},
  {id:"movs",nm:"Movimientos de la Tierra",ic:"🔄"}]}];

const EXW_BV=[["bebé","b","👶"],["vaca","v","🐮"],["barco","b","⛵"],["ventana","v","🪟"],["boca","b","👄"],["vela","v","🕯️"],["burro","b","🫏"],["vestido","v","👗"],["bandera","b","🚩"],["viento","v","💨"],["botella","b","🍾"],["violín","v","🎻"]];
const EXW_SCZ=[["casa","c","🏠"],["zapato","z","👟"],["sopa","s","🍲"],["cielo","c","☁️"],["zorro","z","🦊"],["sol","s","☀️"],["cebolla","c","🧅"],["zanahoria","z","🥕"],["silla","s","🪑"],["cine","c","🎬"],["semilla","s","🌱"],["cepillo","c","🪥"]];
const EXW_CQK=[["casa","c","🏠"],["queso","q","🧀"],["kilo","k","⚖️"],["cama","c","🛏️"],["quince","q","🔢"],["koala","k","🐨"],["copa","c","🏆"],["quinto","q","5️⃣"],["kiwi","k","🥝"],["cuna","c","👶"],["karate","k","🥋"],["quema","q","🔥"]];
const EXW_DICT=[["casa","🏠"],["mesa","🪑"],["gato","🐱"],["perro","🐶"],["sol","☀️"],["luna","🌙"],["pan","🍞"],["flor","🌸"],["libro","📖"],["mano","✋"],["pato","🦆"],["nube","☁️"],["boca","👄"],["vaca","🐮"],["queso","🧀"],["silla","🪑"]];

function exMcq(q,ans,say){
 const set=new Set([ans]);
 while(set.size<3){const d=ans+(1+rnd(5))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}
 const ops=shuffled([...set].map(String));
 return {q,ops,a:ops.indexOf(String(ans)),say:say};
}

const EXAM_BANK={
 bv:()=>{const w=pick(EXW_BV),bad=w[0].replace(new RegExp(w[1]),w[1]==="b"?"v":"b");
  const ops=shuffled([w[0],bad]);return{q:"¿Cómo se escribe? "+w[2],ops,a:ops.indexOf(w[0]),say:w[0]};},
 scz:()=>{const w=pick(EXW_SCZ),o=["s","c","z"].filter(x=>x!==w[1]);
  const ops=shuffled([w[1].toUpperCase(),o[0].toUpperCase(),o[1].toUpperCase()]);
  return{q:'¿Con qué letra va "'+w[0].replace(new RegExp(w[1]),"__")+'"? '+w[2],ops,a:ops.indexOf(w[1].toUpperCase()),say:w[0]};},
 cqk:()=>{const w=pick(EXW_CQK),o=["c","q","k"].filter(x=>x!==w[1]);
  const ops=shuffled([w[1].toUpperCase(),o[0].toUpperCase(),o[1].toUpperCase()]);
  return{q:'¿Con qué letra empieza "'+w[0]+'"? '+w[2],ops,a:ops.indexOf(w[1].toUpperCase()),say:w[0]};},
 restapres:()=>{let a,b;do{a=21+rnd(78);b=6+rnd(a-6);}while((a%10)>=(b%10));const q=exMcq(a+" − "+b+" = ?",a-b);q.op={a:a,b:b,sig:"−"};return q;},
 sumallev:()=>{let a,b;do{a=6+rnd(90);b=6+rnd(90);}while((a%10)+(b%10)<10);const q=exMcq(a+" + "+b+" = ?",a+b);q.op={a:a,b:b,sig:"+"};return q;},
 piramide:()=>pick([
  {q:"¿Qué alimentos van en la BASE de la pirámide?",ops:["Cereales, pan y arroz 🍞","Dulces 🍬","Carnes 🍖"],a:0},
  {q:"¿Qué va en la PUNTA de la pirámide?",ops:["Dulces y grasas 🍬","Frutas 🍎","Verduras 🥦"],a:0},
  {q:"¿Para qué sirve la pirámide alimenticia?",ops:["Para saber qué comer y cuánto","Para hacer postres","Para pesar la comida"],a:0},
  {q:"Las frutas y verduras nos dan…",ops:["Vitaminas 🍊","Solo grasa","Solo azúcar"],a:0},
  {q:"De lo que está en la PUNTA debemos comer…",ops:["Muy poquito","Muchísimo","Solo eso"],a:0},
  {q:"¿Qué debemos tomar todos los días?",ops:["Agua 💧","Gaseosa","Café"],a:0}]),
 niveles:()=>pick([
  {q:"¿Cuál es el PRIMER nivel (la base)?",ops:["Cereales y granos 🍞","Dulces 🍬","Lácteos 🥛"],a:0},
  {q:"¿En qué nivel están las frutas y verduras?",ops:["Segundo nivel 🥦","En la punta","No están"],a:0},
  {q:"¿En qué nivel están carnes, huevos y lácteos?",ops:["Tercer nivel 🥛","La base","La punta"],a:0},
  {q:"El nivel más pequeño (la punta) tiene…",ops:["Grasas y dulces 🍰","Verduras","Agua"],a:0},
  {q:"Mientras más ARRIBA en la pirámide, comemos…",ops:["Menos cantidad","Más cantidad","Igual"],a:0},
  {q:"¿Cuántos niveles principales tiene la pirámide?",ops:["Cuatro","Uno","Diez"],a:0}]),
 sistemas:()=>pick([
  {q:"¿Qué sistema se encarga de respirar?",ops:["Respiratorio 🫁","Digestivo","Óseo"],a:0},
  {q:"¿Qué sistema lleva la sangre por el cuerpo?",ops:["Circulatorio 🫀","Respiratorio","Nervioso"],a:0},
  {q:"¿Qué sistema digiere los alimentos?",ops:["Digestivo 🍽️","Muscular","Circulatorio"],a:0},
  {q:"¿Qué órgano bombea la sangre?",ops:["El corazón 🫀","El pulmón","El estómago"],a:0},
  {q:"¿Con qué órganos respiramos?",ops:["Los pulmones 🫁","El hígado","Los riñones"],a:0},
  {q:"¿Qué sistema nos permite movernos?",ops:["Óseo y muscular 🦴","Digestivo","Respiratorio"],a:0},
  {q:"El cerebro pertenece al sistema…",ops:["Nervioso 🧠","Digestivo","Circulatorio"],a:0},
  {q:"¿Dónde llega la comida después de la boca?",ops:["Al estómago","Al pulmón","Al corazón"],a:0}]),
 tierra:()=>pick([
  {q:"¿Qué forma tiene la Tierra?",ops:["Redonda (esférica) 🌍","Cuadrada","Plana"],a:0},
  {q:"¿Qué cubre la mayor parte de la Tierra?",ops:["El agua 💧","La tierra firme","El hielo"],a:0},
  {q:"¿Qué nos da luz y calor?",ops:["El Sol ☀️","La Luna","Las nubes"],a:0},
  {q:"El satélite natural de la Tierra es…",ops:["La Luna 🌙","El Sol","Marte"],a:0},
  {q:"La capa de aire que rodea la Tierra es…",ops:["La atmósfera 🌫️","La corteza","El océano"],a:0},
  {q:"La Tierra es un…",ops:["Planeta 🪐","Una estrella","Un satélite"],a:0}]),
 capas:()=>pick([
  {q:"¿Cuáles son las capas de la Tierra?",ops:["Corteza, manto y núcleo 🧅","Arriba, medio y abajo","Agua, tierra y aire"],a:0},
  {q:"¿En qué capa vivimos?",ops:["La corteza 🏠","El manto","El núcleo"],a:0},
  {q:"¿Cuál es la capa del CENTRO?",ops:["El núcleo 🔥","La corteza","La atmósfera"],a:0},
  {q:"¿Cuál es la capa del medio?",ops:["El manto 🌋","La corteza","El núcleo"],a:0},
  {q:"El núcleo de la Tierra es…",ops:["Muy caliente 🔥","Muy frío","De hielo"],a:0},
  {q:"¿Cuál es la capa más delgada?",ops:["La corteza","El manto","El núcleo"],a:0}]),
 movs:()=>pick([
  {q:"¿Cómo se llama el giro de la Tierra sobre sí misma?",ops:["Rotación 🔄","Traslación","Vuelta"],a:0},
  {q:"¿Qué produce la ROTACIÓN?",ops:["El día y la noche 🌗","Las estaciones","La lluvia"],a:0},
  {q:"¿Cómo se llama el giro alrededor del Sol?",ops:["Traslación 🌍","Rotación","Órbita lunar"],a:0},
  {q:"¿Qué produce la TRASLACIÓN?",ops:["Las estaciones del año 🍂","El día y la noche","Los truenos"],a:0},
  {q:"¿Cuánto dura una rotación?",ops:["Un día (24 horas)","Un año","Un mes"],a:0},
  {q:"¿Cuánto dura una traslación?",ops:["Un año (365 días)","Un día","Una semana"],a:0}])};

const EXAM_PROMPTS={
 bv:"ortografía del uso de la B y la V con palabras simples y comunes",
 scz:"ortografía del uso de la S, C y Z en palabras simples",
 cqk:"ortografía del uso de C, Q y K (ca-que-qui-co-cu, ka) en palabras simples",
 restapres:"restas de dos cifras que requieren PRESTAR, resultado positivo",
 sumallev:"sumas de dos cifras que requieren LLEVAR una decena",
 piramide:"la pirámide alimenticia: qué es, para qué sirve y qué alimentos van en cada parte",
 niveles:"los niveles de la pirámide alimenticia: base cereales, luego frutas y verduras, luego lácteos y carnes, punta grasas y dulces",
 sistemas:"los sistemas del cuerpo humano (digestivo, respiratorio, circulatorio, nervioso, óseo y muscular) de forma muy sencilla",
 tierra:"el planeta Tierra: forma, agua, Sol, Luna y atmósfera",
 capas:"las capas de la Tierra: corteza, manto y núcleo",
 movs:"los movimientos de la Tierra: rotación (día y noche) y traslación (estaciones y el año)"};

/* ---------- estado ---------- */
function examState(){const p=prof();if(!p)return{units:{},goal:{}};
 if(!p.exam)p.exam={units:{},goal:{}};
 if(!p.exam.units)p.exam.units={};
 if(!p.exam.goal)p.exam.goal={};
 return p.exam;}
function exUnitScore(u){return examState().units[u]||{best:0,tries:0};}
function examProgress(){let t=0,m=0;
 EXAM_SUBJECTS.forEach(s=>s.units.forEach(u=>{t++;if(exUnitScore(u.id).best>=80)m++;}));
 return{t,m,pct:t?Math.round(m/t*100):0};}
function examAllUnits(){return EXAM_SUBJECTS.reduce((a,s)=>a.concat(s.units),[]);}

/* ---------- pantalla principal ---------- */
function screenExam(){setTheme("kid");
 const pr=examProgress(),R=52,C=2*Math.PI*R;
 const cards=EXAM_SUBJECTS.map(sub=>{
  const us=sub.units.map(u=>{const sc=exUnitScore(u.id);
   const st=sc.best>=80?"🌟":sc.best>=50?"🔸":sc.tries?"⚪":"";
   return '<button class="exu" onclick="startExamUnit(\''+u.id+'\')"><span class="exi">'+u.ic+'</span>'
    +'<span class="exn">'+u.nm+'</span><span class="exb" style="background:'+sub.color+'">'+(sc.tries?sc.best+"% "+st:"¡Nuevo!")+'</span></button>';}).join("");
  return '<div class="excard" style="border-color:'+sub.color+'"><div class="exhead" style="color:'+sub.color+';border-color:'+sub.color+'"><span>'+sub.ic+'</span>'+sub.nm+'</div>'+us+'</div>';}).join("");
 render(topbar("screenKidMap()")
 +'<div class="exhero"><div class="exring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="'+R+'" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="13"/>'
 +'<circle cx="60" cy="60" r="'+R+'" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-pr.pct/100))+'" transform="rotate(-90 60 60)"/></svg>'
 +'<div class="exringtxt">'+pr.pct+'%</div></div>'
 +'<div class="exhero-t">📝 Modo Examen</div><div class="exhero-p">'+pr.m+' de '+pr.t+' temas dominados</div></div>'
 +'<button class="kbtn green" onclick="startExamSim()" style="display:flex;align-items:center;gap:12px;text-align:left"><span style="font-size:clamp(2rem,9vw,2.5rem)">🏁</span><span style="flex:1"><span style="font-size:clamp(1.05rem,4.8vw,1.28rem)">Simulacro completo</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">12 preguntas de todos los temas</span></span></button>'
 +cards);}

/* ---------- una unidad ---------- */
function exColumnHTML(op){
 const A=String(op.a),B=String(op.b);
 const w=Math.max(A.length,B.length);
 const pad=t=>("&nbsp;".repeat(w-t.length))+t.split("").join("&nbsp;&nbsp;");
 return '<div class="excol-wrap"><div class="excol">'
  +'<div class="excol-row">'+pad(A)+'</div>'
  +'<div class="excol-row"><span class="excol-sig">'+op.sig+'</span>'+pad(B)+'</div>'
  +'<div class="excol-line"></div>'
  +'<div class="excol-row excol-q">?</div>'
  +'</div></div>';}
let EX={};
async function startExamUnit(uid){
 setTheme("kid");
 if(uid==="dictado")return examDictWords();
 if(uid==="dictnum")return examDictNums();
 render(topbar("screenExam()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando el repaso…</h2></div>');
 let items=[];
 if(S.geminiKey&&EXAM_PROMPTS[uid]&&typeof geminiJSON==="function"){
  try{const o=await geminiJSON('Eres profesor de primero de primaria. Crea 8 preguntas de opción múltiple sobre '+EXAM_PROMPTS[uid]+'. 3 opciones cada una, una sola correcta, lenguaje muy sencillo para un niño de 7 años. SOLO JSON: {"items":[{"q":"pregunta","ops":["correcta","mala","mala"],"a":0}]}');
   if(o&&o.items&&o.items.length)items=o.items.map(it=>{const c=it.ops[it.a],ops=shuffled(it.ops);return{q:it.q,ops,a:ops.indexOf(c)};});
  }catch(e){}}
 if(!items.length&&EXAM_BANK[uid])for(let i=0;i<8;i++)items.push(EXAM_BANK[uid]());
 if(!items.length){toast("No se pudo cargar",false,1800);return screenExam();}
 EX={uid,items,i:0,ok:0,sim:false};renderEX();}

/* ---------- simulacro ---------- */
function startExamSim(){setTheme("kid");
 const us=examAllUnits().filter(u=>u.id!=="dictado"&&u.id!=="dictnum");
 let items=[];
 shuffled(us).slice(0,6).forEach(u=>{if(EXAM_BANK[u.id]){items.push(EXAM_BANK[u.id]());items.push(EXAM_BANK[u.id]());}});
 items=shuffled(items).slice(0,12);
 EX={uid:"simulacro",items,i:0,ok:0,sim:true};renderEX();}

function renderEX(){
 const it=EX.items[EX.i];
 if(!it)return endEX();
 const order=shuffled(it.ops.map((o,k)=>({o,k})));EX.order=order;
 const u=examAllUnits().find(x=>x.id===EX.uid);
 const titulo=EX.sim?"🏁 Simulacro":(u?u.ic+" "+u.nm:"Repaso");
 const largo=it.ops.some(o=>String(o).length>14);
 const esMate=!!it.op;
 render(topbar("screenExam()")
 +'<div class="progressdots">'+dots(EX.items.length,EX.i)+'</div>'
 +'<p class="center" style="font-family:Fredoka;font-weight:600;margin-bottom:8px">'+titulo+' · '+(EX.i+1)+'/'+EX.items.length+'</p>'
 +(esMate?exColumnHTML(it.op):'<div class="bigq center">'+it.q+'</div>')
 +(esMate&&typeof boardBtn==="function"?boardBtn():'')
 +'<button class="speaker small" onclick="speakES(\''+String(it.say||it.q).replace(/[\\'"]/g,"")+'\')">🔊 Escuchar</button>'
 +'<div class="choices2'+(largo?' wide':'')+'">'+order.map((o,vi)=>'<button class="kbtn white" style="font-size:clamp(1rem,4.4vw,1.28rem)" onclick="ansEX('+vi+')">'+o.o+'</button>').join("")+'</div>');}

function ansEX(vi){
 if(typeof closeBoard==="function")closeBoard();
 const it=EX.items[EX.i],ok=EX.order[vi].k===it.a;
 recordAnswer("Examen: "+(EX.sim?"simulacro":EX.uid),ok,15);
 if(ok){sOK();confetti(8);EX.ok++;if(it.say)speakES(it.say);toast("¡Correcto! 🎉",true,1000);}
 else{sNO();toast("Era: "+it.ops[it.a],false,2100);}
 EX.i++;setTimeout(renderEX,ok?1000:2100);}

function endEX(){
 if(typeof closeBoard==="function")closeBoard();
 const pct=Math.round(EX.ok/EX.items.length*100);
 if(!EX.sim){const e=examState();
  if(!e.units[EX.uid])e.units[EX.uid]={best:0,tries:0};
  e.units[EX.uid].tries++;e.units[EX.uid].best=Math.max(e.units[EX.uid].best,pct);}
 const p=prof();if(p){p.coins+=Math.round(pct/10);p.xp+=Math.round(pct/4);}
 save();
 const good=pct>=80;if(good){sWIN();confetti(30);}
 render(topbar("screenExam()")
 +'<div class="card endcard"><div class="big">'+(good?"🌟":pct>=50?"💪":"📚")+'</div><h2>'+pct+'%</h2>'
 +'<p class="mut" style="margin:4px 0 12px">'+EX.ok+' de '+EX.items.length+' correctas</p>'
 +(good?'<p style="font-size:1.1rem;margin-bottom:12px">'+(EX.sim?"¡Estás listo para el examen! 🎓":"¡Tema dominado! 🎓")+'</p>'
       :'<p style="font-size:1.05rem;margin-bottom:12px">Llega al 80% para dominarlo</p>')
 +'<button class="kbtn green" onclick="'+(EX.sim?"startExamSim()":"startExamUnit('"+EX.uid+"')")+'">Practicar otra vez 🔁</button>'
 +'<button class="kbtn white" onclick="screenExam()">Ver todos los temas 📝</button></div>');}

/* ---------- dictado de palabras ---------- */
let EXDW={};
function examDictWords(){setTheme("kid");
 if(typeof speakES!=="function"){toast("Este juego necesita voz",false,1800);return screenExam();}
 EXDW={r:0,ok:0,total:6};exNextDW();}
function exNextDW(){
 if(EXDW.r>=EXDW.total)return exEndDict("dictado",EXDW.ok,EXDW.total);
 const pool=EXW_DICT.concat(EXW_BV.map(w=>[w[0],w[2]]),EXW_SCZ.map(w=>[w[0],w[2]]),EXW_CQK.map(w=>[w[0],w[2]]));
 EXDW.w=pick(pool);EXDW.typed=[];EXDW.used=[];
 const word=EXDW.w[0].toUpperCase();
 const ex="ABCDEFGHILMNOPQRSTUVZ".split("").filter(c=>word.indexOf(c)<0);
 EXDW.keys=shuffled(word.split("").concat(shuffled(ex).slice(0,3)));
 exRenderDW();}
function exRenderDW(){
 const slots=EXDW.w[0].split("").map((_,i)=>'<div class="slot'+(EXDW.typed[i]?' filled':'')+'">'+(EXDW.typed[i]||"")+'</div>').join("");
 render(topbar("screenExam()")
 +'<div class="progressdots">'+dots(EXDW.total,EXDW.r)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:4px">🎧 Dictado</h2>'
 +'<p class="center" style="margin-bottom:10px">Escucha bien y escribe la palabra</p>'
 +'<button class="speaker" onclick="speakES(\''+EXDW.w[0]+'\')"><span class="ic">🔊</span> Escuchar otra vez</button>'
 +'<div class="letterslots">'+slots+'</div>'
 +'<div class="keys">'+EXDW.keys.map((c,k)=>'<button class="key'+(EXDW.used.indexOf(k)>=0?' used':'')+'" onclick="exTapDW('+k+',\''+c+'\')">'+c+'</button>').join("")+'</div>'
 +'<div style="height:10px"></div><button class="kbtn white" onclick="EXDW.typed=[];EXDW.used=[];exRenderDW()">🧽 Borrar</button>');
 setTimeout(function(){speakES(EXDW.w[0]);},450);}
function exTapDW(k,c){
 if(EXDW.used.indexOf(k)>=0||EXDW.typed.length>=EXDW.w[0].length)return;
 EXDW.typed.push(c);EXDW.used.push(k);beep([520],.06);exRenderDW();
 if(EXDW.typed.length===EXDW.w[0].length){
  const ok=EXDW.typed.join("").toLowerCase()===EXDW.w[0].toLowerCase();
  recordAnswer("Examen: dictado",ok,25);
  if(ok){sOK();confetti(12);speakES(EXDW.w[0]);toast("¡"+EXDW.w[0].toUpperCase()+"! Perfecto 🎉",true,1500);EXDW.ok++;}
  else{sNO();toast("Se escribe: "+EXDW.w[0].toUpperCase(),false,2300);}
  EXDW.r++;setTimeout(exNextDW,ok?1600:2400);}}

/* ---------- dictado de números ---------- */
let EXDN={};
function examDictNums(){setTheme("kid");EXDN={r:0,ok:0,total:6};exNextDN();}
function exNextDN(){
 if(EXDN.r>=EXDN.total)return exEndDict("dictnum",EXDN.ok,EXDN.total);
 EXDN.n=1+rnd(99);EXDN.typed="";exRenderDN();}
function exRenderDN(){
 render(topbar("screenExam()")
 +'<div class="progressdots">'+dots(EXDN.total,EXDN.r)+'</div>'
 +'<h2 style="font-size:clamp(1.15rem,5vw,1.45rem);text-align:center;margin-bottom:4px">🔊 Dictado de números</h2>'
 +'<p class="center" style="margin-bottom:10px">Escucha el número y escríbelo</p>'
 +'<button class="speaker" onclick="speakES(\''+EXDN.n+'\')"><span class="ic">🔊</span> Escuchar otra vez</button>'
 +'<div class="numdisp">'+(EXDN.typed||"&nbsp;")+'</div>'
 +'<div class="numpad">'+[1,2,3,4,5,6,7,8,9].map(d=>'<button class="key" onclick="exTapDN(\''+d+'\')">'+d+'</button>').join("")
 +'<button class="key" onclick="EXDN.typed=EXDN.typed.slice(0,-1);exRenderDN()">⌫</button>'
 +'<button class="key" onclick="exTapDN(\'0\')">0</button>'
 +'<button class="key okk" onclick="exCheckDN()">✓</button></div>');
 setTimeout(function(){speakES(String(EXDN.n));},450);}
function exTapDN(d){if(EXDN.typed.length<4){EXDN.typed+=d;beep([560],.05);exRenderDN();}}
function exCheckDN(){
 if(!EXDN.typed)return;
 const ok=parseInt(EXDN.typed,10)===EXDN.n;recordAnswer("Examen: dictnum",ok,20);
 if(ok){sOK();confetti(12);toast("¡"+EXDN.n+"! Correcto 🎉",true,1400);EXDN.ok++;}
 else{sNO();toast("Era el "+EXDN.n,false,2100);}
 EXDN.r++;setTimeout(exNextDN,ok?1500:2200);}

function exEndDict(uid,ok,total){
 const pct=Math.round(ok/total*100),e=examState();
 if(!e.units[uid])e.units[uid]={best:0,tries:0};
 e.units[uid].tries++;e.units[uid].best=Math.max(e.units[uid].best,pct);
 const p=prof();if(p){p.coins+=Math.round(pct/10);p.xp+=Math.round(pct/4);}
 save();
 if(pct>=80){sWIN();confetti(28);}
 render(topbar("screenExam()")
 +'<div class="card endcard"><div class="big">'+(pct>=80?"🌟":"💪")+'</div><h2>'+pct+'%</h2>'
 +'<p class="mut" style="margin:4px 0 14px">'+ok+' de '+total+'</p>'
 +'<button class="kbtn green" onclick="startExamUnit(\''+uid+'\')">Otra vez 🔁</button>'
 +'<button class="kbtn white" onclick="screenExam()">Volver 📝</button></div>');}
