"use strict";
/* ============ CUENTAS Y SINCRONIZACIÓN EN LA NUBE (Firebase) ============ */
/* La config de Firebase es pública por diseño; la seguridad va por las reglas
   de Firestore (cada familia solo lee/escribe su propio documento). */
var AF_CFG={
 apiKey:"AIzaSyCgQUEORx8MwtQvUsOcz6G46MvHvrx3MfI",
 authDomain:"academia-familiar-f7409.firebaseapp.com",
 projectId:"academia-familiar-f7409",
 storageBucket:"academia-familiar-f7409.firebasestorage.app",
 messagingSenderId:"732165157620",
 appId:"1:732165157620:web:f84a3719443804b50e64a1"
};
var afReady=false,afAuth=null,afDB=null,afPushT=null;
(function(){
 try{
  if(typeof firebase==="undefined"||!firebase.initializeApp)return;
  firebase.initializeApp(AF_CFG);
  afAuth=firebase.auth();afDB=firebase.firestore();afReady=true;
  afAuth.onAuthStateChanged(function(u){
   if(!u){if(typeof afRoute==="function")afRoute(null);return;} // sin sesión → portón
   if(document.getElementById("acctbox")){afPull(function(){screenParentDash();});return;} // en el panel: refresca
   if(typeof afRoute==="function")afRoute(u); // arranque/login → entra a la app
  });
 }catch(e){afReady=false;}
})();
function afCloudAvailable(){return afReady;}
function afUser(){return afReady&&afAuth.currentUser?afAuth.currentUser:null;}
/* guardado en la nube con rebote (lo llama save() vía window.afOnSave) */
function afOnSave(){if(!afUser())return;clearTimeout(afPushT);afPushT=setTimeout(afPush,1500);}
window.afOnSave=afOnSave;
/* la clave de Gemini se guarda en el espacio PRIVADO de la familia (solo el dueño lo lee, por las reglas) */
function afPush(){var u=afUser();if(!u)return;
 try{
  if(afMember){ // hijo invitado: guarda SOLO su propio perfil
   var pid=S.childProfile||u.uid;var prof=S.profiles&&S.profiles[pid];
   if(prof){prof.updatedAt=Date.now();afDB.collection("families").doc(afMember.familyId).collection("profiles").doc(u.uid).set(JSON.parse(JSON.stringify(prof))).catch(function(){});}
   return;}
  afDB.collection("families").doc(u.uid).set(JSON.parse(JSON.stringify(S))).catch(function(){});
 }catch(e){}}
function afPull(done){var u=afUser();if(!u){if(done)done();return;}
 afDB.collection("families").doc(u.uid).get().then(function(snap){
  if(snap.exists){var cloud=snap.data();var lt=S.updatedAt||0,ct=cloud.updatedAt||0;
   if(ct>=lt){var localKey=S.geminiKey||"";var base=JSON.parse(JSON.stringify(DEFAULT_STATE));deepMerge(base,cloud);
    if(!base.geminiKey&&localKey)base.geminiKey=localKey; // si la nube no tiene clave, conserva la del dispositivo
    S=base;if(typeof normalizeProfiles==="function")normalizeProfiles();localStorage.setItem("academiaFam2",JSON.stringify(S));}
   else afPush();
  }else afPush();
  if(done)done();
 }).catch(function(){if(done)done();});}
function afSignup(email,pass,cb){afAuth.createUserWithEmailAndPassword(email,pass)
 .then(function(){afPush();cb(null);}).catch(cb);}
function afLogin(email,pass,cb){afAuth.signInWithEmailAndPassword(email,pass)
 .then(function(){cb(null);}).catch(cb);}
function afLogout(){if(afReady)afAuth.signOut();}
function afReset(email,cb){if(!afReady){cb({message:"Sin conexión a internet"});return;}
 afAuth.sendPasswordResetEmail(email).then(function(){cb(null);}).catch(cb);}

/* ============ HIJOS CON SU PROPIA CUENTA (miembros de la familia) ============ */
var afMember=null; // {familyId} si esta sesión es de un hijo invitado
function afValidEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e||"");}
function afSecondaryApp(){try{return firebase.app("secondary");}catch(e){return firebase.initializeApp(AF_CFG,"secondary");}}
function afNewMemberProfile(name,age,type){
 var a=parseInt(age,10)||0;
 if(type==="teen")return {name:name,alias:"",age:a||13,type:"teen",emoji:"🎧",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},best:{},updatedAt:Date.now()};
 return {name:name,alias:"",age:a||7,type:"kid",emoji:"🦖",coins:0,xp:0,streak:0,lastDay:"",days:{},stats:{},map:{unlocked:1,stars:{}},worldWins:{},critters:[],mastery:{},signals:{read:{n:0,slow:0,err:0},math:{n:0,err:0},en:{n:0,err:0},seq:{n:0,err:0}},updatedAt:Date.now()};}
/* el padre invita a un hijo: crea su cuenta (sin cerrar su propia sesión), lo amarra a la familia
   y le envía un correo para que cree su contraseña */
function afGenPass(name){var base=(name||"").replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g,"");base=base?base.charAt(0).toUpperCase()+base.slice(1,7).toLowerCase():"Clave";while(base.length<4)base+="x";return base+Math.floor(100+Math.random()*900);}
function afInviteChild(email,name,age,password,cb){
 if(!afReady){cb({message:"Sin conexión"});return;}
 var parent=afUser();if(!parent){cb({message:"Inicia sesión primero"});return;}
 email=(email||"").trim().toLowerCase();name=(name||"").trim();
 if(!name){cb({message:"Escribe el nombre del hijo"});return;}
 if(!afValidEmail(email)){cb({code:"auth/invalid-email"});return;}
 var pass=(password&&(""+password).length>=6)?(""+password):afGenPass(name);
 var sAuth=afSecondaryApp().auth();
 sAuth.createUserWithEmailAndPassword(email,pass).then(function(cred){
  var cuid=cred.user.uid;
  var type=(parseInt(age,10)||7)>=11?"teen":"kid";
  var prof=afNewMemberProfile(name,age,type);
  var fid=parent.uid;
  var meta={};meta[cuid]={name:name,email:email,age:(parseInt(age,10)||null),type:type,since:Date.now()};
  return Promise.all([
   afDB.collection("families").doc(fid).collection("profiles").doc(cuid).set(prof),
   afDB.collection("families").doc(fid).set({memberIndex:meta},{merge:true}),
   afDB.collection("memberships").doc(cuid).set({familyId:fid,name:name,email:email})
  ]).then(function(){
   sAuth.signOut().catch(function(){});
   afAuth.sendPasswordResetEmail(email).catch(function(){}); // correo opcional de respaldo
   cb(null,cuid,pass);
  });
 }).catch(function(e){try{sAuth.signOut();}catch(_){}cb(e);});}
/* lee los perfiles de los hijos invitados (para que el padre vea sus estadísticas) */
function afLoadMembers(cb){
 var u=afUser();if(!u||!afReady){cb([]);return;}
 afDB.collection("families").doc(u.uid).collection("profiles").get().then(function(qs){
  var arr=[];qs.forEach(function(d){arr.push(Object.assign({uid:d.id},d.data()));});cb(arr);
 }).catch(function(){cb([]);});}
/* reenviar el correo para crear contraseña */
function afResendChild(email,cb){afReset(email,cb);}
/* ¿esta sesión es de un hijo invitado? devuelve su vínculo de familia o null */
function afCheckMember(u,cb){
 if(!afReady){cb(null);return;}
 afDB.collection("memberships").doc(u.uid).get().then(function(m){cb(m.exists?m.data():null);}).catch(function(){cb(null);});}
/* el hijo invitado inicia sesión: carga SOLO su perfil desde la familia */
function afLoadChild(uid,fid){
 afDB.collection("families").doc(fid).collection("profiles").doc(uid).get().then(function(snap){
  var prof=snap.exists?snap.data():afNewMemberProfile("Estudiante",7,"kid");
  var base=JSON.parse(JSON.stringify(DEFAULT_STATE));
  base.profiles={};base.profiles[uid]=prof;base.role="child";base.childProfile=uid;base.hasAccount=true;base.updatedAt=Date.now();
  S=base;if(typeof normalizeProfiles==="function")normalizeProfiles();
  localStorage.setItem("academiaFam2",JSON.stringify(S));
  current.profile=uid;if(typeof touchDay==="function")touchDay();
  if(profType()==="teen")screenTeenHome();else screenKidMap();
 }).catch(function(){if(typeof screenGate==="function")screenGate();});}
function afErr(e){var c=(e&&e.code)||"";
 if(/wrong-password|invalid-cred|invalid-login/.test(c))return "Correo o contraseña incorrectos";
 if(/user-not-found/.test(c))return "No existe esa cuenta — usa \"Crear cuenta\"";
 if(/email-already-in-use/.test(c))return "Ese correo ya tiene cuenta — usa \"Entrar\"";
 if(/weak-password/.test(c))return "La contraseña debe tener al menos 6 caracteres";
 if(/invalid-email/.test(c))return "Ese correo no es válido";
 if(/network/.test(c))return "Sin conexión — intenta de nuevo";
 return (e&&e.message)||"No se pudo, intenta de nuevo";}
/* ---- Tarjeta de cuenta para el panel de padres ---- */
function afAccountCard(){
 if(!afCloudAvailable())
  return '<div class="card" id="acctbox"><h3>☁️ Cuenta en la nube</h3>'
   +'<p class="mut" style="margin-top:8px">No hay conexión con la nube en este momento. El progreso se guarda en este dispositivo; cuando vuelvas a tener internet podrás iniciar sesión y sincronizar.</p></div>';
 var u=afUser();
 if(u){
  return '<div class="card" id="acctbox"><h3>☁️ Cuenta de la familia</h3>'
   +'<p class="mut" style="margin:8px 0;line-height:1.6">Sesión iniciada como <b>'+esc(u.email)+'</b>.<br>El progreso de tus hijos se guarda en la nube y aparece en cualquier tablet o celular donde inicies sesión con este correo.</p>'
   +'<button class="pbtn" onclick="afManualSync()">🔄 Sincronizar ahora</button>'
   +'<button class="pbtn ghost" onclick="afLogout()">Cerrar sesión</button>'
   +'<p id="acctfb" style="margin-top:6px"></p></div>';
 }
 return '<div class="card" id="acctbox"><h3>☁️ Cuenta de la familia</h3>'
  +'<p class="mut" style="margin:8px 0;line-height:1.6">Crea tu cuenta (o entra) para que el progreso de tus hijos te siga en cualquier dispositivo y puedas verlo desde tu celular. Para pasar la app a otro equipo, inicia sesión con el mismo correo.</p>'
  +'<input type="email" id="acmail" placeholder="Tu correo" autocomplete="username">'
  +'<input type="password" id="acpass" placeholder="Contraseña (mínimo 6)" autocomplete="current-password">'
  +'<button class="pbtn" onclick="afDoLogin()">Entrar</button>'
  +'<button class="pbtn ghost" onclick="afDoSignup()">Crear cuenta nueva</button>'
  +'<p id="acctfb" style="margin-top:6px"></p></div>';}
function afManualSync(){var f=document.getElementById("acctfb");if(f)f.innerHTML='⏳ Sincronizando…';
 afPush();afPull(function(){if(f)f.innerHTML='<b style="color:var(--par-acc)">✓ Sincronizado</b>';if(document.getElementById("acctbox"))setTimeout(screenParentDash,800);});}
function afDoLogin(){var e=document.getElementById("acmail").value.trim(),p=document.getElementById("acpass").value,fb=document.getElementById("acctfb");
 if(!e||!p){fb.innerHTML='Escribe tu correo y contraseña';return;}
 fb.innerHTML='⏳ Entrando…';
 afLogin(e,p,function(err){if(err)fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';else screenParentDash();});}
function afDoSignup(){var e=document.getElementById("acmail").value.trim(),p=document.getElementById("acpass").value,fb=document.getElementById("acctfb");
 if(!e||!p){fb.innerHTML='Escribe un correo y una contraseña (mínimo 6)';return;}
 fb.innerHTML='⏳ Creando tu cuenta…';
 afSignup(e,p,function(err){if(err)fb.innerHTML='<b style="color:#DC2626">'+esc(afErr(err))+'</b>';else{fb.innerHTML='<b style="color:var(--par-acc)">✓ ¡Cuenta creada!</b>';setTimeout(screenParentDash,900);}});}
