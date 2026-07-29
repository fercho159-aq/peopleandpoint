import { services } from '@/lib/site';

export type ContactPayload = {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly company: string;
  readonly service: string;
  readonly message: string;
  readonly consent: boolean;
};

export type ContactResponse =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: 'invalid' | 'not_configured' | 'send_failed'; readonly message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Parses and validates an unknown request body into a ContactPayload. */
export function parseContactPayload(input: unknown): ContactPayload | null {
  if (typeof input !== 'object' || input === null) return null;
  const raw = input as Record<string, unknown>;

  const name = asString(raw.name);
  const email = asString(raw.email);
  const phone = asString(raw.phone);
  const company = asString(raw.company);
  const service = asString(raw.service);
  const message = asString(raw.message);
  const consent = raw.consent === true;

  if (name.length < 2 || name.length > 120) return null;
  if (!EMAIL_RE.test(email) || email.length > 160) return null;
  if (phone.length > 40) return null;
  if (company.length > 160) return null;
  if (message.length > 4000) return null;
  if (!consent) return null;
  if (service !== '' && !services.some((item) => item.navLabel === service)) return null;

  return { name, email, phone, company, service, message, consent };
}
