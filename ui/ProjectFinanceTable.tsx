'use client';

import Table from 'react-bootstrap/Table';
import moment from 'moment';
import { groupBy, sumBy, uniq, range } from 'lodash';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

import { formatCurrency } from '#/lib/formatters.js';
import { getFiscalYear, getLastModified } from '#/lib/util.js';
import { DocumentsList } from '#/ui/DocumentsList';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';
import { event } from '#/lib/gtag.js';

export const ProjectFinanceTable = ({
  project,
  allocations,
  awards,
  expenditures,
  documents,
}) => {
  if (
    allocations.length === 0 &&
    awards.length === 0 &&
    expenditures.length === 0
  ) {
    return 'None';
  }

  const groupedAllocations = groupBy(allocations, 'fields.Available Start');

  const groupedAwards = groupBy(awards, (award) => {
    const fiscalYear = getFiscalYear(award.fields.Date);
    return fiscalYear ? fiscalYear.toString() : undefined;
  });

  const groupedExpenditures = groupBy(expenditures, 'fields.Fiscal Year');

  const years = uniq([
    ...Object.keys(groupedAllocations),
    ...Object.keys(groupedAwards),
    ...Object.keys(groupedExpenditures),
  ]);

  const minYear = Math.min(...years.map(Number).filter((i) => !isNaN(i)));
  const maxYear = Math.max(...years.map(Number).filter((i) => !isNaN(i)));

  const fiscalYears = range(maxYear, minYear - 1, -1);

  if (years.includes('undefined')) {
    fiscalYears.push('undefined');
  }

  const csvData = [
    ['Fiscal Year', 'Allocations', 'Awards', 'Expenditures'],
    ...fiscalYears.map((fiscalYear) => [
      fiscalYear === 'undefined' ? '' : fiscalYear,
      formatCurrency(
        sumBy(groupedAllocations[fiscalYear.toString()], 'fields.Amount'),
      ),
      formatCurrency(
        sumBy(groupedAwards[fiscalYear.toString()], 'fields.Award Amount'),
      ),
      formatCurrency(
        sumBy(groupedExpenditures[fiscalYear.toString()], 'fields.Amount'),
      ),
    ]),
  ];

  return (
    <>
      <Table responsive style={{ maxWidth: '800px' }} striped>
        <thead>
          <tr>
            <th>Fiscal Year</th>
            <th className="text-end">Allocations</th>
            <th className="text-end">Awards</th>
            <th className="text-end">Expenditures</th>
          </tr>
        </thead>
        <tbody>
          {fiscalYears.map((fiscalYear) => (
            <tr key={fiscalYear}>
              <td>{fiscalYear === 'undefined' ? '' : fiscalYear}</td>
              <td className="text-end">
                {groupedAllocations[fiscalYear.toString()]
                  ? formatCurrency(
                      sumBy(
                        groupedAllocations[fiscalYear.toString()],
                        'fields.Amount',
                      ),
                    )
                  : ''}
              </td>
              <td className="text-end">
                {groupedAwards[fiscalYear.toString()]
                  ? formatCurrency(
                      sumBy(
                        groupedAwards[fiscalYear.toString()],
                        'fields.Award Amount',
                      ),
                    )
                  : ''}
              </td>
              <td className="text-end">
                {groupedExpenditures[fiscalYear.toString()]
                  ? formatCurrency(
                      sumBy(
                        groupedExpenditures[fiscalYear.toString()],
                        'fields.Amount',
                      ),
                    )
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <th className="text-end">
              {formatCurrency(sumBy(allocations, 'fields.Amount'))}
            </th>
            <th className="text-end">
              {formatCurrency(sumBy(awards, 'fields.Award Amount'))}
            </th>
            <th className="text-end">
              {formatCurrency(sumBy(expenditures, 'fields.Amount'))}
            </th>
          </tr>
        </tfoot>
      </Table>

      <div className="project-stat">
        <b>Related Documents:</b> <DocumentsList documents={documents} />
      </div>
      <div className="py-2">
        <small>
          Last Modified:{' '}
          {moment(
            getLastModified([
              project,
              ...allocations,
              ...awards,
              ...expenditures,
            ]),
          ).format('MMMM Do YYYY, h:mm a')}
        </small>
      </div>
      <div className="d-print-none">
        <div className="d-flex mt-3">
          <ShareButton className="btn btn-green me-2" />
          <PrintButton className="btn btn-green me-2" />
          <CSVLink
            data={csvData}
            filename={`${project.fields.Name.toLowerCase().replace(/\s+/g, '-')}.csv`}
            className="btn btn-green"
            onClick={() =>
              event({
                action: 'click',
                category: 'download',
                label: 'csv',
                value: `${project.fields.Name.toLowerCase().replace(/\s+/g, '-')}.csv`,
              })
            }
          >
            <FontAwesomeIcon icon={faFileCsv} className="me-2" /> Download CSV
          </CSVLink>
        </div>
      </div>
    </>
  );
};
