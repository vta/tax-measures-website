import React from 'react'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv"
import { formatCurrencyWithUnit, formatSubcategory } from '../lib/util'

const ProjectsTable = ({
  selectedProjects,
  setProjectModalProjects,
  showCSVDownloadLink,
  showTotalRow
}) => {
  if (!selectedProjects || !selectedProjects.length) {
    return null
  }

  const renderProjectRow = project => {
    return (
      <tr key={project.id}>
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
        <td>{project.fields['Parent Category'].fields.Name}</td>
        <td>{formatSubcategory(project)}</td>
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
        formatSubcategory(project),
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

  return (
    <>
      <Table responsive size="sm" className='project-table'>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Allocations</th>
            <th>Awards</th>
            <th>Payments</th>
          </tr>
        </thead>
        <tbody>
          {selectedProjects.map(renderProjectRow)}
          {showTotalRow && <tr className="table-dark border-top-2">
            <td>Total</td>
            <td></td>
            <td></td>
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
