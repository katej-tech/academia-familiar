/* ============ PANEL DE PADRES ============ */
function screenParentLogin(){setTheme("parent");
 render('<div style="margin-top:9vh"><div class="card"><h2>👨‍👩‍👧 Panel de padres</h2>'
 +'<p class="mut" style="margin:8px 0 14px">Ingresa tu PIN (inicial: 1234)</p>'
 +'<input type="password" id="pin" inputmode="numeric" placeholder="PIN">'
 +'<button class="pbtn" onclick="checkPin()">Entrar</button>'
 +'<button class="pbtn ghost" onclick="screenStart()">Volver</button><p id="fb"></p></div></div>');}
function checkPin(){
 if(document.getElementById("pin").value===S.pin){current.profile=null;screenParentDash();}
 else document.getElementById("fb").innerHTML='<b style="color:#DC2626">PIN incorrecto</b>';}
function last7(){const ds=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);
 ds.push(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"));}return ds;}
function profileReport(key){
 const p=S.profiles[key];
 const rows=Object.keys(p.stats).map(s=>{const st=p.stats[s];const pct=st.attempts?Math.round(st.correct/st.attempts*100):0;
  return '<tr><td>'+esc(s)+'</td><td>'+st.attempts+'</td><td>'+st.correct+'</td><td><span class="tag">'+pct+'%</span></td><td>'+Math.round(st.sec/60)+' min</td></tr>';}).join("")
  ||'<tr><td colspan="5" class="mut">Sin actividad todavía</td></tr>';
 const days=last7(),vals=days.map(d=>p.days[d]?p.days[d].ex:0),max=Math.max(1,...vals);
 const bars=days.map((d,i)=>'<div class="bar" style="height:'+(vals[i]/max*100)+'%"><span>'+d.slice(8)+'</span></div>').join("");
 const lvl=p.autoLevel||2;const lvlTxt=["","Muy fácil","Fácil","Medio","Avanzado","Reto"][lvl];
 const isKid=(p.type||"kid")==="kid";
 // tiempo de uso total (de days[].active) y de los últimos 7 días
 let totalSec=0,weekSec=0;const d7=last7();
 Object.keys(p.days||{}).forEach(dd=>{const a=(p.days[dd].active||0);totalSec+=a;if(d7.includes(dd))weekSec+=a;});
 const fmt=s=>s>=3600?(Math.round(s/360)/10)+" h":Math.round(s/60)+" min";
 const extra=(isKid?' · 🌍 '+(p.worldWins?Object.values(p.worldWins).reduce((a,b)=>a+b,0):0)+' rondas · 🎒 '+((p.critters||[]).length)+' criaturas':'')
  +' · 🎚️ Dificultad: '+lvlTxt+' ('+lvl+'/5)'
  +(p.cefr?' · 🇬🇧 Inglés nivel '+CEFR[p.cefr.lvl||0].id:'')
  +' · ⏱️ '+fmt(weekSec)+' esta semana';
 const signals=isKid?signalsBlock(p):"";
 return '<div class="card"><h3>'+(p.emoji||"🙂")+' '+esc(p.name)+(p.age?' <span class="mut" style="font-weight:600">('+p.age+" años)</span>":'')+' <span class="mut" style="font-weight:600">· 🔥 '+p.streak+' días · 🪙 '+p.coins+' · Nv '+level(p.xp)+extra+'</span></h3>'
 +'<table><tr><th>Tema</th><th>Intentos</th><th>Aciertos</th><th>%</th><th>Tiempo</th></tr>'+rows+'</table>'
 +'<p class="mut" style="margin-top:16px"><b>Ejercicios por día — últimos 7 días</b></p>'
 +'<div class="barchart">'+bars+'</div><div style="height:24px"></div>'+signals+'</div>';}
function signalsBlock(p){
 const s=p.signals;if(!s)return'';
 const items=[];
 const pct=(o)=>o.n>=6?Math.round(o.err/o.n*100):null;
 const checkArea=(o,label,hint)=>{
  if(!o||o.n<6){items.push('<li><span class="tag" style="background:rgba(100,116,139,.12);color:#64748B">Sin datos aún</span> '+label+' <span class="mut">(necesita más práctica para evaluar)</span></li>');return;}
  const e=Math.round(o.err/o.n*100);
  const slow=o.slow?Math.round(o.slow/o.n*100):0;
  let color,word;
  if(e>=45){color="#DC2626";word="Atención";}else if(e>=25){color="#D97706";word="En proceso";}else{color="#16A34A";word="Bien";}
  items.push('<li><span class="tag" style="background:'+color+'22;color:'+color+'">'+word+'</span> <b>'+label+'</b>: '+e+'% de errores'+(slow>30?', y lee/responde despacio ('+slow+'% lento)':'')+'. <span class="mut">'+hint+'</span></li>');};
 checkArea(s.read,"Lectura y letras","Si hay muchos errores o lentitud constante, vale la pena que un profesional evalúe la lectura.");
 checkArea(s.math,"Matemáticas","Refuerza contando objetos reales antes de los números abstractos.");
 checkArea(s.en,"Inglés","Repetir el audio en voz alta cada día acelera mucho el progreso.");
 checkArea(s.seq,"Lógica y patrones","Los patrones desarrollan el razonamiento; juéguenlos juntos.");
 checkArea(s.nat,"Ciencias y cuerpo","Relacionen lo aprendido con el cuerpo real: señala dónde queda cada parte.");
 checkArea(s.soc,"Sociales y cultura general","Conversen sobre el barrio, las profesiones y el país; las trivias refuerzan la cultura general.");
 return '<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:800;color:var(--par-acc)">🔎 Señales de apoyo (orientativas)</summary>'
 +'<div style="background:#FEF9F3;border:1px solid #F0E0CC;border-radius:12px;padding:14px;margin-top:10px">'
 +'<p class="mut" style="margin-bottom:10px;font-size:.85rem"><b>Importante:</b> esto NO es un diagnóstico. Es solo un resumen de cómo le va por área para que tú decidas dónde reforzar o si consultar a un docente o especialista. Las dificultades de aprendizaje solo las diagnostica un profesional.</p>'
 +'<ul style="margin-left:18px;line-height:1.7;font-size:.92rem">'+items.join("")+'</ul></div></details>';}
function childrenCard(){
 const rows=childProfiles().map(p=>{
  const tipo=p.type==="teen"?"Adolescente":"Niño";
  return '<div style="display:flex;align-items:center;gap:10px;border:1px solid var(--par-line);border-radius:12px;padding:10px;margin:8px 0">'
   +'<span style="font-size:1.6rem">'+(p.emoji||"🙂")+'</span>'
   +'<span style="flex:1"><b>'+esc(p.name)+'</b>'+(p.alias?' <span class="mut">('+esc(p.alias)+')</span>':'')+'<br><span class="mut" style="font-size:.85rem">'+tipo+(p.age?' · '+p.age+' años':'')+'</span></span>'
   +'<button class="pbtn ghost" style="width:auto;padding:6px 10px;margin:0" onclick="editChild(\''+p.id+'\')">✏️</button>'
   +(Object.keys(S.profiles).length>1?'<button class="pbtn ghost" style="width:auto;padding:6px 10px;margin:0" onclick="askDeleteChild(\''+p.id+'\')">🗑️</button>':'')
   +'</div>';
 }).join("");
 return '<div class="card"><h3>👨‍👩‍👧‍👦 Mis hijos</h3>'
  +'<p class="mut" style="margin:8px 0">Agrega los hijos que quieras. Cada uno tiene su propio perfil y progreso.</p>'
  +rows
  +'<div id="childform"></div>'
  +'<button class="pbtn" onclick="showAddChild()">➕ Agregar hijo</button></div>';}
function showAddChild(){
 document.getElementById("childform").innerHTML=
  '<div style="border:1px solid var(--par-line);border-radius:12px;padding:12px;margin:8px 0">'
  +'<input type="text" id="chName" placeholder="Nombre">'
  +'<input type="text" id="chAlias" placeholder="Apodo (opcional)">'
  +'<input type="number" id="chAge" inputmode="numeric" placeholder="Edad" min="3" max="18">'
  +'<p class="mut" style="margin:6px 0 4px">Tipo de contenido</p>'
  +'<select id="chType"><option value="auto">Según la edad (recomendado)</option><option value="kid">Niño (juegos)</option><option value="teen">Adolescente (studio)</option></select>'
  +'<button class="pbtn" onclick="addChild()">Crear hijo</button>'
  +'<button class="pbtn ghost" onclick="document.getElementById(\'childform\').innerHTML=\'\'">Cancelar</button></div>';}
function addChild(){
 const name=document.getElementById("chName").value.trim();
 const alias=document.getElementById("chAlias").value.trim();
 const age=parseInt(document.getElementById("chAge").value,10)||0;
 let type=document.getElementById("chType").value;
 if(!name){alert("Escribe un nombre");return;}
 if(type==="auto")type=age>=11?"teen":"kid";
 const id=newProfile(name,age,type);
 S.profiles[id].alias=alias;save();screenParentDash();}
function editChild(id){
 const p=S.profiles[id];if(!p)return;
 document.getElementById("childform").innerHTML=
  '<div style="border:1px solid var(--par-line);border-radius:12px;padding:12px;margin:8px 0">'
  +'<p class="mut" style="margin-bottom:6px">Editar a '+esc(p.name)+'</p>'
  +'<input type="text" id="edName" value="'+esc(p.name)+'" placeholder="Nombre">'
  +'<input type="text" id="edAlias" value="'+esc(p.alias||"")+'" placeholder="Apodo">'
  +'<input type="number" id="edAge" value="'+(p.age||"")+'" placeholder="Edad">'
  +'<button class="pbtn" onclick="saveChild(\''+id+'\')">Guardar</button>'
  +'<button class="pbtn ghost" onclick="document.getElementById(\'childform\').innerHTML=\'\'">Cancelar</button></div>';}
function saveChild(id){const p=S.profiles[id];if(!p)return;
 p.name=document.getElementById("edName").value.trim()||p.name;
 p.alias=document.getElementById("edAlias").value.trim();
 const a=parseInt(document.getElementById("edAge").value,10);if(a)p.age=a;
 save();screenParentDash();}
function askDeleteChild(id){const p=S.profiles[id];if(!p)return;
 if(confirm('¿Eliminar a "'+p.name+'" y todo su progreso? No se puede deshacer.')){deleteProfile(id);screenParentDash();}}
function inviteChildCard(){
 if(typeof afCloudAvailable!=="function"||!afCloudAvailable()||!afUser())
  return '<div class="card"><h3>📧 Hijos con su propia cuenta</h3><p class="mut" style="margin-top:8px">Inicia sesión con tu cuenta (arriba) para invitar a tus hijos con su propio correo.</p></div>';
 return '<div class="card"><h3>📧 Hijos con su propia cuenta</h3>'
  +'<p class="mut" style="margin:8px 0;line-height:1.6">Crea la cuenta de cada hijo. Tú defines su contraseña (o la genera la app) y se la das directo; entra con su <b>propia cuenta</b> y tú ves sus estadísticas aquí. <b>No depende de correos.</b></p>'
  +'<input type="text" id="icName" placeholder="Nombre del hijo">'
  +'<input type="number" id="icAge" inputmode="numeric" placeholder="Edad" min="3" max="18">'
  +'<input type="email" id="icMail" placeholder="Correo del hijo">'
  +'<input type="text" id="icPass" placeholder="Contraseña para el hijo (opcional, mín 6)">'
  +'<button class="pbtn" onclick="inviteChild()">👶 Crear la cuenta del hijo</button>'
  +'<p id="icfb" style="margin-top:6px"></p>'
  +'<div id="membersBox" style="margin-top:10px"><p class="mut" style="font-size:.85rem">Cargando…</p></div></div>';}
function inviteChild(){
 const name=document.getElementById("icName").value,age=document.getElementById("icAge").value,mail=document.getElementById("icMail").value,pass=document.getElementById("icPass").value;
 const fb=document.getElementById("icfb");
 if(typeof afInviteChild!=="function"||!afUser()){fb.innerHTML='Inicia sesión con tu cuenta primero';return;}
 fb.innerHTML='⏳ Creando la cuenta del hijo…';
 afInviteChild(mail,name,age,pass,function(err,uid,finalPass){
  if(err){
   if((err.code||"").indexOf("email-already-in-use")>=0){
    fb.innerHTML='<div style="background:#FFF6E5;border:2px solid #D97706;border-radius:12px;padding:12px;margin-top:6px"><b style="color:#B45309">Ese correo ya tiene una cuenta</b>'
     +'<p class="mut" style="font-size:.85rem;margin-top:6px;line-height:1.5">Es de un intento anterior. Para volver a crearla con una contraseña que tú definas: ve a la <b>consola de Firebase → Authentication → Users</b>, busca ese correo, bórralo (🗑️) y vuelve a crear el hijo aquí.<br>O si tu hijo ya sabe su contraseña, entra directo con ella.</p></div>';
    return;}
   fb.innerHTML='<b style="color:#DC2626">'+esc(typeof afErr==="function"?afErr(err):(err.message||"Error"))+'</b>';return;}
  const correo=(mail||"").trim().toLowerCase();
  fb.innerHTML='<div style="background:#E9F8F1;border:2px solid var(--par-acc);border-radius:12px;padding:12px;margin-top:6px">'
   +'<b style="color:var(--par-acc)">✓ ¡Cuenta de '+esc((name||"").trim())+' creada!</b>'
   +'<p style="margin:8px 0 4px">Dale estos datos para que entre con su propia cuenta:</p>'
   +'<p style="font-family:monospace;font-size:1rem">📧 Correo: <b>'+esc(correo)+'</b><br>🔑 Contraseña: <b>'+esc(finalPass)+'</b></p>'
   +'<p class="mut" style="font-size:.82rem;margin-top:6px">Anótala o cópiala ahora. Tu hijo puede cambiarla después con "¿Olvidaste tu contraseña?".</p></div>';
  document.getElementById("icName").value="";document.getElementById("icMail").value="";document.getElementById("icAge").value="";document.getElementById("icPass").value="";
  loadMembersInto();});}
function loadMembersInto(){
 const box=document.getElementById("membersBox");if(!box||typeof afLoadMembers!=="function")return;
 afLoadMembers(function(list){
  if(!box)return;
  if(!list.length){box.innerHTML='<p class="mut" style="font-size:.85rem">Aún no has invitado a ningún hijo con su propia cuenta.</p>';return;}
  box.innerHTML='<p class="mut" style="font-size:.85rem;margin-bottom:6px">Hijos con cuenta propia:</p>'+list.map(function(m){
   const st=m.stats||{};let tot=0,ok=0;Object.keys(st).forEach(function(k){tot+=st[k].attempts||0;ok+=st[k].correct||0;});
   const pct=tot?Math.round(ok/tot*100):0;
   return '<div style="display:flex;align-items:center;gap:8px;border:1px solid var(--par-line);border-radius:10px;padding:8px 10px;margin:5px 0">'
    +'<span style="flex:1"><b>'+(m.emoji||"🙂")+' '+esc(m.name||"Hijo")+'</b> <span class="mut" style="font-size:.85rem">· 🔥 '+(m.streak||0)+' · 🪙 '+(m.coins||0)+' · Nv '+(typeof level==="function"?level(m.xp||0):1)+' · '+tot+' ejercicios ('+pct+'%)</span></span>'
    +'<button class="pbtn ghost" style="width:auto;padding:6px 10px;margin:0" onclick="removeMember(\''+m.uid+'\',\''+esc(m.name||"")+'\')">🗑️</button></div>';
  }).join("");});}
function removeMember(uid,name){
 if(!confirm('¿Eliminar a "'+name+'" por completo? Se borra su progreso y su cuenta de acceso. No se puede deshacer.'))return;
 if(typeof afRemoveMember!=="function")return;
 const box=document.getElementById("membersBox");if(box)box.innerHTML='<p class="mut">⏳ Eliminando…</p>';
 afRemoveMember(uid,function(res){
  if(res&&res.authDeleted)toast&&toast("✓ "+esc(name)+" eliminado por completo. Ese correo queda libre.",true,2200);
  else toast&&toast("Datos de "+esc(name)+" borrados. (Si cambió su contraseña, su cuenta de acceso queda; bórrala en la consola para reusar el correo.)",false,3500);
  if(typeof loadMembersInto==="function")loadMembersInto();});}
function screenParentDash(){setTheme("parent");
 const reports=Object.keys(S.profiles).map(profileReport).join("");
 const aiTotal=S.aiBank?Object.keys(S.aiBank).reduce((a,k)=>a+(S.aiBank[k]?S.aiBank[k].length:0),0):0;
 setTimeout(function(){if(typeof loadMembersInto==="function")loadMembersInto();},150);
 render('<div class="topbar"><button class="back" onclick="screenStart()">←</button><b style="font-size:1.1rem">Panel de padres</b></div>'
 +(typeof afAccountCard==="function"?afAccountCard():"")
 +(typeof inviteCard==="function"?inviteCard():"")
 +inviteChildCard()
 +childrenCard()
 +reports
 +(typeof parentVideosHTML==="function"?parentVideosHTML():"")
 +'<div class="card"><h3>⚙️ Configuración</h3>'
 +'<p class="mut" style="margin:12px 0 4px">Clave de API de Gemini (vive solo en este dispositivo)</p>'
 +'<div style="display:flex;gap:8px;align-items:stretch"><input type="password" id="gkey" style="flex:1;margin:0" placeholder="AIza..." value="'+esc(S.geminiKey)+'">'
 +'<button class="pbtn ghost" style="width:auto;padding:0 14px;margin:0" onclick="toggleKeyVisible()" title="Mostrar/ocultar">👁</button></div>'
 +'<button class="pbtn ghost" onclick="testGeminiKey()">🧪 Probar si la clave funciona</button>'
 +'<button class="pbtn ghost" onclick="screenAiDiag()">🩺 Diagnóstico completo de la IA</button><div id="keyfb" style="margin:4px 0"></div>'
 +'<p class="mut" style="margin:6px 0 4px">Cambiar PIN</p><input type="password" id="newpin" inputmode="numeric" placeholder="Nuevo PIN (opcional)">'
 +'<button class="pbtn" onclick="saveSettings()">Guardar cambios</button><span id="fb"></span>'
 +'<p class="tip">💡 Clave gratuita: <b>aistudio.google.com</b> → Get API key. Nunca la escribas dentro del archivo ni la subas a GitHub.</p></div>'
 +coursesCard()
 +'<div class="card"><h3>🗂️ Datos</h3><p class="mut" style="margin:8px 0">El progreso se guarda en cada dispositivo (y en la nube si inicias sesión). Respáldalo o muévelo:</p>'
 +'<button class="pbtn ghost" onclick="exportData()">⬇️ Exportar respaldo</button>'
 +'<button class="pbtn ghost" onclick="document.getElementById(\'impfile\').click()">⬆️ Importar</button>'
 +'<input type="file" id="impfile" class="hidden" accept=".json" onchange="importData(event)">'
 +'<button class="pbtn danger" onclick="if(confirm(\'¿Borrar TODO el progreso?\')){localStorage.removeItem(\'academiaFam2\');location.reload();}">🗑️ Reiniciar todo</button>'
 +'<p class="mut" style="margin-top:10px">Contenido creado por IA: '+aiTotal+' elementos</p></div>'
 +'<div class="card"><h3>📱 Instalar como app</h3>'
 +'<p class="mut" style="margin:8px 0;line-height:1.6">En el celular o tablet (Chrome de Android): abre la página, toca el menú <b>⋮</b> y elige <b>"Agregar a pantalla de inicio"</b> o <b>"Instalar app"</b>. Queda con su icono, a pantalla completa y funciona sin internet (la IA sí necesita conexión).</p>'
 +'<p class="mut">Versión '+APP_VERSION+'</p></div>');}
function toggleKeyVisible(){const i=document.getElementById("gkey");i.type=i.type==="password"?"text":"password";}
async function testGeminiKey(){
 const k=document.getElementById("gkey").value.trim();
 const fb=document.getElementById("keyfb");
 if(!k){fb.innerHTML='<b style="color:#DC2626">Escribe la clave primero</b>';return;}
 if(!/^AIza[\w-]{30,}$/.test(k)){
  fb.innerHTML='<b style="color:#D97706">⚠ Esa clave no tiene el formato correcto</b>'
  +'<p class="mut" style="font-size:.85rem;margin-top:4px">Una clave de Google empieza por <b>AIza</b> y tiene 39 caracteres sin espacios. Cópiala con el botón 📋 desde <b>aistudio.google.com/apikey</b> (no la escribas a mano).</p>';return;}
 fb.innerHTML='⏳ Probando con Google…';
 const models=["gemini-2.5-flash","gemini-2.0-flash","gemini-flash-latest"];
 let res=null,m="",status=0;
 try{
  for(const mod of models){
   res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+mod+":generateContent?key="+encodeURIComponent(k),
    {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"Responde solo: OK"}]}]})});
   status=res.status;
   if(res.ok)break;
   try{const j=await res.json();m=(j.error&&j.error.message)||"";}catch(e){}
   if(status!==404)break; // 404 = ese modelo no existe, probar el siguiente; otro error = parar
  }
  if(res&&res.ok){S.geminiKey=k;save();
   fb.innerHTML='<b style="color:#16A34A">✓ ¡Funciona! Clave guardada — la IA ya está activa en este dispositivo</b>';return;}
  // diagnóstico en español según el motivo real
  const low=(m||"").toLowerCase();
  let hint;
  if(/referer|referrer|blocked/.test(low))
   hint='Tu clave tiene <b>restricción de sitios web</b> y bloquea esta app. Solución: en Google Cloud → Credenciales → tu clave → <b>Restricciones de aplicación</b>, elige <b>"Ninguna"</b>, o agrega <code>katej-tech.github.io/*</code> y <code>localhost/*</code> a los sitios permitidos.';
  else if(/api[\s_]*key[\s_]*not[\s_]*valid|invalid.*key|api_key_invalid/.test(low))
   hint='La clave está <b>mal copiada o es de otro tipo</b>. Bórrala y pega de nuevo la de <b>aistudio.google.com/apikey</b> con el botón 📋 (no a mano).';
  else if(/permission|disabled|service|not been used|enable/.test(low))
   hint='Falta <b>habilitar la API</b>. Entra a <b>aistudio.google.com/apikey</b> y crea la clave ahí (eso activa la API solo). Si la creaste en Google Cloud, habilita <b>"Generative Language API"</b>.';
  else if(/quota|exceeded|resource_exhausted/.test(low))
   hint='Llegaste al <b>límite gratuito de hoy</b>. Espera unas horas o crea otra clave.';
  else hint='Copia la clave de nuevo desde <b>aistudio.google.com/apikey</b>. Si persiste, crea una clave nueva ahí.';
  fb.innerHTML='<b style="color:#DC2626">✗ No funcionó (error '+status+')</b>'
   +(m?'<br><span class="mut" style="font-size:.8rem">'+esc(m.slice(0,150))+'</span>':'')
   +'<p style="font-size:.88rem;margin-top:6px;line-height:1.5">'+hint+'</p>';
 }catch(e){fb.innerHTML='<b style="color:#DC2626">Sin conexión a internet — intenta de nuevo</b>';}}
function coursesCard(){
 var cs=(typeof courses==="function")?courses():(S.courses||[]);
 var list=cs.length?cs.map(function(c,i){return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--par-line)"><span style="flex:1;font-size:.9rem"><b>'+esc(c.t)+'</b><br><span class="mut" style="font-size:.75rem">'+esc(c.area||"")+'</span></span><button class="pbtn danger" style="padding:6px 12px;margin:0" onclick="removeCourse('+i+')">✕</button></div>';}).join(""):'<p class="mut" style="margin:8px 0">No hay cursos aún.</p>';
 return '<div class="card"><h3>🎓 Cursos externos (Udemy u otros)</h3>'
  +'<p class="mut" style="margin:8px 0;line-height:1.5">Asigna links de cursos. A tus hijos les aparecen en <b>🎓 Cursos</b> y se abren en el navegador (tu hijo entra con su propia cuenta de Udemy). Recomendado: cursos <b>en español</b> y aptos para su edad.</p>'
  +list
  +'<p class="mut" style="margin:12px 0 4px">Agregar curso nuevo:</p>'
  +'<input type="text" id="cvT" placeholder="Nombre del curso (ej: Inglés A1)">'
  +'<input type="text" id="cvA" placeholder="Área (ej: Matemáticas, Inglés, Excel)">'
  +'<input type="text" id="cvU" placeholder="Link del curso (https://www.udemy.com/...)">'
  +'<button class="pbtn" onclick="addCourse()">➕ Agregar curso</button><span id="cvfb"></span></div>';
}
function addCourse(){
 var t=(document.getElementById("cvT").value||"").trim();
 var a=(document.getElementById("cvA").value||"").trim();
 var u=(document.getElementById("cvU").value||"").trim();
 var fb=document.getElementById("cvfb");
 if(!t||!u){if(fb)fb.innerHTML=' <b style="color:#D97706">Pon el nombre y el link</b>';return;}
 if(!/^https?:\/\//i.test(u)){if(fb)fb.innerHTML=' <b style="color:#D97706">El link debe empezar por https://</b>';return;}
 (typeof courses==="function"?courses():(S.courses=S.courses||[])).push({t:t,u:u,area:a||"📚 Otros"});
 save();if(typeof afSharePayloadWithChildren==="function")afSharePayloadWithChildren({courses:S.courses});
 screenParentDash();
}
function removeCourse(i){var cs=(typeof courses==="function")?courses():(S.courses||[]);cs.splice(i,1);save();if(typeof afSharePayloadWithChildren==="function")afSharePayloadWithChildren({courses:S.courses});screenParentDash();}
function saveSettings(){
 S.geminiKey=document.getElementById("gkey").value.trim();
 const np=document.getElementById("newpin").value.trim();if(np)S.pin=np;
 save();
 // comparte la clave con los hijos invitados para que ellos también tengan contenido con IA
 if(typeof afShareKeyWithChildren==="function")afShareKeyWithChildren(S.geminiKey);
 document.getElementById("fb").innerHTML=' <b style="color:var(--par-acc)">✓ Guardado'+(S.geminiKey?' · clave compartida con tus hijos 👨‍👩‍👧':'')+'</b>';}
function exportData(){
 const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="academia-respaldo-"+todayStr()+".json";a.click();}
function importData(ev){
 const f=ev.target.files[0];if(!f)return;
 const r=new FileReader();
 r.onload=()=>{try{const base=JSON.parse(JSON.stringify(DEFAULT_STATE));deepMerge(base,JSON.parse(r.result));S=base;if(typeof normalizeProfiles==="function")normalizeProfiles();save();screenParentDash();}catch(e){alert("Archivo no válido");}};
 r.readAsText(f);}

/* ============ DIAGNOSTICO COMPLETO DE LA IA (paso a paso, con informe copiable) ============ */
let AID={log:[]};
function screenAiDiag(){setTheme("parent");
 render('<div class="topbar"><button class="back" onclick="screenParentDash()">←</button><b style="font-size:1.1rem">Diagnóstico de la IA</b></div>'
 +'<h2 style="margin-bottom:4px">🩺 Diagnóstico de la IA</h2>'
 +'<p class="mut" style="margin-bottom:12px">Prueba la clave de Gemini paso a paso y muestra el error EXACTO de Google (si lo hay).</p>'
 +'<div class="card">'
 +'<p class="mut" style="margin-bottom:4px">Clave a probar (se usa la guardada; puedes pegar otra):</p>'
 +'<input type="password" id="aidKey" placeholder="AIza..." value="'+esc(S.geminiKey||"")+'">'
 +'<button class="pbtn" onclick="aiDiagRun()">▶️ Ejecutar diagnóstico</button>'
 +'<button class="pbtn ghost" onclick="aiDiagImg()">🖼️ Probar también generación de imágenes</button>'
 +'</div>'
 +'<div id="aidout"></div>'
 +'<div id="aidcopy"></div>');}
function aidRow(icon,title,detail){
 return '<div style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--par-line)">'
 +'<span style="font-size:1.2rem;flex:none">'+icon+'</span>'
 +'<div style="flex:1"><b style="font-size:.95rem">'+title+'</b>'
 +(detail?'<p class="mut" style="font-size:.82rem;margin-top:3px;line-height:1.5;word-break:break-word">'+detail+'</p>':'')+'</div></div>';}
function aidPaint(){
 const out=document.getElementById("aidout");
 if(out)out.innerHTML='<div class="card">'+AID.rows.join("")+(AID.verdict?'<div style="margin-top:10px;padding:12px;border-radius:12px;background:'+(AID.okAll?'#DCFCE7':'#FEF2F2')+';border:2px solid '+(AID.okAll?'#16A34A':'#DC2626')+'"><b>'+AID.verdict+'</b><p style="font-size:.88rem;margin-top:6px;line-height:1.55">'+(AID.fix||"")+'</p></div>':'')+'</div>';
 const cp=document.getElementById("aidcopy");
 if(cp&&AID.done)cp.innerHTML='<button class="pbtn ghost" onclick="aiDiagCopy()">📋 Copiar informe (para pedir ayuda)</button><span id="aidcopyfb"></span>';}
async function aiDiagRun(){
 const k=(document.getElementById("aidKey").value||"").trim();
 AID={rows:[],log:[],done:false,okAll:false,verdict:"",fix:""};
 const push=(icon,title,detail)=>{AID.rows.push(aidRow(icon,title,detail));AID.log.push(title+(detail?" | "+detail:""));aidPaint();};
 // PASO 1: formato
 if(!k)return push("❌","Paso 1: No hay clave","Pega la clave en el campo de arriba.");
 if(!/^AIza[\w-]{30,}$/.test(k)){AID.done=true;AID.verdict="✗ La clave no tiene el formato correcto";AID.fix="Debe empezar por <b>AIza</b> y tener ~39 caracteres, sin espacios ni saltos de línea. Cópiala con el botón de copiar de <b>aistudio.google.com/apikey</b> (no a mano). Largo actual: "+k.length+" caracteres.";
  push("❌","Paso 1: Formato de la clave","Empieza con: "+esc(k.slice(0,6))+"… · largo: "+k.length);aidPaint();return;}
 push("✅","Paso 1: Formato correcto","AIza…"+esc(k.slice(-4))+" · "+k.length+" caracteres");
 // PASO 2: listar modelos (verifica clave + restricciones + API habilitada)
 let st=0,msg="",reason="";
 try{
  const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models?key="+encodeURIComponent(k));
  st=r.status;
  if(r.ok){const j=await r.json();push("✅","Paso 2: Conexión con Google OK","La clave es válida y este sitio NO está bloqueado ("+((j.models||[]).length)+" modelos disponibles)");}
  else{try{const j=await r.json();msg=(j.error&&j.error.message)||"";reason=(j.error&&j.error.status)||"";}catch(e){}
   push("❌","Paso 2: Google respondió error "+st,esc(msg.slice(0,220)));}
 }catch(e){st=-1;push("❌","Paso 2: Sin conexión con Google",esc(String(e&&e.message||e).slice(0,150))+" — ¿hay internet? ¿un bloqueador/firewall?");}
 if(st!==200){
  AID.done=true;AID.okAll=false;
  const low=(msg||"").toLowerCase();
  if(st===-1){AID.verdict="✗ No hay conexión con los servidores de Google";AID.fix="Revisa el internet del dispositivo. Si usas un bloqueador de anuncios o control parental de red, permite <b>generativelanguage.googleapis.com</b>.";}
  else if(/referer|referrer|blocked|http referrer/i.test(low)){AID.verdict="✗ CONFIRMADO: la clave tiene restricción de sitios web y bloquea esta app";AID.fix="En <b>console.cloud.google.com</b> → APIs y servicios → Credenciales → tu clave → <b>Restricciones de aplicación</b> → elige <b>Ninguna</b> (o agrega <code>katej-tech.github.io/*</code>). Guarda y espera 5 minutos. O MÁS FÁCIL: crea una clave nueva en <b>aistudio.google.com/apikey</b> y usa esa.";}
  else if(/api key not valid|api_key_invalid|invalid api key/i.test(low)){AID.verdict="✗ CONFIRMADO: la clave no es válida";AID.fix="La clave está mal copiada, fue borrada, o es de otro servicio de Google (Maps, Firebase…). Entra a <b>aistudio.google.com/apikey</b>, crea/copia la clave de <b>Gemini</b> con el botón 📋 y pégala aquí.";}
  else if(/not been used|disabled|enable|service_disabled/i.test(low)){AID.verdict="✗ CONFIRMADO: falta habilitar la API Generative Language en tu proyecto";AID.fix="La clave existe pero su proyecto no tiene la API activa. Solución fácil: crea la clave en <b>aistudio.google.com/apikey</b> (la activa sola). O en Google Cloud busca <b>Generative Language API</b> y dale Habilitar.";}
  else if(st===429||/quota|exhausted/i.test(low)){AID.verdict="✗ Límite gratuito agotado por hoy";AID.fix="La clave funciona pero se acabó la cuota gratis del día. Espera unas horas (se reinicia a medianoche, hora del Pacífico) o crea otra clave en otro proyecto.";}
  else{AID.verdict="✗ Error "+st+(reason?" ("+reason+")":"");AID.fix="Mensaje de Google: "+esc(msg.slice(0,220))+". Copia el informe y pégalo en el chat para ayudarte.";}
  aidPaint();return;}
 // PASO 3: generar texto de verdad
 try{
  const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+encodeURIComponent(k),
   {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"Responde SOLO la palabra: hola"}]}]})});
  if(r.ok){const j=await r.json();const t=(j.candidates&&j.candidates[0].content.parts.map(p=>p.text||"").join(""))||"";
   push("✅","Paso 3: Generación de texto OK","Gemini respondió: “"+esc(t.slice(0,40))+"”");
   AID.done=true;AID.okAll=true;AID.verdict="✓ ¡TODO FUNCIONA! La IA está lista en este dispositivo";
   AID.fix="Guardando esta clave… Los cuentos, trivias y dibujos con IA ya deben funcionar aquí. Si en la tablet del niño no funciona, abre este mismo diagnóstico allá (la clave vive en cada dispositivo) o usa 🔑 Activar IA en la cuenta del niño.";
   S.geminiKey=k;save();if(typeof afShareKeyWithChildren==="function")afShareKeyWithChildren(k);if(typeof afPush==="function")afPush();
  }else{let m="";try{const j=await r.json();m=(j.error&&j.error.message)||"";}catch(e){}
   push("❌","Paso 3: Error al generar texto ("+r.status+")",esc(m.slice(0,220)));
   AID.done=true;
   AID.verdict=(r.status===429||/quota/i.test(m))?"✗ La clave es válida pero se agotó la cuota gratis de hoy":"✗ La conexión sirve pero la generación falla ("+r.status+")";
   AID.fix=(r.status===429||/quota/i.test(m))?"Espera unas horas o crea una clave en otro proyecto de <b>aistudio.google.com/apikey</b>.":"Copia el informe y pégalo en el chat para revisarlo.";}
 }catch(e){AID.done=true;push("❌","Paso 3: Falló la generación",esc(String(e&&e.message||e).slice(0,150)));AID.verdict="✗ Error inesperado generando texto";AID.fix="Copia el informe y pégalo en el chat.";}
 aidPaint();}
async function aiDiagImg(){
 const k=(document.getElementById("aidKey").value||S.geminiKey||"").trim();
 if(!k)return;
 AID.rows=AID.rows||[];const push=(icon,title,detail)=>{AID.rows.push(aidRow(icon,title,detail));AID.log.push(title+(detail?" | "+detail:""));aidPaint();};
 push("⏳","Paso 4: Probando generación de imágenes…","(esto gasta un poquito de cuota)");
 try{
  const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key="+encodeURIComponent(k),
   {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"a single red circle, white background"}]}],generationConfig:{responseModalities:["TEXT","IMAGE"]}})});
  AID.rows.pop();AID.log.pop();
  if(r.ok){const j=await r.json();const parts=(j.candidates&&j.candidates[0].content&&j.candidates[0].content.parts)||[];
   const img=parts.find(p=>p.inlineData);
   push(img?"✅":"⚠️","Paso 4: Imágenes "+(img?"OK":"respondió sin imagen"),img?"El modelo de imágenes funciona — los dibujos IA y las ilustraciones de cuentos servirán":"Respondió pero sin imagen; puede ser temporal, prueba de nuevo");}
  else{let m="";try{const j=await r.json();m=(j.error&&j.error.message)||"";}catch(e){}
   push("❌","Paso 4: Imágenes fallan ("+r.status+")",esc(m.slice(0,200))+(r.status===429?" — cuota agotada; el texto puede seguir funcionando":""));}
 }catch(e){AID.rows.pop();AID.log.pop();push("❌","Paso 4: Imágenes fallan",esc(String(e&&e.message||e).slice(0,150)));}
 aidPaint();}
function aiDiagCopy(){
 const txt="DIAGNOSTICO IA Academia Familiar "+(new Date().toISOString())+"\n"+AID.log.join("\n")+"\nVeredicto: "+AID.verdict.replace(/<[^>]+>/g,"");
 const fb=document.getElementById("aidcopyfb");
 try{navigator.clipboard.writeText(txt).then(()=>{if(fb)fb.innerHTML=' <b style="color:#16A34A">✓ Copiado</b>';});}
 catch(e){if(fb)fb.innerHTML=' <b style="color:#DC2626">No se pudo copiar</b>';}}
