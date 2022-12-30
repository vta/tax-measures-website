'use client';

import Table from 'react-bootstrap/Table';
import { sumBy } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';

export const ExpendituresTable = ({ expenditures }) => {
  if (expenditures.length === 0) {
    return 'None';
  }

  return (
    <Table responsive size="sm" className="small-table">
      <thead>
        <tr>
          <th style={{ width: '33.3%' }}>Fiscal Year</th>
          <th style={{ width: '33.3%' }}>Amount</th>
          <th style={{ width: '33.3%' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {expenditures.map((expenditure) => (
          <tr key={expenditure.id}>
            <td>{expenditure.fields['Fiscal Year']}</td>
            <td>{formatCurrency(expenditure.fields.Amount)}</td>
            <td>{expenditure.fields['Expenditure Description']}</td>
          </tr>
        ))}
      </tbody>
      {expenditures.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <th>{formatCurrency(sumBy(expenditures, 'fields.Amount'))}</th>
            <th></th>
          </tr>
        </tfoot>
      )}
    </Table>
  );
};
