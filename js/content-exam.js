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
 {q:"¿Con qué parte VEMOS?",pic:"👀",ops:["Los ojos","La nariz","El codo"],a:0},
 {q:"¿Con qué parte OLEMOS?",pic:"👃",ops:["La nariz","Los ojos","Las manos"],a:0},
 {q:"¿Con qué parte ESCUCHAMOS?",pic:"👂",ops:["Las orejas","La boca","Los pies"],a:0},
 {q:"¿Con qué parte CAMINAMOS?",pic:"🦶",ops:["Los pies","Las manos","Las orejas"],a:0},
 {q:"¿Con qué parte AGARRAMOS las cosas?",pic:"✋",ops:["Las manos","Los pies","La espalda"],a:0},
 {q:"¿Con qué MASTICAMOS la comida?",pic:"😁",ops:["Los dientes","Los ojos","Las rodillas"],a:0},
 {q:"¿Dónde tienes el CODO?",pic:"💪",ops:["En el brazo","En el pie","En la cabeza"],a:0},
 {q:"¿Dónde tienes la RODILLA?",pic:"🦵",ops:["En la pierna","En la mano","En la cara"],a:0},
 {q:"La ESPALDA está…",pic:"🧍",ops:["Detrás del cuerpo","En la cara","En los pies"],a:0},
 {q:"El CUELLO une la cabeza con…",pic:"🧍",ops:["El cuerpo","El pie","La mano"],a:0},
 {q:"¿Dónde tienes los DEDOS?",pic:"✋",ops:["En las manos y los pies","En la cabeza","En la espalda"],a:0},
 {q:"¿Cuántos ojos tenemos?",pic:"👀",ops:["Dos","Uno","Cinco"],a:0},
 {q:"El pelo está en la…",pic:"🧑",ops:["Cabeza","Pierna","Mano"],a:0},
 {q:"¿Con qué parte HABLAMOS?",pic:"👄",ops:["La boca","La nariz","La oreja"],a:0}];
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
const PROB_NAMES=["Ana","Pedro","Lucía","Mateo","Sara","Tomás","Valentina","Samuel","Isabela","Nico"];
function pn(){return pick(PROB_NAMES);}
function genProblema2(){
 const tipo=rnd(10),A=pn(),B=pn();
 if(tipo===0){const a=10+rnd(40),b=5+rnd(30);const o=opsFor(a+b);return{q:A+" tiene "+a+" stickers y le regalan "+b+". ¿Cuántos tiene ahora?",ops:o.ops,a:o.a,pic:"⭐",tip:"Le DAN más → se SUMA: "+a+" + "+b};}
 if(tipo===1){const a=20+rnd(50),b=5+rnd(15);const o=opsFor(a-b);return{q:"Hay "+a+" galletas y se comen "+b+". ¿Cuántas quedan?",ops:o.ops,a:o.a,pic:"🍪",tip:"Se QUITAN → se RESTA: "+a+" − "+b};}
 if(tipo===2){const g=2+rnd(4),c=2+rnd(5);const o=opsFor(g*c);return{q:"Hay "+g+" cajas con "+c+" pelotas cada una. ¿Cuántas pelotas en total?",ops:o.ops,a:o.a,pic:"⚽",tip:"Grupos iguales → se MULTIPLICA: "+g+" × "+c};}
 if(tipo===3){const total=20+rnd(30),parte=5+rnd(10);const o=opsFor(total-parte);return{q:A+" tenía "+total+" dulces y repartió "+parte+". ¿Cuántos le quedan?",ops:o.ops,a:o.a,pic:"🍬",tip:"Repartió (se van) → se RESTA: "+total+" − "+parte};}
 if(tipo===4){const a=8+rnd(20),b=3+rnd(a-2);const o=opsFor(a-b);return{q:A+" tiene "+a+" carritos y "+B+" tiene "+b+". ¿Cuántos carritos MÁS tiene "+A+"?",ops:o.ops,a:o.a,pic:"🚗",tip:"¿Cuántos MÁS? → se RESTA: "+a+" − "+b};}
 if(tipo===5){const a=5+rnd(20);const o=opsFor(a*2);return{q:A+" tiene "+a+" figuritas y "+B+" tiene el DOBLE. ¿Cuántas tiene "+B+"?",ops:o.ops,a:o.a,pic:"🎴",tip:"El DOBLE → se multiplica por 2: "+a+" × 2"};}
 if(tipo===6){const gr=2+rnd(4),cu=(2+rnd(4));const total=gr*cu;const o=opsFor(cu);return{q:"Hay "+total+" manzanas para repartir en "+gr+" canastas iguales. ¿Cuántas van en cada canasta?",ops:o.ops,a:o.a,pic:"🍎",tip:"Repartir en partes iguales → se DIVIDE: "+total+" ÷ "+gr};}
 if(tipo===7){const a=5+rnd(15),b=5+rnd(15),c=3+rnd(10);const o=opsFor(a+b+c);return{q:A+" leyó "+a+" páginas el lunes, "+b+" el martes y "+c+" el miércoles. ¿Cuántas leyó en total?",ops:o.ops,a:o.a,pic:"📖",tip:"En total (todo junto) → se SUMA: "+a+" + "+b+" + "+c};}
 if(tipo===8){const precio=3+rnd(8),cant=2+rnd(4);const o=opsFor(precio*cant);return{q:"Un helado cuesta "+precio+" monedas. ¿Cuánto cuestan "+cant+" helados?",ops:o.ops,a:o.a,pic:"🍦",tip:cant+" veces el precio → se MULTIPLICA: "+precio+" × "+cant};}
 const tenia=15+rnd(30),gasto=5+rnd(10);const o=opsFor(tenia-gasto);return{q:A+" tenía "+tenia+" monedas y gastó "+gasto+" en un juguete. ¿Cuántas le quedan?",ops:o.ops,a:o.a,pic:"🪙",tip:"Gastó (se van) → se RESTA: "+tenia+" − "+gasto};}

/* ============ SEGUNDO GRADO: SOCIALES, GEOGRAFÍA Y CULTURA GENERAL (trivias) ============ */
const GEO_QS=[
 {q:"¿Cómo se llama el planeta donde vivimos?",pic:"🌍",ops:["La Tierra","La Luna","El Sol"],a:0},
 {q:"¿En qué país vives?",pic:"🌎",ops:["Colombia","La casa","El colegio"],a:0},
 {q:"¿Qué nos muestra dónde están los lugares?",pic:"🗺️",ops:["El mapa","El reloj","El plato"],a:0},
 {q:"El agua grandota y salada es el…",pic:"🌊",ops:["Mar","Vaso","Charco"],a:0},
 {q:"¿Dónde hay mucha arena para jugar?",pic:"🏖️",ops:["La playa","La cocina","El salón"],a:0},
 {q:"Lo más alto que vemos a lo lejos son las…",pic:"⛰️",ops:["Montañas","Sillas","Mesas"],a:0},
 {q:"¿Qué sale en el día y nos da luz?",pic:"☀️",ops:["El sol","La luna","Las estrellas"],a:0},
 {q:"¿Qué vemos en el cielo de noche?",pic:"🌙",ops:["La luna y las estrellas","El sol","El arcoíris"],a:0},
 {q:"El lugar con muchas casas y edificios es la…",pic:"🏙️",ops:["Ciudad","Cueva","Nube"],a:0},
 {q:"El agua que corre por la tierra es el…",pic:"🏞️",ops:["Río","Mar","Desierto"],a:0},
 {q:"¿De qué color es el pasto y los árboles?",pic:"🌳",ops:["Verde","Morado","Negro"],a:0}];
function genGeo(){const x=pick(GEO_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
const SOC_QS=[
 {q:"En clase, para hablar levantamos la…",pic:"🙋",ops:["Mano","Silla","Mesa"],a:0},
 {q:"¿Quiénes te cuidan y te quieren en casa?",pic:"👨‍👩‍👧",ops:["Mi familia","Los carros","Los juguetes"],a:0},
 {q:"La basura se bota en la…",pic:"🗑️",ops:["Caneca","Cama","Ventana"],a:0},
 {q:"El que apaga el fuego y nos ayuda es el…",pic:"👨‍🚒",ops:["Bombero","Payaso","Cocinero"],a:0},
 {q:"¿Quién te enseña en el colegio?",pic:"👩‍🏫",ops:["La profesora","El perro","El vecino"],a:0},
 {q:"A los amigos los tratamos…",pic:"🤝",ops:["Con cariño","A los golpes","Con gritos"],a:0},
 {q:"Cuando alguien te ayuda dices…",pic:"🙏",ops:["Gracias","Quítate","Nada"],a:0},
 {q:"¿Quién cura a las personas enfermas?",pic:"👩‍⚕️",ops:["El doctor","El bombero","El cartero"],a:0},
 {q:"¿Dónde vas a aprender cada día?",pic:"🏫",ops:["Al colegio","Al circo","Al mar"],a:0},
 {q:"Antes de cruzar la calle hay que…",pic:"🚦",ops:["Mirar a los dos lados","Correr sin mirar","Cerrar los ojos"],a:0},
 {q:"En el carro nos ponemos el…",pic:"🚗",ops:["Cinturón","Sombrero","Zapato"],a:0},
 {q:"¿Quién trae las cartas a la casa?",pic:"📬",ops:["El cartero","El doctor","El profesor"],a:0}];
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

/* ============ SEGUNDO GRADO: INFORMÁTICA BÁSICA ============ */
const INFO_QS=[
 {q:"¿Para qué sirve el mouse o ratón?",pic:"🖱️",ops:["Para mover el puntero y hacer clic","Para escuchar música","Para escribir cartas"],a:0},
 {q:"¿Con qué escribimos en el computador?",pic:"⌨️",ops:["El teclado","La pantalla","El mouse"],a:0},
 {q:"La parte donde vemos las cosas es la…",pic:"🖥️",ops:["Pantalla","Tecla","Bocina"],a:0},
 {q:"Para apagar bien el computador hay que…",pic:"🔌",ops:["Usar el botón de apagar","Desconectarlo de golpe","Darle golpes"],a:0},
 {q:"Un computador pequeño que llevamos a todos lados es el…",pic:"💻",ops:["Portátil","Televisor","Refrigerador"],a:0},
 {q:"Para escuchar el sonido usamos…",pic:"🔊",ops:["Los parlantes o audífonos","El teclado","El mouse"],a:0},
 {q:"Internet sirve para…",pic:"🌐",ops:["Buscar información y comunicarnos","Cocinar","Dormir"],a:0},
 {q:"Si alguien que no conoces te escribe en internet, debes…",pic:"🛡️",ops:["No dar tus datos y avisar a un adulto","Darle tu dirección","Mandarle fotos"],a:0},
 {q:"Cuando terminas un trabajo en el computador hay que…",pic:"💾",ops:["Guardarlo","Borrarlo","Romperlo"],a:0},
 {q:"Un programa para dibujar o jugar es una…",pic:"📱",ops:["Aplicación (app)","Silla","Ventana"],a:0},
 {q:"La tecla larga que hace los espacios es la…",pic:"⌨️",ops:["Barra espaciadora","Tecla mágica","Pantalla"],a:0},
 {q:"Si pasas mucho tiempo frente a la pantalla debes…",pic:"👀",ops:["Descansar la vista cada rato","Acercarte mucho","Apagar la luz"],a:0},
 {q:"Las carpetas en el computador sirven para…",pic:"📁",ops:["Ordenar y guardar archivos","Comer","Dibujar"],a:0},
 {q:"Para hacer clic se usa el botón…",pic:"🖱️",ops:["Del mouse","Del televisor","De la nevera"],a:0}];
function genInfo(){const x=pick(INFO_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}

/* ============ SOCIALES: BANDERAS Y CAPITALES ============ */
/* Banderas como IMAGEN (en Windows los emoji de bandera salen como letras "CA").
   Usa flagcdn.com (gratis). Necesita internet para mostrar la imagen. */
const BANDERAS=[
 ["co","Colombia"],["mx","México"],["ar","Argentina"],["br","Brasil"],["us","Estados Unidos"],
 ["es","España"],["pe","Perú"],["cl","Chile"],["ve","Venezuela"],["ec","Ecuador"],
 ["fr","Francia"],["it","Italia"],["jp","Japón"],["ca","Canadá"],["uy","Uruguay"]];
function flagImg(code,px){return '<img src="https://flagcdn.com/'+code+'.svg" alt="bandera" loading="lazy" style="width:'+(px||150)+'px;max-width:78%;height:auto;border-radius:10px;border:2px solid rgba(30,42,74,.15);box-shadow:0 5px 14px rgba(30,42,74,.22)">';}
function genBandera(){
 const it=pick(BANDERAS);
 const others=shuffled(BANDERAS.filter(b=>b[1]!==it[1])).slice(0,2);
 const ops=shuffled([it[1],others[0][1],others[1][1]]);
 return{q:"¿De qué país es esta bandera?",pic:flagImg(it[0],170),ops,a:ops.indexOf(it[1])};
}
const CAPITALES=[
 ["Colombia","Bogotá"],["México","Ciudad de México"],["Argentina","Buenos Aires"],["Perú","Lima"],
 ["Chile","Santiago"],["España","Madrid"],["Brasil","Brasilia"],["Ecuador","Quito"],
 ["Venezuela","Caracas"],["Uruguay","Montevideo"]];
function genCapital(){
 const it=pick(CAPITALES);
 const others=shuffled(CAPITALES.filter(c=>c[1]!==it[1])).slice(0,2);
 const ops=shuffled([it[1],others[0][1],others[1][1]]);
 return{q:"¿Cuál es la capital de "+it[0]+"?",pic:"🏛️",ops,a:ops.indexOf(it[1])};
}

/* ===== TEMAS DEL TABLERO DEL COLE (v9.52): poligonos, diagramas de barras, alimentos, la Tierra y el espacio ===== */
const POLI_QS=[
 {q:"¿Cuántos lados tiene un triángulo?",ops:["3","4","5"],a:0,pic:"🔺"},
 {q:"¿Cómo se llama el polígono de 4 lados iguales?",ops:["Cuadrado","Triángulo","Pentágono"],a:0,pic:"🟥"},
 {q:"¿Cuántos lados tiene un pentágono?",ops:["5","4","8"],a:0,pic:"⬠"},
 {q:"¿Cuántos lados tiene un hexágono?",ops:["6","5","3"],a:0,pic:"⬡"},
 {q:"¿Cuál de estas figuras NO es un polígono?",ops:["El círculo","El cuadrado","El triángulo"],a:0,pic:"⭕"},
 {q:"Un rectángulo tiene 4 lados. ¿Cómo son sus lados?",ops:["2 largos y 2 cortos","Todos iguales","Todos curvos"],a:0,pic:"▭"},
 {q:"¿Cómo se llaman las esquinas de un polígono?",ops:["Vértices","Círculos","Puntas de flecha"],a:0,pic:"📐"},
 {q:"¿Qué polígono tiene 8 lados, como la señal de PARE?",ops:["Octágono","Hexágono","Cuadrado"],a:0,pic:"🛑"},
 {q:"¿Qué es un polígono?",ops:["Una figura cerrada con lados rectos","Una línea curva","Un número grande"],a:0,pic:"🔷"},
 {q:"El lado de un polígono es…",ops:["Una línea recta","Un círculo","Un punto"],a:0,pic:"📏"}];
function genPoligono(){const x=pick(POLI_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
/* diagramas de barras: genera un mini diagrama con emojis y pregunta leerlo */
/* dibuja un diagrama de barras SVG de verdad (como en los libros): eje, cuadrícula, barras de colores con su valor */
function barChartSVG(names,vals,emoji){
 const W=300,H=195,pad=34,baseY=H-34,maxV=8;
 const cols=["#3EC97C","#3B82F6","#FF6B6B"];
 const bw=52,gap=(W-pad-16-names.length*bw)/(names.length+1);
 let grid="";
 for(let v=2;v<=maxV;v+=2){const y=baseY-(v/maxV)*(baseY-30);
  grid+='<line x1="'+pad+'" y1="'+y+'" x2="'+(W-12)+'" y2="'+y+'" stroke="rgba(30,42,74,.12)" stroke-width="1"/>'
   +'<text x="'+(pad-6)+'" y="'+(y+4)+'" text-anchor="end" font-family="Fredoka,sans-serif" font-size="11" fill="rgba(30,42,74,.55)">'+v+'</text>';}
 let bars="";
 names.forEach((n,i)=>{
  const h=(vals[i]/maxV)*(baseY-30);
  const x=pad+gap+i*(bw+gap),y=baseY-h;
  bars+='<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+h+'" rx="6" fill="'+cols[i%3]+'" stroke="#1E2A4A" stroke-width="2.5"/>'
   +'<text x="'+(x+bw/2)+'" y="'+(y-6)+'" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="15" fill="#1E2A4A">'+vals[i]+'</text>'
   +'<text x="'+(x+bw/2)+'" y="'+(baseY+17)+'" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="13.5" fill="#1E2A4A">'+n+'</text>';
 });
 return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;max-width:330px;background:#fff;border:3px solid #1E2A4A;border-radius:14px" xmlns="http://www.w3.org/2000/svg">'
  +'<text x="'+(W/2)+'" y="19" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="14" fill="#1E2A4A">'+emoji+' que tiene cada niño</text>'
  +grid
  +'<line x1="'+pad+'" y1="'+baseY+'" x2="'+(W-12)+'" y2="'+baseY+'" stroke="#1E2A4A" stroke-width="2.5"/>'
  +'<line x1="'+pad+'" y1="26" x2="'+pad+'" y2="'+baseY+'" stroke="#1E2A4A" stroke-width="2.5"/>'
  +bars+'</svg>';}
function genBarrasQ(){
 const temas=[["🍎","manzanas"],["🚗","carritos"],["⚽","balones"],["🐟","peces"],["🌸","flores"],["📚","libros"]];
 const t=pick(temas);
 const names=shuffled(["Ana","Leo","Mía","Juan","Sofi"]).slice(0,3);
 const vals=shuffled([2,3,4,5,6,7,8]).slice(0,3);
 const pic=barChartSVG(names,vals,t[0]);
 const tipo=rnd(3);
 let q,ansTxt,opsArr;
 if(tipo===0){q="Mira el diagrama: ¿quién tiene MÁS "+t[1]+"?";ansTxt=names[vals.indexOf(Math.max.apply(null,vals))];opsArr=names.slice();}
 else if(tipo===1){q="Mira el diagrama: ¿quién tiene MENOS "+t[1]+"?";ansTxt=names[vals.indexOf(Math.min.apply(null,vals))];opsArr=names.slice();}
 else{const who=rnd(3);q="Según el diagrama, ¿cuántos "+t[1]+" tiene "+names[who]+"?";ansTxt=String(vals[who]);
  const set=new Set([ansTxt]);while(set.size<3){const d=vals[who]+(1+rnd(3))*(Math.random()<.5?-1:1);if(d>0)set.add(String(d));}opsArr=[...set];}
 const ops=shuffled(opsArr);
 return{q,ops,a:ops.indexOf(ansTxt),pic};}
const ALIM_QS=[
 {q:"En la pirámide alimenticia, ¿qué debemos comer MÁS?",ops:["Frutas y verduras","Dulces","Gaseosas"],a:0,pic:"🥗"},
 {q:"En la pirámide alimenticia, ¿qué va arriba (comer POQUITO)?",ops:["Dulces y grasas","Frutas","Arroz"],a:0,pic:"🍬"},
 {q:"¿Cuál de estos alimentos nos da energía (carbohidrato)?",ops:["El arroz","La lechuga","El agua"],a:0,pic:"🍚"},
 {q:"¿Qué son los carbohidratos?",ops:["Alimentos que dan energía","Juguetes","Vitaminas del sol"],a:0,pic:"⚡"},
 {q:"¿Cuál de estos alimentos tiene mucha grasa?",ops:["La mantequilla","La manzana","La zanahoria"],a:0,pic:"🧈"},
 {q:"¿Las grasas se deben comer…",ops:["Con moderación (poquito)","Todo el día","Nunca jamás"],a:0,pic:"🥑"},
 {q:"¿Cuál alimento ayuda a crecer (proteína)?",ops:["El huevo","El dulce","La gaseosa"],a:0,pic:"🥚"},
 {q:"¿Cuál es una fruta?",ops:["El mango","El pan","El queso"],a:0,pic:"🥭"},
 {q:"¿Cuál es una verdura?",ops:["La zanahoria","La galleta","El chocolate"],a:0,pic:"🥕"},
 {q:"Los lácteos como la leche y el queso nos dan…",ops:["Calcio para los huesos","Sueño","Alas"],a:0,pic:"🥛"},
 {q:"En la cadena alimenticia, ¿qué come el conejo?",ops:["Plantas","Carne","Piedras"],a:0,pic:"🐰"},
 {q:"En la cadena alimenticia, el león es…",ops:["Carnívoro (come carne)","Herbívoro","Una planta"],a:0,pic:"🦁"},
 {q:"¿Cómo empieza casi toda cadena alimenticia?",ops:["Con las plantas","Con el león","Con las piedras"],a:0,pic:"🌱"},
 {q:"Un animal que come plantas Y carne se llama…",ops:["Omnívoro","Herbívoro","Volador"],a:0,pic:"🐻"},
 {q:"¿Quién fabrica su propio alimento con la luz del sol?",ops:["Las plantas","Los perros","Los peces"],a:0,pic:"🌻"}];
function genAlimentos(){const x=pick(ALIM_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
const TIERRA_QS=[
 {q:"¿Qué forma tiene la Tierra?",ops:["Redonda (esfera)","Cuadrada","Plana como mesa"],a:0,pic:"🌍"},
 {q:"¿Cómo se llama el movimiento de la Tierra sobre sí misma?",ops:["Rotación","Traslación","Salto"],a:0,pic:"🔄"},
 {q:"¿Qué produce la rotación de la Tierra?",ops:["El día y la noche","La lluvia","Los ríos"],a:0,pic:"🌗"},
 {q:"¿Cómo se llama la vuelta que da la Tierra alrededor del Sol?",ops:["Traslación","Rotación","Caminata"],a:0,pic:"🌞"},
 {q:"¿Cuánto tarda la Tierra en dar la vuelta al Sol?",ops:["Un año","Un día","Una hora"],a:0,pic:"📅"},
 {q:"¿Qué es el Sol?",ops:["Una estrella","Un planeta","Una nube caliente"],a:0,pic:"☀️"},
 {q:"¿Qué es la Luna?",ops:["El satélite de la Tierra","Una estrella","Un planeta con mar"],a:0,pic:"🌙"},
 {q:"¿Cuándo podemos ver las estrellas?",ops:["De noche","Al mediodía","Cuando llueve"],a:0,pic:"⭐"},
 {q:"¿Cómo se llama el conjunto del Sol y sus planetas?",ops:["Sistema solar","Sistema lunar","Familia espacial"],a:0,pic:"🪐"},
 {q:"¿Qué planeta está más cerca del Sol?",ops:["Mercurio","La Tierra","Júpiter"],a:0,pic:"🔥"},
 {q:"¿Cuál es el planeta más grande del sistema solar?",ops:["Júpiter","Marte","La Luna"],a:0,pic:"🪐"},
 {q:"¿En qué planeta vivimos?",ops:["La Tierra","Marte","Venus"],a:0,pic:"🌎"},
 {q:"¿De qué color se ve Marte?",ops:["Rojo","Verde","Rosado"],a:0,pic:"🔴"},
 {q:"¿Qué nos da el Sol?",ops:["Luz y calor","Frío","Lluvia de dulces"],a:0,pic:"🌞"}];
function genTierra(){const x=pick(TIERRA_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}
