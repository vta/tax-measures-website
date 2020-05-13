import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const grantees = await airtableGet('Grantees', {
    'fields[]': ['Name', 'geojson'],
    filterByFormula: 'NOT({Name} = "")',
    'sort[0][field]': 'Name'
  })
  response.status(200).json(grantees)
}
