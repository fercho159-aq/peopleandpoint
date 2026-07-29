import type { Metadata } from 'next';
import Link from 'next/link';

import { Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section className="pt-48">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 text-4xl">No encontramos esta página</h1>
        <p className="mt-6 text-[17px] leading-relaxed">
          Es posible que el enlace haya cambiado o que la página ya no exista.
        </p>
        <Link
          href="/"
          className="mt-9 inline-block rounded bg-gold px-9 py-4 text-[15px] font-bold text-white transition hover:bg-gold-dark"
        >
          Volver al inicio
        </Link>
      </div>
    </Section>
  );
}
