import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const awards = await airtableGet('Awards', {
    'fields[]': ['Date', 'Award Amount', 'Project', 'Allocation', 'Grantee', 'Payments'],
    filterByFormula: 'NOT({Award Amount} = "")',
    'sort[0][field]': 'Date'
  })
  response.status(200).json(awards)
}
