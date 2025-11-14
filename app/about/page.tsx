import type { Metadata } from 'next';
import { Anchorme } from 'react-anchorme';

import { Footer } from '#/ui/Footer';
import { Header } from '#/ui/Header';

import { fetchFaq } from '#/lib/api';

export const metadata: Metadata = {
  title: 'About 2016 Measure B',
  description:
    'A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
  openGraph: {
    title: 'About 2016 Measure B',
    description:
      'A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
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
    title: 'About 2016 Measure B',
    description:
      'A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
    creator: '@VTA',
    site: '@VTA',
    images: ['https://2016measureb.vta.org/meta/measureb-logo-square.png'],
  },
};

const Faq = ({ faq }) => {
  // Split content by line breaks and map to React elements
  const contentLines = faq.fields.Content.split('\n');

  return (
    <>
      <h2 className="mt-4">{faq.fields.Title}</h2>
      <p className="faq-answer">
        {contentLines.map((line, index) => (
          <span key={index}>
            <Anchorme>{line}</Anchorme>
            {index < contentLines.length - 1 && <br />}
          </span>
        ))}
      </p>
    </>
  );
};

export default async function Page() {
  const faqs = await fetchFaq();

  return (
    <div>
      <Header />

      <div className="container main-container">
        <div className="card mt-3 mb-5">
          <div className="card-body">
            <h1>About 2016 Measure B</h1>
            {faqs.map((faq, index) => (
              <Faq faq={faq} key={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
