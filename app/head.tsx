import { DefaultTags } from '#/ui/DefaultTags';
import { NextSeo } from 'next-seo';

export default function Head() {
  return (
    <>
      <DefaultTags />
      <NextSeo
        useAppDir={true}
        title="2016 Measure B"
        description="A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax."
        canonical="https://2016measureb.vta.org/"
        openGraph={{
          url: 'https://2016measureb.vta.org/',
          title: '2016 Measure B',
          description:
            '"A 30-year, half-cent countywide sales tax to enhance transit, highways, expressways and active transportation (bicycles, pedestrians and complete streets). The measure passed by nearly 72%, the highest level of support for any Santa Clara County transportation tax.',
          images: [
            {
              url: 'https://2016measureb.vta.org/meta/measureb-logo-square.png',
              width: 1200,
              height: 1200,
              alt: '2016 Measure B',
            },
          ],
        }}
        twitter={{
          handle: '@VTA',
          site: '@VTA',
          cardType: 'summary_large_image',
        }}
      />
    </>
  );
}
