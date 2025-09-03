'use client';

import Table from 'react-bootstrap/Table';
import { groupBy, sumBy, uniq, range } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';
import { getFiscalYear } from '#/lib/util.js';
import { ProjectDownloadButton } from '#/ui/ProjectDownloadButton';

export const ProjectFinanceTable = ({
  project,
  allocations,
  awards,
  expenditures,
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

  if (
    minYear === -Infinity ||
    minYear === Infinity ||
    maxYear === Infinity ||
    maxYear === -Infinity
  ) {
    return 'None';
  }

  const fiscalYears = range(minYear, maxYear + 1);

  if (years.includes('undefined')) {
    fiscalYears.push('undefined');
  }

  return (
    <div className="mb-4">
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
          {fiscalYears.map((fiscalYear) => {
            const projectYearAllocations = groupedAllocations[
              fiscalYear.toString()
            ]
              ? sumBy(
                  groupedAllocations[fiscalYear.toString()],
                  'fields.Amount',
                )
              : '';

            const projectYearAwards = groupedAwards[fiscalYear.toString()]
              ? sumBy(
                  groupedAwards[fiscalYear.toString()],
                  'fields.Award Amount',
                )
              : '';

            const projectYearExpenditures = groupedExpenditures[
              fiscalYear.toString()
            ]
              ? sumBy(
                  groupedExpenditures[fiscalYear.toString()],
                  'fields.Amount',
                )
              : '';

            return (
              <tr key={fiscalYear}>
                <td>{fiscalYear === 'undefined' ? '' : fiscalYear}</td>
                <td className="text-end">
                  {formatCurrency(projectYearAllocations)}
                </td>
                <td className="text-end">
                  {formatCurrency(projectYearAwards)}
                </td>
                <td className="text-end">
                  {formatCurrency(projectYearExpenditures)}
                </td>
              </tr>
            );
          })}
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

      <ProjectDownloadButton
        project={project}
        allocations={allocations}
        awards={awards}
        expenditures={expenditures}
      />
    </div>
  );
};
