# Orden de corte DNS — peopleandpoint.com

> **EJECUTADO el 2026-08-06.** Los nameservers ya están en Hostinger (`artemis` / `hermes.dns-parking.com`) y la zona quedó verificada contra los NS nuevos: A raíz a Vercel, los 5 MX de Google sin ninguno de Hostinger, SPF y verificación de dominio, y los 3 subdominios en CNAME a Vercel con SSL válido. La delegación en el TLD tiene TTL de 48h, así que hasta entonces parte del tráfico sigue viendo el WordPress viejo en las landings.
>
> Pendiente de la sección 5: **DKIM y DMARC**. Este documento se conserva como registro de lo ejecutado.

Runbook de ejecución. **Todo se hace en Hostinger.** No se toca el cPanel de HostGator en ningún paso.

Complemento de [`dns-migracion-hostinger.md`](./dns-migracion-hostinger.md) — ese tiene el inventario completo de los 94 registros de la zona vieja; este tiene qué cargar y en qué orden.

Estado verificado el **2026-08-06**:

| Elemento | Valor actual | Destino |
|---|---|---|
| Registrador | Hostinger ✅ (ya migrado) | — |
| Nameservers | `ns00012.hostgator.mx` / `ns00013.hostgator.mx` | Hostinger (`ns1/ns2.dns-parking.com`) |
| DNSSEC | **apagado** (sin registro DS) ✅ | igual |
| TTL delegación NS en el TLD | `172800` = **48h** | — |
| `peopleandpoint.com` | A `216.150.1.1` → **Vercel** ✅ | igual |
| `www` | CNAME → raíz → **Vercel** ✅ | CNAME a Vercel |
| `servicios` | A `69.6.201.236` → WordPress viejo | Vercel |
| `reclutamiento` | A `69.6.201.236` → WordPress viejo | Vercel |
| `diagnosticonomina` | A `69.6.201.236` → WordPress viejo | Vercel |
| MX | Google Workspace, TTL `14400` | igual |
| DKIM / DMARC | **no existen** | agregar (Fase 3) |

En Vercel (team `mawsoluciones-projects`) los 4 dominios ya están vinculados a sus proyectos. **Solo falta DNS.**

---

## Qué esperar: split-brain de hasta 48h

La delegación NS en el TLD `.com` tiene TTL de 172800s. Al cambiar nameservers, durante hasta 2 días unos resolvers preguntan a HostGator y otros a Hostinger. Como no se va a tocar la zona vieja, las dos van a diferir. Consecuencias:

| | Zona vieja (HostGator) | Zona nueva (Hostinger) | ¿Problema? |
|---|---|---|---|
| Correo | MX de Google | MX de Google (idénticos) | **No.** Cero riesgo. |
| Raíz + `www` | Vercel | Vercel | **No.** Ya coinciden. |
| 3 subdominios | WordPress viejo | Vercel | **Sí, cosmético.** Parte del tráfico ve el sitio viejo hasta 48h. |

Es el precio de no entrar a cPanel: los 3 subdominios tardan en unificarse. No se cae nada, no se pierde correo — parte de los visitantes ve contenido viejo un rato. Si eso no es aceptable, la única forma de evitarlo es alinear la zona vieja en cPanel antes del corte.

**No cancelar HostGator.** La zona vieja sigue sirviendo tráfico durante esas 48h y es el rollback.

---

## Antes de dar clic

- [ ] Día hábil, por la mañana. Nunca viernes ni de noche — si algo falla necesitas soporte y horas de reacción.
- [ ] Este doc abierto (los valores se cargan a mano, Hostinger no importa zone files).
- [ ] Acceso a Google Admin a la mano para probar correo después.
- [ ] Saber que **no se puede precargar**: Hostinger bloquea la edición de registros mientras el DNS lo administra otro proveedor — es el aviso naranja *"El DNS se administra por otro proveedor"*. Primero cambias NS, luego cargas. Por eso todo tiene que estar listo para copiar antes.

---

## Paso 1 — Cambiar nameservers

Hostinger → `peopleandpoint.com` → **DNS / Nameservers** → **Cambiar nameservers** → *Usar los nameservers de Hostinger*.

Normalmente `ns1.dns-parking.com` / `ns2.dns-parking.com`, pero usa los que muestre el panel.

Pasa de inmediato al Paso 2. Sin pausa para el café.

---

## Paso 2 — Borrar lo que Hostinger metió solo

En cuanto el panel te deje editar **Registros DNS**, lo primero es borrar, no agregar.

**Crítico: el `MX mx1.hostinger.com`** (o similar) que Hostinger crea por defecto. Si queda con prioridad menor que los de Google, tu correo se entrega a un buzón de Hostinger que no existe y **rebota duro** — no se reintenta, se pierde.

Borrar también:
- Cualquier `A @` de parking que apunte a IP de Hostinger.
- Cualquier `CNAME www` a parking.
- TXT de verificación de Hostinger (si lo hay, no estorba, pero limpia).

---

## Paso 3 — Cargar la zona, en este orden

Correo primero. Siempre.

### 3a. MX — Google Workspace

| Nombre | TTL | Prioridad | Destino |
|---|---|---|---|
| `@` | 3600 | 1 | `aspmx.l.google.com` |
| `@` | 3600 | 5 | `alt1.aspmx.l.google.com` |
| `@` | 3600 | 5 | `alt2.aspmx.l.google.com` |
| `@` | 3600 | 10 | `alt3.aspmx.l.google.com` |
| `@` | 3600 | 10 | `alt4.aspmx.l.google.com` |

### 3b. TXT raíz — dos registros SEPARADOS, no concatenar

```
@   TXT   v=spf1 include:_spf.google.com ~all
@   TXT   google-site-verification=uQg66OD13KHr7Kq28QXZqj1K8C_lReojWlLX8j-Peug
```

### 3c. Web

| Nombre | Tipo | Valor | TTL |
|---|---|---|---|
| `@` | A | `216.150.1.1` | 3600 |
| `www` | CNAME | `cname.vercel-dns.com` | 3600 |
| `servicios` | CNAME | `cname.vercel-dns.com` | 3600 |
| `reclutamiento` | CNAME | `cname.vercel-dns.com` | 3600 |
| `diagnosticonomina` | CNAME | `cname.vercel-dns.com` | 3600 |

> El CNAME es mejor que un A fijo: Vercel puede rotar IPs sin que te enteres. Si Hostinger rechaza alguno, usa **A → `216.150.1.1`** como respaldo.

> Los `www.servicios`, `www.reclutamiento` y `www.diagnosticonomina` **no se recrean**. No están dados de alta en Vercel. Si los quieres vivos, primero agrégalos como dominio en cada proyecto de Vercel y luego apúntalos a `cname.vercel-dns.com`.

### 3d. CNAME de acceso a Gmail

Baja prioridad, pueden esperar a mañana sin consecuencias.

| Nombre | TTL | Destino |
|---|---|---|
| `mail` | 3600 | `ghs.google.com` |
| `imap` | 3600 | `imap.googlemail.com` |
| `pop` | 3600 | `pop.googlemail.com` |
| `smtp` | 3600 | `smtp.googlemail.com` |

### 3e. NO recrear nada de esto

Todo lo de cPanel muere con el servidor viejo: `cpanel`, `whm`, `webmail`, `webdisk`, `cpcalendars`, `cpcontacts`, `autoconfig`, `autodiscover`, `ftp`, `localhost`, todos los `SRV` de `_caldav` / `_carddav` / `_autodiscover`, los `TXT path=/`, `_cpanel-dcv-test-record`, `_acme-challenge`, y los `default._domainkey.*` (DKIM de cPanel — inservible para Google Workspace).

Detalle completo en la sección 3 del [inventario](./dns-migracion-hostinger.md).

---

## Paso 4 — Verificar sin esperar propagación

Pregunta directo a los NS nuevos:

```bash
dig @ns1.dns-parking.com peopleandpoint.com MX +short
dig @ns1.dns-parking.com peopleandpoint.com TXT +short
dig @ns1.dns-parking.com peopleandpoint.com A +short
dig @ns1.dns-parking.com www.peopleandpoint.com +short
dig @ns1.dns-parking.com servicios.peopleandpoint.com +short
dig @ns1.dns-parking.com reclutamiento.peopleandpoint.com +short
dig @ns1.dns-parking.com diagnosticonomina.peopleandpoint.com +short
```

Los 5 MX tienen que salir correctos y sin ninguno de Hostinger. **Eso se arregla antes de levantarse de la silla.** Lo demás puede esperar; el correo no.

Vercel emite el SSL solo, 1–5 min después de ver el registro apuntando hacia él.

---

## Paso 5 — Post-migración

### 5.1 Prueba de correo (mismo día)

- Gmail externo → cuenta `@peopleandpoint.com`. Debe llegar.
- `@peopleandpoint.com` → Gmail externo. En el recibido, *Mostrar original* → confirmar `SPF: PASS`.
- Google Admin: confirmar que el dominio sigue verificado.

### 5.2 Vigilar los subdominios durante 48h

Hasta que la delegación termine de propagar, parte del tráfico ve el WordPress viejo. Revisar cada tanto:

```bash
dig +short servicios.peopleandpoint.com
```

Cuando ya no aparezca `69.6.201.236` desde varias redes distintas, la propagación terminó.

### 5.3 DKIM — agregar después, no durante el corte

No existe hoy. Google Admin → Aplicaciones → Google Workspace → Gmail → **Autenticar correo** → generar registro (2048 bits) → pegar en Hostinger → volver a Google → **Iniciar autenticación**.

```
Nombre: google._domainkey
Tipo:   TXT
Valor:  v=DKIM1; k=rsa; p=<clave que genera Google>
```

### 5.4 DMARC — después de que DKIM esté verificado

```
Nombre: _dmarc
Tipo:   TXT
Valor:  v=DMARC1; p=none; rua=mailto:admin@peopleandpoint.com
```

Arrancar en `p=none`. Subir a `quarantine` y luego `reject` tras semanas de monitoreo, no antes.

### 5.5 Cierre

**72h de correo y sitio estables antes de cancelar HostGator.** Mientras tanto no borres nada allá.

---

## Rollback

Volver los NS a `ns00012.hostgator.mx` / `ns00013.hostgator.mx` desde el panel de Hostinger. La zona vieja sigue intacta y funcional (raíz y `www` ya apuntan a Vercel ahí; los subdominios vuelven al WordPress viejo).

**Es lento** — hasta 48h por el TTL de delegación. Sirve para "algo salió muy mal", no para "me equivoqué en un registro". Un registro mal cargado se arregla en Hostinger en segundos; no se revierte con rollback de NS.

---

## Checklist

**Antes**
- [ ] Día hábil, mañana, no viernes
- [ ] Valores de este doc a la mano

**Corte**
- [ ] NS cambiados a Hostinger
- [ ] `MX mx1.hostinger.com` y demás defaults **borrados**
- [ ] 5 MX de Google cargados
- [ ] SPF + `google-site-verification` cargados (2 TXT separados)
- [ ] A raíz `216.150.1.1`
- [ ] CNAME `www`, `servicios`, `reclutamiento`, `diagnosticonomina` → `cname.vercel-dns.com`
- [ ] CNAME de Gmail (`mail`, `imap`, `pop`, `smtp`)
- [ ] `dig @ns1.dns-parking.com` confirma MX correctos, sin MX de Hostinger

**Después**
- [ ] Correo entrante probado
- [ ] Correo saliente probado con SPF PASS
- [ ] Dominio sigue verificado en Google Admin
- [ ] Los 4 sitios responden `server: Vercel` con HTTPS válido
- [ ] Subdominios ya no resuelven a `69.6.201.236` (hasta 48h)
- [ ] DKIM `google._domainkey` generado y activado
- [ ] DMARC agregado
- [ ] 72h estables → recién ahí, cancelar HostGator

---

## Verificación rápida (copiar y pegar)

```bash
for h in peopleandpoint.com www.peopleandpoint.com servicios.peopleandpoint.com \
         reclutamiento.peopleandpoint.com diagnosticonomina.peopleandpoint.com; do
  printf "%-40s %s\n" "$h" "$(dig +short $h | tr '\n' ' ')"
done
dig +short NS peopleandpoint.com
dig +short MX peopleandpoint.com
dig +short TXT peopleandpoint.com
dig +short TXT google._domainkey.peopleandpoint.com
dig +short TXT _dmarc.peopleandpoint.com
```
