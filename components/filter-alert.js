import React from 'react'
import { useRouter } from 'next/router'
import Alert from 'react-bootstrap/Alert'
import { compact } from 'lodash'
import { trans } from '../lib/translations'

const FilterAlert = ({ results, currentFilters }) => {
  const router = useRouter()
  const { locale } = router

  const filterCount = currentFilters ? compact(Object.values(currentFilters)).length : 0
  if (!results) {
    return null
  }

  if (results.items.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>{trans('filteralert-no-results-title', locale)}</Alert.Heading>
        <div>{trans('filteralert-no-results-text', locale)}</div>
      </Alert>
    )
  }

  if (results.items.length < 5) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>{trans('filteralert-limited-results-title', locale)}</Alert.Heading>
        <div>{trans('filteralert-limited-results-text', locale)}</div>
      </Alert>
    )
  }

  if (filterCount < 2) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>{trans('filteralert-numerous-results-title', locale)}</Alert.Heading>
        <div>{trans('filteralert-numerous-results-text', locale)}</div>
      </Alert>
    )
  }

  return null
}

export default FilterAlert
