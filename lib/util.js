import { cloneDeep, pick, sortBy, sumBy, uniq } from 'lodash'
import fetch from 'isomorphic-unfetch'
import moment from 'moment'
import querystring from 'querystring'
import bbox from '@turf/bbox'

export function updateUrlWithFilters(filters) {
  if (!filters) {
    window.history.replaceState({}, '', '?')
    return
  }

  const {
    transactionType,
    grantee,
    project,
    category
  } = filters

  const filtersForUrl = {
    transactionType,
    grantee,
    project,
    category
  }

  window.history.replaceState({}, '', `?${querystring.stringify(filtersForUrl)}`)
}

export function getInitialFiltersFromUrlQuery(query) {
  const initialFilters = pick(query, [
    'transactionType',
    'grantee',
    'project',
    'category'
  ])

  if (initialFilters.grantee !== '' && typeof initialFilters.grantee === 'string') {
    initialFilters.grantee = [initialFilters.grantee]
  }

  if (initialFilters.category !== '' && typeof initialFilters.category === 'string') {
    initialFilters.category = [initialFilters.category]
  }

  return initialFilters
}

export function applyFilters(filters, awards, payments, projects, categories, grantees) {
  let results = {
    items: [],
    projects: [],
    filters
  }
  if (filters.transactionType === 'award') {
    results.transactionType = 'award'
    results.items.push(...awards)
  } else if (filters.transactionType === 'payment') {
    results.transactionType = 'payment'
    results.items.push(...payments)
  }

  // Apply category filter
  if (filters.category) {
    const filteredCategoryIds = categories.filter(c => filters.category.includes(c.fields.Name)).map(c => c.id)
    if (filteredCategoryIds) {
      results.items = results.items.filter(item => {
        if (!item.fields.Category) {
          return false
        }

        return filteredCategoryIds.includes(item.fields.Category.id) || filteredCategoryIds.includes(item.fields['Parent Category'].id)
      })
    }
  }

  // Apply grantee filter
  if (filters.grantee) {
    const filteredGranteeIds = grantees.filter(g => filters.grantee.includes(g.fields.Name)).map(g => g.id)
    if (filteredGranteeIds) {
      results.items = results.items.filter(item => {
        if (!item.fields.Grantee) {
          return false
        }
        return filteredGranteeIds.includes(item.fields.Grantee[0])
      })
    }
  }

  // Apply project filter
  if (filters.project) {
    const project = projects.find(p => p.fields.Name === filters.project)
    if (project) {
      results.items = results.items.filter(item => {
        if (item.fields.Project) {
          return item.fields.Project[0] === project.id
        } else {
          return false
        }
      })
    }
  }

  // After applying filters, find all relevant projects associated with the awards or payments
  const projectIds = uniq(results.items.map(item => item.fields.Project[0]))

  // filter associated projects
  results.projects = sortBy(projectIds.reduce((memo, projectId) => {
    const project = projects.find(p => p.id === projectId)
    let projectMatchesFilters = true

    if (!project) {
      projectMatchesFilters = false
    }

    if (filters.category) {
      if (!filters.category.includes(project.fields.Category.fields.Name) && !filters.category.includes(project.fields['Parent Category'].fields.Name)) {
        projectMatchesFilters = false
      }
    }

    if (filters.grantee) {
      if (!filters.grantee.includes(project.fields['Grantee Name'])) {
        projectMatchesFilters = false
      }
    }

    if (filters.project) {
      if (project.fields.Name !== filters.project) {
        projectMatchesFilters = false
      }
    }

    if (projectMatchesFilters) {
      memo.push(project)
    }

    return memo
  }, []), 'fields.Name')

  updateUrlWithFilters(filters)

  return results
}

function addProjectData(item, projectId, data) {
  const project = getProjectById(projectId, data.projects)

  if (!project) {
    item.fields.category = { fields: { Name: 'Uncategorized' } };
    item.fields['Parent Category'] = { fields: { Name: 'Uncategorized' } };
  } else {
    // Populate category for each item
    const category = getCategoryById(project.fields.Category.id, data.categories)
    const parentCategory = getParentCategoryByCategory(category, data.categories)
    
    item.fields.Category = cloneDeep(category)
    item.fields['Parent Category'] = cloneDeep(parentCategory)

    // get a list of all grantees for each item
    if (project.fields.Grantee) {
      item.fields.Grantee = project.fields.Grantee
    }
  }
}

export async function preprocessData(data) {
  // Organize categories hierarchically
  data.parentCategories = data.categories.filter(c => !c.fields['Parent Category'])
  
  for (const project of data.projects) {
    // Populate category and parent category for each project
    if (project.fields.Category) {
      const category = getCategoryById(project.fields.Category[0], data.categories)
      const parentCategory = getParentCategoryByCategory(category, data.categories)
      
      project.fields.Category = cloneDeep(category)
      project.fields['Parent Category'] = cloneDeep(parentCategory)
    } else {
      project.fields.Category = { fields: { Name: 'Uncategorized' } }
      project.fields['Parent Category'] = { fields: { Name: 'Uncategorized' } }
    }

    // Get grantee name for each project
    if (project.fields.Grantee) {
      const grantee = getGranteeByProject(project, data.grantees)
      project.fields['Grantee Name'] = grantee.fields.Name
    }

    // Get total payments for each project
    project.fields.totalPaymentAmount = sumBy(data.payments.filter(payment => {
      if (!payment.fields.Project) {
        return false
      }

      return payment.fields.Project[0] === project.id
    }), 'fields.Amount')

    // Get total allocations for each project
    project.fields.totalAllocationAmount = sumBy(data.allocations.filter(allocation => {
      if (!allocation.fields.Projects) {
        return false
      }

      return allocation.fields.Projects.includes(project.id)
    }), 'fields.Amount')

    // Get total awards for each project  
    project.fields.totalAwardAmount = sumBy(
      data.awards.filter(award => award.fields.Project[0] === project.id),
      'fields[\'Award Amount\']'
    )
  }

  for (const allocation of data.allocations) {
    // Populate category for each allocation
    const category = getCategoryById(allocation.fields.Category[0], data.categories)
    const parentCategory =  getParentCategoryByCategory(category, data.categories)
      
    allocation.fields.Category = cloneDeep(category)
    allocation.fields['Parent Category'] = cloneDeep(parentCategory)

    // Get a list of all grantees for each allocation
    if (allocation.fields.Projects) {
      allocation.fields.Grantees = [...allocation.fields.Projects.reduce((memo, projectId) => {
        const project = getProjectById(projectId, data.projects)

        if (project && project.fields && project.fields.Grantee) {
          memo.add(project.fields.Grantee[0])
        }

        return memo
      }, new Set())]
    }
  }

  for (const award of data.awards) {
    addProjectData(award, award.fields.Project[0], data)
  }

  for (const payment of data.payments) {
    addProjectData(payment, payment.fields.Project[0], data)
  }

  // Fetch geojson for projects
  await Promise.all(data.projects.filter(p => p.fields.geojson).map(async project => {
    try {
      const response = await fetch(project.fields.geojson[0].url)
    
      if (response.ok) {
        const geojson = await response.json()
        const layerBbox = bbox(geojson)

        if (!isValidBbox(layerBbox)) {
          throw new Error('geojson outside of bbox')
        }

        project.fields.geometry = geojson
        project.fields.bbox = layerBbox
        project.fields.hasProjectGeometry = true
      }
    } catch (err) {
      console.warn(`Invalid geometry for project "${project.fields.Name}"`)
      console.warn(project.fields.geojson[0])
      console.warn(err)
    }
  }))

  // Process Latitude Longitude fields
  data.projects.filter(p => p.fields.Latitude || p.fields.Longitude).map(async project => {
    const geojson = {
      type: 'Feature',
      properties: {
        projectId: project.id
      },
      geometry: {
        type: 'Point',
        coordinates: [
          project.fields.Longitude,
          project.fields.Latitude
        ]
      }
    }

    project.fields.geometry = geojson
    project.fields.bbox = bbox(geojson)
    project.fields.hasProjectGeometry = true
  })

  // Fetch geojson for grantees
  await Promise.all(data.grantees.filter(g => g.fields.geojson).map(async grantee => {
    try {
      const response = await fetch(grantee.fields.geojson[0].url)
    
      if (response.ok) {
        const geojson = await response.json()
        const layerBbox = bbox(geojson)

        if (!isValidBbox(layerBbox)) {
          throw new Error('geojson outside of bbox')
        }

        grantee.fields.geometry = geojson
        grantee.fields.bbox = layerBbox
      }
    } catch (err) {
      console.warn(`Invalid geometry for grantee "${grantee.fields.Name}"`)
      console.warn(grantee.fields.geojson[0])
      console.warn(err)
    }
  }))  

  return data
}

export function formatCurrency(number) {
  return `$${Number(number).toLocaleString()}`
}

export function formatCurrencyMillions(number) {
  return `$${Math.floor(number / 1000000)}`
}

export function formatCurrencyWithUnit(number) {
  if (number === 0) {
    return '$0'
  } else if (number < 1000000) {
    return `$${Math.floor(number / 1000)}k`
  } else {
    return `$${Math.floor(number / 1000000)}m`
  }
}

export function formatSubcategory(item) {
  if (!item.fields['Parent Category'].id || item.fields.Category.id === item.fields['Parent Category'].id) {
    return ''
  } else {
    return item.fields.Category.fields.Name
  }
}

export function formatAwardAvailability(award) {
  if (!award.fields['Available Start'] && !award.fields['Available End']) {
    return ''
  } else if (!award.fields['Available End']) {
    return `starting ${award.fields['Available Start']}`
  } else if (!award.fields['Available Start']) {
    return `through ${award.fields['Available End']}`
  } else {
    return `${award.fields['Available Start']} - ${award.fields['Available End']}`
  }
}

export function isValidBbox(bbox) {
  if (bbox[0] > 180 || bbox[0] < -180) {
    return false
  } else if (bbox[1] > 90 || bbox[1] < -90) {
    return false
  } else if (bbox[2] > 180 || bbox[2] < -180) {
    return false
  } else if (bbox[3] > 90 || bbox[3] < -90) {
    return false
  }

  return true
}

export function mergeBboxes(bboxes) {
  return bboxes.reduce((memo, bbox) => {
    memo[0] = Math.min(memo[0], bbox[0])
    memo[1] = Math.min(memo[1], bbox[1])
    memo[2] = Math.max(memo[2], bbox[2])
    memo[3] = Math.max(memo[3], bbox[3])
    return memo
  }, [180, 90, -180, -90])
}

export function getViewport(bbox) {
  const [minLng, minLat, maxLng, maxLat] = bbox

  const lngDelta = maxLng - minLng
  const latDelta = maxLat - minLat
  const degreeDelta = Math.max(lngDelta, latDelta)

  let zoom = 7
  if (degreeDelta > 0.8) {
    zoom = 7
  } else if (degreeDelta > 0.45) {
    zoom = 8
  } else if (degreeDelta > 0.4) {
    zoom = 9
  } else if (degreeDelta > 0.3) {
    zoom = 10
  } else if (degreeDelta > 0.1) {
    zoom = 11
  } else if (degreeDelta > 0.01) {
    zoom = 12
  } else {
    zoom = 13
  }

  return {
    latitude: (maxLat + minLat) / 2 ,
    longitude: (maxLng + minLng) / 2,
    zoom,
    bearing: 0,
    pitch: 0
  }
}

export function getGranteeByProject(project, grantees) {
  if (!project.fields.Grantee) {
    return null
  }

  return grantees.find(g => g.id === project.fields.Grantee[0])
}

export function getProjectById(id, projects) {
  return projects.find(p => p.id === id)
}

export function getCategoryById(id, categories) {
  if (id === undefined) {
    return { fields: { Name: 'Uncategorized' } }
  }
  return categories.find(c => c.id === id)
}

export function getParentCategoryByCategory(category, categories) {
  return category.fields['Parent Category'] ? getCategoryById(category.fields['Parent Category'][0], categories) : category
}
