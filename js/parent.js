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
 const extra=(key==="nino"?' · 🌍 '+(p.worldWins?Object.values(p.worldWins).reduce((a,b)=>a+b,0):0)+' rondas · 🎒 '+((p.critters||[]).length)+' criaturas':'')
  +' · 🎚️ Dificultad: '+lvlTxt+' ('+lvl+'/5)'
  +(p.cefr?' · 🇬🇧 Inglés nivel '+CEFR[p.cefr.lvl||0].id:'');
 const signals=key==="nino"?signalsBlock(p):"";
 return '<div class="card"><h3>'+p.emoji+' '+esc(p.name)+' <span class="mut" style="font-weight:600">· 🔥 '+p.streak+' días · 🪙 '+p.coins+' · Nv '+level(p.xp)+extra+'</span></h3>'
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
 return '<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:800;color:var(--par-acc)">🔎 Señales de apoyo (orientativas)</summary>'
 +'<div style="background:#FEF9F3;border:1px solid #F0E0CC;border-radius:12px;padding:14px;margin-top:10px">'
 +'<p class="mut" style="margin-bottom:10px;font-size:.85rem"><b>Importante:</b> esto NO es un diagnóstico. Es solo un resumen de cómo le va por área para que tú decidas dónde reforzar o si consultar a un docente o especialista. Las dificultades de aprendizaje solo las diagnostica un profesional.</p>'
 +'<ul style="margin-left:18px;line-height:1.7;font-size:.92rem">'+items.join("")+'</ul></div></details>';}
function screenParentDash(){setTheme("parent");
 render('<div class="topbar"><button class="back" onclick="screenStart()">←</button><b style="font-size:1.1rem">Panel de padres</b></div>'
 +profileReport("nino")+profileReport("nina")
 +(typeof parentVideosHTML==="function"?parentVideosHTML():"")
 +'<div class="card"><h3>⚙️ Configuración</h3>'
 +'<p class="mut" style="margin:12px 0 4px">Clave de API de Gemini (vive solo en este dispositivo)</p>'
 +'<div style="display:flex;gap:8px;align-items:stretch"><input type="password" id="gkey" style="flex:1;margin:0" placeholder="AIza..." value="'+esc(S.geminiKey)+'">'
 +'<button class="pbtn ghost" style="width:auto;padding:0 14px;margin:0" onclick="toggleKeyVisible()" title="Mostrar/ocultar">👁</button></div>'
 +'<button class="pbtn ghost" onclick="testGeminiKey()">🧪 Probar si la clave funciona</button><div id="keyfb" style="margin:4px 0"></div>'
 +'<p class="mut" style="margin:6px 0 4px">Cambiar PIN</p><input type="password" id="newpin" inputmode="numeric" placeholder="Nuevo PIN (opcional)">'
 +'<p class="mut" style="margin:6px 0 4px">Nombres</p>'
 +'<input type="text" id="nName" value="'+esc(S.profiles.nino.name)+'" placeholder="Nombre del niño">'
 +'<input type="text" id="aName" value="'+esc(S.profiles.nina.name)+'" placeholder="Nombre de la niña">'
 +'<button class="pbtn" onclick="saveSettings()">Guardar cambios</button><span id="fb"></span>'
 +'<p class="tip">💡 Clave gratuita: <b>aistudio.google.com</b> → Get API key. Nunca la escribas dentro del archivo ni la subas a GitHub.</p></div>'
 +'<div class="card"><h3>🗂️ Datos</h3><p class="mut" style="margin:8px 0">El progreso se guarda en cada dispositivo. Respáldalo o muévelo:</p>'
 +'<button class="pbtn ghost" onclick="exportData()">⬇️ Exportar respaldo</button>'
 +'<button class="pbtn ghost" onclick="document.getElementById(\'impfile\').click()">⬆️ Importar</button>'
 +'<input type="file" id="impfile" class="hidden" accept=".json" onchange="importData(event)">'
 +'<button class="pbtn danger" onclick="if(confirm(\'¿Borrar TODO el progreso?\')){localStorage.removeItem(\'academiaFam2\');location.reload();}">🗑️ Reiniciar todo</button>'
 +'<p class="mut" style="margin-top:10px">Contenido creado por IA: '+S.aiBank.nina.length+' elementos</p></div>'
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
function saveSettings(){
 S.geminiKey=document.getElementById("gkey").value.trim();
 const np=document.getElementById("newpin").value.trim();if(np)S.pin=np;
 S.profiles.nino.name=document.getElementById("nName").value.trim()||"Explorador";
 S.profiles.nina.name=document.getElementById("aName").value.trim()||"Estrella";
 save();document.getElementById("fb").innerHTML=' <b style="color:var(--par-acc)">✓ Guardado</b>';}
function exportData(){
 const blob=new Blob([JSON.stringify(S,null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="academia-respaldo-"+todayStr()+".json";a.click();}
function importData(ev){
 const f=ev.target.files[0];if(!f)return;
 const r=new FileReader();
 r.onload=()=>{try{const base=JSON.parse(JSON.stringify(DEFAULT_STATE));deepMerge(base,JSON.parse(r.result));S=base;save();screenParentDash();}catch(e){alert("Archivo no válido");}};
 r.readAsText(f);}
