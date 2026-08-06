'use client';

import { useState, type FormEvent } from 'react';

import { trackLead } from '@/lib/analytics';
import type { ContactResponse } from '@/lib/contact';
import { services, site } from '@/lib/site';

type Status =
  | { readonly kind: 'idle' }
  | { readonly kind: 'sending' }
  | { readonly kind: 'sent' }
  | { readonly kind: 'error'; readonly message: string };

const fieldClass =
  'w-full rounded-md border border-transparent bg-cream px-4 py-3.5 text-[15px] text-ink-dark outline-none transition placeholder:text-ink/70 focus:border-gold focus:bg-white';

export function ContactForm({ variant = 'card' }: { variant?: 'card' | 'plain' }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: 'sending' });

    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      company: String(data.get('company') ?? ''),
      service: String(data.get('service') ?? ''),
      message: String(data.get('message') ?? ''),
      consent: data.get('consent') === 'on',
      hp: String(data.get('website') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as ContactResponse;

      if (result.ok) {
        form.reset();
        trackLead('Formulario de contacto');
        setStatus({ kind: 'sent' });
      } else {
        setStatus({ kind: 'error', message: result.message });
      }
    } catch {
      setStatus({
        kind: 'error',
        message: `No pudimos enviar tu mensaje. Escríbenos a ${site.email}.`,
      });
    }
  }

  const wrapperClass =
    variant === 'card' ? 'rounded-xl bg-white p-8 shadow-float md:p-10' : 'rounded-xl bg-cream p-8 md:p-10';

  return (
    <div className={wrapperClass}>
      <p className="eyebrow">Asesoría personalizada</p>
      <h2 className="mt-3 text-3xl">
        ¡Contáctanos Ahora<span className="text-gold">!</span>
      </h2>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Trampa para bots: fuera de pantalla y fuera del orden de tabulación. Nadie la ve, los bots la llenan. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">No llenar este campo</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="sr-only" htmlFor="name">
            Nombre
          </label>
          <input id="name" name="name" className={fieldClass} placeholder="Nombre" required autoComplete="name" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="sr-only" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={fieldClass}
              placeholder="Correo electrónico"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={fieldClass}
              placeholder="Teléfono"
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className="sr-only" htmlFor="company">
            Empresa
          </label>
          <input id="company" name="company" className={fieldClass} placeholder="Empresa" autoComplete="organization" />
        </div>

        <div>
          <label className="sr-only" htmlFor="service">
            Servicio de interés
          </label>
          <select id="service" name="service" className={fieldClass} defaultValue="">
            <option value="">Servicio de interés</option>
            {services.map((service) => (
              <option key={service.slug} value={service.navLabel}>
                {service.navLabel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="sr-only" htmlFor="message">
            Mensaje
          </label>
          <textarea id="message" name="message" rows={4} className={fieldClass} placeholder="Cuéntanos tu reto" />
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#d99937]" />
          <span>
            Estoy de acuerdo con la{' '}
            <a href="/privacy-policy" className="text-gold underline">
              política de privacidad
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={status.kind === 'sending'}
          className="w-full rounded bg-gold px-8 py-4 text-[15px] font-bold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.kind === 'sending' ? 'Enviando…' : 'Obtén asesoría'}
        </button>

        <p aria-live="polite" className="min-h-6 text-sm">
          {status.kind === 'sent' ? (
            <span className="text-navy">¡Gracias! Te contactaremos muy pronto.</span>
          ) : null}
          {status.kind === 'error' ? <span className="text-[#c0392b]">{status.message}</span> : null}
        </p>
      </form>
    </div>
  );
}
