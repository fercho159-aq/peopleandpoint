import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';
import { JsonLdScript } from '@/components/json-ld';
import { PageHero, Section } from '@/components/ui';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { offices, site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Contacto: agenda una asesoría en nómina y capital humano',
  description:
    'Cuéntanos tus desafíos de nómina, contabilidad, seguridad social o capacitación. Oficinas en Ciudad de México, Guadalajara y Monterrey. Escríbenos a contacto@peopleandpoint.com.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Contacto', path: '/contact' },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Contacto"
        title="Conectemos con propósito"
        intro="Cada conversación es una oportunidad para construir algo valioso. En People &amp; Point estamos listos para escucharte, comprender tus desafíos y acompañarte en el desarrollo del talento que impulsa tu organización."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Hablemos sobre tus desafíos</p>
            <h2 className="mt-4 text-3xl md:text-[42px]">Conectemos para crear un cambio real</h2>
            <p className="mt-6 text-[17px] leading-relaxed">
              Completa el formulario o escríbenos directamente: juntos podemos dar el siguiente paso hacia un equipo más
              fuerte y un futuro más humano. Queremos conocer tu historia y ayudarte a impulsarla.
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.18em] text-navy">Correo</dt>
                <dd className="mt-1">
                  <a href={`mailto:${site.email}`} className="text-[17px] text-gold hover:underline">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.18em] text-navy">Teléfono</dt>
                <dd className="mt-1">
                  <a href={`tel:${site.phoneHref}`} className="text-[17px] text-gold hover:underline">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.18em] text-navy">Oficinas</dt>
                <dd className="mt-3 space-y-4 text-[15px] leading-relaxed">
                  {offices.map((office) => (
                    <p key={office.city}>
                      <span className="block font-semibold text-navy">{office.city}</span>
                      {office.address}
                    </p>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm variant="plain" />
        </div>
      </Section>
    </>
  );
}
