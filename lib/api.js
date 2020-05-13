/* global fetch */
const handleError = async response => {
  const errorBody = await response.json()
  const errorString = errorBody.error
  throw new Error(errorString)
}

export async function fetchAllocations() {
  const response = await fetch('/api/allocations')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch allocations')
  }

  return results
}

export async function fetchAwards() {
  const response = await fetch('/api/awards')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch awards')
  }

  return results
}

export async function fetchCategories() {
  const response = await fetch('/api/categories')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch categories')
  }

  return results
}

export async function fetchDocuments() {
  const response = await fetch('/api/documents')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch documents')
  }

  return results
}

export async function fetchGrantees() {
  const response = await fetch('/api/grantees')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch grantees')
  }

  return results
}

export async function fetchPayments() {
  const response = await fetch('/api/payments')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch payments')
  }

  return results
}

export async function fetchProjects() {
  const response = await fetch('/api/projects')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch projects')
  }

  return results
}

export async function fetchRevenue() {
  const response = await fetch('/api/revenue')

  if (!response.ok) {
    return handleError(response)
  }

  const results = await response.json()

  if (!results || results.length === 0) {
    throw new Error('Unable to fetch revenue')
  }

  return results
}
