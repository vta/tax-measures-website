import cacheData from 'memory-cache';
import { keyBy } from 'lodash';
import bbox from '@turf/bbox';

import { airtableGet } from '#/lib/airtable.js';
import { vtaGet } from '#/lib/vta.js';
import { isValidBbox, preprocessData } from '#/lib/util.js';

export function fetchAllocations() {
  return airtableGet('Allocations', {
    'fields[]': [
      'Allocation ID',
      'Amount',
      'Category',
      'Date Allocated',
      'Available Start',
      'Project',
    ],
    filterByFormula: 'IF({Category} = BLANK(), 0, 1)',
    'sort[0][field]': 'Date Allocated',
  });
}

export function fetchAwards() {
  return airtableGet('Awards', {
    'fields[]': [
      'Date',
      'Award Amount',
      'Project',
      'Allocation',
      'Grantee',
      'Expenditures',
      'Documents',
    ],
    filterByFormula: '{Award Amount} != BLANK()',
    'sort[0][field]': 'Date',
  });
}

export function fetchCategories() {
  return airtableGet('Categories', {
    'fields[]': [
      'Name',
      'Description',
      'Description 2',
      'Parent Category',
      'Ballot Allocation',
      'Documents',
    ],
    filterByFormula: '{Name} != BLANK()',
    'sort[0][field]': 'Name',
  });
}

export function fetchDocuments() {
  return airtableGet('Documents', {
    'fields[]': ['Name', 'Attachment', 'URL', 'Document Type', 'Fiscal Year'],
    'sort[0][field]': 'Fiscal Year',
    'sort[0][direction]': 'desc',
  });
}

export function fetchGrantees() {
  return airtableGet('Grantees', {
    'fields[]': ['Name', 'URL', 'geojson'],
    filterByFormula: '{Name} != BLANK()',
    'sort[0][field]': 'Name',
  });
}

export function fetchExpenditures() {
  return airtableGet('Expenditures', {
    'fields[]': [
      'Date',
      'Amount',
      'Expenditure Description',
      'Award',
      'Fiscal Year',
    ],
    filterByFormula: '{Amount} != BLANK()',
    'sort[0][field]': 'Date',
  });
}

export function fetchProjects() {
  return airtableGet('Projects', {
    'fields[]': [
      'Name',
      'URL',
      'Fiscal Year',
      'geojson',
      'Longitude',
      'Latitude',
      'Grantee',
      'Allocations',
      'Awards',
      'Description',
      'Documents',
      'Last Modified',
    ],
    filterByFormula: 'IF(AND({Grantee} != BLANK(),{Name} != BLANK()), 1, 0)',
    'sort[0][field]': 'Name',
  });
}

export function fetchRevenue() {
  return airtableGet('Revenue', {
    'fields[]': ['Amount', 'Date'],
    filterByFormula: '{Amount} != BLANK()',
    'sort[0][field]': 'Date',
  });
}

export function fetchFaq() {
  return vtaGet('faq-feed/related/1051').catch((error) => {
    console.error(error);
    return [];
  });
}

export function fetchGeoJson(items) {
  return Promise.all(
    items.map(async (item) => {
      try {
        if (item.fields.geojson) {
          const response = await fetch(item.fields.geojson[0].url, {
            next: { revalidate: 600 },
          });

          if (response.ok) {
            const geojson = await response.json();
            const layerBbox = bbox(geojson);

            if (!isValidBbox(layerBbox)) {
              throw new Error('geojson outside of bbox');
            }

            return {
              id: item.id,
              bbox: layerBbox,
              geojson,
            };
          }
        } else if (item.fields.Latitude && item.fields.Longitude) {
          const geojson = {
            type: 'Feature',
            properties: {
              projectId: item.id,
            },
            geometry: {
              type: 'Point',
              coordinates: [item.fields.Longitude, item.fields.Latitude],
            },
          };

          return {
            id: item.id,
            bbox: bbox(geojson),
            geojson,
          };
        }
      } catch (error) {
        console.warn(`Invalid geometry for item "${item.fields.Name}"`);
        console.warn(item.fields.geojson);
        console.warn(error);
      }
    })
  );
}

export async function fetchData() {
  const value = cacheData.get('data');

  if (value) {
    return value;
  }

  const [
    allocations,
    awards,
    categories,
    documents,
    grantees,
    expenditures,
    projects,
    revenue,
    faqs,
  ] = await Promise.all([
    fetchAllocations(),
    fetchAwards(),
    fetchCategories(),
    fetchDocuments(),
    fetchGrantees(),
    fetchExpenditures(),
    fetchProjects(),
    fetchRevenue(),
    fetchFaq(),
  ]);

  const data = preprocessData({
    allocations,
    awards,
    categories,
    documents,
    grantees,
    expenditures,
    projects,
    revenue,
    faqs,
  });

  const mapData = [
    ...(await fetchGeoJson(data.projects)),
    ...(await fetchGeoJson(data.grantees)),
  ];

  data.geojsons = keyBy(mapData, 'id');

  cacheData.put('data', data, 1000 * 60 * 10);

  return data;
}
