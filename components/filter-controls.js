import React, { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Typeahead } from 'react-bootstrap-typeahead'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import Select from 'react-select'
import {
  formatDate,
  parseDate,
} from 'react-day-picker/moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { capitalize, isEmpty } from 'lodash'

const FilterControls = ({
  categories,
  grantees,
  projects,
  incomingFilters,
  handleSearch,
  clearSearch
}) => {
  const [transactionType, setTransactionType] = useState(incomingFilters.transactionType)
  const [grantee, setGrantee] = useState(incomingFilters.grantee)
  const [project, setProject] = useState(incomingFilters.project)
  const [category, setCategory] = useState(incomingFilters.category)
  const [startDate, setStartDate] = useState(incomingFilters.startDate)
  const [endDate, setEndDate] = useState(incomingFilters.endDate)

  const projectRef = useRef();
  const startDateRef = useRef();
  const endDateRef = useRef();

  useEffect(() => {
    setTransactionType(incomingFilters.transactionType || '')
    setGrantee(incomingFilters.grantee || '')
    setCategory(incomingFilters.category || '')

    if (!incomingFilters.project) {
      projectRef.current.getInstance().clear()
    } else {
      setProject(incomingFilters.project)
    }

    // Hack until react-day-picker v8 comes out 
    if (!incomingFilters.startDate) {
      startDateRef.current.setState({ value: '', typedValue: '' })
    } else {
      setStartDate(incomingFilters.startDate)
    }

    if (!incomingFilters.endDate) {
      endDateRef.current.setState({ value: '', typedValue: '' })
    } else {
      setEndDate(incomingFilters.endDate)
    }

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

  const parentCategories = categories.filter(c => !c.fields['Parent Category'])

  return (
    <div className='card bg-blue p-2 mb-3'>
      <div className='row'>
        <div className='col-md-3 mb-2'>
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
                label: 'Allocation',
                value: 'allocation'
              }
            ]}
            placeholder="Select Transaction Type"
          />  
        </div>
        <div className='col-md-3 mb-2'>
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
        <div className='col-md-6 mb-2'>
          <Typeahead
            ref={projectRef}
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
        <div className='col-md-3 mb-2 mb-md-0'>
          <DayPickerInput
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{className: 'form-control', placeholder: 'Start Date'}}
            onDayChange={selectedDay => setStartDate(selectedDay)}
            value={startDate ? formatDate(startDate) : startDate}
            ref={startDateRef}
          />
        </div>
        <div className='col-md-3 mb-2 mb-md-0'>
          <DayPickerInput
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{className: 'form-control', placeholder: 'End Date'}}
            onDayChange={selectedDay => setEndDate(selectedDay)}
            value={endDate ? formatDate(endDate) : endDate}
            ref={endDateRef}
          />
        </div>
        <div className='col-md-2'>
          <Button
            variant="secondary"
            onClick={() => validateFilters({
              transactionType,
              grantee,
              project,
              category,
              startDate,
              endDate
            })}
            block
          >
            <FontAwesomeIcon icon={faSearch} className='mr-2' /> Search
          </Button>
        </div>
        <div className='col-md-1'>
          <Button
            variant="danger"
            onClick={clearSearch}
            block
          >
            Clear
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
