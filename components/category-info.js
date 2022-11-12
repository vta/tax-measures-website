import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import moment from 'moment';
import ListGroup from 'react-bootstrap/ListGroup';
import { sumBy } from 'lodash';
import DocumentLink from './document-link.js';
import { formatCurrencyMillions } from '../lib/formatters.js';
import { getCurrentFiscalYear, findLatestYear } from '../lib/util.js';

const CategoryInfo = ({ data, categoryCard }) => {
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
              {renderDocuments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;
