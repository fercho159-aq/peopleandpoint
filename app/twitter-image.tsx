import { defaultOgCard, OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/components/og-card';
import { site } from '@/lib/site';

export const alt = `${site.name} — maquila de nómina, REPSE y capital humano en México`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = 'nodejs';

export default async function TwitterImage() {
  return renderOgCard(defaultOgCard);
}
