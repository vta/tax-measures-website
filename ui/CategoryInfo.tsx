import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import moment from 'moment';
import ListGroup from 'react-bootstrap/ListGroup';
import { compact, sumBy, uniq, flatMap } from 'lodash';
import { DocumentLink } from '#/ui/DocumentLink';
import { formatCurrencyMillions } from '#/lib/formatters.js';
import {
  getCurrentFiscalYear,
  findLatestYear,
  getDocumentById,
} from '#/lib/util.js';
import { ProjectFinanceTable } from '#/ui/ProjectFinanceTable';
import { ProjectLastModified } from '#/ui/ProjectLastModified';
import { ProjectShareButtons } from '#/ui/ProjectShareButtons';

export const CategoryInfo = ({ data, categoryCard, results }) => {
  if (!categoryCard) {
    return null;
  }

  const currentFiscalYear = getCurrentFiscalYear();
  const allocationsThroughTwoYearsIntoTheFuture = data.allocations.filter(
    (allocation) => {
      if (allocation.fields['Available Start']) {
        return (
          Number.parseInt(allocation.fields['Available Start'], 10) <=
            currentFiscalYear + 2 &&
          allocation.fields.ParentCategoryName === categoryCard.key
        );
      }

      return false;
    },
  );

  const renderDocuments = () => {
    if (categoryCard.key === 'Administration') {
      const annualReports = data.documents.filter(
        (document) =>
          document.fields['Document Type'] === 'Program Annual Report',
      );
      const auditReports = data.documents.filter(
        (document) =>
          document.fields['Document Type'] ===
          'Program Performance Audit Report',
      );

      const project = results.projects[0];

      const projectAllocations = project.fields.Allocations
        ? data.allocations.filter((a) =>
            project.fields.Allocations.includes(a.id),
          )
        : [];
      const projectAwards = project.fields.Awards
        ? data.awards.filter((a) => project.fields.Awards.includes(a.id))
        : [];
      const projectDocumentIds = compact(
        uniq([
          ...(project.fields.Documents || []),
          ...flatMap(projectAwards, 'fields.Documents'),
        ]),
      );
      const projectDocuments = projectDocumentIds.map((id) =>
        getDocumentById(id, data.documents),
      );
      const projectExpenditures = project.fields.Expenditures
        ? data.expenditures.filter((p) =>
            project.fields.Expenditures.includes(p.id),
          )
        : [];

      return (
        <>
          <ProjectFinanceTable
            allocations={projectAllocations}
            awards={projectAwards}
            expenditures={projectExpenditures}
          />
          <div className="mt-4 text-blue" style={{ fontSize: '1.25rem' }}>
            Annual Reports
          </div>
          <p>
            The Program Annual Report is developed by VTA staff and details the
            progress of the 2016 Measure B Program every year.
          </p>
          <ListGroup className="small-list-group">
            {annualReports.map((document) => (
              <ListGroup.Item key={document.id}>
                <DocumentLink document={document} />
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-4 text-blue" style={{ fontSize: '1.25rem' }}>
            Audit Reports
          </div>
          <p>
            The Performance Audit Report is conducted by an independent auditor
            to verify VTA compliance with 2016 Measure B, which requires that
            Program Tax Revenues be allocated and used for the nine approved
            program categories, as defined in ballot language.
          </p>
          <ListGroup className="small-list-group">
            {auditReports.map((document) => (
              <ListGroup.Item key={document.id}>
                <DocumentLink document={document} />
              </ListGroup.Item>
            ))}
          </ListGroup>

          <ProjectLastModified
            project={project}
            allocations={projectAllocations}
            awards={projectAwards}
            expenditures={projectExpenditures}
          />
          <ProjectShareButtons
            project={project}
            allocations={projectAllocations}
            awards={projectAwards}
            expenditures={projectExpenditures}
          />
        </>
      );
    }

    if (!categoryCard.documents || categoryCard.documents.length === 0) {
      return null;
    }

    return (
      <ListGroup className="small-list-group">
        {categoryCard.documents.map((document) => (
          <ListGroup.Item key={document.id}>
            <DocumentLink document={document} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <div className="row mb-3">
      <div className="col-lg-6 offset-lg-3">
        <div className="card h-100">
          <div className="card-body d-sm-flex">
            <div className="me-3 flex-shrink-0">
              <Image
                src={`/images/programs/${categoryCard.image}`}
                alt=""
                width="150"
                height="150"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
            <div>
              <h2>{categoryCard.key}</h2>
              <ReactMarkdown remarkPlugins={[breaks]}>
                {categoryCard.description}
              </ReactMarkdown>
              {allocationsThroughTwoYearsIntoTheFuture?.length > 0 && (
                <div>
                  Program Category Total Allocation through{' '}
                  {moment(
                    findLatestYear(
                      allocationsThroughTwoYearsIntoTheFuture.map((r) =>
                        Number.parseInt(r.fields['Available Start'], 10),
                      ),
                    ),
                    'YYYY',
                  )
                    .date(30)
                    .month('June')
                    .format('MMM D, YYYY')}
                  :
                  <div className="fw-bold d-inline-block ps-2 pb-2">
                    {formatCurrencyMillions(
                      sumBy(
                        allocationsThroughTwoYearsIntoTheFuture,
                        'fields.Amount',
                      ),
                    )}
                    m
                  </div>
                </div>
              )}
              <ReactMarkdown remarkPlugins={[breaks]}>
                {categoryCard.description2}
              </ReactMarkdown>
              {renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
