import { airtableGet } from '../../lib/airtable'

export default async (req, res) => {
  const allocations = await airtableGet('Allocations', {
    'fields[]': ['Allocation ID', 'Amount', 'Category', 'Date Allocated', 'Available Start', 'Project'],
    filterByFormula: 'IF(OR(NOT({Amount} != ""), NOT({Category} = BLANK())), 1, 0)',
    'sort[0][field]': 'Date Allocated'
  })
  res.status(200).json(allocations)
}
