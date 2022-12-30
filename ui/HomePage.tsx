'use server';

import { fetchData } from '#/lib/api.js';
import { HomePageData } from '#/ui/HomepageData';

export const HomePage = async () => {
  const data = await fetchData();

  return (
    <div className="container-fluid main-container">
      <HomePageData data={data} />
    </div>
  );
};
