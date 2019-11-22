import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const awards = await airtableGet('Awards', {
    filterByFormula: 'IF(OR(NOT({Award Amount} = ""),NOT({Projects} = "")), 1, 0)',
    'sort[0][field]': 'Date'
  })
  res.status(200).json(awards)
}
