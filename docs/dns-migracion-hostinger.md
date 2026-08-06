# DNS peopleandpoint.com — migración HostGator → Hostinger

Fuente: cPanel Zone Editor de HostGator (94 registros), exportado 2026-07-31.
IP servidor viejo: `69.6.201.236` · Servidor cPanel: `sh00012.hostgator.mx`
Correo: **Google Workspace** (no tocar, solo replicar registros).

> **Este doc es el inventario.** Para ejecutar, usa [`dns-orden-de-corte.md`](./dns-orden-de-corte.md) — tiene el orden por fases y el estado verificado al 2026-08-06 (raíz y `www` ya en Vercel; faltan los 3 subdominios y el cambio de nameservers).

---

## 1. Registros a RECREAR en Hostinger (críticos)

### MX — correo Google Workspace

| Nombre | TTL | Prioridad | Destino |
|---|---|---|---|
| `@` | 3600 | 1 | `aspmx.l.google.com` |
| `@` | 3600 | 5 | `alt1.aspmx.l.google.com` |
| `@` | 3600 | 5 | `alt2.aspmx.l.google.com` |
| `@` | 3600 | 10 | `alt3.aspmx.l.google.com` |
| `@` | 3600 | 10 | `alt4.aspmx.l.google.com` |

### TXT raíz

SPF:
```
v=spf1 include:_spf.google.com ~all
```

Verificación de Google Workspace:
```
google-site-verification=uQg66OD13KHr7Kq28QXZqj1K8C_lReojWlLX8j-Peug
```

> Son **dos registros TXT separados** en `@`. No concatenar.

### CNAME de acceso a Gmail

| Nombre | TTL | Destino |
|---|---|---|
| `mail` | 3600 | `ghs.google.com` |
| `imap` | 3600 | `imap.googlemail.com` |
| `pop` | 3600 | `pop.googlemail.com` |
| `smtp` | 3600 | `smtp.googlemail.com` |

### Web (definir destino antes de cortar)

| Nombre | Tipo | Valor actual |
|---|---|---|
| `@` | A | `69.6.201.236` |
| `www` | CNAME | `peopleandpoint.com` |
| `servicios` | A | `69.6.201.236` |
| `www.servicios` | A | `69.6.201.236` |
| `reclutamiento` | A | `69.6.201.236` |
| `www.reclutamiento` | A | `69.6.201.236` |
| `diagnosticonomina` | A | `69.6.201.236` |
| `www.diagnosticonomina` | A | `69.6.201.236` |

Decidir: ¿IP de Hostinger, o CNAME a Vercel/Netlify si el sitio Next.js se despliega ahí?

> **Las 3 landings ya están desplegadas en Vercel** (team `mawsoluciones-projects`), cada una como proyecto independiente con su dominio ya vinculado:
>
> | Subdominio | Proyecto Vercel | URL temporal |
> |---|---|---|
> | `servicios.peopleandpoint.com` | `peopleandpoint-servicios` | `peopleandpoint-servicios-xi.vercel.app` |
> | `reclutamiento.peopleandpoint.com` | `peopleandpoint-reclutamiento` | `peopleandpoint-reclutamiento-khaki.vercel.app` |
> | `diagnosticonomina.peopleandpoint.com` | `peopleandpoint-diagnostico` | `peopleandpoint-diagnostico-phi.vercel.app` |
>
> **Corte de DNS pendiente.** Los 3 subdominios siguen sirviendo el WordPress de HostGator. Se resuelven al cargar la zona nueva en Hostinger:
>
> ```
> servicios          CNAME   cname.vercel-dns.com     (hoy: A 69.6.201.236)
> reclutamiento      CNAME   cname.vercel-dns.com     (hoy: A 69.6.201.236)
> diagnosticonomina  CNAME   cname.vercel-dns.com     (hoy: A 69.6.201.236)
> ```
>
> Los `www.servicios`, `www.reclutamiento` y `www.diagnosticonomina` no se recrean (o agrégalos como dominios adicionales en cada proyecto de Vercel si los quieres conservar). Vercel emite el certificado SSL solo, en cuanto detecta el registro apuntando hacia él.

---

## 2. FALTANTES — agregar en Hostinger

### DKIM de Google (NO existe en la zona actual)

No hay `google._domainkey.peopleandpoint.com`. Los `default._domainkey.*` que aparecen son DKIM de cPanel, **no sirven** para Google Workspace.

Obtenerlo en: Admin Google Workspace → Aplicaciones → Google Workspace → Gmail → **Autenticar correo** → Generar registro nuevo (2048 bits) → copiar el TXT a Hostinger → volver a Google → **Iniciar autenticación**.

```
Nombre: google._domainkey
Tipo:   TXT
Valor:  v=DKIM1; k=rsa; p=<clave que genera Google>
```

### DMARC (NO existe)

Agregar **después** de que DKIM esté verificado:
```
Nombre: _dmarc
Tipo:   TXT
Valor:  v=DMARC1; p=none; rua=mailto:admin@peopleandpoint.com
```
Empezar en `p=none`, subir a `quarantine` y luego `reject` tras semanas de monitoreo.

---

## 3. Registros a DESCARTAR (atados a HostGator/cPanel)

No copiar ninguno de estos — mueren con el servidor viejo:

- **A → `69.6.201.236`**: `cpanel`, `whm`, `webmail`, `webdisk`, `cpcalendars`, `cpcontacts`, `autoconfig`, `autodiscover` (en raíz y en los 3 subdominios)
- **A** `localhost` → `127.0.0.1`
- **CNAME** `ftp` → `peopleandpoint.com`
- **SRV** `_caldav._tcp` / `_caldavs._tcp` / `_carddav._tcp` / `_carddavs._tcp` → `sh00012.hostgator.mx` (puertos 2079/2080) — raíz y 3 subdominios
- **SRV** `_autodiscover._tcp` → `cpanelemaildiscovery.cpanel.net` (puerto 443) — raíz y 3 subdominios
- **TXT** `path=/` asociados a los SRV anteriores
- **TXT** `_cpanel-dcv-test-record` (validación SSL de cPanel)
- **TXT** `_acme-challenge` (challenge Let's Encrypt viejo, ya consumido)
- **TXT** `default._domainkey.servicios` / `.reclutamiento` / `.diagnosticonomina` (DKIM cPanel — solo servían si el correo saliera del servidor cPanel, y no es el caso)

---

## 4. Plan de migración

> **Movido.** El plan de ejecución vive ahora en [`dns-orden-de-corte.md`](./dns-orden-de-corte.md), con estado verificado al 2026-08-06 y **todo el trabajo dentro de Hostinger** (el cPanel de HostGator ya no se toca).
>
> Resumen: registrador ya migrado ✅ · DNSSEC apagado ✅ · raíz y `www` ya en Vercel ✅ · falta cambiar NS y cargar la zona en Hostinger. La delegación NS tiene TTL de 48h, así que los 3 subdominios sirven el WordPress viejo a parte del tráfico durante ese lapso. El correo no se interrumpe: los MX viejos y nuevos son idénticos.
>
> **No cancelar HostGator** hasta 72h de correo y sitio estables — la zona vieja sigue atendiendo tráfico mientras propaga y es el rollback.

---

## 5. Zona completa original (respaldo)

<details>
<summary>94 registros — HostGator cPanel, 2026-07-31</summary>

```dns
; ---------- RAÍZ ----------
peopleandpoint.com.                          3600   IN  A      69.6.201.236
localhost.peopleandpoint.com.                3600   IN  A      127.0.0.1
www.peopleandpoint.com.                      3600   IN  CNAME  peopleandpoint.com
ftp.peopleandpoint.com.                      3600   IN  CNAME  peopleandpoint.com
cpanel.peopleandpoint.com.                   3600   IN  A      69.6.201.236
webdisk.peopleandpoint.com.                  3600   IN  A      69.6.201.236
cpcalendars.peopleandpoint.com.              3600   IN  A      69.6.201.236
autoconfig.peopleandpoint.com.               3600   IN  A      69.6.201.236
whm.peopleandpoint.com.                      3600   IN  A      69.6.201.236
autodiscover.peopleandpoint.com.             3600   IN  A      69.6.201.236
webmail.peopleandpoint.com.                  3600   IN  A      69.6.201.236
cpcontacts.peopleandpoint.com.               3600   IN  A      69.6.201.236

_caldavs._tcp.peopleandpoint.com.            3600   IN  SRV    0 0 2080 sh00012.hostgator.mx
_caldavs._tcp.peopleandpoint.com.            3600   IN  TXT    "path=/"
_carddav._tcp.peopleandpoint.com.            3600   IN  SRV    0 0 2079 sh00012.hostgator.mx
_carddav._tcp.peopleandpoint.com.            3600   IN  TXT    "path=/"
_carddavs._tcp.peopleandpoint.com.           3600   IN  SRV    0 0 2080 sh00012.hostgator.mx
_carddavs._tcp.peopleandpoint.com.           3600   IN  TXT    "path=/"
_caldav._tcp.peopleandpoint.com.             3600   IN  SRV    0 0 2079 sh00012.hostgator.mx
_caldav._tcp.peopleandpoint.com.             3600   IN  TXT    "path=/"
_autodiscover._tcp.peopleandpoint.com.       3600   IN  SRV    0 0 443 cpanelemaildiscovery.cpanel.net

_cpanel-dcv-test-record.peopleandpoint.com.  3600   IN  TXT    "_cpanel-dcv-test-record=uiun0WRMyhpjNig0ri42n3XLSvJogSmUpMyxoEbnx6BrxciaXpIZE0y3NU5oH0Fw"
_acme-challenge.peopleandpoint.com.          3600   IN  TXT    "o86kTxgqmg-T1EpjCjZ5S4RRoNR1HO1uWL82Y6y04Mk"

; ---------- CORREO GOOGLE WORKSPACE ----------
peopleandpoint.com.                         14400   IN  MX     1  aspmx.l.google.com
peopleandpoint.com.                         14400   IN  MX     5  alt1.aspmx.l.google.com
peopleandpoint.com.                         14400   IN  MX     5  alt2.aspmx.l.google.com
peopleandpoint.com.                         14400   IN  MX     10 alt3.aspmx.l.google.com
peopleandpoint.com.                         14400   IN  MX     10 alt4.aspmx.l.google.com
peopleandpoint.com.                          3600   IN  TXT    "v=spf1 include:_spf.google.com ~all"
peopleandpoint.com.                         14400   IN  TXT    "google-site-verification=uQg66OD13KHr7Kq28QXZqj1K8C_lReojWlLX8j-Peug"
mail.peopleandpoint.com.                    14400   IN  CNAME  ghs.google.com
imap.peopleandpoint.com.                    14400   IN  CNAME  imap.googlemail.com
pop.peopleandpoint.com.                     14400   IN  CNAME  pop.googlemail.com
smtp.peopleandpoint.com.                    14400   IN  CNAME  smtp.googlemail.com

; ---------- SUBDOMINIO: servicios ----------
servicios.peopleandpoint.com.                3600   IN  A      69.6.201.236
www.servicios.peopleandpoint.com.            3600   IN  A      69.6.201.236
webmail.servicios.peopleandpoint.com.        3600   IN  A      69.6.201.236
cpcontacts.servicios.peopleandpoint.com.     3600   IN  A      69.6.201.236
cpcalendars.servicios.peopleandpoint.com.    3600   IN  A      69.6.201.236
autoconfig.servicios.peopleandpoint.com.     3600   IN  A      69.6.201.236
autodiscover.servicios.peopleandpoint.com.   3600   IN  A      69.6.201.236
whm.servicios.peopleandpoint.com.            3600   IN  A      69.6.201.236
cpanel.servicios.peopleandpoint.com.         3600   IN  A      69.6.201.236
webdisk.servicios.peopleandpoint.com.        3600   IN  A      69.6.201.236
_carddav._tcp.servicios.peopleandpoint.com.  3600   IN  SRV    0 0 2079 sh00012.hostgator.mx
_carddav._tcp.servicios.peopleandpoint.com.  3600   IN  TXT    "path=/"
_caldav._tcp.servicios.peopleandpoint.com.   3600   IN  SRV    0 0 2079 sh00012.hostgator.mx
_caldav._tcp.servicios.peopleandpoint.com.   3600   IN  TXT    "path=/"
_caldavs._tcp.servicios.peopleandpoint.com.  3600   IN  SRV    0 0 2080 sh00012.hostgator.mx
_caldavs._tcp.servicios.peopleandpoint.com.  3600   IN  TXT    "path=/"
_carddavs._tcp.servicios.peopleandpoint.com. 3600   IN  SRV    0 0 2080 sh00012.hostgator.mx
_carddavs._tcp.servicios.peopleandpoint.com. 3600   IN  TXT    "path=/"
_autodiscover._tcp.servicios.peopleandpoint.com. 3600 IN SRV   0 0 443 cpanelemaildiscovery.cpanel.net
default._domainkey.servicios.peopleandpoint.com. 3600 IN TXT   "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyMzersIx38Wrqaas4lOQ0ddTeFbiW0DpyafQ0vtOLw6MC+fh9zfLJ5MsHDfX4DM5PXwpxliVF9wrZ/K2GuCttJLjjdpNLuab5OtVm+k2ja3lStRwZGcG9V3dxAATWWapCFST+tTUec2BdjkNdnCwYfdbf9qsCSD8p01pmajztnYNQ5ra8w9nYEyFr5EQ6R2cd36ueczZS4iTmhM1u0p7brMNW4z1aJ30rq/JzXriJq5wgDTOPw5umiRLa4/Uw4aN6s895Ga5ISl3BuQrFonuUkY0Tv/6R45afvV3hQB2eviPmaeCJt9RsSzZ2u11vg55OhYRkzqZlJlOZbvEbcpJwwIDAQAB;"

; ---------- SUBDOMINIO: reclutamiento ----------
reclutamiento.peopleandpoint.com.                3600 IN A     69.6.201.236
www.reclutamiento.peopleandpoint.com.            3600 IN A     69.6.201.236
webmail.reclutamiento.peopleandpoint.com.        3600 IN A     69.6.201.236
autoconfig.reclutamiento.peopleandpoint.com.     3600 IN A     69.6.201.236
webdisk.reclutamiento.peopleandpoint.com.        3600 IN A     69.6.201.236
cpcalendars.reclutamiento.peopleandpoint.com.    3600 IN A     69.6.201.236
autodiscover.reclutamiento.peopleandpoint.com.   3600 IN A     69.6.201.236
cpcontacts.reclutamiento.peopleandpoint.com.     3600 IN A     69.6.201.236
cpanel.reclutamiento.peopleandpoint.com.         3600 IN A     69.6.201.236
whm.reclutamiento.peopleandpoint.com.            3600 IN A     69.6.201.236
_carddavs._tcp.reclutamiento.peopleandpoint.com. 3600 IN SRV   0 0 2080 sh00012.hostgator.mx
_carddavs._tcp.reclutamiento.peopleandpoint.com. 3600 IN TXT   "path=/"
_caldavs._tcp.reclutamiento.peopleandpoint.com.  3600 IN SRV   0 0 2080 sh00012.hostgator.mx
_caldavs._tcp.reclutamiento.peopleandpoint.com.  3600 IN TXT   "path=/"
_carddav._tcp.reclutamiento.peopleandpoint.com.  3600 IN SRV   0 0 2079 sh00012.hostgator.mx
_carddav._tcp.reclutamiento.peopleandpoint.com.  3600 IN TXT   "path=/"
_caldav._tcp.reclutamiento.peopleandpoint.com.   3600 IN SRV   0 0 2079 sh00012.hostgator.mx
_caldav._tcp.reclutamiento.peopleandpoint.com.   3600 IN TXT   "path=/"
_autodiscover._tcp.reclutamiento.peopleandpoint.com. 3600 IN SRV 0 0 443 cpanelemaildiscovery.cpanel.net
default._domainkey.reclutamiento.peopleandpoint.com. 3600 IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuAqWWRYiKFV3XUw8BFPsvhE8MUDTOFqD3DXkBXYwDQPkuOxaMIBimWNiEaS99MCNXmVoWfFhgz0EUPD+u8tvShS5cObRucS3RMKwL0cDjp3vgbZaRcNPRqo4Vglkib4oNZ0GcEmW2d9b66nJODnY3nwi686Pjr7+Xiaj5l3IEFnZtS2sGqYt2BzjM3614pyujfpckXT2CqlClpLW99ZPP+act8RJQQJ3AtG9z/deof/ZpdVXA9wleQPAztDTyci8HTwXH4IV/vfbVwbh2sJfnAWdENvGgCms+UR+kEc8CdiHW4MimQYZZSDfkd9mpibQZBJOvQXTZlOogceIVQj5jQIDAQAB;"

; ---------- SUBDOMINIO: diagnosticonomina ----------
diagnosticonomina.peopleandpoint.com.                3600 IN A   69.6.201.236
www.diagnosticonomina.peopleandpoint.com.            3600 IN A   69.6.201.236
cpcalendars.diagnosticonomina.peopleandpoint.com.    3600 IN A   69.6.201.236
webdisk.diagnosticonomina.peopleandpoint.com.        3600 IN A   69.6.201.236
autodiscover.diagnosticonomina.peopleandpoint.com.   3600 IN A   69.6.201.236
cpcontacts.diagnosticonomina.peopleandpoint.com.     3600 IN A   69.6.201.236
webmail.diagnosticonomina.peopleandpoint.com.        3600 IN A   69.6.201.236
cpanel.diagnosticonomina.peopleandpoint.com.         3600 IN A   69.6.201.236
autoconfig.diagnosticonomina.peopleandpoint.com.     3600 IN A   69.6.201.236
whm.diagnosticonomina.peopleandpoint.com.            3600 IN A   69.6.201.236
_caldavs._tcp.diagnosticonomina.peopleandpoint.com.  3600 IN SRV 0 0 2080 sh00012.hostgator.mx
_caldavs._tcp.diagnosticonomina.peopleandpoint.com.  3600 IN TXT "path=/"
_carddav._tcp.diagnosticonomina.peopleandpoint.com.  3600 IN SRV 0 0 2079 sh00012.hostgator.mx
_carddav._tcp.diagnosticonomina.peopleandpoint.com.  3600 IN TXT "path=/"
_carddavs._tcp.diagnosticonomina.peopleandpoint.com. 3600 IN SRV 0 0 2080 sh00012.hostgator.mx
_carddavs._tcp.diagnosticonomina.peopleandpoint.com. 3600 IN TXT "path=/"
_caldav._tcp.diagnosticonomina.peopleandpoint.com.   3600 IN SRV 0 0 2079 sh00012.hostgator.mx
_caldav._tcp.diagnosticonomina.peopleandpoint.com.   3600 IN TXT "path=/"
_autodiscover._tcp.diagnosticonomina.peopleandpoint.com. 3600 IN SRV 0 0 443 cpanelemaildiscovery.cpanel.net
default._domainkey.diagnosticonomina.peopleandpoint.com. 3600 IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqrc14KFLOCBmaYI1GX9Wn2ATZarMLLw/jYjxYIbjJLcxlZpMEAMIUUS+2aMZEDceb2y6RyzpsiiDYdgmm65usm55IH+J96RYy8bgWaWXHAc3IGFfqA5pyV3dJEqIQ93jr6TataOf38VDfOniPEWXlkNq7NLAsBZTJpakdkViUVK2OKWxdYYjAiMY3TXmqsKIyfl2JzaA0blrLdq7LVBKJ1d0Wqv5g+l2ippR3pnKLejYy5Mbv8mB7DrXK35xjD+M+6rZqTgyTQEJHdt86eohtSZb6yjcJz4D+tm1l0Mm0izA0y1EMXC+pm6ozX1YhCABMAPM3FdSLGvm6zWMcboyYQIDAQAB;"
```

</details>

---

## 6. Checklist de verificación post-migración

```bash
dig peopleandpoint.com MX +short
dig peopleandpoint.com TXT +short          # SPF + google-site-verification
dig google._domainkey.peopleandpoint.com TXT +short
dig _dmarc.peopleandpoint.com TXT +short
dig peopleandpoint.com NS +short
dig www.peopleandpoint.com +short
dig servicios.peopleandpoint.com +short
dig reclutamiento.peopleandpoint.com +short
dig diagnosticonomina.peopleandpoint.com +short
```

- [ ] TTL bajado a 300 y esperadas 4h
- [ ] Zona creada en Hostinger antes de cambiar NS
- [ ] MX verificados contra NS de Hostinger
- [ ] DKIM `google._domainkey` generado y activado en Google Admin
- [ ] DMARC agregado
- [ ] Nameservers cambiados en registrador
- [ ] Correo entrante y saliente probado (enviar/recibir a Gmail externo)
- [ ] Sitio + 3 subdominios resolviendo con SSL válido
- [ ] 72h estables antes de cancelar HostGator
```
