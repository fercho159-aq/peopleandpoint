import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContactForm } from '@/components/contact-form';
import { JsonLdScript } from '@/components/json-ld';
import { PageHero, Section } from '@/components/ui';
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from '@/lib/seo';
import { findService, services } from '@/lib/site';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return services.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (service === undefined) return {};
  return buildMetadata({
    title: `${service.title} para empresas en México`,
    description: service.summary.length > 158 ? `${service.summary.slice(0, 155)}…` : service.summary,
    path: `/${service.slug}`,
    image: service.image,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = findService(slug);
  if (service === undefined) notFound();

  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLdScript
        data={[
          serviceJsonLd(service),
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Servicios', path: '/#servicios' },
            { name: service.title, path: `/${service.slug}` },
          ]),
        ]}
      />
      <PageHero eyebrow="Nuestros servicios" title={service.title} intro={service.summary} image={service.image} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="eyebrow">El servicio</p>
            <p className="mt-6 text-[17px] leading-relaxed">{service.body}</p>

            <div className="mt-10 rounded-xl border-l-4 border-gold bg-cream p-8">
              <p className="eyebrow">Diferenciador</p>
              <p className="mt-4 text-[17px] leading-relaxed text-navy">{service.differentiator}</p>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-card">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-cream">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl md:text-[42px]">Hablemos de tu operación</h2>
            <p className="mt-6 text-[17px] leading-relaxed">
              Cuéntanos cómo trabaja tu empresa hoy y te mostramos qué se puede optimizar con {service.title}.
            </p>
            <ul className="mt-8 space-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}`} className="text-[15px] font-medium text-navy transition hover:text-gold">
                    → {item.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
