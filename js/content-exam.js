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

/* ============ SEGUNDO GRADO: CUERPO HUMANO ============ */
const CUERPO_PARTES=[
 {q:"¿Dónde queda el CODO?",pic:"💪",ops:["En el brazo, donde se dobla","En la pierna","En la cabeza"],a:0},
 {q:"¿Dónde queda la ESPALDA?",pic:"🧍",ops:["En la parte de atrás del cuerpo","En la cara","En los pies"],a:0},
 {q:"¿Qué parte usamos para doblar la pierna?",pic:"🦵",ops:["La rodilla","El codo","La muñeca"],a:0},
 {q:"¿Dónde está el TOBILLO?",pic:"🦶",ops:["Entre el pie y la pierna","En la mano","En el cuello"],a:0},
 {q:"¿Qué une la mano con el brazo?",pic:"✋",ops:["La muñeca","El hombro","La rodilla"],a:0},
 {q:"¿Dónde está el HOMBRO?",pic:"🧍",ops:["Donde el brazo se une al cuerpo","En el pie","En la frente"],a:0},
 {q:"La parte de arriba de la cara, sobre los ojos, es la…",pic:"🧑",ops:["Frente","Barbilla","Nuca"],a:0},
 {q:"La parte de atrás del cuello se llama…",pic:"🧍",ops:["Nuca","Mejilla","Talón"],a:0},
 {q:"El TALÓN está en…",pic:"🦶",ops:["La parte de atrás del pie","La mano","La cabeza"],a:0},
 {q:"Las MEJILLAS están en…",pic:"😊",ops:["La cara","Las piernas","La espalda"],a:0},
 {q:"¿Con qué parte agarramos las cosas?",pic:"✋",ops:["Los dedos","Los codos","Las rodillas"],a:0},
 {q:"¿Qué parte nos sostiene de pie?",pic:"🦵",ops:["Las piernas","Las orejas","La nariz"],a:0},
 {q:"La PANTORRILLA está en…",pic:"🦵",ops:["La parte de atrás de la pierna","El brazo","La cara"],a:0},
 {q:"¿Cómo se llama el hueso de la columna en la espalda?",pic:"🦴",ops:["Columna vertebral","Codo","Rodilla"],a:0}];
function genCuerpoParte(){const x=pick(CUERPO_PARTES);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
const SISTEMAS_QS=[
 {q:"¿Qué órgano usamos para RESPIRAR?",pic:"🫁",ops:["Los pulmones","El estómago","Los huesos"],a:0},
 {q:"El sistema RESPIRATORIO sirve para…",pic:"🌬️",ops:["Respirar (tomar aire)","Comer","Caminar"],a:0},
 {q:"¿A dónde llega la comida cuando comemos?",pic:"🍎",ops:["Al estómago","A los pulmones","Al cerebro"],a:0},
 {q:"El sistema DIGESTIVO sirve para…",pic:"🍽️",ops:["Digerir la comida","Respirar","Pensar"],a:0},
 {q:"¿Qué órgano bombea la sangre?",pic:"🫀",ops:["El corazón","El estómago","Los huesos"],a:0},
 {q:"El sistema que lleva la sangre por el cuerpo es el…",pic:"❤️",ops:["Circulatorio","Digestivo","Respiratorio"],a:0},
 {q:"¿Qué le da forma y sostén al cuerpo?",pic:"🦴",ops:["Los huesos (sistema óseo)","La piel","El pelo"],a:0},
 {q:"¿Qué órgano usamos para PENSAR?",pic:"🧠",ops:["El cerebro","El corazón","El pie"],a:0},
 {q:"El cerebro es parte del sistema…",pic:"🧠",ops:["Nervioso","Digestivo","Óseo"],a:0},
 {q:"¿Por dónde entra el aire al respirar?",pic:"👃",ops:["La nariz y la boca","Las orejas","Los ojos"],a:0},
 {q:"¿Qué hacen los músculos?",pic:"💪",ops:["Nos ayudan a movernos","Nos hacen pensar","Digieren la comida"],a:0},
 {q:"¿Cuántos pulmones tenemos?",pic:"🫁",ops:["Dos","Uno","Cinco"],a:0},
 {q:"La sangre viaja por unos tubitos llamados…",pic:"🩸",ops:["Venas","Huesos","Dientes"],a:0},
 {q:"Los dientes son parte del sistema…",pic:"🦷",ops:["Digestivo (mastican la comida)","Respiratorio","Nervioso"],a:0}];
function genSistema(){const x=pick(SISTEMAS_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}

/* letras → cifras (al revés de leer números) */
function genPalabraNum(){
 const n=10+rnd(80);const correct=String(n);
 const set=new Set([n]);
 while(set.size<3){let m=Math.max(10,n+(1+rnd(8))*(Math.random()<.5?-1:1));if(m>99)m=99;set.add(m);}
 const ops=shuffled([...set]).map(String);
 return{q:'¿Qué número es "'+numEs(n)+'"?',ops,a:ops.indexOf(correct)};}

/* problemas matemáticos con contexto (segundo grado) — con técnica/pista */
function opsFor(ans){const set=new Set([ans]);while(set.size<3){const d=ans+(1+rnd(4))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}const ops=shuffled([...set]).map(String);return{ops,a:ops.indexOf(String(ans))};}
function genProblema2(){
 const tipo=rnd(4);
 if(tipo===0){const a=10+rnd(40),b=5+rnd(30);const o=opsFor(a+b);return{q:"Ana tiene "+a+" stickers y le regalan "+b+". ¿Cuántos tiene ahora?",ops:o.ops,a:o.a,pic:"⭐",tip:"Le DAN más → se SUMA: "+a+" + "+b};}
 if(tipo===1){const a=20+rnd(50),b=5+rnd(15);const o=opsFor(a-b);return{q:"Hay "+a+" galletas y se comen "+b+". ¿Cuántas quedan?",ops:o.ops,a:o.a,pic:"🍪",tip:"Se QUITAN → se RESTA: "+a+" − "+b};}
 if(tipo===2){const g=2+rnd(4),c=2+rnd(5);const o=opsFor(g*c);return{q:"Hay "+g+" cajas con "+c+" pelotas cada una. ¿Cuántas pelotas en total?",ops:o.ops,a:o.a,pic:"⚽",tip:"Grupos iguales → se MULTIPLICA: "+g+" × "+c};}
 const total=20+rnd(30),parte=5+rnd(10);const o=opsFor(total-parte);return{q:"Pedro tenía "+total+" dulces y repartió "+parte+". ¿Cuántos le quedan?",ops:o.ops,a:o.a,pic:"🍬",tip:"Repartió (se van) → se RESTA: "+total+" − "+parte};}

/* ============ SEGUNDO GRADO: SOCIALES, GEOGRAFÍA Y CULTURA GENERAL (trivias) ============ */
const GEO_QS=[
 {q:"¿En qué continente vivimos los colombianos?",pic:"🌎",ops:["América","África","Europa"],a:0},
 {q:"¿Cuál es la capital de Colombia?",pic:"🇨🇴",ops:["Bogotá","Medellín","Lima"],a:0},
 {q:"¿Cuántos continentes hay?",pic:"🗺️",ops:["Cinco o seis","Dos","Diez"],a:0},
 {q:"El agua salada más grande se llama…",pic:"🌊",ops:["Océano","Río","Lago"],a:0},
 {q:"¿Qué dibujo nos muestra dónde quedan los lugares?",pic:"🗺️",ops:["El mapa","El reloj","El libro"],a:0},
 {q:"El planeta donde vivimos se llama…",pic:"🌍",ops:["Tierra","Marte","Luna"],a:0},
 {q:"¿De qué color es la franja de arriba de la bandera de Colombia?",pic:"🇨🇴",ops:["Amarillo","Rojo","Verde"],a:0},
 {q:"Un lugar con mucha arena y poca agua es un…",pic:"🏜️",ops:["Desierto","Océano","Bosque"],a:0},
 {q:"¿Por dónde sale el sol?",pic:"🌅",ops:["Por el este (oriente)","Por el suelo","En la noche"],a:0},
 {q:"Un mapa con todos los países es el…",pic:"🌐",ops:["Mapamundi","Calendario","Menú"],a:0},
 {q:"El país vecino de Colombia que empieza por E es…",pic:"🌎",ops:["Ecuador","España","Egipto"],a:0},
 {q:"Mucha agua dulce que corre por la tierra es un…",pic:"🏞️",ops:["Río","Mar","Desierto"],a:0},
 {q:"¿Qué usamos para saber dónde está el norte?",pic:"🧭",ops:["La brújula","El reloj","La regla"],a:0},
 {q:"Las montañas más altas y frías de Colombia tienen…",pic:"🏔️",ops:["Nieve","Arena","Olas"],a:0}];
function genGeo(){const x=pick(GEO_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
const SOC_QS=[
 {q:"En el salón, para hablar primero debemos…",pic:"🙋",ops:["Levantar la mano","Gritar","Empujar"],a:0},
 {q:"¿Quiénes forman una familia?",pic:"👨‍👩‍👧",ops:["Personas que se cuidan y se quieren","Solo los vecinos","Solo los compañeros"],a:0},
 {q:"Botar la basura en su lugar es…",pic:"🗑️",ops:["Cuidar el ambiente","Algo malo","Perder el tiempo"],a:0},
 {q:"El que apaga incendios y ayuda es el…",pic:"👨‍🚒",ops:["Bombero","Panadero","Piloto"],a:0},
 {q:"¿Quién nos enseña en el colegio?",pic:"👩‍🏫",ops:["El profesor o profesora","El médico","El chef"],a:0},
 {q:"Respetar a los demás significa…",pic:"🤝",ops:["Tratarlos bien","Burlarse","Quitarles cosas"],a:0},
 {q:"Las reglas o normas sirven para…",pic:"📜",ops:["Vivir mejor entre todos","Aburrirnos","Pelear"],a:0},
 {q:"El lugar con muchos edificios y carros es…",pic:"🏙️",ops:["La ciudad","El campo","El mar"],a:0},
 {q:"El lugar con cultivos y animales de granja es…",pic:"🌾",ops:["El campo","La ciudad","La playa"],a:0},
 {q:"El doctor que cura a las personas es el…",pic:"👩‍⚕️",ops:["Médico","Bombero","Cartero"],a:0},
 {q:"Ayudar en casa con las tareas es ser…",pic:"🧹",ops:["Responsable","Flojo","Egoísta"],a:0},
 {q:"Un símbolo de nuestro país es…",pic:"🇨🇴",ops:["La bandera","La televisión","El celular"],a:0},
 {q:"Cuando alguien nos ayuda decimos…",pic:"🙏",ops:["Gracias","Quítate","Nada"],a:0},
 {q:"Antes de cruzar la calle debemos…",pic:"🚦",ops:["Mirar a ambos lados","Correr sin mirar","Cerrar los ojos"],a:0}];
function genSociales(){const x=pick(SOC_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
const CULT_QS=[
 {q:"¿Cuántas patas tiene una araña?",pic:"🕷️",ops:["Ocho","Seis","Cuatro"],a:0},
 {q:"¿Qué animal es el más grande del mar?",pic:"🐋",ops:["La ballena","El pez payaso","El cangrejo"],a:0},
 {q:"¿Cuántos días tiene una semana?",pic:"📅",ops:["Siete","Cinco","Doce"],a:0},
 {q:"El animal que dice 'muu' y nos da leche es la…",pic:"🐄",ops:["Vaca","Gallina","Oveja"],a:0},
 {q:"En el día está el sol y en la noche sale la…",pic:"🌙",ops:["Luna","Nube","Arena"],a:0},
 {q:"¿Qué fruta es amarilla y curva?",pic:"🍌",ops:["Banano","Manzana","Uva"],a:0},
 {q:"¿Cuántos colores tiene el arcoíris?",pic:"🌈",ops:["Siete","Tres","Diez"],a:0},
 {q:"El rey de la selva es el…",pic:"🦁",ops:["León","Conejo","Ratón"],a:0},
 {q:"El agua muy fría se vuelve…",pic:"🧊",ops:["Hielo","Vapor","Piedra"],a:0},
 {q:"¿Qué insecto hace miel?",pic:"🐝",ops:["La abeja","La mosca","La hormiga"],a:0},
 {q:"¿Cuánto es una docena?",pic:"🥚",ops:["Doce","Diez","Seis"],a:0},
 {q:"¿Qué necesita una planta para crecer?",pic:"🌱",ops:["Agua y sol","Solo oscuridad","Helado"],a:0},
 {q:"El pájaro que no vuela pero nada y vive en el frío es el…",pic:"🐧",ops:["Pingüino","Águila","Loro"],a:0},
 {q:"¿De qué color se ponen las hojas en otoño?",pic:"🍂",ops:["Café y naranja","Azules","Moradas"],a:0}];
function genCultura(){const x=pick(CULT_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
