/* ============ CONTENIDO ============ */
const MESES=[["enero","January"],["febrero","February"],["marzo","March"],["abril","April"],["mayo","May"],["junio","June"],["julio","July"],["agosto","August"],["septiembre","September"],["octubre","October"],["noviembre","November"],["diciembre","December"]];
const VOCAL_WORDS=[["A","🐝 Abeja"],["A","🌳 Árbol"],["A","💍 Anillo"],["E","🐘 Elefante"],["E","⭐ Estrella"],["E","🪜 Escalera"],["I","🏝️ Isla"],["I","🧲 Imán"],["I","⛪ Iglesia"],["O","🐻 Oso"],["O","👁️ Ojo"],["O","🌊 Ola"],["U","🍇 Uva"],["U","💅 Uña"],["U","1️⃣ Uno"]];
const EN_KID=[["red","rojo ❤️"],["blue","azul 💙"],["green","verde 💚"],["yellow","amarillo 💛"],["dog","perro 🐶"],["cat","gato 🐱"],["sun","sol ☀️"],["moon","luna 🌙"],["water","agua 💧"],["apple","manzana 🍎"],["house","casa 🏠"],["one","uno 1️⃣"],["two","dos 2️⃣"],["three","tres 3️⃣"],["star","estrella ⭐"],["fish","pez 🐟"],["bird","pájaro 🐦"],["milk","leche 🥛"]];

/* Inglés con AUDIO: palabra, traducción, imagen */
const EN_VOCAB={
 animals:[["dog","perro","🐶"],["cat","gato","🐱"],["bird","pájaro","🐦"],["fish","pez","🐟"],["cow","vaca","🐮"],["horse","caballo","🐴"],["duck","pato","🦆"],["bear","oso","🐻"],["lion","león","🦁"],["frog","rana","🐸"]],
 colors:[["red","rojo","🔴"],["blue","azul","🔵"],["green","verde","🟢"],["yellow","amarillo","🟡"],["pink","rosado","🩷"],["black","negro","⚫"],["white","blanco","⚪"],["orange","naranja","🟠"]],
 food:[["apple","manzana","🍎"],["banana","banano","🍌"],["milk","leche","🥛"],["bread","pan","🍞"],["egg","huevo","🥚"],["water","agua","💧"],["cake","torta","🍰"],["rice","arroz","🍚"]],
 family:[["mom","mamá","👩"],["dad","papá","👨"],["baby","bebé","👶"],["sister","hermana","👧"],["brother","hermano","👦"],["grandma","abuela","👵"],["grandpa","abuelo","👴"]],
 body:[["hand","mano","✋"],["eye","ojo","👁️"],["nose","nariz","👃"],["mouth","boca","👄"],["foot","pie","🦶"],["ear","oreja","👂"],["hair","cabello","💇"]],
 numbers:[["one","uno","1️⃣"],["two","dos","2️⃣"],["three","tres","3️⃣"],["four","cuatro","4️⃣"],["five","cinco","5️⃣"],["six","seis","6️⃣"],["seven","siete","7️⃣"],["eight","ocho","8️⃣"]]
};
const EN_CATS=[["animals","Animales","🐶"],["colors","Colores","🎨"],["food","Comida","🍎"],["family","Familia","👨‍👩‍👧"],["body","El cuerpo","🧍"],["numbers","Números","🔢"]];
const EN_PHRASES=[["Hello!","¡Hola!"],["Good morning","Buenos días"],["Thank you","Gracias"],["How are you?","¿Cómo estás?"],["I am happy","Estoy feliz"],["What is your name?","¿Cómo te llamas?"],["My name is...","Me llamo..."],["See you later","Hasta luego"],["I like it","Me gusta"],["Yes, please","Sí, por favor"]];

/* Sonidos y escritura de letras en español */
const LETTER_SOUNDS=[
 {letter:"C",cases:[["casa","🏠","la C suena fuerte: /k/"],["cama","🛏️","/k/"],["cono","🍦","/k/"],["cielo","☁️","con E/I suena /s/: ce-ci"],["cine","🎬","/s/"]]},
 {letter:"S",cases:[["sol","☀️","la S suena /s/"],["sapo","🐸","/s/"],["sopa","🍲","/s/"],["silla","🪑","/s/"]]},
 {letter:"Q",cases:[["queso","🧀","que suena /ke/"],["quince","1️⃣5️⃣","qui suena /ki/"],["quien","❓","/ki/"]]},
 {letter:"G",cases:[["gato","🐱","ga suena /ga/"],["goma","✏️","/go/"],["gente","👥","ge/gi suena suave /je/"],["girasol","🌻","/ji/"]]},
 {letter:"R",cases:[["ratón","🐭","al inicio suena fuerte /rr/"],["rosa","🌹","/rr/"],["perro","🐶","doble rr es fuerte"],["pera","🍐","una r suave"]]}];

/* Mate visual y lógica */
function genSumImg(){const a=1+rnd(5),b=1+rnd(5);return{type:"dots",a,b,ans:a+b,q:a+" + "+b+" = ?"};}
const SEQUENCES=[
 {show:["🔴","🔵","🔴","🔵","❓"],ops:["🔴","🔵","🟢"],a:0},
 {show:["⭐","⭐","🌙","⭐","⭐","❓"],ops:["🌙","⭐","☀️"],a:0},
 {show:["1","2","3","4","❓"],ops:["5","6","3"],a:0},
 {show:["2","4","6","❓"],ops:["8","7","9"],a:0},
 {show:["🟩","🟨","🟩","🟨","❓"],ops:["🟩","🟨","🟦"],a:0},
 {show:["🔺","🔺","🔵","🔺","🔺","❓"],ops:["🔵","🔺","🟢"],a:0},
 {show:["5","10","15","❓"],ops:["20","25","16"],a:0},
 {show:["🐶","🐱","🐶","🐱","❓"],ops:["🐶","🐱","🐭"],a:0}];
const LOGIC_KID=[
 {q:"¿Cuál NO pertenece al grupo?",scene:"🍎🍌🍇🚗",ops:["🚗","🍎","🍇"],a:0,say:"manzana, banano, uva… ¿y un carro?"},
 {q:"¿Cuál es el más grande?",scene:"🐘🐭🐜",ops:["🐘","🐭","🐜"],a:0,say:"¿elefante, ratón u hormiga?"},
 {q:"Si hoy es lunes, ¿qué día es mañana?",scene:"📅",ops:["Martes","Domingo","Viernes"],a:0},
 {q:"¿Qué usas cuando llueve?",scene:"🌧️",ops:["☂️","🕶️","🩴"],a:0},
 {q:"Primero te pones las medias. ¿Y después?",scene:"🧦",ops:["👟","🧤","🎩"],a:0},
 {q:"¿Cuál NO pertenece?",scene:"🐶🐱🛏️🐰",ops:["🛏️","🐶","🐰"],a:0},
 {q:"Ana es más alta que Luis. ¿Quién es más bajito?",scene:"👧🧒",ops:["Luis","Ana","Los dos"],a:0},
 {q:"¿Cuál flota en el agua?",scene:"💧",ops:["🛟","🪨","🔑"],a:0,say:"¿el salvavidas, la roca o la llave?"}];
const PROBLEMS_KID=[
 {q:"Ana tiene 3 globos 🎈🎈🎈 y le regalan 2 más 🎈🎈. ¿Cuántos tiene ahora?",ops:["5","4","6"],a:0},
 {q:"Hay 6 galletas 🍪 y te comes 2. ¿Cuántas quedan?",ops:["4","3","5"],a:0},
 {q:"En el árbol hay 4 pájaros 🐦 y llegan 3 más. ¿Cuántos hay?",ops:["7","6","8"],a:0},
 {q:"Tienes 8 dulces 🍬 y das 5 a tus amigos. ¿Cuántos te quedan?",ops:["3","2","4"],a:0},
 {q:"Hay 2 cajas 📦 y cada una tiene 2 pelotas. ¿Cuántas pelotas en total?",ops:["4","2","6"],a:0},
 {q:"5 patos 🦆 nadan y se van 1. ¿Cuántos quedan?",ops:["4","5","3"],a:0},
 {q:"Tienes 3 lápices ✏️ y compras 3 más. ¿Cuántos tienes?",ops:["6","5","7"],a:0},
 {q:"Hay 10 estrellas ⭐ y se apagan 4. ¿Cuántas brillan?",ops:["6","5","7"],a:0}];

/* Cuentos largos por escenas, con preguntas de inferencia/causa-efecto */
const CUENTOS=[
 {title:"Tomás y la semilla",
  pages:[
   {scene:"👦🌱",text:"Tomás encontró una <b>semilla</b> chiquita en el patio. Quería ver si podía crecer."},
   {scene:"🪴💧☀️",text:"Cada mañana la <b>regaba</b> con agua y la ponía al <b>sol</b>. Esperó muchos días."},
   {scene:"🌳🍎😊",text:"Una semana después, salió una <b>planta verde</b>. Tomás aprendió que las cosas buenas toman tiempo."}],
  qs:[
   {q:"¿Por qué la planta logró crecer?",ops:["Porque Tomás la cuidó cada día 💧☀️","Porque era una planta mágica","Porque la dejó sola"],a:0},
   {q:"¿Qué crees que sintió Tomás al ver la planta?",ops:["Alegría y orgullo 😊","Miedo","Aburrimiento"],a:0},
   {q:"¿Qué enseña este cuento?",ops:["Que las cosas buenas toman tiempo","Que no hay que regar las plantas","Que las semillas no crecen"],a:0}]},
 {title:"Lola la tortuga",
  pages:[
   {scene:"🐢🐰",text:"Lola la <b>tortuga</b> caminaba muy <b>despacio</b>. Su amigo el conejo corría rapidísimo."},
   {scene:"🐰💨😴",text:"El conejo se adelantó tanto que se sintió cansado y se quedó <b>dormido</b> bajo un árbol."},
   {scene:"🐢🎉🏁",text:"Lola siguió y siguió sin parar. ¡Llegó <b>primero</b> a la fiesta! Despacio pero segura."}],
  qs:[
   {q:"¿Por qué Lola llegó primero si era más lenta?",ops:["Porque nunca se detuvo 🐢","Porque corrió muy rápido","Porque el conejo la ayudó"],a:0},
   {q:"¿Qué hizo el conejo que fue un error?",ops:["Quedarse dormido 😴","Caminar despacio","Llegar a la fiesta"],a:0},
   {q:"¿Qué aprendemos de Lola?",ops:["Ser constante vale más que ser veloz","Que dormir es bueno","Que correr es malo"],a:0}]},
 {title:"Beto el robot",
  pages:[
   {scene:"🤖🔵",text:"Beto el <b>robot</b> tenía un botón <b>azul</b> en el pecho. Nadie sabía para qué servía."},
   {scene:"👆🤖🕺",text:"Un día una niña tocó el botón… ¡y Beto empezó a <b>bailar</b>! Todos se rieron mucho."},
   {scene:"🎉🤖❤️",text:"Desde entonces, cada vez que alguien está triste, tocan el botón de Beto para <b>alegrarse</b>."}],
  qs:[
   {q:"¿Para qué usan ahora el botón azul de Beto?",ops:["Para alegrar a quien está triste ❤️","Para apagar a Beto","Para que camine"],a:0},
   {q:"¿Por qué se rió la gente la primera vez?",ops:["Porque el robot se puso a bailar 🕺","Porque Beto lloró","Porque se rompió"],a:0},
   {q:"¿Cómo crees que se siente Beto ayudando a otros?",ops:["Feliz y útil 😊","Enojado","Asustado"],a:0}]},
 {title:"La granja de Trueno",
  pages:[
   {scene:"🚜🐮🐷",text:"En la granja vivían <b>tres vacas</b>, <b>dos cerdos</b> y un caballo llamado <b>Trueno</b>."},
   {scene:"🐴🌧️⛈️",text:"Una noche llegó una <b>tormenta</b>. Los animales tenían miedo de los truenos."},
   {scene:"🐴🛖🐮",text:"Trueno los llevó a todos al <b>establo</b> calientito. Ahí pasaron la noche seguros y juntos."}],
  qs:[
   {q:"¿Cuántos animales vivían en la granja en total?",ops:["Seis 🐮🐮🐮🐷🐷🐴","Tres","Diez"],a:0},
   {q:"¿Por qué Trueno llevó a todos al establo?",ops:["Para protegerlos de la tormenta ⛈️","Para jugar","Para comer"],a:0},
   {q:"¿Qué tipo de caballo es Trueno?",ops:["Valiente y buen amigo","Miedoso","Egoísta"],a:0}]}];

const ROBOT_LEVELS=[
 {w:3,h:3,start:[0,2],goal:[2,2],walls:[],hint:"2 pasos a la derecha"},
 {w:3,h:3,start:[0,2],goal:[2,0],walls:[],hint:"derecha y arriba"},
 {w:4,h:3,start:[0,2],goal:[3,0],walls:[[1,1]],hint:"¡esquiva la roca!"},
 {w:4,h:4,start:[0,3],goal:[3,3],walls:[[1,3],[2,2]],hint:"sube para pasar"},
 {w:4,h:4,start:[0,0],goal:[3,3],walls:[[1,1],[2,2]],hint:"haz zigzag"},
 {w:5,h:4,start:[0,3],goal:[4,0],walls:[[1,2],[2,1],[3,2]],hint:"piensa antes de mover"}];

const B_QUIMICA=[
 {q:"¿Símbolo químico del oxígeno?",ops:["O","Ox","Og"],a:0},{q:"¿Símbolo del sodio?",ops:["Na","So","S"],a:0},
 {q:"El agua (H₂O) está formada por…",ops:["2 hidrógenos y 1 oxígeno","1 hidrógeno y 2 oxígenos","2 carbonos"],a:0},
 {q:"¿Partícula con carga negativa?",ops:["Electrón","Protón","Neutrón"],a:0},
 {q:"El número atómico (Z) lo define la cantidad de…",ops:["Protones","Electrones","Neutrones"],a:0},
 {q:"Las filas horizontales de la tabla periódica son…",ops:["Periodos","Grupos","Familias"],a:0},
 {q:"Enlace donde se COMPARTEN electrones:",ops:["Covalente","Iónico","Metálico"],a:0},
 {q:"Enlace donde se TRANSFIEREN electrones:",ops:["Iónico","Covalente","De hidrógeno"],a:0},
 {q:"Fórmula de la sal de cocina:",ops:["NaCl","KCl","NaOH"],a:0},
 {q:"El pH de un ácido es…",ops:["Menor que 7","Igual a 7","Mayor que 7"],a:0},
 {q:"¿Cuál es un cambio QUÍMICO?",ops:["Quemar papel","Derretir hielo","Romper vidrio"],a:0},
 {q:"¿Cuál es un cambio FÍSICO?",ops:["Evaporar agua","Oxidar un clavo","Digerir comida"],a:0},
 {q:"Balanceo correcto:",ops:["2H₂ + O₂ → 2H₂O","H₂ + O₂ → H₂O","H₂ + 2O₂ → H₂O"],a:0},
 {q:"El número másico (A) es…",ops:["Protones + neutrones","Protones + electrones","Solo electrones"],a:0},
 {q:"CO₂ es…",ops:["Dióxido de carbono","Monóxido de carbono","Carbonato"],a:0},
 {q:"Los gases nobles se caracterizan por…",ops:["Ser poco reactivos","Reaccionar con todo","Ser metales"],a:0},
 {q:"Una mezcla homogénea es…",ops:["Agua con sal disuelta","Agua con arena","Ensalada de frutas"],a:0},
 {q:"El símbolo Fe es…",ops:["Hierro","Flúor","Fósforo"],a:0},
 {q:"En 2H₂O hay en total…",ops:["4 H y 2 O","2 H y 1 O","4 O y 2 H"],a:0},
 {q:"¿Instrumento para medir masa?",ops:["Balanza","Probeta","Termómetro"],a:0}];
const B_FISICA=[
 {q:"La velocidad se calcula como…",ops:["distancia ÷ tiempo","tiempo ÷ distancia","masa × aceleración"],a:0},
 {q:"Unidad de fuerza en el SI:",ops:["Newton (N)","Julio (J)","Vatio (W)"],a:0},
 {q:"Segunda ley de Newton:",ops:["F = m·a","E = m·c²","V = d/t"],a:0},
 {q:"\"Un cuerpo en reposo sigue en reposo sin fuerza neta\" es la ley de…",ops:["Inercia (1ª)","Acción-reacción (3ª)","Gravitación"],a:0},
 {q:"Gravedad en la Tierra ≈",ops:["9.8 m/s²","9.8 km/h","98 m/s"],a:0},
 {q:"Empujas la pared y ella te empuja igual. Es la…",ops:["3ª ley de Newton","1ª ley","Ley de Ohm"],a:0},
 {q:"Energía de movimiento:",ops:["Cinética","Potencial","Térmica"],a:0},
 {q:"Energía almacenada por altura:",ops:["Potencial gravitatoria","Cinética","Eléctrica"],a:0},
 {q:"Unidad de energía:",ops:["Julio (J)","Newton (N)","Pascal (Pa)"],a:0},
 {q:"El sonido NO viaja en…",ops:["El vacío","El agua","El aire"],a:0},
 {q:"En la tormenta, primero…",ops:["Ves el rayo","Oyes el trueno","Llegan juntos"],a:0},
 {q:"¿Cuál magnitud es VECTORIAL?",ops:["Velocidad","Masa","Temperatura"],a:0},
 {q:"Densidad =",ops:["masa ÷ volumen","volumen ÷ masa","masa × volumen"],a:0},
 {q:"El peso es…",ops:["Una fuerza (m·g)","Igual a la masa","Una energía"],a:0},
 {q:"Rapidez constante + línea recta =",ops:["MRU","Movimiento acelerado","Movimiento circular"],a:0},
 {q:"¿Qué mide el amperímetro?",ops:["Corriente eléctrica","Voltaje","Presión"],a:0}];
const B_LOGICA=[
 {q:"x = 3\nx = x + 2\nimprimir(x)",ops:["5","3","32"],a:0,code:true},
 {q:"para i de 1 hasta 3:\n  imprimir(\"hola\")\n¿Cuántas veces imprime?",ops:["3","1","Infinitas"],a:0,code:true},
 {q:"a = 10, b = 4\nsi a > b: imprimir(\"mayor\")\nsino: imprimir(\"menor\")",ops:["mayor","menor","error"],a:0,code:true},
 {q:"x = 2\nmientras x < 10:\n  x = x * 2\nimprimir(x)",ops:["16","8","10"],a:0,code:true},
 {q:"lista = [4, 7, 1]\nimprimir(lista[0])",ops:["4","7","1"],a:0,code:true},
 {q:"x = 7\nimprimir(x % 2)   ← residuo",ops:["1","0","3.5"],a:0,code:true},
 {q:"s = 0\npara i de 1 hasta 4:\n  s = s + i\nimprimir(s)",ops:["10","4","24"],a:0,code:true},
 {q:"¿Qué estructura repite instrucciones?",ops:["Un ciclo (bucle)","Un condicional","Una variable"],a:0},
 {q:"¿Qué estructura decide entre dos caminos?",ops:["Condicional (si/sino)","Ciclo","Comentario"],a:0},
 {q:"En muchos lenguajes \"5\" + \"5\" da…",ops:["\"55\" (textos pegados)","10","Error siempre"],a:0},
 {q:"x = 1\nx = x * 3\nx = x * 3\nimprimir(x)",ops:["9","6","3"],a:0,code:true},
 {q:"Un algoritmo es…",ops:["Pasos ordenados para resolver algo","Un tipo de computador","Un error"],a:0}];
const B_MUSICA=[
 {q:"Notas musicales naturales:",ops:["7","5","12"],a:0},
 {q:"Orden correcto:",ops:["Do Re Mi Fa Sol La Si","Do Mi Re Fa Sol Si La","La Si Do Mi Re Fa Sol"],a:0},
 {q:"En 4/4, ¿tiempos por compás?",ops:["4","3","8"],a:0},
 {q:"Si la negra vale 1 tiempo, la blanca vale…",ops:["2 tiempos","1 tiempo","4 tiempos"],a:0},
 {q:"El pentagrama tiene…",ops:["5 líneas","4 líneas","6 líneas"],a:0},
 {q:"Clave más usada para melodías agudas:",ops:["Clave de Sol","Clave de Fa","Clave de Do"],a:0},
 {q:"Más rápido = mayor…",ops:["Tempo","Volumen","Altura"],a:0},
 {q:"El volumen en música es la…",ops:["Dinámica","Ritmo","Melodía"],a:0},
 {q:"Notas que suenan juntas y bien =",ops:["Acorde","Escala","Silencio"],a:0},
 {q:"BPM significa…",ops:["Pulsos por minuto","Bajos por melodía","Bandas por música"],a:0},
 {q:"¿Instrumento de cuerda?",ops:["Guitarra 🎸","Trompeta 🎺","Tambor 🥁"],a:0},
 {q:"¿Instrumento de percusión?",ops:["Batería 🥁","Violín 🎻","Flauta"],a:0}];
const B_GRAMMAR=[
 {q:"Choose the correct sentence:",ops:["She doesn't like coffee.","She don't likes coffee.","She doesn't likes coffee."],a:0},
 {q:"Past simple of GO:",ops:["went","goed","gone"],a:0},
 {q:"\"I ____ to music every day.\"",ops:["listen","listening","listens"],a:0},
 {q:"\"They ____ watching a movie right now.\"",ops:["are","is","be"],a:0},
 {q:"\"Borrow\" means…",ops:["Pedir prestado","Prestar","Comprar"],a:0},
 {q:"Comparative of GOOD:",ops:["better","gooder","more good"],a:0},
 {q:"\"I have lived here ____ 2020.\"",ops:["since","for","from"],a:0},
 {q:"\"If it rains, we ____ stay home.\"",ops:["will","would","did"],a:0},
 {q:"\"However\" means…",ops:["Sin embargo","Por lo tanto","Además"],a:0},
 {q:"Correct question:",ops:["Where does she live?","Where she lives?","Where does she lives?"],a:0},
 {q:"Past simple of BUY:",ops:["bought","buyed","buying"],a:0},
 {q:"\"There isn't ____ milk left.\"",ops:["any","some","no"],a:0}];
const FLASHCARDS=[["overwhelmed","abrumada"],["achieve","lograr"],["although","aunque"],["improve","mejorar"],["develop","desarrollar"],["behavior","comportamiento"],["knowledge","conocimiento"],["research","investigación"],["available","disponible"],["actually","en realidad"],["awesome","increíble"],["catchy","pegajosa (canción)"],["rehearsal","ensayo"],["audience","público"],["beat","ritmo/pulso"],["release","lanzar (una canción)"],["skills","habilidades"],["spread","difundir"],["succeed","tener éxito"],["fail","fracasar"],["raise","levantar/recaudar"],["share","compartir"],["avoid","evitar"],["trust","confiar"]];
const B_LECTURAS=[
 {title:"The Concert",level:"A2",words:{"crowd":"multitud","stage":"escenario","lights":"luces","singer":"cantante","suddenly":"de repente","voice":"voz","whole":"entero/a","goosebumps":"piel de gallina","encore":"otra (bis)","unforgettable":"inolvidable"},
  text:"The crowd waited in the dark. Then the lights turned on and the singer walked to the stage. Suddenly, her voice filled the whole place. María felt goosebumps. At the end, everyone shouted for an encore. It was an unforgettable night.",
  qs:[{q:"What did the crowd shout for?",ops:["An encore","More lights","A break"],a:0},{q:"How did María feel?",ops:["She got goosebumps","Bored","Sleepy"],a:0}]},
 {title:"The Playlist",level:"A2",words:{"playlist":"lista de canciones","mood":"estado de ánimo","upbeat":"animada","lyrics":"letra","share":"compartir","headphones":"audífonos","skip":"saltar","favorite":"favorita"},
  text:"Sofía makes a playlist for every mood. When she is happy, she chooses upbeat songs. When she is sad, she listens to slow songs with deep lyrics. She likes to share her playlists with friends, but she never lets anyone skip her favorite song.",
  qs:[{q:"What does Sofía do when she is happy?",ops:["Chooses upbeat songs","Listens to slow songs","Turns off the music"],a:0},{q:"What does she never allow?",ops:["Skipping her favorite song","Sharing playlists","Using headphones"],a:0}]},
 {title:"The Old Guitar",level:"B1",words:{"attic":"desván","dusty":"polvorienta","strings":"cuerdas","grandfather":"abuelo","tune":"afinar","memories":"recuerdos","lessons":"clases","promise":"promesa"},
  text:"In the attic, Camila found a dusty guitar with broken strings. Her grandfather smiled and said it was his first guitar. He taught her how to tune it, and with every note, he shared old memories. Camila made a promise: she would take lessons and play his favorite song for his birthday.",
  qs:[{q:"Where did Camila find the guitar?",ops:["In the attic","At school","In a store"],a:0},{q:"What promise did she make?",ops:["To play his favorite song","To sell the guitar","To buy strings"],a:0}]},
 {title:"The Science Fair",level:"B1",words:{"experiment":"experimento","mixture":"mezcla","carefully":"cuidadosamente","results":"resultados","judges":"jueces","nervous":"nerviosa","prize":"premio","proud":"orgullosa"},
  text:"Valentina prepared her experiment for weeks. She mixed the mixture carefully and wrote down the results every day. On the day of the fair, she was nervous, but she explained everything to the judges with confidence. She did not win the first prize, but her teacher said she should feel proud.",
  qs:[{q:"How long did Valentina prepare?",ops:["For weeks","One day","A year"],a:0},{q:"Did she win first prize?",ops:["No, but she felt proud","Yes","She didn't go"],a:0}]}];
const B_COMPRENSION=[
 {t:"Los arrecifes de coral cubren menos del 1% del océano, pero albergan cerca del 25% de las especies marinas. El aumento de la temperatura del agua provoca el 'blanqueamiento': el coral expulsa las algas que le dan color y alimento, y puede morir si el estrés se prolonga.",
  qs:[{q:"¿Qué porcentaje de especies marinas viven en arrecifes?",ops:["Cerca del 25%","Menos del 1%","El 50%"],a:0},{q:"¿Qué causa el blanqueamiento?",ops:["El aumento de temperatura","El exceso de algas","La falta de peces"],a:0}]},
 {t:"La música activa más áreas del cerebro que casi cualquier otra actividad: regiones del movimiento, la memoria, el lenguaje y las emociones trabajan a la vez. Por eso, algunas personas con pérdida de memoria pueden recordar canciones completas de su juventud, aunque olviden hechos recientes.",
  qs:[{q:"La música activa…",ops:["Muchas áreas del cerebro a la vez","Solo el lenguaje","Solo emociones"],a:0},{q:"¿Qué recuerdan algunas personas con pérdida de memoria?",ops:["Canciones de su juventud","Hechos recientes","Teléfonos"],a:0}]},
 {t:"En 1977 las sondas Voyager partieron con un 'disco de oro' con saludos en 55 idiomas, sonidos de la Tierra y 90 minutos de música, desde Bach hasta Chuck Berry. La Voyager 1 es hoy el objeto humano más lejano: viaja por el espacio interestelar a más de 24.000 millones de kilómetros.",
  qs:[{q:"¿Qué contiene el disco de oro?",ops:["Saludos, sonidos y música","Mapas","Fotos de astronautas"],a:0},{q:"¿Qué es la Voyager 1 hoy?",ops:["El objeto humano más lejano","Un satélite lunar","Una estación"],a:0}]},
 {t:"El colibrí es el único pájaro que puede volar hacia atrás. Sus alas baten hasta 80 veces por segundo y su corazón supera los 1.200 latidos por minuto. Necesita visitar cientos de flores al día; por eso es un polinizador clave en América.",
  qs:[{q:"¿Qué hace el colibrí que ningún otro pájaro?",ops:["Volar hacia atrás","Nadar","Dormir volando"],a:0},{q:"¿Por qué es clave en los ecosistemas?",ops:["Poliniza cientos de flores","Come insectos","Hace nidos grandes"],a:0}]},
 {t:"El ajedrez llegó a Europa hace más de mil años desde Persia e India. La 'reina' era originalmente un 'visir' que solo se movía una casilla. Se volvió la pieza más poderosa en Europa en el siglo XV, y aceleró tanto el juego que algunos lo llamaron 'el ajedrez de la dama enloquecida'.",
  qs:[{q:"¿Qué pieza era un visir?",ops:["La reina","El alfil","La torre"],a:0},{q:"¿Cuándo se volvió la más poderosa?",ops:["Siglo XV","Hace mil años","Hoy"],a:0}]}];
