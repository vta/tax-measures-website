export function preprocessData(data) {
  data.projects.forEach(project => {
    if (!project.fields.Category || !project.fields.Category.length) {
      return
    }

    const category =  data.categories.find(c => c.id === project.fields.Category[0])
    project.fields['Category Name'] = category.fields.Name
  })

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
