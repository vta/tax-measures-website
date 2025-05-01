import { keyBy } from 'lodash';
import bbox from '@turf/bbox';
const { unstable_cache } = require('next/cache');

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
      'Last Modified',
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
      'Last Modified',
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
    'fields[]': ['Name', 'URL', 'Document Type', 'Fiscal Year'],
    filterByFormula:
      'IF(AND({URL} != BLANK(),{Document Type} != BLANK()), 1, 0)',
    'sort[0][field]': 'Fiscal Year',
    'sort[0][direction]': 'desc',
  });
}

export function fetchGrantees() {
  return airtableGet('Grantees', {
    'fields[]': ['Name', 'URL'],
    filterByFormula: '{Name} != BLANK()',
    'sort[0][field]': 'Name',
  });
}

export function fetchTotalExpenditures() {
  return airtableGet('Total Expenditures', {
    'fields[]': ['Date', 'Amount', 'Award', 'Fiscal Year', 'Last Modified'],
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
      'Images',
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

export function fetchImages() {
  return airtableGet('Images', {
    'fields[]': ['Caption', 'URL', 'Categories', 'Projects'],
    filterByFormula: '{URL} != BLANK()',
  });
}

export async function fetchFaq() {
  try {
    const faq = await vtaGet('faq-feed/related/1051');

    return faq.map((faqItem) => {
      faqItem['faq-answer'] = faqItem['faq-answer'].replace(
        /href\=\"\//g,
        'href="https://vta.org/',
      );
      return faqItem;
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function parseGeoJson(items) {
  return items.map((item) => {
    try {
      if (item.fields.geojson) {
        const geojson = JSON.parse(item.fields.geojson);
        const layerBbox = bbox(geojson);

        if (!isValidBbox(layerBbox)) {
          throw new Error('geojson outside of bbox');
        }

        return {
          id: item.id,
          bbox: layerBbox,
          geojson,
        };
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
  });
}

export async function fetchData() {
  // Wrap the entire data fetching and processing in unstable_cache
  return unstable_cache(
    async () => {
      const [
        allocations,
        awards,
        categories,
        documents,
        grantees,
        expenditures,
        projects,
        revenue,
        images,
        faqs,
      ] = await Promise.all([
        fetchAllocations(),
        fetchAwards(),
        fetchCategories(),
        fetchDocuments(),
        fetchGrantees(),
        fetchTotalExpenditures(),
        fetchProjects(),
        fetchRevenue(),
        fetchImages(),
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
        images,
        faqs,
      });

      data.geojsons = keyBy(parseGeoJson(data.projects), 'id');

      return data;
    },
    ['all-data'], // Cache key
    {
      revalidate: 3600, // Cache for 1 hour (in seconds)
      tags: ['all-data'],
    },
  )();
}
