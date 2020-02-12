import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()
const { airtableCacheTime } = serverRuntimeConfig

const responses = []

export const retrieveData = url => {
  const cachedResponse = responses[url]

  if (cachedResponse && cachedResponse.date > new Date()) {
    return cachedResponse.data
  }
}

export const cacheData = (url, data) => {
  const date = new Date(new Date().getTime() + airtableCacheTime)
  responses[url] = {
    data,
    date
  }
}
