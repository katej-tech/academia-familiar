"use strict";
/* ============ PLANETARIO EN 3D (sistema solar explorable) ============
   Pedido explícito: "tipo planetario también le gusta lo de los planetas y eso". Los 8
   planetas orbitan el Sol; tocar uno lo resalta y muestra un dato curioso para niños.
   Distancias y tamaños NO son a escala real (si lo fueran, Mercurio sería invisible y
   Neptuno quedaría fuera de pantalla) — están ajustados para que los 8 se vean y se
   distingan bien. Mismo patrón que los demás módulos: formas nativas de Three.js. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const PLANETS=[
 {id:"mercurio",nm:"Mercurio",color:"#B0A79E",r:.11,dist:.9,speed:1.6,tipo:"Rocoso",lunas:"0",anio:"88 días",temp:"de -180 a 430 °C",
  facts:["Es el planeta más pequeño y el más cercano al Sol.","No tiene lunas.","Un año en Mercurio dura solo 88 días de la Tierra."],
  q:[{q:"¿Qué planeta está más cerca del Sol?",ops:["Mercurio","Venus","Marte","Júpiter"],a:0,exp:"Mercurio es el más cercano al Sol y el más pequeño."},
     {q:"¿Cuántas lunas tiene Mercurio?",ops:["Ninguna","Una","Dos","Diez"],a:0,exp:"Mercurio no tiene lunas."}]},
 {id:"venus",nm:"Venus",color:"#E8C27E",r:.16,dist:1.25,speed:1.2,tipo:"Rocoso",lunas:"0",anio:"225 días",temp:"465 °C",
  facts:["Es el planeta más caliente, aunque no es el más cercano al Sol.","Gira al revés que casi todos los planetas.","Se ve muy brillante al amanecer: le dicen el lucero del alba."],
  q:[{q:"¿Cuál es el planeta más caliente de todos?",ops:["Venus","Mercurio","Marte","Neptuno"],a:0,exp:"Venus tiene una atmósfera gruesa que atrapa el calor: ¡465 grados!"},
     {q:"Venus se ve como una estrella muy brillante al amanecer. ¿Cómo le dicen?",ops:["El lucero","El cometa","El mini sol","La luna"],a:0,exp:"Por su brillo le dicen el lucero del alba."}]},
 {id:"tierra",nm:"Tierra",color:"#3B82F6",r:.17,dist:1.62,speed:1.0,tipo:"Rocoso",lunas:"1",anio:"365 días",temp:"15 °C en promedio",
  facts:["¡Nuestro planeta! Es el único que conocemos con vida.","Casi tres cuartas partes de su superficie están cubiertas de agua.","Tiene una sola luna."],
  q:[{q:"¿Cuántas lunas tiene la Tierra?",ops:["Una","Ninguna","Dos","Cuatro"],a:0,exp:"La Tierra tiene una luna."},
     {q:"¿Qué cubre la mayor parte de la superficie de la Tierra?",ops:["Agua","Hielo","Arena","Bosques"],a:0,exp:"El agua cubre cerca de 3 de cada 4 partes de la Tierra."}]},
 {id:"marte",nm:"Marte",color:"#C1440E",r:.14,dist:1.98,speed:.8,tipo:"Rocoso",lunas:"2",anio:"687 días",temp:"-63 °C en promedio",
  facts:["Le dicen el planeta rojo por su tierra color óxido.","Tiene el volcán más grande del sistema solar: el Monte Olimpo.","Tiene dos lunas pequeñas: Fobos y Deimos."],
  q:[{q:"¿Cuál planeta es conocido como el planeta rojo?",ops:["Marte","Júpiter","Venus","Urano"],a:0,exp:"El óxido de hierro en su tierra lo pinta de rojo."},
     {q:"¿Cuántas lunas tiene Marte?",ops:["Dos","Una","Ninguna","Veinte"],a:0,exp:"Marte tiene dos lunas pequeñas: Fobos y Deimos."}]},
 {id:"jupiter",nm:"Júpiter",color:"#D9A066",r:.34,dist:2.55,speed:.45,tipo:"Gaseoso",lunas:"más de 90",anio:"12 años",temp:"-110 °C en las nubes",
  facts:["Es el planeta más grande del sistema solar.","Tiene una tormenta gigante, la Gran Mancha Roja, más grande que la Tierra.","Es una bola de gas: no tiene suelo donde pararse."],
  q:[{q:"¿Cuál es el planeta más grande del sistema solar?",ops:["Júpiter","Saturno","La Tierra","Neptuno"],a:0,exp:"Júpiter es tan grande que cabrían más de mil Tierras adentro."},
     {q:"Júpiter es un planeta…",ops:["Gaseoso","Rocoso","De hielo sólido","Vacío"],a:0,exp:"Júpiter es una enorme bola de gas; no se puede pisar."}]},
 {id:"saturno",nm:"Saturno",color:"#E9D8A6",r:.3,dist:3.15,speed:.34,ring:true,tipo:"Gaseoso",lunas:"más de 140",anio:"29 años",temp:"-140 °C en las nubes",
  facts:["Tiene enormes anillos hechos de hielo y roca.","Es tan liviano que flotaría en una piscina gigante de agua.","Tiene más de 140 lunas."],
  q:[{q:"¿Qué tiene Saturno que lo hace famoso?",ops:["Anillos","Volcanes","Océanos","Ciudades"],a:0,exp:"Los anillos de Saturno son los más grandes y bonitos."},
     {q:"Los anillos de Saturno están hechos de…",ops:["Hielo y roca","Oro","Humo","Luz"],a:0,exp:"Son millones de pedazos de hielo y roca dando vueltas."}]},
 {id:"urano",nm:"Urano",color:"#9BE7E0",r:.22,dist:3.65,speed:.24,tipo:"Gigante de hielo",lunas:"27",anio:"84 años",temp:"-224 °C",
  facts:["Gira de lado, como una pelota rodando por su órbita.","Es de color azul verdoso claro.","Es uno de los planetas más fríos."],
  q:[{q:"¿Qué tiene de raro Urano al girar?",ops:["Gira de lado","No gira","Gira más rápido que la luz","Gira hacia el Sol"],a:0,exp:"Urano está inclinado y rueda de lado."},
     {q:"¿De qué color se ve Urano?",ops:["Azul verdoso claro","Rojo","Amarillo","Negro"],a:0,exp:"El gas metano le da su color azul verdoso."}]},
 {id:"neptuno",nm:"Neptuno",color:"#3B5BA9",r:.21,dist:4.1,speed:.19,tipo:"Gigante de hielo",lunas:"14",anio:"165 años",temp:"-214 °C",
  facts:["Es el planeta más lejano del Sol.","Tiene los vientos más fuertes: ¡más de 2000 km por hora!","Es de un azul intenso."],
  q:[{q:"¿Cuál es el planeta más lejano del Sol?",ops:["Neptuno","Urano","Saturno","Marte"],a:0,exp:"Neptuno es el octavo y último planeta."},
     {q:"Neptuno tiene los…",ops:["Vientos más fuertes","Volcanes más altos","Anillos más grandes","Océanos más profundos"],a:0,exp:"En Neptuno soplan vientos de más de 2000 km por hora."}]}
];
PLANETS.forEach(function(p){p.fact=p.facts[0];});
const SUN_FACT="La estrella que nos da luz y calor. ¡Es tan grande que caben más de un millón de planetas Tierra dentro!";

let LIVE=null;
function dispose3DPlanets(){
 if(!LIVE)return;
 try{cancelAnimationFrame(LIVE.raf);}catch(e){}
 try{
  LIVE.scene.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  LIVE.renderer.dispose();
  if(LIVE.renderer.domElement&&LIVE.renderer.domElement.parentNode)LIVE.renderer.domElement.parentNode.removeChild(LIVE.renderer.domElement);
 }catch(e){}
 LIVE=null;}

function render3DPlanets(containerId,onSelect){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DPlanets();
 const w=el.clientWidth||320,h=el.clientHeight||320;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
 renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#0B1120");
 const camera=new THREE.PerspectiveCamera(42,w/h,.1,50);
 camera.position.set(0,3.6,4.6);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,.55));

 const sun=new THREE.Mesh(new THREE.SphereGeometry(.42,20,16),
  new THREE.MeshStandardMaterial({color:"#FBBF24",emissive:"#F59E0B",emissiveIntensity:1}));
 sun.userData.id="sol";scene.add(sun);
 const sunLight=new THREE.PointLight(0xffffff,2.2,20);scene.add(sunLight);

 const tappable=[sun];
 const orbits=[];
 PLANETS.forEach(function(p){
  const ring=new THREE.Mesh(new THREE.RingGeometry(p.dist-.006,p.dist+.006,64),
   new THREE.MeshBasicMaterial({color:"#334155",side:THREE.DoubleSide,transparent:true,opacity:.5}));
  ring.rotation.x=Math.PI/2;scene.add(ring);
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.r,18,14),new THREE.MeshStandardMaterial({color:p.color,roughness:.6}));
  mesh.userData.id=p.id;
  if(p.ring){
   const sr=new THREE.Mesh(new THREE.RingGeometry(p.r*1.4,p.r*2.1,32),
    new THREE.MeshBasicMaterial({color:"#C9B27C",side:THREE.DoubleSide,transparent:true,opacity:.85}));
   sr.rotation.x=Math.PI/2.4;mesh.add(sr);
  }
  scene.add(mesh);tappable.push(mesh);orbits.push({mesh:mesh,dist:p.dist,speed:p.speed,ang:Math.random()*Math.PI*2});
 });

 const raycaster=new THREE.Raycaster();
 let selected=null;
 function setSelected(m){
  if(selected&&selected.material)selected.material.emissive&&selected.material.emissive.set(0x000000);
  selected=m;
  if(selected&&selected!==sun){selected.material.emissive=selected.material.emissive||new THREE.Color(0);selected.material.emissive.set(0xffffff);selected.material.emissiveIntensity=.5;}
  if(onSelect)onSelect(selected?selected.userData.id:null);
 }
 renderer.domElement.style.touchAction="none";
 renderer.domElement.addEventListener("pointerdown",function(ev){
  const rect=renderer.domElement.getBoundingClientRect();
  const x=((ev.clientX-rect.left)/rect.width)*2-1;
  const y=-((ev.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({x:x,y:y},camera);
  const hits=raycaster.intersectObjects(tappable);
  if(hits.length)setSelected(hits[0].object);
 });
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,orbits:orbits,camAng:0};
 (function loop(){
  LIVE.raf=requestAnimationFrame(loop);
  LIVE.t+=0.01;
  orbits.forEach(function(o){
   o.ang+=0.01*o.speed;
   o.mesh.position.set(Math.cos(o.ang)*o.dist,0,Math.sin(o.ang)*o.dist);
   o.mesh.rotation.y+=0.03;
  });
  sun.rotation.y+=0.004;
  LIVE.camAng+=0.0015;
  camera.position.set(Math.sin(LIVE.camAng)*4.8,3.6,Math.cos(LIVE.camAng)*4.8);
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
 })();}

/* planeta dibujado por el niño: su dibujo (mapa 2:1) se envuelve en una esfera que gira */
function render3DDrawnPlanet(containerId,dataURL,withRing){
 const el=document.getElementById(containerId);if(!el)return;
 dispose3DPlanets();
 const w=el.clientWidth||300,h=el.clientHeight||260;
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));renderer.setSize(w,h);
 el.innerHTML="";el.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color("#0B1120");
 const camera=new THREE.PerspectiveCamera(38,w/h,.1,50);camera.position.set(0,.3,3.4);camera.lookAt(0,0,0);
 scene.add(new THREE.AmbientLight(0xffffff,1.1));const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.position.set(3,2,4);scene.add(dl);
 const tex=new THREE.TextureLoader().load(dataURL);tex.colorSpace=THREE.SRGBColorSpace;
 const planet=new THREE.Mesh(new THREE.SphereGeometry(.85,40,30),new THREE.MeshStandardMaterial({map:tex,roughness:.8}));
 const g=new THREE.Group();g.add(planet);
 if(withRing){const r=new THREE.Mesh(new THREE.RingGeometry(1.15,1.7,64),new THREE.MeshBasicMaterial({color:"#D9C58F",side:THREE.DoubleSide,transparent:true,opacity:.8}));r.rotation.x=Math.PI/2.3;g.add(r);}
 g.rotation.z=.25;scene.add(g);
 for(let i=0;i<70;i++){const st=new THREE.Mesh(new THREE.SphereGeometry(.012,4,4),new THREE.MeshBasicMaterial({color:"#FFFFFF"}));st.position.set((Math.random()-.5)*7,(Math.random()-.5)*5,-2-Math.random()*2);scene.add(st);}
 LIVE={renderer:renderer,scene:scene,camera:camera,raf:null,t:0,orbits:[],camAng:0};
 (function loop(){LIVE.raf=requestAnimationFrame(loop);planet.rotation.y+=.008;renderer.render(scene,camera);})();}
window.render3DDrawnPlanet=render3DDrawnPlanet;
window.PLANETS=PLANETS;
window.SUN_FACT=SUN_FACT;
window.render3DPlanets=render3DPlanets;
window.dispose3DPlanets=dispose3DPlanets;
