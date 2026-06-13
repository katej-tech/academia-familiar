"use strict";
/* ============ CONTENIDO ENFOCADO EN LOS EXÁMENES DE 1° (refuerzo) ============ */

/* ---- SUSTANTIVOS (¿cuál es un nombre?) ---- */
const SUSTANTIVOS=["perro","casa","mesa","niño","sol","flor","gato","libro","árbol","silla","pelota","mamá","escuela","carro","manzana","río","luna","pájaro"];
const NO_SUSTANTIVOS=["correr","bonito","saltar","rojo","feliz","comer","grande","jugar","rápido","dormir","azul","cantar","alto","reír","verde","bailar"];
function genSustantivo(){
 const noun=pick(SUSTANTIVOS);
 const others=shuffled(NO_SUSTANTIVOS).slice(0,2);
 const ops=shuffled([noun,...others]);
 return{q:"¿Cuál de estas palabras es un sustantivo (el nombre de algo)?",ops,a:ops.indexOf(noun)};
}

/* ---- SÍLABAS TRABADAS (fr, br, cr, tr, pl, bl, cl, gl, gr, pr, fl, dr) ---- */
const SILABAS_TRABADAS={
 FR:[["fresa","🍓"],["fruta","🍇"],["frío","🥶"]],
 BR:[["brazo","💪"],["libro","📖"],["cabra","🐐"]],
 CR:[["cruz","✝️"],["cremallera","🤐"],["cráter","🌋"]],
 TR:[["tren","🚂"],["tres","3️⃣"],["trompo","🎯"]],
 PL:[["plato","🍽️"],["playa","🏖️"],["pluma","🪶"]],
 BL:[["blanco","⚪"],["bloque","🧱"],["blusa","👚"]],
 CL:[["clavo","🔩"],["clase","🏫"],["clima","🌤️"]],
 GL:[["globo","🎈"],["iglesia","⛪"],["regla","📏"]],
 GR:[["grande","🐘"],["tigre","🐯"],["grillo","🦗"]],
 PR:[["primo","👦"],["premio","🏆"],["princesa","👸"]],
 FL:[["flor","🌸"],["flecha","🏹"],["flauta","🎶"]],
 DR:[["dragón","🐲"],["piedra","🪨"],["dragón","🐉"]]};
function genSilaba(){
 const keys=Object.keys(SILABAS_TRABADAS);
 const k=pick(keys);
 const w=pick(SILABAS_TRABADAS[k]);
 const others=shuffled(keys.filter(x=>x!==k)).slice(0,2);
 const ops=shuffled([k,...others]);
 return{q:'¿Qué sílaba trabada tiene la palabra "'+w[0]+'"?',pic:w[1],ops,a:ops.indexOf(k)};
}

/* ---- ORTOGRAFÍA (¿cómo se escribe?) ---- */
const ORTOGRAFIA=[
 ["lápiz","lapis","✏️"],["vaca","baca","🐄"],["gato","jato","🐱"],["queso","keso","🧀"],
 ["casa","caza","🏠"],["zapato","sapato","👟"],["árbol","arbol","🌳"],["jirafa","girafa","🦒"],
 ["ballena","vallena","🐳"],["huevo","uevo","🥚"],["llave","yave","🔑"],["cebra","sebra","🦓"],
 ["bicicleta","vicicleta","🚲"],["abeja","aveja","🐝"],["guitarra","gitarra","🎸"],["nariz","naris","👃"]];
function genOrtografia(){
 const w=pick(ORTOGRAFIA);
 const ops=shuffled([w[0],w[1]]);
 return{q:"¿Cómo se escribe bien?",pic:w[2],ops,a:ops.indexOf(w[0])};
}

/* ---- LA NARRACIÓN y sus elementos ---- */
const NARRACION_QS=[
 {q:"¿Qué es una narración?",ops:["Un cuento o una historia 📖","Una canción 🎵","Un número 🔢"],a:0},
 {q:"¿Quiénes participan en una historia?",ops:["Los personajes 🧑","Los colores 🎨","Los números 🔢"],a:0},
 {q:"El que cuenta la historia es el…",ops:["Narrador 🗣️","Pintor 🎨","Cantante 🎤"],a:0},
 {q:"Las obras para ser REPRESENTADAS (teatro) son…",ops:["Dramáticas 🎭","Narrativas 📖","Líricas 🎵"],a:0},
 {q:"Las obras que NARRAN historias son…",ops:["Narrativas 📖","Dramáticas 🎭","Líricas 🎵"],a:0},
 {q:"Las obras que expresan SENTIMIENTOS (poemas) son…",ops:["Líricas 🎵","Narrativas 📖","Dramáticas 🎭"],a:0},
 {q:"Donde ocurre la historia se llama…",ops:["El lugar 🏞️","El número","El color"],a:0},
 {q:"Un cuento empieza, tiene un problema y…",ops:["un final ✅","un número","un color"],a:0}];
function genNarracion(){const x=pick(NARRACION_QS);return{q:x.q,ops:x.ops.slice(),a:x.a};}

/* ---- LEER NÚMEROS (número ↔ palabra) ---- */
function numEs(n){
 const u=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"];
 const d10=["diez","once","doce","trece","catorce","quince","dieciséis","diecisiete","dieciocho","diecinueve"];
 const d20=["veinte","veintiuno","veintidós","veintitrés","veinticuatro","veinticinco","veintiséis","veintisiete","veintiocho","veintinueve"];
 const dec=["","","","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"];
 if(n<10)return u[n];
 if(n<20)return d10[n-10];
 if(n<30)return d20[n-20];
 const d=Math.floor(n/10),r=n%10;
 return dec[d]+(r?" y "+u[r]:"");
}
function genNumPalabra(){
 const n=10+rnd(80);
 const correct=numEs(n);
 const set=new Set([correct]);
 while(set.size<3){let m=Math.max(10,n+(1+rnd(8))*(Math.random()<.5?-1:1));if(m>99)m=99;set.add(numEs(m));}
 const ops=shuffled([...set]);
 return{q:'¿Cómo se lee el número '+n+'?',ops,a:ops.indexOf(correct)};
}

/* ---- DECENAS EXACTAS (20 + 30) ---- */
function genDecenas(){
 const a=(1+rnd(7))*10;const b=(1+rnd(Math.min(8,(90-a)/10|0)||1))*10;
 return mcq(a+" + "+b+" = ?",a+b);
}

/* ---- EL TIEMPO (reloj, horas, días, pasado/presente/futuro) ---- */
const TIEMPO_QS=[
 {q:"¿Con qué medimos el tiempo?",pic:"🕐",ops:["El reloj","La regla 📏","La balanza ⚖️"],a:0},
 {q:"¿Cuántas horas tiene un día?",pic:"🌞🌙",ops:["24 horas","12 horas","10 horas"],a:0},
 {q:"¿Cuántos meses tiene el año?",pic:"🗓️",ops:["12 meses","6 meses","31 días"],a:0},
 {q:"¿Cuántos días tiene la semana?",pic:"📅",ops:["7 días","5 días","10 días"],a:0},
 {q:"El tiempo que YA pasó es el…",pic:"⏪",ops:["Pasado","Presente","Futuro"],a:0},
 {q:"El tiempo que vivimos AHORA es el…",pic:"⏺️",ops:["Presente","Pasado","Futuro"],a:0},
 {q:"El tiempo que AÚN no llega es el…",pic:"⏩",ops:["Futuro","Pasado","Presente"],a:0},
 {q:"\"Ayer jugué\" está en tiempo…",pic:"🌜",ops:["Pasado","Presente","Futuro"],a:0},
 {q:"\"Mañana iré\" está en tiempo…",pic:"🌅",ops:["Futuro","Pasado","Presente"],a:0},
 {q:"¿Qué día viene después del miércoles?",pic:"📆",ops:["Jueves","Lunes","Domingo"],a:0}];
function genTiempo(){const x=pick(TIEMPO_QS);return{q:x.q,pic:x.pic,ops:x.ops.slice(),a:x.a};}

/* ---- SECUENCIAS NUMÉRICAS (patrones +2, +4, +5, +10, -2…) como en el examen ---- */
function genSecuenciaNum(){
 const steps=[2,3,4,5,10,-2,-5];
 const step=pick(steps);
 let start;
 if(step>0)start=1+rnd(15);
 else start=40+rnd(20); // descendentes empiezan alto
 const seq=[start,start+step,start+2*step,start+3*step];
 const ans=start+4*step;
 const set=new Set([ans]);
 while(set.size<3){const d=ans+(1+rnd(4))*(Math.random()<.5?-1:1);if(d>=0&&d!==ans)set.add(d);}
 const ops=shuffled([...set]).map(String);
 return{q:"¿Qué número sigue?  "+seq.join(", ")+", ___",ops,a:ops.indexOf(String(ans))};
}
