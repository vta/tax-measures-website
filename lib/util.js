/* global window */
import querystring from 'querystring';
import algoliasearch from 'algoliasearch';

import { maxBy, sortBy, uniq } from 'lodash';
import moment from 'moment';

import { categoryCards } from '#/lib/category-cards.js';
import { pageview } from '#/lib/gtag.js';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);
const index = client.initIndex('TAX_MEASURES_PROJECTS');

function sortByFiscalYear(project) {
  return project.fields['Fiscal Year'] ? project.fields['Fiscal Year'] * -1 : 0;
}

function sortByGrantee(project) {
  return project.fields['Grantee Name'] || 'zzzzz';
}

export function getCurrentFiscalYear() {
  const year = moment().year();

  if (moment().quarter() <= 2) {
    return year;
  }

  return year + 1;
}

export function sumCurrency(values) {
  return (
    values.reduce((memo, value) => {
      memo += Math.round(value * 10);
      return memo;
    }, 0) / 10
  );
}

export function updateUrlWithFilters(filters, currentProjectIds) {
  if (!filters && !currentProjectIds) {
    window.history.replaceState({}, '', '?');
    pageview('?');
    return;
  }

  const urlParameters = {};

  if (filters) {
    const { transactionType, grantee, project, category } = filters;

    urlParameters.transactionType = transactionType;
    urlParameters.grantee = grantee;
    urlParameters.project = project;
    urlParameters.category = category;
  }

  if (currentProjectIds && currentProjectIds.length > 0) {
    urlParameters.project_ids = currentProjectIds.join(',');
  }

  const newUrl = `?${querystring.stringify(urlParameters)}`;

  if (newUrl === window.location.search) {
    return;
  }

  window.history.replaceState({}, '', newUrl);

  pageview(newUrl);
}

export function getFiltersFromQuery(searchParams) {
  const filters = {};

  if (
    searchParams.has('transactionType') &&
    searchParams.get('transactionType') !== ''
  ) {
    filters.transactionType = searchParams.get('transactionType');
  }

  if (searchParams.has('grantee') && searchParams.get('grantee') !== '') {
    filters.grantee = searchParams.getAll('grantee');
  }

  if (searchParams.has('project') && searchParams.get('project') !== '') {
    filters.project = searchParams.get('project');
  }

  if (searchParams.has('category') && searchParams.get('category') !== '') {
    filters.category = searchParams.getAll('category');
  }

  return filters;
}

/* eslint-disable-next-line max-params */
export async function applyFilters(
  filters,
  awards,
  expenditures,
  projects,
  categories,
  grantees
) {
  const results = {
    items: [],
    projects: [],
    filters,
  };

  if (filters.transactionType === 'award') {
    results.transactionType = 'award';
    results.items.push(...awards);
  } else if (filters.transactionType === 'expenditure') {
    results.transactionType = 'expenditure';
    results.items.push(...expenditures);
  }

  // Apply category filter
  if (filters.category) {
    results.items = results.items.filter((item) => {
      if (!item.fields.CategoryName) {
        return false;
      }

      return (
        filters.category.includes(item.fields.CategoryName) ||
        filters.category.includes(item.fields.ParentCategoryName)
      );
    });
  }

  // Apply grantee filter
  if (filters.grantee) {
    const filteredGranteeIds = grantees
      .filter((g) => filters.grantee.includes(g.fields.Name))
      .map((g) => g.id);
    if (filteredGranteeIds) {
      results.items = results.items.filter((item) => {
        if (!item.fields.Grantee) {
          return false;
        }

        return filteredGranteeIds.includes(item.fields.Grantee[0]);
      });
    }
  }

  // Apply project filter
  if (filters.project) {
    const { hits } = await index.search(filters.project, {
      attributesToRetrieve: ['id'],
    });

    const filteredProjectIds = hits.map((h) => h.id);

    if (filteredProjectIds) {
      results.items = results.items.filter((item) => {
        if (item.fields.Project) {
          return filteredProjectIds.includes(item.fields.Project[0]);
        }

        return false;
      });
    }
  }

  // After applying filters, find all relevant projects associated with the awards or expenditures
  const projectIds = uniq(
    results.items
      .filter((item) => Boolean(item.fields.Project))
      .map((item) => item.fields.Project[0])
  );

  // Filter associated projects
  const filteredProjects = projectIds.reduce((memo, projectId) => {
    const project = projects.find((p) => p.id === projectId);
    let projectMatchesFilters = true;

    if (!project) {
      projectMatchesFilters = false;
    }

    if (
      filters.category &&
      !filters.category.includes(project.fields.CategoryName) &&
      !filters.category.includes(project.fields.ParentCategoryName)
    ) {
      projectMatchesFilters = false;
    }

    if (
      filters.grantee &&
      !filters.grantee.includes(project.fields['Grantee Name'])
    ) {
      projectMatchesFilters = false;
    }

    if (projectMatchesFilters) {
      memo.push(project);
    }

    return memo;
  }, []);

  results.projects = sortBy(filteredProjects, [
    sortByFiscalYear,
    sortByGrantee,
  ]);

  results.categoryCard = getSingleCategoryCard(filters, categories);

  return results;
}

function addProjectData(item, data) {
  let allocationId;
  if (item.fields.Allocation) {
    allocationId = item.fields.Allocation[0];
  } else if (item.fields.Award) {
    const award = getAwardById(item.fields.Award[0], data.awards);

    if (award && award.fields.Project && award.fields.Project.length > 0) {
      item.fields.Project = award.fields.Project;
    }

    if (
      award &&
      award.fields.Allocation &&
      award.fields.Allocation.length > 0
    ) {
      allocationId = award.fields.Allocation[0];
    }
  }

  // Get category by allocation
  if (allocationId) {
    const allocation = getAllocationById(allocationId, data.allocations);
    if (allocation) {
      const category = data.categories.find(
        (c) => c.fields.Name === allocation.fields.CategoryName
      );
      const parentCategory = data.categories.find(
        (c) => c.fields.Name === allocation.fields.ParentCategoryName
      );

      item.fields.CategoryName = category.fields.Name;
      item.fields.ParentCategoryName = parentCategory.fields.Name;
    }
  }

  if (!item.fields.CategoryName) {
    item.fields.CategoryName = 'Uncategorized';
    item.fields.ParentCategoryName = 'Uncategorized';
  }

  if (item.fields.Project) {
    const project = getProjectById(item.fields.Project[0], data.projects);

    if (
      project && // Get a list of all grantees for each item
      project.fields.Grantee
    ) {
      item.fields.Grantee = project.fields.Grantee;
    }
  }
}

function createPhantomData(data) {
  for (const project of data.projects) {
    if (project.fields.Awards && project.fields.Awards.length > 0) {
      continue;
    }

    if (
      !project.fields.Allocations ||
      project.fields.Allocations.length === 0
    ) {
      continue;
    }

    // Create "Phantom Award" and "Phantom Expenditure of $0
    const awardId = `${project.id}award`;
    const expenditureId = `${project.id}expenditure`;
    project.fields.Awards = [awardId];

    data.awards.push({
      id: awardId,
      fields: {
        'Award Amount': 0,
        Project: [project.id],
        Expenditures: [expenditureId],
        Allocation: [project.fields.Allocations[0]],
      },
    });

    data.expenditures.push({
      id: expenditureId,
      fields: {
        Amount: 0,
        Award: [awardId],
      },
    });
  }
}

export function preprocessData(data) {
  createPhantomData(data);

  // Organize categories hierarchically
  data.parentCategories = data.categories.filter(
    (c) => !c.fields['Parent Category']
  );

  for (const project of data.projects) {
    // Populate category, parent category and subcategory names for each project

    if (project.fields.Allocations) {
      const allocations = project.fields.Allocations.map((allocationId) =>
        getAllocationById(allocationId, data.allocations)
      );

      // Use allocation with largest amount to get project category
      const largestAllocation = maxBy(allocations, 'fields.Amount');

      if (largestAllocation && largestAllocation.fields.Category) {
        const category = getCategoryById(
          largestAllocation.fields.Category[0],
          data.categories
        );
        const parentCategory = getParentCategoryByCategory(
          category,
          data.categories
        );

        if (category) {
          project.fields.CategoryName = category.fields.Name;
        }

        if (parentCategory) {
          project.fields.ParentCategoryName = parentCategory.fields.Name;
        }
      }

      if (project.fields.Awards) {
        project.fields.Expenditures = uniq(
          project.fields.Awards.reduce((memo, awardId) => {
            const award = getAwardById(awardId, data.awards);

            if (
              award &&
              award.fields.Expenditures &&
              award.fields.Expenditures.length > 0
            ) {
              memo.push(...award.fields.Expenditures);
            }

            return memo;
          }, [])
        );
      }
    }

    if (!project.fields.CategoryName) {
      project.fields.CategoryName = 'Uncategorized';
      project.fields.ParentCategoryName = 'Uncategorized';
    }

    if (
      !project.fields.parentCategoryName ||
      project.fields.CategoryName !== project.fields.ParentCategoryName
    ) {
      project.fields.SubcategoryName = project.fields.CategoryName;
    }

    // Get grantee name for each project
    if (project.fields.Grantee) {
      const grantee = getGranteeByProject(project, data.grantees);
      project.fields['Grantee Name'] = grantee.fields.Name;
    }
  }

  for (const allocation of data.allocations) {
    // Set amount = 0 if undefined
    if (!allocation.fields.Amount) {
      allocation.fields.Amount = 0;
    }

    // Populate category for each allocation
    const category = getCategoryById(
      allocation.fields.Category[0],
      data.categories
    );
    const parentCategory = getParentCategoryByCategory(
      category,
      data.categories
    );

    if (category) {
      allocation.fields.CategoryName = category.fields.Name;
    }

    if (parentCategory) {
      allocation.fields.ParentCategoryName = parentCategory.fields.Name;
    }

    // Get a list of all grantees for each allocation
    if (allocation.fields.Project) {
      allocation.fields.Grantees = [
        ...allocation.fields.Project.reduce((memo, projectId) => {
          const project = getProjectById(projectId, data.projects);

          if (project && project.fields && project.fields.Grantee) {
            memo.add(project.fields.Grantee[0]);
          }

          return memo;
        }, new Set()),
      ];
    }
  }

  for (const award of data.awards) {
    addProjectData(award, data);
  }

  for (const expenditure of data.expenditures) {
    addProjectData(expenditure, data);
  }

  // Sum project fields last
  for (const project of data.projects) {
    // Get total expenditures for each project
    project.fields.totalExpenditureAmount = sumCurrency(
      data.expenditures
        .filter((expenditure) => {
          if (!expenditure.fields.Project) {
            return false;
          }

          return expenditure.fields.Project[0] === project.id;
        })
        .map((expenditure) => expenditure.fields.Amount)
    );

    // Get total allocations for each project
    project.fields.totalAllocationAmount = sumCurrency(
      data.allocations
        .filter((allocation) => {
          if (!allocation.fields.Project) {
            return false;
          }

          return allocation.fields.Project.includes(project.id);
        })
        .map((allocation) => allocation.fields.Amount)
    );

    // Get total awards for each project
    project.fields.totalAwardAmount = sumCurrency(
      data.awards
        .filter((award) => {
          if (!award.fields.Project) {
            return false;
          }

          return award.fields.Project[0] === project.id;
        })
        .map((allocation) => allocation.fields['Award Amount'])
    );
  }

  // Add full vta.org URLs for all FAQ items, and add target="_blank"
  data.faqs = data.faqs.map((faq) => {
    faq['faq-answer'] = faq['faq-answer'].replace(
      /href="\//g,
      'target="_blank" href="https://vta.org/'
    );
    return faq;
  });

  return data;
}

export function isValidBbox(bbox) {
  if (bbox[0] > 180 || bbox[0] < -180) {
    return false;
  }

  if (bbox[1] > 90 || bbox[1] < -90) {
    return false;
  }

  if (bbox[2] > 180 || bbox[2] < -180) {
    return false;
  }

  if (bbox[3] > 90 || bbox[3] < -90) {
    return false;
  }

  return true;
}

export function mergeBboxes(bboxes) {
  return bboxes.reduce(
    (memo, bbox) => {
      memo[0] = Math.min(memo[0], bbox[0]);
      memo[1] = Math.min(memo[1], bbox[1]);
      memo[2] = Math.max(memo[2], bbox[2]);
      memo[3] = Math.max(memo[3], bbox[3]);
      return memo;
    },
    [180, 90, -180, -90]
  );
}

export function getViewport(bbox) {
  if (!bbox) {
    return null;
  }

  const [minLng, minLat, maxLng, maxLat] = bbox;
  const lngDelta = maxLng - minLng;
  const latDelta = maxLat - minLat;
  const degreeDelta = Math.max(lngDelta, latDelta);

  let zoom = 7;
  if (degreeDelta > 0.8) {
    zoom = 7;
  } else if (degreeDelta > 0.35) {
    zoom = 8;
  } else if (degreeDelta > 0.3) {
    zoom = 9;
  } else if (degreeDelta > 0.25) {
    zoom = 10;
  } else if (degreeDelta > 0.07) {
    zoom = 11;
  } else if (degreeDelta > 0.01) {
    zoom = 12;
  } else {
    zoom = 13;
  }

  return {
    latitude: (maxLat + minLat) / 2,
    longitude: (maxLng + minLng) / 2,
    zoom,
    bearing: 0,
    pitch: 0,
  };
}

export function getGranteeByProject(project, grantees) {
  if (!project.fields.Grantee || !grantees) {
    return null;
  }

  return grantees.find((g) => g.id === project.fields.Grantee[0]);
}

export function getDocumentById(id, documents) {
  return documents.find((d) => d.id === id);
}

export function getProjectById(id, projects) {
  return projects.find((p) => p.id === id);
}

export function getAwardById(id, awards) {
  return awards.find((a) => a.id === id);
}

export function getAllocationById(id, allocations) {
  return allocations.find((a) => a.id === id);
}

export function getCategoryById(id, categories) {
  if (id === undefined) {
    return { fields: { Name: 'Uncategorized' } };
  }

  return categories.find((c) => c.id === id);
}

export function getParentCategoryByCategory(category, categories) {
  return category.fields['Parent Category']
    ? getCategoryById(category.fields['Parent Category'][0], categories)
    : category;
}

export function getSingleCategoryCard(filters, categories) {
  if (
    !categories ||
    !filters ||
    !filters.category ||
    filters.category.length !== 1
  ) {
    return;
  }

  const currentSingleCategory = categories.find(
    (c) => c.fields.Name === filters.category[0]
  );

  if (!currentSingleCategory) {
    return;
  }

  const currentSingleCategoryParent = getParentCategoryByCategory(
    currentSingleCategory,
    categories
  );

  return categoryCards.find(
    (c) => c.key === currentSingleCategoryParent.fields.Name
  );
}

export function isMobile(userAgent) {
  const mobileUserAgents = [/android/i, /webos/i, /iphone/i, /ipad/i, /ipod/i];

  return mobileUserAgents.some((mobileUserAgent) => {
    return userAgent.match(mobileUserAgent);
  });
}

export function findLatestYear(years) {
  return Math.max(...years.filter((year) => year !== undefined));
}
