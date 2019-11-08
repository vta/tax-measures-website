import fetch from 'isomorphic-unfetch'

export async function fetchCategories() {
  const response = await fetch(`${process.env.HOST}/api/categories`)

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
  const response = await fetch(`${process.env.HOST}/api/grantees`)

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
  const response = await fetch(`${process.env.HOST}/api/projects`)

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
