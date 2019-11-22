import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const grantees = await airtableGet('Grantees', {
    'fields[]': ['Name', 'URL'],
    filterByFormula: 'NOT({Name} = "")',
    'sort[0][field]': 'Name'
  })
  res.status(200).json(grantees)
}
