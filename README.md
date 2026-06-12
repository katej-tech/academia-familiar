# 🏠 Academia Familiar

Plataforma educativa para los niños de la casa: mundos de retos infinitos (con IA opcional de Gemini),
inglés con voz, juegos de memoria, criaturas coleccionables que evolucionan y panel de padres con métricas.

## Estructura del proyecto

```
index.html              ← página principal (solo estructura)
css/styles.css          ← todos los estilos
js/core.js              ← estado, guardado, voz, motor de IA y temas
js/content.js           ← bancos de contenido (cuentos, quizzes, vocabulario)
js/content-extra.js     ← generadores: ubicación, mayor/menor, adivinanzas, ciencias, memoria
js/kid.js               ← mundo del niño (mapa, juegos, criaturas)
js/teen.js              ← studio de la niña (quizzes, lecturas, flashcards)
js/parent.js            ← panel de padres (PIN, métricas, configuración)
js/app.js               ← arranque + registro del service worker
sw.js                   ← service worker (funciona sin internet)
manifest.webmanifest    ← hace la app instalable (PWA)
icons/                  ← iconos de la app
```

## Probar en el computador

```powershell
cd academia-familiar
python -m http.server 8765
# abrir http://localhost:8765
```

## Publicar en GitHub Pages (gratis)

1. Inicia sesión una sola vez: `gh auth login --web`
2. Crea el repo y publica:
   ```powershell
   cd academia-familiar
   gh repo create academia-familiar --public --source . --push
   gh api repos/{owner}/academia-familiar/pages -X POST -f "source[branch]=master" -f "source[path]=/"
   ```
3. La página queda en `https://TU-USUARIO.github.io/academia-familiar/`

Para actualizar después de un cambio: `git add -A; git commit -m "cambio"; git push`
La app instalada en la tablet se actualiza sola al abrirla con internet.

## Instalar en la tablet/celular (como app)

Abrir la URL en Chrome (Android) → menú ⋮ → **"Agregar a pantalla de inicio"** / **"Instalar app"**.
Queda con icono propio, pantalla completa y funciona offline.
Para un `.apk` literal: [PWABuilder.com](https://www.pwabuilder.com) con la URL de GitHub Pages.

## 🔐 Seguridad de la clave de Gemini

La clave **nunca** va en el código ni en GitHub. Se escribe una sola vez en el
*Panel de padres → Configuración* de cada dispositivo y vive solo en el `localStorage`
de ese navegador. El repo puede ser público sin riesgo.

## Notas

- El micrófono ("Di la palabra") y la voz necesitan **HTTPS** — funcionan en GitHub Pages
  y en localhost, no si abres el archivo directo con `file://`.
- El progreso se guarda por dispositivo; en el panel de padres hay exportar/importar respaldo.
