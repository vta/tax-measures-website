import type { Metadata } from 'next';
import { kebabCase } from 'lodash';

import { fetchData } from '#/lib/api';
import { Footer } from '#/ui/Footer';
import { ProjectPage } from '#/ui/ProjectPage';
import { Header } from '#/ui/Header';

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = 'https://2016measureb.vta.org';
const defaultSocialImage = `${siteUrl}/meta/measureb-logo-square.png`;
const notFoundTitle = 'Project not found';
const notFoundDescription = 'The requested project could not be found.';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: notFoundTitle,
      description: notFoundDescription,
      robots: { index: false, follow: false },
    };
  }

  const data = await fetchData();
  const project = data.projects.find(
    (project) => kebabCase(project?.fields.Name) === slug,
  );

  if (!project) {
    return {
      title: notFoundTitle,
      description: notFoundDescription,
      robots: { index: false, follow: false },
      openGraph: {
        title: notFoundTitle,
        description: notFoundDescription,
        url: `${siteUrl}/projects/${slug}`,
        siteName: '2016 Measure B',
        images: [
          {
            url: defaultSocialImage,
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
        title: notFoundTitle,
        description: notFoundDescription,
        creator: '@VTA',
        site: '@VTA',
        images: [defaultSocialImage],
      },
    };
  }

  const projectName = project.fields.Name;

  return {
    title: projectName,
    description: `${projectName} 2016 Measure B details`,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: projectName,
      description: `${projectName} 2016 Measure B details`,
      url: `${siteUrl}/projects/${slug}`,
      siteName: '2016 Measure B',
      images: [
        {
          url: defaultSocialImage,
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
      title: projectName,
      description: `${projectName} 2016 Measure B details`,
      creator: '@VTA',
      site: '@VTA',
      images: [defaultSocialImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <div>
      <Header />

      <ProjectPage projectSlug={slug} />

      <Footer />
    </div>
  );
}
