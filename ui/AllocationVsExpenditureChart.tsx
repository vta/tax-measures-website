'use client';

import dynamic from 'next/dynamic';

import { formatCurrencyWithUnit, formatPercent } from '#/lib/formatters.js';
import { getAllocationById, getExpenditureById } from '#/lib/util.js';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const AllocationVsExpenditureChart = ({
  results,
  allocations,
  expenditures,
}) => {
  const totalAllocations = results.items.reduce((memo, item) => {
    const allocation = getAllocationById(
      item.fields?.Allocation?.[0],
      allocations,
    );
    if (allocation) {
      memo += allocation.fields.Amount;
    }

    return memo;
  }, 0);

  const totalExpenditures = results.items.reduce((memo, item) => {
    for (const expenditureId of item.fields?.Expenditures || []) {
      const expenditure = getExpenditureById(expenditureId, expenditures);
      if (expenditure) {
        memo += expenditure.fields.Amount;
      }
    }

    return memo;
  }, 0);

  return (
    <>
      <h2>Allocation vs Expenditures</h2>
      <Chart
        options={{
          chart: {
            type: 'bar',
            height: 350,
            offsetY: -20,
            stacked: true,
            toolbar: {
              show: false,
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
            categories: [results.categoryCard.key],
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
            name: 'Total Expenditures',
            data: [totalExpenditures],
          },
          {
            name: 'Remaining Allocation',
            data: [totalAllocations],
          },
        ]}
        type="bar"
        height={350}
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
