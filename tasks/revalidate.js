const https = require('https');

// Fetches production website to revalidate cached data
https
  .get('https://2016measureb.vta.org', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  })
  .on('error', (e) => {
    console.error(e);
  });
