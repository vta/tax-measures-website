'use client';

import type { ChangeEvent } from 'react';
import { range } from 'lodash';
import { getCurrentFiscalYear } from '#/lib/util';

function getFiscalYearsList() {
  const currentFiscalYear = getCurrentFiscalYear();
  return range(currentFiscalYear, 2017, -1);
}

export default function FiscalYearSelector({ selectedFiscalYear = '' }) {
  const fiscalYears = getFiscalYearsList();

  const onFiscalYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const fiscalYear = event.target.value;
    window.location.href = `/years/${fiscalYear}`;
  };

  return (
    <div className="row">
      <div className="col-12 col-md-4">
        <label htmlFor="fiscalYear">Fiscal Year</label>
        <select
          className="form-select"
          id="fiscalYear"
          onChange={onFiscalYearChange}
          value={selectedFiscalYear}
        >
          <option value="">Select a fiscal year</option>
          {fiscalYears.map((fiscalYear) => (
            <option key={fiscalYear} value={fiscalYear}>
              {fiscalYear}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
