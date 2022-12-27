import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import moment from 'moment';
import ListGroup from 'react-bootstrap/ListGroup';
import { sumBy } from 'lodash';
import { DocumentLink } from '#/ui/DocumentLink';
import { formatCurrencyMillions } from '#/lib/formatters.js';
import { getCurrentFiscalYear, findLatestYear } from '#/lib/util.js';

export const CategoryInfo = ({ data, categoryCard }) => {
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
    }
  );

  const renderDocuments = () => {
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

  const renderAdminDocuments = () => {
    if (categoryCard.key !== 'Administration') {
      return null;
    }

    const annualReports = data.documents.filter(
      (document) =>
        document.fields['Document Type'] === 'Administration Annual Report'
    );
    const auditReports = data.documents.filter(
      (document) =>
        document.fields['Document Type'] === 'Administration Audit Report'
    );

    return (
      <>
        <h4 className="mt-4">Annual Reports</h4>
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
        <h4 className="mt-4">Audit Reports</h4>
        <p>
          The Performance Audit Report is conducted by an independent auditor to
          verify VTA compliance with 2016 Measure B, which requires that Program
          Tax Revenues be allocated and used for the nine approved program
          categories, as defined in ballot language.
        </p>
        <ListGroup className="small-list-group">
          {auditReports.map((document) => (
            <ListGroup.Item key={document.id}>
              <DocumentLink document={document} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
  };

  return (
    <div className="row mb-3">
      <div className="col-lg-6 offset-lg-3">
        <div className="card h-100">
          <div className="card-body d-sm-flex">
            <div className="mr-3 flex-shrink-0">
              <Image
                src={`/images/programs/${categoryCard.image}`}
                alt={categoryCard.key}
                width="150"
                height="150"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
            <div>
              <h3>{categoryCard.key}</h3>
              <ReactMarkdown linkTarget="_blank" remarkPlugins={[breaks]}>
                {categoryCard.description}
              </ReactMarkdown>
              <div>
                Program Category Total Allocation through{' '}
                {moment(
                  findLatestYear(
                    allocationsThroughTwoYearsIntoTheFuture.map((r) =>
                      Number.parseInt(r.fields['Available Start'], 10)
                    )
                  ),
                  'YYYY'
                )
                  .date('30')
                  .month('Junes')
                  .format('MMM D, YYYY')}
                :
                <div className="font-weight-bold d-inline-block pl-2 pb-2">
                  {formatCurrencyMillions(
                    sumBy(
                      allocationsThroughTwoYearsIntoTheFuture,
                      'fields.Amount'
                    )
                  )}
                  m
                </div>
              </div>
              <ReactMarkdown linkTarget="_blank" remarkPlugins={[breaks]}>
                {categoryCard.description2}
              </ReactMarkdown>
              {renderDocuments()}
              {renderAdminDocuments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
