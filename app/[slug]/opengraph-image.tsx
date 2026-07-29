import { notFound } from 'next/navigation';

import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/og-card';
import { findService, services } from '@/lib/site';

export const alt = 'Servicio de People and Point';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'nodejs';

export function generateStaticParams(): Array<{ slug: string }> {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = findService(slug);
  if (service === undefined) notFound();

  return renderOgCard({
    eyebrow: 'Nuestros servicios',
    title: service.title,
    subtitle: service.differentiator,
  });
}
