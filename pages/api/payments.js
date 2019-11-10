import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const payments = await airtableGet('Payments', {
    filterByFormula: 'IF(OR(NOT({Amount} = ""),NOT({Project} = "")), 1, 0)',
    'sort[0][field]': 'Date'
  })
  res.status(200).json(payments)
}
