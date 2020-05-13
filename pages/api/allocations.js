import { airtableGet } from '../../lib/airtable'

export default async (request, response) => {
  const allocations = await airtableGet('Allocations', {
    'fields[]': ['Allocation ID', 'Amount', 'Category', 'Date Allocated', 'Available Start', 'Project'],
    filterByFormula: 'IF(OR(NOT({Amount} != ""), NOT({Category} = BLANK())), 1, 0)',
    'sort[0][field]': 'Date Allocated'
  })
  response.status(200).json(allocations)
}
