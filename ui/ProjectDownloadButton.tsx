'use client';

import { groupBy, sumBy, uniq, range } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

import { formatCurrency } from '#/lib/formatters.js';
import { getFiscalYear } from '#/lib/util.js';
import { event } from '#/lib/gtag.js';
import { downloadCsvFromMatrix } from '#/lib/download-csv.js';

export const ProjectDownloadButton = ({
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
    (expenditure) => {
      return expenditure.fields['Audited Fiscal Year'];
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

  const csvData = [
    ['Fiscal Year', 'Allocations', 'Awards', 'Audited Expenditures'],
    ...fiscalYears.map((fiscalYear) => [
      fiscalYear === 'undefined' ? '' : fiscalYear,
      Math.round(
        sumBy(groupedAllocations[fiscalYear.toString()], 'fields.Amount'),
      ),
      Math.round(
        sumBy(groupedAwards[fiscalYear.toString()], 'fields.Award Amount'),
      ),
      Math.round(
        sumBy(
          groupedAuditedExpenditures[fiscalYear.toString()],
          'fields.Amount',
        ),
      ),
    ]),
  ];

  return (
    <div className="d-print-none">
      <button
        type="button"
        className="btn btn-green"
        onClick={() => {
          const filename = `${project.fields.Name.toLowerCase().replace(/\s+/g, '-')}.csv`;
          event({
            action: 'click',
            category: 'download',
            label: 'csv',
            value: filename,
          });
          downloadCsvFromMatrix(csvData, filename);
        }}
      >
        <FontAwesomeIcon icon={faFileCsv} className="me-2" /> Download Table as
        CSV
      </button>
    </div>
  );
};
