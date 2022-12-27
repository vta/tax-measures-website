import { kebabCase } from 'lodash';

import { fetchData } from '#/lib/api';
import { DefaultTags } from '#/ui/DefaultTags';
import { NextSeo } from 'next-seo';

export default async function Head({ params }) {
  const data = await fetchData();
  const project = data.projects.find(
    (project) => kebabCase(project.fields.Name) === params.slug
  );

  return (
    <>
      <DefaultTags />
      <NextSeo
        useAppDir={true}
        title={`${project.fields.Name} | 2016 Measure B`}
        description={`${project.fields.Name}, a 2016 Measure B project.`}
        canonical={`https://2016measureb.vta.org/projects/${params.slug}/`}
        openGraph={{
          url: `https://2016measureb.vta.org/projects/${params.slug}/`,
          title: '2016 Measure B',
          description: `${project.fields.Name}, a 2016 Measure B project.`,
          images: [
            {
              url: 'https://2016measureb.vta.org/meta/measureb-logo-square.png',
              width: 1200,
              height: 1200,
              alt: '2016 Measure B',
            },
          ],
        }}
      />
    </>
  );
}
