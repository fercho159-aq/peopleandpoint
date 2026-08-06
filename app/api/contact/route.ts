import { NextResponse } from 'next/server';

import { parseContactPayload, readHoneypot, type ContactPayload, type ContactResponse } from '@/lib/contact';
import { site } from '@/lib/site';

export const runtime = 'nodejs';

const MAILER_URL = process.env.MAILER_URL ?? 'https://envios.mawsoluciones.com';

/**
 * Entrega el lead al relay en el VPS, que lo guarda en Postgres antes de
 * enviarlo por SMTP. Si el correo falla ahí, el relay reintenta solo: para
 * nosotros basta con que lo haya aceptado.
 */
async function sendWithMailer(payload: ContactPayload, honeypot: string, apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${MAILER_URL}/v1/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ ...payload, hp: honeypot }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return false;
    const result = (await res.json()) as { ok?: boolean };
    return result.ok === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: 'invalid', message: 'No pudimos leer los datos del formulario.' },
      { status: 400 },
    );
  }

  const payload = parseContactPayload(body);
  if (payload === null) {
    return NextResponse.json(
      { ok: false, reason: 'invalid', message: 'Revisa los campos obligatorios y acepta el aviso de privacidad.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILER_API_KEY;
  if (apiKey === undefined || apiKey === '') {
    return NextResponse.json(
      {
        ok: false,
        reason: 'not_configured',
        message: `El envío por correo aún no está configurado. Escríbenos a ${site.email}.`,
      },
      { status: 503 },
    );
  }

  const sent = await sendWithMailer(payload, readHoneypot(body), apiKey);
  if (!sent) {
    return NextResponse.json(
      { ok: false, reason: 'send_failed', message: `No pudimos enviar tu mensaje. Escríbenos a ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
