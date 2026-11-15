"use strict";
/* ============ EXAMEN DEL COLE (temario de 2.º) + REGLA «PRIMERO EL EXAMEN» ============
   Pedido: «el niño tiene exámenes: solo permitir los demás contenidos si supera la parte de los exámenes».
   Temario: MATEMÁTICAS → sumas llevando, restas prestando, resolución de problemas (sumas y restas), escritura y lectura
   de números de 4 cifras. LENGUAJE → la oración, sujeto, predicado, verbo, uso de la mayúscula y tiempos verbales.
   Cada tema nuevo trae: una explicación corta con dibujos (se ve la primera vez y se puede repasar) + práctica de 8 preguntas.
   Todo se genera localmente (nunca por IA) porque necesita estructura exacta (columnas, oraciones partidas, conjugación).
   REGLA: mientras no se supere cada tema obligatorio (por defecto 80 %), el resto del menú queda con candado 🔒.
   Siempre abiertos: Examen, Calma (💙), Mi día y la Exposición. Los padres pueden cambiar el % o apagar la regla por hijo
   (Panel de padres), o desbloquear el día con el PIN. No aplica a perfiles de adolescentes. */

const EXAM_REQ=["sumallev","restapres","problemas","num4escr","num4lect","oracion","sujeto","predicado","verbo","mayuscula","tverbales"];
(function addUnits(){
 const sub=function(id){return EXAM_SUBJECTS.find(function(s){return s.id===id;});};
 const mate=sub("mate"),leng=sub("leng"),nat=sub("nat");
 const mk=function(id,nm,ic){return{id:id,nm:nm,ic:ic,req:true};};
 /* los dos que ya existían pasan a ser obligatorios y suben al principio */
 const old=function(s,id){const u=s.units.find(function(x){return x.id===id;});s.units=s.units.filter(function(x){return x!==u;});u.req=true;return u;};
 const sl=old(mate,"sumallev"),rp=old(mate,"restapres");
 mate.units=[sl,rp,mk("problemas","Problemas de sumas y restas","🧩"),mk("num4escr","Escribir números de 4 cifras","✍️"),mk("num4lect","Leer números de 4 cifras","📖")].concat(mate.units);
 leng.units=[mk("oracion","La oración","💬"),mk("sujeto","El sujeto","🧑"),mk("predicado","El predicado","🏃"),mk("verbo","El verbo","⚡"),mk("mayuscula","Uso de la mayúscula","🔠"),mk("tverbales","Tiempos verbales","⏳")].concat(leng.units);
 nat.units=[{id:"reinos",nm:"Reinos de la naturaleza",ic:"🌿"}].concat(nat.units);
})();

/* ---------- utilidades ---------- */
function exOpts(ans,wrongs,fmt){
 fmt=fmt||function(x){return String(x);};
 const seen={},out=[];seen[ans]=1;out.push(ans);
 shuffled(wrongs).forEach(function(w){if(out.length<4&&w!==ans&&w>=0&&!seen[w]){seen[w]=1;out.push(w);}});
 let g=0;while(out.length<4&&g++<40){const w=ans+(1+rnd(9))*(Math.random()<.5?-1:1)*(Math.random()<.5?1:10);if(w>=0&&!seen[w]){seen[w]=1;out.push(w);}}
 const ops=shuffled(out.map(fmt));return{ops:ops,a:ops.indexOf(fmt(ans))};}
function exCol(a,b,sig,say){
 const colWrongsAdd=function(x,y){let r=0,m=1,X=x,Y=y;while(X>0||Y>0){r+=((X%10+Y%10)%10)*m;m*=10;X=Math.floor(X/10);Y=Math.floor(Y/10);}return r;};
 const colWrongsSub=function(x,y){let r=0,m=1,X=x,Y=y;while(X>0||Y>0){r+=Math.abs(X%10-Y%10)*m;m*=10;X=Math.floor(X/10);Y=Math.floor(Y/10);}return r;};
 let ans=sig==="+"?a+b:a-b,mistake=sig==="+"?colWrongsAdd(a,b):colWrongsSub(a,b);if(mistake<10&&ans>=100)mistake=ans+10;
 const o=exOpts(ans,[mistake,ans+10,ans-10,ans+100,ans-100,ans+1,ans-1]);
 return{q:a+" "+(sig==="+"?"+":"−")+" "+b+" = ?",ops:o.ops,a:o.a,say:say||"",op:{a:a,b:b,sig:sig==="+"?"+":"−"}};}
function exHasCarry(a,b){let c=0;while(a>0||b>0){if((a%10)+(b%10)+c>=10)return true;c=0;a=Math.floor(a/10);b=Math.floor(b/10);}return false;}
function exHasBorrow(a,b){while(a>0||b>0){if((a%10)<(b%10))return true;a=Math.floor(a/10);b=Math.floor(b/10);}return false;}
function exNumEs(n){
 if(n<100)return numEs(n);
 const cen=["","ciento","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];
 if(n<1000){if(n===100)return"cien";const c=Math.floor(n/100),r=n%100;return cen[c]+(r?" "+numEs(r):"");}
 const k=Math.floor(n/1000),r=n%1000;
 const mil=k===1?"mil":numEs(k)+" mil";
 return mil+(r?" "+exNumEs(r):"");}
function exFmt4(n){return String(n);}

/* ---------- MATEMÁTICAS ---------- */
EXAM_BANK.sumallev=function(){
 let a,b,t=0;const big=Math.random()<.45,huge=Math.random()<.2;
 do{if(huge){a=1000+rnd(5000);b=1000+rnd(4000);}else if(big){a=100+rnd(800);b=100+rnd(800);}else{a=15+rnd(80);b=15+rnd(80);}t++;}while((!exHasCarry(a,b)||a+b>9999)&&t<200);
 return exCol(a,b,"+","");};
EXAM_BANK.restapres=function(){
 let a,b,t=0;const big=Math.random()<.45,huge=Math.random()<.2;
 do{if(huge){a=2000+rnd(7000);b=1000+rnd(a-1000);}else if(big){a=200+rnd(790);b=100+rnd(a-100);}else{a=31+rnd(68);b=11+rnd(a-11);}t++;}while((!exHasBorrow(a,b)||a<=b)&&t<200);
 return exCol(a,b,"-","");};
const EXP_NAMES=["Sofía","Mateo","Valentina","Samuel","Camila","Santiago","Luna","Tomás","Isabela","Emilio","Mariana","Daniel"];
const EXP_THINGS=[["canicas","una caja","f"],["cromos","un álbum","m"],["lápices","un estuche","m"],["galletas","una bandeja","f"],["calcomanías","un cuaderno","f"],["monedas","una alcancía","f"],["globos","una bolsa","m"],["libros","una repisa","m"],["flores","un jardín","f"],["manzanas","una canasta","f"]];
EXAM_BANK.problemas=function(){
 const nm=pick(EXP_NAMES),th=pick(EXP_THINGS),n2=pick(EXP_NAMES.filter(function(x){return x!==nm;})),big=Math.random()<.5;
 const C_=th[2]==="f"?"Cuántas":"Cuántos",c_=C_.toLowerCase();
 const A=big?100+rnd(400):12+rnd(60),B=big?40+rnd(200):6+rnd(30),C=big?20+rnd(90):4+rnd(15);
 const T=rnd(6);let q,ans,hint;
 if(T===0){q=nm+" tenía "+A+" "+th[0]+" y su abuela le regaló "+B+" más. ¿"+C_+" "+th[0]+" tiene ahora?";ans=A+B;hint="juntar → SUMA";}
 else if(T===1){q=nm+" tenía "+(A+B)+" "+th[0]+" y le regaló "+B+" a "+n2+". ¿"+C_+" "+th[0]+" le quedan?";ans=A;hint="le quedan → RESTA";}
 else if(T===2){q="En una caja hay "+(A+B)+" "+th[0]+" y en otra caja hay "+B+". ¿"+C_+" "+th[0]+" más hay en la primera caja?";ans=A;hint="cuántos más → RESTA";}
 else if(T===3){const x=big?200+rnd(300):20+rnd(40),y=big?120+rnd(200):15+rnd(30);q="En el colegio hay "+x+" niños y "+y+" niñas. ¿Cuántos estudiantes hay en total?";ans=x+y;hint="en total → SUMA";}
 else if(T===4){q="Para llenar "+th[1]+" se necesitan "+(A+B)+" "+th[0]+". "+nm+" ya tiene "+A+". ¿"+C_+" le faltan?";ans=B;hint="cuántos faltan → RESTA";}
 else{q=nm+" tenía "+A+" "+th[0]+". Compró "+B+" más y después regaló "+C+". ¿"+C_+" "+th[0]+" tiene al final?";ans=A+B-C;hint="primero SUMA y luego RESTA";}
 const o=exOpts(ans,[ans+10,ans-10,ans+C,ans-C,A+B+C,A,B,ans+1,ans-1]);
 return{q:q,ops:o.ops,a:o.a,say:q,tip:hint};};
const EXP_UNITS=["unidades","decenas","centenas","unidades de mil"];
EXAM_BANK.num4escr=function(){
 const T=rnd(3);
 let n=1000+rnd(8999);while(n%10===0&&Math.random()<.5)n=1000+rnd(8999);
 const d=[Math.floor(n/1000),Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];
 const wrongs=function(){const w=[];
  w.push(d[1]*1000+d[0]*100+d[2]*10+d[3]);w.push(d[0]*1000+d[2]*100+d[1]*10+d[3]);w.push(d[0]*1000+d[1]*100+d[3]*10+d[2]);
  w.push(d[0]*10000+d[1]*100+d[2]*10+d[3]);w.push(d[0]*1000+d[2]*10+d[3]);w.push(n+100);w.push(n-100);w.push(n+10);
  return w.filter(function(x){return x>=1000&&x<=9999&&x!==n;});};
 if(T===0){const o=exOpts(n,wrongs(),exFmt4);
  return{q:"¿Cómo se escribe con cifras? <b>"+exNumEs(n)+"</b>",ops:o.ops,a:o.a,say:exNumEs(n)};}
 if(T===1){const o=exOpts(n,wrongs(),exFmt4);
  return{q:"<b>"+(d[0]*1000)+" + "+(d[1]*100)+" + "+(d[2]*10)+" + "+d[3]+"</b> = ?",ops:o.ops,a:o.a,say:exNumEs(n)};}
 const vis='<div style="display:flex;justify-content:center;gap:12px;margin:8px 0 4px;flex-wrap:wrap">'
  +[["🟪","Unidades de mil",d[0]],["🟥","Centenas",d[1]],["🟦","Decenas",d[2]],["🟩","Unidades",d[3]]].map(function(x){return '<div><div style="font-size:.74rem;font-weight:700">'+x[1]+'</div><div style="font-size:1.25rem;line-height:1.25;min-width:70px">'+(x[2]?x[0].repeat(x[2]):"—")+'</div><div style="font-size:.8rem;font-weight:700">'+x[2]+'</div></div>';}).join("")+'</div>';
 const o=exOpts(n,wrongs(),exFmt4);
 return{q:vis+"¿Qué número representan los bloques?",ops:o.ops,a:o.a,say:"¿Qué número representan los bloques?"};};
EXAM_BANK.num4lect=function(){
 const T=rnd(4);
 let n=1000+rnd(8999);
 const d=[Math.floor(n/1000),Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];
 if(T===0){
  const wr=[];[n+100,n-100,n+10,n-10,n+1000,n-1000,d[0]*1000+d[2]*100+d[1]*10+d[3]].forEach(function(x){if(x>=1000&&x<=9999&&x!==n)wr.push(exNumEs(x));});
  const ans=exNumEs(n),seen={};seen[ans]=1;const out=[ans];shuffled(wr).forEach(function(w){if(out.length<4&&!seen[w]){seen[w]=1;out.push(w);}});
  const ops=shuffled(out);return{q:"¿Cómo se lee el número <b>"+n+"</b>?",ops:ops,a:ops.indexOf(ans),say:String(n)};}
 if(T===1){
  const pos=rnd(4),val=d[pos]*Math.pow(10,3-pos),nm=["unidades de mil","centenas","decenas","unidades"][pos];
  if(d[pos]===0){n+=Math.pow(10,3-pos);return EXAM_BANK.num4lect();}
  const o=exOpts(val,[d[pos],d[pos]*10,d[pos]*100,d[pos]*1000,d[pos]*Math.pow(10,2-pos>=0?2-pos:0)],String);
  return{q:"En el número <b>"+n+"</b>, ¿qué valor tiene la cifra <b>"+d[pos]+"</b>?",ops:o.ops,a:o.a,say:"En el número "+n+", ¿qué valor tiene la cifra "+d[pos]+"?"};}
 if(T===2){
  const pos=rnd(4),names=["las unidades de mil","las centenas","las decenas","las unidades"];
  const others=[0,1,2,3].filter(function(x){return x!==pos;}).map(function(x){return d[x];});
  let ans=d[pos];const set=[ans];others.forEach(function(x){if(set.indexOf(x)<0&&set.length<4)set.push(x);});let g=0;while(set.length<4&&g++<30){const r=rnd(10);if(set.indexOf(r)<0)set.push(r);}
  const ops=shuffled(set.map(String));
  return{q:"En el número <b>"+n+"</b>, ¿qué cifra está en <b>"+names[pos]+"</b>?",ops:ops,a:ops.indexOf(String(ans)),say:"En el número "+n+", ¿qué cifra está en "+names[pos]+"?"};}
 const k=exNumEs(n),wr=[n+1000,n-1000,n+100,n-100,n+10,n-10].filter(function(x){return x>=1000&&x<=9999;});
 const o=exOpts(n,wr,exFmt4);
 return{q:"¿Qué número es: <b>"+k+"</b>?",ops:o.ops,a:o.a,say:k};};

/* ---------- LENGUAJE: oración, sujeto, predicado, verbo ---------- */
const EXS_PERSON=["Mi mamá","La maestra","Mi hermano","Mi abuela","La niña","Los niños","Sofía y Camilo","Mis amigos","El profesor","Mi papá"];
const EXS_PERSON_PL=["Los niños","Sofía y Camilo","Mis amigos"];
const EXS_ANIMAL=["El perro","El caballo","Los gatos","La vaca","Los conejos"];
const EXS_ANIMAL_PL=["Los gatos","Los conejos"];
const EXS_FLY=["El pájaro","Las mariposas","La abeja","Las aves"];
const EXS_FLY_PL=["Las mariposas","Las aves"];
const EXS_PRED={
 person:[["juega","juegan","con la pelota"],["lee","leen","un libro nuevo"],["camina","caminan","hacia la escuela"],["escribe","escriben","en el cuaderno"],["pinta","pintan","un dibujo de colores"],["canta","cantan","una canción bonita"],["bebe","beben","agua fría"],["corre","corren","por el parque"]],
 animal:[["duerme","duermen","bajo el árbol"],["corre","corren","por el campo"],["bebe","beben","agua del río"],["salta","saltan","muy alto"],["come","comen","hierba fresca"]],
 fly:[["vuela","vuelan","sobre las flores"],["canta","cantan","en la rama"],["descansa","descansan","en el jardín"],["busca","buscan","su comida"]]};
function exSent(){
 const ty=pick(["person","person","animal","fly"]),S=ty==="person"?EXS_PERSON:ty==="animal"?EXS_ANIMAL:EXS_FLY,PL=ty==="person"?EXS_PERSON_PL:ty==="animal"?EXS_ANIMAL_PL:EXS_FLY_PL;
 const sj=pick(S),pr=pick(EXS_PRED[ty]),pl=PL.indexOf(sj)>=0;
 const verb=pl?pr[1]:pr[0],comp=pr[2];
 return{subj:sj,verb:verb,comp:comp,pred:verb+" "+comp,text:sj+" "+verb+" "+comp+"."};}
function exOtherWords(s,notThese){
 const words=(s.subj+" "+s.comp).split(" ").filter(function(w){return w.length>2&&notThese.indexOf(w)<0&&w!==s.verb;});return words;}
EXAM_BANK.oracion=function(){
 const T=rnd(5);
 if(T===0){const s=exSent(),bad=[s.subj+" de la",s.comp.charAt(0).toUpperCase()+s.comp.slice(1),"Con mi amiga en el"];
  const ops=shuffled([s.text].concat(bad));return{q:"¿Cuál de estas es una ORACIÓN (tiene sentido completo)?",ops:ops,a:ops.indexOf(s.text),say:"¿Cuál de estas es una oración?"};}
 if(T===1){const s=exSent(),words=(s.subj+" "+s.verb+" "+s.comp).split(" ");
  const bad1=shuffled(words).join(" ")+".",bad2=[words[words.length-1]].concat(words.slice(0,-1)).join(" ")+".";
  const ok=s.text,ops=shuffled([ok,bad1===ok?words.slice().reverse().join(" ")+".":bad1,bad2===ok?words.slice().reverse().join(" ")+".":bad2,words.slice(1).join(" ")+" "+words[0]+"."].filter(function(x,i,a){return a.indexOf(x)===i;}));
  while(ops.length<3)ops.push(words.slice().reverse().join(" ")+"!");
  return{q:"¿Cuál oración está bien ordenada?",ops:ops,a:ops.indexOf(ok),say:"¿Cuál oración está bien ordenada?"};}
 if(T===2)return pick([
  {q:"Una oración siempre empieza con…",ops:["Mayúscula","minúscula","un número","una coma"],a:0},
  {q:"Una oración termina con…",ops:["Punto (o signos de pregunta o exclamación)","una letra cualquiera","nada","una coma siempre"],a:0},
  {q:"Una oración nos dice algo con…",ops:["Sentido completo","Una sola palabra suelta","Palabras al revés","Letras sueltas"],a:0},
  {q:"Las dos partes de una oración son…",ops:["Sujeto y predicado","Inicio y fin","Verbo y punto","Nombre y apellido"],a:0}]);
 if(T===3){const a=exSent(),b=exSent();const ops=["1","2","3","4"];
  return{q:"¿Cuántas oraciones hay? <br><i>«"+a.text+" "+b.text+"»</i>",ops:ops,a:1,say:"¿Cuántas oraciones hay?"};}
 const s=exSent(),lowered=s.text.charAt(0).toLowerCase()+s.text.slice(1),nopoint=s.text.slice(0,-1);
 const ops=shuffled([s.text,lowered,nopoint,lowered.slice(0,-1)]);
 return{q:"¿Cuál oración está escrita correctamente?",ops:ops,a:ops.indexOf(s.text),say:"¿Cuál oración está escrita correctamente?"};};
EXAM_BANK.sujeto=function(){
 const T=rnd(5);
 if(T===4)return pick([
  {q:"El SUJETO de una oración es…",ops:["De quién o de qué se habla","Lo que se hace","El punto final","La última palabra"],a:0},
  {q:"Para encontrar el sujeto preguntamos…",ops:["¿Quién? o ¿Qué?","¿Cuándo termina?","¿Cuántas letras tiene?","¿Dónde está el punto?"],a:0},
  {q:"En «Los niños juegan», el sujeto es…",ops:["Los niños","juegan","Los","niños juegan"],a:0}]);
 const s=exSent(),extra=exOtherWords(s,s.subj.split(" "));
 const wrong=[s.pred,s.verb,extra.length?extra[extra.length-1]:s.comp].filter(function(x,i,a){return x&&x!==s.subj&&a.indexOf(x)===i;});
 const ops=shuffled([s.subj].concat(wrong).slice(0,4));
 return{q:"«"+s.text+"»<br>¿Cuál es el <b>SUJETO</b> (de quién se habla)?",ops:ops,a:ops.indexOf(s.subj),say:s.text+". ¿Cuál es el sujeto?"};};
EXAM_BANK.predicado=function(){
 const T=rnd(5);
 if(T===4)return pick([
  {q:"El PREDICADO de una oración es…",ops:["Lo que se dice o hace del sujeto","De quién se habla","La primera mayúscula","El título"],a:0},
  {q:"El predicado siempre tiene un…",ops:["Verbo","Punto en medio","Número","Dibujo"],a:0},
  {q:"En «Mi mamá cocina arroz», el predicado es…",ops:["cocina arroz","Mi mamá","Mi","arroz"],a:0}]);
 const s=exSent();
 const wrong=[s.subj,s.verb,s.subj+" "+s.verb].filter(function(x,i,a){return x!==s.pred&&a.indexOf(x)===i;});
 const ops=shuffled([s.pred].concat(wrong).slice(0,4));
 return{q:"«"+s.text+"»<br>¿Cuál es el <b>PREDICADO</b> (lo que se dice del sujeto)?",ops:ops,a:ops.indexOf(s.pred),say:s.text+". ¿Cuál es el predicado?"};};
const EXS_VERBS=["saltar","correr","cantar","dormir","escribir","comer","jugar","leer","pintar","caminar","beber","volar"];
const EXS_NOUNS=["mesa","casa","perro","flor","libro","escuela","sol","silla","árbol","luna"];
const EXS_ADJ=["bonito","grande","rojo","alegre","pequeño","suave"];
EXAM_BANK.verbo=function(){
 const T=rnd(5);
 if(T===0)return pick([
  {q:"El VERBO es la palabra que dice…",ops:["Una acción (lo que se hace)","El color","El nombre de alguien","Cuántos hay"],a:0},
  {q:"Los verbos en infinitivo terminan en…",ops:["-ar, -er, -ir","-a, -o","-ito, -ita","-mente"],a:0},
  {q:"¿Cuál de estos es un verbo en infinitivo?",ops:["cantar","cantante","canción","canto bonito"],a:0}]);
 if(T===1){const v=pick(EXS_VERBS),ops=shuffled([v].concat(shuffled(EXS_NOUNS).slice(0,2),[pick(EXS_ADJ)]));
  return{q:"¿Cuál de estas palabras es un <b>VERBO</b> (una acción)?",ops:ops,a:ops.indexOf(v),say:"¿Cuál de estas palabras es un verbo?"};}
 const s=exSent(),others=s.subj.split(" ").concat(s.comp.split(" ")).filter(function(w){return w.length>1&&w!==s.verb;});
 const pool=[];others.forEach(function(w){if(pool.indexOf(w)<0)pool.push(w);});
 const ops=shuffled([s.verb].concat(shuffled(pool).slice(0,3)));
 return{q:"«"+s.text+"»<br>¿Cuál es el <b>VERBO</b> (la acción)?",ops:ops,a:ops.indexOf(s.verb),say:s.text+". ¿Cuál es el verbo?"};};
const EXM_NAMES=["Laura","Mateo","Sofía","Samuel","Valentina","Camilo","Isabel","Andrés"];
const EXM_PLACES=["Bogotá","Medellín","Cali","Cartagena","Colombia","Barranquilla","Bucaramanga","Santa Marta"];
EXAM_BANK.mayuscula=function(){
 const T=rnd(6);
 if(T===0){const n=pick(EXM_NAMES),ops=shuffled(["Mi amiga se llama "+n+".","mi amiga se llama "+n.toLowerCase()+".","Mi amiga se llama "+n.toLowerCase()+".","mi amiga se llama "+n+"."]);
  const ok="Mi amiga se llama "+n+".";return{q:"¿Cuál oración está escrita correctamente?",ops:ops,a:ops.indexOf(ok),say:"¿Cuál oración está escrita correctamente?"};}
 if(T===1){const p=pick(EXM_PLACES),ok="Yo vivo en "+p+".",ops=shuffled([ok,"yo vivo en "+p+".","Yo vivo en "+p.toLowerCase()+".","Yo Vivo En "+p+"."]);
  return{q:"¿Cuál oración está escrita correctamente?",ops:ops,a:ops.indexOf(ok),say:"¿Cuál oración está escrita correctamente?"};}
 if(T===2){const n=pick(EXM_NAMES),w=["perro","gato","caballo","conejo"],a=pick(w),ops=shuffled([n.toLowerCase(),a,"se","llama"]);
  return{q:"«Mi "+a+" se llama "+n.toLowerCase()+".»<br>¿Qué palabra debe llevar <b>mayúscula</b> (además de «Mi»)?",ops:ops,a:ops.indexOf(n.toLowerCase()),say:"¿Qué palabra debe llevar mayúscula?"};}
 if(T===3)return pick([
  {q:"Usamos MAYÚSCULA al comenzar una oración y en…",ops:["Los nombres de personas y lugares","Todas las palabras","Los verbos","Los números"],a:0},
  {q:"Después de un punto, la siguiente palabra empieza con…",ops:["Mayúscula","minúscula","un número","coma"],a:0},
  {q:"Los nombres propios (Ana, Colombia, Bogotá) se escriben con…",ops:["Mayúscula inicial","minúscula","todo en mayúscula siempre","comillas"],a:0},
  {q:"¿Cuál nombre de ciudad está bien escrito?",ops:["Medellín","medellín","MEDELLÍN siempre","medeLLín"],a:0}]);
 if(T===4){const ok="Mi cumpleaños es el lunes.",ops=shuffled([ok,"Mi cumpleaños es el Lunes.","mi cumpleaños es el lunes.","Mi Cumpleaños Es El Lunes."]);
  return{q:"Los días de la semana van con minúscula (si no empiezan la oración). ¿Cuál está bien escrita?",ops:ops,a:ops.indexOf(ok),say:"¿Cuál está bien escrita?"};}
 const n=pick(EXM_NAMES),p=pick(EXM_PLACES),t=pick([n+" viaja a "+p+".",n+" nació en "+p+"."]),w=t.split(" ");
 const wrong=w.slice(0,1).concat(w.slice(1).map(function(x){return x.toLowerCase();})),bad=[t.toLowerCase(),t.charAt(0).toLowerCase()+t.slice(1),t.replace(n,n.toLowerCase())];
 const ops=shuffled([t].concat(bad.filter(function(x,i,a){return x!==t&&a.indexOf(x)===i;})).slice(0,4));
 return{q:"¿Cuál oración está escrita correctamente?",ops:ops,a:ops.indexOf(t),say:"¿Cuál oración está escrita correctamente?"};};
/* tiempos verbales: verbos regulares (los que cambian la raíz, como «jugar», se evitan) */
const EXV=[["cantar","ar"],["saltar","ar"],["bailar","ar"],["pintar","ar"],["caminar","ar"],["mirar","ar"],["estudiar","ar"],["lavar","ar"],["comer","er"],["correr","er"],["beber","er"],["aprender","er"],["vivir","ir"],["escribir","ir"],["subir","ir"],["partir","ir"]];
const EXV_PERS=[["yo",0],["tú",1],["él",2],["ella",2],["ellos",4]]; /* sin «nosotros»: en -ar/-ir canta­mos es igual en presente y pasado */
function exConj(inf,type,tense,p){
 const st=inf.slice(0,-2),e={ar:{pre:["o","as","a","amos","an"],pas:["é","aste","ó","amos","aron"],fut:["é","ás","á","emos","án"]},er:{pre:["o","es","e","emos","en"],pas:["í","iste","ió","imos","ieron"],fut:["é","ás","á","emos","án"]},ir:{pre:["o","es","e","imos","en"],pas:["í","iste","ió","imos","ieron"],fut:["é","ás","á","emos","án"]}}[type];
 if(tense==="fut")return inf+e.fut[p];
 return st+e[tense==="pre"?"pre":"pas"][p];}
const EXV_MARK={pas:["Ayer","Anoche","La semana pasada"],pre:["Hoy","Ahora","Todos los días"],fut:["Mañana","Pronto","El próximo año"]};
const EXV_NAME={pas:"Pasado",pre:"Presente",fut:"Futuro"};
EXAM_BANK.tverbales=function(){
 const T=rnd(4),v=pick(EXV),pp=pick(EXV_PERS),tense=pick(["pas","pre","fut"]);
 if(T===0)return pick([
  {q:"El tiempo que YA pasó se llama…",ops:["Pasado ⏪","Presente","Futuro","Mañana"],a:0},
  {q:"Lo que está pasando AHORA está en…",ops:["Presente ⏺️","Pasado","Futuro","Ayer"],a:0},
  {q:"Lo que va a pasar MÁS TARDE está en…",ops:["Futuro ⏩","Pasado","Presente","Antes"],a:0},
  {q:"¿Qué palabra nos avisa que algo es del pasado?",ops:["Ayer","Mañana","Pronto","Ahora"],a:0},
  {q:"¿Qué palabra nos avisa que algo es del futuro?",ops:["Mañana","Ayer","Anoche","Hace un rato"],a:0}]);
 if(T===1){const f=exConj(v[0],v[1],tense,pp[1]);
  const ops=["Pasado","Presente","Futuro"];
  return{q:"¿En qué tiempo está el verbo <b>«"+f+"»</b>?",ops:ops,a:ops.indexOf(EXV_NAME[tense]),say:"¿En qué tiempo está el verbo "+f+"?"};}
 if(T===2){const sj=pp[0],f=exConj(v[0],v[1],tense,pp[1]),sent=pick(EXV_MARK[tense])+" "+sj+" "+f+".";
  const ops=["Pasado","Presente","Futuro"];
  return{q:"«"+sent+"»<br>¿En qué tiempo está la oración?",ops:ops,a:ops.indexOf(EXV_NAME[tense]),say:sent+". ¿En qué tiempo está la oración?"};}
 const mk=pick(EXV_MARK[tense]),ok=exConj(v[0],v[1],tense,pp[1]),others=["pas","pre","fut"].filter(function(x){return x!==tense;}).map(function(x){return exConj(v[0],v[1],x,pp[1]);});
 const ops=shuffled([ok].concat(others));
 return{q:mk+" "+pp[0]+" ___ ("+v[0]+").<br>¿Cuál es la forma correcta?",ops:ops,a:ops.indexOf(ok),say:mk+" "+pp[0]+" ___. ¿Cuál es la forma correcta?"};};

/* ---------- NATURALES: reinos de la naturaleza ---------- */
EXAM_BANK.reinos=function(){return pick([
 {q:"Los seres vivos que se mueven, comen y tienen crías pertenecen al reino…",ops:["Animal 🐶","Mineral 💎","Vegetal 🌿","Ninguno"],a:0},
 {q:"Los seres vivos que fabrican su alimento con la luz del sol pertenecen al reino…",ops:["Vegetal 🌳","Animal","Mineral","Hongos"],a:0},
 {q:"Las rocas, la sal y el oro pertenecen al reino…",ops:["Mineral 💎","Animal","Vegetal","Hongos"],a:0},
 {q:"¿Cuál de estos es del reino ANIMAL?",ops:["El perro 🐕","El rosal 🌹","La roca 🪨","El champiñón 🍄"],a:0},
 {q:"¿Cuál de estos es del reino VEGETAL?",ops:["El árbol de mango 🥭","La vaca 🐮","El oro 🪙","El pez 🐟"],a:0},
 {q:"¿Cuál de estos es del reino MINERAL?",ops:["La sal 🧂","El gato 🐱","La margarita 🌼","La mariposa 🦋"],a:0},
 {q:"Los minerales NO son seres vivos porque…",ops:["No nacen, no crecen ni se reproducen","Son muy pequeños","Viven en el agua","Se mueven mucho"],a:0},
 {q:"Las plantas NECESITAN para vivir…",ops:["Sol, agua, aire y tierra ☀️💧","Solo dulces","Solo oscuridad","Nada"],a:0},
 {q:"¿Cuál es una parte de la planta?",ops:["La raíz 🌱","La cola","Las alas","Las escamas"],a:0},
 {q:"¿Qué parte de la planta la sostiene y la mantiene en la tierra?",ops:["La raíz","La flor","El fruto","La semilla"],a:0},
 {q:"¿Qué parte de la planta puede dar frutos y semillas?",ops:["La flor 🌸","La raíz","El tronco","La piedra"],a:0},
 {q:"Los animales necesitan para vivir…",ops:["Alimento, agua y aire 🍖💧","Solo sol","Solo tierra","Nada"],a:0},
 {q:"El champiñón 🍄 pertenece al reino de los…",ops:["Hongos","Animales","Minerales","Vegetales (plantas)"],a:0},
 {q:"Las bacterias son seres vivos tan pequeños que solo se ven con…",ops:["Un microscopio 🔬","Una regla","Una lupa de juguete","Los ojos"],a:0},
 {q:"¿Qué tienen en común los animales y las plantas?",ops:["Nacen, crecen, se reproducen y mueren","Se mueven de lugar","Fabrican su alimento","Son de piedra"],a:0},
 {q:"¿Cuál NO es un ser vivo?",ops:["La piedra 🪨","El gusano 🪱","La hormiga 🐜","El pasto 🌱"],a:0}]);};

/* ---------- explicaciones cortas (se ven la primera vez; se pueden repasar) ---------- */
const EXAM_LESSONS={
 sumallev:{t:"➕ Sumas llevando",say:"Cuando sumamos las unidades y el resultado es diez o más, escribimos las unidades abajo y llevamos una decena a la columna de al lado.",
  html:'<div class="excol-wrap"><div class="excol"><div class="excol-row" style="color:#2563EB;font-size:.9rem">&nbsp;1</div><div class="excol-row">&nbsp;&nbsp;4&nbsp;&nbsp;8</div><div class="excol-row"><span class="excol-sig">+</span>&nbsp;&nbsp;3&nbsp;&nbsp;7</div><div class="excol-line"></div><div class="excol-row">&nbsp;&nbsp;8&nbsp;&nbsp;5</div></div></div>'
   +'<ol style="line-height:1.7"><li>Empieza por las <b>unidades</b>: 8 + 7 = 15.</li><li>Escribe el <b>5</b> abajo y <b>lleva 1</b> a las decenas.</li><li>Suma las <b>decenas</b>: 4 + 3 + 1 (la que llevas) = 8.</li><li>Resultado: <b>85</b>.</li></ol><p>💡 Lo mismo pasa con centenas y unidades de mil: siempre de <b>derecha a izquierda</b>.</p>'},
 restapres:{t:"➖ Restas prestando",say:"Si el número de arriba es más pequeño que el de abajo, le pedimos prestada una decena al vecino de la izquierda. La decena vale diez unidades.",
  html:'<div class="excol-wrap"><div class="excol"><div class="excol-row" style="color:#DC2626;font-size:.9rem">&nbsp;3&nbsp;&nbsp;<span>12</span></div><div class="excol-row">&nbsp;&nbsp;<s>4</s>&nbsp;&nbsp;<s>2</s></div><div class="excol-row"><span class="excol-sig">−</span>&nbsp;&nbsp;1&nbsp;&nbsp;7</div><div class="excol-line"></div><div class="excol-row">&nbsp;&nbsp;2&nbsp;&nbsp;5</div></div></div>'
   +'<ol style="line-height:1.7"><li>2 − 7 no se puede: ¡el de arriba es más chiquito!</li><li><b>Pide prestada</b> 1 decena al 4: el 4 queda en <b>3</b> y el 2 se vuelve <b>12</b>.</li><li>12 − 7 = <b>5</b>. Luego 3 − 1 = <b>2</b>.</li><li>Resultado: <b>25</b>.</li></ol><p>💡 Comprueba sumando: 25 + 17 = 42 ✅</p>'},
 problemas:{t:"🧩 Problemas de sumas y restas",say:"Lee el problema con calma. Busca las palabras clave. En total, juntar y regalar más suman. Quedan, faltan y cuántos más restan.",
  html:'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div style="background:#DCFCE7;border-radius:14px;padding:10px"><b>➕ SUMAR</b><br>en total · juntar · agregar · le regalaron · compró más · ahora tiene</div><div style="background:#FEE2E2;border-radius:14px;padding:10px"><b>➖ RESTAR</b><br>quedan · faltan · perdió · regaló · cuántos más · diferencia</div></div>'
   +'<ol style="line-height:1.7;margin-top:8px"><li><b>Lee</b> todo el problema.</li><li><b>Subraya</b> los números y la pregunta.</li><li>Elige: ¿<b>suma</b> o <b>resta</b>?</li><li>Resuelve y <b>responde</b> con una frase.</li></ol><p>💡 Si hay dos pasos, resuélvelos uno por uno.</p>'},
 num4escr:{t:"✍️ Escribir números de 4 cifras",say:"Un número de cuatro cifras tiene unidades de mil, centenas, decenas y unidades. Escribimos cada cifra en su lugar y usamos cero cuando falta una.",
  html:'<table style="margin:0 auto;border-collapse:collapse;text-align:center;font-weight:700"><tr style="font-size:.8rem"><td style="padding:4px 8px;background:#EDE9FE">Unidades de mil</td><td style="padding:4px 8px;background:#FEE2E2">Centenas</td><td style="padding:4px 8px;background:#DBEAFE">Decenas</td><td style="padding:4px 8px;background:#DCFCE7">Unidades</td></tr><tr style="font-size:1.8rem"><td>3</td><td>4</td><td>0</td><td>7</td></tr></table>'
   +'<p style="text-align:center;margin:8px 0"><b>3 407</b> = 3000 + 400 + 0 + 7</p><p>Se dice: <b>tres mil cuatrocientos siete</b>.</p><p>💡 Cuando en el nombre no se dice una parte (ej. «decenas»), ahí va un <b>0</b>. En el colegio a veces lo ves como 3.407: es el mismo número.</p>'},
 num4lect:{t:"📖 Leer números de 4 cifras",say:"Para leer un número de cuatro cifras, primero decimos los miles, luego las centenas, decenas y unidades.",
  html:'<p style="text-align:center;font-size:1.6rem;font-weight:800;margin:4px 0">5 284</p><p style="text-align:center"><b>cinco mil</b> · <b>doscientos</b> · <b>ochenta y cuatro</b></p>'
   +'<ul style="line-height:1.7"><li>El <b>5</b> vale 5000 (cinco unidades de mil).</li><li>El <b>2</b> vale 200 (dos centenas).</li><li>El <b>8</b> vale 80 (ocho decenas).</li><li>El <b>4</b> vale 4 (cuatro unidades).</li></ul><p>💡 El <b>valor</b> de una cifra depende del lugar donde está.</p>'},
 oracion:{t:"💬 La oración",say:"Una oración es un grupo de palabras con sentido completo. Empieza con mayúscula y termina con punto. Tiene dos partes: sujeto y predicado.",
  html:'<div style="background:#EEF2FF;border-radius:14px;padding:12px;text-align:center;font-size:1.15rem"><b>El perro corre por el parque.</b></div>'
   +'<ul style="line-height:1.7;margin-top:8px"><li>✅ Tiene <b>sentido completo</b>.</li><li>🔠 Empieza con <b>mayúscula</b>.</li><li>🔚 Termina con <b>punto</b>.</li><li>🧩 Tiene <b>sujeto</b> y <b>predicado</b>.</li></ul><p>❌ «El perro de la» no es una oración: le falta algo.</p>'},
 sujeto:{t:"🧑 El sujeto",say:"El sujeto es de quién o de qué se habla en la oración. Para encontrarlo preguntamos: ¿quién?",
  html:'<div style="text-align:center;font-size:1.2rem;line-height:2"><span style="background:#FEF08A;padding:4px 8px;border-radius:10px;font-weight:800">Mi mamá</span> cocina arroz.</div>'
   +'<ul style="line-height:1.7;margin-top:8px"><li>Pregunta: <b>¿Quién cocina arroz?</b></li><li>Respuesta: <b>Mi mamá</b> → ese es el <b>sujeto</b>.</li></ul><p>💡 El sujeto puede ser una persona, un animal o una cosa: <i>El perro</i>, <i>Los niños</i>, <i>La luna</i>.</p>'},
 predicado:{t:"🏃 El predicado",say:"El predicado es lo que se dice o lo que hace el sujeto. Siempre tiene un verbo.",
  html:'<div style="text-align:center;font-size:1.2rem;line-height:2">Mi mamá <span style="background:#BBF7D0;padding:4px 8px;border-radius:10px;font-weight:800">cocina arroz.</span></div>'
   +'<ul style="line-height:1.7;margin-top:8px"><li>Pregunta: <b>¿Qué hace mi mamá?</b></li><li>Respuesta: <b>cocina arroz</b> → ese es el <b>predicado</b>.</li></ul><p>💡 Oración = <span style="background:#FEF08A;padding:0 6px;border-radius:6px">sujeto</span> + <span style="background:#BBF7D0;padding:0 6px;border-radius:6px">predicado</span></p>'},
 verbo:{t:"⚡ El verbo",say:"El verbo es la palabra que dice la acción: lo que alguien hace. Por ejemplo correr, comer, saltar.",
  html:'<div style="text-align:center;font-size:1.2rem;line-height:2">Los niños <span style="background:#FBCFE8;padding:4px 8px;border-radius:10px;font-weight:800">juegan</span> en el parque.</div>'
   +'<ul style="line-height:1.7;margin-top:8px"><li>El verbo dice <b>qué hacen</b>: juegan.</li><li>En infinitivo termina en <b>-ar, -er, -ir</b>: jug<b>ar</b>, com<b>er</b>, viv<b>ir</b>.</li></ul><p>💡 Truco: si puedes decir «yo ___» o «ellos ___», ¡es un verbo! (yo salto, ellos comen).</p>'},
 mayuscula:{t:"🔠 Uso de la mayúscula",say:"Usamos mayúscula al empezar una oración, después de un punto, y en los nombres de personas, ciudades y países.",
  html:'<ul style="line-height:1.9;font-size:1.02rem"><li>🔠 Al <b>empezar</b> una oración: <b>M</b>i casa es azul.</li><li>🔠 Después de un <b>punto</b>: Hoy llovió. <b>A</b>yer no.</li><li>🔠 Nombres de <b>personas</b>: <b>L</b>aura, <b>M</b>ateo.</li><li>🔠 Nombres de <b>lugares</b>: <b>B</b>ogotá, <b>C</b>olombia.</li></ul><p>💡 Los días y los meses van con <b>minúscula</b>: el lunes, en marzo.</p>'},
 tverbales:{t:"⏳ Tiempos verbales",say:"Los verbos cambian según cuándo pasa la acción. Si ya pasó es pasado, si pasa ahora es presente, y si va a pasar es futuro.",
  html:'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center"><div style="background:#FEE2E2;border-radius:12px;padding:8px"><b>⏪ Pasado</b><br>Ayer<br><b>canté</b></div><div style="background:#DCFCE7;border-radius:12px;padding:8px"><b>⏺️ Presente</b><br>Hoy<br><b>canto</b></div><div style="background:#DBEAFE;border-radius:12px;padding:8px"><b>⏩ Futuro</b><br>Mañana<br><b>cantaré</b></div></div>'
   +'<p style="margin-top:8px">Más ejemplos con <b>comer</b>: <i>comí</i> (pasado) · <i>como</i> (presente) · <i>comeré</i> (futuro).</p><p>💡 Las palabras <b>ayer, hoy, mañana</b> te ayudan a saber el tiempo.</p>'},
 reinos:{t:"🌿 Reinos de la naturaleza",say:"La naturaleza se organiza en reinos. El reino animal, el reino vegetal y el reino mineral. Los animales y las plantas son seres vivos. Los minerales no.",
  html:'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center"><div style="background:#FEE2E2;border-radius:12px;padding:8px"><div style="font-size:2rem">🐶🐟</div><b>Animal</b><br><span style="font-size:.78rem">se mueve, come y tiene crías</span></div><div style="background:#DCFCE7;border-radius:12px;padding:8px"><div style="font-size:2rem">🌳🌹</div><b>Vegetal</b><br><span style="font-size:.78rem">fabrica su alimento con el sol</span></div><div style="background:#E0E7FF;border-radius:12px;padding:8px"><div style="font-size:2rem">🪨💎</div><b>Mineral</b><br><span style="font-size:.78rem">no tiene vida</span></div></div>'
  }};

function examLessonSeen(uid){const e=examState();if(!e.seen)e.seen={};return !!e.seen[uid];}
function examLessonFirst(uid){if(!EXAM_LESSONS[uid]||examLessonSeen(uid))return false;examLesson(uid);return true;}
function examLesson(uid){setTheme("kid");
 const L=EXAM_LESSONS[uid];if(!L){startExamUnit(uid);return;}
 render(topbar("screenExam()")
  +'<h2 style="font-size:clamp(1.25rem,5.5vw,1.55rem);text-align:center;margin-bottom:8px">'+L.t+'</h2>'
  +'<div class="card" style="line-height:1.55">'+L.html+'</div>'
  +'<button class="speaker small" style="margin:6px auto;display:block" onclick="speakFast('+jsStr(L.say)+')">🔊 Escuchar la explicación</button>'
  +'<button class="kbtn green" onclick="examLessonDone(\''+uid+'\')">✏️ ¡A practicar!</button>');
 setTimeout(function(){try{speakFast(L.say);}catch(e){}},500);}
function examLessonDone(uid){const e=examState();if(!e.seen)e.seen={};e.seen[uid]=1;save();startExamUnit(uid);}

/* ---------- la regla ---------- */
function examRuleOf(p){
 if(!p||(p.type&&p.type!=="kid"))return{on:false,thr:70};
 const r=p.examRule;return{on:!!(r&&r.on===true),thr:(r&&r.thr)||70};} /* apagada por defecto: Katerine pidió quitar el bloqueo (15-nov-2026) */
function examReqOf(p){
 const u=(p&&p.exam&&p.exam.units)||{},thr=examRuleOf(p).thr;
 return EXAM_REQ.map(function(id){const un=examAllUnits().find(function(x){return x.id===id;}),b=(u[id]&&u[id].best)||0;return{id:id,u:un,best:b,tries:(u[id]&&u[id].tries)||0,ok:b>=thr};});}
function examPassed(p){return examReqOf(p||prof()).every(function(x){return x.ok;});}
function examLocked(){const p=prof();if(!p)return false;const r=examRuleOf(p);if(!r.on)return false;if(p.examUnlockDay===todayStr())return false;return !examPassed(p);}
function examGo(fn){if(examLocked()){screenExamLock();return;}if(typeof window[fn]==="function")window[fn]();}
function examExempt(onclick){return /screenExam\(|screenCalm\(|screenRoutine\(|screenExpo|openWorld\('expo/.test(String(onclick));}
function examHubCardHTML(){
 const p=prof(),r=examRuleOf(p);if(!r.on)return"";
 const st=examReqOf(p),done=st.filter(function(x){return x.ok;}).length,pct=Math.round(done/st.length*100);
 if(examPassed(p))return '<div class="card" style="margin-top:10px;padding:10px 14px;background:linear-gradient(135deg,#DCFCE7,#ECFEFF);display:flex;align-items:center;gap:10px"><span style="font-size:1.8rem">🎓</span><span style="flex:1;font-size:.92rem"><b>¡Examen superado!</b> Todo el contenido está abierto.</span></div>';
 const next=st.find(function(x){return !x.ok;});
 return '<div class="card" style="margin-top:10px;padding:14px;background:linear-gradient(135deg,#FEF3C7,#FCE7F3);border:3px solid #F59E0B"><div style="display:flex;align-items:center;gap:12px"><span style="font-size:2.4rem">📝</span><span style="flex:1"><b style="font-size:1.1rem">Primero, el examen del cole</b><br><span style="font-size:.85rem">Supera los '+st.length+' temas (≥ '+r.thr+'%) y se abre todo lo demás 🔓</span></span></div>'
  +'<div style="height:14px;border-radius:10px;background:#fff;border:3px solid var(--kid-ink);overflow:hidden;margin:10px 0 4px"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#22C55E,#16A34A)"></div></div>'
  +'<div style="font-size:.85rem;margin-bottom:8px">✅ '+done+' de '+st.length+' temas superados'+(next?' · Siguiente: <b>'+next.u.nm+'</b>':'')+'</div>'
  +'<button class="kbtn green" style="margin:0" onclick="'+(next?"startExamUnit('"+next.id+"')":"screenExam()")+'">📝 '+(done?'Seguir con el examen':'Empezar el examen')+'</button></div>';}
function screenExamLock(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 const p=prof(),r=examRuleOf(p),st=examReqOf(p),done=st.filter(function(x){return x.ok;}).length;
 render(topbar("screenKidMap()")
  +'<div class="card center" style="padding:18px 16px"><div style="font-size:3.4rem">🔒</div><h2 style="font-size:clamp(1.25rem,5.5vw,1.55rem);margin:4px 0">Primero el examen del cole</h2>'
  +'<p style="font-size:.98rem;line-height:1.5">Esto se abre cuando superes los temas del examen (con <b>'+r.thr+'%</b> o más en cada uno). ¡Tú puedes! 💪</p></div>'
  +'<div class="card" style="padding:10px 12px"><b>✅ '+done+' de '+st.length+' temas superados</b>'
  +st.map(function(x){return '<button onclick="startExamUnit(\''+x.id+'\')" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:2px solid '+(x.ok?"#86EFAC":"#E2E8F0")+';background:'+(x.ok?"#F0FDF4":"#fff")+';border-radius:14px;padding:8px 10px;margin-top:6px;cursor:pointer;font-size:.95rem;color:#1E293B"><span style="font-size:1.4rem">'+x.u.ic+'</span><span style="flex:1;font-weight:700">'+x.u.nm+'</span><span style="font-weight:800;color:'+(x.ok?"#16A34A":"#64748B")+'">'+(x.ok?"✅ "+x.best+"%":(x.tries?x.best+"%":"nuevo"))+'</span></button>';}).join("")+'</div>'
  +'<button class="kbtn green" onclick="screenExam()">📝 Ir al examen</button>'
  +'<details style="margin-top:8px"><summary style="cursor:pointer;font-weight:700;color:#64748B">👨‍👩‍👧 Papá o mamá: desbloquear por hoy</summary><div class="card" style="margin-top:6px"><input type="password" id="exPin" inputmode="numeric" placeholder="PIN de papá o mamá" style="margin-bottom:6px"><button class="kbtn white" style="margin:0;min-height:44px" onclick="examParentUnlock()">🔓 Desbloquear hoy</button><div id="exPinFb" class="mut" style="font-size:.85rem;margin-top:4px"></div></div></details>');}
function examParentUnlock(){
 const v=(document.getElementById("exPin")||{}).value;
 if(v&&v===S.pin){const p=prof();p.examUnlockDay=todayStr();save();toast("🔓 Desbloqueado por hoy",true,1600);screenKidMap();}
 else{const f=document.getElementById("exPinFb");if(f)f.textContent="PIN incorrecto";}}
function examBannerHTML(){
 const p=prof(),r=examRuleOf(p);if(!r.on)return"";
 const st=examReqOf(p),done=st.filter(function(x){return x.ok;}).length;
 return '<div class="card" style="padding:10px 14px;margin-bottom:10px;background:'+(done===st.length?"#DCFCE7":"#FEF9C3")+';font-size:.92rem;line-height:1.45">'+(done===st.length?'🎓 <b>¡Superaste todos los temas del cole!</b> El resto de la app está abierto.':'📌 Los temas con <b>📌</b> son los del examen del cole. Supera los <b>'+st.length+'</b> con '+r.thr+'% o más para abrir lo demás 🔓 <b>('+done+'/'+st.length+')</b>')+'</div>';}
function setExamRule(id,val){
 const p=S.profiles&&S.profiles[id];if(!p)return;
 if(val==="off")p.examRule={on:false,thr:80};else p.examRule={on:true,thr:parseInt(val,10)||80};save();
 toast("Regla del examen guardada ✓",true,1400);}

/* ============ NIVELES (el examen se adapta al niño: de 6 años a lo que pide el cole) ============
   Feedback (1-nov-2026): «las preguntas están fuertes para un niño de 6 años». Ahora cada tema tiene 3 niveles:
     ⭐ Nivel 1 = calentamiento MUY fácil (números chicos, 3 opciones, oraciones cortas). No cuenta para superar el tema.
     ⭐⭐ Nivel 2 = lo que pide el cole, pero suave. Superarlo (≥ % de la regla) cuenta como TEMA SUPERADO.
     ⭐⭐⭐ Nivel 3 = reto (el nivel anterior más difícil).
   Con ≥ % se sube de nivel; con menos de 50 % se baja uno. Empieza siempre en el nivel 1. */
function exLevel(uid){const e=examState();if(!e.lvl)e.lvl={};return Math.max(1,Math.min(3,e.lvl[uid]||1));}
function exLeveled(uid){return EXAM_REQ.indexOf(uid)>=0||uid==="reinos";}
/* deja solo n opciones (siempre la correcta) */
function exTrimOps(it,n){
 if(!it||!it.ops||it.ops.length<=n)return it;
 const ok=it.ops[it.a],wrong=shuffled(it.ops.filter(function(_,i){return i!==it.a;})).slice(0,n-1);
 const ops=shuffled([ok].concat(wrong));it.ops=ops;it.a=ops.indexOf(ok);return it;}
function exBadge(u,sc,st){
 if(!exLeveled(u.id))return sc.tries?sc.best+"% "+st:"¡Nuevo!";
 const l=exLevel(u.id),stars="⭐".repeat(l);
 if(u.req&&sc.best>=examRuleOf(prof()).thr)return"✅ "+sc.best+"%";
 return sc.tries?stars+" nivel "+l:"¡Nuevo!";}

/* ---- Matemáticas ---- */
const _sumOld=EXAM_BANK.sumallev,_resOld=EXAM_BANK.restapres,_probOld=EXAM_BANK.problemas,_escOld=EXAM_BANK.num4escr,_lecOld=EXAM_BANK.num4lect;
EXAM_BANK.sumallev=function(l){
 l=l||1;if(l>=3)return _sumOld();
 let a,b,t=0;
 do{if(l===1){a=8+rnd(20);b=3+rnd(9);}else{a=15+rnd(65);b=12+rnd(60);}t++;}while((!exHasCarry(a,b)||(l===1?a+b>40:a+b>120))&&t<300);
 const it=exCol(a,b,"+","");return l===1?exTrimOps(it,3):it;};
EXAM_BANK.restapres=function(l){
 l=l||1;if(l>=3)return _resOld();
 let a,b,t=0;
 do{if(l===1){a=12+rnd(25);b=3+rnd(18);}else{a=31+rnd(68);b=11+rnd(a-11);}t++;}while((!exHasBorrow(a,b)||a<=b)&&t<300);
 const it=exCol(a,b,"-","");return l===1?exTrimOps(it,3):it;};
EXAM_BANK.problemas=function(l){
 l=l||1;if(l>=3)return _probOld();
 const nm=pick(EXP_NAMES),th=pick(EXP_THINGS),n2=pick(EXP_NAMES.filter(function(x){return x!==nm;}));
 const C_=th[2]==="f"?"Cuántas":"Cuántos";
 const A=l===1?5+rnd(8):15+rnd(35),B=l===1?2+rnd(5):6+rnd(20);
 const T=l===1?pick([0,1,0,1,3]):rnd(5);let q,ans,hint;
 if(T===0){q=nm+" tenía "+A+" "+th[0]+". Su abuela le regaló "+B+" más. ¿"+C_+" "+th[0]+" tiene ahora?";ans=A+B;hint="le regalaron más → SUMA";}
 else if(T===1){q=nm+" tenía "+(A+B)+" "+th[0]+". Le regaló "+B+" a "+n2+". ¿"+C_+" "+th[0]+" le quedan?";ans=A;hint="le quedan → RESTA";}
 else if(T===2){q="En una caja hay "+(A+B)+" "+th[0]+" y en otra caja hay "+B+". ¿"+C_+" "+th[0]+" más hay en la primera caja?";ans=A;hint="cuántos más → RESTA";}
 else if(T===3){q="En el salón hay "+A+" niños y "+B+" niñas. ¿Cuántos estudiantes hay en total?";ans=A+B;hint="en total → SUMA";}
 else{q="Para llenar "+th[1]+" se necesitan "+(A+B)+" "+th[0]+". "+nm+" ya tiene "+A+". ¿"+C_+" le faltan?";ans=B;hint="cuántos faltan → RESTA";}
 const o=exOpts(ans,[ans+1,ans-1,ans+10,ans-10,A,B,A+B+1]);
 const it={q:q,ops:o.ops,a:o.a,say:q,tip:hint};return l===1?exTrimOps(it,3):it;};
EXAM_BANK.num4escr=function(l){
 l=l||1;if(l>=3)return _escOld();
 let n;
 if(l===1)n=(1+rnd(9))*1000+rnd(10)*100;else{n=(1+rnd(9))*1000+rnd(10)*100+rnd(10)*10;}
 const d=[Math.floor(n/1000),Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];
 const wr=[n+100,n-100,n+1000,n-1000,d[1]*1000+d[0]*100+d[2]*10,d[0]*10000+d[1]*100+d[2]*10,n+10,n-10].filter(function(x){return x>=1000&&x<=9999&&x!==n;});
 const T=l===1?pick([0,0,1]):rnd(3);
 if(T===0){const o=exOpts(n,wr,exFmt4);const it={q:"¿Cómo se escribe con cifras? <b>"+exNumEs(n)+"</b>",ops:o.ops,a:o.a,say:exNumEs(n)};return l===1?exTrimOps(it,3):it;}
 if(T===1&&(d[1]+d[2]+d[3]===0)){const o=exOpts(n,wr,exFmt4);const it={q:"¿Cómo se escribe con cifras? <b>"+exNumEs(n)+"</b>",ops:o.ops,a:o.a,say:exNumEs(n)};return l===1?exTrimOps(it,3):it;}
 if(T===1){const o=exOpts(n,wr,exFmt4);const parts=[d[0]*1000,d[1]*100,d[2]*10,d[3]].filter(function(x){return x>0;});
  const it={q:"<b>"+parts.join(" + ")+"</b> = ?",ops:o.ops,a:o.a,say:exNumEs(n)};return l===1?exTrimOps(it,3):it;}
 const vis='<div style="display:flex;justify-content:center;gap:12px;margin:8px 0 4px;flex-wrap:wrap">'
  +[["🟪","Unidades de mil",d[0]],["🟥","Centenas",d[1]],["🟦","Decenas",d[2]],["🟩","Unidades",d[3]]].filter(function(x,i){return l>=2||i<2;}).map(function(x){return '<div><div style="font-size:.74rem;font-weight:700">'+x[1]+'</div><div style="font-size:1.25rem;line-height:1.25;min-width:70px">'+(x[2]?x[0].repeat(x[2]):"—")+'</div><div style="font-size:.8rem;font-weight:700">'+x[2]+'</div></div>';}).join("")+'</div>';
 const o=exOpts(n,wr,exFmt4);const it={q:vis+"¿Qué número representan los bloques?",ops:o.ops,a:o.a,say:"¿Qué número representan los bloques?"};return l===1?exTrimOps(it,3):it;};
EXAM_BANK.num4lect=function(l){
 l=l||1;if(l>=3)return _lecOld();
 let n=l===1?(1+rnd(9))*1000+rnd(10)*100:(1+rnd(9))*1000+rnd(10)*100+rnd(10)*10;
 const d=[Math.floor(n/1000),Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];
 const T=l===1?pick([0,0,1]):rnd(3);
 if(T===0){
  const wr=[n+100,n-100,n+1000,n-1000,n+10,n-10].filter(function(x){return x>=1000&&x<=9999&&x!==n;}).map(exNumEs);
  const ans=exNumEs(n),seen={};seen[ans]=1;const out=[ans];shuffled(wr).forEach(function(w){if(out.length<4&&!seen[w]){seen[w]=1;out.push(w);}});
  const ops=shuffled(out);const it={q:"¿Cómo se lee el número <b>"+n+"</b>?",ops:ops,a:ops.indexOf(ans),say:String(n)};return l===1?exTrimOps(it,3):it;}
 if(T===1){
  const val=d[0]*1000,o=exOpts(val,[d[0],d[0]*10,d[0]*100,d[0]*10000],String);
  const it={q:"En el número <b>"+n+"</b>, ¿qué valor tiene la cifra <b>"+d[0]+"</b>?",ops:o.ops,a:o.a,say:"En el número "+n+", ¿qué valor tiene la cifra "+d[0]+"?"};return l===1?exTrimOps(it,3):it;}
 const k=exNumEs(n),wr=[n+1000,n-1000,n+100,n-100,n+10,n-10].filter(function(x){return x>=1000&&x<=9999;});
 const o=exOpts(n,wr,exFmt4);return{q:"¿Qué número es: <b>"+k+"</b>?",ops:o.ops,a:o.a,say:k};};

/* ---- Lenguaje ---- */
const _orOld=EXAM_BANK.oracion,_suOld=EXAM_BANK.sujeto,_prOld=EXAM_BANK.predicado,_veOld=EXAM_BANK.verbo,_maOld=EXAM_BANK.mayuscula,_tvOld=EXAM_BANK.tverbales,_reOld=EXAM_BANK.reinos;
function exSentShort(){
 const ty=pick(["person","person","animal","fly"]),S=ty==="person"?EXS_PERSON:ty==="animal"?EXS_ANIMAL:EXS_FLY,PL=ty==="person"?EXS_PERSON_PL:ty==="animal"?EXS_ANIMAL_PL:EXS_FLY_PL;
 const sj=pick(S),pr=pick(EXS_PRED[ty]),pl=PL.indexOf(sj)>=0,verb=pl?pr[1]:pr[0];
 return{subj:sj,verb:verb,comp:"",pred:verb,text:sj+" "+verb+"."};}
EXAM_BANK.oracion=function(l){
 l=l||1;if(l>=3)return _orOld();
 const T=l===1?pick([0,0,2,4]):pick([0,1,2,4]);
 if(T===2)return exTrimOps(pick([
  {q:"Una oración siempre empieza con…",ops:["Mayúscula","minúscula","un número","una coma"],a:0},
  {q:"Una oración termina con…",ops:["Punto (.)","un número","una letra cualquiera","nada"],a:0},
  {q:"Una oración nos dice algo con…",ops:["Sentido completo","Una sola letra","Palabras al revés","Dibujos"],a:0}]),3);
 const s=l===1?exSentShort():exSent();
 if(T===0){const bad=[s.subj+" de la",s.subj,"Con mi amiga en el"];
  const ops=shuffled([s.text].concat(bad)).slice(0,4);if(ops.indexOf(s.text)<0)ops[0]=s.text;const a=shuffled(ops);
  return exTrimOps({q:"¿Cuál de estas es una ORACIÓN (dice algo completo)?",ops:a,a:a.indexOf(s.text),say:"¿Cuál de estas es una oración?"},l===1?3:4);}
 if(T===1){const words=(s.subj+" "+s.verb+(s.comp?" "+s.comp:"")).split(" ");
  const bad1=words.slice().reverse().join(" ")+".",bad2=[words[words.length-1]].concat(words.slice(0,-1)).join(" ")+".";
  const ops=shuffled([s.text,bad1,bad2].filter(function(x,i,ar){return ar.indexOf(x)===i;}));
  return{q:"¿Cuál oración está bien ordenada?",ops:ops,a:ops.indexOf(s.text),say:"¿Cuál oración está bien ordenada?"};}
 const lowered=s.text.charAt(0).toLowerCase()+s.text.slice(1),nopoint=s.text.slice(0,-1);
 const ops=shuffled([s.text,lowered,nopoint]);
 return{q:"¿Cuál oración está escrita correctamente?",ops:ops,a:ops.indexOf(s.text),say:"¿Cuál oración está escrita correctamente?"};};
EXAM_BANK.sujeto=function(l){
 l=l||1;if(l>=3)return _suOld();
 if(l===1){
  if(Math.random()<.25)return exTrimOps(pick([
   {q:"El SUJETO es…",ops:["De quién se habla","Lo que se hace","El punto","La última letra"],a:0},
   {q:"En «Los niños juegan», el sujeto es…",ops:["Los niños","juegan","niños juegan","el punto"],a:0}]),3);
  const s=exSentShort(),ops=shuffled([s.subj,s.verb,s.subj.split(" ").slice(-1)[0]+" "+s.verb].filter(function(x,i,a){return a.indexOf(x)===i;}));
  while(ops.length<4){const w=pick(EXS_NOUNS);if(ops.indexOf(w)<0)ops.push(w);}
  return{q:"«"+s.text+"»<br>¿De quién se habla? (el <b>SUJETO</b>)",ops:ops,a:ops.indexOf(s.subj),say:s.text+". ¿Cuál es el sujeto?"};}
 return exTrimOps(_suOld(),3);};
EXAM_BANK.predicado=function(l){
 l=l||1;if(l>=3)return _prOld();
 if(l===1){
  if(Math.random()<.25)return exTrimOps(pick([
   {q:"El PREDICADO es…",ops:["Lo que hace el sujeto","De quién se habla","La mayúscula","El título"],a:0},
   {q:"En «Mi mamá cocina», el predicado es…",ops:["cocina","Mi mamá","Mi","mamá cocina"],a:0}]),3);
  const s=exSentShort(),ops=shuffled([s.verb,s.subj,s.subj.split(" ").slice(0,1)[0]].filter(function(x,i,a){return a.indexOf(x)===i;}));
  while(ops.length<4){const w=pick(EXS_NOUNS);if(ops.indexOf(w)<0)ops.push(w);}
  return{q:"«"+s.text+"»<br>¿Qué <b>hace</b> o qué se dice? (el <b>PREDICADO</b>)",ops:ops,a:ops.indexOf(s.verb),say:s.text+". ¿Cuál es el predicado?"};}
 return exTrimOps(_prOld(),3);};
EXAM_BANK.verbo=function(l){
 l=l||1;if(l>=3)return _veOld();
 if(l===1){
  const pairs=[["🏃","correr","corre"],["🍽️","comer","come"],["🎵","cantar","canta"],["😴","dormir","duerme"],["🦘","saltar","salta"],["✏️","escribir","escribe"],["📖","leer","lee"],["🎨","pintar","pinta"]];
  const v=pick(pairs),ops=shuffled([v[1]].concat(shuffled(EXS_NOUNS).slice(0,3)));
  return{q:"Un <b>VERBO</b> es una acción. ¿Cuál es un verbo?  "+v[0],ops:ops,a:ops.indexOf(v[1]),say:"¿Cuál de estas palabras es un verbo, una acción?"};}
 return exTrimOps(_veOld(),3);};
EXAM_BANK.mayuscula=function(l){
 l=l||1;if(l>=3)return _maOld();
 if(l===1){
  const T=rnd(3);
  if(T===0){const n=pick(EXM_NAMES),ops=shuffled([n,n.toLowerCase(),n.toUpperCase().charAt(0)+n.slice(1,2).toUpperCase()+n.slice(2)]);
   return{q:"¿Cuál nombre está bien escrito?",ops:ops,a:ops.indexOf(n),say:"¿Cuál nombre está bien escrito?"};}
  if(T===1){const p=pick(EXM_PLACES),ops=shuffled([p,p.toLowerCase(),p.toUpperCase()]);
   return{q:"¿Cuál está bien escrito?",ops:ops,a:ops.indexOf(p),say:"¿Cuál está bien escrito?"};}
  return pick([
   {q:"Los nombres de personas (Ana, Luis) empiezan con…",ops:["Mayúscula","minúscula","un número"],a:0},
   {q:"Una oración empieza con…",ops:["Mayúscula","minúscula","una coma"],a:0},
   {q:"Después de un punto escribimos con…",ops:["Mayúscula","minúscula","un dibujo"],a:0}]);}
 let it,g=0;do{it=_maOld();g++;}while(/lunes|Lunes/.test(it.q+it.ops.join(""))&&g<10);return exTrimOps(it,3);};
EXAM_BANK.tverbales=function(l){
 l=l||1;if(l>=3)return _tvOld();
 const v=pick(EXV),pp=pick(EXV_PERS),tense=pick(["pas","pre","fut"]);
 if(l===1){
  const T=rnd(3);
  if(T===0)return pick([
   {q:"Lo que pasó AYER está en…",ops:["Pasado ⏪","Presente","Futuro"],a:0},
   {q:"Lo que pasa HOY, ahora, está en…",ops:["Presente ⏺️","Pasado","Futuro"],a:0},
   {q:"Lo que pasará MAÑANA está en…",ops:["Futuro ⏩","Pasado","Presente"],a:0}]);
  const sj=pp[0],f=exConj(v[0],v[1],tense,pp[1]),sent=pick(EXV_MARK[tense])+" "+sj+" "+f+".";
  return{q:"«"+sent+"»<br>¿Cuándo pasa? (<b>ayer, hoy o mañana</b>)",ops:["Pasado","Presente","Futuro"],a:["pas","pre","fut"].indexOf(tense),say:sent+". ¿Cuándo pasa?"};}
 const T=rnd(2);
 if(T===0){const f=exConj(v[0],v[1],tense,pp[1]);return{q:"¿En qué tiempo está el verbo <b>«"+f+"»</b>?",ops:["Pasado","Presente","Futuro"],a:["pas","pre","fut"].indexOf(tense),say:"¿En qué tiempo está el verbo "+f+"?"};}
 const sj=pp[0],f=exConj(v[0],v[1],tense,pp[1]),sent=pick(EXV_MARK[tense])+" "+sj+" "+f+".";
 return{q:"«"+sent+"»<br>¿En qué tiempo está la oración?",ops:["Pasado","Presente","Futuro"],a:["pas","pre","fut"].indexOf(tense),say:sent+". ¿En qué tiempo está la oración?"};};
EXAM_BANK.reinos=function(l){
 l=l||1;if(l>=2)return _reOld();
 return pick([
  {q:"¿Cuál es un ANIMAL?",ops:["El perro 🐕","La roca 🪨","La rosa 🌹"],a:0},
  {q:"¿Cuál es una PLANTA?",ops:["El árbol 🌳","El gato 🐱","La sal 🧂"],a:0},
  {q:"¿Cuál NO está vivo? (es mineral)",ops:["La piedra 🪨","La mariposa 🦋","La flor 🌼"],a:0},
  {q:"Las plantas necesitan agua y…",ops:["Sol ☀️","Dulces 🍬","Juguetes 🧸"],a:0},
  {q:"Los animales necesitan…",ops:["Comida y agua 🍖💧","Solo piedras","Nada"],a:0},
  {q:"¿Cuál es del reino vegetal?",ops:["El mango 🥭","El pez 🐟","El oro 🪙"],a:0}]);};

/* ---- fin de la práctica: sube/baja de nivel y cuenta el tema solo en el nivel 2 o 3 ---- */
function exLevelEnd(){
 if(!EX||EX.sim||!exLeveled(EX.uid))return false;
 if(typeof closeBoard==="function")closeBoard();
 const uid=EX.uid,pct=Math.round(EX.ok/EX.items.length*100),lvl=EX.lvl||1,e=examState(),thr=Math.min(80,examRuleOf(prof()).thr||70);
 if(!e.lvl)e.lvl={};if(!e.units[uid])e.units[uid]={best:0,tries:0};
 e.units[uid].tries++;
 let passed=false,msg="";
 if(lvl>=2){e.units[uid].best=Math.max(e.units[uid].best,pct);passed=pct>=examRuleOf(prof()).thr;}
 let nl=lvl;
 if(pct>=thr&&lvl<3){nl=lvl+1;msg=lvl===1?"¡Calentamiento superado! Subes al <b>nivel 2</b> ⭐⭐":"¡Subes al <b>nivel 3</b> (reto) ⭐⭐⭐!";}
 else if(pct<50&&lvl>1){nl=lvl-1;msg="Vamos a practicar un poquito más fácil 💪 (nivel "+nl+")";}
 e.lvl[uid]=nl;
 const p=prof();if(p){p.coins+=Math.round(pct/10);p.xp+=Math.round(pct/4);}
 save();
 const good=pct>=thr;if(good){sWIN();confetti(26);}
 const unit=examAllUnits().find(function(x){return x.id===uid;});
 const done=e.units[uid].best>=examRuleOf(prof()).thr&&unit&&unit.req;
 render(topbar("screenExam()")
 +'<div class="card endcard"><div class="big">'+(good?"🌟":pct>=50?"💪":"📚")+'</div><h2>'+pct+'%</h2>'
 +'<p class="mut" style="margin:4px 0 8px">'+EX.ok+' de '+EX.items.length+' correctas · Nivel '+"⭐".repeat(lvl)+'</p>'
 +(done&&passed?'<p style="font-size:1.1rem;margin-bottom:8px;color:#16A34A;font-weight:800">✅ ¡Tema superado! 🎓</p>':'')
 +(msg?'<p style="font-size:1.02rem;margin-bottom:10px">'+msg+'</p>':(good?'':'<p style="font-size:1.02rem;margin-bottom:10px">¡Casi! Un intento más y lo logras 🙂</p>'))
 +'<button class="kbtn green" onclick="startExamUnit(\''+uid+'\')">'+(good&&nl>lvl?"Seguir al nivel "+nl+" ➜":"Practicar otra vez 🔁")+'</button>'
 +(EXAM_LESSONS[uid]?'<button class="kbtn white" onclick="examLesson(\''+uid+'\')">📖 Ver la explicación</button>':'')
 +(unit&&unit.req&&examRuleOf(prof()).on&&examPassed(prof())?'<p style="margin:8px 0;font-weight:700;color:#16A34A">🎓 ¡Superaste todos los temas del examen! Ya se abrió el resto de la app.</p>':'')
 +'<button class="kbtn white" onclick="screenExam()">Ver todos los temas 📝</button></div>');
 return true;}

/* ============ v10.39: escribir con el teclado, pizarra en mates, barra de avance y periodos ============
   Feedback (3-nov-2026): la voz leía en inglés y había cosas en «spanglish»; no había pizarra en mates;
   «escribir los números» debe ser ESCRIBIRLOS (teclado), no marcar una opción; la barra de Modo Examen no avanzaba;
   y había muchos temas de exámenes anteriores mezclados con los de ahora → ahora «Este periodo» arriba y
   «Periodos anteriores» (repaso) plegado abajo. */
EXAM_SUBJECTS.forEach(function(s){s.units.forEach(function(u){if(u.req)u.cur=true;});});
function examSimUnits(){return examAllUnits().filter(function(u){return u.cur&&EXAM_BANK[u.id];});}
function exSayNow(){const it=EX&&EX.items?EX.items[EX.i]:null;return it?(it.say||it.q||""):"";}

/* pizarra para todo lo de matemática */
["sumallev","restapres","problemas","num4escr","num4lect","numletras","abaco"].forEach(function(id){
 const f=EXAM_BANK[id];if(!f)return;
 EXAM_BANK[id]=function(l){const it=f(l);if(it)it.board=true;return it;};});

/* ---- escribir números: se teclea (digitos o letras) ---- */
const _escLetters=EXAM_BANK.num4escr;
EXAM_BANK.num4escr=function(l){
 l=l||1;
 let n=l===1?(1+rnd(9))*1000+rnd(10)*100:(1+rnd(9))*1000+rnd(10)*100+rnd(10)*10+(l===3?rnd(10):0);
 if(l>=3&&n%10===0)n+=1+rnd(9);
 const d=[Math.floor(n/1000),Math.floor(n/100)%10,Math.floor(n/10)%10,n%10];
 const parts=[d[0]*1000,d[1]*100,d[2]*10,d[3]].filter(function(x){return x>0;});
 const T=l===1?pick([0,0,1]):l===2?pick([0,1,2]):pick([3,3,0,2]);
 if(T===0)return{typed:"num",q:"✍️ Escribe con <b>cifras</b>:<br><b>"+exNumEs(n)+"</b>",answer:String(n),say:exNumEs(n),hint:"Se escribe "+n};
 if(T===1&&parts.length>1)return{typed:"num",q:"✍️ ¿Qué número es?<br><b>"+parts.join(" + ")+"</b>",answer:String(n),say:parts.join(" más ")+". ¿Qué número es?",hint:"Se escribe "+n};
 if(T===2)return{typed:"num",q:"🔊 <b>Escucha</b> y escribe el número con cifras",answer:String(n),say:exNumEs(n),hint:"Se escribe "+n};
 return{typed:"text",q:"✍️ Escribe con <b>letras</b>:<br><b style=\"font-size:1.8rem\">"+n+"</b>",answer:exNumEs(n),say:exNumEs(n),hint:exNumEs(n)};};
EXAM_BANK.num4escr=(function(f){return function(l){const it=f(l);it.board=true;return it;};})(EXAM_BANK.num4escr);

let EXT={listener:null};
function exTypedCleanup(){if(EXT.listener){document.removeEventListener("keydown",EXT.listener);EXT.listener=null;}}
function exNorm(s){return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zñ0-9 ]/g,"").replace(/\s+/g," ").trim();}
function exRenderTyped(it){
 exTypedCleanup();
 const num=it.typed==="num";
 EXT.it=it;EXT.val="";EXT.num=num;EXT.done=false;
 const keyBtn=function(c,label){return '<button class="key" style="min-width:0;padding:9px 0;font-size:1.1rem" onclick="exTypedKey(\''+c+'\')">'+(label||c)+'</button>';};
 let pad;
 if(num)pad='<div class="numpad">'+[1,2,3,4,5,6,7,8,9].map(function(d){return '<button class="key" onclick="exTypedKey(\''+d+'\')">'+d+'</button>';}).join("")+'<button class="key" onclick="exTypedBack()">⌫</button><button class="key" onclick="exTypedKey(\'0\')">0</button><button class="key okk" onclick="exTypedOk()">✓</button></div>';
 else{
  const rows=["qwertyuiop","asdfghjklñ","zxcvbnm","áéíóú"];
  pad='<div style="display:grid;gap:5px;margin-top:6px">'+rows.map(function(r){return '<div style="display:grid;grid-template-columns:repeat('+(r.length===4?5:10)+',1fr);gap:4px;'+(r.length<10?'padding:0 '+(r.length===7?'5%':r.length===4?'20%':'0')+';':'')+'">'+r.split("").map(function(c){return keyBtn(c);}).join("")+'</div>';}).join("")
   +'<div style="display:grid;grid-template-columns:1fr 3fr 1fr;gap:4px"><button class="key" style="padding:9px 0" onclick="exTypedBack()">⌫</button><button class="key" style="padding:9px 0" onclick="exTypedKey(\' \')">espacio</button><button class="key okk" style="padding:9px 0" onclick="exTypedOk()">✓</button></div></div>';}
 const u=examAllUnits().find(function(x){return x.id===EX.uid;});
 render(topbar("screenExam()")
  +'<div class="progressdots">'+dots(EX.items.length,EX.i)+'</div>'
  +'<p class="center" style="font-family:Fredoka;font-weight:600;margin-bottom:8px">'+(EX.sim?"🏁 Simulacro":(u?u.ic+" "+u.nm:"Examen"))+' · '+(EX.i+1)+'/'+EX.items.length+'</p>'
  +(it.op&&typeof exColumnHTML==="function"?exColumnHTML(it.op):'<div class="bigq center">'+it.q+'</div>')
  +(typeof boardBtn==="function"&&it.board?boardBtn():"")
  +'<button class="speaker small" onclick="speakFast(exSayNow())">🔊 Escuchar</button>'
  +'<div class="numdisp" id="extDisp" style="min-height:3.4rem;font-size:'+(num?"2.4rem":"1.35rem")+';word-break:break-word">&nbsp;</div>'
  +pad+'<div id="extFb"></div>');
 EXT.listener=function(e){
  if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target&&e.target.tagName;if(t==="INPUT"||t==="TEXTAREA")return;
  if(e.key==="Backspace"){e.preventDefault();exTypedBack();}
  else if(e.key==="Enter"){e.preventDefault();exTypedOk();}
  else if(EXT.num&&/^\d$/.test(e.key)){e.preventDefault();exTypedKey(e.key);}
  else if(!EXT.num&&(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/.test(e.key)||e.key===" ")){e.preventDefault();exTypedKey(e.key.toLowerCase());}};
 document.addEventListener("keydown",EXT.listener);
 setTimeout(function(){try{speakFast(exSayNow());}catch(x){}},450);}
function exTypedShow(){const d=document.getElementById("extDisp");if(d)d.textContent=EXT.val||" ";}
function exTypedKey(c){if(EXT.done)return;const max=EXT.num?6:70;if(EXT.val.length>=max)return;EXT.val+=c;try{beep([560],.04);}catch(e){}exTypedShow();}
function exTypedBack(){if(EXT.done)return;EXT.val=EXT.val.slice(0,-1);exTypedShow();}
function exTypedOk(){
 if(EXT.done||!EXT.val)return;EXT.done=true;
 const it=EXT.it,ok=EXT.num?EXT.val===it.answer:exNorm(EXT.val)===exNorm(it.answer);
 recordAnswer("Examen: "+(EX.sim?"simulacro":EX.uid),ok,25);
 if(ok){sOK();confetti(8);EX.ok++;toast("¡Correcto! 🎉",true,1000);}
 else{sNO();toast("Se escribe: "+it.answer,false,2600);const f=document.getElementById("extFb");if(f)f.innerHTML='<p style="text-align:center;font-weight:800;margin-top:8px;color:#B45309">Se escribe: '+it.answer+'</p>';}
 exTypedCleanup();EX.i++;setTimeout(renderEX,ok?1000:2600);}

/* ---- progreso de «Este periodo» (la barra sí avanza: cada nivel que sube suma) ---- */
function examProgress(){
 const p=prof(),r=examRuleOf(p);
 if(!r.on){let t=0,m=0;EXAM_SUBJECTS.forEach(function(s){s.units.forEach(function(u){t++;if(exUnitScore(u.id).best>=80)m++;});});return{t:t,m:m,pct:t?Math.round(m/t*100):0};}
 const st=examReqOf(p);let sum=0;
 st.forEach(function(x){if(x.ok)sum+=1;else sum+=Math.min(.7,(exLevel(x.id)-1)*.3+(x.tries?.06:0));});
 return{t:st.length,m:st.filter(function(x){return x.ok;}).length,pct:Math.round(sum/st.length*100)};}
function exUnitBtn(sub,u){
 const sc=exUnitScore(u.id),st=sc.best>=80?"🌟":sc.best>=50?"🔸":sc.tries?"⚪":"";
 return '<button class="exu" onclick="startExamUnit(\''+u.id+'\')"><span class="exi">'+u.ic+'</span><span class="exn">'+(u.req?"📌 ":"")+u.nm+'</span><span class="exb" style="background:'+sub.color+'">'+(typeof exBadge==="function"?exBadge(u,sc,st):(sc.tries?sc.best+"% "+st:"¡Nuevo!"))+'</span></button>';}
function screenExam(){setTheme("kid");
 const pr=examProgress(),R=52,C=2*Math.PI*R;
 const group=function(sub,cur){const us=sub.units.filter(function(u){return !!u.cur===cur;});if(!us.length)return"";
  return '<div class="excard" style="border-color:'+sub.color+'"><div class="exhead" style="color:'+sub.color+';border-color:'+sub.color+'"><span>'+sub.ic+'</span>'+sub.nm+'</div>'+us.map(function(u){return exUnitBtn(sub,u);}).join("")+'</div>';};
 const cur=EXAM_SUBJECTS.map(function(s){return group(s,true);}).join("");
 const oldN=examAllUnits().filter(function(u){return !u.cur;}).length;
 const old=EXAM_SUBJECTS.map(function(s){return group(s,false);}).join("");
 const noVoice=(!S.geminiKey&&typeof hasSpanishVoice==="function"&&!hasSpanishVoice())?'<div class="card" style="background:#FEF3C7;font-size:.88rem;line-height:1.45;margin-bottom:10px">🔊 Este dispositivo no tiene voz en <b>español</b>: las preguntas se escucharán con otra voz. En Ajustes → Idioma → Texto a voz instala «Español», o activa la clave de IA en el Panel de padres.</div>':"";
 render(topbar("screenKidMap()")
 +'<div class="exhero"><div class="exring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="'+R+'" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="13"/>'
 +'<circle cx="60" cy="60" r="'+R+'" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-pr.pct/100))+'" transform="rotate(-90 60 60)"/></svg>'
 +'<div class="exringtxt">'+pr.pct+'%</div></div>'
 +'<div class="exhero-t">📝 Examen de este periodo</div><div class="exhero-p">'+pr.m+' de '+pr.t+' temas superados · ¡cada nivel que subes cuenta!</div></div>'
 +noVoice
 +(typeof examBannerHTML==="function"?examBannerHTML():"")
 +'<button class="kbtn green" onclick="startExamSim()" style="display:flex;align-items:center;gap:12px;text-align:left"><span style="font-size:clamp(2rem,9vw,2.5rem)">🏁</span><span style="flex:1"><span style="font-size:clamp(1.05rem,4.8vw,1.28rem)">Simulacro</span><br><span style="font-size:.78rem;opacity:.85;font-weight:500">12 preguntas de los temas de este periodo</span></span></button>'
 +'<p class="appsec" style="margin:12px 2px 6px">📌 Este periodo</p>'+cur
 +'<details style="margin-top:12px"><summary style="cursor:pointer;font-weight:800;color:#64748B;padding:8px 2px">🗂️ Periodos anteriores · repaso ('+oldN+' temas)</summary><p class="mut" style="font-size:.85rem;margin:2px 4px 8px">Temas de exámenes pasados. Sirven para repasar, pero no cuentan para abrir el resto de la app.</p>'+old+'</details>');}

/* ============ v10.40: preguntas que CAMBIAN, 4 opciones, mates con respuesta escrita ============
   Feedback (3-nov-2026): «ya se sabe los ejercicios de memoria, no cambian las preguntas» y «solo hay 3 opciones».
   · Bancos mucho más grandes (más sujetos, predicados, nombres, lugares, plantillas de problemas).
   · Memoria de lo ya preguntado (últimas 60 por tema): no se repite la misma pregunta ni dentro de la sesión ni en las siguientes.
   · Casi todas las preguntas de lenguaje salen de oraciones armadas al azar (las de teoría salen pocas).
   · Sumas, restas y problemas se RESPONDEN ESCRIBIENDO con el teclado (no hay opciones que memorizar).
   · Mínimo 4 opciones cuando es de marcar (los tiempos verbales tienen solo 3 porque son pasado, presente y futuro). */
function exTrimOps(it,n){
 n=Math.max(4,n||4);
 if(!it||!it.ops||it.ops.length<=n)return it;
 const ok=it.ops[it.a],wrong=shuffled(it.ops.filter(function(_,i){return i!==it.a;})).slice(0,n-1);
 const ops=shuffled([ok].concat(wrong));it.ops=ops;it.a=ops.indexOf(ok);return it;}

/* ---- bancos más grandes ---- */
EXS_PERSON.push("Mi tío","Mi prima","La señora","El doctor","Mi vecino","Los abuelos","Ana y Juan","Mis primos","La profesora","El panadero");
EXS_PERSON_PL.push("Los abuelos","Ana y Juan","Mis primos");
EXS_ANIMAL.push("La tortuga","El pato","Las ovejas","El conejo","Los patos","La gallina","Los peces");
EXS_ANIMAL_PL.push("Las ovejas","Los patos","Los peces");
EXS_FLY.push("La mariposa","Los pájaros","El loro","Los loros");
EXS_FLY_PL.push("Los pájaros","Los loros");
EXS_PRED.person.push(["salta","saltan","la cuerda"],["come","comen","pan con queso"],["dibuja","dibujan","una casa"],["mira","miran","la televisión"],["ayuda","ayudan","en la cocina"],["baila","bailan","con alegría"],["toma","toman","jugo de naranja"],["abre","abren","la ventana"],["lava","lavan","los platos"],["compra","compran","frutas"]);
EXS_PRED.animal.push(["camina","caminan","despacio"],["nada","nadan","en el lago"],["come","comen","su comida"],["juega","juegan","en el jardín"],["mira","miran","a todos lados"]);
EXS_PRED.fly.push(["vuela","vuelan","muy alto"],["come","comen","semillas"],["salta","saltan","en el árbol"],["duerme","duermen","en el nido"]);
EXM_NAMES.push("Julián","Paula","Nicolás","Gabriela","Juan","María","Simón","Antonella");
EXM_PLACES.push("Pereira","Manizales","Cúcuta","Leticia","Popayán","Villavicencio","Tunja","Neiva");
EXP_NAMES.push("Julián","Paula","Nicolás","Gabriela","Simón","Antonella");
EXS_VERBS.push("nadar","bailar","dibujar","mirar","abrir","tomar","ayudar","subir","hablar","lavar");
EXS_NOUNS.push("mano","pelota","puerta","carro","nube","río","pan","zapato","gato","niño","cuaderno","ventana");
EXS_ADJ.push("dulce","frío","alto","limpio","lento","feliz");
const EXS_VPAIR=[["🏃","correr"],["🍽️","comer"],["🎵","cantar"],["😴","dormir"],["🦘","saltar"],["✏️","escribir"],["📖","leer"],["🎨","pintar"],["🏊","nadar"],["💃","bailar"],["🚶","caminar"],["🥛","beber"],["👀","mirar"],["🚪","abrir"],["🪜","subir"],["🧼","lavar"],["⚽","jugar"],["🗣️","hablar"]];
const _ve1=EXAM_BANK.verbo;
EXAM_BANK.verbo=function(l){
 l=l||1;
 if(l===1&&Math.random()<.7){
  const v=pick(EXS_VPAIR),ops=shuffled([v[1]].concat(shuffled(EXS_NOUNS.concat(EXS_ADJ)).slice(0,3)));
  return{q:"Un <b>VERBO</b> es una acción. ¿Cuál es un verbo?  "+v[0],ops:ops,a:ops.indexOf(v[1]),say:"¿Cuál de estas palabras es un verbo, una acción?"};}
 return _ve1(l);};

/* ---- problemas: muchas más historias ---- */
const _prob1=EXAM_BANK.problemas;
EXAM_BANK.problemas=function(l){
 l=l||1;if(l>=3)return _prob1(l);
 const nm=pick(EXP_NAMES),th=pick(EXP_THINGS),n2=pick(EXP_NAMES.filter(function(x){return x!==nm;}));
 const C_=th[2]==="f"?"Cuántas":"Cuántos";
 const A=l===1?5+rnd(8):15+rnd(35),B=l===1?2+rnd(5):6+rnd(20);
 const ADD=[
  [nm+" tenía "+A+" "+th[0]+". Su abuela le regaló "+B+" más. ¿"+C_+" "+th[0]+" tiene ahora?","le regalaron más → SUMA"],
  ["En el parque hay "+A+" niños jugando y llegan "+B+" niños más. ¿Cuántos niños hay ahora?","llegan más → SUMA"],
  [nm+" leyó "+A+" páginas ayer y "+B+" páginas hoy. ¿Cuántas páginas leyó en total?","en total → SUMA"],
  ["En una canasta hay "+A+" frutas y en otra hay "+B+" frutas. ¿Cuántas frutas hay en total?","en total → SUMA"],
  [nm+" tiene "+A+" monedas y "+n2+" tiene "+B+" monedas. ¿Cuántas monedas tienen entre los dos?","entre los dos → SUMA"],
  ["En el salón hay "+A+" niños y "+B+" niñas. ¿Cuántos estudiantes hay en total?","en total → SUMA"],
  [nm+" guardó "+A+" "+th[0]+" en "+th[1]+" y luego guardó "+B+" "+th[0]+" más. ¿"+C_+" "+th[0]+" guardó?","guardó más → SUMA"]];
 const SUB=[
  [nm+" tenía "+(A+B)+" "+th[0]+". Le regaló "+B+" a "+n2+". ¿"+C_+" "+th[0]+" le quedan?","le quedan → RESTA",A],
  ["En el bus iban "+(A+B)+" personas. Se bajaron "+B+". ¿Cuántas personas quedan en el bus?","quedan → RESTA",A],
  ["Mamá compró "+(A+B)+" huevos y se rompieron "+B+". ¿Cuántos huevos quedan buenos?","quedan → RESTA",A],
  ["En una caja hay "+(A+B)+" "+th[0]+" y en otra caja hay "+B+". ¿"+C_+" "+th[0]+" más hay en la primera caja?","cuántos más → RESTA",A],
  ["Para llenar "+th[1]+" se necesitan "+(A+B)+" "+th[0]+". "+nm+" ya tiene "+A+". ¿"+C_+" le faltan?","cuántos faltan → RESTA",B],
  [nm+" tenía "+(A+B)+" pesos y gastó "+B+" en un dulce. ¿Cuántos pesos le quedan?","gastó → RESTA",A],
  ["Un árbol tenía "+(A+B)+" manzanas y se cayeron "+B+". ¿Cuántas manzanas quedan en el árbol?","se cayeron → RESTA",A]];
 let q,ans,hint;
 if(Math.random()<.5){const t=pick(ADD);q=t[0];ans=A+B;hint=t[1];}
 else{const t=pick(SUB);q=t[0];ans=t[2];hint=t[1];}
 const it={q:q,ops:[String(ans)],a:0,say:q,tip:hint};return exToTyped(it,q);};

/* ---- sumas, restas y problemas se responden ESCRIBIENDO ---- */
function exToTyped(it,say){
 it.typed="num";it.answer=String(it.ops[it.a]);it.board=true;
 if(say!=null)it.say=say;return it;}
(function(){
 const fs=EXAM_BANK.sumallev,fr=EXAM_BANK.restapres;
 EXAM_BANK.sumallev=function(l){const it=fs(l);if(it.typed)return it;return exToTyped(it,"¿Cuánto es "+it.op.a+" más "+it.op.b+"?");};
 EXAM_BANK.restapres=function(l){const it=fr(l);if(it.typed)return it;return exToTyped(it,"¿Cuánto es "+it.op.a+" menos "+it.op.b+"?");};
})();

/* ---- teoría poca, oraciones armadas al azar mucha ---- */
function exPreferSay(id){
 const f=EXAM_BANK[id];if(!f)return;
 EXAM_BANK[id]=function(l){
  l=l||1;if(l>=3||Math.random()<.1)return f(l);
  let it,g=0;do{it=f(l);}while(!it.say&&g++<10);return it;};}
["oracion","sujeto","predicado","verbo","mayuscula","tverbales"].forEach(exPreferSay);

/* ---- más variedad: verbos con dibujo, mayúsculas con oraciones al azar, 4 opciones siempre ---- */
function exKey(it){
 const base=String(it.q||"").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
 if(it.answer!=null)return base+"|"+it.answer;
 return base+"|"+(it.ops?it.ops.map(String).sort().join(","):"")+"|"+(it.ops?it.ops[it.a]:"");}
EXS_VPAIR.push(["🧹","barrer"],["🚗","manejar"],["🎸","tocar"],["🛏️","descansar"],["🎁","regalar"],["🍳","cocinar"],["🚿","bañar"],["🪥","cepillar"],["🧵","coser"],["🎣","pescar"],["🌱","sembrar"],["📞","llamar"],["🧩","armar"],["🔍","buscar"],["🧺","recoger"],["🚲","pedalear"],["🤝","saludar"],["🛒","comprar"],["📦","cargar"],["✈️","volar"],["🍎","morder"],["🧊","enfriar"],["👏","aplaudir"],["🙏","rezar"]);
const _may1=EXAM_BANK.mayuscula;
const EXMT=[["{N} vive en {P}.","{n} vive en {p}."],["Mi amigo {N} nació en {P}.","mi amigo {n} nació en {p}."],["{N} y {M} viajan a {P}.","{n} y {m} viajan a {p}."],["En {P} vive mi abuela {N}.","en {p} vive mi abuela {n}."],["{N} estudia en {P}.","{n} estudia en {p}."],["Mañana {N} visita {P}.","mañana {n} visita {p}."],["Mi prima {N} conoce {P}.","mi prima {n} conoce {p}."]];
EXAM_BANK.mayuscula=function(l){
 l=l||1;
 if(l<3&&Math.random()<.75){
  const N=pick(EXM_NAMES),M=pick(EXM_NAMES.filter(function(x){return x!==N;})),P=pick(EXM_PLACES),t=pick(EXMT);
  const fill=function(s,low){return s.replace("{N}",low?N.toLowerCase():N).replace("{M}",low?M.toLowerCase():M).replace("{P}",low?P.toLowerCase():P);};
  const ok=fill(t[0],false),allLow=ok.toLowerCase();
  const firstLow=ok.charAt(0).toLowerCase()+ok.slice(1);
  const namesLow=ok.replace(N,N.toLowerCase());
  const placeLow=ok.replace(P,P.toLowerCase());
  const ops=shuffled([ok,allLow,firstLow,namesLow===ok?placeLow:namesLow,placeLow].filter(function(x,i,a){return x!==ok?a.indexOf(x)===i:true;}));
  const uniq=[];ops.forEach(function(x){if(uniq.indexOf(x)<0)uniq.push(x);});
  while(uniq.length<4)uniq.push(ok.toUpperCase());
  const final=shuffled(uniq.slice(0,4).indexOf(ok)>=0?uniq.slice(0,4):[ok].concat(uniq.slice(0,3)));
  return{q:"¿Cuál oración está escrita correctamente?",ops:final,a:final.indexOf(ok),say:"¿Cuál oración está escrita correctamente?"};}
 return _may1(l);};
const _ora1=EXAM_BANK.oracion;
EXAM_BANK.oracion=function(l){
 const it=_ora1(l);
 if(it&&it.ops&&it.ops.length===3&&/bien ordenada/.test(it.q||"")){
  const ok=it.ops[it.a],w=ok.slice(0,-1).split(" ");
  if(w.length>=3){const extra=w.slice(2).concat(w.slice(0,2)).join(" ")+".";if(it.ops.indexOf(extra)<0){it.ops=shuffled(it.ops.concat([extra]));it.a=it.ops.indexOf(ok);}}}
 if(it&&it.ops&&it.ops.length===3&&/escrita correctamente/.test(it.q||"")){
  const ok=it.ops[it.a],extra=ok.charAt(0).toLowerCase()+ok.slice(1,-1)+(ok.slice(-1)===","?"":",");
  if(it.ops.indexOf(extra)<0){it.ops=shuffled(it.ops.concat([extra]));it.a=it.ops.indexOf(ok);}}
 return it;};

const _may2=EXAM_BANK.mayuscula;
EXAM_BANK.mayuscula=function(l){
 const it=_may2(l);
 if(it&&it.ops&&it.ops.length<4){const ok=it.ops[it.a];let extra=/escrit/.test(it.q||"")?(ok===ok.toUpperCase()?ok.toLowerCase():ok.toUpperCase()):"Ninguna de las anteriores";
  if(it.ops.indexOf(extra)<0){it.ops=shuffled(it.ops.concat([extra]));it.a=it.ops.indexOf(ok);}}
 return it;};
/* ---- memoria: no repetir lo ya preguntado (últimas 60 por tema) ---- */
EXAM_REQ.concat(["reinos"]).forEach(function(id){
 const f=EXAM_BANK[id];if(!f)return;
 EXAM_BANK[id]=function(l){
  const e=examState();if(!e.recent)e.recent={};const rec=e.recent[id]||(e.recent[id]=[]);
  let it,g=0;
  do{it=f(l);const k=exKey(it);if(rec.indexOf(k)<0){rec.push(k);if(rec.length>60)rec.shift();return it;}g++;}while(g<40);
  return it;};});

/* ---------- MATE DEL COLE (perfil del niño): lo que ya debe estar aprendiendo, sin candado ---------- */
function screenKidMath(){setTheme("kid");if(typeof stopGames==="function")stopGames();
 const mate=EXAM_SUBJECTS.find(function(s){return s.id==="mate";}),us=mate.units.filter(function(u){return u.cur;});
 render(topbar("screenKidMap()")+subHeader("🔢 Mate del cole")
  +'<div class="card" style="line-height:1.5;background:linear-gradient(135deg,#FEF3C7,#ECFEFF)"><b>Lo que estás aprendiendo en matemáticas.</b> Empieza fácil ⭐ y va subiendo solo. Tienes pizarra ✏️ y, si te equivocas, verás cómo era.</div>'
  +us.map(function(u){const sc=exUnitScore(u.id),lv=exLevel(u.id);
   return '<button class="kbtn white" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="startExamUnit(\''+u.id+'\')"><span style="font-size:2rem">'+u.ic+'</span><span style="flex:1"><span>'+u.nm+'</span><br><span style="font-size:.8rem;opacity:.75;font-weight:600">Nivel '+"⭐".repeat(lv)+(sc.best?" · mejor "+sc.best+"%":"")+'</span></span><span>›</span></button>';}).join("")
  +'<button class="kbtn green" onclick="startExamSim()">🏁 Reto mixto (12 preguntas)</button>');}
