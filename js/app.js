"use strict";
/* ============ ARRANQUE ============ */
screenStart();

/* ============ PWA: service worker ============ */
if("serviceWorker" in navigator){
 window.addEventListener("load",()=>{
  navigator.serviceWorker.register("sw.js").catch(()=>{/* sin HTTPS no hay SW; la app funciona igual */});
 });
}
