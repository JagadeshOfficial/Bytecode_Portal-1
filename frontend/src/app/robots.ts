import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login', '/student/', '/employee/'],
    },
    sitemap: 'https://www.bytecodetrainings.com/sitemap.xml',
  };
}
