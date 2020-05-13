const responses = []

export const retrieveData = url => {
  const cachedResponse = responses[url]

  if (cachedResponse && cachedResponse.date > new Date()) {
    return cachedResponse.data
  }
}

export const cacheData = (url, data) => {
  const airtableCacheTime = process.env.AIRTABLE_CACHE_TIME ? Number.parseInt(process.env.AIRTABLE_CACHE_TIME, 10) : 300000
  const date = new Date(new Date().getTime() + airtableCacheTime)
  responses[url] = {
    data,
    date
  }
}
