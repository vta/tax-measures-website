'use server';
import { Suspense } from 'react';

import { fetchData } from '#/lib/api.js';
import { HomePageData } from '#/ui/HomepageData';

export async function HomePage() {
  const data = await fetchData();

  return (
    <div className="container-fluid main-container">
      <Suspense>
        <HomePageData data={data} />
      </Suspense>
    </div>
  );
}
