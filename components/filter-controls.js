/*  global alert */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { capitalize, isEmpty } from 'lodash'

import { trans } from '../lib/translations'
import FaqTerm from './faq-term'

const FilterControls = ({
  data,
  incomingFilters,
  handleSearch,
  clearSearch
}) => {
  const router = useRouter()
  const { locale } = router
  const [transactionType, setTransactionType] = useState(incomingFilters.transactionType || 'award')
  const [grantee, setGrantee] = useState(incomingFilters.grantee || '')
  const [project, setProject] = useState(incomingFilters.project || '')
  const [category, setCategory] = useState(incomingFilters.category || '')

  useEffect(() => {
    setTransactionType(incomingFilters.transactionType || 'award')
    setGrantee(incomingFilters.grantee || '')
    setCategory(incomingFilters.category || '')
    setProject(incomingFilters.project || '')

    if (!isEmpty(incomingFilters)) {
      validateFilters(incomingFilters)
    }
  }, [incomingFilters])

  const validateFilters = filters => {
    if (!filters.transactionType) {
      /*  eslint-disable-next-line no-alert */
      return alert(trans('filter-invalid-filter-alert', locale))
    }

    handleSearch(filters)
  }

  return (
    <div className="card bg-blue p-2 mb-3">
      <div className="row mb-2 text-white">
        <div className="col-lg-2 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div className="number-list">1</div>
          <div><b>{trans('filter-transaction-type', locale)}</b></div>
        </div>
        <div className="col-lg-4 mb-2 mb-lg-0 d-flex align-items-center justify-content-start">
          <div className="number-list">2</div>
          <div>
            <b><FaqTerm id="1293896" term={trans('filter-program-categories', locale)} faqs={data.faqs} placement="auto" showTerm /> {trans('filter-or', locale)} <FaqTerm id="1293956" term={trans('label-grantees', locale)} faqs={data.faqs} placement="auto" showTerm /></b> ({trans('filter-optional', locale)})
          </div>
        </div>
        <div className="col-lg-3 d-flex align-items-center justify-content-start">
          <div className="number-list">3</div>
          <div><b>{trans('filter-project', locale)}</b> ({trans('filter-optional', locale)})</div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Select
            value={transactionType && [{
              value: transactionType,
              label: capitalize(transactionType)
            }]}
            onChange={selectedOption => setTransactionType(selectedOption.value)}
            options={[
              {
                label: trans('expenditure', locale),
                value: 'expenditure'
              },
              {
                label: trans('award', locale),
                value: 'award'
              }
            ]}
            placeholder={trans('filter-transaction-type-placeholder', locale)}
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Select
            value={category && category.map(c => ({
              value: c,
              label: c
            }))}
            onChange={selectedOptions => {
              if (selectedOptions && selectedOptions.length > 0) {
                setCategory(selectedOptions.map(c => c.label))
              } else {
                setCategory(undefined)
              }
            }}
            options={data && data.categories && data.categories.map(c => ({
              value: c.fields.Name,
              label: c.fields.Name
            }))}
            isMulti={true}
            placeholder={trans('filter-category-placeholder', locale)}
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Select
            value={grantee && grantee.map(g => ({
              value: g,
              label: g
            }))}
            onChange={selectedOptions => {
              if (selectedOptions && selectedOptions.length > 0) {
                setGrantee(selectedOptions.map(g => g.label))
              } else {
                setGrantee(undefined)
              }
            }}
            options={data && data.grantees && data.grantees.map(g => ({
              value: g.fields.Name,
              label: g.fields.Name
            }))}
            isMulti={true}
            placeholder={trans('filter-grantee-placeholder', locale)}
            disabled={!data}
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Form.Control
            type="text"
            onChange={event => setProject(event.target.value)}
            placeholder={trans('filter-project-placeholder', locale)}
            value={project}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                validateFilters({
                  transactionType,
                  grantee,
                  project,
                  category
                })
              }
            }}
          />
        </div>
        <div className="col-lg-2 col-6 mb-2 mb-lg-0">
          <Button
            variant="secondary"
            onClick={() => validateFilters({
              transactionType,
              grantee,
              project,
              category
            })}
            block
            disabled={!data}
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" /> {trans('search', locale)}
          </Button>
        </div>
        <div className="col-lg-2 col-6">
          <Button
            variant="danger"
            onClick={clearSearch}
            block
            disabled={!data}
          >
            {trans('clear', locale)}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterControls
