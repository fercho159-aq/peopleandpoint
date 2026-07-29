import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Montserrat, Outfit } from 'next/font/google';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { JsonLdScript } from '@/components/json-ld';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
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
    default: `${site.name} | Maquila de nómina, REPSE y capital humano en México`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: 'business',
  alternates: { canonical: '/' },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: site.name,
    title: `${site.name} | Maquila de nómina, REPSE y capital humano en México`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Maquila de nómina, REPSE y capital humano`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
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
        <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
