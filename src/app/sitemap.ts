import { MetadataRoute } from 'next';
import { getAllApps } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mod.astralune.cfd';

  const apps = await getAllApps();

  const appUrls: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${baseUrl}/app/${app.slug}`,
    lastModified: app.updatedAt ? new Date(app.updatedAt) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?type=game`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?type=app`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...appUrls,
  ];
}
