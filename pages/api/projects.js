import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const projects = await airtableGet('Projects', {
    'fields[]': ['Name', 'URL', 'Fiscal Year', 'geojson', 'Longitude', 'Latitude', 'Grantee', 'Allocations', 'Awards', 'Documents', 'Last Modified'],
    filterByFormula: 'IF(OR(NOT({Grantee} = ""),NOT({Name} = "")), 1, 0)',
    'sort[0][field]': 'Name'
  })
  response.status(200).json(projects)
}
