# BirthdaySis — contexto del proyecto

Regalo de cumpleaños (18 años) de **Jordi** para su hermana **Verónica**: un collage web estilo scrapbook cute, en español.
Repo: `Alesso-24/BirthdaySis` (https://github.com/Alesso-24/BirthdaySis). Local: `C:\Users\jordi\BirthdaySis`.
Publicación prevista: GitHub Pages en `https://alesso-24.github.io/BirthdaySis/` (ya configurado `site` y `base` en `astro.config.mjs`).

## Estado (2026-11-11) — VERSIÓN FINAL PUBLICADA
- **En línea:** https://alesso-24.github.io/BirthdaySis/ (GitHub Pages, repo público, workflow `.github/workflows/deploy.yml` con `withastro/action`; cada push a `main` se republica en ~2 min).
- Jordi dio el visto bueno final ("listo así queda"). Último commit publicado: título de carta "Para ti, mi Verito...".
- Reglas del usuario: publicar solo cuando lo pida; revisión visual en su navegador; simple > llamativo.
- La extensión de Chrome (claude-in-chrome) nunca respondió; la verificación visual se hizo con Edge headless + puppeteer-core.

## Stack
Astro 7.4 · GSAP 3.15 (ScrollTrigger, Draggable, InertiaPlugin — todos gratis) · Lenis (scroll suave) · canvas-confetti · fuentes @fontsource (Caveat Brush, Caveat, Gaegu) · sharp (Astro optimiza a webp).

## Estructura
- `src/data/collage.json` — **única fuente de verdad**: `meta` (name, age, from, letterTitle, letter[]), `categories` (id, title, note, photos[]), `captions` (número de foto → texto).
- `src/data/site.ts` — adapta el JSON para las páginas.
- `src/assets/photos/p01.jpg … p52.jpg` — 52 fotos (máx 1000 px, EXIF corregido). Orígenes: `f1..f39` sueltas de Descargas (falta f27), y 3 zips (`OneDrive_1_11-11-2026`, `Photos-1-001`, `Photos-1-001 (1)`). Se omitió `IMG_1140.MP4`.
- `src/pages/index.astro` — arma capítulos con `import.meta.glob` + `getImage`; contiene el `<dialog>` del visor y su CSS global.
- `src/components/` — `Hero` (título + tarta SVG con velitas), `Chapter` (cabecera + muro de polaroids + garabatos), `Doodle` (SVG a mano), `Letter` (sobre + carta).
- `src/scripts/main.ts` — toda la animación: Lenis, barra de progreso, chispas de cursor, intro, velitas/confeti, polaroids con `ScrollTrigger.batch`, hover, Draggable, parallax de garabatos, sobre, visor.
- `src/layouts/Base.astro` + `src/styles/global.css` — paleta, textura de papel, filtro SVG `#wobble` (trazo a mano), estados iniciales `.js`/`.rm`.
- `tools/curate.mjs` + `tools/curate.html` — herramienta local para clasificar/describir fotos y editar nombre/carta. Guarda directo en `collage.json`.
- `tools/collage.backup.json` — respaldo de las categorías cronológicas originales.

## Comandos
- `npm run dev` (o `npx astro dev --port 4321`) → http://localhost:4321/BirthdaySis/
- `npm run curate` → http://localhost:4400 (curador; guardado automático)
- `npm run build` → `dist/`

## Datos finales
Nombre: Verónica · edad: 18 · firma: Jordi. Título de carta: "Para ti, mi Verito...". Carta escrita por Jordi (solo ajusté puntuación/acentos; "con todo con medicina" = échale ganas con la carrera).
Categorías (historia, 52 fotos): chiquita y traviesa (5) · aventuras de niños (9) · tú y yo (12) · con el amor de papá y mamá (6) · la familia (8) · Duke y compañía (5) · tú, tal cual (7).
Pies de foto reescritos en limpio (sin "contexto para mí" ni paréntesis). Duke = perro actual; el Quinto = perro anterior. 16 fotos sin pie (2, 5, 10–16, 21, 22, 30, 43, 45, 51, 52) y así quedan.
Pendiente menor: fotos con papá en grupo (14, 15, 35 en "la familia") — Jordi no confirmó cuáles pasar a la sección de padres.

## Decisiones de diseño
- Look "no hecho por IA": paleta cálida propia (crema, berry, butter, sage, sky, lilac, peach), tinta marrón, papel con grano y puntos, cinta washi con borde irregular, garabatos SVG con filtro de ondulación, rotaciones deterministas por foto, sin emojis en la UI del sitio.
- Interacciones: tarta con 5 velitas clicables (al apagar todas → confeti y baja al collage; se pueden volver a encender), polaroids que caen al hacer scroll y se pegan con cinta, arrastrables con mouse (inclinación por velocidad), visor con animación desde la foto, sobre que se abre para la carta.
- Móvil/táctil: las fotos **no** se arrastran (Draggable bloquearía el scroll); solo tap para abrir.
- `prefers-reduced-motion`: se desactivan Lenis, intro, arrastre y entradas (clase `rm` en `<html>`).

## Trampas / notas
- En Windows el `python -c`/sed con rutas: usar rutas de Windows en Python, y escapar bien regex en sed.
- Si el dev server de Astro muestra "Failed to update routes via HMR / module runner closed" tras correr `astro build` a la vez, reiniciarlo.
- `<meta name="robots" content="noindex">` está puesto a propósito (es un regalo privado).
- Fuentes vienen de @fontsource (sin depender de Google Fonts en runtime).

## Cómo cambiar algo después
1. `npm run curate` (http://localhost:4400) para fotos, categorías, pies, nombre y carta → guarda en `src/data/collage.json`; o editar ese JSON a mano.
2. `git add -A && git commit && git push` → se republica solo.
3. Nunca commitear `node_modules`/`dist` (ya en .gitignore).

## Responsive (2026-11-11, sin publicar aún)
Probado con Edge headless + puppeteer-core (scripts en el scratchpad de la sesión, no en el repo) en 360x740, 390x844, 844x390, 768x1024, 1440x900 y 2560x1300: sin desborde horizontal ni errores de consola, visor y carta funcionan.
Arreglos aplicados: `overflow-x: clip` también en `html` (los garabatos con `right:-1%` ensanchaban el viewport móvil); sello de edad rediseñado; visor con `minmax(0,1fr)` para que quepa el botón "siguiente" en móvil; hero compacto en horizontal bajo 560 px de alto; muro de 4 columnas desde 1500 px y 5 desde 2200 px; flecha de la tarta dentro del hint; cinta de polaroid aparece después de que la foto aterriza.
La barra oscura inferior en capturas es la **Astro dev toolbar** (solo en dev).
Todo lo anterior ya está publicado.
