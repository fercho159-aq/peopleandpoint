# maw-mailer — relay de formularios

Servicio propio que recibe los leads de los 4 sitios y los envía por el SMTP de Hostinger. Sustituye a Resend, que nunca quedó configurado (`RESEND_API_KEY` no existía en Vercel y los formularios respondían `503` en producción).

**Endpoint público:** `https://envios.mawsoluciones.com`
**Código:** `/opt/maw-mailer` en el VPS `maw-vps` (`31.220.109.7`)

---

## Por qué existe

Un POST directo a un proveedor de correo pierde el lead si el envío falla. Aquí el lead se **guarda en Postgres antes** de intentar el SMTP. Si Hostinger rechaza o está caído, la solicitud queda en cola y un worker la reintenta con backoff exponencial (1, 2, 4, 8… minutos, hasta 6 intentos). Para el sitio eso ya es éxito: el lead está capturado.

## Flujo

```
Formulario (Next.js)
  → POST /api/contact            (valida, mismo contrato de respuesta que antes)
  → POST envios.mawsoluciones.com/v1/send   con X-Api-Key
  → INSERT en Postgres (status 'pending')
  → SMTP smtp.hostinger.com:465  desde sistema@mawsoluciones.com
  → status 'sent' + message_id
```

El correo llega con `Reply-To` del lead, así que **responder contesta directo al prospecto**, no a `sistema@`.

El asunto y la etiqueta de origen (`[Servicios]`, `[Reclutamiento]`…) los pone el relay a partir de `keys.json`, no el sitio.

## Stack

| | |
|---|---|
| Runtime | Node 20, ESM, Express + nodemailer + pg |
| Proceso | pm2 `maw-mailer`, fork, puerto interno `127.0.0.1:3050` |
| Proxy | nginx `/etc/nginx/sites-available/envios` + cert Let's Encrypt (autorrenovable) |
| Base | Postgres `maw_mailer`, tabla `submissions` |

## API

Todos los endpoints bajo `/v1`.

### `POST /v1/send`

Header `X-Api-Key` obligatorio (una key por sitio). Cuerpo:

```json
{
  "name": "...", "email": "...", "phone": "...", "company": "...",
  "service": "...", "message": "...",
  "answers": [{ "label": "Pregunta", "value": "Respuesta" }],
  "consent": true
}
```

Respuestas: `200 {ok:true, delivered:true}` enviado · `200 {ok:true, queued:true}` guardado, reintentando · `400` inválido · `401` key mala · `429` rate limit.

### `GET /v1/health`

Sin auth. `{ok:true, db:"up"}`.

### `GET /v1/submissions?site=&status=&limit=` · `GET /v1/stats`

Header `X-Admin-Key`. Historial y conteos.

## Protecciones

- **Rate limit** por API key: 20/min, 200/hora.
- **Honeypot**: si el cuerpo trae `hp` o `website` con contenido, se guarda como `spam` y **se responde `200`** para no darle señal al bot. Los formularios aún no mandan el campo — falta agregarlo al HTML para que sirva.
- Validación de longitudes y formato, espejo de la del sitio.
- El servicio escucha solo en `127.0.0.1`; el único acceso es vía nginx.

## Configuración en el VPS

Dos archivos `root:root 600`, fuera de git:

- `/opt/maw-mailer/.env` — `DATABASE_URL`, credenciales SMTP, `ADMIN_KEY`, `DEFAULT_TO`
- `/opt/maw-mailer/keys.json` — mapa `apiKey → {site, label, to, active}`

`keys.json` se **relee en cada request**: revocar o rotar una key no necesita reinicio. Poner `"active": false` la desactiva al instante.

## Variables en Vercel (los 4 proyectos)

```
MAILER_URL       https://envios.mawsoluciones.com
MAILER_API_KEY   <key propia de cada sitio>
```

Cargadas en Production y Preview. Cada sitio tiene su propia key para poder revocar una sin tumbar las demás.

## Operación

```bash
ssh maw-vps
pm2 logs maw-mailer --lines 50
pm2 restart maw-mailer

# historial
sudo -u postgres psql -d maw_mailer -c \
  "SELECT id, site, status, attempts, name, email, created_at FROM submissions ORDER BY id DESC LIMIT 20;"

# lo que quedó atorado
sudo -u postgres psql -d maw_mailer -c \
  "SELECT id, site, attempts, last_error FROM submissions WHERE status IN ('pending','failed');"
```

`status` posibles: `pending` (en cola), `sent`, `failed` (agotó los 6 intentos), `spam`.

## Pendientes

- [ ] **DKIM para `mawsoluciones.com`** — hoy no existe. SPF ✅ y DMARC `p=none`, así que entrega, pero sin DKIM la reputación es peor y sube el riesgo de spam. Se genera en el panel de correo de Hostinger y el TXT va en la zona DNS (también Hostinger).
- [ ] **Rotar la contraseña de `sistema@mawsoluciones.com`** — se compartió en texto plano durante el montaje. Al rotarla, actualizar `SMTP_PASS` en `/opt/maw-mailer/.env` y `pm2 restart maw-mailer`.
- [ ] **Campo honeypot en los formularios** — el relay ya lo soporta, falta el input oculto en el HTML de los 4 sitios.
- [ ] **Postgres del VPS escucha en `0.0.0.0:5432`** — expuesto a internet. Ajeno a este servicio, pero conviene cerrarlo a `127.0.0.1`.
