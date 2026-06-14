"use strict";
/* ============ PORTÓN DE ACCESO (login/registro obligatorio) ============ */
let _gateRouted=false;
/* ---- Banner de anuncios SOLO en la pantalla de login (zona de padres) ----
   Pega aquí el ID del bloque de anuncios de AdSense cuando lo tengas
   (AdSense → Anuncios → Por bloque de anuncios → crea uno display → copia el número data-ad-slot). */
const AD_SLOT="5141554144";
function adBanner(){
 if(!AD_SLOT)return "";
 return '<div style="margin-top:18px;text-align:center;opacity:.95">'
  +'<p style="font-size:.68rem;color:#8a94a6;margin-bottom:2px;letter-spacing:.05em">PUBLICIDAD</p>'
  +'<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6447064774269630" data-ad-slot="'+AD_SLOT+'" data-ad-format="auto" data-full-width-responsive="true"></ins></div>';}
function adInit(){if(!AD_SLOT)return;try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){}}
function gateRender(html){render(html);if(typeof adInit==="function")setTimeout(adInit,80);}
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
 if(!u){if(typeof afMember!=="undefined")afMember=null;screenGate();return;}
 // ¿es un hijo invitado (tiene su propia cuenta amarrada a una familia)?
 if(typeof afCheckMember==="function"){
  afCheckMember(u,function(member){
   if(member&&member.familyId){afMember={familyId:member.familyId};afLoadChild(u.uid,member.familyId);return;}
   afMember=null;S.hasAccount=true;save();
   if(typeof afPull==="function")afPull(function(){if(current.profile===null&&!document.getElementById("acctbox"))screenStart();});
   else if(current.profile===null)screenStart();
  });return;}
 S.hasAccount=true;save();
 if(typeof afPull==="function")afPull(function(){if(current.profile===null&&!document.getElementById("acctbox"))screenStart();});
 else if(current.profile===null)screenStart();}
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
  return gateRender(hero+'<div class="card" style="margin-top:22px"><h3>Crear cuenta</h3>'
   +'<p class="mut" style="margin:8px 0 4px">¿Quién eres?</p>'
   +'<div style="display:flex;gap:10px;margin-bottom:8px">'
   +'<button class="pbtn ghost" id="roleP" style="flex:1;margin:0" onclick="gateSetRole(\'parent\')">👨‍👩‍👧 Padre / Madre</button>'
   +'<button class="pbtn ghost" id="roleH" style="flex:1;margin:0" onclick="gateSetRole(\'child\')">🧒 Estudiante</button></div>'
   +'<input type="text" id="gName" placeholder="Tu nombre">'
   +'<input type="number" id="gAge" inputmode="numeric" placeholder="Edad (para el estudiante)" min="3" max="18">'
   +'<input type="email" id="gMail" placeholder="Correo" autocomplete="username">'
   +'<input type="password" id="gPass" placeholder="Contraseña (mínimo 6)" autocomplete="new-password">'
   +'<button class="pbtn" style="display:block;width:100%;margin:12px 0 0" onclick="gateSignup()">Crear cuenta y entrar</button>'
   +'<button class="pbtn ghost" style="display:block;width:100%;margin:10px 0 0" onclick="screenGate(\'login\')">Ya tengo cuenta</button>'
   +'<p id="gfb" style="margin-top:6px"></p></div>'+adBanner());}
 if(mode==="login"){
  return gateRender(hero+'<div class="card" style="margin-top:22px"><h3>Entrar</h3>'
   +'<input type="email" id="gMail" placeholder="Correo" autocomplete="username">'
   +'<input type="password" id="gPass" placeholder="Contraseña" autocomplete="current-password">'
   +'<button class="pbtn" style="display:block;width:100%;margin:12px 0 0" onclick="gateLogin()">Entrar</button>'
   +'<button class="pbtn ghost" style="display:block;width:100%;margin:10px 0 0" onclick="screenGate(\'signup\')">Crear cuenta nueva</button>'
   +'<p style="text-align:center;margin-top:12px"><a href="#" onclick="gateReset();return false" style="color:var(--par-acc);font-weight:700;text-decoration:none">¿Olvidaste tu contraseña?</a></p>'
   +'<p id="gfb" style="margin-top:6px"></p></div>'+adBanner());}
 // bienvenida
 return gateRender(hero
  +'<div class="card" style="margin-top:22px"><p style="line-height:1.7">Una plataforma educativa <b>gratuita</b> donde tus hijos aprenden jugando, todos los días.</p>'
  +'<ul style="margin:12px 0 0 18px;line-height:1.8">'
  +'<li>🔢 <b>Matemáticas</b> con dificultad que se ajusta sola a cada niño</li>'
  +'<li>🇬🇧 <b>Inglés con voz</b>, de A1 a B2, con exámenes por niveles</li>'
  +'<li>📚 <b>Lenguaje y lectura</b>: ortografía, comprensión y cuentos ilustrados</li>'
  +'<li>🧠 <b>Memoria, lógica e identificación de patrones</b> con juegos</li>'
  +'<li>👨‍👩‍👧 <b>Panel para padres</b>: estadísticas, tiempo de uso y <b>señales de falencias</b> por área para saber dónde reforzar</li>'
  +'<li>☁️ Progreso <b>seguro en la nube</b>, sincronizado entre tablet, celular y PC</li>'
  +'</ul></div>'
  +'<button class="pbtn" style="display:block;width:100%;margin:12px 0 0" onclick="screenGate(\'signup\')">✨ Crear cuenta gratis</button>'
  +'<button class="pbtn ghost" style="display:block;width:100%;margin:10px 0 0" onclick="screenGate(\'login\')">Ya tengo cuenta</button>'
  +'<p class="center" style="margin-top:14px;font-size:.82rem"><a href="https://katej-tech.github.io/privacy.html" target="_blank" rel="noopener" style="color:var(--par-mut);text-decoration:underline">Política de privacidad</a></p>'
  +adBanner());}
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
  if(err){
   if((err.code||"").indexOf("email-already-in-use")>=0){
    // la cuenta ya existe → llevar a iniciar sesión con el correo puesto
    screenGate("login");
    var mm=document.getElementById("gMail");if(mm)mm.value=email;
    var fb2=document.getElementById("gfb");if(fb2)fb2.innerHTML='<b style="color:#D97706">Ese correo ya tiene una cuenta. Escribe tu contraseña para entrar (o recupérala si la olvidaste).</b>';
    return;}
   fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';return;}
  S.role=_gateRole;S.ownerName=name;S.hasAccount=true;
  if(_gateRole==="child"){
   var ageEl=document.getElementById("gAge");var age=ageEl?parseInt(ageEl.value,10):0;age=age||7;
   var type=age>=11?"teen":"kid";var id="me";
   S.profiles={};S.childProfile=id;
   if(type==="teen")S.profiles[id]={name:name,alias:"",age:age,type:"teen",emoji:"🎧",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},best:{}};
   else S.profiles[id]={name:name,alias:"",age:age,type:"kid",emoji:"🦖",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},map:{unlocked:1,stars:{}},worldWins:{},critters:[],mastery:{},signals:{read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0}}};
  }
  save();_gateRouted=true;screenStart();});}
function gateReset(){
 var m=document.getElementById("gMail");var email=m?(m.value||"").trim():"";var fb=document.getElementById("gfb");
 if(!email){if(fb)fb.innerHTML='<b style="color:#D97706">Escribe tu correo arriba y vuelve a tocar "¿Olvidaste tu contraseña?"</b>';return;}
 if(typeof afReset!=="function"){if(fb)fb.innerHTML='No disponible sin conexión';return;}
 if(fb)fb.innerHTML='⏳ Enviando correo de recuperación…';
 afReset(email,function(err){
  if(err){if(fb)fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';}
  else{if(fb)fb.innerHTML='<b style="color:var(--par-acc)">✓ Te enviamos un correo para recuperar tu contraseña. Revisa tu bandeja de entrada (y la carpeta de spam).</b>';}});}
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
