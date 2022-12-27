import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { some, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCsv,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';

import { formatCurrencyWithUnit } from '#/lib/formatters.js';
import { event } from '#/lib/gtag.js';
import { FaqTerm } from '#/ui/FaqTerm';
import { PrintButton } from '#/ui/PrintButton';
import { ShareButton } from '#/ui/ShareButton';

export const ProjectsTable = ({
  selectedProjects,
  setProjectModalProjects,
  faqs,
  showButtons,
}) => {
  const [sortOrder, setSortOrder] = useState();
  const [sortDirection, setSortDirection] = useState('asc');

  if (!selectedProjects || selectedProjects.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No funded projects meet these criteria.</Alert.Heading>
        <div>Try adjusting search filters.</div>
      </Alert>
    );
  }

  const hasSubcategoryColumn = some(selectedProjects, (project) =>
    Boolean(project.fields.SubcategoryName)
  );

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
      <tr key={project.id}>
        <td className="text-right">{project.fields['Fiscal Year']}</td>
        <td>
          <a
            href=""
            onClick={(event) => {
              event.preventDefault();
              setProjectModalProjects([project]);
            }}
          >
            {project.fields.Name}
          </a>
        </td>
        <td>{project.fields['Grantee Name']}</td>
        <td>{project.fields.ParentCategoryName}</td>
        {hasSubcategoryColumn && <td>{project.fields.SubcategoryName}</td>}
        <td className="text-right" style={{ width: '110px' }}>
          {formatCurrencyWithUnit(project.fields.totalAllocationAmount)}
        </td>
        <td className="text-right" style={{ width: '80px' }}>
          {formatCurrencyWithUnit(project.fields.totalAwardAmount)}
        </td>
        <td className="text-right" style={{ width: '100px' }}>
          {formatCurrencyWithUnit(project.fields.totalExpenditureAmount)}
        </td>
      </tr>
    );
  };

  const csvData = [
    [
      'Project',
      'Category',
      'Subcategory',
      'URL',
      'Total Allocations',
      'Total Awards',
      'Total Expenditures',
    ],
    ...selectedProjects.map((project) => {
      return [
        project.fields.Name,
        project.fields.CategoryName,
        project.fields.SubcategoryName,
        project.fields.URL,
        project.fields.totalAllocationAmount,
        project.fields.totalAwardAmount,
        project.fields.totalExpenditureAmount,
      ];
    }),
  ];

  const totals = selectedProjects.reduce(
    (memo, project) => {
      memo.totalAllocationAmount += project.fields.totalAllocationAmount;
      memo.totalAwardAmount += project.fields.totalAwardAmount;
      memo.totalExpenditureAmount += project.fields.totalExpenditureAmount;
      return memo;
    },
    { totalAllocationAmount: 0, totalAwardAmount: 0, totalExpenditureAmount: 0 }
  );

  let projects = selectedProjects;

  if (sortOrder) {
    if (sortOrder === 'fiscal_year') {
      projects = orderBy(
        selectedProjects,
        (project) => {
          return project.fields['Fiscal Year'] || 0;
        },
        sortDirection
      );
    } else if (sortOrder === 'project_name') {
      projects = orderBy(selectedProjects, 'fields.Name', sortDirection);
    } else if (sortOrder === 'grantee') {
      projects = orderBy(
        selectedProjects,
        'fields.Grantee Name',
        sortDirection
      );
    } else if (sortOrder === 'category') {
      projects = orderBy(
        selectedProjects,
        'fields.ParentCategoryName',
        sortDirection
      );
    } else if (sortOrder === 'subcategory') {
      projects = orderBy(
        selectedProjects,
        (project) => {
          return project.fields.SubcategoryName || 'zzzz';
        },
        sortDirection
      );
    } else if (sortOrder === 'allocations') {
      projects = orderBy(
        selectedProjects,
        'fields.totalAllocationAmount',
        sortDirection
      );
    } else if (sortOrder === 'awards') {
      projects = orderBy(
        selectedProjects,
        'fields.totalAwardAmount',
        sortDirection
      );
    } else if (sortOrder === 'expenditures') {
      projects = orderBy(
        selectedProjects,
        'fields.totalExpenditureAmount',
        sortDirection
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
          className="d-flex justify-content-between align-items-center text-nowrap"
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
            {renderColumnHeader(
              <>
                Fiscal Year
                <FaqTerm
                  id="1293911"
                  term="Fiscal Year"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'fiscal_year'
            )}
            {renderColumnHeader('Project Name', 'project_name')}
            {renderColumnHeader(
              <>
                Grantee
                <FaqTerm
                  id="1293956"
                  term="Grantee"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'grantee'
            )}
            {renderColumnHeader(
              <>
                Category
                <FaqTerm
                  id="1293896"
                  term="Category"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'category'
            )}
            {hasSubcategoryColumn &&
              renderColumnHeader('Subcategory', 'subcategory')}
            {renderColumnHeader(
              <>
                Allocations
                <FaqTerm
                  id="1293891"
                  term="Allocations"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'allocations'
            )}
            {renderColumnHeader(
              <>
                Awards
                <FaqTerm
                  id="1327821"
                  term="Awards"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'awards'
            )}
            {renderColumnHeader(
              <>
                Expenditures
                <FaqTerm
                  id="1327826"
                  term="Expenditures"
                  faqs={faqs}
                  placement="bottom"
                />
              </>,
              'expenditures'
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => renderProjectRow(project))}
          <tr className="table-dark border-top-2">
            <td></td>
            <td>Total</td>
            <td></td>
            <td></td>
            {hasSubcategoryColumn && <td></td>}
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalAllocationAmount)}
            </td>
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalAwardAmount)}
            </td>
            <td className="text-right">
              {formatCurrencyWithUnit(totals.totalExpenditureAmount)}
            </td>
          </tr>
        </tbody>
      </Table>

      {showButtons && (
        <div className="d-flex justify-content-end d-print-none">
          <ShareButton className="btn btn-green mr-2" />
          <PrintButton className="btn btn-green mr-2" />
          <CSVLink
            data={csvData}
            filename={'vta-tax-measures.csv'}
            className="btn btn-green"
            onClick={() =>
              event({
                action: 'click',
                category: 'download',
                label: 'csv',
              })
            }
          >
            <FontAwesomeIcon icon={faFileCsv} className="mr-2" /> Download CSV
          </CSVLink>
        </div>
      )}
    </>
  );
};
