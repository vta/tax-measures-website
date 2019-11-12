import { sortBy, sumBy } from 'lodash'

export function applyFilters(filters, allocations, payments, projects, categories, grantees) {
  let results = {
    items: [],
    projects: []
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
        if (!item.fields.Category.length) {
          return false
        }

        return item.fields.Category[0] === category.id
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

  // After applying filters, find all relevant projects
  const projectIds = [...results.items.reduce((memo, item) => {
    if (item.fields.Project) {
      memo.add(item.fields.Project[0])
    }
    if (item.fields.Projects) {
      for (const projectId of item.fields.Projects) {
        memo.add(projectId)
      }
    }
    return memo;
  }, new Set())]

  results.projects = sortBy(projectIds.map(projectId => {
    return projects.find(p => p.id === projectId)
  }), 'fields.Name')

  return results
}

export function preprocessData(data) {
  for (const project of data.projects) {
    // Get category name for each project
    if (project.fields.Category) {
      const category = data.categories.find(c => c.id === project.fields.Category[0])
      project.fields['Category Name'] = category.fields.Name
    }

    // Get total payments for each project
    project.fields.totalPaymentAmount = sumBy(data.payments.filter(payment => {
      if (!payment.fields.Project) {
        return false
      }

      return payment.fields.Project[0] === project.id
    }), 'fields.Amount')

    // Get total allocations for each project
    project.fields.totalAllocationAmount = sumBy(data.allocations.filter(payment => {
      if (!payment.fields.Projects) {
        return false
      }

      return payment.fields.Projects.includes(project.id)
    }), 'fields.Amount')
  }

  for (const allocation of data.allocations) {
    // Get category name for each allocation
    if (!allocation.fields.Category) {
      allocation.fields.Category = ['unallocated']
      allocation.fields['Category Name'] = 'Unallocated'
    }

    const category = data.categories.find(c => c.id === allocation.fields.Category[0])
    allocation.fields['Category Name'] = category.fields.Name

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

  for (const payment of data.payments) {
    const project = data.projects.find(p => p.id === payment.fields.Project[0])

    // Get category name for each payment
    const category = data.categories.find(c => c.id === project.fields.Category[0])
    payment.fields.Category = [category.id]
    payment.fields['Category Name'] = category.fields.Name

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
