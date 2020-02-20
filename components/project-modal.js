import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { sortBy } from 'lodash'
import { getGranteeByProject } from '../lib/util'
import { formatCategory, formatCurrency } from '../lib/formatters'
import ProjectMap from './project-map'
import ProjectsTable from './projects-table'

const DocumentLink = ({ document }) => {
  if (document.fields.URL) {
    return (
      <a href={document.fields.URL} target="_blank">
        {document.fields.Name} <FontAwesomeIcon icon={faFileDownload} size="xs" />
      </a>
    )
  } else if (document.fields.Attachment && document.fields.Attachment.length === 1) {
    return (
      <a href={document.fields.Attachment[0].url} target="_blank">
        {document.fields.Name} <FontAwesomeIcon icon={faFileDownload} size="xs" />
      </a>
    )
  } else if (document.fields.Attachment) {
    return document.fields.Attachment.map((attachment, index) => (
      <a href={attachment.url} target="_blank" key={index} className="mr-4">
        {index === 0 ? document.fields.Name : attachment.filename} <FontAwesomeIcon icon={faFileDownload} size="xs" />  
      </a>
    ))
  } else {
    return document.fields.Name
  }
}

const ProjectModal = ({
  selectedProjects,
  allocations,
  awards,
  documents,
  grantees,
  payments,
  onHide,
  show,
  setProjectModalProjects
}) => {
  const [mapVisible, setMapVisible] = useState(false)

  if (!selectedProjects || !selectedProjects.length) {
    return null
  }

  const project = selectedProjects[0]
  const handleHide = () => {
    setMapVisible(false)
    onHide()
  }

  const projectAllocations = project.fields.Allocations ? allocations.filter(a => project.fields.Allocations.includes(a.id)) : []
  const projectAwards = project.fields.Awards ? awards.filter(a => project.fields.Awards.includes(a.id)) : []
  const projectDocuments = project.fields.Documents ? documents.filter(d => project.fields.Documents.includes(d.id)) : []
  const projectGrantee = getGranteeByProject(project, grantees)
  const projectPayments = project.fields.Payments ? payments.filter(p => project.fields.Payments.includes(p.id)) : []

  const renderAllocations = () => {
    if (!projectAllocations.length) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className='small-table'>
        <thead>
          <tr>
            <th style={{ width: '33.3%' }}>Date</th>
            <th style={{ width: '33.3%' }}>Amount</th>
            <th style={{ width: '33.3%' }}>Availability</th>
          </tr>
        </thead>
        <tbody>
          {projectAllocations.map(allocation => (
            <tr key={allocation.id}>
              <td>{allocation.fields['Date Allocated']}</td>
              <td>{formatCurrency(allocation.fields.Amount)}</td>
              <td>{allocation.fields['Available Start']}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  const renderAwards = () => {
    if (!projectAwards.length) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className='small-table'>
        <thead>
          <tr>
            <th style={{ width: '33.3%' }}>Date</th>
            <th style={{ width: '66.6%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {projectAwards.map(award => (
            <tr key={award.id}>
              <td>{award.fields.Date}</td>
              <td>{formatCurrency(award.fields['Award Amount'])}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  const renderDocuments = () => {
    if (!projectDocuments.length) {
      return 'None'
    }

    return (
      <ListGroup className='small-list-group'>
        {projectDocuments.map(document => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }

  const renderPayments = () => {
    if (!projectPayments.length) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className='small-table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {projectPayments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.fields.Date}</td>
              <td>{formatCurrency(payment.fields.Amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  const renderModalBody = () => {
    if (selectedProjects.length === 1) {
      return (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="project-stat">
                <b>Category:</b>{' '}
                {formatCategory(project)}
              </div>
              {project.fields.Subcategory.id && <div className="project-stat">
                <b>Subcategory:</b>{' '}
                {project.fields.Subcategory.fields.Name}
              </div>}
              {project.fields['Fiscal Year'] && <div className="project-stat">
                <b>Fiscal Year:</b>{' '}
                {project.fields['Fiscal Year']}
              </div>}
              {project.fields.URL && <div className="project-stat">
                <a href={project.fields.URL} target="_blank">Project Website <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
              </div>}
              <div className="project-stat">  
                <b>Grantee:</b>{' '}
                {projectGrantee.fields.URL ? 
                  <a href={projectGrantee.fields.URL}>
                    {projectGrantee.fields.Name} <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                  </a> :
                  projectGrantee.fields.Name
                }
              </div>
            </div>
            <div className="col-md-6">
              {mapVisible && <ProjectMap project={project} grantees={grantees} />}
            </div>
          </div>
          <div className="project-stat">
            <b>{project.isPhantomProject && "Category "}Allocations:</b>{' '}
            {renderAllocations()}
          </div>
          <div className="project-stat">
            <b>Awards:</b>{' '}
            {renderAwards()}
          </div>
          <div className="project-stat">
            <b>Payments:</b>{' '}
            {renderPayments()}
          </div>
          <div className="project-stat">
            <b>Related Documents:</b>{' '}
            {renderDocuments()}
          </div>
          <small className="float-right">Last Modified: {project.fields['Last Modified']}</small>
          <style jsx>{`
            .table-small td {
              font-size: 12px;
            }

            .project-stat {
              margin-top: 6px;
            }
          `}</style>
        </>
      )
    } else {
      const sortedProjects = sortBy(selectedProjects, project => {
        // show countywide projects last
        if (project.fields.hasProjectGeometry) {
          return 0
        }

        const grantee = getGranteeByProject(project, grantees)

        if (grantee && (grantee.fields.Name === 'VTA' || grantee.fields.Name === 'Santa Clara County')) {
          return 1
        }

        return 0
      })

      return (
        <ProjectsTable
          selectedProjects={sortedProjects}
          setProjectModalProjects={setProjectModalProjects}
        />
      )
    }
  }

  const renderModalTitle = () => {
    if (selectedProjects.length === 1) {
      return (
        <Modal.Title id="contained-modal-title-vcenter">
          {project.fields.Name}
        </Modal.Title>
      )
    }
    
    return null
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onEntering={() => setMapVisible(true)}
      onHide={handleHide}
    >
      <Modal.Header closeButton>
        {renderModalTitle()}
      </Modal.Header>
      <Modal.Body>
        {renderModalBody()}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide} className='btn-secondary'>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectModal
