import type { Metadata } from 'next';

import { faqs, offices, services, site, type Service } from '@/lib/site';

/** A JSON-LD node. Values are unknown by design — schema.org shapes vary per @type. */
export type JsonLd = Record<string, unknown>;

export type PageSeo = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly image?: string;
};

/** Builds page metadata with canonical URL and Open Graph / Twitter cards. */
export function buildMetadata({ title, description, path, image }: PageSeo): Metadata {
  const url = `${site.url}${path}`;
  const images = image === undefined ? undefined : [{ url: image, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      siteName: site.name,
      title,
      description,
      url,
      ...(images === undefined ? {} : { images }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images === undefined ? {} : { images: images.map((entry) => entry.url) }),
    },
  };
}

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': organizationId,
    name: site.name,
    alternateName: 'People & Point',
    url: site.url,
    logo: `${site.url}/images/logo.png`,
    image: `${site.url}/images/hero.jpg`,
    description: site.description,
    slogan: site.tagline,
    email: site.email,
    telephone: site.phone,
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'México' },
    knowsLanguage: ['es-MX'],
    address: offices.map((office) => ({
      '@type': 'PostalAddress',
      streetAddress: office.address,
      addressLocality: office.city,
      addressCountry: 'MX',
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'ventas',
      email: site.email,
      telephone: site.phone,
      areaServed: 'MX',
      availableLanguage: 'Spanish',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de administración de capital humano',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: `${site.url}/${service.slug}`,
        },
      })),
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: site.url,
    name: site.name,
    inLanguage: 'es-MX',
    publisher: { '@id': organizationId },
  };
}

export function faqJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function serviceJsonLd(service: Service): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: `${site.url}/${service.slug}`,
    serviceType: service.title,
    image: `${site.url}${service.image}`,
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'México' },
    audience: { '@type': 'BusinessAudience', name: 'Empresas en México' },
  };
}

export function breadcrumbJsonLd(trail: ReadonlyArray<{ readonly name: string; readonly path: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
