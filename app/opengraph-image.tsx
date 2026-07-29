import { ImageResponse } from 'next/og';

import { site } from '@/lib/site';

export const alt = `${site.name} — soluciones de nómina, REPSE y capital humano`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage(): Response {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#184268',
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#d99937',
            fontWeight: 700,
          }}
        >
          {site.name}
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 28, maxWidth: 940 }}>
          Soluciones integrales que impulsan el crecimiento real de tu empresa
        </div>
        <div style={{ fontSize: 28, marginTop: 32, color: 'rgba(255,255,255,0.82)', maxWidth: 900 }}>
          Maquila de nómina · REPSE · Monedero digital · Contabilidad · IMSS · Capacitación
        </div>
        <div style={{ display: 'flex', marginTop: 44, alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 6, backgroundColor: '#d99937' }} />
          <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
            Ciudad de México · Guadalajara · Monterrey
          </div>
        </div>
      </div>
    ),
    size,
  );
}
