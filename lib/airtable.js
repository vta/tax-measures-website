/* global fetch */
import querystring from 'querystring';

const airtableApiUrl = 'https://api.airtable.com/v0';

export async function airtableGet(path, queryParameters = {}) {
  const url = `${airtableApiUrl}/${
    process.env.AIRTABLE_BASE_ID
  }/${path}?${querystring.stringify(queryParameters)}`;
  console.log(`making request to ${url}`);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    cache: 'no-store',
  });

  if (response.ok) {
    const body = await response.json();

    const { records } = body;

    if (body.offset) {
      // If offset is present, fetch next page and set revalidate for an hour
      // to avoid expired page
      const nextRecords = await airtableGet(path, {
        ...queryParameters,
        offset: body.offset,
      });
      records.push(...nextRecords);
    }

    return records;
  }

  const errorBody = await response.json();
  const errorString = `${JSON.stringify(errorBody.error)} in ${path}`;
  throw new Error(errorString);
}
