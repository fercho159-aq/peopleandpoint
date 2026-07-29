import { NextResponse } from 'next/server';

import { parseContactPayload, type ContactPayload, type ContactResponse } from '@/lib/contact';
import { site } from '@/lib/site';

export const runtime = 'nodejs';

function renderEmail(payload: ContactPayload): string {
  const rows: ReadonlyArray<readonly [string, string]> = [
    ['Nombre', payload.name],
    ['Email', payload.email],
    ['Teléfono', payload.phone || '—'],
    ['Empresa', payload.company || '—'],
    ['Servicio', payload.service || '—'],
    ['Mensaje', payload.message || '—'],
  ];
  return rows.map(([label, value]) => `${label}: ${value}`).join('\n');
}

async function sendWithResend(payload: ContactPayload, apiKey: string): Promise<boolean> {
  const to = process.env.CONTACT_TO ?? site.email;
  const from = process.env.CONTACT_FROM ?? 'People and Point <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `Nueva solicitud de asesoría — ${payload.name}`,
      text: renderEmail(payload),
    }),
  });

  return res.ok;
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

  const apiKey = process.env.RESEND_API_KEY;
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

  const sent = await sendWithResend(payload, apiKey);
  if (!sent) {
    return NextResponse.json(
      { ok: false, reason: 'send_failed', message: `No pudimos enviar tu mensaje. Escríbenos a ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
