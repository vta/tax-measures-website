'use client';

import Table from 'react-bootstrap/Table';
import { groupBy, sumBy, uniq, range } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';
import { getFiscalYear } from '#/lib/util.js';

export const ProjectFinanceTable = ({ allocations, awards, expenditures }) => {
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

  const groupedExpenditures = groupBy(expenditures, (expenditure) => {
    const fiscalYear = getFiscalYear(expenditure.fields.Date);
    return fiscalYear ? fiscalYear.toString() : undefined;
  });

  const years = uniq([
    ...Object.keys(groupedAllocations),
    ...Object.keys(groupedAwards),
    ...Object.keys(groupedExpenditures),
  ]);

  const minYear = Math.min(...years.map(Number).filter((i) => !isNaN(i)));
  const maxYear = Math.max(...years.map(Number).filter((i) => !isNaN(i)));

  const fiscalYears = range(minYear, maxYear + 1);

  if (years.includes('undefined')) {
    fiscalYears.push('undefined');
  }

  return (
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
  );
};
