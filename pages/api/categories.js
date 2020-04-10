import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const categories = await airtableGet('Categories', {
    'fields[]': ['Name', 'Parent Category', 'Ballot Allocation'],
    filterByFormula: 'NOT({Name} = "")',
    'sort[0][field]': 'Name'
  })
  res.status(200).json(categories)
}
