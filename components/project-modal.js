import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { formatAwardAvailability, formatCurrency, formatDocumentLink } from '../lib/util'
import ProjectMap from './project-map'

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
  project,
  allocations,
  awards,
  documents,
  grantees,
  payments,
  onHide,
  show
}) => {
  const [mapVisible, setMapVisible] = useState(false)

  if (!project) {
    return null
  }

  const handleHide = () => {
    setMapVisible(false)
    onHide()
  }

  const projectAllocations = project.fields.Allocations ? allocations.filter(a => project.fields.Allocations.includes(a.id)) : []
  const projectAwards = project.fields.Awards ? awards.filter(a => project.fields.Awards.includes(a.id)) : []
  const projectDocuments = project.fields.Documents ? documents.filter(d => project.fields.Documents.includes(d.id)) : []
  const projectGrantee = grantees.find(g => g.id === project.fields.Grantee[0])
  const projectPayments = project.fields.Payments ? payments.filter(p => project.fields.Payments.includes(p.id)) : []

  const renderAllocations = () => {
    if (!projectAllocations.length) {
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
          {projectAllocations.map(allocation => (
            <tr key={allocation.id}>
              <td>{allocation.fields['Date Allocated']}</td>
              <td>{formatCurrency(allocation.fields.Amount)}</td>
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
            <th>Date</th>
            <th>Amount</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {projectAwards.map(award => (
            <tr key={award.id}>
              <td>{award.fields.Date}</td>
              <td>{formatCurrency(award.fields['Award Amount'])}</td>
              <td>{formatAwardAvailability(award)}</td>
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
        <Modal.Title id="contained-modal-title-vcenter">
          {project.fields.Name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <div className="project-stat">
              <b>Category:</b>{' '}
              {project.fields.Category.fields.Name}
            </div>
            <div className="project-stat">  
              <b>Grantee:</b>{' '}
              {projectGrantee.fields.URL ? 
                <a href={projectGrantee.fields.URL}>
                  {projectGrantee.fields.Name} <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                </a> :
                projectGrantee.fields.Name
              }
            </div>
            {project.fields.URL && <div className="project-stat">
              <a href={project.fields.URL} target="_blank">Project Website <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
            </div>}
          </div>
          <div className="col-md-6">
            {mapVisible && <ProjectMap project={project} />}
          </div>
        </div>
        <div className="project-stat">
          <b>Allocations:</b>{' '}
          {renderAllocations()}
        </div>
        <div className="project-stat">
          <b>Related Documents:</b>{' '}
          {renderDocuments()}
        </div>
        <div className="project-stat">
          <b>Awards:</b>{' '}
          {renderAwards()}
        </div>
        <div className="project-stat">
          <b>Payments:</b>{' '}
          {renderPayments()}
        </div>
        <small className="float-right">Last Modified: {project.fields['Last Modified']}</small>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleHide} className='btn-secondary'>Close</Button>
      </Modal.Footer>
      <style jsx>{`
        .table-small td {
          font-size: 12px;
        }

        .project-stat {
          margin-top: 6px;
        }
      `}</style>
    </Modal>
  )
}

export default ProjectModal
