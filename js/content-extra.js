"use strict";
/* ============ CONTENIDO NUEVO v5: ubicación, comparación, adivinanzas, ciencias y memoria ============ */

/* ---- UBICACIÓN ESPACIAL (izquierda/derecha, arriba/abajo, sobre/debajo) ---- */
const SPATIAL_EMOJIS=["🐶","🐱","🦊","🐸","🐦","🐢","🦋","🍎","⚽","🚗","🌻","⭐","🎈","🧸","🍌"];
function genSpatial(){
 const kind=rnd(5);
 const e=shuffled(SPATIAL_EMOJIS).slice(0,3);
 if(kind===0){ // ¿qué está a la izquierda/derecha de X?
  const left=Math.random()<.5;
  const q=(left?"¿Qué está a la IZQUIERDA del ":"¿Qué está a la DERECHA del ")+e[1]+"?";
  return{q,pic:e[0]+" "+e[1]+" "+e[2],ops:[left?e[0]:e[2],left?e[2]:e[0],e[1]],a:0};
 }
 if(kind===1){ // ¿cuál está en el medio?
  return{q:"¿Cuál está en el MEDIO?",pic:e[0]+" "+e[1]+" "+e[2],ops:[e[1],e[0],e[2]],a:0};
 }
 if(kind===2){ // sobre / debajo de la mesa
  const over=Math.random()<.5;
  const q="¿El "+e[0]+" está SOBRE o DEBAJO de la mesa?";
  return{q,pic:over?(e[0]+"<br>🟫🟫🟫"):("🟫🟫🟫<br>"+e[0]),ops:over?["Sobre (encima)","Debajo"]:["Debajo","Sobre (encima)"],a:0};
 }
 if(kind===3){ // arriba / abajo en una torre
  const top=Math.random()<.5;
  const q=top?"¿Qué está ARRIBA?":"¿Qué está ABAJO?";
  return{q,pic:e[0]+"<br>"+e[1],ops:[top?e[0]:e[1],top?e[1]:e[0],e[2]],a:0};
 }
 // ¿hacia dónde apunta la flecha?
 const dirs=[["⬆️","Arriba"],["⬇️","Abajo"],["⬅️","Izquierda"],["➡️","Derecha"]];
 const d=pick(dirs);
 const wrong=shuffled(dirs.filter(x=>x[1]!==d[1])).slice(0,2).map(x=>x[1]);
 return{q:"¿Hacia dónde apunta la flecha?",pic:d[0],ops:[d[1],...wrong],a:0};
}

/* ---- MAYOR QUE / MENOR QUE / IGUAL ---- */
function genCompare(){
 const kind=rnd(4);
 if(kind===0){ // el signo correcto
  const a=1+rnd(99);let b=1+rnd(99);
  if(Math.random()<.15)b=a;
  const sym=a>b?">":a<b?"<":"=";
  const ops=shuffled([">","<","="]);
  return{q:a+" __ "+b+"   ¿Qué signo va? (el 🐊 se come al más grande)",ops,a:ops.indexOf(sym)};
 }
 if(kind===1){ // cuál es mayor
  const set=new Set();while(set.size<3)set.add(1+rnd(99));
  const nums=[...set];const max=Math.max(...nums);
  const ops=shuffled(nums.map(String));
  return{q:"¿Cuál número es MAYOR?",ops,a:ops.indexOf(String(max))};
 }
 if(kind===2){ // cuál es menor
  const set=new Set();while(set.size<3)set.add(1+rnd(99));
  const nums=[...set];const min=Math.min(...nums);
  const ops=shuffled(nums.map(String));
  return{q:"¿Cuál número es MENOR?",ops,a:ops.indexOf(String(min))};
 }
 // grupos de emojis: ¿dónde hay más? (dos cajas bien separadas y con color)
 const em=pick(["🍎","⭐","🎈","🐟","🍪"]);
 let a=1+rnd(6),b=1+rnd(6);if(a===b)b=(a%6)+1;
 const ops=a>b?["El grupo 1️⃣","El grupo 2️⃣","Son iguales"]:["El grupo 2️⃣","El grupo 1️⃣","Son iguales"];
 const caja=(label,em,n,bg)=>'<div style="border:3px solid #1E2A4A;border-radius:14px;padding:8px 10px;margin:6px auto;max-width:280px;background:'+bg+'"><b style="font-family:Fredoka">'+label+'</b><div style="font-size:1.6rem;line-height:1.3">'+em.repeat(n)+'</div></div>';
 const pic=caja("Grupo 1️⃣",em,a,"#FFF3C4")+caja("Grupo 2️⃣",em,b,"#D6ECFF");
 return{q:"¿Qué grupo tiene MÁS "+em+"?",pic,ops,a:0};
}

/* ---- ADIVINANZAS (acertijos clásicos) ---- */
const ADIVINANZAS=[
 {q:"Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.",ans:"La pera 🍐",ops:["La pera 🍐","La sandía 🍉","El limón 🍋"]},
 {q:"Oro parece, plata no es. El que no lo adivine, bien tonto es.",ans:"El plátano 🍌",ops:["El plátano 🍌","El anillo 💍","El queso 🧀"]},
 {q:"Vuela sin alas, silba sin boca, y no se ve ni se toca.",ans:"El viento 🌬️",ops:["El viento 🌬️","El pájaro 🐦","El avión ✈️"]},
 {q:"Tengo agujas y no sé coser, tengo números y no sé leer.",ans:"El reloj ⏰",ops:["El reloj ⏰","El doctor 🩺","El libro 📖"]},
 {q:"Salta y salta y la colita le falta.",ans:"La rana 🐸",ops:["La rana 🐸","El gato 🐱","El canguro 🦘"]},
 {q:"Es redonda como un queso y nadie puede comérsela.",ans:"La luna 🌕",ops:["La luna 🌕","La pizza 🍕","La pelota ⚽"]},
 {q:"Cuanto más lava, más sucia se pone.",ans:"El agua 💧",ops:["El agua 💧","La ropa 👕","La esponja 🧽"]},
 {q:"Tiene dientes y no come, tiene cabeza y no es hombre.",ans:"El ajo 🧄",ops:["El ajo 🧄","El peine 💈","El león 🦁"]},
 {q:"De día duermen tranquilas, de noche brillan arriba.",ans:"Las estrellas ⭐",ops:["Las estrellas ⭐","Las flores 🌸","Las lámparas 💡"]},
 {q:"Tengo ojos y no veo, vivo bajo la tierra.",ans:"La papa 🥔",ops:["La papa 🥔","El topo 🦦","La zanahoria 🥕"]},
 {q:"Soy alta cuando joven y bajita cuando vieja, y alumbro sin ser sol.",ans:"La vela 🕯️",ops:["La vela 🕯️","El árbol 🌳","La abuela 👵"]},
 {q:"Todos me pisan a mí, pero yo no piso a nadie.",ans:"El suelo 🟫",ops:["El suelo 🟫","El zapato 👟","La hormiga 🐜"]},
 {q:"Llevo mi casa al hombro y voy marcando mi huella con un hilito de plata.",ans:"El caracol 🐌",ops:["El caracol 🐌","La tortuga 🐢","El cartero 📬"]},
 {q:"Bonita planta con una flor que gira y gira buscando el sol.",ans:"El girasol 🌻",ops:["El girasol 🌻","La rosa 🌹","El cactus 🌵"]}];
function genRiddle(){
 const r=pick(ADIVINANZAS);
 const ops=shuffled(r.ops.slice());
 return{q:"🕵️ Adivina adivinador… "+r.q,ops,a:ops.indexOf(r.ans)};
}

/* ---- CIENCIAS NATURALES (ciclo del agua, cuerpo, naturaleza) ---- */
const CICLO_AGUA_QS=[
 {q:"El sol calienta el agua del mar. ¿Qué pasa con el agua?",pic:"☀️🌊",ops:["Sube como vapor (se evapora)","Se congela","Se vuelve arena"],a:0},
 {q:"El vapor de agua sube al cielo y se junta. ¿Qué se forma?",pic:"💨☁️",ops:["Las nubes","Las estrellas","El arcoíris"],a:0},
 {q:"Cuando las nubes están muy llenas de agua… ¿qué pasa?",pic:"☁️🌧️",ops:["Llueve","Sale el sol","Se vuelan"],a:0},
 {q:"¿A dónde va el agua de la lluvia?",pic:"🌧️🏞️",ops:["A los ríos y al mar","Desaparece para siempre","Al espacio"],a:0},
 {q:"¿Cómo se llama el viaje del agua: mar → nube → lluvia → río → mar?",pic:"🔄💧",ops:["El ciclo del agua","La tormenta","El remolino"],a:0},
 {q:"¿Qué es la evaporación?",pic:"♨️",ops:["Cuando el agua se convierte en vapor","Cuando el agua se congela","Cuando llueve muy fuerte"],a:0},
 {q:"La lluvia que cae de las nubes se llama…",pic:"🌧️",ops:["Precipitación","Evaporación","Condensación"],a:0},
 {q:"¿Cuándo cae NIEVE en vez de lluvia?",pic:"❄️",ops:["Cuando hace mucho frío","Cuando hace calor","Cuando hay viento"],a:0}];
const CUERPO_QS=[
 {q:"¿Con qué parte del cuerpo VES?",pic:"👀",ops:["Los ojos","Las orejas","La nariz"],a:0},
 {q:"¿Con qué parte del cuerpo OYES la música?",pic:"🎵",ops:["Las orejas","Los ojos","Los pies"],a:0},
 {q:"¿Qué órgano late y bombea la sangre? Bum, bum…",pic:"🫀",ops:["El corazón","El cerebro","El estómago"],a:0},
 {q:"¿Con qué piensas y aprendes?",pic:"🧠",ops:["El cerebro","El corazón","Las manos"],a:0},
 {q:"¿Qué usamos para respirar?",pic:"🫁",ops:["Los pulmones","Los huesos","Las uñas"],a:0},
 {q:"¿Qué le da forma y sostén a tu cuerpo?",pic:"🦴",ops:["Los huesos","El cabello","La ropa"],a:0},
 {q:"¿A dónde va la comida cuando comes?",pic:"🍎😋",ops:["Al estómago","A los pulmones","A las rodillas"],a:0},
 {q:"¿Cuántos dedos tienes en UNA mano?",pic:"✋",ops:["5","10","4"],a:0},
 {q:"¿Qué sentido usas cuando hueles una flor?",pic:"🌸👃",ops:["El olfato","El oído","La vista"],a:0},
 {q:"¿Qué debes hacer antes de comer?",pic:"🧼🙌",ops:["Lavarme las manos","Dormir","Correr"],a:0}];
const NATURA_QS=[
 {q:"¿Dónde vive el pez?",pic:"🐟",ops:["En el agua","En el árbol","En la cueva"],a:0},
 {q:"¿Qué necesita una planta para crecer?",pic:"🌱",ops:["Agua, sol y tierra","Solo dulces","Solo viento"],a:0},
 {q:"¿Qué animal pone huevos?",pic:"🥚",ops:["La gallina","El perro","La vaca"],a:0},
 {q:"¿Cuándo podemos ver las estrellas?",pic:"🌙",ops:["De noche","De día","Cuando llueve"],a:0},
 {q:"¿Qué nos da la vaca?",pic:"🐮",ops:["Leche","Huevos","Lana"],a:0},
 {q:"La abeja hace…",pic:"🐝",ops:["Miel","Queso","Pan"],a:0},
 {q:"¿Cuál de estos animales VUELA?",pic:"☁️",ops:["El pájaro 🐦","El pez 🐟","El caballo 🐴"],a:0},
 {q:"¿Dónde debemos botar la basura?",pic:"🗑️",ops:["En la caneca","En el río","En la calle"],a:0},
 {q:"El árbol nos regala…",pic:"🌳",ops:["Aire limpio y sombra","Plástico","Vidrio"],a:0},
 {q:"¿Qué animal duerme TODO el invierno?",pic:"❄️",ops:["El oso 🐻","El gallo 🐓","La mosca 🪰"],a:0}];

/* ---- SETS DEL JUEGO DE MEMORIA (relacionar parejas con emojis) ---- */
const MEMORY_SETS={
 meses:{nm:"Meses ES ↔ EN",ic:"🗓️",desc:"Mes en español + en inglés",subj:"Meses",
  pairs:()=>shuffled(MESES).slice(0,6).map(p=>[p[0],p[1]])},
 numeros:{nm:"Números y puntos",ic:"🔵",desc:"Número + sus puntos",subj:"Números",
  pairs:()=>{const out=[];const used=new Set();while(out.length<6){const n=1+rnd(9);if(!used.has(n)){used.add(n);out.push([String(n),"🔵".repeat(n)]);}}return out;}},
 cuerpo:{nm:"El cuerpo en inglés",ic:"🧍",desc:"Palabra en inglés + su dibujo",subj:"Inglés",
  pairs:()=>shuffled(EN_VOCAB.body.concat([["leg","pierna","🦵"],["arm","brazo","💪"],["tooth","diente","🦷"]])).slice(0,6).map(w=>[w[0],w[2]])},
 animales:{nm:"Animales en inglés",ic:"🦁",desc:"Animal en inglés + su dibujo",subj:"Inglés",
  pairs:()=>shuffled(EN_VOCAB.animals).slice(0,6).map(w=>[w[0],w[2]])},
 agua:{nm:"Ciclo del agua",ic:"💧",desc:"Cada etapa con su dibujo",subj:"Ciclo del agua",
  pairs:()=>shuffled([["Sol calienta","☀️🌊"],["Evaporación","💨⬆️"],["Nubes","☁️"],["Lluvia","🌧️"],["Río","🏞️"],["Mar","🌊"],["Nieve","❄️"],["Vapor","♨️"]]).slice(0,6)},
 opuestos:{nm:"Opuestos",ic:"↔️",desc:"Cada cosa con su contrario",subj:"Lógica",
  pairs:()=>shuffled([["Arriba ⬆️","Abajo ⬇️"],["Grande 🐘","Pequeño 🐜"],["Día ☀️","Noche 🌙"],["Frío ❄️","Calor 🔥"],["Feliz 😀","Triste 😢"],["Rápido 🐆","Lento 🐢"],["Lleno 🥛","Vacío 🥃"],["Abierto 🔓","Cerrado 🔒"]]).slice(0,6)},
 emociones:{nm:"Emociones en inglés",ic:"😀",desc:"Emoción en inglés + su carita",subj:"Inglés",
  pairs:()=>shuffled([["happy","😀"],["sad","😢"],["angry","😡"],["scared","😱"],["tired","🥱"],["surprised","😮"]]).slice(0,6)}};
