import { Footer } from '#/ui/Footer';
import { HomeHeader } from '#/ui/HomeHeader';
import { HomePage } from '#/ui/HomePage';

export default async function Page() {
  return (
    <div>
      <HomeHeader />

      <HomePage />

      <Footer />
    </div>
  );
}
