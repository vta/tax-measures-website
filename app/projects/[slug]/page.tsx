import { kebabCase } from 'lodash';

import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { ProjectPage } from '#/ui/ProjectPage';
import { fetchData } from '#/lib/api.js';

export default async function Page({ params }) {
  const data = await fetchData();
  const project = data.projects.find(
    (project) => kebabCase(project.fields.Name) === params.slug
  );

  return (
    <div>
      <Header data={data} />

      <ProjectPage data={data} project={project} />

      <Footer />
    </div>
  );
}
