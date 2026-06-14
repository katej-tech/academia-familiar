"use strict";
/* ============ INVITAR Y COMPARTIR (link + QR + WhatsApp) ============ */
const INVITE_BASE="https://katej-tech.github.io/academia-familiar/";
function inviteLink(){
 var ref=(typeof afUser==="function"&&afUser())?afUser().uid:"";
 return INVITE_BASE+(ref?("?ref="+encodeURIComponent(ref)):"");}
/* al abrir la app con ?ref=... recordar quién invitó (para crecimiento futuro) */
(function(){
 try{var u=new URLSearchParams(location.search);var ref=u.get("ref");
  if(ref&&typeof S!=="undefined"&&!S.invitedBy){S.invitedBy=ref;if(typeof save==="function")save();}
 }catch(e){}
})();
function inviteCard(){
 var link=inviteLink();
 var msg="¡Te invito a Academia Familiar! Una app GRATIS para que los niños aprendan jugando: matemáticas, inglés con voz y muchos juegos. 🎮📚🇬🇧 "+link;
 var wa="https://wa.me/?text="+encodeURIComponent(msg);
 return '<div class="card"><h3>📣 Invitar y compartir</h3>'
  +'<p class="mut" style="margin:8px 0;line-height:1.6">Comparte la app con otras familias. Cada familia tendrá su propia cuenta y sus propios hijos.</p>'
  +'<div style="display:flex;gap:8px;align-items:stretch"><input type="text" id="invlink" readonly value="'+esc(link)+'" style="flex:1;margin:0"><button class="pbtn ghost" style="width:auto;padding:0 14px;margin:0" onclick="copyInvite()" title="Copiar">📋</button></div>'
  +'<a class="pbtn" style="display:block;text-align:center;text-decoration:none;background:#25D366;color:#fff;border-color:#1da851" href="'+wa+'" target="_blank" rel="noopener">💬 Compartir por WhatsApp</a>'
  +'<button class="pbtn ghost" onclick="showInviteQR()">📱 Ver código QR</button>'
  +'<div id="qrbox" style="display:flex;justify-content:center;margin-top:10px"></div>'
  +'<p class="tip">💡 Próxima etapa: invitaciones por correo y que cada hijo entre con su propia cuenta ligada a la tuya.</p></div>';}
function copyInvite(){
 var i=document.getElementById("invlink");if(!i)return;i.focus();i.select();
 var done=function(){if(typeof toast==="function")toast("✓ Link copiado",true,1200);};
 try{navigator.clipboard.writeText(i.value).then(done,function(){try{document.execCommand("copy");done();}catch(e){}});}
 catch(e){try{document.execCommand("copy");done();}catch(_){}}}
function showInviteQR(){
 var box=document.getElementById("qrbox");if(!box)return;box.innerHTML="";
 if(typeof QRCode==="undefined"){box.innerHTML='<span class="mut" style="font-size:.85rem">No se pudo cargar el QR (revisa tu internet e intenta de nuevo).</span>';return;}
 try{new QRCode(box,{text:inviteLink(),width:200,height:200,colorDark:"#1E2A4A",colorLight:"#ffffff"});
  var cap=document.createElement("p");cap.className="mut";cap.style.cssText="font-size:.8rem;text-align:center;width:100%;margin-top:8px";
  cap.textContent="Escanéalo para abrir la app";box.appendChild(cap);
 }catch(e){box.innerHTML='<span class="mut">No se pudo generar el QR.</span>';}}
