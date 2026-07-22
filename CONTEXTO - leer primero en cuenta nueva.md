# Contexto — Academia Familiar (juego educativo para los hijos)

> **Instrucción para Claude (máquina/cuenta nueva):** lee este archivo COMPLETO y guárdalo en memoria antes de tocar nada. Luego lee `README.md`.

## Qué es
PWA educativa tipo juego para los hijos de Katerine. **HTML/CSS/JS puro** (sin frameworks ni build), con service worker (`sw.js`), `manifest.webmanifest`, IA opcional de Google Gemini y sincronización familiar opcional con Firebase. Todas las funciones están descritas en `README.md`.

## Estado del proyecto
- **Versión actual:** v9.63 (el versionado va en los mensajes de commit — ver `git log`).
- **Todo el código y el historial completo están en GitHub.** La copia local del computador original **se eliminó a propósito** tras confirmar que el repo remoto tenía todo (local == remoto).
- **Despliegue:** GitHub Pages, cuenta original **`katej-tech`**, en `https://katej-tech.github.io/academia-familiar/`. **`git push` publica automáticamente.**

## Cómo retomar el proyecto en la máquina nueva

### Caso A — misma cuenta de GitHub (katej-tech)
```powershell
gh auth login --web           # iniciar sesión una vez
git clone https://github.com/katej-tech/academia-familiar.git
cd academia-familiar
python -m http.server 8765     # probar en http://localhost:8765
```
Editas, subes la versión (ver abajo), y `git push` publica en la misma URL.

### Caso B — cuenta de GitHub NUEVA (distinta a katej-tech)
1. Clona el código (con o sin sesión, el repo es público):
   ```powershell
   git clone https://github.com/katej-tech/academia-familiar.git
   cd academia-familiar
   ```
2. Apunta el repo a la cuenta nueva y publícalo:
   ```powershell
   gh auth login --web         # inicia sesión con la cuenta NUEVA
   git remote remove origin
   gh repo create academia-familiar --public --source . --push
   gh api repos/{owner}/academia-familiar/pages -X POST -f "source[branch]=main" -f "source[path]=/"
   ```
3. **La URL nueva será** `https://LA-CUENTA-NUEVA.github.io/academia-familiar/`.
   ⚠️ Cambia de dominio: hay que **reinstalar la PWA en las tablets** con la URL nueva (el progreso se guarda por dispositivo; en el panel de padres hay Exportar/Importar respaldo para no perderlo). La clave de Gemini también se vuelve a poner por dispositivo.

## Reglas al desarrollar (importantes)
- **Cache-busting en CADA release:** sube el número en DOS sitios o los dispositivos no ven cambios:
  1. el `?v=X.Y.Z` de cada `<script>`/`<link>` en `index.html`
  2. la constante `VERSION = "af-vX.Y.Z"` en `sw.js`
  Luego: `git add -A && git commit -m "vX.Y.Z: ..." && git push`.
- **Copyright:** la app es PÚBLICA y sin anuncios. No usar personajes/marcas con derechos (Nintendo, Namco, Among Us, Roblox, futbolistas reales…); recrear la jugabilidad con personajes originales. Literatura: dominio público o reescrituras propias.
- **La clave de Gemini nunca se sube al repo** — vive en el `localStorage` de cada dispositivo (Panel de padres → Configuración). Si falla, usar 🩺 Diagnóstico de la IA.
- Arquitectura y patrones (render por strings, estados globales de juego, limpieza en `stopGames`, IA con fallback local): ver sección "Patrones clave" del `README.md`.

## Últimas cosas pedidas / hechas (contexto de conversación)
La app pasó por v9.46→v9.63: cursos Udemy, duelo IA por niveles, perfil estilo Facebook, trivia IA, rediseño teen, temas del cole, videos por tema, penales matemáticos, laberinto, saltarín, **Nave Impostora** (roles, 2 mapas, personalización, tareas + estudio), diagnóstico de IA, y el **hub reorganizado por iconos** con desbloqueo de juegos mediante 2 "llaves" (estudiar + crear arte). Todo verificado y desplegado.
