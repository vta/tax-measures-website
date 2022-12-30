'use client';

import Table from 'react-bootstrap/Table';
import { sumBy } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';

export const AllocationsTable = ({ allocations }) => {
  if (allocations.length === 0) {
    return 'None';
  }

  return (
    <Table responsive size="sm" className="small-table">
      <thead>
        <tr>
          <th style={{ width: '33.3%' }}>Fiscal Year</th>
          <th style={{ width: '33.3%' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((allocation) => (
          <tr key={allocation.id}>
            <td>{allocation.fields['Available Start']}</td>
            <td>{formatCurrency(allocation.fields.Amount)}</td>
          </tr>
        ))}
      </tbody>
      {allocations.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <th>{formatCurrency(sumBy(allocations, 'fields.Amount'))}</th>
          </tr>
        </tfoot>
      )}
    </Table>
  );
};
