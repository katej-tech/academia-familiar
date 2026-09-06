/* ============================================================
   exam.js — MODO EXAMEN (temario del colegio)
   Se integra con: core.js (prof, save, render, topbar, recordAnswer,
   speakES, dots, shuffled, pick, rnd, toast, confetti, sOK/sNO/sWIN)
   y con teen.js (geminiJSON). Sin clave de IA funciona igual con bancos locales.
   ============================================================ */

const EXAM_SUBJECTS=[
 {id:"leng",nm:"Lenguaje",ic:"✏️",color:"#EC4899",units:[
  {id:"bv",nm:"Uso de la B y la V",ic:"🅱"},{id:"scz",nm:"Uso de S, C y Z",ic:"🇸"},
  {id:"cqk",nm:"Uso de C, Q y K",ic:"🇰"},{id:"dictado",nm:"Dictado de palabras",ic:"🎧"},
  {id:"comprension",nm:"Comprensión lectora",ic:"📖"},{id:"diminutivo",nm:"Diminutivos y aumentativos",ic:"🔍"},
  {id:"articulos",nm:"Artículos: el, la, los, las",ic:"📰"}]},
 {id:"mate",nm:"Matemática",ic:"🔢",color:"#F59E0B",units:[
  {id:"restapres",nm:"Restas prestando",ic:"➖"},{id:"sumallev",nm:"Sumas llevando",ic:"➕"},
  {id:"dictnum",nm:"Dictado de números",ic:"🔊"},{id:"numletras",nm:"Números en letras",ic:"🔤"},
  {id:"abaco",nm:"El ábaco",ic:"🧮"}]},
 {id:"nat",nm:"Naturales",ic:"❤️",color:"#22C55E",units:[
  {id:"piramide",nm:"Pirámide alimenticia",ic:"🍎"},{id:"niveles",nm:"Niveles de la pirámide",ic:"🍞"},
  {id:"sistemas",nm:"Sistemas del cuerpo",ic:"🫀"},{id:"estaciones",nm:"Estaciones del año",ic:"🍂"},
  {id:"clima",nm:"El clima y sus factores",ic:"☀️"}]},
 {id:"soc",nm:"Sociales",ic:"🌍",color:"#3B82F6",units:[
  {id:"tierra",nm:"La Tierra",ic:"🌎"},{id:"capas",nm:"Capas de la Tierra",ic:"🧅"},
  {id:"movs",nm:"Movimientos de la Tierra",ic:"🔄"},{id:"viviendas",nm:"Tipos de vivienda",ic:"🏠"},
  {id:"simbolos",nm:"Símbolos patrios",ic:"🎌"},{id:"identidad",nm:"Mi identidad",ic:"🪪"}]}];

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
  {q:"¿Cuánto dura una traslación?",ops:["Un año (365 días)","Un día","Una semana"],a:0}]),
 /* números en letras y ábaco: se generan localmente (nunca por IA) porque necesitan una
    estructura exacta —numEs() ya existe en content-exam.js para el motor de práctica diaria,
    aquí se reutiliza tal cual en vez de duplicar la conversión número→palabra. */
 numletras:()=>{
  const n=10+rnd(90);const correct=numEs(n);
  const set=new Set([correct]);
  while(set.size<3){let m=Math.max(10,n+(1+rnd(8))*(Math.random()<.5?-1:1));if(m>99)m=99;set.add(numEs(m));}
  const ops=shuffled([...set]);
  return{q:"¿Cómo se escribe el número <b>"+n+"</b> en letras?",ops,a:ops.indexOf(correct),say:String(n)};},
 abaco:()=>{
  const dec=1+rnd(9),uni=rnd(10),n=dec*10+uni;
  const visual='<div style="display:flex;justify-content:center;gap:22px;margin:8px 0 4px">'
   +'<div><div style="font-size:.8rem;font-weight:700">Decenas</div><div style="font-size:1.5rem;line-height:1.3">'+"🔵".repeat(dec)+'</div></div>'
   +'<div><div style="font-size:.8rem;font-weight:700">Unidades</div><div style="font-size:1.5rem;line-height:1.3">'+(uni?"🟢".repeat(uni):"—")+'</div></div></div>';
  return exMcq(visual+"¿Qué número representa el ábaco?",n,String(n));},
 diminutivo:()=>pick([
  {q:"¿Cuál es el DIMINUTIVO de 'perro'?",ops:["Perrito","Perrazo","Perro"],a:0},
  {q:"¿Cuál es el AUMENTATIVO de 'perro'?",ops:["Perrazo","Perrito","Perro"],a:0},
  {q:"¿Cuál es el diminutivo de 'casa'?",ops:["Casita","Casona","Casa"],a:0},
  {q:"¿Cuál es el aumentativo de 'casa'?",ops:["Casona","Casita","Casa"],a:0},
  {q:"¿Cuál es el diminutivo de 'mesa'?",ops:["Mesita","Mesota","Mesa"],a:0},
  {q:"¿Cuál es el aumentativo de 'zapato'?",ops:["Zapatón","Zapatito","Zapato"],a:0},
  {q:"El diminutivo hace que algo suene…",ops:["Más pequeño 🤏","Más grande","Igual"],a:0},
  {q:"El aumentativo hace que algo suene…",ops:["Más grande 📏","Más pequeño","Igual"],a:0},
  {q:"¿Cuál es el diminutivo de 'flor'?",ops:["Florecita","Florzota","Flor"],a:0},
  {q:"¿Cuál es el aumentativo de 'gato'?",ops:["Gatote","Gatito","Gato"],a:0}]),
 articulos:()=>pick([
  {q:"¿Qué artículo va con 'mesa'? ___ mesa",ops:["La","El","Los"],a:0},
  {q:"¿Qué artículo va con 'perro'? ___ perro",ops:["El","La","Las"],a:0},
  {q:"¿Qué artículo va con 'niños'? ___ niños",ops:["Los","La","El"],a:0},
  {q:"¿Qué artículo va con 'flores'? ___ flores",ops:["Las","El","Los"],a:0},
  {q:"¿Qué artículo va con 'sol'? ___ sol",ops:["El","La","Las"],a:0},
  {q:"¿Qué artículo va con 'luna'? ___ luna",ops:["La","El","Los"],a:0},
  {q:"'El' y 'los' se usan con palabras…",ops:["Masculinas 👦","Femeninas","Cualquiera"],a:0},
  {q:"'La' y 'las' se usan con palabras…",ops:["Femeninas 👧","Masculinas","Cualquiera"],a:0},
  {q:"¿Qué artículo va con 'casas'? ___ casas",ops:["Las","Los","El"],a:0},
  {q:"¿Qué artículo va con 'libro'? ___ libro",ops:["El","La","Las"],a:0}]),
 viviendas:()=>pick([
  {q:"Una vivienda con varios pisos donde vive más de una familia es un…",ops:["Edificio de apartamentos 🏢","Choza","Barco"],a:0},
  {q:"Una casa hecha de paja, madera o barro en el campo es una…",ops:["Choza o cabaña 🏚️","Torre","Fábrica"],a:0},
  {q:"¿Para qué sirve una vivienda?",ops:["Para protegernos y descansar 🏠","Para jugar solamente","Para nada"],a:0},
  {q:"Una vivienda flotante sobre el agua es una…",ops:["Casa flotante o barco 🛶","Cueva","Carpa"],a:0},
  {q:"Una vivienda pequeña y móvil para acampar es una…",ops:["Carpa ⛺","Edificio","Castillo"],a:0},
  {q:"En la ciudad es común vivir en…",ops:["Apartamentos 🏢","Cuevas","Barcos"],a:0},
  {q:"En el campo es común vivir en…",ops:["Casas de finca 🏡","Rascacielos","Submarinos"],a:0},
  {q:"Las viviendas nos protegen del…",ops:["Frío, la lluvia y el sol ☔","Aburrimiento","Hambre"],a:0}]),
 simbolos:()=>pick([
  {q:"¿Cuál de estos ES un símbolo patrio?",ops:["La bandera 🏳️","Un balón","Una silla"],a:0},
  {q:"La canción que representa a un país es el…",ops:["Himno nacional 🎵","Cuento","Chiste"],a:0},
  {q:"El dibujo oficial que representa a un país (con figuras y colores) es el…",ops:["Escudo 🛡️","Mapa","Reloj"],a:0},
  {q:"Los símbolos patrios representan…",ops:["La identidad de un país 🇨🇴","Un solo equipo","Un solo colegio"],a:0},
  {q:"¿Cómo debemos comportarnos cuando suena el himno nacional?",ops:["Con respeto, de pie","Corriendo","Gritando"],a:0},
  {q:"La bandera de un país normalmente tiene…",ops:["Colores y forma propios 🎨","Siempre los mismos colores que otro país","Ningún color"],a:0},
  {q:"¿Quiénes usan los símbolos patrios con orgullo?",ops:["Los ciudadanos de ese país 🙌","Solo los niños","Nadie"],a:0}]),
 identidad:()=>pick([
  {q:"El documento que dice tu nombre y cuándo naciste es tu…",ops:["Registro civil o cédula 🪪","Cuaderno","Lonchera"],a:0},
  {q:"Tu nombre y tus apellidos forman…",ops:["Tu identidad 🙋","Tu comida favorita","Tu juguete"],a:0},
  {q:"Cada persona es…",ops:["Única y diferente 🌟","Igual a todas las demás","Un número"],a:0},
  {q:"¿Quiénes forman tu familia?",ops:["Las personas que te cuidan y te quieren 👨‍👩‍👧","Tus juguetes","Tus vecinos siempre"],a:0},
  {q:"Debemos tratar a las personas diferentes a nosotros con…",ops:["Respeto 🤝","Burlas","Indiferencia"],a:0},
  {q:"¿Qué NO debes compartir con desconocidos por seguridad?",ops:["Tu dirección y datos personales 🔒","Tu color favorito","Nada de esto importa"],a:0},
  {q:"Todos los niños tienen derecho a…",ops:["Educación, salud y cariño 💛","Nada especial","Solo jugar"],a:0}]),
 estaciones:()=>pick([
  {q:"¿Cuántas estaciones tiene el año?",ops:["Cuatro","Dos","Seis"],a:0},
  {q:"¿Cuál es la estación más fría?",ops:["Invierno ❄️","Verano","Primavera"],a:0},
  {q:"¿Cuál es la estación más calurosa?",ops:["Verano ☀️","Invierno","Otoño"],a:0},
  {q:"¿En qué estación caen las hojas de los árboles?",ops:["Otoño 🍂","Verano","Invierno"],a:0},
  {q:"¿En qué estación florecen las plantas?",ops:["Primavera 🌸","Invierno","Otoño"],a:0},
  {q:"Las estaciones del año las produce…",ops:["El movimiento de traslación de la Tierra 🌍","La Luna","El viento"],a:0},
  {q:"En invierno la ropa que usamos es…",ops:["Abrigada 🧥","De baño","Ninguna"],a:0}]),
 clima:()=>pick([
  {q:"¿Qué es el clima?",ops:["Cómo está el tiempo en un lugar (sol, lluvia, viento) ⛅","Un tipo de animal","Un juego"],a:0},
  {q:"¿Qué instrumento mide la temperatura?",ops:["El termómetro 🌡️","La regla","La balanza"],a:0},
  {q:"El Sol nos da…",ops:["Luz y calor ☀️","Frío","Oscuridad"],a:0},
  {q:"¿Qué factor del clima nos moja?",ops:["La lluvia 🌧️","El viento","El sol"],a:0},
  {q:"¿Qué factor del clima mueve las hojas y las cometas?",ops:["El viento 💨","La lluvia","La temperatura"],a:0},
  {q:"Un lugar muy caliente y seco tiene clima…",ops:["Cálido/desértico 🏜️","Frío","Lluvioso"],a:0},
  {q:"Un lugar muy frío con nieve tiene clima…",ops:["Frío/polar ❄️","Cálido","Templado"],a:0}])};

const EXAM_PROMPTS={
 bv:"ortografía del uso de la B y la V con palabras simples y comunes",
 scz:"ortografía del uso de la S, C y Z en palabras simples",
 cqk:"ortografía del uso de C, Q y K (ca-que-qui-co-cu, ka) en palabras simples",
 piramide:"la pirámide alimenticia: qué es, para qué sirve y qué alimentos van en cada parte",
 niveles:"los niveles de la pirámide alimenticia: base cereales, luego frutas y verduras, luego lácteos y carnes, punta grasas y dulces",
 sistemas:"los sistemas del cuerpo humano (digestivo, respiratorio, circulatorio, nervioso, óseo y muscular) de forma muy sencilla",
 tierra:"el planeta Tierra: forma, agua, Sol, Luna y atmósfera",
 capas:"las capas de la Tierra: corteza, manto y núcleo",
 movs:"los movimientos de la Tierra: rotación (día y noche) y traslación (estaciones y el año)",
 diminutivo:"diminutivos y aumentativos de sustantivos simples (perrito/perrazo) para un niño de 7 años",
 articulos:"los artículos el, la, los, las con sustantivos simples y comunes",
 viviendas:"tipos de vivienda (casa, apartamento, choza, casa flotante, carpa) y para qué sirven",
 simbolos:"los símbolos patrios de un país (bandera, escudo, himno) de forma general, sin datos de un país específico",
 identidad:"la identidad personal: nombre, familia, derechos de los niños, respeto a las diferencias, sin pedir datos reales del niño",
 estaciones:"las cuatro estaciones del año (primavera, verano, otoño, invierno) y sus características",
 clima:"el clima y sus factores (sol, viento, lluvia, temperatura) de forma muy sencilla"};
/* restapres/sumallev necesitan el desglose exacto {a,b,sig} para dibujar la pizarra de columnas
   (exColumnHTML) — la IA no puede garantizar esa estructura, así que SIEMPRE usan EXAM_BANK
   (nunca geminiJSON), igual que numletras/abaco (no tienen prompt arriba, por lo mismo). */
const EXAM_NEEDS_OP=["restapres","sumallev"];

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
 if(uid==="comprension")return examComprension();
 render(topbar("screenExam()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando el repaso…</h2></div>');
 let items=[];
 if(S.geminiKey&&EXAM_PROMPTS[uid]&&EXAM_NEEDS_OP.indexOf(uid)<0&&typeof geminiJSON==="function"){
  try{const o=await geminiJSON('Eres profesor de primero de primaria. Crea 8 preguntas de opción múltiple sobre '+EXAM_PROMPTS[uid]+'. 3 opciones cada una, una sola correcta, lenguaje muy sencillo para un niño de 7 años. SOLO JSON: {"items":[{"q":"pregunta","ops":["correcta","mala","mala"],"a":0}]}');
   if(o&&o.items&&o.items.length)items=o.items.map(it=>{const c=it.ops[it.a],ops=shuffled(it.ops);return{q:it.q,ops,a:ops.indexOf(c)};});
  }catch(e){}}
 if(!items.length&&EXAM_BANK[uid])for(let i=0;i<8;i++)items.push(EXAM_BANK[uid]());
 if(!items.length){toast("No se pudo cargar",false,1800);return screenExam();}
 EX={uid,items,i:0,ok:0,sim:false};renderEX();}

/* ---------- simulacro ---------- */
function startExamSim(){setTheme("kid");
 const us=examAllUnits().filter(u=>u.id!=="dictado"&&u.id!=="dictnum"&&u.id!=="comprension");
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
 +(EX.passage?'<div class="card" style="line-height:1.6;margin-bottom:8px">'+esc(EX.passage)+'<br><button class="speaker small" style="margin-top:8px" onclick="speakES('+jsStr(EX.passage)+')">🔊 Escuchar el texto</button></div>':'')
 +(esMate?exColumnHTML(it.op):'<div class="bigq center">'+it.q+'</div>')
 +(esMate&&typeof boardBtn==="function"?boardBtn():'')
 +'<button class="speaker small" onclick="speakES(\''+String(it.say||it.q).replace(/[\\'"]/g,"")+'\')">🔊 Escuchar</button>'
 +'<div class="choices2'+(largo?' wide':'')+'">'+order.map((o,vi)=>'<button class="kbtn white" style="font-size:clamp(1rem,4.4vw,1.28rem)" onclick="ansEX('+vi+')">'+o.o+'</button>').join("")+'</div>');}

/* ---------- comprensión lectora: un texto corto + varias preguntas sobre ÉL ----------
   Único caso donde el "banco" no es una función que da UNA pregunta suelta, sino un texto
   con su propio set de preguntas — se guarda el texto en EX.passage y renderEX() lo muestra
   arriba de cada pregunta mientras dura esta unidad. */
const EXAM_READING_BANK=[
 {text:"Ana tiene un perro pequeño llamado Toby. Todas las mañanas, Ana le da agua y comida a Toby. Después, salen a caminar por el parque. A Toby le encanta correr detrás de la pelota.",
  qs:[{q:"¿Cómo se llama el perro de Ana?",ops:["Toby","Ana","Max"],a:0},
   {q:"¿Qué le da Ana a Toby en las mañanas?",ops:["Agua y comida","Solo agua","Un juguete"],a:0},
   {q:"¿A dónde salen a caminar?",ops:["Al parque","A la escuela","Al mercado"],a:0},
   {q:"¿Qué le encanta hacer a Toby?",ops:["Correr detrás de la pelota","Dormir todo el día","Subir árboles"],a:0}]},
 {text:"Hoy es el cumpleaños de Sofía. Su mamá preparó un pastel de chocolate. Sus amigos llegaron con globos de colores. Todos cantaron 'Feliz cumpleaños' y Sofía sopló las velitas.",
  qs:[{q:"¿De quién es el cumpleaños?",ops:["De Sofía","De su mamá","De un amigo"],a:0},
   {q:"¿De qué sabor era el pastel?",ops:["Chocolate","Vainilla","Fresa"],a:0},
   {q:"¿Qué trajeron los amigos?",ops:["Globos de colores","Libros","Zapatos"],a:0},
   {q:"¿Qué hizo Sofía al final?",ops:["Sopló las velitas","Se durmió","Lloró"],a:0}]},
 {text:"En la granja de don Pedro viven muchos animales. Las vacas dan leche fresca cada mañana. Las gallinas ponen huevos en el gallinero. Los caballos corren libres por el campo verde.",
  qs:[{q:"¿De quién es la granja?",ops:["De don Pedro","De Sofía","De Toby"],a:0},
   {q:"¿Qué dan las vacas?",ops:["Leche fresca","Huevos","Lana"],a:0},
   {q:"¿Dónde ponen huevos las gallinas?",ops:["En el gallinero","En el río","En el árbol"],a:0},
   {q:"¿Qué hacen los caballos?",ops:["Corren libres por el campo","Vuelan","Nadan"],a:0}]}];
async function buildComprensionSet(){
 if(S.geminiKey&&typeof geminiJSON==="function"){
  try{
   const o=await geminiJSON('Eres profesor de primero de primaria. Escribe un texto corto (40 a 60 palabras) en español, sencillo, sobre una situación cotidiana para un niño de 7 años (sin personajes de marcas registradas). Luego crea 4 preguntas de comprensión lectora sobre ese texto, opción múltiple con 3 opciones cada una, una sola correcta. SOLO JSON: {"text":"el texto","items":[{"q":"pregunta","ops":["correcta","mala","mala"],"a":0}]}');
   if(o&&o.text&&o.items&&o.items.length){
    const items=o.items.map(function(it){const c=it.ops[it.a],ops=shuffled(it.ops);return{q:it.q,ops:ops,a:ops.indexOf(c)};});
    return{text:o.text,items:items};
   }
  }catch(e){}
 }
 const p=pick(EXAM_READING_BANK);
 return{text:p.text,items:p.qs.map(function(it){return{q:it.q,ops:it.ops.slice(),a:it.a};})};}
function examComprension(){
 setTheme("kid");
 render(topbar("screenExam()")+'<div class="card center" style="padding:40px"><div class="spin" style="font-size:3rem">⏳</div><h2 style="margin-top:10px">Preparando la lectura…</h2></div>');
 buildComprensionSet().then(function(data){
  EX={uid:"comprension",items:data.items,i:0,ok:0,sim:false,passage:data.text};
  renderEX();});}

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
