import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const payments = await airtableGet('Payments', {
    'fields[]': ['Date', 'Amount', 'Payment Description', 'Award'],
    filterByFormula: 'NOT({Amount} = "")',
    'sort[0][field]': 'Date'
  })
  response.status(200).json(payments)
}
