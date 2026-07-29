import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Montserrat, Outfit } from 'next/font/google';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { site } from '@/lib/site';

import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Asesoría en RRHH`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: site.name,
    title: `${site.name} | Asesoría en RRHH`,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX" className={`${montserrat.variable} ${outfit.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
