/* global fetch */
import querystring from 'querystring'

const vtaApiUrl = 'https://www.vta.org/api'

export async function vtaGet(path, queryParameters = {}) {
  const url = `${vtaApiUrl}/${path}?${querystring.stringify(queryParameters)}`
  console.log(`making request to ${url}`)

  const response = await fetch(url, {
    headers: {
      'api-key': process.env.VTA_API_KEY
    }
  })

  if (response.ok) {
    return response.json()
  }

  const errorBody = await response.json()
  throw new Error(errorString)
}
