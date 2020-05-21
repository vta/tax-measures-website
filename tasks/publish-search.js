const algoliasearch = require('algoliasearch')
const querystring = require('querystring')
const fetch = require('cross-fetch')

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY)
const index = client.initIndex('TAX_MEASURES_PROJECTS')

const airtableApiUrl = 'https://api.airtable.com/v0'

async function airtableGet(path, queryParameters = {}) {
  const url = `${airtableApiUrl}/${process.env.AIRTABLE_BASE_ID}/${path}?${querystring.stringify(queryParameters)}`
  console.log(`making request to ${url}`)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
    }
  })

  if (response.ok) {
    const body = await response.json()

    const { records } = body

    if (body.offset) {
      const nextRecords = await airtableGet(path, { ...queryParameters, offset: body.offset })
      records.push(...nextRecords)
    }

    return records
  }

  const errorBody = await response.json()
  const errorString = errorBody.error
  throw new Error(errorString)
}

airtableGet('Projects', {
  'fields[]': ['Name', 'Description'],
  filterByFormula: 'IF(OR(NOT({Grantee} = ""),NOT({Name} = "")), 1, 0)'
}).then(projects => {
  const formattedProjects = projects.map(p => ({
    id: p.id,
    name: p.fields.Name,
    description: p.fields.description
  }))
  index.replaceAllObjects(formattedProjects, {
    autoGenerateObjectIDIfNotExist: true
  }).then(({ objectIDs }) => {
    index.setSettings({
      searchableAttributes: [
        'name',
        'description'
      ]
    }).then(() => {
      console.log(`Published ${objectIDs.length} projects for search`)
    });
  })
}).catch(error => {
  console.error(error)
})
