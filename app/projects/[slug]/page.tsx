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
