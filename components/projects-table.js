import React, { useState } from 'react'
import Table from 'react-bootstrap/Table'
import { some, orderBy } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv"
import { formatCurrencyWithUnit } from '../lib/util'

const ProjectsTable = ({
  selectedProjects,
  setProjectModalProjects,
  showCSVDownloadLink,
  showTotalRow
}) => {
  if (!selectedProjects || !selectedProjects.length) {
    return null
  }

  const [sortOrder, setSortOrder] = useState()
  const [sortDirection, setSortDirection] = useState('asc')

  const hasSubcategoryColumn = some(selectedProjects, project => !!project.fields.Subcategory.id)

  const setTableSort = (columnName) =>{
    if (sortOrder === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortOrder(columnName)
      setSortDirection('asc')
    }
  }

  const renderProjectRow = project => {
    return (
      <tr key={project.id}>
        <td className="text-right">{project.fields['Fiscal Year']}</td>
        <td>
          <a
            href=""
            onClick={e => {
              e.preventDefault()
              setProjectModalProjects([project])
            }}
          >
            {project.fields.Name}
          </a>
        </td>
        <td>{project.fields['Grantee Name']}</td>
        <td>{project.fields['Parent Category'].fields.Name}</td>
        {hasSubcategoryColumn && <td>{project.fields.Subcategory.fields.Name}</td>}
        <td className="text-right">
          {formatCurrencyWithUnit(project.fields.totalAllocationAmount)}
        </td>
        <td className="text-right">
          {formatCurrencyWithUnit(project.fields.totalAwardAmount)}
        </td>
        <td className="text-right">
          {formatCurrencyWithUnit(project.fields.totalPaymentAmount)}
        </td>
      </tr>
    )
  }

  const csvData = [
    ["Project", "Category", "Subcategory", "URL", "Total Allocations", "Total Awards", "Total Payments"],
    ...selectedProjects.map(project => {
      return [
        project.fields.Name,
        project.fields.Category.fields.Name,
        project.fields.Subcategory.fields.Name,
        project.fields.URL,
        project.fields.totalAllocationAmount,
        project.fields.totalAwardAmount,
        project.fields.totalPaymentAmount
      ]
    })
  ]

  const totals = selectedProjects.reduce((memo, project) => {
    memo.totalAllocationAmount += project.fields.totalAllocationAmount
    memo.totalAwardAmount += project.fields.totalAwardAmount
    memo.totalPaymentAmount += project.fields.totalPaymentAmount
    return memo
  }, { totalAllocationAmount: 0, totalAwardAmount: 0, totalPaymentAmount: 0 })

  let projects = selectedProjects

  if (sortOrder) {
    if (sortOrder === 'fiscal_year') {
      projects = orderBy(selectedProjects, (project) => {
        return project.fields['Fiscal Year'] || 0
      }, sortDirection)
    } else if (sortOrder === 'project_name') {
      projects = orderBy(selectedProjects, 'fields.Name', sortDirection)
    } else if (sortOrder === 'grantee') {
      projects = orderBy(selectedProjects, 'fields.Grantee Name', sortDirection)
    } else if (sortOrder === 'category') {
      projects = orderBy(selectedProjects, 'fields.Parent Category.fields.Name', sortDirection)
    } else if (sortOrder === 'subcategory') {
      projects = orderBy(selectedProjects, 'fields.Subcategory.fields.Name', sortDirection)
    } else if (sortOrder === 'allocations') {
      projects = orderBy(selectedProjects, 'fields.totalAllocationAmount', sortDirection)
    } else if (sortOrder === 'awards') {
      projects = orderBy(selectedProjects, 'fields.totalAwardAmount', sortDirection)
    } else if (sortOrder === 'payments') {
      projects = orderBy(selectedProjects, 'fields.totalPaymentAmount', sortDirection)
    }
  }

  const renderColumnHeader = (columnName, columnId) => {
    let icon = faSort
    if (columnId === sortOrder) {
      icon = sortDirection === 'asc' ? faSortUp : faSortDown
    }

    return (
      <th>
        <a
          className="d-flex justify-content-between align-items-center"
          onClick={() => setTableSort(columnId)}
          title={`Sort by ${columnName}`}
        >
          <span>{columnName}</span>
          <FontAwesomeIcon icon={icon} />
        </a>
        <style jsx>{`
          th {
            cursor: pointer;
          }
        `}</style>
      </th>
    )
  }

  return (
    <>
      <Table responsive size="sm" className='project-table'>
        <thead>
          <tr>
            {renderColumnHeader('Fiscal Year', 'fiscal_year')}
            {renderColumnHeader('Project Name', 'project_name')}
            {renderColumnHeader('Grantee', 'grantee')}
            {renderColumnHeader('Category', 'category')}
            {hasSubcategoryColumn && renderColumnHeader('Subcategory', 'subcategory')}
            {renderColumnHeader('Allocations', 'allocations')}
            {renderColumnHeader('Awards', 'awards')}
            {renderColumnHeader('Payments', 'payments')}
          </tr>
        </thead>
        <tbody>
          {projects.map(renderProjectRow)}
          {showTotalRow && <tr className="table-dark border-top-2">
            <td></td>
            <td>Total</td>
            <td></td>
            <td></td>
            {hasSubcategoryColumn && <td></td>}
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalAllocationAmount)}
            </td>
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalAwardAmount)}
            </td>
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalPaymentAmount)}
            </td>
          </tr>}
        </tbody>
      </Table>
      {showCSVDownloadLink && <CSVLink
        data={csvData}
        filename={"vta-tax-measures.csv"}
        className="btn btn-primary btn-white-border float-right"
      >
        <FontAwesomeIcon icon={faFileCsv} className='mr-2' /> Download CSV
      </CSVLink>}
    </>
  )
}

export default ProjectsTable
