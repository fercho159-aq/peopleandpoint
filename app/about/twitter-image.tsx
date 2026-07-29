import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/og-card';

export const alt = 'Más que un proveedor, un aliado estratégico — People and Point';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'nodejs';

export default async function TwitterImage() {
  return renderOgCard({
    eyebrow: 'Nosotros',
    title: 'Más que un proveedor, un aliado estratégico',
    subtitle: 'Misión, visión y valores de People and Point',
  });
}
