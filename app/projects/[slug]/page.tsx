import type { Metadata, ResolvingMetadata } from 'next';
import { kebabCase } from 'lodash';

import { fetchData } from '#/lib/api';
import { Footer } from '#/ui/Footer';
import { ProjectPage } from '#/ui/ProjectPage';
import { Header } from '#/ui/Header';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchData();
  const project = data.projects.find(
    (project) => kebabCase(project?.fields.Name) === slug,
  );

  return {
    title: project?.fields.Name,
    description: `${project?.fields.Name} 2016 Measure B details`,
    openGraph: {
      title: project?.fields.Name,
      description: `${project?.fields.Name} 2016 Measure B details`,
      url: `https://2016measureb.vta.org/projects/${slug}`,
      siteName: '2016 Measure B',
      images: [
        {
          url: 'https://2016measureb.vta.org/meta/measureb-logo-square.png',
          width: 1200,
          height: 1200,
          alt: '2016 Measure B',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project?.fields.Name,
      description: `${project?.fields.Name} 2016 Measure B details`,
      creator: '@VTA',
      site: '@VTA',
      images: ['https://2016measureb.vta.org/meta/measureb-logo-square.png'],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <div>
      <Header />

      <ProjectPage projectSlug={slug} />

      <Footer />
    </div>
  );
}
