import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const categories = await airtableGet('Allocations', {
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date Allocated'
  })
  res.status(200).json(categories)
}
