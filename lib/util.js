import { cloneDeep, sortBy, sumBy } from 'lodash'
import moment from 'moment'
import querystring from 'querystring'

export function updateUrlWithFilters(filters) {
  if (!filters) {
    window.history.replaceState({}, '', '?')
    return
  }

  const {
    transactionType,
    grantee,
    project,
    category,
    startDate,
    endDate
  } = filters

  const filtersForUrl = {
    transactionType,
    grantee,
    project,
    category,
    startDate: startDate ? moment(startDate).format('YYYY-M-D') : undefined,
    endDate: endDate ? moment(endDate).format('YYYY-M-D'): undefined
  }

  window.history.replaceState({}, '', `?${querystring.stringify(filtersForUrl)}`)
}

export function applyFilters(filters, allocations, payments, projects, categories, grantees) {
  let results = {
    items: [],
    projects: [],
    filters
  }
  if (filters.transactionType === 'allocation') {
    results.transactionType = 'allocation'
    results.items.push(...allocations)
  } else if (filters.transactionType === 'payment') {
    results.transactionType = 'payment'
    results.items.push(...payments)
  }

  // Apply category filter
  if (filters.category) {
    const category = categories.find(c => c.fields.Name === filters.category)
    if (category) {
      results.items = results.items.filter(item => {
        if (!item.fields.Category) {
          return false
        } else if (item.fields.Category.fields.id === category.id) {
          return true
        } else if (item.fields['Parent Category'].id === category.id) {
          return true
        }

        return false
      })
    }
  }

  // Apply grantee filter
  if (filters.grantee) {
    const grantee = grantees.find(g => g.fields.Name === filters.grantee)
    if (grantee) {
      results.items = results.items.filter(item => {
        if (!item.fields.Grantees || !item.fields.Grantees.length) {
          return false
        }

        return item.fields.Grantees.includes(grantee.id)
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
        } else if (item.fields.Projects) {
          return item.fields.Projects.includes(project.id)
        } else {
          return false
        }
      })
    }
  }

  // Apply start date filter
  if (filters.startDate) {
    results.items = results.items.filter(item => {
      let itemDate
      if (results.transactionType === 'payment') {
        itemDate = item.fields.Date  
      } else if (results.transactionType === 'allocation') {
        itemDate = item.fields['Date Allocated']
      }

      if (!itemDate) {
        return false
      }

      return moment(filters.startDate).startOf('day').isSameOrBefore(itemDate)
    })
  }

  // Apply end date filter
  if (filters.endDate) {
    results.items = results.items.filter(item => {
      let itemDate
      if (results.transactionType === 'payment') {
        itemDate = item.fields.Date  
      } else if (results.transactionType === 'allocation') {
        itemDate = item.fields['Date Allocated']
      }

      if (!itemDate) {
        return false
      }

      return moment(filters.endDate).startOf('day').isSameOrAfter(itemDate)
    })
  }

  // After applying filters, find all relevant projects associated with the allocations or payments
  const projectIds = [...results.items.reduce((memo, item) => {
    if (item.fields.Project) {
      memo.add(item.fields.Project[0])
    }
    if (item.fields.Projects) {
      for (const projectId of item.fields.Projects) {
        memo.add(projectId)
      }
    }
    return memo
  }, new Set())]

  // filter associated projects
  results.projects = sortBy(projectIds.reduce((memo, projectId) => {
    const project = projects.find(p => p.id === projectId)
    let projectMatchesFilters = true

    if (filters.category) {
      if (project.fields.Category.fields.Name !== filters.category && project.fields['Parent Category'].fields.Name !== filters.category) {
        projectMatchesFilters = false
      }
    }

    if (filters.grantee) {
      if (project.fields['Grantee Name'] !== filters.grantee) {
        projectMatchesFilters = false
      }
    }

    if (filters.grantee) {
      if (project.fields['Grantee Name'] !== filters.grantee) {
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

export function preprocessData(data) {
  // Organize categories hierarchically
  data.parentCategories = data.categories.filter(c => !c.fields['Parent Category'])
  for (const category of data.categories) {
    if (category.fields['Parent Category']) {
      const parentCategory = data.parentCategories.find(c => c.id === category.fields['Parent Category'][0])
      if (!parentCategory.fields.children) {
        parentCategory.fields.children = []
      }
      parentCategory.fields.children.push(cloneDeep(category))
    }
  }
  
  for (const project of data.projects) {
    // Populate category and parent category for each project
    if (project.fields.Category) {
      const category = data.categories.find(c => c.id === project.fields.Category[0])
      const parentCategory = category.fields['Parent Category'] ? data.categories.find(c => c.id === category.fields['Parent Category'][0]) : category
      
      project.fields.Category = cloneDeep(category)
      project.fields['Parent Category'] = cloneDeep(parentCategory)
    }

    // Get grantee name for each project
    if (project.fields.Grantee) {
      const grantee = data.grantees.find(c => c.id === project.fields.Grantee[0])
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
    project.fields.totalAwardAmount = sumBy(data.awards.filter(award => {
      return award.fields.Project.includes(project.id)
    }), 'fields[\'Award Amount\']')
  }

  for (const allocation of data.allocations) {
    // Populate category for each allocation
    const category = data.categories.find(c => c.id === allocation.fields.Category[0])
    const parentCategory = category.fields['Parent Category'] ? data.categories.find(c => c.id === category.fields['Parent Category'][0]) : category
      
    allocation.fields.Category = cloneDeep(category)
    allocation.fields['Parent Category'] = cloneDeep(parentCategory)

    // Get a list of all grantees for each allocation
    if (allocation.fields.Projects) {
      allocation.fields.Grantees = [...allocation.fields.Projects.reduce((memo, projectId) => {
        const project = data.projects.find(p => p.id === projectId)

        if (project.fields.Grantee) {
          memo.add(project.fields.Grantee[0])
        }

        return memo
      }, new Set())]
    }
  }

  for (const award of data.awards) {
    const project = data.projects.find(p => p.id === award.fields.Project[0])

    // Populate category for each awards
    const category = data.categories.find(c => c.id === project.fields.Category.id)
    const parentCategory = category.fields['Parent Category'] ? data.categories.find(c => c.id === category.fields['Parent Category'][0]) : category
    
    award.fields.Category = cloneDeep(category)
    award.fields['Parent Category'] = cloneDeep(parentCategory)
  }

  for (const payment of data.payments) {
    const project = data.projects.find(p => p.id === payment.fields.Project[0])

    // Populate category for each payment
    const category = data.categories.find(c => c.id === project.fields.Category.id)
    const parentCategory = category.fields['Parent Category'] ? data.categories.find(c => c.id === category.fields['Parent Category'][0]) : category
    
    payment.fields.Category = cloneDeep(category)
    payment.fields['Parent Category'] = cloneDeep(parentCategory)

    // get a list of all grantees for each payment
    if (project.fields.Grantees) {
      payment.fields.Grantees = project.fields.Grantees
    }
  }

  return data
}

export function getInitialFiltersFromQuery(query) {
  return Object.fromEntries(
    Object.entries(query)
    .filter(([key]) => [
      'transactionType',
      'grantee',
      'project',
      'category',
      'startDate',
      'endDate'
    ].includes(key))
  )
}

export function formatCurrencyMillions(number) {
  return `$${Math.floor(number / 1000000)}`
}

export function formatSubcategory(item) {
  if (item.fields.Category.id === item.fields['Parent Category'].id) {
    return ''
  } else {
    return item.fields.Category.fields.Name
  }
}
