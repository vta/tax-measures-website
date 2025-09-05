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
  auditedExpenditures,
}) => {
  if (
    allocations.length === 0 &&
    awards.length === 0 &&
    auditedExpenditures.length === 0
  ) {
    return 'None';
  }

  const groupedAllocations = groupBy(allocations, 'fields.Available Start');

  const groupedAwards = groupBy(awards, (award) => {
    const fiscalYear = getFiscalYear(award.fields.Date);
    return fiscalYear ? fiscalYear.toString() : undefined;
  });

  const groupedAuditedExpenditures = groupBy(
    auditedExpenditures,
    (auditedExpenditure) => {
      return auditedExpenditure.fields['Audited Fiscal Year'];
    },
  );

  const years = uniq([
    ...Object.keys(groupedAllocations),
    ...Object.keys(groupedAwards),
    ...Object.keys(groupedAuditedExpenditures),
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
      <Table
        responsive
        style={{ maxWidth: '800px', marginBottom: '0' }}
        striped
      >
        <thead>
          <tr>
            <th>Fiscal Year</th>
            <th className="text-end">Allocations</th>
            <th className="text-end">Awards</th>
            <th className="text-end">Audited Expenditures</th>
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

            const projectYearAuditedExpenditures = groupedAuditedExpenditures[
              fiscalYear.toString()
            ]
              ? sumBy(
                  groupedAuditedExpenditures[fiscalYear.toString()],
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
                  {formatCurrency(projectYearAuditedExpenditures)}
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
              {formatCurrency(sumBy(auditedExpenditures, 'fields.Amount'))}
            </th>
          </tr>
        </tfoot>
      </Table>

      <div className="mb-2">
        <small>Discrepancies may occur due to the use of rounding.</small>
      </div>

      <ProjectDownloadButton
        project={project}
        allocations={allocations}
        awards={awards}
        auditedExpenditures={auditedExpenditures}
      />
    </div>
  );
};
