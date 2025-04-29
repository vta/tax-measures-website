import type { MetadataRoute } from 'next'
import { kebabCase } from 'lodash';

import { fetchProjects } from '#/lib/api';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchProjects();
  const pages : MetadataRoute.Sitemap = [
    {
      url: 'https://2016measureb.vta.org',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://2016measureb.vta.org/about',
      changeFrequency: 'monthly',
      priority: 8,
    },
  ]
  
  for (const project of projects) {
    pages.push({
      url: `https://2016measureb.vta.org/projects/${kebabCase(project.fields.Name)}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return pages;
}