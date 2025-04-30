'use client';

import dynamic from 'next/dynamic';
import { groupBy } from 'lodash';

import { formatCurrencyWithUnit, formatPercent } from '#/lib/formatters.js';
import { getCurrentFiscalYear, sumCurrency } from '#/lib/util.js';
import { FaqTerm } from '#/ui/FaqTerm';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const HomepageChart = ({
  data: { allocations, parentCategories, faqs },
}) => {
  const actualAllocatedGroups = groupBy(
    allocations,
    (allocation) => allocation.fields.ParentCategoryName,
  );

  const actualAllocateds = parentCategories.map((category) => {
    const group = actualAllocatedGroups[category.fields.Name] || [];

    return group.reduce((memo, allocation) => {
      return memo + allocation.fields.Amount;
    }, 0);
  });

  // If no category.fields['Ballot Allocation'] treat it as the actual allocated
  const remainingAllocateds = parentCategories.map(
    (category, index) =>
      (category.fields['Ballot Allocation'] || actualAllocateds[index]) -
      actualAllocateds[index],
  );
  const total = sumCurrency(
    parentCategories.map(
      (category, index) =>
        category.fields['Ballot Allocation'] || actualAllocateds[index],
    ),
  );

  return (
    <>
      <h2>
        Percentage of Allocation through FY{getCurrentFiscalYear()} vs. Total
        Ballot Allocation
        <FaqTerm
          id="1293971"
          term="Total Ballot Allocation"
          faqs={faqs}
          placement="bottom"
        />
      </h2>
      <div>Total Ballot Allocation: {formatCurrencyWithUnit(total)}</div>
      <Chart
        options={{
          chart: {
            type: 'bar',
            height: 400,
            offsetY: -20,
            stacked: true,
            toolbar: {
              show: false,
            },
          },
          states: {
            hover: {
              filter: {
                type: 'darken',
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          colors: ['#BAD739', '#BDBEBD'],
          dataLabels: {
            enabled: false,
          },
          grid: {
            yaxis: {
              lines: {
                show: false,
              },
            },
            padding: {
              left: 18,
              right: 0,
            },
          },
          xaxis: {
            categories: parentCategories.map((d) => d.fields.Name),
            labels: {
              formatter: formatCurrencyWithUnit,
            },
          },
          yaxis: {
            labels: {
              maxWidth: 220,
              formatter: (value, opt) => {
                let percent;
                if (opt?.dataPointIndex >= 0) {
                  percent = formatPercent(
                    opt.w.globals?.seriesPercent?.[opt.seriesIndex][
                      opt.dataPointIndex
                    ],
                  );
                }
                return `${value} - ${percent}`;
              },
            },
          },
          tooltip: {
            y: {
              formatter: (value, data) => {
                const total =
                  data.series[0][data.dataPointIndex] +
                  data.series[1][data.dataPointIndex];
                const percent = formatPercent(
                  (data.series[data.seriesIndex][data.dataPointIndex] / total) *
                    100,
                );
                return `${formatCurrencyWithUnit(
                  value,
                )} (${percent} of ${formatCurrencyWithUnit(total)})`;
              },
            },
          },
        }}
        series={[
          {
            name: `Actual Allocated through FY${getCurrentFiscalYear()}`,
            data: actualAllocateds,
          },
          {
            name: 'Remaining Ballot Allocation',
            data: remainingAllocateds,
          },
        ]}
        type="bar"
        height={400}
        width="100%"
      />
      <style jsx>{`
        h2 {
          font-size: 1.5rem;
          margin: 0;
        }
      `}</style>
    </>
  );
};
