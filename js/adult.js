"use strict";
/* ============ HUB DEL PERFIL ADULTO ============ */
function screenAdultHome(){setTheme("adulto");
 const p=prof();
 render(topbar("screenStart()")
  +'<div class="card" style="text-align:center">'
  +'<div style="font-size:2.6rem">'+(p.emoji||"🧑")+'</div>'
  +'<h1 class="title" style="margin-top:4px">Hola, '+esc(p.name)+'</h1>'
  +'<p class="mut" style="margin-top:4px">⭐ Nivel '+level(p.xp)+' &nbsp;·&nbsp; 🪙 '+p.coins+' &nbsp;·&nbsp; 🔥 '+p.streak+'</p>'
  +'</div>'
  +'<button class="abtn" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="screenLangHub()"><span style="font-size:2rem">🌍</span><span style="flex:1"><b>Idiomas</b><br><span class="mut" style="font-size:.82rem">Inglés · Alemán · Portugués · Italiano — CEFR A1→C2</span></span></button>'
  +'<button class="abtn" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="screenPyHub()"><span style="font-size:2rem">🐍</span><span style="flex:1"><b>Python</b><br><span class="mut" style="font-size:.82rem">Programación paso a paso con ejercicios reales</span></span></button>'
  +'<button class="abtn" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="screenLangComicGallery()"><span style="font-size:2rem">🎨</span><span style="flex:1"><b>Mis historietas</b><br><span class="mut" style="font-size:.82rem">Ilustraciones generadas de tus lecciones</span></span></button>'
  +((typeof courses==="function"&&courses().length)?'<button class="abtn" style="text-align:left;display:flex;align-items:center;gap:14px" onclick="screenCourses()"><span style="font-size:2rem">🎓</span><span style="flex:1"><b>Mis cursos</b><br><span class="mut" style="font-size:.82rem">Enlaces asignados desde el panel de padres</span></span></button>':'')
  +'<button class="abtn ghost" onclick="screenParentLogin()">👨‍👩‍👧 Panel de padres</button>'
  +'<button class="abtn ghost" onclick="screenStart()">↩️ Cambiar de perfil</button>');}
