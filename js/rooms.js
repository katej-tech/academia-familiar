"use strict";
/* ============ SALAS EN LÍNEA (multijugador entre dispositivos) ============
   Pedido: «salas de juego multiusuario para jugar en línea».
   · Un jugador CREA la sala y comparte el código de 4 letras; los demás se UNEN con ese código desde su dispositivo.
   · Juego: «Carrera de aciertos» de 90 segundos. Cada quien responde preguntas DE SU NIVEL (el niño las del cole,
     la adolescente factorización / inglés / ciencias), así pueden competir juntos aunque tengan edades distintas.
   · Seguridad para menores: solo entra quien tenga el código, hay que haber iniciado sesión en la app y NO hay chat:
     lo único que se comparte es el nombre del perfil, su emoji y el puntaje.
   Transporte: Firestore, colección `rooms/{código}` (requiere una regla nueva en Firebase: ver Panel de padres).
   En localhost hay un transporte local (BroadcastChannel) para probar con dos pestañas sin nube.
   No se registra en stopGames: cada pantalla de la sala lleva #salaRoot y, si ya no está, la sala se abandona sola. */

const SALA_DUR=90;
let SALA={};
function salaPid(){let d=null;try{d=localStorage.getItem("afDev");if(!d){d=Math.random().toString(36).slice(2,10);localStorage.setItem("afDev",d);}}catch(e){d="x"+Math.random().toString(36).slice(2,8);}
 return d+"_"+String((typeof current!=="undefined"&&current.profile)||"p").replace(/[^A-Za-z0-9]/g,"");}
function salaCloud(){return typeof afUser==="function"&&!!afUser()&&typeof afDB!=="undefined"&&!!afDB;}
function salaLocal(){return /^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&"BroadcastChannel"in window;}
function salaMe(){const p=prof();return{n:String(p.name||"Jugador").slice(0,14),e:p.emoji||"🙂",s:0,ok:0,done:false,t:Date.now()};}

/* ---------- transporte ---------- */
const SALA_NET={
 cloud:{
  ref:function(code){return afDB.collection("rooms").doc(code);},
  create:function(code,data){return this.ref(code).set(data);},
  get:function(code){return this.ref(code).get().then(function(s){return s.exists?s.data():null;});},
  patch:function(code,patch){return this.ref(code).update(patch);},
  remove:function(code){return this.ref(code).delete();},
  delField:function(){return firebase.firestore.FieldValue.delete();},
  listen:function(code,cb){return this.ref(code).onSnapshot(function(s){cb(s.exists?s.data():null);},function(err){cb(null,err);});}},
 local:{
  key:function(code){return"afRoom_"+code;},
  ch:function(){if(!SALA_NET.local._ch)SALA_NET.local._ch=new BroadcastChannel("afRooms");return SALA_NET.local._ch;},
  read:function(code){try{return JSON.parse(localStorage.getItem(this.key(code))||"null");}catch(e){return null;}},
  write:function(code,d){if(d)localStorage.setItem(this.key(code),JSON.stringify(d));else localStorage.removeItem(this.key(code));this.ch().postMessage({code:code});if(SALA_NET.local._cb&&SALA_NET.local._code===code)SALA_NET.local._cb(d);},
  create:function(code,data){this.write(code,data);return Promise.resolve();},
  get:function(code){return Promise.resolve(this.read(code));},
  patch:function(code,patch){const d=this.read(code);if(!d)return Promise.reject(new Error("no existe"));
   Object.keys(patch).forEach(function(k){const path=k.split(".");let o=d;for(let i=0;i<path.length-1;i++){if(!o[path[i]])o[path[i]]={};o=o[path[i]];}
    if(patch[k]==="__DEL__")delete o[path[path.length-1]];else o[path[path.length-1]]=patch[k];});
   this.write(code,d);return Promise.resolve();},
  remove:function(code){this.write(code,null);return Promise.resolve();},
  delField:function(){return"__DEL__";},
  listen:function(code,cb){const self=this;self._cb=cb;self._code=code;const h=function(ev){if(ev.data&&ev.data.code===code)cb(self.read(code));};self.ch().addEventListener("message",h);setTimeout(function(){cb(self.read(code));},0);
   return function(){self.ch().removeEventListener("message",h);self._cb=null;};}}};
function salaNet(){return salaCloud()?SALA_NET.cloud:(salaLocal()?SALA_NET.local:null);}
function salaErr(e){const c=(e&&(e.code||e.message))||"";
 if(/permission|insufficient/i.test(c))return"Falta activar las salas en Firebase. Papá o mamá: mira «🌐 Salas en línea» en el Panel de padres.";
 if(/unavailable|network|offline/i.test(c))return"Sin conexión a internet.";
 return"No se pudo conectar con la sala. Intenta de nuevo.";}

/* ---------- pantallas de entrada ---------- */
function screenSalas(msg){setTheme(profType()==="kid"?"kid":"teen");
 salaLeave(true);
 const net=salaNet(),teen=profType()!=="kid",B=teen?"tbtn":"kbtn",back=profType()==="adulto"?"screenAdultHome()":teen?"screenTeenHome()":"screenKidMap()";
 const intro='<div class="card" style="line-height:1.55"><b>🌐 Juega con tu familia desde otro celular o tablet.</b><br>Uno crea la sala y comparte el <b>código</b>; los demás se unen. Juegan a <b>Conquista del saber</b>: un mapa con castillos donde ganas territorios respondiendo preguntas <b>de tu nivel</b> (cada quien las suyas). También hay una carrera rápida de 90 segundos.</div>';
 if(!net)return render(topbar(back)+'<h2 style="margin-bottom:8px">🌐 Salas en línea</h2>'+intro
  +'<div class="card" style="line-height:1.55">🔑 Para jugar en línea hay que <b>iniciar sesión</b> con la cuenta de la familia (Panel de padres → Cuenta en la nube) en cada dispositivo y tener internet.</div>');
 render(topbar(back)+'<div id="salaRoot"></div><h2 style="margin-bottom:8px">🌐 Salas en línea</h2>'+intro
  +(msg?'<div class="card" style="border-color:#DC2626;color:#B91C1C;line-height:1.5">⚠️ '+esc(msg)+'</div>':'')
  +'<button class="'+B+(teen?" acc":" green")+'" style="text-align:center" onclick="salaCreate()">➕ Crear una sala</button>'
  +'<div class="card"><b>Unirme con un código</b><input id="salaCode" maxlength="4" autocapitalize="characters" autocomplete="off" placeholder="ABCD" style="width:100%;margin:8px 0;padding:12px;border-radius:14px;border:2px solid #CBD5E1;font-size:1.6rem;text-align:center;letter-spacing:.4em;text-transform:uppercase;box-sizing:border-box;font-weight:800">'
  +'<button class="'+B+(teen?"":" blue")+'" style="text-align:center;margin:0" onclick="salaJoin()">🚪 Entrar a la sala</button></div>'
  +(net===SALA_NET.local?'<p class="mut" style="font-size:.78rem">Modo de prueba local (dos pestañas en este mismo equipo).</p>':''));}
function salaNewCode(){const A="ABCDEFGHJKLMNPQRSTUVWXYZ";let c="";for(let i=0;i<4;i++)c+=A[Math.floor(Math.random()*A.length)];return c;}
function salaCreate(){
 const net=salaNet();if(!net)return screenSalas();
 const code=salaNewCode(),pid=salaPid(),players={};players[pid]=salaMe();
 net.create(code,{code:code,host:pid,state:"lobby",round:0,dur:SALA_DUR,createdAt:Date.now(),players:players})
  .then(function(){salaEnter(code,true);}).catch(function(e){screenSalas(salaErr(e));});}
function salaJoin(){
 const net=salaNet();if(!net)return screenSalas();
 const code=String((document.getElementById("salaCode")||{}).value||"").toUpperCase().replace(/[^A-Z]/g,"");
 if(code.length!==4)return screenSalas("Escribe el código de 4 letras.");
 net.get(code).then(function(d){
  if(!d)return screenSalas("No existe una sala con el código "+code+".");
  if(Object.keys(d.players||{}).length>=8&&!d.players[salaPid()])return screenSalas("La sala está llena (máximo 8).");
  const patch={};patch["players."+salaPid()]=salaMe();
  return net.patch(code,patch).then(function(){salaEnter(code,false);});
 }).catch(function(e){screenSalas(salaErr(e));});}
function salaEnter(code,host){
 const net=salaNet();SALA={code:code,pid:salaPid(),host:host,net:net,phase:"lobby",round:0,data:null};
 SALA.unsub=net.listen(code,function(d,err){salaOnData(d,err);});}
function salaLeave(silent){
 if(!SALA||!SALA.code){SALA={};return;}
 const S0=SALA;SALA={};
 try{if(S0.tick)clearInterval(S0.tick);if(S0.unsub)S0.unsub();if(typeof conqStop==="function")conqStop();}catch(e){}
 try{if(S0.host)S0.net.remove(S0.code);else{const patch={};patch["players."+S0.pid]=S0.net.delField();S0.net.patch(S0.code,patch).catch(function(){});}}catch(e){}
 if(!silent)screenSalas();}

/* ---------- sincronización ---------- */
function salaOnData(d,err){
 if(!SALA.code)return;
 if(!document.getElementById("salaRoot")){salaLeave(true);return;} /* el jugador se fue a otra pantalla */
 if(err||!d){const m=err?salaErr(err):"El anfitrión cerró la sala.";salaLeave(true);return screenSalas(m);}
 SALA.data=d;SALA.host=d.host===SALA.pid;
 if(d.state==="play"&&d.game==="conq"){if(SALA.tick){clearInterval(SALA.tick);SALA.tick=null;}if(SALA.round!==d.round){SALA.round=d.round;if(typeof CQ!=="undefined"){const h=CQH;CQ={};CQH=h;}}SALA.phase="conq";conqOnData(d);return;}
 if(d.state==="play"&&d.round!==SALA.round){SALA.round=d.round;salaStartGame();return;}
 if(d.state==="lobby"){if(SALA.phase==="conq"&&typeof conqStop==="function")conqStop();if(SALA.phase!=="lobby"||true){SALA.phase="lobby";if(SALA.tick){clearInterval(SALA.tick);SALA.tick=null;}salaLobby();}return;}
 if(SALA.phase==="play")salaRankDraw();
 else if(SALA.phase==="end")salaResults();}
function salaPlayers(){const d=SALA.data||{},P=d.players||{};return Object.keys(P).map(function(k){return Object.assign({id:k},P[k]);}).sort(function(a,b){return(b.s||0)-(a.s||0)||(a.n>b.n?1:-1);});}
function salaTheme(){const teen=profType()!=="kid";setTheme(teen?"teen":"kid");return{teen:teen,B:teen?"tbtn":"kbtn"};}
function salaLobby(){
 const T=salaTheme(),ps=salaPlayers();
 render(topbar("salaLeave()")+'<div id="salaRoot"></div>'
  +'<div class="card center" style="padding:16px"><div class="mut" style="font-size:.9rem">Código de la sala</div><div style="font-size:3rem;font-weight:900;letter-spacing:.3em;font-family:Fredoka,sans-serif">'+esc(SALA.code)+'</div><div class="mut" style="font-size:.85rem">Compártelo con quien va a jugar</div></div>'
  +'<div class="card"><b>Jugadores ('+ps.length+')</b>'+ps.map(function(p){return '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-weight:700"><span style="font-size:1.5rem">'+esc(p.e)+'</span><span style="flex:1">'+esc(p.n)+(p.id===SALA.pid?" (tú)":"")+'</span>'+(p.id===(SALA.data||{}).host?'<span class="mut" style="font-size:.8rem">anfitrión</span>':'')+'</div>';}).join("")+'</div>'
  +(SALA.host?'<button class="'+T.B+(T.teen?" acc":" green")+'" style="text-align:center" onclick="conqHostStart()">🗺️ Jugar Conquista del saber'+(ps.filter(function(p){return !p.bot;}).length<3?" (con bots)":"")+'</button><button class="'+T.B+(T.teen?"":" blue")+'" style="text-align:center" onclick="salaHostStart()">🏁 Carrera de aciertos (90 s)</button>':'<div class="card center"><span class="spin">⏳</span> Esperando a que el anfitrión empiece…</div>')
  +'<button class="'+T.B+(T.teen?"":" white")+'" style="text-align:center" onclick="salaLeave()">Salir de la sala</button>');}
function salaHostStart(){
 if(!SALA.host||!SALA.data)return;
 const patch={state:"play",game:"race",round:(SALA.data.round||0)+1,startedAt:Date.now()};
 Object.keys(SALA.data.players||{}).forEach(function(k){patch["players."+k+".s"]=0;patch["players."+k+".ok"]=0;patch["players."+k+".done"]=false;});
 SALA.net.patch(SALA.code,patch).catch(function(e){toast(salaErr(e),false,2600);});}

/* ---------- preguntas según el perfil ---------- */
function salaQuestion(){
 const teen=profType()!=="kid";
 for(let g=0;g<8;g++){
  try{
   if(teen){
    const r=Math.random();
    if(r<.38&&typeof facNewQ==="function"){const q=facNewQ("mix");return{q:'<span style="font-size:.85rem;opacity:.8">Factoriza:</span><br>'+q.q,ops:q.ops.map(function(o,i){return{h:o.h,ok:i===q.a};})};}
    if(r<.76&&typeof enhPool==="function"){const pool=enhPool(),x=pick(pool),others=shuffled(pool.filter(function(y){return y[1]!==x[1];})).slice(0,3);
     return{q:"🇬🇧 "+esc(x[0]),ops:shuffled([{h:esc(x[1]),ok:true}].concat(others.map(function(y){return{h:esc(y[1]),ok:false};})))};}
    const banks=[typeof B_GRAMMAR!=="undefined"?B_GRAMMAR:null,typeof B_LOGICA!=="undefined"?B_LOGICA:null,typeof B_FISICA!=="undefined"?B_FISICA:null,typeof B_QUIMICA!=="undefined"?B_QUIMICA:null].filter(Boolean);
    const it=pick(pick(banks));if(!it||it.code||it.t)continue;
    return{q:esc(stripHTML(it.q)),ops:shuffled(it.ops.map(function(o,i){return{h:esc(o),ok:i===it.a};}))};}
   if(typeof wrlQ==="function"){const q=wrlQ({topic:pick(["mate","leng","cien","soc","tiempo","logi"]),lv:1},null);
    if(!q||!q.ops||q.typed||q.say&&/Listen/.test(q.q))continue;
    return{q:(q.pic&&String(q.pic).charAt(0)!=="<"?'<div style="font-size:2rem">'+q.pic+'</div>':(q.pic||""))+String(q.q).replace(/[<>]/g,""),ops:q.ops.map(function(o){return{h:esc(o.t),ok:!!o.ok};})};}
  }catch(e){}}
 const a=2+Math.floor(Math.random()*8),b=2+Math.floor(Math.random()*8);
 return{q:a+" + "+b+" = ?",ops:shuffled([a+b,a+b+1,a+b-1,a+b+2].map(function(n){return{h:String(n),ok:n===a+b};}))};}

/* ---------- la carrera ---------- */
function salaStartGame(){
 if(SALA.tick)clearInterval(SALA.tick);
 SALA.phase="count";SALA.score=0;SALA.ok=0;SALA.streak=0;SALA.left=(SALA.data.dur||SALA_DUR);SALA.count=3;
 const T=salaTheme();
 render(topbar("salaLeave()")+'<div id="salaRoot"></div><div class="card center" style="padding:40px 16px"><div id="salaCount" style="font-size:5rem;font-weight:900;font-family:Fredoka,sans-serif">3</div><p>¡Prepárate! Cada acierto suma puntos.</p></div>');
 SALA.tick=setInterval(function(){
  if(!document.getElementById("salaRoot")){salaLeave(true);return;}
  if(SALA.phase==="count"){SALA.count-=.25;const el=document.getElementById("salaCount");if(el)el.textContent=SALA.count>0?Math.ceil(SALA.count):"¡YA!";
   if(SALA.count<=-.5){SALA.phase="play";salaNextQ();}return;}
  if(SALA.phase!=="play")return;
  SALA.left-=.25;const tb=document.getElementById("salaT");if(tb)tb.style.width=Math.max(0,SALA.left/(SALA.data.dur||SALA_DUR)*100)+"%";
  if(SALA.left<=0){clearInterval(SALA.tick);SALA.tick=null;salaFinish();}},250);}
function salaNextQ(){
 if(SALA.phase!=="play")return;
 const T=salaTheme(),q=SALA.q=salaQuestion();SALA.lock=false;
 render(topbar("salaLeave()")+'<div id="salaRoot"></div>'
  +'<div style="display:flex;justify-content:space-between;align-items:center;font-weight:800"><span>🌐 '+esc(SALA.code)+'</span><span>⭐ '+SALA.score+' pts'+(SALA.streak>=2?" · 🔥x"+SALA.streak:"")+'</span></div>'
  +'<div class="timerbar"><div id="salaT" style="width:'+Math.max(0,SALA.left/(SALA.data.dur||SALA_DUR)*100)+'%"></div></div>'
  +'<div class="'+(T.teen?"bigq":"bigq center")+'" style="line-height:1.5">'+q.q+'</div>'
  +q.ops.map(function(o,i){return '<button class="'+T.B+(T.teen?" opt":" white")+'" id="salaO'+i+'" style="'+(T.teen?"":"min-height:52px;font-size:1.1rem")+'" onclick="salaAns('+i+')">'+o.h+'</button>';}).join("")
  +'<div id="salaRank"></div>');
 salaRankDraw();}
function salaAns(i){
 if(SALA.phase!=="play"||SALA.lock)return;SALA.lock=true;
 const o=SALA.q.ops[i],b=document.getElementById("salaO"+i);
 recordAnswer("Salas en línea",!!o.ok,5);
 if(o.ok){SALA.streak++;SALA.ok++;SALA.score+=10+Math.min(5,SALA.streak-1);sOK();if(b){b.style.background="#86EFAC";b.style.color="#14532D";}salaPush();setTimeout(salaNextQ,350);}
 else{SALA.streak=0;sNO();if(b){b.style.background="#FCA5A5";b.style.color="#7F1D1D";}
  const r=SALA.q.ops.findIndex(function(x){return x.ok;}),rb=document.getElementById("salaO"+r);if(rb){rb.style.outline="3px solid #16A34A";}
  setTimeout(salaNextQ,1300);}}
function salaPush(done){
 if(!SALA.code)return;const patch={};patch["players."+SALA.pid+".s"]=SALA.score;patch["players."+SALA.pid+".ok"]=SALA.ok;patch["players."+SALA.pid+".t"]=Date.now();
 if(done)patch["players."+SALA.pid+".done"]=true;
 SALA.net.patch(SALA.code,patch).catch(function(){});}
function salaRankDraw(){
 const el=document.getElementById("salaRank");if(!el)return;const ps=salaPlayers();
 const max=Math.max(10,ps.reduce(function(m,p){return Math.max(m,p.id===SALA.pid?SALA.score:(p.s||0));},0));
 el.innerHTML='<div style="margin-top:10px;display:grid;gap:4px">'+ps.map(function(p){const s=p.id===SALA.pid?SALA.score:(p.s||0);
  return '<div style="display:flex;align-items:center;gap:6px;font-size:.8rem;font-weight:700"><span>'+esc(p.e)+'</span><span style="width:70px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">'+esc(p.n)+'</span><div style="flex:1;height:10px;border-radius:6px;background:rgba(148,163,184,.3);overflow:hidden"><div style="height:100%;width:'+Math.round(s/max*100)+'%;background:'+(p.id===SALA.pid?"#22C55E":"#6366F1")+'"></div></div><span style="width:34px;text-align:right">'+s+'</span></div>';}).join("")+'</div>';}
function salaFinish(){
 SALA.phase="end";salaPush(true);
 const p=prof();p.coins+=Math.round(SALA.score/20);p.xp+=SALA.ok*3;save();
 try{sWIN();}catch(e){}
 salaResults();}
function salaResults(){
 if(SALA.phase!=="end")return;
 const T=salaTheme(),ps=salaPlayers().map(function(p){return p.id===SALA.pid?Object.assign({},p,{s:SALA.score,done:true}):p;}).sort(function(a,b){return(b.s||0)-(a.s||0);});
 const all=ps.every(function(p){return p.done;}),mine=ps.findIndex(function(p){return p.id===SALA.pid;})+1;
 if(all&&mine===1&&ps.length>1&&!SALA.cheered){SALA.cheered=true;try{confetti(30);}catch(e){}}
 render(topbar("salaLeave()")+'<div id="salaRoot"></div>'
  +'<div class="card center"><div style="font-size:2.6rem">'+(all?(mine===1?"🏆":"🏅"):"⏳")+'</div><h2 style="margin:4px 0">'+(all?(mine===1&&ps.length>1?"¡Ganaste la carrera!":"¡Carrera terminada!"):"Esperando a los demás…")+'</h2>'
  +'<div style="max-width:320px;margin:10px auto;text-align:left">'+ps.map(function(p,i){return '<div style="display:flex;gap:8px;align-items:center;padding:5px 0;font-weight:'+(p.id===SALA.pid?800:600)+'"><span style="font-size:1.3rem">'+(["🥇","🥈","🥉"][i]||(i+1)+".")+'</span><span style="font-size:1.3rem">'+esc(p.e)+'</span><span style="flex:1">'+esc(p.n)+'</span><span>'+(p.s||0)+' pts'+(p.done?"":" …")+'</span></div>';}).join("")+'</div>'
  +'<p class="mut" style="font-size:.88rem">Tú: '+SALA.ok+' aciertos</p></div>'
  +(SALA.host?'<button class="'+T.B+(T.teen?" acc":" green")+'" style="text-align:center" onclick="salaAgain()">🔁 Otra ronda</button>':'<div class="card center mut">El anfitrión puede iniciar otra ronda.</div>')
  +'<button class="'+T.B+(T.teen?"":" white")+'" style="text-align:center" onclick="salaLeave()">Salir de la sala</button>');}
function salaAgain(){if(!SALA.host)return;SALA.cheered=false;SALA.net.patch(SALA.code,{state:"lobby"}).catch(function(e){toast(salaErr(e),false,2400);});}

/* ---------- ayuda para activar (Panel de padres) ---------- */
const SALA_RULE="match /rooms/{code} {\n  allow read, write: if request.auth != null;\n}";
function salaParentCardHTML(){
 return '<div class="card"><h3>🌐 Salas en línea (jugar entre dispositivos)</h3>'
  +'<p class="mut" style="margin:8px 0;line-height:1.6">Para que funcionen hay que agregar <b>una regla</b> en Firebase, una sola vez: <b>console.firebase.google.com</b> → proyecto <b>academia-familiar</b> → <b>Firestore Database</b> → pestaña <b>Reglas</b>. Pega esto <b>dentro</b> del bloque <code>match /databases/{database}/documents { … }</code> (sin borrar lo que ya hay) y pulsa <b>Publicar</b>:</p>'
  +'<pre id="salaRule" style="background:#F1F5F9;border-radius:10px;padding:10px;font-size:.82rem;overflow:auto">'+esc(SALA_RULE)+'</pre>'
  +'<button class="pbtn ghost" onclick="salaCopyRule()">📋 Copiar la regla</button>'
  +'<p class="mut" style="margin-top:8px;line-height:1.6;font-size:.85rem">Seguridad: solo entra quien tenga el código de la sala y haya iniciado sesión en la app. No hay chat; solo se ven el nombre del perfil, su emoji y el puntaje.</p></div>';}
function salaCopyRule(){try{navigator.clipboard.writeText(SALA_RULE).then(function(){toast("Regla copiada 📋",true,1400);});}catch(e){toast("Selecciona el texto y cópialo",false,1600);}}
