import type { Metadata } from 'next';

import { Analytics } from '#/ui/Analytics';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-slidedown/lib/slidedown.css';

import '#/css/print.css';
import '#/css/index.css';

export const metadata: Metadata = {
  title: {
    template: '%s | 2016 Measure B - VTA',
    default: '2016 Measure B - VTA',
  },
  description:
    'A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
  metadataBase: new URL('https://measureb.vta.org'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: '2016 Measure B - VTA',
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
    title: '2016 Measure B - VTA',
    description:
      'A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
    creator: '@VTA',
    site: '@VTA',
    images: ['https://2016measureb.vta.org/meta/measureb-logo-square.png'],
  },
  other: {
    'google-site-verification': '6kNUB74A6IEx4Ul7vpW9KbJ6ZmCB6GRlEL6_T3nBGUk',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
