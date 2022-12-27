import Script from 'next/script';

import * as gtag from '#/lib/gtag';

// Default <head> tags we want shared across the app
export const DefaultTags = () => {
  return (
    <>
      <title>2016 Measure B</title>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gtag.GA_TRACKING_ID}');
        `}
      </Script>
      <meta
        name="google-site-verification"
        content="6kNUB74A6IEx4Ul7vpW9KbJ6ZmCB6GRlEL6_T3nBGUk"
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
};
