'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExternalLinkAlt,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { compact, flatMap, kebabCase, uniq, sumBy } from 'lodash';

import { fetchData } from '#/lib/api.js';
import { getDocumentById, getGranteeByProject } from '#/lib/util.js';
import { ProjectFinanceTable } from '#/ui/ProjectFinanceTable';
import { DocumentsList } from '#/ui/DocumentsList';
import { ProjectMap } from '#/ui/ProjectMap';
import { ProjectLastModified } from './ProjectLastModified';
import { formatCurrency } from '#/lib/formatters';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';

export async function ProjectPage({ projectSlug }) {
  const {
    allocations,
    awards,
    documents,
    grantees,
    expenditures,
    auditedExpenditures,
    projects,
    geojsons,
    images,
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
  const projectAuditedExpenditures = project.fields.AuditedExpenditures
    ? auditedExpenditures.filter((p) =>
        project.fields.AuditedExpenditures.includes(p.id),
      )
    : [];

  return (
    <div className="container" style={{ maxWidth: '1140px' }}>
      <Link
        href={`/?grantee=&project=&category=${encodeURIComponent(project.fields.ParentCategoryName)}`}
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

                <div className="project-stat">
                  <b>Category:</b> {project.fields.CategoryName}
                </div>

                {project.fields.URL && (
                  <div className="project-stat">
                    <a
                      href={project.fields.URL}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                  <div className="border border-black px-2 mt-4 mb-4">
                    <table className="w-100">
                      <tbody>
                        <tr>
                          <td>
                            <b>Total Expenditures:</b>
                          </td>
                          <td className="text-end">
                            {formatCurrency(
                              sumBy(projectExpenditures, 'fields.Amount'),
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Total Audited Expenditures:</b>
                          </td>
                          <td className="text-end">
                            {formatCurrency(
                              sumBy(
                                projectAuditedExpenditures,
                                'fields.Amount',
                              ),
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>
                              Total Unaudited Expenditures<sup>*</sup>:
                            </b>
                          </td>
                          <td className="text-end">
                            {formatCurrency(
                              sumBy(projectExpenditures, 'fields.Amount') -
                                sumBy(
                                  projectAuditedExpenditures,
                                  'fields.Amount',
                                ),
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="lh-sm mt-2">
                      <small>
                        * Unaudited Expenditures become an Audited Expenditure
                        once accounting is fully completed.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                {geojsons && (
                  <ProjectMap
                    project={project}
                    geojsons={geojsons}
                    images={images}
                  />
                )}
              </div>
            </div>
            <ProjectFinanceTable
              project={project}
              allocations={projectAllocations}
              awards={projectAwards}
              auditedExpenditures={projectAuditedExpenditures}
            />
            <div className="project-stat">
              <b>Related Documents:</b>{' '}
              <DocumentsList documents={projectDocuments} />
            </div>
            <ProjectLastModified
              project={project}
              allocations={projectAllocations}
              awards={projectAwards}
              expenditures={projectExpenditures}
              auditedExpenditures={auditedExpenditures}
            />
            <div className="d-print-none">
              <div className="d-flex mt-3">
                <ShareButton className="btn btn-green me-2" />
                <PrintButton className="btn btn-green me-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
