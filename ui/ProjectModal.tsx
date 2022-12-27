import { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { SlideDown } from 'react-slidedown';
import { compact, flatMap, sortBy, sumBy, uniq } from 'lodash';
import { getDocumentById, getGranteeByProject } from '#/lib/util.js';
import { formatCurrency, formatProjectUrl } from '#/lib/formatters.js';
import { DocumentLink } from '#/ui/DocumentLink';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';
import { ProjectMap } from '#/ui/ProjectMap';
import { ProjectsTable } from '#/ui/ProjectsTable';

const Documents = ({ documents }) => {
  const [slidedownOpen, setSlidedownOpen] = useState(false);
  if (documents.length === 0) {
    return 'None';
  }

  const sortedDocuments = sortBy(documents, 'createdTime').reverse();

  return (
    <>
      <ListGroup className="small-list-group">
        {sortedDocuments.slice(0, 2).map((document) => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
        {sortedDocuments.length > 2 && (
          <SlideDown className={'my-dropdown-slidedown'}>
            {slidedownOpen
              ? sortedDocuments.slice(2).map((document) => (
                  <ListGroup.Item key={document.id}>
                    <DocumentLink document={document} />
                  </ListGroup.Item>
                ))
              : null}
          </SlideDown>
        )}
      </ListGroup>
      {sortedDocuments.length > 2 && (
        <button
          onClick={() => setSlidedownOpen(!slidedownOpen)}
          className="btn btn-primary btn-sm mt-2"
        >
          {slidedownOpen ? (
            <>
              <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
              Show Fewer
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
              Show More
            </>
          )}
        </button>
      )}
    </>
  );
};

export const ProjectModal = ({
  selectedProjects,
  data: {
    allocations,
    awards,
    documents,
    grantees,
    expenditures,
    faqs,
    geojsons,
  },
  onHide,
  show,
  setProjectModalProjects,
}) => {
  const [mapVisible, setMapVisible] = useState(false);

  if (!selectedProjects || selectedProjects.length === 0) {
    return null;
  }

  const project = selectedProjects[0];
  const handleHide = () => {
    setMapVisible(false);
    onHide();
  };

  const projectAllocations = project.fields.Allocations
    ? allocations.filter((a) => project.fields.Allocations.includes(a.id))
    : [];
  const projectAwards = project.fields.Awards
    ? awards.filter((a) => project.fields.Awards.includes(a.id))
    : [];
  const projectDocumentIds = compact(
    uniq([
      ...(project.fields.Documents || []),
      ...flatMap(projectAwards, 'fields.Documents'),
    ])
  );
  const projectDocuments = projectDocumentIds.map((id) =>
    getDocumentById(id, documents)
  );
  const projectGrantee = getGranteeByProject(project, grantees);
  const projectExpenditures = project.fields.Expenditures
    ? expenditures.filter((p) => project.fields.Expenditures.includes(p.id))
    : [];

  const renderAllocations = () => {
    if (projectAllocations.length === 0) {
      return 'None';
    }

    return (
      <Table responsive size="sm" className="small-table">
        <thead>
          <tr>
            <th style={{ width: '33.3%' }}>Fiscal Year</th>
            <th style={{ width: '33.3%' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {projectAllocations.map((allocation) => (
            <tr key={allocation.id}>
              <td>{allocation.fields['Available Start']}</td>
              <td>{formatCurrency(allocation.fields.Amount)}</td>
            </tr>
          ))}
        </tbody>
        {projectAllocations.length > 1 && (
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <th>
                {formatCurrency(sumBy(projectAllocations, 'fields.Amount'))}
              </th>
            </tr>
          </tfoot>
        )}
      </Table>
    );
  };

  const renderAwards = () => {
    if (projectAwards.length === 0) {
      return 'None';
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
          {projectAwards.map((award) => (
            <tr key={award.id}>
              <td>{award.fields.Date}</td>
              <td>{formatCurrency(award.fields['Award Amount'])}</td>
            </tr>
          ))}
        </tbody>
        {projectAwards.length > 1 && (
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <th>
                {formatCurrency(sumBy(projectAwards, 'fields.Award Amount'))}
              </th>
              <th></th>
            </tr>
          </tfoot>
        )}
      </Table>
    );
  };

  const renderExpenditures = () => {
    if (projectExpenditures.length === 0) {
      return 'None';
    }

    return (
      <Table responsive size="sm" className="small-table">
        <thead>
          <tr>
            <th style={{ width: '33.3%' }}>Fiscal Year</th>
            <th style={{ width: '33.3%' }}>Amount</th>
            <th style={{ width: '33.3%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {projectExpenditures.map((expenditure) => (
            <tr key={expenditure.id}>
              <td>{expenditure.fields['Fiscal Year']}</td>
              <td>{formatCurrency(expenditure.fields.Amount)}</td>
              <td>{expenditure.fields['Expenditure Description']}</td>
            </tr>
          ))}
        </tbody>
        {projectExpenditures.length > 1 && (
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <th>
                {formatCurrency(sumBy(projectExpenditures, 'fields.Amount'))}
              </th>
              <th></th>
            </tr>
          </tfoot>
        )}
      </Table>
    );
  };

  const renderModalBody = () => {
    if (selectedProjects.length === 1) {
      const projectUrl = formatProjectUrl(project, projectGrantee);
      return (
        <>
          <div className="row">
            <div className="col-md-6">
              {project.fields.Description && (
                <div className="project-stat">{project.fields.Description}</div>
              )}

              {project.fields.SubcategoryName ? (
                <>
                  <div className="project-stat">
                    <b>Category:</b> {project.fields.ParentCategoryName}
                  </div>
                  <div className="project-stat">
                    <b>Subcategory:</b> {project.fields.SubcategoryName}
                  </div>
                </>
              ) : (
                <div className="project-stat">
                  <b>Category:</b> {project.fields.CategoryName}
                </div>
              )}
              {project.fields['Fiscal Year'] && (
                <div className="project-stat">
                  <b>Fiscal Year:</b> {project.fields['Fiscal Year']}
                </div>
              )}
              {projectUrl && (
                <div className="project-stat">
                  <a href={projectUrl} target="_blank" rel="noreferrer">
                    Project Website{' '}
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                  </a>
                </div>
              )}
              <div className="project-stat">
                <b>Grantee:</b>{' '}
                {projectGrantee.fields.URL ? (
                  <a href={projectGrantee.fields.URL}>
                    {projectGrantee.fields.Name}{' '}
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                  </a>
                ) : (
                  projectGrantee.fields.Name
                )}
              </div>
            </div>
            <div className="col-md-6">
              {mapVisible && geojsons && (
                <ProjectMap
                  project={project}
                  geojsons={geojsons}
                  grantees={grantees}
                />
              )}
            </div>
          </div>
          <div className="project-stat">
            <b>Allocations:</b> {renderAllocations()}
          </div>
          <div className="project-stat">
            <b>Awards:</b> {renderAwards()}
          </div>
          <div className="project-stat">
            <b>Expenditures:</b> {renderExpenditures()}
          </div>
          <div className="project-stat">
            <b>Related Documents:</b> <Documents documents={projectDocuments} />
          </div>
          <small className="float-right mt-2">
            Last Modified:{' '}
            {moment(project.fields['Last Modified']).format(
              'MMMM Do YYYY, h:mm a'
            )}
          </small>
          <style jsx>{`
            .table-small td {
              font-size: 12px;
            }

            .project-stat {
              margin-top: 6px;
            }
          `}</style>
        </>
      );
    }

    const sortedProjects = sortBy(selectedProjects, (project) => {
      // Show countywide projects last
      if (project.fields.hasProjectGeometry) {
        return 0;
      }

      const grantee = getGranteeByProject(project, grantees);

      if (
        grantee &&
        (grantee.fields.Name === 'VTA' ||
          grantee.fields.Name === 'Santa Clara County')
      ) {
        return 1;
      }

      return 0;
    });

    return (
      <ProjectsTable
        selectedProjects={sortedProjects}
        setProjectModalProjects={setProjectModalProjects}
        faqs={faqs}
        showButtons={false}
      />
    );
  };

  const renderModalTitle = () => {
    if (selectedProjects.length === 1) {
      return (
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="d-none d-print-block">
            <Image
              src="/images/logo.png"
              alt="2016 Measure B"
              className="logo"
              width="100"
              height="100"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
          {project.fields.Name}
        </Modal.Title>
      );
    }

    return null;
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onEntering={() => setMapVisible(true)}
      onHide={handleHide}
    >
      <Modal.Header>{renderModalTitle()}</Modal.Header>
      <Modal.Body>{renderModalBody()}</Modal.Body>
      <Modal.Footer className="d-print-none">
        <ShareButton className="btn btn-green mr-2" />
        <PrintButton className="btn btn-green mr-2" />
        <Button onClick={handleHide} className="btn-secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
