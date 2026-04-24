'use client';
import { useState } from 'react';
import Link from 'next/link';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { kebabCase, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCsv,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { formatCurrencyWithUnit } from '#/lib/formatters.js';
import { downloadCsvFromMatrix } from '#/lib/download-csv.js';
import { event } from '#/lib/gtag.js';
import { FaqTerm } from '#/ui/FaqTerm';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';

export const YearProjectsTable = ({ year, tableData, faqs, showButtons }) => {
  const [sortOrder, setSortOrder] = useState('project_name');
  const [sortDirection, setSortDirection] = useState('asc');

  if (!tableData || tableData.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No expenditures for fiscal year {year}.</Alert.Heading>
        <Link href={`/years/`} className="btn btn-primary">
          Try a different fiscal year
        </Link>
      </Alert>
    );
  }

  const setTableSort = (columnName) => {
    if (sortOrder === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder(columnName);
      setSortDirection('asc');
    }
  };

  const renderProjectRow = (project) => {
    return (
      <tr key={project.name}>
        <td>
          <Link href={`/projects/${kebabCase(project.name)}/`}>
            {project.name}
          </Link>
        </td>
        <td>{project.grantee}</td>
        <td>{project.category}</td>
        <td className="text-end" style={{ width: '100px' }}>
          {formatCurrencyWithUnit(project.totalAuditedExpenditureAmountForYear)}
        </td>
      </tr>
    );
  };

  const csvData = [
    ['Project', 'Grantee', 'Category', 'URL', `Total Expenditures FY${year}`],
    ...tableData.map((project) => {
      return [
        project.name,
        project.grantee,
        project.category,
        project.url,
        project.totalAuditedExpenditureAmountForYear,
      ];
    }),
  ];

  const totals = tableData.reduce(
    (memo, row) => {
      memo.totalAuditedExpenditureAmount +=
        row.totalAuditedExpenditureAmountForYear;
      return memo;
    },
    {
      totalAuditedExpenditureAmount: 0,
    },
  );

  let projects = tableData;

  if (sortOrder) {
    if (sortOrder === 'project_name') {
      projects = orderBy(tableData, 'name', sortDirection);
    } else if (sortOrder === 'grantee') {
      projects = orderBy(tableData, 'grantee', sortDirection);
    } else if (sortOrder === 'category') {
      projects = orderBy(tableData, 'category', sortDirection);
    } else if (sortOrder === 'expenditures_for_year') {
      projects = orderBy(
        tableData,
        'totalAuditedExpenditureAmountForYear',
        sortDirection,
      );
    }
  }

  const renderColumnHeader = (columnName, columnId) => {
    let icon = faSort;
    if (columnId === sortOrder) {
      icon = sortDirection === 'asc' ? faSortUp : faSortDown;
    }

    return (
      <th>
        <a
          className="d-flex justify-content-between align-items-center text-nowrap gap-1"
          onClick={() => setTableSort(columnId)}
          title={`Sort by ${columnName}`}
        >
          <span className="d-flex align-items-center">{columnName}</span>
          <FontAwesomeIcon icon={icon} />
        </a>
        <style jsx>{`
          th {
            cursor: pointer;
          }
        `}</style>
      </th>
    );
  };

  return (
    <>
      <Table responsive size="sm" className="project-table">
        <thead>
          <tr>
            {renderColumnHeader('Project Name', 'project_name')}
            {renderColumnHeader(
              <>
                Grantee
                <FaqTerm term="Grantees" faqs={faqs} placement="bottom" />
              </>,
              'grantee',
            )}
            {renderColumnHeader(
              <>
                Category
                <FaqTerm term="Categories" faqs={faqs} placement="bottom" />
              </>,
              'category',
            )}
            {renderColumnHeader(
              <>
                Audited Expenditures for {year}
                <FaqTerm term="Expenditures" faqs={faqs} placement="bottom" />
              </>,
              'expenditures_for_year',
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => renderProjectRow(project))}
          <tr className="table-secondary border-top-2">
            <td>Total</td>
            <td></td>
            <td></td>
            <td className="text-end">
              {formatCurrencyWithUnit(totals.totalAuditedExpenditureAmount)}
            </td>
          </tr>
        </tbody>
      </Table>

      {showButtons && (
        <div className="d-flex justify-content-end d-print-none">
          <ShareButton className="btn btn-green me-2" />
          <PrintButton className="btn btn-green me-2" />
          <button
            type="button"
            className="btn btn-green"
            onClick={() => {
              const filename = `measure-b-projects-fy-${year}.csv`;
              event({
                action: 'click',
                category: 'download',
                label: 'csv',
                value: filename,
              });
              downloadCsvFromMatrix(csvData, filename);
            }}
          >
            <FontAwesomeIcon icon={faFileCsv} className="me-2" /> Download CSV
          </button>
        </div>
      )}
    </>
  );
};
