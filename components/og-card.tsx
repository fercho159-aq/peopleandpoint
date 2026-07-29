import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { site } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

async function logoDataUri(): Promise<string> {
  const file = await readFile(path.join(process.cwd(), 'public', 'images', 'logo.png'));
  return `data:image/png;base64,${file.toString('base64')}`;
}

/** Brand card used for Open Graph and Twitter previews across the site. */
export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}): Promise<ImageResponse> {
  const logo = await logoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#184268',
          backgroundImage: 'linear-gradient(115deg, #12314d 0%, #184268 55%, #2c5580 100%)',
          padding: '72px 80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={300} height={73} />
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', letterSpacing: 2 }}>peopleandpoint.com</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, letterSpacing: 6, textTransform: 'uppercase', color: '#d99937', fontWeight: 700 }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.12, marginTop: 22, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 26, marginTop: 26, color: 'rgba(255,255,255,0.78)', maxWidth: 940 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 6, backgroundColor: '#d99937' }} />
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
            Ciudad de México · Guadalajara · Monterrey
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export const defaultOgCard = {
  eyebrow: site.tagline,
  title: 'Soluciones integrales que impulsan el crecimiento real de tu empresa',
  subtitle: 'Maquila de nómina · REPSE · Monedero digital · Contabilidad · IMSS · Capacitación',
} as const;
