import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const documents = await airtableGet('Documents', {
    'fields[]': ['Name', 'Attachment', 'URL'],
  })
  res.status(200).json(documents)
}
