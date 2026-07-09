"use strict";
const APP_VERSION="5.0.0";
/* ============ ESTADO ============ */
const DEFAULT_STATE={pin:"1234",geminiKey:"",
 profiles:{
  nino:{name:"Explorador",emoji:"🦖",type:"kid",age:7,alias:"",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},map:{unlocked:1,stars:{}},worldWins:{},critters:[],mastery:{},signals:{read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0}}},
  nina:{name:"Estrella",emoji:"🎧",type:"teen",age:14,alias:"",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},best:{}}
 },aiBank:{}};
let S=load();
/* ---- perfiles dinámicos (varios hijos) ---- */
function normalizeProfiles(){
 if(!S.profiles)S.profiles={};
 for(const id in S.profiles){const p=S.profiles[id];
  if(!p.type)p.type=(id==="nina")?"teen":"kid";
  if(!p.days)p.days={};if(!p.stats)p.stats={};
  if(p.coins==null)p.coins=0;if(p.xp==null)p.xp=0;if(p.streak==null)p.streak=0;
  if(p.type==="kid"){if(!p.critters)p.critters=[];if(!p.worldWins)p.worldWins={};if(!p.mastery)p.mastery={};
   if(!p.signals)p.signals={read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0}};
   if(!p.emoji)p.emoji="🦖";}
  else{if(!p.best)p.best={};if(!p.emoji)p.emoji="🎧";}
 }
 if(!S.aiBank)S.aiBank={};
}
normalizeProfiles();
function profType(){const p=prof();return (p&&p.type)||"kid";}
function profAiBank(){if(!S.aiBank)S.aiBank={};if(!current.profile)return [];if(!S.aiBank[current.profile])S.aiBank[current.profile]=[];return S.aiBank[current.profile];}
function childProfiles(){return Object.keys(S.profiles).map(id=>Object.assign({id:id},S.profiles[id]));}
function newProfile(name,age,type){
 const id="p_"+Date.now().toString(36)+Math.floor(Math.random()*1000);
 age=parseInt(age,10)||(type==="teen"?13:7);
 if(type==="teen")S.profiles[id]={name:name||"Estrella",alias:"",age:age,type:"teen",emoji:"🎧",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},best:{}};
 else S.profiles[id]={name:name||"Explorador",alias:"",age:age,type:"kid",emoji:"🦖",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},map:{unlocked:1,stars:{}},worldWins:{},critters:[],mastery:{},signals:{read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0}}};
 save();return id;}
function deleteProfile(id){if(S.profiles[id]&&Object.keys(S.profiles).length>1){delete S.profiles[id];if(S.aiBank)delete S.aiBank[id];save();}}
/* ---- tiempo de uso por niño (segundos activos por día) ---- */
let _useTimer=null;
function startUsageTracking(){
 if(_useTimer)return;
 _useTimer=setInterval(function(){
  try{
   if(current.profile&&S.profiles[current.profile]&&(typeof document==="undefined"||!document.hidden)){
    const d=touchDay();d.active=(d.active||0)+10;save();
   }
  }catch(e){}
 },10000);}
function load(){try{const r=localStorage.getItem("academiaFam2");if(r){const s=JSON.parse(r);const base=JSON.parse(JSON.stringify(DEFAULT_STATE));deepMerge(base,s);return base;}}catch(e){}return JSON.parse(JSON.stringify(DEFAULT_STATE));}
function deepMerge(t,s){for(const k in s){if(s[k]&&typeof s[k]==="object"&&!Array.isArray(s[k])){if(!t[k])t[k]={};deepMerge(t[k],s[k]);}else t[k]=s[k];}}
function save(){S.updatedAt=Date.now();localStorage.setItem("academiaFam2",JSON.stringify(S));if(typeof window!=="undefined"&&window.afOnSave)window.afOnSave();}
const app=document.getElementById("app");
let current={profile:null};
function prof(){return S.profiles[current.profile];}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
/* limpia etiquetas HTML que a veces devuelve la IA (arregla el bug de <b> visible en lecturas) */
function stripHTML(s){return String(s).replace(/<[^>]*>/g," ").replace(/\s{2,}/g," ").trim();}
function keepBold(s){return String(s)
 .replace(/<\s*(?:b|strong)[^>]*>/gi,"<b>")
 .replace(/<\s*\/\s*(?:b|strong)\s*>/gi,"</b>")
 .replace(/<(?!\/?b>)[^>]*>/g,"");}
/* texto seguro que SOLO permite negrita <b> (escapa todo lo demás, incl. > ) */
function boldHTML(s){return keepBold(s)
 .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
 .replace(/&lt;b&gt;/g,"<b>").replace(/&lt;\/b&gt;/g,"</b>");}
function todayStr(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function seedFromStr(str){let h=1779033703;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=(h<<13)|(h>>>19);}return h>>>0;}
function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function dailyRng(x){return mulberry32(seedFromStr(todayStr()+(x||"")));}
function shuffled(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor((rng?rng():Math.random())*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(arr,rng){return arr[Math.floor((rng?rng():Math.random())*arr.length)];}
function rnd(n){return Math.floor(Math.random()*n);}

/* ============ SONIDO + CONFETI ============ */
let AC=null;
function muted(){return !!(S&&S.muted);}
function toggleMute(el){S.muted=!S.muted;save();try{if(S.muted){if("speechSynthesis"in window)window.speechSynthesis.cancel();if(typeof stopGemAudio==="function")stopGemAudio();}}catch(e){}
 if(el)el.textContent=S.muted?"🔇":"🔊";return S.muted;}
function beep(freqs,dur){if(muted())return;try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();let t=AC.currentTime;
 freqs.forEach(f=>{const o=AC.createOscillator(),g=AC.createGain();o.type="triangle";o.frequency.value=f;o.connect(g);g.connect(AC.destination);
 g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.start(t);o.stop(t+dur);t+=dur*0.6;});}catch(e){}}
function sOK(){beep([523,659,784],.18);}
function sNO(){beep([196,147],.22);}
function sWIN(){beep([523,659,784,1047],.16);}
function tone(f,d){beep([f],d);}
function confetti(n){const ems=["🎉","⭐","🟡","💙","🟢","✨","🎈"];
 for(let i=0;i<(n||24);i++){const e=document.createElement("div");e.className="confetti";
 e.textContent=ems[rnd(ems.length)];e.style.left=rnd(100)+"vw";e.style.animationDuration=(1.4+Math.random()*1.4)+"s";
 document.body.appendChild(e);setTimeout(()=>e.remove(),3000);}}
function toast(msg,ok,ms){const t=document.createElement("div");t.className="toast "+(ok?"ok":"no");t.innerHTML=msg;
 document.body.appendChild(t);setTimeout(()=>t.remove(),ms||1400);}

/* ============ VOZ (Web Speech API) ============ */
let VOICES=[];
function loadVoices(){try{VOICES=window.speechSynthesis.getVoices();}catch(e){}}
if("speechSynthesis"in window){loadVoices();window.speechSynthesis.onvoiceschanged=loadVoices;}
/* prefiere voces de alta calidad (Google/Microsoft/neural) que suenan más naturales */
const NATURAL=/(google|natural|neural|microsoft|premium|enhanced|wavenet|paulina|sabina|helena)/i;
function pickEnVoice(){
 // SOLO voces realmente en inglés (nunca una voz española leyendo inglés → "nose" mal pronunciado)
 const en=VOICES.filter(x=>/^en/i.test(x.lang));
 return en.find(x=>NATURAL.test(x.name)&&/US/i.test(x.lang))
  ||en.find(x=>NATURAL.test(x.name)&&/GB/i.test(x.lang))
  ||en.find(x=>NATURAL.test(x.name))
  ||en.find(x=>/en[-_]US/i.test(x.lang))
  ||en.find(x=>/en[-_]GB/i.test(x.lang))
  ||en[0]||null;}
/* ===== VOZ PREMIUM CON GEMINI (TTS por IA) — automática si hay clave =====
   Si el padre puso la clave de Gemini, la voz (sobre todo inglés) suena natural.
   Si no hay clave, usa la voz del dispositivo. Con caché para no gastar cuota. */
const GEM_TTS_MODEL="gemini-2.5-flash-preview-tts";
let AF_AUDIO=null,GEM_TTS_SRC=null;
const GEM_TTS_CACHE={}; // texto -> AudioBuffer (evita volver a llamar a la API)
function getAudioCtx(){if(!AF_AUDIO){try{AF_AUDIO=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AF_AUDIO=null;}}return AF_AUDIO;}
function stopGemAudio(){if(GEM_TTS_SRC){try{GEM_TTS_SRC.onended=null;GEM_TTS_SRC.stop();}catch(e){}GEM_TTS_SRC=null;}}
function b64ToBytes(b64){const bin=atob(b64);const len=bin.length;const out=new Uint8Array(len);for(let i=0;i<len;i++)out[i]=bin.charCodeAt(i);return out;}
function pcm16ToBuffer(bytes,ctx,rate){
 const n=Math.floor(bytes.byteLength/2);const buf=ctx.createBuffer(1,n,rate);const ch=buf.getChannelData(0);
 const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 for(let i=0;i<n;i++)ch[i]=dv.getInt16(i*2,true)/32768;
 return buf;}
function geminiTTS(text,onEnd){
 // devuelve Promise<bool>: true si reprodujo con Gemini, false si hay que usar la voz del dispositivo
 return (async()=>{
  if(!S.geminiKey)return false;
  const ctx=getAudioCtx();if(!ctx)return false;
  if(ctx.state==="suspended"){try{await ctx.resume();}catch(e){}}
  try{
   let buf=GEM_TTS_CACHE[text];
   if(!buf){
    const body={contents:[{parts:[{text:text}]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:"Kore"}}}}};
    const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+GEM_TTS_MODEL+":generateContent?key="+encodeURIComponent(S.geminiKey),
      {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!r.ok)return false;
    const j=await r.json();
    const part=j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts&&j.candidates[0].content.parts[0];
    const data=part&&part.inlineData&&part.inlineData.data;if(!data)return false;
    const mime=(part.inlineData.mimeType)||"";const rate=parseInt((mime.match(/rate=(\d+)/)||[])[1],10)||24000;
    buf=pcm16ToBuffer(b64ToBytes(data),ctx,rate);
    GEM_TTS_CACHE[text]=buf;
   }
   try{window.speechSynthesis.cancel();}catch(e){}
   stopGemAudio();
   const src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);
   GEM_TTS_SRC=src;if(onEnd)src.onended=onEnd;src.start();
   return true;
  }catch(e){return false;}
 })();
}
function speakEN(text,onEnd){
 if(muted()){if(onEnd)onEnd();return;}
 if(S.geminiKey){geminiTTS(text,onEnd).then(ok=>{if(!ok)speakENDevice(text,onEnd);});return;}
 speakENDevice(text,onEnd);}
function speakENDevice(text,onEnd){
 if(!("speechSynthesis"in window)){toast("🔇 Tu navegador no tiene voz. Prueba en Chrome.",false,2000);if(onEnd)onEnd();return;}
 stopGemAudio();window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.82;u.pitch=1.0;
 const v=pickEnVoice();
 if(v){u.voice=v;u.lang=v.lang;} // usa el idioma real de la voz inglesa
 if(onEnd)u.onend=onEnd;
 window.speechSynthesis.speak(u);}
function pickLatinVoice(){
 const latin=/es[-_](US|MX|419|CO|AR|CL|PE|VE|EC|GT|LA)/i;
 return VOICES.find(x=>/^es/i.test(x.lang)&&NATURAL.test(x.name)&&!/es[-_]ES/i.test(x.lang))
  ||VOICES.find(x=>latin.test(x.lang)&&NATURAL.test(x.name))
  ||VOICES.find(x=>latin.test(x.lang))
  ||VOICES.find(x=>/^es/i.test(x.lang)&&NATURAL.test(x.name))
  ||VOICES.find(x=>/^es/i.test(x.lang)&&!/es[-_]ES/i.test(x.lang))
  ||VOICES.find(x=>/^es/i.test(x.lang));}
function speakES(text,onEnd){
 if(muted()){if(onEnd)onEnd();return;}
 // con clave de Gemini, voz premium para textos cortos (preguntas, instrucciones, frases).
 // los cuentos largos usan la voz del dispositivo para no gastar cuota.
 if(S.geminiKey&&String(text).length<=240){geminiTTS(text,onEnd).then(ok=>{if(!ok)speakESDevice(text,onEnd);});return;}
 speakESDevice(text,onEnd);}
function speakESDevice(text,onEnd){
 if(!("speechSynthesis"in window)){if(onEnd)onEnd();return;}
 stopGemAudio();window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 const v=pickLatinVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang="es-419";
 u.rate=.95;u.pitch=1.02;if(onEnd)u.onend=onEnd;window.speechSynthesis.speak(u);}
function hasVoice(){return "speechSynthesis"in window;}

/* ============ MOTOR DE CONTENIDO INFINITO (IA + banco fijo + adaptativo) ============ */
/* Cada "tema" sabe pedirle a Gemini preguntas nuevas, y tiene un respaldo fijo. */
const KID_TOPICS={
 sumas2:{name:"Sumas",emoji:"➕",prompt:"sumas de 2 cifras (resultado menor a 100) para un niño de 6-7 años en primero",
   fallback:()=>{const M=diffMax([10,20,30,45,60]);const a=2+rnd(M),b=2+rnd(M);return mcq(a+" + "+b+" = ?",a+b);}},
 restas2:{name:"Restas",emoji:"➖",prompt:"restas simples sin prestar para un niño de 6-7 años, resultado positivo",
   fallback:()=>{const M=diffMax([10,20,30,45,60]);const a=5+rnd(M),b=1+rnd(a-1);return mcq(a+" − "+b+" = ?",a-b);}},
 restapres:{name:"Restas prestando",emoji:"🔄",prompt:"restas de 2 cifras que requieren prestar/llevar, para niño de 7 años, resultado positivo",
   fallback:()=>{let a,b;do{a=20+rnd(70);b=5+rnd(a-5);}while((a%10)>=(b%10));return mcq(a+" − "+b+" = ?",a-b);}},
 sumas3:{name:"Sumas de 3 cifras",emoji:"🧮",prompt:"sumas de 3 cifras (100-999) para niño de 7 años",
   fallback:()=>{const a=100+rnd(400),b=100+rnd(400);return mcq(a+" + "+b+" = ?",a+b);}},
 multi:{name:"Inicio multiplicación",emoji:"✖️",prompt:"multiplicaciones muy fáciles (tablas del 2, 3 y 5, factores hasta 5) explicadas como grupos, para niño de 7 años",
   fallback:()=>{const tablas=diffMax([[2],[2,5],[2,3,5],[2,3,4,5],[2,3,4,5,6,10]]);const t=pick(tablas),n=1+rnd(diffMax([3,4,5,5,9]));return mcq(t+" × "+n+" = ?",t*n,t+" grupos de "+n);}},
 ordinales:{name:"Ordinales",emoji:"🥇",prompt:"preguntas de números ordinales (primero a décimo) con ejemplos de carreras o filas, para niño de 6-7 años",
   fallback:()=>pick([mcq("Si llegas después del 1°, ¿en qué lugar vas?","2°",null,["2°","3°","1°"]),mcq("El que gana la carrera llega…","1°",null,["1°","3°","5°"]),mcq("Después del 3° viene el…","4°",null,["4°","2°","5°"])])},
 izqder:{name:"Ubicación",emoji:"↔️",prompt:"preguntas sobre izquierda/derecha, arriba/abajo y sobre/debajo de objetos, con animalitos y emojis, para niño de 6 años",
   fallback:()=>genSpatial()},
 mayorMenor:{name:"Mayor y menor",emoji:"🐊",prompt:"comparar números con mayor que (>), menor que (<) e igual (=), números hasta 100, explicado como el cocodrilo que se come al más grande, para niño de 6-7 años",
   fallback:()=>genCompare()},
 diasES:{name:"Días (español)",emoji:"📅",prompt:"preguntas sobre los días de la semana en español (orden, antes/después) para niño de 6-7 años",
   fallback:()=>pick([mcq("¿Qué día viene después del lunes?","Martes",null,["Martes","Domingo","Viernes"]),mcq("¿Qué día va antes del sábado?","Viernes",null,["Viernes","Domingo","Lunes"]),mcq("¿Cuántos días tiene la semana?","7",null,["7","5","10"])])},
 mesesES:{name:"Meses (español)",emoji:"🗓️",prompt:"preguntas sobre los meses del año en español (orden, cuál va antes/después) para niño de 7 años",
   fallback:()=>pick([mcq("¿Qué mes viene después de enero?","Febrero",null,["Febrero","Marzo","Diciembre"]),mcq("¿Con qué mes empieza el año?","Enero",null,["Enero","Diciembre","Junio"]),mcq("¿Cuántos meses tiene el año?","12",null,["12","10","7"])])},
 logica:{name:"Lógica",emoji:"🧩",prompt:"acertijos de lógica simple (cuál no pertenece, el más grande, secuencias cortas) con emojis, para niño de 6-7 años",
   fallback:()=>{const q=pick(LOGIC_KID);return{q:q.q,pic:q.scene,ops:q.ops.slice(),a:q.a};}},
 acertijos:{name:"Acertijos",emoji:"🕵️",prompt:"adivinanzas infantiles clásicas en español, cortas, con rima y respuesta de objeto o animal cotidiano, para niño de 6-7 años",
   fallback:()=>genRiddle()},
 ciclo_agua:{name:"Ciclo del agua",emoji:"💧",prompt:"preguntas sobre el ciclo del agua (el sol evapora el agua, se forman las nubes, llueve, el agua vuelve al río y al mar) explicado muy simple para niño de 6-7 años",
   fallback:()=>{const x=pick(CICLO_AGUA_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}},
 cuerpo_es:{name:"El cuerpo",emoji:"🫀",prompt:"preguntas sobre las partes del cuerpo humano y para qué sirven (ojos para ver, oídos para oír, corazón, huesos, pulmones) para niño de 6-7 años",
   fallback:()=>{const x=pick(CUERPO_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}},
 natura:{name:"Naturaleza",emoji:"🌿",prompt:"preguntas de ciencias naturales muy simples (animales y dónde viven, qué necesitan las plantas, día y noche, reciclaje) para niño de 6-7 años",
   fallback:()=>{const x=pick(NATURA_QS);return{q:x.q,ops:x.ops.slice(),a:x.a,pic:x.pic};}},
 secuencias:{name:"Secuencias",emoji:"➡️",prompt:"completar secuencias numéricas con patrones (sumar 2, 4, 5 o 10, o restar de 2 en 2) para niño de 7 años, como '2, 6, 10, 14, ___'",
   fallback:()=>Math.random()<.7?genSecuenciaNum():(()=>{const q=pick(SEQUENCES);return{q:"¿Qué sigue? "+q.show.join(" "),ops:q.ops.slice(),a:q.a};})()},
 sustantivos:{name:"Sustantivos",emoji:"🏷️",prompt:"identificar sustantivos (nombres de personas, animales o cosas) frente a verbos o adjetivos, para niño de 6-7 años de primero",
   fallback:()=>genSustantivo()},
 silabas:{name:"Sílabas trabadas",emoji:"🔤",prompt:"sílabas trabadas o combinadas (fr, br, cr, tr, pl, bl, cl, gl, gr, pr, fl, dr) reconociéndolas en palabras, para niño de 6-7 años",
   fallback:()=>genSilaba()},
 ortografia:{name:"Ortografía",emoji:"✏️",prompt:"escritura correcta de palabras comunes (b/v, c/s/z, ll/y, g/j, h) eligiendo la forma bien escrita, para niño de 7 años",
   fallback:()=>genOrtografia()},
 narracion:{name:"La narración",emoji:"📖",prompt:"elementos de la narración (qué es una narración, personajes, narrador, y los géneros narrativo, dramático y lírico de forma muy simple) para niño de 7 años",
   fallback:()=>genNarracion()},
 numpalabra:{name:"Leer números",emoji:"🔢",prompt:"leer números del 10 al 99 escritos en palabras (por ejemplo 54 = cincuenta y cuatro) para niño de 7 años",
   fallback:()=>genNumPalabra()},
 palabra_num:{name:"Letras a números",emoji:"✍️",prompt:"convertir un número escrito en palabras a su cifra (por ejemplo cincuenta y cuatro = 54), del 10 al 99, para niño de segundo de primaria",
   fallback:()=>genPalabraNum()},
 problemas2:{name:"Problemas",emoji:"🧩",prompt:"problemas matemáticos cortos con contexto de la vida diaria (sumar, restar o multiplicar grupos) con números hasta 99, indicando la técnica (cuándo sumar, restar o multiplicar), para niño de segundo de primaria",
   fallback:()=>genProblema2()},
 cuerpo_partes:{name:"Partes del cuerpo",emoji:"🧍",prompt:"identificar partes del cuerpo y dónde quedan (espalda, codo, rodilla, hombro, tobillo, muñeca, nuca, talón, mejillas, frente, pantorrilla) para niño de segundo de primaria",
   fallback:()=>genCuerpoParte()},
 sistemas:{name:"Sistemas del cuerpo",emoji:"🫀",prompt:"sistemas del cuerpo humano y para qué sirven (respiratorio-pulmones, digestivo-estómago, circulatorio-corazón, óseo-huesos, nervioso-cerebro) para niño de segundo de primaria",
   fallback:()=>genSistema()},
 geografia:{name:"Geografía",emoji:"🌎",prompt:"trivia de geografía para niño de segundo de primaria en Colombia (continentes, océanos, el mapa, la brújula, planeta Tierra, capital de Colombia, países vecinos, montañas, desierto y río) muy sencillo",
   fallback:()=>genGeo()},
 sociales:{name:"Sociales",emoji:"🏙️",prompt:"trivia de ciencias sociales para niño de segundo de primaria en Colombia (normas de convivencia, la familia, profesiones y oficios, símbolos del país, ciudad y campo, cuidar el ambiente, respeto) muy sencillo",
   fallback:()=>genSociales()},
 cultura:{name:"Cultura general",emoji:"💡",prompt:"trivia de cultura general para niño de 7-8 años (animales, naturaleza, datos curiosos sencillos, conteo básico) con una sola respuesta correcta",
   fallback:()=>genCultura()},
 informatica:{name:"Informática",emoji:"💻",prompt:"informática básica para niño de segundo de primaria (mouse, teclado, pantalla, portátil, parlantes, internet, guardar archivos, apps, y seguridad básica en internet) muy sencillo",
   fallback:()=>genInfo()},
 poligonos:{name:"Polígonos",emoji:"🔷",prompt:"tipos de polígonos (triángulo, cuadrado, rectángulo, pentágono, hexágono, octágono, sus lados y vértices, y que el círculo NO es polígono) para niño de segundo de primaria",
   fallback:()=>genPoligono()},
 diagramas:{name:"Diagramas de barras",emoji:"📊",prompt:"leer diagramas de barras sencillos (quién tiene más, quién tiene menos, cuántos tiene alguien, ordenar y clasificar la información del diagrama) para niño de segundo de primaria; describe el diagrama con emojis en el enunciado",
   fallback:()=>genBarrasQ()},
 alimentos:{name:"Los alimentos",emoji:"🥗",prompt:"la pirámide alimenticia, clasificación de los alimentos (frutas, verduras, proteínas, lácteos), qué son los carbohidratos y las grasas, y la cadena alimenticia (herbívoros, carnívoros, omnívoros, las plantas producen su alimento) para niño de segundo de primaria",
   fallback:()=>genAlimentos()},
 tierra:{name:"La Tierra y el espacio",emoji:"🌍",prompt:"la Tierra y sus movimientos (rotación=día y noche, traslación=el año), la Luna, el Sol, las estrellas y el sistema solar (planetas, Mercurio más cerca, Júpiter el más grande) para niño de segundo de primaria",
   fallback:()=>genTierra()},
 banderas:{name:"Banderas",emoji:"🏳️",prompt:"reconocer banderas de países conocidos (Colombia, México, Argentina, Brasil, España, Estados Unidos, Perú, Chile) para niño de segundo de primaria",
   fallback:()=>genBandera()},
 capitales:{name:"Capitales",emoji:"🏛️",prompt:"capitales de países de América Latina y España (Colombia-Bogotá, Perú-Lima, México-Ciudad de México) para niño de segundo de primaria",
   fallback:()=>genCapital()},
 decenas:{name:"Decenas",emoji:"🔟",prompt:"sumas de decenas exactas (10+20, 40+30) para niño de 7 años",
   fallback:()=>genDecenas()},
 tiempo:{name:"El tiempo",emoji:"🕐",prompt:"medición del tiempo (el reloj, 24 horas en un día, 12 meses, 7 días, y los tiempos pasado, presente y futuro) para niño de 7 años",
   fallback:()=>genTiempo()},
 // INGLÉS (con audio)
 en_animals:{name:"Animales (EN)",emoji:"🐶",en:true,prompt:"vocabulario de animales en inglés MUY básicos y conocidos (dog, cat, fish, bird, cow, horse) para niño de 6 años principiante absoluto",
   fallback:()=>enMCQ(EN_VOCAB.animals)},
 en_colors:{name:"Colores (EN)",emoji:"🎨",en:true,prompt:"colores en inglés básicos para niño de 6 años principiante",
   fallback:()=>enMCQ(EN_VOCAB.colors)},
 en_body:{name:"Cuerpo (EN)",emoji:"🧍",en:true,prompt:"partes del cuerpo en inglés básicas (hand, eye, nose, mouth, foot, ear, hair) para niño de 6 años",
   fallback:()=>enMCQ(EN_VOCAB.body)},
 en_house:{name:"La casa (EN)",emoji:"🏠",en:true,prompt:"partes de la casa en inglés básicas (door, window, bed, table, chair, kitchen, bathroom) para niño de 7 años",
   fallback:()=>enMCQ([["door","puerta","🚪"],["window","ventana","🪟"],["bed","cama","🛏️"],["table","mesa","🪑"],["chair","silla","🪑"],["kitchen","cocina","🍳"]])},
 en_numbers:{name:"Números (EN)",emoji:"🔢",en:true,prompt:"números en inglés del 1 al 10 para niño de 6 años",
   fallback:()=>enMCQ(EN_VOCAB.numbers)},
 en_vowels:{name:"Vocales (EN)",emoji:"🔤",en:true,prompt:"las vocales en inglés (a-e-i-o-u) y su sonido, con palabras de ejemplo simples, para niño de 7 años",
   fallback:()=>pick([enMCQ([["apple","manzana","🍎"]]),enMCQ([["egg","huevo","🥚"]]),enMCQ([["orange","naranja","🍊"]])])},
 en_days:{name:"Días (EN)",emoji:"📆",en:true,prompt:"días de la semana en inglés (Monday-Sunday) para niño de 7 años principiante",
   fallback:()=>enMCQ([["Monday","lunes","1️⃣"],["Tuesday","martes","2️⃣"],["Friday","viernes","5️⃣"],["Sunday","domingo","☀️"]])},
 en_phrases:{name:"Frases (EN)",emoji:"💬",en:true,prompt:"frases de saludo y cortesía MUY básicas en inglés (hello, thank you, good morning) para niño de 6-7 años",
   fallback:()=>{const p=pick(EN_PHRASES);return enMCQ([[p[0],p[1],"💬"]]);}}
};
/* helpers para construir preguntas */
function mcq(q,ans,hint,fixedOps){
 let ops;
 if(fixedOps)ops=fixedOps.slice();
 else{const set=new Set([ans]);while(set.size<3){const d=ans+(1+rnd(5))*(Math.random()<.5?-1:1);if(d>=0)set.add(d);}ops=[...set].map(String);}
 ops=shuffled(ops);return{q,ops,a:ops.indexOf(String(ans)),hint};}
function enMCQ(pool){const w=pick(pool);return{q:'¿Qué significa "'+w[0]+'"?',ops:shuffled([w[1],...pickN(["perro","casa","sol","agua","rojo","mano","mesa","cinco","gato","leche"].filter(x=>x!==w[1]),2)]),a:-1,word:w[0],pic:w[2]||"🔊",es:w[1],en:true,fixAns:w[1]};}
function pickN(arr,n){return shuffled(arr).slice(0,n);}

/* dominio adaptativo: registra desempeño por tema y decide cuál sale */
function topicMastery(){const p=prof();if(!p.mastery)p.mastery={};return p.mastery;}
function recordTopic(topic,correct){const m=topicMastery();
 if(!m[topic])m[topic]={n:0,ok:0,streak:0};
 m[topic].n++;if(correct){m[topic].ok++;m[topic].streak++;}else m[topic].streak=0;save();}
function weakestTopics(keys,count){
 const m=topicMastery();
 const scored=keys.map(k=>{const s=m[k];const rate=s&&s.n>=3?s.ok/s.n:0.5;const seen=s?s.n:0;
  // peso: prioriza baja tasa de acierto y temas poco vistos
  return{k,w:(1-rate)*2 + (seen<3?1:0) + Math.random()*0.4};});
 scored.sort((a,b)=>b.w-a.w);
 return scored.slice(0,count).map(s=>s.k);}

/* generar una tanda de retos de un tema (IA si hay clave, si no fallback) */
/* memoria de lo ya preguntado por la IA, para NO repetir (por tema) */
function aiSeenList(topicKey){if(!S.aiSeen)S.aiSeen={};if(!S.aiSeen[topicKey])S.aiSeen[topicKey]=[];return S.aiSeen[topicKey];}
function aiRemember(topicKey,texts){const l=aiSeenList(topicKey);texts.forEach(t=>{const k=String(t).toLowerCase().trim();if(k&&!l.includes(k))l.push(k);});while(l.length>40)l.shift();save();}
async function buildChallenges(topicKey,n){
 const topic=KID_TOPICS[topicKey];
 if(S.geminiKey){
  try{
   const seen=aiSeenList(topicKey);
   const avoid=seen.slice(-18);
   const variedad=["la vida diaria","animales","comida","juguetes","deportes","la familia","la naturaleza","la escuela"][Math.floor(Math.random()*8)];
   const noRepetir=avoid.length?(' MUY IMPORTANTE: NO repitas ni parafrasees estas preguntas que ya se usaron: '+avoid.map(q=>'"'+q+'"').join("; ")+'. Inventa preguntas DISTINTAS y frescas.'):'';
   const obj=await geminiJSON('Eres un tutor de primaria. Crea '+n+' preguntas de opción múltiple NUEVAS y variadas sobre: '+topic.prompt+'. Usa contextos variados (por ejemplo: '+variedad+') para que cada vez sean diferentes. Ajusta la dificultad al nivel '+adlvl()+' de 5 (1 muy fácil, 5 reto) según cómo va el niño. Cada una con 3 opciones y una sola correcta. Lenguaje español sencillo y frases cortas.'+noRepetir+' Responde SOLO JSON válido sin markdown: {"items":[{"q":"pregunta","ops":["correcta","incorrecta","incorrecta"],"a":0}]} . El índice "a" indica cuál opción es correcta.');
   if(obj.items&&obj.items.length){
    let items=obj.items.map(it=>{
     const q=stripHTML(it.q);
     const opsClean=(it.ops||[]).map(o=>stripHTML(o));
     const correct=opsClean[it.a];const ops=shuffled(opsClean);
     return{q,ops,a:ops.indexOf(correct),word:topic.en?firstEnWord(q):null};});
    // descarta las que ya salieron antes
    const fresh=items.filter(it=>!seen.includes(String(it.q).toLowerCase().trim()));
    const finalItems=fresh.length?fresh:items;
    aiRemember(topicKey,finalItems.map(it=>it.q));
    return finalItems;}
  }catch(e){/* cae al fallback */}
 }
 // fallback fijo (sin clave): evita repetir el inmediato anterior
 const out=[];let last=null;
 for(let i=0;i<n;i++){let f,guard=0;do{f=topic.fallback();guard++;}while(last&&f.q===last&&guard<6);last=f.q;
  if(f.a===-1&&f.fixAns!==undefined)f.a=f.ops.indexOf(f.fixAns);
  out.push(f);}
 return out;}
function firstEnWord(q){const m=q.match(/"([A-Za-z]+)"/);return m?m[1]:null;}

/* ============ GAMIFICACIÓN ============ */
function touchDay(){const p=prof(),t=todayStr();
 if(p.lastDay!==t){const y=new Date();y.setDate(y.getDate()-1);
  const ys=y.getFullYear()+"-"+String(y.getMonth()+1).padStart(2,"0")+"-"+String(y.getDate()).padStart(2,"0");
  p.streak=(p.lastDay===ys)?p.streak+1:1;p.lastDay=t;}
 if(!p.days[t])p.days[t]={ex:0,ok:0,sec:0,missions:[],games:0};
 return p.days[t];}
/* dificultad automática (1 fácil … 5 reto) según el desempeño reciente */
function adlvl(){const p=prof();return p&&p.autoLevel?p.autoLevel:2;}
function diffMax(arr){return arr[Math.min(arr.length-1,adlvl()-1)];}
function recordAnswer(subject,correct,secs){const p=prof(),d=touchDay();
 if(!p.stats[subject])p.stats[subject]={attempts:0,correct:0,sec:0};
 p.stats[subject].attempts++;d.ex++;p.stats[subject].sec+=(secs||0);d.sec+=(secs||0);
 if(correct){p.stats[subject].correct++;d.ok++;p.coins+=2;p.xp+=5;}else p.xp+=1;
 // ajuste automático de dificultad según las últimas ~24 respuestas
 if(!p.recent)p.recent=[];
 p.recent.push(correct?1:0);if(p.recent.length>24)p.recent.shift();
 if(p.recent.length>=8){const rate=p.recent.reduce((a,b)=>a+b,0)/p.recent.length;
  p.autoLevel=rate>=0.85?5:rate>=0.7?4:rate>=0.55?3:rate>=0.4?2:1;}
 else if(!p.autoLevel)p.autoLevel=2;
 // señales de apoyo (solo niño): tiempos altos y errores por área
 if(profType()==="kid"){
  if(!p.signals)p.signals={read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0},nat:{n:0,err:0}};
  if(!p.signals.nat)p.signals.nat={n:0,err:0};
  if(!p.signals.soc)p.signals.soc={n:0,err:0};
  const readSubj=["Comprensión","Letras","Ordenar","Sustantivos","Sílabas trabadas","Ortografía","La narración"].includes(subject);
  const mathSubj=["Mate","Problemas","Números","Sumas","Restas","Restas prestando","Sumas de 3 cifras","Inicio multiplicación","Mayor y menor","Globos","Leer números","Letras a números","Decenas"].includes(subject);
  const enSubj=["Inglés","Pronunciación"].includes(subject);
  const seqSubj=["Secuencias","Lógica","Acertijos","Ordinales","Ubicación","Robot","Memoria","El tiempo","Detective"].includes(subject);
  const natSubj=["Ciclo del agua","El cuerpo","La naturaleza","Partes del cuerpo","Sistemas del cuerpo"].includes(subject);
  const socSubj=["Geografía","Sociales","Cultura general","Informática","Banderas","Capitales"].includes(subject);
  if(readSubj){p.signals.read.n++;if(secs>=25)p.signals.read.slow++;if(!correct)p.signals.read.err++;}
  if(mathSubj){p.signals.math.n++;if(!correct)p.signals.math.err++;}
  if(enSubj){p.signals.en.n++;if(!correct)p.signals.en.err++;d.enDone=true;}
  if(seqSubj){p.signals.seq.n++;if(!correct)p.signals.seq.err++;}
  if(natSubj){p.signals.nat.n++;if(!correct)p.signals.nat.err++;}
  if(socSubj){p.signals.soc.n++;if(!correct)p.signals.soc.err++;}
 }
 save();}
function level(xp){return Math.floor(Math.sqrt(xp/20))+1;}
function setTheme(t){document.body.className=t;if(typeof boardFabHide==="function")boardFabHide();}
function render(h){app.innerHTML=h;window.scrollTo(0,0);}
/* detiene cualquier juego con temporizador/animación en curso (evita que sigan corriendo al salir) */
function stopGames(){
 try{if(typeof HG!=="undefined")clearInterval(HG.timer);}catch(e){}
 try{if(typeof TG!=="undefined"){clearInterval(TG.spawn);clearInterval(TG.timer);cancelAnimationFrame(TG.raf);TG.over=true;}}catch(e){}
 try{if(typeof RC!=="undefined"){clearInterval(RC.loop);cancelAnimationFrame(RC.raf);RC.over=true;}}catch(e){}
 try{if(typeof GR!=="undefined"){clearInterval(GR.loop);cancelAnimationFrame(GR.raf);GR.over=true;}}catch(e){}
 try{if(typeof QZ!=="undefined")clearInterval(QZ.tick);}catch(e){}
 try{if(typeof SN!=="undefined"){clearInterval(SN.timer);SN.started=false;}}catch(e){}
 try{if(typeof BL!=="undefined"){clearTimeout(BL.timer);BL.done=true;}}catch(e){}
 try{if(typeof DJ!=="undefined")DJ.run=false;}catch(e){}
 try{if(typeof SI!=="undefined")SI.lock=true;}catch(e){}
 try{if(typeof OB!=="undefined")OB.done=true;}catch(e){}
 try{if(typeof HG!=="undefined")HG.done=true;}catch(e){}}
/* sale de un juego con confirmación (la flecha de atrás de los juegos) */
function exitGame(target){
 if(!confirm("¿Salir del juego? Se perderá el avance de este juego."))return;
 stopGames();
 if(typeof target==="function")return target();
 if(target==="games"&&typeof screenGamesPick==="function")return screenGamesPick();
 if(typeof screenKidMap==="function")return screenKidMap();}
function topbar(backFn){const p=prof();
 return '<div class="topbar">'+(backFn?'<button class="back" onclick="'+backFn+'">←</button>':'')
 +'<span class="pill">🔥 '+p.streak+'</span><span class="pill">🪙 '+p.coins+'</span><span class="pill">⭐ Nv '+level(p.xp)+'</span>'
 +'<span class="pill" style="cursor:pointer" title="Sonido" onclick="toggleMute(this)">'+(muted()?"🔇":"🔊")+'</span></div>';}
