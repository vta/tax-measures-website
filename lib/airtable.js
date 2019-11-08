import fetch from 'isomorphic-unfetch'
import querystring from 'querystring'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()

const { airtableBaseId, airtableApiKey } = serverRuntimeConfig

const airtableApiUrl = 'https://api.airtable.com/v0'

export async function airtableGet(path, queryParams = {}) {
  const response = await fetch(`${airtableApiUrl}/${airtableBaseId}/${path}?${querystring.stringify(queryParams)}`, {
    headers: {
      Authorization: `Bearer ${airtableApiKey}`
    }
  })

  if (response.ok) {
    return response.json();
  }

  const errorBody = await response.json();
  const errorString = errorBody.error;
  throw new Error(errorString);
}
