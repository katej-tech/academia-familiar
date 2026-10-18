"use strict";
/* ============ PULIDO COMÚN DE LOS DIBUJOS 3D ============
   Pedido: «los dibujos en 3D les hace falta pulir mucho más». Las escenas 3D tenían una luz plana (solo ambiente + una
   direccional), así que todo se veía "recortado". Cada módulo llama a polish3D(THREE,renderer,scene,{radius}) justo después
   de crear sus luces y la escena gana: luz de cielo/suelo, sombras suaves (los objetos se hacen sombra a sí mismos y al suelo,
   lo que da volumen) y, opcionalmente, un suelo que recibe la sombra. Los meshes que se agreguen después (bloques, piezas…)
   se marcan solos en cada fotograma. Si algo falla, la escena queda como estaba. */
window.polish3D=function(THREE,renderer,scene,o){
 o=o||{};
 try{
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  let amb=null;const dirs=[];
  scene.children.forEach(function(c){if(c.isAmbientLight)amb=c;if(c.isDirectionalLight)dirs.push(c);});
  if(amb)amb.intensity*=.6;
  scene.add(new THREE.HemisphereLight(o.sky||"#FFFFFF",o.floor||"#B9CCE8",o.hemi==null?.9:o.hemi));
  const key=dirs[0];
  if(key){const r=o.radius||5,sc=key.shadow.camera;key.castShadow=true;sc.left=-r;sc.right=r;sc.top=r;sc.bottom=-r;sc.near=.5;sc.far=o.far||45;
   key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0007;key.shadow.normalBias=.025;key.intensity*=1.15;}
  if(o.groundY!=null){const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.ShadowMaterial({opacity:o.shadow==null?.24:o.shadow}));g.rotation.x=-Math.PI/2;g.position.y=o.groundY;g.receiveShadow=true;g.userData.noShadow=1;scene.add(g);}
  const tick=function(){scene.traverse(function(m){
   if(!m.isMesh||m.userData._sh||m.userData.noShadow)return;m.userData._sh=1;
   const mt=m.material;if(!mt)return;
   if(mt.isShadowMaterial||(mt.isMeshBasicMaterial&&(mt.side===THREE.BackSide||mt.transparent)))return; /* contornos y cristales no hacen sombra */
   m.castShadow=true;m.receiveShadow=true;});};
  const orig=renderer.render.bind(renderer);
  renderer.render=function(s,c){if(s===scene)tick();orig(s,c);};
 }catch(e){}};
