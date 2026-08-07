"use strict";
/* ============ CURSO DE PYTHON (perfil adulto) ============ */
/* Progresión curada inspirada en la estructura de ThePythonLedger/Curriculum (MIT) como
   referencia de curación, no como dependencia en vivo. Estructura propia por tema (distinta
   a la de idiomas): concepto → ejemplo de código → ejercicio con código real ejecutado por
   Skulpt (funciona sin clave de Gemini) → revisión de la IA opcional → cierre. */
const PY_TOPICS=[
 {id:"variables",ic:"🔤",nm:"Variables y tipos de datos",
  concepto:"Una variable guarda un valor con un nombre para usarlo después. Python detecta el tipo (número, texto...) automáticamente, sin que tengas que declararlo.",
  compara:"Es como una caja con etiqueta: en español dirías 'la variable edad vale 7'; en Python simplemente escribes edad = 7 y ya existe.",
  ejemplo:'nombre = "Ana"\nedad = 7\nprint(nombre, "tiene", edad, "años")',
  enunciado:"Completa la función saludo(nombre) para que devuelva el texto 'Hola, ' seguido del nombre recibido.",
  starter:'def saludo(nombre):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:'saludo("Kate")',expected:"Hola, Kate"},{expr:'saludo("Luis")',expected:"Hola, Luis"}],
  hint:"Usa + para unir el texto 'Hola, ' con el nombre recibido.",
  solution:'def saludo(nombre):\n    return "Hola, " + nombre\n',
  terms:[["variable","caja con nombre que guarda un valor"],["str","tipo de dato de texto"],["int","tipo de dato numérico entero"],["print()","muestra algo en pantalla"]]},
 {id:"tipos_datos",ic:"🔢",nm:"Tipos de datos",
  concepto:"Los tipos más comunes son int (entero), float (decimal), str (texto) y bool (verdadero/falso). Puedes convertir entre ellos con str(), int(), float().",
  compara:"En español no marcamos si una palabra es 'número' o 'texto' al hablar; Python sí lo distingue internamente, por eso a veces hay que convertir un número a texto antes de unirlo con print.",
  ejemplo:'precio = 9.99\nprint(type(precio))\ntexto = str(precio)\nprint("Precio: " + texto)',
  enunciado:"Completa la función a_texto(numero) que reciba un número y devuelva ese número convertido a texto (str).",
  starter:'def a_texto(numero):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:"a_texto(5)",expected:"5"},{expr:"a_texto(10)",expected:"10"}],
  hint:"Usa la función str() para convertir el número a texto.",
  solution:"def a_texto(numero):\n    return str(numero)\n",
  terms:[["int","número entero"],["float","número decimal"],["bool","verdadero o falso"],["str()","convierte a texto"]]},
 {id:"condicionales",ic:"🔀",nm:"Condicionales (if/else)",
  concepto:"if ejecuta código SOLO si una condición es verdadera; else cubre el caso contrario.",
  compara:"Como decir en español 'si tienes 18 años o más, eres mayor de edad; si no, eres menor' — Python usa if/else para exactamente esa lógica.",
  ejemplo:'edad = 20\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")',
  enunciado:"Completa la función es_mayor_de_edad(edad) que devuelva True si edad es 18 o más, y False si no.",
  starter:'def es_mayor_de_edad(edad):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:"es_mayor_de_edad(20)",expected:true},{expr:"es_mayor_de_edad(10)",expected:false}],
  hint:"Usa if edad >= 18: return True, y en else: return False.",
  solution:"def es_mayor_de_edad(edad):\n    if edad >= 18:\n        return True\n    else:\n        return False\n",
  terms:[["if","ejecuta si la condición es verdadera"],["else","el caso contrario"],[">=","mayor o igual que"],["bool","True o False"]]},
 {id:"bucles",ic:"🔁",nm:"Bucles (for)",
  concepto:"Un bucle for repite código automáticamente para cada elemento de una lista o rango, sin copiar y pegar.",
  compara:"Como decir 'por cada número de la lista, súmalo al total' — el for hace exactamente eso, uno por uno.",
  ejemplo:'numeros = [1, 2, 3, 4]\ntotal = 0\nfor n in numeros:\n    total = total + n\nprint(total)',
  enunciado:"Completa la función suma_lista(numeros) que sume todos los números de la lista usando un bucle for y devuelva el total.",
  starter:'def suma_lista(numeros):\n    total = 0\n    # completa el bucle aquí\n    return total\n',
  tests:[{expr:"suma_lista([1, 2, 3])",expected:6},{expr:"suma_lista([10, 20])",expected:30}],
  hint:"Dentro del for, suma cada número al total: total = total + n",
  solution:"def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total = total + n\n    return total\n",
  terms:[["for","repite código para cada elemento"],["range()","genera una secuencia de números"],["total","variable acumuladora"],["lista","colección ordenada de valores"]]},
 {id:"funciones",ic:"🧩",nm:"Funciones",
  concepto:"Una función empaqueta código reutilizable con nombre, entradas (parámetros) y una salida (return).",
  compara:"Como una receta de cocina: tiene ingredientes (parámetros) y un plato final (return) — la escribes una vez y la usas cuantas veces quieras.",
  ejemplo:'def area_rectangulo(base, altura):\n    return base * altura\n\nprint(area_rectangulo(4, 5))',
  enunciado:"Escribe la función area_triangulo(base, altura) que devuelva el área de un triángulo (base * altura / 2).",
  starter:'def area_triangulo(base, altura):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:"area_triangulo(4, 6)",expected:12},{expr:"area_triangulo(10, 2)",expected:10}],
  hint:"El área de un triángulo es base * altura / 2.",
  solution:"def area_triangulo(base, altura):\n    return base * altura / 2\n",
  terms:[["función","bloque de código reutilizable"],["parámetro","dato que recibe la función"],["return","devuelve un resultado"],["def","palabra para crear una función"]]},
 {id:"listas",ic:"📋",nm:"Listas",
  concepto:"Una lista guarda varios valores en orden, accesibles por posición (índice), empezando en 0.",
  compara:"Como una fila de casillas numeradas desde 0; el índice -1 de Python es un atajo para 'el último', un concepto que el español no tiene como palabra directa.",
  ejemplo:'frutas = ["manzana", "pera", "uva"]\nprint(frutas[0])\nprint(frutas[-1])',
  enunciado:"Completa la función primero_y_ultimo(lista) que devuelva una nueva lista con [el primer elemento, el último elemento].",
  starter:'def primero_y_ultimo(lista):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:"primero_y_ultimo([1, 2, 3, 4])",expected:[1,4]},{expr:'primero_y_ultimo(["a", "b", "c"])',expected:["a","c"]}],
  hint:"Usa lista[0] para el primero y lista[-1] para el último.",
  solution:"def primero_y_ultimo(lista):\n    return [lista[0], lista[-1]]\n",
  terms:[["lista","colección ordenada de valores"],["índice","posición de un valor en la lista"],["[0]","primer elemento"],["[-1]","último elemento"]]},
 {id:"diccionarios",ic:"📖",nm:"Diccionarios",
  concepto:"Un diccionario guarda pares clave-valor, como una agenda telefónica (nombre → número).",
  compara:"En vez de buscar por posición (como en una lista), buscas por nombre o clave — más parecido a cómo buscamos algo en la vida real.",
  ejemplo:'agenda = {"Ana": "3001234567", "Luis": "3007654321"}\nprint(agenda["Ana"])',
  enunciado:"Completa la función obtener_valor(diccionario, clave) que devuelva el valor de esa clave, o 'no encontrado' si la clave no existe (usa .get()).",
  starter:'def obtener_valor(diccionario, clave):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:'obtener_valor({"a": 1, "b": 2}, "a")',expected:1},{expr:'obtener_valor({"a": 1}, "z")',expected:"no encontrado"}],
  hint:"Usa diccionario.get(clave, 'no encontrado').",
  solution:'def obtener_valor(diccionario, clave):\n    return diccionario.get(clave, "no encontrado")\n',
  terms:[["diccionario","pares clave-valor"],["clave","nombre para buscar un valor"],[".get()","busca una clave sin dar error si falta"],["{}","forma de crear un diccionario"]]},
 {id:"errores",ic:"🛟",nm:"Manejo de errores (try/except)",
  concepto:"try/except atrapa errores para que el programa no se caiga, y responde con un mensaje controlado en vez de romperse.",
  compara:"Como tener un plan B: 'intenta hacer esto, y si sale mal, haz esto otro' — en vez de que todo se detenga de golpe.",
  ejemplo:'try:\n    resultado = 10 / 0\nexcept:\n    print("No se puede dividir por cero")',
  enunciado:"Completa la función dividir_seguro(a, b) que devuelva a/b, pero si b es 0 devuelva el texto 'Error: no se puede dividir por cero' usando try/except.",
  starter:'def dividir_seguro(a, b):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:"dividir_seguro(10, 2)",expected:5},{expr:"dividir_seguro(5, 0)",expected:"Error: no se puede dividir por cero"}],
  hint:"Pon la división dentro de try, y en except devuelve el mensaje de error.",
  solution:'def dividir_seguro(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Error: no se puede dividir por cero"\n',
  terms:[["try","intenta ejecutar este código"],["except","qué hacer si algo falla"],["error","algo que rompe el programa"],["plan B","idea detrás de try/except"]]},
 {id:"poo",ic:"🏗️",nm:"Programación orientada a objetos",
  concepto:"Una clase es un molde para crear objetos que agrupan datos (atributos) y acciones (métodos).",
  compara:"Como una plantilla de formulario: la clase define los campos y las acciones posibles, y cada objeto es un formulario ya lleno con datos propios.",
  ejemplo:'class Mascota:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def saludo(self):\n        return self.nombre + " dice: ¡Hola!"\n\np = Mascota("Firulais")\nprint(p.saludo())',
  enunciado:"Completa la clase Mascota para que Mascota('Firulais').saludo() devuelva 'Firulais dice: ¡Hola!'.",
  starter:'class Mascota:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def saludo(self):\n        # escribe tu código aquí\n        pass\n',
  tests:[{expr:'Mascota("Firulais").saludo()',expected:"Firulais dice: ¡Hola!"},{expr:'Mascota("Kate").saludo()',expected:"Kate dice: ¡Hola!"}],
  hint:"Usa self.nombre + ' dice: ¡Hola!' dentro de saludo().",
  solution:'class Mascota:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def saludo(self):\n        return self.nombre + " dice: ¡Hola!"\n',
  terms:[["clase","molde para crear objetos"],["objeto","una instancia creada de una clase"],["self","el objeto actual dentro de la clase"],["__init__","se ejecuta al crear el objeto"]]},
 {id:"proyecto",ic:"🏆",nm:"Proyecto final: palíndromos",
  concepto:"Un palíndromo es un texto que se lee igual al derecho y al revés (ana, reconocer). Puedes invertir un texto en Python con texto[::-1].",
  compara:"Es un pequeño reto que junta varios conceptos: texto, comparación (==) y una condición — como armar una frase completa usando varias palabras que ya aprendiste.",
  ejemplo:'texto = "ana"\ninvertido = texto[::-1]\nprint(texto == invertido)',
  enunciado:"Escribe la función es_palindromo(texto) que devuelva True si el texto es igual al revés (ignora mayúsculas usando .lower()), y False si no.",
  starter:'def es_palindromo(texto):\n    # escribe tu código aquí\n    pass\n',
  tests:[{expr:'es_palindromo("Ana")',expected:true},{expr:'es_palindromo("Hola")',expected:false},{expr:'es_palindromo("Reconocer")',expected:true}],
  hint:"Usa .lower() para ignorar mayúsculas y compáralo con su versión invertida [::-1].",
  solution:'def es_palindromo(texto):\n    limpio = texto.lower()\n    return limpio == limpio[::-1]\n',
  terms:[["palíndromo","se lee igual al derecho y al revés"],["[::-1]","invierte un texto o lista"],[".lower()","convierte a minúsculas"],["==","compara si dos valores son iguales"]]}
];
function pyState(){const p=prof();if(!p.py)p.py={};return p.py;}
function pyTopicState(id){const s=pyState();if(!s[id])s[id]={done:false};return s[id];}
function pyUnlocked(idx){if(idx===0)return true;return pyTopicState(PY_TOPICS[idx-1].id).done;}

/* ---- ejecuta el código del estudiante con Skulpt y compara contra pruebas fijas ---- */
function pyLiteral(v){
 if(typeof v==="string")return JSON.stringify(v);
 if(typeof v==="boolean")return v?"True":"False";
 if(v===null||v===undefined)return "None";
 if(Array.isArray(v))return "["+v.map(pyLiteral).join(", ")+"]";
 return String(v);}
function runPythonTests(userCode,tests){
 return new Promise(function(resolve){
  if(typeof Sk==="undefined"){resolve({ok:false,error:"El motor de Python no cargó (necesitas internet la primera vez)."});return;}
  let output="";
  function outf(text){output+=text;}
  function builtinRead(x){
   if(Sk.builtinFiles===undefined||Sk.builtinFiles.files[x]===undefined)throw "File not found: '"+x+"'";
   return Sk.builtinFiles.files[x];}
  Sk.configure({output:outf,read:builtinRead,__future__:Sk.python3});
  const testCalls=tests.map(function(t,i){
   return 'try:\n    print("__TEST_'+i+'__", ('+t.expr+') == '+pyLiteral(t.expected)+')\nexcept Exception as __e:\n    print("__TEST_'+i+'__ERROR", str(__e))';
  }).join("\n");
  const fullCode=userCode+"\n\n"+testCalls;
  Sk.misceval.asyncToPromise(function(){return Sk.importMainWithBody("<stdin>",false,fullCode,true);})
   .then(function(){
    const results=tests.map(function(t,i){
     const re=new RegExp("__TEST_"+i+"__\\s+(True|False)");
     const m=output.match(re);return m?m[1]==="True":false;});
    resolve({ok:true,results:results,output:output});
   },function(err){resolve({ok:false,error:err.toString(),output:output});});
 });}

/* ---- pantallas ---- */
function screenPyHub(){setTheme("adulto");
 render(topbar("screenAdultHome()")
  +'<h2 style="text-align:center">🐍 Python</h2>'
  +'<p class="mut center" style="margin-bottom:10px">Aprende programación paso a paso, con ejercicios de código real</p>'
  +PY_TOPICS.map(function(t,i){
   const unlocked=pyUnlocked(i),done=pyTopicState(t.id).done;
   return '<button class="abtn'+(done?' green':'')+'" '+(unlocked?'':'style="opacity:.5"')+' onclick="'+(unlocked?"screenPyLesson('"+t.id+"')":"toast('Completa el tema anterior primero 🔒',false,1600)")+'">'
    +t.ic+' '+t.nm+(done?' ✓':unlocked?'':' 🔒')+'</button>';
  }).join(""));}
let PY={};
function screenPyLesson(topicId){
 const t=PY_TOPICS.find(function(x){return x.id===topicId;});if(!t)return screenPyHub();
 PY={topicId:topicId,step:"concepto",code:t.starter};
 renderPyStep();}
function renderPyStep(){
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 setTheme("adulto");
 if(PY.step==="concepto")return render(topbar("screenPyHub()")
  +'<h2 style="text-align:center">'+t.ic+' '+t.nm+'</h2>'
  +'<div class="card"><h3>💡 Concepto</h3><p style="margin-top:8px;line-height:1.6">'+esc(t.concepto)+'</p>'
  +'<p style="margin-top:10px;line-height:1.6"><b>🇪🇸 En palabras simples:</b> '+esc(t.compara)+'</p></div>'
  +'<button class="abtn green" onclick="PY.step=\'ejemplo\';renderPyStep()">Ver ejemplo →</button>');
 if(PY.step==="ejemplo")return render(topbar("screenPyHub()")
  +'<h2 style="text-align:center">📄 Ejemplo de código</h2>'
  +'<pre class="pycode">'+esc(t.ejemplo)+'</pre>'
  +'<button class="abtn green" onclick="PY.step=\'ejercicio\';renderPyStep()">Practicar →</button>');
 if(PY.step==="ejercicio")return render(topbar("screenPyHub()")
  +'<h2 style="text-align:center">✍️ Ejercicio</h2>'
  +'<div class="card"><p style="line-height:1.6">'+esc(t.enunciado)+'</p></div>'
  +'<textarea id="pycode" rows="8" style="width:100%;font-family:monospace;font-size:.9rem">'+esc(PY.code)+'</textarea>'
  +'<button class="abtn green" onclick="runPyExercise()">▶️ Ejecutar</button>'
  +'<div id="pyresult"></div>');}
async function runPyExercise(){
 const ta=document.getElementById("pycode"),code=ta?ta.value:"";
 PY.code=code;
 const box=document.getElementById("pyresult");
 box.innerHTML='<div class="card center"><span class="spin">⏳</span> Ejecutando…</div>';
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 const res=await runPythonTests(code,t.tests);
 const hintBtns='<div style="display:flex;gap:8px;margin-top:10px"><button class="abtn ghost" style="flex:1" onclick="showPyHint()">💡 Ver pista</button><button class="abtn ghost" style="flex:1" onclick="showPySolution()">👀 Ver solución</button></div><div id="pyhintbox"></div>';
 if(!res.ok){box.innerHTML='<div class="card errborder"><b>Hay un error en tu código:</b><br><span style="font-family:monospace;font-size:.85rem">'+esc(res.error)+'</span></div>'+hintBtns;return;}
 const passed=res.results.filter(Boolean).length,allOk=passed===t.tests.length;
 PY.testsPassed=allOk;
 let aiHtml="";
 if(S.geminiKey){
  box.innerHTML='<div class="card center"><span class="spin">⏳</span> Resultados listos, la IA está revisando tu estilo…</div>';
  try{
   const obj=await geminiJSON('Eres profesor de Python. Un estudiante resolvió este ejercicio: "'+t.enunciado+'". Su código:\n'+code+'\nLos tests automáticos dieron: '+passed+'/'+t.tests.length+' correctos. Da retroalimentación BREVE (2-3 frases) en español sobre claridad y estilo del código, sea cual sea el resultado. Responde SOLO JSON: {"feedback":"..."}');
   aiHtml='<div class="card"><h3>🤖 Retroalimentación</h3><p style="margin-top:6px;line-height:1.5">'+esc(obj.feedback||"")+'</p></div>';
  }catch(e){}
 }
 box.innerHTML='<div class="card'+(allOk?' okborder':' errborder')+'"><h3>'+(allOk?"✅ ¡Todas las pruebas pasaron!":"💪 "+passed+"/"+t.tests.length+" pruebas pasaron")+'</h3></div>'
  +aiHtml
  +(allOk?'<button class="abtn green" onclick="finishPyLesson()">Continuar al cierre →</button>':'<p class="mut" style="margin-top:8px">Ajusta tu código e inténtalo de nuevo, o pide ayuda:</p>'+hintBtns);}
function showPyHint(){
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 const box=document.getElementById("pyhintbox");
 if(box)box.innerHTML='<div class="card"><h3>💡 Pista</h3><p style="margin-top:6px;line-height:1.5">'+esc(t.hint)+'</p></div>';}
function showPySolution(){
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 const box=document.getElementById("pyhintbox");
 if(box)box.innerHTML='<div class="card"><h3>👀 Solución</h3><pre class="pycode">'+esc(t.solution)+'</pre>'
  +'<button class="abtn" onclick="usePySolution()">📋 Usar esta solución</button></div>';}
function usePySolution(){
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 const ta=document.getElementById("pycode");
 if(ta)ta.value=t.solution;
 PY.code=t.solution;
 toast("Solución copiada al editor — toca ▶️ Ejecutar",true,1800);}
function finishPyLesson(){
 const st=pyTopicState(PY.topicId);st.done=true;
 prof().coins+=15;prof().xp+=20;touchDay().pyDone=true;save();
 setTheme("adulto");
 const idx=PY_TOPICS.findIndex(function(x){return x.id===PY.topicId;});
 const next=PY_TOPICS[idx+1];
 render(topbar("screenPyHub()")
  +'<div class="card center"><div style="font-size:3rem">🎉</div><h2>¡Tema completado!</h2>'
  +'<p style="margin-top:8px">'+(next?'Mañana: '+next.ic+' '+next.nm:'¡Completaste todo el curso de Python! 🏆')+'</p></div>'
  +'<button class="abtn" onclick="startMemoryFromPy()">🧠 Jugar memoria (términos de este tema)</button>'
  +'<button class="abtn green" onclick="screenPyHub()">Volver a temas</button>');}
function startMemoryFromPy(){
 const t=PY_TOPICS.find(function(x){return x.id===PY.topicId;});
 if(typeof startMemoryGame!=="function"||!t.terms)return toast("No disponible para este tema",false,1200);
 startMemoryGame(t.terms,{back:"screenPyHub()"});}
