import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const revenue = await airtableGet('Revenue', {
    'fields[]': ['Amount'],
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date'
  })
  response.status(200).json(revenue)
}
