import fetch from 'isomorphic-unfetch'
import querystring from 'querystring'
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()
const { airtableBaseId, airtableApiKey } = serverRuntimeConfig

import { retrieveData, cacheData } from './cache'

const airtableApiUrl = 'https://api.airtable.com/v0'

export async function airtableGet(path, queryParams = {}) {
  const url = `${airtableApiUrl}/${airtableBaseId}/${path}?${querystring.stringify(queryParams)}`;
  console.log(`making request to ${url}`)

  const cachedData = retrieveData(url)

  if (cachedData) {
    console.log('found cached data')
    return cachedData;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${airtableApiKey}`
    }
  })

  if (response.ok) {
    const body = await response.json();

    let records = body.records;

    if (body.offset) {
      const nextRecords = await airtableGet(path, { ...queryParams, offset: body.offset })
      records.push( ...nextRecords )
    }

    cacheData(url, records)

    return records;
  }

  const errorBody = await response.json()
  const errorString = errorBody.error
  throw new Error(errorString)
}
