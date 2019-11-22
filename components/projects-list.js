import React from 'react'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv"
import { formatCurrencyWithUnit, formatSubcategory } from '../lib/util'

const ProjectsList = ({ results, setProjectModalProject }) => {
  if (!results || !results.projects || !results.projects.length) {
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
              setProjectModalProject(project)
            }}
          >
            {project.fields.Name}
          </a>
        </td>
        <td>{project.fields['Parent Category'].fields.Name}</td>
        <td>{formatSubcategory(project)}</td>
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
    ["Project", "Category", "Subcategory", "URL", "Total Awards", "Total Payments"],
    ...results.projects.map(project => {
      return [
        project.fields.Name,
        project.fields.Category.fields.Name,
        formatSubcategory(project),
        project.fields.URL,
        project.fields.totalAwardAmount,
        project.fields.totalPaymentAmount
      ]
    })
  ]

  const totals = results.projects.reduce((memo, project) => {
    memo.totalAwardAmount += project.fields.totalAwardAmount
    memo.totalPaymentAmount += project.fields.totalPaymentAmount
    return memo
  }, { totalAwardAmount: 0, totalPaymentAmount: 0 })

  return (
    <div className='row'>
      <div className='col'>
        <div className='card bg-blue text-white mb-3'>
          <div className='card-body'>
            <h3>Projects List</h3>
            <p>Below is a list of the projects correlated with the filter settings above</p>
            <Table responsive size="sm" className='project-table'>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Awards</th>
                  <th>Payments</th>
                </tr>
              </thead>
              <tbody>
                {results.projects.map(renderProjectRow)}
                <tr className="table-dark border-top-2">
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td className="text-right">
                    {formatCurrencyWithUnit(totals.totalAwardAmount)}
                  </td>
                  <td className="text-right">
                    {formatCurrencyWithUnit(totals.totalPaymentAmount)}
                  </td>
                </tr>
              </tbody>
            </Table>
            <CSVLink
              data={csvData}
              filename={"vta-tax-measures.csv"}
              className="btn btn-primary btn-white-border float-right"
            >
              <FontAwesomeIcon icon={faFileCsv} className='mr-2' /> Download CSV
            </CSVLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsList
