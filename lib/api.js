import { airtableGet } from './airtable'
import { vtaGet } from './vta'

export function fetchAllocations() {
  return airtableGet('Allocations', {
    'fields[]': ['Allocation ID', 'Amount', 'Category', 'Date Allocated', 'Available Start', 'Project'],
    filterByFormula: `IF(AND({Amount} != BLANK(), {Category} != BLANK()), 1, 0)`,
    'sort[0][field]': 'Date Allocated'
  })
}

export function fetchAwards() {
  return airtableGet('Awards', {
    'fields[]': ['Date', 'Award Amount', 'Project', 'Allocation', 'Grantee', 'Payments', 'Documents'],
    filterByFormula: '{Award Amount} != BLANK()',
    'sort[0][field]': 'Date'
  })
}

export function fetchCategories() {
  return airtableGet('Categories', {
    'fields[]': ['Name', 'Description', 'Parent Category', 'Ballot Allocation', 'Documents'],
    filterByFormula: '{Name} != BLANK()',
    'sort[0][field]': 'Name'
  })
}

export function fetchDocuments() {
  return airtableGet('Documents', {
    'fields[]': ['Name', 'Attachment', 'URL']
  })
}

export function fetchGrantees() {
  return airtableGet('Grantees', {
    'fields[]': ['Name', 'URL', 'geojson'],
    filterByFormula: '{Name} != BLANK()',
    'sort[0][field]': 'Name'
  })
}

export function fetchPayments() {
  return airtableGet('Payments', {
    'fields[]': ['Date', 'Amount', 'Payment Description', 'Award'],
    filterByFormula: '{Amount} != BLANK()',
    'sort[0][field]': 'Date'
  })
}

export function fetchProjects() {
  return airtableGet('Projects', {
    'fields[]': ['Name', 'URL', 'Fiscal Year', 'geojson', 'Longitude', 'Latitude', 'Grantee', 'Allocations', 'Awards', 'Description', 'Documents', 'Last Modified'],
    filterByFormula: 'IF(AND({Grantee} != BLANK(),{Name} != BLANK()), 1, 0)',
    'sort[0][field]': 'Name'
  })
}

export function fetchRevenue() {
  return airtableGet('Revenue', {
    'fields[]': ['Amount', 'Date'],
    filterByFormula: '{Amount} != BLANK()',
    'sort[0][field]': 'Date'
  })
}

export function fetchFaq() {
  return vtaGet('faq-feed/related/1051')
    .catch(error => {
      console.error(error)
      return []
    })
}
