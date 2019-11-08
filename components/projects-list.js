import React from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'

const ProjectsList = props => {
  if (!props.results || !props.results.projects) {
    return null
  }

  const renderProjectRow = project => {
    const renderProjectLink = () => {
      if (project.fields.URL) {
        return (
          <a href={project.fields.URL} target="_blank">{project.fields.Name}</a>
        )
      } else {
        return project.fields.Name
      }
    }

    return (
      <tr key={project.id}>
        <td>
          {renderProjectLink()}
        </td>
        <td>{project.fields['Category Name']}</td>
      </tr>
    )
  }

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
                </tr>
              </thead>
              <tbody>
                {props.results.projects.map(renderProjectRow)}
              </tbody>
            </Table>
            <Button className="btn-primary btn-white-border float-right">
              <FontAwesomeIcon icon={faFileCsv} className='mr-2' /> Download CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsList
