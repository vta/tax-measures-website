import React, { useState } from 'react'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { compact, flatMap, sortBy, sumBy, uniq } from 'lodash'
import { getDocumentById, getGranteeByProject } from '../lib/util'
import { formatCategory, formatCurrency, formatProjectUrl } from '../lib/formatters'
import DocumentLink from './document-link'
import PrintButton from './print-button'
import ShareButton from './share-button'
import ProjectMap from './project-map'
import ProjectsTable from './projects-table'

const ProjectModal = ({
  selectedProjects,
  data: {
    allocations,
    awards,
    documents,
    grantees,
    payments,
    faqs,
  },
  geojsons,
  onHide,
  show,
  setProjectModalProjects
}) => {
  const [mapVisible, setMapVisible] = useState(false)

  if (!selectedProjects || selectedProjects.length === 0) {
    return null
  }

  const project = selectedProjects[0]
  const handleHide = () => {
    setMapVisible(false)
    onHide()
  }

  const projectAllocations = project.fields.Allocations ? allocations.filter(a => project.fields.Allocations.includes(a.id)) : []
  const projectAwards = project.fields.Awards ? awards.filter(a => project.fields.Awards.includes(a.id)) : []
  const projectDocumentIds = compact(uniq([
    ...(project.fields.Documents || []),
    ...flatMap(projectAwards, 'fields.Documents')
  ]))
  const projectDocuments = projectDocumentIds.map(id => getDocumentById(id, documents))
  const projectGrantee = getGranteeByProject(project, grantees)
  const projectPayments = project.fields.Payments ? payments.filter(p => project.fields.Payments.includes(p.id)) : []

  const renderAllocations = () => {
    if (projectAllocations.length === 0) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className="small-table">
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
        {projectAllocations.length > 1 && <tfoot>
          <tr>
              <th scope="row">Total</th>
              <th>{formatCurrency(sumBy(projectAllocations, 'fields.Amount'))}</th>
              <th></th>
          </tr>
        </tfoot>}
      </Table>
    )
  }

  const renderAwards = () => {
    if (projectAwards.length === 0) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className="small-table">
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
        {projectAwards.length > 1 && <tfoot>
          <tr>
              <th scope="row">Total</th>
              <th>{formatCurrency(sumBy(projectAwards, 'fields.Award Amount'))}</th>
              <th></th>
          </tr>
        </tfoot>}
      </Table>
    )
  }

  const renderPayments = () => {
    if (projectPayments.length === 0) {
      return 'None'
    }

    return (
      <Table responsive size="sm" className="small-table">
        <thead>
          <tr>
            <th style={{ width: '33.3%' }}>Date</th>
            <th style={{ width: '33.3%' }}>Amount</th>
            <th style={{ width: '33.3%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {projectPayments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.fields.Date}</td>
              <td>{formatCurrency(payment.fields.Amount)}</td>
              <td>{payment.fields['Payment Description']}</td>
            </tr>
          ))}
        </tbody>
        {projectPayments.length > 1 && <tfoot>
          <tr>
              <th scope="row">Total</th>
              <th>{formatCurrency(sumBy(projectPayments, 'fields.Amount'))}</th>
              <th></th>
          </tr>
        </tfoot>}
      </Table>
    )
  }

  const renderDocuments = () => {
    if (projectDocuments.length === 0) {
      return 'None'
    }

    return (
      <ListGroup className="small-list-group">
        {projectDocuments.map(document => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }

  const renderModalBody = () => {
    if (selectedProjects.length === 1) {
      const projectUrl = formatProjectUrl(project, projectGrantee)
      return (
        <>
          <div className="row">
            <div className="col-md-6">
              {project.fields.Notes && <div className="project-stat">
                {project.fields.Notes}
              </div>}
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
              {projectUrl && <div className="project-stat">
                <a href={projectUrl} target="_blank">Project Website <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" /></a>
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
              {mapVisible && <ProjectMap
                project={project}
                geojsons={geojsons}
                grantees={grantees}
              />}
            </div>
          </div>
          <div className="project-stat">
            <b>Allocations:</b>{' '}
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
          <small className="float-right mt-2">Last Modified: {moment(project.fields['Last Modified']).format('MMMM Do YYYY, h:mm a')}</small>
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
    }

    const sortedProjects = sortBy(selectedProjects, project => {
      // Show countywide projects last
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
        faqs={faqs}
        showButtons={false}
      />
    )
  }

  const renderModalTitle = () => {
    if (selectedProjects.length === 1) {
      return (
        <Modal.Title id="contained-modal-title-vcenter">
          <img src="/images/logo.png" alt="2016 Measure B" className="logo d-none d-print-block mb-3" />
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
      <Modal.Header>
        {renderModalTitle()}
      </Modal.Header>
      <Modal.Body>
        {renderModalBody()}
      </Modal.Body>
      <Modal.Footer className="d-print-none">
        <ShareButton className="btn btn-green mr-2" />
        <PrintButton className="btn btn-green mr-2" />
        <Button onClick={handleHide} className="btn-secondary">Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProjectModal
