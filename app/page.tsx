import { keyBy } from 'lodash';

import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import { HomePage } from '#/ui/HomePage';
import {
  fetchAllocations,
  fetchAwards,
  fetchCategories,
  fetchDocuments,
  fetchGrantees,
  fetchExpenditures,
  fetchProjects,
  fetchRevenue,
  fetchFaq,
} from '#/lib/api.js';
import { fetchGeoJson, preprocessData } from '#/lib/util.js';

export default async function Page() {
  const [
    allocations,
    awards,
    categories,
    documents,
    grantees,
    expenditures,
    projects,
    revenue,
    faqs,
  ] = await Promise.all([
    fetchAllocations(),
    fetchAwards(),
    fetchCategories(),
    fetchDocuments(),
    fetchGrantees(),
    fetchExpenditures(),
    fetchProjects(),
    fetchRevenue(),
    fetchFaq(),
  ]);

  const data = preprocessData({
    allocations,
    awards,
    categories,
    documents,
    grantees,
    expenditures,
    projects,
    revenue,
    faqs,
  });

  const mapData = [
    ...(await fetchGeoJson(data.projects)),
    ...(await fetchGeoJson(data.grantees)),
  ];

  data.geojsons = keyBy(mapData, 'id');

  return (
    <div>
      <Header data={data} />

      <HomePage data={data} />

      <Footer />
    </div>
  );
}
