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
   if(u){afPull(function(){
    if(typeof current!=="undefined"&&current.profile===null&&document.getElementById("acctbox"))screenParentDash();
   });}
   if(document.getElementById("acctbox"))screenParentDash();
  });
 }catch(e){afReady=false;}
})();
function afCloudAvailable(){return afReady;}
function afUser(){return afReady&&afAuth.currentUser?afAuth.currentUser:null;}
/* guardado en la nube con rebote (lo llama save() vía window.afOnSave) */
function afOnSave(){if(!afUser())return;clearTimeout(afPushT);afPushT=setTimeout(afPush,1500);}
window.afOnSave=afOnSave;
/* la clave de Gemini NUNCA se sube a la nube: vive solo en este dispositivo */
function afCloudSafe(){var c=JSON.parse(JSON.stringify(S));delete c.geminiKey;return c;}
function afPush(){var u=afUser();if(!u)return;
 try{afDB.collection("families").doc(u.uid).set(afCloudSafe()).catch(function(){});}catch(e){}}
function afPull(done){var u=afUser();if(!u){if(done)done();return;}
 afDB.collection("families").doc(u.uid).get().then(function(snap){
  if(snap.exists){var cloud=snap.data();var lt=S.updatedAt||0,ct=cloud.updatedAt||0;
   if(ct>=lt){var localKey=S.geminiKey||"";var base=JSON.parse(JSON.stringify(DEFAULT_STATE));deepMerge(base,cloud);
    base.geminiKey=localKey; // conservar la clave local (la nube nunca la guarda)
    S=base;localStorage.setItem("academiaFam2",JSON.stringify(S));}
   else afPush();
  }else afPush();
  if(done)done();
 }).catch(function(){if(done)done();});}
function afSignup(email,pass,cb){afAuth.createUserWithEmailAndPassword(email,pass)
 .then(function(){afPush();cb(null);}).catch(cb);}
function afLogin(email,pass,cb){afAuth.signInWithEmailAndPassword(email,pass)
 .then(function(){cb(null);}).catch(cb);}
function afLogout(){if(afReady)afAuth.signOut();}
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
