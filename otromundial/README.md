# El Otro Mundial

Sitio oficial de campaña para invitar personas a viajar en **El Otro Mundial** durante el Mundial 2026 en México.

Este repositorio se publicará desde **khalilflores** (programación), con **Ciudadan** como organizador del proyecto.

## ¿Qué es El Otro Mundial?

Una caravana cultural y documental por México: fútbol, comunidad, carretera y encuentros reales fuera del circuito corporativo de los estadios.

La web está pensada para convertir visitantes en viajeros:

1. Descubren la propuesta
2. Dejan su contacto
3. Eligen ciudad/foro
4. Se suman al viaje o a formas de apoyo

## CTA principal de campaña (Kick)

Cuando se active la campaña pública, usar este enlace en los botones principales:

`[PLACEHOLDER_KICK_CAMPAIGN_URL]`

Sugerencia temporal de formato:

`https://kick.com/[tu-canal-o-campaña]`

## Plataforma de apoyo (Escrow)

Para recibir apoyos seguros de la comunidad y patrocinadores, el proyecto utiliza la plataforma segura:

`https://www.escrow.com`

## Mensaje para visitantes del repo

Si llegaste aquí como viajero potencial, colaborador o aliado:

- Únete a la comunidad
- Reserva tu lugar en los foros
- Sigue la campaña oficial en Kick (cuando esté publicada)

## Mensaje para programadores que encuentren el repo

Este proyecto también funciona como vitrina técnica para atraer talento dev hacia la comunidad del proyecto.

Si eres dev y te interesa colaborar o seguir la campaña:

1. Revisa el código base
2. Levanta el proyecto local
3. Entra a la campaña en Kick con el enlace placeholder de arriba

## Stack tecnológico

- Astro 6
- React 19
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Lenis
- @jdevalk/astro-seo-graph
- @astrojs/sitemap

## Flujo de conversión implementado en la landing

- Hero audiovisual
- Countdown de lanzamiento
- Formulario de captación de leads
- Registro por ciudad para foros
- Formulario de soporte (viaje, fotolibro, patrocinio)

Archivo principal:
- `src/pages/index.astro`

## Integraciones actuales

- SEO técnico + sitemap
- Formularios listos para webhook
- Embed de YouTube

Webhooks a configurar:
- `contactWebhookUrl`
- `forumWebhookUrl`
- `supportWebhookUrl`

## Instalación local

```bash
npm install
npm run dev
```

Sitio local: `http://localhost:4321`

## Build de producción

```bash
npm run build
npm run preview
```

## Créditos

- **Organización y narrativa:** Ciudadan
- **Desarrollo y publicación del repo:** Khalil Flores
