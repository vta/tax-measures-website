'use server';

import Link from 'next/link';
import moment from 'moment';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { compact, flatMap, kebabCase, uniq } from 'lodash';

import { fetchData } from '#/lib/api.js';
import {
  getDocumentById,
  getGranteeByProject,
  getLastModified,
} from '#/lib/util.js';
import { formatProjectUrl } from '#/lib/formatters.js';
import { DocumentsList } from '#/ui/DocumentsList';
import { PrintButton } from '#/ui/PrintButton';
import { ProjectFinanceTable } from '#/ui/ProjectFinanceTable';
import { ShareButton } from '#/ui/ShareButton';
import { ProjectMap } from '#/ui/ProjectMap';

export async function ProjectPage({ projectSlug }) {
  const {
    allocations,
    awards,
    documents,
    grantees,
    expenditures,
    projects,
    geojsons,
  } = await fetchData();
  const project = projects.find(
    (project) => kebabCase(project?.fields.Name) === projectSlug,
  );

  if (!project) {
    return notFound();
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
    ]),
  );
  const projectDocuments = projectDocumentIds.map((id) =>
    getDocumentById(id, documents),
  );
  const projectGrantee = getGranteeByProject(project, grantees);
  const projectExpenditures = project.fields.Expenditures
    ? expenditures.filter((p) => project.fields.Expenditures.includes(p.id))
    : [];

  const projectUrl = formatProjectUrl(project, projectGrantee);

  return (
    <div className="container" style={{ maxWidth: '1140px' }}>
      <Link
        href={`/?transactionType=award&grantee=&project=&category=${encodeURIComponent(project.fields.ParentCategoryName)}`}
        className="btn btn-primary mt-4"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="me-2" /> All{' '}
        {project.fields.ParentCategoryName} Projects
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
                  {projectGrantee?.fields.URL ? (
                    <a href={projectGrantee.fields.URL}>
                      {projectGrantee.fields.Name}{' '}
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                    </a>
                  ) : (
                    (projectGrantee?.fields.Name ?? 'None')
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
            <ProjectFinanceTable
              allocations={projectAllocations}
              awards={projectAwards}
              expenditures={projectExpenditures}
            />
            <div className="project-stat">
              <b>Related Documents:</b>{' '}
              <DocumentsList documents={projectDocuments} />
            </div>
            <div className="py-2">
              <small>
                Last Modified:{' '}
                {moment(
                  getLastModified([
                    project,
                    ...projectAllocations,
                    ...projectAwards,
                    ...projectExpenditures,
                  ]),
                ).format('MMMM Do YYYY, h:mm a')}
              </small>
            </div>
          </div>
          <div className="d-print-none">
            <div className="d-flex mt-3">
              <ShareButton className="btn btn-green me-2" />
              <PrintButton className="btn btn-green me-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
