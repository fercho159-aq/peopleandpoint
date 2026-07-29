import type { MetadataRoute } from 'next';

import { services, site } from '@/lib/site';

type Entry = {
  readonly path: string;
  readonly priority: number;
  readonly changeFrequency: 'weekly' | 'monthly' | 'yearly';
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: readonly Entry[] = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    ...services.map((service) => ({
      path: `/${service.slug}`,
      priority: 0.9,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terminos-y-condiciones-del-servicio', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return entries.map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
