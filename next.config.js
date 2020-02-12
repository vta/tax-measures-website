const withSass = require('@zeit/next-sass')
require('dotenv').config()

const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = withSass({
  webpack: config => {
    config.plugins = config.plugins || []

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    ]

    return config
  },
  serverRuntimeConfig: {
    airtableApiKey: process.env.AIRTABLE_API_KEY,
    airtableBaseId: process.env.AIRTABLE_BASE_ID,
    airtableCacheTime: process.env.AIRTABLE_CACHE_TIME ? parseInt(process.env.AIRTABLE_CACHE_TIME, 10) : 300000,
  },
  publicRuntimeConfig: {
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN
  }
})
