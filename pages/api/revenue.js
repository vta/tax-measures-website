import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const revenue = await airtableGet('Revenue', {
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date'
  })
  res.status(200).json(revenue)
}
