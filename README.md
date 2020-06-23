# VTA Tax Measures Single Page Application

## Setup

Requires [node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/) to be installed.

On OS X:

    brew install node yarn


Install project dependencies:

    yarn

Setup configurtion by creating a `.env` file in the project root with the following:

    AIRTABLE_API_KEY=your-airtable-api-key
    AIRTABLE_BASE_ID=your-airtable-base-id
    AIRTABLE_CACHE_TIME=300000
    NEXT_PUBLIC_ALGOLIA_APP_ID=your-algolia-app-id
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-algolia-search-api-key
    ALGOLIA_ADMIN_API_KEY=your-algolia-api-key
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
    VTA_API_KEY=your-vta.org-api-key

## Running locally

Start the development server:

    yarn dev

Open http://localhost:3000 in your browser
    
## Building a staticly compiled version for production

Follow the setup inistructions above, and then run:

    yarn build

## Running in production

Runs the built app in production mode:

    yarn start
    