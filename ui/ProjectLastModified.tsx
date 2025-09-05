'use client';

import moment from 'moment';
import { getLastModified } from '#/lib/util.js';

export const ProjectLastModified = ({
  project,
  allocations,
  awards,
  expenditures,
  auditedExpenditures,
}) => {
  return (
    <div className="py-2">
      <small>
        Last Modified:{' '}
        {moment(
          getLastModified([
            project,
            ...allocations,
            ...awards,
            ...expenditures,
            ...auditedExpenditures,
          ]),
        ).format('MMMM Do YYYY, h:mm a')}
      </small>
    </div>
  );
};
