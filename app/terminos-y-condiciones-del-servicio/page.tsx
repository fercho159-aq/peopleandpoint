import type { Metadata } from 'next';

import { PageHero, Section } from '@/components/ui';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Términos y Condiciones del servicio',
    description: `Términos y condiciones que rigen el uso de este sitio y la contratación de los servicios de ${site.name}.`,
    path: '/terminos-y-condiciones-del-servicio',
  }),
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Términos y Condiciones" />
      <Section>
        <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed">
          <p>
            El uso de este sitio y la contratación de los servicios de {site.name} se rigen por los términos y
            condiciones vigentes. El contenido completo de este apartado está pendiente de publicación.
          </p>
          <p>
            Para solicitar una copia de los términos aplicables a tu contrato, escríbenos a{' '}
            <a href={`mailto:${site.email}`} className="text-gold hover:underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
