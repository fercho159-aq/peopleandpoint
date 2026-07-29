import type { Metadata } from 'next';

import { PageHero, Section } from '@/components/ui';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Política de privacidad',
    description: `Aviso de privacidad de ${site.name}: cómo tratamos los datos personales que recibimos a través de este sitio.`,
    path: '/privacy-policy',
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Política de privacidad" />
      <Section>
        <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed">
          <p>
            {site.name} es responsable del tratamiento de los datos personales que nos proporcionas a través de este
            sitio. El contenido completo de este aviso está pendiente de publicación.
          </p>
          <p>
            Para solicitar el aviso de privacidad integral, o para ejercer tus derechos de acceso, rectificación,
            cancelación u oposición (ARCO), escríbenos a{' '}
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
