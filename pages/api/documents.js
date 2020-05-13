import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const documents = await airtableGet('Documents', {
    'fields[]': ['Name', 'Attachment', 'URL']
  })
  response.status(200).json(documents)
}
