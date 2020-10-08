import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../css/print.css'
import '../css/index.css'
import { DefaultSeo } from 'next-seo'
import HttpsRedirect from 'react-https-redirect'

export default function MyApp({ Component, pageProps }) {
  return (
    <HttpsRedirect>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url: 'https:/2016measureb-beta.vta.org',
          site_name: '2016 Measure B'
        }}
        twitter={{
          handle: '@VTA',
          site: '@VTA',
          cardType: 'summary_large_image'
        }}
      />
      <Component {...pageProps} />
    </HttpsRedirect>
  )
}
