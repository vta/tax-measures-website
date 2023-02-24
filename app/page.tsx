import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { HomePage } from '#/ui/HomePage';

export default async function Page() {
  return (
    <div>
      <Header />

      <HomePage />

      <Footer />
    </div>
  );
}
