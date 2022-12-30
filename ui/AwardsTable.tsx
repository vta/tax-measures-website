'use client';

import Table from 'react-bootstrap/Table';
import { sumBy } from 'lodash';

import { formatCurrency } from '#/lib/formatters.js';

export const AwardsTable = ({ awards }) => {
  if (awards.length === 0) {
    return 'None';
  }

  return (
    <Table responsive size="sm" className="small-table">
      <thead>
        <tr>
          <th style={{ width: '33.3%' }}>Date</th>
          <th style={{ width: '66.6%' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {awards.map((award) => (
          <tr key={award.id}>
            <td>{award.fields.Date}</td>
            <td>{formatCurrency(award.fields['Award Amount'])}</td>
          </tr>
        ))}
      </tbody>
      {awards.length > 1 && (
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <th>{formatCurrency(sumBy(awards, 'fields.Award Amount'))}</th>
            <th></th>
          </tr>
        </tfoot>
      )}
    </Table>
  );
};
