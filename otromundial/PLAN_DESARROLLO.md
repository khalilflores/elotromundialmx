# Plan de Desarrollo — El Otro Mundial

> Documental híbrido · Astro SSG + Tailwind + GSAP + Lenis + Leaflet + n8n

---

## Estado Actual del Proyecto (22-05-2026)

### Ya implementado

- [x] Proyecto Astro funcional (`otromundial`) con build exitoso.
- [x] Home inicial reemplazada por una landing base en `src/pages/index.astro`.
- [x] Secciones base listas: hero, servicios, arquitectura de flujo y contacto.
- [x] Formulario preparado para integración por webhook con n8n (pendiente URL real).
- [x] Configuración MCP para VS Code creada en `.vscode/mcp.json`.
- [x] Instrucciones de Copilot para n8n agregadas en `.github/copilot-instructions.md`.
- [x] Ajustes locales de VS Code para usar instruction files en `.vscode/settings.json`.

### Pendiente inmediato (antes de conectar n8n en producción)

- [ ] Reemplazar `webhookUrl` en `src/pages/index.astro` por la URL real de n8n.
- [ ] Definir mensaje de éxito/error final del formulario según respuesta del webhook.
- [ ] Crear workflow mínimo en n8n para recibir `{ name, email, company, message, source }`.
- [ ] Validar flujo completo: formulario web → webhook n8n → acción (email/CRM/Slack).

## Capa de Negocio y Estrategia (MVP)

### Definición del producto

**El Otro Mundial** es un documental interactivo en tiempo real (Web-Doc): una bitácora de 40 días por México durante el Mundial 2026, enfocada en fútbol, cultura y comunidades fuera del circuito corporativo de los estadios.

### Propuesta de valor

- Autenticidad narrativa en campo (calles, desiertos, pueblos)
- Contracultura frente al espectáculo de titulares
- Comunidad participativa con sentido de pertenencia

### Dirección de arte y estilo visual (MVP)

#### 1) Textura analógica y grano (Analog Grunge)

- El look debe emular película de 16mm, material documental y carretera.
- Evitar superficies planas “corporativas” y acabados pulidos.
- Implementación:
  - Fondo con textura sutil de ruido/grano (CSS overlay con opacidad baja).
  - Imágenes con contraste y saturación controlada, ligera desaturación y grano.
  - Sensación general “polvorienta”, orgánica y no clínica.

#### 2) Tipografía de manifiesto (Bold Editorial)

- Titulares y CTAs con tipografías sans audaces, altas y de impacto.
- Referencias: **Oswald** o **Space Grotesk** para encabezados.
- Cuerpo en **Inter** o **Work Sans** para lectura móvil.
- Implementación:
  - H1/H2 en mayúsculas parciales, tracking corto, alto contraste visual.
  - CTAs con peso tipográfico alto y mensajes directos.

#### 3) Paleta terrosa y contracultural

- Base: asfalto, terracota, verde agave, beige/blanco humo.
- Acento: rosa neón deslavado (uso puntual para CTA principal).
- Implementación:
  - Prohibido blanco puro en superficies extensas; usar `#F5F5F5` o beige claro.
  - Acentos intensos reservados para acciones clave.

#### 4) Layout comunitario tipo pastiche (DIY)

- Evitar rigidez de grilla perfecta corporativa.
- Implementación:
  - Tarjetas de bitácora con bordes duros y gruesos (`border-4`).
  - Superposiciones leves entre bloques para sensación de collage.
  - Imágenes tipo “foto pegada” con marcos visibles y offsets sutiles.

### Tokens visuales sugeridos

- Asfalto: `#121212`
- Blanco humo: `#F5F5F5`
- Terracota: `#E2725B`
- Verde agave: `#738F54`
- Rosa neón: `#FF107A`
- Beige auxiliar: `#EDE7DA`

### Reglas de uso de CTA en la estética

- CTA principal (“Sigue la ruta”): color acento + tipografía editorial.
- CTA foro por ciudad: visible en tarjetas/mapa, prioridad alta en móvil.
- CTA de respaldo/preorden: destacado en Manifiesto, sin competir con el CTA principal de captación.

### Objetivos de negocio del MVP

1. **Comunidad (Datos)**: captar contactos para distribución diaria de bitácora
2. **Asistencia Física**: registrar personas para foros comunitarios por ciudad
3. **Patrocinios (B2B)**: usar el sitio como pitch deck vivo para marcas afines
4. **Monetización (B2C)**: apoyo en Escrow.com / preventa de fotolibro o merch

### Estrategia de CTAs por superficie

- **Hero + sticky footer**: “Sigue la ruta”
  - Captura mínima: email o WhatsApp
  - Objetivo: crecimiento de audiencia propia
- **Tarjetas de ruta / mapa**: “Únete al foro en [Locación]”
  - Registro por ciudad + automatización de acceso por n8n
  - Objetivo: mover tráfico digital a encuentros físicos
- **Página Manifiesto**: “Respalda el documental” / “Pre-ordena el fotolibro”
  - Objetivo: validar disposición de pago

### Embudo recomendado (orden de implementación)

1. Captura de contactos
2. Segmentación por ciudad/interés
3. Convocatoria a foros locales
4. Monetización posterior (apoyo en Escrow.com / preventa)

### KPIs de lanzamiento (Día 1)

- Visitantes únicos
- Tasa de conversión a contacto (principal)
- Costo por lead (si hay pauta)
- Registros a foros por ciudad
- CTR de CTA de respaldo/preorden

### Prioridad de conversión recomendada (Día 1)

**Prioridad #1: captar contactos.**

Motivo: es la base que habilita los otros dos objetivos (llenar foros y monetizar). Sin audiencia propia, el tráfico físico y el fondeo dependen de picos externos y no de un canal controlable.

---

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| Core | Astro SSG + `<ViewTransitions />` | SPA sin JavaScript pesado, SEO nativo |
| Estilos | Tailwind CSS | Sistema visual rápido, utilitario |
| Scroll | Lenis (`@studio-freight/lenis`) | Scroll fluido cinematográfico, ligero en rural |
| Animación | GSAP + ScrollTrigger | Parallax, pins, reveals narrativos |
| Mapas | Leaflet (Astro Island `client:visible`) | Mapas interactivos sin bloquear carga |
| CMS Pipeline | n8n → Git → Webhook | Automatización WhatsApp/Telegram → Content |
| CI/CD | Dokploy / Coolify | Auto-deploy en VPS tras cada commit |

---

## Principios de Arquitectura

- **GSAP nativo en `.astro`**: Sin React/Preact para animaciones. Todo GSAP corre en `<script>` tags dentro de componentes Astro. Solo Leaflet se carga como isla (React).
- **SEO primero**: OG images dinámicas por ruta, JSON-LD (BlogPosting + Event), URLs semánticas `/ruta/[slug]`.
- **Rendimiento rural**: Astro SSG genera HTML estático. Lenis + GSAP son livianos. Leaflet solo se hidrata `client:visible`.
- **ScrollTrigger refresh**: Al cargar imágenes, se llama `ScrollTrigger.refresh()` para evitar layout shift que rompa pins.

---

## Timeline: 4 Semanas

---

## Semana 1 — Estructura Base y Colecciones (Astro Core)

### Día 1 — Inicialización

- [x] `npm create astro@latest` con perfil `blog` o `minimal`, TypeScript estricto
- [ ] Instalar dependencias base:
  - `tailwindcss @tailwindcss/vite`
  - `@astrojs/mdx` + `@astrojs/sitemap`
  - `astro-seo`
  - `@astrojs/react` (solo para isla Leaflet)
  - `leaflet` + `@types/leaflet` + `react` + `react-dom`
  - `@studio-freight/lenis`
  - `gsap`
- [ ] Configurar `tailwind.config.mjs`:
  - Colores: `#121212` (asfalto), `#F5F5F5` (blanco humo), `#E2725B` (terracota), `#738F54` (verde agave), `#FF107A` (rosa neón)
  - Fuentes: `Oswald` / `Space Grotesk` (títulos), `Inter` / `Work Sans` (cuerpo) desde Google Fonts
  - Clase utilitaria: `.texture-img { @apply contrast-125 grayscale hover:grayscale-0 transition-all duration-500; }`
- [ ] `src/styles/global.css`: reset, variables CSS, clases de textura fotográfica

### Día 2 — Content Collections + Layout + Páginas

- [ ] `src/content/config.ts` — esquema Zod exacto:
  ```ts
  import { z, defineCollection } from 'astro:content';

  const rutaCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
      title: z.string(),
      location: z.string(),
      date: z.date(),
      coordinates: z.array(z.number()).length(2),
      coverImage: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().default(false)
    })
  });

  export const collections = { rutas: rutaCollection };
  ```
- [ ] Contenido mock: `src/content/rutas/` (3-4 .md con frontmatter real + párrafos)
- [ ] `src/layouts/Layout.astro`:
  - `<ViewTransitions />` en `<head>`
  - `astro-seo` con título, descripción, OG image dinámica
  - JSON-LD inyectado vía `<script type="application/ld+json">`
  - Slots para contenido
- [ ] Páginas base (con `getStaticPaths`):
  - `src/pages/index.astro`
  - `src/pages/ruta/index.astro`
  - `src/pages/ruta/[slug].astro`
  - `src/pages/manifiesto.astro`
- [ ] `astro.config.mjs`: integraciones `tailwind()`, `mdx()`, `sitemap()`, `react()`, output `'static'`

### Día 3 — SEO + JSON-LD + OG Dinámicas

- [ ] Componente `<SEO />` reutilizable que recibe `title`, `description`, `image`, `slug`, `type`
- [ ] OG image dinámica: usar `coverImage` de cada ruta como `og:image` en `/ruta/[slug]`
- [ ] JSON-LD `BlogPosting` para cada bitácora (fecha, autor, imagen, descripción)
- [ ] JSON-LD `Event` para foros comunitarios (si hay datos públicos)
- [ ] Verificar que cada página genera metadatos únicos en build

---

## Semana 2 — Motor de Animación (Lenis + GSAP)

### Día 4 — Lenis Smooth Scroll

- [ ] Crear `src/components/LenisInit.astro` con script nativo:
  ```astro
  <script>
    import Lenis from '@studio-freight/lenis'

    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  </script>
  ```
- [ ] Escuchar `astro:page-load` para reinicializar Lenis tras navegación
- [ ] Sincronizar Lenis con GSAP: `lenis.on('scroll', ScrollTrigger.update)`
- [ ] Verificar smooth scroll en todas las páginas, sin jank en móvil

### Día 5 — GSAP Core + Loader Animado

- [ ] Componente `<GSAPInit.astro>` con script nativo:
  - `gsap.registerPlugin(ScrollTrigger)`
  - `ScrollTrigger.refresh()` en `astro:page-load`
  - `ScrollTrigger.refresh()` cuando imágenes terminen de cargar (`window.addEventListener('load', ...)`)
- [ ] **Loader de entrada**:
  - Logo o texto "El Otro Mundial" en centro de pantalla
  - GSAP timeline: fade-out del loader → revelar hero con parallax
  - Usar `gsap.timeline()` con `opacity` y `scale` en el loader
- [ ] Hero parallax: imagen/video de fondo con `gsap.to(heroImg, { yPercent: 20, ease: 'none' })` atado a ScrollTrigger

### Día 6 — ScrollTrigger Narrativo (Parallax + Text Reveal)

- [ ] **Parallax de imágenes** en bitácoras:
  ```ts
  gsap.to('.parallax-img', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.img-container', start: 'top bottom', end: 'bottom top', scrub: 1 }
  })
  ```
- [ ] **Text reveal palabra por palabra** para citas clave:
  - Dividir texto en `<span>` por palabra
  - ScrollTrigger con `stagger: 0.05` animando `opacity` + `y`
  - Efecto documental cinematográfico
- [ ] **Línea de tiempo `/ruta`**: cada entrada de la timeline se revela con `opacity: 0` → `opacity: 1` + `x` al entrar al viewport

---

## Semana 3 — Mapas + Pins + Galería

### Día 7 — Componente Leaflet Island

- [ ] `src/components/Mapa.jsx` (React):
  - Props: `coordinates`, `popupText`, `zoom`, `markers[]`
  - `useEffect` con `L.map()`, tile layer CartoDB dark, marker personalizado (terracota)
  - Cleanup al desmontar
- [ ] `src/components/MapaGeneral.jsx`:
  - Múltiples marcadores para todas las rutas
  - Click en marker → `window.navigation.navigate('/ruta/[slug]')` (ViewTransitions)
- [ ] Integrar en páginas:
  - `index.astro`: `<MapaGeneral client:visible />`
  - `ruta/[slug].astro`: `<Mapa client:visible />` centrado en coordenadas de la parada

### Día 8 — ScrollTrigger Pin + Mapa

- [ ] Layout de dos columnas en bitácora (desktop):
  - Izquierda: texto de crónica con ScrollTrigger reveals
  - Derecha: mapa sticky con `pin`
- [ ] Configurar pin:
  ```ts
  ScrollTrigger.create({
    trigger: '.bitacora-content',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.map-container',
    pinSpacing: false
  })
  ```
- [ ] Animación de pulso en marcador del mapa al hacer scroll
- [ ] Polyline conectando paradas visitadas en el mapa general
- [ ] Responsive: columna única en mobile, mapa debajo del texto

### Día 9 — Galería de imágenes con ScrollTrigger

- [ ] Galería en bitácora: imágenes en fila con fade-in progresivo
- [ ] ScrollTrigger con `stagger: 0.2` y `start: 'top 80%'`
- [ ] Efecto de zoom suave al hover (CSS + GSAP)
- [ ] Lightbox opcional (post-MVP)

---

## Semana 4 — Pipeline + Rendimiento + Deploy

### Día 10 — n8n → Markdown → Git

- [ ] En n8n autoalojado:
  - **Webhook node**: recibe POST con `{ title, location, date, coordinates, tags, content, images[] }`
  - **HTTP Request**: descarga imágenes desde URLs
  - **Code node**: genera frontmatter YAML + body markdown
  - **Write file**: escribe `src/content/rutas/<slug>.md`
  - **Git node**: `git add .`, `git commit -m "nueva parada: {title}"`, `git push`
- [ ] Formato generado por n8n:
  ```markdown
  ---
  title: "Nombre del lugar"
  location: "Estado, País"
  date: 2025-06-15
  coordinates: [19.4326, -99.1332]
  coverImage: "./cover.webp"
  coverAlt: "Descripción de la foto"
  tags: ["comunidad", "cultura"]
  draft: false
  ---

  Contenido de la crónica...
  ```
- [ ] Las imágenes se optimizan a WebP/AVIF durante `astro build` via `astro:assets`

### Día 11 — Optimización de Imágenes y Rendimiento

- [ ] Usar `<Image />` de `astro:assets` en TODAS las imágenes:
  - `src/pages/ruta/[slug].astro`: `coverImage` con `<Image />`
  - Galerías: `<Image />` con `widths`, `formats: ['webp', 'avif']`
- [ ] ScrollTrigger.refresh() al finalizar carga de imágenes:
  ```ts
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => ScrollTrigger.refresh())
  })
  ```
- [ ] Verificar Lighthouse: Performance > 90, CLS < 0.1

### Día 12 — CI/CD + Deploy en VPS

- [ ] Configurar Dokploy o Coolify en VPS
- [ ] Vincular repositorio Git
- [ ] Comando de build: `astro build`
- [ ] Auto-Deploy: cada push a `main` ejecuta build y despliega
- [ ] Healthchecks, dominio, HTTPS (Caddy/Let's Encrypt)
- [ ] Prueba integral: WhatsApp → n8n → commit → build → live
- [ ] PWA manifest + icons (post-MVP service worker)

---

## Estructura de Archivos Final

```
src/
├── content/
│   ├── config.ts              # Schema Zod
│   └── rutas/
│       ├── tula.md
│       ├── oaxaca.md
│       └── veracruz.md
├── components/
│   ├── LenisInit.astro        # Smooth scroll init
│   ├── GSAPInit.astro         # ScrollTrigger + refresh
│   ├── Loader.astro           # Animación de entrada
│   ├── Mapa.jsx               # Leaflet island
│   ├── MapaGeneral.jsx        # Mapa con múltiples marcadores
│   ├── ParallaxImg.astro      # Wrapper con data-speed
│   └── SEO.astro              # Metadatos + JSON-LD
├── layouts/
│   └── Layout.astro           # ViewTransitions + SEO + Lenis + GSAP
├── pages/
│   ├── index.astro
│   ├── ruta/
│   │   ├── index.astro        # Timeline de todas las paradas
│   │   └── [slug].astro       # Bitácora individual
│   └── manifiesto.astro
└── styles/
    └── global.css             # Tailwind + clases de textura
```

---

## Checklist de Sanity por Semana

### Semana 1
- [ ] `npm run dev` sin errores
- [ ] `/`, `/ruta`, `/ruta/[slug]`, `/manifiesto` renderizan
- [ ] ViewTransitions funcionan entre páginas
- [ ] OG image y JSON-LD se generan por cada ruta
- [ ] Tailwind con colores y tipografías correctas

### Semana 2
- [ ] Lenis activo con scroll fluido en toda la app
- [ ] Loader de entrada se reproduce y revela hero
- [ ] Parallax visible en imágenes de bitácoras
- [ ] Text reveal palabra por palabra funciona en citas
- [ ] ScrollTrigger refresca tras navegación (astro:page-load)

### Semana 3
- [ ] Mapa Leaflet carga con `client:visible`
- [ ] Pin de ScrollTrigger fija mapa en desktop
- [ ] Mapas responsive (colapsan a columna única en mobile)
- [ ] Galería de imágenes con fade-in progresivo

### Semana 4
- [ ] n8n recibe webhook y genera .md válido con frontmatter
- [ ] Commit se refleja en repositorio
- [ ] Auto-Deploy completo sin errores
- [ ] Lighthouse > 90 rendimiento
- [ ] Toda la ruta crítica funciona desde WhatsApp/Telegram a producción

---

## Post-MVP

- [ ] Service Worker (`@astrojs/service-worker`) para offline
- [ ] RSS Feed
- [ ] Buscador por tags y ubicaciones
- [ ] Gallery lightbox con GSAP
- [ ] i18n (ES/EN)
