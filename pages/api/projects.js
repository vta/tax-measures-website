import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const projects = await airtableGet('Projects', {
    filterByFormula: 'NOT({Name} = "")',
    'sort[0][field]': 'Name'
  })
  res.status(200).json(projects)
}
