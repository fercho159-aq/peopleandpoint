import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/og-card';

export const alt = 'Conectemos con propósito — People and Point';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'nodejs';

export default async function OpengraphImage() {
  return renderOgCard({
    eyebrow: 'Contacto',
    title: 'Conectemos con propósito',
    subtitle: 'Agenda una asesoría: contacto@peopleandpoint.com · +52 56 6971 3268',
  });
}
