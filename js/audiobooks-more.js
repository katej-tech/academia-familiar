"use strict";
/* ============ MÁS AUDIOLIBROS (se suman a AB_BOOKS de audiobooks.js) ============
   2 libros más por nivel y por idioma = 12 libros originales. Formato compacto:
   pg: [emoji, [frases], traducción-al-español (solo inglés)]  ·  q: [pregunta, correcta, errónea, errónea]
   (la respuesta correcta va primero; el reproductor las mezcla). Datos de ciencia revisados:
   Marte es rojo por el óxido de hierro; el Monte Olimpo es el volcán más grande del sistema solar;
   Fobos y Deimos tienen forma de papa; en Marte se pesa menos (gravedad ≈ 38 % de la terrestre). */
(function(){
 const BG=["#FEF3C7","#E0E7FF","#DCFCE7","#FBCFE8","#BAE6FD","#FED7AA","#DDD6FE","#FEF08A"];
 const mk=function(id,lang,lv,ic,title,pg,q){
  return{id:id,lang:lang,lv:lv,ic:ic,title:title,
   pages:pg.map(function(p,i){return{e:p[0],bg:BG[i%BG.length],s:p[1],tr:p[2]||""};}),
   quiz:q.map(function(x){return{q:x[0],ops:[x[1],x[2],x[3]],a:0};})};};
 AB_BOOKS.push(
 /* ---------- ESPAÑOL · nivel 1 ---------- */
 mk("es4","es",1,"🐟","El pez que quería volar",[
  ["🐟",["Nilo era un pececito azul.","Vivía en un río tranquilo."]],
  ["🐦",["Un día vio un pájaro en el cielo.","—Yo también quiero volar —dijo Nilo."]],
  ["💦",["Nilo saltó muy alto sobre el agua.","Pero cayó otra vez: ¡plaf!"]],
  ["🐸",["La rana le dijo: —Los peces nadan.","—¿Y eso es bueno? —preguntó Nilo."]],
  ["🌊",["Nilo nadó rápido entre las piedras.","¡Nadie nadaba como él!"]],
  ["🌈",["Al saltar, vio un arcoíris sobre el río.","Nilo sonrió: ser pez era maravilloso."]]],
  [["¿Qué quería hacer Nilo?","Volar","Dormir","Correr"],["¿Quién le habló a Nilo?","Una rana","Un gato","Una abeja"],["¿Cómo se sintió al final?","Feliz de ser pez","Triste","Con miedo"]]),
 mk("es5","es",1,"🐌","Luna y el caracol",[
  ["🐌",["Luna es una niña curiosa.","Un día encontró un caracol."]],
  ["🌿",["El caracol caminaba muy despacio.","Luna caminó despacio también."]],
  ["🌧️",["Empezó a llover y el caracol salió feliz.","Luna abrió su paraguas rojo."]],
  ["🍃",["El caracol subió a una hoja grande.","Allí estaba seco y tranquilo."]],
  ["🤝",["Luna le dijo: —Seremos amigos.","El caracol movió sus cuernitos."]],
  ["🏡",["Luna volvió a casa contenta.","Mañana verá a su nuevo amigo."]]],
  [["¿Qué encontró Luna?","Un caracol","Una mariposa","Una piedra"],["¿Cómo caminaba el caracol?","Muy despacio","Muy rápido","Saltando"],["¿De qué color era el paraguas?","Rojo","Azul","Verde"]]),
 /* ---------- ESPAÑOL · nivel 2 ---------- */
 mk("es6","es",2,"🚀","El viaje de Astro a Marte",[
  ["🚀",["Astro era un astronauta pequeño con un gran sueño.","Quería conocer Marte, el planeta rojo.","Una mañana, su cohete estaba listo para despegar."]],
  ["🌌",["Tres, dos, uno… ¡despegue!","El cohete atravesó las nubes y llegó al espacio.","Astro miró la Tierra: parecía una canica azul."]],
  ["🔴",["Después de muchos meses, aterrizó en Marte.","El suelo era rojo porque tiene óxido de hierro.","Astro dio un paso y sintió que pesaba menos."]],
  ["🌋",["Vio el Monte Olimpo, el volcán más grande del sistema solar.","Era tan alto que su cima parecía tocar el cielo.","Astro tomó fotos para mostrárselas a todos."]],
  ["🌙",["De noche vio dos lunas pequeñas: Fobos y Deimos.","No eran redondas como la nuestra, sino como papas.","Astro se rió y las saludó con la mano."]],
  ["🏠",["Astro regresó a casa lleno de recuerdos.","Les contó a los niños todo lo que vio.","Y desde entonces, muchos soñaron con viajar al espacio."]]],
  [["¿Qué planeta visitó Astro?","Marte","Venus","Júpiter"],["¿Por qué el suelo de Marte es rojo?","Tiene óxido de hierro","Está pintado","Es de fuego"],["¿Cómo se llama el volcán más grande?","Monte Olimpo","Monte Fuji","El Everest"],["¿Cuántas lunas vio Astro?","Dos","Una","Cinco"]]),
 mk("es7","es",2,"🐉","El dragón con hipo",[
  ["🐉",["En una cueva vivía un dragón llamado Brasa.","Tenía las alas verdes y la cola muy larga.","Pero tenía un problema: ¡no paraba de tener hipo!"]],
  ["🔥",["Cada vez que decía «hip», le salían chispas de fuego.","Una vez quemó sin querer la cortina de su cueva.","Otra vez dejó negra la lana de una oveja."]],
  ["😢",["Brasa se puso muy triste y se escondió.","—Nadie querrá ser mi amigo —pensó.","Pero una niña llamada Rita lo escuchó llorar."]],
  ["💧",["Rita le ofreció un vaso de agua fresca.","—Bebe despacio y contén la respiración —le dijo.","Brasa lo hizo, y el hipo se fue poco a poco."]],
  ["🎉",["—¡Gracias! —rugió Brasa, y esta vez no salió fuego.","Rita se rió y le dio un abrazo.","Desde ese día fueron mejores amigos."]],
  ["🌟",["Ahora, cuando Brasa tiene hipo, Rita lo ayuda.","Juntos encienden las velas de los cumpleaños del pueblo.","Y todos aplauden al dragón más amable del valle."]]],
  [["¿Qué problema tenía Brasa?","Hipo","Frío","Sueño"],["¿Quién lo ayudó?","Rita","Una oveja","Un caballero"],["¿Cómo se le fue el hipo?","Con agua y respirando despacio","Con un grito","Con una canción"]]),
 /* ---------- ESPAÑOL · nivel 3 ---------- */
 mk("es8","es",3,"🏛️","El misterio del museo",[
  ["🏛️",["Un sábado por la mañana, Lucas y su hermana Paula visitaron el museo de la ciudad.","Les encantaban los dinosaurios, y allí había un esqueleto gigante en el salón principal.","Pero ese día, el guardia tenía una cara muy preocupada."]],
  ["🦴",["—Falta algo —dijo el guardia—. Alguien se llevó la garra del dinosaurio.","Los hermanos se miraron: eran grandes detectives en el colegio.","Sacaron su libreta y empezaron a buscar pistas."]],
  ["👣",["En el suelo encontraron unas huellas pequeñas de barro.","Las huellas iban hacia el jardín del museo.","—No son de un adulto —observó Paula—. Son de alguien muy pequeño."]],
  ["🐕",["Siguieron las huellas hasta un arbusto cerca de la fuente.","De pronto escucharon un ruido y apareció un cachorro con la garra en la boca.","El perrito movía la cola, creyendo que era un hueso para jugar."]],
  ["🍪",["Lucas se agachó y le ofreció una galleta a cambio.","El cachorro soltó la garra y la cambió por el premio.","Paula la limpió con su pañuelo y la llevó al guardia."]],
  ["🏆",["El guardia sonrió aliviado y les dio las gracias.","—Ustedes resolvieron el misterio mejor que nadie —dijo.","Pusieron la garra en su lugar, y el dinosaurio volvió a estar completo."]]],
  [["¿Qué faltaba en el museo?","La garra del dinosaurio","Un cuadro","Una estatua"],["¿Quién se la había llevado?","Un cachorro","Un ladrón","El guardia"],["¿Qué pistas siguieron los hermanos?","Huellas pequeñas de barro","Un mapa","Una carta"],["¿Cómo recuperaron la garra?","La cambiaron por una galleta","Con una red","Gritando"]]),
 mk("es9","es",3,"🌋","El pequeño volcán",[
  ["🌋",["En una isla lejana vivía un volcán pequeño llamado Chispa.","Los otros volcanes eran enormes y rugían con fuerza.","Chispa, en cambio, solo podía soltar un poco de humo."]],
  ["😞",["Los demás se burlaban: —¡Eres demasiado pequeño para ser un volcán!","Chispa bajó la mirada y se sintió muy triste.","Esa noche pensó que nunca serviría para nada."]],
  ["🌊",["De pronto, el mar se agitó y las olas crecieron mucho.","Los pescadores de la isla estaban perdidos entre la niebla oscura.","No podían ver la costa ni encontrar el camino a casa."]],
  ["🔥",["Chispa respiró hondo y juntó todas sus fuerzas.","Con un último esfuerzo, lanzó una luz roja hacia el cielo.","La luz atravesó la niebla como un faro en la noche."]],
  ["⛵",["Los pescadores vieron el resplandor y remaron hacia él.","Poco a poco, sus barcas llegaron sanas y salvas a la orilla.","Todos en la isla aplaudieron al pequeño volcán."]],
  ["🏝️",["Los volcanes grandes pidieron perdón por haberse burlado.","Chispa entendió que no importa el tamaño para ser valiente.","Desde entonces, cada noche brilla para guiar a los barcos."]]],
  [["¿Cómo se llamaba el volcán pequeño?","Chispa","Brasa","Olimpo"],["¿Por qué se burlaban de él?","Porque era pequeño","Porque era feo","Porque hablaba mucho"],["¿Cómo ayudó a los pescadores?","Con una luz roja","Con un grito","Con agua"],["¿Cuál es el mensaje del cuento?","No importa el tamaño para ser valiente","Hay que burlarse","Los barcos son grandes"]]),
 /* ---------- ENGLISH · level 1 ---------- */
 mk("en4","en",1,"🐟","The Little Fish",[
  ["🐟",["This is Finn.","Finn is a little fish."],"Este es Finn. Finn es un pececito."],
  ["🌊",["Finn lives in the sea.","The sea is big and blue."],"Finn vive en el mar. El mar es grande y azul."],
  ["🦀",["Finn sees a crab.","The crab says, “Hello!”"],"Finn ve un cangrejo. El cangrejo dice: «¡Hola!»."],
  ["🐙",["Then Finn sees an octopus.","The octopus has eight arms."],"Luego Finn ve un pulpo. El pulpo tiene ocho brazos."],
  ["🫧",["They all play together.","They make many bubbles."],"Todos juegan juntos. Hacen muchas burbujas."],
  ["🌙",["It is night now.","Good night, little fish!"],"Ya es de noche. ¡Buenas noches, pececito!"]],
  [["What is Finn?","A fish","A crab","A bird"],["How many arms does the octopus have?","Eight","Two","Four"],["Where does Finn live?","In the sea","In a tree","In a house"]]),
 mk("en5","en",1,"🐧","Pip the Penguin",[
  ["🐧",["Pip is a penguin.","Pip is black and white."],"Pip es un pingüino. Pip es blanco y negro."],
  ["❄️",["Pip lives in the snow.","The snow is cold."],"Pip vive en la nieve. La nieve es fría."],
  ["🍽️",["Pip is hungry.","He wants a fish."],"Pip tiene hambre. Quiere un pescado."],
  ["🏊",["Pip jumps in the water.","He swims fast!"],"Pip salta al agua. ¡Nada rápido!"],
  ["🐟",["Pip gets a big fish.","Yum, yum, yum!"],"Pip atrapa un pescado grande. ¡Ñam, ñam, ñam!"],
  ["😊",["Pip is happy now.","He goes home."],"Pip está feliz ahora. Se va a casa."]],
  [["What color is Pip?","Black and white","Red","Yellow"],["What does Pip want?","A fish","A ball","A hat"],["How does Pip swim?","Fast","Slowly","He cannot swim"]]),
 /* ---------- ENGLISH · level 2 ---------- */
 mk("en6","en",2,"🏖️","A Day at the Beach",[
  ["🏖️",["Today is Saturday, and the sun is shining.","Ana and her dad go to the beach.","She carries a red bucket and a small shovel."],"Hoy es sábado y brilla el sol. Ana y su papá van a la playa. Ella lleva un balde rojo y una palita."],
  ["🏰",["Ana builds a big sand castle near the water.","She makes four towers and a long wall.","Her dad helps her find shells for the windows."],"Ana construye un gran castillo de arena cerca del agua. Hace cuatro torres y un muro largo. Su papá la ayuda a buscar conchas para las ventanas."],
  ["🌊",["Suddenly, a wave comes and touches the castle.","One tower falls down into the water.","Ana laughs and says, “The sea likes my castle!”"],"De pronto, llega una ola y toca el castillo. Una torre cae al agua. Ana se ríe y dice: «¡Al mar le gusta mi castillo!»."],
  ["🦀",["A little crab walks across the sand.","It looks at the castle with its tiny eyes.","Ana gives the crab a shell as a gift."],"Un cangrejito camina por la arena. Mira el castillo con sus ojitos. Ana le regala una concha al cangrejo."],
  ["🍦",["After playing, they sit under an umbrella.","Dad buys two ice creams: chocolate for Ana and vanilla for him.","They eat them and watch the boats."],"Después de jugar, se sientan bajo una sombrilla. Papá compra dos helados: de chocolate para Ana y de vainilla para él. Se los comen y miran los barcos."],
  ["🌅",["The sun starts to go down, and the sky is orange.","Ana says goodbye to the sea.","“We will come back soon,” she promises."],"El sol empieza a bajar y el cielo está naranja. Ana se despide del mar. «Volveremos pronto», promete."]],
  [["What does Ana carry?","A red bucket","A blue ball","A kite"],["What happens to the castle?","A wave breaks one tower","It flies away","It turns red"],["What flavor is Ana's ice cream?","Chocolate","Vanilla","Strawberry"]]),
 mk("en7","en",2,"🤖","The Robot Who Wanted a Friend",[
  ["🤖",["Beep is a small robot who lives in a toy shop.","Every night, when the lights go out, he feels lonely.","He wants a friend to talk to."],"Beep es un robot pequeño que vive en una juguetería. Cada noche, cuando se apagan las luces, se siente solo. Quiere un amigo con quien hablar."],
  ["🧸",["Beep sees a teddy bear on the shelf.","“Hello! Can we be friends?” he asks.","But the teddy bear cannot answer because it is a toy."],"Beep ve un osito de peluche en el estante. «¡Hola! ¿Podemos ser amigos?», pregunta. Pero el osito no puede responder porque es un juguete."],
  ["🚪",["The next morning, a girl called Mia enters the shop.","She looks at all the toys with big eyes.","Then she stops in front of Beep."],"A la mañana siguiente, una niña llamada Mia entra a la tienda. Mira todos los juguetes con ojos grandes. Luego se detiene frente a Beep."],
  ["💬",["“What a cool robot!” says Mia.","Beep moves his arms and says, “Hello, friend!”","Mia jumps with joy because the robot can talk."],"«¡Qué robot tan genial!», dice Mia. Beep mueve los brazos y dice: «¡Hola, amiga!». Mia salta de alegría porque el robot habla."],
  ["🏠",["Mia asks her mom to buy Beep.","Her mom smiles and pays for the robot.","Beep goes home in Mia's red backpack."],"Mia le pide a su mamá que compre a Beep. Su mamá sonríe y paga el robot. Beep se va a casa en la mochila roja de Mia."],
  ["🌟",["Now Beep has a room, a bed and a best friend.","Every night, Mia tells him a story.","Beep is not lonely anymore."],"Ahora Beep tiene un cuarto, una cama y una mejor amiga. Cada noche, Mia le cuenta un cuento. Beep ya no está solo."]],
  [["Why is Beep sad?","He has no friend","He is broken","He is hungry"],["Who buys Beep?","Mia's mom","A boy","The teddy bear"],["Where does Beep go?","Home with Mia","To the park","To the beach"]]),
 /* ---------- ENGLISH · level 3 ---------- */
 mk("en8","en",3,"🍰","The Missing Cake",[
  ["🍰",["It is Saturday morning, and Grandma is baking a strawberry cake for the family party.","The kitchen smells delicious, and everyone is excited.","Grandma puts the cake on the table and goes to get the candles."],"Es sábado por la mañana y la abuela hornea un pastel de fresa para la fiesta familiar. La cocina huele delicioso y todos están emocionados. La abuela pone el pastel en la mesa y va por las velas."],
  ["😮",["When she comes back, the cake is not on the table!","Only a few small crumbs are left on the plate.","“Who took my cake?” Grandma asks, surprised."],"Cuando vuelve, ¡el pastel no está en la mesa! Solo quedan unas migajas en el plato. «¿Quién se llevó mi pastel?», pregunta la abuela, sorprendida."],
  ["🔍",["Lily and her cousin Ben decide to find the thief.","They look carefully at the floor and see tiny brown footprints.","The footprints go through the living room and out to the garden."],"Lily y su primo Ben deciden encontrar al ladrón. Miran con cuidado el suelo y ven huellitas marrones. Las huellas cruzan la sala y salen al jardín."],
  ["🐶",["In the garden, they find Coco, the family dog, under a tree.","Coco has pink cream on his nose and a happy face.","But he is too small to reach the table by himself."],"En el jardín encuentran a Coco, el perro de la familia, bajo un árbol. Coco tiene crema rosada en la nariz y cara feliz. Pero es muy pequeño para llegar solo a la mesa."],
  ["🪑",["Ben notices a chair near the table with a pillow on it.","“Coco climbed on the chair!” says Lily.","The cousins laugh because the little dog had a clever plan."],"Ben nota una silla junto a la mesa con un cojín encima. «¡Coco se subió a la silla!», dice Lily. Los primos se ríen porque el perrito tuvo un plan muy astuto."],
  ["🎂",["Grandma is not angry; she laughs too.","She bakes a second cake, and this time she keeps it safe in the fridge.","At the party, everyone eats cake, and Coco gets a dog biscuit."],"La abuela no se enoja; también se ríe. Hornea un segundo pastel y esta vez lo guarda en la nevera. En la fiesta todos comen pastel y Coco recibe una galleta para perros."]],
  [["Who took the cake?","Coco, the dog","Ben","Grandma"],["What did the cousins see on the floor?","Small brown footprints","A letter","Flowers"],["What does Grandma do at the end?","Bakes a second cake","Gets angry","Buys a pizza"]]),
 mk("en9","en",3,"🪐","Journey to Mars",[
  ["🚀",["Sam is ten years old and he dreams of becoming an astronaut.","One night, his grandfather gives him a toy rocket and says, “Dreams can travel far.”","Sam puts the rocket on his desk and looks at the stars."],"Sam tiene diez años y sueña con ser astronauta. Una noche, su abuelo le regala un cohete de juguete y dice: «Los sueños pueden viajar lejos». Sam pone el cohete en su escritorio y mira las estrellas."],
  ["🧑‍🚀",["Years later, Sam studies hard and becomes a real astronaut.","He joins a team that will travel to Mars.","The trip will take about seven months."],"Años después, Sam estudia mucho y se convierte en un verdadero astronauta. Se une a un equipo que viajará a Marte. El viaje durará unos siete meses."],
  ["🌌",["Inside the spaceship, everything floats: pencils, food and even the astronauts.","Sam drinks water from a special bag so it does not fly away.","Every day, he looks out of the window and sees millions of stars."],"Dentro de la nave, todo flota: lápices, comida y hasta los astronautas. Sam bebe agua de una bolsa especial para que no salga volando. Cada día mira por la ventana y ve millones de estrellas."],
  ["🔴",["At last, the spaceship lands on Mars.","The ground is red and dusty, and the sky looks orange.","Sam takes a small step and feels lighter than on Earth."],"Por fin, la nave aterriza en Marte. El suelo es rojo y polvoriento y el cielo se ve naranja. Sam da un pequeño paso y se siente más liviano que en la Tierra."],
  ["🌋",["The team explores rocks and collects samples.","In the distance, Sam sees a very big volcano called Olympus Mons.","It is the tallest volcano in the solar system."],"El equipo explora rocas y recoge muestras. A lo lejos, Sam ve un volcán enorme llamado Monte Olimpo. Es el volcán más alto del sistema solar."],
  ["🌍",["Before leaving, Sam leaves his toy rocket on a rock.","He looks at the small blue point in the sky: Earth.","“Thank you, Grandpa,” he whispers. “My dream came true.”"],"Antes de irse, Sam deja su cohete de juguete sobre una roca. Mira el pequeño punto azul en el cielo: la Tierra. «Gracias, abuelo», susurra. «Mi sueño se hizo realidad»."]],
  [["Who gives Sam the toy rocket?","His grandfather","His teacher","A friend"],["What color is the ground on Mars?","Red","Green","Blue"],["What is Olympus Mons?","The tallest volcano","A planet","A spaceship"]])
 );
})();
