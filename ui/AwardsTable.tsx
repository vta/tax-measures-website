'use client';

import Table from 'react-bootstrap/Table';
import { sumBy } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';

export const AwardsTable = ({ awards }) => {
  if (awards.length === 0) {
    return 'None';
  }

  return (
    <Table
      responsive
      size="sm"
      className="small-table"
      style={{ width: '300px' }}
    >
      <thead>
        <tr>
          <th style={{ width: '50%' }}>Date</th>
          <th style={{ width: '50%' }} className="text-right">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {awards.map((award) => (
          <tr key={award.id}>
            <td>{award.fields.Date}</td>
            <td className="text-right">
              {formatCurrency(award.fields['Award Amount'])}
            </td>
          </tr>
        ))}
      </tbody>
      {awards.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <th>{formatCurrency(sumBy(awards, 'fields.Award Amount'))}</th>
            <th className="text-right"></th>
          </tr>
        </tfoot>
      )}
    </Table>
  );
};
