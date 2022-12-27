'use client';

import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronUp,
  faChevronDown,
  faExternalLinkAlt,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { SlideDown } from 'react-slidedown';
import { compact, flatMap, sortBy, sumBy, uniq } from 'lodash';
import { getDocumentById, getGranteeByProject } from '#/lib/util.js';
import { formatCurrency, formatProjectUrl } from '#/lib/formatters.js';
import { DocumentLink } from '#/ui/DocumentLink';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';
import { ProjectMap } from '#/ui/ProjectMap';

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

export const ProjectPage = ({
  project,
  data: { allocations, awards, documents, grantees, expenditures, geojsons },
}) => {
  if (!project) {
    return null;
  }

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

  const projectUrl = formatProjectUrl(project, projectGrantee);

  return (
    <div className="container">
      <Link href="/" className="btn btn-primary mt-4">
        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> All Projects
      </Link>

      <div className="card my-4">
        <div className="card-body">
          <h1>{project.fields.Name}</h1>
          <div>
            <div className="row">
              <div className="col-md-6">
                {project.fields.Description && (
                  <div className="project-stat">
                    {project.fields.Description}
                  </div>
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
              <div className="col-md-6 mb-3">
                {geojsons && (
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
              <b>Related Documents:</b>{' '}
              <Documents documents={projectDocuments} />
            </div>
            <div className="py-2">
              <small>
                Last Modified:{' '}
                {moment(project.fields['Last Modified']).format(
                  'MMMM Do YYYY, h:mm a'
                )}
              </small>
            </div>
          </div>
          <div className="d-print-none">
            <div className="d-flex mt-3">
              <ShareButton className="btn btn-green mr-2" />
              <PrintButton className="btn btn-green mr-2" />
            </div>
          </div>
        </div>
        <style jsx>{`
          .table-small td {
            font-size: 12px;
          }

          .project-stat {
            margin-top: 6px;
          }
        `}</style>
      </div>
    </div>
  );
};
