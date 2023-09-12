import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { Metadata } from 'next';

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
    url: 'https://2016measureb.vta.org',
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
  return (
    <>
      <h4 dangerouslySetInnerHTML={{ __html: faq['faq-question'] }} />
      <p dangerouslySetInnerHTML={{ __html: faq['faq-answer'] }} />
    </>
  );
};

export default async function Page() {
  const faqs = await fetchFaq();

  return (
    <div>
      <Header showAboutButton={false} />

      <div className="container  main-container">
        <Link href="/" className="btn btn-primary mt-4">
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Home
        </Link>

        <div className="card mt-3 mb-5">
          <div className="card-body">
            <h1>About 2016 Measure B</h1>

            <h4>What is 2016 Measure B?</h4>
            <p>
              A 30-year, half-cent countywide sales tax to enhance transit,
              highways, expressways and active transportation (bicycles,
              pedestrians and complete streets). The measure passed by nearly
              72%, the highest level of support for any Santa Clara County
              transportation tax. The 
              <a href="http://santaclaravta.iqm2.com/Citizens/Board/1100-2016-Measure-B-Citizens-Oversight-Committee">
                2016 Measure B Citizens&apos; Oversight Committee
              </a>
               ensures funds are expended as approved.{' '}
              <a href="https://www.vta.org/projects/funding/2016-measure-b">
                Read More &raquo;
              </a>
            </p>

            <h4>What is this website?</h4>
            <p>
              This website is a window into 2016 Measure B revenue and spending.
              You can search, view and share unaudited financial information
              about programs and projects, updated quarterly or as new
              information is released.
            </p>

            <h4>Where can I submit questions or feedback?</h4>
            <p>
              Email us at{' '}
              <a href="mailto:2016MeasureB@vta.org">2016MeasureB@vta.org</a>.
            </p>
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
