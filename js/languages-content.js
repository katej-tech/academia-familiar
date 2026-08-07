"use strict";
/* ============ CONTENIDO CURADO DEL CURSO DE IDIOMAS (perfil adulto) ============ */
/* Banco fijo que funciona SIN clave de Gemini (igual que el resto de la app: IA si hay clave,
   banco local si no). El vocabulario de inglés se cruzó contra listas abiertas de nivel CEFR
   (openlanguageprofiles/olp-en-cefrj, MIT/CC) como referencia de curación, no como dependencia
   en vivo — nada se descarga de GitHub en tiempo de ejecución. Alemán/portugués/italiano son
   un punto de partida curado a mano; Gemini enriquece todo dinámicamente cuando hay clave. */

/* cada palabra/expresión: [frase en el idioma, español, ejemplo de uso, truco para memorizarla] */
const LANG_VOCAB_SEED={
 en:{
  saludos:[["Hello","Hola","Hello! How are you?","Suena parecido a 'jelou', muy fácil de recordar."],
   ["Good morning","Buenos días","Good morning, everyone!","'Morning' se parece a 'mañana' del inglés antiguo — piénsalo como 'buen momento'."],
   ["How are you?","¿Cómo estás?","How are you today?","'How' suena a 'jau', como si preguntaras '¿jau te va?'."],
   ["Nice to meet you","Mucho gusto","Nice to meet you, I'm Kate.","'Nice' = lindo/agradable, o sea 'agradable conocerte'."],
   ["See you later","Nos vemos luego","See you later, bye!","Literal: 've-te más tarde' — imagina despedirte con la mano."],
   ["Goodbye","Adiós","Goodbye, have a good day!","Viene de 'God be with you' — como decir 'que Dios te acompañe'."]],
  compras:[["How much is it?","¿Cuánto cuesta?","How much is this shirt?","'How much' = 'cuánto', pregunta directa de precio."],
   ["Receipt","Recibo","Can I have the receipt, please?","Suena a 'risít' — imagina que 're-citas' el precio pagado."],
   ["Cash","Efectivo","I'll pay in cash.","'Cash' suena a 'cache' de dinero guardado."],
   ["Credit card","Tarjeta de crédito","Do you accept credit card?","Casi igual que en español, fácil de reconocer."],
   ["Discount","Descuento","Is there a discount today?","Se parece a 'descuento' — 'dis' + 'cuenta'."],
   ["Shopping cart","Carrito de compras","I need a shopping cart.","'Shopping' = comprar, 'cart' = carreta."]],
  trabajo:[["Meeting","Reunión","We have a meeting at 3pm.","Suena a 'mitin' (como los mítines políticos = reuniones)."],
   ["Deadline","Fecha límite","The deadline is Friday.","'Dead' (muerto) + 'line' (línea) = la línea que no puedes cruzar."],
   ["Colleague","Colega","My colleague sent the email.","Casi igual a 'colega' en español."],
   ["Email","Correo electrónico","Check your email.","Palabra que ya usamos igual en español."],
   ["Schedule","Horario","What's your schedule today?","Suena a 'eskédiul' — imagina un horario 'es-que-di-lo'."],
   ["Boss","Jefe","My boss is very kind.","Corta y fácil, suena como 'bos'."]],
  comida:[["Water","Agua","Can I have some water?","Suena a 'wáter' — el mismo sonido que usamos para el baño en español (agua/water)."],
   ["Bread","Pan","I'd like some bread.","'Bred' suena parecido a 'breve', piensa en pan recién horneado."],
   ["The bill, please","La cuenta, por favor","Excuse me, the bill please.","'Bill' = cuenta, como la 'factura' en inglés."],
   ["Delicious","Delicioso","This soup is delicious!","Casi idéntica al español."],
   ["Allergic to","Alérgico a","I'm allergic to nuts.","'Allergic' se parece mucho a 'alérgico'."],
   ["Table for two","Mesa para dos","A table for two, please.","Literal: 'mesa para dos', fácil de armar."]],
  viajes:[["Airport","Aeropuerto","The airport is far.","'Air' (aire) + 'port' (puerto) = puerto del aire."],
   ["Ticket","Boleto","Where is my ticket?","Palabra que ya usamos igual en español."],
   ["Luggage","Equipaje","My luggage is heavy.","Suena a 'lógueich' — imagina que 'cargas' tu equipaje."],
   ["Passport","Pasaporte","I need my passport.","Casi idéntica al español."],
   ["Where is...?","¿Dónde está...?","Where is the hotel?","'Where' suena a 'uer', pregunta de lugar."],
   ["How much time?","¿Cuánto tiempo?","How much time until we arrive?","Combina 'how much' + 'time' (tiempo)."]],
  emergencias:[["Help!","¡Ayuda!","Help! Call someone!","Corta y directa, fácil de gritar si hace falta."],
   ["Call the police","Llama a la policía","Please, call the police.","'Police' se parece mucho a 'policía'."],
   ["I need a doctor","Necesito un médico","I need a doctor now.","'Doctor' es casi igual en los dos idiomas."],
   ["Fire!","¡Fuego!","Fire! Get out!","Corta, suena a 'fáiar' — piensa en 'fire' de disparar/encender."],
   ["I'm lost","Estoy perdido","Excuse me, I'm lost.","'Lost' suena a 'lost' de la serie — perdido en la isla."],
   ["Ambulance","Ambulancia","Call an ambulance!","Casi idéntica al español."]]
 },
 de:{
  saludos:[["Hallo","Hola","Hallo, wie geht's?","Suena casi como 'halo' en español, fácil de recordar."],
   ["Guten Morgen","Buenos días","Guten Morgen! Hast du gut geschlafen?","'Guten' = bueno, 'Morgen' = mañana, literal 'buena mañana'."],
   ["Wie geht's?","¿Cómo estás?","Hallo, wie geht's?","'Wie' = cómo (suena 'vi'), 'geht's' = va."],
   ["Freut mich","Mucho gusto","Freut mich, dich kennenzulernen.","'Freut' viene de alegrarse — 'me alegra' conocerte."],
   ["Bis später","Hasta luego","Bis später, tschüss!","'Bis' = hasta, 'später' = después/tarde (como 'tarde' en inglés 'later')."],
   ["Auf Wiedersehen","Adiós","Auf Wiedersehen, bis morgen!","Literal: 'hasta volver a ver' — un adiós formal."]],
  compras:[["Wie viel kostet das?","¿Cuánto cuesta?","Wie viel kostet das Brot?","'Kostet' se parece a 'costó' en español."],
   ["Quittung","Recibo","Kann ich die Quittung haben?","Suena a 'kvitung' — piensa en 'quitar' la cuenta pendiente."],
   ["Bargeld","Efectivo","Ich zahle mit Bargeld.","'Bar' (en efectivo) + 'Geld' (dinero) = dinero en mano."],
   ["Kreditkarte","Tarjeta de crédito","Akzeptieren Sie Kreditkarte?","Casi idéntica al español, fácil de reconocer."],
   ["Rabatt","Descuento","Gibt es einen Rabatt?","Corta y parecida a 'rebate' en inglés."],
   ["Einkaufswagen","Carrito de compras","Ich brauche einen Einkaufswagen.","'Einkauf' = compra, 'Wagen' = carro — 'carro de compra'."]],
  trabajo:[["Besprechung","Reunión","Wir haben eine Besprechung.","Larga pero suena a 'hablar sobre algo' (besprechen = discutir)."],
   ["Frist","Fecha límite","Die Frist ist Freitag.","Corta, suena a 'frist' de 'first' — el primer límite."],
   ["Kollege/Kollegin","Colega","Mein Kollege hat die E-Mail geschickt.","Casi idéntica a 'colega' en español."],
   ["E-Mail","Correo electrónico","Sende mir eine E-Mail.","Igual que en español."],
   ["Zeitplan","Horario","Wie ist dein Zeitplan?","'Zeit' = tiempo, 'Plan' = plan — 'plan de tiempo'."],
   ["Chef/Chefin","Jefe","Mein Chef ist nett.","Igual a la palabra francesa 'chef', fácil de recordar."]],
  comida:[["Wasser","Agua","Kann ich Wasser haben?","Suena a 'váser' — parecido a 'water' en inglés."],
   ["Brot","Pan","Ich möchte Brot.","Corta, suena a 'brot' como 'broa' de pan."],
   ["Die Rechnung, bitte","La cuenta, por favor","Die Rechnung, bitte!","'Rechnung' viene de 'rechnen' (calcular) — la cuenta calculada."],
   ["lecker","delicioso","Das schmeckt lecker!","Corta y pegajosa, fácil de repetir."],
   ["allergisch gegen","alérgico a","Ich bin allergisch gegen Nüsse.","'Allergisch' se parece mucho a 'alérgico'."],
   ["Tisch für zwei","Mesa para dos","Ein Tisch für zwei, bitte.","'Tisch' = mesa, 'zwei' = dos (suena 'tsvái')."]],
  viajes:[["Flughafen","Aeropuerto","Der Flughafen ist weit.","'Flug' (vuelo) + 'Hafen' (puerto) = puerto de vuelo."],
   ["Fahrkarte","Boleto","Wo ist meine Fahrkarte?","'Fahr' (viajar) + 'Karte' (tarjeta) = tarjeta de viaje."],
   ["Gepäck","Equipaje","Mein Gepäck ist schwer.","Corta, suena a 'guepék'."],
   ["Reisepass","Pasaporte","Ich brauche meinen Reisepass.","'Reise' (viaje) + 'Pass' (pase) = pase de viaje."],
   ["Wo ist...?","¿Dónde está...?","Wo ist das Hotel?","'Wo' suena a 'vo', pregunta corta de lugar."],
   ["Wie lange dauert es?","¿Cuánto tiempo dura?","Wie lange dauert der Flug?","'Dauert' viene de durar — 'cuánto dura'."]],
  emergencias:[["Hilfe!","¡Ayuda!","Hilfe! Bitte!","Corta, suena a 'jílfe' — fácil de gritar."],
   ["Rufen Sie die Polizei","Llame a la policía","Bitte, rufen Sie die Polizei!","'Polizei' es casi idéntica a 'policía'."],
   ["Ich brauche einen Arzt","Necesito un médico","Ich brauche sofort einen Arzt.","'Arzt' suena a 'arst' — corto y directo."],
   ["Feuer!","¡Fuego!","Feuer! Raus hier!","Suena a 'fóier' — parecido a 'fire' en inglés."],
   ["Ich habe mich verlaufen","Estoy perdido","Entschuldigung, ich habe mich verlaufen.","'Verlaufen' = perderse caminando (laufen = caminar)."],
   ["Krankenwagen","Ambulancia","Rufen Sie einen Krankenwagen!","'Kranken' (enfermo) + 'Wagen' (carro) = carro de enfermo."]]
 },
 pt:{
  saludos:[["Olá","Hola","Olá, tudo bem?","Casi idéntica al español, muy fácil."],
   ["Bom dia","Buenos días","Bom dia! Como você está?","'Bom' = bueno, 'dia' = día, igual que en español."],
   ["Como vai?","¿Cómo estás?","Oi, como vai?","Casi igual al español 'cómo va'."],
   ["Prazer em conhecê-lo","Mucho gusto","Prazer em conhecê-lo, sou a Kate.","'Prazer' = placer, 'conhecer' = conocer."],
   ["Até mais","Hasta luego","Até mais, tchau!","'Até' = hasta, casi igual al español."],
   ["Tchau","Adiós","Tchau, até amanhã!","Prestado del italiano 'ciao', se pronuncia igual."]],
  compras:[["Quanto custa?","¿Cuánto cuesta?","Quanto custa esta camisa?","Casi idéntica al español 'cuánto cuesta'."],
   ["Recibo","Recibo","Posso ter o recibo?","Idéntica al español."],
   ["Dinheiro","Efectivo/dinero","Vou pagar em dinheiro.","Se parece a 'dinero', solo cambia la terminación."],
   ["Cartão de crédito","Tarjeta de crédito","Vocês aceitam cartão de crédito?","'Cartão' = tarjeta (cartón), fácil de asociar."],
   ["Desconto","Descuento","Tem desconto hoje?","Casi idéntica al español."],
   ["Carrinho de compras","Carrito de compras","Preciso de um carrinho.","'Carrinho' = carrito, diminutivo fácil de reconocer."]],
  trabajo:[["Reunião","Reunión","Temos uma reunião às 15h.","Muy parecida al español, solo cambia la terminación."],
   ["Prazo","Fecha límite/plazo","O prazo é sexta-feira.","Idéntica a 'plazo' en español."],
   ["Colega","Colega","Meu colega enviou o e-mail.","Idéntica al español."],
   ["E-mail","Correo electrónico","Me manda um e-mail.","Igual que en español."],
   ["Agenda","Horario/agenda","Qual é a sua agenda hoje?","Idéntica al español."],
   ["Chefe","Jefe","Meu chefe é gentil.","Muy parecida a 'jefe', cambia la 'j' por 'ch'."]],
  comida:[["Água","Agua","Posso ter água?","Casi idéntica, solo el acento cambia."],
   ["Pão","Pan","Eu queria pão.","Sonido nasal 'ão' — imagina decir 'pan' tapándote la nariz."],
   ["A conta, por favor","La cuenta, por favor","A conta, por favor!","Casi idéntica al español."],
   ["delicioso","delicioso","Isso está delicioso!","Idéntica al español."],
   ["alérgico a","alérgico a","Sou alérgico a nozes.","Idéntica al español."],
   ["Mesa para dois","Mesa para dos","Uma mesa para dois, por favor.","Casi idéntica, 'dois' = dos."]],
  viajes:[["Aeroporto","Aeropuerto","O aeroporto é longe.","Casi idéntica al español."],
   ["Passagem","Boleto/pasaje","Onde está minha passagem?","Idéntica a 'pasaje' en español."],
   ["Bagagem","Equipaje","Minha bagagem é pesada.","Se parece a 'bagaje' en español."],
   ["Passaporte","Pasaporte","Preciso do meu passaporte.","Casi idéntica al español."],
   ["Onde fica...?","¿Dónde está...?","Onde fica o hotel?","'Onde' = dónde, muy parecida."],
   ["Quanto tempo demora?","¿Cuánto tiempo tarda?","Quanto tempo demora o voo?","'Demora' = tarda, casi idéntica al español."]],
  emergencias:[["Socorro!","¡Ayuda!","Socorro! Me ajude!","Idéntica al español."],
   ["Chame a polícia","Llame a la policía","Por favor, chame a polícia!","'Polícia' idéntica al español."],
   ["Preciso de um médico","Necesito un médico","Preciso de um médico agora.","Casi idéntica al español."],
   ["Incêndio!","¡Incendio!","Incêndio! Saia!","Idéntica al español."],
   ["Estou perdido","Estoy perdido","Desculpe, estou perdido.","Idéntica al español."],
   ["Ambulância","Ambulancia","Chame uma ambulância!","Casi idéntica al español."]]
 },
 it:{
  saludos:[["Ciao","Hola/Chao","Ciao, come stai?","Ya la usamos en español como 'chao' para despedirnos."],
   ["Buongiorno","Buenos días","Buongiorno a tutti!","'Buon' = bueno, 'giorno' = día."],
   ["Come stai?","¿Cómo estás?","Ciao, come stai?","'Come' suena a 'cóme', pregunta de estado."],
   ["Piacere di conoscerti","Mucho gusto","Piacere di conoscerti, sono Kate.","'Piacere' = placer, casi idéntica al español."],
   ["A dopo","Hasta luego","A dopo, ciao!","'Dopo' = después, corta y fácil."],
   ["Arrivederci","Adiós","Arrivederci, a presto!","'Ri-vedere' = volver a ver, como el alemán 'Wiedersehen'."]],
  compras:[["Quanto costa?","¿Cuánto cuesta?","Quanto costa questa maglietta?","Casi idéntica al español."],
   ["Scontrino","Recibo","Posso avere lo scontrino?","'Sconto' = descuento, el recibo confirma lo que pagaste."],
   ["Contanti","Efectivo","Pago in contanti.","Se parece a 'contar' dinero en efectivo."],
   ["Carta di credito","Tarjeta de crédito","Accettate carta di credito?","Casi idéntica al español."],
   ["Sconto","Descuento","C'è uno sconto oggi?","Muy parecida al español 'descuento'."],
   ["Carrello","Carrito de compras","Ho bisogno di un carrello.","Se parece a 'carro' con diminutivo."]],
  trabajo:[["Riunione","Reunión","Abbiamo una riunione alle 15.","Muy parecida al español 'reunión'."],
   ["Scadenza","Fecha límite","La scadenza è venerdì.","'Scadere' = vencer, como una fecha que vence."],
   ["Collega","Colega","Il mio collega ha inviato l'e-mail.","Idéntica al español."],
   ["E-mail","Correo electrónico","Mandami una e-mail.","Igual que en español."],
   ["Programma","Horario/agenda","Qual è il tuo programma oggi?","Idéntica al español 'programa'."],
   ["Capo","Jefe","Il mio capo è gentile.","Corta, 'capo' = cabeza/jefe, como en italiano-español mafioso conocido."]],
  comida:[["Acqua","Agua","Posso avere dell'acqua?","Muy parecida al español, cambia la 'g' por 'c' doble."],
   ["Pane","Pan","Vorrei del pane.","Casi idéntica al español."],
   ["Il conto, per favore","La cuenta, por favor","Il conto, per favore!","'Conto' = cuenta, casi idéntica al español."],
   ["delizioso","delicioso","Questo è delizioso!","Casi idéntica al español."],
   ["allergico a","alérgico a","Sono allergico alle noci.","Casi idéntica al español."],
   ["Tavolo per due","Mesa para dos","Un tavolo per due, per favore.","'Tavolo' = mesa, 'due' = dos."]],
  viajes:[["Aeroporto","Aeropuerto","L'aeroporto è lontano.","Casi idéntica al español."],
   ["Biglietto","Boleto","Dov'è il mio biglietto?","Se parece a 'billete' en español."],
   ["Bagaglio","Equipaje","Il mio bagaglio è pesante.","Se parece a 'bagaje' en español."],
   ["Passaporto","Pasaporte","Ho bisogno del passaporto.","Casi idéntica al español."],
   ["Dov'è...?","¿Dónde está...?","Dov'è l'hotel?","'Dove' = dónde, muy parecida al español."],
   ["Quanto tempo ci vuole?","¿Cuánto tiempo toma?","Quanto tempo ci vuole per arrivare?","'Ci vuole' = se necesita/toma."]],
  emergencias:[["Aiuto!","¡Ayuda!","Aiuto! Per favore!","Corta, fácil de gritar en una emergencia."],
   ["Chiama la polizia","Llama a la policía","Per favore, chiama la polizia!","'Polizia' idéntica al español."],
   ["Ho bisogno di un medico","Necesito un médico","Ho bisogno di un medico subito.","'Medico' casi idéntica al español."],
   ["Incendio!","¡Incendio!","Incendio! Esci!","Idéntica al español."],
   ["Mi sono perso","Estoy perdido","Scusi, mi sono perso.","Casi idéntica al español."],
   ["Ambulanza","Ambulancia","Chiama un'ambulanza!","Casi idéntica al español."]]
 }
};

const LANG_SITUATIONS=["saludos","compras","trabajo","comida","viajes","emergencias"];
const LANG_SITUATION_LABEL={saludos:"👋 Saludos",compras:"🛒 Compras",trabajo:"💼 Trabajo",comida:"🍽️ Comida",viajes:"✈️ Viajes",emergencias:"🚨 Emergencias"};

/* una regla gramatical simple por nivel CEFR (índice 0=A1 … 5=C2), comparada con el español */
const LANG_GRAMMAR_SEED={
 en:[
  {rule:"El verbo 'to be' (ser/estar)",explicacion:"En inglés un solo verbo (to be) cubre 'ser' Y 'estar': I am, you are, he/she is, we are, they are.",compara:"El español usa DOS verbos (ser/estar) para lo que el inglés hace con uno solo — más simple, solo hay que aprender cuándo usarlo."},
  {rule:"Pasado simple regular (-ed)",explicacion:"Para hablar del pasado, la mayoría de verbos suman '-ed': play→played, work→worked.",compara:"Es parecido al pretérito español (jugué, trabajé), pero en inglés el verbo NO cambia según quién habla: I played, she played (igual)."},
  {rule:"Presente perfecto (have + participio)",explicacion:"'I have eaten' conecta algo pasado con el presente (ya comí, y eso importa ahora).",compara:"No existe una forma idéntica en español; se parece más a 'he comido', pero el inglés lo usa mucho más seguido que el español."},
  {rule:"Condicional con 'would'",explicacion:"'I would go' expresa algo hipotético: lo que harías si...",compara:"Funciona como la terminación '-ía' del español (iría, comería) — mismo concepto, distinta forma."},
  {rule:"Voz pasiva (be + participio)",explicacion:"'The email was sent' pone el foco en la acción, no en quién la hizo.",compara:"El español suele usar 'se + verbo' (se envió el correo) para lo mismo — dos formas, misma idea."},
  {rule:"Estilo indirecto (reported speech)",explicacion:"Al repetir lo que alguien dijo, los tiempos verbales 'retroceden': 'I am tired' → 'She said she was tired'.",compara:"En español también cambiamos el tiempo al reportar ('dijo que estaba cansada'), la lógica es la misma."}
 ],
 de:[
  {rule:"El verbo va en segunda posición",explicacion:"En alemán el verbo conjugado SIEMPRE ocupa el segundo lugar de la oración, sin importar qué vaya primero: 'Heute gehe ich' (Hoy voy yo).",compara:"En español el orden es más libre; en alemán esta regla es fija y ayuda a entender frases largas."},
  {rule:"Casos: Nominativ vs Akkusativ",explicacion:"El artículo cambia según si la palabra es sujeto (der Mann) o complemento directo (den Mann).",compara:"El español no cambia el artículo según la función en la oración — esto es lo más nuevo del alemán para un hispanohablante."},
  {rule:"Verbos modales + verbo al final",explicacion:"Con 'können, müssen, wollen' el verbo principal se va al FINAL: 'Ich kann Deutsch sprechen' (Puedo alemán hablar).",compara:"En español el orden es sujeto-verbo-verbo (puedo hablar), en alemán se separan y el segundo verbo va al final."},
  {rule:"El caso Dativ (a quién)",explicacion:"Dativ indica a quién se dirige la acción: 'Ich gebe dem Mann das Buch' (le doy el libro al hombre).",compara:"El español no tiene esta marca en el artículo; usamos 'a/le' — el alemán lo marca cambiando der→dem."},
  {rule:"Konjunktiv II (el irreal/condicional)",explicacion:"'Ich würde gehen' o 'Ich wäre' expresan algo hipotético o cortés.",compara:"Funciona como el español 'iría' o 'si tuviera' — incluso se usa para pedir las cosas con más cortesía."},
  {rule:"Voz pasiva con 'werden'",explicacion:"'Die E-Mail wird gesendet' (El correo es enviado) usa 'werden' + participio.",compara:"Parecido a la pasiva del español ('es enviado'), pero el alemán usa 'werden' (llegar a ser) en vez de 'ser'."}
 ],
 pt:[
  {rule:"Ser vs. Estar",explicacion:"Igual que en español, el portugués distingue 'ser' (permanente) de 'estar' (temporal): Eu sou / Eu estou.",compara:"Esta es la transferencia MÁS fácil del portugués: la regla es casi idéntica a la del español."},
  {rule:"Pretérito perfeito (-ei/-ou)",explicacion:"Falei (hablé), Comeu (comió) — terminaciones regulares para el pasado simple.",compara:"Muy parecido al pretérito español (hablé, comió), solo cambian un poco las terminaciones."},
  {rule:"'Você' se conjuga como 'él/ella'",explicacion:"Aunque 'você' significa 'tú', se conjuga en tercera persona: 'Você fala' (no 'você falas').",compara:"En español 'tú hablas' usa segunda persona; en portugués 'você fala' usa la forma de 'él/ella habla' — la trampa más común para hispanohablantes."},
  {rule:"Futuro do subjuntivo",explicacion:"Se usa tras 'quando' o 'se' para eventos futuros hipotéticos: 'Quando eu chegar, te ligo'.",compara:"El español usa presente de subjuntivo para esto ('cuando llegue'); el portugués tiene un tiempo verbal propio para el futuro hipotético."},
  {rule:"Colocación del pronombre (o/lhe)",explicacion:"El pronombre puede ir antes o después del verbo según la oración: 'Ele me viu' vs 'Viu-me'.",compara:"El español siempre pone el pronombre antes en estos casos ('me vio'); el portugués es más flexible."},
  {rule:"Subjuntivo en cláusulas complejas",explicacion:"'Espero que você venha' usa subjuntivo tras expresiones de deseo o duda.",compara:"Es prácticamente igual al subjuntivo español ('espero que vengas') — otra transferencia fácil."}
 ],
 it:[
  {rule:"Artículos determinativos (il/lo/la/i/gli/le)",explicacion:"El artículo 'el' cambia según la letra inicial de la palabra: il libro, lo studente, la casa.",compara:"El español solo tiene 'el/la'; el italiano tiene más variantes que dependen del sonido inicial — hay que memorizar el patrón."},
  {rule:"Passato prossimo (avere/essere + participio)",explicacion:"'Ho mangiato' (he comido) o 'Sono andato' (he ido) — dos verbos auxiliares posibles según el verbo.",compara:"Se parece al pretérito perfecto compuesto español ('he comido'), pero el italiano a veces usa 'essere' (ser) en vez de 'haber'."},
  {rule:"Preposiciones articuladas (nel, sulla, dal)",explicacion:"La preposición se fusiona con el artículo: in + il = nel, su + la = sulla.",compara:"El español mantiene 'en el, sobre la' separados; el italiano los junta en una sola palabra."},
  {rule:"Congiuntivo presente",explicacion:"Se usa tras 'credo che, penso che' para expresar opinión o duda: 'Penso che sia vero'.",compara:"Funciona igual que el subjuntivo español tras 'creo que, pienso que' — transferencia bastante directa."},
  {rule:"Condizionale composto",explicacion:"'Avrei fatto' (habría hecho) expresa algo que no pasó pero pudo pasar.",compara:"Es exactamente el mismo concepto que el español 'habría hecho', solo cambia la forma del verbo."},
  {rule:"Periodo ipotetico (se + congiuntivo)",explicacion:"'Se avessi tempo, viaggerei' (Si tuviera tiempo, viajaría) — condición irreal.",compara:"Calca casi perfecto la estructura española 'si tuviera... viajaría' — misma lógica, distinta conjugación."}
 ]
};

/* sonidos que no existen (o suenan distinto) en español, comparados para pronunciarlos bien */
const LANG_PRONUNCIATION={
 en:[
  {sonido:"th (think, this)",compara:"No existe en español. Pon la punta de la lengua entre los dientes y sopla — no es la 'z' de Madrid, es más suave."},
  {sonido:"r inglesa (red, car)",compara:"La lengua NO toca el paladar ni se enrolla como en español — se curva hacia atrás sin tocar nada."},
  {sonido:"vocal corta i (ship) vs larga ee (sheep)",compara:"En español una 'i' siempre suena igual; en inglés la duración cambia el significado de la palabra."},
  {sonido:"h aspirada (hello, house)",compara:"En español la 'h' es muda; en inglés se sopla suave, como una 'j' débil."}
 ],
 de:[
  {sonido:"ü (müde, für)",compara:"Di 'u' pero con los labios en posición de 'i' (como redondear la boca diciendo 'i')."},
  {sonido:"ö (schön, hören)",compara:"Di 'e' pero con los labios redondeados como para decir 'o'."},
  {sonido:"ch suave (ich, nicht)",compara:"No es la 'ch' española de 'chico' — es un sonido más suave, entre 'j' y 'sh', casi silbado."},
  {sonido:"r alemana (rot, Reise)",compara:"Se pronuncia en la garganta (gutural), no se enrolla con la punta de la lengua como en español."}
 ],
 pt:[
  {sonido:"ão nasal (não, pão)",compara:"El aire sale por la nariz — el español nunca nasaliza vocales, así que hay que practicarlo aparte."},
  {sonido:"lh (mulher, trabalho)",compara:"Suena como la 'll' del español de Argentina o España (no como una 'l' sola)."},
  {sonido:"r inicial o rr (rato, carro)",compara:"Suena como la 'j' española fuerte (jota), no como una 'r' suave."},
  {sonido:"vocales nasales (bem, sim)",compara:"El español no nasaliza; en portugués la 'm/n' final nasaliza la vocal anterior sin pronunciarse fuerte."}
 ],
 it:[
  {sonido:"gli (famiglia, figlio)",compara:"Parecido a la 'll' española pero más suave y rápido, casi como decir 'li' pegado."},
  {sonido:"gn (gnocchi, bagno)",compara:"Suena exactamente como la 'ñ' española — gnocchi se pronuncia 'ñoki'."},
  {sonido:"consonantes dobles (penna vs pena)",compara:"El español no distingue esto; en italiano una consonante doble se pronuncia más larga y cambia el significado."},
  {sonido:"c/g antes de e-i (cena, gelato)",compara:"Suenan como 'ch/j' suave (che, yelato), distinto a la 'c/g' fuerte del español."}
 ]
};

/* frases conectoras genéricas para armar la conversación de respaldo sin clave de Gemini */
const LANG_PHRASES={
 en:{greet:"Hello!",howAreYou:"How are you?",imFine:"I'm fine, thanks.",whatsYourName:"What's your name?",myNameIs:"My name is",yes:"Yes",no:"No",please:"please",thanks:"Thank you",dontUnderstand:"I don't understand",canYouRepeat:"Can you repeat that?",goodbye:"Goodbye!"},
 de:{greet:"Hallo!",howAreYou:"Wie geht's?",imFine:"Mir geht's gut, danke.",whatsYourName:"Wie heißt du?",myNameIs:"Ich heiße",yes:"Ja",no:"Nein",please:"bitte",thanks:"Danke",dontUnderstand:"Ich verstehe nicht",canYouRepeat:"Kannst du das wiederholen?",goodbye:"Auf Wiedersehen!"},
 pt:{greet:"Olá!",howAreYou:"Como vai?",imFine:"Estou bem, obrigado.",whatsYourName:"Qual é o seu nome?",myNameIs:"Meu nome é",yes:"Sim",no:"Não",please:"por favor",thanks:"Obrigado",dontUnderstand:"Não entendo",canYouRepeat:"Pode repetir?",goodbye:"Tchau!"},
 it:{greet:"Ciao!",howAreYou:"Come stai?",imFine:"Sto bene, grazie.",whatsYourName:"Come ti chiami?",myNameIs:"Mi chiamo",yes:"Sì",no:"No",please:"per favore",thanks:"Grazie",dontUnderstand:"Non capisco",canYouRepeat:"Puoi ripetere?",goodbye:"Arrivederci!"}
};
