# 🏠 Academia Familiar

PWA educativa tipo juego para niños (primaria) y adolescentes. Vanilla **HTML + CSS + JavaScript** (sin frameworks ni build), instalable, funciona offline, con IA opcional de Google Gemini y sincronización familiar opcional con Firebase.

**En producción:** https://katej-tech.github.io/academia-familiar/ (cuenta GitHub `katej-tech`).
**`git push` publica automáticamente.** El versionado va en los mensajes de commit (`git log`); versión actual: **v9.63**.

---

## 🎯 Qué contiene (funciones)

**Modo niño (hub tipo pantalla de celular, por iconos):**
- **📚 Aprender** — mundos de retos adaptativos (mate, lenguaje, ciencias, sociales, inglés, lógica, la hora). Temario incluye: sumas/restas llevando y prestando, multiplicación, decenas, números en letras, problemas, **polígonos**, **diagramas de barras** (SVG real), el cuerpo y sus sistemas, ciclo del agua, **los alimentos**, **la Tierra y el espacio**, geografía, banderas, informática, etc.
- **🎨 Crear** — zona de Arte: **pizarra** (13 colores + 5 plumones), **colorear** (SVG + IA), **unir los puntos**, **letra cursiva**, **dibujar paso a paso**, **dibuja con IA**.
- **🎮 Jugar** (se desbloquea con 2 "llaves": estudiar + crear arte):
  - **🛸 Nave Impostora** — simulación tipo Among Us single-player: 2 mapas (Nave Espacial, Estación Lunar con cámara), 8 tripulantes, **rol aleatorio secreto** (tripulante/impostor), personalización (color + gorro), 8–10 tareas interactivas (cables, motor, escáner, pilotar, vidrio, fuego, electricidad) **+ tareas de estudio** (acertijos y cálculo), sabotajes con cámaras y votación.
  - **⚽ Penales matemáticos**, **🕵️ Detective del impostor** (deducción + preguntas), **🧠 Trivia Divertida** (IA), **🤖 Duelo contra la IA** por niveles, **🟡 Laberinto glotón** (estilo Pac-Man), **⛰️ Mundo Saltarín** (plataformas, 4 mundos temáticos, elige personaje), **🏴 Adivina la bandera**, arcade varios.
  - **🐾 Tamagotchi**, tienda, avatar, criaturas coleccionables.
- **🎬 Videos** — el padre asigna videos de YouTube por tema; el niño ve la clase y luego practica.
- **🎓 Cursos** (solo +9 años) — el padre asigna links (Udemy u otros) que abren fuera de la app.

**Modo adolescente** — home con hero + grid de tiles: English Academy, inglés por niveles A1→B2, química/física, grammar, comprensión, flashcards, teoría musical, retos cronometrados con combos, generación con IA.

**Panel de padres** — PIN, métricas por hijo, gestión de videos/cursos, clave de Gemini y **🩺 Diagnóstico completo de la IA** (prueba la clave paso a paso).

**IA (Gemini, opcional):** genera retos/trivias/cuentos sin repetir, ilustra cuentos, dibujos para colorear y voz premium. **Sin clave, todo funciona igual** con bancos locales.

---

## 🗂️ Estructura del proyecto

```
index.html              estructura + carga de scripts (con cache-busting ?v=X.Y.Z)
manifest.webmanifest    hace la app instalable (PWA)
sw.js                   service worker (network-first same-origin; constante VERSION af-vX.Y.Z)
css/styles.css          TODOS los estilos (temas: kid / teen / parent)
.claude/launch.json     config del server de preview (python http.server 8765)
icons/                  iconos de la app

js/
  core.js               estado global S, guardado, voz (TTS/STT), temas, TOPICS (catálogo de
                        temas con prompt de IA + fallback local), buildChallenges, stopGames
  app.js                arranque + registro del service worker
  content.js            bancos: cuentos, quizzes, vocabulario inglés, frases
  content-extra.js      generadores: ubicación, mayor/menor, adivinanzas, secuencias, ciencias…
  content-exam.js       bancos/generadores: sistemas, geografía, cultura, alimentos, la Tierra,
                        polígonos, diagramas de barras (SVG), banderas, capitales…
  kid.js                modo niño: hub de apps, mundos, retos (buildChallenges/ansCH), zona de
                        arte, cursos, menú de perfil, desbloqueo por "llaves" (estudio + arte)
  teen.js               modo adolescente: home, quizzes con combos, flashcards, geminiJSON
  parent.js             panel de padres: PIN, métricas, config, diagnóstico de IA, cursos
  games2.js             juegos: impostor clásico, ahorcado, sopa, crucigrama, dictado, obby…
  games3.js             juegos canvas/SVG: carrera, columnas, símbolos, duelo IA, trivia,
                        rompecabezas, penales, detective, laberinto, saltarín, NAVE IMPOSTORA
  board.js              zona de arte: pizarra, cursiva, colorear, unir puntos, dibujar, IA
  videos.js             videos por tema (YouTube) + geminiImage (ilustraciones IA)
  pet.js                tamagotchi
  avatar-shop.js        avatar y tienda
  tutor.js              tutor de inglés (habla/repite)
  english-academy.js / english-levels.js / english-stories.js   inglés (unidades, niveles, cuentos)
  gate.js               control de acceso / sesión
  invites.js            invitar hijos (cuentas de niño ligadas a la familia)
  firebase-sync.js      Firebase Auth + Firestore: cuentas familiares, sync, compartir clave/cursos
```

### Patrones clave (cómo está hecho)
- **SPA sin framework:** `render(html)` reemplaza `#app`; el HTML se arma con concatenación de strings y handlers `onclick` inline; los estados de juego son objetos globales (`NV`, `PL`, `MZ`, `PN`…).
- **PWA / cache-busting:** cada release sube el número en **dos sitios** — el `?v=X.Y.Z` de cada `<script>`/`<link>` en `index.html`, y la constante `VERSION = "af-vX.Y.Z"` en `sw.js`. Sin eso, los dispositivos no ven los cambios.
- **Juegos canvas:** loop con `requestAnimationFrame`, `dt` en segundos, limpieza en `stopGames()` (core.js) — al agregar un juego con animación, cancelar su `raf`/timers ahí.
- **IA:** `geminiJSON` (teen.js) y `geminiImage` (videos.js) con reintentos 429/503; anti-repetición con `aiSeenList`/`aiRemember` (core.js). Cada tema en `TOPICS` tiene `fallback()` local para funcionar sin clave.
- **Datos:** `localStorage["academiaFam2"]` (estado `S`). Con Firebase: `families/{ownerUid}`, `families/{fid}/profiles/{childUid}`, `memberships/{uid}`.

### ⚠️ Restricciones de copyright (la app es pública)
No reproducir personajes/marcas con derechos (Nintendo/Mario, Namco/Pac-Man, Among Us, Roblox, Disney, futbolistas reales, etc.). Se recrea la **jugabilidad** con **personajes originales**. Contenido literario: dominio público o **reescrituras propias**. La app **no lleva anuncios**.

---

## 💻 Probar en el computador

```powershell
cd academia-familiar
python -m http.server 8765
# abrir http://localhost:8765
```
> El micrófono y la voz necesitan **HTTPS o localhost** (no funcionan con `file://`).

---

## 🚀 Publicar / actualizar

**Actualizar (repo ya existente):**
```powershell
# 1) subir el número de versión en index.html (?v=) y en sw.js (VERSION) — ver "cache-busting"
git add -A
git commit -m "vX.Y.Z: descripción"
git push        # publica solo en GitHub Pages
```
La app instalada en la tablet se actualiza sola al abrirla con internet (recargar 1–2 min).

**Crear el repo desde cero (cuenta/máquina nueva):**
```powershell
gh auth login --web
cd academia-familiar
gh repo create academia-familiar --public --source . --push
gh api repos/{owner}/academia-familiar/pages -X POST -f "source[branch]=main" -f "source[path]=/"
# queda en https://TU-USUARIO.github.io/academia-familiar/
```

## 📱 Instalar en tablet/celular
Abrir la URL en Chrome (Android) → menú ⋮ → **"Agregar a pantalla de inicio" / "Instalar app"**.
Para un `.apk` real: [PWABuilder.com](https://www.pwabuilder.com) con la URL de Pages.

## 🔐 Clave de Gemini
La clave **nunca** va en el código ni en GitHub. Se escribe una sola vez en *Panel de padres → Configuración* de cada dispositivo y vive solo en el `localStorage` de ese navegador. Consíguela gratis en **aistudio.google.com/apikey** (esas vienen sin restricción de sitios). Si falla, usar el **🩺 Diagnóstico de la IA** del panel de padres.

---
Ver **`CONTEXTO - leer primero en cuenta nueva.md`** para el traspaso a otra máquina/cuenta.
