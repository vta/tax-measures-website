import { NextSeo } from 'next-seo';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-slidedown/lib/slidedown.css';
import '../css/print.css';
import '../css/index.css';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <NextSeo
          useAppDir={true}
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: 'https://2016measureb.vta.org',
            site_name: '2016 Measure B',
          }}
          twitter={{
            handle: '@VTA',
            site: '@VTA',
            cardType: 'summary_large_image',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
