import React from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import { sortBy } from 'lodash'

const ProjectsList = props => {
  const { results, projects } = props

  if (!results || !results.length) {
    return null
  }

  const projectIds = [...results.reduce((memo, item) => {
    if (item.fields.Project) {
      memo.add(item.fields.Project[0])
    }
    if (item.fields.Projects) {
      for (const projectId of item.fields.Projects) {
        memo.add(projectId)
      }
    }
    return memo;
  }, new Set())]

  const filteredProjects = sortBy(projectIds.map(projectId => {
    return projects.find(p => p.id === projectId)
  }), 'fields.Name')

  const renderProjectRow = project => {
    const renderProjectLink = () => {
      if (project.fields.URL) {
        return (
          <a href={project.fields.URL} target="_blank" key={project.id}>{project.fields.Name}</a>
        )
      } else {
        return (
          <span key={project.id}>{project.fields.Name}</span>
        )
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
                {filteredProjects.map(renderProjectRow)}
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
