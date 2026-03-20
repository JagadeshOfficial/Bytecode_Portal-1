import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bytecodetrainings.com';

  const routes = [
    '',
    '/about',
    '/courses',
    '/placements',
    '/contact',
    '/privacy',
    '/terms',
    '/brochure/python-full-stack',
    '/brochure/java-full-stack',
    '/brochure/data-science-ai',
    '/brochure/devops-cloud',
    '/brochure/cyber-security',
    '/brochure/python-data-analytics',
    '/brochure/ai-full-stack',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
