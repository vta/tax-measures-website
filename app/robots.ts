export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://2016measureb.vta.org/sitemap.xml',
  };
}
