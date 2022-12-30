import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { ProjectPage } from '#/ui/ProjectPage';

import '#/css/print.css';
import '#/css/index.css';

export default async function Page({ params }) {
  return (
    <div>
      <Header />

      <ProjectPage projectSlug={params.slug} />

      <Footer />
    </div>
  );
}
