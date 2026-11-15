"use strict";
/* ============ ENGLISH APP (perfil adolescente) ============
   Pedido: «que en inglés sea como EWA». Se toma el FORMATO de las apps modernas de inglés (cursos, biblioteca con
   toca-y-traduce, palabras con repaso espaciado y juegos) con CONTENIDO 100 % propio: los libros son relatos originales
   escritos para la app (nada de películas, libros ni marcas con derechos).
   · 📘 Aprender: meta del día + accesos a lo que ya existía (Academy, niveles, grammar, oído).
   · 📚 Biblioteca: 6 libros por nivel (A1→B1). Se toca CUALQUIER palabra → traducción, audio y «➕ a mis palabras»;
     audio por párrafo, traducción del párrafo y preguntas al final.
   · 🧠 Palabras: repaso espaciado (cajas 0→5: hoy, 1, 3, 7, 14 y 30 días). Según la caja: tarjeta, elegir o ESCRIBIR.
   · 🎮 Juegos: duelo de palabras contra un bot, memoria de parejas y ordenar la frase.
   Estado: prof().enh = {words:{w:{es,box,due,src}}, books:{id:{page,done}}}. Prefijo enh / ENH. */

const ENH_BOOKS=[
 {id:"b1",lv:"A1",ic:"🎒",title:"The Lost Backpack",es:"La mochila perdida",paras:[
  ["Mia is a new student. Today is her first day at school. She has a red backpack. In the backpack she has books, a pen and her lunch.","Mia es una estudiante nueva. Hoy es su primer día en el colegio. Tiene una mochila roja. En la mochila tiene libros, un lapicero y su almuerzo."],
  ["At lunch time, Mia looks for her backpack. It is not on the chair. It is not under the table. Mia is sad and hungry.","A la hora del almuerzo, Mia busca su mochila. No está en la silla. No está debajo de la mesa. Mia está triste y con hambre."],
  ["A boy sees Mia. His name is Leo. He says: Do not worry. I can help you. They look in the classroom and in the garden.","Un niño ve a Mia. Se llama Leo. Él dice: No te preocupes. Yo puedo ayudarte. Buscan en el salón y en el jardín."],
  ["Then they see a small dog. The dog has the red backpack! The dog likes the smell of the lunch. Mia and Leo laugh.","Entonces ven un perro pequeño. ¡El perro tiene la mochila roja! Al perro le gusta el olor del almuerzo. Mia y Leo se ríen."],
  ["Mia gives the dog a little bread. Now Mia has her backpack and a new friend. It is a good first day.","Mia le da al perro un poco de pan. Ahora Mia tiene su mochila y un nuevo amigo. Es un buen primer día."]],
  quiz:[{q:"What color is Mia's backpack?",ops:["Red","Blue","Green","Yellow"],a:0},{q:"Who helps Mia?",ops:["Leo","The teacher","Her mother","Nobody"],a:0},{q:"Who has the backpack?",ops:["A small dog","A cat","Leo","A bird"],a:0}]},
 {id:"b2",lv:"A1",ic:"🏖️",title:"A Day at the Beach",es:"Un día en la playa",paras:[
  ["It is Sunday. The sun is big and yellow. Tom and his family go to the beach. They take water, fruit and a big ball.","Es domingo. El sol es grande y amarillo. Tom y su familia van a la playa. Llevan agua, fruta y una pelota grande."],
  ["Tom runs to the sea. The water is cold! His sister Ana makes a castle with sand. Their father sleeps under a tree.","Tom corre al mar. ¡El agua está fría! Su hermana Ana hace un castillo de arena. Su padre duerme debajo de un árbol."],
  ["Tom finds a small crab near a rock. The crab walks very fast. Tom does not touch it. He only looks at it and smiles.","Tom encuentra un cangrejo pequeño cerca de una roca. El cangrejo camina muy rápido. Tom no lo toca. Solo lo mira y sonríe."],
  ["In the afternoon they eat fruit and play with the ball. The wind takes the ball to the water. Father swims and brings it back.","Por la tarde comen fruta y juegan con la pelota. El viento se lleva la pelota al agua. Papá nada y la trae de vuelta."],
  ["At night the family is tired but happy. Tom looks at the stars from the car. He wants to come back next Sunday.","Por la noche la familia está cansada pero feliz. Tom mira las estrellas desde el carro. Quiere volver el próximo domingo."]],
  quiz:[{q:"Where does the family go?",ops:["To the beach","To the school","To the city","To the mountain"],a:0},{q:"What does Tom find near a rock?",ops:["A crab","A ball","A fish","A dog"],a:0},{q:"Who brings the ball back?",ops:["Father","Ana","Tom","The wind"],a:0}]},
 {id:"b3",lv:"A2",ic:"🤖",title:"The Robot Who Wanted to Sing",es:"El robot que quería cantar",paras:[
  ["Bolt was a small robot who worked in a library. Every day he carried books and cleaned the tables. He was fast and never made mistakes.","Bolt era un robot pequeño que trabajaba en una biblioteca. Cada día cargaba libros y limpiaba las mesas. Era rápido y nunca cometía errores."],
  ["One evening Bolt heard a girl singing outside the window. Her voice was soft and beautiful. Bolt stopped working. He wanted to sing too.","Una tarde Bolt oyó a una niña cantando afuera de la ventana. Su voz era suave y hermosa. Bolt dejó de trabajar. Él también quería cantar."],
  ["He tried to sing, but his voice sounded like an old door. The people in the library laughed. Bolt felt sad and hid behind the books.","Intentó cantar, pero su voz sonaba como una puerta vieja. La gente de la biblioteca se rió. Bolt se sintió triste y se escondió detrás de los libros."],
  ["The girl came in and said: Everyone can learn. Let us practice together. Every evening they practiced one short song, again and again.","La niña entró y dijo: Todos pueden aprender. Practiquemos juntos. Cada tarde practicaban una canción corta, una y otra vez."],
  ["A month later, Bolt sang at the library party. His voice was not perfect, but it was his own. Everyone clapped, and Bolt smiled for the first time.","Un mes después, Bolt cantó en la fiesta de la biblioteca. Su voz no era perfecta, pero era la suya. Todos aplaudieron, y Bolt sonrió por primera vez."]],
  quiz:[{q:"Where did Bolt work?",ops:["In a library","In a school","In a shop","In a hospital"],a:0},{q:"What did Bolt want to do?",ops:["Sing","Dance","Read","Sleep"],a:0},{q:"How did Bolt learn?",ops:["He practiced every evening","He bought a new voice","He watched a video","He never learned"],a:0}]},
 {id:"b4",lv:"A2",ic:"🐈",title:"The Mystery of the Missing Cat",es:"El misterio del gato perdido",paras:[
  ["Mrs. Green's cat, Pepper, disappeared on Monday morning. Sara, who lived next door, loved mysteries. She took her notebook and decided to find him.","El gato de la señora Green, Pepper, desapareció el lunes por la mañana. Sara, que vivía al lado, amaba los misterios. Tomó su cuaderno y decidió encontrarlo."],
  ["First she asked the neighbors. The baker said he saw a black cat near the river. The bus driver said the cat was sleeping at the station.","Primero les preguntó a los vecinos. El panadero dijo que vio un gato negro cerca del río. El conductor del bus dijo que el gato estaba durmiendo en la estación."],
  ["Sara followed small footprints in the mud. They went through the park, across the bridge and stopped at an old blue house.","Sara siguió unas huellas pequeñas en el barro. Pasaban por el parque, cruzaban el puente y se detenían en una vieja casa azul."],
  ["She looked through the window. Pepper was there, sitting next to an old man who was reading aloud. The man lived alone, and the cat visited him every day.","Miró por la ventana. Pepper estaba ahí, sentado junto a un anciano que leía en voz alta. El hombre vivía solo, y el gato lo visitaba todos los días."],
  ["Sara told Mrs. Green the truth. Now the two neighbors drink tea together every afternoon, and Pepper has two homes instead of one.","Sara le contó la verdad a la señora Green. Ahora los dos vecinos toman té juntos cada tarde, y Pepper tiene dos hogares en vez de uno."]],
  quiz:[{q:"Who decided to find the cat?",ops:["Sara","The baker","Mrs. Green","The bus driver"],a:0},{q:"What did Sara follow?",ops:["Small footprints","A bus","A river","A letter"],a:0},{q:"Where was Pepper?",ops:["With an old man","At the station","In the river","At school"],a:0}]},
 {id:"b5",lv:"B1",ic:"🌉",title:"The Girl Who Fixed the Bridge",es:"La chica que arregló el puente",paras:[
  ["The village of Santa Clara was divided by a wide river. The only bridge had been broken by a storm, and children had to walk two hours to reach the school.","El pueblo de Santa Clara estaba dividido por un río ancho. El único puente había sido roto por una tormenta, y los niños tenían que caminar dos horas para llegar al colegio."],
  ["Elena was fourteen and loved building things. While others complained, she measured the river, drew plans in her notebook and studied how bridges are built.","Elena tenía catorce años y le encantaba construir cosas. Mientras otros se quejaban, ella midió el río, dibujó planos en su cuaderno y estudió cómo se construyen los puentes."],
  ["At first nobody believed her. You are too young, they said. But Elena kept working. She collected wood and rope and asked her grandfather, a retired carpenter, for advice.","Al principio nadie le creyó. Eres demasiado joven, decían. Pero Elena siguió trabajando. Reunió madera y cuerda y le pidió consejo a su abuelo, un carpintero jubilado."],
  ["Little by little, the neighbors joined her. Some brought tools, others brought food. After three months of hard work, a new wooden bridge crossed the river.","Poco a poco, los vecinos se unieron a ella. Unos trajeron herramientas, otros trajeron comida. Después de tres meses de trabajo duro, un nuevo puente de madera cruzaba el río."],
  ["On the first day, Elena walked across it with the youngest children. She had learned that a good idea needs patience, and that big changes begin with one person.","El primer día, Elena lo cruzó caminando con los niños más pequeños. Había aprendido que una buena idea necesita paciencia, y que los grandes cambios empiezan con una persona."]],
  quiz:[{q:"Why was the bridge broken?",ops:["Because of a storm","Because it was old","Because of a fire","Nobody knows"],a:0},{q:"Who gave Elena advice?",ops:["Her grandfather","Her teacher","The mayor","Her sister"],a:0},{q:"What did Elena learn?",ops:["A good idea needs patience","Bridges are easy to build","Young people cannot help","Storms are fun"],a:0}]},
 {id:"b6",lv:"B1",ic:"✉️",title:"Letters from the Mountain",es:"Cartas desde la montaña",paras:[
  ["When Daniel moved to the city, his grandmother stayed in her small house on the mountain. She had no phone, so they promised to write letters every month.","Cuando Daniel se mudó a la ciudad, su abuela se quedó en su pequeña casa en la montaña. No tenía teléfono, así que prometieron escribirse cartas cada mes."],
  ["In her letters she described the weather, the garden and the birds that returned each spring. Daniel answered with stories about traffic, tall buildings and his new school.","En sus cartas ella describía el clima, el jardín y los pájaros que regresaban cada primavera. Daniel respondía con historias sobre el tráfico, los edificios altos y su nuevo colegio."],
  ["One winter, no letter arrived. Daniel was worried. He imagined terrible things, although his mother told him that the snow had probably closed the road.","Un invierno, no llegó ninguna carta. Daniel estaba preocupado. Imaginó cosas terribles, aunque su madre le dijo que la nieve probablemente había cerrado el camino."],
  ["As soon as the road opened, Daniel traveled to the mountain. His grandmother was fine. She had written five letters and kept them in a box, waiting for the postman.","Apenas se abrió el camino, Daniel viajó a la montaña. Su abuela estaba bien. Había escrito cinco cartas y las guardaba en una caja, esperando al cartero."],
  ["They read the letters together by the fire. Daniel realized that some messages arrive late, but they are still full of love.","Leyeron las cartas juntos junto al fuego. Daniel se dio cuenta de que algunos mensajes llegan tarde, pero siguen llenos de amor."]],
  quiz:[{q:"Why did they write letters?",ops:["She had no phone","They liked stamps","The phone was expensive","Daniel lost his phone"],a:0},{q:"Why did no letter arrive one winter?",ops:["The snow closed the road","She forgot","Daniel moved again","The postman was sick"],a:0},{q:"What did Daniel realize?",ops:["Late messages are still full of love","Letters are boring","The city is better","He should not write"],a:0}]}];

const ENH_SETS=[
 {id:"s1",ic:"🏫",nm:"School",words:[["homework","tarea"],["classroom","salón de clase"],["teacher","profesor"],["notebook","cuaderno"],["subject","materia"],["grade","nota"],["break","recreo"],["schedule","horario"],["to learn","aprender"],["to explain","explicar"],["question","pregunta"],["answer","respuesta"]]},
 {id:"s2",ic:"😊",nm:"Feelings",words:[["happy","feliz"],["sad","triste"],["angry","enojado"],["tired","cansado"],["worried","preocupado"],["proud","orgulloso"],["afraid","asustado"],["excited","emocionado"],["bored","aburrido"],["calm","tranquilo"],["shy","tímido"],["surprised","sorprendido"]]},
 {id:"s3",ic:"✈️",nm:"Travel",words:[["ticket","tiquete"],["airport","aeropuerto"],["luggage","equipaje"],["passport","pasaporte"],["map","mapa"],["journey","viaje"],["station","estación"],["to arrive","llegar"],["to leave","salir"],["far","lejos"],["near","cerca"],["bridge","puente"]]},
 {id:"s4",ic:"🍽️",nm:"Food",words:[["breakfast","desayuno"],["lunch","almuerzo"],["dinner","cena"],["bread","pan"],["cheese","queso"],["chicken","pollo"],["rice","arroz"],["vegetables","verduras"],["sweet","dulce"],["salty","salado"],["hungry","con hambre"],["thirsty","con sed"]]},
 {id:"s5",ic:"💻",nm:"Technology",words:[["screen","pantalla"],["keyboard","teclado"],["password","contraseña"],["to download","descargar"],["to upload","subir (archivos)"],["link","enlace"],["file","archivo"],["battery","batería"],["charger","cargador"],["to search","buscar"],["message","mensaje"],["to share","compartir"]]},
 {id:"s6",ic:"⚡",nm:"Action verbs",words:[["to build","construir"],["to bring","traer"],["to follow","seguir"],["to decide","decidir"],["to believe","creer"],["to promise","prometer"],["to realize","darse cuenta"],["to improve","mejorar"],["to achieve","lograr"],["to try","intentar"],["to keep","guardar / seguir"],["to reach","alcanzar / llegar"]]},
 {id:"s7",ic:"🔗",nm:"Connectors",words:[["although","aunque"],["however","sin embargo"],["because","porque"],["while","mientras"],["instead of","en vez de"],["as soon as","tan pronto como"],["at first","al principio"],["then","entonces"],["later","después"],["still","todavía"],["too","también / demasiado"],["so","así que"]]}];

const ENH_IRR={was:"be",were:"be",is:"be",are:"be",am:"be",been:"be",has:"have",had:"have",does:"do",did:"do",done:"do",went:"go",gone:"go",goes:"go",saw:"see",seen:"see",said:"say",says:"say",came:"come",took:"take",taken:"take",made:"make",gave:"give",given:"give",told:"tell",felt:"feel",heard:"hear",hid:"hide",hidden:"hide",sang:"sing",sung:"sing",kept:"keep",brought:"bring",drew:"draw",drawn:"draw",built:"build",began:"begin",begun:"begin",read:"read",wrote:"write",written:"write",ran:"run",ate:"eat",eaten:"eat",slept:"sleep",found:"find",broke:"break",broken:"break",learned:"learn",learnt:"learn",children:"child",people:"person",men:"man",women:"woman",his:"his",her:"her",their:"their",youngest:"young",better:"good",best:"good",worse:"bad",them:"them",him:"him",us:"us",me:"me"};
const ENH_DICT={a:"un / una",an:"un / una",the:"el / la / los / las",and:"y",but:"pero",or:"o",so:"así que",because:"porque",although:"aunque",while:"mientras",that:"que / ese",who:"quien / que",how:"cómo",when:"cuando",then:"entonces",now:"ahora",too:"también / demasiado",very:"muy",not:"no",no:"no / ningún",only:"solo",still:"todavía",never:"nunca",again:"otra vez",later:"después",first:"primero",next:"próximo / siguiente",every:"cada",each:"cada",some:"algunos",one:"uno / una",two:"dos",three:"tres",five:"cinco",fourteen:"catorce",all:"todo",other:"otro",everyone:"todos",nobody:"nadie",
 i:"yo",you:"tú / usted",he:"él",she:"ella",it:"eso / lo",they:"ellos",we:"nosotros",him:"lo / a él",her:"su / la (de ella)",his:"su (de él)",their:"su (de ellos)",them:"los / a ellos",us:"nosotros / nos",me:"me / a mí",own:"propio",
 be:"ser / estar",have:"tener / haber",do:"hacer",can:"poder",let:"dejar / permitir",go:"ir",come:"venir",see:"ver",look:"mirar",say:"decir",tell:"contar / decir",ask:"preguntar / pedir",answer:"responder",want:"querer",like:"gustar / como",love:"amar / amor",need:"necesitar",help:"ayudar",give:"dar",take:"tomar / llevar",bring:"traer",make:"hacer",find:"encontrar",keep:"guardar / seguir",try:"intentar",learn:"aprender",practice:"practicar",work:"trabajar / trabajo",study:"estudiar",read:"leer",write:"escribir",draw:"dibujar",build:"construir",measure:"medir",collect:"reunir / recoger",carry:"cargar",clean:"limpiar",sing:"cantar",laugh:"reír",smile:"sonreír",clap:"aplaudir",walk:"caminar",run:"correr",swim:"nadar",play:"jugar",eat:"comer",drink:"beber / tomar",sleep:"dormir",sit:"sentarse",stop:"detener / parar",hide:"esconder",touch:"tocar",worry:"preocuparse",feel:"sentir",hear:"oír",sound:"sonar / sonido",live:"vivir",visit:"visitar",follow:"seguir",decide:"decidir",disappear:"desaparecer",believe:"creer",complain:"quejarse",join:"unirse",cross:"cruzar",reach:"llegar a / alcanzar",begin:"empezar",move:"mudarse / mover",stay:"quedarse",promise:"prometer",describe:"describir",return:"regresar",arrive:"llegar",imagine:"imaginar",close:"cerrar",open:"abrir",travel:"viajar",wait:"esperar",realize:"darse cuenta",divide:"dividir",break:"romper",fix:"arreglar",
 student:"estudiante",day:"día",school:"colegio",backpack:"mochila",book:"libro",pen:"lapicero",lunch:"almuerzo",time:"tiempo / hora",chair:"silla",table:"mesa",boy:"niño",girl:"niña / chica",name:"nombre",classroom:"salón de clase",garden:"jardín",dog:"perro",smell:"olor",bread:"pan",friend:"amigo",sun:"sol",family:"familia",beach:"playa",water:"agua",fruit:"fruta",ball:"pelota",sea:"mar",sister:"hermana",castle:"castillo",sand:"arena",father:"padre",tree:"árbol",crab:"cangrejo",rock:"roca",afternoon:"tarde",wind:"viento",night:"noche",star:"estrella",car:"carro",robot:"robot",library:"biblioteca",mistake:"error",evening:"tarde / anochecer",window:"ventana",voice:"voz",door:"puerta",person:"persona",song:"canción",month:"mes",party:"fiesta",cat:"gato",morning:"mañana",mystery:"misterio",notebook:"cuaderno",neighbor:"vecino",baker:"panadero",river:"río",bus:"bus",driver:"conductor",station:"estación",footprint:"huella",mud:"barro",park:"parque",bridge:"puente",house:"casa",man:"hombre",truth:"verdad",tea:"té",home:"hogar",village:"pueblo",storm:"tormenta",child:"niño",hour:"hora",thing:"cosa",plan:"plano / plan",wood:"madera",rope:"cuerda",grandfather:"abuelo",carpenter:"carpintero",advice:"consejo",tool:"herramienta",food:"comida",idea:"idea",patience:"paciencia",change:"cambio",city:"ciudad",grandmother:"abuela",mountain:"montaña",phone:"teléfono",letter:"carta",weather:"clima",bird:"pájaro",spring:"primavera",story:"historia",traffic:"tráfico",building:"edificio",winter:"invierno",mother:"madre",snow:"nieve",road:"camino / carretera",box:"caja",postman:"cartero",fire:"fuego",message:"mensaje",mrs:"señora",sunday:"domingo",monday:"lunes",today:"hoy",
 new:"nuevo",red:"rojo",sad:"triste",hungry:"con hambre",small:"pequeño",little:"pequeño / poco",good:"bueno",big:"grande",yellow:"amarillo",cold:"frío",fast:"rápido",tired:"cansado",happy:"feliz",soft:"suave",beautiful:"hermoso",old:"viejo",short:"corto",perfect:"perfecto",black:"negro",blue:"azul",alone:"solo",wide:"ancho",young:"joven",retired:"jubilado",hard:"duro / difícil",wooden:"de madera",tall:"alto",worried:"preocupado",terrible:"terrible",fine:"bien",late:"tarde",full:"lleno",missing:"perdido / que falta",lost:"perdido",
 at:"en / a",in:"en",on:"en / sobre",under:"debajo de",for:"para / por",to:"a / para",of:"de",with:"con",from:"desde / de",near:"cerca de",back:"de vuelta / atrás",outside:"afuera",behind:"detrás de",together:"juntos",through:"a través de",across:"al otro lado de",there:"ahí",aloud:"en voz alta",instead:"en vez",by:"por / junto a",after:"después de",about:"sobre / acerca de",as:"como / tan",soon:"pronto",probably:"probablemente",up:"arriba",out:"afuera",into:"dentro de",than:"que",'next door':"al lado",'at first':"al principio",'little by little':"poco a poco"};

/* ---------- estado y utilidades ---------- */
function enhSt(){const p=prof();if(!p.enh)p.enh={words:{},books:{}};if(!p.enh.words)p.enh.words={};if(!p.enh.books)p.enh.books={};return p.enh;}
const ENH_DAYS=[0,1,3,7,14,30];
function enhNow(){return Date.now();}
function enhDue(){const w=enhSt().words,n=enhNow();return Object.keys(w).filter(function(k){return w[k].box<5&&(w[k].due||0)<=n;});}
function enhAdd(word,es,src){const st=enhSt(),k=String(word).toLowerCase().trim();if(!k||st.words[k])return false;st.words[k]={es:es,box:0,due:0,src:src||""};save();return true;}
function enhGrade(k,ok){const w=enhSt().words[k];if(!w)return;
 if(ok){w.box=Math.min(5,w.box+1);w.due=enhNow()+ENH_DAYS[w.box]*86400000;}else{w.box=Math.max(0,w.box-1);w.due=enhNow()+10*60000;}save();}
/* busca una palabra (con formas: plural, pasado, -ing…) */
function enhLookup(raw){
 const w=String(raw).toLowerCase().replace(/[^a-z']/g,"").replace(/'s$/,"");if(!w)return null;
 const D=ENH_DICT;if(D[w])return{base:w,es:D[w],note:""};
 if(ENH_IRR[w]&&D[ENH_IRR[w]])return{base:ENH_IRR[w],es:D[ENH_IRR[w]],note:"forma de «"+ENH_IRR[w]+"»"};
 const tries=[];
 if(/ies$/.test(w))tries.push([w.slice(0,-3)+"y","plural / él-ella"]);
 if(/es$/.test(w))tries.push([w.slice(0,-2),"plural / él-ella"]);
 if(/s$/.test(w))tries.push([w.slice(0,-1),"plural / él-ella"]);
 if(/ied$/.test(w))tries.push([w.slice(0,-3)+"y","pasado"]);
 if(/ed$/.test(w)){tries.push([w.slice(0,-2),"pasado"]);tries.push([w.slice(0,-1),"pasado"]);if(w.length>4&&w[w.length-3]===w[w.length-4])tries.push([w.slice(0,-3),"pasado"]);}
 if(/ing$/.test(w)){tries.push([w.slice(0,-3),"-ando / -iendo"]);tries.push([w.slice(0,-3)+"e","-ando / -iendo"]);if(w.length>5&&w[w.length-4]===w[w.length-5])tries.push([w.slice(0,-4),"-ando / -iendo"]);}
 if(/est$/.test(w))tries.push([w.slice(0,-3),"el más…"]);
 if(/er$/.test(w))tries.push([w.slice(0,-2),"más…"]);
 if(/ly$/.test(w))tries.push([w.slice(0,-2),"-mente"]);
 for(let i=0;i<tries.length;i++)if(D[tries[i][0]])return{base:tries[i][0],es:D[tries[i][0]],note:tries[i][1]+" de «"+tries[i][0]+"»"};
 return null;}
function enhTabs(act){
 const T=[["learn","📘","Aprender"],["books","📚","Biblioteca"],["words","🧠","Palabras"],["games","🎮","Juegos"]];
 return '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">'+T.map(function(t){const on=t[0]===act;return '<button onclick="screenEnglishApp(\''+t[0]+'\')" style="padding:8px 2px;border-radius:14px;border:2px solid '+(on?"var(--teen-cyan)":"#322B52")+';background:'+(on?"rgba(34,211,238,.14)":"transparent")+';color:inherit;font-weight:700;font-size:.78rem;cursor:pointer"><span style="font-size:1.3rem">'+t[1]+'</span><br>'+t[2]+'</button>';}).join("")+'</div>';}
function enhPool(){ /* todas las parejas conocidas: mis palabras + sets */
 const out=[],seen={},w=enhSt().words;
 Object.keys(w).forEach(function(k){if(!seen[k]){seen[k]=1;out.push([k,w[k].es]);}});
 ENH_SETS.forEach(function(s){s.words.forEach(function(x){if(!seen[x[0]]){seen[x[0]]=1;out.push(x);}});});
 return out;}

/* ---------- pantalla principal (4 pestañas) ---------- */
function screenEnglishApp(tab){setTheme("teen");
 tab=tab||"learn";const st=enhSt(),W=st.words,keys=Object.keys(W),due=enhDue().length,known=keys.filter(function(k){return W[k].box>=5;}).length;
 let body="";
 if(tab==="learn"){
  const booksDone=ENH_BOOKS.filter(function(b){return st.books[b.id]&&st.books[b.id].done;}).length;
  const tile=function(onclick,ic,tt,ts){return '<button class="ttile" onclick="'+onclick+'"><span class="ti">'+ic+'</span><span class="tt">'+tt+'</span><span class="ts">'+ts+'</span></button>';};
  body='<div class="card" style="border-color:var(--teen-cyan)"><b>🎯 Tu plan de hoy</b><div class="mut" style="margin:6px 0 10px;line-height:1.6">🧠 Palabras por repasar: <b>'+due+'</b> · 📚 Libros terminados: <b>'+booksDone+'/'+ENH_BOOKS.length+'</b> · ⭐ Palabras dominadas: <b>'+known+'</b></div>'
   +(due?'<button class="tbtn acc" style="text-align:center;margin:0 0 8px" onclick="enhStudy()">🧠 Repasar '+Math.min(due,10)+' palabras</button>':(keys.length?'<p class="mut" style="margin-bottom:8px">✅ No tienes repasos pendientes. ¡Lee un libro y agrega palabras nuevas!</p>':'<p class="mut" style="margin-bottom:8px">Empieza leyendo un libro: toca las palabras que no conozcas y guárdalas.</p>'))
   +'<button class="tbtn" style="text-align:center;margin:0" onclick="screenEnglishApp(\'books\')">📚 Seguir leyendo</button></div>'
   +'<p class="tsection">Cursos y práctica</p><div class="tgrid">'
   +tile("screenAcademyTeen()","🎓","English Academy","unidades")+tile("screenLevelsEN()","📈","Niveles A1→B2","exámenes")
   +tile("startQuiz('Grammar',B_GRAMMAR)","✍️","Grammar","reto")+tile("startComprension()","🧠","Comprensión","lectura")
   +tile("startEar()","🎹","Tu oído","escucha")+tile("screenReadList()","📖","Lecturas cortas","toca y traduce")+'</div>';}
 else if(tab==="books"){
  body='<p class="mut" style="margin-bottom:10px">Toca <b>cualquier palabra</b> para ver su significado, escucharla y guardarla en tus palabras.</p>'
   +ENH_BOOKS.map(function(b){const s=st.books[b.id]||{page:0},pct=s.done?100:Math.round((s.page||0)/b.paras.length*100);
    return '<button class="tbtn" style="display:flex;align-items:center;gap:12px" onclick="enhRead(\''+b.id+'\')"><span style="font-size:2rem">'+b.ic+'</span><span style="flex:1"><b>'+b.title+'</b><br><span class="mut" style="font-size:.82rem">'+b.es+' · nivel '+b.lv+'</span><span style="display:block;height:6px;border-radius:4px;background:#322B52;margin-top:6px;overflow:hidden"><span style="display:block;height:100%;width:'+pct+'%;background:var(--teen-cyan)"></span></span></span><span>'+(s.done?"✅":"›")+'</span></button>';}).join("");}
 else if(tab==="words"){
  const learning=keys.length-known;
  body='<div class="card"><div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center;gap:6px"><div><b style="font-size:1.5rem;color:var(--teen-cyan)">'+due+'</b><br><span class="mut" style="font-size:.78rem">por repasar</span></div><div><b style="font-size:1.5rem">'+learning+'</b><br><span class="mut" style="font-size:.78rem">aprendiendo</span></div><div><b style="font-size:1.5rem;color:#86EFAC">'+known+'</b><br><span class="mut" style="font-size:.78rem">dominadas</span></div></div>'
   +(due?'<button class="tbtn acc" style="text-align:center;margin:10px 0 0" onclick="enhStudy()">🧠 Repasar ahora</button>':'')+'</div>'
   +'<p class="tsection">Sets de palabras</p>'
   +ENH_SETS.map(function(s){const have=s.words.filter(function(x){return W[x[0]];}).length;
    return '<button class="tbtn" style="display:flex;align-items:center;gap:10px" onclick="enhSet(\''+s.id+'\')"><span style="font-size:1.6rem">'+s.ic+'</span><span style="flex:1"><b>'+s.nm+'</b><br><span class="mut" style="font-size:.8rem">'+have+'/'+s.words.length+' en mis palabras</span></span><span>›</span></button>';}).join("")
   +(keys.length?'<p class="tsection">Mis palabras ('+keys.length+')</p><div class="card" style="line-height:1.9">'+keys.sort().map(function(k){return '<div style="display:flex;gap:8px;align-items:center"><span style="flex:1"><b>'+esc(k)+'</b> <span class="mut">= '+esc(W[k].es)+'</span></span><span class="mut" style="font-size:.75rem">'+("●".repeat(W[k].box)+"○".repeat(5-W[k].box))+'</span><button onclick="enhDel('+jsStr(k).replace(/"/g,"&quot;")+')" style="background:none;border:0;cursor:pointer;color:#FCA5A5" aria-label="Quitar">✕</button></div>';}).join("")+'</div>':'');}
 else{
  body='<button class="tbtn acc" style="display:flex;align-items:center;gap:12px" onclick="enhDuel()"><span style="font-size:2rem">⚔️</span><span style="flex:1"><b>Duelo de palabras</b><br><span class="mut" style="font-size:.82rem">60 segundos contra un bot</span></span></button>'
   +'<button class="tbtn" style="display:flex;align-items:center;gap:12px" onclick="enhMemo()"><span style="font-size:2rem">🃏</span><span style="flex:1"><b>Parejas</b><br><span class="mut" style="font-size:.82rem">Une la palabra con su significado</span></span></button>'
   +'<button class="tbtn" style="display:flex;align-items:center;gap:12px" onclick="enhOrder()"><span style="font-size:2rem">🧩</span><span style="flex:1"><b>Ordena la frase</b><br><span class="mut" style="font-size:.82rem">Arma oraciones de los libros</span></span></button>'
   +(typeof screenSalas==="function"?'<button class="tbtn" style="display:flex;align-items:center;gap:12px" onclick="screenSalas()"><span style="font-size:2rem">🌐</span><span style="flex:1"><b>Salas en línea</b><br><span class="mut" style="font-size:.82rem">Reta a tu familia desde otro dispositivo</span></span></button>':'');}
 render(topbar("screenTeenHome()")+'<h2 style="margin-bottom:10px">🇬🇧 English</h2>'+enhTabs(tab)+body);}
function enhDel(k){delete enhSt().words[k];save();screenEnglishApp("words");}
function enhSet(id){setTheme("teen");
 const s=ENH_SETS.find(function(x){return x.id===id;});if(!s)return;const W=enhSt().words;
 render(topbar("screenEnglishApp('words')")+'<h2 style="margin-bottom:10px">'+s.ic+' '+s.nm+'</h2>'
  +'<button class="tbtn acc" style="text-align:center" onclick="enhSetAdd(\''+id+'\')">➕ Agregar todas a mis palabras</button>'
  +'<div class="card" style="line-height:2">'+s.words.map(function(x){return '<div style="display:flex;gap:8px;align-items:center"><button onclick="speakEN('+jsStr(x[0].replace(/^to /,"")).replace(/"/g,"&quot;")+')" style="background:none;border:0;cursor:pointer;font-size:1.1rem">🔊</button><span style="flex:1"><b>'+esc(x[0])+'</b> <span class="mut">= '+esc(x[1])+'</span></span><span>'+(W[x[0]]?"✅":"")+'</span></div>';}).join("")+'</div>');}
function enhSetAdd(id){const s=ENH_SETS.find(function(x){return x.id===id;});let n=0;s.words.forEach(function(x){if(enhAdd(x[0],x[1],"set"))n++;});toast(n?"➕ "+n+" palabras agregadas":"Ya las tenías todas",true,1500);enhSet(id);}

/* ---------- lector: toca cualquier palabra ---------- */
let ENR={};
function enhRead(id,page){setTheme("teen");
 const b=ENH_BOOKS.find(function(x){return x.id===id;});if(!b)return;
 const st=enhSt();if(!st.books[id])st.books[id]={page:0,done:false};
 const pg=page!=null?page:Math.min(st.books[id].page||0,b.paras.length-1);
 ENR={id:id,page:pg,tr:false};st.books[id].page=Math.max(st.books[id].page||0,pg);save();
 const en=b.paras[pg][0];
 const html=en.split(/(\s+)/).map(function(tok){if(!/[A-Za-z]/.test(tok))return esc(tok);return '<span class="word" onclick="enhWord(this)">'+esc(tok)+'</span>';}).join("");
 render(topbar("screenEnglishApp('books')")
  +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>'+b.ic+' '+b.title+'</b><span class="mut">'+(pg+1)+'/'+b.paras.length+'</span></div>'
  +'<div class="card" style="line-height:2.15;font-size:1.14rem">'+html+'</div>'
  +'<div id="enhTr"></div><div id="enhWord"></div>'
  +'<div style="display:flex;gap:8px"><button class="tbtn" style="flex:1;margin:0;text-align:center" onclick="speakEN('+jsStr(en).replace(/"/g,"&quot;")+')">🔊 Escuchar</button><button class="tbtn" style="flex:1;margin:0;text-align:center" onclick="enhToggleTr()">🇪🇸 Traducción</button></div>'
  +'<div style="display:flex;gap:8px;margin-top:8px">'+(pg>0?'<button class="tbtn" style="flex:1;margin:0;text-align:center" onclick="enhRead(\''+id+'\','+(pg-1)+')">← Anterior</button>':'')
  +'<button class="tbtn acc" style="flex:2;margin:0;text-align:center" onclick="'+(pg+1<b.paras.length?"enhRead('"+id+"',"+(pg+1)+")":"enhBookQuiz('"+id+"')")+'">'+(pg+1<b.paras.length?"Siguiente →":"Preguntas del libro →")+'</button></div>');}
function enhToggleTr(){const b=ENH_BOOKS.find(function(x){return x.id===ENR.id;}),el=document.getElementById("enhTr");if(!el)return;ENR.tr=!ENR.tr;
 el.innerHTML=ENR.tr?'<div class="card" style="line-height:1.7;border-color:#322B52"><span class="mut">🇪🇸 '+esc(b.paras[ENR.page][1])+'</span></div>':"";}
function enhWord(el){
 document.querySelectorAll(".word.tapped").forEach(function(x){x.classList.remove("tapped");});el.classList.add("tapped");
 const raw=el.textContent,r=enhLookup(raw),box=document.getElementById("enhWord");if(!box)return;
 const clean=raw.toLowerCase().replace(/[^a-z']/g,"");try{beep([880],.05);}catch(e){}
 if(!r){box.innerHTML='<div class="card" style="border-color:var(--teen-cyan)"><b style="color:var(--teen-cyan);font-size:1.2rem">'+esc(clean)+'</b><div class="mut" style="margin-top:4px">Es un nombre propio o no está en el diccionario. Mira la traducción del párrafo 🇪🇸</div></div>';return;}
 const has=!!enhSt().words[r.base];
 box.innerHTML='<div class="card" style="border-color:var(--teen-cyan)"><div style="display:flex;align-items:center;gap:10px"><button onclick="speakEN('+jsStr(clean).replace(/"/g,"&quot;")+')" style="background:none;border:0;cursor:pointer;font-size:1.4rem">🔊</button><div style="flex:1"><b style="color:var(--teen-cyan);font-size:1.2rem">'+esc(clean)+'</b> &nbsp;=&nbsp; <span style="font-size:1.1rem">'+esc(r.es)+'</span>'+(r.note?'<br><span class="mut" style="font-size:.8rem">'+esc(r.note)+'</span>':'')+'</div></div>'
  +'<button class="tbtn'+(has?"":" acc")+'" id="enhAddBtn" style="text-align:center;margin:10px 0 0" '+(has?"disabled":'onclick="enhAddFromBook('+jsStr(r.base).replace(/"/g,"&quot;")+','+jsStr(r.es).replace(/"/g,"&quot;")+')"')+'>'+(has?"✅ Ya está en mis palabras":"➕ Agregar a mis palabras")+'</button></div>';
 speakEN(clean);}
function enhAddFromBook(w,es){if(enhAdd(w,es,ENR.id)){sOK();toast("➕ «"+w+"» guardada",true,1100);}const b=document.getElementById("enhAddBtn");if(b){b.disabled=true;b.classList.remove("acc");b.textContent="✅ Ya está en mis palabras";}}
function enhBookQuiz(id){
 const b=ENH_BOOKS.find(function(x){return x.id===id;});ENR={id:id,qi:0,ok:0};enhBookQ();}
function enhBookQ(){setTheme("teen");
 const b=ENH_BOOKS.find(function(x){return x.id===ENR.id;}),q=b.quiz[ENR.qi];
 if(!q){const st=enhSt();if(!st.books[b.id])st.books[b.id]={page:0,done:false};const first=!st.books[b.id].done;st.books[b.id].done=true;st.books[b.id].page=b.paras.length;const p=prof();if(first){p.coins+=15;p.xp+=30;}save();sWIN();confetti(24);
  return render(topbar("screenEnglishApp('books')")+'<div class="card endcard"><div class="big">📚</div><h2>'+ENR.ok+' / '+b.quiz.length+'</h2><p class="mut" style="margin-bottom:12px">¡Terminaste «'+b.title+'»!'+(first?" +15 🪙":"")+'</p><button class="tbtn acc" style="text-align:center" onclick="screenEnglishApp(\'books\')">Más libros 📚</button><button class="tbtn" style="text-align:center" onclick="screenEnglishApp(\'words\')">Repasar mis palabras 🧠</button></div>');}
 ENR.order=shuffled(q.ops.map(function(o,i){return{o:o,i:i};}));
 render(topbar("screenEnglishApp('books')")+'<b>'+b.ic+' '+b.title+' · '+(ENR.qi+1)+'/'+b.quiz.length+'</b><div class="bigq">'+esc(q.q)+'</div>'
  +ENR.order.map(function(it,k){return '<button class="tbtn opt" onclick="enhBookA('+k+')">'+esc(it.o)+'</button>';}).join(""));}
function enhBookA(k){const b=ENH_BOOKS.find(function(x){return x.id===ENR.id;}),q=b.quiz[ENR.qi],ok=ENR.order[k].i===q.a;
 recordAnswer("Inglés",ok,10);document.querySelectorAll(".opt").forEach(function(x){x.disabled=true;});
 if(ok){ENR.ok++;sOK();toast("✓ Correct!",true,800);}else{sNO();toast("It was: "+q.ops[q.a],false,1700);}
 ENR.qi++;setTimeout(enhBookQ,ok?850:1750);}

/* ---------- repaso espaciado ---------- */
let ENS={};
function enhStudy(){setTheme("teen");
 const due=shuffled(enhDue()).slice(0,10);
 if(!due.length){toast("No hay palabras por repasar 🎉",true,1500);return screenEnglishApp("words");}
 ENS={q:due,i:0,ok:0};enhStudyNext();}
function enhStudyNext(){
 if(ENS.i>=ENS.q.length){const p=prof();p.coins+=ENS.ok;p.xp+=ENS.ok*3;save();sWIN();if(ENS.ok>=ENS.q.length*.7)confetti(20);
  return render(topbar("screenEnglishApp('words')")+'<div class="card endcard"><div class="big">🧠</div><h2>'+ENS.ok+' de '+ENS.q.length+'</h2><p class="mut" style="margin-bottom:12px">Las que fallaste vuelven pronto; las que sabes, cada vez más espaciadas.</p>'+(enhDue().length?'<button class="tbtn acc" style="text-align:center" onclick="enhStudy()">Seguir repasando 🔁</button>':'')+'<button class="tbtn" style="text-align:center" onclick="screenEnglishApp(\'words\')">Volver</button></div>');}
 const k=ENS.q[ENS.i],w=enhSt().words[k];if(!w){ENS.i++;return enhStudyNext();}
 ENS.k=k;ENS.done=false;
 const head=topbar("screenEnglishApp('words')")+'<p class="mut center" style="margin-bottom:8px">Repaso '+(ENS.i+1)+' de '+ENS.q.length+' · caja '+w.box+'/5</p>';
 if(w.box<=1){ /* tarjeta */
  render(head+'<div class="flash" id="fc" onclick="document.getElementById(\'fc\').classList.toggle(\'flip\')"><div class="in"><div class="f">'+esc(k)+'<span class="hint">🇬🇧 toca para ver el significado</span></div><div class="b">'+esc(w.es)+'<span class="hint">🇪🇸 español</span></div></div></div>'
   +'<button class="tbtn" style="text-align:center" onclick="speakEN('+jsStr(k.replace(/^to /,"")).replace(/"/g,"&quot;")+')">🔊 Escuchar</button>'
   +'<div style="display:flex;gap:12px"><button class="tbtn" style="flex:1;text-align:center;border-color:#DC2626;color:#FCA5A5" onclick="enhStudyAns(false)">😅 No la sabía</button><button class="tbtn" style="flex:1;text-align:center;border-color:#16A34A;color:#86EFAC" onclick="enhStudyAns(true)">😎 ¡La sabía!</button></div>');
  speakEN(k.replace(/^to /,""));}
 else if(w.box<=3){ /* elegir */
  const others=shuffled(enhPool().filter(function(x){return x[0]!==k&&x[1]!==w.es;})).slice(0,3).map(function(x){return x[1];});
  ENS.ops=shuffled([w.es].concat(others));
  render(head+'<div class="bigq">'+esc(k)+'</div>'+ENS.ops.map(function(o,i){return '<button class="tbtn opt" onclick="enhStudyAns(ENS.ops['+i+']===enhSt().words[ENS.k].es)">'+esc(o)+'</button>';}).join(""));
  speakEN(k.replace(/^to /,""));}
 else{ /* escribir */
  render(head+'<p class="mut center">Escribe en inglés:</p><div class="bigq">'+esc(w.es)+'</div>'
   +'<input id="enhIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="en inglés…" style="width:100%;padding:14px;border-radius:14px;border:2px solid #322B52;background:#141127;color:inherit;font-size:1.2rem;box-sizing:border-box;margin-bottom:8px" onkeydown="if(event.key===\'Enter\')enhStudyType()">'
   +'<button class="tbtn acc" style="text-align:center" onclick="enhStudyType()">Comprobar ✓</button>');
  const el=document.getElementById("enhIn");if(el)el.focus();}}
function enhStudyType(){const el=document.getElementById("enhIn");if(!el||ENS.done)return;const norm=function(s){return String(s).toLowerCase().replace(/^to /,"").replace(/[^a-z]/g,"");};enhStudyAns(norm(el.value)===norm(ENS.k));}
function enhStudyAns(ok){
 if(ENS.done)return;ENS.done=true;const k=ENS.k,w=enhSt().words[k];
 recordAnswer("Vocabulario",ok,8);enhGrade(k,ok);
 if(ok){ENS.ok++;sOK();toast("✓ "+k+" = "+w.es,true,1000);}else{sNO();toast(k+" = "+w.es,false,2000);}
 ENS.i++;setTimeout(enhStudyNext,ok?950:1950);}

/* ---------- juegos ---------- */
let ENG={};
function enhGameCleanup(){if(ENG.tick){clearInterval(ENG.tick);ENG.tick=null;}}
function enhDuel(){setTheme("teen");enhGameCleanup();
 ENG={me:0,bot:0,left:60,pool:shuffled(enhPool()),i:0,botPace:4.2+Math.random()*1.6,botAcc:0};enhDuelQ();
 ENG.tick=setInterval(function(){ENG.left-=.25;ENG.botAcc+=.25;if(ENG.botAcc>=ENG.botPace){ENG.botAcc=0;if(Math.random()<.8)ENG.bot++;}
  const t=document.getElementById("enhT"),b=document.getElementById("enhBot");if(t)t.style.width=Math.max(0,ENG.left/60*100)+"%";if(b)b.textContent=ENG.bot;
  if(ENG.left<=0){enhGameCleanup();enhDuelEnd();}},250);}
function enhDuelQ(){
 const pool=ENG.pool,x=pool[ENG.i%pool.length];ENG.i++;ENG.cur=x;
 const others=shuffled(pool.filter(function(y){return y[1]!==x[1];})).slice(0,3).map(function(y){return y[1];});
 ENG.ops=shuffled([x[1]].concat(others));
 render(topbar("screenEnglishApp('games')")
  +'<div style="display:flex;justify-content:space-between;align-items:center;font-weight:800"><span>🧑 Tú: <span style="color:var(--teen-cyan)">'+ENG.me+'</span></span><span>⚔️</span><span>🤖 Bot: <span id="enhBot">'+ENG.bot+'</span></span></div>'
  +'<div class="timerbar"><div id="enhT" style="width:'+Math.max(0,ENG.left/60*100)+'%"></div></div>'
  +'<div class="bigq">'+esc(x[0])+'</div>'+ENG.ops.map(function(o,i){return '<button class="tbtn opt" onclick="enhDuelA('+i+')">'+esc(o)+'</button>';}).join(""));}
function enhDuelA(i){if(ENG.left<=0)return;const ok=ENG.ops[i]===ENG.cur[1];recordAnswer("Vocabulario",ok,4);if(ok){ENG.me++;sOK();}else{sNO();toast(ENG.cur[0]+" = "+ENG.cur[1],false,900);}enhDuelQ();}
function enhDuelEnd(){const win=ENG.me>ENG.bot,p=prof();p.coins+=win?12:4;p.xp+=ENG.me*2;save();if(win){sWIN();confetti(26);}
 render(topbar("screenEnglishApp('games')")+'<div class="card endcard"><div class="big">'+(win?"🏆":ENG.me===ENG.bot?"🤝":"💪")+'</div><h2>'+ENG.me+' — '+ENG.bot+'</h2><p class="mut" style="margin-bottom:12px">'+(win?"¡Le ganaste al bot!":ENG.me===ENG.bot?"¡Empate!":"El bot ganó esta vez. ¡Revancha!")+'</p><button class="tbtn acc" style="text-align:center" onclick="enhDuel()">🔁 Otra vez</button><button class="tbtn" style="text-align:center" onclick="screenEnglishApp(\'games\')">Volver</button></div>');}
function enhMemo(){setTheme("teen");enhGameCleanup();
 const pairs=shuffled(enhPool()).slice(0,6),cards=[];pairs.forEach(function(p,i){cards.push({t:p[0],k:i,en:true});cards.push({t:p[1],k:i});});
 ENG={cards:shuffled(cards),open:[],found:{},moves:0,lock:false};enhMemoDraw();}
function enhMemoDraw(){
 render(topbar("screenEnglishApp('games')")+'<div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>🃏 Parejas</b><span class="mut">Movimientos: '+ENG.moves+'</span></div>'
  +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+ENG.cards.map(function(c,i){const up=ENG.found[c.k]||ENG.open.indexOf(i)>=0;
   return '<button onclick="enhMemoTap('+i+')" style="min-height:74px;border-radius:14px;border:2px solid '+(ENG.found[c.k]?"#16A34A":up?"var(--teen-cyan)":"#322B52")+';background:'+(up?"rgba(34,211,238,.12)":"#141127")+';color:inherit;font-weight:700;font-size:.92rem;cursor:pointer;padding:6px;word-break:break-word">'+(up?esc(c.t):"❓")+'</button>';}).join("")+'</div>');}
function enhMemoTap(i){
 if(ENG.lock||ENG.open.indexOf(i)>=0||ENG.found[ENG.cards[i].k])return;
 ENG.open.push(i);if(ENG.cards[i].en)speakEN(ENG.cards[i].t.replace(/^to /,""));
 if(ENG.open.length===2){ENG.moves++;const a=ENG.cards[ENG.open[0]],b=ENG.cards[ENG.open[1]];
  if(a.k===b.k){ENG.found[a.k]=1;ENG.open=[];sOK();recordAnswer("Vocabulario",true,5);
   if(Object.keys(ENG.found).length===6){const p=prof();p.coins+=8;p.xp+=15;save();sWIN();confetti(22);
    return render(topbar("screenEnglishApp('games')")+'<div class="card endcard"><div class="big">🃏</div><h2>¡Completado en '+ENG.moves+' movimientos!</h2><button class="tbtn acc" style="text-align:center" onclick="enhMemo()">🔁 Otra vez</button><button class="tbtn" style="text-align:center" onclick="screenEnglishApp(\'games\')">Volver</button></div>');}}
  else{ENG.lock=true;enhMemoDraw();setTimeout(function(){ENG.open=[];ENG.lock=false;if(ENG.cards)enhMemoDraw();},900);return;}}
 enhMemoDraw();}
function enhOrder(){setTheme("teen");enhGameCleanup();
 const sents=[];ENH_BOOKS.forEach(function(b){b.paras.forEach(function(p){p[0].split(/(?<=[.!?])\s+/).forEach(function(s){const n=s.split(" ").length;if(n>=4&&n<=9&&!/[:,]/.test(s))sents.push(s);});});});
 ENG={list:shuffled(sents).slice(0,6),i:0,ok:0};enhOrderQ();}
function enhOrderQ(){
 if(ENG.i>=ENG.list.length){const p=prof();p.coins+=ENG.ok;p.xp+=ENG.ok*3;save();sWIN();if(ENG.ok>=4)confetti(20);
  return render(topbar("screenEnglishApp('games')")+'<div class="card endcard"><div class="big">🧩</div><h2>'+ENG.ok+' de '+ENG.list.length+'</h2><button class="tbtn acc" style="text-align:center" onclick="enhOrder()">🔁 Otra vez</button><button class="tbtn" style="text-align:center" onclick="screenEnglishApp(\'games\')">Volver</button></div>');}
 ENG.words=ENG.list[ENG.i].split(" ");ENG.bank=shuffled(ENG.words.map(function(w,i){return{w:w,i:i};}));ENG.pickd=[];enhOrderDraw();}
function enhOrderDraw(){
 render(topbar("screenEnglishApp('games')")+'<div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>🧩 Ordena la frase · '+(ENG.i+1)+'/'+ENG.list.length+'</b><span style="color:var(--teen-cyan);font-weight:800">'+ENG.ok+' ✓</span></div>'
  +'<div class="card" style="min-height:74px;line-height:2.3">'+(ENG.pickd.length?ENG.pickd.map(function(x,k){return '<button onclick="enhOrderUn('+k+')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid var(--teen-cyan);background:rgba(34,211,238,.12);color:inherit;font-weight:700;cursor:pointer">'+esc(x.w)+'</button>';}).join(""):'<span class="mut">Toca las palabras en orden…</span>')+'</div>'
  +'<div style="line-height:2.4;margin-bottom:10px">'+ENG.bank.map(function(x,k){const used=ENG.pickd.indexOf(x)>=0;return '<button '+(used?"disabled":"")+' onclick="enhOrderPick('+k+')" style="margin:3px;padding:6px 12px;border-radius:12px;border:2px solid #322B52;background:#141127;color:inherit;font-weight:700;cursor:pointer;opacity:'+(used?.25:1)+'">'+esc(x.w)+'</button>';}).join("")+'</div>'
  +'<button class="tbtn acc" style="text-align:center" onclick="enhOrderCheck()">Comprobar ✓</button>');}
function enhOrderPick(k){ENG.pickd.push(ENG.bank[k]);enhOrderDraw();}
function enhOrderUn(k){ENG.pickd.splice(k,1);enhOrderDraw();}
function enhOrderCheck(){if(ENG.pickd.length<ENG.words.length){toast("Faltan palabras",false,900);return;}
 const ok=ENG.pickd.map(function(x){return x.w;}).join(" ")===ENG.words.join(" ");recordAnswer("Inglés",ok,12);
 if(ok){ENG.ok++;sOK();speakEN(ENG.words.join(" "));toast("✓ Perfect!",true,1000);}else{sNO();toast(ENG.words.join(" "),false,2600);}
 ENG.i++;setTimeout(enhOrderQ,ok?1300:2700);}
