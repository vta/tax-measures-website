import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { capitalize, isEmpty } from 'lodash'

const FilterControls = ({
  categories,
  grantees,
  incomingFilters,
  handleSearch,
  clearSearch
}) => {
  const [transactionType, setTransactionType] = useState(incomingFilters.transactionType)
  const [grantee, setGrantee] = useState(incomingFilters.grantee)
  const [project, setProject] = useState(incomingFilters.project)
  const [category, setCategory] = useState(incomingFilters.category)

  useEffect(() => {
    setTransactionType(incomingFilters.transactionType || '')
    setGrantee(incomingFilters.grantee || '')
    setCategory(incomingFilters.category || '')
    setProject(incomingFilters.project)

    if (!isEmpty(incomingFilters)) {
      validateFilters(incomingFilters)
    }
  }, [incomingFilters])

  const validateFilters = filters => {
    if (!filters.transactionType) {
      return alert('You must specify a transaction type')
    }

    handleSearch(filters)
  }

  return (
    <div className="card bg-blue p-2 mb-3">
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
                label: 'Payment',
                value: 'payment'
              },
              {
                label: 'Award',
                value: 'award'
              }
            ]}
            placeholder="Select Transaction Type"
          />  
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Select 
            value={category && category.map(c => ({
              value: c,
              label: c
            }))}
            onChange={selectedOptions => {
              if (selectedOptions && selectedOptions.length) {
                setCategory(selectedOptions.map(c => c.label))
              } else {
                setCategory(undefined)
              }
            }}
            options={categories && categories.map(c => ({
              value: c.fields.Name,
              label: c.fields.Name
            }))}
            isMulti={true}
            placeholder="Filter by Category"
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Select 
            value={grantee && grantee.map(g => ({
              value: g,
              label: g
            }))}
            onChange={selectedOptions => {
              if (selectedOptions && selectedOptions.length) {
                setGrantee(selectedOptions.map(g => g.label))
              } else {
                setGrantee(undefined)
              }
            }}
            options={grantees && grantees.map(g => ({
              value: g.fields.Name,
              label: g.fields.Name
            }))}
            isMulti={true}
            placeholder="Filter by Grantee"
          />
        </div>
        <div className="col-lg-2 mb-2 mb-lg-0">
          <Form.Control
            type="text"
            onChange={event => setProject(event.target.value)}
            placeholder="Project Name"
            value={project}
            onKeyPress={event => {
              if (event.key === "Enter") {
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
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
          </Button>
        </div>
        <div className="col-lg-2 col-6">
          <Button
            variant="danger"
            onClick={clearSearch}
            block
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterControls
