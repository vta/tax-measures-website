import fetch from 'isomorphic-unfetch'

const dev = process.env.NODE_ENV !== 'production'
const server = dev ? 'http://localhost:3000' : 'https://taxmeasures.vta.org'

export async function fetchCategories() {
  const response = await fetch(`${server}/api/categories`)

  if (!response.ok) {
    const errorBody = await response.json();
    const errorString = errorBody.error;
    throw new Error(errorString);
  }

  const results = await response.json();

  if (!results || !results.records || !results.records.length) {
    throw new Error('Unable to fetch categories')
  }

  return results.records
}

export async function fetchGrantees() {
  const response = await fetch(`${server}/api/grantees`)

  if (!response.ok) {
    const errorBody = await response.json();
    const errorString = errorBody.error;
    throw new Error(errorString);
  }

  const results = await response.json();

  if (!results || !results.records || !results.records.length) {
    throw new Error('Unable to fetch grantees')
  }

  return results.records
}

export async function fetchProjects() {
  const response = await fetch(`${server}/api/projects`)

  if (!response.ok) {
    const errorBody = await response.json();
    const errorString = errorBody.error;
    throw new Error(errorString);
  }

  const results = await response.json();

  if (!results || !results.records || !results.records.length) {
    throw new Error('Unable to fetch projects')
  }

  return results.records
}
