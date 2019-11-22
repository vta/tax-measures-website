import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const projects = await airtableGet('Projects', {
    filterByFormula: 'IF(OR(NOT({Grantee} = ""),NOT({Name} = "")), 1, 0)',
    'sort[0][field]': 'Name'
  })
  res.status(200).json(projects)
}
