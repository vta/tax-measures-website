import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const allocations = await airtableGet('Allocations', {
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date Allocated'
  })
  res.status(200).json(allocations)
}