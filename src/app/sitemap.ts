import { MetadataRoute } from 'next';
import { INITIAL_TOOLS, INITIAL_SERVICES, INITIAL_BLOGS } from '@/lib/initialData';
import { CURATED_LEGAL_MOVIES } from '@/lib/curatedMovies';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synasty.xyz';

  // Core static pages
  const staticPages = [
    '',
    '/movies',
    '/tools',
    '/services',
    '/blogs',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/dmca',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Tools pages
  const toolPages = INITIAL_TOOLS.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Movie pages
  const moviePages = CURATED_LEGAL_MOVIES.map((m) => ({
    url: `${baseUrl}/movies/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog pages
  const blogPages = INITIAL_BLOGS.map((b) => ({
    url: `${baseUrl}/blogs/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...moviePages, ...blogPages];
}
