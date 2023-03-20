import { kebabCase } from 'lodash';

import { fetchData } from '#/lib/api.js';
import { Footer } from '#/ui/Footer';
import { ProjectPage } from '#/ui/ProjectPage';
import { Header } from '#/ui/Header';

export default function Page({ params }) {
  return (
    <div>
      <Header showAboutButton={true} />

      <ProjectPage projectSlug={params.slug} />

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const data = await fetchData();

  return data.projects.map((project) => ({
    slug: kebabCase(project.fields.Name),
  }));
}
