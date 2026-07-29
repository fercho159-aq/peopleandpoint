import type { MetadataRoute } from 'next';

import { services, site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/contact', '/privacy-policy', '/terminos-y-condiciones-del-servicio'];
  const serviceRoutes = services.map((service) => `/${service.slug}`);

  return [...routes, ...serviceRoutes].map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
