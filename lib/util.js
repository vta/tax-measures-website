export function applyFilters(filters, allocations, payments, categories, grantees) {
  let results = []
  if (filters.transactionType === 'allocation') {
    results.push(...allocations)
  } else if (filters.transactionType === 'payment') {
    results.push(...payments)
  }

  if (filters.category) {
    const category = categories.find(c => c.fields.Name === filters.category)
    if (category) {
      results = results.filter(item => {
        if (!item.fields.Category.length) {
          return false
        }

        return item.fields.Category[0] === category.id
      })
    }
  }

  if (filters.grantee) {
    const grantee = grantees.find(g => g.fields.Name === filters.grantee)
    if (grantee) {
      results = results.filter(item => {
        if (!item.fields.Grantees || !item.fields.Grantees.length) {
          return false
        }

        return item.fields.Grantees.includes(grantee.id)
      })
    }
  }

  return results
}

export function preprocessData(data) {
  for (const project of data.projects) {
    if (project.fields.Category) {
      const category = data.categories.find(c => c.id === project.fields.Category[0])
      project.fields['Category Name'] = category.fields.Name
    }
  }

  for (const allocation of data.allocations) {
    if (!allocation.fields.Category) {
      allocation.fields.Category = ['unallocated']
      allocation.fields['Category Name'] = 'Unallocated'
    }

    const category = data.categories.find(c => c.id === allocation.fields.Category[0])
    allocation.fields['Category Name'] = category.fields.Name

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
    const category = data.categories.find(c => c.id === project.fields.Category[0])
    payment.fields.Category = [category.id]
    payment.fields['Category Name'] = category.fields.Name

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
