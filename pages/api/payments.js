import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const payments = await airtableGet('Payments', {
    'fields[]': ['Date', 'Amount', 'Award'],
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date'
  })
  res.status(200).json(payments)
}
