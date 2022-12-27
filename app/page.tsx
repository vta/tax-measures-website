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
import { preprocessData } from '#/lib/util.js';

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

  return (
    <div>
      <Header data={data} />

      <HomePage data={data} />

      <Footer />
    </div>
  );
}
