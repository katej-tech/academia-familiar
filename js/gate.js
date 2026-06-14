"use strict";
/* ============ PORTÓN DE ACCESO (login/registro obligatorio) ============ */
let _gateRouted=false;
function renderSplash(){setTheme("parent");
 render('<div style="margin-top:24vh;text-align:center"><div style="font-size:3.4rem">🏠</div>'
 +'<h1 class="title" style="font-size:1.8rem;margin-top:8px">Academia Familiar</h1>'
 +'<p class="mut" style="margin-top:10px"><span class="spin" style="display:inline-block">⏳</span> Cargando…</p></div>');}
/* decide a dónde entrar según haya o no sesión */
function boot(){
 if(typeof afCloudAvailable==="function"&&afCloudAvailable()){
  renderSplash();
  setTimeout(function(){if(!_gateRouted){if(typeof afUser==="function"&&afUser())screenStart();else screenGate();}},2600);
 }else{
  // sin nube (offline o Firebase no cargó): si ya tuvo cuenta, deja entrar; si no, gate con aviso
  if(S.hasAccount)screenStart();else screenGate();
 }}
/* lo llama firebase-sync en cada cambio de sesión */
function afRoute(u){
 _gateRouted=true;
 if(u){S.hasAccount=true;save();
  if(typeof afPull==="function")afPull(function(){if(current.profile===null&&!document.getElementById("acctbox"))screenStart();});
  else if(current.profile===null)screenStart();
 }else{screenGate();}}
function screenGate(mode){setTheme("parent");current.profile=null;
 const offline=!(typeof afCloudAvailable==="function"&&afCloudAvailable());
 const hero='<div style="text-align:center;margin-top:5vh"><div style="font-size:3rem">🏠</div>'
  +'<h1 class="title" style="font-size:1.9rem;margin-top:4px">Academia Familiar</h1>'
  +'<p class="mut" style="font-size:1.05rem;margin-top:6px">La app donde aprender es un juego</p></div>';
 if(offline){
  return render(hero+'<div class="card" style="margin-top:24px"><h3>Necesitas internet la primera vez</h3>'
   +'<p class="mut" style="margin-top:8px;line-height:1.6">Para crear tu cuenta o iniciar sesión por primera vez necesitas conexión. Después podrás usar la app sin internet.</p>'
   +'<button class="pbtn" onclick="boot()">Reintentar</button></div>');}
 if(mode==="signup"){
  return render(hero+'<div class="card" style="margin-top:22px"><h3>Crear cuenta</h3>'
   +'<p class="mut" style="margin:8px 0 4px">¿Quién eres?</p>'
   +'<div style="display:flex;gap:10px;margin-bottom:8px">'
   +'<button class="pbtn ghost" id="roleP" style="flex:1;margin:0" onclick="gateSetRole(\'parent\')">👨‍👩‍👧 Padre / Madre</button>'
   +'<button class="pbtn ghost" id="roleH" style="flex:1;margin:0" onclick="gateSetRole(\'child\')">🧒 Estudiante</button></div>'
   +'<input type="text" id="gName" placeholder="Tu nombre">'
   +'<input type="email" id="gMail" placeholder="Correo" autocomplete="username">'
   +'<input type="password" id="gPass" placeholder="Contraseña (mínimo 6)" autocomplete="new-password">'
   +'<button class="pbtn" onclick="gateSignup()">Crear cuenta y entrar</button>'
   +'<button class="pbtn ghost" onclick="screenGate(\'login\')">Ya tengo cuenta</button>'
   +'<p id="gfb" style="margin-top:6px"></p></div>');}
 if(mode==="login"){
  return render(hero+'<div class="card" style="margin-top:22px"><h3>Entrar</h3>'
   +'<input type="email" id="gMail" placeholder="Correo" autocomplete="username">'
   +'<input type="password" id="gPass" placeholder="Contraseña" autocomplete="current-password">'
   +'<button class="pbtn" onclick="gateLogin()">Entrar</button>'
   +'<button class="pbtn ghost" onclick="screenGate(\'signup\')">Crear cuenta nueva</button>'
   +'<p id="gfb" style="margin-top:6px"></p></div>');}
 // bienvenida
 return render(hero
  +'<div class="card" style="margin-top:22px"><p style="line-height:1.7">Una plataforma educativa <b>gratuita</b> para que tus hijos aprendan jugando: matemáticas, inglés con voz de A1 a B2, lectura, lógica y decenas de juegos. Con seguimiento del progreso para ti.</p></div>'
  +'<button class="pbtn" onclick="screenGate(\'signup\')">✨ Crear cuenta gratis</button>'
  +'<button class="pbtn ghost" onclick="screenGate(\'login\')">Ya tengo cuenta</button>');}
let _gateRole="parent";
function gateSetRole(r){_gateRole=r;
 const a=document.getElementById("roleP"),b=document.getElementById("roleH");
 if(a)a.style.background=r==="parent"?"var(--par-acc)":"";if(a)a.style.color=r==="parent"?"#fff":"";
 if(b)b.style.background=r==="child"?"var(--par-acc)":"";if(b)b.style.color=r==="child"?"#fff":"";}
function gateSignup(){
 const name=(document.getElementById("gName").value||"").trim();
 const email=(document.getElementById("gMail").value||"").trim();
 const pass=document.getElementById("gPass").value;
 const fb=document.getElementById("gfb");
 if(!name){fb.innerHTML='Escribe tu nombre';return;}
 if(!email||!pass){fb.innerHTML='Escribe tu correo y una contraseña (mínimo 6)';return;}
 fb.innerHTML='⏳ Creando tu cuenta…';
 afSignup(email,pass,function(err){
  if(err){fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';return;}
  S.role=_gateRole;S.ownerName=name;S.hasAccount=true;
  if(_gateRole==="parent"&&S.profiles.nino)S.profiles.nino.name=S.profiles.nino.name||"Explorador";
  save();_gateRouted=true;screenStart();});}
function gateLogin(){
 const email=(document.getElementById("gMail").value||"").trim();
 const pass=document.getElementById("gPass").value;
 const fb=document.getElementById("gfb");
 if(!email||!pass){fb.innerHTML='Escribe tu correo y contraseña';return;}
 fb.innerHTML='⏳ Entrando…';
 afLogin(email,pass,function(err){
  if(err){fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';return;}
  S.hasAccount=true;_gateRouted=true;
  if(typeof afPull==="function")afPull(function(){screenStart();});else screenStart();});}
