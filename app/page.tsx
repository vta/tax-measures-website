import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { HomePage } from '#/ui/HomePage';
import { fetchData } from '#/lib/api.js';

import '#/css/print.css';
import '#/css/index.css';

export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <Header data={data} />

      <HomePage data={data} />

      <Footer />
    </div>
  );
}
