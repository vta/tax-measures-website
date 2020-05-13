/* global fetch */
import querystring from 'querystring'

import { retrieveData, cacheData } from './cache'

const airtableApiUrl = 'https://api.airtable.com/v0'

export async function airtableGet(path, queryParameters = {}) {
  const url = `${airtableApiUrl}/${process.env.AIRTABLE_BASE_ID}/${path}?${querystring.stringify(queryParameters)}`
  console.log(`making request to ${url}`)

  const cachedData = retrieveData(url)

  if (cachedData) {
    console.log('found cached data')
    return cachedData
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
    }
  })

  if (response.ok) {
    const body = await response.json()

    const { records } = body

    if (body.offset) {
      const nextRecords = await airtableGet(path, { ...queryParameters, offset: body.offset })
      records.push(...nextRecords)
    }

    cacheData(url, records)

    return records
  }

  const errorBody = await response.json()
  const errorString = errorBody.error
  throw new Error(errorString)
}
