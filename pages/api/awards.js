import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const awards = await airtableGet('Awards', {
    filterByFormula: 'NOT({Award Amount} = "")',
    'sort[0][field]': 'Date'
  })
  res.status(200).json(awards)
}
