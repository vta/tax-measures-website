import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const categories = await airtableGet('Categories', {
    'fields[]': ['Name', 'Parent Category', 'Ballot Allocation'],
    filterByFormula: 'NOT({Name} = "")',
    'sort[0][field]': 'Name'
  })
  response.status(200).json(categories)
}
