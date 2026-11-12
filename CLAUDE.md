# BirthdaySis — contexto del proyecto

Regalo de cumpleaños (18 años) de **Jordi** para su hermana **Verónica**: un collage web estilo scrapbook cute, en español.
Repo: `Alesso-24/BirthdaySis` (https://github.com/Alesso-24/BirthdaySis). Local: `C:\Users\jordi\BirthdaySis`.
Publicación prevista: GitHub Pages en `https://alesso-24.github.io/BirthdaySis/` (ya configurado `site` y `base` en `astro.config.mjs`).

## Estado (2026-11-11)
- Sitio Astro 7 completo y compilando (`npx astro build` OK). **Nada commiteado ni publicado**: el repo remoto sigue vacío.
- Falta: que Jordi revise el diseño en su navegador, y cuando lo pida, commit + push + deploy.
- No pude revisarlo visualmente yo mismo: la extensión de Chrome (claude-in-chrome) no respondió. Verificado solo con build + curl.
- Regla de trabajo del usuario: **no publicar/deployar hasta que lo pida**; revisión visual en su navegador antes; simple > llamativo (aunque aquí pidió "wow").

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

## Datos actuales
Nombre: Verónica · edad: 18 · firma: Jordi. Categorías (historia): chiquita y traviesa (5) · aventuras de niños (9) · tú y yo (12) · con el amor de papá y mamá (6) · la familia (8) · Duke y compañía (5) · tú, tal cual (7). Total 52.
Pies de foto escritos por Jordi (corregí solo erratas/acentos). 16 fotos sin descripción: 2, 5, 10, 11, 12, 13, 14, 15, 16, 21, 22, 30, 43, 45, 51, 52. Foto 42 ("cuando nos mudamos a Puebla") puesta en "la familia"; época incierta.
La carta es un borrador mío basado en sus descripciones; Jordi puede reescribirla.
Duke = perro actual; el Quinto = perro anterior (foto 7).

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

## Próximos pasos
1. Jordi revisa el diseño en su navegador y reporta qué ajustar (tamaños, garabatos, tarta, carta).
2. Resolver dudas: foto 42, orden de "tú y yo", describir las 16 fotos sin pie.
3. Cuando él lo pida: `git add/commit/push` (rama main) y activar GitHub Pages (workflow `withastro/action` o Settings → Pages → GitHub Actions). Atribución de commits según el system-reminder.
4. Opcional: probar en celular real; revisar rendimiento (52 imágenes lazy) y accesibilidad.

## Responsive (2026-11-11, sin publicar aún)
Probado con Edge headless + puppeteer-core (scripts en el scratchpad de la sesión, no en el repo) en 360x740, 390x844, 844x390, 768x1024, 1440x900 y 2560x1300: sin desborde horizontal ni errores de consola, visor y carta funcionan.
Arreglos: `overflow-x: clip` también en `html` (los garabatos con `right:-1%` ensanchaban el viewport móvil); sello de edad rediseñado; visor con `minmax(0,1fr)` para que quepa el botón "siguiente" en móvil; hero compacto en horizontal bajo 560 px de alto; muro de 4 columnas desde 1500 px y 5 desde 2200 px; flecha de la tarta dentro del hint; cinta de polaroid aparece después de que la foto aterriza.
La barra oscura inferior en capturas es la **Astro dev toolbar** (solo en dev).
**Estos cambios están solo en local: falta commit + push para que el link público los tenga.**
