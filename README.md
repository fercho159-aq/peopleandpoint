# People and Point — sitio web

Reconstrucción limpia del sitio de [People and Point](https://peopleandpoint.com) en **Next.js 15 (App Router) +
TypeScript strict + Tailwind CSS v4**. Reemplaza el WordPress original, que estaba comprometido con spam SEO
inyectado (posts de casinos y enlaces a `aviamastersgame.es`). Ese contenido **no** existe en este proyecto.

## Stack

- Next.js 15 · React 19 · App Router, componentes de servidor por defecto
- TypeScript en modo `strict` — sin `any`, con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`
- Tailwind CSS v4 (config CSS-first en `app/globals.css`, tokens bajo `@theme`)
- `next/font` para Montserrat (Google) y Madani (local)

## Estructura

```
app/
  layout.tsx                     header + footer + fuentes + metadata
  page.tsx                       home
  about/                         Nosotros
  contact/                       Contacto
  [slug]/                        páginas de servicio (SSG desde lib/site.ts)
  privacy-policy/                aviso de privacidad
  terminos-y-condiciones-del-servicio/
  api/contact/route.ts           recepción del formulario
  sitemap.ts · robots.ts · not-found.tsx
components/                      header, footer, formulario, FAQ, UI compartida
lib/site.ts                      contenido tipado (servicios, valores, FAQ, oficinas)
lib/contact.ts                   tipos y validación del formulario
public/images · public/fonts     assets extraídos del sitio original
```

Las URLs originales se conservan (`/about`, `/contact`, `/maquila-de-nomina`, …) para no romper enlaces ni SEO.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
```

## Formulario de contacto

`POST /api/contact` valida en servidor y envía el correo con [Resend](https://resend.com). Variables de entorno:

| Variable         | Requerida | Descripción                                                     |
| ---------------- | --------- | --------------------------------------------------------------- |
| `RESEND_API_KEY` | sí        | Sin ella el endpoint responde 503 y la UI muestra el correo.     |
| `CONTACT_TO`     | no        | Destinatario. Default: `contacto@peopleandpoint.com`.            |
| `CONTACT_FROM`   | no        | Remitente verificado en Resend.                                  |

Para usar otro proveedor (SMTP, SendGrid, HubSpot), sustituye `sendWithResend` en `app/api/contact/route.ts`.

## Deploy en Vercel

```bash
npx vercel        # preview
npx vercel --prod # producción
```

Framework preset **Next.js**, sin build command personalizado. Agrega `RESEND_API_KEY` en Environment Variables.

## Pendientes de contenido

Estos puntos vienen del sitio original y conviene revisarlos con el cliente:

- **REPSE**: la página original solo tenía el resumen; el párrafo descriptivo se redactó aquí y debe validarse.
- **Equipo**: el sitio original mostraba «Marta — CEO», «Enrique — CTO» y «Pablo» sin rol ni fotos. Faltan retratos y
  el cargo de Pablo (aquí aparece como «Dirección de operaciones», por confirmar).
- **Aviso de privacidad y Términos**: en el sitio original ambas páginas estaban vacías; aquí quedan como placeholder.
- **Logos de clientes**: los del sitio original eran de la plantilla (DHL, Yahoo Finance, Dropcam…) y no
  corresponden a clientes reales, así que se omitieron.
- **Analytics**: no se incluyó ningún script de Google Tag Manager. Si se requiere, agrégalo en `app/layout.tsx`.

## Fuentes

- **Outfit** (títulos) y **Montserrat** (texto), ambas vía `next/font/google`.

El sitio original usa *Madani Arabic*, pero el archivo publicado ahí es la versión **DEMO**: sus dígitos son una marca
de agua («PERSONAL USE ONLY / namelatype.com»), visible por ejemplo en «15+ años». Por eso se descartó y se sustituyó
por Outfit, geométrica y de proporciones similares. Si se compra la licencia de Madani, basta con volver a
`next/font/local` en `app/layout.tsx` y apuntar `--font-display` en `app/globals.css`.
