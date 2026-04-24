import type { Metadata } from 'next';

import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';
import FiscalYearSelector from '#/ui/FiscalYearSelect';

export const metadata: Metadata = {
  title: 'Audited Expenditures by Fiscal Year | 2016 Measure B',
  description:
    'See all audited expenditures by fiscal year for 2016 Measure B projects.',
  openGraph: {
    title: 'Audited Expenditures by Fiscal Year | 2016 Measure B',
    description:
      'See all audited expenditures by fiscal year for 2016 Measure B projects.',
    url: 'https://2016measureb.vta.org/about',
    siteName: '2016 Measure B',
    images: [
      {
        url: 'https://2016measureb.vta.org/meta/measureb-logo-square.png',
        width: 1200,
        height: 1200,
        alt: '2016 Measure B',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audited Expenditures by Fiscal Year | 2016 Measure B',
    description:
      'See all audited expenditures by fiscal year for 2016 Measure B projects.',
    creator: '@VTA',
    site: '@VTA',
    images: ['https://2016measureb.vta.org/meta/measureb-logo-square.png'],
  },
};

export default async function Page() {
  return (
    <div>
      <Header />

      <div className="container main-container">
        <div className="card mt-3 mb-5">
          <div className="card-body">
            <h1>Expenditures by Fiscal Year</h1>
            <p>
              Select a fiscal year to view the expenditures for that year,
              grouped by project.
            </p>
            <FiscalYearSelector />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
