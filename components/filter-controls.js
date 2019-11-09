import React, { useState, useEffect } from 'react'
import querystring from 'querystring'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Typeahead } from 'react-bootstrap-typeahead'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { isEmpty } from 'lodash'

const FilterControls = props => {
  const { categories, grantees, projects, initialFilters } = props

  const [transactionType, setTransactionType] = useState(initialFilters.transactionType)
  const [grantee, setGrantee] = useState(initialFilters.grantee)
  const [project, setProject] = useState(initialFilters.project)
  const [category, setCategory] = useState(initialFilters.category)
  const [startDate, setStartDate] = useState(initialFilters.startDate)
  const [endDate, setEndDate] = useState(initialFilters.endDate)

  useEffect(() => {
    if (!isEmpty(initialFilters)) {
      validateFilters(initialFilters);
    }
  }, [])

  const validateFilters = () => {
    if (!transactionType) {
      return alert('You must specify a transaction type');
    }

    const filters = {
      transactionType,
      grantee,
      project,
      category,
      startDate,
      endDate
    }

    window.history.replaceState({}, "", `?${querystring.stringify(filters)}`)

    props.handleSearch(filters)
  }

  return (
    <div className='card bg-blue p-2'>
      <div className='row'>
        <div className='col-md-3 mb-2'>
          <Form.Control
            as="select"
            onChange={event => setTransactionType(event.target.value)}
            value={transactionType}
          >
            <option value="">Transaction type</option>
            <option value="payment">Payment</option>
            <option value="allocation">Allocation</option>
          </Form.Control>
        </div>
        <div className='col-md-3 mb-2'>
          <Form.Control
            as="select"
            onChange={event => setGrantee(event.target.value)}
            value={grantee}
          >
            <option value="">Grantee</option>
            {grantees && grantees.map(grantee => (
              <option key={grantee.id}>{grantee.fields.Name}</option>
            ))}
          </Form.Control>
        </div>
        <div className='col-md-6 mb-2'>
          <Typeahead
            options={projects ? projects.map(project => project.fields.Name) : []}
            placeholder="Project Name"
            onChange={selected => setProject(selected.length ? selected[0] : undefined)}
            id="project-name"
            defaultSelected={project ? [project]: undefined}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-md-3 mb-2 mb-md-0'>
          <Form.Control
            as="select"
            onChange={event => setCategory(event.target.value)}
            value={category}
          >
            <option value="">Category</option>
            {categories && categories.map(category => (
              <option key={category.id}>{category.fields.Name}</option>
            ))}
          </Form.Control>
        </div>
        <div className='col-md-3 mb-2 mb-md-0'>
          <DayPickerInput
            inputProps={{className: 'form-control', placeholder: 'Start Date'}}
          />
        </div>
        <div className='col-md-3 mb-2 mb-md-0'>
          <DayPickerInput
            inputProps={{className: 'form-control', placeholder: 'End Date'}}
          />
        </div>
        <div className='col-md-3'>
          <Button
            className="btn-secondary"
            onClick={validateFilters}
            block
          >
            <FontAwesomeIcon icon={faSearch} className='mr-2' /> Search
          </Button>
        </div>
      </div>
      <style jsx global>{`
          .DayPickerInput {
            width: 100%;
          }
        `}</style>
    </div>
  )
}

export default FilterControls
